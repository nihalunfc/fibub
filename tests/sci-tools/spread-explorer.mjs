// #1384 spread explorer. Every preset and a hand example checked against numpy (mean, median, mean absolute
// deviation about the mean and the median, var and std with ddof = 0) and Python's statistics.pstdev.
import * as S from '../../src/lib/sci/school-spread.ts';
const near = (a, b, t = 1e-9) => Math.abs(a - b) <= t * Math.max(1, Math.abs(b));
export default async (check) => {
  const want = {
    'same-mean': [[50, 50, 1.7142857142857142, 1.7142857142857142, 5.714285714285714, 2.390457218668787, 4.780914437337574], [50, 50, 12.857142857142858, 12.857142857142858, 321.42857142857144, 17.928429140015904, 35.85685828003181]],
    cricket: [[44.5, 39, 30.75, 30.75, 1198.5, 34.61935874622752, 77.79631178927532], [44.5, 44, 5.25, 5.25, 38.75, 6.224949798994366, 13.988651233695206]],
    heights: [[160, 160, 4.857142857142857, 4.857142857142857, 36.857142857142854, 6.07100838882165, 3.7943802430135314], [49.42857142857143, 50, 5.5102040816326525, 5.428571428571429, 41.10204081632653, 6.411087334947679, 12.970407903073339]],
  };
  for (const p of S.PRESETS) [p.a, p.b].forEach((xs, k) => {
    const s = S.stats(xs), w = want[p.id][k];
    check(`spread: ${p.id} set ${k + 1} matches numpy`, [s.mean, s.median, s.mdMean, s.mdMedian, s.variance, s.sd, s.cv].every((v, i) => near(v, w[i])));
  });
  const h = S.stats([3, 7, 8, 10, 12]);
  check('spread: 3, 7, 8, 10, 12 → mean 8, MD 2.4, variance 9.2', h.mean === 8 && near(h.mdMean, 2.4) && near(h.variance, 9.2) && h.range === 9);
  const sh = S.stats([13, 17, 18, 20, 22]);
  check('spread: adding 10 keeps MD, variance, range', near(sh.mdMean, h.mdMean) && near(sh.variance, h.variance) && sh.range === h.range && sh.mean === 18);
  const sc = S.stats([9, 21, 24, 30, 36]);
  check('spread: multiplying by 3 multiplies variance by 9', near(sc.variance, 9 * h.variance) && near(sc.sd, 3 * h.sd));
  check('spread: median of an even count averages the middle two', S.median([1, 4, 2, 3]) === 2.5);
  const r = S.readData('1, 2;3\n4 x');
  check('spread: reads numbers, reports junk', r.xs.join() === '1,2,3,4' && r.bad.join() === 'x');
  check('spread: CV undefined when the mean is 0', Number.isNaN(S.stats([-1, 1]).cv));
};
