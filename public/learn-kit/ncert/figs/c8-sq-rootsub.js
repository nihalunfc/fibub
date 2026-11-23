// Class 8 A Square and a Cube (step player): square root by repeated subtraction. Take away 1, then 3, then 5, ... (the odd
// numbers). If you reach exactly 0 after k subtractions, the number is a perfect square and its root is k.
import { canvas, text, title } from '../../kit.js';
import { note } from './c8-lib.js';

const START = 36, ODD = [1, 3, 5, 7, 9, 11];
export default function (host) {
  let s = 0;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 300, label: 'Subtracting 1, 3, 5, 7, 9, 11 from 36 one after another until 0' });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Square root of 36 by subtracting odd numbers', col), k = Math.min(s, 6), y0 = top + 18, gap = Math.min(30, (h - top - 70) / 7);
    let v = START;
    text(ctx, String(START), w / 2 - 12, y0, { color: col.ink, size: 15, weight: 700, align: 'right' });
    for (let i = 0; i < k; i++) {
      const y = y0 + (i + 1) * gap, nv = v - ODD[i];
      text(ctx, `− ${ODD[i]}`, w / 2 - 12, y, { color: col.s[0], size: 14, align: 'right' });
      text(ctx, `= ${nv}`, w / 2 + 6, y, { color: nv === 0 ? col.s[2] : col.ink, size: 15, weight: 700 });
      text(ctx, `${i + 1}`, 28, y, { color: col.muted, size: 12, align: 'center' });
      v = nv;
    }
    if (k) text(ctx, 'count', 28, y0 - 2, { color: col.muted, size: 10, align: 'center' });
    note(ctx, s === 0 ? 'Start with 36. We subtract 1, 3, 5, 7 … one by one and count the subtractions.' : s < 6 ? `After ${k} subtraction${k > 1 ? 's' : ''} we are left with ${v}. Not zero yet, so go on.` : 'We reached exactly 0 after 6 subtractions, so 36 is a perfect square and √36 = 6.', w, h, col);
  };
  cv.redraw();
  return { step(i) { s = Math.min(i, 6); cv.redraw(); } };
}
