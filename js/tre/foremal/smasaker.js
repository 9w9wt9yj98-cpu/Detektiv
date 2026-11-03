// Små föremål: det mesta som går att undersöka på bord, väggar och golv.
// Konventioner: se foremal/grund.js.
import * as THREE from '../../../vendor/three/three.module.min.js';
import * as T from '../texturer.js';
import { prefabs, mat, box, cyl, sph, plan, massing, glas, MORKTRA } from './grund.js';

function vas(d) {
  const g = new THREE.Group();
  const m = mat('#e4dccb'), blom = mat('#a33b2a'), stjalk = mat('#4c5a2a');
  if (d.valt) {
    const v = cyl(g, 0.06, 0.08, 0.28, m, 0, 0.08, 0, 10); v.rotation.z = Math.PI / 2; v.rotation.y = 0.5;
    // Vattnet och blommorna står kvar när en 3D-modell ersätter själva vasen (userData.behall).
    cyl(g, 0.14, 0.14, 0.003, mat('#4b5a5a', { transparent: true, opacity: 0.5 }), 0.05, 0.003, 0.15, 14).userData.behall = true;
    for (let i = 0; i < 4; i++) { sph(g, 0.03, blom, -0.05 + i * 0.07, 0.03, 0.22 + (i % 2) * 0.05, 6).userData.behall = true; box(g, 0.15, 0.008, 0.008, stjalk, -0.05 + i * 0.05, 0.02, 0.15, 0, i, 0).userData.behall = true; }
  } else {
    cyl(g, 0.06, 0.08, 0.28, m, 0, 0.14, 0, 10);
    for (let i = 0; i < 4; i++) sph(g, 0.035, blom, Math.sin(i * 2) * 0.06, 0.34 + (i % 2) * 0.05, Math.cos(i * 2) * 0.06, 6);
  }
  return { grupp: g, kollision: false };
}

function skrin(d) {
  const g = new THREE.Group();
  const m = mat('#4a2a14');
  box(g, 0.3, 0.12, 0.2, m, 0, 0.06, 0);
  box(g, 0.27, 0.01, 0.17, mat('#1d2340'), 0, 0.115, 0);
  const lock = new THREE.Group(); lock.position.set(0, 0.12, -0.1); g.add(lock);
  box(lock, 0.3, 0.04, 0.2, m, 0, 0.02, 0.1);
  box(lock, 0.27, 0.005, 0.17, mat('#1d2340'), 0, -0.001, 0.1);
  if (d.oppet !== false) lock.rotation.x = -1.9;
  box(g, 0.05, 0.04, 0.01, massing(), 0, 0.09, 0.101);
  box(g, 0.004, 0.06, 0.003, mat('#ffffff', { emissive: '#666' }), 0.012, 0.07, 0.106, 0, 0, 0.4); // tråden
  return { grupp: g, kollision: false };
}

/** Pendyl på spiselhyllan. tid: [h, m] (utan tid: en urtavla utan bestämd tid). */
function pendyl(d) {
  const g = new THREE.Group();
  box(g, 0.3, 0.32, 0.14, mat('#7a5418', { emissive: '#1c1004' }), 0, 0.16, 0);
  plan(g, 0.18, 0.18, mat('#ffffff', { map: d.tid ? T.urtavlaTid(d.tid[0], d.tid[1]) : T.urtavla() }), 0, 0.2, 0.072);
  sph(g, 0.06, massing(), 0, 0.37, 0, 8);
  return { grupp: g, kollision: false };
}

