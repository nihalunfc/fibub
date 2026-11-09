// #494 survey weighting: raking against a separate numpy/pandas IPF and against the raking (exponential) calibration
// equations of Deville and Särndal (1992) solved with scipy.optimize.root; post-stratification against a direct
// pandas count; Kish deff and effective n against numpy. (statsmodels has no raking routine to compare with.)
import { rake, kish, parseMargin, checkMargin, weightedPct, EXAMPLE } from '../../src/lib/sci/surveyw.ts';

export default async (check) => {
  const rel = (a, b, t = 1e-9) => Math.abs(a / b - 1) <= t;
  const rows = EXAMPLE.trim().split('\n').slice(1).map((l) => l.split('\t'));
  const M = [parseMargin('Female, 51\nMale, 49').shares, parseMargin('18-34: 30 %\n35-54: 35 %\n55+: 35 %').shares, parseMargin('North\t40\nSouth\t60').shares];
  const cols = [1, 2, 3].map((j) => rows.map((r) => r[j]));
  const d = rows.map((_, i) => 1 + (i % 3) * 0.5), ones = rows.map(() => 1);
  check('survey: example has 40 respondents', rows.length === 40 && cols.every((c, k) => !checkMargin(c, M[k], 'x')));
  const cases = [
    ['3 variables', 3, ones, 40, [0.48163736, 1.11666287, 1.11666287, 0.59523913], 0.48163736, 2.17694145, 1.2576859940, 31.80444101],
    ['2 variables, design weights', 2, d, 1000, [9.33915143, 22.78324487, 30.37765983, 15.18882991], 9.33915143, 67.79787161, 1.2648415481, 31.62451460],
    ['post-stratification by sex', 1, ones, 40, [0.75555556, 0.75555556, 0.75555556, 0.75555556], 0.75555556, 1.50769231, 1.1241025641, 35.58394161],
    ['3 variables, design weights, population total', 3, d, 5e6, [39130.18241393, 129222.19921791, 172296.26562388, 47347.57244173], 39130.18241393, 378247.23840524, 1.3542843637, 29.53589443],
  ];
  for (const [name, k, dd, T, w4, lo, hi, deff, neff] of cases) {
    const r = rake(cols.slice(0, k), dd, M.slice(0, k), T), kk = kish(r.w);
    check(`survey: raking ${name} matches numpy IPF and scipy calibration`, r.converged && w4.every((v, i) => rel(r.w[i], v, 1e-8)) && rel(Math.min(...r.w), lo, 1e-8) && rel(Math.max(...r.w), hi, 1e-8));
    check(`survey: ${name} Kish deff and effective n`, rel(kk.deff, deff, 1e-9) && rel(kk.neff, neff, 1e-8) && rel(r.w.reduce((s, x) => s + x, 0), T, 1e-12));
    // Every margin is hit.
    let worst = 0;
    for (let j = 0; j < k; j++) for (const p of weightedPct(cols[j], r.w)) worst = Math.max(worst, Math.abs(p.wpct / 100 - M[j].get(p.cat)));
    check(`survey: ${name} hits every population share`, worst < 1e-11);
  }
  { const r = rake(cols, ones, M, 40), s = weightedPct(rows.map((x) => x[4]), r.w).find((p) => p.cat === 'Yes');
    check('survey: weighted % smokers (pandas 28.39043767 %)', Math.abs(s.wpct - 28.39043767) < 1e-7 && s.n === 11 && s.pct === 27.5); }
  { const r = rake([cols[0]], ones, [M[0]], 40);
    check('survey: post-stratification is exact in one pass', r.iterations === 1 && rel(r.w[0], 0.51 * 40 / 27, 1e-14)); }
  check('survey: equal weights give deff 1', rel(kish([2, 2, 2]).deff, 1, 1e-15) && kish([2, 2, 2]).neff === 3 && rel(kish([1, 3]).deff, 1.25, 1e-15));
  { const a = parseMargin('A, 1\nB, 3'), b = parseMargin('A, x'), c = parseMargin('A, 1\nA, 2'), e = parseMargin(''), f = parseMargin('A, -1');
    check('survey: margin parsing', !a.error && a.shares.get('B') === 0.75 && b.error && c.error && e.error && f.error); }
  check('survey: margin checks', checkMargin(['A', 'C'], new Map([['A', 1]]), 'v').includes('"C"') && checkMargin(['A'], new Map([['A', 0.5], ['B', 0.5]]), 'v').includes('No respondent') && checkMargin(['A', ''], new Map([['A', 1]]), 'v').includes('no v') && checkMargin(['A', 'B'], new Map([['A', 1], ['B', 0]]), 'v').includes('share of 0'));
};
