// Profile Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    if (!localStorage.getItem('userToken')) {
        window.location.href = 'signin.html';
        return;
    }

    // Load user profile
    loadUserProfile();

    // Event listeners
    document.getElementById('saveProfileBtn').addEventListener('click', saveProfile);
    document.getElementById('savePrefsBtn').addEventListener('click', savePreferences);
    document.getElementById('clearSearchesBtn').addEventListener('click', clearSearchHistory);
    document.getElementById('deleteAccountBtn').addEventListener('click', deleteAccount);
    document.getElementById('logoutBtn').addEventListener('click', logout);
});

function loadUserProfile() {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    
    document.getElementById('profileName').textContent = userData.name || 'User';
    document.getElementById('profileEmail').textContent = userData.email || '';
    document.getElementById('fullName').value = userData.name || '';
    document.getElementById('email').value = userData.email || '';
    document.getElementById('phone').value = userData.phone || '';
    document.getElementById('location').value = userData.location || '';
    
    // Load preferences
    const prefs = JSON.parse(localStorage.getItem('userPreferences') || '{}');
    document.getElementById('emailNotif').checked = prefs.emailNotif !== false;
    document.getElementById('priceAlerts').checked = prefs.priceAlerts !== false;
    document.getElementById('travelDeals').checked = prefs.travelDeals || false;
    document.getElementById('weeklyDigest').checked = prefs.weeklyDigest || false;
    
    // Load search history
    loadSearchHistory();
}

function saveProfile() {
    const userData = {
        name: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        location: document.getElementById('location').value
    };
    
    localStorage.setItem('userData', JSON.stringify(userData));
    showNotification('Profile updated successfully!', 'success');
}

function savePreferences() {
    const prefs = {
        emailNotif: document.getElementById('emailNotif').checked,
        priceAlerts: document.getElementById('priceAlerts').checked,
        travelDeals: document.getElementById('travelDeals').checked,
        weeklyDigest: document.getElementById('weeklyDigest').checked
    };
    
    localStorage.setItem('userPreferences', JSON.stringify(prefs));
    showNotification('Preferences saved successfully!', 'success');
}

function loadSearchHistory() {
    const searchHistory = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    const container = document.getElementById('recentSearches');
    
    if (searchHistory.length === 0) {
        container.innerHTML = '<p class="no-data">No recent searches</p>';
        return;
    }
    
    container.innerHTML = searchHistory.slice(0, 10).map(search => `
        <div class="search-item">
            <i class="fas fa-search"></i>
            <span>${search.from} → ${search.to}</span>
            <span class="search-date">${new Date(search.date).toLocaleDateString()}</span>
        </div>
    `).join('');
}

function clearSearchHistory() {
    if (confirm('Are you sure you want to clear your search history?')) {
        localStorage.removeItem('searchHistory');
        loadSearchHistory();
        showNotification('Search history cleared', 'success');
    }
}

function deleteAccount() {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
        if (confirm('This will permanently delete all your data. Are you absolutely sure?')) {
            localStorage.clear();
            window.location.href = 'signin.html';
        }
    }
}

function logout() {
    localStorage.removeItem('userToken');
    window.location.href = 'signin.html';
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 2rem;
        background: ${type === 'success' ? '#48bb78' : '#f56565'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}