/** Väggur. tid: [h, m]. krossad: ligger på golvet med sprucken urtavla och glasskärvor. Väggföremål (origo i väggplanet). */
function vaggur(d) {
  const g = new THREE.Group();
  const inner = new THREE.Group(); g.add(inner);
  const [h, m] = d.tid || [10, 10];
  const fodral = mat(d.farg || '#5a3418');
  box(inner, 0.42, 0.95, 0.14, fodral, 0, 0, 0.07);
  box(inner, 0.48, 0.08, 0.17, fodral, 0, 0.5, 0.08);
  plan(inner, 0.3, 0.3, mat('#ffffff', { map: T.urtavlaTid(h, m, { sprucken: !!d.krossad }) }), 0, 0.22, 0.142);
  box(inner, 0.26, 0.4, 0.01, glas(), 0, -0.2, 0.142);
  cyl(inner, 0.006, 0.006, 0.3, massing(), 0, -0.12, 0.12, 6);
  const lod = cyl(inner, 0.06, 0.06, 0.012, massing(), 0, -0.3, 0.12, 14); lod.rotation.x = Math.PI / 2;
  if (d.krossad) {
    inner.rotation.set(-Math.PI / 2, 0, 0.5); inner.position.set(0, 0.08, 0.5);
    const glasM = mat('#dfe8ea', { transparent: true, opacity: 0.6 });
    for (let i = 0; i < 9; i++) { const s = box(g, 0.05 + (i % 3) * 0.02, 0.004, 0.03 + (i % 2) * 0.02, glasM, Math.sin(i * 2.3) * 0.45, 0.004, 0.45 + Math.cos(i * 1.7) * 0.35); s.rotation.y = i; }
    for (let i = 0; i < 4; i++) { const s = box(g, 0.12, 0.02, 0.03, fodral, -0.3 + i * 0.2, 0.01, 0.95 - i * 0.08); s.rotation.y = i * 0.8; }
    return { grupp: g, kollision: false, haloPos: new THREE.Vector3(0, 0.3, 0.5) };
  }
  return { grupp: g, kollision: false };
}

function tavla(d) {
  const g = new THREE.Group();
  const [w, h] = d.storlek || [1, 0.7];
  const ram = massing();
  plan(g, w, h, mat('#ffffff', { map: T.malning(d.seed || 71) }), 0, 0, 0.03);
  box(g, w + 0.12, 0.07, 0.05, ram, 0, h / 2 + 0.03, 0.03); box(g, w + 0.12, 0.07, 0.05, ram, 0, -h / 2 - 0.03, 0.03);
  box(g, 0.07, h, 0.05, ram, -w / 2 - 0.03, 0, 0.03); box(g, 0.07, h, 0.05, ram, w / 2 + 0.03, 0, 0.03);
  return { grupp: g, kollision: false };
}

function tavelkarta(d) {
  const g = new THREE.Group();
  const [w, h] = d.storlek || [0.7, 0.5];
  plan(g, w, h, mat('#ffffff', { map: T.skylt(d.text || '', { bredd: 512, hojd: Math.round((512 * h) / w), grund: d.grund || '#efe2c4', storlek: d.textstorlek || 26, kant: true, typsnitt: 'Georgia, serif' }) }), 0, 0, 0.012);
  box(g, w + 0.04, h + 0.04, 0.015, mat('#3a2412'), 0, 0, 0.002);
  return { grupp: g, kollision: false };
}

function askkopp() {
  const g = new THREE.Group();
  cyl(g, 0.09, 0.07, 0.04, glas(), 0, 0.02, 0, 12);
  cyl(g, 0.065, 0.065, 0.01, mat('#7d7a74'), 0, 0.03, 0, 10);
  box(g, 0.12, 0.012, 0.012, mat('#3a2412'), 0.06, 0.045, 0.02, 0, 0.5, 0); // pipa
  return { grupp: g, kollision: false };
}

function anteckningsbok() {
  const g = new THREE.Group();
  box(g, 0.24, 0.035, 0.32, mat('#ffffff', { map: T.lader() }), 0, 0.018, 0, 0, 0.25, 0);
  box(g, 0.22, 0.028, 0.3, mat('#efe2c4'), 0.008, 0.018, 0, 0, 0.25, 0);
  box(g, 0.04, 0.04, 0.03, massing(), 0.11, 0.02, 0.06, 0, 0.25, 0);
  const p = cyl(g, 0.006, 0.006, 0.18, mat('#2b1a0a'), -0.16, 0.008, 0.02, 6); p.rotation.z = Math.PI / 2; p.rotation.y = 0.6;
  return { grupp: g, kollision: false };
}

