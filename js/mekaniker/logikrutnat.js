// Interaktivt logikrutnät (deduktionstavla) med bordsvy. Tryck växlar tom → ✗ → ✓.
import { brutnaLedtradar, sammaTilldelning } from '../motor/losare.js';
import { esc, html, $, $$ } from '../vyer/gemensamt.js';

const SYMBOL = ['', '✗', '✓'];

export function renderaRutnat(behallare, payload, st, { autofyll = true, onAndrat, onLost, onAutofyll } = {}) {
  const kat = payload.kategorier;
  const k = kat.length;
  const kol = kat.slice(1);
  const rader = [kat[0], ...kat.slice(2).reverse()];
  const finnsBlock = (r, c) => r + c <= k - 2;
  const katAv = {};
  kat.forEach((c) => c.varden.forEach((v) => { katAv[v.id] = c.id; }));
  st.rutnat ||= {};
  st.rutnatLedtradar ||= [];
  const historik = [];

  const nyckel = (a, b) => `${a}|${b}`;
  const varde = (a, b) => st.rutnat[nyckel(a, b)] || st.rutnat[nyckel(b, a)] || 0;
  const sattVarde = (a, b, v) => {
    const kk = st.rutnat[nyckel(b, a)] !== undefined ? nyckel(b, a) : nyckel(a, b);
    if (v) st.rutnat[kk] = v; else delete st.rutnat[kk];
  };

  // --- Bygg HTML ---
  let thead = '<tr><th class="hörn"></th>' + kol.map((c) => `<th class="kat" colspan="${c.varden.length}">${esc(c.namn)}</th>`).join('') + '</tr>';
  thead += '<tr><th class="hörn"></th>' + kol.map((c) => c.varden.map((v, i) => `<th class="kolnamn${i === 0 ? ' blockstart' : ''}" title="${esc(v.namn)}"><span>${esc(v.kort || v.namn)}</span></th>`).join('')).join('') + '</tr>';
  let tbody = '';
  rader.forEach((rk, r) => {
    rk.varden.forEach((rv, ri) => {
      tbody += `<tr class="${ri === 0 ? 'katstart' : ''}"><th class="radnamn" scope="row">${ri === 0 ? `<small>${esc(rk.namn)}</small>` : ''}${esc(rv.namn)}</th>`;
      kol.forEach((ck, c) => {
        if (!finnsBlock(r, c)) { tbody += `<td class="tom" colspan="${ck.varden.length}"></td>`; return; }
        ck.varden.forEach((cv, ci) => {
          tbody += `<td class="cell${ci === 0 ? ' blockstart' : ''}" data-a="${rv.id}" data-b="${cv.id}" data-r="${rk.id}" data-c="${ck.id}" role="button" tabindex="0" aria-label="${esc(rv.namn)} – ${esc(cv.namn)}"></td>`;
        });
      });
      tbody += '</tr>';
    });
  });

  const bord = payload.bord;
  const el = html(`<div class="rutnat-vy">
    <div class="bordsvy" aria-label="Bordsplaceringen så som du har markerat den">${bordSvg()}</div>
    <p class="instruktion">${esc(payload.instruktion || '')}</p>
    <div class="rutnat-skal"><table class="rutnat"><thead>${thead}</thead><tbody>${tbody}</tbody></table></div>
    <div class="rutnat-verktyg">
      <button class="knapp liten sekundar" data-angra>↶ Ångra</button>
      <label class="vaxel"><input type="checkbox" data-autofyll ${autofyll ? 'checked' : ''}> Fyll i ✗ automatiskt</label>
      <button class="knapp liten sekundar" data-rensa>Rensa</button>
    </div>
    <p class="rutnat-status" role="status"></p>
    <h3 class="ledtrad-rubrik">Ur förhören</h3>
    <ul class="ledtradskort">${payload.ledtradar.map((l) => `<li data-l="${l.id}"><span class="lid">${esc(l.id)}</span> ${esc(l.text)}</li>`).join('')}</ul>
    <p class="hjalptext">Tryck på en uppgift för att bocka av den när du har använt den.</p>
  </div>`);
  behallare.innerHTML = '';
  behallare.appendChild(el);

  function bordSvg() {
    const pos = [[78, 52, 'end'], [78, 118, 'end'], [222, 118, 'start'], [222, 52, 'start']];
    const platser = bord.ordning.map((pid, i) => {
      const [x, y, anchor] = pos[i];
      const dx = anchor === 'end' ? -16 : 16;
      return `<g class="plats" data-plats="${pid}">
        <circle cx="${x + (anchor === 'end' ? 22 : -22)}" cy="${y}" r="11" class="stolsdyna"/>
        <text x="${x + (anchor === 'end' ? 22 : -22)}" y="${y + 4}" class="platsnr" text-anchor="middle">${i + 1}</text>
        <text x="${x + dx + (anchor === 'end' ? 22 : -22)}" y="${y - 3}" text-anchor="${anchor}" class="platsnamn" data-namn></text>
        <text x="${x + dx + (anchor === 'end' ? 22 : -22)}" y="${y + 12}" text-anchor="${anchor}" class="platsinfo" data-info></text>
      </g>`;
    }).join('');
    return `<svg viewBox="-34 0 368 168" role="img">
      <rect x="118" y="30" width="64" height="124" rx="26" class="bordsskiva"/>
      <circle cx="150" cy="14" r="11" class="stolsdyna overste"/>
      <text x="150" y="18" text-anchor="middle" class="platsnr">Ö</text>
      <text x="168" y="12" class="platsinfo">${esc(bord.huvud)}</text>
      <circle cx="166" cy="40" r="4" class="giftglas"/>
      <text x="150" y="62" text-anchor="middle" class="platsinfo liten">glaset</text>
      ${platser}
    </svg>`;
  }

  function uppdateraBord() {
    const platsKat = katAv[bord.ordning[0]];
    const personer = kat[0].varden;
    for (const pid of bord.ordning) {
      const g = $(`[data-plats="${pid}"]`, el);
      const pers = personer.find((p) => varde(p.id, pid) === 2);
      const info = [];
      for (const c of kat.slice(1)) {
        if (c.id === platsKat) continue;
        let v = c.varden.find((x) => varde(x.id, pid) === 2);
        if (!v && pers) v = c.varden.find((x) => varde(pers.id, x.id) === 2);
        if (v) info.push(v.namn.toLowerCase());
      }
      $('[data-namn]', g).textContent = pers ? pers.namn : '?';
      $('[data-info]', g).textContent = info.join(', ');
      g.classList.toggle('satt', !!pers);
    }
  }

  function uppdatera() {
    const celler = $$('.cell', el);
    for (const c of celler) {
      const v = varde(c.dataset.a, c.dataset.b);
      c.textContent = SYMBOL[v];
      c.classList.toggle('kryss', v === 1); c.classList.toggle('bock', v === 2);
      c.classList.remove('konflikt');
    }
    // Konflikter: två ✓ i samma rad/kolumn inom ett block, eller en rad helt full av ✗
    const block = {};
    for (const c of celler) (block[c.dataset.r + '|' + c.dataset.c] ||= []).push(c);
    for (const lista of Object.values(block)) {
      const grupper = {};
      for (const c of lista) { (grupper['a' + c.dataset.a] ||= []).push(c); (grupper['b' + c.dataset.b] ||= []).push(c); }
      for (const g of Object.values(grupper)) {
        const bockar = g.filter((c) => varde(c.dataset.a, c.dataset.b) === 2);
        const kryss = g.filter((c) => varde(c.dataset.a, c.dataset.b) === 1);
        if (bockar.length > 1) bockar.forEach((c) => c.classList.add('konflikt'));
        if (kryss.length === g.length) g.forEach((c) => c.classList.add('konflikt'));
      }
    }
    $$('.ledtradskort li', el).forEach((li) => li.classList.toggle('avbockad', st.rutnatLedtradar.includes(li.dataset.l)));
    uppdateraBord();
    kontrollera();
  }

  function kontrollera() {
    const status = $('.rutnat-status', el);
    status.className = 'rutnat-status';
    const t = {};
    let komplett = true;
    for (const p of kat[0].varden) {
      t[p.id] = {};
      for (const c of kat.slice(1)) {
        const v = c.varden.filter((x) => varde(p.id, x.id) === 2);
        if (v.length !== 1) { komplett = false; continue; }
        t[p.id][c.id] = v[0].id;
      }
    }
    if (st.rutnatLost) { status.textContent = '✓ Bordsplaceringen är rekonstruerad och stämmer med alla uppgifter.'; status.classList.add('lost'); return; }
    if (!komplett) { status.textContent = ''; return; }
    for (const c of kat.slice(1)) {
      const anv = new Set(Object.values(t).map((r) => r[c.id]));
      if (anv.size !== c.varden.length) { status.textContent = `Två personer kan inte dela samma ${c.namn.toLowerCase()}. Något stämmer inte.`; status.classList.add('fel'); return; }
    }
    if (sammaTilldelning(t, payload.losning)) {
      st.rutnatLost = true;
      status.textContent = '✓ Bordsplaceringen är rekonstruerad och stämmer med alla uppgifter.';
      status.classList.add('lost');
      onLost?.();
      return;
    }
    const brutna = brutnaLedtradar(payload, t);
    status.textContent = brutna.length
      ? `Placeringen går inte ihop – den strider mot ${brutna.join(', ')}.`
      : 'Placeringen går inte ihop med förhören.';
    status.classList.add('fel');
  }

  function tryck(cell) {
    const a = cell.dataset.a, b = cell.dataset.b;
    historik.push(JSON.stringify(st.rutnat)); if (historik.length > 80) historik.shift();
    const nytt = (varde(a, b) + 1) % 3;
    sattVarde(a, b, nytt);
    if (nytt === 2 && $('[data-autofyll]', el).checked) {
      for (const c of $$(`.cell[data-r="${cell.dataset.r}"][data-c="${cell.dataset.c}"]`, el)) {
        if (c === cell) continue;
        if ((c.dataset.a === a || c.dataset.b === b) && !varde(c.dataset.a, c.dataset.b)) sattVarde(c.dataset.a, c.dataset.b, 1);
      }
    }
    if (st.rutnatLost && !sammaLost()) st.rutnatLost = false;
    uppdatera();
    onAndrat?.();
  }
  function sammaLost() {
    return kat[0].varden.every((p) => kat.slice(1).every((c) => varde(p.id, payload.losning[p.id][c.id]) === 2));
  }

  el.addEventListener('click', (e) => {
    const cell = e.target.closest('.cell');
    if (cell) return tryck(cell);
    const li = e.target.closest('.ledtradskort li');
    if (li) {
      const i = st.rutnatLedtradar.indexOf(li.dataset.l);
      if (i >= 0) st.rutnatLedtradar.splice(i, 1); else st.rutnatLedtradar.push(li.dataset.l);
      uppdatera(); onAndrat?.();
    }
  });
  el.addEventListener('keydown', (e) => { if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('cell')) { e.preventDefault(); tryck(e.target); } });
  $('[data-angra]', el).onclick = () => { if (!historik.length) return; st.rutnat = JSON.parse(historik.pop()); if (!sammaLost()) st.rutnatLost = false; uppdatera(); onAndrat?.(); };
  $('[data-rensa]', el).onclick = () => { historik.push(JSON.stringify(st.rutnat)); st.rutnat = {}; st.rutnatLost = false; uppdatera(); onAndrat?.(); };
  $('[data-autofyll]', el).onchange = (e) => onAutofyll?.(e.target.checked);
  uppdatera();
  return el;
}
