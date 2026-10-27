// Canvas-genererade texturer i sepia/akvarellstil. Inga bildfiler behövs.
import * as THREE from 'three';

const cache = new Map();
function rng(seed) { let s = seed >>> 0 || 1; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }

function skapa(nyckel, w, h, rita, { upprepa = [1, 1] } = {}) {
  const k = nyckel + '|' + upprepa.join('x');
  if (cache.has(k)) return cache.get(k);
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const g = c.getContext('2d');
  rita(g, w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(upprepa[0], upprepa[1]);
  t.anisotropy = 4;
  cache.set(k, t);
  return t;
}

/** Lätt "gravyr": brus och fina skraffer. */
function gravyr(g, w, h, styrka = 0.06, seed = 7) {
  const r = rng(seed);
  g.save();
  for (let i = 0; i < (w * h) / 60; i++) {
    g.fillStyle = r() < 0.5 ? `rgba(40,25,10,${styrka * r()})` : `rgba(255,240,210,${styrka * r()})`;
    g.fillRect(r() * w, r() * h, 1 + r() * 2, 1 + r() * 2);
  }
  g.strokeStyle = `rgba(50,30,10,${styrka * 0.6})`;
  g.lineWidth = 0.6;
  for (let i = 0; i < h / 3; i++) {
    const y = r() * h; g.beginPath(); g.moveTo(0, y); g.lineTo(w, y + (r() - 0.5) * 8); g.stroke();
  }
  g.restore();
}

export function tapet(grund = '#c9b48e', monster = '#9c7f58') {
  return skapa('tapet' + grund + monster, 256, 256, (g, w, h) => {
    g.fillStyle = grund; g.fillRect(0, 0, w, h);
    g.fillStyle = 'rgba(80,50,20,0.08)';
    for (let x = 0; x < w; x += 64) g.fillRect(x, 0, 22, h);
    g.fillStyle = monster; g.globalAlpha = 0.55;
    for (let y = 0; y < h; y += 64) for (let x = 0; x < w; x += 64) {
      const ox = x + 32 + ((y / 64) % 2 ? 32 : 0) - 32;
      g.beginPath();
      g.moveTo(ox + 32, y + 12); g.quadraticCurveTo(ox + 48, y + 32, ox + 32, y + 52);
      g.quadraticCurveTo(ox + 16, y + 32, ox + 32, y + 12); g.fill();
      g.beginPath(); g.arc(ox + 32, y + 32, 4, 0, Math.PI * 2); g.fill();
    }
    g.globalAlpha = 1; gravyr(g, w, h, 0.08, 3);
  });
}

export function panel(farg = '#5a3b22') {
  return skapa('panel' + farg, 256, 128, (g, w, h) => {
    g.fillStyle = farg; g.fillRect(0, 0, w, h);
    g.strokeStyle = 'rgba(255,220,170,0.18)'; g.lineWidth = 3;
    for (let x = 8; x < w; x += 64) g.strokeRect(x, 14, 48, h - 28);
    g.strokeStyle = 'rgba(0,0,0,0.35)'; g.lineWidth = 2;
    for (let x = 10; x < w; x += 64) g.strokeRect(x + 2, 16, 48, h - 28);
    gravyr(g, w, h, 0.1, 5);
  });
}

export function traGolv(farg = '#6b4a2c', upprepa = [3, 3]) {
  return skapa('golv' + farg, 256, 256, (g, w, h) => {
    const r = rng(11);
    const base = new THREE.Color(farg);
    for (let y = 0; y < h; y += 32) {
      let x = -r() * 120;
      while (x < w) {
        const len = 90 + r() * 120;
        const c = base.clone().offsetHSL(0, 0, (r() - 0.5) * 0.08);
        g.fillStyle = '#' + c.getHexString(); g.fillRect(x, y, len, 32);
        g.strokeStyle = 'rgba(20,10,0,0.25)'; g.lineWidth = 0.7;
        for (let i = 0; i < 5; i++) { g.beginPath(); const yy = y + 4 + r() * 24; g.moveTo(x, yy); g.bezierCurveTo(x + len / 3, yy + 3, x + len / 2, yy - 3, x + len, yy); g.stroke(); }
        g.fillStyle = 'rgba(15,8,0,0.6)'; g.fillRect(x, y, 2, 32);
        x += len;
      }
      g.fillStyle = 'rgba(15,8,0,0.55)'; g.fillRect(0, y, w, 2);
    }
    gravyr(g, w, h, 0.07, 13);
  }, { upprepa });
}

export function sten(upprepa = [2, 4]) {
  return skapa('sten', 256, 256, (g, w, h) => {
    const r = rng(21);
    for (let y = 0; y < h; y += 64) for (let x = 0; x < w; x += 64) {
      const l = 38 + r() * 12; g.fillStyle = `hsl(30, 22%, ${l}%)`; g.fillRect(x + 2, y + 2, 60, 60);
    }
    gravyr(g, w, h, 0.12, 23);
  }, { upprepa });
}

export function matta() {
  return skapa('matta', 512, 384, (g, w, h) => {
    g.fillStyle = '#5a1e14'; g.fillRect(0, 0, w, h);
    const ram = (i, f) => { g.strokeStyle = f; g.lineWidth = 10; g.strokeRect(i, i, w - 2 * i, h - 2 * i); };
    ram(10, '#2b2a3a'); ram(26, '#b88a4a'); ram(42, '#3b2030'); ram(56, '#a0703a');
    g.fillStyle = '#7a2e1f'; g.fillRect(64, 64, w - 128, h - 128);
    const r = rng(31);
    g.fillStyle = 'rgba(200,150,80,0.35)';
    for (let i = 0; i < 260; i++) { g.beginPath(); g.arc(70 + r() * (w - 140), 70 + r() * (h - 140), 2 + r() * 3, 0, 7); g.fill(); }
    g.save(); g.translate(w / 2, h / 2);
    for (const [s, f] of [[110, '#2b2a3a'], [90, '#b88a4a'], [66, '#5a1e14'], [36, '#c9a56a']]) {
      g.fillStyle = f; g.beginPath(); g.moveTo(0, -s * 0.8); g.lineTo(s * 1.3, 0); g.lineTo(0, s * 0.8); g.lineTo(-s * 1.3, 0); g.closePath(); g.fill();
    }
    g.restore();
    for (let x = 0; x < w; x += 6) { g.fillStyle = 'rgba(230,210,170,0.6)'; g.fillRect(x, 0, 2, 4); g.fillRect(x, h - 4, 2, 4); }
    gravyr(g, w, h, 0.12, 33);
  });
}

export function duk() {
  return skapa('duk', 128, 128, (g, w, h) => {
    g.fillStyle = '#efe5cf'; g.fillRect(0, 0, w, h);
    g.strokeStyle = 'rgba(150,120,80,0.15)';
    for (let i = 0; i < w; i += 16) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i, h); g.stroke(); g.beginPath(); g.moveTo(0, i); g.lineTo(w, i); g.stroke(); }
    gravyr(g, w, h, 0.05, 41);
  }, { upprepa: [2, 2] });
}

