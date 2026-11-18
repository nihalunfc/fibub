// Track analysis for the DJ tools: tempo (BPM) with a beat grid, onsets, chromagram, key, an energy rating and length.
// Plain TypeScript, no DOM, so it runs in a Web Worker. Checks in tests/music.mjs.
//
// Method (all fibub's own code, after the published methods named):
// - Everything runs on a mono copy at about 11 kHz (decimated with a windowed-sinc low-pass), which keeps a 7-minute
//   track to a few seconds of work.
// - Onset strength: spectral flux of the log-compressed magnitude spectrum (1024-sample Hann frames, 128-sample hop,
//   about 86 frames a second), as in Dixon (2006) "Onset detection revisited", DAFx-06, with the local mean taken off.
// - Tempo: autocorrelation of the onset strength, scored with its multiples (a comb, as in Ellis 2007, "Beat tracking
//   by dynamic programming", J. New Music Research 36(1)) and a gentle preference for 70-180 BPM; then refined to
//   0.1 BPM by laying a beat grid over the whole track at small tempo steps and keeping the one that lands on the most
//   onset strength. The grid's phase gives the first beat.
// - Key: a chromagram from spectral peaks (80-2000 Hz, 0.37 s frames), summed over the track and correlated with the
//   Krumhansl-Kessler key profiles (Krumhansl 1990, "Cognitive foundations of musical pitch", Oxford UP) and the
//   Temperley profiles (Temperley 1999, "What's key for key? The Krumhansl-Schmuckler key-finding algorithm
//   reconsidered", Music Perception 17(1)); the two correlations are averaged for each of the 24 keys.
// - Energy 1-10 is fibub's own scale (not a standard): see energyRating().
import { measure } from '../audio/loudness.ts';
import { camelot, type Key, type Mode } from './theory.ts';

export type Progress = (fraction: number, stage: string) => void;

/** Average the channels into one. */
export function downmix(chans: Float32Array[]): Float32Array {
  if (chans.length === 1) return chans[0];
  const n = chans[0].length, out = new Float32Array(n), g = 1 / chans.length;
  for (const c of chans) for (let i = 0; i < n; i++) out[i] += c[i] * g;
  return out;
}

/**
 * Lower the sample rate by a whole factor so the result is 11025-22050 Hz (target 11025): a 63-tap Kaiser-windowed
 * sinc low-pass at 0.45 of the new rate, computed only at the kept samples. Rates already at or below 22050 Hz are kept.
 */
export function decimate(x: Float32Array, rate: number, target = 11025): { x: Float32Array; rate: number } {
  const f = Math.max(1, Math.floor(rate / target));
  if (f === 1) return { x, rate };
  const half = 31, fc = 0.9 / (2 * f), h = new Float32Array(2 * half + 1);
  const i0 = (v: number) => { let s = 1, t = 1; for (let k = 1; k < 25; k++) { t *= (v / (2 * k)) ** 2; s += t; } return s; };
  let sum = 0;
  for (let k = -half; k <= half; k++) {
    const r = k / half, w = i0(7 * Math.sqrt(1 - r * r)) / i0(7), a = 2 * Math.PI * fc * k;
    sum += h[k + half] = (k === 0 ? 1 : Math.sin(a) / a) * w;
  }
  for (let k = 0; k < h.length; k++) h[k] /= sum;
  const n = Math.floor(x.length / f), y = new Float32Array(n);
  for (let j = 0; j < n; j++) {
    const c = j * f; let s = 0;
    if (c - half >= 0 && c + half < x.length) for (let k = 0; k < h.length; k++) s += x[c - half + k] * h[k];
    else for (let k = 0; k < h.length; k++) { const i = c - half + k; if (i >= 0 && i < x.length) s += x[i] * h[k]; }
    y[j] = s;
  }
  return { x: y, rate: rate / f };
}

