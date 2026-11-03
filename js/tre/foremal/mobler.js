// Möbler, mattor och inredning som står på golvet.
// Konventioner: se foremal/grund.js.
import * as THREE from '../../../vendor/three/three.module.min.js';
import * as T from '../texturer.js';
import { mat, box, cyl, sph, plan, massing, glas, flamma, prefabs, TRA, MORKTRA, MARMOR, TYG, MAHOGNY, JARN } from './grund.js';

function matta(d) {
  const g = new THREE.Group();
  const [w, l] = d.storlek || [3, 2];
  plan(g, w, l, mat('#ffffff', { map: T.matta() }), 0, 0.006, 0, -Math.PI / 2);
  return { grupp: g, kollision: false };
}

function bord(d) {
  const g = new THREE.Group();
  const [w, h, dj] = d.storlek || [1, 0.75, 0.6];
  const m = mat(d.farg || TRA);
  if (d.rund) {
    cyl(g, w / 2, w / 2, 0.04, m, 0, h - 0.02, 0, 16);
    cyl(g, 0.04, 0.05, h - 0.04, m, 0, (h - 0.04) / 2, 0, 8);
    cyl(g, 0.2, 0.22, 0.04, m, 0, 0.02, 0, 12);
  } else {
    box(g, w, 0.05, dj, m, 0, h - 0.025, 0);
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) box(g, 0.05, h - 0.05, 0.05, m, sx * (w / 2 - 0.05), (h - 0.05) / 2, sz * (dj / 2 - 0.05));
  }
  if (d.duk) box(g, w + 0.06, 0.01, dj + 0.06, mat('#ffffff', { map: T.duk() }), 0, h + 0.003, 0);
  return { grupp: g };
}

function byra(d) {
  const g = new THREE.Group();
  const [w, h, dj] = d.storlek || [1.2, 0.85, 0.5];
  const m = mat(TRA);
  box(g, w, h - 0.1, dj, m, 0, (h - 0.1) / 2 + 0.1, 0);
  box(g, w + 0.04, 0.03, dj + 0.04, mat(MORKTRA), 0, h - 0.015, 0);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) box(g, 0.05, 0.1, 0.05, m, sx * (w / 2 - 0.05), 0.05, sz * (dj / 2 - 0.05));
  for (let i = 0; i < 3; i++) {
    const y = 0.25 + i * 0.2;
    box(g, w - 0.1, 0.16, 0.01, mat('#4e3119'), 0, y, dj / 2 + 0.005);
    for (const sx of [-0.25, 0.25]) sph(g, 0.018, massing(), sx * w, y, dj / 2 + 0.02, 6);
  }
  return { grupp: g };
}

function sang() {
  const g = new THREE.Group();
  const m = mat(TRA);
  box(g, 1.5, 0.35, 2.1, m, 0, 0.25, 0);
  box(g, 1.44, 0.2, 2.0, mat('#e8dcc2'), 0, 0.52, 0);
  box(g, 1.48, 0.06, 1.5, mat('#9a7b56'), 0, 0.64, 0.25);
  box(g, 0.5, 0.12, 0.3, mat('#f1e7d2'), -0.35, 0.68, -0.8); box(g, 0.5, 0.12, 0.3, mat('#f1e7d2'), 0.35, 0.68, -0.8);
  box(g, 1.5, 1.1, 0.08, m, 0, 0.95, -1.05);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) cyl(g, 0.04, 0.04, 2.2, m, sx * 0.72, 1.1, sz * 1.02, 8);
  box(g, 1.56, 0.12, 2.16, mat('#8a6a48'), 0, 2.2, 0);
  return { grupp: g };
}

