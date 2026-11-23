// Class 8 Baudhayana-Pythagoras (step player): a proof by rearranging. A square of side a + b = 7 holds four right triangles (legs 3
// and 4). Placed one way they leave a tilted square c^2 in the middle; placed another way they leave an a^2 and a b^2 square.
// Same big square, same four triangles, so c^2 = a^2 + b^2 (25 = 9 + 16).
import { canvas, text, title } from '../../kit.js';

export default function (host) {
  let s = 0;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 290, label: 'A square of side 7 with four triangles arranged two ways to prove the Pythagoras theorem' });
  const A = [[[0, 0], [3, 0], [0, 4]], [[7, 0], [7, 3], [3, 0]], [[7, 7], [4, 7], [7, 3]], [[0, 7], [0, 4], [4, 7]]];
  const B = [[[4, 0], [7, 0], [7, 4]], [[4, 0], [4, 4], [7, 4]], [[0, 4], [4, 4], [4, 7]], [[0, 4], [0, 7], [4, 7]]];
  cv.draw = (ctx, w, h, col) => {
    const t = title(ctx, ['A square of side a + b = 3 + 4 = 7', 'Place four right triangles (legs 3 and 4)', 'The gap in the middle is a square on the long side c', 'Now slide the same four triangles', 'The gaps are a square on a and a square on b', 'Same big square: c² = a² + b²'][s], col), sc = Math.min((w - 40) / 7, (h - t - 60) / 7), ox = (w - 7 * sc) / 2, oy = t + 24, X = (x) => ox + x * sc, Y = (y) => oy + (7 - y) * sc;
    const poly = (p, cl, al) => { ctx.beginPath(); p.forEach(([x, y], i) => (i ? ctx.lineTo(X(x), Y(y)) : ctx.moveTo(X(x), Y(y)))); ctx.closePath(); ctx.save(); ctx.globalAlpha = al; ctx.fillStyle = cl; ctx.fill(); ctx.restore(); ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.stroke(); };
    poly([[0, 0], [7, 0], [7, 7], [0, 7]], col.s[0], 0.06);
    if (s >= 1 && s <= 2) A.forEach((p, i) => poly(p, col.s[[0, 2, 4, 5][i]], 0.55));
    if (s >= 3) B.forEach((p, i) => poly(p, col.s[[0, 2, 4, 5][i]], 0.55));
    if (s === 2) { poly([[3, 0], [7, 3], [4, 7], [0, 4]], col.s[3], 0.35); text(ctx, 'c² = 25', X(3.5), Y(3.5), { color: col.ink, size: 15, weight: 700, align: 'center', halo: col.panel }); text(ctx, 'c = 5', X(5.3), Y(1.3), { color: col.ink, size: 12, weight: 700, align: 'center', halo: col.panel }); }
    if (s >= 4) { poly([[0, 0], [4, 0], [4, 4], [0, 4]], col.s[3], 0.35); poly([[4, 4], [7, 4], [7, 7], [4, 7]], col.s[1], 0.35); text(ctx, 'b² = 16', X(2), Y(2), { color: col.ink, size: 14, weight: 700, align: 'center', halo: col.panel }); text(ctx, 'a² = 9', X(5.5), Y(5.5), { color: col.ink, size: 14, weight: 700, align: 'center', halo: col.panel }); }
    if (s >= 1 && s <= 2) { text(ctx, 'a=3', X(1.5), Y(0) + 12, { color: col.muted, size: 11, align: 'center' }); text(ctx, 'b=4', X(5), Y(0) + 12, { color: col.muted, size: 11, align: 'center' }); }
    if (s >= 5) text(ctx, '25 = 9 + 16', w / 2, h - 14, { color: col.s[2], size: 15, weight: 700, align: 'center' });
    else text(ctx, 'big square area = 49', w / 2, h - 14, { color: col.muted, size: 12, align: 'center' });
  };
  cv.redraw();
  return { step(i) { s = Math.min(i, 5); cv.redraw(); } };
}
