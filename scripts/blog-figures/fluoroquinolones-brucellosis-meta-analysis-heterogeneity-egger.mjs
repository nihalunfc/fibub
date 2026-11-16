// Figures for src/blog/discoveries/fluoroquinolones-brucellosis-meta-analysis-heterogeneity-egger.md, made with the
// maths of the Meta-analysis tool (src/lib/sci/meta.ts) and its statistics helpers (src/lib/sci/stats.ts, survival.ts).
// Run: node scripts/blog-figures/fluoroquinolones-brucellosis-meta-analysis-heterogeneity-egger.mjs
// Part 1 RECOMPUTES the paper's stated summary numbers (no per-trial data are in the text).
// Part 2 is a SIMULATION: seven made-up trials, written by fibub, to show random effects, I², tau² and the funnel.
import fs from 'node:fs';
import { parseStudies, metaAnalysis } from '../../src/lib/sci/meta.ts';
import { normCdf, normInv, tInv, tTwoSided } from '../../src/lib/sci/stats.ts';
import { chi2Sf } from '../../src/lib/sci/survival.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/fluoroquinolones-brucellosis-meta-analysis-heterogeneity-egger.md', import.meta.url);

// From the text of Mohammadi-Sartang et al. (2026), PLOS NTDs 20(10): e0013822 (CC BY 4.0).
const POOLED = [
  { out: 'Therapeutic failure', k: 8, rr: 2.11, lo: 1.26, hi: 3.51, p: 0.004, Q: 3.02, df: 7, pQ: 0.88, I2: 0 },
  { out: 'Relapse', k: 7, rr: 1.88, lo: 0.94, hi: 3.74, p: 0.07, Q: 4.84, df: 6, pQ: 0.56, I2: 0 },
  { out: 'Adverse events', k: 7, rr: 0.62, lo: 0.29, hi: 1.33, p: 0.22, Q: 12.68, df: 6, pQ: 0.05, I2: 52.7 },
];
const EGGER = [
  { out: 'Therapeutic failure', k: 8, b: -0.631, lo: -2.06, hi: 0.80, t: -1.08, p: 0.32 },
  { out: 'Relapse', k: 7, b: 1.81, lo: -0.66, hi: 4.28, t: 1.88, p: 0.11 },
  { out: 'Adverse events', k: 7, b: 1.86, lo: -2.15, hi: 5.13, t: 1.54, p: 0.12 },
  { out: 'Time to defervescence', k: 4, b: -0.16, lo: -2.45, hi: 2.10, t: -0.31, p: 0.78 },
];
const z95 = normInv(0.975);
const re = POOLED.map((r) => {
  const se = (Math.log(r.hi) - Math.log(r.lo)) / (2 * z95), z = Math.log(r.rr) / se;
  return { out: r.out, centre: +Math.sqrt(r.lo * r.hi).toFixed(3), se: +se.toFixed(4), p: +(2 * (1 - normCdf(Math.abs(z)))).toFixed(4), I2: +(Math.max(0, (r.Q - r.df) / r.Q) * 100).toFixed(2), pQ: +chi2Sf(r.Q, r.df).toFixed(3) };
});
const eg = EGGER.map((r) => {
  const df = r.k - 2, se = Math.abs(r.b / r.t), tc = tInv(0.975, df);
  return { out: r.out, df, se: +se.toFixed(3), p: +tTwoSided(r.t, df).toFixed(3), ci: [+(r.b - tc * se).toFixed(2), +(r.b + tc * se).toFixed(2)], mid: +((r.lo + r.hi) / 2).toFixed(2) };
});
// Defervescence: MD 1.20 days (0.66 to 1.74), z = 4.36.
const mdSE = (1.74 - 0.66) / (2 * z95), mdZ = 1.2 / mdSE;

