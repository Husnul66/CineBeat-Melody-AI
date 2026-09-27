# 🎬🎵 CineBeat & Melody AI

> "Sadece ne izleyeceğini veya dinleyeceğini değil, nasıl hissedeceğini seç."

**CineBeat & Melody AI**, kullanıcıların anlık ruh hallerine (mood) göre Google Gemini AI altyapısını kullanarak en uygun film ve müzikleri öneren, yeni nesil bir medya tavsiye ve eşleştirme platformudur. Gelişmiş asenkron backend mimarisi ve modern arayüzü ile kesintisiz bir deneyim sunar.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![FastAPI](https://img.shields.io/badge/FastAPI-0.109-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Google_GenAI-2.5_Flash-4285F4?style=for-the-badge&logo=google&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

---

## ✨ Öne Çıkan Özellikler

* **🧠 Mood Sync (Yapay Zeka Eşleştirme):** Kullanıcı "Yağmurlu ve melankolik hissediyorum" yazdığında, Gemini AI modeli bu duygu durumunu analiz eder ve TMDB/iTunes veritabanları üzerinden en uygun film ile müziği eşleştirir.
* **🛡️ Dinamik Model Fallback:** Yoğunluk kaynaklı API hatalarına (503) karşı sistem, otomatik olarak alternatif AI modellerine geçiş yaparak kesintisiz hizmet verir.
* **🔗 Akıllı Yönlendirme & Referrer Kalkanı:** Harici sinema sitelerinin bot/yönlendirme korumaları `noopener, noreferrer` politikalarıyla aşılarak doğrudan kesintisiz film izleme deneyimi sunulur.
* **⚡ Yüksek Performans:** FastAPI, Motor (Asenkron MongoDB) ve Beanie ODM kullanılarak uçtan uca asenkron bir veri akışı sağlanmıştır.

---

## 🏗️ Mimari ve Teknolojiler

### Backend (Klasör: `/backend`)
* **Framework:** Python, FastAPI, Uvicorn
* **Veritabanı:** MongoDB Atlas, Beanie ODM, Motor (Async)
* **Yapay Zeka:** `google-genai` (Gemini 2.5 Flash / 1.5 Pro)
* **Entegrasyonlar:** TMDB API v4, Apple iTunes Search API, SMTP (Bülten)

### Frontend (Klasör: `/frontend`)
* **Framework:** React, Next.js (App Router)
* **Tasarım:** Tailwind CSS
* **Özellikler:** Dinamik Yönlendirme (`/media/[id]`), Asenkron Veri Çekme, Responsive Tasarım

---

## 🚀 Kurulum ve Çalıştırma

Projeyi yerel makinenizde (localhost) çalıştırmak için aşağıdaki adımları izleyin.

### 1. Depoyu Klonlayın
```bash
git clone [https://github.com/KULLANICI_ADIN/REPO_ADIN.git](https://github.com/KULLANICI_ADIN/REPO_ADIN.git)
cd "REPO_ADIN"

##Backend Kurulumu

Backend klasörüne geçin, sanal ortamı oluşturun ve bağımlılıkları yükleyin:

cd backend
python -m venv venv
source venv/bin/activate  # Linux/macOS için
# venv\Scripts\activate   # Windows için
pip install -r requirements.txt

Ortam Değişkenleri (.env):
backend klasörü içine .env adında bir dosya oluşturun ve API anahtarlarınızı ekleyin:

MONGODB_URI=mongodb+srv://<kullanici_adi>:<sifre>@cluster.mongodb.net/
GEMINI_API_KEY=senin_gemini_anahtarin
TMDB_BEARER_TOKEN=senin_tmdb_v4_read_access_token
SMTP_EMAIL=senin_mail_adresin@gmail.com
SMTP_PASSWORD=uygulama_sifren

Sunucuyu Başlatma:

python -m uvicorn app.main:app --reload

Frontend Kurulumu

Yeni bir terminal açın ve frontend klasörüne geçin:
cd frontend
npm install
npm run dev
```
<img width="868" height="396" alt="image" src="https://github.com/user-attachments/assets/2a927cb8-86ba-43f4-9ec1-a9159ca493c2" />

<img width="877" height="523" alt="image" src="https://github.com/user-attachments/assets/54addf61-884a-4c1c-be98-a126551d7669" />
<img width="1127" height="609" alt="image" src="https://github.com/user-attachments/assets/8b76f914-fa68-4976-9cc0-15ab888a193d" />
<img width="1130" height="327" alt="image" src="https://github.com/user-attachments/assets/73abecf4-b9dd-443f-a374-48b3445dc7f5" />
<img width="726" height="487" alt="image" src="https://github.com/user-attachments/assets/c1914471-500b-4554-9f06-5ee8922642d6" />
<img width="1178" height="120" alt="image" src="https://github.com/user-attachments/assets/e03a47ba-0a9e-46cb-bb85-1f439fec03b6" />








