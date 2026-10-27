// Validerar alla fall i fall/index.json: referenser, nåbarhet, logik och (för logikrutnät) unik lösning.
// Kör: node verktyg/validera_fall.mjs
import { readFileSync } from 'node:fs';
import { verifiera } from '../js/motor/losare.js';
import { materialMap } from '../js/motor/fall.js';

const rot = new URL('../fall/', import.meta.url);
const index = JSON.parse(readFileSync(new URL('index.json', rot)));
let fel = 0;
const varna = (fall, msg) => { fel++; console.log(`  ✗ ${fall}: ${msg}`); };
const lista = (x) => [].concat(x || []);

/** Saker i mekanikernas payload som ger fynd: { ger_fynd, kraver?, par? } (motsägelser, markörer, upptäckter …). */
function mekanikKallor(m) {
  const ut = [];
  const p = m.payload || {};
  for (const [nyckel, v] of Object.entries(p)) {
    if (!Array.isArray(v) || ['utsagor', 'dokument', 'bilder'].includes(nyckel)) continue;
    for (const x of v) if (x && typeof x === 'object' && x.ger_fynd) ut.push({ ...x, _var: `${m.id}.${nyckel}.${x.id || '?'}` });
  }
  return ut;
}

for (const kap of index.kapitel) for (const post of kap.fall) {
  if (post.kommer) continue;
  const f = JSON.parse(readFileSync(new URL(post.fil, rot)));
  console.log(`• ${f.meta.titel} (${f.id})`);
  for (const k of ['id', 'version', 'meta', 'intro', 'personer', 'moment', 'fynd', 'losning', 'ledtradar', 'aterkoppling'])
    if (!(k in f)) varna(f.id, `saknar fältet ${k}`);
  if (f.id !== post.id) varna(f.id, `id skiljer sig från index (${post.id})`);
  const mat = materialMap(f);
  const fyndId = new Set(f.fynd.map((x) => x.id));
  const allaId = new Set([...fyndId, ...Object.keys(mat)]);
  const personId = new Set(f.personer.map((p) => p.id));
  const kollaFynd = (id, var_) => { if (!fyndId.has(id)) varna(f.id, `okänt fynd ${id} i ${var_}`); };
  const kollaId = (id, var_) => { if (!allaId.has(id)) varna(f.id, `okänt fynd/material ${id} i ${var_}`); };
  const dubbletter = f.fynd.map((x) => x.id).filter((id, i, a) => a.indexOf(id) !== i);
  if (dubbletter.length) varna(f.id, `dubbla fynd-id: ${dubbletter}`);
  for (const id of Object.keys(mat)) if (fyndId.has(id)) varna(f.id, `${id} är både fynd och material`);
  if (!personId.has(f.losning.skyldig)) varna(f.id, 'skyldig finns inte bland personerna');
  for (const p of f.personer.filter((p) => p.misstankt && p.id !== f.losning.skyldig)) {
    if (!(f.losning.uteslutningar?.[p.id]?.length)) varna(f.id, `oskyldig ${p.id} saknar uteslutning`);
    if (!f.aterkoppling.fel?.[p.id]) varna(f.id, `oskyldig ${p.id} saknar feltext`);
  }
  for (const [p, ids] of Object.entries(f.losning.uteslutningar || {})) ids.forEach((i) => kollaFynd(i, `uteslutning ${p}`));
  for (const g of f.losning.bevisgrupper) g.forEach((i) => kollaFynd(i, 'bevisgrupp'));
  for (const x of f.fynd) for (const p of lista(x.galler)) if (!personId.has(p)) varna(f.id, `fynd ${x.id} gäller okänd person ${p}`);
  (f.start_fynd || []).forEach((i) => kollaFynd(i, 'start_fynd'));
  if (f.ledtradar.length !== 3) varna(f.id, 'ska ha exakt 3 ledtrådar');
  f.ledtradar.forEach((l, i) => lista(l.kraver).forEach((k) => kollaId(k, `ledtråd ${i + 1}`)));
  for (const s of f.aterkoppling.forklaring_steg || []) (s.fynd || []).forEach((i) => kollaFynd(i, 'förklaringssteg'));
  if (f.anklagelse && !f.anklagelse.hur_alternativ.some((a) => a.id === f.losning.hur)) varna(f.id, 'losning.hur saknas bland alternativen');
  const sIds = new Set((f.slutsatser || []).map((s) => s.id));
  for (const s of f.slutsatser || []) {
    lista(s.kraver).forEach((k) => kollaId(k, `slutsats ${s.id}`));
    lista(s.efter).forEach((k) => { if (!sIds.has(k)) varna(f.id, `slutsats ${s.id} väntar på okänd ${k}`); });
    if (s.ger_fynd) kollaFynd(s.ger_fynd, `slutsats ${s.id}`);
    if ((s.alternativ || []).filter((a) => a.ratt).length !== 1) varna(f.id, `slutsats ${s.id} ska ha exakt ett rätt svar`);
    for (const a of s.alternativ || []) if (!a.ratt && !a.svar) varna(f.id, `slutsats ${s.id}: fel alternativ saknar svar`);
  }
  for (const [id, x] of Object.entries(mat)) {
    lista(x.kraver).forEach((k) => kollaId(k, `material ${id}`));
    if (x.person && !personId.has(x.person)) varna(f.id, `material ${id} har okänd person ${x.person}`);
  }

  // Simulera ett genomspel: vad går att få tag på, i vilken ordning?
  const har = new Set(f.start_fynd || []);
  const besvarade = new Set();
  const mek = f.moment.flatMap(mekanikKallor);
  for (const k of mek) {
    if (k.ger_fynd) lista(k.ger_fynd).forEach((i) => kollaFynd(i, k._var));
    lista(k.kraver).forEach((i) => kollaId(i, k._var));
    for (const par of k.par || []) par.forEach((i) => kollaId(i, `${k._var} par`));
  }
  for (const m of f.moment) {
    (m.last_upp_av || []).forEach((i) => kollaId(i, `last_upp_av ${m.id}`));
    for (const o of m.payload?.rum?.objekt || []) {
      lista(o.interaktiv?.ger_fynd).forEach((i) => kollaFynd(i, `${m.id}/${o.id}`));
      lista(o.interaktiv?.ger_material).forEach((i) => { if (!mat[i]) varna(f.id, `${m.id}/${o.id} ger okänt material ${i}`); });
      if (o.gar_till && !f.moment.some((x) => x.id === o.gar_till)) varna(f.id, `${m.id}/${o.id} går till okänt rum ${o.gar_till}`);
    }
  }
  const alla = (ids) => lista(ids).every((i) => har.has(i));
  for (let varv = 0, andrat = true; andrat && varv < 100; varv++) {
    andrat = false;
    const lagg = (id) => { if (id && !har.has(id)) { har.add(id); andrat = true; } };
    for (const m of f.moment) {
      if (!alla(m.last_upp_av)) continue;
      for (const o of m.payload?.rum?.objekt || []) { lista(o.interaktiv?.ger_fynd).forEach(lagg); lista(o.interaktiv?.ger_material).forEach(lagg); }
      if (m.payload?.ger_fynd_nar_lost) lagg(m.payload.ger_fynd_nar_lost);
    }
    for (const [id, x] of Object.entries(mat)) if (x.kraver && alla(x.kraver)) lagg(id);
    for (const k of mek) {
      const ok = k.par ? k.par.some((p) => alla(p)) : alla(k.kraver);
      if (ok && (!k.par || alla(k.kravs))) lista(k.ger_fynd).forEach(lagg);
    }
    for (const s of f.slutsatser || []) if (!besvarade.has(s.id) && alla(s.kraver) && lista(s.efter).every((e) => besvarade.has(e))) {
      besvarade.add(s.id); andrat = true; if (s.ger_fynd) lagg(s.ger_fynd);
    }
  }
  for (const id of allaId) if (!har.has(id)) varna(f.id, `${fyndId.has(id) ? 'fyndet' : 'materialet'} ${id} kan aldrig hittas`);
  for (const s of f.slutsatser || []) if (!besvarade.has(s.id)) varna(f.id, `slutsatsen ${s.id} kan aldrig besvaras`);
  for (const m of f.moment) if (!alla(m.last_upp_av)) varna(f.id, `momentet ${m.id} låses aldrig upp`);

  for (const m of f.moment) {
    if (m.mekanik === 'logikrutnat') {
      const r = verifiera(m.payload);
      console.log(`  logikrutnät: ${r.antal} lösning(ar); överflödiga ledtrådar: ${r.overflodiga.join(', ') || 'inga'}`);
      r.fel.forEach((e) => varna(f.id, e));
      if (r.overflodiga.length) varna(f.id, `ledtrådar som inte behövs: ${r.overflodiga.join(', ')}`);
    }
  }
  console.log(`  ${fyndId.size} fynd, ${Object.keys(mat).length} material, ${(f.slutsatser || []).length} slutsatser – allt nåbart: ${[...allaId].every((i) => har.has(i)) ? 'ja' : 'nej'}`);
}
console.log(fel ? `\n${fel} fel.` : '\nAlla fall är giltiga ✓');
process.exit(fel ? 1 : 0);
