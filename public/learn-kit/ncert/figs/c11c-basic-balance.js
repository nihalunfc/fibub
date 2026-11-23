// Class 11 Chemistry, Some Basic Concepts (step player): balancing Fe + O2 -> Fe2O3 with an atom ledger.
// Rule: the same number of each kind of atom on both sides. Change only the big numbers (coefficients), never the small ones.
import { canvas, text, title } from '../../kit.js';

const ST = [{ c: [1, 1, 1], t: 'Unbalanced: Fe + O₂ → Fe₂O₃' }, { c: [2, 1, 1], t: 'Fe: 2 needed on the right, so 2 Fe on the left' }, { c: [2, 3, 2], t: 'O: 3 on the right is odd, 2 on the left is even. Double Fe₂O₃ and use 3 O₂' }, { c: [4, 3, 2], t: 'Fe: now 4 on the right, so 4 Fe' }];
export default function (host) {
  let st = 0;
  const cv = canvas(host, { aspect: 0.7, max: 440, min: 300, label: 'Counting atoms on both sides while balancing an iron and oxygen reaction' });
  const names = ['Fe', 'O₂', 'Fe₂O₃'];
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, 'balancing: count, then fix one element', col) + 14, c = ST[st].c, [a, b, d] = c;
    const feL = a, oL = 2 * b, feR = 2 * d, oR = 3 * d, ok = feL === feR && oL === oR;
    const eq = `${a > 1 ? a : ''}Fe + ${b > 1 ? b : ''}O₂ → ${d > 1 ? d : ''}Fe₂O₃`;
    text(ctx, eq, w / 2, t0 + 16, { color: col.ink, size: Math.min(24, w / 14), weight: 700, align: 'center' });
    const y = t0 + 60, cw = (w - 20) / 3;
    ['atom', 'left', 'right'].forEach((t, i) => text(ctx, t, 10 + i * cw + cw / 2, y, { color: col.muted, size: 11, weight: 700, align: 'center' }));
    [['Fe', feL, feR], ['O', oL, oR]].forEach(([n, l, r], i) => { const yy = y + 34 + i * 44, good = l === r; text(ctx, n, 10 + cw / 2, yy, { color: col.s[i], size: 17, weight: 700, align: 'center' }); text(ctx, String(l), 10 + 1.5 * cw, yy, { color: col.ink, size: 17, weight: 700, align: 'center' }); text(ctx, String(r), 10 + 2.5 * cw, yy, { color: col.ink, size: 17, weight: 700, align: 'center' }); text(ctx, good ? '=' : '≠', 10 + 2 * cw, yy, { color: good ? col.s[2] : col.s[3], size: 20, weight: 700, align: 'center' }); });
    text(ctx, ST[st].t, w / 2, y + 140, { color: col.ink, size: 12, align: 'center' });
    text(ctx, ok ? 'balanced: 4 Fe + 3 O₂ → 2 Fe₂O₃' : 'not balanced yet', w / 2, h - 14, { color: ok ? col.s[2] : col.s[3], size: 13, weight: 700, align: 'center' });
  };
  return { step(i) { st = Math.min(i, 3); cv.redraw(); } };
}
