// 3D-modeller (glTF) som ersätter ett föremåls utseende i förhandsgranskningen 'verklig' (se stil.js).
// Föremålet byggs alltid först som vanligt av sin prefab, så att id, kollision, markör och interaktion är
// desamma. När modellen har laddats döljs prefabens delar – utom de som är märkta `userData.behall` – och
// modellen placeras i prefabens ställe. I den vanliga stilen används fältet inte och inget laddas.
//
// I rummets JSON:  "modell": { "fil": "modeller/gothic_bed_01.glb", "passa": "golv", "rot": [0, 180, 0] }
//   fil     glb-fil i repot (källor och licenser i modeller/KALLOR.md)
//   passa   "box"  – modellens mått sträcks till prefabens mått på alla tre axlar (standard; bra när något
//                    står på föremålet och höjden måste stämma)
//           "golv" – bredd och djup som prefaben, höjden skalas med medelvärdet av dem
//           "skala" – samma skala åt alla håll (fältet skala, standard 1)
//   rot     vridning i grader [x, y, z] (y först i föremålets riktning, sedan x och z), före passningen
//   skala   för passa "skala"; för övriga lägen en extra faktor
//   hanger  true: modellens översta punkt i föremålets origo (för passa "skala") eller prefabens topp – för ljuskronor
//   pos     förskjutning [x, y, z] i föremålets egna koordinater
//   glas    namn på noder eller material vars material byts mot spelets genomskinliga glas (t.ex. ett lampglas som annars blir mörkt)
//   delar   { namn: spec } – byter bara prefabens delar märkta userData.del = namn (t.ex. "stol" i långbordet);
//           spec som ovan; "fil" på översta nivån kan då utelämnas så att resten av prefaben står kvar
//   lyser   namn på noder eller material vars material byts mot ett glödande lyktglas
//   urtavla { nod, tid: [h, m] } – lägger en urtavla som visar rätt tid över modellens urtavla (noden med glaset)
import * as THREE from '../../vendor/three/three.module.min.js';
import { GLTFLoader } from '../../vendor/three/addons/loaders/GLTFLoader.js';
import { DELADE, mat, glas } from './foremal/grund.js';
import * as T from './texturer.js';

const laddare = new GLTFLoader();
const cache = new Map();
const rad = (g) => (g * Math.PI) / 180;

/** Laddar en glb-fil en gång. Geometrier, material och texturer delas mellan rummen och frigörs inte vid rumsbyte. */
export function laddaModell(fil) {
  if (!cache.has(fil)) {
    const p = laddare.loadAsync(fil).then((gltf) => {
      gltf.scene.traverse((o) => {
        if (!o.isMesh) return;
        DELADE.add(o.geometry);
        for (const m of [].concat(o.material)) DELADE.add(m);
      });
      return gltf.scene;
    });
    p.catch(() => cache.delete(fil)); // ett nytt försök nästa gång rummet laddas
    cache.set(fil, p);
  }
  return cache.get(fil);
}

/**
 * Bygger modellen för `spec` och anpassar den till `prefabBox` (prefabens mått i föremålets egna koordinater).
 * Returnerar en grupp i föremålets egna koordinater.
 */
export async function byggModell(spec, prefabBox) {
  const original = await laddaModell(spec.fil);
  const modell = original.clone();
  const [rx = 0, ry = 0, rz = 0] = spec.rot || [];
  modell.rotation.set(rad(rx), rad(ry), rad(rz), 'YXZ');
  const vridd = new THREE.Group(); vridd.add(modell);
  vridd.updateMatrixWorld(true);
  const mb = new THREE.Box3().setFromObject(vridd), ms = mb.getSize(new THREE.Vector3());
  const ps = prefabBox.getSize(new THREE.Vector3());
  const passa = spec.passa || 'box', extra = spec.skala ?? 1;
  let s;
  if (passa === 'box') s = new THREE.Vector3(ps.x / ms.x, ps.y / ms.y, ps.z / ms.z).multiplyScalar(extra);
  else if (passa === 'golv') { const sx = ps.x / ms.x, sz = ps.z / ms.z; s = new THREE.Vector3(sx, (sx + sz) / 2, sz).multiplyScalar(extra); }
  else s = new THREE.Vector3(extra, extra, extra);
  const yttre = new THREE.Group(); yttre.add(vridd);
  vridd.scale.copy(s);
  // Placering: "box" lägger modellens låda i prefabens låda; övriga ställer modellen mitt i prefabens fotavtryck på
  // dess lägsta punkt (för passa "skala" utan prefab-låda: mitt på origo).
  const mitt = mb.getCenter(new THREE.Vector3());
  if (passa === 'box') vridd.position.set(prefabBox.min.x - mb.min.x * s.x, prefabBox.min.y - mb.min.y * s.y, prefabBox.min.z - mb.min.z * s.z);
  else {
    const pc = passa === 'skala' ? new THREE.Vector3(0, 0, 0) : prefabBox.getCenter(new THREE.Vector3()).setY(prefabBox.min.y);
    // hanger: modellen hänger med sin översta punkt i föremålets origo (ljuskronor, origo i taket).
    const y = spec.hanger ? (passa === 'skala' ? 0 : prefabBox.max.y) - mb.max.y * s.y : pc.y - mb.min.y * s.y;
    vridd.position.set(pc.x - mitt.x * s.x, y, pc.z - mitt.z * s.z);
  }
  if (spec.pos) yttre.position.set(...spec.pos);
  // glas/lyser anger noder eller material (glTF-material i samma nät blir egna delnät med materialets namn).
  const byt = (namn, nytt) => { if (!namn?.length) return; modell.traverse((o) => {
    if (!o.isMesh) return;
    let p = o; while (p && !namn.includes(p.name)) p = p.parent === modell.parent ? null : p.parent;
    if (p || namn.includes(o.material?.name)) o.material = nytt();
  }); };
  byt(spec.glas, glas);
  // lyser: lyktglas och liknande som ska glöda (som prefabens lyktor); kastar då ingen skugga.
  byt(spec.lyser, () => mat('#ffe6a8', { emissive: '#d89a3a', transparent: true, opacity: 0.92 }));
  if (spec.urtavla) laggUrtavla(yttre, modell, spec.urtavla);
  return yttre;
}

