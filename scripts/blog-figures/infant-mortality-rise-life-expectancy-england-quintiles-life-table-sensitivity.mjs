// Figures and numbers for src/blog/discoveries/infant-mortality-rise-life-expectancy-england-quintiles-life-table-sensitivity.md,
// made with the maths of the Life table tool (src/lib/sci/lifetable.ts).
// Run: node scripts/blog-figures/infant-mortality-rise-life-expectancy-england-quintiles-life-table-sensitivity.mjs
import fs from 'node:fs';
import { lifeTable } from '../../src/lib/sci/lifetable.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/infant-mortality-rise-life-expectancy-england-quintiles-life-table-sensitivity.md', import.meta.url);

// Numbers stated in the text of Norman, Esan, McHale and Taylor-Robinson (2025), Applied Spatial Analysis and
// Policy 18: 135, doi:10.1007/s12061-025-09739-2 (CC BY 4.0): life expectancy at birth 81.29 (2011) and 81.04 (2019) for
// England, 76.89 (most deprived fifth) and 84.24 (least deprived) in 2019; a trend-scenario gain of 28 and 15 days
// for those two fifths; 1,392 excess infant deaths in 2014-2019.
const PAPER = { e2011: 81.29, e2019: 81.04, eDeprived: 76.89, eLeast: 84.24, gainDeprived: 28, gainLeast: 15, excess: 1392, years: 6 };
// OUR ASSUMPTIONS (not in the paper's text): a smooth adult death-rate curve (Gompertz-type), an infant death rate
// of 3.9 per 1,000, and 640,000 births a year in England. The article shows the answer hardly depends on them.
const ages = [0, 1, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85];
const rates = (m0, B) => ages.map((x, i) => (i === 0 ? m0 : i === 1 ? 0.00015 : Math.min(0.9, 0.0001 + B * Math.exp(0.095 * (x + 2.5)))));
const table = (m0, B) => lifeTable(ages, rates(m0, B), { method: 'cd', sex: 'female' });
const e0 = (m0, B) => table(m0, B)[0].ex;
const solve = (f, target, lo, hi) => { for (let i = 0; i < 80; i++) { const m = (lo + hi) / 2; (f(m) < target ? (lo = m) : (hi = m)); } return (lo + hi) / 2; };
const M0 = 0.0039;
// Calibrate the adult level B so that e0 equals a target (e0 falls as B rises).
const calib = (target) => { let lo = 1e-7, hi = 1e-3; for (let i = 0; i < 80; i++) { const m = (lo + hi) / 2; (e0(M0, m) > target ? (lo = m) : (hi = m)); } return (lo + hi) / 2; };
// Days of life expectancy lost when the infant death probability q0 is higher by dq.
function daysLost(B, dq) {
  const base = table(M0, B), m0 = solve((m) => table(m, B)[0].qx, base[0].qx + dq, 0.001, 0.05);
  return (base[0].ex - table(m0, B)[0].ex) * 365.25;
}
const bases = [['Most deprived fifth', PAPER.eDeprived], ['England', PAPER.e2019], ['Least deprived fifth', PAPER.eLeast]].map(([name, e]) => ({ name, e, B: calib(e) }));
const per1000 = bases.map((b) => daysLost(b.B, 0.001));
const BE = bases[1].B;
const tE = table(M0, BE).map((r) => ({ ...r, mx: +r.mx.toFixed(6) }));

console.log('B (England)', BE, 'q0', tE[0].qx.toFixed(5), 'e0', tE[0].ex.toFixed(2), 'a0', tE[0].ax.toFixed(4));
console.log('rounded Mx for the tool:', rates(M0, BE).map((m) => +m.toFixed(6)).join(' '));
const rounded = rates(M0, BE).map((m) => +m.toFixed(6));
const tR = lifeTable(ages, rounded, { method: 'cd', sex: 'female' });
console.log('with rounded Mx: e0', tR[0].ex.toFixed(2), 'q0', tR[0].qx.toFixed(5), 'e1', tR[1].ex.toFixed(2));
const r2 = rounded.slice(); r2[0] = 0.004908;
const tR2 = lifeTable(ages, r2, { method: 'cd', sex: 'female' });
console.log('with m0 = 0.004908: e0', tR2[0].ex.toFixed(2), 'q0', tR2[0].qx.toFixed(5), 'days', ((tR[0].ex - tR2[0].ex) * 365.25).toFixed(1), 'dq', ((tR2[0].qx - tR[0].qx) * 1000).toFixed(3));
console.log('days lost per +1 infant death per 1,000 births (deprived, England, least):', per1000.map((x) => x.toFixed(1)).join(' '));
// What extra infant deaths do the paper's gains imply?
const impDep = PAPER.gainDeprived / per1000[0], impLeast = PAPER.gainLeast / per1000[2];
console.log('implied extra infant deaths per 1,000: deprived', impDep.toFixed(2), 'least', impLeast.toFixed(2));
// England-wide: 1,392 excess deaths over six years of births; average and a straight-line rise to 2019.
const births = 640000;
const avg = PAPER.excess / PAPER.years / births * 1000;
const peak = (PAPER.excess / ((0 + 1 + 2 + 3 + 4 + 5))) * 5 / births * 1000;   // excess grows 0,1,...,5 units; the sum is 1,392
console.log('average extra per 1,000:', avg.toFixed(3), 'days', (avg * per1000[1]).toFixed(1), ' | 2019 peak per 1,000:', peak.toFixed(3), 'days', (peak * per1000[1]).toFixed(1));
const stall = (PAPER.e2011 - PAPER.e2019) * 365.25;
console.log('stall 2011-2019 days:', stall.toFixed(1), 'share explained by 2019 peak', (peak * per1000[1] / stall * 100).toFixed(0), '% ; by average', (avg * per1000[1] / stall * 100).toFixed(0), '%');
// Baseline sensitivity: e0 0.7x and 1.3x the adult level.
console.log('sensitivity to adult level B x0.7, x1, x1.3:', [0.7, 1, 1.3].map((f) => daysLost(BE * f, 0.001).toFixed(1)).join(' '));
// Share of the effect: the 1-year-old life expectancy.
console.log('e1', tR[1].ex.toFixed(2), 'e1 * 365.25 / 1000 days', (tR[1].ex * 0.365).toFixed(1));

const xs = Array.from({ length: 16 }, (_, i) => (i * 1.5) / 15);
const fig = chart({
  title: 'Life expectancy lost to extra infant deaths', xLabel: 'Extra infant deaths per 1,000 births', yLabel: 'Days of life expectancy at birth lost',
  series: bases.map((b) => ({ name: `e0 ${b.e}`, x: xs, y: xs.map((x) => daysLost(b.B, x / 1000)), kind: 'line' })),
  vlines: [{ x: +avg.toFixed(2), text: 'six-year average', left: false }, { x: +peak.toFixed(2), text: '2019 peak (our ramp)', dy: 14 }],
  hlines: [{ y: PAPER.gainLeast, text: "paper's 15 days" }, { y: PAPER.gainDeprived, text: "paper's 28 days" }],
  desc: 'Three nearly straight lines, about 30 days of life expectancy at birth lost for each extra infant death per 1,000 births, for baselines of 76.89, 81.04 and 84.24 years. The paper\'s 15 and 28 day gains correspond to about 0.5 and 0.9 extra deaths per 1,000.',
});
let md = fs.readFileSync(ART, 'utf8');
md = inject(md, 'sens', figure(fig, 'Our life tables: the loss in life expectancy at birth is almost proportional to the extra infant deaths, whatever the starting level of life expectancy.'));
fs.writeFileSync(ART, md);
