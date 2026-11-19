// Figures for the Nobel Prize in Physiology or Medicine 2026 series (src/blog/nobel/medicine-2026-*.md), made with the
// maths of the fibub tools: Action potential (src/lib/sci/hhsim.ts), Membrane potential (ghk.ts), EM spectrum
// (em-spectrum.ts), Beer–Lambert calculator (beer.ts) and the fitting engine (fit.ts). Our own simulations and
// recomputations; published values used are named beside them.
// Run: node scripts/blog-figures/nobel-medicine-2026.mjs   (--dry prints the numbers only)
import fs from 'node:fs';
import { simulate, threshold, DEFAULTS, deriv, steady, phi } from '../../src/lib/sci/hhsim.ts';
import { nernst, ghkVoltage } from '../../src/lib/sci/ghk.ts';
import { photon } from '../../src/lib/sci/em-spectrum.ts';
import { tFromAbs } from '../../src/lib/sci/beer.ts';
import { levenbergMarquardt } from '../../src/lib/sci/fit.ts';
import { chart, figure, inject } from './svg.mjs';

const dry = process.argv.includes('--dry');
const art = (slug) => new URL(`../../src/blog/nobel/${slug}.md`, import.meta.url);
const put = (slug, figs) => { if (dry) return; const f = art(slug); let md = fs.readFileSync(f, 'utf8'); for (const [n, h] of Object.entries(figs)) md = inject(md, n, h); fs.writeFileSync(f, md); };
const log = (...a) => console.log(...a);
let seed = 7; const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
const gauss = () => Math.sqrt(-2 * Math.log(rnd() + 1e-12)) * Math.cos(2 * Math.PI * rnd());

