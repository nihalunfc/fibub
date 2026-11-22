// Trigonometric equations: the graph of sin x, cos x or tan x and the line y = k. Every crossing is a solution.
// The readout lists the solutions in the chosen interval, the principal value and the general solution, so the
// reader sees why sin x = k has the pattern nπ + (−1)ⁿα and why |k| > 1 gives no solution.
import { canvas, axes, line, dot, row, slider, choice, readout, fmt } from '../../kit.js';

export default function (host) {
  let fn = 'sin', k = 0.5, turns = 2;
  const cv = canvas(host, { aspect: 0.55, max: 340, min: 240, label: 'Graph of a trigonometric function and a horizontal line y = k, with the solutions marked' });
  const ctl = row(host);
  const re = () => { cv.redraw(); show(); };
  choice(ctl, 'Equation', [['sin', 'sin x = k'], ['cos', 'cos x = k'], ['tan', 'tan x = k']], fn, (v) => { fn = v; re(); });
  slider(ctl, { label: 'k', min: -2, max: 2, step: 0.05, value: k, fmt: (v) => fmt(v, 3), oninput: (v) => { k = v; re(); } });
  slider(ctl, { label: 'interval [0, nπ], n =', min: 1, max: 4, step: 1, value: turns, oninput: (v) => { turns = v; re(); } });
  const out = readout(host);
  const F = { sin: Math.sin, cos: Math.cos, tan: Math.tan };
  const sols = () => {
    const hi = turns * Math.PI, out_ = [];
    if (fn !== 'tan' && Math.abs(k) > 1 + 1e-9) return out_;
    const a = fn === 'sin' ? Math.asin(Math.max(-1, Math.min(1, k))) : fn === 'cos' ? Math.acos(Math.max(-1, Math.min(1, k))) : Math.atan(k);
    for (let m = -2; m <= 2 * turns + 2; m++) {
      const c = fn === 'sin' ? [m * Math.PI + (m % 2 ? -a : a)] : fn === 'cos' ? [2 * m * Math.PI + a, 2 * m * Math.PI - a] : [m * Math.PI + a];
      c.forEach((x) => { if (x >= -1e-9 && x <= hi + 1e-9 && !out_.some((y) => Math.abs(y - x) < 1e-7)) out_.push(Math.max(0, x)); });
    }
    return out_.sort((p, q) => p - q);
  };
  const show = () => {
    const s = sols(), pi = (x) => fmt(x / Math.PI, 3) + 'π';
    if (!s.length) { out.innerHTML = `|k| = ${fmt(Math.abs(k), 3)} is more than 1: ${fn} x never reaches it, so there is <b>no solution</b>.`; return; }
    const a = fn === 'sin' ? Math.asin(k) : fn === 'cos' ? Math.acos(k) : Math.atan(k);
    const gen = fn === 'sin' ? `x = nπ + (−1)ⁿ(${pi(a)})` : fn === 'cos' ? `x = 2nπ ± ${pi(a)}` : `x = nπ + ${pi(a)}`;
    const range = fn === 'cos' ? '[0, π]' : '[−π/2, π/2]';
    out.innerHTML = `Principal value α = ${pi(a)} (from ${range}). General solution <b>${gen}</b>, n any integer. In [0, ${turns}π] there are <b>${s.length}</b> solutions: ${s.map(pi).join(', ')}.`;
  };
  cv.draw = (ctx, w, h, col) => {
    const hi = turns * Math.PI, yr = fn === 'tan' ? 3 : 2;
    const xt = []; for (let i = 0; i <= 2 * turns; i++) xt.push((i * Math.PI) / 2);
    const { X, Y, clip } = axes(ctx, w, h, col, { x: [0, hi], y: [-yr, yr], xt, fx: (v) => (v === 0 ? '0' : fmt(v / Math.PI, 2) + 'π'), xlabel: 'x', ylabel: 'y' });
    ctx.save(); clip();
    line(ctx, [[X(0), Y(0)], [X(hi), Y(0)]], col.muted, 1);
    if (fn !== 'tan') { line(ctx, [[X(0), Y(1)], [X(hi), Y(1)]], col.line, 1, [3, 4]); line(ctx, [[X(0), Y(-1)], [X(hi), Y(-1)]], col.line, 1, [3, 4]); }
    let pts = [];
    for (let i = 0; i <= 600; i++) {
      const x = (i / 600) * hi, y = F[fn](x);
      if (fn === 'tan' && Math.abs(Math.cos(x)) < 0.02) { line(ctx, pts, col.s[0], 2.5); pts = []; continue; }
      if (Math.abs(y) < yr + 1) pts.push([X(x), Y(y)]); else { line(ctx, pts, col.s[0], 2.5); pts = []; }
    }
    line(ctx, pts, col.s[0], 2.5);
    line(ctx, [[X(0), Y(k)], [X(hi), Y(k)]], col.s[1], 2, [6, 4]);
    sols().forEach((x) => dot(ctx, X(x), Y(k), 5, col.s[1], col.panel));
    ctx.restore();
  };
  re();
}
