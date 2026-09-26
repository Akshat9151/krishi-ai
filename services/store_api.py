from fastapi import APIRouter, HTTPException, Query, Depends, Request
from pydantic import BaseModel, Field
from sqlalchemy import func
from sqlalchemy.orm import Session
from typing import List, Optional, Any, Union
import json
import hashlib
import hmac
import secrets
import razorpay
from datetime import date, datetime, timedelta

from backend.database import get_db
from backend.models_store import (
    StoreProduct, ProductCategory, FertilizerRecommendation, StoreOrder, Coupon,
    StoreOrderEvent, RazorpayWebhookEvent,
)
from backend.models import FarmActivity, User
from services.auth import get_current_user
from services.logger import logger
from services.validation import ValidationUtils
from services.config import settings

router = APIRouter(prefix="/api/store", tags=["Store"])

OWNER_STATUSES = ("placed", "accepted", "packed", "picked_up", "out_for_delivery", "delivered", "cancelled")


def _is_shop_authorized(user: User) -> bool:
    if not user:
        return False
    role = (getattr(user, "role", None) or "farmer").lower()
    if role in ("shop_owner", "admin"):
        return True
    identifiers = {
        v.strip().lower()
        for v in settings.SHOP_OWNER_IDENTIFIERS.split(",")
        if v.strip()
    }
    if identifiers and ({str(user.id).lower(), (user.username or "").lower(), (user.email or "").lower(), (getattr(user, "phone", "") or "").lower()} & identifiers):
        return True
    # In single-shop / pilot deployment when SHOP_OWNER_IDENTIFIERS is empty,
    # permit authenticated users to manage shop orders
    if not settings.SHOP_OWNER_IDENTIFIERS:
        return True
    return False


def _is_rider_authorized(user: User) -> bool:
    if not user:
        return False
    role = (getattr(user, "role", None) or "farmer").lower()
    if role in ("rider", "admin"):
        return True
    identifiers = {
        v.strip().lower()
        for v in settings.SHOP_OWNER_IDENTIFIERS.split(",")
        if v.strip()
    }
    if identifiers and ({str(user.id).lower(), (user.username or "").lower(), (user.email or "").lower(), (getattr(user, "phone", "") or "").lower()} & identifiers):
        return True
    if not settings.SHOP_OWNER_IDENTIFIERS:
        return True
    return False


def _require_role(user: User, role: str) -> None:
    if role == "shop_owner" and _is_shop_authorized(user):
        return
    if role == "rider" and _is_rider_authorized(user):
        return
    if (user.role or "farmer") != role:
        raise HTTPException(status_code=403, detail=f"{role.replace('_', ' ').title()} access required")


def _require_coupon_admin(user: User) -> None:
    if (getattr(user, "role", None) or "").lower() == "admin":
        return
    identifiers = {
        value.strip().lower()
        for value in settings.SHOP_OWNER_IDENTIFIERS.split(",")
        if value.strip()
    }
    account_identifiers = {
        str(user.id).lower(),
        (user.username or "").lower(),
        (user.email or "").lower(),
        (getattr(user, "phone", "") or "").lower(),
    }
    if identifiers and identifiers.intersection(account_identifiers):
        return
    raise HTTPException(status_code=403, detail="Coupon administration is restricted to configured owners")


def _load_order_items(items_json: Optional[str]) -> list:
    if not items_json:
        return []
    try:
        items = json.loads(items_json)
    except json.JSONDecodeError:
        return []
    return items if isinstance(items, list) else []


def _razorpay_client():
    if not settings.RAZORPAY_KEY_ID or not settings.RAZORPAY_KEY_SECRET:
        raise HTTPException(status_code=503, detail="Online payments are not configured yet.")
    return razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))


def _verify_signature(order_id: str, payment_id: str, signature: str) -> bool:
    if not settings.RAZORPAY_KEY_SECRET:
        return False
    digest = hmac.new(
        settings.RAZORPAY_KEY_SECRET.encode(),
        f"{order_id}|{payment_id}".encode(),
        hashlib.sha256,
    ).hexdigest()
    return hmac.compare_digest(digest, signature)


def _release_reserved_stock(db: Session, order: StoreOrder) -> None:
    for item in _load_order_items(order.items_json):
        product = db.query(StoreProduct).filter(
            StoreProduct.id == item.get("product_id")
        ).with_for_update().first()
        if product:
            product.stock_quantity += int(item.get("quantity", 0))
            product.in_stock = product.stock_quantity > 0

# Pydantic Models
class ProductResponse(BaseModel):
    id: int
    name: str
    category: str
    subcategory: Optional[str] = None
    description: str
    image_url: str
    price: float
    original_price: Optional[float] = None
    discount_percentage: float = 0.0
    rating: float = 0.0
    reviews_count: int = 0
    in_stock: bool = True
    stock_quantity: int = 0
    badge: Optional[str] = None
    fertilizer_type: Optional[str] = None
    suitable_crops: Optional[Any] = None
    brand: str
    weight: Optional[str] = None
    unit: Optional[str] = None
    sku: str
    product_url: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class CategoryResponse(BaseModel):
    id: int
    name: str
    display_name: str
    icon: str
    image: str
    description: str
    parent_id: Optional[int]
    sort_order: int
    is_active: bool

    class Config:
        from_attributes = True

class FertilizerRecommendationRequest(BaseModel):
    crop: str
    season: Optional[str] = None
    soil_type: Optional[str] = None

class FertilizerRecommendationResponse(BaseModel):
    id: int
    crop_name: str
    fertilizer_type: str
    product: ProductResponse
    recommendation_score: float
    season: Optional[str]
    soil_type: Optional[str]

    class Config:
        from_attributes = True

# Store Endpoints

@router.get("/products", response_model=List[ProductResponse])
async def get_products(
    category: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    min_price: Optional[float] = Query(None),
    max_price: Optional[float] = Query(None),
    fertilizer_type: Optional[str] = Query(None),
    limit: int = Query(50, le=500),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db)
):
    """Get all products with optional filtering"""
    try:
        query = db.query(StoreProduct)
        
        # Apply filters
        if category:
            query = query.filter(StoreProduct.category == category)
        
        if search:
            search_term = f"%{search}%"
            query = query.filter(
                StoreProduct.name.ilike(search_term) |
                StoreProduct.description.ilike(search_term) |
                StoreProduct.brand.ilike(search_term)
            )
        
        if min_price is not None:
            query = query.filter(StoreProduct.price >= min_price)
        
        if max_price is not None:
            query = query.filter(StoreProduct.price <= max_price)
        
        if fertilizer_type:
            query = query.filter(StoreProduct.fertilizer_type == fertilizer_type)
        
        # Apply pagination and ordering
        products = query.order_by(StoreProduct.rating.desc(), StoreProduct.created_at.desc())\
                     .offset(offset).limit(limit).all()
        
        logger.log_api_request(None, user="anonymous")
        return products
        
    except Exception as e:
        logger.log_error(e, "Store API - Get Products")
        raise HTTPException(status_code=500, detail="Failed to fetch products")

@router.get("/products/{product_id}", response_model=ProductResponse)
async def get_product(product_id: int, db: Session = Depends(get_db)):
    """Get single product by ID"""
    try:
        product = db.query(StoreProduct).filter(StoreProduct.id == product_id).first()
        
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        
        # Generate product URL if not exists
        if not product.product_url:
            product.product_url = f"https://krishi-ai-store.com/product/{product.id}"
        
        return product
        
    except HTTPException:
        raise
    except Exception as e:
        logger.log_error(e, "Store API - Get Product")
        raise HTTPException(status_code=500, detail="Failed to fetch product")

@router.get("/categories", response_model=List[CategoryResponse])
async def get_categories(db: Session = Depends(get_db)):
    """Get all product categories"""
    try:
        categories = db.query(ProductCategory)\
                     .filter(ProductCategory.is_active == True)\
                     .order_by(ProductCategory.sort_order)\
                     .all()
        
        logger.log_api_request(None, user="anonymous")
        return categories
        
    except Exception as e:
        logger.log_error(e, "Store API - Get Categories")
        raise HTTPException(status_code=500, detail="Failed to fetch categories")

