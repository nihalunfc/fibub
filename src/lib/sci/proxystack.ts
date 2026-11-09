// Stacking palaeoclimate proxy records: put several (age, value) records on one age grid by linear
// interpolation, standardise each over a chosen age window (z-scores), flip signs where a proxy runs the other
// way, average them into a stack (mean or median) with a ±1 SD or bootstrap envelope, and compare the records
// with Pearson correlations, a lag scan and the effective sample size of Bretherton et al. (1999) for
// autocorrelated series. Plain TypeScript, no DOM.
import { num, parseTable } from './num.ts';
import { tTwoSided, quantileSorted } from './stats.ts';

export type ProxyRecord = { name: string; age: number[]; value: number[] };
export type Grid = { start: number; end: number; step: number };

/** Sort by age, drop rows without numbers, and average values that share an age. */
export function cleanRecord(r: ProxyRecord): ProxyRecord {
  const pts = r.age.map((a, i) => [a, r.value[i]]).filter(([a, v]) => Number.isFinite(a) && Number.isFinite(v)).sort((p, q) => p[0] - q[0]);
  const age: number[] = [], value: number[] = [];
  for (let i = 0; i < pts.length;) {
    let j = i, s = 0;
    while (j < pts.length && pts[j][0] === pts[i][0]) s += pts[j++][1];
    age.push(pts[i][0]); value.push(s / (j - i)); i = j;
  }
  return { name: r.name, age, value };
}

/**
 * Records from pasted text. Long format: record name, age, value (one row per sample; the name column is the
 * one with text). Wide format: age, value pairs side by side (age 1, value 1, age 2, value 2 …), with the value
 * column headers as names. A header row is optional.
 */
export function parseRecords(text: string): { records: ProxyRecord[]; skipped: number; error?: string } {
  const rows = parseTable(text);
  if (!rows.length) return { records: [], skipped: 0, error: 'Paste or open at least two records.' };
  const width = Math.max(...rows.map((r) => r.length));
  const isNum = (c: string | undefined) => c !== undefined && c !== '' && Number.isFinite(num(c));
  const head = rows[0].filter((c) => c !== '').every((c) => !isNum(c)) && rows.length > 1;
  const body = head ? rows.slice(1) : rows;
  // Long format: a column that holds text in most data rows.
  const textCol = Array.from({ length: width }, (_, i) => i).find((i) => body.filter((r) => r[i] && !isNum(r[i])).length > body.length / 2);
  let skipped = 0;
  if (textCol !== undefined) {
    const nums = Array.from({ length: width }, (_, i) => i).filter((i) => i !== textCol);
    if (nums.length < 2) return { records: [], skipped: 0, error: 'Long format needs three columns: record name, age and value.' };
    const [ai, vi] = nums;
    const map = new Map<string, ProxyRecord>();
    for (const r of body) {
      const n = (r[textCol] ?? '').trim(), a = num(r[ai]), v = num(r[vi]);
      if (!n || !Number.isFinite(a) || !Number.isFinite(v)) { skipped++; continue; }
      if (!map.has(n)) map.set(n, { name: n, age: [], value: [] });
      map.get(n)!.age.push(a); map.get(n)!.value.push(v);
    }
    return { records: [...map.values()].map(cleanRecord), skipped };
  }
  if (width < 2) return { records: [], skipped: 0, error: 'Give each sample an age and a value.' };
  if (width % 2) return { records: [], skipped: 0, error: `Wide format needs age and value columns in pairs; this table has ${width} columns. Or use three columns: record name, age, value.` };
  const records: ProxyRecord[] = [];
  for (let c = 0; c < width; c += 2) {
    const r: ProxyRecord = { name: (head && rows[0][c + 1]) || `Record ${c / 2 + 1}`, age: [], value: [] };
    for (const row of body) {
      if ((row[c] ?? '') === '' && (row[c + 1] ?? '') === '') continue; // shorter records leave blanks
      const a = num(row[c]), v = num(row[c + 1]);
      if (!Number.isFinite(a) || !Number.isFinite(v)) { skipped++; continue; }
      r.age.push(a); r.value.push(v);
    }
    records.push(cleanRecord(r));
  }
  return { records, skipped };
}

/** Median spacing between successive ages. */
export function medianSpacing(age: number[]): number {
  const d = age.slice(1).map((a, i) => a - age[i]).sort((x, y) => x - y);
  return d.length ? quantileSorted(d, 0.5) : NaN;
}
/** The 1, 2, 2.5 or 5 × 10ⁿ step nearest to x (on a log scale). */
const nice = (x: number) => { const m = 10 ** Math.floor(Math.log10(x)); return [1, 2, 2.5, 5, 10].map((k) => k * m).reduce((b, s) => (Math.abs(Math.log(s / x)) < Math.abs(Math.log(b / x)) ? s : b)); };

