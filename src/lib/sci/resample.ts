// Bootstrap confidence intervals (percentile and BCa) and permutation tests, with a seeded random number
// generator so the same seed gives the same answer. Plain functions, no DOM. Methods follow scipy.stats.bootstrap
// and scipy.stats.permutation_test: BCa as Efron and Tibshirani (1993) eq. 14.14 and 15.36, with the jackknife
// acceleration summed over samples; Monte Carlo p-values (count + 1) / (B + 1); exact tests when every
// arrangement fits in the number of resamples.
import { normCdf, normInv, quantileSorted } from './stats.ts';

/** xoshiro128** seeded through splitmix32: a fast, well-tested 32-bit generator. Returns numbers in [0, 1). */
export function rng(seed: number) {
  let s = seed >>> 0;
  const sm = () => { s = (s + 0x9e3779b9) >>> 0; let z = s; z = Math.imul(z ^ (z >>> 16), 0x85ebca6b) >>> 0; z = Math.imul(z ^ (z >>> 13), 0xc2b2ae35) >>> 0; return (z ^ (z >>> 16)) >>> 0; };
  let a = sm(), b = sm(), c = sm(), d = sm();
  return () => {
    const r = Math.imul(rotl(Math.imul(b, 5), 7), 9) >>> 0, t = (b << 9) >>> 0;
    c ^= a; d ^= b; b ^= c; a ^= d; c ^= t; d = rotl(d, 11);
    return r / 4294967296;
  };
}
const rotl = (x: number, k: number) => ((x << k) | (x >>> (32 - k))) >>> 0;

