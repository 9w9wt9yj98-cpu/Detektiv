// Fall 8 – Nyårsnatten på Vitanäs: sex rum i slottet, tidslinje med gångtider, motsägelser, prövning mot brottstiden,
// slutsatser, ledtråd, fel och rätt anklagelse.
import { assert, vanta, nySida, bild, undersok, inspektera, stangKort, gaTill, startaFall, oppnaBok, stangBok, besvaraSlutsatser, anklaga, upplosning, raknare } from '../hjalp.mjs';
const ID = 'nyarsnatten-pa-vitanas';

async function hittaAllt(p) {
  await undersok(p, 'greven', -1.9, -0.2); await bild(p, 'f8-greven'); await stangKort(p);
  for (const o of ['blocket', 'rakenskap', 'handsken', 'fonstret', 'sjostedt']) { await inspektera(p, o); await stangKort(p); }
  await gaTill(p, 'dorr', 'galleriet');
  await bild(p, 'f8-galleriet');
  for (const o of ['kartan', 'stahl', 'ingeborg', 'hulda']) { await inspektera(p, o); await stangKort(p); }
  await gaTill(p, 'vaxeldorr', 'vaxeln');
  for (const o of ['journalen', 'noren']) { await inspektera(p, o); await stangKort(p); }
  await gaTill(p, 'dorr', 'galleriet');
  await gaTill(p, 'baldorr', 'balsalen');
  await bild(p, 'f8-balsalen');
  for (const o of ['rosen', 'sofia', 'axel', 'linde']) { await inspektera(p, o); await stangKort(p); }
  await gaTill(p, 'rokdorr', 'rokrummet');
  await bild(p, 'f8-rokrummet');
  for (const o of ['eldstad', 'ekwall']) { await inspektera(p, o); await stangKort(p); }
  await gaTill(p, 'baldorr', 'balsalen');
  await gaTill(p, 'terrdorr', 'terrassen');
  await bild(p, 'f8-terrassen');
  for (const o of ['fyrverkeri', 'lunde', 'holgersson']) { await inspektera(p, o); await stangKort(p); }
}
const besked = (p) => p.locator('.tidslinje .bj-besked-ruta').innerText();
async function lagg(p, kort, person) {
  await p.locator(`[data-kort="${kort}"]`).click(); await vanta(120);
  await p.locator(`[data-lagg="${person}"]`).click(); await vanta(160);
  return besked(p);
}

