// Grade maths shared by the final-grade and weighted-grade calculators. Plain TypeScript, no DOM.

/** Letter scales: lowest percent for each label, highest first. These are common defaults, not rules: every school differs. */
export const SCALES: Record<string, { name: string; cuts: [string, number][]; below: string }> = {
  simple: { name: 'Simple A to D (90, 80, 70, 60)', cuts: [['A', 90], ['B', 80], ['C', 70], ['D', 60]], below: 'F' },
  plusminus: {
    name: 'Plus and minus (A 93, A- 90, B+ 87 ...)',
    cuts: [['A', 93], ['A-', 90], ['B+', 87], ['B', 83], ['B-', 80], ['C+', 77], ['C', 73], ['C-', 70], ['D+', 67], ['D', 63], ['D-', 60]], below: 'F',
  },
  uk: { name: 'UK degree classes (70, 60, 50, 40)', cuts: [['First', 70], ['2:1', 60], ['2:2', 50], ['Third', 40]], below: 'Fail' },
};

/** Final exam score (percent) needed to finish on `target`, given the grade before the final and the final's weight (percent). */
export const neededOnFinal = (cur: number, weight: number, target: number) => (target - cur * (1 - weight / 100)) / (weight / 100);
/** Course grade after scoring `score` on the final. */
export const afterFinal = (cur: number, weight: number, score: number) => cur * (1 - weight / 100) + score * (weight / 100);

/** Letter for a percent using a list of [label, cut] (highest first, as typed); `below` when under every cut. */
export function letterFor(p: number, cuts: [string, number][], below: string) {
  for (const [g, c] of cuts) if (Number.isFinite(c) && p + 1e-9 >= c) return g;
  return below;
}

/** Read a score: "90" or "90%" is a percent, "45/50" is points out of points. null = blank, undefined = unreadable. */
export function parseScore(s: string): number | null | undefined {
  const t = s.trim().replace(/%$/, '').trim(); if (t === '') return null;
  const num = (x: string) => Number(x.trim().replace(',', '.'));
  const m = t.match(/^([\d.,]+)\s*\/\s*([\d.,]+)$/);
  if (m) { const a = num(m[1]), b = num(m[2]); return b > 0 && Number.isFinite(a) && a >= 0 ? (a / b) * 100 : undefined; }
  const v = num(t); return Number.isFinite(v) && v >= 0 ? v : undefined;
}
/** Several scores in one box, separated by spaces or semicolons ("90 85 45/50"): returns each percent, or undefined when any is unreadable. */
export function parseScoreList(s: string): number[] | null | undefined {
  const parts = s.split(/[;\s]+/).filter(Boolean);
  if (!parts.length) return null;
  const out: number[] = [];
  for (const p of parts) { const v = parseScore(p); if (typeof v !== 'number') return undefined; out.push(v); }
  return out;
}
/** Average of a list after dropping the lowest `drop` (never dropping the last remaining score). */
export function categoryAverage(scores: number[], drop: number) {
  const sorted = [...scores].sort((a, b) => a - b), d = Math.min(Math.max(0, Math.floor(drop)), sorted.length - 1);
  const kept = sorted.slice(d);
  return { avg: kept.reduce((a, b) => a + b, 0) / kept.length, dropped: sorted.slice(0, d) };
}
/** Average score the remaining items need so the course ends on `target`. */
export const neededOnRest = (sumScoreWeight: number, doneWeight: number, restWeight: number, target: number) => (target * (doneWeight + restWeight) - sumScoreWeight) / restWeight;
