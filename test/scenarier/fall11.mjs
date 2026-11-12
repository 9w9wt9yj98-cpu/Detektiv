// Fall 11 – Låda sju: tre rum (ritkontoret, disponentens rum, gruvbacken), bildjämförelse med fyra fotografier
// (oviktiga skillnader, "jämför närmare i tid" och fem upptäckter), 7 slutsatser, ledtråd, fel och rätt anklagelse.
import { assert, vanta, nySida, bild, inspektera, stangKort, gaTill, startaFall, oppnaBok, stangBok, besvaraSlutsatser, anklaga, upplosning, raknare } from '../hjalp.mjs';
const ID = 'lada-sju';

async function hittaAllt(p) {
  for (const o of ['ladan', 'falk', 'maj', 'kameraskapet', 'kappan', 'lillabordet']) { await inspektera(p, o); await stangKort(p); }
  await gaTill(p, 'dorr-disp', 'disponenten');
  await bild(p, 'f11-disponenten');
  for (const o of ['brandel', 'besoksboken', 'kessler', 'portfoljen', 'elsa']) { await inspektera(p, o); await stangKort(p); }
  await gaTill(p, 'dorr', 'ritkontoret');
  await gaTill(p, 'dorr-ut', 'gruvbacken');
  await bild(p, 'f11-gruvbacken');
  for (const o of ['nedfartsboken', 'ek', 'storm']) { await inspektera(p, o); await stangKort(p); }
}
async function valjPar(p, a, b) {
  for (let i = 0; i < 5; i++) {
    const par = await p.evaluate(() => window.__detektiv.st.mek.bilderna.par);
    if (par.includes(a) && par.includes(b)) return par;
    const nasta = !par.includes(a) && par[1] !== b ? a : !par.includes(b) ? b : a;
    await p.locator(`[data-bild="${nasta}"]`).click(); await vanta(150);
  }
  throw new Error(`kunde inte välja ${a} + ${b}`);
}
async function tryck(p, bildId, region) {
  const par = await p.evaluate(() => window.__detektiv.st.mek.bilderna.par);
  const i = par.indexOf(bildId);
  await p.locator(`.bj-foto[data-i="${i}"] [data-r="${region}"]`).last().locator(':scope > :last-child').click({ force: true });
  await vanta(250);
  return p.locator('.bj-besked-ruta').innerText();
}

export async function ratt(browser, mobil = true) {
  const p = await nySida(browser, mobil, 'f11-ratt');
  await startaFall(p, ID);
  await bild(p, 'f11-ritkontoret');
  // De andra rummen är låsta tills lådan är undersökt
  await inspektera(p, 'dorr-disp');
  assert.match(await p.locator('.modal-bakgrund.oppen').innerText(), /Lådan först/);
  await stangKort(p);
  await hittaAllt(p);
  const [, a, b] = (await raknare(p)).match(/(\d+)\/(\d+)/);
  assert.equal(a, b, 'allt borde vara hittat');
  await oppnaBok(p, 'mek:bilderna');
  await p.locator('.bildjamf').waitFor();
  await valjPar(p, 'bild-a', 'bild-b');
  assert.match(await tryck(p, 'bild-b', 'klocka'), /journal/);
  assert.match(await tryck(p, 'bild-b', 'remsa'), /öppnats och förseglats om/);
  assert.match(await tryck(p, 'bild-b', 'ved'), /bar in ved/);
  assert.match(await tryck(p, 'bild-b', 'gardin'), /nerdragen/);
  assert.match(await tryck(p, 'bild-b', 'lampa'), /lilla bordet/);
  await p.locator('.bj-foto').first().scrollIntoViewIfNeeded();
  await bild(p, 'f11-bildjamforelse');
  // För långt isär i tid: remsan är viktig, men svaret är att jämföra närmare
  await valjPar(p, 'bild-a', 'bild-d');
  assert.match(await tryck(p, 'bild-d', 'remsa'), /närmare varandra i tid/);
  await valjPar(p, 'bild-b', 'bild-d');
  assert.match(await tryck(p, 'bild-d', 'remsa'), /sista bilden där den fortfarande är hel/);
  await valjPar(p, 'bild-c', 'bild-d');
  assert.match(await tryck(p, 'bild-d', 'person'), /olika personer/);
  assert.match(await tryck(p, 'bild-d', 'remsa'), /15\.20 och 16\.35/);
  const stTxt = await p.locator('.bildjamf .jf-status').evaluate((e) => e.textContent + ' ' + JSON.stringify(window.__detektiv.st.mek.bilderna.hittade));
  assert.match(stTxt, /5 av 5/, stTxt);
  await p.locator('[data-flik="slutsatser"]').click(); await vanta(200);
  assert.equal(await besvaraSlutsatser(p), 7);
  await bild(p, 'f11-slutsatser');
  await stangBok(p);
  await anklaga(p, 'kessler');
  assert.match(await p.locator('.reaktion').innerText(), /tåg från Örebro/);
  await p.locator('[data-ok]').click(); await vanta(300);
  await anklaga(p, 'maj', { hur: 'repro', bevis: ['f-brottstid', 'f-maj-ensam', 'f-kameran'] });
  const txt = await upplosning(p, 'f11-upplosning-ratt');
  assert.match(txt, /Fallet är löst/);
  await p.context().close();
  console.log('Fall 11: tre rum, bildjämförelse (oviktigt, närmare i tid, 5 upptäckter), 7 slutsatser, fel → rätt anklagelse ✓');
}

export async function fel(browser) {
  const p = await nySida(browser, true, 'f11-fel');
  await startaFall(p, ID);
  await p.locator('[data-ledtrad]').click();
  assert.match(await p.locator('.ledtradar .nasta-steg').innerText(), /här i ritkontoret/);
  await p.locator('[data-ta]').click(); await p.locator('[data-ja]').click(); await vanta(300);
  const lt = await p.locator('.ledtradlista').innerText();
  assert.match(lt, /titta noga på ritningsskåpet/);
  await p.locator('.ledtradar [data-stang]').last().click(); await vanta(300);
  await anklaga(p, 'falk');
  assert.match(await p.locator('.reaktion').innerText(), /under jord/);
  await p.locator('[data-ok]').click(); await vanta(300);
  await anklaga(p, 'elsa');
  await p.locator('[data-ok]').click();
  const txt = await upplosning(p, 'f11-upplosning-misslyckad');
  assert.match(txt, /Den skyldige: Maj Lindgren/);
  assert.match(txt, /reprokamera/);
  await p.context().close();
  console.log('Fall 11: ledtråd pekar rätt, två fel → full förklaring ✓');
}
