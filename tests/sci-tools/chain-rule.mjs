// #1466 chain rule gears. dy/dx of ten chains checked against sympy 1.14 (sympy.diff) at three points each;
// the written link derivatives and a central-difference slope as a second check.
import * as C from '../../src/lib/sci/chain-rule.ts';
const near = (a, b, t = 1e-9) => Number.isFinite(a) && Math.abs(a - b) <= t * Math.max(1, Math.abs(b));
const L = (id, k = 1) => ({ id, k });
export default async (check) => {
  const P = [0.3, 0.7, 1.6], PN = [-0.3, -0.7, -1.6];
  const cases = [
    ['sin(3x)', [L('k', 3), L('sin')], P, [1.8648299048119936, -1.5145383137995714, 0.2624969503183418]],
    ['sin(x²)', [L('sq'), L('sin')], P, [0.5975716398071965, 1.2352660020541701, -2.6738840868205056]],
    ['(sin x)²', [L('sin'), L('sq')], P, [0.5646424733950353, 0.9854497299884603, -0.058374143427580086]],
    ['e^(2x)', [L('k', 2), L('exp')], P, [3.6442376007810178, 8.110399933689349, 49.065060394218705]],
    ['ln(3x²)', [L('sq'), L('k', 3), L('ln')], P, [6.666666666666667, 2.857142857142857, 1.25]],
    ['−cos x', [L('cos'), L('k', -1)], P, [0.29552020666133955, 0.644217687237691, 0.9995736030415051]],
    ['(sin(2x))²', [L('k', 2), L('sin'), L('sq')], P, [1.8640781719344528, 0.6699763003118102, 0.2330984097009873]],
    ['e^(sin(x²))', [L('sq'), L('sin'), L('exp')], P, [0.653768115464817, 1.977655834480225, -4.631531384172531]],
    ['(5x)³', [L('k', 5), L('cube')], P, [33.75, 183.74999999999997, 960.0000000000002]],
    ['4√(−2x)', [L('k', -2), L('sqrt'), L('k', 4)], PN, [-5.163977794943222, -3.3806170189140667, -2.23606797749979]],
  ];
  for (const [txt, c, pts, want] of cases) {
    check(`chain rule: ${txt} written out`, C.chainText(c) === txt);
    check(`chain rule: d/dx ${txt} matches sympy at three points`, pts.every((x, i) => near(C.chainSlope(c, x), want[i])));
    check(`chain rule: ${txt} product agrees with a numerical slope`, pts.every((x, i) => near(C.numericSlope(c, x), want[i], 1e-6)));
  }
  check('chain rule: rate texts for sin(3x) are 3 and cos(3x)', C.rateTexts([L('k', 3), L('sin')]).join('|') === '3|cos(3x)');
  check('chain rule: rate texts for sin(x²) are 2x and cos(x²)', C.rateTexts([L('sq'), L('sin')]).join('|') === '2x|cos(x²)');
  check('chain rule: values along e^(sin x²) at 1', near(C.values([L('sq'), L('sin'), L('exp')], 1)[3], Math.exp(Math.sin(1))));
  check('chain rule: ln of a negative inside is not defined', Number.isNaN(C.chainSlope([L('k', -1), L('ln')], 1)));
  check('chain rule: ln(eˣ) rates multiply to 1', [0.2, 1.5, -2].every((x) => near(C.chainSlope([L('exp'), L('ln')], x), 1)));
};
