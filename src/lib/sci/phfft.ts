// Spectrum analysis of sound: a radix-2 FFT, analysis windows, amplitude spectra in dB relative to full scale,
// Welch averaging, interpolated peak finding and musical note names. No DOM; used by the audio spectrum analyser.

export type WindowName = 'hann' | 'hamming' | 'blackman' | 'rect';

/** In-place radix-2 FFT of (re, im); length must be a power of two. */
export function fft(re: Float64Array, im: Float64Array) {
  const n = re.length;
  if (n & (n - 1)) throw new Error('FFT length must be a power of two');
  for (let i = 1, j = 0; i < n; i++) {
    let bit = n >> 1;
    for (; j & bit; bit >>= 1) j ^= bit;
    j ^= bit;
    if (i < j) { let t = re[i]; re[i] = re[j]; re[j] = t; t = im[i]; im[i] = im[j]; im[j] = t; }
  }
  for (let len = 2; len <= n; len <<= 1) {
    const ang = (-2 * Math.PI) / len, wr = Math.cos(ang), wi = Math.sin(ang), half = len >> 1;
    for (let i = 0; i < n; i += len) {
      let cr = 1, ci = 0;
      for (let k = 0; k < half; k++) {
        const a = i + k, b = a + half, xr = re[b] * cr - im[b] * ci, xi = re[b] * ci + im[b] * cr;
        re[b] = re[a] - xr; im[b] = im[a] - xi; re[a] += xr; im[a] += xi;
        const t = cr * wr - ci * wi; ci = cr * wi + ci * wr; cr = t;
      }
    }
  }
}

/** Periodic (DFT-even) window of length n, as scipy.signal.get_window makes by default. */
export function makeWindow(name: WindowName, n: number): Float64Array {
  const w = new Float64Array(n), t = (2 * Math.PI) / n;
  for (let i = 0; i < n; i++) {
    w[i] = name === 'hann' ? 0.5 - 0.5 * Math.cos(t * i)
      : name === 'hamming' ? 0.54 - 0.46 * Math.cos(t * i)
      : name === 'blackman' ? 0.42 - 0.5 * Math.cos(t * i) + 0.08 * Math.cos(2 * t * i)
      : 1;
  }
  return w;
}

/**
 * Power of each one-sided bin (0 … n/2), scaled so a sine of amplitude A exactly on a bin gives A² (0 dBFS for a
 * full-scale sine). frame.length must equal win.length (a power of two).
 */
export function powerSpectrum(frame: ArrayLike<number>, win: Float64Array): Float64Array {
  const n = win.length, re = new Float64Array(n), im = new Float64Array(n);
  let sw = 0, mean = 0;
  for (let i = 0; i < n; i++) mean += frame[i];
  mean /= n;
  for (let i = 0; i < n; i++) { re[i] = (frame[i] - mean) * win[i]; sw += win[i]; }
  fft(re, im);
  const out = new Float64Array(n / 2 + 1), s = (2 / sw) ** 2;
  for (let k = 0; k <= n / 2; k++) out[k] = (re[k] * re[k] + im[k] * im[k]) * s * (k === 0 || k === n / 2 ? 0.25 : 1);
  return out;
}

/** Welch average of power spectra over frames of win.length with 50 % overlap (at least one frame, zero-padded). */
export function welch(x: ArrayLike<number>, win: Float64Array, maxFrames = Infinity): { power: Float64Array; frames: number } {
  const n = win.length, hop = n / 2, acc = new Float64Array(n / 2 + 1);
  let frames = 0;
  const total = x.length <= n ? 1 : Math.floor((x.length - n) / hop) + 1, step = total > maxFrames ? total / maxFrames : 1;
  const buf = new Float64Array(n);
  for (let f = 0; f < Math.min(total, maxFrames); f++) {
    const start = Math.floor(f * step) * hop;
    for (let i = 0; i < n; i++) buf[i] = start + i < x.length ? x[start + i] : 0;
    const p = powerSpectrum(buf, win);
    for (let k = 0; k < acc.length; k++) acc[k] += p[k];
    frames++;
  }
  for (let k = 0; k < acc.length; k++) acc[k] /= frames;
  return { power: acc, frames };
}

export const toDb = (p: number) => 10 * Math.log10(Math.max(p, 1e-20));

