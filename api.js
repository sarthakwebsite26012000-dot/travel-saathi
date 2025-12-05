// API Handler for TravelSaathi
const API_BASE_URL = 'https://api.example.com';

async function fetchTravelData(searchParams) {
    try {
        const response = await fetch(`${API_BASE_URL}/search`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(searchParams)
        });
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        return { error: 'Failed to fetch data' };
    }
}

async function getPriceAlerts(userId) {
    try {
        const response = await fetch(`${API_BASE_URL}/alerts/${userId}`);
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        return [];
    }
}

function mockAPICall(data) {
    return new Promise(resolve => {
        setTimeout(() => resolve(data), 1000);
    });
}
