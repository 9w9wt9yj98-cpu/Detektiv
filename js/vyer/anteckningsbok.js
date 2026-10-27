// Anteckningsboken: fynd, personer, deduktionstavla och egna anteckningar. Öppnas från boken i rummet.
import { fyndMap, rutnatMoment, arUpplast } from '../motor/fall.js';
import { spara, installningar } from '../motor/lagring.js';
import { aktuellPoang, ledtradKostnad } from '../motor/poang.js';
import { renderaRutnat } from '../mekaniker/logikrutnat.js';
import { esc, html, modal, medaljong, lampa, bekrafta, toast, $, $$ } from './gemensamt.js';

export function oppnaAnteckningsbok(f, st, { flik = 'fynd', onAnklaga, onStang, onNyttFynd } = {}) {
  const fynd = fyndMap(f);
  const rutnat = rutnatMoment(f);
  st.kopplingar ||= {};
  const flikar = [['fynd', 'Fynd'], ['personer', 'Personer'], ...rutnat.map((m) => ['rutnat:' + m.id, m.namn || 'Deduktion']), ['anteckningar', 'Anteckningar']];
  const lager = document.getElementById('lager');
  const el = html(`<div class="bok-bakgrund"><section class="bok" role="dialog" aria-modal="true" aria-label="Anteckningsbok">
    <header class="bok-huvud"><h2>Anteckningsbok</h2><button class="ikonknapp" data-stang aria-label="Stäng boken">✕</button></header>
    <nav class="bok-flikar" role="tablist">${flikar.map(([id, namn]) => `<button role="tab" data-flik="${id}">${esc(namn)}</button>`).join('')}</nav>
    <div class="bok-sida"></div>
    <footer class="bok-fot">
      <button class="knapp sekundar" data-ledtrad>${lampa()} Ledtråd <span class="bricka">${f.ledtradar.length - st.ledtradar}</span></button>
      <button class="knapp massing" data-anklaga>Anklaga</button>
    </footer>
  </section></div>`);
  lager.appendChild(el);
  requestAnimationFrame(() => el.classList.add('oppen'));
  const sida = $('.bok-sida', el);

  const stang = () => { el.classList.remove('oppen'); setTimeout(() => el.remove(), 180); spara(); onStang?.(); };
  $('[data-stang]', el).onclick = stang;
  $('[data-anklaga]', el).onclick = () => { el.remove(); spara(); onAnklaga?.(); };
  $('[data-ledtrad]', el).onclick = () => oppnaLedtradar(f, st, () => { $('[data-ledtrad] .bricka', el).textContent = f.ledtradar.length - st.ledtradar; });

  function visa(id) {
    $$('[data-flik]', el).forEach((b) => b.setAttribute('aria-selected', b.dataset.flik === id));
    sida.scrollTop = 0;
    if (id === 'fynd') {
      if (!st.fynd.length) { sida.innerHTML = '<p class="tomt">Inga fynd än. Gå runt i rummet och tryck på det som glimmar.</p>'; return; }
      sida.innerHTML = `<p class="bok-not">${st.fynd.length} fynd. Tryck på ett fynd för att koppla det till en person.</p><div class="fyndkort-lista">${st.fynd.map((fid) => {
        const x = fynd[fid]; if (!x) return '';
        const kopp = (st.kopplingar[fid] || []).map((pid) => f.personer.find((p) => p.id === pid)?.namn).filter(Boolean);
        return `<button class="fyndkort" data-fynd="${fid}"><span class="fyndikon" aria-hidden="true">${esc(x.ikon || '•')}</span><strong>${esc(x.titel || '')}</strong><span class="fyndtext">${esc(x.text)}</span>${kopp.length ? `<span class="koppling">↔ ${esc(kopp.join(', '))}</span>` : ''}</button>`;
      }).join('')}</div>`;
      $$('[data-fynd]', sida).forEach((b) => b.onclick = () => koppla(b.dataset.fynd));
    } else if (id === 'personer') {
      sida.innerHTML = `<ul class="personer">${f.personer.map((p) => {
        const kopplade = Object.entries(st.kopplingar).filter(([, ps]) => ps.includes(p.id)).map(([fid]) => fynd[fid]?.titel).filter(Boolean);
        return `<li>${medaljong(p)}<div><strong>${esc(p.namn)}</strong> <em>${esc(p.roll)}</em><br><span>${esc(p.beskrivning || '')}</span>${kopplade.length ? `<span class="koppling">Dina kopplingar: ${esc(kopplade.join(' · '))}</span>` : ''}</div></li>`;
      }).join('')}</ul>`;
    } else if (id.startsWith('rutnat:')) {
      const m = f.moment.find((x) => x.id === id.slice(7));
      if (!arUpplast(m, st)) { sida.innerHTML = `<p class="tomt">${esc(m.last_text || 'Du har ännu inte tillräckligt underlag. Undersök platsen först – förhörsprotokollen finns någonstans här.')}</p>`; return; }
      renderaRutnat(sida, m.payload, st, {
        autofyll: installningar().autofyll,
        onAutofyll: (v) => { installningar().autofyll = v; spara(); },
        onAndrat: () => spara(),
        onLost: () => {
          const ny = m.payload.ger_fynd_nar_lost;
          if (ny && !st.fynd.includes(ny)) { st.fynd.push(ny); toast('Nytt fynd: ' + (fynd[ny]?.titel || '')); onNyttFynd?.(ny); }
          spara();
        },
      });
    } else if (id === 'anteckningar') {
      sida.innerHTML = `<label class="bok-not" for="egna">Egna anteckningar – sparas automatiskt.</label><textarea id="egna" class="egna" rows="12" placeholder="Misstankar, tider, frågor …">${esc(st.anteckningar || '')}</textarea>`;
      $('#egna', sida).oninput = (e) => { st.anteckningar = e.target.value; spara(); };
    }
  }
  function koppla(fid) {
    const x = fynd[fid];
    const valda = new Set(st.kopplingar[fid] || []);
    const m = modal(`<h3>${esc(x.titel)}</h3><p class="modal-text">${esc(x.text)}</p><p class="bok-not">Koppla fyndet till:</p>
      <div class="chips">${f.personer.map((p) => `<button class="chip ${valda.has(p.id) ? 'vald' : ''}" data-p="${p.id}">${esc(p.namn)}</button>`).join('')}</div>
      <div class="knapprad"><button class="knapp massing" data-stang>Klar</button></div>`, { klass: 'over-bok', onStang: () => { st.kopplingar[fid] = [...valda]; spara(); visa('fynd'); } });
    $$('[data-p]', m.el).forEach((b) => b.onclick = () => { valda.has(b.dataset.p) ? valda.delete(b.dataset.p) : valda.add(b.dataset.p); b.classList.toggle('vald'); });
  }
  $$('[data-flik]', el).forEach((b) => b.onclick = () => visa(b.dataset.flik));
  visa(flikar.some(([id]) => id === flik) ? flik : 'fynd');
  return { stang };
}

