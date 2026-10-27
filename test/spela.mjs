// Spelar igenom båda fallen i headless Chromium (iPhone-vy + skrivbord) och sparar skärmbilder i shots/.
// Kör: python3 -m http.server 18431 & node test/spela.mjs [bas-url]
import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const BAS = (process.argv[2] || 'http://localhost:18431/').replace(/\/?$/, '/');
const ARGS = ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'];
const fel = [];
const vanta = (ms) => new Promise((r) => setTimeout(r, ms));

async function nySida(browser, mobil, namn) {
  const ctx = await browser.newContext(mobil
    ? { viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true, userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1' }
    : { viewport: { width: 1280, height: 800 } });
  const p = await ctx.newPage();
  p.setDefaultTimeout(15000);
  p.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') fel.push(`[${namn}] ${m.type()}: ${m.text()}`); });
  p.on('pageerror', (e) => fel.push(`[${namn}] pageerror: ${e.message}`));
  p.mobil = mobil;
  return p;
}
const bild = (p, namn, fullPage = false) => p.screenshot({ path: `shots/${namn}.png`, fullPage });

/** Ställ dig vid (x,z), titta på föremålet och tryck på det på riktigt (raycast). */
async function undersok(p, id, x, z) {
  await p.evaluate(([id, x, z]) => { const m = window.__detektiv.motor; m.flyttaTill(x, z); m.tittaPa(id); }, [id, x, z]);
  await vanta(350);
  const pos = await p.evaluate((id) => window.__detektiv.motor.projicera(id), id);
  assert.ok(pos?.synlig, `${id} syns inte`);
  const r = await p.locator('.rum3d-canvas').boundingBox();
  const px = r.x + pos.x * r.width, py = r.y + pos.y * r.height;
  if (p.mobil) await p.touchscreen.tap(px, py); else await p.mouse.click(px, py);
  await p.locator('.modal-bakgrund.oppen, .bok-bakgrund.oppen').first().waitFor({ timeout: 4000 });
  await vanta(200);
}
async function stangKort(p) { await p.locator('.modal-bakgrund.oppen [data-stang]').last().click(); await vanta(250); }

async function startaFall(p, id) {
  await p.goto(BAS + '?nosw#/fall/' + id);
  await p.locator('#start').click();
  await p.locator('.rum3d-canvas').waitFor();
  await vanta(1200);
  const hjalp = p.locator('.styrhjalp [data-stang]');
  if (await hjalp.count()) await hjalp.click();
  await vanta(400);
}

async function fall1(p, prefix, { felAnklagelse = true } = {}) {
  await startaFall(p, 'halsbandet-pa-ekbacka');
  await bild(p, prefix + '-fall1-sovrummet');
  // Rörelse med joystick/tangenter + kollision
  const fore = await p.evaluate(() => window.__detektiv.motor.position());
  if (p.mobil) {
    const r = await p.locator('.rum3d-canvas').boundingBox();
    await p.evaluate(([x, y]) => {
      const c = document.querySelector('.rum3d-canvas');
      const ev = (t, yy) => c.dispatchEvent(new PointerEvent(t, { pointerId: 7, pointerType: 'touch', clientX: x, clientY: yy, bubbles: true }));
      ev('pointerdown', y); window.dispatchEvent(new PointerEvent('pointermove', { pointerId: 7, pointerType: 'touch', clientX: x, clientY: y - 45 }));
      window.__slapp = () => window.dispatchEvent(new PointerEvent('pointerup', { pointerId: 7, pointerType: 'touch', clientX: x, clientY: y - 45 }));
    }, [r.x + 80, r.y + r.height - 200]);
    await vanta(900); await p.evaluate(() => window.__slapp());
  } else { await p.keyboard.down('KeyW'); await vanta(900); await p.keyboard.up('KeyW'); }
  const efter = await p.evaluate(() => window.__detektiv.motor.position());
  assert.notDeepEqual(fore.pos, efter.pos, 'spelaren rörde sig inte');
  // Gå rakt in i väggen länge – ska stanna innanför
  await p.evaluate(() => window.__detektiv.motor.flyttaTill(-0.2, 0, 0));
  if (!p.mobil) { await p.keyboard.down('KeyW'); await vanta(4000); await p.keyboard.up('KeyW'); }
  else { await p.evaluate(() => { const m = window.__detektiv.motor; for (let i = 0; i < 400; i++) { m.kontroller.rorelse.y = 1; m.stega(0.03); } m.kontroller.rorelse.y = 0; }); }
  const vagg = await p.evaluate(() => window.__detektiv.motor.position());
  assert.ok(vagg.pos[1] > -2.7 + 0.2, 'gick igenom väggen/byrån: ' + vagg.pos);

  await undersok(p, 'fonster', 1.2, -0.9); await bild(p, prefix + '-fall1-inspektion'); await stangKort(p);
  await undersok(p, 'smyckeskrin', -0.6, -1.0); await stangKort(p);
  await undersok(p, 'askkopp', -1.4, 1.4); await stangKort(p);
  await undersok(p, 'vas', 1.9, -1.0); await stangKort(p);
  await undersok(p, 'fotspar', -0.3, 0.9); await stangKort(p);
  await undersok(p, 'bokhylla', 1.8, -0.6); await stangKort(p);
  await undersok(p, 'dorr', -1.2, 1.4);
  await p.locator('[data-ga]').click(); await vanta(800);
  assert.equal(await p.evaluate(() => window.__detektiv.rum()), 'koksgangen');
  await bild(p, prefix + '-fall1-koksgangen');
  await undersok(p, 'nyckelskap', 0.2, 1.0); await stangKort(p);
  await undersok(p, 'pulpet', 0.4, -0.2); await stangKort(p);
  await undersok(p, 'krokar', -0.3, 0.6); await stangKort(p);
  await undersok(p, 'saldorr', 0.3, -1.4);
  await p.locator('[data-ga]').click(); await vanta(800);
  assert.equal(await p.evaluate(() => window.__detektiv.rum()), 'matsalen');
  await undersok(p, 'gastlistan', -2.7, -1.6); await stangKort(p);
  await undersok(p, 'vinflaskan', 2.6, -0.3); await bild(p, prefix + '-fall1-vinflaskan'); await stangKort(p);
  await undersok(p, 'kallardorr', 2.0, -1.7); await stangKort(p);
  await p.evaluate(() => window.__detektiv.motor.flyttaTill(-0.5, 2.2, 20)); await vanta(400);
  await bild(p, prefix + '-fall1-matsalen');
  // Anteckningsboken i rummet
  await undersok(p, 'bok', -2.4, -1.5);
  await p.locator('.bok').waitFor(); await vanta(300);
  await bild(p, prefix + '-fall1-anteckningsbok');
  const antal = await p.locator('.fyndkort').count();
  assert.ok(antal >= 12, 'för få fynd: ' + antal);
  // Ledtråd 1
  await p.locator('[data-ledtrad]').last().click();
  await p.locator('[data-ta]').click(); await p.locator('[data-ja]').click(); await vanta(300);
  await bild(p, prefix + '-fall1-ledtrad');
  assert.match(await p.locator('.ledtradlista').innerText(), /fönstret/);
  await p.locator('.ledtradar [data-stang]').last().click(); await vanta(250);
  // Anklaga från boken – först fel
  await p.locator('.bok [data-anklaga]').click(); await vanta(300);
  if (felAnklagelse) {
    await p.locator('.valkort:has(input[value=gustav])').click();
    await p.locator('[data-anklaga]').last().click(); await vanta(300);
    await bild(p, prefix + '-fall1-fel-anklagelse');
    assert.match(await p.locator('.reaktion').innerText(), /Gustav rodnar/);
    await p.locator('[data-ok]').click(); await vanta(400);
    await p.locator('.hud-botten [data-anklaga]').click(); await vanta(300);
  }
  await p.locator('.valkort:has(input[value=holm])').click();
  await p.locator('input[name=hur][value="nyckel-2030"]').check();
  await p.locator('input[name=bevis][value="f-nycklar"]').check();
  await p.locator('input[name=bevis][value="f-vinflaskan"]').check();
  await bild(p, prefix + '-fall1-anklagelse');
  await p.locator('[data-anklaga]').last().click();
  await p.waitForFunction(() => location.hash.includes('upplosning')); await vanta(400);
  await bild(p, prefix + '-fall1-upplosning-topp');
  for (let i = 0; i < 20 && await p.locator('#nasta').isVisible(); i++) { await p.locator('#nasta').click(); await vanta(120); }
  await bild(p, prefix + '-fall1-upplosning', true);
  const txt = await p.locator('.upplosning').innerText();
  assert.match(txt, /Fallet är löst/);
  return txt;
}

async function fyllRutnat(p, t) {
  for (const [pers, rad] of Object.entries(t)) for (const v of Object.values(rad)) {
    const c = p.locator(`.cell[data-a="${pers}"][data-b="${v}"]`);
    for (let i = 0; i < 3 && !(await c.getAttribute('class')).includes('bock'); i++) await c.click();
  }
}

async function fall3(p, prefix, { misslyckas = false } = {}) {
  await startaFall(p, 'middagen-pa-solglantan');
  await bild(p, prefix + '-fall3-verandan');
  await undersok(p, 'bok', -2.0, 1.5);
  await p.locator('[data-flik^="rutnat"]').click(); await vanta(200);
  assert.match(await p.locator('.bok-sida').innerText(), /förhörsprotokollen/i);
  await p.locator('.bok [data-stang]').click(); await vanta(300);
  await undersok(p, 'glaset', 0.3, -2.3); await bild(p, prefix + '-fall3-glaset'); await stangKort(p);
  await undersok(p, 'protokollen', 1.6, 1.6); await stangKort(p);
  await undersok(p, 'vaskan', 2.0, -1.5); await stangKort(p);
  await undersok(p, 'bok', -2.0, 1.5);
  await p.locator('.rutnat').waitFor();
  // Fel men komplett placering först (advokaten på plats 4)
  await fyllRutnat(p, {
    astrid: { plats: 'p4', yrke: 'advokat', dryck: 'champagne' }, bertil: { plats: 'p1', yrke: 'pastor', dryck: 'sherry' },
    cecilia: { plats: 'p3', yrke: 'lakare', dryck: 'whisky' }, david: { plats: 'p2', yrke: 'konstnar', dryck: 'te' } });
  const st1 = await p.locator('.rutnat-status').innerText();
  assert.match(st1, /strider mot/, 'felaktig placering gav inte fel: ' + st1);
  await bild(p, prefix + '-fall3-rutnat-fel');
  await p.locator('[data-rensa]').click();
  if (!misslyckas) {
    await fyllRutnat(p, {
      cecilia: { plats: 'p1', yrke: 'advokat', dryck: 'sherry' }, david: { plats: 'p2', yrke: 'lakare', dryck: 'whisky' },
      astrid: { plats: 'p3', yrke: 'konstnar', dryck: 'champagne' }, bertil: { plats: 'p4', yrke: 'pastor', dryck: 'te' } });
    await p.locator('.ledtradskort li[data-l="L3"]').click();
    await vanta(300);
    assert.match(await p.locator('.rutnat-status').innerText(), /rekonstruerad/);
    await p.locator('.bok-sida').evaluate((e) => (e.scrollTop = 0));
    await bild(p, prefix + '-fall3-rutnat-lost');
  }
  await p.locator('.bok [data-anklaga]').click(); await vanta(300);
  if (misslyckas) {
    for (const vem of ['david', 'astrid']) {
      await p.locator(`.valkort:has(input[value=${vem}])`).click();
      await p.locator('[data-anklaga]').last().click(); await vanta(300);
      await p.locator('[data-ok]').click(); await vanta(400);
      if (vem === 'david') { await p.locator('.hud-botten [data-anklaga]').click(); await vanta(300); }
    }
  } else {
    await p.locator('.valkort:has(input[value=bertil])').click();
    await p.locator('input[name=hur][value="plats4"]').check();
    await p.locator('input[name=bevis][value="f-placering"]').check();
    await p.locator('input[name=bevis][value="f-spill"]').check();
    await p.locator('[data-anklaga]').last().click();
  }
  await p.waitForFunction(() => location.hash.includes('upplosning')); await vanta(300);
  await p.locator('#allt').click(); await vanta(200);
  await bild(p, prefix + '-fall3-upplosning', true);
  return p.locator('.upplosning').innerText();
}

const browser = await chromium.launch({ args: ARGS });
try {
  // iPhone 390x844
  const m = await nySida(browser, true, 'iphone');
  await m.goto(BAS + '?nosw'); await vanta(600); await bild(m, 'iphone-meny');
  await m.goto(BAS + '?nosw#/fall/halsbandet-pa-ekbacka'); await vanta(400); await bild(m, 'iphone-fall1-presentation', true);
  const t1 = await fall1(m, 'iphone');
  console.log('Fall 1 (iPhone):', /3 av 3|2 av 3|1 av 3/.exec(t1)?.[0], '| fel anklagelser: Gustav');
  const t3fel = await fall3(m, 'iphone-misslyckat', { misslyckas: true });
  assert.match(t3fel, /olöst/);
  console.log('Fall 3 (iPhone): två fel anklagelser → upplösning visas');
  await m.goto(BAS + '?nosw'); await vanta(600); await bild(m, 'iphone-meny-efter');
  console.log('FPS (swiftshader, mjukvara):', await m.evaluate(() => window.__fps));
  // Skrivbord
  const d = await nySida(browser, false, 'desktop');
  const t3 = await fall3(d, 'desktop');
  console.log('Fall 3 (desktop):', /\d av 3/.exec(t3)?.[0]);
  const t1d = await fall1(d, 'desktop', { felAnklagelse: false });
  console.log('Fall 1 (desktop):', /\d av 3/.exec(t1d)?.[0]);
  await d.goto(BAS + '?nosw'); await vanta(600); await bild(d, 'desktop-meny');
} finally {
  await browser.close();
}
const verkligaFel = fel.filter((x) => !/GPU stall|swiftshader|WebGL|GL_/i.test(x));
console.log(verkligaFel.length ? 'KONSOLFEL:\n' + verkligaFel.join('\n') : 'Inga konsolfel ✓');
if (fel.length !== verkligaFel.length) console.log('(ignorerade drivrutinsvarningar:', fel.length - verkligaFel.length, ')');
process.exit(verkligaFel.length ? 1 : 0);
