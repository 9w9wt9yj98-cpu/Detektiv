// Bildjämförelse: välj två bilder, tryck på det som skiljer dem åt (eller det som är exakt likadant och betyder något).
// Bilderna ritas som SVG utifrån fallets data (motiv + värden), så skillnaderna är exakta och kan kontrolleras.
import { har, fyndMap } from '../motor/fall.js';
import { vagTill, pekarText } from '../motor/vagledning.js';
import { esc, $, $$ } from '../vyer/gemensamt.js';

const REGION_NAMN = { kant: 'kanten', handtag: 'handtaget', skal: 'skålen', tidning: 'tidningen', utsikt: 'utsikten', gardin: 'gardinerna', vas: 'vasen', ljus: 'ljusstaken', person: 'personen', bakgrund: 'bakgrunden' };
const par = (a, b) => [a, b].sort().join('|');
const lika = (a, b) => [...a].sort().join('|') === [...b].sort().join('|');

export function status(m, st) {
  // Räknas per fynd: två upptäckter som ger samma fynd (t.ex. kanten eller handtaget) är alternativa vägar.
  const s = st.mek?.[m.id] || {};
  const ups = m.payload.upptackter || [];
  const mal = [...new Set(ups.filter((u) => u.kravs !== false || !u.ger_fynd).map((u) => u.ger_fynd || u.id))];
  const gjorda = new Set(ups.filter((u) => s.hittade?.includes(u.id)).map((u) => u.ger_fynd || u.id));
  const hittade = mal.filter((x) => gjorda.has(x)).length;
  return { hittade, totalt: mal.length, klar: hittade === mal.length };
}

// ---------- Ritning ----------
function skalSvg(cx, cy, s, v, buckla) {
  // s = skala; (cx, cy) = kantens mitt
  const rx = 90 * s, ry = 20 * s;
  const kropp = `M${cx - rx},${cy} Q${cx},${cy + 120 * s} ${cx + rx},${cy} Z`;
  const fot = `<ellipse cx="${cx}" cy="${cy + 92 * s}" rx="${40 * s}" ry="${9 * s}" fill="#a9a79c"/><rect x="${cx - 18 * s}" y="${cy + 70 * s}" width="${36 * s}" height="${22 * s}" fill="#bdbbb0"/>`;
  const handtag = [-1, 1].map((sx) => `<path d="M${cx + sx * rx},${cy + 4 * s} c${sx * 26 * s},${-4 * s} ${sx * 30 * s},${30 * s} ${sx * 2 * s},${34 * s}" fill="none" stroke="#9c9a90" stroke-width="${7 * s}" stroke-linecap="round"/>
    <path d="M${cx + sx * rx},${cy + 4 * s} c${sx * 26 * s},${-4 * s} ${sx * 30 * s},${30 * s} ${sx * 2 * s},${34 * s}" fill="none" stroke="#e6e4da" stroke-width="${3 * s}" stroke-linecap="round"/>`).join('');
  const S = v.handtag === 'S' ? `<text x="${cx - rx - 17 * s}" y="${cy + 26 * s}" font-size="${16 * s}" font-style="italic" font-family="Georgia,serif" fill="#4a4840" font-weight="700">S</text>` : '';
  const buck = buckla ? `<path d="M${cx + 48 * s},${cy + 17 * s} q${10 * s},${12 * s} ${24 * s},${-2 * s}" fill="none" stroke="#5a584e" stroke-width="${3.5 * s}"/><path d="M${cx + 50 * s},${cy + 15 * s} q${10 * s},${8 * s} ${20 * s},${-3 * s}" fill="none" stroke="#f6f4ea" stroke-width="${1.5 * s}"/>` : '';
  return `<g data-r="skal">${fot}<path d="${kropp}" fill="url(#silver)" stroke="#8a887e" stroke-width="${1.5 * s}"/>
      <path d="M${cx - rx * 0.6},${cy + 20 * s} Q${cx - rx * 0.2},${cy + 70 * s} ${cx + rx * 0.1},${cy + 66 * s}" fill="none" stroke="#fffef6" stroke-width="${4 * s}" opacity=".6"/></g>
    <g data-r="kant"><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#efeee6" stroke="#8a887e" stroke-width="${2 * s}"/><ellipse cx="${cx}" cy="${cy + 2 * s}" rx="${rx - 8 * s}" ry="${ry - 6 * s}" fill="#c9c7bc"/>${buck}
      <ellipse cx="${cx}" cy="${cy + 6 * s}" rx="${rx + 6}" ry="${ry + 12}" fill="transparent"/></g>
    <g data-r="handtag">${handtag}${S}${[-1, 1].map((sx) => `<circle cx="${cx + sx * (rx + 16 * s)}" cy="${cy + 18 * s}" r="${Math.max(16, 26 * s)}" fill="transparent"/>`).join('')}</g>`;
}

