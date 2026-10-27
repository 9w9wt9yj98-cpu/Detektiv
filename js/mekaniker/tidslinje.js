// Tidslinje: lägg tidskorten på rätt persons tidslinje. Motorn räknar gångtiderna mellan platserna,
// visar när någon skulle behöva vara på två ställen samtidigt, och låter spelaren pröva varje person mot brottstiden.
import { har, fyndMap, personMap } from '../motor/fall.js';
import { vagTill, pekarText } from '../motor/vagledning.js';
import { esc, medaljong, $, $$ } from '../vyer/gemensamt.js';

/** "22.40" → minuter efter midnatt. Timmar före 12 räknas som efter midnatt (natten). */
export function minuter(t) {
  if (t === undefined || t === null) return null;
  const [h, m] = String(t).split(/[.:]/).map(Number);
  return ((h < 12 ? h + 24 : h) * 60) + (m || 0);
}
export const klocka = (min) => { const h = Math.floor(min / 60) % 24, m = min % 60; return `${String(h).padStart(2, '0')}.${String(m).padStart(2, '0')}`; };

export function gangtid(p, a, b) {
  if (a === b) return 0;
  for (const [x, y, t] of p.gangtider || []) if ((x === a && y === b) || (x === b && y === a)) return t;
  return null;
}
const slut = (k) => k._till ?? k._fran;
const norm = (k) => ({ ...k, _fran: minuter(k.fran), _till: k.till ? minuter(k.till) : null });

/**
 * Analyserar en persons tidslinje. Ren funktion – används av vyn, valideringen och testerna.
 * Returnerar { fakta: [...], resor: [{ fran, till, behov, finns, ok, over }], konflikter: [{ pastaende, fakta, text }], mojlig, orsak }.
 */
export function analysera(p, kortIds, { hypotes = null } = {}) {
  const alla = Object.fromEntries((p.kort || []).map((k) => [k.id, k]));
  const kort = kortIds.map((id) => alla[id]).filter(Boolean).map(norm);
  const fakta = kort.filter((k) => k.typ !== 'pastaende');
  if (hypotes) fakta.push(norm({ id: '_hypotes', plats: hypotes.plats, fran: hypotes.fran, till: hypotes.till, typ: 'hypotes', titel: hypotes.text || 'Vid brottsplatsen' }));
  fakta.sort((a, b) => a._fran - b._fran || slut(a) - slut(b));
  const resor = [];
  let mojlig = true, orsak = null;
  for (let i = 0; i + 1 < fakta.length; i++) {
    const a = fakta[i], b = fakta[i + 1];
    const behov = gangtid(p, a.plats, b.plats);
    const finns = b._fran - slut(a);
    const r = { fran: a, till: b, behov, finns, ok: behov === null ? null : finns >= behov, over: behov === null ? null : finns - behov };
    if (a.plats !== b.plats && finns < 0) { r.ok = false; r.samtidigt = true; }
    resor.push(r);
    if (r.ok === false && (a.typ === 'hypotes' || b.typ === 'hypotes')) { mojlig = false; orsak ||= r; }
  }
  // En hypotes mitt i ett intervall på en annan plats
  if (hypotes) {
    const h = fakta.find((k) => k.typ === 'hypotes');
    for (const k of fakta) if (k !== h && k._till !== null && k.plats !== h.plats && k._fran <= h._fran && k._till >= slut(h)) { mojlig = false; orsak = { fran: k, till: h, samtidigt: true, ok: false }; }
  }
  // Påståenden som inte går ihop med fakta
  const konflikter = [];
  for (const c of kort.filter((k) => k.typ === 'pastaende')) {
    const cTill = c._till ?? c._fran;
    for (const f of kort.filter((k) => k.typ !== 'pastaende')) {
      const fTill = f._till ?? f._fran;
      if (f.plats !== c.plats && f._fran <= cTill && fTill >= c._fran) konflikter.push({ pastaende: c.id, fakta: f.id, typ: 'samtidigt' });
      else if (f.plats === c.plats && f.ankomst && c._fran < f._fran - 3) konflikter.push({ pastaende: c.id, fakta: f.id, typ: 'ankomst' });
    }
  }
  return { fakta, resor, konflikter, mojlig: hypotes ? mojlig : null, orsak };
}

export function status(m, st) {
  const s = st.mek?.[m.id] || {};
  const mal = [...(m.payload.konflikter || []), ...(m.payload.prov || [])].filter((x) => x.kravs !== false);
  const gjort = new Set([...(s.invant || []), ...Object.keys(s.prov || {}).map((p) => 'prov:' + p)]);
  const klara = mal.filter((x) => gjort.has(x.person ? 'prov:' + x.person : x.id)).length;
  return { hittade: klara, totalt: mal.length, klar: klara === mal.length };
}

