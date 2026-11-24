// Figures for src/blog/discoveries/argon-plasma-engine-magnetic-field-debye-gyroradius.md, made with the maths of the
// Plasma parameter calculator (src/lib/sci/phplasma.ts: Debye length, gyroradii, collision times, Hall parameters).
// Run: node scripts/blog-figures/argon-plasma-engine-magnetic-field-debye-gyroradius.mjs
import fs from 'node:fs';
import { plasma } from '../../src/lib/sci/phplasma.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/argon-plasma-engine-magnetic-field-debye-gyroradius.md', import.meta.url);

// Inputs from the paper: Ali H. and Yaseen W. I. (2025), Iraqi Journal of Physics 23(4): 87-97,
// doi:10.30723/ijp.v23i4.1496 (CC BY 4.0). Argon at 0.2 mbar, 25-100 W, coil fields of 9 and 25 mT, engine about
// 5 cm long and 5.5 cm wide; Langmuir probe gives ne about 2-6e19 m^-3 and Te about 2-4 eV.
// OUR ASSUMPTIONS: Ti = 0.03 eV (room-temperature argon ions, the usual value for a low-pressure discharge),
// singly charged Ar+ (A = 40, Z = 1), and a plasma size L = 0.05 m taken from the stated engine length.
const TI = 0.03, A = 40, Z = 1, L = 0.05;
const CASES = [
  { id: 'Low end, no field', ne: 2e19, Te: 4, B: 0 },
  { id: 'Low end at 9 mT', ne: 2e19, Te: 4, B: 0.009 },
  { id: 'High end at 9 mT', ne: 6e19, Te: 2, B: 0.009 },
  { id: 'High end at 25 mT', ne: 6e19, Te: 2, B: 0.025 },
  { id: 'Middle at 25 mT', ne: 4e19, Te: 3, B: 0.025 },
];
const P = (ne, Te, B) => plasma({ ne, Te, Ti: TI, B, A, Z });

// Field needed to magnetise each species (Hall parameter = 1), by bisection on B.
const fieldFor = (ne, Te, which) => {
  let lo = 1e-5, hi = 1e6;
  for (let i = 0; i < 80; i++) { const m = Math.sqrt(lo * hi); const p = P(ne, Te, m); ((which === 'e' ? p.hallE : p.hallI) < 1 ? (lo = m) : (hi = m)); }
  return Math.sqrt(lo * hi);
};

const B = Array.from({ length: 100 }, (_, i) => 0.001 * 10 ** ((i / 99) * 2)); // 1 to 100 mT, log spaced
const mid = { ne: 4e19, Te: 3 };
const rows = B.map((b) => P(mid.ne, mid.Te, b));

const fig1 = chart({
  title: 'How tightly the field holds each species', xLabel: 'Magnetic field B (mT)', yLabel: 'Gyroradius (mm)',
  series: [
    { name: 'Electron gyroradius', kind: 'line', x: B.map((b) => b * 1e3), y: rows.map((p) => Math.log10(p.rLe * 1e3)) },
    { name: 'Ar⁺ gyroradius', kind: 'line', x: B.map((b) => b * 1e3), y: rows.map((p) => Math.log10(p.rLi * 1e3)) },
  ],
  xDomain: [1, 100], yDomain: [-1.3, 2.3], yTicks: [-1, 0, 1, 2], yFmt: (v) => (v === -1 ? '0.1' : v === 0 ? '1' : v === 1 ? '10' : '100'),
  hlines: [{ y: Math.log10(50), text: 'engine length 50 mm' }, { y: Math.log10(7), text: 'engine thickness 7 mm' }],
  vlines: [{ x: 9, text: '9 mT' }, { x: 25, text: '25 mT', dy: 14 }],
  desc: 'Thermal gyroradii of electrons and argon ions against magnetic field, for ne 4e19 per cubic metre and Te 3 eV. At 9 and 25 mT the electron gyroradius is a fraction of a millimetre while the ion gyroradius is centimetres.',
  height: 290,
});

const fig2 = chart({
  title: 'Turns between collisions (Hall parameter)', xLabel: 'Magnetic field B (mT)', yLabel: 'ω τ (log scale)',
  series: [
    { name: 'Electrons ωce·τe', kind: 'line', x: B.map((b) => b * 1e3), y: rows.map((p) => Math.log10(p.hallE)) },
    { name: 'Ions ωci·τi', kind: 'line', x: B.map((b) => b * 1e3), y: rows.map((p) => Math.log10(p.hallI)) },
  ],
  xDomain: [1, 100], yDomain: [-5.5, 2.5], yTicks: [-5, -4, -3, -2, -1, 0, 1, 2], yFmt: (v) => `10${['⁻⁵', '⁻⁴', '⁻³', '⁻²', '⁻¹', '⁰', '¹', '²'][v + 5]}`,
  hlines: [{ y: 0, text: 'ωτ = 1: magnetised' }],
  vlines: [{ x: 9, text: '9 mT' }, { x: 25, text: '25 mT', dy: 14 }],
  desc: 'The Hall parameter of electrons and of argon ions against magnetic field. Electrons pass 1 at about 1.2 mT; ions would need tens of tesla.',
  height: 280,
});

const f = (p) => ({
  lD_um: +(p.lambdaD * 1e6).toFixed(2), ND: +p.ND.toFixed(0), fpe_GHz: +(p.fpe / 1e9).toFixed(2), fce_GHz: +(p.fce / 1e9).toFixed(3),
  fci_kHz: +(p.fci / 1e3).toFixed(1), rLe_mm: +(p.rLe * 1e3).toFixed(3), rLi_mm: +(p.rLi * 1e3).toFixed(2), mfpE_mm: +(p.mfpE * 1e3).toFixed(2),
  hallE: +p.hallE.toFixed(2), hallI: +p.hallI.toPrecision(3), beta: +p.beta.toPrecision(3), lnL: +p.lnL.toFixed(2),
  vte_kms: +(p.vte / 1e3).toFixed(0), cs_kms: +(p.cs / 1e3).toFixed(2), press_Pa: +p.pressure.toPrecision(3), eta: +p.etaSpitzer.toPrecision(3),
  skinE_mm: +(p.skinE * 1e3).toFixed(2), nuE_MHz: +(p.nuE / 1e6).toFixed(0), lamOverL: +(p.lambdaD / L).toPrecision(2),
});
console.log(JSON.stringify(CASES.map((c) => ({ id: c.id, ...c, ...f(P(c.ne, c.Te, c.B)) })), null, 1));
console.log('B for magnetised electrons (mT):', (fieldFor(mid.ne, mid.Te, 'e') * 1e3).toFixed(2), ' for ions (T):', fieldFor(mid.ne, mid.Te, 'i').toFixed(1));
console.log('B for magnetised electrons at the dense cold end (mT):', (fieldFor(6e19, 2, 'e') * 1e3).toFixed(2));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'gyro', figure(fig1, 'Figure 1. Thermal gyroradii worked out with the Plasma parameter calculator\'s maths for the middle of the paper\'s measured range (nₑ 4 × 10¹⁹ m⁻³, Tₑ 3 eV, Ar⁺ ions at an assumed 0.03 eV). The dashed lines are the engine\'s own sizes as the paper states them.'));
  md = inject(md, 'hall', figure(fig2, 'Figure 2. The Hall parameter, how many radians a particle turns around a field line between collisions, for the same plasma. Above 1 the species is magnetised. Electrons cross that line at about 1 mT; argon ions never do at any field a small coil can make.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
