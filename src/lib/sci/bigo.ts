// Big-O and runtime maths: the common growth classes, their size at any n (as log10 so n! and 2^n never
// overflow), least-squares fits of measured timings to each class, and small algorithms to time. No DOM.
import { logGamma } from './stats.ts';

export type ClassId = '1' | 'logn' | 'n' | 'nlogn' | 'n2' | 'n3' | '2n' | 'nfact';
export const CLASSES: { id: ClassId; name: string; g: (n: number) => number; log10: (n: number) => number; example: string }[] = [
  { id: '1', name: 'O(1)', g: () => 1, log10: () => 0, example: 'reading one array element' },
  { id: 'logn', name: 'O(log n)', g: (n) => Math.log2(n), log10: (n) => Math.log10(Math.log2(n)), example: 'binary search' },
  { id: 'n', name: 'O(n)', g: (n) => n, log10: (n) => Math.log10(n), example: 'one pass over a list' },
  { id: 'nlogn', name: 'O(n log n)', g: (n) => n * Math.log2(n), log10: (n) => Math.log10(n) + Math.log10(Math.log2(n)), example: 'merge sort, heap sort' },
  { id: 'n2', name: 'O(n²)', g: (n) => n * n, log10: (n) => 2 * Math.log10(n), example: 'comparing every pair, insertion sort' },
  { id: 'n3', name: 'O(n³)', g: (n) => n * n * n, log10: (n) => 3 * Math.log10(n), example: 'schoolbook matrix multiplication' },
  { id: '2n', name: 'O(2ⁿ)', g: (n) => 2 ** n, log10: (n) => n * Math.LOG10E * Math.LN2, example: 'trying every subset' },
  { id: 'nfact', name: 'O(n!)', g: (n) => Math.exp(logGamma(n + 1)), log10: (n) => logGamma(n + 1) / Math.LN10, example: 'trying every order (brute-force travelling salesman)' },
];

/** "1.23 × 10^45" style text for a number given by its log10, or plain digits when small. */
export function fromLog10(l: number, digits = 3): string {
  if (l === -Infinity) return '0';
  if (!Number.isFinite(l)) return '∞';
  if (l < 15) { const v = 10 ** l; return v >= 1000 ? Math.round(v).toLocaleString('en') : String(+v.toPrecision(digits)); }
  const e = Math.floor(l), m = 10 ** (l - e);
  const ms = m.toFixed(digits - 1);
  return ms.startsWith('10') ? `1 × 10^${(e + 1).toLocaleString('en')}` : `${ms} × 10^${e.toLocaleString('en')}`;
}

/** A duration in seconds, given as log10(seconds), in the most readable unit. */
export function duration(l10s: number): string {
  if (l10s === -Infinity) return '0';
  const s = 10 ** l10s;
  if (l10s < -6) return `${+(s * 1e9).toPrecision(3)} ns`;
  if (l10s < -3) return `${+(s * 1e6).toPrecision(3)} µs`;
  if (s < 1) return `${+(s * 1e3).toPrecision(3)} ms`;
  if (s < 60) return `${+s.toPrecision(3)} s`;
  if (s < 3600) return `${+(s / 60).toPrecision(3)} minutes`;
  if (s < 86400) return `${+(s / 3600).toPrecision(3)} hours`;
  const yearsL = l10s - Math.log10(365.25 * 86400);
  if (yearsL < 0) return `${+(s / 86400).toPrecision(3)} days`;
  if (yearsL < 6) return `${+(10 ** yearsL).toPrecision(3)} years`;
  return `${fromLog10(yearsL)} years`;
}

export type Fit = { id: string; name: string; a: number; b: number; rss: number; r2: number; ok: boolean; why?: string };
/** Least-squares fit of t = a + b·g(n) for each class (t = a for O(1)). The best is the smallest residual
 * sum of squares among fits with b > 0 (a time that falls as n grows is not that class). */