function flaska(d) {
  const g = new THREE.Group();
  const m = mat(d.farg || '#26301c', { emissive: '#050703' });
  cyl(g, 0.04, 0.04, 0.22, m, 0, 0.11, 0, 10);
  cyl(g, 0.015, 0.04, 0.06, m, 0, 0.25, 0, 10);
  cyl(g, 0.014, 0.014, 0.06, m, 0, 0.31, 0, 8);
  cyl(g, 0.016, 0.016, 0.03, mat('#7a1e14'), 0, 0.345, 0, 8);
  box(g, 0.06, 0.07, 0.002, mat('#e8dcc0'), 0, 0.12, 0.041);
  return { grupp: g, kollision: false };
}

function karaff() {
  const g = new THREE.Group();
  cyl(g, 0.06, 0.07, 0.16, mat('#d8b070', { transparent: true, opacity: 0.6 }), 0, 0.08, 0, 10);
  cyl(g, 0.02, 0.05, 0.08, glas(), 0, 0.2, 0, 10);
  sph(g, 0.035, glas(), 0, 0.27, 0, 8);
  return { grupp: g, kollision: false };
}

function papper(d) {
  const g = new THREE.Group();
  const n = d.antal || 1;
  for (let i = 0; i < n; i++) box(g, 0.22, 0.004, 0.3, mat('#ffffff', { map: T.papper() }), i * 0.02, 0.002 + i * 0.004, i * 0.015, 0, i * 0.12, 0);
  const p = cyl(g, 0.006, 0.006, 0.14, mat('#111'), 0.15, 0.008, 0.05, 6); p.rotation.z = Math.PI / 2; p.rotation.y = 0.8;
  return { grupp: g, kollision: false };
}

function vinglas(d) {
  const g = new THREE.Group();
  const m = mat('#e8f0f0', { transparent: true, opacity: 0.45 });
  const inner = new THREE.Group(); g.add(inner);
  cyl(inner, 0.035, 0.035, 0.005, m, 0, 0.003, 0, 10);
  cyl(inner, 0.005, 0.005, 0.09, m, 0, 0.05, 0, 6);
  cyl(inner, 0.04, 0.02, 0.08, m, 0, 0.13, 0, 10);
  if (d.valt) {
    inner.rotation.z = Math.PI / 2; inner.position.y = 0.04;
    cyl(g, 0.09, 0.09, 0.002, mat('#6a1a22', { transparent: true, opacity: 0.6 }), 0.12, 0.002, 0.02, 12);
  }
  if (d.pulver) cyl(g, 0.05, 0.05, 0.002, mat('#f6f3ea', { emissive: '#333' }), d.pulver[0], 0.004, d.pulver[1], 10);
  return { grupp: g, kollision: false };
}

function tallrik() {
  const g = new THREE.Group();
  cyl(g, 0.12, 0.12, 0.015, mat('#b89a5a'), 0, 0.008, 0, 14);
  cyl(g, 0.1, 0.1, 0.017, mat('#f3eee2'), 0, 0.009, 0, 14);
  return { grupp: g, kollision: false };
}

function placeringskort(d) {
  const g = new THREE.Group();
  const m = mat('#f4ecd8', { side: THREE.DoubleSide });
  plan(g, 0.1, 0.06, m, 0, 0.03, 0.01, -0.35); plan(g, 0.1, 0.06, m, 0, 0.03, -0.01, 0.35);
  if (d.liggande) g.rotation.z = Math.PI / 2.2;
  return { grupp: g, kollision: false };
}

function vaska() {
  const g = new THREE.Group();
  const m = mat('#1a1410');
  box(g, 0.42, 0.26, 0.2, m, 0, 0.13, 0);
  const t = new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.012, 6, 12, Math.PI), m); t.position.set(0, 0.26, 0); g.add(t);
  box(g, 0.44, 0.02, 0.22, massing(), 0, 0.25, 0);
  return { grupp: g, kollision: false };
}

