// Slottet: biljardbord, väggtelefon, telefonväxel, rustning, flygel, notställ, kakelugn, pelare, gobeläng,
// balustrad, slottsfasad, fyrverkeri och kandelaber.
// Konventioner: se foremal/grund.js. Väggföremålen (vaggtelefon, telefonvaxel, gobelang) har origo i väggplanet
// och sticker ut mot +z; slottsfasaden har sin fasadyta i z = 0 och huskroppen bakåt (−z).
import * as THREE from '../../../vendor/three/three.module.min.js';
import * as T from '../texturer.js';
import { prefabs, mat, box, cyl, sph, plan, kapsel, massing, flamma, MORKTRA, MAHOGNY } from './grund.js';

const nyans = (farg, f) => '#' + new THREE.Color(farg).multiplyScalar(f).getHexString();
function slump(seed) { let s = seed >>> 0 || 1; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
const UPP = new THREE.Vector3(0, 1, 0);
const V = (x, y, z) => new THREE.Vector3(x, y, z);

/** Rak stång mellan två punkter. */
function stav(g, a, b, r, m, s = 6) {
  const v = new THREE.Vector3().subVectors(b, a);
  const me = new THREE.Mesh(new THREE.CylinderGeometry(r, r, v.length(), s), m);
  me.position.copy(a).addScaledVector(v, 0.5);
  me.quaternion.setFromUnitVectors(UPP, v.normalize());
  g.add(me); return me;
}
/** Böjlig sladd eller arm genom punkterna [[x, y, z], …]. */
function slang(g, punkter, r, m) {
  const kurva = new THREE.CatmullRomCurve3(punkter.map(([x, y, z]) => new THREE.Vector3(x, y, z)));
  const me = new THREE.Mesh(new THREE.TubeGeometry(kurva, punkter.length * 6, r, 6), m);
  g.add(me); return me;
}
function ring(g, R, r, m, x, y, z, rx = 0, ry = 0, bage = Math.PI * 2) {
  const me = new THREE.Mesh(new THREE.TorusGeometry(R, r, 6, 16, bage), m);
  me.position.set(x, y, z); me.rotation.set(rx, ry, 0); g.add(me); return me;
}
/** Cylinder som ligger längs x- eller z-axeln (toppradien rt mot +x respektive +z). */
function liggande(g, rt, rb, l, m, x, y, z, axel = 'x', s = 10) {
  const me = cyl(g, rt, rb, l, m, x, y, z, s);
  if (axel === 'x') me.rotation.z = -Math.PI / 2; else me.rotation.x = Math.PI / 2;
  return me;
}
/** Svarvad form: profil [[radie, höjd], …] nerifrån och upp, roterad runt y-axeln. */
function svarv(g, profil, m, x = 0, y = 0, z = 0, s = 12, sr = 1, sy = 1) {
  const me = new THREE.Mesh(new THREE.LatheGeometry(profil.map(([r, h]) => new THREE.Vector2(r * sr, h * sy)), s), m);
  me.position.set(x, y, z); g.add(me); return me;
}
const SNO = () => mat('#eef2f6', { emissive: '#1a1e26', glans: 0.5 });

/**
 * Biljardbord med grönt kläde, sex hål med mässingsringar, pärlemormarkeringar på vallarna och sex svarvade ben.
 * storlek [bredd, höjd, djup] ([2,6, 0,8, 1,4]) – höjden till vallarnas ovansida; farg (trä, mahogny).
 * kulor (true): tre karambolkulor på duken. ko (true): en kö som ligger på duken, och en krita på vallen.
 */
function biljardbord(d) {
  const g = new THREE.Group();
  const [W, H, D] = d.storlek || [2.6, 0.8, 1.4];
  const tra = mat(d.farg || MAHOGNY, { glans: 0.35 }), mork = mat(nyans(d.farg || MAHOGNY, 0.6), { glans: 0.4 });
  const klade = mat('#ffffff', { map: T.kladet(), glans: 0.95 }), svart = mat('#0a0806');
  const R = 0.13, yt = H - 0.05; // vallarnas bredd och dukens yta
  const iw = W / 2 - R, id = D / 2 - R; // spelytans halva bredd och djup
  box(g, W - 0.06, 0.2, D - 0.06, tra, 0, H - 0.17, 0); // sargen
  box(g, W - 0.02, 0.03, D - 0.02, mork, 0, H - 0.285, 0);
  box(g, W - 2 * R + 0.02, 0.04, D - 2 * R + 0.02, klade, 0, yt - 0.02, 0); // duken på skifferplattan
  // Vallarna: träram ytterst och klädda gummivallar innerst, avbrutna vid hålen
  const rb = R - 0.04;
  for (const s of [-1, 1]) {
    box(g, W, 0.05, rb, tra, 0, H - 0.025, s * (D / 2 - rb / 2));
    box(g, rb, 0.05, D - 2 * rb, tra, s * (W / 2 - rb / 2), H - 0.025, 0);
    for (const a of [-1, 1]) box(g, iw - 0.15, 0.035, 0.04, klade, a * (iw / 2 + 0.035), yt + 0.0175, s * (id + 0.02));
    box(g, 0.04, 0.035, 2 * id - 0.16, klade, s * (iw + 0.02), yt + 0.0175, 0);
  }
  // Hålen
  const hal = [[-1, -1], [0, -1], [1, -1], [-1, 1], [0, 1], [1, 1]];
  for (const [hx, hz] of hal) {
    const x = hx * (iw + 0.02), z = hz * (id + (hx === 0 ? 0.03 : 0.02));
    cyl(g, 0.068, 0.068, 0.012, massing(), x, H + 0.002, z, 14);
    cyl(g, 0.055, 0.055, 0.07, svart, x, H - 0.023, z, 14);
    sph(g, 0.075, mat('#3a2418'), x + hx * 0.03, H - 0.27, z + hz * 0.03, 8).scale.y = 0.8; // nät av läder under hålet
  }
  // Markeringar av pärlemor på vallarna
  const parl = mat('#efe6d0', { glans: 0.2 });
  for (const s of [-1, 1]) {
    for (const a of [-1, 1]) for (const f of [0.25, 0.5, 0.75]) sph(g, 0.009, parl, a * f * iw, H + 0.001, s * (D / 2 - rb / 2), 6).scale.y = 0.3;
    for (const f of [-0.5, 0, 0.5]) sph(g, 0.009, parl, s * (W / 2 - rb / 2), H + 0.001, f * id, 6).scale.y = 0.3;
  }
  // Svarvade ben
  const Lh = H - 0.285;
  const ben = [[0.05, 0], [0.066, 0.02], [0.06, 0.06], [0.045, 0.1], [0.05, 0.2], [0.08, 0.38], [0.085, 0.5], [0.06, 0.62], [0.044, 0.7], [0.05, 0.82], [0.06, 0.9], [0.06, 1]];
  for (const bx of [-1, 0, 1]) for (const bz of [-1, 1]) {
    const x = bx * (W / 2 - 0.2), z = bz * (D / 2 - 0.17);
    svarv(g, ben, tra, x, 0, z, 10, 1, Lh);
    box(g, 0.13, 0.05, 0.13, tra, x, Lh - 0.02, z);
  }
  if (d.kulor !== false) {
    for (const [x, z, f] of [[-0.62, 0.16, '#f2ead6'], [0.3, -0.06, '#e8d898'], [0.58, 0.12, '#a8201a']]) sph(g, 0.031, mat(f, { glans: 0.12 }), x * W / 2.6, yt + 0.031, z * D / 1.4, 12);
  }
  if (d.ko !== false) {
    // Kön ligger på duken med spetsen åt +x: mörk handtagsdel, mässingsring, ljus lönnskaft och blå läderspets
    const k = new THREE.Group(); k.position.set(-0.05, yt + 0.016, -0.38 * D / 1.4); k.rotation.y = -0.08; g.add(k);
    liggande(k, 0.0145, 0.017, 0.48, mat('#3a1a10', { glans: 0.3 }), -0.47, 0, 0);
    liggande(k, 0.0148, 0.0148, 0.012, massing(), -0.226, 0, 0);
    liggande(k, 0.0068, 0.0142, 0.94, mat('#d8b888', { glans: 0.35 }), 0.25, 0, 0);
    liggande(k, 0.0068, 0.0068, 0.012, mat('#efe8d8'), 0.725, 0, 0, 'x', 8);
    liggande(k, 0.0066, 0.0066, 0.01, mat('#3a5a8a'), 0.736, 0, 0, 'x', 8);
    box(g, 0.022, 0.022, 0.022, mat('#3a5a8a'), W / 2 - 0.45, H + 0.011, D / 2 - rb / 2); // krita
  }
  return { grupp: g, haloPos: new THREE.Vector3(0, H + 0.3, 0) };
}

/**
 * Väggtelefon från 1910-talet: ekåda på en bakbräda med vev på höger sida, två klockor upptill, mikrofon i en tratt
 * och hörlur på en gaffel på vänster sida, och en liten pulpet under. Väggföremål: origo i väggplanet, lådan sticker
 * ut ca 0,25 m mot +z. y0 (1,1): bakbrädans underkant; lådans mitt hamnar på y0 + 0,36.
 * luren_av (false): luren hänger i sin sladd med hörluren 0,37 m över golvet och gaffeln står tom. farg (trä).
 */
function vaggtelefon(d) {
  const g = new THREE.Group();
  const y0 = d.y0 ?? 1.1;
  const ek = mat(d.farg || '#6a4424', { glans: 0.4 }), mork = mat(nyans(d.farg || '#6a4424', 0.55), { glans: 0.4 });
  const svart = mat('#141212', { glans: 0.25 }), nickel = mat('#b8b8b0', { glans: 0.2, metall: 0.8 }), sladd = mat('#3a2a20');
  box(g, 0.3, 0.74, 0.025, mork, 0, y0 + 0.37, 0.0125); // bakbräda
  // Lådan med lock och fält på luckan
  box(g, 0.24, 0.3, 0.14, ek, 0, y0 + 0.36, 0.095);
  box(g, 0.26, 0.025, 0.155, mork, 0, y0 + 0.522, 0.1);
  box(g, 0.26, 0.02, 0.155, mork, 0, y0 + 0.2, 0.1);
  box(g, 0.18, 0.22, 0.008, mork, 0, y0 + 0.36, 0.168);
  box(g, 0.16, 0.2, 0.006, ek, 0, y0 + 0.36, 0.172);
  box(g, 0.07, 0.016, 0.004, massing(), 0, y0 + 0.44, 0.176); // namnbricka
  // Klockorna med hammare emellan
  box(g, 0.2, 0.022, 0.03, mork, 0, y0 + 0.64, 0.04);
  for (const sx of [-1, 1]) sph(g, 0.046, massing(), sx * 0.062, y0 + 0.64, 0.07, 14).scale.z = 0.55;
  stav(g, V(0, y0 + 0.555, 0.05), V(0, y0 + 0.64, 0.085), 0.004, nickel);
  sph(g, 0.009, nickel, 0, y0 + 0.645, 0.087, 6);
  // Veven på höger sida
  liggande(g, 0.008, 0.008, 0.05, nickel, 0.145, y0 + 0.39, 0.1, 'x', 8);
  box(g, 0.012, 0.1, 0.014, nickel, 0.17, y0 + 0.345, 0.1);
  liggande(g, 0.011, 0.011, 0.055, svart, 0.198, y0 + 0.3, 0.1, 'x', 8);
  // Mikrofonen: arm från luckan och en svart tratt mot den som talar
  liggande(g, 0.009, 0.009, 0.06, nickel, 0, y0 + 0.4, 0.2, 'z', 8);
  sph(g, 0.032, svart, 0, y0 + 0.4, 0.235, 10).scale.z = 0.7;
  const tratt = cyl(g, 0.045, 0.016, 0.06, svart, 0, y0 + 0.41, 0.275, 14); tratt.rotation.x = Math.PI / 2 - 0.22;
  const mun = cyl(g, 0.038, 0.038, 0.004, mat('#050404'), 0, y0 + 0.417, 0.305, 14); mun.rotation.x = Math.PI / 2 - 0.22;
  // Pulpeten under lådan
  box(g, 0.3, 0.018, 0.13, mork, 0, y0 + 0.07, 0.075, 0.15, 0, 0);
  for (const sx of [-1, 1]) box(g, 0.015, 0.07, 0.1, mork, sx * 0.12, y0 + 0.03, 0.06, -0.5, 0, 0);
  // Gaffeln på vänster sida
  liggande(g, 0.007, 0.007, 0.05, nickel, -0.145, y0 + 0.45, 0.09, 'x', 8);
  const lyft = d.luren_av ? 0.035 : 0; // tom gaffel fjädrar upp
  for (const sz of [-1, 1]) box(g, 0.012, 0.035, 0.008, nickel, -0.175, y0 + 0.46 + lyft, 0.09 + sz * 0.022);
  box(g, 0.012, 0.008, 0.052, nickel, -0.175, y0 + 0.445 + lyft, 0.09);
  // Hörluren: lur med hörkåpa; lokalt origo i hörkåpans öppning, handtaget nedåt (−y)
  const lur = new THREE.Group(); g.add(lur);
  cyl(lur, 0.036, 0.02, 0.035, svart, 0, -0.0175, 0, 14);
  cyl(lur, 0.037, 0.037, 0.006, svart, 0, -0.003, 0, 14);
  cyl(lur, 0.016, 0.018, 0.15, svart, 0, -0.11, 0, 10);
  cyl(lur, 0.01, 0.014, 0.02, nickel, 0, -0.195, 0, 8);
  if (d.luren_av) {
    lur.position.set(-0.21, 0.37, 0.17); lur.rotation.set(0.06, 0, Math.PI - 0.05);
    slang(g, [[-0.08, y0 + 0.19, 0.1], [-0.14, y0 - 0.15, 0.15], [-0.2, 0.72, 0.17], [-0.212, 0.57, 0.17]], 0.005, sladd);
  } else {
    lur.position.set(-0.175, y0 + 0.5, 0.09);
    slang(g, [[-0.175, y0 + 0.3, 0.09], [-0.18, y0 + 0.14, 0.12], [-0.12, y0 + 0.11, 0.14], [-0.08, y0 + 0.19, 0.1]], 0.005, sladd);
  }
  return { grupp: g, kollision: false, haloPos: new THREE.Vector3(0, y0 + 0.42, 0.28) };
}

/**
 * Manuell telefonväxel (växelbord): underskåp med skiva i bordshöjd (0,74 m) och knäutrymme, en överdel med
 * fallklaffar och jackfält, propplinor i två rader på skivan (tre är inkopplade i jackfältet), samtalsnycklar,
 * en vev på sidan och en hörtelefon på skivan. storlek [bredd, höjd, djup] ([1,0, 1,3, 0,6]), farg (trä).
 * Väggföremål: origo i väggplanet, ryggen mot väggen och framsidan i z = djup.
 */
function telefonvaxel(d) {
  const g = new THREE.Group();
  const [W, H, D] = d.storlek || [1.0, 1.3, 0.6];
  const ek = mat(d.farg || '#5a3418', { glans: 0.45 }), mork = mat(MORKTRA, { glans: 0.45 });
  const svart = mat('#141212', { glans: 0.3 }), nickel = mat('#b8b8b0', { glans: 0.2, metall: 0.8 }), sladd = mat('#2a2018');
  const S = 0.74, ys = S + 0.035, P = 0.24; // skivans höjd, dess ovansida, överdelens djup
  for (const sx of [-1, 1]) {
    box(g, 0.04, S, D, ek, sx * (W / 2 - 0.02), S / 2, D / 2);
    box(g, 0.04, H - ys, P + 0.02, ek, sx * (W / 2 - 0.02), ys + (H - ys) / 2, (P + 0.02) / 2);
  }
  box(g, W - 0.08, S - 0.06, 0.02, mork, 0, S / 2, 0.01); // rygg
  box(g, W - 0.08, 0.36, 0.02, ek, 0, 0.24, 0.24); // indraget fält bakom knäna
  box(g, W - 0.08, 0.06, 0.26, mork, 0, 0.03, 0.13); // sockel
  box(g, W - 0.08, 0.08, 0.02, ek, 0, S - 0.05, D - 0.02); // sarg under skivan
  box(g, W + 0.02, 0.035, D + 0.02, ek, 0, S + 0.0175, D / 2); // skivan
  // Överdelen med fallklaffar och jackfält
  const ph = H - ys - 0.07, pw = W - 0.08;
  box(g, pw, ph + 0.02, P, mork, 0, ys + (ph + 0.02) / 2, P / 2);
  plan(g, pw - 0.02, ph - 0.02, mat('#ffffff', { map: T.vaxelpanel() }), 0, ys + ph / 2 + 0.01, P + 0.001);
  box(g, W + 0.04, 0.05, P + 0.06, ek, 0, H - 0.025, (P + 0.06) / 2);
  box(g, W + 0.02, 0.025, P + 0.04, mork, 0, H - 0.06, (P + 0.04) / 2);
  // Propplinor: proppar i två rader på skivan; tre är uppdragna och sitter i jackfältet
  const n = 8, px = (i) => -0.35 + (i * 0.7) / (n - 1);
  const panelX = (u) => -pw / 2 + 0.01 + u * (pw - 0.02), panelY = (v) => ys + 0.01 + ph - 0.01 - v * (ph - 0.02);
  const inkopplad = new Map([[1, [3, 1]], [4, [7, 2]], [6, [1, 3]]]); // propp i bakre raden -> [jackkolumn, jackrad]
  for (let i = 0; i < n; i++) for (const [rz, rad] of [[P + 0.05, 0], [P + 0.1, 1]]) {
    const x = px(i);
    cyl(g, 0.014, 0.014, 0.004, massing(), x, ys + 0.002, rz, 10);
    if (rad === 0 && inkopplad.has(i)) {
      const [k, j] = inkopplad.get(i);
      const jx = panelX((12 + k * 23.2 + 11.6) / 256), jy = panelY((85 + j * 21) / 160);
      liggande(g, 0.011, 0.011, 0.06, svart, jx, jy, P + 0.035, 'z', 8);
      slang(g, [[jx, jy, P + 0.065], [jx * 0.6 + x * 0.4, jy - 0.12, P + 0.2], [x, ys + 0.1, P + 0.12], [x, ys + 0.004, rz]], 0.004, sladd);
      continue;
    }
    cyl(g, 0.006, 0.006, 0.03, massing(), x, ys + 0.015, rz, 6);
    cyl(g, 0.011, 0.012, 0.055, rad ? mat('#6a1a14', { glans: 0.3 }) : svart, x, ys + 0.055, rz, 8);
  }
  // Samtalsnycklar
  for (let i = 0; i < n; i++) {
    box(g, 0.03, 0.012, 0.03, nickel, px(i), ys + 0.006, P + 0.19);
    box(g, 0.012, 0.04, 0.012, mat('#e8e0cc'), px(i), ys + 0.025, P + 0.19, i % 3 === 1 ? 0.4 : -0.15, 0, 0);
  }
  // Vev för ringström på höger sida
  liggande(g, 0.01, 0.01, 0.05, nickel, W / 2 + 0.025, S + 0.22, 0.12, 'x', 8);
  box(g, 0.014, 0.12, 0.016, nickel, W / 2 + 0.055, S + 0.17, 0.12);
  liggande(g, 0.013, 0.013, 0.06, svart, W / 2 + 0.09, S + 0.115, 0.12, 'x', 8);
  // Telefonistens hörtelefon med bröstmikrofon på skivan
  ring(g, 0.08, 0.006, nickel, 0.32, ys + 0.008, D - 0.12, -Math.PI / 2, 0, Math.PI * 1.2);
  cyl(g, 0.035, 0.035, 0.03, svart, 0.4, ys + 0.015, D - 0.12, 12);
  const mik = cyl(g, 0.03, 0.012, 0.05, svart, 0.24, ys + 0.03, D - 0.09, 12); mik.rotation.z = 1.2;
  return { grupp: g, haloPos: new THREE.Vector3(0, ys + 0.3, P + 0.25) };
}

/**
 * Riddarrustning på piedestal, ca 1,9 m hög, i blank stålplåt med stängd hjälm och röd plym.
 * vapen ('hillebard' | 'svard' | null; standard 'hillebard'): hillebarden hålls i högra handen och når 2,1 m;
 * svärdet står med spetsen mot piedestalen och båda händerna på parerstången. farg (piedestalens trä).
 */
function rustning(d) {
  const g = new THREE.Group();
  const stal = mat('#9ba3ad', { emissive: '#12161c', glans: 0.16, metall: 0.9 }), mork = mat('#4a4e56', { glans: 0.3, metall: 0.8 });
  const sockel = mat(d.farg || '#3a2818', { glans: 0.4 }), lader = mat('#4a2e1a');
  const vapen = d.vapen === undefined ? 'hillebard' : d.vapen;
  const P = 0.16;
  box(g, 0.66, P - 0.03, 0.52, sockel, 0, (P - 0.03) / 2, 0);
  box(g, 0.7, 0.03, 0.56, mat(nyans(d.farg || '#3a2818', 0.7), { glans: 0.4 }), 0, P - 0.015, 0);
  // Benen: solleret, skenskydd, knäkopp med solfjäder och lårskydd
  for (const sx of [-1, 1]) {
    const x = sx * 0.1;
    box(g, 0.1, 0.06, 0.24, stal, x, P + 0.03, 0.05);
    for (let i = 0; i < 3; i++) box(g, 0.104, 0.014, 0.03, mork, x, P + 0.062, 0.02 + i * 0.04);
    cyl(g, 0.058, 0.044, 0.38, stal, x, P + 0.25, 0, 12);
    sph(g, 0.064, stal, x, P + 0.46, 0.015, 12);
    sph(g, 0.055, stal, x + sx * 0.05, P + 0.46, 0, 10).scale.set(0.3, 1, 1);
    cyl(g, 0.078, 0.06, 0.36, stal, x, P + 0.66, 0, 12);
    box(g, 0.15, 0.17, 0.02, stal, x, P + 0.8, 0.13, -0.12, 0, 0); // lårplåt
  }
  // Höftskört i lameller, bål med köl och halskrage
  for (let i = 0; i < 4; i++) cyl(g, 0.17 - i * 0.008, 0.2 - i * 0.008, 0.05, i % 2 ? mork : stal, 0, P + 0.86 + i * 0.04, 0, 16).scale.z = 0.75;
  cyl(g, 0.17, 0.155, 0.12, stal, 0, P + 1.04, 0, 16).scale.z = 0.75;
  sph(g, 0.2, stal, 0, P + 1.18, 0, 16).scale.set(1, 1.1, 0.72);
  box(g, 0.012, 0.3, 0.02, stal, 0, P + 1.17, 0.142);
  cyl(g, 0.08, 0.12, 0.08, mork, 0, P + 1.4, 0, 14);
  // Axelskydd och armar
  for (const sx of [-1, 1]) {
    sph(g, 0.1, stal, sx * 0.2, P + 1.34, 0, 12).scale.set(1.1, 0.8, 1);
    cyl(g, 0.08, 0.09, 0.03, mork, sx * 0.22, P + 1.27, 0, 12);
  }
  const arm = (S, E, Hd) => {
    stav(g, S, E, 0.045, stal, 10); sph(g, 0.055, stal, E.x, E.y, E.z, 10);
    stav(g, E, Hd, 0.04, stal, 10);
    const h = box(g, 0.07, 0.09, 0.07, mork, Hd.x, Hd.y, Hd.z); h.lookAt(g.localToWorld(E.clone())); // handske riktad längs underarmen
  };
  const Sv = V(0.22, P + 1.3, 0), Sh = V(-0.22, P + 1.3, 0); // vänster axel (+x) och höger axel (−x)
  if (vapen === 'svard') {
    arm(Sh, V(-0.25, P + 1.05, 0.08), V(-0.05, P + 0.99, 0.2));
    arm(Sv, V(0.25, P + 1.05, 0.08), V(0.05, P + 0.99, 0.2));
    box(g, 0.045, 0.86, 0.008, mat('#c8ccd0', { glans: 0.1, metall: 0.95 }), 0, P + 0.45, 0.21);
    box(g, 0.28, 0.025, 0.03, mork, 0, P + 0.89, 0.21);
    cyl(g, 0.016, 0.016, 0.16, lader, 0, P + 0.98, 0.21, 8);
    sph(g, 0.03, mork, 0, P + 1.08, 0.21, 10);
  } else if (vapen === 'hillebard') {
    const hx = -0.28, hz = 0.2;
    arm(Sh, V(-0.27, P + 1.04, 0.03), V(hx, P + 1.04, hz - 0.02));
    arm(Sv, V(0.27, P + 1.02, -0.01), V(0.27, P + 0.78, 0.04));
    cyl(g, 0.017, 0.017, 1.86, mat('#5a3a1e'), hx, P + 0.93, hz, 8); // skaftet
    for (const sz of [-1, 1]) box(g, 0.008, 0.3, 0.008, mork, hx, P + 1.68, hz + sz * 0.018); // skenor
    cyl(g, 0, 0.02, 0.3, stal, hx, P + 2.0, hz, 8); // spetsen
    // Yxbladet med böjd egg utåt (−x) och haken bakåt (+x)
    const yx = new THREE.Shape();
    yx.moveTo(0, 0.05); yx.lineTo(-0.07, 0.05); yx.quadraticCurveTo(-0.12, 0.09, -0.17, 0.13);
    yx.quadraticCurveTo(-0.215, 0.0, -0.17, -0.12); yx.quadraticCurveTo(-0.11, -0.07, -0.07, -0.04); yx.lineTo(0, -0.04);
    yx.lineTo(0.03, -0.015); yx.lineTo(0.15, -0.06); yx.lineTo(0.03, 0.025); yx.lineTo(0, 0.05);
    const blad = new THREE.Mesh(new THREE.ExtrudeGeometry(yx, { depth: 0.008, bevelEnabled: false, curveSegments: 8 }), stal);
    blad.position.set(hx, P + 1.74, hz - 0.004); g.add(blad);
  } else {
    arm(Sh, V(-0.26, P + 1.02, 0), V(-0.27, P + 0.76, 0.03));
    arm(Sv, V(0.26, P + 1.02, 0), V(0.27, P + 0.76, 0.03));
  }
  // Hjälmen: kupa, visir med ögonspringa och andningshål, kam och plym
  sph(g, 0.115, stal, 0, P + 1.56, 0, 14).scale.set(0.9, 1.08, 1.05);
  sph(g, 0.1, stal, 0, P + 1.53, 0.04, 12).scale.set(0.85, 0.75, 1.05);
  box(g, 0.13, 0.012, 0.02, mat('#050505'), 0, P + 1.585, 0.112);
  for (let i = 0; i < 3; i++) box(g, 0.006, 0.006, 0.02, mat('#050505'), -0.05 + i * 0.012, P + 1.52, 0.105);
  box(g, 0.012, 0.05, 0.22, stal, 0, P + 1.67, -0.01);
  cyl(g, 0.1, 0.09, 0.06, stal, 0, P + 1.46, 0.01, 14);
  const plym = mat('#8a1a1e');
  for (const [x, rx] of [[0, -0.9], [-0.025, -1.1], [0.025, -1.1]]) kapsel(g, 0.022, 0.16, plym, x, P + 1.74, -0.09, rx);
  return { grupp: g };
}

/** Flygelns kontur sedd uppifrån: (x, −z). Rak bassida till vänster (−x), svängd diskantsida till höger. */
function flygelform() {
  const s = new THREE.Shape();
  s.moveTo(-0.74, -0.92); s.lineTo(0.74, -0.92); s.lineTo(0.74, -0.35);
  s.quadraticCurveTo(0.42, 0.02, 0.18, 0.5);
  s.bezierCurveTo(0.08, 0.82, -0.05, 0.97, -0.3, 0.97);
  s.bezierCurveTo(-0.55, 0.97, -0.74, 0.9, -0.74, 0.7);
  s.lineTo(-0.74, -0.92);
  return s;
}
/** Konturen som platt, liggande mesh: form i xz-planet, tjocklek h uppåt från y. */
function liggForm(g, form, h, m, y) {
  const geo = h > 0 ? new THREE.ExtrudeGeometry(form, { depth: h, bevelEnabled: false, curveSegments: 14 }) : new THREE.ShapeGeometry(form, 14);
  const me = new THREE.Mesh(geo, m); me.rotation.x = -Math.PI / 2; me.position.y = y; g.add(me); return me;
}

/**
 * Svart flygel med uppfällt lock på lockstöd, notställ med noter, pedallyra och pall. Klaviaturen är framsidan
 * (+z, z 0,92–1,1) och pallen står framför den (z ≈ 1,55); flygeln är 1,5 m bred och når bakåt till z = −0,97.
 * Kollision för hela flygeln med pallen. stangd (false): locket nedfällt. Storleken ändras med den vanliga parametern skala.
 */
function flygel(d) {
  const g = new THREE.Group();
  const lack = mat(d.farg || '#1d191b', { emissive: '#060506', glans: 0.1 }), svart = mat('#0c0a0b');
  const form = flygelform();
  // Lådan: nedre del massiv, övre del en sarg med strängar och ram innanför
  liggForm(g, form, 0.22, lack, 0.62);
  const inre = form.getPoints(16).map((p) => new THREE.Vector2(p.x * 0.95, (p.y - 0.02) * 0.95 + 0.02));
  const sarg = flygelform(); sarg.holes.push(new THREE.Path(inre));
  liggForm(g, sarg, 0.12, lack, 0.84);
  liggForm(g, new THREE.Shape(inre), 0, mat('#ffffff', { map: T.strangar(), glans: 0.4, metall: 0.5 }), 0.845);
  for (const [x, z] of [[-0.2, 0.55], [0.2, 0.55], [-0.35, 0.1], [0.05, -0.1], [-0.3, -0.55]]) cyl(g, 0.06, 0.06, 0.02, mat('#8a6a30', { metall: 0.5 }), x, 0.855, z, 12); // hål i gjutjärnsramen
  // Locket, gångjärn längs bassidan och lockstöd på diskantsidan
  const a = d.stangd ? 0 : 0.6;
  const led = new THREE.Group(); led.position.set(-0.74, 0.96, 0); led.rotation.z = a; g.add(led);
  liggForm(led, form, 0.02, lack, 0).position.x = 0.74;
  if (a) stav(g, V(0.56, 0.96, 0.12), V(-0.74 + 1.24 * Math.cos(a), 0.96 + 1.24 * Math.sin(a), 0.12), 0.012, lack);
  // Klaviaturen med lister, klaviaturklaff och notställ
  box(g, 1.48, 0.07, 0.22, lack, 0, 0.655, 1.0);
  plan(g, 1.32, 0.16, mat('#ffffff', { map: T.klaviatur(), glans: 0.3 }), 0, 0.722, 1.0, -Math.PI / 2);
  box(g, 1.48, 0.05, 0.025, lack, 0, 0.68, 1.1);
  for (const sx of [-1, 1]) box(g, 0.08, 0.13, 0.24, lack, sx * 0.7, 0.72, 0.99);
  box(g, 1.32, 0.09, 0.02, lack, 0, 0.78, 0.915, -0.2, 0, 0);
  const not = new THREE.Group(); not.position.set(0, 1.12, 0.74); not.rotation.x = -0.28; g.add(not);
  box(not, 0.76, 0.3, 0.014, lack, 0, 0, 0);
  box(not, 0.76, 0.02, 0.05, lack, 0, -0.15, 0.02);
  for (const [x, s] of [[-0.12, 2], [0.12, 3]]) plan(not, 0.22, 0.29, mat('#ffffff', { map: T.notblad(s) }), x, 0.0, 0.008);
  box(g, 0.5, 0.04, 0.06, lack, 0, 0.98, 0.73);
  // Ben med mässingshjul och pedallyra
  const ben = [[0.055, 0], [0.065, 0.06], [0.05, 0.1], [0.06, 0.3], [0.075, 0.6], [0.09, 0.8], [0.08, 0.92], [0.1, 0.96], [0.1, 1]];
  for (const [x, z] of [[-0.62, 0.78], [0.62, 0.78], [-0.36, -0.72]]) {
    svarv(g, ben, lack, x, 0.03, z, 12, 1, 0.59);
    sph(g, 0.03, massing(), x, 0.03, z, 8);
  }
  for (const sx of [-1, 1]) box(g, 0.03, 0.5, 0.025, lack, sx * 0.07, 0.36, 0.56);
  box(g, 0.26, 0.05, 0.08, lack, 0, 0.6, 0.56);
  box(g, 0.32, 0.06, 0.12, lack, 0, 0.09, 0.57);
  for (const x of [-0.07, 0, 0.07]) box(g, 0.035, 0.015, 0.1, massing(), x, 0.08, 0.66);
  // Pallen med läderdyna
  const pz = 1.55;
  box(g, 0.78, 0.07, 0.36, lack, 0, 0.44, pz);
  box(g, 0.74, 0.05, 0.32, mat('#3a2418', { glans: 0.5 }), 0, 0.5, pz);
  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) box(g, 0.05, 0.41, 0.05, lack, sx * 0.33, 0.205, pz + sz * 0.13);
    sph(g, 0.03, svart, sx * 0.4, 0.44, pz, 8);
  }
  return { grupp: g, haloPos: new THREE.Vector3(0, 1.1, 1.0) };
}

