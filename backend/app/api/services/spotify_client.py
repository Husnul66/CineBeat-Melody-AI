import httpx

async def fetch_new_releases(limit: int = 15) -> list:
    """
    Apple iTunes Search API üzerinden popüler müzikleri çeker.
    API anahtarı gerektirmez.
    """
    url = f"https://itunes.apple.com/search?term=populer&entity=song&limit={limit}&country=tr"
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(url)
            if response.status_code == 200:
                data = response.json()
                results = data.get("results", [])
                
                formatted_items = []
                for item in results:
                    formatted_items.append({
                        "id": str(item.get("trackId")),
                        "name": item.get("trackName", "Bilinmeyen Parça"),
                        "artists": [{"name": item.get("artistName", "Bilinmeyen Sanatçı")}],
                        "images": [{"url": item.get("artworkUrl100", "").replace("100x100bb", "600x600bb")}],
                        "release_date": (item.get("releaseDate") or "")[:10]
                    })
                return formatted_items
    except Exception as e:
        print(f"Müzik servisi bağlantı hatası: {e}")
    return []