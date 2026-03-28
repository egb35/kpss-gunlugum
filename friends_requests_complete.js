// FRIENDS.HTML - ARKADAŞLIK İSTEKLERİ TAM ÇALIŞIR + ARKADAŞ SİLME

// 1) HTML - Arkadaşlık İstekleri Kartı (Arkadaşlarım kartından ÖNCE):
<div class="card">
    <div class="card-header">
        <h2>📬 Arkadaşlık İstekleri</h2>
    </div>
    <div id="friendRequestsContainer"></div>
</div>

<div class="card">
    <div class="card-header">
        <h2>➕ Arkadaş Ekle</h2>
    </div>
    <div class="form-group">
        <input type="text" id="friendRequestName" placeholder="Kullanıcı adı girin">
    </div>
    <button class="btn" onclick="sendFriendRequest()">İstek Gönder</button>
</div>

// 2) JavaScript - İstek Sistemi:
function loadFriendRequests() {
    const requests = JSON.parse(localStorage.getItem('friendRequests_' + currentUser)) || [];
    const container = document.getElementById('friendRequestsContainer');
    
    if (requests.length === 0) {
        container.innerHTML = '<p style="text-align: center; padding: 2rem; color: var(--warm-brown);">Henüz arkadaşlık isteği yok.</p>';
        return;
    }
    
    let html = '<div class="friend-list">';
    requests.forEach(req => {
        html += `
            <div class="friend-item">
                <div class="friend-info">
                    <div class="avatar">${req.from.charAt(0).toUpperCase()}</div>
                    <strong>${req.from}</strong>
                </div>
                <div style="display: flex; gap: 0.5rem;">
                    <button class="btn btn-small" onclick="acceptFriendRequest('${req.from}')" style="background: #2ecc71;">✓ Kabul</button>
                    <button class="btn btn-small" onclick="rejectFriendRequest('${req.from}')" style="background: #e74c3c;">✗ Reddet</button>
                </div>
            </div>
        `;
    });
    html += '</div>';
    container.innerHTML = html;
}

function sendFriendRequest() {
    const friendName = document.getElementById('friendRequestName').value.trim();
    
    if (!friendName) {
        alert('⚠️ Lütfen kullanıcı adı girin!');
        return;
    }
    
    if (friendName === currentUser) {
        alert('⚠️ Kendinize istek gönderemezsiniz!');
        return;
    }
    
    const users = JSON.parse(localStorage.getItem('users')) || [];
    if (!users.find(u => u.name === friendName)) {
        alert('❌ Bu kullanıcı adı bulunamadı!');
        return;
    }
    
    const myFriends = JSON.parse(localStorage.getItem('friends_' + currentUser)) || [];
    if (myFriends.includes(friendName)) {
        alert('⚠️ Bu kullanıcı zaten arkadaşınız!');
        return;
    }
    
    // 7 günlük yasak kontrolü
    const rejected = JSON.parse(localStorage.getItem('rejectedRequests_' + currentUser)) || {};
    if (rejected[friendName]) {
        const rejectedDate = new Date(rejected[friendName]);
        const today = new Date();
        const daysDiff = Math.floor((today - rejectedDate) / (1000 * 60 * 60 * 24));
        
        if (daysDiff < 7) {
            alert(`⚠️ ${friendName} kullanıcısına ${7 - daysDiff} gün boyunca istek gönderemezsiniz.`);
            return;
        } else {
            delete rejected[friendName];
            localStorage.setItem('rejectedRequests_' + currentUser, JSON.stringify(rejected));
        }
    }
    
    const targetRequests = JSON.parse(localStorage.getItem('friendRequests_' + friendName)) || [];
    
    if (targetRequests.find(r => r.from === currentUser)) {
        alert('⚠️ Bu kullanıcıya zaten istek gönderdiniz!');
        return;
    }
    
    targetRequests.push({
        from: currentUser,
        date: new Date().toISOString()
    });
    
    localStorage.setItem('friendRequests_' + friendName, JSON.stringify(targetRequests));
    alert('✅ Arkadaşlık isteği gönderildi!');
    document.getElementById('friendRequestName').value = '';
}

function acceptFriendRequest(fromUser) {
    const myFriends = JSON.parse(localStorage.getItem('friends_' + currentUser)) || [];
    const theirFriends = JSON.parse(localStorage.getItem('friends_' + fromUser)) || [];
    
    if (!myFriends.includes(fromUser)) {
        myFriends.push(fromUser);
        localStorage.setItem('friends_' + currentUser, JSON.stringify(myFriends));
    }
    
    if (!theirFriends.includes(currentUser)) {
        theirFriends.push(currentUser);
        localStorage.setItem('friends_' + fromUser, JSON.stringify(theirFriends));
    }
    
    let requests = JSON.parse(localStorage.getItem('friendRequests_' + currentUser)) || [];
    requests = requests.filter(r => r.from !== fromUser);
    localStorage.setItem('friendRequests_' + currentUser, JSON.stringify(requests));
    
    alert('✅ Arkadaş eklendi!');
    loadFriendRequests();
    loadFriends();
}

function rejectFriendRequest(fromUser) {
    const rejected = JSON.parse(localStorage.getItem('rejectedRequests_' + fromUser)) || {};
    rejected[currentUser] = new Date().toISOString();
    localStorage.setItem('rejectedRequests_' + fromUser, JSON.stringify(rejected));
    
    let requests = JSON.parse(localStorage.getItem('friendRequests_' + currentUser)) || [];
    requests = requests.filter(r => r.from !== fromUser);
    localStorage.setItem('friendRequests_' + currentUser, JSON.stringify(requests));
    
    alert('❌ İstek reddedildi. Bu kullanıcı 7 gün boyunca size istek gönderemeyecek.');
    loadFriendRequests();
}

function removeFriend(friendName) {
    if (!confirm(`${friendName} kullanıcısını arkadaş listenizden çıkarmak istediğinizden emin misiniz?`)) return;
    
    let myFriends = JSON.parse(localStorage.getItem('friends_' + currentUser)) || [];
    let theirFriends = JSON.parse(localStorage.getItem('friends_' + friendName)) || [];
    
    myFriends = myFriends.filter(f => f !== friendName);
    theirFriends = theirFriends.filter(f => f !== currentUser);
    
    localStorage.setItem('friends_' + currentUser, JSON.stringify(myFriends));
    localStorage.setItem('friends_' + friendName, JSON.stringify(theirFriends));
    
    alert('✅ Arkadaş silindi!');
    loadFriends();
}

// 3) loadFriends() fonksiyonunu güncelle - Sil butonu ekle:
friends.forEach(friend => {
    html += `
        <div class="friend-item">
            <div class="friend-info">
                <div class="avatar">${friend.charAt(0).toUpperCase()}</div>
                <strong>${friend}</strong>
            </div>
            <button class="btn btn-small" onclick="removeFriend('${friend}')" style="background: #e74c3c;">🗑️ Sil</button>
        </div>
    `;
});

// 4) Sayfa yüklenince loadFriendRequests() çağır
loadFriendRequests();
