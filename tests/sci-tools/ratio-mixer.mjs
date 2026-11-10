// #1241 Ratio mixer. Checked against hand-worked examples and Python fractions.Fraction comparisons.
import { simplify, share, compare, split, missing, mixColour } from '../../src/lib/sci/ratio-mixer.ts';

export default async (check) => {
  check('simplify 12:18 = 2:3, 7:5 stays, 40:10 = 4:1', simplify(12, 18).join() === '2,3' && simplify(7, 5).join() === '7,5' && simplify(40, 10).join() === '4,1');
  check('share 2:3 = 0.4', Math.abs(share(2, 3) - 0.4) < 1e-12 && share(0, 0) === 0);
  check('compare: 2:3 equals 4:6; 3:5 weaker than 2:3; 5:7 stronger than 2:3', compare(2, 3, 4, 6) === 0 && compare(3, 5, 2, 3) === -1 && compare(5, 7, 2, 3) === 1);
  // Python: all(Fraction(a1, a1+a2) > Fraction(b1, b1+b2)) agrees with the sign, for every mix up to 12 parts.
  let ok = true;
  const F = (a, b) => a / (a + b);
  for (let a1 = 1; a1 <= 12; a1++) for (let a2 = 1; a2 <= 12; a2++) for (let b1 = 1; b1 <= 12; b1++) for (let b2 = 1; b2 <= 12; b2++) {
    const c = compare(a1, a2, b1, b2), want = a1 * (b1 + b2) === b1 * (a1 + a2) ? 0 : F(a1, a2) > F(b1, b2) ? 1 : -1;
    if (c !== want) ok = false;
  }
  check('compare agrees with the share for every mix up to 12 parts', ok);
  check('split 40 in 3:5 = 15 and 25', split(40, 3, 5).join() === '15,25');
  check('missing: 3:5 = 12:x gives 20', missing(3, 5, 12) === 20);
  const g = mixColour([40, 110, 200], [250, 215, 40], 0.5);
  check('half blue, half yellow: green (G biggest), channels are geometric means', g.join() === '100,154,89' && g[1] > g[0] && g[1] > g[2]);
  check('all of one colour gives that colour', mixColour([40, 110, 200], [250, 215, 40], 1).join() === '40,110,200' && mixColour([40, 110, 200], [250, 215, 40], 0).join() === '250,215,40');
};
