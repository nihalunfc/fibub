// Class 9 Coordinates (step player): the distance between A(1, 1) and B(5, 4) by building a right triangle and using Pythagoras.
import { canvas, text, title, dot, line } from '../../kit.js';
import { plane } from './c9-coord-plane.js';

const L = ['Two points A and B', 'Across: |5 − 1| = 4', 'Up: |4 − 1| = 3', 'A right angle at C', 'AB² = 4² + 3² = 25', 'AB = √25 = 5 units'];
export default function (host) {
  let s = 0;
  const cv = canvas(host, { aspect: 1, max: 440, min: 300, label: 'Finding the distance between two points by drawing a right triangle' });
  cv.draw = (ctx, w, h, col) => {
    const t = title(ctx, 'Distance by Pythagoras', col);
    text(ctx, L[s], 10, t + 12, { color: col.s[0], size: 13, weight: 700, halo: col.panel });
    const g = plane(ctx, w, h, col, { top: t + 28, x0: -1, x1: 7, y0: -1, y1: 6 });
    const A = [1, 1], B = [5, 4], C = [5, 1];
    if (s >= 3) { ctx.save(); ctx.globalAlpha = 0.14; ctx.fillStyle = col.s[0]; ctx.beginPath(); ctx.moveTo(g.X(1), g.Y(1)); ctx.lineTo(g.X(5), g.Y(1)); ctx.lineTo(g.X(5), g.Y(4)); ctx.closePath(); ctx.fill(); ctx.restore(); line(ctx, [[g.X(5) - 9, g.Y(1)], [g.X(5) - 9, g.Y(1) - 9], [g.X(5), g.Y(1) - 9]], col.ink, 1.5); }
    if (s >= 1) { line(ctx, [[g.X(1), g.Y(1)], [g.X(5), g.Y(1)]], col.s[0], 3); text(ctx, '4', g.X(3), g.Y(1) + 12, { color: col.s[0], size: 13, weight: 700, align: 'center', halo: col.panel }); dot(ctx, g.X(5), g.Y(1), 4, col.ink); text(ctx, 'C (5, 1)', g.X(5) + 6, g.Y(1) + 12, { color: col.ink, size: 11, weight: 700, halo: col.panel }); }
    if (s >= 2) { line(ctx, [[g.X(5), g.Y(1)], [g.X(5), g.Y(4)]], col.s[2], 3); text(ctx, '3', g.X(5) + 10, g.Y(2.5), { color: col.s[2], size: 13, weight: 700, halo: col.panel }); }
    if (s >= 3) { line(ctx, [[g.X(1), g.Y(1)], [g.X(5), g.Y(4)]], col.s[5], 3); }
    if (s >= 4) text(ctx, s >= 5 ? 'AB = 5' : 'AB² = 25', g.X(2.8), g.Y(3.3), { color: col.s[5], size: 13, weight: 700, align: 'center', halo: col.panel });
    dot(ctx, g.X(1), g.Y(1), 6, col.s[3], col.ink); dot(ctx, g.X(5), g.Y(4), 6, col.s[3], col.ink);
    text(ctx, 'A (1, 1)', g.X(1) - 4, g.Y(1) - 14, { color: col.ink, size: 11, weight: 700, halo: col.panel, align: 'center' }); text(ctx, 'B (5, 4)', g.X(5) + 4, g.Y(4) - 14, { color: col.ink, size: 11, weight: 700, halo: col.panel, align: 'center' });
  };
  cv.redraw();
  return { step(i) { s = Math.min(i, 5); cv.redraw(); } };
}
