// Grunden för föremålsbiblioteket: registret, delade geometrier och material, hjälpfunktioner och färger.
// Föremålen själva ligger i en fil per sort (byggdelar, mobler, belysning, smasaker, personer, ute) och
// registrerar sig i `prefabs`. Fallens JSON refererar till dem via "typ".
// Konvention: föremålets framsida pekar mot +z, origo i golvhöjd mitt under föremålet
// (väggföremål: origo i väggplanet). "rot" i JSON vrider runt y-axeln i grader.
import * as THREE from '../../../vendor/three/three.module.min.js';
import * as T from '../texturer.js';

const geoCache = new Map();
const matCache = new Map();
/** Geometrier och material som delas mellan föremål och rum. De får inte frigöras när ett rum byts. */
export const DELADE = new WeakSet();

export function mat(farg, { map = null, emissive = null, transparent = false, opacity = 1, side = THREE.FrontSide } = {}) {
  const k = [farg, map?.uuid, emissive, transparent, opacity, side].join('|');
  if (!matCache.has(k)) {
    const m = new THREE.MeshLambertMaterial({ color: farg, map, transparent, opacity, side });
    if (emissive) { m.emissive = new THREE.Color(emissive); m.emissiveIntensity = 1; }
    if (transparent) m.depthWrite = false;
    matCache.set(k, m); DELADE.add(m);
  }
  return matCache.get(k);
}
const delad = (k, skapa) => { if (!geoCache.has(k)) { const g = skapa(); geoCache.set(k, g); DELADE.add(g); } return geoCache.get(k); };
const BOXG = (w, h, d) => delad(`b${w},${h},${d}`, () => new THREE.BoxGeometry(w, h, d));
const CYLG = (rt, rb, h, s) => delad(`c${rt},${rb},${h},${s}`, () => new THREE.CylinderGeometry(rt, rb, h, s));
const SPHG = (r, s = 10) => delad(`s${r},${s}`, () => new THREE.SphereGeometry(r, s, Math.max(6, s * 0.7 | 0)));

export function box(g, w, h, d, m, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0) {
  const me = new THREE.Mesh(BOXG(w, h, d), m); me.position.set(x, y, z); me.rotation.set(rx, ry, rz); g.add(me); return me;
}
export function cyl(g, rt, rb, h, m, x = 0, y = 0, z = 0, s = 12) {
  const me = new THREE.Mesh(CYLG(rt, rb, h, s), m); me.position.set(x, y, z); g.add(me); return me;
}
export function sph(g, r, m, x, y, z, s) { const me = new THREE.Mesh(SPHG(r, s), m); me.position.set(x, y, z); g.add(me); return me; }
export function plan(g, w, h, m, x, y, z, rx = 0, ry = 0) {
  const me = new THREE.Mesh(new THREE.PlaneGeometry(w, h), m); me.position.set(x, y, z); me.rotation.set(rx, ry, 0); g.add(me); return me;
}

// Färger som delas av flera föremål
export const TRA = '#5e3b20', MORKTRA = '#3d2614', MASSING = '#b8893a', MARMOR = '#d9ccb4', TYG = '#7d5a3a';
export const HUD = ['#e8c4a0', '#d9b08c', '#c99a74', '#f0d2b4'], MAHOGNY = '#4a2216';
export const FALU = '#8a2a1e', VIT = '#efe9dc', JARN = '#2a2a2c';
export const massing = () => mat(MASSING, { emissive: '#2a1a05' });
export const glas = () => mat('#cfe0e0', { transparent: true, opacity: 0.35 });
export const flamma = () => mat('#ffd27a', { emissive: '#ffb030' });

/** Registret: typnamn -> funktion(def, ctx) som returnerar { grupp, kollision?, haloPos? }. Fylls av kategorifilerna. */
export const prefabs = {};
