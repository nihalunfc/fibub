// Classic (non-AI) source separation for the Stem splitter (#T1014). Plain TypeScript, no DOM; checks in tests/audio-dsp.mjs.
// - Harmonic-percussive separation by median filtering: D. FitzGerald, "Harmonic/percussive separation using median
//   filtering", Proc. 13th Int. Conference on Digital Audio Effects (DAFx-10), Graz, 2010. Steady (harmonic) sounds are
//   smooth along time, hits (percussive) are smooth along frequency; a median along each picks one out, and soft
//   Wiener-style masks H^p / (H^p + P^p) share each bin between the two.
// - Centre extraction: the inter-channel similarity 2 Re(L R*) / (|L|^2 + |R|^2) (after C. Avendano and J.-M. Jot,
//   "A frequency-domain approach to multichannel upmix", J. Audio Eng. Soc. 52(7/8), 2004) is 1 for a sound panned dead
//   centre and falls for sounds panned aside or with different phase in each channel.
// Every mode returns one stem; the other is the mix minus it, so the stems always add back up to the original.
import { stft, istft, chunked, type Spec } from './stft.ts';

export type StemMode = 'vocals' | 'drums' | 'bass';
export type SepOptions = { strength?: number; kernel?: number; lowHz?: number; highHz?: number; cutoff?: number; onProgress?: (f: number) => void };

/** Median of a small array (sorts in place). */
function median(a: Float32Array, n: number): number {
  for (let i = 1; i < n; i++) { const v = a[i]; let j = i - 1; while (j >= 0 && a[j] > v) { a[j + 1] = a[j]; j--; } a[j + 1] = v; }
  return n & 1 ? a[n >> 1] : 0.5 * (a[(n >> 1) - 1] + a[n >> 1]);
}

/** Median along time (per bin) and along frequency (per frame) of a frames × bins magnitude array. */
export function medianFilters(mag: Float32Array, frames: number, bins: number, kTime = 17, kFreq = 17): { harm: Float32Array; perc: Float32Array } {
  const harm = new Float32Array(mag.length), perc = new Float32Array(mag.length);
  const ht = kTime >> 1, hf = kFreq >> 1, buf = new Float32Array(Math.max(kTime, kFreq));
  for (let t = 0; t < frames; t++) {
    const a = Math.max(0, t - ht), z = Math.min(frames - 1, t + ht);
    for (let k = 0; k < bins; k++) {
      let n = 0;
      for (let u = a; u <= z; u++) buf[n++] = mag[u * bins + k];
      harm[t * bins + k] = median(buf, n);
    }
    const o = t * bins;
    for (let k = 0; k < bins; k++) {
      const b0 = Math.max(0, k - hf), b1 = Math.min(bins - 1, k + hf);
      let n = 0;
      for (let u = b0; u <= b1; u++) buf[n++] = mag[o + u];
      perc[o + k] = median(buf, n);
    }
  }
  return { harm, perc };
}

/** Soft harmonic mask H^p / (H^p + P^p) (the percussive mask is 1 minus it). p = 2 is the Wiener-style mask. */
export function harmonicMask(mag: Float32Array, frames: number, bins: number, p = 2, kTime = 17, kFreq = 17): Float32Array {
  const { harm, perc } = medianFilters(mag, frames, bins, kTime, kFreq), m = new Float32Array(mag.length);
  for (let i = 0; i < m.length; i++) {
    const h = Math.pow(harm[i], p), q = Math.pow(perc[i], p), s = h + q;
    m[i] = s > 1e-30 ? h / s : 0.5;
  }
  return m;
}

/** A smooth band weight: 1 between lo and hi, falling over half an octave each side (raised cosine on a log scale). */
export function bandWeight(f: number, lo: number, hi: number): number {
  const edge = (x: number) => (x <= 0 ? 0 : x >= 1 ? 1 : 0.5 - 0.5 * Math.cos(Math.PI * x));
  const l = lo > 0 ? edge((Math.log2(Math.max(f, 1e-9) / lo) + 0.5) / 0.5) : 1;
  const h = hi > 0 ? edge((Math.log2(hi / Math.max(f, 1e-9)) + 0.5) / 0.5) : 1;
  return l * h;
}

