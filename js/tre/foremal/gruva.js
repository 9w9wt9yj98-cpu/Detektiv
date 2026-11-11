// Gruvkontoret och gruvbacken: ritbord, ritningsskåp, kameraskåp med reprokamera, kamin med vedlår, gruvlave och malmvagn.
// Konventioner: se foremal/grund.js. Framsidan vetter mot +z vid rot 0.
import * as THREE from '../../../vendor/three/three.module.min.js';
import * as T from '../texturer.js';
import { prefabs, mat, box, cyl, sph, plan, massing, MORKTRA, JARN } from './grund.js';

/**
 * Ritbord: en lutande ritskiva på bock, med en ritning, en vinkelhake och (om lampa: true) en ledad ritbordslampa.
 * Skivan är 1,3 × 0,9 m och lutar mot betraktaren. lyser (false): lampan ger ljus. Kollision för hela bordet.
 */
function ritbord(d, ctx) {
  const g = new THREE.Group();
  const tra = mat('#8a6a48'), mork = mat(MORKTRA), jarn = mat(JARN, { glans: 0.5, metall: 0.6 });
  for (const sx of [-1, 1]) {
    box(g, 0.06, 0.95, 0.06, mork, sx * 0.55, 0.475, -0.28);
    box(g, 0.06, 0.72, 0.06, mork, sx * 0.55, 0.36, 0.3);
    box(g, 0.05, 0.05, 0.64, mork, sx * 0.55, 0.2, 0.01);
  }
  box(g, 1.1, 0.05, 0.05, mork, 0, 0.2, 0.01);
  const skiva = new THREE.Group(); skiva.position.set(0, 0.86, 0); skiva.rotation.x = 0.38; g.add(skiva);
  box(skiva, 1.3, 0.035, 0.9, tra, 0, 0, 0);
  const p = plan(skiva, 0.95, 0.66, mat('#ffffff', { map: T.papper(true) }), 0.05, 0.02, 0, -Math.PI / 2);
  void p;
  box(skiva, 1.1, 0.012, 0.05, mat('#c8b890'), 0, 0.03, 0.2);           // T-linjal
  box(skiva, 0.05, 0.012, 0.3, mat('#c8b890'), -0.53, 0.03, 0.08);
  box(skiva, 1.3, 0.03, 0.03, mork, 0, 0.03, 0.44);                     // list i nederkant
  if (d.lampa !== false) {
    // Ledad arm från skivans övre högra hörn
    const fot = new THREE.Vector3(0.6, 1.05, -0.36);
    cyl(g, 0.02, 0.02, 0.1, jarn, fot.x, fot.y, fot.z, 8);
    const a1 = box(g, 0.02, 0.5, 0.02, jarn, fot.x - 0.1, fot.y + 0.25, fot.z + 0.03); a1.rotation.z = 0.4;
    const a2 = box(g, 0.02, 0.45, 0.02, jarn, fot.x - 0.38, fot.y + 0.42, fot.z + 0.12); a2.rotation.z = 1.25; a2.rotation.y = -0.3;
    const sk = cyl(g, 0.05, 0.11, 0.13, mat('#2e3a2e'), fot.x - 0.6, fot.y + 0.3, fot.z + 0.2, 12); sk.rotation.z = -0.2;
    if (d.lyser) { sph(g, 0.03, mat('#fff2c8', { emissive: '#ffe9a8' }), fot.x - 0.6, fot.y + 0.24, fot.z + 0.2, 8); ctx.ljus(g, new THREE.Vector3(fot.x - 0.6, fot.y + 0.2, fot.z + 0.2), '#ffe2b0', d.styrka ?? 1.6, 5); }
  }
  return { grupp: g, haloPos: new THREE.Vector3(0, 1.25, 0.1) };
}

/**
 * Ritningsskåp av trä med grunda lådor för ritningar, 1,2 m brett och 1,25 m högt.
 * lador (8), numrerade uppifrån. forseglad: numret på en låda med förseglingsremsa; bruten (false): remsan är avsliten
 * och lådan står på glänt. Kollision för hela skåpet.
 */