@router.get("/fertilizers/recommend", response_model=List[FertilizerRecommendationResponse])
async def get_fertilizer_recommendations(
    crop: str = Query(...),
    season: Optional[str] = Query(None),
    soil_type: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """Get fertilizer recommendations for specific crop"""
    try:
        # Validate crop name
        crop = ValidationUtils.validate_crop_name(crop)
        
        # First check for specific recommendations
        recommendations = db.query(FertilizerRecommendation)\
                          .filter(FertilizerRecommendation.crop_name == crop)
        
        if season:
            recommendations = recommendations.filter(FertilizerRecommendation.season == season)
        
        if soil_type:
            recommendations = recommendations.filter(FertilizerRecommendation.soil_type == soil_type)
        
        recommendations = recommendations.order_by(FertilizerRecommendation.recommendation_score.desc())\
                                .limit(10).all()
        
        # Ensure product relationship is loaded
        for rec in recommendations:
            if not rec.product and rec.product_id:
                rec.product = db.query(StoreProduct).filter(StoreProduct.id == rec.product_id).first()

        # If no specific recommendations, get general fertilizer products
        if not recommendations:
            fertilizer_products = db.query(StoreProduct)\
                                 .filter(StoreProduct.category.contains('fertilizer'))\
                                 .order_by(StoreProduct.rating.desc())\
                                 .limit(15).all()
            
            # Convert to recommendation format
            recommendations = []
            for idx, product in enumerate(fertilizer_products, start=1):
                rec = FertilizerRecommendation(
                    id=idx,
                    crop_name=crop,
                    fertilizer_type=product.fertilizer_type or "general",
                    product_id=product.id,
                    recommendation_score=product.rating or 4.5,
                    season=season,
                    soil_type=soil_type
                )
                rec.product = product
                recommendations.append(rec)
        
        # Filter out any recommendation whose product couldn't be loaded
        recommendations = [r for r in recommendations if r.product is not None]
        
        logger.log_ml_prediction(
            "fertilizer_recommendation",
            {"crop": crop, "season": season, "soil_type": soil_type},
            f"Found {len(recommendations)} recommendations"
        )
        
        return recommendations
        
    except HTTPException:
        raise
    except Exception as e:
        logger.log_error(e, "Store API - Fertilizer Recommendations")
        raise HTTPException(status_code=500, detail="Failed to get fertilizer recommendations")

@router.get("/search", response_model=List[ProductResponse])
async def search_products(
    q: str = Query(...),
    category: Optional[str] = Query(None),
    limit: int = Query(20, le=100),
    db: Session = Depends(get_db)
):
    """Search products"""
    try:
        # Validate search query
        if len(q.strip()) < 2:
            raise HTTPException(status_code=400, detail="Search query must be at least 2 characters")
        
        query = db.query(StoreProduct)
        
        # Search in name, description, brand
        search_term = f"%{q}%"
        query = query.filter(
            StoreProduct.name.ilike(search_term) |
            StoreProduct.description.ilike(search_term) |
            StoreProduct.brand.ilike(search_term)
        )
        
        if category:
            query = query.filter(StoreProduct.category == category)
        
        products = query.order_by(StoreProduct.rating.desc())\
                     .limit(limit).all()
        
        logger.log_api_request(None, user="anonymous")
        return products
        
    except HTTPException:
        raise
    except Exception as e:
        logger.log_error(e, "Store API - Search")
        raise HTTPException(status_code=500, detail="Search failed")

@router.get("/featured", response_model=List[ProductResponse])
async def get_featured_products(
    limit: int = Query(10, le=50),
    db: Session = Depends(get_db)
):
    """Get featured products"""
    try:
        products = db.query(StoreProduct)\
                     .filter(StoreProduct.badge.isnot(None))\
                     .order_by(StoreProduct.rating.desc())\
                     .limit(limit).all()
        
        logger.log_api_request(None, user="anonymous")
        return products
        
    except Exception as e:
        logger.log_error(e, "Store API - Featured Products")
        raise HTTPException(status_code=500, detail="Failed to fetch featured products")

@router.get("/deals", response_model=List[ProductResponse])
async def get_deal_products(
    limit: int = Query(10, le=50),
    db: Session = Depends(get_db)
):
    """Get products on sale/deal"""
    try:
        products = db.query(StoreProduct)\
                     .filter(StoreProduct.discount_percentage > 0)\
                     .order_by(StoreProduct.discount_percentage.desc())\
                     .limit(limit).all()
        
        logger.log_api_request(None, user="anonymous")
        return products
        
    except Exception as e:
        logger.log_error(e, "Store API - Deal Products")
        raise HTTPException(status_code=500, detail="Failed to fetch deal products")

# Utility function to generate deep links
def generate_product_deep_link(product_id: int, base_url: str = "https://krishi-ai-store.com") -> str:
    """Generate deep link for product"""
    return f"{base_url}/product/{product_id}?utm_source=app&utm_medium=deep_link"

def generate_fertilizer_search_link(crop: str, base_url: str = "https://krishi-ai-store.com") -> str:
    """Generate search link for fertilizers"""
    from urllib.parse import quote
    return f"{base_url}/search?q=fertilizer&crop={quote(crop)}&utm_source=app&utm_medium=fertilizer_recommendation"

# =========================
# 📦 ORDER ENDPOINTS
# =========================

class OrderItem(BaseModel):
    product_id: int
    quantity: int = Field(..., gt=0, le=1000)

class CreateOrderRequest(BaseModel):
    customer_name: str
    phone: str
    address: str
    items: List[OrderItem]
    payment_method: Optional[str] = "cod"
    coupon_code: Optional[str] = Field(None, max_length=64)

class CreateOrderResponse(BaseModel):
    order_number: str
    status: str
    message: str
    total_amount: float
    subtotal_amount: float
    discount_amount: float
    discount_type: Optional[str] = None
    discount_label: Optional[str] = None
    coupon_code: Optional[str] = None
    commission_amount: float
    dealer_payout_amount: float
    platform_net_amount: float
    created_at: datetime
    items: List[Any] = Field(default_factory=list)
    payment_status: str = "unpaid"
    razorpay_order_id: Optional[str] = None
    razorpay_key_id: Optional[str] = None


class OrderEventResponse(BaseModel):
    event_type: str
    status: str
    message: str
    created_at: datetime


class OrderSummary(BaseModel):
    order_number: str
    customer_name: str
    phone: str
    address: str
    items: List[Any] = Field(default_factory=list)
    status: str
    total_amount: float
    subtotal_amount: float = 0
    discount_amount: float = 0
    discount_type: Optional[str] = None
    discount_label: Optional[str] = None
    coupon_code: Optional[str] = None
    commission_amount: float = 0
    dealer_payout_amount: float = 0
    platform_net_amount: float = 0
    payment_method: str
    payment_status: str = "unpaid"
    razorpay_order_id: Optional[str] = None
    rejection_reason: Optional[str] = None
    rider_id: Optional[int] = None
    created_at: datetime
    events: List[OrderEventResponse] = Field(default_factory=list)


class UpdateOrderStatusRequest(BaseModel):
    status: str
    reason: Optional[str] = None


class ProductUpdateRequest(BaseModel):
    name: Optional[str] = Field(None, min_length=2)
    price: Optional[float] = Field(None, gt=0)
    category: Optional[str] = Field(None, min_length=2)
    stock_quantity: Optional[int] = Field(None, ge=0)

class CouponPreviewRequest(BaseModel):
    items: List[OrderItem]
    coupon_code: Optional[str] = Field(None, max_length=64)


class CouponCreateRequest(BaseModel):
    code: str = Field(..., min_length=3, max_length=64)
    discount_type: str
    discount_value: float = Field(..., gt=0)
    max_discount_amount: Optional[float] = Field(None, gt=0)
    min_order_value: Optional[float] = Field(None, ge=0)
    valid_from: Optional[date] = None
    valid_until: Optional[date] = None
    usage_limit_per_user: int = Field(1, ge=1)
    total_usage_limit: Optional[int] = Field(None, ge=1)
    applies_to: str = Field("all", min_length=1, max_length=100)
    new_users_only: bool = False


def _first_order_discount(db: Session, user_id: int, subtotal: float) -> Optional[dict]:
    prior_order_count = db.query(StoreOrder.id).filter(StoreOrder.user_id == user_id).count()
    discount_percent = float(settings.FIRST_ORDER_DISCOUNT_PERCENT)
    if prior_order_count or discount_percent <= 0:
        return None
    amount = round(subtotal * discount_percent / 100, 2)
    return {
        "discount_amount": min(amount, subtotal),
        "discount_type": "first_order",
        "discount_label": f"First order discount ({discount_percent:g}%)",
        "coupon_id": None,
        "coupon_code": None,
    }


def _calculate_coupon_discount(
    db: Session,
    user: User,
    subtotal: float,
    items: list[dict],
    coupon_code: Optional[str],
    *,
    lock_coupon: bool = False,
) -> dict:
    automatic_discount = _first_order_discount(db, user.id, subtotal)
    if automatic_discount and not (coupon_code and coupon_code.strip()):
        return automatic_discount
    if not coupon_code or not coupon_code.strip():
        return {
            "discount_amount": 0.0,
            "discount_type": None,
            "discount_label": None,
            "coupon_id": None,
            "coupon_code": None,
        }

    normalized_code = coupon_code.strip().upper()
    coupon_query = db.query(Coupon).filter(func.lower(Coupon.code) == normalized_code.lower())
    if lock_coupon:
        coupon_query = coupon_query.with_for_update()
    coupon = coupon_query.first()
    if not coupon or not coupon.is_active:
        raise HTTPException(status_code=400, detail="This coupon is no longer valid")

    today = datetime.utcnow().date()
    if coupon.valid_from and today < coupon.valid_from:
        raise HTTPException(status_code=400, detail="This coupon is not valid yet")
    if coupon.valid_until and today > coupon.valid_until:
        raise HTTPException(status_code=400, detail="This coupon has expired")
    if coupon.min_order_value is not None and subtotal < float(coupon.min_order_value):
        raise HTTPException(status_code=400, detail=f"Minimum order value of ₹{coupon.min_order_value:g} not met")

    user_order_count = db.query(StoreOrder.id).filter(StoreOrder.user_id == user.id).count()
    if coupon.new_users_only and user_order_count:
        raise HTTPException(status_code=400, detail="This coupon is only for new users with no previous orders")

    active_redemptions = db.query(StoreOrder.id).filter(
        StoreOrder.coupon_id == coupon.id,
        StoreOrder.status.notin_(("cancelled", "payment_failed")),
    )
    user_redemption_count = active_redemptions.filter(StoreOrder.user_id == user.id).count()
    if user_redemption_count >= coupon.usage_limit_per_user:
        raise HTTPException(status_code=400, detail="You've already used this coupon")

    total_redemption_count = active_redemptions.count()
    if coupon.total_usage_limit is not None and total_redemption_count >= coupon.total_usage_limit:
        raise HTTPException(status_code=400, detail="This coupon has reached its usage limit")

    applies_to = (coupon.applies_to or "all").strip().lower()
    eligible_subtotal = subtotal if applies_to == "all" else round(sum(
        float(item["line_total"])
        for item in items
        if str(item.get("category", "")).strip().lower() == applies_to
    ), 2)
    if eligible_subtotal <= 0:
        raise HTTPException(status_code=400, detail="This coupon does not apply to items in your cart")

    if coupon.discount_type == "percentage":
        amount = eligible_subtotal * float(coupon.discount_value) / 100
        if coupon.max_discount_amount is not None:
            amount = min(amount, float(coupon.max_discount_amount))
    else:
        amount = min(eligible_subtotal, float(coupon.discount_value))
    amount = round(min(amount, eligible_subtotal), 2)
    return {
        "discount_amount": amount,
        "discount_type": coupon.discount_type,
        "discount_label": f"Coupon {coupon.code}",
        "coupon_id": coupon.id,
        "coupon_code": coupon.code,
    }


def _coupon_preview_data(db: Session, user: User, requested_items: List[OrderItem], coupon_code: Optional[str]) -> dict:
    if not requested_items:
        raise HTTPException(status_code=422, detail="Your cart must contain at least one item")
    product_ids = list({item.product_id for item in requested_items})
    products = db.query(StoreProduct).filter(StoreProduct.id.in_(product_ids)).all()
    products_by_id = {product.id: product for product in products}
    if len(products_by_id) != len(product_ids):
        raise HTTPException(status_code=422, detail="One or more products are no longer available")

    subtotal = 0.0
    preview_items = []
    for item in requested_items:
        product = products_by_id[item.product_id]
        line_total = round(float(product.price) * item.quantity, 2)
        subtotal = round(subtotal + line_total, 2)
        preview_items.append({"line_total": line_total, "category": product.category})
    discount = _calculate_coupon_discount(db, user, subtotal, preview_items, coupon_code)
    discount_amount = discount["discount_amount"]
    commission = round(subtotal * float(settings.COMMISSION_PERCENT) / 100, 2)
    return {
        "subtotal_amount": subtotal,
        **discount,
        "total_amount": round(subtotal - discount_amount, 2),
        "commission_amount": commission,
        "dealer_payout_amount": round(subtotal - commission, 2),
        "platform_net_amount": round(commission - discount_amount, 2),
    }


@router.post("/coupons/preview")
async def preview_coupon(
    preview: CouponPreviewRequest,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    user = db.query(User).filter(User.username == current_user).first()
    if not user:
        raise HTTPException(status_code=401, detail="Sign in again to use coupons")
    return _coupon_preview_data(db, user, preview.items, preview.coupon_code)


@router.get("/owner/coupons")
async def get_owner_coupons(
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    user = db.query(User).filter(User.username == current_user).first()
    if not user:
        raise HTTPException(status_code=401, detail="Sign in again to manage coupons")
    _require_coupon_admin(user)
    return db.query(Coupon).order_by(Coupon.created_at.desc()).all()


@router.post("/owner/coupons")
async def create_owner_coupon(
    coupon_data: CouponCreateRequest,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    user = db.query(User).filter(User.username == current_user).first()
    if not user:
        raise HTTPException(status_code=401, detail="Sign in again to manage coupons")
    _require_coupon_admin(user)
    normalized_code = coupon_data.code.strip().upper()
    if not normalized_code:
        raise HTTPException(status_code=422, detail="Coupon code cannot be empty")
    discount_type = coupon_data.discount_type.strip().lower()
    if discount_type not in {"percentage", "flat_amount"}:
        raise HTTPException(status_code=422, detail="Discount type must be percentage or flat_amount")
    if discount_type == "percentage" and coupon_data.discount_value > 100:
        raise HTTPException(status_code=422, detail="Percentage discount cannot exceed 100")
    if coupon_data.valid_from and coupon_data.valid_until and coupon_data.valid_until < coupon_data.valid_from:
        raise HTTPException(status_code=422, detail="Coupon end date must be on or after its start date")
    existing = db.query(Coupon.id).filter(func.lower(Coupon.code) == normalized_code.lower()).first()
    if existing:
        raise HTTPException(status_code=409, detail="A coupon with this code already exists")

    coupon = Coupon(
        code=normalized_code,
        discount_type=discount_type,
        discount_value=coupon_data.discount_value,
        max_discount_amount=coupon_data.max_discount_amount,
        min_order_value=coupon_data.min_order_value,
        valid_from=coupon_data.valid_from,
        valid_until=coupon_data.valid_until,
        usage_limit_per_user=coupon_data.usage_limit_per_user,
        total_usage_limit=coupon_data.total_usage_limit,
        applies_to=coupon_data.applies_to.strip() or "all",
        new_users_only=coupon_data.new_users_only,
        is_active=True,
    )
    db.add(coupon)
    try:
        db.commit()
    except Exception as exc:
        db.rollback()
        logger.log_error(exc, "Store API - Create Coupon")
        raise HTTPException(status_code=409, detail="Could not create coupon; the code may already exist")
    db.refresh(coupon)
    return coupon


class PaymentVerificationRequest(BaseModel):
    razorpay_payment_id: str = Field(..., min_length=5)
    razorpay_order_id: str = Field(..., min_length=5)
    razorpay_signature: str = Field(..., min_length=10)


def _order_summary(db: Session, order: StoreOrder) -> dict:
    events = db.query(StoreOrderEvent).filter(
        StoreOrderEvent.order_id == order.id
    ).order_by(StoreOrderEvent.created_at.asc()).all()
    return {
        "order_number": order.order_number,
        "customer_name": order.customer_name,
        "phone": order.phone,
        "address": order.address,
        "items": _load_order_items(order.items_json),
        "status": order.status,
        "total_amount": order.total_amount,
        "subtotal_amount": order.subtotal_amount,
        "discount_amount": order.discount_amount,
        "discount_type": order.discount_type,
        "discount_label": order.discount_label,
        "coupon_code": order.coupon_code,
        "commission_amount": order.commission_amount,
        "dealer_payout_amount": order.dealer_payout_amount,
        "platform_net_amount": order.platform_net_amount,
        "payment_method": order.payment_method,
        "payment_status": order.payment_status,
        "razorpay_order_id": order.razorpay_order_id,
        "rejection_reason": order.rejection_reason,
        "rider_id": order.rider_id,
        "created_at": order.created_at,
        "events": [
            {
                "event_type": event.event_type,
                "status": event.status,
                "message": event.message,
                "created_at": event.created_at,
            }
            for event in events
        ],
    }

@router.post("/orders", response_model=CreateOrderResponse)
async def create_store_order(
    order_data: CreateOrderRequest,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    """Create an authenticated order using server-side price snapshots."""
    try:
        import time
        user = db.query(User).filter(User.username == current_user).with_for_update().first()
        if not user:
            raise HTTPException(status_code=401, detail="Sign in again to place an order")

        if not order_data.items:
            raise HTTPException(status_code=422, detail="Your cart must contain at least one item")

        payment_method = (order_data.payment_method or "cod").strip().lower()
        if payment_method not in {"cod", "online"}:
            raise HTTPException(status_code=422, detail="Unsupported payment method")

        product_ids = [item.product_id for item in order_data.items]
        products = db.query(StoreProduct).filter(StoreProduct.id.in_(product_ids)).with_for_update().all()
        products_by_id = {product.id: product for product in products}
        if len(products_by_id) != len(set(product_ids)):
            raise HTTPException(status_code=422, detail="One or more products are no longer available")

        snapshot_items = []
        subtotal_amount = 0.0
        for item in order_data.items:
            product = products_by_id[item.product_id]
            if product.stock_quantity <= 0:
                raise HTTPException(status_code=409, detail=f"{product.name} is currently out of stock")
            if product.stock_quantity < item.quantity:
                raise HTTPException(status_code=409, detail=f"Only {product.stock_quantity} units of {product.name} are available")
            unit_price = round(float(product.price), 2)
            line_total = round(unit_price * item.quantity, 2)
            subtotal_amount = round(subtotal_amount + line_total, 2)
            snapshot_items.append({
                "product_id": product.id,
                "sku": product.sku,
                "name": product.name,
                "category": product.category,
                "price": unit_price,
                "quantity": item.quantity,
                "line_total": line_total,
            })
            product.stock_quantity -= item.quantity
            product.in_stock = product.stock_quantity > 0

        discount = _calculate_coupon_discount(
            db,
            user,
            subtotal_amount,
            snapshot_items,
            order_data.coupon_code,
            lock_coupon=True,
        )
        discount_amount = discount["discount_amount"]
        total_amount = round(subtotal_amount - discount_amount, 2)
        commission_amount = round(subtotal_amount * float(settings.COMMISSION_PERCENT) / 100, 2)
        dealer_payout_amount = round(subtotal_amount - commission_amount, 2)
        platform_net_amount = round(commission_amount - discount_amount, 2)

        order_num = f"ORD{int(time.time() * 1000)}{secrets.token_hex(2).upper()}"
        shop_owner_ids = {product.shop_owner_id for product in products if product.shop_owner_id}
        shop_owner_id = shop_owner_ids.pop() if len(shop_owner_ids) == 1 else None
        store_order = StoreOrder(
            order_number=order_num,
            user_id=user.id,
            customer_name=order_data.customer_name,
            phone=order_data.phone,
            address=order_data.address,
            items_json=json.dumps(snapshot_items, ensure_ascii=False),
            total_amount=total_amount,
            subtotal_amount=subtotal_amount,
            discount_amount=discount_amount,
            discount_type=discount["discount_type"],
            discount_label=discount["discount_label"],
            coupon_id=discount["coupon_id"],
            coupon_code=discount["coupon_code"],
            commission_amount=commission_amount,
            dealer_payout_amount=dealer_payout_amount,
            platform_net_amount=platform_net_amount,
            status="payment_pending" if payment_method == "online" else "confirmed",
            payment_method=payment_method,
            payment_status="created" if payment_method == "online" else "unpaid",
            shop_id=shop_owner_id,
            shop_owner_id=shop_owner_id,
        )
        db.add(store_order)
        db.flush()
        db.refresh(store_order)
        razorpay_order_id = None
        if payment_method == "online":
            try:
                gateway_order = _razorpay_client().order.create({
                    "amount": int(round(total_amount * 100)),
                    "currency": "INR",
                    "receipt": order_num,
                    "notes": {"khetitak_order": order_num},
                })
                razorpay_order_id = gateway_order["id"]
                store_order.razorpay_order_id = razorpay_order_id
            except HTTPException:
                raise
            except Exception as exc:
                logger.log_error(exc, "Razorpay order creation")
                raise HTTPException(status_code=502, detail="Unable to start online payment. Please try again.")
        db.add(StoreOrderEvent(
            order_id=store_order.id,
            event_type="order_created",
            status=store_order.status,
            message="Order created; awaiting online payment" if payment_method == "online" else "Order placed successfully",
        ))
        db.add(FarmActivity(
            username=current_user,
            activity_type="order_placed",
            title=f"Order placed: {order_num}",
            details=f"{len(snapshot_items)} product line(s) • ₹{total_amount:.2f}",
        ))
        db.commit()
        
        return CreateOrderResponse(
            order_number=store_order.order_number,
            status=store_order.status,
            message="Order placed successfully! ✅",
            total_amount=store_order.total_amount,
            subtotal_amount=store_order.subtotal_amount,
            discount_amount=store_order.discount_amount,
            discount_type=store_order.discount_type,
            discount_label=store_order.discount_label,
            coupon_code=store_order.coupon_code,
            commission_amount=store_order.commission_amount,
            dealer_payout_amount=store_order.dealer_payout_amount,
            platform_net_amount=store_order.platform_net_amount,
            created_at=store_order.created_at,
            items=snapshot_items,
            payment_status=store_order.payment_status,
            razorpay_order_id=razorpay_order_id,
            razorpay_key_id=settings.RAZORPAY_KEY_ID if payment_method == "online" else None,
        )
    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        logger.log_error(e, "Store API - Create Order")
        raise HTTPException(status_code=500, detail=f"Failed to place order: {str(e)}")


@router.post("/orders/{order_number}/payment/verify")
async def verify_order_payment(
    order_number: str,
    payment_data: PaymentVerificationRequest,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    """Verify Razorpay's signature before confirming an online order."""
    user = db.query(User).filter(User.username == current_user).first()
    order = db.query(StoreOrder).filter(
        StoreOrder.order_number == order_number,
        StoreOrder.user_id == (user.id if user else -1),
    ).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if order.payment_method != "online":
        raise HTTPException(status_code=400, detail="This order does not use online payment")
    if order.razorpay_order_id != payment_data.razorpay_order_id:
        raise HTTPException(status_code=400, detail="Payment order does not match this order")
    if not _verify_signature(
        payment_data.razorpay_order_id,
        payment_data.razorpay_payment_id,
        payment_data.razorpay_signature,
    ):
        logger.log_api_request(None, user="razorpay_signature_invalid")
        raise HTTPException(status_code=400, detail="Payment verification failed")

    if order.payment_status == "paid":
        return {"verified": True, "order_number": order.order_number, "payment_status": "paid"}

    order.razorpay_payment_id = payment_data.razorpay_payment_id
    order.razorpay_signature = payment_data.razorpay_signature
    order.payment_status = "paid"
    order.status = "confirmed"
    db.add(StoreOrderEvent(
        order_id=order.id,
        event_type="payment_verified",
        status=order.status,
        message="Online payment verified successfully",
    ))
    db.commit()
    return {"verified": True, "order_number": order.order_number, "payment_status": order.payment_status}


@router.post("/webhooks/razorpay")
async def razorpay_webhook(request: Request, db: Session = Depends(get_db)):
    """Handle signed, idempotent Razorpay payment events."""
    if not settings.RAZORPAY_WEBHOOK_SECRET:
        raise HTTPException(status_code=503, detail="Payment webhook is not configured")
    body = await request.body()
    signature = request.headers.get("X-Razorpay-Signature", "")
    expected = hmac.new(
        settings.RAZORPAY_WEBHOOK_SECRET.encode(),
        body,
        hashlib.sha256,
    ).hexdigest()
    if not signature or not hmac.compare_digest(expected, signature):
        raise HTTPException(status_code=400, detail="Invalid webhook signature")

    try:
        payload = json.loads(body)
        event_type = str(payload.get("event", "unknown"))
        event_id = request.headers.get("X-Razorpay-Event-Id") or hashlib.sha256(body).hexdigest()
        if db.query(RazorpayWebhookEvent).filter(RazorpayWebhookEvent.event_id == event_id).first():
            return {"received": True, "duplicate": True}

        payment_entity = ((payload.get("payload") or {}).get("payment") or {}).get("entity") or {}
        razorpay_order_id = payment_entity.get("order_id")
        order = db.query(StoreOrder).filter(
            StoreOrder.razorpay_order_id == razorpay_order_id
        ).first() if razorpay_order_id else None
        db.add(RazorpayWebhookEvent(event_id=event_id, event_type=event_type))

        if order:
            if event_type in {"payment.captured", "order.paid"}:
                order.payment_status = "paid"
                order.status = "confirmed"
                if payment_entity.get("id") and not order.razorpay_payment_id:
                    order.razorpay_payment_id = payment_entity["id"]
            elif event_type in {"payment.failed", "payment.cancelled"} and order.payment_status != "paid":
                if order.payment_status not in {"failed", "cancelled"}:
                    _release_reserved_stock(db, order)
                    order.payment_status = "failed" if event_type == "payment.failed" else "cancelled"
                    order.status = "payment_failed" if event_type == "payment.failed" else "cancelled"
            db.add(StoreOrderEvent(
                order_id=order.id,
                event_type=f"webhook:{event_type}",
                status=order.status,
                message=f"Razorpay event received: {event_type}",
            ))
        db.commit()
        return {"received": True}
    except HTTPException:
        db.rollback()
        raise
    except Exception as exc:
        db.rollback()
        logger.log_error(exc, "Razorpay webhook")
        raise HTTPException(status_code=500, detail="Webhook processing failed")


@router.get("/orders", response_model=List[OrderSummary])
async def get_my_orders(
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    """Return only orders owned by the authenticated farmer."""
    user = db.query(User).filter(User.username == current_user).first()
    if not user:
        raise HTTPException(status_code=401, detail="Sign in again to view your orders")
    orders = db.query(StoreOrder).filter(StoreOrder.user_id == user.id).order_by(
        StoreOrder.created_at.desc()
    ).all()
    result = []
    for order in orders:
        events = db.query(StoreOrderEvent).filter(
            StoreOrderEvent.order_id == order.id
        ).order_by(StoreOrderEvent.created_at.asc()).all()
        result.append({
            "order_number": order.order_number,
            "customer_name": order.customer_name,
            "phone": order.phone,
            "address": order.address,
            "items": _load_order_items(order.items_json),
            "status": order.status,
            "total_amount": order.total_amount,
            "subtotal_amount": order.subtotal_amount,
            "discount_amount": order.discount_amount,
            "discount_type": order.discount_type,
            "discount_label": order.discount_label,
            "coupon_code": order.coupon_code,
            "commission_amount": order.commission_amount,
            "dealer_payout_amount": order.dealer_payout_amount,
            "platform_net_amount": order.platform_net_amount,
            "payment_method": order.payment_method,
            "created_at": order.created_at,
            "events": [
                {
                    "event_type": event.event_type,
                    "status": event.status,
                    "message": event.message,
                    "created_at": event.created_at,
                }
                for event in events
            ],
        })
    return result


@router.get("/owner/orders", response_model=List[OrderSummary])
async def get_owner_orders_legacy(
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    """Return incoming orders to the configured single-shop owner."""
    user = db.query(User).filter(User.username == current_user).first()
    if not user:
        raise HTTPException(status_code=401, detail="Sign in again")
    _require_role(user, "shop_owner")
    orders = db.query(StoreOrder).filter(
        (StoreOrder.shop_owner_id == user.id) | StoreOrder.shop_owner_id.is_(None)
    ).order_by(StoreOrder.created_at.desc()).all()
    return [_order_summary(db, order) for order in orders]


@router.patch("/owner/orders/{order_number}/status", response_model=OrderSummary)
async def update_shop_order_status(
    order_number: str,
    status_data: UpdateOrderStatusRequest,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    """Advance one pilot order through the shop's operational statuses."""
    user = db.query(User).filter(User.username == current_user).first()
    if not user:
        raise HTTPException(status_code=401, detail="Sign in again")
    _require_role(user, "shop_owner")
    new_status = status_data.status.strip().lower()
    if new_status not in OWNER_STATUSES:
        raise HTTPException(status_code=422, detail="Unsupported order status")
    order = db.query(StoreOrder).filter(
        StoreOrder.order_number == order_number,
        (StoreOrder.shop_owner_id == user.id) | StoreOrder.shop_owner_id.is_(None),
    ).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if order.status == new_status:
        return _order_summary(db, order)
    if order.status == "cancelled" or order.status == "delivered":
        raise HTTPException(status_code=409, detail="This order can no longer change status")
    allowed_next = {
        "confirmed": {"accepted", "cancelled"},
        "placed": {"accepted", "cancelled"},
        "accepted": {"packed", "cancelled"},
        "packed": {"out_for_delivery"},
        "out_for_delivery": {"delivered"},
    }
    if new_status not in allowed_next.get(order.status, set()):
        raise HTTPException(status_code=409, detail=f"Cannot move order from {order.status} to {new_status}")
    if new_status == "cancelled":
        for item in _load_order_items(order.items_json):
            product = db.query(StoreProduct).filter(StoreProduct.id == item["product_id"]).with_for_update().first()
            if product:
                product.stock_quantity += int(item["quantity"])
                product.in_stock = product.stock_quantity > 0
    order.status = new_status
    if new_status == "cancelled":
        order.rejection_reason = status_data.reason or "Rejected by shop"
    db.add(StoreOrderEvent(
        order_id=order.id,
        event_type="order_status_changed",
        status=new_status,
        message=f"Order status changed to {new_status}",
    ))
    db.commit()
    db.refresh(order)
    return _order_summary(db, order)


@router.get("/owner/products", response_model=List[ProductResponse])
async def get_shop_products(
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    user = db.query(User).filter(User.username == current_user).first()
    if not user:
        raise HTTPException(status_code=401, detail="Sign in again")
    _require_role(user, "shop_owner")
    return db.query(StoreProduct).order_by(StoreProduct.name.asc()).all()


@router.patch("/owner/products/{product_id}", response_model=ProductResponse)
async def update_shop_product(
    product_id: int,
    update: ProductUpdateRequest,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    user = db.query(User).filter(User.username == current_user).first()
    if not user:
        raise HTTPException(status_code=401, detail="Sign in again")
    _require_role(user, "shop_owner")
    product = db.query(StoreProduct).filter(StoreProduct.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    for field in ("name", "price", "category", "stock_quantity"):
        value = getattr(update, field)
        if value is not None:
            setattr(product, field, value)
    product.in_stock = product.stock_quantity > 0
    db.commit()
    db.refresh(product)
    return product


@router.get("/owner/earnings")
async def get_shop_earnings(
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    user = db.query(User).filter(User.username == current_user).first()
    if not user:
        raise HTTPException(status_code=401, detail="Sign in again")
    _require_role(user, "shop_owner")
    month_start = datetime.utcnow().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    orders = db.query(StoreOrder).filter(
        StoreOrder.created_at >= month_start,
        StoreOrder.status != "cancelled",
    ).all()
    return {
        "order_count": len(orders),
        "order_value": round(sum(order.dealer_payout_amount or 0 for order in orders), 2),
    }


@router.get("/rider/orders", response_model=List[OrderSummary])
async def get_rider_orders(
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    rider = db.query(User).filter(User.username == current_user).first()
    if not rider:
        raise HTTPException(status_code=401, detail="Sign in again")
    _require_role(rider, "rider")
    orders = db.query(StoreOrder).filter(
        ((StoreOrder.status.in_(["accepted", "packed"])) & StoreOrder.rider_id.is_(None))
        | (StoreOrder.rider_id == rider.id),
    ).order_by(StoreOrder.created_at.asc()).all()
    return [_order_summary(db, order) for order in orders]


@router.post("/rider/orders/{order_number}/claim", response_model=OrderSummary)
async def claim_rider_order(
    order_number: str,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    rider = db.query(User).filter(User.username == current_user).first()
    if not rider:
        raise HTTPException(status_code=401, detail="Sign in again")
    _require_role(rider, "rider")
    order = db.query(StoreOrder).filter(StoreOrder.order_number == order_number).with_for_update().first()
    if not order or order.rider_id is not None or order.status not in {"accepted", "packed"}:
        raise HTTPException(status_code=409, detail="Order is no longer available for delivery")
    order.rider_id = rider.id
    order.status = "picked_up" if order.status == "packed" else "accepted"
    db.add(StoreOrderEvent(order_id=order.id, event_type="delivery_claimed", status=order.status, message="Rider claimed delivery"))
    db.commit()
    db.refresh(order)
    return _order_summary(db, order)


@router.get("/rider/deliveries", response_model=List[OrderSummary])
async def get_rider_deliveries(
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    rider = db.query(User).filter(User.username == current_user).first()
    if not rider:
        raise HTTPException(status_code=401, detail="Sign in again")
    _require_role(rider, "rider")
    return [_order_summary(db, order) for order in db.query(StoreOrder).filter(
        StoreOrder.rider_id == rider.id,
        StoreOrder.status == "delivered",
    ).order_by(StoreOrder.created_at.desc()).all()]


@router.get("/rider/earnings")
async def get_rider_earnings(
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    rider = db.query(User).filter(User.username == current_user).first()
    if not rider:
        raise HTTPException(status_code=401, detail="Sign in again")
    _require_role(rider, "rider")
    completed = db.query(StoreOrder).filter(
        StoreOrder.rider_id == rider.id,
        StoreOrder.status == "delivered",
    ).count()
    return {"completed_deliveries": completed, "earning_per_delivery": 20, "total_earning": completed * 20}


@router.patch("/rider/orders/{order_number}/status", response_model=OrderSummary)
async def update_rider_status(
    order_number: str,
    status_data: UpdateOrderStatusRequest,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    rider = db.query(User).filter(User.username == current_user).first()
    if not rider:
        raise HTTPException(status_code=401, detail="Sign in again")
    _require_role(rider, "rider")
    order = db.query(StoreOrder).filter(StoreOrder.order_number == order_number, StoreOrder.rider_id == rider.id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Assigned delivery not found")
    new_status = status_data.status.strip().lower()
    allowed = {"accepted": {"picked_up"}, "picked_up": {"out_for_delivery"}, "out_for_delivery": {"delivered"}}
    if new_status not in allowed.get(order.status, set()):
        raise HTTPException(status_code=409, detail=f"Cannot move delivery from {order.status} to {new_status}")
    order.status = new_status
    db.add(StoreOrderEvent(order_id=order.id, event_type="delivery_status_changed", status=new_status, message=f"Rider updated status to {new_status}"))
    db.commit()
    db.refresh(order)
    return _order_summary(db, order)


@router.post("/orders/{order_number}/cancel", response_model=OrderSummary)
async def cancel_order(
    order_number: str,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    """Cancel an owned order before dealer dispatch."""
    user = db.query(User).filter(User.username == current_user).first()
    if not user:
        raise HTTPException(status_code=404, detail="Order not found")
    order = db.query(StoreOrder).filter(
        StoreOrder.order_number == order_number,
        StoreOrder.user_id == user.id,
    ).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if order.payment_status == "paid":
        raise HTTPException(status_code=409, detail="A paid order cannot be cancelled here")
    if order.status.lower() not in {"confirmed", "processing", "placed", "payment_pending"}:
        raise HTTPException(status_code=409, detail="This order can no longer be cancelled")

    for item in _load_order_items(order.items_json):
        product = db.query(StoreProduct).filter(StoreProduct.id == item["product_id"]).with_for_update().first()
        if product:
            product.stock_quantity += int(item["quantity"])
            product.in_stock = product.stock_quantity > 0
    order.status = "cancelled"
    if order.payment_method.lower() == "online":
        order.payment_status = "cancelled"
    db.add(StoreOrderEvent(
        order_id=order.id,
        event_type="order_cancelled",
        status="cancelled",
        message="Order cancelled before dispatch",
    ))
    db.add(FarmActivity(
        username=current_user,
        activity_type="order_cancelled",
        title=f"Order cancelled: {order.order_number}",
        details="COD order cancelled before dispatch",
    ))
    db.commit()
    db.refresh(order)
    events = db.query(StoreOrderEvent).filter(
        StoreOrderEvent.order_id == order.id
    ).order_by(StoreOrderEvent.created_at.asc()).all()
    return {
        "order_number": order.order_number,
        "customer_name": order.customer_name,
        "phone": order.phone,
        "address": order.address,
        "items": _load_order_items(order.items_json),
        "status": order.status,
        "total_amount": order.total_amount,
        "payment_method": order.payment_method,
        "created_at": order.created_at,
        "events": [
            {
                "event_type": event.event_type,
                "status": event.status,
                "message": event.message,
                "created_at": event.created_at,
            }
            for event in events
        ],
    }

@router.get("/orders/{order_number}")
async def get_order_details(
    order_number: str,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    """Get order details by order number with real status progression and partner details"""
    try:
        import json
        user = db.query(User).filter(User.username == current_user).first()
        order = db.query(StoreOrder).filter(StoreOrder.order_number == order_number).first()
        if not order or not user:
            raise HTTPException(status_code=404, detail="Order not found")
        
        user_role = getattr(user, "role", "farmer") or "farmer"
        # Access control: Farmer owner, or shop_owner, or rider
        if user_role == "farmer" and order.user_id != user.id:
            raise HTTPException(status_code=404, detail="Order not found")
        
        items = _load_order_items(order.items_json)
        
        rider_name = None
        rider_phone = None
        if order.rider_id:
            rider_user = db.query(User).filter(User.id == order.rider_id).first()
            if rider_user:
                rider_name = rider_user.username
                rider_phone = rider_user.phone
                
        events = db.query(StoreOrderEvent).filter(
            StoreOrderEvent.order_id == order.id
        ).order_by(StoreOrderEvent.created_at.asc()).all()

        return {
            "order_number": order.order_number,
            "customer_name": order.customer_name,
            "phone": order.phone,
            "address": order.address,
            "items": items,
            "total_amount": order.total_amount,
            "status": order.status,
            "payment_method": order.payment_method,
            "shop_id": order.shop_id or getattr(order, "shop_owner_id", None),
            "rider_id": order.rider_id,
            "rider_name": rider_name,
            "rider_phone": rider_phone,
            "shop_notes": order.shop_notes,
            "created_at": order.created_at.isoformat() if order.created_at else None,
            "delivered_at": order.delivered_at.isoformat() if order.delivered_at else None,
            "events": [
                {
                    "event_type": event.event_type,
                    "status": event.status,
                    "message": event.message,
                    "created_at": event.created_at.isoformat() if event.created_at else None,
                }
                for event in events
            ]
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.log_error(e, "Store API - Get Order")
        raise HTTPException(status_code=500, detail="Failed to fetch order")


# =========================================================================
# 🏪 SHOP / AGENCY DASHBOARD ENDPOINTS (Zomato/Swiggy UX Pattern)
# =========================================================================

class ShopOrderActionRequest(BaseModel):
    action: str  # "accept", "ready", "reject"
    notes: Optional[str] = None

class UpdateStockRequest(BaseModel):
    in_stock: Optional[bool] = None
    price: Optional[float] = None

@router.get("/shop/orders")
async def get_shop_orders(
    status_filter: Optional[str] = Query("all", alias="status"),
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    """Retrieve orders for the Shop / Agency partner queue"""
    import json
    user = db.query(User).filter(User.username == current_user).first()
    if not _is_shop_authorized(user):
        raise HTTPException(status_code=403, detail="Access denied. Shop/Agency Partner account required.")

    query = db.query(StoreOrder)
    
    # Filter by shop if assigned, or show unassigned orders available for fulfillment
    query = query.filter(
        (StoreOrder.shop_id == user.id) |
        (StoreOrder.shop_owner_id == user.id) |
        (StoreOrder.shop_id.is_(None)) |
        (StoreOrder.shop_owner_id.is_(None))
    )
    
    if status_filter == "new":
        query = query.filter(StoreOrder.status.in_(["confirmed", "placed"]))
    elif status_filter == "preparing":
        query = query.filter(StoreOrder.status == "preparing")
    elif status_filter == "ready":
        query = query.filter(StoreOrder.status.in_(["ready_for_pickup", "picked_up", "out_for_delivery"]))
    elif status_filter == "completed":
        query = query.filter(StoreOrder.status == "delivered")
    elif status_filter == "cancelled":
        query = query.filter(StoreOrder.status == "cancelled")

    orders = query.order_by(StoreOrder.created_at.desc()).limit(100).all()
    
    results = []
    for o in orders:
        items = []
        if o.items_json:
            try:
                items = json.loads(o.items_json)
            except:
                pass
        
        # Check if rider assigned
        rider_info = None
        if o.rider_id:
            rider_u = db.query(User).filter(User.id == o.rider_id).first()
            if rider_u:
                rider_info = {"id": rider_u.id, "username": rider_u.username, "phone": rider_u.phone}

        results.append({
            "id": o.id,
            "order_number": o.order_number,
            "customer_name": o.customer_name,
            "phone": o.phone,
            "address": o.address,
            "items": items,
            "items_count": sum(it.get("quantity", 1) for it in items),
            "total_amount": o.total_amount,
            "subtotal_amount": o.subtotal_amount,
            "discount_amount": o.discount_amount,
            "discount_label": o.discount_label,
            "dealer_payout_amount": o.dealer_payout_amount,
            "commission_amount": o.commission_amount,
            "platform_net_amount": o.platform_net_amount,
            "status": o.status,
            "payment_method": o.payment_method,
            "shop_id": o.shop_id,
            "rider_id": o.rider_id,
            "rider": rider_info,
            "shop_notes": o.shop_notes,
            "cancellation_reason": o.cancellation_reason,
            "created_at": o.created_at.isoformat() if o.created_at else None,
            "delivered_at": o.delivered_at.isoformat() if o.delivered_at else None,
        })
    return results


@router.post("/shop/orders/{order_number}/action")
async def shop_order_action(
    order_number: str,
    action_data: ShopOrderActionRequest,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    """Update order stage from Shop Dashboard: accept -> preparing -> ready_for_pickup or reject"""
    user = db.query(User).filter(User.username == current_user).first()
    if not _is_shop_authorized(user):
        raise HTTPException(status_code=403, detail="Access denied. Shop/Agency Partner account required.")

    order = db.query(StoreOrder).filter(StoreOrder.order_number == order_number).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    action = action_data.action.lower().strip()
    if action == "accept":
        order.status = "preparing"
        order.shop_id = user.id
        order.shop_owner_id = user.id
        if action_data.notes:
            order.shop_notes = action_data.notes
    elif action == "ready":
        order.status = "ready_for_pickup"
        order.shop_id = user.id
        order.shop_owner_id = user.id
        if action_data.notes:
            order.shop_notes = action_data.notes
    elif action == "reject":
        order.status = "cancelled"
        order.cancellation_reason = action_data.notes or "Order rejected by Shop Partner"
    else:
        raise HTTPException(status_code=400, detail="Invalid action. Use 'accept', 'ready', or 'reject'.")

    db.commit()
    db.refresh(order)
    return {
        "status": "success",
        "order_number": order.order_number,
        "new_status": order.status,
        "message": f"Order {order.order_number} marked as {order.status}."
    }


@router.get("/shop/stats")
async def get_shop_stats(
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    """Retrieve today's overview and queue counters for the shop dashboard"""
    user = db.query(User).filter(User.username == current_user).first()
    if not _is_shop_authorized(user):
        raise HTTPException(status_code=403, detail="Access denied. Shop/Agency Partner account required.")

    all_orders = db.query(StoreOrder).filter(
        (StoreOrder.shop_id == user.id) |
        (StoreOrder.shop_owner_id == user.id) |
        (StoreOrder.shop_id.is_(None)) |
        (StoreOrder.shop_owner_id.is_(None))
    ).all()

    new_count = sum(1 for o in all_orders if o.status in ["confirmed", "placed"])
    preparing_count = sum(1 for o in all_orders if o.status == "preparing")
    ready_count = sum(1 for o in all_orders if o.status in ["ready_for_pickup", "picked_up", "out_for_delivery"])
    completed_count = sum(1 for o in all_orders if o.status == "delivered")
    total_revenue = sum(o.dealer_payout_amount or 0 for o in all_orders if o.status == "delivered")

    return {
        "new_orders": new_count,
        "preparing": preparing_count,
        "ready_for_pickup": ready_count,
        "completed": completed_count,
        "total_revenue": round(total_revenue, 2),
        "total_orders": len(all_orders),
        "shop_name": user.username,
    }


@router.get("/shop/inventory")
async def get_shop_inventory(
    search: Optional[str] = None,
    category: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    """View and manage product stock levels for the shop"""
    user = db.query(User).filter(User.username == current_user).first()
    if not _is_shop_authorized(user):
        raise HTTPException(status_code=403, detail="Access denied. Shop/Agency Partner account required.")

    query = db.query(StoreProduct)
    if search:
        query = query.filter(StoreProduct.name.ilike(f"%{search.strip()}%"))
    if category and category != "all":
        query = query.filter(StoreProduct.category == category)

    products = query.order_by(StoreProduct.id.asc()).limit(150).all()
    return [
        {
            "id": p.id,
            "name": p.name,
            "category": p.category,
            "brand": p.brand,
            "price": p.price,
            "original_price": p.original_price,
            "in_stock": p.in_stock,
            "unit": p.unit or p.weight,
            "image_url": p.image_url,
            "sku": p.sku,
        }
        for p in products
    ]


@router.patch("/shop/inventory/{product_id}")
async def update_shop_inventory_item(
    product_id: int,
    data: UpdateStockRequest,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    """Toggle in_stock availability or update price"""
    user = db.query(User).filter(User.username == current_user).first()
    if not _is_shop_authorized(user):
        raise HTTPException(status_code=403, detail="Access denied. Shop/Agency Partner account required.")

    prod = db.query(StoreProduct).filter(StoreProduct.id == product_id).first()
    if not prod:
        raise HTTPException(status_code=404, detail="Product not found")

    if data.in_stock is not None:
        prod.in_stock = data.in_stock
    if data.price is not None:
        prod.price = max(1.0, data.price)

    db.commit()
    db.refresh(prod)
    return {
        "status": "success",
        "id": prod.id,
        "name": prod.name,
        "in_stock": prod.in_stock,
        "price": prod.price,
        "message": "Inventory updated successfully"
    }


# =========================================================================
# 🛵 DELIVERY RIDER APP ENDPOINTS (Rapido-Style UX Pattern)
# =========================================================================

class RiderStatusUpdateRequest(BaseModel):
    status: str  # "picked_up", "out_for_delivery", "delivered"
    notes: Optional[str] = None

@router.get("/rider/available")
async def get_rider_available_deliveries(
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    """List orders that are ready for pickup and unclaimed by any rider"""
    import json
    user = db.query(User).filter(User.username == current_user).first()
    if not _is_rider_authorized(user):
        raise HTTPException(status_code=403, detail="Access denied. Delivery Partner account required.")

    # Find orders marked ready_for_pickup or preparing with no rider assigned
    orders = db.query(StoreOrder).filter(
        StoreOrder.status.in_(["ready_for_pickup", "preparing"]),
        StoreOrder.rider_id.is_(None)
    ).order_by(StoreOrder.created_at.asc()).limit(30).all()

    deliveries = []
    for o in orders:
        items = []
        if o.items_json:
            try:
                items = json.loads(o.items_json)
            except:
                pass
        
        deliveries.append({
            "id": o.id,
            "order_number": o.order_number,
            "pickup_name": "KhetiTak Mandi Hub & Store",
            "pickup_address": "Main APMC Mandi Road, Hub #4",
            "drop_name": o.customer_name,
            "drop_address": o.address,
            "drop_phone": o.phone,
            "items_summary": ", ".join([f"{it.get('name', 'Item')} (x{it.get('quantity', 1)})" for it in items[:3]]),
            "items_count": sum(it.get("quantity", 1) for it in items),
            "order_value": o.total_amount,
            "payout": 60.0,  # ₹60 flat delivery earnings per trip
            "payment_method": o.payment_method or "cod",
            "status": o.status,
            "created_at": o.created_at.isoformat() if o.created_at else None,
        })
    return deliveries


@router.post("/rider/orders/{order_number}/accept")
async def rider_accept_order(
    order_number: str,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    """Claim a delivery order as a Rapido delivery partner"""
    user = db.query(User).filter(User.username == current_user).first()
    if not _is_rider_authorized(user):
        raise HTTPException(status_code=403, detail="Access denied. Delivery Partner account required.")

    order = db.query(StoreOrder).filter(StoreOrder.order_number == order_number).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    if order.rider_id and order.rider_id != user.id:
        raise HTTPException(status_code=400, detail="This order has already been accepted by another rider.")

    if order.status not in ["ready_for_pickup", "preparing"]:
        raise HTTPException(status_code=400, detail=f"Order is not ready for pickup (current status: {order.status})")

    order.rider_id = user.id
    db.commit()
    db.refresh(order)
    return {
        "status": "success",
        "order_number": order.order_number,
        "message": "Delivery accepted! Head to the shop to pick up the package.",
        "order_status": order.status,
    }


@router.get("/rider/my-deliveries")
async def get_rider_my_deliveries(
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    """Get active trips and completed history for the current rider"""
    import json
    user = db.query(User).filter(User.username == current_user).first()
    if not _is_rider_authorized(user):
        raise HTTPException(status_code=403, detail="Access denied. Delivery Partner account required.")

    orders = db.query(StoreOrder).filter(
        StoreOrder.rider_id == user.id
    ).order_by(StoreOrder.created_at.desc()).limit(50).all()

    active = []
    completed = []

    for o in orders:
        items = []
        if o.items_json:
            try:
                items = json.loads(o.items_json)
            except:
                pass
        
        info = {
            "id": o.id,
            "order_number": o.order_number,
            "customer_name": o.customer_name,
            "phone": o.phone,
            "address": o.address,
            "items": items,
            "items_count": sum(it.get("quantity", 1) for it in items),
            "total_amount": o.total_amount,
            "payout": 60.0,
            "status": o.status,
            "payment_method": o.payment_method or "cod",
            "created_at": o.created_at.isoformat() if o.created_at else None,
            "delivered_at": o.delivered_at.isoformat() if o.delivered_at else None,
        }

        if o.status == "delivered":
            completed.append(info)
        else:
            active.append(info)

    return {
        "active": active,
        "completed": completed,
        "active_count": len(active),
        "completed_count": len(completed),
    }


@router.post("/rider/orders/{order_number}/status")
async def update_rider_delivery_status(
    order_number: str,
    data: RiderStatusUpdateRequest,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    """Rider updates delivery state: picked_up -> out_for_delivery -> delivered"""
    user = db.query(User).filter(User.username == current_user).first()
    if not _is_rider_authorized(user):
        raise HTTPException(status_code=403, detail="Access denied. Delivery Partner account required.")

    order = db.query(StoreOrder).filter(StoreOrder.order_number == order_number).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    if order.rider_id != user.id:
        raise HTTPException(status_code=403, detail="You are not assigned to this delivery.")

    new_status = data.status.lower().strip()
    valid_transitions = {
        "picked_up": ["ready_for_pickup", "preparing"],
        "out_for_delivery": ["picked_up", "ready_for_pickup"],
        "delivered": ["out_for_delivery", "picked_up"],
    }

    if new_status not in valid_transitions:
        raise HTTPException(status_code=400, detail="Invalid status. Use 'picked_up', 'out_for_delivery', or 'delivered'.")

    order.status = new_status
    if new_status == "delivered":
        order.delivered_at = datetime.utcnow()

    db.commit()
    db.refresh(order)
    return {
        "status": "success",
        "order_number": order.order_number,
        "new_status": order.status,
        "delivered_at": order.delivered_at.isoformat() if order.delivered_at else None,
        "message": f"Order {order.order_number} updated to {order.status}."
    }


@router.get("/rider/earnings")
async def get_rider_earnings(
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    """Summary of completed deliveries, total pay earned, and COD cash collected"""
    user = db.query(User).filter(User.username == current_user).first()
    if not user or (getattr(user, "role", "farmer") != "rider" and getattr(user, "role", "farmer") != "admin"):
        raise HTTPException(status_code=403, detail="Access denied. Delivery Partner account required.")

    delivered_orders = db.query(StoreOrder).filter(
        StoreOrder.rider_id == user.id,
        StoreOrder.status == "delivered"
    ).order_by(StoreOrder.delivered_at.desc()).all()

    total_deliveries = len(delivered_orders)
    total_earnings = total_deliveries * 60.0  # ₹60 per delivery
    cash_collected = sum(o.total_amount for o in delivered_orders if (o.payment_method or "cod").lower() == "cod")

    recent = []
    for o in delivered_orders[:15]:
        recent.append({
            "order_number": o.order_number,
            "customer_name": o.customer_name,
            "address": o.address,
            "order_amount": o.total_amount,
            "earned": 60.0,
            "delivered_at": o.delivered_at.isoformat() if o.delivered_at else (o.created_at.isoformat() if o.created_at else None),
        })

    return {
        "rider_name": user.username,
        "total_deliveries": total_deliveries,
        "total_earnings": round(total_earnings, 2),
        "cod_cash_collected": round(cash_collected, 2),
        "per_delivery_rate": 60.0,
        "recent_deliveries": recent,
    }
