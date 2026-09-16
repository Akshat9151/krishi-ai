from fastapi import APIRouter, HTTPException, status, Request
from pydantic import BaseModel, validator
from typing import Optional

from services.weather import get_weather, get_farming_recommendations
from services.crop_ml_model import predict_crop_ml
from services.disease_logic import predict_disease
from services.product_data import PRODUCTS
from services.ai_assistant import krishi_ai_reply
from services.validation import ValidationUtils
from services.rate_limiter import limiter, RateLimitConfig, check_rate_limit
from services.logger import logger
from services.auth_utils import get_current_user_token
from backend.database import SessionLocal
from backend.models import FarmActivity, FarmerProfile, MandiPrice, User

# legacy prediction support
import joblib
import numpy as np

# router instances

router = APIRouter(prefix="/api")

def _request_username(request: Request) -> Optional[str]:
    """Return the authenticated username when a valid bearer token is present."""
    authorization = request.headers.get("authorization")
    if not authorization:
        return None
    try:
        return get_current_user_token(authorization)
    except HTTPException:
        return None

def _record_activity(username: Optional[str], activity_type: str, title: str, details: str) -> None:
    """Persist dashboard activity without breaking the primary user action on log failure."""
    if not username:
        return
    db = SessionLocal()
    try:
        db.add(FarmActivity(
            username=username,
            activity_type=activity_type,
            title=title[:120],
            details=details[:500],
        ))
        db.commit()
    except Exception as exc:
        db.rollback()
        logger.log_error(exc, "Farm Activity")
    finally:
        db.close()

@router.get("/activities")
def get_farm_activities(request: Request, limit: int = 12):
    username = _request_username(request)
    if not username:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Sign in to view your farm activity."
        )

    safe_limit = max(1, min(limit, 30))
    db = SessionLocal()
    try:
        rows = (db.query(FarmActivity)
                .filter(FarmActivity.username == username)
                .order_by(FarmActivity.created_at.desc())
                .limit(safe_limit)
                .all())
        return [
            {
                "id": row.id,
                "type": row.activity_type,
                "title": row.title,
                "details": row.details,
                "created_at": row.created_at.isoformat(),
            }
            for row in rows
        ]
    finally:
        db.close()

# =========================
# 📦 REQUEST MODELS
# =========================

