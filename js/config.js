/**
 * HENRY Automotive - Models, Configurator & Specifications Data
 */

const HENRY_DATA = {
  brand: {
    name: "HENRY",
    tagline: "Premium Made Possible",
    subtitle: "Premium design. Intelligent technology. Honest pricing.",
    startingPrice: "₹9.99 Lakh",
    warranty: "5 Years / 100,000 km Standard Warranty",
    roadsideAssistance: "24/7 Nationwide Roadside Assistance"
  },

  models: {
    A1: {
      id: "A1",
      name: "HENRY A1",
      tag: "Executive Luxury Sedan",
      basePrice: 9.99, // in Lakhs
      priceFormatted: "₹9.99 Lakh",
      deliveryTime: "2-3 Weeks",
      heroImage: "sedan",
      specs: {
        powertrain: "1.5L Turbo GDI / HyperHybrid",
        power: "185 PS (136 kW)",
        torque: "275 Nm @ 1750-4000 rpm",
        acceleration: "0-100 km/h in 7.4s",
        topSpeed: "215 km/h",
        mileage: "19.8 km/l (Hybrid: 24.2 km/l)",
        seating: "5 Passengers",
        bootSpace: "510 Litres",
        transmission: "7-Speed Dual-Clutch DCT",
        drivetrain: "Front-Wheel Drive",
        groundClearance: "172 mm",
        length: "4,680 mm",
        width: "1,840 mm",
        wheelbase: "2,750 mm",
        safetyRating: "5-Star Global Safety Target",
        screenSize: "14.6-inch Dual Curved 4K OLED"
      },
      keyFeatures: [
        "AeroDynamic Fastback Silhouette (Cd 0.23)",
        "HENRY SmartDrive Level 2 ADAS Suite",
        "Panoramic Acoustic Moonroof",
        "Ventilated Nappa Leather Seats with Memory",
        "12-Speaker SoundStage Audio with Subwoofer",
        "Full LED Matrix Headlamps with Dynamic Swipes"
      ],
      description: "The HENRY A1 redefines executive sedans with razor-sharp coupe-like proportions, whisper-quiet cabin acoustics, and class-leading turbo performance at an unbeatable price."
    },

    X1: {
      id: "X1",
      name: "HENRY X1",
      tag: "Premium Dynamic SUV",
      basePrice: 14.99,
      priceFormatted: "₹14.99 Lakh",
      deliveryTime: "3-4 Weeks",
      heroImage: "suv",
      specs: {
        powertrain: "2.0L Bi-Turbo GDI Hybrid",
        power: "225 PS (165 kW)",
        torque: "380 Nm @ 1600-4500 rpm",
        acceleration: "0-100 km/h in 6.8s",
        topSpeed: "220 km/h",
        mileage: "17.6 km/l",
        seating: "5 or 7 Passengers (Foldable 3rd Row)",
        bootSpace: "640 Litres (expandable to 1,650L)",
        transmission: "8-Speed Torque Converter with Paddle Shifters",
        drivetrain: "Intelligent All-Wheel Drive (AWD)",
        groundClearance: "208 mm",
        length: "4,740 mm",
        width: "1,890 mm",
        wheelbase: "2,820 mm",
        safetyRating: "5-Star Global Safety Target",
        screenSize: "15.6-inch Floating Cinema Touchscreen"
      },
      keyFeatures: [
        "TerrainSense 5-Mode Intelligent AWD",
        "Adaptive Air Suspension with Height Adjust",
        "AeroBlade Signature Daytime LED Lighting",
        "Tri-Zone Automatic Climate Control with PM2.5 Purifier",
        "360° Ultra-HD Transparent Ground Camera",
        "Wireless Apple CarPlay & Android Auto with 50W Fast Charger"
      ],
      description: "Commanding road presence meets supreme family luxury. The HENRY X1 blends rugged off-road capability, expansive cabin room, and bespoke refinement for any journey."
    },

    E1: {
      id: "E1",
      name: "HENRY E1",
      tag: "Pure Electric Luxury SUV",
      basePrice: 16.99,
      priceFormatted: "₹16.99 Lakh",
      deliveryTime: "1-2 Weeks",
      heroImage: "electric",
      specs: {
        powertrain: "HyperVolt Dual-Motor Electric AWD",
        power: "320 PS (235 kW)",
        torque: "560 Nm Instant Torque",
        acceleration: "0-100 km/h in 4.9s",
        topSpeed: "205 km/h (Electronically Limited)",
        range: "520 km (ARAI Certified WLTP equivalent)",
        batteryCapacity: "78.2 kWh Liquid-Cooled LFP Blade Battery",
        chargingTime: "10% to 80% in 18 mins (150kW DC Fast Charge)",
        seating: "5 Passengers",
        bootSpace: "580 Litres + 45L Front Trunk (Frunk)",
        transmission: "Single-Speed Direct Drive",
        drivetrain: "Dual-Motor Electric AWD",
        groundClearance: "195 mm",
        length: "4,710 mm",
        width: "1,910 mm",
        wheelbase: "2,860 mm",
        safetyRating: "5-Star Global Safety Target",
        screenSize: "16-inch HyperCockpit with Holographic HUD"
      },
      keyFeatures: [
        "HyperVolt 800V Ultra-Fast Charging Architecture",
        "Vehicle-to-Load (V2L) 3.3kW Power Output for Devices",
        "Active Aerodynamic Grille Shutter & Flush Door Handles",
        "Augmented Reality Head-Up Display (AR-HUD)",
        "Zero-Gravity Reclining Front Relaxation Seats",
        "Bi-Directional Smart Regenerative Braking with 1-Pedal Mode"
      ],
      description: "The future of sustainable high-performance mobility. The HENRY E1 combines mind-bending dual-motor acceleration, 520 km real-world range, and next-generation autonomous safety."
    }
  },

  configurator: {
    colors: [
      {
        id: "obsidian-black",
        name: "Obsidian Shadow Black",
        type: "Metallic Gloss",
        hex: "#0c0d10",
        carGradStart: "#282a32",
        carGradMid: "#121318",
        carGradEnd: "#08090b",
        glow: "rgba(56, 189, 248, 0.4)",
        price: 0,
        priceLabel: "Included"
      },
      {
        id: "celestial-silver",
        name: "Celestial Titanium Silver",
        type: "Liquid Metallic",
        hex: "#94a3b8",
        carGradStart: "#f1f5f9",
        carGradMid: "#94a3b8",
        carGradEnd: "#475569",
        glow: "rgba(226, 232, 240, 0.5)",
        price: 0.25,
        priceLabel: "+₹25,000"
      },
      {
        id: "glacier-white",
        name: "Glacier Pearl White",
        type: "Multi-Coat Pearl",
        hex: "#f8fafc",
        carGradStart: "#ffffff",
        carGradMid: "#e2e8f0",
        carGradEnd: "#94a3b8",
        glow: "rgba(255, 255, 255, 0.6)",
        price: 0.20,
        priceLabel: "+₹20,000"
      },
      {
        id: "deep-blue",
        name: "Deep Cosmos Royal Blue",
        type: "Signature Metallic",
        hex: "#0284c7",
        carGradStart: "#38bdf8",
        carGradMid: "#0369a1",
        carGradEnd: "#082f49",
        glow: "rgba(56, 189, 248, 0.8)",
        price: 0.30,
        priceLabel: "+₹30,000"
      },
      {
        id: "crimson-ruby",
        name: "Crimson Blaze Red",
        type: "Tinted Clearcoat",
        hex: "#e11d48",
        carGradStart: "#fb7185",
        carGradMid: "#be123c",
        carGradEnd: "#4c0519",
        glow: "rgba(244, 63, 94, 0.7)",
        price: 0.35,
        priceLabel: "+₹35,000"
      }
    ],

    wheels: [
      {
        id: "wheel-18-aero",
        name: "18\" Aero Turbine Alloy",
        desc: "Low-drag efficiency design with brushed diamond lip",
        style: "turbine",
        price: 0,
        priceLabel: "Standard"
      },
      {
        id: "wheel-19-sport",
        name: "19\" V-Spoke Matte Titanium",
        desc: "Lightweight forged alloy with aggressive sport stance",
        style: "v-spoke",
        price: 0.40,
        priceLabel: "+₹40,000"
      },
      {
        id: "wheel-20-diamond",
        name: "20\" Multi-Spoke Stealth Black Cut",
        desc: "Premium executive finish with red brake caliper accent",
        style: "diamond-cut",
        price: 0.65,
        priceLabel: "+₹65,000"
      }
    ],

    interiors: [
      {
        id: "int-black",
        name: "Onyx Midnight Eco-Leather",
        desc: "Perforated breathable sport seats with brushed aluminum trim",
        swatch: "#18181b",
        trimColor: "#71717a",
        price: 0,
        priceLabel: "Included"
      },
      {
        id: "int-cognac",
        name: "Cognac Tan Nappa Leather",
        desc: "Warm European hand-stitched leather with open-pore walnut wood",
        swatch: "#b45309",
        trimColor: "#d97706",
        price: 0.45,
        priceLabel: "+₹45,000"
      },
      {
        id: "int-white",
        name: "Arctic Alabaster Duo-Tone",
        desc: "Ultra-luxury stain-resistant vegan leather with carbon fiber inserts",
        swatch: "#f1f5f9",
        trimColor: "#0284c7",
        price: 0.55,
        priceLabel: "+₹55,000"
      }
    ],

    powertrains: {
      A1: [
        { id: "p-turbo", name: "1.5L Turbo GDI (185 PS)", desc: "Quick response 7-Speed DCT", price: 0, label: "Standard" },
        { id: "p-hybrid", name: "1.5L HyperHybrid (210 PS)", desc: "Self-charging dual electric assist (24.2 km/l)", price: 0.85, label: "+₹85,000" }
      ],
      X1: [
        { id: "p-turbo-x", name: "2.0L Turbo FWD (195 PS)", desc: "Effortless highway cruiser 8-Speed AT", price: 0, label: "Standard" },
        { id: "p-awd-hybrid", name: "2.0L Bi-Turbo Hybrid AWD (225 PS)", desc: "TerrainSense Intelligent All-Wheel Drive", price: 1.20, label: "+₹1.20 Lakh" }
      ],
      E1: [
        { id: "p-ev-single", name: "Single Motor RWD (210 PS - 450 km)", desc: "Ultra-efficient 64 kWh Battery Pack", price: 0, label: "Standard" },
        { id: "p-ev-dual", name: "Dual-Motor AWD Performance (320 PS - 520 km)", desc: "0-100 in 4.9s + 78.2 kWh Battery Pack", price: 1.50, label: "+₹1.50 Lakh" }
      ]
    },

    packages: [
      {
        id: "pkg-adas",
        name: "HENRY SmartDrive Pro ADAS",
        desc: "Level 2+ Autopilot, automated lane changes, adaptive cruise control & 360 collision shield",
        price: 0.50,
        priceLabel: "+₹50,000"
      },
      {
        id: "pkg-skyroof",
        name: "Panoramic SkyLounge Glass Roof",
        desc: "Electrochromic smart tinting glass with ambient constellation star lighting",
        price: 0.35,
        priceLabel: "+₹35,000"
      },
      {
        id: "pkg-audio",
        name: "14-Speaker SoundStage 3D Audio",
        desc: "740W amplifier, subwoofer, Dolby Atmos spatial audio & active noise cancellation",
        price: 0.30,
        priceLabel: "+₹30,000"
      },
      {
        id: "pkg-comfort",
        name: "Executive Climate & Comfort Pack",
        desc: "Front seat ventilation + heating, driver massage function & air aroma diffuser",
        price: 0.25,
        priceLabel: "+₹25,000"
      }
    ]
  },

  technologies: [
    {
      id: "smartdrive",
      title: "HENRY SmartDrive",
      badge: "Autonomous Intelligence",
      icon: "cpu",
      summary: "Intelligent driver-assistance technology designed for urban and highway mastery.",
      points: [
        "Level 2+ Highway Pilot with Hands-Free Lane Centering",
        "Autonomous Emergency Braking (AEB) with Pedestrian & Cyclist Detection",
        "Traffic Jam Assist with stop-and-go automated queue following",
        "Remote Smart Valet Park via HENRY Mobile App"
      ],
      stats: { primary: "10ms", label: "Collision Reaction Speed", secondary: "360°", sublabel: "Continuous Sensor Radar Envelope" }
    },
    {
      id: "connect",
      title: "HENRY Connect",
      badge: "Always Connected",
      icon: "wifi",
      summary: "Next-gen connected vehicle cockpit and smartphone ecosystem.",
      points: [
        "15.6\" Ultra-HD OLED Cockpit with snappy 120Hz refresh rate",
        "Digital Key 3.0 via iPhone & Android with NFC & Ultra-Wideband (UWB)",
        "Over-The-Air (OTA) firmware updates that improve performance forever",
        "Remote Climate Pre-Cooling, Cabin Purifier & Geofence tracking"
      ],
      stats: { primary: "5G", label: "Cloud Telematics Link", secondary: "100+", sublabel: "OTA Remote Vehicle Features" }
    },
    {
      id: "smartsense",
      title: "HENRY SmartSense",
      badge: "Sensor Fusion Core",
      icon: "shield-alert",
      summary: "Military-grade sensor suite providing an uncompromised 360-degree protective cocoon.",
      points: [
        "12 Ultrasonic Acoustic Sensors for millimeter precision parking",
        "5 High-Frequency mmWave Radars penetrating dense fog and heavy rain",
        "8 High-Dynamic-Range Cameras with Ultra-HD night vision enhancement",
        "Solid-State LiDAR module with real-time 3D voxel point cloud mapping"
      ],
      stats: { primary: "250m", label: "Long-Range Forward Radar", secondary: "8 Airbags", sublabel: "Dual-Stage Smart Deployment" }
    },
    {
      id: "powercore",
      title: "HENRY PowerCore",
      badge: "High-Efficiency Powertrains",
      icon: "zap",
      summary: "Cutting-edge thermal efficiency and next-generation 800V HyperVolt battery architecture.",
      points: [
        "42.5% Thermal Efficiency Turbo-GDI combustion engineering",
        "HyperVolt 800V Silicon Carbide (SiC) Inverters for 98.5% energy efficiency",
        "Liquid-Cooled Structural LFP Blade Battery with zero thermal propagation risk",
        "Bi-Directional V2L Power Output turning your car into an emergency home battery"
      ],
      stats: { primary: "18 min", label: "10% to 80% HyperCharge", secondary: "520 km", sublabel: "Real-World Electric Range" }
    }
  ],

  safetyFeatures: [
    { title: "8 Smart Airbags", desc: "Dual front, side curtain, front center knee and rear thorax airbags standard across all models.", icon: "shield" },
    { title: "ABS + EBD + ESC", desc: "Bosch 9.3 Electronic Stability Control with dynamic cornering torque vectoring.", icon: "disc" },
    { title: "360° Vision System", desc: "Ultra-HD surround camera with see-through virtual transparent chassis view.", icon: "eye" },
    { title: "Blind-Spot Monitoring", desc: "Active radar alerts on mirrors and live video feed in the digital instrument cluster.", icon: "alert-circle" },
    { title: "Lane Departure Assist", desc: "Haptic steering feedback with gentle auto-lane centering torque.", icon: "navigation" },
    { title: "Autonomous Braking", desc: "Forward collision warning with auto high-speed emergency braking.", icon: "zap-off" },
    { title: "Boron Steel Safety Cage", desc: "Hot-stamped ultra-high-strength steel protecting passenger cabin cell.", icon: "box" },
    { title: "ISOFIX Child Anchors", desc: "Dual ISOFIX anchor points with top tether on rear outboard seats.", icon: "user-check" }
  ],

  reviews: [
    {
      author: "Arun K.",
      location: "Bengaluru",
      modelOwned: "HENRY A1 Executive",
      rating: 5,
      headline: "Premium design and excellent value for the price.",
      comment: "I was considering German luxury sedans, but testing the HENRY A1 completely changed my mind. The cabin finish, whisper-quiet cabin, and DCT gearbox response are phenomenal at ₹9.99 Lakh.",
      verified: true,
      avatar: "AK"
    },
    {
      author: "Priya S.",
      location: "Mumbai",
      modelOwned: "HENRY E1 Electric",
      rating: 5,
      headline: "The technology and interior quality surprised me.",
      comment: "The 15.6-inch screen, SmartDrive ADAS, and instantaneous 4.9-second acceleration are mind blowing. The 800V fast charging gives me 350 km of range in just 15 minutes at highway chargers.",
      verified: true,
      avatar: "PS"
    },
    {
      author: "Rahul M.",
      location: "Delhi NCR",
      modelOwned: "HENRY X1 SUV",
      rating: 5,
      headline: "A modern car with everything I need.",
      comment: "Spacious 7-seater setup, high ground clearance, and commanding road presence. The ventilated seats and panoramic glass roof make every road trip a pure pleasure.",
      verified: true,
      avatar: "RM"
    },
    {
      author: "Vikram D.",
      location: "Hyderabad",
      modelOwned: "HENRY A1 Turbo",
      rating: 5,
      headline: "Unbeatable build quality and honest pricing.",
      comment: "No hidden dealership markups, transparent warranty, and the safety tech gives me complete peace of mind with my family. Best car purchase I have ever made.",
      verified: true,
      avatar: "VD"
    }
  ],

  cities: [
    "Bengaluru",
    "Mumbai",
    "Delhi NCR (Gurugram / Noida)",
    "Hyderabad",
    "Chennai",
    "Pune",
    "Kolkata",
    "Ahmedabad",
    "Chandigarh",
    "Kochi",
    "Jaipur"
  ]
};
