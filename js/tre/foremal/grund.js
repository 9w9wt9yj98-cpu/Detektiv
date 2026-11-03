// Grunden för föremålsbiblioteket: registret, delade geometrier och material, hjälpfunktioner och färger.
// Föremålen själva ligger i en fil per sort (byggdelar, mobler, belysning, smasaker, personer, ute) och
// registrerar sig i `prefabs`. Fallens JSON refererar till dem via "typ".
// Konvention: föremålets framsida pekar mot +z, origo i golvhöjd mitt under föremålet
// (väggföremål: origo i väggplanet). "rot" i JSON vrider runt y-axeln i grader.
import * as THREE from '../../../vendor/three/three.module.min.js';
import * as T from '../texturer.js';
import { VERKLIG } from '../stil.js';

const geoCache = new Map();
const matCache = new Map();
/** Geometrier och material som delas mellan föremål och rum. De får inte frigöras när ett rum byts. */
export const DELADE = new WeakSet();

/**
 * Delat material. I den vanliga stilen ett enkelt matt material; i förhandsgranskningen 'verklig' ett fysiskt
 * baserat material där `glans` (0 = spegelblankt, 1 = helt matt) och `metall` (0–1) styr ytan, och mönstrade
 * ytor får relief av sin egen textur.
 */
