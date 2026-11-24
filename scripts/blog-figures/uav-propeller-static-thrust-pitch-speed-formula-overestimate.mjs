// Figures for src/blog/discoveries/uav-propeller-static-thrust-pitch-speed-formula-overestimate.md, made with the
// maths of the Propeller thrust tool (src/lib/sci/eng-prop.ts: actuator-disc momentum theory and the BEM model).
// Run: node scripts/blog-figures/uav-propeller-static-thrust-pitch-speed-formula-overestimate.mjs
import fs from 'node:fs';
import { bem, inducedVelocity, idealPower, hoverPower, figureOfMerit, EXAMPLE_FOIL } from '../../src/lib/sci/eng-prop.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/uav-propeller-static-thrust-pitch-speed-formula-overestimate.md', import.meta.url);

// Inputs from the paper: Faishal et al. (2025), Engineering Proceedings 84(1): 59, doi:10.3390/engproc2025084059 (CC BY 4.0).
// Two three-blade 16-inch propellers on a UAV ground test rig, 2000 to 7000 rpm; thrust in kgf.
const RPM = [2000, 3000, 4000, 5000, 6000, 7000];
const PROPS = [
  { id: 'A', pitchIn: 8, meas: { 2000: 0.21, 7000: 3.39 }, eq6: { 2000: 0.35, 7000: 4.30 }, calc: { 2000: 0.390, 7000: 4.821 } },
  { id: 'B', pitchIn: 10, meas: { 2000: 0.14, 7000: 4.68 }, eq6: { 2000: 0.39, 7000: 4.81 }, calc: { 2000: 0.431, 7000: 5.276 } },
];
const G = 9.80665, D = 16 * 0.0254, RHO = 1.225, A = (Math.PI * D * D) / 4;
// OUR assumptions for the blade: a hub 50 mm across, a chord that tapers from root to tip in the ratio 38:20, and the
// tool's own simple aerofoil. The one free number, the chord scale, is set so that BEM matches the measured 7000 rpm
// thrust; everything else about the curve then follows from the model.
const blade = (pitchIn, n, sc) => ({ B: 3, D, hubD: 0.05, chordRoot: 0.038 * sc, chordTip: 0.020 * sc, pitch: pitchIn * 0.0254, rpm: n, V: 0, rho: RHO, foil: EXAMPLE_FOIL, n: 60 });
const fitChord = (pitchIn, targetN) => { let lo = 0.1, hi = 2; for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; if (bem(blade(pitchIn, 7000, m)).T < targetN) lo = m; else hi = m; } return (lo + hi) / 2; };

const res = PROPS.map((p) => {
  const sc = fitChord(p.pitchIn, p.meas[7000] * G);
  const curve = RPM.map((n) => bem(blade(p.pitchIn, n, sc)));
  const top = curve[curve.length - 1];
  return {
    ...p, sc, chord: [+(38 * sc).toFixed(1), +(20 * sc).toFixed(1)],
    kgf: curve.map((r) => +(r.T / G).toFixed(3)), W: curve.map((r) => +r.P.toFixed(0)),
    FM: +top.FM.toFixed(3), CT: +top.CT.toFixed(4), CP: +top.CP.toFixed(4), tip: +top.tipSpeed.toFixed(0), stalled: top.stalled,
    square2000: +(p.meas[7000] * (2 / 7) ** 2).toFixed(3),
    v: +inducedVelocity(p.meas[7000] * G, RHO, A).toFixed(2), pIdeal: +idealPower(p.meas[7000] * G, RHO, A).toFixed(0),
    p65: +hoverPower(p.meas[7000] * G, RHO, A, 0.65).toFixed(0), fmFromBem: +figureOfMerit(top.T, top.P, RHO, A).toFixed(3),
  };
});

