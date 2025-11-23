/* =============================================
   Tokyo Trip 2026 - Common JavaScript
   Navigator Menu + Go-to-Top + Shared Functions
   ============================================= */

// =============================================
// Initialize on DOM Ready
// =============================================
document.addEventListener('DOMContentLoaded', function () {
    try {
        initNavigator();
        initGoToTop();
        initLightbox();
        initServiceWorker();
    } catch (e) {
        console.error("Initialization failed:", e);
        // Fallback or error message if needed
    }
});

// =============================================
// Global Translations
// =============================================
const translations = {
    'th': { 'home': 'หน้าแรก', 'trip-plan': 'แผนการเดินทาง', 'summary-page': 'หน้าหลักสรุป', 'printable-cover': 'Cover Printable', 'shopping-list': 'Shopping List', 'language': 'ภาษา / Language', 'menuAria': 'เมนู', 'homeTitle': 'หน้าแรก' },
    'en': { 'home': 'Home', 'trip-plan': 'Itinerary', 'summary-page': 'Summary Page', 'printable-cover': 'Printable Cover', 'shopping-list': 'Shopping List', 'language': 'Language / 言語', 'menuAria': 'Menu', 'homeTitle': 'Home' },
    'jp': { 'home': 'ホーム', 'trip-plan': '旅行計画', 'summary-page': '概要ページ', 'printable-cover': '印刷用カバー', 'shopping-list': '買い物リスト', 'language': '言語 / Language', 'menuAria': 'メニュー', 'homeTitle': 'ホーム' }
};

function getCurrentLanguage() {
    // 1. Priority: HTML lang attribute
    const htmlLang = document.documentElement.lang;
    if (htmlLang === 'ja') return 'jp'; // Map 'ja' to 'jp' key
    if (translations[htmlLang]) return htmlLang;

    // 2. Fallback: URL path detection
    const path = window.location.pathname;
    // Handle both forward slashes and backslashes (Windows file paths)
    const normalizedPath = path.replace(/\\/g, '/');

    if (normalizedPath.includes('/en/')) return 'en';
    if (normalizedPath.includes('/jp/')) return 'jp';
    if (normalizedPath.includes('/th/')) return 'th';

    // 3. Fallback: Local Storage
    return localStorage.getItem('tokyo-trip-lang') || 'th';
}

// =============================================
// Navigator Menu (Top Right)
// =============================================
function initNavigator() {
    const currentLang = getCurrentLanguage();
    const t = translations[currentLang] || translations['th'];

    // Determine paths based on current location
    const path = window.location.pathname.replace(/\\/g, '/');
    // Check if we are in a language subfolder (en, jp, th)
    // We assume structure is root/index.html and root/lang/page.html
    const isInSubfolder = /\/(en|jp|th)\//.test(path);

    const homePath = isInSubfolder ? '../index.html' : 'index.html';
    // If we are in a subfolder, links to other pages in same lang are siblings
    // If we are at root, we need to go into the lang folder
    const pagePrefix = isInSubfolder ? '' : `${currentLang}/`;

    const navHTML = `
        <div id="navMenu">
            <button id="navMenuBtn" aria-label="${t.menuAria}">☰</button>
        </div>
        <div id="navOverlay"></div>
        <nav id="navMenuPanel">
            <div class="nav-header">🗾 Tokyo Trip 2026</div>
            <ul class="nav-links">
                <li><a href="${homePath}" data-page="index"><span class="nav-icon">🏠</span> ${t.home}</a></li>
                <li><a href="${pagePrefix}trip-plan.html" data-page="trip-plan"><span class="nav-icon">📅</span> ${t['trip-plan']}</a></li>
                <li><a href="${pagePrefix}cover-page.html" data-page="cover-page"><span class="nav-icon">📋</span> ${t['summary-page']}</a></li>
                <li><a href="${pagePrefix}cover.html" data-page="cover"><span class="nav-icon">🖨️</span> ${t['printable-cover']}</a></li>
                <li><a href="${pagePrefix}shopping-list.html" data-page="shopping-list"><span class="nav-icon">🛍️</span> ${t['shopping-list']}</a></li>
            </ul>
            <div class="nav-lang">
                <div class="nav-lang-title">${t.language}</div>
                <div class="nav-lang-btns">
                    <button class="nav-lang-btn" data-lang="th">🇹🇭 TH</button>
                    <button class="nav-lang-btn" data-lang="en">🇬🇧 EN</button>
                    <button class="nav-lang-btn" data-lang="jp">🇯🇵 JP</button>
                </div>
            </div>
        </nav>
    `;

    document.body.insertAdjacentHTML('beforeend', navHTML);

    document.getElementById('navMenuBtn').addEventListener('click', toggleMenu);
    document.getElementById('navOverlay').addEventListener('click', closeMenu);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });

    document.querySelectorAll('.nav-lang-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            switchLanguage(this.dataset.lang);
        });
    });

    highlightCurrentPage();
    const activeBtn = document.querySelector(`.nav-lang-btn[data-lang="${currentLang}"]`);
    if (activeBtn) activeBtn.classList.add('active');
}

function toggleMenu() {
    const menuBtn = document.getElementById('navMenuBtn');
    const menuPanel = document.getElementById('navMenuPanel');
    const overlay = document.getElementById('navOverlay');
    const isOpen = menuPanel.classList.contains('open');
    if (isOpen) {
        closeMenu();
    } else {
        menuPanel.classList.add('open');
        overlay.classList.add('show');
        menuBtn.classList.add('active');
        menuBtn.innerHTML = '✕';
    }
}

