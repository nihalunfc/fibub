// Figures for src/blog/discoveries/gearbox-tooth-numbers-ratio-four-automatic-dimensioning.md, made with the maths of
// the Gear trains tool (src/lib/sci/eng-gear.ts: the train ratio and torques, centre distance and the ratio search).
// Run: node scripts/blog-figures/gearbox-tooth-numbers-ratio-four-automatic-dimensioning.mjs
import fs from 'node:fs';
import { train, centreDistance, findRatios } from '../../src/lib/sci/eng-gear.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/gearbox-tooth-numbers-ratio-four-automatic-dimensioning.md', import.meta.url);

// Inputs from the paper: Fait, D. (2026), Machines 14(1): 36, doi:10.3390/machines14010036 (CC BY 4.0).
// Case study: one-stage gearbox, 70 kW input at 330 rpm, index ratio 4; the optimiser chose 19 and 76 teeth,
// a module of 1.94 rounded to 2 mm, and a 58 mm gear width. Tooth numbers were searched between 17 and 150.
const P = 70000, N_IN = 330, Z1 = 19, Z2 = 76, M_OPT = 1.94, M = 2, B = 58, Z_LO = 17, Z_HI = 150;
const SIGMA = 200, Y = 0.314; // OUR check: allowable bending stress (MPa) and the Lewis form factor for 19 teeth, 20° full depth

const T_IN = P / ((2 * Math.PI * N_IN) / 60); // N·m
const mesh = (eff) => [{ driver: Z1, driven: Z2, kind: 'external', eff }];
const ideal = train(mesh(1), N_IN, T_IN), real = train(mesh(0.98), N_IN, T_IN);
const d1 = M * Z1, d2 = M * Z2, a = centreDistance(M, mesh(1)[0]);
const Ft = (2 * T_IN * 1000) / d1; // N, tangential force at the pitch circle (torque in N·mm over the pitch radius)
const vPitch = (Math.PI * (d1 / 1000) * N_IN) / 60; // m/s
const hits = findRatios(4, Z_LO, Z_HI, 1, 21);
// Lewis bending stress for a module m: Ft = 2T/(m z1), σ = Ft/(b m Y).
const lewis = (m) => (2 * T_IN * 1000) / (m * Z1) / (B * m * Y);
const mNeeded = Math.sqrt((2 * T_IN * 1000) / (B * Z1 * Y * SIGMA));

const r3 = (x, n = 2) => +x.toFixed(n);
console.log(JSON.stringify({
  T_IN: r3(T_IN, 1), ratio: ideal.ratio, outSpeed: r3(ideal.shafts[1].speed, 2), outTorque: r3(ideal.shafts[1].torque, 1),
  outTorque98: r3(real.shafts[1].torque, 1), dir: ideal.shafts[1].dir,
  d1, d2, a, aOpt: r3(centreDistance(M_OPT, mesh(1)[0])), Ft: Math.round(Ft), perMm: r3(Ft / B, 1), vPitch: r3(vPitch, 3),
  exactPairs: hits.map((h) => h.teeth), nPairs: hits.length,
  sigmaAtM2: Math.round(lewis(M)), sigmaAtM194: Math.round(lewis(M_OPT)), mNeeded: r3(mNeeded), aNeeded: r3(centreDistance(mNeeded, mesh(1)[0]), 1),
  mFor300: r3(Math.sqrt((2 * T_IN * 1000) / (B * Z1 * Y * 300))), mFor400: r3(Math.sqrt((2 * T_IN * 1000) / (B * Z1 * Y * 400))),
}));

const z1s = hits.map((h) => h.teeth[0]);
const fig1 = chart({
  title: 'Every exact ratio-4 pair, and how big it makes the gearbox', xLabel: 'Teeth on the pinion', yLabel: 'Centre distance (mm)',
  series: [1.94, 2, 3].map((m) => ({ name: `module ${m} mm`, kind: 'line', x: z1s, y: z1s.map((z) => +centreDistance(m, { driver: z, driven: 4 * z, kind: 'external', eff: 1 }).toFixed(2)) }))
    .concat([{ name: 'the paper’s design', kind: 'dots', x: [Z1], y: [a], size: 5, colour: 'var(--ink)' }]),
  xDomain: [z1s[0], z1s[z1s.length - 1]], yDomain: [0, 300],
  desc: `Centre distance against pinion tooth count for the ${hits.length} tooth pairs that give a ratio of exactly 4 with 17 to 150 teeth, at three modules. The paper's 19 and 76 teeth at module 2 give ${a} mm.`,
  height: 275,
});

const ms = Array.from({ length: 121 }, (_, i) => 1.5 + i * 0.05);
const fig2 = chart({
  title: 'Tooth bending stress against module, at the torque the tool reports', xLabel: 'Module (mm)', yLabel: 'Lewis bending stress (MPa)',
  series: [{ name: '', noLegend: true, kind: 'line', x: ms, y: ms.map((m) => +lewis(m).toFixed(1)) }],
  xDomain: [1.5, 7.5], yDomain: [0, 3500],
  hlines: [{ y: SIGMA, text: `${SIGMA} MPa` }],
  vlines: [{ x: M, text: 'the paper’s module 2 mm' }, { x: mNeeded, text: `${r3(mNeeded, 1)} mm`, left: true, dy: 16 }],
  desc: `With 2025.6 N·m on the pinion, a 58 mm face width and 19 teeth, the Lewis bending stress falls from about ${Math.round(lewis(M))} MPa at module 2 to ${SIGMA} MPa at module ${r3(mNeeded, 1)}.`,
  height: 275,
});

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'pairs', figure(fig1, 'Figure 1. The whole single-pair design space for a ratio of exactly 4 inside the paper’s tooth-count limits of 17 to 150, drawn with the Gear trains tool’s centre-distance formula. Every point on a line is an exact ratio, so the choice is purely about size, tooth strength and how the teeth wear in.'));
  md = inject(md, 'lewis', figure(fig2, 'Figure 2. Our own strength check (not part of the tool): the Lewis bending stress on the pinion tooth against module, for the torque the Gear trains tool reports. The form factor 0.314 for 19 teeth at 20° full depth and the 200 MPa allowable are our assumptions.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
