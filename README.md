# Alt Bant Stüdyosu

OBS tarayıcı kaynağı için metin, hız, yön, yazı tipi, boyut, renk ve şeffaflık ayarlı kayan bant.

HTML, CSS ve JavaScript ile çalışır. Sunucu uygulaması, API anahtarı, ChatGPT hesabı veya açık tutulması gereken bir kontrol bilgisayarı gerektirmez.

## GitHub Pages

Bu klasördeki dosyaları deponun ana dizinine yükleyin. **Settings → Pages → Deploy from a branch → main → /(root) → Save** seçin.

Yayımlanan adreste `panel.html` kontrol paneli açılır. Site bir proje alt yolunda da çalışır; dosya yolları görelidir.

## OBS kurulumu

1. Panelde metin ve görünüm ayarlarını değiştirin.
2. **OBS bağlantısını kopyala** düğmesine basın.
3. OBS’te **Kaynaklar → + → Tarayıcı** seçin. **Yerel dosya** kapalı olsun.
4. Üretilen bağlantıyı URL alanına yapıştırın. Genişlik **1920**, yükseklik **200** yapın.
5. Kaynağı ekranın altına yerleştirin. 1920×1080 yayın için X=0, Y=880 kullanılabilir.

Panel adresini doğrudan OBS’e eklemeyin; panelin ürettiği bant bağlantısını kullanın.

## Ayarların saklanması

Ayarlar yayıncının tarayıcısında ve üretilen bağlantının içinde saklanır. Panelin açık kalması gerekmez. Her yayıncı farklı bağlantı oluşturabilir.

Ayar değiştirilince yeni bağlantıyı OBS’in URL alanına yapıştırın. Panelden mevcut OBS kaynağına otomatik eşitleme yapılmaz.

**Ayar bağlantısını kopyala** düğmesiyle ayarları başka bilgisayarda düzenlemek için yedekleyebilirsiniz.

GitHub Pages dahil hiçbir çevrimiçi barındırma sıfır kesinti garantisi sağlamaz. Başlangıçta ve kaynak yeniden yüklenirken barındırma hizmetine internet erişimi gerekir. Bant yüklendikten sonra animasyon OBS içinde çalışır.
