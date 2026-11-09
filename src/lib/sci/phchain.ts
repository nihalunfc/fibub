// Radioactive decay chains (Bateman equations): amounts and activities of every member of a linear chain
// A → B → C → … at any time, with a branching fraction at each step and any starting activities.
// The Bateman sums are written as divided differences of e^(−λt), computed with a Taylor series for close
// decay constants (so equal half-lives work) and the usual recurrence otherwise. No DOM.

export type Member = { name: string; half: number; branch?: number };

const FACT: number[] = [1];
for (let i = 1; i < 80; i++) FACT[i] = FACT[i - 1] * i;

/** Divided difference of g(x) = e^(−x t) over the points ys (any order, repeats allowed). */
export function divDiffExp(ys: number[], t: number): number {
  const y = [...ys].sort((a, b) => a - b), n = y.length;
  // D[i] holds the divided difference over y[i..i+len-1] for the current length.
  let D = y.map((v) => Math.exp(-v * t));
  for (let len = 2; len <= n; len++) {
    const next: number[] = [];
    for (let i = 0; i + len <= n; i++) {
      const j = i + len - 1;
      if ((y[j] - y[i]) * t < 0.5) next.push(taylor(y.slice(i, j + 1), t));
      else next.push((D[i + 1] - D[i]) / (y[j] - y[i]));
    }
    D = next;
  }
  return D[0];
}

/** Divided difference of e^(−x t) by a Taylor series about the middle point; points within 0.5/t of each other. */
function taylor(pts: number[], t: number): number {
  const n = pts.length, c = (pts[0] + pts[n - 1]) / 2, u = pts.map((p) => (p - c) * t);
  if (t === 0) return 0;
  // h[p] = complete homogeneous symmetric polynomial of degree p in u.
  const P = 40, h = new Array(P + 1).fill(0); h[0] = 1;
  for (const uk of u) for (let p = 1; p <= P; p++) h[p] += uk * h[p - 1];
  let s = 0;
  for (let p = 0; p <= P; p++) s += ((p + n - 1) % 2 ? -1 : 1) * h[p] / FACT[p + n - 1];
  return Math.exp(-c * t) * Math.pow(t, n - 1) * s;
}

/**
 * Number of atoms of every member at time t (seconds) for a chain with decay constants lam (1/s), branching
 * fractions b[i] (the share of member i's decays that make member i+1) and starting atoms N0.
 */
export function atoms(lam: number[], b: number[], N0: number[], t: number): number[] {
  const n = lam.length, out = new Array(n).fill(0);
  for (let s = 0; s < n; s++) {
    if (!N0[s]) continue;
    let prod = 1;
    for (let k = s; k < n; k++) {
      if (k > s) prod *= b[k - 1] * lam[k - 1];
      if (prod === 0) break;
      const dd = divDiffExp(lam.slice(s, k + 1), t);
      out[k] += N0[s] * prod * ((k - s) % 2 ? -1 : 1) * dd;
    }
  }
  return out;
}

/** Activities (Bq) of every member at time t (s), from starting activities A0 (Bq). */
export function activities(lam: number[], b: number[], A0: number[], t: number): number[] {
  const N0 = A0.map((a, i) => a / lam[i]);
  return atoms(lam, b, N0, t).map((N, i) => Math.max(0, N * lam[i]));
}

export const lambdaOf = (half: number) => Math.LN2 / half;

/** Long-run ratio A_k / A_1 when the parent outlives every daughter (otherwise null). */
export function eqRatios(lam: number[], b: number[]): (number | null)[] {
  const out: (number | null)[] = [1];
  let r = 1;
  for (let k = 1; k < lam.length; k++) {
    if (!(lam[k] > lam[0])) { r = NaN; out.push(null); continue; }
    r *= (b[k - 1] * lam[k]) / (lam[k] - lam[0]);
    out.push(Number.isFinite(r) ? r : null);
  }
  return out;
}

/** The kind of equilibrium between a parent and one daughter, from their half-lives. */
export function eqKind(halfParent: number, halfDaughter: number): 'secular' | 'transient' | 'none' {
  if (!(halfParent > halfDaughter)) return 'none';
  return halfParent / halfDaughter >= 100 ? 'secular' : 'transient';
}