/**
 * Notställ i svartlackerad metall: trefot, teleskoprör och en lutad pulpet med ett notblad.
 * antal (1): flera ställ i rad längs lokal x med 0,7 m mellanrum, centrerade kring origo. seed (1) väljer noterna.
 * Notbladet vänder sig mot +z (musikern står på +z-sidan).
 */
function notstall(d) {
  const g = new THREE.Group();
  const n = Math.max(1, d.antal | 0 || 1), s0 = d.seed || 1;
  const svart = mat('#222022', { glans: 0.4, metall: 0.6 });
  for (let i = 0; i < n; i++) {
    const x = (i - (n - 1) / 2) * 0.7;
    const nav = V(x, 0.32, 0);
    for (let k = 0; k < 3; k++) {
      const a = (k * Math.PI * 2) / 3 + Math.PI, f = V(x + Math.sin(a) * 0.26, 0.012, Math.cos(a) * 0.26);
      stav(g, nav, f, 0.007, svart); sph(g, 0.012, svart, f.x, f.y, f.z, 6);
    }
    cyl(g, 0.013, 0.013, 0.12, svart, x, 0.33, 0, 8);
    cyl(g, 0.008, 0.008, 0.74, svart, x, 0.7, 0, 8);
    cyl(g, 0.013, 0.013, 0.04, svart, x, 0.66, 0, 8);
    box(g, 0.03, 0.05, 0.03, svart, x, 1.07, 0);
    const p = new THREE.Group(); p.position.set(x, 1.18, 0.02); p.rotation.x = -0.35; g.add(p);
    box(p, 0.5, 0.32, 0.004, svart, 0, 0, 0);
    for (const y of [-0.08, 0.04]) box(p, 0.5, 0.012, 0.01, svart, 0, y, -0.006);
    box(p, 0.5, 0.012, 0.05, svart, 0, -0.16, 0.025);
    plan(p, 0.23, 0.31, mat('#ffffff', { map: T.notblad(s0 + i) }), (i % 2 ? 0.04 : -0.04), 0.0, 0.004);
  }
  return { grupp: g };
}

