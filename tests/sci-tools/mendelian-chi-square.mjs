// #203 Mendelian chi-square. References: scipy.stats.chisquare (statistic and p), scipy.stats.binomtest
// (two classes) and an independent Python enumeration of every multinomial outcome (more classes).
import { chiGof, exactGof, parseRatio, outcomes, MENDEL_RATIOS } from '../../src/lib/sci/mendel.ts';

export default async (check) => {
  const near = (name, got, want, tol) => check(`${name}: got ${got}, want ${want} ± ${tol}`, Math.abs(got - want) <= tol);
  const cases = [
    [[290, 102, 95, 33], [9, 3, 3, 1], 0.3008547008547009, 0.9598676540654922, 0.9549976864500005],
    [[72, 28], [3, 1], 0.48, 0.4884223166225936, 0.48905452505803626],
    [[22, 51, 27], [1, 2, 1], 0.54, 0.7633794943368533, 0.7716075084304339],
    [[45, 15, 20], [9, 3, 4], 0, 1, 1],
    [[88, 20, 12], [12, 3, 1], 3.0222222222222226, 0.22066465874200492, 0.23096585003738937],
    [[70, 10], [15, 1], 5.333333333333333, 0.020921335337794035, 0.03299972027323568],
    [[18, 32], [1, 1], 3.92, 0.04771488023735101, 0.06490864707227217],
    [[30, 22, 28, 20], [1, 1, 1, 1], 2.7199999999999998, 0.4368391967665337, 0.43604253953640926],
    [[5, 1, 2, 0], [9, 3, 3, 1], 0.8888888888888888, 0.8281083145875399, 1],
  ];
  for (const [o, r, chi, p, ex] of cases) {
    const g = chiGof(o, r);
    near(`mendel chi2 ${o.join('/')} vs ${r.join(':')}`, g.chi2, chi, 1e-10);
    near(`mendel p ${o.join('/')}`, g.p, p, 1e-8);
    near(`mendel exact p ${o.join('/')}`, exactGof(o, r), ex, 1e-8);
  }
  const g = chiGof([70, 10], [15, 1]);
  check('mendel df, expected and contributions', g.df === 1 && g.expected[0] === 75 && g.expected[1] === 5 && Math.abs(g.contrib[1] - 5) < 1e-12 && g.smallClasses === 0);
  check('mendel small expected class flagged', chiGof([5, 1, 2, 0], [9, 3, 3, 1]).smallClasses === 4);
  check('mendel exact refused when too many outcomes', Number.isNaN(exactGof([400, 300, 200, 100], [1, 1, 1, 1], 1e5)));
  near('mendel outcome count C(n+k-1, k-1)', outcomes(10, 4), 286, 1e-6);
  check('mendel ratio parsing', parseRatio('9:3:3:1').join() === '9,3,3,1' && parseRatio('9, 7').join() === '9,7');
  check('mendel presets cover the ratios asked for', ['3:1', '1:2:1', '9:3:3:1', '9:3:4', '12:3:1', '15:1', '1:1', '1:1:1:1'].every((id) => MENDEL_RATIOS.some((m) => m.id === id && m.ratio.join(':') === id)));
};
