import random
import requests

from utils.config import OLLAMA_MODEL, OLLAMA_BASE_URL, MAX_NEW_TOKENS, TOP_P, TOP_K


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


def _normalize_text(text: str) -> str:
    return text.lower().strip()


def _keyword_reply(question: str) -> str:
    q = _normalize_text(question)

    if any(word in q for word in ["disease", "daag", "pata", "infection", "safeda", "peela", "kaanta", "kali"]):
        return (
            "Fasal ke patton par dhyan dijiye. Sabse pehle sukhe aur kharab patton ko hataiye, "
            "phir kisi trusted fungicide ya pesticide ka istemal kijiye. Jeevan ke liye paani aur poshan ko barqaraar rakhiye."
        )

    if any(word in q for word in ["pani", "irrigation", "sookha", "dry", "watering", "rain", "barish"]):
        return (
            "Zameen ko behtar tarah se dekh kar paani dijiye. Agar zameen bahut sookhi ho to subah ya shaam halka pani dein, "
            "aur zyada barish se bachne ke liye drainage theek rakhen."
        )

    if any(word in q for word in ["khad", "fertilizer", "urea", "dap", "mop", "nitrogen", "phosphorus", "potassium"]):
        return (
            "Fasal ke liye sahi fertilizer chunna zaroori hai. Agar mitti medium ya slightly acidic ho to balanced NPK fertilizer ka istemal kijiye, "
            "aur sahi matra ke liye soil test karwayein."
        )

    if any(word in q for word in ["crop", "kya ugaye", "faisal", "fasal", "kheti", "season", "soil", "zameen"]):
        return (
            "Khet ki mitti, mausam aur paani ko dekh kar crop chunna chahiye. Aam taur par wheat, rice ya maize ka chayan aapki mitti aur season par depend karta hai. "
            "Hamesha local weather aur soil quality ko dhyan mein rakhen."
        )

    if any(word in q for word in ["weather", "taapmaan", "mosam", "temperature", "forecast"]):
        return (
            "Mausam ki jankari bahut mahatvapurn hai. Agar barish kam ho rahi hai to irrigation schedule theek kijiye, "
            "aur agar thand pad rahi hai to fasal ko suraksha dene ke liye cover ya mulch ka istemal kijiye."
        )

    return (
        "Is samasya ke liye sahi fertilizer, paani aur crop management bahut zaroori hai. "
        "Aap local Krishi Vigyan Kendra se soil test karwa ke behtar nirnay le sakte hain."
    )


# ===============================
# 🤖 Ollama Integration
# ===============================

class OllamaChat:
    def __init__(self, model_name: str):
        self.model = model_name
        self.base_url = OLLAMA_BASE_URL.rstrip("/")
        self.available = self._check()

    def _check(self) -> bool:
        try:
            r = requests.get(f"{self.base_url}/tags", timeout=5)
            return r.status_code == 200
        except Exception:
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
                f"{self.base_url}/generate",
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

    return farmer_style(_keyword_reply(question))
