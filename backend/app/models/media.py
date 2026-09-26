from enum import Enum
from typing import Optional
from beanie import Document

class MediaType(str, Enum):
    MOVIE = "movie"
    MUSIC = "music"

class Media(Document):
    title: str
    media_type: MediaType
    external_id: str
    description: Optional[str] = None
    image_url: Optional[str] = None
    release_date: Optional[str] = None
    vote_average: Optional[float] = 0.0

    class Settings:
        name = "media_items"