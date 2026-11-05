// Fjällhotellet: gamla träskidor med bambustavar, läderpjäxor, en uppbruten panel med hålrum, arkivkartonger,
// byggarbetslampa, byggplast och skidställ.
// Konventioner: se foremal/grund.js. Väggföremålen (skidor med lutad, panelhal, skidstall) har origo i väggplanet
// och sticker ut mot +z.
import * as THREE from '../../../vendor/three/three.module.min.js';
import * as T from '../texturer.js';
import { prefabs, mat, box, cyl, sph, plan, DELADE, JARN } from './grund.js';

const rad = (g) => (g * Math.PI) / 180;
const nyans = (farg, f) => '#' + new THREE.Color(farg).multiplyScalar(f).getHexString();
function slump(seed) { let s = seed >>> 0 || 1; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
const UPP = new THREE.Vector3(0, 1, 0);

/** Rak stång mellan två punkter. */
function stav(g, a, b, r, m, s = 6) {
  const v = new THREE.Vector3().subVectors(b, a);
  const me = new THREE.Mesh(new THREE.CylinderGeometry(r, r, v.length(), s), m);
  me.position.copy(a).addScaledVector(v, 0.5);
  me.quaternion.setFromUnitVectors(UPP, v.normalize());
  g.add(me); return me;
}
/** Böjlig kabel, rem eller vajer genom punkterna [[x, y, z], …]. */
function slang(g, punkter, r, m, sluten = false) {
  const kurva = new THREE.CatmullRomCurve3(punkter.map(([x, y, z]) => new THREE.Vector3(x, y, z)), sluten);
  const me = new THREE.Mesh(new THREE.TubeGeometry(kurva, punkter.length * 6, r, 6, sluten), m);
  g.add(me); return me;
}
function ring(g, R, r, m, x, y, z, rx = 0, ry = 0) {
  const me = new THREE.Mesh(new THREE.TorusGeometry(R, r, 6, 16), m);
  me.position.set(x, y, z); me.rotation.set(rx, ry, 0); g.add(me); return me;
}
/** Cylinder som ligger längs x- eller z-axeln. */
function liggande(g, r, l, m, x, y, z, axel = 'x', s = 10) {
  const me = cyl(g, r, r, l, m, x, y, z, s);
  if (axel === 'x') me.rotation.z = Math.PI / 2; else me.rotation.x = Math.PI / 2;
  return me;
}

// ---- Skidor och stavar ----

const KROM = () => mat('#a8aaa6', { glans: 0.25, metall: 0.8 });
const SKIDLANGD = 2.05, SKIDBREDD = 0.068;
/** Skidans tjocklek vid u (0 = bakänden, 1 = spetsen): tjockast under bindningen. */
const tjocklek = (u) => 0.011 + 0.012 * Math.sin(Math.PI * Math.min(1, u / 0.92));
/** Spetsens uppböjning vid u. */
const lyft = (u) => { const s = Math.max(0, (u - 0.84) / 0.16); return 0.12 * s * s; };
const skidGeo = new Map();
/** En skida längs +z från bakänden i z = 0 till spetsen i z = L, undersidan i y = 0: midja, uppböjd spets, rundad ände. */
function skidform(L) {
  const k = L.toFixed(3);
  if (skidGeo.has(k)) return skidGeo.get(k);
  const geo = new THREE.BoxGeometry(1, 1, 1, 1, 1, 48);
  const p = geo.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const u = p.getZ(i) + 0.5;
    let bf = 0.9 + 0.1 * Math.min(1, Math.abs(u - 0.47) * 2.6); // midjan under bindningen
    if (u > 0.92) bf *= 1 - Math.pow((u - 0.92) / 0.08, 2) * 0.72; // spetsen smalnar av
    if (u < 0.02) bf *= 0.82 + (u / 0.02) * 0.18;
    const y = (p.getY(i) + 0.5) * tjocklek(u) + lyft(u) + (u < 0.04 ? ((0.04 - u) / 0.04) ** 2 * 0.012 : 0);
    p.setXYZ(i, p.getX(i) * SKIDBREDD * bf, y, u * L - lyft(u) * 0.35);
  }
  geo.computeVertexNormals();
  skidGeo.set(k, geo); DELADE.add(geo);
  return geo;
}

/**
 * Ett par skidor sida vid sida i skidans egna koordinater (bakänden i z = 0, spetsen mot +z, undersidan i y = 0)
 * med kabelbindningar: tåjärn, framspänne, vajer runt hälen och en gummiplatta. Ett läderband håller ihop paret.
 */
