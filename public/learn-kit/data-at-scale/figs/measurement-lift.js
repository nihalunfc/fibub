// 7.3 Attributed versus incremental: 900,000 exposed shoppers (4.0% bought) and a 100,000 holdout (3.2% bought).
// Attribution credits all exposed buyers; the holdout shows how many would have bought anyway; the gap is the lift.
import { canvas, text, title, line } from '../../kit.js';

const NAMES = ['Attribution: every exposed buyer is credited', 'The holdout saw no ads, and 3.2% still bought', 'Only the gap was caused by the ads', 'Attributed ROAS vs incremental ROAS'];

export default function (host) {
  const cv = canvas(host, { aspect: 0.62, max: 350, min: 260, label: 'Bars comparing exposed and holdout purchase rates, showing the incremental lift' });
  let s = 0;
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, NAMES[s], col) + 14;
    const base = h - 50, H = base - top - 20, Y = (p) => base - H * p / 4.5;
    const bw = Math.min(90, w / 5), x1 = w * 0.25 - bw / 2, x2 = w * 0.6 - bw / 2;
    line(ctx, [[20, base], [w - 20, base]], col.muted, 1);
    if (s === 0) { ctx.fillStyle = col.s[0]; ctx.fillRect(x1, Y(4), bw, base - Y(4)); }
    else {
      ctx.fillStyle = col.muted; ctx.fillRect(x1, Y(3.2), bw, base - Y(3.2));
      ctx.fillStyle = col.s[2]; ctx.fillRect(x1, Y(4), bw, Y(3.2) - Y(4));
    }
    text(ctx, '4.0%', x1 + bw / 2, Y(4) - 10, { color: col.ink, size: 12, weight: 700, align: 'center' });
    text(ctx, 'Exposed', x1 + bw / 2, base + 13, { color: col.ink, size: 12, weight: 700, align: 'center' });
    text(ctx, '900,000 shoppers', x1 + bw / 2, base + 27, { color: col.muted, size: 10.5, align: 'center' });
    if (s >= 1) {
      ctx.fillStyle = col.muted; ctx.fillRect(x2, Y(3.2), bw, base - Y(3.2));
      text(ctx, '3.2%', x2 + bw / 2, Y(3.2) - 10, { color: col.ink, size: 12, weight: 700, align: 'center' });
      text(ctx, 'Holdout', x2 + bw / 2, base + 13, { color: col.ink, size: 12, weight: 700, align: 'center' });
      text(ctx, '100,000 shoppers', x2 + bw / 2, base + 27, { color: col.muted, size: 10.5, align: 'center' });
      line(ctx, [[x1, Y(3.2)], [x2 + bw, Y(3.2)]], col.ink, 1.5, [5, 4]);
    }
    if (s === 0) text(ctx, '36,000 buyers credited', x1 + bw + 10, Y(2.4), { color: col.s[0], size: 11.5, weight: 700 });
    if (s >= 2) text(ctx, '+0.8 points = 7,200 extra buyers', x1 + bw + 8, Y(4) - 2, { color: col.s[2], size: 11.5, weight: 700 });
    if (s === 2) text(ctx, 'The other 28,800 would have bought anyway', 10, h - 6, { color: col.muted, size: 11.5, base: 'bottom' });
    if (s === 3) text(ctx, 'Spend $40,000: ROAS 10.8, but iROAS = 7,200 × $12 ÷ $40,000 = 2.2', 10, h - 6, { color: col.ink, size: 11.5, weight: 700, base: 'bottom' });
  };
  cv.redraw();
  return { step(i) { s = i; cv.redraw(); } };
}
