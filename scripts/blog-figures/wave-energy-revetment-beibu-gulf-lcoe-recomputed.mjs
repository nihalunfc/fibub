// Figures for src/blog/discoveries/wave-energy-revetment-beibu-gulf-lcoe-recomputed.md, made with the maths of the
// LCOE calculator (src/lib/sci/eng-lcoe.ts).
// Run: node scripts/blog-figures/wave-energy-revetment-beibu-gulf-lcoe-recomputed.mjs
import fs from 'node:fs';
import { lcoe, crf, tornado } from '../../src/lib/sci/eng-lcoe.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/wave-energy-revetment-beibu-gulf-lcoe-recomputed.md', import.meta.url);

// Paper (Wei, Yang and Yang 2025, Frontiers in Energy Research 13: 1633706, doi:10.3389/fenrg.2025.1633706,
// CC BY 4.0): 500 cavity-type revetment units at 15 m spacing over 7.5 km of Beibu Gulf shoreline; unit rating
// given as 50 kW (Table 9) and 150 kW (section 4.3.2), average output 38.7 kW per unit; annual output 274 million
// kWh; initial investment CNY 1.71 billion; O&M 3.5 % of the investment per year (CNY 60 million); discount rate
// 6 %; 30-year life; LCOE 0.422 CNY/kWh against a 0.453 CNY/kWh coal benchmark; payback 6.8 years.
const CAPEX = 1.71e9, OM_FRAC = 0.035, RATE = 0.06, LIFE = 30, BENCH = 0.453, PAPER_LCOE = 0.422;
const MW = 75; // 500 units x 150 kW, the paper's own section 4.3.2 rating; only the yearly energy affects the LCOE
const KW = MW * 1000;
const E_PAPER = 274e6 / 1000; // MWh a year, as used in the paper's economics
const E_UNITS = (38.7 * 500 * 8760) / 1000; // MWh a year from the paper's own average output per unit
const perKW = { capex: CAPEX / KW, fom: (CAPEX * OM_FRAC) / KW };

const plant = (mwh, rate) => ({
  mw: MW, capex: perKW.capex, fom: perKW.fom, vom: 0, fuelPrice: 0, heatRate: 0,
  cf: mwh / (MW * 8760), degr: 0, rate, life: LIFE, esc: 0,
});
// CNY per kWh = (per MWh) / 1000.
const kwh = (mwh, rate) => +(lcoe(plant(mwh, rate)).lcoe / 1000).toFixed(4);

const cases = [
  { name: 'paper’s energy, no discounting', e: E_PAPER, rate: 0 },
  { name: 'paper’s energy, paper’s 6 %', e: E_PAPER, rate: RATE },
  { name: 'energy from 500 × 38.7 kW, no discounting', e: E_UNITS, rate: 0 },
  { name: 'energy from 500 × 38.7 kW, 6 %', e: E_UNITS, rate: RATE },
].map((c) => ({ ...c, gwh: +(c.e / 1000).toFixed(1), lcoe: kwh(c.e, c.rate), vsBench: +(kwh(c.e, c.rate) / BENCH).toFixed(2) }));

const base = lcoe(plant(E_PAPER, RATE));
const parts = { capex: +(base.parts.capex / 1000).toFixed(4), fom: +(base.parts.fom / 1000).toFixed(4) };
const bars = tornado(plant(E_PAPER, RATE), 0.2).map((b) => ({ name: b.name, low: +(b.low / 1000).toFixed(3), high: +(b.high / 1000).toFixed(3), swing: +(b.swing / 1000).toFixed(3) }));
const extra = {
  crf30at6: +crf(RATE, LIFE).toFixed(6),
  cfPaper: +(E_PAPER / (MW * 8760)).toFixed(4),
  cfUnits: +(E_UNITS / (MW * 8760)).toFixed(4),
  avgPowerNeeded: +(E_PAPER / 8.76).toFixed(0), // kW of average power needed for the paper's annual output
  paybackYears: +(CAPEX / 56e6).toFixed(1),
  ratioPaperVsUnits: +(E_PAPER / E_UNITS).toFixed(3),
};

// Figure 1: LCOE against discount rate for both energy figures.
const rates = Array.from({ length: 61 }, (_, i) => i * 0.002);
const fig1 = chart({
  title: 'Levelised cost against the discount rate', xLabel: 'Discount rate (% a year)', yLabel: 'LCOE (CNY per kWh)',
  series: [
    { name: 'paper’s 274 GWh a year', kind: 'line', x: rates.map((r) => r * 100), y: rates.map((r) => kwh(E_PAPER, r)) },
    { name: '500 × 38.7 kW = 169.5 GWh', kind: 'line', x: rates.map((r) => r * 100), y: rates.map((r) => kwh(E_UNITS, r)) },
  ],
  xDomain: [0, 12], yDomain: [0, 1.4], yTicks: [0, 0.2, 0.4, 0.6, 0.8, 1, 1.2, 1.4],
  hlines: [{ y: BENCH, text: `coal benchmark ${BENCH}` }, { y: PAPER_LCOE, text: `paper’s LCOE ${PAPER_LCOE}` }],
  vlines: [{ x: 6, text: 'the paper’s 6 %' }],
  desc: `With the paper's own 274 GWh a year the levelised cost rises from ${cases[0].lcoe} CNY/kWh undiscounted to ${cases[1].lcoe} at its stated 6 % discount rate; with the energy implied by its own per-unit output the 6 % figure is ${cases[3].lcoe}.`,
  height: 272,
});

// Figure 2: LCOE against annual output, at 0 % and 6 %.
const gwhs = Array.from({ length: 61 }, (_, i) => 120 + i * 3);
const fig2 = chart({
  title: 'Levelised cost against yearly output', xLabel: 'Annual output (GWh)', yLabel: 'LCOE (CNY per kWh)',
  series: [
    { name: 'no discounting', kind: 'line', x: gwhs, y: gwhs.map((g) => kwh(g * 1000, 0)) },
    { name: '6 % a year', kind: 'line', x: gwhs, y: gwhs.map((g) => kwh(g * 1000, RATE)) },
  ],
  xDomain: [120, 300], yDomain: [0, 1.4], yTicks: [0, 0.2, 0.4, 0.6, 0.8, 1, 1.2, 1.4],
  hlines: [{ y: BENCH, text: `coal benchmark ${BENCH}` }],
  vlines: [{ x: 169.5, text: '169.5', left: true }, { x: 274, text: '274 GWh', left: true }],
  desc: `The levelised cost is inversely proportional to the yearly output, so the paper's two output figures, 169.5 and 274 GWh, differ by a factor of ${extra.ratioPaperVsUnits} in energy and the same factor in cost.`,
  height: 272,
});

console.log(JSON.stringify({ perKW: { capex: +perKW.capex.toFixed(0), fom: +perKW.fom.toFixed(0) }, cases, parts, bars, extra }, null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'rate', figure(fig1, 'Figure 1. The levelised cost of the revetment array worked out with the LCOE calculator\'s maths from the paper\'s stated investment, O&M share and 30-year life, for its two yearly output figures, as the discount rate changes. The paper\'s own 0.422 CNY/kWh sits where the discount rate is zero.'));
  md = inject(md, 'output', figure(fig2, 'Figure 2. The same costs as a function of yearly output. Everything else held at the paper\'s values, the levelised cost scales as one over the energy, so the gap between the paper\'s two output figures carries straight into the cost.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