function skidpar(farg, L = SKIDLANGD) {
  const g = new THREE.Group();
  const lack = mat(farg, { glans: 0.28 }), krom = KROM(), svart = mat('#1c1a18', { glans: 0.5 }), lader = mat('#4a2c18', { glans: 0.6 });
  const dekor = mat('#e8dcc0', { glans: 0.3 }), dekor2 = mat(nyans(farg, 0.45), { glans: 0.3 }), gummi = mat('#3a3430', { glans: 0.7 });
  for (const sx of [-1, 1]) {
    const x = sx * 0.042;
    const me = new THREE.Mesh(skidform(L), lack); me.position.x = x; g.add(me);
    const t = (u) => tjocklek(u) + 0.001;
    const zt = 0.53 * L, zh = 0.37 * L, zl = 0.6 * L, yb = t(0.5);
    // Tåjärn: två uppvikta öron på en smal platta
    box(g, SKIDBREDD * 0.9, 0.003, 0.03, krom, x, yb + 0.0015, zt + 0.02);
    for (const s of [-1, 1]) box(g, 0.004, 0.035, 0.06, krom, x + s * (SKIDBREDD * 0.46 + 0.002), yb + 0.015, zt);
    // Framspännet (Kandahar) och vajern runt hälen, med spiralfjäder bak
    box(g, 0.026, 0.008, 0.05, krom, x, t(0.6) + 0.004, zl);
    box(g, 0.02, 0.012, 0.035, krom, x, t(0.6) + 0.012, zl + 0.006, -0.25, 0, 0);
    const yv = yb + 0.012, sk = SKIDBREDD * 0.46 + 0.004;
    slang(g, [[x + 0.01, yv, zl - 0.01], [x + sk, yv, zt + 0.03], [x + sk, yv, zh + 0.05], [x + 0.022, yv + 0.016, zh], [x - 0.022, yv + 0.016, zh], [x - sk, yv, zh + 0.05], [x - sk, yv, zt + 0.03], [x - 0.01, yv, zl - 0.01]], 0.0022, krom);
    liggande(g, 0.006, 0.042, svart, x, yv + 0.016, zh - 0.002, 'x', 8);
    for (const s of [-1, 1]) box(g, 0.006, 0.01, 0.014, krom, x + s * sk, yv - 0.003, zt - 0.09); // sidokrokar
    box(g, SKIDBREDD * 0.7, 0.003, 0.07, gummi, x, yb + 0.001, zh + 0.07); // hälplatta av gummi
    // Lackerad dekor nära spetsen: två ljusa tvärränder kring en mörk
    for (const [u, m] of [[0.76, dekor], [0.772, dekor2], [0.784, dekor]]) box(g, SKIDBREDD * 0.86, 0.002, 0.01, m, x, t(u) + 0.001, u * L);
  }
  // Läderbandet runt paret
  box(g, 0.17, 0.006, 0.03, lader, 0, tjocklek(0.75) + 0.003, 0.75 * L);
  for (const s of [-1, 1]) box(g, 0.006, tjocklek(0.75) + 0.008, 0.03, lader, s * 0.083, tjocklek(0.75) / 2, 0.75 * L);
  box(g, 0.016, 0.01, 0.02, krom, 0.05, tjocklek(0.75) + 0.006, 0.75 * L);
  return g;
}

/** Bambustav med lädergrepp och handlovsrem, trissa av bambu och läder och stålspets. Längs +y med spetsen i origo. */
function skidstav(langd = 1.35) {
  const g = new THREE.Group();
  const bambu = mat('#c8a868', { glans: 0.35 }), knut = mat('#8a6a38', { glans: 0.4 }), lader = mat('#6a4024', { glans: 0.6 });
  const krom = KROM();
  cyl(g, 0.009, 0.0115, langd - 0.04, bambu, 0, 0.04 + (langd - 0.04) / 2, 0, 8);
  for (let y = 0.22; y < langd - 0.2; y += 0.26) cyl(g, 0.0125, 0.0125, 0.012, knut, 0, y, 0, 8);
  cyl(g, 0.004, 0.009, 0.05, krom, 0, 0.025, 0, 6); // spetsen
  // Trissan: en ring med fyra remmar in till staven
  const yt = 0.1, R = 0.06;
  ring(g, R, 0.006, bambu, 0, yt, 0, Math.PI / 2);
  for (let i = 0; i < 4; i++) { const a = (i * Math.PI) / 2 + 0.4; stav(g, new THREE.Vector3(Math.cos(a) * 0.01, yt + 0.025, Math.sin(a) * 0.01), new THREE.Vector3(Math.cos(a) * R, yt, Math.sin(a) * R), 0.003, lader, 4); }
  cyl(g, 0.014, 0.014, 0.02, lader, 0, yt + 0.025, 0, 8);
  // Greppet och remmen
  cyl(g, 0.016, 0.014, 0.17, lader, 0, langd - 0.09, 0, 8);
  cyl(g, 0.018, 0.018, 0.015, lader, 0, langd - 0.005, 0, 8);
  slang(g, [[0.014, langd - 0.04, 0], [0.03, langd - 0.12, 0.012], [0.04, langd - 0.25, 0.02], [0.012, langd - 0.28, 0.018], [-0.006, langd - 0.18, 0.012], [-0.01, langd - 0.06, 0.004]], 0.004, lader);
  return g;
}

/**
 * Ett par gamla träskidor (2,05 m) med kabelbindningar och två bambustavar. farg: lacken ('#8a5428').
 * lutad: paret och stavarna står lutade mot en vägg bakom (−z) – väggföremål med origo i väggplanet,
 * skidorna till vänster (x ≈ −0,1) och stavarna till höger (x ≈ 0,2), fötterna 0,2–0,4 m ut från väggen.
 * Annars ligger paret på golvet längs lokal z (spetsarna mot +z) med stavarna till höger.
 * stavar (true): false tar bort stavarna. Kollisionen är föremålets låda.
 */
