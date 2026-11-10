// #1298 Esterification. Formulas checked by hand (ethyl ethanoate C₄H₈O₂ = 88, pentyl ethanoate C₇H₁₄O₂ = 130,
// methyl benzoate C₈H₈O₂ = 136). Equilibrium checked against sympy.solve with K = 4: 1 mol acid + 1 mol alcohol →
// 2/3 mol ester; 1 mol acid + 3 mol alcohol → 0.90283 mol.
import { ACIDS, ALCOHOLS, esterFormula, esterName, formulaText, mass, equilibrium, esterCondensed, acidFormula, alcoholFormula } from '../../src/lib/sci/ester-school.ts';
export default async (check) => {
  const A = Object.fromEntries(ACIDS.map((a) => [a.id, a])), R = Object.fromEntries(ALCOHOLS.map((r) => [r.id, r]));
  const e = esterFormula(A.ethanoic, R.ethanol);
  check('ester: ethyl ethanoate C₄H₈O₂, 88 g/mol', formulaText(e) === 'C₄H₈O₂' && mass(e) === 88 && esterName(A.ethanoic, R.ethanol) === 'ethyl ethanoate');
  check('ester: pentyl ethanoate C₇H₁₄O₂ 130; methyl benzoate C₈H₈O₂ 136', formulaText(esterFormula(A.ethanoic, R.pentanol)) === 'C₇H₁₄O₂' && mass(esterFormula(A.ethanoic, R.pentanol)) === 130 && formulaText(esterFormula(A.benzoic, R.methanol)) === 'C₈H₈O₂' && mass(esterFormula(A.benzoic, R.methanol)) === 136);
  check('ester: condensed CH₃COOCH₂CH₃ and HCOOCH₃', esterCondensed(A.ethanoic, R.ethanol) === 'CH₃COOCH₂CH₃' && esterCondensed(A.methanoic, R.methanol) === 'HCOOCH₃');
  let ok = true;
  for (const a of ACIDS) for (const r of ALCOHOLS) { const f = esterFormula(a, r), fa = acidFormula(a), fr = alcoholFormula(r); if (mass(f) + 18 !== mass(fa) + mass(fr) || f.O !== 2) ok = false; }
  check('ester: all 30 pairs: acid + alcohol = ester + water by mass, esters have 2 O', ok);
  check('ester: K = 4, 1:1 → 2/3 mol; 1:3 → 0.90283 mol (sympy)', Math.abs(equilibrium(1, 1) - 2 / 3) < 1e-12 && Math.abs(equilibrium(1, 3) - 0.9028324592902729) < 1e-9);
  check('ester: adding water first lowers the yield; K = 1 gives 1/2', equilibrium(1, 1, 4, 0, 2) < 2 / 3 && Math.abs(equilibrium(1, 1, 1) - 0.5) < 1e-12);
  let ok2 = true;
  for (let i = 0; i < 300; i++) { const a = 0.1 + Math.random() * 5, b = 0.1 + Math.random() * 5, K = 0.5 + Math.random() * 10, w = Math.random() * 2; const x = equilibrium(a, b, K, 0, w); if (!(x >= 0 && x <= Math.min(a, b)) || Math.abs(x * (w + x) - K * (a - x) * (b - x)) > 1e-8 * Math.max(1, K * a * b)) ok2 = false; }
  check('ester: 300 random mixtures satisfy the equilibrium equation', ok2);
};
