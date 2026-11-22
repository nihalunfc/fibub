// 6.8 Radioactive decay: every half-life, half of what is left decays. Change the half-life and watch the curve.
import { canvas, axes, line, dot, text, row, slider, readout } from '../../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.55, max: 320, min: 220, label: 'Graph of nuclei left against time, halving every half-life' });
  let T = 5, t = 10;
  const ctl = row(host);
  slider(ctl, { label: 'Half-life', min: 1, max: 10, step: 1, value: T, fmt: (v) => `${v} days`, oninput: (v) => { T = v; go(); } });
  slider(ctl, { label: 'Time passed', min: 0, max: 30, step: 1, value: t, fmt: (v) => `${v} days`, oninput: (v) => { t = v; go(); } });
  const out = readout(host);
  const N = (x) => 1000 * 0.5 ** (x / T);
  const go = () => { cv.redraw(); out.innerHTML = `After ${t} days = ${(t / T).toFixed(2)} half-lives, <b>${Math.round(N(t))}</b> of 1,000 nuclei are left. Decay constant λ = 0.693 ÷ ${T} = ${(0.693 / T).toFixed(3)} per day.`; };
  cv.draw = (ctx, w, h, col) => {
    const ax = axes(ctx, w, h, col, { x: [0, 30], y: [0, 1000], xlabel: 'days', ylabel: 'nuclei left' });
    line(ctx, Array.from({ length: 121 }, (_, i) => [ax.X(i / 4), ax.Y(N(i / 4))]), col.s[0], 2.5);
    for (let k = 1; k * T <= 30 && k <= 6; k++) { line(ctx, [[ax.X(k * T), ax.Y(0)], [ax.X(k * T), ax.Y(N(k * T))]], col.line, 1, [3, 3]); text(ctx, `${k}T`, ax.X(k * T), ax.Y(N(k * T)) - 10, { color: col.muted, size: 10, align: 'center' }); }
    dot(ctx, ax.X(t), ax.Y(N(t)), 5, col.s[3]);
  };
  go();
}
