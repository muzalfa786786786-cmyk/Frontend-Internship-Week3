// ===== MOBILE MENU TOGGLE =====
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navbar = document.querySelector('.navbar');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navbar.classList.toggle('active');
        });
    }
});

// ===== PRODUCT DETAILS PAGE INTERACTIONS =====
// Change main image on thumbnail click
function changeImage(element) {
    // Update active thumbnail
    document.querySelectorAll('.thumbnail').forEach(thumb => thumb.classList.remove('active'));
    element.classList.add('active');
    // Update main image
    const newSrc = element.src.replace('w=100', 'w=600');
    document.getElementById('mainProductImg').src = newSrc;
}

// Color selection
function selectColor(element, colorName) {
    document.querySelectorAll('.color-circle').forEach(c => c.classList.remove('active'));
    element.classList.add('active');
    showToast(`Color selected: ${colorName}`);
}

// Size selection
function selectSize(element, sizeName) {
    document.querySelectorAll('.size-btn').forEach(btn => btn.classList.remove('active'));
    element.classList.add('active');
    showToast(`Size selected: ${sizeName}`);
}

// Quantity
function incrementQty() {
    const qty = document.getElementById('quantity');
    qty.value = parseInt(qty.value) + 1;
}

function decrementQty() {
    const qty = document.getElementById('quantity');
    if (parseInt(qty.value) > 1) {
        qty.value = parseInt(qty.value) - 1;
    }
}

// Add to Cart / Buy Now
function addToCart() {
    const qty = document.getElementById('quantity').value;
    const color = document.querySelector('.color-circle.active')?.style.backgroundColor || 'beige';
    const size = document.querySelector('.size-btn.active')?.textContent || 'Regular';
    showToast(`✅ Added ${qty} x Premium Silk Hijab (${color}, ${size}) to cart`);
}

function buyNow() {
    const qty = document.getElementById('quantity').value;
    showToast(`⚡ Proceeding to buy ${qty} item(s)`);
}

// Toast notification
function showToast(message) {
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.style.position = 'fixed';
        toast.style.bottom = '20px';
        toast.style.left = '50%';
        toast.style.transform = 'translateX(-50%)';
        toast.style.backgroundColor = 'var(--brown)';
        toast.style.color = 'white';
        toast.style.padding = '12px 24px';
        toast.style.borderRadius = '50px';
        toast.style.boxShadow = '0 10px 20px rgba(0,0,0,0.2)';
        toast.style.zIndex = '1000';
        toast.style.transition = 'opacity 0.3s';
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.style.opacity = '1';
    setTimeout(() => {
        toast.style.opacity = '0';
    }, 2000);
}

// ===== ADD TO CART BUTTONS ON PRODUCTS PAGE =====
document.addEventListener('DOMContentLoaded', function() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const product = this.dataset.product;
            const price = this.dataset.price;
            showToast(`🛒 Added ${product} - $${price} to cart`);
        });
    });

    // Contact form validation
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();
            const formMessage = document.getElementById('formMessage');

            if (!name || !email || !message) {
                formMessage.style.color = 'red';
                formMessage.textContent = 'Please fill in all fields.';
                return;
            }
            if (!email.includes('@') || !email.includes('.')) {
                formMessage.style.color = 'red';
                formMessage.textContent = 'Please enter a valid email.';
                return;
            }
            formMessage.style.color = 'green';
            formMessage.textContent = 'Message sent! We will reply soon.';
            contactForm.reset();
        });
    }
});