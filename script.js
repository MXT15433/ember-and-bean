/**
 * Ember & Bean Specialty Coffee - Main Application Script
 * Handles navigation, cart state, accessible menu tabs, reservation form validation, and toast notifications.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ==========================================================================
  // 1. DOM Elements & State
  // ==========================================================================
  const header = document.getElementById('header');
  const menuToggle = document.getElementById('menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link, .mobile-nav-btn');
  const navLinks = document.querySelectorAll('.nav-link');

  // Cart Elements
  const cartBtn = document.getElementById('cart-btn');
  const cartCounter = document.getElementById('cart-counter');
  const cartDrawerBackdrop = document.getElementById('cart-drawer-backdrop');
  const cartDrawer = document.getElementById('cart-drawer');
  const closeCartBtn = document.getElementById('close-cart-btn');
  const cartItemsContainer = document.getElementById('cart-items-container');
  const drawerCountBadge = document.getElementById('drawer-count-badge');
  const cartSubtotalVal = document.getElementById('cart-subtotal-val');
  const checkoutBtn = document.getElementById('checkout-btn');
  const addToBagButtons = document.querySelectorAll('.add-to-bag-btn');

  // Menu Tab Elements
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  // Reservation Form Elements
  const resForm = document.getElementById('reservation-form');
  const resNameInput = document.getElementById('res-name');
  const resEmailInput = document.getElementById('res-email');
  const resDateInput = document.getElementById('res-date');
  const resTimeSelect = document.getElementById('res-time');
  const resPartySelect = document.getElementById('res-party');
  const resSeatingSelect = document.getElementById('res-seating');
  const submitResBtn = document.getElementById('submit-reservation');
  const resConfirmation = document.getElementById('reservation-confirmation');
  const resetResBtn = document.getElementById('reset-reservation-btn');

  // Confirmation detail targets
  const confirmName = document.getElementById('confirm-name');
  const confirmEmail = document.getElementById('confirm-email');
  const confirmDateTime = document.getElementById('confirm-datetime');
  const confirmParty = document.getElementById('confirm-party');
  const confirmCode = document.getElementById('confirm-code');

  // Newsletter Form Elements
  const newsletterForm = document.getElementById('newsletter-form');
  const newsletterEmail = document.getElementById('newsletter-email');
  const newsletterMsg = document.getElementById('newsletter-msg');

  // Toast Container
  const toastContainer = document.getElementById('toast-container');

  // Cart State Store
  let cart = [];

  // ==========================================================================
  // 2. Sticky Header & Active Scroll Spy
  // ==========================================================================
  const handleScroll = () => {
    if (window.scrollY > 25) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }

    // Scroll spy for active navigation item
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // ==========================================================================
  // 3. Mobile Navigation Drawer
  // ==========================================================================
  const toggleMobileMenu = (forceClose = false) => {
    const shouldOpen = forceClose ? false : !menuToggle.classList.contains('is-active');

    if (shouldOpen) {
      menuToggle.classList.add('is-active');
      menuToggle.setAttribute('aria-expanded', 'true');
      mobileNav.classList.add('is-open');
      mobileNav.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    } else {
      menuToggle.classList.remove('is-active');
      menuToggle.setAttribute('aria-expanded', 'false');
      mobileNav.classList.remove('is-open');
      mobileNav.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  };

  if (menuToggle) {
    menuToggle.addEventListener('click', () => toggleMobileMenu());
  }

  // Close mobile drawer when clicking any link
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      toggleMobileMenu(true);
    });
  });

  // ==========================================================================
  // 4. Toast Notification Utility
  // ==========================================================================
  const showToast = (title, message, isSuccess = true) => {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.setAttribute('role', 'status');

    const iconSvg = isSuccess 
      ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>`
      : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;

    toast.innerHTML = `
      <div class="toast-icon">${iconSvg}</div>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        <div class="toast-message">${message}</div>
      </div>
      <button class="toast-close" aria-label="Close notification">&times;</button>
    `;

    toastContainer.appendChild(toast);

    const closeBtn = toast.querySelector('.toast-close');
    const dismiss = () => {
      toast.classList.add('toast-leave');
      setTimeout(() => {
        if (toast.parentElement) toast.remove();
      }, 250);
    };

    closeBtn.addEventListener('click', dismiss);
    setTimeout(dismiss, 3800);
  };

  // ==========================================================================
  // 5. Cart Management & Live Counter
  // ==========================================================================
  const updateCartUI = () => {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Update Counter badge
    cartCounter.textContent = totalItems;
    drawerCountBadge.textContent = `${totalItems} ${totalItems === 1 ? 'bag' : 'bags'}`;
    cartSubtotalVal.textContent = `$${subtotal.toFixed(2)}`;

    // Bumping animation on header counter
    cartCounter.classList.remove('bump');
    void cartCounter.offsetWidth; // trigger reflow
    cartCounter.classList.add('bump');

    // Render Drawer Content
    if (cart.length === 0) {
      cartItemsContainer.innerHTML = `
        <div class="empty-cart-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#6E6259" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
          <p class="empty-text">Your bag is currently empty.</p>
          <a href="#roasts" class="btn btn-secondary btn-sm" id="shop-beans-empty-btn">Explore Roasts</a>
        </div>
      `;
      const shopBtn = document.getElementById('shop-beans-empty-btn');
      if (shopBtn) {
        shopBtn.addEventListener('click', () => closeCartDrawer());
      }
    } else {
      cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item-row" data-id="${item.id}">
          <div class="cart-item-thumb" aria-hidden="true">
            <svg width="24" height="30" viewBox="0 0 32 40" fill="none">
              <path d="M6 6L26 6L28 36H4L6 6Z" fill="#FAF7F2" stroke="#231A16" stroke-width="2"/>
              <rect x="9" y="14" width="14" height="12" rx="2" fill="#C85A32" opacity="0.3"/>
            </svg>
          </div>
          <div class="cart-item-info">
            <h4 class="cart-item-name">${item.name}</h4>
            <span class="cart-item-roast">${item.roast} • 250g</span>
            <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
          </div>
          <div class="cart-item-controls">
            <div class="qty-stepper">
              <button class="qty-btn dec-qty" data-id="${item.id}" aria-label="Decrease quantity of ${item.name}">−</button>
              <span class="qty-val">${item.quantity}</span>
              <button class="qty-btn inc-qty" data-id="${item.id}" aria-label="Increase quantity of ${item.name}">+</button>
            </div>
            <button class="remove-item-btn" data-id="${item.id}" aria-label="Remove ${item.name} from bag">Remove</button>
          </div>
        </div>
      `).join('');
    }
  };

  const addToCart = (product) => {
    const existingIndex = cart.findIndex(item => item.id === product.id);

    if (existingIndex > -1) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: parseFloat(product.price),
        roast: product.roast,
        quantity: 1
      });
    }

    updateCartUI();
    showToast('Added to Coffee Bag', `${product.name} (250g) was added to your bag.`);
  };

  // Add to Bag Button Listeners
  addToBagButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const product = {
        id: btn.dataset.id,
        name: btn.dataset.name,
        price: btn.dataset.price,
        roast: btn.dataset.roast || 'Artisan Roast'
      };

      addToCart(product);

      // Button interaction feedback
      const originalHTML = btn.innerHTML;
      btn.classList.add('added-state');
      btn.innerHTML = `
        <svg class="btn-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span>Added ✓</span>
      `;

      setTimeout(() => {
        btn.classList.remove('added-state');
        btn.innerHTML = originalHTML;
      }, 1600);
    });
  });

  // Drawer Item Quantity Actions (Delegation)
  cartItemsContainer.addEventListener('click', (e) => {
    const target = e.target;
    const itemId = target.dataset.id;
    if (!itemId) return;

    if (target.classList.contains('inc-qty')) {
      const item = cart.find(i => i.id === itemId);
      if (item) {
        item.quantity += 1;
        updateCartUI();
      }
    } else if (target.classList.contains('dec-qty')) {
      const item = cart.find(i => i.id === itemId);
      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1;
        } else {
          cart = cart.filter(i => i.id !== itemId);
        }
        updateCartUI();
      }
    } else if (target.classList.contains('remove-item-btn')) {
      cart = cart.filter(i => i.id !== itemId);
      updateCartUI();
      showToast('Item Removed', 'The coffee was removed from your bag.');
    }
  });

  // Drawer Open / Close Logic
  const openCartDrawer = () => {
    cartDrawerBackdrop.classList.add('is-open');
    cartDrawerBackdrop.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    cartDrawer.focus();
  };

  const closeCartDrawer = () => {
    cartDrawerBackdrop.classList.remove('is-open');
    cartDrawerBackdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    cartBtn.focus();
  };

  cartBtn.addEventListener('click', openCartDrawer);
  closeCartBtn.addEventListener('click', closeCartDrawer);
  cartDrawerBackdrop.addEventListener('click', (e) => {
    if (e.target === cartDrawerBackdrop) {
      closeCartDrawer();
    }
  });

  // Checkout button simulation
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (cart.length === 0) {
        showToast('Your Bag is Empty', 'Please select beans before checking out.', false);
        return;
      }
      showToast('Order Initialized', 'Preparing your roast-to-order batch checkout...', true);
      setTimeout(() => {
        alert('Thank you for choosing Ember & Bean! In a production deployment, this proceeds to Stripe / Shopify Checkout.');
        cart = [];
        updateCartUI();
        closeCartDrawer();
      }, 900);
    });
  }

  // ==========================================================================
  // 6. Interactive Cafe Menu Tabs (Accessible WAI-ARIA)
  // ==========================================================================
  tabButtons.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      switchTab(tab);
    });

    // Keyboard arrow navigation
    tab.addEventListener('keydown', (e) => {
      let targetIndex = null;
      if (e.key === 'ArrowRight') {
        targetIndex = (index + 1) % tabButtons.length;
      } else if (e.key === 'ArrowLeft') {
        targetIndex = (index - 1 + tabButtons.length) % tabButtons.length;
      }

      if (targetIndex !== null) {
        e.preventDefault();
        tabButtons[targetIndex].focus();
        switchTab(tabButtons[targetIndex]);
      }
    });
  });

  const switchTab = (activeTab) => {
    const targetPanelId = activeTab.getAttribute('aria-controls');

    tabButtons.forEach(btn => {
      const isActive = btn === activeTab;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
      btn.setAttribute('tabindex', isActive ? '0' : '-1');
    });

    tabPanels.forEach(panel => {
      if (panel.id === targetPanelId) {
        panel.classList.add('active');
        panel.removeAttribute('hidden');
      } else {
        panel.classList.remove('active');
        panel.setAttribute('hidden', '');
      }
    });
  };

  // ==========================================================================
  // 7. Visit Us & Table Reservation Form
  // ==========================================================================
  // Set minimum date to tomorrow
  if (resDateInput) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const dd = String(tomorrow.getDate()).padStart(2, '0');
    resDateInput.min = `${yyyy}-${mm}-${dd}`;
    resDateInput.value = `${yyyy}-${mm}-${dd}`;
  }

  // Helper validation
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const clearError = (inputEl, errorEl) => {
    inputEl.classList.remove('is-invalid');
    errorEl.textContent = '';
  };

  const setError = (inputEl, errorEl, message) => {
    inputEl.classList.add('is-invalid');
    errorEl.textContent = message;
  };

  // Real-time input clearing
  resNameInput.addEventListener('input', () => clearError(resNameInput, document.getElementById('name-error')));
  resEmailInput.addEventListener('input', () => clearError(resEmailInput, document.getElementById('email-error')));
  resDateInput.addEventListener('change', () => clearError(resDateInput, document.getElementById('date-error')));
  resTimeSelect.addEventListener('change', () => clearError(resTimeSelect, document.getElementById('time-error')));

  resForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    // Validate Name
    const nameVal = resNameInput.value.trim();
    if (!nameVal || nameVal.length < 2) {
      setError(resNameInput, document.getElementById('name-error'), 'Please enter your full name (at least 2 letters).');
      isValid = false;
    }

    // Validate Email
    const emailVal = resEmailInput.value.trim();
    if (!emailVal || !validateEmail(emailVal)) {
      setError(resEmailInput, document.getElementById('email-error'), 'Please enter a valid email address.');
      isValid = false;
    }

    // Validate Date
    if (!resDateInput.value) {
      setError(resDateInput, document.getElementById('date-error'), 'Please select a reservation date.');
      isValid = false;
    }

    // Validate Time
    if (!resTimeSelect.value) {
      setError(resTimeSelect, document.getElementById('time-error'), 'Please select your preferred time slot.');
      isValid = false;
    }

    if (!isValid) return;

    // Simulate submission with button spinner
    submitResBtn.classList.add('loading');
    submitResBtn.disabled = true;

    setTimeout(() => {
      submitResBtn.classList.remove('loading');
      submitResBtn.disabled = false;

      // Populate confirmation details
      confirmName.textContent = nameVal;
      confirmEmail.textContent = emailVal;
      
      const dateObj = new Date(resDateInput.value + 'T00:00:00');
      const dateFormatted = dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
      confirmDateTime.textContent = `${dateFormatted} at ${resTimeSelect.value}`;

      const partyText = resPartySelect.options[resPartySelect.selectedIndex].text;
      const seatingText = resSeatingSelect.options[resSeatingSelect.selectedIndex].text;
      confirmParty.textContent = `${partyText} • ${seatingText}`;

      // Random 4-digit code
      const randomId = Math.floor(1000 + Math.random() * 9000);
      confirmCode.textContent = `#EB-${randomId}`;

      // Hide form and show confirmation card
      resForm.style.display = 'none';
      resConfirmation.removeAttribute('hidden');

      showToast('Reservation Confirmed', `Table held for ${nameVal} on ${dateFormatted}.`);
    }, 850);
  });

  // Reset reservation to book another
  if (resetResBtn) {
    resetResBtn.addEventListener('click', () => {
      resForm.reset();
      if (resDateInput) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        resDateInput.value = tomorrow.toISOString().split('T')[0];
      }
      resConfirmation.setAttribute('hidden', '');
      resForm.style.display = 'flex';
      resNameInput.focus();
    });
  }

  // ==========================================================================
  // 8. Newsletter Signup
  // ==========================================================================
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = newsletterEmail.value.trim();

      if (!validateEmail(email)) {
        newsletterMsg.className = 'newsletter-feedback error';
        newsletterMsg.textContent = 'Please enter a valid email address.';
        newsletterEmail.focus();
        return;
      }

      newsletterMsg.className = 'newsletter-feedback success';
      newsletterMsg.textContent = 'Welcome! You’re on the dispatch list for next Tuesday’s roast drop.';
      newsletterEmail.value = '';
      showToast('Subscribed!', 'Welcome to the Ember & Bean Roast Dispatch list.');

      setTimeout(() => {
        newsletterMsg.textContent = '';
      }, 5000);
    });
  }

  // ==========================================================================
  // 9. Global Keyboard Accessibility (Escape key)
  // ==========================================================================
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (cartDrawerBackdrop.classList.contains('is-open')) {
        closeCartDrawer();
      }
      if (mobileNav.classList.contains('is-open')) {
        toggleMobileMenu(true);
      }
    }
  });

  // Current Year in Footer
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
});
