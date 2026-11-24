// Figures and numbers for src/blog/discoveries/fe-porphyrin-bicarbonate-complex-molar-mass-elemental-analysis-percent-recomputed.md,
// made with the maths of the Molar mass calculator (src/lib/sci/chem.ts: parseFormula, molarMass, composition).
// Run: node scripts/blog-figures/fe-porphyrin-bicarbonate-complex-molar-mass-elemental-analysis-percent-recomputed.mjs
import fs from 'node:fs';
import { parseFormula, molarMass, composition } from '../../src/lib/sci/chem.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/fe-porphyrin-bicarbonate-complex-molar-mass-elemental-analysis-percent-recomputed.md', import.meta.url);
const mm = (s) => molarMass(parseFormula(s));
const pct = (s) => Object.fromEntries(composition(parseFormula(s)).map((x) => [x.symbol, x.percent]));

// Stated in the paper (facts): product formula with one chlorobenzene (C89H106ClFeN10KO13, "MW 1654.25"), the
// crystallographic formula without it (C83H101FeKN10O13, 1541.68), calculated and found C, H, N (%), and the
// reagent amounts: starting Fe(III) complex 100 mg = 0.081 mmol, cryptand-2,2,2 120 mg = 0.319 mmol, KHCO3 190 mg = 2.262 mmol.
export const SOLVATE = 'C89H106ClFeN10KO13', DRY = 'C83H101FeKN10O13';
const PAPER = { calc: { C: 64.61, H: 6.47, N: 8.46 }, found: { C: 64.65, H: 6.61, N: 9.08 } };
const REAG = [
  { name: 'Fe(III) triflate complex', f: 'C65H66F3FeN8O8S', mg: 100, mmol: 0.081 },
  { name: 'cryptand-2,2,2', f: 'C18H36N2O6', mg: 120, mmol: 0.319 },
  { name: 'KHCO3', f: 'KHCO3', mg: 190, mmol: 2.262 },
  { name: 'NaHCO3 (alternative)', f: 'NaHCO3', mg: 190, mmol: 2.262 },
];

const f = (x, d = 3) => +x.toFixed(d);
const sol = pct(SOLVATE), dry = pct(DRY);
const out = {
  M: { solvate: f(mm(SOLVATE)), dry: f(mm(DRY)), chlorobenzene: f(mm('C6H5Cl')), diff: f(mm(SOLVATE) - mm(DRY)), SM: f(mm('C65H66F3FeN8O8S')), crypt: f(mm('C18H36N2O6')), KHCO3: f(mm('KHCO3')), NaHCO3: f(mm('NaHCO3')) },
  solvatePct: Object.fromEntries(['C', 'H', 'N'].map((e) => [e, f(sol[e], 2)])),
  dryPct: Object.fromEntries(['C', 'H', 'N'].map((e) => [e, f(dry[e], 2)])),
  foundMinusSolvate: Object.fromEntries(['C', 'H', 'N'].map((e) => [e, f(PAPER.found[e] - sol[e], 2)])),
  foundMinusDry: Object.fromEntries(['C', 'H', 'N'].map((e) => [e, f(PAPER.found[e] - dry[e], 2)])),
  calcMinusMine: Object.fromEntries(['C', 'H', 'N'].map((e) => [e, f(PAPER.calc[e] - sol[e], 2)])),
  mmol: REAG.map((r) => ({ name: r.name, M: f(mm(r.f), 2), mmol: f(r.mg / mm(r.f), 4), paper: r.mmol, ratio: f(r.mmol / (r.mg / mm(r.f)), 4) })),
  excessKHCO3_vs_Fe: { paper: f(2.262 / 0.081, 1), recomputed: f(190 / mm('KHCO3') / (100 / mm('C65H66F3FeN8O8S')), 1) },
};
console.log(JSON.stringify(out, null, 1));

const idx = [1, 2, 3];
const fig1 = chart({
  title: 'Found minus calculated, three elements', xLabel: 'Element (1 carbon, 2 hydrogen, 3 nitrogen)', yLabel: 'Found − calculated (% points)',
  desc: 'Difference between the elemental-analysis found value and the value calculated for the chlorobenzene solvate and for the solvent-free formula, for carbon, hydrogen and nitrogen. The solvent-free formula leaves differences near zero, the solvate leaves 0.6 percentage points for nitrogen.',
  series: [
    { name: 'against the solvate formula', x: idx, y: ['C', 'H', 'N'].map((e) => PAPER.found[e] - sol[e]), kind: 'dots', size: 5, colour: 'var(--c-tools)' },
    { name: 'against the solvent-free formula', x: idx, y: ['C', 'H', 'N'].map((e) => PAPER.found[e] - dry[e]), kind: 'dots', size: 5, colour: 'var(--c-blog)' },
  ], xDomain: [0.5, 3.5], yDomain: [-0.2, 0.8], xTicks: idx, xFmt: (v) => String(v), hlines: [{ y: 0, text: 'perfect agreement' }],
});
const ridx = [1, 2, 3, 4];
const fig2 = chart({
  title: 'Printed mmol against mmol recomputed from the mass', xLabel: 'Reagent (1 Fe complex, 2 cryptand, 3 KHCO3, 4 NaHCO3)', yLabel: 'Printed ÷ recomputed',
  desc: 'For each reagent, the millimoles the paper prints divided by the millimoles worked out from the printed mass and the molar mass of the named reagent. Three reagents sit at 1.00, potassium hydrogen carbonate at 1.19, and sodium hydrogen carbonate at 1.00.',
  series: [{ name: 'ratio', x: ridx, y: REAG.map((r) => r.mmol / (r.mg / mm(r.f))), kind: 'dots', size: 5, colour: 'var(--c-blog)', noLegend: true }],
  xDomain: [0.5, 4.5], yDomain: [0.9, 1.3], xTicks: ridx, xFmt: (v) => String(v), hlines: [{ y: 1, text: 'agreement' }],
});

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'ea', figure(fig1, 'Figure 1. How far the printed elemental-analysis "found" values sit from the percentages the molar mass calculator gives for the chlorobenzene solvate and for the solvent-free formula. The found values fit the solvent-free formula.'));
  md = inject(md, 'mmol', figure(fig2, 'Figure 2. The paper\'s millimoles divided by the millimoles recomputed from the printed masses. Reagents 1, 2 and 4 sit at 1.00; the printed 2.262 mmol for 190 mg of KHCO₃ matches the molar mass of NaHCO₃ instead.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
