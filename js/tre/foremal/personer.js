// Personer: en detaljerad figur byggd av primitiver som kan stå, sitta eller ligga.
// Konventioner: se foremal/grund.js.
import * as THREE from '../../../vendor/three/three.module.min.js';
import { prefabs, mat, box, cyl, sph, kapsel, massing, HUD } from './grund.js';

/** Mörkare nyans av en färg (för skuggade detaljer som näsa och ögonbryn). */
const morkare = (farg, f) => '#' + new THREE.Color(farg).multiplyScalar(f).getHexString();

/**
 * En person. Framsidan pekar mot +z och fötterna står på y = 0.
 * d: kon ('k' = kvinna), pose (sta | sitta | ligga), hud, rock, byxor, skjorta, slips, forklade,
 *    har, skagg, hatt (mossa | hatt | sjalett), hattfarg, glasogon, lagHojd, seed.
 */
function person(d) {
  const ytter = new THREE.Group();
  const g = new THREE.Group(); ytter.add(g);
  const hudFarg = d.hud || HUD[(d.seed || 0) % HUD.length];
  const hud = mat(hudFarg), hudMork = mat(morkare(hudFarg, 0.82));
  const rockFarg = d.rock || '#3b3a44';
  const rock = mat(rockFarg), rockMork = mat(morkare(rockFarg, 0.7));
  const byxa = mat(d.byxor || '#2a2a30'), sko = mat('#1a120c'), strumpa = mat('#c8b49a');
  const harFarg = d.har || '#4a3420', har = mat(harFarg);
  const kvinna = d.kon === 'k';
  const sitter = d.pose === 'sitta';
  const hy = sitter ? 0.46 : 0.86; // höftens höjd

  // --- Ben och skor ---
  for (const sx of [-1, 1]) {
    const x = sx * 0.09;
    if (sitter) {
      kapsel(g, 0.068, 0.3, kvinna ? rock : byxa, x, hy + 0.03, 0.17, Math.PI / 2);           // lår framåt
      kapsel(g, 0.055, 0.3, kvinna ? strumpa : byxa, x, 0.25, 0.36);                          // underben
      sph(g, 0.06, sko, x, 0.035, 0.42, 10).scale.set(1, 0.55, 1.8);
    } else if (kvinna) {
      kapsel(g, 0.045, 0.32, strumpa, sx * 0.08, 0.22, 0);
      sph(g, 0.055, sko, sx * 0.08, 0.035, 0.035, 10).scale.set(1, 0.55, 1.8);
    } else {
      kapsel(g, 0.07, 0.3, byxa, x, 0.64, 0);   // lår
      kapsel(g, 0.058, 0.32, byxa, x, 0.27, 0); // underben
      sph(g, 0.06, sko, x, 0.035, 0.045, 10).scale.set(1, 0.55, 1.9);
    }
  }
  if (kvinna && !sitter) {
    // Kjol som vidgar sig nedåt, med fåll
    cyl(g, 0.16, 0.27, 0.62, rock, 0, hy - 0.22, 0, 16).scale.set(1, 1, 0.82);
    cyl(g, 0.272, 0.275, 0.025, rockMork, 0, hy - 0.52, 0, 16).scale.set(1, 1, 0.82);
  }
  // Höfter
  cyl(g, kvinna ? 0.15 : 0.165, kvinna ? 0.16 : 0.165, 0.14, kvinna ? rock : byxa, 0, hy, 0, 14).scale.set(1, 1, 0.7);

  // --- Överkropp ---
  const ty = hy + 0.31;
  const axel = kvinna ? 0.17 : 0.2, midja = kvinna ? 0.135 : 0.165;
  cyl(g, axel, midja, 0.56, rock, 0, ty, 0, 16).scale.set(1, 1, 0.62);
  cyl(g, midja + 0.005, midja + 0.005, 0.035, rockMork, 0, hy + 0.06, 0, 16).scale.set(1, 1, 0.64); // skärp/midja
  const fram = (r) => r * 0.62; // överkroppens framsida på en viss radie
  // Skjortbröst, slips och kavajslag
  box(g, 0.1, 0.17, 0.01, mat(d.skjorta || '#efe6d2'), 0, ty + 0.18, fram(axel) - 0.005);
  if (d.slips) { box(g, 0.035, 0.15, 0.01, mat(d.slips), 0, ty + 0.15, fram(axel) + 0.002); box(g, 0.03, 0.03, 0.012, mat(d.slips), 0, ty + 0.235, fram(axel) + 0.003); }
  if (!kvinna && !d.forklade) {
    for (const sx of [-1, 1]) box(g, 0.055, 0.24, 0.012, rockMork, sx * 0.055, ty + 0.13, fram(axel) - 0.002, -0.08, 0, sx * 0.32);
    for (const y of [-0.02, -0.12]) sph(g, 0.012, mat('#1a1410'), 0.0, ty + y, fram(midja + 0.02) + 0.004, 6);
  } else if (kvinna) {
    box(g, 0.16, 0.025, 0.012, mat(d.skjorta || '#efe6d2'), 0, ty + 0.27, fram(axel) - 0.012); // krage
    for (const y of [0.12, 0.04, -0.04]) sph(g, 0.01, massing(), 0, ty + y, fram(axel * 0.85 + midja * 0.15) + 0.004, 6);
  }
  if (d.forklade) {
    box(g, 0.3, 0.55, 0.01, mat('#f2ede0'), 0, ty - 0.2, fram(midja) + 0.02);
    box(g, 0.34, 0.03, 0.012, mat('#e2dccd'), 0, hy + 0.06, fram(midja) + 0.025);
  }

  // --- Armar och händer ---
  for (const sx of [-1, 1]) {
    const ax = sx * (axel + 0.03);
    sph(g, 0.075, rock, sx * (axel - 0.01), ty + 0.23, 0, 10).scale.set(1, 0.85, 0.9); // axel
    kapsel(g, 0.052, 0.22, rock, ax, ty + 0.08, 0, 0, 0, sx * 0.07);                       // överarm
    sph(g, 0.06, rockMork, ax + sx * 0.008, ty - 0.06, 0, 8);                             // ärmveck vid armbågen
    if (sitter) {
      kapsel(g, 0.046, 0.2, rock, ax + sx * 0.01, ty - 0.1, 0.11, Math.PI / 2 - 0.25);        // underarm framåt i knät
      sph(g, 0.046, hud, ax + sx * 0.01, ty - 0.14, 0.26, 8).scale.set(0.8, 0.6, 1.25);
    } else {
      kapsel(g, 0.046, 0.21, rock, ax + sx * 0.012, ty - 0.2, 0.025, -0.12);
      sph(g, 0.046, hud, ax + sx * 0.012, ty - 0.37, 0.05, 8).scale.set(0.75, 1.25, 0.6);
    }
  }

  // --- Hals och huvud ---
  const hh = ty + 0.31;
  cyl(g, 0.046, 0.05, 0.1, hud, 0, hh + 0.04, 0, 10);
  const huvud = sph(g, 0.112, hud, 0, hh + 0.17, 0, 16); huvud.scale.set(0.92, 1.12, 1);
  for (const sx of [-1, 1]) {
    sph(g, 0.026, hud, sx * 0.102, hh + 0.165, -0.005, 8).scale.set(0.45, 1, 0.75);                 // öron
    sph(g, 0.017, mat('#f4efe6'), sx * 0.038, hh + 0.19, 0.093, 8).scale.set(1.1, 0.75, 0.55);        // ögonvitor
    sph(g, 0.009, mat('#2a1e16'), sx * 0.038, hh + 0.19, 0.101, 6);                                  // pupiller
    box(g, 0.036, 0.008, 0.01, mat(morkare(harFarg, 0.85)), sx * 0.04, hh + 0.214, 0.098, 0, 0, sx * -0.12); // ögonbryn
  }
  box(g, 0.02, 0.045, 0.03, hud, 0, hh + 0.162, 0.108, 0.25);                                       // näsa
  sph(g, 0.012, hudMork, 0, hh + 0.142, 0.12, 6).scale.set(1.3, 0.8, 0.8);                           // nästipp
  box(g, 0.042, 0.007, 0.006, mat(kvinna ? '#9a4a44' : '#7a4038'), 0, hh + 0.112, 0.1);               // mun
  // Hår
  const harM = sph(g, 0.119, har, 0, hh + 0.205, -0.014, 16); harM.scale.set(0.97, 0.8, 1.04);
  if (kvinna) {
    sph(g, 0.062, har, 0, hh + 0.2, -0.12, 10);                                                      // knut
    for (const sx of [-1, 1]) sph(g, 0.06, har, sx * 0.075, hh + 0.14, -0.035, 10).scale.set(0.55, 1.25, 0.85);
  } else {
    for (const sx of [-1, 1]) sph(g, 0.03, har, sx * 0.095, hh + 0.2, 0.0, 8).scale.set(0.5, 1, 1.2); // tinningar
  }
  if (d.skagg) { const s = sph(g, 0.08, har, 0, hh + 0.08, 0.055, 10); s.scale.set(1, 0.9, 0.7); box(g, 0.07, 0.014, 0.02, har, 0, hh + 0.128, 0.104); }
  if (d.hatt === 'mossa') { cyl(g, 0.125, 0.12, 0.08, mat(d.hattfarg || '#1e2433'), 0, hh + 0.31, 0, 14); box(g, 0.16, 0.012, 0.09, mat('#111'), 0, hh + 0.27, 0.11); box(g, 0.1, 0.02, 0.005, massing(), 0, hh + 0.32, 0.124); }
  if (d.hatt === 'hatt') { cyl(g, 0.2, 0.2, 0.012, mat(d.hattfarg || '#2b2420'), 0, hh + 0.27, 0, 18); cyl(g, 0.1, 0.12, 0.13, mat(d.hattfarg || '#2b2420'), 0, hh + 0.34, 0, 14); cyl(g, 0.121, 0.121, 0.025, mat('#1a1410'), 0, hh + 0.29, 0, 14); }
  if (d.hatt === 'sjalett') { const s = sph(g, 0.128, mat(d.hattfarg || '#5a2e2a'), 0, hh + 0.218, -0.042, 14); s.scale.set(1.05, 0.95, 1.0); sph(g, 0.04, mat(d.hattfarg || '#5a2e2a'), 0, hh + 0.06, -0.08, 8); }
  if (d.glasogon) {
    for (const sx of [-1, 1]) { const r = new THREE.Mesh(new THREE.TorusGeometry(0.025, 0.004, 4, 12), mat('#3a2a18')); r.position.set(sx * 0.04, hh + 0.19, 0.112); g.add(r); }
    box(g, 0.03, 0.005, 0.005, mat('#3a2a18'), 0, hh + 0.195, 0.114);
  }
  if (d.pose === 'ligga') { g.rotation.x = -Math.PI / 2; g.position.set(0, d.lagHojd ?? 0.5, 0.8); }
  const topp = d.pose === 'ligga' ? new THREE.Vector3(0, (d.lagHojd ?? 0.5) + 0.35, 0.8 - (hh + 0.17)) : new THREE.Vector3(0, hh + 0.55, 0);
  return { grupp: ytter, haloPos: topp, kollision: d.pose !== 'ligga' && !sitter };
}

Object.assign(prefabs, { person });
