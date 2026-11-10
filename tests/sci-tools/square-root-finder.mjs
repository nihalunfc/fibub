// #1232 Square root finder. Long division digits and perfect-square decisions checked against Python math.isqrt for
// every whole number to 100,000 (here the same check with BigInt), surd forms by hand (√72 = 6√2, √7056 = 84),
// Heron's method against Math.sqrt, and decimals (√2 = 1.4142..., √12.25 = 3.5, √0.0625 = 0.25).
import { primes, pairUp, oddSubtract, between, heron, longDivision } from '../../src/lib/sci/sqrt-j2.ts';

export default async (check) => {
  const isqrt = (n) => { let x = BigInt(Math.floor(Math.sqrt(Number(n)))); while (x * x > n) x--; while ((x + 1n) * (x + 1n) <= n) x++; return x; };
  let ok = true;
  for (let n = 0; n <= 100000; n++) {
    const r = longDivision(String(n), 0), s = isqrt(BigInt(n));
    if (r.root !== String(s) || r.exact !== (s * s === BigInt(n))) { ok = false; break; }
  }
  check('sqrt: long division whole-number root and exactness match isqrt for 0 to 100,000', ok);
  check('sqrt: long division decimals: √2 = 1.4142, √10 = 3.1622, √12.25 = 3.5, √0.0625 = 0.25', longDivision('2', 4).root === '1.4142' && longDivision('10', 4).root === '3.1622' && longDivision('12.25', 1).root === '3.5' && longDivision('12.25', 1).exact && longDivision('0.0625', 2).root === '0.25' && longDivision('abc', 2) === null);
  check('sqrt: 123456789 to 3 places = 11111.111 (cut, not rounded)', longDivision('123456789', 3).root === '11111.111');
  const P = pairUp(7056), Q = pairUp(72);
  check('sqrt: 7056 = (2·2)(2·2)(3·3)(7·7) → 84; 72 → 6√2', P.perfect && P.root === 84 && P.pairs.join() === '2,2,3,7' && !Q.perfect && Q.root === 6 && Q.rest === 2);
  let surd = true; for (let n = 2; n <= 5000; n++) { const u = pairUp(n); if (u.root * u.root * u.rest !== n || pairUp(u.rest).root !== 1) surd = false; if (primes(n).reduce((a, b) => a * b, 1) !== n) surd = false; }
  check('sqrt: n = root² × rest with rest square-free, for 2 to 5,000', surd);
  const O = oddSubtract(7056), O2 = oddSubtract(50);
  check('sqrt: odd subtraction: 7056 takes 84 steps to 0; 50 stops at 1 after 7', O.perfect && O.count === 84 && !O2.perfect && O2.count === 7 && O2.steps.at(-1).left === 1);
  const b = between(40), H = heron(40, b.first, 3);
  check('sqrt: 40 between 36 and 49, first guess 6.3077, Heron reaches √40 in 2 steps', b.k === 6 && b.lo === 36 && b.hi === 49 && Math.abs(b.first - 6.307692) < 1e-6 && Math.abs(H[2] - Math.sqrt(40)) < 1e-9);
  check('sqrt: between handles perfect squares and decimals', between(49).k === 7 && between(48.99).k === 6 && between(0.5).k === 0);
};
