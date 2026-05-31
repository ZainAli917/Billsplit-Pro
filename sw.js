const CACHE_NAME = 'billsplit-pro-v4';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon.svg',
  './icon-192.png',
  './icon-512.png',
  './feature-graphic.svg',
  './screenshot-narrow.svg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      caches.match('./index.html').then(cached => {
        return cached || fetch(event.request).catch(() => cached);
      })
    );
  } else {
    event.respondWith(
      caches.match(event.request).then(cached => {
        return cached || fetch(event.request).catch(() => new Response('Offline', {status:503}));
      })
    );
  }
});