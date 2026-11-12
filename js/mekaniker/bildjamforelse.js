// Bildjämförelse: välj två bilder, tryck på det som skiljer dem åt (eller det som är exakt likadant och betyder något).
// Bilderna ritas som SVG utifrån fallets data (motiv + värden), så skillnaderna är exakta och kan kontrolleras.
import { har, fyndMap } from '../motor/fall.js';
import { vagTill, pekarText } from '../motor/vagledning.js';
import { esc, $, $$ } from '../vyer/gemensamt.js';

const REGION_NAMN = { kant: 'kanten', handtag: 'handtaget', skal: 'skålen', tidning: 'tidningen', utsikt: 'utsikten', gardin: 'gardinerna', vas: 'vasen', ljus: 'ljusstaken', person: 'personen', bakgrund: 'bakgrunden',
  remsa: 'förseglingsremsan', ved: 'vedlåren', lampa: 'lampan', klocka: 'väggklockan' };
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
  const S = v.handtag === 'S' ? `<text x="${cx - rx - 17 * s}" y="${cy + 26 * s}" font-size="${16 * s}" font-style="italic" font-family="Georgia,serif" fill="#4a4840" stroke="#e8e6dc" stroke-width="${2.5 * s}" paint-order="stroke" font-weight="700">S</text>` : '';
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
  // Vasen och ljusstaken ser ut som i 3D-salen: ljus porslinsvas med röda blommor, trearmad ljusstake i mässing.
  const vas = `<g data-r="vas"><path d="M${vasX - 12},182 q-6,-22 4,-34 h16 q10,12 4,34 z" fill="#e4dccb" stroke="#a89c84" stroke-width="1.5"/><path d="M${vasX - 6},150 q6,-6 12,0" stroke="#a89c84" stroke-width="3" fill="none"/>
     ${[[-14, -18, '#a33b2a'], [0, -26, '#c23a2a'], [12, -16, '#8e2f22'], [-4, -14, '#b8402e'], [8, -28, '#a33b2a']].map(([dx, dy, f]) => `<line x1="${vasX}" y1="150" x2="${vasX + dx}" y2="${150 + dy}" stroke="#4c6a2a" stroke-width="2"/><circle cx="${vasX + dx}" cy="${150 + dy}" r="6" fill="${f}"/>`).join('')}
     <circle cx="${vasX}" cy="160" r="30" fill="transparent"/></g>`;
  const ljusen = [[-15, 126], [0, 120], [15, 126]]; // [dx, överkant] för de tre ljusen
  const ljus = `<g data-r="ljus"><rect x="${ljusX - 3}" y="150" width="6" height="32" fill="#b8893a"/><ellipse cx="${ljusX}" cy="182" rx="12" ry="4" fill="#b8893a"/><rect x="${ljusX - 18}" y="147" width="36" height="4" fill="#b8893a"/>
     ${ljusen.map(([dx, y]) => `<rect x="${ljusX + dx - 3}" y="${y}" width="6" height="${147 - y}" fill="#f2ead8"/>${v.ljus === 'tand'
       ? `<ellipse cx="${ljusX + dx}" cy="${y - 7}" rx="3.5" ry="7" fill="#ffc24a"/><circle cx="${ljusX + dx}" cy="${y - 5}" r="11" fill="#ffd27a" opacity=".3"/>`
       : `<line x1="${ljusX + dx}" y1="${y}" x2="${ljusX + dx}" y2="${y - 6}" stroke="#333" stroke-width="1.5"/>`}`).join('')}
     <rect x="${ljusX - 24}" y="100" width="48" height="86" fill="transparent"/></g>`;
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

