// Figures for src/blog/discoveries/cohesive-soil-bearing-capacity-high-water-table-undrained.md, made with the maths
// of the Bearing capacity calculator (src/lib/sci/bearing.ts: Meyerhof factors, shape and depth factors, water table).
// Run: node scripts/blog-figures/cohesive-soil-bearing-capacity-high-water-table-undrained.mjs
import fs from 'node:fs';
import { bearing, meyerhofN } from '../../src/lib/sci/bearing.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/cohesive-soil-bearing-capacity-high-water-table-undrained.md', import.meta.url);

// Inputs from the paper: Izhar et al. (2025), Frontiers in Earth Science 13: 1522488, doi:10.3389/feart.2025.1522488 (CC BY 4.0).
// Five sites on Warsak Road, Peshawar. Cohesion (kPa) and friction angle (deg) as printed in the text, the paper's
// Meyerhof and Vesic ultimate bearing capacities (kPa) and its SPT-based allowable pressures (kPa).
const SITE = [
  { id: 'S1', c: 18.22, phi: 1.05, rho: 1.76, qMey: 93.54, qVes: 98.38, spt: 57.45 },
  { id: 'S2', c: 15.23, phi: 1.10, rho: 1.73, qMey: 78.12, qVes: 82.62, spt: 47.88 },
  { id: 'S3', c: 13.30, phi: 1.04, rho: 1.74, qMey: 68.36, qVes: 71.82, spt: 38.30 },
  { id: 'S4', c: 9.94, phi: 1.10, rho: 1.74, qMey: 50.88, qVes: 53.67, spt: 19.16 },
  { id: 'S5', c: 20.20, phi: 1.24, rho: 1.80, qMey: 103.82, qVes: 109.08, spt: 57.60 },
];
// OUR assumptions for the "real footing" case: a 1.5 m square pad 2 m down (the paper's sampling depth), the water
// table 1 m below ground, a saturated unit weight of 20 kN/m3 and a factor of safety of 3.
const B = 1.5, DF = 2, DW = 1, GSAT = 20, FS = 3;
const gam = (s) => +(s.rho * 9.81).toFixed(2);

const rows = SITE.map((s) => {
  const g = gam(s);
  const surf0 = bearing({ method: 'meyerhof', shape: 'strip', B: 1, Df: 0, c: s.c, phi: 0, gamma: g, FS });
  const surfPhi = bearing({ method: 'meyerhof', shape: 'strip', B: 1, Df: 0, c: s.c, phi: s.phi, gamma: g, FS });
  const pad = bearing({ method: 'meyerhof', shape: 'square', B, Df: DF, c: s.c, phi: 0, gamma: g, gammaSat: GSAT, Dw: DW, FS });
  const padDry = bearing({ method: 'meyerhof', shape: 'square', B, Df: DF, c: s.c, phi: 0, gamma: g, FS });
  const padWet0 = bearing({ method: 'meyerhof', shape: 'square', B, Df: DF, c: s.c, phi: 0, gamma: g, gammaSat: GSAT, Dw: 0, FS });
  return { ...s, g, surf0: surf0.qu, surfPhi: surfPhi.qu, pad, padDry: padDry.qu, padWet0: padWet0.qu, err: (100 * (surf0.qu - s.qMey)) / s.qMey };
});

