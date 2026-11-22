// Class 9 Identities (step player): (a - b)^2 = a^2 - 2ab + b^2. Start with the square a^2, take away two strips (a x b and then
// b x (a - b)); the little b x b corner was taken away twice, so it is added back. Drawn with a = 5, b = 2 (area 9 = 25 - 20 + 4).
import { canvas, text, title } from '../../kit.js';

export default function (host) {
  let s = 0;
  const cv = canvas(host, { aspect: 1, max: 440, min: 300, label: 'A square of side a with two strips removed leaving a square of side a minus b' });
  cv.draw = (ctx, w, h, col) => {
    const t = title(ctx, ['Start with a square of side a: area a²', 'Remove the right strip: a × b = ab', 'Remove the top strip: b × (a − b) = ab − b²', 'What is left is a square of side a − b', 'a² − ab − (ab − b²) = a² − 2ab + b²', 'Two strips of ab took b² away twice: add it back'][s], col), A = 5, B = 2, sc = Math.min((w - 60) / 5, (h - t - 84) / 5), ox = (w - 5 * sc) / 2, oy = t + 22;
    const X = (v) => ox + v * sc, Y = (v) => oy + v * sc;
    const box = (x, y, ww, hh, c, a, stroke = col.ink) => { ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = c; ctx.fillRect(X(x), Y(y), ww * sc, hh * sc); ctx.restore(); ctx.save(); ctx.strokeStyle = stroke; ctx.lineWidth = 1.5; ctx.strokeRect(X(x), Y(y), ww * sc, hh * sc); ctx.restore(); };
    box(0, 0, 5, 5, col.s[0], s >= 3 ? 0.08 : 0.2);
    if (s >= 1) box(3, 0, 2, 5, col.s[6], 0.45);
    if (s >= 2) box(0, 0, 3, 2, col.s[3], 0.45);
    if (s >= 3) box(0, 2, 3, 3, col.s[2], 0.6);
    if (s >= 5) { ctx.save(); ctx.strokeStyle = col.s[5]; ctx.lineWidth = 3; ctx.setLineDash([5, 3]); ctx.strokeRect(X(3), Y(0), 2 * sc, 2 * sc); ctx.restore(); text(ctx, 'b² twice', X(4), Y(1), { color: col.ink, size: 11, weight: 700, align: 'center', halo: col.panel }); }
    text(ctx, 'a', X(2.5), Y(5) + 12, { color: col.ink, size: 14, weight: 700, align: 'center' }); text(ctx, 'b', X(4), Y(5) + 12, { color: col.ink, size: 13, weight: 700, align: 'center' });
    if (s >= 1) text(ctx, 'ab', X(4), Y(3.2), { color: col.ink, size: 14, weight: 700, align: 'center', halo: col.panel });
    if (s >= 2) text(ctx, 'ab − b²', X(1.5), Y(1), { color: col.ink, size: 12, weight: 700, align: 'center', halo: col.panel });
    if (s >= 3) text(ctx, '(a − b)²', X(1.5), Y(3.5), { color: col.ink, size: 14, weight: 700, align: 'center', halo: col.panel });
    text(ctx, 'a = 5, b = 2:  (5 − 2)² = 9 = 25 − 20 + 4', w / 2, h - 12, { color: col.muted, size: 11.5, align: 'center' });
  };
  cv.redraw();
  return { step(i) { s = Math.min(i, 5); cv.redraw(); } };
}
