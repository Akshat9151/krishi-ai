// Products Data
const productsData = {
    'featured': [
        {
            id: 1,
            name: 'हाइब्रिड टमाटर बीज',
            category: 'vegetable-seeds',
            image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
            price: 199,
            originalPrice: 249,
            rating: 4.5,
            reviews: 128,
            description: 'उच्च उत्पादन वाले हाइब्रिड टमाटर के बीज',
            badge: 'बेस्ट सेलर',
            inStock: true
        },
        {
            id: 2,
            name: 'जैविक वर्मीकम्पोस्ट',
            category: 'organic-fertilizers',
            image: 'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
            price: 399,
            originalPrice: 499,
            rating: 4.7,
            reviews: 89,
            description: 'शुद्ध जैविक खाद, 5kg पैक',
            badge: 'ऑर्गेनिक',
            inStock: true
        },
        {
            id: 3,
            name: 'स्टील खुरपी',
            category: 'farming-tools',
            image: 'https://images.unsplash.com/photo-1598257008754-b4d61c42d6d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
            price: 299,
            originalPrice: 349,
            rating: 4.3,
            reviews: 56,
            description: 'उच्च गुणवत्ता वाली स्टील खुरपी',
            badge: 'नया',
            inStock: true
        },
        {
            id: 4,
            name: 'ड्रिप इरिगेशन किट',
            category: 'irrigation',
            image: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
            price: 1299,
            originalPrice: 1599,
            rating: 4.8,
            reviews: 42,
            description: '100 वर्ग मीटर के लिए ड्रिप किट',
            badge: '20% ऑफ',
            inStock: true
        },
        {
            id: 5,
            name: 'आम के बीज (अल्फांसो)',
            category: 'fruit-seeds',
            image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
            price: 299,
            originalPrice: 399,
            rating: 4.6,
            reviews: 167,
            description: 'अल्फांसो आम के उच्च गुणवत्ता वाले बीज',
            badge: 'लोकप्रिय',
            inStock: true
        },
        {
            id: 6,
            name: 'नेचुरल कीटनाशक',
            category: 'crop-protection',
            image: 'https://images.unsplash.com/photo-1584990347441-8c0a8c802f2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
            price: 249,
            originalPrice: 299,
            rating: 4.4,
            reviews: 78,
            description: 'जैविक कीट नियंत्रण स्प्रे',
            badge: 'सेफ',
            inStock: true
        },
        {
            id: 7,
            name: 'हाइब्रिड मिर्च बीज',
            category: 'vegetable-seeds',
            image: 'https://images.unsplash.com/photo-1513530176992-0cf39c4cbed4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
            price: 149,
            originalPrice: 199,
            rating: 4.2,
            reviews: 93,
            description: 'तेज मिर्च के हाइब्रिड बीज',
            badge: 'हॉट',
            inStock: true
        },
        {
            id: 8,
            name: 'स्प्रे पंप (5 लीटर)',
            category: 'farming-tools',
            image: 'https://images.unsplash.com/photo-1589652043056-ba1a2c4830a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
            price: 599,
            originalPrice: 699,
            rating: 4.1,
            reviews: 34,
            description: 'पीठ पर ले जाने वाला स्प्रे पंप',
            badge: 'बजट',
            inStock: true
        }
    ]
};

// Cart System
let cart = JSON.parse(localStorage.getItem('krishiCart')) || [];
let wishlist = JSON.parse(localStorage.getItem('krishiWishlist')) || [];

// DOM Elements
const featuredProductsEl = document.getElementById('featured-products');
const cartCountEl = document.querySelector('.cart-count');

// Initialize Store
document.addEventListener('DOMContentLoaded', function() {
    loadFeaturedProducts();
    updateCartCount();
    initHeroSlider();
    initEventListeners();
});

