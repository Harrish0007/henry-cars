/**
 * HENRY Automotive - Interactive Real-time Car Visualizer Engine
 * Supports Multi-Angle Rendering (Front 3/4, Side Profile, Interior Cockpit),
 * Dynamic Paint Shaders, Wheel Designs, Headlight Lighting Beams & Physics.
 */

class HenryVisualizer {
  constructor(canvasContainerId) {
    this.container = document.getElementById(canvasContainerId);
    if (!this.container) return;

    this.currentModel = 'A1';
    this.currentColor = HENRY_DATA.configurator.colors[0];
    this.currentWheel = HENRY_DATA.configurator.wheels[0];
    this.currentInterior = HENRY_DATA.configurator.interiors[0];
    this.currentView = 'exterior-front'; // 'exterior-front', 'exterior-side', 'interior'
    this.headlightsOn = true;
    this.isRotating = false;
    this.rotationAngle = 0;

    this.initDOM();
    this.render();
  }

  initDOM() {
    this.container.innerHTML = `
      <div class="relative w-full h-full min-h-[460px] md:min-h-[520px] flex items-center justify-center overflow-hidden rounded-3xl bg-radial from-[#121622] via-[#090b10] to-[#040507] border border-slate-800/80 shadow-2xl p-4 md:p-8 select-none">
        
        <!-- Ambient Showroom Studio Lighting & Floor Grid -->
        <div class="absolute inset-0 pointer-events-none opacity-40 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_60%,#000_70%,transparent_100%)]"></div>
        <div class="ambient-glow absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none transition-all duration-700"></div>
        <div id="floor-reflection" class="absolute bottom-6 left-1/2 -translate-x-1/2 w-[85%] max-w-[720px] h-[40px] rounded-[100%] blur-[28px] transition-all duration-700 pointer-events-none" style="background: radial-gradient(ellipse, ${this.currentColor.glow} 0%, rgba(0,0,0,0) 70%);"></div>

        <!-- Vehicle Render Wrapper -->
        <div id="car-stage" class="relative z-10 w-full max-w-[850px] aspect-[16/9] flex items-center justify-center transition-all duration-500 transform">
          <!-- Dynamic SVG Vector Car Model -->
          <div id="car-svg-container" class="w-full h-full flex items-center justify-center transition-all duration-500 filter drop-shadow-[0_25px_35px_rgba(0,0,0,0.9)]"></div>
        </div>

        <!-- Visualizer Floating Controls & Status Overlays -->
        <div class="absolute top-4 left-4 md:top-6 md:left-6 z-20 flex flex-wrap gap-2 items-center">
          <div class="glass-pill px-3 py-1.5 rounded-full text-xs font-semibold text-slate-300 flex items-center gap-2 border border-slate-700/60 bg-slate-900/60 backdrop-blur-md">
            <span class="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span id="vis-model-tag" class="tracking-wider uppercase font-mono">HENRY A1</span>
          </div>
          <div id="vis-color-tag" class="glass-pill hidden sm:flex px-3 py-1.5 rounded-full text-xs text-slate-400 border border-slate-800 bg-slate-950/60 backdrop-blur-md">
            ${this.currentColor.name}
          </div>
        </div>

        <!-- Multi-Angle View Camera Switcher -->
        <div class="absolute top-4 right-4 md:top-6 md:right-6 z-20 flex gap-1.5 p-1 rounded-2xl bg-slate-950/80 border border-slate-800 backdrop-blur-md">
          <button data-view="exterior-front" class="vis-view-btn active px-3 py-1.5 rounded-xl text-xs font-medium transition-all text-white bg-blue-600/30 border border-blue-500/50">
            <i class="fa-solid fa-car text-xs mr-1.5"></i> Front 3/4
          </button>
          <button data-view="exterior-side" class="vis-view-btn px-3 py-1.5 rounded-xl text-xs font-medium transition-all text-slate-400 hover:text-white hover:bg-slate-800/60">
            <i class="fa-solid fa-arrows-left-right text-xs mr-1.5"></i> Profile
          </button>
          <button data-view="interior" class="vis-view-btn px-3 py-1.5 rounded-xl text-xs font-medium transition-all text-slate-400 hover:text-white hover:bg-slate-800/60">
            <i class="fa-solid fa-couch text-xs mr-1.5"></i> Cockpit
          </button>
        </div>

        <!-- Bottom Quick Toggles (Headlights, Studio Light, Sound) -->
        <div class="absolute bottom-4 left-4 md:bottom-6 md:left-6 z-20 flex items-center gap-2">
          <button id="btn-toggle-lights" class="px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-2 ${this.headlightsOn ? 'text-amber-300 bg-amber-500/20 border border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.2)]' : 'text-slate-400 bg-slate-900/80 border border-slate-800'} backdrop-blur-md hover:scale-105">
            <i class="fa-solid fa-lightbulb text-xs"></i>
            <span>${this.headlightsOn ? 'Lights: ON' : 'Lights: OFF'}</span>
          </button>
        </div>

        <!-- Bottom Right Watermark & Resolution Indicator -->
        <div class="absolute bottom-4 right-4 md:bottom-6 md:right-6 z-20 text-[10px] text-slate-500 font-mono flex items-center gap-2">
          <span>RAY-TRACED PREVIEW</span>
          <span class="w-1 h-1 rounded-full bg-slate-600"></span>
          <span>HDR 4K</span>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    // View Switcher Buttons
    const viewButtons = this.container.querySelectorAll('.vis-view-btn');
    viewButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        viewButtons.forEach(b => {
          b.classList.remove('active', 'text-white', 'bg-blue-600/30', 'border-blue-500/50');
          b.classList.add('text-slate-400');
        });
        btn.classList.add('active', 'text-white', 'bg-blue-600/30', 'border-blue-500/50');
        btn.classList.remove('text-slate-400');
        this.currentView = btn.getAttribute('data-view');
        this.render();
      });
    });

    // Headlight Toggle
    const lightBtn = this.container.querySelector('#btn-toggle-lights');
    if (lightBtn) {
      lightBtn.addEventListener('click', () => {
        this.headlightsOn = !this.headlightsOn;
        if (this.headlightsOn) {
          lightBtn.className = 'px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-2 text-amber-300 bg-amber-500/20 border border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.2)] backdrop-blur-md hover:scale-105';
          lightBtn.querySelector('span').innerText = 'Lights: ON';
        } else {
          lightBtn.className = 'px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-2 text-slate-400 bg-slate-900/80 border border-slate-800 backdrop-blur-md hover:scale-105';
          lightBtn.querySelector('span').innerText = 'Lights: OFF';
        }
        this.render();
      });
    }
  }

  setModel(modelId) {
    this.currentModel = modelId;
    const tag = this.container.querySelector('#vis-model-tag');
    if (tag) tag.innerText = `HENRY ${modelId}`;
    this.render();
  }

  setColor(colorObj) {
    this.currentColor = colorObj;
    const tag = this.container.querySelector('#vis-color-tag');
    if (tag) tag.innerText = colorObj.name;
    const floor = this.container.querySelector('#floor-reflection');
    if (floor) {
      floor.style.background = `radial-gradient(ellipse, ${colorObj.glow} 0%, rgba(0,0,0,0) 70%)`;
    }
    this.render();
  }

  setWheel(wheelObj) {
    this.currentWheel = wheelObj;
    this.render();
  }

  setInterior(interiorObj) {
    this.currentInterior = interiorObj;
    this.render();
  }

  render() {
    const svgContainer = this.container.querySelector('#car-svg-container');
    if (!svgContainer) return;

    if (this.currentView === 'interior') {
      svgContainer.innerHTML = this.getInteriorSVG();
    } else if (this.currentView === 'exterior-side') {
      svgContainer.innerHTML = this.getSideProfileSVG();
    } else {
      svgContainer.innerHTML = this.getFrontPerspectiveSVG();
    }
  }

  // --- SVG VEHICLE RENDERING ENGINES ---

  getFrontPerspectiveSVG() {
    const c = this.currentColor;
    const isSUV = this.currentModel === 'X1';
    const isEV = this.currentModel === 'E1';
    const heightMod = isSUV ? 30 : (isEV ? 15 : 0);
    const roofY = 110 - heightMod;
    const bonnetY = 190 - (heightMod * 0.4);

    const lightGlowFilter = this.headlightsOn ? `
      <filter id="lightBeamGlow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="8" result="blur" />
        <feColorMatrix type="matrix" values="
          1 0 0 0 0
          0 1 0 0 0.8
          0 0 1 0 1
          0 0 0 2 -0.1" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    ` : '';

    return `
      <svg viewBox="0 0 900 480" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full transition-all duration-300">
        <defs>
          ${lightGlowFilter}
          <!-- Paint Shading Gradient -->
          <linearGradient id="bodyPaint" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${c.carGradStart}" />
            <stop offset="45%" stop-color="${c.carGradMid}" />
            <stop offset="85%" stop-color="${c.carGradEnd}" />
            <stop offset="100%" stop-color="#05070a" />
          </linearGradient>

          <!-- Specular Highlight Curve -->
          <linearGradient id="specularGlint" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="0.85" />
            <stop offset="40%" stop-color="#ffffff" stop-opacity="0.1" />
            <stop offset="100%" stop-color="#000000" stop-opacity="0" />
          </linearGradient>

          <!-- Glass Roof & Windshield Gradient -->
          <linearGradient id="windshieldGlass" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#1e293b" stop-opacity="0.95" />
            <stop offset="40%" stop-color="#0f172a" stop-opacity="0.9" />
            <stop offset="70%" stop-color="#38bdf8" stop-opacity="0.2" />
            <stop offset="100%" stop-color="#020617" stop-opacity="0.98" />
          </linearGradient>

          <!-- Headlight Projector Gradient -->
          <linearGradient id="ledGlowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#e0f2fe" />
            <stop offset="50%" stop-color="#38bdf8" />
            <stop offset="100%" stop-color="#0284c7" />
          </linearGradient>

          <!-- Alloy Rim Gradient -->
          <linearGradient id="rimAlloy" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#f8fafc" />
            <stop offset="50%" stop-color="#64748b" />
            <stop offset="100%" stop-color="#1e293b" />
          </linearGradient>

          <linearGradient id="shadowUnder" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#000000" stop-opacity="0.9" />
            <stop offset="100%" stop-color="#000000" stop-opacity="0" />
          </linearGradient>
        </defs>

        <!-- Dynamic Headlight Projection Rays (When ON) -->
        ${this.headlightsOn ? `
          <g opacity="0.65" class="animate-pulse duration-1000">
            <!-- Left Beam -->
            <polygon points="170,265 0,380 0,470 190,290" fill="url(#ledGlowGrad)" opacity="0.25" filter="url(#lightBeamGlow)" />
            <!-- Right Beam -->
            <polygon points="730,265 900,380 900,470 710,290" fill="url(#ledGlowGrad)" opacity="0.25" filter="url(#lightBeamGlow)" />
          </g>
        ` : ''}

        <!-- Ground Contact Shadow -->
        <ellipse cx="450" cy="410" rx="380" ry="26" fill="black" opacity="0.8" filter="blur(16px)" />
        <ellipse cx="450" cy="405" rx="320" ry="14" fill="black" opacity="0.95" filter="blur(6px)" />

        <!-- Front Wheels -->
        <!-- Left Wheel -->
        <g transform="translate(130, 270)">
          <ellipse cx="60" cy="90" rx="42" ry="55" fill="#090d16" stroke="#334155" stroke-width="6" />
          ${this.getWheelSpokesSVG(this.currentWheel.style, 60, 90, 32)}
          <!-- Brake Caliper Accent -->
          <rect x="74" y="65" width="10" height="22" rx="3" fill="${this.currentWheel.style === 'diamond-cut' ? '#e11d48' : '#38bdf8'}" />
        </g>
        <!-- Right Wheel -->
        <g transform="translate(650, 270)">
          <ellipse cx="60" cy="90" rx="42" ry="55" fill="#090d16" stroke="#334155" stroke-width="6" />
          ${this.getWheelSpokesSVG(this.currentWheel.style, 60, 90, 32)}
          <rect x="36" y="65" width="10" height="22" rx="3" fill="${this.currentWheel.style === 'diamond-cut' ? '#e11d48' : '#38bdf8'}" />
        </g>

        <!-- Main Car Body Silhouette (Sculpted Luxury Fastback / SUV Lines) -->
        <g id="car-chassis">
          <!-- Lower Side Skirts & Diffuser -->
          <path d="M140 375 L760 375 L790 355 L810 320 L760 310 L680 320 L220 320 L140 310 L90 320 L110 355 Z" fill="#0f172a" stroke="#1e293b" stroke-width="2" />

          <!-- Main Body Monocoque -->
          <path d="M 120 320 
                   C 110 270, 150 220, 230 ${bonnetY} 
                   C 310 ${bonnetY - 15}, 380 ${bonnetY - 20}, 450 ${bonnetY - 20} 
                   C 520 ${bonnetY - 20}, 590 ${bonnetY - 15}, 670 ${bonnetY} 
                   C 750 220, 790 270, 780 320 
                   C 760 350, 720 365, 450 368 
                   C 180 365, 140 350, 120 320 Z" 
                fill="url(#bodyPaint)" 
                stroke="#475569" 
                stroke-width="1.5" />

          <!-- Specular Hood Ridge Reflections -->
          <path d="M 230 ${bonnetY} Q 450 ${bonnetY - 25} 670 ${bonnetY} Q 450 ${bonnetY - 8} 230 ${bonnetY}" fill="url(#specularGlint)" opacity="0.6" />

          <!-- Aerodynamic Hood Character Lines -->
          <path d="M 280 ${bonnetY + 10} C 360 ${bonnetY - 5}, 410 ${bonnetY - 12}, 440 ${bonnetY - 12}" stroke="#ffffff" stroke-width="1.5" stroke-opacity="0.3" fill="none" />
          <path d="M 620 ${bonnetY + 10} C 540 ${bonnetY - 5}, 490 ${bonnetY - 12}, 460 ${bonnetY - 12}" stroke="#ffffff" stroke-width="1.5" stroke-opacity="0.3" fill="none" />

          <!-- Greenhouse (Cabin, Windshield, A-Pillars & Roof) -->
          <path d="M 235 ${bonnetY - 4} 
                   C 285 ${roofY + 20}, 330 ${roofY}, 450 ${roofY} 
                   C 570 ${roofY}, 615 ${roofY + 20}, 665 ${bonnetY - 4} 
                   L 640 ${bonnetY - 6} 
                   C 590 ${roofY + 15}, 540 ${roofY + 12}, 450 ${roofY + 12} 
                   C 360 ${roofY + 12}, 310 ${roofY + 15}, 260 ${bonnetY - 6} Z" 
                fill="#0b0f19" 
                stroke="#334155" 
                stroke-width="2" />

          <!-- Glass Windshield with Deep Sky Reflection -->
          <path d="M 255 ${bonnetY - 8} 
                   C 298 ${roofY + 24}, 345 ${roofY + 12}, 450 ${roofY + 12} 
                   C 555 ${roofY + 12}, 602 ${roofY + 24}, 645 ${bonnetY - 8} 
                   C 575 ${bonnetY - 18}, 515 ${bonnetY - 22}, 450 ${bonnetY - 22} 
                   C 385 ${bonnetY - 22}, 325 ${bonnetY - 18}, 255 ${bonnetY - 8} Z" 
                fill="url(#windshieldGlass)" />

          <!-- Interior Silhouette Visible Through Windshield (Headrests & Steering) -->
          <ellipse cx="380" cy="${roofY + 45}" rx="18" ry="22" fill="#1e293b" opacity="0.8" />
          <ellipse cx="520" cy="${roofY + 45}" rx="18" ry="22" fill="#1e293b" opacity="0.8" />
          <path d="M 370 ${roofY + 70} C 370 ${roofY + 58}, 390 ${roofY + 58}, 390 ${roofY + 70}" stroke="#475569" stroke-width="4" fill="none" opacity="0.7" />

          <!-- Aerodynamic Side Mirrors with Integrated LED Turn Indicators -->
          <g>
            <!-- Left Mirror -->
            <path d="M 230 ${bonnetY - 5} L 180 ${bonnetY - 15} C 170 ${bonnetY - 25}, 185 ${bonnetY - 35}, 210 ${bonnetY - 25} L 245 ${bonnetY - 15} Z" fill="url(#bodyPaint)" stroke="#334155" stroke-width="1.5" />
            <path d="M 185 ${bonnetY - 18} L 210 ${bonnetY - 23}" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" />
            
            <!-- Right Mirror -->
            <path d="M 670 ${bonnetY - 5} L 720 ${bonnetY - 15} C 730 ${bonnetY - 25}, 715 ${bonnetY - 35}, 690 ${bonnetY - 25} L 655 ${bonnetY - 15} Z" fill="url(#bodyPaint)" stroke="#334155" stroke-width="1.5" />
            <path d="M 715 ${bonnetY - 18} L 690 ${bonnetY - 23}" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" />
          </g>

          <!-- Front Grille & Aerodynamic Air Intakes -->
          <g>
            ${isEV ? `
              <!-- Closed EV Aero Shield with Parametric Diamond Starlight Pattern -->
              <path d="M 290 280 C 370 285, 530 285, 610 280 C 600 330, 520 345, 450 345 C 380 345, 300 330, 290 280 Z" 
                    fill="#0a0d14" 
                    stroke="#1e293b" 
                    stroke-width="1.5" />
              <!-- Futuristic EV Matrix Light Texture -->
              <path d="M 320 295 L 580 295" stroke="#38bdf8" stroke-width="1" stroke-dasharray="4 6" opacity="0.7" />
              <path d="M 340 312 L 560 312" stroke="#38bdf8" stroke-width="1" stroke-dasharray="6 8" opacity="0.5" />
            ` : `
              <!-- High-Performance Diamond Mesh Dark Chrome Grille -->
              <path d="M 280 275 C 360 280, 540 280, 620 275 C 610 335, 530 352, 450 352 C 370 352, 290 335, 280 275 Z" 
                    fill="#080a0f" 
                    stroke="#334155" 
                    stroke-width="2" />
              <!-- Diamond Staggered Pattern -->
              <path d="M 310 290 L 590 290 M 325 306 L 575 306 M 345 322 L 555 322 M 375 336 L 525 336" stroke="#475569" stroke-width="1.5" opacity="0.6" />
            `}

            <!-- Center Illuminated Bespoke HENRY Emblem on Grille -->
            <g transform="translate(432, 290) scale(0.15)">
              <polygon points="120,12 216,64 216,176 120,228 24,176 24,64" fill="#0f172a" stroke="#cbd5e1" stroke-width="6" />
              <!-- Emblem H -->
              <path d="M68 62 L88 52 L88 188 L68 178 Z" fill="#ffffff" />
              <path d="M152 52 L172 62 L172 178 L152 188 Z" fill="#ffffff" />
              <path d="M88 112 L152 112 L162 128 L78 128 Z" fill="#38bdf8" />
              <polygon points="120,104 134,120 120,136 106,120" fill="#38bdf8" />
            </g>
          </g>

          <!-- Ultra-Sleek LED Matrix Headlights & DRL Light Blade -->
          <g>
            <!-- Left Headlamp Assembly -->
            <path d="M 160 250 C 200 240, 260 246, 285 262 C 265 278, 205 282, 175 272 Z" 
                  fill="#030712" 
                  stroke="${this.headlightsOn ? '#38bdf8' : '#334155'}" 
                  stroke-width="1.5" />
            
            <!-- Left DRL Laser Blade Strip -->
            <path d="M 165 252 C 205 244, 255 248, 280 262" 
                  stroke="${this.headlightsOn ? '#ffffff' : '#64748b'}" 
                  stroke-width="3.5" 
                  stroke-linecap="round" 
                  filter="${this.headlightsOn ? 'url(#lightBeamGlow)' : 'none'}" />
            
            <!-- Left Quad-LED Projector Lenses -->
            <circle cx="190" cy="262" r="5" fill="${this.headlightsOn ? '#e0f2fe' : '#1e293b'}" filter="${this.headlightsOn ? 'url(#lightBeamGlow)' : 'none'}" />
            <circle cx="212" cy="260" r="5" fill="${this.headlightsOn ? '#e0f2fe' : '#1e293b'}" filter="${this.headlightsOn ? 'url(#lightBeamGlow)' : 'none'}" />
            <circle cx="234" cy="258" r="5" fill="${this.headlightsOn ? '#e0f2fe' : '#1e293b'}" filter="${this.headlightsOn ? 'url(#lightBeamGlow)' : 'none'}" />

            <!-- Right Headlamp Assembly -->
            <path d="M 740 250 C 700 240, 640 246, 615 262 C 635 278, 695 282, 725 272 Z" 
                  fill="#030712" 
                  stroke="${this.headlightsOn ? '#38bdf8' : '#334155'}" 
                  stroke-width="1.5" />
            
            <!-- Right DRL Laser Blade Strip -->
            <path d="M 735 252 C 695 244, 645 248, 620 262" 
                  stroke="${this.headlightsOn ? '#ffffff' : '#64748b'}" 
                  stroke-width="3.5" 
                  stroke-linecap="round" 
                  filter="${this.headlightsOn ? 'url(#lightBeamGlow)' : 'none'}" />

            <!-- Right Quad-LED Projector Lenses -->
            <circle cx="710" cy="262" r="5" fill="${this.headlightsOn ? '#e0f2fe' : '#1e293b'}" filter="${this.headlightsOn ? 'url(#lightBeamGlow)' : 'none'}" />
            <circle cx="688" cy="260" r="5" fill="${this.headlightsOn ? '#e0f2fe' : '#1e293b'}" filter="${this.headlightsOn ? 'url(#lightBeamGlow)' : 'none'}" />
            <circle cx="666" cy="258" r="5" fill="${this.headlightsOn ? '#e0f2fe' : '#1e293b'}" filter="${this.headlightsOn ? 'url(#lightBeamGlow)' : 'none'}" />

            <!-- Full-Width Horizon Cyber LED Light Bar (Connecting Headlights) -->
            <path d="M 285 260 Q 450 270 615 260" 
                  stroke="${this.headlightsOn ? '#38bdf8' : '#334155'}" 
                  stroke-width="${this.headlightsOn ? 2.5 : 1}" 
                  stroke-linecap="round" 
                  filter="${this.headlightsOn ? 'url(#lightBeamGlow)' : 'none'}" 
                  opacity="${this.headlightsOn ? 0.95 : 0.4}" />
          </g>

          <!-- Lower Front Lip, Fog Accents & ADAS LiDAR Sensor Pod -->
          <g>
            <path d="M 210 335 L 260 330 L 260 350 L 205 355 Z" fill="#0b0f19" stroke="#1e293b" />
            <path d="M 690 335 L 640 330 L 640 350 L 695 355 Z" fill="#0b0f19" stroke="#1e293b" />
            <!-- ADAS Radar Center Pod -->
            <rect x="425" y="354" width="50" height="14" rx="4" fill="#030712" stroke="#38bdf8" stroke-width="1" />
            <text x="450" y="364" font-size="7" fill="#38bdf8" font-family="monospace" text-anchor="middle" font-weight="bold">LIDAR 4D</text>
          </g>

          <!-- Sleek Indian License Plate Prototype -->
          <g transform="translate(390, 322)">
            <rect width="120" height="22" rx="3" fill="#ffffff" stroke="#000000" stroke-width="1" />
            <rect width="16" height="22" rx="2" fill="#0038a8" />
            <circle cx="8" cy="11" r="3.5" fill="#f59e0b" />
            <text x="65" y="15" font-family="sans-serif" font-weight="900" font-size="11" fill="#111827" letter-spacing="2" text-anchor="middle">HENRY ${this.currentModel}</text>
          </g>
        </g>
      </svg>
    `;
  }

