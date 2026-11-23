// Class 12 Maths, Chapter 8 Application of Integrals: live problems (original fibub questions). Ids start with c12m-aoi-.
import { pick, choose, n, steps } from './_util.js';

const simpson = (f, a, b, N = 4000) => { const h = (b - a) / N; let s = f(a) + f(b); for (let i = 1; i < N; i++) s += f(a + i * h) * (i % 2 ? 4 : 2); return s * h / 3; };

export default {
  'c12m-aoi-under': {
    title: 'area under a parabola',
    make(r) {
      const p = pick(r, 1, 4), c = pick(r, 0, 5), a = pick(r, 0, 2), b = a + pick(r, 1, 3), F = (x) => p * x ** 3 / 3 + c * x, answer = F(b) - F(a);
      return { p, c, a, b, q: `<p>Find the area bounded by y = ${p}x<sup>2</sup> + ${c}, the x-axis and the lines x = ${a} and x = ${b} (square units).</p>`, answer, unit: 'sq. units', tol: 0.005, abs: 0.005,
        hint: 'The curve is above the x-axis on this range, so the area is the integral of y dx from a to b.',
        solution: steps(`A = ∫ from ${a} to ${b} of (${p}x² + ${c}) dx.`, `= [${p}x³/3 + ${c}x] from ${a} to ${b} = ${n(F(b))} − ${n(F(a))}.`, `A = <b>${n(answer)}</b> square units.`) };
    },
    verify: (x) => simpson((t) => x.p * t * t + x.c, x.a, x.b),
  },
  'c12m-aoi-between': {
    title: 'area between a parabola and a line',
    make(r) {
      const m = pick(r, 2, 8), answer = m ** 3 / 6;
      return { m, q: `<p>Find the area of the region enclosed by the parabola y = x² and the line y = ${m}x.</p>`, answer, unit: 'sq. units', tol: 0.005, abs: 0.005,
        hint: 'Solve x² = mx for the limits, then integrate (top − bottom). On 0 to m the line is above the parabola.',
        solution: steps(`x² = ${m}x gives x = 0 and x = ${m}.`, `On [0, ${m}] the line is on top: A = ∫ from 0 to ${m} of (${m}x − x²) dx = [${m}x²/2 − x³/3] from 0 to ${m}.`, `= ${m}·${m}²/2 − ${m}³/3 = ${m}³/6 = <b>${n(answer)}</b>.`) };
    },
    verify: (x) => simpson((t) => Math.abs(x.m * t - t * t), 0, x.m),
  },
  'c12m-aoi-ellipse': {
    title: 'area of an ellipse',
    make(r) {
      const a = pick(r, 2, 9), b = pick(r, 2, 9), answer = Math.PI * a * b;
      return { a, b, q: `<p>Find the area enclosed by the ellipse x²/${a * a} + y²/${b * b} = 1. (Use π = 3.1416.)</p>`, answer, unit: 'sq. units', tol: 0.005, abs: 0.005,
        hint: 'The area of x²/a² + y²/b² = 1 is πab; here a and b are the square roots of the denominators.',
        solution: steps(`a² = ${a * a} so a = ${a}, and b² = ${b * b} so b = ${b}.`, `Area = 4 ∫ from 0 to a of (b/a)√(a² − x²) dx = πab.`, `= π × ${a} × ${b} = <b>${n(answer)}</b> square units.`) };
    },
    verify: (x) => 4 * simpson((t) => (x.b / x.a) * Math.sqrt(Math.max(0, x.a * x.a - t * t)), 0, x.a, 20000),
  },
  'c12m-aoi-axis': {
    title: 'area between a curve and the x-axis (sign)',
    make(r) {
      const c = pick(r, 1, 5), answer = 4 * c ** 3 / 3;
      return { c, q: `<p>Find the total area between the curve y = x² − ${c * c} and the x-axis (between its two x-intercepts).</p>`, answer, unit: 'sq. units', tol: 0.005, abs: 0.005,
        hint: 'The curve dips below the x-axis between −' + c + ' and ' + c + ', so ∫ y dx is negative. The area is its absolute value.',
        solution: steps(`The intercepts are x = ±${c}. Between them y ≤ 0.`, `∫ from −${c} to ${c} of (x² − ${c * c}) dx = 2[x³/3 − ${c * c}x] from 0 to ${c} = 2(${c}³/3 − ${c}³) = −${n(answer)}.`, `Area is positive: <b>${n(answer)}</b> square units.`) };
    },
    verify: (x) => simpson((t) => Math.abs(t * t - x.c * x.c), -x.c, x.c),
  },
  'c12m-aoi-latus': {
    title: 'area cut off from a parabola',
    make(r) {
      const a = choose(r, [1, 2, 3, 4, 5]), h = choose(r, [1, 4, 9]), answer = (8 / 3) * Math.sqrt(a) * h ** 1.5;
      return { a, h, q: `<p>Find the area bounded by the parabola y² = ${4 * a}x and the line x = ${h}.</p>`, answer, unit: 'sq. units', tol: 0.005, abs: 0.005,
        hint: 'The region is symmetric about the x-axis: double the area of the upper half, where y = 2√(a x).',
        solution: steps(`y² = ${4 * a}x gives y = ±2√(${a}x). The area is symmetric, so A = 2 ∫ from 0 to ${h} of 2√${a}·√x dx.`, `= 4√${a} · [2x^(3/2)/3] from 0 to ${h} = (8/3)√${a}·${h}^(3/2).`, `A = <b>${n(answer)}</b> square units.`) };
    },
    verify: (x) => 2 * simpson((t) => Math.sqrt(4 * x.a * Math.max(0, t)), 0, x.h, 20000),
  },
  'c12m-aoi-train': {
    title: 'distance from a speed graph',
    make(r) {
      const p = choose(r, [6, 8, 12]), T = choose(r, [2, 3, 4]), answer = p * T * T / 2 - T ** 3;
      return { p, T, q: `<p>A cricket ball's speed along a gully is v = ${p}t − 3t² m/s for 0 ≤ t ≤ ${T}. Use area under the speed-time graph to find the distance covered in ${T} s (metres).</p>`, answer, unit: 'm', tol: 0.005, abs: 0.005,
        hint: 'Distance = ∫ v dt from 0 to T, as long as v stays positive on that range.',
        solution: steps(`Distance = ∫ from 0 to ${T} of (${p}t − 3t²) dt = [${p / 2}t² − t³] from 0 to ${T}.`, `= ${p / 2}·${T * T} − ${T ** 3}.`, `= <b>${n(answer)} m</b>.`) };
    },
    verify: (x) => simpson((t) => x.p * t - 3 * t * t, 0, x.T),
  },
};
