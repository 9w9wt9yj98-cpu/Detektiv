// Register över mekanikerna som visas som flikar i anteckningsboken.
import { renderaRutnat } from './logikrutnat.js';
import * as jamfor from './jamfor.js';
import * as bild from './bildjamforelse.js';
import * as tidslinje from './tidslinje.js';
import { installningar, spara } from '../motor/lagring.js';

export const MEKANIKER = {
  logikrutnat: {
    rendera(sida, m, ctx) {
      renderaRutnat(sida, m.payload, ctx.st, {
        autofyll: installningar().autofyll,
        onAutofyll: (v) => { installningar().autofyll = v; spara(); },
        onAndrat: () => spara(),
        onLost: () => { if (m.payload.ger_fynd_nar_lost) ctx.geFynd(m.payload.ger_fynd_nar_lost); spara(); },
      });
    },
    klar: (m, st) => !!st.rutnatLost,
    framsteg: (m, st) => ({ hittade: st.rutnatLost ? 1 : 0, totalt: 1, text: 'rutnätet är inte löst än. Ta ledtrådarna en i taget och kryssa bort det som inte kan stämma.' }),
  },
};
// framsteg: { hittade, totalt, text } för det gratis tipset i lampan (motor/vagledning.js, nastaSteg).
const framsteg = (status, text) => (m, st) => { const s = status(m, st); return { hittade: s.hittade, totalt: s.totalt, text: text(s) }; };
const motsagelser = framsteg(jamfor.status, (s) => `${s.hittade} av ${s.totalt} motsägelser hittade. Leta efter två uppgifter som inte kan vara sanna samtidigt, markera dem och tryck Invänd!`);
MEKANIKER.forhor = { rendera: jamfor.rendera, klar: (m, st) => jamfor.status(m, st).klar, framsteg: motsagelser };
MEKANIKER.dokument = { rendera: jamfor.rendera, klar: (m, st) => jamfor.status(m, st).klar, framsteg: motsagelser };
MEKANIKER.bildjamforelse = { rendera: bild.rendera, klar: (m, st) => bild.status(m, st).klar,
  framsteg: framsteg(bild.status, (s) => `${s.hittade} av ${s.totalt} viktiga upptäckter. Jämför bilderna två och två och peka på det som skiljer dem åt – eller på något som är exakt likadant.`) };
MEKANIKER.tidslinje = { rendera: tidslinje.rendera, klar: (m, st) => tidslinje.status(m, st).klar,
  framsteg: framsteg(tidslinje.status, (s) => `${s.hittade} av ${s.totalt} steg klara. Lägg tidskorten på rätt person, invänd mot det som krockar och pröva var och en mot brottstiden.`) };

export function registrera(typ, def) { MEKANIKER[typ] = def; }
export function bokMoment(fall) { return fall.moment.filter((m) => MEKANIKER[m.mekanik] && m.mekanik !== 'scen'); }