  getSideProfileSVG() {
    const c = this.currentColor;
    const isSUV = this.currentModel === 'X1';
    const isEV = this.currentModel === 'E1';
    const cabinH = isSUV ? 40 : (isEV ? 25 : 0);

    return `
      <svg viewBox="0 0 900 420" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full transition-all duration-300">
        <defs>
          <linearGradient id="sideBodyPaint" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="${c.carGradStart}" />
            <stop offset="35%" stop-color="${c.carGradMid}" />
            <stop offset="85%" stop-color="${c.carGradEnd}" />
            <stop offset="100%" stop-color="#05070a" />
          </linearGradient>

          <linearGradient id="sideGlass" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#0f172a" stop-opacity="0.95" />
            <stop offset="60%" stop-color="#1e293b" stop-opacity="0.8" />
            <stop offset="100%" stop-color="#38bdf8" stop-opacity="0.25" />
          </linearGradient>
        </defs>

        <!-- Shadow -->
        <ellipse cx="450" cy="365" rx="400" ry="18" fill="black" opacity="0.8" filter="blur(12px)" />

        <!-- Wheels Placement -->
        <!-- Front Wheel Assembly -->
        <g transform="translate(200, 290)">
          <circle cx="0" cy="0" r="58" fill="#090d16" stroke="#334155" stroke-width="6" />
          ${this.getWheelSpokesSVG(this.currentWheel.style, 0, 0, 48)}
          <!-- Brake Disc & Caliper -->
          <circle cx="0" cy="0" r="30" fill="none" stroke="#64748b" stroke-width="4" stroke-dasharray="6 4" />
          <rect x="14" y="-18" width="12" height="36" rx="4" fill="${this.currentWheel.style === 'diamond-cut' ? '#e11d48' : '#38bdf8'}" />
        </g>

        <!-- Rear Wheel Assembly -->
        <g transform="translate(700, 290)">
          <circle cx="0" cy="0" r="58" fill="#090d16" stroke="#334155" stroke-width="6" />
          ${this.getWheelSpokesSVG(this.currentWheel.style, 0, 0, 48)}
          <circle cx="0" cy="0" r="30" fill="none" stroke="#64748b" stroke-width="4" stroke-dasharray="6 4" />
          <rect x="14" y="-18" width="12" height="36" rx="4" fill="${this.currentWheel.style === 'diamond-cut' ? '#e11d48' : '#38bdf8'}" />
        </g>

        <!-- Side Chassis Profile -->
        <g>
          <!-- Main Body Contours -->
          <path d="M 80 280 
                   C 80 250, 110 230, 180 220 
                   L 260 215 
                   C 320 150, 400 ${120 - cabinH}, 540 ${120 - cabinH} 
                   C 660 ${120 - cabinH}, 760 170, 810 220 
                   L 840 240 
                   C 855 260, 840 285, 820 295 
                   L 765 295 
                   C 760 240, 640 240, 635 295 
                   L 265 295 
                   C 260 240, 140 240, 135 295 
                   L 80 290 Z" 
                fill="url(#sideBodyPaint)" 
                stroke="#475569" 
                stroke-width="2" />

          <!-- Dynamic Side Shoulder Crease Blade -->
          <path d="M 120 240 C 260 230, 520 225, 820 245" stroke="#ffffff" stroke-width="1.5" stroke-opacity="0.5" fill="none" />
          <path d="M 260 280 C 440 285, 560 285, 640 280" stroke="#000000" stroke-width="3" stroke-opacity="0.4" fill="none" />

          <!-- Side Windows Greenhouse -->
          <path d="M 285 205 
                   C 335 155, 410 ${135 - cabinH}, 530 ${135 - cabinH} 
                   C 630 ${135 - cabinH}, 720 175, 755 205 
                   L 550 205 Z" 
                fill="url(#sideGlass)" 
                stroke="#64748b" 
                stroke-width="2" />

          <!-- Window B-Pillar & C-Pillar Dividers -->
          <line x1="440" y1="${135 - cabinH}" x2="440" y2="205" stroke="#0f172a" stroke-width="6" />
          <line x1="600" y1="${140 - cabinH}" x2="610" y2="205" stroke="#0f172a" stroke-width="6" />

          <!-- Flush Aerodynamic Door Handles -->
          <rect x="360" y="222" width="28" height="6" rx="3" fill="#cbd5e1" stroke="#475569" stroke-width="1" />
          <rect x="520" y="222" width="28" height="6" rx="3" fill="#cbd5e1" stroke="#475569" stroke-width="1" />

          <!-- Front & Rear Lighting Signatures -->
          <!-- Headlight Wrap -->
          <path d="M 82 265 L 120 245" stroke="#38bdf8" stroke-width="4" stroke-linecap="round" />
          <!-- Taillight Wrap -->
          <path d="M 838 245 L 805 240" stroke="#e11d48" stroke-width="4" stroke-linecap="round" />
        </g>
      </svg>
    `;
  }

