// Figures for src/blog/discoveries/aporphine-alkaloid-formula-mass-check-nitrogen-rule.md, made with the maths of
// the Unsaturation calculator (src/lib/sci/dbe.ts: dbeFromFormula, which gives rings + double bonds, the
// monoisotopic mass of an ion and the nitrogen rule).
// Run: node scripts/blog-figures/aporphine-alkaloid-formula-mass-check-nitrogen-rule.mjs
import fs from 'node:fs';
import { dbeFromFormula } from '../../src/lib/sci/dbe.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/aporphine-alkaloid-formula-mass-check-nitrogen-rule.md', import.meta.url);

// From the paper: Zhang C, Lin Y, Xie L et al. (2025), Molecules 30(23), 4544, doi:10.3390/molecules30234544 (CC BY).
// Compounds 1 and 2: C18H17NO5, [M+H]+ printed as m/z 328.1190 (Results) and 328.1186 (experimental section),
// "calcd. for C18H18NO5 328.1185". Compound 3: C18H19NO4, [M+H]+ printed as m/z 341.1391, "calcd. for
// C18H20NO4 341.1392".
const PRINTED = { c12: [328.119, 328.1186], calc12: 328.1185, c3: 341.1391, calc3: 341.1392 };
const ion = (f) => dbeFromFormula(f);
const ppm = (a, b) => (1e6 * (a - b)) / b;

const r1 = ion('C18H17NO5'), r3 = ion('C18H19NO4');
const i1 = ion('C18H18NO5+'), i3 = ion('C18H20NO4+');

// Every even-electron [M+H]+ formula made of C, H, N and O within tol ppm of a target mass.
function candidates(target, tol, maxN = 3) {
  const out = [];
  for (let n = 0; n <= maxN; n++) for (let c = 12; c <= 26; c++) for (let o = 0; o <= 9; o++) for (let h = 6; h <= 42; h++) {
    const f = `C${c}H${h}${n ? 'N' + (n > 1 ? n : '') : ''}${o ? 'O' + (o > 1 ? o : '') : ''}+`;
    let r; try { r = dbeFromFormula(f); } catch { continue; }
    if (r.problems.length || !r.evenElectron || r.rdbe < 4.5 || r.rdbe > 16) continue;
    const d = ppm(r.mono, target);
    if (Math.abs(d) <= tol) out.push({ hill: r.hill, mono: +r.mono.toFixed(5), ppm: +d.toFixed(2), rdbe: r.rdbe, n });
  }
  return out;
}

const facts = {
  dbe: { 'C18H17NO5': r1.rdbe, 'C18H19NO4': r3.rdbe },
  ionMass: { 'C18H18NO5+': +i1.mono.toFixed(5), 'C18H20NO4+': +i3.mono.toFixed(5) },
  electronGap: { at328: +ppm(PRINTED.calc12, i1.mono).toFixed(2), at314: +ppm(314.1392, i3.mono).toFixed(2) },
  nitrogenRule: { 'C18H18NO5+': i1.nitrogenRule.text, 'C18H20NO4+': i3.nitrogenRule.text },
  printedVsPapersCalc: PRINTED.c12.map((m) => +ppm(m, PRINTED.calc12).toFixed(2)),
  printedVsIonMass: PRINTED.c12.map((m) => +ppm(m, i1.mono).toFixed(2)),
  compound3: {
    printed: PRINTED.c3, ionMassOfAssignedFormula: +i3.mono.toFixed(5), gapDa: +(PRINTED.c3 - i3.mono).toFixed(4),
    within10ppmOfPrinted: candidates(PRINTED.c3, 10),
    within10ppmOf314: candidates(i3.mono, 10),
    within10ppmOf328: candidates(PRINTED.c12[0], 10),
  },
};

