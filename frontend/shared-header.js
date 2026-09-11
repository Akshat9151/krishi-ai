/**
 * Krishi AI shared authenticated header.
 * One source of truth for dashboard and AgriStore pages.
 */
(() => {
  const pageRoot = () => location.pathname.includes('/store/') ? '../' : '';
  const dashboardHref = () => pageRoot() + 'dashboard.html';
  const storeHref = () => pageRoot() + 'store/index.html';
  const escapeText = (value) => String(value || '').replace(/[<>&"']/g, (char) => ({
    '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&#039;'
  }[char]));

  const headerStyles = `
    .krishi-app-header{position:sticky;top:0;z-index:100;min-height:64px;display:flex;align-items:center;justify-content:space-between;gap:16px;padding:10px 28px;background:#fff;border-bottom:1px solid #e4eee5;box-shadow:0 1px 5px rgba(11,122,58,.05);font-family:'Plus Jakarta Sans',system-ui,sans-serif}
    .krishi-app-header__brand,.krishi-app-header__right,.krishi-app-header__user{display:flex;align-items:center}.krishi-app-header__brand{gap:10px;color:#17311f;text-decoration:none;min-width:0}.krishi-app-header__logo{width:34px;height:34px;border-radius:10px;border:1px solid #d7e9d9;background:#f7fcf7;padding:3px;object-fit:contain}.krishi-app-header__brand-copy{display:grid;gap:1px}.krishi-app-header__brand-name{font-size:15px;font-weight:800;letter-spacing:-.2px;color:#0b7a3a}.krishi-app-header__page{font-size:11px;font-weight:650;color:#6a7b6d;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.krishi-app-header__right{gap:8px;flex-shrink:0}.krishi-app-header__language{display:flex;align-items:center;min-width:78px;padding:5px 8px;border:1px solid #e1ebe2;border-radius:8px;background:#fff}.krishi-app-header .krishi-lang-picker-wrap{margin:0!important;padding:0!important;border:0!important;background:transparent!important;width:100%}.krishi-app-header .krishi-lang-select{border:0!important;background:transparent!important;outline:0!important;width:100%;font:600 12px inherit;color:#49634f}.krishi-app-header__icon{width:34px;height:34px;border:1px solid #e1ebe2;border-radius:8px;background:#fff;color:#52715a;cursor:pointer;display:grid;place-items:center;transition:.18s}.krishi-app-header__icon:hover{background:#edf8ef;border-color:#cce4d1;color:#0b7a3a}.krishi-app-header__user{gap:8px;padding:4px 7px 4px 5px;border:1px solid #e1ebe2;border-radius:8px;background:#fbfefb}.krishi-app-header__avatar{width:26px;height:26px;border-radius:8px;display:grid;place-items:center;background:#e8f5ec;color:#0b7a3a;font-size:11px;font-weight:800}.krishi-app-header__name{font-size:12px;font-weight:700;color:#294233;max-width:125px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.krishi-app-header__menu{display:none}@media(max-width:720px){.krishi-app-header{padding:9px 14px}.krishi-app-header__page,.krishi-app-header__name{display:none}.krishi-app-header__menu{display:grid}.krishi-app-header__right{gap:5px}.krishi-app-header__language{min-width:62px}.krishi-app-header__brand-name{font-size:14px}}
    .krishi-notification-popover{position:fixed;right:20px;top:72px;z-index:200;max-width:290px;padding:12px 14px;border:1px solid #dceadd;border-radius:10px;background:#fff;color:#46604d;box-shadow:0 10px 26px rgba(21,53,28,.13);font:600 13px 'Plus Jakarta Sans',system-ui,sans-serif}
  `;

  function injectStyles() {
    if (!document.getElementById('krishi-shared-header-styles')) {
      const style = document.createElement('style');
      style.id = 'krishi-shared-header-styles';
      style.textContent = headerStyles;
      document.head.appendChild(style);
    }
  }

  function userName() {
    return localStorage.getItem('loggedInUser') || localStorage.getItem('username') || 'Farmer';
  }

  function setUser(name) {
    const safeName = escapeText(name || 'Farmer');
    const initials = safeName.trim().slice(0, 1).toUpperCase() || 'F';
    document.querySelectorAll('[data-krishi-user-name]').forEach((el) => el.textContent = safeName);
    document.querySelectorAll('[data-krishi-user-avatar]').forEach((el) => el.textContent = initials);
  }

  async function refreshProfile() {
    const token = localStorage.getItem('accessToken');
    if (!token || !window.getApiUrl) return;
    try {
      const response = await fetch(window.getApiUrl('/auth/me'), {
        headers: { Authorization: 'Bearer ' + token }
      });
      if (!response.ok) return;
      const profile = await response.json();
      setUser(profile.username || profile.name || userName());
    } catch (_) {
      // Retain the locally stored display name when offline.
    }
  }

  function showNotifications() {
    document.querySelector('.krishi-notification-popover')?.remove();
    const popover = document.createElement('div');
    popover.className = 'krishi-notification-popover';
    popover.setAttribute('role', 'status');
    popover.textContent = 'No new account alerts. Order updates appear in My Orders.';
    document.body.appendChild(popover);
    window.setTimeout(() => popover.remove(), 3800);
  }

  function mountHeader() {
    if (document.querySelector('.krishi-app-header')) return;
    const oldHeader = document.querySelector('header.minimal-topbar, header.main-header, header.store-header');
    if (!oldHeader) return;

    const isDashboard = oldHeader.classList.contains('minimal-topbar');
    const title = isDashboard ? 'Dashboard' : (document.querySelector('h1')?.textContent?.trim() || 'Krishi AI');
    const header = document.createElement('header');
    header.className = 'krishi-app-header';
    header.innerHTML = `
      <a class="krishi-app-header__brand" href="${dashboardHref()}" aria-label="Krishi AI dashboard">
        <img class="krishi-app-header__logo" src="${pageRoot()}statics/images/krishi-logo.svg" alt="" onerror="this.style.display='none'">
        <span class="krishi-app-header__brand-copy">
          <span class="krishi-app-header__brand-name" data-i18n="brandTitle">Krishi AI</span>
          <span class="krishi-app-header__page" id="topbarPageTitle">${escapeText(title)}</span>
        </span>
      </a>
      <div class="krishi-app-header__right">
        ${isDashboard ? '<button class="krishi-app-header__icon krishi-app-header__menu" type="button" aria-label="Open navigation" onclick="window.toggleSidebar && window.toggleSidebar()">☰</button>' : ''}
        <div class="krishi-app-header__language" id="dashboardTopLangSelector" aria-label="Language selector"></div>
        <button class="krishi-app-header__icon" type="button" aria-label="Notifications" title="Notifications">♧</button>
        <a class="krishi-app-header__icon" href="${storeHref()}" aria-label="Open AgriStore" title="Open AgriStore">⌂</a>
        <a class="krishi-app-header__user" href="${dashboardHref()}#view-profile" aria-label="Open profile">
          <span class="krishi-app-header__avatar" data-krishi-user-avatar>F</span>
          <span class="krishi-app-header__name" data-krishi-user-name>Farmer</span>
        </a>
      </div>`;
    oldHeader.replaceWith(header);
    header.querySelector('button[aria-label="Notifications"]').addEventListener('click', showNotifications);
    setUser(userName());
    refreshProfile();

    const renderLanguage = () => {
      if (window.krishiI18n?.renderSelector) window.krishiI18n.renderSelector('dashboardTopLangSelector', { compact: true });
    };
    renderLanguage();
    window.setTimeout(renderLanguage, 0);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => { injectStyles(); mountHeader(); });
  else { injectStyles(); mountHeader(); }
})();