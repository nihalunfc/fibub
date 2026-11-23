// Class 11 Maths, Straight Lines: live problems (original fibub questions). Ids start with c11m-lines-.
import { pick, choose, n, steps } from './_util.js';

export default {
  'c11m-lines-slope': {
    title: 'slope through two points',
    make(r) {
      const x1 = pick(r, -4, 3), y1 = pick(r, -5, 5), dx = pick(r, 1, 5), dy = pick(r, -8, 8), x2 = x1 + dx, y2 = y1 + dy;
      return { x1, y1, x2, y2, q: `<p>Find the slope of the line through (${x1}, ${y1}) and (${x2}, ${y2}).</p>`, answer: dy / dx, unit: '', tol: 0.001, abs: 0.0001,
        hint: 'm = (y₂ − y₁)/(x₂ − x₁).',
        solution: steps(`m = (${y2} − ${y1}) / (${x2} − ${x1}) = ${dy} / ${dx}.`, `m = <b>${+(dy / dx).toFixed(4)}</b>.`) };
    },
    verify(x) { const rise = x.y2 - x.y1, run = x.x2 - x.x1; return rise * (1 / run); },
  },
  'c11m-lines-yint': {
    title: 'the y-intercept of a line',
    make(r) {
      const m = pick(r, -4, 4), x0 = pick(r, 1, 5), y0 = pick(r, -6, 6), answer = y0 - m * x0;
      return { m, x0, y0, q: `<p>A line has slope ${m} and passes through (${x0}, ${y0}). Where does it cut the y-axis? Give the y-coordinate of that point.</p>`, answer, unit: '', tol: 0, abs: 0.001,
        hint: 'Write y − y₁ = m(x − x₁) and put x = 0.',
        solution: steps(`y − ${y0} = ${m}(x − ${x0}).`, `Put x = 0: y = ${y0} − ${m * x0} = <b>${answer}</b>.`) };
    },
    verify(x) { let c = 0; for (let t = -60; t <= 60; t++) if (Math.abs(x.m * x.x0 + t - x.y0) < 1e-9) c = t; return c; },
  },
  'c11m-lines-distance': {
    title: 'distance from a point to a line',
    make(r) {
      const [A, B] = choose(r, [[3, 4], [5, 12], [6, 8], [8, 15], [4, 3]]), C = pick(r, -20, 20), x0 = pick(r, -6, 6), y0 = pick(r, -6, 6), N = A * x0 + B * y0 + C, h = Math.hypot(A, B);
      return { A, B, C, x0, y0, q: `<p>Find the perpendicular distance of the point (${x0}, ${y0}) from the line ${A}x + ${B}y ${C < 0 ? '−' : '+'} ${Math.abs(C)} = 0.</p>`, answer: Math.abs(N) / h, unit: '', tol: 0.001, abs: 0.0001,
        hint: 'd = |Ax₀ + By₀ + C| / √(A² + B²).',
        solution: steps(`Numerator: |${A}(${x0}) + ${B}(${y0}) ${C < 0 ? '−' : '+'} ${Math.abs(C)}| = ${Math.abs(N)}.`, `√(${A}² + ${B}²) = ${h}.`, `d = <b>${+(Math.abs(N) / h).toFixed(4)}</b>.`) };
    },
    verify(x) { const h2 = x.A * x.A + x.B * x.B, N = x.A * x.x0 + x.B * x.y0 + x.C, fx = x.x0 - x.A * N / h2, fy = x.y0 - x.B * N / h2; return Math.hypot(x.x0 - fx, x.y0 - fy); },
  },
  'c11m-lines-angle': {
    title: 'angle between two lines',
    make(r) {
      const [m1, m2] = choose(r, [[1, 0], [2, 0], [3, 1 / 2], [2, 1 / 3], [1, 2], [4, 1.5], [-1, 2]]), answer = Math.atan(Math.abs((m1 - m2) / (1 + m1 * m2))) * 180 / Math.PI;
      return { m1, m2, q: `<p>Find the acute angle (in degrees) between the lines with slopes ${m1} and ${m2}.</p>`, answer, unit: '°', tol: 0.005, abs: 0.01,
        hint: 'tan θ = |(m₁ − m₂)/(1 + m₁m₂)|.',
        solution: steps(`tan θ = |(${m1} − ${m2})/(1 + ${m1}×${m2})| = ${+Math.abs((m1 - m2) / (1 + m1 * m2)).toFixed(4)}.`, `θ = <b>${answer.toFixed(2)}°</b>.`) };
    },
    verify(x) { const a1 = Math.atan(x.m1), a2 = Math.atan(x.m2); let d = Math.abs(a1 - a2) * 180 / Math.PI; if (d > 90) d = 180 - d; return d; },
  },
  'c11m-lines-parallel': {
    title: 'distance between parallel lines',
    make(r) {
      const [A, B] = choose(r, [[3, 4], [5, 12], [6, 8], [8, 15]]), C1 = pick(r, -15, 15), C2 = C1 + pick(r, 3, 30);
      return { A, B, C1, C2, q: `<p>Find the distance between the parallel lines ${A}x + ${B}y ${C1 < 0 ? '−' : '+'} ${Math.abs(C1)} = 0 and ${A}x + ${B}y ${C2 < 0 ? '−' : '+'} ${Math.abs(C2)} = 0.</p>`, answer: (C2 - C1) / Math.hypot(A, B), unit: '', tol: 0.001, abs: 0.0001,
        hint: 'd = |C₁ − C₂| / √(A² + B²) when both lines have the same A and B.',
        solution: steps(`|C₁ − C₂| = ${C2 - C1}.`, `√(${A}² + ${B}²) = ${Math.hypot(A, B)}.`, `d = <b>${+((C2 - C1) / Math.hypot(A, B)).toFixed(4)}</b>.`) };
    },
    verify(x) { const p = [0, 0]; const pt = x.B !== 0 ? [0, -x.C1 / x.B] : [0, 0]; return Math.abs(x.A * pt[0] + x.B * pt[1] + x.C2) / Math.hypot(x.A, x.B); },
  },
};
