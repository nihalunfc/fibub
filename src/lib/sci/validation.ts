// Analytical method validation statistics (ICH Q2, ISO 5725 style): replicate summaries, Grubbs outlier test,
// accuracy as bias and recovery with a t-test, repeatability and intermediate precision from one-way ANOVA,
// and the Horwitz ratio.
import { mean, sd, tInv, tTwoSided, fSf } from './stats.ts';

export type Summary = { n: number; mean: number; sd: number; rsd: number; ciHalf: number; min: number; max: number };

export function summary(x: number[], conf = 0.95): Summary {
  const n = x.length, m = mean(x), s = sd(x);
  return { n, mean: m, sd: s, rsd: (100 * s) / Math.abs(m), ciHalf: n > 1 ? tInv(1 - (1 - conf) / 2, n - 1) * s / Math.sqrt(n) : NaN, min: Math.min(...x), max: Math.max(...x) };
}

/** Two-sided Grubbs critical value: G = (n − 1)/√n · √(t² / (n − 2 + t²)), t at α/(2n) with n − 2 df. */
export function grubbsCritical(n: number, alpha = 0.05): number {
  if (n < 3) return NaN;
  const t = tInv(1 - alpha / (2 * n), n - 2);
  return ((n - 1) / Math.sqrt(n)) * Math.sqrt((t * t) / (n - 2 + t * t));
}

/** p-value of a two-sided Grubbs G (Bonferroni form, exact enough for reporting). */
export function grubbsP(G: number, n: number): number {
  if (n < 3) return NaN;
  const g2 = G * G * n;
  const den = (n - 1) ** 2 - g2;
  if (den <= 0) return 0;
  const t = Math.sqrt(((n - 2) * g2) / den);
  return Math.min(1, n * tTwoSided(t, n - 2));
}

export type Grubbs = { G: number; crit: number; p: number; index: number; value: number; outlier: boolean };

/** Grubbs test for the single most extreme value. Needs at least 3 values and a non-zero spread. */
export function grubbs(x: number[], alpha = 0.05): Grubbs | null {
  const n = x.length;
  if (n < 3) return null;
  const m = mean(x), s = sd(x);
  if (!(s > 0)) return null;
  let index = 0;
  x.forEach((v, i) => { if (Math.abs(v - m) > Math.abs(x[index] - m)) index = i; });
  const G = Math.abs(x[index] - m) / s, crit = grubbsCritical(n, alpha);
  return { G, crit, p: grubbsP(G, n), index, value: x[index], outlier: G > crit };
}

/** Repeated Grubbs: remove the flagged value and test again until none is flagged (or 3 values are left). */
export function grubbsRepeated(x: number[], alpha = 0.05): { removed: number[]; steps: Grubbs[] } {
  let rest = [...x];
  const removed: number[] = [], steps: Grubbs[] = [];
  for (;;) {
    const g = grubbs(rest, alpha);
    if (!g) break;
    steps.push(g);
    if (!g.outlier || rest.length <= 3) break;
    removed.push(g.value);
    rest = rest.filter((_, i) => i !== g.index);
  }
  return { removed, steps };
}

/** Accuracy against a true (nominal, reference or spiked) value: bias, recovery and a one-sample t-test. */
export function accuracy(x: number[], trueValue: number, conf = 0.95) {
  const s = summary(x, conf), bias = s.mean - trueValue;
  const t = bias / (s.sd / Math.sqrt(s.n));
  return {
    bias, biasPct: (100 * bias) / trueValue, recovery: (100 * s.mean) / trueValue,
    recoveryLow: (100 * (s.mean - s.ciHalf)) / trueValue, recoveryHigh: (100 * (s.mean + s.ciHalf)) / trueValue,
    t, p: s.n > 1 && s.sd > 0 ? tTwoSided(Math.abs(t), s.n - 1) : NaN,
  };
}

export type Precision = {
  k: number; N: number; n0: number; grand: number; msWithin: number; msBetween: number; dfWithin: number; dfBetween: number;
  sr: number; sL: number; sI: number; rsdR: number; rsdI: number; F: number; p: number;
};

/**
 * One-way ANOVA over series (days, analysts or instruments): repeatability s_r = √MS_within, between-series
 * s_L² = (MS_between − MS_within)/n₀ (0 if negative), intermediate precision s_I = √(s_r² + s_L²) (ISO 5725-2/-3).
 * Unequal series sizes use n₀ = (N − Σnᵢ²/N)/(k − 1).
 */
export function precision(groups: number[][]): Precision | null {
  const g = groups.filter((a) => a.length > 0);
  const k = g.length, N = g.reduce((s, a) => s + a.length, 0);
  if (k < 2 || N - k < 1) return null;
  const grand = g.flat().reduce((s, v) => s + v, 0) / N;
  let ssW = 0, ssB = 0;
  for (const a of g) { const m = mean(a); ssB += a.length * (m - grand) ** 2; for (const v of a) ssW += (v - m) ** 2; }
  const dfWithin = N - k, dfBetween = k - 1, msWithin = ssW / dfWithin, msBetween = ssB / dfBetween;
  const n0 = (N - g.reduce((s, a) => s + a.length ** 2, 0) / N) / (k - 1);
  const sL2 = Math.max(0, (msBetween - msWithin) / n0), sr = Math.sqrt(msWithin), sL = Math.sqrt(sL2), sI = Math.sqrt(msWithin + sL2);
  const F = msWithin > 0 ? msBetween / msWithin : NaN;
  return { k, N, n0, grand, msWithin, msBetween, dfWithin, dfBetween, sr, sL, sI, rsdR: (100 * sr) / Math.abs(grand), rsdI: (100 * sI) / Math.abs(grand), F, p: Number.isFinite(F) ? fSf(F, dfBetween, dfWithin) : NaN };
}

/**
 * Horwitz predicted reproducibility RSD (%) for a mass fraction C (1 = 100 %): 2·C^(−0.1505), with Thompson's
 * cap of 22 % below 1.2 × 10⁻⁷ and 0.01·C^(−0.5) above 0.138.
 */
export function horwitz(C: number): number {
  if (!(C > 0)) return NaN;
  if (C < 1.2e-7) return 22;
  if (C > 0.138) return 100 * 0.01 * C ** -0.5;
  return 2 * C ** -0.1505;
}
