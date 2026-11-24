// Figures for src/blog/discoveries/finite-lattice-ising-heat-capacity-peak-critical-temperature.md, made with the
// maths of the Ising model playground (src/lib/sci/phising.ts: exact enumeration, Metropolis Monte Carlo, Onsager).
// Run: node scripts/blog-figures/finite-lattice-ising-heat-capacity-peak-critical-temperature.mjs   (takes about a minute)
import fs from 'node:fs';
import { exactSmall, Lattice, measure, rng, onsager, TC } from '../../src/lib/sci/phising.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/finite-lattice-ising-heat-capacity-peak-critical-temperature.md', import.meta.url);

// The paper: Markthaler D. and Birke K. P. (2025), Entropy 27(11): 1139, doi:10.3390/e27111139 (CC BY 4.0).
// It takes the heat-capacity maximum Tmax(N) of exactly solved N x N Ising lattices (free and periodic boundaries,
// N up to 20) and extrapolates it to the infinite lattice, finding that a one-parameter law in N/(N+1) converges
// robustly on Onsager's exact Tc = 2/ln(1+sqrt 2) = 2.269185. Units J = kB = 1.
// fibub's tool enumerates exactly up to 4 x 4 (periodic only) and uses Metropolis Monte Carlo above that.

/** Heat-capacity peak of an exactly enumerated L x L periodic lattice, by golden-section search. */
function peakExact(L) {
  let lo = 1.8, hi = 6; const f = (T) => exactSmall(L, T).c;
  for (let i = 0; i < 200; i++) { const m1 = lo + (hi - lo) * 0.382, m2 = lo + (hi - lo) * 0.618; f(m1) > f(m2) ? (hi = m2) : (lo = m1); }
  const T = (lo + hi) / 2; return { L, T, c: f(T), kind: 'exact' };
}
/** Heat-capacity peak from the tool's Monte Carlo: a scan in T, then a parabola through the three highest points. */
function peakMC(L, T0, T1, n, eq, meas, seed) {
  const scan = [];
  for (let i = 0; i < n; i++) {
    const T = T0 + ((T1 - T0) * i) / (n - 1), r = rng(seed + i), lat = new Lattice(L, 'random', r);
    lat.sweep(T, 0, r, eq); const s = measure(lat, T, 0, meas, r); scan.push([T, s.c, s.cErr]);
  }
  const k = scan.reduce((b, p, i) => (p[1] > scan[b][1] ? i : b), 0);
  const [[x1, y1], [x2, y2], [x3, y3]] = [scan[Math.max(1, Math.min(k, n - 2)) - 1], scan[Math.max(1, Math.min(k, n - 2))], scan[Math.max(1, Math.min(k, n - 2)) + 1]];
  const d = (x1 - x2) * (x1 - x3) * (x2 - x3);
  const A = (x3 * (y2 - y1) + x2 * (y1 - y3) + x1 * (y3 - y2)) / d, B = (x3 * x3 * (y1 - y2) + x2 * x2 * (y3 - y1) + x1 * x1 * (y2 - y3)) / d;
  return { L, T: -B / (2 * A), scan, kind: 'Monte Carlo' };
}
/** Least squares of Tmax against x = 1/(N+1) or 1/N; the intercept is the infinite-lattice estimate. */
function extrap(pts, xf) {
  const n = pts.length, x = pts.map((p) => xf(p.L)), y = pts.map((p) => p.T);
  const sx = x.reduce((a, b) => a + b, 0), sy = y.reduce((a, b) => a + b, 0);
  const sxx = x.reduce((a, b) => a + b * b, 0), sxy = x.reduce((a, b, i) => a + b * y[i], 0);
  const slope = (n * sxy - sx * sy) / (n * sxx - sx * sx);
  return { Tc: (sy - slope * sx) / n, slope };
}

const ex = [2, 3, 4].map(peakExact);
const mc8 = peakMC(8, 2.30, 2.46, 9, 10000, 120000, 301);
const mc16 = peakMC(16, 2.26, 2.42, 11, 20000, 200000, 500);

const near = extrap([ex[1], ex[2]], (L) => 1 / (L + 1));   // the two largest exact lattices, N/(N+1) law
const all3 = extrap(ex, (L) => 1 / (L + 1));
const invN = extrap([ex[1], ex[2]], (L) => 1 / L);
const withMC = extrap([ex[1], ex[2], mc8, mc16], (L) => 1 / (L + 1));

