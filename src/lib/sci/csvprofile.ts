// A profile of every column in a table: type, missing values, unique values, summary statistics, outliers,
// histogram, most common values, and a correlation matrix of the number columns. Plain TypeScript, no DOM.
// The numbers follow pandas: sample SD (n − 1), linear quartiles, adjusted skew and excess kurtosis,
// pairwise-complete Pearson or Spearman correlation, and numpy's "auto" histogram bins.
import { isMissing, type Table } from './dataset.ts';
import { num } from './num.ts';

export type Kind = 'number' | 'boolean' | 'date' | 'text' | 'empty';
export type NumStats = {
  n: number; mean: number; sd: number; min: number; q1: number; median: number; q3: number; max: number;
  skew: number; kurt: number; zeros: number; negatives: number; outliersLow: number; outliersHigh: number; integer: boolean; sum: number;
};
export type Hist = { edges: number[]; counts: number[] };
export type ColumnProfile = {
  name: string; index: number; kind: Kind; count: number; missing: number; unique: number;
  top: [string, number][]; num?: NumStats; hist?: Hist; minText?: string; maxText?: string;
  /** Plain notes: mixed numbers and text, all values unique, one value only, and so on. */
  notes: string[];
};
export type Profile = { rows: number; cols: number; missingCells: number; duplicateRows: number; columns: ColumnProfile[] };

const BOOL = new Set(['true', 'false', 'yes', 'no', 'y', 'n', 't', 'f']);
const DATE = /^(\d{4})[-/](\d{1,2})[-/](\d{1,2})(?:[ T](\d{1,2}):(\d{2})(?::(\d{2})(?:\.\d+)?)?)?(?:Z|[+-]\d{2}:?\d{2})?$/;
/** A date or date-time written year first (2026-03-01, 2026/3/1, 2026-03-01T14:30). Returns ms or NaN. */
export function parseDate(s: string): number {
  const m = DATE.exec(s.trim());
  if (!m) return NaN;
  const [y, mo, d, h, mi, se] = [m[1], m[2], m[3], m[4] ?? '0', m[5] ?? '0', m[6] ?? '0'].map(Number);
  if (mo < 1 || mo > 12 || d < 1 || d > 31 || h > 23) return NaN;
  const t = Date.UTC(y, mo - 1, d, h, mi, se);
  return new Date(t).getUTCDate() === d ? t : NaN;
}

/** Quantile of sorted numbers, linear between order statistics (pandas, numpy and R type 7). */
export function quantile(s: ArrayLike<number>, p: number): number {
  const n = s.length;
  if (!n) return NaN;
  const h = (n - 1) * p, i = Math.floor(h);
  return i + 1 < n ? s[i] + (h - i) * (s[i + 1] - s[i]) : s[n - 1];
}

/** Summary statistics of finite numbers, as pandas describe(), skew() and kurt(). */
export function numStats(xs: number[]): NumStats {
  const s = Float64Array.from(xs).sort(), n = s.length;
  let sum = 0; for (const x of s) sum += x;
  const mean = sum / n;
  let m2 = 0, m3 = 0, m4 = 0;
  for (const x of s) { const d = x - mean, d2 = d * d; m2 += d2; m3 += d2 * d; m4 += d2 * d2; }
  const sd = n > 1 ? Math.sqrt(m2 / (n - 1)) : NaN;
  const b2 = m2 / n, g1 = b2 > 0 ? m3 / n / b2 ** 1.5 : 0, g2 = b2 > 0 ? m4 / n / (b2 * b2) - 3 : 0;
  const skew = n > 2 ? (b2 > 0 ? (Math.sqrt(n * (n - 1)) / (n - 2)) * g1 : 0) : NaN;
  const kurt = n > 3 ? (b2 > 0 ? (((n + 1) * g2 + 6) * (n - 1)) / ((n - 2) * (n - 3)) : 0) : NaN;
  const q1 = quantile(s, 0.25), q3 = quantile(s, 0.75), iqr = q3 - q1;
  let zeros = 0, negatives = 0, lo = 0, hi = 0, integer = true;
  for (const x of s) {
    if (x === 0) zeros++; if (x < 0) negatives++;
    if (x < q1 - 1.5 * iqr) lo++; if (x > q3 + 1.5 * iqr) hi++;
    if (integer && !Number.isInteger(x)) integer = false;
  }
  return { n, mean, sd, min: s[0], q1, median: quantile(s, 0.5), q3, max: s[n - 1], skew, kurt, zeros, negatives, outliersLow: lo, outliersHigh: hi, integer, sum };
}

/**
 * Histogram with numpy's "auto" bins (numpy 2.x): the narrower of Sturges' width and the Freedman-Diaconis width,
 * the latter kept at least half the square-root rule's width; bins at least 1 wide when every value is a whole
 * number (as numpy does for integer data). Equal bins from the minimum to the maximum, the last bin closed.
 * `bins` fixes the number of bins instead. Very many bins are capped at `cap`.
 */