function krukvaxt() {
  const g = new THREE.Group();
  cyl(g, 0.2, 0.15, 0.35, mat('#9a6a44'), 0, 0.175, 0, 10);
  const lov = mat('#4f5d2f');
  for (let i = 0; i < 5; i++) sph(g, 0.18, lov, Math.sin(i * 1.3) * 0.12, 0.5 + (i % 3) * 0.1, Math.cos(i * 1.3) * 0.12, 7);
  return { grupp: g };
}

function resvaska(d) {
  const g = new THREE.Group();
  const m = mat(d.farg || '#6a4224');
  box(g, 0.6, 0.38, 0.2, m, 0, 0.19, 0);
  for (const x of [-0.2, 0.2]) box(g, 0.04, 0.39, 0.21, mat('#3a2412'), x, 0.19, 0);
  const t = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.012, 6, 10, Math.PI), mat('#2a1a0e')); t.position.set(0, 0.38, 0); g.add(t);
  for (const x of [-0.12, 0.12]) box(g, 0.04, 0.03, 0.01, massing(), x, 0.33, 0.105);
  return { grupp: g, kollision: d.kollision ?? false };
}

function kortlek() {
  const g = new THREE.Group();
  const vit = mat('#f4efe2'), rod = mat('#9a2a1e');
  box(g, 0.06, 0.02, 0.09, vit, -0.12, 0.01, 0);
  for (let i = 0; i < 7; i++) { const k = box(g, 0.06, 0.002, 0.09, i % 3 ? vit : rod, -0.02 + i * 0.035, 0.002 + i * 0.0005, 0.04 - (i % 2) * 0.03); k.rotation.y = (i - 3) * 0.2; }
  return { grupp: g, kollision: false };
}

/** Uppslagen liggare eller loggbok. */
function liggare(d) {
  const g = new THREE.Group();
  const [w, l] = d.storlek || [0.42, 0.3];
  box(g, w + 0.02, 0.025, l + 0.02, mat(d.farg || '#4a2a1a'), 0, 0.012, 0);
  const sida = mat('#ffffff', { map: T.papper() });
  for (const sx of [-1, 1]) { const p = plan(g, w / 2 - 0.01, l, sida, sx * w / 4, 0.027, 0, -Math.PI / 2, 0); p.rotation.z = sx * 0.04; }
  box(g, 0.01, 0.03, l, mat('#2a1a0e'), 0, 0.02, 0);
  return { grupp: g, kollision: false, haloPos: new THREE.Vector3(0, 0.15, 0) };
}

/** Bläckhorn med reservoarpenna eller blyertspenna bredvid. */
function skrivdon(d) {
  const g = new THREE.Group();
  if (d.blackhorn !== false) { cyl(g, 0.035, 0.04, 0.05, mat('#1a2a4a', { emissive: '#05080f' }), 0, 0.025, 0, 10); cyl(g, 0.015, 0.015, 0.012, massing(), 0, 0.055, 0, 8); }
  const penna = cyl(g, 0.007, 0.007, 0.14, mat(d.penna === 'blyerts' ? '#c8a03a' : '#1a1a1a'), 0.08, 0.008, 0.02, 6); penna.rotation.z = Math.PI / 2; penna.rotation.y = 0.4;
  if (d.penna !== 'blyerts') box(g, 0.02, 0.006, 0.006, massing(), 0.14, 0.008, 0.045);
  return { grupp: g, kollision: false, haloPos: new THREE.Vector3(0.04, 0.12, 0) };
}

/** Fotogenkannor. */
function fotogen(d) {
  const g = new THREE.Group();
  const n = d.antal || 3;
  for (let i = 0; i < n; i++) { const x = (i - (n - 1) / 2) * 0.32; cyl(g, 0.13, 0.13, 0.42, mat(i % 2 ? '#5a6a4a' : '#6a4a2a'), x, 0.21, (i % 2) * 0.1, 12); cyl(g, 0.03, 0.03, 0.06, mat('#2a2a2a'), x + 0.06, 0.45, (i % 2) * 0.1, 6); }
  return { grupp: g };
}

