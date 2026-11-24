// Figures for src/blog/discoveries/precast-concrete-yard-carbon-footprint-scopes.md, made with the maths of the
// Scope emissions tool (src/lib/sci/ghgscopes.ts: activity rows x factors, totals by scope and category, intensity,
// year-on-year change). Run: node scripts/blog-figures/precast-concrete-yard-carbon-footprint-scopes.mjs
import fs from 'node:fs';
import { readRows, totals, intensity, change } from '../../src/lib/sci/ghgscopes.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/precast-concrete-yard-carbon-footprint-scopes.md', import.meta.url);

// Every activity amount and emission factor below is from the paper: Suriyanon, N., Sutheerawatthana, P.,
// Rinchumphu, D. and Suksawat, R. (2025), Construction Economics and Building 25(2), doi:10.5130/AJCEB.v25i2.9030
// (CC BY 4.0). Factors are the Thailand Greenhouse Gas Management Organization's and Ecoinvent's, as the paper
// states them, in kg CO2e per unit. Two rows (other yard transport, office paper transport) are given in the paper
// only as group remainders, so they go in as one lump each.
const CSV = `year,type,description,amount,unit,factor,market factor
2022,stationary,LPG for the rebar cutting machine,420,kg,3.1134,
2022,mobile,Gasoline for the concrete vibrator,218,L,2.1894,
2022,mobile,Diesel for truck transport,950,L,2.7406,
2022,refrigerant,R-410A top-up in yard truck air conditioning,0.30,kg,2090,
2022,refrigerant,R-410A top-up in office air conditioning,0.32,kg,2090,
2022,process,Methane from the septic tank,38.34,kg,28,
2022,electricity,Casting yards,15618,kWh,0.4999,
2022,electricity,Office air conditioning,5967,kWh,0.4999,
2022,goods,Ready-mix concrete 350 KSC,2198,m3,294,
2022,goods,Reinforcement bar,65743.43,kg,2.14,
2022,goods,Flat bar,699.60,kg,0.988,
2022,goods,Wire mesh,44064.84,kg,1.6382,
2022,goods,Tying wire,237.50,kg,1.14,
2022,goods,PVC pipe class 5,44532.08,cm3,0.0045,
2022,goods,Oxygen,1604.46,kg,0.469,
2022,goods,Tap water,14765,m3,0.541,
2022,goods,Office copier paper A4 80 gsm,32500,sheet,0.0115,
2022,goods,Office toilet paper 300 m,8,roll,2.81,
2022,fuel-energy,Upstream LPG,420,kg,0.272,
2022,fuel-energy,Upstream gasoline,218,L,0.344,
2022,fuel-energy,Upstream diesel,950,L,0.237,
2022,fuel-energy,Grid losses on yard electricity,15618,kWh,0.0987,
2022,fuel-energy,Grid losses on office electricity,5967,kWh,0.0987,
2022,freight,Concrete mixer 10-wheeler loaded to the yard,99173.76,t.km,0.0625,
2022,freight,Concrete mixer 10-wheeler empty return,8347.20,km,0.6316,
2022,freight,22-wheeler loaded from the steel factory,84222.94,t.km,0.0459,
2022,freight,22-wheeler empty return,2631.97,km,1.0206,
2022,freight,Other yard material transport (paper's remainder),1,lump,582,
2022,freight,Office paper transport (paper's remainder),1,lump,37,
2022,waste,Ready-mix concrete waste,344160,kg,0,
2022,waste,Reinforcement bar waste,1288.03,kg,0.003,
2022,waste,Wire mesh waste,1458.02,kg,0.003,
2022,waste,Office waste,949.63,kg,0.8076,
2022,commuting,Subcontractor commuting (gasoline),226.35,L,2.2394,
2022,commuting,Office employee commuting (gasoline),2716.26,L,2.2394,`;

const { rows, errors } = readRows(CSV);
const T = totals(rows)[0];
const t = (kg) => kg / 1000;
const PAPER = { total: 915.489, s1: 6.759, s2: 10.79, s3: 897.94, goods: 869.388, fuelEnergy: 2.544, freight: 18.643, waste: 0.775, commuting: 6.59, volume: 2054.6, capacity: 3028.8, intensity: 0.445580, office: 12.598, yard: 902.891, readyMix: 646.212, altTotal: 914.729 };
const byCat = [...T.byCat.entries()].map(([k, v]) => [k, +t(v).toFixed(3)]);
const I = intensity(T.totalLoc, PAPER.volume, 0); // "per employee" with the production volume typed in: t per m3

