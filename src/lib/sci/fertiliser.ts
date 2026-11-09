// Fertiliser blends: how much of each product (grades such as 46-0-0, 18-46-0, 0-0-60, or 21-0-0-24 with sulphur)
// supplies a field's N, P2O5, K2O (and optionally S) needs. Two ways:
//  - "closest": the non-negative least-squares blend (NNLS), the amounts that come nearest to the needs in kg
//    (exact whenever the products can meet them exactly). When several blends are equally close, the cheapest
//    (if every product has a price) or the lightest is chosen.
//  - "atleast": the cheapest (or lightest) blend that meets every need at least (a small linear programme).
// Both are solved exactly by visiting every basic solution: with k nutrients, an optimal blend needs at most k
// products, so subsets of up to k products are tried (cheap for the dozen or so products people type). No DOM.

export const NUTRIENTS = ['N', 'P2O5', 'K2O', 'S'] as const;
export type Product = { name: string; grade: number[]; price?: number };

// Oxide to element factors from standard atomic weights (P 30.974, K 39.098, O 15.999).
const P = 30.973762, K = 39.0983, O = 15.999;
export const P2O5_PER_P = (2 * P + 5 * O) / (2 * P); // 2.2914
export const K2O_PER_K = (2 * K + O) / (2 * K); // 1.2046
export const LB_AC_PER_KG_HA = 0.453592370 ** -1 * 0.40468564224; // 0.892179
export const KG_HA_PER_LB_AC = 1 / LB_AC_PER_KG_HA; // 1.120851

/** Read one product line: "Urea, 46-0-0, 620" or "DAP 18-46-0" or "Ammonium sulphate 21-0-0-24 410". */
export function parseProduct(line: string): Product | null {
  const m = /(\d+(?:[.,]\d+)?)\s*-\s*(\d+(?:[.,]\d+)?)\s*-\s*(\d+(?:[.,]\d+)?)(?:\s*-\s*(\d+(?:[.,]\d+)?))?/.exec(line);
  if (!m) return null;
  const n = (s?: string) => (s ? Number(s.replace(',', '.')) : 0);
  const grade = [n(m[1]), n(m[2]), n(m[3]), n(m[4])];
  const name = line.slice(0, m.index).replace(/[\s,;:\t]+$/, '').trim() || m[0].replace(/\s+/g, '');
  const rest = line.slice(m.index + m[0].length).replace(/^[\s,;:\t]+/, '');
  const pm = /^[^\d-]*(\d+(?:[.,]\d+)?)/.exec(rest);
  const price = pm ? Number(pm[1].replace(',', '.')) : undefined;
  return { name, grade, price };
}

/** Solve a small square system by Gaussian elimination with partial pivoting; null if (nearly) singular. */
function solveSq(M: number[][], v: number[]): number[] | null {
  const n = v.length, A = M.map((r, i) => [...r, v[i]]);
  const scale = Math.max(1e-300, ...M.flat().map(Math.abs));
  for (let c = 0; c < n; c++) {
    let p = c;
    for (let r = c + 1; r < n; r++) if (Math.abs(A[r][c]) > Math.abs(A[p][c])) p = r;
    if (Math.abs(A[p][c]) < 1e-10 * scale) return null;
    [A[c], A[p]] = [A[p], A[c]];
    for (let r = c + 1; r < n; r++) { const f = A[r][c] / A[c][c]; for (let k = c; k <= n; k++) A[r][k] -= f * A[c][k]; }
  }
  const x = new Array(n).fill(0);
  for (let r = n - 1; r >= 0; r--) { let s = A[r][n]; for (let k = r + 1; k < n; k++) s -= A[r][k] * x[k]; x[r] = s / A[r][r]; }
  return x;
}

function* subsets(n: number, k: number, start = 0, acc: number[] = []): Generator<number[]> {
  if (acc.length === k) { yield acc.slice(); return; }
  for (let i = start; i < n; i++) { acc.push(i); yield* subsets(n, k, i + 1, acc); acc.pop(); }
}

export type Blend = {
  /** Product amounts in the same rate unit as the needs (kg/ha or lb/ac). */
  x: number[];
  supplied: number[];
  /** supplied − need, per nutrient. */
  diff: number[];
  residual: number;
  exact: boolean;
  cost: number | null;
  mass: number;
  feasible: boolean;
  objective: 'cost' | 'mass';
};

