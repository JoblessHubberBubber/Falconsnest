// Global variables for cart functionality
let cart = [];
let currentPage = 'home-page';
let selectedSize = 'M';

// Function to show a specific page and hide others
function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show the selected page
    document.getElementById(pageId).classList.add('active');
    
    // Update the current page variable
    currentPage = pageId;
    
    // If showing the cart or payment page, update the totals
    if (pageId === 'cart-page') {
        updateCartDisplay();
    } else if (pageId === 'payment-page') {
        document.getElementById('payment-total').textContent = document.getElementById('cart-total').textContent;
    }
    
    // Scroll to top when changing pages
    window.scrollTo(0, 0);
}

// Function to set the active page and update navigation
function setActivePage(pageId, navLink) {
    // Update active link in navigation
    if (navLink) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        navLink.classList.add('active');
    }
    
    // Show the selected page
    showPage(pageId);
}

// Function to handle spirit wear product views
function viewProduct(productId) {
    // Hide all product details
    document.querySelectorAll('.product-details').forEach(product => {
        product.style.display = 'none';
    });
    
    // Show selected product details
    document.getElementById('product-' + productId).style.display = 'flex';
    
    // Scroll to product details
    document.getElementById('product-' + productId).scrollIntoView({ behavior: 'smooth' });
}

// Function to go back to spirit wear grid
function backToSpiritWear() {
    // Hide all product details
    document.querySelectorAll('.product-details').forEach(product => {
        product.style.display = 'none';
    });
    
    // Scroll back to top of spirit wear page
    window.scrollTo(0, 0);
}

// Function to select size
function selectSize(element) {
    // Remove selected class from all size labels
    document.querySelectorAll('.size-label').forEach(label => {
        label.classList.remove('selected');
    });
    
    // Add selected class to clicked element
    element.classList.add('selected');
    
    // Update selected size
    selectedSize = element.textContent;
}

// Function to increase quantity
function increaseQuantity(inputId) {
    const input = document.getElementById(inputId);
    const currentValue = parseInt(input.value);
    if (currentValue < 10) {
        input.value = currentValue + 1;
    }
}

// Function to decrease quantity
function decreaseQuantity(inputId) {
    const input = document.getElementById(inputId);
    const currentValue = parseInt(input.value);
    if (currentValue > 1) {
        input.value = currentValue - 1;
    }
}

// Function to add item to cart
function addToCart(productName, price, image) {
    // Create cart item
    const item = {
        name: productName,
        price: price,
        image: image,
        quantity: 1,
        size: selectedSize
    };
    
    // Check if item already in cart
    const existingItemIndex = cart.findIndex(cartItem => 
        cartItem.name === item.name && cartItem.size === item.size
    );
    
    if (existingItemIndex !== -1) {
        // Increase quantity if item already in cart
        cart[existingItemIndex].quantity += 1;
    } else {
        // Add new item to cart
        cart.push(item);
    }
    
    // Update cart badge
    updateCartBadge();
    
    // Show notification
    showCartNotification();
    
    // Save cart to local storage
    saveCart();
}

// Function to add item to cart with specific quantity
function addToCartWithQuantity(productName, price, image, quantityInputId) {
    const quantity = parseInt(document.getElementById(quantityInputId).value);
    
    // Create cart item
    const item = {
        name: productName,
        price: price,
        image: image,
        quantity: quantity,
        size: selectedSize
    };
    
    // Check if item already in cart
    const existingItemIndex = cart.findIndex(cartItem => 
        cartItem.name === item.name && cartItem.size === item.size
    );
    
    if (existingItemIndex !== -1) {
        // Increase quantity if item already in cart
        cart[existingItemIndex].quantity += quantity;
    } else {
        // Add new item to cart
        cart.push(item);
    }
    
    // Update cart badge
    updateCartBadge();
    
    // Show notification
    showCartNotification();
    
    // Save cart to local storage
    saveCart();
}

// Function to update cart badge
function updateCartBadge() {
    const cartBadge = document.getElementById('cart-badge');
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartBadge.textContent = totalItems;
}

