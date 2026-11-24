// Figures and numbers for src/blog/discoveries/box-behnken-peptide-extraction-optimum-check.md, made with the maths of
// the Experiment design tool (src/lib/sci/doe.ts: boxBehnken, quadratic, plackettBurman).
// Run: node scripts/blog-figures/box-behnken-peptide-extraction-optimum-check.mjs
import fs from 'node:fs';
import * as D from '../../src/lib/sci/doe.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/box-behnken-peptide-extraction-optimum-check.md', import.meta.url);

// The paper: Zhang C., Guo Y., Guo S., Li Y. and Xu L. (2026), Frontiers in Nutrition 13: 1940279 (CC BY 4.0).
// Its fitted quadratic model in coded units (a result stated in the text, not a data table), the coded factor
// levels and the residual standard deviation it reports (0.035).
const B = { c0: 28.91, A: 0.063, Bt: -0.19, C: -0.041, AB: -0.62, AC: 0.017, BC: 0.53, AA: -0.34, BB: -1.33, CC: -0.46 };
const model = (a, b, c) => B.c0 + B.A * a + B.Bt * b + B.C * c + B.AB * a * b + B.AC * a * c + B.BC * b * c + B.AA * a * a + B.BB * b * b + B.CC * c * c;
const REAL = { pH: (a) => 7 + 0.5 * a, degC: (b) => 50 + 5 * b, U: (c) => 6000 + 2000 * c };
const CODE = { pH: (v) => (v - 7) / 0.5, degC: (v) => (v - 50) / 5, U: (v) => (v - 6000) / 2000 };
const SIGMA = 0.035;
const PAPER_OPT = { pH: 7.1, degC: 49, U: 5870, observed: 28.93 };

// 1. The design the tool builds: a three-factor Box-Behnken with the paper's five centre runs.
const bbd = D.boxBehnken(3, 5);
const edges = bbd.type.filter((t) => t === 'edge').length;

// 2. Evaluate the paper's own model at those runs (no noise) and fit it again with the tool.
const yExact = bbd.coded.map(([a, b, c]) => model(a, b, c));
const fit = D.quadratic(bbd.coded, yExact, ['A', 'B', 'C']);
const coef = Object.fromEntries(fit.coefs.map((c) => [c.name, c.est]));
const opt = { a: fit.stationary[0], b: fit.stationary[1], c: fit.stationary[2] };
const optReal = { pH: REAL.pH(opt.a), degC: REAL.degC(opt.b), U: REAL.U(opt.c), y: fit.yStationary };
const atPaperOpt = model(CODE.pH(PAPER_OPT.pH), CODE.degC(PAPER_OPT.degC), CODE.U(PAPER_OPT.U));

// 3. How well does a 17-run design pin that optimum down? Repeat the experiment 2,000 times with the paper's own
// residual scatter (0.035, OUR simulation), refit each time and look at where the optimum lands.
let seed = 4338;
const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);
const gauss = () => Math.sqrt(-2 * Math.log(rnd() + 1e-12)) * Math.cos(2 * Math.PI * rnd());
const simulate = (sigma, n = 2000) => {
  const reps = [];
  let notMax = 0, outside = 0;
  for (let i = 0; i < n; i++) {
    const y = yExact.map((v) => v + sigma * gauss());
    const f = D.quadratic(bbd.coded, y, ['A', 'B', 'C']);
    if (f.kind !== 'maximum') notMax++;
    if (!f.stationary) continue;
    if (Math.abs(f.stationary[0]) > 1 || Math.abs(f.stationary[1]) > 1 || Math.abs(f.stationary[2]) > 1) outside++;
    reps.push({ pH: REAL.pH(f.stationary[0]), degC: REAL.degC(f.stationary[1]), U: REAL.U(f.stationary[2]), y: f.yStationary, kind: f.kind });
  }
  const pct = (xs, p) => { const s = xs.slice().sort((x, y) => x - y); return s[Math.min(s.length - 1, Math.max(0, Math.round((p / 100) * (s.length - 1))))]; };
  const spread = (key) => [2.5, 50, 97.5].map((p) => pct(reps.map((r) => r[key]), p));
  return { sigma, n: reps.length, notMax, outside, reps, pH: spread('pH'), degC: spread('degC'), U: spread('U'), y: spread('y') };
};
const SIM = [simulate(SIGMA), simulate(SIGMA * 10)];
const reps = SIM[0].reps;

