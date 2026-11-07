/* Cache version is deliberately changed whenever the app is updated. */
const CACHE = 'anki-quest-eng-v6-20261107';
const PRECACHE = ['./index.html','./manifest.webmanifest'];
self.addEventListener('install', event => event.waitUntil(
  caches.open(CACHE).then(cache => cache.addAll(PRECACHE)).then(() => self.skipWaiting())
));
self.addEventListener('activate', event => event.waitUntil(
  caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith('anki-quest-') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())
));
self.addEventListener('fetch', event => {
  if(event.request.method!=='GET' || new URL(event.request.url).origin !== self.location.origin) return;
  if(event.request.mode==='navigate' || new URL(event.request.url).pathname.endsWith('/index.html')) {
    event.respondWith(fetch(event.request).then(response => {const copy=response.clone();caches.open(CACHE).then(cache=>cache.put('./index.html',copy));return response}).catch(()=>caches.match('./index.html')));
    return;
  }
  event.respondWith(caches.match(event.request).then(cache=>cache||fetch(event.request)));
});
