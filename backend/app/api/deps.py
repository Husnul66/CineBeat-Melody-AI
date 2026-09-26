from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
import jwt
from bson import ObjectId
from app.core.config import settings
from app.models.user import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

async def get_current_user(token: str = Depends(oauth2_scheme)) -> User:
    try:
        # Token decode işlemi
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token içinde kullanıcı kimliği (sub) bulunamadı.",
                headers={"WWW-Authenticate": "Bearer"},
            )
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Oturum süresi dolmuş. Lütfen tekrar giriş yapın.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Token doğrulama hatası: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Veritabanında ID üzerinden kullanıcıyı bul (Hem ObjectId hem str dener)
    user = None
    try:
        if ObjectId.is_valid(user_id):
            user = await User.get(ObjectId(user_id))
    except Exception:
        pass

    if not user:
        user = await User.find_one({"_id": user_id})

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"ID'si '{user_id}' olan kullanıcı veritabanında bulunamadı.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return user