// Standing waves on stretched strings and in air columns (pipes): harmonic series, end corrections, and the tension or
// length needed for a target note. No DOM.

export type PipeKind = 'open' | 'closed-open' | 'closed';
export type EndKind = 'unflanged' | 'flanged' | 'none';

/** End correction per open end as a multiple of the radius: Levine and Schwinger (1948) 0.6133 for an unflanged pipe, 0.8216 for a flanged one. */
export const END_FACTOR: Record<EndKind, number> = { unflanged: 0.6133, flanged: 0.8216, none: 0 };

/** Mass per unit length (kg/m) of a solid round string of diameter d (m) and density rho (kg/m³). */
export const muFromDiameter = (d: number, rho: number) => (rho * Math.PI * d * d) / 4;

/** Transverse wave speed on a string, v = √(T/μ). */
export const stringSpeed = (T: number, mu: number) => Math.sqrt(T / mu);

/** n-th harmonic of a string fixed at both ends: f = n v / 2L. */
export const stringHarmonic = (n: number, L: number, T: number, mu: number) => (n * stringSpeed(T, mu)) / (2 * L);

/** Tension (N) for fundamental f on a string of length L and mass per length mu: T = μ (2 L f)². */
export const tensionFor = (f: number, L: number, mu: number) => mu * (2 * L * f) ** 2;

/** Number of open ends of a pipe type. */
export const openEnds = (k: PipeKind) => (k === 'open' ? 2 : k === 'closed-open' ? 1 : 0);

/** Acoustic (effective) length: the physical length plus an end correction at each open end. */
export const effLength = (k: PipeKind, L: number, radius: number, end: EndKind) => L + openEnds(k) * END_FACTOR[end] * radius;

/**
 * The m-th resonance (m = 1, 2, 3 …) of a pipe and its harmonic number: open-open and closed-closed give every
 * harmonic n = m, f = n c / 2L'; closed at one end gives odd harmonics n = 2m − 1, f = n c / 4L'.
 */
export function pipeResonance(m: number, k: PipeKind, L: number, radius: number, end: EndKind, c: number) {
  const Le = effLength(k, L, radius, end);
  if (k === 'closed-open') { const n = 2 * m - 1; return { n, f: (n * c) / (4 * Le), lambda: (4 * Le) / n }; }
  return { n: m, f: (m * c) / (2 * Le), lambda: (2 * Le) / m };
}

/** Physical pipe length for a fundamental f (may be ≤ 0 if the end corrections are longer than the needed length). */
export function lengthFor(f: number, k: PipeKind, radius: number, end: EndKind, c: number) {
  const Le = k === 'closed-open' ? c / (4 * f) : c / (2 * f);
  return Le - openEnds(k) * END_FACTOR[end] * radius;
}

const STEP: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
/** A note such as "A4", "C#3", "Bb2", "F♯5", or a plain frequency in Hz, as a frequency (A4 = a4). NaN if not understood. */
export function parsePitch(s: string, a4 = 440) {
  const t = s.trim().replace(/♯/g, '#').replace(/♭/g, 'b');
  const m = t.match(/^([A-Ga-g])(#|b)?(-?\d)$/);
  if (m) {
    const midi = 12 * (Number(m[3]) + 1) + STEP[m[1].toUpperCase()] + (m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0);
    return a4 * Math.pow(2, (midi - 69) / 12);
  }
  const v = Number(t.replace(/\s*hz$/i, '').replace(',', '.'));
  return t && Number.isFinite(v) && v > 0 ? v : NaN;
}
