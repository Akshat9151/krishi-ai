from fastapi import APIRouter, HTTPException, Query, Depends
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from typing import List, Optional, Any, Union
import json
from datetime import datetime, timedelta

from backend.database import get_db
from backend.models_store import StoreProduct, ProductCategory, FertilizerRecommendation, StoreOrder, StoreOrderEvent
from backend.models import FarmActivity, User
from services.auth import get_current_user
from services.logger import logger
from services.validation import ValidationUtils
from services.config import settings

router = APIRouter(prefix="/api/store", tags=["Store"])

OWNER_STATUSES = ("placed", "accepted", "packed", "picked_up", "out_for_delivery", "delivered", "cancelled")


def _require_role(user: User, role: str) -> None:
    if (user.role or "farmer") != role:
        raise HTTPException(status_code=403, detail=f"{role.replace('_', ' ').title()} access required")


def _load_order_items(items_json: Optional[str]) -> list:
    if not items_json:
        return []
    try:
        items = json.loads(items_json)
    except json.JSONDecodeError:
        return []
    return items if isinstance(items, list) else []

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

class CreateOrderResponse(BaseModel):
    order_number: str
    status: str
    message: str
    total_amount: float
    created_at: datetime
    items: List[Any] = Field(default_factory=list)


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
    payment_method: str
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
        "payment_method": order.payment_method,
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
        import time, json, secrets
        user = db.query(User).filter(User.username == current_user).first()
        if not user:
            raise HTTPException(status_code=401, detail="Sign in again to place an order")

        if not order_data.items:
            raise HTTPException(status_code=422, detail="Your cart must contain at least one item")

        product_ids = [item.product_id for item in order_data.items]
        products = db.query(StoreProduct).filter(StoreProduct.id.in_(product_ids)).with_for_update().all()
        products_by_id = {product.id: product for product in products}
        if len(products_by_id) != len(set(product_ids)):
            raise HTTPException(status_code=422, detail="One or more products are no longer available")

        snapshot_items = []
        total_amount = 0.0
        for item in order_data.items:
            product = products_by_id[item.product_id]
            if product.stock_quantity <= 0:
                raise HTTPException(status_code=409, detail=f"{product.name} is currently out of stock")
            if product.stock_quantity < item.quantity:
                raise HTTPException(status_code=409, detail=f"Only {product.stock_quantity} units of {product.name} are available")
            unit_price = round(float(product.price), 2)
            line_total = round(unit_price * item.quantity, 2)
            total_amount = round(total_amount + line_total, 2)
            snapshot_items.append({
                "product_id": product.id,
                "sku": product.sku,
                "name": product.name,
                "price": unit_price,
                "quantity": item.quantity,
                "line_total": line_total,
            })
            product.stock_quantity -= item.quantity
            product.in_stock = product.stock_quantity > 0

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
            status="confirmed",
            payment_method=order_data.payment_method or "cod",
            shop_owner_id=shop_owner_id,
        )
        db.add(store_order)
        db.flush()
        db.refresh(store_order)
        db.add(StoreOrderEvent(
            order_id=store_order.id,
            event_type="order_created",
            status=store_order.status,
            message="Order placed successfully",
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
            created_at=store_order.created_at,
            items=snapshot_items,
        )
    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        logger.log_error(e, "Store API - Create Order")
        raise HTTPException(status_code=500, detail=f"Failed to place order: {str(e)}")


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
async def get_shop_orders(
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
    return {"order_count": len(orders), "order_value": round(sum(order.total_amount or 0 for order in orders), 2)}


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
    """Cancel an owned COD order before dealer dispatch."""
    user = db.query(User).filter(User.username == current_user).first()
    if not user:
        raise HTTPException(status_code=404, detail="Order not found")
    order = db.query(StoreOrder).filter(
        StoreOrder.order_number == order_number,
        StoreOrder.user_id == user.id,
    ).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if order.payment_method.lower() != "cod":
        raise HTTPException(status_code=409, detail="Only cash-on-delivery orders can be cancelled here")
    if order.status.lower() not in {"confirmed", "processing", "placed"}:
        raise HTTPException(status_code=409, detail="This order can no longer be cancelled")

    for item in _load_order_items(order.items_json):
        product = db.query(StoreProduct).filter(StoreProduct.id == item["product_id"]).with_for_update().first()
        if product:
            product.stock_quantity += int(item["quantity"])
            product.in_stock = product.stock_quantity > 0
    order.status = "cancelled"
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
    """Get order details by order number"""
    try:
        import json
        user = db.query(User).filter(User.username == current_user).first()
        order = db.query(StoreOrder).filter(StoreOrder.order_number == order_number).first()
        if not order or not user or order.user_id != user.id:
            # Do not reveal whether another farmer's order number exists.
            raise HTTPException(status_code=404, detail="Order not found")
        
        items = _load_order_items(order.items_json)
                
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
            "created_at": order.created_at.isoformat(),
            "events": [
                {
                    "event_type": event.event_type,
                    "status": event.status,
                    "message": event.message,
                    "created_at": event.created_at.isoformat(),
                }
                for event in events
            ]
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.log_error(e, "Store API - Get Order")
        raise HTTPException(status_code=500, detail="Failed to fetch order")
