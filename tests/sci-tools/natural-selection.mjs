// #1126 Natural selection. The expected (no-chance) allele path was checked against a separate Python version
// that works genotype by genotype (p' = (CC·w_dark + ½Cc·w_dark) / w̄) for three schedules over 40 generations;
// the 1-df chi-square p-value against Python's math.erfc (3.841 -> 0.0500, 0.5 -> 0.4795); the random runs for
// their average against the expected path. Mutation (c -> C at rate mu) was checked against the same Python
// recursion with p <- p + mu(1 - p) after selection (soot story, 60 generations, mu = 1e-4: p = 0.8936327362291027).
import { barkAt, fitness, nextP, simulate, hwCheck, binomial, erfc, poisson, mutate } from '../../src/lib/sci/moths.ts';

const PY = {"soot": [0.01, 0.007042040985, 0.004950271051, 0.003475486947, 0.002437915795, 0.001709037904, 0.001197553482, 0.000838889846, 0.000587518486, 0.000411407923, 0.000288056637, 0.000411407917, 0.000587518459, 0.000838889754, 0.001197553196, 0.001709037049, 0.002437913278, 0.003475479605, 0.004950249783, 0.007041979739, 0.009999824809, 0.014164661789, 0.019994198048, 0.028086607106, 0.039193423349, 0.054205297804, 0.074087216103, 0.099739703927, 0.131781016816, 0.170290791, 0.214613990838, 0.263345997894, 0.314554808445, 0.366166118015, 0.416345595046, 0.463737602151, 0.507523261999, 0.547348326947, 0.583196270986, 0.615262266489, 0.643853843609], "clean": [0.9, 0.901803607214, 0.903546101574, 0.905230437511, 0.906859387308, 0.90843555456, 0.909961386488, 0.911439185219, 0.912871118126, 0.914259227316, 0.915605438348, 0.913977999517, 0.912290311575, 0.910539119616, 0.908720939601, 0.906832038647, 0.904868413332, 0.902825765798, 0.900699477383, 0.898484579516, 0.896175721543, 0.893767135125, 0.891252594809, 0.888625374304, 0.885878197966, 0.883003186896, 0.87999179902, 0.876834762406, 0.873522001027, 0.870042552035, 0.866384473559, 0.862534741889, 0.858479136816, 0.854202113793, 0.849686661434, 0.844914142828, 0.839864119018, 0.834514153019, 0.828839592769, 0.822813331583, 0.816405544996], "light": [0.5, 0.486486486486, 0.472638385113, 0.458471104667, 0.444003805798, 0.429259607855, 0.414265738381, 0.3990536097, 0.383658807105, 0.368120974347, 0.352483584397, 0.336793587058, 0.321100929859, 0.30545795463, 0.289918678967, 0.274537979017, 0.259370696985, 0.244470702977, 0.22988994548, 0.215677527424, 0.201878845006, 0.188534824052, 0.175681283837, 0.163348451335, 0.15156064042, 0.140336101425, 0.129687037407, 0.119619775278, 0.11013507322, 0.10122854092, 0.092891146291, 0.085109781463, 0.077867861708, 0.071145933222, 0.064922268993, 0.05917343582, 0.053874819631, 0.049001100204, 0.044526670014, 0.040425995045, 0.03667391799]};

