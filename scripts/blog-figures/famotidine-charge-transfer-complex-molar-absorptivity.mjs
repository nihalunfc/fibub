// Figures for src/blog/discoveries/famotidine-charge-transfer-complex-molar-absorptivity.md, made with the maths of
// the Beer-Lambert calculator (src/lib/sci/beer.ts: solveBL and absQuality) and the molar mass from
// src/lib/sci/chem.ts (the Molar mass calculator).
// Run: node scripts/blog-figures/famotidine-charge-transfer-complex-molar-absorptivity.mjs
import fs from 'node:fs';
import { solveBL, absQuality } from '../../src/lib/sci/beer.ts';
import { parseFormula, molarMass } from '../../src/lib/sci/chem.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/famotidine-charge-transfer-complex-molar-absorptivity.md', import.meta.url);

// From the paper: Al Samarrai, AlZubaidi and Al-Ansari (2024), Sci Rep 14, doi:10.1038/s41598-024-54402-4 (CC BY 4.0).
// ε at 546 nm, the Sandell sensitivity, Beer's law range, LOD and LOQ as printed in its text.
const EPS = 2159.648;      // L/(mol·cm)
const SANDELL = 0.15625;   // µg/cm²
const RANGE = [2, 28];     // µg/mL
const LOD = 0.3024, LOQ = 1.471; // µg/mL
const M = molarMass(parseFormula('C8H15N7O2S3')); // famotidine, from IUPAC atomic weights
const NOISE = 0.002;       // A, OUR assumption for a routine spectrophotometer's reading noise

const A = (ug, l = 1) => (ug === 0 ? 0 : solveBL({ eps: EPS, l, c: (ug * 1e-3) / M }).A); // absorbance of ug µg/mL in an l cm cell
const cFor = (a, l = 1) => (solveBL({ A: a, eps: EPS, l }).c * M) / 1e-3;        // µg/mL that gives absorbance a
const slope = A(1);                                                             // A per µg/mL in a 1 cm cell

const facts = {
  molarMass: +M.toFixed(3),
  sandellTimesEps: +(SANDELL * EPS).toFixed(3),            // should equal the molar mass
  slopePerUgMl: +slope.toFixed(6),
  A: Object.fromEntries([LOD, LOQ, RANGE[0], 7.8125, RANGE[1]].map((u) => [u, { A1cm: +A(u).toFixed(5), level: absQuality(A(u)).level }])),
  A5cm: { low: +A(RANGE[0], 5).toFixed(4), high: +A(RANGE[1], 5).toFixed(4) },
  pathForA01atLow: +(0.1 / slope / RANGE[0]).toFixed(2),
  concForA01: +cFor(0.1).toFixed(2),
  concForA1: +cFor(1).toFixed(1),
  concWhereGoodStarts: +cFor(0.05).toFixed(3),
  loqOverLod: +(LOQ / LOD).toFixed(2),
  sigmaImplied: +((LOD * slope) / 3.3).toFixed(6),
  lodIfNoise002: +((3.3 * NOISE) / slope).toFixed(3),
  errAtLow: +((100 * NOISE) / A(RANGE[0])).toFixed(1),
  errAtHigh: +((100 * NOISE) / A(RANGE[1])).toFixed(1),
  errAtLow5cm: +((100 * NOISE) / A(RANGE[0], 5)).toFixed(1),
};

// Figure 1: the Beer-Lambert line in a 1 cm and a 5 cm cell, with the band the tool calls most accurate.
const cs = Array.from({ length: 121 }, (_, i) => (i * 30) / 120);
const fig1 = chart({
  title: 'Famotidine complex: absorbance against concentration',
  xLabel: 'Famotidine (µg/mL)', yLabel: 'Absorbance at 546 nm',
  series: [
    { name: '1 cm cell (the usual cuvette)', kind: 'line', x: cs, y: cs.map((u) => +A(u).toFixed(4)) },
    { name: '5 cm cell', kind: 'line', x: cs, y: cs.map((u) => +A(u, 5).toFixed(4)) },
  ],
  xDomain: [0, 30], yDomain: [0, 1.05],
  hlines: [{ y: 1, text: 'A = 1: top of the accurate range' }, { y: 0.1, text: 'A = 0.1: bottom of it' }],
  bands: [{ x0: RANGE[0], x1: RANGE[1], text: "the paper's calibration range" }],
  desc: 'Absorbance of the famotidine ortho-chloranil complex against concentration, worked out from the published molar absorptivity. In a 1 cm cell the whole published range stays under A = 0.18; a 5 cm cell lifts it into the 0.1 to 1 window.',
  height: 290,
});

// Figure 2: how much a fixed ±0.002 A reading error costs, across the published range.
const us = Array.from({ length: 105 }, (_, i) => 2 + (i * 28) / 104);
const fig2 = chart({
  title: 'What a ±0.002 absorbance error costs',
  xLabel: 'Famotidine (µg/mL)', yLabel: 'Error in the result (%)',
  series: [
    { name: '1 cm cell', kind: 'line', x: us, y: us.map((u) => +((100 * NOISE) / A(u)).toFixed(3)) },
    { name: '5 cm cell', kind: 'line', x: us, y: us.map((u) => +((100 * NOISE) / A(u, 5)).toFixed(3)) },
  ],
  xDomain: [2, 30], yDomain: [0, 18],
  hlines: [{ y: 2, text: '2 %' }],
  desc: 'Relative error in the measured concentration if the instrument reads absorbance to within 0.002 A. In a 1 cm cell the error is about 16 per cent at the bottom of the published range; a 5 cm cell keeps it near 3 per cent.',
  height: 280,
});

console.log(JSON.stringify(facts, null, 1));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'line', figure(fig1, 'Figure 1. The Beer-Lambert line for the published method (ε = 2,159.6 L/(mol·cm) at 546 nm), worked out with the Beer-Lambert calculator’s maths. The shaded strip is the paper’s 2 to 28 µg/mL calibration range; the dashed lines are the absorbance window an ordinary spectrophotometer measures best. Our figure, not the paper’s.'));
  md = inject(md, 'noise', figure(fig2, 'Figure 2. The same method seen as error: a fixed ±0.002 A reading error turned into a percentage of the result. Our assumption is the 0.002 A; the curve shape is just 1/A.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
