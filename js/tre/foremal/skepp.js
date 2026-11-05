// Ombord på en ångare: livbåt på klossar med presenning.
// Konventioner: se foremal/grund.js. Framsidan (fören) pekar mot +x vid rot 0; båten står på däck med kölen i y ≈ 0,3.
import * as THREE from '../../../vendor/three/three.module.min.js';
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

Object.assign(prefabs, { livbat });
