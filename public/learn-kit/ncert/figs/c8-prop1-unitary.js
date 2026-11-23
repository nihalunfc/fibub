// Class 8 Proportional Reasoning 1 (step player): the unitary method as a bar model. 6 pens cost Rs 90; find the cost of 1 pen,
// then of 9 pens: 90 / 6 = 15 and 15 x 9 = 135.
import { canvas, text, title } from '../../kit.js';

export default function (host) {
  let s = 0;
  const cv = canvas(host, { aspect: 0.7, max: 440, min: 260, label: 'A bar model with 6 boxes costing 90 rupees, one box costing 15 and nine boxes costing 135' });
  cv.draw = (ctx, w, h, col) => {
    const t = title(ctx, ['6 pens cost ₹90. What do 9 pens cost?', 'Six equal boxes share ₹90', 'Divide: one pen costs 90 ÷ 6 = ₹15', 'Every box is ₹15', 'Now take 9 boxes', '9 pens cost 15 × 9 = ₹135'][s], col), bw = Math.min(40, (w - 30) / 9), x0 = (w - bw * 9) / 2, y1 = t + 36, y2 = t + 120;
    const box = (i, y, cl, lab, al) => { ctx.save(); ctx.globalAlpha = al; ctx.fillStyle = cl; ctx.fillRect(x0 + i * bw + 1, y, bw - 2, 38); ctx.restore(); ctx.strokeStyle = col.ink; ctx.lineWidth = 1.3; ctx.strokeRect(x0 + i * bw + 1, y, bw - 2, 38); if (lab) text(ctx, lab, x0 + i * bw + bw / 2, y + 19, { color: col.ink, size: Math.min(13, bw * 0.34), weight: 700, align: 'center' }); };
    for (let i = 0; i < 6; i++) box(i, y1, col.s[0], s >= 2 ? '₹15' : '', 0.4);
    if (s >= 1) { ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x0 + 1, y1 - 8); ctx.lineTo(x0 + 6 * bw - 1, y1 - 8); ctx.stroke(); text(ctx, '6 pens = ₹90', x0 + 3 * bw, y1 - 20, { color: col.ink, size: 13, weight: 700, align: 'center' }); }
    if (s >= 4) { for (let i = 0; i < 9; i++) box(i, y2, col.s[2], '₹15', 0.4); text(ctx, '9 pens', x0 + 4.5 * bw, y2 - 10, { color: col.ink, size: 13, weight: 700, align: 'center' }); }
    if (s >= 3 && s < 4) text(ctx, '1 pen = ₹15', w / 2, y2 + 18, { color: col.s[2], size: 15, weight: 700, align: 'center' });
    if (s >= 5) text(ctx, '9 × 15 = ₹135', w / 2, y2 + 66, { color: col.s[2], size: 16, weight: 700, align: 'center' });
  };
  cv.redraw();
  return { step(i) { s = Math.min(i, 5); cv.redraw(); } };
}
