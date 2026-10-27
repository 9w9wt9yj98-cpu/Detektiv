// Gemensamma hjälpfunktioner för vyerna.
export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export const stycken = (text) => String(text || '').split(/\n\s*\n/).map((p) => `<p>${esc(p)}</p>`).join('');

export function html(str) {
  const t = document.createElement('template');
  t.innerHTML = str.trim();
  return t.content.firstElementChild;
}
export const $ = (sel, rot = document) => rot.querySelector(sel);
export const $$ = (sel, rot = document) => [...rot.querySelectorAll(sel)];

export function lupp(fylld = true, storlek = 26) {
  return `<svg class="lupp ${fylld ? 'fylld' : 'tom'}" width="${storlek}" height="${storlek}" viewBox="0 0 32 32" aria-hidden="true">
    <circle cx="13" cy="13" r="9" fill="${fylld ? 'rgba(230,194,122,.35)' : 'none'}" stroke="currentColor" stroke-width="3"/>
    <path d="M20 20 L29 29" stroke="currentColor" stroke-width="4.5" stroke-linecap="round"/></svg>`;
}
export function glasRad(antal, max = 3, storlek = 26) {
  return `<span class="glasrad" aria-label="${antal} av ${max} förstoringsglas">${Array.from({ length: max }, (_, i) => lupp(i < antal, storlek)).join('')}</span>`;
}
export function lampa() {
  return `<svg width="24" height="24" viewBox="0 0 32 32" aria-hidden="true"><path d="M16 3c-5 0-8 3.6-8 8 0 3.4 2.2 5.2 3.4 7.2.8 1.3.9 2.6.9 3.8h7.4c0-1.2.1-2.5.9-3.8C21.8 16.2 24 14.4 24 11c0-4.4-3-8-8-8z" fill="rgba(255,214,130,.35)" stroke="currentColor" stroke-width="2"/><path d="M12.5 25h7M13.5 28.5h5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`;
}
export function bokIkon() {
  return `<svg width="24" height="24" viewBox="0 0 32 32" aria-hidden="true"><path d="M5 6.5C9 5 13 5.5 16 8c3-2.5 7-3 11-1.5V26c-4-1.5-8-1-11 1.5C13 25 9 24.5 5 26z" fill="rgba(230,194,122,.25)" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M16 8v19" stroke="currentColor" stroke-width="2"/></svg>`;
}
export function hemIkon() {
  return `<svg width="24" height="24" viewBox="0 0 32 32" aria-hidden="true"><path d="M4 15 16 5l12 10M8 13v13h6v-7h4v7h6V13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/></svg>`;
}

export function medaljong(p) {
  const init = p.namn.split(/\s+/).map((d) => d[0]).slice(0, 2).join('');
  return `<span class="medaljong" aria-hidden="true">${esc(init)}</span>`;
}

let toastTimer;
export function toast(text) {
  let el = document.getElementById('toast');
  if (!el) { el = html('<div id="toast" role="status"></div>'); document.body.appendChild(el); }
  el.textContent = text; el.classList.add('synlig');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('synlig'), 2600);
}

/** Visar ett modalt kort i #lager. Returnerar { el, stang }. */
export function modal(inner, { klass = '', onStang } = {}) {
  const lager = document.getElementById('lager');
  const el = html(`<div class="modal-bakgrund ${klass}"><div class="modal" role="dialog" aria-modal="true">${inner}</div></div>`);
  lager.appendChild(el);
  requestAnimationFrame(() => el.classList.add('oppen'));
  const stang = () => { el.classList.remove('oppen'); setTimeout(() => el.remove(), 180); onStang?.(); };
  const skapad = performance.now();
  // Ignorera "spökklick" från trycket som öppnade kortet
  el.addEventListener('click', (e) => { if (e.target === el && performance.now() - skapad > 450) stang(); });
  $$('[data-stang]', el).forEach((b) => b.addEventListener('click', stang));
  return { el, stang };
}
export function stangAllaModaler() { document.getElementById('lager').innerHTML = ''; }

export function bekrafta(fraga, { ja = 'Ja', nej = 'Avbryt' } = {}) {
  return new Promise((res) => {
    const m = modal(`<p class="modal-text">${esc(fraga)}</p><div class="knapprad"><button class="knapp sekundar" data-nej>${esc(nej)}</button><button class="knapp massing" data-ja>${esc(ja)}</button></div>`, { onStang: () => res(false) });
    $('[data-nej]', m.el).onclick = () => m.stang();
    $('[data-ja]', m.el).onclick = () => { res(true); m.el.remove(); };
  });
}