function bokhylla(d) {
  const g = new THREE.Group();
  const m = mat(MORKTRA);
  const W = 1.1, H = 2.0, D = 0.35;
  box(g, W, H, 0.03, m, 0, H / 2, -D / 2 + 0.015);
  box(g, 0.04, H, D, m, -W / 2, H / 2, 0); box(g, 0.04, H, D, m, W / 2, H / 2, 0);
  const farger = ['#6a2a1a', '#2e3a4a', '#4a3a1a', '#3a4a2a', '#5a4630', '#7a5a2a'];
  for (let i = 0; i < 5; i++) {
    const y = 0.1 + i * 0.45;
    box(g, W, 0.03, D, m, 0, y, 0);
    if (i === 4) break;
    let x = -W / 2 + 0.05;
    let n = 0;
    while (x < W / 2 - 0.08) {
      const bw = 0.04 + ((n * 37) % 5) * 0.008, bh = 0.26 + ((n * 13) % 4) * 0.03;
      if (!(d.lucka && i === 2 && n >= 5 && n < 8)) box(g, bw, bh, 0.24, mat(farger[(n + i) % farger.length]), x + bw / 2, y + 0.015 + bh / 2, 0.02);
      x += bw + 0.004; n++;
    }
  }
  return { grupp: g };
}

function stol(d) {
  const g = new THREE.Group();
  const m = mat(d.farg || '#4a2e18');
  box(g, 0.45, 0.05, 0.45, m, 0, 0.46, 0);
  box(g, 0.45, 0.04, 0.3, mat(d.dyna || '#b49a6a'), 0, 0.5, 0.0);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) box(g, 0.04, 0.46, 0.04, m, sx * 0.19, 0.23, sz * 0.19);
  box(g, 0.04, 0.55, 0.04, m, -0.19, 0.75, -0.2); box(g, 0.04, 0.55, 0.04, m, 0.19, 0.75, -0.2);
  for (let i = 0; i < 3; i++) box(g, 0.38, 0.05, 0.02, m, 0, 0.6 + i * 0.16, -0.2);
  if (d.nummer) {
    const s = plan(g, 0.14, 0.14, mat('#ffffff', { map: T.siffra(String(d.nummer)), transparent: true }), 0, 0.88, -0.225, 0, Math.PI);
    s.renderOrder = 2;
    const s2 = plan(g, 0.14, 0.14, mat('#ffffff', { map: T.siffra(String(d.nummer)), transparent: true }), 0, 0.88, -0.185);
    s2.renderOrder = 2;
  }
  return { grupp: g };
}

function stolModern(d) {
  const g = new THREE.Group();
  const m = mat(d.farg || '#e8e2d2');
  box(g, 0.44, 0.04, 0.42, m, 0, 0.45, 0);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) box(g, 0.035, 0.45, 0.035, m, sx * 0.19, 0.225, sz * 0.18);
  for (let i = 0; i < 4; i++) box(g, 0.025, 0.45, 0.025, m, -0.15 + i * 0.1, 0.7, -0.19);
  box(g, 0.44, 0.04, 0.04, m, 0, 0.93, -0.19);
  return { grupp: g };
}

function fatolj() {
  const g = new THREE.Group();
  const m = mat(TYG), b = mat(MORKTRA);
  box(g, 0.8, 0.2, 0.75, m, 0, 0.35, 0);
  box(g, 0.8, 0.7, 0.18, m, 0, 0.75, -0.3, -0.12);
  box(g, 0.14, 0.32, 0.7, m, -0.36, 0.55, 0); box(g, 0.14, 0.32, 0.7, m, 0.36, 0.55, 0);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) box(g, 0.06, 0.25, 0.06, b, sx * 0.33, 0.125, sz * 0.3);
  box(g, 0.3, 0.5, 0.03, mat('#2d3550'), 0.38, 0.55, 0.1, 0, 0, 0.3).userData.behall = true; // sjal (står kvar med 3D-modell)
  return { grupp: g };
}

