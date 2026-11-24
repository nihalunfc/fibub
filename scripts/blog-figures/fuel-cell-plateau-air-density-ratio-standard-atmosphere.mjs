// Figures for src/blog/discoveries/fuel-cell-plateau-air-density-ratio-standard-atmosphere.md, made with the maths
// of the Standard atmosphere calculator (src/lib/sci/eng-atmos.ts: the 1976 standard, pressure and density altitude).
// Run: node scripts/blog-figures/fuel-cell-plateau-air-density-ratio-standard-atmosphere.mjs
import fs from 'node:fs';
import { atmosphere, pressureAltitude, densityAltitude, stdTP, R_AIR, RHO0 } from '../../src/lib/sci/eng-atmos.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/fuel-cell-plateau-air-density-ratio-standard-atmosphere.md', import.meta.url);

// Inputs from the paper: He, S. et al. (2026), Energies 19(21): 5299, doi:10.3390/en19215299 (CC BY 4.0).
// Wuhan (about sea level): 101.3 kPa, 17 °C, air density about 1.22 kg/m³. Kunming (plateau, site about 1800 m,
// labelled "2000 m"): 80.1 kPa, 15 °C, about 0.97 kg/m³, a site density ratio of about 0.80 and about 0.79 against
// the sea-level standard. Standard-atmosphere density ratios quoted: K = 0.822 at 2000 m and 0.669 at 4000 m, with
// 61.6 kPa at 4000 m. Idealised radiator air-side coefficient against sea level: 92.5, 85.4, 78.8 and 72.5 % at
// 1000, 2000, 3000 and 4000 m. Fan power for the same air-side duty: about 1.5× at 2000 m and 2.2× at 4000 m.
const SITES = [
  { name: 'Wuhan', P: 101300, tC: 17, rhoPaper: 1.22 },
  { name: 'Kunming', P: 80100, tC: 15, rhoPaper: 0.97 },
];
const PAPER_K = [[2000, 0.822], [4000, 0.669]];
const PAPER_RAD = [[1000, 92.5], [2000, 85.4], [3000, 78.8], [4000, 72.5]];
const PAPER_FAN = [[2000, 1.5], [4000, 2.2]];

const site = SITES.map((s) => {
  const rho = s.P / (R_AIR * (s.tC + 273.15));
  return { ...s, rho, pressureAlt: pressureAltitude(s.P), densityAlt: densityAltitude(rho), sigma: rho / RHO0 };
});
const isaAt = (z) => atmosphere(z);
const rows = Array.from({ length: 101 }, (_, i) => isaAt(i * 50)); // 0 to 5000 m

// Figure 1: the standard atmosphere's pressure and density ratios, with the paper's two sites placed on them.
const fig1 = chart({
  title: 'Standard-atmosphere ratios, and where the two test sites sit', xLabel: 'Altitude (m)', yLabel: 'Ratio to sea level',
  series: [
    { name: 'Pressure δ', kind: 'line', x: rows.map((r) => r.z), y: rows.map((r) => +r.delta.toFixed(4)) },
    { name: 'Density σ (standard day)', kind: 'line', x: rows.map((r) => r.z), y: rows.map((r) => +r.sigma.toFixed(4)) },
    { name: 'Site density ÷ 1.225', kind: 'dots', x: site.map((s) => s.pressureAlt), y: site.map((s) => +s.sigma.toFixed(4)), size: 4, colour: 'var(--ink)' },
  ],
  xDomain: [0, 5000], yDomain: [0.5, 1.02],
  vlines: [{ x: site[1].pressureAlt, text: `80.1 kPa = ${Math.round(site[1].pressureAlt)} m`, left: true }],
  desc: 'Pressure and density ratio against altitude in the 1976 standard atmosphere, from 0 to 5000 metres, with the two test sites plotted at their pressure altitudes. The plateau site is warmer than the standard, so its density sits below the standard curve.',
  height: 285,
});

