// Utredningen: förstapersonsvy i 3D med HUD, inspektionskort, anteckningsbok, ledtrådar och anklagelse.
import { laddaFall, fyndMap, rumMoment, rutnatMoment, arUpplast, fallTitel } from '../motor/fall.js';
import { fallData, spara, installningar } from '../motor/lagring.js';
import { oppnaAnteckningsbok, oppnaLedtradar } from './anteckningsbok.js';
import { oppnaAnklagelse } from './anklagelse.js';
import { esc, html, modal, toast, lampa, bokIkon, hemIkon, $ } from './gemensamt.js';

function webglFinns() {
  try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch { return false; }
}

export async function visaUtredning(app, id) {
  const f = await laddaFall(id);
  const st = fallData(id);
  if (st.status === 'lost' || st.status === 'misslyckad') { location.hash = `#/fall/${id}/upplosning`; return null; }
  if (st.status !== 'pagaende') { st.status = 'pagaende'; spara(); }
  const fynd = fyndMap(f);
  const rum = rumMoment(f);
  document.title = fallTitel(f) + ' · Detektiv';

  app.innerHTML = `<div class="utredning" style="--accent:${f.meta.accentfarg}">
    <header class="hud-topp">
      <a class="ikonknapp" href="#/fall/${id}" aria-label="Till fallets presentation">${hemIkon()}</a>
      <div class="hud-titel"><h1>${esc(fallTitel(f))}</h1><span class="rumnamn"></span></div>
      <button class="ikonknapp" data-ledtrad aria-label="Ledtrådar">${lampa()}<span class="bricka"></span></button>
      <button class="ikonknapp liten-bok" data-bok aria-label="Öppna anteckningsboken">${bokIkon()}<span class="bricka fyndantal"></span></button>
    </header>
    <div class="rum3d"></div>
    <div class="vinjett" aria-hidden="true"></div>
    <div class="hud-botten">
      <p class="hud-tips">Gå till <strong>anteckningsboken</strong> i rummet för att läsa dina fynd.</p>
      <button class="knapp massing anklaga-knapp" data-anklaga>Anklaga</button>
    </div>
  </div>`;
  const behallare = $('.rum3d', app);
  const uppdateraHud = () => {
    $('[data-ledtrad] .bricka', app).textContent = f.ledtradar.length - st.ledtradar;
    $('.fyndantal', app).textContent = st.fynd.length;
  };
  uppdateraHud();

  if (!webglFinns()) {
    behallare.innerHTML = '<div class="papperskort">Din webbläsare saknar stöd för 3D (WebGL). Utredningen kan inte visas.</div>';
    return null;
  }
  const { Rum3D } = await import('../tre/motor3d.js');
  let modalOppen = 0;
  const pausa = () => { modalOppen++; motor.pausa(); };
  const fortsatt = () => { modalOppen = Math.max(0, modalOppen - 1); if (!modalOppen) motor.starta(); uppdateraHud(); };

  const motor = new Rum3D(behallare, { onInspektera: inspektera, onMeddelande: toast });
  let aktuelltRum = rum.find((m) => m.id === st.rum && arUpplast(m, st)) || rum[0];

  function laddaRum(m, { anvandSparad = false } = {}) {
    aktuelltRum = m;
    st.rum = m.id;
    const inspekterade = new Set(st.inspekterade);
    motor.ladda(m.payload.rum, { inspekterade, position: anvandSparad && st.position ? st.position : null });
    $('.rumnamn', app).textContent = m.namn || '';
    spara();
  }
  laddaRum(aktuelltRum, { anvandSparad: true });
  motor.starta();

  function nyaUpplasningar(fore) {
    for (const m of f.moment) {
      if (!fore.has(m.id) && arUpplast(m, st)) {
        if (m.mekanik === 'logikrutnat') toast(`${m.namn} kan nu rekonstrueras i anteckningsboken.`);
        else toast(`Ny plats: ${m.namn}`);
      }
    }
  }

  function inspektera(def) {
    if (def.funktion === 'anteckningsbok') { oppnaBok(); return; }
    const i = def.interaktiv || {};
    const fore = new Set(f.moment.filter((m) => arUpplast(m, st)).map((m) => m.id));
    const nya = [].concat(i.ger_fynd || []).filter((fid) => !st.fynd.includes(fid));
    const gamla = [].concat(i.ger_fynd || []).filter((fid) => st.fynd.includes(fid));
    st.fynd.push(...nya);
    if (!st.inspekterade.includes(def.id)) st.inspekterade.push(def.id);
    motor.markera(def.id);
    spara();
    const mal = def.gar_till ? f.moment.find((m) => m.id === def.gar_till) : null;
    const malOppet = mal && arUpplast(mal, st);
    pausa();
    const m = modal(`<div class="inspektion">
      <h3>${esc(i.namn || 'Föremål')}</h3>
      <p class="modal-text">${esc(i.text || '')}</p>
      ${nya.length ? `<div class="nytt-fynd"><span>Nytt i anteckningsboken</span>${nya.map((fid) => `<div class="fyndrad"><span class="fyndikon">${esc(fynd[fid].ikon || '')}</span> ${esc(fynd[fid].titel)}</div>`).join('')}</div>` : ''}
      ${!nya.length && gamla.length ? '<p class="bok-not">Redan antecknat.</p>' : ''}
      ${mal && !malOppet ? `<p class="last">${esc(mal.last_text || 'Du har ingen anledning att gå dit än.')}</p>` : ''}
      <div class="knapprad">
        ${mal && malOppet ? `<button class="knapp massing" data-ga>Gå till ${esc(mal.namn)} →</button>` : ''}
        <button class="knapp ${mal && malOppet ? 'sekundar' : 'massing'}" data-stang>Fortsätt undersöka</button>
      </div></div>`, { klass: 'inspektionskort', onStang: fortsatt });
    const ga = $('[data-ga]', m.el);
    if (ga) ga.onclick = () => { m.el.remove(); laddaRum(mal); fortsatt(); toast(mal.namn); };
    if (nya.length) { app.querySelector('.liten-bok').classList.add('puls'); setTimeout(() => app.querySelector('.liten-bok')?.classList.remove('puls'), 1600); }
    nyaUpplasningar(fore);
    uppdateraHud();
  }

  function oppnaBok(flik) {
    pausa();
    const fore = new Set(f.moment.filter((m) => arUpplast(m, st)).map((m) => m.id));
    oppnaAnteckningsbok(f, st, {
      flik: flik || (rutnatMoment(f).some((m) => arUpplast(m, st)) && !st.rutnatLost ? 'rutnat:' + rutnatMoment(f)[0].id : 'fynd'),
      onStang: () => { nyaUpplasningar(fore); fortsatt(); },
      onAnklaga: () => { fortsatt(); anklaga(); },
      onNyttFynd: () => uppdateraHud(),
    });
  }
  function anklaga() {
    pausa();
    oppnaAnklagelse(f, st, {
      onTillbaka: fortsatt,
      onAvslutat: () => { location.hash = `#/fall/${id}/upplosning`; },
    });
  }
  $('[data-bok]', app).onclick = () => oppnaBok();
  $('[data-ledtrad]', app).onclick = () => { pausa(); const m = oppnaLedtradar(f, st, uppdateraHud); const gammal = m.el; const obs = new MutationObserver(() => { if (!gammal.isConnected) { obs.disconnect(); fortsatt(); } }); obs.observe(document.getElementById('lager'), { childList: true }); };
  $('[data-anklaga]', app).onclick = anklaga;

  // Styrhjälp första gången
  if (!installningar().visatStyrhjalp) {
    pausa();
    const touch = matchMedia('(pointer: coarse)').matches;
    const m = modal(`<div class="styrhjalp"><h3>Så undersöker du</h3><ul>
      ${touch ? '<li><strong>Vänster tumme:</strong> dra för att gå.</li><li><strong>Höger sida:</strong> dra för att se dig omkring.</li><li><strong>Tryck</strong> på föremål som glimmar för att undersöka dem.</li>'
        : '<li><strong>W A S D</strong> eller piltangenterna: gå.</li><li><strong>Dra med musen:</strong> se dig omkring.</li><li><strong>Klicka</strong> på föremål som glimmar för att undersöka dem.</li>'}
      <li>Din <strong>anteckningsbok</strong> ligger i rummet. Gå fram till den och tryck på den för att läsa fynden${rutnatMoment(f).length ? ', lösa deduktionstavlan' : ''} och anklaga.</li></ul>
      <div class="knapprad"><button class="knapp massing" data-stang>Uppfattat</button></div></div>`, { onStang: () => { installningar().visatStyrhjalp = true; spara(); fortsatt(); } });
    void m;
  }

  // Tid och position sparas löpande
  let tick = 0;
  const timer = setInterval(() => {
    if (document.hidden || !motor.kor) return;
    st.tid += 1000;
    if (++tick % 5 === 0) { st.position = motor.position(); spara(); }
  }, 1000);

  // Testkrokar (används av Playwright-testerna)
  window.__detektiv = {
    motor, st,
    rum: () => aktuelltRum.id,
    byt: (mid) => laddaRum(f.moment.find((m) => m.id === mid)),
  };

  return () => {
    clearInterval(timer);
    try { st.position = motor.position(); } catch { /* ignore */ }
    spara();
    motor.forstor();
    delete window.__detektiv;
  };
}
