// Von Bertalanffy growth: L(t) = L∞ (1 − e^(−K (t − t0))), fitted to length-at-age by nonlinear least squares, with
// the Ford-Walford plot and the growth performance index φ' = log10 K + 2 log10 L∞ (Pauly and Munro 1984).
import { levenbergMarquardt, fitLine, type NlFit } from './fit.ts';
import { tInv } from './stats.ts';

export const vb = (t: number, p: number[]) => p[0] * (1 - Math.exp(-p[1] * (t - p[2])));

/** Mean length at each distinct age, sorted by age. */
export function meansByAge(age: number[], len: number[]) {
  const m = new Map<number, number[]>();
  age.forEach((a, i) => { if (!m.has(a)) m.set(a, []); m.get(a)!.push(len[i]); });
  return [...m.entries()].sort((a, b) => a[0] - b[0]).map(([a, v]) => ({ age: a, n: v.length, mean: v.reduce((s, x) => s + x, 0) / v.length }));
}

/**
 * Ford-Walford plot: mean length at age t+1 against mean length at age t, for ages one year apart. The line
 * L(t+1) = a + b L(t) gives K = −ln b and L∞ = a / (1 − b). Null if fewer than 3 pairs or b is not between 0 and 1.
 */
export function fordWalford(age: number[], len: number[]) {
  const mb = meansByAge(age, len), pairs: { age: number; x: number; y: number }[] = [];
  for (let i = 0; i + 1 < mb.length; i++) if (Math.abs(mb[i + 1].age - mb[i].age - 1) < 1e-9) pairs.push({ age: mb[i].age, x: mb[i].mean, y: mb[i + 1].mean });
  if (pairs.length < 3) return null;
  const L = fitLine(pairs.map((p) => p.x), pairs.map((p) => p.y));
  const b = L.slope, a = L.intercept;
  return { pairs, a, b, r2: L.r2, K: b > 0 && b < 1 ? -Math.log(b) : NaN, Linf: b < 1 ? a / (1 - b) : NaN };
}

export type VbFit = NlFit & { ci: [number, number][]; tcrit: number; start: number[]; phi: number; fw: ReturnType<typeof fordWalford> };

/**
 * Fit L∞, K and t0. Starting values come from the Ford-Walford line when it works, otherwise from the data range;
 * several starts are tried and the best converged fit kept. `cmPerUnit` converts lengths to cm for φ'.
 */
export function fitVB(age: number[], len: number[], cmPerUnit = 1): VbFit {
  if (age.length < 4) throw new Error('Need at least 4 fish to fit three parameters.');
  if (new Set(age).size < 3) throw new Error('Need fish of at least 3 different ages.');
  const fw = fordWalford(age, len), lmax = Math.max(...len), amin = Math.min(...age);
  const starts: number[][] = [];
  if (fw && fw.K > 0 && fw.Linf > 0) starts.push([fw.Linf, fw.K, amin - 1]);
  for (const k of [0.1, 0.3, 0.8]) starts.push([lmax * 1.1, k, amin - 0.5]);
  let best: NlFit | null = null, start = starts[0];
  for (const s0 of starts) {
    // t0 from the first age's mean length for this L∞ and K, so the curve starts near the data.
    try {
      const f = levenbergMarquardt(vb, age, len, s0, { maxIter: 1000 });
      if (Number.isFinite(f.sse) && f.p[0] > 0 && f.p[1] > 0 && (!best || f.sse < best.sse - 1e-12 * best.sse)) { best = f; start = s0; }
    } catch { /* try the next start */ }
  }
  if (!best) throw new Error('The curve could not be fitted: check that length rises with age.');
  const tcrit = tInv(0.975, best.df);
  const ci = best.p.map((v, i) => [v - tcrit * best!.se[i], v + tcrit * best!.se[i]] as [number, number]);
  return { ...best, ci, tcrit, start, phi: Math.log10(best.p[1]) + 2 * Math.log10(best.p[0] * cmPerUnit), fw };
}
