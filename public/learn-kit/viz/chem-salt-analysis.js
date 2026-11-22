// Salt analysis game: a mystery sodium salt is hidden in the tube. Run the standard tests one at a time (dilute acid,
// concentrated H₂SO₄, BaCl₂, AgNO₃, brown-ring) and watch what happens in the test tube; the notebook records every result. When
// you are ready, name the anion. Observations are the standard textbook ones; "New unknown" picks another anion.
import { canvas, text, row, choice, button, readout, title, loop } from '../kit.js';

const W = 'rgb(246,246,246)', Y = 'rgb(240,215,80)', PY = 'rgb(245,236,170)', K = 'rgb(35,35,35)', BR = 'rgb(160,95,40)', V = 'rgb(150,70,200)', GR = 'rgb(90,170,90)';
const T = ['dil', 'conc', 'ba', 'ag', 'ring'];
const TN = { dil: 'Dilute H₂SO₄', conc: 'Conc. H₂SO₄ (warm)', ba: 'BaCl₂ solution', ag: 'AgNO₃ solution', ring: 'FeSO₄ + conc. H₂SO₄ (ring)' };
const none = { t: 'No visible change.' };
const AN = {
  'CO₃²⁻': { dil: { t: 'Brisk effervescence: colourless, odourless gas that turns lime water milky (CO₂).', gas: 'clear' }, conc: { t: 'Brisk effervescence, same colourless gas (CO₂).', gas: 'clear' }, ba: { t: 'White precipitate (BaCO₃) that dissolves in dilute HCl with effervescence.', ppt: W }, ag: { t: 'White precipitate (Ag₂CO₃) that dissolves in dilute HNO₃.', ppt: W }, ring: none },
  'SO₃²⁻': { dil: { t: 'Colourless gas with the smell of burning sulphur (SO₂); it turns acidified K₂Cr₂O₇ paper green.', gas: 'clear' }, conc: { t: 'SO₂ again, pungent and colourless.', gas: 'clear' }, ba: { t: 'White precipitate (BaSO₃) that dissolves in dilute HCl.', ppt: W }, ag: { t: 'White precipitate (Ag₂SO₃) that turns black on boiling.', ppt: W }, ring: none },
  'S²⁻': { dil: { t: 'Colourless gas with a rotten-egg smell (H₂S); lead acetate paper turns black.', gas: 'clear' }, conc: { t: 'H₂S, and a yellow-white deposit of sulphur.', gas: 'clear' }, ba: none, ag: { t: 'Black precipitate (Ag₂S).', ppt: K }, ring: none },
  'NO₂⁻': { dil: { t: 'Reddish-brown fumes of NO₂ in the tube.', gas: BR }, conc: { t: 'Brown fumes of NO₂.', gas: BR }, ba: none, ag: { t: 'White crystalline precipitate (AgNO₂), soluble in hot water.', ppt: W }, ring: none },
  'CH₃COO⁻': { dil: { t: 'Faint smell of vinegar (acetic acid) on warming.', gas: 'clear' }, conc: { t: 'Strong vinegar smell (CH₃COOH vapour); no coloured fumes.', gas: 'clear' }, ba: none, ag: { t: 'White crystalline precipitate (silver acetate) from a concentrated solution.', ppt: W }, ring: none },
  'Cl⁻': { dil: none, conc: { t: 'Colourless pungent gas (HCl) that gives dense white fumes with a rod dipped in NH₃.', gas: 'clear' }, ba: none, ag: { t: 'White curdy precipitate (AgCl), soluble in dilute NH₃.', ppt: W }, ring: none },
  'Br⁻': { dil: none, conc: { t: 'Reddish-brown vapours of Br₂.', gas: BR }, ba: none, ag: { t: 'Pale yellow precipitate (AgBr), sparingly soluble in NH₃.', ppt: PY }, ring: none },
  'I⁻': { dil: none, conc: { t: 'Violet vapours of I₂ (they turn starch paper blue).', gas: V }, ba: none, ag: { t: 'Yellow precipitate (AgI), insoluble in NH₃.', ppt: Y }, ring: none },
  'NO₃⁻': { dil: none, conc: { t: 'With copper turnings added: brown fumes of NO₂ and a blue solution.', gas: BR }, ba: none, ag: none, ring: { t: 'A brown ring forms where the acid layer meets the FeSO₄ solution ([Fe(H₂O)₅NO]²⁺).', ring: BR } },
  'SO₄²⁻': { dil: none, conc: none, ba: { t: 'White precipitate (BaSO₄) that does not dissolve in dilute HCl.', ppt: W }, ag: none, ring: none },
};
const NAMES = Object.keys(AN);
export default function (host) {
  let ans = NAMES[Math.floor(Math.random() * NAMES.length)], done = {}, last = null, verdict = '', score = 0, tries = 0;
  const cv = canvas(host, { aspect: 0.6, max: 300, min: 220, label: 'A test tube showing the result of the latest salt-analysis test' });
  const c1 = row(host); T.forEach((k) => button(c1, TN[k], () => run(k)));
  const c2 = row(host); choice(c2, 'The anion is…', NAMES.map((n) => [n, n]), null, (g) => guess(g));
  const c3 = row(host); button(c3, 'New unknown', () => { ans = NAMES[Math.floor(Math.random() * NAMES.length)]; done = {}; last = null; verdict = ''; set(); });
  const out = readout(host);
  function run(k) { done[k] = AN[ans][k]; last = k; verdict = ''; set(); }
  function guess(g) { tries++; if (g === ans) { score++; verdict = `Correct: it is ${ans}. Score ${score} of ${tries} guesses.`; } else verdict = `Not ${g}. Check the notebook against the tests that are still left to run. Score ${score} of ${tries}.`; set(); }
  function set() {
    const rows = T.filter((k) => done[k]).map((k) => `<b>${TN[k]}:</b> ${done[k].t}`).join('<br>');
    out.innerHTML = `${rows || 'Notebook empty. Start with dilute H₂SO₄: it tells apart carbonate, sulphite, sulphide, nitrite and acetate (the "dilute acid group").'}<br>${verdict ? `<b>${verdict}</b>` : `Tests run: ${Object.keys(done).length} of 5. Tip: dilute acid group first, then conc. H₂SO₄ group (Cl⁻, Br⁻, I⁻, NO₃⁻), then BaCl₂ for sulphate.`}`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, last ? TN[last] : 'Test tube (choose a test)', col);
    const r = last ? done[last] : null, cx = w / 2, tw = 54, top = 46, bot = h - 18;
    ctx.strokeStyle = col.ink; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(cx - tw / 2, top); ctx.lineTo(cx - tw / 2, bot - tw / 2); ctx.arc(cx, bot - tw / 2, tw / 2, Math.PI, 0, true); ctx.lineTo(cx + tw / 2, top); ctx.stroke();
    ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.18; ctx.fillRect(cx - tw / 2 + 1, top + 50, tw - 2, bot - top - 50 - tw / 2); ctx.beginPath(); ctx.arc(cx, bot - tw / 2, tw / 2 - 1, 0, Math.PI); ctx.fill(); ctx.globalAlpha = 1;
    if (r && r.ppt) { ctx.fillStyle = r.ppt; ctx.globalAlpha = 0.95; ctx.beginPath(); ctx.arc(cx, bot - tw / 2, tw / 2 - 3, 0, Math.PI); ctx.fillRect(cx - tw / 2 + 4, bot - tw / 2 - 26, tw - 8, 26); ctx.fill(); ctx.strokeStyle = col.muted; ctx.lineWidth = 1; ctx.stroke(); ctx.globalAlpha = 1; }
    if (r && r.ring) { ctx.fillStyle = r.ring; ctx.fillRect(cx - tw / 2 + 2, top + 78, tw - 4, 7); }
    if (r && r.gas) { const t = performance.now() / 600; for (let k = 0; k < 14; k++) { const px = cx + Math.sin(t + k * 1.7) * 18, py = top + 44 - ((t * 20 + k * 9) % 70); ctx.beginPath(); ctx.arc(px, py, 3 + (k % 3), 0, 7); if (r.gas === 'clear') { ctx.strokeStyle = col.muted; ctx.lineWidth = 1.2; ctx.stroke(); } else { ctx.fillStyle = r.gas; ctx.globalAlpha = 0.55; ctx.fill(); ctx.globalAlpha = 1; } } }
    if (!r) text(ctx, 'Pick a reagent above', cx + 50, h / 2, { color: col.muted, size: 11 });
  };
  set();
  loop(host, () => { if (last && done[last] && done[last].gas) cv.redraw(); });
}
