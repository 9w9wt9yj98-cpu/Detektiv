// Fall 5 – Kvart i elva: fyra miljöer (urmakeriet, gatan i snö, poliskammaren, Rapps kök), tidslinje med gångtider,
// motsägelser, prövning mot brottstiden, slutsatser, fel och rätt anklagelse.
import { assert, vanta, nySida, bild, undersok, inspektera, stangKort, gaTill, startaFall, oppnaBok, stangBok, besvaraSlutsatser, anklaga, upplosning, raknare } from '../hjalp.mjs';
const ID = 'kvart-i-elva';

async function hittaAllt(p) {
  await undersok(p, 'monter', 0.4, 0.9); await bild(p, 'f5-montern'); await stangKort(p);
  for (const o of ['lucka', 'vaggur', 'span', 'handske', 'kassabok', 'faltskog']) { await inspektera(p, o); await stangKort(p); }
  await gaTill(p, 'dorr-ut', 'gatan');
  await vanta(600); await bild(p, 'f5-gatan');
  await undersok(p, 'vaktaren', 0.3, 3.0); await stangKort(p);
  for (const o of ['ekdahl', 'karl']) { await inspektera(p, o); await stangKort(p); }
  await gaTill(p, 'dorr-polis', 'poliskammaren');
  await bild(p, 'f5-poliskammaren');
  for (const o of ['liggaren', 'intyget', 'protokollet', 'biljetten', 'karta', 'lindh', 'strand']) { await inspektera(p, o); await stangKort(p); }
  await gaTill(p, 'dorr', 'gatan');
  await gaTill(p, 'droska', 'rapps-hem');
  await bild(p, 'f5-rapps-kok');
  for (const o of ['ritningen', 'kokur', 'rocken', 'rapp', 'hilma']) { await inspektera(p, o); await stangKort(p); }
}
const besked = (p) => p.locator('.tidslinje .bj-besked-ruta').innerText();
async function lagg(p, kort, person) {
  await p.locator(`[data-kort="${kort}"]`).click(); await vanta(120);
  await p.locator(`[data-lagg="${person}"]`).click(); await vanta(160);
  return besked(p);
}

export async function ratt(browser, mobil = true) {
  const p = await nySida(browser, mobil, 'f5-ratt');
  await startaFall(p, ID);
  await bild(p, 'f5-urmakeriet');
  // Poliskammaren är låst tills Fältskog berättat om nycklarna
  await gaTill(p, 'dorr-ut', 'gatan');
  await inspektera(p, 'dorr-polis');
  assert.match(await p.locator('.modal-bakgrund.oppen').innerText(), /vilka som har nyckel/);
  await stangKort(p);
  await gaTill(p, 'dorr-butik', 'urmakeriet');
  await hittaAllt(p);
  const [, a, b] = (await raknare(p)).match(/(\d+)\/(\d+)/);
  assert.equal(a, b, 'allt borde vara hittat');

  await oppnaBok(p, 'mek:tidslinjen');
  await p.locator('.tidslinje').waitFor();
  assert.match(await p.locator('.tl-brottrad').innerText(), /inte fastställd/);
  // Fel person först – kostar inget
  assert.match(await lagg(p, 'k-karl-pant', 'rapp'), /handlar inte om Anders Rapp/);
  await p.locator('[data-kort="k-karl-pant"]').click(); await vanta(100); // avmarkera
  const plan = [['k-faltskog-grand', 'faltskog'], ['k-karl-pastar', 'karl'], ['k-karl-freden1', 'karl'], ['k-karl-pant', 'karl'], ['k-karl-freden2', 'karl'],
    ['k-rapp-gillet', 'rapp'], ['k-rapp-pastar', 'rapp'], ['k-rapp-hem', 'rapp'], ['k-lindh-sparvagn', 'lindh']];
  for (const [k, pid] of plan) assert.match(await lagg(p, k, pid), /Lagt på/);
  const rapp = await p.locator('[data-bana="rapp"]').innerText();
  assert.match(rapp, /20 min oförklarade/, 'Rapps lucka syns inte: ' + rapp);
  await p.locator('[data-invand="m-karl"]').click(); await vanta(250);
  assert.match(await besked(p), /Invändning!.*pantlånekontoret/);
  await p.locator('[data-invand="m-rapp"]').click(); await vanta(250);
  assert.match(await besked(p), /20 minuter för sent/);
  // Brottstiden fastställs i slutsatserna
  await p.locator('[data-flik="slutsatser"]').click(); await vanta(200);
  assert.equal(await besvaraSlutsatser(p), 4);
  await p.locator('[data-flik="mek:tidslinjen"]').click(); await vanta(250);
  assert.match(await p.locator('.tl-brottrad').innerText(), /22\.45–22\.47/);
  for (const [pid, re] of [['faltskog', /Grand Hôtel/], ['karl', /tidigast 23\.00/], ['lindh', /spårvagnen/], ['rapp', /på minuten/]]) {
    await p.locator(`[data-prova="${pid}"]`).click(); await vanta(250);
    assert.match(await besked(p), re);
  }
  assert.match(await p.locator('.tidslinje .jf-status').innerText(), /6 av 6/);
  await p.locator('[data-bana="karl"]').scrollIntoViewIfNeeded();
  await bild(p, 'f5-tidslinje');
  await p.locator('[data-bana="rapp"]').scrollIntoViewIfNeeded();
  await bild(p, 'f5-tidslinje-rapp');
  await p.locator('[data-flik="slutsatser"]').click(); await vanta(200);
  assert.equal(await besvaraSlutsatser(p, { provaFel: false }), 2);
  await stangBok(p);
  await anklaga(p, 'karl');
  assert.match(await p.locator('.reaktion').innerText(), /Pantlånekontoret/);
  await p.locator('[data-ok]').click(); await vanta(300);
  await anklaga(p, 'rapp', { hur: 'omvag', bevis: ['f-rapp-hinner', 'f-rapp-lucka', 'f-ekspan-rapp'] });
  const txt = await upplosning(p, 'f5-upplosning-ratt');
  assert.match(txt, /Fallet är löst/);
  await p.context().close();
  console.log('Fall 5: fyra rum, tidslinje (fel person → 9 kort, 2 motsägelser, 4 prövningar), 6 slutsatser, fel → rätt anklagelse ✓');
}

export async function fel(browser) {
  const p = await nySida(browser, true, 'f5-fel');
  await startaFall(p, ID);
  await p.locator('[data-ledtrad]').click(); await p.locator('[data-ta]').click(); await p.locator('[data-ja]').click(); await vanta(300);
  const lt = await p.locator('.ledtradlista').innerText();
  assert.match(lt, /Österlånggatan|väggklockan|Nattväktare/, 'ledtråden pekar inte ut källorna: ' + lt);
  await bild(p, 'f5-ledtrad');
  await p.locator('.ledtradar [data-stang]').last().click(); await vanta(300);
  await anklaga(p, 'lindh');
  await p.locator('[data-ok]').click(); await vanta(300);
  await anklaga(p, 'faltskog');
  await p.locator('[data-ok]').click();
  const txt = await upplosning(p, 'f5-upplosning-misslyckad');
  assert.match(txt, /Den skyldige: Anders Rapp/);
  assert.match(txt, /ekspån/);
  await p.context().close();
  console.log('Fall 5: ledtråd pekar ut källorna, två fel → full förklaring ✓');
}
