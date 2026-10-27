// Datadriven förstapersonsscen. Ett rum beskrivs helt i fallets JSON (moment.payload.rum).
import * as THREE from 'three';
import { prefabs, mat } from './prefabs.js';
import './prefabs2.js';
import * as T from './texturer.js';
import { Kontroller } from './kontroller.js';

const OGONHOJD = 1.6, RADIE = 0.28, FART = 1.7, MAX_AVSTAND = 3.4;
const rad = (g) => (g * Math.PI) / 180;
function uvSkala(geo, sx, sy) {
  const uv = geo.attributes.uv;
  for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * sx, uv.getY(i) * sy);
  return geo;
}

export class Rum3D {
  constructor(behallare, { onInspektera, onMeddelande, onFokus } = {}) {
    this.behallare = behallare;
    this.onInspektera = onInspektera; this.onMeddelande = onMeddelande; this.onFokus = onFokus;
    this.fokus = null; this.onRam = null; this._v = new THREE.Vector3();
    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.renderer.domElement.className = 'rum3d-canvas';
    behallare.appendChild(this.renderer.domElement);
    this.kamera = new THREE.PerspectiveCamera(68, 1, 0.05, 60);
    this.kamera.rotation.order = 'YXZ';
    this.yaw = 0; this.pitch = 0;
    this.raycaster = new THREE.Raycaster();
    this.interaktiva = new Map();
    this.flimmer = [];
    this.kollisioner = [];
    this.forraT = 0; this.tid = 0;
    this.kor = false;
    this.fps = 0; this._ramar = 0; this._fpsT = 0;

    const joy = document.createElement('div'); joy.className = 'joystick';
    const knopp = document.createElement('div'); knopp.className = 'joystick-knopp'; joy.appendChild(knopp);
    behallare.appendChild(joy);
    this.kontroller = new Kontroller(this.renderer.domElement, { joystick: joy, knopp, onTap: (x, y) => this.tryck(x, y) });

    this._resize = () => this.anpassa();
    this.ro = new ResizeObserver(this._resize); this.ro.observe(behallare);
    this.anpassa();
    this._loop = this.loop.bind(this);
  }

  anpassa() {
    const w = this.behallare.clientWidth || 1, h = this.behallare.clientHeight || 1;
    this.renderer.setSize(w, h, false);
    this.kamera.aspect = w / h;
    // Sikta på ca 60° horisontellt synfält, men högst 100° vertikalt (porträttläge)
    const asp = w / h;
    const vert = (2 * Math.atan(Math.tan(rad(30)) / asp) * 180) / Math.PI;
    this.kamera.fov = Math.max(60, Math.min(100, vert));
    this.kamera.updateProjectionMatrix();
  }

