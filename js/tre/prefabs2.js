// Fler föremål: personer, tåg, urmakeri, fyr och modern gård. Samma konventioner som prefabs.js.
import * as THREE from 'three';
import * as T from './texturer.js';
import { prefabs, mat, box, cyl, sph, plan, massing, glas, flamma } from './prefabs.js';

const HUD = ['#e8c4a0', '#d9b08c', '#c99a74', '#f0d2b4'];
const MAHOGNY = '#4a2216';

/** En enkel lågpolygon-figur. pose: sta | sitta | ligga. */
function person(d) {
  const ytter = new THREE.Group();
  const g = new THREE.Group(); ytter.add(g);
  const hud = mat(d.hud || HUD[(d.seed || 0) % HUD.length]);
  const rock = mat(d.rock || '#3b3a44'), byxa = mat(d.byxor || '#2a2a30'), skor = mat('#1a120c');
  const har = mat(d.har || '#4a3420');
  const kvinna = d.kon === 'k';
  const sitter = d.pose === 'sitta';
  const hy = sitter ? 0.46 : 0.86; // höftens höjd
  if (sitter) {
    for (const sx of [-1, 1]) {
      box(g, 0.13, 0.13, 0.44, kvinna ? rock : byxa, sx * 0.09, hy + 0.02, 0.16);
      box(g, 0.12, 0.44, 0.13, kvinna ? mat('#c8b49a') : byxa, sx * 0.09, 0.24, 0.36);
      box(g, 0.1, 0.06, 0.22, skor, sx * 0.09, 0.03, 0.42);
    }
  } else if (kvinna) {
    cyl(g, 0.16, 0.27, 0.62, rock, 0, hy - 0.22, 0, 12);
    for (const sx of [-1, 1]) { box(g, 0.08, 0.36, 0.09, mat('#c8b49a'), sx * 0.08, 0.2, 0); box(g, 0.09, 0.06, 0.2, skor, sx * 0.08, 0.03, 0.03); }
  } else {
    for (const sx of [-1, 1]) { box(g, 0.13, hy - 0.06, 0.15, byxa, sx * 0.09, (hy - 0.06) / 2 + 0.06, 0); box(g, 0.1, 0.06, 0.24, skor, sx * 0.09, 0.03, 0.04); }
  }
  const ty = hy + 0.31;
  box(g, kvinna ? 0.36 : 0.42, 0.62, 0.24, rock, 0, ty, 0);
  box(g, 0.12, 0.16, 0.01, mat(d.skjorta || '#efe6d2'), 0, ty + 0.2, 0.121);
  if (d.slips) box(g, 0.04, 0.14, 0.01, mat(d.slips), 0, ty + 0.17, 0.126);
  if (d.forklade) box(g, 0.32, 0.55, 0.01, mat('#f2ede0'), 0, ty - 0.2, 0.125);
  for (const sx of [-1, 1]) {
    const arm = box(g, 0.1, 0.58, 0.12, rock, sx * (kvinna ? 0.24 : 0.27), ty - 0.02, sitter ? 0.08 : 0, sitter ? -0.5 : 0, 0, sx * 0.06);
    void arm;
    sph(g, 0.05, hud, sx * (kvinna ? 0.25 : 0.28), sitter ? ty - 0.24 : ty - 0.33, sitter ? 0.22 : 0, 6);
  }
  const hh = ty + 0.31;
  cyl(g, 0.05, 0.05, 0.1, hud, 0, hh + 0.04, 0, 6);
  const huvud = sph(g, 0.115, hud, 0, hh + 0.17, 0, 10); huvud.scale.set(1, 1.12, 1);
  const harM = sph(g, 0.122, har, 0, hh + 0.21, -0.018, 10); harM.scale.set(1, 0.8, 1);
  if (kvinna) sph(g, 0.06, har, 0, hh + 0.2, -0.12, 8);
  if (d.skagg) { const s = sph(g, 0.08, har, 0, hh + 0.08, 0.06, 8); s.scale.set(1, 0.9, 0.7); }
  for (const sx of [-1, 1]) box(g, 0.02, 0.02, 0.01, mat('#1a120c'), sx * 0.04, hh + 0.18, 0.11);
  if (d.hatt === 'mossa') { cyl(g, 0.125, 0.12, 0.08, mat(d.hattfarg || '#1e2433'), 0, hh + 0.31, 0, 12); box(g, 0.16, 0.012, 0.09, mat('#111'), 0, hh + 0.27, 0.11); box(g, 0.1, 0.02, 0.005, massing(), 0, hh + 0.32, 0.124); }
  if (d.hatt === 'hatt') { cyl(g, 0.2, 0.2, 0.012, mat(d.hattfarg || '#2b2420'), 0, hh + 0.27, 0, 14); cyl(g, 0.1, 0.12, 0.13, mat(d.hattfarg || '#2b2420'), 0, hh + 0.34, 0, 12); }
  if (d.hatt === 'sjalett') { const s = sph(g, 0.13, mat(d.hattfarg || '#5a2e2a'), 0, hh + 0.2, -0.02, 10); s.scale.set(1.05, 0.95, 1.05); }
  if (d.glasogon) for (const sx of [-1, 1]) { const r = new THREE.Mesh(new THREE.TorusGeometry(0.025, 0.004, 4, 10), mat('#3a2a18')); r.position.set(sx * 0.04, hh + 0.18, 0.115); g.add(r); }
  if (d.pose === 'ligga') { g.rotation.x = -Math.PI / 2; g.position.set(0, d.lagHojd ?? 0.5, 0.8); }
  const topp = d.pose === 'ligga' ? new THREE.Vector3(0, (d.lagHojd ?? 0.5) + 0.35, 0.8 - (hh + 0.17)) : new THREE.Vector3(0, hh + 0.55, 0);
  return { grupp: ytter, haloPos: topp, kollision: d.pose !== 'ligga' && !sitter };
}

