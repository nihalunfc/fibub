// 1.10 Binomial, Poisson and Gaussian compared. Bars: the binomial distribution for n trials with success
// probability p. Dots: the Poisson distribution with the same mean lambda = np. Curve: the Gaussian with the same
// mean and variance np(1 - p). Small p makes Poisson a good match; large n with moderate p makes the Gaussian one.
// The readout gives the means, variances and the largest difference between the binomial and each approximation.
import { canvas, axes, line, dot, row, slider, readout, fmt, title } from '../../kit.js';

const lnf = (n) => { let s = 0; for (let k = 2; k <= n; k++) s += Math.log(k); return s; };

export default function (host) {
  const cv = canvas(host, { aspect: 0.62, max: 420, min: 270, label: 'Binomial distribution bars compared with Poisson dots and a Gaussian curve' });
  let n = 20, p = 0.1;
  const ctl = row(host), out = readout(host);
  const binom = (k) => Math.exp(lnf(n) - lnf(k) - lnf(n - k) + k * Math.log(p) + (n - k) * Math.log(1 - p));
  const pois = (k) => { const l = n * p; return Math.exp(-l + k * Math.log(l) - lnf(k)); };
  const gauss = (x) => { const m = n * p, s2 = n * p * (1 - p); return Math.exp(-((x - m) ** 2) / (2 * s2)) / Math.sqrt(2 * Math.PI * s2); };
  const upd = () => {
    let dp = 0, dg = 0; for (let k = 0; k <= n; k++) { dp = Math.max(dp, Math.abs(binom(k) - pois(k))); dg = Math.max(dg, Math.abs(binom(k) - gauss(k))); }
    out.innerHTML = `Binomial: mean np = <b>${fmt(n * p, 3)}</b>, variance np(1 − p) = <b>${fmt(n * p * (1 - p), 3)}</b>. Poisson with λ = np has variance ${fmt(n * p, 3)} (a little larger). ` +
      `Largest gap from the binomial: Poisson ${fmt(dp, 2)}, Gaussian ${fmt(dg, 2)}. ${dp < dg ? 'Here Poisson is the better approximation (rare events).' : 'Here the Gaussian is the better approximation (many trials, moderate p).'}`;
  };
  slider(ctl, { label: 'Trials n', min: 1, max: 100, step: 1, value: n, fmt: (v) => String(Math.round(v)), oninput: (v) => { n = Math.round(v); cv.redraw(); upd(); } });
  slider(ctl, { label: 'Probability p', min: 0.01, max: 0.99, step: 0.01, value: p, fmt: (v) => fmt(v, 2), oninput: (v) => { p = v; cv.redraw(); upd(); } });
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Binomial (bars), Poisson (dots) and Gaussian (curve)', col);
    const m = n * p, s = Math.sqrt(n * p * (1 - p)), k0 = Math.max(0, Math.floor(m - 4.5 * s - 2)), k1 = Math.min(n, Math.ceil(m + 4.5 * s + 2));
    let ymax = 0; for (let k = k0; k <= k1; k++) ymax = Math.max(ymax, binom(k), pois(k)); ymax = Math.max(ymax, s > 0 ? gauss(m) : 0);
    const A = axes(ctx, w, h, col, { x: [k0 - 0.6, k1 + 0.6], y: [0, ymax * 1.15], t: 40, xlabel: 'k (number of successes)', ylabel: 'P(k)' });
    ctx.save(); A.clip();
    const bw = Math.max(2, (A.X(1) - A.X(0)) * 0.7);
    ctx.globalAlpha = 0.45; ctx.fillStyle = col.s[0];
    for (let k = k0; k <= k1; k++) { const y = binom(k); ctx.fillRect(A.X(k) - bw / 2, A.Y(y), bw, A.Y(0) - A.Y(y)); }
    ctx.globalAlpha = 1;
    if (s > 0.05) { const pts = []; for (let i = 0; i <= 400; i++) { const x = k0 - 0.6 + ((k1 - k0 + 1.2) * i) / 400; pts.push([A.X(x), A.Y(gauss(x))]); } line(ctx, pts, col.s[2], 2.2); }
    for (let k = k0; k <= k1; k++) dot(ctx, A.X(k), A.Y(pois(k)), 3.5, col.s[1]);
    ctx.restore();
  };
  cv.redraw(); upd();
}