export function natt() {
  return skapa('natt', 128, 256, (g, w, h) => {
    const gr = g.createLinearGradient(0, 0, 0, h);
    gr.addColorStop(0, '#1b2230'); gr.addColorStop(0.7, '#2e3540'); gr.addColorStop(1, '#3a3428');
    g.fillStyle = gr; g.fillRect(0, 0, w, h);
    const r = rng(51);
    g.fillStyle = 'rgba(20,24,18,0.9)';
    for (let i = 0; i < 6; i++) { g.beginPath(); g.arc(r() * w, h * 0.65 + r() * 40, 20 + r() * 30, 0, 7); g.fill(); }
    g.strokeStyle = 'rgba(200,210,220,0.25)'; g.lineWidth = 1;
    for (let i = 0; i < 70; i++) { const x = r() * w, y = r() * h; g.beginPath(); g.moveTo(x, y); g.lineTo(x - 3, y + 14); g.stroke(); }
  });
}

export function utsikt() {
  return skapa('utsikt', 1024, 256, (g, w, h) => {
    const gr = g.createLinearGradient(0, 0, 0, h);
    gr.addColorStop(0, '#e8c99a'); gr.addColorStop(0.45, '#f1d6a8'); gr.addColorStop(0.55, '#9aa59a'); gr.addColorStop(1, '#5d6d68');
    g.fillStyle = gr; g.fillRect(0, 0, w, h);
    g.fillStyle = 'rgba(255,230,180,0.6)'; g.beginPath(); g.arc(w * 0.7, h * 0.47, 18, 0, 7); g.fill();
    const r = rng(61);
    g.fillStyle = '#4a5240';
    for (let i = 0; i < 7; i++) {
      const x = r() * w, bw = 80 + r() * 200, bh = 10 + r() * 22, y = h * 0.53;
      g.beginPath(); g.moveTo(x - bw / 2, y); g.quadraticCurveTo(x, y - bh * 2, x + bw / 2, y); g.fill();
    }
    g.strokeStyle = 'rgba(255,235,200,0.35)';
    for (let i = 0; i < 60; i++) { const y = h * 0.56 + r() * h * 0.4; const x = r() * w; g.beginPath(); g.moveTo(x, y); g.lineTo(x + 10 + r() * 30, y); g.stroke(); }
    g.fillStyle = '#3c4a32';
    for (let x = 0; x < w; x += 6) { const hh = 30 + Math.sin(x * 0.02) * 12 + r() * 14; g.fillRect(x, h - hh, 7, hh); }
    gravyr(g, w, h, 0.06, 63);
  });
}

