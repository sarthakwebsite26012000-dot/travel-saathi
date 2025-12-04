dashboard.js// Dashboard JavaScript functionality

// Price range slider
const priceRange = document.getElementById('priceRange');
const priceValue = document.getElementById('priceValue');

if (priceRange && priceValue) {
    priceRange.addEventListener('input', function() {
        const value = parseInt(this.value);
        priceValue.textContent = '₹' + value.toLocaleString('en-IN');
    });
}

// Apply filters
const applyFiltersBtn = document.querySelector('.btn-apply-filters');
if (applyFiltersBtn) {
    applyFiltersBtn.addEventListener('click', function() {
        console.log('Filters applied');
        // Filter logic here
    });
}

// Modify search
const modifyBtn = document.querySelector('.btn-modify');
if (modifyBtn) {
    modifyBtn.addEventListener('click', function() {
        window.location.href = 'index.html';
    });
}
