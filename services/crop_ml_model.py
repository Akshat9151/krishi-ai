"""Crop recommendation model trained from Crop_Recommendation.csv."""

from __future__ import annotations

from pathlib import Path
from typing import Any

import joblib
import pandas as pd


MODEL_PATH = Path(__file__).resolve().parents[1] / "models" / "crop_recommendation.joblib"
FEATURES = (
    "Nitrogen",
    "Phosphorus",
    "Potassium",
    "Temperature",
    "Humidity",
    "pH_Value",
    "Rainfall",
)

_CROP_METADATA = {
    "Rice": ("🌾", "High", "NPK 12-32-16 or Urea + DAP", "Keep the soil moist and control weeds regularly."),
    "Wheat": ("🌾", "Moderate", "Nitrogen-rich fertilizer such as Urea and DAP", "Sow in cool weather and avoid waterlogging."),
    "Maize": ("🌽", "Moderate", "Balanced NPK 20-20-20 or DAP", "Keep the soil moist and apply side-dressing after 25-30 days."),
    "Cotton": ("🌿", "Moderate", "NPK 10-26-26 with boron application", "Avoid excess moisture during boll formation."),
    "ChickPea": ("🫘", "Low", "DAP with sulphur", "Use well-drained soil and avoid excess irrigation."),
    "KidneyBeans": ("🫘", "Moderate", "Balanced NPK with phosphorus", "Maintain even moisture during flowering."),
    "PigeonPeas": ("🌱", "Low", "DAP and potash", "Avoid standing water and provide good drainage."),
    "MothBeans": ("🌱", "Low", "Phosphorus-rich fertilizer", "A suitable choice for warm, dry conditions."),
    "MungBean": ("🌱", "Low", "Rhizobium seed treatment and DAP", "Do not over-irrigate this short-duration pulse."),
    "Blackgram": ("🌱", "Low", "DAP and potash", "Use clean seed and avoid waterlogging."),
    "Lentil": ("🌱", "Low", "DAP with sulphur", "Prefer cool weather and well-drained soil."),
    "Pomegranate": ("🍎", "Moderate", "Balanced NPK with micronutrients", "Maintain drainage and use drip irrigation where possible."),
    "Banana": ("🍌", "High", "Potash-rich NPK and organic manure", "Maintain regular moisture and protect from strong winds."),
    "Mango": ("🥭", "Moderate", "Farmyard manure with balanced NPK", "Use well-drained soil and manage flowering irrigation."),
    "Grapes": ("🍇", "Moderate", "Potash-rich fertilizer with micronutrients", "Use trellising and avoid excess humidity."),
    "Watermelon": ("🍉", "Moderate", "Balanced NPK with potash", "Use sandy, well-drained beds and steady irrigation."),
    "Muskmelon": ("🍈", "Moderate", "Balanced NPK with potash", "Provide warm conditions and avoid waterlogging."),
    "Apple": ("🍎", "Moderate", "Compost with balanced orchard fertilizer", "Needs cool conditions and well-drained soil."),
    "Orange": ("🍊", "Moderate", "Balanced NPK with micronutrients", "Use drainage and regular but measured irrigation."),
    "Papaya": ("🥭", "High", "Potash-rich NPK and compost", "Protect roots from standing water."),
    "Coconut": ("🥥", "High", "Potash, magnesium and organic manure", "Maintain moisture and mulch around mature palms."),
    "Jute": ("🌿", "High", "Nitrogen-rich fertilizer", "Needs warm, humid weather and adequate moisture."),
    "Coffee": ("☕", "Moderate", "Compost with balanced NPK", "Prefer shaded, well-drained and humid conditions."),
}

_SEASON_PREFERENCES = {
    "rabi": {"Wheat", "ChickPea", "Lentil", "Peas", "Mustard"},
    "kharif": {"Rice", "Maize", "Cotton", "PigeonPeas", "MungBean", "Blackgram", "Jute"},
    "zaid": {"Maize", "MungBean", "Watermelon", "Muskmelon", "Cucumber"},
}