export function mat(farg, { map = null, emissive = null, transparent = false, opacity = 1, side = THREE.FrontSide, glans = null, metall = 0 } = {}) {
  const k = [farg, map?.uuid, emissive, transparent, opacity, side, glans, metall].join('|');
  if (!matCache.has(k)) {
    let m;
    if (VERKLIG) {
      m = new THREE.MeshStandardMaterial({ color: farg, map, transparent, opacity, side, roughness: glans ?? (transparent ? 0.08 : 0.68), metalness: metall });
      if (map && !transparent) { m.bumpMap = map; m.bumpScale = 3; }
    } else m = new THREE.MeshLambertMaterial({ color: farg, map, transparent, opacity, side });
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
const KAPG = (r, l, s = 8) => delad(`k${r},${l},${s}`, () => new THREE.CapsuleGeometry(r, l, 3, s));

export function box(g, w, h, d, m, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0) {
  const me = new THREE.Mesh(BOXG(w, h, d), m); me.position.set(x, y, z); me.rotation.set(rx, ry, rz); g.add(me); return me;
}
export function cyl(g, rt, rb, h, m, x = 0, y = 0, z = 0, s = 12) {
  const me = new THREE.Mesh(CYLG(rt, rb, h, s), m); me.position.set(x, y, z); g.add(me); return me;
}
export function sph(g, r, m, x, y, z, s) { const me = new THREE.Mesh(SPHG(r, s), m); me.position.set(x, y, z); g.add(me); return me; }
/** Kapsel (cylinder med rundade ändar) längs y-axeln: radie r, raka delens längd l. */
export function kapsel(g, r, l, m, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0, s = 8) {
  const me = new THREE.Mesh(KAPG(r, l, s), m); me.position.set(x, y, z); me.rotation.set(rx, ry, rz); g.add(me); return me;
}
export function plan(g, w, h, m, x, y, z, rx = 0, ry = 0) {
  const me = new THREE.Mesh(new THREE.PlaneGeometry(w, h), m); me.position.set(x, y, z); me.rotation.set(rx, ry, 0); g.add(me); return me;
}

// Färger som delas av flera föremål
export const TRA = '#5e3b20', MORKTRA = '#3d2614', MASSING = '#b8893a', MARMOR = '#d9ccb4', TYG = '#7d5a3a';
export const HUD = ['#e8c4a0', '#d9b08c', '#c99a74', '#f0d2b4'], MAHOGNY = '#4a2216';
export const FALU = '#8a2a1e', VIT = '#efe9dc', JARN = '#2a2a2c';
export const massing = () => mat(MASSING, { emissive: '#2a1a05', glans: 0.26, metall: 0.75 });
export const glas = () => mat('#cfe0e0', { transparent: true, opacity: 0.35, glans: 0.04 });
export const flamma = () => mat('#ffd27a', { emissive: '#ffb030' });

/** Registret: typnamn -> funktion(def, ctx) som returnerar { grupp, kollision?, haloPos? }. Fylls av kategorifilerna. */
export const prefabs = {};

/**
 * Slår ihop ett föremåls ogenomskinliga delar till en mesh per material, så att föremålet ritas med
 * några få anrop i stället för ett per del. Genomskinliga, osynliga och särskilt sorterade delar
 * (renderOrder) lämnas orörda, liksom ljus och allt som inte är en mesh. Utseendet blir detsamma.
 * Delar märkta `userData.behall` (de som står kvar när en 3D-modell ersätter föremålet, se tre/modeller.js)
 * slås bara ihop med varandra, och den sammanslagna meshen behåller märket.
 */
export function slaIhop(rot, { utomDelar = false } = {}) {
  rot.updateMatrixWorld(true);
  // utomDelar: delar märkta userData.del (som en 3D-modell kan ersätta, se tre/modeller.js) lämnas som de är.
  const iDel = (o) => { for (let p = o; p && p !== rot; p = p.parent) if (p.userData.del) return true; return false; };
  const inv = new THREE.Matrix4().copy(rot.matrixWorld).invert();
  const perMaterial = new Map();
  rot.traverse((o) => {
    if (!o.isMesh || o.isInstancedMesh || Array.isArray(o.material)) return;
    const g = o.geometry, a = g.attributes;
    if (o.material.transparent || !o.visible || o.renderOrder !== 0 || !g.index || !a.position || !a.normal || !a.uv) return;
    if (utomDelar && iDel(o)) return;
    const k = o.userData.behall ? 'behall:' + o.material.uuid : o.material;
    if (!perMaterial.has(k)) perMaterial.set(k, []);
    perMaterial.get(k).push(o);
  });
  const m4 = new THREE.Matrix4(), n3 = new THREE.Matrix3(), v = new THREE.Vector3();
  for (const [k, delar] of perMaterial) {
    if (delar.length < 2) continue;
    const material = delar[0].material;
    let nv = 0, ni = 0;
    for (const o of delar) { nv += o.geometry.attributes.position.count; ni += o.geometry.index.count; }
    const pos = new Float32Array(nv * 3), nor = new Float32Array(nv * 3), uv = new Float32Array(nv * 2);
    const idx = nv > 65535 ? new Uint32Array(ni) : new Uint16Array(ni);
    let ov = 0, oi = 0;
    for (const o of delar) {
      const g = o.geometry, p = g.attributes.position, n = g.attributes.normal, t = g.attributes.uv, ix = g.index;
      m4.multiplyMatrices(inv, o.matrixWorld); n3.getNormalMatrix(m4);
      const vand = m4.determinant() < 0; // spegling vänder trianglarnas ordning
      for (let i = 0; i < p.count; i++) {
        v.fromBufferAttribute(p, i).applyMatrix4(m4); pos.set([v.x, v.y, v.z], (ov + i) * 3);
        v.fromBufferAttribute(n, i).applyMatrix3(n3).normalize(); nor.set([v.x, v.y, v.z], (ov + i) * 3);
        uv[(ov + i) * 2] = t.getX(i); uv[(ov + i) * 2 + 1] = t.getY(i);
      }
      for (let i = 0; i < ix.count; i += 3) {
        const a = ix.getX(i) + ov, b = ix.getX(i + 1) + ov, c = ix.getX(i + 2) + ov;
        idx[oi + i] = a; idx[oi + i + 1] = vand ? c : b; idx[oi + i + 2] = vand ? b : c;
      }
      ov += p.count; oi += ix.count;
      o.parent.remove(o);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
    geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
    geo.setIndex(new THREE.BufferAttribute(idx, 1));
    geo.computeBoundingSphere(); geo.computeBoundingBox();
    const ny = new THREE.Mesh(geo, material);
    if (typeof k === 'string') ny.userData.behall = true;
    rot.add(ny);
  }
  return rot;
}