export function malning(seed = 71) {
  return skapa('malning' + seed, 256, 180, (g, w, h) => {
    const gr = g.createLinearGradient(0, 0, 0, h);
    gr.addColorStop(0, '#d9c49a'); gr.addColorStop(1, '#8a7a4a');
    g.fillStyle = gr; g.fillRect(0, 0, w, h);
    const r = rng(seed);
    g.fillStyle = '#5c6a3a';
    for (let i = 0; i < 9; i++) { g.beginPath(); g.arc(r() * w, h * 0.55 + r() * 20, 18 + r() * 30, 0, 7); g.fill(); }
    g.fillStyle = '#e8dcc0'; g.fillRect(w * 0.42, h * 0.42, 50, 34);
    g.fillStyle = '#7a2e1f'; g.beginPath(); g.moveTo(w * 0.42 - 6, h * 0.42); g.lineTo(w * 0.42 + 25, h * 0.3); g.lineTo(w * 0.42 + 56, h * 0.42); g.fill();
    gravyr(g, w, h, 0.15, seed + 1);
  });
}

export function papper(rader = true) {
  return skapa('papper' + rader, 128, 160, (g, w, h) => {
    g.fillStyle = '#efe2c4'; g.fillRect(0, 0, w, h);
    if (rader) { g.strokeStyle = 'rgba(60,40,20,0.55)'; g.lineWidth = 1.2; const r = rng(81);
      for (let y = 18; y < h - 10; y += 10) { g.beginPath(); g.moveTo(12, y); g.lineTo(12 + r() * (w - 30) + 10, y); g.stroke(); } }
    gravyr(g, w, h, 0.08, 83);
  });
}

export function urtavla() {
  return skapa('urtavla', 128, 128, (g, w) => {
    g.fillStyle = '#efe2c4'; g.beginPath(); g.arc(64, 64, 60, 0, 7); g.fill();
    g.strokeStyle = '#3a2a18'; g.lineWidth = 3;
    for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; g.beginPath(); g.moveTo(64 + Math.sin(a) * 48, 64 - Math.cos(a) * 48); g.lineTo(64 + Math.sin(a) * 56, 64 - Math.cos(a) * 56); g.stroke(); }
    g.lineWidth = 4; g.beginPath(); g.moveTo(64, 64); g.lineTo(64 + 30 * Math.sin(5.65), 64 - 30 * Math.cos(5.65)); g.stroke();
    g.lineWidth = 2.5; g.beginPath(); g.moveTo(64, 64); g.lineTo(64 + 46 * Math.sin(1.47), 64 - 46 * Math.cos(1.47)); g.stroke();
  });
}

