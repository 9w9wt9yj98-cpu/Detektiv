// Fall 6 – Fyren på Gråskär: fem rum (tornet, lanternan, köket, biträdesstugan, väderstationen), dokumentanalys
// med markering och invändningar, slutsatser, opålitlig berättare; fel och rätt anklagelse.
import { assert, vanta, nySida, bild, undersok, inspektera, stangKort, gaTill, startaFall, oppnaBok, stangBok, besvaraSlutsatser, anklaga, upplosning, raknare } from '../hjalp.mjs';
const ID = 'fyren-pa-graskar';

async function hittaAllt(p) {
  await undersok(p, 'kroppen', null, null); await bild(p, 'f6-kroppen'); await stangKort(p);
  await inspektera(p, 'elof'); await stangKort(p);
  await gaTill(p, 'dorr-upp', 'lanternan');
  await vanta(500); await bild(p, 'f6-lanternan');
  for (const o of ['urverk', 'instruktion', 'loggboken', 'pulpet']) { await inspektera(p, o); await stangKort(p); }
  await gaTill(p, 'dorr-ned', 'tornet');
  await gaTill(p, 'dorr-koket', 'koket');
  await bild(p, 'f6-koket');
  for (const o of ['johan', 'signe', 'brevet']) { await inspektera(p, o); await stangKort(p); }
  await gaTill(p, 'dorr', 'tornet');
  await gaTill(p, 'dorr-stugan', 'stugan');
  for (const o of ['dagboken', 'pennan', 'kannor']) { await inspektera(p, o); await stangKort(p); }
  await gaTill(p, 'dorr', 'tornet');
  await gaTill(p, 'dorr-station', 'stationen');
  await bild(p, 'f6-stationen');
  for (const o of ['barografen', 'journalen', 'lagerkvist']) { await inspektera(p, o); await stangKort(p); }
}

async function valj(p, id) {
  const dok = await p.evaluate((id) => {
    const m = window.__detektiv.f.moment.find((x) => x.id === 'dokumenten');
    return m.payload.dokument.find((d) => d.stycken.some((s) => s.id === id))?.id || null;
  }, id);
  if (dok) { await p.locator(`[data-dok="${dok}"]`).click(); await vanta(120); }
  const b = p.locator(`.jf-post[data-id="${id}"]`);
  if (!(await b.isVisible())) await p.locator('.jf-fynd summary').click();
  await b.click(); await vanta(120);
}
async function invand(p, a, b) {
  await valj(p, a); await valj(p, b);
  await p.locator('[data-invand]').click(); await vanta(300);
  return p.locator('.jf-besked').innerText();
}

