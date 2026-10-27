// Gemensamma hjälpfunktioner för Playwright-testerna.
import { chromium } from 'playwright';
import assert from 'node:assert/strict';
export { assert };
export const BAS = (process.env.BAS || 'http://localhost:18431/').replace(/\/?$/, '/');
export const ARGS = ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'];
export const fel = [];
export const vanta = (ms) => new Promise((r) => setTimeout(r, ms));
export const startaWebblasare = () => chromium.launch({ args: ARGS });

export async function nySida(browser, mobil, namn, { guideKlar = true } = {}) {
  const ctx = await browser.newContext(mobil
    ? { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1' }
    : { viewport: { width: 1280, height: 800 } });
  if (guideKlar) await ctx.addInitScript(() => { if (!localStorage.getItem('detektiv:v1')) localStorage.setItem('detektiv:v1', JSON.stringify({ fall: {}, installningar: { autofyll: true, handledningKlar: true, settBokBanner: true } })); });
  const p = await ctx.newPage();
  p.setDefaultTimeout(15000);
  p.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') fel.push(`[${namn}] ${m.type()}: ${m.text()}`); });
  p.on('pageerror', (e) => fel.push(`[${namn}] pageerror: ${e.message}`));
  p.mobil = mobil;
  return p;
}
export const bild = (p, namn, fullPage = false) => p.screenshot({ path: `shots/${namn}.png`, fullPage });

/** Ställ dig vid (x,z), titta på föremålet och tryck på det på riktigt (raycast). */
export async function undersok(p, id, x, z, { viaKnapp = false } = {}) {
  await p.evaluate(([id, x, z]) => { const m = window.__detektiv.motor; if (x !== null) m.flyttaTill(x, z); m.tittaPa(id); }, [id, x ?? null, z ?? null]);
  await vanta(350);
  if (viaKnapp) {
    await p.locator('[data-fokus]:not([hidden])').waitFor({ timeout: 3000 });
    await p.locator('[data-fokus]').click();
  } else {
    const pos = await p.evaluate((id) => window.__detektiv.motor.projicera(id), id);
    assert.ok(pos?.synlig, `${id} syns inte`);
    const r = await p.locator('.rum3d-canvas').boundingBox();
    const px = r.x + pos.x * r.width, py = r.y + pos.y * r.height;
    if (p.mobil) await p.touchscreen.tap(px, py); else await p.mouse.click(px, py);
  }
  await p.locator('.modal-bakgrund.oppen, .bok-bakgrund.oppen').first().waitFor({ timeout: 4000 });
  await vanta(200);
}
/** Snabbare: undersök via testkroken (används för att gå igenom många föremål). */
export async function inspektera(p, id) {
  await p.evaluate((id) => window.__detektiv.inspektera(id), id);
  await p.locator('.modal-bakgrund.oppen').first().waitFor({ timeout: 4000 });
  await vanta(150);
}
export async function stangKort(p) { await p.locator('.modal-bakgrund.oppen [data-stang]').last().click(); await vanta(250); }
export async function gaTill(p, dorrId, rumId) {
  await inspektera(p, dorrId);
  await p.locator('[data-ga]').click(); await vanta(700);
  assert.equal(await p.evaluate(() => window.__detektiv.rum()), rumId);
}
export async function startaFall(p, id, { nollstall = true } = {}) {
  await p.goto(BAS + '?nosw#/fall/' + id);
  if (nollstall) await p.evaluate((id) => { const d = JSON.parse(localStorage.getItem('detektiv:v1')); if (!d) return; delete d.fall[id]; localStorage.setItem('detektiv:v1', JSON.stringify(d)); }, id);
  await p.goto(BAS + '?nosw#/fall/' + id);
  await p.reload();
  await p.locator('#start').click();
  await p.locator('.rum3d-canvas').waitFor();
  await vanta(1200);
}
export async function oppnaBok(p, flik) {
  await p.locator('[data-bok]').click(); await p.locator('.bok').waitFor(); await vanta(250);
  if (flik) { await p.locator(`[data-flik="${flik}"]`).click(); await vanta(200); }
}
export async function stangBok(p) { await p.locator('.bok [data-stang]').click(); await vanta(300); }
/** Besvarar alla slutsatsfrågor som är redo: först ett fel alternativ (om det finns), sedan rätt. */
export async function besvaraSlutsatser(p, { provaFel = true } = {}) {
  const f = await p.evaluate(() => window.__detektiv.f.slutsatser || []);
  let antal = 0;
  for (let varv = 0; varv < 20; varv++) {
    const redo = p.locator('.slutsats.redo').first();
    if (!(await redo.count())) break;
    const sid = await redo.getAttribute('data-s');
    const s = f.find((x) => x.id === sid);
    const ratt = s.alternativ.findIndex((a) => a.ratt);
    if (provaFel && antal === 0) {
      const felJ = s.alternativ.findIndex((a) => !a.ratt);
      await redo.locator(`.alt[data-j="${felJ}"]`).click(); await vanta(150);
      assert.ok(await p.locator('.sfel').count(), 'fel svar gav ingen återkoppling');
    }
    await p.locator(`.slutsats.redo[data-s="${sid}"] .alt[data-j="${ratt}"]`).click(); await vanta(200);
    antal++;
  }
  return antal;
}
export async function anklaga(p, vem, { hur, bevis = [], fran = 'hud' } = {}) {
  if (fran === 'hud') await p.locator('.hud-botten [data-anklaga]').click(); else await p.locator('.bok [data-anklaga]').click();
  await vanta(300);
  await p.locator(`.valkort:has(input[value="${vem}"])`).click();
  if (hur) await p.locator(`input[name=hur][value="${hur}"]`).check();
  for (const b of bevis) await p.locator(`input[name=bevis][value="${b}"]`).check();
  await p.locator('.anklagelse [data-anklaga]').click(); await vanta(350);
}
export async function upplosning(p, namn) {
  await p.waitForFunction(() => location.hash.includes('upplosning')); await vanta(300);
  for (let i = 0; i < 25 && await p.locator('#nasta').isVisible(); i++) { await p.locator('#nasta').click(); await vanta(100); }
  if (namn) await bild(p, namn, true);
  return p.locator('.upplosning').innerText();
}
export async function raknare(p) { return p.locator('[data-platser]').innerText(); }
export function rapporteraFel() {
  const verkliga = fel.filter((x) => !/GPU stall|swiftshader|WebGL|GL_|Automatic fallback to software/i.test(x));
  console.log(verkliga.length ? 'KONSOLFEL:\n' + verkliga.join('\n') : 'Inga konsolfel ✓');
  return verkliga.length;
}
