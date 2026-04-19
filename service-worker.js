// Service Worker for Cosmetic Zone Manager PRO
const CACHE_NAME = 'cosmetic-zone-v1';
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/styles.css',
    '/db.js',
    '/app.js',
    '/manifest.json'
];

// Install Service Worker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(STATIC_ASSETS).catch(err => {
                    // Some assets might fail, but we'll serve from network first
                    console.log('Cache installation partial:', err);
                });
            })
            .then(() => self.skipWaiting())
    );
});

// Activate Service Worker
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames
                    .filter(cacheName => cacheName !== CACHE_NAME)
                    .map(cacheName => caches.delete(cacheName))
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch Event - Network First, Cache Fallback
self.addEventListener('fetch', event => {
    const { request } = event;
    
    // Only handle GET requests
    if (request.method !== 'GET') {
        return;
    }

    event.respondWith(
        fetch(request)
            .then(response => {
                // Cache the response if it's successful
                if (response && response.status === 200) {
                    const responseToCache = response.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(request, responseToCache);
                    });
                }
                return response;
            })
            .catch(() => {
                // Fall back to cache if network fails
                return caches.match(request)
                    .then(response => {
                        if (response) {
                            return response;
                        }
                        
                        // Return a fallback response for failed requests
                        return new Response(
                            JSON.stringify({ error: 'Offline - No cached response' }),
                            { 
                                status: 503,
                                statusText: 'Service Unavailable',
                                headers: new Headers({
                                    'Content-Type': 'application/json'
                                })
                            }
                        );
                    });
            })
    );
});

// Background Sync (future feature)
self.addEventListener('sync', event => {
    if (event.tag === 'sync-data') {
        event.waitUntil(
            // This could be used for syncing data when back online
            Promise.resolve()
        );
    }
});

// Periodic Background Sync (future feature)
self.addEventListener('periodicsync', event => {
    if (event.tag === 'update-data') {
        event.waitUntil(
            // This could be used for periodic updates
            Promise.resolve()
        );
    }
});

// Message Handler for cache control
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
