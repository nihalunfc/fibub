// The breeder's equation and heritability estimates. Plain TypeScript, no DOM. Methods (Falconer and Mackay,
// Introduction to Quantitative Genetics, 4th ed., chapters 10 and 11): R = h² S; with truncation selection of a
// proportion p from a normal distribution, S = i σP with selection intensity i = φ(z) / p, z = Φ⁻¹(1 − p);
// response per year R / L. Heritability from the regression of offspring on one parent (h² = 2b) or on the
// mid-parent (h² = b), or from variance components of a one-way analysis of variance (n0 for unequal group sizes).
import { normInv, fSf, tInv } from './stats.ts';

const phi = (z: number) => Math.exp(-z * z / 2) / Math.sqrt(2 * Math.PI);

/** Selection intensity i for truncation selection of the best proportion p (0 < p < 1) of a normal population. */
export function intensity(p: number): { i: number; z: number } {
  if (!(p > 0 && p < 1)) throw new Error('The proportion selected must be between 0 and 100 %.');
  const z = normInv(1 - p);
  return { i: phi(z) / p, z };
}

export type Response = { R: number; S: number; i: number | null; z: number | null; perYear: number | null; newMean: number | null; pct: number | null };
/**
 * Response to selection. Give S directly, or p and σP (S = i σP). `c` is the parental control: 1 when both parents
 * are selected, 0.5 when only one parent is (for example selecting plants after they have been pollinated).
 */
export function response(o: { h2: number; S?: number; p?: number; sigmaP?: number; c?: number; L?: number; mean?: number }): Response {
  if (!(o.h2 >= 0 && o.h2 <= 1)) throw new Error('Heritability must be between 0 and 1.');
  let S: number, i: number | null = null, z: number | null = null;
  if (o.p != null) {
    if (!(o.sigmaP! > 0)) throw new Error('The phenotypic standard deviation must be above 0.');
    ({ i, z } = intensity(o.p)); S = i * o.sigmaP!;
  } else {
    if (!Number.isFinite(o.S)) throw new Error('Enter the selection differential S.');
    S = o.S!;
  }
  const R = (o.c ?? 1) * o.h2 * S;
  const perYear = o.L != null && Number.isFinite(o.L) ? (o.L > 0 ? R / o.L : NaN) : null;
  const mean = o.mean != null && Number.isFinite(o.mean) ? o.mean : null;
  return { R, S, i, z, perYear, newMean: mean != null ? mean + R : null, pct: mean ? (100 * R) / mean : null };
}

export type Regression = { n: number; b: number; seB: number; a: number; r: number; h2: number; seH2: number; p: number; ciH2: [number, number]; x: number[]; y: number[] };
/** Offspring on parent regression. `mid` = x is the mid-parent value (h² = b); otherwise one parent (h² = 2b). */
export function parentOffspring(x: number[], y: number[], mid: boolean): Regression {
  const n = x.length;
  if (n < 3) throw new Error('Add at least 3 parent and offspring pairs.');
  const mx = x.reduce((s, v) => s + v, 0) / n, my = y.reduce((s, v) => s + v, 0) / n;
  let sxx = 0, sxy = 0, syy = 0;
  for (let k = 0; k < n; k++) { sxx += (x[k] - mx) ** 2; sxy += (x[k] - mx) * (y[k] - my); syy += (y[k] - my) ** 2; }
  if (!(sxx > 0)) throw new Error('The parent values are all the same, so there is no slope to measure.');
  const b = sxy / sxx, a = my - b * mx, rss = Math.max(0, syy - b * sxy), seB = Math.sqrt(rss / (n - 2) / sxx);
  const r = syy > 0 ? sxy / Math.sqrt(sxx * syy) : 0, k2 = mid ? 1 : 2, t = n > 2 ? tInv(0.975, n - 2) : NaN;
  const tStat = seB > 0 ? b / seB : Infinity, p = seB > 0 ? fSf(tStat * tStat, 1, n - 2) : 0;
  return { n, b, seB, a, r, h2: k2 * b, seH2: k2 * seB, p, ciH2: [k2 * (b - t * seB), k2 * (b + t * seB)], x, y };
}

