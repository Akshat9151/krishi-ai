/**
 * Krishi AI - Modern Emerald Global Header Component
 * Provides clean topbar, language selector, notifications drawer, AgriStore shortcut,
 * and user session pill across all Krishi AI pages.
 */

(function () {
  function renderUnifiedHeader() {
    const headerMount = document.getElementById("ka-header-mount") || document.querySelector(".ka-header-placeholder");
    const existingHeader = document.querySelector("header.main-header, header.ka-topbar");

    const pathname = window.location.pathname.toLowerCase();
    const isDashboard = pathname.includes("dashboard.html");
    const isDisease = pathname.includes("disease.html");
    const isWeather = pathname.includes("weather.html");
    const isAssistant = pathname.includes("assistant.html");
    const isStore = pathname.includes("/store/");
    const isProfile = pathname.includes("profile.html");
    const isAbout = pathname.includes("about.html");
    const isContact = pathname.includes("contact.html");

    const rootPrefix = isStore ? "../" : "./";
    const loggedInUser = localStorage.getItem("loggedInUser") || "";
    const userInitial = loggedInUser ? loggedInUser.charAt(0).toUpperCase() : "🌱";
    const userDisplayName = loggedInUser || "किसान / Farmer";

    const headerHtml = `
      <header class="ka-topbar" id="kaTopbar">
        <!-- Left: Brand + Nav Toggle -->
        <div class="ka-topbar-left">
          <button class="ka-menu-toggle" id="kaMenuToggle" aria-label="Toggle Navigation" title="Menu">
            <i class="fa-solid fa-bars"></i>
          </button>
          
          <a href="${rootPrefix}index.html" class="ka-brand-link">
            <div class="ka-brand-logo-wrap">
              <i class="fa-solid fa-seedling"></i>
            </div>
            <div class="ka-brand-text">
              <div class="ka-brand-title">Krishi AI</div>
              <div class="ka-brand-subtitle">स्मार्ट कृषि • Smart Agriculture</div>
            </div>
          </a>

          <!-- Desktop Navigation -->
          <nav class="ka-nav-links" id="kaNavMenu">
            <a href="${rootPrefix}dashboard.html" class="ka-nav-item ${isDashboard ? 'active' : ''}">
              <i class="fa-solid fa-chart-pie"></i>
              <span data-i18n="dashboard">Dashboard</span>
            </a>
            <a href="${rootPrefix}disease.html" class="ka-nav-item ${isDisease ? 'active' : ''}">
              <i class="fa-solid fa-microscope"></i>
              <span data-i18n="diseaseTitle">Plant Doctor</span>
            </a>
            <a href="${rootPrefix}weather.html" class="ka-nav-item ${isWeather ? 'active' : ''}">
              <i class="fa-solid fa-cloud-sun"></i>
              <span data-i18n="weatherTitle">Weather</span>
            </a>
            <a href="${rootPrefix}assistant.html" class="ka-nav-item ${isAssistant ? 'active' : ''}">
              <i class="fa-solid fa-robot"></i>
              <span data-i18n="assistantTitle">AI Assistant</span>
            </a>
            <a href="${rootPrefix}store/index.html" class="ka-nav-item ${isStore ? 'active' : ''}">
              <i class="fa-solid fa-bag-shopping"></i>
              <span data-i18n="agriStore">AgriStore</span>
            </a>
          </nav>
        </div>

        <!-- Right: Actions Cluster -->
        <div class="ka-topbar-right">
          
          <!-- Language Selector -->
          <div class="ka-lang-wrap" id="kaHeaderLangMount" title="Change Language / भाषा बदलें"></div>

          <!-- Notification Bell -->
          <div class="ka-notify-wrap" style="position: relative;">
            <button class="ka-icon-btn" id="kaNotificationBtn" title="Notifications / सूचनाएँ" aria-label="Notifications">
              <i class="fa-regular fa-bell"></i>
              <span class="ka-notify-dot"></span>
            </button>
            <div class="ka-notify-dropdown" id="kaNotifyDropdown" style="display: none; position: absolute; top: calc(100% + 10px); right: 0; width: 300px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px; box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.1); padding: 14px; z-index: 1100;">
              <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 8px; border-bottom: 1px solid #f1f5f9; font-size: 13px; font-weight: 700; color: #0f172a;">
                <span>📢 सूचनाएँ (Notifications)</span>
                <span style="background: #ecfdf5; color: #059669; font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 10px;">2 New</span>
              </div>
              <div style="display: flex; gap: 10px; padding: 10px 0; border-bottom: 1px dashed #f1f5f9; font-size: 12.5px;">
                <i class="fa-solid fa-cloud-sun" style="color: #0284c7; font-size: 16px; margin-top: 2px;"></i>
                <div>
                  <div style="color: #1e293b; font-weight: 600;">मौसम सलाह: आज शाम हल्की बारिश का अनुमान</div>
                  <div style="color: #94a3b8; font-size: 11px; margin-top: 2px;">1 घंटा पहले</div>
                </div>
              </div>
              <div style="display: flex; gap: 10px; padding: 10px 0; font-size: 12.5px;">
                <i class="fa-solid fa-tag" style="color: #059669; font-size: 16px; margin-top: 2px;"></i>
                <div>
                  <div style="color: #1e293b; font-weight: 600;">AgriStore: IFFCO NPK खाद पर 15% छूट</div>
                  <div style="color: #94a3b8; font-size: 11px; margin-top: 2px;">आज सुबह</div>
                </div>
              </div>
            </div>
          </div>

          <!-- AgriStore Shortcut -->
          <a href="${rootPrefix}store/index.html" class="ka-store-pill" title="Open AgriStore">
            <i class="fa-solid fa-store"></i>
            <span class="ka-store-label" data-i18n="agriStore">AgriStore</span>
          </a>

          <!-- User Pill / Profile Button -->
          ${loggedInUser ? `
            <a href="${rootPrefix}profile.html" class="ka-user-pill" title="View Profile (${loggedInUser})">
              <div class="ka-user-avatar">${userInitial}</div>
              <div class="ka-user-info">
                <span class="ka-user-name">${loggedInUser}</span>
                <span class="ka-user-role">किसान 🌱</span>
              </div>
            </a>
          ` : `
            <a href="${rootPrefix}login.html" class="ka-login-pill">
              <i class="fa-solid fa-arrow-right-to-bracket"></i>
              <span>Sign In</span>
            </a>
          `}

        </div>
      </header>
    `;

    if (headerMount) {
      headerMount.outerHTML = headerHtml;
    } else if (existingHeader && !isDashboard) {
      existingHeader.outerHTML = headerHtml;
    } else if (!isDashboard && !document.getElementById("kaTopbar")) {
      document.body.insertAdjacentHTML("afterbegin", headerHtml);
    }

    initHeaderEvents();
  }

  function initHeaderEvents() {
    const menuToggle = document.getElementById("kaMenuToggle");
    const navMenu = document.getElementById("kaNavMenu");
    if (menuToggle && navMenu) {
      menuToggle.addEventListener("click", (e) => {
        e.stopPropagation();
        navMenu.classList.toggle("ka-mobile-open");
      });
      document.addEventListener("click", (e) => {
        if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
          navMenu.classList.remove("ka-mobile-open");
        }
      });
    }

    const notifyBtn = document.getElementById("kaNotificationBtn");
    const notifyDropdown = document.getElementById("kaNotifyDropdown");
    if (notifyBtn && notifyDropdown) {
      notifyBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const isOpen = notifyDropdown.style.display === "block";
        notifyDropdown.style.display = isOpen ? "none" : "block";
      });
      document.addEventListener("click", (e) => {
        if (!notifyDropdown.contains(e.target) && !notifyBtn.contains(e.target)) {
          notifyDropdown.style.display = "none";
        }
      });
    }

    if (window.krishiI18n && typeof window.krishiI18n.renderSelector === "function") {
      window.krishiI18n.renderSelector("kaHeaderLangMount", { compact: true });
      window.krishiI18n.translatePage();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderUnifiedHeader);
  } else {
    renderUnifiedHeader();
  }
})();
