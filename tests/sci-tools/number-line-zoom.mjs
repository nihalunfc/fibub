// #1274 Number line zoom. Checked against Python's decimal module (60-digit square roots of 2, 3, 5, 7, 10, 13),
// the period of 1/q from the multiplicative order of 10 mod q (Python), and hand-worked decimals (3/8 = 0.375,
// 7/12 = 0.58(3), 7/13 = 0.(538461)).
import { isqrt, scaled, exactAt, dec, within, why, rational, decimalInfo, decText, PI_DIGITS } from '../../src/lib/sci/number-line-zoom.ts';

export default async (check) => {
  const PY = { 2: '1.414213562373095048801688724209', 3: '1.732050807568877293527446341505', 5: '2.236067977499789696409173668731', 7: '2.645751311064590590501615753639', 10: '3.162277660168379331998893544432', 13: '3.605551275463989293119221267470' };
  check('zoom: square roots to 30 places match Python decimal', Object.entries(PY).every(([n, s]) => dec(scaled({ kind: 'sqrt', n: Number(n) }, 30), 30) === s));
  check('zoom: isqrt', isqrt(0n) === 0n && isqrt(15n) === 3n && isqrt(16n) === 4n && isqrt(10n ** 40n) === 10n ** 20n && isqrt(10n ** 40n - 1n) === 10n ** 20n - 1n);
  check('zoom: π digits', dec(scaled({ kind: 'pi' }, 10), 10) === '3.1415926535' && PI_DIGITS.length === 62);
  check('zoom: fractions', dec(scaled({ kind: 'frac', p: 7, q: 13 }, 12), 12) === '0.538461538461' && dec(scaled({ kind: 'frac', p: 1, q: 3 }, 4), 4) === '0.3333');
  check('zoom: lands exactly on 3/8 at 3 places and on √16, never on √2', exactAt({ kind: 'frac', p: 3, q: 8 }, 3) && !exactAt({ kind: 'frac', p: 3, q: 8 }, 2) && exactAt({ kind: 'sqrt', n: 16 }, 0) && [0, 5, 10, 20].every((k) => !exactAt({ kind: 'sqrt', n: 2 }, k)));
  check('zoom: why √2 is between 1.41 and 1.42', why({ kind: 'sqrt', n: 2 }, 2) === '1.41² = 1.9881 ≤ 2 < 2.0164 = 1.42²');
  check('zoom: why 1/3 is between 0.33 and 0.34', why({ kind: 'frac', p: 1, q: 3 }, 2) === '0.33 × 3 = 0.99 ≤ 1 < 1.02 = 0.34 × 3');
  check('zoom: position inside the interval', Math.abs(within({ kind: "sqrt", n: 2 }, 1) - 0.142135) < 1e-6 && within({ kind: 'frac', p: 1, q: 2 }, 0) === 0.5);
  check('zoom: rational or not', rational({ kind: 'sqrt', n: 9 }) && !rational({ kind: 'sqrt', n: 8 }) && rational({ kind: 'frac', p: 2, q: 7 }) && !rational({ kind: 'pi' }));
  const P = { 3: 1, 7: 6, 11: 2, 12: 1, 13: 6, 17: 16, 19: 18, 23: 22, 97: 96, 28: 6, 6: 1 };
  check('zoom: periods of 1/q match Python', Object.entries(P).every(([q, k]) => decimalInfo(1, Number(q)).rep.length === k));
  const a = decimalInfo(3, 8), b = decimalInfo(7, 12), c = decimalInfo(7, 13), d = decimalInfo(14, 4);
  check('zoom: decimal detective', a.terminates && decText(a) === '0.375' && !b.terminates && decText(b) === '0.58(3)' && decText(c) === '0.(538461)' && decText(d) === '3.5' && d.p === 7 && d.q === 2 && decText(decimalInfo(6, 3)) === '2');
  let ok = true;
  for (let q = 1; q <= 300; q++) { const t = decimalInfo(1, q).terminates, only25 = decimalInfo(1, q).factors.every((f) => f === 2 || f === 5); if (t !== only25) ok = false; }
  check('zoom: terminates exactly when q has only 2s and 5s (q to 300)', ok);
};