// Radix-2 FFT with cached bit-reversal and twiddle tables (frames of the same size are transformed thousands of times).
const PLANS = new Map<number, { rev: Uint32Array; cos: Float64Array; sin: Float64Array }>();
function fft(re: Float64Array, im: Float64Array): void {
  const n = re.length;
  let plan = PLANS.get(n);
  if (!plan) {
    const rev = new Uint32Array(n), bits = Math.log2(n), cos = new Float64Array(n / 2), sin = new Float64Array(n / 2);
    for (let i = 0; i < n; i++) { let r = 0; for (let b = 0; b < bits; b++) r |= ((i >> b) & 1) << (bits - 1 - b); rev[i] = r; }
    for (let k = 0; k < n / 2; k++) { cos[k] = Math.cos((-2 * Math.PI * k) / n); sin[k] = Math.sin((-2 * Math.PI * k) / n); }
    PLANS.set(n, (plan = { rev, cos, sin }));
  }
  const { rev, cos, sin } = plan;
  for (let i = 0; i < n; i++) { const j = rev[i]; if (i < j) { let t = re[i]; re[i] = re[j]; re[j] = t; t = im[i]; im[i] = im[j]; im[j] = t; } }
  for (let len = 2; len <= n; len <<= 1) {
    const h = len >> 1, step = n / len;
    for (let i = 0; i < n; i += len) for (let k = 0; k < h; k++) {
      const a = i + k, b = a + h, wr = cos[k * step], wi = sin[k * step];
      const tr = re[b] * wr - im[b] * wi, ti = re[b] * wi + im[b] * wr;
      re[b] = re[a] - tr; im[b] = im[a] - ti; re[a] += tr; im[a] += ti;
    }
  }
}

const hann = (n: number) => { const w = new Float64Array(n); for (let i = 0; i < n; i++) w[i] = 0.5 - 0.5 * Math.cos((2 * Math.PI * i) / n); return w; };

export type Onsets = { env: Float32Array; fps: number; t0: number; centroid: number };
/**
 * Onset strength (spectral flux of log magnitudes, half-wave rectified, local mean removed), one value per hop.
 * env[i] belongs to time t0 + i / fps seconds. centroid is the mean spectral centroid (Hz) of non-silent frames.
 */
export function onsetEnvelope(x: Float32Array, rate: number, onProgress?: Progress, N = 1024, hop = 128): Onsets {
  // Frame i ends at sample i*hop, so a sound at the very start is seen too.
  const frames = Math.floor(x.length / hop) + 1, w = hann(N), half = N / 2;
  const raw = new Float32Array(frames), re = new Float64Array(N), im = new Float64Array(N), ma = new Float64Array(half), mb = new Float64Array(half);
  let prev = new Float64Array(half), cur = new Float64Array(half), cSum = 0, cW = 0;
  const fill = (buf: Float64Array, i: number) => { const o = i * hop - N; for (let k = 0; k < N; k++) { const j = o + k; buf[k] = i < frames && j >= 0 && j < x.length ? x[j] * w[k] : 0; } };
  const one = (i: number, m: Float64Array) => {
    let flux = 0, mag = 0, mf = 0;
    for (let k = 1; k < half; k++) {
      const a = m[k], l = Math.log(1 + 100 * a);
      cur[k] = l; mag += a; mf += a * k;
      const d = l - prev[k]; if (d > 0 && i > 0) flux += d;
    }
    raw[i] = flux;
    if (mag > 1e-3) { cSum += (mf / mag) * (rate / N) * mag; cW += mag; }
    const t = prev; prev = cur; cur = t;
  };
  // Two real frames per complex FFT: frame i in the real part, frame i+1 in the imaginary part, separated after.
  for (let i = 0; i < frames; i += 2) {
    fill(re, i); fill(im, i + 1);
    fft(re, im);
    for (let k = 1; k < half; k++) {
      const zr = re[k], zi = im[k], cr = re[N - k], ci = -im[N - k];
      ma[k] = 0.5 * Math.sqrt((zr + cr) ** 2 + (zi + ci) ** 2);
      mb[k] = 0.5 * Math.sqrt((zr - cr) ** 2 + (zi - ci) ** 2);
    }
    one(i, ma);
    if (i + 1 < frames) one(i + 1, mb);
    if (onProgress && (i & 4094) === 0) onProgress(i / frames, 'onsets');
  }
  // Take off a running mean (about 0.4 s) and keep the positive part.
  const fps = rate / hop, M = Math.max(1, Math.round(0.2 * fps)), env = new Float32Array(frames);
  const cum = new Float64Array(frames + 1); for (let i = 0; i < frames; i++) cum[i + 1] = cum[i] + raw[i];
  for (let i = 0; i < frames; i++) {
    const a = Math.max(0, i - M), b = Math.min(frames, i + M + 1), m = (cum[b] - cum[a]) / (b - a);
    env[i] = Math.max(0, raw[i] - m);
  }
  // The flux of frame i is the change from frame i-1 to i. With log magnitudes a sharp onset counts most as soon as
  // it enters the window, about 12% of a frame before the frame's end (checked with click tracks in tests/music.mjs).
  return { env, fps, t0: -0.12 * N / rate, centroid: cW ? cSum / cW : 0 };
}

