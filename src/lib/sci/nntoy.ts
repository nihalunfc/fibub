// Two classic neural network toys: Rosenblatt's perceptron learning rule on 2D points, and a Hopfield network
// (Hebbian storage, asynchronous or synchronous recall, energy). Plain maths, no DOM.

export type Pt = { x: number; y: number; c: 0 | 1 };
/** Weights [w1, w2, bias]. */
export type W3 = [number, number, number];
export type Epoch = { epoch: number; w: W3; errors: number; wrong: number };

export const predict = (w: W3, x: number, y: number): 0 | 1 => (w[0] * x + w[1] * y + w[2] > 0 ? 1 : 0);
export const wrongCount = (w: W3, pts: Pt[]) => pts.reduce((s, p) => s + (predict(w, p.x, p.y) === p.c ? 0 : 1), 0);

/**
 * One pass through the points in order. For each point, the error is (target − output); the weights move by
 * rate × error × input, and the bias by rate × error. `errors` counts the updates made in the pass.
 */
export function perceptronEpoch(w0: W3, pts: Pt[], rate: number): { w: W3; errors: number } {
  const w: W3 = [...w0];
  let errors = 0;
  for (const p of pts) {
    const e = p.c - predict(w, p.x, p.y);
    if (e !== 0) { errors++; w[0] += rate * e * p.x; w[1] += rate * e * p.y; w[2] += rate * e; }
  }
  return { w, errors };
}

/** Train for up to `maxEpochs` passes; stops after the first pass with no updates. Epoch 0 is the start. */
export function trainPerceptron(pts: Pt[], rate: number, maxEpochs: number, init: W3 = [0, 0, 0]) {
  const hist: Epoch[] = [{ epoch: 0, w: [...init], errors: NaN, wrong: wrongCount(init, pts) }];
  let w: W3 = [...init], converged = false;
  for (let e = 1; e <= maxEpochs; e++) {
    const r = perceptronEpoch(w, pts, rate);
    w = r.w;
    hist.push({ epoch: e, w: [...w], errors: r.errors, wrong: wrongCount(w, pts) });
    if (r.errors === 0) { converged = true; break; }
  }
  return { hist, converged, w };
}

/** Small, repeatable random numbers (mulberry32). */
export function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Fisher–Yates shuffle of 0..n−1 with the given random source. */
export function permutation(n: number, r: () => number): number[] {
  const a = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

// ---------- Hopfield network ----------
/** Hebbian weights: W_ij = (1/N) Σ_μ p_i p_j, with W_ii = 0. Patterns are arrays of +1 and −1. */
export function hebb(patterns: number[][]): Float64Array[] {
  const N = patterns[0]?.length ?? 0, W = Array.from({ length: N }, () => new Float64Array(N));
  for (const p of patterns) for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) if (i !== j) W[i][j] += (p[i] * p[j]) / N;
  return W;
}

/** E = −½ Σ_ij W_ij s_i s_j (no thresholds). */
export function energy(W: Float64Array[], s: number[]): number {
  let e = 0;
  for (let i = 0; i < s.length; i++) for (let j = 0; j < s.length; j++) e += W[i][j] * s[i] * s[j];
  return -0.5 * e;
}

const field = (W: Float64Array[], s: number[], i: number) => { let h = 0; for (let j = 0; j < s.length; j++) h += W[i][j] * s[j]; return h; };
/** New state of unit i: the sign of its input; a zero input keeps the current state. */
const sgn = (h: number, cur: number) => (h > 0 ? 1 : h < 0 ? -1 : cur);

export type Recall = { states: number[][]; energies: number[]; flips: number[]; converged: boolean; cycle: boolean; sweeps: number };

/**
 * Recall from a cue. Asynchronous: each sweep updates every unit once, one at a time, in a random order
 * (seeded); the energy never rises, so it always settles. Synchronous: all units at once from the old state;
 * this can fall into a two-state cycle, which is reported.
 */
export function recall(W: Float64Array[], cue: number[], mode: 'async' | 'sync', seed = 1, maxSweeps = 50): Recall {
  const r = rng(seed), N = cue.length;
  let s = [...cue];
  const states = [s], energies = [energy(W, s)], flips: number[] = [0];
  let converged = false, cycle = false;
  for (let k = 1; k <= maxSweeps; k++) {
    let n = 0, next: number[];
    if (mode === 'async') {
      next = [...s];
      for (const i of permutation(N, r)) { const v = sgn(field(W, next, i), next[i]); if (v !== next[i]) { next[i] = v; n++; } }
    } else {
      next = s.map((v, i) => sgn(field(W, s, i), v));
      n = next.reduce((c, v, i) => c + (v !== s[i] ? 1 : 0), 0);
    }
    if (n === 0) { converged = true; break; }
    if (mode === 'sync' && states.length >= 2 && next.every((v, i) => v === states[states.length - 2][i])) { cycle = true; states.push(next); energies.push(energy(W, next)); flips.push(n); break; }
    s = next; states.push(s); energies.push(energy(W, s)); flips.push(n);
  }
  return { states, energies, flips, converged, cycle, sweeps: states.length - 1 };
}

/** Flip exactly k units of p, chosen at random (seeded). */
export function addNoise(p: number[], k: number, seed: number): number[] {
  const out = [...p], idx = permutation(p.length, rng(seed)).slice(0, Math.max(0, Math.min(p.length, Math.round(k))));
  for (const i of idx) out[i] = -out[i];
  return out;
}

/** Overlap m = (1/N) Σ s_i p_i: 1 means identical, −1 the exact negative. */
export const overlap = (s: number[], p: number[]) => s.reduce((t, v, i) => t + v * p[i], 0) / s.length;

/** Rough storage limit for random patterns, about 0.138 N (Amit, Gutfreund and Sompolinsky). */
export const capacity = (N: number) => 0.138 * N;
