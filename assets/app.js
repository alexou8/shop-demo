/**
 * Main application JavaScript
 * Handles cart, dark mode, animations, and page-specific functionality
 */

// ==================== GLOBAL STATE ====================
const AppState = {
  cart: Storage.get('cart', []),
  darkMode: Storage.get('darkMode', false),
  wishlist: Storage.get('wishlist', [])
};

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
  initializeApp();
  initializeDarkMode();
  initializeNavbar();
  initializeAnimations();
  updateCartBadge();
  
  // Page-specific initialization
  const page = document.body.dataset.page;
  
  switch(page) {
    case 'home':
      initializeHomePage();
      break;
    case 'shop':
      initializeShopPage();
      break;
    case 'product':
      initializeProductPage();
      break;
    case 'cart':
      initializeCartPage();
      break;
    case 'checkout':
      initializeCheckoutPage();
      break;
    case 'about':
      initializeAboutPage();
      break;
  }
});

function initializeApp() {
  // Set page fade-in class
  document.body.classList.add('loaded');
}

// ==================== DARK MODE ====================
function initializeDarkMode() {
  const darkModeToggle = document.getElementById('dark-mode-toggle');
  
  // Apply saved theme
  if (AppState.darkMode) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
  
  // Toggle handler
  if (darkModeToggle) {
    darkModeToggle.addEventListener('click', () => {
      AppState.darkMode = !AppState.darkMode;
      Storage.set('darkMode', AppState.darkMode);
      
      if (AppState.darkMode) {
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.removeAttribute('data-theme');
      }
    });
  }
}

// ==================== NAVBAR ====================
function initializeNavbar() {
  const navbar = document.querySelector('.navbar');
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const navbarNav = document.querySelector('.navbar-nav');
  
  // Scroll effect
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
  });
  
  // Mobile menu toggle
  if (mobileMenuToggle && navbarNav) {
    mobileMenuToggle.addEventListener('click', () => {
      navbarNav.classList.toggle('active');
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.navbar-nav') && !e.target.closest('.mobile-menu-toggle')) {
        navbarNav.classList.remove('active');
      }
    });
  }
  
  // Search functionality (if on shop page)
  const searchInput = document.querySelector('.navbar-search input');
  if (searchInput && document.body.dataset.page === 'shop') {
    searchInput.addEventListener('input', debounce((e) => {
      filterProducts();
    }, 300));
  }
}

// ==================== ANIMATIONS ====================
function initializeAnimations() {
  if (prefersReducedMotion()) {
    return;
  }
  
  // Intersection Observer for section reveals
  const sections = document.querySelectorAll('.section');
  
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Stagger animation
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, index * 100);
        
        sectionObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  sections.forEach(section => {
    sectionObserver.observe(section);
  });
}

// ==================== CART MANAGEMENT ====================
function getCart() {
  return AppState.cart;
}

function saveCart() {
  Storage.set('cart', AppState.cart);
  updateCartBadge();
}

function addToCart(productId, options = {}) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return false;
  
  const {
    color = product.colors[0],
    size = product.sizes[0],
    quantity = 1
  } = options;
  
  // Check if item with same options exists
  const existingItemIndex = AppState.cart.findIndex(item => 
    item.id === productId && 
    item.color === color && 
    item.size === size
  );
  
  if (existingItemIndex > -1) {
    // Update quantity
    AppState.cart[existingItemIndex].quantity += quantity;
  } else {
    // Add new item
    AppState.cart.push({
      id: productId,
      name: product.name,
      price: product.price,
      color,
      size,
      quantity,
      image: product.image || null
    });
  }
  
  saveCart();
  showCartNotification('Item added to cart!');
  animateCartIcon();
  
  return true;
}

function updateCartItem(index, quantity) {
  if (quantity <= 0) {
    removeFromCart(index);
    return;
  }
  
  AppState.cart[index].quantity = clamp(quantity, 1, 99);
  saveCart();
}

