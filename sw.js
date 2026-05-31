const CACHE_NAME = 'billsplit-pro-v5';
const URLS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icon.svg'
];

// ═══════════════════════════════════════════════════
//  INSTALL EVENT
// ═══════════════════════════════════════════════════
self.addEventListener('install', event => {
  console.log('[SW] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[SW] Caching files');
      // Add individual URLs and handle errors gracefully
      return Promise.allSettled(
        URLS_TO_CACHE.map(url => cache.add(url))
      ).then(() => {
        console.log('[SW] Cache completed (errors ignored)');
        return self.skipWaiting();
      }).catch(err => {
        console.log('[SW] Cache error (non-fatal):', err);
        return self.skipWaiting();
      });
    })
  );
});

// ═══════════════════════════════════════════════════
//  ACTIVATE EVENT
// ═══════════════════════════════════════════════════
self.addEventListener('activate', event => {
  console.log('[SW] Activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// ═══════════════════════════════════════════════════
//  FETCH EVENT
// ═══════════════════════════════════════════════════
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip chrome extensions and non-GET requests
  if (request.method !== 'GET' || url.protocol === 'chrome-extension:') {
    return;
  }

  // Handle navigation requests
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(response => {
          // Cache successful responses
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(request, clone).catch(() => {});
            });
          }
          return response;
        })
        .catch(() => {
          // Return cached version or index.html
          return caches.match(request)
            .then(cached => cached || caches.match('./index.html'))
            .catch(() => new Response('Offline', { status: 503 }));
        })
    );
    return;
  }

  // Handle all other requests - Network first, cache fallback
  event.respondWith(
    fetch(request)
      .then(response => {
        // Only cache successful responses
        if (response && response.status === 200 && response.type !== 'error') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(request, clone).catch(() => {});
          });
        }
        return response;
      })
      .catch(() => {
        // Try cache on network failure
        return caches.match(request)
          .then(cached => cached || new Response('Offline', { status: 503 }))
          .catch(() => new Response('Offline', { status: 503 }));
      })
  );
});