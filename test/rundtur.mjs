// Visuell rundtur: node test/rundtur.mjs <fall-id> <prefix> — skärmbild från startpunkten och mot varje interaktivt föremål i alla rum.
import { startaWebblasare, nySida, startaFall, bild, vanta, rapporteraFel } from './hjalp.mjs';
const [id, pre = 'tur'] = process.argv.slice(2);
const b = await startaWebblasare();
const p = await nySida(b, true, 'tur');
await startaFall(p, id);
const rum = await p.evaluate(() => window.__detektiv.f.moment.filter((m) => m.payload?.visning === '3d').map((m) => ({ id: m.id, obj: m.payload.rum.objekt.filter((o) => o.interaktiv).map((o) => o.id) })));
for (const r of rum) {
  await p.evaluate((rid) => { const d = window.__detektiv; for (const m of d.f.moment) for (const x of m.last_upp_av || []) if (!d.st.fynd.includes(x)) (d.st.material ||= []).push(x); d.byt(rid); }, r.id);
  await vanta(1500);
  await bild(p, `${pre}-${r.id}-start`);
  const sel = process.env.ALLA ? r.obj : r.obj.slice(0, 4);
  for (const o of sel) { await p.evaluate((o) => window.__detektiv.motor.tittaPa(o), o); await vanta(400); await bild(p, `${pre}-${r.id}-${o}`); }
}
console.log('fps', await p.evaluate(() => window.__fps));
rapporteraFel();
await b.close();
