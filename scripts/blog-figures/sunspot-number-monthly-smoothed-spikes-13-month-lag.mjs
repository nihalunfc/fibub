// Figures for src/blog/discoveries/sunspot-number-monthly-smoothed-spikes-13-month-lag.md, made with the maths of
// the Solar cycle fitter (src/lib/sci/solarcycle.ts: the 13-month smoothing, the cycle shape, quantiles, extremes).
// Run: node scripts/blog-figures/sunspot-number-monthly-smoothed-spikes-13-month-lag.mjs
import fs from 'node:fs';
import { shape, peakX, smooth13, quantile, findExtremes, decYear, rng, EXAMPLE_C } from '../../src/lib/sci/solarcycle.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/sunspot-number-monthly-smoothed-spikes-13-month-lag.md', import.meta.url);

// --- From the paper (Carrasco, Aparicio, Bautista, Gallego and Vaquero 2026, Universe 12(2): 28,
//     doi:10.3390/universe12020028, CC BY 4.0). SILSO version 2 monthly and 13-month smoothed numbers, 1749-2025.
const PAPER = {
  hiThresh: 51.6, loThresh: -41.0,   // 95th and 5th percentile of SNm - SNsm
  within20: 74, beyond70: 1, negPct: 54.5, posPct: 44.9, mean: 0.0, median: -1.5,
  skew: -0.55, kurt: 5.95, medianMaxDiff: 64.0, slopeMax: 1.2, rMax: 0.95,
  c25: { snm: 216.0, snsmMax: 136.9, diff: 76.1, spike: 59.2 },
};
// --- Our assumptions: cycles built with the fitter's own shape function and its example noise model
//     (sigma = 4 + 0.15 x level), 24 made-up cycles spanning the amplitude range of the real record.
const NCYC = 24, Y0 = 1750;
const r2 = (v, n = 2) => +v.toFixed(n);

const x = peakX(EXAMPLE_C), g = (x ** 3) / (Math.exp(x * x) - EXAMPLE_C);

// One run of the simulation: 24 made-up cycles, monthly scatter sigma = 4 + frac x level, then the
// fitter's own 13-month smoothing, the difference month by month, and the maxima cycle by cycle.
function sim(frac, seed = 28) {
  const R = rng(seed), cycles = [];
  let t0 = Y0;
  for (let i = 0; i < NCYC; i++) {
    const A = 60 + 190 * R.u(), b = 3.3 + R.u();
    cycles.push({ a: A / (b ** 3 * g), b, t0, c: EXAMPLE_C });
    t0 += 10.4 + 1.6 * R.u();
  }
  const months = [];
  for (let y = Y0; y < t0 + 6; y++) for (let m = 1; m <= 12; m++) months.push({ y, m, t: decYear(y, m) });
  const truth = months.map((mm) => cycles.reduce((s, p) => s + shape(mm.t, p), 0));
  const v = truth.map((f) => Math.max(0, f + R.normal() * (4 + frac * f)));
  const S = smooth13(v);
  const dif = v.map((val, i) => (Number.isFinite(S[i]) ? val - S[i] : NaN)).filter(Number.isFinite);
  const n = dif.length, mean = dif.reduce((a, b) => a + b, 0) / n;
  const sd = Math.sqrt(dif.reduce((a, b) => a + (b - mean) ** 2, 0) / n);
  const mom = (k) => dif.reduce((a, b) => a + ((b - mean) / sd) ** k, 0) / n;
  const stats = {
    frac, n, mean: r2(mean), median: r2(quantile(dif, 0.5)), sd: r2(sd),
    p95: r2(quantile(dif, 0.95)), p05: r2(quantile(dif, 0.05)),
    within20: r2((100 * dif.filter((d) => Math.abs(d) <= 20).length) / n, 1),
    beyond70: r2((100 * dif.filter((d) => Math.abs(d) > 70).length) / n, 1),
    negPct: r2((100 * dif.filter((d) => d < 0).length) / n, 1),
    skew: r2(mom(3)), kurt: r2(mom(4)),
    maxPos: r2(Math.max(...dif), 1), maxNeg: r2(Math.min(...dif), 1),
  };
  const ext = findExtremes(S, 36, 6), perCycle = [];
  for (let c = 0; c < ext.maxima.length; c++) {
    const lo = ext.minima[c] ?? 0, hi = ext.minima[c + 1] ?? v.length - 1;
    let mMax = -Infinity, sMax = -Infinity;
    for (let i = lo; i <= hi; i++) { if (v[i] > mMax) mMax = v[i]; if (Number.isFinite(S[i]) && S[i] > sMax) sMax = S[i]; }
    perCycle.push({ snm: r2(mMax, 1), snsm: r2(sMax, 1), diff: r2(mMax - sMax, 1) });
  }
  const xs = perCycle.map((q) => q.snsm), ys = perCycle.map((q) => q.snm);
  const mx = xs.reduce((a, b) => a + b, 0) / xs.length, my = ys.reduce((a, b) => a + b, 0) / ys.length;
  const sxy = xs.reduce((a, b, i) => a + (b - mx) * (ys[i] - my), 0), sxx = xs.reduce((a, b) => a + (b - mx) ** 2, 0);
  const syy = ys.reduce((a, b) => a + (b - my) ** 2, 0);
  const reg = { slope: r2(sxy / sxx), intercept: r2(my - (sxy / sxx) * mx, 1), r: r2(sxy / Math.sqrt(sxx * syy), 3), medianDiff: r2(quantile(perCycle.map((q) => q.diff), 0.5), 1) };
  return { months, v, S, dif, stats, reg, ext, perCycle };
}