function langbord(d, ctx) {
  const g = new THREE.Group();
  const [w, h, l] = d.storlek || [1.1, 0.76, 4];
  box(g, w, 0.06, l, mat(TRA), 0, h - 0.03, 0);
  box(g, w + 0.1, 0.012, l + 0.1, mat('#ffffff', { map: T.duk() }), 0, h + 0.006, 0);
  box(g, w + 0.1, 0.25, 0.01, mat('#e6dac0'), 0, h - 0.12, l / 2 + 0.05); box(g, w + 0.1, 0.25, 0.01, mat('#e6dac0'), 0, h - 0.12, -l / 2 - 0.05);
  box(g, 0.01, 0.25, l + 0.1, mat('#e6dac0'), w / 2 + 0.05, h - 0.12, 0); box(g, 0.01, 0.25, l + 0.1, mat('#e6dac0'), -w / 2 - 0.05, h - 0.12, 0);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) box(g, 0.07, h - 0.06, 0.07, mat(MORKTRA), sx * (w / 2 - 0.08), (h - 0.06) / 2, sz * (l / 2 - 0.1));
  const tall = mat('#f3eee2'), kant = mat('#b89a5a');
  const kuvert = d.kuvert || 0;
  const perSida = Math.ceil(kuvert / 2);
  for (let i = 0; i < kuvert; i++) {
    const sida = i % 2 ? 1 : -1, idx = Math.floor(i / 2);
    const z = -l / 2 + 0.4 + (idx * (l - 0.8)) / Math.max(1, perSida - 1);
    cyl(g, 0.12, 0.12, 0.015, kant, sida * (w / 2 - 0.2), h + 0.015, z, 14);
    cyl(g, 0.1, 0.1, 0.017, tall, sida * (w / 2 - 0.2), h + 0.017, z, 14);
  }
  for (const z of d.ljusstakar || []) prefabs.ljusstake({}, ctx, g, new THREE.Vector3(0, h + 0.01, z));
  if (d.stolar) {
    for (let i = 0; i < kuvert; i++) {
      const sida = i % 2 ? 1 : -1, idx = Math.floor(i / 2);
      const z = -l / 2 + 0.4 + (idx * (l - 0.8)) / Math.max(1, perSida - 1);
      const s = prefabs.stol({}).grupp; s.position.set(sida * (w / 2 + 0.3), 0, z); s.rotation.y = sida * -Math.PI / 2; g.add(s);
    }
  }
  return { grupp: g };
}

function skank(d) {
  const g = new THREE.Group();
  const [w, h, dj] = d.storlek || [1.6, 0.95, 0.5];
  box(g, w, h - 0.12, dj, mat(TRA), 0, (h - 0.12) / 2 + 0.12, 0);
  box(g, w + 0.06, 0.04, dj + 0.06, mat(MORKTRA), 0, h - 0.02, 0);
  for (let i = 0; i < 3; i++) box(g, w / 3 - 0.06, h - 0.3, 0.01, mat('#4a2e16'), -w / 3 + i * (w / 3), h / 2 + 0.03, dj / 2 + 0.005);
  for (const sx of [-1, 1]) box(g, 0.06, 0.12, 0.06, mat(MORKTRA), sx * (w / 2 - 0.06), 0.06, 0);
  return { grupp: g };
}

function hylla(d) {
  const g = new THREE.Group();
  const m = mat(TRA);
  const W = d.storlek?.[0] || 1.4;
  box(g, W, 2.0, 0.03, m, 0, 1.0, -0.2);
  const burk = [mat('#c9a35a', { transparent: true, opacity: 0.85 }), mat('#8a3a2a', { transparent: true, opacity: 0.85 }), mat('#6a7a3a', { transparent: true, opacity: 0.85 })];
  for (let i = 0; i < 4; i++) {
    const y = 0.3 + i * 0.5; box(g, W, 0.03, 0.4, m, 0, y, 0);
    for (let x = -W / 2 + 0.12; x < W / 2 - 0.1; x += 0.17) cyl(g, 0.05, 0.05, 0.16, burk[(Math.round(x * 10) + i) % 3], x, y + 0.095, 0, 8);
  }
  return { grupp: g };
}

function pulpet() {
  const g = new THREE.Group();
  const m = mat(TRA);
  box(g, 0.7, 1.0, 0.5, m, 0, 0.5, 0);
  const top = new THREE.Group(); top.position.set(0, 1.05, 0); top.rotation.x = 0.25; g.add(top);
  box(top, 0.8, 0.05, 0.6, m, 0, 0, 0);
  box(top, 0.32, 0.02, 0.42, mat('#ffffff', { map: T.papper() }), -0.17, 0.035, 0, 0, 0, 0.06);
  box(top, 0.32, 0.02, 0.42, mat('#ffffff', { map: T.papper() }), 0.17, 0.035, 0, 0, 0, -0.06);
  cyl(g, 0.04, 0.045, 0.07, mat('#1a1a22'), -0.3, 1.16, -0.2, 8);
  return { grupp: g };
}