/** A grid over the ages every record covers, with a step near the coarsest record's typical spacing. */
export function autoGrid(records: ProxyRecord[]): Grid & { overlap: boolean } {
  let lo = Math.max(...records.map((r) => r.age[0])), hi = Math.min(...records.map((r) => r.age[r.age.length - 1]));
  const overlap = hi > lo;
  if (!overlap) { lo = Math.min(...records.map((r) => r.age[0])); hi = Math.max(...records.map((r) => r.age[r.age.length - 1])); }
  const step = nice(Math.max(...records.map((r) => medianSpacing(r.age)).filter(Number.isFinite), (hi - lo) / 2000));
  return { start: Math.ceil(lo / step - 1e-9) * step, end: Math.floor(hi / step + 1e-9) * step, step, overlap };
}

export function gridAges(g: Grid): number[] {
  const n = Math.floor((g.end - g.start) / g.step + 1e-9) + 1, out: number[] = [];
  for (let i = 0; i < n; i++) out.push(+(g.start + i * g.step).toPrecision(12));
  return out;
}

/**
 * Linear interpolation of a (sorted, cleaned) record at the grid ages. NaN outside the record's age range and,
 * when maxGap is given, inside any gap between samples longer than maxGap.
 */
export function interpolate(r: ProxyRecord, ages: number[], maxGap = Infinity): number[] {
  const { age, value } = r, n = age.length;
  return ages.map((t) => {
    if (!(n > 0) || t < age[0] || t > age[n - 1]) return NaN;
    let lo = 0, hi = n - 1;
    while (hi - lo > 1) { const m = (lo + hi) >> 1; if (age[m] <= t) lo = m; else hi = m; }
    if (age[lo] === t) return value[lo];
    if (age[hi] === t) return value[hi];
    if (age[hi] - age[lo] > maxGap) return NaN;
    return value[lo] + ((t - age[lo]) / (age[hi] - age[lo])) * (value[hi] - value[lo]);
  });
}

/** z-scores: (x − mean) / SD, with the mean and sample SD (n − 1) taken over the grid ages inside [w0, w1]. */
export function zscore(x: number[], ages: number[], w0: number, w1: number): { z: number[]; mean: number; sd: number; n: number } {
  const lo = Math.min(w0, w1), hi = Math.max(w0, w1);
  const v = x.filter((xi, i) => Number.isFinite(xi) && ages[i] >= lo - 1e-9 && ages[i] <= hi + 1e-9);
  const n = v.length, mean = v.reduce((s, a) => s + a, 0) / n;
  const sd = n > 1 ? Math.sqrt(v.reduce((s, a) => s + (a - mean) ** 2, 0) / (n - 1)) : NaN;
  return { z: x.map((xi) => (xi - mean) / sd), mean, sd, n };
}

const median = (v: number[]) => { const s = [...v].sort((a, b) => a - b); return quantileSorted(s, 0.5); };
const meanOf = (v: number[]) => v.reduce((s, a) => s + a, 0) / v.length;

/** The stack at each grid age over the records with a value there (rows = records). NaN where fewer than minN. */
export function stack(m: number[][], method: 'mean' | 'median', minN = 1): { center: number[]; sd: number[]; n: number[] } {
  const T = m[0]?.length ?? 0, center: number[] = [], sd: number[] = [], n: number[] = [];
  for (let t = 0; t < T; t++) {
    const v = m.map((r) => r[t]).filter(Number.isFinite);
    n.push(v.length);
    if (v.length < Math.max(1, minN)) { center.push(NaN); sd.push(NaN); continue; }
    center.push(method === 'median' ? median(v) : meanOf(v));
    const mu = meanOf(v);
    sd.push(v.length > 1 ? Math.sqrt(v.reduce((s, a) => s + (a - mu) ** 2, 0) / (v.length - 1)) : NaN);
  }
  return { center, sd, n };
}

