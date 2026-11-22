// Class 9 Identities (step player): (a + b)^2 = a^2 + 2ab + b^2 as the area of a square of side a + b cut into four pieces:
// an a-by-a square, two a-by-b rectangles and a b-by-b square. Drawn here with a = 5 and b = 3 (area 64 = 25 + 30 + 9).
import { canvas, text, title } from '../../kit.js';

export default function (host) {
  let s = 0;
  const cv = canvas(host, { aspect: 1, max: 440, min: 300, label: 'A square of side a plus b cut into a squared, two a b rectangles and b squared' });
  cv.draw = (ctx, w, h, col) => {
    const t = title(ctx, ['A square with side a + b', 'Cut it at a and at b: four pieces', 'The big piece: a × a = a²', 'Two rectangles, each a × b: ab + ab = 2ab', 'The small corner: b × b = b²', '(a + b)² = a² + 2ab + b²'][s], col), A = 5, B = 3, sc = Math.min((w - 70) / 8, (h - t - 56) / 8), ox = (w - 8 * sc) / 2 + 8, oy = t + 24;
    const X = (v) => ox + v * sc, Y = (v) => oy + v * sc;
    const box = (x, y, ww, hh, c, a) => { ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = c; ctx.fillRect(X(x), Y(y), ww * sc, hh * sc); ctx.restore(); ctx.save(); ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.strokeRect(X(x), Y(y), ww * sc, hh * sc); ctx.restore(); };
    if (s === 0) box(0, 0, 8, 8, col.s[0], 0.12);
    if (s >= 1) { box(0, 0, 5, 5, col.s[0], s >= 2 ? 0.5 : 0.18); box(5, 0, 3, 5, col.s[2], s >= 3 ? 0.55 : 0.18); box(0, 5, 5, 3, col.s[2], s >= 3 ? 0.55 : 0.18); box(5, 5, 3, 3, col.s[3], s >= 4 ? 0.6 : 0.18); }
    text(ctx, 'a', X(2.5), Y(0) - 8, { color: col.ink, size: 14, weight: 700, align: 'center' }); text(ctx, 'b', X(6.5), Y(0) - 8, { color: col.ink, size: 14, weight: 700, align: 'center' });
    text(ctx, 'a', X(0) - 9, Y(2.5), { color: col.ink, size: 14, weight: 700, align: 'center' }); text(ctx, 'b', X(0) - 9, Y(6.5), { color: col.ink, size: 14, weight: 700, align: 'center' });
    if (s >= 2) text(ctx, 'a² = 25', X(2.5), Y(2.5), { color: col.ink, size: 15, weight: 700, align: 'center', halo: col.panel });
    if (s >= 3) { text(ctx, 'ab = 15', X(6.5), Y(2.5), { color: col.ink, size: 13, weight: 700, align: 'center', halo: col.panel }); text(ctx, 'ab = 15', X(2.5), Y(6.5), { color: col.ink, size: 13, weight: 700, align: 'center', halo: col.panel }); }
    if (s >= 4) text(ctx, 'b² = 9', X(6.5), Y(6.5), { color: col.ink, size: 13, weight: 700, align: 'center', halo: col.panel });
    if (s >= 5) text(ctx, '8² = 64 = 25 + 15 + 15 + 9', w / 2, h - 12, { color: col.s[5], size: 14, weight: 700, align: 'center' });
    if (s === 0) text(ctx, 'side 8 (a = 5, b = 3): area 8² = 64', w / 2, h - 12, { color: col.muted, size: 12, align: 'center' });
  };
  cv.redraw();
  return { step(i) { s = Math.min(i, 5); cv.redraw(); } };
}