/**
 * Svensk kakelugn i vitt kakel med blå dekor, mässingsluckor till eldstaden och spjällucka, frisband, krön och urna.
 * form ('rund' | 'kantig'; standard 'rund'): rund är 0,9 m i diameter, kantig 0,9 × 0,62 m (bred × djup).
 * hojd (2,6) till urnans topp. Står med ryggen mot väggen; origo mitt under ugnen, luckorna mot +z.
 */
function kakelugn(d) {
  const g = new THREE.Group();
  const Hh = d.hojd || 2.6, k = Hh / 2.6, rund = d.form !== 'kantig';
  const vit = mat('#f2eee4', { glans: 0.2 }), list = mat('#e6e0d0', { glans: 0.25 }), bla = mat('#2c4a8a', { glans: 0.25 });
  const kak = (rx, ry) => mat('#ffffff', { map: T.kakel([Math.max(1, Math.round(rx)), Math.max(1, Math.round(ry))]), glans: 0.2 });
  const y1 = 0.18 * k, y2 = 1.5 * k, y3 = 1.6 * k, y4 = 2.2 * k, y5 = 2.38 * k; // fot, frisband, krön och urna
  const R = 0.38, W = 0.84, D = 0.56;
  const urna = [[0, 0], [0.16, 0], [0.18, 0.04], [0.12, 0.08], [0.09, 0.12], [0.15, 0.2], [0.11, 0.25], [0.04, 0.27], [0.05, 0.31], [0, 0.32]];
  let fram; // ytans z mitt fram
  if (rund) {
    fram = R;
    cyl(g, R + 0.06, R + 0.07, y1 - 0.04, vit, 0, (y1 - 0.04) / 2, 0, 24);
    cyl(g, R + 0.03, R + 0.08, 0.04, list, 0, y1 - 0.02, 0, 24);
    cyl(g, R, R, y2 - y1, kak((2 * Math.PI * R) / 0.4, (y2 - y1) / 0.4), 0, (y1 + y2) / 2, 0, 24);
    cyl(g, R + 0.03, R + 0.03, y3 - y2, list, 0, (y2 + y3) / 2, 0, 24);
    cyl(g, R + 0.035, R + 0.035, 0.02, bla, 0, (y2 + y3) / 2, 0, 24);
    cyl(g, R - 0.02, R - 0.02, y4 - y3, kak((2 * Math.PI * (R - 0.02)) / 0.4, (y4 - y3) / 0.4), 0, (y3 + y4) / 2, 0, 24);
    const st = (y5 - y4) / 3;
    cyl(g, R + 0.03, R, st, list, 0, y4 + st / 2, 0, 24);
    cyl(g, R + 0.08, R + 0.03, st, list, 0, y4 + st * 1.5, 0, 24);
    cyl(g, R + 0.1, R + 0.1, st, vit, 0, y4 + st * 2.5, 0, 24);
    cyl(g, R * 0.6, R + 0.06, 0.06 * k, vit, 0, y5 + 0.03 * k, 0, 24);
  } else {
    fram = D / 2;
    box(g, W + 0.1, y1 - 0.04, D + 0.06, vit, 0, (y1 - 0.04) / 2, 0.01);
    box(g, W + 0.12, 0.04, D + 0.08, list, 0, y1 - 0.02, 0.01);
    const kropp = (w, dd, ya, yb) => {
      box(g, w, yb - ya, dd, vit, 0, (ya + yb) / 2, 0);
      const hh = yb - ya, ym = (ya + yb) / 2;
      plan(g, w, hh, kak(w / 0.4, hh / 0.4), 0, ym, dd / 2 + 0.002);
      for (const sx of [-1, 1]) {
        plan(g, dd, hh, kak(dd / 0.4, hh / 0.4), sx * (w / 2 + 0.002), ym, 0, 0, sx * Math.PI / 2);
        cyl(g, 0.025, 0.025, hh, list, sx * w / 2, ym, dd / 2, 8); // rundade hörnlister
      }
    };
    kropp(W, D, y1, y2);
    box(g, W + 0.06, y3 - y2, D + 0.04, list, 0, (y2 + y3) / 2, 0.01);
    box(g, W + 0.07, 0.02, D + 0.05, bla, 0, (y2 + y3) / 2, 0.01);
    kropp(W - 0.04, D - 0.02, y3, y4);
    const st = (y5 - y4) / 3;
    for (let i = 0; i < 3; i++) box(g, W + 0.02 + i * 0.06, st, D + 0.02 + i * 0.04, i === 2 ? vit : list, 0, y4 + st * (i + 0.5), 0.01 + i * 0.01);
    box(g, W * 0.6, 0.06 * k, D * 0.6, vit, 0, y5 + 0.03 * k, 0);
  }
  svarv(g, urna, vit, 0, y5 + 0.06 * k, 0, 16, 1, k);
  // Mässingsluckorna: dubbla eldstadsluckor och en mindre spjällucka; böjda efter ugnen när den är rund
  const blank = mat('#d8a850', { emissive: '#3a2808', glans: 0.26, metall: 0.75 });
  const lucka = (yc, h, b, dubbel) => {
    if (rund) {
      const th = b / R, ram = new THREE.Mesh(new THREE.CylinderGeometry(R + 0.008, R + 0.008, h + 0.03, 10, 1, false, -th / 2 - 0.03, th + 0.06), mat('#7a5a26', { metall: 0.6 }));
      ram.position.y = yc; g.add(ram);
      const bl = new THREE.Mesh(new THREE.CylinderGeometry(R + 0.016, R + 0.016, h, 10, 1, false, -th / 2, th), blank);
      bl.position.y = yc; g.add(bl);
    } else {
      box(g, b + 0.03, h + 0.03, 0.01, mat('#7a5a26', { metall: 0.6 }), 0, yc, fram + 0.005);
      box(g, b, h, 0.012, blank, 0, yc, fram + 0.012);
    }
    const z = fram + 0.026;
    if (dubbel) { box(g, 0.004, h, 0.006, mat('#3a2a10'), 0, yc, z - 0.006); for (const sx of [-1, 1]) sph(g, 0.012, massing(), sx * 0.03, yc, z, 8); }
    else sph(g, 0.012, massing(), b * 0.32, yc, z, 8);
    for (const sy of [-1, 1]) box(g, b * 0.8, 0.006, 0.006, mat('#8a6a30'), 0, yc + sy * h * 0.32, z - 0.008);
  };
  lucka(0.55 * k, 0.32, 0.3, true);
  lucka(1.22 * k, 0.16, 0.18, false);
  return { grupp: g, haloPos: new THREE.Vector3(0, 1.3 * k, fram + 0.15) };
}

