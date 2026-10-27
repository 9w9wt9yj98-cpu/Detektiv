import { laddaIndex, laddaFall } from '../motor/fall.js';
import { las, nollstallAllt } from '../motor/lagring.js';
import { totalGlas, rang } from '../motor/poang.js';
import { esc, glasRad, bekrafta, $ } from './gemensamt.js';
import { VERSION } from '../version.js';

const LANGD = { kort: 'Kort', medel: 'Medel', lang: 'Lång' };

export async function visaMeny(app) {
  const idx = await laddaIndex();
  const data = las();
  const glas = totalGlas(data);
  const r = rang(glas);
  const kort = [];
  for (const kap of idx.kapitel) {
    kort.push(`<h2 class="kapitel">${esc(kap.titel)}</h2>`);
    for (const post of kap.fall) {
      if (post.kommer) {
        kort.push(`<div class="fallkort kommer"><div class="fallkort-nr">${post.nummer}</div><div class="fallkort-text"><h3>${esc(post.titel)}</h3><p class="meta">Akten är ännu förseglad</p></div><div class="sigill" aria-hidden="true">✶</div></div>`);
        continue;
      }
      const f = await laddaFall(post.id);
      const st = data.fall[f.id];
      let status = '<span class="status ny">Ny akt</span>';
      if (st?.basta) status = glasRad(st.basta.glas, 3, 20);
      else if (st?.status === 'misslyckad') status = '<span class="status">Olöst</span>';
      if (st?.status === 'pagaende') status += ' <span class="status pagar">Pågår</span>';
      kort.push(`<a class="fallkort" href="#/fall/${f.id}" style="--accent:${f.meta.accentfarg || '#7a2e1f'}">
        <div class="fallkort-bild" style="background-image:url('${esc(f.meta.omslag)}')"></div>
        <div class="fallkort-nr">${f.nummer}</div>
        <div class="fallkort-text">
          <h3>${esc(f.meta.titel)}</h3>
          <p class="meta">${esc(f.meta.miljo)} · ${esc(f.meta.epok)}</p>
          <p class="meta">${LANGD[f.meta.langd]} (${f.meta.uppskattad_tid_min.join('–')} min) · Svårighet ${'●'.repeat(f.meta.svarighet)}${'○'.repeat(5 - f.meta.svarighet)}</p>
          <div class="fallkort-status">${status}</div>
        </div></a>`);
    }
  }
  app.innerHTML = `<div class="sida meny">
    <header class="meny-huvud">
      <div class="emblem" aria-hidden="true">${glasRad(1, 1, 44)}</div>
      <h1>Detektiv</h1>
      <p class="undertitel">Fall att lösa med logik och observation</p>
      <div class="rang"><span>Rang: <strong>${esc(r.namn)}</strong></span><span>${glas} förstoringsglas${r.nasta ? ` · ${r.nasta.krav - glas} till ${esc(r.nasta.namn)}` : ''}</span></div>
    </header>
    <section class="fallista">${kort.join('')}</section>
    <footer class="meny-fot">
      <p>Allt som behövs för att lösa ett fall finns i materialet. Du behöver aldrig gissa.</p>
      <button class="lank" id="nollstall">Nollställ all progression</button>
      <p class="version">Version ${VERSION}</p>
    </footer>
  </div>`;
  $('#nollstall', app).onclick = async () => { if (await bekrafta('Radera alla sparade fall och poäng?', { ja: 'Radera' })) { nollstallAllt(); visaMeny(app); } };
  return null;
}