function handske(d) {
  const g = new THREE.Group();
  const m = mat(d.farg || '#3a2a3a');
  box(g, 0.1, 0.015, 0.14, m, 0, 0.008, 0);
  for (let i = 0; i < 4; i++) box(g, 0.018, 0.012, 0.07, m, -0.035 + i * 0.023, 0.007, 0.1);
  box(g, 0.02, 0.012, 0.06, m, 0.06, 0.007, 0.02).rotation.y = -0.6;
  box(g, 0.1, 0.02, 0.05, m, 0, 0.01, -0.09);
  return { grupp: g, kollision: false, haloPos: new THREE.Vector3(0, 0.15, 0) };
}

/** Ekspån strödda på golvet. */
function span(d) {
  const g = new THREE.Group();
  const m = mat('#d9b880');
  const N = d.antal || 60, [w, l] = d.yta || [1.6, 1.2];
  const s = (i) => (Math.sin(i * 12.9898) * 43758.5453) % 1;
  for (let i = 0; i < N; i++) { const b = box(g, 0.03 + Math.abs(s(i)) * 0.03, 0.004, 0.012, m, s(i + 1) * w / 2, 0.003, s(i + 2) * l / 2); b.rotation.y = i; }
  const hit = new THREE.Mesh(new THREE.PlaneGeometry(w * 0.6, l * 0.6), new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }));
  hit.rotation.x = -Math.PI / 2; hit.position.y = 0.01; g.add(hit);
  return { grupp: g, kollision: false, haloPos: new THREE.Vector3(0, 0.2, 0) };
}

/** Rock som hänger på en krok. Väggföremål. */
function rock(d) {
  const g = new THREE.Group();
  const m = mat(d.farg || '#2a2a34');
  box(g, 0.1, 0.03, 0.08, massing(), 0, 1.8, 0.04);
  box(g, 0.46, 0.18, 0.16, m, 0, 1.66, 0.1);
  const k = box(g, 0.5, 0.9, 0.14, m, 0, 1.12, 0.1); k.scale.x = 0.92;
  for (const sx of [-1, 1]) box(g, 0.1, 0.7, 0.12, m, sx * 0.25, 1.25, 0.1);
  box(g, 0.08, 0.3, 0.02, mat('#1a1a22'), -0.06, 1.5, 0.18).rotation.z = 0.2;
  box(g, 0.08, 0.3, 0.02, mat('#1a1a22'), 0.06, 1.5, 0.18).rotation.z = -0.2;
  if (d.span) for (let i = 0; i < 6; i++) box(g, 0.02, 0.004, 0.008, mat('#e0c088'), -0.06 + i * 0.025, 1.45 - (i % 3) * 0.04, 0.19);
  return { grupp: g, kollision: false, haloPos: new THREE.Vector3(0, 1.4, 0.2) };
}

function livre() {
  const g = new THREE.Group();
  const m = mat('#1e2433');
  box(g, 0.5, 0.9, 0.16, m, 0, -0.5, 0.1);
  box(g, 0.14, 0.7, 0.14, m, -0.3, -0.45, 0.1, 0, 0, 0.1); box(g, 0.14, 0.7, 0.14, m, 0.3, -0.45, 0.1, 0, 0, -0.1);
  for (let i = 0; i < 4; i++) sph(g, 0.02, massing(), 0.06, -0.2 - i * 0.16, 0.19, 6);
  return { grupp: g, kollision: false };
}

