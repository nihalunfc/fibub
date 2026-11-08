// Reliability and agreement: Cronbach's alpha with item statistics, Cohen's kappa (with linear or
// quadratic weights), Fleiss' kappa, and the six intraclass correlations of Shrout and Fleiss (1979).
import { normInv, fInv, fSf } from './stats.ts';

const mean = (a: number[]) => a.reduce((s, x) => s + x, 0) / a.length;
const variance = (a: number[]) => { const m = mean(a); return a.reduce((s, x) => s + (x - m) ** 2, 0) / (a.length - 1); };
const corr = (a: number[], b: number[]) => { const ma = mean(a), mb = mean(b); let sab = 0, saa = 0, sbb = 0; for (let i = 0; i < a.length; i++) { sab += (a[i] - ma) * (b[i] - mb); saa += (a[i] - ma) ** 2; sbb += (b[i] - mb) ** 2; } return sab / Math.sqrt(saa * sbb); };

/** rows: respondents; columns: items. Rows with a missing value are left out. */
export function cronbach(rows: number[][]) {
  const X = rows.filter((r) => r.every(Number.isFinite));
  const k = X[0]?.length ?? 0, n = X.length;
  if (k < 2) throw new Error('Need at least two items (columns)');
  if (n < 3) throw new Error('Need at least three complete respondents (rows)');
  const items = Array.from({ length: k }, (_, j) => X.map((r) => r[j]));
  const total = X.map((r) => r.reduce((s, x) => s + x, 0));
  const alphaOf = (cols: number[][]) => { const kk = cols.length, tot = X.map((_, i) => cols.reduce((s, c) => s + c[i], 0)); return (kk / (kk - 1)) * (1 - cols.reduce((s, c) => s + variance(c), 0) / variance(tot)); };
  const alpha = alphaOf(items);
  // Standardised alpha from the mean inter-item correlation.
  let rsum = 0, pairs = 0;
  for (let a = 0; a < k; a++) for (let b = a + 1; b < k; b++) { rsum += corr(items[a], items[b]); pairs++; }
  const rbar = rsum / pairs;
  // Feldt (1965) 95 % interval: (1 - alpha) follows an F distribution with n - 1 and (n - 1)(k - 1) df.
  const d1 = n - 1, d2 = (n - 1) * (k - 1);
  const ci: [number, number] = [1 - (1 - alpha) * fInv(0.975, d1, d2), 1 - (1 - alpha) * fInv(0.025, d1, d2)];
  return {
    alpha, ci, std: (k * rbar) / (1 + (k - 1) * rbar), rbar, n, k,
    items: items.map((c, j) => ({ mean: mean(c), sd: Math.sqrt(variance(c)), itemRest: corr(c, total.map((t, i) => t - c[i])), alphaIfDeleted: k > 2 ? alphaOf(items.filter((_, x) => x !== j)) : NaN })),
  };
}

/** Cohen's kappa from an r × r table (rows rater 1, columns rater 2). Weights: none, linear or quadratic (ordered categories). */
export function cohen(table: number[][], weights: 'none' | 'linear' | 'quadratic' = 'none') {
  const r = table.length, N = table.flat().reduce((s, x) => s + x, 0);
  if (r < 2 || table.some((row) => row.length !== r)) throw new Error('The table must be square, with at least two categories');
  if (!N) throw new Error('The table is empty');
  const row = table.map((x) => x.reduce((s, v) => s + v, 0) / N), col = table[0].map((_, j) => table.reduce((s, x) => s + x[j], 0) / N);
  const w = (i: number, j: number) => weights === 'none' ? (i === j ? 1 : 0) : weights === 'linear' ? 1 - Math.abs(i - j) / (r - 1) : 1 - ((i - j) / (r - 1)) ** 2;
  let po = 0, pe = 0;
  for (let i = 0; i < r; i++) for (let j = 0; j < r; j++) { po += (w(i, j) * table[i][j]) / N; pe += w(i, j) * row[i] * col[j]; }
  const kappa = (po - pe) / (1 - pe);
  // Large-sample standard error (Fleiss, Cohen and Everitt 1969) for unweighted kappa.
  let se = NaN;
  if (weights === 'none') {
    let a = 0, b = 0;
    for (let i = 0; i < r; i++) a += (table[i][i] / N) * (1 - (row[i] + col[i]) * (1 - kappa)) ** 2;
    for (let i = 0; i < r; i++) for (let j = 0; j < r; j++) if (i !== j) b += (table[i][j] / N) * (row[j] + col[i]) ** 2 * (1 - kappa) ** 2;
    const c = (kappa - pe * (1 - kappa)) ** 2;
    se = Math.sqrt((a + b - c) / (N * (1 - pe) ** 2));
  }
  const z = normInv(0.975);
  return { kappa, po, pe, n: N, se, ci: [kappa - z * se, kappa + z * se] as [number, number] };
}