/** RMS level of a block in dBFS (a full-scale sine is −3.01 dBFS; a full-scale square wave 0). */
export function rmsDb(x: ArrayLike<number>) {
  let s = 0;
  for (let i = 0; i < x.length; i++) s += x[i] * x[i];
  return toDb(s / Math.max(1, x.length));
}

/**
 * Peaks of a power spectrum: local maxima at least `minDb` above the floor, `fMin` Hz and up, refined by fitting a
 * parabola through the three dB values around each. Strongest first, at most `count`, at least `sepBins` apart.
 */
export function peaks(power: Float64Array, fs: number, opts: { count?: number; fMin?: number; fMax?: number; minDb?: number; sepBins?: number } = {}) {
  const n = (power.length - 1) * 2, df = fs / n, { count = 8, fMin = 20, fMax = fs / 2, minDb = -100, sepBins = 3 } = opts;
  const db = Array.from(power, toDb), found: { f: number; db: number; bin: number }[] = [];
  const k0 = Math.max(1, Math.ceil(fMin / df)), k1 = Math.min(power.length - 2, Math.floor(fMax / df));
  for (let k = k0; k <= k1; k++) {
    if (db[k] > db[k - 1] && db[k] >= db[k + 1] && db[k] > minDb) {
      const a = db[k - 1], b = db[k], c = db[k + 1], den = a - 2 * b + c, d = den < 0 ? (0.5 * (a - c)) / den : 0;
      found.push({ f: (k + d) * df, db: b - 0.25 * (a - c) * d, bin: k });
    }
  }
  found.sort((p, q) => q.db - p.db);
  const out: typeof found = [];
  for (const p of found) { if (out.every((o) => Math.abs(o.bin - p.bin) >= sepBins)) out.push(p); if (out.length >= count) break; }
  return out;
}

const NAMES = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];
/** Nearest equal-tempered note to f (A4 = a4 Hz) and how far off it is in cents. */
export function noteOf(f: number, a4 = 440) {
  const m = 69 + 12 * Math.log2(f / a4), r = Math.round(m);
  return { name: `${NAMES[((r % 12) + 12) % 12]}${Math.floor(r / 12) - 1}`, midi: r, cents: 100 * (m - r), exact: a4 * Math.pow(2, (r - 69) / 12) };
}

/**
 * Columns of a spectrogram: `cols` frames of win.length spread evenly over x, each as dB per bin (0 … n/2).
 */
export function spectrogram(x: ArrayLike<number>, win: Float64Array, cols: number): Float64Array[] {
  const n = win.length, out: Float64Array[] = [], last = Math.max(0, x.length - n), buf = new Float64Array(n);
  const c = Math.max(1, Math.min(cols, Math.floor(x.length / (n / 4)) || 1));
  for (let j = 0; j < c; j++) {
    const start = c === 1 ? 0 : Math.round((j * last) / (c - 1));
    for (let i = 0; i < n; i++) buf[i] = start + i < x.length ? x[start + i] : 0;
    const p = powerSpectrum(buf, win), d = new Float64Array(p.length);
    for (let k = 0; k < p.length; k++) d[k] = toDb(p[k]);
    out.push(d);
  }
  return out;
}

/** Thins a spectrum to at most `max` points for drawing, keeping the highest value in each slot (log or linear in f). */
export function thin(f: number[], v: number[], max: number, log: boolean) {
  if (f.length <= max) return { f, v };
  const lo = log ? Math.log(Math.max(f[1] ?? 1, 1e-9)) : f[0], hi = log ? Math.log(f[f.length - 1]) : f[f.length - 1];
  const of: number[] = [], ov: number[] = [];
  let slot = -1, bf = 0, bv = -Infinity;
  for (let i = 0; i < f.length; i++) {
    if (log && f[i] <= 0) continue;
    const s = Math.min(max - 1, Math.floor((((log ? Math.log(f[i]) : f[i]) - lo) / (hi - lo)) * max));
    if (s !== slot) { if (slot >= 0) { of.push(bf); ov.push(bv); } slot = s; bf = f[i]; bv = v[i]; }
    else if (v[i] > bv) { bv = v[i]; bf = f[i]; }
  }
  if (slot >= 0) { of.push(bf); ov.push(bv); }
  return { f: of, v: ov };
}
