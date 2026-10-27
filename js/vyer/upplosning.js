// Upplösningen: detektivens förklaring steg för steg, uteslutningar, villospår och resultat.
import { laddaFall, fyndMap, fallTitel } from '../motor/fall.js';
import { fallData } from '../motor/lagring.js';
import { formatTid } from '../motor/poang.js';
import { esc, glasRad, $, $$ } from './gemensamt.js';

export async function visaUpplosning(app, id) {
  const f = await laddaFall(id);
  const st = fallData(id);
  const res = st.resultat;
  if (!res) { location.hash = `#/fall/${id}`; return null; }
  const fynd = fyndMap(f);
  const person = Object.fromEntries(f.personer.map((p) => [p.id, p]));
  const chip = (fid) => {
    const x = fynd[fid]; if (!x) return '';
    const har = st.fynd.includes(fid);
    const bev = res.bevis.includes(fid);
    return `<span class="fyndchip ${har ? '' : 'missat'} ${bev ? 'bevis' : ''}" title="${har ? 'Du hittade detta' : 'Detta fynd missade du'}">${esc(x.ikon || '')} ${esc(x.titel)}</span>`;
  };
  const steg = (f.aterkoppling.forklaring_steg || []).map((s) => (typeof s === 'string' ? { text: s } : s));
  const oskyldiga = f.personer.filter((p) => p.misstankt && p.id !== f.losning.skyldig);
  const villospar = f.fynd.filter((x) => x.forklaring);
  const hurText = f.anklagelse?.hur_alternativ?.find((h) => h.id === res.hur)?.text;

  app.innerHTML = `<div class="sida upplosning" style="--accent:${f.meta.accentfarg}">
    <a class="tillbaka" href="#/">‹ Fallmenyn</a>
    <header class="upplosning-huvud ${res.losta ? 'ratt' : 'fel'}">
      <p class="rubrik-liten">${esc(fallTitel(f))}</p>
      <h1>${res.losta ? 'Fallet är löst' : 'Fallet förblev olöst'}</h1>
      ${res.losta ? glasRad(res.glas, 3, 40) : ''}
    </header>
    ${res.losta ? `<blockquote class="citat stor">${esc(f.aterkoppling.ratt)}</blockquote>` : `<section class="papperskort facit">
      <p class="rubrik-liten">${res.visad ? 'Du valde att se lösningen.' : 'Två felaktiga anklagelser – här är hela lösningen.'}</p>
      <h2>Den skyldige: ${esc(person[f.losning.skyldig].namn)}</h2>
      <p><strong>Så gick det till:</strong> ${esc(f.losning.hur_text || '')}</p>
      <p class="hjalptext">Nedan går detektiven igenom kedjan steg för steg: vilka fynd som avgör, varför de andra kan uteslutas och vilka spår som var villospår. Fynd med streckad ram missade du.</p>
    </section>`}
    ${f.meta.twist && f.aterkoppling.efterord ? `<section class="papperskort twist"><h2><span aria-hidden="true">🜂</span> Vändningen</h2><p>${esc(f.aterkoppling.efterord)}</p></section>` : ''}
    <section class="papperskort">
      <h2>Detektivens förklaring</h2>
      <ol class="steglista">${steg.map((s, i) => `<li class="steg" data-i="${i}" ${i ? 'hidden' : ''}><p>${esc(s.text)}</p>${(s.fynd || []).length ? `<div class="chips">${s.fynd.map(chip).join('')}</div>` : ''}</li>`).join('')}</ol>
      <div class="knapprad"><button class="knapp massing" id="nasta">Nästa steg</button><button class="lank" id="allt">Visa allt</button></div>
    </section>
    <div id="efter" hidden>
      <section class="papperskort">
        <h2>Varför de andra kan uteslutas</h2>
        <ul class="uteslutningar">${oskyldiga.map((p) => `<li><strong>${esc(p.namn)}</strong> – ${esc(f.losning.uteslutningar_text?.[p.id] || '')}<div class="chips">${(f.losning.uteslutningar[p.id] || []).map(chip).join('')}</div></li>`).join('')}</ul>
      </section>
      ${villospar.length ? `<section class="papperskort"><h2>Villospår och stödbevis</h2><ul class="uteslutningar">${villospar.map((x) => `<li>${chip(x.id)}<p>${esc(x.forklaring)}</p></li>`).join('')}</ul></section>` : ''}
      <section class="papperskort resultat">
        <h2>Resultat</h2>
        <dl>
          <dt>Betyg</dt><dd>${glasRad(res.glas, 3, 22)} ${res.glas} av 3</dd>
          <dt>Poäng</dt><dd>${res.poang} av 100</dd>
          <dt>Ledtrådar</dt><dd>${res.ledtradar} av 3 använda</dd>
          <dt>Felaktiga anklagelser</dt><dd>${res.fel.length ? res.fel.map((p) => esc(person[p]?.namn)).join(', ') : 'Inga'}</dd>
          <dt>Hur och när</dt><dd>${res.hur ? (res.hurRatt ? '✓ Rätt' : '✗ Fel') + ` – ${esc(hurText || '')}` : 'Inte angivet'}<br><small>Svar: ${esc(f.losning.hur_text || '')}</small></dd>
          <dt>Bevis</dt><dd>${res.bevis.length ? (res.bevisRatt ? '✓ Bevisen håller' : '✗ Bevisen räcker inte') : 'Inga bevis angivna'}${res.bevis.length ? `<div class="chips">${res.bevis.map(chip).join('')}</div>` : ''}</dd>
          <dt>Tid</dt><dd>${formatTid(res.tid || 0)}</dd>
        </dl>
        <p class="hjalptext">Ett förstoringsglas för löst fall, ett till om du har minst 75 poäng kvar, och ett för bevis som håller (och rätt svar på hur och när, om du angav det).</p>
      </section>
      <div class="knappkolumn">
        <a class="knapp massing stor" href="#/">Till fallmenyn</a>
        <a class="knapp sekundar" href="#/fall/${id}">Spela fallet igen</a>
      </div>
    </div>
  </div>`;
  let i = 0;
  const visaNasta = () => {
    i++;
    const li = $(`.steg[data-i="${i}"]`, app);
    if (li) { li.hidden = false; li.classList.add('ny'); li.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
    if (i >= steg.length - 1) { $('#nasta', app).hidden = true; $('#allt', app).hidden = true; $('#efter', app).hidden = false; }
  };
  $('#nasta', app).onclick = visaNasta;
  $('#allt', app).onclick = () => { $$('.steg', app).forEach((x) => (x.hidden = false)); i = steg.length; $('#nasta', app).hidden = true; $('#allt', app).hidden = true; $('#efter', app).hidden = false; };
  if (steg.length <= 1 || !res.losta) $('#allt', app).click();
  return null;
}
