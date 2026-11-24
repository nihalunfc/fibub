// Figures for src/blog/discoveries/kalman-filter-sampling-rate-elbow-angle-imu-fourth-root-law.md, made with the
// maths of the Kalman filter playground (src/lib/sci/kalman.ts).
// Run: node scripts/blog-figures/kalman-filter-sampling-rate-elbow-angle-imu-fourth-root-law.mjs
import fs from 'node:fs';
import { steadyGainConstant, simulate, kalman, summary } from '../../src/lib/sci/kalman.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/kalman-filter-sampling-rate-elbow-angle-imu-fourth-root-law.md', import.meta.url);

// Paper (Fourniol, Vauche, Rao, Watelain and Kussener 2025, Journal of Low Power Electronics and Applications
// 15(2): 33, doi:10.3390/jlpea15020033, CC BY): single inertial device on the forearm, elbow angle estimated five
// ways (accelerometer only, gyroscope integration, bias-corrected gyroscope, complementary filter, Kalman filter);
// signals low-pass filtered at 2 Hz; RMSE 1.83 to 5.52 degrees at a 100 Hz data rate; dropping the rate from
// 100 Hz to 10 Hz raised the RMSE by a factor of 1.8 while cutting sensor and computation power by about 10.
const SIGMA = 8; // degrees of sensor noise on one angle sample: our assumption
const R = SIGMA * SIGMA;
const TARGET = 1.83; // the paper's best RMSE at 100 Hz, in degrees

/** Steady-state posterior standard deviation of the constant-level (random-walk) filter. */
const sd = (q, dt) => Math.sqrt(steadyGainConstant(q, R, dt) * R);

// The process noise q (deg^2 per second of random walk) that puts the 100 Hz error at the paper's 1.83 degrees.
let lo = 1e-4, hi = 1e6;
for (let i = 0; i < 300; i++) { const m = Math.sqrt(lo * hi); if (sd(m, 0.01) > TARGET) hi = m; else lo = m; }
const Q = Math.sqrt(lo * hi);

const exact = {
  q: +Q.toFixed(3), driftPerSecond: +Math.sqrt(Q).toFixed(2),
  sd100: +sd(Q, 0.01).toFixed(3), sd10: +sd(Q, 0.1).toFixed(3),
  ratio: +(sd(Q, 0.1) / sd(Q, 0.01)).toFixed(3),
  ceiling: +(10 ** 0.25).toFixed(4),
  qdtOverR100: +((Q * 0.01) / R).toFixed(4),
};

// The ratio is largest when the per-step drift is small against the sensor noise, and that limit is 10^(1/4).
const qs = Array.from({ length: 121 }, (_, i) => 10 ** (-2 + i * 0.05));
const ratios = qs.map((q) => sd(q, 0.1) / sd(q, 0.01));

// A seeded simulation with the same numbers, run through the real filter.
const MINUTES = 1, N100 = Math.round((MINUTES * 60) / 0.01) + 1, N10 = Math.round((MINUTES * 60) / 0.1) + 1;
const run = (N, dt, seed) => {
  const s = simulate('constant', N, dt, Q, SIGMA, 90, 0, seed);
  const m = summary(kalman('constant', s.t, s.z, Q, R), s.truth);
  return { N, dt, rmsEst: +m.rmsEst.toFixed(3), rmsMeas: +m.rmsMeas.toFixed(3), nis: +m.nis.toFixed(3) };
};
const sim = { hz100: run(N100, 0.01, 7), hz10: run(N10, 0.1, 7) };
sim.ratio = +(sim.hz10.rmsEst / sim.hz100.rmsEst).toFixed(3);
// Averaged over 20 seeds, so one unlucky draw does not decide the answer.
const many = (N, dt) => { let s = 0; for (let k = 1; k <= 20; k++) s += run(N, dt, k).rmsEst; return s / 20; };
const avg = { hz100: +many(N100, 0.01).toFixed(3), hz10: +many(N10, 0.1).toFixed(3) };
avg.ratio = +(avg.hz10 / avg.hz100).toFixed(3);

// Figure 1: the error against sample rate, with the fourth-root line.
const hz = Array.from({ length: 100 }, (_, i) => 1 + i * 2);
const fig1 = chart({
  title: 'Angle error against sensor data rate', xLabel: 'Data rate (Hz)', yLabel: 'Steady-state error (degrees)',
  series: [
    { name: 'Kalman steady state', kind: 'line', x: hz, y: hz.map((f) => sd(Q, 1 / f)) },
    { name: 'fourth-root law', kind: 'line', x: hz, y: hz.map((f) => sd(Q, 0.01) * (0.01 * f) ** -0.25), dash: '5 4' },
    { name: 'the paper’s two rates', kind: 'dots', x: [10, 100], y: [sd(Q, 0.1), sd(Q, 0.01)], colour: 'var(--ink)', size: 3.4 },
  ],
  xDomain: [1, 200], yDomain: [0, 8],
  hlines: [{ y: SIGMA, text: `one raw sample, ${SIGMA}°` }],
  desc: `For a random-walk filter the steady-state error falls as the fourth root of the data rate, from ${exact.sd10} degrees at 10 Hz to ${exact.sd100} at 100 Hz, and can never fall below the raw sample noise divided by the smoothing the filter can do.`,
  height: 272,
});

// Figure 2: how big the 10x rate penalty can be, against how fast the angle wanders.
const fig2 = chart({
  title: 'Cost of a tenfold slower sensor', xLabel: 'Process noise q (deg² per s)', yLabel: 'Error at 10 Hz ÷ error at 100 Hz',
  series: [{ name: '', kind: 'line', x: qs.map((q) => Math.log10(q)), y: ratios }],
  xDomain: [-2, 4], yDomain: [1, 1.9], xFmt: (v) => (v === Math.round(v) ? String(10 ** v) : ''),
  hlines: [{ y: 10 ** 0.25, text: 'ceiling 10^(1/4) = 1.778' }, { y: 1.8, text: 'the paper measured 1.8' }],
  vlines: [{ x: Math.log10(Q), text: `q = ${exact.q}`, dy: 30 }],
  desc: `The penalty for a tenfold lower data rate is at most 10 to the power one quarter, about 1.778, reached when the angle wanders slowly compared with the sensor noise; for a fast-wandering angle the penalty vanishes because the filter has to trust each sample anyway.`,
  height: 272,
});

console.log(JSON.stringify({ exact, sim, avg, N100, N10 }, null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'rate', figure(fig1, 'Figure 1. The steady-state error of a constant-level Kalman filter against the sensor data rate, for 8° of sample noise and a process noise chosen to put the 100 Hz error at the paper\'s 1.83°. The dashed line is the fourth-root law; the two dots are the paper\'s two data rates.'));
  md = inject(md, 'ceiling', figure(fig2, 'Figure 2. How much a tenfold drop in data rate costs, as the angle\'s own wandering grows. The penalty can never exceed 10^(1/4) = 1.778, which is where the paper\'s measured factor of 1.8 sits.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
