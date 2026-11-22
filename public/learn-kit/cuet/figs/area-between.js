// 8.7 Area between y = x² and y = kx: slide k and watch the shaded strip area add up to k³/6.
import { canvas, axes, line, text, row, slider, readout } from '../../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.6, max: 320, min: 220, label: 'Shaded area between a parabola and a straight line' });
  let k = 2;
  const ctl = row(host);
  slider(ctl, { label: 'Slope k', min: 0.5, max: 4, step: 0.5, value: k, fmt: String, oninput: (v) => { k = v; go(); } });
  const out = readout(host);
  const go = () => { cv.redraw(); out.innerHTML = `They meet at x = 0 and x = ${k}. Area = ∫₀^${k} (${k}x − x²) dx = ${k}³/6 = <b>${(k ** 3 / 6).toFixed(3)}</b>. Double k and the area grows 8 times.`; };
  cv.draw = (ctx, w, h, col) => {
    const ax = axes(ctx, w, h, col, { x: [-0.5, 4.5], y: [-0.5, 17], xlabel: 'x', ylabel: 'y' });
    const n = 24, dx = k / n;
    ctx.fillStyle = col.soft;
    for (let i = 0; i < n; i++) { const x = i * dx + dx / 2; ctx.fillRect(ax.X(i * dx), ax.Y(k * x), ax.X(dx) - ax.X(0) - 1, ax.Y(x * x) - ax.Y(k * x)); }
    line(ctx, Array.from({ length: 81 }, (_, i) => { const x = -0.5 + (i / 80) * 4.6; return [ax.X(x), ax.Y(x * x)]; }), col.s[0], 2.5);
    const xe = Math.min(4.5, 17 / k); line(ctx, [[ax.X(-0.5), ax.Y(-0.5 * k)], [ax.X(xe), ax.Y(xe * k)]], col.s[3], 2.5);
    text(ctx, 'y = x²', ax.X(3.6), ax.Y(13), { color: col.s[0], size: 12, weight: 600 });
    text(ctx, `y = ${k}x`, ax.X(0.3), ax.Y(Math.min(16, 4.2 * k)), { color: col.s[3], size: 12, weight: 600 });
  };
  go();
}
