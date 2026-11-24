// Figures for src/blog/discoveries/pluripotent-stem-cell-seed-train-inoculation-lag-growth-rate-hemocytometer.md, made with
// the maths of the Hemocytometer cell counter (src/lib/sci/cells.ts: cellCount, seeding) and the Cell doubling time tool
// (src/lib/sci/doubling.ts: twoPoint, growthFactor, tdFromRate).
// Run: node scripts/blog-figures/pluripotent-stem-cell-seed-train-inoculation-lag-growth-rate-hemocytometer.mjs
import fs from 'node:fs';
import { cellCount, seeding } from '../../src/lib/sci/cells.ts';
import { twoPoint, growthFactor, tdFromRate } from '../../src/lib/sci/doubling.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/pluripotent-stem-cell-seed-train-inoculation-lag-growth-rate-hemocytometer.md', import.meta.url);

// Inputs from the paper: Ullmann et al. (2024), Stem Cell Res Ther 15: 89, doi:10.1186/s13287-024-03699-z (CC BY 4.0).
// Inoculation 5e5 viable cells/mL in a 150 mL bioreactor; peak densities (1e6 cells/mL) of the 4-day (D4) passages p1..p5 and the
// 3-day (D3) passages; specific growth rate about 1.0 per day on days 2-3; cryopreservation densities 20 to 100 million
// cells/mL in 1 mL vials, post-thaw recovery 80 to 100 %, thaw into 10 mL then resuspend in 20 mL; cumulative yields of
// 1.29e14 (D4, 5 passages, 20 days) and 3.76e12 (D3, 5 passages, 15 days).
const N0 = 5e5, VOL = 150, MU = 1.0;
const D4 = [8.1, 6.6, 7.9, 9.7, 9.2], D3 = [5.2, 4.2, 4.3, 3.7, 4.0];
const td = tdFromRate(MU / 24);                                   // hours, at 1.0 per day
const lagFor = (peak, hours) => hours - td * Math.log2((peak * 1e6) / N0);   // hours with no growth that explain the peak
const lagD4 = D4.map((p) => lagFor(p, 96)), lagD3 = D3.map((p) => lagFor(p, 72));
const mean = (a) => a.reduce((s, x) => s + x, 0) / a.length;
const sd = (a) => Math.sqrt(a.reduce((s, x) => s + (x - mean(a)) ** 2, 0) / (a.length - 1));

// A made-up count at the peak (OUR assumption): 1:10 dilution plus 1:1 trypan blue = x20, four large squares.
const cc = cellCount([40, 41, 39, 42], [1, 0, 1, 1], 20);
// Inoculum from a vial (our assumption on the vial: 1 mL at 100 million cells/mL, 80 % recovered, thawed to 20 mL).
const live100 = (100e6 * 0.8) / 20, live20 = (20e6 * 0.8) / 20;
const s100 = seeding(live100, N0 * VOL, 1, VOL, 0), s20 = seeding(live20, N0 * VOL, 1, VOL, 0);