export function lader(farg = '#5b2f1b') {
  return skapa('lader' + farg, 128, 128, (g, w, h) => {
    g.fillStyle = farg; g.fillRect(0, 0, w, h);
    g.strokeStyle = 'rgba(230,190,120,0.55)'; g.lineWidth = 2; g.strokeRect(8, 8, w - 16, h - 16);
    g.strokeRect(14, 14, w - 28, h - 28);
    gravyr(g, w, h, 0.2, 91);
  });
}

export function siffra(text) {
  return skapa('siffra' + text, 64, 64, (g) => {
    const gr = g.createRadialGradient(28, 24, 4, 32, 32, 32);
    gr.addColorStop(0, '#f3d995'); gr.addColorStop(1, '#8a6224');
    g.fillStyle = gr; g.beginPath(); g.arc(32, 32, 30, 0, 7); g.fill();
    g.strokeStyle = '#4a3010'; g.lineWidth = 2; g.stroke();
    g.fillStyle = '#2b1a08'; g.font = 'bold 36px Georgia, serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText(text, 32, 35);
  });
}

export function glod() {
  return skapa('glod', 64, 64, (g) => {
    const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, 'rgba(255,236,170,1)'); gr.addColorStop(0.25, 'rgba(255,200,90,0.75)');
    gr.addColorStop(0.6, 'rgba(255,160,50,0.18)'); gr.addColorStop(1, 'rgba(255,140,40,0)');
    g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
  });
}

export function tak() {
  return skapa('tak', 128, 128, (g, w, h) => { g.fillStyle = '#d8c7a3'; g.fillRect(0, 0, w, h); gravyr(g, w, h, 0.06, 99); }, { upprepa: [2, 2] });
}

/** Skylt eller lapp med text (handskrift eller tryck). */
export function skylt(text, { bredd = 256, hojd = 96, grund = '#e9dcbc', farg = '#2b1a0a', typsnitt = 'Georgia, serif', storlek = 40, kant = true, rader = null } = {}) {
  return skapa('skylt' + text + bredd + hojd + grund + farg + storlek + kant, bredd, hojd, (g, w, h) => {
    g.fillStyle = grund; g.fillRect(0, 0, w, h);
    if (kant) { g.strokeStyle = farg; g.globalAlpha = 0.7; g.lineWidth = 4; g.strokeRect(6, 6, w - 12, h - 12); g.globalAlpha = 1; }
    g.fillStyle = farg; g.textAlign = 'center'; g.textBaseline = 'middle';
    const r = rader || String(text).split('\n');
    const lh = storlek * 1.15;
    g.font = `bold ${storlek}px ${typsnitt}`;
    r.forEach((t, i) => g.fillText(t, w / 2, h / 2 + (i - (r.length - 1) / 2) * lh));
    gravyr(g, w, h, 0.06, 7);
  });
}

