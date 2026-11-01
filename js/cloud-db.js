/**
 * DeliverEase - Cloud Database Adapter (Firebase Firestore & Realtime Engine)
 * Connected to Firebase Project: deliverease-756ec
 * Cross-device realtime synchronization, live trip dispatch, and offline caching
 */

window.DeliverEase = window.DeliverEase || {};
window.TransLogix = window.DeliverEase;

const FIREBASE_CONFIG_KEY = 'deliverease_firebase_config';

const DEFAULT_FIREBASE_CONFIG = {
  apiKey: "AIzaSyDbcfiLViv4JjRJEgnfytpZ5CbeUjxr79c",
  authDomain: "deliverease-756ec.firebaseapp.com",
  projectId: "deliverease-756ec",
  storageBucket: "deliverease-756ec.firebasestorage.app",
  messagingSenderId: "63523845169",
  appId: "1:63523845169:web:e66ddc40d93a82ae151110",
  measurementId: "G-R9H5W7D6QR"
};

window.DeliverEase.cloudDB = {
  db: null,
  isLive: false,
  unsubscribers: [],

  init() {
    const config = this.loadConfig() || DEFAULT_FIREBASE_CONFIG;
    if (config && config.apiKey && config.projectId) {
      this.connect(config, false);
    }
  },

  loadConfig() {
    try {
      const stored = localStorage.getItem(FIREBASE_CONFIG_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      // fallback
    }
    return DEFAULT_FIREBASE_CONFIG;
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
      window.DeliverEase.ui.showToast('Disconnected from Cloud DB. Running in Local Mode.', 'warning');
    }
  },

  startRealtimeSync() {
    this.stopRealtimeSync();
    if (!this.db) return;

    try {
      // Seed cloud database if it is brand new
      this.db.collection('deliverease_bookings').limit(1).get().then(snapshot => {
        if (snapshot.empty) {
          const store = window.DeliverEase.store;
          if (store && store.state && store.state.bookings) {
            store.state.bookings.forEach(b => this.syncBooking(b));
          }
          if (store && store.state && store.state.spaceSharingPool) {
            store.state.spaceSharingPool.forEach(p => this.syncPool(p));
          }
        }
      }).catch(err => {
        console.warn('Initial cloud seed check warning:', err);
      });

      // 1. Listen for new bookings & status updates across devices
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
      pill.style.color = '#10b981';
      pill.style.fontWeight = '700';
    } else {
      pill.innerHTML = `<span style="width: 7px; height: 7px; border-radius: 50%; background: #64748b; display: inline-block;"></span> Cloud DB: Offline`;
      pill.style.background = 'var(--bg-subtle)';
      pill.style.borderColor = 'var(--border)';
      pill.style.color = 'var(--text-muted)';
    }
  },

  renderConfigModal() {
    const current = this.loadConfig() || DEFAULT_FIREBASE_CONFIG;
    return `
      <div class="modal-dialog">
        <div class="modal-header">
          <h3 class="card-title">☁️ Firebase Firestore Cloud Database</h3>
          <button class="modal-close-btn" onclick="window.DeliverEase.ui.closeModal()">✕</button>
        </div>
        <div class="modal-body">
          <div style="background: rgba(16, 185, 129, 0.12); border: 1px solid rgba(16, 185, 129, 0.3); padding: 0.85rem 1rem; border-radius: var(--radius-md); margin-bottom: 1rem; font-size: 0.8rem; line-height: 1.5; color: #065f46;">
            <strong>✨ Status:</strong> Connected to project <strong>${current.projectId}</strong>. Bookings, 50-50 space sharing, and driver trip milestones are synchronized in real-time across all devices.
          </div>

          <form id="cloudDbForm" onsubmit="window.DeliverEase.cloudDB.handleConfigSubmit(event)">
            <div class="form-group">
              <label class="form-label">Firebase Project ID</label>
              <input type="text" class="form-control" id="fbProjectId" placeholder="e.g. deliverease-756ec" value="${current.projectId || ''}" required />
            </div>

            <div class="form-group">
              <label class="form-label">Firebase API Key</label>
              <input type="text" class="form-control" id="fbApiKey" placeholder="e.g. AIzaSy..." value="${current.apiKey || ''}" required />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Auth Domain</label>
                <input type="text" class="form-control" id="fbAuthDomain" placeholder="deliverease-756ec.firebaseapp.com" value="${current.authDomain || ''}" />
              </div>
              <div class="form-group">
                <label class="form-label">App ID</label>
                <input type="text" class="form-control" id="fbAppId" placeholder="1:63523845169:web:..." value="${current.appId || ''}" />
              </div>
            </div>

            <div style="display: flex; gap: 0.75rem; margin-top: 1.25rem;">
              <button type="submit" class="btn btn-primary" style="flex: 1;">
                🔗 Reconnect / Update
              </button>
              <button type="button" class="btn btn-secondary btn-sm" onclick="window.DeliverEase.cloudDB.disconnect(); window.DeliverEase.ui.closeModal();">
                Run Offline
              </button>
            </div>
          </form>
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
