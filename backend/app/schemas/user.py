from pydantic import BaseModel

# Kullanıcı kayıt olurken frontend'den gelecek veri modeli
class UserCreate(BaseModel):
    email: str
    password: str
    full_name: str

# Frontend'e dönülecek güvenli kullanıcı verisi (Şifre alanı hariç tutulur)
class UserResponse(BaseModel):
    email: str
    full_name: str
    
    class Config:
        from_attributes = True

# Başarılı giriş sonrası dönülecek JWT token yapısı
class Token(BaseModel):
    access_token: str
    token_type: str