function ritningsskap(d) {
  const g = new THREE.Group();
  const N = d.lador || 8, W = 1.2, H = 1.25, D = 0.75, lh = (H - 0.13) / N;
  const tra = mat('#7a5c3c'), front = mat('#8c6c48'), mork = mat(MORKTRA);
  box(g, W, H - 0.1, D, tra, 0, 0.1 + (H - 0.1) / 2, -D / 2);
  box(g, W - 0.1, 0.1, D - 0.1, mork, 0, 0.05, -D / 2);
  box(g, W + 0.04, 0.03, D + 0.04, mork, 0, H + 0.015, -D / 2);
  let halo = new THREE.Vector3(0, H + 0.2, 0);
  for (let i = 0; i < N; i++) {
    const y = H - 0.03 - (i + 0.5) * lh, nr = i + 1, oppen = d.forseglad === nr && d.bruten;
    const z = oppen ? 0.09 : 0.012;
    box(g, W - 0.08, lh - 0.02, 0.024, front, 0, y, z);
    box(g, 0.16, 0.018, 0.03, massing(), 0, y - 0.005, z + 0.025);
    plan(g, 0.055, 0.055, mat('#ffffff', { map: T.siffra(String(nr)), transparent: true }), -W / 2 + 0.13, y, z + 0.014);
    if (oppen) box(g, W - 0.1, 0.01, 0.1, mat('#1a1410'), 0, y + lh / 2 - 0.012, 0.04);
    if (d.forseglad === nr) {
      halo = new THREE.Vector3(0.2, y + 0.12, 0.2);
      const vit = mat('#f4efe0');
      if (d.bruten) { // två avslitna halvor: en kvar på lådan, en på skåpets ram
        const a = box(g, 0.04, 0.05, 0.004, vit, 0.3, y + lh / 2 - 0.035, z + 0.014); a.rotation.z = 0.25;
        const b = box(g, 0.04, 0.045, 0.004, vit, 0.31, y + lh / 2 + 0.03, 0.026); b.rotation.z = -0.2;
      } else box(g, 0.04, 0.12, 0.004, vit, d.remsa === 'vanster' ? -0.3 : 0.3, y + lh / 2, z + 0.014);
    }
  }
  return { grupp: g, haloPos: halo };
}

/**
 * Kameraskåp: ett högt, smalt skåp med öppen dörr. Inuti står kontorets reprokamera på sitt stativ –
 * en liten kamera på en pelare över en bottenplatta, med två lampor. 0,7 m brett och 1,9 m högt.
 */
function kameraskap() {
  const g = new THREE.Group();
  const tra = mat('#6a4e34'), mork = mat(MORKTRA), svart = mat('#1a1a1c', { glans: 0.4 }), krom = mat('#b8b8b4', { glans: 0.25, metall: 0.8 });
  const W = 0.7, H = 1.9, D = 0.5;
  box(g, W, H, 0.02, tra, 0, H / 2, -D + 0.01);
  for (const sx of [-1, 1]) box(g, 0.02, H, D, tra, sx * (W / 2 - 0.01), H / 2, -D / 2);
  box(g, W, 0.02, D, tra, 0, H - 0.01, -D / 2); box(g, W, 0.08, D, mork, 0, 0.04, -D / 2);
  box(g, W - 0.04, 0.02, D - 0.02, tra, 0, 0.95, -D / 2); // hyllan kameran står på
  // Dörren står öppen åt höger
  const dorr = new THREE.Group(); dorr.position.set(W / 2, 0, 0); dorr.rotation.y = 1.9; g.add(dorr);
  box(dorr, W, H - 0.1, 0.02, tra, -W / 2, H / 2 + 0.03, 0); sph(dorr, 0.018, massing(), -W + 0.06, 1.0, 0.02, 6);
  // Reprostativet
  box(g, 0.44, 0.02, 0.34, mat('#3a3a38'), 0, 0.97, -D / 2);
  cyl(g, 0.014, 0.014, 0.62, krom, 0, 1.29, -D / 2 - 0.13, 8);
  box(g, 0.05, 0.04, 0.16, svart, 0, 1.5, -D / 2 - 0.06);
  box(g, 0.13, 0.075, 0.035, svart, 0, 1.5, -D / 2 + 0.02); box(g, 0.13, 0.012, 0.037, krom, 0, 1.543, -D / 2 + 0.02);
  const obj = cyl(g, 0.022, 0.026, 0.045, krom, 0, 1.45, -D / 2 + 0.02, 10); void obj;
  for (const sx of [-1, 1]) { const arm = box(g, 0.012, 0.3, 0.012, krom, sx * 0.19, 1.12, -D / 2 - 0.05); arm.rotation.z = -sx * 0.5; const sk = cyl(g, 0.03, 0.06, 0.07, svart, sx * 0.25, 1.26, -D / 2 - 0.05, 10); sk.rotation.z = sx * 0.9; }
  // Filmburkar och liggaren på den undre hyllan
  box(g, W - 0.04, 0.02, D - 0.02, tra, 0, 0.5, -D / 2);
  for (const x of [-0.2, -0.12]) cyl(g, 0.03, 0.03, 0.05, mat('#c8b03a', { glans: 0.3, metall: 0.5 }), x, 0.535, -D / 2 + 0.05, 10);
  box(g, 0.2, 0.025, 0.28, mat('#3a2a1e'), 0.12, 0.522, -D / 2 + 0.02);
  return { grupp: g, haloPos: new THREE.Vector3(0, 1.62, 0) };
}

