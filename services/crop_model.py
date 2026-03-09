import os
import joblib
import numpy as np
import pandas as pd
from sklearn.tree import DecisionTreeClassifier

MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "model.pkl")

# ------------------ TRAIN IF NOT EXISTS ------------------
if not os.path.exists(MODEL_PATH):

    data = {
        "temperature": [20, 25, 30, 35, 40, 22, 28, 32],
        "humidity": [30, 40, 50, 60, 70, 65, 55, 45],
        "soil_type": ["sandy", "loamy", "clay", "loamy", "sandy", "clay", "loamy", "sandy"],
        "season": ["rabi", "kharif", "rabi", "kharif", "rabi", "kharif", "rabi", "kharif"],
        "crop": ["Wheat", "Rice", "Wheat", "Rice", "Wheat", "Rice", "Wheat", "Rice"],
    }

    df = pd.DataFrame(data)

    df["soil_type"] = df["soil_type"].map({"sandy": 0, "loamy": 1, "clay": 2})
    df["season"] = df["season"].map({"rabi": 0, "kharif": 1})
    df["crop"] = df["crop"].map({"Wheat": 0, "Rice": 1})

    X = df[["temperature", "humidity", "soil_type", "season"]]
    y = df["crop"]

    model = DecisionTreeClassifier()
    model.fit(X, y)

    joblib.dump(model, MODEL_PATH)

else:
    model = joblib.load(MODEL_PATH)

# ------------------ PREDICTION ------------------
def predict_crop(soil_type, season, temperature, humidity):

    soil_map = {"sandy": 0, "loamy": 1, "clay": 2}
    season_map = {"rabi": 0, "kharif": 1}

    X = np.array([[temperature, humidity,
                   soil_map.get(soil_type.lower(), 0),
                   season_map.get(season.lower(), 0)]])

    pred = model.predict(X)[0]

    return "Wheat" if pred == 0 else "Rice"
