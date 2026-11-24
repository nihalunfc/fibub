// Figures for src/blog/discoveries/aircraft-ring-assembly-tolerance-cpk-pass-rate.md, made with the maths of the
// Tolerance stack-up tool (src/lib/sci/eng-stack.ts: stack(), fallout(), monteCarlo(), summarise()).
// Run: node scripts/blog-figures/aircraft-ring-assembly-tolerance-cpk-pass-rate.mjs
import fs from 'node:fs';
import { stack, fallout, monteCarlo, summarise } from '../../src/lib/sci/eng-stack.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/aircraft-ring-assembly-tolerance-cpk-pass-rate.md', import.meta.url);

// Inputs from the paper: Cao, Huang, Li and Hou (2025), Machines 13(8): 736, doi:10.3390/machines13080736 (CC BY).
// Position pass rate 67.4 % -> 100.0 % and Cpk 0.31 -> 2.19; coaxiality 93.5 % -> 100.0 % and Cpk 0.62 -> 1.06;
// 20,000 Monte Carlo assemblies; automated cells quoted at about +/-0.05 mm against about +/-0.2 mm by hand.
const PAPER = [
  { name: 'Position, before', cpk: 0.31, pass: 0.674 },
  { name: 'Coaxiality, before', cpk: 0.62, pass: 0.935 },
  { name: 'Coaxiality, after', cpk: 1.06, pass: 1.0 },
  { name: 'Position, after', cpk: 2.19, pass: 1.0 },
];
const N_MC = 20000;

// Pass rate implied by a capability index, in units of sigma: a two-sided limit with the mean in the middle,
// and a single upper limit. fallout() is the tool's own normal model.
const twoSided = (cpk) => 1 - fallout(0, 1, -3 * cpk, 3 * cpk).total;
const oneSided = (cpk) => 1 - fallout(0, 1, -Infinity, 3 * cpk).total;
// How far off centre (in sigma) the mean must sit for a given Cpk to give exactly this pass rate.
function offCentre(cpk, pass) {
  let lo = 0, hi = 3;
  for (let i = 0; i < 80; i++) { const m = (lo + hi) / 2; (1 - fallout(m, 1, -(3 * cpk + 2 * m), 3 * cpk).total) > pass ? (lo = m) : (hi = m); }
  const m = (lo + hi) / 2, f = fallout(m, 1, -(3 * cpk + 2 * m), 3 * cpk);
  return { off: m, Cp: f.Cp, Cpk: f.Cpk, pass: 1 - f.total };
}

// OUR demonstration chain for a ring-on-ring position error (invented numbers, five contributors, mm):
const CHAIN = [
  { name: 'Frame datum hole', nominal: 0, plus: 0.40, minus: 0.40, dir: 1, dist: 'normal' },
  { name: 'Robot pose', nominal: 0, plus: 0.20, minus: 0.20, dir: 1, dist: 'normal' },
  { name: 'Fixture location', nominal: 0, plus: 0.20, minus: 0.20, dir: 1, dist: 'normal' },
  { name: 'Ring machining', nominal: 0, plus: 0.12, minus: 0.12, dir: 1, dist: 'normal' },
  { name: 'Measurement', nominal: 0, plus: 0.08, minus: 0.08, dir: 1, dist: 'normal' },
];
const scaled = (f) => CHAIN.map((d) => ({ ...d, plus: d.plus * f, minus: d.minus * f }));
const S0 = stack(CHAIN);
// The position band that gives the paper's starting Cpk of 0.31 with this chain.
const USL = 3 * 0.31 * S0.sigma, LSL = -USL;
const cpkOf = (f) => fallout(0, stack(scaled(f)).sigma, LSL, USL).Cpk;
const need = 0.31 / 2.19;                                     // sigma must shrink by this factor
// Decoupling alone: drop the largest contributor alteogether.
const noBiggest = stack(CHAIN.slice(1));
const mc0 = summarise(monteCarlo(CHAIN, N_MC, 736), LSL, USL);
const mc1 = summarise(monteCarlo(scaled(need), N_MC, 736), LSL, USL);

const CPK = Array.from({ length: 111 }, (_, i) => 0.1 + i * 0.02);
const fig1 = chart({
  title: 'A capability index already fixes the pass rate', xLabel: 'Cpk', yLabel: 'Assemblies within the limits (%)',
  series: [
    { name: 'two-sided limits, centred', kind: 'line', x: CPK, y: CPK.map((c) => +(twoSided(c) * 100).toFixed(4)) },
    { name: 'one upper limit', kind: 'line', x: CPK, y: CPK.map((c) => +(oneSided(c) * 100).toFixed(4)), dash: '5 3' },
    { name: 'the paper', kind: 'dots', size: 4.5, x: PAPER.map((p) => p.cpk), y: PAPER.map((p) => p.pass * 100), colour: 'var(--ink)' },
  ],
  xDomain: [0.1, 2.3], yDomain: [60, 101], hlines: [{ y: 100, text: '' }],
  desc: 'Percentage of assemblies inside the limits against Cpk, for a centred two-sided characteristic and for a single upper limit, with the four pass rate and Cpk pairs the paper reports marked as dots.',
  height: 290,
});

