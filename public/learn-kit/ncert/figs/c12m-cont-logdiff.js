// Class 12 Logarithmic differentiation (step player): y = x^x has x in both the base and the power, so neither the power rule nor the
// exponential rule works. Take ln of both sides first: ln y = x ln x, differentiate (product rule on the right, chain rule on the left):
// (1/y) y' = ln x + 1, so y' = x^x (ln x + 1). At x = 2 the slope is 4(ln 2 + 1) = 6.77. The graph shows the curve and that tangent.
import { canvas, text, title, line, dot, axes } from '../../kit.js';
import { plot } from '../c12m-lib.js';

export default function (host) {
  let step = 0;
  const cv = canvas(host, { aspect: 0.9, max: 440, min: 300, label: 'The curve y equals x to the power x with its tangent found by taking logarithms' });
  const LINES = ['y = xˣ  (x > 0)', 'ln y = x ln x', 'Differentiate both sides', '(1/y)·y′ = ln x + 1', 'y′ = xˣ (ln x + 1)'];
  cv.draw = (ctx, w, h, col) => {
    const s = Math.min(step, 4); title(ctx, 'Logarithmic differentiation of xˣ', col);
    const shown = LINES.slice(0, s + 1);
    shown.forEach((l, i) => text(ctx, l, 12, 44 + i * 19, { color: i === s ? col.s[3] : col.muted, size: i === s ? 15 : 13, weight: i === s ? 800 : 600 }));
    const top = 44 + 5 * 19 + 4;
    const A = axes(ctx, w, h, col, { x: [0, 3], y: [0, 14], l: 34, r: 14, t: top, b: 30, xt: [0, 1, 2, 3], yt: [0, 5, 10], xlabel: 'x' });
    ctx.save(); A.clip(); plot(ctx, A.X, A.Y, (x) => Math.pow(x, x), 0.02, 3, col.s[0], 3);
    if (s >= 4) { const m = 4 * (Math.LN2 + 1); line(ctx, [[A.X(1), A.Y(4 - m)], [A.X(3), A.Y(4 + m)]], col.s[3], 2.5); }
    ctx.restore();
    if (s >= 4) { dot(ctx, A.X(2), A.Y(4), 6, col.s[3], col.ink); text(ctx, `at x = 2: slope 4(ln 2 + 1) = ${(4 * (Math.LN2 + 1)).toFixed(2)}`, A.L + 8, A.T + 10, { color: col.s[3], size: 12, weight: 800, halo: col.panel }); }
  };
  return { step(i) { step = Math.min(i, 4); cv.redraw(); } };
}
