// Fast Fourier transform for any length (radix-2, with Bluestein's chirp-z method for other lengths), the usual
// analysis windows, one-sided amplitude and power spectra, peak finding and brick-wall FFT filtering.
// Plain TypeScript with no DOM; checked against numpy.fft and scipy.signal in tests/sci-tools/fft-workbench.mjs.

/** In-place radix-2 FFT. n must be a power of two. inverse=true gives the unscaled inverse transform. */
function fft2(re: Float64Array, im: Float64Array, inverse = false) {
  const n = re.length;
  for (let i = 1, j = 0; i < n; i++) {
    let bit = n >> 1;
    for (; j & bit; bit >>= 1) j ^= bit;
    j ^= bit;
    if (i < j) { let t = re[i]; re[i] = re[j]; re[j] = t; t = im[i]; im[i] = im[j]; im[j] = t; }
  }
  for (let len = 2; len <= n; len <<= 1) {
    const ang = ((inverse ? 2 : -2) * Math.PI) / len, half = len >> 1;
    // Twiddles computed directly (not by repeated multiplication) to keep rounding errors small.
    const wr = new Float64Array(half), wi = new Float64Array(half);
    for (let k = 0; k < half; k++) { wr[k] = Math.cos(ang * k); wi[k] = Math.sin(ang * k); }
    for (let i = 0; i < n; i += len) {
      for (let k = 0; k < half; k++) {
        const a = i + k, b = a + half;
        const xr = re[b] * wr[k] - im[b] * wi[k], xi = re[b] * wi[k] + im[b] * wr[k];
        re[b] = re[a] - xr; im[b] = im[a] - xi; re[a] += xr; im[a] += xi;
      }
    }
  }
}

export const isPow2 = (n: number) => n > 0 && (n & (n - 1)) === 0;
export const nextPow2 = (n: number) => { let m = 1; while (m < n) m <<= 1; return m; };

/** Discrete Fourier transform of any length: X_k = Σ x_n e^(−2πi nk/N) (the same convention as numpy.fft.fft). */
export function fft(reIn: ArrayLike<number>, imIn?: ArrayLike<number>, inverse = false): { re: Float64Array; im: Float64Array } {
  const n = reIn.length;
  const re = Float64Array.from(reIn), im = imIn ? Float64Array.from(imIn) : new Float64Array(n);
  if (n <= 1) return { re, im };
  if (isPow2(n)) { fft2(re, im, inverse); return { re, im }; }
  // Bluestein: nk = (n² + k² − (k−n)²)/2 turns the DFT into a convolution done with power-of-two FFTs.
  const m = nextPow2(2 * n - 1), s = inverse ? 1 : -1;
  const cr = new Float64Array(n), ci = new Float64Array(n);
  for (let k = 0; k < n; k++) { const a = (Math.PI * ((k * k) % (2 * n))) / n; cr[k] = Math.cos(a); ci[k] = s * Math.sin(a); }
  const ar = new Float64Array(m), ai = new Float64Array(m), br = new Float64Array(m), bi = new Float64Array(m);
  for (let k = 0; k < n; k++) { ar[k] = re[k] * cr[k] - im[k] * ci[k]; ai[k] = re[k] * ci[k] + im[k] * cr[k]; }
  br[0] = cr[0]; bi[0] = -ci[0];
  for (let k = 1; k < n; k++) { br[k] = br[m - k] = cr[k]; bi[k] = bi[m - k] = -ci[k]; }
  fft2(ar, ai); fft2(br, bi);
  for (let k = 0; k < m; k++) { const r = ar[k] * br[k] - ai[k] * bi[k]; ai[k] = ar[k] * bi[k] + ai[k] * br[k]; ar[k] = r; }
  fft2(ar, ai, true);
  for (let k = 0; k < n; k++) { const r = ar[k] / m, i = ai[k] / m; re[k] = r * cr[k] - i * ci[k]; im[k] = r * ci[k] + i * cr[k]; }
  return { re, im };
}
/** Inverse DFT with the 1/N scaling (numpy.fft.ifft). */
export function ifft(re: ArrayLike<number>, im: ArrayLike<number>): { re: Float64Array; im: Float64Array } {
  const r = fft(re, im, true), n = re.length;
  for (let k = 0; k < n; k++) { r.re[k] /= n; r.im[k] /= n; }
  return r;
}

