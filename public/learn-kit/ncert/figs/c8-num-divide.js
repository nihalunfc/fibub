// Class 8 A Story of Numbers (step player): change 45 into base 2 by dividing by 2 again and again and keeping the remainders.
// Reading the remainders from the last one up to the first gives 101101.
import { canvas, text, title } from '../../kit.js';
import { note } from './c8-lib.js';

const R = [[45, 22, 1], [22, 11, 0], [11, 5, 1], [5, 2, 1], [2, 1, 0], [1, 0, 1]];
export default function (host) {
  let s = 0;
  const cv = canvas(host, { aspect: 1, max: 440, min: 300, label: 'Repeated division of 45 by 2 with the remainders collected as binary digits' });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, '45 in binary by dividing by 2', col), k = Math.min(s, 6), rh = Math.min(30, (h - top - 90) / 7), x = w / 2 - 80;
    R.forEach((r, i) => {
      if (i >= k) return; const y = top + 20 + i * rh;
      text(ctx, `${r[0]} ÷ 2 = ${r[1]}`, x, y, { color: col.ink, size: 14 }); text(ctx, `remainder ${r[2]}`, x + 120, y, { color: col.s[3], size: 14, weight: 700 });
    });
    if (s >= 7) {
      text(ctx, 'Read the remainders from bottom to top:', w / 2, h - 80, { color: col.muted, size: 11.5, align: 'center' });
      '101101'.split('').forEach((c, i) => text(ctx, c, w / 2 + (i - 2.5) * 24, h - 58, { color: col.s[2], size: 22, weight: 700, align: 'center' }));
    } else if (k) text(ctx, `bits so far (bottom to top): ${R.slice(0, k).map((r) => r[2]).reverse().join('')}`, w / 2, h - 66, { color: col.muted, size: 12, align: 'center' });
    note(ctx, s === 0 ? 'Start with 45. Divide by 2, write the remainder, and repeat with the quotient.' : s < 6 ? `Step ${s}: ${R[s - 1][0]} ÷ 2 gives ${R[s - 1][1]} remainder ${R[s - 1][2]}.` : s === 6 ? 'Step 6: 1 ÷ 2 gives 0 remainder 1. The quotient is 0, so we stop.' : '45 = 101101 in base 2. Check: 32 + 8 + 4 + 1 = 45.', w, h, col);
  };
  cv.redraw();
  return { step(i) { s = Math.min(i, 7); cv.redraw(); } };
}