/**
 * Columns are products, rows are nutrients: A[i][j] = fraction of nutrient i in product j (grade / 100).
 * `need` lists the nutrients that count (others are ignored). Prices per unit mass (any currency, any mass unit
 * consistent with x) are used to break ties / as the objective when every product has one.
 */
export function blend(products: Product[], need: (number | null)[], method: 'closest' | 'atleast' = 'closest'): Blend {
  const rows = need.map((v, i) => (v == null || !Number.isFinite(v) ? -1 : i)).filter((i) => i >= 0);
  const A = rows.map((i) => products.map((p) => (p.grade[i] ?? 0) / 100));
  const b = rows.map((i) => need[i] as number);
  const m = products.length, k = rows.length;
  const priced = m > 0 && products.every((p) => p.price != null && Number.isFinite(p.price) && p.price >= 0);
  const objective = priced ? 'cost' : 'mass';
  const obj = (x: number[]) => x.reduce((s, v, j) => s + v * (priced ? (products[j].price as number) : 1), 0);
  const scale = Math.max(1, ...b.map(Math.abs));
  const tol = 1e-9 * scale;
  type Cand = { x: number[]; res: number; o: number; n: number };
  let best: Cand | null = null;
  const better = (c: Cand) => {
    if (!best) return true;
    if (method === 'closest' && Math.abs(c.res - best.res) > 1e-7 * scale) return c.res < best.res;
    if (Math.abs(c.o - best.o) > 1e-9 * Math.max(1, Math.abs(best.o))) return c.o < best.o;
    return c.n < best.n;
  };
  const resOf = (x: number[]) => Math.hypot(...A.map((r, i) => r.reduce((s, a, j) => s + a * x[j], 0) - b[i]));
  const consider = (x: number[]) => { const c = { x, res: resOf(x), o: obj(x), n: x.filter((v) => v > 0).length }; if (better(c)) best = c; };
  if (method === 'closest') {
    consider(new Array(m).fill(0));
    for (let s = 1; s <= Math.min(k, m); s++) for (const S of subsets(m, s)) {
      // Least squares on the chosen products: (As^T As) xs = As^T b.
      const N = S.map((p) => S.map((q) => A.reduce((t, r) => t + r[p] * r[q], 0)));
      const v = S.map((p) => A.reduce((t, r, i) => t + r[p] * b[i], 0));
      const xs = solveSq(N, v);
      if (!xs || xs.some((t) => t < -1e-9 * scale)) continue;
      const x = new Array(m).fill(0); S.forEach((p, t) => { x[p] = Math.max(0, xs[t]); });
      consider(x);
    }
  } else {
    // Vertices of {x ≥ 0, Ax ≥ b}: s products, s binding nutrients (A_RS x_S = b_R).
    if (b.every((v) => v <= tol)) consider(new Array(m).fill(0));
    for (let s = 1; s <= Math.min(k, m); s++) for (const S of subsets(m, s)) for (const R of subsets(k, s)) {
      const xs = solveSq(R.map((i) => S.map((j) => A[i][j])), R.map((i) => b[i]));
      if (!xs || xs.some((t) => t < -1e-9 * scale)) continue;
      const x = new Array(m).fill(0); S.forEach((p, t) => { x[p] = Math.max(0, xs[t]); });
      if (A.some((r, i) => r.reduce((t, a, j) => t + a * x[j], 0) < b[i] - 1e-7 * scale)) continue;
      consider(x);
    }
  }
  const fin = (best as Cand | null) ?? { x: new Array(m).fill(0), res: resOf(new Array(m).fill(0)), o: 0, n: 0 };
  const supplied = need.map((_, i) => products.reduce((s, p, j) => s + ((p.grade[i] ?? 0) / 100) * fin.x[j], 0));
  const diff = need.map((v, i) => (v == null || !Number.isFinite(v) ? NaN : supplied[i] - v));
  return {
    x: fin.x, supplied, diff, residual: fin.res, exact: fin.res <= 1e-6 * scale, feasible: !!best,
    cost: priced ? obj(fin.x) : null, mass: fin.x.reduce((s, v) => s + v, 0), objective,
  };
}

/** Made-up example: needs and prices are invented round numbers (prices per tonne, any currency). */
export const EXAMPLE_PRODUCTS = 'Urea, 46-0-0, 620\nDAP, 18-46-0, 780\nPotash (MOP), 0-0-60, 540\nAmmonium sulphate, 21-0-0-24, 400';
export const EXAMPLE_NEED = [150, 60, 90, NaN];