function koj(d) {
  const g = new THREE.Group();
  const [w, l] = [d.bredd || 0.8, d.langd || 1.9];
  const tra = mat(MAHOGNY);
  box(g, w, 0.42, l, tra, 0, 0.21, 0);
  box(g, w - 0.04, 0.12, l - 0.04, mat(d.tyg || '#2e3a5a'), 0, 0.48, 0);
  box(g, w - 0.08, 0.04, l - 0.3, mat('#e8dcc2'), 0, 0.56, 0.1);
  box(g, w - 0.2, 0.1, 0.32, mat('#f1e7d2'), 0, 0.6, -l / 2 + 0.25);
  if (d.overkoj !== false) { box(g, w, 0.06, l, tra, 0, 1.55, 0); box(g, w - 0.04, 0.1, l - 0.04, mat(d.tyg || '#2e3a5a'), 0, 1.63, 0); }
  return { grupp: g };
}

function sittbank(d) {
  const g = new THREE.Group();
  const w = d.bredd || 1.0;
  const tyg = mat(d.tyg || '#3d4a36'), tra = mat(MAHOGNY);
  box(g, w, 0.42, 0.5, tra, 0, 0.21, 0);
  box(g, w - 0.04, 0.1, 0.46, tyg, 0, 0.47, 0.01);
  box(g, w, 0.7, 0.1, tra, 0, 0.8, -0.22);
  box(g, w - 0.06, 0.55, 0.06, tyg, 0, 0.8, -0.16);
  return { grupp: g };
}

function bardisk(d) {
  const g = new THREE.Group();
  const [w, h, dj] = d.storlek || [1.6, 1.05, 0.55];
  box(g, w, h - 0.05, dj, mat(d.farg || MAHOGNY), 0, (h - 0.05) / 2, 0);
  box(g, w + 0.08, 0.05, dj + 0.08, mat(d.skiva || '#2a120a'), 0, h - 0.025, 0);
  for (let i = 0; i < 3; i++) box(g, w / 3 - 0.08, h - 0.3, 0.01, mat('#3a1a0e'), -w / 3 + i * (w / 3), h / 2, dj / 2 + 0.005);
  return { grupp: g };
}

function nyckelskap() {
  const g = new THREE.Group();
  const m = mat(TRA);
  box(g, 0.6, 0.7, 0.14, m, 0, 0, 0.07);
  box(g, 0.52, 0.62, 0.01, mat('#3a2210'), 0, 0, 0.145);
  const nyckel = mat('#6a5a40', { emissive: '#120c04' });
  for (let r = 0; r < 2; r++) for (let c = 0; c < 4; c++) {
    if (r === 1 && c === 3) continue;
    cyl(g, 0.008, 0.008, 0.16, nyckel, -0.18 + c * 0.12, 0.12 - r * 0.28, 0.16, 6);
    const ogla = new THREE.Mesh(new THREE.TorusGeometry(0.025, 0.007, 6, 10), nyckel); ogla.position.set(-0.18 + c * 0.12, 0.22 - r * 0.28, 0.16); g.add(ogla);
  }
  const lucka = new THREE.Group(); lucka.position.set(0.3, 0, 0.15); lucka.rotation.y = 1.2; g.add(lucka);
  box(lucka, 0.6, 0.7, 0.03, m, -0.3, 0, 0);
  plan(lucka, 0.5, 0.6, glas(), -0.3, 0, 0.02);
  return { grupp: g, kollision: false };
}

