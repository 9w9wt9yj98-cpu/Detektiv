// Fall 4 – Brudskålen: tre miljöer (sal, gård utomhus, kontor), bildjämförelse med viktiga och oviktiga skillnader, twist.
import { assert, vanta, nySida, bild, undersok, inspektera, stangKort, gaTill, startaFall, oppnaBok, stangBok, besvaraSlutsatser, anklaga, upplosning, raknare } from '../hjalp.mjs';
const ID = 'brudskalen';

async function hittaAllt(p) {
  await undersok(p, 'skanken', -0.4, -1.6); await bild(p, 'f4-skanken'); await stangKort(p);
  for (const o of ['gunnar', 'olle', 'birgitta']) { await inspektera(p, o); await stangKort(p); }
  await gaTill(p, 'dorr-ut', 'garden');
  await bild(p, 'f4-garden');
  await undersok(p, 'karin', -1.8, -2.6); await bild(p, 'f4-karin'); await stangKort(p);
  for (const o of ['lena', 'volvo', 'korlogg', 'mikael', 'vaska']) { await inspektera(p, o); await stangKort(p); }
  await gaTill(p, 'dorr-in', 'salen');
  await gaTill(p, 'dorr-kontor', 'kontoret');
  await bild(p, 'f4-kontoret');
  for (const o of ['dator', 'parmen']) { await inspektera(p, o); await stangKort(p); }
}

async function valjPar(p, a, b) {
  for (let i = 0; i < 5; i++) {
    const par = await p.evaluate(() => window.__detektiv.st.mek.bilderna.par);
    if (par.includes(a) && par.includes(b)) return par;
    const nasta = !par.includes(a) && par[1] !== b ? a : !par.includes(b) ? b : a;
    await p.locator(`[data-bild="${nasta}"]`).click(); await vanta(150);
  }
  throw new Error(`kunde inte välja ${a} + ${b}`);
}
async function tryck(p, bildId, region) {
  const par = await p.evaluate(() => window.__detektiv.st.mek.bilderna.par);
  const i = par.indexOf(bildId);
  const g = p.locator(`.bj-foto[data-i="${i}"] [data-r="${region}"]`).last();
  if (region === 'bakgrund') await g.locator(':scope > :first-child').click({ force: true, position: { x: 8, y: 8 } });
  else await g.locator(':scope > :last-child').click({ force: true });
  await vanta(250);
  return p.locator('.bj-besked-ruta').innerText();
}

export async function ratt(browser, mobil = true) {
  const p = await nySida(browser, mobil, 'f4-ratt');
  await startaFall(p, ID);
  await bild(p, 'f4-salen');
  await hittaAllt(p);
  const [, a, b] = (await raknare(p)).match(/(\d+)\/(\d+)/);
  assert.equal(a, b, 'allt borde vara hittat');
  await oppnaBok(p, 'mek:bilderna');
  await p.locator('.bildjamf').waitFor();
  await valjPar(p, 'bild-f', 'bild-a');
  assert.match(await tryck(p, 'bild-a', 'bakgrund'), /olika platser/);
  assert.match(await tryck(p, 'bild-a', 'kant'), /äkta/);
  assert.match(await tryck(p, 'bild-a', 'tidning'), /i dag/);
  await valjPar(p, 'bild-a', 'bild-b');
  assert.match(await tryck(p, 'bild-b', 'handtag'), /inte samma skål/);
  await p.locator('.bj-foto').first().scrollIntoViewIfNeeded();
  await bild(p, 'f4-bildjamforelse');
  await valjPar(p, 'bild-b', 'bild-c');
  assert.match(await tryck(p, 'bild-c', 'vas'), /Oviktigt|ingen betydelse/);
  assert.match(await tryck(p, 'bild-b', 'utsikt'), /Lenas Volvo/);
  await valjPar(p, 'bild-c', 'bild-d');
  assert.match(await tryck(p, 'bild-d', 'person'), /Olle/);
  await valjPar(p, 'bild-c', 'bild-e');
  assert.match(await tryck(p, 'bild-e', 'skal'), /senaste bilden/);
  await valjPar(p, 'bild-d', 'bild-e');
  assert.match(await tryck(p, 'bild-e', 'gardin'), /Oviktigt/);
  assert.match(await tryck(p, 'bild-d', 'kant'), /17\.05 och 17\.20/);
  const stTxt = await p.locator('.bildjamf .jf-status').evaluate((e) => e.textContent + ' ' + JSON.stringify(window.__detektiv.st.mek.bilderna.hittade));
  assert.match(stTxt, /6 av 6/, stTxt);
  await p.locator('[data-flik="slutsatser"]').click(); await vanta(200);
  assert.equal(await besvaraSlutsatser(p), 6);
  await bild(p, 'f4-slutsatser');
  await stangBok(p);
  await anklaga(p, 'mikael');
  assert.match(await p.locator('.reaktion').innerText(), /tårtbricka/);
  await p.locator('[data-ok]').click(); await vanta(300);
  await anklaga(p, 'gunnar', { hur: 'byte', bevis: ['f-kopia', 'f-gunnar-ensam', 'f-akta'] });
  const txt = await upplosning(p, 'f4-upplosning-ratt');
  assert.match(txt, /Fallet är löst/);
  assert.match(txt, /Offret var gärningsmannen/);
  await p.context().close();
  console.log('Fall 4: sal, gård, kontor, bildjämförelse (oviktiga + 6 upptäckter), 6 slutsatser, fel → rätt, twist ✓');
}

export async function fel(browser) {
  const p = await nySida(browser, true, 'f4-fel');
  await startaFall(p, ID);
  await inspektera(p, 'dorr-kontor');
  assert.match(await p.locator('.modal-bakgrund.oppen').innerText(), /prata med honom/);
  await stangKort(p);
  await p.locator('[data-ledtrad]').click(); await p.locator('[data-ta]').click(); await p.locator('[data-ja]').click(); await vanta(300);
  const lt = await p.locator('.ledtradlista').innerText();
  assert.match(lt, /Gunnars kontor|Gården|Gunnar Sahlin/, 'ledtråden pekar inte ut var bilderna finns: ' + lt);
  await bild(p, 'f4-ledtrad');
  await p.locator('[data-losning]').click(); await p.locator('[data-ja]').click();
  const txt = await upplosning(p, 'f4-visa-losningen');
  assert.match(txt, /Den skyldige: Gunnar Sahlin/);
  assert.match(txt, /Offret var gärningsmannen/);
  await p.context().close();
  console.log('Fall 4: låst kontor, ledtråd pekar ut bilderna, "Visa lösningen" med twist ✓');
}
