// Class 11 Maths, Sequences and Series (revision of arithmetic progressions): a, a + d, a + 2d, ... Each term is d more
// than the one before: aₙ = a + (n − 1)d. Sum of n terms Sₙ = n/2 · (2a + (n − 1)d) = n/2 · (first + last).
// The bars show the terms; the pairs first+last, second+second-last, ... all have the same total, which is Gauss's trick.
import { canvas, axes, row, slider, readout, text, title } from '../../kit.js';

export default function (host) {
  let a = 3, d = 4, n = 8;
  const cv = canvas(host, { aspect: 0.75, max: 440, min: 280, label: 'Bars for the terms of an arithmetic progression with equal pair sums' });
  const c1 = row(host), out = readout(host);
  slider(c1, { label: 'first term a', min: -6, max: 12, step: 1, value: a, fmt: String, oninput: (v) => { a = v; re(); } });
  slider(c1, { label: 'difference d', min: -4, max: 6, step: 1, value: d, fmt: String, oninput: (v) => { d = v; re(); } });
  slider(c1, { label: 'n terms', min: 2, max: 12, step: 1, value: n, fmt: String, oninput: (v) => { n = v; re(); } });
  const re = () => { cv.redraw(); const l = a + (n - 1) * d, S = n * (2 * a + (n - 1) * d) / 2; out.innerHTML = `a<sub>${n}</sub> = ${a} + ${n - 1}×${d} = <b>${l}</b>. S<sub>${n}</sub> = ${n}/2 × (${a} + ${l}) = <b>${S}</b>. Every pair of bars with the same colour (first + last, second + second-last, ...) adds to ${a + l}.`; };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, `AP: a = ${a}, d = ${d}`, col), vals = Array.from({ length: n }, (_, i) => a + i * d), hi = Math.max(...vals, 1), lo = Math.min(...vals, 0), pad = (hi - lo) * 0.15 + 1;
    const g = axes(ctx, w, h, col, { x: [0, n + 1], y: [lo - (lo < 0 ? pad : 0), hi + pad], l: 34, b: 42, t: top + 4, r: 12, xt: Array.from({ length: n }, (_, i) => i + 1).filter((v) => n <= 8 || v % 2 === 1), xlabel: 'term number' });
    vals.forEach((v, i) => { const x0 = g.X(i + 1 - 0.32), x1 = g.X(i + 1 + 0.32), pair = Math.min(i, n - 1 - i); ctx.fillStyle = col.s[pair % 6]; ctx.globalAlpha = 0.5; ctx.fillRect(x0, Math.min(g.Y(v), g.Y(0)), x1 - x0, Math.abs(g.Y(v) - g.Y(0))); ctx.globalAlpha = 1; if (n <= 10) text(ctx, String(v).replace('-', '−'), (x0 + x1) / 2, v >= 0 ? g.Y(v) - 8 : g.Y(v) + 9, { color: col.ink, size: 10.5, weight: 600, align: 'center' }); });
  };
  re();
}
