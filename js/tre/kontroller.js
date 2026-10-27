// Förstapersonskontroller: vänster tumme = joystick, dra höger = titta, kort tryck = undersök.
// Skrivbord: WASD/piltangenter + dra med musen, klick = undersök.
export class Kontroller {
  constructor(yta, { joystick, knopp, onTap }) {
    this.yta = yta; this.joyEl = joystick; this.knoppEl = knopp; this.onTap = onTap;
    this.rorelse = { x: 0, y: 0 }; this.titta = { x: 0, y: 0 }; this.vrid = 0;
    this.tangenter = new Set();
    this.pekare = new Map();
    this.aktiv = true;
    this._ned = this.ned.bind(this); this._flytt = this.flytt.bind(this); this._upp = this.upp.bind(this);
    this._tn = (e) => { if (this.ignoreraTangent(e)) return; this.tangenter.add(e.code); };
    this._tu = (e) => this.tangenter.delete(e.code);
    yta.addEventListener('pointerdown', this._ned);
    window.addEventListener('pointermove', this._flytt);
    window.addEventListener('pointerup', this._upp);
    window.addEventListener('pointercancel', this._upp);
    window.addEventListener('keydown', this._tn);
    window.addEventListener('keyup', this._tu);
    window.addEventListener('blur', () => this.tangenter.clear());
  }
  ignoreraTangent(e) { const t = e.target?.tagName; return t === 'INPUT' || t === 'TEXTAREA' || !this.aktiv; }

  ned(e) {
    if (!this.aktiv) return;
    e.preventDefault();
    try { this.yta.setPointerCapture?.(e.pointerId); } catch { /* syntetiska händelser */ }
    const r = this.yta.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    const joystick = e.pointerType !== 'mouse' && x < r.width * 0.42 && ![...this.pekare.values()].some((p) => p.joystick);
    const p = { id: e.pointerId, sx: e.clientX, sy: e.clientY, lx: e.clientX, ly: e.clientY, t: performance.now(), joystick, flyttat: 0 };
    this.pekare.set(e.pointerId, p);
    if (joystick) {
      this.joyEl.style.left = x + 'px'; this.joyEl.style.top = y + 'px';
      this.joyEl.classList.add('synlig');
      this.knoppEl.style.transform = 'translate(-50%,-50%)';
    }
  }
  flytt(e) {
    const p = this.pekare.get(e.pointerId);
    if (!p) return;
    const dx = e.clientX - p.lx, dy = e.clientY - p.ly;
    p.flyttat += Math.abs(dx) + Math.abs(dy);
    p.lx = e.clientX; p.ly = e.clientY;
    if (p.joystick) {
      const R = 50;
      let jx = e.clientX - p.sx, jy = e.clientY - p.sy;
      const l = Math.hypot(jx, jy); if (l > R) { jx *= R / l; jy *= R / l; }
      this.knoppEl.style.transform = `translate(calc(-50% + ${jx}px), calc(-50% + ${jy}px))`;
      this.rorelse.x = jx / R; this.rorelse.y = -jy / R;
    } else {
      this.titta.x += dx; this.titta.y += dy;
    }
  }
  upp(e) {
    const p = this.pekare.get(e.pointerId);
    if (!p) return;
    this.pekare.delete(e.pointerId);
    if (p.joystick) {
      this.rorelse.x = 0; this.rorelse.y = 0; this.joyEl.classList.remove('synlig');
      if (p.flyttat < 10 && performance.now() - p.t < 350) this.tap(p);
    } else if (p.flyttat < 10 && performance.now() - p.t < 450) this.tap(p);
  }
  tap(p) {
    const r = this.yta.getBoundingClientRect();
    this.onTap?.((p.sx - r.left) / r.width, (p.sy - r.top) / r.height);
  }
  /** Rörelse: {fram, sida} i [-1,1] från joystick + tangenter. */
  las() {
    const k = this.tangenter;
    let fram = this.rorelse.y, sida = this.rorelse.x;
    if (k.has('KeyW') || k.has('ArrowUp')) fram += 1;
    if (k.has('KeyS') || k.has('ArrowDown')) fram -= 1;
    if (k.has('KeyA')) sida -= 1;
    if (k.has('KeyD')) sida += 1;
    let vrid = 0;
    if (k.has('ArrowLeft') || k.has('KeyQ')) vrid += 1;
    if (k.has('ArrowRight') || k.has('KeyE')) vrid -= 1;
    const t = { ...this.titta }; this.titta.x = 0; this.titta.y = 0;
    return { fram: Math.max(-1, Math.min(1, fram)), sida: Math.max(-1, Math.min(1, sida)), tittaX: t.x, tittaY: t.y, vrid };
  }
  nollstall() { this.pekare.clear(); this.rorelse.x = this.rorelse.y = 0; this.tangenter.clear(); this.joyEl.classList.remove('synlig'); }
  forstor() {
    this.yta.removeEventListener('pointerdown', this._ned);
    window.removeEventListener('pointermove', this._flytt);
    window.removeEventListener('pointerup', this._upp);
    window.removeEventListener('pointercancel', this._upp);
    window.removeEventListener('keydown', this._tn);
    window.removeEventListener('keyup', this._tu);
  }
}
