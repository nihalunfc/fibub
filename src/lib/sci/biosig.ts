// Shared signal helpers for the biomedical signal tools (ECG, EMG): second-order Butterworth and notch
// sections, zero-phase filtering done the way SciPy's sosfiltfilt does it (odd extension at both ends and
// steady-state start values), a seeded random number generator and reading a one- or two-column signal.
// No DOM.

/** One second-order section: [b0, b1, b2, a1, a2] with a0 = 1. */
export type Biquad = [number, number, number, number, number];

/** Second-order Butterworth low-pass (bilinear transform with pre-warping, the same as scipy.signal.butter(2, fc, fs=fs)). */
export function butterLow(fc: number, fs: number): Biquad {
  const K = Math.tan(Math.PI * fc / fs), n = 1 / (1 + Math.SQRT2 * K + K * K);
  return [K * K * n, 2 * K * K * n, K * K * n, 2 * (K * K - 1) * n, (1 - Math.SQRT2 * K + K * K) * n];
}
/** Second-order Butterworth high-pass (as scipy.signal.butter(2, fc, 'highpass', fs=fs)). */
export function butterHigh(fc: number, fs: number): Biquad {
  const K = Math.tan(Math.PI * fc / fs), n = 1 / (1 + Math.SQRT2 * K + K * K);
  return [n, -2 * n, n, 2 * (K * K - 1) * n, (1 - Math.SQRT2 * K + K * K) * n];
}
/** Notch at f0 with quality factor Q (as scipy.signal.iirnotch). */
export function notch(f0: number, fs: number, Q = 30): Biquad {
  const w0 = 2 * Math.PI * f0 / fs, bw = w0 / Q, g = 1 / (1 + Math.tan(bw / 2)), c = Math.cos(w0);
  return [g, -2 * g * c, g, -2 * g * c, 2 * g - 1];
}

/** Band-pass made of a high-pass and a low-pass section (either may be left out with 0), plus an optional notch. */
export function bandSections(fs: number, hp: number, lp: number, mains = 0): Biquad[] {
  const s: Biquad[] = [];
  if (hp > 0) s.push(butterHigh(hp, fs));
  if (lp > 0 && lp < fs / 2) s.push(butterLow(lp, fs));
  if (mains > 0 && mains < fs / 2) s.push(notch(mains, fs));
  return s;
}

function runSos(x: Float64Array, sos: Biquad[]): Float64Array {
  let y = Float64Array.from(x), scale = x[0];
  for (const [b0, b1, b2, a1, a2] of sos) {
    // Steady-state start for a constant input equal to the first sample (scipy.signal.sosfilt_zi).
    const G = (b0 + b1 + b2) / (1 + a1 + a2), out = new Float64Array(y.length);
    let z2 = (b2 - a2 * G) * scale, z1 = (b1 - a1 * G) * scale + z2;
    for (let i = 0; i < y.length; i++) {
      const xi = y[i], yi = b0 * xi + z1;
      z1 = b1 * xi - a1 * yi + z2; z2 = b2 * xi - a2 * yi; out[i] = yi;
    }
    scale *= G; y = out;
  }
  return y;
}

/** Zero-phase filtering forwards then backwards, matching scipy.signal.sosfiltfilt(sos, x) with its defaults. */
export function filtfilt(x: ArrayLike<number>, sos: Biquad[]): Float64Array {
  const n = x.length;
  if (!sos.length) return Float64Array.from(x);
  const pad = Math.min(3 * (2 * sos.length + 1 - Math.min(sos.filter((s) => s[2] === 0).length, sos.filter((s) => s[4] === 0).length)), n - 1);
  const ext = new Float64Array(n + 2 * pad);
  for (let i = 0; i < pad; i++) ext[i] = 2 * x[0] - x[pad - i];
  for (let i = 0; i < n; i++) ext[pad + i] = x[i];
  for (let i = 0; i < pad; i++) ext[pad + n + i] = 2 * x[n - 1] - x[n - 2 - i];
  const f = runSos(ext, sos).reverse(), b = runSos(f, sos).reverse();
  return b.slice(pad, pad + n);
}

/** Small seeded random number generator (mulberry32) and a normal draw from it. */
export function seeded(seed: number) {
  let a = seed >>> 0;
  const u = () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const g = () => { let s = 0; while (s === 0) s = u(); return Math.sqrt(-2 * Math.log(s)) * Math.cos(2 * Math.PI * u()); };
  return { u, g };
}

export type Signal = { y: Float64Array; fs: number; t0: number; skipped: number; fromTime: boolean };

/**
 * Read a signal from pasted rows. One column: values at the given sample rate. Two or more columns:
 * column `col` (1-based) is the value and, with `timeCol`, the first column is the time in seconds, and the
 * sample rate is worked out from the median time step. Header and non-numeric rows are skipped.
 */
export function readSignal(rows: string[][], num: (s: string) => number, fs: number, col = 1, timeCol = false): Signal {
  const t: number[] = [], y: number[] = []; let skipped = 0;
  for (const r of rows) {
    const v = num(r[col - 1]), tt = timeCol ? num(r[0]) : 0;
    if (Number.isFinite(v) && Number.isFinite(tt)) { y.push(v); t.push(tt); } else if (r.some((c) => c.trim() !== '')) skipped++;
  }
  if (!timeCol) return { y: Float64Array.from(y), fs, t0: 0, skipped, fromTime: false };
  const d = t.slice(1).map((v, i) => v - t[i]).filter((v) => v > 0).sort((a, b) => a - b);
  const step = d.length ? d[Math.floor(d.length / 2)] : NaN;
  return { y: Float64Array.from(y), fs: 1 / step, t0: t[0] ?? 0, skipped, fromTime: true };
}

/** Trapezoid integral of y over x between lo and hi (only the grid points inside). */
export function bandIntegral(x: ArrayLike<number>, y: ArrayLike<number>, lo: number, hi: number) {
  let s = 0;
  for (let i = 1; i < x.length; i++) if (x[i - 1] >= lo - 1e-9 && x[i] <= hi + 1e-9) s += (x[i] - x[i - 1]) * (y[i] + y[i - 1]) / 2;
  return s;
}
