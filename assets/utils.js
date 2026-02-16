/**
 * Utility functions for the e-commerce store
 */

// Currency formatting
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}

// Get query parameter from URL
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// LocalStorage helpers
const Storage = {
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.error('Error reading from localStorage:', e);
      return defaultValue;
    }
  },
  
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error('Error writing to localStorage:', e);
      return false;
    }
  },
  
  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      console.error('Error removing from localStorage:', e);
      return false;
    }
  }
};

// Debounce function for search
function debounce(func, wait = 300) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Clamp number between min and max
function clamp(num, min, max) {
  return Math.min(Math.max(num, min), max);
}

// Generate unique ID
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Shuffle array (Fisher-Yates)
function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

// Calculate discount percentage
function calculateDiscount(originalPrice, salePrice) {
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
}

// Validate email
function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Validate credit card number (basic Luhn algorithm)
function isValidCardNumber(cardNumber) {
  const cleaned = cardNumber.replace(/\D/g, '');
  if (cleaned.length < 13 || cleaned.length > 19) return false;
  
  let sum = 0;
  let isEven = false;
  
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned.charAt(i), 10);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
}

// Format card number with spaces
function formatCardNumber(cardNumber) {
  const cleaned = cardNumber.replace(/\D/g, '');
  const chunks = cleaned.match(/.{1,4}/g);
  return chunks ? chunks.join(' ') : cleaned;
}

// Truncate text with ellipsis
function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength - 3) + '...';
}

// Scroll to top smoothly
function scrollToTop(behavior = 'smooth') {
  window.scrollTo({
    top: 0,
    behavior: behavior
  });
}

// Get random items from array
function getRandomItems(array, count) {
  const shuffled = shuffleArray(array);
  return shuffled.slice(0, count);
}

// Check if element is in viewport
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// Smooth scroll to element
function scrollToElement(element, offset = 0) {
  const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
  const offsetPosition = elementPosition - offset;
  
  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth'
  });
}

// Parse rating to stars HTML
function renderStars(rating, maxStars = 5) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = maxStars - fullStars - (hasHalfStar ? 1 : 0);
  
  let starsHTML = '';
  
  // Full stars
  for (let i = 0; i < fullStars; i++) {
    starsHTML += '<span class="star star-full">★</span>';
  }
  
  // Half star
  if (hasHalfStar) {
    starsHTML += '<span class="star star-half">★</span>';
  }
  
  // Empty stars
  for (let i = 0; i < emptyStars; i++) {
    starsHTML += '<span class="star star-empty">☆</span>';
  }
  
  return starsHTML;
}

// Calculate cart totals
function calculateCartTotals(cartItems) {
  const subtotal = cartItems.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0);
  
  const tax = subtotal * 0.08; // 8% tax
  const shipping = subtotal >= 100 ? 0 : 10; // Free shipping over $100
  const total = subtotal + tax + shipping;
  
  return {
    subtotal,
    tax,
    shipping,
    total,
    itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0)
  };
}

// Format date
function formatDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(date));
}

// Animate number counter
function animateNumber(element, start, end, duration = 1000) {
  const range = end - start;
  const increment = range / (duration / 16); // 60fps
  let current = start;
  
  const timer = setInterval(() => {
    current += increment;
    if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
      current = end;
      clearInterval(timer);
    }
    element.textContent = Math.round(current);
  }, 16);
}

// Deep clone object
function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

// Wait for specified time (Promise-based delay)
function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Check if user prefers reduced motion
function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
