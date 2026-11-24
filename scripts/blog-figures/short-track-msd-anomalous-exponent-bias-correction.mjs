// Figures for src/blog/discoveries/short-track-msd-anomalous-exponent-bias-correction.md, made with the maths of the
// Random walk tool (src/lib/sci/phwalk.ts: rng, trackMSD, alphaFit, fitD).
// Run: node scripts/blog-figures/short-track-msd-anomalous-exponent-bias-correction.mjs
import fs from 'node:fs';
import { rng, trackMSD, alphaFit, fitD } from '../../src/lib/sci/phwalk.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/short-track-msd-anomalous-exponent-bias-correction.md', import.meta.url);

// The paper: Lavrynenko et al. (2025), Applied Sciences 15(14): 8000 (CC BY). Its analytic backbone, for the
// time-averaged MSD fitted over lags tau = 1..4 of a trajectory of T steps:
//   Var[log TAMSD(tau)] ~ 1/T   and   Var[alpha-hat] ~ 0.9216 / T,   the 0.9216 being 1 / sum (log tau - mean)^2.
const PAPER_VAR_COEF = 0.9216, PAPER_SLOG = 1.08434;
const LAGS = 4;
// Our own simulation: 2D Brownian motion (alpha = 1 exactly), D = 0.5 um^2/s, frames 1 s apart, so each step has a
// mean square displacement of 2 um^2. NWALK trajectories per length. Seeded, so the numbers are reproducible.
const D = 0.5, DT = 1, SD = Math.sqrt(2 * D * DT), NWALK = 8000;
const LENGTHS = [10, 15, 20, 30, 50, 100, 200, 400];

const logs = Array.from({ length: LAGS }, (_, i) => Math.log(i + 1));
const mlog = logs.reduce((a, b) => a + b, 0) / LAGS;
const Slog = logs.reduce((s, x) => s + (x - mlog) ** 2, 0);   // the geometric constant the paper quotes as 1.08434

/** One Brownian track of T steps (T + 1 frames), with optional localisation noise sigma on every frame. */
function track(r, T, sigma = 0) {
  const t = [], p = []; let x = 0, y = 0;
  for (let f = 0; f <= T; f++) { if (f) { x += SD * r.n(); y += SD * r.n(); } t.push(f * DT); p.push([x + sigma * r.n(), y + sigma * r.n()]); }
  return { id: '1', t, r: p };
}
const stats = (a) => { const n = a.length, m = a.reduce((x, y) => x + y, 0) / n, v = a.reduce((s, x) => s + (x - m) ** 2, 0) / (n - 1); return { mean: m, var: v, sd: Math.sqrt(v), se: Math.sqrt(v / n), varSe: v * Math.sqrt(2 / (n - 1)) }; };

// Single-trajectory TA-MSD, as the paper's estimator does it.
const single = LENGTHS.map((T) => {
  const r = rng(1000 + T), a = [];
  for (let k = 0; k < NWALK; k++) { const m = trackMSD([track(r, T)], LAGS); a.push(alphaFit(m.lag, m.msd).alpha); }
  const s = stats(a);
  return { T, ...s, varT: s.var * T, varTse: s.varSe * T };
});
// The same trajectories pooled ten at a time: the time-and-ensemble averaged MSD the tool computes for pasted tracks.
const pooled = LENGTHS.map((T) => {
  const r = rng(5000 + T), a = [], groups = Math.round(NWALK / 10);
  for (let g = 0; g < groups; g++) { const trs = Array.from({ length: 10 }, () => track(r, T)); const m = trackMSD(trs, LAGS); a.push(alphaFit(m.lag, m.msd).alpha); }
  const s = stats(a);
  return { T, ...s, varT: s.var * T };
});
// What localisation noise does to the exponent of a 10-step track: sigma^2 = 10 % of one step's mean square.
const noisy = [0, 0.1, 0.25].map((f) => {
  const sigma = Math.sqrt(f * 2 * D * DT), r = rng(9000 + Math.round(f * 100)), a = [], dd = [];
  for (let k = 0; k < NWALK; k++) { const m = trackMSD([track(r, 10, sigma)], LAGS); a.push(alphaFit(m.lag, m.msd).alpha); const f2 = fitD(m.lag, m.msd, 2, true); dd.push(f2.D); }
  return { noiseFrac: f, sigma: +sigma.toFixed(4), alpha: stats(a), D: stats(dd) };
});

