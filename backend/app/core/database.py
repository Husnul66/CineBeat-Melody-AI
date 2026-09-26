from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.core.config import settings
from app.models.user import User, Preference
from app.models.media import Media

async def init_db():
    client = AsyncIOMotorClient(
        settings.MONGODB_URL,
        serverSelectionTimeoutMS=10000,
        connectTimeoutMS=10000,
        socketTimeoutMS=20000,
        retryWrites=True,
        readPreference="secondaryPreferred"
    )
    
    db = client[settings.DATABASE_NAME]
    
    await init_beanie(
        database=db,
        document_models=[User, Preference, Media]
    )
    print("Veritabanı bağlantısı başarıyla kuruldu ve modeller tanıtıldı.")