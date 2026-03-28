// GROUPS.HTML - İLK HAFTA KURUCU = LİDER DÜZELTMESİ

// createGroup() fonksiyonunu güncelle:
function createGroup() {
    const groupName = document.getElementById('groupName').value.trim();
    if (!groupName) { alert('Lütfen grup adı girin!'); return; }

    const groups = JSON.parse(localStorage.getItem('groups')) || [];
    const myGroups = groups.filter(g => g.members.includes(currentUser));
    const maxGroups = isPremium ? 4 : 1;
    
    if (myGroups.length >= maxGroups) {
        alert(isPremium ? '⚠️ Maksimum 4 grupta bulunabilirsiniz!' : '⚠️ Ücretsiz kullanıcılar sadece 1 grupta bulunabilir!');
        return;
    }

    const newGroup = {
        id: 'group_' + Date.now(),
        name: groupName,
        founder: currentUser,
        leader: currentUser, // İLK HAFTA KURUCU = LİDER
        members: [currentUser],
        maxSize: selectedSize,
        createdAt: new Date().toISOString()
    };

    groups.push(newGroup);
    localStorage.setItem('groups', JSON.stringify(groups));
    closeModal('createGroup');
    alert('Grup başarıyla oluşturuldu!');
    document.getElementById('groupName').value = '';
    loadGroups();
}

// updateWeeklyLeader() fonksiyonunu güncelle:
function updateWeeklyLeader() {
    const groups = JSON.parse(localStorage.getItem('groups')) || [];
    const today = new Date();
    
    if (today.getDay() === 0) { // Pazar günü
        groups.forEach(group => {
            const createdDate = new Date(group.createdAt);
            const daysSinceCreation = Math.floor((today - createdDate) / (1000 * 60 * 60 * 24));
            
            // İlk 7 gün içindeyse kurucu lider kalır
            if (daysSinceCreation < 7) {
                group.leader = group.founder;
            } else {
                // 7 gün geçtiyse soru sayısına göre lider belirlenir
                const weeklyScores = calculateWeeklyScores(group.members);
                if (weeklyScores.length > 0) {
                    group.leader = weeklyScores[0].name;
                }
            }
        });
        localStorage.setItem('groups', JSON.stringify(groups));
    }
}
