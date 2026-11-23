// Class 8 Number Play (step player): reverse and add. Start with 87, add its reversal, and repeat until a palindrome appears:
// 87 + 78 = 165, 165 + 561 = 726, 726 + 627 = 1353, 1353 + 3531 = 4884 (a palindrome, after 4 additions).
import { canvas, text, title } from '../../kit.js';

export default function (host) {
  let s = 0;
  const rows = [[87, 78, 165], [165, 561, 726], [726, 627, 1353], [1353, 3531, 4884]];
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 270, label: 'Reverse and add steps from 87 to the palindrome 4884' });
  cv.draw = (ctx, w, h, col) => {
    const t = title(ctx, ['Pick a number: 87', 'Add its reverse', 'Do it again', 'Again', 'Again', 'Same forwards and backwards!'][s], col);
    const lh = Math.min(46, (h - t - 50) / 5);
    text(ctx, 'start', 16, t + 22, { color: col.muted, size: 12 }); text(ctx, '87', w - 16, t + 22, { color: col.ink, size: 20, weight: 700, align: 'right' });
    for (let i = 0; i < 4; i++) {
      if (s < i + 1 && !(i === 0 && s === 0 && false)) break;
      const [a, b, c] = rows[i], y = t + 22 + (i + 1) * lh, last = i === 3 && s >= 5;
      text(ctx, 'step ' + (i + 1), 16, y, { color: col.muted, size: 12 });
      text(ctx, a + ' + ' + b + ' =', w - 100, y, { color: col.ink, size: 15, align: 'right' });
      text(ctx, String(c), w - 16, y, { color: last ? col.s[2] : i === s - 1 ? col.s[0] : col.ink, size: 20, weight: 700, align: 'right' });
    }
    if (s >= 5) text(ctx, '4 8 8 4 reads the same both ways', w / 2, h - 16, { color: col.s[2], size: 14, weight: 700, align: 'center' });
  };
  cv.redraw();
  return { step(i) { s = Math.min(i, 5); cv.redraw(); } };
}
