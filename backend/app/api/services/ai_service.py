import json
from google import genai
from app.core.config import settings

client = None
if settings.GEMINI_API_KEY:
    client = genai.Client(api_key=settings.GEMINI_API_KEY)

async def generate_media_review(title: str, description: str) -> str:
    """Film veya müzik için 3 cümlelik, spoiler içermeyen yapay zeka tavsiyesi üretir."""
    if not client:
        return f"'{title}' için yapay zeka tavsiyesi henüz yapılandırılmadı."

    prompt = (
        f"Sen bir film ve müzik eleştirmenisin. Aşağıdaki içerik için izleyiciyi/dinleyiciyi "
        f"meraklandıracak, kesinlikle spoiler (sürprizbozan) İÇERMEYEN, tam 3 cümlelik çekici "
        f"bir tavsiye ve inceleme metni yaz.\n\n"
        f"Başlık: {title}\n"
        f"Açıklama: {description}\n"
    )

    try:
        response = await client.aio.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt
        )
        if response and response.text:
            return response.text.strip()
        return f"'{title}' mutlaka deneyimlenmesi gereken harika bir yapım."
    except Exception as e:
        print(f"Gemini API Hatası: {e}")
        return f"'{title}', zengin atmosferi ve etkileyici anlatımıyla öne çıkan dikkat çekici bir eser."

async def match_mood_with_media(user_mood: str, movies: list, music: list) -> dict:
    """Kullanıcının ruh halini analiz edip, verilen listelerden en uygun filmi ve müziği seçer."""
    if not client:
        return {"error": "Yapay zeka yapılandırılmadı."}

    movie_options = "\n".join([f"- {m.title}: {m.description[:100]}..." for m in movies[:30]])
    music_options = "\n".join([f"- {s.title}" for s in music[:30]])

    prompt = (
        f"Sen profesyonel bir yaşam tarzı ve sanat küratörüsün. Kullanıcının şu anki ruh hali: '{user_mood}'\n\n"
        f"Aşağıdaki film listesinden bu ruh haline GÖRE SADECE 1 FİLM seç:\n{movie_options}\n\n"
        f"Aşağıdaki müzik listesinden bu ruh haline GÖRE SADECE 1 ŞARKI seç:\n{music_options}\n\n"
        f"Lütfen yanıtını SADECE şu JSON formatında ver (başka hiçbir metin veya markdown ekleme):\n"
        f"{{\n"
        f"  \"movie_title\": \"seçtiğin filmin tam adı\",\n"
        f"  \"music_title\": \"seçtiğin şarkının tam adı\",\n"
        f"  \"reason\": \"Kullanıcıya doğrudan hitap eden, bu ikiliyi onun ruh hali için neden seçtiğini anlatan 2 cümlelik, samimi ve etkileyici bir açıklama.\"\n"
        f"}}"
    )

    # KÖKTEN ÇÖZÜM: Hata toleranslı model havuzu (Fallback Mekanizması)
    # Sistem sırayla bu modelleri deneyecek. Biri meşgulse (503), anında diğerine geçecek.
    fallback_models = [
        'gemini-flash-latest',       # En yüksek kapasiteli ve stabil olan
        'gemini-flash-lite-latest',  # Çok hafif ve hızlı olan
        'gemini-2.5-flash',          # Önceki denediğimiz
        'gemini-pro-latest',
        'gemini-1.5-flash'          # Son çare ağır model
    ]

    for model_name in fallback_models:
        try:
            response = await client.aio.models.generate_content(
                model=model_name,
                contents=prompt
            )
            
            clean_text = response.text.strip().replace("```json", "").replace("```", "")
            result = json.loads(clean_text)
            
            # Başarılı olursa (200 OK), sonucu dön ve döngüyü bitir
            return result
            
        except Exception as e:
            # Hata alırsa çökmek yerine loga yazdırıp listedeki bir sonraki modele geçer
            print(f"[{model_name}] meşgul veya hata verdi, yedeğe geçiliyor... Hata: {str(e)[:50]}")
            continue

    # Eğer 4 modelin 4'ü de Google sunucularında aynı anda çökmüşse (çok nadir):
    return {"error": "Google Yapay Zeka sunucuları şu an kapasite sınırında. Lütfen birkaç saniye sonra tekrar deneyin."}