function removeFromCart(index) {
  AppState.cart.splice(index, 1);
  saveCart();
}

function clearCart() {
  AppState.cart = [];
  saveCart();
}

function getCartItemCount() {
  return AppState.cart.reduce((sum, item) => sum + item.quantity, 0);
}

function updateCartBadge() {
  const badge = document.querySelector('.cart-badge');
  const count = getCartItemCount();
  
  if (badge) {
    badge.textContent = count;
    badge.style.display = count > 0 ? 'block' : 'none';
  }
}

function animateCartIcon() {
  const cartIcon = document.querySelector('.cart-icon-btn');
  if (cartIcon) {
    cartIcon.style.animation = 'none';
    setTimeout(() => {
      cartIcon.style.animation = 'bounceIn 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
    }, 10);
  }
}

function showCartNotification(message) {
  // Simple notification (could be enhanced with toast)
  const notification = document.createElement('div');
  notification.className = 'cart-notification';
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    background-color: var(--color-accent-primary);
    color: white;
    padding: 1rem 1.5rem;
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-xl);
    z-index: var(--z-toast);
    animation: slideInUp 0.3s ease-out;
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'fadeOut 0.3s ease-out';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Add animation keyframes dynamically
if (!document.getElementById('notification-animations')) {
  const style = document.createElement('style');
  style.id = 'notification-animations';
  style.textContent = `
    @keyframes slideInUp {
      from {
        transform: translateY(100px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
    @keyframes fadeOut {
      to {
        opacity: 0;
        transform: translateY(-20px);
      }
    }
  `;
  document.head.appendChild(style);
}

// ==================== HOME PAGE ====================
function initializeHomePage() {
  renderFeaturedProducts();
  renderCategories();
  renderTestimonials();
  renderFeatures();
}

function renderFeaturedProducts() {
  const container = document.getElementById('featured-products');
  if (!container) return;
  
  const featured = PRODUCTS.filter(p => FEATURED_PRODUCT_IDS.includes(p.id));
  
  container.innerHTML = featured.map(product => createProductCard(product)).join('');
  
  // Add click handlers
  container.querySelectorAll('.product-card').forEach((card, index) => {
    card.addEventListener('click', (e) => {
      if (!e.target.closest('.btn')) {
        window.location.href = `product.html?id=${featured[index].id}`;
      }
    });
  });
  
  // Add to cart handlers
  container.querySelectorAll('.quick-add-btn').forEach((btn, index) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      addToCart(featured[index].id);
    });
  });
}

function renderCategories() {
  const container = document.getElementById('categories-grid');
  if (!container) return;
  
  const categories = CATEGORIES.filter(c => c.id !== 'all');
  
  container.innerHTML = categories.map(category => `
    <a href="shop.html?category=${category.id}" class="card category-card">
      <div class="category-icon">${getCategoryIcon(category.icon)}</div>
      <h3>${category.name}</h3>
    </a>
  `).join('');
}

function renderTestimonials() {
  const container = document.getElementById('testimonials');
  if (!container) return;
  
  container.innerHTML = TESTIMONIALS.map(testimonial => `
    <div class="card testimonial-card">
      <div class="stars">${renderStars(testimonial.rating)}</div>
      <p>"${testimonial.text}"</p>
      <strong>${testimonial.name}</strong>
    </div>
  `).join('');
}

function renderFeatures() {
  const container = document.getElementById('features');
  if (!container) return;
  
  container.innerHTML = STORE_FEATURES.map(feature => `
    <div class="feature-card">
      <div class="feature-icon">${getFeatureIcon(feature.icon)}</div>
      <h4>${feature.title}</h4>
      <p>${feature.description}</p>
    </div>
  `).join('');
}

// ==================== SHOP PAGE ====================
function initializeShopPage() {
  renderAllProducts();
  setupFilters();
  setupSort();
  setupLoadMore();
}

