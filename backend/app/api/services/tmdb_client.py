import httpx
from fastapi import HTTPException
from app.core.config import settings

async def fetch_popular_movies(page: int = 1) -> list:
    """TMDB API'sinden popüler filmleri çeker."""
    api_key = settings.TMDB_API_KEY.strip().strip('"').strip("'")
    
    headers = {"accept": "application/json"}
    params = {"language": "tr-TR", "page": page}

    # v4 token Bearer Authorization ile gönderilir; v3 key parametre olarak eklenir
    if api_key.startswith("eyJ"):
        headers["Authorization"] = f"Bearer {api_key}"
    else:
        params["api_key"] = api_key

    url = f"{settings.TMDB_BASE_URL}/movie/popular"
    
    async with httpx.AsyncClient(timeout=15.0) as client:
        response = await client.get(url, params=params, headers=headers)
        
        if response.status_code != 200:
            raise HTTPException(
                status_code=response.status_code,
                detail=f"TMDB servisinden veri alınamadı: {response.text}"
            )
            
        data = response.json()
        results = data.get("results", [])
        if isinstance(results, list):
            return results
        return []