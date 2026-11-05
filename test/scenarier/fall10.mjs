// Fall 10 – Grönt bläck: tre rum på kanalångaren (hyttkorridoren, salongen, promenaddäcket), logikrutnät med hytter
// i korridor (fel → rätt), slutsatser, ledtråd, fel och rätt anklagelse.
import { assert, vanta, nySida, bild, undersok, inspektera, stangKort, gaTill, startaFall, oppnaBok, stangBok, besvaraSlutsatser, anklaga, upplosning, raknare } from '../hjalp.mjs';
const ID = 'gront-black';

async function fyllRutnat(p, t) {
  for (const [pers, rad] of Object.entries(t)) for (const v of Object.values(rad)) {
    const c = p.locator(`.cell[data-a="${pers}"][data-b="${v}"]`);
    for (let i = 0; i < 3 && !(await c.getAttribute('class')).includes('bock'); i++) await c.click();
  }
}
async function hittaAllt(p) {
  await undersok(p, 'konsuln', -0.3, -2.3, { viaKnapp: true }); await bild(p, 'f10-brevet'); await stangKort(p);
  for (const o of ['hytt5', 'akterdorren', 'pettersson', 'hytt3']) { await inspektera(p, o); await stangKort(p); }
  await gaTill(p, 'trappan', 'salongen');
  await bild(p, 'f10-salongen');
  for (const o of ['gerda', 'teodor', 'rut', 'oskar', 'passagerarboken', 'skrivdon']) { await inspektera(p, o); await stangKort(p); }
  await gaTill(p, 'dackdorr', 'dacket');
  await bild(p, 'f10-dacket');
  for (const o of ['livbaten', 'ritblocket', 'manuset']) { await inspektera(p, o); await stangKort(p); }
}

export async function ratt(browser, mobil = true) {
  const p = await nySida(browser, mobil, 'f10-ratt');
  await startaFall(p, ID);
  await bild(p, 'f10-korridoren');
  // Salongen är låst tills brevet är läst
  await inspektera(p, 'trappan');
  assert.match(await p.locator('.modal-bakgrund.oppen').innerText(), /brevet först/);
  await stangKort(p);
  await hittaAllt(p);
  const [, a, b] = (await raknare(p)).match(/(\d+)\/(\d+)/);
  assert.equal(a, b, 'allt borde vara hittat');
  await oppnaBok(p, 'slutsatser');
  assert.equal(await besvaraSlutsatser(p), 3);
  await p.locator('[data-flik="mek:hyttlistan"]').click(); await vanta(250);
  await p.locator('.rutnat').waitFor();
  // Fel först: Rut och Oskar ombytta
  await fyllRutnat(p, {
    teodor: { hytt: 'h1', yrke: 'kyrkoherde', skriver: 'svart' }, gerda: { hytt: 'h2', yrke: 'sjukskoterska', skriver: 'blyerts' },
    oskar: { hytt: 'h3', yrke: 'journalist', skriver: 'maskin' }, rut: { hytt: 'h4', yrke: 'ingenjor', skriver: 'gront' } });
  assert.match(await p.locator('.rutnat-status').innerText(), /strider mot/);
  await p.locator('[data-rensa]').click();
  await fyllRutnat(p, {
    teodor: { hytt: 'h1', yrke: 'kyrkoherde', skriver: 'svart' }, gerda: { hytt: 'h2', yrke: 'sjukskoterska', skriver: 'blyerts' },
    rut: { hytt: 'h3', yrke: 'journalist', skriver: 'maskin' }, oskar: { hytt: 'h4', yrke: 'ingenjor', skriver: 'gront' } });
  assert.match(await p.locator('.rutnat-status').innerText(), /Hyttlistan är rekonstruerad/);
  await p.locator('.bok-sida').evaluate((e) => (e.scrollTop = 0));
  await bild(p, 'f10-hyttlistan');
  await p.locator('[data-flik="slutsatser"]').click(); await vanta(200);
  assert.equal(await besvaraSlutsatser(p, { provaFel: false }), 2);
  await stangBok(p);
  await anklaga(p, 'rut');
  assert.match(await p.locator('.reaktion').innerText(), /gröna bläcket/);
  await p.locator('[data-ok]').click(); await vanta(300);
  await anklaga(p, 'oskar', { hur: 'hytt4', bevis: ['f-hyttlistan', 'f-stewarden', 'f-ett-gront'] });
  const txt = await upplosning(p, 'f10-upplosning-ratt');
  assert.match(txt, /Fallet är löst/);
  await p.context().close();
  console.log('Fall 10: tre rum, hyttlista i rutnät (fel → rätt), 5 slutsatser, fel → rätt anklagelse ✓');
}

export async function fel(browser) {
  const p = await nySida(browser, true, 'f10-fel');
  await startaFall(p, ID);
  await p.locator('[data-ledtrad]').click();
  assert.match(await p.locator('.ledtradar .nasta-steg').innerText(), /här i hyttkorridoren/);
  await p.locator('[data-ta]').click(); await p.locator('[data-ja]').click(); await vanta(300);
  const lt = await p.locator('.ledtradlista').innerText();
  assert.match(lt, /vägen till konsulns dörr/);
  assert.match(await p.locator('.ledtradlista .pekare').innerText(), /hyttkorridoren/, 'pekaren pekar fel: ' + lt);
  await p.locator('.ledtradar [data-stang]').last().click(); await vanta(300);
  await anklaga(p, 'teodor');
  assert.match(await p.locator('.reaktion').innerText(), /stewarden/);
  await p.locator('[data-ok]').click(); await vanta(300);
  await anklaga(p, 'gerda');
  await p.locator('[data-ok]').click();
  const txt = await upplosning(p, 'f10-upplosning-misslyckad');
  assert.match(txt, /Den skyldige: Oskar Ring/);
  assert.match(txt, /grönt bläck/);
  await p.context().close();
  console.log('Fall 10: ledtråd pekar rätt, två fel → full förklaring ✓');
}
