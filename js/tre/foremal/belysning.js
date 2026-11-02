// Lampor och ljuskällor. Föremål med eget ljus använder ctx.ljus(...).
// Konventioner: se foremal/grund.js.
import * as THREE from '../../../vendor/three/three.module.min.js';
import { prefabs, mat, box, cyl, sph, massing, glas, flamma } from './grund.js';

function oljelampa(d, ctx) {
  const g = new THREE.Group();
  cyl(g, 0.07, 0.09, 0.06, massing(), 0, 0.03, 0, 10);
  cyl(g, 0.08, 0.05, 0.12, massing(), 0, 0.12, 0, 10);
  cyl(g, 0.03, 0.05, 0.22, glas(), 0, 0.3, 0, 10);
  sph(g, 0.022, flamma(), 0, 0.26, 0, 6);
  if (d.ljus) ctx.ljus(g, new THREE.Vector3(0, 0.35, 0), '#ffb768', d.styrka ?? 2.4, 7);
  return { grupp: g, kollision: false };
}

function ljusstake(d, ctx, foralder, pos) {
  const g = new THREE.Group();
  cyl(g, 0.07, 0.09, 0.03, massing(), 0, 0.015, 0, 10);
  cyl(g, 0.015, 0.015, 0.3, massing(), 0, 0.17, 0, 6);
  box(g, 0.3, 0.02, 0.02, massing(), 0, 0.3, 0);
  for (const x of [-0.14, 0, 0.14]) {
    cyl(g, 0.016, 0.016, 0.16, mat('#f2ead8'), x, 0.4 + (x === 0 ? 0.04 : 0), 0, 6);
    sph(g, 0.014, flamma(), x, 0.5 + (x === 0 ? 0.04 : 0), 0, 5);
  }
  if (d.ljus) ctx.ljus(g, new THREE.Vector3(0, 0.6, 0), '#ffc27a', d.styrka ?? 1.6, 5, true);
  if (foralder) { g.position.copy(pos); foralder.add(g); }
  return { grupp: g, kollision: false };
}

function ljuskrona(d, ctx) {
  const g = new THREE.Group();
  cyl(g, 0.01, 0.01, 0.6, massing(), 0, -0.3, 0, 4);
  cyl(g, 0.35, 0.1, 0.08, massing(), 0, -0.65, 0, 12);
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    cyl(g, 0.015, 0.015, 0.12, mat('#f2ead8'), Math.sin(a) * 0.35, -0.55, Math.cos(a) * 0.35, 5);
    sph(g, 0.015, flamma(), Math.sin(a) * 0.35, -0.48, Math.cos(a) * 0.35, 5);
  }
  ctx.ljus(g, new THREE.Vector3(0, -0.6, 0), '#ffc983', d.styrka ?? 2.2, 9, true);
  return { grupp: g, kollision: false };
}

function vagglampa(d, ctx) {
  const g = new THREE.Group();
  box(g, 0.06, 0.12, 0.04, massing(), 0, 0, 0.02);
  cyl(g, 0.012, 0.012, 0.12, massing(), 0, 0.02, 0.08, 6).rotation.x = Math.PI / 2;
  cyl(g, 0.05, 0.07, 0.1, mat('#f6e6c0', { emissive: '#a07a30', transparent: true, opacity: 0.9 }), 0, 0.06, 0.15, 10);
  if (d.ljus !== false) ctx.ljus(g, new THREE.Vector3(0, 0.05, 0.3), d.farg || '#ffcf8a', d.styrka ?? 1.3, d.rackvidd ?? 5, !!d.flimrar);
  return { grupp: g, kollision: false };
}

/** Gaslykta på stolpe. */
function gaslykta(d, ctx) {
  const g = new THREE.Group();
  const j = mat('#1e2226');
  cyl(g, 0.06, 0.09, 0.3, j, 0, 0.15, 0, 8);
  cyl(g, 0.035, 0.045, 2.6, j, 0, 1.6, 0, 8);
  box(g, 0.3, 0.04, 0.3, j, 0, 2.95, 0);
  box(g, 0.24, 0.32, 0.24, mat('#ffe6a8', { emissive: '#d89a3a', transparent: true, opacity: 0.92 }), 0, 3.12, 0);
  cyl(g, 0.02, 0.2, 0.12, j, 0, 3.34, 0, 4);
  ctx.ljus(g, new THREE.Vector3(0, 3.0, 0), '#ffc27a', d.styrka ?? 3.2, d.rackvidd ?? 9, true);
  return { grupp: g };
}

/** Fyrlins med fotogenlåga: glasringar runt en ljuskälla. */
function lins(d, ctx) {
  const g = new THREE.Group();
  cyl(g, 0.35, 0.45, 0.8, mat('#3a3a36'), 0, 0.4, 0, 12);
  const glasM = mat('#e8f0e8', { transparent: true, opacity: 0.45, emissive: '#5a5030' });
  for (let i = 0; i < 7; i++) { const t = new THREE.Mesh(new THREE.TorusGeometry(0.42 - Math.abs(i - 3) * 0.05, 0.035, 6, 20), glasM); t.rotation.x = Math.PI / 2; t.position.y = 0.95 + i * 0.12; g.add(t); }
  cyl(g, 0.38, 0.38, 0.85, mat('#fff4d0', { transparent: true, opacity: 0.25, emissive: '#806a30' }), 0, 1.32, 0, 16);
  sph(g, 0.09, flamma(), 0, 1.32, 0, 8);
  cyl(g, 0.3, 0.3, 0.04, massing(), 0, 1.78, 0, 16);
  if (d.ljus !== false) ctx.ljus(g, new THREE.Vector3(0, 1.4, 0), '#ffdc8a', d.styrka ?? 3.5, 8, true);
  return { grupp: g };
}

Object.assign(prefabs, { oljelampa, ljusstake, ljuskrona, vagglampa, gaslykta, lins });
