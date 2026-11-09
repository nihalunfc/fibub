// Population growth models: exponential and logistic growth in continuous time, and Leslie matrix
// projection with the dominant eigenvalue, stable age distribution and reproductive values.

export const expN = (N0: number, r: number, t: number) => N0 * Math.exp(r * t);
export const logisticN = (N0: number, r: number, K: number, t: number) => K / (1 + ((K - N0) / N0) * Math.exp(-r * t));
/** Time for exponential growth to go from N0 to N (Infinity if it never does). */
export function expTime(N0: number, r: number, N: number) { const t = Math.log(N / N0) / r; return t >= 0 ? t : Infinity; }
/** Time for logistic growth to go from N0 to N; Infinity if N is not between N0 and K. */
export function logisticTime(N0: number, r: number, K: number, N: number) {
  const inside = (N0 < K && N > N0 && N < K) || (N0 > K && N < N0 && N > K) || N === N0;
  if (!inside) return Infinity;
  return Math.log((N * (K - N0)) / (N0 * (K - N))) / r;
}

export type Leslie = {
  /** Fecundity F of each class and survival P to the next class; the last P is survival staying in the last class (0 for a plain Leslie matrix). */
  F: number[]; P: number[];
  lambda: number; r: number;
  /** Stable class distribution, summing to 1. */
  stable: number[];
  /** Reproductive values, relative to the first class. */
  repro: number[];
  /** Survivorship to the start of each class, l1 = 1. */
  l: number[];
  /** Net reproductive rate R0 = Σ F·l (with the last class repeated when it has survival). */
  R0: number;
  /** Generation time ln R0 / ln λ (NaN when λ = 1 or R0 = 1). */
  T: number;
};

export function matrix(F: number[], P: number[]): number[][] {
  const n = F.length, A = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let j = 0; j < n; j++) A[0][j] = F[j];
  for (let i = 0; i < n - 1; i++) A[i + 1][i] = P[i];
  if (n > 1) A[n - 1][n - 1] += P[n - 1] ?? 0; else A[0][0] += P[0] ?? 0;
  return A;
}

/** Dominant eigenvalue and vectors of a Leslie matrix (with an optional plus group), from its characteristic equation. */
export function leslie(F: number[], P: number[]): Leslie {
  const n = F.length;
  if (n < 1 || P.length !== n) throw new Error('Give a fecundity and a survival for every class.');
  if (F.some((f) => !(f >= 0)) || P.some((p) => !(p >= 0))) throw new Error('Fecundities and survivals must be zero or more.');
  if (P.some((p) => p > 1)) throw new Error('Survival is a probability, from 0 to 1.');
  const s = P[n - 1];
  const l = [1]; for (let i = 1; i < n; i++) l.push(l[i - 1] * P[i - 1]);
  if (!F.some((f, i) => f * l[i] > 0)) throw new Error('No class that animals survive to has any offspring, so the population cannot grow or persist.');
  // Characteristic equation: Σ_{i<n} F_i l_i λ^-i + F_n l_n λ^-n / (1 − s/λ) = 1, decreasing in λ for λ > s.
  const g = (L: number) => { let t = 0; for (let i = 0; i < n - 1; i++) t += F[i] * l[i] * L ** -(i + 1); t += (F[n - 1] * l[n - 1] * L ** -n) / (1 - s / L); return t - 1; };
  let lo = s + 1e-12 * Math.max(1, s), hi = Math.max(1, s * 2);
  if (!(g(lo) > 0)) throw new Error('The survival in the last class alone sets the growth rate here (the classes before it cannot replace themselves), so this is not a usable Leslie matrix.');
  while (g(hi) > 0) hi *= 2;
  for (let k = 0; k < 300 && hi - lo > 1e-15 * hi; k++) { const m = (lo + hi) / 2; if (g(m) > 0) lo = m; else hi = m; }
  const lambda = (lo + hi) / 2;
  const w = l.map((li, i) => li * lambda ** -i); w[n - 1] /= 1 - s / lambda;
  const sw = w.reduce((a, b) => a + b, 0), stable = w.map((x) => x / sw);
  // Left eigenvector: v_n λ = F_n v_1 + s v_n, then v_j λ = F_j v_1 + P_j v_{j+1}, with v_1 = 1.
  const v = new Array(n).fill(0); v[n - 1] = F[n - 1] / (lambda - s);
  for (let j = n - 2; j >= 0; j--) v[j] = (F[j] + P[j] * v[j + 1]) / lambda;
  const v1 = v[0], repro = v.map((x) => x / v1);
  let R0 = 0; for (let i = 0; i < n - 1; i++) R0 += F[i] * l[i];
  R0 += s < 1 ? (F[n - 1] * l[n - 1]) / (1 - s) : F[n - 1] * l[n - 1] > 0 ? Infinity : 0;
  const T = Math.abs(Math.log(lambda)) > 1e-12 && Math.abs(Math.log(R0)) > 1e-12 ? Math.log(R0) / Math.log(lambda) : NaN;
  return { F, P, lambda, r: Math.log(lambda), stable, repro, l, R0, T };
}

/** N(t) for t = 0..steps under N(t+1) = A N(t). */
export function project(F: number[], P: number[], N0: number[], steps: number): number[][] {
  const A = matrix(F, P), out = [N0.slice()];
  for (let t = 0; t < steps; t++) { const x = out[t]; out.push(A.map((row) => row.reduce((s, a, j) => s + a * x[j], 0))); }
  return out;
}
