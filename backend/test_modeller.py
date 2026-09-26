import os
from dotenv import load_dotenv
from google import genai

# .env'den API anahtarını otomatik çeker
load_dotenv()
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

print("Hesabınızdaki Aktif ve Geçerli Modeller:")
try:
    for model in client.models.list():
        print(f"- {model.name}")
except Exception as e:
    print("Bağlantı Hatası:", e)