function krokar(d) {
  const g = new THREE.Group();
  box(g, 1.2, 0.1, 0.04, mat(TRA), 0, 0, 0.02);
  for (let i = 0; i < 5; i++) { box(g, 0.02, 0.1, 0.02, massing(), -0.48 + i * 0.24, -0.02, 0.07, 0.6, 0, 0); }
  if (d.handskar) for (let i = 0; i < 2; i++) {
    box(g, 0.1, 0.24, 0.02, mat('#f4f1e8'), -0.48 + i * 0.24, -0.16, 0.08, 0, 0, 0.08);
    box(g, 0.1, 0.22, 0.02, mat('#ece6d8'), -0.44 + i * 0.24, -0.15, 0.1, 0, 0, -0.1);
  }
  return { grupp: g, kollision: false };
}

/** Urmakarbänk med lupp, verktyg och en liten lampa. */
function arbetsbank(d, ctx) {
  const g = new THREE.Group();
  const W = d.bredd || 1.4;
  const tra = mat(TRA);
  box(g, W, 0.06, 0.6, tra, 0, 0.9, 0);
  box(g, W, 0.86, 0.04, mat(MORKTRA), 0, 0.45, -0.28);
  for (const sx of [-1, 1]) box(g, 0.05, 0.9, 0.56, tra, sx * (W / 2 - 0.03), 0.45, 0);
  for (let i = 0; i < 4; i++) { box(g, 0.32, 0.1, 0.02, mat(MORKTRA), -W / 2 + 0.25 + i * 0.3, 0.8, 0.3); sph(g, 0.012, massing(), -W / 2 + 0.25 + i * 0.3, 0.8, 0.315, 6); }
  for (let i = 0; i < 7; i++) { const v = box(g, 0.12, 0.008, 0.012, mat('#9a9a96'), -0.4 + i * 0.07, 0.935, 0.12); v.rotation.y = i * 0.3; }
  const lupp = cyl(g, 0.025, 0.03, 0.04, mat('#1a1a1a'), 0.2, 0.95, 0.05, 10); void lupp;
  const urverk = cyl(g, 0.06, 0.06, 0.02, massing(), 0.0, 0.94, -0.05, 16); void urverk;
  // Lampa
  cyl(g, 0.012, 0.012, 0.4, mat(JARN), 0.5, 1.13, -0.15, 6);
  cyl(g, 0.02, 0.1, 0.08, mat('#2a3a2a'), 0.5, 1.33, -0.05, 12);
  sph(g, 0.03, flamma(), 0.5, 1.29, -0.05, 6);
  if (d.ljus !== false) ctx.ljus(g, new THREE.Vector3(0.5, 1.2, 0.05), '#ffc070', d.styrka ?? 1.8, 4, true);
  return { grupp: g };
}

/** Hylla med små ur på väggen. */
function urhylla(d) {
  const g = new THREE.Group();
  const W = d.bredd || 1.4;
  const tra = mat(TRA);
  for (const y of [1.2, 1.65]) {
    box(g, W, 0.03, 0.22, tra, 0, y, 0.11);
    for (let i = 0; i < 5; i++) {
      const x = -W / 2 + 0.16 + i * (W - 0.3) / 4;
      box(g, 0.16, 0.2, 0.1, mat(i % 2 ? '#6a3a1a' : '#3a2412'), x, y + 0.115, 0.1);
      plan(g, 0.1, 0.1, mat('#ffffff', { map: T.urtavlaTid((i * 3 + 10) % 12, (i * 17 + (y > 1.5 ? 5 : 40)) % 60) }), x, y + 0.13, 0.152);
    }
  }
  return { grupp: g, kollision: false };
}

