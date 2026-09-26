from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, BackgroundTasks
from beanie import PydanticObjectId
from pydantic import BaseModel, EmailStr

from app.models.media import Media, MediaType
from app.models.user import User
from app.api.deps import get_current_user
from app.api.services.data_sync import sync_movies_to_db, sync_music_to_db
from app.api.services.ai_service import generate_media_review, match_mood_with_media
from app.api.services.email_service import send_weekly_newsletter_sync

router = APIRouter()

# Ruh hali isteği için veri modeli
class MoodRequest(BaseModel):
    mood: str

# Abonelik isteği için veri modeli (Sadece E-posta)
class SubscribeRequest(BaseModel):
    email: EmailStr

@router.post("/sync")
async def sync_media_data(current_user: User = Depends(get_current_user)):
    """TMDB ve Spotify servislerinden popüler verileri çeker ve kaydeder."""
    movies_added = await sync_movies_to_db()
    music_added = await sync_music_to_db()
    return {
        "message": "Senkronizasyon başarılı",
        "movies_added": movies_added,
        "music_added": music_added
    }

@router.get("/movies", response_model=List[Media])
async def get_movies(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=50)
):
    """Veritabanındaki filmleri listeler (Herkese Açık)."""
    return await Media.find(Media.media_type == MediaType.MOVIE).skip(skip).limit(limit).to_list()

@router.get("/music", response_model=List[Media])
async def get_music(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=50)
):
    """Veritabanındaki müzikleri listeler (Herkese Açık)."""
    return await Media.find(Media.media_type == MediaType.MUSIC).skip(skip).limit(limit).to_list()

@router.post("/mood-sync")
async def mood_sync_endpoint(request: MoodRequest):
    """Kullanıcının ruh halini AI ile analiz edip veritabanından en uygun eşleşmeyi döner (Herkese Açık)."""
    # Gemini'ye göndermek için veritabanından örnekler çekiyoruz
    movies = await Media.find(Media.media_type == MediaType.MOVIE).limit(30).to_list()
    music = await Media.find(Media.media_type == MediaType.MUSIC).limit(30).to_list()
    
    result = await match_mood_with_media(request.mood, movies, music)
    return result

@router.get("/{media_id}/ai-comment")
async def get_ai_comment(media_id: PydanticObjectId, current_user: User = Depends(get_current_user)):
    """Seçilen içerik için Google Gemini üzerinden yapay zeka tavsiyesi üretir."""
    media = await Media.get(media_id)
    if not media:
        raise HTTPException(status_code=404, detail="İçerik bulunamadı.")
    
    comment = await generate_media_review(media.title, media.description or "")
    return {
        "media_id": str(media.id),
        "title": media.title,
        "ai_comment": comment
    }

@router.post("/subscribe")
async def subscribe_newsletter(
    request: SubscribeRequest,
    background_tasks: BackgroundTasks
):
    """Kullanıcının e-postasını alır ve haftalık bülteni arka planda gönderir (Herkese Açık)."""
    
    popular_movies = await Media.find(Media.media_type == MediaType.MOVIE).limit(3).to_list()
    popular_music = await Media.find(Media.media_type == MediaType.MUSIC).limit(3).to_list()

    # E-posta gönderme işlemini arka plana (BackgroundTasks) atıyoruz ki kullanıcı beklememiş olsun
    background_tasks.add_task(
        send_weekly_newsletter_sync,
        to_email=request.email,
        movies=popular_movies,
        music=popular_music
    )

    return {
        "message": "Harika! Haftalık bültenimize başarıyla abone oldunuz. İlk trend listemiz e-postanıza gönderiliyor.",
        "recipient": request.email,
        "status": "queued"
    }