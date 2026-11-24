// #901 projectile with drag: checked against SciPy solve_ivp (RK45, rtol 1e-12) with event detection, and closed-form no-drag results.
import { simulate, vacuum, bestAngle, terminalSpeed } from '../../src/lib/sci/phprojectile.ts';
export default async (check) => {
  const near = (a, b, rel) => Math.abs(a - b) <= rel * Math.abs(b);
  const A = Math.PI * 0.037 ** 2, ball = { v0: 40, angle: 35, h0: 1, m: 0.145, Cd: 0.35, A };
  const r = simulate(ball);
  check('projectile: example range vs SciPy (94.8501 m)', near(r.range, 94.85012733, 1e-5));
  check('projectile: example time of flight (4.10186 s)', near(r.tof, 4.10186072, 1e-5));
  check('projectile: example apex (21.2472 m at x 51.748 m)', near(r.apex, 21.24716084, 1e-5) && near(r.xApex, 51.74824618, 1e-4));
  check('projectile: impact speed and angle (24.826 m/s, 47.72°)', near(r.impactSpeed, 24.82581273, 1e-5) && near(r.impactAngle, 47.72114635, 1e-5));
  const hw = simulate({ ...ball, wind: -5 }), tw = simulate({ ...ball, wind: 5 });
  check('projectile: 5 m/s headwind range 84.413 m', near(hw.range, 84.41341503, 1e-5));
  check('projectile: 5 m/s tailwind range 104.911 m, apex 21.779 m', near(tw.range, 104.91052244, 1e-5) && near(tw.apex, 21.77893696, 1e-5));
  const c = simulate({ v0: 100, angle: 45, h0: 0, m: 5, Cd: 0.47, A: Math.PI * 0.05 ** 2 });
  check('projectile: heavy ball from the ground, range 761.48 m, apex 215.97 m', near(c.range, 761.48338392, 1e-5) && near(c.apex, 215.97158584, 1e-5));
  const v = simulate({ v0: 20, angle: 30, m: 1, Cd: 0, A: 0 }), vv = vacuum(20, 30);
  check('projectile: no drag matches v²sin2θ/g = 35.324 m', near(v.range, 35.3240058, 1e-9) && near(vv.range, 35.3240058, 1e-9) && near(v.apex, 5.09858106, 1e-9));
  check('projectile: from a height, no drag closed form', near(simulate({ v0: 10, angle: 0, h0: 20, m: 1, Cd: 0, A: 0 }).range, 10 * Math.sqrt(40 / 9.80665), 1e-9));
  const b = bestAngle({ v0: 40, h0: 1, m: 0.145, Cd: 0.35, A });
  check('projectile: best angle 40.57° gives 96.278 m (SciPy bounded search)', Math.abs(b.angle - 40.5696) < 0.02 && near(b.range, 96.2784149, 1e-5));
  check('projectile: best angle with no drag from the ground is 45°', Math.abs(bestAngle({ v0: 20, m: 1, Cd: 0, A: 0 }).angle - 45) < 0.01);
  check('projectile: terminal speed √(2mg/ρCdA) = 39.272 m/s', near(terminalSpeed(ball), 39.27178214, 1e-8));
  freeThrow(check);
};
// Added with /blog/discoveries/basketball-free-throw-release-trajectory-check/: the group mean release
// conditions of a made free throw (Wang et al. 2026) flown as a size-7 basketball with Cd 0.5.
function freeThrow(check) {
  const near = (a, b, rel) => Math.abs(a - b) <= rel * Math.abs(b);
  const ball = { v0: 7.82, angle: 52.2, h0: 2.28, m: 0.6235, Cd: 0.5, A: Math.PI * 0.12065 ** 2 };
  const r = simulate(ball, 4000);
  check('free throw: range to the floor 6.6963 m, apex 4.1131 m, flight 1.53968 s', near(r.range, 6.69627132, 1e-6) && near(r.apex, 4.11311657, 1e-6) && near(r.tof, 1.53968097, 1e-6));
  let x = NaN;
  for (let i = 1; i < r.y.length; i++) if (r.vy[i] < 0 && (r.y[i - 1] - 3.048) * (r.y[i] - 3.048) <= 0) { const f = (3.048 - r.y[i - 1]) / (r.y[i] - r.y[i - 1]); x = r.x[i - 1] + f * (r.x[i] - r.x[i - 1]); break; }
  check('free throw: crosses ring height (3.048 m) at 4.8082 m, 0.62 m past the ring', near(x, 4.80816730, 1e-5));
  const slower = simulate({ ...ball, v0: 7.3326686 }, 4000);
  let x2 = NaN;
  for (let i = 1; i < slower.y.length; i++) if (slower.vy[i] < 0 && (slower.y[i - 1] - 3.048) * (slower.y[i] - 3.048) <= 0) { const f = (3.048 - slower.y[i - 1]) / (slower.y[i] - slower.y[i - 1]); x2 = slower.x[i - 1] + f * (slower.x[i] - slower.x[i - 1]); break; }
  check('free throw: 7.3327 m/s drops it on the ring centre, 4.191 m', Math.abs(x2 - 4.191) < 2e-4);
};