export async function ratt(browser, mobil = true) {
  const p = await nySida(browser, mobil, 'f8-ratt');
  await startaFall(p, ID);
  await bild(p, 'f8-biblioteket');
  // Galleriet är låst tills greven är undersökt
  await inspektera(p, 'dorr');
  assert.match(await p.locator('.modal-bakgrund.oppen').innerText(), /hos greven/);
  await stangKort(p);
  await hittaAllt(p);
  const [, a, b] = (await raknare(p)).match(/(\d+)\/(\d+)/);
  assert.equal(a, b, 'allt borde vara hittat');

  await oppnaBok(p, 'mek:tidslinjen');
  await p.locator('.tidslinje').waitFor();
  assert.match(await p.locator('.tl-brottrad').innerText(), /inte fastställd/);
  // Fel person först – kostar inget
  assert.match(await lagg(p, 'k-ekwall-vals', 'axel'), /handlar inte om Axel Vinge/);
  await p.locator('[data-kort="k-ekwall-vals"]').click(); await vanta(100); // avmarkera
  const plan = [['k-axel-pastar', 'axel'], ['k-axel-rok', 'axel'], ['k-axel-polka', 'axel'], ['k-axel-kadrilj', 'axel'],
    ['k-ingeborg-bal', 'ingeborg'], ['k-ingeborg-pastar', 'ingeborg'], ['k-ingeborg-hulda1', 'ingeborg'], ['k-ingeborg-hulda2', 'ingeborg'],
    ['k-lunde-bal', 'lunde'], ['k-lunde-pastar', 'lunde'], ['k-lunde-holgersson', 'lunde'],
    ['k-ekwall-pastar', 'ekwall'], ['k-ekwall-rok', 'ekwall'], ['k-ekwall-vals', 'ekwall']];
  for (const [k, pid] of plan) assert.match(await lagg(p, k, pid), /Lagt på/);
  const ekwall = await p.locator('[data-bana="ekwall"]').innerText();
  assert.match(ekwall, /oförklarade/, 'ryttmästarens lucka syns inte: ' + ekwall);
  await p.locator('[data-invand="m-axel"]').click(); await vanta(250);
  assert.match(await besked(p), /Invändning!.*rökrummet/);
  await p.locator('[data-invand="m-ekwall"]').click(); await vanta(250);
  assert.match(await besked(p), /valsen/);
  // Brottstiden fastställs i slutsatserna
  await p.locator('[data-flik="slutsatser"]').click(); await vanta(200);
  assert.equal(await besvaraSlutsatser(p), 5);
  await p.locator('[data-flik="mek:tidslinjen"]').click(); await vanta(250);
  assert.match(await p.locator('.tl-brottrad').innerText(), /23\.16/);
  for (const [pid, re] of [['axel', /kadriljen/], ['ingeborg', /tidigast 23\.18/], ['lunde', /fyrverkeriet/], ['ekwall', /går ihop/]]) {
    await p.locator(`[data-prova="${pid}"]`).click(); await vanta(250);
    assert.match(await besked(p), re);
  }
  assert.match(await p.locator('.tidslinje .jf-status').innerText(), /6 av 6/);
  await p.locator('[data-bana="ekwall"]').scrollIntoViewIfNeeded();
  await bild(p, 'f8-tidslinje');
  await p.locator('[data-flik="slutsatser"]').click(); await vanta(200);
  assert.equal(await besvaraSlutsatser(p, { provaFel: false }), 4);
  await stangBok(p);
  await anklaga(p, 'lunde');
  assert.match(await p.locator('.reaktion').innerText(), /trädgårdsmästaren|fyrverkeriet/);
  await p.locator('[data-ok]').click(); await vanta(300);
  await anklaga(p, 'ekwall', { hur: 'trappan', bevis: ['f-ekwall-hinner', 'f-handsken', 'f-branda'] });
  const txt = await upplosning(p, 'f8-upplosning-ratt');
  assert.match(txt, /Fallet är löst/);
  await p.context().close();
  console.log('Fall 8: sex rum, tidslinje (fel person → 14 kort, 2 motsägelser, 4 prövningar), 9 slutsatser, fel → rätt anklagelse ✓');
}

export async function fel(browser) {
  const p = await nySida(browser, true, 'f8-fel');
  await startaFall(p, ID);
  await p.locator('[data-ledtrad]').click();
  assert.match(await p.locator('.ledtradar .nasta-steg').innerText(), /här i biblioteket/);
  await p.locator('[data-ta]').click(); await p.locator('[data-ja]').click(); await vanta(300);
  const lt = await p.locator('.ledtradlista').innerText();
  assert.match(lt, /exakt när dog greven/);
  assert.match(await p.locator('.ledtradlista .pekare').innerText(), /biblioteket|komma åt/, 'pekaren pekar fel: ' + lt);
  await bild(p, 'f8-ledtrad');
  await p.locator('.ledtradar [data-stang]').last().click(); await vanta(300);
  await anklaga(p, 'axel');
  assert.match(await p.locator('.reaktion').innerText(), /kadriljen/);
  await p.locator('[data-ok]').click(); await vanta(300);
  await anklaga(p, 'ingeborg');
  await p.locator('[data-ok]').click();
  const txt = await upplosning(p, 'f8-upplosning-misslyckad');
  assert.match(txt, /Den skyldige: Bengt Ekwall/);
  assert.match(txt, /handske/);
  await p.context().close();
  console.log('Fall 8: ledtråd pekar rätt, två fel → full förklaring ✓');
}
