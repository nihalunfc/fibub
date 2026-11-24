// Figures for src/blog/discoveries/abt199-vorinostat-additivity-benchmark.md, made with the maths of the
// Drug synergy tool (src/lib/sci/synergy.ts: Hill curves, the Loewe surface, Bliss and HSA, the combination index).
// Run: node scripts/blog-figures/abt199-vorinostat-additivity-benchmark.mjs   (rewrites the charts inside the article)
import fs from 'node:fs';
import * as S from '../../src/lib/sci/synergy.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/abt199-vorinostat-additivity-benchmark.md', import.meta.url);

// From the paper's abstract: Abu Alsamen et al. (2025), PLOS ONE 20: e0334427 (CC BY 4.0).
// Vorinostat IC50 1.32 uM (HT-29) and 2.04 uM (HCT116); ABT-199 IC50 4.04 uM (HT-29) and 5.49 uM (HCT116).
// OUR assumption everywhere below: a Hill slope of 1 and a maximum effect of 100 % for both drugs.
const H = (ec50) => ({ ec50, h: 1, emax: 100, r2: 1, n: 5, converged: true });
const LINES = [
  { cell: 'HT-29', vor: 1.32, abt: 4.04 },
  { cell: 'HCT116', vor: 2.04, abt: 5.49 },
];

// The combination index of a 1:1 (molar) mixture at the 50 % effect: CI = (D/2)/IC50_vor + (D/2)/IC50_abt.
const ciAt = (D, L) => D / 2 / S.hillInv(50, H(L.vor)) + D / 2 / S.hillInv(50, H(L.abt));
const addDose = (L) => 2 / (1 / L.vor + 1 / L.abt); // total dose where CI = 1
for (const L of LINES) {
  L.add = addDose(L);
  L.at06 = 0.6 * L.add;
  L.ci1 = ciAt(L.add, L);
  console.log(L.cell, 'IC50 at 50 % for the 1:1 mix (additive) =', L.add.toFixed(4), 'uM total; CI there =', L.ci1.toFixed(6), '; a CI of 0.6 needs', L.at06.toFixed(4), 'uM total');
}

// A simulated checkerboard, to show what the tool reads off a matrix. Doses around each IC50 (HT-29).
const L0 = LINES[0];
const A = [0, L0.vor / 4, L0.vor / 2, L0.vor, L0.vor * 2, L0.vor * 4].map((v) => +v.toFixed(3));
const B = [0, L0.abt / 4, L0.abt / 2, L0.abt, L0.abt * 2, L0.abt * 4].map((v) => +v.toFixed(3));
const hillA = H(L0.vor), hillB = H(L0.abt);
/** Observed effect if each drug behaves as if `boost` times more potent, but only where both are present
 *  (the single-drug row and column keep their own curves, as in a real checkerboard). */
const matrix = (boost) => ({
  a: A, b: B,
  e: A.map((a) => B.map((b) => { const k = a > 0 && b > 0 ? boost : 1; return +S.loeweExpected(a * k, b * k, hillA, hillB).toFixed(2); })),
});
const sham = S.analyse(matrix(1), 100), syn = S.analyse(matrix(2), 100);
const show = (name, r) => console.log(name, 'CI geometric mean', r.summary.ci.geoMean.toFixed(4), '| mean Loewe excess', r.summary.loewe.mean.toFixed(3), '| mean Bliss excess', r.summary.bliss.mean.toFixed(3), '| mean HSA excess', r.summary.hsa.mean.toFixed(3), '| fitted EC50s', r.hillA.ec50.toFixed(4), r.hillB.ec50.toFixed(4), 'slopes', r.hillA.h.toFixed(4), r.hillB.h.toFixed(4));
show('additive sham matrix:', sham);
show('two-fold synergy matrix:', syn);
console.log('synergy matrix rows:');
for (const [i, a] of A.entries()) console.log(' ', a, matrix(2).e[i].join('\t'));

