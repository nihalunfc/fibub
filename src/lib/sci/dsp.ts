// Signal processing for the seismology tools: demean, linear detrend, Tukey (cosine) taper, Butterworth filters
// designed by the bilinear transform as second-order sections, one-pass and zero-phase filtering (the same edge
// handling as SciPy's sosfiltfilt: odd extension and steady-state start), FFT, amplitude spectrum and spectrogram.
// Plain maths, no DOM.

type C = [number, number];
const cmul = (a: C, b: C): C => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
const cdiv = (a: C, b: C): C => { const d = b[0] * b[0] + b[1] * b[1]; return [(a[0] * b[0] + a[1] * b[1]) / d, (a[1] * b[0] - a[0] * b[1]) / d]; };
const cadd = (a: C, b: C): C => [a[0] + b[0], a[1] + b[1]];
const csub = (a: C, b: C): C => [a[0] - b[0], a[1] - b[1]];
const csqrt = (a: C): C => { const r = Math.hypot(a[0], a[1]); const re = Math.sqrt((r + a[0]) / 2), im = Math.sqrt(Math.max(0, (r - a[0]) / 2)); return [re, a[1] < 0 ? -im : im]; };

/** Subtract the mean. */
export function demean(x: ArrayLike<number>): Float64Array {
  let s = 0; for (let i = 0; i < x.length; i++) s += x[i];
  const m = s / x.length, y = new Float64Array(x.length);
  for (let i = 0; i < x.length; i++) y[i] = x[i] - m;
  return y;
}

/** Subtract the least-squares straight line. */
export function detrend(x: ArrayLike<number>): Float64Array {
  const n = x.length, y = new Float64Array(n);
  if (n < 2) return demean(x);
  const tm = (n - 1) / 2;
  let sy = 0, sty = 0, stt = 0;
  for (let i = 0; i < n; i++) { sy += x[i]; sty += (i - tm) * x[i]; stt += (i - tm) ** 2; }
  const m = sy / n, b = sty / stt;
  for (let i = 0; i < n; i++) y[i] = x[i] - m - b * (i - tm);
  return y;
}

/** Tukey window (cosine-tapered) of length M; alpha is the tapered fraction of the whole length (both ends). */
export function tukey(M: number, alpha: number): Float64Array {
  const w = new Float64Array(M).fill(1);
  if (alpha <= 0 || M < 2) return w;
  if (alpha >= 1) alpha = 1;
  const width = Math.floor((alpha * (M - 1)) / 2);
  for (let n = 0; n <= width; n++) {
    w[n] = 0.5 * (1 + Math.cos(Math.PI * (-1 + (2 * n) / alpha / (M - 1))));
    const m = M - 1 - n;
    w[m] = 0.5 * (1 + Math.cos(Math.PI * (-2 / alpha + 1 + (2 * m) / alpha / (M - 1))));
  }
  return w;
}

/** Taper each end with a half cosine over `frac` of the trace (0.05 = 5 % at each end). */
export function taper(x: ArrayLike<number>, frac: number): Float64Array {
  const w = tukey(x.length, 2 * frac), y = new Float64Array(x.length);
  for (let i = 0; i < x.length; i++) y[i] = x[i] * w[i];
  return y;
}

/** Second-order sections [b0, b1, b2, a0, a1, a2] (a0 = 1). */
export type Sos = number[][];
export type Band = 'lowpass' | 'highpass' | 'bandpass';

/**
 * Digital Butterworth filter of order N (the bandpass has 2N poles, like SciPy's butter), corner frequencies in Hz,
 * sampling rate fs in Hz. Analogue prototype, prewarped corners, bilinear transform.
 */
