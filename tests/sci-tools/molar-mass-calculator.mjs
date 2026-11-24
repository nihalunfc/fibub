// Molar mass calculator: checked by hand arithmetic from standard atomic weights; new with the Fe-porphyrin article.
import * as CH from '../../src/lib/sci/chem.ts';

export default async (check) => {
  const near = (a, b, tol) => Math.abs(a - b) <= tol;
  const mm = (s) => CH.molarMass(CH.parseFormula(s));
  const pct = (s) => Object.fromEntries(CH.composition(CH.parseFormula(s)).map((x) => [x.symbol, x.percent]));
  const solv = 'C89H106ClFeN10KO13', dry = 'C83H101FeKN10O13';
  check('molar mass: C89H106ClFeN10KO13 = 1654.277 and the solvent-free C83H101FeKN10O13 = 1541.721 g/mol', near(mm(solv), 1654.277, 0.001) && near(mm(dry), 1541.721, 0.001));
  check('molar mass: the two differ by exactly one chlorobenzene, C6H5Cl (112.556 g/mol)', near(mm(solv) - mm(dry), mm('C6H5Cl'), 1e-9) && near(mm('C6H5Cl'), 112.556, 0.001));
  const a = pct(solv), b = pct(dry);
  check('molar mass: C, H, N of the solvate are 64.62, 6.46 and 8.47 %; of the dry formula 64.66, 6.60 and 9.09 %', near(a.C, 64.62, 0.005) && near(a.H, 6.46, 0.005) && near(a.N, 8.47, 0.005) && near(b.C, 64.66, 0.005) && near(b.H, 6.60, 0.005) && near(b.N, 9.09, 0.005));
  check('molar mass: percentages add up to 100', near(Object.values(a).reduce((s, x) => s + x, 0), 100, 1e-9));
  check('molar mass: KHCO3 100.114 and NaHCO3 84.006 g/mol; 190 mg is 1.898 and 2.262 mmol', near(mm('KHCO3'), 100.114, 0.001) && near(mm('NaHCO3'), 84.006, 0.001) && near(190 / mm('KHCO3'), 1.8978, 1e-4) && near(190 / mm('NaHCO3'), 2.2617, 1e-4));
};
