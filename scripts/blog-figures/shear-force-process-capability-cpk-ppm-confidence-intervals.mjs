// Figures for src/blog/discoveries/shear-force-process-capability-cpk-ppm-confidence-intervals.md, made with the
// maths of the Control charts tool (src/lib/sci/eng-cc.ts: capability, with chi-square and Bissell intervals).
// Run: node scripts/blog-figures/shear-force-process-capability-cpk-ppm-confidence-intervals.mjs
import fs from 'node:fs';
import { capability, xbarChart, runRules } from '../../src/lib/sci/eng-cc.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/shear-force-process-capability-cpk-ppm-confidence-intervals.md', import.meta.url);

// Inputs from the paper: Cirtina et al. (2025), Processes 13(10): 3121, doi:10.3390/pr13103121 (CC BY 4.0).
// Shear force of the riveted joint: LSL 20 kN, USL 25 kN; after the fix mean 22.5 kN and standard deviation
// 0.5 kN with Cp = Cpk = 1.67; before the fix Cp = Cpk = 0.67. The sample size is not stated, so every count of
// parts below is OUR assumption.
const LSL = 20, USL = 25, MEAN = 22.5, SD = 0.5, CPK_BEFORE = 0.67;
const SD_BEFORE = (USL - LSL) / (6 * CPK_BEFORE); // the spread that gives a centred Cp of 0.67

/** N values whose mean and sample standard deviation are exactly m and s (so `capability` sees the paper's spread). */
const sample = (N, m, s) => {
  const b = Array.from({ length: N }, (_, i) => i + 1 - (N + 1) / 2);
  const mu = b.reduce((a, c) => a + c, 0) / N, sd = Math.sqrt(b.reduce((a, c) => a + (c - mu) ** 2, 0) / (N - 1));
  return b.map((v) => m + ((v - mu) * s) / sd);
};
const cap = (N, m, s, lsl = LSL, usl = USL) => capability(sample(N, m, s), s, lsl, usl, 0.95, N - 1);

const after = cap(30, MEAN, SD);
const before = cap(30, MEAN, SD_BEFORE);
const oneSided = capability(sample(30, MEAN, (USL - LSL) / 4), (USL - LSL) / 4, NaN, USL, 0.95, 29); // Cpk exactly 2/3
const ppmFor = (cpk) => cap(30, MEAN, (USL - LSL) / (6 * cpk)).ppmWithin;

// Figure 1: Cpk against where the mean sits, for three spreads.
const means = Array.from({ length: 201 }, (_, i) => LSL + (i * (USL - LSL)) / 200);
const SDS = [{ s: SD, name: 'σ = 0.5 kN (after the fix)' }, { s: 0.75, name: 'σ = 0.75 kN' }, { s: SD_BEFORE, name: 'σ = 1.24 kN (before)' }];
const fig1 = chart({
  title: 'How far the mean may drift before Cpk falls', xLabel: 'Mean shear force (kN)', yLabel: 'Cpk',
  series: SDS.map((d) => ({ name: d.name, kind: 'line', x: means, y: means.map((m) => +cap(30, m, d.s).Cpk.toFixed(4)) })),
  xDomain: [LSL, USL], yDomain: [0, 2], hlines: [{ y: 1.33, text: 'Cpk 1.33' }], vlines: [{ x: MEAN, text: '22.5 kN' }],
  desc: 'Cpk against the process mean between the 20 and 25 kN limits, for three process spreads. At 0.5 kN the peak is 1.67 at 22.5 kN and Cpk stays above 1.33 only between about 22.0 and 23.0 kN.',
  height: 285,
});

// Figure 2: the 95 % confidence interval for a measured Cpk of 1.67 against how many parts were measured.
const NS = Array.from({ length: 96 }, (_, i) => 10 + i * 2);
const ci = NS.map((N) => cap(N, MEAN, SD).ci.Cpk);
const nNeeded = NS.find((N) => cap(N, MEAN, SD).ci.Cpk[0] >= 1.33);
const fig2 = chart({
  title: 'A Cpk of 1.67 is only as sure as the sample behind it', xLabel: 'Parts measured', yLabel: 'Cpk, 95 % interval',
  series: [
    { name: 'Upper bound', kind: 'line', x: NS, y: ci.map((c) => +c[1].toFixed(4)), colour: 'var(--c-tools)' },
    { name: 'Estimate (1.67)', kind: 'line', x: NS, y: NS.map(() => 5 / 3), colour: 'var(--ink)', dash: '5 4' },
    { name: 'Lower bound', kind: 'line', x: NS, y: ci.map((c) => +c[0].toFixed(4)), colour: 'var(--c-blog)' },
  ],
  xDomain: [10, 200], yDomain: [0.6, 2.6], hlines: [{ y: 1.33, text: 'Cpk 1.33' }],
  vlines: [{ x: nNeeded, text: `${nNeeded} parts`, left: true }],
  desc: 'The 95 per cent confidence interval for a Cpk estimate of 1.67 narrows as more parts are measured. The lower bound only clears 1.33 at about fifty parts.',
  height: 285,
});

