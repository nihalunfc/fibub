// Figures for src/blog/discoveries/gran-canaria-wave-power-buoy-era5-machine-learning.md, made with the maths of the
// Wave calculator (src/lib/sci/waves.ts: wave, transform).
// Run: node scripts/blog-figures/gran-canaria-wave-power-buoy-era5-machine-learning.mjs   (rewrites the charts inside the article)
import fs from 'node:fs';
import { wave, transform } from '../../src/lib/sci/waves.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/gran-canaria-wave-power-buoy-era5-machine-learning.md', import.meta.url);
// Paper: Pérez-Molina and Carta (2025), J. Mar. Sci. Eng. 13, 1194, doi:10.3390/jmse13061194 (CC BY): buoy 2442 at 780 m depth
// off NW Gran Canaria, mean Hs 1.67 m and Te 5.49 s (buoy), 1.64 m and 8.33 s (ERA5); mean power 8.9 kW/m (buoy), 12.5 kW/m (ERA5);
// P = rho g² Hs² Te / (64 pi), rho = 1025 kg/m³.
const DEPTH = 780, BUOY = { Hs: 1.67, Te: 5.49, P: 8.9 }, ERA = { Hs: 1.64, Te: 8.33, P: 12.5 };
// A sea state of significant height Hs carries the energy of a regular wave of height Hs/√2 (Hrms for a Rayleigh sea).
const seaPower = (Hs, Te, h = DEPTH) => wave(Te, h, Hs / Math.SQRT2).P / 1000; // kW per metre of crest
const formula = (Hs, Te) => (1025 * 9.81 ** 2 * Hs * Hs * Te) / (64 * Math.PI) / 1000;

// Figure 1: wave power against energy period for the two mean heights, with the paper's mean powers marked.
const te = Array.from({ length: 51 }, (_, i) => 4 + i * 0.12);
const fig1 = chart({
  title: 'Wave power from Hs and Te in 780 m of water', xLabel: 'Energy period Te (s)', yLabel: 'Wave power (kW per m of crest)',
  series: [
    { name: 'Hs 1.67 m (buoy mean)', kind: 'line', x: te, y: te.map((t) => +seaPower(BUOY.Hs, t).toFixed(3)) },
    { name: 'Hs 1.64 m (ERA5 mean)', kind: 'line', dash: '4 3', x: te, y: te.map((t) => +seaPower(ERA.Hs, t).toFixed(3)) },
    { name: 'Paper\'s mean power', kind: 'dots', x: [BUOY.Te, ERA.Te], y: [BUOY.P, ERA.P], size: 4.5 },
  ],
  xDomain: [4, 10], yDomain: [0, 16],
  desc: `At the mean height and period, the buoy's sea gives ${seaPower(BUOY.Hs, BUOY.Te).toFixed(1)} kW/m and ERA5's ${seaPower(ERA.Hs, ERA.Te).toFixed(1)} kW/m; the paper's mean powers, 8.9 and 12.5 kW/m, sit above the curves because the average of a squared height is larger than the square of the average height.`, height: 280,
});

// Figure 2: the ERA5 mean sea state carried from 780 m towards the coast (straight parallel contours, head-on), power per metre.
const hs = [780, 400, 200, 100, 70, 50, 40, 30, 25, 20, 15, 12, 10, 8];
const inshore = (h) => { const t = transform(ERA.Te, ERA.Hs / Math.SQRT2, DEPTH, h, 0); return { H: t.H2 * Math.SQRT2, P: wave(ERA.Te, h, t.H2).P / 1000 }; };
const fig2 = chart({
  title: 'The ERA5 mean sea carried shoreward (head-on, no losses)', xLabel: 'Water depth (m, log scale)', yLabel: 'Significant height Hs (m)',
  series: [{ name: 'Hs, Te 8.33 s', kind: 'line', x: hs.map((h) => +Math.log10(h).toFixed(4)), y: hs.map((h) => +inshore(h).H.toFixed(3)) },
    { name: 'Hs, Te 5.49 s', kind: 'line', dash: '4 3', x: hs.map((h) => +Math.log10(h).toFixed(4)), y: hs.map((h) => +(transform(BUOY.Te, 1, DEPTH, h).H2 * ERA.Hs).toFixed(3)) }],
  xDomain: [Math.log10(8), Math.log10(800)], yDomain: [1.4, 1.8], xTicks: [10, 30, 100, 300].map((v) => Math.log10(v)), xFmt: (t) => String(Math.round(10 ** t)),
  desc: 'A sea of 1.64 m carried inshore first dips by about 9 % where the group speed peaks, then grows again in shallow water; the longer 8.33 s waves feel the bottom from about 60 m, the 5.49 s waves only from about 25 m. Power per metre stays the same without losses.', height: 280,
});

const facts = {
  buoyMeanState: +seaPower(BUOY.Hs, BUOY.Te).toFixed(3), eraMeanState: +seaPower(ERA.Hs, ERA.Te).toFixed(3),
  formulaBuoy: +formula(BUOY.Hs, BUOY.Te).toFixed(3), formulaEra: +formula(ERA.Hs, ERA.Te).toFixed(3),
  regularBuoy: +(wave(BUOY.Te, DEPTH, BUOY.Hs).P / 1000).toFixed(3), regime: [wave(BUOY.Te, DEPTH).regime, wave(ERA.Te, DEPTH).regime, wave(ERA.Te, DEPTH).L.toFixed(1), wave(BUOY.Te, DEPTH).L.toFixed(1)],
  ratios: [(BUOY.P / seaPower(BUOY.Hs, BUOY.Te)).toFixed(3), (ERA.P / seaPower(ERA.Hs, ERA.Te)).toFixed(3)], teRatio: (ERA.Te / BUOY.Te).toFixed(3),
  inshore: hs.map((h) => [h, inshore(h).H.toFixed(3), inshore(h).P.toFixed(2)]), min: Math.min(...hs.map((h) => inshore(h).H)).toFixed(3),
  cgERA30: wave(ERA.Te, 30).Cg.toFixed(2), cgERAdeep: wave(ERA.Te, DEPTH).Cg.toFixed(2),
};
console.log(JSON.stringify(facts));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'power', figure(fig1, 'Figure 1. Wave power from the Wave calculator\'s linear-wave maths for a sea state (regular-wave height Hs/√2) at the buoy\'s 780 m depth, with the paper\'s mean powers as dots. Our recomputation from the paper\'s stated means.'));
  md = inject(md, 'shoal', figure(fig2, 'Figure 2. The mean sea state carried from 780 m towards the coast with the Wave calculator\'s shoaling maths, waves arriving head-on over straight contours with no friction or breaking. A simulation for illustration, not data.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
