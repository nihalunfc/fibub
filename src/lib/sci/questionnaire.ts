// Questionnaire scoring: reverse-keyed items, subscale sums or means, a missing-answer rule (score a
// person only if enough of a subscale's items are answered, prorating sums), and Cronbach's alpha per subscale.
import { cronbach } from './reliability.ts';

export type ScaleDef = { name: string; items: number[] };
export type ScoreOptions = {
  /** Lowest and highest possible answer (for reverse keying and range checks). */
  min: number; max: number;
  /** Column indices of reverse-keyed items, scored as min + max − answer. */
  reverse: number[];
  method: 'sum' | 'mean';
  /** Smallest share (0 to 1) of a subscale's items a person must answer to get a score. */
  minAnswered: number;
};
export type ScaleResult = {
  name: string; items: number[];
  /** One score per person; NaN when too few items were answered. */
  scores: number[];
  answered: number[];
  scored: number; prorated: number; mean: number; sd: number; lo: number; hi: number;
  /** Cronbach's alpha on the people who answered every item of the subscale (NaN if not computable). */
  alpha: number; alphaCi: [number, number]; alphaN: number;
};

export const reverseScore = (x: number, min: number, max: number) => min + max - x;

/** Item list text such as "Q1, Q3-Q5, 7, 9-11" to column indices, using names or 1-based numbers. */
export function parseItems(text: string, names: string[]): number[] {
  const out: number[] = [];
  const find = (t: string) => {
    const byName = names.findIndex((n) => n.trim().toLowerCase() === t.toLowerCase());
    if (byName >= 0) return byName;
    if (/^\d+$/.test(t)) { const j = Number(t) - 1; if (j >= 0 && j < names.length) return j; }
    return -1;
  };
  const one = (raw: string): boolean => {
    const j = find(raw);
    if (j >= 0) { out.push(j); return true; }
    const m = raw.match(/^(.+?)\s*[-–]\s*(.+)$/);
    if (m) {
      const a = find(m[1].trim()), b = find(m[2].trim());
      if (a >= 0 && b >= 0) { for (let k = Math.min(a, b); k <= Math.max(a, b); k++) out.push(k); return true; }
    }
    return false;
  };
  for (const part of text.split(/[,;]+/).map((s) => s.trim()).filter(Boolean)) {
    if (one(part)) continue;
    // "Q1 Q2 Q5-Q7": items separated by spaces.
    for (const w of part.replace(/\s*[-–]\s*/g, '-').split(/\s+/)) if (!one(w)) throw new Error(`"${w}" is not a column name or number`);
  }
  return [...new Set(out)];
}

/** Score every subscale. X: people × items, NaN for a missing answer. */
export function scoreScales(X: number[][], scales: ScaleDef[], o: ScoreOptions): ScaleResult[] {
  if (!(o.max > o.min)) throw new Error('The highest answer must be above the lowest');
  if (!(o.minAnswered > 0 && o.minAnswered <= 1)) throw new Error('The share of items needed must be above 0 % and at most 100 %');
  const rev = new Set(o.reverse);
  for (let i = 0; i < X.length; i++) for (let j = 0; j < X[i].length; j++) {
    const v = X[i][j];
    if (Number.isFinite(v) && (v < o.min || v > o.max)) throw new Error(`Row ${i + 1} has ${v}, outside the answer range ${o.min} to ${o.max}`);
  }
  const Y = X.map((r) => r.map((v, j) => (rev.has(j) && Number.isFinite(v) ? reverseScore(v, o.min, o.max) : v)));
  return scales.map((s) => {
    if (!s.items.length) throw new Error(`Subscale "${s.name}" has no items`);
    const k = s.items.length, need = Math.ceil(o.minAnswered * k - 1e-9);
    let prorated = 0;
    const answered: number[] = [], scores = Y.map((r) => {
      const vals = s.items.map((j) => r[j]).filter((v) => Number.isFinite(v));
      answered.push(vals.length);
      if (!vals.length || vals.length < need) return NaN;
      const m = vals.reduce((a, b) => a + b, 0) / vals.length;
      if (vals.length < k && o.method === 'sum') prorated++;
      return o.method === 'mean' ? m : m * k;
    });
    const ok = scores.filter(Number.isFinite), n = ok.length;
    const mean = n ? ok.reduce((a, b) => a + b, 0) / n : NaN;
    const sd = n > 1 ? Math.sqrt(ok.reduce((a, b) => a + (b - mean) ** 2, 0) / (n - 1)) : NaN;
    let alpha = NaN, alphaCi: [number, number] = [NaN, NaN], alphaN = 0;
    if (k >= 2) {
      try { const c = cronbach(Y.map((r) => s.items.map((j) => r[j]))); alpha = c.alpha; alphaCi = c.ci; alphaN = c.n; } catch { /* too few complete rows */ }
    }
    return { name: s.name, items: s.items, scores, answered, scored: n, prorated, mean, sd, lo: n ? Math.min(...ok) : NaN, hi: n ? Math.max(...ok) : NaN, alpha, alphaCi, alphaN };
  });
}
