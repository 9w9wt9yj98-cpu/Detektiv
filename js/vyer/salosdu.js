// ”Så löser du ett fall”: vad spelet går ut på, i fyra steg. Visas på fallets första sida och från hjälpen i lampan.
import { esc, modal, lampa } from './gemensamt.js';

export const STEG = [
  ['🔍', 'Undersök', 'Gå runt och tryck på allt som har ett ! ovanför. Det du hittar skrivs in i anteckningsboken.'],
  ['📖', 'Läs fynden', 'Vad stämmer inte? Jämför tider, vem som kan gå var och vem som har nyckel.'],
  ['🧩', 'Tänk i boken', 'Lös pusslet i anteckningsboken – förhör, dokument, tidslinje … – och svara på frågorna under Slutsatser. De leder dig steg för steg.'],
  ['⚖️', 'Anklaga', 'Välj den skyldige och de fynd som bevisar det. Rätt lösning förklarar också varför ingen annan kan ha gjort det.'],
];

/** Stegen som lista (används både på fallets första sida och i hjälpkortet). */
export function saLoserDuLista() {
  return `<ol class="sa-loser-du-lista">${STEG.map(([ikon, rubrik, text]) => `<li><span class="sld-ikon" aria-hidden="true">${ikon}</span><div><strong>${esc(rubrik)}</strong><span>${esc(text)}</span></div></li>`).join('')}</ol>
    <p class="sld-fastnat">${lampa()} <span><strong>Fastnat?</strong> Lampan ger alltid ett gratis tips om nästa steg först. Ledtrådarna efter det kostar poäng.</span></p>`;
}

/** Hjälpkortet, ovanpå allt annat. */
export function visaSaLoserDu({ onStang } = {}) {
  return modal(`<h3>Så löser du ett fall</h3>${saLoserDuLista()}
    <div class="knapprad"><button class="knapp massing" data-stang>Jag förstår</button></div>`, { klass: 'over-bok sa-loser-du', onStang });
}
