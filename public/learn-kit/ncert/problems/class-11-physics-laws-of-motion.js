// Class 11 Physics, Laws of Motion: live problems (original fibub questions). Ids start with c11p-laws-.
import { pick, choose, n, steps } from './_util.js';

export default {
  'c11p-laws-fma': {
    title: 'force needed to accelerate a car',
    make(r) {
      const m = choose(r, [800, 1000, 1200, 1500]), kmh = choose(r, [36, 54, 72, 90]), t = choose(r, [5, 8, 10, 12]), a = kmh / 3.6 / t, F = m * a;
      return { m, kmh, t, q: `<p>A ${m} kg car starts from rest and reaches ${kmh} km/h in ${t} s with a steady acceleration. What net force acts on it?</p>`, answer: F, unit: 'N', tol: 0.01,
        hint: 'Convert to m/s. a = Δv/Δt, then F = ma.',
        solution: steps(`v = ${kmh}/3.6 = ${n(kmh / 3.6, 4)} m/s, so a = ${n(kmh / 3.6, 4)}/${t} = ${n(a, 4)} m/s².`, `F = ma = ${m} × ${n(a, 4)} = <b>${n(F)} N</b>.`) };
    },
    verify: (x) => (x.m * (x.kmh * 1000 / 3600)) / x.t,
  },
  'c11p-laws-impulse': {
    title: 'force of catching a cricket ball',
    make(r) {
      const m = choose(r, [0.15, 0.16, 0.17]), v = choose(r, [20, 25, 30, 36, 40]), t = choose(r, [0.01, 0.02, 0.05, 0.1]), F = (m * v) / t;
      return { m, v, t, q: `<p>A fielder catches a ${m} kg cricket ball travelling at ${v} m/s and brings it to rest in ${t} s. Find the average force the ball exerts on the hands.</p>`, answer: F, unit: 'N', tol: 0.01,
        hint: 'Impulse = change of momentum: F × t = m v.',
        solution: steps(`Change of momentum = ${m} × ${v} = ${n(m * v)} kg m/s.`, `F = ${n(m * v)}/${t} = <b>${n(F)} N</b>. Pulling the hands back (longer t) lowers the force.`) };
    },
    verify: (x) => { const a = x.v / x.t; return x.m * a; },
  },
  'c11p-laws-pulley': {
    title: 'string tension in a table-and-hanging-block system',
    make(r) {
      const m1 = pick(r, 2, 8, 1), m2 = pick(r, 1, 6, 1), g = 10, a = (m2 * g) / (m1 + m2), T = m1 * a;
      return { m1, m2, q: `<p>A ${m1} kg block on a smooth table is tied by a light string over a smooth pulley to a ${m2} kg block hanging over the edge. Taking g = 10 m/s², find the tension in the string.</p>`, answer: T, unit: 'N', tol: 0.01,
        hint: 'For the table block T = m₁a; for the hanging block m₂g − T = m₂a. Add them to find a first.',
        solution: steps(`a = m₂g/(m₁ + m₂) = ${m2 * g}/${m1 + m2} = ${n(a, 4)} m/s².`, `T = m₁a = ${m1} × ${n(a, 4)} = <b>${n(T)} N</b>.`) };
    },
    verify: (x) => x.m2 * (10 - (x.m2 * 10) / (x.m1 + x.m2)),
  },
  'c11p-laws-incline': {
    title: 'acceleration down a rough slope',
    make(r) {
      const th = choose(r, [30, 37, 45, 53, 60]), mu = choose(r, [0.1, 0.2, 0.3]), m = pick(r, 2, 10, 2), g = 9.8, a = g * (Math.sin(th * Math.PI / 180) - mu * Math.cos(th * Math.PI / 180));
      return { th, mu, m, q: `<p>A ${m} kg block slides down a rough slope inclined at ${th}° to the horizontal. The coefficient of kinetic friction is ${mu}. Find its acceleration (g = 9.8 m/s²).</p>`, answer: a, unit: 'm/s²', tol: 0.01,
        hint: 'Along the slope: m g sinθ − μ N = m a with N = m g cosθ. Mass cancels.',
        solution: steps(`N = ${m} × 9.8 × cos ${th}° = ${n(m * g * Math.cos(th * Math.PI / 180))} N.`, `m g sinθ − μN = ${n(m * g * Math.sin(th * Math.PI / 180))} − ${n(mu * m * g * Math.cos(th * Math.PI / 180))}.`, `a = (that)/${m} = <b>${n(a)} m/s²</b>.`) };
    },
    verify: (x) => { const t = x.th * Math.PI / 180, F = x.m * 9.8 * Math.sin(t) - x.mu * x.m * 9.8 * Math.cos(t); return F / x.m; },
  },
  'c11p-laws-recoil': {
    title: 'recoil speed of a gun',
    make(r) {
      const M = choose(r, [2, 3, 4, 5]), mb = choose(r, [0.01, 0.02, 0.05]), v = choose(r, [300, 400, 500, 600]), V = (mb * v) / M;
      return { M, mb, v, q: `<p>A ${M} kg rifle fires a ${mb * 1000} g bullet at ${v} m/s. Find the recoil speed of the rifle (it was free to move).</p>`, answer: V, unit: 'm/s', tol: 0.01,
        hint: 'Total momentum is zero before and after: M V = m v.',
        solution: steps(`${mb} × ${v} = ${n(mb * v)} kg m/s for the bullet.`, `The rifle gets the same momentum backwards: V = ${n(mb * v)}/${M} = <b>${n(V)} m/s</b>.`) };
    },
    verify: (x) => Math.abs(0 - x.mb * x.v) / x.M,
  },
  'c11p-laws-lift': {
    title: 'weighing scale reading in a lift',
    make(r) {
      const m = pick(r, 40, 80, 10), a = choose(r, [1, 1.5, 2, 2.5]), up = choose(r, [1, -1]), g = 10, N = m * (g + up * a);
      return { m, a, up, q: `<p>A ${m} kg person stands on a spring balance in a lift that is accelerating ${up > 0 ? 'upward' : 'downward'} at ${a} m/s². Taking g = 10 m/s², what force (in newtons) does the balance read?</p>`, answer: N, unit: 'N', tol: 0.01,
        hint: 'Take upward positive: N − mg = m(±a). The balance reads the normal force N.',
        solution: steps(`${up > 0 ? 'Up' : 'Down'}ward acceleration: N ${up > 0 ? '−' : '−'} mg = m × (${up > 0 ? '+' : '−'}${a}).`, `N = m(g ${up > 0 ? '+' : '−'} a) = ${m} × ${g + up * a} = <b>${n(N)} N</b>.`) };
    },
    verify: (x) => x.up > 0 ? x.m * 10 + x.m * x.a : x.m * 10 - x.m * x.a,
  },
  'c11p-laws-curve': {
    title: 'fastest safe speed on a flat bend',
    make(r) {
      const R = choose(r, [30, 50, 80, 100, 150]), mu = choose(r, [0.3, 0.5, 0.7]), g = 9.8, v = Math.sqrt(mu * R * g) * 3.6;
      return { R, mu, q: `<p>A flat circular bend of radius ${R} m has a coefficient of static friction ${mu} between tyres and road. What is the greatest speed, in km/h, at which a car can go round it without skidding (g = 9.8 m/s²)?</p>`, answer: v, unit: 'km/h', tol: 0.01,
        hint: 'Friction supplies the centripetal force: μ m g = m v²/R.',
        solution: steps(`v² = μ R g = ${mu} × ${R} × 9.8 = ${n(mu * R * g, 5)}.`, `v = ${n(Math.sqrt(mu * R * g), 4)} m/s = <b>${n(v)} km/h</b>.`) };
    },
    verify: (x) => { let v = 0; while (v * v / x.R < x.mu * 9.8) v += 1e-4; return v * 3.6; },
  },
};
