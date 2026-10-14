# Age-of-kindoms

A-Z OYUN GELİŞTİRME PROMPTU — PIXEL KINGDOM

Rise of Kingdoms Tarzı Mobil Strateji Oyunu | Mevcut Sistemi Korumalı Geliştirme

Sen kıdemli bir oyun geliştiricisi, oyun sistemleri mimarı, pixel art sanatçısı ve mobil UI/UX tasarımcısısın. Görevin, mevcut oyun projemi dikkatlice inceleyerek onu Rise of Kingdoms tarzında, 9:16 dikey tam ekran çalışan, kaliteli bir pixel art strateji oyununa dönüştürmek ve geliştirmektir.

En önemli kural: MEVCUT SİSTEMİ BOZMA. Sıfırdan yeni bir oyun oluşturma. Önce projeyi incele, çalışan sistemleri tespit et, mevcut mimariye uygun geliştirmeler yap ve her değişiklikten sonra test et.

Hedef; hem kendi krallığımızı yönetebildiğimiz hem de krallık dışındaki geniş dünya haritasında dolaşabildiğimiz, iki ayrı harita sistemi bulunan, mobil cihazlarda akıcı çalışan bir strateji oyunu oluşturmaktır.

---

1. ZORUNLU KURALLAR: MEVCUT PROJEYİ KORU

İlk olarak projedeki bütün dosyaları, klasörleri, oyun sistemlerini, sahneleri, bileşenleri, arayüzleri, kayıt sistemini ve mevcut oyun mekaniklerini incele.

Değişiklik yapmadan önce:

- Mevcut proje mimarisini ve kullanılan teknolojileri belirle.
- Çalışan mekanikleri ve bunların bağımlılıklarını tespit et.
- Mevcut harita, bina, kaynak, envanter, oyuncu ilerlemesi ve kayıt sistemlerini incele.
- Mevcut UI bileşenlerini, butonlarını ve olay dinleyicilerini kontrol et.
- Hata veren kodlarla çalışan kodları birbirinden ayır.
- Değişikliklerden önce mümkünse bir Git commit'i veya geri yüklenebilir yedek oluştur.
- Aynı işlevi yapan ikinci bir sistem oluşturma; mevcut sistem genişletilebiliyorsa onu genişlet.

Kesinlikle yapma:

- Çalışan özellikleri sebepsiz yere silme.
- Projeyi sıfırdan yazma veya çalışan dosyaları topluca değiştirme.
- Mevcut kayıt formatını ve oyuncu verilerini bozma.
- Kaynak toplama, inşaat, yükseltme, ekonomi veya diğer mevcut mekanikleri kaldırma.
- Mevcut dosyaları incelemeden yeni dosyalarla üzerlerine yazma.
- Çalışmayan sahte butonlar, işlevsiz menüler veya yalnızca görsel amaçlı mekanikler ekleme.
- Var olmayan API, fonksiyon, dosya veya varlıkların bulunduğunu varsayma.

Yeni sistemler mevcut mimariyle uyumlu olmalı. Gerekirse yeni modüller oluştur ancak bunları mevcut sisteme kontrollü biçimde bağla. Bir özellik güvenli şekilde entegre edilemiyorsa mevcut sistemi bozmak yerine uyumluluk katmanı oluştur.

---

2. OYUNUN GENEL KONSEPTİ

Oyunun temel yapısı Rise of Kingdoms'tan esinlenen iki farklı oynanabilir haritadan oluşacak:

A. Krallık Haritası: Oyuncunun kendi şehrini, kalesini, kaynak binalarını, askeri yapılarını ve araştırma merkezlerini yönettiği iç harita.

B. Dünya Haritası: Krallık dışındaki geniş coğrafyayı, dağ geçitlerini, denizleri, diğer krallıkları, tarafsız bölgeleri ve keşfedilebilir alanları içeren dış harita.

Bu iki harita birbirinden ayrı sahneler veya mevcut motorun desteklediği eşdeğer bağımsız harita durumları olarak çalışmalı. Her ikisinin de kendine özgü kamera davranışı, görsel düzeni, etkileşimleri ve arayüzü olmalı.

Oyuncu haritalar arasında geçiş yaptığında bina seviyeleri, kaynaklar, birlikler, görevler ve ilerleme kaybolmamalı.

