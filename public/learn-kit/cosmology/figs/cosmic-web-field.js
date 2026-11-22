// Shared maths for the Module 10 structure figures (not a figure itself): a small 2-D FFT, a random smooth
// density field, and its Zel'dovich displacement. Used by cosmic-web.js, galaxy-surveys.js and
// cosmological-simulations.js. Everything is in grid units on a periodic n × n box (n a power of 2).
import { rng } from '../../kit.js';

/** In-place radix-2 complex FFT of length N (re, im Float64Arrays). inv = true for the inverse (scaled by 1/N). */
export function fft1(re, im, inv = false) {
  const N = re.length;
  for (let i = 1, j = 0; i < N; i++) {
    let bit = N >> 1;
    for (; j & bit; bit >>= 1) j ^= bit;
    j ^= bit;
    if (i < j) { let t = re[i]; re[i] = re[j]; re[j] = t; t = im[i]; im[i] = im[j]; im[j] = t; }
  }
  for (let len = 2; len <= N; len <<= 1) {
    const ang = (inv ? 2 : -2) * Math.PI / len, wr = Math.cos(ang), wi = Math.sin(ang);
    for (let i = 0; i < N; i += len) {
      let cr = 1, ci = 0;
      for (let k = 0; k < len / 2; k++) {
        const a = i + k, b = a + len / 2;
        const xr = re[b] * cr - im[b] * ci, xi = re[b] * ci + im[b] * cr;
        re[b] = re[a] - xr; im[b] = im[a] - xi; re[a] += xr; im[a] += xi;
        const t = cr * wr - ci * wi; ci = cr * wi + ci * wr; cr = t;
      }
    }
  }
  if (inv) for (let i = 0; i < N; i++) { re[i] /= N; im[i] /= N; }
}

/** 2-D FFT of an n × n grid stored row by row. */
export function fft2(re, im, n, inv = false) {
  const r = new Float64Array(n), i2 = new Float64Array(n);
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) { r[x] = re[y * n + x]; i2[x] = im[y * n + x]; }
    fft1(r, i2, inv);
    for (let x = 0; x < n; x++) { re[y * n + x] = r[x]; im[y * n + x] = i2[x]; }
  }
  for (let x = 0; x < n; x++) {
    for (let y = 0; y < n; y++) { r[y] = re[y * n + x]; i2[y] = im[y * n + x]; }
    fft1(r, i2, inv);
    for (let y = 0; y < n; y++) { re[y * n + x] = r[y]; im[y * n + x] = i2[y]; }
  }
}

/** Wavenumber (radians per grid cell) of FFT index i on an n grid. */
export const kOf = (i, n) => (2 * Math.PI * (i <= n / 2 ? i : i - n)) / n;

/**
 * A random smooth density field δ(x) in Fourier space: power P(k) ∝ k^slope, smoothed by exp(−(k/kc)²).
 * Returns { re, im } (the Fourier transform of a real field, so it can be turned into displacements).
 */
export function randomField(n, seed, { slope = -1.6, kc = 0.6 } = {}) {
  const r = rng(seed), N = n * n;
  const re = new Float64Array(N), im = new Float64Array(N);
  const gauss = () => Math.sqrt(-2 * Math.log(r() + 1e-12)) * Math.cos(2 * Math.PI * r());
  for (let i = 0; i < N; i++) re[i] = gauss(); // white noise in real space
  fft2(re, im, n);
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
    const kx = kOf(x, n), ky = kOf(y, n), k = Math.hypot(kx, ky), j = y * n + x;
    const amp = k === 0 ? 0 : Math.pow(k, slope / 2) * Math.exp(-(k * k) / (2 * kc * kc));
    re[j] *= amp; im[j] *= amp;
  }
  return { re, im };
}

/**
 * Zel'dovich displacement ψ (grid units) for a field given in Fourier space: ψ_k = i k δ_k / k², so δ = −∇·ψ.
 * Scaled so that the linear density contrast has rms 1. Returns { px, py, delta } as real-space Float64Arrays.
 */
export function displacement(field, n) {
  const N = n * n;
  const ar = new Float64Array(N), ai = new Float64Array(N), dr = new Float64Array(field.re), di = new Float64Array(field.im);
  // ψx + i ψy = ifft( i kx S − ky S ), S = δ_k / k², because both are real fields
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
    const kx = kOf(x, n), ky = kOf(y, n), k2 = kx * kx + ky * ky, j = y * n + x;
    if (!k2) continue;
    const sr = field.re[j] / k2, si = field.im[j] / k2;
    // i kx S = (−kx si) + i (kx sr);  − ky S = (−ky sr) + i (−ky si)
    ar[j] = -kx * si - ky * sr; ai[j] = kx * sr - ky * si;
  }
  fft2(ar, ai, n, true);
  fft2(dr, di, n, true);
  let s = 0; for (let i = 0; i < N; i++) s += dr[i] * dr[i];
  const norm = 1 / Math.sqrt(s / N || 1);
  for (let i = 0; i < N; i++) { ar[i] *= norm; ai[i] *= norm; dr[i] *= norm; }
  return { px: ar, py: ai, delta: dr };
}

/** Parse any CSS colour into [r, g, b] (0-255), for writing pixels. */
export function rgbOf(c) {
  const cv = document.createElement('canvas').getContext('2d');
  cv.fillStyle = '#000'; cv.fillStyle = c || '#000';
  const s = cv.fillStyle;
  if (s[0] === '#') return [1, 3, 5].map((i) => parseInt(s.slice(i, i + 2), 16));
  const m = s.match(/[\d.]+/g) || [0, 0, 0];
  return m.slice(0, 3).map(Number);
}