export function butter(N: number, f: number | [number, number], band: Band, fs: number): Sos {
  if (!(N >= 1 && N <= 10 && Number.isInteger(N))) throw new Error('The filter order must be a whole number from 1 to 10');
  const nyq = fs / 2;
  const fl = Array.isArray(f) ? f : [f];
  if (band === 'bandpass' && !(fl.length === 2 && fl[0] > 0 && fl[1] > fl[0])) throw new Error('A bandpass needs a low corner above 0 and a high corner above it');
  if (fl.some((v) => !(v > 0 && v < nyq))) throw new Error(`Corner frequencies must be above 0 and below the Nyquist frequency (${+nyq.toPrecision(6)} Hz)`);
  const warp = (v: number) => 2 * fs * Math.tan((Math.PI * v) / fs);
  // Analogue prototype poles (left half plane), gain 1.
  const proto: C[] = [];
  for (let m = -N + 1; m < N; m += 2) { const a = (Math.PI * m) / (2 * N); proto.push([-Math.cos(a), -Math.sin(a)]); }
  let p: C[], z: C[], k: number;
  if (band === 'lowpass') { const w = warp(fl[0]); p = proto.map((q) => [q[0] * w, q[1] * w]); z = []; k = w ** N; }
  else if (band === 'highpass') {
    const w = warp(fl[0]); p = proto.map((q) => cdiv([w, 0], q)); z = proto.map(() => [0, 0] as C);
    let prod: C = [1, 0]; for (const q of proto) prod = cmul(prod, [-q[0], -q[1]]);
    k = 1 / prod[0];
  } else {
    const w1 = warp(fl[0]), w2 = warp(fl[1]), bw = w2 - w1, w0 = Math.sqrt(w1 * w2);
    p = [];
    for (const q of proto) { const h: C = [(q[0] * bw) / 2, (q[1] * bw) / 2], r = csqrt(csub(cmul(h, h), [w0 * w0, 0])); p.push(cadd(h, r), csub(h, r)); }
    z = proto.map(() => [0, 0] as C); k = bw ** N;
  }
  // Bilinear transform.
  const fs2 = 2 * fs;
  let num: C = [1, 0], den: C = [1, 0];
  for (const q of z) num = cmul(num, csub([fs2, 0], q));
  for (const q of p) den = cmul(den, csub([fs2, 0], q));
  const kd = k * cdiv(num, den)[0];
  const pd = p.map((q) => cdiv(cadd([fs2, 0], q), csub([fs2, 0], q)));
  // Group poles into sections: conjugate pairs, then real poles two by two.
  const tiny = 1e-12, cpx = pd.filter((q) => q[1] > tiny), real = pd.filter((q) => Math.abs(q[1]) <= tiny).map((q) => q[0]).sort((a, b) => a - b);
  const den2: number[][] = cpx.map((q) => [1, -2 * q[0], q[0] * q[0] + q[1] * q[1]]);
  for (let i = 0; i < real.length; i += 2) den2.push(i + 1 < real.length ? [1, -(real[i] + real[i + 1]), real[i] * real[i + 1]] : [1, -real[i], 0]);
  // Order sections from the poles farthest from the unit circle to the closest (the most resonant last).
  const r2 = (a: number[]) => (a[2] ? Math.sqrt(Math.abs(a[2])) : Math.abs(a[1]));
  den2.sort((a, b) => r2(a) - r2(b));
  const sos: Sos = den2.map((a) => {
    const first = a[2] === 0;
    const b = band === 'bandpass' ? [1, 0, -1] : band === 'lowpass' ? (first ? [1, 1, 0] : [1, 2, 1]) : first ? [1, -1, 0] : [1, -2, 1];
    return [...b, ...a];
  });
  sos[0] = [sos[0][0] * kd, sos[0][1] * kd, sos[0][2] * kd, ...sos[0].slice(3)];
  return sos;
}

/** Frequency response |H| of the sections at frequency f (Hz). */
export function sosGain(sos: Sos, f: number, fs: number): number {
  const w = (2 * Math.PI * f) / fs, z1: C = [Math.cos(-w), Math.sin(-w)], z2 = cmul(z1, z1);
  let h: C = [1, 0];
  for (const s of sos) {
    const n = cadd(cadd([s[0], 0], cmul([s[1], 0], z1)), cmul([s[2], 0], z2));
    const d = cadd(cadd([s[3], 0], cmul([s[4], 0], z1)), cmul([s[5], 0], z2));
    h = cmul(h, cdiv(n, d));
  }
  return Math.hypot(h[0], h[1]);
}

