"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function MediaDetail() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;
  
  const [media, setMedia] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isMovie, setIsMovie] = useState<boolean>(true); 

  useEffect(() => {
    const fetchMediaDetail = async () => {
      try {
        const [moviesRes, musicRes] = await Promise.all([
          fetch("http://localhost:8000/api/media/movies?skip=0&limit=30"),
          fetch("http://localhost:8000/api/media/music?skip=0&limit=30")
        ]);
        
        const movies = await moviesRes.json();
        const music = await musicRes.json();
        
        const foundMovie = movies.find((m: any) => m._id === id);
        const foundMusic = music.find((m: any) => m._id === id);
        
        if (foundMovie) {
          setMedia(foundMovie);
          setIsMovie(true);
        } else if (foundMusic) {
          setMedia(foundMusic);
          setIsMovie(false);
        }
      } catch (error) {
        console.error("Detay çekme hatası:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchMediaDetail();
  }, [id]);

  if (loading) {
    return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-sky-400 text-2xl animate-pulse">İçerik Yükleniyor...</div>;
  }

  if (!media) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-slate-300 gap-4">
        <h1 className="text-3xl font-bold">İçerik Bulunamadı (404)</h1>
        <p>Aradığınız film veya müzik veritabanında bulunmuyor.</p>
        <button onClick={() => router.push("/")} className="mt-4 px-6 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-full transition-colors">
          Ana Sayfaya Dön
        </button>
      </div>
    );
  }

  // Yönlendirme Düzeltmesi: Siteye giderken geldiğimiz yeri gizliyoruz (noreferrer)
  const handleExternalLink = () => {
    if (isMovie) {
      window.open(`https://www.fullhdfilmizlesene.now/arama/${encodeURIComponent(media.title)}`, "_blank", "noopener,noreferrer");
    } else {
      window.open(`https://music.apple.com/tr/search?term=${encodeURIComponent(media.title)}`, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <main className="min-h-screen bg-slate-900 text-slate-50 p-8 font-sans">
      <div className="max-w-4xl mx-auto mt-10">
        
        {/* DEVASA GERİ DÖN BUTONU */}
        <button 
          onClick={() => router.push("/")} 
          className="mb-10 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-bold flex items-center gap-3 border border-slate-600 transition-all shadow-lg w-max"
        >
          <span className="text-2xl">←</span> Ana Sayfaya Geri Dön
        </button>

        <div className="bg-slate-800/50 rounded-3xl p-8 border border-slate-700/50 shadow-2xl flex flex-col md:flex-row gap-10">
          
          {/* Afiş / Kapak Görseli */}
          {media.image_url && (
            <div className="flex-shrink-0">
              <img 
                src={media.image_url} 
                alt={media.title} 
                className={`w-64 object-cover shadow-2xl ${isMovie ? 'h-96 rounded-2xl' : 'h-64 rounded-full border-4 border-emerald-500/30'}`} 
              />
            </div>
          )}

          {/* İçerik Bilgileri */}
          <div className="flex flex-col justify-center">
            <div className="inline-block px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-4 w-max bg-slate-700 text-slate-300">
              {isMovie ? '🎬 FİLM' : '🎵 MÜZİK'}
            </div>
            
            <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-emerald-400 mb-4">
              {media.title}
            </h1>
            
            <p className="text-lg text-slate-300 leading-relaxed mb-6">
              {media.description || "Bu içerik için açıklama bulunmuyor."}
            </p>

            {isMovie && media.vote_average !== undefined && media.vote_average > 0 && (
              <div className="flex items-center gap-2 text-xl font-medium text-emerald-400 mb-8">
                ⭐ TMDB Puanı: <span className="text-white">{media.vote_average.toFixed(1)} / 10</span>
              </div>
            )}

            <button 
              onClick={handleExternalLink}
              className="px-8 py-4 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold transition-all shadow-lg hover:shadow-sky-500/25 w-max"
            >
              {isMovie ? '▶ Tam Filmi İzle' : '▶ Apple Music\'te Dinle'}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}