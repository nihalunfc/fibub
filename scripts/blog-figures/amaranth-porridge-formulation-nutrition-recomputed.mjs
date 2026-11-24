// Figures for src/blog/discoveries/amaranth-porridge-formulation-nutrition-recomputed.md, made with the maths of the
// Recipe nutrition calculator (src/lib/sci/nutrition.ts: parseRecipe, recipe, atwater).
// Run: node scripts/blog-figures/amaranth-porridge-formulation-nutrition-recomputed.mjs   (rewrites the charts)
import fs from 'node:fs';
import { parseRecipe, recipe, atwater } from '../../src/lib/sci/nutrition.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/amaranth-porridge-formulation-nutrition-recomputed.md', import.meta.url);

// Inputs from the paper: Mwikwabe et al. (2026), Front. Nutr. 13: 1895788, doi:10.3389/fnut.2026.1895788 (CC BY).
// Table 4: the proximate composition the authors measured on their own four flours (g/100 g).
const FLOURS = {
  'Grain amaranth': { moisture: 11.17, protein: 17.46, fat: 6.05, fibre: 4.18, ash: 2.88 },
  'Pro-vitamin A maize': { moisture: 9.33, protein: 11.13, fat: 3.33, fibre: 2.17, ash: 1.14 },
  Soybean: { moisture: 7.9, protein: 38.29, fat: 17.41, fibre: 6.01, ash: 5.18 },
  Sesame: { moisture: 5.27, protein: 25.46, fat: 50.48, fibre: 8.77, ash: 6.28 },
};
// Carbohydrate by difference, then energy with the general Atwater factors (4/9/4/2). OUR step: the paper gives no
// carbohydrate value for the flours.
for (const f of Object.values(FLOURS)) {
  f.carb = +(100 - f.moisture - f.protein - f.fat - f.fibre - f.ash).toFixed(2);
  f.kcal = +atwater({ protein: f.protein, fat: f.fat, carb: f.carb, fibre: f.fibre }).toFixed(2);
}
// Table 1: the five formulations as percentages of the four flours, and the planning values printed beside them.
const NAMES = Object.keys(FLOURS);
const FORM = {
  F1: [35, 45, 15, 5], F2: [41, 39, 15, 5], F3: [31, 37, 21, 11], F4: [41, 38, 16, 5], F5: [40, 35, 20, 5],
};
const PLANNED = { F1: { kcal: 369.3, protein: 14.6, fat: 9.6, fibre: 10.5 }, F2: { kcal: 370, protein: 14.9, fat: 9.6, fibre: 10.4 }, F3: { kcal: 384.9, protein: 16.6, fat: 12.8, fibre: 11.1 }, F4: { kcal: 370, protein: 15.3, fat: 9.7, fibre: 10.3 }, F5: { kcal: 372.1, protein: 16.2, fat: 10.3, fibre: 10.9 } };
// Table 2: what they measured on the two extruded products that went forward.
const MEASURED = { F1: { kcal: 379.67, protein: 18.14, fat: 8.75 }, F5: { kcal: 391.93, protein: 20.53, fat: 11.95 } };
const CSB_ENERGY = 400; // WFP/UNICEF CSB++ minimum energy, kcal per 100 g, as quoted in the paper

const HEAD = 'Ingredient, Amount (g), Energy (kcal), Fat, Saturates, Carbohydrate, Sugars, Fibre, Protein, Salt';
const sheet = (ratios) => [HEAD, ...NAMES.map((n, i) => { const f = FLOURS[n]; return [n, ratios[i], f.kcal, f.fat, 0, f.carb, 0, f.fibre, f.protein, 0].join(', '); })].join('\n');
const ids = Object.keys(FORM);
const out = ids.map((id) => {
  const p = parseRecipe(sheet(FORM[id]));
  if (p.errors.length) throw new Error(p.errors.join('; '));
  const r = recipe(p.items, { servings: 1, lossPct: 0, energyFromMacros: true });
  return { id, kcal: r.per100.kcal, protein: r.per100.protein, fat: r.per100.fat, carb: r.per100.carb, fibre: r.per100.fibre, shares: r.rows.map((x) => ({ name: x.name, share: x.kcalShare })) };
});
const by = (id) => out.find((o) => o.id === id);