  getInteriorSVG() {
    const int = this.currentInterior;
    return `
      <svg viewBox="0 0 900 480" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full transition-all duration-300">
        <defs>
          <linearGradient id="dashSkin" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#18181b" />
            <stop offset="50%" stop-color="#09090b" />
            <stop offset="100%" stop-color="#020203" />
          </linearGradient>

          <linearGradient id="ambientLed" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#38bdf8" />
            <stop offset="50%" stop-color="#818cf8" />
            <stop offset="100%" stop-color="#38bdf8" />
          </linearGradient>

          <linearGradient id="seatUpholstery" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${int.swatch}" />
            <stop offset="100%" stop-color="#09090b" />
          </linearGradient>
        </defs>

        <!-- Ambient Cockpit Cabin Backing -->
        <rect width="900" height="480" fill="#04060a" rx="16" />

        <!-- Front Windshield Horizon View (Cyber Ambient Sky) -->
        <path d="M 120 20 L 780 20 L 820 180 L 80 180 Z" fill="#090d16" />
        <line x1="80" y1="120" x2="820" y2="120" stroke="#1e293b" stroke-width="1" stroke-dasharray="10 5" opacity="0.4" />

        <!-- Ergonomic Sport Bucket Seats -->
        <!-- Driver Seat -->
        <g transform="translate(140, 160)">
          <path d="M 30 240 C 20 160, 40 40, 90 20 C 140 20, 160 160, 150 240 Z" fill="url(#seatUpholstery)" stroke="${int.trimColor}" stroke-width="2" />
          <ellipse cx="90" cy="10" rx="30" ry="20" fill="url(#seatUpholstery)" stroke="${int.trimColor}" stroke-width="1.5" />
          <!-- Perforated Sport Pattern -->
          <line x1="90" y1="50" x2="90" y2="200" stroke="${int.trimColor}" stroke-width="1.5" stroke-dasharray="4 6" opacity="0.8" />
        </g>
        <!-- Passenger Seat -->
        <g transform="translate(600, 160)">
          <path d="M 30 240 C 20 160, 40 40, 90 20 C 140 20, 160 160, 150 240 Z" fill="url(#seatUpholstery)" stroke="${int.trimColor}" stroke-width="2" />
          <ellipse cx="90" cy="10" rx="30" ry="20" fill="url(#seatUpholstery)" stroke="${int.trimColor}" stroke-width="1.5" />
          <line x1="90" y1="50" x2="90" y2="200" stroke="${int.trimColor}" stroke-width="1.5" stroke-dasharray="4 6" opacity="0.8" />
        </g>

        <!-- Sculpted Dashboard Wing -->
        <path d="M 60 180 C 260 170, 640 170, 840 180 L 860 320 C 640 330, 260 330, 40 320 Z" fill="url(#dashSkin)" stroke="#27272a" stroke-width="2" />

        <!-- 64-Color Ambient LED Contour Strip -->
        <path d="M 70 184 C 270 174, 630 174, 830 184" stroke="url(#ambientLed)" stroke-width="3" filter="drop-shadow(0 0 6px #38bdf8)" />

        <!-- Floating 15.6-inch Dual Curved HyperCockpit Display -->
        <g transform="translate(240, 130)">
          <!-- Glass Bezel -->
          <rect width="420" height="120" rx="14" fill="#090d16" stroke="#38bdf8" stroke-width="2" filter="drop-shadow(0 15px 30px rgba(0,0,0,0.9))" />
          
          <!-- Left Screen (Digital Instrument Cluster) -->
          <rect x="15" y="15" width="180" height="90" rx="8" fill="#020617" />
          <!-- Speedometer & ADAS Radar Graphic -->
          <circle cx="105" cy="60" r="32" fill="none" stroke="#334155" stroke-width="4" />
          <circle cx="105" cy="60" r="32" fill="none" stroke="#38bdf8" stroke-width="4" stroke-dasharray="140 200" />
          <text x="105" y="58" font-size="20" font-weight="bold" fill="#ffffff" text-anchor="middle" font-family="sans-serif">104</text>
          <text x="105" y="72" font-size="8" fill="#94a3b8" text-anchor="middle" font-family="monospace">KM/H</text>
          <text x="45" y="40" font-size="8" fill="#22c55e" font-family="monospace">● ADAS ACTIVE</text>
          <text x="45" y="90" font-size="8" fill="#38bdf8" font-family="monospace">BATTERY 84%</text>

          <!-- Right Screen (15.6" Infotainment Navigation & Vehicle Control) -->
          <rect x="210" y="15" width="195" height="90" rx="8" fill="#020617" />
          <!-- Map & Music UI Mock -->
          <rect x="220" y="25" width="105" height="70" rx="6" fill="#0f172a" stroke="#1e293b" />
          <path d="M 230 60 Q 270 35 315 70" stroke="#38bdf8" stroke-width="2" fill="none" />
          <!-- Music Card -->
          <rect x="332" y="25" width="65" height="70" rx="6" fill="#1e293b" />
          <text x="365" y="48" font-size="8" fill="#ffffff" text-anchor="middle" font-weight="bold">HENRY</text>
          <text x="365" y="60" font-size="7" fill="#38bdf8" text-anchor="middle">Spatial Audio</text>
          <circle cx="365" cy="78" r="8" fill="#38bdf8" />
          <polygon points="363,74 369,78 363,82" fill="#ffffff" />
        </g>

        <!-- Center Console with Crystal Gear Selector & Wireless Charging Pad -->
        <g transform="translate(360, 310)">
          <path d="M 0 0 L 180 0 L 210 170 L -30 170 Z" fill="#0c0e14" stroke="#27272a" stroke-width="2" />
          <!-- Crystal Rotary Controller -->
          <circle cx="90" cy="50" r="22" fill="#1e293b" stroke="#cbd5e1" stroke-width="3" filter="drop-shadow(0 4px 8px rgba(0,0,0,0.5))" />
          <polygon points="90,40 98,50 90,60 82,50" fill="#38bdf8" />
          <!-- Dual Cup Holders / Wireless Pad -->
          <rect x="40" y="90" width="100" height="40" rx="8" fill="#030712" stroke="#1e293b" />
          <text x="90" y="114" font-size="8" fill="#64748b" text-anchor="middle" font-family="monospace">50W FAST CHARGE</text>
        </g>

        <!-- D-Cut Flat-Bottomed Multifunction Steering Wheel -->
        <g transform="translate(190, 240)">
          <!-- Outer Leather Ring -->
          <path d="M 40 40 
                   C 40 -40, 180 -40, 180 40 
                   C 180 95, 145 110, 110 110 
                   C 75 110, 40 95, 40 40 Z" 
                fill="none" 
                stroke="#18181b" 
                stroke-width="24" 
                stroke-linecap="round" />
          <path d="M 40 40 
                   C 40 -40, 180 -40, 180 40 
                   C 180 95, 145 110, 110 110 
                   C 75 110, 40 95, 40 40 Z" 
                fill="none" 
                stroke="${int.trimColor}" 
                stroke-width="2" 
                stroke-dasharray="6 8" />

          <!-- Center Airbag Hub & Bespoke HENRY Logo -->
          <circle cx="110" cy="40" r="34" fill="#090d16" stroke="#475569" stroke-width="3" />
          <!-- HENRY Mini Emblem on Steering -->
          <g transform="translate(98, 28) scale(0.1)">
            <polygon points="120,12 216,64 216,176 120,228 24,176 24,64" fill="#0f172a" stroke="#cbd5e1" stroke-width="8" />
            <path d="M68 62 L88 52 L88 188 L68 178 Z" fill="#ffffff" />
            <path d="M152 52 L172 62 L172 178 L152 188 Z" fill="#ffffff" />
            <path d="M88 112 L152 112 L162 128 L78 128 Z" fill="#38bdf8" />
          </g>

          <!-- Steering Wheel Control Spokes -->
          <line x1="76" y1="40" x2="30" y2="40" stroke="#334155" stroke-width="12" stroke-linecap="round" />
          <line x1="144" y1="40" x2="190" y2="40" stroke="#334155" stroke-width="12" stroke-linecap="round" />
          <line x1="110" y1="74" x2="110" y2="105" stroke="#334155" stroke-width="10" stroke-linecap="round" />
        </g>
      </svg>
    `;
  }

