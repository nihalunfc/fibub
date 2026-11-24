// Figures for src/blog/discoveries/flywheel-store-island-genset-moment-of-inertia.md, made with the maths of the
// Moment of inertia builder (src/lib/sci/phinertia.ts: centralI and composite, the parallel-axis sum).
// Run: node scripts/blog-figures/flywheel-store-island-genset-moment-of-inertia.mjs   (rewrites the charts in the article)
import fs from 'node:fs';
import { centralI, composite } from '../../src/lib/sci/phinertia.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/flywheel-store-island-genset-moment-of-inertia.md', import.meta.url);

// Values from the paper: Markowski et al. (2025), E3S Web of Conferences 638, 01003 (CC BY 4.0).
// Steel rotor: outer radius 0.2 m, width 0.8 m, density 7900 kg/m3, rotating mass 800 kg, stated I = 16 kg m2,
// nominal 6000 rpm, allowed speed swing +/- 148 rpm, energy taken out 0.043 kWh, gearbox ratio 4 (engine 1500 rpm),
// load step 52 kW with an engine response time of 3 s.
const RHO = 7900, R = 0.2, S = 0.8, M = 800, I_PAPER = 16, N0 = 6000, DN = 148, GEAR = 4;
const STEP_KW = 52, RESP_S = 3;

const w = (n) => (n * 2 * Math.PI) / 60;                 // rpm to rad/s
const E = (I, n) => 0.5 * I * w(n) ** 2;                 // spin energy (J)
const massFromGeometry = RHO * Math.PI * R * R * S;       // the rotor's mass from its own dimensions

// The rotor as the tool would be built: one solid cylinder (disc) on the axis, axis along the part.
const disc = composite([{ shape: 'cylinder', m: M, dims: [R, S], orient: 'along', x: 0, y: 0, name: 'Steel rotor' }]);
// What the paper's text form "I = m r^2" (a thin ring) would give instead, and a rim-type rotor of the same mass.
const ring = centralI('ring', M, [R], 'along');
const rim = composite([{ shape: 'tube', m: M, dims: [0.15, R, S], orient: 'along', x: 0, y: 0, name: 'Steel rim' }]);

const I = disc.I;
const usable = (Iv, n0, dn) => E(Iv, n0) - E(Iv, n0 - dn);          // energy released by slowing from n0 to n0 - dn
const uDisc = usable(I, N0, DN), uRim = usable(rim.I, N0, DN);
const need = STEP_KW * 1000 * RESP_S;                                 // 52 kW for 3 s, in joules
// Droop needed to cover the 156 kJ, from E(n0) - E(n) = need  ->  n = sqrt(n0^2 - need/(0.5 I (2pi/60)^2))
const droopFor = (Iv, n0, j) => n0 - Math.sqrt(n0 * n0 - j / (0.5 * Iv * (2 * Math.PI / 60) ** 2));
const dnNeed = droopFor(I, N0, need);
// Same 148 rpm window at the engine's own 1500 rpm (no gearbox), to show why the 4:1 step-up is there.
const uDirect = usable(I, N0 / GEAR, DN);

const nn = Array.from({ length: 121 }, (_, i) => 3000 + i * 25);      // 3000 to 6000 rpm
const fig1 = chart({
  title: 'Stored energy against speed, and the slice the genset uses',
  xLabel: 'Rotor speed (rpm)', yLabel: 'Stored energy (MJ)',
  series: [
    { name: 'Solid disc, I = 16.0 kg·m²', kind: 'line', x: nn, y: nn.map((n) => +(E(I, n) / 1e6).toFixed(4)) },
    { name: 'Rim rotor, I = 25.0 kg·m²', kind: 'line', x: nn, y: nn.map((n) => +(E(rim.I, n) / 1e6).toFixed(4)) },
  ],
  xDomain: [3000, 6000], yDomain: [0, 5.2],
  bands: [{ x0: N0 - DN, x1: N0, text: '' }],
  vlines: [{ x: N0 - DN, text: `${N0 - DN} rpm`, left: true }, { x: N0, text: `${N0} rpm` }],
  desc: `Spin energy of the paper's 800 kg steel rotor against speed, for the solid disc it describes (16 kg m2) and for a rim rotor of the same mass (25 kg m2). The shaded strip is the 148 rpm window the generating set is allowed to use.`,
  height: 290,
});

const nnn = Array.from({ length: 101 }, (_, i) => 2000 + i * 40);     // 2000 to 6000 rpm
const fig2 = chart({
  title: 'Energy in a 148 rpm window, against nominal speed',
  xLabel: 'Nominal speed (rpm)', yLabel: 'Usable energy (kJ)',
  series: [
    { name: 'Solid disc', kind: 'line', x: nnn, y: nnn.map((n) => +(usable(I, n, DN) / 1000).toFixed(3)) },
    { name: 'Rim rotor', kind: 'line', x: nnn, y: nnn.map((n) => +(usable(rim.I, n, DN) / 1000).toFixed(3)) },
  ],
  xDomain: [2000, 6000], yDomain: [0, 260],
  hlines: [{ y: need / 1000, text: '52 kW for 3 s = 156 kJ' }],
  vlines: [{ x: N0, text: `${N0} rpm`, left: true }],
  desc: `How much energy the same 148 rpm speed window holds as the nominal speed rises, for the solid disc and for a rim rotor of the same mass. The dashed line is the 156 kJ the engine needs to ride out a 52 kW load step for 3 seconds.`,
  height: 280,
});

console.log(JSON.stringify({
  massFromGeometry: +massFromGeometry.toFixed(1),
  I: +I.toFixed(4), I_PAPER, ringI: +ring.toFixed(2), rimI: +rim.I.toFixed(3),
  k: +disc.k.toFixed(4), kRim: +rim.k.toFixed(4),
  w6000: +w(N0).toFixed(2), E6000MJ: +(E(I, N0) / 1e6).toFixed(4), E6000kWh: +(E(I, N0) / 3.6e6).toFixed(4),
  L6000: +(I * w(N0)).toFixed(1),
  uDisc_kJ: +(uDisc / 1000).toFixed(1), uDisc_kWh: +(uDisc / 3.6e6).toFixed(4),
  uRim_kJ: +(uRim / 1000).toFixed(1), uRim_kWh: +(uRim / 3.6e6).toFixed(4),
  need_kJ: need / 1000, dnNeed: +dnNeed.toFixed(1),
  uDirect_kJ: +(uDirect / 1000).toFixed(2), ratio: +(uDisc / uDirect).toFixed(2),
  powerOver3s_kW: +(uDisc / RESP_S / 1000).toFixed(2),
  engineWindowRpm: DN / GEAR,
}, null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'energy', figure(fig1, "Figure 1. Spin energy against speed for the paper's 800 kg steel rotor, worked out with the Moment of inertia builder's maths: the solid disc the paper describes (I = 16.0 kg·m²) and a rim rotor of the same mass and outer radius (I = 25.0 kg·m²). The strip marks the 148 rpm the control system may give away."));
  md = inject(md, 'window', figure(fig2, 'Figure 2. The same 148 rpm window is worth far more energy at a high speed, because stored energy goes as the square of the speed. The dashed line is the 156 kJ needed to carry a 52 kW load step for 3 seconds.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
