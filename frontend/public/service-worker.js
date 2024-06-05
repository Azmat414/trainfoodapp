const CACHE_NAME = 'trainfoodapp-cache-v1';
const urlsToCache = [
  '/',
  '/css/bootstrap.css',
  '/css/style.css',
  '/js/jquery-3.4.1.min.js',
  '/js/bootstrap.js',
  '/js/custom.js',
  // Add other assets you want to cache
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});
