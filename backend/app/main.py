from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import init_db
from app.api.routes import auth, media

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Veritabanı bağlantısı kuruluyor...")
    await init_db()
    print("Veritabanı bağlantısı başarıyla kuruldu.")
    yield
    print("Uygulama kapatılıyor...")

app = FastAPI(
    title="CineBeat & Melody AI",
    description="Yapay Zeka Destekli Film ve Müzik Öneri Platformu API'si",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Middleware Ayarları - Frontend (Next.js) bağlantısı için şarttır
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js uygulamasının adresi
    allow_credentials=True,
    allow_methods=["*"],  # GET, POST, PUT, DELETE vb. tüm metodlara izin verir
    allow_headers=["*"],  # Tüm header'lara (Authorization dahil) izin verir
)

app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(media.router, prefix="/api/media", tags=["Media & AI"])

@app.get("/")
async def root():
    return {"message": "CineBeat & Melody AI Backend Servisine Hoş Geldiniz!"}