function fotspar(d) {
  const g = new THREE.Group();
  const pts = d.punkter || [];
  const geo = new THREE.CircleGeometry(0.05, 8);
  const m = mat('#8a6a3a', { transparent: true, opacity: 0.8 });
  let steg = 0;
  const osynlig = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false });
  for (let i = 0; i < pts.length - 1; i++) {
    const [x1, z1] = pts[i], [x2, z2] = pts[i + 1];
    const dx = x2 - x1, dz = z2 - z1, len = Math.hypot(dx, dz), ang = Math.atan2(dx, dz);
    const nx = dz / len, nz = -dx / len;
    for (let t = 0; t < len; t += 0.32) {
      const sida = steg++ % 2 ? 1 : -1;
      const x = x1 + (dx * t) / len + nx * 0.08 * sida, z = z1 + (dz * t) / len + nz * 0.08 * sida;
      const p = new THREE.Mesh(geo, m); p.scale.set(0.8, 1.8, 1); p.rotation.set(-Math.PI / 2, 0, ang); p.position.set(x, 0.012, z); g.add(p);
    }
    const hit = new THREE.Mesh(new THREE.PlaneGeometry(0.6, len), osynlig);
    hit.rotation.set(-Math.PI / 2, 0, ang); hit.position.set((x1 + x2) / 2, 0.02, (z1 + z2) / 2); g.add(hit);
  }
  return { grupp: g, kollision: false, haloPos: pts.length ? new THREE.Vector3(pts[1 % pts.length][0], 0.25, pts[1 % pts.length][1]) : null };
}

function taeckt(d) {
  const g = new THREE.Group();
  const m = mat(d.farg || '#6a6458');
  const kropp = box(g, 0.48, 0.18, 1.5, m, 0, 0.09, 0.05); void kropp;
  const h = sph(g, 0.15, m, 0, 0.12, -0.78, 8); h.scale.set(1, 0.8, 1);
  for (const sx of [-1, 1]) { const f = sph(g, 0.09, m, sx * 0.1, 0.13, 0.8, 6); f.scale.set(1, 1.3, 1); }
  box(g, 0.52, 0.02, 1.7, mat('#5d574c'), 0, 0.01, 0);
  return { grupp: g, kollision: false };
}

/** Urverket som vrider linsen: ett järnhus med kugghjul och lod i kedja. */
function urverk(d) {
  const g = new THREE.Group();
  const j = mat('#2e2e30');
  box(g, 0.6, 0.5, 0.4, j, 0, 0.75, 0);
  for (const sx of [-1, 1]) box(g, 0.04, 0.5, 0.04, j, sx * 0.28, 0.25, 0.18);
  for (let i = 0; i < 3; i++) { const k = cyl(g, 0.1 + i * 0.03, 0.1 + i * 0.03, 0.02, massing(), -0.15 + i * 0.15, 0.78, 0.21, 14); k.rotation.x = Math.PI / 2; }
  const vev = box(g, 0.02, 0.18, 0.02, massing(), 0.32, 0.8, 0.1); vev.rotation.z = 0.6;
  cyl(g, 0.006, 0.006, 0.5, j, 0.2, 0.25, 0.0, 4);
  cyl(g, 0.06, 0.06, 0.16, j, 0.2, 0.05, 0.0, 10);
  return { grupp: g, haloPos: new THREE.Vector3(0, 1.1, 0.2) };
}

/** Barograf: trumma med pappersrulle under glaskupa. */
function barograf(d) {
  const g = new THREE.Group();
  box(g, 0.36, 0.06, 0.2, mat(MORKTRA), 0, 0.03, 0);
  const tr = cyl(g, 0.05, 0.05, 0.12, mat('#ffffff', { map: T.papper() }), 0.08, 0.12, 0, 16); void tr;
  box(g, 0.14, 0.04, 0.08, massing(), -0.1, 0.1, 0);
  const arm = box(g, 0.16, 0.004, 0.006, mat('#2a2a2a'), 0.0, 0.14, 0.04); arm.rotation.y = 0.1;
  box(g, 0.35, 0.18, 0.19, glas(), 0, 0.15, 0);
  return { grupp: g, kollision: false, haloPos: new THREE.Vector3(0, 0.3, 0) };
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

Object.assign(prefabs, { vas, skrin, pendyl, vaggur, tavla, tavelkarta, askkopp, anteckningsbok, flaska, karaff, papper, vinglas, tallrik, placeringskort, vaska, krukvaxt, resvaska, kortlek, liggare, skrivdon, fotogen, handske, span, rock, livre, fotspar, taeckt, urverk, barograf, skal, dator, mobil, tarta, dalahast, parm });
