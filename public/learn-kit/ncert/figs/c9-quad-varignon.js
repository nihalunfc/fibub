// Class 9 Quadrilaterals: join the mid-points of the four sides of ANY quadrilateral and you always get a parallelogram.
// Each side of the inner shape is a mid-point-theorem line for a triangle made by a diagonal: parallel to that diagonal, half its length.
import { canvas, text, title, row, button, readout } from '../../kit.js';
import { view, grid, shape, seg, dragger, handle, mid, len, sub, cross } from './c9-quad-lib.js';

export default function (host) {
  let P = [[1, 1], [10, 2], [9, 7], [3, 6]], V = null;
  const cv = canvas(host, { aspect: 0.82, max: 440, min: 290, label: 'A quadrilateral with draggable corners and the parallelogram formed by the mid-points of its sides' });
  const ctl = row(host); const out = readout(host);
  button(ctl, 'Reset', () => { P = [[1, 1], [10, 2], [9, 7], [3, 6]]; sync(); });
  const M = () => [mid(P[0], P[1]), mid(P[1], P[2]), mid(P[2], P[3]), mid(P[3], P[0])];
  function sync() {
    const m = M(), d1 = len(P[0], P[2]), d2 = len(P[1], P[3]);
    out.innerHTML = `The inner shape PQRS has opposite sides ${len(m[0], m[1]).toFixed(2)} and ${len(m[2], m[3]).toFixed(2)}, and ${len(m[1], m[2]).toFixed(2)} and ${len(m[3], m[0]).toFixed(2)}: equal in pairs. Its sides are half the diagonals (AC = ${d1.toFixed(2)}, BD = ${d2.toFixed(2)}).`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Mid-points of any quadrilateral', col); V = view(w, h, top, 12, 8); grid(ctx, V, col);
    const m = M(); shape(ctx, V, P, col.s[0], col.s[0], 0.12, 2.5);
    seg(ctx, V, P[0], P[2], col.muted, 1.2, [4, 4]); seg(ctx, V, P[1], P[3], col.muted, 1.2, [4, 4]);
    shape(ctx, V, m, col.s[3], col.s[3], 0.3, 3);
    m.forEach((p, i) => { ctx.fillStyle = col.s[3]; ctx.beginPath(); ctx.arc(V.X(p[0]), V.Y(p[1]), 4, 0, 7); ctx.fill(); text(ctx, 'PQRS'[i], V.X(p[0]) + (i === 1 ? 12 : i === 3 ? -12 : 0), V.Y(p[1]) + (i === 0 ? 13 : i === 2 ? -13 : 0), { color: col.s[3], size: 12, weight: 700, align: 'center', halo: col.panel }); });
    P.forEach((p, i) => { handle(ctx, V, p, col, dr.active === i); const dx = p[0] - 6, dy = p[1] - 4, L = Math.hypot(dx, dy) || 1; text(ctx, 'ABCD'[i], V.X(p[0]) + (dx / L) * 16, V.Y(p[1]) - (dy / L) * 16, { color: col.ink, size: 13, weight: 700, align: 'center', halo: col.panel }); });
  };
  const dr = dragger(cv, P, () => V, { onmove: sync });
  sync();
}
