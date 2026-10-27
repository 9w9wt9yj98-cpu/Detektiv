// Service worker: cachar spelets filer så att det fungerar offline och kan läggas på hemskärmen.
const VERSION = 'detektiv-v5';
const FILER = [
  './',
  './index.html',
  './manifest.webmanifest',
  './css/stil.css',
  './js/main.js',
  './js/mekaniker/bildjamforelse.js',
  './js/mekaniker/index.js',
  './js/mekaniker/jamfor.js',
  './js/mekaniker/logikrutnat.js',
  './js/mekaniker/tidslinje.js',
  './js/motor/fall.js',
  './js/motor/lagring.js',
  './js/motor/losare.js',
  './js/motor/poang.js',
  './js/motor/vagledning.js',
  './js/tre/kontroller.js',
  './js/tre/motor3d.js',
  './js/tre/prefabs.js',
  './js/tre/prefabs2.js',
  './js/tre/prefabs3.js',
  './js/tre/prefabs4.js',
  './js/tre/texturer.js',
  './js/version.js',
  './js/vyer/anklagelse.js',
  './js/vyer/anteckningsbok.js',
  './js/vyer/gemensamt.js',
  './js/vyer/handledning.js',
  './js/vyer/meny.js',
  './js/vyer/presentation.js',
  './js/vyer/slutsatser.js',
  './js/vyer/upplosning.js',
  './js/vyer/utredning.js',
  './vendor/three/three.module.min.js',
  './fall/brudskalen.json',
  './fall/halsbandet-pa-ekbacka.json',
  './fall/index.json',
  './fall/kvart-i-elva.json',
  './fall/middagen-pa-solglantan.json',
  './fall/nattaget-mot-narvik.json',
  './bilder/fall1/koksgangen.jpg',
  './bilder/fall1/matsalen.jpg',
  './bilder/fall1/sovrummet.jpg',
  './bilder/fall2/sovvagnen.jpg',
  './bilder/fall3/verandan.jpg',
  './bilder/fall4/garden.jpg',
  './bilder/fall5/urmakeriet.jpg',
  './bilder/fall6/fyren.jpg',
  './ikoner/favicon.png',
  './ikoner/ikon-180.png',
  './ikoner/ikon-192.png',
  './ikoner/ikon-512.png',
  './ikoner/ikon-maskable-512.png',
];
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(FILER)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((k) => Promise.all(k.filter((n) => n !== VERSION).map((n) => caches.delete(n)))).then(() => self.clients.claim()));
});
// Nätet först (så att nya versioner syns direkt), cache som reserv offline.
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(
    fetch(e.request).then((svar) => {
      if (svar.ok) { const kopia = svar.clone(); caches.open(VERSION).then((c) => c.put(e.request, kopia)); }
      return svar;
    }).catch(() => caches.match(e.request, { ignoreSearch: true }))
  );
});
