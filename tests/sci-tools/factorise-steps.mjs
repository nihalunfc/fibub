// #1284 Factorising with identities. Every answer is checked against sympy.factor: x² + 7x + 12 = (x + 3)(x + 4),
// 6x² − 5x − 6 = (2x − 3)(3x + 2), 9x² − 12x + 4 = (3x − 2)², −2x² − 14x − 24 = −2(x + 3)(x + 4), 49x² − 16 =
// (7x + 4)(7x − 4), 8x³ + 27 = (2x + 3)(4x² − 6x + 9), 2x³ − 16 = 2(x − 2)(x² + 2x + 4); x² + x + 1 does not factor.
import { quadratic, diffSquares, cubes, splitPair, mul, polyText } from '../../src/lib/sci/factorise-school.ts';
export default async (check) => {
  const t = (a, b, c) => quadratic(a, b, c).text;
  check('factor: x² + 7x + 12, 6x² − 5x − 6 (sympy)', t(1, 7, 12) === '(x + 3)(x + 4)' && t(6, -5, -6) === '(2x − 3)(3x + 2)');
  check('factor: perfect squares (3x − 2)², 3(x + 1)²', t(9, -12, 4) === '(3x − 2)²' && t(3, 6, 3) === '3(x + 1)²');
  check('factor: common factor −2(x + 3)(x + 4) and x(x − 5)', t(-2, -14, -24) === '−2(x + 3)(x + 4)' && t(1, -5, 0) === 'x(x − 5)');
  check('factor: x² + x + 1 does not factorise', !quadratic(1, 1, 1).ok && quadratic(1, 1, 1).steps.at(-1).includes('−3'));
  check('factor: 49x² − 16 and 8x² − 18', diffSquares(49, 16).text === '(7x + 4)(7x − 4)' && diffSquares(8, 18).text === '2(2x + 3)(2x − 3)' && !diffSquares(5, 16).ok);
  check('factor: 8x³ + 27 and 2x³ − 16 (sympy)', cubes(8, 27, true).text === '(2x + 3)(4x² − 6x + 9)' && cubes(2, 16, false).text === '2(x − 2)(x² + 2x + 4)');
  check('factor: split pair for 12 and 7 is 3, 4; for −36 and −5 is −9, 4', splitPair(12, 7).join() === '3,4' && splitPair(-36, -5).join() === '-9,4' && splitPair(1, 1) === null);
  check('factor: polyText', polyText([1, -5, 6]) === 'x² − 5x + 6' && polyText([-1, 0, 4]) === '−x² + 4');
  let ok = true, n = 0;
  for (let p = -4; p <= 4; p++) for (let q = -6; q <= 6; q++) for (let r = 1; r <= 3; r++) for (let s = -6; s <= 6; s += 2) {
    if (p === 0) continue;
    const [a, b, c] = mul([p, q], [r, s]); const f = quadratic(a, b, c); n++;
    if (!f.ok || f.expanded.join() !== [a, b, c].join()) ok = false;
  }
  check(`factor: ${n} products (px + q)(rx + s) all factorise back and re-expand exactly`, ok);
  let ok2 = true;
  for (const [p, q] of [[1, 1], [27, 8], [64, 125], [3, 24], [5, 40]]) for (const plus of [true, false]) { const f = cubes(p, q, plus); if (!f.ok || f.expanded.join() !== [p, 0, 0, plus ? q : -q].join()) ok2 = false; }
  check('factor: sums and differences of cubes re-expand exactly', ok2);
};
