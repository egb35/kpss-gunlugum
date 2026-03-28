// DASHBOARD.HTML'e EKLENECEK KOD
// document.addEventListener('DOMContentLoaded', function() { satırından ÖNCE ekle

function checkStreakLoss() {
    const today = new Date().toISOString().split('T')[0];
    const lastCheck = localStorage.getItem('lastStreakCheck_' + currentUser);
    const lastActivity = localStorage.getItem('lastActivity_' + currentUser);
    const currentStreak = parseInt(localStorage.getItem('streak_' + currentUser) || '0');
    
    if (lastCheck === today) return; // Bugün zaten kontrol edildi
    
    if (lastActivity && currentStreak > 0) {
        const lastDate = new Date(lastActivity);
        const todayDate = new Date(today);
        const daysDiff = Math.floor((todayDate - lastDate) / (1000 * 60 * 60 * 24));
        
        if (daysDiff > 1) { // 1 günden fazla girmemiş
            // Streak kaybedildi
            const lostStreak = currentStreak;
            localStorage.setItem('streak_' + currentUser, '0');
            localStorage.setItem('lastStreakCheck_' + currentUser, today);
            
            // Bildirim göster
            const modal = document.createElement('div');
            modal.className = 'modal active';
            modal.innerHTML = `
                <div class="modal-content" style="text-align: center; max-width: 400px;">
                    <h2 style="color: #e74c3c; margin-bottom: 1rem;">🔥 Streak Kaybedildi!</h2>
                    <p style="font-size: 1.2rem; margin-bottom: 1rem;">
                        <strong>${lostStreak}</strong> günlük streak'iniz sona erdi.
                    </p>
                    <p style="color: var(--warm-brown); margin-bottom: 2rem;">
                        ${daysDiff} gün boyunca giriş yapmadınız. Yeniden başlayın ve daha uzun bir streak oluşturun!
                    </p>
                    <button class="btn btn-primary" onclick="this.closest('.modal').remove()" style="width: 100%;">
                        Anladım, Devam Edelim! 💪
                    </button>
                </div>
            `;
            document.body.appendChild(modal);
        } else {
            localStorage.setItem('lastStreakCheck_' + currentUser, today);
        }
    } else {
        localStorage.setItem('lastStreakCheck_' + currentUser, today);
    }
}

// DOMContentLoaded içinde çağır
checkStreakLoss();
