// #1453 predator-prey. RK4 (dt 0.01) checked against scipy.integrate.solve_ivp (rtol 1e-11) and
// scipy.signal.find_peaks for the hares-and-lynx story, with and without a prey limit.
import * as L from '../../src/lib/sci/predprey-r.ts';
const near = (a, b, t = 1e-6) => Number.isFinite(a) && Math.abs(a - b) <= t * Math.max(1, Math.abs(b));
export default async (check) => {
  const p = { a: 1, b: 0.02, c: 0.01, d: 0.8 };
  const r = L.simulate(p, 40, 10, 50, 0.01);
  check(`lv: t = 10 matches scipy (${r.H[1000]}, ${r.P[1000]})`, near(r.H[1000], 155.69463964, 1e-6) && near(r.P[1000], 10.92170134, 1e-6));
  check('lv: t = 25 matches scipy', near(r.H[2500], 38.9731513, 1e-6) && near(r.P[2500], 10.13280124, 1e-6));
  const pk = L.peaks(r.t, r.H);
  check(`lv: prey peaks at 2.71 … 44.43 (${pk.map((x) => x.toFixed(2))})`, pk.length === 6 && near(pk[0], 2.71, 1e-9) && near(pk[5], 44.43, 1e-9));
  check('lv: period 8.344 as find_peaks', near(L.period(pk), 8.344, 1e-9));
  check('lv: highest prey 275.25, predators 154.66', near(Math.max(...r.H), 275.24680414621173, 1e-5) && near(Math.max(...r.P), 154.65708077284287, 1e-5));
  const I0 = L.invariant(p, 40, 10), I1 = L.invariant(p, r.H[5000], r.P[5000]);
  check('lv: conserved quantity kept to 1e-8 over 50 time units', Math.abs(I1 - I0) < 1e-8);
  check('lv: equilibrium 80, 50', L.equilibrium(p).H === 80 && near(L.equilibrium(p).P, 50, 1e-12));
  const k = { ...p, K: 300 }, rk = L.simulate(k, 40, 10, 50, 0.01);
  check('lv: with K = 300, t = 50 matches scipy (79.894, 36.646)', near(rk.H[5000], 79.89437049, 1e-6) && near(rk.P[5000], 36.64566452, 1e-6));
  check('lv: with K = 300 equilibrium 80, 36.67', near(L.equilibrium(k).P, 0.7333333333333334 / 0.02, 1e-12));
  check('lv: K below d/c has no predator equilibrium', L.equilibrium({ ...p, K: 60 }) === null);
  check('lv: small-cycle period 2π/√(ad)', near(L.smallPeriod(p), 7.024814731040727, 1e-12));
};
