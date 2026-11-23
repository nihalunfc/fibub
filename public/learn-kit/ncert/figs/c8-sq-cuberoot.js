// Class 8 A Square and a Cube (step player): cube root by prime factors. 1728 = 2^6 x 3^3. Put equal primes in groups of THREE,
// take one prime from each group and multiply: (2 2 2)(2 2 2)(3 3 3) gives 2 x 2 x 3 = 12.
import { canvas, text, title } from '../../kit.js';
import { note } from './c8-lib.js';

const F = [2, 2, 2, 2, 2, 2, 3, 3, 3];
export default function (host) {
  let s = 0;
  const cv = canvas(host, { aspect: 1, max: 440, min: 300, label: 'Prime factors of 1728 put into groups of three to find the cube root' });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Cube root of 1728 by prime factors', col);
    const rows = [[2, 1728], [2, 864], [2, 432], [2, 216], [2, 108], [2, 54], [3, 27], [3, 9], [3, 3], [1, 1]], rh = Math.min(18, (h - top - 130) / 10);
    rows.forEach((r, i) => {
      const y = top + 14 + i * rh;
      if (s >= 1 || i === 0) {
        text(ctx, r[0] === 1 ? '' : String(r[0]), w / 2 - 36, y, { color: col.s[0], size: 13, weight: 700, align: 'right' });
        ctx.strokeStyle = col.muted; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(w / 2 - 28, y - rh / 2 + 1); ctx.lineTo(w / 2 - 28, y + rh / 2 - 1); ctx.stroke();
        text(ctx, String(r[1]), w / 2 - 20, y, { color: col.ink, size: 13 });
      }
    });
    if (s === 0) text(ctx, 'Divide 1728 by small primes.', w / 2, top + 14 + 4 * rh, { color: col.muted, size: 12, align: 'center' });
    const cw = Math.min(30, (w - 40) / 9.6), y = h - 104, x0 = (w - (cw * 9 + 16)) / 2;
    if (s >= 1) F.forEach((f, i) => {
      const gx = x0 + i * cw + Math.floor(i / 3) * (s >= 2 ? 8 : 0), kept = i % 3 === 0;
      ctx.globalAlpha = s >= 3 && !kept ? 0.4 : 0.95; ctx.fillStyle = col.s[f === 2 ? Math.floor(i / 3) * 2 : 4]; ctx.fillRect(gx, y, cw - 3, 28); ctx.globalAlpha = 1;
      text(ctx, String(f), gx + (cw - 3) / 2, y + 14, { color: col.panel, size: 14, weight: 700, align: 'center' });
    });
    if (s >= 2) for (let g = 0; g < 3; g++) { ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.strokeRect(x0 + g * (3 * cw + 8) - 2, y - 4, 3 * cw, 36); }
    if (s >= 4) text(ctx, '∛1728 = 2 × 2 × 3 = 12', w / 2, y + 50, { color: col.s[2], size: 15, weight: 700, align: 'center' });
    note(ctx, ['Write 1728 as a ladder of divisions by primes.', 'The primes are 2 six times and 3 three times.', 'Group equal primes in threes: (2 2 2) (2 2 2) (3 3 3). Nothing is left over, so it is a perfect cube.', 'Take one prime from each group: 2, 2 and 3.', 'Multiply: 2 × 2 × 3 = 12. Check: 12 × 12 × 12 = 1728.'][Math.min(s, 4)], w, h, col);
  };
  cv.redraw();
  return { step(i) { s = Math.min(i, 4); cv.redraw(); } };
}