// ---------- Motiv: ritkontoret (fall 11) ----------
// En svartvit översiktsbild av ett ritkontor: fönster med mörkläggningsgardin, väggklocka, kamin med vedlår,
// ritbord med lampa, ett litet kopiebord och ritningsskåpet med åtta lådor – låda 7 är förseglad med en pappersremsa.
// varden: remsa (vanster | hoger | bruten), ved (tom | full), gardin (uppe | nere; utsikten bakom hör till gardinen),
//         lampa (ritbord | kopiebord), klocka ("09.15"), person (ingen | ritare | besok | ingenjor).
function ritkontor(v) {
  const [tim, min] = String(v.klocka || '12.00').split('.').map(Number);
  const visare = (grader, l, w) => { const a = (grader - 90) * Math.PI / 180; return `<line x1="205" y1="52" x2="${(205 + Math.cos(a) * l).toFixed(1)}" y2="${(52 + Math.sin(a) * l).toFixed(1)}" stroke="#1c1c1c" stroke-width="${w}" stroke-linecap="round"/>`; };
  const klocka = `<g data-r="klocka"><circle cx="205" cy="52" r="20" fill="#2e2e2e"/><circle cx="205" cy="52" r="17" fill="#ecebe6"/>
    ${[0, 3, 6, 9].map((i) => { const a = (i * 30 - 90) * Math.PI / 180; return `<circle cx="${(205 + Math.cos(a) * 14).toFixed(1)}" cy="${(52 + Math.sin(a) * 14).toFixed(1)}" r="1.4" fill="#333"/>`; }).join('')}
    ${visare(((tim % 12) + min / 60) * 30, 9, 2.6)}${visare(min * 6, 14, 1.6)}<circle cx="205" cy="52" r="24" fill="transparent"/></g>`;
  const utsikt = v.gardin === 'nere' ? '' : `<g data-r="gardin"><rect x="44" y="34" width="104" height="92" fill="#d9d9d4"/><rect x="44" y="104" width="104" height="22" fill="#f1f1ee"/>
    <path d="M84,104 L96,52 L108,104 M88,86 h16 M91,70 h10" stroke="#3c3c3c" stroke-width="2.5" fill="none"/><circle cx="96" cy="50" r="7" fill="none" stroke="#3c3c3c" stroke-width="2.5"/>
    <rect x="112" y="92" width="26" height="12" fill="#6a6a6a"/>${[52, 66, 124, 140, 74, 132].map((x, i) => `<circle cx="${x}" cy="${44 + (i * 17) % 50}" r="1.3" fill="#fff"/>`).join('')}</g>`;
  const gardin = v.gardin === 'nere'
    ? `<g data-r="gardin"><rect x="42" y="28" width="108" height="100" fill="#262626"/><rect x="42" y="124" width="108" height="5" fill="#4a4a4a"/><circle cx="96" cy="134" r="3" fill="none" stroke="#3a3a3a" stroke-width="1.5"/><rect x="42" y="28" width="108" height="100" fill="transparent"/></g>`
    : `<g data-r="gardin"><rect x="42" y="27" width="108" height="9" rx="4" fill="#2e2e2e"/><line x1="96" y1="36" x2="96" y2="46" stroke="#3a3a3a" stroke-width="1"/><circle cx="96" cy="48" r="2.5" fill="none" stroke="#3a3a3a" stroke-width="1.2"/><rect x="42" y="22" width="108" height="20" fill="transparent"/></g>`;
  const fonster = `<rect x="38" y="24" width="116" height="108" fill="#f4f4f0"/>${utsikt}<path d="M96,34 v92 M44,80 h104" stroke="#f4f4f0" stroke-width="4" pointer-events="none"/><rect x="34" y="130" width="124" height="6" fill="#bdbdb6"/>${gardin}`;
  // Kamin och vedlår
  const ved = `<g data-r="ved"><path d="M52,236 h44 l-3,36 h-38 z" fill="#8a8a82" stroke="#4a4a46" stroke-width="1.5"/>
    ${v.ved === 'full' ? [[58, 232], [70, 229], [82, 233], [64, 224], [77, 223]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="7" ry="5" fill="#c9c6b8" stroke="#55534a" stroke-width="1.2"/><circle cx="${x}" cy="${y}" r="2" fill="#77746a"/>`).join('') : `<path d="M54,238 h40 l-2,8 h-36 z" fill="#3a3a38"/>`}
    <rect x="46" y="212" width="56" height="64" fill="transparent"/></g>`;
  const kamin = `<g data-r="bakgrund"><rect x="12" y="178" width="34" height="92" rx="4" fill="#2a2a2a"/><rect x="18" y="232" width="22" height="18" fill="#141414" stroke="#555"/><rect x="24" y="0" width="9" height="180" fill="#333"/><rect x="8" y="270" width="42" height="6" fill="#444"/></g>${ved}`;
  // Ritbord (lutande skiva på bock) och kopiebordet intill
  const ritbord = `<g data-r="bakgrund"><path d="M112,236 L128,170 L226,170 L214,236 Z" fill="#b9b7ae" stroke="#55534c" stroke-width="2"/><path d="M130,224 L142,180 L206,180 L198,224 Z" fill="#efeee8"/>
    <path d="M146,214 L190,214 M150,204 L186,204 M154,194 L182,194" stroke="#8d8b84" stroke-width="1.2"/><path d="M120,236 v40 M208,236 v40 M120,262 h88" stroke="#4a4842" stroke-width="4"/>
    <rect x="238" y="214" width="46" height="5" fill="#5e5c56"/><path d="M242,219 v57 M280,219 v57" stroke="#4a4842" stroke-width="3.5"/></g>`;
  // Stolen framför ritbordet, som i rummet; i morgonbilden sitter ritaren på den
  const stol = v.person === 'ritare' ? '' : `<g data-r="bakgrund"><path d="M150,276 v-34 h30 v34 M150,252 h30" stroke="#4a4842" stroke-width="3.5" fill="none"/><path d="M152,242 v-30 M178,242 v-30 M152,216 h26 M152,226 h26" stroke="#4a4842" stroke-width="3" fill="none"/></g>`;
  const mot = v.lampa === 'kopiebord';
  const lampa = `<g data-r="lampa"><path d="M228,170 L${mot ? '238,138 L256,150' : '214,136 L186,146'}" stroke="#2c2c2c" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="${mot ? 'M246,146 l20,2 l-4,14 l-22,-6 z' : 'M196,142 l-20,2 l4,14 l22,-6 z'}" fill="#3a3a3a"/>
    ${mot ? '<path d="M244,160 l-4,54 h44 l-20,-50 z" fill="#fffbe0" opacity=".55"/>' : ''}<circle cx="${mot ? 250 : 196}" cy="150" r="24" fill="transparent"/><circle cx="228" cy="168" r="5" fill="#2c2c2c"/></g>`;
  // Ritningsskåpet: åtta lådor, numrerade uppifrån. Låda 7 har remsan över springan mot skåpets sida.
  const X0 = 292, B = 98, Y0 = 118, LH = 19;
  const lador = Array.from({ length: 8 }, (_, i) => { const y = Y0 + 6 + i * LH, ajar = i === 6 && v.remsa === 'bruten';
    return `<rect x="${X0 + 5}" y="${y + (ajar ? 3 : 0)}" width="${B - 10}" height="${LH - 3}" fill="${ajar ? '#d6d4cb' : '#c4c2b8'}" stroke="#5a5852" stroke-width="1.2"/>${ajar ? `<rect x="${X0 + 5}" y="${y}" width="${B - 10}" height="3" fill="#1e1e1e"/>` : ''}
      <rect x="${X0 + B / 2 - 9}" y="${y + 6 + (ajar ? 3 : 0)}" width="18" height="4" rx="2" fill="#4a4842"/><text x="${X0 + 11}" y="${y + 12 + (ajar ? 3 : 0)}" font-size="8" font-family="Georgia,serif" fill="#3a3832">${i + 1}</text>`; }).join('');
  const ry = Y0 + 6 + 6 * LH;
  const remsaRit = v.remsa === 'bruten'
    ? `<path d="M${X0 + 60},${ry - 11} l17,1 l-3,9 l-13,-3 z M${X0 + 62},${ry + 8} l14,-3 l3,11 l-17,1 z" fill="#ffffff" stroke="#3a3832" stroke-width="1.6"/>`
    : `<rect x="${X0 + (v.remsa === 'vanster' ? 21 : 61)}" y="${ry - 11}" width="18" height="22" fill="#ffffff" stroke="#3a3832" stroke-width="1.6"/><path d="M${X0 + (v.remsa === 'vanster' ? 25 : 65)},${ry + 2} q5,-6 10,0" stroke="#3a3832" stroke-width="1.3" fill="none"/>`;
  const skap = `<g data-r="bakgrund"><rect x="${X0}" y="${Y0}" width="${B}" height="${8 * LH + 12}" fill="#9d9b92" stroke="#4a4842" stroke-width="2"/>${lador}<rect x="${X0 + 6}" y="${Y0 + 8 * LH + 12}" width="6" height="8" fill="#4a4842"/><rect x="${X0 + B - 12}" y="${Y0 + 8 * LH + 12}" width="6" height="8" fill="#4a4842"/></g>
    <g data-r="remsa">${remsaRit}<rect x="${X0 + 2}" y="${ry - 10}" width="${B - 4}" height="${LH + 16}" fill="transparent"/></g>`;
  // Personer i bild
  const man = (x, rock, hatt) => `<circle cx="${x}" cy="128" r="11" fill="#d8d6cc"/>${hatt ? `<rect x="${x - 13}" y="113" width="26" height="6" fill="#222"/><rect x="${x - 8}" y="104" width="16" height="10" fill="#222"/>` : `<path d="M${x - 11},126 q11,-18 22,0" fill="#3a3a3a"/>`}<path d="M${x - 19},276 v-112 q0,-20 19,-20 q19,0 19,20 v112 z" fill="${rock}"/>`;
  const person = v.person === 'ritare' ? `<g data-r="person"><circle cx="150" cy="152" r="10" fill="#dcdad0"/><path d="M140,150 q10,-20 20,-2 q4,8 -2,10 q-8,-14 -18,-8" fill="#4a4a4a"/><path d="M132,276 v-92 q0,-18 18,-18 q18,0 18,18 v92 z" fill="#6e6e6a"/><path d="M162,190 l22,14" stroke="#6e6e6a" stroke-width="8" stroke-linecap="round"/></g>`
    : v.person === 'besok' ? `<g data-r="person">${man(232, '#3c3c3c', false)}${man(268, '#1e1e1e', false)}<path d="M252,150 q16,-8 32,0 l-4,12 q-12,-6 -24,0 z" fill="#5a5a55"/></g>`
    : v.person === 'ingenjor' ? `<g data-r="person">${man(262, '#55554f', false)}<path d="M278,176 l22,38" stroke="#55554f" stroke-width="8" stroke-linecap="round"/></g>` : '';
  return `<g data-r="bakgrund"><rect width="400" height="300" fill="#cfcfc8"/><rect y="276" width="400" height="24" fill="#77756e"/><rect y="272" width="400" height="5" fill="#5e5c56"/></g>
    ${fonster}${klocka}${kamin}${skap}${ritbord}${stol}${lampa}${person}`;
}

const DEFS = `<defs><linearGradient id="silver" x1="0" x2="1"><stop offset="0" stop-color="#8e8c82"/><stop offset=".35" stop-color="#e8e6dc"/><stop offset=".7" stop-color="#b2b0a6"/><stop offset="1" stop-color="#7a786e"/></linearGradient>
  <radialGradient id="sammet" cx=".5" cy=".4" r=".8"><stop offset="0" stop-color="#5a3a4a"/><stop offset="1" stop-color="#1e121a"/></radialGradient>
  <pattern id="rand" width="24" height="24" patternUnits="userSpaceOnUse"><rect width="12" height="24" fill="#c9b48e"/></pattern>
  <filter id="sepia"><feColorMatrix type="matrix" values=".85 .25 .05 0 .02  .2 .78 .1 0 .01  .12 .2 .62 0 0  0 0 0 1 0"/></filter></defs>`;

// Var en markeringsring hamnar för en region.
function ankare(b, r) {
  const v = b.varden;
  if (b.motiv === 'ritkontor') return { remsa: [v.remsa === 'vanster' ? 322 : 362, 240, 24], ved: [74, 244, 30], gardin: [96, v.gardin === 'nere' ? 78 : 34, v.gardin === 'nere' ? 56 : 30], lampa: [v.lampa === 'kopiebord' ? 252 : 194, 152, 28], klocka: [205, 52, 26], person: [v.person === 'ritare' ? 150 : 250, 190, 50] }[r];
  if (b.motiv === 'narbild') return { kant: [245, 124, 100], handtag: [140, 140, 30], skal: [245, 170, 80], tidning: [90, 232, 80], bakgrund: [340, 40, 30] }[r];
  const vasX = v.vas === 'h' ? 300 : 100, ljusX = v.vas === 'h' ? 100 : 300;
  return { kant: [200, 162, 40], handtag: [200, 168, 50], skal: [200, 168, 44], vas: [vasX, 150, 36], ljus: [ljusX, 146, 36], gardin: [200, 64, 72], utsikt: [200, 64, 64], person: [80, 190, 56] }[r];
}

export function ritaFoto(b, ringar = []) {
  const inre = b.motiv === 'ritkontor' ? ritkontor(b.varden) : b.motiv === 'narbild' ? narbild(b.varden) : skank(b.varden);
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
  // regioner[r].narmare: regionen är alltid viktig – en skillnad som inte är en upptäckt ska jämföras närmare i tid, inte sorteras bort
  if (p.regioner?.[reg]?.narmare) return { typ: 'narmare', region: reg, text: p.regioner[reg].narmare };
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
      ${mina.length < 2 ? `${X ? `<figure class="bj-foto ensam" data-i="0"><div class="bj-ram">${ritaFoto(X, [])}</div><figcaption><strong>${esc(X.tid)}</strong> · ${esc(X.titel)}${X.kalla ? ` <em>(${esc(X.kalla)})</em>` : ''}</figcaption></figure>` : ''}<p class="tomt">${X ? 'Du behöver en bild till för att kunna jämföra.' : 'Du behöver minst två bilder för att jämföra.'} Fråga gästerna – och leta efter fler.</p>` : `
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