function narbild(v) {
  const bak = v.bakgrund === 'sammet'
    ? `<rect width="400" height="300" fill="url(#sammet)"/>`
    : `<rect width="400" height="300" fill="#d8c29c"/>${[40, 95, 150, 205, 260].map((y) => `<path d="M0,${y} C120,${y + 6} 260,${y - 6} 400,${y + 3}" stroke="#b89a6c" stroke-width="2" fill="none" opacity=".6"/>`).join('')}`;
  const tidning = v.tidning === 'dagens'
    ? `<g data-r="tidning" transform="rotate(-7 90 230)"><rect x="12" y="178" width="160" height="112" fill="#efe9da" stroke="#9c9280"/><text x="20" y="200" font-family="Georgia,serif" font-weight="700" font-size="15" fill="#2a2a2a">DALA-DEMOKRATEN</text>
       <text x="20" y="216" font-family="Georgia,serif" font-size="11" fill="#3a3a3a">Fredag 19 juni 2026</text>${[230, 242, 254, 266, 278].map((y) => `<rect x="20" y="${y}" width="${120 + (y % 3) * 10}" height="4" fill="#bdb6a6"/>`).join('')}</g>`
    : v.tidning === 'forsakring'
      ? `<g data-r="tidning"><rect x="16" y="226" width="150" height="56" fill="#f4efe2" stroke="#9c9280"/><text x="26" y="248" font-family="Georgia,serif" font-size="13" fill="#2a2a2a">Försäkringsfoto</text><text x="26" y="268" font-family="Georgia,serif" font-size="11" fill="#4a4a4a">Inv.nr 4471 · maj 2019</text></g>`
      : '';
  return `<g data-r="bakgrund">${bak}</g>${tidning}${skalSvg(245, 120, 1, v, v.kant === 'buckla')}`;
}