const fig1 = chart({
  title: 'Static thrust of two 16-inch propellers', xLabel: 'Speed (rpm)', yLabel: 'Thrust (kgf)',
  series: [
    { name: 'BEM 16×8', kind: 'line', x: RPM, y: res[0].kgf },
    { name: 'BEM 16×10', kind: 'line', x: RPM, y: res[1].kgf, colour: 'var(--c-tools)' },
    { name: 'Measured', kind: 'dots', x: [2000, 7000, 2000, 7000], y: [0.21, 3.39, 0.14, 4.68], size: 5, colour: 'var(--ink)' },
    { name: 'Paper Eq. 6', kind: 'dots', x: [2000, 7000, 2000, 7000], y: [0.35, 4.30, 0.39, 4.81], size: 3.5, colour: 'var(--muted)' },
  ],
  xDomain: [1800, 7200], yDomain: [0, 5.5],
  desc: 'Thrust against speed for the two propellers: the blade element momentum curves from the Propeller thrust tool, the paper’s four measured points and its four pitch-speed formula values.', height: 260,
});

const TT = Array.from({ length: 101 }, (_, i) => 0.5 + i * 0.5);
const fig2 = chart({
  title: 'Shaft power a 16-inch rotor needs for a given static thrust', xLabel: 'Thrust (N)', yLabel: 'Shaft power (W)',
  series: [
    { name: 'Ideal (FM = 1)', kind: 'line', x: TT, y: TT.map((T) => +idealPower(T, RHO, A).toFixed(1)) },
    { name: 'FM = 0.74', kind: 'line', x: TT, y: TT.map((T) => +hoverPower(T, RHO, A, 0.74).toFixed(1)), colour: 'var(--c-tools)' },
    { name: 'FM = 0.55', kind: 'line', x: TT, y: TT.map((T) => +hoverPower(T, RHO, A, 0.55).toFixed(1)), colour: 'var(--muted)' },
  ],
  xDomain: [0, 50], yDomain: [0, 1100],
  vlines: [{ x: +(3.39 * G).toFixed(1), text: '16×8 at 7000 rpm' }, { x: +(4.68 * G).toFixed(1), text: '16×10', dy: 16 }],
  desc: 'Shaft power against static thrust for a 0.406 m rotor at sea level, by actuator-disc momentum theory, at figures of merit 1, 0.74 and 0.55. Dashed lines mark the two measured thrusts at 7000 rpm.', height: 260,
});

console.log(JSON.stringify(res.map((r) => ({ id: r.id, pitchIn: r.pitchIn, sc: +r.sc.toFixed(3), chord: r.chord, kgf: r.kgf, W: r.W, FM: r.FM, CT: r.CT, CP: r.CP, tip: r.tip, stalled: r.stalled, square2000: r.square2000, v: r.v, pIdeal: r.pIdeal, p65: r.p65 }))));
console.log('Eq.6 rpm scaling', (4.30 / 0.35).toFixed(2), 'vs (7/2)^2 =', ((7 / 2) ** 2).toFixed(2), '| pitch scaling', (4.81 / 4.30).toFixed(3), 'vs sqrt(10/8) =', Math.sqrt(1.25).toFixed(3));
console.log('measured ratios 7000/2000: A', (3.39 / 0.21).toFixed(1), 'B', (4.68 / 0.14).toFixed(1));
console.log('disc loading at 7000 rpm (N/m2): A', (3.39 * G / A).toFixed(1), 'B', (4.68 * G / A).toFixed(1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'thrust', figure(fig1, 'Figure 1. Static thrust against speed. The lines are the Propeller thrust tool’s blade element model of a three-blade 16-inch propeller, with the chord set so each line passes through the measured 7000 rpm point. Large dots are the paper’s measurements, small grey dots its pitch-speed formula.'));
  md = inject(md, 'power', figure(fig2, 'Figure 2. Shaft power against static thrust for a 0.406 m rotor at sea level, from actuator-disc momentum theory at three figures of merit. The dashed lines mark the two thrusts measured at 7000 rpm.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
