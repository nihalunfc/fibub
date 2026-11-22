// Class 9 Science, Chapter 6 How Forces Affect Motion: live problems (original fibub questions). Ids start with c9s-force-.
import { pick, choose, n, steps } from './_util.js';

export default {
  'c9s-force-net': {
    title: 'net force and acceleration of a pushed box',
    make(r) {
      const m = pick(r, 5, 40, 5), F1 = pick(r, 30, 120, 10), F2 = pick(r, 10, F1 - 10 > 10 ? F1 - 10 : 20, 10);
      const net = F1 - F2, answer = net / m;
      return { m, F1, F2, q: `<p>Two people push a ${m} kg trolley in opposite directions with forces of ${F1} N and ${F2} N. What is the acceleration of the trolley, in m/s²?</p>`, answer, unit: 'm/s²', tol: 0.01,
        hint: 'Find the net (unbalanced) force first: subtract the smaller force from the larger. Then a = F/m.',
        solution: steps(`Net force = ${F1} − ${F2} = ${net} N (towards the bigger push).`, `a = F/m = ${net} ÷ ${m} = <b>${n(answer)} m/s²</b>.`) };
    },
    verify: (x) => (Math.max(x.F1, x.F2) - Math.min(x.F1, x.F2)) / x.m,
  },
  'c9s-force-fma': {
    title: 'force needed for a given acceleration',
    make(r) {
      const m = pick(r, 2, 60, 2), a = pick(r, 1, 6, 0.5), answer = m * a;
      return { m, a, q: `<p>What force is needed to give a ${m} kg object an acceleration of ${n(a)} m/s²?</p>`, answer, unit: 'N', tol: 0.01,
        hint: 'Newton’s second law: F = ma.', solution: steps(`F = ma = ${m} × ${n(a)}.`, `F = <b>${n(answer)} N</b>.`) };
    },
    verify: (x) => x.m * x.a,
  },
  'c9s-force-weight': {
    title: 'weight from mass',
    make(r) {
      const m = pick(r, 20, 90, 5), world = choose(r, [['the Earth', 9.8], ['the Moon', 1.6]]), answer = m * world[1];
      return { m, g: world[1], q: `<p>A student has a mass of ${m} kg. What is her weight on ${world[0]}, where g = ${world[1]} m/s²? Give the answer in newtons.</p>`, answer, unit: 'N', tol: 0.01,
        hint: 'Weight is the force of gravity: W = mg. Mass stays the same everywhere; weight does not.', solution: steps(`W = mg = ${m} × ${world[1]}.`, `W = <b>${n(answer)} N</b> (her mass is still ${m} kg).`) };
    },
    verify: (x) => x.g * x.m,
  },
  'c9s-force-momentum': {
    title: 'momentum of a moving body',
    make(r) {
      const m = pick(r, 2, 80, 2), v = pick(r, 2, 30, 2), answer = m * v;
      return { m, v, q: `<p>Find the momentum of a ${m} kg body moving at ${v} m/s, in kg m/s.</p>`, answer, unit: 'kg m/s', tol: 0.01,
        hint: 'Momentum p = mass × velocity.', solution: steps(`p = mv = ${m} × ${v}.`, `p = <b>${n(answer)} kg m/s</b>.`) };
    },
    verify: (x) => x.m * x.v,
  },
  'c9s-force-impulse': {
    title: 'average force from change of momentum',
    make(r) {
      const m = pick(r, 0.1, 0.5, 0.1), v = pick(r, 10, 40, 5), t = choose(r, [0.01, 0.02, 0.05, 0.1]), answer = (m * v) / t;
      return { m, v, t, q: `<p>A ${n(m)} kg ball moving at ${v} m/s is caught and brought to rest in ${t} s. What average force do the hands exert on the ball, in newtons?</p>`, answer, unit: 'N', tol: 0.01,
        hint: 'Force = change in momentum ÷ time = m(v − u)/t. The final speed is 0.', solution: steps(`Change in momentum = m × (0 − ${v}) = ${n(m * v)} kg m/s (size).`, `F = Δp/t = ${n(m * v)} ÷ ${t} = <b>${n(answer)} N</b>.`) };
    },
    verify: (x) => { const a = x.v / x.t; return x.m * a; },
  },
  'c9s-force-recoil': {
    title: 'recoil speed of a gun',
    make(r) {
      const mb = pick(r, 10, 40, 5), vb = pick(r, 200, 800, 100), M = pick(r, 2, 8, 1), answer = (mb / 1000 * vb) / M;
      return { mb, vb, M, q: `<p>A ${mb} g bullet leaves a ${M} kg gun at ${vb} m/s. What is the recoil speed of the gun, in m/s? (Both are at rest before firing.)</p>`, answer, unit: 'm/s', tol: 0.01,
        hint: 'Total momentum stays zero: M × V = m × v. Change grams to kilograms first.',
        solution: steps(`m = ${mb} g = ${n(mb / 1000)} kg.`, `M V = m v, so V = ${n(mb / 1000)} × ${vb} ÷ ${M}.`, `V = <b>${n(answer)} m/s</b> (backwards).`) };
    },
    verify: (x) => (x.mb * 1e-3 * x.vb) / x.M,
  },
  'c9s-force-stick': {
    title: 'two bodies that stick together',
    make(r) {
      const m1 = pick(r, 2, 10, 1), u1 = pick(r, 2, 12, 1), m2 = pick(r, 2, 10, 1), answer = (m1 * u1) / (m1 + m2);
      return { m1, u1, m2, q: `<p>A ${m1} kg trolley moving at ${u1} m/s collides with a ${m2} kg trolley at rest. They stick together. What is their common speed after the collision, in m/s?</p>`, answer, unit: 'm/s', tol: 0.01,
        hint: 'Momentum before = momentum after: m₁u₁ + 0 = (m₁ + m₂)v.',
        solution: steps(`Momentum before = ${m1} × ${u1} = ${n(m1 * u1)} kg m/s.`, `After: (${m1} + ${m2}) × v = ${m1 + m2} v.`, `v = ${n(m1 * u1)} ÷ ${m1 + m2} = <b>${n(answer)} m/s</b>.`) };
    },
    verify: (x) => x.u1 / (1 + x.m2 / x.m1),
  },
};
