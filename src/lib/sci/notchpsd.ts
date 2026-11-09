// Line-noise removal for EEG and patch-clamp traces: IIR notch filters (as scipy.signal.iirnotch), zero-phase
// forward-backward filtering (as scipy.signal.filtfilt with its default odd padding), Welch power spectra (as
// scipy.signal.welch) and band powers. Plain maths, no DOM.
import { makeWindow, segmentPsd, isPow2, rng, gauss, type WindowName } from './spectro.ts';

export type Ba = { b: number[]; a: number[] };

/** Second-order notch at f0 Hz with quality factor Q (−3 dB width f0/Q), as scipy.signal.iirnotch. */
export function iirnotch(f0: number, Q: number, fs: number): Ba {
  if (!(f0 > 0 && f0 < fs / 2)) throw new Error('The notch frequency must be between 0 and half the sample rate.');
  if (!(Q > 0)) throw new Error('Q must be above 0.');
  const w0 = (2 * Math.PI * f0) / fs, bw = w0 / Q, beta = Math.tan(bw / 2), gain = 1 / (1 + beta);
  return { b: [gain, -2 * gain * Math.cos(w0), gain], a: [1, -2 * gain * Math.cos(w0), 2 * gain - 1] };
}

/** Direct form II transposed filter (scipy.signal.lfilter) for a second-order section; zi is the initial state. */
export function lfilter(f: Ba, x: ArrayLike<number>, zi: [number, number] = [0, 0]): Float64Array {
  const [b0, b1, b2] = f.b.map((v) => v / f.a[0]), a1 = f.a[1] / f.a[0], a2 = f.a[2] / f.a[0];
  let z1 = zi[0], z2 = zi[1];
  const y = new Float64Array(x.length);
  for (let i = 0; i < x.length; i++) {
    const xi = x[i], yi = b0 * xi + z1;
    z1 = b1 * xi - a1 * yi + z2; z2 = b2 * xi - a2 * yi; y[i] = yi;
  }
  return y;
}

/** Steady-state initial state for a step input of 1 (scipy.signal.lfilter_zi). */
export function lfilterZi(f: Ba): [number, number] {
  const b = f.b.map((v) => v / f.a[0]), a1 = f.a[1] / f.a[0], a2 = f.a[2] / f.a[0];
  const B0 = b[1] - a1 * b[0], B1 = b[2] - a2 * b[0];
  // (I − companion(a)ᵀ) zi = B, with I − Aᵀ = [[1 + a1, −1], [a2, 1]].
  const det = (1 + a1) * 1 + a2;
  return [(B0 + B1) / det, ((1 + a1) * B1 - a2 * B0) / det];
}

/** Zero-phase filtering, forward then backward, with odd extension of 3 × 3 samples at each end (scipy.signal.filtfilt defaults). */
export function filtfilt(f: Ba, x: ArrayLike<number>): Float64Array {
  const n = x.length, pad = 9;
  if (n <= pad) throw new Error('The trace is too short to filter (it needs more than 9 samples).');
  const ext = new Float64Array(n + 2 * pad);
  for (let i = 0; i < pad; i++) { ext[i] = 2 * x[0] - x[pad - i]; ext[n + pad + i] = 2 * x[n - 1] - x[n - 2 - i]; }
  for (let i = 0; i < n; i++) ext[pad + i] = x[i];
  const zi = lfilterZi(f);
  const y = lfilter(f, ext, [zi[0] * ext[0], zi[1] * ext[0]]);
  y.reverse();
  const z = lfilter(f, y, [zi[0] * y[0], zi[1] * y[0]]);
  z.reverse();
  return z.slice(pad, pad + n);
}

/** The notch frequencies used: f0 and its harmonics below the Nyquist frequency. */
export function notchFreqs(f0: number, harmonics: number, fs: number): number[] {
  const out: number[] = [];
  for (let k = 1; k <= harmonics; k++) if (k * f0 < fs / 2 * 0.999) out.push(k * f0);
  return out;
}
/** Applies one notch per frequency in turn (zero-phase, or a single causal pass). */
export function removeLineNoise(x: ArrayLike<number>, fs: number, freqs: number[], Q: number, zeroPhase = true): Float64Array {
  let y: ArrayLike<number> = x;
  for (const f of freqs) { const ba = iirnotch(f, Q, fs); y = zeroPhase ? filtfilt(ba, y) : lfilter(ba, y); }
  return Float64Array.from(y);
}

