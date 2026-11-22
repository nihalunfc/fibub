// Class 9 Identities (step player): a^2 - b^2 = (a + b)(a - b). Cut a b-by-b square from the corner of an a-by-a square; cut the
// L-shape that is left into two rectangles and turn one so that they join into one rectangle with sides a + b and a - b.
import { canvas, text, title } from '../../kit.js';

export default function (host) {
  let s = 0;
  const cv = canvas(host, { aspect: 1.05, max: 440, min: 300, label: 'An L shape cut and rearranged into a rectangle of sides a plus b and a minus b' });
  cv.draw = (ctx, w, h, col) => {
    const t = title(ctx, ['A square of side a = 5: area a²', 'Cut a square of side b = 3 from a corner', 'The L-shape left has area a² − b²', 'Cut the L into two rectangles', 'Turn the top piece and slide it next to the other', '(a + b)(a − b) = a² − b²'][s], col), A = 5, B = 3;
    const sc = Math.min((w - 30) / 8, (h - t - 74) / 7), ox = (w - 8 * sc) / 2;
    const top = t + 14, X = (v) => ox + v * sc;
    const box = (x, y, ww, hh, c, a) => { ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = c; ctx.fillRect(x, y, ww * sc, hh * sc); ctx.restore(); ctx.save(); ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.strokeRect(x, y, ww * sc, hh * sc); ctx.restore(); };
    const lx = X(1.5);
    if (s === 0) box(lx, top, 5, 5, col.s[0], 0.3);
    if (s >= 1 && s <= 2) { box(lx, top, 5, 5, col.s[0], 0.08); box(lx + 2 * sc, top, 3, 3, col.s[6], 0.4); text(ctx, 'b²', lx + 3.5 * sc, top + 1.5 * sc, { color: col.ink, size: 13, weight: 700, align: 'center' }); }
    if (s === 2) text(ctx, 'a² − b²', lx + 1 * sc, top + 4 * sc, { color: col.ink, size: 13, weight: 700, align: 'center', halo: col.panel });
    if (s >= 1 && s <= 2) { box(lx, top, 2, 5, col.s[0], 0.3); box(lx + 2 * sc, top + 3 * sc, 3, 2, col.s[0], 0.3); }
    if (s === 3) { box(lx, top + 3 * sc, 5, 2, col.s[0], 0.4); box(lx, top, 2, 3, col.s[2], 0.5); box(lx + 2 * sc, top, 3, 3, col.s[6], 0.06); text(ctx, '(a−b)×a', lx + 2.5 * sc, top + 4 * sc, { color: col.ink, size: 11, weight: 700, align: 'center' }); text(ctx, 'b×(a−b)', lx + 1 * sc, top + 1.5 * sc, { color: col.ink, size: 10, weight: 700, align: 'center' }); }
    if (s >= 4) { const y0 = top + 1 * sc; box(X(0), y0, 5, 2, col.s[0], 0.4); box(X(5), y0, 3, 2, col.s[2], 0.5); text(ctx, 'a − b = 2', X(-0.2), y0 + 1 * sc, { color: col.ink, size: 11, weight: 700, align: 'right' }); text(ctx, 'a + b = 8', X(4), y0 + 3.2 * sc, { color: col.ink, size: 13, weight: 700, align: 'center' }); text(ctx, 'a (=5)', X(2.5), y0 + 1 * sc, { color: col.ink, size: 11, weight: 700, align: 'center' }); text(ctx, 'b (=3)', X(6.5), y0 + 1 * sc, { color: col.ink, size: 11, weight: 700, align: 'center' }); }
    if (s >= 5) text(ctx, '8 × 2 = 16 = 25 − 9', w / 2, h - 14, { color: col.s[5], size: 14, weight: 700, align: 'center' });
    if (s <= 2) { text(ctx, 'a = 5', lx + 2.5 * sc, top - 4 - 0, { color: col.ink, size: 11, weight: 700, align: 'center' }); }
  };
  cv.redraw();
  return { step(i) { s = Math.min(i, 5); cv.redraw(); } };
}