export function oppnaLedtradar(f, st, onAndrat) {
  const rita = () => {
    const tagna = f.ledtradar.slice(0, st.ledtradar);
    const nasta = f.ledtradar[st.ledtradar];
    const kostnad = nasta ? nasta.kostnad ?? [10, 25, 50][st.ledtradar] : 0;
    return `<h3>${lampa()} Ledtrådar</h3>
      <p class="bok-not">Nuvarande poäng: <strong>${aktuellPoang(f, st)}</strong> av 100. Ledtrådarna ger aldrig namnet – sista steget tar du själv.</p>
      <ol class="ledtradlista">${tagna.map((l) => `<li><span class="niva">Nivå ${l.niva}</span>${esc(l.text)}</li>`).join('') || '<li class="tom">Du har inte tagit någon ledtråd ännu.</li>'}</ol>
      <div class="knapprad">${nasta ? `<button class="knapp massing" data-ta>Ta ledtråd ${st.ledtradar + 1} (−${kostnad} poäng)</button>` : '<p class="bok-not">Alla tre ledtrådar är tagna.</p>'}<button class="knapp sekundar" data-stang>Stäng</button></div>`;
  };
  const m = modal(rita(), { klass: 'over-bok ledtradar' });
  const koppla = () => {
    const b = $('[data-ta]', m.el);
    $$('[data-stang]', m.el).forEach((x) => x.onclick = m.stang);
    if (b) b.onclick = async () => {
      const nasta = f.ledtradar[st.ledtradar];
      if (!(await bekrafta(`Ta ledtråd ${st.ledtradar + 1}? Den kostar ${nasta.kostnad ?? 10} poäng.`, { ja: 'Ta ledtråden' }))) return;
      st.ledtradar++; spara(); onAndrat?.();
      $('.modal', m.el).innerHTML = rita(); koppla();
    };
  };
  koppla();
  return m;
}
export { ledtradKostnad };
