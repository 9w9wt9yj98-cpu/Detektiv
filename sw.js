// Service worker: cachar spelets filer så att det fungerar offline och kan läggas på hemskärmen.
const VERSION = 'detektiv-v31';
const FILER = [
  './',
  './index.html',
  './manifest.webmanifest',
  './css/stil.css',
  './js/ljud.js',
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
  './js/tre/foremal/belysning.js',
  './js/tre/foremal/byggdelar.js',
  './js/tre/foremal/fjall.js',
  './js/tre/foremal/grund.js',
  './js/tre/foremal/index.js',
  './js/tre/foremal/mobler.js',
  './js/tre/foremal/personer.js',
  './js/tre/foremal/slott.js',
  './js/tre/foremal/smasaker.js',
  './js/tre/foremal/teater.js',
  './js/tre/foremal/ute.js',
  './js/tre/kontroller.js',
  './js/tre/modeller.js',
  './js/tre/motor3d.js',
  './js/tre/stil.js',
  './js/tre/texturer.js',
  './js/tre/ytor.js',
  './js/version.js',
  './js/vyer/anklagelse.js',
  './js/vyer/anteckningsbok.js',
  './js/vyer/gemensamt.js',
  './js/vyer/handledning.js',
  './js/vyer/meny.js',
  './js/vyer/presentation.js',
  './js/vyer/salosdu.js',
  './js/vyer/slutsatser.js',
  './js/vyer/upplosning.js',
  './js/vyer/utredning.js',
  './vendor/three/three.module.min.js',
  './fall/brudskalen.json',
  './fall/fjallgarden-1968.json',
  './fall/fyren-pa-graskar.json',
  './fall/halsbandet-pa-ekbacka.json',
  './fall/index.json',
  './fall/kvart-i-elva.json',
  './fall/middagen-pa-solglantan.json',
  './fall/nattaget-mot-narvik.json',
  './fall/nyarsnatten-pa-vitanas.json',
  './fall/sista-akten.json',
  './bilder/fall1/koksgangen.jpg',
  './bilder/fall1/matsalen.jpg',
  './bilder/fall1/sovrummet.jpg',
  './bilder/fall2/sovvagnen.jpg',
  './bilder/fall3/verandan.jpg',
  './bilder/fall4/garden.jpg',
  './bilder/fall5/urmakeriet.jpg',
  './bilder/fall6/fyren.jpg',
  './bilder/fall7/teatern.jpg',
  './bilder/fall8/vitanas.jpg',
  './bilder/fall9/fjallgarden.jpg',
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
// cache: 'no-cache' gör att webbläsarens HTTP-cache inte kan blanda gamla och nya moduler efter en release.
// Svarar nätet inte inom VANTA_MS används den sparade kopian, så att spelet inte hänger på ett dåligt mobilnät.
const VANTA_MS = 4000;
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith((async () => {
    const natet = fetch(e.request, { cache: 'no-cache' }).then((svar) => {
      if (svar.ok) { const kopia = svar.clone(); caches.open(VERSION).then((c) => c.put(e.request, kopia)).catch(() => {}); }
      return svar;
    });
    natet.catch(() => {});
    const tidsgrans = new Promise((r) => setTimeout(r, VANTA_MS, null));
    try {
      const svar = await Promise.race([natet, tidsgrans]);
      if (svar) return svar;
    } catch { /* nätet svarade inte – prova cachen */ }
    const sparad = await caches.match(e.request, { ignoreSearch: true });
    return sparad || natet;
  })());
});
