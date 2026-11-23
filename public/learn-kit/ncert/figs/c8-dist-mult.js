// Class 8 We Distribute (step player): 23 x 14 with an area model. Split 23 = 20 + 3 and 14 = 10 + 4, get four small products
// 200, 80, 30, 12 and add them: 322. This is (20 + 3)(10 + 4) = 20x10 + 20x4 + 3x10 + 3x4.
import { canvas, text, title } from '../../kit.js';

export default function (host) {
  let s = 0;
  const cv = canvas(host, { aspect: 0.75, max: 440, min: 280, label: 'An area model that multiplies 23 by 14 by splitting both numbers' });
  cv.draw = (ctx, w, h, col) => {
    const t = title(ctx, ['23 × 14 is the area of a rectangle', 'Split 23 into 20 + 3', 'Split 14 into 10 + 4', 'Biggest piece: 20 × 10 = 200', 'The other three pieces', 'Add the four pieces: 322'][s], col);
    const sc = Math.min((w - 70) / 23, (h - t - 70) / 14), W = 23 * sc, H = 14 * sc, ox = (w - W) / 2 + 8, oy = t + 30, split = s >= 1 ? 20 : 23, rsplit = s >= 2 ? 10 : 14;
    const R = (x0, x1, y0, y1, cl, al, lab) => { ctx.save(); ctx.globalAlpha = al; ctx.fillStyle = cl; ctx.fillRect(ox + x0 * sc, oy + y0 * sc, (x1 - x0) * sc, (y1 - y0) * sc); ctx.restore(); ctx.strokeStyle = col.ink; ctx.lineWidth = 1.4; ctx.strokeRect(ox + x0 * sc, oy + y0 * sc, (x1 - x0) * sc, (y1 - y0) * sc); if (lab) text(ctx, lab, ox + (x0 + x1) / 2 * sc, oy + (y0 + y1) / 2 * sc, { color: col.ink, size: 13, weight: 700, align: 'center', halo: col.panel }); };
    if (s < 3) { R(0, 23, 0, 14, col.s[0], 0.12); if (s >= 1) { ctx.beginPath(); ctx.moveTo(ox + 20 * sc, oy); ctx.lineTo(ox + 20 * sc, oy + H); ctx.strokeStyle = col.s[3]; ctx.lineWidth = 2; ctx.stroke(); } if (s >= 2) { ctx.beginPath(); ctx.moveTo(ox, oy + 10 * sc); ctx.lineTo(ox + W, oy + 10 * sc); ctx.strokeStyle = col.s[3]; ctx.lineWidth = 2; ctx.stroke(); } }
    else { R(0, 20, 0, 10, col.s[0], 0.5, '20 × 10 = 200'); R(20, 23, 0, 10, col.s[2], s >= 4 ? 0.5 : 0.1, s >= 4 ? '30' : ''); R(0, 20, 10, 14, col.s[3], s >= 4 ? 0.5 : 0.1, s >= 4 ? '80' : ''); R(20, 23, 10, 14, col.s[5], s >= 4 ? 0.5 : 0.1, s >= 4 ? '12' : ''); }
    text(ctx, s >= 1 ? '20' : '23', ox + (s >= 1 ? 10 : 11.5) * sc, oy - 8, { color: col.ink, size: 12, weight: 700, align: 'center' }); if (s >= 1) text(ctx, '3', ox + 21.5 * sc, oy - 8, { color: col.ink, size: 12, weight: 700, align: 'center' });
    text(ctx, s >= 2 ? '10' : '14', ox - 6, oy + (s >= 2 ? 5 : 7) * sc, { color: col.ink, size: 12, weight: 700, align: 'right' }); if (s >= 2) text(ctx, '4', ox - 6, oy + 12 * sc, { color: col.ink, size: 12, weight: 700, align: 'right' });
    if (s >= 5) text(ctx, '200 + 80 + 30 + 12 = 322', w / 2, h - 14, { color: col.s[2], size: 15, weight: 700, align: 'center' });
  };
  cv.redraw();
  return { step(i) { s = Math.min(i, 5); cv.redraw(); } };
}
