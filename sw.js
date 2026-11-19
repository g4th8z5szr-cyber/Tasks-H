// שומר את קבצי האפליקציה בטלפון כדי שתעבוד בלי אינטרנט.
// לא שולח ולא מקבל שום נתון חיצוני.
const VERSION = 'tk-v29';
const FILES = ['./', 'index.html', 'style.css', 'app.js', 'manifest.webmanifest', 'icon-180.png', 'icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES.map(f => new Request(f, { cache: 'reload' })))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  // כל בקשה לכתובת חיצונית נחסמת
  if (url.origin !== self.location.origin || e.request.method !== 'GET') {
    e.respondWith(Response.error());
    return;
  }
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then(hit => hit ||
      fetch(e.request).then(res => {
        if (res.ok) { const copy = res.clone(); caches.open(VERSION).then(c => c.put(e.request, copy)); }
        return res;
      }).catch(() => caches.match('index.html')))
  );
});
