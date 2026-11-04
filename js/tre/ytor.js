// Riktiga texturer för golv, väggar, panel och tak i förhandsgranskningen 'verklig' (se stil.js).
// Fotograferade PBR-texturer från Poly Haven (CC0, källor i texturer/KALLOR.md). Rummet byggs först med
// spelets egna canvastexturer; när de här har laddats byts trägolvet ut och väggar, panel och tak får relief
// och matthetsvariation. Rummets färger behålls: golvtexturen färgas mot rummets golvfärg, och tapetens
// mönster ligger kvar med putsens struktur under.
import * as THREE from '../../vendor/three/three.module.min.js';

const laddare = new THREE.TextureLoader();
const cache = new Map();
function tex(namn, { farg = false } = {}) {
  if (!cache.has(namn)) {
    const p = laddare.loadAsync(`texturer/${namn}.webp`).then((t) => {
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.colorSpace = farg ? THREE.SRGBColorSpace : THREE.NoColorSpace;
      t.anisotropy = 4;
      return t;
    });
    p.catch(() => cache.delete(namn));
    cache.set(namn, p);
  }
  return cache.get(namn);
}
/** En kopia med egen upprepning; bilden delas (three.js laddar upp samma källa en gång). */
function upprepad(t, rx, ry) { const k = t.clone(); k.repeat.set(rx, ry); k.needsUpdate = true; return k; }

// Golvsorter: textur, storlek i meter som texturen täcker, och texturens medelfärg (sRGB) för färgningen.
const GOLV = {
  plankor: { namn: 'wood_floor_worn', meter: 2, medel: [137, 88, 47] },
  fiskben: { namn: 'herringbone_parquet', meter: 3.4, medel: [147, 112, 77] },
  sten: { namn: 'floor_tiles_06', meter: 2 }, // schackrutiga kalkstensplattor; behåller sin egen färg
  hallar: { namn: 'rock_tile_floor_02', meter: 2.4 }, // grova stenhällar (t.ex. ett fyrtorn)
  jarn: { namn: 'metal_plate_02', meter: 2, metall: 0.5, ton: 0.6 }, // nitade järnplåtar, mörkare än fotot
};
// Golvsort som standard för rummets golvtyp; rum.verklig_golv väljer en annan.
const STANDARDGOLV = { tra: 'plankor', sten: 'sten', jarn: 'jarn' };
const PUTS = { namn: 'plastered_wall_04', meter: 3.2 };
const TRA = { namn: 'dark_wood', meter: 2, medel: [93, 43, 24] };
// Väggsorter som ersätter rummets väggar helt. lodratt: texturen vrids 90°. farg: rummets färg som texturen färgas mot.
const VAGG = {
  tra: { ...TRA, meter: 1.2, lodratt: true, farg: (r) => r.tapet?.grund || '#6a3a24', ton: 0.8, matt: 0.6, relief: 0.5 }, // fanér
  sten: { namn: 'castle_wall_slates', meter: 2.2, matt: 1, relief: 1 }, // natursten med kalkbruk; egen färg
  plankor: { namn: 'brown_planks_05', meter: 1.6, medel: [154, 148, 136], farg: (r) => r.panelfarg || '#8a6a48', ton: 0.8, matt: 0.9, relief: 0.6 }, // liggande panel
};
// Väggsort som standard för rummets väggtyp (rum.vagg); rum.verklig_vagg väljer en annan.
const STANDARDVAGG = { sten: 'sten', trapanel: 'plankor' };
const golvSort = (rum) => {
  const typ = typeof rum.golv === 'object' ? rum.golv.typ : 'tra';
  return STANDARDGOLV[typ] ? GOLV[rum.verklig_golv] || GOLV[STANDARDGOLV[typ]] : null;
};
const vaggSort = (rum) => VAGG[rum.verklig_vagg || STANDARDVAGG[rum.vagg]] || null;

/** Färgton som får en textur med medelfärgen `medel` (sRGB 0–255) att i genomsnitt få färgen `farg` (linjärt). */
function ton(farg, medel) {
  const o = new THREE.Color(farg), m = new THREE.Color().setRGB(...medel.map((x) => x / 255), THREE.SRGBColorSpace);
  return new THREE.Color(Math.min(2.5, o.r / m.r), Math.min(2.5, o.g / m.g), Math.min(2.5, o.b / m.b));
}

/**
 * ytor: { golv (mesh), vaggar (meshar), vagg (material för tapet/puts), panel (material), tak (mesh) } – det som finns i rummet.
 * Golv: trägolv blir plankor, stengolv kalkstensplattor och järngolv nitad plåt; rum.verklig_golv väljer en annan sort
 * ("plankor", "fiskben", "sten", "hallar" eller "jarn").
 * Väggar: stenväggar (rum.vagg "sten") blir natursten och träpanel (rum.vagg "trapanel") liggande panel; rum.verklig_vagg
 * "tra" ger fanérade träväggar i stället för tapet. Tapet och puts behåller sitt mönster med putsstruktur under.
 */
