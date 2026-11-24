// Figures for src/blog/discoveries/drosophila-larval-muscle-calcium-resting-membrane-potential-ghk.md, made with the maths
// of the Membrane potential calculator (src/lib/sci/ghk.ts: Nernst and the Goldman-Hodgkin-Katz voltage equation).
// Run: node scripts/blog-figures/drosophila-larval-muscle-calcium-resting-membrane-potential-ghk.mjs
import fs from 'node:fs';
import { ghkVoltage, nernst, rtf } from '../../src/lib/sci/ghk.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/drosophila-larval-muscle-calcium-resting-membrane-potential-ghk.md', import.meta.url);

// From the paper: Elliott and Cooper (2024), Biology 13(9): 750, doi:10.3390/biology13090750 (CC BY).
// HL3 saline: NaCl 70, KCl 5, MgCl2 20, NaHCO3 10, CaCl2 1 mM, so Na+ 80, K+ 5, Cl- 70 + 5 + 40 + 2 = 117 mM outside.
// Choline chloride saline swaps the 70 NaCl for choline chloride (Na+ 10 outside). Cited E_K about -90 mV and E_Cl about
// -40 mV for this muscle. Raising Ca2+ from 0.5 to 3 mM hyperpolarised by 7.5 mV (HL3) and 7.4 mV (choline saline).
// OUR ASSUMPTIONS: 21 °C; inside K+ and Cl- set so E_K = -90 and E_Cl = -40 mV; inside Na+ 10 mM; P_Cl/P_K = 0.1;
// a resting potential of -60 mV in HL3 at low Ca (sensitivity at -65 and -70 mV); choline does not pass the leak.
const T = 21, KI = 5 * Math.exp(90 / rtf(T)), CLI = 117 * Math.exp(-40 / rtf(T)), NAI = 10, PCL = 0.1, SHIFT = 7.5;
const ions = (pna, nao = 80, pk = 1) => [
  { name: 'K', z: 1, out: 5, in: KI, p: pk }, { name: 'Na', z: 1, out: nao, in: NAI, p: pna }, { name: 'Cl', z: -1, out: 117, in: CLI, p: PCL },
];
const V = (pna, nao, pk) => ghkVoltage(ions(pna, nao, pk), T);
// PNa/PK that gives a target voltage (GHK V rises with PNa), by bisection on a log scale.
const pnaFor = (target, nao = 80, pk = 1) => { let lo = 1e-5, hi = 10; for (let i = 0; i < 100; i++) { const m = Math.sqrt(lo * hi); V(m, nao, pk) > target ? (hi = m) : (lo = m); } return Math.sqrt(lo * hi); };

const cases = [-60, -65, -70].map((v0) => {
  const p0 = pnaFor(v0), p1 = pnaFor(v0 - SHIFT), keep = p1 / p0;
  const ch0 = V(p0, 10), ch1 = V(p1, 10);
  const ork = [1, 2, 5, 10].map((m) => ({ m, rest: +V(p0, 80, m).toFixed(1), shift: +(V(p1, 80, m) - V(p0, 80, m)).toFixed(2) }));
  return { v0, pna: +p0.toFixed(4), pnaBlocked: +p1.toFixed(4), cut: +(100 * (1 - keep)).toFixed(1), cholRest: +ch0.toFixed(1), cholShift: +(ch1 - ch0).toFixed(2), ork };
});
const E = { K: +nernst(1, 5, KI, T).toFixed(1), Na: +nernst(1, 80, NAI, T).toFixed(1), NaChol: +nernst(1, 10, NAI, T).toFixed(1), Cl: +nernst(-1, 117, CLI, T).toFixed(1), Ki: +KI.toFixed(1), Cli: +CLI.toFixed(2) };
// Check it yourself: rounded inputs as typed into the tool.
const typed = (pna, nao, pcl = 0.1) => +ghkVoltage([{ name: 'K', z: 1, out: 5, in: 174.2, p: 1 }, { name: 'Na', z: 1, out: nao, in: 10, p: pna }, { name: 'Cl', z: -1, out: 117, in: 24.15, p: pcl }], 21).toFixed(1);
const c0 = cases[0], pB = +c0.pnaBlocked.toFixed(3), pA = +c0.pna.toFixed(3);
const cy = { base: typed(pA, 80), blocked: typed(pB, 80), cholBase: typed(pA, 10), cholBlocked: typed(pB, 10), ork: typed(+(pA / 5).toFixed(4), 80, 0.02), orkBlocked: typed(+(pB / 5).toFixed(4), 80, 0.02), pA, pB, pA5: +(pA / 5).toFixed(4), pB5: +(pB / 5).toFixed(4) };

