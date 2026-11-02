// Ljud: syntetiserade miljöljud och små effekter med Web Audio. Inga ljudfiler behövs.
// Varje 3D-rum kan ange `ljud` i fallets JSON, t.ex. ["tag", "vind"] eller [{ "typ": "tick", "styrka": 0.5 }].
// Ljudet startar först efter ett tryck eller en tangent (webbläsarnas krav) och kan stängas av i spelet.
import { installningar, spara } from './motor/lagring.js';

let ctx = null, master = null, brus = null, matare = null;
let lager = [];          // aktiva miljölager: { stopp() }
let onskade = [];        // rummets ljud, startas när ljudet vaknar
const RAMP = 1.2;        // sekunder för in- och uttoning

export const arPa = () => installningar().ljud !== false;

export function satt(pa) {
  installningar().ljud = !!pa; spara();
  if (pa) { vakna(); spelaRum(onskade); } else tystna();
  if (master && ctx) master.gain.setTargetAtTime(pa ? 1 : 0, ctx.currentTime, 0.1);
}

/** Skapar/återupptar ljudet. Anropas från ett tryck eller en tangent. */
export function vakna() {
  if (!arPa()) return;
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    try { ctx = new AC(); } catch { return; }
    master = ctx.createGain(); master.gain.value = 1; master.connect(ctx.destination);
    matare = ctx.createAnalyser(); matare.fftSize = 2048; master.connect(matare);
    // Två sekunder vitt brus som alla brusbaserade ljud delar
    brus = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const d = brus.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    document.addEventListener('visibilitychange', () => { if (!ctx) return; if (document.hidden) ctx.suspend(); else if (arPa()) ctx.resume(); });
    if (onskade.length) startaLager(onskade);
  }
  if (ctx.state === 'suspended' && !document.hidden) ctx.resume().catch(() => {});
}

/** För testerna: tillstånd, aktiva lager och ljudnivå (RMS) just nu. */
export function status() {
  let niva = 0;
  if (matare) { const d = new Float32Array(matare.fftSize); matare.getFloatTimeDomainData(d); niva = Math.sqrt(d.reduce((s, x) => s + x * x, 0) / d.length); }
  return { tillstand: ctx?.state || 'inget', lager: lager.length, typer: onskade.map((x) => x.typ), niva };
}

/** Byt miljöljud till ett rums lista. Tonar ut det gamla och in det nya. */
export function spelaRum(lista) {
  onskade = (lista || []).map((x) => (typeof x === 'string' ? { typ: x } : x));
  tystna();
  if (ctx && arPa()) startaLager(onskade);
}
/** Tona ut allt miljöljud (t.ex. när utredningen lämnas). */
export function tystna() { for (const l of lager) l.stopp(); lager = []; }
export function lamna() { onskade = []; tystna(); }

/** Korta effekter: 'fynd', 'dorr', 'sida'. */
export function effekt(namn) {
  if (!ctx || !arPa() || ctx.state !== 'running') return;
  const t = ctx.currentTime;
  if (namn === 'fynd') { ton(660, t, 0.5, 0.07); ton(990, t + 0.09, 0.6, 0.06); }
  else if (namn === 'dorr') stot(t, { typ: 'lowpass', frek: 180, langd: 0.25, styrka: 0.5 });
  else if (namn === 'sida') svep(t);
}

// ---------- byggstenar ----------
function brusKalla() { const s = ctx.createBufferSource(); s.buffer = brus; s.loop = true; s.loopStart = Math.random(); return s; }
function filter(typ, frek, q = 0.7) { const f = ctx.createBiquadFilter(); f.type = typ; f.frequency.value = frek; f.Q.value = q; return f; }
function forstarkning(v) { const g = ctx.createGain(); g.gain.value = v; return g; }
function lfo(frek, mangd, mal) { const o = ctx.createOscillator(); o.frequency.value = frek; const g = forstarkning(mangd); o.connect(g); g.connect(mal); o.start(); return o; }
function ton(frek, t, langd, styrka, typ = 'sine', till = null) {
  const o = ctx.createOscillator(); o.type = typ; o.frequency.setValueAtTime(frek, t);
  if (till) o.frequency.exponentialRampToValueAtTime(till, t + langd);
  const g = forstarkning(0); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(styrka, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + langd);
  o.connect(g); g.connect(master); o.start(t); o.stop(t + langd + 0.05);
}
function stot(t, { typ = 'bandpass', frek = 1000, q = 1, langd = 0.03, styrka = 0.2, ut = master }) {
  const s = brusKalla(), f = filter(typ, frek, q), g = forstarkning(0);
  g.gain.setValueAtTime(styrka, t); g.gain.exponentialRampToValueAtTime(0.0001, t + langd);
  s.connect(f); f.connect(g); g.connect(ut); s.start(t, Math.random()); s.stop(t + langd + 0.02);
}
function svep(t) {
  const s = brusKalla(), f = filter('bandpass', 800, 1.2), g = forstarkning(0);
  f.frequency.setValueAtTime(600, t); f.frequency.exponentialRampToValueAtTime(3000, t + 0.15);
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.08, t + 0.04); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.2);
  s.connect(f); f.connect(g); g.connect(master); s.start(t); s.stop(t + 0.25);
}

