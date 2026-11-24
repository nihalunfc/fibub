// Figures and numbers for src/blog/discoveries/fluorobenzotriazolone-nitration-adiabatic-temperature-rise-mtsr-recheck.md,
// made with the maths of the Adiabatic temperature rise tool (src/lib/sci/eng-adiabatic.ts: readSpecies, adiabatic,
// quickRise, energyRelease). Run: node scripts/blog-figures/fluorobenzotriazolone-nitration-adiabatic-temperature-rise-mtsr-recheck.mjs
import fs from 'node:fs';
import { readSpecies, adiabatic, quickRise, energyRelease } from '../../src/lib/sci/eng-adiabatic.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/fluorobenzotriazolone-nitration-adiabatic-temperature-rise-mtsr-recheck.md', import.meta.url);

// Stated in the paper's text and tables (facts): charged masses (g), specific heat (kJ/kg/K), heat released (kJ),
// process temperature Tp (deg C), and the paper's own dT_ad and MTSR as printed. Quoted for comparison only.
const STAGES = [
  { name: 'Nitration', m: 677.10 + 173.90 + 40.33, cp: 1.25, Q: 91.20, Tp: 27.5, paperDT: '81.86 (text, table); 86.70 (conclusions)', paperMTSR: 109.36, td24: 95.7, mtt: 320 },
  { name: 'Quenching', m: 240.00 + 760.0, cp: 1.31, Q: 258.25, Tp: 30, paperDT: '191.74 (text); 197.14 (table)', paperMTSR: 227.14, td24: 37.9, mtt: 100 },
  { name: 'Extraction', m: 1000.0 + 400.0, cp: 1.60, Q: 9.94, Tp: 55, paperDT: '4.44', paperMTSR: 59.44, td24: 165, mtt: 100 },
  { name: 'Alkaline washing', m: 261.80 + 60.0, cp: 1.99, Q: 0.78, Tp: 55, paperDT: '1.22', paperMTSR: 56.22, td24: 250, mtt: 100 },
];

// Our modelling assumption: each batch is one lumped "species" of molar mass = batch mass (so 1 mol = the whole charge),
// reacting 1:1 to a product with the same heat capacity and dHf lowered by Q. The tool's balance is then Q / (m cp).
const species = (s) => readSpecies(`batch, -1, 1, 0, ${s.m}, ${+(s.m * s.cp).toFixed(4)}\nreleased, 1, 0, ${-s.Q}, ${s.m}, ${+(s.m * s.cp).toFixed(4)}`).species;
const rows = STAGES.map((s) => {
  const sp = species(s), Tin = s.Tp + 273.15, a = adiabatic(sp, Tin, 1);
  return { ...s, dT: a.T - Tin, quick: quickRise(sp, Tin, 1), mtsr: a.T - 273.15, rel: energyRelease(sp, Tin, 1) };
});

const conv = Array.from({ length: 21 }, (_, i) => i / 20);
const fig1 = chart({
  title: 'Adiabatic outlet against conversion',
  xLabel: 'Fraction of the heat released', yLabel: 'Adiabatic outlet temperature (°C)',
  desc: 'Outlet temperature of each of the four steps if cooling failed, as the heat is released from 0 to 100 percent, from the adiabatic temperature rise tool. Quenching climbs far higher than the others.',
  series: rows.map((r, i) => ({ name: r.name, x: conv, y: conv.map((c) => adiabatic(species(r), r.Tp + 273.15, c).T - 273.15), kind: 'line', colour: ['var(--c-blog)', 'var(--c-tools)', 'var(--ink)', 'var(--muted)'][i], dash: i === 3 ? '3 3' : undefined })),
  hlines: [{ y: 100, text: '100 °C' }], xDomain: [0, 1], yDomain: [0, 250], xFmt: (v) => `${Math.round(v * 100)} %`,
});

const idx = [1, 2, 3, 4];
const fig2 = chart({
  title: 'Cooling-failure temperature against the safe limit',
  xLabel: 'Step (1 nitration, 2 quenching, 3 extraction, 4 alkaline washing)', yLabel: 'Temperature (°C)',
  desc: 'For each step: the process temperature, the temperature reached after a cooling failure (process temperature plus the adiabatic rise, recomputed), and the temperature at which the paper says a runaway takes 24 hours (TD24). In nitration and quenching the cooling-failure temperature is above TD24.',
  series: [
    { name: 'process', x: idx, y: rows.map((r) => r.Tp), kind: 'dots', size: 5, colour: 'var(--muted)' },
    { name: 'after cooling failure', x: idx, y: rows.map((r) => r.mtsr), kind: 'dots', size: 5, colour: 'var(--c-blog)' },
    { name: 'TD24 (paper)', x: idx, y: rows.map((r) => r.td24), kind: 'dots', size: 5, colour: 'var(--c-tools)' },
  ],
  xDomain: [0.5, 4.5], yDomain: [0, 275], xTicks: idx, xFmt: (v) => String(v),
});

console.log(JSON.stringify(rows.map((r) => ({ name: r.name, mass_g: +r.m.toFixed(2), dT: +r.dT.toFixed(3), quick: +r.quick.toFixed(3), mtsr: +r.mtsr.toFixed(2), paperMTSR: r.paperMTSR, td24: r.td24, perKg: +r.rel.perKgFeed.toFixed(1), Q: r.rel.Q })), null, 1));
console.log('offsets', { quench_text_vs_calc: +(191.74 - rows[1].dT).toFixed(2), nit_conclusion_vs_calc: +(86.70 - rows[0].dT).toFixed(2), implied_Q_for_191_74: +(191.74 * 1.31).toFixed(2), implied_Q_for_86_70: +(86.70 * 0.89133 * 1.25).toFixed(2), implied_cp_for_86_70: +(91.2 / (0.89133 * 86.70)).toFixed(3) });

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'rise', figure(fig1, 'Figure 1. The outlet temperature of each step if the cooling stopped, against how much of its heat has been released, from the adiabatic temperature rise tool with each batch lumped into one species (our assumption). The quenching step reaches about 227 °C, far above the others.'));
  md = inject(md, 'ladder', figure(fig2, 'Figure 2. Process temperature, recomputed cooling-failure temperature and the paper\'s 24-hour runaway temperature (TD24) for the four steps. Steps 1 and 2 would pass above TD24 after a cooling failure; steps 3 and 4 would not.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
