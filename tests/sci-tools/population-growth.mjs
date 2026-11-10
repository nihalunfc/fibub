// #1452 population growth. Closed forms checked against scipy.integrate.solve_ivp (rtol 1e-12) for the
// bacteria and fish stories, and the time to K/2 against scipy.optimize.brentq on the ODE solution.
import * as P from '../../src/lib/sci/pop-growth-r.ts';
const near = (a, b, t = 1e-8) => Number.isFinite(a) && Math.abs(a - b) <= t * Math.max(1, Math.abs(b));
export default async (check) => {
  check('population: logistic N(10) = 599.8596 (scipy)', near(P.logN(10, 0.5, 1000, 10), 599.8596018132874));
  check('population: exponential N(10) = 1484.1316 (scipy)', near(P.expN(10, 0.5, 10), 1484.1315910272883));
  check('population: logistic time to K/2 = 9.1902 (scipy brentq)', near(P.logTimeTo(10, 0.5, 1000, 500), 9.190239700267032, 1e-7));
  check('population: fish story N(4) = 275.048 (scipy)', near(P.logN(150, 0.6, 300, 4), 275.04819105177745));
  check('population: starting above K falls toward K', P.logN(500, 0.5, 300, 5) < 500 && P.logN(500, 0.5, 300, 5) > 300);
  check('population: fastest growth rK/4 at K/2', P.maxRate(0.5, 1000).rate === 125 && P.maxRate(0.5, 1000).n === 500 && near(P.logRate(0.5, 1000, 500), 125));
  check('population: doubling time ln2/r', near(P.doubling(0.1), 6.931471805599453));
  check('population: each pyramid adds to 100', Object.values(P.PYRAMIDS).every((p) => p.reduce((a, b) => a + b, 0) === 100));
  const g = P.groups(P.PYRAMIDS.expanding);
  check('population: expanding groups 47/46/7', g.young === 47 && g.working === 46 && g.old === 7);
};