export function fitClasses(n: number[], t: number[]): { fits: Fit[]; best: Fit | null; slope: number; slopeR2: number } {
  if (n.length !== t.length) throw new Error('Each n needs a time.');
  if (n.length < 3) throw new Error('Give at least 3 rows of n and time.');
  if (n.some((v) => !(v >= 1))) throw new Error('Every n must be 1 or more.');
  if (t.some((v) => !Number.isFinite(v) || v < 0)) throw new Error('Every time must be a number of 0 or more.');
  if (new Set(n).size < 3) throw new Error('Use at least 3 different values of n.');
  const N = n.length, tm = t.reduce((s, v) => s + v, 0) / N, stt = t.reduce((s, v) => s + (v - tm) ** 2, 0);
  const fits: Fit[] = CLASSES.map((c) => {
    if (c.id === '1') return { id: c.id, name: c.name, a: tm, b: 0, rss: stt, r2: 0, ok: true };
    const maxL = Math.max(...n.map(c.log10));
    if (maxL > 150) return { id: c.id, name: c.name, a: NaN, b: NaN, rss: Infinity, r2: NaN, ok: false, why: 'too large to fit at these n' };
    const g = n.map(c.g), gm = g.reduce((s, v) => s + v, 0) / N;
    let sxx = 0, sxy = 0;
    for (let i = 0; i < N; i++) { sxx += (g[i] - gm) ** 2; sxy += (g[i] - gm) * (t[i] - tm); }
    if (!(sxx > 0)) return { id: c.id, name: c.name, a: NaN, b: NaN, rss: Infinity, r2: NaN, ok: false, why: 'no spread at these n' };
    const b = sxy / sxx, a = tm - b * gm;
    let rss = 0;
    for (let i = 0; i < N; i++) rss += (t[i] - a - b * g[i]) ** 2;
    const r2 = stt > 0 ? 1 - rss / stt : 1;
    return b > 0 ? { id: c.id, name: c.name, a, b, rss, r2, ok: true } : { id: c.id, name: c.name, a, b, rss, r2, ok: false, why: 'time falls as n grows' };
  });
  const cands = fits.filter((f) => f.ok);
  const best = cands.length ? cands.reduce((p, f) => (f.rss < p.rss ? f : p)) : null;
  // Slope of log t against log n: about 1 for O(n), 2 for O(n²); a quick check that does not assume a class.
  const pts = n.map((v, i) => [Math.log(v), Math.log(t[i])]).filter(([, y]) => Number.isFinite(y));
  let slope = NaN, slopeR2 = NaN;
  if (pts.length >= 2) {
    const xm = pts.reduce((s, p) => s + p[0], 0) / pts.length, ym = pts.reduce((s, p) => s + p[1], 0) / pts.length;
    let sxx = 0, sxy = 0, syy = 0;
    for (const [x, y] of pts) { sxx += (x - xm) ** 2; sxy += (x - xm) * (y - ym); syy += (y - ym) ** 2; }
    if (sxx > 0) { slope = sxy / sxx; slopeR2 = syy > 0 ? (sxy * sxy) / (sxx * syy) : 1; }
  }
  return { fits, best, slope, slopeR2 };
}

