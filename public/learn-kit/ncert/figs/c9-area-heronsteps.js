// Class 9 Area (step player): Heron's formula on the triangle with sides 13, 14 and 15 metres.
// s = (13 + 14 + 15) / 2 = 21; area = sqrt(21 x 8 x 7 x 6) = sqrt(7056) = 84 m squared.
// Check: base 14 and height 12 give 1/2 x 14 x 12 = 84.
import { canvas, text, title, dot } from '../../kit.js';
import { note } from './c9-area-lib.js';

const N = ['A triangle with sides a = 13 m, b = 14 m and c = 15 m. We do not know a height.', 'Half the perimeter: s = (13 + 14 + 15) ÷ 2 = 42 ÷ 2 = 21 m.', 'Subtract each side from s: s − a = 8, s − b = 7, s − c = 6.', 'Multiply s and the three differences: 21 × 8 × 7 × 6 = 7056.', 'Take the square root: √7056 = 84. The area is 84 m².', 'Check with a height: base 14 and height 12 give ½ × 14 × 12 = 84 m². Heron’s formula needed only the sides.'];
export default function (host) {
  let s = 0;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 290, label: 'Heron formula worked step by step for a triangle with sides 13, 14 and 15' });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Heron’s formula: only the three sides', col), k = Math.min((w - 50) / 14, (h - top - 130) / 12), ox = (w - 14 * k) / 2, by = top + 24 + 12 * k;
    const Bp = [ox, by], Cp = [ox + 14 * k, by], Ap = [ox + 5 * k, by - 12 * k];
    ctx.fillStyle = col.s[0]; ctx.globalAlpha = s >= 4 ? 0.3 : 0.12; ctx.beginPath(); ctx.moveTo(...Bp); ctx.lineTo(...Cp); ctx.lineTo(...Ap); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1;
    ctx.strokeStyle = col.ink; ctx.lineWidth = 2.5; ctx.stroke();
    const lab = (t, x, y, c, dx = 0, dy = 0) => text(ctx, t, x + dx, y + dy, { color: c, size: 12, weight: 700, align: 'center', halo: col.panel });
    const showD = s >= 2 && s <= 3;
    lab(showD ? 'c = 15  (s − c = 6)' : 'c = 15', (Ap[0] + Cp[0]) / 2, (Ap[1] + Cp[1]) / 2, col.ink, 26, -6);
    lab(showD ? 'b = 14  (s − b = 7)' : 'b = 14', (Bp[0] + Cp[0]) / 2, by, col.ink, 0, 14);
    lab(showD ? 'a = 13  (s − a = 8)' : 'a = 13', (Bp[0] + Ap[0]) / 2, (Bp[1] + Ap[1]) / 2, col.ink, -34, -6);
    if (s >= 5) { ctx.strokeStyle = col.s[2]; ctx.lineWidth = 2; ctx.setLineDash([4, 3]); ctx.beginPath(); ctx.moveTo(Ap[0], Ap[1]); ctx.lineTo(Ap[0], by); ctx.stroke(); ctx.setLineDash([]); lab('h = 12', Ap[0], (Ap[1] + by) / 2, col.s[2], 28, 0); }
    if (s >= 1) text(ctx, 's = 21', w / 2, top + 14, { color: col.s[3], size: 13, weight: 700, align: 'center' });
    if (s === 3) text(ctx, '21 × 8 × 7 × 6 = 7056', w / 2, by - 4 * k, { color: col.s[2], size: 13, weight: 700, align: 'center', halo: col.panel });
    if (s >= 4) text(ctx, '84 m²', w / 2 - 10, by - 3.5 * k, { color: col.ink, size: 20, weight: 700, align: 'center', halo: col.panel });
    note(ctx, N[s], w, h, col);
  };
  cv.redraw();
  return { step(i) { s = Math.min(i, 5); cv.redraw(); } };
}
