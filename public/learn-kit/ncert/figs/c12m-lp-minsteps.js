// Class 12 Maths, Linear Programming (step player): minimising on an UNBOUNDED region. Constraints 2x + y >= 8, x + 2y >= 8, x, y >= 0; minimise Z = 3x + 2y.
// Corners (0, 8), (8/3, 8/3), (8, 0) give Z = 16, 40/3, 24. The smallest, 40/3, is only the answer if the open half-plane 3x + 2y < 40/3 has no point in the region (it has none).
import { canvas, text, title, axes } from '../../kit.js';
import { shade, lineFull, corners, AX, mark } from '../c12m-lp.js';

export default function (host) {
  let st = 0;
  const LN = [{ a: 2, b: 1, c: 8, ge: true }, { a: 1, b: 2, c: 8, ge: true }], C = [...AX, ...LN], M = 40 / 3;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 320, label: 'Minimising over an unbounded region: corner values and the check with an open half-plane' });
  const TT = ['An unbounded feasible region', 'Corner points of the region', 'Z = 3x + 2y at each corner', 'Smallest corner value: 40/3', 'Check: 3x + 2y < 40/3 misses the region'];
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, TT[st], col);
    const G = axes(ctx, w, h, col, { x: [0, 10], y: [0, 10], xlabel: 'x', ylabel: 'y', l: 34, t: top + 8, b: 34, xt: [0, 2, 4, 6, 8, 10], yt: [0, 2, 4, 6, 8, 10] });
    ctx.save(); G.clip(); shade(ctx, G, C, col.s[0], 0.3); LN.forEach((c, i) => lineFull(ctx, G, c.a, c.b, c.c, col.s[i + 1], 2));
    if (st >= 4) { shade(ctx, G, [{ a: 3, b: 2, c: M, ge: false }, ...AX], col.bad, 0.22); lineFull(ctx, G, 3, 2, M, col.s[3], 2.5, [5, 3]); }
    ctx.restore();
    text(ctx, 'region goes on →', G.R - 8, G.T + 14, { color: col.s[0], size: 11.5, weight: 700, align: 'right', halo: col.panel });
    if (st >= 1) corners(C).forEach((p) => {
      const Z = 3 * p[0] + 2 * p[1], isB = st >= 3 && Math.abs(Z - M) < 1e-9;
      mark(ctx, G, p[0], p[1], isB ? col.s[3] : col.ink, col.panel, st >= 2 ? `Z = ${+Z.toFixed(2)}` : `(${+p[0].toFixed(2)}, ${+p[1].toFixed(2)})`, 8, -10, 11);
    });
    if (st >= 4) text(ctx, 'red: 3x + 2y < 40/3 (no overlap)', G.X(5.0), G.Y(6.5), { color: col.bad, size: 11, weight: 700, halo: col.panel });
  };
  cv.redraw();
  return { step(i) { st = Math.min(4, i); cv.redraw(); } };
}