/** Time (s) of the peak activity of member k, starting from the given activities; null if it only falls. */
export function peakTime(lam: number[], b: number[], A0: number[], k: number, tMax: number): number | null {
  const f = (t: number) => activities(lam, b, A0, t)[k];
  const N = 400, lo = tMax * 1e-9;
  let best = 0, bestV = f(0), prevT = 0;
  const grid: number[] = [0];
  for (let i = 0; i <= N; i++) grid.push(lo * Math.pow(tMax / lo, i / N));
  for (const t of grid) { const v = f(t); if (v > bestV) { bestV = v; best = t; } }
  if (best === 0 || best === tMax) return best === 0 ? null : best;
  const i = grid.indexOf(best);
  let a = grid[i - 1], c = grid[i + 1];
  prevT = best;
  // Golden-section search on the bracket.
  const g = (Math.sqrt(5) - 1) / 2;
  let x1 = c - g * (c - a), x2 = a + g * (c - a), f1 = f(x1), f2 = f(x2);
  for (let it = 0; it < 200 && c - a > 1e-12 * c; it++) {
    if (f1 > f2) { c = x2; x2 = x1; f2 = f1; x1 = c - g * (c - a); f1 = f(x1); }
    else { a = x1; x1 = x2; f1 = f2; x2 = a + g * (c - a); f2 = f(x2); }
  }
  return Number.isFinite(a) ? (a + c) / 2 : prevT;
}

/** Peak time for a pure parent → daughter pair starting with the parent alone: ln(λ2/λ1)/(λ2 − λ1). */
export const peakTime2 = (l1: number, l2: number) => (l1 === l2 ? 1 / l1 : Math.log(l2 / l1) / (l2 - l1));

/**
 * Earliest time (s) after which A_k / A_1 stays within `tol` (fraction) of its equilibrium ratio, searching up
 * to tMax; null if there is no equilibrium or it is not reached by tMax.
 */
export function eqTime(lam: number[], b: number[], A0: number[], k: number, tol: number, tMax: number): number | null {
  const R = eqRatios(lam, b)[k];
  if (R == null || k === 0) return k === 0 ? 0 : null;
  const off = (t: number) => { const A = activities(lam, b, A0, t); return A[0] > 0 ? Math.abs(A[k] / A[0] / R - 1) > tol : true; };
  const N = 600, lo = tMax * 1e-9;
  const grid: number[] = [0];
  for (let i = 0; i <= N; i++) grid.push(lo * Math.pow(tMax / lo, i / N));
  let last = -1;
  for (let i = 0; i < grid.length; i++) if (off(grid[i])) last = i;
  if (last === grid.length - 1) return null;
  if (last < 0) return 0;
  let a = grid[last], c = grid[last + 1];
  for (let it = 0; it < 100; it++) { const m = (a + c) / 2; if (off(m)) a = m; else c = m; }
  return c;
}

/** Example chains with rounded half-lives (seconds), editable on the page. */
const H = 3600, D = 86400, Y = 365.25 * D, MIN = 60;
export const CHAINS: Record<string, { label: string; members: Member[]; unit: string }> = {
  moly: { label: 'Mo-99 → Tc-99m (technetium generator)', unit: 'h', members: [{ name: 'Mo-99', half: 66 * H, branch: 0.88 }, { name: 'Tc-99m', half: 6.0 * H }] },
  sr90: { label: 'Sr-90 → Y-90', unit: 'd', members: [{ name: 'Sr-90', half: 28.8 * Y, branch: 1 }, { name: 'Y-90', half: 64 * H }] },
  ra226: { label: 'Ra-226 → Rn-222 → Po-218 → Pb-214 → Bi-214 → Po-214', unit: 'd', members: [
    { name: 'Ra-226', half: 1600 * Y, branch: 1 }, { name: 'Rn-222', half: 3.82 * D, branch: 1 }, { name: 'Po-218', half: 3.1 * MIN, branch: 1 },
    { name: 'Pb-214', half: 27 * MIN, branch: 1 }, { name: 'Bi-214', half: 20 * MIN, branch: 1 }, { name: 'Po-214', half: 164e-6 }] },
  rn222: { label: 'Rn-222 → Po-218 → Pb-214 → Bi-214 (radon progeny)', unit: 'min', members: [
    { name: 'Rn-222', half: 3.82 * D, branch: 1 }, { name: 'Po-218', half: 3.1 * MIN, branch: 1 }, { name: 'Pb-214', half: 27 * MIN, branch: 1 }, { name: 'Bi-214', half: 20 * MIN }] },
  ba140: { label: 'Ba-140 → La-140', unit: 'd', members: [{ name: 'Ba-140', half: 12.8 * D, branch: 1 }, { name: 'La-140', half: 1.68 * D }] },
  te132: { label: 'Te-132 → I-132', unit: 'h', members: [{ name: 'Te-132', half: 3.2 * D, branch: 1 }, { name: 'I-132', half: 2.3 * H }] },
  noeq: { label: 'Short parent, long daughter (no equilibrium, made up)', unit: 'h', members: [{ name: 'A', half: 1 * H, branch: 1 }, { name: 'B', half: 10 * H }] },
};
export const TIME_UNITS: Record<string, number> = { µs: 1e-6, ms: 1e-3, s: 1, min: MIN, h: H, d: D, y: Y };
