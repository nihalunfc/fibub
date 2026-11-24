// Figures for src/blog/discoveries/german-landfill-workers-cancer-sir-smr-exact-poisson.md, made with the maths of
// the Rate standardisation tool (src/lib/sci/ratestd.ts: indirect standardisation, exact Poisson limits, crude rates).
// Run: node scripts/blog-figures/german-landfill-workers-cancer-sir-smr-exact-poisson.mjs
import fs from 'node:fs';
import { indirect, crude } from '../../src/lib/sci/ratestd.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/german-landfill-workers-cancer-sir-smr-exact-poisson.md', import.meta.url);

// A one-row "age group" that makes the expected count come out at E: population 100 000 at a standard rate of E
// per 100 000. The tool's indirect mode then gives the ratio observed/expected with exact Poisson limits.
const ratio = (O, E) => indirect([{ name: 'all ages', pop: 1e5, rate: E }], O, 1e5, 0.95);
const f2 = (v) => v.toFixed(2);

// Observed and expected counts stated in the paper (Manz et al. 2024, BMC Public Health 24: 3560).
const STATED = [
  { key: 'sir', label: 'SIR, all cancers', O: 31, E: 44.8, paper: '0.69 (0.47, 0.98)' },
  { key: 'smr', label: 'SMR, all causes', O: 31, E: 60.3, paper: '0.51 (0.35, 0.73)' },
  { key: 'smr1y', label: 'SMR, >=1 year only', O: 30, E: 56.2, paper: '0.53 (0.36, 0.76)' },
];

// The paper prints the men's and women's ratios with their limits but not the counts behind them. An exact Poisson
// interval for a count O is O's own interval divided by the expected count, so its WIDTH in log terms depends only
// on O. We therefore look for every whole count O, and every expected count E allowed by the printed ratio's own
// rounding, whose exact limits round to exactly the three printed numbers.
const r2 = (v) => Math.round(v * 100) / 100;
function recover(point, lo, hi) {
  const out = [];
  for (let O = 1; O <= 80; O++) {
    const u = ratio(O, 1); // limits per unit of expected count
    const eLo = O / (point + 0.005), eHi = O / (point - 0.005);
    let fit = null;
    for (let i = 0; i <= 4000; i++) {
      const E = eLo + ((eHi - eLo) * i) / 4000;
      if (r2(O / E) === point && r2(u.ci[0] / E) === lo && r2(u.ci[1] / E) === hi) fit = fit ? { ...fit, eHi: E } : { eLo: E, eHi: E };
    }
    if (fit) out.push({ O, eLo: fit.eLo, eHi: fit.eHi });
  }
  const best = out[0] ?? { O: NaN, eLo: NaN, eHi: NaN };
  const mid = (best.eLo + best.eHi) / 2, r = ratio(best.O, mid);
  return { counts: out.map((o) => o.O), O: best.O, E: mid, eLo: best.eLo, eHi: best.eHi, lo: r.ci[0], hi: r.ci[1] };
}
// `pick` is the count from the fitting set that makes men + women add up to the 31 cases and 31 deaths the paper
// reports for the whole cohort.
const SPLIT = [
  { label: 'SIR, men', point: 0.72, lo: 0.47, hi: 1.05, pick: 26 },
  { label: 'SIR, women', point: 0.59, lo: 0.19, hi: 1.38, pick: 5 },
  { label: 'SMR, men', point: 0.54, lo: 0.36, hi: 0.78, pick: 29 },
  { label: 'SMR, women', point: 0.30, lo: 0.04, hi: 1.09, pick: 2 },
].map((s) => {
  const r = recover(s.point, s.lo, s.hi);
  if (!r.counts.includes(s.pick)) throw new Error(`${s.label}: ${s.pick} is not one of the counts that fit (${r.counts.join(',')}).`);
  const E = s.pick / s.point, g = ratio(s.pick, E);
  return { ...s, ...r, O: s.pick, E, lo: g.ci[0], hi: g.ci[1] };
});

console.log('--- stated counts, recomputed ---');
for (const s of STATED) { const r = ratio(s.O, s.E); console.log(s.label, s.O, '/', s.E, '=', r.smr.toFixed(4), '(', r.ci[0].toFixed(4), ',', r.ci[1].toFixed(4), ') p =', r.p.toExponential(3), ' paper:', s.paper); }
console.log('--- counts read back from the printed limits ---');
for (const s of SPLIT) console.log(s.label, '| counts that fit:', s.counts.join(','), '| using', s.O, 'with expected', s.E.toFixed(2), '->', (s.O / s.E).toFixed(3), '(', s.lo.toFixed(3), ',', s.hi.toFixed(3), ') paper:', s.point, s.lo, s.hi);
console.log('--- crude rates per 100 000 person-years ---');
const ci = crude(31, 6374, 'rate', 1e5), cm = crude(31, 6556, 'rate', 1e5);
console.log('incidence', ci.est.toFixed(1), ci.ci.map((v) => v.toFixed(1)));
console.log('mortality', cm.est.toFixed(1), cm.ci.map((v) => v.toFixed(1)));

