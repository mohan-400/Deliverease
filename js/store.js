/**
 * DeliverEase - Central Unified Store & Reactive Database
 * Powers the All-in-One Model: Single shared data store across Customer, Driver, and Enterprise
 * Secured: Public-facing Admin role and privileges removed for safety and zero exploit surface
 * Configured for Indian Logistics Corridors, GST Invoicing, and INR (₹) Currency with 10% Commission
 */

const STORAGE_KEY = 'deliverease_unified_store_v3';

// Seed Initial Data with Indian Logistics Network (Shipper, Driver, Enterprise)
const SEED_DATA = {
  currentUserRole: 'customer', // 'customer' | 'driver' | 'organization'
  currentUserId: 'usr_cust_01',
  
  users: [
    {
      id: 'usr_cust_01',
      role: 'customer',
      name: 'Priya Sharma',
      email: 'priya.sharma@sharmatex.in',
      phone: '+91 98201 55412',
      company: 'Sharma Textiles & Handlooms',
      walletBalance: 48500.00,
      kycStatus: 'Aadhaar & GST Verified',
      avatar: 'PS',
      rating: 4.9,
      totalShipments: 34
    },
    {
      id: 'usr_drv_01',
      role: 'driver',
      name: 'Gurdeep Singh',
      email: 'gurdeep.singh@delhitrucks.in',
      phone: '+91 98110 44219',
      vehicleId: 'veh_03',
      vehicleName: 'Eicher Pro 24ft Heavy Carrier',
      plateNumber: 'MH-04-AB-4821',
      kycStatus: 'Verified Commercial DL',
      driverLicense: 'DL-MH042018009214',
      avatar: 'GS',
      rating: 4.96,
      completedTrips: 188,
      walletBalance: 92450.00, // 90% Net Earnings
      status: 'In-Transit' // 'Available' | 'In-Transit' | 'Offline'
    },
    {
      id: 'usr_org_01',
      role: 'organization',
      name: 'Bharat Logistics & Supply Chain Ltd',
      email: 'dispatch@bharatlogistics.in',
      phone: '+91 (022) 6677 8899',
      company: 'Bharat Enterprise Supply Solutions',
      walletBalance: 345000.00,
      kycStatus: 'Corporate GST Verified',
      avatar: 'BL',
      rating: 5.0,
      totalShipments: 410
    }
  ],

  vehicleCatalog: [
    {
      id: 'veh_01',
      name: 'Tata Ace / Mahindra Bolero Mini',
      category: 'Small Commercial (SCV)',
      maxWeightKg: 850,
      volumeM3: 4.8,
      baseFare: 800,
      ratePerKm: 16.0,
      icon: '🛺',
      description: 'Ideal for city deliveries, e-commerce parcels & retail cartons'
    },
    {
      id: 'veh_02',
      name: 'Tata 407 / 14ft City Truck',
      category: 'Light Commercial (LCV)',
      maxWeightKg: 2800,
      volumeM3: 20.0,
      baseFare: 2200,
      ratePerKm: 26.0,
      icon: '🚚',
      description: 'Standard pallet freight, FMCG wholesale, industrial machinery'
    },
    {
      id: 'veh_03',
      name: 'Eicher Pro 24ft Heavy Carrier',
      category: 'Medium & Heavy (MHCV)',
      maxWeightKg: 8500,
      volumeM3: 44.0,
      baseFare: 4800,
      ratePerKm: 38.0,
      icon: '🚛',
      description: 'National highway corridors & 50-50 space-sharing capable'
    },
    {
      id: 'veh_04',
      name: 'Ashok Leyland 40ft Multi-Axle Trailer',
      category: 'Heavy Trailer (HCV)',
      maxWeightKg: 28000,
      volumeM3: 92.0,
      baseFare: 9500,
      ratePerKm: 58.0,
      icon: '🏗️',
      description: 'Heavy steel coils, infrastructure equipment & automotive logistics'
    },
    {
      id: 'veh_05',
      name: 'BharatBenz 32ft Cold Reefer',
      category: 'Temperature Controlled (-20°C to +15°C)',
      maxWeightKg: 16000,
      volumeM3: 58.0,
      baseFare: 7500,
      ratePerKm: 48.0,
      tempRange: '-25°C to +15°C',
      icon: '❄️',
      description: 'Pharmaceutical vaccines, dairy products, fresh produce & frozen meat'
    }
  ],

  warehouses: [
    {
      id: 'wh_mum',
      name: 'Bhiwandi Central Logistics Hub',
      city: 'Mumbai / Thane, Maharashtra',
      lat: 19.2969,
      lng: 73.0631,
      capacitySqFt: 250000,
      availableBays: 28,
      crossDockFeePerDay: 850,
      services: ['Cross-Docking', 'Cold Storage', 'Forklift Loading', '24/7 Security', 'Weighbridge']
    },
    {
      id: 'wh_del',
      name: 'Kundli Multi-Modal Freight Depot',
      city: 'Delhi NCR / Sonipat, Haryana',
      lat: 28.8715,
      lng: 77.1264,
      capacitySqFt: 320000,
      availableBays: 34,
      crossDockFeePerDay: 750,
      services: ['Consolidation Hub', 'Return Trip Backhaul', 'Break-Bulk', 'Driver Rest Area']
    },
    {
      id: 'wh_blr',
      name: 'Hosur Road Mega Distribution Gate',
      city: 'Bengaluru / Hosur, Karnataka',
      lat: 12.7409,
      lng: 77.8253,
      capacitySqFt: 210000,
      availableBays: 19,
      crossDockFeePerDay: 800,
      services: ['Tech Freight Handoff', 'Palletizing', 'Return Staging', 'Battery Charging']
    },
    {
      id: 'wh_che',
      name: 'Sriperumbudur Auto-Corridor Hub',
      city: 'Chennai / Sriperumbudur, Tamil Nadu',
      lat: 12.9696,
      lng: 79.9431,
      capacitySqFt: 195000,
      availableBays: 16,
      crossDockFeePerDay: 780,
      services: ['Automotive Staging', 'Port Drayage Transfer', 'Customs Bonded Bay']
    },
    {
      id: 'wh_hyd',
      name: 'Shamshabad Aero-Freight Gateway',
      city: 'Hyderabad, Telangana',
      lat: 17.2403,
      lng: 78.4294,
      capacitySqFt: 180000,
      availableBays: 15,
      crossDockFeePerDay: 720,
      services: ['Pharma Cold Chain', 'Airport Cargo Handoff', 'Rapid Cross-Docking']
    },
    {
      id: 'wh_kol',
      name: 'Dankuni Eastern Freight Terminal',
      city: 'Kolkata / Dankuni, West Bengal',
      lat: 22.6841,
      lng: 88.2917,
      capacitySqFt: 165000,
      availableBays: 14,
      crossDockFeePerDay: 680,
      services: ['Railway Siding Transfer', 'Eastern Corridor Staging', 'Heavy Crane Loading']
    }
  ],

  bookings: [
    {
      id: 'DLE-8921',
      trackingCode: 'DLE-8921',
      customerId: 'usr_cust_01',
      customerName: 'Priya Sharma',
      driverId: 'usr_drv_01',
      driverName: 'Gurdeep Singh',
      vehicleId: 'veh_03',
      vehicleName: 'Eicher Pro 24ft Heavy Carrier',
      origin: 'Mumbai Bhiwandi Hub, Maharashtra',
      originCoords: [19.2969, 73.0631],
      destination: 'Delhi NCR Kundli Depot, Haryana',
      destinationCoords: [28.8715, 77.1264],
      intermediateWarehouseId: 'wh_mum',
      intermediateWarehouseName: 'Bhiwandi Cross-Dock',
      cargoType: 'Textile Fabric & Garment Cartons',
      weightKg: 4600,
      isSpaceShared: false,
      isReturnTrip: false,
      distanceKm: 1420,
      status: 'In-Transit',
      grossFare: 58760.00,
      platformFee: 5876.00, // 10%
      driverEarnings: 52884.00, // 90%
      telemetry: {
        currentCoords: [24.5854, 73.7125], // Udaipur corridor on NH48
        speedKmh: 68,
        etaMinutes: 480,
        tempCelsius: 22.4,
        lastMilestone: 'Passed Udaipur Bypass Toll Plaza (NH48)',
        progressPercent: 58
      },
      createdAt: '2026-08-14T05:30:00Z',
      podOtp: '7419',
      paymentStatus: 'Escrowed'
    },
    {
      id: 'DLE-4410',
      trackingCode: 'DLE-4410',
      customerId: 'usr_cust_01',
      customerName: 'Priya Sharma',
      coShipperId: 'usr_org_01',
      coShipperName: 'Bharat Logistics Ltd',
      driverId: null,
      driverName: 'Unassigned',
      vehicleId: 'veh_03',
      vehicleName: 'Eicher Pro 24ft Heavy Carrier',
      origin: 'Bengaluru Hosur Gate, Karnataka',
      originCoords: [12.7409, 77.8253],
      destination: 'Chennai Sriperumbudur Hub, Tamil Nadu',
      destinationCoords: [12.9696, 79.9431],
      intermediateWarehouseId: 'wh_blr',
      intermediateWarehouseName: 'Hosur Consolidation Bay',
      cargoType: '50/50 Co-Loaded Mixed Freight',
      weightKg: 6200,
      isSpaceShared: true,
      spaceSlotA: {
        shipper: 'Priya Sharma (Retail Goods)',
        weightKg: 3000,
        shareFare: 8750.00 // 50% of ₹17,500
      },
      spaceSlotB: {
        shipper: 'Bharat Logistics (Auto Spares)',
        weightKg: 3200,
        shareFare: 8750.00 // 50% of ₹17,500
      },
      isReturnTrip: false,
      distanceKm: 340,
      status: 'Assigned',
      grossFare: 17500.00,
      platformFee: 1750.00, // 10%
      driverEarnings: 15750.00, // 90%
      telemetry: {
        currentCoords: [12.7409, 77.8253],
        speedKmh: 0,
        etaMinutes: 280,
        tempCelsius: 24.0,
        lastMilestone: 'Both Shippers 50-50 Slots Loaded at Hosur Depot',
        progressPercent: 0
      },
      createdAt: '2026-08-14T07:10:00Z',
      podOtp: '3921',
      paymentStatus: 'Escrowed'
    },
    {
      id: 'DLE-1092',
      trackingCode: 'DLE-1092',
      customerId: 'usr_org_01',
      customerName: 'Bharat Logistics Ltd',
      driverId: null,
      driverName: 'Marketplace Open Load',
      vehicleId: 'veh_02',
      vehicleName: 'Tata 407 City Truck',
      origin: 'Delhi NCR Kundli Depot, Haryana',
      originCoords: [28.8715, 77.1264],
      destination: 'Mumbai Bhiwandi Hub, Maharashtra',
      destinationCoords: [19.2969, 73.0631],
      intermediateWarehouseId: 'wh_del',
      intermediateWarehouseName: 'Kundli Return Hub',
      cargoType: 'Industrial Machine Fasteners & Hardware',
      weightKg: 2400,
      isSpaceShared: false,
      isReturnTrip: true, // Return Load Incentive
      backhaulDiscountPercent: 20,
      distanceKm: 1420,
      status: 'Pending',
      grossFare: 31200.00,
      platformFee: 3120.00, // 10%
      driverEarnings: 28080.00, // 90%
      telemetry: {
        currentCoords: [28.8715, 77.1264],
        speedKmh: 0,
        etaMinutes: 840,
        tempCelsius: 26.0,
        lastMilestone: 'Ready for Return Trip Backhaul Match',
        progressPercent: 0
      },
      createdAt: '2026-08-14T08:00:00Z',
      podOtp: '8820',
      paymentStatus: 'Escrowed'
    }
  ],

  // 50-50 Space Sharing Pool Requests
  spaceSharingPool: [
    {
      id: 'pool_01',
      origin: 'Mumbai (Bhiwandi)',
      destination: 'Delhi NCR (Kundli)',
      originCoords: [19.2969, 73.0631],
      destinationCoords: [28.8715, 77.1264],
      vehicleClass: 'Eicher Pro 24ft Heavy Carrier',
      departureDate: '2026-08-15',
      slotA_Occupied: true,
      slotA_User: 'Priya Sharma (Textiles)',
      slotA_WeightKg: 3800,
      slotB_Occupied: false,
      slotB_User: null,
      slotB_WeightLimitKg: 4500,
      singlePayerStandardRate: 58000.00,
      splitCostPerParty: 29000.00, // 50% off
      savingsTotal: 29000.00
    },
    {
      id: 'pool_02',
      origin: 'Bengaluru (Hosur)',
      destination: 'Hyderabad (Shamshabad)',
      originCoords: [12.7409, 77.8253],
      destinationCoords: [17.2403, 78.4294],
      vehicleClass: 'Tata 407 / 14ft Truck',
      departureDate: '2026-08-16',
      slotA_Occupied: true,
      slotA_User: 'South Tech Electronics',
      slotA_WeightKg: 1200,
      slotB_Occupied: false,
      slotB_User: null,
      slotB_WeightLimitKg: 1500,
      singlePayerStandardRate: 19800.00,
      splitCostPerParty: 9900.00, // 50% off
      savingsTotal: 9900.00
    }
  ],

  // Return Trip Backhaul Marketplace
  returnTrips: [
    {
      id: 'ret_01',
      originCity: 'Delhi NCR (Kundli)',
      destinationCity: 'Mumbai (Bhiwandi)',
      availableFrom: '2026-08-15',
      driverName: 'Gurdeep Singh',
      driverVehicle: 'Eicher Pro 24ft Heavy Carrier',
      availableCapacityKg: 8500,
      incentiveDiscount: '20% Off Standard Freight',
      offeredRate: 46400.00,
      status: 'Open for Bookings'
    },
    {
      id: 'ret_02',
      originCity: 'Chennai (Sriperumbudur)',
      destinationCity: 'Bengaluru (Hosur)',
      availableFrom: '2026-08-16',
      driverName: 'Karthik Raman',
      driverVehicle: 'Tata 407 City Truck',
      availableCapacityKg: 2800,
      incentiveDiscount: '25% Off Standard Freight',
      offeredRate: 13125.00,
      status: 'Open for Bookings'
    }
  ],

  // Financial Ledger & 10% Commission Logs
  transactions: [
    {
      id: 'TXN-901',
      bookingId: 'DLE-8921',
      date: '2026-08-14 05:30',
      description: 'Freight Booking DLE-8921 (Mumbai -> Delhi NCR)',
      grossAmount: 58760.00,
      platformCommissionRate: '10%',
      platformFee: 5876.00,
      driverNetPayout: 52884.00,
      status: 'Escrow Locked',
      type: 'Customer Payment'
    },
    {
      id: 'TXN-882',
      bookingId: 'DLE-4410',
      date: '2026-08-14 07:10',
      description: '50-50 Shared Load DLE-4410 (Bengaluru -> Chennai)',
      grossAmount: 17500.00,
      platformCommissionRate: '10%',
      platformFee: 1750.00,
      driverNetPayout: 15750.00,
      status: 'Escrow Locked',
      type: '50-50 Split Payment'
    },
    {
      id: 'TXN-750',
      bookingId: 'DLE-7210',
      date: '2026-08-13 19:15',
      description: 'Completed Delivery DLE-7210 (Pune -> Hyderabad)',
      grossAmount: 32000.00,
      platformCommissionRate: '10%',
      platformFee: 3200.00,
      driverNetPayout: 28800.00,
      status: 'Settled to Driver Bank',
      type: 'Driver Payout Release'
    }
  ],

  // Real-time Notification Feed
  notifications: [
    {
      id: 'notif_01',
      title: 'Active GPS Highway Update',
      message: 'Driver Gurdeep Singh (DLE-8921) crossed Udaipur Bypass (NH48). On track for Delhi NCR Kundli Depot.',
      category: 'tracking',
      time: '12 mins ago',
      read: false
    },
    {
      id: 'notif_02',
      title: '50-50 Space Match Confirmed!',
      message: 'Priya Sharma & Bharat Logistics paired on Bengaluru -> Chennai route. ₹8,750 savings applied.',
      category: 'spaceshare',
      time: '50 mins ago',
      read: false
    },
    {
      id: 'notif_03',
      title: '10% Commission Payout Released',
      message: 'Gurdeep Singh received ₹28,800.00 net (90%) for completed delivery DLE-7210 via IMPS.',
      category: 'payment',
      time: '2 hours ago',
      read: true
    },
    {
      id: 'notif_04',
      title: 'Return Backhaul Load Available',
      message: 'New return freight posted: Delhi NCR -> Mumbai. 20% discount for zero-deadhead return.',
      category: 'warehouse',
      time: '3 hours ago',
      read: true
    }
  ]
};

