// Class 12 Maths, Linear Programming (step player): the graphical method on a dhaba problem. x plates of samosa and y of kachori; Z = 40x + 30y rupees profit
// subject to x + y <= 8, x + 3y <= 18, 3x + y <= 18, x, y >= 0. Steps: the lines, the shaded region, the corner points, Z at each corner, the best one.
import { canvas, text, title, axes } from '../../kit.js';
import { shade, lineFull, corners, AX, mark } from '../c12m-lp.js';

export default function (host) {
  let st = 0;
  const LN = [{ a: 1, b: 1, c: 8, ge: false }, { a: 1, b: 3, c: 18, ge: false }, { a: 3, b: 1, c: 18, ge: false }], C = [...AX, ...LN];
  const NAMES = ['x + y = 8', 'x + 3y = 18', '3x + y = 18'];
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 320, label: 'The graphical method of linear programming built up one step at a time' });
  const TT = ['Plot x and y: what we choose', 'Draw each boundary line', 'Shade the feasible region', 'Mark the corner points', 'Work out Z = 40x + 30y at each corner', 'The largest Z is the answer'];
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, TT[st], col);
    const G = axes(ctx, w, h, col, { x: [0, 10], y: [0, 10], xlabel: 'x = plates of samosa', ylabel: 'y = kachori', l: 34, t: top + 8, b: 34, xt: [0, 2, 4, 6, 8, 10], yt: [0, 2, 4, 6, 8, 10] });
    ctx.save(); G.clip();
    if (st >= 1) LN.forEach((c, i) => lineFull(ctx, G, c.a, c.b, c.c, col.s[i + 1], 2));
    if (st >= 2) shade(ctx, G, C, col.s[0], 0.3);
    ctx.restore();
    if (st >= 1) LN.forEach((c, i) => text(ctx, NAMES[i], G.R - 6, G.T + 14 + i * 14, { color: col.s[i + 1], size: 11, weight: 700, align: 'right' }));
    if (st >= 3) {
      const cs = corners(C), Zs = cs.map((p) => 40 * p[0] + 30 * p[1]), best = Math.max(...Zs);
      cs.forEach((p, i) => {
        const isB = st >= 5 && Zs[i] === best;
        mark(ctx, G, p[0], p[1], isB ? col.s[3] : col.ink, col.panel, st >= 4 ? `Z = ${Zs[i]}` : `(${p[0]}, ${p[1]})`, p[0] === 0 && p[1] === 0 ? 8 : 8, p[1] === 0 ? -14 : -10, 11);
      });
    }
  };
  cv.redraw();
  return { step(i) { st = Math.min(5, i); cv.redraw(); } };
}
