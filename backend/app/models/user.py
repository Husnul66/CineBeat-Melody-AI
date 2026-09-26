from beanie import Document
from pydantic import Field
from datetime import datetime
from typing import List

class User(Document):
    email: str
    full_name: str
    hashed_password: str
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "users" # MongoDB'deki koleksiyon (tablo) adı

class Preference(Document):
    user_id: str
    favorite_movie_genres: List[str] = []
    favorite_music_genres: List[str] = []
    
    class Settings:
        name = "preferences"