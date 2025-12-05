// Validation Functions for TravelSaathi
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePassword(password) {
    return password && password.length >= 6;
}

function validateDate(date) {
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate >= today;
}

function validateSearchParams(params) {
    if (!params.from || !params.to) {
        return { valid: false, error: 'Please enter both origin and destination' };
    }
    if (!params.date || !validateDate(params.date)) {
        return { valid: false, error: 'Please select a valid future date' };
    }
    return { valid: true };
}