/** A small seeded random number generator (mulberry32), so the bootstrap gives the same envelope every time. */
export function rng(seed: number) {
  let a = seed >>> 0;
  return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
/** B resamples of m record numbers, drawn with replacement. */
export function bootIndex(B: number, m: number, seed = 1): number[][] {
  const r = rng(seed);
  return Array.from({ length: B }, () => Array.from({ length: m }, () => Math.floor(r() * m)));
}

/**
 * Bootstrap envelope: resample whole records with replacement, restack, and take the (1 − level)/2 and
 * (1 + level)/2 percentiles (linear interpolation, as numpy's default) of the restacked values at each age.
 */
export function bootstrap(m: number[][], method: 'mean' | 'median', idx: number[][], level = 0.95, minN = 1): { lo: number[]; hi: number[] } {
  const T = m[0]?.length ?? 0, lo: number[] = [], hi: number[] = [];
  const minNeed = Math.max(1, minN);
  for (let t = 0; t < T; t++) {
    if (m.filter((r) => Number.isFinite(r[t])).length < minNeed) { lo.push(NaN); hi.push(NaN); continue; }
    const s: number[] = [];
    for (const row of idx) {
      const v = row.map((k) => m[k][t]).filter(Number.isFinite);
      if (v.length) s.push(method === 'median' ? median(v) : meanOf(v));
    }
    s.sort((a, b) => a - b);
    lo.push(quantileSorted(s, (1 - level) / 2)); hi.push(quantileSorted(s, (1 + level) / 2));
  }
  return { lo, hi };
}

/** Pearson r over the ages where both series have values. */
export function pearson(a: number[], b: number[]): { r: number; n: number } {
  const ii = a.map((_, i) => i).filter((i) => Number.isFinite(a[i]) && Number.isFinite(b[i]));
  const n = ii.length;
  if (n < 3) return { r: NaN, n };
  const ma = ii.reduce((s, i) => s + a[i], 0) / n, mb = ii.reduce((s, i) => s + b[i], 0) / n;
  let sab = 0, saa = 0, sbb = 0;
  for (const i of ii) { const x = a[i] - ma, y = b[i] - mb; sab += x * y; saa += x * x; sbb += y * y; }
  return { r: sab / Math.sqrt(saa * sbb), n };
}

/**
 * Lag-1 autocorrelation of x over the grid indices in `ii` (sorted): the sum of (x_t − m)(x_t+1 − m) over
 * neighbouring grid steps that are both in `ii`, divided by the sum of (x_t − m)² over `ii`.
 */
export function lag1(x: number[], ii: number[]): number {
  const n = ii.length;
  if (n < 3) return NaN;
  const m = ii.reduce((s, i) => s + x[i], 0) / n, inSet = new Set(ii);
  let num0 = 0, den = 0;
  for (const i of ii) { den += (x[i] - m) ** 2; if (inSet.has(i + 1)) num0 += (x[i] - m) * (x[i + 1] - m); }
  return num0 / den;
}

/**
 * Correlation with the effective sample size of Bretherton et al. (1999), eq. 31:
 * n_eff = n (1 − r1a·r1b) / (1 + r1a·r1b), where r1a and r1b are the lag-1 autocorrelations over the shared ages.
 * n_eff is kept between 2 and n. The p-value is two-sided from t = r √((n_eff − 2) / (1 − r²)) with n_eff − 2
 * degrees of freedom; `pNaive` uses n instead.
 */
export function correlate(a: number[], b: number[]) {
  const { r, n } = pearson(a, b);
  const ii = a.map((_, i) => i).filter((i) => Number.isFinite(a[i]) && Number.isFinite(b[i]));
  const r1a = lag1(a, ii), r1b = lag1(b, ii), rr = r1a * r1b;
  const neffRaw = n * (1 - rr) / (1 + rr);
  const neff = Math.min(n, Math.max(2, neffRaw));
  const p = (df: number) => (df > 0 && Math.abs(r) < 1 ? tTwoSided(r * Math.sqrt(df / (1 - r * r)), df) : NaN);
  return { r, n, r1a, r1b, neff, p: p(neff - 2), pNaive: p(n - 2) };
}

/**
 * Cross-correlation over age offsets: for lag k (grid steps, −maxLag … maxLag), r between A at age t and
 * B at age t + k·step. A peak at lag +k means a feature at age t in A shows at age t + k·step in B.
 */
export function lagScan(a: number[], b: number[], maxLag: number): { lag: number; r: number; n: number }[] {
  const T = a.length, out: { lag: number; r: number; n: number }[] = [];
  for (let k = -maxLag; k <= maxLag; k++) {
    const x: number[] = [], y: number[] = [];
    for (let t = 0; t < T; t++) { const u = t + k; if (u >= 0 && u < T) { x.push(a[t]); y.push(b[u]); } }
    const p = pearson(x, y);
    out.push({ lag: k, r: p.r, n: p.n });
  }
  return out;
}

/** The made-up example: four records of one shared signal, one running the other way, one with an age offset. */
export function exampleRecords(): ProxyRecord[] {
  const r = rng(2026);
  const gauss = () => { let u = 0; while (u === 0) u = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * r()); };
  const sig = (t: number) => Math.sin((2 * Math.PI * t) / 1500) + 0.5 * Math.sin((2 * Math.PI * t) / 600 + 1) - t / 6000;
  const make = (name: string, a0: number, a1: number, dt: number, f: (t: number) => number, noise: number, dec = 2) => {
    const age: number[] = [], value: number[] = [];
    for (let t = a0; t <= a1; t += dt * (0.6 + 0.8 * r())) { const ti = Math.round(t); age.push(ti); value.push(+(f(ti) + noise * gauss()).toFixed(dec)); }
    return { name, age, value };
  };
  return [
    make('Lake d18O', 0, 6000, 50, (t) => -2.5 - 0.8 * sig(t), 0.25),
    make('Cave d13C', 200, 5800, 30, (t) => -8 + 1.2 * sig(t), 0.4),
    make('Marine SST', 0, 6200, 80, (t) => 18 + 1.5 * sig(t - 150), 0.3, 1),
    make('Pollen index', 500, 6000, 100, (t) => 40 + 12 * sig(t), 6, 0),
  ];
}
/** The records as long-format text: record, age, value. */
export function toLong(records: ProxyRecord[], ageName = 'age', valueName = 'value'): string {
  return ['record\t' + ageName + '\t' + valueName, ...records.flatMap((r) => r.age.map((a, i) => `${r.name}\t${a}\t${r.value[i]}`))].join('\n');
}
