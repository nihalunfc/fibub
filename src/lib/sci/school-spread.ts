// Spread explorer (Class 11 maths, statistics): range, mean deviation about the mean and about the median,
// variance and standard deviation (dividing by n, as in school statistics), and the coefficient of variation to
// compare two sets of data. Plain TypeScript, no DOM.
export type Stats = { n: number; mean: number; median: number; min: number; max: number; range: number; mdMean: number; mdMedian: number; variance: number; sd: number; cv: number };

export function median(xs: number[]): number {
  const s = [...xs].sort((a, b) => a - b), n = s.length;
  return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2;
}
export function stats(xs: number[]): Stats {
  const n = xs.length;
  if (!n) return { n: 0, mean: NaN, median: NaN, min: NaN, max: NaN, range: NaN, mdMean: NaN, mdMedian: NaN, variance: NaN, sd: NaN, cv: NaN };
  const mean = xs.reduce((s, x) => s + x, 0) / n, med = median(xs);
  const min = Math.min(...xs), max = Math.max(...xs);
  const mdMean = xs.reduce((s, x) => s + Math.abs(x - mean), 0) / n;
  const mdMedian = xs.reduce((s, x) => s + Math.abs(x - med), 0) / n;
  const variance = xs.reduce((s, x) => s + (x - mean) ** 2, 0) / n, sd = Math.sqrt(variance);
  return { n, mean, median: med, min, max, range: max - min, mdMean, mdMedian, variance, sd, cv: mean !== 0 ? (100 * sd) / mean : NaN };
}

/** Read numbers typed with commas, spaces or new lines. Returns the numbers and any bits that are not numbers. */
export function readData(src: string): { xs: number[]; bad: string[] } {
  const xs: number[] = [], bad: string[] = [];
  for (const t of src.split(/[\s,;]+/).filter(Boolean)) { const v = Number(t); if (Number.isFinite(v)) xs.push(v); else bad.push(t); }
  return { xs, bad };
}

export type Preset = { id: string; label: string; a: number[]; b: number[]; names: [string, string]; unit: string; lo: number; hi: number; note: string };
// Made-up teaching data (not from any survey or book).
export const PRESETS: Preset[] = [
  { id: 'same-mean', label: 'Same mean, different spread', names: ['Class A', 'Class B'], unit: 'marks', lo: 0, hi: 100, a: [46, 48, 50, 50, 52, 54, 50], b: [20, 35, 50, 50, 65, 80, 50], note: 'Both classes average 50, but class B is far more spread out.' },
  { id: 'cricket', label: 'Two batters\' scores', names: ['Batter P', 'Batter Q'], unit: 'runs', lo: 0, hi: 120, a: [12, 85, 4, 66, 30, 102, 9, 48], b: [38, 45, 52, 40, 47, 55, 36, 43], note: 'Both average 44.5 runs, but Q is far more consistent: a much smaller SD and CV.' },
  { id: 'heights', label: 'Heights vs weights', names: ['Heights (cm)', 'Weights (kg)'], unit: '', lo: 0, hi: 180, a: [150, 155, 158, 160, 162, 165, 170], b: [40, 44, 45, 50, 52, 55, 60], note: 'Different units: the SDs cannot be compared directly, but the CVs (in %) can.' },
];
