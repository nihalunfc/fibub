// Reaction time experiments (Stroop, flanker, n-back): trial lists and the summary statistics.
// Plain maths, no DOM; the page runs the trials and times them.
import { yesNo } from './sdt.ts';

export type Task = 'stroop' | 'flanker' | 'nback';
export type Stim = { condition: string; stimulus: string; ink?: string; answer: string };
export type Trial = Stim & { task: Task; trial: number; response: string; correct: boolean; rt: number | null };

export const COLOURS = ['red', 'green', 'blue', 'yellow'] as const;
const LETTERS = 'BCDFGHJKLMNPQRSTVWXZ';

/** Fisher-Yates shuffle with the given random source. */
export function shuffle<T>(a: T[], rand: () => number): T[] {
  const b = a.slice();
  for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; }
  return b;
}
/** Exactly round(n·p) trials of the first kind, the rest of the second, in random order. */
const split = (n: number, p: number, rand: () => number) => shuffle(Array.from({ length: n }, (_, i) => i < Math.round(n * p)), rand);

/** Stroop: a colour word in an ink colour; answer the ink. Congruent when word and ink match. */
export function makeStroop(n: number, pCongruent: number, rand: () => number): Stim[] {
  return split(n, pCongruent, rand).map((cong) => {
    const ink = COLOURS[Math.floor(rand() * 4)];
    const others = COLOURS.filter((c) => c !== ink);
    const word = cong ? ink : others[Math.floor(rand() * 3)];
    return { condition: cong ? 'congruent' : 'incongruent', stimulus: word.toUpperCase(), ink, answer: ink };
  });
}

/** Flanker (Eriksen): five arrows; answer the direction of the middle one. */
export function makeFlanker(n: number, pCongruent: number, rand: () => number): Stim[] {
  return split(n, pCongruent, rand).map((cong) => {
    const dir = rand() < 0.5 ? 'left' : 'right', c = dir === 'left' ? '←' : '→', o = dir === 'left' ? '→' : '←', f = cong ? c : o;
    return { condition: cong ? 'congruent' : 'incongruent', stimulus: f + f + c + f + f, answer: dir };
  });
}

/**
 * N-back: a stream of letters; a target is a letter that matches the one n places back.
 * Exactly round((length − n)·rate) targets; other trials never match by accident.
 */
export function makeNback(length: number, level: number, rate: number, rand: () => number): Stim[] {
  if (length <= level) throw new Error(`The stream needs more than ${level} letters.`);
  const isTarget = [...new Array(level).fill(false), ...split(length - level, rate, rand)];
  const s: string[] = [];
  for (let i = 0; i < length; i++) {
    if (isTarget[i]) { s.push(s[i - level]); continue; }
    let L: string;
    do { L = LETTERS[Math.floor(rand() * LETTERS.length)]; } while (i >= level && L === s[i - level]);
    s.push(L);
  }
  return s.map((L, i) => ({ condition: isTarget[i] ? 'target' : i < level ? 'filler' : 'non-target', stimulus: L, answer: isTarget[i] ? 'match' : 'none' }));
}

export type CondStats = { condition: string; n: number; correct: number; accuracy: number; used: number; excluded: number; mean: number; median: number; sd: number; se: number; ies: number };
export type Summary = {
  task: Task; n: number; accuracy: number; conds: CondStats[];
  effect: { rt: number; median: number; accuracy: number } | null;
  nback: { hits: number; misses: number; fas: number; crs: number; H: number; F: number; dprime: number; c: number } | null;
  excluded: number; fast: number; slow: number; sdOut: number;
};

const meanOf = (a: number[]) => (a.length ? a.reduce((s, x) => s + x, 0) / a.length : NaN);
export function median(a: number[]) {
  if (!a.length) return NaN;
  const s = a.slice().sort((x, y) => x - y), m = s.length >> 1;
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}
const sdOf = (a: number[]) => { if (a.length < 2) return NaN; const m = meanOf(a); return Math.sqrt(a.reduce((s, x) => s + (x - m) ** 2, 0) / (a.length - 1)); };

