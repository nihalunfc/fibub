// Figures for src/blog/discoveries/oxygen-blender-rop-uganda-dalys-averted-icer.md, made with the maths of the
// DALY and QALY calculator (src/lib/sci/daly.ts: disc, burden, icer).
// Run: node scripts/blog-figures/oxygen-blender-rop-uganda-dalys-averted-icer.mjs   (rewrites the charts in the article)
import fs from 'node:fs';
import { disc, burden } from '../../src/lib/sci/daly.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/oxygen-blender-rop-uganda-dalys-averted-icer.md', import.meta.url);

// Inputs from the paper: Smith et al. (2026), Frontiers in Medicine 13: 1715127, doi:10.3389/fmed.2026.1715127 (CC BY 4.0).
const W = 0.184;      // disability weight for severe visual impairment from ROP (GBD 2021), as used by the paper
const L = 58;         // years of life assumed (Uganda average life expectancy in the paper)
const R = 0.03;       // the paper's discount rate
const ROP0 = 0.07, ROP1 = 0.035;   // severe ROP in at-risk survivors, without and with oxygen blenders
const SVI = 0.621;                 // untreated severe ROP that ends in severe visual impairment or blindness
// Four equipment scenarios, exactly as the paper's decision tree uses them: the price of one blender set
// (including 25 % tax) and the number of at-risk infants it serves over its life (73 a year for 5 years in the
// base case, 52 a year for 3 years at worst, 122 a year for 10 years at best).
const SCEN = [
  { name: 'Base case (Neotech)', cost: 1341.25, infants: 365, paperCase: 168.92, paperDaly: 32.60 },
  { name: 'Vayu, no medical air', cost: 677.50, infants: 365, paperCase: 85.33, paperDaly: 16.52 },
  { name: 'Most favourable', cost: 677.50, infants: 1220, paperCase: 25.55, paperDaly: 4.97 },
  { name: 'Least favourable', cost: 1844.11, infants: 156, paperCase: 543.99, paperDaly: 104.98 },
];
const PAPER = { dalyPerCase: 5.18 };

// The paper's DALYs per case, under continuous discounting (what the tool does) and under a discrete annual sum.
const contin = (r) => W * disc(L, r);
const annuityDue = (r) => { let s = 0; for (let t = 0; t < L; t++) s += W / (1 + r) ** t; return s; };
const ordinary = (r) => { let s = 0; for (let t = 1; t <= L; t++) s += W / (1 + r) ** t; return s; };

// One blender set over its life: cases of severe visual impairment and DALYs, with and without it.
const cases = (n, p) => n * p * SVI;
const dalysFor = (n, p, r) => burden([{ name: 'SVI from ROP', deaths: 0, yearsLost: 0, cases: cases(n, p), weight: W, duration: L }], r).daly;
const averted = (s) => cases(s.infants, ROP0) - cases(s.infants, ROP1);
const costPerCase = (s) => s.cost / averted(s);
const dalysAverted = (s, r) => dalysFor(s.infants, ROP0, r) - dalysFor(s.infants, ROP1, r);
const costPerDaly = (s, r) => s.cost / dalysAverted(s, r);

const rates = Array.from({ length: 61 }, (_, i) => i / 1000);   // 0 to 6 %
const marks = [0, 0.015, 0.03, 0.05];

const fig1 = chart({
  title: 'DALYs lost per case of ROP blindness', xLabel: 'Discount rate (% a year)', yLabel: 'DALYs per case',
  series: [
    { name: 'Continuous (the tool)', kind: 'line', x: rates.map((r) => r * 100), y: rates.map((r) => +contin(r).toFixed(4)) },
    { name: 'Year-by-year sum', kind: 'line', x: rates.map((r) => r * 100), y: rates.map((r) => +annuityDue(r).toFixed(4)), dash: '5 4' },
  ],
  xDomain: [0, 6], yDomain: [2, 11],
  hlines: [{ y: PAPER.dalyPerCase, text: `paper: ${PAPER.dalyPerCase}` }], vlines: [{ x: 3, text: "the paper's 3 %" }],
  desc: `DALYs lost per case of blindness from retinopathy of prematurity against the discount rate, for a disability weight of ${W} over ${L} years, under continuous discounting and under a year-by-year sum.`,
  height: 270,
});

const fig2 = chart({
  title: 'Cost per DALY averted, by discount rate', xLabel: 'Discount rate (% a year)', yLabel: 'US$ per DALY averted',
  series: SCEN.map((s) => ({ name: s.name, kind: 'line', x: rates.map((r) => r * 100), y: rates.map((r) => +costPerDaly(s, r).toFixed(3)) })),
  xDomain: [0, 6], yDomain: [0, 200],
  hlines: [{ y: 50, text: 'malaria nets, about $50' }],
  desc: 'Cost per DALY averted for one oxygen blender set over five years, against the discount rate, for the three equipment prices in the paper. All three stay far below the $50 per DALY benchmark for malaria nets at every rate.',
  height: 270,
});

const out = {
  dalyPerCase: { continuous: +contin(R).toFixed(4), annuityDue: +annuityDue(R).toFixed(4), ordinary: +ordinary(R).toFixed(4), undiscounted: +contin(0).toFixed(3) },
  byRate: marks.map((r) => ({ r, daly: +contin(r).toFixed(3), costPerDalyBase: +costPerDaly(SCEN[0], r).toFixed(2) })),
  scenarios: SCEN.map((s) => ({
    name: s.name, cases: +averted(s).toFixed(3), costPerCase: +costPerCase(s).toFixed(2), paperCase: s.paperCase,
    dalysAverted: +dalysAverted(s, R).toFixed(2), costPerDaly: +costPerDaly(s, R).toFixed(2), paperDaly: s.paperDaly,
    costPerDalyPaperRule: +(s.cost / (averted(s) * PAPER.dalyPerCase)).toFixed(2),
  })),
  national: { cases: 545, dalysOurs: Math.round(545 * contin(R)), dalysPaper: Math.round(545 * PAPER.dalyPerCase) },
};
console.log(JSON.stringify(out, null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'daly', figure(fig1, `Figure 1. DALYs lost per case of blindness from retinopathy of prematurity, for the paper's disability weight of ${W} over ${L} years of life. The solid line is the continuous discounting the DALY and QALY calculator uses; the dashed line adds up one whole year at a time, starting with an undiscounted first year. At 3 % the two differ by 2.4 %, and the dashed line is what the paper reports.`));
  md = inject(md, 'icer', figure(fig2, 'Figure 2. Cost per DALY averted for one blender set over five years, worked out from the paper\'s equipment prices and its averted cases per set. Every price stays far below the $50 per DALY often quoted for insecticide-treated nets, whatever discount rate is chosen.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
