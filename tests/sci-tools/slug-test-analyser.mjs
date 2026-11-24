// #slug-test-analyser: more checks beside the ones in tests/sci.mjs.
// New with the article on slug-test shape factors in unconfined aquifers (De Smedt 2024, Water 16: 2853): the tool's
// Hvorslev shape factor ln(Le/R) gives the paper's 4.61 (10 m screen) and 3.00 (2 m screen) for R = 0.1 m, and on the
// article's simulated 10 m test (casing radius 0.05 m) the fit gives T0 = 52.51 s, Hvorslev K = 1.096e-5 m/s and
// Bouwer-Rice K with the paper's ln(Re/rw) = 4.21 = 1.002e-5 m/s.
import { fitRecovery, hvorslev, bouwerRice } from '../../src/lib/sci/slug.ts';
export default async (check) => {
  const near = (a, b, t) => Math.abs(a - b) <= t;
  check('slug: Hvorslev shape factor ln(Le/R) is 4.61 for 10 m and 3.00 for 2 m screens of radius 0.1 m', near(Math.log(10 / 0.1), 4.605, 5e-4) && near(Math.log(2 / 0.1), 2.996, 5e-4));
  const t = Array.from({ length: 21 }, (_, i) => i * 6);
  const h = [0.5, 0.4481, 0.4018, 0.3573, 0.3151, 0.2829, 0.2486, 0.2251, 0.2009, 0.1775, 0.1589, 0.1444, 0.1294, 0.1137, 0.106, 0.0926, 0.0745, 0.0685, 0.0647, 0.0579, 0.0522];
  const f = fitRecovery(t, h, { lo: 0.1, hi: 0.9 });
  check('slug: simulated 10 m screen test gives T0 52.51 s', near(f.T0, 52.51, 0.01));
  check('slug: Hvorslev K 1.096e-5 m/s, Bouwer-Rice with ln(Re/rw) 4.21 gives 1.002e-5 m/s', near(hvorslev(0.05, 0.1, 10, f.T0), 1.096e-5, 1e-8) && near(bouwerRice(0.05, 4.21, 10, f.T0), 1.002e-5, 1e-8));
  check('slug: Hvorslev over Bouwer-Rice is exactly the ratio of shape factors', near(hvorslev(0.05, 0.1, 10, f.T0) / bouwerRice(0.05, 4.21, 10, f.T0), Math.log(100) / 4.21, 1e-12));
};
