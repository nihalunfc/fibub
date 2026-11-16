// Figures for src/blog/discoveries/terraformed-mars-oxygen-climate-model.md, made with the maths of the
// Energy balance model (src/lib/sci/ebm.ts: one-layer greenhouse, black-body cooling, e-folding time).
// Run: node scripts/blog-figures/terraformed-mars-oxygen-climate-model.mjs   (rewrites the charts inside the article)
import fs from 'node:fs';
import { oneLayer, SIGMA, YEAR, efold } from '../../src/lib/sci/ebm.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/terraformed-mars-oxygen-climate-model.md', import.meta.url);

// Mars: standard planetary values (NASA Mars fact sheet), rounded.
const G = 3.71, AREA = 1.448e14, S = 586, ALB = 0.25, SOL = 88775, MARS_YEAR_DAYS = 687;
const P_NOW = 6;                 // hPa, present mean surface pressure, rounded
const PAPER_P = [30, 60];        // hPa, paper (abstract): lichen and moss; forests
const CP = 850;                  // J/(kg K), heat capacity of CO2-O2 air near 220 K, rounded, assumed
const T_SURF = 220;              // K, a typical Mars surface temperature for the cooling sum, assumed
const CO2_RESERVE = 20;          // hPa of CO2 that could be released from known reserves, Jakosky and Edwards (2018), rounded
const O2_TARGET = 130;           // hPa of oxygen: about what a person breathes at 3,500 m on Earth, assumed target
const NPP = [0.05, 0.1, 0.2, 0.3, 0.4, 0.6, 0.8, 1.0, 1.2]; // kg of carbon fixed per m² per year (desert to rainforest)

const columnMass = (hPa) => (hPa * 100) / G;              // kg of air above each m²
const totalMass = (hPa) => columnMass(hPa) * AREA;         // kg of air on the whole planet
// 1. How long the air takes to cool, for each pressure: e-folding time C/λ with C = cp × column mass and λ = 4σT³.
const lambda = 4 * SIGMA * T_SURF ** 3;
const ps = Array.from({ length: 100 }, (_, i) => 2 + i * 1);
const days = ps.map((p) => (efold(lambda, CP * columnMass(p)) * YEAR) / SOL);
const fig1 = chart({
  title: 'How many Mars days thicker air takes to cool', xLabel: 'Surface pressure (hPa)', yLabel: 'Cooling time (Mars days)',
  series: [{ name: 'Air cooling time', kind: 'line', x: ps, y: days.map((d) => +d.toFixed(3)) }],
  yDomain: [0, Math.max(...days) * 1.05],
  hlines: [{ y: 1, text: 'One Mars day' }], vlines: [{ x: P_NOW, text: 'Today' }, { x: PAPER_P[0], text: '30 hPa' }, { x: PAPER_P[1], text: '60 hPa' }],
  desc: 'The time for the air above each square metre to lose most of its heat rises in step with pressure, from under one Mars day today to several days at 60 hPa, still far shorter than a season.', height: 300,
});

// 2. Years of photosynthesis to make the oxygen: each kg of carbon fixed (and kept out of the air) frees 32/12 kg of O2.
const yrs = NPP.map((n) => columnMass(O2_TARGET) / (n * 32 / 12));
const fig2 = chart({
  title: 'Years of plant growth to make breathable air', xLabel: 'Plant growth (kg of carbon per m² per year)', yLabel: 'Years',
  series: [{ name: 'Years', kind: 'line', x: NPP, y: yrs.map((y) => Math.round(y)) }],
  yDomain: [0, 40000], yFmt: (v) => v.toLocaleString('en-GB'),
  vlines: [{ x: 0.2, text: 'Earth average' }],
  desc: 'At Earth-average plant growth it takes about 6,600 years to make 130 hPa of oxygen on Mars; even rainforest rates take over 1,000 years.', height: 300,
});

const g = (eps) => oneLayer(S, ALB, eps);
const facts = {
  massNow: totalMass(P_NOW).toExponential(2), mass30: totalMass(30).toExponential(2), mass60: totalMass(60).toExponential(2),
  coolNow: (days[ps.indexOf(P_NOW)]).toFixed(2), cool30: days[ps.indexOf(30)].toFixed(2), cool60: days[ps.indexOf(60)].toFixed(2),
  seasonDays: Math.round(MARS_YEAR_DAYS * 86400 / SOL / 4),
  greenhouse: [0, 0.5, 0.9, 1].map((e) => ({ e, ...Object.fromEntries(Object.entries(g(e)).map(([k, v]) => [k, typeof v === 'number' ? +v.toFixed(1) : v])) })),
  o2max: (CO2_RESERVE * 32 / 44).toFixed(1), o2col: columnMass(O2_TARGET).toFixed(0), yrsEarth: Math.round(columnMass(O2_TARGET) / (0.2 * 32 / 12)), yrsRain: Math.round(columnMass(O2_TARGET) / (1.0 * 32 / 12)),
  o2fromAllCO2now: (P_NOW * 0.95 * 32 / 44).toFixed(1),
};
console.log(JSON.stringify(facts, null, 1));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'cool', figure(fig1, 'Figure 1. Time for the air above each square metre to lose most of its heat by radiating at 220 K (heat capacity ÷ cooling rate, as in the Energy balance model), in Mars days. Our simple sum, not the paper\'s climate model.'));
  md = inject(md, 'oxygen', figure(fig2, 'Figure 2. Years to make 130 hPa of oxygen on Mars, if all the carbon that plants fix is kept out of the air. Plant growth from desert (left) to rainforest (right).'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