/** Glasmonter på ben. tom: bara ett tomt stativ på sammetsbädden. */
function monter(d) {
  const g = new THREE.Group();
  const W = d.bredd || 1.1, D = d.djup || 0.55;
  const tra = mat(MORKTRA);
  box(g, W, 0.08, D, tra, 0, 0.82, 0);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) box(g, 0.05, 0.82, 0.05, tra, sx * (W / 2 - 0.04), 0.41, sz * (D / 2 - 0.04));
  box(g, W - 0.06, 0.02, D - 0.06, mat('#5a1a22'), 0, 0.87, 0);
  box(g, W, 0.36, D, glas(), 0, 1.06, 0);
  for (const sx of [-1, 1]) box(g, 0.03, 0.36, 0.03, massing(), sx * W / 2, 1.06, D / 2);
  box(g, W, 0.03, 0.03, massing(), 0, 1.24, D / 2);
  box(g, 0.06, 0.06, 0.012, massing(), 0, 0.82, D / 2 + 0.006);
  // Stativ för kronometern
  cyl(g, 0.07, 0.09, 0.03, massing(), 0, 0.895, 0, 12);
  box(g, 0.02, 0.1, 0.02, massing(), 0, 0.95, -0.03);
  if (!d.tom) { const k = cyl(g, 0.07, 0.07, 0.03, massing(), 0, 0.98, 0, 16); k.rotation.x = Math.PI / 2; }
  for (let i = 0; i < 4; i++) { const u = cyl(g, 0.035, 0.035, 0.012, mat('#d8c890'), -W / 2 + 0.15 + i * 0.12 + (i > 1 ? 0.45 : 0), 0.89, 0.08, 12); void u; }
  return { grupp: g, haloPos: new THREE.Vector3(0, 1.0, 0) };
}

/** Järnspis med rör och glöd. */
function vedspis(d, ctx) {
  const g = new THREE.Group();
  const j = mat('#1c1c1e');
  box(g, 0.9, 0.75, 0.6, j, 0, 0.375, 0);
  box(g, 0.94, 0.04, 0.64, mat('#3a3a3c'), 0, 0.77, 0);
  for (const x of [-0.2, 0.2]) cyl(g, 0.13, 0.13, 0.015, mat('#2a2a2a'), x, 0.795, 0, 14);
  box(g, 0.3, 0.2, 0.01, mat('#ff7a2a', { emissive: '#b8400a' }), -0.15, 0.4, 0.305);
  for (let i = 0; i < 4; i++) box(g, 0.012, 0.2, 0.012, j, -0.27 + i * 0.08, 0.4, 0.31);
  cyl(g, 0.07, 0.07, 1.6, j, 0.3, 1.6, -0.2, 10);
  if (d.kanna !== false) { cyl(g, 0.08, 0.1, 0.18, mat('#8a6a3a', { emissive: '#1a1004' }), 0.2, 0.9, 0, 12); }
  ctx.ljus(g, new THREE.Vector3(-0.15, 0.5, 0.7), '#ff8a3a', d.styrka ?? 1.4, 4, true);
  return { grupp: g };
}

function eldstad(d, ctx) {
  const g = new THREE.Group();
  const m = mat(MARMOR);
  box(g, 1.7, 0.08, 0.45, m, 0, 1.12, 0.22);
  box(g, 0.3, 1.08, 0.36, m, -0.7, 0.54, 0.18); box(g, 0.3, 1.08, 0.36, m, 0.7, 0.54, 0.18);
  box(g, 1.1, 0.3, 0.36, m, 0, 0.93, 0.18);
  box(g, 1.1, 0.78, 0.3, mat('#140b05'), 0, 0.39, 0.12);
  box(g, 1.8, 0.04, 0.6, mat('#7c6e5c'), 0, 0.02, 0.3);
  for (let i = 0; i < 3; i++) { const k = cyl(g, 0.04, 0.04, 0.5, mat('#3a2412'), -0.15 + i * 0.12, 0.08, 0.15, 6); k.rotation.z = Math.PI / 2; k.rotation.y = i * 0.4; }
  box(g, 0.6, 0.06, 0.2, mat('#ff7a2a', { emissive: '#c43f0a' }), 0, 0.05, 0.15);
  ctx.ljus(g, new THREE.Vector3(0, 0.5, 0.6), '#ff8a3a', d.styrka ?? 2.2, 6, true);
  return { grupp: g };
}

Object.assign(prefabs, { matta, bord, byra, sang, bokhylla, stol, stolModern, fatolj, langbord, skank, hylla, pulpet, koj, sittbank, bardisk, nyckelskap, krokar, arbetsbank, urhylla, monter, vedspis, eldstad });
