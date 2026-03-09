def predict_crop(soil, season, rainfall):
    soil = soil.lower()
    season = season.lower()

    if soil == "clay" and season == "kharif" and rainfall > 100:
        return "Rice 🌾"
    elif soil == "loamy" and season == "rabi":
        return "Wheat 🌾"
    elif soil == "sandy" and rainfall < 50:
        return "Bajra 🌾"
    elif season == "zaid":
        return "Maize 🌽"
    else:
        return "Mustard 🌱"
