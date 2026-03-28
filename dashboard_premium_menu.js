// DASHBOARD.HTML - PREMİUM MENÜ EKLEME

// Profil popup'a premium seçeneği ekle:
<div class="profile-popup" id="profilePopup">
    <h3 id="profileName">Kullanıcı</h3>
    <div class="profile-item" onclick="openProfilePicture()">🖼️ Profil Resmi</div>
    <div class="profile-item" onclick="openNameChange()">✏️ İsim Değiştir</div>
    <div class="profile-item" onclick="location.href='premium.html'">⭐ Premium</div>
    <div class="profile-item" onclick="showReferral()">🔗 Referans Linkim</div>
    <div class="profile-item" onclick="logout()">🚪 Çıkış Yap</div>
</div>

// TÜM SAYFALARDA (dashboard, groups, streak, friends, achievements) aynı şekilde ekle