const Ts = Array.from({ length: 141 }, (_, i) => 1.2 + i * 0.03); // 1.2 to 5.4
const fig1 = chart({
  title: 'Heat capacity of exactly solved Ising lattices', xLabel: 'Temperature T (J/kB)', yLabel: 'Heat capacity per spin C',
  series: [
    ...ex.map((p) => ({ name: `${p.L} × ${p.L}`, kind: 'line', x: Ts, y: Ts.map((T) => +exactSmall(p.L, T).c.toFixed(4)) })),
    { name: 'infinite (Onsager)', kind: 'line', dash: '5 3', colour: 'var(--muted)', x: Ts, y: Ts.map((T) => (Math.abs(T - TC) < 0.02 ? NaN : +onsager.c(T).toFixed(4))) },
  ],
  xDomain: [1.2, 5], yDomain: [0, 2.2],
  vlines: [{ x: +TC.toFixed(4), text: 'Tc = 2.2692', left: true }],
  desc: 'Heat capacity per spin against temperature for 2x2, 3x3 and 4x4 periodic Ising lattices from exact enumeration, with Onsager\'s infinite-lattice curve dashed. The finite peaks are low, broad and sit above Tc.',
  height: 290,
});

const pts = [...ex, mc8, mc16];
const xl = Array.from({ length: 2 }, (_, i) => i * 0.34);
const fig2 = chart({
  title: 'Extrapolating the peak to an infinite lattice', xLabel: '1 / (N + 1)', yLabel: 'Peak temperature Tmax',
  series: [
    { name: 'Line through N = 3 and 4', kind: 'line', colour: 'var(--muted)', x: xl, y: xl.map((x) => +(near.Tc + near.slope * x).toFixed(4)) },
    { name: 'Exact enumeration', kind: 'dots', size: 4, x: ex.map((p) => 1 / (p.L + 1)), y: ex.map((p) => +p.T.toFixed(4)) },
    { name: 'Monte Carlo', kind: 'dots', size: 4, x: [mc8, mc16].map((p) => 1 / (p.L + 1)), y: [mc8, mc16].map((p) => +p.T.toFixed(4)), colour: 'var(--c-tools)' },
    { name: 'Onsager Tc', kind: 'dots', size: 5, x: [0], y: [+TC.toFixed(4)], colour: 'var(--ink)' },
  ],
  xDomain: [0, 0.35], yDomain: [2.24, 2.56],
  hlines: [{ y: +TC.toFixed(4), text: 'exact Tc = 2.2692' }],
  desc: 'Heat-capacity peak temperature against 1/(N+1) for lattices from 2x2 to 16x16. A straight line through the two largest exactly enumerable lattices meets the axis at 2.289, within one per cent of Onsager\'s exact 2.269185.',
  height: 285,
});

console.log(JSON.stringify({
  TC: +TC.toFixed(6),
  exact: ex.map((p) => ({ L: p.L, Tmax: +p.T.toFixed(5), Cpeak: +p.c.toFixed(4), above: +(p.T - TC).toFixed(4) })),
  mc: [mc8, mc16].map((p) => ({ L: p.L, Tmax: +p.T.toFixed(4), scan: p.scan.map(([T, c, e]) => [+T.toFixed(3), +c.toFixed(3), +e.toFixed(3)]) })),
  extrapolations: {
    'N=3,4 with 1/(N+1)': { Tc: +near.Tc.toFixed(5), errPct: +((100 * (near.Tc - TC)) / TC).toFixed(2) },
    'N=2,3,4 with 1/(N+1)': { Tc: +all3.Tc.toFixed(5), errPct: +((100 * (all3.Tc - TC)) / TC).toFixed(2) },
    'N=3,4 with 1/N': { Tc: +invN.Tc.toFixed(5), errPct: +((100 * (invN.Tc - TC)) / TC).toFixed(2) },
    'N=3,4,8,16 with 1/(N+1)': { Tc: +withMC.Tc.toFixed(5), errPct: +((100 * (withMC.Tc - TC)) / TC).toFixed(2) },
  },
  lineAt8and16: [8, 16].map((L) => +(near.Tc + near.slope / (L + 1)).toFixed(4)),
}, null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'cofT', figure(fig1, 'Figure 1. Heat capacity per spin from the Ising model playground\'s exact enumeration of 2 × 2, 3 × 3 and 4 × 4 periodic lattices, with Onsager\'s exact infinite-lattice curve dashed (cut either side of Tc, where it diverges). The smaller the lattice, the lower, broader and hotter the peak.'));
  md = inject(md, 'extrap', figure(fig2, 'Figure 2. The peak temperatures of Figure 1 plus two Monte Carlo lattices, against 1/(N + 1). The grey line uses only the 3 × 3 and 4 × 4 exact points and still lands within one per cent of the exact critical temperature.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
