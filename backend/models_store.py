from sqlalchemy import Column, Integer, String, Float, Boolean, Text, DateTime, Date, Index, ForeignKey, func
from datetime import datetime
from backend.database import Base

class StoreProduct(Base):
    __tablename__ = "store_products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    category = Column(String, index=True)
    subcategory = Column(String, index=True)
    description = Column(Text)
    image_url = Column(String)
    price = Column(Float)
    original_price = Column(Float)
    discount_percentage = Column(Float, default=0)
    rating = Column(Float, default=0.0)
    reviews_count = Column(Integer, default=0)
    in_stock = Column(Boolean, default=True)
    stock_quantity = Column(Integer, nullable=False, default=0)
    shop_owner_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)
    badge = Column(String)
    fertilizer_type = Column(String, index=True)  # NPK, organic, liquid, etc.
    suitable_crops = Column(Text)  # JSON array of suitable crops
    brand = Column(String, index=True)
    weight = Column(String)  # e.g., "1kg", "5kg", "50kg"
    unit = Column(String)  # e.g., "pack", "bottle", "bag"
    sku = Column(String, unique=True, index=True)
    product_url = Column(String)  # Deep link to product page
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Indexes for performance
    __table_args__ = (
        Index('idx_store_product_category', 'category'),
        Index('idx_store_product_fertilizer', 'fertilizer_type'),
        Index('idx_store_product_brand', 'brand'),
        Index('idx_store_product_price', 'price'),
        Index('idx_store_product_rating', 'rating'),
    )

class ProductCategory(Base):
    __tablename__ = "product_categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    display_name = Column(String)
    icon = Column(String)
    image = Column(String)
    description = Column(Text)
    parent_id = Column(Integer, default=None)  # For subcategories
    sort_order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

from sqlalchemy.orm import relationship

class FertilizerRecommendation(Base):
    __tablename__ = "fertilizer_recommendations"

    id = Column(Integer, primary_key=True, index=True)
    crop_name = Column(String, index=True)
    fertilizer_type = Column(String, index=True)  # NPK, organic, etc.
    product_id = Column(Integer, ForeignKey("store_products.id"), index=True)
    recommendation_score = Column(Float, default=0.0)  # How relevant this recommendation is
    season = Column(String, index=True)  # kharif, rabi, zaid
    soil_type = Column(String, index=True)  # clay, sandy, loamy, etc.
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationship to product
    product = relationship("StoreProduct")
    
    __table_args__ = (
        Index('idx_recommendation_crop', 'crop_name'),
        Index('idx_recommendation_season', 'season'),
        Index('idx_recommendation_soil', 'soil_type'),
        Index('idx_recommendation_score', 'recommendation_score'),
    )

class Coupon(Base):
    __tablename__ = "coupons"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, nullable=False)
    discount_type = Column(String, nullable=False)
    discount_value = Column(Float, nullable=False)
    max_discount_amount = Column(Float, nullable=True)
    min_order_value = Column(Float, nullable=True)
    valid_from = Column(Date, nullable=True)
    valid_until = Column(Date, nullable=True)
    usage_limit_per_user = Column(Integer, nullable=False, default=1)
    total_usage_limit = Column(Integer, nullable=True)
    is_active = Column(Boolean, nullable=False, default=True)
    applies_to = Column(String, nullable=False, default="all")
    new_users_only = Column(Boolean, nullable=False, default=False)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)

    __table_args__ = (
        Index("uq_coupons_code_lower", func.lower(code), unique=True),
    )


class StoreOrder(Base):
    __tablename__ = "store_orders"

    id = Column(Integer, primary_key=True, index=True)
    order_number = Column(String, unique=True, index=True)
    user_id = Column(Integer, nullable=True, index=True)
    shop_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)       # Assigned Shop/Agency user ID
    shop_owner_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True) # Backward compatibility alias
    rider_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)      # Assigned Delivery Rider user ID
    customer_name = Column(String)
    phone = Column(String)
    address = Column(Text)
    items_json = Column(Text)
    total_amount = Column(Float)
    subtotal_amount = Column(Float, nullable=False, default=0)
    discount_amount = Column(Float, nullable=False, default=0)
    discount_type = Column(String, nullable=True)
    discount_label = Column(String, nullable=True)
    coupon_id = Column(Integer, ForeignKey("coupons.id"), nullable=True, index=True)
    coupon_code = Column(String, nullable=True)
    commission_amount = Column(Float, nullable=False, default=0)
    dealer_payout_amount = Column(Float, nullable=False, default=0)
    platform_net_amount = Column(Float, nullable=False, default=0)
    status = Column(String, default="confirmed", index=True)   # confirmed, preparing, ready_for_pickup, picked_up, out_for_delivery, delivered, cancelled
    rejection_reason = Column(Text, nullable=True)
    payment_method = Column(String, default="cod")
    payment_status = Column(String, default="unpaid", nullable=False, index=True)
    razorpay_order_id = Column(String, unique=True, nullable=True, index=True)
    razorpay_payment_id = Column(String, unique=True, nullable=True, index=True)
    razorpay_signature = Column(String, nullable=True)
    shop_notes = Column(String, nullable=True)
    cancellation_reason = Column(String, nullable=True)
    delivered_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    __table_args__ = (
        Index('idx_store_order_status', 'status'),
        Index('idx_store_order_shop', 'shop_id'),
        Index('idx_store_order_rider', 'rider_id'),
    )


class RazorpayWebhookEvent(Base):
    __tablename__ = "razorpay_webhook_events"

    id = Column(Integer, primary_key=True, index=True)
    event_id = Column(String, unique=True, nullable=False, index=True)
    event_type = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)



class StoreOrderEvent(Base):
    __tablename__ = "store_order_events"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("store_orders.id"), nullable=False, index=True)
    event_type = Column(String, nullable=False, index=True)
    status = Column(String, nullable=False)
    message = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
