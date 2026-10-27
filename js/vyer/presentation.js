import { laddaFall, fallTitel } from '../motor/fall.js';
import { fallData, borjaOm, spara } from '../motor/lagring.js';
import { esc, stycken, medaljong, glasRad, bekrafta, $ } from './gemensamt.js';

export async function visaPresentation(app, id) {
  const f = await laddaFall(id);
  const st = fallData(id);
  const pagar = st.status === 'pagaende';
  const klar = st.status === 'lost' || st.status === 'misslyckad';
  app.innerHTML = `<div class="sida presentation" style="--accent:${f.meta.accentfarg}">
    <a class="tillbaka" href="#/">‹ Fallmenyn</a>
    <div class="omslag" style="background-image:url('${esc(f.intro.bild || f.meta.omslag)}')"><div class="omslag-titel"><span>Fall ${f.nummer}</span><h1>${esc(f.meta.titel)}</h1></div></div>
    <article class="papperskort">
      <p class="rubrik-liten">${esc(f.intro.rubrik || '')}</p>
      ${stycken(f.intro.text)}
      <div class="uppdrag"><span>Uppdrag</span>${esc(f.intro.uppdrag)}</div>
      <h2>Personer</h2>
      <ul class="personer">${f.personer.map((p) => `<li>${medaljong(p)}<div><strong>${esc(p.namn)}</strong> <em>${esc(p.roll)}</em><br><span>${esc(p.beskrivning || '')}</span></div></li>`).join('')}</ul>
      ${st.basta ? `<p class="basta">Ditt bästa resultat: ${glasRad(st.basta.glas, 3, 20)} (${st.basta.poang} poäng)</p>` : ''}
      <div class="knappkolumn">
        ${klar ? `<a class="knapp sekundar" href="#/fall/${id}/upplosning">Läs upplösningen igen</a>` : ''}
        <button class="knapp massing stor" id="start">${pagar ? 'Fortsätt utredningen' : klar ? 'Spela fallet igen' : 'Börja utredningen'}</button>
        ${pagar ? '<button class="lank" id="omstart">Börja om från början</button>' : ''}
      </div>
    </article>
  </div>`;
  $('#start', app).onclick = () => {
    if (klar) borjaOm(id);
    const s = fallData(id); s.status = 'pagaende'; spara();
    location.hash = `#/fall/${id}/utred`;
  };
  const om = $('#omstart', app);
  if (om) om.onclick = async () => { if (await bekrafta('Börja om? Dina fynd och anteckningar i det här fallet raderas.', { ja: 'Börja om' })) { borjaOm(id); fallData(id).status = 'pagaende'; spara(); location.hash = `#/fall/${id}/utred`; } };
  document.title = fallTitel(f) + ' · Detektiv';
  return null;
}
