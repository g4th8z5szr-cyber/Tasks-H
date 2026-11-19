// שומר את קבצי האפליקציה בטלפון כדי שתעבוד בלי אינטרנט.
// לא שולח ולא מקבל שום נתון חיצוני.
const VERSION = 'tk-v41';
const FILES = ['./', 'index.html', 'style.css', 'app.js', 'manifest.webmanifest', 'icon2-180.png', 'icon2-512.png'];

self.addEventListener('install', e => {
  // כל קובץ נשמר בנפרד – קובץ אחד חסר לא יעצור את העדכון
  e.waitUntil(caches.open(VERSION)
    .then(c => Promise.all(FILES.map(f => c.add(new Request(f, { cache: 'reload' })).catch(() => {}))))
    .then(() => self.skipWaiting()));
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
