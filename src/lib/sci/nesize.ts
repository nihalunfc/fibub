// Effective population size (Ne) estimators: unequal sex ratio (Wright 1931), fluctuating size (harmonic mean),
// variance in family size (Ne = (4N − 2)/(Vk + 2), Crow and Kimura 1970) and the temporal method from allele
// frequency change: Nei and Tajima's (1981) Fc with Waples's (1989) sampling correction and chi-square interval.
import { gammaPInv } from './floodfreq.ts';

/** Ne with Nm breeding males and Nf breeding females: 4 Nm Nf / (Nm + Nf). */
export const neSexRatio = (Nm: number, Nf: number) => (4 * Nm * Nf) / (Nm + Nf);

/** Ne over t generations of sizes N₁ … N_t: the harmonic mean. */
export function neHarmonic(sizes: number[]) {
  const t = sizes.length;
  return { Ne: t / sizes.reduce((s, n) => s + 1 / n, 0), arithmetic: sizes.reduce((s, n) => s + n, 0) / t, t };
}

/** Ne for a stable population of N parents whose numbers of offspring have variance Vk (Poisson: Vk = 2 gives Ne ≈ N). */
export const neFamily = (N: number, Vk: number) => (4 * N - 2) / (Vk + 2);

/** Mean and variance (divisor N: every parent is counted) of offspring numbers, one value per parent. */
export function offspringStats(k: number[]) {
  const N = k.length, mean = k.reduce((s, v) => s + v, 0) / N, Vk = k.reduce((s, v) => s + (v - mean) ** 2, 0) / N;
  return { N, mean, Vk };
}

/** Chi-square quantile with df degrees of freedom. */
export const chiSqInv = (p: number, df: number) => 2 * gammaPInv(p, df / 2);

export type Locus = { name: string; x: number[]; y: number[] };

/** Nei and Tajima's Fc for one locus: (1/K) Σ (x − y)² / ((x + y)/2 − xy) over its K alleles. */
export function fcLocus(x: number[], y: number[]) {
  const K = x.length;
  let s = 0;
  for (let i = 0; i < K; i++) { const d = (x[i] + y[i]) / 2 - x[i] * y[i]; if (d > 0) s += (x[i] - y[i]) ** 2 / d; }
  return s / K;
}

/**
 * Temporal Ne (Waples 1989). Fc is averaged over loci weighted by their K − 1 independent alleles; then
 * Ne = t / (2 (Fc − 1/(2S₀) − 1/(2S_t) [+ 1/N for sampling plan II])). S are numbers of individuals sampled.
 * The interval puts n′Fc/χ² bounds on F (n′ = Σ (K − 1)) and carries them through the same formula.
 */
export function neTemporal(loci: Locus[], S0: number, St: number, t: number, plan: 1 | 2 = 1, N = Infinity, conf = 0.95) {
  const per = loci.map((l) => ({ name: l.name, K: l.x.length, Fc: fcLocus(l.x, l.y) }));
  const nprime = per.reduce((s, l) => s + l.K - 1, 0);
  const Fc = per.reduce((s, l) => s + (l.K - 1) * l.Fc, 0) / nprime;
  const corr = 1 / (2 * S0) + 1 / (2 * St) - (plan === 2 && Number.isFinite(N) ? 1 / N : 0);
  const ne = (F: number) => { const d = F - corr; return d > 0 ? t / (2 * d) : Infinity; };
  const a = (1 - conf) / 2, Flo = (nprime * Fc) / chiSqInv(1 - a, nprime), Fhi = (nprime * Fc) / chiSqInv(a, nprime);
  return { per, nprime, Fc, corr, Fdrift: Fc - corr, Ne: ne(Fc), lo: ne(Fhi), hi: ne(Flo), Flo, Fhi };
}

/** Group rows of locus, [allele,] frequency at time 0, frequency at time t into loci. A locus given by one row is
 * taken as two alleles (the frequency and one minus it); a locus whose alleles sum to under 1 gets the rest as one more. */
export function lociFromRows(rows: { locus: string; x: number; y: number }[]): Locus[] {
  const map = new Map<string, { x: number[]; y: number[] }>();
  for (const r of rows) { const m = map.get(r.locus) ?? { x: [], y: [] }; m.x.push(r.x); m.y.push(r.y); map.set(r.locus, m); }
  return [...map].map(([name, { x, y }]) => {
    if (x.length === 1) return { name, x: [x[0], 1 - x[0]], y: [y[0], 1 - y[0]] };
    const sx = x.reduce((a, b) => a + b, 0), sy = y.reduce((a, b) => a + b, 0);
    if (1 - sx > 1e-3 || 1 - sy > 1e-3) return { name, x: [...x, Math.max(0, 1 - sx)], y: [...y, Math.max(0, 1 - sy)] };
    return { name, x, y };
  });
}
