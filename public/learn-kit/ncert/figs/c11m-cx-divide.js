// Class 11 Maths, Complex Numbers (step player): dividing (3 + 2i) by (1 − i). To make the bottom a real number, multiply top and bottom by the conjugate of the
// bottom (1 + i), because (a − bi)(a + bi) = a² + b². The picture shows the three numbers on the Argand plane; the quotient appears at the end.
import { canvas, text, title } from '../../kit.js';
import { argandPlot, cstr } from '../c11m-lib.js';
import { dot, arrow } from '../../kit.js';

export default function (host) {
  let s = 0;
  const cv = canvas(host, { aspect: 1.1, max: 440, min: 300, label: 'Argand plane showing the numerator, the denominator and the quotient of a complex division' });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, '(3 + 2i) ÷ (1 − i)', col), ph = Math.min(h * 0.58, w - 40);
    const P = argandPlot(ctx, w, h, col, { x: (w - ph) / 2, y: top + 4, w: ph, h: ph }, 4), T = (a, b) => [P.X(a), P.Y(b)];
    const pt = (a, b, c, name, dx = 9, dy = -9) => { arrow(ctx, ...T(0, 0), ...T(a, b), c, 1.8, 7); dot(ctx, ...T(a, b), 5.5, c, col.panel); text(ctx, name, T(a, b)[0] + dx, T(a, b)[1] + dy, { color: c, size: 11.5, weight: 800 }); };
    pt(3, 2, col.s[0], '3+2i'); pt(1, -1, col.s[2], '1−i', 8, 12);
    if (s >= 1) pt(1, 1, col.s[4], '1+i', 8, -8);
    if (s >= 4) pt(0.5, 2.5, col.s[3], '0.5+2.5i', 10, -6);
    const y = top + ph + 30, say = (t, k, c = col.ink, z = 12.5) => text(ctx, t, 10, y + k * 21, { color: c, size: z, weight: 700 });
    const L = [
      ['We want (3 + 2i)/(1 − i) in the form a + bi.', 'Trouble: i is in the bottom.'],
      ['The conjugate of the bottom 1 − i is 1 + i.', 'Multiply top and bottom by it (that multiplies by 1).'],
      ['Top: (3 + 2i)(1 + i) = 3 + 3i + 2i + 2i²', '= 3 + 5i − 2 = 1 + 5i      (i² = −1)'],
      ['Bottom: (1 − i)(1 + i) = 1 − i² = 1 + 1 = 2', 'The bottom is now a plain real number.'],
      ['(1 + 5i) / 2 = 1/2 + (5/2) i', 'The quotient is 0.5 + 2.5i (the orange point).'],
      ['Check: (0.5 + 2.5i)(1 − i) = 0.5 − 0.5i + 2.5i − 2.5i²', '= 0.5 + 2i + 2.5 = 3 + 2i ✓'],
    ];
    L[Math.min(s, 5)].forEach((t, k) => say(t, k, s === 4 && k === 1 ? col.s[3] : col.ink));
  };
  cv.redraw();
  return { step(i) { s = Math.min(i, 5); cv.redraw(); } };
}
