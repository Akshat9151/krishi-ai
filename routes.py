from fastapi import APIRouter, HTTPException, status, Request
from pydantic import BaseModel, validator

from services.weather import get_weather
from services.crop_ml_model import predict_crop_ml
from services.disease_logic import predict_disease
from services.product_data import PRODUCTS
from services.ai_assistant import krishi_ai_reply
from services.validation import ValidationUtils
from services.rate_limiter import limiter, RateLimitConfig, check_rate_limit
from services.logger import logger

# legacy prediction support
import joblib
import numpy as np

# router instances

router = APIRouter(prefix="/api")

# =========================
# 📦 REQUEST MODELS
# =========================

class CropRequest(BaseModel):
    location: str
    soil_type: str
    season: str

    @validator('location')
    def validate_location(cls, v):
        return ValidationUtils.validate_location(v)
    
    @validator('soil_type')
    def validate_soil_type(cls, v):
        return ValidationUtils.validate_soil_type(v)
    
    @validator('season')
    def validate_season(cls, v):
        return ValidationUtils.validate_season(v)


class DiseaseRequest(BaseModel):
    crop: str

    @validator('crop')
    def validate_crop(cls, v):
        return ValidationUtils.validate_crop_name(v)


class WeatherRequest(BaseModel):
    location: str

    @validator('location')
    def validate_location(cls, v):
        return ValidationUtils.validate_location(v)


class AssistantRequest(BaseModel):
    message: str   # ✅ SINGLE STANDARD FIELD

    @validator('message')
    def validate_message(cls, v):
        return ValidationUtils.validate_message(v)


# =========================
# 🤖 AI ASSISTANT API
# =========================

@router.post("/ai-assistant")
@limiter.limit(RateLimitConfig.AI_ASSISTANT)
def ai_assistant_api(request: Request, data: AssistantRequest):
    """
    Input: { "message": "Gehu me peele dhabbe aa rahe hain" }
    Output: { "reply": "Hinglish farming answer" }
    """
    try:
        reply = krishi_ai_reply(data.message)
        logger.log_api_request(request, user="anonymous")
        return {"reply": reply}
    except Exception as e:
        logger.log_error(e, "AI Assistant API")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"AI assistant error: {str(e)}"
        )


# =========================
# 🌦️ WEATHER API
# =========================

@router.post("/weather")
@limiter.limit(RateLimitConfig.WEATHER)
def weather_api(request: Request, data: WeatherRequest):
    try:
        weather = get_weather(data.location)
        logger.log_weather_api_call(data.location, True, weather["temperature"])
        return {
            "location": data.location,
            "temperature": weather["temperature"],
            "humidity": weather["humidity"],
            "rainfall": weather["rainfall"]
        }
    except Exception as e:
        logger.log_weather_api_call(data.location, False, error=str(e))
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Weather service unavailable: {str(e)}"
        )


# =========================
# 🌾 CROP PREDICTION API
# =========================

@router.post("/predict-crop")
@limiter.limit(RateLimitConfig.ML_PREDICTION)
def predict_crop(request: Request, data: CropRequest):
    try:
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

        logger.log_ml_prediction(
            "crop_recommendation",
            {"location": data.location, "soil_type": data.soil_type, "season": data.season},
            crop
        )

        return {
            "location": data.location,
            "temperature": weather["temperature"],
            "humidity": weather["humidity"],
            "rainfall": weather["rainfall"],
            "recommended_crop": crop
        }
    except Exception as e:
        logger.log_error(e, "Crop Prediction API")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Crop prediction failed: {str(e)}"
        )


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


# -------------------------------------------------
# 🚧 Legacy `/predict/crop` endpoint (no /api prefix)
# -------------------------------------------------

# create a separate router without prefix so path is exactly /predict/crop
legacy_router = APIRouter()

# attempt to load model, but keep server running if file is invalid
model = None
try:
    model = joblib.load("backend/model.pkl")
except Exception as e:
    # log warning; model will not be used until fixed
    print(f"⚠️ could not load legacy model: {e}")

@legacy_router.post("/predict/crop")
def legacy_predict_crop(data: dict):
    soil = data.get("soil")
    city = data.get("city")
    season = data.get("season")

    # dummy logic (temporary)
    crop = "Wheat"
    # real logic could use model if loaded:
    # if model is not None:
    #     crop = model.predict(...)

    return {
        "location": city,
        "temperature": 28,
        "humidity": 60,
        "crop": crop
    }

# some clients (and old frontend) hit /predict directly; alias it to the same handler
@legacy_router.post("/predict")
def legacy_predict_alias(data: dict):
    # simply defer to the existing implementation for /predict/crop
    return legacy_predict_crop(data)
