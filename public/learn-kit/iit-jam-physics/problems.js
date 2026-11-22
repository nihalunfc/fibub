// Live problems for IIT JAM Physics lessons (lesson kit). Each make(rand) returns { q, answer, unit, tol (relative),
// abs?, hint, solution } as HTML; verify(p) works the answer out another way for tests/exam-physics.mjs.
// Placed in a lesson as <div class="problem" data-problem="id"></div>. Exam-style practice uses the question bank instead.
const int = (r, a, b) => a + Math.floor(r() * (b - a + 1));
const steps = (...ls) => '<ol>' + ls.map((l) => `<li>${l}</li>`).join('') + '</ol>';

export default {
  'div-at-point': {
    title: 'divergence at a point',
    make(r) {
      const a = int(r, 1, 5), b = int(r, 1, 5), x = int(r, -3, 3), y = int(r, -3, 3), z = int(r, 1, 3);
      const answer = 2 * a * x + b * z;
      return {
        q: `<p>Find the divergence of <b>F</b> = ${a}x² <b>i</b> + ${b}yz <b>j</b> + 0 <b>k</b> at the point (${x}, ${y}, ${z}).</p>`,
        answer, unit: '', tol: 0, abs: 1e-9,
        hint: 'Differentiate each component by its own coordinate only: F<sub>x</sub> by x, F<sub>y</sub> by y, F<sub>z</sub> by z, then add.',
        solution: steps(`∂(${a}x²)/∂x = ${2 * a}x = ${2 * a * x}.`, `∂(${b}yz)/∂y = ${b}z = ${b * z}.`, `∂(0)/∂z = 0.`, `Divergence = ${2 * a * x} + ${b * z} = <b>${answer}</b>.`),
        a, b, x, z,
      };
    },
    verify: (p) => 2 * p.a * p.x + p.b * p.z,
  },
  'atwood-machine': {
    title: 'an Atwood machine',
    make(r) {
      const m1 = int(r, 1, 6), m2 = m1 + int(r, 1, 5);
      const a = (m2 - m1) * 9.8 / (m1 + m2), T = 2 * m1 * m2 * 9.8 / (m1 + m2);
      return {
        q: `<p>Blocks of ${m1} kg and ${m2} kg hang at the ends of a light string over a smooth, light pulley. Find the tension in the string (g = 9.8 m/s²).</p>`,
        answer: T, unit: 'N', tol: 0.01,
        hint: 'Write F = ma for each block separately, with the same acceleration a and the same tension T, then solve the two equations.',
        solution: steps(`Heavier block (down): ${m2}g − T = ${m2}a. Lighter block (up): T − ${m1}g = ${m1}a.`, `Add them: (${m2} − ${m1})g = ${m1 + m2}a, so a = ${(+a.toFixed(3))} m/s².`, `T = ${m1}(g + a) = ${m1}(9.8 + ${(+a.toFixed(3))}) = <b>${(+T.toFixed(2))} N</b>. Check: 2m₁m₂g/(m₁ + m₂) gives the same.`),
        m1, m2,
      };
    },
    verify: (p) => 2 * p.m1 * p.m2 * 9.8 / (p.m1 + p.m2),
  },
  'elastic-collision': {
    title: 'a head-on elastic collision',
    make(r) {
      const m1 = int(r, 1, 6), m2 = int(r, 1, 6) + (r() < 0.5 ? 0 : 3), u = int(r, 2, 12);
      const v1 = (m1 - m2) * u / (m1 + m2), v2 = 2 * m1 * u / (m1 + m2);
      return {
        q: `<p>A ${m1} kg ball moving at ${u} m/s hits a ${m2} kg ball at rest, head-on and elastically. Find the velocity of the ${m1} kg ball afterwards (m/s, positive in the original direction).</p>`,
        answer: v1, unit: 'm/s', tol: 0.01, abs: 0.005,
        hint: 'Use v₁ = (m₁ − m₂)u/(m₁ + m₂). A negative answer means the ball bounces back.',
        solution: steps(`Momentum and kinetic energy are both kept. Solving the two equations gives v₁ = (m₁ − m₂)u/(m₁ + m₂) and v₂ = 2m₁u/(m₁ + m₂).`, `v₁ = (${m1} − ${m2})×${u}/${m1 + m2} = <b>${(+v1.toFixed(3))} m/s</b>.`, `Check: v₂ = ${(+v2.toFixed(3))} m/s, and v₂ − v₁ = ${(+(v2 - v1).toFixed(3))} = u, so the balls separate as fast as they met.`),
        m1, m2, u,
      };
    },
    verify: (p) => (p.m1 - p.m2) * p.u / (p.m1 + p.m2),
  },
  'orbit-period': {
    title: 'Kepler\'s third law',
    make(r) {
      const rp = +(0.3 + r() * 2).toFixed(1), ra = +(rp + 0.5 + r() * 20).toFixed(1), M = [0.5, 1, 2][int(r, 0, 2)];
      const a = (rp + ra) / 2, T = Math.sqrt(a ** 3 / M);
      return {
        q: `<p>A comet orbits a star of ${M} solar mass${M === 1 ? '' : 'es'}. Its closest distance is ${rp} AU and its farthest ${ra} AU. Find its period in years.</p>`,
        answer: T, unit: 'years', tol: 0.01,
        hint: 'The semi-major axis is half the sum of the closest and farthest distances. In years, AU and solar masses, T² = a³/M.',
        solution: steps(`a = (${rp} + ${ra})/2 = ${(+a.toFixed(3))} AU.`, `T² = a³/M = ${(+(a ** 3).toFixed(2))}/${M}.`, `T = <b>${(+T.toFixed(2))} years</b>.`),
        a, M,
      };
    },
    verify: (p) => Math.sqrt(p.a ** 3 / p.M),
  },
  'parallel-axis-disc': {
    title: 'the parallel axis theorem',
    make(r) {
      const M = int(r, 1, 12), R = +(0.1 + int(r, 1, 9) * 0.1).toFixed(1), f = [0.25, 0.5, 0.75, 1][int(r, 0, 3)];
      const d = +(f * R).toFixed(3), I = 0.5 * M * R * R + M * d * d;
      return {
        q: `<p>A uniform disc of mass ${M} kg and radius ${R} m turns about an axis perpendicular to the disc through a point ${d} m from its centre. Find its moment of inertia in kg m².</p>`,
        answer: I, unit: 'kg m²', tol: 0.005,
        hint: 'Start from the centre-of-mass value ½MR² and add Md².',
        solution: steps(`I<sub>cm</sub> = ½MR² = ½×${M}×${R}² = ${(+(0.5 * M * R * R).toFixed(4))} kg m².`, `Md² = ${M}×${d}² = ${(+(M * d * d).toFixed(4))} kg m².`, `I = <b>${(+I.toFixed(4))} kg m²</b>.`),
        M, R, d,
      };
    },
    verify: (p) => 0.5 * p.M * p.R ** 2 + p.M * p.d ** 2,
  },
};
