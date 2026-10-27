// Slutsatser: guidade frågor som kopplar ihop fynd steg för steg. Fel svar kostar ingenting.
import { har } from '../motor/fall.js';
import { vagTill } from '../motor/vagledning.js';
import { esc, $$ } from './gemensamt.js';

export function renderaSlutsatser(sida, f, st, { geFynd, onAndrat } = {}) {
  const lista = f.slutsatser || [];
  st.slutsatser ||= {};
  const fel = {};
  const rita = () => {
    let foreLast = false;
    const rader = lista.map((s, i) => {
      const klar = !!st.slutsatser[s.id];
      const saknas = (s.kraver || []).filter((id) => !har(st, id));
      const vantar = (s.efter || []).some((x) => !st.slutsatser[x]);
      if (klar) return `<li class="slutsats klar"><span class="snr">${i + 1}</span><div><p class="sfraga">${esc(s.fraga)}</p><p class="ssvar">✓ ${esc(s.slutsats)}</p></div></li>`;
      if (saknas.length || vantar) {
        if (foreLast) return '';
        foreLast = true;
        const v = saknas.length ? vagTill(f, st, saknas[0]) : null;
        const var_ = v?.rumNamn ? ` Leta vidare i ${esc(v.rumNamn)}.` : v?.flik ? ` Arbeta vidare under ”${esc(v.flik)}”.` : '';
        return `<li class="slutsats last"><span class="snr">${i + 1}</span><div><p class="sfraga">🔒 ${vantar && !saknas.length ? 'Besvara frågan ovanför först.' : `Nästa fråga kräver mer underlag – ${saknas.length} ${saknas.length === 1 ? 'fynd' : 'fynd'} till.${var_}`}</p></div></li>`;
      }
      return `<li class="slutsats redo" data-s="${s.id}"><span class="snr">${i + 1}</span><div><p class="sfraga">${esc(s.fraga)}</p>
        <div class="alternativ">${s.alternativ.map((a, j) => `<button class="alt" data-j="${j}">${esc(a.text)}</button>`).join('')}</div>
        ${fel[s.id] ? `<p class="sfel">${esc(fel[s.id])}</p>` : ''}</div></li>`;
    }).join('');
    const antalKlara = lista.filter((s) => st.slutsatser[s.id]).length;
    sida.innerHTML = `<div class="slutsatser">
      <p class="bok-not">Här kopplar du ihop dina fynd. En fråga öppnas när du har hittat det som behövs. Fel svar kostar inga poäng – tänk efter och försök igen. <strong>${antalKlara} av ${lista.length}</strong> klara.</p>
      <ol class="kedja">${rader}</ol>
      ${antalKlara === lista.length && lista.length ? '<p class="slutsats-klar">Kedjan är komplett. Nu vet du tillräckligt för att anklaga – och för att välja bevis.</p>' : ''}
    </div>`;
    $$('.slutsats.redo', sida).forEach((li) => {
      const s = lista.find((x) => x.id === li.dataset.s);
      $$('.alt', li).forEach((b) => b.onclick = () => {
        const a = s.alternativ[+b.dataset.j];
        if (a.ratt) {
          st.slutsatser[s.id] = true; delete fel[s.id];
          if (s.ger_fynd) geFynd?.(s.ger_fynd);
        } else {
          fel[s.id] = a.svar || 'Det stämmer inte med fynden. Läs dem igen.';
          st.slutsatsFel = (st.slutsatsFel || 0) + 1;
        }
        onAndrat?.(); rita();
        const ny = sida.querySelector('.slutsats.redo, .slutsats-klar');
        if (a.ratt && ny) ny.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      });
    });
  };
  rita();
}
