// Flight Data Scraper Utility
// Simulates scraping flight data from various sources

class FlightScraper {
    constructor() {
        this.sources = ['MakeMyTrip', 'Goibibo', 'Cleartrip', 'EaseMyTrip', 'Yatra'];
        this.cache = new Map();
        this.cacheTimeout = 300000; // 5 minutes
    }

    // Main search method
    async searchFlights(origin, destination, date, passengers = 1) {
        const cacheKey = `${origin}-${destination}-${date}-${passengers}`;
        
        // Check cache first
        if (this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (Date.now() - cached.timestamp < this.cacheTimeout) {
                console.log('Returning cached results');
                return cached.data;
            }
        }
        
        console.log('Fetching fresh flight data...');
        const results = await this.fetchFlightData(origin, destination, date, passengers);
        
        // Cache results
        this.cache.set(cacheKey, {
            data: results,
            timestamp: Date.now()
        });
        
        return results;
    }

    // Simulate fetching flight data
    async fetchFlightData(origin, destination, date, passengers) {
        // Simulate API delay
        await this.delay(800);
        
        const flights = [];
        const numFlights = this.randomInt(8, 15);
        
        for (let i = 0; i < numFlights; i++) {
            flights.push(this.generateFlightData(origin, destination, date, i));
        }
        
        return flights.sort((a, b) => a.price - b.price);
    }

    // Generate simulated flight data
    generateFlightData(origin, destination, date, index) {
        const airlines = ['IndiGo', 'Air India', 'SpiceJet', 'Vistara', 'AirAsia', 'Go First'];
        const airline = airlines[this.randomInt(0, airlines.length - 1)];
        
        const departureTime = this.generateTime(6, 22);
        const duration = this.randomInt(60, 300);
        const arrivalTime = this.calculateArrivalTime(departureTime, duration);
        
        const basePrice = this.randomInt(2500, 8000);
        const stops = this.randomInt(0, 2);
        const priceMultiplier = 1 + (stops * 0.15);
        
        return {
            id: `FL${Date.now()}${index}`,
            airline: airline,
            flightNumber: `${airline.substring(0, 2).toUpperCase()}${this.randomInt(100, 999)}`,
            origin: origin,
            destination: destination,
            date: date,
            departureTime: departureTime,
            arrivalTime: arrivalTime,
            duration: this.formatDuration(duration),
            stops: stops,
            price: Math.round(basePrice * priceMultiplier),
            currency: 'INR',
            seatsAvailable: this.randomInt(5, 45),
            cabinClass: 'Economy',
            baggage: '15 kg',
            refundable: this.randomInt(0, 1) === 1,
            source: this.sources[this.randomInt(0, this.sources.length - 1)]
        };
    }

    // Generate random time
    generateTime(startHour, endHour) {
        const hour = this.randomInt(startHour, endHour);
        const minute = this.randomInt(0, 59);
        return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    }

    // Calculate arrival time
    calculateArrivalTime(departureTime, durationMinutes) {
        const [depHour, depMin] = departureTime.split(':').map(Number);
        const totalMinutes = depHour * 60 + depMin + durationMinutes;
        const arrHour = Math.floor(totalMinutes / 60) % 24;
        const arrMin = totalMinutes % 60;
        return `${arrHour.toString().padStart(2, '0')}:${arrMin.toString().padStart(2, '0')}`;
    }

    // Format duration
    formatDuration(minutes) {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}m`;
    }

    // Get price comparison across sources
    async getPriceComparison(origin, destination, date) {
        const allFlights = await this.searchFlights(origin, destination, date);
        
        const bySource = {};
        this.sources.forEach(source => {
            bySource[source] = allFlights.filter(f => f.source === source);
        });
        
        const comparison = {};
        for (const [source, flights] of Object.entries(bySource)) {
            if (flights.length > 0) {
                const prices = flights.map(f => f.price);
                comparison[source] = {
                    minPrice: Math.min(...prices),
                    avgPrice: Math.round(prices.reduce((a, b) => a + b, 0) / prices.length),
                    flightCount: flights.length
                };
            }
        }
        
        return comparison;
    }

    // Get best deals
    async getBestDeals(origin, destination, date, limit = 5) {
        const flights = await this.searchFlights(origin, destination, date);
        return flights.slice(0, limit);
    }

    // Filter flights by criteria
    filterFlights(flights, criteria) {
        let filtered = [...flights];
        
        if (criteria.maxPrice) {
            filtered = filtered.filter(f => f.price <= criteria.maxPrice);
        }
        
        if (criteria.airline) {
            filtered = filtered.filter(f => f.airline === criteria.airline);
        }
        
        if (criteria.maxStops !== undefined) {
            filtered = filtered.filter(f => f.stops <= criteria.maxStops);
        }
        
        if (criteria.departureTimeRange) {
            const [start, end] = criteria.departureTimeRange;
            filtered = filtered.filter(f => {
                const time = f.departureTime;
                return time >= start && time <= end;
            });
        }
        
        if (criteria.refundableOnly) {
            filtered = filtered.filter(f => f.refundable);
        }
        
        return filtered;
    }

    // Utility: Random integer
    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Utility: Delay
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Clear cache
    clearCache() {
        this.cache.clear();
        console.log('Cache cleared');
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FlightScraper;
}
