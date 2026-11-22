// Class 12 Biology, Ecosystem: how fast litter decomposes. The rate depends on the chemistry of the litter (lignin and chitin slow it, nitrogen and
// sugars speed it) and on climate: warm, moist, well-aerated conditions favour decomposers; cold or dry ones slow them. Model: mass = m0 e^(-kt) with
// k = k0 x temperature factor x moisture factor x quality factor (illustrative values).
import { canvas, axes, line, dot, text, title, row, slider, choice, readout } from '../../kit.js';

export default function (host) {
  let T = 28, M = 70, Q = 'leaf';
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 280, label: 'Mass of litter remaining over the years for chosen temperature, moisture and litter quality' });
  const ctl = row(host), ro = readout(host);
  slider(ctl, { label: 'temperature', min: 0, max: 40, step: 1, value: 28, fmt: (v) => v + ' °C', oninput: (v) => { T = v; go(); } });
  slider(ctl, { label: 'moisture', min: 5, max: 100, step: 5, value: 70, fmt: (v) => v + ' %', oninput: (v) => { M = v; go(); } });
  choice(ctl, 'Litter', [['leaf', 'Soft leaves (low lignin)'], ['wood', 'Wood (high lignin)']], 'leaf', (v) => { Q = v; go(); });
  const k = () => 1.2 * Math.pow(2, (T - 25) / 10) * Math.min(1, M / 70) * (Q === 'leaf' ? 1 : 0.18);
  const go = () => { const kk = k(), half = Math.LN2 / kk; ro.textContent = `Decay constant k = ${kk.toFixed(2)} per year; half the litter is gone after ${half < 20 ? half.toFixed(1) + ' years' : 'more than 20 years'}. ${T < 8 || M < 25 ? 'Cold or dry conditions slow the decomposers.' : Q === 'wood' ? 'Lignin and other tough compounds slow decomposition.' : 'Warm, moist conditions with soft, nitrogen-rich litter favour the decomposers.'}`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Litter left over time', col);
    const a = axes(ctx, w, h, col, { x: [0, 20], y: [0, 100], xlabel: 'time (years)', ylabel: 'litter left (%)', l: 46, t: 36, xt: [0, 5, 10, 15, 20] });
    const P = []; for (let t = 0; t <= 20; t += 0.25) P.push([a.X(t), a.Y(100 * Math.exp(-k() * t))]); line(ctx, P, col.s[2], 2.5);
    const half = Math.LN2 / k(); if (half <= 20) { ctx.setLineDash([4, 4]); line(ctx, [[a.L, a.Y(50)], [a.X(half), a.Y(50)], [a.X(half), a.B]], col.muted, 1.2); ctx.setLineDash([]); dot(ctx, a.X(half), a.Y(50), 5, col.s[2], col.panel); text(ctx, 'half gone', a.X(half) + 6, a.Y(50) - 10, { color: col.muted, size: 10.5, weight: 700 }); }
  };
  go();
}
