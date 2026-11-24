// Figures for src/blog/discoveries/green-algae-cyanobacteria-lotka-volterra-competition-coexistence-mesocosm.md, made
// with the maths of the Lotka-Volterra simulator (src/lib/sci/lotkav.ts: competition model, RK4, equilibria, outcome).
// Run: node scripts/blog-figures/green-algae-cyanobacteria-lotka-volterra-competition-coexistence-mesocosm.mjs
import fs from 'node:fs';
import { compete, rk4, competeEquilibria, competeOutcome } from '../../src/lib/sci/lotkav.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/green-algae-cyanobacteria-lotka-volterra-competition-coexistence-mesocosm.md', import.meta.url);

// Inputs from the paper: Wang et al. (2025), FACETS 10: 1-15, doi:10.1139/facets-2024-0011 (CC BY 4.0).
// Species 1 = green algae, species 2 = cyanobacteria. Populations in millions of cells per litre.
// r1 = 0.071, r2 = 0.19 (time unit not stated; we read it as per day, OUR assumption).
// Carrying capacities 23.8 and 9.8 million cells L-1 (the paper does not say which is which; we test both readings).
// Competition coefficients 1.87 and 0.094 (the Results and Discussion give them opposite labels; we test both).
// Paper's equilibrium: green algae about 6.2, cyanobacteria about 9.2 million cells L-1.
const base = { r1: 0.071, r2: 0.19 };
const readings = [
  { id: 'A', text: 'Green K 23.8, cyanobacteria hit green hard (α12 1.87, α21 0.094)', K1: 23.8, K2: 9.8, a12: 1.87, a21: 0.094 },
  { id: 'B', text: 'Green K 23.8, labels swapped (α12 0.094, α21 1.87)', K1: 23.8, K2: 9.8, a12: 0.094, a21: 1.87 },
  { id: 'C', text: 'Green K 9.8, cyanobacteria hit green hard (α12 1.87, α21 0.094)', K1: 9.8, K2: 23.8, a12: 1.87, a21: 0.094 },
  { id: 'D', text: 'Green K 9.8, labels swapped (α12 0.094, α21 1.87)', K1: 9.8, K2: 23.8, a12: 0.094, a21: 1.87 },
];
const res = readings.map((R) => {
  const p = { ...base, K1: R.K1, K2: R.K2, a12: R.a12, a21: R.a21 };
  const eq = competeEquilibria(p), co = eq.find((e) => e.name === 'Coexistence');
  const s = rk4(compete(p), 1, 1, 400, 4000);
  return { id: R.id, text: R.text, outcome: competeOutcome(p), co: co ? { x: +co.x.toFixed(2), y: +co.y.toFixed(2), kind: co.kind, eig: co.eig.map((e) => +e.re.toFixed(4)) } : null, end: [+s.x[4000].toFixed(2), +s.y[4000].toFixed(2)], greenShare: co ? +(co.x / R.K1).toFixed(3) : null };
});
console.log(JSON.stringify(res, null, 1));

// Reading A over time.
const pA = { ...base, K1: 23.8, K2: 9.8, a12: 1.87, a21: 0.094 };
const sA = rk4(compete(pA), 1, 1, 400, 4000);
const idx = Array.from({ length: 201 }, (_, i) => i * 20);
const t = idx.map((i) => +sA.t[i].toFixed(1));
// Days to come within 5 % of the coexistence point.
const coA = competeEquilibria(pA).find((e) => e.name === 'Coexistence');
let within = NaN; for (let i = 0; i <= 4000; i++) { if (Math.abs(sA.x[i] - coA.x) / coA.x < 0.05 && Math.abs(sA.y[i] - coA.y) / coA.y < 0.05) { let ok = true; for (let j = i; j <= 4000; j++) if (Math.abs(sA.x[j] - coA.x) / coA.x >= 0.05 || Math.abs(sA.y[j] - coA.y) / coA.y >= 0.05) { ok = false; break; } if (ok) { within = sA.t[i]; break; } } }
// Peak of green algae before the cyanobacteria catch up.
let pk = 0, pkT = 0; for (let i = 0; i <= 4000; i++) if (sA.x[i] > pk) { pk = sA.x[i]; pkT = sA.t[i]; }
console.log('within 5 % at day', within.toFixed(1), 'green peak', pk.toFixed(2), 'at day', pkT.toFixed(1));
const fig1 = chart({
  title: 'Green algae and cyanobacteria in competition', xLabel: 'Days (our assumption: r per day)', yLabel: 'Million cells per litre',
  series: [
    { name: 'Green algae', kind: 'line', x: t, y: idx.map((i) => +sA.x[i].toFixed(3)) },
    { name: 'Cyanobacteria', kind: 'line', x: t, y: idx.map((i) => +sA.y[i].toFixed(3)) },
    { name: 'Paper: green 6.2', noLegend: true, kind: 'dots', x: [392], y: [6.2], size: 4, colour: 'var(--c-blog)' },
    { name: 'Paper: cyano 9.2', noLegend: true, kind: 'dots', x: [392], y: [9.2], size: 4, colour: 'var(--c-tools)' },
  ],
  xDomain: [0, 400], yDomain: [0, 14],
  desc: `Simulated green algae and cyanobacteria from one million cells each. Both settle at the coexistence point, green algae ${coA.x.toFixed(2)} and cyanobacteria ${coA.y.toFixed(2)} million cells per litre; the dots at the right are the paper's values 6.2 and 9.2.`, height: 270,
});

// Equilibrium against the effect of cyanobacteria on green algae (α12), other values as reading A.
const A12 = Array.from({ length: 61 }, (_, i) => +(i * 0.05).toFixed(2));
const eqAt = (a12) => { const p = { ...pA, a12 }; const co = competeEquilibria(p).find((e) => e.name === 'Coexistence'); return co ? [co.x, co.y] : competeOutcome(p) === 'two' ? [0, p.K2] : [NaN, NaN]; };
const limit = pA.K1 / pA.K2;
console.log('alpha12 limit K1/K2 =', limit.toFixed(3));
const fig2 = chart({
  title: 'How hard can cyanobacteria push before green algae lose?', xLabel: 'Effect of cyanobacteria on green algae, α₁₂', yLabel: 'Equilibrium, million cells L⁻¹',
  series: [
    { name: 'Green algae', kind: 'line', x: A12, y: A12.map((a) => +eqAt(a)[0].toFixed(3)) },
    { name: 'Cyanobacteria', kind: 'line', x: A12, y: A12.map((a) => +eqAt(a)[1].toFixed(3)) },
  ],
  xDomain: [0, 3], yDomain: [0, 25],
  vlines: [{ x: 1.87, text: 'paper 1.87', left: true }, { x: +limit.toFixed(3), text: `limit ${limit.toFixed(2)}` }],
  desc: `Equilibrium of each group as the effect of cyanobacteria on green algae rises from 0 to 3. Green algae vanish at ${limit.toFixed(2)}, the ratio of the two carrying capacities; the paper's 1.87 sits below that line.`, height: 270,
});

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'time', figure(fig1, 'Figure 1. The competition model run with the paper\'s growth rates, carrying capacities and competition coefficients (reading A), from one million cells of each. The two dots at the right are the equilibrium densities the paper reports. Simulated, not the mesocosm counts.'));
  md = inject(md, 'alpha', figure(fig2, 'Figure 2. The coexistence point as the effect of cyanobacteria on green algae (α₁₂) changes, with everything else as in reading A. Coexistence needs α₁₂ below the ratio of the carrying capacities.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
