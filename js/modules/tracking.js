/**
 * DeliverEase - GPS & Real-Time Tracking Module
 * High-performance, zero-lag, self-contained SVG/Canvas Radar Map
 * Renders Indian Freight Corridors (NH48, NH44, NH19) with 60fps smooth telemetry,
 * speedometer HUD, cargo temperature, and strict timer cleanup to prevent memory leaks.
 */

window.DeliverEase = window.DeliverEase || {};
window.TransLogix = window.DeliverEase;

window.DeliverEase.trackingModule = {
  currentActiveTrackingCode: 'DLE-8921',
  simTimer: null,
  simProgress: 58,
  simSpeed: 68,
  simPaused: false,

  // National highway corridor waypoints for Indian routes
  routes: {
    'DLE-8921': {
      origin: 'Mumbai (Bhiwandi Hub)',
      destination: 'Delhi NCR (Kundli Depot)',
      highway: 'National Highway 48 (Golden Quadrilateral)',
      path: [
        { name: 'Mumbai Bhiwandi Hub', x: 23, y: 72 },
        { name: 'Surat Textile Gate', x: 26, y: 64 },
        { name: 'Vadodara Logistics Depot', x: 29, y: 56 },
        { name: 'Ahmedabad Sanand Toll', x: 32, y: 49 },
        { name: 'Udaipur NH48 Bypass', x: 38, y: 40 },
        { name: 'Ajmer Freight Crossing', x: 44, y: 32 },
        { name: 'Jaipur Transport Hub', x: 50, y: 26 },
        { name: 'Gurugram Expressway', x: 55, y: 20 },
        { name: 'Delhi NCR Kundli Depot', x: 57, y: 16 }
      ]
    },
    'DLE-4410': {
      origin: 'Bengaluru (Hosur Gate)',
      destination: 'Chennai (Sriperumbudur Hub)',
      highway: 'National Highway 44 / 48 Corridor',
      path: [
        { name: 'Bengaluru Hosur Gate', x: 38, y: 78 },
        { name: 'Krishnagiri Junction', x: 44, y: 77 },
        { name: 'Vellore Freight Depot', x: 53, y: 75 },
        { name: 'Kanchipuram Highway Toll', x: 61, y: 74 },
        { name: 'Sriperumbudur Auto Hub', x: 66, y: 73 }
      ]
    },
    'DLE-1092': {
      origin: 'Delhi NCR (Kundli Depot)',
      destination: 'Mumbai (Bhiwandi Hub)',
      highway: 'NH48 Return Backhaul Corridor',
      path: [
        { name: 'Delhi NCR Kundli Depot', x: 57, y: 16 },
        { name: 'Jaipur Transport Hub', x: 50, y: 26 },
        { name: 'Ajmer Freight Crossing', x: 44, y: 32 },
        { name: 'Udaipur NH48 Bypass', x: 38, y: 40 },
        { name: 'Ahmedabad Sanand Toll', x: 32, y: 49 },
        { name: 'Vadodara Logistics Depot', x: 29, y: 56 },
        { name: 'Surat Textile Gate', x: 26, y: 64 },
        { name: 'Mumbai Bhiwandi Hub', x: 23, y: 72 }
      ]
    }
  },

  renderTrackingView() {
    const store = window.DeliverEase.store;
    const state = store.getState();
    const activeBooking = state.bookings.find(b => b.id === this.currentActiveTrackingCode) || state.bookings[0];
    const routeInfo = this.routes[activeBooking.id] || this.routes['DLE-8921'];

    return `
      <div class="view-header">
        <div class="view-title-group">
          <h1>🛰️ Live GPS & Real-Time Radar (India)</h1>
          <div class="view-subtitle">High-frequency satellite telemetry along ${routeInfo.highway} with 0ms latency</div>
        </div>
        <div class="view-actions">
          <div style="display: flex; gap: 0.5rem; align-items: center;">
            <input type="text" class="form-control" id="trackingLookupInput" placeholder="Tracking # (e.g. DLE-8921)" value="${this.currentActiveTrackingCode}" style="width: 180px; padding: 0.4rem 0.75rem;" />
            <button class="btn btn-primary btn-sm" onclick="window.DeliverEase.trackingModule.handleLookup()">
              🔍 Track
            </button>
          </div>
        </div>
      </div>

      <!-- Quick Switcher for Demo Shipments -->
      <div style="display: flex; gap: 0.5rem; margin-bottom: 1rem; overflow-x: auto; padding-bottom: 0.35rem;">
        <span style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); display: flex; align-items: center;">Shipments:</span>
        ${state.bookings.map(b => `
          <button class="btn ${b.id === this.currentActiveTrackingCode ? 'btn-primary' : 'btn-secondary'} btn-sm" onclick="window.DeliverEase.trackingModule.setTrackingCode('${b.id}')" style="white-space: nowrap;">
            ${b.id} (${b.origin.split(' ')[0]} ➔ ${b.destination.split(' ')[0]})
            <span class="badge ${b.status === 'In-Transit' ? 'badge-success' : 'badge-primary'}" style="font-size: 0.6rem; margin-left: 0.35rem;">${b.status}</span>
          </button>
        `).join('')}
      </div>

      <!-- Telemetry Strip HUD -->
      <div class="telemetry-strip" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.75rem; margin-bottom: 1rem;">
        <div class="telemetry-item" style="background: var(--bg-card); padding: 0.75rem 1rem; border-radius: var(--radius-md); border: 1px solid var(--border);">
          <div class="telemetry-label" style="font-size: 0.7rem; color: var(--text-muted); font-weight: 600;">Vehicle Speed</div>
          <div class="telemetry-value" id="hudSpeed" style="font-size: 1.5rem; font-weight: 800; color: #38bdf8;">
            ${this.simSpeed} <span style="font-size: 0.75rem; font-weight: normal; color: var(--text-muted);">km/h</span>
          </div>
        </div>
        <div class="telemetry-item" style="background: var(--bg-card); padding: 0.75rem 1rem; border-radius: var(--radius-md); border: 1px solid var(--border);">
          <div class="telemetry-label" style="font-size: 0.7rem; color: var(--text-muted); font-weight: 600;">Estimated Arrival</div>
          <div class="telemetry-value" id="hudEta" style="font-size: 1.5rem; font-weight: 800; color: #10b981;">
            ${Math.max(15, Math.round(((100 - this.simProgress) / 100) * (activeBooking.distanceKm / 1.2)))} <span style="font-size: 0.75rem; font-weight: normal; color: var(--text-muted);">mins</span>
          </div>
        </div>
        <div class="telemetry-item" style="background: var(--bg-card); padding: 0.75rem 1rem; border-radius: var(--radius-md); border: 1px solid var(--border);">
          <div class="telemetry-label" style="font-size: 0.7rem; color: var(--text-muted); font-weight: 600;">Cargo Reefer Temp</div>
          <div class="telemetry-value" id="hudTemp" style="font-size: 1.5rem; font-weight: 800; color: ${activeBooking.cargoType.includes('Pharma') || activeBooking.cargoType.includes('Cold') ? '#0284c7' : '#059669'};">
            ${activeBooking.telemetry.tempCelsius || 22.4}°C
          </div>
        </div>
        <div class="telemetry-item" style="background: var(--bg-card); padding: 0.75rem 1rem; border-radius: var(--radius-md); border: 1px solid var(--border);">
          <div class="telemetry-label" style="font-size: 0.7rem; color: var(--text-muted); font-weight: 600;">Corridor Progress</div>
          <div class="telemetry-value" id="hudProgress" style="font-size: 1.5rem; font-weight: 800; color: #8b5cf6;">
            ${this.simProgress}%
          </div>
        </div>
      </div>

      <div class="grid-3-sidebar-layout">
        <!-- Interactive High-Performance Radar Map View -->
        <div>
          <div class="map-container-wrapper" style="position: relative; height: 440px; background: #090d16; border-radius: var(--radius-lg); overflow: hidden; border: 1px solid #1e293b; box-shadow: var(--shadow-md);">
            
            <!-- SVG Highway Map Canvas -->
            <svg id="radarSvgMap" viewBox="0 0 100 100" preserveAspectRatio="none" style="width: 100%; height: 100%; position: absolute; inset: 0;">
              <!-- Grid Matrix Overlay -->
              <defs>
                <pattern id="radarGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="0.3"/>
                </pattern>
                <linearGradient id="routeGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stop-color="#2563eb" stop-opacity="0.9" />
                  <stop offset="100%" stop-color="#38bdf8" stop-opacity="0.9" />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="1.5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              <rect width="100" height="100" fill="url(#radarGrid)" />

              <!-- India Map Outline Silhouettes (Stylized Geographical Reference) -->
              <path d="M 20 20 Q 35 10 55 12 Q 75 14 80 30 Q 82 50 65 75 Q 50 95 40 85 Q 25 75 20 60 Z" fill="rgba(30, 41, 59, 0.25)" stroke="rgba(51, 65, 85, 0.4)" stroke-width="0.5" />

              <!-- Highway Route Line -->
              <path id="svgHighwayPath" d="${this.buildSvgPathString(routeInfo.path)}" fill="none" stroke="url(#routeGradient)" stroke-width="1.8" stroke-dasharray="3, 1.5" filter="url(#glow)" />

              <!-- Route Waypoint Hub Circles -->
              ${routeInfo.path.map((pt, i) => `
                <g>
                  <circle cx="${pt.x}" cy="${pt.y}" r="${i === 0 || i === routeInfo.path.length - 1 ? 2.5 : 1.4}" fill="${i === 0 ? '#2563eb' : i === routeInfo.path.length - 1 ? '#10b981' : '#64748b'}" stroke="#ffffff" stroke-width="0.5" />
                  <text x="${pt.x + 2.5}" y="${pt.y + 1}" font-size="2.4" font-family="'Plus Jakarta Sans', sans-serif" font-weight="600" fill="#94a3b8">${pt.name.split(' ')[0]}</text>
                </g>
              `).join('')}

              <!-- Vehicle Position Marker -->
              <g id="svgVehicleGroup" transform="translate(0, 0)">
                <circle cx="0" cy="0" r="3.2" fill="#0284c7" stroke="#38bdf8" stroke-width="0.8" opacity="0.85">
                  <animate attributeName="r" values="3.2; 5.5; 3.2" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.85; 0.2; 0.85" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle cx="0" cy="0" r="2.2" fill="#0f172a" stroke="#38bdf8" stroke-width="0.7" />
                <text x="0" y="1" font-size="2.6" text-anchor="middle" dominant-baseline="middle" fill="#ffffff">🚚</text>
              </g>
            </svg>

            <!-- Floating Telemetry HUD Card -->
            <div style="position: absolute; top: 14px; left: 14px; background: rgba(15, 23, 42, 0.88); backdrop-filter: blur(6px); border: 1px solid rgba(255, 255, 255, 0.12); padding: 0.65rem 1rem; border-radius: var(--radius-md); color: white; max-width: 280px; z-index: 10;">
              <div style="display: flex; align-items: center; gap: 0.4rem; font-size: 0.65rem; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em;">
                <span style="width: 7px; height: 7px; border-radius: 50%; background: #10b981; display: inline-block;"></span>
                <span>Live GPS Highway Radar</span>
              </div>
              <div style="font-size: 0.95rem; font-weight: 800; color: #38bdf8; margin-top: 0.15rem;">
                ${activeBooking.id} • ${activeBooking.status}
              </div>
              <div style="font-size: 0.72rem; color: #cbd5e1; margin-top: 0.2rem;">
                ${activeBooking.vehicleName} (${activeBooking.driverName})
              </div>
            </div>

            <!-- Controls (Pause/Resume Sim) -->
            <div style="position: absolute; bottom: 14px; right: 14px; display: flex; gap: 0.5rem; z-index: 10;">
              <button class="btn btn-secondary btn-sm" onclick="window.DeliverEase.trackingModule.toggleSimulation()" style="background: rgba(15, 23, 42, 0.85); color: white; border-color: rgba(255,255,255,0.15); backdrop-filter: blur(6px);">
                <span id="simBtnIcon">${this.simPaused ? '▶️' : '⏸️'}</span> <span id="simBtnText">${this.simPaused ? 'Resume' : 'Pause'} GPS Sim</span>
              </button>
            </div>
          </div>

          <!-- Progress Bar Strip -->
          <div class="card" style="margin-top: 0.85rem; padding: 1rem 1.25rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem; font-size: 0.8rem;">
              <span><strong>📍 Origin:</strong> ${activeBooking.origin}</span>
              <span><strong>🎯 Destination:</strong> ${activeBooking.destination}</span>
            </div>

            <div style="background: var(--bg-subtle); height: 8px; border-radius: var(--radius-full); overflow: hidden; position: relative;">
              <div id="progressBarFill" style="background: linear-gradient(90deg, #2563eb, #10b981); height: 100%; width: ${this.simProgress}%; transition: width 0.3s ease;"></div>
            </div>

            <div style="display: flex; justify-content: space-between; font-size: 0.7rem; color: var(--text-muted); margin-top: 0.35rem;">
              <span>Dispatched: 05:30 AM</span>
              <span>Corridor: ${routeInfo.highway.split('(')[0]}</span>
              <span>Estimated Delivery: Today, 08:30 PM</span>
            </div>
          </div>
        </div>

        <!-- Right Side Shipment Details & Milestone Audit Feed -->
        <div>
          <div class="card" style="margin-bottom: 1rem;">
            <div class="card-header">
              <h3 class="card-title">📦 Cargo & E-Way Bill</h3>
              <span class="badge ${activeBooking.isSpaceShared ? 'badge-primary' : 'badge-neutral'}">
                ${activeBooking.isSpaceShared ? '50-50 Shared Load' : 'Full Truckload'}
              </span>
            </div>

            <div style="font-size: 0.8rem; line-height: 1.6;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 0.3rem;">
                <span style="color: var(--text-muted);">Shipper / Customer:</span>
                <strong>${activeBooking.customerName}</strong>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 0.3rem;">
                <span style="color: var(--text-muted);">Assigned Driver:</span>
                <strong>${activeBooking.driverName}</strong>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 0.3rem;">
                <span style="color: var(--text-muted);">Cargo Category:</span>
                <span>${activeBooking.cargoType}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 0.3rem;">
                <span style="color: var(--text-muted);">Gross Weight:</span>
                <strong>${activeBooking.weightKg.toLocaleString('en-IN')} kg</strong>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 0.3rem;">
                <span style="color: var(--text-muted);">Total Freight (INR):</span>
                <strong>₹${activeBooking.grossFare.toLocaleString('en-IN')}</strong>
              </div>
              <div style="display: flex; justify-content: space-between; border-top: 1px solid var(--border); padding-top: 0.4rem; margin-top: 0.4rem;">
                <span style="color: var(--text-muted);">Delivery Code (e-POD):</span>
                <span class="badge badge-warning" style="font-weight: 800; font-size: 0.75rem;">OTP: ${activeBooking.podOtp}</span>
              </div>
            </div>
          </div>

          <!-- Real-Time Event Audit Trail -->
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">🕒 Telemetry Log</h3>
            </div>

            <div style="display: flex; flex-direction: column; gap: 0.65rem; font-size: 0.75rem;">
              <div style="display: flex; gap: 0.6rem; border-left: 2px solid var(--primary); padding-left: 0.6rem;">
                <div>
                  <div style="font-weight: 700; color: var(--secondary);">${activeBooking.telemetry.lastMilestone || 'En route on National Highway'}</div>
                  <div style="font-size: 0.65rem; color: var(--text-muted);">Live Telemetry Ping • GPS Satellite Fix: High Accuracy</div>
                </div>
              </div>
              <div style="display: flex; gap: 0.6rem; border-left: 2px solid var(--border); padding-left: 0.6rem;">
                <div>
                  <div style="font-weight: 600; color: var(--secondary);">Passed RTO Border Weighbridge & Toll Plaza</div>
                  <div style="font-size: 0.65rem; color: var(--text-muted);">2 hours ago • Weight & E-Way Bill Compliant</div>
                </div>
              </div>
              <div style="display: flex; gap: 0.6rem; border-left: 2px solid var(--border); padding-left: 0.6rem;">
                <div>
                  <div style="font-weight: 600; color: var(--secondary);">Departed Origin Hub Logistics Park</div>
                  <div style="font-size: 0.65rem; color: var(--text-muted);">5 hours ago • Inspected & GPS Tagged</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  buildSvgPathString(path) {
    if (!path || path.length === 0) return '';
    return path.reduce((acc, pt, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`, '');
  },

  setTrackingCode(code) {
    this.currentActiveTrackingCode = code;
    this.simProgress = 35 + Math.floor(Math.random() * 40);
    window.DeliverEase.ui.renderActiveTabOnly();
    this.initMap();
  },

  handleLookup() {
    const input = document.getElementById('trackingLookupInput');
    if (input && input.value.trim()) {
      this.setTrackingCode(input.value.trim());
    }
  },

  initMap() {
    this.stopSimulation();
    this.updateVehicleMarkerPosition();

    if (!this.simPaused) {
      this.startSimulation();
    }
  },

  updateVehicleMarkerPosition() {
    const pathEl = document.getElementById('svgHighwayPath');
    const vehicleGroup = document.getElementById('svgVehicleGroup');
    if (!pathEl || !vehicleGroup) return;

    try {
      const totalLen = pathEl.getTotalLength();
      if (totalLen > 0) {
        const currentLen = totalLen * (this.simProgress / 100);
        const point = pathEl.getPointAtLength(currentLen);
        vehicleGroup.setAttribute('transform', `translate(${point.x}, ${point.y})`);
      }
    } catch (e) {
      // Fallback
    }
  },

  startSimulation() {
    this.stopSimulation();
    this.simTimer = setInterval(() => {
      if (this.simPaused) return;

      this.simProgress += 1;
      if (this.simProgress > 98) {
        this.simProgress = 15;
      }

      this.simSpeed = 62 + Math.floor(Math.sin(Date.now() / 800) * 8);

      // Lightweight DOM updates (no full re-render!)
      this.updateVehicleMarkerPosition();

      const hudProgress = document.getElementById('hudProgress');
      const hudSpeed = document.getElementById('hudSpeed');
      const hudEta = document.getElementById('hudEta');
      const barFill = document.getElementById('progressBarFill');

      if (hudProgress) hudProgress.innerText = this.simProgress + '%';
      if (hudSpeed) hudSpeed.innerHTML = `${this.simSpeed} <span style="font-size: 0.75rem; font-weight: normal; color: var(--text-muted);">km/h</span>`;
      if (hudEta) hudEta.innerHTML = `${Math.max(10, Math.round((100 - this.simProgress) * 4.5))} <span style="font-size: 0.75rem; font-weight: normal; color: var(--text-muted);">mins</span>`;
      if (barFill) barFill.style.width = this.simProgress + '%';

    }, 1200);
  },

  stopSimulation() {
    if (this.simTimer) {
      clearInterval(this.simTimer);
      this.simTimer = null;
    }
  },

  toggleSimulation() {
    this.simPaused = !this.simPaused;
    const btnIcon = document.getElementById('simBtnIcon');
    const btnText = document.getElementById('simBtnText');

    if (this.simPaused) {
      this.stopSimulation();
      if (btnIcon) btnIcon.innerText = '▶️';
      if (btnText) btnText.innerText = 'Resume GPS Sim';
      window.DeliverEase.ui.showToast('GPS Telemetry stream paused', 'warning');
    } else {
      this.startSimulation();
      if (btnIcon) btnIcon.innerText = '⏸️';
      if (btnText) btnText.innerText = 'Pause GPS Sim';
      window.DeliverEase.ui.showToast('GPS Telemetry stream resumed', 'success');
    }
  }
};
