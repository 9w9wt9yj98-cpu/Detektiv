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
  const namn = v.person || v.egen ? v.objektNamn : v.objektNamn.charAt(0).toLowerCase() + v.objektNamn.slice(1);
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

/**
 * Det gratis tipset i lampan och under Platser: en mening om vad spelaren kan göra härnäst. Det bygger bara på
 * spelarens läge – vad som är hittat, upplåst och besvarat – och avslöjar aldrig lösningen.
 * `framsteg(m)` ger en mekaniks framsteg: { hittade, totalt, text } (se mekaniker/index.js).
 */
export function nastaSteg(fall, st, { framsteg } = {}) {
  const r = rakning(fall, st);
  const kvar = (x) => x.total - x.hittat;
  const redo = redoSlutsatser(fall, st);
  if (redo.length) return redo.length === 1 ? 'En ny fråga väntar under Slutsatser i anteckningsboken.' : `${redo.length} nya frågor väntar under Slutsatser i anteckningsboken.`;
  // 1. Fynd kvar i rummet man står i, sedan i andra öppna rum
  const har_ = r.perRum[st.rum];
  if (har_?.upplast && kvar(har_) > 0) return `Det finns mer att hitta här i ${har_.namn} – ${kvar(har_)} kvar. Gå nära allt som har ett ! ovanför.`;
  const oppna = Object.values(r.perRum).filter((x) => x.upplast && kvar(x) > 0);
  if (oppna.length) return `Det finns mer att hitta i ${oppna.map((x) => `${x.namn} (${kvar(x)} kvar)`).join(' och ')}.`;
  // 2. Ett pussel i anteckningsboken som är öppet men inte klart
  for (const m of fall.moment.filter((x) => x.mekanik !== 'scen' && arUpplast(x, st))) {
    const p = framsteg?.(m);
    if (p && p.hittade < p.totalt) return `Öppna anteckningsboken och arbeta vidare med ”${m.namn}”: ${p.text}`;
  }
  // 3. Något som är låst – visa vägen till det som låser upp det
  for (const m of fall.moment.filter((x) => !arUpplast(x, st))) {
    const nyckel = (m.last_upp_av || []).find((x) => !har(st, x));
    const v = nyckel && vagTill(fall, st, nyckel);
    if (v) return `${m.namn} är fortfarande låst. ${pekarText(v)}`;
    if (m.last_text) return `${m.namn} är fortfarande låst: ${m.last_text}`;
  }
  // 4. Frågor under Slutsatser som väntar på mer underlag
  const obesvarade = (fall.slutsatser || []).filter((x) => !st.slutsatser?.[x.id]);
  for (const x of obesvarade) {
    const saknas = (x.kraver || []).find((id) => !har(st, id));
    const v = saknas && vagTill(fall, st, saknas);
    if (v) return `Nästa fråga under Slutsatser behöver mer underlag. ${pekarText(v)}`;
  }
  // 5. Allt är gjort
  const bevis = fall.anklagelse?.bevis_max ?? 3;
  if (!obesvarade.length) return `Du har hittat allt och svarat på alla frågor. Dags att anklaga: välj den skyldige och upp till ${bevis} fynd som bevisar det.`;
  return 'Gå igenom dina fynd och frågorna under Slutsatser igen, och anklaga när du är säker.';
}
