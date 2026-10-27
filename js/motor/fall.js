// Läser in fall (JSON) och räknar fram vad spelaren har låst upp.
const cache = new Map();
let index = null;

export async function laddaIndex() {
  if (!index) {
    const r = await fetch('fall/index.json');
    if (!r.ok) throw new Error('Kunde inte läsa fallregistret');
    index = await r.json();
  }
  return index;
}
export async function laddaFall(id) {
  if (cache.has(id)) return cache.get(id);
  const idx = await laddaIndex();
  let post = null, nummer = null;
  for (const k of idx.kapitel) for (const f of k.fall) if (f.id === id) { post = f; nummer = f.nummer; }
  if (!post || !post.fil) throw new Error('Okänt fall: ' + id);
  const r = await fetch('fall/' + post.fil);
  if (!r.ok) throw new Error('Kunde inte läsa fallet ' + id);
  const fall = await r.json();
  fall.nummer = nummer;
  cache.set(id, fall);
  return fall;
}
export function fyndMap(fall) { return Object.fromEntries(fall.fynd.map((f) => [f.id, f])); }
export function personMap(fall) { return Object.fromEntries(fall.personer.map((p) => [p.id, p])); }
export function arUpplast(moment, st) { return (moment.last_upp_av || []).every((id) => har(st, id)); }
export function rumMoment(fall) { return fall.moment.filter((m) => m.mekanik === 'scen' && m.payload.visning === '3d'); }
export function rutnatMoment(fall) { return fall.moment.filter((m) => m.mekanik === 'logikrutnat'); }
export function fallTitel(fall) { return `Fall ${fall.nummer} – ${fall.meta.titel}`; }

/** Allt "material" (utsagor, dokument, bilder) som mekanikerna definierar: id -> { typ, titel, moment, ... }. */
export function materialMap(fall) {
  if (fall._material) return fall._material;
  const ut = {};
  for (const m of fall.moment) {
    const p = m.payload || {};
    for (const u of p.utsagor || []) ut[u.id] = { ...u, typ: 'utsaga', moment: m.id };
    for (const d of p.dokument || []) ut[d.id] = { ...d, typ: 'dokument', moment: m.id };
    for (const b of p.bilder || []) ut[b.id] = { ...b, typ: 'bild', moment: m.id };
  }
  Object.defineProperty(fall, '_material', { value: ut, enumerable: false });
  return ut;
}
/** Vad ett föremål i rummet ger: fynd och material. */
export function objektGer(def) {
  const i = def.interaktiv || {};
  return { fynd: [].concat(i.ger_fynd || []), material: [].concat(i.ger_material || []) };
}
/** Var varje fynd/material kan hittas i 3D-rummen: id -> [{ rum, rumNamn, objekt, objektNamn }]. */
export function kallor(fall) {
  if (fall._kallor) return fall._kallor;
  const ut = {};
  for (const m of rumMoment(fall)) for (const o of m.payload.rum.objekt || []) {
    const g = objektGer(o);
    for (const id of [...g.fynd, ...g.material]) (ut[id] ||= []).push({ rum: m.id, rumNamn: m.namn, objekt: o.id, objektNamn: o.interaktiv?.namn || o.id, person: o.typ === 'person' });
  }
  Object.defineProperty(fall, '_kallor', { value: ut, enumerable: false });
  return ut;
}
/** Har spelaren id:t (fynd eller material)? */
export function har(st, id) { return st.fynd.includes(id) || (st.material || []).includes(id); }
/** Det som räknas i HUD:ens räknare: allt som kan hittas i rummen. Per rum och totalt. */
export function rakning(fall, st) {
  const k = kallor(fall);
  const perRum = {};
  for (const m of rumMoment(fall)) perRum[m.id] = { namn: m.namn, total: 0, hittat: 0, upplast: arUpplast(m, st), moment: m };
  const sett = new Set();
  for (const [id, lista] of Object.entries(k)) {
    const hittad = har(st, id);
    for (const rumId of new Set(lista.map((x) => x.rum))) { perRum[rumId].total++; if (hittad) perRum[rumId].hittat++; }
    sett.add(id);
  }
  let total = 0, hittat = 0;
  for (const id of sett) { total++; if (har(st, id)) hittat++; }
  return { total, hittat, perRum };
}
/** Material som inte finns i rummen men låses upp av fynd (t.ex. följdfrågor). */
export function uppdateraHarlett(fall, st) {
  st.material ||= [];
  const nya = [];
  for (const [id, x] of Object.entries(materialMap(fall))) {
    if (x.kraver && !st.material.includes(id) && x.kraver.every((k) => har(st, k))) { st.material.push(id); nya.push(id); }
  }
  return nya;
}