export function histogram(xs: number[], bins: number | 'auto' = 'auto', cap = 80): Hist {
  const s = Float64Array.from(xs).sort(), n = s.length;
  if (!n) return { edges: [], counts: [] };
  let lo = s[0], hi = s[n - 1];
  if (lo === hi) { lo -= 0.5; hi += 0.5; }
  let k: number;
  if (bins === 'auto') {
    const ptp = s[n - 1] - s[0];
    if (ptp === 0) k = 1;
    else {
      const sturges = ptp / (Math.log2(n) + 1), iqr = quantile(s, 0.75) - quantile(s, 0.25);
      const fd = Math.max(2 * iqr * n ** (-1 / 3), ptp / Math.sqrt(n) / 2);
      let w = Math.min(fd, sturges);
      if (w < 1 && s.every((x) => Number.isInteger(x))) w = 1;
      k = Math.max(1, Math.ceil(ptp / w));
    }
  } else k = Math.max(1, Math.round(bins));
  k = Math.min(k, cap);
  const edges = Array.from({ length: k + 1 }, (_, i) => (i === k ? hi : lo + ((hi - lo) * i) / k));
  const counts = new Array(k).fill(0);
  for (const x of s) {
    let i = Math.floor(((x - lo) / (hi - lo)) * k);
    if (i >= k) i = k - 1; if (i < 0) i = 0;
    // Guard against rounding at the edges, as numpy does.
    if (i > 0 && x < edges[i]) i--; else if (i < k - 1 && x >= edges[i + 1]) i++;
    counts[i]++;
  }
  return { edges, counts };
}

/** Profile every column of a table. */
export function profileTable(t: Table, bins: number | 'auto' = 'auto'): Profile {
  let missingCells = 0;
  const columns = t.head.map((name, j) => {
    const vals: string[] = [];
    for (const r of t.rows) { const v = r[j] ?? ''; if (isMissing(v)) missingCells++; else vals.push(v.trim()); }
    const freq = new Map<string, number>();
    for (const v of vals) freq.set(v, (freq.get(v) ?? 0) + 1);
    const top = [...freq.entries()].sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1)).slice(0, 10);
    const count = vals.length, missing = t.rows.length - count;
    const p: ColumnProfile = { name, index: j, kind: 'empty', count, missing, unique: freq.size, top, notes: [] };
    if (!count) { p.notes.push('Every value is missing.'); return p; }
    const nums = vals.map(num), nNum = nums.filter((x) => Number.isFinite(x)).length;
    const dates = nNum === count ? [] : vals.map(parseDate);
    if (nNum === count) {
      p.kind = 'number'; p.num = numStats(nums); p.hist = histogram(nums, bins);
      const o = p.num.outliersLow + p.num.outliersHigh;
      if (o) p.notes.push(`${o} value${o === 1 ? '' : 's'} outside 1.5 × IQR of the quartiles (possible outliers).`);
    } else if (vals.every((v) => BOOL.has(v.toLowerCase()))) p.kind = 'boolean';
    else if (dates.every((x) => Number.isFinite(x))) {
      p.kind = 'date';
      let a = Infinity, b = -Infinity, ai = 0, bi = 0;
      dates.forEach((x, i) => { if (x < a) { a = x; ai = i; } if (x > b) { b = x; bi = i; } });
      p.minText = vals[ai]; p.maxText = vals[bi];
    } else {
      p.kind = 'text';
      const keys = [...freq.keys()].sort(); p.minText = keys[0]; p.maxText = keys[keys.length - 1];
      if (nNum >= count * 0.8) {
        const bad = vals.find((v) => !Number.isFinite(num(v)))!;
        p.notes.push(`${nNum} of ${count} values are numbers but ${count - nNum} are not (for example "${bad}"), so it is treated as text. Fix or blank those cells to get number statistics.`);
      }
    }
    if (freq.size === count && count > 1 && p.kind !== 'number') p.notes.push('Every value is different (an ID or free text?).');
    if (freq.size === 1) p.notes.push('Only one value: this column carries no information.');
    if (missing / t.rows.length >= 0.5) p.notes.push(`${Math.round((100 * missing) / t.rows.length)} % missing.`);
    return p;
  });
  const seen = new Set<string>();
  let duplicateRows = 0;
  for (const r of t.rows) { const k = JSON.stringify(r); if (seen.has(k)) duplicateRows++; else seen.add(k); }
  return { rows: t.rows.length, cols: t.head.length, missingCells, duplicateRows, columns };
}

