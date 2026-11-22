// 2.3 Binomial, Poisson and Gaussian side by side. Bars: the binomial distribution for n trials with probability p.
// Dots: the Poisson distribution with the same mean λ = np. Curve: the Gaussian with the binomial's mean and variance.
// Small p and large n make binomial ≈ Poisson; large np(1 − p) makes both ≈ Gaussian.
import { canvas, axes, line, dot, text, title, row, slider, readout, fmt } from '../../kit.js';

const lnFact = (k) => { let s = 0; for (let i = 2; i <= k; i++) s += Math.log(i); return s; };
const binom = (n, p, k) => Math.exp(lnFact(n) - lnFact(k) - lnFact(n - k) + k * Math.log(p) + (n - k) * Math.log(1 - p));
const pois = (l, k) => Math.exp(k * Math.log(l) - l - lnFact(k));

export default function (host) {
  const cv = canvas(host, { aspect: 0.62, max: 420, min: 280, label: 'Binomial bars with the matching Poisson points and Gaussian curve' });
  let n = 20, p = 0.25;
  const ctl = row(host);
  slider(ctl, { label: 'Trials n', min: 1, max: 200, step: 1, value: n, fmt: (v) => String(v), oninput: (v) => { n = v; cv.redraw(); } });
  slider(ctl, { label: 'Probability p', min: 0.01, max: 0.99, step: 0.01, value: p, fmt: (v) => v.toFixed(2), oninput: (v) => { p = v; cv.redraw(); } });
  const out = readout(host);
  cv.draw = (ctx, W, H, col) => {
    const mu = n * p, v = n * p * (1 - p), sd = Math.sqrt(v);
    const lo = Math.max(0, Math.floor(mu - 4.5 * sd - 1)), hi = Math.min(n, Math.ceil(mu + 4.5 * sd + 1));
    const ks = []; for (let k = lo; k <= hi; k++) ks.push(k);
    const B = ks.map((k) => binom(n, p, k)), P = ks.map((k) => pois(mu, k));
    const ymax = Math.max(...B, ...P) * 1.15;
    title(ctx, `Binomial n = ${n}, p = ${p.toFixed(2)} with Poisson and Gaussian`, col);
    const ax = axes(ctx, W, H, col, { x: [lo - 0.6, hi + 0.6], y: [0, ymax], xlabel: 'number of successes k', ylabel: 'probability', t: 40, fy: (y) => fmt(y, 2) });
    const bw = Math.max(1, (ax.X(1) - ax.X(0)) * 0.7);
    ctx.save(); ax.clip(); ctx.globalAlpha = 0.45; ctx.fillStyle = col.s[0];
    ks.forEach((k, i) => ctx.fillRect(ax.X(k) - bw / 2, ax.Y(B[i]), bw, ax.Y(0) - ax.Y(B[i])));
    ctx.restore();
    const g = []; for (let x = lo - 0.6; x <= hi + 0.6; x += (hi - lo + 1.2) / 300) g.push([ax.X(x), ax.Y(Math.exp(-((x - mu) ** 2) / (2 * v)) / Math.sqrt(2 * Math.PI * v))]);
    ctx.save(); ax.clip(); line(ctx, g, col.s[2], 2); ctx.restore();
    if (ks.length < 90) ks.forEach((k, i) => dot(ctx, ax.X(k), ax.Y(P[i]), 3.2, col.s[1]));
    text(ctx, 'bars: binomial', ax.L + 8, ax.T + 8, { color: col.s[0], size: 11, weight: 700 });
    text(ctx, 'dots: Poisson, same mean', ax.L + 8, ax.T + 23, { color: col.s[1], size: 11, weight: 700 });
    text(ctx, 'curve: Gaussian, same mean and variance', ax.L + 8, ax.T + 38, { color: col.s[2], size: 11, weight: 700 });
    // largest gaps between the shapes
    let dP = 0, dG = 0;
    for (let k = 0; k <= n; k++) { const b = binom(n, p, k); dP += Math.abs(b - pois(mu, k)); dG += Math.abs(b - Math.exp(-((k - mu) ** 2) / (2 * v)) / Math.sqrt(2 * Math.PI * v)); }
    out.innerHTML = `Mean np = <b>${fmt(mu, 3)}</b>, variance np(1 − p) = <b>${fmt(v, 3)}</b> (Poisson would have variance ${fmt(mu, 3)}). Total difference from the binomial: Poisson <b>${fmt(dP / 2, 2)}</b>, Gaussian <b>${fmt(dG / 2, 2)}</b>. ${p <= 0.05 && n >= 50 ? 'Small p, large n: the Poisson limit.' : v >= 10 ? 'Large variance: the Gaussian limit (central limit theorem).' : 'Try small p with large n, or a large np(1 − p).'}`;
  };
  cv.redraw();
}
