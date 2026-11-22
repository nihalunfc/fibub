// Class 9 Linear Polynomials (step player): from a table to a graph for y = 2x + 1. Choose inputs, work out the outputs,
// plot each pair as a point, and join the points: they fall on one straight line.
import { canvas, text, title, dot, line } from '../../kit.js';
import { plane } from './c9-coord-plane.js';

const X = [-2, -1, 0, 1, 2, 3];
export default function (host) {
  let s = 0;
  const cv = canvas(host, { aspect: 1.05, max: 440, min: 300, label: 'A table of values for y equals 2x plus 1 becoming points and then a straight line' });
  cv.draw = (ctx, w, h, col) => {
    const t = title(ctx, ['p(x) = 2x + 1: pick inputs', 'Work out each output', 'Make ordered pairs (x, y)', 'Plot the points', 'Join them: a straight line', 'Any other input lands on the line'][s], col);
    const cw = Math.min(54, (w - 20) / 7), x0 = 10, y0 = t + 8;
    const cell = (c, r, lab, bold, colr) => { const px = x0 + c * cw, py = y0 + r * 24; ctx.save(); ctx.strokeStyle = col.line; ctx.strokeRect(px, py, cw, 24); ctx.restore(); text(ctx, lab, px + cw / 2, py + 12, { color: colr ?? col.ink, size: 11, weight: bold ? 700 : 400, align: 'center' }); };
    cell(0, 0, 'x', true); cell(0, 1, '2x + 1', true); cell(0, 2, '(x, y)', true);
    X.forEach((v, i) => { cell(i + 1, 0, String(v).replace('-', '−')); if (s >= 1) cell(i + 1, 1, String(2 * v + 1).replace('-', '−'), false, col.s[0]); if (s >= 2) cell(i + 1, 2, ('(' + v + ',' + (2 * v + 1) + ')').replace(/-/g, '−'), false, col.s[2]); });
    const g = plane(ctx, w, h, col, { top: y0 + 3 * 24 + 8, x0: -3, x1: 4, y0: -4, y1: 8 });
    if (s >= 4) { ctx.save(); ctx.beginPath(); ctx.rect(g.X(-3), g.Y(8), 7 * g.s, 12 * g.s); ctx.clip(); line(ctx, [[g.X(-3), g.Y(-5)], [g.X(4), g.Y(9)]], col.s[0], 3); ctx.restore(); }
    if (s >= 3) X.forEach((v) => dot(ctx, g.X(v), g.Y(2 * v + 1), 5.5, col.s[5], col.ink));
    if (s >= 5) { dot(ctx, g.X(0.5), g.Y(2), 6, col.s[3], col.ink); text(ctx, 'x = 0.5, y = 2', g.X(0.5) + 8, g.Y(2) + 12, { color: col.ink, size: 11, weight: 700, halo: col.panel }); }
  };
  cv.redraw();
  return { step(i) { s = Math.min(i, 5); cv.redraw(); } };
}
