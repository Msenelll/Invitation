# USER TODO - Dijital Davetiye Kurulum Adımları

Bu doküman, dijital davetiyenizin yayına alınması ve özelleştirilmesi için sizin yapmanız gereken işlemleri adım adım açıklamaktadır.

---

## 1. Müzik Dosyasının Eklenmesi (İsteğe Bağlı)
Davetiyenizde arka planda çalacak müzik için hazır bir entegrasyon yapılmıştır.
- **Yapmanız Gereken:** İstediğiniz bir fon müziği veya şarkıyı `.mp3` formatında edinip ismini `music.mp3` olarak değiştirin.
- **Konum:** Bu dosyayı projenizin `img` klasörünün içerisine ekleyin (yani yol `img/music.mp3` olmalıdır).
- **Not:** Tarayıcı güvenlik kuralları (Autoplay Policy) gereği müzik ilk açılışta otomatik çalmayabilir; kullanıcı ekrana dokunduğunda veya sağ üstteki müzik butonuna bastığında çalmaya başlayacaktır.

---

## 2. RSVP / LCV E-posta Adresi Ayarı
Davetiyede misafirlerinizin katılım durumunu (LCV) bildirmeleri için "mailto" entegrasyonu kurulmuştur. Misafir formu doldurup "Gönder" tuşuna bastığında e-posta istemcisi otomatik olarak açılır ve hazır şablon e-postayı size gönderir.
- **Konum:** `main.js` dosyasının **381. satırında** yer alan e-posta adresi:
  ```javascript
  window.location.href = `mailto:mehmetvesinem@gmail.com?subject=${subject}&body=${body}`;
  ```
- **Yapmanız Gereken:** `mehmetvesinem@gmail.com` adresini kendi ortak kullandığınız veya bildirimleri almak istediğiniz e-posta adresi ile değiştirin.

---

## 3. SEO ve Sosyal Medya Paylaşım Görseli (Open Graph)
Davetiyenizi WhatsApp, Instagram veya Telegram üzerinden paylaştığınızda şık bir önizleme resmi görünmesi için Open Graph etiketleri eklenmiştir.
- **Yapmanız Gereken:** `index.html` dosyasının başındaki (17. satır) `og:url` alanını sitenizi yayınladığınız linkle güncelleyin:
  ```html
  <meta property="og:url" content="https://kullaniciadi.github.io/Invitation">
  ```
- **Arka Plan Resmi:** Önizleme görseli varsayılan olarak `img/plaster_bg.png` (yani sizin stucco alçı desenli görseliniz) olarak ayarlanmıştır. İsterseniz `index.html` içerisindeki `og:image` değerini başka bir görselle de güncelleyebilirsiniz.

---

## 4. GitHub Pages Üzerinden Ücretsiz Yayınlama (Hosting)
Davetiyenizi herkesin erişebileceği şekilde internette yayınlamak için GitHub Pages en hızlı ve ücretsiz yöntemdir.
1. Projenizi GitHub üzerinde yeni bir repository'e (depoya) yükleyin (Push edin).
2. GitHub projenizin sayfasında sağ üstteki **Settings (Ayarlar)** sekmesine tıklayın.
3. Sol menüden **Pages** seçeneğine tıklayın.
4. **Build and deployment** başlığı altındaki **Source** kısmını "Deploy from a branch" olarak seçin.
5. **Branch** kısmını `main` (veya kodlarınızın olduğu ana dalı) ve klasörü `/ (root)` seçip **Save** butonuna basın.
6. Birkaç dakika içerisinde sayfanın üst kısmında davetiyenizin canlı yayın linki (`https://kullaniciadi.github.io/Invitation`) belirecektir.

---

## 5. Medya Gönderimi (Google Drive & Sheets Entegrasyonu) Kontrolü
Dosya yükleyici arayüzü Google Apps Script Web App altyapısına doğrudan bağlanmıştır. Gönderilen tüm görsel ve videolar otomatik olarak Drive'a yüklenir ve loglar E-Tabloya yazılır.
- **Yüklenen Medyaları Görme:** Yüklediğiniz dosyaları görmek için aşağıdaki Google Drive klasör bağlantısını ziyaret edebilirsiniz:
  [Google Drive Medya Klasörü](https://drive.google.com/drive/folders/1lILYdQahFaFe2mCpWCG6QDiM3Y1ueT-W?usp=drive_link)
- **E-Tablo Yükleme Logları:** Yükleme durumlarını ("In Progress", "DONE", "Failed") ve kullanıcı bilgilerini görmek için aşağıdaki Sheets dokümanını inceleyebilirsiniz:
  [Google Sheets Upload Logları](https://docs.google.com/spreadsheets/d/1gELiIzCicQyrI0deVMCOVj8qsUp3aW2u6A2LnIjdsmE/edit?gid=0#gid=0)
- **Kullanılan Script URL'i:** `https://script.google.com/macros/s/AKfycbwXbV7_1yxUjG9-U640nxOiDFpYxTAHcLT04ROWp4sH9J-2L5EsqTCSLlI2AQiVu5TD/exec`

