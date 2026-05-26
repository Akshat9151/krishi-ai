CROP_PROFILES = [
    {
        "crop": "Rice",
        "soil_types": ["clay", "alluvial", "loamy"],
        "seasons": ["kharif", "monsoon"],
        "recommended_fertilizer": "NPK 12-32-16 or Urea + DAP",
        "tips": "Keep the soil flooded during early growth and control weeds regularly.",
        "water_requirement": "High",
        "soil_compatibility": "Clay, Alluvial, Loamy",
        "icon": "🌾",
        "description": "Best for wet, warm growing conditions with ample rainfall.",
        "temp_range": [22, 32],
        "humidity_range": [70, 100],
        "rainfall_range": [50, 250]
    },
    {
        "crop": "Wheat",
        "soil_types": ["loamy", "alluvial", "black"],
        "seasons": ["rabi", "winter"],
        "recommended_fertilizer": "Nitrogen-rich fertilizer such as Urea and DAP",
        "tips": "Sow in cool weather and avoid waterlogging during the early stage.",
        "water_requirement": "Moderate",
        "soil_compatibility": "Loamy, Alluvial, Black",
        "icon": "🌾",
        "description": "Suitable for cool, dry winters and well-drained soils.",
        "temp_range": [10, 25],
        "humidity_range": [40, 70],
        "rainfall_range": [5, 50]
    },
    {
        "crop": "Maize",
        "soil_types": ["loamy", "sandy", "alluvial"],
        "seasons": ["kharif", "zaid", "summer"],
        "recommended_fertilizer": "Balanced NPK 20-20-20 or DAP",
        "tips": "Keep the soil moist and apply side-dressing after 25-30 days.",
        "water_requirement": "Moderate",
        "soil_compatibility": "Loamy, Sandy, Alluvial",
        "icon": "🌽",
        "description": "Good choice for warm seasons with moderate rainfall.",
        "temp_range": [20, 32],
        "humidity_range": [50, 80],
        "rainfall_range": [20, 100]
    },
    {
        "crop": "Cotton",
        "soil_types": ["black", "loamy", "alluvial"],
        "seasons": ["kharif", "summer"],
        "recommended_fertilizer": "NPK 10-26-26 with boron application",
        "tips": "Plant after rains and avoid excess moisture during boll formation.",
        "water_requirement": "Moderate",
        "soil_compatibility": "Black, Loamy, Alluvial",
        "icon": "🌿",
        "description": "Prefers warm, dry periods after initial rains.",
        "temp_range": [25, 35],
        "humidity_range": [40, 70],
        "rainfall_range": [30, 100]
    },
    {
        "crop": "Mustard",
        "soil_types": ["loamy", "clay", "alluvial"],
        "seasons": ["rabi", "winter"],
        "recommended_fertilizer": "DAP and potash fertilizer for strong growth",
        "tips": "Use well-drained land and avoid waterlogging during flowering.",
        "water_requirement": "Low",
        "soil_compatibility": "Loamy, Clay, Alluvial",
        "icon": "🌱",
        "description": "Good for cool winter season with moderate soil moisture.",
        "temp_range": [8, 22],
        "humidity_range": [30, 60],
        "rainfall_range": [5, 40]
    },
    {
        "crop": "Groundnut",
        "soil_types": ["sandy", "loamy"],
        "seasons": ["kharif", "summer"],
        "recommended_fertilizer": "Rhizobium inoculation and single super phosphate",
        "tips": "Ensure proper drainage and do not plant in waterlogged soil.",
        "water_requirement": "Moderate",
        "soil_compatibility": "Sandy, Loamy",
        "icon": "🥜",
        "description": "Best on light, well-drained soils in warm seasons.",
        "temp_range": [20, 32],
        "humidity_range": [40, 70],
        "rainfall_range": [30, 80]
    },
    {
        "crop": "Potato",
        "soil_types": ["loamy", "sandy", "alluvial"],
        "seasons": ["rabi", "winter", "spring"],
        "recommended_fertilizer": "High-potash fertilizer with DAP",
        "tips": "Prepare loose soil and maintain even moisture during tuber formation.",
        "water_requirement": "Moderate",
        "soil_compatibility": "Loamy, Sandy, Alluvial",
        "icon": "🥔",
        "description": "Ideal for cool months with good drainage.",
        "temp_range": [15, 24],
        "humidity_range": [50, 80],
        "rainfall_range": [10, 50]
    },
    {
        "crop": "Sugarcane",
        "soil_types": ["loamy", "alluvial", "black"],
        "seasons": ["kharif", "monsoon"],
        "recommended_fertilizer": "High NPK fertilizer and organic manure",
        "tips": "Maintain steady irrigation and avoid water stress.",
        "water_requirement": "High",
        "soil_compatibility": "Loamy, Alluvial, Black",
        "icon": "🍬",
        "description": "Thrives in warm, humid climates with steady water supply.",
        "temp_range": [22, 34],
        "humidity_range": [60, 90],
        "rainfall_range": [70, 200]
    }
]

