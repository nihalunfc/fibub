// Chi-square goodness of fit for Mendelian ratios (3:1, 9:3:3:1 and so on), with each class's share of the
// statistic and an exact test: binomial for two classes, multinomial (enumerating every outcome) for more.
import { chiSqUpper } from './geochron.ts';
import { logGamma } from './stats.ts';

export const MENDEL_RATIOS: { id: string; name: string; ratio: number[]; classes: string[] }[] = [
  { id: '3:1', name: '3 : 1 (monohybrid, dominant)', ratio: [3, 1], classes: ['Dominant', 'Recessive'] },
  { id: '1:2:1', name: '1 : 2 : 1 (monohybrid, incomplete dominance)', ratio: [1, 2, 1], classes: ['AA', 'Aa', 'aa'] },
  { id: '1:1', name: '1 : 1 (test cross)', ratio: [1, 1], classes: ['Dominant', 'Recessive'] },
  { id: '9:3:3:1', name: '9 : 3 : 3 : 1 (dihybrid)', ratio: [9, 3, 3, 1], classes: ['A_B_', 'A_bb', 'aaB_', 'aabb'] },
  { id: '1:1:1:1', name: '1 : 1 : 1 : 1 (dihybrid test cross)', ratio: [1, 1, 1, 1], classes: ['AaBb', 'Aabb', 'aaBb', 'aabb'] },
  { id: '9:3:4', name: '9 : 3 : 4 (recessive epistasis)', ratio: [9, 3, 4], classes: ['A_B_', 'A_bb', 'aa__'] },
  { id: '12:3:1', name: '12 : 3 : 1 (dominant epistasis)', ratio: [12, 3, 1], classes: ['A___', 'aaB_', 'aabb'] },
  { id: '9:7', name: '9 : 7 (complementary genes)', ratio: [9, 7], classes: ['A_B_', 'others'] },
  { id: '15:1', name: '15 : 1 (duplicate genes)', ratio: [15, 1], classes: ['any dominant', 'aabb'] },
];

export type Gof = {
  n: number; k: number; df: number; expected: number[]; contrib: number[]; resid: number[];
  chi2: number; p: number; minExpected: number; smallClasses: number;
};

/** Pearson chi-square goodness of fit of observed counts to a ratio (any positive numbers). */
export function chiGof(obs: number[], ratio: number[]): Gof {
  const n = obs.reduce((a, b) => a + b, 0), R = ratio.reduce((a, b) => a + b, 0), k = obs.length;
  const expected = ratio.map((r) => (n * r) / R);
  const contrib = obs.map((o, i) => (o - expected[i]) ** 2 / expected[i]), resid = obs.map((o, i) => (o - expected[i]) / Math.sqrt(expected[i]));
  const chi2 = contrib.reduce((a, b) => a + b, 0), df = k - 1;
  return { n, k, df, expected, contrib, resid, chi2, p: chiSqUpper(chi2, df), minExpected: Math.min(...expected), smallClasses: expected.filter((e) => e < 5).length };
}

/** Number of possible outcomes (compositions of n into k classes). */
export const outcomes = (n: number, k: number) => Math.exp(logGamma(n + k) - logGamma(k) - logGamma(n + 1));

/**
 * Exact test: the total probability, under the ratio, of every outcome with the same total that is no more
 * likely than the one observed. Two classes: the binomial test; more: full multinomial enumeration
 * (refused above `limit` outcomes, returning NaN).
 */
export function exactGof(obs: number[], ratio: number[], limit = 4e7) {
  const n = obs.reduce((a, b) => a + b, 0), R = ratio.reduce((a, b) => a + b, 0), k = obs.length;
  const lp = ratio.map((r) => Math.log(r / R)), lf = new Float64Array(n + 1);
  for (let i = 0; i <= n; i++) lf[i] = logGamma(i + 1);
  const logP = (x: number[]) => { let s = lf[n]; for (let i = 0; i < k; i++) s += x[i] * lp[i] - lf[x[i]]; return s; };
  const lobs = logP(obs), tol = 1e-7;
  if (k === 2) {
    let p = 0;
    for (let x = 0; x <= n; x++) { const l = logP([x, n - x]); if (l <= lobs + tol) p += Math.exp(l); }
    return Math.min(1, p);
  }
  if (outcomes(n, k) > limit) return NaN;
  // Walk every outcome, carrying the partial log-probability; the last two classes are a flat loop.
  let p = 0;
  const a = lp[k - 2], b = lp[k - 1], cut = lobs + tol;
  const rec = (i: number, left: number, s: number) => {
    if (i === k - 2) {
      for (let v = 0; v <= left; v++) { const l = s + v * a - lf[v] + (left - v) * b - lf[left - v]; if (l <= cut) p += Math.exp(l); }
      return;
    }
    for (let v = 0; v <= left; v++) rec(i + 1, left - v, s + v * lp[i] - lf[v]);
  };
  rec(0, n, lf[n]);
  return Math.min(1, p);
}

/** Read a ratio like "9:3:3:1" or "9, 7". */
export function parseRatio(s: string): number[] {
  return s.split(/[:,;\s]+/).filter(Boolean).map(Number);
}