Ekran formatı

- Mobil öncelikli 9:16 dikey ekran.
- Gerçek tam ekran oyun alanı; gereksiz kenarlık veya masaüstü boşluğu yok.
- Güvenli ekran alanlarına uyumlu arayüz.
- Dokunmatik ekranlar için büyük ve rahat tıklanabilir kontroller.
- Piksel art grafikler, net silüetler ve okunabilir yazılar.
- Ekran boyutuna göre ölçeklenen UI.
- Düşük ve orta segment telefonlarda performanslı çalışma.

Oyun web tabanlıysa mevcut HTML5, JavaScript, Canvas veya kullanılan oyun motorunu koru. Farklı bir teknolojiye ancak mevcut projeyle uyumluluğu kanıtlanmışsa geç.

---

3. EN ÖNEMLİ ÖZELLİK: İKİ HARİTA VE SAĞ TARAFTAKİ GEÇİŞ BUTONLARI

Ekranın sağ tarafına her zaman kolayca erişilebilen, modern ve kompakt bir harita navigasyon paneli ekle.

Bu panel mevcut kaynak göstergelerini, savaş kontrollerini veya başka önemli butonları kapatmamalı.

Sağ taraftaki navigasyon paneli

İki ana buton bulunmalı:

1. Haritaya Git
2. Krallığa Git

Butonlar piksel art ikonları, kısa Türkçe etiketler, dokunma animasyonları ve belirgin aktif durum göstergeleri içermeli.

Haritaya Git butonu

Oyuncu Krallık Haritasındayken Haritaya Git butonuna dokunursa:

1. Mevcut krallık görünümünü kaydet.
2. Kamera hareketini güvenli biçimde durdur.
3. Ekrana kısa, atmosferik bir sis ve bulut geçişi uygula.
4. Krallık haritasını gizle.
5. Dünya Haritasını etkinleştir.
6. Sis dağıldığında oyuncuyu dünya haritasında kendi krallığının bulunduğu bölgeye yakın bir noktada göster.
7. Dünya haritası açıldığında Rise of Kingdoms tarzındaki büyük kale, surlar, kuleler ve çevresindeki krallık alanı görünür olsun.
8. Kamera dünya haritasının ölçeğine geçsin; oyuncu geniş coğrafyayı görebilsin.
9. Dünya haritasının kaynakları, bölgeleri ve diğer etkileşimli nesneleri aktif olsun.

Dünya haritasında kendi krallığımız sıradan küçük bir bina gibi görünmemeli. Kendine özgü, görsel olarak dikkat çekici bir kale ve çevresel yerleşimle temsil edilmeli.

Kale; surlar, gözetleme kuleleri, bayraklar, giriş kapısı, çevresindeki yollar ve uygun büyüklükte bir yerleşim alanı içermeli.

Krallığa Git butonu

Oyuncu Dünya Haritasındayken Krallığa Git butonuna dokunursa:

1. Dünya haritasının kamera durumunu kaydet.
2. Mevcut haritayı kısa bir sis ve bulut efektiyle ört.
3. Dünya Haritasını gizle.
4. Oyuncunun kendi Krallık Haritasını etkinleştir.
5. Kamera oyuncunun şehir merkezine, özellikle ana kaleye odaklansın.
6. Sis dağıldığında oyuncu kendi krallığının iç haritasını görsün.
7. İnşaat, yükseltme, bina seçme ve kaynak yönetimi kontrolleri aktif olsun.

Krallığa Git butonu yalnızca kamera yakınlaştırması yapmamalı. Oyuncuyu gerçekten ayrı olan Krallık Haritasına geri götürmeli.

İki yönlü geçiş kuralı

Mevcut konum| Buton| Sonuç
Krallık Haritası| Haritaya Git| Dünya Haritasına geç
Dünya Haritası| Krallığa Git| Krallık Haritasına geç

Geçişler iki yönlü, tekrarlanabilir ve hatasız olmalı.

Butonlar harita durumuna göre uygun şekilde gösterilsin. Gereksiz veya mevcut konumda anlamsız olan geçiş butonu devre dışı bırakılabilir ya da bağlama göre gizlenebilir.

Sisli geçiş animasyonu

