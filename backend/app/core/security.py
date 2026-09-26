import bcrypt
import jwt
from datetime import datetime, timedelta
from app.core.config import settings

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Girilen şifreyi 72 byte sınırına uygun olarak doğrular."""
    # Bcrypt 72 byte limitini aşmamak için ilk 72 byte dilimlenir
    password_bytes = plain_password.encode("utf-8")[:72]
    hashed_bytes = hashed_password.encode("utf-8")
    return bcrypt.checkpw(password_bytes, hashed_bytes)

def get_password_hash(password: str) -> str:
    """Şifreyi 72 byte sınırına uygun olarak hashler."""
    password_bytes = password.encode("utf-8")[:72]
    salt = bcrypt.gensalt()
    hashed_bytes = bcrypt.hashpw(password_bytes, salt)
    return hashed_bytes.decode("utf-8")

def create_access_token(data: dict) -> str:
    """JWT access token üretir."""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)