class DeliverEaseStore {
  constructor() {
    this.subscribers = {};
    this.state = this.loadState();
  }

  loadState() {
    try {
      const serialized = localStorage.getItem(STORAGE_KEY);
      if (serialized) {
        return JSON.parse(serialized);
      }
    } catch (e) {
      console.warn('DeliverEaseStore: Failed to read from localStorage, using seed data', e);
    }
    return JSON.parse(JSON.stringify(SEED_DATA));
  }

  saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.warn('DeliverEaseStore: Failed to persist to localStorage', e);
    }
  }

  getState() {
    return this.state;
  }

  subscribe(event, callback) {
    if (!this.subscribers[event]) {
      this.subscribers[event] = [];
    }
    this.subscribers[event].push(callback);
    return () => {
      this.subscribers[event] = this.subscribers[event].filter(cb => cb !== callback);
    };
  }

  emit(event, payload) {
    if (this.subscribers[event]) {
      this.subscribers[event].forEach(cb => cb(payload, this.state));
    }
    if (event !== 'all' && this.subscribers['*']) {
      this.subscribers['*'].forEach(cb => cb({ event, payload }, this.state));
    }
  }

  // --- Actions ---

  setRole(role) {
    // Only allow customer, driver, organization
    if (role !== 'customer' && role !== 'driver' && role !== 'organization') {
      role = 'customer';
    }
    this.state.currentUserRole = role;
    const userMap = {
      customer: 'usr_cust_01',
      driver: 'usr_drv_01',
      organization: 'usr_org_01'
    };
    this.state.currentUserId = userMap[role] || 'usr_cust_01';
    this.saveState();
    this.emit('role:changed', { role, user: this.getCurrentUser() });
  }

  getCurrentUser() {
    return this.state.users.find(u => u.id === this.state.currentUserId) || this.state.users[0];
  }

  addBooking(bookingData, isSilent = false) {
    const trackingCode = 'DLE-' + Math.floor(1000 + Math.random() * 9000);
    const grossFare = parseFloat(bookingData.grossFare || 15000);
    const platformFee = Number((grossFare * 0.10).toFixed(2)); // Strict 10% model
    const driverEarnings = Number((grossFare * 0.90).toFixed(2)); // Strict 90% payout
    
    const newBooking = {
      id: trackingCode,
      trackingCode: trackingCode,
      customerId: this.state.currentUserId,
      customerName: this.getCurrentUser().name,
      driverId: bookingData.driverId || null,
      driverName: bookingData.driverName || 'Pending Driver Acceptance',
      vehicleId: bookingData.vehicleId,
      vehicleName: bookingData.vehicleName,
      origin: bookingData.origin,
      originCoords: bookingData.originCoords || [19.2969, 73.0631],
      destination: bookingData.destination,
      destinationCoords: bookingData.destinationCoords || [28.8715, 77.1264],
      intermediateWarehouseId: bookingData.intermediateWarehouseId || null,
      intermediateWarehouseName: bookingData.intermediateWarehouseName || 'Direct Highway Route',
      cargoType: bookingData.cargoType,
      weightKg: parseInt(bookingData.weightKg || 2500),
      isSpaceShared: Boolean(bookingData.isSpaceShared),
      isReturnTrip: Boolean(bookingData.isReturnTrip),
      distanceKm: bookingData.distanceKm || 950,
      status: 'Pending',
      grossFare: grossFare,
      platformFee: platformFee,
      driverEarnings: driverEarnings,
      telemetry: {
        currentCoords: bookingData.originCoords || [19.2969, 73.0631],
        speedKmh: 0,
        etaMinutes: Math.round((bookingData.distanceKm || 950) / 1.1),
        tempCelsius: 24,
        lastMilestone: 'Shipment Created in DeliverEase Network',
        progressPercent: 0
      },
      createdAt: new Date().toISOString(),
      podOtp: Math.floor(1000 + Math.random() * 9000).toString(),
      paymentStatus: 'Escrowed'
    };

    this.state.bookings.unshift(newBooking);

    // Record escrow transaction
    this.state.transactions.unshift({
      id: 'TXN-' + Math.floor(100 + Math.random() * 900),
      bookingId: trackingCode,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      description: `Freight Booking ${trackingCode} (${bookingData.origin} -> ${bookingData.destination})`,
      grossAmount: grossFare,
      platformCommissionRate: '10%',
      platformFee: platformFee,
      driverNetPayout: driverEarnings,
      status: 'Escrow Locked',
      type: 'Customer Payment'
    });

    this.saveState();
    if (window.DeliverEase.cloudDB && window.DeliverEase.cloudDB.syncBooking) {
      window.DeliverEase.cloudDB.syncBooking(newBooking);
    }
    this.emit('booking:created', newBooking);
    if (!isSilent) {
      this.addNotification('New Booking Confirmed!', `Shipment ${trackingCode} registered. Total fare: ₹${grossFare.toLocaleString('en-IN')}`, 'booking');
    }
    return newBooking;
  }

  joinSpaceSharingPool(poolId, cargoDetails) {
    const pool = this.state.spaceSharingPool.find(p => p.id === poolId);
    if (!pool) return false;

    pool.slotB_Occupied = true;
    pool.slotB_User = this.getCurrentUser().name + ` (${cargoDetails.goods || 'Freight'})`;

    // Convert into active booking
    const booking = this.addBooking({
      vehicleId: 'veh_03',
      vehicleName: pool.vehicleClass,
      origin: pool.origin,
      originCoords: pool.originCoords,
      destination: pool.destination,
      destinationCoords: pool.destinationCoords,
      cargoType: '50-50 Shared Load: ' + cargoDetails.goods,
      weightKg: cargoDetails.weightKg || 3000,
      isSpaceShared: true,
      distanceKm: 1400,
      grossFare: pool.singlePayerStandardRate,
      intermediateWarehouseName: 'Co-Load Consolidation Bay'
    }, true);

    this.saveState();
    if (window.DeliverEase.cloudDB && window.DeliverEase.cloudDB.syncPool) {
      window.DeliverEase.cloudDB.syncPool(pool);
    }
    this.emit('spaceshare:matched', { pool, booking });
    this.addNotification('50-50 Space Match Secured!', `You saved 50% (₹${pool.splitCostPerParty.toLocaleString('en-IN')}) by sharing cargo space to ${pool.destination}!`, 'spaceshare');
    return booking;
  }

  createSpaceSharingOffer(offerData) {
    const newPool = {
      id: 'pool_' + Date.now(),
      origin: offerData.origin,
      destination: offerData.destination,
      originCoords: offerData.originCoords || [19.2969, 73.0631],
      destinationCoords: offerData.destinationCoords || [28.8715, 77.1264],
      vehicleClass: offerData.vehicleClass || 'Eicher Pro 24ft Heavy Carrier',
      departureDate: offerData.departureDate || '2026-08-16',
      slotA_Occupied: true,
      slotA_User: this.getCurrentUser().name + ` (${offerData.goods})`,
      slotA_WeightKg: parseInt(offerData.weightKg || 3000),
      slotB_Occupied: false,
      slotB_User: null,
      slotB_WeightLimitKg: parseInt(offerData.maxWeightKg || 8000) - parseInt(offerData.weightKg || 3000),
      singlePayerStandardRate: parseFloat(offerData.standardFare || 48000),
      splitCostPerParty: parseFloat(offerData.standardFare || 48000) / 2,
      savingsTotal: parseFloat(offerData.standardFare || 48000) / 2
    };

    this.state.spaceSharingPool.unshift(newPool);
    this.saveState();
    if (window.DeliverEase.cloudDB && window.DeliverEase.cloudDB.syncPool) {
      window.DeliverEase.cloudDB.syncPool(newPool);
    }
    this.emit('spaceshare:created', newPool);
    this.addNotification('50-50 Share Offer Listed', `Your half-load offer to ${offerData.destination} is now open for matching!`, 'spaceshare');
    return newPool;
  }

  bookReturnTrip(returnTripId) {
    const ret = this.state.returnTrips.find(r => r.id === returnTripId);
    if (!ret) return false;

    ret.status = 'Booked';

    const booking = this.addBooking({
      vehicleId: 'veh_03',
      vehicleName: ret.driverVehicle,
      origin: ret.originCity,
      destination: ret.destinationCity,
      cargoType: 'Return Backhaul Freight',
      weightKg: 4500,
      isReturnTrip: true,
      distanceKm: 1200,
      grossFare: ret.offeredRate,
      driverName: ret.driverName
    });

    this.saveState();
    this.emit('returnTrip:booked', { returnTrip: ret, booking });
    this.addNotification('Return Load Booked!', `Backhaul discount secured for ${ret.originCity} -> ${ret.destinationCity}!`, 'warehouse');
    return booking;
  }

  driverAcceptJob(bookingId) {
    const booking = this.state.bookings.find(b => b.id === bookingId);
    const driver = this.getCurrentUser();
    if (!booking) return false;

    booking.driverId = driver.id;
    booking.driverName = driver.name;
    booking.status = 'Assigned';
    booking.telemetry.lastMilestone = `Accepted by Driver ${driver.name}`;

    this.saveState();
    if (window.DeliverEase.cloudDB && window.DeliverEase.cloudDB.syncBooking) {
      window.DeliverEase.cloudDB.syncBooking(booking);
    }
    this.emit('driver:jobAccepted', booking);
    this.addNotification('Load Accepted!', `You accepted shipment ${booking.id}. Proceed to pickup warehouse.`, 'driver');
    return true;
  }

  updateTripStatus(bookingId, newStatus, podOtpInput = null) {
    const booking = this.state.bookings.find(b => b.id === bookingId);
    if (!booking) return false;

    if (newStatus === 'Delivered') {
      if (podOtpInput && podOtpInput !== booking.podOtp) {
        return { success: false, error: 'Invalid Delivery OTP Verification Code' };
      }
      booking.status = 'Delivered';
      booking.telemetry.progressPercent = 100;
      booking.telemetry.speedKmh = 0;
      booking.telemetry.etaMinutes = 0;
      booking.telemetry.lastMilestone = 'Successfully Delivered & Verified with OTP';
      booking.paymentStatus = 'Settled';

      // Release driver payout (90%) directly to driver wallet
      const driver = this.state.users.find(u => u.id === (booking.driverId || 'usr_drv_01'));
      if (driver) {
        driver.walletBalance += booking.driverEarnings;
        driver.completedTrips = (driver.completedTrips || 0) + 1;
      }

      this.addNotification('Trip Delivered & Payout Released!', `Driver received 90% (₹${booking.driverEarnings.toLocaleString('en-IN')}) directly to wallet. Platform fee 10% (₹${booking.platformFee.toLocaleString('en-IN')}) settled.`, 'payment');
    } else {
      booking.status = newStatus;
      if (newStatus === 'Picked-Up') {
        booking.telemetry.progressPercent = 15;
        booking.telemetry.lastMilestone = 'Cargo Inspected, E-Way Bill Verified & Loaded';
      } else if (newStatus === 'In-Transit') {
        booking.telemetry.progressPercent = 45;
        booking.telemetry.speedKmh = 65;
        booking.telemetry.lastMilestone = 'En Route on National Highway with Live GPS Telemetry';
      }
    }

    this.saveState();
    if (window.DeliverEase.cloudDB && window.DeliverEase.cloudDB.syncBooking) {
      window.DeliverEase.cloudDB.syncBooking(booking);
    }
    this.emit('trip:updated', booking);
    return { success: true, booking };
  }

  addNotification(title, message, category = 'system') {
    const notif = {
      id: 'notif_' + Date.now(),
      title,
      message,
      category,
      time: 'Just now',
      read: false
    };
    this.state.notifications.unshift(notif);
    if (this.state.notifications.length > 30) {
      this.state.notifications.pop();
    }
    this.saveState();
    this.emit('notification:added', notif);
  }

  markAllNotificationsRead() {
    this.state.notifications.forEach(n => n.read = true);
    this.saveState();
    this.emit('notification:read', {});
  }

  resetDemoData() {
    this.state = JSON.parse(JSON.stringify(SEED_DATA));
    this.saveState();
    this.emit('state:reset', this.state);
  }
}

// Export singleton
window.DeliverEase = window.DeliverEase || {};
window.DeliverEase.store = new DeliverEaseStore();
window.TransLogix = window.DeliverEase;
