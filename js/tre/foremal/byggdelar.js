// Dörrar, fönster, trappor och andra delar av själva byggnaden.
// Konventioner: se foremal/grund.js.
import * as THREE from '../../../vendor/three/three.module.min.js';
import * as T from '../texturer.js';
import { mat, box, cyl, sph, plan, massing, glas, prefabs, MORKTRA, MAHOGNY, VIT, JARN } from './grund.js';

function dorr(d) {
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
}

function kallardorr(d, ctx) {
  return prefabs.dorr({ ...d, oppen: 0.7, morker: true, farg: '#3e2614' }, ctx);
}

function kupedorr(d) {
  const g = new THREE.Group();
  const tra = mat(d.farg || MAHOGNY), ram = mat('#2a120a');
  box(g, 0.95, 0.08, 0.1, ram, 0, 2.06, 0.03); box(g, 0.07, 2.06, 0.1, ram, -0.47, 1.03, 0.03); box(g, 0.07, 2.06, 0.1, ram, 0.47, 1.03, 0.03);
  const blad = new THREE.Group(); blad.position.set(d.oppen ? 0.55 : 0, 0, 0.04); g.add(blad);
  box(blad, 0.86, 2.0, 0.05, tra, 0, 1.0, 0);
  plan(blad, 0.5, 0.5, mat('#ffffff', { map: T.lader('#5a3020') }), 0, 1.45, 0.027);
  box(blad, 0.05, 0.2, 0.03, massing(), 0.36, 1.0, 0.04);
  if (d.morker || d.oppen) plan(g, 0.86, 2.0, mat('#0d0805'), d.oppen ? -0.2 : 0, 1.0, 0.012);
  if (d.nummer) { plan(g, 0.16, 0.12, mat('#ffffff', { map: T.skylt(String(d.nummer), { bredd: 128, hojd: 96, grund: '#d8b26a', storlek: 60 }) }), 0, 2.2, 0.05); }
  if (d.kedja) {
    const k = mat('#c9c2b0', { emissive: '#333' });
    const ogla = (x, y) => { const t = new THREE.Mesh(new THREE.TorusGeometry(0.018, 0.005, 4, 8), k); t.position.set(x, y, 0.08); blad.add(t); };
    box(blad, 0.08, 0.03, 0.02, massing(), 0.3, 1.25, 0.05);
    if (d.kedja === 'hakad') for (let i = 0; i < 6; i++) ogla(0.32 + i * 0.03, 1.25 - (i % 2) * 0.01);
    else { for (let i = 0; i < 4; i++) ogla(0.3, 1.22 - i * 0.032); }
    box(g, 0.05, 0.08, 0.03, massing(), 0.5, 1.25, 0.07);
  }
  return { grupp: g, kollision: false, haloPos: new THREE.Vector3(0.2, 1.3, 0.2) };
}

function mellandorr(d) {
  const g = new THREE.Group();
  const tra = mat(d.farg || '#55291a');
  box(g, 0.7, 0.06, 0.08, mat('#2a120a'), 0, 1.93, 0.02);
  box(g, 0.62, 1.9, 0.05, tra, 0, 0.95, 0.03);
  for (const y of [0.5, 1.35]) box(g, 0.44, 0.6, 0.02, mat('#3e1c10'), 0, y, 0.06);
  // Regeln på den här sidan
  box(g, 0.05, 0.12, 0.03, massing(), 0.24, 1.05, 0.07);
  box(g, 0.16, 0.025, 0.025, massing(), d.regel === 'stangd' ? 0.3 : 0.18, 1.05, 0.09);
  box(g, 0.04, 0.06, 0.03, massing(), 0.36, 1.05, 0.07);
  return { grupp: g, kollision: false, haloPos: new THREE.Vector3(0.25, 1.1, 0.2) };
}

