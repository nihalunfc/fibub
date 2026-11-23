// Class 8 Algebra Play (step player): solving an equation with x on both sides, 5x - 3 = 2x + 9.
// Get all the x on one side, all the numbers on the other, doing the same thing to both sides each time, then check.
import { canvas, text, title } from '../../kit.js';
import { note } from './c8-prop2-lib.js';

const L = [['5x − 3 = 2x + 9', ''], ['3x − 3 = 9', 'subtract 2x from both sides'], ['3x = 12', 'add 3 to both sides'], ['x = 4', 'divide both sides by 3'], ['5(4) − 3 = 17 and 2(4) + 9 = 17', 'check in the original equation']];
const N = ['We want x alone. First move the x terms to one side.', 'Take 2x from both sides. The x terms are now only on the left.', 'Add 3 to both sides to clear the −3. Now only numbers are on the right.', 'Divide both sides by 3. One x equals 4.', 'Put x = 4 back in the original equation. Both sides are 17, so x = 4 is right.'];
export default function (host) {
  let s = 0;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 290, label: 'Solving 5x minus 3 equals 2x plus 9 in steps' });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Solve: 5x − 3 = 2x + 9', col), dy = Math.min(44, (h - top - 80) / 5);
    L.forEach(([eq, op], i) => { if (i > s) return; const y = top + 26 + i * dy, cur = i === s; text(ctx, eq, w / 2, y, { color: cur ? col.s[0] : col.ink, size: i === 4 ? 13 : 17, weight: cur ? 700 : 500, align: 'center' }); if (op) text(ctx, '↓ ' + op, w / 2, y - dy / 2 + 4, { color: col.s[3], size: 11, weight: 600, align: 'center' }); });
    if (s === 4) text(ctx, '✓', w - 24, top + 26 + 4 * dy, { color: col.s[2], size: 20, weight: 700, align: 'center' });
    note(ctx, N[s], w, h, col);
  };
  cv.redraw();
  return { step(i) { s = Math.min(i, 4); cv.redraw(); } };
}
