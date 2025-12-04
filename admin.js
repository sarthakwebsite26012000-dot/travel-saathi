// Admin Panel JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize admin functionality
    initAdminPanel();
    loadDashboardStats();
    loadRecentActivity();
    setupEventListeners();
});

function initAdminPanel() {
    console.log('Admin panel initialized');
    // Check admin authentication
    if (!isAdminAuthenticated()) {
        window.location.href = 'signin.html';
        return;
    }
    displayAdminInfo();
}

function isAdminAuthenticated() {
    // Check if admin is logged in
    return sessionStorage.getItem('adminAuth') === 'true';
}

function displayAdminInfo() {
    const adminName = sessionStorage.getItem('adminName') || 'Admin';
    const adminEmail = sessionStorage.getItem('adminEmail') || 'admin@travelsaathi.com';
    
    document.querySelectorAll('.admin-name').forEach(el => {
        el.textContent = adminName;
    });
    
    document.querySelectorAll('.admin-email').forEach(el => {
        el.textContent = adminEmail;
    });
}

function loadDashboardStats() {
    // Simulate loading dashboard statistics
    const stats = {
        totalUsers: 1247,
        activeSearches: 523,
        priceAlerts: 89,
        revenue: 45678
    };
    
    updateStatCard('total-users', stats.totalUsers);
    updateStatCard('active-searches', stats.activeSearches);
    updateStatCard('price-alerts', stats.priceAlerts);
    updateStatCard('revenue', '$' + stats.revenue.toLocaleString());
}

function updateStatCard(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = value;
    }
}

function loadRecentActivity() {
    // Simulate loading recent activity
    const activities = [
        { user: 'user123@gmail.com', action: 'New search', destination: 'Goa', time: '2 mins ago' },
        { user: 'traveler456@gmail.com', action: 'Price alert set', destination: 'Kerala', time: '15 mins ago' },
        { user: 'explorer789@gmail.com', action: 'Booking completed', destination: 'Rajasthan', time: '1 hour ago' },
        { user: 'wanderer101@gmail.com', action: 'New registration', destination: '-', time: '2 hours ago' },
        { user: 'tourist202@gmail.com', action: 'Search query', destination: 'Himachal', time: '3 hours ago' }
    ];
    
    displayActivityTable(activities);
}

function displayActivityTable(activities) {
    const tableBody = document.querySelector('.activity-table tbody');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    activities.forEach(activity => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${activity.user}</td>
            <td>${activity.action}</td>
            <td>${activity.destination}</td>
            <td>${activity.time}</td>
        `;
        tableBody.appendChild(row);
    });
}

function setupEventListeners() {
    // Sidebar navigation
    const sidebarLinks = document.querySelectorAll('.sidebar-nav a');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Remove active class from all links
            sidebarLinks.forEach(l => l.classList.remove('active'));
            // Add active class to clicked link
            this.classList.add('active');
        });
    });
    
    // Refresh button
    const refreshBtn = document.querySelector('.refresh-btn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            loadDashboardStats();
            loadRecentActivity();
            showNotification('Dashboard refreshed successfully');
        });
    }
    
    // Export button
    const exportBtn = document.querySelector('.export-btn');
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            exportData();
        });
    }
    
    // Logout button
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            logout();
        });
    }
}

function exportData() {
    // Simulate data export
    showNotification('Exporting data... Please wait');
    setTimeout(() => {
        showNotification('Data exported successfully!');
    }, 2000);
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        sessionStorage.clear();
        window.location.href = 'signin.html';
    }
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--primary-color);
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Auto-refresh stats every 30 seconds
setInterval(() => {
    loadDashboardStats();
}, 30000);

// Auto-refresh activity every 60 seconds
setInterval(() => {
    loadRecentActivity();
}, 60000);
