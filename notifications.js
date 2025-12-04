// Notifications Module for Travel Saathi
class NotificationManager {
    constructor() {
        this.notifications = this.loadNotifications();
        this.unreadCount = 0;
        this.updateUnreadCount();
    }

    loadNotifications() {
        try {
            const stored = localStorage.getItem('notifications');
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error loading notifications:', error);
            return [];
        }
    }

    saveNotifications() {
        try {
            localStorage.setItem('notifications', JSON.stringify(this.notifications));
            this.updateUnreadCount();
        } catch (error) {
            console.error('Error saving notifications:', error);
        }
    }

    addNotification(type, title, message, data = {}) {
        const notification = {
            id: Date.now() + Math.random(),
            type: type,
            title: title,
            message: message,
            data: data,
            timestamp: new Date().toISOString(),
            read: false
        };

        this.notifications.unshift(notification);
        if (this.notifications.length > 100) {
            this.notifications.splice(100);
        }

        this.saveNotifications();
        this.showBrowserNotification(title, message);
        return notification.id;
    }

    showBrowserNotification(title, message) {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(title, {
                body: message,
                icon: '/favicon.ico',
                badge: '/favicon.ico'
            });
        }
    }

    markAsRead(notificationId) {
        const notification = this.notifications.find(n => n.id === notificationId);
        if (notification) {
            notification.read = true;
            this.saveNotifications();
        }
    }

    markAllAsRead() {
        this.notifications.forEach(n => n.read = true);
        this.saveNotifications();
    }

    deleteNotification(notificationId) {
        this.notifications = this.notifications.filter(n => n.id !== notificationId);
        this.saveNotifications();
    }

    clearAll() {
        this.notifications = [];
        this.saveNotifications();
    }

    getNotifications(limit = 50) {
        return this.notifications.slice(0, limit);
    }

    getUnreadNotifications() {
        return this.notifications.filter(n => !n.read);
    }

    updateUnreadCount() {
        this.unreadCount = this.notifications.filter(n => !n.read).length;
        this.updateBadge();
    }

    updateBadge() {
        const badge = document.querySelector('.notification-badge');
        if (badge) {
            if (this.unreadCount > 0) {
                badge.textContent = this.unreadCount > 99 ? '99+' : this.unreadCount;
                badge.style.display = 'block';
            } else {
                badge.style.display = 'none';
            }
        }
    }

    requestPermission() {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission().then(permission => {
                console.log('Notification permission:', permission);
            });
        }
    }
}

const notificationManager = new NotificationManager();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = NotificationManager;
}
