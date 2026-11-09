// #340 von Bertalanffy growth fit. Reference values from SciPy 1.x scipy.optimize.curve_fit (covariance scaled by
// the residual variance) and scipy.stats.linregress for the Ford-Walford line, on made-up length-at-age data.
import { fitVB, fordWalford, vb } from '../../src/lib/sci/vbgf.ts';
const D = '1,16.2|1,14.7|1,17.7|1,19.6|1,21.6|1,18.7|2,25.5|2,24.8|2,29.1|2,31.6|2,27.8|2,23.6|2,24.3|2,31.5|3,34.5|3,29.1|3,33.7|3,30.7|3,32.2|3,32.6|3,31.9|3,35.5|4,39.3|4,37.8|4,40.6|4,41.8|4,34.9|4,38.7|4,36.7|5,43.4|5,40.3|5,44.0|5,43.8|5,43.1|5,41.0|6,46.4|6,44.4|6,43.7|6,48.1|6,44.4|7,53.6|7,52.4|7,44.8|7,51.1|8,49.6|8,52.7|8,52.8|9,48.9|9,53.8|10,55.3|'.split('|').filter(Boolean).map((l) => l.split(',').map(Number));
export default async (check) => {
  const near = (a, b, t = 1e-5) => Math.abs(a - b) <= t * Math.max(1, Math.abs(b));
  const f = fitVB(D.map((r) => r[0]), D.map((r) => r[1]));
  check('von Bertalanffy: Linf, K, t0 match curve_fit', near(f.p[0], 60.87826953073528) && near(f.p[1], 0.21225341129376196) && near(f.p[2], -0.6972548780063867));
  check('von Bertalanffy: standard errors match curve_fit', near(f.se[0], 3.113811054564538, 1e-4) && near(f.se[1], 0.030270796842557453, 1e-4) && near(f.se[2], 0.2218183704012468, 1e-4));
  check('von Bertalanffy: 95 % intervals and residual SD', near(f.ci[0][0], 54.61408968016819, 1e-4) && near(f.ci[1][1], 0.27315039968481786, 1e-4) && near(f.ci[2][0], -1.1434958804320905, 1e-4) && near(f.s, 2.4465090510981318));
  check("von Bertalanffy: growth performance phi'", near(f.phi, 2.8957792770359747) && near(fitVB(D.map((r) => r[0]), D.map((r) => r[1] * 10), 0.1).phi, 2.8957792770359747));
  const w = fordWalford(D.map((r) => r[0]), D.map((r) => r[1]));
  check('von Bertalanffy: Ford-Walford line, K and Linf', w.pairs.length === 9 && near(w.b, 0.7998250666156381) && near(w.a, 12.096613597232349) && near(w.K, 0.22336224195571736) && near(w.Linf, 60.430211678928245));
  check('von Bertalanffy: model at t0 is 0', vb(-0.5, [50, 0.3, -0.5]) === 0);
};
