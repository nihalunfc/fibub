// #1296 Chlor-alkali process. Checked against Python with F = 96485.33212 C/mol (CODATA): 10 A for 1 hour moves
// 0.37311 mol of electrons, giving 13.2455 g Cl₂, 14.9245 g NaOH and 4.477 L of each gas at 24 L/mol.
import { products, timeForNaOH, F } from '../../src/lib/sci/chloralkali-school.ts';
export default async (check) => {
  const p = products(10, 3600);
  check('chlor: 10 A, 1 h → 0.373114 mol e⁻ (Python)', Math.abs(p.ne - 0.37311370763823826) < 1e-12 && p.charge === 36000);
  check('chlor: 13.2455 g Cl₂, 14.9245 g NaOH, 0.3731 g H₂', Math.abs(p.mCl2 - 13.245536621157457) < 1e-9 && Math.abs(p.mNaOH - 14.92454830552953) < 1e-9 && Math.abs(p.mH2 - 0.37311370763823826) < 1e-9);
  check('chlor: equal volumes of H₂ and Cl₂, 4.477 L each at 24 L/mol', Math.abs(p.vCl2 - 4.477364491658859) < 1e-9 && p.vCl2 === p.vH2);
  check('chlor: 1 F (96 485 C) makes 1 mol NaOH = 40 g and ½ mol Cl₂', Math.abs(products(F, 1).mNaOH - 40) < 1e-9 && Math.abs(products(F, 1).nCl2 - 0.5) < 1e-12);
  check('chlor: 80 % efficiency makes 80 %', Math.abs(products(10, 3600, 0.8).mNaOH - 0.8 * p.mNaOH) < 1e-9);
  check('chlor: time for 40 g NaOH at 1 A is F seconds', Math.abs(timeForNaOH(40, 1) - F) < 1e-6 && Math.abs(timeForNaOH(p.mNaOH, 10) - 3600) < 1e-6);
};
