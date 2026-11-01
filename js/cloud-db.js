/**
 * DeliverEase - Cloud Database Adapter (Firebase Firestore & Realtime Engine)
 * Connects DeliverEase to Cloud Firestore for cross-device realtime synchronization.
 * Supports offline caching, live listeners for bookings and 50-50 sharing, and easy 1-click config.
 */

window.DeliverEase = window.DeliverEase || {};
window.TransLogix = window.DeliverEase;

const FIREBASE_CONFIG_KEY = 'deliverease_firebase_config';

window.DeliverEase.cloudDB = {
  db: null,
  isLive: false,
  unsubscribers: [],

  init() {
    const savedConfig = this.loadConfig();
    if (savedConfig && savedConfig.apiKey && savedConfig.projectId) {
      this.connect(savedConfig, false);
    }
  },

  loadConfig() {
    try {
      const stored = localStorage.getItem(FIREBASE_CONFIG_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  },

  saveConfig(config) {
    localStorage.setItem(FIREBASE_CONFIG_KEY, JSON.stringify(config));
  },

  clearConfig() {
    localStorage.removeItem(FIREBASE_CONFIG_KEY);
    this.disconnect();
  },

  connect(config, showToast = true) {
    if (typeof firebase === 'undefined') {
      console.warn('DeliverEase CloudDB: Firebase SDK not loaded, operating in local offline mode.');
      return false;
    }

    try {
      // Disconnect existing app if any
      if (firebase.apps && firebase.apps.length > 0) {
        firebase.app().delete();
      }

      firebase.initializeApp(config);
      this.db = firebase.firestore();
      this.isLive = true;
      this.saveConfig(config);

      // Start real-time listeners for multi-device sync
      this.startRealtimeSync();

      if (showToast && window.DeliverEase.ui) {
        window.DeliverEase.ui.showToast('Connected to Cloud Firestore in Realtime!', 'success');
      }
      this.updateCloudStatusPill();
      return true;
    } catch (err) {
      console.error('DeliverEase CloudDB connection error:', err);
      this.isLive = false;
      if (showToast && window.DeliverEase.ui) {
        window.DeliverEase.ui.showToast(`Connection failed: ${err.message}`, 'danger');
      }
      this.updateCloudStatusPill();
      return false;
    }
  },

  disconnect() {
    this.stopRealtimeSync();
    if (typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length > 0) {
      firebase.app().delete();
    }
    this.db = null;
    this.isLive = false;
    this.updateCloudStatusPill();
    if (window.DeliverEase.ui) {
      window.DeliverEase.ui.showToast('Disconnected from Cloud DB. Running in Local Offline Mode.', 'warning');
    }
  },

  startRealtimeSync() {
    this.stopRealtimeSync();
    if (!this.db) return;

    try {
      // 1. Listen for new bookings & status updates
      const unsubBookings = this.db.collection('deliverease_bookings')
        .onSnapshot((snapshot) => {
          snapshot.docChanges().forEach((change) => {
            const data = change.doc.data();
            const store = window.DeliverEase.store;
            if (!store) return;

            if (change.type === 'added') {
              const exists = store.state.bookings.some(b => b.id === data.id);
              if (!exists) {
                store.state.bookings.unshift(data);
                store.saveState();
                store.emit('booking:created', data);
              }
            } else if (change.type === 'modified') {
              const idx = store.state.bookings.findIndex(b => b.id === data.id);
              if (idx !== -1) {
                store.state.bookings[idx] = data;
                store.saveState();
                store.emit('trip:updated', data);
              }
            }
          });
        }, (err) => console.warn('Bookings listener warning:', err));

      this.unsubscribers.push(unsubBookings);

      // 2. Listen for 50-50 space sharing pool changes
      const unsubPools = this.db.collection('deliverease_pools')
        .onSnapshot((snapshot) => {
          snapshot.docChanges().forEach((change) => {
            const data = change.doc.data();
            const store = window.DeliverEase.store;
            if (!store) return;

            if (change.type === 'added') {
              const exists = store.state.spaceSharingPool.some(p => p.id === data.id);
              if (!exists) {
                store.state.spaceSharingPool.unshift(data);
                store.saveState();
                store.emit('spaceshare:created', data);
              }
            } else if (change.type === 'modified') {
              const idx = store.state.spaceSharingPool.findIndex(p => p.id === data.id);
              if (idx !== -1) {
                store.state.spaceSharingPool[idx] = data;
                store.saveState();
                store.emit('spaceshare:matched', { pool: data });
              }
            }
          });
        }, (err) => console.warn('Pools listener warning:', err));

      this.unsubscribers.push(unsubPools);

    } catch (e) {
      console.warn('Realtime sync setup warning:', e);
    }
  },

  stopRealtimeSync() {
    this.unsubscribers.forEach(unsub => {
      if (typeof unsub === 'function') unsub();
    });
    this.unsubscribers = [];
  },

  // --- Cloud Sync Actions ---

  async syncBooking(booking) {
    if (!this.isLive || !this.db) return;
    try {
      await this.db.collection('deliverease_bookings').doc(booking.id).set(booking, { merge: true });
    } catch (e) {
      console.warn('Cloud sync error for booking:', e);
    }
  },

  async syncPool(pool) {
    if (!this.isLive || !this.db) return;
    try {
      await this.db.collection('deliverease_pools').doc(pool.id).set(pool, { merge: true });
    } catch (e) {
      console.warn('Cloud sync error for pool:', e);
    }
  },

  async syncUser(user) {
    if (!this.isLive || !this.db) return;
    try {
      await this.db.collection('deliverease_users').doc(user.id).set(user, { merge: true });
    } catch (e) {
      console.warn('Cloud sync error for user:', e);
    }
  },

  updateCloudStatusPill() {
    const pill = document.getElementById('cloudStatusPill');
    if (!pill) return;
    if (this.isLive) {
      pill.innerHTML = `<span style="width: 7px; height: 7px; border-radius: 50%; background: #10b981; display: inline-block;"></span> Cloud DB: Live`;
      pill.style.background = 'rgba(16, 185, 129, 0.15)';
      pill.style.borderColor = 'rgba(16, 185, 129, 0.3)';
      pill.style.color = '#34d399';
    } else {
      pill.innerHTML = `<span style="width: 7px; height: 7px; border-radius: 50%; background: #64748b; display: inline-block;"></span> Cloud DB: Local`;
      pill.style.background = 'var(--bg-subtle)';
      pill.style.borderColor = 'var(--border)';
      pill.style.color = 'var(--text-muted)';
    }
  },

  renderConfigModal() {
    const current = this.loadConfig() || {};
    return `
      <div class="modal-dialog">
        <div class="modal-header">
          <h3 class="card-title">☁️ Connect Cloud Database (Firebase / Firestore)</h3>
          <button class="modal-close-btn" onclick="window.DeliverEase.ui.closeModal()">✕</button>
        </div>
        <div class="modal-body">
          <div style="background: var(--bg-subtle); padding: 1rem; border-radius: var(--radius-md); margin-bottom: 1rem; font-size: 0.8rem; line-height: 1.5;">
            <strong>✨ Real-Time Multi-Device Sync:</strong> Connecting Firebase allows multiple phones, drivers, and shippers to see live bookings and GPS updates in real-time on GitHub Pages!
          </div>

          <form id="cloudDbForm" onsubmit="window.DeliverEase.cloudDB.handleConfigSubmit(event)">
            <div class="form-group">
              <label class="form-label">Firebase Project ID</label>
              <input type="text" class="form-control" id="fbProjectId" placeholder="e.g. deliverease-app" value="${current.projectId || ''}" required />
            </div>

            <div class="form-group">
              <label class="form-label">Firebase API Key</label>
              <input type="text" class="form-control" id="fbApiKey" placeholder="e.g. AIzaSyD..." value="${current.apiKey || ''}" required />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Auth Domain (Optional)</label>
                <input type="text" class="form-control" id="fbAuthDomain" placeholder="deliverease-app.firebaseapp.com" value="${current.authDomain || ''}" />
              </div>
              <div class="form-group">
                <label class="form-label">App ID (Optional)</label>
                <input type="text" class="form-control" id="fbAppId" placeholder="1:123456789:web:abcdef" value="${current.appId || ''}" />
              </div>
            </div>

            <div style="display: flex; gap: 0.75rem; margin-top: 1.25rem;">
              <button type="submit" class="btn btn-primary" style="flex: 1;">
                🔗 Save & Connect Cloud DB
              </button>
              ${this.isLive ? `
                <button type="button" class="btn btn-danger btn-sm" onclick="window.DeliverEase.cloudDB.clearConfig(); window.DeliverEase.ui.closeModal();">
                  Disconnect
                </button>
              ` : ''}
            </div>
          </form>

          <div style="margin-top: 1.25rem; padding-top: 1rem; border-top: 1px solid var(--border); font-size: 0.75rem; color: var(--text-muted);">
            <strong>How to get free Firebase keys (Takes 2 mins):</strong><br>
            1. Open <a href="https://console.firebase.google.com/" target="_blank" style="color: var(--primary);">console.firebase.google.com</a> & click <strong>Add project</strong>.<br>
            2. In project settings, click <strong>Add web app (&lt;/&gt;)</strong> and copy your config object.<br>
            3. Under <strong>Build > Firestore Database</strong>, click <strong>Create database</strong> in Test Mode.
          </div>
        </div>
      </div>
    `;
  },

  handleConfigSubmit(e) {
    e.preventDefault();
    const config = {
      projectId: document.getElementById('fbProjectId').value.trim(),
      apiKey: document.getElementById('fbApiKey').value.trim(),
      authDomain: document.getElementById('fbAuthDomain') ? document.getElementById('fbAuthDomain').value.trim() : '',
      appId: document.getElementById('fbAppId') ? document.getElementById('fbAppId').value.trim() : ''
    };

    const ok = this.connect(config, true);
    if (ok) {
      window.DeliverEase.ui.closeModal();
    }
  }
};
