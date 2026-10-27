// Fall 2 – Nattåget mot Narvik: tre rum, förhör med motsägelser (fel → rätt), slutsatser, ledtrådar, fel och rätt anklagelse.
import { assert, vanta, nySida, bild, undersok, inspektera, stangKort, gaTill, startaFall, oppnaBok, stangBok, besvaraSlutsatser, anklaga, upplosning, raknare } from '../hjalp.mjs';
const ID = 'nattaget-mot-narvik';

async function hittaAllt(p) {
  await undersok(p, 'kroppen', -0.2, 0.6); await bild(p, 'f2-kroppen'); await stangKort(p);
  for (const o of ['fonster', 'mellandorr', 'vagg4', 'planboken', 'portfolj']) { await inspektera(p, o); await stangKort(p); }
  // Korridoren är låst tills kedjan är undersökt
  await inspektera(p, 'korridordorr');
  assert.ok(await p.locator('[data-ga]').count(), 'korridordörren gick inte att öppna efter kedjan');
  await p.locator('[data-ga]').click(); await vanta(800);
  assert.equal(await p.evaluate(() => window.__detektiv.rum()), 'korridoren');
  await bild(p, 'f2-korridoren');
  await undersok(p, 'ahl', 0.1, 0.2); await bild(p, 'f2-fru-ahl'); await stangKort(p);
  for (const o of ['nyqvist', 'tidtabell', 'fotspar']) { await inspektera(p, o); await stangKort(p); }
  await gaTill(p, 'restdorr', 'restaurangvagnen');
  await bild(p, 'f2-restaurangvagnen');
  for (const o of ['olsson', 'notor', 'sundin', 'lind']) { await inspektera(p, o); await stangKort(p); }
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
  const p = await nySida(browser, mobil, 'f2-ratt');
  await startaFall(p, ID);
  await bild(p, 'f2-kupe3');
  // Restaurangvagnen är låst i början (via korridoren): korridoren först
  await inspektera(p, 'korridordorr');
  assert.equal(await p.locator('[data-ga]').count(), 1, 'korridoren borde vara öppen när kedjan undersöks i samma kort');
  await stangKort(p);
  await hittaAllt(p);
  const rk = await raknare(p);
  const [, a, b] = rk.match(/(\d+)\/(\d+)/);
  assert.equal(a, b, 'allt borde vara hittat: ' + rk);
  // Ledtråd 3 kräver fru Ahls lykta som ännu är okänd för spelaren? (den låses upp av tidtabellen) – ta ledtråd 1
  await p.locator('[data-ledtrad]').click(); await p.locator('[data-ta]').click(); await p.locator('[data-ja]').click(); await vanta(300);
  assert.match(await p.locator('.ledtradlista').innerText(), /hakad inifrån/);
  await p.locator('.ledtradar [data-stang]').last().click(); await vanta(300);

  await oppnaBok(p, 'mek:forhoret');
  await p.locator('.jamfor').waitFor();
  assert.match(await invand(p, 'u-ahl-regel', 'u-nyq-korridor'), /kan mycket väl vara sanna/);
  assert.match(await invand(p, 'u-sun-kande', 'f-skuldsedel'), /Invändning!/);
  assert.ok(await p.locator('.jf-post[data-id="u-sun-erkann"]').count(), 'Sundins medgivande låstes inte upp');
  assert.match(await invand(p, 'u-sun-kort', 'u-lind-perrong'), /Invändning!/);
  assert.match(await invand(p, 'u-ahl-sov', 'u-ahl-lykta'), /Invändning!.*vaken/);
  assert.match(await p.locator('.jf-status').innerText(), /3 av 3/);
  await p.locator('.bok-sida').evaluate((e) => (e.scrollTop = 0));
  await bild(p, 'f2-forhor');
  await p.locator('[data-flik="slutsatser"]').click(); await vanta(200);
  assert.equal(await besvaraSlutsatser(p), 5);
  await bild(p, 'f2-slutsatser');
  await stangBok(p);
  // Ett fel först
  await anklaga(p, 'sundin');
  assert.match(await p.locator('.reaktion').innerText(), /motiv är inget bevis|servitören/i);
  await p.locator('[data-ok]').click(); await vanta(300);
  await anklaga(p, 'ahl', { hur: 'mellandorr', bevis: ['f-mellandorr', 'f-ahl-vaken', 'f-ahl-kedja'] });
  const txt = await upplosning(p, 'f2-upplosning-ratt');
  assert.match(txt, /Fallet är löst/);
  await p.context().close();
  console.log('Fall 2: tre rum, förhör (fel → 3 motsägelser), 5 slutsatser, fel → rätt anklagelse ✓');
}

export async function fel(browser) {
  const p = await nySida(browser, true, 'f2-fel');
  await startaFall(p, ID);
  // Låst dörr: restaurangvagnen kräver fru Ahls utsaga
  await inspektera(p, 'korridordorr'); await p.locator('[data-ga]').click(); await vanta(700);
  await inspektera(p, 'restdorr');
  assert.match(await p.locator('.modal-bakgrund.oppen').innerText(), /Förhör grannarna/);
  await stangKort(p);
  await p.locator('[data-ledtrad]').click(); await p.locator('[data-ta]').click(); await p.locator('[data-ja]').click(); await vanta(300);
  const lt = await p.locator('.ledtradlista').innerText();
  assert.match(lt, /Kupé 3 och undersök fönstret|undersök fönstret/, 'ledtråden pekar fel: ' + lt);
  await p.locator('.ledtradar [data-stang]').last().click(); await vanta(300);
  await anklaga(p, 'lind');
  await p.locator('[data-ok]').click(); await vanta(300);
  await anklaga(p, 'nyqvist');
  await p.locator('[data-ok]').click();
  const txt = await upplosning(p, 'f2-upplosning-misslyckad');
  assert.match(txt, /Den skyldige: Margit Ahl/);
  assert.match(txt, /Fru Ahl är skyldig/);
  await p.context().close();
  console.log('Fall 2: låst vagn, ledtråd pekar rätt, två fel → full förklaring ✓');
}
