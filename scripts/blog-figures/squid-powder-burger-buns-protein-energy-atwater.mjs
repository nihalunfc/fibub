// Figures for src/blog/discoveries/squid-powder-burger-buns-protein-energy-atwater.md, made with the maths of the
// Recipe nutrition calculator (src/lib/sci/nutrition.ts: parseRecipe, recipe, atwater).
// Run: node scripts/blog-figures/squid-powder-burger-buns-protein-energy-atwater.mjs
import fs from 'node:fs';
import { parseRecipe, recipe, atwater } from '../../src/lib/sci/nutrition.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/squid-powder-burger-buns-protein-energy-atwater.md', import.meta.url);

// Inputs from Ali and El-Anany (2025), Front. Nutr. 12: 1615629, doi:10.3389/fnut.2025.1615629 (CC BY 4.0).
// Ingredient analyses (g/100 g dry weight) and the measured buns, substitution 0 to 5 % of the flour.
const WHEAT = { protein: 10.60, fat: 1.25, fibre: 0.59, ash: 0.60, carb: 86.96, moisture: 11.50, kcal: 401.49 };
const SQUID = { protein: 78.98, fat: 3.90, fibre: 0, ash: 3.75, carb: 13.37, moisture: 8.50, kcal: 404.50 };
const LEVELS = [0, 1, 2, 3, 4, 5];
const BUNS = [
  { protein: 12.13, fat: 4.08, fibre: 0.83, ash: 0.90, carb: 82.06, kcal: 415.14 },
  { protein: 13.21, fat: 4.15, fibre: 0.83, ash: 0.97, carb: 80.84, kcal: 415.21 },
  { protein: 14.34, fat: 4.20, fibre: 0.82, ash: 1.07, carb: 79.57, kcal: 415.08 },
  { protein: 15.55, fat: 4.25, fibre: 0.82, ash: 1.12, carb: 78.26, kcal: 415.13 },
  { protein: 16.38, fat: 4.33, fibre: 0.81, ash: 1.19, carb: 77.29, kcal: 415.27 },
  { protein: 17.31, fat: 4.41, fibre: 0.81, ash: 1.31, carb: 76.16, kcal: 415.19 },
];

// 1. Do the published energies follow the general Atwater factors? With fibre at 2 kcal/g (the tool's "From the
// nutrients (4/9/4/2)" switch) and without it.
const energy = BUNS.map((b, i) => ({
  level: LEVELS[i], paper: b.kcal,
  withFibre: +atwater(b).toFixed(2),
  noFibre: +atwater({ ...b, fibre: 0 }).toFixed(2),
}));
const ingredients = [['Wheat flour', WHEAT], ['Steamed squid powder', SQUID]].map(([n, v]) => ({
  name: n, paper: v.kcal, withFibre: +atwater(v).toFixed(2), noFibre: +atwater({ ...v, fibre: 0 }).toFixed(2),
}));
// Why the energy hardly moves: the change from the control, term by term (kcal/100 g dry weight).
const d = BUNS[5], c = BUNS[0];
const terms = { protein: +(4 * (d.protein - c.protein)).toFixed(2), carb: +(4 * (d.carb - c.carb)).toFixed(2), fat: +(9 * (d.fat - c.fat)).toFixed(2), fibre: +(2 * (d.fibre - c.fibre)).toFixed(2) };
terms.sum = +(terms.protein + terms.carb + terms.fat + terms.fibre).toFixed(2);
terms.paperChange = +(d.kcal - c.kcal).toFixed(2);

