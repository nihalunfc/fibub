// Allele and genotype frequencies at one locus with two alleles (A and B), Hardy-Weinberg tests and
// F-statistics across populations. Exact test: Wigginton, Cutler and Abecasis (2005). F-statistics:
// Weir and Cockerham (1984) estimators or Nei's (1977) heterozygosity-based ones.
import { chiSqUpper } from './geochron.ts';

/** Hardy-Weinberg exact test p-value (Wigginton et al. 2005): the total probability, given the allele counts,
 * of every heterozygote count no more likely than the one observed. Also returns that whole distribution. */
export function hweExact(nAA: number, nAB: number, nBB: number) {
  const n = nAA + nAB + nBB, homR = Math.min(nAA, nBB), homC = Math.max(nAA, nBB), rare = 2 * homR + nAB;
  if (n === 0) return { p: 1, probs: [1], rare: 0 };
  const probs = new Float64Array(rare + 1);
  let mid = Math.floor((rare * (2 * n - rare)) / (2 * n));
  if ((mid & 1) !== (rare & 1)) mid++;
  probs[mid] = 1;
  let r = (rare - mid) / 2, c = n - mid - r, sum = 1;
  for (let het = mid; het > 1; het -= 2) {
    probs[het - 2] = (probs[het] * het * (het - 1)) / (4 * (r + 1) * (c + 1));
    sum += probs[het - 2]; r++; c++;
  }
  r = (rare - mid) / 2; c = n - mid - r;
  for (let het = mid; het <= rare - 2; het += 2) {
    probs[het + 2] = (probs[het] * 4 * r * c) / ((het + 2) * (het + 1));
    sum += probs[het + 2]; r--; c--;
  }
  for (let i = 0; i <= rare; i++) probs[i] /= sum;
  const obs = probs[nAB];
  let p = 0;
  for (let i = 0; i <= rare; i++) if (probs[i] <= obs * (1 + 1e-7)) p += probs[i];
  void homC;
  return { p: Math.min(1, p), probs: Array.from(probs), rare };
}

export type PopCounts = { name: string; AA: number; AB: number; BB: number };
export type PopStats = {
  name: string; n: number; p: number; q: number;
  /** Genotype frequencies observed, and counts expected under Hardy-Weinberg. */
  fAA: number; fAB: number; fBB: number; eAA: number; eAB: number; eBB: number;
  Ho: number; He: number; HeUnbiased: number; Fis: number;
  chi2: number; pChi: number; pExact: number; minExpected: number;
};

/** Frequencies and Hardy-Weinberg tests for one population. */
export function popStats(c: PopCounts): PopStats {
  const n = c.AA + c.AB + c.BB, p = (2 * c.AA + c.AB) / (2 * n), q = 1 - p;
  const eAA = n * p * p, eAB = 2 * n * p * q, eBB = n * q * q;
  const term = (o: number, e: number) => (e > 0 ? (o - e) ** 2 / e : 0);
  const chi2 = term(c.AA, eAA) + term(c.AB, eAB) + term(c.BB, eBB);
  const Ho = c.AB / n, He = 2 * p * q, HeU = n > 1 ? (2 * n / (2 * n - 1)) * He : NaN;
  return {
    name: c.name, n, p, q, fAA: c.AA / n, fAB: c.AB / n, fBB: c.BB / n, eAA, eAB, eBB, Ho, He, HeUnbiased: HeU,
    Fis: He > 0 ? 1 - Ho / He : NaN, chi2, pChi: p > 0 && q > 0 ? chiSqUpper(chi2, 1) : 1, pExact: hweExact(c.AA, c.AB, c.BB).p, minExpected: Math.min(eAA, eAB, eBB),
  };
}

/** Weir and Cockerham (1984) estimators for one two-allele locus: θ (FST), F (FIT), f (FIS), with the variance components. */
export function weirCockerham(pops: PopCounts[]) {
  const r = pops.length, ns = pops.map((c) => c.AA + c.AB + c.BB), N = ns.reduce((a, b) => a + b, 0), nbar = N / r;
  const ps = pops.map((c, i) => (2 * c.AA + c.AB) / (2 * ns[i])), hs = pops.map((c, i) => c.AB / ns[i]);
  const nc = (N - ns.reduce((a, b) => a + b * b, 0) / N) / (r - 1);
  const pbar = ps.reduce((a, p, i) => a + ns[i] * p, 0) / N;
  const s2 = ps.reduce((a, p, i) => a + ns[i] * (p - pbar) ** 2, 0) / ((r - 1) * nbar);
  const hbar = hs.reduce((a, h, i) => a + ns[i] * h, 0) / N;
  const pq = pbar * (1 - pbar);
  const a = (nbar / nc) * (s2 - (pq - ((r - 1) / r) * s2 - hbar / 4) / (nbar - 1));
  const b = (nbar / (nbar - 1)) * (pq - ((r - 1) / r) * s2 - ((2 * nbar - 1) / (4 * nbar)) * hbar);
  const c = hbar / 2;
  return { a, b, c, Fst: a / (a + b + c), Fit: 1 - c / (a + b + c), Fis: 1 - c / (b + c), pbar, nc, nbar };
}

