// Wright-Fisher model of one locus with two alleles (A and a) in a diploid population of N individuals
// (2N gene copies): selection on genotypes AA, Aa, aa with fitness 1 + s, 1 + hs, 1, then binomial
// sampling of 2N copies each generation. Seeded random numbers so a run can be repeated exactly.
// Fixation probability from Kimura's (1962) diffusion formula, integrated numerically for any h.
import { logGamma } from './stats.ts';

/** sfc32 random generator, seeded from a whole number; returns numbers in (0, 1). */
export function wfRng(seed: number) {
  let a = 0x9e3779b9, b = 0x243f6a88, c = 0xb7e15162, d = (seed >>> 0) ^ 0x5bd1e995;
  const next = () => {
    a >>>= 0; b >>>= 0; c >>>= 0; d >>>= 0;
    let t = (a + b) | 0; a = b ^ (b >>> 9); b = (c + (c << 3)) | 0; c = (c << 21) | (c >>> 11); d = (d + 1) | 0; t = (t + d) | 0; c = (c + t) | 0;
    return ((t >>> 0) + 0.5) / 4294967296;
  };
  for (let i = 0; i < 15; i++) next();
  return next;
}

/** One draw from Binomial(n, p): inversion for small n·p, Hörmann's (1993) BTRS rejection method otherwise. */
export function binomial(n: number, p: number, u: () => number): number {
  if (p <= 0 || n <= 0) return 0;
  if (p >= 1) return n;
  if (p > 0.5) return n - binomial(n, 1 - p, u);
  const q = 1 - p;
  if (n * p < 10) {
    // Inversion: walk up the probabilities from k = 0.
    const s = p / q, a = (n + 1) * s;
    let r = q ** n, v = u(), k = 0;
    if (r <= 0) r = Math.exp(n * Math.log1p(-p));
    while (v > r) { v -= r; k++; if (k > n) return binomial(n, p, u); r *= a / k - s; }
    return k;
  }
  const spq = Math.sqrt(n * p * q), b = 1.15 + 2.53 * spq, a = -0.0873 + 0.0248 * b + 0.01 * p, c = n * p + 0.5, vr = 0.92 - 4.2 / b;
  const alpha = (2.83 + 5.1 / b) * spq, lpq = Math.log(p / q), m = Math.floor((n + 1) * p), h = logGamma(m + 1) + logGamma(n - m + 1);
  for (;;) {
    const U = u() - 0.5, V0 = u(), us = 0.5 - Math.abs(U), k = Math.floor((2 * a / us + b) * U + c);
    if (k < 0 || k > n) continue;
    if (us >= 0.07 && V0 <= vr) return k;
    const v = Math.log(V0 * alpha / (a / (us * us) + b));
    if (v <= h - logGamma(k + 1) - logGamma(n - k + 1) + (k - m) * lpq) return k;
  }
}

/** Frequency of A after selection, from frequency p before it. */
export function afterSelection(p: number, s: number, h: number) {
  const q = 1 - p, w11 = 1 + s, w12 = 1 + h * s;
  const wbar = p * p * w11 + 2 * p * q * w12 + q * q;
  return (p * p * w11 + p * q * w12) / wbar;
}

/**
 * Kimura's fixation probability u(p) = ∫₀ᵖ G / ∫₀¹ G with G(x) = exp(−4Ns(hx + (1 − 2h)x²/2)),
 * the diffusion approximation for fitness 1 + s, 1 + hs, 1 and effective size N.
 */
export function kimuraFix(p: number, N: number, s: number, h: number) {
  if (p <= 0) return 0;
  if (p >= 1) return 1;
  if (s === 0) return p;
  const S = 4 * N * s, lg = (x: number) => -S * (h * x + (1 - 2 * h) * x * x / 2);
  // Simpson's rule on a fine grid, after scaling by the largest exponent so nothing overflows.
  const M = 20000, step = 1 / M;
  let mx = -Infinity;
  for (let i = 0; i <= M; i++) mx = Math.max(mx, lg(i * step));
  const g = (x: number) => Math.exp(lg(x) - mx);
  const simpson = (a: number, b: number) => {
    const n = Math.max(2, 2 * Math.ceil(((b - a) / step) / 2)), hh = (b - a) / n;
    let t = g(a) + g(b);
    for (let i = 1; i < n; i++) t += (i % 2 ? 4 : 2) * g(a + i * hh);
    return (t * hh) / 3;
  };
  const top = simpson(0, p), all = top + simpson(p, 1);
  return all > 0 ? top / all : NaN;
}

