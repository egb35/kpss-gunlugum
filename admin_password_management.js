// ADMIN.HTML - ŞİFRE GÖRME/DEĞİŞTİRME TAM ÇALIŞIR HAL

// 1) CSS ekle:
.password-modal { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 10000; align-items: center; justify-content: center; }
.password-modal.active { display: flex; }
.password-modal-content { background: white; padding: 2rem; border-radius: 15px; max-width: 450px; width: 90%; }

// 2) HTML modal ekle:
<div id="passwordModal" class="password-modal">
    <div class="password-modal-content">
        <h2 style="color: var(--warm-dark); margin-bottom: 1rem;">🔑 Şifre Yönetimi</h2>
        <div style="background: var(--warm-light); padding: 1rem; border-radius: 10px; margin: 1rem 0;">
            <p><strong>Kullanıcı:</strong> <span id="passwordUsername"></span></p>
            <p><strong>E-posta:</strong> <span id="passwordEmail"></span></p>
            <p style="margin-top: 0.5rem;"><strong>Mevcut Şifre:</strong> <span id="currentPassword" style="font-family: monospace; background: white; padding: 0.3rem 0.6rem; border-radius: 5px; display: inline-block; margin-top: 0.3rem;"></span></p>
        </div>
        <div class="form-group">
            <label>Yeni Şifre</label>
            <input type="text" id="newPassword" placeholder="Yeni şifre girin" style="width: 100%; padding: 0.8rem; border: 2px solid var(--warm-cream); border-radius: 10px;">
        </div>
        <button class="btn btn-primary" onclick="changeUserPassword()" style="width: 100%; margin-bottom: 0.5rem; background: #3498db;">Şifreyi Değiştir</button>
        <button class="btn" onclick="closePasswordModal()" style="width: 100%; background: #95a5a6;">İptal</button>
    </div>
</div>

// 3) JavaScript:
let selectedPasswordUser = null;

function showPasswordModal(username) {
    selectedPasswordUser = username;
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.name === username);
    
    if (!user) return;
    
    document.getElementById('passwordUsername').textContent = username;
    document.getElementById('passwordEmail').textContent = user.email;
    document.getElementById('currentPassword').textContent = user.password;
    document.getElementById('newPassword').value = '';
    document.getElementById('passwordModal').classList.add('active');
}

function closePasswordModal() {
    document.getElementById('passwordModal').classList.remove('active');
    selectedPasswordUser = null;
}

function changeUserPassword() {
    const newPassword = document.getElementById('newPassword').value.trim();
    
    if (!newPassword) {
        alert('⚠️ Lütfen yeni şifre girin!');
        return;
    }
    
    if (newPassword.length < 6) {
        alert('⚠️ Şifre en az 6 karakter olmalıdır!');
        return;
    }
    
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(u => u.name === selectedPasswordUser);
    
    if (userIndex === -1) return;
    
    users[userIndex].password = newPassword;
    localStorage.setItem('users', JSON.stringify(users));
    
    alert('✅ Şifre başarıyla değiştirildi!');
    document.getElementById('currentPassword').textContent = newPassword;
    loadUsers();
}

// 4) loadUsers() fonksiyonunu güncelle - tablo HTML'ine şifre butonu ekle:
html += `
    <tr>
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>${user.createdAt.split('T')[0]}</td>
        <td>${user.isPremium ? '⭐ Premium' : 'Ücretsiz'}</td>
        <td>
            <button class="btn btn-small" onclick="showPasswordModal('${user.name}')" style="background: #3498db; padding: 0.4rem 0.8rem;">🔑 Şifre</button>
            ${!user.isPremium ? `<button class="btn btn-small" onclick="makePremium('${user.name}')" style="background: gold; color: #333; padding: 0.4rem 0.8rem;">⭐ Premium Yap</button>` : ''}
            <button class="btn btn-small" onclick="deleteUser('${user.name}')" style="background: #e74c3c; padding: 0.4rem 0.8rem;">🗑️ Sil</button>
        </td>
    </tr>
`;
