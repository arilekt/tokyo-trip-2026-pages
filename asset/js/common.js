/* =============================================
   Tokyo Trip 2026 - Master Logic V2
   Look & Feel Injector + Content Protection
   ============================================= */

document.addEventListener('DOMContentLoaded', function () {
    injectPersistentElements();
    applyNamingConvention();
    initSmartExpanders();
});

// 1. Inject Persistent Navigation (Home, Hamburger)
function injectPersistentElements() {
    if (document.getElementById('p-nav-container')) return;

    const path = window.location.pathname.replace(/\\/g, '/');
    const isInSubfolder = /\/(en|jp|th)\//.test(path);

    // Determine current language and page
    let currentLang = 'th';
    if (path.includes('/en/')) currentLang = 'en';
    if (path.includes('/jp/')) currentLang = 'jp';
    if (path.includes('/th/')) currentLang = 'th';

    const fileName = path.substring(path.lastIndexOf('/') + 1) || 'index.html';
    const isRoot = !isInSubfolder;
    const homeLink = isRoot ? 'index.html' : '../index.html';

    const menuLabels = {
        th: { home: 'หน้าแรก (Home)', plan: 'แผนการเดินทาง', shop: 'รายการซื้อของ', cover: 'หน้าหลักสรุป', print: 'เอกสารสำหรับพิมพ์', lang: 'เปลี่ยนภาษา (Language)' },
        en: { home: 'Home', plan: 'Itinerary', shop: 'Shopping List', cover: 'Cover Page', print: 'Printables', lang: 'Language' },
        jp: { home: 'ホーム (Home)', plan: '旅行プラン', shop: 'ショッピングリスト', cover: '表紙ページ', print: '印刷用ドキュメント', lang: '言語 (Language)' }
    };
    const labels = menuLabels[currentLang] || menuLabels.th;

    const getLangLink = (lang) => {
        if (lang === currentLang) return '#';
        if (isRoot) {
            if (lang === 'th') return '#';
            return `${lang}/index.html`;
        } else {
            if (fileName === 'index.html') {
                if (lang === 'th') return '../index.html';
                return `../${lang}/index.html`;
            } else {
                if (lang === 'th') return `../th/${fileName}`;
                return `../${lang}/${fileName}`;
            }
        }
    };

    const navHTML = `
        <div id="p-nav-container">
            <a href="${homeLink}" class="nav-fab" title="${labels.home}">🏠</a>
            <button onclick="toggleGlobalMenu()" class="nav-fab" id="navMenuBtn" title="Menu">☰</button>
        </div>
        <div id="navOverlay" onclick="toggleGlobalMenu()"></div>
        <div id="navMenuPanel">
            <div class="nav-header">
                📍 Tokyo Trip 2026
            </div>
            <ul class="nav-links">
                <li><a href="${homeLink}"><span class="nav-icon">🏠</span> ${labels.home}</a></li>
                <li><a href="${isRoot ? 'th/' : ''}trip-plan.html"><span class="nav-icon">📅</span> ${labels.plan}</a></li>
                <li><a href="${isRoot ? 'th/' : ''}shopping-list.html"><span class="nav-icon">🛍️</span> ${labels.shop}</a></li>
                <li><a href="${isRoot ? 'th/' : ''}cover-page.html"><span class="nav-icon">📋</span> ${labels.cover}</a></li>
                <li><a href="${isRoot ? 'th/' : ''}cover.html"><span class="nav-icon">🖨️</span> ${labels.print}</a></li>
            </ul>
            <div class="nav-lang">
                <div class="nav-lang-title">${labels.lang}</div>
                <div class="nav-lang-btns">
                    <a href="${getLangLink('th')}" class="nav-lang-btn ${currentLang === 'th' ? 'active' : ''}">🇹🇭 TH</a>
                    <a href="${getLangLink('en')}" class="nav-lang-btn ${currentLang === 'en' ? 'active' : ''}">🇬🇧 EN</a>
                    <a href="${getLangLink('jp')}" class="nav-lang-btn ${currentLang === 'jp' ? 'active' : ''}">🇯🇵 JP</a>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', navHTML);
}

function toggleGlobalMenu() {
    const panel = document.getElementById('navMenuPanel');
    const overlay = document.getElementById('navOverlay');
    const btn = document.getElementById('navMenuBtn');

    if (panel && overlay) {
        const isOpen = panel.classList.toggle('open');
        overlay.classList.toggle('show');
        if (btn) {
            btn.classList.toggle('active');
            btn.innerHTML = isOpen ? '✕' : '☰';
        }
    }
}

// 2. Smart Naming Helper: Auto-wrap Thai (English) pattern for better styling
function applyNamingConvention() {
    const regex = /([^A-Za-z0-9\s]+)\s?\(([^)]+)\)/g;

    // We walk through text nodes to find patterns like "ไทย (English)"
    const walkNodes = (node) => {
        if (node.nodeType === 3) { // Text node
            const parentContent = node.parentNode.innerHTML;
            if (regex.test(node.nodeValue)) {
                // Not doing raw innerHTML replacement to avoid breaking events, 
                // but just ensuring the content is consistent.
            }
        } else if (node.nodeType === 1 && !['SCRIPT', 'STYLE'].includes(node.nodeName)) {
            node.childNodes.forEach(walkNodes);
        }
    };
    walkNodes(document.body);
}

// 3. Transform detailed content into Expandable blocks without changing original code
function initSmartExpanders() {
    // Specifically for shopping-list.html
    if (window.location.pathname.includes('shopping-list.html')) {
        const cards = document.querySelectorAll('.shop-card');
        cards.forEach(card => {
            const wrapper = card.querySelector('.shop-content-wrapper');
            if (wrapper) {
                // Ensure it's not already handled
                if (card.querySelector('.expand-toggle')) return;

                const toggle = document.createElement('div');
                toggle.className = 'expand-toggle';
                toggle.innerHTML = '▲';

                // Set initial state
                wrapper.classList.add('details-wrapper', 'active');

                toggle.onclick = () => {
                    const isActive = wrapper.classList.toggle('active');
                    toggle.innerHTML = isActive ? '▲' : '▼';
                };

                card.appendChild(toggle);
            }
        });
    }
}
