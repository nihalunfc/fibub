// Figures for src/blog/discoveries/emergent-constraint-transient-climate-response-1-81-k-feedback-parameter.md,
// made with the maths of the Climate balance model (src/lib/sci/ebm.ts: the Myhre CO2 forcing and the linear
// feedback model C dDT/dt = F - lambda DT, integrated with RK4).
// Run: node scripts/blog-figures/emergent-constraint-transient-climate-response-1-81-k-feedback-parameter.mjs
import fs from 'node:fs';
import { co2Forcing, heatCap, runLinear, efold, YEAR } from '../../src/lib/sci/ebm.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/emergent-constraint-transient-climate-response-1-81-k-feedback-parameter.md', import.meta.url);

// --- Numbers from the paper's text (Boardman et al. 2026, ESD 17: 829-841, CC BY 4.0) ----------------------
const P = {
  tcr: 1.81, tcrLo: 1.28, tcrHi: 2.33,     // this study's TCR and very likely range (K)
  tcrAR6: [1.2, 2.4],                      // IPCC AR6 very likely TCR range (K)
  ecsAR6: [2.0, 5.0],                      // IPCC AR6 very likely ECS range (K)
  ecsSherwood: [2.3, 4.5],                 // Sherwood et al. effective sensitivity range
  aerosolERF: [-1.6, -0.6],                // present-day aerosol effective radiative forcing (W/m2)
  ssp585: 4.3,                             // late-century SSP5-8.5 central estimate (K)
};
const F2X = co2Forcing(560, 280);          // Myhre: 5.35 ln 2 = 3.7082 W/m2
const RAMP = 70;                           // 1 %/yr compound CO2 doubles in 70 years (1.01^70 = 2.007)
const SC = { years: 300, kind: 'ramp', Ffinal: F2X, rampYears: RAMP };

// Transient warming at the moment of doubling, for a feedback parameter and a mixed-layer depth.
const tcrOf = (lam, depth) => { const r = runLinear(lam, heatCap(depth), SC, SC.years); return r.T[RAMP]; };
// The feedback parameter that reproduces a given TCR at a given mixed-layer depth (bisection).
const lamFor = (tcr, depth) => { let lo = 0.002, hi = 20; for (let i = 0; i < 90; i++) { const m = (lo + hi) / 2; tcrOf(m, depth) > tcr ? (lo = m) : (hi = m); } return (lo + hi) / 2; };

const DEPTHS = [50, 75, 100, 150, 200, 250, 300, 350, 400];
const r3 = (v) => +v.toFixed(3);
const table = DEPTHS.map((d) => {
  const lam = lamFor(P.tcr, d), ecs = F2X / lam;
  return { depth: d, lambda: r3(lam), ecs: r3(ecs), ratio: r3(P.tcr / ecs), efoldYears: r3(efold(lam, heatCap(d))),
    lamLo: r3(lamFor(P.tcrLo, d)), ecsLo: r3(F2X / lamFor(P.tcrLo, d)), lamHi: r3(lamFor(P.tcrHi, d)), ecsHi: r3(F2X / lamFor(P.tcrHi, d)) };
});
// Depth at which the implied ECS reaches the two ends of the AR6 very likely range.
const depthForEcs = (ecs, tcr) => { let lo = 20, hi = 20000; for (let i = 0; i < 80; i++) { const m = Math.sqrt(lo * hi); F2X / lamFor(tcr, m) < ecs ? (lo = m) : (hi = m); } return Math.sqrt(lo * hi); };

const out = {
  F2X: r3(F2X),
  perWatt: r3(P.tcr / F2X),                                   // K per W/m2 at TCR efficiency
  lamPlusKappa: r3(F2X / P.tcr),                              // what TCR actually pins: lambda + kappa
  lamPlusKappaRange: [r3(F2X / P.tcrHi), r3(F2X / P.tcrLo)],
  ar6Range: [r3(F2X / P.tcrAR6[1]), r3(F2X / P.tcrAR6[0])],
  table,
  depthAtEcs2: r3(depthForEcs(P.ecsAR6[0], P.tcr)),
  depthAtEcs3: r3(depthForEcs(3, P.tcr)),
  depthAtEcs5: r3(depthForEcs(P.ecsAR6[1], P.tcr)),
  // With no feedback at all (lambda -> 0) the ramp heats the layer by F2X/2 x 70 yr / C: the deepest layer that can still warm by the TCR.
  depthLimit: r3((F2X / 2) * RAMP * YEAR / (heatCap(1) * P.tcr)),
  // What the aerosol forcing uncertainty is worth in warming at TCR efficiency.
  aerosolSpread: r3(((P.aerosolERF[1] - P.aerosolERF[0]) * P.tcr) / F2X),
  // A rough transient warming for a scenario that ends near 8.5 W/m2 (OUR ASSUMPTION for the scenario's forcing).
  ssp585: { assumedF: 8.5, warmingAtTcrEfficiency: r3((8.5 * P.tcr) / F2X), paper: P.ssp585 },
  // Equilibrium warming reached long after doubling, for the three illustrated cases.
  longRun: [75, 200, 400].map((d) => { const lam = lamFor(P.tcr, d); return { depth: d, lambda: r3(lam), at70: r3(tcrOf(lam, d)), at300: r3(runLinear(lam, heatCap(d), SC, SC.years).T[300]), ecs: r3(F2X / lam) }; }),
};
console.log(JSON.stringify(out, null, 1));