export type GroupKind = 'clone' | 'halfsib' | 'fullsib';
export type Components = {
  groups: { name: string; n: number; mean: number }[]; N: number; a: number; n0: number; msb: number; msw: number; dfb: number; dfw: number;
  F: number; p: number; varB: number; varW: number; varP: number; h2: number; h2Mean: number | null; kind: GroupKind; truncated: boolean;
};
/**
 * Heritability from groups of relatives (one-way ANOVA). clone: groups are clones or inbred lines, σ²G = σ²between
 * (broad sense H²). halfsib: σ²A = 4 σ²between. fullsib: σ²A ≈ 2 σ²between (an upper limit: it includes dominance
 * and common-environment variance).
 */
export function components(rows: { group: string; y: number }[], kind: GroupKind): Components {
  const by = new Map<string, number[]>();
  for (const r of rows) { if (!by.has(r.group)) by.set(r.group, []); by.get(r.group)!.push(r.y); }
  const groups = [...by.entries()].map(([name, v]) => ({ name, n: v.length, mean: v.reduce((s, x) => s + x, 0) / v.length, v }));
  const a = groups.length, N = rows.length;
  if (a < 2) throw new Error('Add at least 2 groups (families, lines or clones).');
  if (N - a < 1) throw new Error('At least one group needs 2 or more plants, to measure the variation within groups.');
  const G = rows.reduce((s, r) => s + r.y, 0) / N;
  const ssb = groups.reduce((s, g) => s + g.n * (g.mean - G) ** 2, 0), ssw = groups.reduce((s, g) => s + g.v.reduce((t, x) => t + (x - g.mean) ** 2, 0), 0);
  const dfb = a - 1, dfw = N - a, msb = ssb / dfb, msw = ssw / dfw;
  const n0 = (N - groups.reduce((s, g) => s + g.n * g.n, 0) / N) / (a - 1);
  const raw = (msb - msw) / n0, truncated = raw < 0, varB = Math.max(0, raw), varW = msw, varP = varB + varW;
  const k = kind === 'clone' ? 1 : kind === 'halfsib' ? 4 : 2;
  const F = msw > 0 ? msb / msw : Infinity;
  return {
    groups: groups.map(({ name, n, mean }) => ({ name, n, mean })), N, a, n0, msb, msw, dfb, dfw, F, p: msw > 0 ? fSf(F, dfb, dfw) : 0,
    varB, varW, varP, h2: varP > 0 ? (k * varB) / varP : 0, h2Mean: kind === 'clone' && varB + varW / n0 > 0 ? varB / (varB + varW / n0) : null, kind, truncated,
  };
}

/** Made-up mid-parent and offspring values (plant height, cm) for the example. */
export const EXAMPLE_PO = `mid-parent\toffspring
50.2\t46.6
58.2\t47.6
57.3\t54.9
46.9\t45.9
48.2\t41.5
46.8\t45.3
53.4\t49.7
49.7\t45.1
54.5\t46.1
38.9\t45.2
59.4\t57.8
49.4\t48.8
54.1\t48.9
49.2\t51.2
47.7\t51.8
52.8\t50.1
54.9\t54.4
48.8\t53.6
49.1\t48.8
54.1\t48.6`;
/** Made-up plant heights (cm) of six inbred lines, for the example. */
export const EXAMPLE_VC = `line\theight
Line 1\t52.1
Line 1\t55.4
Line 1\t50.8
Line 1\t53.9
Line 2\t61.2
Line 2\t58.7
Line 2\t63.0
Line 2\t60.1
Line 3\t48.3
Line 3\t51.6
Line 3\t47.2
Line 4\t57.5
Line 4\t54.2
Line 4\t59.8
Line 4\t56.0
Line 5\t62.4
Line 5\t66.1
Line 5\t60.9
Line 5\t64.3
Line 6\t53.0
Line 6\t49.7
Line 6\t55.8
Line 6\t51.5`;
