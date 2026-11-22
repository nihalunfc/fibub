// Expand (1 + x)ⁿ one term at a time. Each bar is the term ⁿCₖ xᵏ for your x. Slide n and x to see which term is the
// biggest (the greatest term), how the coefficients follow Pascal's triangle, and the total (1 + x)ⁿ that all the
// bars add up to. With x = 1 the bars are the coefficients and sum to 2ⁿ.
import { canvas, axes, row, slider, choice, readout, text } from '../kit.js';
import { f2 } from './_math.js';

const C = (n, k) => { let r = 1; for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i; return Math.round(r); };
export default function (host) {
  let n = 8, x = 1, sg = 1;
  const cv = canvas(host, { aspect: 0.7, max: 360, min: 250, label: 'Bar chart of the terms of a binomial expansion' });
  const c = row(host);
  slider(c, { label: 'power n', min: 1, max: 14, step: 1, value: n, fmt: (v) => v, oninput: (v) => { n = v; re(); } });
  slider(c, { label: 'x', min: 0.2, max: 3, step: 0.1, value: x, fmt: (v) => f2(v, 1), oninput: (v) => { x = v; re(); } });
  choice(c, 'Sign', [[1, '(1 + x)ⁿ'], [-1, '(1 − x)ⁿ']], sg, (v) => { sg = v; re(); });
  const out = readout(host);
  const re = () => { cv.redraw(); show(); };
  const terms = () => Array.from({ length: n + 1 }, (_, k) => C(n, k) * (sg * x) ** k);
  function show() { const t = terms(), tot = t.reduce((s, v) => s + v, 0), mi = t.reduce((b, v, i) => (Math.abs(v) > Math.abs(t[b]) ? i : b), 0);
    out.innerHTML = `(1 ${sg > 0 ? '+' : '−'} ${f2(x, 1)})<sup>${n}</sup> = ${t.slice(0, 4).map((v, k) => `${f2(v, 2)}`).join(' + ').replace(/\+ −/g, '− ')}${n > 3 ? ' + …' : ''} = <b>${f2(tot, 3)}</b>. Greatest term: T<sub>${mi + 1}</sub> = ${f2(t[mi], 2)} (the term with k = ${mi}). Coefficients: ${Array.from({ length: n + 1 }, (_, k) => C(n, k)).join(', ')}, sum = ${2 ** n}.`; }
  cv.draw = (ctx, w, h, col) => {
    const t = terms(), mx = Math.max(...t.map(Math.abs)) * 1.1 || 1, mn = Math.min(0, ...t) * 1.1;
    const A = axes(ctx, w, h, col, { x: [-0.6, n + 0.6], y: [mn, mx], l: 44, b: 40, t: 22, r: 10, xlabel: 'term number k  (term = ⁿCₖ xᵏ)', xt: Array.from({ length: n + 1 }, (_, i) => i).filter((i) => n < 9 || i % 2 === 0), grid: false });
    const bw = ((A.R - A.L) / (n + 1)) * 0.7, mi = t.reduce((b, v, i) => (Math.abs(v) > Math.abs(t[b]) ? i : b), 0);
    t.forEach((v, k) => { ctx.fillStyle = k === mi ? col.s[1] : col.s[0]; ctx.fillRect(A.X(k) - bw / 2, Math.min(A.Y(v), A.Y(0)), bw, Math.abs(A.Y(v) - A.Y(0))); });
    text(ctx, 'orange = greatest term', A.L + 6, A.T + 6, { color: col.s[1], size: 11, weight: 600 });
  };
  re();
}
