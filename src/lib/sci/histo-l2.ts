// School maths (Class 9 data): group raw data into equal classes of a chosen width, then the histogram bars, the
// frequency polygon points and the summary numbers (mean, median, mode, grouped mean). No DOM.

export type Klass = { lo: number; hi: number; f: number; mark: number };

/** Read numbers separated by commas, spaces or new lines. Returns the numbers and the first bad piece, if any. */
export function parseData(text: string): { data: number[]; bad?: string } {
  const parts = text.replace(/−/g, '-').split(/[\s,;]+/).filter(Boolean);
  const data: number[] = [];
  for (const p of parts) { const v = Number(p); if (!Number.isFinite(v)) return { data, bad: p }; data.push(v); }
  return { data };
}

/**
 * Equal classes [lo, lo + width) starting at `start` that cover every value. A value equal to an upper limit goes
 * in the next class (the usual school rule for continuous classes like 10-20, 20-30).
 */
export function group(data: number[], start: number, width: number): Klass[] {
  if (!(width > 0) || !data.length) return [];
  const max = Math.max(...data), min = Math.min(...data);
  if (start > min) start = min;
  const n = Math.floor((max - start) / width + 1e-9) + 1;
  const out: Klass[] = [];
  for (let i = 0; i < n; i++) {
    const lo = round(start + i * width), hi = round(start + (i + 1) * width);
    out.push({ lo, hi, f: 0, mark: round((lo + hi) / 2) });
  }
  for (const v of data) {
    let i = Math.floor((v - start) / width + 1e-9);
    if (i >= n) i = n - 1;
    out[i].f++;
  }
  return out;
}

const round = (x: number) => Math.round(x * 1e9) / 1e9;

/** Frequency polygon: class marks at the bar tops, closed with an empty class at each end. */
export function polygon(classes: Klass[]): { x: number; y: number }[] {
  if (!classes.length) return [];
  const w = classes[0].hi - classes[0].lo;
  return [{ x: round(classes[0].mark - w), y: 0 }, ...classes.map((c) => ({ x: c.mark, y: c.f })), { x: round(classes.at(-1)!.mark + w), y: 0 }];
}

export function mean(data: number[]): number { return data.reduce((s, v) => s + v, 0) / data.length; }

export function median(data: number[]): number {
  const s = [...data].sort((a, b) => a - b), n = s.length;
  return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2;
}

/** Every value that occurs most often (empty if every value occurs once). */
export function modes(data: number[]): number[] {
  const m = new Map<number, number>();
  for (const v of data) m.set(v, (m.get(v) ?? 0) + 1);
  const top = Math.max(...m.values());
  if (top < 2) return [];
  return [...m].filter(([, c]) => c === top).map(([v]) => v).sort((a, b) => a - b);
}

/** Mean from the table alone: Σ f·x / Σ f with x the class marks. */
export function groupedMean(classes: Klass[]): number {
  const n = classes.reduce((s, c) => s + c.f, 0);
  return classes.reduce((s, c) => s + c.f * c.mark, 0) / n;
}

/** Classes with the highest frequency. */
export function modalClasses(classes: Klass[]): Klass[] {
  const top = Math.max(...classes.map((c) => c.f));
  return classes.filter((c) => c.f === top);
}

/** A tidy default start: the biggest multiple of the width that is not above the smallest value. */
export function niceStart(data: number[], width: number): number {
  return round(Math.floor(Math.min(...data) / width + 1e-9) * width);
}

/** Combined mean of groups: (n1·m1 + n2·m2 + …) / (n1 + n2 + …). */
export function combinedMean(groups: { n: number; mean: number }[]): number {
  const n = groups.reduce((s, g) => s + g.n, 0);
  return groups.reduce((s, g) => s + g.n * g.mean, 0) / n;
}
