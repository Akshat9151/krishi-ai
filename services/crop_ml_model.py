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
    return model


def load_model():
    try:
        return joblib.load(MODEL_PATH)
    except Exception as e:
        print("⚠️ Model load failed, retraining...")
        print("Reason:", e)
        m = train_model()
        return m


model = load_model()


def _get_top_n_predictions(model, features, n=3):
    """Return top-n predictions with confidence scores as list of (label, score)."""
    # ensure features shaped properly
    probs = None
    labels = None
    try:
        probs = model.predict_proba(features)
        labels = model.classes_
    except Exception:
        # model may not support predict_proba; fall back to predict
        preds = model.predict(features)
        return [(preds[0], 1.0)]

    # get top n for first row
    row = probs[0]
    top_idx = row.argsort()[::-1][:n]
    return [(labels[i], float(row[i])) for i in top_idx]


def predict_crop_ml(N, P, K, temperature, humidity, ph, rainfall, top_n=3):
    """Predict crops and return top-N recommendations with confidences.

    Returns list of dicts: [{"crop": label, "confidence": score}, ...]
    Also prints inputs for debugging.
    """
    features = [[
        N, P, K,
        temperature,
        humidity,
        ph,
        rainfall
    ]]

    print("[crop_ml] Predicting with features:", features)

    try:
        top = _get_top_n_predictions(model, features, n=top_n)
        return [{"crop": t[0], "confidence": t[1]} for t in top]
    except Exception as e:
        print("[crop_ml] Prediction failed:", e)
        # attempt to retrain and retry once
        try:
            # retrain and reload global model
            global model
            model = train_model()
            top = _get_top_n_predictions(model, features, n=top_n)
            return [{"crop": t[0], "confidence": t[1]} for t in top]
        except Exception as e2:
            print("[crop_ml] Retry failed:", e2)
            # fallback single generic prediction
            try:
                pred = model.predict(features)[0]
                return [{"crop": pred, "confidence": 1.0}]
            except Exception:
                return [{"crop": "Unknown", "confidence": 0.0}]
