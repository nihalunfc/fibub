// Beer-Lambert calculator: A = ε l c in all four directions, the absorbance-quality bands, and the published
// famotidine method of Al Samarrai et al. (2024), Sci Rep 14, doi:10.1038/s41598-024-54402-4 (CC BY 4.0), used in
// src/blog/discoveries/famotidine-charge-transfer-complex-molar-absorptivity.md.
import { solveBL, absFromT, tFromAbs, absQuality } from '../../src/lib/sci/beer.ts';
import { parseFormula, molarMass } from '../../src/lib/sci/chem.ts';

export default async (check) => {
  const near = (a, b, tol) => Math.abs(a - b) <= tol;

  // The NADH reading behind thousands of enzyme assays: ε 6220 L/(mol·cm) at 340 nm, 0.100 mmol/L, 1 cm.
  check('beer: NADH 0.1 mmol/L in 1 cm gives A = 0.622', near(solveBL({ eps: 6220, l: 1, c: 1e-4 }).A, 0.622, 1e-12));
  check('beer: 10 % transmittance is A = 1', near(absFromT(0.1), 1, 1e-12) && near(tFromAbs(1), 0.1, 1e-12));
  check('beer: solves for ε, path and concentration too', (() => {
    const e = solveBL({ A: 0.622, l: 1, c: 1e-4 }), l = solveBL({ A: 0.622, eps: 6220, c: 1e-4 }), c = solveBL({ A: 0.622, eps: 6220, l: 1 });
    return near(e.eps, 6220, 1e-6) && e.solved === 'eps' && near(l.l, 1, 1e-12) && near(c.c, 1e-4, 1e-15);
  })());
  check('beer: two blanks or none is an error', (() => {
    let bad = 0;
    for (const x of [{ A: 0.5 }, { A: 0.5, eps: 6220, l: 1, c: 1e-4 }, { eps: 6220, l: 1, c: 0 }]) { try { solveBL(x); } catch { bad++; } }
    return bad === 3;
  })());
  check('beer: absorbance bands (very low, best, high, too high)', absQuality(0.02).level === 'warn' && absQuality(0.5).level === 'good' && absQuality(1.5).level === 'warn' && absQuality(2.5).level === 'bad');

  // Famotidine, C8H15N7O2S3, as the ortho-chloranil charge-transfer complex at 546 nm.
  const M = molarMass(parseFormula('C8H15N7O2S3')), EPS = 2159.648, SANDELL = 0.15625;
  check('beer: famotidine molar mass is 337.435 g/mol', near(M, 337.435, 5e-4));
  check('beer: the paper\'s Sandell sensitivity times ε gives that molar mass', near(SANDELL * EPS, M, M * 5e-4));
  check('beer: 2 µg/mL gives A = 0.01280 and counts as very low', (() => {
    const r = solveBL({ eps: EPS, l: 1, c: 2e-3 / M });
    return near(r.A, 0.01280, 5e-6) && absQuality(r.A).level === 'warn';
  })());
  check('beer: 28 µg/mL gives A = 0.17921 and is in the best range', (() => {
    const r = solveBL({ eps: EPS, l: 1, c: 28e-3 / M });
    return near(r.A, 0.17921, 5e-6) && absQuality(r.A).level === 'good';
  })());
  check('beer: A = 1 needs 156.2 µg/mL in a 1 cm cell', near((solveBL({ A: 1, eps: EPS, l: 1 }).c * M) / 1e-3, 156.2, 0.05));
  check('beer: the same 28 µg/mL in a 5 cm cell reads 0.8960', near(solveBL({ eps: EPS, l: 5, c: 28e-3 / M }).A, 0.89603, 5e-5));
};