const t = Array.from({ length: 97 }, (_, i) => i);               // hours
const gf = (lag) => t.map((h) => +Math.log10(N0 * growthFactor(td, h, lag)).toFixed(3));
const lag4 = mean(lagD4);
const fig1 = chart({
  title: 'Growth from 0.5 million cells/mL: ideal and observed', xLabel: 'Hours after inoculation', yLabel: 'Cells per mL',
  series: [
    { name: 'No lag, 1.0 per day', kind: 'line', x: t, y: gf(0) },
    { name: `${lag4.toFixed(0)} h lost`, kind: 'line', x: t, y: gf(lag4) },
    { name: 'D4 peaks', kind: 'dots', x: D4.map(() => 96), y: D4.map((p) => +Math.log10(p * 1e6).toFixed(3)), size: 4, colour: 'var(--ink)' },
  ],
  xDomain: [0, 96], yDomain: [5.5, 7.6], yTicks: [5.7, 6, 6.7, 7, 7.7].filter((v) => v <= 7.6), yFmt: (v) => (10 ** v / 1e6).toFixed(v < 6.1 ? 1 : 0) + 'M',
  desc: `Cell density from 0.5 million per mL over 96 hours: the ideal line at 1.0 per day reaches ${(N0 * growthFactor(td, 96) / 1e6).toFixed(0)} million, while the five 4-day passages peaked at 6.6 to 9.7 million; about ${lag4.toFixed(0)} hours of growth are missing.`, height: 280,
});
const lagBars = chart({
  title: 'Growth hours missing from each passage', xLabel: 'Passage number', yLabel: 'Hours with no growth',
  series: [{ name: '4-day passages', kind: 'line', x: [1, 2, 3, 4, 5], y: lagD4.map((v) => +v.toFixed(1)) }, { name: '3-day passages', kind: 'line', x: [1, 2, 3, 4, 5], y: lagD3.map((v) => +v.toFixed(1)) }],
  xDomain: [1, 5], yDomain: [0, 40], xTicks: [1, 2, 3, 4, 5],
  desc: `Hours of ideal growth at 1.0 per day that each passage is missing. The 4-day passages lose ${Math.min(...lagD4).toFixed(0)} to ${Math.max(...lagD4).toFixed(0)} hours, the 3-day ones ${Math.min(...lagD3).toFixed(0)} to ${Math.max(...lagD3).toFixed(0)}.`, height: 250,
});

const prod = (a) => a.reduce((p, x) => p * (x * 1e6) / N0, 1);
const out = {
  td: +td.toFixed(2), fold4p1: +(D4[0] * 1e6 / N0).toFixed(1), tdEff4p1: +twoPoint(0, N0, 96, D4[0] * 1e6).toFixed(1), tdEff3p1: +twoPoint(0, N0, 72, D3[0] * 1e6).toFixed(1),
  idealFold96: +growthFactor(td, 96).toFixed(1), idealFold72: +growthFactor(td, 72).toFixed(1),
  lagD4: lagD4.map((v) => +v.toFixed(1)), lagD3: lagD3.map((v) => +v.toFixed(1)), lagD4mean: +mean(lagD4).toFixed(1), lagD3mean: +mean(lagD3).toFixed(1),
  muAvg4p1: +(Math.log(D4[0] * 1e6 / N0) / 4).toFixed(3), mu7: +(Math.log(70) / 7).toFixed(3), fold7: 35e6 / N0,
  inoc: N0 * VOL, s100: { susp: +s100.suspensionMl.toFixed(2), med: +s100.mediumMl.toFixed(2) }, s20: { susp: +s20.suspensionMl.toFixed(1), live20 },
  vials20: +(N0 * VOL / (20e6 * 0.8)).toFixed(2), vials100: +(N0 * VOL / (100e6 * 0.8)).toFixed(3),
  count: { live: cc.liveMl, viab: +cc.viability.toFixed(3), poisson: +cc.poissonRel.toFixed(3), counted: cc.counted },
  d4mean: +mean(D4).toFixed(2), d4sd: +sd(D4).toFixed(2), d4cv: +(sd(D4) / mean(D4)).toFixed(3), d3cv: +(sd(D3) / mean(D3)).toFixed(3),
  prodD4: prod(D4), prodD3: prod(D3), impliedStartD4: 1.29e14 / prod(D4), impliedStartD3: 3.76e12 / prod(D3), start150: N0 * VOL,
  mlD4: 1.29e14 / prod(D4) / N0, mlD3: 3.76e12 / prod(D3) / N0,
};
console.log(JSON.stringify(out));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'growth', figure(fig1, 'Figure 1. Cell density from 0.5 million per mL (log scale): growth at 1.0 per day from the start, the same growth after about a day of no net growth, and the five 4-day peaks the paper reports.'));
  md = inject(md, 'lag', figure(lagBars, 'Figure 2. Hours of growth at 1.0 per day that each passage is missing, worked out from the peak density it reached.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, lagBars].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