// Figure 1: mass defect against nominal mass for protonated formulas with 0, 1 and 2 nitrogens.
const grid = { 0: [], 1: [], 2: [] };
for (let n = 0; n <= 2; n++) for (let c = 17; c <= 20; c++) for (let o = 3; o <= 6; o++) for (let h = 10; h <= 34; h++) {
  const f = `C${c}H${h}${n ? 'N' + (n > 1 ? n : '') : ''}O${o > 1 ? o : ''}+`;
  let r; try { r = dbeFromFormula(f); } catch { continue; }
  if (r.problems.length || !r.evenElectron || r.rdbe < 9.5 || r.rdbe > 11.5) continue;
  if (r.nominal < 306 || r.nominal > 350) continue;
  grid[n].push([r.nominal, r.mono - r.nominal]);
}
const fig1 = chart({
  title: 'Protonated formulas: mass defect against nominal mass',
  xLabel: 'Nominal mass of the [M+H]⁺ ion', yLabel: 'Mass defect (Da)',
  series: [
    { name: 'one nitrogen', kind: 'dots', size: 2.4, x: grid[1].map((p) => p[0]), y: grid[1].map((p) => +p[1].toFixed(4)) },
    { name: 'no nitrogen', kind: 'dots', size: 2.4, x: grid[0].map((p) => p[0]), y: grid[0].map((p) => +p[1].toFixed(4)) },
    { name: 'two nitrogens', kind: 'dots', size: 2.4, x: grid[2].map((p) => p[0]), y: grid[2].map((p) => +p[1].toFixed(4)), colour: 'var(--ink)' },
  ],
  xDomain: [306, 350], yDomain: [0.02, 0.26],
  vlines: [{ x: 314, text: '314' }, { x: 328, text: '328' }, { x: 341, text: '341', left: true }],
  desc: 'Mass defect against nominal mass for protonated formulas of carbon, hydrogen, nitrogen and oxygen with ten or eleven rings and double bonds. One-nitrogen ions fall only on even nominal masses, so the columns at 314 and 328 are full and the column at 341 holds no one-nitrogen formula at all.',
  height: 300,
});

// Figure 2: rings + double bonds against hydrogen count for the two formula families.
const hs = Array.from({ length: 9 }, (_, i) => 11 + 2 * i); // odd H, so a neutral one-nitrogen molecule is even-electron
const line = (o) => hs.map((h) => dbeFromFormula(`C18H${h}NO${o}`).rdbe);
const fig2 = chart({
  title: 'Rings plus double bonds in the C₁₈ alkaloid families',
  xLabel: 'Hydrogen atoms in the neutral molecule', yLabel: 'Rings + double bonds',
  series: [
    { name: 'C₁₈HₕNO₅ (compounds 1 and 2)', kind: 'line', x: hs, y: line(5) },
    { name: 'C₁₈HₕNO₄ (compound 3)', kind: 'line', x: hs, y: line(4), dash: '5 4' },
    { name: '', noLegend: true, kind: 'dots', size: 4.5, x: [17, 19], y: [r1.rdbe, r3.rdbe], colour: 'var(--ink)' },
  ],
  xDomain: [11, 27], yDomain: [4, 15],
  desc: 'Rings plus double bonds against hydrogen count for C18HhNO5 and C18HhNO4. Both lines fall by half a ring for every hydrogen added, and the two dots mark the paper’s compounds at eleven and ten.',
  height: 275,
});

console.log(JSON.stringify(facts, null, 1));
console.log('points in figure 1:', grid[0].length + grid[1].length + grid[2].length);
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'defect', figure(fig1, 'Figure 1. Protonated C, H, N, O formulas with 17 to 20 carbons, 3 to 6 oxygens and 10 or 11 rings and double bonds, placed by its nominal mass and its mass defect, worked out with the Unsaturation calculator’s maths. One-nitrogen ions (the paper’s alkaloids) sit only on even nominal masses: 314 and 328 are populated, 341 is not.'));
  md = inject(md, 'dbe', figure(fig2, 'Figure 2. Rings plus double bonds against hydrogen count for the two formula families, from the same tool. Each extra pair of hydrogens removes one ring or double bond; the dots are the paper’s compounds.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
