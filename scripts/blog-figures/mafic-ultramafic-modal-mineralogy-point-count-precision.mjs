// Figures for src/blog/discoveries/mafic-ultramafic-modal-mineralogy-point-count-precision.md, made with the maths of
// the Point counter (src/lib/sci/pointcount.ts: binomial standard error, Van der Plas and Tobi 2σ, exact intervals).
// Run: node scripts/blog-figures/mafic-ultramafic-modal-mineralogy-point-count-precision.mjs
import fs from 'node:fs';
import { classStat, twoSigma, pointsNeeded } from '../../src/lib/sci/pointcount.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/mafic-ultramafic-modal-mineralogy-point-count-precision.md', import.meta.url);

// Modal percentages as printed in the running text of Taksavasu (2025), Geosciences 15(3): 89,
// doi:10.3390/geosciences15030089 (CC BY). Point counting: 1 mm grid, "at least 400 points per thin section".
const GABBRO_A = { name: 'Pyroxene-hornblende gabbronorite (Mae Chan)', modes: { plagioclase: 29.25, hornblende: 28.25, clinopyroxene: 21.25, orthopyroxene: 17.75, olivine: 1.0, opaques: 0.75, secondary: 1.75 } };
const GABBRO_B = { name: 'Gabbronorite (Mae Chan)', modes: { plagioclase: 54.75, clinopyroxene: 17.25, opaques: 11.5, orthopyroxene: 6.0, olivine: 3.25, amphibole: 3.75, chlorite: 3.5 } };
const PERIDOTITE = { olivineLo: 62, olivineHi: 67.25, cpxLo: 6.75, cpxHi: 9.25, plagLo: 9, plagHi: 12.5, spinelLo: 1.25, spinelHi: 2.5, secLo: 8.25, secHi: 18 };
const BASALT = [10.63, 8.71, 50, 41.03, 38, 20.25, 12.31, 14.13]; // vesicular olivine basalt modes
const N = 400; // the count implied by the quarter-percent steps; see the forensic check below

const sum = (o) => +Object.values(o).reduce((s, v) => s + v, 0).toFixed(4);
const pct = (v) => (v * 100);
const row = (p, n = N) => { const s = classStat(Math.round((p / 100) * n), n); return { p, k: Math.round((p / 100) * n), se: +pct(s.se).toFixed(2), two: +pct(s.twoSigma).toFixed(2), exact: s.exact.map((v) => +pct(v).toFixed(2)) }; };

// 1. Do the quarter-percent values imply exactly 400 points? Smallest N for which every value is a whole count.
const quarters = [...Object.values(GABBRO_A.modes), ...Object.values(GABBRO_B.modes), PERIDOTITE.olivineHi, PERIDOTITE.cpxLo, PERIDOTITE.plagHi, PERIDOTITE.spinelLo, PERIDOTITE.secLo];
const fitsN = (vals, n, tol = 1e-6) => vals.every((v) => Math.abs((v / 100) * n - Math.round((v / 100) * n)) < tol);
let nQuarter = null; for (let n = 20; n <= 4000 && nQuarter === null; n++) if (fitsN(quarters, n)) nQuarter = n;
// 2. The basalt values are not quarter-percents: which count would make them whole numbers (to 0.005 % rounding)?
let nBasalt = []; for (let n = 100; n <= 2000; n++) if (BASALT.every((v) => Math.abs((v / 100) * n - Math.round((v / 100) * n)) <= 0.005 * n / 100 + 1e-9)) nBasalt.push(n);

// 3. Precision of the published modes at 400 points.
const A = Object.fromEntries(Object.entries(GABBRO_A.modes).map(([k, v]) => [k, row(v)]));
const B = Object.fromEntries(Object.entries(GABBRO_B.modes).map(([k, v]) => [k, row(v)]));
const plagBoundary = { at10: { two: +pct(twoSigma(0.1, N)).toFixed(2), exact: classStat(Math.round(0.1 * N), N).exact.map((v) => +pct(v).toFixed(2)) }, lo: row(PERIDOTITE.plagLo), hi: row(PERIDOTITE.plagHi) };
const needed = { p10e2: pointsNeeded(0.1, 0.02), p10e1: pointsNeeded(0.1, 0.01), p50e5: pointsNeeded(0.5, 0.05), p50e2: pointsNeeded(0.5, 0.02), p20e3: pointsNeeded(0.2, 0.03) };
// Can the two gabbros be told apart on orthopyroxene, and olivine 1.0 vs 3.25 %?
const opxGap = { a: A.orthopyroxene, b: B.orthopyroxene, overlap: A.orthopyroxene.exact[0] <= B.orthopyroxene.exact[1] };
const olGap = { a: A.olivine, b: B.olivine, overlap: A.olivine.exact[1] >= B.olivine.exact[0] };

