// Figures for src/blog/discoveries/marmaricines-brominated-pyrrole-alkaloids-hresims-isotope-pattern.md, made with the
// maths of the Isotope pattern calculator (src/lib/sci/chem.ts: parseFormula, adductFormula, monoMass, isotopePattern,
// clusterPattern, ppm) and the Unsaturation calculator (src/lib/sci/dbe.ts: dbeOf).
// Run: node scripts/blog-figures/marmaricines-brominated-pyrrole-alkaloids-hresims-isotope-pattern.mjs
import fs from 'node:fs';
import { parseFormula, ADDUCTS, adductFormula, monoMass, isotopePattern, clusterPattern, ppm, ELECTRON } from '../../src/lib/sci/chem.ts';
import { dbeOf } from '../../src/lib/sci/dbe.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/marmaricines-brominated-pyrrole-alkaloids-hresims-isotope-pattern.md', import.meta.url);

// Inputs from the paper: Youssef et al. (2025), Marine Drugs 23(2): 80, doi:10.3390/md23020080 (CC BY).
// Formulas, [M+Na]+ measured and calculated m/z as stated in the text.
const CMP = [
  { id: 'Marmaricine A', f: 'C10H12Br2N2O3', meas: 388.9111, calc: 388.9106 },
  { id: 'Marmaricine B', f: 'C10H13BrN2O5', meas: 342.9906, calc: 342.99 },
  { id: 'Marmaricine C', f: 'C13H14Br2N4O3', meas: 454.9327, calc: 454.9324 },
];
const NA = ADDUCTS.find((a) => a.id === 'M+Na');
const res = CMP.map((c) => {
  const M = parseFormula(c.f), ion = adductFormula(M, NA), mz = monoMass(ion);
  const peaks = isotopePattern(ion, { prune: 1e-5, merge: 2e-5 }), unit = clusterPattern(peaks, 1);
  const top = Math.max(...unit.map((p) => p.abundance));
  return { ...c, mz, mzNoE: mz + ELECTRON, errTool: ppm(c.meas, mz), errPaper: ppm(c.meas, c.calc), calcDiff: (c.calc - mz) * 1000, dbe: dbeOf(M).rdbe,
    unit: unit.slice(0, 7).map((p) => ({ mz: p.mz, pct: (100 * p.abundance) / top })) };
});

// How many CcHhNnOo + Br2 + Na formulas fit marmaricine A's measured m/z? (even-electron ion: whole-number DBE ≥ 0 for the neutral)
const target = CMP[0].meas, cands = [];
for (let c = 1; c <= 30; c++) for (let n = 0; n <= 8; n++) for (let o = 0; o <= 12; o++) for (let h = 0; h <= 2 * c + n + 2; h++) {
  const neutral = `C${c}H${h}${n ? 'N' + n : ''}${o ? 'O' + o : ''}Br2`;
  const dbe = c - (h + 2) / 2 + n / 2 + 1;
  if (dbe < 0 || dbe !== Math.floor(dbe)) continue;
  const quick = 12 * c + 1.0078250319 * h + 14.0030740052 * n + 15.9949146221 * o + 2 * 78.9183376 + 22.98976966 - ELECTRON;
  if (Math.abs(quick - target) > 0.01) continue;
  const mz = monoMass(adductFormula(parseFormula(neutral), NA)), e = ppm(target, mz);
  if (Math.abs(e) <= 10) cands.push({ f: neutral, e, dbe });
}
const within = (x) => cands.filter((k) => Math.abs(k.e) <= x);

// Figure 1: [M+Na]+ clusters as sticks (dots with error bars from 0), offset sideways per compound.
const fig1 = chart({
  title: 'Predicted [M+Na]⁺ isotope clusters', xLabel: 'm/z above the monoisotopic peak', yLabel: '% of the tallest peak',
  series: res.map((r, k) => ({ name: r.id.replace('Marmaricine', 'Marm.'), kind: 'dots', size: 2.5,
    x: r.unit.map((p) => +(p.mz - r.mz + (k - 1) * 0.15).toFixed(3)), y: r.unit.map((p) => +(p.pct / 2).toFixed(2)), errors: r.unit.map((p) => +(p.pct / 2).toFixed(2)) })),
  xDomain: [-0.5, 6.5], yDomain: [0, 105], xTicks: [0, 1, 2, 3, 4, 5, 6],
  desc: 'Calculated isotope clusters of the three [M+Na]+ ions. The two-bromine ions A and C show three tall peaks at M, M+2 and M+4 in about 1:2:1; the one-bromine ion B shows two of equal height at M and M+2.', height: 260,
});
// Figure 2: candidate formulas around marmaricine A's measured m/z.
const fig2 = chart({
  title: 'Formulas with two Br near m/z 388.9111 ([M+Na]⁺)', xLabel: 'Mass error (ppm)', yLabel: 'Rings + double bonds',
  series: [
    { name: 'Other CHNO·Br₂ formulas', kind: 'dots', x: cands.filter((k) => k.f !== CMP[0].f).map((k) => +k.e.toFixed(2)), y: cands.filter((k) => k.f !== CMP[0].f).map((k) => k.dbe), size: 3 },
    { name: 'C10H12Br2N2O3 (paper)', kind: 'dots', x: [+res[0].errTool.toFixed(2)], y: [res[0].dbe], size: 5, colour: 'var(--c-tools)' },
  ],
  xDomain: [-10, 10], yDomain: [-0.5, 16], bands: [{ x0: -2, x1: 2, text: '±2 ppm' }],
  desc: `Every formula with carbon, hydrogen, nitrogen, oxygen and exactly two bromines whose sodium adduct lies within 10 ppm of 388.9111: ${cands.length} in all, ${within(5).length} within 5 ppm and ${within(2).length} within 2 ppm.`, height: 260,
});

console.log(JSON.stringify({
  res: res.map((r) => ({ id: r.id, mz: +r.mz.toFixed(5), mzNoE: +r.mzNoE.toFixed(4), errTool: +r.errTool.toFixed(2), errPaper: +r.errPaper.toFixed(2), calcDiff_mDa: +r.calcDiff.toFixed(2), dbe: r.dbe, unit: r.unit.map((p) => `${p.mz.toFixed(4)}:${p.pct.toFixed(1)}`) })),
  candidates: { n10: cands.length, n5: within(5).length, n2: within(2).length, list2: within(2).map((k) => `${k.f} ${k.e.toFixed(2)} dbe${k.dbe}`), list10: cands.map((k) => `${k.f} ${k.e.toFixed(2)} dbe${k.dbe}`) },
}));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'clusters', figure(fig1, 'Figure 1. The [M+Na]⁺ isotope clusters of marmaricines A, B and C worked out by the Isotope pattern calculator\'s maths from the paper\'s formulas, shown as sticks at whole-number steps (nudged sideways so the three do not overlap). Calculated, not the paper\'s spectra.'));
  md = inject(md, 'candidates', figure(fig2, 'Figure 2. Every formula made of C, H, N, O and two bromines (sodium adduct, whole-number rings plus double bonds) within 10 ppm of marmaricine A\'s measured m/z, from an exhaustive search with the same mass maths. The shaded band is ±2 ppm.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
