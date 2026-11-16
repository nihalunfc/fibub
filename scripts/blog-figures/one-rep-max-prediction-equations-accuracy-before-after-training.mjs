// Figures for src/blog/discoveries/one-rep-max-prediction-equations-accuracy-before-after-training.md, made with the
// maths of the One-rep max calculator (src/lib/everyday/body.ts: epley, brzycki, lombardi, oconnor, wathan, mayhew, lander).
// Run: node scripts/blog-figures/one-rep-max-prediction-equations-accuracy-before-after-training.mjs   (rewrites the charts inside the article)
import fs from 'node:fs';
import { FORMULAS } from '../../src/lib/everyday/body.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/one-rep-max-prediction-equations-accuracy-before-after-training.md', import.meta.url);

// From the paper (Ribeiro et al. 2024, Int J Strength Cond 4(1), doi:10.47206/ijsc.v4i1.327, CC BY 4.0): the test set used
// 80 % of the measured 1RM, which allowed about 10 reps. Everything else here is our own made-up example, not the paper's data.
const LOAD_SHARE = 0.8, REPS = 10;
const W = 60; // our example: 60 kg for 10 reps, so a "true" 1RM of 60 / 0.8 = 75 kg if the 80 % rule held exactly
const TRUE = W / LOAD_SHARE;

// Figure 1: each formula's estimate, as a share of the load lifted, for 1 to 15 reps.
const reps = Array.from({ length: 15 }, (_, i) => i + 1);
const fig1 = chart({
  title: 'What each formula adds on top of the weight you lifted', xLabel: 'Reps done to near failure', yLabel: 'Estimated 1RM (% of load)',
  series: FORMULAS.map(([name, f]) => ({ name, kind: 'line', x: reps, y: reps.map((r) => +(100 * f(1, r)).toFixed(2)) })),
  xDomain: [1, 15], yDomain: [100, 160], hlines: [{ y: 100 / LOAD_SHARE, text: '80 % load' }],
  desc: 'Seven 1RM formulas agree for a few reps and spread apart as reps rise; at 10 reps they range from 125 to 135 % of the load.', height: 300,
});

// Figure 2: our example lifter, 60 kg for 10 reps, through each formula.
const est = FORMULAS.map(([name, f]) => ({ name, v: +f(W, REPS).toFixed(2) }));
const fig2 = chart({
  title: `One set of ${W} kg for ${REPS} reps, seven estimates`, xLabel: 'Formula', yLabel: 'Estimated 1RM (kg)',
  series: [{ name: 'Estimate', kind: 'dots', x: est.map((_, i) => i + 1), y: est.map((e) => e.v), size: 5 }],
  xTicks: est.map((_, i) => i + 1), xFmt: (t) => (est[t - 1]?.name ?? '').replace("O'Connor", "O'Con."),
  xDomain: [0.5, 7.5], yDomain: [70, 82], hlines: [{ y: TRUE, text: '75 kg if 10 reps = 80 %' }],
  desc: `For ${W} kg done ${REPS} times the formulas give ${Math.min(...est.map((e) => e.v)).toFixed(1)} to ${Math.max(...est.map((e) => e.v)).toFixed(1)} kg.`, height: 280,
});

// Reps each formula expects at 80 % of 1RM (solve f(0.8, r) = 1 by bisection).
const repsAt80 = FORMULAS.map(([name, f]) => { let lo = 1, hi = 36; for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; (f(LOAD_SHARE, m) < 1 ? (lo = m) : (hi = m)); } return { name, r: +lo.toFixed(2) }; });
console.log(JSON.stringify({ est, repsAt80, at10: FORMULAS.map(([n, f]) => [n, +(100 * f(1, 10)).toFixed(1)]), at3: FORMULAS.map(([n, f]) => [n, +(100 * f(1, 3)).toFixed(1)]) }));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'curves', figure(fig1, 'Figure 1. The seven formulas in the One-rep max calculator, each turned into "estimated 1RM as a share of the load". The dashed line is 125 %, the answer if the load really was 80 % of the 1RM. Recomputed from the formulas; no paper data.'));
  md = inject(md, 'example', figure(fig2, 'Figure 2. A made-up lifter: 60 kg for 10 reps, through each formula. The dashed line is 75 kg, what the paper\'s 80 % set implies. An illustration, not the study\'s measurements.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
