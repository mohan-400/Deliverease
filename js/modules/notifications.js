/**
 * DeliverEase - Notification Module
 * Live toast alerts, in-app notification center, and SMS / Push simulated dispatch console (India Gateway)
 */

window.DeliverEase = window.DeliverEase || {};
window.TransLogix = window.DeliverEase;

window.DeliverEase.notificationsModule = {
  renderNotificationDrawer() {
    const store = window.DeliverEase.store;
    const notifs = store.getState().notifications;
    const unreadCount = notifs.filter(n => !n.read).length;

    return `
      <div class="notif-drawer" id="notifDrawer">
        <div class="notif-drawer-header">
          <div style="font-weight: 800; font-size: 0.95rem; color: var(--secondary); display: flex; align-items: center; gap: 0.4rem;">
            🔔 DeliverEase Alerts ${unreadCount > 0 ? `<span class="badge badge-danger">${unreadCount} New</span>` : ''}
          </div>
          <button class="btn btn-secondary btn-sm" onclick="window.DeliverEase.store.markAllNotificationsRead(); window.DeliverEase.ui.renderDrawer(); window.DeliverEase.ui.updateNotifBadge();">
            Mark Read
          </button>
        </div>

        <div class="notif-list">
          ${notifs.length === 0 ? `
            <div style="padding: 1.5rem; text-align: center; color: var(--text-muted); font-size: 0.8rem;">No notifications</div>
          ` : notifs.map(n => `
            <div class="notif-item ${n.read ? '' : 'unread'}" onclick="window.DeliverEase.notificationsModule.handleNotificationClick('${n.id}')">
              <div style="font-size: 1.25rem;">
                ${n.category === 'booking' ? '📦' : n.category === 'spaceshare' ? '🤝' : n.category === 'payment' ? '💵' : n.category === 'warehouse' ? '🏢' : n.category === 'driver' ? '🚚' : '🛰️'}
              </div>
              <div style="flex: 1;">
                <div class="notif-item-title">${n.title}</div>
                <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.15rem; line-height: 1.3;">${n.message}</div>
                <div class="notif-item-time">${n.time}</div>
              </div>
            </div>
          `).join('')}
        </div>

        <div style="padding: 0.75rem 1rem; border-top: 1px solid var(--border); background: var(--bg-subtle); display: flex; justify-content: space-between; align-items: center;">
          <span style="font-size: 0.75rem; color: var(--text-muted);">Indian SMS & Push Gateway Active</span>
          <button class="btn btn-secondary btn-sm" onclick="window.DeliverEase.notificationsModule.openSMSPreviewModal()">
            📱 SMS Log
          </button>
        </div>
      </div>
    `;
  },

  handleNotificationClick(notifId) {
    const notif = window.DeliverEase.store.getState().notifications.find(n => n.id === notifId);
    if (notif) {
      notif.read = true;
      window.DeliverEase.store.saveState();
      if (notif.category === 'spaceshare') {
        window.DeliverEase.ui.navigate('spaceshare');
      } else if (notif.category === 'payment') {
        window.DeliverEase.ui.navigate('payment');
      } else if (notif.category === 'driver') {
        window.DeliverEase.ui.navigate('driver');
      } else if (notif.category === 'warehouse') {
        window.DeliverEase.ui.navigate('warehouse');
      } else {
        window.DeliverEase.ui.navigate('tracking');
      }
    }
  },

  openSMSPreviewModal() {
    const store = window.DeliverEase.store;
    const user = store.getCurrentUser();
    const notifs = store.getState().notifications.slice(0, 5);

    const modalContent = `
      <div class="modal-dialog">
        <div class="modal-header">
          <h3 class="card-title">📱 Indian SMS & OTP Dispatch Preview</h3>
          <button class="modal-close-btn" onclick="window.DeliverEase.ui.closeModal()">✕</button>
        </div>
        <div class="modal-body">
          <div style="background: #0f172a; border-radius: var(--radius-lg); padding: 1.25rem; color: white; max-width: 380px; margin: 0 auto; border: 4px solid #334155;">
            <div style="text-align: center; border-bottom: 1px solid #1e293b; padding-bottom: 0.5rem; margin-bottom: 1rem;">
              <div style="font-size: 0.75rem; color: #94a3b8;">DELIVEREASE GATEWAY • VM-DELIVE</div>
              <div style="font-size: 0.85rem; font-weight: 700; color: #38bdf8;">Messages to: ${user.phone}</div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 0.75rem;">
              ${notifs.map(n => `
                <div style="background: #1e293b; border-radius: 12px; padding: 0.75rem; font-size: 0.8rem; border-left: 3px solid #38bdf8;">
                  <div style="font-weight: 700; color: #f8fafc; font-size: 0.75rem;">${n.title}</div>
                  <div style="color: #cbd5e1; margin-top: 0.2rem;">${n.message}</div>
                  <div style="font-size: 0.65rem; color: #64748b; margin-top: 0.35rem; text-align: right;">${n.time}</div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="window.DeliverEase.ui.closeModal()">Close</button>
        </div>
      </div>
    `;

    window.DeliverEase.ui.openModal(modalContent);
  }
};