function skank(v) {
  const vasX = v.vas === 'h' ? 300 : 100, ljusX = v.vas === 'h' ? 100 : 300;
  const utsikt = v.utsikt === 'dold' ? '' : `<g data-r="utsikt"><rect x="142" y="20" width="116" height="90" fill="#cfe0e6"/><rect x="142" y="70" width="116" height="40" fill="#8aa05a"/>
     ${[150, 176, 232].map((x, i) => `<circle cx="${x}" cy="${66 - i * 2}" r="${9 + i}" fill="#5e7a3a"/>`).join('')}
     ${v.utsikt === 'bil-in' ? `<g><rect x="150" y="86" width="34" height="12" rx="3" fill="#8a2a22"/><rect x="156" y="80" width="20" height="8" rx="2" fill="#6a2018"/><circle cx="157" cy="99" r="3" fill="#222"/><circle cx="178" cy="99" r="3" fill="#222"/><path d="M144,90 h-0 M146,88 h-6 M146,93 h-8" stroke="#fff" stroke-width="1.4"/><rect x="190" y="84" width="2" height="14" fill="#7a6a52"/><rect x="196" y="84" width="2" height="14" fill="#7a6a52"/></g>`
       : v.utsikt === 'kaffebord' ? `<g><ellipse cx="214" cy="94" rx="18" ry="5" fill="#f4f0e6"/><rect x="212" y="94" width="3" height="12" fill="#ddd"/><circle cx="196" cy="82" r="4" fill="#e0b896"/><rect x="192" y="86" width="8" height="14" fill="#5a6a8a"/><circle cx="232" cy="82" r="4" fill="#e8c8a8"/><rect x="228" y="86" width="8" height="14" fill="#a05a6a"/><rect x="240" y="88" width="16" height="7" rx="2" fill="#8a2a22"/></g>` : ''}</g>`;
  const gardin = v.gardin === 'dragen'
    ? `<g data-r="gardin"><rect x="132" y="12" width="136" height="104" fill="#e6dcc2"/>${[146, 162, 178, 194, 210, 226, 242, 258].map((x) => `<path d="M${x},12 v104" stroke="#c9bc9c" stroke-width="2"/>`).join('')}</g>`
    : `<g data-r="gardin"><rect x="122" y="12" width="22" height="108" fill="#e6dcc2"/><rect x="256" y="12" width="22" height="108" fill="#e6dcc2"/><path d="M128,12 v108 M136,12 v108 M262,12 v108 M270,12 v108" stroke="#c9bc9c" stroke-width="2"/></g>`;
  const vas = `<g data-r="vas"><path d="M${vasX - 12},182 q-6,-22 4,-34 h16 q10,12 4,34 z" fill="#3a6a8a"/><path d="M${vasX - 6},150 q6,-6 12,0" stroke="#2a4a6a" stroke-width="3" fill="none"/>
     ${[[-14, -18, '#e8d64a'], [0, -26, '#f2ece0'], [12, -16, '#a34a8a'], [-4, -14, '#c23a2a'], [8, -28, '#e8d64a']].map(([dx, dy, f]) => `<line x1="${vasX}" y1="150" x2="${vasX + dx}" y2="${150 + dy}" stroke="#4c6a2a" stroke-width="2"/><circle cx="${vasX + dx}" cy="${150 + dy}" r="6" fill="${f}"/>`).join('')}
     <circle cx="${vasX}" cy="160" r="30" fill="transparent"/></g>`;
  const ljus = `<g data-r="ljus"><rect x="${ljusX - 3}" y="152" width="6" height="30" fill="#b8893a"/><ellipse cx="${ljusX}" cy="182" rx="12" ry="4" fill="#b8893a"/><rect x="${ljusX - 3}" y="122" width="6" height="30" fill="#f2ead8"/>
     ${v.ljus === 'tand' ? `<ellipse cx="${ljusX}" cy="114" rx="4" ry="8" fill="#ffc24a"/><circle cx="${ljusX}" cy="116" r="14" fill="#ffd27a" opacity=".3"/>` : `<line x1="${ljusX}" y1="122" x2="${ljusX}" y2="116" stroke="#333" stroke-width="1.5"/>`}
     <rect x="${ljusX - 22}" y="104" width="44" height="82" fill="transparent"/></g>`;
  const skalet = v.skal === 'borta'
    ? `<g data-r="skal"><ellipse cx="200" cy="184" rx="22" ry="5" fill="#c9b89a" opacity=".8"/><rect x="160" y="140" width="80" height="48" fill="transparent"/></g>`
    : skalSvg(200, 160, 0.36, v, v.kant === 'buckla');
  const person = v.person === 'olle'
    ? `<g data-r="person"><circle cx="70" cy="140" r="20" fill="#e0b896"/><path d="M50,132 q20,-26 40,0" fill="#5a3a20"/><path d="M34,300 v-110 q0,-26 36,-26 q36,0 36,26 v110 z" fill="#2a3a5a"/>
       <ellipse cx="96" cy="206" rx="34" ry="6" fill="#d8d6cc"/><rect x="70" y="186" width="52" height="20" fill="#f6efe0"/>${[76, 88, 100, 112].map((x) => `<circle cx="${x}" cy="186" r="4" fill="#c22a2a"/>`).join('')}</g>` : '';
  return `<g data-r="bakgrund"><rect width="400" height="300" fill="#e6dcc6"/><rect x="0" y="0" width="400" height="300" fill="url(#rand)" opacity=".25"/></g>
    <rect x="136" y="14" width="128" height="100" fill="#f6f2e8"/>${utsikt}<path d="M200,14 v100 M136,64 h128" stroke="#f6f2e8" stroke-width="4" pointer-events="none"/>${gardin}
    <g data-r="bakgrund"><rect x="60" y="188" width="280" height="112" fill="#7a5030"/><rect x="54" y="182" width="292" height="10" fill="#5a3820"/>${[80, 170, 260].map((x) => `<rect x="${x}" y="204" width="70" height="80" fill="#6a4428" stroke="#4a2e18"/>`).join('')}</g>
    ${vas}${ljus}${skalet}${person}`;
}

const DEFS = `<defs><linearGradient id="silver" x1="0" x2="1"><stop offset="0" stop-color="#8e8c82"/><stop offset=".35" stop-color="#e8e6dc"/><stop offset=".7" stop-color="#b2b0a6"/><stop offset="1" stop-color="#7a786e"/></linearGradient>
  <radialGradient id="sammet" cx=".5" cy=".4" r=".8"><stop offset="0" stop-color="#5a3a4a"/><stop offset="1" stop-color="#1e121a"/></radialGradient>
  <pattern id="rand" width="24" height="24" patternUnits="userSpaceOnUse"><rect width="12" height="24" fill="#c9b48e"/></pattern>
  <filter id="sepia"><feColorMatrix type="matrix" values=".85 .25 .05 0 .02  .2 .78 .1 0 .01  .12 .2 .62 0 0  0 0 0 1 0"/></filter></defs>`;

