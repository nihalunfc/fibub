// Class 8 We Distribute (step player): (a + b)(a - b) = a^2 - b^2 with a = 6, b = 2. Cut a b-by-b corner from an a-by-a square,
// cut the L into two rectangles, turn one and slide it: an (a + b) by (a - b) rectangle of the same area 32 = 36 - 4.
import { canvas, text, title } from '../../kit.js';

export default function (host) {
  let s = 0;
  const cv = canvas(host, { aspect: 0.78, max: 440, min: 270, label: 'A square with a corner removed rearranged into a rectangle to show a squared minus b squared' });
  cv.draw = (ctx, w, h, col) => {
    const t = title(ctx, ['Start: a square of side a = 6', 'Cut away a corner b × b (b = 2)', 'An L-shape is left: area a² − b² = 32', 'Cut the L into two rectangles', 'Turn the small one and slide it over', '(a + b)(a − b) = 8 × 4 = 32'][s], col);
    const sc = Math.min((w - 36) / 8, (h - t - 80) / 6), ox = (w - 8 * sc) / 2, oy = t + 24, Y = (y) => oy + (6 - y) * sc, X = (x) => ox + x * sc;
    const R = (x0, y0, x1, y1, cl, al, lab) => { ctx.save(); ctx.globalAlpha = al; ctx.fillStyle = cl; ctx.fillRect(X(x0), Y(y1), (x1 - x0) * sc, (y1 - y0) * sc); ctx.restore(); ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.strokeRect(X(x0), Y(y1), (x1 - x0) * sc, (y1 - y0) * sc); if (lab) text(ctx, lab, X((x0 + x1) / 2), Y((y0 + y1) / 2), { color: col.ink, size: 12, weight: 700, align: 'center', halo: col.panel }); };
    if (s === 0) R(0, 0, 6, 6, col.s[0], 0.3, 'a² = 36');
    if (s === 1) { R(0, 0, 6, 4, col.s[0], 0.3); R(0, 4, 4, 6, col.s[0], 0.3); R(4, 4, 6, 6, col.s[3], 0.15, 'b² = 4'); }
    if (s === 2) { R(0, 0, 6, 4, col.s[0], 0.3); R(0, 4, 4, 6, col.s[0], 0.3, ''); text(ctx, 'a² − b² = 32', X(3), Y(3), { color: col.ink, size: 14, weight: 700, align: 'center', halo: col.panel }); }
    if (s === 3) { R(0, 0, 6, 4, col.s[0], 0.4, '6 × 4'); R(0, 4, 4, 6, col.s[2], 0.5, '4 × 2'); }
    if (s === 4) { R(0, 0, 6, 4, col.s[0], 0.4, '6 × 4'); R(0, 4, 4, 6, col.s[2], 0.12); ctx.save(); ctx.setLineDash([4, 4]); ctx.strokeStyle = col.s[2]; ctx.strokeRect(X(0), Y(6), 4 * sc, 2 * sc); ctx.restore(); R(6, 0, 8, 4, col.s[2], 0.5, '2 × 4'); }
    if (s >= 5) { R(0, 0, 6, 4, col.s[0], 0.4, '6 × 4'); R(6, 0, 8, 4, col.s[2], 0.5, '2 × 4'); text(ctx, 'a + b = 8', X(4), Y(0) + 14, { color: col.ink, size: 12, weight: 700, align: 'center' }); text(ctx, 'height a − b = 4', X(3), Y(4) + 14, { color: col.muted, size: 11, align: 'center' }); }
    if (s >= 5) text(ctx, 'same area: a² − b² = (a + b)(a − b)', w / 2, h - 10, { color: col.s[2], size: 13, weight: 700, align: 'center' });
  };
  cv.redraw();
  return { step(i) { s = Math.min(i, 5); cv.redraw(); } };
}
