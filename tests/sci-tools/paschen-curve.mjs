// #955 Paschen curve: checked against SciPy (bounded minimisation and Brent root finding) on the same formula.
import { paschenV, paschenMin, pdForVoltage, pdAsymptote, PRESSURE, GAP } from '../../src/lib/sci/phpaschen.ts';
export default async (check) => {
  const near = (a, b, r) => Math.abs(a / b - 1) < r;
  const m = paschenMin(15, 365, 0.01);
  check('paschen: air minimum at pd 0.83635 Torr cm, 305.266 V (SciPy minimize_scalar)', near(m.pd, 0.8363465, 1e-6) && near(m.V, 305.26649, 1e-6));
  check('paschen: minimum is the lowest point of the curve', paschenV(m.pd * 1.01, 15, 365, 0.01) > m.V && paschenV(m.pd * 0.99, 15, 365, 0.01) > m.V);
  check('paschen: air 1 atm, 1 cm: 35509 V (SciPy)', near(paschenV(760, 15, 365, 0.01), 35509.333, 1e-7));
  check('paschen: air 1 atm, 1 mm: 5035 V', near(paschenV(76, 15, 365, 0.01), 5034.9894, 1e-7));
  const r = pdForVoltage(1000, 15, 365, 0.01);
  check('paschen: pd for 1000 V, both branches (SciPy brentq 0.349543, 9.35519)', r.length === 2 && near(r[0], 0.3495429, 1e-6) && near(r[1], 9.355187, 1e-6));
  check('paschen: no pd below the minimum voltage', pdForVoltage(300, 15, 365, 0.01).length === 0);
  check('paschen: argon γ 0.07, 1 Torr cm: 121.479 V', near(paschenV(1, 12, 180, 0.07), 121.47926, 1e-7));
  check('paschen: NaN left of the asymptote', Number.isNaN(paschenV(pdAsymptote(15, 0.01) * 0.999, 15, 365, 0.01)));
  check('paschen: units: 1 atm = 101325 Pa = 760 Torr; 1 in = 2.54 cm', near(101325 * PRESSURE.pa, 760, 1e-6) && GAP.in === 2.54 && near(1013.25 * PRESSURE.mbar, 760, 1e-6));
};
