// İleride Admin Panelinden veya veritabanından çekilebilir
const adminConfig = {
  phone: process.env.NEXT_PUBLIC_PHONE || "",
  email: process.env.NEXT_PUBLIC_EMAIL || "",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP || "",
  telegram: process.env.NEXT_PUBLIC_TELEGRAM || "",
  youtube: process.env.NEXT_PUBLIC_YOUTUBE || ""
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