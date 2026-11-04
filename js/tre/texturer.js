// Canvas-genererade texturer i sepia/akvarellstil. Inga bildfiler behövs.
import * as THREE from '../../vendor/three/three.module.min.js';

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

/** Räfflad järnplåt (lanternans golv). */
export function jarnplat(upprepa = [2, 2]) {
  return skapa('jarnplat', 256, 256, (g, w, h) => {
    g.fillStyle = '#3c3e40'; g.fillRect(0, 0, w, h);
    const r = rng(71);
    for (let y = 0; y < h; y += 32) for (let x = 0; x < w; x += 32) {
      g.save(); g.translate(x + 16, y + 16); g.rotate(((x + y) / 32) % 2 ? 0.8 : -0.8);
      g.fillStyle = 'rgba(120,122,124,0.55)'; g.fillRect(-9, -2.5, 18, 5); g.restore();
    }
    for (let i = 0; i < 300; i++) { g.fillStyle = `rgba(${r() < 0.6 ? '90,60,40' : '20,20,20'},${r() * 0.18})`; g.beginPath(); g.arc(r() * w, r() * h, 1 + r() * 6, 0, 7); g.fill(); }
    g.strokeStyle = 'rgba(15,15,15,0.7)'; g.lineWidth = 2; g.strokeRect(1, 1, w - 2, h - 2);
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

/**
 * Markör ovanför det som går att undersöka: en mässingsbricka med utropstecken ('ledtrad'),
 * en uppslagen bok ('bok') eller en pil ('dorr'). Ritas med former, inte typsnitt, så att den ser
 * likadan ut överallt.
 */
export function markor(typ = 'ledtrad') {
  return skapa('markor-' + typ, 128, 128, (g) => {
    g.clearRect(0, 0, 128, 128);
    // Skugga och bricka
    g.fillStyle = 'rgba(0,0,0,0.35)'; g.beginPath(); g.arc(64, 68, 50, 0, Math.PI * 2); g.fill();
    const gr = g.createRadialGradient(50, 44, 6, 64, 64, 52);
    gr.addColorStop(0, '#fff2c4'); gr.addColorStop(0.55, '#f0c860'); gr.addColorStop(1, '#a8741e');
    g.fillStyle = gr; g.beginPath(); g.arc(64, 64, 48, 0, Math.PI * 2); g.fill();
    g.lineWidth = 6; g.strokeStyle = '#4a2e08'; g.stroke();
    g.fillStyle = '#3a2206'; g.strokeStyle = '#3a2206';
    if (typ === 'ledtrad') {
      // Utropstecken: avsmalnande streck och en prick
      g.beginPath(); g.moveTo(55, 30); g.lineTo(73, 30); g.lineTo(68, 76); g.lineTo(60, 76); g.closePath(); g.fill();
      g.beginPath(); g.arc(64, 92, 8, 0, Math.PI * 2); g.fill();
    } else if (typ === 'bok') {
      g.lineWidth = 5; g.lineJoin = 'round';
      g.beginPath(); g.moveTo(64, 44); g.quadraticCurveTo(48, 36, 32, 42); g.lineTo(32, 86); g.quadraticCurveTo(48, 80, 64, 88); g.closePath(); g.stroke();
      g.beginPath(); g.moveTo(64, 44); g.quadraticCurveTo(80, 36, 96, 42); g.lineTo(96, 86); g.quadraticCurveTo(80, 80, 64, 88); g.closePath(); g.stroke();
      g.beginPath(); g.moveTo(64, 44); g.lineTo(64, 88); g.stroke();
    } else {
      g.beginPath(); g.moveTo(34, 56); g.lineTo(66, 56); g.lineTo(66, 40); g.lineTo(96, 64); g.lineTo(66, 88); g.lineTo(66, 72); g.lineTo(34, 72); g.closePath(); g.fill();
    }
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
/** Husfasad i Gamla stan: putsad vägg med fönster, några tända. Upprepas i sidled. */
export function fasad(farg = '#c9a26a') {
  return skapa('fasad' + farg, 512, 512, (g, w, h) => {
    g.fillStyle = farg; g.fillRect(0, 0, w, h);
    const r = rng(23);
    for (let i = 0; i < 900; i++) { g.fillStyle = `rgba(${r() < 0.5 ? '40,25,10' : '255,240,210'},${r() * 0.12})`; g.fillRect(r() * w, r() * h, 2 + r() * 6, 2 + r() * 6); }
    g.fillStyle = 'rgba(60,40,20,0.35)'; g.fillRect(0, h * 0.62, w, 8); g.fillRect(0, h * 0.3, w, 5);
    for (const [y0, hh] of [[h * 0.08, h * 0.17], [h * 0.38, h * 0.18]]) for (let i = 0; i < 3; i++) {
      const x = w * (0.1 + i * 0.32), fw = w * 0.16;
      g.fillStyle = '#e8dcc0'; g.fillRect(x - 5, y0 - 5, fw + 10, hh + 10);
      const tand = r() < 0.45;
      g.fillStyle = tand ? '#f2c46a' : '#1c2230'; g.fillRect(x, y0, fw, hh);
      if (tand) { g.fillStyle = 'rgba(255,220,140,0.5)'; g.fillRect(x - 8, y0 - 8, fw + 16, hh + 16); g.fillStyle = '#f6d080'; g.fillRect(x, y0, fw, hh); }
      g.strokeStyle = '#e8dcc0'; g.lineWidth = 4; g.beginPath(); g.moveTo(x + fw / 2, y0); g.lineTo(x + fw / 2, y0 + hh); g.moveTo(x, y0 + hh * 0.4); g.lineTo(x + fw, y0 + hh * 0.4); g.stroke();
    }
    // Bottenvåning: valv och portar
    for (let i = 0; i < 2; i++) { const x = w * (0.16 + i * 0.5), bw = w * 0.22; g.fillStyle = '#2a1c12'; g.beginPath(); g.moveTo(x, h); g.lineTo(x, h * 0.78); g.arc(x + bw / 2, h * 0.78, bw / 2, Math.PI, 0); g.lineTo(x + bw, h); g.fill(); }
    g.fillStyle = 'rgba(240,240,250,0.85)'; g.fillRect(0, h * 0.62 - 4, w, 4);
    gravyr(g, w, h, 0.07, 31);
  });
}
/** Vitkalkad eller putsad vägg. */
export function puts(farg = '#e8e0cc', upprepa = [1, 1]) {
  return skapa('puts' + farg, 256, 256, (g, w, h) => {
    g.fillStyle = farg; g.fillRect(0, 0, w, h);
    const r = rng(61);
    for (let i = 0; i < 700; i++) { g.fillStyle = `rgba(${r() < 0.5 ? '60,45,30' : '255,250,240'},${r() * 0.09})`; g.beginPath(); g.arc(r() * w, r() * h, 1 + r() * 7, 0, 7); g.fill(); }
    gravyr(g, w, h, 0.05, 63);
  }, { upprepa });
}
/** Granitblock (fyrtornets insida). */
export function stenvagg() {
  return skapa('stenvagg', 256, 256, (g, w, h) => {
    g.fillStyle = '#b8b0a0'; g.fillRect(0, 0, w, h);
    const r = rng(83);
    for (let y = 0, rad = 0; y < h; y += 42, rad++) for (let x = (rad % 2) * -40; x < w; x += 80) {
      const t = 150 + r() * 40; g.fillStyle = `rgb(${t},${t - 6},${t - 18})`; g.fillRect(x + 2, y + 2, 76, 38);
      for (let i = 0; i < 30; i++) { g.fillStyle = `rgba(40,35,30,${r() * 0.25})`; g.fillRect(x + r() * 76, y + r() * 38, 2, 2); }
    }
    gravyr(g, w, h, 0.06, 85);
  });
}
/** Liggande panel (stuga). */
export function trapanel(farg = '#8a6a48') {
  return skapa('trapanel' + farg, 256, 256, (g, w, h) => {
    g.fillStyle = farg; g.fillRect(0, 0, w, h);
    const r = rng(91);
    for (let y = 0; y < h; y += 26) { g.fillStyle = 'rgba(30,18,8,0.35)'; g.fillRect(0, y, w, 2); for (let i = 0; i < 12; i++) { g.strokeStyle = `rgba(40,25,10,${r() * 0.2})`; g.beginPath(); const yy = y + 4 + r() * 18; g.moveTo(0, yy); g.bezierCurveTo(w * 0.3, yy + (r() - 0.5) * 6, w * 0.7, yy + (r() - 0.5) * 6, w, yy); g.stroke(); } }
    gravyr(g, w, h, 0.06, 93);
  });
}
/** Storm över havet om natten (fönster i fyren). */
export function stormnatt() {
  return skapa('stormnatt', 128, 160, (g, w, h) => {
    const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#1a2028'); gr.addColorStop(0.55, '#38424a'); gr.addColorStop(0.56, '#1c2a30'); gr.addColorStop(1, '#0e171c');
    g.fillStyle = gr; g.fillRect(0, 0, w, h);
    const r = rng(55);
    g.strokeStyle = 'rgba(220,230,235,0.5)';
    for (let i = 0; i < 26; i++) { const y = h * 0.58 + r() * h * 0.4, x = r() * w; g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + 6, y - 3, x + 14, y); g.stroke(); }
    g.strokeStyle = 'rgba(200,210,220,0.35)';
    for (let i = 0; i < 70; i++) { const x = r() * w, y = r() * h; g.beginPath(); g.moveTo(x, y); g.lineTo(x - 4, y + 12); g.stroke(); }
  });
}

// ---- Teatern (foremal/teater.js) ----

/** Guldfrans: täta guldtrådar mot mörkt rött, upprepas runt ridåns veck. */
export function frans() {
  return skapa('frans', 64, 32, (g, w, h) => {
    g.fillStyle = '#3a0c0e'; g.fillRect(0, 0, w, h);
    const r = rng(101);
    for (let x = 0; x < w; x += 2) {
      g.fillStyle = `hsl(42, 62%, ${52 + r() * 18}%)`;
      g.fillRect(x, 0, 1.4, h - r() * 5);
    }
    g.fillStyle = 'rgba(60,30,0,0.35)'; g.fillRect(0, 0, w, 3);
  }, { upprepa: [3, 1] });
}

/** Säckväv: grov, gles väv i sandbrunt. */
export function sackvav() {
  return skapa('sackvav', 128, 128, (g, w, h) => {
    g.fillStyle = '#a68a5c'; g.fillRect(0, 0, w, h);
    const r = rng(103);
    for (let y = 0; y < h; y += 4) for (let x = 0; x < w; x += 4) {
      const ljus = ((x + y) / 4) % 2 ? 0.16 : -0.1;
      g.fillStyle = ljus > 0 ? `rgba(225,200,150,${ljus + r() * 0.08})` : `rgba(50,35,15,${-ljus + r() * 0.08})`;
      g.fillRect(x, y, 3, 3);
    }
    for (let i = 0; i < 40; i++) { g.strokeStyle = `rgba(60,40,15,${0.15 + r() * 0.2})`; g.lineWidth = 1; const y = r() * h; g.beginPath(); g.moveTo(0, y); g.lineTo(w, y + (r() - 0.5) * 3); g.stroke(); }
    gravyr(g, w, h, 0.1, 105);
  });
}

/** Utrunnen sand: en avsmalnande sträng med lösa korn på genomskinlig grund (stor ände nedtill). */
export function sandstrang() {
  return skapa('sandstrang', 64, 128, (g, w, h) => {
    g.clearRect(0, 0, w, h);
    const r = rng(117);
    for (let i = 0; i < 60; i++) {
      const t = i / 59, y = h - 8 - t * (h - 20), x = w / 2 + Math.sin(t * 5) * 6 + (r() - 0.5) * 4, rr = (1 - t * 0.8) * 16 * (0.7 + r() * 0.5);
      g.fillStyle = `rgba(${196 + r() * 20 | 0},${176 + r() * 18 | 0},${128 + r() * 16 | 0},${0.35 + r() * 0.3})`;
      g.beginPath(); g.ellipse(x, y, rr, rr * 0.8, 0, 0, 7); g.fill();
    }
    for (let i = 0; i < 260; i++) { const y = r() * h, s = 1 - y / h; g.fillStyle = `rgba(${r() < 0.5 ? '220,200,150' : '120,100,60'},${0.3 + r() * 0.5})`; g.fillRect(w / 2 + (r() - 0.5) * 50 * (1 - s * 0.6), y, 1.5, 1.5); }
  });
}

/** Kritkryss på scengolvet: vita, lite suddiga streck på genomskinlig grund. */
export function kritkryss() {
  return skapa('kritkryss', 128, 128, (g, w, h) => {
    g.clearRect(0, 0, w, h);
    const r = rng(107);
    g.lineCap = 'round';
    for (const [x0, y0, x1, y1] of [[18, 20, 110, 106], [108, 16, 22, 110]]) {
      for (let i = 0; i < 9; i++) {
        g.strokeStyle = `rgba(255,255,255,${0.12 + r() * 0.2})`; g.lineWidth = 4 + r() * 7;
        const d = () => (r() - 0.5) * 7;
        g.beginPath(); g.moveTo(x0 + d(), y0 + d()); g.quadraticCurveTo((x0 + x1) / 2 + d(), (y0 + y1) / 2 + d(), x1 + d(), y1 + d()); g.stroke();
      }
    }
    // Kritkornig yta: små hål i strecken och lösa korn omkring
    g.globalCompositeOperation = 'destination-out';
    for (let i = 0; i < 700; i++) { g.fillStyle = `rgba(0,0,0,${0.4 + r() * 0.6})`; g.fillRect(r() * w, r() * h, 1.5, 1.5); }
    g.globalCompositeOperation = 'source-over';
    for (let i = 0; i < 120; i++) { g.fillStyle = `rgba(255,255,255,${r() * 0.35})`; g.fillRect(14 + r() * 100, 14 + r() * 100, 1.5, 1.5); }
  });
}

/** Spegelglas: kall, blank grå ton med snett ljusstråk och ärgade kanter. */
export function spegel() {
  return skapa('spegel', 128, 128, (g, w, h) => {
    const gr = g.createLinearGradient(0, 0, w, h); gr.addColorStop(0, '#8e9590'); gr.addColorStop(0.5, '#5f6662'); gr.addColorStop(1, '#3c403e');
    g.fillStyle = gr; g.fillRect(0, 0, w, h);
    g.fillStyle = 'rgba(255,250,235,0.18)';
    g.beginPath(); g.moveTo(w * 0.15, h); g.lineTo(w * 0.45, 0); g.lineTo(w * 0.62, 0); g.lineTo(w * 0.32, h); g.fill();
    g.fillStyle = 'rgba(255,250,235,0.1)';
    g.beginPath(); g.moveTo(w * 0.5, h); g.lineTo(w * 0.8, 0); g.lineTo(w * 0.86, 0); g.lineTo(w * 0.56, h); g.fill();
    g.strokeStyle = 'rgba(40,35,25,0.45)'; g.lineWidth = 8; g.strokeRect(0, 0, w, h);
  });
}

/** Ljuskägla från en strålkastare: genomskinlig, starkast vid linsen. */
export function ljuskon() {
  return skapa('ljuskon', 4, 64, (g, w, h) => {
    const gr = g.createLinearGradient(0, 0, 0, h);
    // Överkanten hamnar vid konens spets (linsen)
    gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.3, 'rgba(255,255,255,0.45)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = gr; g.fillRect(0, 0, w, h);
  });
}

const nyans = (farg, f) => '#' + new THREE.Color(farg).multiplyScalar(f).getHexString();
const kulissMatt = ([b, hj]) => [256, Math.max(128, Math.round((256 * hj) / b / 32) * 32)];

/** Kulissens målade framsida: en salongsvägg med fält, bröstpanel, sockel och en målad tavla. */
export function kulissMalad(farg = '#4f6b4a', storlek = [1.4, 3.2]) {
  const [w, h] = kulissMatt(storlek);
  return skapa('kuliss' + farg + w + 'x' + h, w, h, (g) => {
    const r = rng(109);
    const ljus = nyans(farg, 1.35), mork = nyans(farg, 0.6), list = '#d8c690';
    g.fillStyle = farg; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 260; i++) { g.fillStyle = r() < 0.5 ? `rgba(255,245,220,${r() * 0.07})` : `rgba(20,25,10,${r() * 0.08})`; g.fillRect(r() * w, r() * h, 10 + r() * 30, 3 + r() * 5); }
    const sockel = h * 0.06, brost = h * 0.3, krans = h * 0.05;
    // Målade lister: ljus överkant och skugga under, som om de vore på riktigt
    const lista = (y, tj) => { g.fillStyle = list; g.fillRect(0, y, w, tj); g.fillStyle = 'rgba(255,250,230,0.5)'; g.fillRect(0, y, w, tj * 0.3); g.fillStyle = 'rgba(30,20,5,0.45)'; g.fillRect(0, y + tj, w, tj * 0.5); };
    const falt = (x, y, fw, fh) => {
      g.strokeStyle = mork; g.lineWidth = 6; g.strokeRect(x + 3, y + 3, fw, fh);
      g.strokeStyle = ljus; g.lineWidth = 5; g.strokeRect(x, y, fw, fh);
      g.strokeStyle = list; g.lineWidth = 2; g.strokeRect(x + 1, y + 1, fw - 2, fh - 2);
    };
    g.fillStyle = mork; g.fillRect(0, h - sockel, w, sockel);
    lista(h - sockel - 6, 6);
    g.fillStyle = nyans(farg, 0.85); g.fillRect(0, h - brost, w, brost - sockel - 6);
    falt(22, h - brost + 18, w / 2 - 36, brost - sockel - 46); falt(w / 2 + 14, h - brost + 18, w / 2 - 36, brost - sockel - 46);
    lista(h - brost - 8, 8);
    const fh = h - brost - krans - 64;
    falt(26, krans + 30, w - 52, fh);
    const tx = w / 2 - 44, ty = krans + 30 + fh * 0.3;
    g.fillStyle = '#5a3a1a'; g.fillRect(tx - 6, ty - 6, 100, 76); g.fillStyle = '#b8893a'; g.fillRect(tx - 3, ty - 3, 94, 70);
    const gr = g.createLinearGradient(0, ty, 0, ty + 64); gr.addColorStop(0, '#9fb0a8'); gr.addColorStop(0.6, '#d8c8a0'); gr.addColorStop(1, '#5a6a3a');
    g.fillStyle = gr; g.fillRect(tx, ty, 88, 64);
    g.fillStyle = mork; g.fillRect(0, 0, w, krans); lista(krans, 7);
    gravyr(g, w, h, 0.07, 111);
  });
}

/** Kulissens baksida: oblekt duk med genomslag av färg och schablontext (\n ger flera rader). */
export function kulissBak(text = '', storlek = [1.4, 3.2]) {
  const [w, h] = kulissMatt(storlek);
  return skapa('kulissbak' + text + w + 'x' + h, w, h, (g) => {
    const r = rng(113), duk = '#d6c9a8';
    g.fillStyle = duk; g.fillRect(0, 0, w, h);
    for (let y = 0; y < h; y += 3) { g.fillStyle = `rgba(120,95,55,${0.05 + r() * 0.05})`; g.fillRect(0, y, w, 1); }
    for (let x = 0; x < w; x += 3) { g.fillStyle = `rgba(120,95,55,${0.03 + r() * 0.04})`; g.fillRect(x, 0, 1, h); }
    for (let i = 0; i < 18; i++) { g.fillStyle = `rgba(${r() < 0.5 ? '70,90,60' : '110,80,50'},${0.05 + r() * 0.08})`; g.beginPath(); g.ellipse(r() * w, r() * h, 8 + r() * 30, 6 + r() * 20, r() * 3, 0, 7); g.fill(); }
    if (text) {
      const rader = String(text).split('\n');
      let st = 34;
      const typ = () => { g.font = `bold ${st}px "Courier New", Courier, monospace`; };
      typ();
      const bredast = Math.max(...rader.map((t) => g.measureText(t).width));
      if (bredast > w - 24) { st = Math.floor((st * (w - 24)) / bredast); typ(); }
      g.textAlign = 'center'; g.textBaseline = 'middle';
      rader.forEach((t, i) => {
        const y = h * 0.42 + (i - (rader.length - 1) / 2) * st * 1.3;
        g.fillStyle = 'rgba(25,20,15,0.18)'; g.fillText(t, w / 2 + 1.5, y + 1.5); // sprej utanför schablonen
        g.fillStyle = 'rgba(25,20,15,0.85)'; g.fillText(t, w / 2, y);
        g.fillStyle = duk; for (let x = 0; x < w; x += st * 0.6) g.fillRect(x + st * 0.27, y - 1, 2, 2.5); // schablonens bryggor
      });
    }
    gravyr(g, w, h, 0.06, 115);
  });
}

// ---- Slottet (foremal/slott.js) ----

/** Biljardkläde: tät grön filt med svag nopp. */
export function kladet() {
  return skapa('kladet', 128, 128, (g, w, h) => {
    g.fillStyle = '#2f6a3a'; g.fillRect(0, 0, w, h);
    const r = rng(121);
    for (let i = 0; i < 1600; i++) { g.fillStyle = r() < 0.5 ? `rgba(10,40,15,${r() * 0.18})` : `rgba(120,170,110,${r() * 0.1})`; g.fillRect(r() * w, r() * h, 1 + r(), 1 + r()); }
  }, { upprepa: [3, 2] });
}

/** Vitt kakel med blå dekor: en blomma mitt på varje platta och rosetter där fyra plattor möts (2 × 2 plattor per ruta). */
export function kakel(upprepa = [1, 1]) {
  return skapa('kakel', 256, 256, (g, w) => {
    const r = rng(127), s = w / 2, bla = '#2c4a8a';
    g.lineCap = 'round';
    for (let ty = 0; ty < 2; ty++) for (let tx = 0; tx < 2; tx++) {
      const x0 = tx * s, y0 = ty * s, cx = x0 + s / 2, cy = y0 + s / 2;
      const gr = g.createRadialGradient(x0 + s * 0.4, y0 + s * 0.35, 4, cx, cy, s * 0.75);
      gr.addColorStop(0, '#fbf9f2'); gr.addColorStop(1, '#e4ddcc');
      g.fillStyle = gr; g.fillRect(x0, y0, s, s);
      g.strokeStyle = bla; g.fillStyle = bla;
      g.globalAlpha = 0.85; // blomma med fyra kronblad
      for (let i = 0; i < 4; i++) { const a = (i * Math.PI) / 2 + Math.PI / 4; g.beginPath(); g.ellipse(cx + Math.cos(a) * 14, cy + Math.sin(a) * 14, 12, 6, a, 0, 7); g.fill(); }
      g.globalAlpha = 0.6; g.lineWidth = 2; // rankor
      for (let i = 0; i < 4; i++) { const a = (i * Math.PI) / 2; g.beginPath(); g.moveTo(cx + Math.cos(a) * 18, cy + Math.sin(a) * 18); g.quadraticCurveTo(cx + Math.cos(a + 0.4) * 34, cy + Math.sin(a + 0.4) * 34, cx + Math.cos(a) * 42, cy + Math.sin(a) * 42); g.stroke(); }
      g.globalAlpha = 1; g.fillStyle = '#f6f2e6'; g.beginPath(); g.arc(cx, cy, 5, 0, 7); g.fill(); g.stroke();
      g.globalAlpha = 0.7; g.fillStyle = bla; g.lineWidth = 3;
      for (const [hx, hy] of [[x0, y0], [x0 + s, y0], [x0, y0 + s], [x0 + s, y0 + s]]) { g.beginPath(); g.arc(hx, hy, 13, 0, 7); g.stroke(); g.beginPath(); g.arc(hx, hy, 5, 0, 7); g.fill(); }
      g.globalAlpha = 1;
      // Fogar och lite krakelering i glasyren
      g.strokeStyle = 'rgba(120,110,90,0.55)'; g.lineWidth = 2; g.strokeRect(x0 + 1, y0 + 1, s - 2, s - 2);
      g.strokeStyle = 'rgba(110,100,80,0.12)'; g.lineWidth = 0.6;
      for (let i = 0; i < 5; i++) { let x = x0 + r() * s, y = y0 + r() * s; g.beginPath(); g.moveTo(x, y); for (let k = 0; k < 4; k++) { x += (r() - 0.5) * 30; y += (r() - 0.5) * 30; g.lineTo(x, y); } g.stroke(); }
    }
  }, { upprepa });
}

/** Ljus marmor med grå ådror. */
export function marmor(upprepa = [1, 1]) {
  return skapa('marmor', 256, 256, (g, w, h) => {
    g.fillStyle = '#e6ddcc'; g.fillRect(0, 0, w, h);
    const r = rng(131);
    for (let i = 0; i < 40; i++) { g.fillStyle = `rgba(${r() < 0.5 ? '180,170,150' : '250,246,236'},${r() * 0.1})`; g.beginPath(); g.ellipse(r() * w, r() * h, 20 + r() * 50, 8 + r() * 20, r() * 3, 0, 7); g.fill(); }
    for (let i = 0; i < 9; i++) {
      g.strokeStyle = `rgba(110,100,90,${0.12 + r() * 0.22})`; g.lineWidth = 0.4 + r() * 0.9;
      let x = r() * w, y = 0; g.beginPath(); g.moveTo(x, y);
      while (y < h) { const nx = x + (r() - 0.45) * 40, ny = y + 10 + r() * 30; g.quadraticCurveTo(x + (r() - 0.5) * 30, (y + ny) / 2, nx, ny); x = nx; y = ny; }
      g.stroke();
    }
    gravyr(g, w, h, 0.04, 133);
  }, { upprepa });
}

/** Ullfrans till gobelängen: tvinnade trådar i dova färger på genomskinlig grund. */
export function ullfrans() {
  return skapa('ullfrans', 128, 16, (g, w, h) => {
    g.clearRect(0, 0, w, h);
    const r = rng(145);
    for (let x = 0; x < w; x += 2) {
      g.fillStyle = ['#b8a070', '#a08860', '#8a3a2a', '#c8b488'][(r() * 4) | 0];
      g.fillRect(x, 0, 1.5, h - 1 - r() * 3);
    }
    g.fillStyle = '#6a5a3a'; g.fillRect(0, 0, w, 3);
  }, { upprepa: [6, 1] });
}

/** Notblad: notsystem med noter och taktstreck under en rubrik. */
export function notblad(seed = 1) {
  return skapa('notblad' + seed, 128, 176, (g, w, h) => {
    g.fillStyle = '#efe6cf'; g.fillRect(0, 0, w, h);
    const r = rng(137 + seed);
    g.fillStyle = '#3a2a1a'; g.font = 'italic 9px Georgia, serif'; g.textAlign = 'center'; g.fillText(['Valse', 'Menuett', 'Nocturne', 'Polka'][seed % 4], w / 2, 13);
    for (let s = 0; s < 7; s++) {
      const y0 = 24 + s * 21;
      g.strokeStyle = 'rgba(40,30,20,0.7)'; g.lineWidth = 0.6;
      for (let l = 0; l < 5; l++) { g.beginPath(); g.moveTo(8, y0 + l * 2.6); g.lineTo(w - 8, y0 + l * 2.6); g.stroke(); }
      for (const x of [8, 44, 82, w - 8]) { g.beginPath(); g.moveTo(x, y0); g.lineTo(x, y0 + 10.4); g.stroke(); }
      g.fillStyle = '#2a1e14';
      for (let x = 15; x < w - 12; x += 5 + r() * 4) {
        const y = y0 - 2 + Math.round(r() * 8) * 1.3; g.beginPath(); g.ellipse(x, y, 1.7, 1.2, -0.4, 0, 7); g.fill();
        g.fillRect(x + 1.2, y - 7, 0.6, 7);
      }
    }
    gravyr(g, w, h, 0.05, 139);
  });
}

/** Växelbordets front: två rader fallklaffar med nummer (två har fallit) och ett jackfält med mässingsringar. */
export function vaxelpanel() {
  return skapa('vaxelpanel', 256, 160, (g, w, h) => {
    g.fillStyle = '#3c2014'; g.fillRect(0, 0, w, h);
    const r = rng(141);
    for (let i = 0; i < 60; i++) { g.strokeStyle = `rgba(20,8,2,${r() * 0.3})`; const y = r() * h; g.beginPath(); g.moveTo(0, y); g.lineTo(w, y + (r() - 0.5) * 4); g.stroke(); }
    const kol = 10, dx = (w - 24) / kol;
    g.textAlign = 'center'; g.textBaseline = 'middle';
    for (let rad = 0; rad < 2; rad++) for (let i = 0; i < kol; i++) {
      const x = 12 + i * dx + dx / 2, y = 14 + rad * 24, nr = rad * kol + i + 1, fallen = nr === 7 || nr === 15;
      g.fillStyle = '#b8893a'; g.fillRect(x - 9, y - 9, 18, 18);
      g.fillStyle = fallen ? '#e8e0cc' : '#151212'; g.fillRect(x - 7, y - 7, 14, 14);
      g.fillStyle = fallen ? '#151212' : '#d8ccb0'; g.font = 'bold 9px Georgia, serif'; g.fillText(String(nr), x, y + 0.5);
    }
    g.fillStyle = 'rgba(184,137,58,0.8)'; g.fillRect(6, 62, w - 12, 2);
    for (let rad = 0; rad < 4; rad++) for (let i = 0; i < kol; i++) {
      const x = 12 + i * dx + dx / 2, y = 82 + rad * 21;
      g.fillStyle = '#e8dfc8'; g.fillRect(x - 6, y - 10, 12, 5);
      g.fillStyle = '#3a2a1a'; g.font = '5px sans-serif'; g.fillText(String(rad * kol + i + 1), x, y - 7.3);
      g.fillStyle = '#c9a050'; g.beginPath(); g.arc(x, y + 3, 4.6, 0, 7); g.fill();
      g.fillStyle = '#0c0806'; g.beginPath(); g.arc(x, y + 3, 2.2, 0, 7); g.fill();
    }
    gravyr(g, w, h, 0.05, 143);
  });
}

/** Klaviatur sedd uppifrån: 52 vita tangenter med de svarta mellan, basen till vänster (u = 0). */
export function klaviatur() {
  return skapa('klaviatur', 1024, 64, (g, w, h) => {
    g.fillStyle = '#f2ecdc'; g.fillRect(0, 0, w, h);
    const n = 52, kw = w / n;
    g.fillStyle = 'rgba(80,70,50,0.6)';
    for (let i = 1; i < n; i++) g.fillRect(i * kw - 0.6, 0, 1.2, h);
    g.fillStyle = 'rgba(255,255,250,0.5)'; g.fillRect(0, h - 6, w, 3);
    // A0 och H0 först, sedan C D E F G A H i varje oktav: svart tangent efter C, D, F, G och A
    g.fillStyle = '#141012';
    const svart = (i) => g.fillRect((i + 1) * kw - kw * 0.3, 0, kw * 0.6, h * 0.62);
    svart(0);
    for (let i = 2; i < n - 1; i++) { const t = (i - 2) % 7; if (t !== 2 && t !== 6) svart(i); }
  });
}

/** Flygelns inre: gjutjärnsramen i matt guld med strängar längs flygeln. */
export function strangar() {
  return skapa('strangar', 64, 64, (g, w, h) => {
    g.fillStyle = '#9a7a3a'; g.fillRect(0, 0, w, h);
    for (let x = 1; x < w; x += 4) { g.fillStyle = 'rgba(230,220,190,0.7)'; g.fillRect(x, 0, 1, h); g.fillStyle = 'rgba(40,25,5,0.4)'; g.fillRect(x + 1, 0, 1, h); }
  }, { upprepa: [8, 1] });
}

/** Vävd bonad i dova färger: 'jakt' (ryttare, hjort och hundar i skogen) eller 'slott' (slott på en höjd vid en å). */
export function gobelang(motiv = 'jakt', seed = 1, storlek = [2, 1.6]) {
  const w = 512, h = Math.max(256, Math.round((512 * storlek[1]) / storlek[0] / 32) * 32);
  return skapa('gobelang' + motiv + seed + 'x' + h, w, h, (g) => {
    const r = rng(151 + seed * 7);
    const B = 26, iw = w - 2 * B, ih = h - 2 * B;
    const GRON = ['#4a5a3a', '#5a6a40', '#3c4a32', '#66704a'], BRUN = '#5a3e26', OCKRA = '#b08a4a', BLA = '#5a6a7a', ROD = '#8a3a2a', GRADD = '#d8c8a0';
    g.save(); g.beginPath(); g.rect(B, B, iw, ih); g.clip(); g.translate(B, B);
    // Himmel och avlägsna kullar
    const hg = g.createLinearGradient(0, 0, 0, ih * 0.45); hg.addColorStop(0, '#8a9890'); hg.addColorStop(1, '#c8bc94');
    g.fillStyle = hg; g.fillRect(0, 0, iw, ih);
    g.fillStyle = '#7a8a70';
    g.beginPath(); g.moveTo(0, ih * 0.42); for (let x = 0; x <= iw; x += 32) g.lineTo(x, ih * (0.36 + r() * 0.08)); g.lineTo(iw, ih); g.lineTo(0, ih); g.fill();
    g.fillStyle = GRON[1]; g.fillRect(0, ih * 0.5, iw, ih * 0.5);
    const trad = (x, y, s) => {
      g.fillStyle = BRUN; g.fillRect(x - s * 0.08, y - s * 0.9, s * 0.16, s * 0.9);
      for (let i = 0; i < 7; i++) { g.fillStyle = GRON[(r() * 4) | 0]; g.beginPath(); g.ellipse(x + (r() - 0.5) * s * 0.8, y - s * (1 + r() * 0.6), s * (0.3 + r() * 0.2), s * (0.25 + r() * 0.15), 0, 0, 7); g.fill(); }
    };
    // Hjort, häst eller hund i språng: kropp, hals, huvud och ben
    const djur = (x, y, s, farg, horn) => {
      g.fillStyle = farg; g.strokeStyle = farg; g.lineWidth = s * 0.09; g.lineCap = 'round';
      g.beginPath(); g.ellipse(x, y, s * 0.5, s * 0.2, -0.1, 0, 7); g.fill();
      g.beginPath(); g.moveTo(x + s * 0.4, y - s * 0.05); g.lineTo(x + s * 0.6, y - s * 0.38); g.stroke();
      g.beginPath(); g.ellipse(x + s * 0.68, y - s * 0.4, s * 0.14, s * 0.08, 0.3, 0, 7); g.fill();
      for (const [a, b] of [[-0.35, -0.9], [-0.25, -0.6], [0.3, 0.7], [0.38, 1.0]]) { g.beginPath(); g.moveTo(x + a * s, y + s * 0.1); g.lineTo(x + b * s * 0.7, y + s * 0.55); g.stroke(); }
      if (horn) {
        g.lineWidth = s * 0.04;
        for (const sx of [-1, 1]) { g.beginPath(); g.moveTo(x + s * 0.62, y - s * 0.45); g.lineTo(x + s * (0.6 + sx * 0.12), y - s * 0.8); g.lineTo(x + s * (0.66 + sx * 0.18), y - s * 0.95); g.moveTo(x + s * (0.61 + sx * 0.06), y - s * 0.65); g.lineTo(x + s * (0.5 + sx * 0.2), y - s * 0.72); g.stroke(); }
      }
    };
    if (motiv === 'slott') {
      g.fillStyle = BLA; g.beginPath(); g.moveTo(0, ih * 0.78); g.bezierCurveTo(iw * 0.3, ih * 0.7, iw * 0.6, ih * 0.9, iw, ih * 0.74); g.lineTo(iw, ih * 0.82); g.bezierCurveTo(iw * 0.6, ih * 0.98, iw * 0.3, ih * 0.78, 0, ih * 0.86); g.fill();
      g.fillStyle = GRON[3]; g.beginPath(); g.moveTo(iw * 0.18, ih * 0.62); g.quadraticCurveTo(iw * 0.5, ih * 0.3, iw * 0.82, ih * 0.62); g.fill();
      const sx = iw * 0.5, sy = ih * 0.47, sw = iw * 0.32;
      g.fillStyle = GRADD; g.fillRect(sx - sw / 2, sy - ih * 0.14, sw, ih * 0.14);
      for (const [tx, th] of [[-0.5, 0.26], [0.5, 0.26], [0, 0.32]]) {
        const x = sx + tx * sw, tw = iw * 0.06;
        g.fillStyle = GRADD; g.fillRect(x - tw / 2, sy - ih * th, tw, ih * th);
        g.fillStyle = ROD; g.beginPath(); g.moveTo(x - tw * 0.65, sy - ih * th); g.lineTo(x, sy - ih * (th + 0.1)); g.lineTo(x + tw * 0.65, sy - ih * th); g.fill();
      }
      g.fillStyle = '#3a3a3a';
      for (let i = 0; i < 6; i++) g.fillRect(sx - sw * 0.4 + i * sw * 0.15, sy - ih * 0.1, 5, 9);
      for (let i = 0; i < 4; i++) trad(iw * (0.06 + r() * 0.14), ih * (0.7 + r() * 0.15), ih * 0.2);
      for (let i = 0; i < 4; i++) trad(iw * (0.82 + r() * 0.14), ih * (0.7 + r() * 0.15), ih * 0.2);
      djur(iw * 0.3, ih * 0.9, ih * 0.1, BRUN, true);
    } else {
      for (let i = 0; i < 9; i++) trad(iw * (i / 8) + (r() - 0.5) * 30, ih * (0.6 + r() * 0.12), ih * (0.22 + r() * 0.08));
      const rx = iw * 0.32, ry = ih * 0.76, s = ih * 0.2; // ryttaren
      djur(rx, ry, s, '#7a5a3a', false);
      g.fillStyle = ROD; g.fillRect(rx - s * 0.12, ry - s * 0.6, s * 0.22, s * 0.42);
      g.fillStyle = '#d8b898'; g.beginPath(); g.arc(rx, ry - s * 0.7, s * 0.09, 0, 7); g.fill();
      g.fillStyle = '#2a2420'; g.fillRect(rx - s * 0.13, ry - s * 0.82, s * 0.26, s * 0.06);
      g.strokeStyle = OCKRA; g.lineWidth = 3; g.beginPath(); g.moveTo(rx + s * 0.05, ry - s * 0.45); g.lineTo(rx + s * 0.55, ry - s * 0.95); g.stroke(); // spjutet
      djur(iw * 0.7, ih * 0.72, ih * 0.16, OCKRA, true); // hjorten
      djur(iw * 0.52, ih * 0.88, ih * 0.08, '#d0c0a0', false); djur(iw * 0.6, ih * 0.92, ih * 0.08, BRUN, false); // hundarna
    }
    // Millefleurs i förgrunden
    for (let i = 0; i < 90; i++) { g.fillStyle = [ROD, GRADD, OCKRA, BLA][(r() * 4) | 0]; g.beginPath(); g.arc(r() * iw, ih * (0.8 + r() * 0.2), 1.5 + r() * 2, 0, 7); g.fill(); }
    g.restore();
    // Bården: mörkblå med rankor och ett rött band innanför
    g.fillStyle = '#2e3644'; g.fillRect(0, 0, w, B); g.fillRect(0, h - B, w, B); g.fillRect(0, 0, B, h); g.fillRect(w - B, 0, B, h);
    g.strokeStyle = OCKRA; g.lineWidth = 2;
    for (let x = 0; x < w; x += 22) for (const y of [B / 2, h - B / 2]) { g.beginPath(); g.arc(x, y, 6, 0, Math.PI); g.stroke(); g.fillStyle = ROD; g.beginPath(); g.arc(x + 11, y - 2, 3, 0, 7); g.fill(); }
    for (let y = 0; y < h; y += 22) for (const x of [B / 2, w - B / 2]) { g.beginPath(); g.arc(x, y, 6, -Math.PI / 2, Math.PI / 2); g.stroke(); g.fillStyle = ROD; g.beginPath(); g.arc(x - 2, y + 11, 3, 0, 7); g.fill(); }
    g.strokeStyle = ROD; g.lineWidth = 3; g.strokeRect(B - 2, B - 2, iw + 4, ih + 4);
    // Väven: täta inslag, blekning och nötning
    for (let y = 0; y < h; y += 2) { g.fillStyle = `rgba(${y % 4 ? '255,240,210' : '30,20,10'},${0.06 + r() * 0.04})`; g.fillRect(0, y, w, 1); }
    for (let x = 0; x < w; x += 3) { g.fillStyle = 'rgba(30,20,10,0.05)'; g.fillRect(x, 0, 1, h); }
    g.fillStyle = 'rgba(150,130,100,0.18)'; g.fillRect(0, 0, w, h);
    gravyr(g, w, h, 0.08, 157 + seed);
  });
}