let currentFilters = {
  category: getQueryParam('category') || 'all',
  priceRange: 'all',
  minRating: 0,
  search: ''
};

let currentSort = 'featured';
let displayedProducts = 12;

function renderAllProducts() {
  const container = document.getElementById('products-grid');
  if (!container) return;
  
  // Show skeleton loading
  showProductSkeletons(container);
  
  // Simulate loading delay
  setTimeout(() => {
    filterProducts();
  }, 500);
}

function showProductSkeletons(container) {
  container.innerHTML = Array(6).fill(0).map(() => `
    <div class="skeleton-card">
      <div class="skeleton skeleton-image"></div>
      <div class="skeleton skeleton-text"></div>
      <div class="skeleton skeleton-text"></div>
      <div class="skeleton skeleton-text"></div>
    </div>
  `).join('');
}

function filterProducts() {
  const container = document.getElementById('products-grid');
  if (!container) return;
  
  // Get search value from navbar
  const searchInput = document.querySelector('.navbar-search input');
  if (searchInput) {
    currentFilters.search = searchInput.value.toLowerCase();
  }
  
  // Filter products
  let filtered = PRODUCTS.filter(product => {
    // Category filter
    if (currentFilters.category !== 'all' && product.category !== currentFilters.category) {
      return false;
    }
    
    // Price range filter
    if (currentFilters.priceRange !== 'all') {
      const range = PRICE_RANGES.find(r => r.id === currentFilters.priceRange);
      if (range && (product.price < range.min || product.price > range.max)) {
        return false;
      }
    }
    
    // Rating filter
    if (product.rating < currentFilters.minRating) {
      return false;
    }
    
    // Search filter
    if (currentFilters.search && !product.name.toLowerCase().includes(currentFilters.search) &&
        !product.description.toLowerCase().includes(currentFilters.search)) {
      return false;
    }
    
    return true;
  });
  
  // Sort products
  filtered = sortProducts(filtered, currentSort);
  
  // Update results count
  const resultsCount = document.getElementById('results-count');
  if (resultsCount) {
    resultsCount.textContent = `${filtered.length} products`;
  }
  
  // Render products
  const toDisplay = filtered.slice(0, displayedProducts);
  container.innerHTML = toDisplay.map(product => createProductCard(product)).join('');
  
  // Update load more button
  const loadMoreBtn = document.getElementById('load-more-btn');
  if (loadMoreBtn) {
    loadMoreBtn.style.display = filtered.length > displayedProducts ? 'block' : 'none';
  }
  
  // Add click handlers
  attachProductCardHandlers(container, toDisplay);
}

function sortProducts(products, sortBy) {
  const sorted = [...products];
  
  switch(sortBy) {
    case 'price-low':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-high':
      return sorted.sort((a, b) => b.price - a.price);
    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating);
    case 'name':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case 'featured':
    default:
      return sorted;
  }
}

function setupFilters() {
  // Category filter
  const categoryFilter = document.getElementById('category-filter');
  if (categoryFilter) {
    categoryFilter.value = currentFilters.category;
    categoryFilter.addEventListener('change', (e) => {
      currentFilters.category = e.target.value;
      displayedProducts = 12;
      filterProducts();
    });
  }
  
  // Price range filter
  const priceFilter = document.getElementById('price-filter');
  if (priceFilter) {
    priceFilter.addEventListener('change', (e) => {
      currentFilters.priceRange = e.target.value;
      displayedProducts = 12;
      filterProducts();
    });
  }
  
  // Rating filter
  const ratingFilter = document.getElementById('rating-filter');
  if (ratingFilter) {
    ratingFilter.addEventListener('change', (e) => {
      currentFilters.minRating = parseFloat(e.target.value);
      displayedProducts = 12;
      filterProducts();
    });
  }
}

function setupSort() {
  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      currentSort = e.target.value;
      filterProducts();
    });
  }
}

