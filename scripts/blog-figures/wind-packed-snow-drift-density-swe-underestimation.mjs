// Figures for src/blog/discoveries/wind-packed-snow-drift-density-swe-underestimation.md, made with the maths of the
// Snow load tool (src/lib/sci/snowslope.ts: SWE from depth and density, layers, ground load, slope bands).
// Run: node scripts/blog-figures/wind-packed-snow-drift-density-swe-underestimation.mjs
import fs from 'node:fs';
import { sweFromDepth, layers, groundLoad, roofLoad, band } from '../../src/lib/sci/snowslope.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/wind-packed-snow-drift-density-swe-underestimation.md', import.meta.url);

// Depths (m) and bulk densities (kg/m³) as printed in the running text of Boardman, E. N. et al. (2026),
// The Cryosphere 20: 4877-4910, doi:10.5194/tc-20-4877-2026 (CC BY 4.0). Wind River Range, Wyoming.
const PITS = [
  { name: 'Nivation hollow drift', d: 5.9, rho: 585 },
  { name: '2023 drift', d: 5.8, rho: 568 },
  { name: '2026 drift', d: 5.6, rho: 526 },
  { name: '2026 drift (4 m)', d: 4.0, rho: 564 },
  { name: 'High snowfield', d: 4.0, rho: 457 },
  { name: 'Hunters Hump', d: 2.1, rho: 438 },
  { name: 'Summit drift', d: 1.6, rho: 401 },
  { name: 'Hollow upper edge', d: 1.5, rho: 484 },
  { name: 'Goat Flat', d: 1.1, rho: 471 },
  { name: 'Hollow lower edge', d: 1.0, rho: 552 },
  { name: 'North-facing 43° slope', d: 0.8, rho: 393 },
  { name: 'Continental Glacier', d: 0.8, rho: 387 },
];
const SURVEY_MEAN = 450; // kg/m³, mean of 36 locations (coefficient of variation 13 %)
const OPEN_MEAN = 471, FOREST_MEAN = 405, FOREST_MIN = 339;
const DRIFT = PITS[0];
const UNDER = [0.14, 0.35]; // the measured 585 kg/m³ is 14 to 35 % above global empirical model predictions

const r2 = (v, n = 1) => +v.toFixed(n);
// SWE of each pit from its own depth and density, and from one survey-mean density instead.
const pits = PITS.map((p) => {
  const own = sweFromDepth(p.d * 100, p.rho), mean = sweFromDepth(p.d * 100, SURVEY_MEAN);
  return { ...p, swe: r2(own), sweMean: r2(mean), miss: r2(own - mean), missPc: r2(((own - mean) / own) * 100), load: r2(groundLoad(own), 2) };
});
// What the empirical models would have given for the 5.9 m drift.
const modelRho = UNDER.map((u) => r2(DRIFT.rho / (1 + u), 1));
const drift = {
  swe: r2(sweFromDepth(DRIFT.d * 100, DRIFT.rho)), load: r2(groundLoad(sweFromDepth(DRIFT.d * 100, DRIFT.rho)), 2),
  roofAt08: r2(roofLoad(groundLoad(sweFromDepth(DRIFT.d * 100, DRIFT.rho)), 0.8).roof, 2),
  model: modelRho.map((rho) => ({ rho, swe: r2(sweFromDepth(DRIFT.d * 100, rho)), miss: r2(sweFromDepth(DRIFT.d * 100, DRIFT.rho) - sweFromDepth(DRIFT.d * 100, rho)), missPc: r2((1 - sweFromDepth(DRIFT.d * 100, rho) / sweFromDepth(DRIFT.d * 100, DRIFT.rho)) * 100) })),
  vsSurvey: r2(sweFromDepth(DRIFT.d * 100, DRIFT.rho) - sweFromDepth(DRIFT.d * 100, SURVEY_MEAN)),
  basinRatio: r2(sweFromDepth(DRIFT.d * 100, DRIFT.rho) / 210, 1), // basin mean SWE 0.21 m on 2 June 2025
};
// Three-layer reconstruction: the paper gives the upper 2 m (595) and lowest 2 m (582) of the 5.9 m pit and a bulk of 585.
const mid = (585 * 590 - 582 * 200 - 595 * 200) / 190;
const recon = layers([{ h: 200, rho: 582 }, { h: 190, rho: r2(mid, 1) }, { h: 200, rho: 595 }]);
// Ignoring the depth-density link: mean(d·ρ) − mean(d)·mean(ρ) = r · SD(d) · SD(ρ) (depth in cm → SWE in mm).
const COV = [0.5, 1.0, 1.5].map((sd) => ({ sdDepth: sd, bias: r2((0.59 * (sd * 1000) * 57) / 1000) })); // r = 0.59, SD(ρ) = 57 kg/m³; depth in mm, so cov/1000 is in mm of SWE
const slope43 = band(43).name;