export type WindowName = 'rect' | 'hann' | 'hamming' | 'blackman';
export const WINDOWS: Record<WindowName, string> = { rect: 'Rectangular (none)', hann: 'Hann', hamming: 'Hamming', blackman: 'Blackman' };
/**
 * Analysis window of length n. periodic=true gives the "DFT-even" form used for spectra (scipy.signal.get_window),
 * periodic=false the symmetric form (numpy.hanning, used for filter design).
 */
export function windowFn(name: WindowName, n: number, periodic = true): Float64Array {
  const w = new Float64Array(n);
  if (n === 1) { w[0] = 1; return w; }
  const d = periodic ? n : n - 1;
  for (let i = 0; i < n; i++) {
    const x = (2 * Math.PI * i) / d;
    w[i] = name === 'hann' ? 0.5 - 0.5 * Math.cos(x) : name === 'hamming' ? 0.54 - 0.46 * Math.cos(x) : name === 'blackman' ? 0.42 - 0.5 * Math.cos(x) + 0.08 * Math.cos(2 * x) : 1;
  }
  if (name === 'blackman') { if (!periodic) { w[0] = 0; w[n - 1] = 0; } else w[0] = 0; }
  return w;
}

export type Spectrum = {
  /** Frequencies of the one-sided spectrum, 0 to fs/2. */
  f: Float64Array;
  /** Peak amplitude of a sine at each frequency (window's coherent gain corrected). */
  amp: Float64Array;
  /** One-sided power spectral density, units² per Hz (as scipy.signal.periodogram with scaling='density'). */
  psd: Float64Array;
  /** One-sided power spectrum, units² (scipy's scaling='spectrum': a sine of amplitude A gives A²/2). */
  pow: Float64Array;
  /** Complex DFT of the windowed (and padded) signal, bins 0..nfft/2. */
  re: Float64Array; im: Float64Array;
  df: number; nfft: number; n: number; mean: number;
  /** Coherent gain Σw/n and equivalent noise bandwidth in bins, n·Σw²/(Σw)². */
  cg: number; enbw: number;
};

/** One-sided spectrum of x sampled at fs, after optionally removing the mean, windowing and zero-padding to nfft. */
export function spectrum(x: ArrayLike<number>, fs: number, win: WindowName = 'hann', opts: { detrend?: boolean; nfft?: number } = {}): Spectrum {
  const n = x.length, nfft = Math.max(n, opts.nfft ?? n);
  let mean = 0;
  for (let i = 0; i < n; i++) mean += x[i];
  mean /= n;
  const w = windowFn(win, n, true);
  const buf = new Float64Array(nfft);
  let s1 = 0, s2 = 0;
  for (let i = 0; i < n; i++) { buf[i] = (x[i] - (opts.detrend === false ? 0 : mean)) * w[i]; s1 += w[i]; s2 += w[i] * w[i]; }
  const X = fft(buf);
  const m = Math.floor(nfft / 2) + 1, even = nfft % 2 === 0;
  const f = new Float64Array(m), amp = new Float64Array(m), psd = new Float64Array(m), pow = new Float64Array(m), re = X.re.slice(0, m), im = X.im.slice(0, m);
  for (let k = 0; k < m; k++) {
    const mag2 = re[k] * re[k] + im[k] * im[k], one = k === 0 || (even && k === m - 1) ? 1 : 2;
    f[k] = (k * fs) / nfft;
    amp[k] = (one * Math.sqrt(mag2)) / s1;
    psd[k] = (one * mag2) / (fs * s2);
    pow[k] = (one * mag2) / (s1 * s1);
  }
  return { f, amp, psd, pow, re, im, df: fs / nfft, nfft, n, mean, cg: s1 / n, enbw: (n * s2) / (s1 * s1) };
}

export type Peak = { k: number; f: number; amp: number; db: number };
/**
 * The highest local maxima of the amplitude spectrum (DC left out), strongest first. The frequency and amplitude
 * are refined by fitting a parabola to the log amplitude of the peak bin and its neighbours.
 */
export function findPeaks(s: Spectrum, count = 8, minRel = 1e-3): Peak[] {
  const a = s.amp, m = a.length, max = Math.max(...Array.from(a).slice(1));
  const out: Peak[] = [];
  for (let k = 1; k < m; k++) {
    const l = a[k - 1], r = k + 1 < m ? a[k + 1] : -1;
    if (!(a[k] > l && a[k] >= r) || a[k] < max * minRel) continue;
    let p = 0, peak = a[k];
    if (k + 1 < m && Math.min(l, r) > a[k] * 1e-9) {
      const al = Math.log(l), ac = Math.log(a[k]), ar = Math.log(r), den = al - 2 * ac + ar;
      if (den < 0) { p = (0.5 * (al - ar)) / den; peak = Math.exp(ac - 0.25 * (al - ar) * p); }
    }
    out.push({ k, f: (k + p) * s.df, amp: peak, db: 20 * Math.log10(peak) });
  }
  return out.sort((x, y) => y.amp - x.amp).slice(0, count);
}

