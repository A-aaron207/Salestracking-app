// Service Worker for Cosmetic Zone Manager PRO
const BASE_PATH = '/Salestracking-app';
const CACHE_NAME = 'cosmetic-zone-v1';
const STATIC_ASSETS = [
    BASE_PATH + '/',
    BASE_PATH + '/index.html',
    BASE_PATH + '/styles.css',
    BASE_PATH + '/db.js',
    BASE_PATH + '/app.js',
    BASE_PATH + '/manifest.json',
    BASE_PATH + '/icon.png'
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
    const url = new URL(request.url);
    
    // Only handle GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    // Skip external requests and chrome extensions
    if (!url.pathname.startsWith(BASE_PATH)) {
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
                        
                        // Return index.html for navigation requests that fail
                        if (request.mode === 'navigate') {
                            return caches.match(BASE_PATH + '/index.html');
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
