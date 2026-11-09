// #1062 shm-circle: checked against Python (math) and a numerical integration of m x'' = −k x.
import { omegaFromPeriod, springPeriod, pendulumPeriod, shmState, shmEnergy, speedAt } from '../../src/lib/sci/learnshm.ts';
export default async (check) => {
  const near = (a, b, tol = 1e-9) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
  check('shm: spring 0.5 kg, 20 N/m: T = 0.99346 s', near(springPeriod(0.5, 20), 0.9934588265796101));
  check('shm: pendulum 1 m, 9.8: T = 2.00709 s', near(pendulumPeriod(1, 9.8), 2.007089923154493));
  check('shm: ω for T = 2 s is π', near(omegaFromPeriod(2), Math.PI));
  const s = shmState(0.1, Math.PI, Math.PI / 6, 0.25);
  check('shm: x(0.25) = 0.1 cos(75°) = 0.025882', near(s.x, 0.025881904510252074));
  check('shm: v(0.25) = −0.303455', near(s.v, -0.30345454797823873));
  check('shm: a = −ω² x', near(s.a, -Math.PI * Math.PI * s.x));
  const e = shmEnergy(0.5, 2 * Math.PI, 0.1, 0.05);
  check('shm: k = mω², E = ½kA² = 0.098696 J', near(e.k, 0.5 * 4 * Math.PI ** 2) && near(e.E, 0.09869604401089358));
  check('shm: KE + PE = E and KE = ½mv²', near(e.KE + e.PE, e.E) && near(e.KE, 0.5 * 0.5 * speedAt(0.1, 2 * Math.PI, 0.05) ** 2));
  // Integrate m x'' = −k x with a small-step velocity Verlet and compare with the formula after one period.
  const m = 0.5, k = 20, w = Math.sqrt(k / m), T = springPeriod(m, k), n = 200000, dt = T / n;
  let x = 0.1, v = 0;
  for (let i = 0; i < n; i++) { const a0 = (-k * x) / m; x += v * dt + 0.5 * a0 * dt * dt; const a1 = (-k * x) / m; v += 0.5 * (a0 + a1) * dt; }
  check('shm: integration returns to x = A after one period', near(x, 0.1, 1e-6) && Math.abs(v) < 1e-5);
  check('shm: ω = √(k/m)', near(w, omegaFromPeriod(T)));
};
