// Class 11 Maths, Sequences and Series: deriving the sum of a GP. Write S, multiply it by r, and subtract: all the middle
// terms cancel, leaving S − rS = a − arⁿ, so S = a(rⁿ − 1)/(r − 1). Numeric check: 3 + 6 + 12 + 24 + 48 = 93.
import { canvas, text, title } from '../../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 280, label: 'Steps deriving the sum of a geometric progression by subtracting r times the sum' });
  let s = 0;
  const L = [
    ['S = a + ar + ar² + ... + ar^(n−1)', 'write the sum'],
    ['rS = ar + ar² + ar³ + ... + arⁿ', 'multiply every term by r'],
    ['S − rS = a − arⁿ', 'subtract: everything in the middle cancels'],
    ['S(1 − r) = a(1 − rⁿ)', 'factor both sides'],
    ['S = a(rⁿ − 1)/(r − 1),  r ≠ 1', 'divide by 1 − r'],
    ['3 + 6 + 12 + 24 + 48: a = 3, r = 2, n = 5', 'check with a small example'],
  ];
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Sum of n terms of a GP', col);
    for (let i = 0; i <= s; i++) { const y = top + 22 + i * 38, on = i === s; text(ctx, L[i][0], 14, y, { color: on ? col.ink : col.muted, size: on ? 14 : 13, weight: on ? 700 : 500 }); text(ctx, L[i][1], 14, y + 16, { color: on ? col.s[0] : col.muted, size: 10.5 }); }
    if (s === 5) text(ctx, 'S = 3(2⁵ − 1)/(2 − 1) = 93 ✓', w / 2, h - 18, { color: col.s[2], size: 14, weight: 700, align: 'center' });
  };
  cv.redraw();
  return { step(i) { s = Math.min(Math.max(i, 0), 5); cv.redraw(); } };
}
