import { laddaIndex, laddaFall } from '../motor/fall.js';
import { las, nollstallAllt } from '../motor/lagring.js';
import { totalGlas, rang, kapitelStatus } from '../motor/poang.js';
import { esc, glasRad, bekrafta, $ } from './gemensamt.js';
import { VERSION } from '../version.js';
import { VERKLIG } from '../tre/stil.js';

/** ”Kapitel I – Aspirant” → ”kapitel I” */
const kortTitel = (t) => (t.split(' – ')[0] || t).replace(/^Kapitel/, 'kapitel');
const LANGD = { kort: 'Kort', medel: 'Medel', lang: 'Lång' };

export async function visaMeny(app) {
  const idx = await laddaIndex();
  const data = las();
  const glas = totalGlas(data);
  const r = rang(glas);
  // Hämta alla fall samtidigt. Ett fall som inte går att läsa ska inte stoppa resten av menyn.
  const poster = idx.kapitel.flatMap((k) => k.fall).filter((p) => !p.kommer);
  const laddade = new Map(await Promise.all(poster.map((p) => laddaFall(p.id).then((f) => [p.id, f], (e) => { console.warn('Fallet kunde inte läsas', p.id, e); return [p.id, null]; }))));
  const kort = [];
  const kapStatus = kapitelStatus(idx, data);
  // Ett fall som spelaren redan har påbörjat stängs aldrig, även om kapitlet annars är låst.
  const paborjat = (id) => !!data.fall[id] && data.fall[id].status !== 'ny';
  for (const [ki, kap] of idx.kapitel.entries()) {
    const { oppet, krav, foregaende } = kapStatus[ki];
    kort.push(`<h2 class="kapitel">${esc(kap.titel)}</h2>`);
    const lasText = oppet ? '' : `Öppnas när ${esc(kortTitel(foregaende.titel))} är avslutat${krav ? ` – eller när du når rangen ${esc(krav.namn)} (${krav.krav - glas} förstoringsglas kvar)` : ''}.`;
    if (!oppet) kort.push(`<p class="kapitel-las">🔒 ${lasText} Ett fall räknas som avslutat när du har löst det eller valt att se lösningen.</p>`);
    for (const post of kap.fall) {
      if (post.kommer) {
        kort.push(`<div class="fallkort kommer"><div class="fallkort-nr">${post.nummer}</div><div class="fallkort-text"><h3>${esc(post.titel)}</h3><p class="meta">Akten är ännu förseglad</p></div><div class="sigill" aria-hidden="true">✶</div></div>`);
        continue;
      }
      const f = laddade.get(post.id);
      if (!f) {
        kort.push(`<div class="fallkort kommer"><div class="fallkort-nr">${post.nummer}</div><div class="fallkort-text"><h3>Akten kunde inte läsas</h3><p class="meta">Kontrollera anslutningen och ladda om sidan.</p></div></div>`);
        continue;
      }
      const st = data.fall[f.id];
      if (!oppet && !paborjat(f.id)) {
        kort.push(`<div class="fallkort last" style="--accent:${f.meta.accentfarg || '#7a2e1f'}" aria-disabled="true">
          <div class="fallkort-bild" data-omslag="${esc(f.meta.omslag)}"></div>
          <div class="fallkort-nr">${f.nummer}</div>
          <div class="fallkort-text"><h3>${esc(f.meta.titel)}</h3><p class="meta">${esc(f.meta.miljo)} · ${esc(f.meta.epok)}</p>
          <div class="fallkort-status"><span class="status">🔒 Låst</span></div></div></div>`);
        continue;
      }
      let status = '<span class="status ny">Ny akt</span>';
      if (st?.basta) status = glasRad(st.basta.glas, 3, 20);
      else if (st?.status === 'misslyckad') status = '<span class="status">Olöst</span>';
      if (st?.status === 'pagaende') status += ' <span class="status pagar">Pågår</span>';
      kort.push(`<a class="fallkort" href="#/fall/${f.id}" style="--accent:${f.meta.accentfarg || '#7a2e1f'}">
        <div class="fallkort-bild" data-omslag="${esc(f.meta.omslag)}"></div>
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
      ${VERKLIG ? '<p class="stil-merke">Förhandsgranskning: verklig grafik · <a href="?stil=vanlig#/">tillbaka till vanlig</a></p>' : ''}
      <p class="version">Version ${VERSION}</p>
    </footer>
  </div>`;
  visaOmslag(app);
  $('#nollstall', app).onclick = async () => { if (await bekrafta('Radera alla sparade fall och poäng?', { ja: 'Radera' })) { nollstallAllt(); visaMeny(app); } };
  return null;
}

/**
 * Visar omslagen först när bilden är helt nedladdad. Annars kan mobilen visa en halvt nedladdad bild
 * (översta raderna och grått under) om nätet hackar, till exempel medan en ny version cachas.
 * En JPEG räknas som hel när den slutar med slutmarkören FF D9. Misslyckas det görs två nya försök.
 * De färdiga bilderna sparas, så att menyn inte laddar om dem varje gång den visas.
 */
const omslagKlara = new Map();
async function hamtaOmslag(url) {
  const svar = await fetch(url);
  if (!svar.ok) throw new Error(`HTTP ${svar.status}`);
  const blob = await svar.blob();
  if (/\.jpe?g$/i.test(url)) {
    const slut = new Uint8Array(await blob.slice(-2).arrayBuffer());
    if (slut[0] !== 0xff || slut[1] !== 0xd9) throw new Error('ofullständig bild');
  }
  return URL.createObjectURL(blob);
}
function visaOmslag(rot) {
  for (const el of rot.querySelectorAll('.fallkort-bild[data-omslag]')) {
    const url = el.dataset.omslag;
    const visa = (src) => { el.style.backgroundImage = `url('${src}')`; el.classList.add('laddad'); };
    if (omslagKlara.has(url)) { visa(omslagKlara.get(url)); continue; }
    const forsok = (n) => hamtaOmslag(url).then((src) => { omslagKlara.set(url, src); visa(src); },
      () => { if (n < 2) setTimeout(() => forsok(n + 1), 1500 * (n + 1)); });
    forsok(0);
  }
}