const fig1 = chart({
  title: 'Spread of the exponent: does Var[α̂] × T settle at 0.9216?',
  xLabel: 'Trajectory length T (steps)', yLabel: 'Var[α̂] × T',
  series: [
    { name: 'Our simulated Brownian tracks', kind: 'dots', x: single.map((s) => s.T), y: single.map((s) => +s.varT.toFixed(4)), errors: single.map((s) => +s.varTse.toFixed(4)), size: 3.4 },
    { name: 'Paper’s law, 0.9216', kind: 'line', x: [10, 400], y: [PAPER_VAR_COEF, PAPER_VAR_COEF], colour: 'var(--c-tools)', dash: '5 4' },
  ],
  xDomain: [0, 410], yDomain: [0.8, 1.35],
  desc: `Variance of the exponent estimated from the time-averaged MSD over lags 1 to 4, multiplied by the trajectory length, for 8000 simulated Brownian trajectories at each length. The dashed line is the paper's asymptotic 0.9216.`,
  height: 280,
});
const fig2 = chart({
  title: 'The exponent of pure Brownian motion, read off short tracks',
  xLabel: 'Trajectory length T (steps)', yLabel: 'Estimated exponent α̂',
  series: [
    { name: 'One track at a time', kind: 'dots', x: single.map((s) => s.T), y: single.map((s) => +s.mean.toFixed(4)), errors: single.map((s) => +s.sd.toFixed(4)), size: 3.4 },
    { name: 'Ten tracks pooled', kind: 'dots', x: pooled.map((s) => s.T), y: pooled.map((s) => +s.mean.toFixed(4)), errors: pooled.map((s) => +s.sd.toFixed(4)), size: 3.4 },
  ],
  xDomain: [0, 410], yDomain: [0.5, 1.4],
  hlines: [{ y: 1, text: 'the true value, α = 1' }],
  desc: 'Mean estimated exponent, with one standard deviation as the bar, for single trajectories and for groups of ten pooled into one time-and-ensemble averaged MSD. Short single tracks read low and scatter widely.',
  height: 280,
});

console.log(JSON.stringify({
  Slog: +Slog.toFixed(6), paperSlog: PAPER_SLOG, oneOverSlog: +(1 / Slog).toFixed(6),
  single: single.map((s) => ({ T: s.T, mean: +s.mean.toFixed(4), sd: +s.sd.toFixed(4), varT: +s.varT.toFixed(4), varTse: +s.varTse.toFixed(4), se: +s.se.toFixed(4) })),
  pooled: pooled.map((s) => ({ T: s.T, mean: +s.mean.toFixed(4), sd: +s.sd.toFixed(4), varT: +s.varT.toFixed(4) })),
  noisy: noisy.map((n) => ({ noiseFrac: n.noiseFrac, sigma: n.sigma, alphaMean: +n.alpha.mean.toFixed(4), alphaSd: +n.alpha.sd.toFixed(4), Dmean: +n.D.mean.toFixed(4) })),
}, null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'variance', figure(fig1, "Figure 1. The paper's variance law tested on 8000 simulated Brownian trajectories per length, with the Random walk tool's own time-averaged MSD and log-log fit. Beyond about 50 steps the product settles on the predicted 0.9216; at 10 steps it is a third larger. Bars are the sampling error of the variance."));
  md = inject(md, 'bias', figure(fig2, 'Figure 2. The same trajectories: the mean exponent read from one track at a time, and from ten tracks pooled into a single time-and-ensemble averaged MSD. Bars are one standard deviation of the estimate, not its standard error.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((x) => (x.length / 1024).toFixed(1) + ' KB').join(', '));
}