function skidor(d) {
  const g = new THREE.Group();
  const par = skidpar(d.farg || '#8a5428');
  const stavar = d.stavar === false ? [] : [skidstav(), skidstav()];
  if (d.lutad) {
    const lut = rad(12), s0 = 0.84 * SKIDLANGD;
    par.rotation.set(Math.PI / 2 - lut, Math.PI, 0);
    par.position.set(-0.1, 0, s0 * Math.sin(lut) + 0.006);
    stavar.forEach((st, i) => {
      const a = rad(9 + i * 1.5);
      st.rotation.set(-a, 0.3 + i * 0.9, 0); // vriden runt sin egen axel, sedan lutad mot väggen
      st.position.set(0.17 + i * 0.07, 0, 1.33 * Math.sin(a) + 0.02);
    });
  } else {
    par.position.set(0, 0, -SKIDLANGD / 2);
    stavar.forEach((st, i) => {
      st.rotation.set(Math.PI / 2 + 0.035, (i - 0.5) * 0.06, 0, 'YXZ');
      st.position.set(0.2 + i * 0.13, 0.066, -0.62 + i * 0.05);
    });
  }
  g.add(par, ...stavar);
  return { grupp: g, haloPos: d.lutad ? new THREE.Vector3(0, 1.5, 0.3) : new THREE.Vector3(0, 0.3, 0) };
}

/** En pjäxa längs +z (tån framåt), sulan i y = 0. */
function pjaxa(farg, snoreFarg) {
  const g = new THREE.Group();
  const lader = mat(farg, { glans: 0.45 }), mork = mat(nyans(farg, 0.6), { glans: 0.45 }), sula = mat('#1e1610', { glans: 0.6 });
  const snore = mat(snoreFarg), krok = mat('#8a8a84', { glans: 0.3, metall: 0.7 });
  // Kraftig sula med fyrkantig tå (för tåjärnet) och spår i hälen för bindningens vajer
  box(g, 0.108, 0.03, 0.3, sula, 0, 0.015, 0);
  box(g, 0.1, 0.008, 0.06, mat('#3a2a1c'), 0, 0.034, 0.12);
  box(g, 0.1, 0.012, 0.012, mat('#0a0806'), 0, 0.055, -0.147);
  // Ovanlädret: fot, tåhätta, skaft med stoppad krage
  box(g, 0.094, 0.07, 0.19, lader, 0, 0.065, -0.03);
  const ta = sph(g, 1, lader, 0, 0.03, 0.065, 12); ta.scale.set(0.047, 0.055, 0.085);
  box(g, 0.098, 0.15, 0.13, lader, 0, 0.105, -0.078);
  box(g, 0.104, 0.024, 0.136, mork, 0, 0.188, -0.078);
  box(g, 0.1, 0.012, 0.004, mork, 0, 0.11, -0.144); // sömmen bak
  // Vristen: en sluttande tunga med snörning i kors och en rosett upptill
  const v = new THREE.Group(); v.position.set(0, 0.118, 0.028); v.rotation.x = 0.82; g.add(v);
  box(v, 0.09, 0.03, 0.14, lader, 0, 0, 0);
  box(v, 0.05, 0.006, 0.15, mork, 0, 0.017, 0);
  for (let i = 0; i < 5; i++) {
    const z = -0.055 + i * 0.027;
    for (const s of [-1, 1]) sph(v, 0.005, krok, s * 0.035, 0.016, z, 6);
    if (i < 4) for (const s of [-1, 1]) box(v, 0.075, 0.004, 0.004, snore, 0, 0.021, z + 0.0135, 0, s * 0.36, 0);
  }
  ring(v, 0.016, 0.003, snore, -0.016, 0.024, -0.075, Math.PI / 2 - 0.3, 0);
  ring(v, 0.016, 0.003, snore, 0.016, 0.024, -0.075, Math.PI / 2 + 0.3, 0);
  slang(g, [[0, 0.2, -0.02], [0.03, 0.17, 0.0], [0.05, 0.1, 0.01], [0.052, 0.07, 0.03]], 0.0025, snore);
  return g;
}

/** Ett par gamla läderpjäxor med snören, ca 0,3 m långa. farg ('#6a4026'), snore ('#c8b898'). Ingen kollision. */
function pjaxor(d) {
  const g = new THREE.Group();
  const farg = d.farg || '#6a4026', snore = d.snore || '#c8b898';
  const v = pjaxa(farg, snore); v.position.set(-0.065, 0, 0); v.rotation.y = 0.08; g.add(v);
  const h = pjaxa(farg, snore); h.position.set(0.075, 0, -0.02); h.rotation.y = -0.14; h.scale.x = -1; g.add(h);
  return { grupp: g, kollision: false, haloPos: new THREE.Vector3(0, 0.32, 0) };
}

// ---- Den uppbrutna panelen ----

