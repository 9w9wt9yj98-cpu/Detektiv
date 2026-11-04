// Spelar igenom alla fall i headless Chromium (iPhone 390×844 med touch, samt skrivbord) och sparar skärmbilder i shots/.
// Kör: node test/spela.mjs [fall1 fall3 …]  (startar en egen server på BAS om ingen svarar där)
import { startaWebblasare, nySida, bild, vanta, BAS, rapporteraFel } from './hjalp.mjs';
import { sakerstallServer } from './server.mjs';
import * as fall1 from './scenarier/fall1.mjs';
import * as fall2 from './scenarier/fall2.mjs';
import * as fall3 from './scenarier/fall3.mjs';
import * as fall4 from './scenarier/fall4.mjs';
import * as fall5 from './scenarier/fall5.mjs';
import * as fall6 from './scenarier/fall6.mjs';
import * as fall7 from './scenarier/fall7.mjs';
import * as fall8 from './scenarier/fall8.mjs';

const SCENARIER = {
  fall1: [fall1.handledning, fall1.fel, fall1.ratt],
  fall2: [fall2.ratt, fall2.fel],
  fall3: [fall3.ratt, fall3.visaLosning],
  fall4: [fall4.ratt, fall4.fel],
  fall5: [fall5.ratt, fall5.fel],
  fall6: [fall6.ratt, fall6.fel],
  fall7: [fall7.ratt, fall7.fel],
  fall8: [fall8.ratt, fall8.fel],
};
const valda = process.argv.slice(2).filter((x) => SCENARIER[x]);
const stoppaServer = await sakerstallServer(BAS);
const browser = await startaWebblasare();
let misslyckade = 0;
try {
  for (const namn of valda.length ? valda : Object.keys(SCENARIER)) {
    for (const s of SCENARIER[namn]) {
      try { await s(browser); } catch (e) { misslyckade++; console.log(`✗ ${namn}/${s.name}: ${e.message.split('\n')[0]}`, (e.stack || '').split('\n').find((l) => l.includes('scenarier')) || ''); }
    }
  }
  if (!valda.length) {
    const m = await nySida(browser, true, 'meny');
    await m.goto(BAS + '?nosw'); await vanta(700); await bild(m, 'meny', true);
    const d = await nySida(browser, false, 'desktop');
    await d.goto(BAS + '?nosw#/fall/halsbandet-pa-ekbacka'); await d.locator('#start').click(); await vanta(1800); await bild(d, 'desktop-fall1');
    console.log('FPS (swiftshader, mjukvara):', await d.evaluate(() => window.__fps));
  }
} finally { await browser.close(); await stoppaServer(); }
const n = rapporteraFel();
process.exit(n || misslyckade ? 1 : 0);