export default async (check) => {
  const near = (a, b, t = 1e-9) => Math.abs(a - b) <= t;
  const path = (p0, s, schedule) => simulate({ p0, s, schedule, N: Infinity, gens: 40 }, Math.random).map((g) => g.p);
  check('moths: expected path matches Python (soot)', path(0.01, 0.3, 'soot').every((p, i) => near(p, PY.soot[i], 1e-10)));
  check('moths: expected path matches Python (clean air)', path(0.9, 0.2, 'clean').every((p, i) => near(p, PY.clean[i], 1e-10)));
  check('moths: expected path matches Python (light bark)', path(0.5, 0.1, 'light').every((p, i) => near(p, PY.light[i], 1e-10)));
  check('moths: bark schedule', barkAt('soot', 9) === 'light' && barkAt('soot', 10) === 'dark' && barkAt('clean', 0) === 'dark' && barkAt('dark', 99) === 'dark');
  check('moths: fitness', fitness('light', 0.3).dark === 0.7 && fitness('light', 0.3).light === 1 && fitness('dark', 0.2).light === 0.8);
  check('moths: no selection, no change', near(nextP(0.37, 1, 1), 0.37) && near(nextP(0, 0.5, 1), 0) && near(nextP(1, 0.5, 1), 1));
  const d = simulate({ p0: 0.5, s: 0.2, schedule: 'dark', N: Infinity, gens: 1 }, Math.random)[0];
  check('moths: Hardy-Weinberg newborns (per 1000)', near(d.CC, 250) && near(d.Cc, 500) && near(d.cc, 250) && near(d.lightLeft, 200));
  check('moths: chi-square 1 df p-value matches math.erfc', near(erfc(Math.sqrt(3.841 / 2)), 0.05001368376, 2e-7) && near(erfc(Math.sqrt(0.5 / 2)), 0.47950012219, 2e-7));
  const hw = hwCheck(36, 48, 16);
  check('moths: perfect HW sample', near(hw.p, 0.6) && near(hw.chi2, 0) && near(hw.pValue, 1, 1e-6));
  const hw2 = hwCheck(50, 20, 30);
  check('moths: HW chi-square by hand', near(hw2.p, 0.6) && near(hw2.chi2, (50 - 36) ** 2 / 36 + (20 - 48) ** 2 / 48 + (30 - 16) ** 2 / 16, 1e-9) && hw2.pValue < 1e-6);
  let s = 9; const r = () => ((s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296);
  check('moths: binomial mean', near(Array.from({ length: 4000 }, () => binomial(30, 0.3, r)).reduce((a, b) => a + b, 0) / 4000, 9, 0.15) && near(Array.from({ length: 2000 }, () => binomial(1000, 0.3, r)).reduce((a, b) => a + b, 0) / 2000, 300, 1.5));
  const runs = Array.from({ length: 200 }, () => simulate({ p0: 0.1, s: 0.3, schedule: 'dark', N: 2000, gens: 10 }, r)[10].p);
  const mean = runs.reduce((a, b) => a + b, 0) / runs.length, exp = path(0.1, 0.3, 'dark')[10];
  check('moths: random runs average the expected path', near(mean, exp, 0.02));
  const run = simulate({ p0: 0.5, s: 0, schedule: 'light', N: 100, gens: 30 }, r);
  const withMu = simulate({ p0: 0.05, s: 0.3, schedule: 'soot', N: Infinity, gens: 60, mu: 1e-4 }, Math.random);
  check('moths: mutation path matches Python', near(withMu[60].p, 0.8936327362291027, 1e-12) && near(mutate(0.2, 0.01), 0.208, 1e-15));
  check('moths: mutation off gives the old path', simulate({ p0: 0.01, s: 0.3, schedule: 'soot', N: Infinity, gens: 40, mu: 0 }, Math.random).every((g, i) => near(g.p, PY.soot[i], 1e-10)));
  check('moths: Poisson mean and zero', near(Array.from({ length: 20000 }, () => poisson(0.5, r)).reduce((a, b) => a + b, 0) / 20000, 0.5, 0.02) && poisson(0, r) === 0);
  let lost5000 = 0, lost500 = 0;
  for (let k = 0; k < 300; k++) { if (simulate({ p0: 0.05, s: 0.3, schedule: 'soot', N: 5000, gens: 60, mu: 1e-4 }, r)[60].dark < 2500) lost5000++; if (simulate({ p0: 0.05, s: 0.3, schedule: 'soot', N: 500, gens: 60, mu: 0 }, r)[60].dark < 250) lost500++; }
  check(`moths: soot story with 5000 moths and mutation ends mostly dark (${lost5000}/300 fail), while 500 with no mutation often loses the allele (${lost500}/300)`, lost5000 <= 3 && lost500 > 60);
  const back = simulate({ p0: 0.05, s: 0.3, schedule: 'light', N: 50, gens: 60, mu: 0.001 }, r);
  check('moths: mutation brings a lost dark allele back', simulate({ p0: 0, s: 0, schedule: 'light', N: 5000, gens: 30, mu: 0.001 }, r)[30].p > 0 && back.length === 61);
  check('moths: counts add up to N each generation', run.every((g) => g.CC + g.Cc + g.cc === 100 && g.dark === g.CC + g.Cc && g.darkLeft <= g.dark));
};