// Var en markeringsring hamnar för en region.
function ankare(b, r) {
  const v = b.varden;
  if (b.motiv === 'narbild') return { kant: [245, 124, 100], handtag: [140, 140, 30], skal: [245, 170, 80], tidning: [90, 232, 80], bakgrund: [340, 40, 30] }[r];
  const vasX = v.vas === 'h' ? 300 : 100, ljusX = v.vas === 'h' ? 100 : 300;
  return { kant: [200, 162, 40], handtag: [200, 168, 50], skal: [200, 168, 44], vas: [vasX, 150, 36], ljus: [ljusX, 146, 36], gardin: [200, 64, 72], utsikt: [200, 64, 64], person: [80, 190, 56] }[r];
}

export function ritaFoto(b, ringar = []) {
  const inre = b.motiv === 'narbild' ? narbild(b.varden) : skank(b.varden);
  const ring = ringar.map(([r, typ]) => { const a = ankare(b, r); return a ? `<circle class="ring ${typ}" cx="${a[0]}" cy="${a[1]}" r="${a[2]}"/>` : ''; }).join('');
  return `<svg class="foto-svg" viewBox="0 0 400 300" role="img" aria-label="${esc(b.titel)}">${DEFS}<g filter="url(#sepia)">${inre}</g>${ring}</svg>`;
}

// ---------- Jämförelse ----------
/** Vad betyder ett tryck på regionen r i bild X jämfört med bild Y? Ren funktion – används också av testerna. */
export function bedom(p, X, Y, r) {
  let reg = r;
  const vx = X.varden, vy = Y.varden;
  if (['kant', 'handtag'].includes(reg) && (vx.skal === 'borta' || vy.skal === 'borta')) reg = 'skal';
  if (reg === 'skal' && vx.skal !== 'borta' && vy.skal !== 'borta') {
    // Tryck på skålen: titta på det som faktiskt skiljer (eller kanten, om allt är lika)
    reg = vx.kant !== vy.kant ? 'kant' : vx.handtag !== vy.handtag ? 'handtag' : 'kant';
  }
  const a = vx[reg], b = vy[reg];
  if (a === undefined || b === undefined) return { typ: 'ojamforbar', region: reg };
  const traffar = (p.upptackter || []).filter((u) => u.region === reg && lika(u.varden, [a, b]));
  const u = traffar.find((x) => !x.bilder || lika(x.bilder, [X.id, Y.id]));
  if (u) return { typ: 'upptackt', region: reg, u };
  if (traffar.length) return { typ: 'narmare', region: reg, text: traffar[0].narmare };
  if (a === b) return { typ: 'lika', region: reg };
  return { typ: 'oviktig', region: reg, text: p.regioner?.[reg]?.oviktig };
}