/** Gain (0..1) of the notch cascade at frequency f (one pass; zero-phase squares it). */
export function cascadeGain(freqs: number[], Q: number, fs: number, f: number, zeroPhase = true): number {
  let g = 1;
  for (const f0 of freqs) {
    const { b, a } = iirnotch(f0, Q, fs), w = (2 * Math.PI * f) / fs;
    const H = (c: number[]) => { const re = c[0] + c[1] * Math.cos(w) + c[2] * Math.cos(2 * w), im = -(c[1] * Math.sin(w) + c[2] * Math.sin(2 * w)); return Math.hypot(re, im); };
    g *= H(b) / H(a);
  }
  return zeroPhase ? g * g : g;
}

/** Welch's averaged periodogram (scipy.signal.welch with detrend='constant', density scaling, mean averaging). */
export function welch(x: ArrayLike<number>, fs: number, nperseg: number, overlap = 0.5, win: WindowName = 'hann'): { f: number[]; psd: number[]; segments: number } {
  if (!isPow2(nperseg)) throw new Error('The segment length must be a power of two.');
  if (x.length < nperseg) throw new Error(`The trace has ${x.length} samples, fewer than one Welch segment (${nperseg}). Pick a shorter segment.`);
  const nover = Math.floor(nperseg * overlap), step = nperseg - nover, w = makeWindow(win, nperseg);
  const segs = Math.floor((x.length - nperseg) / step) + 1, acc = new Float64Array(nperseg / 2 + 1);
  for (let s = 0; s < segs; s++) segmentPsd(x, s * step, w, fs, acc, true);
  return { f: Array.from(acc, (_, k) => (k * fs) / nperseg), psd: Array.from(acc, (v) => v / segs), segments: segs };
}

/** Power in [lo, hi) Hz: the sum of PSD × frequency step over the bins in the band. */
export function bandPower(f: number[], psd: number[], lo: number, hi: number): number {
  const df = f[1] - f[0]; let s = 0;
  for (let i = 0; i < f.length; i++) if (f[i] >= lo && f[i] < hi) s += psd[i] * df;
  return s;
}

export type Band = { name: string; lo: number; hi: number };
/** "Delta 1-4; Theta 4-8" (semicolons or new lines; dash or "to") into bands. Throws on a bad entry. */
export function parseBands(text: string): Band[] {
  const out: Band[] = [];
  for (const part of text.split(/[;\n]/).map((s) => s.trim()).filter(Boolean)) {
    const m = part.match(/^(.*?)\s*(\d+(?:\.\d+)?)\s*(?:-|–|to)\s*(\d+(?:\.\d+)?)\s*(?:Hz)?$/i);
    if (!m) throw new Error(`Could not read the band "${part}". Write it as a name and a range, like "Alpha 8-13".`);
    const lo = Number(m[2]), hi = Number(m[3]);
    if (!(hi > lo)) throw new Error(`In "${part}" the upper edge must be above the lower.`);
    out.push({ name: m[1].trim() || `${lo}–${hi} Hz`, lo, hi });
  }
  return out;
}

/** The made-up example: 10 s at 500 Hz, in µV: 10 Hz alpha, 6 Hz theta, brown-ish noise, 50 Hz hum and its 3rd harmonic. */
export function exampleTrace(fs = 500, seed = 11): Float64Array {
  const n = 10 * fs, r = rng(seed), x = new Float64Array(n);
  let ar = 0;
  for (let i = 0; i < n; i++) {
    const t = i / fs; ar = 0.95 * ar + 2 * gauss(r);
    x[i] = 20 * Math.sin(2 * Math.PI * 10 * t) + 8 * Math.sin(2 * Math.PI * 6 * t + 1) + ar + 2 * gauss(r) + 30 * Math.sin(2 * Math.PI * 50 * t + 0.3) + 6 * Math.sin(2 * Math.PI * 150 * t);
  }
  return x;
}
