// 1.8 Green's function of a loaded string: -(y'' + k^2 y) = f(x) on [0, 1] with y(0) = y(1) = 0.
// G(x, x') = sin(k x<) sin(k(1 - x>)) / (k sin k), which tends to x<(1 - x>) (a tent) as k -> 0 and blows up as
// k -> pi (resonance with the first mode). Choose a load: a unit point force at x' (the response IS G), or a uniform
// or triangular load, whose response is built as a sum of tents (thin curves) and compared with the exact solution.
import { canvas, axes, line, dot, row, slider, choice, readout, fmt, title } from '../../kit.js';

const G = (x, s, k) => {
  const lo = Math.min(x, s), hi = Math.max(x, s);
  if (k < 1e-4) return lo * (1 - hi);
  return (Math.sin(k * lo) * Math.sin(k * (1 - hi))) / (k * Math.sin(k));
};
const LOADS = {
  point: { name: 'Point force', f: null },
  uniform: { name: 'Uniform', f: () => 1 },
  tri: { name: 'Ramp', f: (x) => 2 * x },
};

export default function (host) {
  const cv = canvas(host, { aspect: 0.62, max: 420, min: 270, label: 'The Green function of a string and the response to a load built from it' });
  let load = 'point', xs = 0.3, k = 0;
  const ctl = row(host), ctl2 = row(host), out = readout(host);
  const resp = (x) => { // y(x) = integral G(x, s) f(s) ds, midpoint rule
    const F = LOADS[load].f; if (!F) return G(x, xs, k);
    let s = 0; const N = 400; for (let i = 0; i < N; i++) { const t = (i + 0.5) / N; s += G(x, t, k) * F(t); } return s / N;
  };
  const exact = (x) => { // closed forms for k = 0 as a check
    if (load === 'uniform') return x * (1 - x) / 2;
    if (load === 'tri') return x * (1 - x * x) / 3;
    return G(x, xs, 0);
  };
  const upd = () => {
    const near = Math.abs(k - Math.PI) < 0.15;
    out.innerHTML = (load === 'point'
      ? `The response to a unit point force at x' = ${fmt(xs, 3)} is G(x, x') itself: continuous, with a kink where the slope drops by exactly 1. Peak G(x', x') = <b>${fmt(G(xs, xs, k), 4)}</b>${k < 1e-4 ? ` = x'(1 − x')` : ''}.`
      : `The response is ∫G(x, x')f(x')dx': a sum of tents weighted by the load (thin curves show a few). Midpoint value <b>${fmt(resp(0.5), 4)}</b>${k < 1e-4 ? `; exact ${fmt(exact(0.5), 4)}` : ''}.`) +
      ` k = ${fmt(k, 3)}. ${near ? 'Near k = π the homogeneous solution sin πx fits the end conditions, so G grows without bound: resonance.' : k > 0 ? 'The k² term (a restoring or driving term) bends the tent into sines.' : ''}`;
  };
  choice(ctl, 'Load', Object.entries(LOADS).map(([key, v]) => [key, v.name]), load, (v) => { load = v; cv.redraw(); upd(); });
  slider(ctl2, { label: "Source x'", min: 0.05, max: 0.95, step: 0.01, value: xs, fmt: (v) => fmt(v, 2), oninput: (v) => { xs = v; cv.redraw(); upd(); } });
  slider(ctl2, { label: 'k', min: 0, max: 3.05, step: 0.01, value: k, fmt: (v) => fmt(v, 3), oninput: (v) => { k = v; cv.redraw(); upd(); } });
  cv.draw = (ctx, w, h, col) => {
    title(ctx, load === 'point' ? "Green's function G(x, x') for a point force" : 'Response to a spread load, as a sum of point responses', col);
    const M = 300, ys = []; let ymax = 0.05;
    for (let i = 0; i <= M; i++) { const x = i / M, y = resp(x); ys.push([x, y]); ymax = Math.max(ymax, Math.abs(y)); }
    const top = Math.min(6, ymax * 1.3);
    const A = axes(ctx, w, h, col, { x: [0, 1], y: [-0.15 * top, top], t: 40, xlabel: 'x', ylabel: 'y(x)' });
    ctx.save(); A.clip();
    line(ctx, [[A.X(0), A.Y(0)], [A.X(1), A.Y(0)]], col.muted, 1);
    if (load !== 'point') {
      const F = LOADS[load].f;
      for (let j = 1; j <= 9; j += 2) { const s = j / 10, pts = []; for (let i = 0; i <= M; i++) { const x = i / M; pts.push([A.X(x), A.Y(G(x, s, k) * F(s) * 0.2)]); } line(ctx, pts, col.s[3], 1); }
      if (k < 1e-4) { const pts = []; for (let i = 0; i <= M; i += 6) { const x = i / M; pts.push([A.X(x), A.Y(exact(x))]); } pts.forEach(([X, Y]) => dot(ctx, X, Y, 2.2, col.s[1])); }
    }
    line(ctx, ys.map(([x, y]) => [A.X(x), A.Y(y)]), col.s[0], 2.8);
    if (load === 'point') dot(ctx, A.X(xs), A.Y(G(xs, xs, k)), 5, col.s[2]);
    ctx.restore();
  };
  cv.redraw(); upd();
}