/** Bräda av pärlspont. Texturen löper längs brädan (ett varv per 2 m) från u0, så att bitarna får jämn ådring. */
function brada(g, L, h, t, m, x, y, z, u0 = 0) {
  const geo = new THREE.BoxGeometry(L, h, t), uv = geo.attributes.uv;
  for (let i = 0; i < uv.count; i++) uv.setX(i, u0 + (uv.getX(i) * L) / 2);
  const me = new THREE.Mesh(geo, m); me.position.set(x, y, z); g.add(me); return me;
}

/**
 * Väggpanel av liggande pärlspont som brutits upp. Väggföremål med origo i väggplanet: panelen sitter som en
 * inklädnad framför väggen, med framsidan i z = djup + 0,02 och ett mörkt hålrum mellan väggen och panelen
 * (rummets vägg skulle annars skymma hålrummet). Lägg den över hela väggen (bredd = väggens bredd) så ser det ut
 * som att väggen själv är uppbruten.
 * bredd (2,0), hojd (2,2), djup (0,4), farg (furu, '#c49a62'),
 * hal: [x, y, b, h] – hålet räknat från panelens nedre vänstra hörn (sett framifrån), [0,2, 0,1, 0,9, 1,6];
 * brädorna i hålets höjd är bortbrutna och kanterna splittrade. brador (true): lösa brädor på golvet framför,
 * kofot (true): en kofot på högen. Kollisionen täcker inklädnaden och brädhögen (ca 0,85 m ut från väggen).
 */
