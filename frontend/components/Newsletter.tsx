"use client";
import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [subLoading, setSubLoading] = useState(false);
  const [subMessage, setSubMessage] = useState({ text: "", type: "" });

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setSubLoading(true);
    setSubMessage({ text: "", type: "" });

    try {
      const res = await fetch("http://localhost:8000/api/media/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setSubMessage({ text: "Harika! E-posta bültenimize başarıyla abone oldunuz.", type: "success" });
        setEmail("");
      } else {
        setSubMessage({ text: data.detail || "Abonelik işlemi başarısız oldu.", type: "error" });
      }
    } catch (error) {
      setSubMessage({ text: "Sunucu bağlantı hatası.", type: "error" });
    } finally {
      setSubLoading(false);
    }
  };

  return (
    <div className="mt-12 bg-gradient-to-r from-sky-900/40 to-emerald-900/40 rounded-3xl p-10 border border-slate-700/50 text-center shadow-xl">
      <h2 className="text-3xl font-bold text-white mb-4">Haftalık Trendleri Kaçırma!</h2>
      <p className="text-slate-400 mb-8 max-w-xl mx-auto">
        Her hafta en popüler 3 film ve müziği yapay zeka analizleriyle birlikte e-posta adresine gönderelim.
      </p>
      
      <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
        <input 
          type="email" 
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-posta adresiniz..."
          className="w-full px-6 py-4 rounded-full bg-slate-800/80 border border-slate-700 focus:outline-none focus:border-emerald-500 text-slate-200 placeholder-slate-500"
        />
        <button 
          type="submit"
          disabled={subLoading}
          className="px-8 py-4 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold transition-all shadow-lg hover:shadow-emerald-500/25 whitespace-nowrap disabled:opacity-50"
        >
          {subLoading ? "Ekleniyor..." : "Abone Ol"}
        </button>
      </form>

      {subMessage.text && (
        <div className={`mt-4 text-sm font-medium ${subMessage.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>
          {subMessage.text}
        </div>
      )}
    </div>
  );
}