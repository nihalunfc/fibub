// Limits: the standard limits as x → 0. The function is not defined at 0 (open circle), but as the step h shrinks
// the values at −h and +h close in on one number from both sides. That number is the limit.
import { canvas, axes, line, dot, row, slider, choice, readout, fmt } from '../../kit.js';

const FNS = {
  sin: { label: 'sin x / x', f: (x) => Math.sin(x) / x, L: 1, y: [0, 1.4] },
  cos: { label: '(1 − cos x)/x²', f: (x) => (1 - Math.cos(x)) / (x * x), L: 0.5, y: [0, 0.8] },
  exp: { label: '(eˣ − 1)/x', f: (x) => Math.expm1(x) / x, L: 1, y: [0, 2.2] },
  log: { label: 'ln(1 + x)/x', f: (x) => Math.log1p(x) / x, L: 1, y: [0, 2.2] },
  pow: { label: '(1 + x)^(1/x)', f: (x) => Math.exp(Math.log1p(x) / x), L: Math.E, y: [1, 4.2] },
};

export default function (host) {
  let key = 'sin', h = 0.5;
  const cv = canvas(host, { aspect: 0.6, max: 360, min: 250, label: 'Graph of a function near x = 0 with values just left and right of 0 closing in on the limit' });
  const ctl = row(host);
  const re = () => { cv.redraw(); show(); };
  choice(ctl, 'Function', Object.entries(FNS).map(([k, v]) => [k, v.label]), key, (v) => { key = v; re(); });
  slider(ctl, { label: 'step h', min: 0.0001, max: 0.9, value: h, log: true, fmt: (v) => fmt(v, 2), oninput: (v) => { h = v; re(); } });
  const out = readout(host);
  const show = () => {
    const F = FNS[key], l = F.f(-h), r = F.f(h);
    out.innerHTML = `f(−h) = ${l.toFixed(6)}, f(+h) = ${r.toFixed(6)}. Gap from the limit: ${fmt(Math.max(Math.abs(l - F.L), Math.abs(r - F.L)), 2)}. Both sides close in on <b>${key === 'pow' ? 'e ≈ 2.718282' : key === 'cos' ? '1/2' : '1'}</b>, although f(0) itself is not defined (0/0${key === 'pow' ? ' or 1^∞' : ''}).`;
  };
  cv.draw = (ctx, w, hh, col) => {
    const F = FNS[key], span = 1;
    const { X, Y, clip } = axes(ctx, w, hh, col, { x: [-span, span], y: F.y, xlabel: 'x', ylabel: 'f(x)' });
    ctx.save(); clip();
    line(ctx, [[X(0), Y(F.y[0])], [X(0), Y(F.y[1])]], col.muted, 1);
    line(ctx, [[X(-span), Y(F.L)], [X(span), Y(F.L)]], col.s[2], 1.2, [5, 4]);
    const left = [], right = [];
    for (let i = 1; i <= 300; i++) { const x = (i / 300) * span; left.unshift([X(-x), Y(F.f(-x))]); right.push([X(x), Y(F.f(x))]); }
    line(ctx, left, col.s[0], 2.5); line(ctx, right, col.s[0], 2.5);
    dot(ctx, X(0), Y(F.L), 5, col.panel, col.s[0]);
    [-h, h].forEach((x) => { line(ctx, [[X(x), Y(F.y[0])], [X(x), Y(F.f(x))]], col.s[1], 1, [3, 3]); dot(ctx, X(x), Y(F.f(x)), 4.5, col.s[1]); });
    ctx.restore();
  };
  re();
}
