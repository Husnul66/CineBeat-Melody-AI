// İleride Admin Panelinden veya veritabanından çekilebilir
const adminConfig = {
  phone: "+90 555 123 45 67",
  email: "iletisim@cinebeat.com",
  whatsapp: "https://wa.me/905551234567",
  telegram: "https://t.me/cinebeat",
  youtube: "https://youtube.com/@cinebeat"
};

export default function Footer() {
  return (
    <footer className="bg-slate-950 py-12 border-t border-slate-800 mt-auto">
      <div className="max-w-6xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-slate-500 text-sm">
          &copy; {new Date().getFullYear()} CineBeat & Melody AI. Tüm hakları saklıdır.
        </div>
        <div className="flex gap-6 text-slate-400">
          <a href={`tel:${adminConfig.phone}`} className="hover:text-sky-400 transition-colors" title="Telefon">📞 {adminConfig.phone}</a>
          <a href={`mailto:${adminConfig.email}`} className="hover:text-sky-400 transition-colors" title="E-Posta">✉️ E-Posta</a>
          <a href={adminConfig.whatsapp} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors" title="WhatsApp">💬 WhatsApp</a>
          <a href={adminConfig.telegram} target="_blank" rel="noopener noreferrer" className="hover:text-sky-500 transition-colors" title="Telegram">✈️ Telegram</a>
          <a href={adminConfig.youtube} target="_blank" rel="noopener noreferrer" className="hover:text-red-500 transition-colors" title="YouTube">▶️ YouTube</a>
        </div>
      </div>
    </footer>
  );
}