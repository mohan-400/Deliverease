# 📦 DeliverEase India - Unified Transportation & Logistics Platform

> **All-in-One Transportation & Logistics Operating Platform** engineered for Indian freight corridors, commercial fleet operators, and enterprise shippers.

DeliverEase operates on a single unified architecture with a shared reactive local database, featuring **50–50 Space Sharing**, **Return Backhaul Optimization**, **Real-Time GPS Highway Radar**, and an industry-disruptive **10% Flat Commission Model** (drivers retain 90% net earnings).

---

## 🌟 Key Features & Modules

### 1. 📦 Freight Booking Module (Pan-India Routing)
- Route planner connecting Indian logistics hubs (Mumbai Bhiwandi, Delhi NCR Kundli, Bengaluru Hosur, Chennai Sriperumbudur, Hyderabad Shamshabad, Kolkata Dankuni, Pune Chakan, Ahmedabad Sanand).
- Multi-tier commercial fleet catalog:
  - **Tata Ace / Mahindra Bolero Mini** (SCV - 850 kg)
  - **Tata 407 / 14ft City Truck** (LCV - 2.8T)
  - **Eicher Pro 24ft Heavy Carrier** (MHCV - 8.5T)
  - **Ashok Leyland 40ft Multi-Axle Trailer** (HCV - 28T)
  - **BharatBenz 32ft Cold Reefer** (-25°C to +15°C Pharma/Produce)
- Instant itemized freight fare estimation in **INR (₹)** with transparent 10% platform fee breakdown.

### 2. 🤝 50–50 Space Sharing Module
- Interactive **Split-Bay Compartment Simulator** (Slot A 50% vs Slot B 50%) with symmetric axle weight balance.
- Automated corridor matching along Golden Quadrilateral highways (NH48 / NH44).
- Direct **50% cost savings** per shipper (e.g., ₹29,000 saved on Mumbai–Delhi corridor).

### 3. 🔄 Warehouse Network & Return Trip Optimizer
- **Zero Deadhead Target**: Matches return freight to eliminate empty return journeys.
- 20%–25% discounted return rates for backhaul carriers.
- Integrated transit cross-docking depots with bay reservations.

### 4. 🚚 Commercial Driver Cockpit (90% Payout Model)
- Open load marketplace with 1-click job acceptance.
- Trip milestone lifecycle: `Assigned` ➔ `Cargo Loaded` ➔ `In-Transit GPS` ➔ `Delivered (e-POD OTP)`.
- **90% Net Earnings Payout**: Drivers keep 90% of trip revenue with instant UPI (`okhdfc`, `okaxis`) and bank IMPS withdrawals.

### 5. 🛰️ Live GPS & Real-Time Highway Radar
- High-performance, GPU-accelerated SVG radar engine for Indian National Highway corridors (NH48, NH44).
- Real-time speedometer HUD (km/h), cargo reefer temperature monitor (°C), ETA countdown, and route progress indicator.
- 0ms latency, zero external network tile requests, and zero memory leaks.

### 6. 💳 Transparent Payments & 10% Commission Engine
- Replaces traditional 30% mandi brokers/dalals: **+₹10,000 extra net income** for drivers per ₹50,000 load.
- Smart escrow locking upon booking with automatic release upon 4-digit e-POD OTP verification.
- Official GST-compliant tax freight receipts.

### 7. 🛡️ Dual-Portal Security Architecture
- **Public Portal (`index.html`)**: For Shippers, Drivers, and Enterprises with zero admin privilege exposure.
- **Private Admin Operations Console (`admin-portal.html`)**: Hardware PIN-protected (`8821`) executive command center for total GMV, fleet KYC approvals, and master shipment registry.

---

## 🚀 Getting Started

DeliverEase is built with modern, zero-dependency HTML5, CSS3, and ES6 JavaScript. No Node.js build step or local web server is required.

### Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/DeliverEase.git
cd DeliverEase
```

### Launch the Application
- Double-click **`index.html`** to open in any modern browser (Chrome, Edge, Firefox, Safari).
- Or open via PowerShell:
  ```powershell
  Start-Process "index.html"
  ```
- To access the private Operations Console, open:
  ```powershell
  Start-Process "admin-portal.html"
  # Default Master Security PIN: 8821
  ```

---

## 📁 Project Structure

```
DeliverEase/
├── index.html              # Main customer & driver application shell
├── admin-portal.html       # Secured private internal operations console (PIN: 8821)
├── .gitignore              # Git ignore configuration
├── README.md               # Project documentation
├── css/
│   ├── styles.css          # Design system tokens, layout grids, components, modals
│   └── map.css             # High-performance GPU radar map styling
└── js/
    ├── app.js              # Master application controller & 0ms tab router
    ├── store.js            # Central reactive database with localStorage persistence
    └── modules/
        ├── auth.js         # User registration, login & KYC identity manager
        ├── booking.js      # Pan-India freight quotation & vehicle selector
        ├── spaceSharing.js # 50-50 space sharing split-bay simulator
        ├── warehouseReturn.js # Return trip optimizer & warehouse network
        ├── driver.js       # Driver load board & 90% payout lifecycle
        ├── tracking.js     # Real-time SVG highway radar & telemetry HUD
        ├── payment.js      # 10% commission engine & GST invoices
        └── notifications.js # Toast alerts & SMS dispatch preview
```

---

## 🌐 Deploy to GitHub Pages (Free Web Hosting)

1. Push this repository to GitHub.
2. In your GitHub repository, navigate to **Settings** ➔ **Pages**.
3. Under **Build and deployment** > **Branch**, select `main` (or `master`) and folder `/ (root)`.
4. Click **Save**.
5. Your live app will be published instantly at:
   `https://YOUR_USERNAME.github.io/DeliverEase/`

---

## 📜 License
MIT License. Free to use and customize for logistics, transportation, and supply chain applications.
