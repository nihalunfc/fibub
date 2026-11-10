// #1372 power set builder. Subsets and their order checked against Python's itertools.combinations by size;
// counts against math.comb.
import * as P from '../../src/lib/sci/school-powerset.ts';
export default async (check) => {
  const items = ['a', 'b', 'c'];
  const shown = P.subsets(3).map((m) => P.show(m, items)).join(' ');
  check('powerset: {a, b, c} in itertools order', shown === '∅ {a} {b} {c} {a, b} {a, c} {b, c} {a, b, c}');
  for (let n = 0; n <= 6; n++) {
    const all = P.subsets(n);
    check(`powerset: n = ${n} gives 2^n distinct subsets with C(n, k) of each size (math.comb)`, all.length === 2 ** n && new Set(all).size === 2 ** n && Array.from({ length: n + 1 }, (_, k) => all.filter((m) => P.size(m) === k).length === P.nCr(n, k)).every(Boolean));
  }
  check('powerset: C(6, 3) = 20, C(5, 0) = 1, C(4, 5) = 0', P.nCr(6, 3) === 20 && P.nCr(5, 0) === 1 && P.nCr(4, 5) === 0);
  const r = P.readElements('{1, 2, 2, 3}');
  check('powerset: reads braces and drops repeats', r.items.join() === '1,2,3' && r.dropped.join() === '2');
  check('powerset: spaces also separate', P.readElements('x y  z').items.length === 3);
  check('powerset: switch code of {a, c} is 101', P.code(5, 3) === '101');
};
