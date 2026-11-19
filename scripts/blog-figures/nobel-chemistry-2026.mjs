// Figures for the Nobel Prize in Chemistry 2026 series (src/blog/nobel/chemistry-2026-*.md), made with the maths of
// the fibub tools: Racemisation age (src/lib/sci/racemisation.ts), Reaction kinetics fitter (kinetics.ts: gas
// constant), Chiral amplification lab (chiralamp.ts), ODE solver (ode.ts) and stats.ts. Our own recomputations and
// simulations; the published values used are named beside them.
// Run: node scripts/blog-figures/nobel-chemistry-2026.mjs   (--dry prints the numbers only)
import fs from 'node:fs';
import { ratioAt, arrhenius } from '../../src/lib/sci/racemisation.ts';
import { R_GAS } from '../../src/lib/sci/kinetics.ts';
import { ml2, soaiRounds, soaiBatch } from '../../src/lib/sci/chiralamp.ts';
import { rk45 } from '../../src/lib/sci/ode.ts';
import { normInv } from '../../src/lib/sci/stats.ts';
import { chart, figure, inject } from './svg.mjs';

const dry = process.argv.includes('--dry');
const art = (slug) => new URL(`../../src/blog/nobel/${slug}.md`, import.meta.url);
const put = (slug, figs) => { if (dry) return; const f = art(slug); let md = fs.readFileSync(f, 'utf8'); for (const [n, h] of Object.entries(figs)) md = inject(md, n, h); fs.writeFileSync(f, md); };
const log = (...a) => console.log(...a);

// ---------- Part 1: mirror molecules and making just one ----------
// (a) Life keeps one hand only while it repairs itself: aspartic acid in tooth dentin racemises in living people.
// k ≈ 8.3 × 10⁻⁴ per year at 37 °C (Helfman and Bada 1975, rounded), moved to 10 °C with Ea ≈ 130 kJ/mol (assumed,
// typical for aspartic acid). Reversible first-order kinetics with K' = 1 (Racemisation age tool).
const k37 = 8.3e-4, k10 = arrhenius(k37, 37, 10, 130);
const yrs = Array.from({ length: 101 }, (_, i) => i * 1000);
const dl37 = yrs.map((t) => ratioAt(t, k37, 1, 0.01)), dl10 = yrs.map((t) => ratioAt(t, k10, 1, 0.01));
log(`D/L after 70 years at 37 °C: ${ratioAt(70, k37, 1, 0.01).toFixed(3)}; k at 10 °C ${k10.toExponential(2)} per year; half-way (D/L = 0.5) at 10 °C after ${(yrs[dl10.findIndex((v) => v > 0.333)] / 1000)} thousand years`);
const figRac = figure(chart({
  title: 'Aspartic acid losing its handedness after life stops', xLabel: 'Time (thousand years)', yLabel: 'D/L ratio',
  series: [{ name: 'Body temperature, 37 °C', x: yrs.map((t) => t / 1000), y: dl37.map((v) => +v.toFixed(4)), kind: 'line' }, { name: 'Cool burial, 10 °C', x: yrs.map((t) => t / 1000), y: dl10.map((v) => +v.toFixed(4)), kind: 'line', dash: '5 4' }],
  hlines: [{ y: 1, text: '1 = racemic (50:50)' }], yDomain: [0, 1.05],
  desc: 'At body temperature the D/L ratio climbs to 1, a 50:50 mixture, within a few thousand years; at 10 degrees it takes around a hundred thousand years.',
}), 'Racemisation age tool maths: reversible first-order kinetics, K′ = 1, starting D/L 0.01. Rate at 37 °C from tooth dentin (Helfman and Bada, 1975, rounded); 10 °C by the Arrhenius equation with an assumed 130 kJ/mol. Our own curves.');
// (b) How much selectivity an energy gap buys: ee = tanh(ΔΔG‡ / 2RT), from er = exp(ΔΔG‡/RT).
const dG = Array.from({ length: 81 }, (_, i) => i * 0.25);
const eeAt = (T) => dG.map((g) => +(100 * Math.tanh((g * 1000) / (2 * R_GAS * (T + 273.15)))).toFixed(3));
const g98 = (T) => (2 * R_GAS * (T + 273.15) * Math.atanh(0.98)) / 1000;
log(`ΔΔG‡ for 98 % ee: ${g98(25).toFixed(1)} kJ/mol at 25 °C, ${g98(-78).toFixed(1)} at −78 °C`);
const figEyr = figure(chart({
  title: 'Energy gap between the two paths and the ee it gives', xLabel: 'ΔΔG‡ (kJ/mol)', yLabel: 'Enantiomeric excess (%)',
  series: [{ name: '80 °C', x: dG, y: eeAt(80), kind: 'line', dash: '2 3' }, { name: '25 °C', x: dG, y: eeAt(25), kind: 'line' }, { name: '−78 °C (dry ice)', x: dG, y: eeAt(-78), kind: 'line', dash: '5 4' }],
  hlines: [{ y: 98, text: '98 % ee' }], yDomain: [0, 100],
  desc: 'Enantiomeric excess rises steeply with the energy gap and saturates near 100 percent; at minus 78 degrees about 7 kilojoules per mole is enough for 98 percent, at room temperature about 11.',
}), 'ee = (er − 1)/(er + 1) with er = exp(ΔΔG‡/RT), the Boltzmann/Eyring rate ratio, using the gas constant from the Reaction kinetics fitter. Our own calculation.');
put('chemistry-2026-mirror-molecules-catalysis', { racemisation: figRac, 'energy-gap': figEyr });