// Figure 1: the Van der Plas and Tobi precision curve for three counts, with the paper's phases on the 400-point line.
const ps = Array.from({ length: 101 }, (_, i) => i);
const curve = (n) => ps.map((p) => +pct(twoSigma(p / 100, n)).toFixed(3));
const phaseP = [...Object.values(GABBRO_A.modes), ...Object.values(GABBRO_B.modes)].sort((a, b) => a - b);
const fig1 = chart({
  title: 'How sharp is a modal percentage after N points?', xLabel: 'Modal percentage of one mineral (%)', yLabel: '2σ (percentage points)',
  series: [
    { name: '400 points', kind: 'line', x: ps, y: curve(400) },
    { name: '900 points', kind: 'line', x: ps, y: curve(900) },
    { name: '2000 points', kind: 'line', x: ps, y: curve(2000) },
    { name: "This paper's phases, 400 points", kind: 'dots', x: phaseP, y: phaseP.map((p) => +pct(twoSigma(p / 100, 400)).toFixed(3)), size: 3, colour: 'var(--ink)' },
  ],
  xDomain: [0, 100], yDomain: [0, 5.4], hlines: [{ y: 2, text: '2 percentage points' }],
  desc: 'The two-sigma precision of a modal percentage against the percentage itself, for counts of 400, 900 and 2000 points. At 400 points the widest uncertainty is 5 percentage points at 50 per cent. The minerals reported in the paper are marked on the 400-point curve.', height: 290,
});

// Figure 2: how many points for a wanted precision.
const pp = Array.from({ length: 99 }, (_, i) => i + 1);
const fig2 = chart({
  title: 'Points needed for a wanted precision', xLabel: 'Modal percentage of one mineral (%)', yLabel: 'Points needed',
  series: [
    { name: '2σ = 5 points', kind: 'line', x: pp, y: pp.map((p) => pointsNeeded(p / 100, 0.05)) },
    { name: '2σ = 3 points', kind: 'line', x: pp, y: pp.map((p) => pointsNeeded(p / 100, 0.03)) },
    { name: '2σ = 2 points', kind: 'line', x: pp, y: pp.map((p) => pointsNeeded(p / 100, 0.02)) },
  ],
  xDomain: [0, 100], yDomain: [0, 2600], hlines: [{ y: 400, text: "the paper's 400 points" }],
  vlines: [{ x: 10, text: '10 % boundary', dy: 0 }],
  desc: 'The number of points needed so that the two-sigma uncertainty of a modal percentage is 5, 3 or 2 percentage points, against the percentage itself. Reaching 2 points at 10 per cent needs 900 points and at 50 per cent 2500.', height: 290,
});

// 4. The 20-point tally in "Check it yourself": olivine 13, clinopyroxene 2, plagioclase 2, spinel 1, secondary 2.
const TALLY = { olivine: 13, clinopyroxene: 2, plagioclase: 2, spinel: 1, secondary: 2 };
const tallyN = Object.values(TALLY).reduce((s, v) => s + v, 0);
const tally = Object.fromEntries(Object.entries(TALLY).map(([k, v]) => { const s = classStat(v, tallyN); return [k, { count: v, p: +pct(s.p).toFixed(2), se: +pct(s.se).toFixed(2), two: +pct(s.twoSigma).toFixed(2), exact: s.exact.map((x) => +pct(x).toFixed(2)), forTarget2: pointsNeeded(s.p, 0.02) }]; }));

console.log(JSON.stringify({
  sums: { A: sum(GABBRO_A.modes), B: sum(GABBRO_B.modes) }, nQuarter, nBasalt: nBasalt.slice(0, 8), nBasaltCount: nBasalt.length,
  A, B, plagBoundary, needed, opxGap, olGap, tallyN, tally,
  spot: { p50: +pct(twoSigma(0.5, 400)).toFixed(3), p10: +pct(twoSigma(0.1, 400)).toFixed(3), p1: +pct(twoSigma(0.01, 400)).toFixed(3) },
}, null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'precision', figure(fig1, 'Figure 1. The 2σ precision of one modal percentage, worked out with the Point counter\'s maths, for counts of 400, 900 and 2000 points. The dots are the mineral percentages the paper reports for its two Mae Chan gabbros, placed on the 400-point curve.'));
  md = inject(md, 'needed', figure(fig2, 'Figure 2. How many points a thin section needs for a given 2σ, from N = 4p(1 − p)/e². The dashed line is the paper\'s 400 points; the vertical line marks the 10 % plagioclase boundary used in rock names.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
