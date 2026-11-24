// Figures for src/blog/discoveries/ex-alta-2-cubesat-open-source-solar-panels-orbit-power.md, made with the maths of
// the CubeSat power budget tool (src/lib/sci/cubesatpower.ts: eclipse fraction, panel power by attitude, orbit simulation).
// Run: node scripts/blog-figures/ex-alta-2-cubesat-open-source-solar-panels-orbit-power.mjs   (rewrites the charts)
import fs from 'node:fs';
import { period, betaStar, eclipseFraction, panelPeak, simulate } from '../../src/lib/sci/cubesatpower.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/ex-alta-2-cubesat-open-source-solar-panels-orbit-power.md', import.meta.url);

// Inputs from the paper: Sorensen and Halliwell (2024), arXiv:2407.19356 (CC BY 4.0), SmallSat 2024.
// Ex-Alta 2, 3U, Earth-facing; five panels of six 69 mm × 40 mm cells: body zenith, port and starboard, and two
// deployables stowed over port and starboard that open parallel to the zenith face. Panel MPP 14.4 V × 0.48 A.
// Deployed from the ISS on 2023-04-24. Simulated average 9.6 W (±17 %) nominal, 2.9 W with both wings stuck.
// OUR assumptions: cell efficiency 30.7 % (the maker's beginning-of-life figure for XTJ Prime), cells fill the stated
// cell area (packing 100 %), ISS-like orbit at 415 km and 51.64°, the node drifting −5.0° a day, no other losses unless said.
const CELL = 6.9 * 4.0, PANEL = 6 * CELL; // cm²
const H = 415, INC = 51.64, NODE_RATE = -5.0;
const base = { eff: 0.307, packing: 1, tempCoef: -0.25, tempC: 28, refC: 28, degPerYear: 0, years: 0, other: 1 };
const P = (name, face) => ({ name, face, areaCm2: PANEL });
// Body frame of a nadir-pointing craft in the tool: +Z towards the Earth, so the zenith face is −Z; ±Y face the orbit normal.
const NOMINAL = [P('Zenith body', '-Z'), P('Wing 1 (open)', '-Z'), P('Wing 2 (open)', '-Z'), P('Port body', '+Y'), P('Starboard body', '-Y')];
const STUCK = [P('Zenith body', '-Z'), P('Wing 1 (stowed, port)', '+Y'), P('Wing 2 (stowed, starboard)', '-Y')];
const att = { mode: 'nadir', sunFace: '-Z' };
const bat = { capacityWh: 1e6, chargeEff: 1, dischargeEff: 1, startSoc: 50 };
const avg = (panels, beta, extra = {}) => simulate(H, beta, { ...base, ...extra, panels }, att, 0, bat, 1, 720).genAvg;

// Beta angle through a year (standard formula from the Sun's ecliptic longitude and the orbit's node).
const R = Math.PI / 180, EPS = 23.44 * R;
const sunLon = (d) => { const n = d, L = (280.46 + 0.9856474 * n) * R, g = (357.528 + 0.9856003 * n) * R; return L + (1.915 * Math.sin(g) + 0.02 * Math.sin(2 * g)) * R; };
const D0 = (Date.UTC(2023, 3, 24) - Date.UTC(2000, 0, 1, 12)) / 864e5;
const betaOn = (k) => { const G = sunLon(D0 + k), O = (NODE_RATE * k) * R, i = INC * R;
  return Math.asin(Math.cos(G) * Math.sin(O) * Math.sin(i) - Math.sin(G) * Math.cos(EPS) * Math.cos(O) * Math.sin(i) + Math.sin(G) * Math.sin(EPS) * Math.cos(i)) / R; };
const days = Array.from({ length: 366 }, (_, k) => k), betas = days.map(betaOn);
const ZEN = [P('Zenith body', '-Z')];
const sunlit = (panels, b) => avg(panels, b) / (1 - eclipseFraction(H, b));
const genN = betas.map((b) => avg(NOMINAL, b)), genS = betas.map((b) => avg(STUCK, b));
const mean = (a) => a.reduce((s, x) => s + x, 0) / a.length;
// The same with typical losses: panels at 60 °C (−0.25 %/°C from 28 °C) and 90 % kept after converters (our assumption).
const lossy = { tempC: 60, other: 0.9 };
const genNL = betas.map((b) => avg(NOMINAL, b, lossy)), genSL = betas.map((b) => avg(STUCK, b, lossy));