// The paper's full-capacity scenario, rebuilt: yard emissions scale with volume, the office does not.
const atVolume = (V) => (t(T.totalLoc) - PAPER.office) * (V / PAPER.volume) + PAPER.office;
const full = atVolume(PAPER.capacity);
const scen = change(I.perEmployee, full / PAPER.capacity);
// Over-ordering: 2198 m3 bought for 2054.60 m3 of product.
const excess = 2198 - PAPER.volume;
const readyMixRow = rows.find((r) => r.desc.startsWith('Ready-mix'));
const mixerRows = rows.filter((r) => r.desc.startsWith('Concrete mixer'));
const readyMixKg = readyMixRow.amount * readyMixRow.factor, mixerKg = mixerRows.reduce((s, r) => s + r.amount * r.factor, 0);
const saving = ((readyMixKg + mixerKg) * (excess / 2198)) / T.totalLoc;

const Vs = Array.from({ length: 61 }, (_, i) => 1000 + i * 40);
const fig1 = chart({
  title: 'Where the yard’s carbon comes from', xLabel: 'Category (GHG Protocol)', yLabel: 't CO₂e (log scale)',
  series: [{ name: '', noLegend: true, kind: 'dots', x: byCat.map((_, i) => i), y: byCat.map(([, v]) => Math.log10(Math.max(0.01, v))), size: 4 }],
  xDomain: [-0.6, byCat.length - 0.4], yDomain: [-1.3, 3.2], xTicks: byCat.map((_, i) => i), xFmt: () => '',
  yTicks: [-1, 0, 1, 2, 3], yFmt: (v) => (v < 0 ? '0.1' : v === 0 ? '1' : v === 1 ? '10' : v === 2 ? '100' : '1000'),
  desc: `Each of the ${byCat.length} activity categories in the rebuilt inventory, in tonnes of CO2e on a log scale. Purchased goods and services dominates at ${byCat.find(([k]) => k.includes('Purchased goods'))[1]} t.`, height: 260,
});
const fig2 = chart({
  title: 'Carbon per cubic metre against output', xLabel: 'Yearly production (m³ of precast)', yLabel: 't CO₂e per m³',
  series: [
    { name: 'As built', kind: 'line', x: Vs, y: Vs.map((V) => +(atVolume(V) / V).toFixed(5)) },
    { name: 'With no ready-mix over-ordering', kind: 'line', x: Vs, y: Vs.map((V) => +((atVolume(V) * (1 - saving)) / V).toFixed(5)) },
  ],
  xDomain: [1000, 3050], yDomain: [0.41, 0.46],
  vlines: [{ x: PAPER.volume, text: `${PAPER.volume} m³ actual` }, { x: PAPER.capacity, text: 'capacity', left: true }],
  desc: `Emissions intensity against yearly output. Because 98 % of the footprint is purchased materials and their transport, filling the yard to capacity moves the intensity only from ${I.perEmployee.toFixed(4)} to ${(full / PAPER.capacity).toFixed(4)} t per m3, while cutting the concrete over-order saves about ${(100 * saving).toFixed(1)} %.`, height: 265,
});

console.log(JSON.stringify({
  errors, rows: rows.length,
  scopes: { s1: +t(T.s1).toFixed(3), s2: +t(T.s2loc).toFixed(3), s3: +t(T.s3).toFixed(3), total: +t(T.totalLoc).toFixed(3) },
  paperScopes: PAPER, diff: { total: +(t(T.totalLoc) - PAPER.total).toFixed(3), s1: +(t(T.s1) - PAPER.s1).toFixed(3), s3: +(t(T.s3) - PAPER.s3).toFixed(3) },
  byCat, shares: Object.fromEntries(byCat.map(([k, v]) => [k, +((100 * v) / t(T.totalLoc)).toFixed(2)])),
  scopeShares: { s1: +((100 * T.s1) / T.totalLoc).toFixed(2), s2: +((100 * T.s2loc) / T.totalLoc).toFixed(2), s3: +((100 * T.s3) / T.totalLoc).toFixed(2) },
  readyMixShare: +((100 * readyMixKg) / T.totalLoc).toFixed(2), readyMixPlusTransport: +((100 * (readyMixKg + mixerKg)) / T.totalLoc).toFixed(2),
  intensity: +I.perEmployee.toFixed(6), full: +full.toFixed(3), fullIntensity: +(full / PAPER.capacity).toFixed(6), scenarioChange: +(100 * scen.rel).toFixed(2),
  excess, excessOfBought: +((100 * excess) / 2198).toFixed(2), excessOfNeeded: +((100 * excess) / PAPER.volume).toFixed(2), saving: +(100 * saving).toFixed(2),
  tdBoth21585: +t(2 * 21585 * 0.0987).toFixed(3), tdSplit: +t((15618 + 5967) * 0.0987).toFixed(3),
  sizes: [fig1.length, fig2.length],
}, null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'cats', figure(fig1, `Figure 1. The rebuilt inventory by GHG Protocol category, in tonnes of CO₂e on a log scale. Left to right: ${byCat.map(([k]) => k.replace(/^\d+ /, '')).join(', ')}.`));
  md = inject(md, 'intensity', figure(fig2, 'Figure 2. Emissions per cubic metre against yearly output, worked out with the tool’s intensity arithmetic. The office is treated as fixed and everything else as proportional to output (our assumption, following the paper’s own capacity scenario).'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
