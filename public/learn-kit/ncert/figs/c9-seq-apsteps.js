// Class 9 Sequences (step player): finding the nth term of the AP 3, 7, 11, 15, ... Each term is the one before plus
// d = 4, so term n is the first term plus (n - 1) lots of d: a_n = a + (n - 1)d. The 20th term is 3 + 19 x 4 = 79.
import { canvas, text, title } from '../../kit.js';
import { note } from './c9-seq-lib.js';

const N = ['The sequence 3, 7, 11, 15, ... goes up by the same amount each time.', 'The common difference: d = 7 − 3 = 4, and 11 − 7 = 4, and 15 − 11 = 4. The difference is constant, so this is an AP.', 'Build the terms: a₁ = 3, a₂ = 3 + 4, a₃ = 3 + 2 × 4, a₄ = 3 + 3 × 4.', 'Spot the pattern: the nth term has (n − 1) fours added to the first term. So aₙ = a + (n − 1) d.', 'Here aₙ = 3 + (n − 1) × 4 = 4n − 1. Check: n = 4 gives 15. ✓', 'The 20th term: a₂₀ = 3 + 19 × 4 = 79. No need to write out all 20 terms.'];
export default function (host) {
  let s = 0;
  const cv = canvas(host, { aspect: 1.0, max: 440, min: 290, label: 'Working out the nth term formula of an arithmetic progression from 3, 7, 11, 15' });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'The nth term of an AP', col), bw = Math.min(70, (w - 24) / 4), ox = (w - bw * 4) / 2, y = top + 34;
    [3, 7, 11, 15].forEach((v, i) => {
      const x = ox + i * bw + bw / 2, hl = s === 4 && i === 3;
      ctx.fillStyle = hl ? col.s[2] : col.s[0]; ctx.globalAlpha = 0.28 + i * 0.1; ctx.fillRect(ox + i * bw + 3, y + 70 - v * 4.4, bw - 6, v * 4.4 + 0); ctx.globalAlpha = 1;
      text(ctx, String(v), x, y + 70 - v * 4.4 - 10, { color: col.ink, size: 14, weight: 700, align: 'center' });
      text(ctx, 'a' + ['₁', '₂', '₃', '₄'][i], x, y + 84, { color: col.muted, size: 12, align: 'center' });
      if (s >= 1 && i < 3) { text(ctx, '+4', x + bw / 2, y + 40, { color: col.s[2], size: 13, weight: 700, align: 'center' }); }
      if (s >= 2) text(ctx, i === 0 ? '3' : '3 + ' + (i === 1 ? '4' : i + ' × 4'), x, y + 104, { color: col.s[0], size: 10.5, weight: 700, align: 'center' });
    });
    if (s >= 3) text(ctx, 'aₙ = a + (n − 1) d', w / 2, y + 124, { color: col.s[3], size: 16, weight: 700, align: 'center' });
    if (s >= 4) text(ctx, 'aₙ = 4n − 1', w / 2, y + 148, { color: col.s[2], size: 15, weight: 700, align: 'center' });
    if (s >= 5) text(ctx, 'a₂₀ = 3 + 19 × 4 = 79', w / 2, y + 172, { color: col.ink, size: 15, weight: 700, align: 'center' });
    note(ctx, N[s], w, h, col);
  };
  cv.redraw();
  return { step(i) { s = Math.min(i, 5); cv.redraw(); } };
}
