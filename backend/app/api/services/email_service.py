import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from app.core.config import settings

def send_weekly_newsletter_sync(to_email: str, movies: list, music: list):
    """Arka planda çalışarak kullanıcıya interaktif link içeren HTML bülten gönderir."""
    if not settings.SMTP_USER or "kopyaladigin" in settings.SMTP_PASSWORD:
        print(f"[E-Posta Simülasyonu] SMTP ayarları test modunda. {to_email} adresine bülten başarıyla simüle edildi.")
        return

    msg = MIMEMultipart("alternative")
    msg["Subject"] = "🎬 CineBeat & Melody AI - Haftalık Öneri Bülteniniz"
    msg["From"] = settings.EMAILS_FROM_EMAIL or settings.SMTP_USER
    msg["To"] = to_email

    # Filmler için TMDB bağlantısı veya Google arama linki oluşturma
    movies_html = ""
    for m in movies[:3]:
        # Filmin harici ID'si üzerinden TMDB linki veya akıllı arama linki
        watch_link = f"https://www.themoviedb.org/movie/{m.external_id}" if m.external_id else "https://www.themoviedb.org"
        movies_html += f"""
        <li style="margin-bottom: 12px;">
            <strong>{m.title}</strong> (⭐ {m.vote_average})<br>
            <span style="font-size: 13px; color: #94a3b8;">{m.description[:80]}...</span><br>
            <a href="{watch_link}" target="_blank" style="color: #38bdf8; text-decoration: none; font-size: 13px; font-weight: bold;">▶ Film Detayını İncele & İzle</a>
        </li>
        """

    # Müzikler için iTunes / Dinleme bağlantısı oluşturma
    music_html = ""
    for s in music[:3]:
        # iTunes track ID üzerinden doğrudan dinleme/inceleme linki
        listen_link = f"https://music.apple.com/tr/song/{s.external_id}" if s.external_id else "https://music.apple.com"
        music_html += f"""
        <li style="margin-bottom: 12px;">
            <strong>{s.title}</strong><br>
            <a href="{listen_link}" target="_blank" style="color: #10b981; text-decoration: none; font-size: 13px; font-weight: bold;">🎧 Parçayı Dinle (Apple Music)</a>
        </li>
        """

    html_content = f"""
    <html>
      <body style="font-family: Arial, sans-serif; background-color: #0f172a; color: #f8fafc; padding: 24px;">
        <div style="max-width: 600px; margin: auto; background-color: #1e293b; padding: 24px; border-radius: 12px; border: 1px solid #334155;">
          <h2 style="color: #38bdf8; text-align: center;">🎬 CineBeat & Melody AI</h2>
          <p>Merhaba,</p>
          <p>Bu haftanın senin için özel olarak derlenen popüler film ve müzik önerileri hazır!</p>
          
          <h3 style="color: #f43f5e; border-bottom: 1px solid #334155; padding-bottom: 8px;">🔥 Öne Çıkan Filmler</h3>
          <ul style="line-height: 1.6; padding-left: 20px;">
            {movies_html if movies_html else "<li>Henüz senkronize edilmiş film bulunmuyor.</li>"}
          </ul>

          <h3 style="color: #10b981; border-bottom: 1px solid #334155; padding-bottom: 8px;">🎵 Haftanın Trend Müzikleri</h3>
          <ul style="line-height: 1.6; padding-left: 20px;">
            {music_html if music_html else "<li>Henüz senkronize edilmiş müzik bulunmuyor.</li>"}
          </ul>

          <p style="margin-top: 24px; font-size: 12px; color: #94a3b8; text-align: center;">
            CineBeat & Melody AI ekibi keyifli seyirler ve dinlemeler diler!
          </p>
        </div>
      </body>
    </html>
    """

    part = MIMEText(html_content, "html")
    msg.attach(part)

    try:
        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
            server.starttls()
            server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.sendmail(msg["From"], [to_email], msg.as_string())
            print(f"[E-Posta] {to_email} adresine interaktif bülten başarıyla iletildi.")
    except Exception as e:
        print(f"[E-Posta Hatası] {e}")