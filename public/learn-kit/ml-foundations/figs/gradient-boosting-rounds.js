// 6.6 Gradient boosting by hand: four houses (size, price in $1,000s), learning rate 0.5, stumps. Step
// through: the average, the residuals, round 1 (split at 80, half a step), round 2, and the shrinking error.
import { canvas, text, line, dot, axes, title } from '../../kit.js';

const X = [50, 60, 100, 110], Y = [100, 120, 200, 220];
const F = [[160, 160, 160, 160], [135, 135, 185, 185], [122.5, 122.5, 197.5, 197.5]];
export default function (host) {
  const cv = canvas(host, { aspect: 0.7, max: 360, min: 250, label: 'Four house prices and gradient boosting\'s predictions after each round' });
  let step = 0;
  const round = () => [0, 0, 1, 2, 2][step];
  cv.draw = (ctx, w, h, col) => {
    const k = round(), f = F[k];
    const top = title(ctx, ['Round 0: predict the average', 'The residuals: what is still wrong', 'Round 1: half a step towards a stump', 'Round 2: another half step', 'Error: 10,400 → 2,900 → 1,025'][step], col);
    const a = axes(ctx, w, h, col, { t: top + 8, l: 44, x: [40, 120], y: [80, 240], xt: [40, 60, 80, 100, 120], yt: [80, 120, 160, 200, 240], xlabel: 'size (m²)', ylabel: 'price ($1,000s)', fx: String, fy: String });
    if (k > 0) { line(ctx, [[a.X(80), a.T], [a.X(80), a.B]], col.muted, 1.2, [5, 4]); text(ctx, 'split at 80', a.X(80) + 4, a.Y(160), { color: col.muted, size: 10.5 }); }
    if (step >= 2) { const p = F[k - 1]; line(ctx, [[a.X(40), a.Y(p[0])], [a.X(80), a.Y(p[0])]], col.line, 2, [3, 3]); line(ctx, [[a.X(80), a.Y(p[3])], [a.X(120), a.Y(p[3])]], col.line, 2, [3, 3]); }
    line(ctx, [[a.X(40), a.Y(f[0])], [a.X(80), a.Y(f[0])]], col.s[1], 3);
    line(ctx, [[a.X(80), a.Y(f[3])], [a.X(120), a.Y(f[3])]], col.s[1], 3);
    if (step >= 1) X.forEach((x, i) => {
      line(ctx, [[a.X(x), a.Y(Y[i])], [a.X(x), a.Y(f[i])]], col.s[3], 2);
      const r = Y[i] - f[i];
      text(ctx, (r > 0 ? '+' : '') + r, a.X(x) + (i % 2 ? 6 : -6), a.Y((Y[i] + f[i]) / 2), { color: col.ink, size: 11, weight: 700, align: i % 2 ? 'left' : 'right', halo: col.panel });
    });
    X.forEach((x, i) => dot(ctx, a.X(x), a.Y(Y[i]), 5.5, col.s[0]));
    text(ctx, `prediction: ${f[0]} | ${f[3]}`, a.R - 4, a.B - 12, { color: col.ink, size: 11.5, weight: 600, align: 'right', halo: col.panel });
  };
  cv.redraw();
  return { step(i) { step = Math.min(4, i); cv.redraw(); } };
}