/** Kolonn i marmor med attisk bas på en plint och joniskt kapitäl med voluter. hojd (4,5), radie (0,25). */
function pelare(d) {
  const g = new THREE.Group();
  const Hh = d.hojd || 4.5, r = d.radie || 0.25, s = r / 0.25;
  const marm = mat('#ffffff', { map: T.marmor([2, Math.max(1, Math.round(Hh / 1.2))]), glans: 0.2 }), ljus = mat('#e9e1d2', { glans: 0.25 });
  const yb = 0.34 * s, yk = Hh - 0.3 * s; // basens överkant, kapitälets underkant
  box(g, r * 2.7, 0.16 * s, r * 2.7, ljus, 0, 0.08 * s, 0);
  svarv(g, [[0, 0.16], [1.3, 0.16], [1.32, 0.2], [1.22, 0.235], [1.12, 0.25], [1.18, 0.285], [1.06, 0.32], [1.0, 0.34], [0, 0.34]].map(([a, b]) => [a * r, b * s]), ljus, 0, 0, 0, 24);
  cyl(g, r * 0.88, r, yk - yb, marm, 0, (yb + yk) / 2, 0, 24);
  // Kapitälet: halsring, echinus, voluter och täckplatta
  ring(g, r * 0.9, 0.025 * s, ljus, 0, yk + 0.02 * s, 0, Math.PI / 2);
  svarv(g, [[0, 0], [0.88, 0], [1.0, 0.04], [1.18, 0.1], [1.22, 0.12], [0, 0.12]].map(([a, b]) => [a * r, b * s]), ljus, 0, yk + 0.04 * s, 0, 24);
  box(g, r * 2.2, 0.08 * s, r * 2.3, ljus, 0, Hh - 0.12 * s, 0);
  for (const sx of [-1, 1]) {
    const vx = sx * r * 1.1, vy = Hh - 0.14 * s;
    liggande(g, 0.075 * s, 0.075 * s, r * 2.3, ljus, vx, vy, 0, 'z', 16);
    for (const sz of [-1, 1]) { ring(g, 0.05 * s, 0.014 * s, mat('#d4cab6'), vx, vy, sz * r * 1.15); ring(g, 0.022 * s, 0.01 * s, mat('#d4cab6'), vx, vy, sz * r * 1.16); }
  }
  box(g, r * 2.8, 0.06 * s, r * 2.8, ljus, 0, Hh - 0.03 * s, 0);
  return { grupp: g };
}

