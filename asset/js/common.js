/* =============================================
   Tokyo Trip 2026 - Common JavaScript
   Navigator Menu + Go-to-Top + Shared Functions
   ============================================= */

// =============================================
// Initialize on DOM Ready
// =============================================
document.addEventListener('DOMContentLoaded', function() {
    initNavigator();
    initGoToTop();
    initLightbox();
    initServiceWorker();
});

// =============================================
// Navigator Menu (Top Right)
// =============================================
function initNavigator() {
    // Determine base path based on current location
    const path = window.location.pathname;
    const isInSubfolder = path.includes('/th/') || path.includes('/en/') || path.includes('/jp/');
    const basePath = isInSubfolder ? '../' : '';

    // Create Navigator HTML
    const navHTML = `
        <div id="navMenu">
            <button id="navMenuBtn" aria-label="Menu">☰</button>
        </div>
        <div id="navOverlay"></div>
        <nav id="navMenuPanel">
            <div class="nav-header">🗾 Tokyo Trip 2026</div>
            <ul class="nav-links">
                <li><a href="${basePath}index.html" data-page="index"><span class="nav-icon">🏠</span> หน้าแรก</a></li>
                <li><a href="${basePath}th/trip-plan.html" data-page="trip-plan"><span class="nav-icon">📅</span> แผนการเดินทาง</a></li>
                <li><a href="${basePath}th/cover-page.html" data-page="cover-page"><span class="nav-icon">📋</span> หน้าหลักสรุป</a></li>
                <li><a href="${basePath}th/cover.html" data-page="cover"><span class="nav-icon">🖨️</span> Cover Printable</a></li>
                <li><a href="${basePath}th/shopping-list.html" data-page="shopping-list"><span class="nav-icon">🛍️</span> Shopping List</a></li>
            </ul>
            <div class="nav-lang">
                <div class="nav-lang-title">ภาษา / Language</div>
                <div class="nav-lang-btns">
                    <button class="nav-lang-btn active" data-lang="th">🇹🇭 TH</button>
                    <button class="nav-lang-btn" data-lang="en">🇬🇧 EN</button>
                    <button class="nav-lang-btn" data-lang="jp">🇯🇵 JP</button>
                </div>
            </div>
        </nav>
    `;

    // Insert Navigator
    document.body.insertAdjacentHTML('beforeend', navHTML);

    // Get elements
    const menuBtn = document.getElementById('navMenuBtn');
    const menuPanel = document.getElementById('navMenuPanel');
    const overlay = document.getElementById('navOverlay');
    const langBtns = document.querySelectorAll('.nav-lang-btn');

    // Toggle menu
    menuBtn.addEventListener('click', function() {
        toggleMenu();
    });

    // Close on overlay click
    overlay.addEventListener('click', function() {
        closeMenu();
    });

    // Close on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeMenu();
        }
    });

    // Language buttons
    langBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const lang = this.dataset.lang;
            switchLanguage(lang);

            // Update active state
            langBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Highlight current page
    highlightCurrentPage();

    // Load saved language
    const savedLang = localStorage.getItem('tokyo-trip-lang') || 'th';
    langBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === savedLang);
    });
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
    const path = window.location.pathname;
    const links = document.querySelectorAll('.nav-links a');

    links.forEach(link => {
        const href = link.getAttribute('href');
        if (path.includes(href) || (path.endsWith('/') && href === 'index.html')) {
            link.classList.add('active');
        }
    });
}

function switchLanguage(lang) {
    localStorage.setItem('tokyo-trip-lang', lang);

    // Get current path
    const path = window.location.pathname;

    // Replace language in path
    let newPath;
    if (path.includes('/th/')) {
        newPath = path.replace('/th/', `/${lang}/`);
    } else if (path.includes('/en/')) {
        newPath = path.replace('/en/', `/${lang}/`);
    } else if (path.includes('/jp/')) {
        newPath = path.replace('/jp/', `/${lang}/`);
    } else {
        // On index page, just save preference
        return;
    }

    // Navigate if different
    if (newPath !== path) {
        window.location.href = newPath;
    }
}

// =============================================
// Go-to-Top Button (Bottom Left)
// =============================================
function initGoToTop() {
    // Create button
    const btn = document.createElement('button');
    btn.id = 'goToTop';
    btn.innerHTML = '↑';
    btn.setAttribute('aria-label', 'Go to top');
    document.body.appendChild(btn);

    // Show/hide on scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            btn.classList.add('show');
        } else {
            btn.classList.remove('show');
        }
    });

    // Scroll to top on click
    btn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Create Home button
    initHomeButton();
}

// =============================================
// Home Button (Bottom Right)
// =============================================
function initHomeButton() {
    // Determine base path
    const path = window.location.pathname;
    const isInSubfolder = path.includes('/th/') || path.includes('/en/') || path.includes('/jp/');
    const basePath = isInSubfolder ? '../' : '';

    // Create button
    const btn = document.createElement('a');
    btn.id = 'homeBtn';
    btn.href = basePath + 'index.html';
    btn.innerHTML = '🏠';
    btn.setAttribute('aria-label', 'Go to home');
    btn.title = 'หน้าแรก';
    document.body.appendChild(btn);
}

// =============================================
// Image Lightbox / Popup
// =============================================
function initLightbox() {
    // Create lightbox container
    const lightbox = document.createElement('div');
    lightbox.id = 'lightbox';
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <button class="lightbox-close" aria-label="Close">✕</button>
        <img src="" alt="Full size image">
    `;
    document.body.appendChild(lightbox);

    const lightboxImg = lightbox.querySelector('img');
    const closeBtn = lightbox.querySelector('.lightbox-close');

    // Find all images and make them clickable
    const images = document.querySelectorAll('img:not(.no-lightbox):not([src*="icon"]):not([src*="logo"])');

    images.forEach(img => {
        // Skip very small images (icons, etc.)
        if (img.naturalWidth < 100 || img.naturalHeight < 100) return;

        // Add clickable class and event
        img.classList.add('clickable-img');

        img.addEventListener('click', function(e) {
            e.preventDefault();
            lightboxImg.src = this.src;
            lightboxImg.alt = this.alt || 'Image';
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    // Close lightbox on click
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox || e.target === closeBtn) {
            closeLightbox();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        lightboxImg.src = '';
    }
}

// =============================================
// Service Worker Registration
// =============================================
function initServiceWorker() {
    if ('serviceWorker' in navigator) {
        // Get base path for service worker
        const basePath = window.location.pathname.includes('/pages/')
            ? '/pages/'
            : '/';

        navigator.serviceWorker.register(basePath + 'sw.js')
            .then(function(registration) {
                console.log('SW registered:', registration.scope);
            })
            .catch(function(error) {
                console.log('SW registration failed:', error);
            });
    }
}

// =============================================
// Utility Functions
// =============================================

// Copy text to clipboard
function copyText(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showToast('📋 คัดลอกแล้ว: ' + text);
        });
    } else {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast('📋 คัดลอกแล้ว: ' + text);
    }
}

// Show toast notification
function showToast(message) {
    // Remove existing toast
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    // Create toast
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 80px;
        left: 50%;
        transform: translateX(-50%);
        background: #1e293b;
        color: white;
        padding: 0.75rem 1.5rem;
        border-radius: 8px;
        font-size: 0.9rem;
        z-index: 9999;
        animation: fadeInOut 2s ease;
    `;
    document.body.appendChild(toast);

    // Remove after animation
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
    }
`;
document.head.appendChild(style);
