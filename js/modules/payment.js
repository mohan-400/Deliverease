/**
 * DeliverEase - Payment & Commission Module
 * Implements strict 10% Platform Commission model, escrow ledger, driver 90% earnings breakdown, GST e-receipts in INR (₹)
 */

window.DeliverEase = window.DeliverEase || {};
window.TransLogix = window.DeliverEase;

window.DeliverEase.paymentModule = {
  renderPaymentView() {
    const store = window.DeliverEase.store;
    const user = store.getCurrentUser();
    const state = store.getState();
    const txns = state.transactions;

    return `
      <div class="view-header">
        <div class="view-title-group">
          <h1>💳 DeliverEase Payments & 10% Commission Engine</h1>
          <div class="view-subtitle">Transparent automated escrow settlements in INR (₹) with industry-low 10% platform commission fee</div>
        </div>
        <div class="view-actions">
          <button class="btn btn-primary" onclick="window.DeliverEase.paymentModule.openTopupModal()">
            ➕ Add Funds to Wallet (UPI / NetBanking)
          </button>
        </div>
      </div>

      <!-- 10% Commission Highlight Showcase Banner -->
      <div class="card" style="margin-bottom: 1.5rem; background: #0f172a; color: white;">
        <div class="grid-2" style="align-items: center;">
          <div>
            <span class="badge badge-success" style="background: rgba(16, 185, 129, 0.2); color: #34d399;">INDIAN FLEET EMPOWERMENT</span>
            <h2 style="color: white; font-size: 1.35rem; margin-top: 0.35rem;">How DeliverEase 10% Model Saves Transporters & Drivers</h2>
            <p style="color: #94a3b8; font-size: 0.85rem; margin-top: 0.35rem;">
              Traditional transport brokers (dalals) in Indian mandis and transport nagars take 25% to 35% in hidden cuts. DeliverEase automates load-matching on a single unified cloud database, charging only <strong>10%</strong> so drivers retain <strong>90% of trip revenue</strong>.
            </p>
          </div>

          <!-- Side-by-Side Comparison Box -->
          <div style="background: #1e293b; border-radius: var(--radius-md); padding: 1rem; border: 1px solid #334155;">
            <div style="font-size: 0.8rem; font-weight: 700; color: #94a3b8; margin-bottom: 0.5rem; text-transform: uppercase;">
              On a Standard ₹50,000 Highway Freight Run:
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
              <div style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 6px; padding: 0.75rem; text-align: center;">
                <div style="font-size: 0.7rem; color: #fca5a5;">Traditional Broker (30%)</div>
                <div style="font-size: 1.25rem; font-weight: 800; color: #f87171;">₹35,000</div>
                <div style="font-size: 0.65rem; color: #fca5a5;">Broker cuts ₹15,000</div>
              </div>

              <div style="background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.4); border-radius: 6px; padding: 0.75rem; text-align: center;">
                <div style="font-size: 0.7rem; color: #86efac;">DeliverEase (10% Model)</div>
                <div style="font-size: 1.25rem; font-weight: 800; color: #34d399;">₹45,000</div>
                <div style="font-size: 0.65rem; color: #86efac;">+ ₹10,000 EXTRA for Driver</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Financial Statistics -->
      <div class="grid-4" style="margin-bottom: 1.5rem;">
        <div class="stat-card">
          <div>
            <div class="stat-label">Your Wallet Balance</div>
            <div class="stat-value" style="color: var(--primary);">₹${(user.walletBalance || 48500).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
            <div class="stat-delta positive">${user.role.toUpperCase()} Account</div>
          </div>
          <div class="stat-icon-wrapper" style="background: var(--primary-light); color: var(--primary);">💼</div>
        </div>

        <div class="stat-card">
          <div>
            <div class="stat-label">Platform Gross Volume (GMV)</div>
            <div class="stat-value">₹24,82,400</div>
            <div class="stat-delta positive">↑ 18.2% across Indian hubs</div>
          </div>
          <div class="stat-icon-wrapper" style="background: var(--accent-emerald-light); color: var(--accent-emerald);">📈</div>
        </div>

        <div class="stat-card">
          <div>
            <div class="stat-label">10% Platform Fee Earned</div>
            <div class="stat-value" style="color: var(--accent-amber);">₹2,48,240</div>
            <div class="stat-delta">Strict 10% Flat Model</div>
          </div>
          <div class="stat-icon-wrapper" style="background: var(--accent-amber-light); color: var(--accent-amber);">🏷️</div>
        </div>

        <div class="stat-card">
          <div>
            <div class="stat-label">Driver Payouts Distributed</div>
            <div class="stat-value" style="color: var(--accent-emerald);">₹22,34,160</div>
            <div class="stat-delta positive">90% Retained by Fleet</div>
          </div>
          <div class="stat-icon-wrapper" style="background: var(--bg-subtle); color: var(--secondary);">🚚</div>
        </div>
      </div>

      <!-- Financial Transactions Ledger -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">📜 Unified Financial Ledger & Escrow Records (INR)</h3>
          <span class="badge badge-primary">${txns.length} Transactions</span>
        </div>

        <div class="table-responsive">
          <table class="custom-table">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Booking Ref</th>
                <th>Description</th>
                <th>Gross Total (₹)</th>
                <th>DeliverEase Fee (10%)</th>
                <th>Driver Payout (90%)</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${txns.map(t => `
                <tr>
                  <td><code>${t.id}</code></td>
                  <td><strong>${t.bookingId}</strong></td>
                  <td>${t.description}</td>
                  <td><strong>₹${t.grossAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong></td>
                  <td style="color: var(--accent-amber);">₹${t.platformFee.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                  <td style="color: var(--accent-emerald); font-weight: 700;">₹${t.driverNetPayout.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                  <td>
                    <span class="badge ${t.status.includes('Escrow') ? 'badge-warning' : 'badge-success'}">
                      ${t.status}
                    </span>
                  </td>
                  <td>
                    <button class="btn btn-secondary btn-sm" onclick="window.DeliverEase.paymentModule.openReceiptModal('${t.id}')">
                      📄 GST Receipt
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  openReceiptModal(txnId) {
    const txn = window.DeliverEase.store.getState().transactions.find(t => t.id === txnId) || window.DeliverEase.store.getState().transactions[0];
    const booking = window.DeliverEase.store.getState().bookings.find(b => b.id === txn.bookingId) || window.DeliverEase.store.getState().bookings[0];

    const modalContent = `
      <div class="modal-dialog">
        <div class="modal-header">
          <h3 class="card-title">📄 DeliverEase Official GST Freight Receipt</h3>
          <button class="modal-close-btn" onclick="window.DeliverEase.ui.closeModal()">✕</button>
        </div>
        <div class="modal-body" id="printableReceipt">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid var(--border); padding-bottom: 1rem; margin-bottom: 1.25rem;">
            <div>
              <div style="font-size: 1.25rem; font-weight: 800; color: var(--secondary);">DeliverEase Technologies India Pvt Ltd</div>
              <div style="font-size: 0.75rem; color: var(--text-muted);">GSTIN: 27AABCT8841M1ZX • CIN: U63090MH2024PTC392811</div>
            </div>
            <div style="text-align: right;">
              <div style="font-weight: 800; font-size: 0.9rem;">Invoice: ${txn.id}</div>
              <div style="font-size: 0.75rem; color: var(--text-muted);">Date: ${txn.date}</div>
            </div>
          </div>

          <div style="background: var(--bg-subtle); padding: 0.85rem; border-radius: var(--radius-md); margin-bottom: 1rem; font-size: 0.85rem;">
            <div><strong>Shipment:</strong> ${booking.id} (${booking.origin} ➔ ${booking.destination})</div>
            <div><strong>Shipper:</strong> ${booking.customerName} • <strong>Driver:</strong> ${booking.driverName}</div>
            <div><strong>Cargo:</strong> ${booking.cargoType} (${booking.weightKg.toLocaleString('en-IN')} kg)</div>
          </div>

          <div style="font-size: 0.85rem; line-height: 1.8;">
            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border); padding-bottom: 0.25rem;">
              <span>Total Gross Freight (INR):</span>
              <span>₹${txn.grossAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border); padding: 0.25rem 0; color: var(--text-muted);">
              <span>DeliverEase Platform Commission (10% Model):</span>
              <span>-₹${txn.platformFee.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
            <div style="display: flex; justify-content: space-between; border-bottom: 2px solid var(--secondary); padding: 0.5rem 0; font-size: 1.05rem; font-weight: 800; color: var(--accent-emerald);">
              <span>Driver Net Earnings (90%):</span>
              <span>₹${txn.driverNetPayout.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>

          <div style="margin-top: 1.25rem; font-size: 0.75rem; color: var(--text-muted); text-align: center;">
            🔒 Escrow Protected & Verified by DeliverEase Digital Settlement Protocol (India)
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="window.DeliverEase.ui.closeModal()">Close</button>
          <button class="btn btn-primary" onclick="window.print()">🖨️ Print / Save GST PDF</button>
        </div>
      </div>
    `;

    window.DeliverEase.ui.openModal(modalContent);
  },

  openTopupModal() {
    const modalContent = `
      <div class="modal-dialog">
        <div class="modal-header">
          <h3 class="card-title">💳 DeliverEase Wallet Top-Up (Escrow Deposit)</h3>
          <button class="modal-close-btn" onclick="window.DeliverEase.ui.closeModal()">✕</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">Deposit Amount (₹ INR)</label>
            <input type="number" class="form-control" id="topupAmount" value="25000" min="1000" step="1000" required />
          </div>
          <div class="form-group">
            <label class="form-label">Payment Method (India)</label>
            <select class="form-select">
              <option>UPI / Google Pay / PhonePe / Paytm (Instant)</option>
              <option>NetBanking (HDFC / ICICI / SBI / Axis)</option>
              <option>Corporate Credit / Debit Card (RuPay / Visa / Master)</option>
              <option>NEFT / RTGS Wire Transfer</option>
            </select>
          </div>

          <button class="btn btn-primary btn-full" onclick="window.DeliverEase.paymentModule.handleTopup()" style="margin-top: 1rem;">
            Deposit Funds to DeliverEase Wallet
          </button>
        </div>
      </div>
    `;

    window.DeliverEase.ui.openModal(modalContent);
  },

  handleTopup() {
    const amount = parseFloat(document.getElementById('topupAmount').value);
    const user = window.DeliverEase.store.getCurrentUser();

    if (isNaN(amount) || amount <= 0) {
      window.DeliverEase.ui.showToast('Invalid top-up amount', 'danger');
      return;
    }

    user.walletBalance = (user.walletBalance || 0) + amount;
    window.DeliverEase.store.saveState();

    window.DeliverEase.ui.closeModal();
    window.DeliverEase.ui.showToast(`₹${amount.toLocaleString('en-IN')} added to your DeliverEase wallet!`, 'success');
    window.DeliverEase.ui.renderApp();
  }
};
