/**
 * KRISHI AI – AGRISTORE CORE SCRIPT (store.js)
 * Clean, modular, lightweight client-side state & API communication.
 */

// Fallback real products (synchronized with SQLite store_products database)
const FALLBACK_PRODUCTS = [
    {
        id: 1,
        name: "हाइब्रिड टमाटर बीज (Hybrid Tomato Seeds)",
        category: "vegetable-seeds",
        subcategory: "seeds",
        description: "उच्च उत्पादन और रोग प्रतिरोधी हाइब्रिड टमाटर के बीज। 10 ग्राम पैक। 90%+ अंकुरण दर।",
        image_url: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        price: 199.0,
        original_price: 249.0,
        rating: 4.8,
        reviews_count: 128,
        badge: "बेस्ट सेलर",
        brand: "Krishi Gold",
        weight: "10g",
        in_stock: true
    },
    {
        id: 2,
        name: "जैविक वर्मीकम्पोस्ट (Organic Vermicompost 5kg)",
        category: "organic-fertilizers",
        subcategory: "fertilizers",
        description: "100% शुद्ध केंचुआ खाद। मिट्टी की जलधारण क्षमता और पोषक तत्वों को बढ़ाता है।",
        image_url: "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        price: 399.0,
        original_price: 499.0,
        rating: 4.7,
        reviews_count: 89,
        badge: "ऑर्गेनिक",
        brand: "Krishi Bio",
        weight: "5kg",
        in_stock: true
    },
    {
        id: 3,
        name: "स्टील खुरपी (Heavy Duty Hand Weeder)",
        category: "farming-tools",
        subcategory: "tools",
        description: "मजबूत फोर्ज्ड स्टील ब्लेड और लकड़ी की ग्रिप वाली प्रीमियम खुरपी।",
        image_url: "https://images.unsplash.com/photo-1598257008754-b4d61c42d6d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        price: 299.0,
        original_price: 349.0,
        rating: 4.5,
        reviews_count: 56,
        badge: "नया",
        brand: "AgriCraft",
        weight: "450g",
        in_stock: true
    },
    {
        id: 4,
        name: "ड्रिप इरिगेशन किट 100 वर्ग मीटर (Drip Irrigation Kit)",
        category: "irrigation",
        subcategory: "irrigation",
        description: "100 वर्ग मीटर खेत या बगीचे के लिए पूर्ण ड्रिप किट। 70% पानी की बचत।",
        image_url: "https://images.unsplash.com/photo-1560493676-04071c5f467b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        price: 1299.0,
        original_price: 1599.0,
        rating: 4.9,
        reviews_count: 42,
        badge: "20% ऑफ",
        brand: "DropWise",
        weight: "2.5kg",
        in_stock: true
    },
    {
        id: 5,
        name: "संतुलित NPK 20-20-20 बायो फर्टिलाइजर (Balanced NPK 1L)",
        category: "organic-fertilizers",
        subcategory: "fertilizers",
        description: "सभी फसलों के लिए संतुलित नाइट्रोजन, फास्फोरस व पोटाश युक्त तरल उर्वरक।",
        image_url: "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        price: 349.0,
        original_price: 420.0,
        rating: 4.6,
        reviews_count: 74,
        badge: "प्रीमियम",
        brand: "Krishi Bio",
        weight: "1L",
        in_stock: true
    },
    {
        id: 6,
        name: "नेचुरल नीम तेल स्प्रे (Pure Neem Oil Bio-Pesticide 500ml)",
        category: "crop-protection",
        subcategory: "protection",
        description: "प्राकृतिक नीम सत्त से निर्मित सुरक्षित जैविक कीटनाशक। इल्ली, माहू व फफूंद से सुरक्षा।",
        image_url: "https://images.unsplash.com/photo-1584990347441-8c0a8c802f2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        price: 249.0,
        original_price: 299.0,
        rating: 4.6,
        reviews_count: 98,
        badge: "सुरक्षित",
        brand: "BioShield",
        weight: "500ml",
        in_stock: true
    },
    {
        id: 7,
        name: "डीएपी एवं यूरिया बूस्टर कॉम्बो (DAP & Urea Growth Booster 5kg)",
        category: "organic-fertilizers",
        subcategory: "fertilizers",
        description: "शुरुआती वानस्पतिक वृद्धि और मजबूत जड़ों के लिए विशेष बूस्टर फॉर्मूलेशन।",
        image_url: "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        price: 499.0,
        original_price: 599.0,
        rating: 4.7,
        reviews_count: 112,
        badge: "बेस्ट सेलर",
        brand: "IFFCO Partner",
        weight: "5kg",
        in_stock: true
    },
    {
        id: 8,
        name: "मैनुअल स्प्रे पंप (5L Garden & Field Sprayer)",
        category: "farming-tools",
        subcategory: "tools",
        description: "हल्का, टिकाऊ और ब्रास नोजल युक्त 5 लीटर प्रेशर स्प्रेयर पंप।",
        image_url: "https://images.unsplash.com/photo-1589652043056-ba1a2c4830a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        price: 599.0,
        original_price: 749.0,
        rating: 4.4,
        reviews_count: 65,
        badge: "पॉपुलर",
        brand: "AgriTech",
        weight: "1.2kg",
        in_stock: true
    },
    {
        id: 9,
        name: "गेहूं रस्ट केयर फंगीसाइड (Wheat Rust Care Spray 250g)",
        category: "crop-protection",
        subcategory: "protection",
        description: "गेहूं में पीला, भूरा व काला रतुआ (Rust) रोग से त्वरित रोकथाम।",
        image_url: "https://images.unsplash.com/photo-1584990347441-8c0a8c802f2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        price: 320.0,
        original_price: 380.0,
        rating: 4.8,
        reviews_count: 49,
        badge: "रोग रक्षक",
        brand: "Krishi Care",
        weight: "250g",
        in_stock: true
    },
    {
        id: 10,
        name: "धान ब्लास्ट नियंत्रण किट (Rice Blast Protection Kit 500g)",
        category: "crop-protection",
        subcategory: "protection",
        description: "धान की फसल में झुलसा और गर्दन तोड़ रोग के खिलाफ संपूर्ण सुरक्षा।",
        image_url: "https://images.unsplash.com/photo-1584990347441-8c0a8c802f2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        price: 380.0,
        original_price: 450.0,
        rating: 4.7,
        reviews_count: 36,
        badge: "प्रमाणित",
        brand: "Krishi Care",
        weight: "500g",
        in_stock: true
    },
    {
        id: 11,
        name: "कपास लीफ कर्ल डिफेंस (Cotton Leaf Curl Care 250ml)",
        category: "crop-protection",
        subcategory: "protection",
        description: "कपास में पत्ती मरोड़ और सफेद मक्खी के प्रभाव को कम करने वाला विशेष टॉनिक।",
        image_url: "https://images.unsplash.com/photo-1584990347441-8c0a8c802f2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        price: 350.0,
        original_price: 420.0,
        rating: 4.5,
        reviews_count: 28,
        badge: "बायो शील्ड",
        brand: "Krishi Care",
        weight: "250ml",
        in_stock: true
    },
    {
        id: 12,
        name: "राइजोबियम कल्चर एवं पोटाश बूस्टर (Rhizobium & Potash Blend 1kg)",
        category: "organic-fertilizers",
        subcategory: "fertilizers",
        description: "दलहनी फसलों में नाइट्रोजन स्थिरीकरण और दाने की चमक बढ़ाने वाला बायो-फर्टिलाइजर।",
        image_url: "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        price: 279.0,
        original_price: 330.0,
        rating: 4.6,
        reviews_count: 41,
        badge: "विशेषज्ञ चयन",
        brand: "Krishi Bio",
        weight: "1kg",
        in_stock: true
    }
];

