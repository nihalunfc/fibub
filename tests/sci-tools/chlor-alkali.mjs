// #1299 Chlor-alkali process. Checked by hand against Faraday's laws: 1 mol of electrons (96 485 C) gives 0.5 mol
// Cl₂ (35.45 g, 12.39 L at 25 °C and 1 bar), 0.5 mol H₂ (1.008 g) and 1 mol NaOH (40.00 g); 2.00 A for 1 hour
// (7200 C) gives 0.07462 mol e⁻, 2.985 g NaOH and 0.9250 L of Cl₂; masses balance (2NaCl + 2H₂O = 2NaOH + Cl₂ + H₂).
import { F, VM, M, products, timeForNaOH } from '../../src/lib/sci/chloralkali-school.ts';

export default async (check) => {
  const near = (a, b, t = 1e-3) => Math.abs(a - b) <= t * Math.max(1, Math.abs(b));
  check('molar volume 24.79 L', near(VM, 24.789, 1e-4));
  const one = products(1, F);
  check('1 mol e⁻: 0.5 Cl₂, 0.5 H₂, 1 NaOH', near(one.ne, 1, 1e-12) && near(one.cl2.g, 35.45, 1e-9) && near(one.h2.g, 1.008, 1e-9) && near(one.naoh.g, 39.997, 1e-6) && near(one.cl2.L, 12.394, 1e-4));
  const p = products(2, 3600);
  check('2 A for 1 h', near(p.Q, 7200, 1e-12) && near(p.ne, 0.074623, 1e-4) && near(p.naoh.g, 2.98468, 1e-4) && near(p.cl2.L, 0.92497, 1e-4));
  const H2O = 2 * 1.008 + 15.999;
  check('mass balance', near(2 * M.NaCl + 2 * H2O, 2 * M.NaOH + M.Cl2 + M.H2, 1e-12));
  check('time for 40 g NaOH at 10 A ≈ 9649 s', near(timeForNaOH(M.NaOH, 10), 9648.533, 1e-6));
};
