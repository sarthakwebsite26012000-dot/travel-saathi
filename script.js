// Search functionality for homepage
function searchDeals() {
    const from = document.getElementById('from').value;
    const to = document.getElementById('to').value;
    const date = document.getElementById('date').value;

    if (!from || !to || !date) {
        alert('Please fill in all fields');
        return;
    }

    // Store search data in localStorage
    const searchData = {
        from: from,
        to: to,
        date: date
    };
    localStorage.setItem('searchData', JSON.stringify(searchData));

    // Redirect to results page
    window.location.href = 'dashboard.html';
}

// Set minimum date to today
if (document.getElementById('date')) {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date').setAttribute('min', today);
}
