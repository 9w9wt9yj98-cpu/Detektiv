// Grafikstil. 'verklig' är spelets standard sedan november 2026: 3D-modeller, fotograferade ytor, fysiskt baserat
// material och ljus (glansiga metaller, relief, reflektioner från omgivningen). 'vanlig' är den enkla, äldre stilen
// (sepia, gravyr och akvarell), som ritar snabbare och finns kvar för svagare telefoner.
// Byts med ?stil=vanlig och ?stil=verklig (eller länken längst ned i menyn); valet sparas i webbläsaren.
const NYCKEL = 'detektiv:stil';
function las() {
  try {
    const m = /[?&]stil=(verklig|vanlig)/.exec(location.search);
    if (m) localStorage.setItem(NYCKEL, m[1]);
    return localStorage.getItem(NYCKEL) === 'vanlig' ? 'vanlig' : 'verklig';
  } catch { return 'verklig'; }
}
// Utan webbläsare (verktyg och tester i Node) laddas inga modeller.
export const STIL = typeof location === 'undefined' ? 'vanlig' : las();
export const VERKLIG = STIL === 'verklig';