const x = rows.map((_, i) => i + 1);
const fig1 = chart({
  title: 'Ultimate bearing capacity at five Peshawar sites', xLabel: 'Site (S1 to S5)', yLabel: 'qu (kPa)',
  series: [
    { name: 'Paper, Meyerhof', kind: 'dots', x, y: rows.map((r) => r.qMey), size: 5.5 },
    { name: 'Tool, φ = 0', kind: 'dots', x, y: rows.map((r) => +r.surf0.toFixed(2)), size: 2.5, colour: 'var(--ink)' },
    { name: 'Paper, Vesic', kind: 'dots', x, y: rows.map((r) => r.qVes), size: 5.5, colour: 'var(--c-tools)' },
    { name: 'Tool, measured φ', kind: 'dots', x, y: rows.map((r) => +r.surfPhi.toFixed(2)), size: 2.5, colour: 'var(--muted)' },
  ],
  xDomain: [0.6, 5.4], yDomain: [40, 120], xTicks: x, xFmt: (v) => 'S' + v,
  desc: 'The paper’s Meyerhof and Vesic ultimate bearing capacities at its five sites, each matched by the Bearing capacity calculator: the Meyerhof column by a surface strip footing with the friction angle set to zero, the Vesic column by the same footing with the measured friction angle of about one degree.', height: 250,
});

const dfs = Array.from({ length: 61 }, (_, i) => i * 0.05);
const line = (s, dw) => dfs.map((Df) => +bearing({ method: 'meyerhof', shape: 'square', B, Df, c: s.c, phi: 0, gamma: gam(s), gammaSat: GSAT, Dw: dw, FS }).qu.toFixed(2));
const fig2 = chart({
  title: 'A 1.5 m square pad: qu against founding depth', xLabel: 'Depth to the footing base Df (m)', yLabel: 'qu (kPa)',
  series: [
    { name: 'S1, water 1 m', kind: 'line', x: dfs, y: line(SITE[0], DW) },
    { name: 'S1, water 0 m', kind: 'line', x: dfs, y: line(SITE[0], 0), dash: '5 4', colour: 'var(--c-blog)' },
    { name: 'S4, water 1 m', kind: 'line', x: dfs, y: line(SITE[3], DW), colour: 'var(--c-tools)' },
    { name: 'S4, water 0 m', kind: 'line', x: dfs, y: line(SITE[3], 0), dash: '5 4', colour: 'var(--c-tools)' },
  ],
  xDomain: [0, 3], yDomain: [40, 220],
  hlines: [{ y: SITE[0].qMey, text: 'paper S1, 93.5' }, { y: SITE[3].qMey, text: 'paper S4, 50.9' }],
  vlines: [{ x: DF, text: '2 m' }],
  desc: 'Ultimate bearing capacity of a 1.5 m square pad on the S1 and S4 soils against founding depth, with the water table 1 m below ground and at the ground surface. The paper’s own values sit at the surface end of the curves.', height: 260,
});

console.log(JSON.stringify(rows.map((r) => ({
  id: r.id, c: r.c, g: r.g, paper: r.qMey, ratio: +(r.qMey / r.c).toFixed(4), vesRatio: +(r.qVes / r.c).toFixed(4),
  tool0: +r.surf0.toFixed(2), err: +r.err.toFixed(2), toolPhi: +r.surfPhi.toFixed(2),
  padQu: +r.pad.qu.toFixed(1), padTerms: r.pad.terms.map((t) => +t.toFixed(1)), padQa: +r.pad.qa.toFixed(1), padQaNet: +r.pad.qaNet.toFixed(1),
  padLoad: +r.pad.Q.toFixed(0), padDry: +r.padDry.toFixed(1), padWet0: +r.padWet0.toFixed(1), spt: r.spt,
})), null, 0));
console.log('Nc, Nq at phi = 0:', JSON.stringify(meyerhofN(0)), 'Nc at 1.05 deg:', meyerhofN(1.05).Nc.toFixed(3));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'sites', figure(fig1, "Figure 1. The paper's two ultimate bearing capacity columns at its five sites (large dots), each reproduced by the Bearing capacity calculator's maths for a strip footing at the ground surface (small dots): the Meyerhof column with the friction angle set to zero, the Vesic column with the measured friction angle of about 1°."));
  md = inject(md, 'depth', figure(fig2, 'Figure 2. Ultimate bearing capacity of a 1.5 m square pad (our assumption) on the S1 and S4 soils, against the depth of its base, with the water table 1 m down and at the ground surface. Dashed grey lines mark the values the paper reports.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
