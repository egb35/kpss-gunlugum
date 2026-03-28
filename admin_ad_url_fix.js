// ADMIN.HTML - REKLAM URL EKLEYİP TIKLAYINCA YENİ SEKMEDE AÇMA

// 1) uploadAdImage() fonksiyonunu güncelle - URL alanı ekle:
function uploadAdImage() {
    const name = document.getElementById('adImageName').value.trim();
    const url = document.getElementById('adImageUrl').value.trim(); // YENİ ALAN
    const file = document.getElementById('adImageFile').files[0];
    
    if (!name || !file) {
        alert('Lütfen isim ve resim seçin!');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const adImages = JSON.parse(localStorage.getItem('adImages')) || [];
        const newImage = {
            id: 'ad_' + Date.now(),
            name: name,
            image: e.target.result,
            url: url || '', // URL opsiyonel
            createdAt: new Date().toISOString()
        };
        adImages.push(newImage);
        localStorage.setItem('adImages', JSON.stringify(adImages));
        alert('✅ Reklam resmi yüklendi!');
        document.getElementById('adImageName').value = '';
        document.getElementById('adImageUrl').value = '';
        document.getElementById('adImageFile').value = '';
        loadAdImages();
    };
    reader.readAsDataURL(file);
}

// 2) HTML'e URL input alanı ekle (Ad Image Library kartında):
<div class="form-group">
    <label>Hedef URL (Opsiyonel)</label>
    <input type="text" id="adImageUrl" placeholder="https://example.com/urun" style="width: 100%; padding: 0.8rem; border: 2px solid var(--warm-cream); border-radius: 10px;">
    <small style="color: var(--warm-brown);">Banner'a tıklayınca açılacak sayfa</small>
</div>

// 3) setBanner() fonksiyonunu güncelle - URL'i kaydet:
function setBanner(location) {
    const selectedId = document.getElementById('banner' + location.charAt(0).toUpperCase() + location.slice(1) + 'Select').value;
    const enabled = document.getElementById('enable' + location.charAt(0).toUpperCase() + location.slice(1)).checked;
    
    if (!selectedId) {
        alert('Lütfen bir resim seçin!');
        return;
    }
    
    const adImages = JSON.parse(localStorage.getItem('adImages')) || [];
    const selectedImage = adImages.find(img => img.id === selectedId);
    
    if (!selectedImage) return;
    
    localStorage.setItem('selectedBanner_' + location, selectedId);
    localStorage.setItem('adEnabled_' + location, enabled);
    
    // URL'i de kaydet
    if (selectedImage.url) {
        localStorage.setItem('bannerUrl_' + location, selectedImage.url);
    } else {
        localStorage.removeItem('bannerUrl_' + location);
    }
    
    if (enabled) {
        const bannerHTML = selectedImage.url 
            ? `<a href="${selectedImage.url}" target="_blank" rel="noopener noreferrer"><img src="${selectedImage.image}" style="width:100%;height:auto;border-radius:10px;"></a>`
            : `<img src="${selectedImage.image}" style="width:100%;height:auto;border-radius:10px;">`;
        
        localStorage.setItem('adBanner_' + location, bannerHTML);
        alert('✅ Banner ayarlandı!');
    } else {
        localStorage.removeItem('adBanner_' + location);
        alert('✅ Banner devre dışı bırakıldı!');
    }
    
    loadBanners();
}

// 4) DASHBOARD.HTML'de banner gösterimi (zaten var, değişiklik yok):
// Banner'lar otomatik olarak tıklanabilir link olacak
