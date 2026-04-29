const CACHE_NAME = 'higuito-puntos-v3';
const urlsToCache = [
  '/higuito-puntos/',
  '/higuito-puntos/index.html',
  '/higuito-puntos/manifest.json'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});

self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'Centro Deportivo Higuito';
  const options = {
    body: data.body || 'Tenés un mensaje nuevo',
    icon: '/higuito-puntos/icon-192.png',
    badge: '/higuito-puntos/icon-192.png',
    data: data.url || '/higuito-puntos/'
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data));
});
