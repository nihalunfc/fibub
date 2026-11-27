// Figures for src/blog/discoveries/one-positron-quantum-cyclotron-156-ghz-5-6-tesla-ground-state.md, made with the maths of
// the Plasma parameter calculator (src/lib/sci/phplasma.ts) and the Quantum statistics plotter (src/lib/sci/phqstat.ts).
// Run: node scripts/blog-figures/one-positron-quantum-cyclotron-156-ghz-5-6-tesla-ground-state.mjs
import fs from 'node:fs';
import { plasma } from '../../src/lib/sci/phplasma.ts';
import { occupancy, KB, H, QE } from '../../src/lib/sci/phqstat.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/one-positron-quantum-cyclotron-156-ghz-5-6-tesla-ground-state.md', import.meta.url);

// From the paper (Myers, Soucy, Sukra, Sinha, Gabrielse 2026, PRL 137: 173001, doi:10.1103/gbkc-6nlj, CC BY 4.0, and its
// arXiv version 2605.08147): field 5.6 T; cyclotron and spin frequencies about 156 GHz; level spacing hbar*wc/kB about 7.5 K;
// trap electrodes at 300 mK; thermal chance of n = 1 slightly more than a part in 1e11; free-space cyclotron decay 83 ms,
// about 4 s inside the trap cavity; axial frequency about 206 MHz; held for a month.
const B = 5.6, T_TRAP = 0.3;
// A positron has the electron's mass and the opposite charge, so its cyclotron frequency is the calculator's electron
// cyclotron frequency fce. Density and temperature do not enter fce; we give placeholder values.
const fceAt = (b) => plasma({ ne: 1e6, Te: 1, Ti: 1, B: b, A: 1, Z: 1 }).fce;
const f = fceAt(B);
const E_meV = (H * f) / QE * 1000;            // one cyclotron quantum, meV (what the Quantum statistics page takes)
const TQ = (H * f) / KB;                       // the same quantum as a temperature, K
const x = (T) => TQ / T;                       // (E - mu)/kT with mu = 0 for oscillator quanta
const nbar = (T) => occupancy('be', x(T));     // mean quantum number of a thermal oscillator
const pExc = (T) => occupancy('mb', x(T));     // chance of being in n >= 1: e^(-x)
const B156 = (156e9 / f) * B;                  // the field that gives exactly 156 GHz (fce is proportional to B)
// The temperature at which the mean quantum number reaches 0.01 and 0.1 (bisection on the tool's own occupancy).
const tFor = (target) => { let lo = 0.05, hi = 50; for (let i = 0; i < 80; i++) { const m = Math.sqrt(lo * hi); if (nbar(m) < target) lo = m; else hi = m; } return Math.sqrt(lo * hi); };

const out = {
  fce_GHz: +(f / 1e9).toFixed(3), B_for_156GHz: +B156.toFixed(4), E_meV: +E_meV.toFixed(4), TQ_K: +TQ.toFixed(3), x300mK: +x(T_TRAP).toFixed(3),
  nbar: { 0.1: +nbar(0.1).toPrecision(3), 0.3: +nbar(0.3).toPrecision(4), 1: +nbar(1).toPrecision(3), 4.2: +nbar(4.2).toPrecision(4), 300: +nbar(300).toPrecision(4) },
  pExc: { 0.3: +pExc(0.3).toPrecision(4), 4.2: +pExc(4.2).toPrecision(4) },
  pExc_at_156GHz_300mK: +occupancy('mb', (H * 156e9) / KB / T_TRAP).toPrecision(4),
  T_for_nbar_0_01: +tFor(0.01).toFixed(3), T_for_nbar_0_1: +tFor(0.1).toFixed(3),
  cavity_factor: +(4 / 0.083).toFixed(1),
};
console.log(JSON.stringify(out, null, 1));

const Ts = Array.from({ length: 161 }, (_, i) => 10 ** (Math.log10(0.2) + (i * (1 - Math.log10(0.2))) / 160)); // 0.2 K to 10 K
const lg = (v) => Math.log10(v);
const p10 = (v) => (Number.isInteger(v) ? (v === 0 ? '1' : `1e${v}`) : '');
const fig1 = chart({
  title: 'How often heat lifts the positron out of its ground state', xLabel: 'Temperature of the trap (K, log scale)', yLabel: 'Mean quantum number',
  series: [{ name: 'Mean cyclotron quantum number', kind: 'line', x: Ts.map(lg), y: Ts.map((T) => lg(nbar(T))) }],
  xDomain: [Math.log10(0.2), 1], yDomain: [-17, 1], xTicks: [0.2, 0.5, 1, 2, 5, 10].map(lg), xFmt: (v) => String(+(10 ** v).toPrecision(2)), yTicks: [-15, -12, -9, -6, -3, 0], yFmt: p10,
  vlines: [{ x: lg(0.3), text: '300 mK' }, { x: lg(4.2), text: '4.2 K', dy: 14 }],
  desc: 'Mean thermal quantum number of a 156.8 gigahertz cyclotron oscillator against temperature from 0.2 to 10 kelvin, on log scales. At 300 millikelvin it is about 1.3 times ten to the minus 11; at 4.2 kelvin it is 0.20.',
  height: 280,
});

const Bs = Array.from({ length: 71 }, (_, i) => i * 0.1);
const fig2 = chart({
  title: 'Cyclotron frequency and quantum size against field', xLabel: 'Magnetic field (tesla)', yLabel: 'Cyclotron frequency (GHz)',
  series: [{ name: 'Positron (electron mass) cyclotron frequency', kind: 'line', x: Bs, y: Bs.map((b) => fceAt(b) / 1e9) }],
  xDomain: [0, 7], yDomain: [0, 200], yTicks: [0, 50, 100, 150, 200],
  vlines: [{ x: B, text: '5.6 T' }], hlines: [{ y: f / 1e9, text: `${(f / 1e9).toFixed(1)} GHz, one quantum = ${TQ.toFixed(2)} K` }],
  desc: 'Cyclotron frequency of a positron against magnetic field from 0 to 7 tesla, a straight line. At 5.6 tesla it is 156.8 gigahertz, a quantum worth 7.52 kelvin.',
  height: 260,
});

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'nbar', figure(fig1, 'Figure 1. The mean cyclotron quantum number of a thermal oscillator, the Bose-Einstein occupation with μ = 0, from the Quantum statistics plotter\'s maths. At the trap\'s 300 mK it is about 10⁻¹¹; in a plain 4.2 K liquid-helium trap it would be 0.20, so the positron would spend a sixth of its time excited.'));
  md = inject(md, 'fce', figure(fig2, 'Figure 2. The cyclotron frequency from the Plasma parameter calculator\'s electron cyclotron frequency, which applies unchanged to a positron. It grows in step with the field; at the paper\'s 5.6 T it is 156.8 GHz.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
