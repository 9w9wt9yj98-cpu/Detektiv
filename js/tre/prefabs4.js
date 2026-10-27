// Föremål för urmakeriet i Gamla stan (1897) och fyrplatsen på Gråskär (1931). Samma konventioner som prefabs.js.
import * as THREE from 'three';
import * as T from './texturer.js';
import { prefabs, mat, box, cyl, sph, plan, massing, glas, flamma } from './prefabs.js';

const TRA = '#5e3b20', MORKTRA = '#3d2614', JARN = '#2a2a2c';

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

/** Fönster med uppbruten fönsterlucka och snöyra utanför. Väggföremål. */
function lucka(d) {
  const g = new THREE.Group();
  const W = d.bredd || 0.9, H = d.hojd || 1.2, y0 = d.y0 ?? 0.9;
  plan(g, W, H, mat('#ffffff', { map: T.snostorm() }), 0, y0 + H / 2, 0.01);
  const ram = mat('#3a2a1c');
  box(g, W + 0.12, 0.08, 0.1, ram, 0, y0 + H + 0.04, 0.04); box(g, W + 0.16, 0.06, 0.24, ram, 0, y0 - 0.02, 0.1);
  for (const sx of [-1, 1]) box(g, 0.06, H, 0.1, ram, sx * (W / 2 + 0.03), y0 + H / 2, 0.04);
  box(g, 0.04, H, 0.04, ram, 0, y0 + H / 2, 0.04);
  // Snö på fönsterbrädan
  box(g, W, 0.03, 0.2, mat('#eef2f6'), 0, y0 + 0.02, 0.12);
  // Luckan: den ena halvan hänger snett i ett gångjärn, den andra ligger på golvet
  const lm = mat('#4a3a2a');
  const hang = box(g, W / 2, H * 0.95, 0.04, lm, -W / 2 - W / 4 + 0.02, y0 + H / 2 - 0.1, 0.32); hang.rotation.set(0.05, 1.2, 0.12);
  const golvL = box(g, W / 2, 0.04, H * 0.9, lm, 0.25, 0.03, 0.75); golvL.rotation.y = 0.4;
  const jarn = mat('#6a6a6a');
  const bryt = box(g, 0.05, 0.02, 0.02, jarn, W / 2 - 0.05, y0 + H / 2, 0.12); bryt.rotation.z = 0.4;
  for (let i = 0; i < 6; i++) { const s = box(g, 0.08, 0.01, 0.015, mat('#c8a878'), 0.1 + (i % 3) * 0.12, 0.01, 0.5 + i * 0.07); s.rotation.y = i; }
  return { grupp: g, kollision: false, haloPos: new THREE.Vector3(W / 2, y0 + H / 2, 0.15) };
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

/** Spiraltrappa runt en mittpelare. */
function spiraltrappa(d) {
  const g = new THREE.Group();
  const R = d.radie || 1.0, H = d.hojd || 3.2, N = d.steg || 16, varv = d.varv ?? 0.9;
  const sten = mat('#9a9286'), jarn = mat(JARN);
  cyl(g, 0.12, 0.12, H, sten, 0, H / 2, 0, 10);
  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2 * varv, y = (i + 1) * (H / N);
    const s = box(g, R, 0.06, 0.32, sten, Math.cos(a) * R / 2, y, -Math.sin(a) * R / 2); s.rotation.y = a;
    cyl(g, 0.012, 0.012, 0.8, jarn, Math.cos(a) * R * 0.98, y + 0.4, -Math.sin(a) * R * 0.98, 4);
  }
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

/** Fönster mot stormen. Väggföremål. */
function stormfonster(d) {
  const g = new THREE.Group();
  const W = d.bredd || 0.8, H = d.hojd || 1.0, y0 = d.y0 ?? 1.0;
  plan(g, W, H, mat('#ffffff', { map: T.stormnatt(), emissive: '#0a0e12' }), 0, y0 + H / 2, 0.01);
  const ram = mat(d.ram || '#e8e2d2');
  box(g, W + 0.1, 0.07, 0.1, ram, 0, y0 + H + 0.035, 0.04); box(g, W + 0.14, 0.05, 0.2, ram, 0, y0 - 0.02, 0.08);
  for (const sx of [-1, 1]) box(g, 0.05, H, 0.1, ram, sx * (W / 2 + 0.025), y0 + H / 2, 0.04);
  box(g, 0.035, H, 0.04, ram, 0, y0 + H / 2, 0.04); box(g, W, 0.035, 0.04, ram, 0, y0 + H / 2, 0.04);
  return { grupp: g, kollision: false };
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

Object.assign(prefabs, { vaggur, monter, arbetsbank, lucka, handske, span, gaslykta, urhylla, liggare, vedspis, rock, spiraltrappa, lins, urverk, barograf, stormfonster, skrivdon, fotogen });