  getWheelSpokesSVG(style, cx, cy, r) {
    if (style === 'v-spoke') {
      return `
        <!-- 19-inch V-Spoke Sport Wheel -->
        <g stroke="#94a3b8" stroke-width="3.5" stroke-linecap="round">
          <line x1="${cx}" y1="${cy - r}" x2="${cx}" y2="${cy + r}" />
          <line x1="${cx - r}" y1="${cy}" x2="${cx + r}" y2="${cy}" />
          <line x1="${cx - r * 0.7}" y1="${cy - r * 0.7}" x2="${cx + r * 0.7}" y2="${cy + r * 0.7}" />
          <line x1="${cx - r * 0.7}" y1="${cy + r * 0.7}" x2="${cx + r * 0.7}" y2="${cy - r * 0.7}" />
        </g>
        <circle cx="${cx}" cy="${cy}" r="${r * 0.25}" fill="#0f172a" stroke="#cbd5e1" stroke-width="2" />
      `;
    } else if (style === 'diamond-cut') {
      return `
        <!-- 20-inch Multi-Spoke Diamond Cut Wheel -->
        <g stroke="#f8fafc" stroke-width="2.5" stroke-linecap="round">
          <line x1="${cx}" y1="${cy - r}" x2="${cx}" y2="${cy + r}" stroke="#38bdf8" />
          <line x1="${cx - r}" y1="${cy}" x2="${cx + r}" y2="${cy}" />
          <line x1="${cx - r * 0.85}" y1="${cy - r * 0.5}" x2="${cx + r * 0.85}" y2="${cy + r * 0.5}" />
          <line x1="${cx - r * 0.85}" y1="${cy + r * 0.5}" x2="${cx + r * 0.85}" y2="${cy - r * 0.5}" />
          <line x1="${cx - r * 0.5}" y1="${cy - r * 0.85}" x2="${cx + r * 0.5}" y2="${cy + r * 0.85}" />
          <line x1="${cx - r * 0.5}" y1="${cy + r * 0.85}" x2="${cx + r * 0.5}" y2="${cy - r * 0.85}" />
        </g>
        <circle cx="${cx}" cy="${cy}" r="${r * 0.3}" fill="#020617" stroke="#e11d48" stroke-width="2" />
        <circle cx="${cx}" cy="${cy}" r="${r * 0.15}" fill="#ffffff" />
      `;
    } else {
      // 18-inch Aero Turbine
      return `
        <!-- 18-inch Aero Turbine Efficiency Wheel -->
        <g fill="#475569" stroke="#64748b" stroke-width="1">
          <polygon points="${cx},${cy} ${cx + 10},${cy - r} ${cx + 25},${cy - r + 10} ${cx + 5},${cy}" />
          <polygon points="${cx},${cy} ${cx + r},${cy + 10} ${cx + r - 10},${cy + 25} ${cx},${cy + 5}" />
          <polygon points="${cx},${cy} ${cx - 10},${cy + r} ${cx - 25},${cy + r - 10} ${cx - 5},${cy}" />
          <polygon points="${cx},${cy} ${cx - r},${cy - 10} ${cx - r + 10},${cy - 25} ${cx},${cy - 5}" />
        </g>
        <circle cx="${cx}" cy="${cy}" r="${r * 0.28}" fill="#1e293b" stroke="#38bdf8" stroke-width="2" />
      `;
    }
  }
}

// Global instance handle
window.HenryVisualizer = HenryVisualizer;