// Figure 1: SWE against depth for three densities, with the paper's pits on top.
const dd = Array.from({ length: 61 }, (_, i) => i * 0.1);
const line = (rho) => dd.map((d) => r2(sweFromDepth(d * 100, rho)));
const fig1 = chart({
  title: 'Water in the snowpack: depth times density', xLabel: 'Snow depth (m)', yLabel: 'SWE (mm, = kg/m²)',
  series: [
    { name: 'Measured drift density 585', kind: 'line', x: dd, y: line(DRIFT.rho) },
    { name: 'Survey mean 450', kind: 'line', x: dd, y: line(SURVEY_MEAN) },
    { name: 'Forest minimum 339', kind: 'line', x: dd, y: line(FOREST_MIN) },
    { name: "The paper's snow pits", kind: 'dots', x: PITS.map((p) => p.d), y: pits.map((p) => p.swe), size: 3.4, colour: 'var(--ink)' },
  ],
  xDomain: [0, 6], yDomain: [0, 3600],
  desc: `Snow water equivalent against snow depth for bulk densities of 585, 450 and 339 kilograms per cubic metre, with the twelve snow pits whose depth and density the paper prints. The deepest drift, 5.9 metres at 585, holds ${drift.swe} millimetres of water.`, height: 300,
});

// Figure 2: how much water is missed by using one density for every depth.
const fig2 = chart({
  title: 'Water missed by using one mean density', xLabel: 'Snow depth (m)', yLabel: 'SWE missed (mm)',
  series: [
    { name: 'If 450 is used for snow that is 585', kind: 'line', x: dd, y: dd.map((d) => r2(sweFromDepth(d * 100, DRIFT.rho) - sweFromDepth(d * 100, SURVEY_MEAN))) },
    { name: `If ${modelRho[1]} is used (model 35 % low)`, kind: 'line', x: dd, y: dd.map((d) => r2(sweFromDepth(d * 100, DRIFT.rho) - sweFromDepth(d * 100, modelRho[1]))) },
    { name: `If ${modelRho[0]} is used (model 14 % low)`, kind: 'line', x: dd, y: dd.map((d) => r2(sweFromDepth(d * 100, DRIFT.rho) - sweFromDepth(d * 100, modelRho[0]))) },
  ],
  xDomain: [0, 6], yDomain: [0, 1000], hlines: [{ y: 210, text: "the basin's whole mean SWE, 210 mm" }],
  desc: `The water missed from a drift of 585 kilograms per cubic metre when a lower density is assumed, against depth. At 5.9 metres the shortfall reaches ${drift.vsSurvey} millimetres for a survey-mean density and ${drift.model[1].miss} millimetres for a model density 35 per cent too low.`, height: 300,
});

console.log(JSON.stringify({ pits, drift, modelRho, recon: { ...recon, rho: r2(recon.rho, 1), swe: r2(recon.swe) }, mid: r2(mid, 1), COV, slope43,
  forest: { open: r2(sweFromDepth(200, OPEN_MEAN)), forest: r2(sweFromDepth(200, FOREST_MEAN)), diff: r2(sweFromDepth(200, OPEN_MEAN) - sweFromDepth(200, FOREST_MEAN)) },
  loadDrift: { ground: drift.load, roof08: drift.roofAt08, kgm2: r2(roofLoad(groundLoad(drift.swe), 0.8).kgm2, 0) } }, null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'swe', figure(fig1, 'Figure 1. Snow water equivalent against depth for three of the paper\'s bulk densities, worked out with the Snow load tool\'s maths, with the twelve pits whose depth and density the paper prints as dots.'));
  md = inject(md, 'missed', figure(fig2, 'Figure 2. The water a survey-mean or model density misses in a dense drift, against depth. The dashed line is the whole study basin\'s mean SWE on 2 June 2025, for scale.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
