// Ombord på en ångare: livbåt på klossar med presenning, däcksstol och livboj.
// Konventioner: se foremal/grund.js. Framsidan (fören) pekar mot +x vid rot 0; båten står på däck med kölen i y ≈ 0,3.
import * as THREE from '../../../vendor/three/three.module.min.js';
import * as T from '../texturer.js';
import { mat, box, cyl, prefabs } from './grund.js';

/**
 * Livbåt av klinkbyggt trä på två klossar, med vit skrovsida, mörk reling och grå presenning.
 * langd (4,2), bredd (1,4), nummer (skrivs på bogen), oppen (false): presenningen uppvikt i aktern så att man ser in.
 * Kollision för hela båten med klossarna.
 */
function livbat(d) {
  const g = new THREE.Group();
  const L = d.langd || 4.2, B = d.bredd || 1.4, H = 0.62, y0 = 0.32;
  const vit = mat('#eeeae0'), rod = mat('#8a2a1e'), tra = mat('#7a5a3a'), pres = mat('#8a8a80');
  // Skrovet: en avlång halvsfär, tillspetsad i båda ändar
  const skrov = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 10, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), vit);
  skrov.scale.set(L / 2, H, B / 2); skrov.position.y = y0 + H; g.add(skrov);
  // Bottenfärg och klinkbord (ränder)
  const botten = new THREE.Mesh(new THREE.SphereGeometry(1.002, 20, 6, 0, Math.PI * 2, Math.PI * 0.78, Math.PI * 0.22), rod);
  botten.scale.set(L / 2, H, B / 2); botten.position.y = y0 + H; g.add(botten);
  for (const f of [0.35, 0.6]) {
    const r = new THREE.Mesh(new THREE.TorusGeometry(1, 0.008, 4, 40), mat('#c8c2b4'));
    const s = Math.sin(Math.acos(f));
    r.scale.set((L / 2) * s, (B / 2) * s, 1); r.rotation.x = Math.PI / 2; r.position.y = y0 + H * (1 - f); g.add(r);
  }
  // Reling och presenning
  const reling = new THREE.Mesh(new THREE.TorusGeometry(1, 0.035, 6, 48), mat('#4a3020'));
  reling.scale.set(L / 2, B / 2, 1); reling.rotation.x = Math.PI / 2; reling.position.y = y0 + H; g.add(reling);
  const tack = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 6, 0, Math.PI * 2, 0, Math.PI * 0.18), pres);
  tack.scale.set(L / 2, 0.9, B / 2); tack.position.y = y0 + H - 0.86; g.add(tack);
  if (d.oppen) { const vik = box(g, 0.6, 0.06, B * 0.7, pres, -L / 2 + 0.7, y0 + H + 0.12, 0); vik.rotation.z = 0.5; }
  // Klossar
  for (const x of [-L * 0.28, L * 0.28]) { box(g, 0.25, y0 + 0.1, B * 0.8, tra, x, (y0 + 0.1) / 2, 0); }
  // Åror längs sidan
  for (const z of [-B * 0.32, B * 0.32]) { const a = cyl(g, 0.025, 0.025, L * 0.7, tra, 0, y0 + H + 0.12, z, 6); a.rotation.z = Math.PI / 2; }
  // Numret på bogen
  if (d.nummer) {
    const c = document.createElement('canvas'); c.width = 128; c.height = 64;
    const x = c.getContext('2d'); x.fillStyle = '#1a1a1a'; x.font = 'bold 44px Georgia, serif'; x.textAlign = 'center'; x.fillText(String(d.nummer), 64, 48);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
    for (const s of [-1, 1]) {
      const p = new THREE.Mesh(new THREE.PlaneGeometry(0.34, 0.17), new THREE.MeshBasicMaterial({ map: t, transparent: true }));
      p.position.set(L * 0.36, y0 + H * 0.62, s * (B / 2) * 0.8); p.rotation.y = s > 0 ? 0.35 : Math.PI - 0.35; g.add(p);
    }
  }
  return { grupp: g };
}

/**
 * Däcksstol: fällstol av trä med randig segelduk, låg och bakåtlutad. Sitsen ligger ca 0,33 m över däck;
 * ryggen lutar bakåt mot -z. farg (randens färg, '#3a5a7a'). Kollision för hela stolen.
 */
function dacksstol(d) {
  const g = new THREE.Group();
  const tra = mat('#a8824e'), duk = mat('#ffffff', { map: T.rander('#ece6d6', d.farg || '#3a5a7a', 8), side: THREE.DoubleSide });
  const B = 0.56;
  // Sits: från framkanten ner mot ryggens fäste
  const sits = box(g, B - 0.06, 0.012, 0.62, duk, 0, 0.33, 0.14); sits.rotation.x = 0.1;
  // Rygg: lutar bakåt
  const rygg = box(g, B - 0.06, 0.012, 0.78, duk, 0, 0.62, -0.4); rygg.rotation.x = -1.0;
  for (const sx of [-1, 1]) {
    const x = sx * B / 2;
    const s1 = box(g, 0.035, 0.03, 0.66, tra, x, 0.33, 0.14); s1.rotation.x = 0.1;      // sitsens sidoslå
    const r1 = box(g, 0.035, 0.03, 0.86, tra, x, 0.62, -0.4); r1.rotation.x = -1.0;     // ryggens sidoslå
    const b1 = box(g, 0.03, 0.03, 0.62, tra, x, 0.17, 0.2); b1.rotation.x = 0.95;       // främre ben
    const b2 = box(g, 0.03, 0.03, 0.6, tra, x, 0.17, -0.22); b2.rotation.x = -0.9;      // bakre ben
    box(g, 0.05, 0.02, 0.46, tra, x, 0.5, 0.02);                                         // armstöd
    box(g, 0.03, 0.2, 0.03, tra, x, 0.4, 0.22);
  }
  box(g, B, 0.03, 0.03, tra, 0, 0.36, 0.45); box(g, B, 0.03, 0.03, tra, 0, 0.95, -0.66);
  return { grupp: g };
}

/**
 * Livboj på väggen: röd ring med fyra ljusa band och en griplina runt om. Väggföremål (origo i väggplanet, mitt i ringen).
 * diameter (0,76). Ingen kollision.
 */
function livboj(d) {
  const g = new THREE.Group();
  const D = d.diameter || 0.76, r = D * 0.1, R = D / 2 - r;
  const ring = new THREE.Mesh(new THREE.TorusGeometry(R, r, 10, 28), mat('#a8281e')); ring.position.z = r; g.add(ring);
  const vit = mat('#e6e0d0');
  for (let i = 0; i < 4; i++) {
    const band = new THREE.Mesh(new THREE.TorusGeometry(R, r * 1.06, 10, 5, 0.34), vit);
    band.rotation.z = Math.PI / 4 + i * Math.PI / 2 - 0.17; band.position.z = r; g.add(band);
  }
  const lina = new THREE.Mesh(new THREE.TorusGeometry(D / 2 + 0.035, 0.008, 5, 28), mat('#b8a878')); lina.position.z = r; g.add(lina);
  box(g, 0.05, 0.05, r * 1.2, mat('#3a3a3a'), 0, D / 2 - r, r * 0.6); // kroken som bojen hänger på
  return { grupp: g, kollision: false };
}

Object.assign(prefabs, { livbat, dacksstol, livboj });
