// Figures for src/blog/discoveries/caffeine-100m-sprinters-crossover-trial-power-sensitivity.md, made with the maths
// of the Sample size calculator (src/lib/sci/power.ts: exact paired t-test power with the noncentral t, and solveN).
// Run: node scripts/blog-figures/caffeine-100m-sprinters-crossover-trial-power-sensitivity.mjs  (rewrites the charts)
import fs from 'node:fs';
import { powerT, solveN } from '../../src/lib/sci/power.ts';
import { tInv } from '../../src/lib/sci/stats.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/caffeine-100m-sprinters-crossover-trial-power-sensitivity.md', import.meta.url);

// Inputs. "Paper": Mei, Li and Yang (2026), PLOS ONE 21(11): e0361864 (CC BY 4.0).
const N = 21;                                  // sprinters, each tested on placebo, 3 and 6 mg/kg: paper
const DZ_PAPER = 0.64, DZ_PAPER_ADJ = 0.76;    // detectable effect at 80% power, alpha 0.05 and 0.0167: paper
// Mean reductions in 60-m time vs placebo with 95% CI (s): paper.
const RES = { 'CAF3 60 m': [0.123, 0.086, 0.160], 'CAF6 60 m': [0.175, 0.138, 0.212], 'CAF3 10 m': [0.056, 0.033, 0.078], 'CAF6 10 m': [0.075, 0.053, 0.097] };

// 1. Sensitivity: the smallest dz detectable with 80% power for n = 21 pairs, at alpha 0.05 and 0.05/3.
const dzFor = (n, a) => { let lo = 0.05, hi = 3; for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; if (powerT(n, m, a, 'paired') < 0.8) lo = m; else hi = m; } return (lo + hi) / 2; };
const dz05 = dzFor(N, 0.05), dz0167 = dzFor(N, 0.05 / 3);

// 2. Effect sizes back-calculated from the paper's CIs. Our assumption: the CI is a paired-t interval,
// mean ± t(0.975, 20) × SD / sqrt(21), so SD of the differences = half-width × sqrt(21) / t. The paper's CIs come
// from its own models, so these are approximate.
const t20 = tInv(0.975, N - 1);
const eff = Object.fromEntries(Object.entries(RES).map(([k, [m, lo, hi]]) => { const sd = ((hi - lo) / 2) * Math.sqrt(N) / t20; return [k, { sd: +sd.toFixed(4), dz: +(m / sd).toFixed(2), power: +powerT(N, m / sd, 0.05, 'paired').toFixed(3) }]; }));

// 3. CAF6 vs CAF3 at 10 m: 0.019 s, not significant (paper). Our assumption: the SD of that difference is like the
// SD of CAF3 vs placebo at 10 m. Then how many sprinters would a follow-up need?
const sd10 = eff['CAF3 10 m'].sd, dz10 = 0.019 / sd10;
const n10 = Math.ceil(solveN((n) => powerT(n, dz10, 0.05, 'paired'), 0.8) - 1e-9);
const pow10 = powerT(N, dz10, 0.05, 'paired');

// Figure 1: power curves for n = 21 pairs.
const ds = Array.from({ length: 61 }, (_, i) => +(0.05 + i * 0.025).toFixed(3));
const fig1 = chart({
  title: 'Power of a 21-sprinter crossover, by effect size', xLabel: 'Standardised difference dz (mean ÷ SD of differences)', yLabel: 'Power',
  series: [
    { name: 'α = 0.05', kind: 'line', x: ds, y: ds.map((d) => +powerT(N, d, 0.05, 'paired').toFixed(4)) },
    { name: 'α = 0.0167 (three comparisons)', kind: 'line', x: ds, y: ds.map((d) => +powerT(N, d, 0.05 / 3, 'paired').toFixed(4)), dash: '5 4' },
  ],
  yDomain: [0, 1], xDomain: [0, 1.6], hlines: [{ y: 0.8, text: '80% power' }],
  vlines: [{ x: dz05, text: `dz ${dz05.toFixed(2)}`, left: true }, { x: dz0167, text: `${dz0167.toFixed(2)}`, dy: 16 }],
  desc: `With 21 sprinters, a paired comparison has 80% power for dz of ${dz05.toFixed(2)} at alpha 0.05 and ${dz0167.toFixed(2)} at alpha 0.0167.`, height: 300,
});

// Figure 2: sprinters needed for 80% power as the effect shrinks (alpha 0.05), with the study's effects marked.
const ds2 = Array.from({ length: 46 }, (_, i) => +(0.25 + i * 0.03).toFixed(3));
const need = ds2.map((d) => Math.ceil(solveN((n) => powerT(n, d, 0.05, 'paired'), 0.8) - 1e-9));
const fig2 = chart({
  title: 'Sprinters needed for 80% power (paired, α = 0.05)', xLabel: 'Standardised difference dz', yLabel: 'Sprinters needed (log scale)',
  series: [{ name: 'Needed', kind: 'line', x: ds2, y: need.map((n) => +Math.log10(n).toFixed(4)) }],
  yTicks: [1, 5, 10, 20, 50, 100, 150].map((v) => Math.log10(v)), yFmt: (t) => String(Math.round(10 ** t)),
  hlines: [{ y: Math.log10(21), text: 'this study: 21' }], vlines: [{ x: dz10, text: `CAF6 vs CAF3, 10 m (≈${dz10.toFixed(2)})` }],
  desc: `Sprinters needed for 80% power fall steeply with the effect size: about ${n10} for dz ${dz10.toFixed(2)}, 21 for dz ${dz05.toFixed(2)}.`, height: 300,
});

const facts = { dz05: dz05.toFixed(3), dz0167: dz0167.toFixed(3), t20: t20.toFixed(4), eff, sd10, dz10: dz10.toFixed(3), n10, pow10: pow10.toFixed(3),
  check: { pw21_064: powerT(21, 0.64, 0.05, 'paired').toFixed(4), n064: solveN((n) => powerT(n, 0.64, 0.05, 'paired'), 0.8).toFixed(3), n_sd: solveN((n) => powerT(n, 0.019 / 0.049, 0.05, 'paired'), 0.8).toFixed(3) } };
console.log(JSON.stringify(facts, null, 1));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'power', figure(fig1, 'Figure 1. Power of a paired t test with 21 sprinters against the standardised difference, from the Sample size calculator\'s maths, at the usual 5% level and at 0.05 ÷ 3 for three comparisons.'));
  md = inject(md, 'need', figure(fig2, 'Figure 2. Sprinters needed for 80% power in a paired design, from the Sample size calculator\'s maths. The marked effect is our estimate from the paper\'s confidence intervals.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
