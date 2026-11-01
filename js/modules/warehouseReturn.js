/**
 * DeliverEase - Warehouse & Return Trip Module
 * Indian logistics hub network, cross-docking bay selection, return trip backhaul load matcher to eliminate empty truck miles
 */

window.DeliverEase = window.DeliverEase || {};
window.TransLogix = window.DeliverEase;

window.DeliverEase.warehouseReturnModule = {
  renderWarehouseReturnView() {
    const store = window.DeliverEase.store;
    const state = store.getState();
    const warehouses = state.warehouses;
    const returnTrips = state.returnTrips;

    return `
      <div class="view-header">
        <div class="view-title-group">
          <h1>🏢 Warehouse Network & Return Trip Hub</h1>
          <div class="view-subtitle">Select intermediate cross-docking depots across India and match return loads to eliminate empty backhaul miles</div>
        </div>
      </div>

      <!-- Empty Backhaul Elimination Callout Banner -->
      <div class="card" style="margin-bottom: 1.5rem; background: #0f172a; color: white; border: 1px solid #1e293b;">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
          <div>
            <span class="badge badge-warning" style="background: rgba(245, 158, 11, 0.2); color: #fbbf24;">RETURN TRIP OPTIMIZATION ENGINE</span>
            <h3 style="color: white; font-size: 1.2rem; margin-top: 0.35rem;">🔄 Zero Empty Miles on Golden Quadrilateral & National Corridors</h3>
            <p style="color: #94a3b8; font-size: 0.85rem; max-width: 680px; margin-top: 0.25rem;">
              When commercial drivers complete their one-way delivery in Delhi, Mumbai, or Bengaluru, DeliverEase matches return cargo from destination partner warehouses back to origin hubs, keeping vehicle capacity at 95%+ efficiency.
            </p>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 1.75rem; font-weight: 800; color: #38bdf8;">0%</div>
            <div style="font-size: 0.75rem; color: #94a3b8;">Empty Return Target</div>
          </div>
        </div>
      </div>

      <div class="grid-2">
        <!-- Return Trip Backhaul Marketplace -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">🚛 Available Return Backhaul Loads</h3>
            <span class="badge badge-primary">Discounted Freight</span>
          </div>

          <div style="display: flex; flex-direction: column; gap: 1rem;">
            ${returnTrips.map(ret => `
              <div style="border: 1px solid var(--border); border-radius: var(--radius-md); padding: 1rem; background: var(--bg-subtle);">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                  <div>
                    <div style="font-weight: 800; font-size: 1.05rem; color: var(--secondary);">
                      ${ret.originCity} ➔ ${ret.destinationCity}
                    </div>
                    <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.2rem;">
                      Driver: <strong>${ret.driverName}</strong> • ${ret.driverVehicle}
                    </div>
                  </div>
                  <span class="badge ${ret.status === 'Booked' ? 'badge-neutral' : 'badge-success'}">
                    ${ret.status}
                  </span>
                </div>

                <div style="display: flex; gap: 0.5rem; margin: 0.65rem 0; flex-wrap: wrap;">
                  <span class="badge badge-warning">${ret.incentiveDiscount}</span>
                  <span class="badge badge-primary">Capacity: ${ret.availableCapacityKg.toLocaleString('en-IN')} kg</span>
                  <span class="badge badge-neutral">Available: ${ret.availableFrom}</span>
                </div>

                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.75rem; padding-top: 0.5rem; border-top: 1px solid var(--border); flex-wrap: wrap; gap: 0.5rem;">
                  <div>
                    <div style="font-size: 0.7rem; color: var(--text-muted);">Discounted Return Rate</div>
                    <div style="font-size: 1.15rem; font-weight: 800; color: var(--accent-emerald);">₹${ret.offeredRate.toLocaleString('en-IN')}</div>
                  </div>
                  ${ret.status === 'Booked' ? `
                    <button class="btn btn-secondary btn-sm" disabled>✓ Match Assigned</button>
                  ` : `
                    <button class="btn btn-emerald btn-sm" onclick="window.DeliverEase.warehouseReturnModule.bookReturnLoad('${ret.id}')">
                      📦 Claim Return Load
                    </button>
                  `}
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Intermediary Transit Warehouse Network -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">🏢 Certified Transit Warehouse Hubs</h3>
            <span class="badge badge-primary">${warehouses.length} National Depots</span>
          </div>

          <div style="display: flex; flex-direction: column; gap: 1rem;">
            ${warehouses.map(wh => `
              <div style="border: 1px solid var(--border); border-radius: var(--radius-md); padding: 1rem; background: var(--bg-card);">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                  <div>
                    <div style="font-weight: 800; font-size: 1rem; color: var(--secondary);">${wh.name}</div>
                    <div style="font-size: 0.75rem; color: var(--text-muted);">${wh.city} • Capacity: ${wh.capacitySqFt.toLocaleString('en-IN')} sq ft</div>
                  </div>
                  <span class="badge badge-success">${wh.availableBays} Bays Free</span>
                </div>

                <div style="display: flex; gap: 0.35rem; margin: 0.65rem 0; flex-wrap: wrap;">
                  ${wh.services.map(svc => `
                    <span style="font-size: 0.65rem; background: var(--bg-subtle); color: var(--secondary-light); padding: 0.15rem 0.45rem; border-radius: 4px; border: 1px solid var(--border);">
                      ${svc}
                    </span>
                  `).join('')}
                </div>

                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.5rem; padding-top: 0.5rem; border-top: 1px solid var(--border); flex-wrap: wrap; gap: 0.5rem;">
                  <div style="font-size: 0.75rem; color: var(--text-muted);">
                    Cross-Dock Fee: <strong>₹${wh.crossDockFeePerDay}/day</strong>
                  </div>
                  <button class="btn btn-secondary btn-sm" onclick="window.DeliverEase.warehouseReturnModule.openWarehouseDetailModal('${wh.id}')">
                    🔍 Bay & Handoff Details
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  },

  bookReturnLoad(returnTripId) {
    const booking = window.DeliverEase.store.bookReturnTrip(returnTripId);
    if (booking) {
      window.DeliverEase.ui.showToast(`Return backhaul booked for ${booking.id}!`, 'success');
      window.DeliverEase.trackingModule.currentActiveTrackingCode = booking.id;
      window.DeliverEase.ui.navigate('tracking');
    }
  },

  openWarehouseDetailModal(warehouseId) {
    const wh = window.DeliverEase.store.getState().warehouses.find(w => w.id === warehouseId);
    if (!wh) return;

    const modalContent = `
      <div class="modal-dialog">
        <div class="modal-header">
          <h3 class="card-title">🏢 ${wh.name}</h3>
          <button class="modal-close-btn" onclick="window.DeliverEase.ui.closeModal()">✕</button>
        </div>
        <div class="modal-body">
          <div style="background: var(--bg-subtle); padding: 1rem; border-radius: var(--radius-md); margin-bottom: 1rem;">
            <div style="font-weight: 700; color: var(--secondary); font-size: 0.95rem;">Location & Staging</div>
            <div style="font-size: 0.85rem; color: var(--text-muted);">${wh.city} (GPS: ${wh.lat}, ${wh.lng})</div>
            <div style="margin-top: 0.5rem; font-size: 0.85rem;">
              <strong>Total Facility Area:</strong> ${wh.capacitySqFt.toLocaleString('en-IN')} sq ft • <strong>Active Bays:</strong> ${wh.availableBays} Dock Levelers
            </div>
          </div>

          <h4 style="font-size: 0.9rem; margin-bottom: 0.5rem; color: var(--secondary);">Available Hub Services</h4>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; margin-bottom: 1.25rem;">
            ${wh.services.map(s => `
              <div style="background: var(--bg-card); border: 1px solid var(--border); padding: 0.6rem; border-radius: var(--radius-sm); font-size: 0.8rem;">
                ✅ ${s}
              </div>
            `).join('')}
          </div>

          <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: var(--radius-md); padding: 0.85rem; font-size: 0.8rem; color: #1e40af;">
            ℹ️ Drivers and shippers can designate this hub as an intermediate relay waypoint during booking creation to consolidate shipments or switch drivers for long-distance relief.
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="window.DeliverEase.ui.closeModal()">Close</button>
          <button class="btn btn-primary" onclick="window.DeliverEase.ui.closeModal(); window.DeliverEase.ui.navigate('booking');">
            Book Shipment via this Hub
          </button>
        </div>
      </div>
    `;

    window.DeliverEase.ui.openModal(modalContent);
  }
};