export type FilterKind = 'none' | 'low' | 'high' | 'band' | 'stop';
/**
 * Brick-wall filter done in the frequency domain: transform the whole (unwindowed) signal, set the bins outside
 * the pass band to zero, transform back. Same as numpy: irfft(rfft(x) * mask, n). f1 and f2 in Hz.
 */
export function fftFilter(x: ArrayLike<number>, fs: number, kind: FilterKind, f1: number, f2 = f1): Float64Array {
  const n = x.length;
  if (kind === 'none') return Float64Array.from(x);
  const X = fft(x);
  for (let k = 0; k < n; k++) {
    const kk = Math.min(k, n - k), f = (kk * fs) / n;
    const keep = kind === 'low' ? f <= f1 : kind === 'high' ? f >= f1 : kind === 'band' ? f >= f1 && f <= f2 : f < f1 || f > f2;
    if (!keep) { X.re[k] = 0; X.im[k] = 0; }
  }
  return ifft(X.re, X.im).re;
}

export type Signal = { t: number[]; x: number[]; fs: number; fromTime: boolean; skipped: number; jitter: number; header: string[] };
/**
 * A pasted signal: two columns (time, value) or one column of values with the sample rate given. A first row that
 * is not numeric is taken as headers. The sample rate from times is 1 / median step; jitter is the largest
 * departure of a step from that median, as a fraction of it.
 */
export function parseSignal(rows: string[][], parse: (s: string) => number, mode: 'auto' | 'time' | 'values', fsIn: number, col = -1): Signal {
  let header: string[] = [];
  if (rows.length && rows[0].some((c) => c !== '' && Number.isNaN(parse(c)))) { header = rows[0]; rows = rows.slice(1); }
  const width = Math.max(0, ...rows.map((r) => r.length));
  const useTime = mode === 'time' || (mode === 'auto' && width >= 2);
  const vc = col >= 0 ? col : useTime ? 1 : 0;
  const t: number[] = [], x: number[] = [];
  let skipped = 0;
  for (const r of rows) {
    const v = parse(r[vc] ?? ''), tt = useTime ? parse(r[0] ?? '') : NaN;
    if (!Number.isFinite(v) || (useTime && !Number.isFinite(tt))) { skipped++; continue; }
    x.push(v); if (useTime) t.push(tt);
  }
  let fs = fsIn, jitter = 0;
  if (useTime && t.length >= 2) {
    const d = t.slice(1).map((v, i) => v - t[i]), sorted = [...d].sort((a, b) => a - b), med = sorted[Math.floor((sorted.length - 1) / 2)];
    fs = 1 / med;
    jitter = Math.max(...d.map((v) => Math.abs(v - med))) / Math.abs(med);
  } else for (let i = 0; i < x.length; i++) t.push(i / fs);
  return { t, x, fs, fromTime: useTime, skipped, jitter, header };
}

/** At most about 2·buckets points that keep each bucket's lowest and highest value, for drawing long signals. */
export function envelope(x: ArrayLike<number>, y: ArrayLike<number>, buckets = 800): { x: number[]; y: number[] } {
  const n = y.length;
  if (n <= buckets * 2) return { x: Array.from(x), y: Array.from(y) };
  const ox: number[] = [], oy: number[] = [], per = n / buckets;
  for (let b = 0; b < buckets; b++) {
    const i0 = Math.floor(b * per), i1 = Math.min(n, Math.floor((b + 1) * per));
    let lo = i0, hi = i0;
    for (let i = i0; i < i1; i++) { if (y[i] < y[lo]) lo = i; if (y[i] > y[hi]) hi = i; }
    for (const i of lo < hi ? [lo, hi] : [hi, lo]) { ox.push(x[i]); oy.push(y[i]); }
  }
  return { x: ox, y: oy };
}

/** A small, repeatable pseudo-random generator (mulberry32) for example signals and simulations. */
export function rng(seed: number) {
  let a = seed >>> 0;
  return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
/** Standard normal draws from a uniform generator (Box-Muller). */
export function gauss(u: () => number) { return () => Math.sqrt(-2 * Math.log(1 - u())) * Math.cos(2 * Math.PI * u()); }