const P = Array.from({ length: 121 }, (_, i) => 10 ** (-3 + i * 0.025)); // PNa/PK from 0.001 to 1
const fig1 = chart({
  title: 'Resting potential against the sodium leak (GHK)', xLabel: 'PNa / PK (log scale)', yLabel: 'Membrane potential (mV)',
  series: [
    { name: 'Normal saline (Na⁺ 80 mM)', kind: 'line', x: P.map((p) => +Math.log10(p).toFixed(3)), y: P.map((p) => +V(p, 80).toFixed(2)) },
    { name: 'Choline saline (Na⁺ 10 mM)', kind: 'line', x: P.map((p) => +Math.log10(p).toFixed(3)), y: P.map((p) => +V(p, 10).toFixed(2)) },
    { name: 'Leak before and after a block', kind: 'dots', x: [c0.pna, c0.pnaBlocked, c0.pna, c0.pnaBlocked].map((p) => +Math.log10(p).toFixed(3)), y: [V(c0.pna, 80), V(c0.pnaBlocked, 80), V(c0.pna, 10), V(c0.pnaBlocked, 10)].map((v) => +v.toFixed(2)), size: 4, colour: 'var(--ink)' },
  ],
  xDomain: [-3, 0], yDomain: [-95, -20], xTicks: [-3, -2, -1, 0], xFmt: (t) => String(+(10 ** t).toPrecision(1)),
  hlines: [{ y: E.K, text: `E_K ${E.K} mV` }],
  desc: `GHK resting potential of a larval muscle model as the sodium leak changes. Cutting PNa/PK from ${c0.pna} to ${c0.pnaBlocked} moves normal saline from ${c0.v0} to ${c0.v0 - SHIFT} mV, but moves choline saline only ${c0.cholShift} mV.`, height: 290,
});
const M = Array.from({ length: 46 }, (_, i) => 1 + i * 0.2);
const fig2 = chart({
  title: 'Same leak block, more potassium channels', xLabel: 'K⁺ permeability, times normal (as with extra ORK1 channels)', yLabel: 'Hyperpolarisation (mV)',
  series: cases.map((c) => ({ name: `Start at ${c.v0} mV`, kind: 'line', x: M, y: M.map((m) => +(V(c.pna, 80, m) - V(c.pnaBlocked, 80, m)).toFixed(3)) })),
  xDomain: [1, 10], yDomain: [0, 8],
  desc: `Size of the hyperpolarisation from the same fractional cut in the sodium leak as the potassium permeability rises. At five times the normal K+ permeability it falls from 7.5 to ${cases.map((c) => c.ork[2].shift * -1).join(', ')} mV for the three starting potentials.`, height: 270,
});

console.log(JSON.stringify({ E, cases, cy }, null, 1));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'leak', figure(fig1, 'Figure 1. Resting potential from the Membrane potential calculator\'s GHK maths for a larval muscle model (our assumed inside concentrations and chloride permeability) as the sodium leak changes, in normal and choline saline. Dots: the leak before and after the cut that gives a 7.5 mV hyperpolarisation in normal saline. A model, not the paper\'s recordings.'));
  md = inject(md, 'ork', figure(fig2, 'Figure 2. The hyperpolarisation from that same fractional cut in the sodium leak, as the potassium permeability is raised (as extra ORK1 potassium channels would). Each line starts from a different assumed resting potential.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
