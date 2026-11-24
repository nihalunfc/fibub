// Figures for src/blog/discoveries/lean-hydrogen-engine-air-standard-otto-efficiency-ceiling.md, made with the maths
// of the Heat engine cycles tool (src/lib/sci/phcycles.ts: the air-standard Otto cycle).
// Run: node scripts/blog-figures/lean-hydrogen-engine-air-standard-otto-efficiency-ceiling.mjs
import fs from 'node:fs';
import { cycle, formula } from '../../src/lib/sci/phcycles.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/lean-hydrogen-engine-air-standard-otto-efficiency-ceiling.md', import.meta.url);

// Inputs from the paper: Lou, D., Liu, Y. and Zhang, Y. (2025), Energies 18(7): 1656, doi:10.3390/en18071656 (CC BY).
// Compression ratios 9, 11, 13; excess air ratio lambda 1 to 5; intake 313 K and 0.6 bar; peak indicated thermal
// efficiency 41.25 % at CR 13 and lambda 2.5; maximum IMEP 8.4 bar at lambda 1; volumetric efficiency 89.7 %.
const AIR = { R: 287, gamma: 1.4 }, T1 = 313, P1 = 60e3, CV = 287 / 0.4;
// OUR assumptions: hydrogen lower heating value 120 MJ/kg and a stoichiometric air-fuel ratio of 34.3 by mass,
// so the heat released per kilogram of trapped mixture is:
const qMix = (lam) => 120e6 / (1 + 34.3 * lam);
const run = (r, lam) => { const T2 = T1 * r ** (AIR.gamma - 1); return cycle('otto', { T1, P1, r, Tmax: T2 + qMix(lam) / CV }, AIR); };

const CRS = Array.from({ length: 81 }, (_, i) => 8 + i * 0.1);
const fig1 = chart({
  title: 'The Otto ceiling and what the engine reached', xLabel: 'Compression ratio', yLabel: 'Indicated thermal efficiency (%)',
  series: [
    { name: 'ideal, γ = 1.40', kind: 'line', x: CRS, y: CRS.map((r) => +(formula.otto(r, 1.4) * 100).toFixed(2)) },
    { name: 'ideal, γ = 1.35', kind: 'line', x: CRS, y: CRS.map((r) => +(formula.otto(r, 1.35) * 100).toFixed(2)) },
    { name: 'ideal, γ = 1.30', kind: 'line', x: CRS, y: CRS.map((r) => +(formula.otto(r, 1.3) * 100).toFixed(2)), colour: 'var(--muted)' },
    { name: 'measured peak (CR 13)', kind: 'dots', x: [13], y: [41.25], size: 5, colour: 'var(--ink)' },
  ],
  xDomain: [8, 16], yDomain: [35, 70], vlines: [{ x: 9, text: '9', left: true }, { x: 11, text: '11', left: true }, { x: 13, text: '13', left: true }],
  desc: 'Air-standard Otto efficiency against compression ratio for three values of the heat capacity ratio, with the paper\'s measured peak of 41.25 % at a compression ratio of 13 marked.', height: 280,
});

const LAMS = Array.from({ length: 81 }, (_, i) => 1 + i * 0.05);
const fig2 = chart({
  title: 'Air-standard peak temperature as the mixture is leaned out', xLabel: 'Excess air ratio λ', yLabel: 'Peak cycle temperature (K)',
  series: [
    { name: 'CR 13', kind: 'line', x: LAMS, y: LAMS.map((l) => Math.round(Math.max(...run(13, l).states.map((s) => s.T)))) },
    { name: 'CR 9', kind: 'line', x: LAMS, y: LAMS.map((l) => Math.round(Math.max(...run(9, l).states.map((s) => s.T)))) },
  ],
  xDomain: [1, 5], yDomain: [1500, 6000],
  hlines: [{ y: 2200, text: 'where thermal NO forms fast' }],
  vlines: [{ x: 1.5, text: 'NOx peak', left: true }, { x: 2.5, text: 'paper\'s optimum' }],
  desc: 'Peak temperature of the air-standard Otto cycle as the excess air ratio rises, for compression ratios 9 and 13, with the paper\'s NOx peak at 1.5 and its chosen optimum at 2.5 marked.', height: 280,
});

