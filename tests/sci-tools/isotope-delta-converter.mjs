// Isotope delta converter: the triple-oxygen excess and the rest of the delta maths are pinned in tests/sci.mjs;
// New with the Seoul precipitation article: Delta'17O worked out from published monthly means and regression lines.
import * as DL from '../../src/lib/sci/delta.ts';

export default async (check) => {
  const near = (a, b, tol) => Math.abs(a - b) <= tol;
  const pm = (d17, d18, lam) => DL.capDelta17(d17, d18, lam) * 1000;
  check('delta: d17O -3.74 and d18O -7.11 permil give 20.48 per meg at lambda 0.528 and 22.6 at 0.5283', near(pm(-3.74, -7.11, 0.528), 20.478, 0.001) && near(pm(-3.74, -7.11, 0.5283), 22.6, 0.06));
  check('delta: a rounding of 0.005 permil in d17O moves the excess by 5 per meg', near(pm(-3.735, -7.11, 0.528) - pm(-3.74, -7.11, 0.528), 5.0, 0.02));
  const onLine = (a, b, d18) => 1000 * Math.expm1((a * DL.deltaPrime(d18) + b) / 1000);
  check('delta: a sample on a line d\'17O = 0.528 d\'18O + 0.0208 has 20.8 per meg whatever its d18O', [-18.21, -7.11, 1.15].every((d) => near(pm(onLine(0.528, 0.0208, d), d, 0.528), 20.8, 1e-9)));
  check('delta: the d-excess of the monthly means is 11.68 permil', near(-45.2 - 8 * -7.11, 11.68, 1e-9));
};