/** Average ranks (ties share the mean rank), 1-based, as pandas rank(). */
export function ranks(x: number[]): number[] {
  const idx = x.map((_, i) => i).sort((a, b) => x[a] - x[b]);
  const r = new Array(x.length);
  for (let i = 0; i < idx.length;) {
    let j = i; while (j + 1 < idx.length && x[idx[j + 1]] === x[idx[i]]) j++;
    for (let k = i; k <= j; k++) r[idx[k]] = (i + j) / 2 + 1;
    i = j + 1;
  }
  return r;
}
export function pearson(x: number[], y: number[]): number {
  const n = x.length;
  if (n < 2) return NaN;
  let mx = 0, my = 0; for (let i = 0; i < n; i++) { mx += x[i]; my += y[i]; } mx /= n; my /= n;
  let sxy = 0, sxx = 0, syy = 0;
  for (let i = 0; i < n; i++) { const a = x[i] - mx, b = y[i] - my; sxy += a * b; sxx += a * a; syy += b * b; }
  return sxx > 0 && syy > 0 ? Math.max(-1, Math.min(1, sxy / Math.sqrt(sxx * syy))) : NaN;
}

/** Correlation matrix of number columns, using the rows where both values are present (pandas DataFrame.corr). */
export function correlation(cols: number[][], method: 'pearson' | 'spearman' = 'pearson'): { r: number[][]; n: number[][] } {
  const k = cols.length, r = Array.from({ length: k }, () => new Array(k).fill(NaN)), nn = Array.from({ length: k }, () => new Array(k).fill(0));
  for (let a = 0; a < k; a++) for (let b = a; b < k; b++) {
    const x: number[] = [], y: number[] = [];
    cols[a].forEach((v, i) => { const w = cols[b][i]; if (Number.isFinite(v) && Number.isFinite(w)) { x.push(v); y.push(w); } });
    const v = method === 'spearman' ? pearson(ranks(x), ranks(y)) : pearson(x, y);
    r[a][b] = r[b][a] = a === b && x.length > 1 && Number.isFinite(v) ? 1 : v;
    nn[a][b] = nn[b][a] = x.length;
  }
  return { r, n: nn };
}

/** The made-up example: 41 plants (one row repeated) with a few gaps and a typing slip (118.0 cm). */
export const EXAMPLE = `plant,sown,region,height_cm,mass_g,fertiliser_doses,fertilised,leaves
P01,2026-03-01,North,42.0,132.9,2,yes,11
P02,2026-03-02,West,39.3,112.9,3,yes,14
P03,2026-03-03,North,39.0,115.3,3,yes,13
P04,2026-03-04,South,42.6,123.7,1,yes,12
P05,2026-03-05,East,33.9,101.0,2,yes,9
P06,2026-03-06,East,,93.7,3,yes,11
P07,2026-03-07,East,42.9,131.3,3,yes,13
P08,2026-03-08,South,41.7,130.3,1,yes,11
P09,2026-03-09,South,36.1,104.6,3,yes,11
P10,2026-03-10,North,41.8,137.5,0,no,10
P11,2026-03-11,East,42.7,132.9,1,yes,10
P12,2026-03-12,East,50.2,141.7,2,yes,16
P13,2026-03-13,,38.2,136.4,2,yes,12
P14,2026-03-14,North,42.4,136.6,0,no,10
P15,2026-03-15,South,41.6,135.0,3,yes,15
P16,2026-03-16,South,43.2,129.8,2,yes,13
P17,2026-03-17,East,38.5,117.6,1,yes,12
P18,2026-03-18,South,NA,98.6,3,yes,12
P19,2026-03-19,North,30.0,88.8,2,yes,11
P20,2026-03-20,North,46.1,140.0,3,yes,14
P21,2026-03-21,East,51.1,154.6,0,no,13
P22,2026-03-22,East,41.3,126.3,2,yes,12
P23,2026-03-23,East,39.3,132.3,2,yes,
P24,2026-03-24,North,46.0,139.5,1,yes,12
P25,2026-03-25,South,45.5,129.4,3,yes,12
P26,2026-03-26,North,29.8,89.6,2,yes,10
P27,2026-03-27,South,55.5,164.6,0,no,14
P28,2026-03-28,North,45.0,137.9,2,yes,13
P29,2026-04-01,West,45.1,130.5,3,yes,14
P30,2026-04-02,East,35.7,113.0,3,yes,11
P31,2026-04-03,West,43.2,,3,yes,13
P32,2026-04-04,West,30.0,82.8,2,yes,10
P33,2026-04-05,West,47.1,130.3,1,yes,14
P34,2026-04-06,West,118.0,145.9,2,yes,12
P35,2026-04-07,North,50.7,156.6,1,yes,13
P36,2026-04-08,West,36.1,121.8,3,yes,11
P37,2026-04-09,North,41.7,122.1,2,yes,11
P38,2026-04-10,West,49.5,152.1,2,yes,14
P39,2026-04-11,West,37.8,114.2,1,yes,10
P40,2026-04-12,East,39.7,120.4,2,yes,11
P11,2026-03-11,East,42.7,132.9,1,yes,10`;
