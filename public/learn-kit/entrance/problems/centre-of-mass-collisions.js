// Live problems for Centre of mass, momentum and collisions.
const pick = (r, min, max, step = 1) => +(min + Math.floor(r() * ((max - min) / step + 1 - 1e-9)) * step).toFixed(6);
const n = (v, d = 3) => (+(+v).toPrecision(d)).toLocaleString('en-IN', { maximumFractionDigits: 6 });
const steps = (...ls) => '<ol>' + ls.map((l) => `<li>${l}</li>`).join('') + '</ol>';
const G = 9.8;

export default {
  'com-elastic': {
    title: 'velocity after a one-dimensional elastic collision',
    make(r) {
      const m1 = pick(r, 1, 6, 0.5), m2 = pick(r, 1, 6, 0.5), u = pick(r, 2, 10, 1);
      const answer = (2 * m1 * u) / (m1 + m2);
      return { m1, m2, u,
        q: `<p>A ${m1} kg ball moving at ${u} m/s hits a ${m2} kg ball at rest head-on. The collision is perfectly elastic. With what speed does the ${m2} kg ball move off?</p>`,
        answer, unit: 'm/s', tol: 0.01,
        hint: 'Use momentum conservation and e = 1 (speed of separation = speed of approach). For a target at rest, v₂ = 2m₁u/(m₁ + m₂).',
        solution: steps(`Momentum: ${m1} × ${u} = ${m1}v₁ + ${m2}v₂.`, `Elastic: v₂ − v₁ = ${u}.`, `Solving: v₂ = 2 × ${m1} × ${u} / (${m1} + ${m2}) = <b>${n(answer)} m/s</b>; v₁ = ${n(((m1 - m2) * u) / (m1 + m2))} m/s.`) };
    },
    verify: (x) => { // in the centre-of-mass frame each velocity simply reverses
      const vcm = (x.m1 * x.u) / (x.m1 + x.m2); return vcm + (vcm - 0);
    },
  },
  'com-bounce': {
    title: 'height after bounces with a coefficient of restitution',
    make(r) {
      const h = pick(r, 2, 20, 1), e = pick(r, 0.5, 0.9, 0.05), k = pick(r, 1, 3);
      const answer = h * e ** (2 * k);
      return { h, e, k,
        q: `<p>A ball is dropped from ${h} m onto a hard floor. The coefficient of restitution is ${e}. How high does it rise after the ${['', 'first', 'second', 'third'][k]} bounce?</p>`,
        answer, unit: 'm', tol: 0.01,
        hint: 'Each bounce multiplies the speed by e. Height goes as speed squared, so each bounce multiplies the height by e².',
        solution: steps(`After one bounce the speed is e times the landing speed, so the height is e²h.`, `After ${k} bounce${k > 1 ? 's' : ''}: h<sub>${k}</sub> = h e<sup>${2 * k}</sup> = ${h} × ${e}<sup>${2 * k}</sup>.`, `h<sub>${k}</sub> = <b>${n(answer)} m</b>.`) };
    },
    verify: (x) => { let v = Math.sqrt(2 * G * x.h); for (let i = 0; i < x.k; i++) v *= x.e; return (v * v) / (2 * G); },
  },
  'com-disc-hole': {
    title: 'centre of mass of a disc with a hole cut out',
    make(r) {
      const R = pick(r, 10, 30, 2), f = [2, 3, 4][Math.floor(r() * 3)], a = R / f, d = R - a;
      const answer = (a * a * d) / (R * R - a * a);
      return { R, a, d,
        q: `<p>A uniform disc of radius ${R} cm has a circular hole of radius ${n(a)} cm cut out. The hole touches the rim, so its centre is ${n(d)} cm from the disc's centre. How far from the disc's centre is the centre of mass of the remaining plate?</p>`,
        answer, unit: 'cm', tol: 0.01,
        hint: 'Treat the hole as a negative mass. Mass goes as area: the full disc (centre at 0) minus the small disc (centre at d).',
        solution: steps(`Areas: full disc πR² = π × ${R * R}, hole πa² = π × ${n(a * a)}.`, `x<sub>cm</sub> = (πR² × 0 − πa² × d)/(πR² − πa²) = −${n(a * a)} × ${n(d)}/(${R * R} − ${n(a * a)}).`, `Distance = <b>${n(answer)} cm</b>, on the side away from the hole.`) };
    },
    verify: (x) => { // the full disc's centre (0) = weighted mean of plate and hole: 0 = (A_p · (−X) + A_h · d)/A
      const Ah = x.a * x.a, Ap = x.R * x.R - Ah; return (Ah * x.d) / Ap;
    },
  },
};
