// Figures for src/blog/discoveries/residential-pv-battery-self-consumption-poland.md, made with the maths of the
// Home battery tool (src/lib/sci/eng-homebattery.ts: the template year, the step-by-step battery balance and the sweep).
// Run: node scripts/blog-figures/residential-pv-battery-self-consumption-poland.mjs   (rewrites the charts in the article)
import fs from 'node:fs';
import { template, simulate, sweep, recommend, sizeSteps } from '../../src/lib/sci/eng-homebattery.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/residential-pv-battery-self-consumption-poland.md', import.meta.url);

// Inputs from the paper: Goryl, W. (2025), Energies 18(15): 4090, doi:10.3390/en18154090 (CC BY).
// Measured over 1 September 2023 to 30 August 2024: 7.28 kWp of panels, 6474.59 kWh of PV, 6885.44 kWh of house use,
// a 10 kWh battery worked between 20 % and 100 % charge at up to 5 kW, 2840.67 kWh exported, 3633.92 kWh of PV used
// on site (2201.48 kWh straight to the house and 1432.44 kWh through the battery).
const PV_KWH = 6474.59, USE_KWH = 6885.44, KWP = 7.28, EXPORT_KWH = 2840.67, PV_TO_BATT = 1432.44, DIRECT_KWH = 2201.48;
const MEAS = { decSolar: 83.19, maySolar: 936.99, janUse: 990.61, mayUse: 475.05, price: 0.33785 };
const USABLE = 8, POWER = 5, RTE = 0.9; // 10 kWh between 20 % and 100 % charge; round-trip efficiency is OUR assumption
const SWING = 0.8, AMP = 0.4; // summer-winter swing of the solar shape, and the winter uplift we add to the load: OURS

const daily = USE_KWH / 365, ypk = PV_KWH / KWP / 365;
const base = template({ days: 365, dailyLoad: daily, kwp: KWP, yieldPerKwp: ypk, swing: SWING });
// The template's own load year is nearly flat through the seasons; this house has a heat pump, so we tilt the load
// towards winter with a cosine (peak near 10 January) and rescale to the measured yearly total.
const load = Float64Array.from(base.load, (v, i) => v * (1 + AMP * Math.cos((2 * Math.PI * (Math.floor(i / 24) - 10)) / 365)));
const tot = load.reduce((a, b) => a + b, 0);
for (let i = 0; i < load.length; i++) load[i] *= USE_KWH / tot;
const solar = base.solar;

const MLEN = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const monthly = (a) => { let i = 0; const out = []; for (const L of MLEN) { let s = 0; for (let d = 0; d < L; d++) for (let h = 0; h < 24; h++) s += a[i * 24 + d * 24 + h]; i += L; out.push(+s.toFixed(1)); } return out; };
const mSolar = monthly(solar), mLoad = monthly(load);

const batt = { cap: USABLE, power: POWER, rte: RTE, reserve: 0 };
const none = simulate(load, solar, { ...batt, cap: 0, power: 0 });
const withB = simulate(load, solar, batt);
const rows = sweep(load, solar, batt, sizeSteps(20));
const rec = recommend(rows, 0.9);

const pc = (x) => +(100 * x).toFixed(1);
const measSc = pc((PV_KWH - EXPORT_KWH) / PV_KWH), measDirect = pc(DIRECT_KWH / PV_KWH), measSs = pc((USE_KWH - 3251.52) / USE_KWH);
console.log(JSON.stringify({
  daily: +daily.toFixed(3), ypk: +ypk.toFixed(4), mSolar, mLoad,
  none: { sc: pc(none.selfConsumption), ss: pc(none.selfSufficiency), imp: Math.round(none.imp), exp: Math.round(none.exp) },
  withB: { sc: pc(withB.selfConsumption), ss: pc(withB.selfSufficiency), imp: Math.round(withB.imp), exp: Math.round(withB.exp), charged: Math.round(withB.charged), discharged: Math.round(withB.discharged), lost: Math.round(withB.lost), cycles: Math.round(withB.cycles) },
  measured: { sc: measSc, direct: measDirect, ss: measSs, exp: EXPORT_KWH, pvToBatt: PV_TO_BATT },
  rec: { cap: rec.cap, power: +rec.power.toFixed(1), saved: Math.round(rec.saved) },
  sweep: rows.map((r) => [r.cap, pc(r.r.selfConsumption), pc(r.r.selfSufficiency), Math.round(r.r.imp), Math.round(r.perKwh)]),
  saving: Math.round((none.imp - withB.imp) * MEAS.price),
}, null, 1));

const mx = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const fig1 = chart({
  title: 'Month by month: the tool’s year against four measured months', xLabel: 'Month (1 = January)', yLabel: 'Energy (kWh)',
  series: [
    { name: 'Solar (tool)', kind: 'line', x: mx, y: mSolar },
    { name: 'House use (tool)', kind: 'line', x: mx, y: mLoad },
    { name: 'Measured', kind: 'dots', x: [12, 5, 1, 5], y: [MEAS.decSolar, MEAS.maySolar, MEAS.janUse, MEAS.mayUse], size: 4, colour: 'var(--ink)' },
  ],
  xDomain: [1, 12], yDomain: [0, 1200], xTicks: mx,
  desc: `The made-up template year scaled to the paper's totals: solar from ${mSolar[11]} kWh in December to ${mSolar[6]} kWh in July, house use from ${mLoad[6]} to ${mLoad[0]} kWh. The four black dots are the monthly values the paper states.`,
  height: 280,
});

const caps = rows.map((r) => r.cap);
const fig2 = chart({
  title: 'What each extra kWh of battery buys', xLabel: 'Usable battery capacity (kWh)', yLabel: 'Share (%)',
  series: [
    { name: 'Self-consumption', kind: 'line', x: caps, y: rows.map((r) => pc(r.r.selfConsumption)) },
    { name: 'Self-sufficiency', kind: 'line', x: caps, y: rows.map((r) => pc(r.r.selfSufficiency)) },
  ],
  xDomain: [0, 20], yDomain: [25, 65],
  hlines: [{ y: measSc, text: `measured ${measSc} %` }],
  vlines: [{ x: USABLE, text: '8 kWh usable' }],
  desc: `Self-consumption rises from ${pc(none.selfConsumption)} % with no battery to ${pc(withB.selfConsumption)} % at 8 kWh and only ${pc(rows[rows.length - 1].r.selfConsumption)} % at 20 kWh. The dashed line is the measured ${measSc} %.`,
  height: 280,
});

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'months', figure(fig1, 'Figure 1. The year of hourly load and solar that the Home battery tool builds from three numbers in the paper (yearly house use, array size and yearly yield), with a winter tilt added to the load. The black dots are the four monthly values the paper states; they were not used to build the curves except through the yearly totals.'));
  md = inject(md, 'sweep', figure(fig2, 'Figure 2. The tool’s sweep of battery sizes on that year. Self-consumption is the share of the solar used at home; self-sufficiency is the share of the house’s use met by solar. The dashed line is the share measured in the real house.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