// Figure 2: the paper's idealised radiator and fan numbers against the tool's density ratio raised to a power.
const zs = Array.from({ length: 81 }, (_, i) => i * 50);
const sig = zs.map((z) => isaAt(z).sigma);
const fig2 = chart({
  title: 'The paper\'s cooling numbers are the density ratio to a power', xLabel: 'Altitude (m)', yLabel: 'Relative to sea level',
  series: [
    { name: 'σ^0.8 (air-side coefficient)', kind: 'line', x: zs, y: sig.map((s) => +(100 * s ** 0.8).toFixed(2)) },
    { name: 'Paper, air-side %', kind: 'dots', x: PAPER_RAD.map((p) => p[0]), y: PAPER_RAD.map((p) => p[1]), size: 4, colour: 'var(--ink)' },
    { name: '100 σ⁻² (fan power)', kind: 'line', x: zs, y: sig.map((s) => +(100 / s ** 2).toFixed(2)), colour: 'var(--c-tools)' },
    { name: 'Paper, fan power', kind: 'dots', x: PAPER_FAN.map((p) => p[0]), y: PAPER_FAN.map((p) => 100 * p[1]), size: 4, colour: 'var(--muted)' },
  ],
  xDomain: [0, 4000], yDomain: [60, 240],
  desc: 'The paper\'s four idealised radiator air-side percentages fall on the standard density ratio to the power 0.8, and its two fan-power multipliers fall on the density ratio to the power minus two.',
  height: 300,
});

const out = {
  rho0: +RHO0.toFixed(5),
  sites: site.map((s) => ({ name: s.name, rho: +s.rho.toFixed(4), rhoPaper: s.rhoPaper, pressureAlt: +s.pressureAlt.toFixed(1), densityAlt: +s.densityAlt.toFixed(1), sigma: +s.sigma.toFixed(4) })),
  siteRatio: +(site[1].rho / site[0].rho).toFixed(4),
  siteRatio25: +(site[1].rho / (101300 / (R_AIR * 298.15))).toFixed(4),
  isa: [0, 1000, 2000, 3000, 4000].map((z) => { const p = isaAt(z); return { z, P: +(p.P / 1000).toFixed(3), tC: +(p.T - 273.15).toFixed(2), rho: +p.rho.toFixed(4), sigma: +p.sigma.toFixed(4) }; }),
  paperK: PAPER_K.map(([z, k]) => [z, k, +isaAt(z).sigma.toFixed(4)]),
  isaAtSite: { H: +site[1].pressureAlt.toFixed(1), tC: +(stdTP(site[1].pressureAlt).T - 273.15).toFixed(2), rho: +(stdTP(site[1].pressureAlt).P / (R_AIR * stdTP(site[1].pressureAlt).T)).toFixed(4) },
  radiator: PAPER_RAD.map(([z, v]) => [z, v, +(100 * isaAt(z).sigma ** 0.8).toFixed(2)]),
  fan: PAPER_FAN.map(([z, v]) => [z, v, +(1 / isaAt(z).sigma ** 2).toFixed(3)]),
  ratio4000: { paper: 3.23, tool: +(198.9 / (isaAt(4000).P / 1000)).toFixed(3), P4000: +(isaAt(4000).P / 1000).toFixed(2) },
  massFlow: { Lmin: 5600, at15C: +((5600 / 60000) * RHO0).toFixed(4), at0C: +((5600 / 60000) * (101325 / (R_AIR * 273.15))).toFixed(4), atSite: +((5600 / 60000) * site[1].rho).toFixed(4) },
};
console.log(JSON.stringify(out, null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'ratios', figure(fig1, 'Figure 1. Pressure and density ratio against altitude in the 1976 standard atmosphere, drawn with the Standard atmosphere calculator\'s own maths, with the paper\'s two test sites placed at the pressure altitude their measured ambient pressure implies.'));
  md = inject(md, 'cooling', figure(fig2, 'Figure 2. The paper\'s idealised cooling numbers (black and grey dots) against two simple functions of the standard density ratio from the tool: σ to the power 0.8 for the air-side heat-transfer coefficient and σ to the power −2 for fan power.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
