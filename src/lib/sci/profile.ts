// Column profiles for a table of text cells: type, missing values, distinct values, range and the most common values.

export const MISSING = new Set(['', 'NA', 'N/A', 'n/a', 'NaN', 'null', 'NULL', 'None', '#N/A']);
const INT = /^[-+]?(0|[1-9]\d*)$/, REAL = /^[-+]?((0|[1-9]\d*)(\.\d+)?|\.\d+)([eE][-+]?\d+)?$/;

export type ColProfile = { name: string; type: 'INTEGER' | 'REAL' | 'TEXT'; count: number; missing: number; distinct: number; min?: number | string; max?: number | string; mean?: number; sd?: number; top: [string, number][] };

/** Numbers with leading zeros (ZIP codes, IDs like 007) stay text, so nothing is lost. */
export function profile(head: string[], rows: string[][]): ColProfile[] {
  return head.map((name, j) => {
    let missing = 0, isInt = true, isReal = true, n = 0, sum = 0, sum2 = 0, min = Infinity, max = -Infinity;
    const freq = new Map<string, number>();
    for (const r of rows) {
      const v = (r[j] ?? '').trim();
      if (MISSING.has(v)) { missing++; continue; }
      freq.set(v, (freq.get(v) ?? 0) + 1);
      if (isInt && !INT.test(v)) isInt = false;
      if (isReal && !REAL.test(v)) isReal = false;
      if (isReal) { const x = Number(v); n++; sum += x; sum2 += x * x; if (x < min) min = x; if (x > max) max = x; }
    }
    const count = rows.length - missing, type = count && isInt && isReal ? 'INTEGER' : count && isReal ? 'REAL' : 'TEXT';
    const top = [...freq.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3);
    const p: ColProfile = { name, type, count, missing, distinct: freq.size, top };
    if (type !== 'TEXT' && n) { p.min = min; p.max = max; p.mean = sum / n; p.sd = n > 1 ? Math.sqrt(Math.max(0, (sum2 - (sum * sum) / n) / (n - 1))) : NaN; }
    else if (freq.size) { const keys = [...freq.keys()].sort(); p.min = keys[0]; p.max = keys[keys.length - 1]; }
    return p;
  });
}
/** A value for SQLite: null for missing, a number for numeric columns, text otherwise. */
export const cell = (v: string | undefined, type: ColProfile['type']) => { const s = (v ?? '').trim(); return MISSING.has(s) ? null : type === 'TEXT' ? (v ?? '') : Number(s); };
/** A safe, unique SQL table name from a file name. */
export function tableName(file: string, taken: Set<string>) {
  let b = file.replace(/\.[^.]+$/, '').toLowerCase().replace(/[^a-z0-9_]+/g, '_').replace(/^_+|_+$/g, '') || 'data';
  if (/^\d/.test(b)) b = 't_' + b;
  let n = b, i = 2; while (taken.has(n)) n = `${b}_${i++}`;
  return n;
}
/** Unique, non-empty column names. */
export function columnNames(head: string[]) {
  const seen = new Set<string>();
  return head.map((h, i) => { let b = h.trim() || `column${i + 1}`, n = b, k = 2; while (seen.has(n.toLowerCase())) n = `${b}_${k++}`; seen.add(n.toLowerCase()); return n; });
}
