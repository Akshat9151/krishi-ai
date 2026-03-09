import pandas as pd
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

DATA_PATH = os.path.join(
    BASE_DIR,
    "..",
    "crop_disease.csv"
)

# Load dataset once
df = pd.read_csv(DATA_PATH)

def predict_disease(crop_name: str):
    crop_name = crop_name.lower().strip()

    result = df[df["crop"].str.lower() == crop_name]

    if result.empty:
        return {
            "disease": "No data found",
            "symptoms": "N/A",
            "solution": "Consult agriculture expert"
        }

    row = result.iloc[0]
    return {
        "disease": row["disease"],
        "symptoms": row["symptoms"],
        "solution": row["solution"]
    }