// Function to show cart notification
function showCartNotification() {
    const notification = document.getElementById('cart-notification');
    notification.classList.add('show');
    
    // Hide notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Function to update cart display
function updateCartDisplay() {
    const cartItems = document.getElementById('cart-items');
    const emptyCart = document.getElementById('empty-cart');
    const cartContent = document.getElementById('cart-content');
    
    // Check if cart is empty
    if (cart.length === 0) {
        emptyCart.style.display = 'block';
        cartContent.style.display = 'none';
        return;
    }
    
    // Cart has items
    emptyCart.style.display = 'none';
    cartContent.style.display = 'block';
    
    // Clear cart items
    cartItems.innerHTML = '';
    
    // Variables to track totals
    let subtotal = 0;
    
    // Add each item to cart
    cart.forEach((item, index) => {
        const row = document.createElement('tr');
        
        // Calculate item total
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        row.innerHTML = `
            <td>
                <div class="cart-product">
                    <div class="cart-product-image">${item.image}</div>
                    <div class="cart-product-info">
                        <h4>${item.name}</h4>
                        ${item.size !== 'undefined' ? `<p>Size: ${item.size}</p>` : ''}
                    </div>
                </div>
            </td>
            <td>$${item.price.toFixed(2)}</td>
            <td>
                <div class="quantity-control">
                    <button class="quantity-btn" onclick="updateCartItemQuantity(${index}, -1)">-</button>
                    <input type="number" class="quantity-input" value="${item.quantity}" min="1" max="10" onchange="updateCartItemQuantityByInput(${index}, this.value)">
                    <button class="quantity-btn" onclick="updateCartItemQuantity(${index}, 1)">+</button>
                </div>
            </td>
            <td>$${itemTotal.toFixed(2)}</td>
            <td>
                <button class="remove-btn" onclick="removeCartItem(${index})">Remove</button>
            </td>
        `;
        
        cartItems.appendChild(row);
    });
    
    // Calculate tax and total
    const tax = subtotal * 0.03;
    const total = subtotal + tax;
    
    // Update summary
    document.getElementById('cart-subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('cart-tax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('cart-total').textContent = `$${total.toFixed(2)}`;
}

// Function to update cart item quantity
function updateCartItemQuantity(index, change) {
    // Update quantity
    cart[index].quantity += change;
    
    // Ensure quantity is at least 1
    if (cart[index].quantity < 1) {
        cart[index].quantity = 1;
    }
    
    // Update cart display
    updateCartDisplay();
    
    // Update cart badge
    updateCartBadge();
    
    // Save cart to local storage
    saveCart();
}

// Function to update cart item quantity by input
function updateCartItemQuantityByInput(index, value) {
    // Parse value as integer
    const newQuantity = parseInt(value);
    
    // Validate input
    if (isNaN(newQuantity) || newQuantity < 1) {
        cart[index].quantity = 1;
    } else {
        cart[index].quantity = newQuantity;
    }
    
    // Update cart display
    updateCartDisplay();
    
    // Update cart badge
    updateCartBadge();
    
    // Save cart to local storage
    saveCart();
}

// Function to remove item from cart
function removeCartItem(index) {
    // Remove item from cart
    cart.splice(index, 1);
    
    // Update cart display
    updateCartDisplay();
    
    // Update cart badge
    updateCartBadge();
    
    // Save cart to local storage
    saveCart();
}

// Function to save cart to local storage
function saveCart() {
    localStorage.setItem('falconsNestCart', JSON.stringify(cart));
}

// Function to load cart from local storage
function loadCart() {
    const savedCart = localStorage.getItem('falconsNestCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartBadge();
    }
}

// Function to place order
function placeOrder() {
    // Validate form
    if (!validateForm()) {
        return;
    }
    
    // Show success message
    document.getElementById('order-success').style.display = 'block';
    document.getElementById('payment-form').style.display = 'none';
    
    // Clear cart
    cart = [];
    updateCartBadge();
    saveCart();
    
    // Scroll to top
    window.scrollTo(0, 0);
}

// Function to validate form
function validateForm() {
    const firstName = document.getElementById('first-name').value;
    const lastName = document.getElementById('last-name').value;
    const email = document.getElementById('email').value;
    
    if (!firstName || !lastName || !email) {
        alert('Please complete all required fields.');
        return false;
    }
    
    // Check payment method
    const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;
    
    if (paymentMethod === 'student-id') {
        const studentId = document.getElementById('student-id-number').value;
        if (!studentId) {
            alert('Please enter your Student ID number.');
            return false;
        }
    } else if (paymentMethod === 'credit-card') {
        const cardNumber = document.getElementById('card-number').value;
        const expiryDate = document.getElementById('expiry-date').value;
        const cvv = document.getElementById('cvv').value;
        
        if (!cardNumber || !expiryDate || !cvv) {
            alert('Please complete all credit card fields.');
            return false;
        }
    }
    
    return true;
}

// Function to handle payment method change
function handlePaymentMethodChange() {
    const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;
    
    if (paymentMethod === 'student-id') {
        document.getElementById('student-id-section').style.display = 'block';
        document.getElementById('credit-card-section').style.display = 'none';
    } else if (paymentMethod === 'credit-card') {
        document.getElementById('student-id-section').style.display = 'none';
        document.getElementById('credit-card-section').style.display = 'block';
    } else {
        document.getElementById('student-id-section').style.display = 'none';
        document.getElementById('credit-card-section').style.display = 'none';
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Load cart from local storage
    loadCart();
    
    // Add event listeners for payment method change
    document.querySelectorAll('input[name="payment-method"]').forEach(radio => {
        radio.addEventListener('change', handlePaymentMethodChange);
    });
    
    // Initialize payment method display
    handlePaymentMethodChange();
});

