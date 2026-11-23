// Class 8 Fractions in Disguise (step player): a 20% rise followed by a 20% fall does not get you back. 100 -> 120 -> 96, because the
// second 20% is taken of the bigger number 120 (24), not of 100 (20). Overall change: 1.2 x 0.8 = 0.96, a 4% fall.
import { canvas, text, title } from '../../kit.js';

export default function (host) {
  let s = 0;
  const cv = canvas(host, { aspect: 0.75, max: 440, min: 270, label: 'A bar of 100 rising by 20 percent to 120 and then falling by 20 percent to 96' });
  cv.draw = (ctx, w, h, col) => {
    const t = title(ctx, ['A price of ₹100', 'Rise by 20%: add 20% of 100 = ₹20', 'The price is now ₹120', 'Fall by 20%: take off 20% of 120 = ₹24', 'The price is now ₹96, not ₹100', 'Why: the two 20%s were of different amounts'][s], col), x0 = 24, sc = (w - 48) / 130, y = t + 40;
    const bar = (yy, v, cl, al, lab) => { ctx.save(); ctx.globalAlpha = al; ctx.fillStyle = cl; ctx.fillRect(x0, yy, v * sc, 36); ctx.restore(); ctx.strokeStyle = col.ink; ctx.lineWidth = 1.3; ctx.strokeRect(x0, yy, v * sc, 36); if (lab) text(ctx, lab, x0 + 6, yy + 18, { color: col.ink, size: 12, weight: 700, halo: col.panel }); };
    bar(y, 100, col.s[0], 0.4, '₹100');
    if (s >= 1) { ctx.save(); ctx.globalAlpha = 0.6; ctx.fillStyle = col.s[2]; ctx.fillRect(x0 + 100 * sc, y, 20 * sc, 36); ctx.restore(); ctx.strokeStyle = col.ink; ctx.strokeRect(x0 + 100 * sc, y, 20 * sc, 36); text(ctx, '+20', x0 + 110 * sc, y + 18, { color: col.ink, size: 12, weight: 700, align: 'center', halo: col.panel }); }
    if (s >= 2) bar(y + 56, 120, col.s[2], 0.4, '₹120');
    if (s >= 3) { ctx.save(); ctx.globalAlpha = 0.6; ctx.fillStyle = col.s[3]; ctx.fillRect(x0 + 96 * sc, y + 56, 24 * sc, 36); ctx.restore(); ctx.strokeStyle = col.ink; ctx.strokeRect(x0 + 96 * sc, y + 56, 24 * sc, 36); text(ctx, '−24', x0 + 108 * sc, y + 74, { color: col.ink, size: 12, weight: 700, align: 'center', halo: col.panel }); }
    if (s >= 4) bar(y + 112, 96, col.s[3], 0.4, '₹96');
    if (s >= 5) text(ctx, '1.20 × 0.80 = 0.96: a 4% fall overall', w / 2, h - 14, { color: col.s[5], size: 14, weight: 700, align: 'center' });
  };
  cv.redraw();
  return { step(i) { s = Math.min(i, 5); cv.redraw(); } };
}
