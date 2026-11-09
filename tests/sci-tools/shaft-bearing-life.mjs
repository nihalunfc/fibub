// #645 shaft and bearing life: checked against an independent NumPy/SciPy calculation (Goodman diameter by
// root-finding on the von Mises stresses from σ = Mc/I and τ = Tc/J, static diameters by root-finding, the
// reliability factor from scipy.stats.weibull_min) and against the closed forms.
import * as S from '../../src/lib/sci/eng-shaft.ts';
export default async (check) => {
  const near = (a, b, rel = 1e-9) => Math.abs(a - b) <= rel * Math.abs(b);
  check('shaft: L10 = (C/P)^3 and hours (NumPy 390.54 Mrev, 5424.19 h)', near(S.L10(30.7, 4.2, 3), 390.5415586869668) && near(S.hours(S.L10(30.7, 4.2, 3), 1200), 5424.1883150967615));
  check('shaft: roller exponent 10/3 (NumPy 757.93)', near(S.L10(30.7, 4.2, 10 / 3), 757.9320701014516));
  check('shaft: Weibull reliability factor (SciPy weibull_min, b = 1.5: 0.61885 at 95 %, 0.20877 at 99 %)', near(S.reliabilityFactor(0.95, 1.5), 0.6188543819951796, 1e-12) && near(S.reliabilityFactor(0.99, 1.5), 0.20877017644159027, 1e-12) && near(S.reliabilityFactor(0.9, 1.5), 1));
  { const e = S.equivalentLoad(3.5, 1.2, 0.5, 1.6, 0.3, 1.2), f = S.equivalentLoad(3.5, 0.5, 0.5, 1.6, 0.3, 1); check('shaft: equivalent load, X and Y only when Fa/Fr > e', near(e.P, 1.2 * (0.5 * 3.5 + 1.6 * 1.2)) && e.useXY && f.P === 3.5 && !f.useXY); }
  check('shaft: required C inverts the life', near(S.L10(S.requiredC(4.4, 500, 3), 4.4, 3), 500));
  check('shaft: duty cycle load (cube mean)', near(S.dutyLoad([2, 4], [1, 1], 3), Math.cbrt((8 + 64) / 2)) && near(S.dutyLoad([5, 5], [3, 7], 10 / 3), 5));
  const L = { Ma: 150, Mm: 0, Ta: 0, Tm: 120, Kf: 1.7, Kfs: 1.5 };
  check('shaft: Goodman safety factor at 30 mm (NumPy 1.84465)', near(S.goodmanN(30, L, 210, 700), 1.844648194653789, 1e-12));
  check('shaft: DE-Goodman diameter for n = 1.5 (SciPy root 28.0014 mm)', near(S.goodmanD(1.5, L, 210, 700), 28.00144804496178, 1e-10));
  check('shaft: closed form and stress form agree', near(S.goodmanN(S.goodmanD(2.2, L, 210, 700), L, 210, 700), 2.2, 1e-12));
  check('shaft: static von Mises and Tresca diameters (SciPy 18.7941, 19.1184 mm)', near(S.misesD(150, 120, 560, 2), 18.79409410094698, 1e-10) && near(S.trescaD(150, 120, 560, 2), 19.11840918599489, 1e-10));
  { const r = S.shaftStresses(30, { Ma: 100, Mm: 0, Ta: 0, Tm: 0, Kf: 1, Kfs: 1 }); check('shaft: pure bending σ = 32M/πd³', near(r.sa, 32e3 * 100 / (Math.PI * 27000)) && r.sm === 0); }
};