export function rendera(sida, m, ctx) {
  const { f, st } = ctx;
  const p = m.payload;
  st.mek[m.id] ||= { hittade: [], oviktiga: [], par: [] };
  const ms = st.mek[m.id];
  ms.oviktiga ||= []; ms.par ||= [];
  const fynd = fyndMap(f);
  const bilder = [...(p.bilder || [])].sort((a, b) => (a.ordning ?? 0) - (b.ordning ?? 0));
  const agda = () => bilder.filter((b) => har(st, b.id));
  let besked = null;

  function rita() {
    const mina = agda();
    ms.par = ms.par.filter((id) => mina.some((b) => b.id === id));
    for (const b of mina) if (ms.par.length < 2 && !ms.par.includes(b.id)) ms.par.push(b.id);
    const [X, Y] = ms.par.map((id) => bilder.find((b) => b.id === id));
    const s0 = status(m, st);
    const ej = bilder.filter((b) => !har(st, b.id));
    const pekare = ej.length ? vagTill(f, st, ej[0].id) : null;
    const ringar = (B, O) => {
      if (!B || !O) return [];
      const k = par(B.id, O.id), ut = [];
      for (const u of p.upptackter || []) if (ms.hittade.includes(u.id) && (ms.ringar?.[k] || []).includes(u.region)) ut.push([u.region, 'viktig']);
      for (const o of ms.oviktiga) { const [kk, r] = o.split('#'); if (kk === k) ut.push([r, 'oviktig']); }
      return ut;
    };
    const hittade = (p.upptackter || []).filter((u) => ms.hittade.includes(u.id) && u.text);
    sida.innerHTML = `<div class="bildjamf">
      <p class="instruktion">${esc(p.instruktion || 'Välj två bilder. Tryck på något som skiljer dem åt – eller på något som är exakt likadant och betyder något. Fel tryck kostar ingenting.')}</p>
      <p class="jf-status">Viktiga upptäckter: <strong>${s0.hittade} av ${s0.totalt}</strong>${s0.klar ? ' ✓' : ''}${ms.oviktiga.length ? ` · ${ms.oviktiga.length} oviktiga skillnader sorterade bort` : ''}</p>
      <div class="bj-remsa">${mina.map((b) => `<button class="bj-tumme ${ms.par.includes(b.id) ? 'vald' : ''}" data-bild="${b.id}"><span class="bj-tid">${esc(b.tid)}</span><span>${esc(b.kort || b.titel)}</span></button>`).join('')}</div>
      ${ej.length ? `<p class="jf-okand">${ej.length} ${ej.length === 1 ? 'bild' : 'bilder'} till finns hos någon på platsen.${pekare ? ' ' + esc(pekarText(pekare)) : ''}</p>` : ''}
      ${mina.length < 2 ? '<p class="tomt">Du behöver minst två bilder för att jämföra. Fråga gästerna – och leta efter fler.</p>' : `
      ${[X, Y].map((B, i) => `<figure class="bj-foto" data-i="${i}"><div class="bj-ram">${ritaFoto(B, ringar(B, i ? X : Y))}</div><figcaption><strong>${esc(B.tid)}</strong> · ${esc(B.titel)}${B.kalla ? ` <em>(${esc(B.kalla)})</em>` : ''}</figcaption></figure>`).join(`<div class="bj-besked-ruta ${besked ? 'aktiv' : ''}">${besked ? `<p class="jf-besked ${besked.ok ? 'ok' : besked.neutral ? 'neutral' : 'fel'}">${esc(besked.text)}</p>` : '<p class="jf-besked neutral">↕ Tryck på en detalj i någon av bilderna.</p>'}</div>`)}`}
      ${hittade.length ? `<ul class="jf-hittade">${hittade.map((u) => `<li><strong>Upptäckt:</strong> ${esc(u.text)}${u.ger_fynd && fynd[u.ger_fynd] ? ` <span class="fyndchip">${esc(fynd[u.ger_fynd].ikon || '')} ${esc(fynd[u.ger_fynd].titel)}</span>` : ''}</li>`).join('')}</ul>` : ''}
    </div>`;
    $$('[data-bild]', sida).forEach((k) => k.onclick = () => {
      const id = k.dataset.bild;
      if (ms.par.includes(id)) return;
      ms.par = [ms.par[1] || ms.par[0], id].filter(Boolean).slice(-2);
      besked = null; ctx.spara(); rita();
    });
    $$('.bj-foto', sida).forEach((fig) => fig.querySelector('svg').addEventListener('click', (e) => {
      const g = e.target.closest('[data-r]');
      if (!g || !X || !Y) return;
      const i = +fig.dataset.i;
      tryck(i ? Y : X, i ? X : Y, g.dataset.r);
    }));
  }

  function tryck(B, O, r) {
    const res = bedom(p, B, O, r);
    const namn = REGION_NAMN[res.region] || res.region;
    const k = par(B.id, O.id);
    if (res.typ === 'upptackt') {
      const u = res.u;
      ms.ringar ||= {}; (ms.ringar[k] ||= []).includes(u.region) || ms.ringar[k].push(u.region);
      if (ms.hittade.includes(u.id)) besked = { ok: true, text: 'Den upptäckten har du redan gjort.' };
      else {
        ms.hittade.push(u.id);
        besked = { ok: true, text: u.text };
        ctx.spara();
        if (u.ger_fynd) ctx.geFynd(u.ger_fynd);
      }
    } else if (res.typ === 'oviktig') {
      const nyckel = k + '#' + res.region;
      if (!ms.oviktiga.includes(nyckel)) ms.oviktiga.push(nyckel);
      besked = { neutral: true, text: res.text || `En skillnad i ${namn} – men den verkar inte betyda något för fallet.` };
    } else if (res.typ === 'narmare') besked = { neutral: true, text: res.text || 'Något har ändrats här. Jämför med en bild som ligger närmare i tid.' };
    else if (res.typ === 'lika') besked = { ok: false, text: p.regioner?.[res.region]?.lika || `Ingen skillnad i ${namn} mellan de här två bilderna.` };
    else besked = { ok: false, text: `Det går inte att jämföra ${namn} – den syns bara på en av bilderna.` };
    ctx.spara();
    const y = sida.scrollTop;
    rita();
    sida.scrollTop = y;
  }
  rita();
}