// ---------- Small algorithms to time in the browser ----------
export type Bench = { id: string; name: string; cls: ClassId; sizes: number[]; setup: (n: number) => unknown; run: (d: any) => number };
const rand = (n: number, seed = 12345) => { let s = seed; const a = new Float64Array(n); for (let i = 0; i < n; i++) { s = (s * 1103515245 + 12345) % 2147483648; a[i] = s / 2147483648; } return a; };
export const BENCHES: Bench[] = [
  { id: 'sum', name: 'Add up a list (one loop)', cls: 'n', sizes: [50000, 100000, 200000, 400000, 800000, 1600000], setup: (n) => rand(n), run: (a: Float64Array) => { let s = 0; for (let i = 0; i < a.length; i++) s += a[i]; return s; } },
  { id: 'binary', name: 'Binary search, 1,000 look-ups', cls: 'logn', sizes: [1000, 10000, 100000, 1000000, 4000000], setup: (n) => { const a = new Float64Array(n); for (let i = 0; i < n; i++) a[i] = i; return a; }, run: (a: Float64Array) => { let hits = 0; for (let k = 0; k < 1000; k++) { const x = (k * 7919) % a.length; let lo = 0, hi = a.length - 1; while (lo <= hi) { const m = (lo + hi) >> 1; if (a[m] === x) { hits++; break; } if (a[m] < x) lo = m + 1; else hi = m - 1; } } return hits; } },
  { id: 'sort', name: 'Built-in sort of random numbers', cls: 'nlogn', sizes: [10000, 20000, 40000, 80000, 160000, 320000], setup: (n) => rand(n), run: (a: Float64Array) => a.slice().sort()[0] },
  { id: 'merge', name: 'Merge sort (written in JavaScript)', cls: 'nlogn', sizes: [10000, 20000, 40000, 80000, 160000], setup: (n) => rand(n), run: (a: Float64Array) => mergeSort(a.slice())[0] },
  { id: 'insertion', name: 'Insertion sort of random numbers', cls: 'n2', sizes: [500, 1000, 1500, 2000, 3000, 4000], setup: (n) => rand(n), run: (a: Float64Array) => insertionSort(a.slice())[0] },
  { id: 'pairs', name: 'Multiply every pair (two nested loops)', cls: 'n2', sizes: [500, 1000, 1500, 2000, 3000, 4000], setup: (n) => rand(n), run: (a: Float64Array) => { let c = 0; for (let i = 0; i < a.length; i++) { const x = a[i]; for (let j = i + 1; j < a.length; j++) c += x * a[j]; } return c; } },
  { id: 'matmul', name: 'Multiply two n × n matrices', cls: 'n3', sizes: [40, 60, 80, 100, 130, 160], setup: (n) => ({ n, a: rand(n * n, 1), b: rand(n * n, 2) }), run: (d: { n: number; a: Float64Array; b: Float64Array }) => { const { n, a, b } = d, c = new Float64Array(n * n); for (let i = 0; i < n; i++) for (let k = 0; k < n; k++) { const x = a[i * n + k]; for (let j = 0; j < n; j++) c[i * n + j] += x * b[k * n + j]; } return c[0]; } },
  { id: 'subsets', name: 'Add up every subset', cls: '2n', sizes: [10, 12, 14, 16, 17, 18], setup: (n) => rand(n), run: (a: Float64Array) => { let best = 0; const m = 1 << a.length; for (let s = 0; s < m; s++) { let t = 0; for (let i = 0; i < a.length; i++) if (s & (1 << i)) t += a[i]; if (t > best) best = t; } return best; } },
];
export function insertionSort(a: Float64Array): Float64Array {
  for (let i = 1; i < a.length; i++) { const x = a[i]; let j = i - 1; while (j >= 0 && a[j] > x) { a[j + 1] = a[j]; j--; } a[j + 1] = x; }
  return a;
}
export function mergeSort(a: Float64Array): Float64Array {
  const tmp = new Float64Array(a.length);
  for (let w = 1; w < a.length; w *= 2) for (let lo = 0; lo < a.length - w; lo += 2 * w) {
    const mid = lo + w, hi = Math.min(lo + 2 * w, a.length);
    let i = lo, j = mid, k = lo;
    while (i < mid && j < hi) tmp[k++] = a[j] < a[i] ? a[j++] : a[i++];
    while (i < mid) tmp[k++] = a[i++];
    while (j < hi) tmp[k++] = a[j++];
    for (let x = lo; x < hi; x++) a[x] = tmp[x];
  }
  return a;
}
/** Time one call of run(data): repeat until at least `minMs` have passed, return the median of 3 such
 * batches, in milliseconds per call. */
export function timeIt(run: (d: unknown) => number, data: unknown, minMs = 30, now: () => number = () => performance.now()): number {
  let sink = 0;
  const batch = () => { let reps = 0; const t0 = now(); let t = t0; do { sink += run(data) as number; reps++; t = now(); } while (t - t0 < minMs); return (t - t0) / reps; };
  const r = [batch(), batch(), batch()].sort((x, y) => x - y);
  if (sink === 0.123456789) console.log(sink); // keep the work from being optimised away
  return r[1];
}
