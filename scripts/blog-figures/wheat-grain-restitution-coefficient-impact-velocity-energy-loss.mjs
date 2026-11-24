// Figures for src/blog/discoveries/wheat-grain-restitution-coefficient-impact-velocity-energy-loss.md, made with the
// maths of the Collision calculator (src/lib/sci/phcollision.ts: collide1D and fromMeasured).
// Run: node scripts/blog-figures/wheat-grain-restitution-coefficient-impact-velocity-energy-loss.mjs
import fs from 'node:fs';
import { collide1D, fromMeasured } from '../../src/lib/sci/phcollision.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/wheat-grain-restitution-coefficient-impact-velocity-energy-loss.md', import.meta.url);

// Inputs from the paper's abstract and methods: Marcinkiewicz, J., Slaski, G. W. and Spadlo, M. (2025),
// Applied Sciences 15(11): 6055, doi:10.3390/app15116055 (CC BY). Moisture 7, 10, 13 and 16 %; normal impact
// velocities 1.0 to 5.0 m/s; CoR about 0.60 at the driest, falling to 0.40-0.50 at 16 %; force sensor range 44.48 N
// sampled at 1 MHz; drop-height rigs in the literature use 10-25 cm and 155-300 mm.
const G = 9.80665, WALL = 1e9;        // a flat metal plate: the second body is effectively infinite
const MASS = 38e-6;                   // OUR assumption: 38 mg, a typical wheat kernel
const ES = [0.60, 0.50, 0.45, 0.40];
const wall = (u, e) => collide1D(MASS, u, WALL, 0, e); // rebound speed is -v1

const VS = Array.from({ length: 81 }, (_, i) => 1 + i * 0.05);
const dropFor = (v) => (v * v) / (2 * G);                      // metres
const reboundH = (v, e) => dropFor(-wall(v, e).v1);
const fig1 = chart({
  title: 'Drop height before, rebound height after', xLabel: 'Impact velocity (m/s)', yLabel: 'Height (cm)',
  series: [
    { name: 'drop needed', kind: 'line', x: VS, y: VS.map((v) => +(dropFor(v) * 100).toFixed(1)) },
    { name: 'rebound, e = 0.60', kind: 'line', x: VS, y: VS.map((v) => +(reboundH(v, 0.6) * 100).toFixed(1)) },
    { name: 'rebound, e = 0.45', kind: 'line', x: VS, y: VS.map((v) => +(reboundH(v, 0.45) * 100).toFixed(1)), colour: 'var(--muted)' },
  ],
  xDomain: [1, 5], yDomain: [0, 130],
  bands: [{ x0: 1.4, x1: 2.43, text: 'what a 10-30 cm drop reaches' }],
  desc: 'The free-fall height needed to reach each impact velocity, and the height a grain bounces back to for restitution coefficients of 0.60 and 0.45.', height: 275,
});

const EE = Array.from({ length: 61 }, (_, i) => 0.25 + i * 0.01);
const lostOnWall = (e) => { const r = wall(3, e); return (r.lost / r.K0) * 100; };
const lostOnGrain = (e) => { const r = collide1D(MASS, 3, MASS, 0, e); return (r.lost / r.K0) * 100; };
const fig2 = chart({
  title: 'How much kinetic energy one impact destroys', xLabel: 'Coefficient of restitution e', yLabel: 'Kinetic energy lost (%)',
  series: [
    { name: 'grain on a steel plate', kind: 'line', x: EE, y: EE.map((e) => +lostOnWall(e).toFixed(2)) },
    { name: 'grain on a still grain', kind: 'line', x: EE, y: EE.map((e) => +lostOnGrain(e).toFixed(2)) },
    { name: 'the paper\'s range', kind: 'dots', x: ES, y: ES.map((e) => +lostOnWall(e).toFixed(2)), size: 4.5, colour: 'var(--ink)' },
  ],
  xDomain: [0.25, 0.85], yDomain: [0, 100],
  desc: 'Fraction of the kinetic energy lost in one impact against the coefficient of restitution, for a grain hitting a heavy plate and for a grain hitting an identical grain at rest.', height: 275,
});

