// Figures for src/blog/discoveries/kamchatka-2025-earthquake-moment-magnitude-tsunami-speed.md, made with the maths of
// the Earthquake locator (src/lib/sci/quake.ts: moment magnitude) and the Wave calculator (src/lib/sci/waves.ts:
// linear wave dispersion and shoaling).
// Run: node scripts/blog-figures/kamchatka-2025-earthquake-moment-magnitude-tsunami-speed.mjs   (rewrites the charts inside the article)
import fs from 'node:fs';
import { momentMagnitude, seismicMoment } from '../../src/lib/sci/quake.ts';
import { wave, transform, G } from '../../src/lib/sci/waves.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/kamchatka-2025-earthquake-moment-magnitude-tsunami-speed.md', import.meta.url);

// Inputs. "Paper": Tang, Fukushima, Okada and Mizutani (2026), Geoscience Letters, doi:10.1186/s40562-026-00471-4 (CC BY 4.0).
const MODELS = [['A', 2.0e22], ['B', 1.7e22], ['C', 1.4e22]]; // geodetic seismic moments, N·m, paper
const MU = 40e9;                                             // shear modulus (rigidity) used in the paper, Pa
const MU_DEFAULT = 30e9;                                     // the Earthquake locator's default rigidity, Pa (tool default)
const RUP_L = 480e3;                                         // m: the paper's "at least 480 km" of rupture length
const RUP_W = 150e3;                                         // m: our assumption for the slipping width (the model grid is 240 km wide)
const BAND = [500, 10000];                                   // s: the paper's band-pass filter for the DART records
const DEPTH = 5000;                                          // m: our assumption, a typical deep North Pacific depth
const DIST = 1000e3;                                         // m: our round number for an ocean crossing, not a station distance
const T_EX = 600, H_DEEP = 0.3, H_COAST = 10;                // s, m, m: our example wave, not the paper's

// 1. Moment magnitude for each model, Mw = (2/3)(log10 M0 − 9.1).
const mw = MODELS.map(([n, m]) => [n, m, momentMagnitude(m)]);
const lx = Array.from({ length: 41 }, (_, i) => 21 + i * 0.05);
const fig1 = chart({
  title: 'Seismic moment and moment magnitude', xLabel: 'Seismic moment M0 (N·m, log scale)', yLabel: 'Moment magnitude Mw',
  series: [
    { name: 'Mw = (2/3)(log10 M0 − 9.1)', kind: 'line', x: lx, y: lx.map((v) => +momentMagnitude(10 ** v).toFixed(3)) },
    { name: 'The paper\'s three slip models', kind: 'dots', size: 5, x: mw.map((r) => Math.log10(r[1])), y: mw.map((r) => +r[2].toFixed(3)) },
  ],
  xDomain: [21, 23], yDomain: [7.9, 9.3], xTicks: [21, 21.5, 22, 22.5, 23],
  xFmt: (v) => (Number.isInteger(v) ? `1e${v}` : `${(10 ** (v % 1)).toFixed(1)}e${Math.floor(v)}`),
  hlines: [{ y: 9.0, text: '1952 Kamchatka, Mw 9.0' }],
  desc: `Moment magnitude rises by 2/3 for every tenfold rise in seismic moment. The paper's models A, B and C sit at Mw ${mw.map((r) => r[2].toFixed(2)).join(', ')}.`, height: 300,
});

// 2. Average slip needed on an assumed 480 km × 150 km rupture, and the rigidity effect.
const slip = (M0, mu) => M0 / (mu * RUP_L * RUP_W);
const rigShift = momentMagnitude(seismicMoment(MU, 1, 1)) - momentMagnitude(seismicMoment(MU_DEFAULT, 1, 1));

// 3. Tsunami speed against period in deep water (linear dispersion). Long-wave limit √(g h).
const c0 = Math.sqrt(G * DEPTH);
const lp = Array.from({ length: 81 }, (_, i) => 1.8 + i * 0.03); // log10 period from ~63 s to 10,000 s
const fig2 = chart({
  title: `How fast a tsunami travels in ${DEPTH / 1000} km of water`, xLabel: 'Wave period (s, log scale)', yLabel: 'Speed as % of √(gh)',
  series: [
    { name: 'Crests (phase speed)', kind: 'line', x: lp, y: lp.map((v) => +(100 * wave(10 ** v, DEPTH).C / c0).toFixed(2)) },
    { name: 'Energy (group speed)', kind: 'line', x: lp, y: lp.map((v) => +(100 * wave(10 ** v, DEPTH).Cg / c0).toFixed(2)) },
  ],
  xDomain: [1.8, 4], yDomain: [40, 102], xTicks: [2, Math.log10(300), 3, Math.log10(3000), 4],
  xFmt: (v) => String(Math.round(10 ** v)), hlines: [{ y: 100, text: '' }],
  bands: [{ x0: Math.log10(BAND[0]), x1: Math.log10(BAND[1]), text: 'periods the paper kept' }],
  desc: `Below about 300 seconds a tsunami in 5 km of water travels noticeably slower than the long-wave speed of ${c0.toFixed(0)} m/s; above 1,000 seconds it is within 1%.`, height: 300,
});

// Delays over our 1,000 km example crossing (energy travels at the group speed).
const delay = (T) => DIST / wave(T, DEPTH).Cg - DIST / c0;
const rows = [300, 600, 1000].map((T) => { const w = wave(T, DEPTH); return { T, Lkm: w.L / 1000, C: w.C, Cg: w.Cg, delay: delay(T) }; });

// 4. Shoaling of our example wave from deep water to the coast (no refraction, no breaking).
const sh = transform(T_EX, H_DEEP, DEPTH, H_COAST), sh100 = transform(T_EX, H_DEEP, DEPTH, 100);
const green = (DEPTH / H_COAST) ** 0.25;

const facts = {
  mw: mw.map((r) => `${r[0]} ${r[2].toFixed(3)}`), ratioAC: (2.0 / 1.4).toFixed(2),
  slip: MODELS.map(([n, m]) => `${n} ${slip(m, MU).toFixed(2)} m`), slip30: slip(2.0e22, MU_DEFAULT).toFixed(2),
  rigShift: rigShift.toFixed(3), c0: c0.toFixed(1), c0kmh: (c0 * 3.6).toFixed(0), crossNd: (DIST / c0 / 60).toFixed(1),
  rows: rows.map((r) => `${r.T}s L=${r.Lkm.toFixed(1)}km C=${r.C.toFixed(1)} Cg=${r.Cg.toFixed(1)} delay=${r.delay.toFixed(0)}s`),
  shoal: `Ks10=${sh.Ks.toFixed(3)} H10=${sh.H2.toFixed(3)} Ks100=${sh100.Ks.toFixed(3)} H100=${sh100.H2.toFixed(3)} green=${green.toFixed(3)}`,
  ex: (() => { const w = wave(T_EX, DEPTH, H_DEEP); return `L=${w.L.toFixed(0)} C=${w.C.toFixed(1)} Cg=${w.Cg.toFixed(1)} regime=${w.regime} h/L=${w.rel.toFixed(4)}`; })(),
};
console.log(JSON.stringify(facts, null, 1));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'mw', figure(fig1, 'Figure 1. Moment magnitude from the Earthquake locator\'s maths, with the three geodetic seismic moments reported in the paper. The 1952 earthquake\'s Mw 9.0 is the commonly quoted catalogue value.'));
  md = inject(md, 'speed', figure(fig2, 'Figure 2. Tsunami speed against period from the Wave calculator\'s linear wave maths, in an assumed 5,000 m of water. The shaded band is the range of periods the paper kept when filtering its DART records.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
