// Class 8 A Square and a Cube (step player): square root by prime factors. Split 1764 into primes, put equal primes in pairs,
// take one from each pair and multiply: 1764 = 2x2 x 3x3 x 7x7, so the root is 2 x 3 x 7 = 42.
import { canvas, text, title } from '../../kit.js';
import { note } from './c8-lib.js';

const F = [2, 2, 3, 3, 7, 7];
export default function (host) {
  let s = 0;
  const cv = canvas(host, { aspect: 1, max: 440, min: 300, label: 'Prime factors of 1764 put into pairs to find its square root' });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Square root of 1764 by prime factors', col), k = Math.min(s, 1) ? F.length : 0;
    // division ladder
    let v = 1764; const rows = [[2, 1764], [2, 882], [3, 441], [3, 147], [7, 49], [7, 7], [1, 1]], rh = Math.min(24, (h - top - 130) / 7);
    rows.forEach((r, i) => {
      const y = top + 16 + i * rh;
      if (s >= 1 || i === 0) {
        text(ctx, r[0] === 1 ? '' : String(r[0]), w / 2 - 36, y, { color: col.s[0], size: 14, weight: 700, align: 'right' });
        ctx.strokeStyle = col.muted; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(w / 2 - 28, y - rh / 2 + 2); ctx.lineTo(w / 2 - 28, y + rh / 2 - 2); ctx.stroke();
        text(ctx, String(r[1]), w / 2 - 20, y, { color: col.ink, size: 14, align: 'left' });
      }
    });
    if (s === 0) { text(ctx, 'Divide 1764 by small primes: 2, 3, 7 …', w / 2, top + 16 + 3 * rh, { color: col.muted, size: 12, align: 'center' }); }
    // chips
    const y = h - 108, cw = Math.min(40, (w - 30) / 6.4), x0 = (w - (cw * 6 + (s >= 2 ? 24 : 0))) / 2;
    if (s >= 1) F.forEach((f, i) => {
      const gx = x0 + i * cw + (s >= 2 ? Math.floor(i / 2) * 8 : 0), kept = i % 2 === 0;
      ctx.fillStyle = s >= 3 && !kept ? col.soft : col.s[[0, 0, 2, 2, 4, 4][i]]; ctx.globalAlpha = s >= 3 && !kept ? 0.6 : 0.9; ctx.fillRect(gx, y, cw - 4, 30); ctx.globalAlpha = 1;
      text(ctx, String(f), gx + (cw - 4) / 2, y + 15, { color: col.panel, size: 15, weight: 700, align: 'center' });
    });
    if (s >= 2) for (let g = 0; g < 3; g++) { const gx = x0 + g * (2 * cw + 8) - 2; ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.strokeRect(gx, y - 4, 2 * cw, 38); }
    if (s >= 4) text(ctx, '√1764 = 2 × 3 × 7 = 42', w / 2, y + 52, { color: col.s[2], size: 15, weight: 700, align: 'center' });
    note(ctx, ['Write 1764 and divide it by small primes again and again.', 'The ladder ends at 1. The primes are 2, 2, 3, 3, 7, 7.', 'Put equal primes in pairs: (2 2) (3 3) (7 7). No prime is left alone, so it is a perfect square.', 'Take one prime from each pair: 2, 3, 7.', 'Multiply them: 2 × 3 × 7 = 42. Check: 42 × 42 = 1764.'][Math.min(s, 4)], w, h, col);
  };
  cv.redraw();
  return { step(i) { s = Math.min(i, 4); cv.redraw(); } };
}
