// Class 8 Proportional Reasoning 2 (step player): work done together. Each person's part of the job per day adds up:
// A does 1/6 of the job a day, B does 1/12 a day, together 1/4 a day, so the whole job takes 4 days.
import { canvas, text, title } from '../../kit.js';
import { note } from './c8-prop2-lib.js';

const N = ['Asha paints a wall in 6 days. Bala paints the same wall in 12 days. How long do they take together?', 'In one day Asha does 1/6 of the wall. Shade 1/6 of the bar.', 'In one day Bala does 1/12 of the wall. Shade 1/12 of the bar.', 'Together in one day: 1/6 + 1/12 = 2/12 + 1/12 = 3/12 = 1/4 of the wall.', 'If they do 1/4 of the wall every day, the whole wall needs 1 ÷ 1/4 = 4 days.', 'Check: in 4 days Asha does 4/6 and Bala does 4/12. 4/6 + 4/12 = 8/12 + 4/12 = 1 whole wall. It matches.'];
export default function (host) {
  let s = 0;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 290, label: 'Two painters, their daily share of one wall added together' });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Work together: add the daily parts', col), L = 16, W = w - 32, bh = 24;
    const bar = (y, label, parts, colr) => {
      text(ctx, label, L, y - 10, { color: col.ink, size: 11.5, weight: 700 });
      for (let i = 0; i < 12; i++) { ctx.strokeStyle = col.muted; ctx.lineWidth = 1; ctx.strokeRect(L + (W / 12) * i, y, W / 12, bh); }
      parts.forEach(([a, b, c]) => { ctx.fillStyle = c; ctx.globalAlpha = 0.6; ctx.fillRect(L + (W / 12) * a, y, (W / 12) * (b - a), bh); ctx.globalAlpha = 1; });
    };
    const y0 = top + 28, sp = Math.min(62, (h - 104 - y0) / 3);
    bar(y0, 'Wall (12 equal parts)', [], col.s[0]);
    if (s >= 1) bar(y0 + sp, 'Asha, 1 day = 2 parts (1/6)', [[0, 2, col.s[0]]], col.s[0]);
    if (s >= 2) bar(y0 + 2 * sp, 'Bala, 1 day = 1 part (1/12)', [[2, 3, col.s[3]]], col.s[3]);
    if (s >= 3) { bar(y0 + 3 * sp, 'Together, 1 day = 3 parts (1/4)', [[0, 2, col.s[0]], [2, 3, col.s[3]]], col.s[2]); }
    note(ctx, N[s], w, h, col);
  };
  cv.redraw();
  return { step(i) { s = Math.min(i, 5); cv.redraw(); } };
}
