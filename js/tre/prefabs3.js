// Föremål för nutid och utomhus: gård i Dalarna, midsommar, modern sal och kontor. Samma konventioner som prefabs.js.
import * as THREE from 'three';
import * as T from './texturer.js';
import { prefabs, mat, box, cyl, sph, plan, massing, glas } from './prefabs.js';

const FALU = '#8a2a1e', VIT = '#efe9dc';

/** Dagsljusfönster med spröjs, valfritt med gardiner. */
function dagfonster(d) {
  const g = new THREE.Group();
  const W = d.bredd || 1.0, H = d.hojd || 1.3, y0 = d.y0 ?? 0.9;
  plan(g, W, H, mat('#ffffff', { map: T.dagsljus(), emissive: '#3a3a30' }), 0, y0 + H / 2, 0.01);
  const ram = mat(d.ram || VIT);
  box(g, W + 0.12, 0.08, 0.1, ram, 0, y0 + H + 0.04, 0.04); box(g, W + 0.16, 0.05, 0.22, ram, 0, y0 - 0.02, 0.08);
  for (const sx of [-1, 1]) box(g, 0.06, H, 0.1, ram, sx * (W / 2 + 0.03), y0 + H / 2, 0.04);
  box(g, 0.04, H, 0.04, ram, 0, y0 + H / 2, 0.04); box(g, W, 0.04, 0.04, ram, 0, y0 + H / 2, 0.04);
  if (d.gardin) {
    const tyg = mat(d.gardin === true ? '#e6dcc2' : d.gardin);
    if (d.dragen) box(g, W + 0.2, H + 0.2, 0.03, tyg, 0, y0 + H / 2, 0.14);
    else for (const sx of [-1, 1]) box(g, 0.26, H + 0.4, 0.04, tyg, sx * (W / 2 + 0.2), y0 + H / 2, 0.14);
    box(g, W + 0.7, 0.03, 0.03, mat('#cfc4a8'), 0, y0 + H + 0.22, 0.16);
  }
  return { grupp: g, kollision: false };
}

/** Faluröd husfasad med vita knutar, fönster och dörr. Fasaden ligger i z=0 och vänder framsidan mot +z. */
function hus(d) {
  const g = new THREE.Group();
  const W = d.bredd || 8, H = d.hojd || 3.4, D = d.djup || 5;
  box(g, W, H, D, mat('#ffffff', { map: T.paneler(d.farg || FALU) }), 0, H / 2, -D / 2);
  for (const sx of [-1, 1]) box(g, 0.16, H, 0.16, mat(VIT), sx * (W / 2), H / 2, 0);
  // Sadeltak
  const tak = mat('#3a3a36');
  for (const s of [-1, 1]) { const t = box(g, W + 0.6, 0.12, D / 2 / Math.cos(0.6) + 0.4, tak, 0, H + (D / 4) * Math.tan(0.6), -D / 2 + s * D / 4); t.rotation.x = s * 0.6; }
  box(g, W + 0.2, 0.12, 0.08, mat(VIT), 0, H, 0.05);
  const fonster = d.fonster || [-2.6, -1.2, 1.4, 2.8];
  for (const x of fonster) {
    plan(g, 0.8, 1.0, mat('#2a3236', { emissive: '#101416' }), x, 1.6, 0.01);
    box(g, 0.94, 0.08, 0.06, mat(VIT), x, 2.12, 0.03); box(g, 0.94, 0.08, 0.1, mat(VIT), x, 1.08, 0.05);
    for (const sx of [-1, 0, 1]) box(g, 0.06, 1.0, 0.05, mat(VIT), x + sx * 0.44, 1.6, 0.03);
    box(g, 0.8, 0.04, 0.04, mat(VIT), x, 1.6, 0.03);
  }
  if (d.dorr !== false) {
    const dx = d.dorrX ?? 0;
    box(g, 1.0, 2.1, 0.06, mat('#2e4a3a'), dx, 1.05, 0.03);
    box(g, 1.2, 0.1, 0.1, mat(VIT), dx, 2.15, 0.05);
    box(g, 1.6, 0.18, 0.8, mat('#8a8070'), dx, 0.09, 0.4);
    sph(g, 0.04, massing(), dx + 0.36, 1.0, 0.08, 6);
  }
  return { grupp: g };
}

