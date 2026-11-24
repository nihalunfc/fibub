// Figures for src/blog/discoveries/pi-controller-dead-time-weighted-geometrical-center-optimised-settling-time.md,
// made with the maths of the PID tuning simulator (src/lib/sci/ctl-pid.ts: dead-time loop simulation, step
// information, margins).
// Run: node scripts/blog-figures/pi-controller-dead-time-weighted-geometrical-center-optimised-settling-time.mjs
import fs from 'node:fs';
import { simulate, stepInfo, firstOrder, margins, openLoopTf, closedLoopPoles } from '../../src/lib/sci/ctl-pid.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/pi-controller-dead-time-weighted-geometrical-center-optimised-settling-time.md', import.meta.url);

// Inputs from the paper: Daskin (2025), Processes 13(3): 749, doi:10.3390/pr13030749 (CC BY), Example 1:
// plant G(s) = e^(-0.5 s) / (s + 1); PI gains WGC kp 1.0539, ki 1.1811 and optimised WGC kp 0.9939, ki 0.9311.
// The paper states settling times of 3.39 s and 1.94 s. A 15 s run with 2000 steps, as the tool page does.
const plant = { tf: firstOrder(1, 1), delay: 0.5 }, T_END = 15;
const DESIGNS = [{ id: 'WGC', kp: 1.0539, ki: 1.1811, paper: 3.39 }, { id: 'Optimised WGC', kp: 0.9939, ki: 0.9311, paper: 1.94 }];
const run = (kp, ki) => simulate(plant, { kp, ki, kd: 0, tf: 0 }, T_END, { steps: 2000 });
const res = DESIGNS.map((D) => {
  const c = { kp: D.kp, ki: D.ki, kd: 0, tf: 0 }, s = run(D.kp, D.ki);
  const i2 = stepInfo(s.t, s.y, 1, 1, 0.02), i5 = stepInfo(s.t, s.y, 1, 1, 0.05);
  const m = margins(openLoopTf(plant.tf, c), plant.delay);
  let iae = 0, itae = 0; for (let k = 1; k < s.t.length; k++) { const e = Math.abs(1 - s.y[k]), h = s.t[k] - s.t[k - 1]; iae += e * h; itae += s.t[k] * e * h; }
  return { ...D, s, i2, i5, gm: m.gm, pm: m.pm, dm: (m.pm * Math.PI / 180) / m.wgc, stable: closedLoopPoles(plant, c).stable, iae, itae, umax: Math.max(...s.u) };
});

// Settling time (2 %) as Ki varies with Kp held at each design's value.
const KI = Array.from({ length: 41 }, (_, i) => +(0.6 + i * 0.02).toFixed(2));
const sweep = DESIGNS.map((D) => KI.map((ki) => +stepInfo(...(() => { const s = run(D.kp, ki); return [s.t, s.y]; })(), 1, 1, 0.02).settle.toFixed(3)));
const best = sweep.map((row) => { const m = Math.min(...row); return { ki: KI[row.indexOf(m)], ts: m }; });

const every = (a, n) => a.filter((_, i) => i % n === 0);
const fig1 = chart({
  title: 'PI control of e^(−0.5s)/(s+1): unit step', xLabel: 'Time (s)', yLabel: 'Output y',
  series: res.map((r) => ({ name: `${r.id} (kp ${r.kp}, ki ${r.ki})`, kind: 'line', x: every(r.s.t, 10).map((v) => +v.toFixed(3)), y: every(r.s.y, 10).map((v) => +v.toFixed(4)) })),
  xDomain: [0, 6], yDomain: [0, 1.2], hlines: [{ y: 1.02, text: '' }, { y: 0.98, text: '±2 %' }],
  vlines: res.map((r, k) => ({ x: +r.i2.settle.toFixed(2), text: `${r.i2.settle.toFixed(2)} s`, left: k === 1, dy: 24 })),
  desc: `Step responses of the two PI designs. The WGC design overshoots by ${r1(res[0].i2.overshoot)} % and settles within 2 % at ${res[0].i2.settle.toFixed(2)} s; the optimised design overshoots ${r1(res[1].i2.overshoot)} % and settles at ${res[1].i2.settle.toFixed(2)} s.`, height: 270,
});
function r1(v) { return v.toFixed(1); }
const fig2 = chart({
  title: 'Settling time (±2 %) as the integral gain changes', xLabel: 'Integral gain ki (1/s)', yLabel: 'Settling time (s)',
  series: DESIGNS.map((D, k) => ({ name: `kp ${D.kp}`, kind: 'line', x: KI, y: sweep[k] })).concat(res.map((r) => ({ name: '', noLegend: true, kind: 'dots', x: [r.ki], y: [+r.i2.settle.toFixed(3)], size: 4, colour: 'var(--ink)' }))),
  xDomain: [0.6, 1.4], yDomain: [0, 6],
  desc: `Settling time against ki with kp fixed. With kp ${DESIGNS[1].kp} the shortest is ${best[1].ts.toFixed(2)} s at ki ${best[1].ki}; the paper's two designs are the black dots.`, height: 260,
});

console.log(JSON.stringify(res.map((r) => ({ id: r.id, rise: +r.i2.rise.toFixed(3), ts2: +r.i2.settle.toFixed(3), ts5: +r.i5.settle.toFixed(3), os: +r.i2.overshoot.toFixed(2), peakT: +r.i2.peakTime.toFixed(2), gm: +r.gm.toFixed(3), pm: +r.pm.toFixed(2), dm: +r.dm.toFixed(3), iae: +r.iae.toFixed(3), itae: +r.itae.toFixed(3), umax: +r.umax.toFixed(3), stable: r.stable }))), JSON.stringify(best));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'step', figure(fig1, 'Figure 1. Unit step responses of the paper\'s two PI designs for the plant e^(−0.5s)/(s+1), simulated with the PID tuning simulator\'s maths. Dashed lines: the ±2 % band and each design\'s settling time.'));
  md = inject(md, 'sweep', figure(fig2, 'Figure 2. Settling time into ±2 % as ki is varied with kp held at each design\'s value. The curve jumps where a small bump of the response leaves or enters the band. Black dots: the two published designs.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
