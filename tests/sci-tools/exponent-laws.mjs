// #1236 Exponent laws. Checked against Python fractions.Fraction: for a, b in 2..10 and m, n in −6..8,
// a**m * a**n == a**(m+n), a**m / a**n == a**(m−n), (a**m)**n == a**(m*n) and a**m * b**m == (a*b)**m, all exact.
// Here the same identities are checked with the page's own exact BigInt fractions.
import { powFrac, lawExponent, tiles, cancel, mulFrac, fracText } from '../../src/lib/sci/expo-j4.ts';

export default async (check) => {
  const eq = (p, q) => p.num === q.num && p.den === q.den;
  const inv = (p) => ({ num: p.den, den: p.num });
  let ok = true;
  for (let a = 2; a <= 10; a++) for (let m = -6; m <= 8; m++) for (let n = -6; n <= 8; n++) {
    if (!eq(mulFrac(powFrac(a, m), powFrac(a, n)), powFrac(a, lawExponent('product', m, n)))) ok = false;
    if (!eq(mulFrac(powFrac(a, m), inv(powFrac(a, n))), powFrac(a, lawExponent('quotient', m, n)))) ok = false;
    let v = { num: 1n, den: 1n }; for (let r = 0; r < Math.abs(n); r++) v = mulFrac(v, n >= 0 ? powFrac(a, m) : inv(powFrac(a, m)));
    if (!eq(v, powFrac(a, lawExponent('power', m, n)))) ok = false;
    for (let b = 2; b <= 10; b++) if (!eq(mulFrac(powFrac(a, m), powFrac(b, m)), powFrac(a * b, m))) ok = false;
  }
  check('exponents: all four laws exact for a, b 2..10 and m, n −6..8', ok);
  check('exponents: worked values 2^7 = 128, 2^-1 = 1/2, 2^12 = 4096, 10^3 = 1000', fracText(powFrac(2, 7)) === '128' && fracText(powFrac(2, -1)) === '1/2' && fracText(powFrac(2, 12)) === '4,096' && fracText(powFrac(10, 3)) === '1,000');
  check('exponents: tiles and cancelling', tiles(-3).join() === '-1,-1,-1' && tiles(0).length === 0 && cancel(tiles(3), tiles(-4)).pairs === 3 && cancel(tiles(3), tiles(-4)).left === -1 && cancel(tiles(3), tiles(4)).left === 7);
  check('exponents: long numbers are shortened', fracText(powFrac(10, 30)).includes('(31 digits)') && fracText(mulFrac({ num: 6n, den: 8n }, { num: 1n, den: 1n })) === '3/4');
};
