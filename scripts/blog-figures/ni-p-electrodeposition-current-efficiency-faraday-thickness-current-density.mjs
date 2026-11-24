// Figures for src/blog/discoveries/ni-p-electrodeposition-current-efficiency-faraday-thickness-current-density.md,
// made with the maths of the Electroplating tool (src/lib/sci/faraday.ts: Faraday's laws, plating rate, thickness).
// Run: node scripts/blog-figures/ni-p-electrodeposition-current-efficiency-faraday-thickness-current-density.mjs
import fs from 'node:fs';
import { sub, rate, mass, thickness, timeFor, moles, gasVolume } from '../../src/lib/sci/faraday.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/ni-p-electrodeposition-current-efficiency-faraday-thickness-current-density.md', import.meta.url);

// Inputs from the paper: Reddah et al. (2026), Coatings 16(2): 205, doi:10.3390/coatings16020205 (CC BY).
const NI = sub('Ni');              // n = 2, M = 58.693 g/mol, rho = 8.908 g/cm3 (CRC)
const AREA = 6;                    // cm2, masked with Kapton tape
const MIN = 30;                    // minutes of plating
const H = MIN / 60;
const EFF = { S1: 0.55, S2: 0.15, S3: 0.05, S5: 0.01 }; // cathodic current efficiencies stated in the paper
const D_S1 = 3.6;                  // um, thickness of S1 by profilometry
const J_PRINTED = 0.1 / 1e4;       // the printed 0.100 A/m2, in A/cm2

// What current density is needed for S1's measured thickness at its stated efficiency? rate() is linear in j.
const jNeeded = (D_S1 / H) / rate(1, NI, EFF.S1);
const jRound = 0.01; // 1.00 A/dm2, the nearest round bath value

const effs = Array.from({ length: 121 }, (_, i) => i * 0.005);
const fig1 = chart({
  title: 'Nickel in 30 minutes at 1.07 A/dm²: thickness against current efficiency', xLabel: 'Cathodic current efficiency (%)', yLabel: 'Thickness after 30 min (µm)',
  series: [
    { name: '', noLegend: true, kind: 'line', x: effs.map((e) => 100 * e), y: effs.map((e) => +(rate(jNeeded, NI, e) * H).toFixed(4)) },
    { name: '', noLegend: true, kind: 'dots', x: Object.values(EFF).map((e) => 100 * e), y: Object.values(EFF).map((e) => +(rate(jNeeded, NI, e) * H).toFixed(3)), size: 4, colour: 'var(--c-tools)' },
  ],
  xDomain: [0, 60], yDomain: [0, 4],
  hlines: [{ y: D_S1, text: 'S1 measured 3.6 µm' }],
  vlines: [{ x: 1, text: '1 %', dy: 0 }, { x: 5, text: '5 %', dy: 14 }, { x: 15, text: '15 %' }, { x: 55, text: '55 %', left: true }],
  desc: `Faraday's law turns a current efficiency into a thickness: at the current density implied by sample S1, 55 per cent gives 3.6 micrometres in half an hour, 15 per cent gives about 1 micrometre and 1 per cent gives 65 nanometres.`,
  height: 290,
});

// Thickness against current density, log x (values plotted as log10 of A/m2).
const js = Array.from({ length: 121 }, (_, i) => -1 + i * 0.05); // log10(A/m2) from 0.1 to 1e5
const fig2 = chart({
  title: 'The printed current density cannot be right', xLabel: 'Current density (A/m², log scale)', yLabel: 'Thickness after 30 min (µm)',
  series: [{ name: '', noLegend: true, kind: 'line', x: js, y: js.map((v) => +(rate(10 ** v / 1e4, NI, EFF.S1) * H).toFixed(5)) }],
  xDomain: [-1, 4], yDomain: [0, 12],
  xTicks: [-1, 0, 1, 2, 3, 4], xFmt: (v) => (v < 0 ? '0.1' : v === 0 ? '1' : v === 1 ? '10' : v === 2 ? '100' : v === 3 ? '1,000' : '10,000'),
  hlines: [{ y: D_S1, text: 'S1 measured 3.6 µm' }],
  vlines: [{ x: Math.log10(0.1), text: 'printed 0.100', dy: 0 }, { x: Math.log10(jNeeded * 1e4), text: `implied ${(jNeeded * 1e4).toFixed(0)}`, left: true, dy: 14 }],
  desc: `At the printed current density of 0.100 amperes per square metre, 30 minutes of plating at 55 per cent efficiency would leave 3.4 nanometres. The measured 3.6 micrometres needs about 107 amperes per square metre.`,
  height: 280,
});

const m1 = mass(jNeeded * AREA, MIN * 60, NI, EFF.S1);
const out = {
  rate1Adm2: +rate(0.01, NI, 1).toFixed(3),
  jNeeded: { Acm2: +jNeeded.toFixed(5), Adm2: +(jNeeded * 100).toFixed(3), Am2: +(jNeeded * 1e4).toFixed(1), ASF: +(jNeeded * 929.0304).toFixed(2) },
  currentFor6cm2_mA: +(jNeeded * AREA * 1000).toFixed(1),
  massS1_mg: +(m1 * 1000).toFixed(2),
  thicknessCheck_um: +thickness(m1, NI.rho, AREA).toFixed(3),
  timeForS1_s: +timeFor(D_S1, jNeeded * AREA, AREA, NI, EFF.S1).toFixed(1),
  printedWould: { um: +(rate(J_PRINTED, NI, EFF.S1) * H).toExponential(3), nm: +(rate(J_PRINTED, NI, EFF.S1) * H * 1000).toFixed(2) },
  atRound1Adm2_um: +(rate(jRound, NI, EFF.S1) * H).toFixed(3),
  perEfficiency: Object.fromEntries(Object.entries(EFF).map(([k, e]) => [k, { pct: 100 * e, um: +(rate(jNeeded, NI, e) * H).toFixed(3), nm: +(rate(jNeeded, NI, e) * H * 1000).toFixed(0) }])),
  // Sensitivity: a Ni-P deposit with 22 at.% P is less dense than nickel. OUR assumption: 7.3 g/cm3, nickel's molar mass.
  nipS2_um: +(rate(jNeeded, { n: 2, M: NI.M, rho: 7.3 }, EFF.S2) * H).toFixed(3),
  // Where the rest of the charge goes: hydrogen, at the same current and area.
  h2_mL_S1: +(1000 * gasVolume(moles(jNeeded * AREA * MIN * 60, 2, 1 - EFF.S1), 313.15, 101.325)).toFixed(2),
  h2_mL_S5: +(1000 * gasVolume(moles(jNeeded * AREA * MIN * 60, 2, 1 - EFF.S5), 313.15, 101.325)).toFixed(2),
};
console.log(JSON.stringify(out, null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'efficiency', figure(fig1, 'Figure 1. Thickness after 30 minutes against cathodic current efficiency, worked out by Faraday\'s law at the current density implied by sample S1. The dots mark the four efficiencies the paper reports.'));
  md = inject(md, 'density', figure(fig2, 'Figure 2. Thickness after 30 minutes at 55 % efficiency against current density. The printed 0.100 A/m² and the value implied by the measured thickness are a thousandfold apart.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
