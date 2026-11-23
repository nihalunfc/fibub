// Class 12 Maths, Probability: the binomial distribution B(n, p). n independent Bernoulli trials, each with success probability p. P(X = k) = C(n, k) p^k (1 - p)^(n - k), mean np.
// Slide n and p and watch the shape: symmetric at p = 0.5, skewed otherwise, centred on np. Choose k to light up P(X = k) and the cumulative P(X <= k).
import { canvas, text, title, axes, line, row, slider, readout } from '../../kit.js';

export default function (host) {
  let n = 10, p = 0.5, k = 5;
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 300, label: 'Bars of the binomial distribution for n trials with success probability p' });
  const ctl = row(host), ro = readout(host);
  const sk = slider(ctl, { label: 'k (number of successes)', min: 0, max: 30, step: 1, value: k, fmt: (v) => String(v), oninput: (v) => { k = v; go(); } });
  slider(ctl, { label: 'n (trials)', min: 1, max: 30, step: 1, value: n, fmt: (v) => String(v), oninput: (v) => { n = v; k = Math.min(k, n); sk.set(k); go(); } });
  slider(ctl, { label: 'p (success probability)', min: 0.05, max: 0.95, step: 0.05, value: p, fmt: (v) => v.toFixed(2), oninput: (v) => { p = v; go(); } });
  const pmf = () => { const out = []; let c = 1; for (let i = 0; i <= n; i++) { out.push(c * p ** i * (1 - p) ** (n - i)); c = c * (n - i) / (i + 1); } return out; };
  const go = () => {
    k = Math.min(k, n); const P = pmf(), cum = P.slice(0, k + 1).reduce((a, b) => a + b, 0);
    ro.textContent = `n = ${n}, p = ${p.toFixed(2)}, q = ${(1 - p).toFixed(2)}:  P(X = ${k}) = C(${n}, ${k}) p^${k} q^${n - k} = ${P[k].toFixed(4)};  P(X ≤ ${k}) = ${cum.toFixed(4)};  P(X ≥ ${k}) = ${(1 - cum + P[k]).toFixed(4)}.  Mean np = ${(n * p).toFixed(2)}.`;
    cv.redraw();
  };
  cv.draw = (ctx, w, h, col) => {
    const P = pmf(), top = title(ctx, `Binomial B(${n}, ${p.toFixed(2)})`, col), pm = Math.max(...P) * 1.15;
    const A = axes(ctx, w, h, col, { x: [-0.7, n + 0.7], y: [0, pm], xlabel: 'number of successes X', ylabel: 'P(X = k)', l: 54, t: top + 8, b: 40, xt: n <= 12 ? Array.from({ length: n + 1 }, (_, i) => i) : undefined, fy: (v) => v.toFixed(2) });
    const bw = Math.max(2, (A.R - A.L) / (n + 1) * 0.7);
    P.forEach((v, i) => { ctx.fillStyle = i === k ? col.s[3] : i < k ? col.s[1] : col.s[0]; ctx.globalAlpha = i === k ? 1 : 0.55; ctx.fillRect(A.X(i) - bw / 2, A.Y(v), bw, A.B - A.Y(v)); });
    ctx.globalAlpha = 1;
    line(ctx, [[A.X(n * p), A.T], [A.X(n * p), A.B]], col.ink, 1.5, [4, 4]); text(ctx, 'mean np', A.X(n * p) + 4, A.T + 8, { color: col.ink, size: 11, weight: 700, halo: col.panel });
    text(ctx, 'darker bar: X = k; the bars left of it: X < k', A.R - 4, A.T + 24, { color: col.muted, size: 10, align: 'right' });
  };
  go();
}
