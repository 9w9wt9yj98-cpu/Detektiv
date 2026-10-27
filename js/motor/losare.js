// Generisk lösare för logikrutnät. Körs både i webbläsaren och i Node (verktyg/validera_fall.mjs).
// En lösning är en tilldelning: för varje värde i första kategorin (entiteten), ett värde per övrig kategori.

function permutationer(arr) {
  if (arr.length <= 1) return [arr.slice()];
  const ut = [];
  arr.forEach((x, i) => {
    const rest = arr.slice(0, i).concat(arr.slice(i + 1));
    for (const p of permutationer(rest)) ut.push([x, ...p]);
  });
  return ut;
}

/** Bygger uppslag: värde-id -> kategori-id. */
export function vardeIndex(payload) {
  const idx = {};
  for (const k of payload.kategorier) for (const v of k.varden) idx[v.id] = k.id;
  return idx;
}

/** Entiteten (värde i kategori 0) som ett värde tillhör i en tilldelning. */
function agare(tilldelning, varde, idx, entKat) {
  if (idx[varde] === entKat) return varde;
  const kat = idx[varde];
  for (const [ent, rad] of Object.entries(tilldelning)) if (rad[kat] === varde) return ent;
  return null;
}

function grannar(payload) {
  const set = new Set();
  for (const [a, b] of payload.grannar?.par || []) { set.add(a + '|' + b); set.add(b + '|' + a); }
  return set;
}

/** Utvärderar en regel mot en fullständig tilldelning. */
export function uppfyller(regel, t, payload, cache = {}) {
  const idx = cache.idx || vardeIndex(payload);
  const entKat = payload.kategorier[0].id;
  const gk = payload.grannar?.kategori;
  const gs = cache.gs || grannar(payload);
  const ag = (v) => agare(t, v, idx, entKat);
  const pos = (v) => t[ag(v)]?.[gk];
  const bredvid = (a, b) => gs.has(pos(a) + '|' + pos(b));
  switch (regel.typ) {
    case 'samma': return ag(regel.a) === ag(regel.b);
    case 'inte_samma': return ag(regel.a) !== ag(regel.b);
    case 'en_av': return regel.b.some((b) => ag(regel.a) === ag(b));
    case 'inget_av': return !regel.b.some((b) => ag(regel.a) === ag(b));
    case 'bredvid': return bredvid(regel.a, regel.b);
    case 'inte_bredvid': return !bredvid(regel.a, regel.b);
    case 'mellan': return ag(regel.b) !== ag(regel.c) && bredvid(regel.a, regel.b) && bredvid(regel.a, regel.c);
    default: throw new Error('Okänd regeltyp: ' + regel.typ);
  }
}

/** Alla ledtrådar (id) som tilldelningen bryter mot. */
export function brutnaLedtradar(payload, t, uteslut = new Set()) {
  const cache = { idx: vardeIndex(payload), gs: grannar(payload) };
  return payload.ledtradar
    .filter((l) => !uteslut.has(l.id))
    .filter((l) => !l.regler.every((r) => uppfyller(r, t, payload, cache)))
    .map((l) => l.id);
}

/** Räknar upp alla lösningar (max `max`). Ledtrådar i `uteslut` ignoreras. */
export function losningar(payload, { uteslut = new Set(), max = Infinity } = {}) {
  const [ent, ...ovriga] = payload.kategorier;
  const ents = ent.varden.map((v) => v.id);
  const perms = ovriga.map((k) => permutationer(k.varden.map((v) => v.id)));
  const ut = [];
  const val = new Array(ovriga.length);
  const rekursion = (i) => {
    if (ut.length >= max) return;
    if (i === ovriga.length) {
      const t = {};
      ents.forEach((e, j) => { t[e] = {}; ovriga.forEach((k, ki) => { t[e][k.id] = val[ki][j]; }); });
      if (brutnaLedtradar(payload, t, uteslut).length === 0) ut.push(t);
      return;
    }
    for (const p of perms[i]) { val[i] = p; rekursion(i + 1); }
  };
  rekursion(0);
  return ut;
}

export function sammaTilldelning(a, b) {
  return Object.keys(a).every((e) => Object.keys(a[e]).every((k) => a[e][k] === b[e]?.[k]));
}

/** Verifierar: exakt en lösning, den lagrade, och varje ledtråd behövs. */
export function verifiera(payload) {
  const alla = losningar(payload, { max: 5 });
  const fel = [];
  if (alla.length !== 1) fel.push(`Rutnätet har ${alla.length} lösningar (ska vara 1).`);
  else if (payload.losning && !sammaTilldelning(alla[0], payload.losning)) fel.push('Lösarens lösning skiljer sig från den lagrade lösningen.');
  const overflodiga = payload.ledtradar
    .filter((l) => losningar(payload, { uteslut: new Set([l.id]), max: 2 }).length < 2)
    .map((l) => l.id);
  return { antal: alla.length, losning: alla[0], fel, overflodiga };
}