function panelhal(d) {
  const g = new THREE.Group();
  const B = d.bredd || 2.0, H = d.hojd || 2.2, D = d.djup ?? 0.4, t = 0.02;
  const [hx, hy, hb, hh] = d.hal || [0.2, 0.1, 0.9, 1.6];
  const r = slump(d.seed || 23);
  const farg = d.farg || '#c49a62';
  const panel = mat('#ffffff', { map: T.parlspont(farg) }), kant = mat(nyans(farg, 0.82));
  const ra = mat('#b89a74'), morkt = mat('#3a3026'), zf = D + t / 2;
  const x0 = -B / 2 + hx, x1 = x0 + hb;
  const n = Math.max(1, Math.round(H / 0.095)), bh = H / n;
  const iHal = (i) => { const yc = (i + 0.5) * bh; return yc > hy && yc < hy + hh; };
  // Brädorna. I hålets höjd slutar de i brutna ändar med flisor.
  const flisor = (x, y, riktning) => {
    for (let k = 0; k < 3; k++) {
      const l = 0.02 + r() * 0.08, hj = 0.005 + r() * 0.012;
      box(g, l, hj, t * (0.3 + r() * 0.4), ra, x + riktning * l / 2, y + (r() - 0.5) * (bh - hj - 0.01), zf + (r() - 0.6) * t * 0.5, 0, (r() - 0.5) * 0.3, (r() - 0.5) * 0.3);
    }
    box(g, 0.004, bh - 0.004, t, ra, x - riktning * 0.002, y, zf); // ljust, färskt brott
  };
  for (let i = 0; i < n; i++) {
    const y = (i + 0.5) * bh;
    const u0 = r() * 4;
    if (!iHal(i)) { brada(g, B, bh - 0.002, t, panel, 0, y, zf, u0); continue; }
    const a = x0 + (r() - 0.5) * 0.08, b = x1 + (r() - 0.5) * 0.08;
    if (a > -B / 2 + 0.01) { brada(g, a + B / 2, bh - 0.002, t, panel, (-B / 2 + a) / 2, y, zf, u0); flisor(a, y, 1); }
    if (b < B / 2 - 0.01) { brada(g, B / 2 - b, bh - 0.002, t, panel, (b + B / 2) / 2, y, zf, u0 + (b + B / 2) / 2); flisor(b, y, -1); }
  }
  // Lister: taklist, golvlist (bruten vid hålet) och hörnlister
  box(g, B + 0.04, 0.05, 0.03, kant, 0, H - 0.025, D + t + 0.015);
  const gl = (a, b) => { if (b - a > 0.02) box(g, b - a, 0.07, 0.018, kant, (a + b) / 2, 0.035, D + t + 0.009); };
  if (hy < 0.08) { gl(-B / 2, x0 - 0.02); gl(x1 + 0.03, B / 2); } else gl(-B / 2, B / 2);
  for (const s of [-1, 1]) box(g, 0.03, H, 0.03, kant, s * (B / 2 - 0.005), H / 2, D + t - 0.005);
  // Inklädnadens gavlar och tak
  for (const s of [-1, 1]) box(g, t, H, D, panel, s * (B / 2 - t / 2), H / 2, D / 2);
  box(g, B, t, D, morkt, 0, H - t / 2, D / 2);
  // Hålrummet: gammal mörk brädvägg bak (framför rummets bröstpanel och lister, z = 0,07), reglar, syll,
  // damm och kutterspån, och spindelväv i hörnet
  const zb = Math.min(0.07, D / 3);
  plan(g, B - 2 * t, H - t, mat('#ffffff', { map: T.trapanel('#5a4632') }), 0, (H - t) / 2, zb);
  plan(g, B - 2 * t, D, mat('#4a3e32'), 0, 0.003, D / 2, -Math.PI / 2);
  box(g, B - 2 * t, 0.045, 0.09, morkt, 0, 0.0225, D - 0.045);
  box(g, B - 2 * t, 0.045, 0.09, morkt, 0, H - t - 0.0225, D - 0.045);
  const reglar = [-B / 2 + t + 0.0225, B / 2 - t - 0.0225];
  for (let x = -B / 2 + 0.6; x < B / 2 - 0.3; x += 0.6) if (x < x0 - 0.04 || x > x1 + 0.04) reglar.push(x);
  for (const x of reglar) box(g, 0.045, H - t, 0.09, morkt, x, (H - t) / 2, D - 0.045);
  const span = mat('#a8885a');
  for (let i = 0; i < 40; i++) { const s = 0.01 + r() * 0.02; box(g, s, 0.004, s * 0.6, span, x0 + r() * hb, 0.003 + r() * 0.012, 0.03 + r() * (D - 0.12), 0, r() * 3, r() * 0.5); }
  const vav = plan(g, 0.38, 0.38, mat('#ffffff', { map: T.spindelvav(), transparent: true, opacity: 0.8, side: THREE.DoubleSide }), x0 + 0.17, Math.min(H - t, hy + hh + 0.1) - 0.19, D * 0.45);
  vav.renderOrder = 1;
  // Lösa brädor på golvet framför, med spikar, och en kofot
  if (d.brador !== false) {
    const bitar = [[0.86, 0.2, 0.08], [0.72, 0.3, -0.12], [0.9, 0.22, 0.2], [0.55, 0.4, -0.35], [0.8, 0.27, 0.05], [0.42, 0.18, 0.5]];
    const xm = (x0 + x1) / 2, spik = mat('#5a5048', { glans: 0.4, metall: 0.6 });
    bitar.forEach(([f, z, a], i) => {
      const L = hb * f, b = new THREE.Group();
      b.position.set(xm + (r() - 0.5) * 0.25, t / 2 + (i > 1 ? t * 0.9 * (i % 3) : 0), D + t + z); b.rotation.set(0, a, (r() - 0.5) * 0.04); g.add(b);
      brada(b, L, bh - 0.002, t, panel, 0, 0, 0, r() * 4).rotation.x = -Math.PI / 2;
      for (const s of [-1, 1]) {
        box(b, 0.04 + r() * 0.05, t * 0.6, 0.015 + r() * 0.02, ra, s * (L / 2 + 0.03), 0, (r() - 0.5) * 0.04);
        const sp = cyl(b, 0.0018, 0.0018, 0.045, spik, s * (L / 2 - 0.06), t / 2 + 0.02, 0.01, 4); sp.rotation.z = (r() - 0.5) * 0.6;
      }
    });
    if (d.kofot !== false) {
      // Kofoten ligger på sidan på högen, med kroken i golvets plan
      const k = new THREE.Group(); k.position.set(xm + 0.15, t * 2.6, D + t + 0.3); k.rotation.set(Math.PI / 2, -0.5, 0, 'YXZ'); g.add(k);
      const jarn = mat('#24324e', { glans: 0.45, metall: 0.5 }), slipad = mat('#7a7a76', { glans: 0.3, metall: 0.8 });
      liggande(k, 0.011, 0.6, jarn, 0, 0, 0, 'x', 6);
      const bage = new THREE.Mesh(new THREE.TorusGeometry(0.055, 0.011, 6, 10, Math.PI * 0.9), jarn);
      bage.position.set(0.3, 0.055, 0); bage.rotation.z = -Math.PI / 2; k.add(bage);
      box(k, 0.04, 0.014, 0.03, slipad, 0.28, 0.11, 0, 0, 0, 0.3); // klon
      box(k, 0.05, 0.008, 0.026, slipad, -0.32, 0.004, 0, 0, 0, 0.15); // mejseln
    }
  }
  return { grupp: g, haloPos: new THREE.Vector3((x0 + x1) / 2, Math.min(1.5, hy + hh / 2), D + 0.1) };
}

// ---- Arkivet ----

/**
 * Brun arkivkartong med lock, grepphål och en maskinskriven etikett på framsidan (+z), 0,4 × 0,27 × 0,32 m.
 * text ('ÄRENDE 1968:47\nFJÄLLGÅRDEN'; \n ger flera rader, en lista ger en text per kartong nerifrån),
 * antal (1) staplade, farg ('#9a7650'). Kollisionen är stapelns låda.
 */
