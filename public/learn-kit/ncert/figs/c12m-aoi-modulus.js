// Class 12 Maths, Application of Integrals (step player): area under a modulus function y = |x − 2| from x = 0 to x = 5.
// |x − 2| is 2 − x to the left of 2 and x − 2 to the right, so the integral must be split at x = 2 into two straight-line
// pieces (two triangles): 2 + 4.5 = 6.5 square units.
import { canvas, axes, line, text, title } from '../../kit.js';

export default function (host) {
  let step = 0;
  const cv = canvas(host, { aspect: 0.95, max: 460, min: 340, label: 'The area under the graph of absolute value of x minus 2, split at x = 2' });
  const T = ['1. Draw y = |x − 2|', '2. It changes rule at x = 2', '3. Left piece: y = 2 − x on [0, 2]', '4. Right piece: y = x − 2 on [2, 5]', '5. Add the two areas'];
  const L = ['the V-shaped graph with its corner at (2, 0)', '|x − 2| = 2 − x if x < 2, and x − 2 if x ≥ 2', '∫₀² (2 − x) dx = [2x − x²/2]₀² = 4 − 2 = 2', '∫₂⁵ (x − 2) dx = [x²/2 − 2x]₂⁵ = (12.5 − 10) − (2 − 4) = 4.5', 'total = 2 + 4.5 = 6.5 square units (never subtract: both pieces are above the axis)'];
  cv.draw = (ctx, w, h, col) => {
    const t = title(ctx, T[step], col);
    text(ctx, L[step], 12, t + 14, { color: col.ink, size: 12, weight: 600 });
    const g = axes(ctx, w, h, col, { x: [0, 5.3], y: [0, 3.5], l: 30, b: 24, t: t + 28, r: 12 });
    ctx.save(); g.clip();
    const tri = (x0, x1, y0, y1, c) => { ctx.globalAlpha = 0.3; ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(g.X(x0), g.Y(0)); ctx.lineTo(g.X(x0), g.Y(y0)); ctx.lineTo(g.X(x1), g.Y(y1)); ctx.lineTo(g.X(x1), g.Y(0)); ctx.fill(); ctx.globalAlpha = 1; };
    if (step >= 2) tri(0, 2, 2, 0, col.s[0]); if (step >= 3) tri(2, 5, 0, 3, col.s[1]);
    line(ctx, [[g.X(0), g.Y(2)], [g.X(2), g.Y(0)], [g.X(5), g.Y(3)]], col.ink, 2.8);
    if (step >= 1) line(ctx, [[g.X(2), g.Y(0)], [g.X(2), g.Y(3.5)]], col.muted, 1.2, [4, 4]);
    ctx.restore();
    if (step >= 2) text(ctx, 'A₁ = 2', g.X(0.75), g.Y(0.5), { color: col.s[0], size: 12, weight: 700, align: 'center' });
    if (step >= 3) text(ctx, 'A₂ = 4.5', g.X(3.7), g.Y(0.6), { color: col.s[1], size: 12, weight: 700, align: 'center' });
    if (step === 4) text(ctx, 'A = 6.5', g.X(2.6), g.Y(3.1), { color: col.ink, size: 14, weight: 700, halo: col.panel });
  };
  return { step(i) { step = Math.min(i, 4); cv.redraw(); } };
}