/* ---------------------------------------------------------------- Figure 1: the ratios with exact limits */
const ROWS = [
  { label: 'SIR all cancers', O: 31, E: 44.8 },
  { label: 'SIR men', O: SPLIT[0].O, E: SPLIT[0].E },
  { label: 'SIR women', O: SPLIT[1].O, E: SPLIT[1].E },
  { label: 'SMR all causes', O: 31, E: 60.3 },
  { label: 'SMR men', O: SPLIT[2].O, E: SPLIT[2].E },
  { label: 'SMR women', O: SPLIT[3].O, E: SPLIT[3].E },
].map((r, i) => ({ ...r, y: ROWS_Y(i), ...ratio(r.O, r.E) }));
function ROWS_Y(i) { return 6 - i; }

const series1 = [];
for (const r of ROWS) series1.push({ x: [r.ci[0], r.ci[1]], y: [r.y, r.y], colour: r.ci[1] < 1 ? 'var(--c-blog)' : 'var(--c-tools)', noLegend: true });
series1.push({ x: ROWS.map((r) => r.smr), y: ROWS.map((r) => r.y), kind: 'dots', size: 4, colour: 'var(--ink)', noLegend: true });
const NAMES = Object.fromEntries(ROWS.map((r) => [r.y, r.label]));
const fig1 = chart({
  title: 'Observed cancers and deaths against expected',
  xLabel: 'Ratio observed / expected (1 = as expected)',
  yLabel: '',
  series: series1,
  xDomain: [0, 1.6], yDomain: [0.4, 6.6],
  yTicks: [1, 2, 3, 4, 5, 6], yFmt: (v) => NAMES[v] ?? '',
  vlines: [{ x: 1, text: 'as expected' }],
  height: 250,
  desc: 'Six ratios of observed to expected cases, each with its exact 95 per cent Poisson interval. All six point estimates are below one; the two all-cohort ratios and the men-only mortality ratio have intervals that stay below one.',
});

/* ---------------------------------------------------------------- Figure 2: what an exact interval can detect */
// For a given expected count E, the highest ratio whose exact upper limit still falls below 1 (a detectable
// shortfall) and the lowest ratio whose lower limit rises above 1 (a detectable excess).
const Es = [], loCurve = [], hiCurve = [];
for (let E = 2; E <= 200; E += 1) {
  let belowO = -1, aboveO = -1;
  for (let O = 0; O <= 400; O++) {
    const r = ratio(Math.max(O, 0), E);
    if (r.ci[1] < 1) belowO = O;
    if (aboveO < 0 && O > 0 && r.ci[0] > 1) aboveO = O;
  }
  Es.push(E); loCurve.push(belowO >= 0 ? belowO / E : NaN); hiCurve.push(aboveO >= 0 ? aboveO / E : NaN);
}
const fig2 = chart({
  title: 'What a cohort of that size can detect',
  xLabel: 'Expected cases or deaths',
  yLabel: 'Ratio observed / expected',
  series: [
    { name: 'Shortfall still provable', x: Es, y: loCurve, kind: 'step' },
    { name: 'Excess still provable', x: Es, y: hiCurve, colour: 'var(--c-tools)', kind: 'step' },
  ],
  xDomain: [0, 200], yDomain: [0, 3.2],
  hlines: [{ y: 1, text: 'as expected' }],
  vlines: [{ x: 44.8, text: '44.8 expected cancers', dy: 14 }, { x: 60.3, text: '60.3 expected deaths', dy: 32 }],
  height: 280,
  desc: 'Two step curves against the expected number of events. With about 7 expected events only a ratio near zero can be shown to be below one, while with 45 expected events a ratio of about 0.6 can.',
});
console.log('--- detection curves ---');
for (const E of [6.7, 8.5, 20, 44.8, 60.3, 100]) {
  const i = Es.indexOf(Math.round(E));
  console.log('E =', E, 'provable shortfall at or below', loCurve[i]?.toFixed(3), ', provable excess at or above', hiCurve[i]?.toFixed(3));
}

let md = fs.readFileSync(ART, 'utf8');
md = inject(md, 'forest', figure(fig1, 'Figure 1. The paper’s six ratios of observed to expected events, recomputed from the counts with the Rate standardisation tool’s exact Poisson limits. Dark bars stay wholly below one; the men’s and women’s counts were read back from the printed limits.'));
md = inject(md, 'detect', figure(fig2, 'Figure 2. For each number of expected events, the lowest ratio whose exact 95 per cent interval still reaches one (lower curve) and the highest (upper curve). Between the curves nothing can be shown. Computed with the same exact Poisson limits the tool uses.'));
fs.writeFileSync(ART, md);
console.log('fig1', fig1.length, 'bytes; fig2', fig2.length, 'bytes');
