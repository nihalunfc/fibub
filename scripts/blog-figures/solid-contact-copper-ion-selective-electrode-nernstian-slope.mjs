// Figures for src/blog/discoveries/solid-contact-copper-ion-selective-electrode-nernstian-slope.md, made with the
// maths of the Nernst calculator (src/lib/sci/nernst.ts: thermalV, halfE, convertRef) and the Debye-Hückel activity
// coefficient from src/lib/sci/buffer.ts (the Buffer recipe calculator).
// Run: node scripts/blog-figures/solid-contact-copper-ion-selective-electrode-nernstian-slope.mjs
import fs from 'node:fs';
import { thermalV, halfE, half, convertRef, qFromE } from '../../src/lib/sci/nernst.ts';
import { logGamma } from '../../src/lib/sci/buffer.ts';
import { parseFormula, molarMass } from '../../src/lib/sci/chem.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/solid-contact-copper-ion-selective-electrode-nernstian-slope.md', import.meta.url);

// From the paper: Eid, Elsherbiny, Abbas, Abdel Ghany and Kelani (2025), BMC Chemistry 20,
// doi:10.1186/s13065-025-01692-y (CC BY 4.0). Slope 28.05 mV per decade, linear range 1e-8 to 1e-2 mol/L,
// detection limit 7.5e-9 mol/L, pH window 6 to 9.
const MEAS = 28.05, LO = 1e-8, HI = 1e-2, LOD = 7.5e-9;
const CU = half('Cu2');                       // Cu²⁺ + 2e⁻ → Cu(s), E° +0.3419 V vs SHE
const slope = (T, z = 2) => (thermalV(T) * Math.LN10 * 1000) / z; // mV per tenfold change in activity
const S25 = slope(298.15);

// Activity coefficient of Cu²⁺ in a CuCl₂ solution of c mol/L: ionic strength I = 3c, extended Debye-Hückel.
const gamma = (c) => 10 ** logGamma(2, 3 * c, 25);
const E = (a) => halfE(CU, { 'Cu^2+': a });   // electrode potential in volts vs SHE

const lg = Array.from({ length: 61 }, (_, i) => -8 + (i * 6) / 60);         // log10 c from −8 to −2
const ideal = lg.map((x) => 1000 * E(10 ** x));                             // activity = concentration
const real = lg.map((x) => 1000 * E(10 ** x * gamma(10 ** x)));             // concentration line, real activities
const anchor = 1000 * E(1e-5);                                              // all three lines meet at 10⁻⁵ mol/L
const paper = lg.map((x) => anchor + MEAS * (x + 5));

// Least-squares slope of the real (concentration) line over the paper's six decades.
const fit = (xs, ys) => { const n = xs.length, sx = xs.reduce((a, b) => a + b, 0), sy = ys.reduce((a, b) => a + b, 0); const sxy = xs.reduce((a, x, i) => a + x * ys[i], 0), sxx = xs.reduce((a, x) => a + x * x, 0); return (n * sxy - sx * sy) / (n * sxx - sx * sx); };
const dh = fit(lg, real);

const facts = {
  slope25: +S25.toFixed(4), slope20: +slope(293.15).toFixed(3), slope30: +slope(303.15).toFixed(3),
  perDegree: +((slope(303.15) - slope(293.15)) / 10).toFixed(4),
  slope25monovalent: +slope(298.15, 1).toFixed(3),
  measuredShare: +((100 * MEAS) / S25).toFixed(1),
  tempForMeasured: +((298.15 * MEAS) / S25 - 273.15).toFixed(1),
  debyeHuckelSlope: +dh.toFixed(2),
  gammaAt: { '1e-2': +gamma(1e-2).toFixed(4), '1e-4': +gamma(1e-4).toFixed(4), '1e-6': +gamma(1e-6).toFixed(4) },
  explained: +((100 * (S25 - dh)) / (S25 - MEAS)).toFixed(0),
  errPerDecade: +(10 ** ((S25 - MEAS) / S25)).toFixed(3),
  errSixDecades: +(10 ** ((6 * (S25 - MEAS)) / S25)).toFixed(2),
  E: { hi: +E(HI).toFixed(4), mid: +E(1e-5).toFixed(4), lo: +E(LO).toFixed(4) },
  EvsAgCl: { hi: +convertRef(E(HI), 'SHE', 'AgClsat').toFixed(4), lo: +convertRef(E(LO), 'SHE', 'AgClsat').toFixed(4) },
  qFromMid: +qFromE(CU.E, E(1e-5), 2).toFixed(3),
  lodMassPerL: +(LOD * molarMass(parseFormula('Cu')) * 1e6).toFixed(3), // µg/L
  span: +(1000 * (E(HI) - E(LO))).toFixed(1),
  spanAtMeasured: +(MEAS * 6).toFixed(1),
};

const fig1 = chart({
  title: 'Copper electrode: potential against concentration',
  xLabel: 'log₁₀ [Cu²⁺] (mol/L)', yLabel: 'Potential (mV vs SHE)',
  series: [
    { name: 'Nernst, 29.58 mV/decade', kind: 'line', x: lg, y: ideal.map((v) => +v.toFixed(2)) },
    { name: 'same, real activities', kind: 'line', x: lg, y: real.map((v) => +v.toFixed(2)), dash: '5 4' },
    { name: "paper's 28.05 mV/decade", kind: 'line', x: lg, y: paper.map((v) => +v.toFixed(2)), colour: 'var(--ink)' },
  ],
  xDomain: [-8, -2], yDomain: [95, 300],
  desc: 'Potential of a copper-responsive electrode against the logarithm of concentration over the paper’s six decades. The ideal Nernst line, the same line drawn against concentration with Debye-Huckel activity coefficients, and the paper’s measured 28.05 mV per decade all meet at 10 to the minus 5 mol per litre and fan out by about 5 mV at the ends.',
  height: 290,
});

const Ts = Array.from({ length: 51 }, (_, i) => i); // 0 to 50 °C
const fig2 = chart({
  title: 'The Nernst slope is set by temperature alone',
  xLabel: 'Temperature (°C)', yLabel: 'mV per tenfold change',
  series: [
    { name: 'divalent ion (z = 2)', kind: 'line', x: Ts, y: Ts.map((t) => +slope(t + 273.15).toFixed(3)) },
  ],
  xDomain: [0, 50], yDomain: [26, 32],
  hlines: [{ y: MEAS, text: "the paper's 28.05 mV/decade" }],
  vlines: [{ x: facts.tempForMeasured, text: `${facts.tempForMeasured} °C` }],
  desc: 'The theoretical Nernst slope for a divalent ion against temperature, from 29.08 mV per decade at 20 degrees to 30.08 at 30 degrees. The paper’s 28.05 mV per decade would need about 9.6 degrees Celsius, far below room temperature.',
  height: 270,
});

console.log(JSON.stringify(facts, null, 1));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'calib', figure(fig1, 'Figure 1. Three calibration lines for a Cu²⁺ electrode, worked out with the Nernst calculator’s maths: the ideal 29.58 mV per decade in activity, the same response seen against concentration once Debye-Hückel activity coefficients are applied (apparent slope 28.62), and a straight line of the paper’s reported 28.05 mV per decade. All three are set to agree at 10⁻⁵ mol/L. Our figure, not the paper’s data.'));
  md = inject(md, 'temp', figure(fig2, 'Figure 2. The theoretical slope for a divalent ion depends only on temperature (0.099 mV per decade per °C). Reaching 28.05 mV per decade by cooling alone would need about 9.6 °C.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
