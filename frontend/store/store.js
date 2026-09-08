/**
 * KRISHI AI – AGRISTORE CORE SCRIPT (store.js)
 * Clean, modular, lightweight client-side state & API communication.
 */

// Fallback real products (synchronized with SQLite store_products database)
const FALLBACK_PRODUCTS = [
    // === VEGETABLE SEEDS ===
    { id: 1, name: "हाइब्रिड टमाटर बीज (Hybrid Tomato Seeds)", category: "vegetable-seeds", description: "उच्च उत्पादन और रोग प्रतिरोधी हाइब्रिड टमाटर के बीज। 10 ग्राम पैक। 90%+ अंकुरण गारंटी।", image_url: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&q=80", price: 199.0, original_price: 249.0, rating: 4.8, reviews_count: 128, badge: "बेस्ट सेलर", brand: "Mahyco", weight: "10g", in_stock: true },
    { id: 2, name: "हाइब्रिड मिर्च बीज (Hybrid Chilli Seeds)", category: "vegetable-seeds", description: "तीखी और उच्च उपज वाली संकर मिर्च किस्म। 5 ग्राम पैक।", image_url: "https://images.unsplash.com/photo-1583119022894-919a68a3d0e3?w=500&q=80", price: 149.0, original_price: 199.0, rating: 4.7, reviews_count: 95, badge: "प्रमाणित", brand: "Syngenta", weight: "5g", in_stock: true },
    { id: 3, name: "देशी बैगन बीज (Desi Brinjal Seeds)", category: "vegetable-seeds", description: "गांव में प्रचलित देशी गोल बैगन की उन्नत किस्म। 5 ग्राम पैक।", image_url: "https://images.unsplash.com/photo-1615484477778-ca3b77940c25?w=500&q=80", price: 89.0, original_price: 120.0, rating: 4.6, reviews_count: 72, badge: "देशी", brand: "IARI", weight: "5g", in_stock: true },
    { id: 4, name: "पालक बीज (Palak/Spinach Seeds)", category: "vegetable-seeds", description: "तेज विकास वाली पालक की किस्म। 50 ग्राम पैक।", image_url: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500&q=80", price: 49.0, original_price: 70.0, rating: 4.5, reviews_count: 60, badge: "नया", brand: "IARI", weight: "50g", in_stock: true },
    { id: 5, name: "हाइब्रिड लौकी बीज (Bottle Gourd Seeds)", category: "vegetable-seeds", description: "ग्रीष्मकालीन फसल के लिए उत्तम लौकी किस्म।", image_url: "https://images.unsplash.com/photo-1618337073827-5c11de516b78?w=500&q=80", price: 120.0, original_price: 150.0, rating: 4.4, reviews_count: 48, badge: "गर्मी", brand: "East-West Seeds", weight: "10g", in_stock: true },

    // === ORGANIC FERTILIZERS ===
    { id: 6, name: "जैविक वर्मीकम्पोस्ट (Organic Vermicompost 5kg)", category: "organic-fertilizers", description: "100% शुद्ध केंचुआ खाद। मिट्टी की जलधारण क्षमता बढ़ाता है।", image_url: "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=500&q=80", price: 399.0, original_price: 499.0, rating: 4.7, reviews_count: 89, badge: "ऑर्गेनिक", brand: "IFFCO", weight: "5kg", in_stock: true },
    { id: 7, name: "NPK 19-19-19 घुलनशील खाद (NPK Soluble Fertilizer 1kg)", category: "organic-fertilizers", description: "सभी फसलों के लिए जल में घुलनशील संतुलित NPK खाद।", image_url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500&q=80", price: 380.0, original_price: 450.0, rating: 4.8, reviews_count: 112, badge: "बेस्ट सेलर", brand: "IFFCO", weight: "1kg", in_stock: true },
    { id: 8, name: "डीएपी (DAP Fertilizer 50kg)", category: "organic-fertilizers", description: "फॉस्फोरस और नाइट्रोजन का मुख्य स्रोत। बुवाई के समय उपयोग।", image_url: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=500&q=80", price: 1350.0, original_price: 1500.0, rating: 4.9, reviews_count: 200, badge: "किसान पसंद", brand: "IFFCO", weight: "50kg", in_stock: true },
    { id: 9, name: "राइजोबियम बायो-फर्टिलाइजर (Rhizobium Bio Fertilizer 1kg)", category: "organic-fertilizers", description: "दलहनी फसलों में नाइट्रोजन स्थिरीकरण के लिए जैविक खाद।", image_url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500&q=80", price: 279.0, original_price: 330.0, rating: 4.6, reviews_count: 41, badge: "जैविक", brand: "National Fertilizers", weight: "1kg", in_stock: true },
    { id: 10, name: "नीमकेक खाद (Neem Cake Fertilizer 5kg)", category: "organic-fertilizers", description: "भूमि सुधारक और कीट नियंत्रक — दोनों काम एक साथ।", image_url: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=500&q=80", price: 299.0, original_price: 380.0, rating: 4.5, reviews_count: 67, badge: "ऑर्गेनिक", brand: "Krishi Bio", weight: "5kg", in_stock: true },

    // === CROP PROTECTION ===
    { id: 11, name: "नेचुरल नीम तेल स्प्रे (Pure Neem Oil 500ml)", category: "crop-protection", description: "प्राकृतिक नीम सत्त से निर्मित सुरक्षित जैविक कीटनाशक।", image_url: "https://images.unsplash.com/photo-1584990347441-8c0a8c802f2c?w=500&q=80", price: 249.0, original_price: 299.0, rating: 4.6, reviews_count: 98, badge: "सुरक्षित", brand: "BioShield", weight: "500ml", in_stock: true },
    { id: 12, name: "गेहूं रस्ट केयर फंगीसाइड (Wheat Rust Care 250g)", category: "crop-protection", description: "गेहूं में पीला, भूरा व काला रतुआ रोग से त्वरित रोकथाम।", image_url: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=500&q=80", price: 320.0, original_price: 380.0, rating: 4.8, reviews_count: 49, badge: "रोग रक्षक", brand: "Bayer", weight: "250g", in_stock: true },
    { id: 13, name: "एफिड किलर इमिडाक्लोप्रिड (Imidacloprid 30ml)", category: "crop-protection", description: "चूसने वाले कीटों जैसे माहू, थ्रिप्स आदि का नियंत्रण।", image_url: "https://images.unsplash.com/photo-1508979842907-5a30c02b7890?w=500&q=80", price: 185.0, original_price: 220.0, rating: 4.7, reviews_count: 78, badge: "प्रमाणित", brand: "Bayer", weight: "30ml", in_stock: true },
    { id: 14, name: "धान ब्लास्ट नियंत्रण (Rice Blast Kit 500g)", category: "crop-protection", description: "धान की फसल में झुलसा रोग के खिलाफ संपूर्ण सुरक्षा।", image_url: "https://images.unsplash.com/photo-1564568754-2d6cf587e710?w=500&q=80", price: 380.0, original_price: 450.0, rating: 4.7, reviews_count: 36, badge: "प्रमाणित", brand: "FMC", weight: "500g", in_stock: true },
    { id: 15, name: "क्लोरपाइरीफॉस (Chlorpyrifos 2.5L Termite Control)", category: "crop-protection", description: "दीमक, कटवर्म और मिट्टी में पाए जाने वाले कीटों से सुरक्षा।", image_url: "https://images.unsplash.com/photo-1584990347441-8c0a8c802f2c?w=500&q=80", price: 650.0, original_price: 780.0, rating: 4.5, reviews_count: 55, badge: "दीमक रक्षक", brand: "Syngenta", weight: "2.5L", in_stock: true },

    // === FARMING TOOLS ===
    { id: 16, name: "स्टील खुरपी (Heavy Duty Hand Weeder)", category: "farming-tools", description: "मजबूत फोर्ज्ड स्टील ब्लेड और लकड़ी की ग्रिप वाली प्रीमियम खुरपी।", image_url: "https://images.unsplash.com/photo-1566843972142-a7fcb70de55a?w=500&q=80", price: 299.0, original_price: 349.0, rating: 4.5, reviews_count: 56, badge: "मजबूत", brand: "AgriCraft", weight: "450g", in_stock: true },
    { id: 17, name: "नैपसैक स्प्रेयर पंप (16L Knapsack Sprayer)", category: "farming-tools", description: "16 लीटर क्षमता का पीठ पर चढ़ाने वाला स्प्रेयर। 8 घंटे तक कार्य।", image_url: "https://images.unsplash.com/photo-1589652043056-ba1a2c4830a7?w=500&q=80", price: 1299.0, original_price: 1599.0, rating: 4.6, reviews_count: 88, badge: "पॉपुलर", brand: "Aspee", weight: "3.2kg", in_stock: true },
    { id: 18, name: "बैटरी चालित स्प्रेयर (Battery Sprayer 16L)", category: "farming-tools", description: "रिचार्जेबल बैटरी से चलने वाला ऑटोमैटिक स्प्रेयर। हाथ थकान नहीं।", image_url: "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?w=500&q=80", price: 2499.0, original_price: 3200.0, rating: 4.8, reviews_count: 120, badge: "बेस्ट सेलर", brand: "Aspee", weight: "4kg", in_stock: true },
    { id: 19, name: "हंसिया (Serrated Sickle Harvesting Knife)", category: "farming-tools", description: "धान, गेहूं और घास काटने के लिए कार्बन स्टील हंसिया।", image_url: "https://images.unsplash.com/photo-1598257008754-b4d61c42d6d4?w=500&q=80", price: 149.0, original_price: 199.0, rating: 4.4, reviews_count: 38, badge: "देशी", brand: "AgriCraft", weight: "350g", in_stock: true },
    { id: 20, name: "मल्टी-ब्लेड कल्टिवेटर (5-Tine Cultivator Tool)", category: "farming-tools", description: "खेत की मिट्टी ढीली करने और खरपतवार हटाने के लिए।", image_url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500&q=80", price: 349.0, original_price: 420.0, rating: 4.5, reviews_count: 44, badge: "मजबूत", brand: "AgriCraft", weight: "600g", in_stock: true },

    // === IRRIGATION ===
    { id: 21, name: "ड्रिप इरिगेशन किट 100 वर्ग मीटर (Drip Irrigation Kit)", category: "irrigation", description: "100 वर्ग मीटर खेत के लिए पूर्ण ड्रिप किट। 70% पानी की बचत।", image_url: "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=500&q=80", price: 1299.0, original_price: 1599.0, rating: 4.9, reviews_count: 42, badge: "20% ऑफ", brand: "Jain Irrigation", weight: "2.5kg", in_stock: true },
    { id: 22, name: "HDPE पाइप 1 इंच (HDPE Pipe 50m Roll)", category: "irrigation", description: "50 मीटर की एचडीपीई पाइप रील। टिकाऊ, UV प्रतिरोधी।", image_url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500&q=80", price: 899.0, original_price: 1100.0, rating: 4.6, reviews_count: 55, badge: "ISO प्रमाणित", brand: "Finolex", weight: "8kg", in_stock: true },
    { id: 23, name: "सोलर वाटर पंप 1HP (Solar Submersible Pump)", category: "irrigation", description: "1HP सोलर चलित सबमर्सिबल पंप। बिजली बिल शून्य।", image_url: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=500&q=80", price: 18500.0, original_price: 22000.0, rating: 4.8, reviews_count: 33, badge: "सोलर", brand: "Lubi", weight: "12kg", in_stock: true },
    { id: 24, name: "फव्वारा सिंचाई सेट (Mini Sprinkler Set 10 nos)", category: "irrigation", description: "सब्जियों व फूलों के लिए 10 मिनी स्प्रिंकलर का सेट।", image_url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500&q=80", price: 599.0, original_price: 749.0, rating: 4.5, reviews_count: 28, badge: "किफायती", brand: "Jain Irrigation", weight: "1.2kg", in_stock: true },
    { id: 25, name: "फुट वाल्व 1.5 इंच (Foot Valve Brass 1.5 inch)", category: "irrigation", description: "पंप बोरवेल के साथ उपयोग के लिए पीतल का फुट वाल्व।", image_url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500&q=80", price: 349.0, original_price: 420.0, rating: 4.4, reviews_count: 19, badge: "पीतल", brand: "Kirloskar", weight: "650g", in_stock: true },

    // === FARM UTILITY ===
    { id: 26, name: "टार्पोलिन 20x30 फीट (Heavy Duty Tarpaulin Tirpal)", category: "farm-utility", description: "20x30 फीट मोटा तिरपाल। बरसात में फसल और उपकरण सुरक्षा के लिए।", image_url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&q=80", price: 799.0, original_price: 999.0, rating: 4.7, reviews_count: 145, badge: "गांव जरूरत", brand: "Shri Tirpal", weight: "4kg", in_stock: true },
    { id: 27, name: "बोरी/बारदाना (Jute Gunny Bags 100 pcs)", category: "farm-utility", description: "100 जूट बोरी का बंडल। अनाज भंडारण के लिए उत्तम।", image_url: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=500&q=80", price: 1200.0, original_price: 1500.0, rating: 4.5, reviews_count: 92, badge: "थोक", brand: "Jute Corp", weight: "15kg", in_stock: true },
    { id: 28, name: "कृषि ग्लव्ज़ (Heavy Duty Farm Gloves Pair)", category: "farm-utility", description: "मोटे रबर और कपड़े के बने खेत के दस्ताने। कांटे, रसायन से सुरक्षा।", image_url: "https://images.unsplash.com/photo-1572286012720-2b3cf8a87e78?w=500&q=80", price: 199.0, original_price: 249.0, rating: 4.3, reviews_count: 68, badge: "सुरक्षा", brand: "SafeFarm", weight: "300g", in_stock: true },

    // === CATTLE CARE ===
    { id: 29, name: "पशु आहार प्रीमियम (Cattle Feed Premium 50kg)", category: "cattle-care", description: "दूधारू पशुओं के लिए पोषक तत्वों से भरपूर प्रीमियम पशु आहार।", image_url: "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=500&q=80", price: 1800.0, original_price: 2100.0, rating: 4.7, reviews_count: 88, badge: "पशु पसंद", brand: "Suguna", weight: "50kg", in_stock: true },
    { id: 30, name: "पशु खनिज मिश्रण (Mineral Mixture for Cattle 1kg)", category: "cattle-care", description: "दूध उत्पादन बढ़ाने और हड्डियां मजबूत करने वाला खनिज मिश्रण।", image_url: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=500&q=80", price: 349.0, original_price: 420.0, rating: 4.6, reviews_count: 56, badge: "दूध बूस्टर", brand: "Virbac", weight: "1kg", in_stock: true },

    // === ORGANIC BIO ===
    { id: 31, name: "पंचगव्य बायो प्रमोटर (Organic Panchagavya 1L)", category: "organic-bio", description: "देसी गाय के 5 द्रव्यों से निर्मित पारंपरिक वृद्धि वर्धक। 100% प्राकृतिक।", image_url: "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=500&q=80", price: 260.0, original_price: 320.0, rating: 4.8, reviews_count: 64, badge: "देसी गाय", brand: "Krishi Vedic", weight: "1L", in_stock: true },
    { id: 32, name: "ट्राइकोडर्मा विरिडी बायो फंगीसाइड (Trichoderma Viride 1kg)", category: "organic-bio", description: "जड़ गलन और उकठा रोग से बचाव के लिए उपयोगी बायो फफूंदनाशक।", image_url: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=500&q=80", price: 220.0, original_price: 280.0, rating: 4.7, reviews_count: 73, badge: "जैविक ढाल", brand: "BioShield", weight: "1kg", in_stock: true }
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