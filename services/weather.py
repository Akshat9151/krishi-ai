import requests

# ----------------------------
# 1️⃣ Get Latitude & Longitude
# ----------------------------
def get_lat_lon(city: str):
    url = (
        f"https://geocoding-api.open-meteo.com/v1/search"
        f"?name={city}&count=1"
    )

    res = requests.get(url)
    data = res.json()

    if "results" not in data:
        raise Exception("City not found")

    lat = data["results"][0]["latitude"]
    lon = data["results"][0]["longitude"]

    return lat, lon


# ----------------------------
# 2️⃣ Get Weather Data (REAL)
# ----------------------------
def get_weather(city: str):
    lat, lon = get_lat_lon(city)

    url = (
        f"https://api.open-meteo.com/v1/forecast"
        f"?latitude={lat}&longitude={lon}"
        f"&current=temperature_2m,relative_humidity_2m,wind_speed_10m"
        f"&daily=precipitation_sum"
        f"&timezone=auto"
    )

    res = requests.get(url)
    data = res.json()

    return {
        "temperature": data["current"]["temperature_2m"],
        "humidity": data["current"]["relative_humidity_2m"],
        "rainfall": data["daily"]["precipitation_sum"][0],
        "wind_speed": data["current"]["wind_speed_10m"]
    }


# ----------------------------
# 3️⃣ Get Farming Recommendations
# ----------------------------
def get_farming_recommendations(weather_data: dict) -> str:
    """
    Generate farming recommendations based on weather data
    """
    temp = weather_data["temperature"]
    humidity = weather_data["humidity"]
    rainfall = weather_data["rainfall"]
    wind_speed = weather_data["wind_speed"]

    recommendations = []

    # Temperature-based recommendations
    if temp > 35:
        recommendations.append("🌡️ Temperature is high. Increase irrigation frequency and provide shade to sensitive crops.")
    elif temp < 10:
        recommendations.append("❄️ Temperature is low. Consider frost protection measures for sensitive crops.")
    elif 20 <= temp <= 30:
        recommendations.append("✅ Temperature is ideal for most crops. Continue regular irrigation schedule.")

    # Humidity-based recommendations
    if humidity > 80:
        recommendations.append("💧 High humidity may lead to fungal diseases. Monitor crops for signs of infection and ensure proper ventilation.")
    elif humidity < 40:
        recommendations.append("🏜️ Low humidity. Increase irrigation to prevent water stress in crops.")

    # Rainfall-based recommendations
    if rainfall > 50:
        recommendations.append("🌧️ Heavy rainfall expected. Ensure proper drainage to prevent waterlogging and root rot.")
    elif rainfall > 20:
        recommendations.append("🌦️ Moderate rainfall. Reduce irrigation frequency and monitor soil moisture.")
    elif rainfall == 0:
        recommendations.append("☀️ No rainfall expected. Maintain regular irrigation schedule.")

    # Wind-based recommendations
    if wind_speed > 20:
        recommendations.append("💨 Strong winds expected. Provide support to tall crops and secure irrigation systems.")
    elif wind_speed > 10:
        recommendations.append("🍃 Moderate winds. Monitor crops for wind damage and adjust irrigation if needed.")

    if not recommendations:
        recommendations.append("✅ Weather conditions are favorable. Continue regular farming practices.")

    return "\n\n".join(recommendations)
