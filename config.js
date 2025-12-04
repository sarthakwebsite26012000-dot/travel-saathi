// Travel Saathi Configuration
const config = {
    app: {
        name: 'Travel Saathi',
        version: '1.0.0',
        description: 'Your Indian Travel Companion'
    },
    api: {
        baseURL: process.env.API_BASE_URL || 'https://api.travelsaathi.com',
        timeout: 30000
    },
    features: {
        priceTracking: true,
        notifications: true,
        multiCitySearch: true,
        priceComparison: true
    },
    sources: ['MakeMyTrip', 'Goibibo', 'Cleartrip', 'EaseMyTrip', 'Yatra'],
    cache: {
        enabled: true,
        timeout: 300000
    },
    destinations: {
        popular: ['Goa', 'Kerala', 'Rajasthan', 'Himachal Pradesh', 'Tamil Nadu']
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = config;
}