export async function ratt(browser, mobil = true) {
  const p = await nySida(browser, mobil, 'f6-ratt');
  await startaFall(p, ID);
  await bild(p, 'f6-tornet');
  // Lanternan är låst tills kroppen är undersökt
  await inspektera(p, 'dorr-upp');
  assert.match(await p.locator('.modal-bakgrund.oppen').innerText(), /Undersök honom först/);
  await stangKort(p);
  await hittaAllt(p);
  const [, a, b] = (await raknare(p)).match(/(\d+)\/(\d+)/);
  assert.ok(+a >= 13, 'för få fynd: ' + a + '/' + b);

  await oppnaBok(p, 'slutsatser');
  assert.equal(await besvaraSlutsatser(p), 5);
  await p.locator('[data-flik="mek:dokumenten"]').click(); await vanta(250);
  await p.locator('.jamfor.dok').waitFor();
  assert.match(await p.locator('.jf-status').innerText(), /0 av 6/);
  // Markera ett stycke
  await valj(p, 'l-0400'); await p.locator('[data-markera]').click(); await vanta(150);
  assert.ok(await p.locator('.jf-post.markerad[data-id="l-0400"]').count(), 'markering syns inte');
  await p.locator('[data-rensa]').click(); await vanta(100);
  // Fel par kostar inget
  assert.match(await invand(p, 'd-grall', 'la-grall'), /kan mycket väl stämma/);
  await p.locator('[data-rensa]').click(); await vanta(100);
  assert.match(await invand(p, 'i-urverk', 'j-fyr'), /Invändning!.*urverket/);
  assert.match(await invand(p, 'n-trappa', 'f-uppdragen'), /Invändning!.*klev över/);
  assert.match(await invand(p, 'i-blyerts', 'l-0400'), /Invändning!.*blyerts/);
  await p.locator('[data-dok="dok-loggbok"]').click(); await vanta(150);
  await p.locator('.dokument').scrollIntoViewIfNeeded();
  await bild(p, 'f6-loggboken');
  assert.match(await invand(p, 'l-0400', 'f-dodstid'), /förfalskad/);
  assert.match(await invand(p, 'd-penna', 'l-0400'), /Elofs/);
  assert.ok(await p.locator('[data-dok="dok-elof2"]').count(), 'Elofs förklaring låstes inte upp');
  assert.match(await invand(p, 'd-visslade', 's-duns'), /hittat på/);
  assert.match(await p.locator('.jf-status').innerText(), /6 av 6/);
  assert.match(await invand(p, 'e-lanat', 'f-forfalskad'), /ljuger/);
  assert.match(await p.locator('.jf-status').innerText(), /6 av 6.*\+1 extra/);
  await p.locator('[data-dok="dok-dagbok"]').click(); await vanta(150);
  await p.locator('.jamfor').evaluate((e) => e.closest('.bok-sida, .sida, .bok-innehall')?.scrollTo?.(0, 0));
  await bild(p, 'f6-dokumenten');
  await p.locator('[data-flik="slutsatser"]').click(); await vanta(200);
  assert.equal(await besvaraSlutsatser(p, { provaFel: false }), 2);
  await stangBok(p);
  await anklaga(p, 'lagerkvist');
  assert.match(await p.locator('.reaktion').innerText(), /Barografen/);
  await p.locator('[data-ok]').click(); await vanta(300);
  await anklaga(p, 'elof', { hur: 'knuff-0320', bevis: ['f-forfalskad', 'f-elofs-penna', 'f-dagbok-logn'] });
  const txt = await upplosning(p, 'f6-upplosning-ratt');
  assert.match(txt, /Fallet är löst/);
  assert.match(txt, /berättades av gärningsmannen/);
  await p.context().close();
  console.log('Fall 6: fem rum, låst lanterna, dokument (markering, fel par, 6+1 motsägelser), 7 slutsatser, fel → rätt anklagelse, vändning ✓');
}

export async function fel(browser) {
  const p = await nySida(browser, true, 'f6-fel');
  await startaFall(p, ID);
  await p.locator('[data-ledtrad]').click(); await p.locator('[data-ta]').click(); await p.locator('[data-ja]').click(); await vanta(300);
  const lt = await p.locator('.ledtradlista').innerText();
  assert.match(lt, /instruktion|Lanternan|loggbok/i, 'ledtråden pekar inte ut källorna: ' + lt);
  await bild(p, 'f6-ledtrad');
  await p.locator('.ledtradar [data-stang]').last().click(); await vanta(300);
  await anklaga(p, 'johan');
  await p.locator('[data-ok]').click(); await vanta(300);
  await anklaga(p, 'signe');
  await p.locator('[data-ok]').click();
  const txt = await upplosning(p, 'f6-upplosning-misslyckad');
  assert.match(txt, /Den skyldige: Elof Granath/);
  assert.match(txt, /reservoarpenna/);
  assert.match(txt, /Vändningen/);
  assert.match(txt, /läst en gång till/); assert.match(txt, /Sextio liter fotogen/);
  await p.context().close();
  console.log('Fall 6: ledtråd pekar ut källorna, två fel → full förklaring med vändning ✓');
}
