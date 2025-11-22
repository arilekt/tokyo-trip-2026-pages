/* =============================================
   Tokyo Trip 2026 - Service Worker
   Offline Cache Support
   ============================================= */

const CACHE_NAME = 'tokyo-trip-2026-v1';
const CACHE_URLS = [
    './',
    './index.html',
    './manifest.json',
    './asset/css/common.css',
    './asset/css/trip-clean.css',
    './asset/css/cover.css',
    './asset/css/guidebook.css',
    './asset/js/common.js',
    './asset/js/trip.js',
    './th/trip-plan.html',
    './th/cover.html',
    './th/shopping.html'
];

// Install event - cache files
self.addEventListener('install', event => {
    console.log('[SW] Installing...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('[SW] Caching files...');
                return cache.addAll(CACHE_URLS);
            })
            .then(() => {
                console.log('[SW] Installed successfully');
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('[SW] Install failed:', error);
            })
    );
});

// Activate event - clean old caches
self.addEventListener('activate', event => {
    console.log('[SW] Activating...');
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames
                        .filter(cacheName => cacheName !== CACHE_NAME)
                        .map(cacheName => {
                            console.log('[SW] Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        })
                );
            })
            .then(() => {
                console.log('[SW] Activated successfully');
                return self.clients.claim();
            })
    );
});

// Fetch event - cache-first strategy
self.addEventListener('fetch', event => {
    const requestUrl = new URL(event.request.url);

    // Don't handle .ics files; let the browser/OS handle it.
    if (requestUrl.pathname.endsWith('.ics')) {
      return;
    }

    // Let the browser handle cross-origin requests
    const requestUrl = new URL(event.request.url);
    if (requestUrl.origin !== self.location.origin) {
        return;
    }

    // Only handle GET requests
    if (event.request.method !== 'GET') {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then(cachedResponse => {
                if (cachedResponse) {
                    // Return cached response
                    console.log('[SW] Cache hit:', event.request.url);
                    return cachedResponse;
                }

                // Not in cache, fetch from network
                console.log('[SW] Fetching:', event.request.url);
                return fetch(event.request)
                    .then(networkResponse => {
                        // Check if valid response
                        if (!networkResponse || networkResponse.status !== 200) {
                            return networkResponse;
                        }

                        // Clone response for caching
                        const responseToCache = networkResponse.clone();

                        // Add to cache for future use
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });

                        return networkResponse;
                    })
                    .catch(error => {
                        console.error('[SW] Fetch failed:', error);

                        // Return offline fallback if available
                        if (event.request.mode === 'navigate') {
                            return caches.match('./index.html');
                        }

                        return new Response('Offline', {
                            status: 503,
                            statusText: 'Service Unavailable'
                        });
                    });
            })
    );
});

// Message event - handle updates
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
