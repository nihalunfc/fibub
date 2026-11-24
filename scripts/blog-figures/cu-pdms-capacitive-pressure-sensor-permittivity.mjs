// Figures for src/blog/discoveries/cu-pdms-capacitive-pressure-sensor-permittivity.md, made with the maths of the
// Capacitor inductor calculator (src/lib/sci/ph-capind.ts: plates and plateFields, the series dielectric stack).
// Run: node scripts/blog-figures/cu-pdms-capacitive-pressure-sensor-permittivity.mjs
import fs from 'node:fs';
import { plates, plateFields, EPS0 } from '../../src/lib/sci/ph-capind.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/cu-pdms-capacitive-pressure-sensor-permittivity.md', import.meta.url);

// From the paper: Wang et al. (2025), Sensors 25(3): 637 (CC BY 4.0).
// Four 5 x 5 mm upper electrodes over an 11 x 11 mm lower electrode, a 1 mm dielectric layer and two 0.1 mm pure
// PDMS encapsulation layers. Measured: pure PDMS er = 3.14 and C = 2.78 pF; Cu/CB/PDMS er = 5.56 (25 C);
// initial C of the finished sensor 4.57 pF, 4.31 pF after 5000 cycles; relative capacitance change 0.0829 over
// 0-10 kPa and 0.0246 over 40-50 kPa; LCR test at 1 V and 100 kHz.
const A = 4 * 25e-6;        // m2: four 5 x 5 mm electrodes in parallel = 1 cm2
const D0 = 1e-3;            // dielectric thickness (m)
const DENC = 0.2e-3;        // the two 0.1 mm encapsulation layers, in series, as one layer
const ER_PDMS = 3.14, ER_COMP = 5.56;
const C_MEAS_PURE = 2.78e-12, C_MEAS_INIT = 4.57e-12, C_MEAS_5000 = 4.31e-12;
const DCC_LOW = 0.0829, DCC_HIGH = 0.0246, V = 1;

const pF = (c) => c * 1e12;
const cPure = plates(A, [{ d: D0, er: ER_PDMS }]);
const cPurePerPad = plates(A / 4, [{ d: D0, er: ER_PDMS }]);
const cCompBare = plates(A, [{ d: D0, er: ER_COMP }]);
const cCompEnc = plates(A, [{ d: D0, er: ER_COMP }, { d: DENC, er: ER_PDMS }]);
// Invert the measurement: what permittivity does 4.57 pF imply, with and without the encapsulation in the stack?
const erFromC = (C, denc) => 1 / ((EPS0 * A) / C - denc / ER_PDMS) * D0;
const erBare = erFromC(C_MEAS_INIT, 0), erEnc = erFromC(C_MEAS_INIT, DENC);
const erPureCheck = erFromC(C_MEAS_PURE, 0);
// Compression needed for the measured relative capacitance change, in each model.
const rel = (dd, denc, er) => plates(A, [{ d: D0 - dd, er }, ...(denc ? [{ d: denc, er: ER_PDMS }] : [])]) / plates(A, [{ d: D0, er }, ...(denc ? [{ d: denc, er: ER_PDMS }] : [])]) - 1;
const solveDd = (target, denc, er) => { let lo = 0, hi = 0.5e-3; for (let i = 0; i < 120; i++) { const m = (lo + hi) / 2; rel(m, denc, er) < target ? (lo = m) : (hi = m); } return (lo + hi) / 2; };
const ddLowBare = solveDd(DCC_LOW, 0, ER_COMP), ddLowEnc = solveDd(DCC_LOW, DENC, ER_COMP);
const ddBoth = solveDd(DCC_LOW + DCC_HIGH, 0, ER_COMP);
const fields = plateFields(A, [{ d: D0, er: ER_COMP }, { d: DENC, er: ER_PDMS }], V);
// Tangent stiffness implied by the compression: 10 kPa over the strain it takes.
const modLow = 10e3 / (ddLowBare / D0);
// What the 5000-cycle drift means as a gap or permittivity change.
const erDrift = erFromC(C_MEAS_5000, 0);

