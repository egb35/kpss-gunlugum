// TÜM SAYFALARDA - ALERT YERİNE MODAL BİLDİRİM SİSTEMİ

// 1) CSS ekle (her sayfanın style bölümüne):
.notification-modal { position: fixed; top: 20px; right: 20px; background: white; padding: 1.5rem; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.3); z-index: 10000; min-width: 300px; max-width: 400px; animation: slideInRight 0.3s; }
@keyframes slideInRight { from { opacity: 0; transform: translateX(100px); } to { opacity: 1; transform: translateX(0); } }
.notification-modal.success { border-left: 5px solid #2ecc71; }
.notification-modal.error { border-left: 5px solid #e74c3c; }
.notification-modal.warning { border-left: 5px solid #f39c12; }
.notification-modal.info { border-left: 5px solid #3498db; }
.notification-modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }
.notification-modal-title { font-weight: bold; color: var(--warm-dark); }
.notification-modal-close { background: none; border: none; font-size: 1.5rem; cursor: pointer; color: var(--warm-brown); }

// 2) JavaScript fonksiyonu:
function showNotification(message, type = 'info') {
    // Mevcut bildirimleri temizle
    document.querySelectorAll('.notification-modal').forEach(n => n.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification-modal ${type}`;
    
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };
    
    notification.innerHTML = `
        <div class="notification-modal-header">
            <span class="notification-modal-title">${icons[type]} Bildirim</span>
            <button class="notification-modal-close" onclick="this.closest('.notification-modal').remove()">&times;</button>
        </div>
        <p style="color: var(--warm-brown); margin: 0;">${message}</p>
    `;
    
    document.body.appendChild(notification);
    
    // 3 saniye sonra otomatik kapat
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// 3) Tüm alert() çağrılarını showNotification() ile değiştir:

// ÖNCEKİ:
alert('✅ Başarılı!');
alert('❌ Hata!');
alert('⚠️ Uyarı!');

// YENİ:
showNotification('Başarılı!', 'success');
showNotification('Hata!', 'error');
showNotification('Uyarı!', 'warning');

// Örnekler:
// Login başarılı: showNotification('Giriş başarılı! Yönlendiriliyorsunuz...', 'success');
// Kayıt başarılı: showNotification('Kayıt başarılı! Giriş yapabilirsiniz.', 'success');
// Hatalı şifre: showNotification('E-posta veya şifre hatalı!', 'error');
// Eksik alan: showNotification('Lütfen tüm alanları doldurun!', 'warning');
// Bilgi: showNotification('Profil resmi değiştirmek için Dashboard sayfasına gidin.', 'info');
