from sqlalchemy import Column, Integer, String, Float, Boolean, Text, DateTime, Index, ForeignKey
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

class StoreOrder(Base):
    __tablename__ = "store_orders"

    id = Column(Integer, primary_key=True, index=True)
    order_number = Column(String, unique=True, index=True)
    user_id = Column(Integer, nullable=True, index=True)
    customer_name = Column(String)
    phone = Column(String)
    address = Column(Text)
    items_json = Column(Text)
    total_amount = Column(Float)
    status = Column(String, default="processing")
    payment_method = Column(String, default="cod")
    created_at = Column(DateTime, default=datetime.utcnow)

