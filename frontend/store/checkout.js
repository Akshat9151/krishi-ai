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

function processCODOrder() {
    // Simulate order processing
    showNotification('ऑर्डर कन्फर्म किया गया!');
    
    // Clear cart
    localStorage.removeItem('krishiCart');
    
    // Redirect to confirmation
    setTimeout(() => {
        window.location.href = 'order-confirmation.html';
    }, 2000);
}

function processOnlinePayment(paymentMethod) {
    const totalAmount = calculateTotal();
    
    if (window.Razorpay) {
        const options = {
            "key": "rzp_test_YOUR_KEY_ID", // Replace with your Razorpay Key
            "amount": totalAmount * 100, // Amount in paise
            "currency": "INR",
            "name": "Krishi AI Store",
            "description": "कृषि उत्पाद खरीद",
            "image": "https://your-logo-url.com/logo.png",
            "handler": function(response) {
                // Payment success
                showNotification('पेमेंट सफल! ऑर्डर कन्फर्म किया जा रहा है...');
                completeOrder(response.razorpay_payment_id);
            },
            "prefill": {
                "name": "किसान नाम",
                "email": "farmer@example.com",
                "contact": "9876543210"
            },
            "notes": {
                "address": "किसान का पता"
            },
            "theme": {
                "color": "#2d5a27"
            }
        };
        
        const rzp = new Razorpay(options);
        rzp.open();
    } else {
        // Fallback to manual payment form
        showNotification(`Processing ${paymentMethod} payment...`);
        setTimeout(() => {
            showNotification('Payment successful!');
            completeOrder();
        }, 3000);
    }
}

function calculateTotal() {
    const totalText = document.querySelector('.price-row.total span:last-child').textContent;
    return parseFloat(totalText.replace('₹', ''));
}

function completeOrder(paymentId = null) {
    // Save order to localStorage
    const order = {
        id: 'ORD' + Date.now(),
        date: new Date().toLocaleDateString('hi-IN'),
        items: JSON.parse(localStorage.getItem('krishiCart')),
        total: calculateTotal(),
        paymentId: paymentId,
        status: 'processing'
    };
    
    // Save order
    let orders = JSON.parse(localStorage.getItem('krishiOrders')) || [];
    orders.push(order);
    localStorage.setItem('krishiOrders', JSON.stringify(orders));
    
    // Clear cart
    localStorage.removeItem('krishiCart');
    
    // Redirect to confirmation
    setTimeout(() => {
        window.location.href = 'order-confirmation.html?order=' + order.id;
    }, 1500);
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