VALID_SOIL_MAP = {
    "alluvial": "alluvial",
    "black": "black",
    "clay": "clay",
    "loamy": "loamy",
    "red": "red",
    "sandy": "sandy",
    "silty": "loamy",
    "peaty": "loamy",
    "chalky": "loamy",
    "forest": "loamy",
    "desert": "sandy",
    "mountain": "loamy"
}

SEASON_MAP = {
    "spring": "spring",
    "summer": "summer",
    "monsoon": "monsoon",
    "autumn": "autumn",
    "winter": "winter",
    "kharif": "kharif",
    "rabi": "rabi",
    "zaid": "zaid"
}


def _normalize_value(value: str, mapping: dict, default: str):
    if not value:
        return default
    value = value.strip().lower()
    return mapping.get(value, default)


def _compute_fit_score(profile, soil, season, weather):
    score = 0.0

    # soil match
    if soil in profile["soil_types"]:
        score += 0.35

    # season compatibility
    if season in profile["seasons"]:
        score += 0.25

    # temperature fit
    temp = weather.get("temperature", 25)
    min_t, max_t = profile["temp_range"]
    if min_t <= temp <= max_t:
        score += 0.18
    else:
        score -= min(abs(temp - max_t), abs(temp - min_t)) * 0.007

    # humidity fit
    humidity = weather.get("humidity", 60)
    min_h, max_h = profile["humidity_range"]
    if min_h <= humidity <= max_h:
        score += 0.12
    else:
        score -= min(abs(humidity - max_h), abs(humidity - min_h)) * 0.003

    # rainfall fit
    rainfall = weather.get("rainfall", 20)
    min_r, max_r = profile["rainfall_range"]
    if min_r <= rainfall <= max_r:
        score += 0.10
    else:
        score -= min(abs(rainfall - max_r), abs(rainfall - min_r)) * 0.002

    return max(0.0, min(score, 1.0))


def predict_crop_ml(soil_type: str, season: str, location: str, weather: dict, top_n=3):
    """Predict crops based on soil type, season, location and live weather."""
    soil = _normalize_value(soil_type, VALID_SOIL_MAP, "loamy")
    season = _normalize_value(season, SEASON_MAP, "kharif")

    scored = []
    for profile in CROP_PROFILES:
        score = _compute_fit_score(profile, soil, season, weather)
        if score > 0.05:
            entry = {
                "crop": profile["crop"],
                "confidence": float(round(score, 3)),
                "suitable_season": ", ".join(profile["seasons"]),
                "recommended_fertilizer": profile["recommended_fertilizer"],
                "tips": profile["tips"],
                "water_requirement": profile["water_requirement"],
                "soil_compatibility": profile["soil_compatibility"],
                "icon": profile["icon"],
                "description": profile["description"]
            }
            scored.append(entry)

    if not scored:
        fallback = CROP_PROFILES[0]
        scored = [{
            "crop": fallback["crop"],
            "confidence": 0.45,
            "suitable_season": ", ".join(fallback["seasons"]),
            "recommended_fertilizer": fallback["recommended_fertilizer"],
            "tips": fallback["tips"],
            "water_requirement": fallback["water_requirement"],
            "soil_compatibility": fallback["soil_compatibility"],
            "icon": fallback["icon"],
            "description": fallback["description"]
        }]

    scored.sort(key=lambda x: x["confidence"], reverse=True)
    return scored[:top_n]
