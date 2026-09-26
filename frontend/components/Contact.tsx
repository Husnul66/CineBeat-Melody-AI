"use client";
import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ text: "", type: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    
    setLoading(true);
    setStatusMessage({ text: "", type: "" });

    try {
      const res = await fetch("http://localhost:8000/api/media/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        setStatusMessage({ text: "Mesajınız başarıyla iletildi! Teşekkür ederiz.", type: "success" });
        setFormData({ name: "", email: "", message: "" });
      } else {
        setStatusMessage({ text: "Mesaj gönderilirken bir hata oluştu.", type: "error" });
      }
    } catch (error) {
      setStatusMessage({ text: "Sunucu bağlantı hatası.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-12 bg-slate-800/30 rounded-3xl p-10 border border-slate-700/50 shadow-xl max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-white mb-2 text-center">Bize Bir Mesaj Bırakın</h2>
      <p className="text-slate-400 mb-8 text-center text-sm">
        Soru, öneri veya işbirlikleri için aşağıdaki formu doldurabilirsiniz.
      </p>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <input 
            type="text" 
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="İsminiz"
            className="w-full px-5 py-3 rounded-xl bg-slate-900/50 border border-slate-700 focus:outline-none focus:border-sky-500 text-slate-200 placeholder-slate-500"
          />
          <input 
            type="email" 
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="E-posta Adresiniz"
            className="w-full px-5 py-3 rounded-xl bg-slate-900/50 border border-slate-700 focus:outline-none focus:border-sky-500 text-slate-200 placeholder-slate-500"
          />
        </div>
        <textarea 
          required
          rows={4}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder="Mesajınız..."
          className="w-full px-5 py-3 rounded-xl bg-slate-900/50 border border-slate-700 focus:outline-none focus:border-sky-500 text-slate-200 placeholder-slate-500 resize-none"
        ></textarea>
        
        <button 
          type="submit"
          disabled={loading}
          className="mt-2 px-8 py-3 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold transition-all shadow-lg hover:shadow-sky-500/25 disabled:opacity-50"
        >
          {loading ? "Gönderiliyor..." : "Mesajı Gönder"}
        </button>
      </form>

      {statusMessage.text && (
        <div className={`mt-4 text-center text-sm font-medium ${statusMessage.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>
          {statusMessage.text}
        </div>
      )}
    </div>
  );
}