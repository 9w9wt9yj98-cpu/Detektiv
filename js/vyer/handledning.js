// Interaktiv handledning första gången: gå, titta, undersöka, öppna boken och anklaga.
import { esc, html, $ } from './gemensamt.js';

export function startaHandledning({ app, motor, f, mal, touch, onKlar }) {
  const malDef = (() => { for (const m of f.moment) for (const o of m.payload?.rum?.objekt || []) if (o.id === mal) return o; return null; })();
  const malNamn0 = malDef?.interaktiv?.namn || 'föremålet';
  const malNamn = malDef?.typ === 'person' ? malNamn0 : malNamn0.charAt(0).toLowerCase() + malNamn0.slice(1);
  const steg = [
    { id: 'ga', text: touch ? '<strong>Gå:</strong> sätt tummen på vänstra halvan av skärmen och dra uppåt.' : '<strong>Gå:</strong> håll ned W eller pil upp. A och D tar sidosteg.', ikon: touch ? 'tumme-v' : null },
    { id: 'titta', text: touch ? '<strong>Se dig omkring:</strong> dra med fingret på högra halvan av skärmen.' : '<strong>Se dig omkring:</strong> håll ned musknappen och dra.', ikon: touch ? 'tumme-h' : null },
    { id: 'undersok', text: `<strong>Undersök:</strong> det som glimmar kan undersökas. Följ pilen till ${esc(malNamn)}, gå nära och tryck på det – eller på knappen <em>Undersök</em> som dyker upp.`, pil: true },
    { id: 'bok', text: '<strong>Bra!</strong> Fyndet skrevs in i din anteckningsbok. Öppna den med bokknappen uppe till höger.', bok: true },
    { id: 'anklaga', text: `<strong>Sista tipset:</strong> räknaren <em>Fynd</em> visar hur mycket som finns kvar att hitta. När du vet vem som är skyldig trycker du på <em>Anklaga</em>. Du har två försök, och fastnar du finns ledtrådar under glödlampan.`, knapp: 'Nu kör vi' },
  ];
  let i = 0;
  const el = html(`<div class="coach" role="status"><div class="coach-kort"><p class="coach-steg"></p><p class="coach-text"></p><div class="coach-knappar"><button class="lank" data-hoppa>Hoppa över guiden</button><button class="knapp liten massing" data-nasta hidden></button></div></div></div>`);
  const pil = html('<div class="coach-pil" aria-hidden="true"></div>');
  const tumme = html('<div class="coach-tumme" aria-hidden="true"></div>');
  app.querySelector('.utredning').append(el, pil, tumme);
  const bokKnapp = app.querySelector('.liten-bok');
  let start = motor.position(), startYaw = motor.yaw, maxYaw = 0;

  function visa() {
    const s = steg[i];
    $('.coach-steg', el).textContent = `Guide ${i + 1} av ${steg.length}`;
    $('.coach-text', el).innerHTML = s.text;
    const n = $('[data-nasta]', el); n.hidden = !s.knapp; n.textContent = s.knapp || '';
    tumme.className = 'coach-tumme ' + (s.ikon || '');
    tumme.hidden = !s.ikon;
    bokKnapp?.classList.toggle('coach-mark', !!s.bok);
    pil.hidden = !s.pil;
    el.classList.remove('ny'); void el.offsetWidth; el.classList.add('ny');
    if (s.id === 'ga') start = motor.position();
    if (s.id === 'titta') { startYaw = motor.yaw; maxYaw = 0; }
  }
  function nasta() { i++; if (i >= steg.length) return klar(); visa(); }
  function stad() { el.remove(); pil.remove(); tumme.remove(); bokKnapp?.classList.remove('coach-mark'); motor.onRam = null; i = steg.length; }
  function klar() { stad(); onKlar?.(); }
  $('[data-hoppa]', el).onclick = klar;
  $('[data-nasta]', el).onclick = nasta;

  motor.onRam = () => {
    const s = steg[i]; if (!s) return;
    if (s.id === 'ga') {
      const p = motor.position();
      if (Math.hypot(p.pos[0] - start.pos[0], p.pos[1] - start.pos[1]) > 0.7) nasta();
    } else if (s.id === 'titta') {
      maxYaw = Math.max(maxYaw, Math.abs(motor.yaw - startYaw));
      if (maxYaw > 0.6) nasta();
    } else if (s.pil && mal) {
      const r = motor.riktning(mal); if (!r) return;
      const yta = app.querySelector('.utredning'); const W = yta.clientWidth, H = yta.clientHeight;
      if (r.synlig) {
        pil.className = 'coach-pil ned';
        pil.style.left = r.x * W + 'px'; pil.style.top = Math.max(120, r.y * H - 46) + 'px';
      } else {
        const hoger = r.vinkel > 0;
        pil.className = 'coach-pil ' + (hoger ? 'hoger' : 'vanster');
        pil.style.left = (hoger ? W - 40 : 40) + 'px'; pil.style.top = H * 0.48 + 'px';
      }
    }
  };
  visa();
  return {
    hande(typ) {
      const s = steg[i]; if (!s) return;
      if (typ === 'inspektion' && (s.id === 'undersok' || s.id === 'ga' || s.id === 'titta')) { i = 2; nasta(); }
      else if (typ === 'bok' && s.id === 'bok') nasta();
      else if (typ === 'bok' && i < 3) { /* boken öppnad tidigt – låt guiden fortsätta */ }
    },
    get aktivtSteg() { return steg[i]?.id; },
    avbryt: stad,
  };
}
