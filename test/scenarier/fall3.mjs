// Fall 3 – Middagen på Solgläntan: logikrutnät, fel placering, rätt placering, "Visa lösningen".
import { assert, vanta, nySida, bild, undersok, inspektera, stangKort, startaFall, oppnaBok, stangBok, besvaraSlutsatser, anklaga, upplosning } from '../hjalp.mjs';
const ID = 'middagen-pa-solglantan';

async function fyllRutnat(p, t) {
  for (const [pers, rad] of Object.entries(t)) for (const v of Object.values(rad)) {
    const c = p.locator(`.cell[data-a="${pers}"][data-b="${v}"]`);
    for (let i = 0; i < 3 && !(await c.getAttribute('class')).includes('bock'); i++) await c.click();
  }
}

export async function ratt(browser, mobil = true) {
  const p = await nySida(browser, mobil, 'f3');
  await startaFall(p, ID);
  await bild(p, 'f3-verandan');
  await undersok(p, 'glaset', 0.3, -2.3); await bild(p, 'f3-glaset'); await stangKort(p);
  await inspektera(p, 'protokollen'); await stangKort(p);
  await inspektera(p, 'vaskan'); await stangKort(p);
  await oppnaBok(p, 'mek:bordet');
  await p.locator('.rutnat').waitFor();
  await fyllRutnat(p, {
    astrid: { plats: 'p4', yrke: 'advokat', dryck: 'champagne' }, bertil: { plats: 'p1', yrke: 'pastor', dryck: 'sherry' },
    cecilia: { plats: 'p3', yrke: 'lakare', dryck: 'whisky' }, david: { plats: 'p2', yrke: 'konstnar', dryck: 'te' } });
  assert.match(await p.locator('.rutnat-status').innerText(), /strider mot/);
  await p.locator('[data-rensa]').click();
  await fyllRutnat(p, {
    cecilia: { plats: 'p1', yrke: 'advokat', dryck: 'sherry' }, david: { plats: 'p2', yrke: 'lakare', dryck: 'whisky' },
    astrid: { plats: 'p3', yrke: 'konstnar', dryck: 'champagne' }, bertil: { plats: 'p4', yrke: 'pastor', dryck: 'te' } });
  assert.match(await p.locator('.rutnat-status').innerText(), /rekonstruerad/);
  await p.locator('.bok-sida').evaluate((e) => (e.scrollTop = 0));
  await bild(p, 'f3-rutnat-lost');
  await p.locator('[data-flik="slutsatser"]').click(); await vanta(200);
  assert.equal(await besvaraSlutsatser(p), 3);
  await stangBok(p);
  await anklaga(p, 'bertil', { hur: 'plats4', bevis: ['f-placering', 'f-spill'] });
  const txt = await upplosning(p, 'f3-upplosning');
  assert.match(txt, /Fallet är löst/);
  await p.context().close();
  console.log('Fall 3: rutnät (fel → rätt), slutsatser, rätt anklagelse ✓');
}

export async function visaLosning(browser) {
  const p = await nySida(browser, true, 'f3-ge-upp');
  await startaFall(p, ID);
  await p.locator('[data-ledtrad]').click(); await vanta(200);
  await p.locator('[data-losning]').click(); await p.locator('[data-ja]').click();
  const txt = await upplosning(p, 'f3-visa-losningen');
  assert.match(txt, /Du valde att se lösningen/);
  assert.match(txt, /Den skyldige: Bertil/);
  await p.context().close();
  console.log('Fall 3: "Visa lösningen" ger full förklaring ✓');
}