Geçişler anlık, sert bir ekran değişimi şeklinde gerçekleşmemeli.

Şu animasyon akışını uygula:

- 0–200 ms: Kamera hareketini durdur ve geçiş efektini başlat.
- 200–500 ms: Beyazımsı veya mavi-gri piksel sisleri ekrana yayılsın.
- Yaklaşık 500 ms: Harita durumunu değiştir ve yeni kamerayı hazırla.
- 500–900 ms: Sis yavaşça dağılsın ve yeni harita ortaya çıksın.

Bu süreler başlangıç değerleridir; cihaz performansına göre ayarlanabilir. Animasyon atlanabilmeli veya azaltılabilmeli. Geçiş sırasında oyuncunun art arda dokunarak birden fazla haritayı üst üste açması engellenmeli.

Geçiş sırasında kaynak üretimi ve devam eden inşaatlar durmamalı. Harita görünümü değişse bile oyun simülasyonu kendi kurallarına göre çalışmaya devam etmeli.

---

4. KRALLIK HARİTASI: AYRI VE TAM OYNANABİLİR ŞEHİR

Krallık Haritası, oyuncunun kendi şehrini doğrudan yönetebildiği ayrı bir oyun alanıdır.

Coğrafi tasarım

- Haritanın üç tarafında yükselen dağ sıraları.
- Bir tarafında deniz ve kumsal.
- Dağların arasında doğal geçitler.
- Ormanlar, ağaç kümeleri ve taşlık alanlar.
- Nehirler, küçük göletler ve kıyı şeridi.
- Toprak yollar ve ana kale girişine ulaşan yollar.
- Küçük dekoratif ayrıntılar: çimenler, kayalar, çalılar, çiçekler, fenerler, bayraklar ve köprüler.

Haritanın sağ alt bölgesinde oyuncunun başlangıç krallığı yer alsın. Kamera başlangıçta kaleyi ve temel binaları rahatça gösterecek şekilde konumlansın.

Binalar

Mevcut bina sistemi varsa öncelikle onu kullan. Yeni bina türleri yalnızca mevcut mimariye uygun şekilde eklenmeli.

Önerilen bina türleri:

- Ana Kale
- Belediye Binası veya mevcut ana merkez
- Kışla
- Okçu Eğitim Alanı
- Süvari Eğitim Alanı
- Kuşatma Birimi Atölyesi
- Akademi
- Çiftlik
- Kereste Kampı
- Taş Ocağı
- Altın Üretim Binası
- Depo
- Hastane
- Gözetleme Kulesi
- Surlar
- Pazar
- Elçilik veya mevcut sosyal yapı
- Konutlar ve dekoratif yapılar

Bunları mevcut oyun sisteminde karşılığı varsa yeniden oluşturma. Önce mevcut bina listesini incele.

Her bina işlevsel olmalı, kendi seviyesini ve yükseltme gereksinimlerini takip etmeli, uygun olduğunda üretim yapmalı ve seçildiğinde bağlama uygun menüyü açmalı.

Bina yerleştirme

- Sürükle-bırak yerleştirme.
- Dokunmatik sürükleme desteği.
- Izgaraya hizalama.
- Geçerli yerler için görsel yerleştirme önizlemesi.
- Geçersiz yerlerde kırmızı veya belirgin uyarı.
- Binaların üst üste binmesini önleme.
- Yol, dağ, su ve sınır çakışmalarını kontrol etme.
- Yerleştirmeyi onaylama ve iptal etme.
- Mevcut bina konumlarını kayıt sistemine yazma.

Oyuncu bir binayı sürüklerken kamera yanlışlıkla hareket etmemeli. Haritayı kaydırma ve binayı taşıma hareketleri birbirinden ayrılmalı.

---

5. DÜNYA HARİTASI: KRALLIK DIŞINDAKİ AYRI COĞRAFYA

Dünya Haritası, Krallık Haritasından farklı bir ölçeğe ve görsel düzene sahip olmalı.

Burada oyuncu kendi şehrinin içini değil, dış dünyayı görür.

Dünya haritasının görsel özellikleri

