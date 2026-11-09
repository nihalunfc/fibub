// #852 thermal mismatch stress: checked against SciPy (integrate.quad for the thermal strain with a CTE linear in T,
// brentq for the gap-closing temperature) and NumPy (a multilayer beam solved by trapezoid integration through the
// thickness and numpy.linalg.solve), plus Timoshenko's closed form and the Stoney thin-film limit.
import { thermalStrain, filmStress, stoneyStress, stoneyCurvature, bowToCurvature, curvatureToBow, timoshenko, multilayer, constrainedBar } from '../../src/lib/sci/thermalstress.ts';

export default async (check) => {
  const near = (a, b, rel) => Math.abs(a - b) <= rel * Math.abs(b);
  const film = { a0: 23e-6, a1: 0.02e-6, Tref: 20 }, sub = { a0: 3e-6, a1: 0.004e-6, Tref: 20 };
  check('thermal: ∫α(T) dT with linear CTE matches scipy quad', near(thermalStrain(film, 300, 20), -0.007224, 1e-12) && near(thermalStrain({ a0: 1e-5 }, 0, 100), 1e-3, 1e-14));
  check('thermal: thermal strain with linear CTE equals α at the mid temperature × ΔT', near(thermalStrain(film, 100, 400), (23e-6 + 0.02e-6 * (250 - 20)) * 300, 1e-13));
  const f = filmStress(70000, 0.33, film, sub, 300, 20);
  check('thermal: film stress E/(1 − ν) Δε matches numpy', near(f.sigma, 650.602985074627, 1e-13) && f.sigma > 0);
  check('thermal: Stoney curvature from the film stress', near(stoneyCurvature(130000, 0.28, 0.5, 1e-3, f.sigma), 8.648015063145811e-05, 1e-13));
  check('thermal: Stoney stress and curvature are inverses', near(stoneyStress(130000, 0.28, 0.5, 1e-3, stoneyCurvature(130000, 0.28, 0.5, 1e-3, 123)), 123, 1e-13));
  { const ml = multilayer([{ E: 130000 / 0.72, t: 0.5, eps: thermalStrain(sub, 300, 20) }, { E: 70000 / 0.67, t: 1e-3, eps: thermalStrain(film, 300, 20) }]);
    check('thermal: full beam solution of a thin film tends to Stoney (within 0.5 %)', near(-ml.k, 8.648015063145811e-05, 5e-3) && near(ml.stress[1].bottom, f.sigma, 5e-3)); }
  check('thermal: Stoney limit closes in as the film thins', (() => { const g = (hf) => { const ml = multilayer([{ E: 1e5, t: 0.5, eps: 0 }, { E: 1e5, t: hf, eps: -1e-3 }]); return Math.abs(-ml.k / stoneyCurvature(1e5, 0, 0.5, hf, 100) - 1); }; return g(1e-4) < g(1e-3) && g(1e-3) < g(1e-2) && g(1e-4) < 2e-3; })());
  check('thermal: bow and curvature of a spherical cap', near(bowToCurvature(0.05, 100), 2 * 0.05 / (2500 + 0.0025), 1e-15) && near(curvatureToBow(bowToCurvature(0.08, 150), 150), 0.08, 1e-9) && near(curvatureToBow(-1e-5, 100), -1e-5 * 2500 / 2, 1e-4));
  const dε = (19e-6 - 1.5e-6) * 100, t = timoshenko(140000, 0.5, 110000, 0.5, dε);
  check('thermal: Timoshenko bimetal curvature', near(t, 0.002615446825717752, 1e-13));
  { const ml = multilayer([{ E: 140000, t: 0.5, eps: 1.5e-4 }, { E: 110000, t: 0.5, eps: 19e-4 }]);
    check('thermal: beam solution equals Timoshenko for two layers', near(ml.k, t, 1e-12));
    check('thermal: no net force or moment in the strip', Math.abs(ml.stress.reduce((s, x) => s + (x.bottom + x.top) / 2 * 0.5, 0)) < 1e-9); }
  check('thermal: Timoshenko for equal layers, m = n = 1: κ = 3Δε/(2h)', near(timoshenko(1e5, 1, 1e5, 1, 1e-3), (3 * 1e-3) / (2 * 2), 1e-14));
  { const ml = multilayer([{ E: 200000, t: 0.3, eps: 1e-3 }, { E: 70000, t: 0.8, eps: -5e-4 }, { E: 3000, t: 0.2, eps: 2e-3 }]);
    check('thermal: three-layer beam matches numpy trapezoid solve', near(ml.k, -0.0018371292518105586, 1e-8) && near(ml.stress[0].bottom, 11.101823325167281, 1e-7) && near(ml.stress[1].bottom, 70.30592387578683, 1e-7) && near(ml.stress[2].top, -9.998276732183669, 1e-7)); }
  check('thermal: fully held bar σ = −E α ΔT', near(constrainedBar(200000, { a0: 12e-6 }, 20, 70, 1000).sigma, -120, 1e-13) && near(constrainedBar(200000, { a0: 12e-6 }, 70, 20, 1000).sigma, 120, 1e-13));
  { const b = constrainedBar(200000, { a0: 12e-6, a1: 0.01e-6 }, 20, 120, 1000, 0.5);
    check('thermal: bar with a gap: stress and closing temperature match scipy', near(b.sigma, -150, 1e-13) && near(b.closeT, 60.967364599085656, 1e-11)); }
  check('thermal: bar with a gap that does not close, or cooling away from the wall, is stress-free', constrainedBar(200000, { a0: 12e-6 }, 20, 50, 1000, 0.5).sigma === 0 && constrainedBar(200000, { a0: 12e-6 }, 50, 20, 1000, 0.5).sigma === 0);
};
