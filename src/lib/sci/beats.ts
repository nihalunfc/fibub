// Beats for the school beats-lab tool: two close tones added together, the beat frequency |f₁ − f₂|, the
// envelope of the sum, and the classic "find the unknown tuning fork" puzzle with wax loading. Plain TypeScript.
import { type Question, pick, one, n } from './h4quiz.ts';

/** The two waves and their sum at time t (s); amplitudes 1 and a. */
export const wave = (f: number, t: number, amp = 1) => amp * Math.sin(2 * Math.PI * f * t);
export const sum = (f1: number, f2: number, t: number, a = 1) => wave(f1, t) + wave(f2, t, a);
/** Envelope (the loudness swell) of the sum: √(1 + a² + 2a cos 2πΔf t). */
export const envelope = (f1: number, f2: number, t: number, a = 1) => Math.sqrt(1 + a * a + 2 * a * Math.cos(2 * Math.PI * (f1 - f2) * t));
export function beats(f1: number, f2: number) {
  const fb = Math.abs(f1 - f2);
  return { fb, period: fb > 0 ? 1 / fb : Infinity, mean: (f1 + f2) / 2 };
}

/** Find-the-fork puzzle: a known fork f0 and an unknown fu. Wax on the unknown lowers it by `wax` Hz. */
export function forkPuzzle(f0: number, fu: number, wax: number) {
  const before = Math.abs(fu - f0), after = Math.abs(fu - wax - f0);
  return { before, after, answer: fu, verdict: after > before ? 'more' : after < before ? 'fewer' : 'same' } as const;
}
/** The two candidates from the beats alone, and which one the wax test picks. */
export function solvePuzzle(f0: number, beatsBefore: number, beatsAfterWax: number) {
  const hi = f0 + beatsBefore, lo = f0 - beatsBefore;
  // wax lowers the unknown: if it was above f0, beats fall (until it passes f0); if below, beats rise
  return { hi, lo, pick: beatsAfterWax < beatsBefore ? hi : lo };
}

// ---- Check yourself ---------------------------------------------------------------------------------
export function questions(rng: () => number = Math.random): Question[] {
  const qs: Question[] = [];
  { const f1 = pick(rng, 250, 520), d = pick(rng, 2, 8), f2 = f1 + d;
    qs.push({ text: `Two tuning forks of ${f1} Hz and ${f2} Hz are struck together. How many beats are heard each second?`, ans: d, unit: 'beats/s', work: `Beat frequency = |f₁ − f₂| = ${f2} − ${f1} = ${d} per second.`, tol: 0.01 }); }
  { const d = one(rng, [2, 4, 5, 8, 10]);
    qs.push({ text: `Two notes give ${d} beats per second. How long, in seconds, is one beat (loud to loud)?`, ans: 1 / d, unit: 's', work: `Beat period = 1 ÷ ${d} = ${n(1 / d, 3)} s.`, tol: 0.005 }); }
  { const f1 = pick(rng, 200, 500), d = pick(rng, 2, 6), f2 = f1 + d;
    qs.push({ text: `What pitch, in Hz, do you hear when ${f1} Hz and ${f2} Hz are played together (the note that swells and fades)?`, ans: (f1 + f2) / 2, unit: 'Hz', work: `The sum is a wave at the average frequency (${f1} + ${f2}) ÷ 2 = ${n((f1 + f2) / 2, 1)} Hz, whose loudness swells ${d} times a second.`, tol: 0.05 }); }
  { const f0 = one(rng, [256, 288, 320, 384, 512]), b = pick(rng, 3, 6), up = rng() < 0.5, fu = up ? f0 + b : f0 - b;
    qs.push({ text: `A fork of ${f0} Hz and an unknown fork give ${b} beats per second. Wax on the unknown fork makes the beats ${up ? 'fewer' : 'more'}. What is the unknown frequency, in Hz?`, ans: fu, unit: 'Hz', work: `From the beats it is ${f0} ± ${b} = ${f0 - b} or ${f0 + b} Hz. Wax lowers its frequency; the beats ${up ? 'fall, so it was moving towards ' + f0 + ': it was above, ' + (f0 + b) : 'rise, so it was moving away from ' + f0 + ': it was below, ' + (f0 - b)} Hz.`, tol: 0.01 }); }
  return qs;
}