// Fallback image in case external images fail to load
const SAFE_FALLBACK_IMG = "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&q=80";

function handleImageError(img) {
    if (img.src !== SAFE_FALLBACK_IMG) {
        img.src = SAFE_FALLBACK_IMG;
    }
}

/* ===================================================
   CART MANAGEMENT
=================================================== */

function getCart() {
    try {
        return JSON.parse(localStorage.getItem('krishiCart')) || [];
    } catch (e) {
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem('krishiCart', JSON.stringify(cart));
    updateCartBadges();
    renderCartDrawer();
}

function addToCart(product, quantity = 1) {
    if (!product) return;
    const cart = getCart();
    const existing = cart.find(item => item.id === product.id);

    if (existing) {
        existing.quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: Number(product.price) || 0,
            original_price: Number(product.original_price) || 0,
            image: product.image_url || product.image || SAFE_FALLBACK_IMG,
            brand: product.brand || "Krishi AI",
            weight: product.weight || "",
            category: product.category || "",
            quantity: quantity
        });
    }

    saveCart(cart);
    showToast(`✅ ${product.name.split('(')[0].trim()} जोड़ा गया (${quantity})`);
}

function updateQuantity(productId, newQty) {
    let cart = getCart();
    const item = cart.find(i => i.id === productId);

    if (item) {
        if (newQty > 0) {
            item.quantity = newQty;
        } else {
            cart = cart.filter(i => i.id !== productId);
        }
        saveCart(cart);
    }
}

