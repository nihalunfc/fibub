// Isotope pattern calculator (src/lib/sci/chem.ts): sodium adducts and bromine clusters pinned to the marmaricines
// article (Marine Drugs 23: 80, 2025). The core checks (caffeine, morphine, chlorine clusters) live in tests/sci.mjs.
import { parseFormula, ADDUCTS, adductFormula, monoMass, isotopePattern, clusterPattern, ppm } from '../../src/lib/sci/chem.ts';

export default async (check) => {
  const near = (a, b, tol) => Math.abs(a - b) <= tol;
  const na = (f) => adductFormula(parseFormula(f), ADDUCTS.find((a) => a.id === 'M+Na'));
  const A = na('C10H12Br2N2O3'), B = na('C10H13BrN2O5');
  check('isotope: marmaricine A [M+Na]+ m/z 388.9107 (paper calc 388.9106)', near(monoMass(A), 388.91069, 2e-5));
  check('isotope: marmaricine B [M+Na]+ m/z 342.9900, 1.7 ppm from 342.9906', near(monoMass(B), 342.99000, 2e-5) && near(ppm(342.9906, monoMass(B)), 1.74, 0.01));
  const u = clusterPattern(isotopePattern(A, { prune: 1e-5, merge: 2e-5 }), 1), top = Math.max(...u.map((p) => p.abundance));
  check('isotope: two bromines give M : M+2 : M+4 of about 51 : 100 : 50', near((100 * u[0].abundance) / top, 51.1, 0.2) && near((100 * u[4].abundance) / top, 49.6, 0.2) && u[2].abundance === top);
};
