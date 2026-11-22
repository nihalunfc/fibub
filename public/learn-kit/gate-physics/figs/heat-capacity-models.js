// 7.5 Einstein against Debye. C/3R against T/theta for the Einstein model (one frequency), the Debye model (omega^2
// spectrum up to a cutoff) and the T^3 law, on linear or log-log axes. The log-log view shows the T^3 straight line
// (slope 3) that Debye follows at low T, and the Einstein curve plunging exponentially below it. A marker reads off
// both models at the chosen temperature; the Einstein temperature can be set apart from the Debye temperature.
import { canvas, row, slider, choice, readout, axes, line, dot, text, fmt } from '../../kit.js';

const ein = (x) => (x > 700 ? 0 : x * x * Math.exp(x) / Math.expm1(x) ** 2);
const debye = (y) => { const n = 400, h = y / n; let s = 0; for (let i = 0; i <= n; i++) { const t = i * h || 1e-9; const e = t > 700 ? 0 : t ** 4 * Math.exp(t) / Math.expm1(t) ** 2; s += e * (i === 0 || i === n ? 1 : i % 2 ? 4 : 2); } return 3 / y ** 3 * s * h / 3; };
const T3 = 4 * Math.PI ** 4 / 5;

export default function (host) {
  const cv = canvas(host, { aspect: 0.62, max: 440, min: 260, label: 'Heat capacity against temperature in the Einstein and Debye models' });
  let scale = 'lin', tt = 0.2, er = 1;
  const ctl = row(host), out = readout(host);
  const re = () => { cv.redraw(); show(); };
  choice(ctl, 'Axes', [['lin', 'Linear'], ['log', 'Log-log']], scale, (v) => { scale = v; re(); });
  slider(ctl, { label: 'Temperature T/θ_D', min: 0.01, max: 2, value: tt, log: true, fmt: (v) => fmt(v, 3), oninput: (v) => { tt = v; re(); } });
  slider(ctl, { label: 'θ_E/θ_D', min: 0.5, max: 1.5, step: 0.01, value: er, fmt: (v) => fmt(v, 3), oninput: (v) => { er = v; re(); } });
  const show = () => {
    const d = debye(1 / tt), e = ein(er / tt);
    out.innerHTML = `At T = ${fmt(tt, 3)} θ_D: Debye C/3R = <b>${fmt(d, 4)}</b>, Einstein C/3R = <b>${fmt(e, 4)}</b>${tt < 0.1 ? `, T³ law ${fmt(T3 * tt ** 3, 4)}` : ''}. ${tt < 0.08 ? `Debye is ${e > 0 ? fmt(d / e, 3) : 'vastly'}× larger: acoustic modes near ω = 0 are still active.` : tt > 1 ? 'Both approach the classical 3R.' : ''}`;
  };
  cv.draw = (ctx, W, H, col) => {
    const log = scale === 'log';
    const ax = log ? axes(ctx, W, H, col, { x: [0.01, 2], y: [1e-6, 1.5], xlog: true, ylog: true, xlabel: 'T / θ_D', ylabel: 'C / 3R', t: 26, fx: (v) => fmt(v, 2), fy: (v) => (v >= 0.01 ? fmt(v, 2) : '10^' + Math.round(Math.log10(v))) })
      : axes(ctx, W, H, col, { x: [0, 2], y: [0, 1.1], xlabel: 'T / θ_D', ylabel: 'C / 3R', t: 26 });
    ctx.save(); ax.clip();
    const de = [], ei = [], t3 = [];
    for (let i = 0; i <= 300; i++) {
      const x = log ? 0.01 * Math.pow(200, i / 300) : Math.max(0.004, 2 * i / 300);
      const d = debye(1 / x), e = ein(er / x), c3 = T3 * x ** 3;
      de.push([ax.X(x), ax.Y(log ? Math.max(d, 1e-7) : d)]);
      if (!log || e > 1e-7) ei.push([ax.X(x), ax.Y(log ? Math.max(e, 1e-7) : e)]);
      if (c3 < 1.4) t3.push([ax.X(x), ax.Y(log ? Math.max(c3, 1e-7) : c3)]);
    }
    line(ctx, [[ax.X(log ? 0.01 : 0), ax.Y(1)], [ax.X(2), ax.Y(1)]], col.muted, 1, [3, 3]);
    line(ctx, t3, col.s[3], 1.5, [5, 4]); line(ctx, ei, col.s[2], 2.2); line(ctx, de, col.s[0], 2.5);
    const d = debye(1 / tt), e = ein(er / tt);
    line(ctx, [[ax.X(tt), ax.T], [ax.X(tt), ax.B]], col.muted, 1, [2, 3]);
    dot(ctx, ax.X(tt), ax.Y(log ? Math.max(d, 1e-7) : d), 4.5, col.s[0], col.panel);
    if (!log || e > 1e-7) dot(ctx, ax.X(tt), ax.Y(log ? Math.max(e, 1e-7) : e), 4.5, col.s[2], col.panel);
    ctx.restore();
    text(ctx, 'Dulong-Petit 3R', ax.R - 6, ax.Y(1) - 9, { color: col.muted, size: 10.5, align: 'right' });
    const lx = ax.L + 10, ly = ax.T + 12;
    text(ctx, '— Debye', lx, ly, { color: col.s[0], size: 11, weight: 700, halo: col.panel });
    text(ctx, '— Einstein', lx, ly + 15, { color: col.s[2], size: 11, weight: 700, halo: col.panel });
    text(ctx, '- - T³ law', lx, ly + 30, { color: col.s[3], size: 11, weight: 700, halo: col.panel });
  };
  re();
}
