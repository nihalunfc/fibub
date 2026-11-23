// Class 11 Maths, Complex Numbers and Quadratic Equations (step player): solving x² − 2x + 5 = 0 with the formula x = (−b ± √(b² − 4ac)) / 2a. The discriminant is negative,
// so the square root is an imaginary number and the roots are a conjugate pair 1 ± 2i, which sit symmetrically above and below the real axis.
import { canvas, text, title } from '../../kit.js';
import { plot, curve, argandPlot } from '../c11m-lib.js';
import { dot } from '../../kit.js';

export default function (host) {
  let s = 0;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 300, label: 'The parabola for x squared minus two x plus five, which misses the x axis, and its complex roots on the Argand plane' });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Solve x² − 2x + 5 = 0', col), pw = (w - 36) / 2, ph = Math.min(pw, h * 0.5);
    const A = plot(ctx, w, h, col, { x: [-3, 5], y: [-2, 12], l: 22, r: w - 22 - pw, t: top + 14, b: h - top - 14 - ph, sx: 4, sy: 4 });
    curve(ctx, A, (x) => x * x - 2 * x + 5, col.s[0], 2.5);
    text(ctx, 'y = x² − 2x + 5 misses the x-axis', A.L, A.T - 8, { color: col.muted, size: 10.5, weight: 700 });
    const Bp = argandPlot(ctx, w, h, col, { x: w - 14 - pw, y: top + 14, w: pw, h: ph }, 4, 2);
    if (s >= 4) { [[1, 2], [1, -2]].forEach(([a, b]) => { dot(ctx, Bp.X(a), Bp.Y(b), 5.5, col.s[3], col.panel); text(ctx, `${a}${b > 0 ? '+' : '−'}2i`, Bp.X(a) + 8, Bp.Y(b) + (b > 0 ? -2 : 2), { color: col.s[3], size: 10.5, weight: 800 }); }); }
    const y = top + ph + 40, say = (t, k, c = col.ink, z = 12) => text(ctx, t, 10, y + k * 20, { color: c, size: z, weight: 700 });
    const L = [['a = 1, b = −2, c = 5.', 'Formula: x = (−b ± √D) / 2a.'], ['D = b² − 4ac = 4 − 20 = −16.', 'D < 0: no real roots (the parabola misses the axis).'], ['√D = √(−16) = √16 · √(−1) = 4i.', ''], ['x = (2 ± 4i) / 2.', ''], ['x = 1 + 2i  or  x = 1 − 2i.', 'A conjugate pair, mirrored in the real axis.'], ['Check x = 1 + 2i: (1+2i)² − 2(1+2i) + 5', '= (1 + 4i − 4) − 2 − 4i + 5 = 0 ✓']];
    L[Math.min(s, 5)].forEach((t, k) => say(t, k, k === 0 && s === 4 ? col.s[3] : col.ink));
  };
  cv.redraw();
  return { step(i) { s = Math.min(i, 5); cv.redraw(); } };
}