def _load_model() -> dict[str, Any]:
    if not MODEL_PATH.exists():
        raise RuntimeError(
            f"Trained crop model is missing at {MODEL_PATH}. "
            "Run `python scripts/train_crop_model.py` before starting the API."
        )
    artifact = joblib.load(MODEL_PATH)
    if not isinstance(artifact, dict) or "model" not in artifact:
        raise RuntimeError("Crop model artifact is invalid; retrain it with scripts/train_crop_model.py.")
    return artifact


_ARTIFACT = _load_model()
_MODEL = _ARTIFACT["model"]
_MEDIANS = _ARTIFACT["medians"]


def _number(value: Any, feature: str) -> float:
    if value is None or value == "":
        return float(_MEDIANS[feature])
    try:
        return float(value)
    except (TypeError, ValueError) as exc:
        raise ValueError(f"{feature} must be numeric") from exc


def _context_adjustment(crop: str, soil: str, season: str) -> float:
    """Use UI context only as a small tie-breaker; it is not presented as trained data."""
    adjustment = 0.0
    if season in _SEASON_PREFERENCES and crop in _SEASON_PREFERENCES[season]:
        adjustment += 0.04
    if soil == "sandy" and crop in {"Watermelon", "Muskmelon", "Groundnut", "MothBeans"}:
        adjustment += 0.03
    if soil == "clay" and crop in {"Rice", "Cotton", "Lentil"}:
        adjustment += 0.03
    if soil == "loamy" and crop in {"Wheat", "Maize", "ChickPea", "Potato"}:
        adjustment += 0.03
    return adjustment


def predict_crop_ml(
    soil_type: str,
    season: str,
    location: str,
    weather: dict,
    top_n: int = 3,
    nitrogen: float | None = None,
    phosphorus: float | None = None,
    potassium: float | None = None,
    ph: float | None = None,
) -> list[dict[str, Any]]:
    """Return top crops from the trained classifier plus contextual metadata."""
    values = {
        "Nitrogen": _number(nitrogen, "Nitrogen"),
        "Phosphorus": _number(phosphorus, "Phosphorus"),
        "Potassium": _number(potassium, "Potassium"),
        "Temperature": _number(weather.get("temperature"), "Temperature"),
        "Humidity": _number(weather.get("humidity"), "Humidity"),
        "pH_Value": _number(ph, "pH_Value"),
        "Rainfall": _number(weather.get("rainfall"), "Rainfall"),
    }
    row = pd.DataFrame([[values[feature] for feature in FEATURES]], columns=FEATURES)
    probabilities = _MODEL.predict_proba(row)[0]
    classes = _MODEL.classes_
    soil = (soil_type or "loamy").strip().lower()
    normalized_season = (season or "kharif").strip().lower()

    ranked = sorted(
        (
            (str(crop), float(probability) + _context_adjustment(str(crop), soil, normalized_season))
            for crop, probability in zip(classes, probabilities)
        ),
        key=lambda item: item[1],
        reverse=True,
    )[: max(1, min(int(top_n), 5))]

    max_score = max(score for _, score in ranked) or 1.0
    results = []
    for crop, score in ranked:
        icon, water, fertilizer, tips = _CROP_METADATA.get(
            crop, ("🌱", "Moderate", "Balanced NPK fertilizer", "Use a soil test to fine-tune the fertilizer plan.")
        )
        results.append({
            "crop": crop,
            "confidence": round(min(score / max_score, 1.0), 3),
            "model": "RandomForest trained on Crop_Recommendation.csv",
            "suitable_season": normalized_season.title(),
            "recommended_fertilizer": fertilizer,
            "tips": tips,
            "water_requirement": water,
            "soil_compatibility": soil.title(),
            "icon": icon,
            "description": f"Predicted from N-P-K, temperature, humidity, pH and rainfall for {location or 'your farm'}.",
        })
    return results
