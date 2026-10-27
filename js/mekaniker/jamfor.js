// Förhör och dokument: markera två utsagor, textstycken eller fynd som inte kan vara sanna samtidigt – ”Invänd!”.
import { har, fyndMap } from '../motor/fall.js';
import { vagTill, pekarText } from '../motor/vagledning.js';
import { esc, medaljong, html, $, $$ } from '../vyer/gemensamt.js';

const nyckel = (a, b) => [a, b].sort().join('|');

export function status(m, st) {
  const s = st.mek?.[m.id] || {};
  const alla = (m.payload.motsagelser || []).filter((x) => x.kravs !== false);
  const h = s.hittade || [];
  const hittade = alla.filter((x) => h.includes(x.id)).length;
  return { hittade, extra: h.length - hittade, totalt: alla.length, klar: alla.every((x) => s.hittade?.includes(x.id)) };
}

export function rendera(sida, m, ctx) {
  const { f, st } = ctx;
  const p = m.payload;
  st.mek[m.id] ||= { hittade: [], markerade: [], dok: null };
  const ms = st.mek[m.id];
  const fynd = fyndMap(f);
  const person = Object.fromEntries(f.personer.map((x) => [x.id, x]));
  const dokument = p.visning === 'dokument';
  let valda = [];
  let besked = null;

  // Alla valbara poster: id -> { text, kort, typ }
  const poster = {};
  for (const u of p.utsagor || []) poster[u.id] = { text: u.text, kort: `${person[u.person]?.namn || ''}: ”${u.text}”`, typ: 'utsaga' };
  for (const d of p.dokument || []) for (const s of d.stycken || []) if (s.id) poster[s.id] = { text: s.text, kort: `${d.titel}: ”${s.text}”`, typ: 'stycke', dok: d.id };
  const synlig = (id) => {
    const x = poster[id];
    if (x?.typ === 'utsaga') return har(st, id);
    if (x?.typ === 'stycke') return har(st, x.dok);
    return st.fynd.includes(id);
  };
  const kortText = (id) => poster[id]?.kort || (fynd[id] ? `Fynd: ${fynd[id].titel}` : id);

  function rita() {
    const hittade = (p.motsagelser || []).filter((x) => ms.hittade.includes(x.id));
    const st0 = status(m, st);
    let innehall = '';
    if (!dokument) {
      const perPerson = {};
      for (const u of p.utsagor || []) (perPerson[u.person] ||= []).push(u);
      innehall = Object.entries(perPerson).map(([pid, lista]) => {
        const kanda = lista.filter((u) => har(st, u.id));
        const pers = person[pid] || { namn: pid, roll: '' };
        if (!kanda.length) {
          const v = vagTill(f, st, lista[0].id);
          return `<section class="jf-person okand">${medaljong(pers)}<div><strong>${esc(pers.namn)}</strong> <em>${esc(pers.roll)}</em><p class="jf-okand">Inte förhörd än. ${v ? esc(pekarText(v)) : ''}</p></div></section>`;
        }
        const saknas = lista.length - kanda.length;
        return `<section class="jf-person">${medaljong(pers)}<div><strong>${esc(pers.namn)}</strong> <em>${esc(pers.roll)}</em>
          ${kanda.map((u) => `<button class="jf-post bubbla ${valda.includes(u.id) ? 'vald' : ''}" data-id="${u.id}">${esc(u.text)}</button>`).join('')}
          ${saknas ? `<p class="jf-okand">${saknas === 1 ? 'Kanske har hen mer att säga – senare.' : 'Mer kan komma fram senare.'}</p>` : ''}</div></section>`;
      }).join('');
    } else {
      const agda = (p.dokument || []).filter((d) => har(st, d.id));
      if (!ms.dok || !agda.some((d) => d.id === ms.dok)) ms.dok = agda[0]?.id || null;
      const d = agda.find((x) => x.id === ms.dok);
      const ej = (p.dokument || []).filter((x) => !har(st, x.id));
      innehall = `<div class="jf-dokval">${agda.map((x) => {
          const antal = (x.stycken || []).filter((s) => s.id && valda.includes(s.id)).length;
          return `<button class="chip ${x.id === ms.dok ? 'vald' : ''}" data-dok="${x.id}">${esc(x.ikon || '📄')} ${esc(x.titel)}${antal ? ' •' : ''}</button>`;
        }).join('')}</div>
        ${ej.length ? `<p class="jf-okand">${ej.length} ${ej.length === 1 ? 'dokument' : 'dokument'} till finns någonstans på platsen.</p>` : ''}
        ${d ? `<article class="dokument stil-${d.stil || 'hand'}"><h4>${esc(d.titel)}</h4>${d.underrubrik ? `<p class="dok-under">${esc(d.underrubrik)}</p>` : ''}
          ${(d.stycken || []).map((s) => s.id
            ? `<button class="jf-post stycke ${valda.includes(s.id) ? 'vald' : ''} ${ms.markerade.includes(s.id) ? 'markerad' : ''} ${s.stil ? 'st-' + s.stil : ''}" data-id="${s.id}">${esc(s.text)}</button>`
            : `<p class="dok-text ${s.stil ? 'st-' + s.stil : ''}">${esc(s.text)}</p>`).join('')}
        </article>` : '<p class="tomt">Du har inga dokument än.</p>'}`;
    }
    const fyndChips = st.fynd.filter((id) => fynd[id] && (p.fynd_valbara ? p.fynd_valbara.includes(id) : true));
    sida.innerHTML = `<div class="jamfor ${dokument ? 'dok' : 'forhor'}">
      <p class="instruktion">${esc(p.instruktion || (dokument ? 'Läs dokumenten noga. Tryck på två stycken – eller ett stycke och ett fynd – som inte kan stämma samtidigt, och tryck på Invänd!' : 'Tryck på en utsaga och sedan på en annan utsaga eller ett fynd som den inte kan stämma med. Tryck sedan på Invänd!'))}</p>
      <p class="jf-status">Motsägelser hittade: <strong>${st0.hittade} av ${st0.totalt}</strong>${st0.klar ? ' ✓' : ''}${st0.extra ? ` <em>(+${st0.extra} extra)</em>` : ''}</p>
      ${hittade.length ? `<ul class="jf-hittade">${hittade.map((x) => `<li><strong>Motsägelse:</strong> ${esc(x.text)}${x.ger_fynd && fynd[x.ger_fynd] ? ` <span class="fyndchip">${esc(fynd[x.ger_fynd].ikon || '')} ${esc(fynd[x.ger_fynd].titel)}</span>` : ''}</li>`).join('')}</ul>` : ''}
      ${innehall}
      ${fyndChips.length ? `<details class="jf-fynd" ${valda.some((v) => fynd[v]) ? 'open' : ''}><summary>Invänd med ett fynd (${fyndChips.length})</summary><div class="chips">${fyndChips.map((id) => `<button class="jf-post chip ${valda.includes(id) ? 'vald' : ''}" data-id="${id}">${esc(fynd[id].ikon || '')} ${esc(fynd[id].titel)}</button>`).join('')}</div></details>` : ''}
      <div class="jf-val ${valda.length ? 'aktiv' : ''}">
        ${besked ? `<p class="jf-besked ${besked.ok ? 'ok' : 'fel'}">${esc(besked.text)}</p>` : ''}
        <div class="jf-platser">${[0, 1].map((i) => `<div class="jf-plats ${valda[i] ? 'fylld' : ''}">${valda[i] ? esc(kortText(valda[i])) : i === 0 ? 'Välj något att invända mot …' : '… och något som motsäger det'}</div>`).join('<span class="jf-mot">↔</span>')}</div>
        <div class="knapprad"><button class="knapp liten sekundar" data-rensa ${valda.length ? '' : 'disabled'}>Rensa</button>${dokument ? `<button class="knapp liten sekundar" data-markera ${valda.length ? '' : 'disabled'}>Markera</button>` : ''}<button class="knapp massing" data-invand ${valda.length === 2 ? '' : 'disabled'}>Invänd!</button></div>
      </div>
    </div>`;
    $$('.jf-post', sida).forEach((b) => b.onclick = () => {
      const id = b.dataset.id;
      besked = null;
      if (valda.includes(id)) valda = valda.filter((x) => x !== id);
      else if (valda.length < 2) valda.push(id);
      else valda = [valda[0], id];
      rita();
    });
    $$('[data-dok]', sida).forEach((b) => b.onclick = () => { ms.dok = b.dataset.dok; ctx.spara(); rita(); });
    $('[data-rensa]', sida).onclick = () => { valda = []; besked = null; rita(); };
    const mk = $('[data-markera]', sida);
    if (mk) mk.onclick = () => { for (const v of valda) if (poster[v]?.typ === 'stycke') { const i = ms.markerade.indexOf(v); if (i >= 0) ms.markerade.splice(i, 1); else ms.markerade.push(v); } ctx.spara(); rita(); };
    $('[data-invand]', sida).onclick = invand;
  }

  function invand() {
    if (valda.length !== 2) return;
    const k = nyckel(valda[0], valda[1]);
    const traff = (p.motsagelser || []).find((x) => x.par.some(([a, b]) => nyckel(a, b) === k));
    if (!traff) {
      ms.fel = (ms.fel || 0) + 1;
      besked = { ok: false, text: p.fel_text || 'De två kan mycket väl vara sanna samtidigt. Ingen motsägelse – försök med något annat.' };
      rita();
      $('.jf-val', sida)?.classList.add('skaka');
      return;
    }
    if (ms.hittade.includes(traff.id)) { besked = { ok: true, text: 'Den motsägelsen har du redan hittat.' }; valda = []; rita(); return; }
    ms.hittade.push(traff.id);
    valda = [];
    besked = { ok: true, text: 'Invändning! ' + traff.text };
    ctx.spara();
    if (traff.ger_fynd) ctx.geFynd(traff.ger_fynd);
    rita();
    sida.scrollTop = 0;
  }
  rita();
  void html;
}
