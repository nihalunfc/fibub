// Class 9 Algorithms (step player): Euclid's division algorithm for HCF(252, 105). Divide, keep the remainder, and repeat with the
// divisor and the remainder until the remainder is 0. The last divisor is the HCF, since any number that divides both a and b also divides a - q*b.
import { canvas, text, title } from '../../kit.js';

const L = [
  ['HCF(252, 105)', 'Goal: the greatest number that divides both 252 and 105'],
  ['252 = 2 × 105 + 42', 'Divide 252 by 105: quotient 2, remainder 42 (not 0, so go on)'],
  ['105 = 2 × 42 + 21', 'Now the old divisor 105 becomes the number to divide, and the remainder 42 the new divisor'],
  ['42 = 2 × 21 + 0', 'Remainder 0: stop'],
  ['HCF = 21 (the last divisor)', 'Check: 252 = 12 × 21 and 105 = 5 × 21, and 12 and 5 have no common factor'],
];
export default function (host) {
  let s = 0;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 280, label: 'Euclid’s algorithm for the highest common factor, one division at a time' });
  cv.draw = (ctx, w, h, col) => {
    const t = title(ctx, 'Euclid’s algorithm: HCF(252, 105)', col);
    for (let i = 0; i <= s; i++) {
      const [a, b] = L[i], y = t + 30 + i * 46, cur = i === s, last = i === 4;
      if (i > 0 && i < 4) { ctx.save(); ctx.fillStyle = col.s[i % 2 ? 0 : 3]; ctx.globalAlpha = cur ? 0.25 : 0.1; ctx.fillRect(14, y - 17, w - 28, 36); ctx.restore(); }
      text(ctx, a, w / 2, y, { color: last ? col.s[2] : cur ? col.ink : col.muted, size: cur ? 17 : 14, weight: 700, align: 'center' });
      text(ctx, b, w / 2, y + 17, { color: cur ? col.s[0] : col.muted, size: 10.5, align: 'center' });
    }
    if (s >= 1 && s < 4) { text(ctx, 'divisor → next number, remainder → next divisor', w / 2, h - 14, { color: col.muted, size: 11, align: 'center' }); }
  };
  cv.redraw();
  return { step(i) { s = Math.min(i, 4); cv.redraw(); } };
}
