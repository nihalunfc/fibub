// Short-time Fourier transform for sound: Hann window, overlap-add, perfect reconstruction (checked in tests/audio-dsp.mjs).
// Plain TypeScript, no DOM, so it runs in a Web Worker and in Node. The FFT is the radix-2 one in src/lib/sci/dsp.ts.
import { fft } from '../sci/dsp.ts';

/** A spectrogram: frames × bins complex values, flat (frame t, bin k at t * bins + k). Frame t is centred on sample t * hop. */
export type Spec = { n: number; hop: number; frames: number; bins: number; re: Float32Array; im: Float32Array };

/** Periodic Hann window (sums to a constant under overlap-add at hop n/2, n/4, ...). */
export function hann(n: number): Float64Array {
  const w = new Float64Array(n);
  for (let i = 0; i < n; i++) w[i] = 0.5 - 0.5 * Math.cos((2 * Math.PI * i) / n);
  return w;
}

const frameCount = (len: number, hop: number) => Math.floor(len / hop) + 1;

/**
 * STFT of one or more real channels. Two channels share one complex FFT (one as the real part, one as the imaginary
 * part), so stereo costs the same as mono. Samples outside the signal count as zero.
 */
export function stft(chans: Float32Array[], n = 2048, hop = n / 4): Spec[] {
  const len = chans[0].length, frames = frameCount(len, hop), bins = n / 2 + 1, w = hann(n), half = n / 2;
  const out: Spec[] = chans.map(() => ({ n, hop, frames, bins, re: new Float32Array(frames * bins), im: new Float32Array(frames * bins) }));
  const re = new Float64Array(n), im = new Float64Array(n);
  for (let c = 0; c < chans.length; c += 2) {
    const a = chans[c], b = chans[c + 1], A = out[c], B = out[c + 1];
    for (let t = 0; t < frames; t++) {
      const s0 = t * hop - half;
      for (let i = 0; i < n; i++) {
        const j = s0 + i, ok = j >= 0 && j < len;
        re[i] = ok ? a[j] * w[i] : 0;
        im[i] = ok && b ? b[j] * w[i] : 0;
      }
      fft(re, im);
      const o = t * bins;
      if (!B) { for (let k = 0; k < bins; k++) { A.re[o + k] = re[k]; A.im[o + k] = im[k]; } continue; }
      // Split Z = FFT(a + i b): A[k] = (Z[k] + conj Z[n-k]) / 2, B[k] = (Z[k] - conj Z[n-k]) / 2i.
      for (let k = 0; k < bins; k++) {
        const m = (n - k) % n, zr = re[k], zi = im[k], cr = re[m], ci = -im[m];
        A.re[o + k] = (zr + cr) / 2; A.im[o + k] = (zi + ci) / 2;
        B.re[o + k] = (zi - ci) / 2; B.im[o + k] = -(zr - cr) / 2;
      }
    }
  }
  return out;
}

/** Inverse STFT by weighted overlap-add (Hann synthesis window, divided by the summed squared window). */
export function istft(specs: Spec[], len: number): Float32Array[] {
  const { n, hop, frames, bins } = specs[0], w = hann(n), half = n / 2;
  const outs = specs.map(() => new Float32Array(len));
  const norm = new Float64Array(len);
  for (let t = 0; t < frames; t++) {
    const s0 = t * hop - half;
    for (let i = 0; i < n; i++) { const j = s0 + i; if (j >= 0 && j < len) norm[j] += w[i] * w[i]; }
  }
  const re = new Float64Array(n), im = new Float64Array(n), acc = specs.map(() => new Float64Array(len));
  for (let c = 0; c < specs.length; c += 2) {
    const A = specs[c], B = specs[c + 1];
    for (let t = 0; t < frames; t++) {
      const o = t * bins;
      // Build Z = A + i B with Hermitian halves, then inverse FFT via conj(FFT(conj Z)) / n.
      for (let k = 0; k < bins; k++) {
        const ar = A.re[o + k], ai = A.im[o + k], br = B ? B.re[o + k] : 0, bi = B ? B.im[o + k] : 0;
        re[k] = ar - bi; im[k] = ai + br;
        if (k > 0 && k < half) { const m = n - k; re[m] = ar + bi; im[m] = -ai + br; }
      }
      for (let i = 0; i < n; i++) im[i] = -im[i];
      fft(re, im);
      const s0 = t * hop - half, ya = acc[c], yb = acc[c + 1];
      for (let i = 0; i < n; i++) {
        const j = s0 + i;
        if (j < 0 || j >= len) continue;
        ya[j] += (re[i] / n) * w[i];
        if (yb) yb[j] += (-im[i] / n) * w[i];
      }
    }
  }
  for (let c = 0; c < specs.length; c++) { const a = acc[c], o = outs[c]; for (let j = 0; j < len; j++) o[j] = norm[j] > 1e-9 ? a[j] / norm[j] : 0; }
  return outs;
}

/**
 * Run a local process over a long sound in pieces so memory stays small: each piece gets `margin` extra samples on
 * each side (enough for the process to see what it needs), and neighbouring pieces cross-fade over `fade` samples.
 * `fn(chans)` must return the same number of channels and samples it was given.
 */
export function chunked(chans: Float32Array[], fn: (part: Float32Array[]) => Float32Array[], opts: { core: number; margin: number; fade?: number; onProgress?: (f: number) => void }): Float32Array[] {
  const len = chans[0].length, { core, margin } = opts, fade = Math.min(opts.fade ?? 2048, core);
  const out = chans.map(() => new Float32Array(len));
  const pieces = Math.max(1, Math.ceil(len / core));
  for (let p = 0; p < pieces; p++) {
    const a = p * core, z = Math.min(len, (p + 1) * core + (p < pieces - 1 ? fade : 0));
    const s0 = Math.max(0, a - margin), s1 = Math.min(len, z + margin);
    const res = fn(chans.map((c) => c.subarray(s0, s1)));
    for (let c = 0; c < chans.length; c++) {
      const r = res[c], o = out[c];
      for (let j = a; j < z; j++) {
        let g = 1;
        if (p > 0 && j < a + fade) g = (j - a + 0.5) / fade;
        if (p < pieces - 1 && j >= (p + 1) * core) g = 1 - (j - (p + 1) * core + 0.5) / fade;
        o[j] += g * r[j - s0];
      }
    }
    opts.onProgress?.((p + 1) / pieces);
  }
  return out;
}

/** Magnitudes |X| of a spectrogram. */
export function magnitude(S: Spec): Float32Array {
  const m = new Float32Array(S.re.length);
  for (let i = 0; i < m.length; i++) m[i] = Math.hypot(S.re[i], S.im[i]);
  return m;
}

/** Multiply every bin of a spectrogram by a real mask (same layout), in place. */
export function applyMask(S: Spec, mask: Float32Array): void {
  for (let i = 0; i < mask.length; i++) { S.re[i] *= mask[i]; S.im[i] *= mask[i]; }
}

/** A copy of a spectrogram. */
export const cloneSpec = (S: Spec): Spec => ({ ...S, re: S.re.slice(), im: S.im.slice() });