// How much monthly scatter does the paper's own summary imply? Sweep the fraction.
const sweep = [0.15, 0.2, 0.25, 0.3, 0.35, 0.4].map((f) => { const s = sim(f); return { frac: f, median: s.stats.median, p95: s.stats.p95, p05: s.stats.p05, within20: s.stats.within20, beyond70: s.stats.beyond70, negPct: s.stats.negPct, skew: s.stats.skew, kurt: s.stats.kurt, sd: s.stats.sd, medianMaxDiff: s.reg.medianDiff }; });
const best = sweep.reduce((a, b) => (Math.abs(b.medianMaxDiff - PAPER.medianMaxDiff) < Math.abs(a.medianMaxDiff - PAPER.medianMaxDiff) ? b : a));
const run = sim(best.frac);
const { months, v, S, dif, stats, reg, ext } = run;
const n = dif.length;
const spikes = { hi: dif.filter((d) => d > stats.p95).length, lo: dif.filter((d) => d < stats.p05).length };
// The 13-month smoothing's six-month edge: the newest months have no smoothed value at all.
const edge = { tailNaN: S.slice(-8).filter((q) => !Number.isFinite(q)).length, headNaN: S.slice(0, 8).filter((q) => !Number.isFinite(q)).length };

// --- Figures. One strong cycle, monthly against smoothed; and the distribution of the difference.
const pk = ext.maxima[8] ?? ext.maxima[0];
const w0 = Math.max(0, pk - 48), w1 = Math.min(v.length - 1, pk + 48);
const wt = months.slice(w0, w1 + 1).map((mm) => +mm.t.toFixed(3));
const fig1 = chart({
  title: 'A cycle, month by month and smoothed', xLabel: 'Year (made-up cycles)', yLabel: 'Sunspot number',
  series: [
    { name: 'Monthly', kind: 'dots', x: wt, y: v.slice(w0, w1 + 1).map((q) => r2(q, 0)), size: 2.4 },
    { name: '13-month smoothed', kind: 'line', x: wt, y: S.slice(w0, w1 + 1).map((q) => (Number.isFinite(q) ? r2(q, 0) : NaN)) },
  ],
  xDomain: [wt[0], wt[wt.length - 1]],
  desc: 'A simulated solar cycle: monthly values scatter above and below the 13-month smoothed curve, and the highest monthly value stands well above the smoothed maximum.', height: 270,
});
const BINS = Array.from({ length: 41 }, (_, i) => -100 + i * 5);
const hist = BINS.map((b) => (100 * dif.filter((d) => d >= b && d < b + 5).length) / n);
const fig2 = chart({
  title: 'Monthly minus smoothed: a peak with long tails', xLabel: 'Monthly − smoothed sunspot number', yLabel: 'Share of months (%)',
  series: [{ name: '', noLegend: true, kind: 'step', x: BINS.map((b) => b + 2.5), y: hist.map((h) => r2(h)) }],
  xDomain: [-100, 105], yDomain: [0, Math.max(...hist) * 1.15],
  vlines: [{ x: stats.p95, text: `95th: ${stats.p95}` }, { x: stats.p05, text: `5th: ${stats.p05}`, left: true, dy: 14 }],
  desc: `Distribution of monthly minus smoothed sunspot number from the simulated record: a narrow peak with tails reaching beyond plus and minus 70, and percentile spike thresholds at ${stats.p05} and ${stats.p95}.`, height: 270,
});

console.log(JSON.stringify({ paper: PAPER, sweep, best: best.frac, stats, spikes, reg, edge, nCycles: run.perCycle.length, months: months.length }, null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'cycle', figure(fig1, 'Figure 1. One simulated cycle built with the Solar cycle fitter\'s own shape function and example noise, with the tool\'s 13-month smoothing drawn through it. Made-up cycles, not real sunspot numbers.'));
  md = inject(md, 'dist', figure(fig2, 'Figure 2. How far monthly values sit from the smoothed curve across 24 simulated cycles, with the 5th and 95th percentile spike thresholds marked. Made-up cycles, not real sunspot numbers.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