// Figure 1: the 50 % isoboles. Under Loewe additivity the 50 % isobole is the straight line
// vor/IC50_vor + abt/IC50_abt = 1; a combination index of 0.6 shifts it inwards by the same factor.
const ray = (L) => ({ x: [0, (L.add / 2) * 1.6], y: [0, ((L.add / 2) * 1.6 * L.abt) / L.vor] });
const fig1 = chart({
  title: 'What the 50 % isobole demands of the combination',
  xLabel: 'Vorinostat (µM)', yLabel: 'ABT-199 (µM)',
  series: [
    { name: 'HT-29, additive (CI = 1)', kind: 'line', x: [0, LINES[0].vor], y: [LINES[0].abt, 0] },
    { name: 'HT-29, CI = 0.6', kind: 'line', x: [0, 0.6 * LINES[0].vor], y: [0.6 * LINES[0].abt, 0], dash: '5 4', colour: 'var(--c-blog)' },
    { name: 'HCT116, additive (CI = 1)', kind: 'line', x: [0, LINES[1].vor], y: [LINES[1].abt, 0], colour: 'var(--c-tools)' },
    { name: 'HCT116, CI = 0.6', kind: 'line', x: [0, 0.6 * LINES[1].vor], y: [0.6 * LINES[1].abt, 0], dash: '5 4', colour: 'var(--c-tools)' },
    { name: '', noLegend: true, kind: 'line', x: ray(LINES[1]).x, y: ray(LINES[1]).y, colour: 'var(--muted)', dash: '2 3' },
  ],
  xDomain: [0, 2.3], yDomain: [0, 6],
  desc: `Fifty-percent isoboles for the two colorectal cell lines, drawn from the single-drug IC50 values in the paper's abstract with a Hill slope of 1. The dotted ray is an equal-molar mixture; the dashed lines are where a combination index of 0.6 would put the half-effect point.`,
  height: 300,
});

// Figure 2: the combination index of a 1:1 mixture against the total dose that halves growth.
const DD = Array.from({ length: 121 }, (_, i) => 0.2 + i * 0.05);
const fig2 = chart({
  title: 'Combination index of an equal-molar mixture',
  xLabel: 'Total dose that halves growth (µM, both drugs)', yLabel: 'Combination index at 50 % effect',
  series: LINES.map((L) => ({ name: L.cell, kind: 'line', x: DD, y: DD.map((D) => +ciAt(D, L).toFixed(4)) })),
  xDomain: [0, 6.2], yDomain: [0, 2.2],
  hlines: [{ y: 1, text: 'additive' }],
  vlines: [{ x: LINES[0].add, text: `${LINES[0].add.toFixed(2)} µM`, left: true }, { x: LINES[1].add, text: `${LINES[1].add.toFixed(2)} µM`, dy: 18 }],
  desc: `The combination index of an equal-molar vorinostat and ABT-199 mixture, against the total dose needed to halve growth. It passes through 1 at ${LINES[0].add.toFixed(2)} micromolar for HT-29 and ${LINES[1].add.toFixed(2)} micromolar for HCT116, so any claim of synergy means a measured half-effect dose below those values.`,
  height: 300,
});

let md = fs.readFileSync(ART, 'utf8');
md = inject(md, 'isobole', figure(fig1, `Figure 1. The 50 % isoboles worked out from the paper's single-drug IC50 values with the Drug synergy tool's Loewe maths (Hill slope 1, our assumption). Any mixture on the solid line is exactly additive; a combination index of 0.6 means the measured half-effect mixture sits on the dashed line, 40 % closer to the origin.`));
md = inject(md, 'ci', figure(fig2, `Figure 2. For an equal-molar mixture, the combination index that each possible half-effect dose implies. The dashed lines mark the additive dose for each cell line.`));
fs.writeFileSync(ART, md);
console.log('figures written:', fig1.length, fig2.length, 'bytes');
