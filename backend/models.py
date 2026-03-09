from sqlalchemy import Column, Integer, String, Float, ForeignKey
from backend.database import Base


# 👨‍🌾 Farmers
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True)
    password = Column(String)


# 🌾 Crop Recommendations
class CropPrediction(Base):
    __tablename__ = "crop_predictions"

    id = Column(Integer, primary_key=True)
    soil_type = Column(String)
    season = Column(String)
    location = Column(String)
    temperature = Column(Float)
    humidity = Column(Float)
    recommended_crop = Column(String)


# 🦠 Crop Diseases
class Disease(Base):
    __tablename__ = "diseases"

    id = Column(Integer, primary_key=True)
    crop = Column(String)
    disease_name = Column(String)
    solution = Column(String)


# 🌱 Fertilizers
class Fertilizer(Base):
    __tablename__ = "fertilizers"

    id = Column(Integer, primary_key=True)
    crop = Column(String)
    fertilizer_name = Column(String)


# 🛒 Store Products
class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True)
    name = Column(String)
    price = Column(Float)
    category = Column(String)


# 📦 Orders
class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    product_id = Column(Integer, ForeignKey("products.id"))
    quantity = Column(Integer)