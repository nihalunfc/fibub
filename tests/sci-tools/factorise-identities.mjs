// #1285 Factorise with identities. Factorised forms checked by hand against the identities and against Python
// sympy.factor output for the same expressions (e.g. 4x² − 9 → (2x + 3)(2x − 3), 6x² + 5x − 6 → (2x + 3)(3x − 2),
// x³ − 6x² + 11x − 6 → (x − 1)(x − 2)(x − 3), 8x³ − 27 → (2x − 3)(4x² + 6x + 9)); every result multiplies back to
// the input, including 400 random products of whole-number factors.
import { parse, show, factorise, resultText, expand, same, mul } from '../../src/lib/sci/factor-school.ts';

export default async (check) => {
  const f = (s) => resultText(factorise(parse(s)));
  check('parse and show', show(parse('4x^2 - 9')) === '4x² − 9' && show(parse('x²+5x+6')) === 'x² + 5x + 6' && show(parse('−x³ + 2x')) === '−x³ + 2x' && parse('x^5') === null && parse('2.5x') === null && parse('abc') === null && parse('') === null && parse('3x+') === null);
  check('difference of squares', f('4x^2 - 9') === '(2x + 3)(2x − 3)');
  check('perfect squares', f('x^2 + 6x + 9') === '(x + 3)²' && f('9x^2 - 12x + 4') === '(3x − 2)²');
  check('steps use real minus signs', factorise(parse('6x^2 + 5x - 6')).steps[1].includes('6 × (−6) = −36 and add to b = 5: −4 and 9'));
  check('middle-term split', f('x^2 + 5x + 6') === '(x + 3)(x + 2)' && f('6x^2 + 5x - 6') === '(2x + 3)(3x − 2)');
  check('common factor then identity', f('2x^2 - 18') === '2(x + 3)(x − 3)' && f('3x^3 - 12x') === '3x(x + 2)(x − 2)');
  check('sum and difference of cubes', f('8x^3 - 27') === '(2x − 3)(4x² + 6x + 9)' && f('x^3 + 64') === '(x + 4)(x² − 4x + 16)');
  check('cube of a binomial', f('x^3 + 6x^2 + 12x + 8') === '(x + 2)³');
  check('factor theorem cubic', f('x^3 - 6x^2 + 11x - 6') === '(x − 1)(x − 2)(x − 3)');
  check('x⁴ − 16', f('x^4 - 16') === '(x + 2)(x − 2)(x² + 4)');
  check('does not factorise', f('x^2 + x + 1') === 'x² + x + 1' && factorise(parse('x^2 + x + 1')).steps.join(' ').includes('does not factorise'));
  check('negative leading', f('-x^2 + 9') === '−(x + 3)(x − 3)');
  check('just a common factor', f('6x + 9') === '3(2x + 3)' && f('5x^2') === '5x²');
  let ok = true, fail = '';
  const rint = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  for (let i = 0; i < 400; i++) {
    let p = [rint(1, 3) * (Math.random() < 0.3 ? -1 : 1)];
    const n = rint(1, 3);
    for (let j = 0; j < n; j++) { let a = rint(1, 3), b = rint(-6, 6); p = mul(p, [b, a]); }
    if (Math.random() < 0.3) p = mul(p, [rint(1, 5), 0, 1]);
    if (p.length > 5) continue;
    const r = factorise(p);
    if (!same(expand(r), p)) { ok = false; fail = show(p); }
  }
  check(`400 random products multiply back${fail ? ` (failed: ${fail})` : ''}`, ok);
};