/** Böljande yta för gobelängen och dess frans: små lodräta veck. */
function veckad(B, H, m, y, z0) {
  const geo = new THREE.PlaneGeometry(B, H, Math.max(8, Math.round(B * 12)), 1), p = geo.attributes.position;
  for (let i = 0; i < p.count; i++) p.setZ(i, z0 + 0.012 * Math.sin(p.getX(i) * 9 + 0.5));
  geo.computeVertexNormals();
  const me = new THREE.Mesh(geo, m); me.position.y = y; return me;
}

/**
 * Vävd bonad på en stång med mässingsknoppar. Väggföremål: origo i väggplanet. storlek [b, h] ([2,0, 1,6]),
 * y0 (1,0): bonadens underkant (fransen hänger 8 cm nedanför); stången sitter strax ovanför överkanten. motiv ('jakt' | 'slott'), seed (1).
 */
function gobelang(d) {
  const g = new THREE.Group();
  const [B, H] = d.storlek || [2.0, 1.6], y0 = d.y0 ?? 1.0, z0 = 0.055;
  g.add(veckad(B, H, mat('#ffffff', { map: T.gobelang(d.motiv === 'slott' ? 'slott' : 'jakt', d.seed || 1, [B, H]), glans: 0.95 }), y0 + H / 2, z0));
  const frans = veckad(B, 0.08, mat('#ffffff', { map: T.ullfrans(), transparent: true, glans: 0.95 }), y0 - 0.04, z0);
  frans.renderOrder = 1; g.add(frans);
  const tra = mat(MORKTRA);
  liggande(g, 0.018, 0.018, B + 0.2, tra, 0, y0 + H + 0.035, z0 + 0.025, 'x', 10);
  for (const sx of [-1, 1]) {
    sph(g, 0.035, massing(), sx * (B / 2 + 0.12), y0 + H + 0.035, z0 + 0.025, 10);
    box(g, 0.03, 0.05, z0 + 0.04, massing(), sx * (B / 2 + 0.04), y0 + H + 0.035, (z0 + 0.04) / 2);
  }
  for (let x = -B / 2 + 0.1; x <= B / 2 - 0.09; x += 0.2) box(g, 0.03, 0.06, 0.014, mat('#6a5a40'), x, y0 + H + 0.01, z0 + 0.02);
  return { grupp: g, kollision: false, haloPos: new THREE.Vector3(0, y0 + H / 2, 0.2) };
}

