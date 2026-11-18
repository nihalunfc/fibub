// Tempo matching maths for DJs (plain TypeScript, no DOM). Keys and the tempo-to-pitch formulas live in theory.ts.
import { tempoPercent, tempoSemitones } from './theory.ts';

export const FADER_RANGES = [6, 8, 10, 16, 50];

/** Tap tempo: BPM from the last taps (times in ms). A pause longer than resetMs starts again. */
export function tapTempo(taps: number[], maxTaps = 8): { bpm: number | null; taps: number; stability: number | null } {
  const t = taps.slice(-maxTaps);
  if (t.length < 2) return { bpm: null, taps: t.length, stability: null };
  const gaps = t.slice(1).map((x, i) => x - t[i]), mean = gaps.reduce((a, b) => a + b, 0) / gaps.length;
  const sd = Math.sqrt(gaps.reduce((a, g) => a + (g - mean) ** 2, 0) / gaps.length);
  return { bpm: 60000 / mean, taps: t.length, stability: gaps.length > 1 ? (sd / mean) * 100 : null };
}
/** Add a tap: a gap over resetMs (default 2 s) clears the earlier taps. */
export const addTap = (taps: number[], now: number, resetMs = 2000) => (taps.length && now - taps[taps.length - 1] > resetMs ? [now] : [...taps, now]);

/** Smallest fader range (of FADER_RANGES) that holds a percent change, or null when none does. */
export const fitsRange = (pct: number, range: number) => Math.abs(pct) <= range + 1e-9;

export type Match = { label: string; from: number; pct: number; semitones: number; fits: number[] };
/** Match track A to track B as is, with A read as double time (x2) and half time (/2). */
export function matchOptions(a: number, b: number): Match[] {
  return ([['As it is', 1], ['A as double time (x2)', 2], ['A as half time (/2)', 0.5]] as [string, number][]).map(([label, m]) => {
    const from = a * m, pct = tempoPercent(from, b);
    return { label, from, pct, semitones: tempoSemitones(from, b), fits: FADER_RANGES.filter((r) => fitsRange(pct, r)) };
  });
}
/** Index of the option with the smallest pitch change. */
export const bestOption = (m: Match[]) => m.reduce((bi, x, i) => (Math.abs(x.pct) < Math.abs(m[bi].pct) ? i : bi), 0);

/** BPM at each fader step from -range to +range. */
export function faderTable(bpm: number, range: number, step: number): { pct: number; bpm: number; semitones: number }[] {
  const out = [];
  for (let i = Math.round(-range / step); i <= Math.round(range / step); i++) {
    const pct = Math.round(i * step * 1000) / 1000;
    out.push({ pct, bpm: bpm * (1 + pct / 100), semitones: tempoSemitones(bpm, bpm * (1 + pct / 100)) });
  }
  return out;
}