// ---------- Part 1: nerve signals and an alga that sees ----------
// (a) All or nothing: 1 ms pulses just below and above threshold (Action potential tool's Hodgkin–Huxley engine).
const thr1 = threshold(1);
const runs = [0.9, 1.1, 2].map((f) => ({ f, r: simulate({ kind: 'step', amp: thr1 * f, start: 2, dur: 1 }, 25, DEFAULTS, 0.01, 10) }));
log(`HH threshold for a 1 ms pulse: ${thr1.toFixed(2)} µA/cm²; peaks ${runs.map((x) => x.r.peak.toFixed(0)).join(', ')} mV`);
const figAP = figure(chart({
  title: 'All or nothing: three pokes of 1 ms', xLabel: 'Time (ms)', yLabel: 'Membrane voltage (mV)',
  series: runs.map(({ f, r }, i) => ({ name: `${(thr1 * f).toFixed(1)} µA/cm²${f < 1 ? ' (just below)' : f < 1.5 ? ' (just above)' : ' (double)'}`, x: r.t.map((t) => +t.toFixed(2)), y: r.V.map((v) => +v.toFixed(1)), kind: 'line', ...(i === 0 ? { dash: '5 4' } : i === 2 ? { dash: '2 3' } : {}) })),
  desc: 'A poke just below threshold makes a small bump that dies away; just above it gives a full spike to about plus 40 millivolts; twice as strong gives a spike of the same size, only a little earlier.',
}), `Action potential tool maths (Hodgkin–Huxley 1952 squid axon, 6.3 °C, rest −65 mV). The threshold for a 1 ms pulse comes out at ${thr1.toFixed(1)} µA/cm². Our own simulation.`);
// (b) Strength–duration curve: the threshold for pulses of different lengths (the curve Lapicque made famous in 1907).
const widths = [0.1, 0.2, 0.3, 0.5, 0.7, 1, 1.5, 2, 3, 5, 7, 10];
const thr = widths.map((w) => threshold(w));
const rheo = thr[thr.length - 1];
const chron = widths[thr.findIndex((v) => v <= 2 * rheo)];
log(`Strength-duration: rheobase ≈ ${rheo.toFixed(2)}, chronaxie between ${widths[thr.findIndex((v) => v <= 2 * rheo) - 1]} and ${chron} ms; thr 0.1 ms ${thr[0].toFixed(1)}`);
const figSD = figure(chart({
  title: 'Shorter pulses need more current', xLabel: 'Pulse length (ms, log scale)', yLabel: 'Threshold current (µA/cm², log)',
  series: [{ name: 'Hodgkin–Huxley threshold', x: widths.map((w) => +Math.log10(w).toFixed(3)), y: thr.map((v) => +Math.log10(v).toFixed(3)), kind: 'line' }, { name: 'pulses tested', x: widths.map((w) => +Math.log10(w).toFixed(3)), y: thr.map((v) => +Math.log10(v).toFixed(3)), kind: 'dots', size: 3.5, noLegend: true }],
  xTicks: [-1, 0, 1], xFmt: (v) => String(10 ** v), yTicks: [0, 1, 2], yFmt: (v) => String(10 ** v), hlines: [{ y: Math.log10(2 * rheo), text: 'twice the long-pulse threshold' }],
  desc: 'The threshold falls steeply as pulses get longer and levels off beyond a few milliseconds; short 0.1 millisecond pulses need about ten times more current.',
}), 'Each point is a bisection search for the smallest pulse that fires a spike, with the Action potential tool\'s engine (threshold()). Optogenetics uses the same trade-off: brief flashes need brighter light.');
// (c) Equilibrium (Nernst) potentials and the resting potential (Goldman–Hodgkin–Katz) for a typical mammalian neuron.
const ions = [{ name: 'K', z: 1, out: 4, in: 140, p: 1 }, { name: 'Na', z: 1, out: 145, in: 12, p: 0.04 }, { name: 'Cl', z: -1, out: 110, in: 10, p: 0.45 }];
const E = Object.fromEntries(ions.map((i) => [i.name, nernst(i.z, i.out, i.in, 37)]));
const Ca = nernst(2, 2, 0.0001, 37), Vrest = ghkVoltage(ions, 37);
log(`Nernst 37 °C: K ${E.K.toFixed(0)}, Na ${E.Na.toFixed(0)}, Cl ${E.Cl.toFixed(0)}, Ca ${Ca.toFixed(0)}; GHK rest ${Vrest.toFixed(0)} mV`);
const labels = ['K⁺', 'Cl⁻', 'Resting (GHK)', 'Na⁺', 'Ca²⁺'], vals = [E.K, E.Cl, Vrest, E.Na, Ca];
const figNernst = figure(chart({
  title: 'Where each ion would pull the voltage', xLabel: 'Ion', yLabel: 'Equilibrium potential (mV)',
  series: [{ name: 'Nernst potential', x: [1, 2, 3, 4, 5], y: vals.map((v) => +v.toFixed(1)), kind: 'dots', size: 6 }],
  xDomain: [0.5, 5.5], xTicks: [1, 2, 3, 4, 5], xFmt: (v) => labels[v - 1] ?? '', yDomain: [-110, 150], hlines: [{ y: 0, text: '0 mV' }],
  desc: 'Potassium pulls towards minus 95 millivolts, chloride to about minus 64, sodium to plus 66 and calcium to about plus 130; the resting voltage sits near minus 70, close to potassium.',
}), 'Membrane potential tool maths at 37 °C (Nernst for each ion; Goldman–Hodgkin–Katz for the rest, permeabilities K : Na : Cl = 1 : 0.04 : 0.45). Concentrations (mM, outside/inside): K 4/140, Na 145/12, Cl 110/10, Ca 2/0.0001: typical textbook values, rounded.');
put('medicine-2026-neurons-algae-light', { 'all-or-nothing': figAP, 'strength-duration': figSD, nernst: figNernst });

