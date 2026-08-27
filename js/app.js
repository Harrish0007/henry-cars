/**
 * HENRY Automotive - Main Application & Configurator Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Global State
  const state = {
    selectedModelId: 'A1',
    selectedColor: HENRY_DATA.configurator.colors[0],
    selectedWheel: HENRY_DATA.configurator.wheels[0],
    selectedInterior: HENRY_DATA.configurator.interiors[0],
    selectedPowertrainId: 'p-turbo',
    selectedPackages: new Set(['pkg-adas']),
    currentTechTab: 'smartdrive',
    visualizer: null,
    heroHeadlightsOn: true
  };

  // 1. Initialize Visualizer
  const visualizerContainer = document.getElementById('configurator-visualizer');
  if (visualizerContainer) {
    state.visualizer = new HenryVisualizer('configurator-visualizer');
  }

  // 2. Setup Navigation & Sticky Glass Header
  setupNavigation();

  // 3. Setup Hero Section Lighting & Animations
  setupHeroInteractions();

  // 4. Render Vehicle Models Lineup
  renderModelsLineup();

  // 5. Setup Interactive Configurator Engine
  setupConfiguratorUI();

  // 6. Setup Technology Interactive Suite
  setupTechnologySection();

  // 7. Setup Safety Interactive Features
  setupSafetySection();

  // 8. Setup Customer Reviews
  renderReviews();

  // 9. Setup Test Drive Booking Engine
  setupTestDriveEngine();

  // 10. Setup Modals & Toasts
  setupModalsAndToasts();

  // -------------------------------------------------------------
  // FUNCTIONS & MODULES
  // -------------------------------------------------------------

  function setupNavigation() {
    const navbar = document.getElementById('main-navbar');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Sticky Scroll Effect
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        navbar.classList.add('bg-[#07090ec7]', 'backdrop-blur-xl', 'border-b', 'border-slate-800/80', 'py-3.5', 'shadow-2xl');
        navbar.classList.remove('py-5', 'bg-transparent');
      } else {
        navbar.classList.remove('bg-[#07090ec7]', 'backdrop-blur-xl', 'border-b', 'border-slate-800/80', 'py-3.5', 'shadow-2xl');
        navbar.classList.add('py-5', 'bg-transparent');
      }
    });

    // Mobile Menu Toggle
    if (mobileMenuBtn && mobileMenu) {
      mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
      });

      // Close on link click
      mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          mobileMenu.classList.add('hidden');
        });
      });
    }

    // Smooth Scroll with Offset
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const offsetTop = target.getBoundingClientRect().top + window.pageYOffset - 80;
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  function setupHeroInteractions() {
    const heroLightBtn = document.getElementById('hero-lights-toggle');
    const heroGlowBeams = document.querySelectorAll('.hero-beam-glow');
    const heroHeadlightRays = document.getElementById('hero-headlight-rays');

    if (heroLightBtn) {
      heroLightBtn.addEventListener('click', () => {
        state.heroHeadlightsOn = !state.heroHeadlightsOn;
        if (state.heroHeadlightsOn) {
          heroLightBtn.innerHTML = `<i class="fa-solid fa-lightbulb text-amber-300"></i><span>Lights: ON</span>`;
          heroLightBtn.classList.add('border-amber-400/40', 'bg-amber-500/10', 'text-amber-300');
          heroLightBtn.classList.remove('text-slate-400', 'border-slate-800');
          if (heroHeadlightRays) heroHeadlightRays.style.opacity = '1';
          heroGlowBeams.forEach(el => el.style.opacity = '0.9');
          showToast('Vehicle Matrix LED Lights Activated', 'info');
        } else {
          heroLightBtn.innerHTML = `<i class="fa-solid fa-lightbulb text-slate-500"></i><span>Lights: OFF</span>`;
          heroLightBtn.classList.remove('border-amber-400/40', 'bg-amber-500/10', 'text-amber-300');
          heroLightBtn.classList.add('text-slate-400', 'border-slate-800');
          if (heroHeadlightRays) heroHeadlightRays.style.opacity = '0';
          heroGlowBeams.forEach(el => el.style.opacity = '0.15');
          showToast('Vehicle Lighting Standby Mode', 'info');
        }
      });
    }
  }

  function renderModelsLineup() {
    const container = document.getElementById('models-grid');
    if (!container) return;

    const models = Object.values(HENRY_DATA.models);
    container.innerHTML = models.map(model => `
      <div class="group relative rounded-3xl bg-gradient-to-b from-slate-900/90 via-[#0a0d14] to-[#05070a] border border-slate-800/80 hover:border-blue-500/40 p-6 md:p-8 flex flex-col justify-between transition-all duration-500 hover:shadow-[0_20px_50px_rgba(2,132,199,0.15)] hover:-translate-y-1.5">
        
        <!-- Header & Badge -->
        <div>
          <div class="flex items-center justify-between gap-4 mb-3">
            <span class="text-xs font-mono font-semibold tracking-wider px-3 py-1 rounded-full bg-blue-950/60 border border-blue-800/60 text-blue-300">
              ${model.tag}
            </span>
            <span class="text-xs text-slate-400 font-mono flex items-center gap-1.5">
              <i class="fa-solid fa-clock text-[10px] text-cyan-400"></i> ${model.deliveryTime}
            </span>
          </div>

          <h3 class="text-2xl md:text-3xl font-extrabold text-white tracking-tight group-hover:text-cyan-300 transition-colors">
            ${model.name}
          </h3>
          <p class="text-slate-400 text-sm mt-1 line-clamp-2">${model.description}</p>
        </div>

        <!-- Vehicle Visual Render -->
        <div class="my-6 relative py-4 flex items-center justify-center">
          <div class="absolute inset-0 bg-radial from-blue-500/10 via-transparent to-transparent blur-xl pointer-events-none"></div>
          <div class="w-full max-w-[340px] transform group-hover:scale-105 transition-transform duration-500">
            ${renderModelThumbnailSVG(model.id)}
          </div>
        </div>

        <!-- Specs Highlights Grid -->
        <div class="grid grid-cols-3 gap-2 py-4 my-2 border-y border-slate-800/60 text-center bg-slate-950/40 rounded-2xl">
          <div class="p-2">
            <div class="text-[11px] text-slate-500 font-mono">POWER</div>
            <div class="text-xs md:text-sm font-bold text-white mt-0.5">${model.specs.power.split(' ')[0]} PS</div>
          </div>
          <div class="p-2 border-x border-slate-800/60">
            <div class="text-[11px] text-slate-500 font-mono">${model.id === 'E1' ? 'RANGE' : 'MILEAGE'}</div>
            <div class="text-xs md:text-sm font-bold text-cyan-400 mt-0.5">${model.id === 'E1' ? '520 km' : model.specs.mileage.split(' ')[0]}</div>
          </div>
          <div class="p-2">
            <div class="text-[11px] text-slate-500 font-mono">SEATING</div>
            <div class="text-xs md:text-sm font-bold text-white mt-0.5">${model.specs.seating.split(' ')[0]} Seats</div>
          </div>
        </div>

        <!-- Key Features List -->
        <ul class="space-y-2 mb-6 text-xs text-slate-300">
          ${model.keyFeatures.slice(0, 3).map(feat => `
            <li class="flex items-center gap-2">
              <i class="fa-solid fa-circle-check text-cyan-400 text-xs shrink-0"></i>
              <span>${feat}</span>
            </li>
          `).join('')}
        </ul>

        <!-- Price & Action Buttons -->
        <div class="pt-4 border-t border-slate-800/80">
          <div class="flex items-baseline justify-between mb-4">
            <span class="text-xs text-slate-400 font-mono">Starting at</span>
            <span class="text-xl md:text-2xl font-extrabold text-white tracking-tight">${model.priceFormatted}</span>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <button class="btn-view-details px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800/70 hover:bg-slate-700/80 border border-slate-700 transition-all flex items-center justify-center gap-1.5" data-model="${model.id}">
              <i class="fa-solid fa-circle-info text-xs text-cyan-400"></i> View Details
            </button>
            <button class="btn-build-model px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-1.5" data-model="${model.id}">
              <span>Build Yours</span> <i class="fa-solid fa-arrow-right text-[10px]"></i>
            </button>
          </div>
        </div>
      </div>
    `).join('');

    // Bind Detail & Build buttons
    container.querySelectorAll('.btn-view-details').forEach(btn => {
      btn.addEventListener('click', () => {
        const modelId = btn.getAttribute('data-model');
        openModelSpecsModal(modelId);
      });
    });

    container.querySelectorAll('.btn-build-model').forEach(btn => {
      btn.addEventListener('click', () => {
        const modelId = btn.getAttribute('data-model');
        selectConfiguratorModel(modelId);
        const configSection = document.getElementById('configurator');
        if (configSection) {
          const offsetTop = configSection.getBoundingClientRect().top + window.pageYOffset - 80;
          window.scrollTo({ top: offsetTop, behavior: 'smooth' });
        }
      });
    });
  }

  function renderModelThumbnailSVG(modelId) {
    const isSUV = modelId === 'X1';
    const isEV = modelId === 'E1';
    const color = isEV ? '#38bdf8' : (isSUV ? '#e2e8f0' : '#94a3b8');

    return `
      <svg viewBox="0 0 400 180" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-auto">
        <defs>
          <linearGradient id="thumbGrad-${modelId}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${isEV ? '#0284c7' : (isSUV ? '#475569' : '#334155')}" />
            <stop offset="100%" stop-color="#090d16" />
          </linearGradient>
        </defs>
        <!-- Shadow -->
        <ellipse cx="200" cy="155" rx="160" ry="10" fill="black" opacity="0.8" />
        <!-- Chassis -->
        <path d="M 40 125 C 40 105, 70 95, 120 90 L 150 55 C 190 ${isSUV ? '35' : '45'}, 260 ${isSUV ? '35' : '45'}, 300 70 L 340 95 C 365 105, 365 125, 345 130 L 320 130 C 315 100, 260 100, 255 130 L 145 130 C 140 100, 85 100, 80 130 Z" fill="url(#thumbGrad-${modelId})" stroke="#475569" stroke-width="1.5" />
        <!-- Glass -->
        <path d="M 155 58 C 190 ${isSUV ? '40' : '50'}, 255 ${isSUV ? '40' : '50'}, 295 72 L 235 72 Z" fill="#0f172a" stroke="#38bdf8" stroke-width="1" />
        <!-- Wheels -->
        <circle cx="112" cy="130" r="24" fill="#0f172a" stroke="#cbd5e1" stroke-width="3" />
        <circle cx="112" cy="130" r="10" fill="#38bdf8" />
        <circle cx="288" cy="130" r="24" fill="#0f172a" stroke="#cbd5e1" stroke-width="3" />
        <circle cx="288" cy="130" r="10" fill="#38bdf8" />
        <!-- Headlight / Taillight Glow -->
        <path d="M 42 118 L 65 110" stroke="#38bdf8" stroke-width="3" stroke-linecap="round" />
        <path d="M 358 112 L 345 110" stroke="#e11d48" stroke-width="3" stroke-linecap="round" />
      </svg>
    `;
  }

  function setupConfiguratorUI() {
    // Model Selector Tabs
    const modelTabs = document.querySelectorAll('.cfg-model-tab');
    modelTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const modelId = tab.getAttribute('data-model');
        selectConfiguratorModel(modelId);
      });
    });

    // Render Color Swatches
    renderConfiguratorColors();

    // Render Wheels Options
    renderConfiguratorWheels();

    // Render Interior Options
    renderConfiguratorInteriors();

    // Render Powertrain Options for current model
    renderConfiguratorPowertrains();

    // Render Package Options
    renderConfiguratorPackages();

    // Initial Price Update
    updateConfiguratorPrice();

    // Bind Action Buttons (Request Quote & Book Test Drive with spec)
    const btnQuote = document.getElementById('cfg-btn-quote');
    if (btnQuote) {
      btnQuote.addEventListener('click', () => {
        openQuoteRequestModal();
      });
    }

    const btnTestDriveSpec = document.getElementById('cfg-btn-testdrive');
    if (btnTestDriveSpec) {
      btnTestDriveSpec.addEventListener('click', () => {
        const tdSection = document.getElementById('test-drive');
        const tdSelect = document.getElementById('td-vehicle-select');
        if (tdSelect) tdSelect.value = state.selectedModelId;
        if (tdSection) {
          const offsetTop = tdSection.getBoundingClientRect().top + window.pageYOffset - 80;
          window.scrollTo({ top: offsetTop, behavior: 'smooth' });
        }
        showToast(`Selected HENRY ${state.selectedModelId} for your Test Drive!`, 'success');
      });
    }
  }

  function selectConfiguratorModel(modelId) {
    state.selectedModelId = modelId;
    
    // Update Tabs UI
    document.querySelectorAll('.cfg-model-tab').forEach(tab => {
      const isCurrent = tab.getAttribute('data-model') === modelId;
      if (isCurrent) {
        tab.className = 'cfg-model-tab px-4 py-2.5 rounded-xl font-bold text-xs md:text-sm bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/30 transition-all';
      } else {
        tab.className = 'cfg-model-tab px-4 py-2.5 rounded-xl font-medium text-xs md:text-sm text-slate-400 bg-slate-900/60 hover:text-white hover:bg-slate-800/80 border border-slate-800 transition-all';
      }
    });

    // Reset default powertrain for that model
    const pList = HENRY_DATA.configurator.powertrains[modelId];
    if (pList && pList.length > 0) {
      state.selectedPowertrainId = pList[0].id;
    }

    // Notify Visualizer
    if (state.visualizer) {
      state.visualizer.setModel(modelId);
    }

    // Refresh dependent sections
    renderConfiguratorPowertrains();
    updateConfiguratorPrice();
  }

  function renderConfiguratorColors() {
    const container = document.getElementById('cfg-color-options');
    if (!container) return;

    container.innerHTML = HENRY_DATA.configurator.colors.map(col => `
      <button class="cfg-color-btn group relative p-1.5 rounded-2xl border transition-all flex flex-col items-center gap-1.5 ${col.id === state.selectedColor.id ? 'border-cyan-400 bg-cyan-950/30 ring-2 ring-cyan-500/20' : 'border-slate-800 bg-slate-900/40 hover:border-slate-700'}" data-color="${col.id}">
        <span class="w-8 h-8 md:w-10 md:h-10 rounded-xl shadow-inner border border-white/20 transition-transform group-hover:scale-105" style="background-color: ${col.hex};"></span>
        <span class="text-[11px] font-medium text-slate-300 truncate max-w-[80px] text-center">${col.name.split(' ')[0]}</span>
        <span class="text-[9px] font-mono text-cyan-400">${col.priceLabel}</span>
      </button>
    `).join('');

    container.querySelectorAll('.cfg-color-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const colId = btn.getAttribute('data-color');
        const found = HENRY_DATA.configurator.colors.find(c => c.id === colId);
        if (found) {
          state.selectedColor = found;
          renderConfiguratorColors();
          if (state.visualizer) state.visualizer.setColor(found);
          updateConfiguratorPrice();
        }
      });
    });
  }

  function renderConfiguratorWheels() {
    const container = document.getElementById('cfg-wheel-options');
    if (!container) return;

    container.innerHTML = HENRY_DATA.configurator.wheels.map(wheel => `
      <div class="cfg-wheel-card p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${wheel.id === state.currentWheel.id ? 'border-blue-500 bg-blue-950/30' : 'border-slate-800 bg-slate-900/40 hover:border-slate-700'}" data-wheel="${wheel.id}">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-slate-950 border border-slate-700 flex items-center justify-center text-slate-300">
            <i class="fa-solid fa-circle-dot text-base text-cyan-400"></i>
          </div>
          <div>
            <div class="text-xs font-bold text-white">${wheel.name}</div>
            <div class="text-[11px] text-slate-400">${wheel.desc}</div>
          </div>
        </div>
        <div class="text-xs font-mono font-bold text-cyan-400 shrink-0">${wheel.priceLabel}</div>
      </div>
    `).join('');

    container.querySelectorAll('.cfg-wheel-card').forEach(card => {
      card.addEventListener('click', () => {
        const wId = card.getAttribute('data-wheel');
        const found = HENRY_DATA.configurator.wheels.find(w => w.id === wId);
        if (found) {
          state.currentWheel = found;
          renderConfiguratorWheels();
          if (state.visualizer) state.visualizer.setWheel(found);
          updateConfiguratorPrice();
        }
      });
    });
  }

  function renderConfiguratorInteriors() {
    const container = document.getElementById('cfg-interior-options');
    if (!container) return;

    container.innerHTML = HENRY_DATA.configurator.interiors.map(int => `
      <div class="cfg-int-card p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${int.id === state.currentInterior.id ? 'border-blue-500 bg-blue-950/30' : 'border-slate-800 bg-slate-900/40 hover:border-slate-700'}" data-int="${int.id}">
        <div class="flex items-center gap-3">
          <span class="w-10 h-10 rounded-xl shadow-inner border border-white/20 shrink-0" style="background-color: ${int.swatch};"></span>
          <div>
            <div class="text-xs font-bold text-white">${int.name}</div>
            <div class="text-[11px] text-slate-400 line-clamp-1">${int.desc}</div>
          </div>
        </div>
        <div class="text-xs font-mono font-bold text-cyan-400 shrink-0">${int.priceLabel}</div>
      </div>
    `).join('');

    container.querySelectorAll('.cfg-int-card').forEach(card => {
      card.addEventListener('click', () => {
        const intId = card.getAttribute('data-int');
        const found = HENRY_DATA.configurator.interiors.find(i => i.id === intId);
        if (found) {
          state.currentInterior = found;
          renderConfiguratorInteriors();
          if (state.visualizer) state.visualizer.setInterior(found);
          updateConfiguratorPrice();
        }
      });
    });
  }

  function renderConfiguratorPowertrains() {
    const container = document.getElementById('cfg-powertrain-options');
    if (!container) return;

    const list = HENRY_DATA.configurator.powertrains[state.selectedModelId] || [];
    container.innerHTML = list.map(pt => `
      <div class="cfg-pt-card p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${pt.id === state.selectedPowertrainId ? 'border-blue-500 bg-blue-950/30' : 'border-slate-800 bg-slate-900/40 hover:border-slate-700'}" data-pt="${pt.id}">
        <div>
          <div class="text-xs font-bold text-white">${pt.name}</div>
          <div class="text-[11px] text-slate-400">${pt.desc}</div>
        </div>
        <div class="text-xs font-mono font-bold text-cyan-400 shrink-0">${pt.label}</div>
      </div>
    `).join('');

    container.querySelectorAll('.cfg-pt-card').forEach(card => {
      card.addEventListener('click', () => {
        state.selectedPowertrainId = card.getAttribute('data-pt');
        renderConfiguratorPowertrains();
        updateConfiguratorPrice();
      });
    });
  }

  function renderConfiguratorPackages() {
    const container = document.getElementById('cfg-package-options');
    if (!container) return;

    container.innerHTML = HENRY_DATA.configurator.packages.map(pkg => {
      const isChecked = state.selectedPackages.has(pkg.id);
      return `
        <div class="cfg-pkg-card p-3 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${isChecked ? 'border-cyan-500/70 bg-cyan-950/20' : 'border-slate-800 bg-slate-900/40 hover:border-slate-700'}" data-pkg="${pkg.id}">
          <input type="checkbox" class="mt-1 rounded text-cyan-500 bg-slate-900 border-slate-700 focus:ring-cyan-500 pointer-events-none" ${isChecked ? 'checked' : ''} />
          <div class="flex-1">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-white">${pkg.name}</span>
              <span class="text-xs font-mono font-bold text-cyan-400">${pkg.priceLabel}</span>
            </div>
            <p class="text-[11px] text-slate-400 mt-0.5">${pkg.desc}</p>
          </div>
        </div>
      `;
    }).join('');

    container.querySelectorAll('.cfg-pkg-card').forEach(card => {
      card.addEventListener('click', () => {
        const pkgId = card.getAttribute('data-pkg');
        if (state.selectedPackages.has(pkgId)) {
          state.selectedPackages.delete(pkgId);
        } else {
          state.selectedPackages.add(pkgId);
        }
        renderConfiguratorPackages();
        updateConfiguratorPrice();
      });
    });
  }

  function calculateConfigPrice() {
    const model = HENRY_DATA.models[state.selectedModelId];
    let total = model.basePrice;

    // Color
    total += (state.selectedColor.price || 0);

    // Wheel
    total += (state.currentWheel.price || 0);

    // Interior
    total += (state.selectedInterior.price || 0);

    // Powertrain
    const ptList = HENRY_DATA.configurator.powertrains[state.selectedModelId] || [];
    const chosenPt = ptList.find(p => p.id === state.selectedPowertrainId);
    if (chosenPt) total += (chosenPt.price || 0);

    // Packages
    state.selectedPackages.forEach(pkgId => {
      const pkg = HENRY_DATA.configurator.packages.find(p => p.id === pkgId);
      if (pkg) total += (pkg.price || 0);
    });

    return total;
  }

  function updateConfiguratorPrice() {
    const totalLakhs = calculateConfigPrice();
    const formattedPrice = `₹${totalLakhs.toFixed(2)} Lakh`;

    // Calculate Estimated Monthly EMI (assuming 8.5% interest, 5 year loan, 20% down payment)
    const principal = (totalLakhs * 100000) * 0.8;
    const monthlyRate = 0.085 / 12;
    const months = 60;
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    const formattedEMI = `₹${Math.round(emi).toLocaleString('en-IN')}/mo`;

    const priceDisplay = document.getElementById('cfg-total-price');
    const emiDisplay = document.getElementById('cfg-emi-estimate');
    const summaryModel = document.getElementById('cfg-summary-model');

    if (priceDisplay) priceDisplay.innerText = formattedPrice;
    if (emiDisplay) emiDisplay.innerText = formattedEMI;
    if (summaryModel) summaryModel.innerText = `YOUR HENRY ${state.selectedModelId}`;
  }

  function setupTechnologySection() {
    const techTabs = document.querySelectorAll('.tech-tab-btn');
    const contentArea = document.getElementById('tech-feature-content');

    const renderTechContent = (techId) => {
      const tech = HENRY_DATA.technologies.find(t => t.id === techId);
      if (!tech || !contentArea) return;

      contentArea.innerHTML = `
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-fadeIn">
          <!-- Left Specs & Points -->
          <div class="lg:col-span-6 space-y-6">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-cyan-400 text-xs font-mono uppercase tracking-wider">
              <i class="fa-solid fa-microchip"></i> ${tech.badge}
            </div>

            <h3 class="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              ${tech.title}
            </h3>

            <p class="text-slate-300 text-base leading-relaxed">
              ${tech.summary}
            </p>

            <ul class="space-y-3.5 pt-2">
              ${tech.points.map(pt => `
                <li class="flex items-start gap-3">
                  <div class="w-6 h-6 rounded-full bg-blue-500/20 border border-blue-400/40 flex items-center justify-center shrink-0 mt-0.5 text-cyan-400 text-xs">
                    <i class="fa-solid fa-check"></i>
                  </div>
                  <span class="text-slate-300 text-sm leading-snug">${pt}</span>
                </li>
              `).join('')}
            </ul>

            <!-- Live Telemetry Stat Pills -->
            <div class="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800">
              <div class="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
                <div class="text-2xl font-black text-cyan-400 font-mono">${tech.stats.primary}</div>
                <div class="text-xs text-slate-400 mt-1">${tech.stats.label}</div>
              </div>
              <div class="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
                <div class="text-2xl font-black text-white font-mono">${tech.stats.secondary}</div>
                <div class="text-xs text-slate-400 mt-1">${tech.stats.sublabel}</div>
              </div>
            </div>
          </div>

          <!-- Right Animated Technical Graphic -->
          <div class="lg:col-span-6 flex items-center justify-center">
            <div class="relative w-full aspect-square max-w-[440px] rounded-3xl bg-slate-950/80 border border-slate-800 p-6 flex items-center justify-center overflow-hidden shadow-2xl">
              <!-- Background Radar Waves -->
              <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,#0284c715_0%,transparent_70%)]"></div>
              <div class="absolute w-72 h-72 rounded-full border border-cyan-500/20 animate-ping duration-1000"></div>
              <div class="absolute w-52 h-52 rounded-full border border-blue-500/30"></div>
              <div class="absolute w-32 h-32 rounded-full border border-slate-700"></div>

              <!-- Center Core Graphic -->
              <div class="relative z-10 text-center space-y-3">
                <div class="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 p-0.5 shadow-xl shadow-blue-500/30">
                  <div class="w-full h-full bg-[#07090e] rounded-2xl flex items-center justify-center text-cyan-400 text-3xl">
                    <i class="fa-solid fa-${tech.id === 'smartdrive' ? 'compass' : (tech.id === 'connect' ? 'wifi' : (tech.id === 'smartsense' ? 'shield-halved' : 'bolt'))}"></i>
                  </div>
                </div>
                <div class="text-sm font-bold text-white font-mono">${tech.title.toUpperCase()} ENGINE</div>
                <div class="text-xs text-cyan-400 font-mono tracking-wider animate-pulse">● LIVE TELEMETRY ACTIVE</div>
              </div>
            </div>
          </div>
        </div>
      `;
    };

    techTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        techTabs.forEach(t => {
          t.classList.remove('active', 'bg-blue-600/30', 'border-blue-500', 'text-white');
          t.classList.add('text-slate-400', 'border-slate-800');
        });
        tab.classList.add('active', 'bg-blue-600/30', 'border-blue-500', 'text-white');
        tab.classList.remove('text-slate-400', 'border-slate-800');
        const id = tab.getAttribute('data-tech');
        renderTechContent(id);
      });
    });

    renderTechContent('smartdrive');
  }

  function setupSafetySection() {
    const container = document.getElementById('safety-grid');
    if (!container) return;

    container.innerHTML = HENRY_DATA.safetyFeatures.map(feat => `
      <div class="group p-5 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-cyan-500/40 transition-all duration-300 hover:-translate-y-1">
        <div class="w-10 h-10 rounded-xl bg-blue-950/60 border border-blue-800/50 flex items-center justify-center text-cyan-400 mb-3 group-hover:scale-110 transition-transform">
          <i class="fa-solid fa-${feat.icon === 'disc' ? 'compact-disc' : (feat.icon === 'box' ? 'cubes' : (feat.icon === 'user-check' ? 'shield-heart' : feat.icon))} text-base"></i>
        </div>
        <h4 class="text-base font-bold text-white mb-1 group-hover:text-cyan-300 transition-colors">${feat.title}</h4>
        <p class="text-xs text-slate-400 leading-relaxed">${feat.desc}</p>
      </div>
    `).join('');
  }

  function renderReviews() {
    const container = document.getElementById('reviews-grid');
    if (!container) return;

    container.innerHTML = HENRY_DATA.reviews.map(rev => `
      <div class="p-6 md:p-8 rounded-3xl bg-gradient-to-b from-slate-900/80 to-[#07090e] border border-slate-800/80 flex flex-col justify-between hover:border-slate-700 transition-all">
        <div>
          <!-- Star Ratings -->
          <div class="flex items-center gap-1 text-amber-400 text-sm mb-4">
            ${Array(rev.rating).fill('<i class="fa-solid fa-star"></i>').join('')}
          </div>

          <p class="text-lg font-bold text-white mb-3">"${rev.headline}"</p>
          <p class="text-slate-300 text-xs md:text-sm leading-relaxed">${rev.comment}</p>
        </div>

        <div class="pt-6 mt-6 border-t border-slate-800/80 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 font-bold text-xs text-white flex items-center justify-center">
              ${rev.avatar}
            </div>
            <div>
              <div class="text-xs font-bold text-white">${rev.author}</div>
              <div class="text-[11px] text-slate-400">${rev.location} • ${rev.modelOwned}</div>
            </div>
          </div>
          <span class="text-[10px] font-mono text-cyan-400 flex items-center gap-1 bg-cyan-950/40 px-2 py-0.5 rounded-md border border-cyan-800/40">
            <i class="fa-solid fa-shield-check"></i> Verified Owner
          </span>
        </div>
      </div>
    `).join('');
  }

  function setupTestDriveEngine() {
    const form = document.getElementById('test-drive-form');
    const citySelect = document.getElementById('td-city-select');

    if (citySelect) {
      citySelect.innerHTML = `
        <option value="" disabled selected>Select Your City</option>
        ${HENRY_DATA.cities.map(c => `<option value="${c}">${c}</option>`).join('')}
      `;
    }

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('td-name').value.trim();
        const email = document.getElementById('td-email').value.trim();
        const phone = document.getElementById('td-phone').value.trim();
        const city = citySelect.value;
        const vehicle = document.getElementById('td-vehicle-select').value;
        const date = document.getElementById('td-date').value;

        if (!name || !email || !phone || !city || !vehicle || !date) {
          showToast('Please fill out all required fields.', 'error');
          return;
        }

        // Generate Booking Confirmation
        const bookingRef = `HENRY-TD-${Math.floor(10000 + Math.random() * 90000)}`;
        openTestDriveSuccessModal({ name, email, phone, city, vehicle, date, bookingRef });
        form.reset();
      });
    }
  }

  function setupModalsAndToasts() {
    // Newsletter Form Handler
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
      newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = newsletterForm.querySelector('input[type="email"]');
        if (input && input.value.trim()) {
          showToast('Thank you for subscribing to HENRY updates!', 'success');
          input.value = '';
        }
      });
    }
  }

  // --- MODALS IMPLEMENTATION ---

  function openModelSpecsModal(modelId) {
    const model = HENRY_DATA.models[modelId];
    if (!model) return;

    const modal = document.getElementById('specs-modal');
    const modalContent = document.getElementById('specs-modal-body');
    if (!modal || !modalContent) return;

    modalContent.innerHTML = `
      <div class="p-6 md:p-8 space-y-6">
        <!-- Header -->
        <div class="flex items-start justify-between border-b border-slate-800 pb-4">
          <div>
            <span class="text-xs font-mono text-cyan-400 tracking-wider uppercase">${model.tag}</span>
            <h2 class="text-3xl font-black text-white mt-1">${model.name}</h2>
            <div class="text-xl font-extrabold text-white mt-1">Starting at ${model.priceFormatted}</div>
          </div>
          <button id="close-specs-modal" class="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center">
            <i class="fa-solid fa-xmark text-sm"></i>
          </button>
        </div>

        <!-- Spec Table Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          ${Object.entries(model.specs).map(([key, val]) => `
            <div class="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex justify-between items-center">
              <span class="text-slate-400 capitalize font-mono">${key.replace(/([A-Z])/g, ' $1')}</span>
              <span class="font-bold text-white text-right">${val}</span>
            </div>
          `).join('')}
        </div>

        <!-- All Key Features -->
        <div>
          <h4 class="text-xs font-mono text-slate-400 uppercase mb-3">Key Standard Equipment</h4>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            ${model.keyFeatures.map(feat => `
              <div class="flex items-center gap-2 text-xs text-slate-300">
                <i class="fa-solid fa-circle-check text-cyan-400 text-xs shrink-0"></i>
                <span>${feat}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Modal Actions -->
        <div class="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
          <button id="modal-build-now" class="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-md">
            Configure ${model.name}
          </button>
        </div>
      </div>
    `;

    modal.classList.remove('hidden');
    modal.classList.add('flex');

    const closeBtn = document.getElementById('close-specs-modal');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
      });
    }

    const buildBtn = document.getElementById('modal-build-now');
    if (buildBtn) {
      buildBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        selectConfiguratorModel(modelId);
        const cfgSection = document.getElementById('configurator');
        if (cfgSection) {
          const offsetTop = cfgSection.getBoundingClientRect().top + window.pageYOffset - 80;
          window.scrollTo({ top: offsetTop, behavior: 'smooth' });
        }
      });
    }
  }

  function openQuoteRequestModal() {
    const modal = document.getElementById('quote-modal');
    const modalContent = document.getElementById('quote-modal-body');
    if (!modal || !modalContent) return;

    const totalLakhs = calculateConfigPrice();
    const model = HENRY_DATA.models[state.selectedModelId];

    modalContent.innerHTML = `
      <div class="p-6 md:p-8 space-y-6">
        <div class="flex items-start justify-between border-b border-slate-800 pb-4">
          <div>
            <span class="text-xs font-mono text-cyan-400 uppercase tracking-wider">OFFICIAL QUOTE SUMMARY</span>
            <h2 class="text-2xl font-black text-white mt-1">HENRY ${state.selectedModelId} Build</h2>
            <div class="text-2xl font-black text-cyan-400 mt-1">₹${totalLakhs.toFixed(2)} Lakh</div>
          </div>
          <button id="close-quote-modal" class="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center">
            <i class="fa-solid fa-xmark text-sm"></i>
          </button>
        </div>

        <!-- Itemized Breakdown -->
        <div class="space-y-2 text-xs bg-slate-900/90 p-4 rounded-2xl border border-slate-800">
          <div class="flex justify-between text-slate-300">
            <span>Base Model (${model.name})</span>
            <span class="font-mono font-bold text-white">₹${model.basePrice.toFixed(2)} L</span>
          </div>
          <div class="flex justify-between text-slate-300">
            <span>Paint: ${state.selectedColor.name}</span>
            <span class="font-mono font-bold text-white">${state.selectedColor.priceLabel}</span>
          </div>
          <div class="flex justify-between text-slate-300">
            <span>Wheels: ${state.currentWheel.name}</span>
            <span class="font-mono font-bold text-white">${state.currentWheel.priceLabel}</span>
          </div>
          <div class="flex justify-between text-slate-300">
            <span>Interior: ${state.selectedInterior.name}</span>
            <span class="font-mono font-bold text-white">${state.selectedInterior.priceLabel}</span>
          </div>
          ${Array.from(state.selectedPackages).map(pkgId => {
            const p = HENRY_DATA.configurator.packages.find(x => x.id === pkgId);
            return p ? `
              <div class="flex justify-between text-slate-300">
                <span>Option: ${p.name}</span>
                <span class="font-mono font-bold text-white">${p.priceLabel}</span>
              </div>
            ` : '';
          }).join('')}
          <div class="pt-3 border-t border-slate-700 flex justify-between font-bold text-sm text-cyan-300">
            <span>Total Estimated Ex-Showroom</span>
            <span class="font-mono">₹${totalLakhs.toFixed(2)} Lakh</span>
          </div>
        </div>

        <!-- Quick Form -->
        <form id="quote-submit-form" class="space-y-3">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input type="text" placeholder="Full Name *" required class="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-cyan-400 focus:outline-none" />
            <input type="tel" placeholder="Mobile Number *" required class="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-cyan-400 focus:outline-none" />
          </div>
          <input type="email" placeholder="Email Address *" required class="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-cyan-400 focus:outline-none" />

          <button type="submit" class="w-full py-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-lg shadow-blue-500/20">
            Send Official Price Breakup & Brochure
          </button>
        </form>
      </div>
    `;

    modal.classList.remove('hidden');
    modal.classList.add('flex');

    const closeBtn = document.getElementById('close-quote-modal');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
      });
    }

    const form = document.getElementById('quote-submit-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        showToast('Official quote & configuration PDF sent to your email!', 'success');
      });
    }
  }

  function openTestDriveSuccessModal(data) {
    const modal = document.getElementById('td-success-modal');
    const modalBody = document.getElementById('td-success-body');
    if (!modal || !modalBody) return;

    modalBody.innerHTML = `
      <div class="p-6 md:p-8 space-y-6 text-center">
        <div class="w-16 h-16 rounded-full bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-400 text-2xl mx-auto animate-bounce">
          <i class="fa-solid fa-check"></i>
        </div>

        <div>
          <span class="text-xs font-mono text-cyan-400 uppercase tracking-widest">TEST DRIVE CONFIRMED</span>
          <h2 class="text-2xl font-black text-white mt-1">Get Ready to Experience HENRY</h2>
          <p class="text-xs text-slate-400 mt-1">Your appointment reference pass has been generated.</p>
        </div>

        <div class="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-left space-y-2 text-xs">
          <div class="flex justify-between"><span class="text-slate-400">Booking Pass ID:</span><span class="font-mono font-bold text-cyan-400">${data.bookingRef}</span></div>
          <div class="flex justify-between"><span class="text-slate-400">Driver Name:</span><span class="font-bold text-white">${data.name}</span></div>
          <div class="flex justify-between"><span class="text-slate-400">Vehicle:</span><span class="font-bold text-white">HENRY ${data.vehicle}</span></div>
          <div class="flex justify-between"><span class="text-slate-400">City / Location:</span><span class="font-bold text-white">${data.city}</span></div>
          <div class="flex justify-between"><span class="text-slate-400">Date:</span><span class="font-bold text-white">${data.date}</span></div>
        </div>

        <button id="close-td-success" class="w-full py-3 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-500">
          Done
        </button>
      </div>
    `;

    modal.classList.remove('hidden');
    modal.classList.add('flex');

    const closeBtn = document.getElementById('close-td-success');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
      });
    }
  }

  function showToast(message, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    const isSuccess = type === 'success';
    const isError = type === 'error';
    toast.className = `px-4 py-3 rounded-2xl border backdrop-blur-xl shadow-2xl flex items-center gap-3 text-xs font-medium pointer-events-auto transition-all transform translate-y-4 opacity-0 ${isSuccess ? 'bg-slate-900/90 border-cyan-500/60 text-white' : (isError ? 'bg-red-950/90 border-red-500 text-white' : 'bg-slate-900/90 border-slate-700 text-slate-200')}`;
    
    toast.innerHTML = `
      <i class="fa-solid fa-${isSuccess ? 'circle-check text-cyan-400' : (isError ? 'circle-exclamation text-red-400' : 'circle-info text-blue-400')} text-sm"></i>
      <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.remove('translate-y-4', 'opacity-0');
      toast.classList.add('translate-y-0', 'opacity-100');
    }, 10);

    setTimeout(() => {
      toast.classList.add('opacity-0', 'translate-y-4');
      setTimeout(() => toast.remove(), 400);
    }, 4000);
  }
});