/** Value of env at a fractional index (linear interpolation; 0 outside). */
const at = (env: Float32Array, p: number) => { const i = Math.floor(p); if (i < 0 || i + 1 >= env.length) return 0; const f = p - i; return env[i] * (1 - f) + env[i + 1] * f; };

export type Tempo = { bpm: number; alt: number; confidence: number; offset: number; period: number };
/**
 * Tempo in BPM (to 0.1), the half or double tempo that scored better (alt), a confidence 0-1 (fibub's own: how far the
 * best comb score stands above the median of all candidate tempos, 0 for none, 1 for a click track), the time of the
 * first beat (offset, s) and the beat period (s).
 */
export function estimateTempo(o: Onsets, minBpm = 70, maxBpm = 180): Tempo {
  const { env, fps } = o, n = env.length;
  const none = { bpm: 0, alt: 0, confidence: 0, offset: 0, period: 0 };
  if (n < fps * 3) return none;
  let mean = 0; for (let i = 0; i < n; i++) mean += env[i]; mean /= n;
  const e = new Float32Array(n); for (let i = 0; i < n; i++) e[i] = env[i] - mean;
  // Autocorrelation up to 4 periods of 40 BPM, by FFT.
  const maxLag = Math.min(n - 1, Math.ceil((60 / 40) * fps * 4) + 2), nf = 2 ** Math.ceil(Math.log2(2 * n));
  const re = new Float64Array(nf), im = new Float64Array(nf);
  for (let i = 0; i < n; i++) re[i] = e[i];
  fft(re, im);
  for (let k = 0; k < nf; k++) { re[k] = re[k] * re[k] + im[k] * im[k]; im[k] = 0; }
  fft(re, im); // real and even, so a forward transform gives the inverse up to scale
  const r0 = re[0] || 1, ac = new Float64Array(maxLag + 1);
  for (let l = 0; l <= maxLag; l++) ac[l] = re[l] / r0 / (1 - l / n); // unbiased
  const acAt = (p: number) => { const i = Math.floor(p); if (i + 1 > maxLag) return 0; const f = p - i; return ac[i] * (1 - f) + ac[i + 1] * f; };
  // Comb score of a tempo: its lag and multiples, with a broad log-normal preference centred on 120 BPM.
  const comb = (bpm: number) => { const L = (60 / bpm) * fps; let s = 0; for (let k = 1; k <= 4; k++) s += acAt(L * k) / k; return s; };
  const prior = (bpm: number) => Math.exp(-0.5 * (Math.log2(bpm / 120) / 1.4) ** 2);
  const scores: number[] = [];
  let best = 0, bestS = -Infinity;
  for (let b = minBpm; b <= maxBpm + 1e-9; b += 0.25) { const s = comb(b) * prior(b); scores.push(s); if (s > bestS) { bestS = s; best = b; } }
  if (!(bestS > 0)) return none;
  // Octave check: if as much happens halfway between the beats as on them, the beat is twice as fast.
  { const L = (60 / best) * fps; if (best * 2 <= maxBpm && acAt(L / 2) >= 0.7 * acAt(L)) { best *= 2; bestS = comb(best) * prior(best); } }
  const sorted = scores.slice().sort((a, b) => a - b), med = sorted[sorted.length >> 1];
  const confidence = Math.max(0, Math.min(1, (bestS - med) / (bestS + 1e-9) * Math.min(1, comb(best) / 1.2 * 1.5)));
  // Refine: lay a beat grid over the whole track for tempos within ±2% at 0.02 BPM steps and 32 phases each.
  const grid = (bpm: number) => {
    const P = (60 / bpm) * fps; let top = -1, ph = 0;
    for (let q = 0; q < 32; q++) {
      const phase = (q / 32) * P; let s = 0;
      for (let p = phase; p < n - 1; p += P) s += at(env, p);
      if (s > top) { top = s; ph = phase; }
    }
    return { s: top, ph };
  };
  // Smooth a copy a little so a grid a fraction of a frame off still lands on the peak.
  let refined = best, rs = -Infinity, phase = 0;
  const lo = best * 0.98, hi = best * 1.02;
  for (let b = lo; b <= hi; b += 0.02) { const g = grid(b); if (g.s > rs) { rs = g.s; refined = b; phase = g.ph; } }
  // Fine phase at the chosen tempo.
  const P = (60 / refined) * fps; let fp = phase, fs = -1;
  for (let q = -16; q <= 16; q++) { const p0 = phase + (q / 32) * (P / 32) * 2; let s = 0; for (let p = p0; p < n - 1; p += P) s += at(env, p); if (s > fs) { fs = s; fp = p0; } }
  fp = ((fp % P) + P) % P;
  const bpm = Math.round(refined * 10) / 10;
  const half = bpm / 2, dbl = bpm * 2;
  const alt = comb(dbl) * prior(dbl) >= comb(half) * prior(half) ? Math.round(dbl * 10) / 10 : Math.round(half * 10) / 10;
  const per = 60 / bpm, off = (((o.t0 + fp / fps) % per) + per) % per;
  return { bpm, alt, confidence: Math.round(confidence * 100) / 100, offset: off > per - 0.01 ? off - per : off, period: per };
}

