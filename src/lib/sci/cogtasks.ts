// Classroom cognitive tasks: digit span, Corsi blocks, visual search and simple/choice reaction time.
// Sequence makers and scoring; the page runs the tasks. Plain maths, no DOM.
import { median } from './rtexp.ts';

/** A sequence of `len` items from 0..k−1 (digits use 1..9), never the same item twice in a row; no repeats at all when unique. */
export function sequence(len: number, k: number, rand: () => number, unique = false): number[] {
  if (unique && len > k) throw new Error(`A sequence of ${len} cannot use ${k} different items without repeats.`);
  const out: number[] = [];
  while (out.length < len) {
    const v = Math.floor(rand() * k);
    if (out.length && out[out.length - 1] === v) continue;
    if (unique && out.includes(v)) continue;
    out.push(v);
  }
  return out;
}
export const digits = (len: number, rand: () => number) => sequence(len, 9, rand).map((d) => d + 1);

/** Is the answer right? Backward recall means the sequence reversed. */
export const recallCorrect = (target: number[], answer: number[], backward = false) => {
  const t = backward ? target.slice().reverse() : target;
  return t.length === answer.length && t.every((v, i) => v === answer[i]);
};

export type SpanAttempt = { length: number; correct: boolean };
/**
 * Span scoring with two trials per length, going up one item each time: the task stops when both trials at
 * a length are wrong. span = the longest length with at least one correct trial; total = number of correct
 * trials; product = span × total (Kessels et al. 2000, for Corsi).
 */
export function scoreSpan(a: SpanAttempt[]) {
  const ok = a.filter((x) => x.correct);
  const span = ok.length ? Math.max(...ok.map((x) => x.length)) : 0, total = ok.length;
  return { span, total, product: span * total, trials: a.length };
}
/** What happens next under the two-trials-per-length rule: same length again, the next length, or stop. */
export function nextSpan(a: SpanAttempt[], maxLen: number): { length: number } | null {
  const last = a[a.length - 1];
  if (!last) return null;
  const atLen = a.filter((x) => x.length === last.length);
  if (atLen.length < 2) return { length: last.length };
  if (atLen.every((x) => !x.correct)) return null;
  return last.length >= maxLen ? null : { length: last.length + 1 };
}

export type SearchTrial = { setSize: number; present: boolean; correct: boolean; rt: number | null };
export type Line = { slope: number; intercept: number; r2: number; n: number; seSlope: number };
/** Least squares line y = a + b·x, with the standard error of the slope. */
export function line(x: number[], y: number[]): Line | null {
  const n = x.length;
  if (n < 2 || new Set(x).size < 2) return null;
  const mx = x.reduce((s, v) => s + v, 0) / n, my = y.reduce((s, v) => s + v, 0) / n;
  let sxx = 0, sxy = 0, syy = 0;
  for (let i = 0; i < n; i++) { sxx += (x[i] - mx) ** 2; sxy += (x[i] - mx) * (y[i] - my); syy += (y[i] - my) ** 2; }
  const slope = sxy / sxx, intercept = my - slope * mx, sse = Math.max(0, syy - slope * sxy);
  return { slope, intercept, r2: syy > 0 ? (sxy * sxy) / (sxx * syy) : 1, n, seSlope: n > 2 ? Math.sqrt(sse / (n - 2) / sxx) : NaN };
}

/**
 * Visual search: RT against set size on correct trials (RTs within minRt..maxRt), fitted separately for
 * target-present and target-absent trials. Also mean RT and accuracy for each set size.
 */
export function searchSummary(t: SearchTrial[], minRt = 150, maxRt = 5000) {
  const use = (p: boolean) => t.filter((x) => x.present === p && x.correct && x.rt !== null && x.rt >= minRt && x.rt <= maxRt) as (SearchTrial & { rt: number })[];
  const fit = (p: boolean) => { const u = use(p); return line(u.map((x) => x.setSize), u.map((x) => x.rt)); };
  const sizes = [...new Set(t.map((x) => x.setSize))].sort((a, b) => a - b);
  const cells = sizes.flatMap((s) => [true, false].map((p) => {
    const all = t.filter((x) => x.setSize === s && x.present === p), rts = use(p).filter((x) => x.setSize === s).map((x) => x.rt);
    return { setSize: s, present: p, n: all.length, accuracy: all.length ? all.filter((x) => x.correct).length / all.length : NaN, mean: rts.length ? rts.reduce((a, b) => a + b, 0) / rts.length : NaN, used: rts.length };
  })).filter((c) => c.n);
  const present = fit(true), absent = fit(false);
  return { present, absent, ratio: present && absent ? absent.slope / present.slope : NaN, cells, accuracy: t.length ? t.filter((x) => x.correct).length / t.length : NaN };
}

/** Positions for a search display: `n` items on a jittered grid inside a w × h box, none overlapping. */
export function searchLayout(n: number, rand: () => number, cols = 6, rows = 5): { x: number; y: number }[] {
  if (n > cols * rows) throw new Error(`At most ${cols * rows} items fit.`);
  const cells = sequence(n, cols * rows, rand, true);
  return cells.map((c) => ({ x: ((c % cols) + 0.5 + (rand() - 0.5) * 0.4) / cols, y: ((Math.floor(c / cols)) + 0.5 + (rand() - 0.5) * 0.4) / rows }));
}

export type RtTrial = { kind: 'simple' | 'choice'; foreperiod: number; correct: boolean; rt: number | null; early: boolean };
/** Simple or choice RT: mean, median and SD of correct, on-time RTs; anticipations (below minRt) and false starts counted apart. */
export function rtSummary(t: RtTrial[], minRt = 100, maxRt = 2000) {
  const valid = t.filter((x) => !x.early);
  const rts = valid.filter((x) => x.correct && x.rt !== null && x.rt >= minRt && x.rt <= maxRt).map((x) => x.rt as number);
  const mean = rts.length ? rts.reduce((a, b) => a + b, 0) / rts.length : NaN;
  const sd = rts.length > 1 ? Math.sqrt(rts.reduce((s, x) => s + (x - mean) ** 2, 0) / (rts.length - 1)) : NaN;
  return {
    n: t.length, used: rts.length, mean, median: median(rts), sd, fastest: rts.length ? Math.min(...rts) : NaN,
    falseStarts: t.filter((x) => x.early).length,
    anticipations: valid.filter((x) => x.rt !== null && x.rt < minRt).length,
    errors: valid.filter((x) => !x.correct).length,
    accuracy: valid.length ? valid.filter((x) => x.correct).length / valid.length : NaN,
  };
}