// --- Figure 1: three worlds with the same TCR ---------------------------------------------------------------
const cases = [75, 200, 400].map((d) => { const lam = lamFor(P.tcr, d); const r = runLinear(lam, heatCap(d), SC, SC.years); return { d, lam, r, ecs: F2X / lam }; });
const fig1 = chart({
  title: 'Same TCR at year 70, very different futures', xLabel: 'Year of a 1 %-per-year CO₂ rise', yLabel: 'Warming ΔT (K)',
  series: cases.map((c) => { const keep = c.r.t.map((t, i) => i).filter((i) => i <= 80 ? i % 2 === 0 : i % 5 === 0 || i === c.r.t.length - 1);
    return { name: `λ = ${c.lam.toFixed(2)}, ${c.d} m (ECS ${c.ecs.toFixed(1)} K)`, kind: 'line', x: keep.map((i) => c.r.t[i]), y: keep.map((i) => +c.r.T[i].toFixed(2)) }; }),
  vlines: [{ x: RAMP, text: 'CO₂ doubled', left: false }],
  hlines: [{ y: P.tcr, text: 'TCR 1.81 K' }],
  xDomain: [0, 300], yDomain: [0, 4],
  desc: 'Warming against time for three one-box climates that all reach 1.81 kelvin when carbon dioxide doubles at year 70 but settle at 1.9, 2.7 and 3.7 kelvin afterwards.',
  height: 300,
});

// --- Figure 2: the sensitivity a TCR of 1.81 K implies, against mixed-layer depth ---------------------------
const dgrid = Array.from({ length: 61 }, (_, i) => 40 * (500 / 40) ** (i / 60));
const fig2 = chart({
  title: 'What a TCR of 1.81 K says about sensitivity', xLabel: 'Effective mixed-layer depth (m)', yLabel: 'Implied ECS (K)',
  xFmt: (v) => String(Math.round(10 ** v)),
  series: [
    { name: 'TCR 2.33 K', kind: 'line', x: dgrid.map(Math.log10), y: dgrid.map((d) => +(F2X / lamFor(P.tcrHi, d)).toFixed(3)), dash: '4 4' },
    { name: 'TCR 1.81 K', kind: 'line', x: dgrid.map(Math.log10), y: dgrid.map((d) => +(F2X / lamFor(P.tcr, d)).toFixed(3)), colour: 'var(--ink)' },
    { name: 'TCR 1.28 K', kind: 'line', x: dgrid.map(Math.log10), y: dgrid.map((d) => +(F2X / lamFor(P.tcrLo, d)).toFixed(3)), dash: '2 3' },
  ],
  hlines: [{ y: P.ecsAR6[0], text: 'AR6 ECS 2.0 K' }, { y: P.ecsAR6[1], text: 'AR6 ECS 5.0 K' }],
  yDomain: [0, 7],
  desc: 'Equilibrium climate sensitivity implied by the paper transient climate response, against the effective mixed-layer depth of a one-box model, for the central value and both ends of the very likely range.',
  height: 290,
});

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'runs', figure(fig1, 'Figure 1. Three one-box climates run with the climate balance model\'s linear feedback equation. All three pass through 1.81 K at the moment of doubling, the paper\'s transient climate response, and then settle at 1.9, 2.7 and 3.7 K. The transient number alone does not choose between them.'));
  md = inject(md, 'ecs', figure(fig2, 'Figure 2. The equilibrium sensitivity a one-box model needs to reproduce the paper\'s transient climate response, against how much ocean the heat reaches. A shallow effective layer forces a low sensitivity; a deep one allows any of the IPCC range.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
