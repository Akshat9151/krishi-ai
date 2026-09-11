// Checkout Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initCheckout();
    loadOrderSummary();
    setupPaymentMethods();
    setupAddressSelection();
});

function initCheckout() {
    // Load cart items for checkout
    const cart = JSON.parse(localStorage.getItem('krishiCart')) || [];
    if (cart.length === 0) {
        window.location.href = 'index.html';
        return;
    }
}

function loadOrderSummary() {
    const cart = JSON.parse(localStorage.getItem('krishiCart')) || [];
    const orderItemsEl = document.querySelector('.order-items');
    const subtotalEl = document.querySelector('.price-row:first-child span:last-child');
    
    if (!orderItemsEl || !subtotalEl) return;
    
    let subtotal = 0;
    
    orderItemsEl.innerHTML = cart.map(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        return `
            <div class="order-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <p>मात्रा: ${item.quantity} × ₹${item.price}</p>
                </div>
                <div class="item-price">₹${itemTotal}</div>
            </div>
        `;
    }).join('');
    
    // Update prices
    const tax = subtotal * 0.18;
    const discount = subtotal * 0.20; // 20% discount
    const total = subtotal + tax - discount;
    
    subtotalEl.textContent = `₹${subtotal.toFixed(2)}`;
    document.querySelector('.price-row:nth-child(3) span:last-child').textContent = `₹${tax.toFixed(2)}`;
    document.querySelector('.price-row:nth-child(4) span:last-child').textContent = `-₹${discount.toFixed(2)}`;
    document.querySelector('.price-row.total span:last-child').textContent = `₹${total.toFixed(2)}`;
}

function setupPaymentMethods() {
    const paymentMethods = document.querySelectorAll('.payment-method');
    
    paymentMethods.forEach(method => {
        method.addEventListener('click', function() {
            // Remove selected class from all
            paymentMethods.forEach(m => m.classList.remove('selected'));
            // Add to clicked
            this.classList.add('selected');
            
            // Show corresponding form
            const methodType = this.getAttribute('data-method');
            showPaymentForm(methodType);
        });
    });
}

function showPaymentForm(methodType) {
    // Hide all forms
    document.querySelectorAll('.payment-details').forEach(form => {
        form.style.display = 'none';
    });
    
    // Show selected form
    const selectedForm = document.getElementById(`${methodType}-details`);
    if (selectedForm) {
        selectedForm.style.display = 'block';
    }
}

function setupAddressSelection() {
    const addressCards = document.querySelectorAll('.address-card');
    const addAddressBtn = document.querySelector('.btn-add-address');
    const newAddressForm = document.getElementById('new-address-form');
    
    addressCards.forEach(card => {
        card.addEventListener('click', function(e) {
            if (!e.target.classList.contains('btn-select-address')) {
                addressCards.forEach(c => c.classList.remove('selected'));
                this.classList.add('selected');
            }
        });
        
        const selectBtn = card.querySelector('.btn-select-address');
        if (selectBtn) {
            selectBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                addressCards.forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
            });
        }
    });
    
    if (addAddressBtn && newAddressForm) {
        addAddressBtn.addEventListener('click', function() {
            newAddressForm.style.display = 'block';
            this.style.display = 'none';
        });
    }
}

function cancelNewAddress() {
    document.getElementById('new-address-form').style.display = 'none';
    document.querySelector('.btn-add-address').style.display = 'block';
}

function applyCoupon() {
    const couponCode = document.getElementById('coupon-code').value.trim();
    const discountRow = document.querySelector('.price-row.discount');
    
    if (couponCode === 'KRISHI20') {
        discountRow.style.display = 'flex';
        showNotification('कूपन कोड सफलतापूर्वक लागू किया गया');
    } else if (couponCode) {
        showNotification('अमान्य कूपन कोड');
    }
}

function placeOrder() {
    const termsChecked = document.getElementById('terms-agree');
    const selectedPayment = document.querySelector('.payment-method.selected').getAttribute('data-method');
    
    if (!termsChecked.checked) {
        showNotification('कृपया टर्म्स एंड कंडीशन से सहमत हों');
        return;
    }
    
    if (selectedPayment === 'cod') {
        processCODOrder();
    } else {
        processOnlinePayment(selectedPayment);
    }
}

async function processCODOrder() {
    const cart = JSON.parse(localStorage.getItem('krishiCart')) || [];
    if (cart.length === 0) {
        showNotification('कार्ट खाली है। पहले उत्पाद जोड़ें।');
        return;
    }

    const customerName = document.getElementById('name')?.value.trim();
    const phone = document.getElementById('phone')?.value.trim();
    const address = document.getElementById('address')?.value.trim();

    if (!customerName || !/^[A-Za-zÀ-ÿ\u0900-\u097F\s.'-]{2,80}$/.test(customerName)) {
        showNotification('कृपया अपना सही नाम लिखें।');
        document.getElementById('name')?.focus();
        return;
    }
    if (!/^\d{10}$/.test(phone)) {
        showNotification('कृपया 10 अंकों का मोबाइल नंबर लिखें।');
        document.getElementById('phone')?.focus();
        return;
    }
    if (!address || address.length < 8) {
        showNotification('कृपया पूरा डिलीवरी पता लिखें।');
        document.getElementById('address')?.focus();
        return;
    }

    const submitButton = document.querySelector('.place-order-btn');
    const originalText = submitButton?.textContent;
    if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'ऑर्डर भेजा जा रहा है...';
    }

    const orderPayload = {
        customer_name: customerName,
        phone,
        address,
        items: cart.map(item => ({
            product_id: item.id || null,
            name: item.name,
            price: Number(item.price),
            quantity: Number(item.quantity)
        })),
        total_amount: calculateTotal(),
        payment_method: 'cod'
    };

    try {
        const response = await fetch(window.getApiUrl('/api/store/orders'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderPayload)
        });
        const payload = await response.json().catch(() => ({}));
        if (!response.ok || !payload.order_number) {
            throw new Error(payload.detail || 'Order could not be confirmed');
        }

        localStorage.removeItem('krishiCart');
        window.location.assign('order-confirmation.html?order=' + encodeURIComponent(payload.order_number));
    } catch (error) {
        console.error('Order creation failed:', error);
        showNotification('ऑर्डर सेव नहीं हुआ। इंटरनेट जाँचकर फिर कोशिश करें।');
    } finally {
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = originalText || 'ऑर्डर कन्फर्म करें';
        }
    }
}

function processOnlinePayment() {
    showNotification('ऑनलाइन भुगतान अभी उपलब्ध नहीं है। कृपया कैश ऑन डिलीवरी चुनें।');
}

function calculateTotal() {
    const totalText = document.querySelector('.price-row.total span:last-child').textContent;
    return Number.parseFloat(totalText.replace(/[^0-9.]/g, '')) || 0;
}

// Add these functions to store.js for cart page

function viewCart() {
    window.location.href = 'checkout.html';
}

function updateCartQuantity(productId, newQuantity) {
    const cart = JSON.parse(localStorage.getItem('krishiCart')) || [];
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        if (newQuantity > 0) {
            item.quantity = newQuantity;
        } else {
            cart.splice(cart.indexOf(item), 1);
        }
        
        localStorage.setItem('krishiCart', JSON.stringify(cart));
        updateCartCount();
        return true;
    }
    return false;
}