// ---------- statistics ----------
export type Stat = 'mean' | 'median' | 'sd' | 'diff-mean' | 'diff-median' | 'pearson' | 'spearman' | 'paired-mean';
export const STAT_KIND: Record<Stat, 'one' | 'two' | 'pairs'> = { mean: 'one', median: 'one', sd: 'one', 'diff-mean': 'two', 'diff-median': 'two', pearson: 'pairs', spearman: 'pairs', 'paired-mean': 'pairs' };
const meanA = (a: ArrayLike<number>) => { let s = 0; for (let i = 0; i < a.length; i++) s += a[i]; return s / a.length; };
const medianA = (a: ArrayLike<number>) => { const s = Float64Array.from(a).sort(), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
const sdA = (a: ArrayLike<number>) => { const m = meanA(a); let s = 0; for (let i = 0; i < a.length; i++) s += (a[i] - m) ** 2; return Math.sqrt(s / (a.length - 1)); };
function pearsonA(x: ArrayLike<number>, y: ArrayLike<number>) {
  const n = x.length, mx = meanA(x), my = meanA(y); let sxy = 0, sxx = 0, syy = 0;
  for (let i = 0; i < n; i++) { const a = x[i] - mx, b = y[i] - my; sxy += a * b; sxx += a * a; syy += b * b; }
  return sxy / Math.sqrt(sxx * syy);
}
function ranks(a: ArrayLike<number>) {
  const n = a.length, idx = Array.from({ length: n }, (_, i) => i).sort((i, j) => a[i] - a[j]), r = new Float64Array(n);
  for (let i = 0; i < n;) { let j = i; while (j + 1 < n && a[idx[j + 1]] === a[idx[i]]) j++; const v = (i + j) / 2 + 1; for (let m = i; m <= j; m++) r[idx[m]] = v; i = j + 1; }
  return r;
}
const spearmanA = (x: ArrayLike<number>, y: ArrayLike<number>) => pearsonA(ranks(x), ranks(y));
/** The statistic on one or two samples (two groups: x and y; pairs: x and y of the same length). */
export function statistic(s: Stat, x: ArrayLike<number>, y?: ArrayLike<number>): number {
  switch (s) {
    case 'mean': return meanA(x);
    case 'median': return medianA(x);
    case 'sd': return sdA(x);
    case 'diff-mean': return meanA(x) - meanA(y!);
    case 'diff-median': return medianA(x) - medianA(y!);
    case 'pearson': return pearsonA(x, y!);
    case 'spearman': return spearmanA(x, y!);
    case 'paired-mean': { let t = 0; for (let i = 0; i < x.length; i++) t += x[i] - y![i]; return t / x.length; }
  }
}

function check(s: Stat, x: number[], y?: number[]) {
  const k = STAT_KIND[s];
  if (x.length < 2) throw new Error('Each sample needs at least 2 values.');
  if (x.length > 20000 || (y && y.length > 20000)) throw new Error('This tool takes up to 20,000 values per sample.');
  if (k !== 'one' && !(y && y.length >= 2)) throw new Error('The second column needs at least 2 values.');
  if (k === 'pairs' && y!.length !== x.length) throw new Error('Paired data need the same number of values in both columns.');
  if ((s === 'pearson' || s === 'spearman') && (sdA(x) === 0 || sdA(y!) === 0)) throw new Error('A column with no spread has no correlation.');
}

// ---------- bootstrap ----------
export type BootResult = {
  est: number; dist: Float64Array; se: number; bias: number;
  percentile: [number, number]; bca: [number, number]; z0: number; a: number; conf: number; B: number; degenerate: number;
};
/** Bootstrap the statistic B times: independent groups are resampled separately, pairs are resampled together. */
export function bootstrap(s: Stat, x: number[], y: number[] | undefined, B = 9999, conf = 0.95, seed = 12345): BootResult {
  check(s, x, y);
  if (!(B >= 100 && B <= 1e6)) throw new Error('Use between 100 and 1,000,000 resamples.');
  const k = STAT_KIND[s], r = rng(seed), n = x.length, m = y?.length ?? 0;
  const bx = new Float64Array(n), by = new Float64Array(k === 'pairs' ? n : m), dist = new Float64Array(B);
  for (let b = 0; b < B; b++) {
    if (k === 'pairs') { for (let i = 0; i < n; i++) { const j = Math.floor(r() * n); bx[i] = x[j]; by[i] = y![j]; } }
    else {
      for (let i = 0; i < n; i++) bx[i] = x[Math.floor(r() * n)];
      if (k === 'two') for (let i = 0; i < m; i++) by[i] = y![Math.floor(r() * m)];
    }
    dist[b] = statistic(s, bx, k === 'one' ? undefined : by);
  }
  return intervals(s, x, y, dist, conf);
}
/** Percentile and BCa intervals from a bootstrap distribution (exported so a distribution can be checked on its own). */
export function intervals(s: Stat, x: number[], y: number[] | undefined, distIn: Float64Array, conf = 0.95): BootResult {
  const est = statistic(s, x, y), B = distIn.length;
  const finite = Float64Array.from(distIn.filter(Number.isFinite)), degenerate = B - finite.length;
  const sorted = Float64Array.from(finite).sort();
  const alpha = (1 - conf) / 2;
  const percentile: [number, number] = [quantileSorted(sorted, alpha), quantileSorted(sorted, 1 - alpha)];
  const mean = meanA(finite), se = sdA(finite);
  // BCa: bias correction from the share below the estimate (ties count half), acceleration from the jackknife.
  let below = 0; for (const v of finite) below += v < est ? 1 : v === est ? 0.5 : 0;
  const z0 = normInv(below / finite.length);
  const samples = STAT_KIND[s] === 'pairs' ? [x.map((_, i) => i)] : STAT_KIND[s] === 'two' ? [x, y!] : [x];
  let num = 0, den = 0;
  samples.forEach((sample, j) => {
    const nj = sample.length, th = new Float64Array(nj);
    for (let i = 0; i < nj; i++) {
      if (STAT_KIND[s] === 'pairs') { const xs = x.filter((_, q) => q !== i), ys = y!.filter((_, q) => q !== i); th[i] = statistic(s, xs, ys); }
      else if (j === 0) th[i] = statistic(s, x.filter((_, q) => q !== i), y);
      else th[i] = statistic(s, x, y!.filter((_, q) => q !== i));
    }
    const tm = meanA(th); let n3 = 0, n2 = 0;
    for (let i = 0; i < nj; i++) { const u = (nj - 1) * (tm - th[i]); n3 += u ** 3; n2 += u * u; }
    num += n3 / nj ** 3; den += n2 / nj ** 2;
  });
  const a = den > 0 ? num / (6 * den ** 1.5) : 0;
  const za = normInv(alpha), adj = (zz: number) => normCdf(z0 + (z0 + zz) / (1 - a * (z0 + zz)));
  const a1 = adj(za), a2 = adj(-za);
  const bca: [number, number] = Number.isFinite(z0) && Number.isFinite(a1) && Number.isFinite(a2) ? [quantileSorted(sorted, a1), quantileSorted(sorted, a2)] : [NaN, NaN];
  return { est, dist: distIn, se, bias: mean - est, percentile, bca, z0, a, conf, B, degenerate };
}

// ---------- permutation tests ----------
export type Alt = 'two-sided' | 'greater' | 'less';
export type PermResult = { est: number; p: number; exact: boolean; count: number; null: Float64Array; kind: string };
const choose = (n: number, k: number) => { let r = 1; for (let i = 1; i <= k; i++) { r = (r * (n - k + i)) / i; if (r > 1e15) return Infinity; } return Math.round(r); };
function pValue(nul: Float64Array, obs: number, alt: Alt, exact: boolean) {
  const g = Math.abs(obs) * 2.220446049250313e-14, adj = exact ? 0 : 1;
  let le = 0, ge = 0;
  for (const v of nul) { if (v <= obs + g) le++; if (v >= obs - g) ge++; }
  const pl = (le + adj) / (nul.length + adj), pg = (ge + adj) / (nul.length + adj);
  return Math.min(1, alt === 'less' ? pl : alt === 'greater' ? pg : 2 * Math.min(pl, pg));
}
/**
 * Permutation test. Two groups: labels shuffled between the groups. Pearson or Spearman: the y values shuffled
 * against x. Paired mean difference: the sign of each difference flipped. Exact when all arrangements fit in B.
 */
export function permutation(s: Stat, x: number[], y: number[], B = 9999, alt: Alt = 'two-sided', seed = 12345): PermResult {
  check(s, x, y);
  const k = STAT_KIND[s];
  if (k === 'one') throw new Error('A permutation test needs two groups or pairs.');
  if (!(B >= 100 && B <= 1e6)) throw new Error('Use between 100 and 1,000,000 resamples.');
  const est = statistic(s, x, y), r = rng(seed ^ 0x5bd1e995);
  const out: number[] = [];
  let exact = false, kind = '';
  if (k === 'two') {
    const n1 = x.length, all = [...x, ...y], N = all.length, total = choose(N, n1);
    const g1 = new Float64Array(n1), g2 = new Float64Array(N - n1);
    kind = 'group labels shuffled';
    if (total <= B) {
      exact = true;
      const pick = new Array<boolean>(N).fill(false);
      const rec = (start: number, left: number) => {
        if (left === 0) { let a = 0, b = 0; for (let i = 0; i < N; i++) { if (pick[i]) g1[a++] = all[i]; else g2[b++] = all[i]; } out.push(statistic(s, g1, g2)); return; }
        for (let i = start; i <= N - left; i++) { pick[i] = true; rec(i + 1, left - 1); pick[i] = false; }
      };
      rec(0, n1);
    } else {
      const p = Float64Array.from(all);
      for (let b = 0; b < B; b++) {
        for (let i = N - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); const t = p[i]; p[i] = p[j]; p[j] = t; }
        out.push(statistic(s, p.subarray(0, n1), p.subarray(n1)));
      }
    }
  } else if (s === 'paired-mean') {
    const d = x.map((v, i) => v - y[i]), n = d.length;
    kind = 'signs of the differences flipped';
    const sumDiff = (signs: (i: number) => number) => { let t = 0; for (let i = 0; i < n; i++) t += signs(i) * d[i]; return t / n; };
    if (n <= 30 && 2 ** n <= B) { exact = true; for (let m = 0; m < 2 ** n; m++) out.push(sumDiff((i) => ((m >> i) & 1 ? -1 : 1))); }
    else for (let b = 0; b < B; b++) { const sg = Array.from({ length: n }, () => (r() < 0.5 ? -1 : 1)); out.push(sumDiff((i) => sg[i])); }
  } else {
    const n = x.length, yy = Float64Array.from(y);
    let fact = 1; for (let i = 2; i <= n && fact <= B; i++) fact *= i;
    kind = 'y values shuffled against x';
    const xs = s === 'spearman' ? ranks(x) : Float64Array.from(x), base = s === 'spearman' ? ranks(y) : yy;
    if (fact <= B) {
      exact = true;
      // Heap's algorithm over all n! orderings.
      const a = Float64Array.from(base), c = new Array<number>(n).fill(0);
      out.push(pearsonA(xs, a));
      for (let i = 0; i < n;) {
        if (c[i] < i) { const j = i % 2 ? c[i] : 0; const t = a[j]; a[j] = a[i]; a[i] = t; out.push(pearsonA(xs, a)); c[i]++; i = 0; }
        else { c[i] = 0; i++; }
      }
    } else {
      const p = Float64Array.from(base);
      for (let b = 0; b < B; b++) {
        for (let i = n - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); const t = p[i]; p[i] = p[j]; p[j] = t; }
        out.push(pearsonA(xs, p));
      }
    }
  }
  const nul = Float64Array.from(out);
  return { est, p: pValue(nul, est, alt, exact), exact, count: nul.length, null: nul, kind };
}

/** Histogram counts of values in `bins` equal bins over [lo, hi]. */
export function histogram(v: ArrayLike<number>, bins: number, lo: number, hi: number) {
  const c = new Array<number>(bins).fill(0), w = (hi - lo) / bins || 1;
  for (let i = 0; i < v.length; i++) { const x = v[i]; if (!Number.isFinite(x)) continue; let k = Math.floor((x - lo) / w); if (k === bins) k--; if (k >= 0 && k < bins) c[k]++; }
  return { counts: c, width: w };
}
