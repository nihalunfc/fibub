// #1192 binomial expansion. Expansions checked against sympy.expand, coefficients against sympy.binomial,
// Galton-board chances against C(n, k)/2ⁿ from sympy.
import * as BN from '../../src/lib/sci/school-binomial.ts';
export default async (check) => {
  check('binomial: (2x − 3)⁵ = 32x⁵ − 240x⁴ + 720x³ − 1080x² + 810x − 243 (sympy)', BN.expand(2, -3, 5).text === '32x⁵ − 240x⁴ + 720x³ − 1080x² + 810x − 243');
  check('binomial: (x + 1)⁶ and (x − 1)⁴ (sympy)', BN.expand(1, 1, 6).text === 'x⁶ + 6x⁵ + 15x⁴ + 20x³ + 15x² + 6x + 1' && BN.expand(1, -1, 4).text === 'x⁴ − 4x³ + 6x² − 4x + 1');
  const t = BN.expand(3, 2, 12).terms;
  check('binomial: (3x + 2)¹² first coefficients 531441, 4251528, 15588936 (sympy)', t[0].coef === 531441n && t[1].coef === 4251528n && t[2].coef === 15588936n);
  check('binomial: C(30, 15) = 155117520 (sympy)', BN.C(30, 15) === 155117520n && BN.C(5, 7) === 0n);
  const p = BN.pascal(7);
  check('binomial: Pascal row 6 is 1 6 15 20 15 6 1 and rows add to 2ⁿ', p[6].join(' ') === '1 6 15 20 15 6 1' && p.every((row, n) => row.reduce((s, v) => s + v, 0n) === 2n ** BigInt(n)));
  check('binomial: middle terms', BN.middle(6).join() === '3' && BN.middle(7).join() === '3,4');
  check('binomial: general term T₄ of (2x − 3)⁵ is 720x³... with r = 2: 720x³', BN.term(2, -3, 5, 2).text === '720x³' && BN.term(2, -3, 5, 3).text === '−1080x²');
  check('binomial: Galton chances for 10 rows (sympy)', BN.galton(10, 0) === 0.0009765625 && BN.galton(10, 2) === 0.0439453125 && Math.abs(Array.from({ length: 11 }, (_, k) => BN.galton(10, k)).reduce((s, v) => s + v, 0) - 1) < 1e-15);
  check('binomial: (0x + 5)³ = 125 and a zero b', BN.expand(0, 5, 3).text === '125' && BN.expand(2, 0, 3).text === '8x³');
};