const dds = Array.from({ length: 121 }, (_, i) => (i * 1e-6));  // 0 to 120 um of compression
const fig1 = chart({
  title: 'Capacitance change against how far the layer squashes',
  xLabel: 'Compression of the 1 mm layer (µm)', yLabel: 'Relative change ΔC/C₀',
  series: [
    { name: 'Dielectric alone', kind: 'line', x: dds.map((d) => d * 1e6), y: dds.map((d) => +rel(d, 0, ER_COMP).toFixed(5)) },
    { name: 'With 0.2 mm of skin', kind: 'line', x: dds.map((d) => d * 1e6), y: dds.map((d) => +rel(d, DENC, ER_COMP).toFixed(5)) },
  ],
  xDomain: [0, 120], yDomain: [0, 0.16],
  hlines: [{ y: DCC_LOW, text: 'measured, 0 to 10 kPa' }],
  vlines: [{ x: +(ddLowBare * 1e6).toFixed(1), text: `${(ddLowBare * 1e6).toFixed(1)} µm`, left: true }, { x: +(ddLowEnc * 1e6).toFixed(1), text: `${(ddLowEnc * 1e6).toFixed(1)} µm`, dy: 16 }],
  desc: `The relative capacitance change of the sensor as its 1 mm dielectric is squashed, for the dielectric on its own and with the two 0.1 mm encapsulation layers in series. The paper's measured change over 0 to 10 kPa needs about 77 micrometres of compression without the skin and 104 with it.`,
  height: 285,
});
const encs = Array.from({ length: 101 }, (_, i) => (i * 0.2e-3) / 100);
const fig2 = chart({
  title: 'What permittivity does 4.57 pF imply?',
  xLabel: 'Encapsulation inside the capacitor (mm)', yLabel: 'Implied εr of the 1 mm layer',
  series: [{ name: 'From the measured 4.57 pF', kind: 'line', x: encs.map((d) => d * 1e3), y: encs.map((d) => +erFromC(C_MEAS_INIT, d).toFixed(4)) }],
  xDomain: [0, 0.2], yDomain: [4.5, 8.5],
  hlines: [{ y: ER_COMP, text: 'the paper’s measured εr = 5.56' }],
  desc: `The permittivity the 1 mm composite layer must have to give the measured 4.57 picofarads, as a function of how much pure PDMS skin sits inside the capacitor: 5.16 with none, 7.69 with the full 0.2 mm.`,
  height: 275,
});

console.log(JSON.stringify({
  cPure_pF: +pF(cPure).toFixed(4), cPurePerPad_pF: +pF(cPurePerPad).toFixed(4), measPure_pF: 2.78,
  erPureCheck: +erPureCheck.toFixed(4),
  cCompBare_pF: +pF(cCompBare).toFixed(4), cCompEnc_pF: +pF(cCompEnc).toFixed(4), measInit_pF: 4.57,
  erBare: +erBare.toFixed(4), erEnc: +erEnc.toFixed(4),
  ddLowBare_um: +(ddLowBare * 1e6).toFixed(2), ddLowEnc_um: +(ddLowEnc * 1e6).toFixed(2),
  strainBare_pc: +((ddLowBare / D0) * 100).toFixed(2), ddBoth_um: +(ddBoth * 1e6).toFixed(2),
  modLow_kPa: +(modLow / 1e3).toFixed(1),
  fields_kV_per_mm: fields.map((e) => +(e / 1e6).toFixed(6)), fieldRatio: +(fields[1] / fields[0]).toFixed(4),
  charge_pC_at_1V: +(pF(cCompEnc) * V).toFixed(3),
  erDrift: +erDrift.toFixed(4), driftPc: +((1 - C_MEAS_5000 / C_MEAS_INIT) * 100).toFixed(2),
}, null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'squash', figure(fig1, "Figure 1. How the sensor's capacitance should rise as its soft layer is squashed, worked out with the Capacitor inductor calculator's series-stack maths. The dashed line is the paper's measured change over the first 10 kPa; where it crosses each curve is the compression that change implies."));
  md = inject(md, 'er', figure(fig2, 'Figure 2. Reading the measurement backwards: the permittivity the 1 mm composite layer needs to give 4.57 pF, against how much of the 0.2 mm pure-PDMS skin lies between the electrodes. The paper’s own 5.56 sits between the two extremes.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((x) => (x.length / 1024).toFixed(1) + ' KB').join(', '));
}
