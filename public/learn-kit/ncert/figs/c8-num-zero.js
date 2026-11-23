// Class 8 A Story of Numbers: why zero matters. Without a symbol for an empty place, the numbers 25, 205 and 250 would all look
// like "2 5". With a zero as a placeholder each has its own clear name. Toggle the zero on and off.
import { canvas, text, title, row, choice } from '../../kit.js';

export default function (host) {
  let zero = false;
  const cv = canvas(host, { aspect: 0.62, max: 440, min: 240, label: 'Three numbers that look the same without a zero placeholder' });
  const ctl = row(host);
  choice(ctl, 'Zero symbol', [[false, 'Take it away'], [true, 'Use it']], zero, (v) => { zero = v; cv.redraw(); });
  const N = [['25', '2 tens and 5 ones'], ['205', '2 hundreds, 0 tens, 5 ones'], ['250', '2 hundreds, 5 tens, 0 ones']];
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'What if there were no zero?', col), rh = (h - top - 50) / 3;
    N.forEach(([s, t], i) => {
      const y = top + 14 + i * rh + rh / 2, disp = zero ? s.split('') : s.split('').map((c) => (c === '0' ? ' ' : c)).join('').split('');
      disp.forEach((c, j) => text(ctx, c, 40 + j * 22, y, { color: c === ' ' ? col.line : col.ink, size: 26, weight: 700, align: 'center' }));
      text(ctx, t, 120, y, { color: col.muted, size: 11.5 });
      if (!zero && s.includes('0')) text(ctx, '?', 14, y, { color: col.s[3], size: 18, weight: 700, align: 'center' });
    });
    text(ctx, zero ? 'Each number is clear: the 0 keeps the empty place.' : 'All three look like “2 5”: you cannot tell them apart!', w / 2, h - 18, { color: zero ? col.s[2] : col.s[3], size: 12.5, weight: 700, align: 'center' });
  };
  cv.redraw();
}