/** Ett lager: en utgång som tonas in, noder som stoppas och timers som rensas när lagret tonas ut. */
function nyttLager(styrka) {
  const ut = forstarkning(0); ut.connect(master);
  ut.gain.setTargetAtTime(styrka, ctx.currentTime, RAMP / 3);
  const noder = [], timers = [];
  return {
    ut, noder, timers,
    upprepa(fn, min, max) { // kör fn(tid) med slumpat mellanrum
      const steg = () => { if (ctx.state === 'running') fn(ctx.currentTime + 0.05); timers.push(setTimeout(steg, min + Math.random() * (max - min))); };
      timers.push(setTimeout(steg, Math.random() * min));
    },
    stopp() {
      timers.forEach(clearTimeout);
      ut.gain.setTargetAtTime(0, ctx.currentTime, RAMP / 4);
      setTimeout(() => { for (const n of noder) { try { n.stop(); } catch { /* redan stoppad */ } } ut.disconnect(); }, RAMP * 1500);
    },
  };
}

// ---------- miljöljuden ----------
const MILJO = {
  /** Vind som sveper i byar. */
  vind(L, kraftig = false) {
    const s = brusKalla(), f = filter('lowpass', kraftig ? 700 : 450), g = forstarkning(kraftig ? 0.5 : 0.35);
    s.connect(f); f.connect(g); g.connect(L.ut); s.start();
    L.noder.push(s, lfo(0.07, kraftig ? 400 : 220, f.frequency), lfo(0.13, kraftig ? 0.3 : 0.2, g.gain));
  },
  /** Storm: kraftig vind och tjut i springorna. */
  storm(L) {
    MILJO.vind(L, true);
    const s = brusKalla(), f = filter('bandpass', 900, 6), g = forstarkning(0.06);
    s.connect(f); f.connect(g); g.connect(L.ut); s.start();
    L.noder.push(s, lfo(0.05, 500, f.frequency), lfo(0.09, 0.05, g.gain));
  },
  /** Tåg: dovt mullrande och skarvarna i rälsen. */
  tag(L) {
    const s = brusKalla(), f = filter('lowpass', 140), g = forstarkning(0.9);
    s.connect(f); f.connect(g); g.connect(L.ut); s.start(); L.noder.push(s, lfo(0.3, 0.15, g.gain));
    L.upprepa((t) => { for (const dt of [0, 0.13]) stot(t + dt, { typ: 'bandpass', frek: 700, q: 2, langd: 0.06, styrka: 0.5, ut: L.ut }); }, 1100, 1250);
  },
  /** Klocka som tickar. */
  tick(L) {
    let tack = false;
    L.upprepa((t) => { tack = !tack; stot(t, { typ: 'bandpass', frek: tack ? 2600 : 3300, q: 8, langd: 0.02, styrka: 0.6, ut: L.ut }); }, 1000, 1000);
  },
  /** Eld i spis eller öppen spis: varmt brus och knaster. */
  brasa(L) {
    const s = brusKalla(), f = filter('lowpass', 500), g = forstarkning(0.12);
    s.connect(f); f.connect(g); g.connect(L.ut); s.start(); L.noder.push(s);
    L.upprepa((t) => stot(t, { typ: 'highpass', frek: 1500 + Math.random() * 2000, langd: 0.01 + Math.random() * 0.03, styrka: 0.1 + Math.random() * 0.3, ut: L.ut }), 60, 450);
  },
  /** Droppar från takfoten efter regnet. */
  dropp(L) {
    L.upprepa((t) => { const o = ctx.createOscillator(), g = forstarkning(0); const f0 = 1400 + Math.random() * 900;
      o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f0 * 0.6, t + 0.05);
      g.gain.setValueAtTime(0.25, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);
      o.connect(g); g.connect(L.ut); o.start(t); o.stop(t + 0.1); }, 350, 1600);
  },
  /** Vågor mot stranden. */
  hav(L) {
    const s = brusKalla(), f = filter('lowpass', 600), g = forstarkning(0.25);
    s.connect(f); f.connect(g); g.connect(L.ut); s.start(); L.noder.push(s, lfo(0.09, 0.2, g.gain), lfo(0.09, 200, f.frequency));
  },
  /** Fåglar i sommarkvällen. */
  faglar(L) {
    L.upprepa((t) => { const n = 2 + Math.floor(Math.random() * 4), f0 = 2500 + Math.random() * 1500;
      for (let i = 0; i < n; i++) { const o = ctx.createOscillator(), g = forstarkning(0), ti = t + i * 0.12;
        o.frequency.setValueAtTime(f0, ti); o.frequency.exponentialRampToValueAtTime(f0 * 1.4, ti + 0.07);
        g.gain.setValueAtTime(0, ti); g.gain.linearRampToValueAtTime(0.12, ti + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, ti + 0.09);
        o.connect(g); g.connect(L.ut); o.start(ti); o.stop(ti + 0.1); } }, 1200, 4500);
  },
  /** Syrsor i augustikvällen. */
  syrsor(L) {
    L.upprepa((t) => { for (let i = 0; i < 3; i++) { const o = ctx.createOscillator(), g = forstarkning(0), ti = t + i * 0.05;
      o.frequency.value = 4400; g.gain.setValueAtTime(0, ti); g.gain.linearRampToValueAtTime(0.05, ti + 0.005); g.gain.linearRampToValueAtTime(0, ti + 0.03);
      o.connect(g); g.connect(L.ut); o.start(ti); o.stop(ti + 0.04); } }, 700, 1100);
  },
};

/** Namnen som fallens JSON kan använda i `rum.ljud` (kontrolleras av verktyg/validera_fall.mjs). */
export const LJUDTYPER = Object.keys(MILJO);

function startaLager(lista) {
  for (const { typ, styrka = 1 } of lista) {
    const bygg = MILJO[typ];
    if (!bygg) { console.warn('Okänt ljud', typ); continue; }
    const L = nyttLager(0.35 * styrka);
    try { bygg(L); lager.push(L); } catch (e) { console.warn('Ljudet kunde inte startas', typ, e); L.stopp(); }
  }
}
