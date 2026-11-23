// Class 11 Biology, Plant Growth and Development: arithmetic, geometric and sigmoid growth. Arithmetic: Lt = L0 + r t (a root tip elongating at a steady rate, one cell dividing and one stopping).
// Geometric: Wt = W0 e^(r t) (exponential, in the early stage). Sigmoid: the whole growth period of an organism or population, with lag, log and stationary phases.
import { canvas, text, title, axes, line, dot, row, slider, choice, readout } from '../../kit.js';

export default function (host) {
  let t = 6, kind = 'arith';
  const f = { arith: (x) => 2 + 1.2 * x, geo: (x) => 2 * Math.exp(0.22 * x), sig: (x) => 24 / (1 + 11 * Math.exp(-0.5 * x)) };
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 300, label: 'Size against time for arithmetic, geometric and sigmoid growth' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'Growth', [['arith', 'Arithmetic'], ['geo', 'Geometric'], ['sig', 'Sigmoid']], kind, (v) => { kind = v; go(); });
  slider(ctl, { label: 'Time', min: 0, max: 20, step: 0.5, value: t, fmt: (v) => v.toFixed(1) + ' days', oninput: (v) => { t = v; go(); } });
  const go = () => {
    const d = { arith: 'Arithmetic: Lt = L0 + r t. One daughter cell keeps dividing, the other differentiates, so the size grows by the same amount each day: a straight line.', geo: 'Geometric: both daughter cells keep dividing, so the size multiplies. Wt = W0 e^(rt): the curve gets steeper and steeper (this cannot go on for ever).', sig: 'Sigmoid (S-shaped): slow lag phase, fast log phase, then a stationary phase when food, water or space run short. Real plants, fruits and populations follow this.' }[kind];
    ro.textContent = `Day ${t.toFixed(1)}: size ${f[kind](t).toFixed(1)} units. ${d}`;
    cv.redraw();
  };
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, { arith: 'Arithmetic growth', geo: 'Geometric growth', sig: 'Sigmoid growth' }[kind], col);
    const A = axes(ctx, w, h, col, { x: [0, 20], y: [0, 30], xlabel: 'time (days)', ylabel: 'size', l: 48, t: t0 + 10, b: 44, xt: [0, 5, 10, 15, 20], yt: [0, 10, 20, 30] });
    ['arith', 'geo', 'sig'].forEach((k, i) => { if (k === kind) return; const p = []; for (let x = 0; x <= 20; x += 0.5) p.push([A.X(x), A.Y(Math.min(30, f[k](x)))]); line(ctx, p, col.line, 1.5); });
    const p = []; for (let x = 0; x <= t + 1e-9; x += 0.25) p.push([A.X(x), A.Y(Math.min(30, f[kind](x)))]); line(ctx, p, col.s[2], 3);
    dot(ctx, A.X(t), A.Y(Math.min(30, f[kind](t))), 5.5, col.s[3], col.bg);
    if (kind === 'sig') [[2, 'lag'], [9, 'log (exponential)'], [17, 'stationary']].forEach(([x, n]) => text(ctx, n, A.X(x), A.B - 12, { color: col.muted, size: 10, align: 'center' }));
  };
  go();
}
