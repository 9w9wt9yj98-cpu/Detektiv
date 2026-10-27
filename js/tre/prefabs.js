// Bibliotek med enkla föremål byggda av primitiver. Fallens JSON refererar till dem via "typ".
// Konvention: föremålets framsida pekar mot +z, origo i golvhöjd mitt under föremålet
// (väggföremål: origo i väggplanet). "rot" i JSON vrider runt y-axeln i grader.
import * as THREE from 'three';
import * as T from './texturer.js';

const geoCache = new Map();
const matCache = new Map();

export function mat(farg, { map = null, emissive = null, transparent = false, opacity = 1, side = THREE.FrontSide } = {}) {
  const k = [farg, map?.uuid, emissive, transparent, opacity, side].join('|');
  if (!matCache.has(k)) {
    const m = new THREE.MeshLambertMaterial({ color: farg, map, transparent, opacity, side });
    if (emissive) { m.emissive = new THREE.Color(emissive); m.emissiveIntensity = 1; }
    if (transparent) m.depthWrite = false;
    matCache.set(k, m);
  }
  return matCache.get(k);
}
const BOXG = (w, h, d) => { const k = `b${w},${h},${d}`; if (!geoCache.has(k)) geoCache.set(k, new THREE.BoxGeometry(w, h, d)); return geoCache.get(k); };
const CYLG = (rt, rb, h, s) => { const k = `c${rt},${rb},${h},${s}`; if (!geoCache.has(k)) geoCache.set(k, new THREE.CylinderGeometry(rt, rb, h, s)); return geoCache.get(k); };
const SPHG = (r, s = 10) => { const k = `s${r},${s}`; if (!geoCache.has(k)) geoCache.set(k, new THREE.SphereGeometry(r, s, Math.max(6, s * 0.7 | 0))); return geoCache.get(k); };

function box(g, w, h, d, m, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0) {
  const me = new THREE.Mesh(BOXG(w, h, d), m); me.position.set(x, y, z); me.rotation.set(rx, ry, rz); g.add(me); return me;
}
function cyl(g, rt, rb, h, m, x = 0, y = 0, z = 0, s = 12) {
  const me = new THREE.Mesh(CYLG(rt, rb, h, s), m); me.position.set(x, y, z); g.add(me); return me;
}
function sph(g, r, m, x, y, z, s) { const me = new THREE.Mesh(SPHG(r, s), m); me.position.set(x, y, z); g.add(me); return me; }
function plan(g, w, h, m, x, y, z, rx = 0, ry = 0) {
  const me = new THREE.Mesh(new THREE.PlaneGeometry(w, h), m); me.position.set(x, y, z); me.rotation.set(rx, ry, 0); g.add(me); return me;
}

const TRA = '#5e3b20', MORKTRA = '#3d2614', MASSING = '#b8893a', MARMOR = '#d9ccb4', TYG = '#7d5a3a';
const massing = () => mat(MASSING, { emissive: '#2a1a05' });
const glas = () => mat('#cfe0e0', { transparent: true, opacity: 0.35 });
const flamma = () => mat('#ffd27a', { emissive: '#ffb030' });

