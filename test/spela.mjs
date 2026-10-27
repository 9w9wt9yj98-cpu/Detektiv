// Spelar igenom alla fall i headless Chromium (iPhone 390×844 med touch, samt skrivbord) och sparar skärmbilder i shots/.
// Kör: python3 -m http.server 18431 &  node test/spela.mjs [fall1 fall3 …]
import { startaWebblasare, nySida, bild, vanta, BAS, rapporteraFel } from './hjalp.mjs';
import * as fall1 from './scenarier/fall1.mjs';
import * as fall3 from './scenarier/fall3.mjs';

const SCENARIER = {
  fall1: [fall1.handledning, fall1.fel, fall1.ratt],
  fall3: [fall3.ratt, fall3.visaLosning],
};
const valda = process.argv.slice(2).filter((x) => SCENARIER[x]);
const browser = await startaWebblasare();
let misslyckade = 0;
try {
  for (const namn of valda.length ? valda : Object.keys(SCENARIER)) {
    for (const s of SCENARIER[namn]) {
      try { await s(browser); } catch (e) { misslyckade++; console.log(`✗ ${namn}/${s.name}: ${e.message.split('\n')[0]}`); }
    }
  }
  if (!valda.length) {
    const m = await nySida(browser, true, 'meny');
    await m.goto(BAS + '?nosw'); await vanta(700); await bild(m, 'meny', true);
    const d = await nySida(browser, false, 'desktop');
    await d.goto(BAS + '?nosw#/fall/halsbandet-pa-ekbacka'); await d.locator('#start').click(); await vanta(1800); await bild(d, 'desktop-fall1');
    console.log('FPS (swiftshader, mjukvara):', await d.evaluate(() => window.__fps));
  }
} finally { await browser.close(); }
const n = rapporteraFel();
process.exit(n || misslyckade ? 1 : 0);
