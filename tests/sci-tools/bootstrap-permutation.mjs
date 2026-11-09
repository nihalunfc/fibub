// #562 bootstrap and permutation tests, checked against scipy 1.18.1:
// - percentile and BCa intervals computed by scipy.stats.bootstrap from OUR bootstrap distribution (seed 7, 20,000
//   resamples, passed in as bootstrap_result with n_resamples=0) must agree to 1e-8: same quantiles, same z0, same
//   jackknife acceleration;
// - scipy's own Monte Carlo BCa (20,000 resamples, numpy rng 1) must agree within 0.15 bootstrap SE, SE within 3 %;
// - exact permutation p-values equal scipy.stats.permutation_test (two groups, paired sign flips) or a full
//   itertools enumeration in Python (correlation, 7! orderings); Monte Carlo p-values agree with scipy's
//   (50,000 permutations; the paired one with 2,000,000 NumPy sign flips) within 4 binomial standard errors.
import * as S from '../../src/lib/sci/resample.ts';
const R = {"x": [8.475, 8.61, 7.107, 5.418, 6.819, 13.75, 7.556, 9.323, 5.485, 4.451, 10.889, 20.215, 9.703, 7.79, 3.816, 5.025, 1.681, 3.448, 4.575, 4.397, 17.371, 7.153, 13.444, 11.299, 5.716], "y": [12.514, 4.095, 7.082, 14.72, 7.419, 13.715, 12.939, 4.445, 12.526, 18.224, 7.333, 7.098, 9.923, 8.326, 9.826, 8.849, 21.551, 17.529], "px": [7.809, 14.737, 10.325, 11.188, 11.637, 8.642, 10.955, 5.893, 14.512, 11.701, 8.161, 10.598, 8.338, 15.274, 10.898, 11.521, 7.788, 8.756, 8.409, 9.736, 10.841, 12.418, 11.368, 9.034, 11.669, 9.723, 11.007, 9.864, 12.003, 9.718], "py": [5.4, 8.481, 6.231, 6.639, 6.176, 7.742, 2.71, 4.65, 9.588, 8.561, 2.366, 5.845, 4.143, 8.039, 2.507, 6.204, 3.466, 3.185, 2.139, 4.373, 4.952, 5.171, 5.29, 7.276, 6.928, 3.806, 4.013, 3.788, 8.901, 9.129], "cases": {"mean": {"s": "mean", "perc": [6.533949, 9.927084000000004], "bca": [6.697454133069421, 10.193417428711749], "own": [6.686964625200477, 10.139693193311748, 0.8667545279006079]}, "median": {"s": "median", "perc": [5.418, 9.323], "bca": [5.485, 9.323], "own": [5.418, 9.323, 0.9431588604025292]}, "sd": {"s": "sd", "perc": [2.699151484630894, 5.66444167045563], "bca": [3.1603799803630124, 6.189433402844578], "own": [3.1867316522793874, 6.210820057534696, 0.7545889908466125]}, "dmean": {"s": "diff-mean", "perc": [-5.6281110555555545, -0.13430888888888864], "bca": [-5.636111112623643, -0.13818926520121122], "own": [-5.645460785500384, -0.14973470129719307, 1.4029696863320755]}, "dmedian": {"s": "diff-median", "perc": [-7.0165, 0.3409999999999993], "bca": [-6.797999999999999, 0.4759999999999991], "own": [-6.803999999999999, 0.4740000000000002, 1.9340771409722404]}, "pearson": {"s": "pearson", "perc": [0.26905732296620805, 0.761831259868523], "bca": [0.2584264708031096, 0.756565521730872], "own": [0.2506967652324926, 0.7580125964708073, 0.12700246502430568]}, "spearman": {"s": "spearman", "perc": [0.20934213302529958, 0.7638965653611647], "bca": [0.20491794256331264, 0.7622388273806623], "own": [0.1920815865301217, 0.7642220121315202, 0.14604478710632487]}, "pmean": {"s": "paired-mean", "perc": [4.158060000000001, 5.598702499999999], "bca": [4.123771730859117, 5.564529047693563], "own": [4.119967435911931, 5.570605416537445, 0.3691780488754937]}}, "perm": {"sx": [3.1, 4.5, 2.8, 5, 4.1, 3.7], "sy": [5.2, 6.1, 4.9, 5.8, 6.4], "cx": [1, 2, 3, 4, 5, 6, 7], "cy": [2.1, 1.9, 3.5, 3.9, 5.2, 4.4, 6.8], "pd1": [10.1, 9.8, 11.2, 10.5, 9.9, 10.8, 11, 10.2], "pd2": [9.6, 9.9, 10.4, 10.1, 9.5, 10, 10.9, 9.7], "two": [0.008658008658008658, 0.004329004329004329, 0.025974025974025976], "corr": [0.0031746031746031746, 0.003373015873015873], "paired": [0.0234375, 0.01171875], "mcTwo": 0.05323893522129557, "mcCorr": 0.08507829843403132, "mcPaired": 0.557988}};
export default async (check) => {
  const near = (a, b, tol = 1e-8) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
  const { x, y, px, py } = R;
  const data = { mean: [x], median: [x], sd: [x], 'diff-mean': [x, y], 'diff-median': [x, y], pearson: [px, py], spearman: [px, py], 'paired-mean': [px, py] };
  for (const [k, c] of Object.entries(R.cases)) {
    const [a, b] = data[c.s], r = S.bootstrap(c.s, a, b, 20000, 0.95, 7);
    check(`boot: ${c.s} percentile interval equals scipy on the same distribution`, near(r.percentile[0], c.perc[0]) && near(r.percentile[1], c.perc[1]));
    check(`boot: ${c.s} BCa interval equals scipy on the same distribution`, near(r.bca[0], c.bca[0]) && near(r.bca[1], c.bca[1]));
    check(`boot: ${c.s} BCa within 0.15 SE of scipy's own bootstrap, SE within 3 %`, Math.abs(r.bca[0] - c.own[0]) < 0.15 * r.se && Math.abs(r.bca[1] - c.own[1]) < 0.15 * r.se && Math.abs(r.se / c.own[2] - 1) < 0.03);
  }
  const r1 = S.bootstrap('mean', x, undefined, 2000, 0.95, 99), r2 = S.bootstrap('mean', x, undefined, 2000, 0.95, 99), r3 = S.bootstrap('mean', x, undefined, 2000, 0.95, 100);
  check('boot: the same seed repeats exactly, another seed differs', r1.dist.every((v, i) => v === r2.dist[i]) && r1.bca[0] === r2.bca[0] && r1.dist.some((v, i) => v !== r3.dist[i]));
  const P = R.perm;
  const two = [S.permutation('diff-mean', P.sx, P.sy, 9999), S.permutation('diff-mean', P.sx, P.sy, 9999, 'less'), S.permutation('diff-median', P.sx, P.sy, 9999)];
  check('perm: exact two-group p-values (462 splits) equal scipy', two.every((t, i) => t.exact && t.count === 462 && near(t.p, P.two[i], 1e-12)));
  const cor = [S.permutation('pearson', P.cx, P.cy, 9999), S.permutation('spearman', P.cx, P.cy, 9999, 'greater')];
  check('perm: exact correlation p-values over all 5,040 orderings', cor.every((t, i) => t.exact && t.count === 5040 && near(t.p, P.corr[i], 1e-12)));
  const pr = [S.permutation('paired-mean', P.pd1, P.pd2, 9999), S.permutation('paired-mean', P.pd1, P.pd2, 9999, 'greater')];
  check('perm: exact paired sign-flip p-values equal scipy', pr.every((t, i) => t.exact && t.count === 256 && near(t.p, P.paired[i], 1e-12)));
  const se = (p, B) => Math.sqrt((p * (1 - p)) / B);
  { const t = S.permutation('diff-mean', x, y, 50000); check(`perm: Monte Carlo two-group p ${t.p.toFixed(4)} near scipy ${P.mcTwo.toFixed(4)}`, !t.exact && Math.abs(t.p - P.mcTwo) < 4 * Math.SQRT2 * 2 * se(P.mcTwo / 2, 50000)); }
  { const t = S.permutation('pearson', px, py.map((v, i) => v + (i % 2 ? 3 : -3)), 50000); check(`perm: Monte Carlo correlation p ${t.p.toFixed(4)} near scipy ${P.mcCorr.toFixed(4)}`, Math.abs(t.p - P.mcCorr) < 4 * Math.SQRT2 * 2 * se(P.mcCorr / 2, 50000)); }
  { const t = S.permutation('paired-mean', px, py.map((v) => v * 2 - 0.3), 50000); check(`perm: Monte Carlo paired p ${t.p.toFixed(4)} near ${P.mcPaired}`, Math.abs(t.p - P.mcPaired) < 4 * 2 * se(P.mcPaired / 2, 50000)); }
  { const t = S.permutation('diff-mean', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24], 999); check('perm: Monte Carlo p never 0: (count + 1) / (B + 1)', !t.exact && near(t.p, 2 / 1000)); }
  { const h = S.histogram([0, 0.5, 1, 1, 2], 2, 0, 2); check('boot: histogram bins', h.counts.join() === '2,3' && h.width === 1); }
  let threw = 0; for (const f of [() => S.bootstrap('mean', [1]), () => S.bootstrap('pearson', [1, 2, 3], [1, 1, 1]), () => S.permutation('mean', [1, 2], [3, 4]), () => S.bootstrap('mean', [1, 2, 3], undefined, 10), () => S.bootstrap('paired-mean', [1, 2, 3], [1, 2])]) { try { f(); } catch { threw++; } }
  check('boot: bad input throws plain errors', threw === 5);
};
