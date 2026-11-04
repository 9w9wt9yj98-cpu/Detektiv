// Teatern: scenridå, sufflörlucka, lindragets nagelbänk, sandsäckar, stege, golvmärken, sminkbord,
// kulisser, klädställning och strålkastare.
// Konventioner: se foremal/grund.js. Väggföremålen (nagelbank, stege) har origo i väggplanet.
import * as THREE from '../../../vendor/three/three.module.min.js';
import * as T from '../texturer.js';
import { prefabs, mat, box, cyl, sph, plan, kapsel, massing, MORKTRA, JARN } from './grund.js';

const rad = (g) => (g * Math.PI) / 180;
const nyans = (farg, f) => '#' + new THREE.Color(farg).multiplyScalar(f).getHexString();
function slump(seed) { let s = seed >>> 0 || 1; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
const REP = '#b39a6c';
const UPP = new THREE.Vector3(0, 1, 0);

/** Rak stång eller rep mellan två punkter. */
function stav(g, a, b, r, m, s = 6) {
  const v = new THREE.Vector3().subVectors(b, a);
  const me = new THREE.Mesh(new THREE.CylinderGeometry(r, r, v.length(), s), m);
  me.position.copy(a).addScaledVector(v, 0.5);
  me.quaternion.setFromUnitVectors(UPP, v.normalize());
  g.add(me); return me;
}
/** Böjligt rep eller kabel genom punkterna [[x, y, z], …]. */
function slang(g, punkter, r, m) {
  const kurva = new THREE.CatmullRomCurve3(punkter.map(([x, y, z]) => new THREE.Vector3(x, y, z)));
  const me = new THREE.Mesh(new THREE.TubeGeometry(kurva, punkter.length * 6, r, 6), m);
  g.add(me); return me;
}
function ring(g, R, r, m, x, y, z, rx = 0, ry = 0, bage = Math.PI * 2) {
  const me = new THREE.Mesh(new THREE.TorusGeometry(R, r, 6, 16, bage), m);
  me.position.set(x, y, z); me.rotation.set(rx, ry, 0); g.add(me); return me;
}
/** Cylinder som ligger längs x- eller z-axeln. */
function liggande(g, r, l, m, x, y, z, axel = 'x', s = 10) {
  const me = cyl(g, r, r, l, m, x, y, z, s);
  if (axel === 'x') me.rotation.z = Math.PI / 2; else me.rotation.x = Math.PI / 2;
  return me;
}

/**
 * Nedfälld scenridå: tunga sammetsveck längs x med guldfrans nedtill och en kappa upptill.
 * bredd (8), hojd (5), farg ('#7a1a1e'), kappa (true). Framsidan mot +z; kolliderar som en vägg.
 */
function rida(d) {
  const g = new THREE.Group();
  const B = d.bredd || 8, H = d.hojd || 5, farg = d.farg || '#7a1a1e';
  const ljus = mat(farg, { glans: 0.85 }), mork = mat(nyans(farg, 0.6), { glans: 0.85 }), djup = mat(nyans(farg, 0.35));
  const fransM = mat('#ffffff', { map: T.frans() }), band = massing();
  const veck = (y0, y1, z0, steg) => {
    const n = Math.max(4, Math.round(B / steg)), s = B / n, r = +(s * 0.62).toFixed(3);
    for (let i = 0; i < n; i++) {
      const x = -B / 2 + (i + 0.5) * s, fram = i % 2 === 0, z = z0 + (fram ? 0.04 : -0.01);
      cyl(g, r, r, y1 - y0, fram ? ljus : mork, x, (y0 + y1) / 2, z, 8);
      cyl(g, r + 0.006, r + 0.006, 0.05, band, x, y0 - 0.02, z, 8);
      cyl(g, r + 0.004, r + 0.012, 0.15, fransM, x, y0 - 0.12, z, 8);
    }
  };
  box(g, B, H - 0.2, 0.04, djup, 0, 0.2 + (H - 0.2) / 2, -0.05); // mörk duk bakom vecken
  veck(0.2, H, 0, 0.2);
  if (d.kappa !== false) veck(H - 0.55, H, 0.17, 0.16);
  return { grupp: g };
}

/**
 * Sufflörlucka i scenkanten: låg välvd kupa (0,9 × 0,45 × 0,6) med öppningen mot +z,
 * mörkt inre och en liten släckt lampa. farg ('#4a3220').
 */
function sufflorlucka(d) {
  const g = new THREE.Group();
  const B = 0.9, H = 0.45, D = 0.6;
  const kupa = (m, s) => {
    const me = new THREE.Mesh(new THREE.SphereGeometry(1, 18, 8, Math.PI, Math.PI, 0, Math.PI / 2), m);
    me.scale.set((B / 2) * s, H * s, D * s); me.position.set(0, 0, D / 2); g.add(me);
  };
  const tra = mat(d.farg || '#4a3220', { glans: 0.45 });
  kupa(tra, 1);
  kupa(mat('#3a281a', { side: THREE.BackSide, emissive: '#160d06' }), 0.96);
  ring(g, B / 2, 0.028, tra, 0, 0, D / 2, 0, 0, Math.PI);
  ring(g, B / 2 + 0.02, 0.008, massing(), 0, 0, D / 2 + 0.012, 0, 0, Math.PI);
  box(g, B + 0.12, 0.02, 0.1, mat(MORKTRA), 0, 0.01, D / 2 + 0.04); // tröskel mot scenen
  plan(g, B - 0.1, D - 0.08, mat('#050403'), 0, 0.004, 0.02, -Math.PI / 2); // schaktet ner till sufflören
  // Släckt lampa under valvet med en liten plåtskärm
  cyl(g, 0.012, 0.012, 0.06, mat(JARN), 0, H * 0.84, -0.06, 6);
  cyl(g, 0.02, 0.06, 0.05, mat('#2a2a28'), 0, H * 0.74, -0.06, 10);
  sph(g, 0.025, mat('#b8b2a0', { glans: 0.2 }), 0, H * 0.7, -0.06, 8);
  return { grupp: g, haloPos: new THREE.Vector3(0, 0.62, 0.25) };
}

/**
 * Nagelbänk på lindraget. Väggföremål: bommen löper längs x på 0,9 m höjd, framför väggen.
 * langd (3), antal (10) naglar, hojd (2,6) dit repen går, tom: index (0-baserade) för naglar utan rep.
 * Emaljskyltar med nummer 1…antal på bommens framsida under naglarna.
 */
function nagelbank(d) {
  const g = new THREE.Group();
  const L = d.langd || 3, N = d.antal || 10, Htop = d.hojd || 2.6, tom = new Set(d.tom || []);
  const tra = mat('#6e4826'), mork = mat(MORKTRA), nagelM = mat('#8a6236'), repM = mat(REP), jarn = mat(JARN);
  const y = 0.9, zb = 0.14;
  box(g, L + 0.2, 0.62, 0.03, mork, 0, 1.05, 0.015); // planka på väggen
  box(g, L + 0.1, 0.12, 0.18, tra, 0, y, zb); // bommen
  const nk = Math.max(2, Math.round(L / 1.4) + 1);
  for (let i = 0; i < nk; i++) {
    const x = -L / 2 + 0.05 + (i * (L - 0.1)) / (nk - 1);
    box(g, 0.07, 0.34, 0.04, mork, x, y - 0.24, 0.05);
    box(g, 0.05, 0.3, 0.05, mork, x, y - 0.15, 0.11, -0.75, 0, 0); // snedsträva
    sph(g, 0.012, jarn, x, y + 0.06, zb + 0.04, 6); sph(g, 0.012, jarn, x, y + 0.06, zb - 0.04, 6);
  }
  const steg = L / N;
  for (let i = 0; i < N; i++) {
    const x = -L / 2 + (i + 0.5) * steg;
    // Svarvad nagel genom bommen
    cyl(g, 0.028, 0.028, 0.02, nagelM, x, y + 0.07, zb, 10);
    cyl(g, 0.016, 0.022, 0.17, nagelM, x, y + 0.165, zb, 8);
    sph(g, 0.024, nagelM, x, y + 0.26, zb, 8);
    cyl(g, 0.016, 0.012, 0.14, nagelM, x, y - 0.13, zb, 8);
    // Emaljskylt med numret på bommens framsida, under nageln (där repen aldrig skymmer den)
    box(g, 0.085, 0.085, 0.006, mat('#1f2c4c'), x, y, zb + 0.093);
    plan(g, 0.075, 0.075, mat('#ffffff', { map: T.skylt(String(i + 1), { bredd: 64, hojd: 64, grund: '#ece6d4', farg: '#1f2c4c', storlek: i >= 9 ? 30 : 38 }) }), x, y, zb + 0.0965);
    if (tom.has(i)) continue; // linan har rusat: tom nagel
    // Rep beslaget i åttor runt nageln, upp mot taket, med en uppskjuten bukt under bommen
    stav(g, new THREE.Vector3(x - 0.035, y + 0.2, zb), new THREE.Vector3(x - 0.035, Htop, zb), 0.011, repM);
    for (const s of [-1, 1]) box(g, 0.015, 0.17, 0.012, repM, x, y + 0.16, zb + 0.024, 0, 0, s * 0.42);
    for (const yy of [y + 0.1, y + 0.21]) ring(g, 0.027, 0.008, repM, x, yy, zb, Math.PI / 2);
    ring(g, 0.085, 0.014, repM, x, y - 0.27, zb + 0.03);
    ring(g, 0.07, 0.013, repM, x + 0.008, y - 0.26, zb + 0.045);
  }
  return { grupp: g };
}

/**
 * Sandsäck i säckväv (0,35 × 0,55) med järnögla. liggande: på golvet, tillplattad, med utspilld sand
 * och en avsliten repände. Annars hängande: säckens botten på y0 (1,0) och repet upp till hojd (4).
 */
function sandsack(d) {
  const g = new THREE.Group();
  const vav = mat('#ffffff', { map: T.sackvav() }), repM = mat(REP), jarn = mat('#3a3634', { glans: 0.5, metall: 0.6 });
  const sack = new THREE.Group();
  kapsel(sack, 0.15, 0.22, vav, 0, 0.26, 0).scale.set(1.15, 1, 0.8);
  cyl(sack, 0.035, 0.1, 0.08, vav, 0, 0.53, 0, 8); // hopsnörd hals
  cyl(sack, 0.06, 0.035, 0.05, vav, 0, 0.59, 0, 8); // tofsen ovanför snöret
  ring(sack, 0.04, 0.009, repM, 0, 0.555, 0, Math.PI / 2);
  ring(sack, 0.035, 0.008, jarn, 0, 0.66, 0);
  if (d.liggande) {
    const ligg = new THREE.Group(); ligg.scale.y = 0.7; ligg.position.y = 0.12; g.add(ligg);
    sack.rotation.set(0.25, 0, Math.PI / 2); sack.position.x = 0.28; ligg.add(sack);
    // Sand som runnit ut ur en sprucken söm
    const strang = plan(g, 0.4, 0.75, mat('#ffffff', { map: T.sandstrang(), transparent: true }), 0.2, 0.005, 0.42, -Math.PI / 2);
    strang.rotation.z = 0.45; strang.renderOrder = 1;
    // Repstumpen från öglan, avsliten med fransiga trådar
    const o = [-0.39, 0.12, 0.02];
    const pk = [o, [-0.47, 0.04, 0.06], [-0.6, 0.014, 0.16], [-0.74, 0.014, 0.12], [-0.86, 0.014, 0.21]];
    slang(g, pk, 0.012, repM);
    for (let i = 0; i < 6; i++) { const a = -0.9 + i * 0.35; box(g, 0.05, 0.004, 0.005, repM, -0.88 - Math.cos(a) * 0.025, 0.014, 0.22 + Math.sin(a) * 0.025, 0, -a, 0); }
    return { grupp: g, fotavtryck: 0.5 };
  }
  const y0 = d.y0 ?? 1.0, Htop = d.hojd ?? 4;
  sack.position.y = y0; g.add(sack);
  stav(g, new THREE.Vector3(0, y0 + 0.69, 0), new THREE.Vector3(0, Htop, 0), 0.012, repM);
  ring(g, 0.02, 0.012, repM, 0, y0 + 0.72, 0, Math.PI / 2); // knopen
  return { grupp: g };
}

/** Järnstege fäst mot väggen. Väggföremål. hojd (3), bredd (0,5). */
function stege(d) {
  const g = new THREE.Group();
  const H = d.hojd || 3, B = d.bredd || 0.5, z = 0.16;
  const j = mat(d.farg || '#4a4c4a', { glans: 0.55, metall: 0.6 }), rost = mat('#5a3a26');
  for (const sx of [-1, 1]) {
    box(g, 0.014, H, 0.065, j, sx * B / 2, H / 2, z);
    box(g, 0.08, 0.012, 0.1, j, sx * B / 2, 0.006, z); // fotplatta
    for (let y = 0.6; y < H - 0.2; y += 1.2) {
      box(g, 0.012, 0.05, z - 0.02, j, sx * B / 2, y, (z - 0.02) / 2 + 0.01);
      box(g, 0.07, 0.11, 0.01, rost, sx * B / 2, y, 0.005);
      sph(g, 0.011, j, sx * B / 2, y + 0.03, 0.012, 6); sph(g, 0.011, j, sx * B / 2, y - 0.03, 0.012, 6);
    }
  }
  for (let y = 0.28; y < H - 0.05; y += 0.28) liggande(g, 0.013, B, j, 0, y, z, 'x', 8);
  return { grupp: g };
}

/** Markering på scengolvet utan kollision. marke: 'kryss' (kritkryss) eller 'tejp' (vitt T-märke). storlek, farg. */
function golvmarke(d) {
  const g = new THREE.Group();
  if (d.marke === 'tejp') {
    const s = d.storlek || 0.3, b = 0.05 * (s / 0.3), m = mat(d.farg || '#ece9df', { glans: 0.4 });
    box(g, s, 0.002, b, m, 0, 0.002, -s * 0.3, 0, 0.03, 0);
    box(g, b, 0.0022, s * 0.62, m, 0.004, 0.002, s * 0.03, 0, -0.02, 0);
  } else {
    const s = d.storlek || 0.35;
    const k = plan(g, s, s, mat(d.farg || '#f4f1e8', { map: T.kritkryss(), transparent: true, opacity: 0.92 }), 0, 0.004, 0, -Math.PI / 2);
    k.rotation.z = 0.12; k.renderOrder = 1;
  }
  return { grupp: g, kollision: false, haloPos: new THREE.Vector3(0, 0.2, 0) };
}

/**
 * Logens sminkbord med spegel inramad av glödlampor. storlek [bredd, höjd, djup] ([1,2, 0,75, 0,5]),
 * lyser (lamporna lyser och ger ett varmt ljus), styrka, farg. Ryggen mot väggen (−z).
 */
function sminkbord(d, ctx) {
  const g = new THREE.Group();
  const [W, H, D] = d.storlek || [1.2, 0.75, 0.5];
  const tra = mat(d.farg || '#6a4226'), mork = mat(MORKTRA);
  box(g, W, 0.04, D, tra, 0, H - 0.02, 0);
  box(g, W - 0.04, 0.12, D - 0.06, tra, 0, H - 0.1, -0.01);
  for (const sx of [-1, 1]) {
    box(g, W / 2 - 0.08, 0.09, 0.01, mork, sx * W / 4, H - 0.1, D / 2 - 0.035);
    sph(g, 0.015, massing(), sx * W / 4, H - 0.1, D / 2 - 0.022, 6);
    for (const sz of [-1, 1]) box(g, 0.045, H - 0.04, 0.045, tra, sx * (W / 2 - 0.05), (H - 0.04) / 2, sz * (D / 2 - 0.05));
  }
  // Spegeln i ram, med lampor upptill och på sidorna
  const sh = 0.8, zb = -D / 2 + 0.04;
  box(g, W - 0.06, sh, 0.04, mork, 0, H + sh / 2, zb);
  box(g, W - 0.32, sh - 0.18, 0.006, massing(), 0, H + sh / 2 - 0.01, zb + 0.021);
  plan(g, W - 0.36, sh - 0.22, mat('#ffffff', { map: T.spegel(), glans: 0.05, metall: 0.9 }), 0, H + sh / 2 - 0.01, zb + 0.025);
  const lampa = d.lyser ? mat('#fff6dc', { emissive: '#ffc96a' }) : mat('#d9d4c4', { glans: 0.2 });
  const glodlampa = (x, y) => { liggande(g, 0.017, 0.025, massing(), x, y, zb + 0.032, 'z', 8); sph(g, 0.03, lampa, x, y, zb + 0.065, 8); };
  const nTop = Math.max(3, Math.round((W - 0.2) / 0.2));
  for (let i = 0; i < nTop; i++) glodlampa(-W / 2 + 0.1 + (i * (W - 0.2)) / (nTop - 1), H + sh - 0.07);
  for (const sx of [-1, 1]) for (let y = H + 0.14; y < H + sh - 0.2; y += 0.17) glodlampa(sx * (W / 2 - 0.1), y);
  // Ett kort instucket i spegelramen
  plan(g, 0.09, 0.13, mat('#efe2c4'), -W / 2 + 0.26, H + sh - 0.22, zb + 0.029).rotation.z = 0.18;
  // På skivan: burkar, puderdosa med vippa, borste och läppstift
  const yt = H;
  [['#e8dcc4', '#7a1e2a', -0.38, 0.02], ['#d8e0d8', '#2c3e5a', -0.3, -0.06], ['#f0e4d0', '#b8893a', -0.22, 0.04]].forEach(([f, lock, x, z]) => {
    cyl(g, 0.032, 0.032, 0.06, mat(f), x * W / 1.2, yt + 0.03, z, 10);
    cyl(g, 0.034, 0.034, 0.015, mat(lock), x * W / 1.2, yt + 0.067, z, 10);
  });
  cyl(g, 0.06, 0.06, 0.025, mat('#e7b8b0'), 0.12, yt + 0.0125, 0.06, 14);
  cyl(g, 0.062, 0.062, 0.006, massing(), 0.12, yt + 0.027, 0.06, 14);
  sph(g, 0.04, mat('#f6ece8'), 0.25, yt + 0.012, 0.1, 8).scale.y = 0.35;
  const borste = new THREE.Group(); borste.position.set(0.32, yt + 0.01, -0.02); borste.rotation.y = 0.5; g.add(borste);
  liggande(borste, 0.008, 0.16, mat('#2a1a10'), 0, 0, 0, 'x', 6);
  liggande(borste, 0.009, 0.025, massing(), 0.09, 0, 0, 'x', 6);
  cyl(borste, 0.014, 0.01, 0.04, mat('#c8b090'), 0.12, 0, 0, 6).rotation.z = Math.PI / 2;
  cyl(g, 0.01, 0.01, 0.05, massing(), 0.42 * W / 1.2, yt + 0.025, 0.08, 8);
  cyl(g, 0.008, 0.009, 0.015, mat('#a8202a'), 0.42 * W / 1.2, yt + 0.057, 0.08, 8);
  if (d.lyser) ctx.ljus(g, new THREE.Vector3(0, H + 0.5, zb + 0.4), '#ffd9a0', d.styrka ?? 1.2, d.rackvidd ?? 4);
  return { grupp: g };
}

/**
 * Målad kuliss: duk på träram med en stötta och en tyngd bakom. storlek [b, h] ([1,4, 3,2]),
 * farg för den målade salongsväggen, baksida (vänder baksidan mot +z: oblekt duk, ram och schablontext),
 * text (schablontexten, \n ger flera rader), stotta (avstånd bak till stöttans fot, 0,9; false = ingen).
 */
function kuliss(d) {
  const g = new THREE.Group();
  const k = new THREE.Group(); g.add(k);
  const [B, H] = d.storlek || [1.4, 3.2];
  plan(k, B, H, mat('#ffffff', { map: T.kulissMalad(d.farg || '#4f6b4a', [B, H]) }), 0, H / 2, 0.001);
  plan(k, B, H, mat('#ffffff', { map: T.kulissBak(d.text || '', [B, H]) }), 0, H / 2, -0.001, 0, Math.PI);
  const lakt = mat('#b89a6a'), plywood = mat('#cdb48a');
  const t = 0.022, b = 0.07, z = -0.002 - t / 2;
  for (const sx of [-1, 1]) box(k, b, H, t, lakt, sx * (B / 2 - b / 2), H / 2, z);
  for (const yy of [b / 2, H - b / 2, H / 3, (2 * H) / 3]) box(k, B - 2 * b, b, t, lakt, 0, yy, z);
  const dl = Math.min(0.62, B * 0.45);
  box(k, 0.05, dl, t, lakt, B / 2 - b - dl * 0.32, b + dl * 0.32, z, 0, 0, Math.PI / 4);
  box(k, 0.05, dl, t, lakt, -B / 2 + b + dl * 0.32, H - b - dl * 0.32, z, 0, 0, Math.PI / 4);
  for (const sx of [-1, 1]) for (const yy of [b / 2, H - b / 2]) box(k, 0.13, 0.13, 0.004, plywood, sx * (B / 2 - 0.07), yy + (yy < 1 ? 0.03 : -0.03), z - t / 2 - 0.002);
  if (d.stotta !== false) {
    const s = typeof d.stotta === 'number' ? d.stotta : 0.9, yh = Math.min(2.1, H * 0.66);
    const a = new THREE.Vector3(0, yh, -0.035), f = new THREE.Vector3(0, 0.02, -s);
    stav(k, f, a, 0.018, lakt, 6);
    box(k, 0.05, 0.08, 0.02, mat(JARN), 0, yh, -0.03); // krok i ramen
    box(k, 0.32, 0.09, 0.14, mat('#252526', { glans: 0.6, metall: 0.5 }), 0, 0.045, -s + 0.04); // tyngd
    box(k, 0.06, 0.04, 0.02, mat('#252526'), 0, 0.11, -s + 0.04);
  }
  if (d.baksida) k.rotation.y = Math.PI;
  return { grupp: g, haloPos: new THREE.Vector3(0, Math.min(1.7, H * 0.55), d.baksida ? -0.05 : 0.05) };
}

/** Klädställning med kostymer på galgar. langd (1,6); färger och plagg ur seed. */
function kladstallning(d) {
  const g = new THREE.Group();
  const L = d.langd || 1.6, r = slump(d.seed || 17), Y = 1.62;
  const jarn = mat('#3a3a3c', { glans: 0.4, metall: 0.7 });
  for (const sx of [-1, 1]) {
    const x = sx * L / 2;
    cyl(g, 0.016, 0.016, Y - 0.06, jarn, x, 0.06 + (Y - 0.06) / 2, 0, 8);
    box(g, 0.04, 0.03, 0.56, jarn, x, 0.075, 0);
    for (const sz of [-1, 1]) sph(g, 0.03, mat('#1a1a1a'), x, 0.03, sz * 0.25, 8);
  }
  liggande(g, 0.014, L + 0.04, jarn, 0, Y, 0, 'x', 8);
  const FARGER = ['#7a1e2a', '#2c3e5a', '#c9a24a', '#3f5a3a', '#e8dcc4', '#1e1e22', '#6a3a5a', '#8a5a2a', '#a83a2a', '#4a6a7a', '#d8c0a0'];
  const galge = mat('#8a6236'), krok = mat('#9a9a96');
  const n = Math.max(2, Math.floor((L - 0.16) / 0.11));
  for (let i = 0; i < n; i++) {
    const p = new THREE.Group();
    p.position.set(-L / 2 + 0.08 + ((i + 0.5) * (L - 0.16)) / n, Y, 0); p.rotation.y = 0.55 + (r() - 0.5) * 0.12; g.add(p);
    cyl(p, 0.004, 0.004, 0.06, krok, 0, -0.02, 0, 4);
    box(p, 0.014, 0.014, 0.42, galge, 0, -0.06, 0);
    const farg = FARGER[(r() * FARGER.length) | 0], m = mat(farg), sl = mat(nyans(farg, 0.7)), typ = r();
    if (typ < 0.4) { // rock
      const h = 0.85 + r() * 0.25;
      box(p, 0.06, h, 0.44, m, 0, -0.07 - h / 2, 0);
      box(p, 0.064, h * 0.45, 0.07, sl, 0, -0.1 - h * 0.22, 0.12);
    } else if (typ < 0.75) { // klänning
      box(p, 0.05, 0.32, 0.34, m, 0, -0.23, 0);
      box(p, 0.054, 0.04, 0.35, sl, 0, -0.38, 0);
      cyl(p, 0.17, 0.27, 0.72, m, 0, -0.76, 0, 12).scale.x = 0.2;
    } else { // väst eller kavaj med skjorta
      const h = 0.55 + r() * 0.1;
      box(p, 0.05, h + 0.08, 0.38, mat('#ece4d2'), 0, -0.1 - (h + 0.08) / 2, 0);
      box(p, 0.06, h, 0.42, m, 0, -0.07 - h / 2, 0.02);
    }
  }
  return { grupp: g };
}

/**
 * Teaterstrålkastare: svart plåtcylinder med lins i en bygel. På stativ (lampans mitt på 1,75 m) eller
 * hangande på en rörbom på hojd (3,2) med ror (bommens längd, 1,2) och linor upp till tak (hojd + 2).
 * lutning (grader nedåt; 10 på stativ, 35 hängande). lyser: riktat ljus med styrka (10), rackvidd (12),
 * vinkel (grader, 18), farg ('#ffe2b0') och en svag ljuskägla (kon: false tar bort den).
 */
function stralkastare(d) {
  const g = new THREE.Group();
  const svart = mat('#1c1c1e', { glans: 0.5, metall: 0.4 }), jarn = mat(JARN), kabel = mat('#121212');
  const hang = !!d.hangande, hojd = d.hojd ?? 3.2;
  const cy = hang ? hojd - 0.42 : 1.75;
  if (hang) {
    const R = d.ror ?? 1.2, tak = d.tak ?? hojd + 2;
    if (R > 0) {
      liggande(g, 0.024, R, mat('#4a4a4c', { glans: 0.4, metall: 0.7 }), 0, hojd, 0, 'x', 10);
      for (const sx of [-1, 1]) stav(g, new THREE.Vector3(sx * (R / 2 - 0.05), hojd, 0), new THREE.Vector3(sx * (R / 2 - 0.05), tak, 0), 0.004, jarn, 4);
    }
    box(g, 0.05, 0.1, 0.07, jarn, 0, hojd - 0.02, 0); // klämma
    cyl(g, 0.012, 0.012, 0.16, jarn, 0, hojd - 0.13, 0, 6);
    box(g, 0.38, 0.025, 0.04, svart, 0, cy + 0.2, 0);
    for (const sx of [-1, 1]) box(g, 0.025, 0.22, 0.04, svart, sx * 0.18, cy + 0.1, 0);
    slang(g, [[0, cy, -0.24], [0.05, cy + 0.2, -0.3], [0.1, hojd - 0.03, -0.05], [0.4, hojd - 0.03, 0.0]], 0.008, kabel);
  } else {
    const top = new THREE.Vector3(0, 0.7, 0);
    for (let i = 0; i < 3; i++) { const a = (i * Math.PI * 2) / 3 + Math.PI / 3; stav(g, top, new THREE.Vector3(Math.sin(a) * 0.38, 0.01, Math.cos(a) * 0.38), 0.014, jarn); }
    cyl(g, 0.03, 0.03, 0.12, jarn, 0, 0.7, 0, 8);
    cyl(g, 0.022, 0.022, cy - 0.22 - 0.64, jarn, 0, (0.64 + cy - 0.22) / 2, 0, 8);
    cyl(g, 0.016, 0.016, 0.08, jarn, 0.03, 1.1, 0, 6).rotation.z = Math.PI / 2; // låsskruv
    box(g, 0.38, 0.025, 0.04, svart, 0, cy - 0.22, 0);
    for (const sx of [-1, 1]) box(g, 0.025, 0.22, 0.04, svart, sx * 0.18, cy - 0.11, 0);
    slang(g, [[0, cy - 0.04, -0.24], [0.04, cy - 0.5, -0.3], [0.03, 0.6, -0.1], [0.12, 0.012, -0.3], [0.5, 0.012, -0.8], [0.6, 0.012, -1.3]], 0.008, kabel);
  }
  for (const sx of [-1, 1]) { liggande(g, 0.03, 0.03, svart, sx * 0.2, cy, 0, 'x', 10); liggande(g, 0.012, 0.05, massing(), sx * 0.235, cy, 0, 'x', 6); }
  // Kroppen, lutad nedåt
  const k = new THREE.Group(); k.position.set(0, cy, 0); k.rotation.x = rad(d.lutning ?? (hang ? 35 : 10)); g.add(k);
  liggande(k, 0.145, 0.42, svart, 0, 0, 0, 'z', 16);
  liggande(k, 0.12, 0.04, svart, 0, 0, -0.23, 'z', 14);
  liggande(k, 0.158, 0.04, svart, 0, 0, 0.2, 'z', 16);
  const lyser = !!d.lyser, farg = d.farg || '#ffe2b0';
  liggande(k, 0.118, 0.02, lyser ? mat('#fff4d8', { emissive: farg }) : mat('#2c3438', { glans: 0.05, metall: 0.3 }), 0, 0, 0.215, 'z', 16);
  for (const [w, h, x, y] of [[0.32, 0.025, 0, 0.16], [0.32, 0.025, 0, -0.16], [0.025, 0.32, 0.16, 0], [0.025, 0.32, -0.16, 0]]) box(k, w, h, 0.012, svart, x, y, 0.245);
  box(k, 0.13, 0.08, 0.18, svart, 0, 0.17, -0.02); // skorsten
  box(k, 0.17, 0.02, 0.22, svart, 0, 0.215, -0.02);
  box(k, 0.03, 0.1, 0.03, svart, 0, 0.08, -0.25); // handtag
  box(k, 0.03, 0.03, 0.08, svart, 0, 0.13, -0.22);
  if (lyser) {
    const vinkel = rad(d.vinkel ?? 18), avst = d.rackvidd ?? 12;
    const sp = new THREE.SpotLight(farg, d.styrka ?? 10, avst, vinkel, 0.45, 1.6);
    sp.position.set(0, 0, 0.24); sp.target.position.set(0, 0, 5); k.add(sp, sp.target);
    if (d.kon !== false) {
      const Lk = Math.min(avst * 0.35, 4), rk = Lk * Math.tan(vinkel) * 0.9;
      const kon = new THREE.Mesh(new THREE.ConeGeometry(rk, Lk, 24, 1, true), new THREE.MeshBasicMaterial({ map: T.ljuskon(), color: farg, transparent: true, opacity: 0.07, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }));
      kon.rotation.x = -Math.PI / 2; kon.position.z = 0.23 + Lk / 2; kon.renderOrder = 3;
      kon.raycast = () => {}; // ljuset ska inte skymma föremål bakom för tryck
      k.add(kon);
    }
  }
  return { grupp: g, fotavtryck: hang ? undefined : 0.6, kollision: hang ? false : undefined };
}

Object.assign(prefabs, { rida, sufflorlucka, nagelbank, sandsack, stege, golvmarke, sminkbord, kuliss, kladstallning, stralkastare });
