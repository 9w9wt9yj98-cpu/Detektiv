// Utredningen: förstapersonsvy i 3D med HUD, inspektionskort, anteckningsbok, ledtrådar och anklagelse.
import { laddaFall, fyndMap, rumMoment, arUpplast, fallTitel, materialMap, objektGer, rakning, uppdateraHarlett, kallor } from '../motor/fall.js';
import { fallData, spara, installningar } from '../motor/lagring.js';
import { MAX_FEL } from '../motor/poang.js';
import { bokMoment } from '../mekaniker/index.js';
import { oppnaAnteckningsbok, oppnaLedtradar } from './anteckningsbok.js';
import { oppnaAnklagelse, avslutaFall } from './anklagelse.js';
import { startaHandledning } from './handledning.js';
import { esc, modal, toast, lampa, bokIkon, hemIkon, $ } from './gemensamt.js';

function webglFinns() {
  try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch { return false; }
}
const MATERIAL_ETIKETT = { utsaga: 'Utsaga', dokument: 'Dokument', bild: 'Bild', kort: 'Tidskort' };

export async function visaUtredning(app, id) {
  const f = await laddaFall(id);
  const st = fallData(id);
  if (st.status === 'lost' || st.status === 'misslyckad') { location.hash = `#/fall/${id}/upplosning`; return null; }
  if (st.status !== 'pagaende') { st.status = 'pagaende'; spara(); }
  const fynd = fyndMap(f);
  const material = materialMap(f);
  const rum = rumMoment(f);
  uppdateraHarlett(f, st);
  document.title = fallTitel(f) + ' · Detektiv';
  const touch = matchMedia('(pointer: coarse)').matches;

  app.innerHTML = `<div class="utredning" style="--accent:${f.meta.accentfarg}">
    <header class="hud-topp">
      <a class="ikonknapp" href="#/fall/${id}" aria-label="Till fallets presentation">${hemIkon()}</a>
      <div class="hud-titel"><h1>${esc(fallTitel(f))}</h1><span class="rumnamn"></span></div>
      <button class="ikonknapp" data-ledtrad aria-label="Ledtrådar">${lampa()}<span class="bricka"></span></button>
      <button class="ikonknapp liten-bok" data-bok aria-label="Öppna anteckningsboken">${bokIkon()}<span class="bricka fyndantal"></span></button>
      <div class="hud-mal"><span class="mal">${esc(f.meta.mal || f.intro.uppdrag)}</span><button class="raknare" data-platser aria-label="Visa platser och fynd kvar"></button></div>
    </header>
    <div class="rum3d"></div>
    <div class="vinjett" aria-hidden="true"></div>
    <button class="fokus-knapp" data-fokus hidden></button>
    <div class="hud-botten">
      <p class="hud-tips"></p>
      <button class="knapp massing anklaga-knapp" data-anklaga>Anklaga<small></small></button>
    </div>
  </div>`;
  const behallare = $('.rum3d', app);
  const uppdateraHud = () => {
    $('[data-ledtrad] .bricka', app).textContent = f.ledtradar.length - st.ledtradar;
    const r = rakning(f, st);
    $('.fyndantal', app).textContent = st.fynd.length;
    const rk = $('[data-platser]', app);
    rk.textContent = `Fynd ${r.hittat}/${r.total}`;
    rk.classList.toggle('klar', r.hittat >= r.total);
    const x = r.perRum[aktuelltRum?.id];
    $('.rumnamn', app).textContent = x ? `${x.namn} · ${x.hittat >= x.total ? 'allt hittat här ✓' : `${x.total - x.hittat} kvar här`}` : '';
    const kvar = MAX_FEL - st.fel.length;
    $('.anklaga-knapp small', app).textContent = `${kvar} försök`;
  };
  let aktuelltRum = rum.find((m) => m.id === st.rum && arUpplast(m, st)) || rum[0];
  uppdateraHud();

  if (!webglFinns()) {
    behallare.innerHTML = '<div class="papperskort">Din webbläsare saknar stöd för 3D (WebGL). Utredningen kan inte visas.</div>';
    return null;
  }
  const { Rum3D } = await import('../tre/motor3d.js');
  let modalOppen = 0;
  const pausa = () => { modalOppen++; motor.pausa(); fokusKnapp.hidden = true; };
  const fortsatt = () => { modalOppen = Math.max(0, modalOppen - 1); if (!modalOppen) motor.starta(); uppdateraHud(); visaFokus(motor.fokus?.def || null); };

  const fokusKnapp = $('[data-fokus]', app);
  let fokusDef = null;
  function visaFokus(def) {
    fokusDef = def;
    if (!def || modalOppen) { fokusKnapp.hidden = true; return; }
    const namn = def.funktion === 'anteckningsbok' ? 'Öppna anteckningsboken' : def.gar_till && !def.interaktiv?.ger_fynd ? (def.interaktiv?.namn || 'Dörren') : (def.interaktiv?.namn || 'Föremålet');
    const klar = st.inspekterade.includes(def.id) && !def.funktion && !def.gar_till;
    fokusKnapp.innerHTML = `<span aria-hidden="true">${def.funktion === 'anteckningsbok' ? '📖' : def.gar_till ? '🚪' : '🔍'}</span> ${esc(namn)}${klar ? ' <small>(undersökt)</small>' : ''}`;
    fokusKnapp.classList.toggle('undersokt', klar);
    fokusKnapp.hidden = false;
  }
  fokusKnapp.onclick = () => { if (fokusDef) inspektera(fokusDef); };

  const motor = new Rum3D(behallare, { onInspektera: inspektera, onMeddelande: toast, onFokus: visaFokus });

  function laddaRum(m, { anvandSparad = false } = {}) {
    aktuelltRum = m;
    st.rum = m.id;
    const inspekterade = new Set(st.inspekterade);
    motor.ladda(m.payload.rum, { inspekterade, position: anvandSparad && st.position ? st.position : null });
    spara();
    uppdateraHud();
  }
  laddaRum(aktuelltRum, { anvandSparad: true });
  motor.starta();

  function upplasta() { return new Set(f.moment.filter((m) => arUpplast(m, st)).map((m) => m.id)); }
  function nyaUpplasningar(fore) {
    for (const m of f.moment) {
      if (!fore.has(m.id) && arUpplast(m, st)) {
        if (m.mekanik === 'scen') toast(`Ny plats öppnad: ${m.namn}`);
        else toast(`Nytt i anteckningsboken: ${m.namn}`);
      }
    }
  }

  let guide = null;
  function inspektera(def) {
    if (def.funktion === 'anteckningsbok') { oppnaBok(); return; }
    const i = def.interaktiv || {};
    const fore = upplasta();
    const ger = objektGer(def);
    const nya = ger.fynd.filter((fid) => !st.fynd.includes(fid));
    const nyaM = ger.material.filter((mid) => !st.material.includes(mid));
    const gamla = ger.fynd.length + ger.material.length - nya.length - nyaM.length;
    st.fynd.push(...nya);
    st.material.push(...nyaM);
    const harlett = uppdateraHarlett(f, st);
    if (!st.inspekterade.includes(def.id)) st.inspekterade.push(def.id);
    motor.markera(def.id);
    spara();
    const mal = def.gar_till ? f.moment.find((m) => m.id === def.gar_till) : null;
    const malOppet = mal && arUpplast(mal, st);
    pausa();
    const citat = nyaM.filter((mid) => material[mid]?.typ === 'utsaga');
    const ovrigt = [...nyaM.filter((mid) => material[mid]?.typ !== 'utsaga'), ...harlett];
    const m = modal(`<div class="inspektion">
      <h3>${esc(i.namn || 'Föremål')}</h3>
      ${i.text ? `<p class="modal-text">${esc(i.text)}</p>` : ''}
      ${citat.map((mid) => `<blockquote class="replik">${esc(material[mid].text)}</blockquote>`).join('')}
      ${nya.length || nyaM.length || harlett.length ? `<div class="nytt-fynd"><span>Nytt i anteckningsboken</span>
        ${nya.map((fid) => `<div class="fyndrad"><span class="fyndikon">${esc(fynd[fid].ikon || '')}</span> ${esc(fynd[fid].titel)}</div>`).join('')}
        ${citat.length ? `<div class="fyndrad"><span class="fyndikon">🗨️</span> ${citat.length} ${citat.length === 1 ? 'utsaga' : 'utsagor'} till förhörsprotokollet</div>` : ''}
        ${ovrigt.map((mid) => `<div class="fyndrad"><span class="fyndikon">${material[mid].ikon || '📄'}</span> ${esc(MATERIAL_ETIKETT[material[mid].typ] || '')}: ${esc(material[mid].titel || material[mid].person || '')}</div>`).join('')}
      </div>` : ''}
      ${!nya.length && !nyaM.length && gamla ? '<p class="bok-not">Redan antecknat.</p>' : ''}
      ${mal && !malOppet ? `<p class="last">${esc(mal.last_text || 'Du har ingen anledning att gå dit än.')}</p>` : ''}
      <div class="knapprad">
        ${mal && malOppet ? `<button class="knapp massing" data-ga>Gå till ${esc(mal.namn)} →</button>` : ''}
        <button class="knapp ${mal && malOppet ? 'sekundar' : 'massing'}" data-stang>Fortsätt undersöka</button>
      </div></div>`, { klass: 'inspektionskort', onStang: fortsatt });
    const ga = $('[data-ga]', m.el);
    if (ga) ga.onclick = () => { m.el.remove(); laddaRum(mal); fortsatt(); toast(mal.namn); };
    if (nya.length || nyaM.length) { app.querySelector('.liten-bok').classList.add('puls'); setTimeout(() => app.querySelector('.liten-bok')?.classList.remove('puls'), 1600); }
    nyaUpplasningar(fore);
    uppdateraHud();
    if (nya.length || nyaM.length) guide?.hande('inspektion');
  }

  function forvaldFlik() {
    const mek = bokMoment(f).filter((m) => arUpplast(m, st));
    if (mek.length && !st.besoktaFlikar?.includes('mek:' + mek[0].id)) return 'mek:' + mek[0].id;
    return 'fynd';
  }
  function oppnaBok(flik) {
    pausa();
    const fore = upplasta();
    guide?.hande('bok');
    const valdFlik = flik || forvaldFlik();
    st.besoktaFlikar ||= [];
    if (!st.besoktaFlikar.includes(valdFlik)) st.besoktaFlikar.push(valdFlik);
    oppnaAnteckningsbok(f, st, {
      flik: valdFlik,
      banner: !installningar().settBokBanner && (installningar().settBokBanner = true),
      onStang: () => { uppdateraHarlett(f, st); nyaUpplasningar(fore); fortsatt(); },
      onAnklaga: () => { fortsatt(); anklaga(); },
      onNyttFynd: () => {
        const nya = uppdateraHarlett(f, st);
        if (nya.length) setTimeout(() => toast(`Nytt i anteckningsboken: ${nya.map((x) => material[x]?.titel || 'en utsaga').join(', ')}`), 2700);
        uppdateraHud();
      },
      onVisaLosning: visaLosning,
      onGuide: () => { fortsatt(); startaGuide(); },
    });
    spara();
  }
  function anklaga() {
    pausa();
    oppnaAnklagelse(f, st, {
      onTillbaka: fortsatt,
      onAvslutat: () => { location.hash = `#/fall/${id}/upplosning`; },
    });
  }
  function visaLosning() {
    avslutaFall(f, st, { losta: false, visad: true });
    location.hash = `#/fall/${id}/upplosning`;
  }
  $('[data-bok]', app).onclick = () => oppnaBok();
  $('[data-platser]', app).onclick = () => oppnaBok('platser');
  $('[data-ledtrad]', app).onclick = () => {
    pausa();
    const m = oppnaLedtradar(f, st, { onAndrat: uppdateraHud, onVisaLosning: visaLosning });
    const obs = new MutationObserver(() => { if (!m.el.isConnected) { obs.disconnect(); fortsatt(); } });
    obs.observe(document.getElementById('lager'), { childList: true });
  };
  $('[data-anklaga]', app).onclick = anklaga;

  // Handledning första gången (eller på begäran från boken)
  function startaGuide() {
    guide?.avbryt?.();
    const k = kallor(f);
    let mal = f.meta.handledning_mal;
    if (!mal || !aktuelltRum.payload.rum.objekt.some((o) => o.id === mal)) mal = Object.values(k).flat().find((x) => x.rum === aktuelltRum.id)?.objekt;
    guide = startaHandledning({ app, motor, f, mal, touch, onKlar: () => { installningar().handledningKlar = true; spara(); guide = null; } });
  }
  if (!installningar().handledningKlar) startaGuide();
  else if (!st.tid) toast('Uppdrag: ' + (f.meta.mal || f.intro.uppdrag));

  // Tid och position sparas löpande
  let tick = 0;
  const timer = setInterval(() => {
    if (document.hidden || !motor.kor) return;
    st.tid += 1000;
    if (++tick % 5 === 0) { st.position = motor.position(); spara(); }
  }, 1000);

  // Testkrokar (används av Playwright-testerna)
  window.__detektiv = {
    motor, st, f,
    rum: () => aktuelltRum.id,
    byt: (mid) => laddaRum(f.moment.find((m) => m.id === mid)),
    inspektera: (oid) => { const o = aktuelltRum.payload.rum.objekt.find((x) => x.id === oid); if (o) inspektera(o); },
  };

  return () => {
    clearInterval(timer);
    try { st.position = motor.position(); } catch { /* ignore */ }
    spara();
    guide?.avbryt?.();
    motor.forstor();
    delete window.__detektiv;
  };
}