const mep = (r, lam) => run(r, lam).mep / 1e5; // bar
const SHRINK = 0.643 * 0.897; // measured efficiency over the ideal, times the measured volumetric efficiency
const fig3 = chart({
  title: 'Mean effective pressure against mixture strength (CR 13)', xLabel: 'Excess air ratio λ', yLabel: 'Mean effective pressure (bar)',
  series: [
    { name: 'ideal cycle', kind: 'line', x: LAMS, y: LAMS.map((l) => +mep(13, l).toFixed(2)) },
    { name: 'ideal × 0.58 (losses, breathing)', kind: 'line', x: LAMS, y: LAMS.map((l) => +(mep(13, l) * SHRINK).toFixed(2)), dash: '5 4' },
    { name: 'the paper\'s maximum IMEP', kind: 'dots', x: [1], y: [8.4], size: 5, colour: 'var(--ink)' },
  ],
  xDomain: [1, 5], yDomain: [0, 17],
  desc: 'Mean effective pressure of the air-standard Otto cycle at a compression ratio of 13 with a 0.6 bar intake, against the excess air ratio, and the same curve scaled by the measured efficiency and volumetric efficiency.', height: 280,
});

const row = (r, lam) => { const c = run(r, lam); return { r, lam, qMix: Math.round(qMix(lam) / 1000), Tmax: Math.round(Math.max(...c.states.map((s) => s.T))), peakBar: +(Math.max(...c.states.map((s) => s.P)) / 1e5).toFixed(1), eta: +(c.eta * 100).toFixed(2), mepBar: +(c.mep / 1e5).toFixed(2), wnet: Math.round(c.wnet / 1000) };
};
console.log(JSON.stringify({
  ideal: [9, 11, 13].map((r) => ({ r, g140: +(formula.otto(r, 1.4) * 100).toFixed(2), g135: +(formula.otto(r, 1.35) * 100).toFixed(2), g130: +(formula.otto(r, 1.3) * 100).toFixed(2) })),
  fractionOfCeiling: +(41.25 / (formula.otto(13, 1.4) * 100)).toFixed(3),
  rows: [[13, 1], [13, 1.5], [13, 2.5], [13, 3], [13, 5], [9, 1], [9, 2.5]].map(([r, l]) => row(r, l)),
  mepScaled: +(mep(13, 1) * SHRINK).toFixed(2), shrink: +SHRINK.toFixed(3),
  T2: { 9: Math.round(T1 * 9 ** 0.4), 11: Math.round(T1 * 11 ** 0.4), 13: Math.round(T1 * 13 ** 0.4) },
}, null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'ceiling', figure(fig1, 'Figure 1. The air-standard Otto efficiency is set by the compression ratio and the heat capacity ratio alone. The paper\'s best measured indicated efficiency, 41.25 % at a compression ratio of 13, is 64 % of the γ = 1.40 ceiling and still below the γ = 1.30 line. Worked out with the Heat engine cycles tool\'s maths.'));
  md = inject(md, 'peakT', figure(fig2, 'Figure 2. Peak temperature of the same ideal cycle as the mixture is leaned out, using hydrogen\'s heating value and stoichiometric air-fuel ratio (our assumption). Cold-air-standard temperatures are overestimates, but the fall between λ = 1.5 and λ = 2.5 is the reason the paper\'s NOx collapses over that range.'));
  md = inject(md, 'mep', figure(fig3, 'Figure 3. Mean effective pressure of the ideal cycle at a compression ratio of 13 and a 0.6 bar intake, and the same curve multiplied by the measured efficiency ratio (0.643) and volumetric efficiency (0.897). The paper\'s maximum IMEP of 8.4 bar at λ = 1 sits close to the scaled curve.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2, fig3].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