- Geniş, keşfedilebilir arazi.
- Büyük dağ zincirleri.
- Orman bölgeleri.
- Nehirler ve göller.
- Denizler ve kıyılar.
- Dağ geçitleri ve yollar.
- Tarafsız bölgeler.
- Kaynak noktaları.
- Diğer kaleler ve yerleşimler.
- Keşfedilmemiş bölgeler.
- Bölge sınırları ve krallık işaretleri.

Haritanın tamamını tek bir küçük ekranın içine sıkıştırma. Kamera kaydırma ve yakınlaştırmayla büyük bir alanın farklı bölümleri keşfedilebilsin.

Dünya haritasındaki kendi kalemiz

Oyuncunun krallığı, dünya haritasında belirgin bir kale olarak temsil edilsin.

Kale tasarımı:

- Büyük taş surlar.
- Ana kale binası.
- Kuleler ve giriş kapısı.
- Krallık bayrakları.
- Çevresinde yollar ve küçük yerleşimler.
- Uygun seviyelerde görsel gelişim.
- Oyuncunun mevcut krallık seviyesine göre değişen görünüm.

Dünya haritasındaki kale, Krallık Haritasındaki ana kaleyle aynı oyuncu verisine bağlı olmalı. Ayrı bir dekoratif kale üretip iki farklı ilerleme sistemi oluşturma.

Kalenin seviyesi değiştiğinde dünya haritasındaki modeli de güncellenmeli.

Dünya haritası etkileşimleri

Mevcut sistemin durumuna göre:

- Haritayı sürükleyerek kaydırma.
- Yakınlaştırma ve uzaklaştırma.
- Kaleye dokunarak kale bilgilerini açma.
- Kaynak noktasına dokunarak kaynak bilgilerini görme.
- Keşfedilebilir bölgelere dokunma.
- Diğer yerleşimlere dokunarak bilgi menüsü açma.
- Bölge ve krallık bilgilerini görüntüleme.
- Oyuncunun mevcut krallık konumunu işaretleme.

Henüz geliştirilmemiş savaş veya çok oyunculu sistemleri çalışıyormuş gibi gösterme. Bunları gelecekte eklenebilecek modüller olarak hazırla; sahte savaş sonuçları üretme.

---

6. HARİTA KAMERASI VE DOKUNMATİK KONTROLLER

Her iki haritanın kamera durumu ayrı saklanmalı.

Krallık Haritası için:

- Şehir ölçeğinde yakın kamera.
- Binaları seçmek için hassas dokunma.
- İnşaat sırasında sürükleme.
- Şehir alanında kaydırma ve yakınlaştırma.

Dünya Haritası için:

- Daha geniş görüş alanı.
- Kaleler ve bölgeler arasında gezinme.
- Daha büyük coğrafyada kaydırma.
- Daha geniş yakınlaştırma aralığı.

Her iki kamerada da:

- Minimum ve maksimum yakınlaştırma sınırları.
- Harita sınırlarının dışına kontrolsüz çıkmayı önleme.
- Mobil cihazlarda tek parmakla kaydırma.
- Uygun cihazlarda iki parmakla yakınlaştırma.
- Seçim ve sürükleme olaylarının çakışmasını önleme.
- Geçiş sırasında kamera sıfırlanmasının önlenmesi.
- Harita değiştirildiğinde son kamera konumunun korunması.

---

7. BİNA MENÜSÜ VE EYLEMLER

Bir binaya dokunulduğunda ekranın uygun bir bölümünde piksel art tarzında bağlamsal menü açılsın.

Menüde kullanıcının istediği terimleri aynen koru:

- Upgrade
- Hızlandır
- View Stats
- Asker Eğit
- Araştır

Her seçenek yalnızca uygun bina ve oyun durumu için görünmeli.

Menü davranışları

Upgrade: Binanın seviyesini yükseltir. Gerekli kaynakları, süreyi ve ön koşulları kontrol eder. Yetersiz kaynak varsa açıkça bildirir.

Hızlandır: Yalnızca devam eden bir inşaat veya yükseltme varsa gösterilir. Mevcut hızlandırma sistemini kullanır. Böyle bir sistem yoksa gerçek bir hızlandırma mekaniği oluşturulmadan önce mevcut ekonomiye uygun bir modül tasarlanır.

View Stats: Bina seviyesini, üretim miktarını, kapasitesini, bonuslarını ve mevcut durumunu gösterir.

