const CACHE_NAME = 'it-support-quiz-v2';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './1758823260347.jpg'
];

// Install Event - Force immediate activation
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting()) // Forces the waiting service worker to become active
  );
});

// Activate Event - Clean up old caches
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim()) // Forces open pages to use this service worker immediately
  );
});

// Fetch Event - Network first fallback to cache for easier debugging
self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request).catch(() => {
      return caches.match(e.request);
    })
  );
});