const TS = Array.from({ length: 96 }, (_, i) => 5 + i * 1); // contact time, microseconds
const force = (u, e, t) => { const r = wall(u, e); return Math.abs(r.J) / (t * 1e-6); }; // mean force, N
const fig3 = chart({
  title: 'Mean contact force on a 38 mg grain (e = 0.5)', xLabel: 'Contact time (microseconds)', yLabel: 'Mean force (N)',
  series: [
    { name: '4.5 m/s', kind: 'line', x: TS, y: TS.map((t) => +force(4.5, 0.5, t).toFixed(2)) },
    { name: '2.5 m/s', kind: 'line', x: TS, y: TS.map((t) => +force(2.5, 0.5, t).toFixed(2)) },
    { name: '1.0 m/s', kind: 'line', x: TS, y: TS.map((t) => +force(1.0, 0.5, t).toFixed(2)), colour: 'var(--muted)' },
  ],
  xDomain: [5, 100], yDomain: [0, 50], hlines: [{ y: 44.48, text: 'the sensor\'s 44.48 N range' }],
  desc: 'Mean contact force from the impulse of the impact divided by the contact time, for a 38 mg grain hitting a plate at 1.0, 2.5 and 4.5 m/s with a restitution coefficient of 0.5.', height: 275,
});

const rows = [1.0, 2.5, 4.5].flatMap((u) => ES.map((e) => { const r = wall(u, e); return { u, e, rebound: +(-r.v1).toFixed(3), dropCm: +(dropFor(u) * 100).toFixed(1), reboundCm: +(reboundH(u, e) * 100).toFixed(1), lostPct: +((r.lost / r.K0) * 100).toFixed(1), lostMicroJ: +(r.lost * 1e6).toFixed(1), impulse: +(Math.abs(r.J) * 1e6).toFixed(1) }; }));
console.log(JSON.stringify({
  dropForCm: [1, 1.4, 2.43, 2.5, 4.5, 5].map((v) => ({ v, cm: +(dropFor(v) * 100).toFixed(1) })),
  vFromDrop: [0.10, 0.155, 0.25, 0.30].map((h) => ({ h, v: +Math.sqrt(2 * G * h).toFixed(2) })),
  lost: ES.map((e) => ({ e, wall: +lostOnWall(e).toFixed(1), grain: +lostOnGrain(e).toFixed(1) })),
  rows: rows.filter((r) => r.e === 0.6 || r.e === 0.45),
  satTime: +((Math.abs(wall(4.5, 0.5).J) / 44.48) * 1e6).toFixed(1),
  eFromHeights: +fromMeasured(MASS, Math.sqrt(2 * G * 0.50), WALL, 0, -Math.sqrt(2 * G * 0.18), 0).e.toFixed(3),
}, null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'heights', figure(fig1, 'Figure 1. What the paper\'s velocity range means on a bench. The solid line is the free-fall height needed for each impact velocity; the other two are the height the grain returns to at the two ends of the paper\'s restitution range. The shaded band is the velocity a 10 to 30 cm drop can reach, the range used by the earlier rigs the paper cites.'));
  md = inject(md, 'energy', figure(fig2, 'Figure 2. The same restitution coefficient destroys a different share of the kinetic energy depending on what the grain hits: 1 − e² against a heavy plate, but only half of that against an identical grain at rest. Marked points are the corners of the paper\'s measured range.'));
  md = inject(md, 'force', figure(fig3, 'Figure 3. The impulse of the impact divided by the contact time gives the mean force the plate and its sensor must take. The paper\'s 44.48 N sensor range is reached only if contact lasts a few microseconds; tens of microseconds keep the measurement comfortably in range, which is also why 1 MHz sampling is needed.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2, fig3].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
