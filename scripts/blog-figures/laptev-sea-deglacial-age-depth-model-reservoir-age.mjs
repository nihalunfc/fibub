// Figures for src/blog/discoveries/laptev-sea-deglacial-age-depth-model-reservoir-age.md, made with the maths of the
// Age-depth model builder (src/lib/sci/agedepth.ts: linear interpolation, smoothing spline, order-preserving Monte
// Carlo). Run: node scripts/blog-figures/laptev-sea-deglacial-age-depth-model-reservoir-age.mjs
import fs from 'node:fs';
import { parseLevels, linearAt, linearSlope, splineForChi2, splineAt, monteCarlo, flagLevels, depthGrid } from '../../src/lib/sci/agedepth.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/laptev-sea-deglacial-age-depth-model-reservoir-age.md', import.meta.url);

// Inputs from the paper: Nicolas et al. (2024), Climate of the Past 20: 2617-2628 (CC BY 4.0).
// Core PS2458-4, 8 m long, 983 m water depth; initial dR -110 +/- 28 14C yr (Bauch et al., 2001); revised dR
// +345 +/- 60 14C yr, giving a local marine reservoir age of 848 +/- 90 14C yr against a global 503 +/- 63;
// sedimentation about 77 cm/kyr through the deglacial (16.5 to 9.3 kyr BP) and about 27 cm/kyr in the early Holocene.
// OUR CONSTRUCTION: the paper's dated levels are in a table we cannot read, so we build nine levels that follow its
// two stated rates exactly, with 1-sigma errors of 100 years (Holocene) and 120 years (deglacial).
const DR_OLD = -110, DR_NEW = 345, MRA_GLOBAL = 503, SD_GLOBAL = 63, SD_DR = 60;
const R_HOL = 27, R_DEG = 77, T_BREAK = 9300, CORE = 800; // cm/kyr, cm/kyr, yr BP, cm
const BREAK_DEPTH = (R_HOL * T_BREAK) / 1000; // 251.1 cm
const ageAt = (d) => (d <= BREAK_DEPTH ? (d / R_HOL) * 1000 : T_BREAK + ((d - BREAK_DEPTH) / R_DEG) * 1000);
const DEPTHS = [30, 100, 180, 251, 330, 430, 540, 660, 780];
const LEVELS_TXT = ['depth_cm,age_cal_BP,sd,label', ...DEPTHS.map((d, i) => {
  const sd = d <= BREAK_DEPTH ? 100 : 120;
  return `${d},${Math.round(ageAt(d))},${sd},${i < 4 ? 'mbf' : 'mb'}`;
})].join('\n');
const { levels } = parseLevels(LEVELS_TXT);
const x = levels.map((l) => l.depth), y = levels.map((l) => l.age), sd = levels.map((l) => l.sd);

// Paper's own arithmetic, recomputed.
const mra = MRA_GLOBAL + DR_NEW, mraSd = Math.hypot(SD_GLOBAL, SD_DR);
const shift = DR_NEW - DR_OLD, shiftSd = Math.hypot(SD_DR, 28);
// Do the two stated rates fill an 8 m core over the stated interval?
const fill = BREAK_DEPTH + ((16500 - T_BREAK) / 1000) * R_DEG;

const grid = depthGrid(0, CORE, 5);
const mc = monteCarlo(levels, grid, 2000, 1, true);
const sp = splineForChi2(x, y, sd, levels.length);
const width = mc.hi.map((v, i) => v - mc.lo[i]);
const at = (d) => { const i = grid.indexOf(d); return { linear: +linearAt(x, y, d, true).toFixed(0), spline: +splineAt(sp, d, true).toFixed(0), med: +mc.median[i].toFixed(0), lo: +mc.lo[i].toFixed(0), hi: +mc.hi[i].toFixed(0), width: +width[i].toFixed(0), rate: +(1000 / linearSlope(x, y, d, true)).toFixed(1) }; };
const flags = flagLevels(levels, sp).filter((f) => f.outlier || f.reversal).length;

const fig1 = chart({
  title: 'Age-depth model for an 8 m Laptev Sea core', xLabel: 'Depth in core (cm)', yLabel: 'Age (cal yr BP)',
  series: [
    { name: 'Monte Carlo 2.5 %', kind: 'line', dash: '4 4', x: grid, y: mc.lo.map((v) => +v.toFixed(0)), colour: 'var(--muted)' },
    { name: 'Monte Carlo median', kind: 'line', x: grid, y: mc.median.map((v) => +v.toFixed(0)) },
    { name: 'Monte Carlo 97.5 %', kind: 'line', dash: '4 4', x: grid, y: mc.hi.map((v) => +v.toFixed(0)), colour: 'var(--muted)', noLegend: true },
    { name: 'Dated levels', kind: 'dots', x, y, size: 3.5, errors: sd.map((s) => 2 * s), colour: 'var(--ink)' },
  ],
  xDomain: [0, 800], yDomain: [0, 18000],
  vlines: [{ x: 251, text: 'rate changes' }],
  desc: 'Age-depth model built from nine levels that follow the paper\'s two sedimentation rates, with the order-preserving Monte Carlo median and its 95 per cent envelope.', height: 290,
});

const fig2 = chart({
  title: 'Is the reservoir-age revision bigger than the age model\'s own error?', xLabel: 'Depth in core (cm)', yLabel: 'Years',
  series: [{ name: '95 % envelope width', kind: 'line', x: grid, y: width.map((v) => +v.toFixed(0)) }],
  xDomain: [0, 800], yDomain: [0, 900],
  hlines: [{ y: shift, text: '455 yr reservoir-age revision' }],
  desc: 'The width of the Monte Carlo 95 per cent age envelope down the core, against the 455-year shift the paper\'s revised reservoir age applies to every date.', height: 280,
});

const out = {
  levels: LEVELS_TXT.split('\n'), breakDepth: +BREAK_DEPTH.toFixed(1), fill: +fill.toFixed(1),
  mra, mraSd: +mraSd.toFixed(1), shift, shiftSd: +shiftSd.toFixed(1),
  mcKept: mc.n, tries: mc.tries, chi2: +sp.chi2.toFixed(3), flags,
  at: Object.fromEntries([0, 100, 250, 400, 600, 800].map((d) => [d, at(d)])),
  widthMin: +Math.min(...width).toFixed(0), widthMax: +Math.max(...width).toFixed(0),
  widthAtLevels: x.map((d) => +width[grid.indexOf(Math.round(d / 5) * 5)].toFixed(0)),
  rateTop: +(1000 / linearSlope(x, y, 100, true)).toFixed(1), rateDeep: +(1000 / linearSlope(x, y, 500, true)).toFixed(1),
};
console.log(JSON.stringify(out, null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'model', figure(fig1, "Figure 1. The age-depth model the tool builds from nine levels that follow the paper's own sedimentation rates (2σ error bars), with the Monte Carlo median and its 95 % envelope. Our construction, not the paper's dated levels."));
  md = inject(md, 'shift', figure(fig2, "Figure 2. The width of the 95 % age envelope down the core, against the 455-year shift the revised reservoir age applies to every radiocarbon date. Below 300 cm the reservoir revision is the larger of the two."));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