/**
 * Stenbalustrad för terrassen: fotlist, svarvade balusterdockor, postament med täckplattor och en täckhäll
 * (överkant 0,95 m). langd (4) längs x, centrerad; postament i ändarna och var 2,2:e meter. sno (true): snö på
 * hällen, postamenten och fotlisten. farg (stenen).
 */
function balustrad(d) {
  const g = new THREE.Group();
  const L = d.langd || 4, Hb = 0.95;
  const sten = mat('#ffffff', { map: T.puts(d.farg || '#cdc2ac'), glans: 0.8 }), mork = mat(nyans(d.farg || '#cdc2ac', 0.82), { glans: 0.8 });
  box(g, L, 0.14, 0.3, sten, 0, 0.07, 0);
  box(g, L + 0.02, 0.03, 0.34, mork, 0, 0.015, 0);
  box(g, L, 0.07, 0.34, sten, 0, Hb - 0.035, 0);
  box(g, L, 0.03, 0.28, mork, 0, Hb - 0.085, 0);
  const nPost = Math.max(1, Math.round(L / 2.2)), postX = [];
  for (let i = 0; i <= nPost; i++) postX.push(-L / 2 + 0.15 + (i * (L - 0.3)) / nPost);
  const docka = new THREE.LatheGeometry([[0, 0], [0.065, 0], [0.065, 0.05], [0.05, 0.07], [0.055, 0.1], [0.075, 0.2], [0.085, 0.3], [0.07, 0.4], [0.045, 0.5], [0.035, 0.58], [0.05, 0.62], [0.06, 0.64], [0.06, 0.71], [0, 0.71]].map(([r, h]) => new THREE.Vector2(r, h)), 10);
  for (let i = 0; i < postX.length; i++) {
    const x = postX[i];
    box(g, 0.3, Hb, 0.38, sten, x, Hb / 2, 0);
    box(g, 0.38, 0.06, 0.44, mork, x, Hb + 0.03, 0);
    if (i === postX.length - 1) break;
    const a = x + 0.15, b = postX[i + 1] - 0.15, n = Math.max(1, Math.round((b - a) / 0.19));
    for (let j = 0; j < n; j++) { const me = new THREE.Mesh(docka, sten); me.position.set(a + ((j + 0.5) * (b - a)) / n, 0.14, 0); g.add(me); }
  }
  if (d.sno !== false) {
    const sno = SNO(), r = slump(d.seed || 5);
    box(g, L - 0.02, 0.04, 0.27, sno, 0, Hb + 0.02, 0);
    for (let x = -L / 2 + 0.3; x < L / 2 - 0.2; x += 0.45) sph(g, 0.1, sno, x + (r() - 0.5) * 0.15, Hb + 0.035, (r() - 0.5) * 0.04, 8).scale.set(2.2, 0.32, 1.25);
    for (const x of postX) { box(g, 0.36, 0.04, 0.4, sno, x, Hb + 0.08, 0); sph(g, 0.17, sno, x, Hb + 0.09, 0, 10).scale.set(1, 0.38, 1.15); }
    box(g, L - 0.02, 0.025, 0.26, sno, 0, 0.152, 0);
    for (const sz of [-1, 1]) for (let x = -L / 2 + 0.2; x < L / 2; x += 0.6) sph(g, 0.14, sno, x + r() * 0.2, 0.0, sz * (0.2 + r() * 0.06), 8).scale.set(2.2, 0.4, 0.9);
  }
  return { grupp: g };
}

