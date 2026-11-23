// Beyond the syllabus (Class 11 Maths, Sequences and Series): a GP with |r| < 1 has partial sums that settle down to
// a/(1 − r). Walk 1 m, then ½ m, then ¼ m, ...: you never pass 2 m. Play to add terms, or slide r. For |r| ≥ 1 there is no limit.
import { canvas, axes, row, slider, readout, line, dot, text, title, loop } from '../../kit.js';

export default function (host) {
  let r = 0.5, n = 1;
  const cv = canvas(host, { aspect: 0.7, max: 440, min: 280, label: 'Partial sums of a geometric progression approaching the limit a over 1 minus r' });
  const c1 = row(host), out = readout(host);
  slider(c1, { label: 'ratio r', min: -0.9, max: 1.2, step: 0.1, value: r, fmt: (v) => v.toFixed(1).replace('-', '−'), oninput: (v) => { r = v; n = 1; re(); } });
  const S = (k) => { let s = 0; for (let i = 0; i < k; i++) s += r ** i; return s; };
  const anim = loop(host, (dt, t) => { const k = Math.min(14, 1 + Math.floor(t * 2) % 15); if (k !== n) { n = k; re(); } });
  anim.button(c1);
  const re = () => { cv.redraw(); out.innerHTML = Math.abs(r) < 1 ? `a = 1. After ${n} terms the sum is <b>${S(n).toFixed(4)}</b>. The limit is a/(1 − r) = <b>${(1 / (1 - r)).toFixed(4)}</b>.` : `|r| ≥ 1: after ${n} terms the sum is ${S(n).toFixed(2)} and it never settles. There is no sum to infinity.`; };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, `1 + r + r² + ...  with r = ${r.toFixed(1).replace('-', '−')}`, col), K = 14, vals = Array.from({ length: K }, (_, i) => S(i + 1)), hi = Math.max(...vals, 1), lo = Math.min(...vals, 0), pad = (hi - lo) * 0.12 + 0.1;
    const g = axes(ctx, w, h, col, { x: [0, K + 1], y: [lo - pad, hi + pad], l: 38, b: 42, t: top + 4, r: 12, xlabel: 'number of terms', xt: [1, 4, 7, 10, 14] });
    if (Math.abs(r) < 1) { ctx.setLineDash([6, 4]); line(ctx, [[g.L, g.Y(1 / (1 - r))], [g.R, g.Y(1 / (1 - r))]], col.s[1], 2); ctx.setLineDash([]); text(ctx, 'limit ' + (1 / (1 - r)).toFixed(2), g.R, g.Y(1 / (1 - r)) - 9, { color: col.s[1], size: 11, weight: 700, align: 'right' }); }
    line(ctx, vals.slice(0, n).map((v, i) => [g.X(i + 1), g.Y(v)]), col.s[0], 2); vals.slice(0, n).forEach((v, i) => dot(ctx, g.X(i + 1), g.Y(v), i === n - 1 ? 5.5 : 3, col.s[0]));
  };
  re();
}
