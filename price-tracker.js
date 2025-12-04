// Price Tracker Module
class PriceTracker {
    constructor() {
        this.trackedPrices = this.loadTrackedPrices();
        this.priceHistory = {};
        this.alertThresholds = {};
    }

    // Load tracked prices from local storage
    loadTrackedPrices() {
        try {
            const stored = localStorage.getItem('trackedPrices');
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error loading tracked prices:', error);
            return [];
        }
    }

    // Save tracked prices to local storage
    saveTrackedPrices() {
        try {
            localStorage.setItem('trackedPrices', JSON.stringify(this.trackedPrices));
        } catch (error) {
            console.error('Error saving tracked prices:', error);
        }
    }

    // Add a flight to price tracking
    trackFlight(flightData) {
        const trackingId = this.generateTrackingId(flightData);
        
        const tracking = {
            id: trackingId,
            origin: flightData.origin,
            destination: flightData.destination,
            date: flightData.date,
            airline: flightData.airline,
            currentPrice: flightData.price,
            initialPrice: flightData.price,
            lastChecked: new Date().toISOString(),
            priceHistory: [{
                price: flightData.price,
                timestamp: new Date().toISOString()
            }],
            alertEnabled: false,
            alertThreshold: null
        };

        // Check if already tracking
        const existingIndex = this.trackedPrices.findIndex(t => t.id === trackingId);
        if (existingIndex !== -1) {
            this.trackedPrices[existingIndex] = tracking;
        } else {
            this.trackedPrices.push(tracking);
        }

        this.saveTrackedPrices();
        return trackingId;
    }

    // Generate unique tracking ID
    generateTrackingId(flightData) {
        return `${flightData.origin}-${flightData.destination}-${flightData.date}-${flightData.airline}`
            .replace(/\s+/g, '-')
            .toLowerCase();
    }

    // Update price for tracked flight
    updatePrice(trackingId, newPrice) {
        const tracking = this.trackedPrices.find(t => t.id === trackingId);
        if (!tracking) {
            console.warn(`Tracking ID ${trackingId} not found`);
            return false;
        }

        const priceChanged = tracking.currentPrice !== newPrice;
        
        if (priceChanged) {
            tracking.priceHistory.push({
                price: newPrice,
                timestamp: new Date().toISOString()
            });
            
            const priceDiff = newPrice - tracking.currentPrice;
            const percentChange = ((priceDiff / tracking.currentPrice) * 100).toFixed(2);
            
            tracking.currentPrice = newPrice;
            tracking.lastChecked = new Date().toISOString();
            
            this.saveTrackedPrices();
            
            // Check if alert should be triggered
            if (tracking.alertEnabled && tracking.alertThreshold) {
                this.checkPriceAlert(tracking, priceDiff, percentChange);
            }
            
            return {
                changed: true,
                diff: priceDiff,
                percentChange: percentChange
            };
        }
        
        tracking.lastChecked = new Date().toISOString();
        this.saveTrackedPrices();
        
        return {
            changed: false
        };
    }

    // Set price alert
    setPriceAlert(trackingId, threshold, type = 'below') {
        const tracking = this.trackedPrices.find(t => t.id === trackingId);
        if (!tracking) {
            return false;
        }

        tracking.alertEnabled = true;
        tracking.alertThreshold = threshold;
        tracking.alertType = type; // 'below', 'above', or 'change'
        
        this.saveTrackedPrices();
        return true;
    }

    // Check if price alert should be triggered
    checkPriceAlert(tracking, priceDiff, percentChange) {
        const shouldAlert = this.shouldTriggerAlert(tracking, priceDiff, percentChange);
        
        if (shouldAlert) {
            this.triggerAlert(tracking, priceDiff, percentChange);
        }
    }

    // Determine if alert should be triggered
    shouldTriggerAlert(tracking, priceDiff, percentChange) {
        const { alertType, alertThreshold, currentPrice } = tracking;
        
        switch (alertType) {
            case 'below':
                return currentPrice <= alertThreshold;
            case 'above':
                return currentPrice >= alertThreshold;
            case 'change':
                return Math.abs(percentChange) >= alertThreshold;
            default:
                return false;
        }
    }

    // Trigger price alert
    triggerAlert(tracking, priceDiff, percentChange) {
        const message = this.formatAlertMessage(tracking, priceDiff, percentChange);
        
        // Show browser notification if supported
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Travel Saathi Price Alert', {
                body: message,
                icon: '/favicon.ico'
            });
        }
        
        // Store alert in notification system
        this.storeNotification({
            type: 'price_alert',
            trackingId: tracking.id,
            message: message,
            timestamp: new Date().toISOString(),
            read: false
        });
        
        console.log('Price alert triggered:', message);
    }

    // Format alert message
    formatAlertMessage(tracking, priceDiff, percentChange) {
        const direction = priceDiff > 0 ? 'increased' : 'decreased';
        return `Price ${direction} for ${tracking.origin} to ${tracking.destination} on ${tracking.date}. ` +
               `Current price: ₹${tracking.currentPrice} (${percentChange}% change)`;
    }

    // Store notification
    storeNotification(notification) {
        try {
            const notifications = JSON.parse(localStorage.getItem('priceNotifications') || '[]');
            notifications.unshift(notification);
            // Keep only last 50 notifications
            if (notifications.length > 50) {
                notifications.splice(50);
            }
            localStorage.setItem('priceNotifications', JSON.stringify(notifications));
        } catch (error) {
            console.error('Error storing notification:', error);
        }
    }

    // Get all tracked flights
    getTrackedFlights() {
        return this.trackedPrices;
    }

    // Remove tracking
    removeTracking(trackingId) {
        const index = this.trackedPrices.findIndex(t => t.id === trackingId);
        if (index !== -1) {
            this.trackedPrices.splice(index, 1);
            this.saveTrackedPrices();
            return true;
        }
        return false;
    }

    // Get price history for a tracked flight
    getPriceHistory(trackingId) {
        const tracking = this.trackedPrices.find(t => t.id === trackingId);
        return tracking ? tracking.priceHistory : [];
    }

    // Calculate price statistics
    getPriceStats(trackingId) {
        const tracking = this.trackedPrices.find(t => t.id === trackingId);
        if (!tracking || tracking.priceHistory.length === 0) {
            return null;
        }

        const prices = tracking.priceHistory.map(h => h.price);
        const min = Math.min(...prices);
        const max = Math.max(...prices);
        const avg = prices.reduce((a, b) => a + b, 0) / prices.length;
        
        return {
            min: min,
            max: max,
            avg: avg.toFixed(2),
            current: tracking.currentPrice,
            trend: this.calculateTrend(tracking.priceHistory)
        };
    }

    // Calculate price trend
    calculateTrend(priceHistory) {
        if (priceHistory.length < 2) {
            return 'stable';
        }

        const recent = priceHistory.slice(-5);
        const firstPrice = recent[0].price;
        const lastPrice = recent[recent.length - 1].price;
        const change = ((lastPrice - firstPrice) / firstPrice) * 100;

        if (change > 5) return 'increasing';
        if (change < -5) return 'decreasing';
        return 'stable';
    }
}

// Request notification permission on load
if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PriceTracker;
}
