// Category page specific functionality
document.addEventListener('DOMContentLoaded', function() {
    loadCategoryProducts();
    setupFilters();
    setupSorting();
    
    // Get category from URL
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('type') || 'all';
    const searchQuery = urlParams.get('search');
    
    if (searchQuery) {
        document.getElementById('category-title').textContent = `खोज: "${searchQuery}"`;
        document.getElementById('current-category').textContent = `खोज: "${searchQuery}"`;
    } else if (category !== 'all') {
        document.getElementById('category-title').textContent = getCategoryName(category);
        document.getElementById('current-category').textContent = getCategoryName(category);
        
        // Set active category in filter
        document.querySelector(`[data-category="${category}"]`).classList.add('active');
    }
});

function getCategoryName(category) {
    const categories = {
        'vegetable-seeds': 'सब्जी बीज',
        'fruit-seeds': 'फल बीज',
        'organic-fertilizers': 'जैविक खाद',
        'farming-tools': 'कृषि उपकरण',
        'irrigation': 'सिंचाई',
        'crop-protection': 'फसल संरक्षण'
    };
    return categories[category] || 'सभी उत्पाद';
}

function loadCategoryProducts() {
    // This would typically load from an API
    // For now, we'll use the featured products
    const productsGrid = document.getElementById('category-products');
    if (!productsGrid) return;
    
    // Display all products
    productsGrid.innerHTML = productsData.featured.map(product => `
        <div class="product-card" data-id="${product.id}">
            ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
            <img src="${product.image}" alt="${product.name}" class="product-img">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <div class="product-rating">
                    ${getStarRating(product.rating)}
                    <span>(${product.reviews})</span>
                </div>
                <div class="product-price">
                    <span class="current-price">₹${product.price}</span>
                    <span class="original-price">₹${product.originalPrice}</span>
                    <span class="discount">${calculateDiscount(product.price, product.originalPrice)}% OFF</span>
                </div>
                <div class="product-actions">
                    <button class="action-btn btn-cart" onclick="addToCart(${product.id})">
                        <i class="fas fa-shopping-cart"></i> कार्ट में
                    </button>
                    <button class="action-btn btn-wishlist" onclick="toggleWishlist(${product.id})">
                        <i class="fas fa-heart"></i> विश लिस्ट
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function setupFilters() {
    // Price range display
    const priceRange = document.getElementById('price-range');
    const maxPriceEl = document.getElementById('max-price');
    
    if (priceRange && maxPriceEl) {
        priceRange.addEventListener('input', function() {
            maxPriceEl.textContent = `₹${this.value}`;
        });
    }
    
    // Category filter click
    document.querySelectorAll('.category-list a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.getAttribute('data-category');
            window.location.href = `category.html?type=${category}`;
        });
    });
}

function setupSorting() {
    const sortSelect = document.getElementById('sort-by');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            sortProducts(this.value);
        });
    }
}

function sortProducts(sortBy) {
    // Implement sorting logic
    console.log(`Sorting by: ${sortBy}`);
}

function applyFilters() {
    // Get filter values and apply
    const priceRange = document.getElementById('price-range').value;
    const discountChecks = document.querySelectorAll('.discount-filter input:checked');
    const discounts = Array.from(discountChecks).map(cb => parseInt(cb.value));
    
    console.log(`Filters: Max Price ₹${priceRange}, Discounts: ${discounts.join(', ')}%`);
    showNotification('फिल्टर लागू किए गए');
}

function clearFilters() {
    // Reset all filters
    document.getElementById('price-range').value = 5000;
    document.getElementById('max-price').textContent = '₹5000';
    document.querySelectorAll('.discount-filter input').forEach(cb => cb.checked = false);
    
    showNotification('फिल्टर रीसेट किए गए');
}