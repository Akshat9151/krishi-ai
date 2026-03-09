import random
import requests

from utils.config import OLLAMA_MODEL, MAX_NEW_TOKENS, TOP_P, TOP_K


# ===============================
# 🧠 Helper
# ===============================

def farmer_style(sentence: str) -> str:
    fillers = [
        "Dekho bhai,",
        "Acha sawal hai,",
        "Samjho aise,",
        "Chinta mat karo,",
        "Simple language me bolta hoon,"
    ]
    return f"{random.choice(fillers)} {sentence}"


# ===============================
# 🤖 Ollama Integration
# ===============================

class OllamaChat:
    def __init__(self, model_name: str):
        self.model = model_name
        self.base_url = "http://localhost:11434"
        self.available = self._check()

    def _check(self) -> bool:
        try:
            r = requests.get(f"{self.base_url}/api/tags", timeout=5)
            return r.status_code == 200
        except:
            return False

    def generate(self, user_message: str) -> str:
        prompt = f"""
You are Krishi AI, an expert Indian agriculture assistant.

Rules:
- Answer in Hindi / Hinglish / English (farmer friendly)
- Practical crop, disease, fertilizer & weather advice
- Short, actionable steps

Farmer Question:
{user_message}

Answer:
"""
        try:
            res = requests.post(
                f"{self.base_url}/api/generate",
                json={
                    "model": self.model,
                    "prompt": prompt,
                    "stream": False,
                    "options": {
                        "temperature": 0.7,
                        "top_p": TOP_P,
                        "top_k": TOP_K,
                        "num_predict": MAX_NEW_TOKENS
                    }
                },
                timeout=60
            )

            return res.json().get("response", "").strip()

        except Exception as e:
            print("❌ Ollama error:", e)
            return ""


ollama = OllamaChat(OLLAMA_MODEL)


# ===============================
# 🌾 MAIN FUNCTION (USED BY ROUTES)
# ===============================

def krishi_ai_reply(question: str) -> str:
    """
    🔥 IMPORTANT:
    - ALWAYS return STRING
    - NEVER return dict
    """

    if not question or not question.strip():
        return "Kripya apna farming sawal likhiye."

    if ollama.available:
        reply = ollama.generate(question)
        if reply:
            return farmer_style(reply)

    # fallback (safe)
    return farmer_style(
        "Is samasya ke liye sahi fertilizer, paani aur crop management bahut zaroori hai."
    )
