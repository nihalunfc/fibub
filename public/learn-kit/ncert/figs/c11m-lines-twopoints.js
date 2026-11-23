// Class 11 Maths, Straight Lines: the equation of the line through two points, here P(1, 2) and Q(4, 8).
// Step 1 slope m = (y2 − y1)/(x2 − x1); step 2 the point-slope form y − y1 = m(x − x1); step 3 tidy to slope-intercept
// and to the general form; step 4 check that Q fits.
import { canvas, axes, line, dot, text, title } from '../../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 1, max: 440, min: 290, label: 'Finding the equation of the line through two points in steps' });
  let s = 0;
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Line through P(1, 2) and Q(4, 8)', col), gh = h * 0.58, g = axes(ctx, w, gh + top, col, { x: [-1, 6], y: [-1, 10], l: 26, b: 22, t: top + 2, r: 10, xt: [0, 2, 4, 6], yt: [0, 2, 4, 6, 8, 10] });
    ctx.save(); g.clip(); if (s >= 1) line(ctx, [[g.X(-1), g.Y(-4)], [g.X(6), g.Y(10)]], col.s[0], 2.5); ctx.restore();
    dot(ctx, g.X(1), g.Y(2), 6, col.s[1], col.panel); dot(ctx, g.X(4), g.Y(8), 6, col.s[1], col.panel); text(ctx, 'P', g.X(1) + 10, g.Y(2) + 10, { color: col.ink, size: 12, weight: 700 }); text(ctx, 'Q', g.X(4) + 10, g.Y(8) + 10, { color: col.ink, size: 12, weight: 700 });
    if (s === 1) { line(ctx, [[g.X(1), g.Y(2)], [g.X(4), g.Y(2)]], col.s[2], 2); line(ctx, [[g.X(4), g.Y(2)], [g.X(4), g.Y(8)]], col.s[2], 2); }
    const L = [['Two points P(1, 2), Q(4, 8)', ''], ['m = (8 − 2)/(4 − 1) = 6/3 = 2', 'slope = rise / run'], ['y − 2 = 2(x − 1)', 'point-slope form (use P)'], ['y = 2x', 'slope-intercept: c = 0'], ['Check Q: 2(4) = 8 ✓', 'also general form 2x − y = 0']];
    const y0 = top + gh + 16; text(ctx, L[s][0], 16, y0, { color: col.ink, size: 15, weight: 700 }); text(ctx, L[s][1], 16, y0 + 20, { color: col.s[0], size: 11.5 });
  };
  cv.redraw();
  return { step(i) { s = Math.min(Math.max(i, 0), 4); cv.redraw(); } };
}
