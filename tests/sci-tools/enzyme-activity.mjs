// #1131 Enzyme activity lab. Rates were checked against a separate Python version of the model (plain math module,
// 7 settings), the best temperature against a brute-force Python grid search (0.0001 °C steps, 40.0937 °C), and
// the starch-iodine clearing time against Python's closed form 100 ln 20 / r and a step-by-step spot test.
import { ENZYMES, tempFactor, pHFactor, rate, bestTemp, starchLeft, timeToClear, spotTime, apparent } from '../../src/lib/sci/enzlab.ts';

export default async (check) => {
  const near = (a, b, t = 1e-9) => Math.abs(a - b) <= t;
  const [amy, pep, tryp] = ENZYMES;
  const py = [[amy, 10, 37, 6.8, 'none', 0, 78.55631867509426], [pep, 5, 30, 3, 'none', 0, 28.08847739437289], [tryp, 1, 20, 7, 'none', 0, 6.57776827241483],
    [amy, 10, 37, 6.8, 'competitive', 2, 58.9172390063207], [amy, 10, 37, 6.8, 'noncompetitive', 2, 26.18543955836476], [amy, 4, 50, 6, 'none', 0, 10.27296632285322], [tryp, 20, 60, 9, 'none', 0, 0.4761577360505774]];
  check('enzyme: rates match the Python model', py.every(([e, s, t, p, inh, i, want]) => near(rate(e, s, t, p, inh, i), want, 1e-9)));
  check('enzyme: best temperature matches Python grid search (40.09 °C)', near(bestTemp(), 40.0937, 1e-3));
  check('enzyme: speed doubles per 10 °C well below the optimum', near(tempFactor(10) / tempFactor(0), 2, 0.01));
  check('enzyme: boiling leaves almost nothing', tempFactor(100) < 1e-7 && rate(amy, 10, 90, 6.8) < 1e-4);
  check('enzyme: pH peak at each optimum, falls both sides', ENZYMES.every((e) => near(pHFactor(e, e.pHopt), 1) && pHFactor(e, e.pHopt + 1) < 1 && near(pHFactor(e, e.pHopt + 1), pHFactor(e, e.pHopt - 1))));
  check('enzyme: pepsin beats trypsin in acid, trypsin wins in alkali', rate(pep, 10, 37, 2) > rate(tryp, 10, 37, 2) && rate(tryp, 10, 37, 8) > rate(pep, 10, 37, 8));
  check('enzyme: at S = Km the rate is half of Vmax', near(rate(amy, 2, 37, 6.8), apparent(amy, 37, 6.8).vmax / 2));
  const c = apparent(amy, 37, 6.8, 'competitive', 1), n = apparent(amy, 37, 6.8, 'noncompetitive', 1), o = apparent(amy, 37, 6.8);
  check('enzyme: competitive raises Km only, non-competitive lowers Vmax only', near(c.vmax, o.vmax) && near(c.km, 4) && near(n.km, 2) && near(n.vmax, o.vmax / 2));
  check('enzyme: competitive inhibition is overcome by lots of substrate', rate(amy, 1000, 37, 6.8, 'competitive', 2) / rate(amy, 1000, 37, 6.8) > 0.99);
  check('enzyme: no substrate, no rate', rate(amy, 0, 37, 6.8) === 0);
  const r0 = rate(amy, 10, 37, 6.8);
  check('enzyme: clearing time matches 100 ln 20 / r (3.813 min)', near(timeToClear(r0), 3.813483528860635, 1e-9) && near(starchLeft(r0, timeToClear(r0)), 0.05, 1e-12));
  check('enzyme: spot test finds it at the next half minute (4.0)', spotTime(r0) === 4 && spotTime(rate(amy, 10, 80, 6.8)) === Infinity && timeToClear(0) === Infinity);
};