/** Beat times (s) from a tempo, up to duration. */
export function beatGrid(t: Tempo, duration: number): number[] {
  const out: number[] = [];
  if (!t.period) return out;
  for (let s = t.offset; s < duration; s += t.period) out.push(s);
  return out;
}

/** Onset times (s) and strengths: local peaks of the onset strength above its own running level, at least minGap s apart. */
export function onsetTimes(o: Onsets, minGap = 0.05, sensitivity = 1): { t: number; s: number }[] {
  const { env, fps } = o, n = env.length, W = Math.max(1, Math.round(0.05 * fps)), A = Math.max(1, Math.round(0.5 * fps));
  let mx = 0; for (let i = 0; i < n; i++) if (env[i] > mx) mx = env[i];
  if (!mx) return [];
  const cum = new Float64Array(n + 1); for (let i = 0; i < n; i++) cum[i + 1] = cum[i] + env[i];
  const out: { t: number; s: number }[] = [];
  let last = -Infinity;
  for (let i = 1; i < n - 1; i++) {
    const v = env[i];
    if (v < 0.04 * mx / sensitivity) continue;
    let peak = true; for (let k = Math.max(0, i - W); k <= Math.min(n - 1, i + W); k++) if (env[k] > v || (env[k] === v && k < i)) { peak = false; break; }
    if (!peak) continue;
    const a = Math.max(0, i - A), b = Math.min(n, i + A + 1), m = (cum[b] - cum[a]) / (b - a);
    if (v < m * 1.5 / sensitivity) continue;
    const t = Math.max(0, o.t0 + i / fps);
    if (t - last < minGap) continue;
    out.push({ t, s: v / mx }); last = t;
  }
  return out;
}

/**
 * Chroma: energy per pitch class (0 = C) for each frame of about 0.37 s (half overlapping), from spectral peaks between
 * 80 and 2000 Hz with their frequency refined by a parabola through the three bins. Each frame is scaled to sum to 1
 * (silent frames stay 0). Works on any length; a single short buffer gives one frame.
 */
