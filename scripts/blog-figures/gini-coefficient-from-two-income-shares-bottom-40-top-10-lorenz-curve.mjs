// Figures for src/blog/discoveries/gini-coefficient-from-two-income-shares-bottom-40-top-10-lorenz-curve.md, made with
// the maths of the Gini and Lorenz tool (src/lib/sci/gini.ts: inequality, lorenzAt, fromGroups).
// Run: node scripts/blog-figures/gini-coefficient-from-two-income-shares-bottom-40-top-10-lorenz-curve.mjs
import fs from 'node:fs';
import { inequality, lorenzAt, fromGroups } from '../../src/lib/sci/gini.ts';
import { logGamma, normCdf } from '../../src/lib/sci/stats.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/gini-coefficient-from-two-income-shares-bottom-40-top-10-lorenz-curve.md', import.meta.url);

// Dai and Shen (2025), PLOS ONE 20(2): e0318833 (CC BY). Their two-point estimator: fit L(x) = x − x^p (1 − x)^q through
// (x1, L(x1)) and (x2, L(x2)), then G = 2 B(p + 1, q + 1). Pairs are (bottom x1, bottom x2) population shares.
export function twoPoint(x1, y1, x2, y2) {
  const a = Math.log(x1 - y1), b = Math.log(x2 - y2), l1 = Math.log(x1), l2 = Math.log(x2), m1 = Math.log(1 - x1), m2 = Math.log(1 - x2);
  const den = l1 * m2 - l2 * m1, p = (a * m2 - b * m1) / den, q = (l1 * b - l2 * a) / den;
  const G = 2 * Math.exp(logGamma(p + 1) + logGamma(q + 1) - logGamma(p + q + 2));
  return { p, q, G };
}
// Their simulation designs: log-normal y = exp(9.1171 + 1.1021 Z), Z standard normal (theoretical Gini 0.5642), and
// Beta-2: y = b T/(1 − T), b = 2958.574, T ~ Beta(8.6944, 2.0609). The random draws are ours (seeded).
let s = 20250211; const rnd = () => { s = (s * 1664525 + 1013904223) >>> 0; return (s + 0.5) / 4294967296; };
const gauss = () => Math.sqrt(-2 * Math.log(rnd())) * Math.cos(2 * Math.PI * rnd());
const gamma = (k) => { if (k < 1) return gamma(k + 1) * rnd() ** (1 / k); const d = k - 1 / 3, c = 1 / Math.sqrt(9 * d); for (;;) { let x, v; do { x = gauss(); v = 1 + c * x; } while (v <= 0); v = v * v * v; const u = rnd(); if (Math.log(u) < 0.5 * x * x + d - d * v + d * Math.log(v)) return d * v; } };
const DIST = {
  'log-normal': () => Math.exp(9.1171 + 1.1021 * gauss()),
  'Beta-2': () => { const g1 = gamma(8.6944), g2 = gamma(2.0609), T = g1 / (g1 + g2); return 2958.574 * T / (1 - T); },
};
const PAIRS = [[0.3, 0.8], [0.4, 0.9], [0.5, 0.9]];
const one = (draw, n) => {
  const x = Array.from({ length: n }, draw), I = inequality(x);
  return { G: I.gini, L: I.lorenz, est: PAIRS.map(([a, b]) => twoPoint(a, lorenzAt(I.lorenz, a), b, lorenzAt(I.lorenz, b))) };
};
const NS = [500, 1000, 5000, 10000], REPS = 1000;
const sim = {};
for (const [name, draw] of Object.entries(DIST)) {
  sim[name] = NS.map((n) => {
    const err = PAIRS.map(() => []);
    for (let r = 0; r < REPS; r++) { const o = one(draw, n); o.est.forEach((e, k) => err[k].push(e.G - o.G)); }
    return { n, pairs: err.map((e) => ({ rmse: Math.sqrt(e.reduce((a, v) => a + v * v, 0) / e.length), max: Math.max(...e), min: Math.min(...e), valid: e.filter((v) => Math.abs(v) < 0.01).length / e.length })) };
  });
}
// One large log-normal sample for the Lorenz figure and the worked example.
const big = one(DIST['log-normal'], 10000), e49 = big.est[1];
const theory = 2 * normCdf(1.1021 / Math.SQRT2) - 1;
// Deciles of that sample, as grouped data (10 groups of 10 %), to show the tool's grouped mode.
const dec = Array.from({ length: 10 }, (_, k) => lorenzAt(big.L, (k + 1) / 10) - lorenzAt(big.L, k / 10));
const g = fromGroups(dec.map(() => 10), dec.map((v) => +(100 * v).toFixed(2))), Igrp = inequality(g.x, g.w);
const fromDecShares = twoPoint(0.4, Igrp.bottom40, 0.9, 1 - Igrp.top10);

