// Class 11 Maths, Sequences and Series: a geometric progression a, ar, ar², ... Each term is r times the one before:
// aₙ = a·r^(n−1). Sum of n terms Sₙ = a(rⁿ − 1)/(r − 1) for r ≠ 1. The bars show the terms (r < 0 makes them alternate),
// and the line shows the running sum.
import { canvas, axes, row, slider, readout, line, dot, text, title } from '../../kit.js';

export default function (host) {
  let a = 2, r = 1.5, n = 6;
  const cv = canvas(host, { aspect: 0.75, max: 440, min: 280, label: 'Bars for the terms of a geometric progression and a line for its running sum' });
  const c1 = row(host), out = readout(host);
  slider(c1, { label: 'first term a', min: 1, max: 6, step: 1, value: a, fmt: String, oninput: (v) => { a = v; re(); } });
  slider(c1, { label: 'ratio r', min: -2, max: 3, step: 0.5, value: r, fmt: (v) => String(v).replace('-', '−'), oninput: (v) => { r = v; re(); } });
  slider(c1, { label: 'n terms', min: 2, max: 10, step: 1, value: n, fmt: String, oninput: (v) => { n = v; re(); } });
  const T = (i) => a * r ** (i - 1), Sn = (k) => { let s = 0; for (let i = 1; i <= k; i++) s += T(i); return s; };
  const re = () => { cv.redraw(); const S = Sn(n), f = r === 1 ? 'r = 1: S = na' : `a(rⁿ − 1)/(r − 1) = ${a}(${+(r ** n).toFixed(3)} − 1)/(${r} − 1)`; out.innerHTML = `a<sub>${n}</sub> = ${a}·${r}<sup>${n - 1}</sup> = <b>${+T(n).toFixed(3)}</b>. S<sub>${n}</sub> = ${f} = <b>${+S.toFixed(3)}</b>. ${r < 0 ? 'A negative ratio makes the terms alternate in sign.' : r === 1 ? 'All terms are equal.' : Math.abs(r) < 1 ? 'With |r| < 1 the terms shrink.' : ''}`; };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, `GP: a = ${a}, r = ${r}`, col), vals = Array.from({ length: n }, (_, i) => T(i + 1)), sums = Array.from({ length: n }, (_, i) => Sn(i + 1)), hi = Math.max(...vals, ...sums, 1), lo = Math.min(...vals, ...sums, 0), pad = (hi - lo) * 0.1;
    const g = axes(ctx, w, h, col, { x: [0, n + 1], y: [lo - (lo < 0 ? pad : 0), hi + pad], l: 40, b: 42, t: top + 4, r: 12, xlabel: 'n', xt: Array.from({ length: n }, (_, i) => i + 1).filter((v) => n <= 8 || v % 2 === 1) });
    vals.forEach((v, i) => { ctx.fillStyle = v >= 0 ? col.s[0] : col.s[1]; ctx.globalAlpha = 0.5; ctx.fillRect(g.X(i + 1 - 0.3), Math.min(g.Y(v), g.Y(0)), g.X(i + 1.3) - g.X(i + 0.7), Math.abs(g.Y(v) - g.Y(0))); ctx.globalAlpha = 1; });
    line(ctx, sums.map((v, i) => [g.X(i + 1), g.Y(v)]), col.s[2], 2.2); sums.forEach((v, i) => dot(ctx, g.X(i + 1), g.Y(v), 3.5, col.s[2]));
    text(ctx, 'bars: terms · line: running sum', w - 14, g.T + 10, { color: col.muted, size: 10.5, align: 'right' });
  };
  re();
}
