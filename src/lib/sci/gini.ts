// Inequality measures: Lorenz curve, Gini, Palma ratio, quantile shares, Theil T and L, Atkinson index, from
// incomes (with optional weights) or grouped data. Plain maths, no DOM.

export type Lorenz = { p: number[]; l: number[] };

export type Inequality = {
  n: number; totalWeight: number; mean: number;
  lorenz: Lorenz;
  gini: number;
  /** Gini × n/(n − 1): the bias-corrected version for an unweighted sample (NaN when weighted). */
  giniSample: number;
  /** Income share of the bottom 20 %, next 20 %, ..., top 20 %. */
  quintiles: number[];
  bottom40: number; top10: number; top1: number;
  palma: number;
  /** Theil T (GE(1)); Theil L or mean log deviation (GE(0)), NaN if any income is zero. */
  theilT: number; theilL: number;
  /** Ratio of the incomes at the 90th and 10th percentiles (weighted, from the Lorenz slopes). */
  p90p10: number;
};

/** Point on the Lorenz curve at population share p (exact: the curve is straight between people or groups). */
export function lorenzAt(L: Lorenz, p: number): number {
  if (p <= 0) return 0;
  if (p >= 1) return 1;
  let k = 1;
  while (k < L.p.length - 1 && L.p[k] < p) k++;
  const p0 = L.p[k - 1], p1 = L.p[k];
  return p1 === p0 ? L.l[k] : L.l[k - 1] + ((L.l[k] - L.l[k - 1]) * (p - p0)) / (p1 - p0);
}

/** Weighted quantile: the income at population share p (the slope of the Lorenz curve there, times the mean). */
function quantile(xs: number[], ws: number[], W: number, p: number): number {
  let c = 0;
  for (let i = 0; i < xs.length; i++) { c += ws[i]; if (c / W >= p - 1e-12) return xs[i]; }
  return xs[xs.length - 1];
}

/**
 * All the measures for incomes x with weights w (default 1 each). Incomes must be zero or more, with a positive
 * total. Grouped data is the same with x = mean income of each group and w = its population.
 */
export function inequality(x: number[], w?: number[]): Inequality {
  const n = x.length;
  const ws = w ?? x.map(() => 1);
  const idx = x.map((_, i) => i).filter((i) => ws[i] > 0).sort((a, b) => x[a] - x[b]);
  const xs = idx.map((i) => x[i]), wv = idx.map((i) => ws[i]);
  const W = wv.reduce((s, v) => s + v, 0), T = xs.reduce((s, v, i) => s + v * wv[i], 0), mean = T / W;
  const p = [0], l = [0];
  let cp = 0, cl = 0;
  for (let i = 0; i < xs.length; i++) { cp += wv[i]; cl += xs[i] * wv[i]; p.push(cp / W); l.push(cl / T); }
  p[p.length - 1] = 1; l[l.length - 1] = 1;
  const lorenz = { p, l };
  // Gini = 1 − Σ (p_k − p_{k−1})(L_k + L_{k−1}), the area formula, exact for the piecewise-linear curve.
  let area = 0;
  for (let k = 1; k < p.length; k++) area += (p[k] - p[k - 1]) * (l[k] + l[k - 1]);
  const gini = 1 - area;
  const at = (q: number) => lorenzAt(lorenz, q);
  const quintiles = [0.2, 0.4, 0.6, 0.8, 1].map((q, i) => at(q) - (i ? at(q - 0.2) : 0));
  const bottom40 = at(0.4), top10 = 1 - at(0.9), top1 = 1 - at(0.99);
  let tT = 0, tL = 0, anyZero = false;
  for (let i = 0; i < xs.length; i++) {
    const r = xs[i] / mean;
    if (r > 0) { tT += wv[i] * r * Math.log(r); tL -= wv[i] * Math.log(r); } else anyZero = true;
  }
  const unweighted = !w || w.every((v) => v === w[0]);
  return {
    n: xs.length, totalWeight: W, mean, lorenz, gini,
    giniSample: unweighted && xs.length > 1 ? (gini * xs.length) / (xs.length - 1) : NaN,
    quintiles, bottom40, top10, top1, palma: top10 / bottom40,
    theilT: tT / W, theilL: anyZero ? NaN : tL / W,
    p90p10: quantile(xs, wv, W, 0.9) / quantile(xs, wv, W, 0.1),
  };
}

/** Atkinson index with inequality aversion ε ≥ 0: 1 − (equally distributed equivalent income) / mean. */
export function atkinson(x: number[], w: number[] | undefined, eps: number): number {
  const ws = w ?? x.map(() => 1);
  let W = 0, T = 0;
  for (let i = 0; i < x.length; i++) { if (ws[i] > 0) { W += ws[i]; T += ws[i] * x[i]; } }
  const mean = T / W;
  if (eps === 0) return 0;
  let s = 0;
  for (let i = 0; i < x.length; i++) {
    if (!(ws[i] > 0)) continue;
    if (eps >= 1 && x[i] <= 0) return 1; // a zero income makes the equally distributed equivalent zero
    const r = x[i] / mean;
    s += ws[i] * (Math.abs(eps - 1) < 1e-12 ? Math.log(r) : r ** (1 - eps));
  }
  s /= W;
  return Math.abs(eps - 1) < 1e-12 ? 1 - Math.exp(s) : 1 - s ** (1 / (1 - eps));
}

/**
 * Grouped data to (group mean, population) pairs. `pop` are population counts or shares and `inc` income totals
 * or shares, in any units; mean incomes are relative unless the incomes are totals.
 */
export function fromGroups(pop: number[], inc: number[]): { x: number[]; w: number[] } {
  return { x: inc.map((v, i) => v / pop[i]), w: pop };
}
