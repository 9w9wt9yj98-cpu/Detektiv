// ”Så löser du ett fall”: vad spelet går ut på, i fyra steg. Visas på fallets första sida och från hjälpen i lampan.
import { esc, modal, lampa } from './gemensamt.js';

export const STEG = [
  ['🔍', 'Undersök', 'Gå runt och tryck på allt som har ett ! ovanför – föremål, papper och personer. Det viktiga skrivs in i anteckningsboken, och räknaren Fynd visar hur mycket som är kvar.'],
  ['📖', 'Läs fynden', 'Leta efter det som inte går ihop: tider, vem som kunde vara var, vem som kunde komma åt vad – och vem som säger emot sig själv eller någon annan.'],
  ['🧩', 'Koppla ihop i boken', 'Lös fallets pussel i anteckningsboken om det har ett (förhör, bilder, tidslinje …) och svara på frågorna under Slutsatser. De tar dig steg för steg.'],
  ['⚖️', 'Anklaga', 'Välj den skyldige – och gärna upp till tre fynd som bevis: rätt bevis ger ett extra förstoringsglas. Kan du utesluta alla andra? Då är du säker. Du har två försök.'],
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