Object.assign(prefabs, {
  person,

  skylt(d) {
    const g = new THREE.Group();
    const [w, h] = d.storlek || [0.5, 0.18];
    const px = Math.round(512 * Math.min(1, w / Math.max(w, h)));
    const tex = T.skylt(d.text || '', { bredd: 512, hojd: Math.max(64, Math.round((512 * h) / w)), grund: d.grund || '#e9dcbc', farg: d.farg || '#2b1a0a', storlek: d.textstorlek || 44, kant: d.kant !== false, typsnitt: d.typsnitt || 'Georgia, serif' });
    void px;
    plan(g, w, h, mat('#ffffff', { map: tex }), 0, 0, 0.012);
    if (d.ram !== false) box(g, w + 0.03, h + 0.03, 0.015, mat(d.ramfarg || '#3a2412'), 0, 0, 0.002);
    return { grupp: g, kollision: false };
  },

  taeckt(d) {
    const g = new THREE.Group();
    const m = mat(d.farg || '#6a6458');
    const kropp = box(g, 0.48, 0.18, 1.5, m, 0, 0.09, 0.05); void kropp;
    const h = sph(g, 0.15, m, 0, 0.12, -0.78, 8); h.scale.set(1, 0.8, 1);
    for (const sx of [-1, 1]) { const f = sph(g, 0.09, m, sx * 0.1, 0.13, 0.8, 6); f.scale.set(1, 1.3, 1); }
    box(g, 0.52, 0.02, 1.7, mat('#5d574c'), 0, 0.01, 0);
    return { grupp: g, kollision: false };
  },

  koj(d) {
    const g = new THREE.Group();
    const [w, l] = [d.bredd || 0.8, d.langd || 1.9];
    const tra = mat(MAHOGNY);
    box(g, w, 0.42, l, tra, 0, 0.21, 0);
    box(g, w - 0.04, 0.12, l - 0.04, mat(d.tyg || '#2e3a5a'), 0, 0.48, 0);
    box(g, w - 0.08, 0.04, l - 0.3, mat('#e8dcc2'), 0, 0.56, 0.1);
    box(g, w - 0.2, 0.1, 0.32, mat('#f1e7d2'), 0, 0.6, -l / 2 + 0.25);
    if (d.overkoj !== false) { box(g, w, 0.06, l, tra, 0, 1.55, 0); box(g, w - 0.04, 0.1, l - 0.04, mat(d.tyg || '#2e3a5a'), 0, 1.63, 0); }
    return { grupp: g };
  },

  tagfonster(d) {
    const g = new THREE.Group();
    const W = d.bredd || 0.9, H = d.hojd || 0.75, y0 = d.y0 ?? 1.0;
    plan(g, W, H, mat('#ffffff', { map: T.snostorm() }), 0, y0 + H / 2, 0.01);
    if (d.isig !== false) plan(g, W, H, mat('#ffffff', { map: T.frost(), transparent: true, opacity: 0.9 }), 0, y0 + H / 2, 0.02);
    const ram = mat(d.ram || '#3a1a0e');
    box(g, W + 0.12, 0.07, 0.08, ram, 0, y0 + H + 0.03, 0.03); box(g, W + 0.12, 0.07, 0.1, ram, 0, y0 - 0.03, 0.04);
    box(g, 0.06, H, 0.08, ram, -W / 2 - 0.03, y0 + H / 2, 0.03); box(g, 0.06, H, 0.08, ram, W / 2 + 0.03, y0 + H / 2, 0.03);
    box(g, W, 0.03, 0.04, ram, 0, y0 + H * 0.72, 0.03);
    if (d.isig !== false) box(g, W - 0.02, 0.025, 0.05, mat('#dfe8f0', { emissive: '#1c2430' }), 0, y0 + 0.012, 0.05);
    const gard = mat(d.gardin || '#2e3a5a');
    box(g, 0.2, H + 0.25, 0.04, gard, -W / 2 - 0.1, y0 + H / 2 + 0.05, 0.09); box(g, 0.2, H + 0.25, 0.04, gard, W / 2 + 0.1, y0 + H / 2 + 0.05, 0.09);
    if (d.gardinspringa) box(g, W * 0.42, H * 0.95, 0.03, gard, -W * 0.27, y0 + H / 2, 0.07);
    return { grupp: g, kollision: false, haloPos: new THREE.Vector3(0, y0 + H / 2, 0.15) };
  },

  kupedorr(d) {
    const g = new THREE.Group();
    const tra = mat(d.farg || MAHOGNY), ram = mat('#2a120a');
    box(g, 0.95, 0.08, 0.1, ram, 0, 2.06, 0.03); box(g, 0.07, 2.06, 0.1, ram, -0.47, 1.03, 0.03); box(g, 0.07, 2.06, 0.1, ram, 0.47, 1.03, 0.03);
    const blad = new THREE.Group(); blad.position.set(d.oppen ? 0.55 : 0, 0, 0.04); g.add(blad);
    box(blad, 0.86, 2.0, 0.05, tra, 0, 1.0, 0);
    plan(blad, 0.5, 0.5, mat('#ffffff', { map: T.lader('#5a3020') }), 0, 1.45, 0.027);
    box(blad, 0.05, 0.2, 0.03, massing(), 0.36, 1.0, 0.04);
    if (d.morker || d.oppen) plan(g, 0.86, 2.0, mat('#0d0805'), d.oppen ? -0.2 : 0, 1.0, 0.012);
    if (d.nummer) { plan(g, 0.16, 0.12, mat('#ffffff', { map: T.skylt(String(d.nummer), { bredd: 128, hojd: 96, grund: '#d8b26a', storlek: 60 }) }), 0, 2.2, 0.05); }
    if (d.kedja) {
      const k = mat('#c9c2b0', { emissive: '#333' });
      const ogla = (x, y) => { const t = new THREE.Mesh(new THREE.TorusGeometry(0.018, 0.005, 4, 8), k); t.position.set(x, y, 0.08); blad.add(t); };
      box(blad, 0.08, 0.03, 0.02, massing(), 0.3, 1.25, 0.05);
      if (d.kedja === 'hakad') for (let i = 0; i < 6; i++) ogla(0.32 + i * 0.03, 1.25 - (i % 2) * 0.01);
      else { for (let i = 0; i < 4; i++) ogla(0.3, 1.22 - i * 0.032); }
      box(g, 0.05, 0.08, 0.03, massing(), 0.5, 1.25, 0.07);
    }
    return { grupp: g, kollision: false, haloPos: new THREE.Vector3(0.2, 1.3, 0.2) };
  },

  mellandorr(d) {
    const g = new THREE.Group();
    const tra = mat(d.farg || '#55291a');
    box(g, 0.7, 0.06, 0.08, mat('#2a120a'), 0, 1.93, 0.02);
    box(g, 0.62, 1.9, 0.05, tra, 0, 0.95, 0.03);
    for (const y of [0.5, 1.35]) box(g, 0.44, 0.6, 0.02, mat('#3e1c10'), 0, y, 0.06);
    // Regeln på den här sidan
    box(g, 0.05, 0.12, 0.03, massing(), 0.24, 1.05, 0.07);
    const regel = box(g, 0.16, 0.025, 0.025, massing(), d.regel === 'stangd' ? 0.3 : 0.18, 1.05, 0.09);
    void regel;
    box(g, 0.04, 0.06, 0.03, massing(), 0.36, 1.05, 0.07);
    return { grupp: g, kollision: false, haloPos: new THREE.Vector3(0.25, 1.1, 0.2) };
  },

  vagglampa(d, ctx) {
    const g = new THREE.Group();
    box(g, 0.06, 0.12, 0.04, massing(), 0, 0, 0.02);
    cyl(g, 0.012, 0.012, 0.12, massing(), 0, 0.02, 0.08, 6).rotation.x = Math.PI / 2;
    cyl(g, 0.05, 0.07, 0.1, mat('#f6e6c0', { emissive: '#a07a30', transparent: true, opacity: 0.9 }), 0, 0.06, 0.15, 10);
    if (d.ljus !== false) ctx.ljus(g, new THREE.Vector3(0, 0.05, 0.3), d.farg || '#ffcf8a', d.styrka ?? 1.3, d.rackvidd ?? 5, !!d.flimrar);
    return { grupp: g, kollision: false };
  },

  resvaska(d) {
    const g = new THREE.Group();
    const m = mat(d.farg || '#6a4224');
    box(g, 0.6, 0.38, 0.2, m, 0, 0.19, 0);
    for (const x of [-0.2, 0.2]) box(g, 0.04, 0.39, 0.21, mat('#3a2412'), x, 0.19, 0);
    const t = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.012, 6, 10, Math.PI), mat('#2a1a0e')); t.position.set(0, 0.38, 0); g.add(t);
    for (const x of [-0.12, 0.12]) box(g, 0.04, 0.03, 0.01, massing(), x, 0.33, 0.105);
    return { grupp: g, kollision: d.kollision ?? false };
  },

  kortlek() {
    const g = new THREE.Group();
    const vit = mat('#f4efe2'), rod = mat('#9a2a1e');
    box(g, 0.06, 0.02, 0.09, vit, -0.12, 0.01, 0);
    for (let i = 0; i < 7; i++) { const k = box(g, 0.06, 0.002, 0.09, i % 3 ? vit : rod, -0.02 + i * 0.035, 0.002 + i * 0.0005, 0.04 - (i % 2) * 0.03); k.rotation.y = (i - 3) * 0.2; }
    return { grupp: g, kollision: false };
  },

  bardisk(d) {
    const g = new THREE.Group();
    const [w, h, dj] = d.storlek || [1.6, 1.05, 0.55];
    box(g, w, h - 0.05, dj, mat(d.farg || MAHOGNY), 0, (h - 0.05) / 2, 0);
    box(g, w + 0.08, 0.05, dj + 0.08, mat(d.skiva || '#2a120a'), 0, h - 0.025, 0);
    for (let i = 0; i < 3; i++) box(g, w / 3 - 0.08, h - 0.3, 0.01, mat('#3a1a0e'), -w / 3 + i * (w / 3), h / 2, dj / 2 + 0.005);
    return { grupp: g };
  },

  sittbank(d) {
    const g = new THREE.Group();
    const w = d.bredd || 1.0;
    const tyg = mat(d.tyg || '#3d4a36'), tra = mat(MAHOGNY);
    box(g, w, 0.42, 0.5, tra, 0, 0.21, 0);
    box(g, w - 0.04, 0.1, 0.46, tyg, 0, 0.47, 0.01);
    box(g, w, 0.7, 0.1, tra, 0, 0.8, -0.22);
    box(g, w - 0.06, 0.55, 0.06, tyg, 0, 0.8, -0.16);
    return { grupp: g };
  },

  tavelkarta(d) {
    const g = new THREE.Group();
    const [w, h] = d.storlek || [0.7, 0.5];
    plan(g, w, h, mat('#ffffff', { map: T.skylt(d.text || '', { bredd: 512, hojd: Math.round((512 * h) / w), grund: d.grund || '#efe2c4', storlek: d.textstorlek || 26, kant: true, typsnitt: 'Georgia, serif' }) }), 0, 0, 0.012);
    box(g, w + 0.04, h + 0.04, 0.015, mat('#3a2412'), 0, 0, 0.002);
    return { grupp: g, kollision: false };
  },
});
export { person };