function arkivlada(d) {
  const g = new THREE.Group();
  const N = Math.max(1, d.antal || 1), r = slump(d.seed || 31);
  const farg = d.farg || '#9a7650';
  const kart = mat('#ffffff', { map: T.kartong(farg) }), lock = mat('#e4e0da', { map: T.kartong(farg) }), hal = mat('#1a120a');
  const W = 0.4, H = 0.27, D = 0.32;
  for (let i = 0; i < N; i++) {
    const k = new THREE.Group(); k.position.set(i ? (r() - 0.5) * 0.03 : 0, i * H, i ? (r() - 0.5) * 0.02 : 0); k.rotation.y = i ? (r() - 0.5) * 0.12 : 0; g.add(k);
    box(k, W, H - 0.005, D, kart, 0, (H - 0.005) / 2, 0);
    box(k, W + 0.012, 0.055, D + 0.012, lock, 0, H - 0.0275, 0);
    for (const s of [-1, 1]) plan(k, 0.1, 0.028, hal, s * (W / 2 + 0.0005), H - 0.1, 0, 0, s * Math.PI / 2); // grepphålen
    const text = Array.isArray(d.text) ? d.text[i] ?? '' : d.text ?? 'ÄRENDE 1968:47\nFJÄLLGÅRDEN';
    if (text) {
      box(k, 0.2, 0.12, 0.002, mat('#d8ccb0'), 0, H * 0.45, D / 2 + 0.001);
      plan(k, 0.19, 0.11, mat('#ffffff', { map: T.skylt(text, { bredd: 256, hojd: 148, grund: '#ece4cc', farg: '#1e1e2a', typsnitt: '"Courier New", Courier, monospace', storlek: 25, kant: false }) }), 0, H * 0.45, D / 2 + 0.0025);
    }
  }
  return { grupp: g, haloPos: new THREE.Vector3(0, N * H + 0.15, 0) };
}

// ---- Byggarbetsplatsen ----

/**
 * Byggarbetslampa: LED-strålkastare i gul ram på ett trebent stativ, med orange förlängningskabel.
 * hojd (1,7) till lampans mitt, dubbel (false): två lampor på en tvärslå, lutning (grader nedåt, 15).
 * lyser (true): kallvitt riktat ljus med styrka (12), rackvidd (12), vinkel (grader, 50), farg ('#eef3ff')
 * och, om kon: true, en svag ljuskägla. Fotavtryck 0,6 m.
 */
function arbetslampa(d) {
  const g = new THREE.Group();
  const gul = mat('#e8b418', { glans: 0.45 }), svart = mat('#1c1c1e', { glans: 0.55, metall: 0.4 }), stal = mat('#8a8c8a', { glans: 0.3, metall: 0.8 });
  const kabel = mat('#f08c1e', { glans: 0.5 }), cy = d.hojd ?? 1.7, dubbel = !!d.dubbel;
  // Stativet: tre ben, mittrör i två delar med låsrattar
  const top = new THREE.Vector3(0, 0.62, 0);
  for (let i = 0; i < 3; i++) {
    const a = (i * Math.PI * 2) / 3 + Math.PI / 3, fot = new THREE.Vector3(Math.sin(a) * 0.4, 0.015, Math.cos(a) * 0.4);
    stav(g, top, fot, 0.012, svart);
    sph(g, 0.02, mat('#2a2a2a'), fot.x, 0.012, fot.z, 6);
    stav(g, new THREE.Vector3(0, 0.4, 0), top.clone().lerp(fot, 0.45), 0.006, svart, 4); // stag
  }
  cyl(g, 0.026, 0.026, 0.1, gul, 0, 0.62, 0, 8);
  cyl(g, 0.018, 0.018, 0.75, svart, 0, 0.62 + 0.375, 0, 8);
  cyl(g, 0.024, 0.024, 0.06, gul, 0, 1.0, 0, 8);
  liggande(g, 0.008, 0.06, gul, 0.04, 1.0, 0, 'x', 6); sph(g, 0.016, gul, 0.075, 1.0, 0, 8);
  const ytop = cy - (dubbel ? 0.2 : 0.15);
  cyl(g, 0.013, 0.013, ytop - 1.0, stal, 0, (1.0 + ytop) / 2, 0, 8);
  // Tvärslå för två lampor, annars en kort tapp
  const xs = dubbel ? [-0.19, 0.19] : [0];
  if (dubbel) { box(g, 0.56, 0.03, 0.03, gul, 0, ytop, 0); for (const x of xs) cyl(g, 0.01, 0.01, 0.05, stal, x, ytop + 0.03, 0, 6); }
  const lut = rad(d.lutning ?? 15), lyser = d.lyser !== false, farg = d.farg || '#eef3ff';
  for (const x of xs) {
    const yh = cy;
    // Gul bygel (U) runt lamphuset med låsrattar
    box(g, 0.3, 0.02, 0.03, gul, x, yh - 0.14, 0);
    for (const s of [-1, 1]) { box(g, 0.02, 0.15, 0.03, gul, x + s * 0.15, yh - 0.07, 0); liggande(g, 0.02, 0.025, svart, x + s * 0.168, yh, 0, 'x', 8); }
    const k = new THREE.Group(); k.position.set(x, yh, 0); k.rotation.x = lut; g.add(k);
    box(k, 0.26, 0.2, 0.05, svart, 0, 0, -0.005);
    for (let i = 0; i < 7; i++) box(k, 0.005, 0.18, 0.04, svart, -0.12 + i * 0.04, 0, -0.045); // kylflänsar
    box(k, 0.28, 0.022, 0.06, gul, 0, 0.109, 0); box(k, 0.28, 0.022, 0.06, gul, 0, -0.109, 0); // gul ram
    for (const s of [-1, 1]) box(k, 0.022, 0.24, 0.06, gul, s * 0.139, 0, 0);
    plan(k, 0.23, 0.17, lyser ? mat('#f6f9ff', { emissive: farg }) : mat('#b8bcc0', { glans: 0.1, metall: 0.4 }), 0, 0, 0.0215);
    for (let i = 1; i < 4; i++) box(k, 0.23, 0.003, 0.004, mat('#d0d4d8', { glans: 0.2 }), 0, -0.085 + i * 0.0425, 0.024); // galler
    // Bärhandtag
    for (const s of [-1, 1]) box(k, 0.016, 0.05, 0.016, gul, s * 0.08, 0.14, -0.01);
    box(k, 0.18, 0.016, 0.02, gul, 0, 0.165, -0.01);
  }
  // Orange kabel från lampan ner längs stativet och ut på golvet
  slang(g, [[xs[0], cy - 0.06, -0.07], [xs[0] * 0.5 + 0.02, cy - 0.3, -0.05], [0.03, 1.1, -0.03], [0.03, 0.7, -0.04], [0.08, 0.3, -0.12], [0.18, 0.012, -0.32], [0.5, 0.012, -0.6], [0.6, 0.012, -1.2], [0.9, 0.012, -1.7]], 0.009, kabel);
  if (lyser) {
    const vinkel = rad(d.vinkel ?? 50), avst = d.rackvidd ?? 12;
    const sp = new THREE.SpotLight(farg, d.styrka ?? 12, avst, vinkel, 0.6, 1.6);
    const ljus = new THREE.Group(); ljus.position.set(0, cy, 0.03); ljus.rotation.x = lut; g.add(ljus);
    sp.target.position.set(0, 0, 5); ljus.add(sp, sp.target);
    if (d.kon) {
      const Lk = Math.min(avst * 0.25, 2.5), rk = Lk * Math.tan(vinkel) * 0.8;
      const kon = new THREE.Mesh(new THREE.ConeGeometry(rk, Lk, 24, 1, true), new THREE.MeshBasicMaterial({ map: T.ljuskon(), color: farg, transparent: true, opacity: 0.05, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }));
      kon.rotation.x = -Math.PI / 2; kon.position.z = 0.03 + Lk / 2; kon.renderOrder = 3;
      kon.raycast = () => {};
      ljus.add(kon);
    }
  }
  return { grupp: g, fotavtryck: 0.6 };
}