const bs = Array.from({ length: 77 }, (_, i) => -76 + 2 * i);
const fig1 = chart({
  title: 'Ex-Alta 2: orbit-average power against beta angle', xLabel: 'Beta angle (°)', yLabel: 'Orbit-average power (W)',
  series: [
    { name: 'Wings open', kind: 'line', x: bs, y: bs.map((b) => +avg(NOMINAL, b).toFixed(2)) },
    { name: 'Both wings stuck', kind: 'line', x: bs, y: bs.map((b) => +avg(STUCK, b).toFixed(2)) },
  ],
  xDomain: [-76, 76], yDomain: [0, 12], hlines: [{ y: 3.8, text: 'nominal use 3.8 W' }],
  desc: `Orbit-average solar power of a nadir-pointing 3U CubeSat at 415 km with five (or three) six-cell panels. With the wings open it is ${avg(NOMINAL, 0).toFixed(1)} W at beta 0 and ${avg(NOMINAL, 70).toFixed(1)} W at beta 70.`, height: 270,
});
const fig2 = chart({
  title: 'Through the first year after deployment', xLabel: 'Days after 24 April 2023', yLabel: 'Orbit-average power (W)',
  series: [
    { name: 'Wings open', kind: 'line', x: days.filter((k) => k % 3 === 0), y: genN.filter((_, k) => k % 3 === 0).map((v) => +v.toFixed(2)) },
    { name: 'Both wings stuck', kind: 'line', x: days.filter((k) => k % 3 === 0), y: genS.filter((_, k) => k % 3 === 0).map((v) => +v.toFixed(2)) },
  ],
  xDomain: [0, 365], yDomain: [0, 12], hlines: [{ y: +mean(genN).toFixed(2), text: `mean ${mean(genN).toFixed(1)} W` }],
  desc: `Orbit-average power day by day for an ISS-like orbit whose beta angle swings between about plus and minus 75 degrees. Year means ${mean(genN).toFixed(1)} W with wings open and ${mean(genS).toFixed(1)} W with both stuck.`, height: 260,
});

const out = {
  periodMin: +(period(H) / 60).toFixed(2), betaStar: +betaStar(H).toFixed(1), eclMax: +eclipseFraction(H, 0).toFixed(4), sunlitMin: +(100 * (1 - eclipseFraction(H, 0))).toFixed(1),
  eclMin: +(eclipseFraction(H, 0) * period(H) / 60).toFixed(1),
  panelCm2: +PANEL.toFixed(1), panelPeak: +panelPeak({ ...base, panels: [] }, P('x', '-Z')).toFixed(2), mpp: +(14.4 * 0.48).toFixed(2),
  betaRange: [+Math.min(...betas).toFixed(1), +Math.max(...betas).toFixed(1)],
  b0: { nom: +avg(NOMINAL, 0).toFixed(2), stuck: +avg(STUCK, 0).toFixed(2) }, b60: { nom: +avg(NOMINAL, 60).toFixed(2), stuck: +avg(STUCK, 60).toFixed(2) },
  b74: { nom: +avg(NOMINAL, 74).toFixed(2), stuck: +avg(STUCK, 74).toFixed(2) },
  year: { nom: +mean(genN).toFixed(2), stuck: +mean(genS).toFixed(2), nomMin: +Math.min(...genN).toFixed(2), nomMax: +Math.max(...genN).toFixed(2), stuckMin: +Math.min(...genS).toFixed(2), stuckMax: +Math.max(...genS).toFixed(2), ratio: +(mean(genN) / mean(genS)).toFixed(2) },
  yearLossy: { nom: +mean(genNL).toFixed(2), stuck: +mean(genSL).toFixed(2) },
  zenOnlyYear: +mean(betas.map((b) => avg(ZEN, b))).toFixed(2), sunlitYear: { nom: +mean(betas.map((b) => sunlit(NOMINAL, b))).toFixed(2), stuck: +mean(betas.map((b) => sunlit(STUCK, b))).toFixed(2) },
  paperBand: [+(9.6 * 0.83).toFixed(2), +(9.6 * 1.17).toFixed(2)],
  daysStuckBelow38: genS.filter((v) => v < 3.8).length, daysNomBelow38: genN.filter((v) => v < 3.8).length,
};
// What the tool page shows for the "Check it yourself" inputs (500-km default replaced by 415 km, beta 20, wings open).
const chk = simulate(H, 20, { ...base, panels: NOMINAL }, att, 3.8, { capacityWh: 20, chargeEff: 0.95, dischargeEff: 0.95, startSoc: 100 }, 3, 1440);
out.check = { genAvg: +chk.genAvg.toFixed(2), sunAvg: +chk.sunAvg.toFixed(2), eclMin: +(chk.ecl * chk.T / 60).toFixed(1), maxDod: +chk.maxDod.toFixed(1), eGen: +chk.eGen.toFixed(2), eLoad: +chk.eLoad.toFixed(2) };
console.log(JSON.stringify(out));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'beta', figure(fig1, 'Figure 1. Orbit-average power from the CubeSat power budget tool\'s maths for Ex-Alta 2 pointing at the Earth at 415 km, against the beta angle (how far the Sun sits above the orbit plane). Cell efficiency 30.7 % and no other losses (our assumptions). The dashed line is the satellite\'s stated nominal use, 3.8 W.'));
  md = inject(md, 'year', figure(fig2, 'Figure 2. The same power day by day for the first year, with the beta angle of an ISS-like orbit (51.64°, node drifting 5° a day; our assumption for the start). The dashed line is the year\'s mean with the wings open.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((x) => (x.length / 1024).toFixed(1) + ' KB').join(', '));
}
