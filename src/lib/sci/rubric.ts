// Rubric grading: weighted totals from criterion levels, grade bands from user-defined cut-offs, and a class summary.

export type Level = { name: string; points: number };
export type Criterion = { name: string; weight: number };
export type Band = { grade: string; min: number };

/** "Excellent = 4" or "Excellent 4" lines to levels, highest points first. */
export function parseLevels(text: string): Level[] {
  const out: Level[] = [];
  text.split('\n').map((l) => l.trim()).filter(Boolean).forEach((l, i) => {
    const m = l.match(/^(.*?)[\s:=]+(-?\d+(?:[.,]\d+)?)$/);
    if (!m || !m[1].trim()) throw new Error(`Level line ${i + 1} needs a name and points, such as "Good = 3"`);
    out.push({ name: m[1].trim(), points: Number(m[2].replace(',', '.')) });
  });
  if (out.length < 2) throw new Error('Give at least two levels');
  if (new Set(out.map((l) => l.points)).size !== out.length) throw new Error('Each level needs different points');
  if (!(Math.max(...out.map((l) => l.points)) > 0)) throw new Error('The top level must be worth more than 0 points');
  return out.sort((a, b) => b.points - a.points);
}

/** "A: 90" or "A 90" lines (lowest percentage for that grade) to bands, highest first. */
export function parseBands(text: string): Band[] {
  const out: Band[] = [];
  text.split('\n').map((l) => l.trim()).filter(Boolean).forEach((l, i) => {
    const m = l.match(/^(.*?)[\s:=]+(\d+(?:[.,]\d+)?)\s*%?$/);
    if (!m || !m[1].trim()) throw new Error(`Grade line ${i + 1} needs a grade and the lowest percentage for it, such as "B: 70"`);
    const min = Number(m[2].replace(',', '.'));
    if (min > 100) throw new Error(`Grade ${m[1].trim()}: the cut-off must be 100 % or less`);
    out.push({ grade: m[1].trim(), min });
  });
  if (!out.length) throw new Error('Give at least one grade band');
  if (new Set(out.map((b) => b.min)).size !== out.length) throw new Error('Two grades have the same cut-off');
  return out.sort((a, b) => b.min - a.min);
}

/**
 * A student's weighted percentage: Σ weight × (points / top points) / Σ weight × 100.
 * `scores` holds the points chosen per criterion (NaN when not marked yet); the total needs every criterion.
 */
export function weightedPercent(scores: number[], criteria: Criterion[], top: number): number {
  const W = criteria.reduce((s, c) => s + c.weight, 0);
  if (!(W > 0)) throw new Error('The weights must add up to more than 0');
  if (criteria.some((c) => !(c.weight >= 0))) throw new Error('Weights cannot be negative');
  if (scores.length !== criteria.length || scores.some((x) => !Number.isFinite(x))) return NaN;
  return (100 * criteria.reduce((s, c, i) => s + c.weight * (scores[i] / top), 0)) / W;
}

/** The grade of the highest band whose cut-off the percentage reaches (a tiny tolerance absorbs rounding). */
export function gradeFor(pct: number, bands: Band[]): string {
  if (!Number.isFinite(pct)) return '';
  for (const b of bands) if (pct >= b.min - 1e-9) return b.grade;
  return '';
}

export function summary(values: number[]) {
  const v = values.filter(Number.isFinite).sort((a, b) => a - b), n = v.length;
  if (!n) return { n, mean: NaN, median: NaN, sd: NaN, min: NaN, max: NaN };
  const mean = v.reduce((s, x) => s + x, 0) / n;
  return {
    n, mean, median: n % 2 ? v[(n - 1) / 2] : (v[n / 2 - 1] + v[n / 2]) / 2,
    sd: n > 1 ? Math.sqrt(v.reduce((s, x) => s + (x - mean) ** 2, 0) / (n - 1)) : NaN, min: v[0], max: v[n - 1],
  };
}