/** Combined magnitude of all channels (the masks are shared so the stereo picture stays put). */
function mixMag(specs: Spec[]): Float32Array {
  const m = new Float32Array(specs[0].re.length);
  for (const S of specs) for (let i = 0; i < m.length; i++) m[i] += Math.hypot(S.re[i], S.im[i]);
  return m;
}

/** The mask for one piece of sound (frames × bins), for the chosen stem. */
export function stemMask(specs: Spec[], rate: number, mode: StemMode, o: SepOptions = {}): Float32Array {
  const S0 = specs[0], { frames, bins, n } = S0, p = o.strength ?? 2, k = o.kernel ?? 17;
  const H = harmonicMask(mixMag(specs), frames, bins, p, k, k);
  if (mode === 'drums') { for (let i = 0; i < H.length; i++) H[i] = 1 - H[i]; return H; }
  if (mode === 'bass') {
    const cut = o.cutoff ?? 150;
    for (let b = 0; b < bins; b++) { const w = bandWeight((b * rate) / n, 0, cut); for (let t = 0; t < frames; t++) H[t * bins + b] *= w; }
    return H;
  }
  // Vocals: harmonic × centre-panned × in the voice band.
  const lo = o.lowHz ?? 100, hi = o.highHz ?? 8000, band = new Float32Array(bins);
  for (let b = 0; b < bins; b++) band[b] = bandWeight((b * rate) / n, lo, hi);
  const L = specs[0], R = specs[1] ?? specs[0];
  for (let i = 0; i < H.length; i++) {
    const lr = L.re[i], li = L.im[i], rr = R.re[i], ri = R.im[i], e = lr * lr + li * li + rr * rr + ri * ri;
    const sim = e > 1e-30 ? Math.max(0, (2 * (lr * rr + li * ri)) / e) : 0;
    H[i] *= Math.pow(sim, 2 * p) * band[i % bins];
  }
  return H;
}

/** One piece: STFT, mask, inverse STFT. */
export function separatePart(chans: Float32Array[], rate: number, mode: StemMode, o: SepOptions = {}): Float32Array[] {
  const n = fftSize(rate, mode), specs = stft(chans, n, n / 4), m = stemMask(specs, rate, mode, o);
  for (const S of specs) for (let i = 0; i < m.length; i++) { S.re[i] *= m[i]; S.im[i] *= m[i]; }
  return istft(specs, chans[0].length);
}

/** FFT size: about 46 ms (2048 at 44.1 kHz), twice that for bass to tell low notes apart. */
export function fftSize(rate: number, mode: StemMode): number {
  const base = Math.pow(2, Math.round(Math.log2(rate * 0.0464)));
  return mode === 'bass' ? base * 2 : base;
}

/** Split a whole sound: returns the chosen stem (vocals, drums or bass); the rest is mix minus stem (see remainder). */
export function separate(chans: Float32Array[], rate: number, mode: StemMode, o: SepOptions = {}): Float32Array[] {
  const n = fftSize(rate, mode), hop = n / 4, k = o.kernel ?? 17;
  const margin = n + ((k >> 1) + 2) * hop;
  return chunked(chans, (part) => separatePart(part, rate, mode, o), { core: Math.max(rate * 15, 4 * n), margin, fade: n, onProgress: o.onProgress });
}

/** The mix minus a stem, channel by channel. */
export function remainder(mix: Float32Array[], stem: Float32Array[]): Float32Array[] {
  return mix.map((c, i) => { const o = new Float32Array(c.length), s = stem[i]; for (let j = 0; j < c.length; j++) o[j] = c[j] - s[j]; return o; });
}

/** Names of the two stems for each mode, as the page shows them. */
export const STEM_NAMES: Record<StemMode, [string, string]> = {
  vocals: ['Vocals', 'Instrumental'],
  drums: ['Drums', 'Melodic'],
  bass: ['Bass', 'Everything else'],
};