const px = ids.map((_, i) => i);
const fig1 = chart({
  title: 'Protein per 100 g: planned, mass-weighted, measured',
  xLabel: 'Formulation', yLabel: 'Protein (g per 100 g)',
  series: [
    { name: 'Planning table', kind: 'dots', x: px, y: ids.map((id) => PLANNED[id].protein), size: 4.5 },
    { name: 'From their own flours', kind: 'dots', x: px, y: out.map((o) => +o.protein.toFixed(2)), size: 4.5 },
    { name: 'Measured in the product', kind: 'dots', x: [0, 4], y: [MEASURED.F1.protein, MEASURED.F5.protein], size: 6, colour: 'var(--ink)' },
  ],
  xDomain: [-0.3, 4.3], yDomain: [13, 22], xTicks: px, xFmt: (t) => ids[t] ?? '',
  desc: 'For each of the five formulations, the protein content in the paper planning table, the value obtained by weighting the authors own flour analyses by the blend ratios, and the two products they actually analysed.',
  height: 275,
});
const fig2 = chart({
  title: 'Energy per 100 g against the CSB++ minimum',
  xLabel: 'Formulation', yLabel: 'Energy (kcal per 100 g)',
  series: [
    { name: 'Planning table', kind: 'dots', x: px, y: ids.map((id) => PLANNED[id].kcal), size: 4.5 },
    { name: 'Atwater from their own flours', kind: 'dots', x: px, y: out.map((o) => +o.kcal.toFixed(2)), size: 4.5 },
    { name: 'Measured in the product', kind: 'dots', x: [0, 4], y: [MEASURED.F1.kcal, MEASURED.F5.kcal], size: 6, colour: 'var(--ink)' },
  ],
  xDomain: [-0.3, 4.3], yDomain: [360, 412], xTicks: px, xFmt: (t) => ids[t] ?? '',
  hlines: [{ y: CSB_ENERGY, text: 'CSB++ minimum, 400 kcal' }],
  desc: 'Energy per 100 g for the five formulations: the paper planning values, the values worked out with Atwater factors from its own flour analyses, and the two measured products, against the 400 kcal CSB++ minimum.',
  height: 275,
});

console.log(JSON.stringify({
  flours: FLOURS,
  rows: out.map((o) => ({ id: o.id, kcal: +o.kcal.toFixed(2), protein: +o.protein.toFixed(2), fat: +o.fat.toFixed(2), carb: +o.carb.toFixed(2), fibre: +o.fibre.toFixed(2), shares: o.shares.map((s) => `${s.name} ${(100 * s.share).toFixed(1)}%`) })),
  gaps: {
    F1: { protein: +(by('F1').protein - MEASURED.F1.protein).toFixed(3), fat: +(by('F1').fat - MEASURED.F1.fat).toFixed(3), kcal: +(by('F1').kcal - MEASURED.F1.kcal).toFixed(2) },
    F5: { protein: +(by('F5').protein - MEASURED.F5.protein).toFixed(3), fat: +(by('F5').fat - MEASURED.F5.fat).toFixed(3), kcal: +(by('F5').kcal - MEASURED.F5.kcal).toFixed(2) },
  },
  vsPlanned: ids.map((id) => `${id}: protein ${(by(id).protein - PLANNED[id].protein).toFixed(2)}, fat ${(by(id).fat - PLANNED[id].fat).toFixed(2)}, fibre ${(by(id).fibre - PLANNED[id].fibre).toFixed(2)}, kcal ${(by(id).kcal - PLANNED[id].kcal).toFixed(2)}`),
  over400: out.filter((o) => o.kcal >= CSB_ENERGY).map((o) => o.id),
}, null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'protein', figure(fig1, 'Figure 1. Protein per 100 g for the five blends. The paper\'s planning table (first colour) sits about 3 g low; weighting its own flour analyses by the blend ratios (second colour) lands on the measured products (dark points).'));
  md = inject(md, 'energy', figure(fig2, 'Figure 2. The same three views of energy per 100 g, with the CSB++ minimum of 400 kcal. Only F3, the blend with 11 % sesame, clears it on either calculation.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
