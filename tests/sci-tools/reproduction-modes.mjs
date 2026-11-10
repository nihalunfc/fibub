// #1267 Asexual reproduction explorer. N = N0·2^(t/T): 20-minute doubling gives 512 after 180 min; a million after
// 20·log2(1e6) ≈ 398.63 min (Python math.log2). Stage captions change in order.
import { MODES, caption, cells, timeTo, doublings } from '../../src/lib/sci/reproduction.ts';

export default async (check) => {
  check('512 cells after 180 min (T = 20)', cells(1, 180, 20) === 512 && doublings(180, 20) === 9);
  check('a million after ≈ 398.63 min', Math.abs(timeTo(1e6, 1, 20) - 398.63137138648347) < 1e-9);
  check('3 cells, 2 doublings → 12', cells(3, 2, 1) === 12);
  check('six modes, each with 4 stages in order', MODES.length === 6 && MODES.every((m) => m.stages.length === 4 && m.stages.every((s, i) => i === 0 || s[0] > m.stages[i - 1][0])));
  check('captions follow the stage', caption('binary', 0) === MODES[0].stages[0][1] && caption('binary', 1) === MODES[0].stages[3][1] && caption('budding', 0.3) === MODES[2].stages[1][1]);
};