/** Personbil (kombi), framåt mot +z. */
function bil(d) {
  const g = new THREE.Group();
  const kaross = mat(d.farg || '#7a2a22'), svart = mat('#1a1a1c'), ruta = mat('#26303a', { emissive: '#0a0e12' }), krom = mat('#c8c8c0');
  box(g, 1.75, 0.6, 4.4, kaross, 0, 0.55, 0);
  box(g, 1.6, 0.55, 2.6, kaross, 0, 1.1, -0.4);
  box(g, 1.62, 0.42, 2.5, ruta, 0, 1.12, -0.4);
  box(g, 1.5, 0.4, 0.05, ruta, 0, 1.1, 0.92, -0.45, 0, 0);
  for (const sx of [-1, 1]) for (const sz of [-1.4, 1.4]) { const h = cyl(g, 0.33, 0.33, 0.24, svart, sx * 0.82, 0.33, sz, 12); h.rotation.z = Math.PI / 2; }
  box(g, 1.78, 0.12, 0.1, krom, 0, 0.45, 2.21); box(g, 1.78, 0.12, 0.1, krom, 0, 0.45, -2.21);
  for (const sx of [-1, 1]) box(g, 0.3, 0.12, 0.03, mat('#fff6d8', { emissive: '#6a6040' }), sx * 0.6, 0.66, 2.21);
  box(g, 0.5, 0.11, 0.02, mat('#ffffff', { map: T.skylt(d.regnr || 'ABC 123', { bredd: 256, hojd: 56, grund: '#f4f4f0', storlek: 34 }) }), 0, 0.42, 2.27);
  return { grupp: g };
}

/** Turistbuss. */
function buss(d) {
  const g = new THREE.Group();
  const kaross = mat(d.farg || '#e8e2d0'), rand = mat(d.rand || '#2e4a6a'), ruta = mat('#26303a', { emissive: '#0a0e12' }), svart = mat('#1a1a1c');
  const L = 11;
  box(g, 2.5, 2.9, L, kaross, 0, 1.75, 0);
  box(g, 2.52, 0.3, L, rand, 0, 1.0, 0);
  box(g, 2.54, 0.9, L - 1.2, ruta, 0, 2.4, -0.3);
  box(g, 2.3, 1.2, 0.05, ruta, 0, 2.2, L / 2 + 0.01);
  for (const sx of [-1, 1]) for (const sz of [-3.6, 3.4]) { const h = cyl(g, 0.5, 0.5, 0.3, svart, sx * 1.2, 0.5, sz, 12); h.rotation.z = Math.PI / 2; }
  if (d.text) box(g, 1.8, 0.3, 0.03, mat('#ffffff', { map: T.skylt(d.text, { bredd: 512, hojd: 80, grund: '#1a1a1a', farg: '#ffb030', storlek: 44, kant: false }) }), 0, 3.0, L / 2 + 0.02);
  return { grupp: g };
}

function bjork(d) {
  const g = new THREE.Group();
  const h = d.hojd || 5;
  cyl(g, 0.09, 0.14, h * 0.7, mat('#ffffff', { map: T.bjorkstam() }), 0, h * 0.35, 0, 8);
  const lov = mat(d.lov || '#6a8a3a');
  const r = (d.seed || 1) * 1.7;
  for (let i = 0; i < 6; i++) sph(g, 0.9 + ((i * 0.37 + r) % 0.5), lov, Math.sin(i * 1.9 + r) * 0.7, h * 0.65 + (i % 3) * 0.55, Math.cos(i * 1.9 + r) * 0.7, 7);
  return { grupp: g, kollision: true };
}

function gran(d) {
  const g = new THREE.Group();
  const h = d.hojd || 6, m = mat(d.farg || '#2e4a2a');
  cyl(g, 0.12, 0.16, 1.2, mat('#4a3020'), 0, 0.6, 0, 6);
  for (let i = 0; i < 4; i++) { const c = new THREE.Mesh(new THREE.ConeGeometry(1.5 - i * 0.32, h / 3, 8), m); c.position.y = 1.2 + i * (h / 5); g.add(c); }
  return { grupp: g };
}

/** Midsommarstång med kransar och band. */
function midsommarstang(d) {
  const g = new THREE.Group();
  const lov = mat('#4a6a2a'), blom = [mat('#e8d64a'), mat('#f2ece0'), mat('#a34a8a'), mat('#c23a2a')];
  const H = d.hojd || 6;
  cyl(g, 0.11, 0.13, H, lov, 0, H / 2, 0, 8);
  const tvar = box(g, 2.6, 0.18, 0.18, lov, 0, H * 0.72, 0);
  for (const sx of [-1, 1]) {
    const krans = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.09, 6, 14), lov); krans.position.set(sx * 1.05, H * 0.72 - 0.6, 0); g.add(krans);
    for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2; sph(g, 0.07, blom[i % 4], sx * 1.05 + Math.cos(a) * 0.55, H * 0.72 - 0.6 + Math.sin(a) * 0.55, 0.06, 5); }
  }
  for (let i = 0; i < 14; i++) sph(g, 0.06, blom[i % 4], Math.sin(i) * 0.09, 0.8 + i * 0.36, Math.cos(i) * 0.09, 5);
  const band = [mat('#2a4a8a'), mat('#e8c23a')];
  for (let i = 0; i < 4; i++) box(g, 0.05, 2.2, 0.01, band[i % 2], (i - 1.5) * 0.6, H * 0.72 - 1.1, 0.1, 0, 0, (i - 1.5) * 0.08);
  void tvar;
  return { grupp: g };
}