const P = Array.from({ length: 101 }, (_, i) => i / 100);
const fig1 = chart({
  title: 'A Lorenz curve rebuilt from two points', xLabel: 'Share of people, poorest first', yLabel: 'Share of income',
  series: [
    { name: 'Equality', noLegend: true, kind: 'line', x: [0, 1], y: [0, 1], colour: 'var(--line)' },
    { name: 'Simulated incomes (tool)', kind: 'line', x: P, y: P.map((p) => +lorenzAt(big.L, p).toFixed(4)) },
    { name: 'Two-point curve', kind: 'line', x: P, y: P.map((p) => +(p - p ** e49.p * (1 - p) ** e49.q).toFixed(4)), dash: '5 4' },
    { name: 'The two points used', kind: 'dots', x: [0.4, 0.9], y: [0.4, 0.9].map((p) => +lorenzAt(big.L, p).toFixed(4)), size: 5, colour: 'var(--ink)' },
  ],
  xDomain: [0, 1], yDomain: [0, 1],
  desc: `Lorenz curve of 10,000 simulated log-normal incomes and the curve through its 40 % and 90 % points. Gini ${big.G.toFixed(4)} from all incomes, ${e49.G.toFixed(4)} from the two points.`, height: 300,
});
const fig2 = chart({
  title: 'Error of the two-point Gini (1000 samples each)', xLabel: 'Sample size (incomes per sample)', yLabel: 'RMSE of Gini',
  series: [
    ...PAIRS.map((pr, k) => ({ name: `(${pr[0] * 100}, ${pr[1] * 100}) log-normal`, kind: 'line', x: NS.map((n) => Math.log10(n)), y: sim['log-normal'].map((r) => +r.pairs[k].rmse.toFixed(5)), dash: k === 1 ? undefined : '5 4' })),
    { name: '(40, 90) Beta-2', kind: 'line', x: NS.map((n) => Math.log10(n)), y: sim['Beta-2'].map((r) => +r.pairs[1].rmse.toFixed(5)), colour: 'var(--muted)' },
  ],
  xDomain: [Math.log10(400), Math.log10(12000)], xTicks: NS.map((n) => Math.log10(n)), xFmt: (t) => String(Math.round(10 ** t)), yDomain: [0, 0.03], hlines: [{ y: 0.01, text: 'paper\'s validity limit 0.01' }],
  desc: 'Root-mean-square error of the two-point Gini against the full-sample Gini, for three pairs of quantiles and two income distributions. The 40 and 90 % pair stays near 0.003 or below.', height: 280,
});
const r5 = (v) => +v.toFixed(5);
console.log(JSON.stringify({
  theory: r5(theory), big: { G: r5(big.G), b40: r5(lorenzAt(big.L, 0.4)), b90: r5(lorenzAt(big.L, 0.9)), est: big.est.map((e) => ({ p: r5(e.p), q: r5(e.q), G: r5(e.G) })) },
  dec: dec.map((v) => +(100 * v).toFixed(2)), grouped: { G: r5(Igrp.gini), b40: r5(Igrp.bottom40), top10: r5(Igrp.top10), twoPoint: r5(fromDecShares.G) },
  sim: Object.fromEntries(Object.entries(sim).map(([k, v]) => [k, v.map((r) => ({ n: r.n, pairs: r.pairs.map((p) => ({ rmse: r5(p.rmse), max: r5(p.max), min: r5(p.min), valid: p.valid })) }))])),
}));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'lorenz', figure(fig1, 'Figure 1. The Lorenz curve of 10,000 simulated log-normal incomes (our draws from the paper\'s design), worked out with the Gini and Lorenz tool\'s maths, and the paper\'s two-parameter curve passed through its 40 % and 90 % points. The two curves are almost on top of each other.'));
  md = inject(md, 'rmse', figure(fig2, 'Figure 2. How far the two-point Gini lands from the Gini of all the incomes, as root-mean-square error over 1000 simulated samples at each size. Solid: the paper\'s preferred pair, bottom 40 % and bottom 90 %. Simulations, not the paper\'s runs.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((x) => (x.length / 1024).toFixed(1) + ' KB').join(', '));
}
