// Initialize Dashboard
document.addEventListener('DOMContentLoaded', function() {
    loadSearchData();
    loadResults();
    initializeTabs();
    initializeFilters();
});

// Load Search Data
function loadSearchData() {
    const searchData = JSON.parse(localStorage.getItem('searchData') || '{}');
    
    if (searchData.from && searchData.to) {
        document.getElementById('routeInfo').innerHTML = `
            <h2>${searchData.from} → ${searchData.to}</h2>
            <p>${formatDate(searchData.date)}</p>
        `;
    } else {
        document.getElementById('routeInfo').innerHTML = `
            <h2>Delhi → Mumbai</h2>
            <p>${formatDate(new Date().toISOString())}</p>
        `;
    }
}

// Load Mock Results
function loadResults() {
    setTimeout(() => {
        const results = generateMockResults();
        displayResults(results);
    }, 1500);
}

function generateMockResults() {
    return [
        {
            mode: 'flight',
            icon: '✈️',
            provider: 'MakeMyTrip',
            name: 'IndiGo 6E-123',
            departure: '08:30',
            arrival: '10:45',
            duration: '2h 15m',
            price: 4599
        },
        {
            mode: 'flight',
            icon: '✈️',
            provider: 'Goibibo',
            name: 'SpiceJet SG-456',
            departure: '10:15',
            arrival: '12:40',
            duration: '2h 25m',
            price: 4299
        },
        {
            mode: 'train',
            icon: '🚂',
            provider: 'IRCTC',
            name: 'Rajdhani Express',
            departure: '16:00',
            arrival: '08:30',
            duration: '16h 30m',
            price: 2190
        },
        {
            mode: 'train',
            icon: '🚂',
            provider: 'IRCTC',
            name: 'Shatabdi Express',
            departure: '06:15',
            arrival: '14:40',
            duration: '8h 25m',
            price: 1850
        },
        {
            mode: 'bus',
            icon: '🚌',
            provider: 'RedBus',
            name: 'Volvo A/C Sleeper',
            departure: '20:00',
            arrival: '08:30',
            duration: '12h 30m',
            price: 1200
        },
        {
            mode: 'bus',
            icon: '🚌',
            provider: 'AbhiBus',
            name: 'Mercedes Multi-Axle',
            departure: '21:30',
            arrival: '10:00',
            duration: '12h 30m',
            price: 1450
        }
    ];
}

function displayResults(results) {
    const container = document.getElementById('resultsContainer');
    container.innerHTML = results.map(result => `
        <div class="result-card" data-mode="${result.mode}">
            <div class="result-header">
                <span class="mode-icon">${result.icon}</span>
                <span class="provider">${result.provider}</span>
            </div>
            <h3>${result.name}</h3>
            <div class="time-info">
                <span>${result.departure}</span>
                <span>${result.duration}</span>
                <span>${result.arrival}</span>
            </div>
            <div class="result-footer">
                <span class="price">₹${result.price.toLocaleString('en-IN')}</span>
                <button onclick="bookTrip('${result.provider}', ${result.price})" class="btn-book">Book Now</button>
            </div>
        </div>
    `).join('');
}

// Tabs Functionality
function initializeTabs() {
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', function() {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            const mode = this.dataset.tab;
            filterByMode(mode);
        });
    });
}

function filterByMode(mode) {
    const cards = document.querySelectorAll('.result-card');
    cards.forEach(card => {
        if (mode === 'all' || card.dataset.mode === mode) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

// Filters
function initializeFilters() {
    const priceRange = document.getElementById('priceRange');
    const priceValue = document.getElementById('priceValue');
    
    priceRange.addEventListener('input', function() {
        priceValue.textContent = '₹' + this.value.toLocaleString('en-IN');
    });
}

// Booking
function bookTrip(provider, price) {
    alert(`Redirecting to ${provider} to complete booking for ₹${price}...`);
    // In real implementation, redirect to provider website
}

// Modify Search
document.querySelector('.btn-modify')?.addEventListener('click', function() {
    window.location.href = 'index.html';
});

// Utility Functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
}
