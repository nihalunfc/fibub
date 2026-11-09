// #1193 relation checker. Counts of reflexive, symmetric, antisymmetric, transitive, equivalence and partial-order
// relations, functions and bijections over every relation on 3 and 4 elements, checked against a Python brute
// force (itertools.product over all 2^(n²) relations); closures and classes against hand-worked examples.
import * as RL from '../../src/lib/sci/school-relations.ts';
const PY = { 3: { refl: 64, sym: 64, anti: 216, trans: 171, eq: 5, po: 19, fn: 27, bij: 6 }, 4: { refl: 4096, sym: 1024, anti: 11664, trans: 3994, eq: 15, po: 219, fn: 256, bij: 24 } };
export default async (check) => {
  for (const n of [3, 4]) {
    const c = { refl: 0, sym: 0, anti: 0, trans: 0, eq: 0, po: 0, fn: 0, bij: 0 };
    for (let m = 0; m < 2 ** (n * n); m++) {
      const R = RL.fromRule(n, (a, b) => !!((m >> ((a - 1) * n + b - 1)) & 1)), p = RL.props(R), f = RL.asFunction(R);
      c.refl += p.reflexive; c.sym += p.symmetric; c.anti += p.antisymmetric; c.trans += p.transitive; c.eq += p.equivalence; c.po += p.partialOrder; c.fn += f.isFn; c.bij += f.oneOne && f.onto;
    }
    check(`relations: counts over all ${2 ** (n * n)} relations on ${n} elements match Python brute force (${JSON.stringify(c)})`, JSON.stringify(c) === JSON.stringify(PY[n]));
    const k = RL.countAll(n);
    check(`relations: formula counts on ${n} elements`, k.reflexive === PY[n].refl && k.symmetric === PY[n].sym && k.equivalence === PY[n].eq && k.functions === PY[n].fn);
  }
  check('relations: Bell numbers 1, 1, 2, 5, 15, 52, 203', [0, 1, 2, 3, 4, 5, 6].map(RL.bell).join() === '1,1,2,5,15,52,203');
  const R = RL.parsePairs('(1,2), (2,3) (4,5)', 5);
  check('relations: transitive closure of {(1,2),(2,3),(4,5)} adds only (1,3)', JSON.stringify(RL.pairs(RL.transitiveClosure(R))) === '[[1,2],[1,3],[2,3],[4,5]]');
  check('relations: equivalence closure has classes {1,2,3} {4,5}', JSON.stringify(RL.classes(RL.equivalenceClosure(R))) === '[[1,2,3],[4,5]]');
  const p = RL.props(R);
  check('relations: counterexamples (1 has no loop, (1,2) without (2,1), 1→2→3 without (1,3))', p.noLoop === 1 && p.notSym.join() === '1,2' && p.notTrans.join() === '1,2,3' && p.antisymmetric);
  const mod = RL.fromRule(6, (a, b) => (a - b) % 3 === 0);
  check('relations: a − b divisible by 3 on {1..6} is an equivalence with classes {1,4} {2,5} {3,6}', RL.props(mod).equivalence && JSON.stringify(RL.classes(mod)) === '[[1,4],[2,5],[3,6]]');
  const div = RL.fromRule(6, (a, b) => b % a === 0);
  check('relations: "a divides b" is a partial order, not symmetric', RL.props(div).partialOrder && !RL.props(div).symmetric);
  const f = RL.asFunction(RL.parsePairs('1 2; 2 3; 3 1', 3)), g = RL.asFunction(RL.parsePairs('1 1 2 1 3 2', 3));
  check('relations: 1→2→3→1 is a one-one onto function; 1,2→1, 3→2 is a function but not one-one', f.isFn && f.oneOne && f.onto && g.isFn && !g.oneOne && !g.onto);
  const msg = (s) => { try { RL.parsePairs(s, 4); return ''; } catch (e) { return e.message; } };
  check('relations: friendly messages', msg('(1,2),(3').includes('left over') && msg('(1,9)').includes('{1, ..., 4}'));
};
