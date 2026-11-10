// #1385 event algebra. Counts and probabilities checked against a Python enumeration of the 36 outcomes with
// itertools.product and fractions.Fraction; the simulation with a fixed seed lands within 1.5 % of the exact value.
import * as E from '../../src/lib/sci/school-events.ts';
const ev = (sp, id, k) => { const d = E.EVENTS[sp].find((e) => e.id === id); return (o) => d.test(o, k ?? d.k?.[2] ?? 0); };
export default async (check) => {
  check('events: 36 dice outcomes, 12 coin-and-die outcomes', E.outcomes('dice').length === 36 && E.outcomes('coin-die').length === 12);
  let c = E.count('dice', ev('dice', 'sum-eq', 7), ev('dice', 'double'));
  check('events: sum 7 and a double: 6, 6, 0, 12 → exclusive (Python)', c.nA === 6 && c.nB === 6 && c.nAB === 0 && c.nU === 12 && c.exclusive);
  c = E.count('dice', ev('dice', 'sum-ge', 9), ev('dice', 'has', 6));
  check('events: sum ≥ 9 and a six: 10, 11, 7, 14 (Python: 5/18, 11/36, 7/36, 7/18)', c.nA === 10 && c.nB === 11 && c.nAB === 7 && c.nU === 14);
  check('events: addition rule holds', c.nU === c.nA + c.nB - c.nAB);
  c = E.count('dice', ev('dice', 'first-even'), ev('dice', 'sum-prime'));
  check('events: first even and prime sum: 18, 15, 7, 26 (Python: 1/2, 5/12, 7/36, 13/18)', c.nA === 18 && c.nB === 15 && c.nAB === 7 && c.nU === 26);
  c = E.count('coin-die', ev('coin-die', 'head'), ev('coin-die', 'tail'));
  check('events: heads and tails are exclusive and exhaustive', c.exclusive && c.exhaustive);
  check('events: fractions in lowest terms', E.frac(12, 36) === '1/3' && E.frac(14, 36) === '7/18' && E.frac(0, 36) === '0' && E.frac(36, 36) === '1');
  check('events: operations', E.inOp('xor', true, false) && !E.inOp('xor', true, true) && E.inOp('AminusB', true, false) && !E.inOp('notA', true, false));
  const s = E.simulate('dice', ev('dice', 'sum-ge', 9), ev('dice', 'has', 6), 20000, E.rng(7));
  check(`events: 20 000 seeded rolls give P(A ∪ B) near 7/18 (${s.u / 20000})`, Math.abs(s.u / 20000 - 14 / 36) < 0.015);
};
