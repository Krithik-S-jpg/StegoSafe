// Service Worker for StegoSafe PWA
const CACHE_NAME = 'stegosafe-v1';
const urlsToCache = [
  '/stegosafe/',
  '/stegosafe/index.html',
  '/stegosafe/encode.html',
  '/stegosafe/decode.html',
  '/stegosafe/css/style.css',
  '/stegosafe/js/encode.js',
  '/stegosafe/js/decode.js',
  '/stegosafe/js/crypto.js',
  '/stegosafe/pwa/manifest.json',
  '/stegosafe/assets/icons/icon-192.png',
  '/stegosafe/assets/icons/icon-512.png'
];

// Install event - cache all static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Caching app shell');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - network first, fall back to cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache successful responses
        if (response && response.status === 200) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        // Fallback to cache when offline
        return caches.match(event.request)
          .then((response) => {
            return response || new Response(
              'Offline - Content not available',
              { status: 503, statusText: 'Service Unavailable' }
            );
          });
      })
  );
});