function setupLoadMore() {
  const loadMoreBtn = document.getElementById('load-more-btn');
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
      displayedProducts += 12;
      filterProducts();
      
      // Scroll to new products
      setTimeout(() => {
        const grid = document.getElementById('products-grid');
        if (grid && grid.children.length > displayedProducts - 12) {
          grid.children[displayedProducts - 12].scrollIntoView({ 
            behavior: 'smooth',
            block: 'nearest'
          });
        }
      }, 100);
    });
  }
}

// ==================== PRODUCT PAGE ====================
function initializeProductPage() {
  const productId = parseInt(getQueryParam('id'));
  if (!productId) {
    window.location.href = 'shop.html';
    return;
  }
  
  renderProductDetail(productId);
  renderRelatedProducts(productId);
}

function renderProductDetail(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) {
    document.getElementById('product-detail').innerHTML = '<p>Product not found</p>';
    return;
  }
  
  // Update page title
  document.title = `${product.name} - Luxe Shop`;
  
  // Render product details
  const container = document.getElementById('product-detail');
  container.innerHTML = `
    <div class="product-gallery">
      <div class="product-image-large">
        ${createProductPlaceholder(product.name)}
      </div>
    </div>
    
    <div class="product-info-detail">
      <h1>${product.name}</h1>
      
      <div class="product-rating">
        <div class="stars">${renderStars(product.rating)}</div>
        <span>${product.rating} (${product.reviewCount} reviews)</span>
      </div>
      
      <div class="product-price-large">${formatCurrency(product.price)}</div>
      
      <p class="product-description">${product.description}</p>
      
      ${product.features ? `
        <div class="product-features">
          <h4>Features</h4>
          <ul>
            ${product.features.map(f => `<li>${f}</li>`).join('')}
          </ul>
        </div>
      ` : ''}
      
      <div class="product-options">
        ${product.colors.length > 1 ? `
          <div class="option-group">
            <label class="form-label">Color</label>
            <div class="color-options">
              ${product.colors.map((color, i) => `
                <button class="color-btn ${i === 0 ? 'active' : ''}" data-color="${color}">
                  ${color}
                </button>
              `).join('')}
            </div>
          </div>
        ` : ''}
        
        ${product.sizes.length > 1 ? `
          <div class="option-group">
            <label class="form-label">Size</label>
            <div class="size-options">
              ${product.sizes.map((size, i) => `
                <button class="size-btn ${i === 0 ? 'active' : ''}" data-size="${size}">
                  ${size}
                </button>
              `).join('')}
            </div>
          </div>
        ` : ''}
        
        <div class="option-group">
          <label class="form-label">Quantity</label>
          <div class="quantity-control">
            <button type="button" id="decrease-qty">−</button>
            <input type="number" id="product-quantity" value="1" min="1" max="99" readonly>
            <button type="button" id="increase-qty">+</button>
          </div>
        </div>
      </div>
      
      <div class="product-actions">
        <button class="btn btn-primary btn-lg" id="add-to-cart-btn">Add to Cart</button>
        <button class="btn btn-secondary btn-lg" id="buy-now-btn">Buy Now</button>
      </div>
    </div>
  `;
  
  // Setup option handlers
  setupProductOptions();
  
  // Setup quantity controls
  setupQuantityControls();
  
  // Setup action buttons
  document.getElementById('add-to-cart-btn').addEventListener('click', () => {
    const options = getSelectedOptions();
    addToCart(productId, options);
  });
  
  document.getElementById('buy-now-btn').addEventListener('click', () => {
    const options = getSelectedOptions();
    addToCart(productId, options);
    window.location.href = 'cart.html';
  });
}

