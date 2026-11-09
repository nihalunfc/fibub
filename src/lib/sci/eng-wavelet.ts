// Wavelet transforms. Continuous (Morlet, real and complex) computed the way PyWavelets' pywt.cwt does it (integrated
// wavelet resampled per scale, convolved and differenced, precision 2^12), and the discrete multilevel decomposition
// (pywt.wavedec) with Haar and Daubechies filters, symmetric or periodization edges. Plain TypeScript, no DOM; checked
// against PyWavelets 1.8 in tests/sci-tools/wavelet-viewer.mjs.
import { fft } from './eng-fft.ts';

export type CwtWavelet = { kind: 'cmor'; B: number; C: number } | { kind: 'morl' };
const LB = -8, UB = 8;

/** The wavelet sampled on 2^precision points from −8 to 8 (as pywt's wavefun), real and imaginary parts. */
export function wavefun(w: CwtWavelet, precision = 12): { x: Float64Array; re: Float64Array; im: Float64Array } {
  const n = 2 ** precision, st = (UB - LB) / (n - 1), x = new Float64Array(n), re = new Float64Array(n), im = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    const t = i === n - 1 ? UB : i * st + LB;
    x[i] = t;
    if (w.kind === 'morl') re[i] = Math.exp(-(t * t) / 2) * Math.cos(5 * t);
    else { const a = Math.exp(-(t * t) / w.B) / Math.sqrt(Math.PI * w.B), ph = 2 * Math.PI * w.C * t; re[i] = a * Math.cos(ph); im[i] = a * Math.sin(ph); }
  }
  return { x, re, im };
}
/** Centre frequency in cycles per unit of the wavelet's own time (pywt.central_frequency, precision 8). */
export function centralFrequency(w: CwtWavelet, precision = 8): number {
  const { re, im, x } = wavefun(w, precision), n = re.length, X = fft(re, im);
  let best = 1, bv = -1;
  for (let k = 1; k < n; k++) { const m = Math.hypot(X.re[k], X.im[k]); if (m > bv) { bv = m; best = k; } }
  let index = best + 1;
  if (index > n / 2) index = n - index + 2;
  return 1 / ((x[n - 1] - x[0]) / (index - 1));
}

/** Linear convolution of a real signal with a complex kernel, by FFT. */
function convolve(data: ArrayLike<number>, kr: Float64Array, ki: Float64Array): { re: Float64Array; im: Float64Array } {
  const n = data.length + kr.length - 1;
  let m = 1; while (m < n) m <<= 1;
  const a = new Float64Array(m), br = new Float64Array(m), bi = new Float64Array(m);
  for (let i = 0; i < data.length; i++) a[i] = data[i];
  br.set(kr); bi.set(ki);
  const A = fft(a), B = fft(br, bi);
  const pr = new Float64Array(m), pi = new Float64Array(m);
  for (let k = 0; k < m; k++) { pr[k] = A.re[k] * B.re[k] - A.im[k] * B.im[k]; pi[k] = A.re[k] * B.im[k] + A.im[k] * B.re[k]; }
  const r = fft(pr, pi, true);
  return { re: r.re.slice(0, n).map((v) => v / m), im: r.im.slice(0, n).map((v) => v / m) };
}

/**
 * Continuous wavelet transform at the given scales (in samples), as pywt.cwt(data, scales, wavelet, method='conv').
 * Returns real and imaginary parts per scale (imaginary all zero for the real Morlet).
 */
