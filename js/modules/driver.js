/**
 * DeliverEase - Driver Management Module
 * Load board, trip lifecycle execution (Pickup -> In-Transit -> Delivery e-POD), and 90% net earnings payout hub in INR (₹)
 */

window.DeliverEase = window.DeliverEase || {};
window.TransLogix = window.DeliverEase;

window.DeliverEase.driverModule = {
  renderDriverView() {
    const store = window.DeliverEase.store;
    const user = store.getCurrentUser();
    const state = store.getState();
    
    // Find active trip for this driver
    const activeTrip = state.bookings.find(b => 
      (b.driverId === user.id || b.driverName === user.name) && 
      b.status !== 'Delivered'
    ) || state.bookings.find(b => b.status === 'In-Transit');

    const availableJobs = state.bookings.filter(b => 
      b.status === 'Pending' || (!b.driverId && b.status !== 'Delivered')
    );

    return `
      <div class="view-header">
        <div class="view-title-group">
          <h1>🚚 Driver Cockpit & Load Marketplace</h1>
          <div class="view-subtitle">Accept freight runs, manage trip milestones in real-time, and retain 90% of all trip earnings with our low 10% commission model</div>
        </div>
        <div class="view-actions">
          <div class="user-profile-badge">
            <div class="user-avatar" style="background: var(--accent-emerald);">GS</div>
            <div class="user-info-text">
              <div class="user-name">${user.name}</div>
              <div class="user-role-tag">Status: <strong>${user.status || 'Active'}</strong></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Driver Stat Badges -->
      <div class="grid-4" style="margin-bottom: 1.5rem;">
        <div class="stat-card">
          <div>
            <div class="stat-label">Driver Net Balance (90%)</div>
            <div class="stat-value" style="color: var(--accent-emerald);">₹${(user.walletBalance || 92450).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
            <div class="stat-delta positive">Instant UPI / IMPS Withdrawal Ready</div>
          </div>
          <div class="stat-icon-wrapper" style="background: var(--accent-emerald-light); color: var(--accent-emerald);">💵</div>
        </div>

        <div class="stat-card">
          <div>
            <div class="stat-label">Platform Commission Rate</div>
            <div class="stat-value" style="color: var(--primary);">10%</div>
            <div class="stat-delta positive">Save 20% vs traditional dalals/brokers</div>
          </div>
          <div class="stat-icon-wrapper" style="background: var(--primary-light); color: var(--primary);">🏷️</div>
        </div>

        <div class="stat-card">
          <div>
            <div class="stat-label">Completed Deliveries</div>
            <div class="stat-value">${user.completedTrips || 188}</div>
            <div class="stat-delta positive">⭐ 4.96 Rating</div>
          </div>
          <div class="stat-icon-wrapper" style="background: var(--accent-amber-light); color: var(--accent-amber);">🏆</div>
        </div>

        <div class="stat-card">
          <div>
            <div class="stat-label">Registered Vehicle</div>
            <div class="stat-value" style="font-size: 1.1rem; margin-top: 0.5rem;">${user.vehicleName || 'Eicher Pro 24ft'}</div>
            <div class="stat-delta">Plate: ${user.plateNumber || 'MH-04-AB-4821'}</div>
          </div>
          <div class="stat-icon-wrapper" style="background: var(--bg-subtle); color: var(--secondary);">🚛</div>
        </div>
      </div>

      <div class="grid-3-sidebar-layout">
        <!-- Active Trip Execution Console -->
        <div>
          ${activeTrip ? `
            <div class="card" style="border: 2px solid var(--primary); margin-bottom: 1.5rem;">
              <div class="card-header" style="background: var(--primary-light); margin: -1.5rem -1.5rem 1.25rem -1.5rem; padding: 1rem 1.5rem;">
                <div>
                  <span class="badge badge-primary">ACTIVE HIGHWAY RUN IN PROGRESS</span>
                  <h3 class="card-title" style="margin-top: 0.25rem; color: var(--primary-hover);">
                    Trip ${activeTrip.id}: ${activeTrip.origin.split(',')[0]} ➔ ${activeTrip.destination.split(',')[0]}
                  </h3>
                </div>
                <div style="text-align: right;">
                  <div style="font-size: 0.75rem; color: var(--text-muted);">Driver Net Payout (90%)</div>
                  <div style="font-size: 1.35rem; font-weight: 800; color: var(--accent-emerald);">₹${activeTrip.driverEarnings.toLocaleString('en-IN')}</div>
                </div>
              </div>

              <!-- Milestone Timeline Progress -->
              <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.5rem; margin-bottom: 1.25rem; text-align: center;">
                <div style="padding: 0.5rem; border-radius: var(--radius-sm); background: ${['Assigned', 'Picked-Up', 'In-Transit', 'Delivered'].includes(activeTrip.status) ? 'var(--primary-light)' : 'var(--bg-subtle)'}; color: ${['Assigned', 'Picked-Up', 'In-Transit', 'Delivered'].includes(activeTrip.status) ? 'var(--primary)' : 'var(--text-muted)'}; font-weight: 700; font-size: 0.75rem;">
                  1. Assigned
                </div>
                <div style="padding: 0.5rem; border-radius: var(--radius-sm); background: ${['Picked-Up', 'In-Transit', 'Delivered'].includes(activeTrip.status) ? 'var(--primary-light)' : 'var(--bg-subtle)'}; color: ${['Picked-Up', 'In-Transit', 'Delivered'].includes(activeTrip.status) ? 'var(--primary)' : 'var(--text-muted)'}; font-weight: 700; font-size: 0.75rem;">
                  2. Cargo Loaded
                </div>
                <div style="padding: 0.5rem; border-radius: var(--radius-sm); background: ${['In-Transit', 'Delivered'].includes(activeTrip.status) ? 'var(--primary-light)' : 'var(--bg-subtle)'}; color: ${['In-Transit', 'Delivered'].includes(activeTrip.status) ? 'var(--primary)' : 'var(--text-muted)'}; font-weight: 700; font-size: 0.75rem;">
                  3. In Transit (GPS)
                </div>
                <div style="padding: 0.5rem; border-radius: var(--radius-sm); background: ${activeTrip.status === 'Delivered' ? 'var(--accent-emerald-light)' : 'var(--bg-subtle)'}; color: ${activeTrip.status === 'Delivered' ? 'var(--accent-emerald)' : 'var(--text-muted)'}; font-weight: 700; font-size: 0.75rem;">
                  4. Delivered (POD)
                </div>
              </div>

              <!-- Live Telemetry Status Details -->
              <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; background: var(--bg-subtle); padding: 1rem; border-radius: var(--radius-md); font-size: 0.85rem; margin-bottom: 1.25rem;">
                <div>
                  <span style="color: var(--text-muted); font-size: 0.75rem;">Shipper / Cargo:</span>
                  <div style="font-weight: 700;">${activeTrip.customerName} (${activeTrip.cargoType})</div>
                </div>
                <div>
                  <span style="color: var(--text-muted); font-size: 0.75rem;">Gross Trip Fare:</span>
                  <div style="font-weight: 700;">₹${activeTrip.grossFare.toLocaleString('en-IN')} (Fee 10%: ₹${activeTrip.platformFee.toLocaleString('en-IN')})</div>
                </div>
                <div>
                  <span style="color: var(--text-muted); font-size: 0.75rem;">Delivery Security Code:</span>
                  <div style="font-weight: 800; color: var(--primary);">OTP: ${activeTrip.podOtp}</div>
                </div>
              </div>

              <!-- Action Workflow Buttons for Driver -->
              <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; justify-content: flex-end;">
                ${activeTrip.status === 'Assigned' ? `
                  <button class="btn btn-primary" onclick="window.DeliverEase.driverModule.handleUpdateStatus('${activeTrip.id}', 'Picked-Up')">
                    📦 Confirm Cargo Loaded & E-Way Bill Verified
                  </button>
                ` : activeTrip.status === 'Picked-Up' ? `
                  <button class="btn btn-primary" onclick="window.DeliverEase.driverModule.handleUpdateStatus('${activeTrip.id}', 'In-Transit')">
                    🛣️ Depart Hub & Start Live GPS Radar
                  </button>
                ` : activeTrip.status === 'In-Transit' ? `
                  <button class="btn btn-emerald" onclick="window.DeliverEase.driverModule.openDeliveryModal('${activeTrip.id}')">
                    ✅ Arrived: Complete Delivery (Verify OTP)
                  </button>
                ` : `
                  <span class="badge badge-success">Delivered & Settled</span>
                `}
                <button class="btn btn-secondary" onclick="window.DeliverEase.trackingModule.currentActiveTrackingCode = '${activeTrip.id}'; window.DeliverEase.ui.navigate('tracking');">
                  🗺️ Open Live GPS Radar Map
                </button>
              </div>
            </div>
          ` : `
            <div class="card" style="text-align: center; padding: 2.5rem; margin-bottom: 1.5rem;">
              <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">🚚</div>
              <h3>No Active Trip Currently Assigned</h3>
              <p style="margin-top: 0.25rem;">Browse the Load Marketplace below and claim a shipment to start earning 90% net payout.</p>
            </div>
          `}

          <!-- Open Load Marketplace -->
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">📋 Open Load Board (Available Freight Jobs)</h3>
              <span class="badge badge-primary">${availableJobs.length} Loads Available</span>
            </div>

            <div style="display: flex; flex-direction: column; gap: 1rem;">
              ${availableJobs.length === 0 ? `
                <div style="text-align: center; color: var(--text-muted); padding: 1.5rem;">All network loads currently assigned to active drivers.</div>
              ` : availableJobs.map(job => `
                <div style="border: 1px solid var(--border); border-radius: var(--radius-md); padding: 1rem; background: var(--bg-card); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
                  <div>
                    <div style="font-weight: 800; font-size: 1.05rem; color: var(--secondary);">
                      ${job.origin.split(',')[0]} ➔ ${job.destination.split(',')[0]}
                    </div>
                    <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.2rem;">
                      Cargo: <strong>${job.cargoType}</strong> (${job.weightKg.toLocaleString('en-IN')} kg) • Vehicle: <strong>${job.vehicleName}</strong>
                      ${job.isSpaceShared ? '<span class="badge badge-primary" style="margin-left: 0.4rem;">50-50 Shared</span>' : ''}
                      ${job.isReturnTrip ? '<span class="badge badge-warning" style="margin-left: 0.4rem;">Return Backhaul</span>' : ''}
                    </div>
                  </div>

                  <div style="text-align: right; display: flex; align-items: center; gap: 1rem;">
                    <div>
                      <div style="font-size: 0.7rem; color: var(--text-muted);">Your Net 90% Payout</div>
                      <div style="font-size: 1.25rem; font-weight: 800; color: var(--accent-emerald);">₹${job.driverEarnings.toLocaleString('en-IN')}</div>
                      <div style="font-size: 0.65rem; color: var(--text-muted);">Total Gross: ₹${job.grossFare.toLocaleString('en-IN')}</div>
                    </div>
                    <button class="btn btn-primary btn-sm" onclick="window.DeliverEase.driverModule.handleAcceptJob('${job.id}')">
                      ⚡ Accept Load
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Right Side Payout & Wallet Management -->
        <div>
          <div class="card" style="position: sticky; top: 120px;">
            <div class="card-header">
              <h3 class="card-title">💳 Driver Earnings & Wallet</h3>
            </div>

            <div style="background: var(--bg-subtle); padding: 1.25rem; border-radius: var(--radius-md); margin-bottom: 1rem;">
              <div style="font-size: 0.8rem; color: var(--text-muted);">Available Net Balance</div>
              <div style="font-size: 2rem; font-weight: 800; color: var(--secondary); margin: 0.25rem 0;">
                ₹${(user.walletBalance || 92450).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
              <div style="font-size: 0.75rem; color: var(--accent-emerald); font-weight: 600;">
                ✓ 90% Net Settled to Driver Account
              </div>
            </div>

            <div style="margin-bottom: 1.25rem; font-size: 0.8rem; line-height: 1.6;">
              <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border); padding-bottom: 0.4rem;">
                <span style="color: var(--text-muted);">Platform Commission:</span>
                <strong>10% Flat Rate</strong>
              </div>
              <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border); padding: 0.4rem 0;">
                <span style="color: var(--text-muted);">Payout Frequency:</span>
                <strong>Instant on OTP Delivery</strong>
              </div>
              <div style="display: flex; justify-content: space-between; padding-top: 0.4rem;">
                <span style="color: var(--text-muted);">Bank Account / UPI:</span>
                <strong>HDFC Bank (...4821) / gurdeep@okhdfc</strong>
              </div>
            </div>

            <button class="btn btn-emerald btn-full" onclick="window.DeliverEase.driverModule.openPayoutModal()">
              💸 Instant UPI / Bank Withdrawal
            </button>
          </div>
        </div>
      </div>
    `;
  },

  handleAcceptJob(jobId) {
    window.DeliverEase.store.driverAcceptJob(jobId);
    window.DeliverEase.ui.renderActiveTabOnly();
  },

  handleUpdateStatus(jobId, newStatus) {
    window.DeliverEase.store.updateTripStatus(jobId, newStatus);
    window.DeliverEase.ui.renderActiveTabOnly();
  },

  openDeliveryModal(jobId) {
    const booking = window.DeliverEase.store.getState().bookings.find(b => b.id === jobId);
    if (!booking) return;

    const modalContent = `
      <div class="modal-dialog">
        <div class="modal-header">
          <h3 class="card-title">✅ Complete Delivery & Release Payout</h3>
          <button class="modal-close-btn" onclick="window.DeliverEase.ui.closeModal()">✕</button>
        </div>
        <div class="modal-body">
          <div style="background: var(--bg-subtle); padding: 1rem; border-radius: var(--radius-md); margin-bottom: 1rem;">
            <div style="font-weight: 700; color: var(--secondary);">Trip ${booking.id}: ${booking.destination.split(',')[0]}</div>
            <div style="font-size: 0.85rem; color: var(--text-muted);">Shipper: ${booking.customerName}</div>
          </div>

          <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem;">
            Please enter the 4-digit Proof of Delivery (e-POD) OTP code provided by the customer or receiver in India to verify successful delivery and unlock your 90% payout (₹${booking.driverEarnings.toLocaleString('en-IN')}).
          </p>

          <div class="form-group">
            <label class="form-label">Receiver e-POD Verification OTP Code</label>
            <input type="text" class="form-control" id="deliveryOtpInput" placeholder="e.g. ${booking.podOtp}" style="font-size: 1.25rem; letter-spacing: 0.2em; text-align: center; font-weight: 800;" required />
            <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.35rem; text-align: center;">
              (Demo Hint: Receiver's OTP code is <strong>${booking.podOtp}</strong>)
            </div>
          </div>

          <button class="btn btn-emerald btn-full" onclick="window.DeliverEase.driverModule.handleVerifyDelivery('${booking.id}')" style="margin-top: 1rem;">
            Verify OTP & Claim ₹${booking.driverEarnings.toLocaleString('en-IN')} Payout
          </button>
        </div>
      </div>
    `;

    window.DeliverEase.ui.openModal(modalContent);
  },

  handleVerifyDelivery(jobId) {
    const otpInput = document.getElementById('deliveryOtpInput').value;
    const result = window.DeliverEase.store.updateTripStatus(jobId, 'Delivered', otpInput);

    if (!result.success) {
      window.DeliverEase.ui.showToast(result.error, 'danger');
      return;
    }

    window.DeliverEase.ui.closeModal();
    window.DeliverEase.ui.showToast('Delivery verified! Payout released to your driver wallet.', 'success');
    window.DeliverEase.ui.renderActiveTabOnly();
  },

  openPayoutModal() {
    const user = window.DeliverEase.store.getCurrentUser();
    const modalContent = `
      <div class="modal-dialog">
        <div class="modal-header">
          <h3 class="card-title">💸 Instant Driver Payout (India)</h3>
          <button class="modal-close-btn" onclick="window.DeliverEase.ui.closeModal()">✕</button>
        </div>
        <div class="modal-body">
          <div style="text-align: center; margin-bottom: 1.5rem;">
            <div style="font-size: 0.85rem; color: var(--text-muted);">Available Net Earnings</div>
            <div style="font-size: 2.25rem; font-weight: 800; color: var(--accent-emerald);">₹${(user.walletBalance || 92450).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
          </div>

          <div class="form-group">
            <label class="form-label">Withdrawal Amount (₹)</label>
            <input type="number" class="form-control" id="payoutAmountInput" value="${(user.walletBalance || 25000).toFixed(2)}" max="${user.walletBalance || 92450}" min="500" />
          </div>

          <div class="form-group">
            <label class="form-label">Transfer Destination</label>
            <select class="form-select">
              <option>UPI Instant Transfer (gurdeep@okhdfc)</option>
              <option>HDFC Bank Direct IMPS (A/C ...4821 - IFSC HDFC0001201)</option>
              <option>State Bank of India (SBI IMPS)</option>
            </select>
          </div>

          <button class="btn btn-emerald btn-full" onclick="window.DeliverEase.driverModule.handleProcessPayout()" style="margin-top: 1rem;">
            Transfer Funds via IMPS/UPI Now
          </button>
        </div>
      </div>
    `;

    window.DeliverEase.ui.openModal(modalContent);
  },

  handleProcessPayout() {
    const amount = parseFloat(document.getElementById('payoutAmountInput').value);
    const user = window.DeliverEase.store.getCurrentUser();

    if (isNaN(amount) || amount <= 0 || amount > user.walletBalance) {
      window.DeliverEase.ui.showToast('Invalid payout amount', 'danger');
      return;
    }

    user.walletBalance -= amount;
    window.DeliverEase.store.saveState();

    window.DeliverEase.ui.closeModal();
    window.DeliverEase.ui.showToast(`₹${amount.toLocaleString('en-IN')} successfully transferred to your bank account!`, 'success');
    window.DeliverEase.ui.renderActiveTabOnly();
  }
};
