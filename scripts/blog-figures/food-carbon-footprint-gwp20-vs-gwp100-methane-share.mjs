// Figures for src/blog/discoveries/food-carbon-footprint-gwp20-vs-gwp100-methane-share.md, made with the maths of the
// Carbon footprint calculator (src/lib/sci/footprint.ts: amount x factor, summed by category, per person).
// Run: node scripts/blog-figures/food-carbon-footprint-gwp20-vs-gwp100-methane-share.mjs   (rewrites the charts inside the article)
import fs from 'node:fs';
import { footprint } from '../../src/lib/sci/footprint.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/food-carbon-footprint-gwp20-vs-gwp100-methane-share.md', import.meta.url);

// Inputs from the paper: Osborn et al. (2026), Front. Sustain. Food Syst. 10, doi:10.3389/fsufs.2026.1717648 (CC BY 4.0).
// Per-item footprints, kg CO2e per kg of food, over 20 years (GWP20) and 100 years (GWP100), as printed in the paper's text.
const F = {
  Beef: [70.55, 28.73], Lamb: [60.27, 27.91], 'Cheddar cheese': [21.49, 9.78], Butter: [24.88, 11.52], Milk: [3.05, 1.39],
  Shrimp: [16.34, 14.85], 'Chicken breast': [4.63, 4.12], Rice: [6.48, 2.66], 'Black beans': [0.68, 0.62], Apple: [0.35, 0.34],
};
const CATS = { 'Red meat (mean)': [62.43, 26.71], 'Dairy (mean)': [12.50, 5.74], 'Vegetables (mean)': [0.78, 0.73] };
// OUR assumption: methane's warming potential is 80.8 over 20 years and 27.0 over 100 years (IPCC AR6, non-fossil methane);
// nitrous oxide is 273 over both, so it cancels in the difference. The paper's text did not give us its own methane factors.
const GW20 = 80.8, GW100 = 27.0;
const ch4 = (g20, g100) => (g20 - g100) / (GW20 - GW100); // kg CH4 per kg of food
const share = (g20, g100) => (ch4(g20, g100) * GW100) / g100; // methane's share of the 100-year footprint

// Two made-up one-person diets (kg of food in a year), OUR numbers.
const DIETS = {
  'Meat and dairy': { Beef: 15, 'Chicken breast': 20, 'Cheddar cheese': 10, Rice: 25, 'Black beans': 5, Apple: 30 },
  'Plant-leaning': { Beef: 3, 'Chicken breast': 15, 'Cheddar cheese': 5, Rice: 25, 'Black beans': 25, Apple: 60 },
};
const state = (diet, k) => ({ people: 1, flightFactor: 0, uplift: 0, flights: [], cats: [{ id: 'food', name: 'Food (per person)', perPerson: true, lines: Object.entries(diet).map(([label, amount]) => ({ label, amount, unit: 'kg', factor: F[label][k] })) }] });
const tot = Object.fromEntries(Object.entries(DIETS).map(([n, d]) => [n, [footprint(state(d, 0)).total, footprint(state(d, 1)).total]]));

const names = Object.keys(F);
console.log(JSON.stringify({
  ratios: Object.fromEntries([...Object.entries(F), ...Object.entries(CATS)].map(([n, [a, b]]) => [n, +(a / b).toFixed(3)])),
  methane: Object.fromEntries(Object.entries(F).map(([n, [a, b]]) => [n, { kgCH4: +ch4(a, b).toFixed(4), share: +(share(a, b) * 100).toFixed(1) }])),
  redMeatCh4: +ch4(62.43, 26.71).toFixed(4), vegPct: +((0.78 / 0.73 - 1) * 100).toFixed(1),
  diets: Object.fromEntries(Object.entries(tot).map(([n, [a, b]]) => [n, { gwp20: +a.toFixed(1), gwp100: +b.toFixed(1), ratio: +(a / b).toFixed(3) }])),
  drop20: +((1 - tot['Plant-leaning'][0] / tot['Meat and dairy'][0]) * 100).toFixed(1), drop100: +((1 - tot['Plant-leaning'][1] / tot['Meat and dairy'][1]) * 100).toFixed(1),
}));

const order = [...names].sort((a, b) => F[b][0] / F[b][1] - F[a][0] / F[a][1]);
const fig1 = chart({
  title: 'How much worse each food looks over 20 years', xLabel: 'Food, ordered by ratio (1 = Beef … 10 = Apple)', yLabel: 'GWP20 ÷ GWP100',
  series: [{ name: '', kind: 'dots', x: order.map((_, i) => i + 1), y: order.map((n) => +(F[n][0] / F[n][1]).toFixed(3)), size: 5 }],
  xDomain: [0.5, 10.5], yDomain: [0.9, 2.6], hlines: [{ y: 1, text: 'no difference' }],
  desc: `Ratio of the 20-year to the 100-year footprint for ten foods, from ${order.map((n) => `${n} ${(F[n][0] / F[n][1]).toFixed(2)}`).join(', ')}.`, height: 280,
});
const labels = order.map((n, i) => `${i + 1} ${n}`).join(', ');
const diet = Object.keys(DIETS);
const fig2 = chart({
  title: 'Two made-up diets, one year, one person', xLabel: 'Diet (1 = Meat and dairy, 2 = Plant-leaning)', yLabel: 'kg CO₂e per year',
  series: [
    { name: '20-year basis', kind: 'dots', x: [1, 2], y: diet.map((n) => +tot[n][0].toFixed(0)), size: 6 },
    { name: '100-year basis', kind: 'dots', x: [1, 2], y: diet.map((n) => +tot[n][1].toFixed(0)), size: 6, colour: 'var(--c-tools)' },
  ],
  xDomain: [0.5, 2.5], yDomain: [0, Math.ceil(tot['Meat and dairy'][0] / 100) * 100 + 100], xTicks: [1, 2],
  desc: `Footprint of two made-up yearly diets with the paper's per-kilogram values: ${diet.map((n) => `${n} ${tot[n][0].toFixed(0)} kg on a 20-year basis and ${tot[n][1].toFixed(0)} kg on a 100-year basis`).join('; ')}.`, height: 280,
});

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'ratios', figure(fig1, `Figure 1. The paper's 20-year value divided by its 100-year value for ten foods. Order, left to right: ${labels}.`));
  md = inject(md, 'diets', figure(fig2, 'Figure 2. The yearly footprint of two made-up diets (our amounts) using the paper\'s per-kilogram factors, summed the way the Carbon footprint calculator sums food lines.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
