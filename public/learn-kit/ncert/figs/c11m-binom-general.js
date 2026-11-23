// Class 11 Maths, Binomial Theorem: using the general term T(k+1) = nCk · a^(n−k) · b^k to find the term you want
// without expanding everything. Example: the coefficient of x² in (x + 2/x)⁶. Write the general term, simplify the
// power of x, set it equal to 2 to find k, and read off the coefficient.
import { canvas, text, title } from '../../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 280, label: 'Steps of finding the coefficient of x squared in (x + 2/x) to the sixth' });
  let s = 0;
  const L = [
    ['(x + 2/x)⁶', 'a = x, b = 2/x, n = 6'],
    ['T(k+1) = 6Ck · x^(6−k) · (2/x)^k', 'general term'],
    ['= 6Ck · 2^k · x^(6−k) · x^(−k)', 'split (2/x)^k'],
    ['= 6Ck · 2^k · x^(6−2k)', 'add the powers of x'],
    ['6 − 2k = 2  ⇒  k = 2', 'we want x²'],
    ['6C2 · 2² = 15 × 4 = 60', 'coefficient of x²'],
  ];
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Coefficient of x² in (x + 2/x)⁶', col);
    for (let i = 0; i <= s; i++) { const y = top + 24 + i * 38; text(ctx, L[i][0], 18, y, { color: i === s ? col.ink : col.muted, size: i === s ? 16 : 14.5, weight: i === s ? 700 : 500 }); text(ctx, L[i][1], 18, y + 16, { color: i === s ? col.s[0] : col.muted, size: 10.5 }); }
    if (s === 5) { ctx.strokeStyle = col.s[1]; ctx.lineWidth = 2; ctx.strokeRect(10, top + 24 + 5 * 38 - 15, w - 20, 38); }
  };
  cv.redraw();
  return { step(i) { s = Math.min(Math.max(i, 0), 5); cv.redraw(); } };
}
