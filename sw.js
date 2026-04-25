const CACHE_NAME = 'higuito-puntos-v1';
const urlsToCache = [
  '/higuito-puntos/',
  '/higuito-puntos/index.html',
  '/higuito-puntos/manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
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
