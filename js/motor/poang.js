// Poäng och förstoringsglas enligt designförslaget (avsnitt 1.2 och 5.4).
export const FEL_KOSTNAD = 30;
export const MAX_FEL = 2;
export const RANGER = [
  { namn: 'Aspirant', krav: 0 }, { namn: 'Konstapel', krav: 5 }, { namn: 'Kriminalassistent', krav: 12 },
  { namn: 'Kommissarie', krav: 22 }, { namn: 'Mästerdetektiv', krav: 35 },
];

export function ledtradKostnad(fall, antal) {
  return fall.ledtradar.slice(0, antal).reduce((s, l, i) => s + (l.kostnad ?? [10, 25, 50][i]), 0);
}
export function aktuellPoang(fall, st) {
  return Math.max(0, 100 - ledtradKostnad(fall, st.ledtradar) - FEL_KOSTNAD * st.fel.length);
}
export function bevisRatt(fall, bevis) {
  if (!bevis?.length) return false;
  const typ = Object.fromEntries(fall.fynd.map((f) => [f.id, f.typ]));
  if (bevis.some((b) => typ[b] === 'avledande')) return false;
  return fall.losning.bevisgrupper.some((g) => g.every((id) => bevis.includes(id)));
}
/** Slutresultat. `losta` = rätt person utpekad. */
export function resultat(fall, st, { losta, hur, bevis }) {
  const poang = aktuellPoang(fall, st);
  const bRatt = bevisRatt(fall, bevis);
  const hRatt = hur ? hur === fall.losning.hur : null;
  let glas = 0;
  if (losta) {
    glas = poang >= 75 ? 2 : 1;
    if (bRatt && hRatt !== false) glas += 1;
    glas = Math.min(3, glas);
  }
  return { losta, poang: losta ? poang : 0, glas, bevisRatt: bRatt, hurRatt: hRatt, bevis: bevis || [], hur: hur || null, ledtradar: st.ledtradar, fel: st.fel.slice(), tid: st.tid };
}
export function totalGlas(data) {
  return Object.values(data.fall).reduce((s, f) => s + (f.basta?.glas || 0), 0);
}
export function rang(glas) {
  let r = RANGER[0];
  for (const x of RANGER) if (glas >= x.krav) r = x;
  const nasta = RANGER.find((x) => x.krav > glas);
  return { ...r, nasta };
}
export function formatTid(ms) {
  const s = Math.round(ms / 1000);
  return `${Math.floor(s / 60)} min ${String(s % 60).padStart(2, '0')} s`;
}