/**
 * Summary of a run. RTs use correct trials only (hits for n-back), between minRt and maxRt ms;
 * with sdCut, RTs more than sdCut standard deviations from their condition mean are dropped too (one pass).
 * Accuracy counts every trial (no answer = wrong). Fillers (the first n n-back letters) are left out.
 */
export function summarise(trials: Trial[], opts: { minRt?: number; maxRt?: number; sdCut?: number | null } = {}): Summary {
  const minRt = opts.minRt ?? 150, maxRt = opts.maxRt ?? 3000, sdCut = opts.sdCut ?? null;
  if (!trials.length) throw new Error('There are no trials to summarise yet.');
  const task = trials[0].task;
  const T = trials.filter((t) => t.condition !== 'filler');
  const order = task === 'nback' ? ['target', 'non-target'] : ['congruent', 'incongruent', 'neutral'];
  const names = [...new Set(T.map((t) => t.condition))].sort((a, b) => (order.indexOf(a) + 99 * +(order.indexOf(a) < 0)) - (order.indexOf(b) + 99 * +(order.indexOf(b) < 0)));
  let fast = 0, slow = 0, sdOut = 0;
  const conds = names.map((condition) => {
    const all = T.filter((t) => t.condition === condition), ok = all.filter((t) => t.correct);
    // For n-back non-targets the correct answer is no response, so there is no RT to use.
    const timed = ok.filter((t) => t.rt !== null) as (Trial & { rt: number })[];
    let rts = timed.map((t) => t.rt).filter((r) => { if (r < minRt) { fast++; return false; } if (r > maxRt) { slow++; return false; } return true; });
    if (sdCut && rts.length > 2) { const m = meanOf(rts), s = sdOf(rts); const kept = rts.filter((r) => Math.abs(r - m) <= sdCut * s); sdOut += rts.length - kept.length; rts = kept; }
    const accuracy = ok.length / all.length, mean = meanOf(rts), sd = sdOf(rts);
    return { condition, n: all.length, correct: ok.length, accuracy, used: rts.length, excluded: timed.length - rts.length, mean, median: median(rts), sd, se: sd / Math.sqrt(rts.length), ies: mean / accuracy };
  });
  const by = (c: string) => conds.find((x) => x.condition === c);
  const con = by('congruent'), inc = by('incongruent');
  const effect = con && inc ? { rt: inc.mean - con.mean, median: inc.median - con.median, accuracy: inc.accuracy - con.accuracy } : null;
  let nback: Summary['nback'] = null;
  if (task === 'nback') {
    const tg = T.filter((t) => t.condition === 'target'), nt = T.filter((t) => t.condition === 'non-target');
    const hits = tg.filter((t) => t.response === 'match').length, fas = nt.filter((t) => t.response === 'match').length;
    if (tg.length && nt.length) {
      const r = yesNo({ hits, misses: tg.length - hits, fas, crs: nt.length - fas }, 'loglinear');
      nback = { hits, misses: tg.length - hits, fas, crs: nt.length - fas, H: r.H, F: r.F, dprime: r.dprime, c: r.c };
    }
  }
  return { task, n: T.length, accuracy: T.filter((t) => t.correct).length / T.length, conds, effect, nback, excluded: fast + slow + sdOut, fast, slow, sdOut };
}

/** Trials as CSV rows (header first). */
export function trialRows(trials: Trial[]): (string | number)[][] {
  return [['task', 'trial', 'condition', 'stimulus', 'ink', 'correct_answer', 'response', 'correct', 'rt_ms'],
    ...trials.map((t) => [t.task, t.trial, t.condition, t.stimulus, t.ink ?? '', t.answer, t.response, t.correct ? 1 : 0, t.rt === null ? '' : Math.round(t.rt * 10) / 10])];
}
