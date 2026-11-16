// Pitch of a sound (YIN, de Cheveigné and Kawahara 2002) and the nearest note. Plain TypeScript, no DOM.
export const NOTE_NAMES = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];

/** Fundamental frequency in Hz of one frame, or 0 if there is no clear pitch. */
export function yin(x: Float32Array, rate: number, minHz = 40, maxHz = 2000, threshold = 0.12): { hz: number; clarity: number } {
  const maxT = Math.min(Math.floor(rate / minHz), Math.floor(x.length / 2)), minT = Math.max(2, Math.floor(rate / maxHz));
  const W = x.length - maxT;
  if (W < 32) return { hz: 0, clarity: 0 };
  let e = 0; for (let i = 0; i < W; i++) e += x[i] * x[i];
  if (e / W < 1e-7) return { hz: 0, clarity: 0 }; // too quiet
  const d = new Float32Array(maxT + 1);
  for (let t = 1; t <= maxT; t++) { let s = 0; for (let i = 0; i < W; i++) { const v = x[i] - x[i + t]; s += v * v; } d[t] = s; }
  // Cumulative mean normalised difference.
  const c = new Float32Array(maxT + 1); c[0] = 1; let run = 0;
  for (let t = 1; t <= maxT; t++) { run += d[t]; c[t] = run ? (d[t] * t) / run : 1; }
  let tau = -1;
  for (let t = minT; t <= maxT; t++) if (c[t] < threshold) { while (t + 1 <= maxT && c[t + 1] < c[t]) t++; tau = t; break; }
  if (tau < 0) return { hz: 0, clarity: 0 };
  // Parabolic interpolation around the dip for sub-sample accuracy.
  const b = c[tau], a = d[tau - 1] ?? d[tau], m = d[tau], g = d[tau + 1] ?? d[tau], den = a - 2 * m + g;
  const shift = den ? (0.5 * (a - g)) / den : 0;
  return { hz: rate / (tau + Math.max(-1, Math.min(1, shift))), clarity: 1 - b };
}

/** The nearest equal-tempered note to hz, with the octave (A4 = a4 Hz) and how far off in cents. */
export function nearestNote(hz: number, a4 = 440): { name: string; octave: number; cents: number; target: number; midi: number } {
  const n = 12 * Math.log2(hz / a4) + 69, midi = Math.round(n);
  return { name: NOTE_NAMES[((midi % 12) + 12) % 12], octave: Math.floor(midi / 12) - 1, cents: (n - midi) * 100, target: a4 * Math.pow(2, (midi - 69) / 12), midi };
}
