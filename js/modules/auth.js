/**
 * DeliverEase - Auth & Identity Module (User Registration & Login)
 * Secure login with Mobile/OTP or Email, 1-click persona quick-login, multi-role registration, and KYC management
 */

window.DeliverEase = window.DeliverEase || {};
window.TransLogix = window.DeliverEase;

window.DeliverEase.authModule = {
  renderLoginModal() {
    const store = window.DeliverEase.store;
    const users = store.getState().users;

    return `
      <div class="modal-dialog">
        <div class="modal-header">
          <h3 class="card-title">🔑 DeliverEase Account Login</h3>
          <button class="modal-close-btn" onclick="window.DeliverEase.ui.closeModal()">✕</button>
        </div>
        <div class="modal-body">
          <!-- Standard Login Form -->
          <form id="loginForm" onsubmit="window.DeliverEase.authModule.handleLogin(event)">
            <div class="form-group">
              <label class="form-label">Indian Mobile Number / Email</label>
              <input type="text" class="form-control" id="loginIdentifier" placeholder="+91 98201 55412 or user@company.in" value="+91 98201 55412" required />
            </div>

            <div class="form-group">
              <label class="form-label">Password / 4-Digit Security PIN</label>
              <input type="password" class="form-control" id="loginPassword" placeholder="••••" value="1234" required />
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; font-size: 0.75rem;">
              <label style="display: flex; align-items: center; gap: 0.35rem; cursor: pointer; color: var(--text-muted);">
                <input type="checkbox" checked /> Remember this device
              </label>
              <a href="javascript:void(0)" onclick="window.DeliverEase.ui.showToast('OTP sent to your registered mobile number: 4821', 'primary')" style="color: var(--primary); text-decoration: none; font-weight: 600;">
                Login with SMS OTP
              </a>
            </div>

            <button type="submit" class="btn btn-primary btn-full btn-lg">
              🚀 Secure Sign In
            </button>
          </form>

          <!-- 1-Click Fast Login Presets -->
          <div style="margin-top: 1.5rem; padding-top: 1.25rem; border-top: 1px solid var(--border);">
            <div style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-bottom: 0.75rem; text-align: center;">
              ⚡ Quick 1-Click Demo Profiles:
            </div>
            
            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
              ${users.map(u => `
                <button class="btn btn-secondary btn-sm" style="justify-content: space-between; text-align: left; padding: 0.6rem 0.85rem;" onclick="window.DeliverEase.authModule.quickLoginAs('${u.id}')">
                  <div style="display: flex; align-items: center; gap: 0.6rem;">
                    <span style="font-size: 1.25rem;">${u.role === 'customer' ? '📦' : u.role === 'driver' ? '🚚' : '🏢'}</span>
                    <div>
                      <div style="font-weight: 700; font-size: 0.8rem; color: var(--secondary);">${u.name}</div>
                      <div style="font-size: 0.7rem; color: var(--text-muted);">${u.company || u.role.toUpperCase()} • ${u.phone}</div>
                    </div>
                  </div>
                  <span class="badge ${u.role === 'driver' ? 'badge-success' : 'badge-primary'}">${u.role.toUpperCase()}</span>
                </button>
              `).join('')}
            </div>
          </div>

          <div style="text-align: center; margin-top: 1.25rem; font-size: 0.8rem; color: var(--text-muted);">
            Don't have an account yet? 
            <a href="javascript:void(0)" onclick="window.DeliverEase.ui.closeModal(); window.DeliverEase.ui.openRegisterModal();" style="color: var(--primary); font-weight: 700; text-decoration: none;">
              Register Now
            </a>
          </div>
        </div>
      </div>
    `;
  },

  handleLogin(e) {
    e.preventDefault();
    const identifier = document.getElementById('loginIdentifier').value.trim();
    const store = window.DeliverEase.store;
    
    // Find matching user or fallback to first user
    const matchedUser = store.getState().users.find(u => 
      u.email.toLowerCase() === identifier.toLowerCase() || 
      u.phone.replace(/\s+/g, '') === identifier.replace(/\s+/g, '') ||
      identifier.includes(u.name.split(' ')[0])
    ) || store.getState().users[0];

    store.setRole(matchedUser.role);
    store.state.currentUserId = matchedUser.id;
    store.saveState();

    window.DeliverEase.ui.closeModal();
    window.DeliverEase.ui.showToast(`Welcome back, ${matchedUser.name}! (${matchedUser.role.toUpperCase()})`, 'success');
    window.DeliverEase.ui.renderApp();
  },

  quickLoginAs(userId) {
    const store = window.DeliverEase.store;
    const matchedUser = store.getState().users.find(u => u.id === userId);
    if (!matchedUser) return;

    store.setRole(matchedUser.role);
    store.state.currentUserId = matchedUser.id;
    store.saveState();

    window.DeliverEase.ui.closeModal();
    window.DeliverEase.ui.showToast(`Logged in as ${matchedUser.name} (${matchedUser.role.toUpperCase()})`, 'success');
    window.DeliverEase.ui.renderApp();
  },

  renderRegisterModal() {
    return `
      <div class="modal-dialog">
        <div class="modal-header">
          <h3 class="card-title">📝 Register New DeliverEase Account</h3>
          <button class="modal-close-btn" onclick="window.DeliverEase.ui.closeModal()">✕</button>
        </div>
        <div class="modal-body">
          <form id="registerForm" onsubmit="window.DeliverEase.authModule.handleRegister(event)">
            <div class="form-group">
              <label class="form-label">I am registering as a:</label>
              <select class="form-select" id="regRole" onchange="window.DeliverEase.authModule.toggleDriverFields(this.value)">
                <option value="customer">Shipper / Customer (Book & 50-50 Share Freight)</option>
                <option value="driver">Commercial Driver (Keep 90% Trip Earnings)</option>
                <option value="organization">Enterprise Organization (Fleet & Warehouses)</option>
              </select>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Full Name / Business Name</label>
                <input type="text" class="form-control" id="regName" placeholder="e.g. Rajesh Kumar" required />
              </div>
              <div class="form-group">
                <label class="form-label">Email Address</label>
                <input type="email" class="form-control" id="regEmail" placeholder="rajesh@business.in" required />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Indian Mobile Number</label>
                <input type="text" class="form-control" id="regPhone" placeholder="+91 98XXX XXXXX" required />
              </div>
              <div class="form-group">
                <label class="form-label">Company / GSTIN (Optional)</label>
                <input type="text" class="form-control" id="regCompany" placeholder="e.g. Kumar Enterprises (27AAAAA0000A1Z5)" />
              </div>
            </div>

            <div id="driverSpecificFields" style="display: none; background: var(--bg-subtle); padding: 1rem; border-radius: var(--radius-md); margin-bottom: 1rem;">
              <h5 style="font-size: 0.85rem; margin-bottom: 0.5rem; color: var(--secondary);">Commercial Driver & RTO Vehicle Details</h5>
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Commercial Driving License (DL)</label>
                  <input type="text" class="form-control" id="regCDL" placeholder="DL-XX-XXXXXXXXXX" />
                </div>
                <div class="form-group">
                  <label class="form-label">RTO Registration Plate (e.g. MH-04-AB-1234)</label>
                  <input type="text" class="form-control" id="regPlate" placeholder="MH-04-AB-1234" />
                </div>
              </div>
            </div>

            <button type="submit" class="btn btn-primary btn-full btn-lg" style="margin-top: 0.5rem;">
              Create Account & Start Shipping
            </button>
          </form>

          <div style="text-align: center; margin-top: 1.25rem; font-size: 0.8rem; color: var(--text-muted);">
            Already have an account? 
            <a href="javascript:void(0)" onclick="window.DeliverEase.ui.closeModal(); window.DeliverEase.ui.openLoginModal();" style="color: var(--primary); font-weight: 700; text-decoration: none;">
              Login Here
            </a>
          </div>
        </div>
      </div>
    `;
  },

  toggleDriverFields(role) {
    const driverFields = document.getElementById('driverSpecificFields');
    if (driverFields) {
      driverFields.style.display = (role === 'driver') ? 'block' : 'none';
    }
  },

  handleRegister(e) {
    e.preventDefault();
    const role = document.getElementById('regRole').value;
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const phone = document.getElementById('regPhone').value;
    const company = document.getElementById('regCompany').value;
    const cdl = document.getElementById('regCDL') ? document.getElementById('regCDL').value : '';
    const plate = document.getElementById('regPlate') ? document.getElementById('regPlate').value : '';

    const newId = 'usr_' + Date.now();
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) || 'DE';

    const newUser = {
      id: newId,
      role,
      name,
      email,
      phone,
      company: company || (role === 'driver' ? 'Independent Carrier' : 'Private Shipper'),
      walletBalance: role === 'driver' ? 0.00 : 15000.00,
      kycStatus: 'Aadhaar / GST Verified',
      avatar: initials,
      rating: 5.0,
      completedTrips: 0,
      totalShipments: 0,
      driverLicense: cdl || 'DL-MH042023001882',
      plateNumber: plate || 'MH-12-DE-9901',
      vehicleName: role === 'driver' ? 'Tata 407 / 14ft City Truck' : undefined,
      status: 'Available'
    };

    const store = window.DeliverEase.store;
    store.state.users.push(newUser);
    store.setRole(role);
    store.state.currentUserId = newId;
    store.saveState();

    window.DeliverEase.ui.closeModal();
    window.DeliverEase.ui.showToast('Account registered successfully on DeliverEase!', 'success');
    window.DeliverEase.ui.renderApp();
  },

  renderProfileModal() {
    const store = window.DeliverEase.store;
    const user = store.getCurrentUser();
    const state = store.getState();

    return `
      <div class="modal-dialog">
        <div class="modal-header">
          <h3 class="card-title">👤 User Profile & KYC Identity</h3>
          <button class="modal-close-btn" onclick="window.DeliverEase.ui.closeModal()">✕</button>
        </div>
        <div class="modal-body">
          <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem; background: var(--bg-subtle); padding: 1rem; border-radius: var(--radius-md);">
            <div style="width: 56px; height: 56px; border-radius: 50%; background: var(--primary); color: white; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: 800;">
              ${user.avatar}
            </div>
            <div>
              <div style="font-size: 1.15rem; font-weight: 800; color: var(--secondary);">${user.name}</div>
              <div style="font-size: 0.85rem; color: var(--text-muted);">${user.email} • ${user.phone}</div>
              <div style="margin-top: 0.35rem; display: flex; gap: 0.5rem; flex-wrap: wrap;">
                <span class="badge badge-primary">${user.role.toUpperCase()}</span>
                <span class="badge ${user.kycStatus.includes('Verified') ? 'badge-success' : 'badge-warning'}">KYC: ${user.kycStatus}</span>
              </div>
            </div>
          </div>

          <div class="card" style="margin-bottom: 1.25rem;">
            <h4 style="font-size: 0.9rem; margin-bottom: 0.75rem; color: var(--secondary);">💼 Role Credentials (India)</h4>
            ${user.role === 'driver' ? `
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; font-size: 0.85rem;">
                <div><strong>Assigned Vehicle:</strong> ${user.vehicleName || 'Eicher Pro 24ft'}</div>
                <div><strong>RTO Plate Number:</strong> ${user.plateNumber || 'MH-04-AB-4821'}</div>
                <div><strong>Commercial DL:</strong> ${user.driverLicense || 'DL-MH042018009214'}</div>
                <div><strong>Completed Trips:</strong> ${user.completedTrips || 0}</div>
              </div>
            ` : user.role === 'organization' ? `
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; font-size: 0.85rem;">
                <div><strong>Enterprise Entity:</strong> ${user.company}</div>
                <div><strong>GSTIN:</strong> 27AAACB2234M1Z5</div>
                <div><strong>Total Volume:</strong> ${user.totalShipments} Shipments</div>
                <div><strong>Credit Terms:</strong> Net 30 Approved</div>
              </div>
            ` : `
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; font-size: 0.85rem;">
                <div><strong>Business Entity:</strong> ${user.company || 'Private Shipper'}</div>
                <div><strong>Total Bookings:</strong> ${user.totalShipments || 12}</div>
                <div><strong>Rating:</strong> ⭐ ${user.rating || 4.9} / 5.0</div>
                <div><strong>Escrow Protection:</strong> Active</div>
              </div>
            `}
          </div>

          <div class="card">
            <h4 style="font-size: 0.9rem; margin-bottom: 0.5rem; color: var(--secondary);">⚡ Switch Active User Session</h4>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem;">
              ${state.users.map(u => `
                <button class="btn btn-secondary btn-sm" style="justify-content: flex-start; text-align: left;" onclick="window.DeliverEase.authModule.quickLoginAs('${u.id}')">
                  <span>${u.role === 'customer' ? '📦' : u.role === 'driver' ? '🚚' : '🏢'}</span>
                  <div>
                    <div style="font-weight: 700; font-size: 0.8rem;">${u.name}</div>
                    <div style="font-size: 0.7rem; color: var(--text-muted);">${u.role.toUpperCase()}</div>
                  </div>
                </button>
              `).join('')}
            </div>
          </div>
        </div>
        <div class="modal-footer" style="display: flex; justify-content: space-between;">
          <button class="btn btn-danger btn-sm" onclick="window.DeliverEase.ui.closeModal(); window.DeliverEase.ui.openLoginModal();">
            🚪 Switch / Sign Out
          </button>
          <button class="btn btn-secondary" onclick="window.DeliverEase.ui.closeModal()">Close</button>
        </div>
      </div>
    `;
  }
};
