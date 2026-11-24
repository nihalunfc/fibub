// Figures and numbers for src/blog/discoveries/deep-eutectic-solvent-carbodiimide-amide-coupling-reagent-table-yield.md,
// made with the maths of the Reaction equivalents table tool (src/lib/sci/equivalents.ts: table, yieldOf, scaleFrom)
// and the molar masses of src/lib/sci/chem.ts (parseFormula, molarMass).
// Run: node scripts/blog-figures/deep-eutectic-solvent-carbodiimide-amide-coupling-reagent-table-yield.mjs
import fs from 'node:fs';
import { table, yieldOf, scaleFrom } from '../../src/lib/sci/equivalents.ts';
import { parseFormula, molarMass } from '../../src/lib/sci/chem.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/deep-eutectic-solvent-carbodiimide-amide-coupling-reagent-table-yield.md', import.meta.url);
const mw = (f) => molarMass(parseFormula(f));

// Stated in the paper's text (facts): 1 mmol each of phenylacetic acid, OxymaPure, carbodiimide and 2-phenylethylamine,
// 2.5 mmol DIPEA (base screens), 2.5 g reline, 60 deg C, 30 min; isolated yields of the model amide 90 % (TBDC.TsOH in
// reline), 88 % (the same without DIPEA), 78 % (QCD in reline), 68 % (TBDC.HCl in reline). Formulas and molar masses are
// standard chemistry; the product formula C16H17NO is our own working-out of the coupling of these two substrates.
const R = [
  { name: 'Phenylacetic acid', f: 'C8H8O2', equiv: 1 },
  { name: 'OxymaPure', f: 'C5H6N2O3', equiv: 1 },
  { name: '2-Phenylethylamine', f: 'C8H11N', equiv: 1 },
  { name: 'DIPEA (base screens)', f: 'C8H19N', equiv: 2.5 },
].map((r) => ({ ...r, mw: mw(r.f) }));
const PROD = mw('C16H17NO');

const scales = Array.from({ length: 11 }, (_, i) => i); // mmol of acid
const fig1 = chart({
  title: 'Isolated amide against scale, three reported yields',
  xLabel: 'Scale (mmol of limiting reagent)', yLabel: 'Isolated amide (mg)',
  desc: 'Expected isolated mass of the model amide against the amount of phenylacetic acid used, at three yields reported in the paper: 90, 88 and 78 percent. Straight lines through the origin.',
  series: [90, 88, 78].map((y, i) => ({ name: `${y} %`, x: scales, y: scales.map((s) => yieldOf(s, PROD, 1).theoMg * y / 100), kind: 'line', colour: ['var(--c-blog)', 'var(--c-tools)', 'var(--muted)'][i], dash: i === 2 ? '3 3' : undefined })),
  xDomain: [0, 10], yDomain: [0, 2400], xTicks: [0, 2, 4, 6, 8, 10], xFmt: (v) => String(v),
});
const fig2 = chart({
  title: 'What to weigh out against scale',
  xLabel: 'Scale (mmol of limiting reagent)', yLabel: 'Mass to weigh (mg)',
  desc: 'Mass of each reagent to weigh for the amide coupling against scale from 0 to 10 millimoles: phenylacetic acid, OxymaPure, 2-phenylethylamine and 2.5 equivalents of the base DIPEA.',
  series: R.map((r, i) => ({ name: r.name, x: scales, y: scales.map((s) => table([r], s)[0].weighMg), kind: 'line', colour: ['var(--c-blog)', 'var(--c-tools)', 'var(--ink)', 'var(--muted)'][i], dash: i === 3 ? '3 3' : undefined })),
  xDomain: [0, 10], yDomain: [0, 3500], xTicks: [0, 2, 4, 6, 8, 10], xFmt: (v) => String(v),
});

const t1 = table(R, 1);
const th = yieldOf(1, PROD, 1);
const reline = { chCl: mw('C5H14ClNO'), urea: mw('CH4N2O') };
const relineUnit = reline.chCl + 2 * reline.urea;
console.log(JSON.stringify({
  mw: Object.fromEntries(R.map((r) => [r.name, +r.mw.toFixed(2)])), product: +PROD.toFixed(2),
  at1mmol_mg: t1.map((r) => +r.weighMg.toFixed(2)),
  theoMg: +th.theoMg.toFixed(2), y90: +(th.theoMg * 0.9).toFixed(1), y88: +(th.theoMg * 0.88).toFixed(1), y78: +(th.theoMg * 0.78).toFixed(1), y68: +(th.theoMg * 0.68).toFixed(1),
  pctFor210: +yieldOf(1, PROD, 1, 210).percent.toFixed(2),
  scaleFor1g_88: +(1000 / (PROD * 0.88)).toFixed(3),
  scaleFrom_acidMg500: +scaleFrom(R[0], 'mg', 500).toFixed(4),
  relineUnit: +relineUnit.toFixed(2), reline_mmol_unit_2500mg: +(2500 / relineUnit).toFixed(3),
  solventPerGproduct88: +(2.5 / (th.theoMg * 0.88 / 1000)).toFixed(2), reagentsMgPerMmol_noBase: +(R[0].mw + R[1].mw + R[2].mw).toFixed(2),
  dipeaVol_uL_at1mmol: +((2.5 * R[3].mw) / 0.742).toFixed(1),
}, null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'product', figure(fig1, 'Figure 1. Mass of the model amide (C16H17NO, 239.3 g/mol) you would isolate against the scale, at the 90, 88 and 78 % isolated yields the paper reports for different conditions, from the reaction-equivalents tool\'s theoretical-yield maths.'));
  md = inject(md, 'weigh', figure(fig2, 'Figure 2. The reagent masses the tool\'s table gives for the same reaction against scale. The base DIPEA (2.5 equivalents) is the largest after the acid and OxymaPure; the base-free optimum drops it.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