// ---------- Part 2: Kagan's non-linear effects ----------
const xs = Array.from({ length: 101 }, (_, i) => i / 100);
const figNle = figure(chart({
  title: 'Kagan\'s ML2 model: product ee against ligand ee', xLabel: 'Ligand ee (%)', yLabel: 'Product ee (%)',
  series: [
    { name: 'Positive: K = 100, g = 0', x: xs.map((x) => x * 100), y: xs.map((x) => +(100 * ml2(x, 100, 0).ee).toFixed(2)), kind: 'line' },
    { name: 'Linear: g = 1', x: [0, 100], y: [0, 100], kind: 'line', colour: 'var(--muted)', dash: '5 4' },
    { name: 'Negative: K = 100, g = 3', x: xs.map((x) => x * 100), y: xs.map((x) => +(100 * ml2(x, 100, 3).ee).toFixed(2)), kind: 'line' },
  ], yDomain: [0, 100],
  desc: 'The positive-effect curve rises steeply above the diagonal, giving about 80 percent product ee from a 20 percent pure ligand; the negative-effect curve sags well below it.',
}), 'Chiral amplification lab maths (Kagan\'s ML2 model, ee_max = 100 %). Our own curves for round parameter values.');
// Independent check: simulate the ligand exchange RR + SS ⇌ 2 RS to equilibrium with the ODE solver's RK45, then
// read the product ee from the shares (RR gives R, SS gives S, RS gives racemic at relative rate g). Compare with ML2.
const K = 100, g = 0;
const simEE = (e) => {
  // Start with the complexes formed at random from the ligand pool, then let exchange reach equilibrium (kf/kb = K).
  const pR = (1 + e) / 2, pS = 1 - pR;
  const sol = rk45((t, y) => { const [x, yy, z] = y; const f = 1 * K * x * yy - 1 * z * z; return [-f / 1, -f / 1, 2 * f]; }, 0, [pR * pR, pS * pS, 2 * pR * pS], 50, { rtol: 1e-9, atol: 1e-12 });
  const [x, yy, z] = sol.y[sol.y.length - 1];
  return (x - yy) / (x + yy + g * z);
};
const ePts = [0.05, 0.1, 0.2, 0.3, 0.5, 0.7, 0.9];
const sim = ePts.map(simEE), maxDiff = Math.max(...ePts.map((e, i) => Math.abs(sim[i] - ml2(e, K, g).ee)));
log(`ODE check of ML2: largest difference ${maxDiff.toExponential(1)}; at 20 % ligand ee product ${(100 * ml2(0.2, K, g).ee).toFixed(1)} %, rate ${(100 * ml2(0.2, K, g).rate).toFixed(0)} %`);
const figOde = figure(chart({
  title: 'Checking Kagan\'s formula with a full simulation', xLabel: 'Ligand ee (%)', yLabel: 'Product ee (%)',
  series: [
    { name: 'ML2 formula (K = 100, g = 0)', x: xs.map((x) => x * 100), y: xs.map((x) => +(100 * ml2(x, K, g).ee).toFixed(2)), kind: 'line' },
    { name: 'ODE simulation of ligand exchange', x: ePts.map((e) => e * 100), y: sim.map((v) => +(100 * v).toFixed(2)), kind: 'dots', size: 5 },
    { name: 'Relative catalyst speed', x: xs.map((x) => x * 100), y: xs.map((x) => +(100 * ml2(x, K, g).rate).toFixed(2)), kind: 'line', dash: '5 4' },
  ], yDomain: [0, 100],
  desc: 'The simulated points sit exactly on the formula curve. A dashed line shows the catalyst running slowly at low ligand ee, because most of it is locked in inactive mixed pairs.',
}), `Dots: the exchange RR + SS ⇌ 2 RS run to equilibrium with the ODE solver's adaptive Runge-Kutta (RK45), starting from complexes formed at random; they match the closed formula to within ${maxDiff.toExponential(0)}. Dashed: the price of the effect, the reaction rate relative to a pure catalyst.`);
put('chemistry-2026-kagan-non-linear-effects', { 'ml2-curves': figNle, 'ode-check': figOde });