/** Urtavla med rätt tid strax bakom urglaset, så att modellens egen (fel) tid inte syns. */
function laggUrtavla(yttre, modell, { nod, tid = [12, 0] }) {
  const glasNod = modell.getObjectByName(nod);
  if (!glasNod) { console.warn('Hittar inte urglaset', nod); return; }
  yttre.updateMatrixWorld(true);
  const b = new THREE.Box3().setFromObject(glasNod);
  const inv = new THREE.Matrix4().copy(yttre.matrixWorld).invert();
  b.applyMatrix4(inv);
  const c = b.getCenter(new THREE.Vector3()), st = b.getSize(new THREE.Vector3());
  const d = Math.max(st.x, st.y) * 0.98;
  const tavla = new THREE.Mesh(new THREE.CircleGeometry(d / 2, 32), mat('#ffffff', { map: T.urtavlaTid(tid[0], tid[1]) }));
  tavla.position.set(c.x, c.y, b.min.z - 0.001);
  yttre.add(tavla);
}

/** Lådan runt en del (t.ex. en stol i långbordet) i delens egna koordinater. */
function lokalBox(del) {
  del.updateWorldMatrix(true, true);
  const inv = new THREE.Matrix4().copy(del.matrixWorld).invert(), m4 = new THREE.Matrix4(), b = new THREE.Box3();
  del.traverse((o) => {
    if (!o.isMesh) return;
    if (!o.geometry.boundingBox) o.geometry.computeBoundingBox();
    b.union(o.geometry.boundingBox.clone().applyMatrix4(m4.multiplyMatrices(inv, o.matrixWorld)));
  });
  return b;
}
function dolj(rot) {
  rot.traverse((o) => {
    if (!o.isMesh || o.userData.behall) return;
    o.visible = false; o.layers.set(31); // syns inte och träffas inte av strålar (layer 31 används inte)
  });
}

/**
 * Byter utseende på föremålet `g` (redan placerat i scenen). `prefabBox` är prefabens låda i föremålets egna
 * koordinater. Med `modell.fil` ersätts hela föremålet; med `modell.delar` ({ namn: spec }) ersätts bara de
 * delar som prefaben har märkt med `userData.del = namn` (t.ex. stolarna runt långbordet), var och en anpassad
 * till sin egen låda. `arLampa`: föremålet är en ljuskälla, och modellen ska då inte kasta skugga (som
 * prefabens lampdelar). Returnerar false om någon modell inte gick att ladda – då står den delen av prefaben kvar.
 */
export async function ersattMedModell(g, def, prefabBox, { arLampa = false } = {}) {
  const spec = def.modell;
  const forbered = (m) => {
    m.traverse((o) => {
      if (!o.isMesh) return;
      const mt = Array.isArray(o.material) ? o.material[0] : o.material;
      const lyser = mt?.emissive && (mt.emissive.r + mt.emissive.g + mt.emissive.b) > 0.3;
      o.castShadow = !arLampa && !mt?.transparent && !lyser;
      o.receiveShadow = true;
      if (def.interaktiv || def.funktion || def.gar_till) o.userData.interaktivId = def.id;
    });
    return m;
  };
  const jobb = [];
  if (spec.fil) jobb.push(byggModell(spec, prefabBox).then((m) => { dolj(g); g.add(forbered(m)); }));
  for (const [namn, delspec] of Object.entries(spec.delar || {})) {
    const delar = [];
    g.traverse((o) => { if (o.userData.del === namn) delar.push(o); });
    for (const del of delar) jobb.push(byggModell(delspec, lokalBox(del)).then((m) => { dolj(del); del.add(forbered(m)); }));
  }
  const res = await Promise.allSettled(jobb);
  const fel = res.find((r) => r.status === 'rejected');
  if (fel) { console.warn('Kunde inte ladda modellen', spec.fil || Object.keys(spec.delar || {}), fel.reason); return false; }
  return true;
}
