// #1468 eˣ and ln x. REF from mpmath (30 digits, via sympy 1.14's mpmath): ln 2, ln 3, ln 2.5, ln 10; (1 + 1/n)ⁿ for
// n = 1, 2, 4, 12, 365, 10⁶; partial sums of Σ 1/k!; e; 2^0.5 ln 2; log₂ 8; (2^0.1 − 1)/0.1.
import * as L from '../../src/lib/sci/e-and-ln.ts';
const near = (a, b, t = 1e-12) => Number.isFinite(a) && Math.abs(a - b) <= t * Math.max(1, Math.abs(b));
export default async (check) => {
  check('e and ln: ln 2, ln 3, ln 2.5, ln 10 (mpmath)', [2, 3, 2.5, 10].map(L.ratio).every((v, i) => near(v, [0.6931471805599453, 1.0986122886681098, 0.9162907318741551, 2.302585092994046][i])));
  check('e and ln: (1 + 1/n)ⁿ for n = 1, 2, 4, 12, 365, 10⁶ (mpmath)', [1, 2, 4, 12, 365, 1e6].map(L.compound).every((v, i) => near(v, [2, 2.25, 2.44140625, 2.613035290224678, 2.714567482021874, 2.7182804693193767][i], 1e-11)));
  check('e and ln: Σ 1/k! partial sums (mpmath)', [0, 1, 2, 5, 10].map((k) => L.seriesE(10)[k]).every((v, i) => near(v, [1, 2, 2.5, 2.716666666666667, 2.7182818011463845][i])));
  check('e and ln: the base with slope = height is e (to 1e-6)', Math.abs(L.findE() - 2.718281828459045) < 1e-6);
  check('e and ln: slope of 2ˣ at 0.5 = 2^0.5 ln 2 (mpmath)', near(L.slopeExp(2, 0.5), 0.9802581434685472));
  check('e and ln: (2^0.1 − 1)/0.1 = 0.71773 (mpmath)', near(L.ratioAt(2, 0.1), 0.7177346253629316, 1e-10));
  check('e and ln: ratio for e is 1, for 2 below 1, for 3 above 1', near(L.ratio(Math.E), 1) && L.ratio(2) < 1 && L.ratio(3) > 1);
  check('e and ln: log₂ 8 = 3 and slope of ln at 4 = 0.25', near(L.logBase(8, 2), 3) && L.slopeLn(4) === 0.25 && Number.isNaN(L.slopeLn(-1)));
  check('e and ln: ratio with small h approaches ln a', Math.abs(L.ratioAt(3, 1e-6) - Math.log(3)) < 1e-5);
};