function closeMenu() {
    const menuBtn = document.getElementById('navMenuBtn');
    const menuPanel = document.getElementById('navMenuPanel');
    const overlay = document.getElementById('navOverlay');
    menuPanel.classList.remove('open');
    overlay.classList.remove('show');
    menuBtn.classList.remove('active');
    menuBtn.innerHTML = '☰';
}

function highlightCurrentPage() {
    const pageName = window.location.pathname.replace(/\\/g, '/').split('/').pop();
    document.querySelectorAll('.nav-links a').forEach(link => {
        const linkName = link.getAttribute('href').split('/').pop();
        if (linkName === pageName) {
            link.classList.add('active');
        }
    });
    if (pageName === 'index.html' || pageName === '') {
        document.querySelector('a[data-page="index"]')?.classList.add('active');
    }
}

function switchLanguage(targetLang) {
    localStorage.setItem('tokyo-trip-lang', targetLang);

    const path = window.location.pathname.replace(/\\/g, '/');
    const currentFilename = path.split('/').pop() || 'index.html';

    // Check if we are currently in a subfolder
    const isInSubfolder = /\/(en|jp|th)\//.test(path);

    if (isInSubfolder) {
        // We are in .../lang/page.html
        // We want to go to .../targetLang/page.html
        // So we go up one level (../) and then into targetLang
        window.location.href = `../${targetLang}/${currentFilename}`;
    } else {
        // We are at root (index.html likely)
        // We want to go to targetLang/trip-plan.html (default landing for lang switch from home)
        // Or if we map index to a specific page? 
        // Usually index is just index. Let's assume if we switch lang from index, we go to trip-plan or stay on index if index is localized?
        // The current project seems to have index.html only at root.
        // If user switches lang at root, maybe redirect to trip-plan in that lang?
        window.location.href = `${targetLang}/trip-plan.html`;
    }
}

// =============================================
// Go-to-Top Button (Bottom Left)
// =============================================
function initGoToTop() {
    const btn = document.createElement('button');
    btn.id = 'goToTop';
    btn.innerHTML = '↑';
    btn.setAttribute('aria-label', 'Go to top');
    document.body.appendChild(btn);
    window.addEventListener('scroll', () => {
        btn.classList.toggle('show', window.scrollY > 300);
    });
    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    initHomeButton();
}

// =============================================
// Home Button (Bottom Right)
// =============================================
function initHomeButton() {
    const path = window.location.pathname.replace(/\\/g, '/');
    const isInSubfolder = /\/(en|jp|th)\//.test(path);
    const basePath = isInSubfolder ? '../' : '';
    const currentLang = getCurrentLanguage();

    const btn = document.createElement('a');
    btn.id = 'homeBtn';
    btn.href = basePath + 'index.html';
    btn.innerHTML = '🏠';
    btn.setAttribute('aria-label', 'Go to home');
    btn.title = translations[currentLang] ? translations[currentLang].homeTitle : 'Home';
    document.body.appendChild(btn);
}

// =============================================
// Image Lightbox / Popup
// =============================================
function initLightbox() {
    const lightbox = document.createElement('div');
    lightbox.id = 'lightbox';
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `<button class="lightbox-close" aria-label="Close">✕</button><img src="" alt="Full size image">`;
    document.body.appendChild(lightbox);

    const lightboxImg = lightbox.querySelector('img');
    const closeBtn = lightbox.querySelector('.lightbox-close');

    document.querySelectorAll('img:not(.no-lightbox):not([src*="icon"]):not([src*="logo"])').forEach(img => {
        if (img.naturalWidth < 100 && img.naturalHeight < 100 && img.clientWidth < 100) return;
        img.classList.add('clickable-img');
        img.addEventListener('click', function (e) {
            e.preventDefault();
            lightboxImg.src = this.src;
            lightboxImg.alt = this.alt || 'Image';
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        lightboxImg.src = '';
    };

    lightbox.addEventListener('click', e => {
        if (e.target === lightbox || e.target === closeBtn) closeLightbox();
    });
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) closeLightbox();
    });
}

// =============================================
// Service Worker Registration
// =============================================
function initServiceWorker() {
    if ('serviceWorker' in navigator) {
        const isGithubPages = window.location.hostname.includes('github.io');
        const repoName = 'tokyo-trip-2026-pages';
        const scope = isGithubPages ? `/${repoName}/` : '/';
        navigator.serviceWorker.register(`${scope}sw.js`, { scope: scope })
            .then(reg => console.log('SW registered:', reg.scope))
            .catch(err => console.log('SW registration failed:', err));
    }
}

// =============================================
// Utility Functions
// =============================================
function copyText(text) {
    const message = {
        'th': 'คัดลอกแล้ว',
        'en': 'Copied',
        'jp': 'コピーしました'
    };
    const currentLang = getCurrentLanguage();
    navigator.clipboard.writeText(text).then(() => {
        showToast(`📋 ${message[currentLang]}: ${text}`);
    }).catch(err => {
        console.error('Copy failed', err);
    });
}

function showToast(message) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed; bottom: 80px; left: 50%; transform: translateX(-50%);
        background: #1e293b; color: white; padding: 0.75rem 1.5rem; border-radius: 8px;
        font-size: 0.9rem; z-index: 9999; animation: fadeInOut 2s ease;`;
    document.body.appendChild(toast);

    setTimeout(() => toast.remove(), 2000);
}

// Add toast animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInOut {
        0% { opacity: 0; transform: translate(-50%, 20px); }
        15% { opacity: 1; transform: translate(-50%, 0); }
        85% { opacity: 1; transform: translate(-50%, 0); }
        100% { opacity: 0; transform: translate(-50%, -20px); }
    }`;
document.head.appendChild(style);