  /** Bygger rummet från JSON. `inspekterade` = id:n som redan undersökts. */
  ladda(rum, { inspekterade = new Set(), position = null } = {}) {
    this.rensa();
    this.rum = rum;
    const scen = (this.scen = new THREE.Scene());
    const W = rum.bredd, D = rum.djup, H = rum.hojd || 3;
    const ljus = rum.ljus || {};
    const veranda = rum.miljo === 'veranda';
    scen.background = new THREE.Color(rum.bakgrund || (veranda ? '#e9cfa0' : '#1a120a'));
    const dimma = rum.dimma || [];
    scen.fog = new THREE.Fog(dimma[2] || rum.bakgrund || (veranda ? '#e9cfa0' : '#24170c'), dimma[0] ?? (veranda ? 14 : 7), dimma[1] ?? (veranda ? 40 : 16));
    scen.add(new THREE.HemisphereLight(ljus.omgivning || '#ffe2b8', '#3a2414', ljus.omgivning_styrka ?? 0.6));
    scen.add(new THREE.AmbientLight('#ffdcae', ljus.bas ?? 0.25));
    if (veranda) { const sol = new THREE.DirectionalLight('#ffd49a', ljus.sol ?? 1.4); sol.position.set(4, 5, -8); scen.add(sol); }

    // Golv och tak
    const golvTyp = typeof rum.golv === 'object' ? rum.golv.typ : 'tra';
    const golvFarg = typeof rum.golv === 'object' ? rum.golv.farg : rum.golv;
    const gtex = golvTyp === 'sten' ? T.sten([W / 1.2, D / 1.2]) : T.traGolv(golvFarg || '#6b4a2c', [W / 2.2, D / 2.2]);
    const golv = new THREE.Mesh(new THREE.PlaneGeometry(W, D), mat('#ffffff', { map: gtex }));
    golv.rotation.x = -Math.PI / 2; scen.add(golv);

    if (veranda) this.byggVeranda(rum, W, D, H);
    else {
      const tak = new THREE.Mesh(new THREE.PlaneGeometry(W, D), mat('#ffffff', { map: T.tak() }));
      tak.rotation.x = Math.PI / 2; tak.position.y = H; scen.add(tak);
      const tapet = mat('#ffffff', { map: T.tapet(rum.tapet?.grund, rum.tapet?.monster) });
      const pan = mat('#ffffff', { map: T.panel(rum.panel || '#5a3b22') });
      const sidor = [
        [W, [0, -D / 2], 0], [W, [0, D / 2], Math.PI], [D, [-W / 2, 0], Math.PI / 2], [D, [W / 2, 0], -Math.PI / 2],
      ];
      for (const [L, [x, z], ry] of sidor) {
        const v = new THREE.Mesh(uvSkala(new THREE.PlaneGeometry(L, H), L / 1.1, H / 1.1), tapet);
        v.position.set(x, H / 2, z); v.rotation.y = ry; scen.add(v);
        const p = new THREE.Mesh(uvSkala(new THREE.BoxGeometry(L, 0.9, 0.03), L / 1.6, 1), pan);
        p.position.set(x, 0.45, z); p.rotation.y = ry; p.translateZ(0.015); scen.add(p);
        const list = new THREE.Mesh(new THREE.BoxGeometry(L, 0.1, 0.06), mat('#3a2412'));
        list.position.set(x, H - 0.05, z); list.rotation.y = ry; list.translateZ(0.03); scen.add(list);
      }
    }

    // Föremål
    const ctx = { ljus: (grupp, pos, farg, styrka, avst, flimrar) => {
      const l = new THREE.PointLight(farg, styrka, avst, 1.6); l.position.copy(pos); grupp.add(l);
      if (flimrar) this.flimmer.push({ l, bas: styrka, fas: Math.random() * 10 });
    } };
    for (const def of rum.objekt || []) {
      const fab = prefabs[def.typ];
      if (!fab) { console.warn('Okänd föremålstyp', def.typ); continue; }
      const res = fab(def, ctx);
      const g = res.grupp;
      const [x, y, z] = def.pos || [0, 0, 0];
      g.position.set(x, y || 0, z);
      g.rotation.y = rad(def.rot || 0);
      if (def.skala) g.scale.setScalar(def.skala);
      scen.add(g);
      g.updateMatrixWorld(true);
      const kollidera = def.kollision ?? res.kollision ?? true;
      if (kollidera) {
        const b = new THREE.Box3().setFromObject(g);
        if (b.min.y < 1.5) this.kollisioner.push({ minX: b.min.x, maxX: b.max.x, minZ: b.min.z, maxZ: b.max.z });
      }
      if (def.interaktiv || def.funktion || def.gar_till) {
        g.traverse((o) => { o.userData.interaktivId = def.id; });
        const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: T.glod(), blending: THREE.AdditiveBlending, depthWrite: false, depthTest: false, transparent: true }));
        let hp = res.haloPos;
        if (!hp) { const b = new THREE.Box3().setFromObject(g); hp = b.getCenter(new THREE.Vector3()); }
        else hp = g.localToWorld(hp.clone()); // haloPos anges i föremålets egna koordinater
        if (def.halo) hp.set(def.halo[0], def.halo[1], def.halo[2]);
        halo.position.copy(hp); halo.renderOrder = 10;
        halo.userData.interaktivId = def.id;
        halo.userData.bas = def.halostorlek ?? (def.funktion === 'anteckningsbok' ? 0.42 : 0.32);
        scen.add(halo);
        this.interaktiva.set(def.id, { def, grupp: g, halo, inspekterad: inspekterade.has(def.id) });
      }
    }
    const start = position || rum.start || { pos: [0, 0], titta: 0 };
    this.flyttaTill(start.pos[0], start.pos[1], start.titta || 0);
    this.anpassa();
  }

  byggVeranda(rum, W, D, H) {
    const scen = this.scen;
    // Husvägg i söder
    const vagg = new THREE.Mesh(uvSkala(new THREE.PlaneGeometry(W, H), W / 1.6, 1), mat('#ffffff', { map: T.panel(rum.panel || '#d9ccb0') }));
    vagg.position.set(0, H / 2, D / 2); vagg.rotation.y = Math.PI; scen.add(vagg);
    // Räcke runt övriga sidor
    const rack = (L, x, z, ry) => { const g = prefabs.racke({ langd: L }).grupp; g.position.set(x, 0, z); g.rotation.y = ry; scen.add(g); };
    rack(W, 0, -D / 2, 0); rack(D, -W / 2, 0, Math.PI / 2); rack(D, W / 2, 0, Math.PI / 2);
    // Pelare och tak
    const pel = mat('#e8e0cc');
    for (const [x, z] of [[-W / 2, -D / 2], [W / 2, -D / 2]]) { const p = new THREE.Mesh(new THREE.BoxGeometry(0.2, H, 0.2), pel); p.position.set(x, H / 2, z); scen.add(p); }
    const tak = new THREE.Mesh(new THREE.BoxGeometry(W + 0.4, 0.1, D + 0.4), mat('#cbbd9e')); tak.position.set(0, H, 0); scen.add(tak);
    // Utsikt: trädgård, fjärd och himmel
    const mark = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), mat('#56603a')); mark.rotation.x = -Math.PI / 2; mark.position.y = -0.4; scen.add(mark);
    const geo = new THREE.CylinderGeometry(18, 18, 14, 32, 1, true, Math.PI * 0.5, Math.PI);
    const pano = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ map: T.utsikt(), side: THREE.BackSide, fog: false }));
    pano.position.set(0, 3.5, 2); scen.add(pano);
    for (let i = 0; i < 9; i++) {
      const b = new THREE.Mesh(new THREE.SphereGeometry(0.9 + (i % 3) * 0.3, 8, 6), mat('#4b5a30'));
      b.position.set(-8 + i * 2, 0.2, -D / 2 - 2.5 - (i % 2)); scen.add(b);
    }
  }

  flyttaTill(x, z, tittaGrader = null) {
    this.kamera.position.set(x, OGONHOJD, z);
    if (tittaGrader !== null) { this.yaw = rad(tittaGrader); this.pitch = this.kamera.aspect < 0.8 ? -0.22 : -0.1; }
    this.uppdateraKamera();
  }
  uppdateraKamera() { this.kamera.rotation.y = this.yaw; this.kamera.rotation.x = this.pitch; }
  position() { return { pos: [+this.kamera.position.x.toFixed(2), +this.kamera.position.z.toFixed(2)], titta: +((this.yaw * 180) / Math.PI).toFixed(1) }; }

  kolliderar(x, z) {
    const W = this.rum.bredd / 2 - RADIE, D = this.rum.djup / 2 - RADIE;
    if (x < -W || x > W || z < -D || z > D) return true;
    for (const b of this.kollisioner) if (x > b.minX - RADIE && x < b.maxX + RADIE && z > b.minZ - RADIE && z < b.maxZ + RADIE) return true;
    return false;
  }

  stega(dt) {
    const s = this.kontroller.las();
    const kanslighet = 0.0045;
    this.yaw -= s.tittaX * kanslighet + -s.vrid * dt * 1.8;
    this.pitch = Math.max(-1.1, Math.min(0.9, this.pitch - s.tittaY * kanslighet));
    this.uppdateraKamera();
    if (s.fram || s.sida) {
      const fx = -Math.sin(this.yaw), fz = -Math.cos(this.yaw);
      const hx = Math.cos(this.yaw), hz = -Math.sin(this.yaw);
      const dx = (fx * s.fram + hx * s.sida) * FART * dt, dz = (fz * s.fram + hz * s.sida) * FART * dt;
      const p = this.kamera.position;
      if (!this.kolliderar(p.x + dx, p.z)) p.x += dx;
      if (!this.kolliderar(p.x, p.z + dz)) p.z += dz;
    }
  }

  tryck(nx, ny) {
    if (!this.scen) return;
    this.raycaster.setFromCamera(new THREE.Vector2(nx * 2 - 1, -(ny * 2 - 1)), this.kamera);
    const traffar = this.raycaster.intersectObjects(this.scen.children, true);
    let valt = null;
    const forsta = traffar.find((t) => !t.object.isSprite && t.object.material?.opacity !== 0);
    for (const t of traffar) {
      if (!t.object.userData.interaktivId) continue;
      if (t.object.isSprite || !forsta || t.distance <= forsta.distance + 0.35) { valt = t; break; }
    }
    let id = valt?.object.userData.interaktivId;
    if (!id) {
      // Generös träffyta: närmaste glimmande föremål inom ca 48 px från trycket
      const w = this.behallare.clientWidth || 1, h = this.behallare.clientHeight || 1;
      let bast = 48;
      for (const [pid, p] of this.interaktiva) {
        const v = this._v.copy(p.halo.position).project(this.kamera);
        if (v.z > 1) continue;
        const dx = ((v.x + 1) / 2 - nx) * w, dy = ((1 - v.y) / 2 - ny) * h;
        const d = Math.hypot(dx, dy);
        if (d < bast) { bast = d; id = pid; }
      }
    }
    if (!id) return;
    const post = this.interaktiva.get(id);
    const centrum = new THREE.Box3().setFromObject(post.grupp).getCenter(new THREE.Vector3());
    const avst = Math.hypot(centrum.x - this.kamera.position.x, centrum.z - this.kamera.position.z);
    const maxA = this.maxAvstand(post.def);
    if (avst > maxA && (!valt || valt.distance > maxA)) { this.onMeddelande?.('Gå närmare för att undersöka.'); return; }
    this.onInspektera?.(post.def);
  }

  maxAvstand(def) { return def.avstand ?? (def.typ === 'fotspar' ? 4 : MAX_AVSTAND); }

  /** Väljer det föremål spelaren tittar mot och står nära (för knappen Undersök och starkare glöd). */
  raknaFokus() {
    let bast = null, bastS = Infinity;
    const k = this.kamera.position;
    for (const p of this.interaktiva.values()) {
      const c = p.halo.position;
      const d = Math.hypot(c.x - k.x, c.z - k.z);
      p.nara = d <= this.maxAvstand(p.def) + 0.2;
      if (!p.nara) continue;
      const v = this._v.copy(c).project(this.kamera);
      if (v.z > 1 || Math.abs(v.x) > 0.72 || Math.abs(v.y) > 0.8) continue;
      const s = Math.hypot(v.x, v.y * 0.8) + d * 0.12 + (p.inspekterad && !p.def.funktion && !p.def.gar_till ? 0.3 : 0);
      if (s < bastS) { bastS = s; bast = p; }
    }
    if (bast !== this.fokus) { this.fokus = bast; this.onFokus?.(bast ? bast.def : null); }
  }

  markera(id) { const p = this.interaktiva.get(id); if (p) p.inspekterad = true; }

  /** Testkrok: skärmkoordinater (0–1) för ett föremåls halo. */
  projicera(id) {
    const p = this.interaktiva.get(id); if (!p) return null;
    const v = p.halo.position.clone().project(this.kamera);
    return { x: (v.x + 1) / 2, y: (1 - v.y) / 2, synlig: v.z < 1 && Math.abs(v.x) < 1 && Math.abs(v.y) < 1 };
  }
  /** Riktning till ett föremål: vinkel i radianer (positiv = till höger), skärmläge och om det syns. */
  riktning(id) {
    const p = this.interaktiva.get(id); if (!p) return null;
    this.kamera.updateMatrixWorld();
    const c = p.halo.position.clone().applyMatrix4(this.kamera.matrixWorldInverse);
    const vinkel = Math.atan2(c.x, -c.z);
    const v = p.halo.position.clone().project(this.kamera);
    const k = this.kamera.position;
    return { vinkel, x: (v.x + 1) / 2, y: (1 - v.y) / 2, synlig: v.z < 1 && Math.abs(v.x) < 0.95 && Math.abs(v.y) < 0.95, avstand: Math.hypot(p.halo.position.x - k.x, p.halo.position.z - k.z), nara: !!p.nara };
  }
  /** Vänd blicken mot ett föremål. */
  tittaPa(id) {
    const p = this.interaktiva.get(id); if (!p) return;
    const c = p.halo.position, k = this.kamera.position;
    this.yaw = Math.atan2(-(c.x - k.x), -(c.z - k.z));
    this.pitch = Math.atan2(c.y - k.y, Math.hypot(c.x - k.x, c.z - k.z));
    this.uppdateraKamera();
  }

  starta() { if (this.kor) return; this.kor = true; this.kontroller.aktiv = true; this.forraT = performance.now(); requestAnimationFrame(this._loop); }
  pausa() { this.kor = false; this.kontroller.aktiv = false; this.kontroller.nollstall(); }

  loop() {
    if (!this.kor || !this.scen) return;
    const nu = performance.now();
    const dt = Math.min((nu - this.forraT) / 1000, 0.05);
    this.forraT = nu; this.tid += dt;
    const t = this.tid;
    this.stega(dt);
    for (const f of this.flimmer) f.l.intensity = f.bas * (0.86 + 0.1 * Math.sin(t * 9 + f.fas) + 0.06 * Math.sin(t * 23 + f.fas * 2));
    this.raknaFokus();
    for (const post of this.interaktiva.values()) {
      const { halo, inspekterad, def, nara } = post;
      const bas = halo.userData.bas;
      const p = 0.5 + 0.5 * Math.sin(t * 2.6 + bas * 40);
      const klar = inspekterad && def.funktion !== 'anteckningsbok' && !def.gar_till;
      if (post === this.fokus) { halo.scale.setScalar(bas * (klar ? 1.2 : 1.75 + 0.3 * p)); halo.material.opacity = klar ? 0.7 : 1; }
      else if (klar) { halo.scale.setScalar(bas * 0.6); halo.material.opacity = 0.3; }
      else if (nara) { halo.scale.setScalar(bas * (1.15 + 0.4 * p)); halo.material.opacity = 0.7 + 0.3 * p; }
      else { halo.scale.setScalar(bas * (0.85 + 0.35 * p)); halo.material.opacity = 0.55 + 0.4 * p; }
    }
    this.onRam?.();
    this.renderer.render(this.scen, this.kamera);
    this._ramar++;
    if (t - this._fpsT >= 1) { this.fps = this._ramar / (t - this._fpsT); this._ramar = 0; this._fpsT = t; window.__fps = this.fps; }
    requestAnimationFrame(this._loop);
  }

  rensa() {
    if (this.fokus) { this.fokus = null; this.onFokus?.(null); }
    this.interaktiva.clear(); this.flimmer = []; this.kollisioner = [];
    this.scen = null;
  }
  forstor() {
    this.pausa(); this.rensa(); this.ro.disconnect(); this.kontroller.forstor();
    this.renderer.dispose(); this.renderer.forceContextLoss?.();
    this.behallare.innerHTML = '';
  }
}
