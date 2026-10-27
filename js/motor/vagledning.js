// Vägledning: var finns det som saknas, vad är nästa steg? Används av ledtrådar, Platser och HUD.
import { kallor, har, rumMoment, arUpplast, rakning, materialMap } from './fall.js';

/** Vilket moment (mekanik i boken) eller vilken slutsats ger ett visst fynd? */
export function mekanikKallor(fall) {
  if (fall._mekKallor) return fall._mekKallor;
  const ut = {};
  const sok = (o, m) => {
    if (Array.isArray(o)) return o.forEach((x) => sok(x, m));
    if (o && typeof o === 'object') for (const [k, v] of Object.entries(o)) {
      if ((k === 'ger_fynd' || k === 'ger_fynd_nar_lost') && typeof v === 'string') ut[v] ||= { moment: m.id, namn: m.namn };
      else sok(v, m);
    }
  };
  for (const m of fall.moment) if (m.mekanik !== 'scen') sok(m.payload, m);
  for (const s of fall.slutsatser || []) if (s.ger_fynd) ut[s.ger_fynd] ||= { slutsats: s.id, namn: 'Slutsatser' };
  Object.defineProperty(fall, '_mekKallor', { value: ut, enumerable: false });
  return ut;
}

/** Vägen till ett fynd/material spelaren saknar: { rumNamn, objektNamn } eller { flik } – följer låsta rum bakåt. */
export function vagTill(fall, st, id, djup = 0) {
  if (djup > 5) return null;
  const k = kallor(fall)[id];
  if (k?.length) {
    for (const x of k) {
      const m = fall.moment.find((mm) => mm.id === x.rum);
      if (arUpplast(m, st)) return { id, ...x };
    }
    const m = fall.moment.find((mm) => mm.id === k[0].rum);
    const nyckel = (m.last_upp_av || []).find((x) => !har(st, x));
    const v = nyckel && vagTill(fall, st, nyckel, djup + 1);
    if (v) return { ...v, for: m.namn };
  }
  const mk = mekanikKallor(fall)[id];
  if (mk) {
    // Kräver mekaniken något som saknas?
    const m = mk.moment && fall.moment.find((mm) => mm.id === mk.moment);
    if (m && !arUpplast(m, st)) {
      const nyckel = (m.last_upp_av || []).find((x) => !har(st, x));
      const v = nyckel && vagTill(fall, st, nyckel, djup + 1);
      if (v) return { ...v, for: m.namn };
    }
    return { id, flik: mk.namn };
  }
  return null;
}

export function pekarText(v) {
  if (!v) return '';
  if (v.flik) return `Öppna anteckningsboken och arbeta vidare under fliken ”${v.flik}”.`;
  const namn = v.person ? v.objektNamn : v.objektNamn.charAt(0).toLowerCase() + v.objektNamn.slice(1);
  return `Gå till ${v.rumNamn} och ${v.person ? 'prata med' : 'undersök'} ${namn}.${v.for ? ` (Det behövs för att komma åt ${v.for}.)` : ''}`;
}

/** Saknade underlag för en ledtrådsnivå: returnerar första vägen eller null. */
export function ledtradPekare(fall, st, l) {
  const saknas = (l.kraver || []).filter((id) => !har(st, id));
  if (!saknas.length) return null;
  return { antal: saknas.length, vag: vagTill(fall, st, saknas[0]) };
}

/** Slutsatsfrågor som är redo att besvaras. */
export function redoSlutsatser(fall, st) {
  return (fall.slutsatser || []).filter((s) => !st.slutsatser?.[s.id] && (s.kraver || []).every((id) => har(st, id)) && (s.efter || []).every((x) => st.slutsatser?.[x]));
}

/** En kort mening om vad spelaren kan göra härnäst (gratis, avslöjar inget). */
export function nastaSteg(fall, st) {
  const r = rakning(fall, st);
  const oppnaRum = Object.values(r.perRum).filter((x) => x.upplast && x.hittat < x.total);
  const last = Object.values(r.perRum).filter((x) => !x.upplast);
  const redo = redoSlutsatser(fall, st);
  if (redo.length) return `En ny fråga väntar under Slutsatser i anteckningsboken.`;
  if (oppnaRum.length) return `Det finns mer att hitta i ${oppnaRum.map((x) => x.namn).join(' och ')}.`;
  if (last.length) return `Allt i de öppna rummen är undersökt. Något du har hittat leder vidare – läs dina fynd igen.`;
  const ml = Object.values(materialMap(fall));
  void ml;
  if (r.hittat >= r.total) return 'Du har hittat allt som går att hitta. Gå igenom slutsatserna och anklaga när du är säker.';
  return '';
}