function fonster(d) {
  const g = new THREE.Group();
  const y0 = 0.9, W = 1.3, H = 1.7;
  plan(g, W, H, mat('#ffffff', { map: T.natt() }), 0, y0 + H / 2, 0.01);
  const ram = mat('#d9ccb0');
  box(g, W + 0.16, 0.1, 0.12, ram, 0, y0 + H + 0.05, 0.05);
  box(g, 0.08, H, 0.12, ram, -W / 2 - 0.04, y0 + H / 2, 0.05);
  box(g, 0.08, H, 0.12, ram, W / 2 + 0.04, y0 + H / 2, 0.05);
  // Fönsterbleck med orört lövskräp och damm (lov: false – rent bleck, t.ex. en vinternatt)
  box(g, W + 0.3, 0.05, 0.32, mat('#bfb39a'), 0, y0 - 0.02, 0.12);
  if (d.lov !== false) {
    const lov = mat('#6a4a22');
    const r = [0.1, -0.35, 0.42, -0.1, 0.25, -0.5, 0.55];
    r.forEach((x, i) => box(g, 0.07, 0.008, 0.05, lov, x, y0 + 0.01, 0.06 + (i % 3) * 0.07, 0, i, 0));
  }
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
}

function tagfonster(d) {
  const g = new THREE.Group();
  const W = d.bredd || 0.9, H = d.hojd || 0.75, y0 = d.y0 ?? 1.0;
  plan(g, W, H, mat('#ffffff', { map: T.snostorm() }), 0, y0 + H / 2, 0.01);
  if (d.isig !== false) plan(g, W, H, mat('#ffffff', { map: T.frost(), transparent: true, opacity: 0.9 }), 0, y0 + H / 2, 0.02);
  const ram = mat(d.ram || '#3a1a0e');
  box(g, W + 0.12, 0.07, 0.08, ram, 0, y0 + H + 0.03, 0.03); box(g, W + 0.12, 0.07, 0.1, ram, 0, y0 - 0.03, 0.04);
  box(g, 0.06, H, 0.08, ram, -W / 2 - 0.03, y0 + H / 2, 0.03); box(g, 0.06, H, 0.08, ram, W / 2 + 0.03, y0 + H / 2, 0.03);
  box(g, W, 0.03, 0.04, ram, 0, y0 + H * 0.72, 0.03);
  if (d.isig !== false) box(g, W - 0.02, 0.025, 0.05, mat('#dfe8f0', { emissive: '#1c2430' }), 0, y0 + 0.012, 0.05);
  const gard = mat(d.gardin || '#2e3a5a');
  box(g, 0.2, H + 0.25, 0.04, gard, -W / 2 - 0.1, y0 + H / 2 + 0.05, 0.09); box(g, 0.2, H + 0.25, 0.04, gard, W / 2 + 0.1, y0 + H / 2 + 0.05, 0.09);
  if (d.gardinspringa) box(g, W * 0.42, H * 0.95, 0.03, gard, -W * 0.27, y0 + H / 2, 0.07);
  return { grupp: g, kollision: false, haloPos: new THREE.Vector3(0, y0 + H / 2, 0.15) };
}

/** Dagsljusfönster med spröjs, valfritt med gardiner. */
/**
 * Gemensam stomme för korsfönster: utsikt bakom glaset, karm, fönsterbleck och ett spröjskors.
 * `karm` är karmens bredd; överstycket är 2 cm högre och blecket sticker ut 2 cm per sida.
 */
function korsfonster(g, { W, H, y0, utsikt, sken, ram, karm, sprojs }) {
  plan(g, W, H, mat('#ffffff', { map: utsikt, emissive: sken }), 0, y0 + H / 2, 0.01);
  const ov = karm + 0.02;
  box(g, W + 2 * karm, ov, 0.1, ram, 0, y0 + H + ov / 2, 0.04); box(g, W + 2 * karm + 0.04, 0.05, 2 * karm + 0.1, ram, 0, y0 - 0.02, 0.08);
  for (const sx of [-1, 1]) box(g, karm, H, 0.1, ram, sx * (W / 2 + karm / 2), y0 + H / 2, 0.04);
  box(g, sprojs, H, 0.04, ram, 0, y0 + H / 2, 0.04); box(g, W, sprojs, 0.04, ram, 0, y0 + H / 2, 0.04);
}

