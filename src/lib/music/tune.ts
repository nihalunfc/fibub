// Pitch editor maths (#T1019): split a pitch track into notes, snap notes to a scale, and work out the correction
// in cents for every frame, with strength, retune time and an option to keep vibrato. Plain TypeScript, no DOM.
// Checks in tests/audio-psola.mjs.
import { freqToMidi, mod12, type Key } from './theory.ts';
import { keyFromChroma } from './analyse.ts';

/** A note: frames a to b (b not included), its sung pitch (median, MIDI, fractional) and where it should go. */
export type Note = { a: number; b: number; midi: number; target: number; manual: boolean };

const median = (v: number[]) => { const s = v.slice().sort((a, b) => a - b), h = s.length >> 1; return s.length % 2 ? s[h] : (s[h - 1] + s[h]) / 2; };

/**
 * Notes from a pitch track (Hz per frame, 0 = unvoiced): each run of voiced frames, split where the pitch moves more
 * than `jump` semitones from the note so far for at least 3 frames (so vibrato does not split a note). Runs shorter
 * than `minSecs` are left out. target starts at the rounded pitch.
 */
export function splitNotes(f0: Float32Array, hop: number, a4 = 440, jump = 0.8, minSecs = 0.06): Note[] {
  const out: Note[] = [], n = f0.length, minF = Math.max(1, Math.round(minSecs / hop));
  const m = Array.from(f0, (f) => (f > 0 ? freqToMidi(f, a4) : NaN));
  const push = (a: number, b: number) => { if (b - a >= minF) { const md = median(m.slice(a, b)); out.push({ a, b, midi: md, target: Math.round(md), manual: false }); } };
  let i = 0;
  while (i < n) {
    if (isNaN(m[i])) { i++; continue; }
    let a = i, j = i;
    while (j < n && !isNaN(m[j])) {
      // Running median of the note so far (last 15 frames), and whether the next 3 frames all leave it.
      const ref = median(m.slice(Math.max(a, j - 15), j + 1));
      let leave = j + 3 < n && j - a >= minF;
      for (let k = 1; k <= 3 && leave; k++) if (isNaN(m[j + k]) || Math.abs(m[j + k] - ref) <= jump) leave = false;
      j++;
      if (leave) { push(a, j); a = j; }
    }
    push(a, j); i = j;
  }
  return out;
}

/** The scale note (MIDI) nearest to `midi` in the scale with this tonic (0 = C) and steps; ties go down. */
export function snapTarget(midi: number, tonic: number, steps: number[]): number {
  let best = Math.round(midi), bd = Infinity;
  for (let m = Math.floor(midi) - 3; m <= Math.ceil(midi) + 3; m++) {
    if (!steps.includes(mod12(m - tonic))) continue;
    const d = Math.abs(m - midi);
    if (d < bd - 1e-9) { bd = d; best = m; }
  }
  return best;
}

export type CorrectOpts = { strength: number; retuneMs: number; keepVibrato: boolean };

/**
 * Correction in cents for each frame. Inside a note it heads for strength × (target − pitch) (pitch = the note's
 * median with keepVibrato, so wobbles stay; the frame's own pitch without, so they are ironed out). Notes moved by
 * hand use full strength. Outside notes it heads for 0. The retune time is the time constant of a one-pole smoother:
 * after retuneMs the correction has come 63% of the way.
 */
export function correction(f0: Float32Array, hop: number, notes: Note[], o: CorrectOpts, a4 = 440): Float32Array {
  const n = f0.length, want = new Float32Array(n), out = new Float32Array(n);
  for (const nt of notes) {
    const s = nt.manual ? 1 : Math.max(0, Math.min(1, o.strength));
    for (let i = nt.a; i < Math.min(n, nt.b); i++) {
      const p = o.keepVibrato || !(f0[i] > 0) ? nt.midi : freqToMidi(f0[i], a4);
      want[i] = s * (nt.target - p) * 100;
    }
  }
  const alpha = o.retuneMs <= 0 ? 1 : 1 - Math.exp(-(hop * 1000) / o.retuneMs);
  let c = 0;
  for (let i = 0; i < n; i++) { c += alpha * (want[i] - c); out[i] = Math.abs(c) < 1e-6 ? 0 : c; }
  return out;
}

/** The key that best fits the notes (each weighted by its length), or null. */
export function detectKey(notes: Note[]): Key | null {
  const chroma = new Float64Array(12);
  for (const nt of notes) chroma[mod12(Math.round(nt.midi))] += nt.b - nt.a;
  return keyFromChroma(chroma)?.key ?? null;
}
