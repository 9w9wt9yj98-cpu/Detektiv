// Fall 9 – Fjällgården, 1968: kallt fall i nutid. Tre rum (skidrummet, lobbyn, polisens arkiv), dokumentanalys
// av akten från 1968 mot fyndet bakom panelen, slutsatser, tidshopp; fel och rätt anklagelse.
import { assert, vanta, nySida, bild, undersok, inspektera, stangKort, gaTill, startaFall, oppnaBok, stangBok, besvaraSlutsatser, anklaga, upplosning, raknare } from '../hjalp.mjs';
const ID = 'fjallgarden-1968';

async function hittaAllt(p) {
  await undersok(p, 'panelen', 0.0, 0.2); await bild(p, 'f9-panelen'); await stangKort(p);
  for (const o of ['vaskan', 'skiddorren', 'varuintaget', 'jonas']) { await inspektera(p, o); await stangKort(p); }
  await gaTill(p, 'trappan', 'lobbyn');
  await bild(p, 'f9-lobbyn');
  for (const o of ['klockboken', 'snickarboken', 'fotot', 'sune', 'linnea']) { await inspektera(p, o); await stangKort(p); }
  await gaTill(p, 'kallardorr', 'skidrummet');
  await inspektera(p, 'trappan'); await stangKort(p); // fyndet om källartrappan
  await gaTill(p, 'trappan', 'lobbyn');
  await gaTill(p, 'ytterdorr', 'arkivet');
  await bild(p, 'f9-arkivet');
  for (const o of ['akten', 'obduktionen', 'nils', 'notorna', 'bridge', 'telefon']) { await inspektera(p, o); await stangKort(p); }
}
async function valj(p, id) {
  const dok = await p.evaluate((id) => {
    const m = window.__detektiv.f.moment.find((x) => x.id === 'akten');
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
  const p = await nySida(browser, mobil, 'f9-ratt');
  await startaFall(p, ID);
  await bild(p, 'f9-skidrummet');
  // Lobbyn är låst tills fyndet bakom panelen är undersökt
  await inspektera(p, 'trappan');
  assert.match(await p.locator('.modal-bakgrund.oppen').innerText(), /Titta på fyndet först/);
  await stangKort(p);
  await hittaAllt(p);
  const [, a, b] = (await raknare(p)).match(/(\d+)\/(\d+)/);
  assert.equal(a, b, 'allt borde vara hittat');
  await oppnaBok(p, 'slutsatser');
  assert.equal(await besvaraSlutsatser(p), 1);
  await p.locator('[data-flik="mek:akten"]').click(); await vanta(250);
  await p.locator('.jamfor.dok').waitFor();
  assert.match(await p.locator('.jf-status').innerText(), /0 av 6/);
  // Fel par kostar inget
  assert.match(await invand(p, 'p-bar', 'b-per'), /kan mycket väl stämma/);
  await p.locator('[data-rensa]').click(); await vanta(100);
  assert.match(await invand(p, 'c-skiddorr', 's-last'), /Invändning!.*kistlås/);
  assert.match(await invand(p, 'c-skiddorr', 'fr-anorak'), /Invändning!.*anorak/);
  assert.match(await invand(p, 'c-skiddorr', 'fr-skidor'), /aldrig ut på skidor/);
  assert.match(await invand(p, 'h-klockan', 'k-17'), /Fröken Ur/);
  assert.match(await invand(p, 'c-vanner', 'fr-brev'), /förlovade/);
  assert.match(await invand(p, 'p-pratade', 'b-gral'), /grälade/);
  assert.match(await p.locator('.jf-status').innerText(), /6 av 6/);
  await p.locator('[data-dok="dok-fyndrapport"]').click(); await vanta(150);
  await bild(p, 'f9-akten');
  await p.locator('[data-flik="slutsatser"]').click(); await vanta(200);
  assert.equal(await besvaraSlutsatser(p, { provaFel: false }), 6);
  await stangBok(p);
  await anklaga(p, 'holst');
  assert.match(await p.locator('.reaktion').innerText(), /telefon/);
  await p.locator('[data-ok]').click(); await vanta(300);
  await anklaga(p, 'claes', { hur: 'panelen', bevis: ['f-dorren', 'f-bara-claes', 'f-snickarbok'] });
  const txt = await upplosning(p, 'f9-upplosning-ratt');
  assert.match(txt, /Fallet är löst/);
  assert.match(txt, /Tofflor/);
  await p.context().close();
  console.log('Fall 9: tre rum, dokument (fel par → 6 motsägelser), 7 slutsatser, fel → rätt anklagelse, tidshopp ✓');
}

export async function fel(browser) {
  const p = await nySida(browser, true, 'f9-fel');
  await startaFall(p, ID);
  await p.locator('[data-ledtrad]').click();
  assert.match(await p.locator('.ledtradar .nasta-steg').innerText(), /här i skidrummet/);
  await p.locator('[data-ta]').click(); await p.locator('[data-ja]').click(); await vanta(300);
  const lt = await p.locator('.ledtradlista').innerText();
  assert.match(lt, /jämföra fyndet bakom panelen/);
  assert.match(await p.locator('.ledtradlista .pekare').innerText(), /skidrummet/, 'pekaren pekar fel: ' + lt);
  await bild(p, 'f9-ledtrad');
  await p.locator('.ledtradar [data-stang]').last().click(); await vanta(300);
  await anklaga(p, 'per');
  assert.match(await p.locator('.reaktion').innerText(), /bardisken/);
  await p.locator('[data-ok]').click(); await vanta(300);
  await anklaga(p, 'ester');
  await p.locator('[data-ok]').click();
  const txt = await upplosning(p, 'f9-upplosning-misslyckad');
  assert.match(txt, /Den skyldige: Claes Rydén/);
  assert.match(txt, /panelen/);
  await p.context().close();
  console.log('Fall 9: ledtråd pekar rätt, två fel → full förklaring med tidshopp ✓');
}