// Load Featured Products
function loadFeaturedProducts() {
    if (!featuredProductsEl) return;
    
    featuredProductsEl.innerHTML = productsData.featured.map(product => `
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

// Star Rating Helper
function getStarRating(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= Math.floor(rating)) {
            stars += '<i class="fas fa-star"></i>';
        } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    return stars;
}

// Calculate Discount
function calculateDiscount(current, original) {
    return Math.round(((original - current) / original) * 100);
}

// Cart Functions
function addToCart(productId) {
    const product = productsData.featured.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartCount();
    showNotification(`${product.name} कार्ट में जोड़ा गया`);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartCount();
}

function updateCartCount() {
    if (cartCountEl) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountEl.textContent = totalItems;
    }
}

function saveCart() {
    localStorage.setItem('krishiCart', JSON.stringify(cart));
}

// Wishlist Functions
function toggleWishlist(productId) {
    const index = wishlist.indexOf(productId);
    
    if (index === -1) {
        wishlist.push(productId);
        showNotification('विश लिस्ट में जोड़ा गया');
    } else {
        wishlist.splice(index, 1);
        showNotification('विश लिस्ट से हटाया गया');
    }
    
    localStorage.setItem('krishiWishlist', JSON.stringify(wishlist));
}

// Hero Slider
function initHeroSlider() {
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    if (!slides.length) return;
    
    let currentSlide = 0;
    
    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        slides[index].classList.add('active');
        currentSlide = index;
    }
    
    function nextSlide() {
        let next = currentSlide + 1;
        if (next >= slides.length) next = 0;
        showSlide(next);
    }
    
    function prevSlide() {
        let prev = currentSlide - 1;
        if (prev < 0) prev = slides.length - 1;
        showSlide(prev);
    }
    
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    
    // Auto slide
    setInterval(nextSlide, 5000);
}

// Event Listeners
function initEventListeners() {
    // Search functionality
    const searchInput = document.querySelector('.search-bar input');
    const searchBtn = document.querySelector('.search-bar button');
    
    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }
    
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') performSearch();
        });
    }
}

function performSearch() {
    const searchInput = document.querySelector('.search-bar input');
    const query = searchInput.value.trim();
    
    if (query) {
        window.location.href = `category.html?search=${encodeURIComponent(query)}`;
    }
}

// Notification System
function showNotification(message) {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create new notification
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #2d5a27;
        color: white;
        padding: 15px 25px;
        border-radius: 5px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .notification-content i {
        font-size: 20px;
    }
`;
document.head.appendChild(style);

// Export functions for use in other pages
window.addToCart = addToCart;
window.toggleWishlist = toggleWishlist;
window.removeFromCart = removeFromCart;
// Add these to store.js after cart functions

// Payment Methods Data
const paymentMethods = [
    {
        id: 'cod',
        name: 'Cash on Delivery',
        icon: 'fas fa-money-bill-wave',
        description: 'Pay when you receive the order'
    },
    {
        id: 'upi',
        name: 'UPI',
        icon: 'fas fa-mobile-alt',
        description: 'Google Pay, PhonePe, Paytm'
    },
    {
        id: 'card',
        name: 'Credit/Debit Card',
        icon: 'fas fa-credit-card',
        description: 'Visa, Mastercard, RuPay'
    },
    {
        id: 'netbanking',
        name: 'Net Banking',
        icon: 'fas fa-university',
        description: 'All major banks'
    },
    {
        id: 'wallet',
        name: 'Digital Wallet',
        icon: 'fas fa-wallet',
        description: 'Paytm Wallet, Amazon Pay'
    }
];

// Add Razorpay Integration
function initRazorpay() {
    const script = document.createElement('script');
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    document.head.appendChild(script);
}

// Initialize Razorpay when page loads
document.addEventListener('DOMContentLoaded', function() {
    initRazorpay();
    // ... existing code
});
// Add these functions to store.js for cart management

function showCartPage() {
    // This function would be called from a cart page
    updateCartDisplay();
}

function updateCartDisplay() {
    const cart = JSON.parse(localStorage.getItem('krishiCart')) || [];
    const cartItemsEl = document.getElementById('cart-items');
    const cartTotalEl = document.getElementById('cart-total');
    const cartCountEl = document.querySelector('.cart-count');
    
    if (!cartItemsEl) return;
    
    if (cart.length === 0) {
        cartItemsEl.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <h3>आपकी कार्ट खाली है</h3>
                <p>कुछ उत्पाद खरीदने के लिए ब्राउज़ करें</p>
                <a href="index.html" class="btn-primary">शॉपिंग जारी रखें</a>
            </div>
        `;
        if (cartTotalEl) cartTotalEl.textContent = '₹0';
        if (cartCountEl) cartCountEl.textContent = '0';
        return;
    }
    
    let total = 0;
    
    cartItemsEl.innerHTML = cart.map(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        return `
            <div class="cart-item" data-id="${item.id}">
                <div class="item-info">
                    <img src="${item.image}" alt="${item.name}">
                    <div>
                        <div class="item-name">${item.name}</div>
                        <div class="item-category">${item.category}</div>
                    </div>
                </div>
                <div class="item-price">₹${item.price}</div>
                <div class="quantity-control">
                    <button class="qty-btn" onclick="updateItemQuantity(${item.id}, ${item.quantity - 1})">-</button>
                    <span>${item.quantity}</span>
                    <button class="qty-btn" onclick="updateItemQuantity(${item.id}, ${item.quantity + 1})">+</button>
                </div>
                <div class="item-total">₹${itemTotal}</div>
                <button class="remove-item" onclick="removeFromCart(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    }).join('');
    
    if (cartTotalEl) cartTotalEl.textContent = `₹${total.toFixed(2)}`;
    if (cartCountEl) cartCountEl.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
}

function updateItemQuantity(productId, newQuantity) {
    if (newQuantity < 1) {
        removeFromCart(productId);
        return;
    }
    
    const cart = JSON.parse(localStorage.getItem('krishiCart')) || [];
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        item.quantity = newQuantity;
        localStorage.setItem('krishiCart', JSON.stringify(cart));
        updateCartDisplay();
        showNotification('मात्रा अपडेट की गई');
    }
}

// Add empty cart CSS
const emptyCartCSS = `
    .empty-cart {
        text-align: center;
        padding: 60px 20px;
    }
    
    .empty-cart i {
        font-size: 80px;
        color: #ddd;
        margin-bottom: 20px;
    }
    
    .empty-cart h3 {
        color: #666;
        margin-bottom: 10px;
    }
    
    .empty-cart p {
        color: #999;
        margin-bottom: 30px;
    }
`;

// Inject empty cart CSS
const style = document.createElement('style');
style.textContent = emptyCartCSS;
document.head.appendChild(style);
function buyNow(productId) {
    const product = productsData.featured.find(p => p.id === productId);
    if (!product) return;
    
    // Add to cart and redirect to checkout
    addToCart(productId);
    setTimeout(() => {
        window.location.href = 'checkout.html';
    }, 500);
}
// इस function को complete करें:
function processOnlinePayment(paymentMethod) {
    const totalAmount = calculateTotal();
    
    if (window.Razorpay) {
        const options = {
            "key": "rzp_test_YOUR_ACTUAL_KEY_HERE", // 🔴 यहाँ अपना key डालें
            "amount": totalAmount * 100,
            "currency": "INR",
            "name": "Krishi AI Store",
            // ... rest of options
        };
        
        const rzp = new Razorpay(options);
        rzp.open();
    }
}