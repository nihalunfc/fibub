// Plant growth: arithmetic, geometric and sigmoid growth. Arithmetic: L = L0 + r t (one daughter cell keeps
// dividing, a straight line). Geometric: W = W0 e^(r t) (both daughters keep dividing, a J curve). In nature
// nutrients run short, so geometric growth slows into an S-shaped (sigmoid) curve: lag, log and stationary phases.
import { canvas, axes, line, text, row, slider, choice, readout, fmt } from '../../kit.js';

export default function (host) {
  let r = 0.35, show = 'all', K = 100;
  const T = 20, W0 = 1;
  const cv = canvas(host, { aspect: 0.6, max: 340, min: 240, label: 'Size against time for arithmetic, geometric and sigmoid growth' });
  const ctl = row(host);
  slider(ctl, { label: 'Rate r', min: 0.15, max: 0.6, step: 0.05, value: r, fmt: (v) => `${v.toFixed(2)} per day`, oninput: (v) => { r = v; cv.redraw(); say(); } });
  slider(ctl, { label: 'Food limit', min: 40, max: 100, step: 10, value: K, fmt: (v) => `${v}`, oninput: (v) => { K = v; cv.redraw(); say(); } });
  const ctl2 = row(host);
  choice(ctl2, 'Show', [['all', 'All three'], ['ar', 'Arithmetic'], ['geo', 'Geometric'], ['sig', 'Sigmoid']], show, (v) => { show = v; cv.redraw(); say(); });
  const out = readout(host);
  const ar = (t) => W0 + r * 10 * t / 2; // arithmetic: steady gain per day
  const geo = (t) => W0 * Math.exp(r * t);
  const sig = (t) => K / (1 + ((K - W0) / W0) * Math.exp(-r * t));
  const say = () => {
    const td = Math.log(2) / r;
    out.innerHTML = `Arithmetic: +${fmt(r * 5, 3)} units every day (absolute growth rate constant). Geometric: doubles every ln 2 / r = ${fmt(td, 3)} days (relative growth rate r constant), size ${fmt(geo(10), 3)} at day 10. Sigmoid: fast in the middle (log phase), then levels off near ${K} (stationary phase) when food runs short.`;
  };
  cv.draw = (ctx, w, h, col) => {
    const { X, Y, clip } = axes(ctx, w, h, col, { x: [0, T], y: [0, 110], xlabel: 'time (days)', ylabel: 'size' });
    const plot = (f, c) => { const p = []; for (let t = 0; t <= T; t += 0.1) p.push([X(t), Y(f(t))]); line(ctx, p, c, 3); };
    ctx.save(); clip();
    if (show === 'all' || show === 'ar') plot(ar, col.s[0]);
    if (show === 'all' || show === 'geo') plot(geo, col.s[1]);
    if (show === 'all' || show === 'sig') { line(ctx, [[X(0), Y(K)], [X(T), Y(K)]], col.muted, 1, [4, 4]); plot(sig, col.s[2]); }
    ctx.restore();
    const lab = (s, t, f, c) => { const y = f(t); if (y < 105) text(ctx, s, X(t), Y(y) - 10, { color: c, size: 11, weight: 700, align: 'center' }); };
    if (show === 'all' || show === 'ar') lab('arithmetic', 17, ar, col.s[0]);
    if (show === 'all' || show === 'geo') lab('geometric', Math.min(18, Math.log(80) / r), geo, col.s[1]);
    if (show === 'all' || show === 'sig') { lab('sigmoid', 4 + 6 * (0.35 / r), sig, col.s[2]); text(ctx, 'lag', X(1.5), Y(8), { color: col.muted, size: 10, align: 'center' }); }
  };
  cv.redraw(); say();
}
