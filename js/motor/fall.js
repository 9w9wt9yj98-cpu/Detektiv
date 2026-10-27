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
export function arUpplast(moment, st) { return (moment.last_upp_av || []).every((id) => st.fynd.includes(id)); }
export function rumMoment(fall) { return fall.moment.filter((m) => m.mekanik === 'scen' && m.payload.visning === '3d'); }
export function rutnatMoment(fall) { return fall.moment.filter((m) => m.mekanik === 'logikrutnat'); }
export function fallTitel(fall) { return `Fall ${fall.nummer} – ${fall.meta.titel}`; }