/** Natt med snöstorm (tågfönster). */
export function snostorm() {
  return skapa('snostorm', 128, 128, (g, w, h) => {
    const gr = g.createLinearGradient(0, 0, 0, h);
    gr.addColorStop(0, '#141b28'); gr.addColorStop(1, '#2a3344');
    g.fillStyle = gr; g.fillRect(0, 0, w, h);
    const r = rng(77);
    g.fillStyle = 'rgba(230,236,245,0.85)';
    for (let i = 0; i < 160; i++) { const s = 0.6 + r() * 1.8; g.fillRect(r() * w, r() * h, s, s); }
    g.strokeStyle = 'rgba(220,230,240,0.35)';
    for (let i = 0; i < 40; i++) { const x = r() * w, y = r() * h; g.beginPath(); g.moveTo(x, y); g.lineTo(x - 10, y + 4); g.stroke(); }
  });
}
/** Frost i fönsterkanten. */
export function frost() {
  return skapa('frost', 128, 128, (g, w, h) => {
    g.clearRect(0, 0, w, h);
    const r = rng(79);
    for (let i = 0; i < 220; i++) {
      const kant = r() < 0.5 ? (r() < 0.5 ? r() * 18 : w - r() * 18) : r() * w;
      const y = kant < 20 || kant > w - 20 ? r() * h : (r() < 0.5 ? r() * 18 : h - r() * 18);
      g.strokeStyle = `rgba(235,242,250,${0.3 + r() * 0.5})`; g.lineWidth = 1;
      g.beginPath(); g.moveTo(kant, y); g.lineTo(kant + (r() - 0.5) * 14, y + (r() - 0.5) * 14); g.stroke();
    }
  });
}
/** Urtavla med valfri tid (timme, minut). */
export function urtavlaTid(tim, min, { sprucken = false } = {}) {
  return skapa(`urtid${tim}:${min}:${sprucken}`, 128, 128, (g) => {
    g.fillStyle = '#efe2c4'; g.beginPath(); g.arc(64, 64, 60, 0, 7); g.fill();
    g.strokeStyle = '#3a2a18'; g.lineWidth = 3;
    for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; g.beginPath(); g.moveTo(64 + Math.sin(a) * 48, 64 - Math.cos(a) * 48); g.lineTo(64 + Math.sin(a) * 56, 64 - Math.cos(a) * 56); g.stroke(); }
    g.fillStyle = '#3a2a18'; g.font = 'bold 13px Georgia, serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
    for (const [n, a] of [[12, 0], [3, 90], [6, 180], [9, 270]]) g.fillText(String(n), 64 + Math.sin(a * Math.PI / 180) * 40, 64 - Math.cos(a * Math.PI / 180) * 40);
    const ta = ((tim % 12) + min / 60) / 12 * Math.PI * 2, ma = min / 60 * Math.PI * 2;
    g.lineWidth = 5; g.beginPath(); g.moveTo(64, 64); g.lineTo(64 + 28 * Math.sin(ta), 64 - 28 * Math.cos(ta)); g.stroke();
    g.lineWidth = 3; g.beginPath(); g.moveTo(64, 64); g.lineTo(64 + 46 * Math.sin(ma), 64 - 46 * Math.cos(ma)); g.stroke();
    if (sprucken) { g.strokeStyle = 'rgba(30,20,10,.8)'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(20, 30); g.lineTo(60, 70); g.lineTo(52, 110); g.moveTo(60, 70); g.lineTo(108, 84); g.stroke(); }
  });
}
/** Ränder (tyg, tapet i modern miljö). */
export function rander(a = '#e8e4da', b = '#d7d0c0', n = 8) {
  return skapa('rander' + a + b + n, 64, 64, (g, w, h) => { for (let i = 0; i < n; i++) { g.fillStyle = i % 2 ? b : a; g.fillRect((i * w) / n, 0, w / n, h); } });
}
/** Gräs och mark. */
export function grasmark(farg = '#5f7a3a') {
  return skapa('gras' + farg, 256, 256, (g, w, h) => {
    g.fillStyle = farg; g.fillRect(0, 0, w, h);
    const r = rng(101);
    for (let i = 0; i < 1600; i++) { g.strokeStyle = `rgba(${30 + r() * 60},${70 + r() * 70},${20 + r() * 30},0.7)`; const x = r() * w, y = r() * h; g.beginPath(); g.moveTo(x, y); g.lineTo(x + (r() - 0.5) * 3, y - 3 - r() * 5); g.stroke(); }
    for (let i = 0; i < 40; i++) { g.fillStyle = ['#f5f0d8', '#e8d64a', '#c97fb5'][i % 3]; g.beginPath(); g.arc(r() * w, r() * h, 1.6, 0, 7); g.fill(); }
  }, { upprepa: [8, 8] });
}
/** Himmel (rundpanorama) i valfria färger, med valfri horisont. */
export function himmel(topp = '#9fb6c8', botten = '#e8dcc0', { hav = null, berg = null, seed = 5 } = {}) {
  return skapa('himmel' + topp + botten + hav + berg + seed, 1024, 256, (g, w, h) => {
    const gr = g.createLinearGradient(0, 0, 0, h);
    gr.addColorStop(0, topp); gr.addColorStop(0.62, botten); gr.addColorStop(1, hav || botten);
    g.fillStyle = gr; g.fillRect(0, 0, w, h);
    const r = rng(seed);
    if (berg) { g.fillStyle = berg; for (let i = 0; i < 9; i++) { const x = r() * w, bw = 120 + r() * 260, bh = 14 + r() * 30; g.beginPath(); g.moveTo(x - bw / 2, h * 0.64); g.quadraticCurveTo(x, h * 0.64 - bh * 2, x + bw / 2, h * 0.64); g.fill(); } }
    if (hav) { g.fillStyle = hav; g.fillRect(0, h * 0.64, w, h * 0.36); g.strokeStyle = 'rgba(255,255,255,0.25)'; for (let i = 0; i < 80; i++) { const y = h * 0.66 + r() * h * 0.32, x = r() * w; g.beginPath(); g.moveTo(x, y); g.lineTo(x + 8 + r() * 26, y); g.stroke(); } }
    gravyr(g, w, h, 0.05, seed + 3);
  });
}
/** Dagsljus genom ett fönster: himmel, björkar och gräs. */
export function dagsljus() {
  return skapa('dagsljus', 128, 160, (g, w, h) => {
    const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#bcd2dc'); gr.addColorStop(0.6, '#eef0e0'); gr.addColorStop(0.62, '#8aa05a'); gr.addColorStop(1, '#6a8440');
    g.fillStyle = gr; g.fillRect(0, 0, w, h);
    const r = rng(17);
    for (let i = 0; i < 7; i++) { g.fillStyle = `rgba(${70 + r() * 40},${110 + r() * 40},50,0.8)`; g.beginPath(); g.arc(r() * w, h * 0.5 + r() * 12, 12 + r() * 14, 0, 7); g.fill(); }
    gravyr(g, w, h, 0.05, 3);
  });
}
/** Stående locklistpanel (faluröd fasad). */
export function paneler(farg = '#8a2a1e') {
  return skapa('paneler' + farg, 256, 256, (g, w, h) => {
    g.fillStyle = farg; g.fillRect(0, 0, w, h);
    const r = rng(41);
    for (let x = 0; x < w; x += 32) { g.fillStyle = 'rgba(0,0,0,0.18)'; g.fillRect(x, 0, 3, h); g.fillStyle = 'rgba(255,220,200,0.08)'; g.fillRect(x + 3, 0, 4, h); }
    for (let i = 0; i < 300; i++) { g.fillStyle = `rgba(40,10,5,${r() * 0.15})`; g.fillRect(r() * w, r() * h, 1, 4 + r() * 14); }
    gravyr(g, w, h, 0.06, 9);
  }, { upprepa: [3, 1] });
}
export function bjorkstam() {
  return skapa('bjork', 64, 256, (g, w, h) => {
    g.fillStyle = '#ece8dc'; g.fillRect(0, 0, w, h);
    const r = rng(5);
    for (let i = 0; i < 40; i++) { g.fillStyle = 'rgba(30,25,20,0.85)'; g.fillRect(r() * w, r() * h, 6 + r() * 20, 2 + r() * 3); }
  });
}
/** Skärm: 'insta' = ett instagraminlägg, 'foto' = en mobilbild, annars text. */
export function skarm(typ = 'insta') {
  return skapa('skarm' + typ, 256, 192, (g, w, h) => {
    g.fillStyle = '#fafafa'; g.fillRect(0, 0, w, h);
    if (typ === 'insta' || typ === 'foto') {
      g.fillStyle = '#d9d4c8'; g.fillRect(typ === 'insta' ? 60 : 0, typ === 'insta' ? 24 : 0, typ === 'insta' ? 136 : w, typ === 'insta' ? 120 : h);
      const cx = w / 2, cy = typ === 'insta' ? 90 : h / 2;
      g.fillStyle = '#bdbab0'; g.beginPath(); g.ellipse(cx, cy, 40, 22, 0, 0, Math.PI); g.fill();
      g.fillStyle = '#e8e6de'; g.beginPath(); g.ellipse(cx, cy, 40, 8, 0, 0, 7); g.fill();
      if (typ === 'insta') {
        g.fillStyle = '#222'; g.font = '600 12px sans-serif'; g.fillText('gunnar_sahlin', 64, 16);
        g.font = '11px sans-serif'; g.fillText('Putsat brudskålen inför festen! 🌸', 50, 164); g.fillStyle = '#888'; g.fillText('i dag 09.12', 50, 180);
      }
    } else { g.fillStyle = '#222'; g.font = '14px sans-serif'; String(typ).split('\n').forEach((t, i) => g.fillText(t, 12, 24 + i * 18)); }
  });
}
