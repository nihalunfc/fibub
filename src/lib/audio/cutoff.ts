// High-frequency cutoff of decoded audio, for spotting a "320 kbps" file that was made from a lower-quality one.
// Lossy encoders cut the top end (roughly 16 kHz at low bitrates, 19-20 kHz at high ones), and re-encoding cannot bring
// it back, so a high stated bitrate with a low cutoff is a hint (not proof) of an upscaled file. Plain TypeScript, no DOM.
import { fft, hann } from '../sci/dsp.ts';

export type Cutoff = {
  /** Highest frequency (Hz) still within `dropDb` of the 2-10 kHz average; null when the sound reaches the top of the band. */
  cutoff: number | null;
  /** Average level of 2-10 kHz (dB, relative). */
  refDb: number;
  /** Averaged spectrum in dB (bins of rate / n Hz). */
  freq: Float64Array;
  db: Float64Array;
  frames: number;
};

/**
 * Average the power spectrum of up to maxFrames Hann-windowed blocks of n samples spread over the sound (quiet blocks
 * skipped), smooth it over about 200 Hz, then find the highest frequency whose level is no more than dropDb below the
 * 2-10 kHz average. Above that the sound has (almost) nothing: that is the cutoff.
 */
export function estimateCutoff(x: Float32Array, rate: number, opts: { n?: number; maxFrames?: number; dropDb?: number } = {}): Cutoff {
  const n = opts.n ?? 4096, maxFrames = opts.maxFrames ?? 256, drop = opts.dropDb ?? 30;
  const half = n / 2, pow = new Float64Array(half + 1), w = hann(n), re = new Float64Array(n), im = new Float64Array(n);
  const blocks = Math.floor(x.length / n), step = Math.max(1, Math.floor(blocks / maxFrames));
  let frames = 0;
  for (let k = 0; k < blocks; k += step) {
    const s = k * n; let e = 0;
    for (let i = 0; i < n; i++) e += x[s + i] * x[s + i];
    if (e / n < 1e-8) continue; // below about -80 dBFS: silence tells us nothing
    for (let i = 0; i < n; i++) { re[i] = x[s + i] * w[i]; im[i] = 0; }
    fft(re, im);
    for (let i = 0; i <= half; i++) pow[i] += re[i] * re[i] + im[i] * im[i];
    frames++;
  }
  const df = rate / n, freq = new Float64Array(half + 1), db = new Float64Array(half + 1);
  const r = Math.max(1, Math.round(100 / df)); // ±100 Hz smoothing
  for (let i = 0; i <= half; i++) {
    let s = 0, c = 0;
    for (let j = Math.max(0, i - r); j <= Math.min(half, i + r); j++) { s += pow[j]; c++; }
    freq[i] = i * df; db[i] = 10 * Math.log10(s / c / Math.max(1, frames) + 1e-30);
  }
  if (!frames) return { cutoff: null, refDb: -Infinity, freq, db, frames };
  let ref = 0, rc = 0;
  for (let i = Math.ceil(2000 / df); i <= Math.min(half, Math.floor(10000 / df)); i++) { ref += db[i]; rc++; }
  const refDb = ref / Math.max(1, rc), floor = refDb - drop;
  let top = -1;
  for (let i = half; i >= Math.ceil(2000 / df); i--) if (db[i] >= floor) { top = i; break; }
  // Within the last 5% before the top of the band counts as full band.
  const cutoff = top < 0 ? 2000 : top * df >= 0.95 * (rate / 2) ? null : top * df;
  return { cutoff, refDb, freq, db, frames };
}

/** The rule of thumb: stated bitrate of 256 kbps or more, but nothing above 16.5 kHz. */
export function fakeBitrateHint(statedKbps: number, cutoffHz: number | null): { suspect: boolean; text: string } {
  if (cutoffHz === null) return { suspect: false, text: 'Sound reaches the top of the range: no sign of a lower-quality source.' };
  const k = (cutoffHz / 1000).toFixed(1);
  if (statedKbps >= 256 && cutoffHz <= 16500) return { suspect: true, text: `Says ${Math.round(statedKbps)} kbps but stops at about ${k} kHz: likely made from a lower-quality file. This is a hint, not proof.` };
  return { suspect: false, text: `Stops at about ${k} kHz: no sign of a lower-quality source by this check.` };
}