Asker Eğit: Yalnızca askeri binalarda görünür. Birlik türü, eğitim süresi, kaynak maliyeti ve eğitim kuyruğu gösterilir.

Araştır: Yalnızca araştırma yapılabilen yapılarda görünür. Teknoloji ağacı, araştırma gereksinimleri, süreler ve etkiler gösterilir.

Menüde olmayan eylemleri rastgele ekleme. Menü mobil ekranın dışına taşmamalı ve oyuncunun seçtiği binayla doğru şekilde bağlantılı olmalı.

---

8. İNŞAAT, YÜKSELTME VE İLERLEME

Rise of Kingdoms benzeri kademeli ilerleme hissi oluştur.

Her yükseltme şu unsurları değerlendirmeli:

- Mevcut seviye.
- Hedef seviye.
- Kaynak gereksinimi.
- İnşaat veya yükseltme süresi.
- Ana bina seviyesi gibi ön koşullar.
- Bina türüne özgü etkiler.
- Üretim kapasitesi veya istatistik değişiklikleri.

Yükseltme onaylandığında:

1. Gereksinimleri doğrula.
2. Kaynakları yalnızca işlem geçerliyse düş.
3. Yükseltme sürecini başlat.
4. Kalan süreyi göster.
5. Süre dolduğunda binanın seviyesini güncelle.
6. Yeni istatistikleri hesapla.
7. Görsel yükseltme değişikliklerini uygula.
8. Oyuncu verilerini güvenli şekilde kaydet.

Süreler, maliyetler ve ödüller rastgele belirlenmemeli; dengeli ve ölçeklenebilir bir ekonomi sistemi kullanılmalı.

Bir oyuncu haritalar arasında geçiş yaptığında devam eden inşaatlar kaybolmamalı veya yeniden başlamamalı.

---

9. MOBİL UI VE NAVİGASYON PANELİ

Tüm UI bileşenleri piksel art stilinde hazırlanmalı.

Üst bölüm

- Oyuncu seviyesi.
- Krallık seviyesi.
- Mevcut kaynaklar.
- Gerekiyorsa görev veya bildirim göstergesi.

Sağ taraf

Harita navigasyonu burada yer alsın.

Haritaya Git: Dünya haritasını temsil eden küçük bir piksel art küre, harita veya kale dışı arazi ikonu.

Krallığa Git: Ana kale veya şehir ikonu.

Butonlar dikey yerleşimli, parmakla kolay basılabilir ve mevcut sağ kenar UI bileşenleriyle çakışmayacak biçimde tasarlansın.

Aktif harita, ikonun çerçevesi veya küçük bir durum işaretiyle belli olsun.

Alt navigasyon

Mevcut oyun sistemine uygun biçimde:

- İnşa
- Birlikler
- Görevler
- İttifak veya mevcut sosyal özellikler
- Envanter
- Teknoloji veya Akademi

Bu menü öğelerinin tümü mevcut oyunda çalışıyorsa korunmalı. Henüz desteklenmeyen özellikler tamamlanmış gibi sunulmamalı.

Harita geçiş butonları alt menüye taşınmamalı; istenen sağ taraftaki panelde kalmalı.

---

10. PIXEL ART SANAT YÖNERGESİ

Tüm grafikler tek bir sanat yönetimine bağlı olsun.

Stil

- Detaylı ama okunaklı pixel art.
- Net piksel kümeleri ve tutarlı konturlar.
- İzometrik veya mevcut projeyle uyumlu yukarıdan görünüm.
- Mobil ekranda seçilebilen bina silüetleri.
- Küçük boyutta bile anlaşılır ikonlar.
- Tutarlı ışık ve gölge yönü.
- Gereksiz bulanıklık ve rastgele anti-aliasing kullanmama.

Renk paleti

- Çimen: canlı, doğal yeşil tonları.
- Orman: koyu ve orta yeşiller.
- Dağlar: gri, mavi-gri ve taş tonları.
- Deniz: mavi ve turkuaz.
- Kumsal: açık kum sarısı.
- Kaleler: taş grisi, koyu kontur ve sıcak ışık detayları.
- UI: koyu ahşap, taş çerçeve, altın vurgular ve yüksek kontrastlı metinler.

Renkler her iki haritada tutarlı kalmalı.

