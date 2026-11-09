// #1191 probability tree. Joint, total and conditional (Bayes) probabilities checked against exact
// fractions computed with Python's fractions module for four trees.
import * as PT from '../../src/lib/sci/school-prob.ts';
const near = (a, b, t = 1e-12) => Number.isFinite(a) && Math.abs(a - b) <= t * Math.max(1, Math.abs(b));
const PY = [
  [[0.01, 0.9, 0.05], [0.009, 0.001, 0.0495, 0.9405, 0.0585, 0.15384615384615385, 0.0010621348911311736]],
  [[0.3, 0.8, 0.25], [0.24, 0.06, 0.175, 0.525, 0.415, 0.5783132530120482, 0.10256410256410256]],
  [[0.5, 0.6, 0.6], [0.3, 0.2, 0.3, 0.2, 0.6, 0.5, 0.5]],
  [[0.4, 1 / 3, 1 / 6], [0.13333333333333333, 0.26666666666666666, 0.1, 0.5, 0.23333333333333334, 0.5714285714285714, 0.34782608695652173]],
];
export default async (check) => {
  for (const [[a, b, c], v] of PY) {
    const r = PT.tree(a, b, c), got = [r.AB, r.ANB, r.NAB, r.NANB, r.pB, r.pAgB, r.pAgNB];
    check(`probability: tree P(A) ${a}, P(B|A) ${b.toFixed(3)}, P(B|A′) ${c.toFixed(3)} matches exact fractions`, got.every((x, i) => near(x, v[i], 1e-12)));
  }
  check('probability: independence when P(B|A) = P(B|A′)', PT.tree(0.5, 0.6, 0.6).independent && !PT.tree(0.3, 0.8, 0.25).independent);
  check('probability: P(A|B) undefined when P(B) = 0', Number.isNaN(PT.tree(0.5, 0, 0).pAgB));
  const c1 = PT.counts([0.009, 0.001, 0.0495, 0.9405]);
  check('probability: 1000 dots for the screening example are 9, 1, 50, 940 (sum 1000)', c1.join() === '9,1,50,940');
  check('probability: counts always add to N', [[1 / 3, 1 / 3, 1 / 3], [0.1234, 0.4321, 0.4445], [0.001, 0.002, 0.997]].every((p) => PT.counts(p).reduce((s, x) => s + x, 0) === 1000));
};
