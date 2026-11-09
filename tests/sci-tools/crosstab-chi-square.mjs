// #747 Cross-tab and chi-square: checked against scipy 1.18 (chi2_contingency with and without Yates, the
// log-likelihood G², contingency.association Cramér's V, fisher_exact two-sided/less/greater) and statsmodels
// Table (Pearson and standardised residuals) on the made-up survey in src/tools/crosstab-chi-square/example.csv.
// The weighted design-effect correction is checked against an independent numpy implementation.
import { readFileSync } from 'node:fs';
import { crosstab, fisherExact, chiSqSf, gammaP } from '../../src/lib/sci/crosstab.ts';
import { readColumns } from '../../src/lib/sci/econometrics.ts';
import { parseTable } from '../../src/lib/sci/num.ts';

const R = {"age_trans": {"chi2": 22.455385858493724, "p": 0.00016263703201152, "df": 4, "E": [[29.26890756302521, 31.798319327731093, 24.932773109243698], [34.37394957983193, 37.34453781512605, 29.281512605042018], [17.357142857142858, 18.857142857142858, 14.785714285714286]], "g2": 24.223126941223054, "pg": 7.205585887135498e-05, "V": 0.2171984815209048, "resid": [[2.5380597056015155, -1.9149352033467106, -0.5873448608353796], [-0.40490838738706064, 0.4345368149753187, -0.052023682667639286], [-2.72602584933029, 1.8751623306353424, 0.835917318863029]], "adj": [[3.910273827897144, -3.018308429833621, -0.8721777110930203], [-0.6570881274374673, 0.72143568556365, -0.08137189182611075], [-3.7864854929641285, 2.664706579911717, 1.1191186278775915]]}, "region_walk": {"chi2": 3.4641454420718625, "p": 0.06271290453314124, "df": 1, "E": [[69.58823529411765, 28.41176470588235], [99.41176470588235, 40.588235294117645]], "g2": 3.529589197703391, "pg": 0.06028272240385086, "V": 0.12064507014329999, "resid": [[0.7686164321236553, -1.2028970834003025], [-0.6430706444951038, 1.006415905715458]], "adj": [[1.861221491943362, -1.8612214919433598], [-1.8612214919433616, 1.8612214919433578]], "yates": 2.9449318240288127, "py": 0.08614733417708718, "fp": 0.08121543043146838, "OR": 1.7458455522971652, "fl": 0.9784126180263486, "fg": 0.04220561943886174}, "small": {"chi2": 2.0, "p": 0.15729920705028105, "df": 1, "E": [[2.0, 2.0], [2.0, 2.0]], "g2": 2.0929925750581915, "pg": 0.14797595938502317, "V": 0.5, "resid": [[0.7071067811865475, -0.7071067811865475], [-0.7071067811865475, 0.7071067811865475]], "adj": [[1.414213562373095, -1.414213562373095], [-1.414213562373095, 1.414213562373095]], "yates": 0.5, "py": 0.47950012218695337, "fp": 0.48571428571428565, "OR": 9.0, "fl": 0.9857142857142858, "fg": 0.24285714285714283}, "weighted": {"W": [[61.585, 28.385, 27.098], [42.485, 53.688, 36.428], [9.037, 35.025999999999996, 22.943]], "deff": 1.2075955454613225, "x2s": 23.19129955360474, "x2": 19.204525588693905, "p": 0.000716454837455072, "g2": 20.38955551161239, "V": 0.22072883261955106}};