/** Fleiss' kappa: rows are subjects, columns categories, cells the number of raters choosing it (same total per row). */
export function fleiss(counts: number[][]) {
  const N = counts.length, k = counts[0]?.length ?? 0, n = counts[0]?.reduce((s, x) => s + x, 0) ?? 0;
  if (N < 2 || k < 2) throw new Error('Need at least two subjects and two categories');
  if (counts.some((r) => r.length !== k || r.reduce((s, x) => s + x, 0) !== n)) throw new Error('Every subject must have the same number of ratings');
  if (n < 2) throw new Error('Need at least two raters');
  const pj = Array.from({ length: k }, (_, j) => counts.reduce((s, r) => s + r[j], 0) / (N * n));
  const Pi = counts.map((r) => (r.reduce((s, x) => s + x * x, 0) - n) / (n * (n - 1)));
  const P = mean(Pi), Pe = pj.reduce((s, x) => s + x * x, 0);
  return { kappa: (P - Pe) / (1 - Pe), P, Pe, subjects: N, raters: n };
}

/** Shrout and Fleiss ICCs from a targets × judges table: one-way random (1), two-way random (2), two-way mixed consistency (3), single and average. */
export function icc(X: number[][]) {
  const Y = X.filter((r) => r.every(Number.isFinite));
  const n = Y.length, k = Y[0]?.length ?? 0;
  if (n < 2 || k < 2) throw new Error('Need at least two targets (rows) and two judges (columns)');
  const g = mean(Y.flat()), rm = Y.map(mean), cm = Array.from({ length: k }, (_, j) => mean(Y.map((r) => r[j])));
  const SSR = k * rm.reduce((s, x) => s + (x - g) ** 2, 0), SSC = n * cm.reduce((s, x) => s + (x - g) ** 2, 0);
  const SST = Y.flat().reduce((s, x) => s + (x - g) ** 2, 0), SSE = SST - SSR - SSC, SSW = SST - SSR;
  const BMS = SSR / (n - 1), JMS = SSC / (k - 1), EMS = SSE / ((n - 1) * (k - 1)), WMS = SSW / (n * (k - 1));
  const icc1 = (BMS - WMS) / (BMS + (k - 1) * WMS), icc2 = (BMS - EMS) / (BMS + (k - 1) * EMS + (k * (JMS - EMS)) / n), icc3 = (BMS - EMS) / (BMS + (k - 1) * EMS);
  // 95 % intervals and F tests of McGraw and Wong (1996), as in R's psych::ICC.
  const q = 0.975, dfB = n - 1, dfW = n * (k - 1), dfE = (n - 1) * (k - 1);
  const F1 = BMS / WMS, F3 = BMS / EMS;
  const F1L = F1 / fInv(q, dfB, dfW), F1U = F1 * fInv(q, dfW, dfB), F3L = F3 / fInv(q, dfB, dfE), F3U = F3 * fInv(q, dfE, dfB);
  const one = (F: number) => (F - 1) / (F + k - 1), avg = (F: number) => 1 - 1 / F, sb = (r: number) => (k * r) / (1 + (k - 1) * r);
  const a = (k * icc2) / (n * (1 - icc2)), b = 1 + (k * icc2 * (n - 1)) / (n * (1 - icc2));
  const v = (a * JMS + b * EMS) ** 2 / ((a * JMS) ** 2 / (k - 1) + (b * EMS) ** 2 / dfE);
  const Fs = fInv(q, dfB, v), Fs2 = fInv(q, v, dfB);
  const L2 = (n * (BMS - Fs * EMS)) / (Fs * (k * JMS + (k * n - k - n) * EMS) + n * BMS);
  const U2 = (n * (Fs2 * BMS - EMS)) / (k * JMS + (k * n - k - n) * EMS + n * Fs2 * BMS);
  const t1 = { F: F1, df1: dfB, df2: dfW, p: fSf(F1, dfB, dfW) }, t3 = { F: F3, df1: dfB, df2: dfE, p: fSf(F3, dfB, dfE) };
  return {
    n, k, BMS, JMS, EMS, WMS,
    icc1, icc1k: (BMS - WMS) / BMS, icc2, icc2k: (BMS - EMS) / (BMS + (JMS - EMS) / n), icc3, icc3k: (BMS - EMS) / BMS,
    ci: {
      icc1: [one(F1L), one(F1U)], icc1k: [avg(F1L), avg(F1U)],
      icc2: [L2, U2], icc2k: [sb(L2), sb(U2)],
      icc3: [one(F3L), one(F3U)], icc3k: [avg(F3L), avg(F3U)],
    } as Record<string, [number, number]>,
    test: { icc1: t1, icc1k: t1, icc2: t3, icc2k: t3, icc3: t3, icc3k: t3 } as Record<string, { F: number; df1: number; df2: number; p: number }>,
  };
}