/** Kamin av gjutjärn med rökrör upp i taket och glöd bakom luckan. hojd (rummets höjd, 2,8). lyser (true). */
function kamin(d, ctx) {
  const g = new THREE.Group();
  const j = mat('#1e1e20', { glans: 0.6, metall: 0.4 });
  box(g, 0.6, 0.04, 0.6, mat('#5a5a56'), 0, 0.02, 0);
  cyl(g, 0.2, 0.22, 0.95, j, 0, 0.52, 0, 14);
  cyl(g, 0.23, 0.2, 0.05, j, 0, 1.02, 0, 14);
  cyl(g, 0.055, 0.055, (d.hojd || 2.8) - 1.04, j, 0, 1.04 + ((d.hojd || 2.8) - 1.04) / 2, -0.06, 8);
  for (let i = 0; i < 3; i++) cyl(g, 0.02, 0.02, 0.06, j, Math.cos(i * 2.1) * 0.17, 0.035, Math.sin(i * 2.1) * 0.17, 6);
  if (d.lyser !== false) { box(g, 0.14, 0.12, 0.02, mat('#ff8a3a', { emissive: '#ff6a1a' }), 0, 0.4, 0.21); ctx.ljus(g, new THREE.Vector3(0, 0.45, 0.4), '#ff9a50', d.styrka ?? 0.9, 4); }
  else box(g, 0.14, 0.12, 0.02, j, 0, 0.4, 0.21);
  return { grupp: g };
}

/** Vedlår av plåt, 0,5 m bred. full (true): fylld med vedträn. */
function vedlar(d) {
  const g = new THREE.Group();
  const plat = mat('#6a6a64', { glans: 0.6, metall: 0.4 });
  box(g, 0.5, 0.02, 0.36, plat, 0, 0.01, 0);
  for (const sz of [-1, 1]) box(g, 0.5, 0.34, 0.015, plat, 0, 0.17, sz * 0.18);
  for (const sx of [-1, 1]) box(g, 0.015, 0.34, 0.36, plat, sx * 0.25, 0.17, 0);
  if (d.full !== false) {
    const ved = mat('#b08a5a'), bark = mat('#5a4630');
    const tran = [[-0.13, 0.3, 0], [0.02, 0.31, 0.02], [0.15, 0.3, -0.02], [-0.06, 0.38, 0.01], [0.09, 0.385, 0]];
    for (const [x, y, z] of tran) { const t = cyl(g, 0.045, 0.045, 0.34, ved, x, y, z, 8); t.rotation.x = Math.PI / 2; const b = cyl(g, 0.047, 0.047, 0.3, bark, x, y - 0.004, z, 8, 1); b.rotation.x = Math.PI / 2; void b; }
  }
  return { grupp: g };
}

/**
 * Gruvlave: ett högt torn av timmer över schaktet, med linhjul i toppen och en lavbyggnad nedtill.
 * hojd (9). Står med framsidan mot +z; kollision för lavbyggnaden (2,6 × 2,6 m).
 */