function setupProductOptions() {
  // Color selection
  document.querySelectorAll('.color-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
  
  // Size selection
  document.querySelectorAll('.size-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
}

function setupQuantityControls() {
  const qtyInput = document.getElementById('product-quantity');
  const decreaseBtn = document.getElementById('decrease-qty');
  const increaseBtn = document.getElementById('increase-qty');
  
  if (decreaseBtn) {
    decreaseBtn.addEventListener('click', () => {
      const current = parseInt(qtyInput.value);
      qtyInput.value = Math.max(1, current - 1);
    });
  }
  
  if (increaseBtn) {
    increaseBtn.addEventListener('click', () => {
      const current = parseInt(qtyInput.value);
      qtyInput.value = Math.min(99, current + 1);
    });
  }
}

function getSelectedOptions() {
  const colorBtn = document.querySelector('.color-btn.active');
  const sizeBtn = document.querySelector('.size-btn.active');
  const qtyInput = document.getElementById('product-quantity');
  
  return {
    color: colorBtn?.dataset.color || null,
    size: sizeBtn?.dataset.size || null,
    quantity: parseInt(qtyInput?.value || 1)
  };
}

function renderRelatedProducts(currentProductId) {
  const container = document.getElementById('related-products');
  if (!container) return;
  
  const currentProduct = PRODUCTS.find(p => p.id === currentProductId);
  const related = PRODUCTS
    .filter(p => p.id !== currentProductId && p.category === currentProduct.category)
    .slice(0, 4);
  
  container.innerHTML = related.map(product => createProductCard(product)).join('');
  attachProductCardHandlers(container, related);
}

// ==================== CART PAGE ====================
function initializeCartPage() {
  renderCart();
  setupPromoCode();
}

function renderCart() {
  const container = document.getElementById('cart-items');
  const emptyState = document.getElementById('cart-empty');
  const cartContent = document.getElementById('cart-content');
  
  if (!container) return;
  
  const cart = getCart();
  
  if (cart.length === 0) {
    if (emptyState) emptyState.style.display = 'block';
    if (cartContent) cartContent.style.display = 'none';
    return;
  }
  
  if (emptyState) emptyState.style.display = 'none';
  if (cartContent) cartContent.style.display = 'block';
  
  // Render cart items
  container.innerHTML = cart.map((item, index) => `
    <tr>
      <td>
        <div class="cart-item-info">
          <div class="cart-item-image">${createProductPlaceholder(item.name)}</div>
          <div class="cart-item-details">
            <h4>${item.name}</h4>
            <div class="cart-item-meta">
              ${item.color ? `Color: ${item.color}` : ''} 
              ${item.size ? `• Size: ${item.size}` : ''}
            </div>
          </div>
        </div>
      </td>
      <td>${formatCurrency(item.price)}</td>
      <td>
        <div class="quantity-control">
          <button type="button" data-action="decrease" data-index="${index}">−</button>
          <input type="number" value="${item.quantity}" min="1" data-index="${index}" readonly>
          <button type="button" data-action="increase" data-index="${index}">+</button>
        </div>
      </td>
      <td><strong>${formatCurrency(item.price * item.quantity)}</strong></td>
      <td>
        <button class="remove-btn" data-index="${index}">Remove</button>
      </td>
    </tr>
  `).join('');
  
  // Setup quantity controls
  container.querySelectorAll('[data-action]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const index = parseInt(e.target.dataset.index);
      const action = e.target.dataset.action;
      const currentQty = cart[index].quantity;
      
      if (action === 'increase') {
        updateCartItem(index, currentQty + 1);
      } else {
        updateCartItem(index, currentQty - 1);
      }
      
      renderCart();
      updateCartSummary();
    });
  });
  
  // Setup remove buttons
  container.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const index = parseInt(e.target.dataset.index);
      if (confirm('Remove this item from cart?')) {
        removeFromCart(index);
        renderCart();
        updateCartSummary();
      }
    });
  });
  
  updateCartSummary();
}

