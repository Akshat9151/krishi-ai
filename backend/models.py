from sqlalchemy import Column, Integer, String, Float, ForeignKey, Index, DateTime, Text, Boolean
from datetime import datetime
from backend.database import Base


# 👨‍🌾 Farmers
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=True)
    password = Column(String, nullable=True)
    email = Column(String, unique=True, index=True, nullable=True)
    phone = Column(String, unique=True, index=True, nullable=True)
    role = Column(String, nullable=False, default="farmer", index=True)
    google_sub = Column(String, unique=True, index=True, nullable=True)
    role = Column(String, default="farmer", nullable=False, index=True)  # farmer, shop_owner, rider
    is_verified = Column(Boolean, default=False, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Composite index for potential future queries
    __table_args__ = (
        Index('idx_user_username', 'username'),
        Index('idx_user_role', 'role'),
    )

class OTPChallenge(Base):
    __tablename__ = "otp_challenges"

    id = Column(String(64), primary_key=True)
    purpose = Column(String(32), index=True, nullable=False)
    destination = Column(String(255), index=True, nullable=False)
    code_hash = Column(String(128), nullable=False)
    payload_json = Column(Text, nullable=True)
    expires_at = Column(DateTime, nullable=False)
    attempts = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)


# 🌾 Crop Recommendations
class CropPrediction(Base):
    __tablename__ = "crop_predictions"

    id = Column(Integer, primary_key=True, index=True)
    soil_type = Column(String, index=True)  # Added index for filtering
    season = Column(String, index=True)  # Added index for filtering
    location = Column(String, index=True)  # Added index for location-based queries
    temperature = Column(Float)
    humidity = Column(Float)
    recommended_crop = Column(String, index=True)  # Added index for crop searches
    
    # Composite indexes for common query patterns
    __table_args__ = (
        Index('idx_crop_soil_season', 'soil_type', 'season'),
        Index('idx_crop_location', 'location'),
        Index('idx_crop_recommended', 'recommended_crop'),
    )


# 🦠 Crop Diseases
class Disease(Base):
    __tablename__ = "diseases"

    id = Column(Integer, primary_key=True, index=True)
    crop = Column(String, index=True)  # Added index for crop-specific disease queries
    disease_name = Column(String, index=True)  # Added index for disease searches
    solution = Column(String)
    
    # Composite index for crop-disease combinations
    __table_args__ = (
        Index('idx_disease_crop', 'crop'),
        Index('idx_disease_name', 'disease_name'),
        Index('idx_crop_disease', 'crop', 'disease_name'),
    )


# 🌱 Fertilizers
class Fertilizer(Base):
    __tablename__ = "fertilizers"

    id = Column(Integer, primary_key=True, index=True)
    crop = Column(String, index=True)  # Added index for crop-specific fertilizer queries
    fertilizer_name = Column(String, index=True)  # Added index for fertilizer searches
    
    # Composite index for crop-fertilizer combinations
    __table_args__ = (
        Index('idx_fertilizer_crop', 'crop'),
        Index('idx_fertilizer_name', 'fertilizer_name'),
        Index('idx_crop_fertilizer', 'crop', 'fertilizer_name'),
    )


# 🛒 Store Products
class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)  # Added index for product searches
    price = Column(Float, index=True)  # Added index for price-based queries
    category = Column(String, index=True)  # Added index for category filtering
    
    # Composite indexes for common query patterns
    __table_args__ = (
        Index('idx_product_name', 'name'),
        Index('idx_product_category', 'category'),
        Index('idx_product_price', 'price'),
        Index('idx_category_price', 'category', 'price'),
    )


# 📦 Orders
class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)  # Added index for user orders
    product_id = Column(Integer, ForeignKey("products.id"), index=True)  # Added index for product orders
    quantity = Column(Integer)
    
    # Composite indexes for order queries
    __table_args__ = (
        Index('idx_order_user', 'user_id'),
        Index('idx_order_product', 'product_id'),
        Index('idx_user_product', 'user_id', 'product_id'),
    )

# Farmer-scoped real activity feed for the dashboard. This is deliberately
# separate from model-output tables so it can evolve without changing ML data.
class FarmActivity(Base):
    __tablename__ = "farm_activities"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, nullable=False, index=True)
    activity_type = Column(String, nullable=False, index=True)
    title = Column(String, nullable=False)
    details = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)

    __table_args__ = (
        Index('idx_farm_activity_user_time', 'username', 'created_at'),
        Index('idx_farm_activity_type_time', 'activity_type', 'created_at'),
    )


# 🌾 Server-side Farmer Profile & Preferences
class FarmerProfile(Base):
    __tablename__ = "farmer_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, index=True, nullable=True)
    username = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    language = Column(String, default="hi")
    farm_location = Column(String, default="Jaipur, Rajasthan")
    land_size = Column(String, default="3")
    land_unit = Column(String, default="Acres")
    primary_crop = Column(String, default="Wheat")
    sound_enabled = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)


# 📈 Mandi Market Prices
class MandiPrice(Base):
    __tablename__ = "mandi_prices"

    id = Column(Integer, primary_key=True, index=True)
    commodity = Column(String, index=True, nullable=False)
    commodity_hi = Column(String, nullable=True)
    state = Column(String, index=True, nullable=False)
    district = Column(String, index=True, nullable=False)
    market = Column(String, index=True, nullable=False)
    min_price = Column(Float, nullable=False)
    max_price = Column(Float, nullable=False)
    modal_price = Column(Float, nullable=False)
    price_change = Column(String, default="₹0")
    trend = Column(String, default="up")
    arrival_date = Column(String, default="Today")
    source = Column(String, default="eNAM / Agmarknet")
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    __table_args__ = (
        Index('idx_mandi_commodity_state', 'commodity', 'state'),
        Index('idx_mandi_market', 'market'),
    )
