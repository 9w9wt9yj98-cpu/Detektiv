// Sparar progression, poäng och pågående utredningar i localStorage.
const NYCKEL = 'detektiv:v1';
let data = null;

function tomt() { return { fall: {}, installningar: { autofyll: true, visatStyrhjalp: false, handledningKlar: false } }; }

export function las() {
  if (data) return data;
  try { data = JSON.parse(localStorage.getItem(NYCKEL)) || tomt(); } catch { data = tomt(); }
  data.fall ||= {}; data.installningar ||= tomt().installningar;
  return data;
}
export function spara() { try { localStorage.setItem(NYCKEL, JSON.stringify(las())); } catch (e) { console.warn('Kunde inte spara', e); } }

export function nyUtredning() {
  return { status: 'ny', fynd: [], material: [], slutsatser: {}, mek: {}, inspekterade: [], ledtradar: 0, fel: [], rutnat: {}, anteckningar: '', tid: 0, rum: null, position: null, resultat: null };
}
export function fallData(id) {
  const d = las();
  d.fall[id] ||= { ...nyUtredning(), basta: null };
  const f = d.fall[id];
  f.material ||= []; f.slutsatser ||= {}; f.mek ||= {}; f.fynd ||= []; f.inspekterade ||= []; f.fel ||= [];
  return f;
}
export function borjaOm(id) {
  const gammal = fallData(id);
  las().fall[id] = { ...nyUtredning(), basta: gammal.basta };
  spara();
  return las().fall[id];
}
export function installningar() { return las().installningar; }
export function nollstallAllt() { data = tomt(); spara(); }
