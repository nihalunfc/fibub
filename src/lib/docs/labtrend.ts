// Trend arithmetic for the lab results tracker: plain TypeScript, no DOM. Uses only numbers the person typed, including the range printed on their own report.
export interface Pt { date: string; value: number; low: number | null; high: number | null }

/** Where a result sits against the range printed on that report. Empty when no range was printed. */
export function where(v: number, low: number | null, high: number | null): string {
  if (low !== null && v < low) return 'below the printed range';
  if (high !== null && v > high) return 'above the printed range';
  if (low !== null || high !== null) return 'inside the printed range';
  return '';
}

const num = (x: number) => String(+x.toPrecision(4));

/** One plain sentence about results in date order: how many, first to latest, the change, and how many were outside their printed range. */
export function summarise(pts: Pt[]): string {
  if (!pts.length) return '';
  const n = pts.length, first = pts[0], last = pts[n - 1];
  const outside = pts.filter((p) => { const w = where(p.value, p.low, p.high); return w.startsWith('below') || w.startsWith('above'); }).length;
  const tail = ` ${outside} of ${n} outside the range printed on their own report. Not medical advice.`;
  if (n === 1) return `1 result (${num(first.value)} on ${first.date}).${tail}`;
  const d = last.value - first.value;
  const pct = first.value !== 0 ? ` (${d >= 0 ? '+' : '−'}${num(Math.abs(d / first.value) * 100)}%)` : '';
  const dir = d === 0 ? 'no change' : `${d > 0 ? 'up' : 'down'} ${num(Math.abs(d))}${pct}`;
  return `${n} results, from ${num(first.value)} on ${first.date} to ${num(last.value)} on ${last.date}: ${dir}.${tail}`;
}
