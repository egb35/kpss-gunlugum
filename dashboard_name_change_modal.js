// DASHBOARD.HTML - İSİM DEĞİŞTİR MODAL

// 1) CSS ekle (style bölümüne):
.name-change-modal { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 10000; align-items: center; justify-content: center; }
.name-change-modal.active { display: flex; }
.name-change-modal-content { background: white; padding: 2.5rem; border-radius: 20px; max-width: 450px; width: 90%; box-shadow: 0 10px 40px rgba(0,0,0,0.3); }

// 2) HTML modal ekle (body sonuna):
<div id="nameChangeModal" class="name-change-modal">
    <div class="name-change-modal-content">
        <h2 style="color: var(--warm-dark); margin-bottom: 1.5rem; text-align: center;">✏️ İsim Değiştir</h2>
        <p style="color: var(--warm-brown); margin-bottom: 1rem; text-align: center;">Mevcut isminiz: <strong id="currentNameDisplay"></strong></p>
        <div class="form-group">
            <label>Yeni İsim</label>
            <input type="text" id="newNameInput" placeholder="Yeni isminizi girin">
        </div>
        <button class="btn btn-primary" onclick="saveNewName()" style="width: 100%; margin-bottom: 0.5rem;">Kaydet</button>
        <button class="btn" onclick="closeNameChangeModal()" style="width: 100%; background: #95a5a6;">İptal</button>
    </div>
</div>

// 3) JavaScript fonksiyonları ekle:
function openNameChange() {
    document.getElementById('currentNameDisplay').textContent = currentUser;
    document.getElementById('newNameInput').value = '';
    document.getElementById('nameChangeModal').classList.add('active');
    document.getElementById('profilePopup').classList.remove('active');
}

function closeNameChangeModal() {
    document.getElementById('nameChangeModal').classList.remove('active');
}

function saveNewName() {
    const newName = document.getElementById('newNameInput').value.trim();
    
    if (!newName) {
        showNotification('⚠️ Lütfen yeni isim girin!', 'warning');
        return;
    }
    
    if (newName === currentUser) {
        showNotification('⚠️ Yeni isim mevcut isminizle aynı!', 'warning');
        return;
    }
    
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    if (users.find(u => u.name === newName)) {
        showNotification('❌ Bu isim zaten kullanılıyor!', 'error');
        return;
    }
    
    // Tüm verileri yeni isme taşı
    const userIndex = users.findIndex(u => u.name === currentUser);
    if (userIndex === -1) return;
    
    const oldName = currentUser;
    users[userIndex].name = newName;
    
    // LocalStorage verilerini taşı
    const keysToMove = [
        'streak_', 'lastActivity_', 'lastStreakActivity_', 'lastStreakCheck_',
        'questionsData_', 'denemeler_', 'profilePicture_', 'ownedProfilePictures_',
        'friends_', 'friendRequests_', 'rejectedRequests_', 'deletedMessages_'
    ];
    
    keysToMove.forEach(prefix => {
        const value = localStorage.getItem(prefix + oldName);
        if (value) {
            localStorage.setItem(prefix + newName, value);
            localStorage.removeItem(prefix + oldName);
        }
    });
    
    // Gruplarda isim güncelle
    const groups = JSON.parse(localStorage.getItem('groups')) || [];
    groups.forEach(group => {
        if (group.founder === oldName) group.founder = newName;
        if (group.leader === oldName) group.leader = newName;
        if (group.members.includes(oldName)) {
            const index = group.members.indexOf(oldName);
            group.members[index] = newName;
        }
    });
    localStorage.setItem('groups', JSON.stringify(groups));
    
    // Arkadaş listelerinde güncelle
    users.forEach(user => {
        const friends = JSON.parse(localStorage.getItem('friends_' + user.name)) || [];
        if (friends.includes(oldName)) {
            const index = friends.indexOf(oldName);
            friends[index] = newName;
            localStorage.setItem('friends_' + user.name, JSON.stringify(friends));
        }
    });
    
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', newName);
    
    showNotification('✅ İsminiz başarıyla değiştirildi!', 'success');
    closeNameChangeModal();
    setTimeout(() => location.reload(), 1500);
}

// 4) openNameChange() fonksiyonunu profile menüsünde kullan (profile-item onclick):
<div class="profile-item" onclick="openNameChange()">✏️ İsim Değiştir</div>
