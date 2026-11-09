// Sampling and aliasing: where a sampled sine appears, its Nyquist zone, the alias through the same samples and the
// ideal (Whittaker-Shannon sinc) reconstruction. Plain TypeScript, no DOM; checked in tests/sci-tools/aliasing-demo.mjs
// against the peak of numpy's FFT of the sampled sine.

export type Alias = {
  /** Signed apparent frequency f − k·fs, between −fs/2 and fs/2 (negative: the alias runs backwards, phase flipped). */
  signed: number;
  /** Apparent (folded) frequency |f − k·fs|, between 0 and fs/2. */
  apparent: number;
  /** k: the nearest whole multiple of the sample rate. */
  k: number;
  /** Nyquist zone: 1 for 0 to fs/2, 2 for fs/2 to fs, and so on. */
  zone: number;
  /** Even zones are mirrored: a rising input frequency gives a falling apparent one. */
  inverted: boolean;
  aliased: boolean;
  /** Exactly on a multiple of fs/2, where the samples cannot tell the amplitude from the phase. */
  edge: boolean;
};

export function alias(f: number, fs: number): Alias {
  const k = Math.round(f / fs), signed = f - k * fs, half = fs / 2;
  const r = f / half, zone = Math.floor(r + 1e-12) + 1;
  const edge = Math.abs(r - Math.round(r)) < 1e-12 && f > 0;
  return { signed, apparent: Math.abs(signed), k, zone: edge ? Math.round(r) : zone, inverted: (edge ? Math.round(r) : zone) % 2 === 0, aliased: f > half * (1 + 1e-12), edge };
}

/** Folded frequency for any input: the triangle wave the folding diagram draws. */
export const fold = (f: number, fs: number) => Math.abs(f - fs * Math.round(f / fs));

/** Samples of A·sin(2π f t + φ) at t = n/fs, n = n0 … n0+count−1. */
export function samples(f: number, fs: number, A: number, phi: number, count: number, n0 = 0): { t: number[]; x: number[] } {
  const t: number[] = [], x: number[] = [];
  for (let n = n0; n < n0 + count; n++) { t.push(n / fs); x.push(A * Math.sin(2 * Math.PI * f * (n / fs) + phi)); }
  return { t, x };
}
/**
 * The sine at the signed alias frequency that passes through the same samples: A·sin(2π (f − k fs) t + φ). At every
 * sample time 2π k fs t is a whole number of turns, so it matches the original exactly there.
 */
export function aliasWave(f: number, fs: number, A: number, phi: number, t: number) {
  const a = alias(f, fs);
  return A * Math.sin(2 * Math.PI * a.signed * t + phi);
}
/** Ideal reconstruction Σ x[n]·sinc(fs·t − n) from the samples n0 … n0+count−1. */
export function sincRecon(x: number[], n0: number, fs: number, t: number): number {
  let s = 0;
  for (let i = 0; i < x.length; i++) { const u = fs * t - (n0 + i); s += x[i] * (u === 0 ? 1 : Math.sin(Math.PI * u) / (Math.PI * u)); }
  return s;
}
