// Anklagelsen: vem (krävs), hur/när (frivilligt, bonus) och 1–3 bevis ur anteckningsboken (frivilligt, bonus).
import { fyndMap } from '../motor/fall.js';
import { spara } from '../motor/lagring.js';
import { resultat, MAX_FEL, FEL_KOSTNAD } from '../motor/poang.js';
import { esc, modal, medaljong, $, $$ } from './gemensamt.js';

export function oppnaAnklagelse(f, st, { onAvslutat, onTillbaka } = {}) {
  const fynd = fyndMap(f);
  const a = f.anklagelse || {};
  const maxBevis = a.bevis_max || 3;
  const kvar = MAX_FEL - st.fel.length;
  const misstankta = f.personer.filter((p) => p.misstankt);
  const klaraSlutsatser = (f.slutsatser || []).filter((s) => st.slutsatser?.[s.id]);
  const m = modal(`<div class="anklagelse">
    <h2>Anklagelse</h2>
    <p class="bok-not">Du har <strong>${kvar}</strong> försök kvar. En felaktig anklagelse kostar ${FEL_KOSTNAD} poäng${kvar === 1 ? ' – efter nästa fel visas lösningen' : ''}.</p>
    ${klaraSlutsatser.length ? `<details class="pamin"><summary>Dina slutsatser (${klaraSlutsatser.length})</summary><ol>${klaraSlutsatser.map((s) => `<li>${esc(s.slutsats)}</li>`).join('')}</ol></details>` : ''}
    <fieldset><legend>1. Vem är skyldig?</legend>
      <div class="val-personer">${misstankta.map((p) => `<label class="valkort"><input type="radio" name="vem" value="${p.id}">${medaljong(p)}<span><strong>${esc(p.namn)}</strong><em>${esc(p.roll)}</em></span></label>`).join('')}</div>
    </fieldset>
    ${a.hur_alternativ ? `<fieldset><legend>2. ${esc(a.hur_fraga || 'Hur gick det till?')} <small>(frivilligt – ger bonus)</small></legend>
      ${a.hur_alternativ.map((h) => `<label class="valrad"><input type="radio" name="hur" value="${h.id}"> <span>${esc(h.text)}</span></label>`).join('')}</fieldset>` : ''}
    <fieldset><legend>3. Bevis – välj 1–${maxBevis} fynd <small>(frivilligt – rätt bevis ger ett extra förstoringsglas)</small></legend>
      ${st.fynd.length ? st.fynd.map((fid) => `<label class="valrad"><input type="checkbox" name="bevis" value="${fid}"> <span><strong>${esc(fynd[fid]?.titel || '')}</strong> – ${esc(fynd[fid]?.text || '')}</span></label>`).join('') : '<p class="tomt">Din anteckningsbok är tom.</p>'}
    </fieldset>
    <div class="knapprad"><button class="knapp sekundar" data-tillbaka>Tillbaka</button><button class="knapp massing" data-anklaga disabled>Peka ut</button></div>
  </div>`, { klass: 'helskarm', onStang: () => onTillbaka?.() });
  const el = m.el;
  const knapp = $('[data-anklaga]', el);
  el.addEventListener('change', (e) => {
    if (e.target.name === 'bevis') {
      const valda = $$('input[name=bevis]:checked', el);
      if (valda.length > maxBevis) { e.target.checked = false; }
    }
    knapp.disabled = !$('input[name=vem]:checked', el);
  });
  $('[data-tillbaka]', el).onclick = () => m.stang();
  knapp.onclick = () => {
    const vem = $('input[name=vem]:checked', el)?.value;
    const hur = $('input[name=hur]:checked', el)?.value || null;
    const bevis = $$('input[name=bevis]:checked', el).map((x) => x.value);
    if (!vem) return;
    el.remove();
    if (vem === f.losning.skyldig) {
      avsluta(true, hur, bevis);
    } else {
      st.fel.push(vem); spara();
      const reaktion = f.aterkoppling.fel?.[vem] || f.aterkoppling.fel_allman || 'Inspektören höjer ett ögonbryn …';
      const slut = st.fel.length >= MAX_FEL;
      const r = modal(`<div class="reaktion"><p class="citat">${esc(f.aterkoppling.fel_allman || 'Inspektören höjer ett ögonbryn …')}</p><p class="modal-text">${esc(reaktion)}</p>
        <p class="bok-not">−${FEL_KOSTNAD} poäng. ${slut ? 'Det var ditt sista försök. Nu får du se hela lösningen, steg för steg.' : 'Du har ett försök kvar. Tips: gå igenom <em>Slutsatser</em> i anteckningsboken eller ta en ledtråd innan du försöker igen.'}</p>
        <div class="knapprad"><button class="knapp massing" data-ok>${slut ? 'Visa upplösningen' : 'Tillbaka till utredningen'}</button></div></div>`,
        { onStang: () => { if (slut) avsluta(false, hur, bevis); else onTillbaka?.(); } });
      $('[data-ok]', r.el).onclick = () => r.stang();
    }
  };
  function avsluta(losta, hur, bevis) { avslutaFall(f, st, { losta, hur, bevis }); onAvslutat?.(); }
  return m;
}

/** Avslutar fallet och sparar resultatet. `visad` = spelaren valde att se lösningen. */
export function avslutaFall(f, st, { losta, hur = null, bevis = [], visad = false }) {
  {
    const res = resultat(f, st, { losta, hur, bevis });
    res.visad = visad;
    st.resultat = res;
    st.status = losta ? 'lost' : 'misslyckad';
    if (losta && (!st.basta || res.glas > st.basta.glas || (res.glas === st.basta.glas && res.poang > st.basta.poang))) st.basta = { glas: res.glas, poang: res.poang };
    spara();
    return res;
  }
}