/** Nei's (1977) F-statistics from heterozygosities, each population weighted equally:
 * HI mean observed, HS mean expected within populations, HT expected from the mean allele frequency. */
export function neiF(pops: PopCounts[]) {
  const st = pops.map(popStats), k = st.length;
  const HI = st.reduce((a, s) => a + s.Ho, 0) / k, HS = st.reduce((a, s) => a + s.He, 0) / k;
  const pbar = st.reduce((a, s) => a + s.p, 0) / k, HT = 2 * pbar * (1 - pbar);
  return { HI, HS, HT, pbar, Fis: (HS - HI) / HS, Fst: (HT - HS) / HT, Fit: (HT - HI) / HT };
}

/** Pooled counts of all populations (for the whole-sample test and the Wahlund effect). */
export function pooled(pops: PopCounts[]): PopCounts {
  return { name: 'All pooled', AA: pops.reduce((a, c) => a + c.AA, 0), AB: pops.reduce((a, c) => a + c.AB, 0), BB: pops.reduce((a, c) => a + c.BB, 0) };
}

/** Exact-test p-values: two-sided (as hweExact), and one-sided for too few or too many heterozygotes. */
export function hweExactSides(nAA: number, nAB: number, nBB: number) {
  const e = hweExact(nAA, nAB, nBB);
  let lo = 0, hi = 0;
  e.probs.forEach((p, h) => { if (h <= nAB) lo += p; if (h >= nAB) hi += p; });
  return { p: e.p, deficit: Math.min(1, lo), excess: Math.min(1, hi), probs: e.probs };
}

/** Chi-square with Yates's continuity correction: Σ (|O − E| − 0.5)² / E, each term floored at 0. */
export function hweChiYates(nAA: number, nAB: number, nBB: number) {
  const s = popStats({ name: '', AA: nAA, AB: nAB, BB: nBB });
  const t = (o: number, e: number) => (e > 0 ? Math.max(0, Math.abs(o - e) - 0.5) ** 2 / e : 0);
  const chi2 = t(nAA, s.eAA) + t(nAB, s.eAB) + t(nBB, s.eBB);
  return { chi2, p: s.p > 0 && s.q > 0 ? chiSqUpper(chi2, 1) : 1 };
}

/** Hardy-Weinberg chi-square for any number of alleles. `counts` maps "a/b" genotype keys (a ≤ b in allele order)
 * to counts; missing genotypes count 0. df = k(k − 1)/2. Ho, He = 1 − Σp² and F = 1 − Ho/He. */
export function hweMulti(alleles: string[], counts: Map<string, number>, yates = false) {
  const k = alleles.length, key = (i: number, j: number) => `${alleles[Math.min(i, j)]}/${alleles[Math.max(i, j)]}`;
  let n = 0; for (const v of counts.values()) n += v;
  const copies = new Array(k).fill(0);
  let het = 0;
  for (let i = 0; i < k; i++) for (let j = i; j < k; j++) { const c = counts.get(key(i, j)) ?? 0; copies[i] += c; copies[j] += c; if (i !== j) het += c; }
  const p = copies.map((c) => c / (2 * n)), rows: { genotype: string; obs: number; exp: number; contrib: number }[] = [];
  let chi2 = 0;
  for (let i = 0; i < k; i++) for (let j = i; j < k; j++) {
    const o = counts.get(key(i, j)) ?? 0, e = i === j ? n * p[i] * p[i] : 2 * n * p[i] * p[j];
    const c = e > 0 ? (yates ? Math.max(0, Math.abs(o - e) - 0.5) ** 2 : (o - e) ** 2) / e : 0;
    chi2 += c; rows.push({ genotype: key(i, j), obs: o, exp: e, contrib: c });
  }
  const df = (k * (k - 1)) / 2, Ho = het / n, He = 1 - p.reduce((s, x) => s + x * x, 0);
  return { n, p, rows, chi2, df, pChi: chiSqUpper(chi2, df), Ho, He, F: He > 0 ? 1 - Ho / He : NaN, minExpected: Math.min(...rows.map((r) => r.exp)) };
}
