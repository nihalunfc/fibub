// #1298 Esterification. Names and formulas checked by hand (ethyl ethanoate CH₃COOC₂H₅, C₄H₈O₂, 88.11 g/mol;
// methyl butanoate; pentyl ethanoate C₇H₁₄O₂ 130.19); equilibrium with K = 4 and equal moles gives 2/3 (the classic
// textbook result); the quadratic root checked against Python numpy.roots for 1.0 mol acid + 3.0 mol alcohol
// (0.9028 mol); masses balance (acid + alcohol = ester + water).
import { ACIDS, ALCOHOLS, molarAcid, molarAlcohol, molarEster, esterName, esterFormula, molecularFormula, yieldOf, WATER, smell } from '../../src/lib/sci/ester-school.ts';

export default async (check) => {
  const near = (a, b, t = 1e-3) => Math.abs(a - b) <= t;
  const ac = (c) => ACIDS.find((x) => x.c === c), al = (c) => ALCOHOLS.find((x) => x.c === c);
  check('names', esterName(ac(2), al(2)) === 'ethyl ethanoate' && esterName(ac(4), al(1)) === 'methyl butanoate' && esterName(ac(1), al(3)) === 'propyl methanoate' && esterName(ac(2), al(8)) === 'octyl ethanoate');
  check('formulas', esterFormula(ac(2), al(2)) === 'CH₃COOC₂H₅' && esterFormula(ac(1), al(1)) === 'HCOOCH₃' && molecularFormula(ac(2), al(2)) === 'C₄H₈O₂' && ACIDS[1].formula === 'CH₃COOH' && ALCOHOLS[1].formula === 'C₂H₅OH' && al(3).name === 'propan-1-ol');
  check('molar masses', near(molarEster(ac(2), al(2)), 88.106) && near(molarEster(ac(2), al(5)), 130.187) && near(molarAcid(ac(2)), 60.052) && near(molarAlcohol(al(2)), 46.069));
  let ok = true;
  for (const a of ACIDS) for (const b of ALCOHOLS) if (!near(molarAcid(a) + molarAlcohol(b), molarEster(a, b) + WATER, 1e-9)) ok = false;
  check('mass balance for all 24 pairs', ok);
  const y = yieldOf(ac(2), al(2), molarAcid(ac(2)), molarAlcohol(al(2)));
  check('1 mol + 1 mol with K = 4 gives 2/3 mol', near(y.nEq, 2 / 3, 1e-9) && near(y.pctEq, 66.667, 1e-3) && y.limiting === 'neither');
  const y3 = yieldOf(ac(2), al(2), molarAcid(ac(2)), 3 * molarAlcohol(al(2)));
  check('1 mol + 3 mol: 0.9028 mol (numpy.roots), acid limiting', near(y3.nEq, 0.902832, 1e-5) && y3.limiting === 'acid' && near(y3.gMax, molarEster(ac(2), al(2)), 1e-9));
  check('K = 1 case', near(yieldOf(ac(2), al(2), molarAcid(ac(2)), molarAlcohol(al(2)), 1).nEq, 0.5, 1e-9));
  check('smells', smell(ac(2), al(5)) === 'banana' && smell(ac(3), al(4)) === 'fruity');
};
