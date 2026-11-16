// Figures for src/blog/discoveries/green-silver-copper-nanoparticles-4-nitrophenol-reduction.md, made with the maths of the
// Reaction kinetics fitter (src/lib/sci/kinetics.ts) and the Beer–Lambert calculator (src/lib/sci/beer.ts).
// Run: node scripts/blog-figures/green-silver-copper-nanoparticles-4-nitrophenol-reduction.mjs   (rewrites the charts inside the article)
import fs from 'node:fs';
import { conc, fitOrders, akaikeWeights } from '../../src/lib/sci/kinetics.ts';
import { solveBL, absQuality } from '../../src/lib/sci/beer.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/green-silver-copper-nanoparticles-4-nitrophenol-reduction.md', import.meta.url);

// Inputs from the paper: Joseph Ignacy et al. (2026), Front. Mater. 13, 1741476, doi:10.3389/fmats.2026.1741476 (CC BY).
const NP_MM = 1, NP_UL = 300, WATER_UL = 2000, BH4_M = 0.1, BH4_UL = 100, CAT_UL = 1000; // as described in the paper
const CONV = { Cu: 0.935, Ag: 0.90 }, T_CU = 50;   // conversions; Cu "complete within 50 min" (we take 93.5 % at 50 min)
// Literature: ε of 4-nitrophenolate near 400 nm, 18 380 L/(mol·cm) (Bowers et al. 1980, Clin. Chem. 26, 724).
const EPS = 18380, PATH = 1;

// 1. Starting absorbance (our assumption: everything mixed in one cuvette, total 3.4 mL).
const Vtot = NP_UL + WATER_UL + BH4_UL + CAT_UL;          // µL
const c0 = NP_MM * 1e-3 * NP_UL / Vtot;                    // mol/L
const A0 = solveBL({ eps: EPS, l: PATH, c: c0 }).A, q0 = absQuality(A0);
const nNP = NP_MM * 1e-3 * NP_UL * 1e-6, nBH4 = BH4_M * BH4_UL * 1e-6;  // mol
const excess = nBH4 / nNP, excessStoich = nBH4 / (0.75 * nNP); // 6 e- per 4-NP, 8 e- per BH4-: 0.75 BH4- per 4-NP

// 2. Rate constant implied by a conversion X at time t (first order): k = −ln(1 − X)/t.
const kOf = (X, t) => -Math.log(1 - X) / t;
const kCu = kOf(CONV.Cu, T_CU);

// 3. Simulated run for Cu: absorbance at 400 nm every 5 min for 50 min, first order with kCu, plus a fixed ±0.006 scatter.
const tt = Array.from({ length: 11 }, (_, i) => i * 5);
const wob = [0.004, -0.006, 0.005, -0.002, 0.006, -0.005, 0.001, 0.003, -0.004, 0.002, -0.001];
const AA = tt.map((t, i) => +(conc(1, A0, kCu, t) + wob[i]).toFixed(4));
const fits = fitOrders(tt, AA), w = akaikeWeights(fits.map((f) => f.aicc));
const fFirst = fits[1];

const facts = {
  c0_uM: +(c0 * 1e6).toFixed(1), A0: +A0.toFixed(3), quality: q0.level, excess: +excess.toFixed(1), excessStoich: +excessStoich.toFixed(1),
  kCu: +kCu.toFixed(4), tHalfCu: +(Math.LN2 / kCu).toFixed(1), kCu_s: +(kCu / 60).toExponential(3), kNorm: +(kCu / 0.5).toFixed(4),
  agTimes: [20, 30, 50, 90].map((t) => [t, +kOf(CONV.Ag, t).toFixed(4)]),
  fit: fits.map((f, i) => ({ order: f.order, k: +f.k.toPrecision(4), r2: +f.r2.toFixed(4), w: +w[i].toFixed(3) })), kFit: +fFirst.k.toFixed(4), seK: +fFirst.seK.toFixed(4),
};
console.log(JSON.stringify(facts));
console.log(tt.map((t, i) => `${t}\t${AA[i]}`).join('\n'));

const td = Array.from({ length: 51 }, (_, i) => i);
const fig1 = chart({
  title: 'Absorbance at 400 nm, copper catalyst (simulated)', xLabel: 'Time (min)', yLabel: 'Absorbance at 400 nm',
  series: [
    { name: 'Simulated readings', kind: 'dots', x: tt, y: AA, size: 3.5 },
    { name: `First order, k = ${fFirst.k.toFixed(4)} /min`, kind: 'line', x: td, y: td.map((t) => +conc(1, fFirst.a0, fFirst.k, t).toFixed(4)) },
    { name: 'Zero order', kind: 'line', dash: '4 3', colour: 'var(--muted)', x: td, y: td.map((t) => +conc(0, fits[0].a0, fits[0].k, t).toFixed(4)) },
  ],
  xDomain: [0, 50], yDomain: [0, 1.8], height: 260,
  desc: `Simulated absorbance falls from ${A0.toFixed(2)} to about 0.1 in 50 minutes; the first-order fit gives k = ${fFirst.k.toFixed(4)} per minute.`,
});
const tg = Array.from({ length: 81 }, (_, i) => 10 + i * 1.5);
const fig2 = chart({
  title: 'Rate constant implied by a conversion, for any reaction time', xLabel: 'Time to reach the conversion (min)', yLabel: 'k (per minute)',
  series: [
    { name: '93.5 % (copper)', kind: 'line', x: tg, y: tg.map((t) => +kOf(CONV.Cu, t).toFixed(4)) },
    { name: '90 % (silver)', kind: 'line', x: tg, y: tg.map((t) => +kOf(CONV.Ag, t).toFixed(4)) },
  ],
  vlines: [{ x: 50, text: '50 min' }],
  xDomain: [10, 130], yDomain: [0, 0.3], height: 250,
  desc: 'The first-order rate constant behind a fixed conversion falls as the assumed reaction time grows; without the time, k cannot be known.',
});
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'run', figure(fig1, 'Figure 1. A run simulated with the Reaction kinetics fitter\'s maths: the starting absorbance from the Beer–Lambert law and the paper\'s amounts, then a first-order fall that reaches 93.5 % conversion at 50 minutes, with a little added scatter. Not the paper\'s data.'));
  md = inject(md, 'kt', figure(fig2, 'Figure 2. The first-order rate constant that a stated conversion implies, for each possible reaction time: k = −ln(1 − X)/t.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