/** Gärdesgård längs x-axeln. */
function gardesgard(d) {
  const g = new THREE.Group();
  const L = d.langd || 6, m = mat('#7a6a52');
  for (let x = -L / 2; x <= L / 2 + 0.01; x += 1.2) for (const s of [-1, 1]) { const p = box(g, 0.06, 1.3, 0.06, m, x + s * 0.04, 0.6, 0); p.rotation.z = s * 0.05; }
  for (let x = -L / 2 + 0.6; x < L / 2; x += 1.2) for (let i = 0; i < 4; i++) { const r = box(g, 1.6, 0.05, 0.05, m, x, 0.35 + i * 0.22, (i % 2 ? 0.04 : -0.04)); r.rotation.z = 0.5; }
  return { grupp: g, kollision: true };
}

/** Silverskål med två handtag. buckla: bucklan på kanten; s: S i handtaget. tom: bara en ljus ring där skålen stått. */
function skal(d) {
  const g = new THREE.Group();
  if (d.tom) { cyl(g, 0.13, 0.13, 0.004, mat('#c8b89a'), 0, 0.002, 0, 16); return { grupp: g, kollision: false }; }
  const silver = mat('#d8d6cc', { emissive: '#3a3a36' });
  cyl(g, 0.06, 0.07, 0.03, silver, 0, 0.015, 0, 14);
  const k = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 8, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), silver);
  k.scale.set(1, 0.7, 1); k.rotation.x = Math.PI; k.position.y = 0.135; g.add(k);
  const kant = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.008, 4, 24), silver); kant.rotation.x = Math.PI / 2; kant.position.y = 0.135; g.add(kant);
  if (d.buckla) box(g, 0.05, 0.02, 0.02, mat('#8a887e'), 0.13, 0.13, 0.06, 0, 0.4, 0.2);
  for (const sx of [-1, 1]) { const h = new THREE.Mesh(new THREE.TorusGeometry(0.04, 0.008, 4, 10, Math.PI), silver); h.position.set(sx * 0.17, 0.11, 0); h.rotation.z = -sx * Math.PI / 2; g.add(h); }
  return { grupp: g, kollision: false };
}

/** Bärbar dator, uppfälld, med en skärmbild (text) eller ett instagraminlägg. */
function dator(d) {
  const g = new THREE.Group();
  const gra = mat('#9a9a9e');
  box(g, 0.34, 0.015, 0.24, gra, 0, 0.008, 0);
  const lock = new THREE.Group(); lock.position.set(0, 0.015, -0.12); lock.rotation.x = -0.25; g.add(lock);
  box(lock, 0.34, 0.23, 0.01, gra, 0, 0.115, 0);
  plan(lock, 0.31, 0.2, mat('#ffffff', { map: T.skarm(d.skarm || 'insta'), emissive: '#808080' }), 0, 0.115, 0.006);
  return { grupp: g, kollision: false };
}

function mobil(d) {
  const g = new THREE.Group();
  box(g, 0.075, 0.008, 0.15, mat('#1a1a1c'), 0, 0.004, 0, 0, d.vrid || 0.3, 0);
  plan(g, 0.066, 0.138, mat('#ffffff', { map: T.skarm('foto'), emissive: '#606060' }), 0, 0.0085, 0, -Math.PI / 2, 0);
  g.children[1].rotation.z = d.vrid || 0.3;
  return { grupp: g, kollision: false };
}

function tarta(d) {
  const g = new THREE.Group();
  cyl(g, 0.17, 0.17, 0.01, mat('#d8d6cc'), 0, 0.005, 0, 16);
  cyl(g, 0.13, 0.13, 0.11, mat('#f6efe0'), 0, 0.065, 0, 16);
  for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2; sph(g, 0.022, mat('#c22a2a'), Math.cos(a) * 0.09, 0.13, Math.sin(a) * 0.09, 5); }
  return { grupp: g, kollision: false };
}

function dalahast(d) {
  const g = new THREE.Group();
  const m = mat(d.farg || '#b8281e');
  box(g, 0.08, 0.06, 0.16, m, 0, 0.1, 0); box(g, 0.06, 0.1, 0.05, m, 0, 0.16, 0.08); box(g, 0.05, 0.05, 0.06, m, 0, 0.2, 0.11);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) box(g, 0.025, 0.07, 0.025, m, sx * 0.025, 0.035, sz * 0.06);
  box(g, 0.04, 0.005, 0.1, mat('#e8c23a'), 0, 0.131, 0);
  return { grupp: g, kollision: false };
}

/** Pärm eller mapp, liggande. */
function parm(d) {
  const g = new THREE.Group();
  box(g, 0.24, 0.04, 0.3, mat(d.farg || '#2a4a6a'), 0, 0.02, 0);
  box(g, 0.22, 0.034, 0.28, mat('#f2ece0'), 0.008, 0.02, 0);
  if (d.etikett) plan(g, 0.14, 0.05, mat('#ffffff', { map: T.skylt(d.etikett, { bredd: 256, hojd: 90, storlek: 30 }) }), 0, 0.041, 0, -Math.PI / 2, 0);
  return { grupp: g, kollision: false };
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

Object.assign(prefabs, { dagfonster, hus, bil, buss, bjork, gran, midsommarstang, gardesgard, skal, dator, mobil, tarta, dalahast, parm, stolModern });
