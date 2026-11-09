// #902 pendulum analyser: checked against SciPy ellipk, a SymPy series of 2K(sin(θ/2))/π, and NumPy/SciPy least squares (linregress, t quantiles).
import { ellipK, largeFactor, seriesFactor, smallPeriod, fitG } from '../../src/lib/sci/phpendulum.ts';
export default async (check) => {
  const near = (a, b, rel) => Math.abs(a - b) <= rel * Math.abs(b);
  check('pendulum: K(0) = π/2 and K(sin 45°) = 1.854075 (Abramowitz and Stegun)', near(ellipK(0), Math.PI / 2, 1e-15) && near(ellipK(Math.SQRT1_2), 1.8540746773013719, 1e-13));
  const ref = { 5: 1.000476172485987, 10: 1.0019071881432167, 15: 1.0043005791734652, 30: 1.017408797595956, 60: 1.0731820071493645, 90: 1.180340599016096, 170: 2.4393627196738854 };
  check('pendulum: large-angle factor matches SciPy at 5° to 170°', Object.entries(ref).every(([d, v]) => near(largeFactor(+d), v, 1e-12)));
  check('pendulum: series 1 + θ²/16 + 11θ⁴/3072 (SymPy) agrees at 10° to 1e-7', Math.abs(seriesFactor(10) - largeFactor(10)) < 1e-7 && seriesFactor(0) === 1);
  check('pendulum: 2π√(L/g) for 1 m at 9.81', near(smallPeriod(1, 9.81), 2.0060666807106475, 1e-14));
  const L = [0.2, 0.4, 0.6, 0.8, 1.0, 1.2], T = [0.909, 1.264, 1.562, 1.8, 2.013, 2.206], A = L.map(() => 15);
  const o = fitG(L, T, A);
  check('pendulum: through-origin fit g = 9.82503 ± 0.01683', near(o.g, 9.825026300339157, 1e-10) && near(o.ug, 0.016831924471943562, 1e-8));
  check('pendulum: 95 % interval 9.7819 to 9.8685 (t, 5 df)', near(o.ci95[0], 9.781948170205583, 1e-6) && near(o.ci95[1], 9.868485527106769, 1e-6));
  const f = fitG(L, T, A, true);
  check('pendulum: with offset g = 9.82681 ± 0.04292 (linregress)', near(f.g, 9.826805660850985, 1e-10) && near(f.ug, 0.042917280820379856, 1e-8));
  check('pendulum: intercept 0.000631 ± 0.01367 s², R² 0.999924', near(f.intercept, 0.0006305647504500911, 1e-6) && near(f.uIntercept, 0.01366602675167006, 1e-8) && near(f.r2, 0.9999237101925318, 1e-10));
  check('pendulum: length offset 0.157 ± 3.40 mm (covariance propagation)', near(f.offset, 0.00015695758936832644, 1e-6) && near(f.uOffset, 0.003402307359605478, 1e-8));
  check('pendulum: without the amplitude correction g is 9.741', near(fitG(L, T).g, 9.741061725219582, 1e-10));
};
