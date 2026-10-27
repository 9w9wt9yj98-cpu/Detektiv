// Anteckningsboken: fynd, slutsatser, platser, mekaniker (deduktionstavla, förhör …), personer och egna anteckningar.
import { fyndMap, arUpplast, kallor, rakning, rumMoment } from '../motor/fall.js';
import { spara } from '../motor/lagring.js';
import { aktuellPoang, ledtradKostnad } from '../motor/poang.js';
import { MEKANIKER, bokMoment } from '../mekaniker/index.js';
import { ledtradPekare, pekarText, nastaSteg, redoSlutsatser } from '../motor/vagledning.js';
import { renderaSlutsatser } from './slutsatser.js';
import { esc, html, modal, medaljong, lampa, bekrafta, toast, $, $$ } from './gemensamt.js';

export function oppnaAnteckningsbok(f, st, { flik = 'fynd', onAnklaga, onStang, onNyttFynd, onVisaLosning, onGuide, banner } = {}) {
  const fynd = fyndMap(f);
  const mek = bokMoment(f);
  st.kopplingar ||= {};
  const flikar = [['fynd', 'Fynd']];
  if (f.slutsatser?.length) flikar.push(['slutsatser', 'Slutsatser']);
  flikar.push(['platser', 'Platser']);
  for (const m of mek) flikar.push(['mek:' + m.id, m.namn || 'Deduktion']);
  flikar.push(['personer', 'Personer'], ['anteckningar', 'Anteckningar']);
  const lager = document.getElementById('lager');
  const el = html(`<div class="bok-bakgrund"><section class="bok" role="dialog" aria-modal="true" aria-label="Anteckningsbok">
    <header class="bok-huvud"><h2>Anteckningsbok</h2><button class="ikonknapp" data-stang aria-label="Stäng boken">✕</button></header>
    <nav class="bok-flikar" role="tablist">${flikar.map(([id, namn]) => `<button role="tab" data-flik="${id}">${esc(namn)}<i class="prick" hidden></i></button>`).join('')}</nav>
    <div class="bok-sida"></div>
    <footer class="bok-fot">
      <button class="knapp sekundar" data-ledtrad>${lampa()} Ledtråd <span class="bricka">${f.ledtradar.length - st.ledtradar}</span></button>
      <button class="knapp massing" data-anklaga>Anklaga</button>
    </footer>
  </section></div>`);
  lager.appendChild(el);
  requestAnimationFrame(() => el.classList.add('oppen'));
  const sida = $('.bok-sida', el);
  let aktiv = null;

  const stang = () => { el.classList.remove('oppen'); setTimeout(() => el.remove(), 180); spara(); onStang?.(); };
  $('[data-stang]', el).onclick = stang;
  $('[data-anklaga]', el).onclick = () => { el.remove(); spara(); onAnklaga?.(); };
  $('[data-ledtrad]', el).onclick = () => oppnaLedtradar(f, st, {
    onAndrat: () => { $('[data-ledtrad] .bricka', el).textContent = f.ledtradar.length - st.ledtradar; },
    onVisaLosning: () => { el.remove(); onVisaLosning?.(); },
  });

  const geFynd = (id) => {
    if (!id || st.fynd.includes(id)) return false;
    st.fynd.push(id); spara();
    toast('Nytt fynd: ' + (fynd[id]?.titel || ''));
    onNyttFynd?.(id);
    prickar();
    return true;
  };
  const ctx = { f, st, geFynd, spara, toast, oppnaFlik: (id) => visa(id) };

  function prickar() {
    const redo = redoSlutsatser(f, st).length > 0;
    for (const b of $$('[data-flik]', el)) {
      const id = b.dataset.flik;
      let p = false;
      if (id === 'slutsatser') p = redo;
      else if (id.startsWith('mek:')) { const m = f.moment.find((x) => x.id === id.slice(4)); p = arUpplast(m, st) && !MEKANIKER[m.mekanik].klar?.(m, st); }
      $('.prick', b).hidden = !p;
    }
  }

  function visa(id) {
    aktiv = id;
    $$('[data-flik]', el).forEach((b) => b.setAttribute('aria-selected', b.dataset.flik === id));
    $(`[data-flik="${id}"]`, el)?.scrollIntoView({ inline: 'nearest', block: 'nearest' });
    sida.scrollTop = 0;
    const r = rakning(f, st);
    if (id === 'fynd') {
      const k = kallor(f);
      const lista = st.fynd.filter((fid) => fynd[fid]);
      const topp = `<p class="bok-not"><strong>Fynd ${r.hittat} av ${r.total}</strong> i rummen${r.hittat >= r.total ? ' – allt är hittat ✓' : ''}. Tryck på ett fynd för att koppla det till en person.</p>`;
      if (!lista.length) { sida.innerHTML = topp + '<p class="tomt">Inga fynd än. Gå runt i rummet och tryck på det som glimmar.</p>'; return; }
      sida.innerHTML = `${topp}<div class="fyndkort-lista">${lista.map((fid) => {
        const x = fynd[fid];
        const kopp = (st.kopplingar[fid] || []).map((pid) => f.personer.find((p) => p.id === pid)?.namn).filter(Boolean);
        const kalla = k[fid]?.[0];
        return `<button class="fyndkort typ-${x.typ}" data-fynd="${fid}"><span class="fyndikon" aria-hidden="true">${esc(x.ikon || '•')}</span><strong>${esc(x.titel || '')}</strong><span class="fyndtext">${esc(x.text)}</span>${kalla ? `<span class="fyndkalla">${esc(kalla.rumNamn)} · ${esc(kalla.objektNamn)}</span>` : '<span class="fyndkalla">Egen slutsats</span>'}${kopp.length ? `<span class="koppling">↔ ${esc(kopp.join(', '))}</span>` : ''}</button>`;
      }).join('')}</div>`;
      $$('[data-fynd]', sida).forEach((b) => b.onclick = () => koppla(b.dataset.fynd));
    } else if (id === 'slutsatser') {
      renderaSlutsatser(sida, f, st, { geFynd, onAndrat: () => { spara(); prickar(); } });
    } else if (id === 'platser') {
      const steg = nastaSteg(f, st);
      sida.innerHTML = `<div class="platser">
        <p class="mal-rad"><span>Uppdrag</span>${esc(f.intro.uppdrag)}</p>
        ${steg ? `<p class="nasta-steg">➜ ${esc(steg)}</p>` : ''}
        <ul class="platslista">${rumMoment(f).map((m) => {
          const x = r.perRum[m.id];
          const status = !x.upplast ? `<span class="pstatus last">🔒 Låst</span>` : x.hittat >= x.total ? `<span class="pstatus klar">✓ Allt hittat</span>` : `<span class="pstatus kvar">${x.total - x.hittat} kvar</span>`;
          return `<li class="${x.upplast ? '' : 'last'}"><div><strong>${esc(m.namn)}</strong>${!x.upplast ? `<small>${esc(m.last_text || 'Hitta mer för att komma hit.')}</small>` : `<small>${x.hittat} av ${x.total} fynd</small>`}</div>${status}</li>`;
        }).join('')}</ul>
        ${mek.length ? `<ul class="platslista">${mek.map((m) => {
          const upp = arUpplast(m, st), klar = MEKANIKER[m.mekanik].klar?.(m, st);
          return `<li class="${upp ? '' : 'last'}"><div><strong>${esc(m.namn)}</strong><small>${esc(upp ? (klar ? 'Klart.' : (m.payload.kort_instruktion || 'Öppna fliken och arbeta vidare.')) : (m.last_text || 'Låses upp av ett fynd.'))}</small></div>${!upp ? '<span class="pstatus last">🔒</span>' : klar ? '<span class="pstatus klar">✓</span>' : `<button class="knapp liten sekundar" data-ga="mek:${m.id}">Öppna</button>`}</li>`;
        }).join('')}</ul>` : ''}
        <p class="hjalptext">Siffrorna räknar allt i rummen som ger något till anteckningsboken. Föremål som bara är stämning räknas inte.</p>
        ${onGuide ? '<button class="lank" data-guide>Visa guiden för styrning igen</button>' : ''}
      </div>`;
      $$('[data-ga]', sida).forEach((b) => b.onclick = () => visa(b.dataset.ga));
      const g = $('[data-guide]', sida); if (g) g.onclick = () => { el.remove(); spara(); onGuide(); };
    } else if (id.startsWith('mek:')) {
      const m = f.moment.find((x) => x.id === id.slice(4));
      if (!arUpplast(m, st)) { sida.innerHTML = `<p class="tomt">${esc(m.last_text || 'Du har ännu inte tillräckligt underlag. Undersök platsen först.')}</p>`; return; }
      MEKANIKER[m.mekanik].rendera(sida, m, ctx);
    } else if (id === 'personer') {
      sida.innerHTML = `<ul class="personer">${f.personer.map((p) => {
        const kopplade = Object.entries(st.kopplingar).filter(([, ps]) => ps.includes(p.id)).map(([fid]) => fynd[fid]?.titel).filter(Boolean);
        return `<li>${medaljong(p)}<div><strong>${esc(p.namn)}</strong> <em>${esc(p.roll)}</em><br><span>${esc(p.beskrivning || '')}</span>${kopplade.length ? `<span class="koppling">Dina kopplingar: ${esc(kopplade.join(' · '))}</span>` : ''}</div></li>`;
      }).join('')}</ul>`;
    } else if (id === 'anteckningar') {
      sida.innerHTML = `<label class="bok-not" for="egna">Egna anteckningar – sparas automatiskt.</label><textarea id="egna" class="egna" rows="12" placeholder="Misstankar, tider, frågor …">${esc(st.anteckningar || '')}</textarea>`;
      $('#egna', sida).oninput = (e) => { st.anteckningar = e.target.value; spara(); };
    }
    if (banner && !visa.bannerVisad) {
      visa.bannerVisad = true;
      sida.prepend(html(`<div class="bok-banner"><strong>Din anteckningsbok.</strong> Under <em>Fynd</em> samlas allt du hittar. <em>Slutsatser</em> hjälper dig att koppla ihop fynden steg för steg, och <em>Platser</em> visar vilka rum som har fynd kvar. När du vet vem det är trycker du på <em>Anklaga</em>.<button class="knapp liten massing" data-ok>Uppfattat</button></div>`));
      $('.bok-banner [data-ok]', sida).onclick = (e) => e.target.closest('.bok-banner').remove();
    }
    prickar();
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
  return { stang, visa, el };
}

export function oppnaLedtradar(f, st, { onAndrat, onVisaLosning } = {}) {
  const rita = () => {
    const tagna = f.ledtradar.slice(0, st.ledtradar);
    const nasta = f.ledtradar[st.ledtradar];
    const kostnad = nasta ? nasta.kostnad ?? [10, 25, 50][st.ledtradar] : 0;
    const steg = nastaSteg(f, st);
    return `<h3>${lampa()} Ledtrådar</h3>
      <p class="bok-not">Nuvarande poäng: <strong>${aktuellPoang(f, st)}</strong> av 100. Ledtrådarna ger aldrig namnet – sista steget tar du själv.</p>
      ${steg ? `<p class="nasta-steg">➜ ${esc(steg)} <small>(gratis)</small></p>` : ''}
      <ol class="ledtradlista">${tagna.map((l) => {
        const p = ledtradPekare(f, st, l);
        return `<li><span class="niva">Nivå ${l.niva}</span>${p ? `<p class="pekare">📍 Du har inte hittat allt som behövs för det här steget än. ${esc(pekarText(p.vag))}</p>` : ''}${esc(l.text)}</li>`;
      }).join('') || '<li class="tom">Du har inte tagit någon ledtråd ännu.</li>'}</ol>
      <div class="knapprad">${nasta ? `<button class="knapp massing" data-ta>Ta ledtråd ${st.ledtradar + 1} (−${kostnad} poäng)</button>` : '<p class="bok-not">Alla tre ledtrådar är tagna.</p>'}<button class="knapp sekundar" data-stang>Stäng</button></div>
      ${onVisaLosning ? '<p class="visa-losning"><button class="lank" data-losning>Jag ger upp – visa lösningen</button></p>' : ''}`;
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
    const l = $('[data-losning]', m.el);
    if (l) l.onclick = async () => {
      if (!(await bekrafta('Visa hela lösningen? Fallet räknas då som olöst, men du kan spela det igen senare.', { ja: 'Visa lösningen' }))) return;
      m.el.remove(); onVisaLosning?.();
    };
  };
  koppla();
  return m;
}
export { ledtradKostnad };