export default async (check) => {
  const { cols } = readColumns(parseTable(readFileSync(new URL('../../src/tools/crosstab-chi-square/example.csv', import.meta.url), 'utf8')));
  const keep = cols.main_transport.map((c, i) => (c !== '' ? i : -1)).filter((i) => i >= 0);
  const age = keep.map((i) => cols.age_group[i]), tr = keep.map((i) => cols.main_transport[i]), reg = keep.map((i) => cols.region[i]), w = keep.map((i) => +cols.weight[i]);
  const rel = (a, b) => Math.abs(a - b) / Math.max(1e-300, Math.abs(b));
  const close = (A, B, tol = 1e-10) => A.flat().every((x, k) => Math.abs(x - B.flat()[k]) < tol * Math.max(1, Math.abs(B.flat()[k])));
  const t = crosstab(age, tr), r = R.age_trans;
  check('crosstab: 3 × 3 counts 43 21 22 / 32 40 29 / 6 27 18 (2 blanks left out)', close(t.O, [[43, 21, 22], [32, 40, 29], [6, 27, 18]]) && t.n === 238);
  check(`crosstab: Pearson χ² ${t.chi2.toFixed(4)}, p and df match scipy`, rel(t.chi2, r.chi2) < 1e-12 && rel(t.p, r.p) < 1e-9 && t.df === 4);
  check('crosstab: expected counts match scipy', close(t.E, r.E));
  check(`crosstab: G² ${t.g2.toFixed(4)} and p match scipy (log-likelihood)`, rel(t.g2, r.g2) < 1e-12 && rel(t.pG2, r.pg) < 1e-9);
  check(`crosstab: Cramér's V ${t.cramerV.toFixed(4)} matches scipy`, rel(t.cramerV, r.V) < 1e-12);
  check('crosstab: Pearson and adjusted residuals match statsmodels Table', close(t.resid, r.resid) && close(t.adjResid, r.adj));
  check('crosstab: row, column and total percentages add up', t.rowPct.every((x) => Math.abs(x.reduce((s, v) => s + v, 0) - 100) < 1e-9) && Math.abs(t.colPct.reduce((s, x) => s + x[0], 0) - 100) < 1e-9 && Math.abs(t.totPct.flat().reduce((s, v) => s + v, 0) - 100) < 1e-9);
  const walk = tr.map((x) => (x === 'Walk or cycle' ? 'Walk or cycle' : 'Other'));
  const t2 = crosstab(reg, walk, undefined, { rows: ['Rural', 'Urban'], cols: ['Other', 'Walk or cycle'] }), r2 = R.region_walk;
  check('crosstab: 2 × 2 χ², G², V, residuals match scipy/statsmodels', rel(t2.chi2, r2.chi2) < 1e-12 && rel(t2.g2, r2.g2) < 1e-12 && rel(t2.cramerV, r2.V) < 1e-12 && close(t2.adjResid, r2.adj));
  check(`crosstab: Yates χ² ${t2.yates.chi2.toFixed(4)} and p match scipy's correction`, rel(t2.yates.chi2, r2.yates) < 1e-12 && rel(t2.yates.p, r2.py) < 1e-9);
  check(`crosstab: Fisher exact p ${t2.fisher.p.toFixed(5)}, one-sided and odds ratio match scipy`, rel(t2.fisher.p, r2.fp) < 1e-9 && rel(t2.fisher.less, r2.fl) < 1e-9 && rel(t2.fisher.greater, r2.fg) < 1e-9 && rel(t2.fisher.oddsRatio, r2.OR) < 1e-12);
  const f = fisherExact([[3, 1], [1, 3]]);
  check(`crosstab: Fisher on [[3, 1], [1, 3]] p ${f.p.toFixed(4)} matches scipy (0.4857)`, rel(f.p, R.small.fp) < 1e-9 && f.oddsRatio === 9);
  check('crosstab: small expected counts are counted', crosstab(['a', 'a', 'a', 'b', 'b', 'b', 'a', 'b'], ['x', 'x', 'x', 'y', 'y', 'y', 'y', 'x']).smallCells === 4);
  check('crosstab: Fisher odds ratio with a zero cell', fisherExact([[5, 0], [2, 3]]).oddsRatio === Infinity);
  // Weighted: design-effect correction.
  const tw = crosstab(age, tr, w), rw = R.weighted;
  check('crosstab: weighted cell totals', close(tw.O, rw.W, 1e-9));
  check(`crosstab: Kish design effect ${tw.design.deff.toFixed(4)} and corrected χ² ${tw.design.chi2.toFixed(4)} match numpy`, rel(tw.design.deff, rw.deff) < 1e-12 && rel(tw.design.chi2Shares, rw.x2s) < 1e-10 && rel(tw.design.chi2, rw.x2) < 1e-10 && rel(tw.design.p, rw.p) < 1e-8 && rel(tw.design.g2, rw.g2) < 1e-10);
  check('crosstab: weighted Cramér V from weighted shares', rel(tw.cramerV, rw.V) < 1e-10 && tw.yates === undefined);
  // Distribution functions.
  check('crosstab: χ² upper tail: P(χ²₁ > 3.841459) = 0.05, P(χ²₁₀ > 18.307038) = 0.05', Math.abs(chiSqSf(3.841458820694124, 1) - 0.05) < 1e-12 && Math.abs(chiSqSf(18.307038053275146, 10) - 0.05) < 1e-12);
  check('crosstab: χ² tail far out and incomplete gamma', Math.abs(chiSqSf(100, 4) / 9.836624224615988e-21 - 1) < 1e-8 && Math.abs(gammaP(1, 1) - (1 - Math.exp(-1))) < 1e-15);
  const e = (fn) => { try { fn(); return ''; } catch (x) { return x.message; } };
  check('crosstab: one category explained', /at least two categories/.test(e(() => crosstab(['a', 'a'], ['x', 'y']))));
  check('crosstab: bad weight explained', /Weight in data row 2/.test(e(() => crosstab(['a', 'b', 'a'], ['x', 'y', 'y'], [1, -1, 1]))));
};
