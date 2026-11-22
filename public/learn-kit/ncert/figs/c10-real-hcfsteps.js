// Class 10 Real Numbers (step player): HCF and LCM of 72 and 120 by prime factorisation.
// 72 = 2^3 x 3^2, 120 = 2^3 x 3 x 5. HCF takes the smallest power of each common prime (24); LCM the greatest power of every prime (360).
import { canvas, text, title, line, dot } from '../../kit.js';

const A = [2, 2, 2, 3, 3, 0], B = [2, 2, 2, 3, 0, 5];
const MSG = ['Find the HCF and LCM of 72 and 120.', 'Break each number into primes: 72 = 2×2×2×3×3 and 120 = 2×2×2×3×5. Line the same primes up in columns.', 'Primes that appear in both rows (joined by lines) are common: 2, 2, 2 and 3.', 'HCF = the common primes multiplied: 2 × 2 × 2 × 3 = 24.', 'LCM = every column once: the common ones, plus the 3 only 72 has and the 5 only 120 has: 2×2×2×3×3×5 = 360.', 'Check: HCF × LCM = 24 × 360 = 8640 and 72 × 120 = 8640. They match.'];
export default function (host) {
  let s = 0;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 300, label: 'Prime factors of 72 and 120 lined up in columns to find the HCF and LCM' });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'HCF and LCM of 72 and 120', col) + 20, gap = Math.min(40, (w - 90) / 6), x0 = 60 + gap / 2, y1 = top + 46, y2 = y1 + 70;
    text(ctx, '72', 8, y1, { color: col.s[0], size: 15, weight: 700 }); text(ctx, '120', 8, y2, { color: col.s[1], size: 15, weight: 700 });
    if (s >= 1) for (let i = 0; i < 6; i++) {
      const x = x0 + i * gap, common = i < 4;
      if (s >= 2 && common) line(ctx, [[x, y1 + 13], [x, y2 - 13]], col.s[3], 2);
      const tok = (v, y, tone) => { if (!v) return; const on = s < 2 || common || s >= 4; dot(ctx, x, y, 13, on ? col.panel : col.soft, common && s >= 2 ? col.s[3] : tone); text(ctx, String(v), x, y, { color: on ? col.ink : col.muted, size: 13, weight: 700, align: 'center' }); };
      tok(A[i], y1, col.s[0]); tok(B[i], y2, col.s[1]);
    }
    const br = (i0, i1, y, label, tone) => { const xa = x0 + i0 * gap - 17, xb = x0 + i1 * gap + 17; line(ctx, [[xa, y - 5], [xa, y], [xb, y], [xb, y - 5]], tone, 2); text(ctx, label, (xa + xb) / 2, y + 14, { color: tone, size: 13, weight: 700, align: 'center' }); };
    if (s === 3) br(0, 3, y2 + 26, 'HCF = 24', col.s[3]);
    if (s === 4) br(0, 5, y2 + 26, 'LCM = 360', col.s[2]);
    if (s === 5) text(ctx, '24 × 360 = 72 × 120 = 8640', w / 2, y2 + 34, { color: col.s[3], size: 14, weight: 700, align: 'center' });
    const words = MSG[Math.min(s, 5)].split(' '); let a = '', ls = [];
    for (const wd of words) { if ((a + ' ' + wd).length > Math.floor(w / 6.4) && a) { ls.push(a); a = wd; } else a = a ? a + ' ' + wd : wd; }
    ls.push(a); ls.forEach((l, i) => text(ctx, l, w / 2, h - 12 - (ls.length - 1 - i) * 16, { color: col.ink, size: 12, align: 'center' }));
  };
  cv.redraw();
  return { step(i) { s = i; cv.redraw(); } };
}
