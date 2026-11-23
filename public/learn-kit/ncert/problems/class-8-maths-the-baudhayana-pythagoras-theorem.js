// Class 8 Maths, Chapter 9 The Baudhayana-Pythagoras Theorem: live problems (original fibub questions). Ids start with c8m-pyth-.
import { pick, choose, n, steps } from './_util.js';

const T = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29], [9, 40, 41]];
const trip = (r) => { const [a, b, c] = choose(r, T), k = pick(r, 1, 4); return [a * k, b * k, c * k]; };
export default {
  'c8m-pyth-hyp': {
    title: 'find the hypotenuse',
    make(r) {
      const [a, b, c] = trip(r);
      return { a, b, q: `<p>A right triangle has legs ${a} cm and ${b} cm. How long is the hypotenuse?</p>`, answer: c, abs: 0.01, tol: 0, unit: 'cm',
        hint: 'c² = a² + b², then take the square root.',
        solution: steps(`c² = ${a}² + ${b}² = ${a * a} + ${b * b} = ${a * a + b * b}.`, `c = √${a * a + b * b} = <b>${c} cm</b>.`) };
    },
    verify: (p) => Math.sqrt(p.a ** 2 + p.b ** 2),
  },
  'c8m-pyth-leg': {
    title: 'find a missing leg',
    make(r) {
      const [a, b, c] = trip(r);
      return { a, c, q: `<p>In a right triangle the hypotenuse is ${c} cm and one leg is ${a} cm. Find the other leg.</p>`, answer: b, abs: 0.01, tol: 0, unit: 'cm',
        hint: 'b² = c² − a².',
        solution: steps(`b² = ${c}² − ${a}² = ${c * c} − ${a * a} = ${c * c - a * a}.`, `b = √${c * c - a * a} = <b>${b} cm</b>.`) };
    },
    verify: (p) => { for (let b = 1; b < 400; b++) if (b * b + p.a * p.a === p.c * p.c) return b; },
  },
  'c8m-pyth-ladder': {
    title: 'a ladder against a wall',
    make(r) {
      const [a, b, c] = choose(r, [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25]]).map((v) => v), s = pick(r, 1, 2);
      return { a: a * s, b: b * s, c: c * s, q: `<p>A ladder ${c * s} m long leans against a vertical wall. Its foot is ${a * s} m from the wall. How high up the wall does it reach?</p>`, answer: b * s, abs: 0.01, tol: 0, unit: 'm',
        hint: 'The ladder is the hypotenuse; the ground distance and the height are the legs.',
        solution: steps(`height² = ${c * s}² − ${a * s}² = ${(c * s) ** 2} − ${(a * s) ** 2} = ${(b * s) ** 2}.`, `height = <b>${b * s} m</b>.`) };
    },
    verify: (p) => Math.round(Math.sqrt(p.c ** 2 - p.a ** 2)),
  },
  'c8m-pyth-diag': {
    title: 'diagonal of a rectangle',
    make(r) {
      const [a, b, c] = trip(r);
      return { a, b, q: `<p>A rectangular field is ${a} m long and ${b} m wide. A path runs across the diagonal. How long is the path?</p>`, answer: c, abs: 0.01, tol: 0, unit: 'm',
        hint: 'The diagonal splits the rectangle into two right triangles.',
        solution: steps(`d² = ${a}² + ${b}² = ${a * a + b * b}.`, `d = <b>${c} m</b>.`) };
    },
    verify: (p) => Math.hypot(p.a, p.b),
  },
  'c8m-pyth-grid': {
    title: 'distance between two points on a grid',
    make(r) {
      const [a, b, c] = choose(r, [[3, 4, 5], [6, 8, 10], [5, 12, 13]]), x1 = pick(r, 0, 5), y1 = pick(r, 0, 5);
      return { x1, y1, x2: x1 + a, y2: y1 + b, q: `<p>On a grid, point P is at (${x1}, ${y1}) and point Q is at (${x1 + a}, ${y1 + b}). How far is P from Q in a straight line?</p>`, answer: c, abs: 0.01, tol: 0, unit: 'units',
        hint: 'Find how far across and how far up, then use the theorem.',
        solution: steps(`Across ${a}, up ${b}.`, `PQ = √(${a}² + ${b}²) = √${a * a + b * b} = <b>${c}</b>.`) };
    },
    verify: (p) => Math.hypot(p.x2 - p.x1, p.y2 - p.y1),
  },
  'c8m-pyth-area': {
    title: 'area of a right triangle from hypotenuse and a leg',
    make(r) {
      const [a, b, c] = trip(r);
      return { a, c, q: `<p>A right-angled triangle has hypotenuse ${c} cm and one leg ${a} cm. What is its area in cm²?</p>`, answer: a * b / 2, abs: 0.01, tol: 0, unit: 'cm²',
        hint: 'Find the other leg first, then use ½ × base × height.',
        solution: steps(`Other leg = √(${c}² − ${a}²) = ${b} cm.`, `Area = ½ × ${a} × ${b} = <b>${a * b / 2} cm²</b>.`) };
    },
    verify: (p) => { const b = Math.sqrt(p.c ** 2 - p.a ** 2); return 0.5 * p.a * b; },
  },
  'c8m-pyth-gen': {
    title: 'a triple from m and n',
    make(r) {
      const m = pick(r, 2, 8), nn = pick(r, 1, m - 1);
      return { m, nn, q: `<p>Using the recipe a = m² − n², b = 2mn, c = m² + n² with m = ${m} and n = ${nn}, find c.</p>`, answer: m * m + nn * nn, abs: 0.01, tol: 0, unit: '',
        hint: 'c = m² + n².',
        solution: steps(`a = ${m * m - nn * nn}, b = ${2 * m * nn}.`, `c = ${m}² + ${nn}² = <b>${m * m + nn * nn}</b>. Check: ${(m * m - nn * nn) ** 2} + ${(2 * m * nn) ** 2} = ${(m * m + nn * nn) ** 2}.`) };
    },
    verify: (p) => Math.sqrt((p.m * p.m - p.nn * p.nn) ** 2 + (2 * p.m * p.nn) ** 2),
  },
};