function updateCartSummary() {
  const cart = getCart();
  const totals = calculateCartTotals(cart);
  
  const subtotalEl = document.getElementById('cart-subtotal');
  const taxEl = document.getElementById('cart-tax');
  const shippingEl = document.getElementById('cart-shipping');
  const totalEl = document.getElementById('cart-total');
  
  if (subtotalEl) subtotalEl.textContent = formatCurrency(totals.subtotal);
  if (taxEl) taxEl.textContent = formatCurrency(totals.tax);
  if (shippingEl) shippingEl.textContent = totals.shipping === 0 ? 'FREE' : formatCurrency(totals.shipping);
  if (totalEl) totalEl.textContent = formatCurrency(totals.total);
}

function setupPromoCode() {
  const promoForm = document.getElementById('promo-form');
  if (promoForm) {
    promoForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = document.getElementById('promo-code');
      const message = document.getElementById('promo-message');
      
      if (input.value.toUpperCase() === 'SAVE10') {
        message.textContent = '10% discount applied!';
        message.style.color = 'var(--color-success)';
      } else {
        message.textContent = 'Invalid promo code';
        message.style.color = 'var(--color-error)';
      }
    });
  }
}

// ==================== CHECKOUT PAGE ====================
function initializeCheckoutPage() {
  setupCheckoutForm();
  updateCheckoutSummary();
  setupStepNavigation();
}

function setupCheckoutForm() {
  const form = document.getElementById('checkout-form');
  if (!form) return;
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (validateCheckoutForm()) {
      processCheckout();
    }
  });
  
  // Real-time validation
  form.querySelectorAll('input').forEach(input => {
    input.addEventListener('blur', () => {
      validateField(input);
    });
  });
}

function validateCheckoutForm() {
  const form = document.getElementById('checkout-form');
  let isValid = true;
  
  form.querySelectorAll('input[required]').forEach(input => {
    if (!validateField(input)) {
      isValid = false;
    }
  });
  
  return isValid;
}

function validateField(input) {
  const value = input.value.trim();
  let error = '';
  
  if (input.required && !value) {
    error = 'This field is required';
  } else if (input.type === 'email' && value && !isValidEmail(value)) {
    error = 'Please enter a valid email';
  } else if (input.id === 'card-number' && value && !isValidCardNumber(value)) {
    error = 'Please enter a valid card number';
  }
  
  const errorEl = input.nextElementSibling;
  if (error) {
    input.classList.add('error');
    if (errorEl && errorEl.classList.contains('form-error')) {
      errorEl.textContent = error;
      errorEl.style.display = 'block';
    }
    return false;
  } else {
    input.classList.remove('error');
    if (errorEl && errorEl.classList.contains('form-error')) {
      errorEl.style.display = 'none';
    }
    return true;
  }
}

function processCheckout() {
  // Show loading state
  const submitBtn = document.querySelector('#checkout-form button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = 'Processing...';
  
  // Simulate processing
  setTimeout(() => {
    clearCart();
    showSuccessModal();
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  }, 2000);
}

function showSuccessModal() {
  const modal = document.getElementById('success-modal');
  if (modal) {
    modal.classList.add('active');
    
    // Redirect to home after 3 seconds
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 3000);
  }
}

function updateCheckoutSummary() {
  const cart = getCart();
  const totals = calculateCartTotals(cart);
  
  const itemsContainer = document.getElementById('checkout-items');
  if (itemsContainer) {
    itemsContainer.innerHTML = cart.map(item => `
      <div class="checkout-item">
        <span>${item.name} × ${item.quantity}</span>
        <span>${formatCurrency(item.price * item.quantity)}</span>
      </div>
    `).join('');
  }
  
  const subtotalEl = document.getElementById('checkout-subtotal');
  const taxEl = document.getElementById('checkout-tax');
  const shippingEl = document.getElementById('checkout-shipping');
  const totalEl = document.getElementById('checkout-total');
  
  if (subtotalEl) subtotalEl.textContent = formatCurrency(totals.subtotal);
  if (taxEl) taxEl.textContent = formatCurrency(totals.tax);
  if (shippingEl) shippingEl.textContent = totals.shipping === 0 ? 'FREE' : formatCurrency(totals.shipping);
  if (totalEl) totalEl.textContent = formatCurrency(totals.total);
}