// A small simulated run (OUR data, not the paper's): 6 subgroups of 3 drawn from mean 22.5 kN, σ 0.5 kN, for the
// "Check it yourself" steps, so a reader can see the same numbers the real tool shows.
let seed = 3121;
const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);
const gauss = () => Math.sqrt(-2 * Math.log(rnd() + 1e-12)) * Math.cos(2 * Math.PI * rnd());
const groups = Array.from({ length: 6 }, () => Array.from({ length: 3 }, () => +(MEAN + SD * gauss()).toFixed(2)));
const xr = xbarChart(groups, 'xbar-r');
const demo = capability(groups.flat(), xr.sigmaWithin, LSL, USL, 0.95, groups.length * (groups[0].length - 1));

const out = {
  demo: {
    groups, xbb: +xr.mean.toFixed(4), rbar: +xr.second.cl.toFixed(4), ucl: +xr.main.ucl[0].toFixed(3), lcl: +xr.main.lcl[0].toFixed(3),
    uclR: +xr.second.ucl[0].toFixed(3), sigmaWithin: +xr.sigmaWithin.toFixed(4), A2: +xr.constants.A2.toFixed(4), D4: +xr.constants.D4.toFixed(4),
    flags: runRules(xr.main, 'we').map((v, i) => (v.length ? [i + 1, v] : null)).filter(Boolean),
    Cp: +demo.Cp.toFixed(3), Cpk: +demo.Cpk.toFixed(3), Pp: +demo.Pp.toFixed(3), Ppk: +demo.Ppk.toFixed(3),
    ciCp: demo.ci.Cp.map((v) => +v.toFixed(3)), ciCpk: demo.ci.Cpk.map((v) => +v.toFixed(3)), ppm: +demo.ppmWithin.toFixed(1), ppmOverall: +demo.ppmOverall.toFixed(1),
  },
  sdBefore: +SD_BEFORE.toFixed(4),
  after: { Cp: +after.Cp.toFixed(4), Cpk: +after.Cpk.toFixed(4), ppm: +after.ppmWithin.toFixed(3), ci30: after.ci.Cpk.map((v) => +v.toFixed(3)) },
  before: { Cp: +before.Cp.toFixed(4), Cpk: +before.Cpk.toFixed(4), ppm: Math.round(before.ppmWithin), pct: +(before.ppmWithin / 1e4).toFixed(2) },
  oneSided: { CPU: +oneSided.CPU.toFixed(4), ppm: +oneSided.ppmWithin.toFixed(1), inside: +(100 - oneSided.ppmWithin / 1e4).toFixed(3) },
  ppmLadder: [0.67, 1.0, 1.33, 1.67, 2.0].map((c) => [c, +ppmFor(c).toPrecision(4)]),
  driftWindow: [1.0, 1.33, 1.67].map((t) => [t, +((USL - LSL) / 2 - 3 * t * SD).toFixed(3)]),
  toleranceUsed: +((6 * SD) / (USL - LSL) * 100).toFixed(1),
  nNeeded, ciAt: [20, 52, 100].map((N) => [N, cap(N, MEAN, SD).ci.Cpk.map((v) => +v.toFixed(3))]),
};
console.log(JSON.stringify(out, null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'drift', figure(fig1, 'Figure 1. Cpk against the mean shear force, worked out with the Control charts tool\'s capability maths for the paper\'s 20 to 25 kN limits. The dashed line is the 1.33 the paper sets as its target.'));
  md = inject(md, 'ci', figure(fig2, 'Figure 2. The 95 % confidence interval (Bissell\'s approximation, as in the tool) for a Cpk estimate of 1.67, against the number of parts measured. The number of parts is our assumption: the paper does not say how many it measured.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
