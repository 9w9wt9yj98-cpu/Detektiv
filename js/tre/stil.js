// Grafikstil. 'vanlig' är spelets beslutade stil (sepia, gravyr och akvarell). 'verklig' är en förhandsgranskning
// av mer realistiskt material och ljus (glansiga metaller, relief, reflektioner från omgivningen).
// Slås på med ?stil=verklig och av med ?stil=vanlig; valet sparas i webbläsaren.
const NYCKEL = 'detektiv:stil';
function las() {
  try {
    const m = /[?&]stil=(verklig|vanlig)/.exec(location.search);
    if (m) localStorage.setItem(NYCKEL, m[1]);
    return localStorage.getItem(NYCKEL) === 'verklig' ? 'verklig' : 'vanlig';
  } catch { return 'vanlig'; }
}
export const STIL = typeof location === 'undefined' ? 'vanlig' : las();
export const VERKLIG = STIL === 'verklig';
