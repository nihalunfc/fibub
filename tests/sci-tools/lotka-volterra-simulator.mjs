// #304 Lotka-Volterra simulator: trajectories checked against SciPy 1.x solve_ivp (RK45, rtol = atol = 1e-12),
// equilibrium eigenvalues against numpy.linalg.eigvals, the period against scipy.signal.find_peaks.
import { predPrey, compete, rk4, predPreyEquilibria, competeEquilibria, competeOutcome, ppInvariant, meanPeriod } from '../../src/lib/sci/lotkav.ts';

export default async (check) => {
  const close = (a, b, rel = 1e-6) => Math.abs(a - b) <= rel * Math.max(1, Math.abs(b));
  const p = { alpha: 1, beta: 0.1, delta: 0.075, gamma: 1.5, K: Infinity };
  const s = rk4(predPrey(p), 10, 5, 50, 5000);
  check('lotka: predator-prey at t = 50 matches solve_ivp (15.02125, 3.35883)', close(s.x[5000], 15.02125224614369) && close(s.y[5000], 3.358833789009081));
  check('lotka: predator-prey at t = 20 matches solve_ivp (15.90466, 22.63053)', close(s.x[2000], 15.90465857732075) && close(s.y[2000], 22.630530399188395));
  const v0 = ppInvariant(p, 10, 5), drift = Math.max(...Array.from(s.x, (x, i) => Math.abs(ppInvariant(p, x, s.y[i]) - v0)));
  check('lotka: conserved quantity stays constant along the orbit (drift < 1e-6)', drift < 1e-6);
  const per = meanPeriod(s.t, s.x);
  check('lotka: prey period 5.4797 over 9 peaks (find_peaks)', per.peaks === 9 && close(per.period, 5.47971875, 1e-4));
  const e = predPreyEquilibria(p);
  check('lotka: classic equilibria (0,0) saddle and (20,10) centre', e.length === 2 && e[0].kind === 'saddle' && e[1].kind === 'centre' && close(e[1].x, 20) && close(e[1].y, 10) && close(e[1].eig[0].im, Math.sqrt(1.5)));
  const pk = { ...p, K: 200 }, sk = rk4(predPrey(pk), 10, 5, 50, 5000), ek = predPreyEquilibria(pk);
  check('lotka: prey limited by K = 200 matches solve_ivp (19.52115, 8.35195)', close(sk.x[5000], 19.521149713790756) && close(sk.y[5000], 8.351946772977058));
  check('lotka: with K the coexistence point (20, 9) is a stable spiral, eigenvalues −0.05 ± 1.16082i', ek.length === 3 && ek[2].kind === 'stable spiral' && close(ek[2].y, 9) && close(ek[2].eig[0].re, -0.05) && close(Math.abs(ek[2].eig[0].im), 1.16081868, 1e-7) && ek[1].kind === 'saddle');
  const c = { r1: 0.8, r2: 0.6, K1: 500, K2: 400, a12: 0.6, a21: 0.7 }, sc = rk4(compete(c), 20, 20, 40, 4000), ec = competeEquilibria(c);
  check('lotka: competition at t = 40 matches solve_ivp (445.6464, 90.14425)', close(sc.x[4000], 445.64640134228523) && close(sc.y[4000], 90.14424943186201));
  const co = ec.find((q) => q.name === 'Coexistence');
  check('lotka: coexistence at (448.276, 86.207), stable node with eigenvalues −0.77735 and −0.06920', co && close(co.x, 448.27586206896547) && close(co.y, 86.20689655172413) && co.kind === 'stable node' && close(co.eig[0].re, -0.06920051, 1e-6) && close(co.eig[1].re, -0.77735121, 1e-6));
  check('lotka: competition outcomes from isocline intercepts', competeOutcome(c) === 'coexist' && competeOutcome({ ...c, a21: 1.2 }) === 'one' && competeOutcome({ ...c, a12: 1.5 }) === 'two' && competeOutcome({ ...c, a12: 1.5, a21: 1.2 }) === 'either');
  const ee = competeEquilibria({ ...c, a12: 1.5, a21: 1.2 }).find((q) => q.name === 'Coexistence');
  check('lotka: founder control makes coexistence a saddle', ee && ee.kind === 'saddle');
};