Üretilecek görsel varlıklar

Projede mevcut varlıkları incele. Eksik olanları üret veya uygun prosedürle oluştur:

- Ana kale sprite'ı.
- Kale seviye varyasyonları.
- Sur ve kule parçaları.
- Kışla ve akademi.
- Kaynak üretim binaları.
- Ağaç ve orman kümeleri.
- Dağ parçaları.
- Deniz ve kıyı parçaları.
- Kumsal geçişleri.
- Taş ve çimen zemin döşemeleri.
- Yollar ve köprüler.
- Bayraklar.
- Kaynak simgeleri.
- Bina seçimi çerçevesi.
- Sağ panelin harita ve kale ikonları.
- Sis ve bulut geçiş kareleri.
- İnşaat ve yükseltme efektleri.
- Butonların normal, basılı ve seçili durumları.

Varlıkları rastgele üretip mevcut sprite'ların üzerine yazma. Yeni dosyalara uygun isimler ver ve bunları doğru asset yükleme sistemine bağla.

---

11. ANİMASYONLAR

Aşağıdaki animasyonları projeyle uyumlu şekilde geliştir:

- Haritalar arasında sisli geçiş.
- Buton basılma ve seçilme animasyonları.
- Bina seçimi.
- İnşaat sırasında çekiç, toz veya küçük çalışma efektleri.
- Yükseltme tamamlandığında ışık ve parçacık efekti.
- Bayrakların hafif dalgalanması.
- Deniz kıyısında hafif su hareketi.
- Ağaçların düşük yoğunluklu sallanması.
- Kale çevresinde uygun dekoratif animasyonlar.

Animasyonlar oyun performansını düşürmemeli. Aynı anda yüzlerce gereksiz animasyon veya parçacık çalıştırma. Düşük performanslı cihazlarda efekt yoğunluğunu azalt.

---

12. KAYIT SİSTEMİ VE HARİTA DURUMLARI

Mevcut kayıt sistemini koru ve genişlet.

Oyuncu verileri mümkün olduğunca merkezi bir veri modelinde tutulmalı.

Örnek mantıksal veri alanları:

- Oyuncu seviyesi.
- Kaynak miktarları.
- Bina seviyeleri.
- Bina konumları.
- İnşaat ve yükseltme görevleri.
- Birlik ve araştırma durumları.
- Krallık haritası kamera konumu.
- Dünya haritası kamera konumu.
- Dünya haritasındaki kale konumu.
- Görev ve ilerleme bilgileri.

Bunlar mevcut veri modeline uygun şekilde uyarlanmalı; bu örneği mevcut projeye birebir zorla uygulama.

Harita değişimi oyuncu verilerini sıfırlamamalı. Aynı binanın iki ayrı kopyası üzerinden bağımsız ilerleme oluşmamalı.

Oyuncu uygulamayı kapatıp açtığında mevcut krallığına ve kayıtlı ilerlemesine geri dönebilmeli.

---

13. GELİŞTİRME PLANI VE UYGULAMA SIRASI

Aşağıdaki sırayı takip et:

Aşama 1 — Proje incelemesi

Dosyaları, bağımlılıkları, çalışan sistemleri ve olası riskleri tespit et.

Aşama 2 — Güvenli temel hazırlığı

Geri yükleme noktası oluştur. Mevcut oyun sistemlerini koru. Yeni geliştirmelerin mevcut mimariye nereden bağlanacağını belirle.

Aşama 3 — İki harita mimarisi

Krallık Haritası ve Dünya Haritasını ayrı durumlar olarak uygula. Kamera ve veri paylaşımını düzenle.

Aşama 4 — Sağ navigasyon paneli

Haritaya Git ve Krallığa Git butonlarını ekle. İki yönlü geçişleri ve sis animasyonunu uygula.

Aşama 5 — Harita tasarımı

Krallık içi araziyi, dağları, denizi, kumsalı ve şehir yerleşimini düzenle. Ardından geniş dünya haritasını oluştur.

Aşama 6 — Kale ve bina bağlantısı

Dünya haritasındaki kaleyi mevcut ana kale verisine bağla. Bina seviyeleriyle görsel seviyeleri senkronize et.

Aşama 7 — Etkileşimler