export const prefabs = {
  matta(d) {
    const g = new THREE.Group();
    const [w, l] = d.storlek || [3, 2];
    plan(g, w, l, mat('#ffffff', { map: T.matta() }), 0, 0.006, 0, -Math.PI / 2);
    return { grupp: g, kollision: false };
  },

  dorr(d) {
    const g = new THREE.Group();
    const m = mat(d.farg || '#4a2c16');
    box(g, 1.2, 0.1, 0.12, mat(MORKTRA), 0, 2.3, 0.03);
    box(g, 0.1, 2.3, 0.12, mat(MORKTRA), -0.55, 1.15, 0.03);
    box(g, 0.1, 2.3, 0.12, mat(MORKTRA), 0.55, 1.15, 0.03);
    const blad = new THREE.Group(); blad.position.set(-0.5, 0, 0.03); g.add(blad);
    box(blad, 1.0, 2.2, 0.06, m, 0.5, 1.1, 0);
    for (const y of [0.55, 1.6]) box(blad, 0.7, 0.7, 0.02, mat('#3a2210'), 0.5, y, 0.035);
    box(blad, 0.1, 0.22, 0.02, massing(), 0.88, 1.0, 0.05);
    sph(blad, 0.035, massing(), 0.88, 1.06, 0.08, 8);
    box(blad, 0.02, 0.05, 0.01, mat('#111'), 0.88, 0.95, 0.065);
    if (d.oppen) blad.rotation.y = -(d.oppen === true ? 0.9 : d.oppen);
    if (d.morker) plan(g, 1.0, 2.2, mat('#0e0904'), 0, 1.1, 0.005);
    return { grupp: g, kollision: false };
  },

  fonster(d) {
    const g = new THREE.Group();
    const y0 = 0.9, W = 1.3, H = 1.7;
    plan(g, W, H, mat('#ffffff', { map: T.natt() }), 0, y0 + H / 2, 0.01);
    const ram = mat('#d9ccb0');
    box(g, W + 0.16, 0.1, 0.12, ram, 0, y0 + H + 0.05, 0.05);
    box(g, 0.08, H, 0.12, ram, -W / 2 - 0.04, y0 + H / 2, 0.05);
    box(g, 0.08, H, 0.12, ram, W / 2 + 0.04, y0 + H / 2, 0.05);
    // Fönsterbleck med orört lövskräp och damm
    box(g, W + 0.3, 0.05, 0.32, mat('#bfb39a'), 0, y0 - 0.02, 0.12);
    const lov = mat('#6a4a22');
    const r = [0.1, -0.35, 0.42, -0.1, 0.25, -0.5, 0.55];
    r.forEach((x, i) => box(g, 0.07, 0.008, 0.05, lov, x, y0 + 0.01, 0.06 + (i % 3) * 0.07, 0, i, 0));
    // Fönsterbågar: vänster stängd, höger öppen inåt
    const bage = (x, oppen) => {
      const p = new THREE.Group(); p.position.set(x, y0, 0.06); g.add(p);
      const sgn = x < 0 ? 1 : -1;
      box(p, 0.05, H, 0.05, ram, 0, H / 2, 0); box(p, 0.05, H, 0.05, ram, sgn * (W / 2 - 0.05), H / 2, 0);
      box(p, W / 2, 0.05, 0.05, ram, sgn * W / 4, 0.03, 0); box(p, W / 2, 0.05, 0.05, ram, sgn * W / 4, H - 0.03, 0);
      box(p, W / 2, 0.03, 0.03, ram, sgn * W / 4, H / 2, 0);
      plan(p, W / 2 - 0.06, H - 0.08, glas(), sgn * W / 4, H / 2, 0);
      if (oppen) p.rotation.y = sgn * -1.1;
    };
    bage(-W / 2, false); bage(W / 2, !!d.oppet);
    const gard = mat('#d8c8a4');
    box(g, 0.32, 2.5, 0.08, gard, -W / 2 - 0.3, 1.3, 0.16);
    box(g, 0.32, 2.5, 0.08, gard, W / 2 + 0.3, 1.3, 0.16);
    box(g, W + 1.1, 0.05, 0.05, massing(), 0, 2.6, 0.18);
    return { grupp: g, kollision: false };
  },

  bord(d) {
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
  },

  vas(d) {
    const g = new THREE.Group();
    const m = mat('#e4dccb'), blom = mat('#a33b2a'), stjalk = mat('#4c5a2a');
    if (d.valt) {
      const v = cyl(g, 0.06, 0.08, 0.28, m, 0, 0.08, 0, 10); v.rotation.z = Math.PI / 2; v.rotation.y = 0.5;
      cyl(g, 0.14, 0.14, 0.003, mat('#4b5a5a', { transparent: true, opacity: 0.5 }), 0.05, 0.003, 0.15, 14);
      for (let i = 0; i < 4; i++) { sph(g, 0.03, blom, -0.05 + i * 0.07, 0.03, 0.22 + (i % 2) * 0.05, 6); box(g, 0.15, 0.008, 0.008, stjalk, -0.05 + i * 0.05, 0.02, 0.15, 0, i, 0); }
    } else {
      cyl(g, 0.06, 0.08, 0.28, m, 0, 0.14, 0, 10);
      for (let i = 0; i < 4; i++) sph(g, 0.035, blom, Math.sin(i * 2) * 0.06, 0.34 + (i % 2) * 0.05, Math.cos(i * 2) * 0.06, 6);
    }
    return { grupp: g, kollision: false };
  },

  byra(d) {
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
  },

  skrin(d) {
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
  },

  oljelampa(d, ctx) {
    const g = new THREE.Group();
    cyl(g, 0.07, 0.09, 0.06, massing(), 0, 0.03, 0, 10);
    cyl(g, 0.08, 0.05, 0.12, massing(), 0, 0.12, 0, 10);
    cyl(g, 0.03, 0.05, 0.22, glas(), 0, 0.3, 0, 10);
    sph(g, 0.022, flamma(), 0, 0.26, 0, 6);
    if (d.ljus) ctx.ljus(g, new THREE.Vector3(0, 0.35, 0), '#ffb768', d.styrka ?? 2.4, 7);
    return { grupp: g, kollision: false };
  },

  fotspar(d) {
    const g = new THREE.Group();
    const pts = d.punkter || [];
    const geo = new THREE.CircleGeometry(0.05, 8);
    const m = mat('#2d1c10', { transparent: true, opacity: 0.6 });
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
  },

  eldstad(d, ctx) {
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
  },

  pendyl() {
    const g = new THREE.Group();
    box(g, 0.3, 0.32, 0.14, mat('#7a5418', { emissive: '#1c1004' }), 0, 0.16, 0);
    plan(g, 0.18, 0.18, mat('#ffffff', { map: T.urtavla() }), 0, 0.2, 0.072);
    sph(g, 0.06, massing(), 0, 0.37, 0, 8);
    return { grupp: g, kollision: false };
  },

  tavla(d) {
    const g = new THREE.Group();
    const [w, h] = d.storlek || [1, 0.7];
    const ram = massing();
    plan(g, w, h, mat('#ffffff', { map: T.malning(d.seed || 71) }), 0, 0, 0.03);
    box(g, w + 0.12, 0.07, 0.05, ram, 0, h / 2 + 0.03, 0.03); box(g, w + 0.12, 0.07, 0.05, ram, 0, -h / 2 - 0.03, 0.03);
    box(g, 0.07, h, 0.05, ram, -w / 2 - 0.03, 0, 0.03); box(g, 0.07, h, 0.05, ram, w / 2 + 0.03, 0, 0.03);
    return { grupp: g, kollision: false };
  },

  fatolj() {
    const g = new THREE.Group();
    const m = mat(TYG), b = mat(MORKTRA);
    box(g, 0.8, 0.2, 0.75, m, 0, 0.35, 0);
    box(g, 0.8, 0.7, 0.18, m, 0, 0.75, -0.3, -0.12);
    box(g, 0.14, 0.32, 0.7, m, -0.36, 0.55, 0); box(g, 0.14, 0.32, 0.7, m, 0.36, 0.55, 0);
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) box(g, 0.06, 0.25, 0.06, b, sx * 0.33, 0.125, sz * 0.3);
    box(g, 0.3, 0.5, 0.03, mat('#2d3550'), 0.38, 0.55, 0.1, 0, 0, 0.3); // sjal
    return { grupp: g };
  },

  askkopp() {
    const g = new THREE.Group();
    cyl(g, 0.09, 0.07, 0.04, glas(), 0, 0.02, 0, 12);
    cyl(g, 0.065, 0.065, 0.01, mat('#7d7a74'), 0, 0.03, 0, 10);
    box(g, 0.12, 0.012, 0.012, mat('#3a2412'), 0.06, 0.045, 0.02, 0, 0.5, 0); // pipa
    return { grupp: g, kollision: false };
  },

  sang() {
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
  },

  bokhylla(d) {
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
  },

  anteckningsbok() {
    const g = new THREE.Group();
    box(g, 0.24, 0.035, 0.32, mat('#ffffff', { map: T.lader() }), 0, 0.018, 0, 0, 0.25, 0);
    box(g, 0.22, 0.028, 0.3, mat('#efe2c4'), 0.008, 0.018, 0, 0, 0.25, 0);
    box(g, 0.04, 0.04, 0.03, massing(), 0.11, 0.02, 0.06, 0, 0.25, 0);
    const p = cyl(g, 0.006, 0.006, 0.18, mat('#2b1a0a'), -0.16, 0.008, 0.02, 6); p.rotation.z = Math.PI / 2; p.rotation.y = 0.6;
    return { grupp: g, kollision: false };
  },

  stol(d) {
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
  },

  nyckelskap() {
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
  },

  pulpet() {
    const g = new THREE.Group();
    const m = mat(TRA);
    box(g, 0.7, 1.0, 0.5, m, 0, 0.5, 0);
    const top = new THREE.Group(); top.position.set(0, 1.05, 0); top.rotation.x = 0.25; g.add(top);
    box(top, 0.8, 0.05, 0.6, m, 0, 0, 0);
    box(top, 0.32, 0.02, 0.42, mat('#ffffff', { map: T.papper() }), -0.17, 0.035, 0, 0, 0, 0.06);
    box(top, 0.32, 0.02, 0.42, mat('#ffffff', { map: T.papper() }), 0.17, 0.035, 0, 0, 0, -0.06);
    cyl(g, 0.04, 0.045, 0.07, mat('#1a1a22'), -0.3, 1.16, -0.2, 8);
    return { grupp: g };
  },

  krokar(d) {
    const g = new THREE.Group();
    box(g, 1.2, 0.1, 0.04, mat(TRA), 0, 0, 0.02);
    for (let i = 0; i < 5; i++) { box(g, 0.02, 0.1, 0.02, massing(), -0.48 + i * 0.24, -0.02, 0.07, 0.6, 0, 0); }
    if (d.handskar) for (let i = 0; i < 2; i++) {
      box(g, 0.1, 0.24, 0.02, mat('#f4f1e8'), -0.48 + i * 0.24, -0.16, 0.08, 0, 0, 0.08);
      box(g, 0.1, 0.22, 0.02, mat('#ece6d8'), -0.44 + i * 0.24, -0.15, 0.1, 0, 0, -0.1);
    }
    return { grupp: g, kollision: false };
  },

  livre() {
    const g = new THREE.Group();
    const m = mat('#1e2433');
    box(g, 0.5, 0.9, 0.16, m, 0, -0.5, 0.1);
    box(g, 0.14, 0.7, 0.14, m, -0.3, -0.45, 0.1, 0, 0, 0.1); box(g, 0.14, 0.7, 0.14, m, 0.3, -0.45, 0.1, 0, 0, -0.1);
    for (let i = 0; i < 4; i++) sph(g, 0.02, massing(), 0.06, -0.2 - i * 0.16, 0.19, 6);
    return { grupp: g, kollision: false };
  },

  hylla(d) {
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
  },

  langbord(d, ctx) {
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
  },

  ljusstake(d, ctx, foralder, pos) {
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
  },

  skank(d) {
    const g = new THREE.Group();
    const [w, h, dj] = d.storlek || [1.6, 0.95, 0.5];
    box(g, w, h - 0.12, dj, mat(TRA), 0, (h - 0.12) / 2 + 0.12, 0);
    box(g, w + 0.06, 0.04, dj + 0.06, mat(MORKTRA), 0, h - 0.02, 0);
    for (let i = 0; i < 3; i++) box(g, w / 3 - 0.06, h - 0.3, 0.01, mat('#4a2e16'), -w / 3 + i * (w / 3), h / 2 + 0.03, dj / 2 + 0.005);
    for (const sx of [-1, 1]) box(g, 0.06, 0.12, 0.06, mat(MORKTRA), sx * (w / 2 - 0.06), 0.06, 0);
    return { grupp: g };
  },

  flaska(d) {
    const g = new THREE.Group();
    const m = mat(d.farg || '#26301c', { emissive: '#050703' });
    cyl(g, 0.04, 0.04, 0.22, m, 0, 0.11, 0, 10);
    cyl(g, 0.015, 0.04, 0.06, m, 0, 0.25, 0, 10);
    cyl(g, 0.014, 0.014, 0.06, m, 0, 0.31, 0, 8);
    cyl(g, 0.016, 0.016, 0.03, mat('#7a1e14'), 0, 0.345, 0, 8);
    box(g, 0.06, 0.07, 0.002, mat('#e8dcc0'), 0, 0.12, 0.041);
    return { grupp: g, kollision: false };
  },

  karaff() {
    const g = new THREE.Group();
    cyl(g, 0.06, 0.07, 0.16, mat('#d8b070', { transparent: true, opacity: 0.6 }), 0, 0.08, 0, 10);
    cyl(g, 0.02, 0.05, 0.08, glas(), 0, 0.2, 0, 10);
    sph(g, 0.035, glas(), 0, 0.27, 0, 8);
    return { grupp: g, kollision: false };
  },

  papper(d) {
    const g = new THREE.Group();
    const n = d.antal || 1;
    for (let i = 0; i < n; i++) box(g, 0.22, 0.004, 0.3, mat('#ffffff', { map: T.papper() }), i * 0.02, 0.002 + i * 0.004, i * 0.015, 0, i * 0.12, 0);
    const p = cyl(g, 0.006, 0.006, 0.14, mat('#111'), 0.15, 0.008, 0.05, 6); p.rotation.z = Math.PI / 2; p.rotation.y = 0.8;
    return { grupp: g, kollision: false };
  },

  vinglas(d) {
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
  },

  tallrik() {
    const g = new THREE.Group();
    cyl(g, 0.12, 0.12, 0.015, mat('#b89a5a'), 0, 0.008, 0, 14);
    cyl(g, 0.1, 0.1, 0.017, mat('#f3eee2'), 0, 0.009, 0, 14);
    return { grupp: g, kollision: false };
  },

  placeringskort(d) {
    const g = new THREE.Group();
    const m = mat('#f4ecd8', { side: THREE.DoubleSide });
    plan(g, 0.1, 0.06, m, 0, 0.03, 0.01, -0.35); plan(g, 0.1, 0.06, m, 0, 0.03, -0.01, 0.35);
    if (d.liggande) g.rotation.z = Math.PI / 2.2;
    return { grupp: g, kollision: false };
  },

  vaska() {
    const g = new THREE.Group();
    const m = mat('#1a1410');
    box(g, 0.42, 0.26, 0.2, m, 0, 0.13, 0);
    const t = new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.012, 6, 12, Math.PI), m); t.position.set(0, 0.26, 0); g.add(t);
    box(g, 0.44, 0.02, 0.22, massing(), 0, 0.25, 0);
    return { grupp: g, kollision: false };
  },

  racke(d) {
    const g = new THREE.Group();
    const L = d.langd || 4;
    const m = mat('#e8e0cc');
    box(g, L, 0.06, 0.08, m, 0, 0.95, 0); box(g, L, 0.05, 0.06, m, 0, 0.12, 0);
    for (let x = -L / 2; x <= L / 2 + 0.01; x += 0.14) box(g, 0.035, 0.8, 0.035, m, x, 0.53, 0);
    for (let x = -L / 2; x <= L / 2 + 0.01; x += L / Math.max(1, Math.round(L / 1.6))) box(g, 0.1, 1.0, 0.1, m, x, 0.5, 0);
    return { grupp: g };
  },

  krukvaxt() {
    const g = new THREE.Group();
    cyl(g, 0.2, 0.15, 0.35, mat('#9a6a44'), 0, 0.175, 0, 10);
    const lov = mat('#4f5d2f');
    for (let i = 0; i < 5; i++) sph(g, 0.18, lov, Math.sin(i * 1.3) * 0.12, 0.5 + (i % 3) * 0.1, Math.cos(i * 1.3) * 0.12, 7);
    return { grupp: g };
  },

  ljuskrona(d, ctx) {
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
  },

  kallardorr(d, ctx) {
    return prefabs.dorr({ ...d, oppen: 0.7, morker: true, farg: '#3e2614' }, ctx);
  },
};
