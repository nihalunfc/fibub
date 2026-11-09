// #1156 Zeros of polynomials. Cubic zeros checked against numpy.roots on eight cubics (three real zeros, one real
// zero, a triple zero, fractional zeros); relations checked against Vieta's formulas; fromZeros by evaluation.
import { realZeros, fromZeros, relations, polyText, evalPoly } from '../../src/lib/sci/polyzeros-school.ts';

export default async (check) => {
  const near = (a, b, t = 1e-9) => Math.abs(a - b) <= t * Math.max(1, Math.abs(b));
  const same = (got, want, t = 1e-9) => got.length === want.length && got.every((g, i) => near(g, want[i], t));
  const NP = [
    [[1, -6, 11, -6], [1, 2, 3]], [[2, -3, -5, 6], [-1.5, 1, 2]], [[1, 0, 0, -8], [2]], [[1, 1, 1, 1], [-1]],
    [[3, -5, -11, -3], [-1, -0.3333333333, 3]], [[1, 0, -7, 6], [-3, 1, 2]], [[0.5, -2, 0.25, 1.75], [-0.8031673202, 1.2142096451, 3.5889576751]],
  ];
  for (const [co, want] of NP) check(`cubic ${polyText(co)}: zeros match numpy.roots`, same(realZeros(co), want, 1e-8));
  // numpy gives 1.0000065704 for (x − 1)³ (rounding); the exact answer is a triple zero at 1.
  check('cubic (x − 1)³: triple zero at 1', same(realZeros([1, -3, 3, -1]), [1, 1, 1], 1e-6));
  check('cubic with a double zero: (x − 2)²(x + 1)', same(realZeros(fromZeros([2, 2, -1])), [-1, 2, 2], 1e-7));
  check('quadratic: x² − 5x + 6 → 2, 3; x² + 1 → none; x² − 4x + 4 → 2, 2', same(realZeros([1, -5, 6]), [2, 3]) && realZeros([1, 0, 1]).length === 0 && same(realZeros([1, -4, 4]), [2, 2]));
  check('linear: 2x + 3 → −1.5', same(realZeros([2, 3]), [-1.5]));
  check('fromZeros: 1, 2, 3 → x³ − 6x² + 11x − 6; k = 2', fromZeros([1, 2, 3]).join() === '1,-6,11,-6' && fromZeros([1, 2, 3], 2).join() === '2,-12,22,-12' && fromZeros([-2]).join() === '1,2');
  const r = relations([2, -3, -5, 6]);
  check('Vieta for 2x³ − 3x² − 5x + 6: sum 1.5, pairs −2.5, product −3', near(r.sum, 1.5) && near(r.pairs, -2.5) && near(r.product, -3));
  check('Vieta for 3x² − 5x + 2: sum 5/3, product 2/3', near(relations([3, -5, 2]).sum, 5 / 3) && near(relations([3, -5, 2]).product, 2 / 3));
  // Random cubics with three real zeros: zeros found, and their sum/pairs/product match the relations.
  let ok = true;
  for (let i = 0; i < 500; i++) {
    const z = [0, 1, 2].map(() => Math.round((Math.random() * 10 - 5) * 4) / 4).sort((x, y) => x - y), k = [1, 2, -1, 0.5][i % 4];
    const co = fromZeros(z, k), got = realZeros(co), R = relations(co);
    if (!same(got, z, 1e-5) || !near(R.sum, z[0] + z[1] + z[2], 1e-9) || !near(R.product, z[0] * z[1] * z[2], 1e-9) || !near(R.pairs, z[0] * z[1] + z[1] * z[2] + z[0] * z[2], 1e-9)) ok = false;
  }
  check('500 random cubics built from quarter-step zeros: zeros found back, relations hold', ok);
  check('text', polyText([1, -6, 11, -6]) === 'x³ − 6x² + 11x − 6' && polyText([-1, 0, 4]) === '−x² + 4' && polyText([2, 0]) === '2x' && evalPoly([1, -6, 11, -6], 4) === 6);
};
