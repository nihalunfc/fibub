// #1318 Why √2 is irrational. Digits checked against Python's decimal module (prec 60) to 40 places; best fractions
// against a brute-force search; repeating decimals against hand-worked fractions.
import { sqrtDigits, bestFraction, isSquare, isPrime, isqrt, recurringToFraction, rootProof, sumProof } from '../../src/lib/sci/irrational-proof.ts';

export default async (check) => {
  check('irrational: √2, √3, √7, √50 to 40 places match Python decimal',
    sqrtDigits(2, 40) === '1.4142135623730950488016887242096980785696' && sqrtDigits(3, 40) === '1.7320508075688772935274463415058723669428'
    && sqrtDigits(7, 40) === '2.6457513110645905905016157536392604257102' && sqrtDigits(50, 40) === '7.0710678118654752440084436210484903928483');
  check('irrational: √9 = 3.000, isqrt of big numbers', sqrtDigits(9, 3) === '3.000' && isqrt(10n ** 40n) === 10n ** 20n && isqrt(99n) === 9n);
  const f = bestFraction(2, 5), g = bestFraction(2, 12), h = bestFraction(2, 29);
  check('irrational: best a for √2 with b = 5, 12, 29 is 7, 17, 41 (49 vs 50, 289 vs 288, 1681 vs 1682)', f.a === 7 && f.diff === -1 && g.a === 17 && g.diff === 1 && h.a === 41 && h.diff === -1);
  let ok = true, never0 = true;
  for (const n of [2, 3, 5, 6, 7, 8, 10, 12, 50, 99]) for (let b = 1; b <= 300; b++) {
    const r = bestFraction(n, b); let best = 0;
    for (let a = 0; a <= 10 * b + 1; a++) if (Math.abs(a / b - Math.sqrt(n)) < Math.abs(best / b - Math.sqrt(n))) best = a;
    if (best !== r.a) ok = false;
    if (r.diff === 0) never0 = false;
  }
  check('irrational: best fraction agrees with a brute-force search (10 values of n, b up to 300)', ok);
  check('irrational: a² − n b² is never 0 for non-squares', never0 && bestFraction(16, 7).diff === 0 && bestFraction(16, 7).a === 28);
  check('irrational: squares and primes', isSquare(49) && !isSquare(50) && isPrime(13) && !isPrime(1) && !isPrime(91));
  check('irrational: 0.272727… = 3/11, 0.090909… = 1/11, 0.454545… = 5/11, 0.12… = 4/33',
    recurringToFraction('27').join() === '3,11' && recurringToFraction('09').join() === '1,11' && recurringToFraction('45').join() === '5,11' && recurringToFraction('12').join() === '4,33');
  const st = rootProof(3), su = sumProof(3, 5, -2);
  check('irrational: proof for p = 3 has 7 steps and reaches b² = 3c²', st.length === 7 && st[3].claim.includes('b² = 3c²') && st[3].claim.includes('9c²'));
  check('irrational: 5 − 2√3 rearranges to √3 = (x − 5) / (−2)', su[0].claim.includes('5 − 2√3') && su[1].claim.includes('(x − 5) / (−2)'));
};
