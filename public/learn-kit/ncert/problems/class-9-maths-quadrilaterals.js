// Class 9 Maths, Quadrilaterals: live problems (original fibub questions). Ids start with c9m-quad-.
import { pick, choose, n, steps } from './_util.js';

const HALF = [[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17], [7, 24, 25]];
export default {
  'c9m-quad-angle': {
    title: 'angles of a parallelogram',
    make(r) {
      const a = pick(r, 40, 80, 2);
      return { a, q: `<p>One angle of a parallelogram is <b>${a}°</b>. Find the size of the angle next to it (an adjacent angle).</p>`, answer: 180 - a, unit: '°', tol: 0.002,
        hint: 'Neighbouring angles of a parallelogram are co-interior angles between parallel lines, so they add up to 180°.',
        solution: steps('Adjacent angles of a parallelogram add up to 180°.', `The other angle = 180° − ${a}° = <b>${180 - a}°</b>.`, `Check: the four angles are ${a}°, ${180 - a}°, ${a}°, ${180 - a}°, and they add up to 360°.`) };
    },
    verify(x) { return (360 - 2 * x.a) / 2; },
  },
  'c9m-quad-alg': {
    title: 'opposite angles with x',
    make(r) {
      const x = pick(r, 10, 30), p = pick(r, 2, 4), q = p + pick(r, 1, 3), a = pick(r, 4, 9), b = (q - p) * x - a;
      return { p, qq: q, a, b, q: `<p>In a parallelogram two opposite angles are <b>(${p}x + ${a})°</b> and <b>(${q}x − ${b})°</b>. Find the value of x.</p>`, answer: x, unit: '', tol: 0.002,
        hint: 'Opposite angles of a parallelogram are equal. Put the two expressions equal and solve.',
        solution: steps(`${p}x + ${a} = ${q}x − ${b}.`, `${a} + ${b} = ${q}x − ${p}x = ${q - p}x.`, `x = ${a + b} ÷ ${q - p} = <b>${x}</b>. Each of those angles is ${p * x + a}°.`) };
    },
    verify(x) { return (x.a + x.b) / (x.qq - x.p); },
  },
  'c9m-quad-rhombus': {
    title: 'side of a rhombus from its diagonals',
    make(r) {
      const [u, v, w] = choose(r, HALF), k = choose(r, [1, 2, 3]), d1 = 2 * u * k, d2 = 2 * v * k;
      return { d1, d2, q: `<p>The diagonals of a rhombus are <b>${d1} cm</b> and <b>${d2} cm</b>. Find the length of one side.</p>`, answer: w * k, unit: 'cm', tol: 0.002,
        hint: 'The diagonals of a rhombus cut each other in half at right angles. Each side is the hypotenuse of a right triangle with the two half-diagonals.',
        solution: steps(`Half-diagonals: ${d1 / 2} cm and ${d2 / 2} cm, meeting at 90°.`, `Side² = ${d1 / 2}² + ${d2 / 2}² = ${(d1 / 2) ** 2 + (d2 / 2) ** 2}.`, `Side = <b>${w * k} cm</b>.`) };
    },
    verify(x) { return Math.sqrt(x.d1 * x.d1 + x.d2 * x.d2) / 2; },
  },
  'c9m-quad-mid': {
    title: 'the triangle of mid-points',
    make(r) {
      const a = pick(r, 10, 40, 2), b = pick(r, 10, 40, 2), c = pick(r, Math.abs(a - b) + 2, a + b - 2, 2);
      return { a, b, c, q: `<p>The sides of a triangular park are <b>${a} m</b>, <b>${b} m</b> and <b>${c} m</b>. A path joins the mid-points of the three sides, forming a smaller triangle. Find the total length of the path (the perimeter of the smaller triangle).</p>`, answer: (a + b + c) / 2, unit: 'm', tol: 0.002,
        hint: 'By the mid-point theorem each side of the small triangle is half of the side of the big triangle that it is parallel to.',
        solution: steps(`The path pieces are ${a / 2} m, ${b / 2} m and ${c / 2} m (half of each side).`, `Total = ${a / 2} + ${b / 2} + ${c / 2} = <b>${(a + b + c) / 2} m</b>.`, 'This is half of the big triangle’s perimeter.') };
    },
    verify(x) { return 0.5 * x.a + 0.5 * x.b + 0.5 * x.c; },
  },
  'c9m-quad-rect': {
    title: 'a rectangle from its diagonal',
    make(r) {
      const [u, v, w] = choose(r, HALF), k = choose(r, [1, 2]), a = u * k, d = w * k;
      return { a, d, q: `<p>A rectangular plot has one side <b>${a} m</b> and a diagonal <b>${d} m</b>. Find its area.</p>`, answer: a * v * k, unit: 'm²', tol: 0.002,
        hint: 'Every corner of a rectangle is 90°. The diagonal makes a right triangle with two sides.',
        solution: steps(`Other side² = ${d}² − ${a}² = ${d * d - a * a}, so the other side = ${v * k} m.`, `Area = ${a} × ${v * k} = <b>${a * v * k} m²</b>.`) };
    },
    verify(x) { const t = 0.5 * x.a * Math.sqrt(x.d * x.d - x.a * x.a); return 2 * t; },
  },
};
