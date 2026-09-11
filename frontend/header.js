/**
 * Krishi AI - Unified Header Component
 * Adapts VoteVictory's clean, minimalist topbar pattern with Krishi AI's green identity.
 * Provides identical navigation, language switcher, notifications, AgriStore shortcut,
 * and user profile pill across all pages.
 */

(function () {
  function renderUnifiedHeader() {
    const headerMount = document.getElementById("ka-header-mount") || document.querySelector(".ka-header-placeholder");
    const existingHeader = document.querySelector("header.main-header, header.ka-topbar");

    // Determine current active page
    const pathname = window.location.pathname.toLowerCase();
    const isDashboard = pathname.includes("dashboard.html");
    const isDisease = pathname.includes("disease.html");
    const isWeather = pathname.includes("weather.html");
    const isAssistant = pathname.includes("assistant.html");
    const isStore = pathname.includes("/store/");
    const isProfile = pathname.includes("profile.html");
    const isAbout = pathname.includes("about.html");
    const isContact = pathname.includes("contact.html");
    const isHome = pathname.endsWith("index.html") || pathname.endsWith("/") || (!isDashboard && !isDisease && !isWeather && !isAssistant && !isStore && !isProfile && !isAbout && !isContact);

    // Prefix for paths depending on whether inside /store/ or root
    const rootPrefix = isStore ? "../" : "./";

    // User authentication state
    const loggedInUser = localStorage.getItem("loggedInUser") || "";
    const userInitial = loggedInUser ? loggedInUser.charAt(0).toUpperCase() : "👤";
    const userDisplayName = loggedInUser || "किसान / Guest";

    const headerHtml = `
      <header class="ka-topbar" id="kaTopbar">
        <!-- Left: Brand + Nav Toggle -->
        <div class="ka-topbar-left">
          <button class="ka-menu-toggle" id="kaMenuToggle" aria-label="Toggle Navigation" title="Menu">
            <i class="fa-solid fa-bars"></i>
          </button>
          
          <a href="${rootPrefix}dashboard.html" class="ka-brand-link">
            <div class="ka-brand-logo-wrap">
              <span class="ka-brand-icon">🌱</span>
            </div>
            <div class="ka-brand-text">
              <div class="ka-brand-title">Krishi AI</div>
              <div class="ka-brand-subtitle">कृषि AI • Smart Farming</div>
            </div>
          </a>

          <!-- Desktop Navigation Links -->
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
              <i class="fa-solid fa-store"></i>
              <span data-i18n="agriStore">AgriStore</span>
            </a>
          </nav>
        </div>

        <!-- Right: Controls Cluster -->
        <div class="ka-topbar-right">
          
          <!-- Language Selector -->
          <div class="ka-lang-wrap" id="kaHeaderLangMount" title="Change Language / भाषा बदलें">
            <!-- Rendered by KrishiI18n -->
          </div>

          <!-- Notification Bell -->
          <div class="ka-notify-wrap">
            <button class="ka-icon-btn" id="kaNotificationBtn" title="Notifications / सूचनाएँ" aria-label="Notifications">
              <i class="fa-regular fa-bell"></i>
              <span class="ka-notify-dot"></span>
            </button>
            <div class="ka-notify-dropdown" id="kaNotifyDropdown" style="display: none;">
              <div class="ka-notify-header">
                <strong>सूचनाएँ (Notifications)</strong>
                <span class="ka-notify-count">2 New</span>
              </div>
              <div class="ka-notify-item">
                <i class="fa-solid fa-cloud-rain" style="color: #0284c7;"></i>
                <div>
                  <div class="ka-notify-text">मौसम चेतावनी: अगले 24 घंटों में हल्की बारिश संभव</div>
                  <div class="ka-notify-time">2 घंटे पहले</div>
                </div>
              </div>
              <div class="ka-notify-item">
                <i class="fa-solid fa-tag" style="color: #0b7a3a;"></i>
                <div>
                  <div class="ka-notify-text">AgriStore: IFFCO जैविक खाद पर 20% छूट उपलब्ध</div>
                  <div class="ka-notify-time">आज सुबह</div>
                </div>
              </div>
            </div>
          </div>

          <!-- AgriStore Shortcut Pill -->
          <a href="${rootPrefix}store/index.html" class="ka-store-pill" title="Shop Agri-Inputs">
            <i class="fa-solid fa-bag-shopping"></i>
            <span class="ka-store-label" data-i18n="agriStore">AgriStore</span>
          </a>

          <!-- User Pill / Profile Shortcut -->
          ${loggedInUser ? `
            <a href="${rootPrefix}profile.html" class="ka-user-pill" title="My Profile (${loggedInUser})">
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
      // Replace existing non-dashboard header
      existingHeader.outerHTML = headerHtml;
    } else if (!isDashboard && !document.getElementById("kaTopbar")) {
      // Prepend to body if neither found
      document.body.insertAdjacentHTML("afterbegin", headerHtml);
    }

    // Initialize interactive behaviors
    initHeaderEvents();
  }

  function initHeaderEvents() {
    // 1. Mobile Menu Toggle
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

    // 2. Notification Bell Dropdown
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

    // 3. Language Selector Mount
    if (window.krishiI18n && typeof window.krishiI18n.renderSelector === "function") {
      window.krishiI18n.renderSelector("kaHeaderLangMount", { compact: true });
      window.krishiI18n.translatePage();
    }
  }

  // Run on DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderUnifiedHeader);
  } else {
    renderUnifiedHeader();
  }
})();
