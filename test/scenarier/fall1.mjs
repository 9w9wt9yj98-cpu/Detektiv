// Fall 1 – Halsbandet på Ekbacka: handledning, räknare, slutsatser, ledtrådar, två fel → full upplösning, sedan rätt.
import { assert, vanta, nySida, bild, undersok, inspektera, stangKort, gaTill, startaFall, oppnaBok, stangBok, besvaraSlutsatser, anklaga, upplosning, raknare } from '../hjalp.mjs';

const ID = 'halsbandet-pa-ekbacka';
async function dra(p, fran, till, ms = 700) {
  await p.evaluate(([fx, fy, tx, ty, ms]) => new Promise((klar) => {
    const c = document.querySelector('.rum3d-canvas');
    const ev = (t, x, y, mal = window) => mal.dispatchEvent(new PointerEvent(t, { pointerId: 9, pointerType: 'touch', clientX: x, clientY: y, bubbles: true }));
    ev('pointerdown', fx, fy, c);
    const steg = 12; let i = 0;
    const t = setInterval(() => { i++; ev('pointermove', fx + ((tx - fx) * i) / steg, fy + ((ty - fy) * i) / steg); if (i >= steg) { clearInterval(t); setTimeout(() => { ev('pointerup', tx, ty); klar(); }, ms); } }, 30);
  }), [...fran, ...till, ms]);
}

export async function handledning(browser) {
  const p = await nySida(browser, true, 'f1-guide', { guideKlar: false });
  await startaFall(p, ID);
  await p.locator('.coach').waitFor();
  await bild(p, 'f1-guide-1-ga');
  await dra(p, [90, 650], [90, 560], 900);
  await p.waitForFunction(() => /Se dig omkring/.test(document.querySelector('.coach-text')?.textContent || ''));
  await bild(p, 'f1-guide-2-titta');
  await dra(p, [330, 500], [180, 500], 100);
  await p.waitForFunction(() => /Undersök/.test(document.querySelector('.coach-text')?.textContent || ''));
  await vanta(300);
  await bild(p, 'f1-guide-3-pil');
  await undersok(p, 'fonster', 1.2, -0.9, { viaKnapp: true });
  await stangKort(p);
  await p.waitForFunction(() => /anteckningsbok/.test(document.querySelector('.coach-text')?.textContent || ''));
  await bild(p, 'f1-guide-4-bok');
  await oppnaBok(p);
  assert.ok(await p.locator('.bok-banner').count(), 'boken visade ingen introduktion');
  await bild(p, 'f1-guide-5-bokbanner');
  await stangBok(p);
  await p.locator('.coach [data-nasta]').click(); await vanta(200);
  assert.equal(await p.locator('.coach').count(), 0);
  await p.context().close();
  console.log('Fall 1: handledningen går att följa steg för steg ✓');
}

const SOVRUM = ['fonster', 'smyckeskrin', 'askkopp', 'vas', 'fotspar', 'bokhylla', 'dorr'];
const GANG = ['nyckelskap', 'pulpet', 'krokar'];
const SAL = ['gastlistan', 'vinflaskan', 'kallardorr'];

async function hittaAllt(p, { riktigt = false } = {}) {
  for (const o of SOVRUM) { if (riktigt && o === 'smyckeskrin') { await undersok(p, o, -0.6, -1.0); } else await inspektera(p, o); await stangKort(p); }
  await gaTill(p, 'dorr', 'koksgangen');
  for (const o of GANG) { await inspektera(p, o); await stangKort(p); }
  await gaTill(p, 'saldorr', 'matsalen');
  for (const o of SAL) { await inspektera(p, o); await stangKort(p); }
}

export async function fel(browser) {
  const p = await nySida(browser, true, 'f1-fel');
  await startaFall(p, ID);
  await bild(p, 'f1-start');
  assert.match(await raknare(p), /Fynd 0\/14/);
  // Ledtråd 1 innan något är hittat → pekar på fönstret
  await p.locator('[data-ledtrad]').click();
  await p.locator('[data-ta]').click(); await p.locator('[data-ja]').click(); await vanta(300);
  const lt = await p.locator('.ledtradlista').innerText();
  assert.match(lt, /Sovrummet och undersök fönstret/, 'ledtråden pekar inte på fönstret: ' + lt);
  await bild(p, 'f1-ledtrad-pekare');
  await p.locator('.ledtradar [data-stang]').last().click(); await vanta(300);
  await hittaAllt(p);
  assert.match(await raknare(p), /Fynd 14\/14/);
  await oppnaBok(p, 'platser');
  assert.match(await p.locator('.platser').innerText(), /Allt hittat/);
  await bild(p, 'f1-platser');
  // Två fel anklagelser
  await stangBok(p);
  await anklaga(p, 'gustav');
  assert.match(await p.locator('.reaktion').innerText(), /Gustav rodnar/);
  await bild(p, 'f1-fel-1');
  await p.locator('[data-ok]').click(); await vanta(300);
  await anklaga(p, 'elsa');
  await p.locator('[data-ok]').click();
  const txt = await upplosning(p, 'f1-upplosning-misslyckad');
  assert.match(txt, /Den skyldige: Holm/);
  assert.match(txt, /Varför de andra kan uteslutas/);
  assert.match(txt, /Holm är skyldig/);
  await p.context().close();
  console.log('Fall 1: räknare 14/14, ledtråd pekar rätt, två fel → full förklaring ✓');
}

export async function ratt(browser, mobil = true) {
  const p = await nySida(browser, mobil, 'f1-ratt');
  await startaFall(p, ID);
  await hittaAllt(p, { riktigt: true });
  await oppnaBok(p, 'slutsatser');
  const n = await besvaraSlutsatser(p);
  assert.equal(n, 5);
  await bild(p, 'f1-slutsatser');
  await stangBok(p);
  await anklaga(p, 'holm', { hur: 'nyckel-2030', bevis: ['f-nycklar', 'f-vinflaskan'] });
  const txt = await upplosning(p, 'f1-upplosning-ratt');
  assert.match(txt, /Fallet är löst/);
  assert.match(txt, /3 av 3/);
  await p.context().close();
  console.log('Fall 1: rätt lösning med slutsatser → 3 förstoringsglas ✓');
}
