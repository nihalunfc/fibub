// #475 BMD calculator, pinned to the worked example in the discoveries article
// src/blog/discoveries/bmdrc-benchmark-dose-zebrafish-python.md (our own made-up embryo screen, not any paper's data):
// 7 concentrations, 32 embryos each, 10 % extra risk, multistage degree 2.
import { fitAll, fitModel, checkGroups } from '../../src/lib/sci/bmd.ts';

export default async (check) => {
  const G = [[0, 32, 1], [1, 32, 1], [2, 32, 2], [4, 32, 4], [8, 32, 9], [16, 32, 19], [32, 32, 29]].map(([dose, n, r]) => ({ dose, n, r }));
  const o = fitAll(G, 0.1, 2);
  const by = Object.fromEntries(o.fits.map((f) => [f.id, f]));
  check('bmd screen: gamma has the lowest AIC among adequate fits', o.lowest.id === 'gamma' && o.fits.every((f) => f.pValue >= 0.1));
  check('bmd screen: gamma BMD10 4.17 µM, BMDL10 2.54 µM', by.gamma.bmd.toFixed(2) === '4.17' && by.gamma.bmdl.toFixed(2) === '2.54');
  check('bmd screen: Weibull 3.94 / 2.47 and log-logistic 4.65 / 2.94', by.weibull.bmd.toFixed(2) === '3.94' && by.weibull.bmdl.toFixed(2) === '2.47' && by.loglogistic.bmd.toFixed(2) === '4.65' && by.loglogistic.bmdl.toFixed(2) === '2.94');
  check('bmd screen: every model leaves a BMD/BMDL ratio under 2', o.fits.every((f) => f.bmd / f.bmdl < 2));
  // The lower the benchmark response, the more the models disagree: at 1 % extra risk they spread by more than 3 times,
  // at 10 % by less than 1.3 times. This is the point of Figure 2 in the article.
  const at = (b) => ['weibull', 'loglogistic', 'multistage'].map((id) => fitModel(id, checkGroups(G), b, 2).bmd);
  const spread = (a) => Math.max(...a) / Math.min(...a);
  check('bmd screen: models spread more at BMR 1 % than at 10 %', spread(at(0.01)) > 3 && spread(at(0.1)) < 1.3);
};