// ---------- Part 2: channelrhodopsin ----------
// (a) Photon energies across the visible, with the peaks of light-sensitive proteins (rounded literature values).
const nm = Array.from({ length: 81 }, (_, i) => 380 + i * 4);
const peaks = [[470, 'ChR2 ≈ 470'], [498, 'rod rhodopsin ≈ 498'], [568, 'bacteriorhodopsin ≈ 568'], [590, 'Chrimson ≈ 590']];
const figPh = figure(chart({
  title: 'Energy per photon across the visible', xLabel: 'Wavelength (nm)', yLabel: 'Photon energy (eV)',
  series: [{ name: 'E = hc/λ', x: nm, y: nm.map((l) => +photon(l * 1e-9).eV.toFixed(4)), kind: 'line' }, { name: 'peaks', x: peaks.map((p) => p[0]), y: peaks.map((p) => +photon(p[0] * 1e-9).eV.toFixed(3)), kind: 'dots', size: 5, noLegend: true }],
  vlines: peaks.map(([l, t], i) => ({ x: l, text: t, dy: i * 15 })), yDomain: [1.7, 3.3],
  desc: 'Photon energy falls from about 3.3 electronvolts at 380 nanometres to about 1.8 at 700; blue light for channelrhodopsin-2 carries about 2.6 electronvolts per photon.',
}), 'EM spectrum tool maths (E = hc/λ). Peak wavelengths are rounded values from the literature for each protein; each one is set by retinal and the protein pocket around it.');
log(`Photon at 470 nm: ${photon(470e-9).eV.toFixed(2)} eV; 590 nm: ${photon(590e-9).eV.toFixed(2)} eV`);
// (b) Reversal potential against outside pH for a channel that passes protons far better than sodium (GHK).
const PH_REL = 1e6; // proton permeability relative to sodium: order of magnitude reported for ChR2 (assumption, rounded)
const phs = Array.from({ length: 36 }, (_, i) => 5.5 + i * 0.1);
const erev = (pHo, pH) => ghkVoltage([{ name: 'Na', z: 1, out: 145, in: 12, p: 1 }, { name: 'K', z: 1, out: 4, in: 140, p: 0.5 }, { name: 'H', z: 1, out: 1000 * 10 ** -pHo, in: 1000 * 10 ** -7.2, p: pH }], 22);
const er = phs.map((p) => +erev(p, PH_REL).toFixed(2)), erNa = phs.map((p) => +erev(p, 0).toFixed(2));
log(`ChR2-like reversal: pH 7.4 ${erev(7.4, PH_REL).toFixed(1)} mV, pH 6.0 ${erev(6, PH_REL).toFixed(1)} mV, pH 9 ${erev(9, PH_REL).toFixed(1)} mV`);
const figRev = figure(chart({
  title: 'Where the light-driven current reverses, against outside pH', xLabel: 'pH outside the cell (inside 7.2)', yLabel: 'Reversal potential (mV)',
  series: [{ name: 'Protons pass 10⁶ × better than Na⁺', x: phs, y: er, kind: 'line' }, { name: 'If only Na⁺ and K⁺ passed', x: phs, y: erNa, kind: 'line', dash: '5 4' }],
  desc: 'With strong proton permeability the reversal potential climbs by tens of millivolts as the outside gets more acidic; without protons it would stay flat.',
}), 'Membrane potential tool maths (Goldman–Hodgkin–Katz, 22 °C). Relative permeabilities H⁺ : Na⁺ : K⁺ = 10⁶ : 1 : 0.5 are our round assumption of the size reported for channelrhodopsin-2. The pH dependence is the kind of test Nagel and colleagues used to show the channel passes protons and cations.');
// (c) Reading the closing time from a recorded off-current: simulate a noisy decay, fit with Levenberg-Marquardt.
const tt = Array.from({ length: 120 }, (_, i) => i * 0.5), tau = 10;
const yy = tt.map((t) => +(-1 * Math.exp(-t / tau) - 0.02 + 0.03 * gauss()).toFixed(4));
const fitE = levenbergMarquardt((t, p) => p[0] * Math.exp(-t / p[1]) + p[2], tt, yy, [-0.8, 5, 0]);
log(`τ_off fit: ${fitE.p[1].toFixed(2)} ± ${fitE.se[1].toFixed(2)} ms (true 10)`);
const figTau = figure(chart({
  title: 'Reading the closing time from the current after the light goes off', xLabel: 'Time after light off (ms)', yLabel: 'Current (relative)',
  series: [{ name: 'Simulated recording', x: tt, y: yy, kind: 'dots', size: 2.2 }, { name: `Fit: τ = ${fitE.p[1].toFixed(1)} ± ${fitE.se[1].toFixed(1)} ms`, x: tt, y: tt.map((t) => +(fitE.p[0] * Math.exp(-t / fitE.p[1]) + fitE.p[2]).toFixed(4)), kind: 'line' }],
  desc: 'The inward current relaxes back to zero along an exponential; the fitted time constant matches the ten milliseconds put into the simulation.',
}), 'Our simulation (τ = 10 ms, about ChR2\'s closing time, plus noise) fitted by Levenberg-Marquardt least squares (the method the Curve fitter uses), with its standard error.');
put('medicine-2026-channelrhodopsin', { 'photon-energy': figPh, 'reversal-ph': figRev, 'tau-off': figTau });

