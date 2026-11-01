/**
 * DeliverEase - Transportation Booking Module
 * Origin/Destination routing across Indian cities, vehicle requirements, goods category, warehouse cross-dock stop, price estimator in INR (₹)
 */

window.DeliverEase = window.DeliverEase || {};
window.TransLogix = window.DeliverEase;

window.DeliverEase.bookingModule = {
  cities: [
    { name: 'Mumbai (Bhiwandi Logistics Hub), Maharashtra', coords: [19.2969, 73.0631] },
    { name: 'Delhi NCR (Kundli Freight Depot), Haryana', coords: [28.8715, 77.1264] },
    { name: 'Bengaluru (Hosur Distribution Gate), Karnataka', coords: [12.7409, 77.8253] },
    { name: 'Chennai (Sriperumbudur Hub), Tamil Nadu', coords: [12.9696, 79.9431] },
    { name: 'Hyderabad (Shamshabad Aero Gateway), Telangana', coords: [17.2403, 78.4294] },
    { name: 'Kolkata (Dankuni Terminal), West Bengal', coords: [22.6841, 88.2917] },
    { name: 'Pune (Chakan Industrial Gate), Maharashtra', coords: [18.7606, 73.8567] },
    { name: 'Ahmedabad (Sanand Freight Depot), Gujarat', coords: [22.9868, 72.3813] }
  ],

  selectedVehicleId: 'veh_03',

  calculateEstimatedDistance(originCoords, destCoords) {
    if (!originCoords || !destCoords) return 950;
    // Haversine approximation in km
    const R = 6371;
    const dLat = (destCoords[0] - originCoords[0]) * Math.PI / 180;
    const dLon = (destCoords[1] - originCoords[1]) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(originCoords[0] * Math.PI / 180) * Math.cos(destCoords[0] * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const dist = Math.round(R * c * 1.25); // 1.25 highway multiplier
    return Math.max(dist, 80);
  },

  renderBookingView() {
    const store = window.DeliverEase.store;
    const state = store.getState();
    const vehicles = state.vehicleCatalog;
    const warehouses = state.warehouses;

    return `
      <div class="view-header">
        <div class="view-title-group">
          <h1>📦 DeliverEase Freight Booking</h1>
          <div class="view-subtitle">Select origin, destination, vehicle requirements, and get instant quotation in INR (₹) with 10% transparent platform fee</div>
        </div>
      </div>

      <div class="grid-3-sidebar-layout">
        <!-- Main Booking Wizard -->
        <div>
          <div class="card" style="margin-bottom: 1.5rem;">
            <div class="card-header">
              <h3 class="card-title">1. Route & Schedule (India)</h3>
              <span class="badge badge-primary">Step 1 of 3</span>
            </div>

            <form id="bookingForm" onsubmit="window.DeliverEase.bookingModule.handleCreateBooking(event)">
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">📍 Pickup Location (Origin Hub)</label>
                  <select class="form-select" id="bookOrigin" onchange="window.DeliverEase.bookingModule.updateFareEstimate()" required>
                    ${this.cities.map((c, i) => `
                      <option value="${c.name}" ${i === 0 ? 'selected' : ''}>${c.name}</option>
                    `).join('')}
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">🎯 Delivery Destination</label>
                  <select class="form-select" id="bookDestination" onchange="window.DeliverEase.bookingModule.updateFareEstimate()" required>
                    ${this.cities.map((c, i) => `
                      <option value="${c.name}" ${i === 1 ? 'selected' : ''}>${c.name}</option>
                    `).join('')}
                  </select>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">📅 Preferred Dispatch Date</label>
                  <input type="date" class="form-control" id="bookDate" value="${new Date().toISOString().substring(0, 10)}" required />
                </div>
                <div class="form-group">
                  <label class="form-label">🏢 Intermediate Transit Warehouse / Cross-Dock (Optional)</label>
                  <select class="form-select" id="bookWarehouse" onchange="window.DeliverEase.bookingModule.updateFareEstimate()">
                    <option value="">Direct Non-Stop Delivery (No intermediate hub)</option>
                    ${warehouses.map(w => `
                      <option value="${w.id}">${w.name} (${w.city}) - Bay Handoff</option>
                    `).join('')}
                  </select>
                </div>
              </div>

              <div class="card-header" style="margin-top: 1.5rem;">
                <h3 class="card-title">2. Select Commercial Vehicle Class</h3>
                <span class="badge badge-primary">Step 2 of 3</span>
              </div>

              <div class="vehicle-selector-grid">
                ${vehicles.map(v => `
                  <div class="vehicle-card ${v.id === this.selectedVehicleId ? 'selected' : ''}" 
                       onclick="window.DeliverEase.bookingModule.selectVehicle('${v.id}')"
                       id="veh_card_${v.id}">
                    <div class="vehicle-card-icon">${v.icon}</div>
                    <div class="vehicle-card-name">${v.name}</div>
                    <div class="vehicle-card-cap">Max ${v.maxWeightKg.toLocaleString('en-IN')} kg</div>
                    <div style="font-size: 0.65rem; color: var(--primary); font-weight: 700; margin-top: 0.25rem;">₹${v.baseFare.toLocaleString('en-IN')} Base + ₹${v.ratePerKm}/km</div>
                  </div>
                `).join('')}
              </div>

              <div class="card-header" style="margin-top: 1.5rem;">
                <h3 class="card-title">3. Cargo Specifications & E-Way Bill</h3>
                <span class="badge badge-primary">Step 3 of 3</span>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Cargo Classification</label>
                  <select class="form-select" id="bookCargoType">
                    <option value="Textiles, Garments & Handlooms">Textiles, Garments & Handlooms</option>
                    <option value="FMCG & Packaged Retail Goods">FMCG & Packaged Retail Goods</option>
                    <option value="Automotive Components & Engine Spares">Automotive Components & Engine Spares</option>
                    <option value="Cold Chain, Pharma & Perishables">Cold Chain, Pharma & Perishables</option>
                    <option value="Industrial Machinery & Raw Metal Parts">Industrial Machinery & Raw Metal Parts</option>
                    <option value="Electronics & Consumer Appliances">Electronics & Consumer Appliances</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">Total Weight (kg)</label>
                  <input type="number" class="form-control" id="bookWeight" value="3500" min="50" max="28000" onchange="window.DeliverEase.bookingModule.updateFareEstimate()" required />
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">E-Way Bill Number / Special Loading Instructions</label>
                <textarea class="form-textarea" id="bookNotes" placeholder="e.g. E-Way Bill #381920914821 • Forklift required for Pallet unloading at Gate 3."></textarea>
              </div>

              <div style="display: flex; gap: 1rem; align-items: center; justify-content: flex-end; margin-top: 1.5rem; flex-wrap: wrap;">
                <button type="button" class="btn btn-secondary" onclick="window.DeliverEase.ui.navigate('spaceshare')">
                  🤝 Check 50-50 Sharing to Save 50%
                </button>
                <button type="submit" class="btn btn-primary btn-lg">
                  🚀 Confirm & Dispatch Shipment
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Right Side Live Fare & Commission Breakdown -->
        <div>
          <div class="card" style="position: sticky; top: 120px;">
            <div class="card-header">
              <h3 class="card-title">💰 Live Quotation in INR (₹)</h3>
            </div>

            <div id="fareBreakdownBox">
              <!-- Rendered dynamically -->
            </div>

            <div style="background: var(--bg-subtle); padding: 1rem; border-radius: var(--radius-md); margin-top: 1rem; border: 1px solid var(--border);">
              <div style="font-size: 0.8rem; font-weight: 700; color: var(--secondary); margin-bottom: 0.35rem;">
                🛡️ Transparent 10% Commission Model
              </div>
              <p style="font-size: 0.75rem; color: var(--text-muted); line-height: 1.4;">
                DeliverEase ensures Indian truck drivers receive <strong>90% of trip revenue</strong> directly via instant IMPS/UPI upon delivery OTP verification.
              </p>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  selectVehicle(vehicleId) {
    this.selectedVehicleId = vehicleId;
    document.querySelectorAll('.vehicle-card').forEach(c => c.classList.remove('selected'));
    const target = document.getElementById('veh_card_' + vehicleId);
    if (target) target.classList.add('selected');
    this.updateFareEstimate();
  },

  updateFareEstimate() {
    const originName = document.getElementById('bookOrigin') ? document.getElementById('bookOrigin').value : this.cities[0].name;
    const destName = document.getElementById('bookDestination') ? document.getElementById('bookDestination').value : this.cities[1].name;
    const warehouseVal = document.getElementById('bookWarehouse') ? document.getElementById('bookWarehouse').value : '';

    const originCity = this.cities.find(c => c.name === originName) || this.cities[0];
    const destCity = this.cities.find(c => c.name === destName) || this.cities[1];

    const distKm = this.calculateEstimatedDistance(originCity.coords, destCity.coords);
    const store = window.DeliverEase.store;
    const vehicle = store.getState().vehicleCatalog.find(v => v.id === this.selectedVehicleId) || store.getState().vehicleCatalog[2];

    const baseFare = vehicle.baseFare;
    const distanceCost = distKm * vehicle.ratePerKm;
    const warehouseCost = warehouseVal ? 750 : 0;
    const subtotal = baseFare + distanceCost + warehouseCost;

    const platformFee = Number((subtotal * 0.10).toFixed(2)); // Strict 10%
    const driverEarnings = Number((subtotal * 0.90).toFixed(2)); // Strict 90%

    const box = document.getElementById('fareBreakdownBox');
    if (box) {
      box.innerHTML = `
        <div style="font-size: 0.85rem; margin-bottom: 1rem;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
            <span style="color: var(--text-muted);">Highway Distance (NH):</span>
            <strong>${distKm.toLocaleString('en-IN')} km</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
            <span style="color: var(--text-muted);">Vehicle Base Fare (${vehicle.name.split('/')[0]}):</span>
            <span>₹${baseFare.toLocaleString('en-IN')}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
            <span style="color: var(--text-muted);">Mileage Rate (${distKm} km @ ₹${vehicle.ratePerKm}/km):</span>
            <span>₹${distanceCost.toLocaleString('en-IN')}</span>
          </div>
          ${warehouseVal ? `
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; color: var(--accent-amber);">
              <span>Cross-Dock Depot Fee:</span>
              <span>+₹${warehouseCost.toLocaleString('en-IN')}</span>
            </div>
          ` : ''}
          <div style="border-top: 1px solid var(--border); margin: 0.75rem 0; padding-top: 0.75rem; display: flex; justify-content: space-between; font-size: 1.15rem; font-weight: 800; color: var(--secondary);">
            <span>Total Gross Freight:</span>
            <span style="color: var(--primary);">₹${subtotal.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: var(--radius-md); padding: 0.75rem; font-size: 0.75rem;">
          <div style="display: flex; justify-content: space-between; color: #166534; font-weight: 700; margin-bottom: 0.25rem;">
            <span>Driver Net Earnings (90%):</span>
            <span>₹${driverEarnings.toLocaleString('en-IN')}</span>
          </div>
          <div style="display: flex; justify-content: space-between; color: #15803d;">
            <span>DeliverEase Platform Fee (10%):</span>
            <span>₹${platformFee.toLocaleString('en-IN')}</span>
          </div>
        </div>
      `;
    }
  },

  handleCreateBooking(e) {
    e.preventDefault();
    const originName = document.getElementById('bookOrigin').value;
    const destName = document.getElementById('bookDestination').value;
    
    if (originName === destName) {
      window.DeliverEase.ui.showToast('Origin and Destination cannot be the same city', 'danger');
      return;
    }

    const originCity = this.cities.find(c => c.name === originName);
    const destCity = this.cities.find(c => c.name === destName);
    const distKm = this.calculateEstimatedDistance(originCity.coords, destCity.coords);

    const store = window.DeliverEase.store;
    const vehicle = store.getState().vehicleCatalog.find(v => v.id === this.selectedVehicleId);
    const warehouseVal = document.getElementById('bookWarehouse').value;
    const warehouseObj = store.getState().warehouses.find(w => w.id === warehouseVal);

    const baseFare = vehicle.baseFare;
    const distanceCost = distKm * vehicle.ratePerKm;
    const warehouseCost = warehouseVal ? 750 : 0;
    const grossFare = baseFare + distanceCost + warehouseCost;

    const cargoType = document.getElementById('bookCargoType').value;
    const weightKg = document.getElementById('bookWeight').value;

    const booking = store.addBooking({
      vehicleId: vehicle.id,
      vehicleName: vehicle.name,
      origin: originName,
      originCoords: originCity.coords,
      destination: destName,
      destinationCoords: destCity.coords,
      intermediateWarehouseId: warehouseVal || null,
      intermediateWarehouseName: warehouseObj ? `${warehouseObj.name} (${warehouseObj.city})` : 'Direct Highway Route',
      cargoType,
      weightKg,
      distanceKm: distKm,
      grossFare
    });

    window.DeliverEase.ui.showToast(`Booking ${booking.id} confirmed! Live GPS initialized.`, 'success');
    window.DeliverEase.trackingModule.currentActiveTrackingCode = booking.id;
    window.DeliverEase.ui.navigate('tracking');
  }
};
