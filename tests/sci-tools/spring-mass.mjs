// #1352 spring-mass: checked against Python, including a step-by-step simulation of two springs (20 and 30 N/m) in
// series with a 0.5 kg mass, which gave a period of 1.28259 s against 2π√(0.5/12) = 1.28255 s.
import { kSeries, kParallel, springT, staticStretch } from '../../src/lib/sci/n2-osc.ts';
export default async (check) => {
  const near = (a, b, tol = 1e-9) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
  check('springs: 20 and 30 in series = 12 N/m, in parallel 50', near(kSeries([20, 30]), 12) && near(kParallel([20, 30]), 50));
  check('springs: equal pair in series halves k', near(kSeries([20, 20]), 10));
  check('springs: three in series 1/(1/10+1/20+1/20) = 5', near(kSeries([10, 20, 20]), 5));
  check('springs: 0.5 kg on 20 N/m: T = 0.99346 s (Python)', near(springT(0.5, 20), 0.9934588265796102));
  check('springs: series 1.40496 s, parallel 0.70248 s, ratio 2', near(springT(0.5, 10), 1.4049629462081452) && near(springT(0.5, 10) / springT(0.5, 40), 2));
  check('springs: rest stretch 0.5 × 9.8 / 20 = 0.245 m', near(staticStretch(0.5, 20), 0.245));
  check('springs: T = 2π√(x/g)', near(springT(0.7, 35), 2 * Math.PI * Math.sqrt(staticStretch(0.7, 35) / 9.8)));
  check('springs: series 20+30 with 0.5 kg matches the simulation (1.28259 s) within 0.01 %', Math.abs(springT(0.5, kSeries([20, 30])) / 1.2825946666248562 - 1) < 1e-4);
};
