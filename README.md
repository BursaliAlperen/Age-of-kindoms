# Age of Kingdoms

Rise of Kingdoms tarzında, 9:16 dikey mobil öncelikli, iki harita sistemine (Krallık Haritası ve Dünya Haritası) sahip, pixel art strateji oyunu.

## Özellikler

1. **İki Bağımsız Harita Sistemi**:
   - **Krallık Haritası (İç Harita)**:
     - 40x30 karo (1000x750 px) büyüklüğünde şehir haritası.
     - Kale Çekirdeği (Ana Kale v4 2.5D, Okçu Kuleleri).
     - Askeri Bölge (Kışla, Akademi, Silah Deposu, Talim Alanı, Nöbet Noktaları).
     - Sivil Yerleşim (Evler, Şifahane, Pazar, Hamam, Mabet).
     - Maden, Orman ve Tarla bölgeleri (Taş Ocakları, Oduncular, Depo, Çiftlikler).
     - Dokunmatik slot sistemi: Bina seçimi, seviye yükseltme (Upgrade), hızlandırma (Hızlandır), istatistikleri görüntüleme (View Stats), asker eğitimi ve akademi araştırması.
     - Canlı inşaat geri sayımı ve animasyonlu çekiç simgeleri.
     - Çiftlik, oduncu ve taş ocaklarından periyodik kaynak toplama balonları.
   - **Dünya Haritası (Dış Harita)**:
     - 1600x1200 px geniş kıta coğrafyası: dağlar, karlı zirveler, nehirler, ormanlar, sahiller ve yollar.
     - Oyuncunun kendi krallığı belirgin bir kale olarak (Seviye senkronize) dünya haritasında temsil edilir.
     - Düşman Barbar Kampları (Sv. 1, 2, 3): Birlik göndererek saldırı, savaş simülasyonu ve ganimet kazanımı.
     - Zengin Kaynak Düğümleri (Koru, Kadim Taş Ocağı, Verimli Ova, Altın Damarı): Toplama birliği sevk etme.
     - Komşu ve müttefik krallıklar (Valen, Demir Muhafızlar, Eldoria): Diplomatik durum takibi.

2. **Sağ Navigasyon Paneli & Atmosferik Sisli Geçiş**:
   - Ekranın sağ kenarında parmakla rahat basılabilir dikey navigasyon butonu:
     - Krallık Haritasındayken: **Haritaya Git** (Dünya Haritası geçişi)
     - Dünya Haritasındayken: **Krallığa Git** (Şehir merkezine ve kaleye dönüş)
   - İki harita arasında sis ve bulut animasyonu geçişi (0-200ms sis başlangıcı, 200-500ms tam kaplama ve kamera hazırlığı, 500-900ms dağılma).
   - Harita değişimi sırasında devam eden inşaatlar, araştırmalar, asker eğitimleri ve kaynak üretimi kesintisiz devam eder.

3. **Mobil Arayüz & RoK Tasarımı (9:16)**:
   - Üst HUD: Oyuncu profili, Kale Seviyesi, Odun, Yiyecek, Taş ve Altın göstergeleri.
   - Hızlı Görevler Çubuğu: Kademeli krallık hedefleri ve ödüller.
   - Alt Menü: İnşa Kataloğu, Birlikler, Akademi, Görevler ve Envanter sekmeleri.
   - Alttan açılan paneller (Bottom sheet), yumuşak geçişler ve dokunma hedefleri.

4. **Ses ve Haptik Efektler**:
   - Web Audio API ile harici dosya hatası olmadan üretilen retro sesler: tıklama, inşa çekici, zafer fanfarı, borazan sefer sesi, para/kaynak tınısı ve sisli rüzgar geçişi.
   - Android cihazlarda yerel haptik titreşim desteği.

5. **Kalıcı Kayıt Sistemi**:
   - Tüm kaynaklar, bina seviyeleri, inşaat kuyrukları, askerler ve araştırmalar `localStorage` üzerinde kaydedilir; uygulama kapatılıp açıldığında kaldığı yerden devam eder.

## Proje Yapısı

- `index.html` — Oyun arayüzü, HUD, harita katmanları ve alt sekmeler.
- `style.css` — 9:16 mobil uyumlu pixel art stil, animasyonlar ve temalar.
- `game.js` — Oyun döngüsü, iki harita mekaniği, sisli geçiş, ekonomi, sesler ve kayıt sistemi.
- `assets/` — Bina sprite'ları, karo döşemeleri ve kale görselleri.
- `game_html5.zip` — Saf HTML5/CSS/JS olarak her ortamda bağımsız çalışabilen ve dışa aktarılabilir paket.
- `app/` — Android yerel derleme projesi (APK üretimi ve Android emülatöründe çalıştırma).