function dagfonster(d) {
  const g = new THREE.Group();
  const W = d.bredd || 1.0, H = d.hojd || 1.3, y0 = d.y0 ?? 0.9;
  // natt: true – mörker utanför (t.ex. nyårsnatten i fall 8) i stället för dagsljus.
  korsfonster(g, { W, H, y0, utsikt: d.natt ? T.natt() : T.dagsljus(), sken: d.natt ? '#0a0e12' : '#3a3a30', ram: mat(d.ram || VIT), karm: 0.06, sprojs: 0.04 });
  if (d.gardin) {
    const tyg = mat(d.gardin === true ? '#e6dcc2' : d.gardin);
    if (d.dragen) box(g, W + 0.2, H + 0.2, 0.03, tyg, 0, y0 + H / 2, 0.14);
    else for (const sx of [-1, 1]) box(g, 0.26, H + 0.4, 0.04, tyg, sx * (W / 2 + 0.2), y0 + H / 2, 0.14);
    box(g, W + 0.7, 0.03, 0.03, mat('#cfc4a8'), 0, y0 + H + 0.22, 0.16);
  }
  return { grupp: g, kollision: false };
}

/** Fönster mot stormen. Väggföremål. */
function stormfonster(d) {
  const g = new THREE.Group();
  const W = d.bredd || 0.8, H = d.hojd || 1.0, y0 = d.y0 ?? 1.0;
  korsfonster(g, { W, H, y0, utsikt: T.stormnatt(), sken: '#0a0e12', ram: mat(d.ram || '#e8e2d2'), karm: 0.05, sprojs: 0.035 });
  return { grupp: g, kollision: false };
}

/** Lanternans glasvägg: järnbröstning med nitar, stora rutor mot stormnatten i järnspröjs. Väggföremål; langd längs väggen. */
function lanternglas(d) {
  const g = new THREE.Group();
  const L = d.langd || 3, y0 = d.y0 ?? 0.95, H = d.hojd || 1.8, n = Math.max(1, Math.round(L / 0.9));
  const j = mat('#1f2326'), rost = mat('#3a3430');
  box(g, L, y0, 0.06, rost, 0, y0 / 2, 0.03);
  for (let i = 0; i < n * 3; i++) sph(g, 0.012, mat('#5a5048'), -L / 2 + (i + 0.5) * L / (n * 3), y0 - 0.06, 0.065, 4);
  box(g, L, 0.06, 0.18, j, 0, y0, 0.09);
  const glasW = L / n;
  for (let i = 0; i < n; i++) {
    const x = -L / 2 + (i + 0.5) * glasW;
    plan(g, glasW - 0.04, H, mat('#ffffff', { map: T.stormnatt(), emissive: '#0c1218' }), x, y0 + H / 2, 0.012);
  }
  for (let i = 0; i <= n; i++) box(g, 0.05, H, 0.07, j, -L / 2 + i * glasW, y0 + H / 2, 0.04);
  for (const y of [y0 + H / 2, y0 + H]) box(g, L, 0.04, 0.06, j, 0, y, 0.04);
  return { grupp: g, kollision: false };
}