export function chromagram(x: Float32Array, rate: number, a4 = 440, onProgress?: Progress): Float32Array[] {
  const N = Math.min(2 ** Math.round(Math.log2(rate * 0.37)), 2 ** Math.floor(Math.log2(Math.max(64, x.length))));
  const hop = N / 2, w = hann(N), re = new Float64Array(N), im = new Float64Array(N), mag = new Float64Array(N / 2);
  const out: Float32Array[] = [];
  const k0 = Math.max(2, Math.floor((80 * N) / rate)), k1 = Math.min(N / 2 - 2, Math.ceil((2000 * N) / rate));
  const frames = Math.max(1, Math.floor((x.length - N) / hop) + 1);
  for (let f = 0; f < frames; f++) {
    const o = f * hop;
    for (let k = 0; k < N; k++) { re[k] = (x[o + k] ?? 0) * w[k]; im[k] = 0; }
    fft(re, im);
    let peak = 0;
    for (let k = 0; k < N / 2; k++) { mag[k] = Math.sqrt(re[k] * re[k] + im[k] * im[k]); if (mag[k] > peak) peak = mag[k]; }
    const c = new Float32Array(12);
    if (peak > 1e-4) {
      const floor = peak * 0.01;
      for (let k = k0; k <= k1; k++) {
        const m = mag[k];
        if (m < floor || m <= mag[k - 1] || m < mag[k + 1]) continue;
        const a = Math.log(mag[k - 1] + 1e-12), b = Math.log(m), g = Math.log(mag[k + 1] + 1e-12), den = a - 2 * b + g;
        const d = den ? (0.5 * (a - g)) / den : 0, hz = ((k + d) * rate) / N;
        const midi = 69 + 12 * Math.log2(hz / a4), pc = ((Math.round(midi) % 12) + 12) % 12;
        // Weight by amplitude, less for peaks far from an equal-tempered note.
        c[pc] += Math.sqrt(m) * (1 - Math.min(1, 2 * Math.abs(midi - Math.round(midi))) * 0.5);
      }
      let s = 0; for (let i = 0; i < 12; i++) s += c[i];
      if (s > 0) for (let i = 0; i < 12; i++) c[i] /= s;
    }
    out.push(c);
    if (onProgress && (f & 255) === 0) onProgress(f / frames, 'key');
  }
  return out;
}

/** Krumhansl-Kessler probe-tone ratings (Krumhansl 1990), C major and C minor. */
export const KK = {
  major: [6.35, 2.23, 3.48, 2.33, 4.38, 4.09, 2.52, 5.19, 2.39, 3.66, 2.29, 2.88],
  minor: [6.33, 2.68, 3.52, 5.38, 2.6, 3.53, 2.54, 4.75, 3.98, 2.69, 3.34, 3.17],
};
/** Temperley's revised key profiles (Temperley 1999, Music Perception 17(1)), C major and C minor. */
export const TEMPERLEY = {
  major: [5, 2, 3.5, 2, 4.5, 4, 2, 4.5, 2, 3.5, 1.5, 4],
  minor: [5, 2, 3.5, 4.5, 2, 4, 2, 4.5, 3.5, 2, 1.5, 4],
};

const pearson = (a: ArrayLike<number>, b: ArrayLike<number>, shift: number) => {
  let ma = 0, mb = 0; for (let i = 0; i < 12; i++) { ma += a[i]; mb += b[i]; } ma /= 12; mb /= 12;
  let num = 0, da = 0, db = 0;
  for (let i = 0; i < 12; i++) { const x = a[(i + shift) % 12] - ma, y = b[i] - mb; num += x * y; da += x * x; db += y * y; }
  return da && db ? num / Math.sqrt(da * db) : 0;
};

export type KeyResult = { key: Key; camelot: string; r: number; confidence: number; runnerUp: { key: Key; camelot: string; r: number }; all: { key: Key; r: number }[] };
/**
 * Best key from a summed chroma (12 values, C first): mean of the Pearson correlations with the Krumhansl-Kessler and
 * Temperley profiles rotated to each tonic. confidence (fibub's own, 0-1) = best correlation × how far it stands
 * above the runner-up: min(1, r1) × min(1, (r1 − r2) / 0.1), with a floor of 0.3 × r1 when the gap is small.
 */
