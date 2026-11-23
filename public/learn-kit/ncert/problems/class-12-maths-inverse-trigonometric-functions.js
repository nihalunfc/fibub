// Class 12 Maths, Inverse Trigonometric Functions: live problems (original fibub questions). Ids start with c12m-itrig-. Answers in degrees.
import { pick, choose, n, steps } from './_util.js';

const D = 180 / Math.PI, deg = (v) => v * D;
export default {
  'c12m-itrig-sinsin': {
    title: 'sin⁻¹(sin x) for an angle outside the range',
    make(r) {
      const x = choose(r, [100, 120, 135, 150, 170, 200, 225, 240, 260]), answer = 180 - x;
      return { x, q: `<p>Find the value of sin⁻¹( sin ${x}° ) in degrees (principal value).</p>`, answer, unit: '°', tol: 0, abs: 0.01,
        hint: 'The answer must lie between −90° and 90°. For x between 90° and 270°, use 180° − x.',
        solution: steps(`${x}° is outside [−90°, 90°].`, `sin ${x}° = sin(180° − ${x}°) = sin(${180 - x}°), and ${180 - x}° is inside the principal range.`, `So the answer is <b>${answer}°</b>.`) };
    },
    verify(x) { return deg(Math.asin(Math.sin((x.x * Math.PI) / 180))); },
  },
  'c12m-itrig-coscos': {
    title: 'cos⁻¹(cos x) for an angle outside the range',
    make(r) {
      const x = choose(r, [190, 210, 225, 240, 270, 300, 315, 330, 350]), answer = 360 - x;
      return { x, q: `<p>Find the value of cos⁻¹( cos ${x}° ) in degrees (principal value).</p>`, answer, unit: '°', tol: 0, abs: 0.01,
        hint: 'The answer must lie between 0° and 180°. For x between 180° and 360°, use 360° − x.',
        solution: steps(`${x}° is outside [0°, 180°].`, `cos ${x}° = cos(360° − ${x}°) = cos(${360 - x}°), and ${360 - x}° is inside the principal range.`, `So the answer is <b>${answer}°</b>.`) };
    },
    verify(x) { return deg(Math.acos(Math.cos((x.x * Math.PI) / 180))); },
  },
  'c12m-itrig-tansum': {
    title: 'adding two inverse tangents',
    make(r) {
      const [p, q] = choose(r, [[2, 3], [3, 4], [4, 5], [5, 6], [3, 5], [2, 5]]), x = 1 / p, y = 1 / q, answer = deg(Math.atan((x + y) / (1 - x * y)));
      return { p, qd: q, q: `<p>Find tan⁻¹(1/${p}) + tan⁻¹(1/${q}) in degrees.</p>`, answer, unit: '°', tol: 0.002,
        hint: 'Use tan⁻¹x + tan⁻¹y = tan⁻¹((x + y)/(1 − xy)), valid because xy < 1.',
        solution: steps(`x = 1/${p}, y = 1/${q}, xy = 1/${p * q} < 1.`, `(x + y)/(1 − xy) = ${p + q}/${p * q - 1}.`, `Answer = tan⁻¹(${n((p + q) / (p * q - 1), 5)}) ≈ <b>${n(answer, 5)}°</b>.`) };
    },
    verify(x) { return deg(Math.atan(1 / x.p) + Math.atan(1 / x.qd)); },
  },
  'c12m-itrig-compl': {
    title: 'using sin⁻¹x + cos⁻¹x = 90°',
    make(r) {
      const t = choose(r, [10, 20, 25, 30, 35, 40, 50, 55, 60, 65, 70]), answer = 90 - t;
      return { t, q: `<p>If sin⁻¹x = ${t}°, find cos⁻¹x in degrees.</p>`, answer, unit: '°', tol: 0, abs: 0.01,
        hint: 'sin⁻¹x + cos⁻¹x = 90° for every x in [−1, 1].',
        solution: steps('sin⁻¹x + cos⁻¹x = 90°.', `cos⁻¹x = 90° − ${t}° = <b>${answer}°</b>.`) };
    },
    verify(x) { const v = Math.sin((x.t * Math.PI) / 180); return deg(Math.acos(v)); },
  },
  'c12m-itrig-double': {
    title: 'double angle in inverse tangent',
    make(r) {
      const x = choose(r, [0.2, 0.25, 0.4, 0.5, 0.6, 0.75]), answer = deg(Math.asin((2 * x) / (1 + x * x)));
      return { x, q: `<p>Find sin⁻¹( 2x/(1 + x²) ) for x = ${x}, in degrees.</p>`, answer, unit: '°', tol: 0.002,
        hint: 'For |x| ≤ 1, sin⁻¹(2x/(1 + x²)) = 2 tan⁻¹x.',
        solution: steps(`|x| = ${x} ≤ 1, so the result is 2 tan⁻¹(${x}).`, `tan⁻¹(${x}) ≈ ${n(deg(Math.atan(x)), 5)}°.`, `Answer ≈ <b>${n(answer, 5)}°</b>.`) };
    },
    verify(x) { return 2 * deg(Math.atan(x.x)); },
  },
  'c12m-itrig-cossin': {
    title: 'cos(sin⁻¹ x) from a triangle',
    make(r) {
      const [a, b, c] = choose(r, [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29]]), answer = b / c;
      return { a, b, c, q: `<p>Find cos( sin⁻¹(${a}/${c}) ) as a decimal.</p>`, answer, unit: '', tol: 0.002,
        hint: 'Let θ = sin⁻¹(a/c): draw a right triangle with opposite side a and hypotenuse c, find the third side.',
        solution: steps(`θ = sin⁻¹(${a}/${c}), so the opposite side is ${a} and the hypotenuse ${c}.`, `Adjacent = √(${c}² − ${a}²) = ${b}.`, `cos θ = ${b}/${c} = <b>${n(answer, 5)}</b>.`) };
    },
    verify(x) { return Math.cos(Math.asin(x.a / x.c)); },
  },
};