class CropRequest(BaseModel):
    location: str
    soil_type: str
    season: str
    # optional soil nutrient inputs (if provided by frontend)
    N: Optional[float] = None
    P: Optional[float] = None
    K: Optional[float] = None
    ph: Optional[float] = None

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
        recommendations = get_farming_recommendations(weather)
        logger.log_weather_api_call(data.location, True, weather["temperature"])
        return {
            "location": data.location,
            "temperature": weather["temperature"],
            "humidity": weather["humidity"],
            "rainfall": weather["rainfall"],
            "wind_speed": weather["wind_speed"],
            "recommendations": recommendations
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

        # derive recommendations from selected soil, season, location and weather
        preds = predict_crop_ml(
            soil_type=data.soil_type,
            season=data.season,
            location=data.location,
            weather=weather,
            top_n=3,
            nitrogen=data.N,
            phosphorus=data.P,
            potassium=data.K,
            ph=data.ph,
        )

        recommended = preds

        logger.log_ml_prediction(
            "crop_recommendation",
            {"location": data.location, "soil_type": data.soil_type, "season": data.season},
            recommended
        )
        top_crop = recommended[0].get("crop", "Crop recommendation") if recommended else "Crop recommendation"
        _record_activity(
            _request_username(request),
            "crop_recommendation",
            f"Crop recommendation: {top_crop}",
            f"{data.location} • {data.soil_type} soil • {data.season}"
        )

        return {
            "location": data.location,
            "temperature": weather["temperature"],
            "humidity": weather["humidity"],
            "rainfall": weather["rainfall"],
            "recommended_crops": recommended
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
def disease_api(request: Request, data: DiseaseRequest):
    result = predict_disease(data.crop)
    _record_activity(
        _request_username(request),
        "disease_check",
        f"Disease check: {data.crop.title()}",
        result.get("disease", "Diagnosis completed")
    )
    return result


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
# 📈 MANDI BHAV API
# =========================

@router.get("/mandi-bhav")
def get_mandi_bhav(
    commodity: Optional[str] = None,
    state: Optional[str] = None,
    district: Optional[str] = None,
    search: Optional[str] = None,
    limit: int = 50
):
    db = SessionLocal()
    try:
        query = db.query(MandiPrice)
        if commodity and commodity.lower() != "all":
            query = query.filter(MandiPrice.commodity.ilike(f"%{commodity}%"))
        if state and state.lower() != "all":
            query = query.filter(MandiPrice.state.ilike(f"%{state}%"))
        if district and district.lower() != "all":
            query = query.filter(MandiPrice.district.ilike(f"%{district}%"))
        if search:
            term = f"%{search.strip()}%"
            query = query.filter(
                (MandiPrice.commodity.ilike(term)) |
                (MandiPrice.market.ilike(term)) |
                (MandiPrice.district.ilike(term)) |
                (MandiPrice.state.ilike(term))
            )

        rows = query.order_by(MandiPrice.modal_price.desc()).limit(min(limit, 100)).all()
        return [
            {
                "id": str(r.id),
                "commodity": f"{r.commodity} ({r.commodity_hi})" if r.commodity_hi else r.commodity,
                "state": r.state,
                "district": r.district,
                "market": r.market,
                "minPrice": r.min_price,
                "maxPrice": r.max_price,
                "modalPrice": r.modal_price,
                "change": r.price_change,
                "trend": r.trend,
                "arrivalDate": r.arrival_date,
                "source": r.source,
                "updatedAt": r.updated_at.isoformat() if r.updated_at else None,
            }
            for r in rows
        ]
    finally:
        db.close()


# =========================
# 👨‍🌾 FARMER PROFILE & PREFERENCES API
# =========================

class ProfileUpdateRequest(BaseModel):
    full_name: Optional[str] = None
    language: Optional[str] = None
    farm_location: Optional[str] = None
    land_size: Optional[str] = None
    land_unit: Optional[str] = None
    primary_crop: Optional[str] = None
    sound_enabled: Optional[bool] = None


@router.get("/profile")
def get_farmer_profile(request: Request):
    username = _request_username(request)
    if not username:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Sign in to view your profile."
        )
    db = SessionLocal()
    try:
        profile = db.query(FarmerProfile).filter(FarmerProfile.username == username).first()
        if not profile:
            # Create default profile tied to this user
            user = db.query(User).filter(User.username == username).first()
            profile = FarmerProfile(
                user_id=user.id if user else None,
                username=username,
                language="hi",
                farm_location="Jaipur, Rajasthan",
                land_size="3",
                land_unit="Acres",
                primary_crop="Wheat",
                sound_enabled=True
            )
            db.add(profile)
            db.commit()
            db.refresh(profile)

        return {
            "username": profile.username,
            "fullName": profile.full_name,
            "language": profile.language,
            "farmLocation": profile.farm_location,
            "landSize": profile.land_size,
            "landUnit": profile.land_unit,
            "primaryCrop": profile.primary_crop,
            "soundEnabled": profile.sound_enabled,
        }
    finally:
        db.close()


@router.patch("/profile")
def update_farmer_profile(request: Request, data: ProfileUpdateRequest):
    username = _request_username(request)
    if not username:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Sign in to update your profile."
        )
    db = SessionLocal()
    try:
        profile = db.query(FarmerProfile).filter(FarmerProfile.username == username).first()
        if not profile:
            user = db.query(User).filter(User.username == username).first()
            profile = FarmerProfile(
                user_id=user.id if user else None,
                username=username
            )
            db.add(profile)

        if data.full_name is not None:
            profile.full_name = data.full_name.strip()
        if data.language is not None:
            profile.language = data.language
        if data.farm_location is not None:
            profile.farm_location = data.farm_location.strip()
        if data.land_size is not None:
            profile.land_size = str(data.land_size).strip()
        if data.land_unit is not None:
            profile.land_unit = data.land_unit.strip()
        if data.primary_crop is not None:
            profile.primary_crop = data.primary_crop.strip()
        if data.sound_enabled is not None:
            profile.sound_enabled = bool(data.sound_enabled)

        db.commit()
        db.refresh(profile)
        return {
            "status": "success",
            "message": "Profile updated successfully",
            "profile": {
                "username": profile.username,
                "fullName": profile.full_name,
                "language": profile.language,
                "farmLocation": profile.farm_location,
                "landSize": profile.land_size,
                "landUnit": profile.land_unit,
                "primaryCrop": profile.primary_crop,
                "soundEnabled": profile.sound_enabled,
            }
        }
    finally:
        db.close()


# =========================
# ❤️ HEALTH CHECK
# =========================

@router.get("/health")
def health_check():
    from backend.database import engine

    return {
        "status": "ok",
        "service": "KhetiTak",
        "database": engine.dialect.name,
        "persistent_storage": engine.dialect.name not in {"sqlite"},
    }



# -------------------------------------------------
# Backward-compatible crop prediction endpoints
# -------------------------------------------------
# Older frontends may still call /predict or /predict/crop. Keep those URLs,
# but route them through the production recommender—never a static demo result.
legacy_router = APIRouter()

def _legacy_crop_prediction(data: dict):
    soil_type = data.get("soil_type") or data.get("soil")
    location = data.get("location") or data.get("city")
    season = data.get("season")

    if not all(isinstance(value, str) and value.strip() for value in (soil_type, location, season)):
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="soil_type, location, and season are required"
        )

    try:
        weather = get_weather(location.strip())
        recommendations = predict_crop_ml(
            soil_type=soil_type.strip(),
            season=season.strip(),
            location=location.strip(),
            weather=weather,
            top_n=3,
        )
        return {
            "location": location.strip(),
            "temperature": weather["temperature"],
            "humidity": weather["humidity"],
            "rainfall": weather["rainfall"],
            "recommended_crops": recommendations,
        }
    except HTTPException:
        raise
    except Exception as exc:
        logger.log_error(exc, "Legacy Crop Prediction API")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Crop prediction is temporarily unavailable. Please try again."
        )

@legacy_router.post("/predict/crop")
def legacy_predict_crop(data: dict):
    return _legacy_crop_prediction(data)

@legacy_router.post("/predict")
def legacy_predict_alias(data: dict):
    return _legacy_crop_prediction(data)