/** Hämtar texturerna ett rum kommer att behöva (för rum man kan gå till härnäst). */
export function forladdaYtor(rum) {
  if (rum.miljo === 'ute' || rum.miljo === 'veranda') return;
  const namn = [PUTS.namn + '_nor', PUTS.namn + '_rough', TRA.namn + '_nor', TRA.namn + '_rough'];
  for (const s of [golvSort(rum), vaggSort(rum)]) if (s) { namn.push(s.namn + '_nor', s.namn + '_rough'); tex(s.namn + '_diff', { farg: true }).catch(() => {}); }
  for (const n of namn) tex(n).catch(() => {});
}

export async function forbattraYtor(ytor, rum, W, D, golvFarg) {
  const jobb = [];
  const g = ytor.golv && golvSort(rum);
  if (g) {
    jobb.push(Promise.all([tex(g.namn + '_diff', { farg: true }), tex(g.namn + '_nor'), tex(g.namn + '_rough')]).then(([d, n, r]) => {
      const rx = W / g.meter, ry = D / g.meter;
      // Färga mot rummets golvfärg: förhållandet mellan önskad färg och texturens medelfärg (linjärt).
      // Matta PBR-plankor ser ljusare ut än canvasgolvet; 0,75 håller rummets ton.
      const t = g.medel ? ton(golvFarg || '#6b4a2c', g.medel).multiplyScalar(0.75) : new THREE.Color('#ffffff').multiplyScalar(g.ton ?? 1);
      const m = new THREE.MeshStandardMaterial({ color: t, map: upprepad(d, rx, ry), normalMap: upprepad(n, rx, ry), roughnessMap: upprepad(r, rx, ry), roughness: 1, metalness: g.metall || 0 });
      m.normalScale.set(0.8, 0.8);
      ytor.golv.material = m; // det gamla golvmaterialet kommer ur den delade cachen och ligger kvar
    }));
  }
  // Väggar som byts helt: fanér (t.ex. sovvagnar, färgat mot tapetens grundfärg), natursten och träpanel (färgad mot panelens färg).
  const v = ytor.vaggar?.length && vaggSort(rum);
  if (v) {
    jobb.push(Promise.all([tex(v.namn + '_diff', { farg: true }), tex(v.namn + '_nor'), tex(v.namn + '_rough')]).then(([d, n, r]) => {
      // Väggarnas UV upprepas var 1,1 m (stenväggar var 2,2 m); texturen täcker v.meter.
      const k = (rum.vagg === 'sten' ? 2.2 : 1.1) / v.meter;
      const vrid = (t) => { if (v.lodratt) { t.center.set(0.5, 0.5); t.rotation = Math.PI / 2; } return t; };
      const farg = v.medel ? ton(v.farg(rum), v.medel).multiplyScalar(v.ton) : new THREE.Color('#ffffff');
      const m = new THREE.MeshStandardMaterial({ color: farg, map: vrid(upprepad(d, k, k)), normalMap: vrid(upprepad(n, k, k)), roughnessMap: vrid(upprepad(r, k, k)), roughness: v.matt, metalness: 0 });
      m.normalScale.set(v.relief, v.relief);
      for (const vagg of ytor.vaggar) vagg.material = m; // eget material för rummet; frigörs vid rumsbyte
    }));
  }
  // Väggmaterialen kommer ur den delade cachen i foremal/grund.js; de ändras en gång och behåller ändringen.
  if (ytor.vagg && !v && !ytor.vagg.userData.ytor) {
    jobb.push(Promise.all([tex(PUTS.namn + '_nor'), tex(PUTS.namn + '_rough')]).then(([n, r]) => {
      const m = ytor.vagg, k = 1.1 / PUTS.meter; // väggarnas UV upprepas var 1,1 m
      m.userData.ytor = true;
      m.normalMap = upprepad(n, k, k); m.normalScale.set(0.6, 0.6);
      m.roughnessMap = upprepad(r, k, k); m.roughness = 1;
      m.bumpScale = 1.5; // tapetmönstrets egen relief, svagare när putsen ger strukturen
      m.needsUpdate = true;
    }));
  }
  if (ytor.panel && !ytor.panel.userData.ytor) {
    jobb.push(Promise.all([tex(TRA.namn + '_nor'), tex(TRA.namn + '_rough')]).then(([n, r]) => {
      const m = ytor.panel, k = 1.6 / TRA.meter; // panelens UV upprepas var 1,6 m
      m.userData.ytor = true;
      m.normalMap = upprepad(n, k, 1); m.normalScale.set(0.5, 0.5);
      m.roughnessMap = upprepad(r, k, 1); m.roughness = 0.9;
      m.needsUpdate = true;
    }));
  }
  if (ytor.tak) {
    jobb.push(tex(PUTS.namn + '_nor').then((n) => {
      const m = ytor.tak.material.clone(); // taket delar material med andra rum; klona och sätt rummets mått
      m.normalMap = upprepad(n, W / PUTS.meter, D / PUTS.meter); m.normalScale.set(0.5, 0.5);
      ytor.tak.material = m;
    }));
  }
  await Promise.all(jobb);
  return true;
}
