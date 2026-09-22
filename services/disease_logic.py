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

def predict_disease(crop_name: str, observed_symptoms: str = ""):
    crop_name = crop_name.lower().strip()

    result = df[df["crop"].str.lower() == crop_name]

    if result.empty:
        return {
            "disease": "No data found",
            "symptoms": "N/A",
            "solution": "Consult agriculture expert"
        }

    row = result.iloc[0]
    symptoms = str(row["symptoms"])
    observed = (observed_symptoms or "").strip().lower()
    matched_terms = [
        term for term in observed.replace(",", " ").split()
        if len(term) > 3 and term in symptoms.lower()
    ]
    return {
        "disease": row["disease"],
        "symptoms": symptoms,
        "solution": row["solution"],
        "symptom_match": bool(matched_terms),
        "matched_symptoms": matched_terms[:8],
    }
