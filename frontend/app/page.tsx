"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import Contact from "@/components/Contact";

export default function Home() {
  const [movies, setMovies] = useState<any[]>([]);
  const [music, setMusic] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [mood, setMood] = useState("");
  const [aiResult, setAiResult] = useState<any>(null);
  const [syncLoading, setSyncLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [moviesRes, musicRes] = await Promise.all([
          fetch("http://localhost:8000/api/media/movies?limit=5"),
          fetch("http://localhost:8000/api/media/music?limit=5")
        ]);
        
        const moviesData = await moviesRes.json();
        const musicData = await musicRes.json();
        
        setMovies(moviesData);
        setMusic(musicData);
      } catch (error) {
        console.error("Veri çekme hatası:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleMoodSync = async () => {
    if (!mood.trim()) return;
    setSyncLoading(true);
    setAiResult(null); 

    try {
      const res = await fetch("http://localhost:8000/api/media/mood-sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mood: mood })
      });
      const data = await res.json();
      setAiResult(data);
    } catch (error) {
      console.error("Yapay zeka hatası:", error);
    } finally {
      setSyncLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-900 text-slate-50 font-sans flex flex-col">
      <div className="max-w-6xl mx-auto p-8 flex-grow">
        
        <div className="text-center py-16">
          <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-emerald-400 mb-6 drop-shadow-lg">
            CineBeat & Melody AI
          </h1>
          <p className="text-xl text-slate-400 mb-12 font-light">
            Sadece ne izleyeceğini veya dinleyeceğini değil, <br className="hidden md:block" /> nasıl hissedeceğini seç.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-2xl mx-auto">
            <input 
              type="text" 
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleMoodSync()}
              placeholder="Bugün nasıl hissediyorsun? (Örn: Yağmurlu ve romantik...)"
              className="w-full px-6 py-4 rounded-full bg-slate-800/80 border border-slate-700 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-slate-200 placeholder-slate-500 shadow-xl transition-all"
            />
            <button 
              onClick={handleMoodSync}
              disabled={syncLoading}
              className="px-8 py-4 rounded-full bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white font-bold transition-all shadow-lg hover:shadow-rose-500/25 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {syncLoading ? "Analiz Ediliyor..." : "Ruh Halimi Eşleştir"}
            </button>
          </div>

          {aiResult && !aiResult.error && (
            <div className="mt-10 p-8 bg-gradient-to-br from-indigo-900 to-slate-800 rounded-3xl border border-indigo-500/50 shadow-2xl max-w-3xl mx-auto text-left transform transition-all duration-500 hover:scale-[1.02]">
              <h3 className="text-2xl font-bold text-indigo-300 mb-4 flex items-center gap-2">
                ✨ Yapay Zeka Eşleşmen Hazır
              </h3>
              <p className="text-slate-200 text-lg mb-6 italic leading-relaxed">
                "{aiResult.reason}"
              </p>
              
              <div className="flex flex-col md:flex-row gap-4 justify-between">
                {(() => {
                  const foundMovie = movies.find(m => m.title.toLowerCase().includes(aiResult.movie_title.toLowerCase()) || aiResult.movie_title.toLowerCase().includes(m.title.toLowerCase()));
                  const movieId = foundMovie?._id;
                  return (
                    <Link 
                      href={movieId ? `/media/${movieId}` : `https://www.fullhdfilmizlesene.now/arama/${encodeURIComponent(aiResult.movie_title)}`} 
                      target={movieId ? "_self" : "_blank"} 
                      rel="noopener noreferrer" 
                      className="flex-1 block group"
                    >
                      <div className="bg-slate-900/60 p-5 rounded-2xl border border-rose-500/30 group-hover:bg-slate-800 group-hover:border-rose-400 transition-all h-full cursor-pointer">
                        <span className="block text-sm text-rose-400 font-bold mb-2 uppercase tracking-wider">🎬 Film Önerisi</span>
                        <span className="text-white text-xl font-semibold group-hover:text-rose-400 transition-colors">{aiResult.movie_title}</span>
                      </div>
                    </Link>
                  );
                })()}

                {(() => {
                  const foundMusic = music.find(m => m.title.toLowerCase().includes(aiResult.music_title.toLowerCase()) || aiResult.music_title.toLowerCase().includes(m.title.split(' - ')[0].toLowerCase()));
                  const musicId = foundMusic?._id;
                  return (
                    <Link 
                      href={musicId ? `/media/${musicId}` : `https://www.youtube.com/results?search_query=${encodeURIComponent(aiResult.music_title)}`} 
                      target={musicId ? "_self" : "_blank"} 
                      rel="noopener noreferrer" 
                      className="flex-1 block group"
                    >
                      <div className="bg-slate-900/60 p-5 rounded-2xl border border-emerald-500/30 group-hover:bg-slate-800 group-hover:border-emerald-400 transition-all h-full cursor-pointer">
                        <span className="block text-sm text-emerald-400 font-bold mb-2 uppercase tracking-wider">🎵 Müzik Önerisi</span>
                        <span className="text-white text-xl font-semibold group-hover:text-emerald-400 transition-colors">{aiResult.music_title}</span>
                      </div>
                    </Link>
                  );
                })()}
              </div>
            </div>
          )}

          {aiResult?.error && (
            <div className="mt-8 p-4 bg-red-900/50 border border-red-500 text-red-200 rounded-xl max-w-2xl mx-auto">
              {aiResult.error}
            </div>
          )}
        </div>

        {loading ? (
          <div className="text-center text-slate-400 py-10 animate-pulse">
            İçerikler yükleniyor...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-8 mb-20">
            <div>
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-2 text-rose-400">
                🎬 Popüler Filmler
              </h2>
              <div className="space-y-6">
                {movies.length > 0 ? movies.map((movie) => (
                  <Link href={`/media/${movie._id}`} key={movie._id} className="block group">
                    <div className="flex gap-4 bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50 group-hover:bg-slate-700 transition-all cursor-pointer transform group-hover:-translate-y-1 group-hover:shadow-xl group-hover:shadow-rose-500/10">
                      {movie.image_url && (
                        <img src={movie.image_url} alt={movie.title} className="w-24 h-36 object-cover rounded-xl shadow-md" />
                      )}
                      <div className="flex flex-col justify-center">
                        <h3 className="text-xl font-semibold text-slate-100 group-hover:text-rose-400 transition-colors">{movie.title}</h3>
                        <p className="text-sm text-slate-400 mt-2 line-clamp-3">{movie.description}</p>
                        <div className="mt-3 text-emerald-400 text-sm font-medium">⭐ {movie.vote_average.toFixed(1)} / 10</div>
                      </div>
                    </div>
                  </Link>
                )) : <p className="text-slate-500">Kayıtlı film bulunamadı.</p>}
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-2 text-emerald-400">
                🎵 Trend Müzikler
              </h2>
              <div className="space-y-4">
                {music.length > 0 ? music.map((song) => (
                  <Link href={`/media/${song._id}`} key={song._id} className="block group">
                    <div className="flex items-center gap-4 bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50 group-hover:bg-slate-700 transition-all cursor-pointer transform group-hover:-translate-y-1 group-hover:shadow-xl group-hover:shadow-emerald-500/10">
                      {song.image_url && (
                        <img src={song.image_url} alt={song.title} className="w-16 h-16 object-cover rounded-full shadow-md border-2 border-emerald-500/30" />
                      )}
                      <div>
                        <h3 className="text-lg font-semibold text-slate-100 group-hover:text-emerald-400 transition-colors">{song.title.split(' - ')[0]}</h3>
                        <p className="text-sm text-slate-400">{song.title.split(' - ')[1] || song.description}</p>
                      </div>
                    </div>
                  </Link>
                )) : <p className="text-slate-500">Kayıtlı müzik bulunamadı.</p>}
              </div>
            </div>
          </div>
        )}
        
        {/* Modüler Bileşenleri Ekledik */}
        <Newsletter />
        <Contact />
      </div>

      <Footer />
    </main>
  );
}