const FS = Array.from({ length: 101 }, (_, i) => 0.1 + i * 0.011);
const fig2 = chart({
  title: 'How much tighter the chain has to be', xLabel: 'Every tolerance in the chain multiplied by', yLabel: 'Cpk of the stack',
  series: [
    { name: '', noLegend: true, kind: 'line', x: FS, y: FS.map((f) => +cpkOf(f).toFixed(4)) },
    { name: '', noLegend: true, kind: 'dots', size: 4.5, x: [1, need], y: [+cpkOf(1).toFixed(3), +cpkOf(need).toFixed(3)], colour: 'var(--ink)' },
  ],
  xDomain: [0.1, 1.15], yDomain: [0, 2.6],
  hlines: [{ y: 2.19, text: 'after (2.19)' }, { y: 1.33, text: 'usual aim (1.33)' }, { y: 0.31, text: 'before (0.31)' }],
  vlines: [{ x: +need.toFixed(3), text: `x ${need.toFixed(3)}`, dy: 28 }, { x: +Math.sqrt(1 - S0.share[0]).toFixed(3), text: 'biggest part removed', dy: 56, left: true }],
  desc: 'Cpk of the five-link demonstration chain when every tolerance is multiplied by the factor on the x-axis. Reaching 2.19 from 0.31 needs a factor of about one seventh.',
  height: 300,
});

console.log(JSON.stringify({
  pairs: PAPER.map((p) => ({ ...p, twoSided: +(twoSided(p.cpk) * 100).toFixed(3), oneSided: +(oneSided(p.cpk) * 100).toFixed(3),
    outPpm: +((1 - twoSided(p.cpk)) * 1e6).toFixed(1), outOf20k: +((1 - twoSided(p.cpk)) * N_MC).toFixed(1),
    offNeeded: p.pass < 1 ? +offCentre(p.cpk, p.pass).off.toFixed(3) : null,
    cpNeeded: p.pass < 1 ? +offCentre(p.cpk, p.pass).Cp.toFixed(3) : null })),
  sigmaRatio: +(2.19 / 0.31).toFixed(2),
  chain: { sigma: +S0.sigma.toFixed(5), wcHalf: +S0.wcHalf.toFixed(3), rssHalf: +S0.rssHalf.toFixed(4), shares: S0.share.map((s) => +(s * 100).toFixed(1)),
    USL: +USL.toFixed(4), cpk0: +cpkOf(1).toFixed(3), cpkNeed: +cpkOf(need).toFixed(3), factor: +need.toFixed(4),
    tightened: scaled(need).map((d) => +d.plus.toFixed(4)),
    noBiggestSigma: +noBiggest.sigma.toFixed(5), noBiggestCpk: +fallout(0, noBiggest.sigma, LSL, USL).Cpk.toFixed(3), shrinkFromDecoupling: +Math.sqrt(1 - S0.share[0]).toFixed(3) },
  monteCarlo: { before: { out: +((mc0.below + mc0.above) * 100).toFixed(2), sd: +mc0.sd.toFixed(5), p: [+mc0.p00135.toFixed(4), +mc0.p99865.toFixed(4)] },
    after: { out: +((mc1.below + mc1.above) * 100).toFixed(3), sd: +mc1.sd.toFixed(5), worst: +Math.max(Math.abs(mc1.min), Math.abs(mc1.max)).toFixed(4) } },
  cpk106: { out: +((1 - twoSided(1.06)) * 1e6).toFixed(0), oneIn: Math.round(1 / (1 - twoSided(1.06))) },
  cpk219: { outPpb: +((1 - twoSided(2.19)) * 1e9).toFixed(2) },
}, null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'cpk', figure(fig1, 'Figure 1. The share of assemblies inside the limits that a given Cpk implies, worked out with the tool’s normal model, for a centred two-sided characteristic (solid) and for a single upper limit (dashed). The dots are the paper’s four pass rate and Cpk pairs.'));
  md = inject(md, 'tighten', figure(fig2, 'Figure 2. Cpk of our five-link demonstration chain as every tolerance in it is multiplied by the factor on the x-axis. The dots mark the starting point, set to the paper’s Cpk of 0.31, and the one-seventh tightening needed to reach 2.19.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
