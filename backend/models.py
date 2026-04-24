from sqlalchemy import Column, Integer, String, Float, ForeignKey, Index
from backend.database import Base


# 👨‍🌾 Farmers
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)  # Added index for login queries
    password = Column(String)
    
    # Composite index for potential future queries
    __table_args__ = (
        Index('idx_user_username', 'username'),
    )


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