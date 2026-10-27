// Detektiv – startpunkt och enkel hash-router.
import { visaMeny } from './vyer/meny.js';
import { visaPresentation } from './vyer/presentation.js';
import { visaUtredning } from './vyer/utredning.js';
import { visaUpplosning } from './vyer/upplosning.js';
import { stangAllaModaler, esc } from './vyer/gemensamt.js';

const app = document.getElementById('app');
let aktiv = null; // aktuell vy med ev. städfunktion

async function route() {
  const delar = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
  try { aktiv?.(); } catch (e) { console.error(e); }
  aktiv = null;
  stangAllaModaler();
  window.scrollTo(0, 0);
  try {
    if (delar[0] === 'fall' && delar[1]) {
      const id = decodeURIComponent(delar[1]);
      if (delar[2] === 'utred') aktiv = await visaUtredning(app, id);
      else if (delar[2] === 'upplosning') aktiv = await visaUpplosning(app, id);
      else aktiv = await visaPresentation(app, id);
    } else aktiv = await visaMeny(app);
  } catch (e) {
    console.error(e);
    app.innerHTML = `<div class="sida"><div class="papperskort"><h2>Akten kunde inte öppnas</h2><p>${esc(e.message)}</p><a class="knapp massing" href="#/">Till fallmenyn</a></div></div>`;
  }
}
window.addEventListener('hashchange', route);
route();

if ('serviceWorker' in navigator && location.protocol !== 'file:' && !/[?&]nosw/.test(location.search)) {
  window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch((e) => console.warn('SW', e)));
}