// Part 2: seven made-up trials of adverse events (fluoroquinolone regimen vs standard), events and totals per arm.
const SIM = `Trial A\t4\t40\t9\t38
Trial B\t2\t15\t1\t14
Trial C\t10\t90\t25\t88
Trial D\t7\t30\t4\t32
Trial E\t3\t45\t14\t44
Trial F\t10\t60\t7\t62
Trial G\t1\t12\t5\t12`;
const ps = parseStudies(SIM, 'binary', { measure: 'RR' }), y = ps.studies.map((s) => s.y), v = ps.studies.map((s) => s.v);
const fits = Object.fromEntries(['DL', 'REML', 'PM'].map((m) => [m, metaAnalysis(y, v, m)]));
const R = fits.DL, ex = (x) => +Math.exp(x).toFixed(3);
const sim = {
  fixed: [R.fixed.est, R.fixed.lo, R.fixed.hi].map(ex), fixedP: +R.fixed.p.toFixed(4),
  random: [R.random.est, R.random.lo, R.random.hi].map(ex), randomP: +R.random.p.toFixed(3),
  Q: +R.Q.toFixed(2), pQ: +R.pQ.toFixed(3), I2: +(R.I2 * 100).toFixed(1), pi: R.pi.map(ex),
  tau2: Object.fromEntries(Object.entries(fits).map(([m, f]) => [m, { tau2: +f.tau2.toFixed(3), rr: ex(f.random.est), ci: [ex(f.random.lo), ex(f.random.hi)], pi: f.pi.map(ex) }])),
  egger: { b: +R.egger.intercept.toFixed(2), p: +R.egger.p.toFixed(3) },
  wF: R.weightsFixed.map((w) => +(w * 100).toFixed(1)), wR: R.weightsRandom.map((w) => +(w * 100).toFixed(1)),
  studies: ps.studies.map((s) => ({ n: s.name, rr: ex(s.y), se: +Math.sqrt(s.v).toFixed(3) })),
};

// Figure 1: the paper's three pooled risk ratios on the log scale (recomputed centres), as a vertical forest plot.
const fig1 = chart({
  title: 'Fluoroquinolone regimens vs standard: pooled risk ratios', xLabel: '1 = failure, 2 = relapse, 3 = adverse events', yLabel: 'Risk ratio (log scale: ln RR)',
  series: [{ name: 'Pooled RR with 95 % CI (paper)', kind: 'dots', x: [1, 2, 3], y: POOLED.map((r) => +Math.log(r.rr).toFixed(3)), errors: POOLED.map((r) => +((Math.log(r.hi) - Math.log(r.lo)) / 2).toFixed(3)), size: 5 }],
  xDomain: [0.5, 3.5], yDomain: [-1.5, 1.5], hlines: [{ y: 0, text: 'RR = 1 (no difference)' }], height: 260,
  desc: 'Therapeutic failure RR 2.11 (1.26 to 3.51) lies wholly above 1; relapse RR 1.88 (0.94 to 3.74) and adverse events RR 0.62 (0.29 to 1.33) cross 1.',
});

// Figure 2: funnel plot of the simulated trials (log RR against SE, SE axis reversed), with the 95 % funnel round the fixed effect.
const seMax = 1.3, f0 = R.fixed.est;
const fig2 = chart({
  title: 'Funnel plot of seven simulated trials', xLabel: 'ln risk ratio (simulated trials)', yLabel: 'Standard error',
  series: [
    { name: 'Simulated trial', kind: 'dots', x: y.map((a) => +a.toFixed(3)), y: v.map((a) => +Math.sqrt(a).toFixed(3)), size: 4.5 },
    { name: '95 % funnel', kind: 'line', x: [+(f0 - z95 * seMax).toFixed(3), +f0.toFixed(3), +(f0 + z95 * seMax).toFixed(3)], y: [seMax, 0, seMax], dash: '5 4' },
  ],
  vlines: [{ x: +R.random.est.toFixed(3), text: 'random effects' }],
  xDomain: [-3.2, 2.5], yDomain: [0, seMax], yReverse: true, height: 280,
  desc: `Seven made-up trials scatter round a pooled ln RR of ${R.random.est.toFixed(2)}; two lie outside the funnel, which is what an I² of ${sim.I2} % looks like.`,
});

console.log(JSON.stringify({ re, eg, md: { se: +mdSE.toFixed(4), z: +mdZ.toFixed(2) }, sim }, null, 0));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'pooled', figure(fig1, 'Figure 1. The paper\'s three pooled risk ratios with their 95 % intervals, drawn on the log scale where the intervals are symmetric. Values from the paper\'s text.'));
  md = inject(md, 'funnel', figure(fig2, 'Figure 2. Funnel plot made with the Meta-analysis tool\'s maths for seven made-up trials (not the paper\'s trials): each trial\'s log risk ratio against its standard error, with the 95 % funnel round the fixed-effect estimate.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