Kamera hareketi, yakınlaştırma, bina seçimi, sürükle-bırak yerleştirme ve bağlamsal menüleri uygula.

Aşama 8 — Ekonomi ve ilerleme

Mevcut kaynak, inşaat, yükseltme ve eğitim sistemlerini genişlet. Çalışan sistemleri yeniden yazma.

Aşama 9 — Pixel art ve animasyon

Eksik görselleri, UI ikonlarını ve geçiş animasyonlarını entegre et.

Aşama 10 — Test ve hata düzeltme

Bütün kritik akışları test et. Hataları yalnızca gizleme; kök nedenlerini düzelt.

Aşama 11 — Son paketleme

Projenin mevcut çalıştırma yöntemini koru. Gerekliyse çalışan HTML5 sürümünü ve tüm varlıklarını ZIP olarak paketle. Test edilmemiş bir paketi çalışıyor diye sunma.

---

14. ZORUNLU TEST SENARYOLARI

En az aşağıdaki senaryoları uygula:

1. Oyun açıldığında Krallık Haritası doğru şekilde yükleniyor mu?
2. Sağ taraftaki Haritaya Git butonu çalışıyor mu?
3. Sis geçişi sırasında oyun bozulmadan Dünya Haritasına geçiliyor mu?
4. Dünya haritasında oyuncunun kalesi doğru yerde görünüyor mu?
5. Krallığa Git butonu doğru Krallık Haritasını açıyor mu?
6. İki harita arasında art arda geçiş yapıldığında hata oluşuyor mu?
7. Her iki haritada kamera kaydırma ve yakınlaştırma çalışıyor mu?
8. Bina seçimi ve sürükleme mobil dokunmatik kontrollerle çalışıyor mu?
9. Upgrade işlemi kaynakları doğru hesaplıyor mu?
10. Hızlandır yalnızca uygun durumda gösteriliyor mu?
11. View Stats doğru bina verilerini gösteriyor mu?
12. Asker Eğit ve Araştır yalnızca ilgili yapılarda mı bulunuyor?
13. Devam eden inşaatlar harita geçişinde korunuyor mu?
14. Kale seviyesi iki haritada senkronize mi?
15. Kayıt ve yeniden yükleme işlemleri ilerlemeyi koruyor mu?
16. Mobil ekranın sağındaki navigasyon butonları diğer kontrolleri kapatıyor mu?
17. Konsol hataları, eksik asset'ler ve bozuk referanslar var mı?
18. Düşük performanslı cihazlarda harita geçişleri kabul edilebilir hızda mı?

Mümkün olan testleri otomatikleştir; geri kalanları gerçek cihaz veya emüle edilmiş mobil ekran boyutlarında doğrula.

---

15. SONUÇ VE TESLİM BEKLENTİSİ

Sadece tasarım dokümanı veya yapılacaklar listesi verme. Mevcut proje üzerinde gerçek uygulamayı gerçekleştir.

İş bitiminde şunları sun:

- Korunan mevcut sistemlerin kısa listesi.
- Eklenen ve değiştirilen dosyalar.
- İki haritanın nasıl çalıştığı.
- Haritaya Git ve Krallığa Git butonlarının işlevleri.
- Sisli geçişin uygulanma yöntemi.
- Bina ve kale verilerinin nasıl senkronize edildiği.
- Test edilen senaryoların sonuçları.
- Çözülen hatalar ve bilinen sınırlamalar.
- Oyunun nasıl çalıştırılacağı.
- Uygunsa indirilebilir ZIP paketi.

Nihai hedef: Rise of Kingdoms'tan esinlenen, kendi krallığını inşa edebildiğin ve ayrı bir dünya haritasını keşfedebildiğin, sağ taraftaki butonlarla sisli geçiş yapabildiğin, mobil uyumlu, ayrıntılı pixel art görsellere sahip bir strateji oyunu.

En kritik öncelik sırası: Mevcut sistemi koru → iki haritayı doğru ayır → geçiş butonlarını çalıştır → kale ve bina verilerini senkronize et → görsel kaliteyi yükselt → bütün sistemi test et.

Çalışan özellikleri korumadan görsel iyileştirmeye geçme. Bir özellik tamamlanmış görünse bile işlevsel olarak doğrulanmadan tamamlandı olarak raporlama.
