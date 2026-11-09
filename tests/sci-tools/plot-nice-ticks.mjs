// niceTicks must always finish, even when a series' values are nearly but not exactly equal.
import { niceTicks, niceRange } from '../../src/lib/sci/plot.ts';

export default async (check) => {
  check('niceTicks 0..10 gives 0, 2, ... 10', niceTicks(0, 10).join() === '0,2,4,6,8,10');
  check('niceTicks of equal values still spans them', (() => { const t = niceTicks(5, 5); return t.length >= 3 && t[0] < 5 && t[t.length - 1] >= 5; })());
  const near = [[1e6, 1e6 + 1e-10], [0.1 + 0.2, 0.3], [1e15, 1e15 + 1], [-3, -3.0000000000001], [1e300, 1e300 * (1 + 1e-15)]];
  for (const [a, b] of near) {
    const t = niceTicks(a, b);
    check(`niceTicks(${a}, ${b}) finishes with rising ticks around the values`, t.length >= 3 && t.length <= 20 && t.every((v, i) => i === 0 || v > t[i - 1]) && t[0] <= Math.min(a, b) && t[t.length - 1] >= Math.max(a, b) - Math.abs(b) * 1e-6);
    const [lo, hi] = niceRange(a, b);
    check(`niceRange(${a}, ${b}) is a real range`, hi > lo && Number.isFinite(lo) && Number.isFinite(hi));
  }
  check('niceTicks with the ends swapped matches', niceTicks(10, 0).join() === niceTicks(0, 10).join());
  check('niceTicks of a non-finite end gives no ticks', niceTicks(NaN, 1).length === 0 && niceTicks(0, Infinity).length === 0);
};
