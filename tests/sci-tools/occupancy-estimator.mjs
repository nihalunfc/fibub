// #307 occupancy: reference values from an independent Python fit (SciPy 1.x optimize.minimize BFGS on the
// MacKenzie et al. 2002 likelihood, finite-difference Hessian, scipy.stats.norm) of the same made-up histories.
import { fitOccupancy } from '../../src/lib/sci/occupancy.ts';
const DATA = `Site 1	0	0	0	0
Site 2	0	0	0	0
Site 3	1	0	0	0
Site 4	1	1	0	-
Site 5	0	1	1	0
Site 6	1	0	1	0
Site 7	1	0	0	1
Site 8	0	0	0	0
Site 9	1	0	1	0
Site 10	0	0	0	0
Site 11	0	0	0	0
Site 12	0	0	0	0
Site 13	0	1	0	0
Site 14	0	0	0	0
Site 15	0	0	0	0
Site 16	0	0	0	0
Site 17	0	1	0	1
Site 18	0	1	-	0
Site 19	0	0	0	0
Site 20	0	1	0	1
Site 21	0	1	1	1
Site 22	1	0	0	0
Site 23	0	-	0	0
Site 24	0	1	0	0
Site 25	0	0	0	0
Site 26	0	0	0	0
Site 27	1	1	0	0
Site 28	0	0	0	0
Site 29	0	0	0	0
Site 30	1	0	1	0`;
const H = DATA.split('\n').map((l) => l.split('\t').slice(1).map((c) => (c === '-' ? null : Number(c))));

export default async (check) => {
  const close = (a, b, rel = 1e-4) => Math.abs(a - b) <= rel * Math.max(1, Math.abs(b));
  const f = fitOccupancy(H, 'dot');
  check('occupancy: 30 sites, 4 surveys, naive 0.5', f.sites === 30 && f.surveys === 4 && f.detected === 15 && f.naive === 0.5);
  check('occupancy: ψ(.)p(.) ψ = 0.59171, p = 0.37820, AIC 121.497', close(f.psi.est, 0.5917112801491774) && close(f.p[0].est, 0.37819848477295953) && close(f.aic, 121.49700287007613, 1e-8));
  check('occupancy: SEs 0.12039 and 0.07824 (delta method)', close(f.psi.se, 0.12038535912162776, 2e-3) && close(f.p[0].se, 0.07824399584084916, 2e-3));
  check('occupancy: ψ 95 % CI 0.3531 to 0.7938 on the logit scale', close(f.psi.lo, 0.3530593687261967, 2e-3) && close(f.psi.hi, 0.7937544634455831, 2e-3));
  check('occupancy: p* 0.85051, empty sites occupied with chance 0.17807, expected 17.751 occupied', close(f.pStar, 0.8505117340831444) && close(f.condPsi[0], 0.1780678582232887) && close(f.expectedOccupied, 17.751338987276405, 1e-4));
  const t = fitOccupancy(H, 'time');
  check('occupancy: ψ(.)p(t) AIC 123.808, ψ 0.58636', close(t.aic, 123.80776872757733, 1e-7) && close(t.psi.est, 0.5863625100251929, 1e-4));
  check('occupancy: p(t) = 0.4548, 0.5202, 0.3014, 0.2411', [0.4547812403186334, 0.520225077054365, 0.3013704224175772, 0.2410963773241558].every((v, j) => close(t.p[j].est, v, 1e-4)) && close(t.p[3].hi, 0.5085297529146021, 2e-3));
  let threw = 0; for (const h of [[[0, 0], [0, 0]], [[1], [0]]]) { try { fitOccupancy(h); } catch { threw++; } }
  check('occupancy: no detections and single surveys are rejected', threw === 2);
  const all = fitOccupancy([[1, 0, 1], [1, 1, 0], [0, 1, 1]]);
  check('occupancy: every site detected puts ψ on the boundary', all.boundary && all.psi.est > 0.999);
};
