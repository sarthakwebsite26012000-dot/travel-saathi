// Authentication JavaScript
function checkAuth() {
    const token = localStorage.getItem('userToken');
    if (!token && !window.location.href.includes('signin.html') && !window.location.href.includes('index.html')) {
        window.location.href = 'signin.html';
    }
    return !!token;
}

function signup(email, password, name) {
    // Simulate signup
    const userData = {
        email: email,
        name: name,
        token: generateToken()
    };
    localStorage.setItem('userToken', userData.token);
    localStorage.setItem('userData', JSON.stringify(userData));
    return Promise.resolve(userData);
}

function login(email, password) {
    // Simulate login
    const userData = {
        email: email,
        name: email.split('@')[0],
        token: generateToken()
    };
    localStorage.setItem('userToken', userData.token);
    localStorage.setItem('userData', JSON.stringify(userData));
    return Promise.resolve(userData);
}

function logout() {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    window.location.href = 'signin.html';
}

function generateToken() {
    return 'token_' + Math.random().toString(36).substr(2, 9);
}

function getUserData() {
    return JSON.parse(localStorage.getItem('userData') || '{}');
}
