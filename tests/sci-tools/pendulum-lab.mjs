// #1351 pendulum-lab: checked against Python (numpy polyfit for the g fit; a fine-step RK4 integration and the
// textbook series T₀(1 + θ²/16 + 11θ⁴/3072 + 173θ⁶/737280) for the large-swing period).
import { smallPeriod, exactPeriod, largeAngleExcess, pendulumStep, lengthFor, gFrom, fitG, agm } from '../../src/lib/sci/n2-osc.ts';
export default async (check) => {
  const near = (a, b, tol = 1e-9) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
  check('pendulum: 1 m on Earth (9.8) T₀ = 2.00709 s', near(smallPeriod(1, 9.8), 2.007089923154493));
  check('pendulum: AGM(1, √2/2) = 0.847213', near(agm(1, Math.SQRT1_2), 0.8472130847939790, 1e-12));
  check('pendulum: 60° swing on 1 m: T = 2.15397 s (Python RK4 gave 2.153973)', near(exactPeriod(1, 9.8, Math.PI / 3), 2.153972792260946, 1e-6));
  check('pendulum: 60° series to θ⁶ agrees within 0.003 %', Math.abs(exactPeriod(1, 9.8, Math.PI / 3) / 2.1539175507984254 - 1) < 3e-5);
  check('pendulum: 10° swing is 0.19 % longer', Math.abs(largeAngleExcess((10 * Math.PI) / 180) * 100 - 0.1907) < 0.001);
  check('pendulum: 90° swing is 18.0 % longer (K(1/√2) form)', Math.abs(largeAngleExcess(Math.PI / 2) * 100 - 18.034) < 0.01);
  // Our own RK4 step reproduces the exact period at 120°
  { const g = 9.8, L = 0.5, th0 = (2 * Math.PI) / 3, dt = 1e-4; let s = { th: th0, w: 0 }, t = 0;
    while (true) { const n = pendulumStep(s.th, s.w, dt, g, L); if (n.th < 0) { t += (s.th / (s.th - n.th)) * dt; break; } s = n; t += dt; }
    check('pendulum: RK4 quarter period × 4 matches the AGM period at 120°', Math.abs(4 * t / exactPeriod(L, g, th0) - 1) < 1e-6); }
  check('pendulum: seconds pendulum (T = 2 s) is 0.9929 m', near(lengthFor(2, 9.8), 0.9929475996949103));
  check('pendulum: g from 1 m and 2.007 s', near(gFrom(1, smallPeriod(1, 9.8)), 9.8));
  const f = fitG([0.2, 0.4, 0.6, 0.8, 1.0], [0.9, 1.27, 1.55, 1.8, 2.01]);
  check('pendulum: example fit slope 4.04365, intercept −0.00509 (numpy polyfit)', near(f.b, 4.043650000000001, 1e-9) && Math.abs(f.a + 0.00509) < 1e-9);
  check('pendulum: example g = 9.7631 ± 0.0489 m/s², r² 0.99992 (numpy)', near(f.g, 9.763064954770423, 1e-9) && Math.abs(f.se_g - 0.0489126448384938) < 1e-9 && Math.abs(f.r2 - 0.999924706325837) < 1e-9);
};
