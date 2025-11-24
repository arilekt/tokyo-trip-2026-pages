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
        initFloatingConverter();
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
                <li><a href="${pagePrefix}cover-page.html" data-page="cover-page"><span class="nav-icon">📋</span> ${t['summary-page']}</a></li>
                <li><a href="${pagePrefix}shopping-list.html" data-page="shopping-list"><span class="nav-icon">🛍️</span> ${t['shopping-list']}</a></li>
                <li><a href="${pagePrefix}trip-plan.html" data-page="trip-plan"><span class="nav-icon">📅</span> ${t['trip-plan']}</a></li>
                <li><a href="${pagePrefix}cover.html" data-page="cover"><span class="nav-icon">🖨️</span> ${t['printable-cover']}</a></li>
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
// =============================================
// Floating Currency Converter
// =============================================
window.exchangeRate1 = 0.21; // 1 JPY = 0.21 THB (Default)

function initFloatingConverter() {
    // Inject CSS
    const css = `
        #floatingConverter {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            padding: 10px 15px;
            border-radius: 50px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            display: flex;
            align-items: center;
            gap: 10px;
            z-index: 9998;
            font-family: 'Segoe UI', sans-serif;
            border: 1px solid rgba(0,0,0,0.1);
            transition: all 0.3s ease;
        }
        #floatingConverter:hover {
            box-shadow: 0 6px 20px rgba(0,0,0,0.25);
            transform: translateX(-50%) translateY(-2px);
        }
        .fc-group {
            display: flex;
            align-items: center;
            gap: 5px;
        }
        .fc-label {
            font-size: 0.85rem;
            font-weight: 700;
            color: #64748b;
        }
        .fc-input {
            width: 100px; /* Wider for both */
            padding: 5px 8px;
            border: 1px solid #cbd5e1;
            border-radius: 20px;
            font-size: 0.9rem;
            text-align: center;
            outline: none;
            transition: border-color 0.2s;
            background: #f8fafc;
        }
        .fc-input:focus {
            border-color: #3b82f6;
            background: #fff;
        }
        .fc-clear {
            background: #fee2e2;
            color: #ef4444;
            border: none;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: 0.8rem;
            transition: all 0.2s;
            margin-left: 5px;
        }
        .fc-clear:hover {
            background: #fecaca;
            transform: scale(1.1);
        }
        @media (max-width: 480px) {
            #floatingConverter {
                bottom: 15px;
                padding: 8px 12px;
                width: 90%;
                justify-content: center;
            }
            .fc-input {
                width: 80px;
            }
        }
    `;
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    // Inject HTML
    const html = `
        <div class="fc-group">
            <span class="fc-label">¥</span>
            <input type="text" id="fc-jpy" class="fc-input" placeholder="0" inputmode="decimal">
        </div>
        <div class="fc-group">
            <span class="fc-label">฿</span>
            <input type="text" id="fc-thb" class="fc-input" placeholder="0" inputmode="decimal">
        </div>
        <button id="fc-clear" class="fc-clear" title="Clear">✕</button>
    `;
    const container = document.createElement('div');
    container.id = 'floatingConverter';
    container.innerHTML = html;
    document.body.appendChild(container);

    // Logic
    const jpyInput = document.getElementById('fc-jpy');
    const thbInput = document.getElementById('fc-thb');
    const clearBtn = document.getElementById('fc-clear');

    // Helper: Format number with commas
    function formatNumber(num, decimals = 2) {
        if (!num && num !== 0) return '';
        const parts = num.toFixed(decimals).split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        // Remove trailing zeros after decimal if needed, or keep fixed decimals?
        // User asked for #,###.## which usually implies optional decimals or fixed?
        // Let's stick to standard behavior: remove trailing zeros if they are just 0
        if (parts[1]) {
            parts[1] = parts[1].replace(/0+$/, '');
            if (parts[1] === '') return parts[0];
        }
        return parts.join('.');
    }

    // Helper: Parse formatted number
    function parseNumber(str) {
        if (!str) return 0;
        return parseFloat(str.replace(/,/g, '')) || 0;
    }

    function updateFromJpy() {
        const jpyVal = parseNumber(jpyInput.value);
        if (jpyVal) {
            const thb = jpyVal * window.exchangeRate1;
            thbInput.value = formatNumber(thb, 2);
        } else {
            thbInput.value = '';
        }
    }

    function updateFromThb() {
        const thbVal = parseNumber(thbInput.value);
        if (thbVal) {
            const jpy = thbVal / window.exchangeRate1;
            jpyInput.value = formatNumber(jpy, 0); // JPY usually no decimals
        } else {
            jpyInput.value = '';
        }
    }

    // Input event: just calculate, don't force format while typing (it messes up cursor)
    // But we need to handle commas in input for calculation
    jpyInput.addEventListener('input', () => {
        // Allow typing, but calculation needs parsed value
        updateFromJpy();
    });

    thbInput.addEventListener('input', () => {
        updateFromThb();
    });

    // Blur event: format the input field itself
    jpyInput.addEventListener('blur', () => {
        const val = parseNumber(jpyInput.value);
        if (val) jpyInput.value = formatNumber(val, 0);
    });

    thbInput.addEventListener('blur', () => {
        const val = parseNumber(thbInput.value);
        if (val) thbInput.value = formatNumber(val, 2);
    });

    // Focus event: optionally unformat? Or just let user edit with commas?
    // Let's unformat on focus for easier editing
    jpyInput.addEventListener('focus', () => {
        const val = parseNumber(jpyInput.value);
        if (val) jpyInput.value = val;
    });

    thbInput.addEventListener('focus', () => {
        const val = parseNumber(thbInput.value);
        if (val) thbInput.value = val;
    });

    clearBtn.addEventListener('click', () => {
        jpyInput.value = '';
        thbInput.value = '';
        jpyInput.focus();
    });
}