/**
 * Slottsfasad att se ut mot: putsad tegelfasad i ljus ockra på en sockel av sandsten, två våningar med höga
 * spröjsade fönster i stenomfattningar (några upplysta, snö på blecken), takfotsgesims, snötäckt tak med takkupor och
 * skorstenar, och ett runt hörntorn med kopparhuv till höger (+x). bredd (16), hojd (12) till takets nock;
 * takfoten ligger på 0,68 × hojd och tornets spira når ca 1,3 × hojd. Fasadytan i z = 0, huset bakåt (−z),
 * tornet sticker ut till z ≈ 2,9. upplysta: index för tända fönster (nedre våningen från vänster, sedan övre);
 * annars väljer seed (3) ungefär vartannat. farg (putsen). Kolliderar som en vägg.
 */
function slottsfasad(d) {
  const g = new THREE.Group();
  const B = d.bredd || 16, Ht = d.hojd || 12, r = slump(d.seed || 3);
  const Hv = Ht * 0.68, f = Hv / 8.2;
  const farg = d.farg || '#e2c58a';
  const puts = mat('#ffffff', { map: T.puts(farg, [Math.round(B / 4), Math.round(Hv / 4)]), glans: 0.9 });
  const sten = mat('#b8ab90', { glans: 0.85 }), ljussten = mat('#d8ccb2', { glans: 0.85 }), sprojs = mat('#efe8d8');
  const sno = SNO(), koppar = mat('#5f9a86', { glans: 0.6, metall: 0.3 }), tegel = mat('#8a4a32');
  const tand = mat('#f6d488', { emissive: '#b07a28' }), mork = mat('#1a2232', { emissive: '#070a10', glans: 0.1 });
  const gardin = mat('#c88a3a', { emissive: '#5a3010' });
  const Rt = 2.0, tx = B / 2 - 1.2, tz = 0.9; // tornet
  // Huskroppen, sockeln, våningsband och gesims
  box(g, B, Hv, 1.0, puts, 0, Hv / 2, -0.5);
  box(g, B, 1.1 * f, 1.2, sten, 0, 0.55 * f, -0.5);
  box(g, B + 0.04, 0.12, 0.16, sten, 0, 1.16 * f, 0.04);
  box(g, B, 0.2, 0.14, ljussten, 0, 4.7 * f, 0.05);
  box(g, B + 0.3, 0.28, 0.5, ljussten, 0, Hv - 0.1, 0.05);
  box(g, B + 0.5, 0.14, 0.72, ljussten, 0, Hv + 0.1, 0.1);
  for (let y = 1.2 * f, i = 0; y < Hv - 0.5; y += 0.5, i++) box(g, i % 2 ? 0.45 : 0.7, 0.42, 0.05, ljussten, -B / 2 + (i % 2 ? 0.225 : 0.35), y + 0.25, 0.02); // hörnkedja
  // Fönster: byggs i en egen grupp med framsidan mot +z
  let nr = 0;
  const lista = d.upplysta ? new Set(d.upplysta) : null;
  const fonster = (fg, yb, w, h, overstycke) => {
    const tant = lista ? lista.has(nr) : r() < 0.5; nr++;
    plan(fg, w, h, tant ? tand : mork, 0, yb + h / 2, 0.005);
    if (tant) for (const sx of [-1, 1]) plan(fg, w * 0.2, h * 0.95, gardin, sx * w * 0.4, yb + h / 2, 0.008);
    for (const sx of [-1, 1]) box(fg, 0.16, h + 0.16, 0.12, ljussten, sx * (w / 2 + 0.08), yb + h / 2, 0.06);
    box(fg, w + 0.32, 0.16, 0.12, ljussten, 0, yb + h + 0.08, 0.06);
    box(fg, w + 0.3, 0.08, 0.24, ljussten, 0, yb - 0.04, 0.12);
    box(fg, w + 0.26, 0.05, 0.22, sno, 0, yb + 0.02, 0.12);
    box(fg, 0.05, h, 0.04, sprojs, 0, yb + h / 2, 0.03);
    for (const t of [1 / 3, 2 / 3]) box(fg, w, 0.045, 0.04, sprojs, 0, yb + h * t, 0.03);
    for (const sx of [-1, 1]) box(fg, 0.05, h, 0.04, sprojs, sx * (w / 2 - 0.025), yb + h / 2, 0.03);
    if (overstycke) {
      box(fg, w + 0.5, 0.1, 0.22, ljussten, 0, yb + h + 0.25, 0.1);
      for (const sx of [-1, 1]) box(fg, w / 2 + 0.32, 0.08, 0.18, ljussten, sx * (w / 4 + 0.1), yb + h + 0.42, 0.09, 0, 0, -sx * 0.3);
      box(fg, w + 0.46, 0.04, 0.2, sno, 0, yb + h + 0.32, 0.11);
    }
  };
  const vagg = (x, z, ry) => { const fg = new THREE.Group(); fg.position.set(x, 0, z); fg.rotation.y = ry; g.add(fg); return fg; };
  const x0 = -B / 2 + 1.3, x1 = tx - Rt - 0.9, n = Math.max(1, Math.round((x1 - x0) / 2.2) + 1);
  const fx = (i) => (n === 1 ? (x0 + x1) / 2 : x0 + (i * (x1 - x0)) / (n - 1));
  for (let i = 0; i < n; i++) fonster(vagg(fx(i), 0, 0), 1.8 * f, 1.1, 2.3 * f, true);
  for (let i = 0; i < n; i++) fonster(vagg(fx(i), 0, 0), 5.3 * f, 1.1, 2.2 * f, false);
  // Taket: snötäckt sluttning från takfoten upp till nocken, takränna, takkupor och skorstenar
  const rise = Ht - Hv - 0.2, run = rise, sl = Math.hypot(rise, run), vinkel = Math.atan2(rise, run);
  const tl = tx - Rt + B / 2 + 0.6, tc = -B / 2 + tl / 2 - 0.3;
  box(g, tl, 0.2, sl, mat('#e4eaf0', { emissive: '#1c222c', glans: 0.7 }), tc, Hv + 0.2 + rise / 2, 0.35 - run / 2, vinkel);
  box(g, tl, 0.12, 0.14, mat('#3a4a44', { metall: 0.4 }), tc, Hv + 0.2, 0.42);
  for (let i = 0; i < n; i += 2) {
    const x = fx(i), fy = Hv + 0.2 + rise * 0.3, fz = 0.35 - run * 0.3;
    box(g, 1.1, 1.3, 1.2, puts, x, fy + 0.45, fz - 0.3);
    const kg = vagg(x, fz + 0.3, 0); fonster(kg, fy + 0.1, 0.6, 0.85, false);
    for (const sx of [-1, 1]) box(g, 0.8, 0.1, 1.3, sno, x + sx * 0.32, fy + 1.25, fz - 0.3, 0, 0, -sx * 0.6);
  }
  for (const x of [-B / 4, B / 8]) {
    box(g, 0.8, 2.0, 0.6, tegel, x, Ht - 0.4, 0.35 - run * 0.85);
    box(g, 0.9, 0.12, 0.7, sno, x, Ht + 0.66, 0.35 - run * 0.85);
  }
  // Hörntornet med kopparhuv
  const Ht2 = Hv + 2.6 * f;
  cyl(g, Rt, Rt, Ht2, mat('#ffffff', { map: T.puts(farg, [Math.round((2 * Math.PI * Rt) / 4), Math.round(Ht2 / 4)]), glans: 0.9 }), tx, Ht2 / 2, tz, 32);
  cyl(g, Rt + 0.1, Rt + 0.1, 1.1 * f, sten, tx, 0.55 * f, tz, 32);
  cyl(g, Rt + 0.06, Rt + 0.06, 0.2, ljussten, tx, 4.7 * f, tz, 32);
  cyl(g, Rt + 0.25, Rt + 0.15, 0.32, ljussten, tx, Ht2 - 0.1, tz, 32);
  for (const a of [-0.75, 0, 0.75]) {
    const fg = vagg(tx + Math.sin(a) * Rt, tz + Math.cos(a) * Rt, a);
    fonster(fg, 1.8 * f, 0.9, 2.3 * f, false); fonster(fg, 5.3 * f, 0.9, 2.2 * f, false); fonster(fg, Hv + 0.6 * f, 0.7, 1.2 * f, false);
  }
  const huv = [[0, 0], [Rt + 0.3, 0], [Rt + 0.22, 0.25], [Rt * 0.95, 0.7], [Rt * 0.75, 1.3], [Rt * 0.45, 1.9], [Rt * 0.3, 2.3], [Rt * 0.42, 2.6], [Rt * 0.36, 2.9], [0.12, 3.3], [0, 3.35]];
  svarv(g, huv, koppar, tx, Ht2 + 0.06, tz, 24);
  svarv(g, [[Rt + 0.32, 0], [Rt + 0.24, 0.27], [Rt * 0.96, 0.62], [0, 0.62]], sno, tx, Ht2 + 0.07, tz, 24);
  cyl(g, 0.01, 0.06, 1.6, koppar, tx, Ht2 + 3.4 + 0.8, tz, 8);
  sph(g, 0.12, mat('#c8a040', { emissive: '#3a2a08', metall: 0.8 }), tx, Ht2 + 3.7, tz, 10);
  return { grupp: g };
}

