import os
import pandas as pd
import joblib
from sklearn.ensemble import RandomForestClassifier

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

DATA_PATH = os.path.join(
    BASE_DIR,
    "..",
    "Crop_Recommendation.csv"
)

MODEL_PATH = os.path.join(BASE_DIR, "crop_model.pkl")


def train_model():
    print("📊 Training ML model...")
    print(f"📁 Dataset: {DATA_PATH}")

    df = pd.read_csv(DATA_PATH)

    # 🔥 AUTO DETECT TARGET COLUMN
    TARGET_COL = df.columns[-1]   # last column = crop label

    print("🎯 Target column detected:", TARGET_COL)

    X = df.drop(TARGET_COL, axis=1)
    y = df[TARGET_COL]

    model = RandomForestClassifier(
        n_estimators=150,
        random_state=42
    )

    model.fit(X, y)

    joblib.dump(model, MODEL_PATH)
    print("✅ Model trained & saved at:", MODEL_PATH)


def load_model():
    try:
        return joblib.load(MODEL_PATH)
    except Exception as e:
        print("⚠️ Model load failed, retraining...")
        print("Reason:", e)
        train_model()
        return joblib.load(MODEL_PATH)


model = load_model()


def predict_crop_ml(N, P, K, temperature, humidity, ph, rainfall):
    features = [[
        N, P, K,
        temperature,
        humidity,
        ph,
        rainfall
    ]]
    return model.predict(features)[0]