/** Steady-state start for a step of height 1 (SciPy's sosfilt_zi). */
export function sosZi(sos: Sos): number[][] {
  let scale = 1;
  return sos.map((s) => {
    const [b0, b1, b2, , a1, a2] = s;
    const z0 = (b1 - a1 * b0 + b2 - a2 * b0) / (1 + a1 + a2);
    const z1 = (1 + a1) * z0 - (b1 - a1 * b0);
    const out = [z0 * scale, z1 * scale];
    scale *= (b0 + b1 + b2) / (1 + a1 + a2);
    return out;
  });
}

/** Run the sections over x (direct form II transposed), optionally from state zi. */
export function sosfilt(sos: Sos, x: ArrayLike<number>, zi?: number[][]): Float64Array {
  const y = Float64Array.from(x as ArrayLike<number>);
  sos.forEach((s, k) => {
    const [b0, b1, b2, , a1, a2] = s;
    let z0 = zi ? zi[k][0] : 0, z1 = zi ? zi[k][1] : 0;
    for (let i = 0; i < y.length; i++) { const xi = y[i], yi = b0 * xi + z0; z0 = b1 * xi - a1 * yi + z1; z1 = b2 * xi - a2 * yi; y[i] = yi; }
  });
  return y;
}

/** Edge padding SciPy's sosfiltfilt uses (odd extension). */
export function padLength(sos: Sos): number {
  const nb = sos.filter((s) => s[2] === 0).length, na = sos.filter((s) => s[5] === 0).length;
  return 3 * (2 * sos.length + 1 - Math.min(nb, na));
}

/** Zero-phase filtering: forward and backward, odd extension at both ends, steady-state starts (as sosfiltfilt). */
export function sosfiltfilt(sos: Sos, x: ArrayLike<number>): Float64Array {
  const n = x.length, pl = padLength(sos);
  if (n <= pl) throw new Error(`The trace is too short for this filter: it needs more than ${pl} samples`);
  const ext = new Float64Array(n + 2 * pl);
  for (let i = 0; i < pl; i++) ext[i] = 2 * x[0] - x[pl - i];
  for (let i = 0; i < n; i++) ext[pl + i] = x[i];
  for (let i = 0; i < pl; i++) ext[pl + n + i] = 2 * x[n - 1] - x[n - 2 - i];
  const zi = sosZi(sos);
  let y = sosfilt(sos, ext, zi.map((r) => r.map((v) => v * ext[0])));
  y.reverse();
  y = sosfilt(sos, y, zi.map((r) => r.map((v) => v * y[0])));
  y.reverse();
  return y.slice(pl, pl + n);
}

/** In-place radix-2 FFT of (re, im); length must be a power of two. */
export function fft(re: Float64Array, im: Float64Array): void {
  const n = re.length;
  for (let i = 1, j = 0; i < n; i++) {
    let bit = n >> 1;
    for (; j & bit; bit >>= 1) j ^= bit;
    j ^= bit;
    if (i < j) { [re[i], re[j]] = [re[j], re[i]]; [im[i], im[j]] = [im[j], im[i]]; }
  }
  for (let len = 2; len <= n; len <<= 1) {
    const ang = (-2 * Math.PI) / len, wr = Math.cos(ang), wi = Math.sin(ang);
    for (let i = 0; i < n; i += len) {
      let cr = 1, ci = 0;
      for (let k = 0; k < len / 2; k++) {
        const a = i + k, b = a + len / 2, tr = re[b] * cr - im[b] * ci, ti = re[b] * ci + im[b] * cr;
        re[b] = re[a] - tr; im[b] = im[a] - ti; re[a] += tr; im[a] += ti;
        const t = cr * wr - ci * wi; ci = cr * wi + ci * wr; cr = t;
      }
    }
  }
}

