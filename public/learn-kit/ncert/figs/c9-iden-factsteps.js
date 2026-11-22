// Class 9 Identities (step player): factorising 4x^2 - 25 with a^2 - b^2 = (a + b)(a - b), then x^2 + 10x + 25 with (a + b)^2.
// The recipe: spot the pattern, name a and b, write the factors, and check by expanding.
import { canvas, text, title } from '../../kit.js';

const L = [
  ['4x² − 25', 'Is it a difference of two squares?', 0],
  ['4x² − 25 = (2x)² − 5²', 'Write each term as a square: a = 2x, b = 5', 0],
  ['(2x)² − 5² = (a + b)(a − b)', 'Use a² − b² = (a + b)(a − b)', 0],
  ['= (2x + 5)(2x − 5)', 'Factorised', 0],
  ['Check: (2x + 5)(2x − 5) = 4x² − 25 ✓', 'Expand the answer to check', 0],
  ['x² + 10x + 25 = x² + 2(x)(5) + 5²', 'Next: perfect square? a = x, b = 5, middle = 2ab', 1],
  ['= (x + 5)²', 'Use a² + 2ab + b² = (a + b)²', 1],
];
export default function (host) {
  let s = 0;
  const cv = canvas(host, { aspect: 0.92, max: 440, min: 270, label: 'Factorising 4x squared minus 25 and x squared plus 10x plus 25 with identities, step by step' });
  cv.draw = (ctx, w, h, col) => {
    const t = title(ctx, 'Factorising with identities', col);
    for (let i = 0; i <= s; i++) {
      const [eq, why, g] = L[i], y = t + 30 + i * 38, cur = i === s;
      text(ctx, eq, 14, y, { color: cur ? col.ink : col.muted, size: cur ? 14 : 12.5, weight: cur ? 700 : 500 });
      text(ctx, why, 14, y + 17, { color: cur ? col.s[0] : col.muted, size: 11.5, weight: cur ? 700 : 400 });
    }
  };
  cv.redraw();
  return { step(i) { s = Math.min(i, 6); cv.redraw(); } };
}
