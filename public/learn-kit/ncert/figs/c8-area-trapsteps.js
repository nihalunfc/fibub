// Class 8 Area (step player): area of a trapezium. Turn a second copy upside down and join it: the two make a parallelogram with
// base (a + b) and the same height h, so one trapezium is half of (a + b) x h.
import { canvas, text, title } from '../../kit.js';
import { note } from './c8-prop2-lib.js';

const N = ['A trapezium with parallel sides a = 4 m (top) and b = 8 m (bottom), and height h = 4 m between them.', 'Make a copy and turn it upside down (a half-turn).', 'Join the copy to the slanting side. The two pieces make one parallelogram.', 'Its base is a + b = 4 + 8 = 12 m and its height is h = 4 m. Area = (a + b) × h = 48 m².', 'The parallelogram is two equal trapeziums, so one trapezium = ½ × (a + b) × h = ½ × 12 × 4 = 24 m².'];
export default function (host) {
  let s = 0;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 290, label: 'Two trapeziums joined to make a parallelogram' });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Area of a trapezium', col), sc = Math.min((w - 30) / 14.5, 24), ox = (w - 13 * sc) / 2 - (s === 1 ? 6 : 0), by = top + 26 + 4 * sc + Math.max(0, (h - top - 190) / 3), X = (x) => ox + x * sc, Y = (y) => by - y * sc;
    const poly = (P, c, a, lw = 2.5) => { ctx.beginPath(); P.forEach(([x, y], i) => (i ? ctx.lineTo(X(x), Y(y)) : ctx.moveTo(X(x), Y(y)))); ctx.closePath(); ctx.fillStyle = c; ctx.globalAlpha = a; ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = c; ctx.lineWidth = lw; ctx.stroke(); };
    const T = [[0, 0], [8, 0], [5, 4], [1, 4]], dx = s === 1 ? 2 : 0;
    poly(T, col.s[0], 0.4);
    if (s >= 1) poly(T.map(([x, y]) => [13 - x + dx, 4 - y]), col.s[3], 0.4);
    ctx.strokeStyle = col.s[2]; ctx.lineWidth = 2; ctx.setLineDash([4, 3]); ctx.beginPath(); ctx.moveTo(X(1), Y(4)); ctx.lineTo(X(1), Y(0)); ctx.stroke(); ctx.setLineDash([]);
    text(ctx, 'h = 4', X(1) - 4, Y(2), { color: col.s[2], size: 11, weight: 700, align: 'right', halo: col.panel });
    if (s < 2) { text(ctx, 'a = 4', X(3), Y(4) - 9, { color: col.ink, size: 11, weight: 700, align: 'center' }); text(ctx, 'b = 8', X(4), Y(0) + 14, { color: col.ink, size: 11, weight: 700, align: 'center' }); }
    if (s >= 2) { text(ctx, 'a + b = 12', X(6.5), Y(0) + 14, { color: col.ink, size: 12, weight: 700, align: 'center' }); text(ctx, s >= 3 ? (s === 3 ? 'parallelogram: 12 × 4 = 48 m²' : 'half: 24 m²') : '', w / 2, Y(4) - 12, { color: col.ink, size: 12, weight: 700, align: 'center' }); }
    note(ctx, N[s], w, h, col);
  };
  cv.redraw();
  return { step(i) { s = Math.min(i, 4); cv.redraw(); } };
}