export function rendera(sida, m, ctx) {
  const { f, st } = ctx;
  const p = m.payload;
  st.mek[m.id] ||= { placerade: [], invant: [], prov: {} };
  const ms = st.mek[m.id];
  ms.placerade ||= []; ms.invant ||= []; ms.prov ||= {};
  const fynd = fyndMap(f), pers = personMap(f);
  const kortMap = Object.fromEntries((p.kort || []).map((k) => [k.id, k]));
  const plats = (id) => p.platser?.[id] || id;
  const A = minuter(p.fran || '22.00'), B = minuter(p.till || '23.30');
  const pos = (t) => Math.max(0, Math.min(100, ((t - A) / (B - A)) * 100));
  let vald = null, besked = null;
  const brottKant = () => (p.brott?.kraver || []).every((id) => har(st, id));

  function bana(pid) {
    const ids = ms.placerade.filter((id) => kortMap[id]?.person === pid);
    const prov = p.prov?.find((x) => x.person === pid);
    const provat = ms.prov[pid];
    const an = analysera(p, ids, { hypotes: provat ? p.brott : null });
    const utan = provat ? analysera(p, ids) : an;
    const saknas = (p.kort || []).filter((k) => k.person === pid && k.typ !== 'pastaende' && !ms.placerade.includes(k.id));
    const axel = [...ids.map((id) => norm(kortMap[id])), ...(provat ? [norm({ ...p.brott, id: '_h', typ: 'hypotes' })] : [])].map((k) => {
      const a = pos(k._fran), b = pos(k._till ?? k._fran);
      const w = Math.max(b - a, 2.2);
      return `<span class="tl-block ${k.typ || 'fakta'}" style="left:${Math.min(a, 100 - w)}%;width:${w}%" title="${esc(k.titel || '')}"></span>`;
    }).join('');
    const brott = brottKant() && p.brott ? `<span class="tl-brottband" style="left:${pos(minuter(p.brott.fran))}%;width:${Math.max(1.4, pos(minuter(p.brott.till)) - pos(minuter(p.brott.fran)))}%"></span>` : '';
    const rader = [];
    const lista = [...an.fakta];
    for (const c of ids.map((id) => norm(kortMap[id])).filter((k) => k.typ === 'pastaende')) lista.push(c);
    lista.sort((a, b) => a._fran - b._fran || (a.typ === 'pastaende') - (b.typ === 'pastaende'));
    const resaEfter = new Map(an.resor.map((r) => [r.fran, r]));
    for (const k of lista) {
      const tid = k._till !== null && k._till !== undefined ? `${klocka(k._fran)}–${klocka(k._till)}` : klocka(k._fran);
      rader.push(`<li class="tl-rad ${k.typ || 'fakta'}"><span class="tl-tid">${tid}</span><span class="tl-text"><strong>${esc(k.typ === 'hypotes' ? (p.brott.text || 'Vid brottsplatsen?') : k.titel)}</strong> · ${esc(plats(k.plats))}${k.typ === 'pastaende' ? ' <em>(påstår)</em>' : k.kalla ? ` <em>(${esc(k.kalla)})</em>` : ''}</span></li>`);
      const r = resaEfter.get(k);
      if (r && k.typ !== 'pastaende') {
        const fr = plats(r.fran.plats), ti = plats(r.till.plats);
        let txt, kl;
        if (r.fran.plats === r.till.plats) { txt = `kvar i ${ti}`; kl = 'ok'; }
        else if (r.behov === null) { txt = `${fr} → ${ti}: gångtiden okänd`; kl = 'okand'; }
        else if (r.samtidigt) { txt = `Omöjligt: kan inte vara på två ställen samtidigt`; kl = 'fel'; }
        else if (!r.ok) { txt = `${fr} → ${ti}: ${r.behov} min gång, bara ${Math.max(0, r.finns)} min. Omöjligt.`; kl = 'fel'; }
        else if (r.over >= (p.lucka_min ?? 15) && r.fran.typ !== 'hypotes' && r.till.typ !== 'hypotes') { txt = `${fr} → ${ti}: ${r.behov} min gång, ${r.finns} min. ${r.over} min oförklarade!`; kl = 'lucka'; }
        else { txt = `${fr} → ${ti}: ${r.behov} min gång, ${r.finns} min ✓${r.over === 0 ? ' – på minuten' : ''}`; kl = 'ok'; }
        rader.push(`<li class="tl-resa ${kl}">↓ ${esc(txt)}</li>`);
      }
    }
    if (an.orsak?.samtidigt && provat) rader.push(`<li class="tl-resa fel">↯ ${esc(plats(an.orsak.fran.plats))} ${klocka(an.orsak.fran._fran)}–${klocka(an.orsak.fran._till)} – hen kan inte samtidigt ha varit i ${esc(plats(p.brott.plats))}.</li>`);
    const konf = utan.konflikter.map((c) => {
      const def = (p.konflikter || []).find((x) => x.kraver.includes(c.pastaende) && x.kraver.includes(c.fakta));
      const klar = def && ms.invant.includes(def.id);
      return `<div class="tl-konflikt ${klar ? 'klar' : ''}">⚡ <span>${esc(kortMap[c.pastaende].titel)} ↔ ${esc(kortMap[c.fakta].titel)}</span>${def && !klar ? `<button class="knapp liten massing" data-invand="${def.id}">Invänd!</button>` : klar ? ' <strong>✓</strong>' : ''}</div>`;
    }).join('');
    let provKnapp = '';
    if (prov && p.brott) {
      if (provat) provKnapp = `<p class="tl-prov ${provat === 'mojlig' ? 'mojlig' : 'omojlig'}">${provat === 'mojlig' ? '✓ Det går ihop: hen kan ha varit vid montern.' : '✗ Omöjligt: hen kan inte ha varit vid montern.'}</p>`;
      else if (!brottKant()) provKnapp = `<p class="jf-okand">Fastställ brottstiden först (fliken Slutsatser), sedan kan du pröva varje person mot den.</p>`;
      else provKnapp = `<button class="knapp liten sekundar tl-provknapp" data-prova="${pid}">Pröva: ${esc(p.brott.fraga || 'vid brottsplatsen')} ${esc(p.brott.fran)}–${esc(p.brott.till)}?</button>`;
    }
    const pp = pers[pid] || { namn: pid };
    return `<section class="tl-bana ${vald ? 'malbar' : ''}" data-bana="${pid}">
      <header>${medaljong(pp)}<div><strong>${esc(pp.namn)}</strong> <em>${esc(pp.roll || '')}</em></div>${vald ? `<button class="knapp liten massing" data-lagg="${pid}">Lägg här</button>` : ''}</header>
      <div class="tl-axel">${brott}${axel}</div>
      ${rader.length ? `<ol class="tl-rader">${rader.join('')}</ol>` : '<p class="jf-okand">Inga kort än.</p>'}
      ${konf}
      ${saknas.length && !ids.length ? '' : saknas.length ? `<p class="jf-okand">Det finns fler uppgifter om ${esc(pp.namn.split(' ')[0])} att hitta.</p>` : ''}
      ${provKnapp}
    </section>`;
  }

  function rita() {
    const s0 = status(m, st);
    const ejLagda = (p.kort || []).filter((k) => har(st, k.id) && !ms.placerade.includes(k.id));
    const okanda = (p.kort || []).filter((k) => !har(st, k.id));
    const pek = okanda.length ? vagTill(f, st, okanda[0].id) : null;
    const tick = [];
    for (let t = Math.ceil(A / 15) * 15; t <= B; t += 15) tick.push(`<span style="left:${pos(t)}%">${klocka(t)}</span>`);
    const platsIds = [...new Set((p.gangtider || []).flatMap(([a, b]) => [a, b]))];
    sida.innerHTML = `<div class="tidslinje">
      <p class="instruktion">${esc(p.instruktion || 'Tryck på ett tidskort och sedan på den person det gäller. Gångtiderna räknas ut åt dig.')}</p>
      <p class="jf-status">Klart: <strong>${s0.hittade} av ${s0.totalt}</strong>${s0.klar ? ' ✓' : ''}</p>
      <details class="tl-tabell"><summary>🗺️ Gångtider i minuter</summary><table>${(p.gangtider || []).map(([a, b, t]) => `<tr><td>${esc(plats(a))} ↔ ${esc(plats(b))}</td><td>${t}</td></tr>`).join('')}</table></details>
      <p class="tl-brottrad">${brottKant() && p.brott ? `🕰️ <strong>Brottstiden:</strong> ${esc(p.brott.fran)}–${esc(p.brott.till)} i ${esc(plats(p.brott.plats))}` : '🕰️ Brottstiden är inte fastställd än. Besvara frågan under Slutsatser när du har tre oberoende källor.'}</p>
      <div class="tl-hog">${ejLagda.length ? `<p class="tl-hogrubrik">Tidskort att lägga (${ejLagda.length}):</p>` : ''}${ejLagda.map((k) => `<button class="tl-kort ${k.typ || 'fakta'} ${vald === k.id ? 'vald' : ''}" data-kort="${k.id}"><span class="tl-tid">${esc(k.fran)}${k.till ? '–' + esc(k.till) : ''}</span> ${esc(k.ikon || '')} ${esc(k.titel)}<small>${esc(k.text || '')}${k.kalla ? ` (${esc(k.kalla)})` : ''}</small></button>`).join('')}
        ${!ejLagda.length && !okanda.length ? '<p class="jf-okand">Alla tidskort ligger på plats.</p>' : ''}
        ${okanda.length ? `<p class="jf-okand">${okanda.length} tidskort till finns att hitta.${pek ? ' ' + esc(pekarText(pek)) : ''}</p>` : ''}</div>
      <div class="bj-besked-ruta ${besked ? 'aktiv' : ''}">${besked ? `<p class="jf-besked ${besked.ok ? 'ok' : besked.neutral ? 'neutral' : 'fel'}">${esc(besked.text)}</p>` : `<p class="jf-besked neutral">${vald ? '→ Tryck på ”Lägg här” hos den person kortet gäller.' : 'Tryck på ett tidskort.'}</p>`}</div>
      <div class="tl-skala">${tick.join('')}</div>
      ${(p.personer || []).map(bana).join('')}
      <p class="tl-forklaring"><span class="tl-block fakta"></span> uppgift från oberoende källa <span class="tl-block pastaende"></span> personens eget påstående ${brottKant() ? '<span class="tl-brottband liten"></span> brottstiden' : ''}</p>
    </div>`;
    void platsIds;
    $$('[data-kort]', sida).forEach((b) => b.onclick = () => { vald = vald === b.dataset.kort ? null : b.dataset.kort; besked = null; rita(); });
    $$('[data-lagg]', sida).forEach((b) => b.onclick = (e) => { e.stopPropagation(); lagg(b.dataset.lagg); });
    $$('[data-invand]', sida).forEach((b) => b.onclick = () => invand(b.dataset.invand));
    $$('[data-prova]', sida).forEach((b) => b.onclick = () => prova(b.dataset.prova));
  }
  function behall(fn) { const y = sida.scrollTop; fn(); rita(); sida.scrollTop = y; }
  function lagg(pid) {
    const k = kortMap[vald];
    if (!k) return;
    behall(() => {
      if (k.person !== pid) { besked = { ok: false, text: `Kortet ”${k.titel}” handlar inte om ${pers[pid]?.namn || pid}. Läs det igen.` }; return; }
      ms.placerade.push(k.id); vald = null;
      besked = { ok: true, neutral: true, text: `Lagt på ${pers[pid]?.namn}s tidslinje.` };
      ctx.spara();
    });
  }
  function invand(id) {
    const d = (p.konflikter || []).find((x) => x.id === id);
    if (!d || ms.invant.includes(id)) return;
    behall(() => {
      ms.invant.push(id);
      besked = { ok: true, text: 'Invändning! ' + d.text };
      ctx.spara();
      if (d.ger_fynd) ctx.geFynd(d.ger_fynd);
    });
  }
  function prova(pid) {
    const pr = p.prov.find((x) => x.person === pid);
    const ids = ms.placerade.filter((id) => kortMap[id]?.person === pid);
    const saknas = (p.kort || []).filter((k) => k.person === pid && k.typ !== 'pastaende' && !ids.includes(k.id));
    behall(() => {
      if (saknas.length) { besked = { ok: false, text: `Lägg först alla uppgifter om ${pers[pid]?.namn} från oberoende källor på tidslinjen${saknas.some((k) => !har(st, k.id)) ? ' – en del har du inte hittat än' : ''}.` }; return; }
      const r = analysera(p, ids, { hypotes: p.brott });
      ms.prov[pid] = r.mojlig ? 'mojlig' : 'omojlig';
      besked = { ok: true, text: (r.mojlig ? pr.text_mojlig : pr.text_omojlig) || (r.mojlig ? 'Det går ihop.' : 'Omöjligt.') };
      ctx.spara();
      if (pr.ger_fynd && !st.fynd.includes(pr.ger_fynd)) ctx.geFynd(pr.ger_fynd);
    });
  }
  void fynd;
  rita();
}
