// Spelarvy för blindtest: allt spelaren kan se i ett fall, men inget facit.
//   node verktyg/spelarvy.mjs <fall-id>               spelarvyn (inledning, personer, rum, fynd från föremål, mekaniker, anklagelse)
//   node verktyg/spelarvy.mjs <fall-id> --slutsatser  slutsatsfrågorna med alternativ, utan rätt svar (andra steget i ett blindtest)
// Utelämnas: lösning, återkoppling, ledtrådar, rätta svar och svarstexter i slutsatser, motsägelser och konflikter,
// prövningar, upptäckter i bildjämförelsen, rutnätets lösning och maskinläsbara regler, fyndens typ (t.ex. villospår)
// och koppling till personer, och fynd som man bara får genom att lösa något (de beskrivs bara som "ett fynd från …").
import { readFileSync } from 'node:fs';

const [id, flagga] = process.argv.slice(2);
if (!id) { console.error('Användning: node verktyg/spelarvy.mjs <fall-id> [--slutsatser]'); process.exit(1); }
const f = JSON.parse(readFileSync(new URL(`../fall/${id}.json`, import.meta.url), 'utf8'));
const ut = [];
const p = (s = '') => ut.push(s);

const fynd = new Map(f.fynd.map((x) => [x.id, x]));
const person = new Map(f.personer.map((x) => [x.id, x]));
const moment = new Map(f.moment.map((m) => [m.id, m]));
// Fynd som ges direkt av föremål i rummen (spelaren ser dem när föremålet undersöks).
const rumsfynd = new Set();
for (const m of f.moment) for (const o of m.payload?.rum?.objekt || []) for (const x of [].concat(o.interaktiv?.ger_fynd || [])) rumsfynd.add(x);
// Varifrån övriga fynd kommer (namnet på momentet), för att kunna säga "ett fynd från …" utan att avslöja det.
const fyndKalla = new Map();
for (const m of f.moment) {
  const pl = m.payload || {};
  const lista = [...(pl.motsagelser || []), ...(pl.konflikter || []), ...(pl.prov || []), ...(pl.upptackter || [])];
  for (const x of lista) for (const g of [].concat(x.ger_fynd || [])) if (!fyndKalla.has(g)) fyndKalla.set(g, m.namn);
  if (pl.ger_fynd_nar_lost) fyndKalla.set(pl.ger_fynd_nar_lost, m.namn);
}
const dokument = new Map();
for (const m of f.moment) for (const d of m.payload?.dokument || []) dokument.set(d.id, d);
const utsaga = new Map();
for (const m of f.moment) for (const u of m.payload?.utsagor || []) utsaga.set(u.id, u);
const tidskort = new Map();
for (const m of f.moment) for (const k of m.payload?.kort || []) tidskort.set(k.id, k);

const namnPa = (x) => {
  if (fynd.has(x)) return rumsfynd.has(x) ? `fyndet ”${fynd.get(x).titel}”` : `ett fynd från ${fyndKalla.get(x) || 'utredningen'}`;
  if (utsaga.has(x)) return `utsagan ”${utsaga.get(x).titel}”`;
  if (tidskort.has(x)) return `tidskortet ”${tidskort.get(x).titel}”`;
  if (dokument.has(x)) return `dokumentet ”${dokument.get(x).titel}”`;
  if (moment.has(x)) return `”${moment.get(x).namn}”`;
  return x;
};
const krav = (lista) => [].concat(lista || []).map(namnPa).join(', ');
const pnamn = (pid) => (person.has(pid) ? person.get(pid).namn : pid);

if (flagga === '--slutsatser') {
  p(`# ${f.meta.titel} – slutsatsfrågor (deduktionstavlan)`);
  p();
  p('Frågorna visas för spelaren när de fynd de bygger på är hittade. Rätt svar visas inte här.');
  for (const s of f.slutsatser || []) {
    p(); p(`## ${s.fraga}`);
    for (const [i, a] of (s.alternativ || []).entries()) p(`${'ABCDEFG'[i]}. ${a.text}`);
  }
  console.log(ut.join('\n'));
  process.exit(0);
}

p(`# ${f.meta.titel}`);
p(); p(`*${f.meta.miljo}, ${f.meta.epok}.* Uppdrag: **${f.meta.mal}**`);
p(); p(`## Inledning – ${f.intro?.rubrik || ''}`); p(); p(f.intro?.text || '');
p(); p('## Personer');
for (const x of f.personer) p(`- **${x.namn}** – ${x.roll}${x.misstankt ? ' *(misstänkt)*' : ''}. ${x.beskrivning || ''}`);

