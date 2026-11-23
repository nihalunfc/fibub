// Class 11 Maths, Permutations: why n! counts the ways to arrange n different things in a row.
// Fill the seats one at a time: n people can take the first seat, n − 1 the second, and so on down to 1.
// Multiplying the numbers of choices gives n × (n−1) × ... × 1 = n!.
import { canvas, text, title, dot } from '../../kit.js';

const NAMES = ['A', 'B', 'C', 'D'];
export default function (host) {
  const cv = canvas(host, { aspect: 0.7, max: 440, min: 270, label: 'Four seats filled one by one with 4, 3, 2 then 1 choices' });
  let s = 0;
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Arrange A, B, C, D in a row of 4 seats', col), cw = Math.min(70, (w - 40) / 4), x0 = (w - 4 * cw) / 2, y = top + 36, left = [0, 1, 2, 3];
    for (let i = 0; i < 4; i++) {
      const filled = i < s, x = x0 + i * cw;
      ctx.strokeStyle = filled ? col.s[0] : col.muted; ctx.lineWidth = 2; ctx.strokeRect(x + 4, y, cw - 8, cw - 8);
      text(ctx, 'seat ' + (i + 1), x + cw / 2, y - 10, { color: col.muted, size: 10.5, align: 'center' });
      if (filled) { text(ctx, NAMES[i], x + cw / 2, y + (cw - 8) / 2, { color: col.s[0], size: 22, weight: 700, align: 'center' }); }
    }
    const k = [4, 3, 2, 1]; let prod = 1;
    for (let i = 0; i < Math.min(s + 1, 4); i++) {
      const x = x0 + i * cw + cw / 2, y2 = y + cw + 30;
      text(ctx, String(k[i]), x, y2, { color: i === s ? col.s[1] : col.ink, size: 28, weight: 700, align: 'center' });
      text(ctx, i === s ? 'choices now' : 'choices', x, y2 + 24, { color: col.muted, size: 10.5, align: 'center' });
    }
    for (let i = 0; i < Math.min(s + 1, 4); i++) prod *= k[i];
    text(ctx, k.slice(0, Math.min(s + 1, 4)).join(' × ') + ' = ' + prod, w / 2, h - 36, { color: col.ink, size: 18, weight: 700, align: 'center' });
    text(ctx, s >= 3 ? '4! = 24 arrangements' : 'keep multiplying the choices', w / 2, h - 14, { color: col.s[0], size: 12, weight: 700, align: 'center' });
  };
  cv.redraw();
  return { step(i) { s = Math.min(Math.max(i, 0), 4); if (s > 3) s = 3; cv.redraw(); } };
}
