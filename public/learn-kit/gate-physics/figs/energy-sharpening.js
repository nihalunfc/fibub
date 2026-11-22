// 5.1 Why ensembles agree. The canonical energy distribution P(E) ∝ Ω(E) e^{-E/kT} for N two-level units (levels 0 and ε),
// plotted against E/N. Raise N: the peak stays at the same energy per unit while its relative width shrinks as 1/√N.
import { canvas, axes, line, row, slider, readout, fmt, title, text } from '../../kit.js';

// log of binomial coefficient via lgamma (Stirling series), good for large N
const lgam = (x) => { if (x < 7) { let s = 0; while (x < 7) { s -= Math.log(x); x += 1; } return s + lgam(x); } const x2 = 1 / (x * x); return (x - 0.5) * Math.log(x) - x + 0.9189385332 + (1 / x) * (1 / 12 - x2 * (1 / 360 - x2 / 1260)); };
const lbin = (n, k) => lgam(n + 1) - lgam(k + 1) - lgam(n - k + 1);

export default function (host) {
  const cv = canvas(host, { aspect: 0.6, max: 380, min: 250, label: 'Energy distribution of N two-level units in a heat bath, for growing N' });
  let lgN = 2, t = 1; // N = 10^lgN, kT/ε = t
  const ctl = row(host);
  slider(ctl, { label: 'Number of units N', min: 1, max: 5, step: 0.1, value: lgN, fmt: (v) => fmt(Math.round(10 ** v), 3), oninput: (v) => { lgN = v; cv.redraw(); show(); } });
  slider(ctl, { label: 'Temperature kT/ε', min: 0.3, max: 3, step: 0.05, value: t, fmt: (v) => v.toFixed(2), oninput: (v) => { t = v; cv.redraw(); show(); } });
  const out = readout(host);
  const p = () => Math.exp(-1 / t) / (1 + Math.exp(-1 / t));
  const show = () => {
    const N = Math.round(10 ** lgN), q = p(), rel = Math.sqrt((1 - q) / (q * N));
    out.innerHTML = `N = ${fmt(N, 3)}: mean energy per unit <b>${q.toFixed(3)} ε</b>, relative width ΔE/⟨E⟩ = <b>${fmt(rel, 2)}</b>. Each unit is excited with probability e<sup>−ε/kT</sup>/(1 + e<sup>−ε/kT</sup>); the spread shrinks as 1/√N, so for 10<sup>23</sup> units the energy is fixed to about one part in 10<sup>11</sup>: canonical and microcanonical agree.`;
  };
  cv.draw = (ctx, w, h, col) => {
    const N = Math.round(10 ** lgN), q = p();
    const pts = [], pts10 = [];
    let mx = -1e300;
    const lw = (n, NN) => lbin(NN, n) - (n / t);
    for (let n = 0; n <= N; n++) mx = Math.max(mx, lw(n, N));
    // density in e = n/N: P(e) = N * P(n)
    let norm = 0; for (let n = 0; n <= N; n++) norm += Math.exp(lw(n, N) - mx);
    for (let n = 0; n <= N; n += Math.max(1, Math.floor(N / 400))) pts.push([n / N, (N * Math.exp(lw(n, N) - mx)) / norm]);
    let mx10 = -1e300, n10 = 0; for (let n = 0; n <= 10; n++) mx10 = Math.max(mx10, lw(n, 10));
    for (let n = 0; n <= 10; n++) n10 += Math.exp(lw(n, 10) - mx10);
    for (let n = 0; n <= 10; n++) pts10.push([n / 10, (10 * Math.exp(lw(n, 10) - mx10)) / n10]);
    const top = Math.max(...pts.map((a) => a[1])) * 1.15;
    const ax = axes(ctx, w, h, col, { x: [0, 1], y: [0, top], xlabel: 'energy per unit E/(Nε)', ylabel: 'P (per unit E/Nε)', fy: () => '', t: 34 });
    title(ctx, 'Canonical energy distribution of N two-level units', col);
    ctx.save(); ax.clip?.();
    line(ctx, pts10.map(([x, y]) => [ax.X(x), ax.Y(y)]), col.muted, 1.3, [5, 4]);
    line(ctx, pts.map(([x, y]) => [ax.X(x), ax.Y(y)]), col.s[0], 2.5);
    line(ctx, [[ax.X(q), ax.Y(0)], [ax.X(q), ax.Y(top)]], col.s[2], 1.5, [3, 3]);
    ctx.restore();
    text(ctx, '⟨E⟩/N', ax.X(q) + 4, ax.Y(top) + 12, { color: col.s[2], size: 11, halo: col.panel });
    text(ctx, 'dashed: N = 10', ax.L + 6, ax.Y(top) + 26, { color: col.muted, size: 11, halo: col.panel });
  };
  cv.redraw(); show();
}