const UTAN = new Set(['id', 'typ', 'pos', 'rot', 'interaktiv', 'modell', 'kollision', 'halo', 'halostorlek', 'avstand', 'funktion', 'gar_till', 'ljus', 'styrka', 'rackvidd', 'flimrar', 'seed', 'skala', 'farg', 'ram', 'y0']);
for (const m of f.moment) {
  const pl = m.payload || {};
  p(); p(`## ${m.namn} (${m.mekanik === 'scen' ? 'plats att undersöka' : 'i anteckningsboken: ' + m.mekanik})`);
  if (m.last_upp_av) p(`*Låst tills spelaren har: ${krav(m.last_upp_av)}.*${m.last_text ? ` Spelaren får höra: ”${m.last_text}”` : ''}`);
  if (pl.instruktion) p(`*Instruktion i spelet:* ${pl.instruktion}`);
  if (pl.rum) {
    const r = pl.rum;
    p(`Rummet är ${r.bredd} × ${r.djup} m${r.hojd ? `, ${r.hojd} m högt` : ''}. Koordinater: x öster (+) / väster (−), z söder (+) / norr (−), y höjd över golvet; rot = vridning i grader (0 = framsidan mot söder). Spelaren börjar vid ${JSON.stringify(r.start?.pos)}.`);
    p(); p('Det som går att undersöka (namn – text spelaren får läsa):');
    for (const o of r.objekt) {
      if (!o.interaktiv && !o.gar_till && !o.funktion) continue;
      if (o.funktion === 'anteckningsbok') continue;
      const ia = o.interaktiv || {};
      const var_ = o.pos ? `vid ${JSON.stringify(o.pos)}` : o.punkter ? `längs ${JSON.stringify(o.punkter)}` : '';
      let rad = `- **${ia.namn || o.typ}** (${o.typ}${var_ ? ', ' + var_ : ''})`;
      if (o.gar_till) rad += ` – dörr till ${namnPa(o.gar_till)}`;
      if (ia.text) rad += `: ${ia.text}`;
      p(rad);
      for (const g of [].concat(ia.ger_fynd || [])) { const x = fynd.get(g); p(`  - Ger fyndet **${x.titel}**: ${x.text}`); }
      for (const g of [].concat(ia.ger_material || ia.material || [])) if (dokument.has(g) || utsaga.has(g)) p(`  - Ger ${namnPa(g)} till anteckningsboken.`);
    }
    const ovrigt = r.objekt.filter((o) => !o.interaktiv && !o.gar_till && !o.funktion);
    if (ovrigt.length) {
      p(); p('Övrigt som syns i rummet:');
      for (const o of ovrigt) {
        const extra = Object.entries(o).filter(([k]) => !UTAN.has(k)).map(([k, v]) => `${k}: ${typeof v === 'string' ? v.replace(/\n/g, ' / ') : JSON.stringify(v)}`).join('; ');
        p(`- ${o.typ} vid ${JSON.stringify(o.pos)}${o.rot ? `, rot ${o.rot}` : ''}${extra ? ` (${extra})` : ''}`);
      }
    }
  }
  for (const u of pl.utsagor || []) p(`- **${pnamn(u.person)} – ${u.titel}**${u.kraver ? ` *(visas först när spelaren har ${krav(u.kraver)})*` : ''}: ”${u.text}”`);
  for (const d of pl.dokument || []) {
    p(); p(`### Dokument: ${d.titel}${d.underrubrik ? ` – ${d.underrubrik}` : ''}${d.stil ? ` *(stil: ${d.stil})*` : ''}${d.kraver ? ` *(visas när spelaren har ${krav(d.kraver)})*` : ''}`);
    for (const s of d.stycken || []) p(`> ${s.text}${s.stil ? `  *[${s.stil}]*` : ''}`.replace(/\n/g, '\n> '));
  }
  if (m.mekanik === 'tidslinje') {
    p(`Tidslinjen går från ${pl.fran} till ${pl.till}. Personer på tidslinjen: ${(pl.personer || []).map(pnamn).join(', ')}.`);
    p(`Platser: ${Object.values(pl.platser || {}).join(', ')}.`);
    p('Gångtider (minuter): ' + (pl.gangtider || []).map(([a, b, t]) => `${pl.platser[a]}–${pl.platser[b]} ${t}`).join('; ') + '.');
    if (pl.brott) p(`Brottet: ${pl.brott.fraga}, ${pl.brott.fran}–${pl.brott.till}${pl.brott.kraver ? ` *(brottstiden visas när spelaren har ${krav(pl.brott.kraver)})*` : ''}.`);
    p(); p('Tidskort (heldragna = oberoende källa, streckade = personens eget påstående):');
    for (const k of pl.kort || []) p(`- **${k.titel}** – ${k.typ === 'pastaende' ? 'streckat (påstående)' : 'heldraget (källa)'}, ${pl.platser[k.plats] || k.plats}, ${k.fran}${k.till && k.till !== k.fran ? `–${k.till}` : ''}. Källa: ${k.kalla}. ${k.text || ''}${k.kraver ? ` *(visas när spelaren har ${krav(k.kraver)})*` : ''}`);
  }
  if (m.mekanik === 'logikrutnat') {
    p(`**${pl.rubrik || ''}**`);
    for (const k of pl.kategorier || []) p(`- ${k.namn}: ${k.varden.map((v) => v.namn).join(', ')}`);
    p(); p('Ledtrådar i rutnätet:');
    for (const l of pl.ledtradar || []) p(`- ${l.id}. ${l.text}`);
    if (pl.ger_fynd_nar_lost) p('*När rutnätet är rätt löst får spelaren ett fynd.*');
  }
  if (m.mekanik === 'bildjamforelse') {
    p('Bilderna (beskrivna med de detaljer som syns på dem):');
    for (const b of [...(pl.bilder || [])].sort((a, c) => a.ordning - c.ordning)) p(`- **${b.titel}** (${b.kort}, tid ${b.tid}, källa: ${b.kalla}, motiv: ${b.motiv}): ${Object.entries(b.varden || {}).map(([k, v]) => `${k} = ${v}`).join(', ')}`);
    p(`Detaljer man kan peka på: ${Object.keys(pl.regioner || {}).join(', ')}.`);
  }
}
p(); p('## Anklagelsen');
p(`Spelaren väljer en av de misstänkta (${f.personer.filter((x) => x.misstankt).map((x) => x.namn).join(', ')}), högst ${f.anklagelse?.bevis_max ?? 3} fynd som bevis${f.anklagelse?.hur_fraga ? ` och svarar på ”${f.anklagelse.hur_fraga}”` : ''}.`);
for (const a of f.anklagelse?.hur_alternativ || []) p(`- ${a.text}`);
console.log(ut.join('\n'));
