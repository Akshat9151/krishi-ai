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
        f"&current=temperature_2m,relative_humidity_2m"
        f"&daily=precipitation_sum"
        f"&timezone=auto"
    )

    res = requests.get(url)
    data = res.json()

    return {
        "temperature": data["current"]["temperature_2m"],
        "humidity": data["current"]["relative_humidity_2m"],
        "rainfall": data["daily"]["precipitation_sum"][0]
    }
