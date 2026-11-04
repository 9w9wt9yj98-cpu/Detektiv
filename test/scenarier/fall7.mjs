// Fall 7 – Sista akten: fyra rum (scenen, lindraget, undre maskineriet, logekorridoren), förhör (fel → 3 motsägelser),
// 7 slutsatser, ledtråd, fel och rätt anklagelse.
import { assert, vanta, nySida, bild, undersok, inspektera, stangKort, gaTill, startaFall, oppnaBok, stangBok, besvaraSlutsatser, anklaga, upplosning, raknare } from '../hjalp.mjs';
const ID = 'sista-akten';

async function hittaAllt(p) {
  await undersok(p, 'sandsacken', 1.0, 1.6); await bild(p, 'f7-sandsacken'); await stangKort(p);
  for (const o of ['tejpen', 'ridan', 'korbok', 'rapporten', 'ruth', 'persson', 'viveka', 'agren']) { await inspektera(p, o); await stangKort(p); }
  // Lindraget öppnas av sandsäcken; undre maskineriet av linan
  await gaTill(p, 'stegen', 'lindraget');
  await bild(p, 'f7-lindraget');
  for (const o of ['nagelbanken', 'penna', 'schemat']) { await inspektera(p, o); await stangKort(p); }
  await gaTill(p, 'trappan', 'undre');
  await bild(p, 'f7-undre');
  for (const o of ['exemplaret', 'spar', 'maskindorren', 'scenluckan']) { await inspektera(p, o); await stangKort(p); }
  await gaTill(p, 'lucktrappan', 'scenen');
  await gaTill(p, 'dorr', 'logerna');
  await bild(p, 'f7-logerna');
  for (const o of ['brevet', 'lappen', 'anslag', 'wall', 'marta', 'kalle', 'wern']) { await inspektera(p, o); await stangKort(p); }
}

async function invand(p, a, b) {
  if (await p.locator('[data-rensa]:not([disabled])').count()) { await p.locator('[data-rensa]').click(); await vanta(100); }
  await p.locator(`.jf-post[data-id="${a}"]`).click(); await vanta(120);
  const bb = p.locator(`.jf-post[data-id="${b}"]`);
  if (!(await bb.isVisible())) await p.locator('.jf-fynd summary').click();
  await bb.click(); await vanta(120);
  await p.locator('[data-invand]').click(); await vanta(300);
  return p.locator('.jf-besked').innerText();
}

export async function ratt(browser, mobil = true) {
  const p = await nySida(browser, mobil, 'f7-ratt');
  await startaFall(p, ID);
  await bild(p, 'f7-scenen');
  await hittaAllt(p);
  const rk = await raknare(p);
  const [, a, b] = rk.match(/(\d+)\/(\d+)/);
  assert.equal(a, b, 'allt borde vara hittat: ' + rk);

  await oppnaBok(p, 'mek:forhoret');
  await p.locator('.jamfor').waitFor();
  assert.match(await invand(p, 'u-ruth', 'u-kalle-knut'), /kan mycket väl vara sanna/);
  assert.match(await invand(p, 'u-marta-loge', 'u-persson'), /Invändning!/);
  assert.ok(await p.locator('.jf-post[data-id="u-marta-erkann"]').count(), 'Märtas medgivande låstes inte upp');
  assert.match(await invand(p, 'u-wern-viveka', 'f-lappen'), /Invändning!/);
  assert.match(await invand(p, 'u-wall-lucka', 'u-agren'), /Invändning!.*tom/);
  assert.match(await p.locator('.jf-status').innerText(), /3 av 3/);
  await p.locator('.bok-sida').evaluate((e) => (e.scrollTop = 0));
  await bild(p, 'f7-forhor');
  await p.locator('[data-flik="slutsatser"]').click(); await vanta(200);
  assert.equal(await besvaraSlutsatser(p), 7);
  await bild(p, 'f7-slutsatser');
  await stangBok(p);
  // Ett fel först: ersättaren har motiv men stod bredvid brandvakten
  await anklaga(p, 'marta');
  assert.match(await p.locator('.reaktion').innerText(), /kulissen|brandvakten/i);
  await p.locator('[data-ok]').click(); await vanta(300);
  await anklaga(p, 'wall', { hur: 'lucka', bevis: ['f-wall-borta', 'f-exemplaret', 'f-genrep'] });
  const txt = await upplosning(p, 'f7-upplosning-ratt');
  assert.match(txt, /Fallet är löst/);
  await p.context().close();
  console.log('Fall 7: fyra rum, förhör (fel → 3 motsägelser), 7 slutsatser, fel → rätt anklagelse ✓');
}

export async function fel(browser) {
  const p = await nySida(browser, true, 'f7-fel');
  await startaFall(p, ID);
  // Lindraget är låst tills sandsäcken är undersökt
  await inspektera(p, 'stegen');
  assert.match(await p.locator('.modal-bakgrund.oppen').innerText(), /Titta på den först/);
  await stangKort(p);
  await p.locator('[data-ledtrad]').click();
  assert.match(await p.locator('.ledtradar .nasta-steg').innerText(), /Scenen/);
  await p.locator('[data-ta]').click(); await p.locator('[data-ja]').click(); await vanta(300);
  const lt = await p.locator('.ledtradlista').innerText();
  assert.match(lt, /olycka/);
  assert.match(await p.locator('.ledtradlista .pekare').innerText(), /undersök sandsäcken/, 'pekaren visar inte sandsäcken: ' + lt);
  await bild(p, 'f7-ledtrad');
  await p.locator('.ledtradar [data-stang]').last().click(); await vanta(300);
  await anklaga(p, 'kalle');
  assert.match(await p.locator('.reaktion').innerText(), /regnmaskinen|inspicienten/i);
  await p.locator('[data-ok]').click(); await vanta(300);
  await anklaga(p, 'wern');
  await p.locator('[data-ok]').click();
  const txt = await upplosning(p, 'f7-upplosning-misslyckad');
  assert.match(txt, /Den skyldige: Agnes Wall/);
  assert.match(txt, /Fru Wall är skyldig/);
  await p.context().close();
  console.log('Fall 7: låst lindrag, ledtråd pekar rätt, två fel → full förklaring ✓');
}
