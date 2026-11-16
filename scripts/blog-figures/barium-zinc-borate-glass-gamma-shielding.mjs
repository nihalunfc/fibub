// Figures for src/blog/discoveries/barium-zinc-borate-glass-gamma-shielding.md, made with the maths of the
// Gamma shielding calculator (src/lib/sci/phgamma.ts).
// Run: node scripts/blog-figures/barium-zinc-borate-glass-gamma-shielding.mjs   (rewrites the charts inside the article)
import fs from 'node:fs';
import { fromFormula, mix, parts, massAtten, hvl, transmission, MATERIALS } from '../../src/lib/sci/phgamma.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/barium-zinc-borate-glass-gamma-shielding.md', import.meta.url);

// Paper (Elsafi, Sayyed and Hanafy 2025, Sci. Rep. 15, 2618, doi:10.1038/s41598-025-85230-9, CC BY 4.0):
// glasses 45 B2O3 - 20 ZnO - 30 BaO - 5 X (mol %); densities BZBCa 3.932, BZBT 3.965, BZBFe 4.031 g/cm3;
// measured linear attenuation (1/cm): BZBT 0.292 (0.662 MeV), 0.198 (1.33 MeV); BZBFe 0.307 and 0.208; BZBCu 0.306, 0.206;
// half-value layers at 0.662 MeV 2.310 cm (BZBCa) to 2.258 cm (BZBFe); 1 cm transmission at 0.662 MeV 74.08 % (BZBCa).
const OX = { B2O3: [[5, 2], [8, 3]], ZnO: [[30, 1], [8, 1]], BaO: [[56, 1], [8, 1]], CaO: [[20, 1], [8, 1]], TiO2: [[22, 1], [8, 2]], Fe2O3: [[26, 2], [8, 3]] };
const mw = (f) => f.reduce((s, [Z, n]) => s + n * { 5: 10.81, 8: 15.999, 30: 65.38, 56: 137.327, 20: 40.078, 22: 47.867, 26: 55.845 }[Z], 0);
// mol % to weight fractions, then element weight fractions (the tool's own mix and fromFormula).
const glass = (X) => mix([[45, 'B2O3'], [20, 'ZnO'], [30, 'BaO'], [5, X]].map(([m, k]) => [m * mw(OX[k]), fromFormula(OX[k])]));
const G = [
  { id: 'BZBCa', X: 'CaO', rho: 3.932, meas: { 0.662: Math.LN2 / 2.310 } },
  { id: 'BZBT', X: 'TiO2', rho: 3.965, meas: { 0.662: 0.292, 1.333: 0.198 } },
  { id: 'BZBFe', X: 'Fe2O3', rho: 4.031, meas: { 0.662: 0.307, 1.333: 0.208 } },
];
const rows = G.flatMap((g) => Object.entries(g.meas).map(([E, lac]) => {
  const model = parts(glass(g.X), +E).total * g.rho;
  return { id: g.id, E: +E, measured: +lac.toFixed(3), model: +model.toFixed(3), diffPct: +((model / lac - 1) * 100).toFixed(1), mrMeasured: +(lac / g.rho).toFixed(4), hvlMeasured: +hvl(lac).toFixed(3), hvlModel: +hvl(model).toFixed(3) };
}));
const low = { model: +(parts(glass('CaO'), 0.0595).total * 3.932).toFixed(2), measuredBZBT: 15.438 }; // 59.5 keV, Am-241

// Figure 1: mu/rho of the glass from the tool's formulas, with the measured points (LAC / density).
const lE = Array.from({ length: 61 }, (_, i) => -1 + i * (Math.log10(2) + 1) / 60); // 0.1 to 2 MeV
const fig1 = chart({
  title: 'Mass attenuation of BZBFe glass: formulas and measurement', xLabel: 'Gamma energy (MeV, log scale)', yLabel: 'μ/ρ (cm²/g)',
  series: [
    { name: 'Tool formulas, BZBFe glass', kind: 'line', x: lE, y: lE.map((l) => +parts(glass('Fe2O3'), 10 ** l).total.toFixed(4)) },
    { name: 'Tool formulas, concrete', kind: 'line', x: lE, y: lE.map((l) => +massAtten('concrete', 10 ** l).toFixed(4)), dash: '5 4' },
    { name: 'Measured (paper)', kind: 'dots', x: rows.filter((r) => r.id === 'BZBFe').map((r) => Math.log10(r.E)), y: rows.filter((r) => r.id === 'BZBFe').map((r) => r.mrMeasured), size: 4.5 },
  ],
  xDomain: [-1, Math.log10(2)], yDomain: [0, 0.3], xTicks: [-1, Math.log10(0.2), Math.log10(0.5), 0, Math.log10(2)], xFmt: (t) => String(+(10 ** t).toFixed(1)),
  desc: `Above 0.5 MeV the tool's formulas sit within 5 % of the glass's measured attenuation; below that the barium photoelectric term, which the formulas only approximate, makes the glass far better than concrete per gram.`, height: 280,
});

// Figure 2: narrow-beam transmission of Cs-137 gamma rays through the glass (measured mu), concrete and lead (tool formulas).
const xs = Array.from({ length: 101 }, (_, i) => i * 0.1);
const muC = massAtten('concrete', 0.662) * MATERIALS.concrete.rho, muPb = massAtten('lead', 0.662) * MATERIALS.lead.rho, muG = Math.LN2 / 2.310;
const fig2 = chart({
  title: 'Cs-137 gamma rays through a shield (narrow beam)', xLabel: 'Thickness (cm)', yLabel: 'Transmitted (%)',
  series: [
    { name: 'BZBCa glass (measured μ)', kind: 'line', x: xs, y: xs.map((x) => +(100 * transmission(muG, x)).toFixed(2)) },
    { name: 'Concrete', kind: 'line', x: xs, y: xs.map((x) => +(100 * transmission(muC, x)).toFixed(2)), dash: '5 4' },
    { name: 'Lead', kind: 'line', x: xs, y: xs.map((x) => +(100 * transmission(muPb, x)).toFixed(2)) },
  ],
  xDomain: [0, 10], yDomain: [0, 100],
  desc: `At 0.662 MeV the glass halves the beam every ${hvl(muG).toFixed(2)} cm, against ${hvl(muC).toFixed(2)} cm for the tool's concrete and ${hvl(muPb).toFixed(2)} cm for lead.`, height: 270,
});

console.log(JSON.stringify({ rows, low, hvlConcrete: hvl(muC).toFixed(2), hvlLead: hvl(muPb).toFixed(3), thick1pct: (Math.log(100) / muG).toFixed(1) }));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'mu', figure(fig1, 'Figure 1. Mass attenuation coefficient of the iron-oxide glass (BZBFe) worked out by the Gamma shielding calculator\'s formulas from the glass recipe, with the paper\'s measured values (linear coefficient divided by density) as dots, and the tool\'s simple concrete for comparison.'));
  md = inject(md, 'trans', figure(fig2, 'Figure 2. Narrow-beam transmission of 0.662 MeV gamma rays: the glass from the paper\'s measured half-value layer; concrete (2.30 g/cm³) and lead from the tool\'s built-in formulas. No buildup.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