/** Fönster med uppbruten fönsterlucka och snöyra utanför. Väggföremål. */
function lucka(d) {
  const g = new THREE.Group();
  const W = d.bredd || 0.9, H = d.hojd || 1.2, y0 = d.y0 ?? 0.9;
  plan(g, W, H, mat('#ffffff', { map: T.snostorm() }), 0, y0 + H / 2, 0.01);
  const ram = mat('#3a2a1c');
  box(g, W + 0.12, 0.08, 0.1, ram, 0, y0 + H + 0.04, 0.04); box(g, W + 0.16, 0.06, 0.24, ram, 0, y0 - 0.02, 0.1);
  for (const sx of [-1, 1]) box(g, 0.06, H, 0.1, ram, sx * (W / 2 + 0.03), y0 + H / 2, 0.04);
  box(g, 0.04, H, 0.04, ram, 0, y0 + H / 2, 0.04);
  // Snö på fönsterbrädan
  box(g, W, 0.03, 0.2, mat('#eef2f6'), 0, y0 + 0.02, 0.12);
  // Luckan: den ena halvan hänger snett i ett gångjärn, den andra ligger på golvet
  const lm = mat('#4a3a2a');
  const hang = box(g, W / 2, H * 0.95, 0.04, lm, -W / 2 - W / 4 + 0.02, y0 + H / 2 - 0.1, 0.32); hang.rotation.set(0.05, 1.2, 0.12);
  const golvL = box(g, W / 2, 0.04, H * 0.9, lm, 0.25, 0.03, 0.75); golvL.rotation.y = 0.4;
  const jarn = mat('#6a6a6a');
  const bryt = box(g, 0.05, 0.02, 0.02, jarn, W / 2 - 0.05, y0 + H / 2, 0.12); bryt.rotation.z = 0.4;
  for (let i = 0; i < 6; i++) { const s = box(g, 0.08, 0.01, 0.015, mat('#c8a878'), 0.1 + (i % 3) * 0.12, 0.01, 0.5 + i * 0.07); s.rotation.y = i; }
  return { grupp: g, kollision: false, haloPos: new THREE.Vector3(W / 2, y0 + H / 2, 0.15) };
}

/** Spiraltrappa runt en mittpelare. */
function spiraltrappa(d) {
  const g = new THREE.Group();
  const R = d.radie || 1.0, H = d.hojd || 3.2, N = d.steg || 16, varv = d.varv ?? 0.9;
  const sten = mat('#9a9286'), jarn = mat(JARN);
  cyl(g, 0.12, 0.12, H, sten, 0, H / 2, 0, 10);
  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2 * varv, y = (i + 1) * (H / N);
    const s = box(g, R, 0.06, 0.32, sten, Math.cos(a) * R / 2, y, -Math.sin(a) * R / 2); s.rotation.y = a;
    cyl(g, 0.012, 0.012, 0.8, jarn, Math.cos(a) * R * 0.98, y + 0.4, -Math.sin(a) * R * 0.98, 4);
  }
  return { grupp: g };
}

function racke(d) {
  const g = new THREE.Group();
  const L = d.langd || 4;
  const m = mat('#e8e0cc');
  box(g, L, 0.06, 0.08, m, 0, 0.95, 0); box(g, L, 0.05, 0.06, m, 0, 0.12, 0);
  for (let x = -L / 2; x <= L / 2 + 0.01; x += 0.14) box(g, 0.035, 0.8, 0.035, m, x, 0.53, 0);
  for (let x = -L / 2; x <= L / 2 + 0.01; x += L / Math.max(1, Math.round(L / 1.6))) box(g, 0.1, 1.0, 0.1, m, x, 0.5, 0);
  return { grupp: g };
}

function skylt(d) {
  const g = new THREE.Group();
  const [w, h] = d.storlek || [0.5, 0.18];
  const px = Math.round(512 * Math.min(1, w / Math.max(w, h)));
  const tex = T.skylt(d.text || '', { bredd: 512, hojd: Math.max(64, Math.round((512 * h) / w)), grund: d.grund || '#e9dcbc', farg: d.farg || '#2b1a0a', storlek: d.textstorlek || 44, kant: d.kant !== false, typsnitt: d.typsnitt || 'Georgia, serif' });
  void px;
  plan(g, w, h, mat('#ffffff', { map: tex }), 0, 0, 0.012);
  if (d.ram !== false) box(g, w + 0.03, h + 0.03, 0.015, mat(d.ramfarg || '#3a2412'), 0, 0, 0.002);
  return { grupp: g, kollision: false };
}

Object.assign(prefabs, { dorr, kallardorr, kupedorr, mellandorr, fonster, tagfonster, dagfonster, stormfonster, lanternglas, lucka, spiraltrappa, racke, skylt });