// 4. What a Plackett-Burman screening design of this size can do (the paper screened four factors in twelve runs).
const pb = D.plackettBurman(12);
const pbCols = pb[0].length;
const orth = (j, k) => pb.reduce((s, row) => s + row[j] * row[k], 0);
let worst = 0;
for (let j = 0; j < pbCols; j++) for (let k = j + 1; k < pbCols; k++) worst = Math.max(worst, Math.abs(orth(j, k)));
// Projected onto the paper's four screened factors: balance, orthogonality and how many of the twelve rows repeat.
const proj = pb.map((r) => r.slice(0, 4));
const pbProj = {
  plusPerColumn: [0, 1, 2, 3].map((j) => proj.filter((r) => r[j] > 0).length),
  worstDot: Math.max(...[0, 1, 2, 3].flatMap((j) => [0, 1, 2, 3].filter((k) => k > j).map((k) => Math.abs(proj.reduce((s, r) => s + r[j] * r[k], 0))))),
  repeatedRows: proj.map((r) => r.join()).filter((p, i, a) => a.indexOf(p) !== i).length,
  spareColumns: pbCols - 4,
};

// Chart 1: the fitted surface against temperature at the optimum pH, for three enzyme levels.
const temps = Array.from({ length: 101 }, (_, i) => 45 + i * 0.1);
const lines = [4000, 6000, 8000].map((U) => ({
  name: `${U.toLocaleString('en-GB')} U/g`,
  kind: 'line',
  x: temps,
  y: temps.map((t) => +model(opt.a, CODE.degC(t), CODE.U(U)).toFixed(3)),
}));
const fig1 = chart({
  title: 'Peptide yield against temperature (refitted model)',
  xLabel: 'Temperature (°C)', yLabel: 'Peptide extraction rate (%)',
  series: lines,
  xDomain: [45, 55], yDomain: [25.5, 29.5],
  vlines: [{ x: optReal.degC, text: `${optReal.degC.toFixed(1)} °C`, left: true }],
  desc: 'The refitted quadratic model plotted against temperature at the stationary-point pH, for enzyme additions of 4,000, 6,000 and 8,000 U/g. The peak sits near 49 degrees Celsius.',
  height: 260,
});

// Chart 2: where the optimum lands in 2,000 simulated repeats of the same 17-run design (every 7th repeat drawn, to
// keep the SVG small).
const thin = (a) => a.filter((_, i) => i % 40 === 0);
const fig2 = chart({
  title: 'Where a 17-run design puts the optimum',
  xLabel: 'Best temperature (°C)', yLabel: 'Best enzyme addition (U/g)',
  series: [
    { name: 'scatter 0.35', kind: 'dots', x: thin(SIM[1].reps).map((r) => +r.degC.toFixed(2)), y: thin(SIM[1].reps).map((r) => Math.round(r.U)), size: 1.7, opacity: 0.4, colour: 'var(--c-tools)' },
    { name: 'scatter 0.035 (as reported)', kind: 'dots', x: thin(reps).map((r) => +r.degC.toFixed(2)), y: thin(reps).map((r) => Math.round(r.U)), size: 1.7, opacity: 0.55 },
    { name: 'the paper\'s optimum', kind: 'dots', x: [PAPER_OPT.degC], y: [PAPER_OPT.U], size: 5, colour: 'var(--ink)' },
  ],
  xDomain: [46, 53], yDomain: [2000, 10000],
  desc: 'Each dot is the optimum found after refitting the same 17-run Box-Behnken design with fresh scatter. With the reported scatter of 0.035 the optimum is pinned to a tenth of a degree; with ten times that scatter it wanders over degrees and thousands of units per gram.',
  height: 270,
});

console.log(JSON.stringify({
  design: { runs: bbd.coded.length, edges, centres: bbd.coded.length - edges },
  recovered: Object.fromEntries(Object.entries(coef).map(([k, v]) => [k, +v.toFixed(6)])),
  r2: fit.r2, sigma: fit.sigma, kind: fit.kind, eigen: fit.eigen.map((v) => +v.toFixed(4)),
  stationary: { coded: [opt.a, opt.b, opt.c].map((v) => +v.toFixed(4)), pH: +optReal.pH.toFixed(3), degC: +optReal.degC.toFixed(2), U: Math.round(optReal.U), y: +optReal.y.toFixed(3) },
  paperOptimum: { ...PAPER_OPT, modelSays: +atPaperOpt.toFixed(3) },
  simulation: SIM.map((s) => ({ sigma: s.sigma, n: s.n, notMaximum: s.notMax, outsideTheBox: s.outside, pH: s.pH, degC: s.degC, U: s.U, y: s.y })),
  pb: { runs: pb.length, columns: pbCols, worstColumnDotProduct: worst, projectedOnFourFactors: pbProj },
}, (k, v) => (typeof v === 'number' ? +v.toFixed(6) : v), 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'surface', figure(fig1, 'Figure 1. The paper\'s quadratic model, refitted from scratch by the Experiment design tool\'s maths and drawn against temperature at the stationary-point pH of 7.07. The three curves are the low, centre and high enzyme additions; the dashed line is the temperature the tool picks out.'));
  md = inject(md, 'spread', figure(fig2, 'Figure 2. Our simulation: the same 17-run design repeated 2,000 times and refitted each time, with the paper\'s own residual scatter of 0.035 and with ten times that scatter (every fortieth repeat is drawn). The black dot is the optimum the paper reports.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
