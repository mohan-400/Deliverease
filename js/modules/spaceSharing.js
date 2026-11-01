/**
 * DeliverEase - 50-50 Space Sharing Module
 * Enables 2 Indian shippers to share vehicle capacity, cuts transportation cost by 50%, with visual compartment bay simulator in INR (₹)
 */

window.DeliverEase = window.DeliverEase || {};
window.TransLogix = window.DeliverEase;

window.DeliverEase.spaceSharingModule = {
  renderSpaceSharingView() {
    const store = window.DeliverEase.store;
    const state = store.getState();
    const pools = state.spaceSharingPool;

    return `
      <div class="view-header">
        <div class="view-title-group">
          <h1>🤝 50–50 Space Sharing Marketplace</h1>
          <div class="view-subtitle">Pair with another shipper along national freight corridors (NH48 / NH44), utilize empty truck volume, and cut transit costs by exactly 50%</div>
        </div>
        <div class="view-actions">
          <button class="btn btn-accent" onclick="window.DeliverEase.spaceSharingModule.openCreateOfferModal()">
            ➕ Post New Half-Load Request
          </button>
        </div>
      </div>

      <!-- Live Cargo Compartment Simulator Feature Card -->
      <div class="card" style="margin-bottom: 1.5rem; background: linear-gradient(to right, #0f172a, #1e293b); color: white;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; border-bottom: 1px solid #334155; padding-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
          <div>
            <span class="badge badge-primary" style="background: rgba(56, 189, 248, 0.2); color: #38bdf8;">SIMULATOR PREVIEW</span>
            <h3 style="color: white; font-size: 1.15rem; margin-top: 0.35rem;">🚛 50–50 Split-Bay Cargo Distribution (Eicher Pro 24ft)</h3>
          </div>
          <div style="text-align: right;">
            <span style="font-size: 0.8rem; color: #94a3b8;">Average Shipper Cost Reduction:</span>
            <div style="font-size: 1.25rem; font-weight: 800; color: #10b981;">50% OFF Regular Full-Truck Rate</div>
          </div>
        </div>

        <div class="truck-container-frame">
          <div class="bay-partition-line"></div>
          
          <!-- Slot A -->
          <div class="bay-slot booked-a">
            <span class="bay-slot-title" style="color: #93c5fd;">📦 Slot A: Shipper 1 (50% Bay)</span>
            <div class="bay-slot-desc">Priya Sharma (Surat Textiles) • 3,800 kg</div>
            <span class="bay-slot-badge" style="background: #2563eb; color: white;">Loaded & Locked (₹29,000)</span>
          </div>

          <!-- Slot B -->
          <div class="bay-slot booked-b">
            <span class="bay-slot-title" style="color: #6ee7b7;">📦 Slot B: Shipper 2 (50% Bay)</span>
            <div class="bay-slot-desc">Bharat Logistics (Auto Parts) • 4,200 kg</div>
            <span class="bay-slot-badge" style="background: #10b981; color: white;">Matched & Verified (₹29,000)</span>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; margin-top: 0.85rem; font-size: 0.75rem; color: #94a3b8; flex-wrap: wrap; gap: 0.5rem;">
          <span>⚖️ Symmetric Axle Weight Balance & Safety Bulkhead Partition</span>
          <span>🌱 50% Carbon Emission Savings per Ton-Kilometer</span>
        </div>
      </div>

      <!-- Active 50-50 Match Listings -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Available 50–50 Co-Loading Corridors</h3>
          <span class="badge badge-success">${pools.filter(p => !p.slotB_Occupied).length} Active Corridors Open</span>
        </div>

        <div class="grid-2">
          ${pools.map(pool => `
            <div class="card" style="border: 1px solid var(--border); background: var(--bg-subtle);">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
                <div>
                  <div style="font-size: 1.05rem; font-weight: 800; color: var(--secondary);">
                    ${pool.origin} ➔ ${pool.destination}
                  </div>
                  <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.15rem;">
                    Vehicle: <strong>${pool.vehicleClass}</strong> • Departs: <strong>${pool.departureDate}</strong>
                  </div>
                </div>
                <span class="badge ${pool.slotB_Occupied ? 'badge-neutral' : 'badge-success'}">
                  ${pool.slotB_Occupied ? 'Fully Matched' : '50% Space Open'}
                </span>
              </div>

              <!-- Visual Mini Split Slot representation -->
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin: 0.75rem 0; background: #0f172a; padding: 8px; border-radius: var(--radius-md);">
                <div style="background: rgba(37, 99, 235, 0.3); border: 1px solid #3b82f6; border-radius: 4px; padding: 6px; text-align: center; color: white;">
                  <div style="font-size: 0.65rem; font-weight: 700; color: #93c5fd;">SLOT A (50%)</div>
                  <div style="font-size: 0.7rem; font-weight: 600;">${pool.slotA_User}</div>
                  <div style="font-size: 0.65rem; color: #cbd5e1;">${pool.slotA_WeightKg.toLocaleString('en-IN')} kg</div>
                </div>

                <div style="background: ${pool.slotB_Occupied ? 'rgba(16, 185, 129, 0.3)' : 'rgba(255, 255, 255, 0.05)'}; border: 1px ${pool.slotB_Occupied ? 'solid #10b981' : 'dashed #64748b'}; border-radius: 4px; padding: 6px; text-align: center; color: white;">
                  <div style="font-size: 0.65rem; font-weight: 700; color: ${pool.slotB_Occupied ? '#6ee7b7' : '#94a3b8'};">SLOT B (50%)</div>
                  <div style="font-size: 0.7rem; font-weight: 600;">${pool.slotB_Occupied ? pool.slotB_User : 'AVAILABLE FOR YOU'}</div>
                  <div style="font-size: 0.65rem; color: #cbd5e1;">Up to ${pool.slotB_WeightLimitKg.toLocaleString('en-IN')} kg</div>
                </div>
              </div>

              <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1rem; padding-top: 0.75rem; border-top: 1px solid var(--border); flex-wrap: wrap; gap: 0.5rem;">
                <div>
                  <div style="font-size: 0.7rem; color: var(--text-muted); text-decoration: line-through;">
                    Full-Truck Standard: ₹${pool.singlePayerStandardRate.toLocaleString('en-IN')}
                  </div>
                  <div style="font-size: 1.15rem; font-weight: 800; color: var(--accent-emerald);">
                    Your Split Share: ₹${pool.splitCostPerParty.toLocaleString('en-IN')}
                  </div>
                </div>

                ${pool.slotB_Occupied ? `
                  <button class="btn btn-secondary btn-sm" disabled>
                    ✓ Paired & Dispatched
                  </button>
                ` : `
                  <button class="btn btn-emerald btn-sm" onclick="window.DeliverEase.spaceSharingModule.openJoinModal('${pool.id}')">
                    🤝 Join 50% Slot & Save ₹${pool.savingsTotal.toLocaleString('en-IN')}
                  </button>
                `}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  openJoinModal(poolId) {
    const pool = window.DeliverEase.store.getState().spaceSharingPool.find(p => p.id === poolId);
    if (!pool) return;

    const modalContent = `
      <div class="modal-dialog">
        <div class="modal-header">
          <h3 class="card-title">🤝 Join 50–50 Space Sharing Run</h3>
          <button class="modal-close-btn" onclick="window.DeliverEase.ui.closeModal()">✕</button>
        </div>
        <div class="modal-body">
          <div style="background: var(--bg-subtle); padding: 1rem; border-radius: var(--radius-md); margin-bottom: 1rem;">
            <div style="font-weight: 800; font-size: 1.05rem; color: var(--secondary);">
              ${pool.origin} ➔ ${pool.destination}
            </div>
            <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.25rem;">
              Partner Shipper in Slot A: <strong>${pool.slotA_User}</strong>
            </div>
          </div>

          <form id="joinPoolForm" onsubmit="window.DeliverEase.spaceSharingModule.handleJoinPool(event, '${pool.id}')">
            <div class="form-group">
              <label class="form-label">Your Cargo Description</label>
              <input type="text" class="form-control" id="shareCargoGoods" placeholder="e.g. 100 Cartons of Readymade Garments" required />
            </div>
            <div class="form-group">
              <label class="form-label">Cargo Weight (Max ${pool.slotB_WeightLimitKg} kg)</label>
              <input type="number" class="form-control" id="shareCargoWeight" max="${pool.slotB_WeightLimitKg}" min="100" value="2200" required />
            </div>

            <div style="background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: var(--radius-md); padding: 1rem; margin-top: 1rem;">
              <div style="display: flex; justify-content: space-between; font-weight: 700; color: #065f46; font-size: 0.9rem;">
                <span>Your 50% Shared Fare:</span>
                <span>₹${pool.splitCostPerParty.toLocaleString('en-IN')}</span>
              </div>
              <div style="font-size: 0.75rem; color: #047857; margin-top: 0.25rem;">
                🎉 Instant 50% discount (₹${pool.savingsTotal.toLocaleString('en-IN')} saved vs. full truck hire)
              </div>
            </div>

            <button type="submit" class="btn btn-emerald btn-full" style="margin-top: 1.25rem;">
              Lock 50% Bay & Create Shipment
            </button>
          </form>
        </div>
      </div>
    `;

    window.DeliverEase.ui.openModal(modalContent);
  },

  handleJoinPool(e, poolId) {
    e.preventDefault();
    const goods = document.getElementById('shareCargoGoods').value;
    const weightKg = document.getElementById('shareCargoWeight').value;

    const booking = window.DeliverEase.store.joinSpaceSharingPool(poolId, { goods, weightKg });
    window.DeliverEase.ui.closeModal();

    if (booking) {
      window.DeliverEase.trackingModule.currentActiveTrackingCode = booking.id;
      window.DeliverEase.ui.navigate('tracking');
    }
  },

  openCreateOfferModal() {
    const modalContent = `
      <div class="modal-dialog">
        <div class="modal-header">
          <h3 class="card-title">➕ Post a 50–50 Space Sharing Corridor</h3>
          <button class="modal-close-btn" onclick="window.DeliverEase.ui.closeModal()">✕</button>
        </div>
        <div class="modal-body">
          <form id="createPoolForm" onsubmit="window.DeliverEase.spaceSharingModule.handleCreateOffer(event)">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Origin City (Hub)</label>
                <select class="form-select" id="newPoolOrigin">
                  <option value="Mumbai (Bhiwandi)">Mumbai (Bhiwandi)</option>
                  <option value="Delhi NCR (Kundli)">Delhi NCR (Kundli)</option>
                  <option value="Bengaluru (Hosur)">Bengaluru (Hosur)</option>
                  <option value="Chennai (Sriperumbudur)">Chennai (Sriperumbudur)</option>
                  <option value="Hyderabad (Shamshabad)">Hyderabad (Shamshabad)</option>
                  <option value="Pune (Chakan)">Pune (Chakan)</option>
                  <option value="Ahmedabad (Sanand)">Ahmedabad (Sanand)</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Destination City</label>
                <select class="form-select" id="newPoolDest">
                  <option value="Delhi NCR (Kundli)">Delhi NCR (Kundli)</option>
                  <option value="Mumbai (Bhiwandi)">Mumbai (Bhiwandi)</option>
                  <option value="Bengaluru (Hosur)">Bengaluru (Hosur)</option>
                  <option value="Chennai (Sriperumbudur)">Chennai (Sriperumbudur)</option>
                  <option value="Hyderabad (Shamshabad)">Hyderabad (Shamshabad)</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Your Cargo Description (Slot A)</label>
                <input type="text" class="form-control" id="newPoolGoods" placeholder="e.g. Electrical Switchgear Panels" required />
              </div>
              <div class="form-group">
                <label class="form-label">Your Cargo Weight (kg)</label>
                <input type="number" class="form-control" id="newPoolWeight" value="3000" required />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Vehicle Class Required</label>
                <select class="form-select" id="newPoolVehicle">
                  <option value="Eicher Pro 24ft Heavy Carrier">Eicher Pro 24ft Heavy Carrier (Max 8.5T)</option>
                  <option value="Tata 407 / 14ft Truck">Tata 407 / 14ft Truck (Max 2.8T)</option>
                  <option value="Ashok Leyland 40ft Multi-Axle">Ashok Leyland 40ft Multi-Axle (Max 28T)</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Standard Solo Full-Truck Rate (₹)</label>
                <input type="number" class="form-control" id="newPoolStandardRate" value="48000" required />
              </div>
            </div>

            <div style="background: var(--bg-subtle); padding: 0.85rem; border-radius: var(--radius-md); font-size: 0.8rem; margin-top: 0.5rem;">
              💡 When another shipper matches your route, both parties pay <strong>50% of the standard rate</strong> (₹24,000 each).
            </div>

            <button type="submit" class="btn btn-accent btn-full" style="margin-top: 1.25rem;">
              Publish 50-50 Split Offer to Network
            </button>
          </form>
        </div>
      </div>
    `;

    window.DeliverEase.ui.openModal(modalContent);
  },

  handleCreateOffer(e) {
    e.preventDefault();
    const origin = document.getElementById('newPoolOrigin').value;
    const destination = document.getElementById('newPoolDest').value;
    const goods = document.getElementById('newPoolGoods').value;
    const weightKg = document.getElementById('newPoolWeight').value;
    const vehicleClass = document.getElementById('newPoolVehicle').value;
    const standardFare = document.getElementById('newPoolStandardRate').value;

    window.DeliverEase.store.createSpaceSharingOffer({
      origin,
      destination,
      goods,
      weightKg,
      vehicleClass,
      standardFare
    });

    window.DeliverEase.ui.closeModal();
    window.DeliverEase.ui.renderActiveTabOnly();
  }
};
