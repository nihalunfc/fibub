// #1363 Ksp precipitation predictor. Checked against NumPy (polynomial roots and closed forms): AgCl s = 1.3416e-5,
// CaF₂ s = 2.1363e-4, Ag₂CrO₄ s = 6.5030e-5 mol/L; PbI₂ in 0.1 M I⁻ s = 7.0998e-7; AgCl in 0.01 M Cl⁻ s = 1.8e-8;
// 10 mL 1e-4 M Ag⁺ + 10 mL 1e-4 M Cl⁻ precipitates 3.6584e-5 mol/L; 50 mL 0.01 M Pb²⁺ + 50 mL 0.02 M I⁻ gives 3.7892e-3.
import * as K from '../../src/lib/sci/ksp-precipitation.ts';
const near = (a, b, t = 1e-6) => Number.isFinite(a) && Math.abs(a - b) <= t * Math.abs(b);
export default async (check) => {
  check('ksp: AgCl solubility √Ksp (NumPy)', near(K.solubility(1, 1, 1.8e-10), 1.3416407864998738e-05, 1e-12));
  check('ksp: CaF₂ solubility (Ksp/4)^(1/3)', near(K.solubility(1, 2, 3.9e-11), 0.00021363293408489594, 1e-12));
  check('ksp: Ag₂CrO₄ solubility (Ksp/4)^(1/3)', near(K.solubility(2, 1, 1.1e-12), 6.502957234256938e-05, 1e-12));
  check('ksp: PbI₂ in 0.1 M iodide (NumPy cubic root)', near(K.solubility(1, 2, 7.1e-9, 0, 0.1), 7.099798370020898e-07, 1e-9));
  check('ksp: AgCl in 0.01 M chloride (NumPy)', near(K.solubility(1, 1, 1.8e-10, 0, 0.01), 1.799996760011664e-08, 1e-9));
  const m = K.mix(1e-4, 10, 1e-4, 10);
  check('ksp: mixing halves both concentrations', near(m.M, 5e-5, 1e-12) && near(m.X, 5e-5, 1e-12) && m.V === 20);
  check('ksp: Q = 2.5e-9 > Ksp for AgCl', near(K.ionicProduct(m.M, m.X, 1, 1), 2.5e-9, 1e-12));
  const p = K.precipitate(m.M, m.X, 1, 1, 1.8e-10);
  check('ksp: AgCl precipitate 3.6584e-5 mol/L (NumPy)', near(p.x, 3.658359213500127e-05, 1e-9) && near(p.M * p.X, 1.8e-10, 1e-8));
  const q = K.precipitate(0.005, 0.01, 1, 2, 7.1e-9);
  check('ksp: PbI₂ precipitate 3.7892e-3 mol/L (NumPy)', near(q.x, 0.0037892175449980893, 1e-9));
  check('ksp: no precipitate when Q ≤ Ksp', K.precipitate(1e-6, 1e-6, 1, 1, 1.8e-10).x === 0);
};
