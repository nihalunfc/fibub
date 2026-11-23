// Class 11 Physics, Work, Energy and Power: live problems (original fibub questions). Ids start with c11p-work-.
import { pick, choose, n, steps } from './_util.js';

export default {
  'c11p-work-wd': {
    title: 'work done by a force at an angle',
    make(r) {
      const F = pick(r, 20, 100, 10), d = pick(r, 2, 20, 2), th = choose(r, [30, 37, 45, 53, 60]), W = F * d * Math.cos(th * Math.PI / 180);
      return { F, d, th, q: `<p>A child pulls a toy cart with a rope that makes ${th}° with the ground, with a force of ${F} N, through ${d} m. How much work does the pull do?</p>`, answer: W, unit: 'J', tol: 0.01,
        hint: 'Only the component of the force along the ground does work: W = F d cos θ.',
        solution: steps(`W = F d cos θ = ${F} × ${d} × cos ${th}°.`, `cos ${th}° = ${n(Math.cos(th * Math.PI / 180))}, so W = <b>${n(W)} J</b>.`) };
    },
    verify: (x) => { const Fx = x.F * Math.cos(x.th * Math.PI / 180); return Fx * x.d; },
  },
  'c11p-work-ke': {
    title: 'work-energy theorem: speed after a push',
    make(r) {
      const m = pick(r, 2, 10, 2), u = pick(r, 0, 6, 2), F = pick(r, 10, 40, 10), d = pick(r, 2, 10, 2), v = Math.sqrt(u * u + 2 * F * d / m);
      return { m, u, F, d, q: `<p>A ${m} kg block moving at ${u} m/s on a smooth floor is pushed by a constant ${F} N force along its motion for ${d} m. Use the work-energy theorem to find its final speed.</p>`, answer: v, unit: 'm/s', tol: 0.01,
        hint: 'Work done = F d = change in ½mv².',
        solution: steps(`W = F d = ${F} × ${d} = ${F * d} J.`, `½ m v² = ½ m u² + W = ${n(0.5 * m * u * u)} + ${F * d} = ${n(0.5 * m * u * u + F * d)} J.`, `v = √(2 × ${n(0.5 * m * u * u + F * d)} / ${m}) = <b>${n(v)} m/s</b>.`) };
    },
    verify: (x) => { const a = x.F / x.m; return Math.sqrt(x.u * x.u + 2 * a * x.d); },
  },
  'c11p-work-height': {
    title: 'speed at the bottom of a slide',
    make(r) {
      const h = pick(r, 2, 20, 1), v = Math.sqrt(2 * 9.8 * h);
      return { h, q: `<p>A child slides from rest down a smooth water slide whose top is ${h} m above the bottom. Taking g = 9.8 m/s², find the speed at the bottom.</p>`, answer: v, unit: 'm/s', tol: 0.01,
        hint: 'Loss of potential energy m g h = gain of kinetic energy ½ m v². The mass cancels, and so does the shape of the slide.',
        solution: steps(`m g h = ½ m v² gives v² = 2 g h.`, `v = √(2 × 9.8 × ${h}) = <b>${n(v)} m/s</b>.`) };
    },
    verify: (x) => { const t = Math.sqrt(2 * x.h / 9.8); return 9.8 * t; },
  },
  'c11p-work-spring': {
    title: 'speed of a block released from a compressed spring',
    make(r) {
      const k = pick(r, 100, 500, 50), x = choose(r, [0.05, 0.1, 0.15, 0.2]), m = choose(r, [0.5, 1, 2]), v = x * Math.sqrt(k / m);
      return { k, x, m, q: `<p>A spring of constant ${k} N/m is compressed by ${x * 100} cm against a ${m} kg block on a smooth table and released. Find the speed of the block when the spring returns to its natural length.</p>`, answer: v, unit: 'm/s', tol: 0.01,
        hint: 'All the stored energy ½ k x² becomes kinetic energy ½ m v².',
        solution: steps(`U = ½ k x² = ½ × ${k} × ${x}² = ${n(0.5 * k * x * x)} J.`, `½ m v² = U gives v = √(2U/m) = √(${n(k * x * x)} / ${m}) = <b>${n(v)} m/s</b>.`) };
    },
    verify: (x) => Math.sqrt(2 * (0.5 * x.k * x.x * x.x) / x.m),
  },
  'c11p-work-power': {
    title: 'power of a pump',
    make(r) {
      const V = pick(r, 500, 3000, 500), H = pick(r, 5, 30, 5), t = pick(r, 10, 60, 10), P = V * 9.8 * H / (t * 60);
      return { V, H, t, q: `<p>A pump lifts ${V} litres of water (1 litre = 1 kg) to a tank ${H} m higher in ${t} minutes. What is the least power it must supply? (g = 9.8 m/s²)</p>`, answer: P, unit: 'W', tol: 0.01,
        hint: 'Work = m g h, power = work ÷ time (in seconds).',
        solution: steps(`W = m g h = ${V} × 9.8 × ${H} = ${n(V * 9.8 * H)} J.`, `P = W/t = ${n(V * 9.8 * H)} / ${t * 60} s = <b>${n(P)} W</b>.`) };
    },
    verify: (x) => (x.V * x.H * 9.8) / (x.t * 60),
  },
  'c11p-work-collide': {
    title: 'elastic collision: speed after impact',
    make(r) {
      const m1 = choose(r, [1, 2, 3, 4]), m2 = choose(r, [1, 2, 5, 6]), u = pick(r, 2, 10, 1), v2 = 2 * m1 * u / (m1 + m2);
      return { m1, m2, u, q: `<p>A ${m1} kg ball moving at ${u} m/s makes a head-on elastic collision with a ${m2} kg ball at rest. Find the speed of the ${m2} kg ball just after the collision.</p>`, answer: v2, unit: 'm/s', tol: 0.01,
        hint: 'For an elastic collision with the second body at rest: v₂ = 2 m₁ u / (m₁ + m₂).',
        solution: steps(`Momentum and energy conservation give v₂ = 2 m₁ u₁ /(m₁ + m₂) when u₂ = 0.`, `v₂ = 2 × ${m1} × ${u} / (${m1} + ${m2}) = <b>${n(v2)} m/s</b>.`) };
    },
    verify: (x) => { const v1 = (x.m1 - x.m2) * x.u / (x.m1 + x.m2); return (x.m1 * (x.u - v1)) / x.m2; },
  },
};
