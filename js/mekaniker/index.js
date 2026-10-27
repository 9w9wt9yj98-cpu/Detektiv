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
  },
};
MEKANIKER.forhor = { rendera: jamfor.rendera, klar: (m, st) => jamfor.status(m, st).klar };
MEKANIKER.dokument = { rendera: jamfor.rendera, klar: (m, st) => jamfor.status(m, st).klar };
MEKANIKER.bildjamforelse = { rendera: bild.rendera, klar: (m, st) => bild.status(m, st).klar };
MEKANIKER.tidslinje = { rendera: tidslinje.rendera, klar: (m, st) => tidslinje.status(m, st).klar };

export function registrera(typ, def) { MEKANIKER[typ] = def; }
export function bokMoment(fall) { return fall.moment.filter((m) => MEKANIKER[m.mekanik] && m.mekanik !== 'scen'); }