// ---------- Part 3: Soai's self-copying reaction ----------
const rounds = [0, 1, 2, 3, 4];
const runs = [[4, '2 3'], [20, '5 4'], [50, null], [400, '8 3']].map(([Kk, dash]) => ({ name: `K = ${Kk}`, x: rounds, y: soaiRounds(5e-7, 4, 0.05, Kk).map((e) => +Math.log10(100 * e).toFixed(3)), kind: 'line', ...(dash ? { dash } : {}) }));
const r50 = soaiRounds(5e-7, 3, 0.05, 50);
log(`Soai model K = 50: ${r50.map((e) => (100 * e).toPrecision(3) + '%').join(' → ')}`);
const figSoai = figure(chart({
  title: 'Batch after batch: 0.00005 % ee grows to almost one hand', xLabel: 'Batch', yLabel: 'ee (%, log scale)', series: runs,
  xTicks: rounds, yTicks: [-4, -3, -2, -1, 0, 1, 2], yFmt: (v) => `${10 ** v >= 1 ? 10 ** v : (10 ** v).toPrecision(1)}`, hlines: [{ y: Math.log10(99.5), text: '99.5 %' }],
  desc: 'With K = 50 the ee goes from 0.00005 percent to about 1 percent, 89 percent and 99.5 percent in three batches; with K = 4 it grows far more slowly.',
}), 'Chiral amplification lab, autocatalysis mode: each batch seeded with 5 % of the previous product, mixed pairs idle. With K = 50 the model follows the three-batch climb Soai\'s group reported (0.00005 % to above 99.5 %). A teaching model, not a fit to their data.');
// Chance alone: the standard deviation of the excess of N randomly handed molecules is 1/√N (binomial); 95 % within 1.96/√N.
const Ns = Array.from({ length: 21 }, (_, i) => 2 + i);
const z95 = normInv(0.975);
const figChance = figure(chart({
  title: 'The excess that chance alone gives', xLabel: 'Number of molecules N (log scale)', yLabel: 'Chance excess (%, log scale)',
  series: [{ name: 'Typical (1 standard deviation)', x: Ns, y: Ns.map((n) => +Math.log10(100 / Math.sqrt(10 ** n)).toFixed(3)), kind: 'line' }, { name: '95 % of samples stay below', x: Ns, y: Ns.map((n) => +Math.log10((100 * z95) / Math.sqrt(10 ** n)).toFixed(3)), kind: 'line', dash: '5 4' }],
  xTicks: [2, 6, 10, 14, 18, 22], xFmt: (v) => `10^${v}`, yTicks: [-10, -8, -6, -4, -2, 0], yFmt: (v) => `10^${v}`,
  desc: 'The chance excess falls as one over the square root of N: about 1 percent for ten thousand molecules and about a hundred-millionth of a percent for a mole-sized sample.',
}), 'Binomial statistics (standard deviation of the excess = 1/√N; 95 % point from the normal quantile 1.96, stats maths behind the Normal distribution lab). Our own calculation.');
const b1 = soaiBatch(0.01, 0.05, 1, 50);
const figBatch = figure(chart({
  title: 'Inside one batch: the excess grows as the reaction runs', xLabel: 'Conversion of the starting material (%)', yLabel: 'ee of all product so far (%)',
  series: [{ name: 'Start 1 % ee, K = 50', x: b1.hist.map((p) => +(100 * p.conv).toFixed(2)), y: b1.hist.map((p) => +(100 * p.ee).toFixed(3)), kind: 'line' }],
  desc: 'The excess climbs during the batch, slowly at first and then quickly, ending near 90 percent.',
}), 'Chiral amplification lab model, one batch from a 1 % excess with a 5 % seed. The S-shaped rise is the signature of autocatalysis: the purer the catalyst gets, the faster it makes its own hand.');
log(`One batch from 1 %: ${(100 * b1.ee).toFixed(1)} %`);
put('chemistry-2026-soai-autocatalysis-homochirality', { 'soai-rounds': figSoai, 'one-batch': figBatch, 'chance-excess': figChance });