/**
 * Hängande byggplast som täcker en dörröppning eller vägg: halvgenomskinlig, lite skrynklig, uppsatt med grå tejp
 * upptill och längs sidorna. Origo mitt under plasten i väggplanet (eller dörröppningens plan): plasten är tejpad
 * plant i z ≈ 0 upptill och längs kanterna, buktar ut upp till ca 0,15 m mot +z och veckar sig nedtill på golvet.
 * bredd (2), hojd (2,4), tejp (true), blixtlas (false): en dragkedja mitt i (en dammdörr). Ingen kollision.
 */
function byggplast(d) {
  const g = new THREE.Group();
  const B = d.bredd || 2, H = d.hojd || 2.4, golv = 0.14, r = slump(d.seed || 37);
  const f = [r() * 6, r() * 6, r() * 6, r() * 6];
  // Vecken växer nedåt från tejpen upptill och från kanterna, och går aldrig in i väggen (z > 0)
  const zAt = (x, y) => {
    const a = Math.min(1, Math.max(0, (H - y) / 0.5)) * Math.min(1, Math.max(0, (B / 2 - Math.abs(x)) / 0.18)) * (0.45 + 0.55 * Math.min(1, Math.max(0, (H - y) / H)));
    return 0.004 + a * (0.07 + 0.035 * Math.sin(x * 6.5 + f[0]) + 0.02 * Math.sin(x * 13 + f[1] + y * 0.8) + 0.008 * Math.sin(x * 31 + y * 9 + f[2]) + 0.006 * Math.sin(y * 17 + x * 5 + f[3]));
  };
  const geo = new THREE.PlaneGeometry(B, H + golv, Math.round(B * 16), Math.round((H + golv) * 10));
  const p = geo.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i) + (H + golv) / 2 - golv;
    if (y >= 0.02) p.setXYZ(i, x, y, zAt(x, y));
    else { const ut = 0.02 - y; p.setXYZ(i, x + Math.sin(x * 9 + f[3]) * 0.01, 0.006 + 0.02 * Math.max(0, 1 - ut / 0.05) + Math.abs(Math.sin(x * 11 + f[1])) * 0.01, zAt(x, 0.02) + ut * 0.9); }
  }
  geo.computeVertexNormals();
  const me = new THREE.Mesh(geo, mat('#ffffff', { map: T.byggplast(), transparent: true, opacity: 0.92, side: THREE.DoubleSide, glans: 0.15 }));
  me.renderOrder = 2; g.add(me);
  const tejp = mat('#8a8c8e', { glans: 0.5 });
  if (d.tejp !== false) {
    box(g, B + 0.02, 0.05, 0.004, tejp, 0, H - 0.03, 0.004);
    for (const s of [-1, 1]) {
      for (let y = 0.3; y < H - 0.2; y += 0.7) box(g, 0.05, 0.22, 0.004, tejp, s * (B / 2 - 0.015), y, zAt(s * (B / 2 - 0.015), y) + 0.004, 0, 0, (r() - 0.5) * 0.1);
    }
  }
  if (d.blixtlas) {
    const pk = []; for (let y = 0.15; y <= H - 0.25; y += 0.15) pk.push([0, y, zAt(0, y) + 0.004]);
    slang(g, pk, 0.006, mat('#2a2c30', { glans: 0.4 }));
    box(g, 0.025, 0.05, 0.008, mat('#c8ccd0', { glans: 0.3, metall: 0.6 }), 0, H - 0.3, zAt(0, H - 0.3) + 0.01);
  }
  return { grupp: g, kollision: false, haloPos: new THREE.Vector3(0, 1.5, 0.1) };
}

