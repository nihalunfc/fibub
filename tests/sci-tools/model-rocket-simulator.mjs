// #670 model rocket simulator. Checked against an independent SciPy solve_ivp script (RK45, rtol 1e-10,
// max_step 2 ms) that integrates height, velocity and delivered impulse as ODE states, with its own numerically
// integrated standard atmosphere.
import { simulate, readCurve, shapeCurve, totalImpulse, impulseTo, thrustAt, motorClass, EXAMPLE_CURVE } from '../../src/lib/sci/eng-rocketsim.ts';

export default async (check) => {
  const near = (a, b, t) => Math.abs(a - b) <= t;
  const c = readCurve(EXAMPLE_CURVE).curve;
  check('rocket: example curve impulse 8.335 N·s, class C', near(totalImpulse(c), 8.335, 1e-12) && motorClass(8.335) === 'C');
  check('rocket: motor classes', motorClass(2.5) === 'A' && motorClass(2.51) === 'B' && motorClass(5) === 'B' && motorClass(40) === 'E' && motorClass(0.5) === '1/4A' && motorClass(640) === 'I');
  check('rocket: thrust interpolation and partial impulse', near(thrustAt(c, 0.085), 11.5, 1e-12) && near(impulseTo(c, 0.05), 0.225, 1e-12) && thrustAt(c, 2) === 0);
  const s = simulate({ mass: 0.12, prop: 0.0108, d: 0.025, cd: 0.75, curve: c, delay: 4 });
  check('rocket: example apogee 163.3096 m at 6.24907 s (SciPy)', near(s.apogee.h, 163.30957, 0.002) && near(s.apogee.t, 6.249071, 1e-4));
  check('rocket: example top speed 51.7534 m/s (SciPy)', near(s.maxV, 51.753379, 1e-3));
  check('rocket: example burnout 56.5296 m at 51.2506 m/s (SciPy)', near(s.burnout.h, 56.52961, 0.002) && near(s.burnout.v, 51.25056, 0.002));
  check('rocket: best delay = apogee − burnout', near(s.bestDelay, s.apogee.t - 1.75, 1e-12) && near(s.ejection.t, 5.75, 1e-6) && s.ejection.v > 0);
  const hot = simulate({ mass: 0.12, prop: 0.0108, d: 0.025, cd: 0.75, curve: c, elev: 1500, dT: 15 });
  check('rocket: 1500 m site, ISA+15 apogee 170.2065 m (SciPy)', near(hot.apogee.h, 170.20652, 0.002) && near(hot.apogee.t, 6.406439, 1e-4));
  const big = simulate({ mass: 3, prop: 0.9, d: 0.075, cd: 0.6, curve: { t: [0, 0.1, 2.9, 3.0], F: [0, 300, 300, 0] } });
  check('rocket: 3 kg J-class flight apogee 1674.022 m, top speed 265.288 m/s (SciPy)', near(big.apogee.h, 1674.0223, 0.01) && near(big.maxV, 265.28816, 0.005) && big.motorClass === 'J');
  check('rocket: no drag, constant mass matches the closed form', (() => { const r = simulate({ mass: 1, prop: 0, d: 0.01, cd: 0, curve: { t: [0, 1e-9, 1, 1 + 1e-9], F: [0, 29.42, 29.42, 0] } }); const a = 29.42 / 1 - 9.80665, v = a * 1, h = 0.5 * a + v * v / (2 * 9.80665); return near(r.apogee.h, h, 1e-3) && near(r.maxV, v, 0.02); })());
  check('rocket: too heavy never lifts', !simulate({ mass: 2, prop: 0.01, d: 0.025, cd: 0.75, curve: c }).lifted);
  const sh = shapeCurve('spike', 10, 1.7);
  check('rocket: made-up shapes integrate to the impulse', near(totalImpulse(sh), 10, 1e-9) && near(totalImpulse(shapeCurve('flat', 20, 2)), 20, 1e-9) && near(totalImpulse(shapeCurve('regressive', 5, 1)), 5, 1e-9));
  check('rocket: curve reader skips headers, adds 0,0 and refuses bad order', readCurve('Made-up M1 18 70 4 0.01 0.02 X\n0.1 5\n0.5 4').skipped === 1 && readCurve('0.1 5\n0.5 4').curve.t[0] === 0 && !!readCurve('0 1\n0.5 4\n0.4 3').error);
};