export const nextPow2 = (n: number) => 2 ** Math.ceil(Math.log2(Math.max(1, n)));

/**
 * One-sided amplitude spectrum of x (sampling rate fs): zero-padded to the next power of two; amplitude 2|X|/n
 * (n = samples, so a sine of amplitude A reads A at its frequency; the 0 Hz and Nyquist bins are |X|/n).
 */
export function amplitudeSpectrum(x: ArrayLike<number>, fs: number): { f: Float64Array; a: Float64Array; nfft: number } {
  const n = x.length, nfft = nextPow2(n), re = new Float64Array(nfft), im = new Float64Array(nfft);
  for (let i = 0; i < n; i++) re[i] = x[i];
  fft(re, im);
  const m = nfft / 2 + 1, f = new Float64Array(m), a = new Float64Array(m);
  for (let k = 0; k < m; k++) { f[k] = (k * fs) / nfft; a[k] = ((k === 0 || k === nfft / 2 ? 1 : 2) * Math.hypot(re[k], im[k])) / n; }
  return { f, a, nfft };
}

/** Frequency of the largest amplitude above fmin (Hz), with parabolic interpolation between bins. */
export function dominant(sp: { f: Float64Array; a: Float64Array }, fmin = 0): { f: number; a: number } {
  let k = -1;
  for (let i = 1; i < sp.f.length; i++) if (sp.f[i] >= fmin && (k < 0 || sp.a[i] > sp.a[k])) k = i;
  if (k < 0) return { f: NaN, a: NaN };
  if (k > 0 && k < sp.f.length - 1) {
    const [y0, y1, y2] = [sp.a[k - 1], sp.a[k], sp.a[k + 1]], d = y0 - 2 * y1 + y2;
    if (d < 0) { const s = (0.5 * (y0 - y2)) / d; return { f: sp.f[k] + s * (sp.f[1] - sp.f[0]), a: y1 - 0.25 * (y0 - y2) * s }; }
  }
  return { f: sp.f[k], a: sp.a[k] };
}

/** Periodic Hann window (as used for spectral analysis). */
export function hann(n: number): Float64Array { const w = new Float64Array(n); for (let i = 0; i < n; i++) w[i] = 0.5 - 0.5 * Math.cos((2 * Math.PI * i) / n); return w; }

/**
 * Spectrogram: short-time Fourier transform with a periodic Hann window of nper samples (a power of two), stepping
 * nper − overlap samples, each segment's mean removed; power spectral density (units² per Hz, one-sided), as SciPy's
 * spectrogram with scaling 'density'. Times are segment centres from the first sample (s).
 */
export function spectrogram(x: ArrayLike<number>, fs: number, nper: number, overlap: number) {
  if (nper & (nper - 1)) throw new Error('The window length must be a power of two');
  if (!(overlap >= 0 && overlap < nper)) throw new Error('The overlap must be at least 0 and less than the window');
  const step = nper - overlap, w = hann(nper);
  let s2 = 0; for (const v of w) s2 += v * v;
  const scale = 1 / (fs * s2), m = nper / 2 + 1;
  const t: number[] = [], S: Float64Array[] = [];
  for (let s = 0; s + nper <= x.length; s += step) {
    let mean = 0; for (let i = 0; i < nper; i++) mean += x[s + i]; mean /= nper;
    const re = new Float64Array(nper), im = new Float64Array(nper);
    for (let i = 0; i < nper; i++) re[i] = (x[s + i] - mean) * w[i];
    fft(re, im);
    const row = new Float64Array(m);
    for (let k = 0; k < m; k++) row[k] = (re[k] * re[k] + im[k] * im[k]) * scale * (k === 0 || k === nper / 2 ? 1 : 2);
    S.push(row); t.push((s + nper / 2) / fs);
  }
  const f = Float64Array.from({ length: m }, (_, k) => (k * fs) / nper);
  return { f, t, S };
}
