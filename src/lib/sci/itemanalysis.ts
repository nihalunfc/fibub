// Classical test theory item analysis: difficulty (p), discrimination (upper-lower index with 27 % groups,
// point-biserial and corrected item-total correlations), KR-20 reliability, and distractor analysis for
// multiple-choice answers scored against a key.

const mean = (a: number[]) => a.reduce((s, x) => s + x, 0) / a.length;
/** Pearson correlation; NaN when either variable is constant. */
export function pearson(x: number[], y: number[]): number {
  const mx = mean(x), my = mean(y);
  let sxy = 0, sxx = 0, syy = 0;
  for (let i = 0; i < x.length; i++) { const dx = x[i] - mx, dy = y[i] - my; sxy += dx * dy; sxx += dx * dx; syy += dy * dy; }
  return sxx > 0 && syy > 0 ? sxy / Math.sqrt(sxx * syy) : NaN;
}

/** Score letter (or any text) answers against a key: 1 right, 0 wrong or blank. */
export function scoreAnswers(A: string[][], key: string[]): number[][] {
  const K = key.map((k) => k.trim().toUpperCase());
  return A.map((r) => K.map((k, j) => ((r[j] ?? '').trim().toUpperCase() === k && k !== '' ? 1 : 0)));
}

export type ItemStats = { p: number; pUpper: number; pLower: number; D: number; rpb: number; rit: number; alphaIfDeleted: number };
export type TestStats = {
  n: number; k: number; total: number[]; mean: number; sd: number; kr20: number; kr21: number; sem: number;
  upper: number[]; lower: number[]; groupSize: number; items: ItemStats[];
};

/** KR-20 from a 0/1 matrix (population variances, so it equals Cronbach's alpha on the same data). */
export function kr20(X: number[][]): number {
  const n = X.length, k = X[0].length, tot = X.map((r) => r.reduce((s, x) => s + x, 0));
  const m = mean(tot), v = tot.reduce((s, t) => s + (t - m) ** 2, 0) / n;
  let pq = 0; for (let j = 0; j < k; j++) { const p = X.reduce((s, r) => s + r[j], 0) / n; pq += p * (1 - p); }
  return (k / (k - 1)) * (1 - pq / v);
}

/**
 * X: people × items of 0/1. Upper and lower groups are the top and bottom `frac` of people by total score
 * (rounded to whole people); people tied at the cut are taken in row order.
 */
export function analyse(X: number[][], frac = 0.27): TestStats {
  const n = X.length, k = X[0]?.length ?? 0;
  if (k < 2) throw new Error('Need at least two items');
  if (n < 4) throw new Error('Need at least four people');
  if (!(frac > 0 && frac <= 0.5)) throw new Error('The group size must be above 0 % and at most 50 %');
  for (const r of X) for (const v of r) if (v !== 0 && v !== 1) throw new Error('Scores must be 0 or 1');
  const total = X.map((r) => r.reduce((s, x) => s + x, 0));
  const m = mean(total), vPop = total.reduce((s, t) => s + (t - m) ** 2, 0) / n, sd = Math.sqrt(vPop * n / (n - 1));
  const g = Math.max(1, Math.round(frac * n));
  const order = total.map((_, i) => i).sort((a, b) => total[b] - total[a] || a - b);
  const upper = order.slice(0, g), lower = order.slice(n - g).reverse().sort((a, b) => a - b);
  const kr = k > 1 ? kr20(X) : NaN;
  const kr21 = (k / (k - 1)) * (1 - (m * (k - m)) / (k * vPop));
  const items = Array.from({ length: k }, (_, j) => {
    const col = X.map((r) => r[j]), p = mean(col);
    const pU = mean(upper.map((i) => X[i][j])), pL = mean(lower.map((i) => X[i][j]));
    return {
      p, pUpper: pU, pLower: pL, D: pU - pL,
      rpb: pearson(col, total), rit: pearson(col, total.map((t, i) => t - col[i])),
      alphaIfDeleted: k > 2 ? kr20(X.map((r) => r.filter((_, c) => c !== j))) : NaN,
    };
  });
  return { n, k, total, mean: m, sd, kr20: kr, kr21, sem: sd * Math.sqrt(Math.max(0, 1 - kr)), upper, lower, groupSize: g, items };
}

export type OptionStats = { option: string; key: boolean; count: number; prop: number; pUpper: number; pLower: number; rpb: number };
/** Distractor analysis for one item: every option chosen (and blanks), with its share overall and in each group. */
export function distractors(answers: string[], key: string, total: number[], upper: number[], lower: number[]): OptionStats[] {
  const A = answers.map((a) => (a ?? '').trim().toUpperCase()), K = key.trim().toUpperCase();
  const opts = [...new Set(A.filter((a) => a !== '').concat(K))].sort((a, b) => a.localeCompare(b, 'en', { numeric: true }));
  if (A.some((a) => a === '')) opts.push('');
  return opts.map((o) => {
    const pick = A.map((a) => (a === o ? 1 : 0));
    return {
      option: o, key: o === K, count: pick.reduce((s, x) => s + x, 0), prop: mean(pick),
      pUpper: mean(upper.map((i) => pick[i])), pLower: mean(lower.map((i) => pick[i])), rpb: pearson(pick, total),
    };
  });
}
