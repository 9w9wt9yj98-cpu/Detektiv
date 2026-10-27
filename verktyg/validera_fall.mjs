// Validerar alla fall i fall/index.json: referenser, logik och (för logikrutnät) unik lösning.
// Kör: node verktyg/validera_fall.mjs
import { readFileSync } from 'node:fs';
import { verifiera } from '../js/motor/losare.js';

const rot = new URL('../fall/', import.meta.url);
const index = JSON.parse(readFileSync(new URL('index.json', rot)));
let fel = 0;
const varna = (fall, msg) => { fel++; console.log(`  ✗ ${fall}: ${msg}`); };

for (const kap of index.kapitel) for (const post of kap.fall) {
  if (post.kommer) continue;
  const f = JSON.parse(readFileSync(new URL(post.fil, rot)));
  console.log(`• ${f.meta.titel} (${f.id})`);
  for (const k of ['id', 'version', 'meta', 'intro', 'personer', 'moment', 'fynd', 'losning', 'ledtradar', 'aterkoppling'])
    if (!(k in f)) varna(f.id, `saknar fältet ${k}`);
  const fyndId = new Set(f.fynd.map((x) => x.id));
  const personId = new Set(f.personer.map((p) => p.id));
  const kollaFynd = (id, var_) => { if (!fyndId.has(id)) varna(f.id, `okänt fynd ${id} i ${var_}`); };
  if (!personId.has(f.losning.skyldig)) varna(f.id, 'skyldig finns inte bland personerna');
  for (const p of f.personer.filter((p) => p.misstankt && p.id !== f.losning.skyldig))
    if (!(f.losning.uteslutningar?.[p.id]?.length)) varna(f.id, `oskyldig ${p.id} saknar uteslutning`);
  for (const [p, ids] of Object.entries(f.losning.uteslutningar || {})) ids.forEach((i) => kollaFynd(i, `uteslutning ${p}`));
  for (const g of f.losning.bevisgrupper) g.forEach((i) => kollaFynd(i, 'bevisgrupp'));
  (f.start_fynd || []).forEach((i) => kollaFynd(i, 'start_fynd'));
  if (f.ledtradar.length !== 3) varna(f.id, 'ska ha exakt 3 ledtrådar');
  for (const s of f.aterkoppling.forklaring_steg || []) (s.fynd || []).forEach((i) => kollaFynd(i, 'förklaringssteg'));
  if (f.anklagelse && !f.anklagelse.hur_alternativ.some((a) => a.id === f.losning.hur)) varna(f.id, 'losning.hur saknas bland alternativen');
  // Alla fynd måste gå att få tag på
  const nåbara = new Set(f.start_fynd || []);
  for (const m of f.moment) {
    const p = m.payload;
    const lista = p.hotspots || p.rum?.objekt?.map((o) => o.interaktiv).filter(Boolean) || [];
    for (const h of lista) [].concat(h.ger_fynd || []).forEach((i) => { kollaFynd(i, `moment ${m.id}`); nåbara.add(i); });
    if (p.ger_fynd_nar_lost) { kollaFynd(p.ger_fynd_nar_lost, m.id); nåbara.add(p.ger_fynd_nar_lost); }
    (m.last_upp_av || []).forEach((i) => kollaFynd(i, `last_upp_av ${m.id}`));
    if (m.mekanik === 'logikrutnat') {
      const r = verifiera(p);
      console.log(`  logikrutnät: ${r.antal} lösning(ar); överflödiga ledtrådar: ${r.overflodiga.join(', ') || 'inga'}`);
      r.fel.forEach((e) => varna(f.id, e));
      if (r.overflodiga.length) varna(f.id, `ledtrådar som inte behövs: ${r.overflodiga.join(', ')}`);
    }
  }
  for (const id of fyndId) if (!nåbara.has(id)) varna(f.id, `fyndet ${id} kan aldrig hittas`);
}
console.log(fel ? `\n${fel} fel.` : '\nAlla fall är giltiga ✓');
process.exit(fel ? 1 : 0);
