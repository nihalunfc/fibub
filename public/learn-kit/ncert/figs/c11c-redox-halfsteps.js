// Class 11 Chemistry, Redox Reactions (step player): the half-reaction (ion-electron) method in basic solution for MnO4- + I- -> MnO2 + I2.
// Split into oxidation and reduction halves, balance atoms, balance charge with electrons, fix O and H with H2O and OH-, make electrons equal, add and cancel.
import { canvas, text, title } from '../../kit.js';

const S = [
  ['1. Write the skeleton and the oxidation numbers', [['MnO₄⁻ + I⁻ → MnO₂ + I₂', 0], ['Mn: +7 → +4 (reduced)', 2], ['I: −1 → 0 (oxidised)', 3]]],
  ['2. Split into two half-reactions', [['Oxidation:  I⁻ → I₂', 3], ['Reduction:  MnO₄⁻ → MnO₂', 2]]],
  ['3. Balance the atoms other than O and H', [['Oxidation:  2I⁻ → I₂', 3], ['Reduction:  MnO₄⁻ → MnO₂', 2]]],
  ['4. Add electrons to balance charge', [['Oxidation:  2I⁻ → I₂ + 2e⁻', 3], ['Reduction:  MnO₄⁻ + 3e⁻ → MnO₂', 2], ['(left −4, right 0: still not balanced)', 4]]],
  ['5. Basic solution: add OH⁻ for charge, H₂O for O and H', [['Reduction:  MnO₄⁻ + 3e⁻ + 2H₂O → MnO₂ + 4OH⁻', 2], ['charge: −4 = −4;  O: 4+2 = 2+4;  H: 4 = 4', 4]]],
  ['6. Equalise the electrons: ×3 and ×2 (6e⁻ each)', [['Oxidation ×3:  6I⁻ → 3I₂ + 6e⁻', 3], ['Reduction ×2:  2MnO₄⁻ + 6e⁻ + 4H₂O → 2MnO₂ + 8OH⁻', 2]]],
  ['7. Add the halves, cancel the electrons', [['2MnO₄⁻ + 6I⁻ + 4H₂O → 2MnO₂ + 3I₂ + 8OH⁻', 5], ['charge: −8 = −8: balanced', 4]]],
];
export default function (host) {
  let st = 0;
  const cv = canvas(host, { aspect: 0.7, max: 440, min: 290, label: 'Balancing MnO4- with I- in basic solution step by step' });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, S[st][0], col) + 18, c = (k) => [col.ink, col.s[3], col.s[0], col.s[3], col.muted, col.s[2]][k] ?? col.ink;
    let y = top + 10;
    S[st][1].forEach(([s, k], i) => { ctx.fillStyle = col.soft; if (k === 5) { ctx.fillRect(10, y - 16, w - 20, 34); ctx.strokeStyle = col.s[2]; ctx.lineWidth = 2; ctx.strokeRect(10, y - 16, w - 20, 34); } text(ctx, s, 16, y, { color: k === 5 || k === 0 ? col.ink : c(k === 3 ? 3 : k === 2 ? 2 : k), size: 12.5, weight: k === 4 ? 400 : 700 }); y += 42; });
    text(ctx, `step ${st + 1} of ${S.length}`, w - 12, h - 12, { color: col.muted, size: 10.5, align: 'right' });
  };
  return { step(i) { st = Math.min(i, S.length - 1); cv.redraw(); } };
}