/** Neutral mean times to fixation and to loss, in generations (Kimura and Ohta 1969), for starting frequency p. */
export function neutralTimes(p: number, N: number) {
  return { fix: (-4 * N * (1 - p) * Math.log(1 - p)) / p, loss: (-4 * N * p * Math.log(p)) / (1 - p) };
}

export type WFOptions = {
  N: number; p0: number; s: number; h: number; gens: number; reps: number; seed: number;
  /** Keep going past `gens` until every line is fixed or lost (stops at maxGens). */
  untilDone?: boolean; maxGens?: number;
  /** How many lines to keep whole for drawing. */
  keep?: number;
};
export type WFResult = {
  fixed: number; lost: number; segregating: number; reps: number;
  /** Generation at which each fixed (or lost) line got there. */
  fixTimes: number[]; lossTimes: number[];
  /** Frequency of A in each kept line, generation 0 to the last generation run. */
  lines: Float64Array[];
  /** Mean frequency over all lines, each generation; share fixed and share lost by each generation. */
  mean: number[]; cumFixed: number[]; cumLost: number[];
  /** Frequency of A at the end, in every line. */
  final: Float64Array;
  gensRun: number; draws: number;
};

/** Simulate `reps` independent lines. Same options and seed give the same result. */
export function simulate(o: WFOptions): WFResult {
  const n2 = 2 * o.N, u = wfRng(o.seed), keep = Math.min(o.keep ?? 50, o.reps);
  const maxG = o.untilDone ? Math.max(o.gens, o.maxGens ?? o.gens) : o.gens;
  const start = Math.round(o.p0 * n2);
  const count = new Int32Array(o.reps).fill(start), doneAt = new Int32Array(o.reps).fill(-1);
  const lines: number[][] = Array.from({ length: keep }, () => [start / n2]);
  const mean = [start / n2], cumFixed = [start === n2 ? o.reps : 0], cumLost = [start === 0 ? o.reps : 0];
  let alive = 0;
  for (let r = 0; r < o.reps; r++) if (count[r] > 0 && count[r] < n2) alive++; else doneAt[r] = 0;
  let g = 0, draws = 0, nFix = cumFixed[0], nLost = cumLost[0];
  const fixTimes: number[] = [], lossTimes: number[] = [];
  while (g < maxG && (g < o.gens || alive > 0)) {
    g++;
    let sum = 0;
    for (let r = 0; r < o.reps; r++) {
      let c = count[r];
      if (c > 0 && c < n2) {
        c = binomial(n2, afterSelection(c / n2, o.s, o.h), u); draws++;
        count[r] = c;
        if (c === 0) { nLost++; lossTimes.push(g); alive--; doneAt[r] = g; }
        else if (c === n2) { nFix++; fixTimes.push(g); alive--; doneAt[r] = g; }
      }
      sum += c;
      if (r < keep) lines[r].push(c / n2);
    }
    mean.push(sum / (o.reps * n2)); cumFixed.push(nFix); cumLost.push(nLost);
  }
  const final = new Float64Array(o.reps);
  for (let r = 0; r < o.reps; r++) final[r] = count[r] / n2;
  // Lines that started fixed or lost count at generation 0.
  return {
    fixed: nFix, lost: nLost, segregating: o.reps - nFix - nLost, reps: o.reps, fixTimes, lossTimes,
    lines: lines.map((l) => Float64Array.from(l)), mean, cumFixed: cumFixed.map((v) => v / o.reps), cumLost: cumLost.map((v) => v / o.reps),
    final, gensRun: g, draws,
  };
}

/** Wilson score interval for a proportion k / n. */
export function wilson(k: number, n: number, z = 1.959964) {
  if (n <= 0) return [NaN, NaN];
  const p = k / n, d = 1 + (z * z) / n, c = (p + (z * z) / (2 * n)) / d, w = (z * Math.sqrt((p * (1 - p)) / n + (z * z) / (4 * n * n))) / d;
  return [Math.max(0, c - w), Math.min(1, c + w)];
}
