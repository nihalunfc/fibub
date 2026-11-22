// 5.4 Regression trees: ice-cream sales on six days. Step through: one flat guess (the mean), its errors,
// the split at 21 °C with a mean on each side, and the flat step that carries on into a heatwave.
import { canvas, text, line, dot, axes, title } from '../../kit.js';

const D = [[12, 4], [15, 5], [18, 6], [24, 14], [27, 16], [30, 18]];
export default function (host) {
  const cv = canvas(host, { aspect: 0.7, max: 360, min: 250, label: 'Ice-cream sales against temperature, with a regression tree\'s one split' });
  let step = 0;
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, ['One guess for every day: the mean', 'Its errors: variance 31.9', 'Split at 21 °C: variance 1.67', 'A 40 °C heatwave? Still 16'][step], col);
    const a = axes(ctx, w, h, col, { t: top + 8, l: 40, x: [10, 42], y: [0, 22], xt: [10, 20, 30, 40], yt: [0, 5, 10, 15, 20], xlabel: 'temperature (°C)', ylabel: 'sales (hundreds)', fx: String, fy: String });
    const seg = (x0, x1, y) => line(ctx, [[a.X(x0), a.Y(y)], [a.X(x1), a.Y(y)]], col.s[1], 3);
    if (step <= 1) {
      seg(10, 31, 10.5);
      text(ctx, 'mean 10.5', a.X(10.5), a.Y(10.5) - 10, { color: col.ink, size: 11, weight: 600, halo: col.panel });
      if (step === 1) D.forEach(([x, y]) => line(ctx, [[a.X(x), a.Y(y)], [a.X(x), a.Y(10.5)]], col.s[3], 1.5, [3, 3]));
    } else {
      line(ctx, [[a.X(21), a.T], [a.X(21), a.B]], col.muted, 1.5, [5, 4]);
      text(ctx, '21 °C', a.X(21) + 4, a.T + 8, { color: col.muted, size: 11 });
      seg(10, 21, 5); seg(21, step === 3 ? 42 : 31, 16);
      text(ctx, 'mean 5', a.X(11), a.Y(5) - 10, { color: col.ink, size: 11, weight: 600, halo: col.panel });
      text(ctx, 'mean 16', a.X(31), a.Y(16) + 12, { color: col.ink, size: 11, weight: 600, halo: col.panel });
      if (step === 3) {
        dot(ctx, a.X(40), a.Y(16), 6, col.panel, col.s[1]);
        text(ctx, 'still 16', a.X(40), a.Y(16) + 16, { color: col.ink, size: 11, weight: 700, align: 'right', halo: col.panel });
        line(ctx, [[a.X(30), a.Y(18)], [a.X(40), a.Y(21.5)]], col.muted, 1, [2, 4]);
        text(ctx, 'trend', a.X(37), a.Y(21.5), { color: col.muted, size: 10.5, align: 'center' });
      }
    }
    D.forEach(([x, y]) => dot(ctx, a.X(x), a.Y(y), 5, col.s[0]));
  };
  cv.redraw();
  return { step(i) { step = Math.min(3, i); cv.redraw(); } };
}
