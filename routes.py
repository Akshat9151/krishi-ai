from fastapi import APIRouter
from pydantic import BaseModel

from services.weather import get_weather
from services.crop_ml_model import predict_crop_ml
from services.disease_logic import predict_disease
from services.product_data import PRODUCTS
from services.ai_assistant import krishi_ai_reply

router = APIRouter(prefix="/api")

# =========================
# 📦 REQUEST MODELS
# =========================

class CropRequest(BaseModel):
    location: str
    soil_type: str
    season: str


class DiseaseRequest(BaseModel):
    crop: str


class WeatherRequest(BaseModel):
    location: str


class AssistantRequest(BaseModel):
    message: str   # ✅ SINGLE STANDARD FIELD


# =========================
# 🤖 AI ASSISTANT API
# =========================

@router.post("/ai-assistant")
def ai_assistant_api(data: AssistantRequest):
    """
    Input: { "message": "Gehu me peele dhabbe aa rahe hain" }
    Output: { "reply": "Hinglish farming answer" }
    """
    reply = krishi_ai_reply(data.message)
    return {"reply": reply}


# =========================
# 🌦️ WEATHER API
# =========================

@router.post("/weather")
def weather_api(data: WeatherRequest):
    weather = get_weather(data.location)

    return {
        "location": data.location,
        "temperature": weather["temperature"],
        "humidity": weather["humidity"],
        "rainfall": weather["rainfall"]
    }


# =========================
# 🌾 CROP PREDICTION API
# =========================

@router.post("/predict-crop")
def predict_crop(data: CropRequest):

    weather = get_weather(data.location)

    # TEMP soil params (future: sensor / image ML)
    N = 90
    P = 42
    K = 43
    ph = 6.5

    crop = predict_crop_ml(
        N=N,
        P=P,
        K=K,
        temperature=weather["temperature"],
        humidity=weather["humidity"],
        ph=ph,
        rainfall=weather["rainfall"]
    )

    return {
        "location": data.location,
        "temperature": weather["temperature"],
        "humidity": weather["humidity"],
        "rainfall": weather["rainfall"],
        "recommended_crop": crop
    }


# =========================
# 🦠 DISEASE PREDICTION API
# =========================

@router.post("/predict-disease")
def disease_api(data: DiseaseRequest):
    return predict_disease(data.crop)


# =========================
# 🛒 PARTNER PRODUCT API
# =========================

@router.post("/recommend-products")
def recommend_products(data: DiseaseRequest):
    crop = data.crop.lower()
    products = PRODUCTS.get(crop, [])

    return {
        "crop": crop,
        "products": products
    }


# =========================
# ❤️ HEALTH CHECK
# =========================

@router.get("/health")
def health_check():
    return {
        "status": "ok",
        "service": "Krishi AI"
    }
