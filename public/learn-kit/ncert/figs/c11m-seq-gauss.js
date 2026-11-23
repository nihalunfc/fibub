// Class 11 Maths, Sequences and Series: the sum of the first n natural numbers. Write 1 + 2 + ... + n, then the same sum
// backwards, and add column by column: every column gives n + 1, and there are n columns, so 2S = n(n + 1).
// Shown for n = 10: S = 10 × 11 / 2 = 55.
import { canvas, text, title } from '../../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 280, label: 'Writing 1 to 10 forwards and backwards and adding the columns' });
  let s = 0;
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Sum of 1 + 2 + ... + 10', col), cw = (w - 40) / 10, x0 = 20, y1 = top + 30;
    for (let i = 0; i < 10; i++) {
      const x = x0 + i * cw + cw / 2;
      text(ctx, String(i + 1), x, y1, { color: col.s[0], size: 15, weight: 700, align: 'center' });
      if (s >= 1) text(ctx, String(10 - i), x, y1 + 34, { color: col.s[1], size: 15, weight: 700, align: 'center' });
      if (s >= 2) { text(ctx, '11', x, y1 + 78, { color: col.ink, size: 15, weight: 700, align: 'center' }); }
    }
    text(ctx, 'S =', 4, y1, { color: col.muted, size: 11 });
    if (s >= 1) { text(ctx, 'S =', 4, y1 + 34, { color: col.muted, size: 11 }); ctx.strokeStyle = col.muted; ctx.beginPath(); ctx.moveTo(18, y1 + 54); ctx.lineTo(w - 18, y1 + 54); ctx.stroke(); }
    const msg = ['S = 1 + 2 + 3 + ... + 10', 'Write the same sum backwards underneath', 'Add column by column: each column is 11', '10 columns of 11, so 2S = 10 × 11 = 110', 'Divide by 2: S = 55'];
    text(ctx, msg[s], w / 2, h - 60, { color: col.ink, size: 13.5, weight: 700, align: 'center' });
    if (s >= 3) text(ctx, '2S = n(n + 1)', w / 2, y1 + 110, { color: col.s[2], size: 16, weight: 700, align: 'center' });
    if (s >= 4) text(ctx, 'S = n(n + 1) / 2', w / 2, h - 30, { color: col.s[2], size: 17, weight: 700, align: 'center' });
  };
  cv.redraw();
  return { step(i) { s = Math.min(Math.max(i, 0), 4); cv.redraw(); } };
}
