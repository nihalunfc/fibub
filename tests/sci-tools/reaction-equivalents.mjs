// Reaction equivalents table: masses from moles and molar mass, density volumes, purity, scaling and yield (closed forms),
// plus the amide-coupling case of Parrotta et al. (2026), Front. Chem. 14: 1964972 (1 mmol scale, 88 % isolated yield).
import { table, yieldOf, scaleFrom } from '../../src/lib/sci/equivalents.ts';
import { parseFormula, molarMass } from '../../src/lib/sci/chem.ts';

export default async (check) => {
  const near = (a, b, t) => Math.abs(a - b) <= t;
  const mw = (f) => molarMass(parseFormula(f));
  const rows = table([{ name: 'a', mw: 100, equiv: 1 }, { name: 'b', mw: 50, equiv: 2.5, density: 0.8 }, { name: 'c', mw: 200, equiv: 1, purity: 80 }, { name: 'd', mw: 100, equiv: 1.2, molarity: 2.5 }], 4);
  check('equivalents: mass = mmol x molar mass (4 mmol x 100 = 400 mg)', near(rows[0].massMg, 400, 1e-9) && near(rows[1].mmol, 10, 1e-9));
  check('equivalents: neat liquid volume = mass / density (500 mg at 0.8 g/mL = 625 µL)', near(rows[1].volumeUl, 625, 1e-9));
  check('equivalents: 80 % purity weighs 1000 mg for 800 mg of reagent', near(rows[2].weighMg, 1000, 1e-9));
  check('equivalents: 4.8 mmol of a 2.5 M solution is 1920 µL', near(rows[3].volumeUl, 1920, 1e-9));
  check('equivalents: scaling by mass and by volume', near(scaleFrom({ name: 'a', mw: 100, equiv: 1 }, 'mg', 500), 5, 1e-12) && near(scaleFrom({ name: 'b', mw: 50, equiv: 2.5, density: 0.8 }, 'ul', 625), 4, 1e-12));
  // Amide-coupling reagent table at the paper's 1 mmol scale.
  const m = ['C8H8O2', 'C5H6N2O3', 'C8H11N'].map(mw), prod = mw('C16H17NO');
  check('equivalents: phenylacetic acid, OxymaPure and 2-phenylethylamine weigh 136.15, 142.11 and 121.18 mg at 1 mmol', near(m[0], 136.15, 0.005) && near(m[1], 142.11, 0.005) && near(m[2], 121.18, 0.005));
  check('equivalents: the amide C16H17NO is 239.32 g/mol; 88 % of 1 mmol is 210.6 mg and 210 mg is 87.8 %', near(prod, 239.32, 0.005) && near(yieldOf(1, prod).theoMg * 0.88, 210.6, 0.05) && near(yieldOf(1, prod, 1, 210).percent, 87.75, 0.01));
};