function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(i => i.id !== productId);
    saveCart(cart);
    showToast("आइटम कार्ट से हटाया गया");
}

function clearCart() {
    localStorage.removeItem('krishiCart');
    updateCartBadges();
    renderCartDrawer();
}

function getCartTotal() {
    const cart = getCart();
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

function getCartCount() {
    const cart = getCart();
    return cart.reduce((count, item) => count + item.quantity, 0);
}

function updateCartBadges() {
    const count = getCartCount();
    document.querySelectorAll('.store-cart-badge').forEach(badge => {
        badge.textContent = count;
        badge.style.display = count > 0 ? 'inline-block' : 'none';
    });

    const total = getCartTotal();
    document.querySelectorAll('.store-cart-total-text').forEach(el => {
        el.textContent = `₹${total.toFixed(0)}`;
    });
}

/* ===================================================
   DRAWER UI & TOAST
=================================================== */

function openCartDrawer() {
    renderCartDrawer();
    const overlay = document.getElementById('cartDrawerOverlay');
    const drawer = document.getElementById('cartDrawer');
    if (overlay) overlay.classList.add('active');
    if (drawer) drawer.classList.add('active');
}

function closeCartDrawer() {
    const overlay = document.getElementById('cartDrawerOverlay');
    const drawer = document.getElementById('cartDrawer');
    if (overlay) overlay.classList.remove('active');
    if (drawer) drawer.classList.remove('active');
}

function renderCartDrawer() {
    const body = document.getElementById('cartDrawerBody');
    const footer = document.getElementById('cartDrawerFooter');
    if (!body) return;

    const cart = getCart();

    if (cart.length === 0) {
        body.innerHTML = `
            <div style="text-align: center; padding: 40px 10px; color: var(--text-secondary);">
                <div style="font-size: 40px; margin-bottom: 8px;">🛒</div>
                <h4 style="font-size: 15px; color: var(--text-primary); margin-bottom: 4px;">आपकी कार्ट खाली है</h4>
                <p style="font-size: 13px;">अपनी खेती के लिए आवश्यक बीज, खाद व दवाइयां जोड़ें।</p>
            </div>
        `;
        if (footer) footer.style.display = 'none';
        return;
    }

    if (footer) footer.style.display = 'block';

    body.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" class="cart-item-img" onerror="handleImageError(this)" alt="${item.name}" />
            <div class="cart-item-info">
                <div class="cart-item-title" title="${item.name}">${item.name}</div>
                <div class="cart-item-price">₹${item.price} × ${item.quantity} = ₹${item.price * item.quantity}</div>
            </div>
            <div class="cart-item-actions">
                <div class="store-qty-control">
                    <button class="store-qty-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                    <span class="store-qty-num">${item.quantity}</span>
                    <button class="store-qty-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                </div>
                <button onclick="removeFromCart(${item.id})" style="color: #dc2626; font-size: 14px; padding: 4px 6px;" title="हटाएं">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </div>
        </div>
    `).join('');

    const total = getCartTotal();
    const subtotalEl = document.getElementById('drawerSubtotal');
    const totalEl = document.getElementById('drawerTotal');
    if (subtotalEl) subtotalEl.textContent = `₹${total.toFixed(0)}`;
    if (totalEl) totalEl.textContent = `₹${total.toFixed(0)}`;
}

function showToast(msg) {
    let toast = document.getElementById('storeToast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'storeToast';
        toast.className = 'store-toast';
        document.body.appendChild(toast);
    }
    toast.innerHTML = `<i class="fa-solid fa-circle-check" style="color: #4ade80;"></i> <span>${msg}</span>`;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2400);
}

// Global initialization
document.addEventListener('DOMContentLoaded', () => {
    updateCartBadges();

    // Mount language selector if container exists
    if (window.krishiI18n) {
        if (document.getElementById('storeLangSelector')) {
            window.krishiI18n.renderSelector('storeLangSelector', { compact: true });
        }
        window.krishiI18n.translatePage();
    }
});