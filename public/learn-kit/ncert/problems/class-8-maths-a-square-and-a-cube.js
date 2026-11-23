// Class 8 Maths, A Square and a Cube: live problems (original fibub questions). Ids start with c8m-sq-.
import { pick, choose, n, steps } from './_util.js';

const MULT = [[72, 2], [108, 3], [200, 2], [243, 3], [450, 2], [90, 10], [588, 3], [1152, 2]]; // number, smallest multiplier for a square
const CUBES = [[54, 4], [128, 4], [500, 2], [243, 3], [1500, 18], [320, 25]]; // number, smallest multiplier for a cube
export default {
  'c8m-sq-root': {
    title: 'square root of a perfect square',
    make(r) {
      const k = pick(r, 12, 98), v = k * k;
      return { v, q: `<p>A square courtyard has an area of <b>${n(v, 6)} m²</b>. Find the length of one side.</p>`, answer: k, unit: 'm', tol: 0.002,
        hint: 'Area of a square = side × side, so the side is the square root of the area. Look at the last digit to guess the root, then check.',
        solution: steps(`Side × side = ${n(v, 6)}.`, `The last digit ${v % 10} tells us what the last digit of the root may be.`, `Try ${k}: ${k} × ${k} = ${n(v, 6)}. So the side is <b>${k} m</b>.`) };
    },
    verify(x) { return Math.round(Math.sqrt(x.v)); },
  },
  'c8m-sq-between': {
    title: 'numbers between two squares',
    make(r) {
      const k = pick(r, 5, 40);
      return { k, q: `<p>How many natural numbers lie strictly between <b>${k}²</b> and <b>${k + 1}²</b>?</p>`, answer: 2 * k, unit: '', tol: 0.002,
        hint: 'Work out (k + 1)² − k² first, then remember that the two squares themselves are not counted.',
        solution: steps(`${k}² = ${k * k} and ${(k + 1) ** 2} = ${k + 1}².`, `The difference is ${(k + 1) ** 2 - k * k} = 2 × ${k} + 1.`, `Leave out the end numbers: ${(k + 1) ** 2 - k * k} − 1 = <b>${2 * k}</b>.`) };
    },
    verify(x) { return (x.k + 1) ** 2 - x.k ** 2 - 1; },
  },
  'c8m-sq-sumodd': {
    title: 'sum of odd numbers',
    make(r) {
      const k = pick(r, 8, 40);
      return { k, q: `<p>Find the sum of the first <b>${k}</b> odd numbers: 1 + 3 + 5 + … (${k} terms).</p>`, answer: k * k, unit: '', tol: 0.002,
        hint: 'The sum of the first k odd numbers is a square number. Which one?',
        solution: steps('Each new L-shaped layer of tiles has the next odd number of tiles.', `So 1 + 3 + 5 + … (${k} terms) = ${k} × ${k}.`, `The sum is <b>${k * k}</b>.`) };
    },
    verify(x) { let s = 0; for (let i = 0; i < x.k; i++) s += 2 * i + 1; return s; },
  },
  'c8m-sq-mult': {
    title: 'smallest multiplier for a perfect square',
    make(r) {
      const [v, m] = choose(r, MULT);
      return { v, m, q: `<p>Find the smallest natural number by which <b>${v}</b> must be multiplied to get a perfect square.</p>`, answer: m, unit: '', tol: 0.002,
        hint: 'Write the number as a product of primes. A prime that appears an odd number of times needs one more copy.',
        solution: steps(`Break ${v} into primes.`, 'A perfect square needs every prime in pairs; find the primes left without a partner.', `Their product is <b>${m}</b>. Then ${v} × ${m} = ${v * m} = ${Math.round(Math.sqrt(v * m))}².`) };
    },
    verify(x) { let k = 1; while (!Number.isInteger(Math.sqrt(x.v * k))) k++; return k; },
  },
  'c8m-sq-cuberoot': {
    title: 'cube root of a perfect cube',
    make(r) {
      const k = pick(r, 4, 40), v = k ** 3;
      return { v, q: `<p>A cubical box has a volume of <b>${n(v, 6)} cm³</b>. Find the length of one edge in cm.</p>`, answer: k, unit: '', tol: 0.002,
        hint: 'You are finding the cube root. The last digit of a cube tells you the last digit of its cube root: 1→1, 8→2, 7→3, 4→4, 5→5, 6→6, 3→7, 2→8, 9→9.',
        solution: steps(`The last digit of ${n(v, 6)} is ${v % 10}, so the root ends in ${[0, 1, 8, 7, 4, 5, 6, 3, 2, 9].indexOf(v % 10)}.`, `Try ${k}: ${k} × ${k} × ${k} = ${n(v, 6)}.`, `So s = <b>${k}</b>.`) };
    },
    verify(x) { return Math.round(Math.cbrt(x.v)); },
  },
  'c8m-sq-triplet': {
    title: 'a Pythagorean triplet from m',
    make(r) {
      const m = pick(r, 3, 15);
      return { m, q: `<p>For m = <b>${m}</b>, the numbers 2m, m² − 1 and m² + 1 form a Pythagorean triplet. Find the <b>largest</b> number of the triplet.</p>`, answer: m * m + 1, unit: '', tol: 0.002,
        hint: 'Compute the three numbers and pick the biggest. The largest is always the one that plays the hypotenuse.',
        solution: steps(`2m = ${2 * m}, m² − 1 = ${m * m - 1}, m² + 1 = ${m * m + 1}.`, `Check: ${2 * m}² + ${m * m - 1}² = ${(2 * m) ** 2 + (m * m - 1) ** 2} = ${m * m + 1}².`, `The largest is <b>${m * m + 1}</b>.`) };
    },
    verify(x) { return Math.round(Math.sqrt((2 * x.m) ** 2 + (x.m * x.m - 1) ** 2)); },
  },
  'c8m-sq-cubemult': {
    title: 'smallest multiplier for a perfect cube',
    make(r) {
      const [v, m] = choose(r, CUBES);
      return { v, m, q: `<p>Find the smallest natural number by which <b>${v}</b> must be multiplied to get a perfect cube.</p>`, answer: m, unit: '', tol: 0.002,
        hint: 'Write the number as a product of primes and group equal primes in threes. Each incomplete group needs more copies.',
        solution: steps(`Break ${v} into primes.`, 'Group the primes in threes; some groups are not complete.', `Fill them up: the multiplier is <b>${m}</b>, and ${v} × ${m} = ${v * m} = ${Math.round(Math.cbrt(v * m))}³.`) };
    },
    verify(x) { let k = 1; while (Math.abs(Math.round(Math.cbrt(x.v * k)) ** 3 - x.v * k) > 0.5) k++; return k; },
  },
};