// 2. Mass balance with the tool: the dough of each formulation, per 100 g of dry solids.
// Dough per the paper's Table 1 (1,000 g flour basis). The non-flour rows are OUR assumed label values; palmolein
// oil is taken as 0.9 g/mL (27 g for 30 mL) and dry yeast as 40 % protein, 40 % carbohydrate, 20 % fibre.
const SUGAR = { kcal: 400, carb: 100 }, OIL = { kcal: 900, fat: 100 }, SALT = { kcal: 0, salt: 100 };
const YEAST = { kcal: 360, protein: 40, carb: 40, fibre: 20 }, IMPROVER = { kcal: 400, carb: 100 };
const row = (name, grams, v) => `${name}, ${grams}, ${v.kcal ?? 0}, ${v.fat ?? 0}, 0, ${v.carb ?? 0}, 0, ${v.fibre ?? 0}, ${v.protein ?? 0}, ${v.salt ?? 0}`;
function doughFor(pct) {
  const flour = 1000 * (1 - pct / 100), squid = 1000 * (pct / 100);
  const dryFlour = flour * (1 - WHEAT.moisture / 100), drySquid = squid * (1 - SQUID.moisture / 100);
  const text = ['Ingredient, Amount (g), Energy (kcal), Fat, Saturates, Carbohydrate, Sugars, Fibre, Protein, Salt',
    row('Wheat flour (dry solids)', +dryFlour.toFixed(2), WHEAT),
    ...(squid > 0 ? [row('Squid powder (dry solids)', +drySquid.toFixed(2), SQUID)] : []),
    row('Sugar', 60, SUGAR), row('Palmolein oil', 27, OIL), row('Dry active yeast', 12.5, YEAST),
    row('Salt', 10, SALT), row('Improver', 5, IMPROVER)].join('\n');
  const p = parseRecipe(text);
  if (p.errors.length) throw new Error(p.errors.join('; '));
  const dry = p.items.reduce((s, i) => s + i.grams, 0);
  const r = recipe(p.items, { servings: 1, cookedWeight: dry, energyFromMacros: true });
  return { pct, dry: +dry.toFixed(2), text, per100: r.per100 };
}
const mb = LEVELS.map((p) => doughFor(p));
const balance = mb.map((m, i) => ({
  level: m.pct, drySolids: m.dry,
  protein: +m.per100.protein.toFixed(2), paperProtein: BUNS[i].protein,
  carb: +m.per100.carb.toFixed(2), paperCarb: BUNS[i].carb,
  fat: +m.per100.fat.toFixed(2), paperFat: BUNS[i].fat,
  kcal: +m.per100.kcal.toFixed(2), paperKcal: BUNS[i].kcal,
}));
const slope = (a) => +((a[5] - a[0]) / 5).toFixed(3);
const slopes = { tool: slope(balance.map((b) => b.protein)), paper: slope(BUNS.map((b) => b.protein)) };
// How much dry matter would have to vanish for the control bun to reach 12.13 % protein?
const lossNeeded = +(100 * (1 - (balance[0].protein / BUNS[0].protein))).toFixed(1);

const fig1 = chart({
  title: 'Burger buns: energy against squid powder added', xLabel: 'Flour replaced by squid powder (%)', yLabel: 'Energy (kcal per 100 g dry)',
  series: [
    { name: 'Paper', kind: 'dots', size: 4, x: LEVELS, y: energy.map((e) => e.paper) },
    { name: 'Tool, 4/9/4/2 (fibre counted)', kind: 'line', x: LEVELS, y: energy.map((e) => e.withFibre) },
    { name: 'Tool, 4/9/4 (fibre not counted)', kind: 'line', dash: '5 4', x: LEVELS, y: energy.map((e) => e.noFibre), colour: 'var(--ink)' },
  ],
  xDomain: [-0.25, 5.25], yDomain: [410, 418], xTicks: LEVELS, yFmt: (v) => v.toFixed(0),
  desc: 'The published energy of the six burger buns against the tool’s Atwater energy from the same macronutrients, with and without fibre counted at 2 kcal per gram. The 4/9/4/2 line sits exactly on the published points.',
  height: 290,
});
const fig2 = chart({
  title: 'Protein: measured against what the ingredients allow', xLabel: 'Flour replaced by squid powder (%)', yLabel: 'Protein (g per 100 g dry)',
  series: [
    { name: 'Paper, measured buns', kind: 'dots', size: 4, x: LEVELS, y: BUNS.map((b) => b.protein) },
    { name: 'Paper, measured buns', noLegend: true, kind: 'line', x: LEVELS, y: BUNS.map((b) => b.protein) },
    { name: 'Tool, mass balance of the dough', kind: 'line', x: LEVELS, y: balance.map((b) => b.protein), colour: 'var(--c-tools)' },
  ],
  xDomain: [-0.25, 5.25], yDomain: [8, 19], xTicks: LEVELS, yFmt: (v) => v.toFixed(0),
  desc: 'Measured bun protein rises from 12.13 to 17.31 g per 100 g dry weight, while a mass balance of the dough from the paper’s own ingredient analyses rises from 9.89 to 13.02.',
  height: 290,
});

console.log(JSON.stringify({ ingredients, energy, terms, balance, slopes, lossNeeded, example: mb[5].text }, null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'energy', figure(fig1, 'Figure 1. The paper’s published energy for each bun (dots) and the energy the Recipe nutrition calculator’s maths works out from the same protein, fat, carbohydrate and fibre. Counting fibre at 2 kcal per gram reproduces every published value to 0.01 kcal.'));
  md = inject(md, 'protein', figure(fig2, 'Figure 2. Measured bun protein against the mass balance of the dough worked out with the tool from the paper’s own flour and squid analyses, with our assumed values for sugar, oil, yeast, salt and improver. The two disagree by about 2 g per 100 g at every level.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
