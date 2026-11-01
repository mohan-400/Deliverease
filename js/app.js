/**
 * DeliverEase - Master Application Coordinator (High-Performance Engine)
 * Implements smooth tab transitions, 0ms latency navigation, safe timer lifecycle,
 * and eliminates DOM thrashing / double re-renders.
 */

window.DeliverEase = window.DeliverEase || {};
window.TransLogix = window.DeliverEase;

window.DeliverEase.ui = {
  currentTab: 'booking', // 'booking' | 'spaceshare' | 'warehouse' | 'driver' | 'tracking' | 'payment'

  init() {
    this.renderHeader();
    this.renderNav();
    this.renderActiveTabOnly();
    this.renderDrawer();
    this.bindEvents();

    // Subscribe to store events for targeted updates (NO full page rebuilds!)
    window.DeliverEase.store.subscribe('booking:created', () => {
      this.updateHeaderProfile();
      if (this.currentTab === 'booking' || this.currentTab === 'driver' || this.currentTab === 'payment') {
        this.renderActiveTabOnly();
      }
    });

    window.DeliverEase.store.subscribe('trip:updated', () => {
      this.updateHeaderProfile();
      if (this.currentTab === 'driver' || this.currentTab === 'tracking' || this.currentTab === 'payment') {
        this.renderActiveTabOnly();
      }
    });

    window.DeliverEase.store.subscribe('role:changed', ({ role }) => {
      this.renderHeader();
      // Auto-navigate to the most relevant view for that role
      if (role === 'driver') {
        this.navigate('driver');
      } else if (role === 'organization') {
        this.navigate('warehouse');
      } else {
        this.navigate('booking');
      }
    });

    window.DeliverEase.store.subscribe('notification:added', (notif) => {
      this.updateNotifBadge();
      this.showToast(`${notif.title}: ${notif.message}`, notif.category === 'payment' ? 'success' : 'primary');
    });
  },

  renderApp() {
    this.renderHeader();
    this.renderNav();
    this.renderActiveTabOnly();
  },

  bindEvents() {
    // Close notification drawer when clicking outside
    document.addEventListener('click', (e) => {
      const drawer = document.getElementById('notifDrawer');
      const notifBtn = document.getElementById('notifToggleBtn');
      if (drawer && drawer.classList.contains('active')) {
        if (!drawer.contains(e.target) && !notifBtn.contains(e.target)) {
          drawer.classList.remove('active');
        }
      }
    });

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeModal();
      }
    });
  },

  navigate(tab) {
    if (this.currentTab === tab && document.getElementById('mainContentContainer').children.length > 0) {
      return;
    }

    // Stop previous tab timers if leaving tracking
    if (this.currentTab === 'tracking' && tab !== 'tracking') {
      if (window.DeliverEase.trackingModule && window.DeliverEase.trackingModule.stopSimulation) {
        window.DeliverEase.trackingModule.stopSimulation();
      }
    }

    this.currentTab = tab;
    this.updateNavActiveState();
    this.renderActiveTabOnly();
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Initialize tracking if entering tracking
    if (tab === 'tracking') {
      if (window.DeliverEase.trackingModule && window.DeliverEase.trackingModule.initMap) {
        setTimeout(() => window.DeliverEase.trackingModule.initMap(), 50);
      }
    }
  },

  renderHeader() {
    const store = window.DeliverEase.store;
    const user = store.getCurrentUser();
    const role = store.getState().currentUserRole;

    const roleContainer = document.getElementById('headerRoleSwitcher');
    if (roleContainer) {
      roleContainer.innerHTML = `
        <span class="role-label" style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700; margin-right: 0.25rem;">Role:</span>
        <button class="role-btn ${role === 'customer' ? 'active' : ''}" onclick="window.DeliverEase.store.setRole('customer')">
          📦 Shipper
        </button>
        <button class="role-btn ${role === 'driver' ? 'active' : ''}" onclick="window.DeliverEase.store.setRole('driver')">
          🚚 Driver (90% Payout)
        </button>
        <button class="role-btn ${role === 'organization' ? 'active' : ''}" onclick="window.DeliverEase.store.setRole('organization')">
          🏢 Enterprise
        </button>
      `;
    }

    this.updateHeaderProfile();
    this.updateNotifBadge();
  },

  updateHeaderProfile() {
    const user = window.DeliverEase.store.getCurrentUser();
    const profileEl = document.getElementById('headerUserProfile');
    if (profileEl) {
      profileEl.innerHTML = `
        <div class="user-avatar" style="width: 32px; height: 32px; border-radius: 50%; background: var(--primary); color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.8rem;">
          ${user.avatar}
        </div>
        <div class="user-info-text">
          <div class="user-name" style="font-weight: 700; font-size: 0.8rem; color: var(--secondary);">${user.name}</div>
          <div class="user-role-tag" style="font-size: 0.7rem; color: var(--text-muted);">${user.role.toUpperCase()} • ₹${(user.walletBalance || 0).toLocaleString('en-IN')}</div>
        </div>
      `;
    }
  },

  updateNotifBadge() {
    const notifs = window.DeliverEase.store.getState().notifications;
    const unreadCount = notifs.filter(n => !n.read).length;
    const badge = document.getElementById('notifBadgeDot');
    if (badge) {
      badge.style.display = unreadCount > 0 ? 'block' : 'none';
    }
  },

  renderNav() {
    const navBar = document.getElementById('moduleNavBar');
    if (!navBar) return;

    const tabs = [
      { id: 'booking', label: '📦 Freight Booking' },
      { id: 'spaceshare', label: '🤝 50–50 Space Share', badge: 'Save 50%' },
      { id: 'warehouse', label: '🏢 Hub & Return Loads' },
      { id: 'driver', label: '🚚 Driver Cockpit', badge: '90% Payout', badgeStyle: 'background: rgba(16, 185, 129, 0.2); color: #10b981;' },
      { id: 'tracking', label: '🛰️ Live GPS Radar' },
      { id: 'payment', label: '💳 Payments & 10% Fee' }
    ];

    navBar.innerHTML = `
      <div class="module-nav-inner">
        ${tabs.map(t => `
          <button class="nav-tab ${this.currentTab === t.id ? 'active' : ''}" id="nav_tab_${t.id}" onclick="window.DeliverEase.ui.navigate('${t.id}')">
            ${t.label} ${t.badge ? `<span class="nav-tab-badge" style="${t.badgeStyle || ''}">${t.badge}</span>` : ''}
          </button>
        `).join('')}
      </div>
    `;
  },

  updateNavActiveState() {
    document.querySelectorAll('.nav-tab').forEach(el => el.classList.remove('active'));
    const activeEl = document.getElementById('nav_tab_' + this.currentTab);
    if (activeEl) activeEl.classList.add('active');
  },

  renderActiveTabOnly() {
    const mainContainer = document.getElementById('mainContentContainer');
    if (!mainContainer) return;

    if (this.currentTab === 'booking') {
      mainContainer.innerHTML = window.DeliverEase.bookingModule.renderBookingView();
      window.DeliverEase.bookingModule.updateFareEstimate();
    } else if (this.currentTab === 'spaceshare') {
      mainContainer.innerHTML = window.DeliverEase.spaceSharingModule.renderSpaceSharingView();
    } else if (this.currentTab === 'warehouse') {
      mainContainer.innerHTML = window.DeliverEase.warehouseReturnModule.renderWarehouseReturnView();
    } else if (this.currentTab === 'driver') {
      mainContainer.innerHTML = window.DeliverEase.driverModule.renderDriverView();
    } else if (this.currentTab === 'tracking') {
      mainContainer.innerHTML = window.DeliverEase.trackingModule.renderTrackingView();
    } else if (this.currentTab === 'payment') {
      mainContainer.innerHTML = window.DeliverEase.paymentModule.renderPaymentView();
    }
  },

  renderDrawer() {
    const drawerContainer = document.getElementById('notifDrawerContainer');
    if (drawerContainer) {
      drawerContainer.innerHTML = window.DeliverEase.notificationsModule.renderNotificationDrawer();
    }
  },

  toggleNotifDrawer() {
    const drawer = document.getElementById('notifDrawer');
    if (drawer) {
      drawer.classList.toggle('active');
      if (drawer.classList.contains('active')) {
        this.renderDrawer();
      }
    }
  },

  openLoginModal() {
    this.openModal(window.DeliverEase.authModule.renderLoginModal());
  },

  openProfileModal() {
    this.openModal(window.DeliverEase.authModule.renderProfileModal());
  },

  openRegisterModal() {
    this.openModal(window.DeliverEase.authModule.renderRegisterModal());
  },

  openModal(contentHtml) {
    const overlay = document.getElementById('globalModalOverlay');
    const container = document.getElementById('globalModalContainer');
    if (overlay && container) {
      container.innerHTML = contentHtml;
      overlay.classList.add('active');
    }
  },

  closeModal() {
    const overlay = document.getElementById('globalModalOverlay');
    if (overlay) {
      overlay.classList.remove('active');
    }
  },

  showToast(message, type = 'primary', duration = 3500) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    // Limit maximum stacked toasts to 3 to prevent DOM clutter
    while (container.children.length >= 3) {
      container.removeChild(container.firstChild);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <span>${type === 'success' ? '✅' : type === 'warning' ? '⚠️' : type === 'danger' ? '❌' : 'ℹ️'}</span>
      <div style="flex: 1; font-size: 0.8rem; font-weight: 500;">${message}</div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.25s ease';
      setTimeout(() => toast.remove(), 250);
    }, duration);
  }
};

// Initialize when DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.DeliverEase.ui.init();
});