// ---- Skidrummet ----

/**
 * Skidställ av trä mot väggen: en överliggare med fack på 1,45 m höjd och ett tråg vid golvet där skidornas
 * bakändar står. Väggföremål med origo i väggplanet, ca 0,34 m djupt. antal (6) fack, 0,22 m breda.
 * fylld (true): gamla skidpar i facken (lackfärgen växlar); tom: index (0-baserade) för tomma fack
 * (utan tom står vartannat eller vart tredje fack tomt efter seed). nummer: första facknumret – då får varje fack
 * en emaljskylt med sitt nummer. farg (trä, '#8a5a30'). Kollisionen är ställets låda.
 */
function skidstall(d) {
  const g = new THREE.Group();
  const N = Math.max(1, d.antal || 6), S = 0.22, L = N * S + 0.08, r = slump(d.seed || 41);
  const tra = mat(d.farg || '#8a5a30', { glans: 0.5 }), mork = mat(nyans(d.farg || '#8a5a30', 0.62), { glans: 0.5 });
  const Y = 1.45;
  // Stolpar mot väggen, överliggare med fack och konsoler
  for (const s of [-1, 1]) box(g, 0.05, Y + 0.12, 0.05, tra, s * (L / 2 - 0.025), (Y + 0.12) / 2, 0.025);
  box(g, L, 0.14, 0.022, mork, 0, Y, 0.011);
  box(g, L, 0.05, 0.03, tra, 0, Y + 0.01, 0.205);
  for (let i = 0; i <= N; i++) box(g, 0.04, 0.05, 0.18, tra, -L / 2 + 0.04 + i * S, Y + 0.01, 0.11);
  for (const s of [-1, 1]) box(g, 0.035, 0.3, 0.035, tra, s * (L / 2 - 0.07), Y - 0.12, 0.1, 0.72, 0, 0);
  // Tråget vid golvet med låga avdelare
  box(g, L, 0.025, 0.3, mork, 0, 0.0125, 0.16);
  box(g, L, 0.09, 0.025, tra, 0, 0.045, 0.3);
  box(g, L, 0.12, 0.022, mork, 0, 0.06, 0.011);
  for (let i = 0; i <= N; i++) box(g, 0.03, 0.06, 0.27, tra, -L / 2 + 0.04 + i * S, 0.055, 0.16);
  if (d.nummer != null) {
    const emalj = mat('#1f2c4c');
    for (let i = 0; i < N; i++) {
      const x = -L / 2 + 0.04 + (i + 0.5) * S, nr = String(d.nummer + i);
      box(g, 0.07, 0.04, 0.004, emalj, x, Y + 0.01, 0.222);
      plan(g, 0.064, 0.034, mat('#ffffff', { map: T.skylt(nr, { bredd: 64, hojd: 32, grund: '#ece6d4', farg: '#1f2c4c', storlek: 24, kant: false }) }), x, Y + 0.01, 0.2245);
    }
  }
  if (d.fylld !== false) {
    const FARGER = ['#7a3e1c', '#a8763e', '#8a2a1e', '#2a3e6a', '#1e1a18', '#5a3a22'];
    const tom = new Set(d.tom || []);
    if (!d.tom) for (let i = 0; i < N; i++) if (r() < 0.3) tom.add(i);
    for (let i = 0; i < N; i++) {
      if (tom.has(i)) continue;
      const Lsk = 1.95 + r() * 0.15, s1 = Y / Math.cos(0.06), lut = Math.asin(0.085 / s1);
      const par = skidpar(FARGER[(r() * FARGER.length) | 0], Lsk);
      par.rotation.set(Math.PI / 2 - lut, Math.PI, 0);
      par.position.set(-L / 2 + 0.04 + (i + 0.5) * S + (r() - 0.5) * 0.02, 0.026, 0.19);
      g.add(par);
    }
  }
  return { grupp: g, haloPos: new THREE.Vector3(0, 1.7, 0.25) };
}

Object.assign(prefabs, { skidor, pjaxor, panelhal, arkivlada, arbetslampa, byggplast, skidstall });