export function cwt(data: ArrayLike<number>, scales: number[], w: CwtWavelet, precision = 12): { re: Float64Array[]; im: Float64Array[] } {
  const { re, im, x } = wavefun(w, precision), n = re.length;
  const step = x[1] - x[0];
  // Integrated wavelet (cumulative sum × step), conjugated for the complex wavelet.
  const ir = new Float64Array(n), ii = new Float64Array(n);
  let sr = 0, si = 0;
  for (let i = 0; i < n; i++) { sr += re[i]; si += im[i]; ir[i] = sr * step; ii[i] = -si * step; }
  const outR: Float64Array[] = [], outI: Float64Array[] = [], N = data.length;
  for (const scale of scales) {
    const len = Math.ceil(scale * (x[n - 1] - x[0]) + 1);
    const idx: number[] = [];
    for (let k = 0; k < len; k++) { const j = Math.floor(k / (scale * step)); if (j < n) idx.push(j); }
    const L = idx.length, kr = new Float64Array(L), ki = new Float64Array(L);
    for (let k = 0; k < L; k++) { kr[k] = ir[idx[L - 1 - k]]; ki[k] = ii[idx[L - 1 - k]]; }
    const c = convolve(data, kr, ki), M = c.re.length - 1, d = (M - N) / 2;
    if (d < 0) throw new Error(`Scale ${scale} is too small.`);
    const lo = Math.floor(d), g = -Math.sqrt(scale);
    const r = new Float64Array(N), i2 = new Float64Array(N);
    for (let t = 0; t < N; t++) { r[t] = g * (c.re[lo + t + 1] - c.re[lo + t]); i2[t] = g * (c.im[lo + t + 1] - c.im[lo + t]); }
    outR.push(r); outI.push(i2);
  }
  return { re: outR, im: outI };
}

/** Decomposition low-pass filters (the wavelets' defining constants). High-pass: dec_hi[k] = (−1)^(k+1) dec_lo[L−1−k]. */
export const DWT_FILTERS: Record<string, { name: string; lo: number[] }> = {
  haar: { name: 'Haar', lo: [Math.SQRT1_2, Math.SQRT1_2] },
  db2: { name: 'Daubechies D4 (db2, 4 taps)', lo: [-0.12940952255126037, 0.2241438680420134, 0.8365163037378079, 0.48296291314453416] },
  db4: { name: 'Daubechies db4 (8 taps)', lo: [-0.010597401785069032, 0.0328830116668852, 0.030841381835560764, -0.18703481171909309, -0.027983769416859854, 0.6308807679298589, 0.7148465705529157, 0.2303778133088965] },
};
export const decHi = (lo: number[]) => lo.map((_, k) => (k % 2 ? 1 : -1) * lo[lo.length - 1 - k]);

export type DwtMode = 'symmetric' | 'periodization';
/** One level of the DWT (pywt.dwt): approximation and detail coefficients. */
export function dwt(x: ArrayLike<number>, lo: number[], mode: DwtMode = 'symmetric'): { cA: number[]; cD: number[] } {
  const hi = decHi(lo), L = lo.length, N = x.length, cA: number[] = [], cD: number[] = [];
  if (mode === 'periodization') {
    const xp = Array.from(x); if (N % 2) xp.push(x[N - 1]);
    const M = xp.length;
    for (let i = L / 2; i < L / 2 + M; i += 2) { let a = 0, d = 0; for (let j = 0; j < L; j++) { const v = xp[(((i - j) % M) + M) % M]; a += lo[j] * v; d += hi[j] * v; } cA.push(a); cD.push(d); }
    return { cA, cD };
  }
  const xe = (k: number) => { while (k < 0 || k >= N) k = k < 0 ? -k - 1 : 2 * N - 1 - k; return x[k]; };
  for (let i = 1; i < N + L - 1; i += 2) { let a = 0, d = 0; for (let j = 0; j < L; j++) { const v = xe(i - j); a += lo[j] * v; d += hi[j] * v; } cA.push(a); cD.push(d); }
  return { cA, cD };
}
/** Deepest useful level (pywt.dwt_max_level). */
export const maxLevel = (n: number, L: number) => (n < L - 1 ? 0 : Math.floor(Math.log2(n / (L - 1))));
/** Multilevel decomposition (pywt.wavedec): [cA_n, cD_n, …, cD_1]. */
export function wavedec(x: ArrayLike<number>, lo: number[], level: number, mode: DwtMode = 'symmetric'): number[][] {
  let a: ArrayLike<number> = x;
  const ds: number[][] = [];
  for (let l = 0; l < level; l++) { const r = dwt(a, lo, mode); ds.unshift(r.cD); a = r.cA; }
  return [Array.from(a), ...ds];
}
