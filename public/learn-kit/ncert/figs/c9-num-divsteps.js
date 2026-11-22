// Class 9 Numbers (step player): long division of 1 by 7. Each step multiplies the remainder by 10, divides by 7 and writes a digit.
// There are only 6 possible non-zero remainders (1 to 6), so one must come back: when it does, the digits repeat forever: 0.142857 142857...
import { canvas, text, title } from '../../kit.js';

export default function (host) {
  let s = 0;
  const cv = canvas(host, { aspect: 0.9, max: 440, min: 300, label: 'Long division of 1 by 7 shown step by step until the remainder 1 comes back and the digits 142857 repeat' });
  const rem = [1], dig = [];
  for (let i = 0; i < 7; i++) { const r = rem[i] * 10; dig.push(Math.floor(r / 7)); rem.push(r % 7); }
  cv.draw = (ctx, w, h, col) => {
    const t = title(ctx, '1 ÷ 7 by long division', col), n = Math.min(s, 7), rowH = 31;
    text(ctx, 'Start: remainder 1. Each step: ×10, ÷7, write the digit.', 10, t + 14, { color: col.muted, size: 11 });
    for (let i = 0; i < n; i++) {
      const y = t + 40 + i * rowH, r = rem[i] * 10, back = s >= 7 && i === 6;
      ctx.save(); ctx.fillStyle = back ? col.soft : col.panel; ctx.strokeStyle = back ? col.s[3] : col.line; ctx.lineWidth = back ? 2 : 1; ctx.beginPath(); ctx.roundRect(8, y - 12, w - 16, 26, 6); ctx.fill(); ctx.stroke(); ctx.restore();
      text(ctx, `${rem[i]} → ${r} ÷ 7 = ${dig[i]}, remainder ${rem[i + 1]}`, 16, y, { color: col.ink, size: 12.5, weight: 600 });
      text(ctx, 'digit ' + dig[i], w - 16, y, { color: col.s[0], size: 12.5, weight: 700, align: 'right' });
    }
    const shown = dig.slice(0, Math.min(n, 6)).join(''), yb = t + 40 + 7 * rowH + 6;
    text(ctx, '1/7 = 0.' + shown + (n < 6 ? '…' : ''), 10, yb, { color: col.ink, size: 15, weight: 700 });
    if (s >= 7) text(ctx, 'Remainder 1 is back: 142857 repeats forever', 10, yb + 24, { color: col.s[3], size: 13, weight: 700 });
  };
  cv.redraw();
  return { step(i) { s = Math.min(i, 7); cv.redraw(); } };
}