export function keyFromChroma(chroma: ArrayLike<number>): KeyResult | null {
  let s = 0; for (let i = 0; i < 12; i++) s += chroma[i];
  if (!(s > 0)) return null;
  const all: { key: Key; r: number }[] = [];
  for (const mode of ['major', 'minor'] as Mode[]) for (let t = 0; t < 12; t++)
    all.push({ key: { tonic: t, mode }, r: (pearson(chroma, KK[mode], t) + pearson(chroma, TEMPERLEY[mode], t)) / 2 });
  all.sort((a, b) => b.r - a.r);
  const [b1, b2] = all, r1 = Math.max(0, b1.r);
  const confidence = Math.round(Math.min(1, Math.max(0.3 * r1, Math.min(1, r1) * Math.min(1, (b1.r - b2.r) / 0.1))) * 100) / 100;
  return { key: b1.key, camelot: camelot(b1.key), r: b1.r, confidence, runnerUp: { key: b2.key, camelot: camelot(b2.key), r: b2.r }, all };
}

/** Sum chroma frames (each already scaled to 1). */
export function sumChroma(frames: Float32Array[]): Float64Array {
  const s = new Float64Array(12);
  for (const c of frames) for (let i = 0; i < 12; i++) s[i] += c[i];
  return s;
}

/**
 * Energy 1-10, fibub's own scale (not an industry standard), from three measures:
 *   loud = (LUFS + 30) / 22, clamped 0-1  (−30 LUFS -> 0, −8 LUFS -> 1)
 *   busy = onsets per second / 8, clamped 0-1
 *   bright = (spectral centroid Hz − 400) / 1600, clamped 0-1 (centroid of the ~11 kHz analysis copy)
 *   pace = (BPM − 60) / 120, clamped 0-1
 *   energy = 1 + round(9 × (0.45 loud + 0.25 busy + 0.15 bright + 0.15 pace))
 */
export function energyRating(lufs: number, onsetsPerSec: number, centroidHz: number, bpm: number): number {
  const c = (v: number) => (isFinite(v) ? Math.max(0, Math.min(1, v)) : 0);
  const v = 0.45 * c((lufs + 30) / 22) + 0.25 * c(onsetsPerSec / 8) + 0.15 * c((centroidHz - 400) / 1600) + 0.15 * c((bpm - 60) / 120);
  return 1 + Math.round(9 * v);
}

export type Analysis = {
  duration: number; bpm: number; altBpm: number; bpmConfidence: number; firstBeat: number; period: number;
  key: KeyResult | null; lufs: number; energy: number; onsets: number[]; onsetRate: number; centroid: number;
  env: Float32Array; envFps: number; envT0: number;
};

/** Everything for one track. chans at any rate; a4 for the key (440 by default). */
export function analyseTrack(chans: Float32Array[], rate: number, onProgress?: Progress, a4 = 440): Analysis {
  const duration = (chans[0]?.length ?? 0) / rate;
  onProgress?.(0, 'prepare');
  const small = chans.map((c) => decimate(c, rate)), r = small[0].rate;
  const mono = downmix(small.map((s) => s.x));
  onProgress?.(0.1, 'onsets');
  const o = onsetEnvelope(mono, r, (f) => onProgress?.(0.1 + 0.4 * f, 'onsets'));
  onProgress?.(0.5, 'tempo');
  const tempo = estimateTempo(o);
  const ons = onsetTimes(o);
  onProgress?.(0.6, 'key');
  const key = keyFromChroma(sumChroma(chromagram(mono, r, a4, (f) => onProgress?.(0.6 + 0.25 * f, 'key'))));
  onProgress?.(0.85, 'loudness');
  // Loudness of the ~11 kHz copy: BS.1770 integrated loudness, which leaves out content above ~5 kHz (usually well under 1 LU).
  const L = measure(small.map((s) => s.x), r).integrated;
  const onsetRate = duration ? ons.length / duration : 0;
  onProgress?.(1, 'done');
  return {
    duration, bpm: tempo.bpm, altBpm: tempo.alt, bpmConfidence: tempo.confidence, firstBeat: tempo.offset, period: tempo.period,
    key, lufs: L, energy: energyRating(L, onsetRate, o.centroid, tempo.bpm), onsets: ons.map((x) => x.t), onsetRate, centroid: o.centroid,
    env: o.env, envFps: o.fps, envT0: o.t0,
  };
}