function gruvlave(d) {
  const g = new THREE.Group();
  const H = d.hojd || 9, tra = mat('#5a2a22'), mork = mat('#3a1c18'), jarn = mat(JARN, { glans: 0.5, metall: 0.6 });
  box(g, 2.6, 3.0, 2.6, mat('#ffffff', { map: T.paneler('#6a2c22') }), 0, 1.5, 0);
  box(g, 2.9, 0.1, 2.9, mat('#e8ecf0'), 0, 3.05, 0); // snö på taket
  // Benen: fyra stolpar som lutar inåt
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
    const b = box(g, 0.2, H - 2.6, 0.2, tra, sx * 0.85, 3.0 + (H - 3.0) / 2 - 0.2, sz * 0.85);
    b.rotation.z = sx * 0.09; b.rotation.x = -sz * 0.09;
  }
  for (const y of [4.6, 6.2, 7.6]) { const k = 1.75 - (y - 3) * 0.13; box(g, k, 0.12, 0.12, mork, 0, y, k / 2); box(g, k, 0.12, 0.12, mork, 0, y, -k / 2); box(g, 0.12, 0.12, k, mork, k / 2, y, 0); box(g, 0.12, 0.12, k, mork, -k / 2, y, 0); }
  box(g, 1.5, 0.14, 1.5, mork, 0, H - 0.2, 0);
  // Linhjulen
  for (const sx of [-1, 1]) {
    const hjul = new THREE.Mesh(new THREE.TorusGeometry(0.62, 0.05, 6, 20), jarn); hjul.position.set(sx * 0.28, H + 0.5, 0); hjul.rotation.y = Math.PI / 2; g.add(hjul);
    for (let i = 0; i < 4; i++) { const e = box(g, 0.03, 1.2, 0.03, jarn, sx * 0.28, H + 0.5, 0); e.rotation.x = (i * Math.PI) / 4; }
  }
  box(g, 0.8, 0.1, 0.1, jarn, 0, H + 0.5, 0);
  box(g, 1.3, 0.1, 0.5, mat('#e8ecf0'), 0, H - 0.08, 0);
  // Porten in till laven
  box(g, 1.0, 2.0, 0.06, mat('#2a1a14'), 0, 1.0, 1.31); box(g, 1.2, 0.1, 0.1, mork, 0, 2.05, 1.33);
  return { grupp: g, fotavtryck: 2.8 };
}

/** Malmvagn på en bit räls, fylld med malm (och snö ovanpå). Ca 1,3 m lång längs x. */
function malmvagn() {
  const g = new THREE.Group();
  const j = mat('#3a3632', { glans: 0.7, metall: 0.4 }), rost = mat('#5a3a26');
  for (const sz of [-1, 1]) box(g, 2.6, 0.06, 0.05, mat('#4a4a48', { glans: 0.5, metall: 0.6 }), 0, 0.03, sz * 0.3);
  for (let x = -1.1; x <= 1.11; x += 0.44) box(g, 0.12, 0.04, 0.86, mat(MORKTRA), x, 0.02, 0);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) { const h = cyl(g, 0.16, 0.16, 0.05, j, sx * 0.38, 0.19, sz * 0.3, 12); h.rotation.x = Math.PI / 2; }
  box(g, 1.2, 0.08, 0.6, rost, 0, 0.36, 0);
  for (const sz of [-1, 1]) { const s = box(g, 1.3, 0.55, 0.03, j, 0, 0.66, sz * 0.36); s.rotation.x = -sz * 0.22; }
  for (const sx of [-1, 1]) box(g, 0.03, 0.55, 0.66, j, sx * 0.63, 0.66, 0);
  const malm = sph(g, 0.5, mat('#2a2a2e'), 0, 0.82, 0, 8); malm.scale.set(1.1, 0.45, 0.6);
  const sno = sph(g, 0.4, mat('#e8ecf0'), 0.05, 0.95, 0, 8); sno.scale.set(1.0, 0.25, 0.5);
  return { grupp: g };
}

Object.assign(prefabs, { ritbord, ritningsskap, kameraskap, kamin, vedlar, gruvlave, malmvagn });
