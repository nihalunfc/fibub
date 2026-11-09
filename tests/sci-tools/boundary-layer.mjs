// #960 boundary layer: Blasius solution against SciPy solve_bvp; plate formulas against a NumPy script.
import { blasius, local, plateCD } from '../../src/lib/sci/phbl.ts';
export default async (check) => {
  const near = (a, b, r) => Math.abs(a / b - 1) < r;
  const b = blasius();
  check("bl: Blasius f''(0) = 0.332057 (SciPy solve_bvp 0.33205734)", near(b.fpp0, 0.33205734, 1e-6));
  check('bl: Blasius η at 99 % speed 4.90999 (SciPy)', near(b.eta99, 4.9099895, 1e-6));
  check('bl: displacement integral 1.72079 and momentum integral 0.66411 (SciPy quad)', near(b.dstar, 1.7207877, 1e-5) && near(b.theta, 0.6641147, 1e-5));
  check('bl: profile u/U = 0.629766 at η = 2 (SciPy)', near(b.profile.find((p) => Math.abs(p[0] - 2) < 1e-6)[1], 0.6297657, 1e-6));
  const l = local(0.5, 10, 1.516e-5, 'auto', 5e5);
  check('bl: laminar at x = 0.5 m in 10 m/s air: δ 4.275 mm, cf 0.001156', l.laminar && near(l.delta, 0.0042747942, 1e-5) && near(l.cf, 0.0011563995, 1e-5) && near(l.H, 2.591, 1e-3));
  const t = local(1, 10, 1.516e-5, 'auto', 5e5);
  check('bl: turbulent at x = 1 m: δ = 0.37x Re^−0.2 = 25.37 mm, cf = 0.0592 Re^−0.2', !t.laminar && near(t.delta, 0.0253712325, 1e-8) && near(t.cf, 0.0040593972, 1e-8) && near(t.H, 9 / 7, 1e-12));
  const m = plateCD((10 * 2) / 1.516e-5, 'auto', 5e5);
  check('bl: mixed plate CD with A = 1742 (textbook 1742), CD 0.00309658 (NumPy with 4 f2(0) = 1.32823)', near(m.A, 1742.4848, 1e-6) && near(m.CD, 0.0030965847, 1e-6));
  const s = plateCD(1e8, 'auto', 5e5, 'schlichting');
  check('bl: Prandtl-Schlichting mixed CD at Re 1e8: 0.00211219 (NumPy)', near(s.CD, 0.0021121947, 1e-6));
  check('bl: forced laminar and turbulent plate CD', near(plateCD(1e6, 'laminar', 5e5).CD, 1.32822934 / 1000, 1e-6) && near(plateCD(1e6, 'turbulent', 5e5).CD, 0.074 * 1e6 ** -0.2, 1e-12));
  check('bl: plate shorter than the transition length stays laminar', plateCD(4e5, 'auto', 5e5).A === 0);
};
