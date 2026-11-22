// 5.7 Mean-field ordering. Left view: the graphical solution of m = tanh(m T_c/T) (line y = m against the tanh curve).
// Right view: the resulting spontaneous magnetisation m(T), with the exact 2D Ising (Onsager-Yang) curve for comparison,
// in units of each model's own T_c.
import { canvas, axes, line, row, slider, choice, readout, title, text, dot } from '../../kit.js';

const mf = (t) => { if (t >= 1) return 0; let m = 1; for (let i = 0; i < 3000; i++) m = Math.tanh(m / t); return m; };
const onsager = (t) => { if (t >= 1) return 0; const K = Math.log(1 + Math.SQRT2) / 2 / t; const s = Math.sinh(2 * K); return Math.pow(1 - Math.pow(s, -4), 1 / 8); };

export default function (host) {
  const cv = canvas(host, { aspect: 0.62, max: 400, min: 260, label: 'Mean-field magnetisation: graphical solution and order parameter against temperature' });
  let t = 0.8, view = 'm';
  const ctl = row(host);
  slider(ctl, { label: 'Temperature T/T_c', min: 0.05, max: 1.5, step: 0.01, value: t, fmt: (v) => v.toFixed(2), oninput: (v) => { t = v; cv.redraw(); show(); } });
  choice(ctl, 'View', [['m', 'm(T)'], ['g', 'Graphical solution']], view, (v) => { view = v; cv.redraw(); });
  const out = readout(host);
  const show = () => {
    const m = mf(t), o = onsager(t);
    out.innerHTML = `T = ${t.toFixed(2)} T<sub>c</sub>: mean-field m = <b>${m.toFixed(3)}</b>${t < 1 ? `, near T<sub>c</sub> ≈ √(3(1 − T/T<sub>c</sub>)) = ${Math.sqrt(3 * (1 - t)).toFixed(3)} (β = 1/2)` : ''}; exact 2D Ising m = <b>${o.toFixed(3)}</b> (β = 1/8, so it rises far more steeply). Above T<sub>c</sub> the slope of tanh at the origin is below 1 and only m = 0 survives.`;
  };
  cv.draw = (ctx, w, h, col) => {
    if (view === 'g') {
      const ax = axes(ctx, w, h, col, { x: [0, 1.6], y: [0, 1.2], xlabel: 'm', ylabel: 'y', t: 34 });
      title(ctx, 'Self-consistency: y = m meets y = tanh(m T_c/T)', col);
      ctx.save(); ax.clip();
      const pts = []; for (let i = 0; i <= 300; i++) { const m = (i / 300) * 1.6; pts.push([ax.X(m), ax.Y(Math.tanh(m / t))]); }
      line(ctx, pts, col.s[0], 2.4);
      line(ctx, [[ax.X(0), ax.Y(0)], [ax.X(1.2), ax.Y(1.2)]], col.s[2], 2);
      line(ctx, [[ax.X(0), ax.Y(0)], [ax.X(1.2), ax.Y(1.2 / t)]], col.muted, 1, [4, 4]);
      const m = mf(t); dot(ctx, ax.X(m), ax.Y(m), 5, col.s[3]);
      ctx.restore();
      text(ctx, 'tanh(m T_c/T)', ax.R - 6, ax.T + 14, { color: col.s[0], size: 11, align: 'right', halo: col.panel });
      text(ctx, 'y = m', ax.R - 6, ax.T + 29, { color: col.s[2], size: 11, align: 'right', halo: col.panel });
      text(ctx, 'dashed: slope T_c/T at m = 0', ax.R - 6, ax.T + 44, { color: col.muted, size: 11, align: 'right', halo: col.panel });
      return;
    }
    const ax = axes(ctx, w, h, col, { x: [0, 1.5], y: [0, 1.1], xlabel: 'temperature T/T_c', ylabel: 'order parameter m', t: 34 });
    title(ctx, 'Spontaneous magnetisation: mean field vs exact 2D Ising', col);
    ctx.save(); ax.clip();
    const a = [], b = [];
    for (let i = 1; i <= 400; i++) { const tt = (i / 400) * 1.5; a.push([ax.X(tt), ax.Y(mf(tt))]); b.push([ax.X(tt), ax.Y(onsager(tt))]); }
    line(ctx, b, col.s[4], 2, [6, 4]); line(ctx, a, col.s[0], 2.5);
    line(ctx, [[ax.X(t), ax.Y(0)], [ax.X(t), ax.Y(1.1)]], col.muted, 1, [3, 3]);
    dot(ctx, ax.X(t), ax.Y(mf(t)), 4, col.s[0]);
    ctx.restore();
    text(ctx, 'mean field (β = 1/2)', ax.R - 6, ax.T + 14, { color: col.s[0], size: 11, align: 'right', halo: col.panel });
    text(ctx, 'exact 2D Ising (β = 1/8)', ax.R - 6, ax.T + 29, { color: col.s[4], size: 11, align: 'right', halo: col.panel });
  };
  cv.redraw(); show();
}
