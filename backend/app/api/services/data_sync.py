from app.api.services.tmdb_client import fetch_popular_movies
from app.api.services.spotify_client import fetch_new_releases
from app.models.media import Media, MediaType

async def sync_movies_to_db() -> int:
    """TMDB'den popüler filmleri çeker ve veritabanına ekler."""
    try:
        movies = await fetch_popular_movies()
    except Exception as e:
        print(f"TMDB fetch hatası: {e}")
        return 0

    if not isinstance(movies, list):
        return 0

    count = 0
    for item in movies:
        if not isinstance(item, dict):
            continue

        try:
            external_id = str(item.get("id"))
            existing = await Media.find_one(
                Media.external_id == external_id,
                Media.media_type == MediaType.MOVIE
            )
            if not existing:
                poster_path = item.get("poster_path")
                image_url = f"https://image.tmdb.org/t/p/w500{poster_path}" if poster_path else None
                
                media = Media(
                    title=item.get("title") or item.get("original_title") or "İsimsiz Film",
                    media_type=MediaType.MOVIE,
                    external_id=external_id,
                    description=item.get("overview") or "",
                    image_url=image_url,
                    release_date=item.get("release_date") or None,
                    vote_average=float(item.get("vote_average") or 0.0)
                )
                await media.insert()
                count += 1
        except Exception as inner_err:
            print(f"Film ekleme hatası: {inner_err}")
            continue

    return count

async def sync_music_to_db() -> int:
    """Popüler müzikleri çeker ve veritabanına ekler."""
    try:
        albums = await fetch_new_releases()
    except Exception as e:
        print(f"Müzik fetch hatası: {e}")
        return 0

    if not isinstance(albums, list):
        return 0

    count = 0
    for item in albums:
        if not isinstance(item, dict):
            continue

        try:
            external_id = str(item.get("id"))
            existing = await Media.find_one(
                Media.external_id == external_id,
                Media.media_type == MediaType.MUSIC
            )
            if not existing:
                images = item.get("images", [])
                image_url = images[0].get("url") if images else None
                artists_list = [a.get("name") for a in item.get("artists", []) if a.get("name")]
                artists = ", ".join(artists_list) if artists_list else "Bilinmeyen Sanatçı"
                
                media = Media(
                    title=f"{item.get('name', 'İsimsiz Parça')} - {artists}",
                    media_type=MediaType.MUSIC,
                    external_id=external_id,
                    description=f"Sanatçılar: {artists}",
                    image_url=image_url,
                    release_date=item.get("release_date") or None
                )
                await media.insert()
                count += 1
        except Exception as inner_err:
            print(f"Müzik ekleme hatası: {inner_err}")
            continue

    return count