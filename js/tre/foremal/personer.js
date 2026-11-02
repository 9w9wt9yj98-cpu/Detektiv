// Personer: en enkel lågpolygonfigur som kan stå, sitta eller ligga.
// Konventioner: se foremal/grund.js.
import * as THREE from '../../../vendor/three/three.module.min.js';
import { prefabs, mat, box, cyl, sph, massing, HUD } from './grund.js';

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

Object.assign(prefabs, { person });
