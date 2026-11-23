// Class 12 Implicit differentiation (step player): x^2 + y^2 = 25. Differentiate both sides with respect to x (chain rule on y^2), collect the dy/dx
// term and solve: dy/dx = -x/y. At the point (3, 4) the slope is -3/4, and the tangent is drawn.
import { canvas, text, title, line, dot, axes } from '../../kit.js';

export default function (host) {
  let step = 0;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 310, label: 'Differentiating the equation of a circle step by step to find the slope of its tangent' });
  const LINES = [['x² + y² = 25', 'the circle'], ['d/dx(x²) + d/dx(y²) = d/dx(25)', 'differentiate every term'], ['2x + 2y·(dy/dx) = 0', 'y² gives 2y·y′ (chain rule)'], ['dy/dx = −x/y', 'solve for dy/dx'], ['at (3, 4): dy/dx = −3/4', 'put the point in last']];
  cv.draw = (ctx, w, h, col) => {
    const s = Math.min(step, 4); title(ctx, 'Implicit differentiation of the circle', col);
    LINES.slice(0, s + 1).forEach(([l, n], i) => { text(ctx, l, 12, 44 + i * 19, { color: i === s ? col.s[3] : col.muted, size: i === s ? 14 : 12.5, weight: i === s ? 800 : 600 }); });
    text(ctx, LINES[s][1], w - 10, 44 + s * 19 + 0, { color: col.muted, size: 11, align: 'right' });
    const t0 = 44 + 5 * 19 + 2, ry = (7 * ((h - 22) - t0)) / (w - 42), A = axes(ctx, w, h, col, { x: [-7, 7], y: [-ry, ry], l: 28, r: 14, t: t0, b: 22, xt: [-5, 0, 5], yt: ry > 5.3 ? [-5, 0, 5] : [0] });
    const pts = []; for (let a = 0; a <= 6.29; a += 0.05) pts.push([A.X(5 * Math.cos(a)), A.Y(5 * Math.sin(a))]); line(ctx, pts, col.s[0], 3);
    if (s >= 4) { ctx.save(); A.clip(); line(ctx, [[A.X(3 - 4), A.Y(4 + 3)], [A.X(3 + 4), A.Y(4 - 3)]], col.s[3], 2.5); ctx.restore(); dot(ctx, A.X(3), A.Y(4), 6.5, col.s[3], col.ink); text(ctx, '(3, 4)', A.X(3) + 8, A.Y(4) - 12, { color: col.ink, size: 12, weight: 800, halo: col.panel }); }
  };
  return { step(i) { step = Math.min(i, 4); cv.redraw(); } };
}