function setupStepNavigation() {
  // Simple step indicator (already styled with CSS)
  // Could be enhanced with actual multi-step form logic
}

// ==================== ABOUT PAGE ====================
function initializeAboutPage() {
  setupFAQ();
  setupContactForm();
}

function setupFAQ() {
  const container = document.getElementById('faq-accordion');
  if (!container) return;
  
  container.innerHTML = FAQ_ITEMS.map((item, index) => `
    <div class="accordion-item">
      <button class="accordion-header" data-index="${index}">
        ${item.question}
        <span class="accordion-icon">▼</span>
      </button>
      <div class="accordion-content">
        <div class="accordion-body">${item.answer}</div>
      </div>
    </div>
  `).join('');
  
  // Setup accordion handlers
  container.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const isActive = item.classList.contains('active');
      
      // Close all items
      container.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('active'));
      
      // Toggle current item
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

function setupContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Simulate submission
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    
    setTimeout(() => {
      alert('Thank you! Your message has been sent.');
      form.reset();
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }, 1000);
  });
}

// ==================== SHARED COMPONENTS ====================
function createProductCard(product) {
  return `
    <div class="card product-card" data-product-id="${product.id}">
      ${product.badges && product.badges.length > 0 ? `
        <div class="product-badge">${product.badges[0]}</div>
      ` : ''}
      
      <div class="product-image">
        ${createProductPlaceholder(product.name)}
      </div>
      
      <div class="product-info">
        <h3 class="product-name">${product.name}</h3>
        
        <div class="product-rating">
          <div class="stars">${renderStars(product.rating)}</div>
          <span>(${product.reviewCount})</span>
        </div>
        
        <div class="product-price">${formatCurrency(product.price)}</div>
        
        <button class="btn btn-primary btn-sm quick-add-btn" data-product-id="${product.id}">
          Add to Cart
        </button>
      </div>
    </div>
  `;
}

function createProductPlaceholder(name) {
  // Create a simple SVG placeholder with product initial
  const initial = name.charAt(0).toUpperCase();
  const colors = ['#f97316', '#8b5cf6', '#10b981', '#3b82f6', '#ef4444'];
  const color = colors[name.length % colors.length];
  
  return `
    <svg width="100%" height="100%" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" fill="${color}" opacity="0.1"/>
      <text x="50%" y="50%" font-size="80" font-weight="bold" fill="${color}" 
            text-anchor="middle" dominant-baseline="middle" opacity="0.3">
        ${initial}
      </text>
    </svg>
  `;
}

function attachProductCardHandlers(container, products) {
  // Card click handler
  container.querySelectorAll('.product-card').forEach((card, index) => {
    card.addEventListener('click', (e) => {
      if (!e.target.closest('.btn')) {
        window.location.href = `product.html?id=${products[index].id}`;
      }
    });
  });
  
  // Quick add button handler
  container.querySelectorAll('.quick-add-btn').forEach((btn, index) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      addToCart(products[index].id);
    });
  });
}

// ==================== ICON HELPERS ====================
function getCategoryIcon(iconName) {
  const icons = {
    grid: '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>',
    bag: '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>',
    shirt: '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/></svg>',
    device: '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',
    home: '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>'
  };
  return icons[iconName] || icons.grid;
}

function getFeatureIcon(iconName) {
  const icons = {
    truck: '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>',
    return: '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 14 4 9 9 4"/><path d="M20 20v-7a4 4 0 0 0-4-4H4"/></svg>',
    secure: '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
    support: '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>'
  };
  return icons[iconName] || '';
}

// ==================== MODAL HELPERS ====================
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Close modals on overlay click
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('active');
    document.body.style.overflow = '';
  }
});

// Close modals on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.active').forEach(modal => {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    });
  }
});
