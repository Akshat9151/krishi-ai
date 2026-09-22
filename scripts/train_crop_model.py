"""Train and persist the crop recommendation classifier."""

from pathlib import Path

import joblib
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score


ROOT = Path(__file__).resolve().parents[1]
DATA_PATH = ROOT / "Crop_Recommendation.csv"
MODEL_PATH = ROOT / "models" / "crop_recommendation.joblib"
FEATURES = ["Nitrogen", "Phosphorus", "Potassium", "Temperature", "Humidity", "pH_Value", "Rainfall"]


def train() -> float:
    data = pd.read_csv(DATA_PATH)
    missing = set(FEATURES + ["Crop"]) - set(data.columns)
    if missing:
        raise ValueError(f"Dataset is missing columns: {', '.join(sorted(missing))}")
    data = data.dropna(subset=FEATURES + ["Crop"])
    X = data[FEATURES]
    y = data["Crop"].astype(str)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    model = RandomForestClassifier(
        n_estimators=300,
        random_state=42,
        class_weight="balanced",
        n_jobs=-1,
    )
    model.fit(X_train, y_train)
    accuracy = accuracy_score(y_test, model.predict(X_test))
    MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(
        {
            "model": model,
            "features": FEATURES,
            "medians": X.median().to_dict(),
            "dataset": DATA_PATH.name,
            "test_accuracy": float(accuracy),
        },
        MODEL_PATH,
    )
    print(f"trained_rows={len(data)} test_accuracy={accuracy:.4f} model={MODEL_PATH}")
    return float(accuracy)


if __name__ == "__main__":
    train()
