// Class 9 Sequences (step player, a look ahead to Class 10): adding 1 + 2 + ... + 10 by pairing. Write the numbers
// forwards and backwards; every pair sums to 11 and there are 10 pairs, which counts every number twice, so the total
// is 10 x 11 / 2 = 55. The same idea sums any AP.
import { canvas, text, title } from '../../kit.js';
import { note } from './c9-seq-lib.js';

const N = ['Add 1 + 2 + 3 + ... + 10. Adding one by one is slow. Is there a quicker way?', 'Write the numbers again underneath, but backwards: 10, 9, 8, ... 1.', 'Add each column: 1 + 10, 2 + 9, 3 + 8, ... Every pair makes 11.', 'There are 10 columns, each 11. Together that is 10 × 11 = 110.', 'But we wrote the list twice, so 110 counts every number twice. The sum is 110 ÷ 2 = 55.', 'Any AP works the same way: sum = n ÷ 2 × (first + last). Here 10 ÷ 2 × (1 + 10) = 55.'];
export default function (host) {
  let s = 0;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 290, label: 'Adding the numbers 1 to 10 by writing them forwards and backwards and adding the columns' });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Gauss’s pairing trick: 1 + 2 + ... + 10', col), cw = (w - 24) / 10, x = (i) => 12 + cw * (i + 0.5), y = top + 34;
    for (let i = 0; i < 10; i++) {
      text(ctx, String(i + 1), x(i), y, { color: col.s[0], size: 14, weight: 700, align: 'center' });
      if (s >= 1) text(ctx, String(10 - i), x(i), y + 28, { color: col.s[2], size: 14, weight: 700, align: 'center' });
      if (s >= 2) { ctx.strokeStyle = col.muted; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x(i) - cw * 0.35, y + 44); ctx.lineTo(x(i) + cw * 0.35, y + 44); ctx.stroke(); text(ctx, '11', x(i), y + 58, { color: col.s[3], size: 13, weight: 700, align: 'center' }); }
    }
    if (s >= 3) text(ctx, '10 × 11 = 110', w / 2, y + 100, { color: col.ink, size: 16, weight: 700, align: 'center' });
    if (s >= 4) text(ctx, '110 ÷ 2 = 55', w / 2, y + 128, { color: col.s[2], size: 18, weight: 700, align: 'center' });
    if (s >= 5) text(ctx, 'S = n/2 × (first + last)', w / 2, y + 156, { color: col.s[3], size: 14, weight: 700, align: 'center' });
    note(ctx, N[s], w, h, col);
  };
  cv.redraw();
  return { step(i) { s = Math.min(i, 5); cv.redraw(); } };
}