/**
 * Fyrverkeri i en öppen trälåda (0,62 × 0,36 m) med halm: raketer på pinnar, pappershylsor och ett solhjul som
 * lutar mot lådan. seed (11) väljer färger och lutningar.
 */
function fyrverkeri(d) {
  const g = new THREE.Group();
  const r = slump(d.seed || 11);
  const tra = mat('#9a7a4a'), mork = mat('#6a4a2a'), pinne = mat('#c8a878'), stubin = mat('#2a2018');
  const L = 0.62, Dd = 0.36, Hh = 0.3, t = 0.018;
  box(g, L, 0.02, Dd, mork, 0, 0.01, 0);
  for (const s of [-1, 1]) {
    box(g, L, Hh, t, tra, 0, Hh / 2, s * (Dd / 2 - t / 2));
    box(g, t, Hh, Dd - 2 * t, tra, s * (L / 2 - t / 2), Hh / 2, 0);
    box(g, 0.05, Hh, 0.012, mork, s * (L / 2 - 0.04), Hh / 2, Dd / 2 + 0.006); // läkt i hörnen
  }
  for (const y of [0.1, 0.2]) box(g, L - 0.1, 0.004, 0.004, mork, 0, y, Dd / 2 + 0.002);
  plan(g, 0.4, 0.11, mat('#ffffff', { map: T.skylt('FYRVERKERI', { bredd: 256, hojd: 72, grund: '#a8875a', farg: '#5a140c', storlek: 34, kant: false, typsnitt: 'bold "Courier New", monospace' }) }), 0, Hh * 0.52, Dd / 2 + 0.013);
  box(g, L - 2 * t, 0.03, Dd - 2 * t, mat('#c8a860'), 0, Hh - 0.08, 0); // halm
  const FARG = ['#a8302a', '#2c4a8a', '#c9a23a', '#3a6a3a', '#e8dcc4', '#7a2a5a'];
  for (let i = 0; i < 7; i++) {
    const p = new THREE.Group(), x = -0.22 + i * 0.073, z = (i % 2 ? 0.07 : -0.06) + (r() - 0.5) * 0.03;
    p.position.set(x, 0.02, z); p.rotation.set(z * 0.9 + (r() - 0.5) * 0.08, 0, -x * 0.7 + (r() - 0.5) * 0.1); g.add(p);
    const lp = 0.78 + r() * 0.18, hl = 0.17 + r() * 0.08, rr = 0.018 + r() * 0.008, farg = FARG[(i + (r() * 2 | 0)) % FARG.length];
    box(p, 0.008, lp, 0.008, pinne, rr + 0.004, lp / 2, 0);
    cyl(p, rr, rr, hl, mat(farg), 0, lp - hl / 2 + 0.06, 0, 10);
    cyl(p, rr + 0.001, rr + 0.001, 0.02, mat('#efe6d0'), 0, lp - hl * 0.4 + 0.06, 0, 10);
    cyl(p, 0, rr, 0.06, mat(nyans(farg, 0.7)), 0, lp + 0.09, 0, 10);
    cyl(p, 0.003, 0.003, 0.04, stubin, 0, lp - hl + 0.04, 0, 4);
  }
  for (let i = 0; i < 4; i++) {
    const x = -0.18 + i * 0.12, rr = 0.035 + r() * 0.012;
    const h = liggande(g, rr, rr, 0.15, mat(FARG[(i + 2) % FARG.length]), x, Hh - 0.065 + rr, (r() - 0.5) * 0.12, 'z', 10);
    h.rotation.y = (r() - 0.5) * 0.6;
    stav(g, V(x, Hh - 0.065 + rr, 0.075), V(x + 0.02, Hh - 0.04 + rr, 0.11), 0.003, stubin, 4);
  }
  // Solhjul som lutar mot lådans kortsida
  const sol = new THREE.Group(); sol.position.set(L / 2 + 0.035, 0.12, 0.02); sol.rotation.set(0, Math.PI / 2, -0.2); g.add(sol);
  for (const [R, f] of [[0.1, '#a8302a'], [0.075, '#c9a23a'], [0.05, '#2c4a8a']]) ring(sol, R, 0.012, mat(f), 0, 0, 0);
  box(sol, 0.012, 0.2, 0.006, pinne, 0, 0, -0.012); box(sol, 0.2, 0.012, 0.006, pinne, 0, 0, -0.012);
  cyl(sol, 0.006, 0.006, 0.05, mat('#555'), 0, 0, 0, 6).rotation.x = Math.PI / 2;
  return { grupp: g, haloPos: new THREE.Vector3(0, 0.6, 0.1) };
}

/**
 * Golvkandelaber i mässing med fem ljus: trefot med tassar, svarvad stam, fyra svängda armar och ett ljus i mitten.
 * hojd (1,6) till ljusens toppar. lyser (true): lågor och ett svagt, fladdrande ljus som ljusstaken (styrka 1,5,
 * rackvidd 5). Kollision 0,45 × 0,45 m.
 */
function kandelaber(d, ctx) {
  const g = new THREE.Group();
  const Hh = d.hojd || 1.6, m = massing(), vax = mat('#f2ead8');
  const ya = Hh - 0.38; // armarnas fäste
  for (let i = 0; i < 3; i++) {
    const a = (i * Math.PI * 2) / 3 + Math.PI / 3, fx = Math.sin(a), fz = Math.cos(a);
    slang(g, [[fx * 0.04, 0.16, fz * 0.04], [fx * 0.13, 0.1, fz * 0.13], [fx * 0.2, 0.04, fz * 0.2]], 0.014, m);
    sph(g, 0.03, m, fx * 0.21, 0.03, fz * 0.21, 8).scale.y = 0.7;
  }
  svarv(g, [[0, 0.12], [0.09, 0.12], [0.1, 0.15], [0.06, 0.19], [0.04, 0.24], [0.06, 0.3], [0.03, 0.36], [0.022, 0.5], [0.022, 0.48 + (ya - 0.6) * 0.5], [0.045, 0.52 + (ya - 0.6) * 0.5], [0.022, 0.56 + (ya - 0.6) * 0.5], [0.02, ya - 0.08], [0.05, ya - 0.03], [0.035, ya], [0.02, ya + 0.04], [0, ya + 0.04]], m, 0, 0, 0, 12);
  const ljus = (x, y, z) => {
    cyl(g, 0.045, 0.035, 0.012, m, x, y, z, 12);
    cyl(g, 0.018, 0.015, 0.05, m, x, y + 0.03, z, 10);
    cyl(g, 0.012, 0.012, 0.2, vax, x, y + 0.155, z, 8);
    if (d.lyser !== false) sph(g, 0.011, flamma(), x, y + 0.27, z, 6).scale.y = 1.7;
    else cyl(g, 0.0015, 0.0015, 0.012, mat('#111'), x, y + 0.26, z, 4);
  };
  for (let i = 0; i < 4; i++) {
    const a = (i * Math.PI) / 2 + Math.PI / 4, cx = Math.sin(a), cz = Math.cos(a);
    slang(g, [[cx * 0.02, ya, cz * 0.02], [cx * 0.1, ya - 0.06, cz * 0.1], [cx * 0.2, ya - 0.02, cz * 0.2], [cx * 0.22, ya + 0.06, cz * 0.22]], 0.011, m);
    ljus(cx * 0.22, ya + 0.07, cz * 0.22);
  }
  ljus(0, ya + 0.12, 0);
  if (d.lyser !== false) ctx.ljus(g, new THREE.Vector3(0, Hh + 0.05, 0), '#ffc27a', d.styrka ?? 1.5, d.rackvidd ?? 5, true);
  return { grupp: g, fotavtryck: 0.45, haloPos: new THREE.Vector3(0, Hh - 0.6, 0.15) };
}

Object.assign(prefabs, { biljardbord, vaggtelefon, telefonvaxel, rustning, flygel, notstall, kakelugn, pelare, gobelang, balustrad, slottsfasad, fyrverkeri, kandelaber });
