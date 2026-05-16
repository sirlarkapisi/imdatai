// IMDATAI Service Worker v2 — Yeni cache, eski siliniyor
const CACHE = 'imdatai-v2'; // v1'den v2'ye — otomatik temizler
const OFFLINE_URLS = ['/', '/index.html', '/logo.png'];

self.addEventListener('install', e => {
  self.skipWaiting(); // Hemen aktif ol
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(OFFLINE_URLS).catch(()=>{}))
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => {
        console.log('Eski cache siliniyor:', k);
        return caches.delete(k);
      }))
    ).then(() => self.clients.claim())
  );
});

// Network first - cache sadece fallback
self.addEventListener('fetch', e => {
  // API ve RSS isteklerini cache'leme
  if (e.request.url.includes('rss') ||
      e.request.url.includes('google.com/rss') ||
      e.request.url.includes('corsproxy') ||
      e.request.url.includes('allorigins') ||
      e.request.url.includes('api.') ||
      e.request.method !== 'GET') return;

  e.respondWith(
    fetch(e.request)
      .then(res => {
        if (res.ok) {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      })
      .catch(() => caches.match(e.request).then(r => r || caches.match('/index.html')))
  );
});

self.addEventListener('push', e => {
  const data = e.data?.json() || {};
  e.waitUntil(
    self.registration.showNotification(data.title || 'IMDATAI', {
      body: data.body || 'Yeni AI içeriği mevcut!',
      icon: '/logo.png',
      badge: '/logo.png',
      data: { url: data.url || '/' }
    })
  );
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.openWindow(e.notification.data?.url || '/'));
});
