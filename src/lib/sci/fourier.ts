// Fourier series of standard and typed periodic waves (exact coefficients where they are known, numerical
// otherwise), partial sums and the Gibbs overshoot; the complex DFT of a closed path for epicycle drawings; and the
// FFT (radix-2, with Bluestein's algorithm for any length) with windows, amplitude and phase spectra.
// Plain TypeScript, no DOM.

// ---------- FFT ----------

/** In-place radix-2 FFT of length 2^k. `inv` gives the unscaled inverse. */
function fft2(re: Float64Array, im: Float64Array, inv = false) {
  const n = re.length;
  for (let i = 1, j = 0; i < n; i++) {
    let bit = n >> 1;
    for (; j & bit; bit >>= 1) j ^= bit;
    j ^= bit;
    if (i < j) { [re[i], re[j]] = [re[j], re[i]]; [im[i], im[j]] = [im[j], im[i]]; }
  }
  for (let len = 2; len <= n; len <<= 1) {
    const ang = ((inv ? 2 : -2) * Math.PI) / len, wr = Math.cos(ang), wi = Math.sin(ang);
    for (let i = 0; i < n; i += len) {
      let cr = 1, ci = 0;
      for (let k = 0; k < len / 2; k++) {
        const a = i + k, b = a + len / 2;
        const tr = re[b] * cr - im[b] * ci, ti = re[b] * ci + im[b] * cr;
        re[b] = re[a] - tr; im[b] = im[a] - ti; re[a] += tr; im[a] += ti;
        const nr = cr * wr - ci * wi; ci = cr * wi + ci * wr; cr = nr;
      }
    }
  }
}

/** DFT X_k = Σ x_n e^(−2πikn/N) for any N (radix-2, or Bluestein's chirp-z for other lengths). */
export function fft(reIn: ArrayLike<number>, imIn?: ArrayLike<number>): { re: Float64Array; im: Float64Array } {
  const n = reIn.length;
  const re = Float64Array.from(reIn), im = imIn ? Float64Array.from(imIn) : new Float64Array(n);
  if (n <= 1) return { re, im };
  if ((n & (n - 1)) === 0) { fft2(re, im); return { re, im }; }
  let m = 1; while (m < 2 * n - 1) m <<= 1;
  // Chirp w_k = e^(−iπk²/n); k² mod 2n keeps the angle exact for large k.
  const cr = new Float64Array(n), ci = new Float64Array(n);
  for (let k = 0; k < n; k++) { const a = (Math.PI * ((k * k) % (2 * n))) / n; cr[k] = Math.cos(a); ci[k] = -Math.sin(a); }
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

export type WindowId = 'rect' | 'hann' | 'hamming' | 'blackman' | 'flattop';
export const WINDOWS: Record<WindowId, string> = { rect: 'None (rectangular)', hann: 'Hann', hamming: 'Hamming', blackman: 'Blackman', flattop: 'Flat top' };
/** Periodic ("DFT-even") windows, as scipy.signal.get_window gives by default. */
export function windowFn(id: WindowId, n: number): Float64Array {
  const w = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    const x = (2 * Math.PI * i) / n;
    w[i] = id === 'rect' ? 1
      : id === 'hann' ? 0.5 - 0.5 * Math.cos(x)
      : id === 'hamming' ? 0.54 - 0.46 * Math.cos(x)
      : id === 'blackman' ? 0.42 - 0.5 * Math.cos(x) + 0.08 * Math.cos(2 * x)
      : 0.21557895 - 0.41663158 * Math.cos(x) + 0.277263158 * Math.cos(2 * x) - 0.083578947 * Math.cos(3 * x) + 0.006947368 * Math.cos(4 * x);
  }
  return w;
}

export type Spectrum = { f: number[]; amp: number[]; phase: number[]; df: number; n: number; mean: number; enbw: number };
/**
 * One-sided amplitude spectrum: a sine of amplitude A on a bin shows as A (the window's coherent gain is divided
 * out). Phase in degrees, of cos(2πft + φ). `fs` is the sample rate.
 */
export function spectrum(x: number[], fs: number, win: WindowId = 'rect', removeMean = false): Spectrum {
  const n = x.length, mean = x.reduce((s, v) => s + v, 0) / n;
  const w = windowFn(win, n), sw = w.reduce((s, v) => s + v, 0), sw2 = w.reduce((s, v) => s + v * v, 0);
  const y = x.map((v, i) => (removeMean ? v - mean : v) * w[i]);
  const X = fft(y), half = Math.floor(n / 2);
  const f: number[] = [], amp: number[] = [], phase: number[] = [];
  for (let k = 0; k <= half; k++) {
    const m = Math.hypot(X.re[k], X.im[k]) / sw;
    f.push((k * fs) / n);
    amp.push(k === 0 || (n % 2 === 0 && k === half) ? m : 2 * m);
    phase.push((Math.atan2(X.im[k], X.re[k]) * 180) / Math.PI);
  }
  return { f, amp, phase, df: fs / n, n, mean, enbw: (n * sw2) / (sw * sw) };
}

/** The largest local maxima of the amplitude spectrum (DC left out), with the peak frequency refined by a parabola through the log amplitudes. */
export function peaks(s: Spectrum, count = 5): { f: number; amp: number; bin: number }[] {
  const out: { f: number; amp: number; bin: number }[] = [];
  const a = s.amp, top = Math.max(...a.slice(1));
  for (let k = 1; k < a.length; k++) {
    const l = a[k - 1], r = k + 1 < a.length ? a[k + 1] : -Infinity;
    if (a[k] > l && a[k] >= r && a[k] > 1e-9 * top) {
      let d = 0;
      // Parabola through the logs of the peak and its neighbours (nearly exact for a Gaussian-like window peak).
      if (Number.isFinite(r) && k > 1 && Math.max(l, r) > 1e-6 * a[k]) { const L = Math.log(Math.max(l, 1e-300)), C = Math.log(a[k]), Rr = Math.log(Math.max(r, 1e-300)), den = L - 2 * C + Rr; if (den < 0) d = Math.max(-0.5, Math.min(0.5, (0.5 * (L - Rr)) / den)); }
      out.push({ f: (k + d) * s.df, amp: a[k], bin: k });
    }
  }
  return out.sort((p, q) => q.amp - p.amp).slice(0, count);
}

// ---------- Fourier series ----------

export type WaveId = 'square' | 'sawtooth' | 'triangle' | 'halfsine' | 'fullsine' | 'pulse';
export const WAVES: Record<WaveId, { name: string; formula: string }> = {
  square: { name: 'Square wave', formula: 'f = −1 for −π < t < 0, +1 for 0 < t < π; bₙ = 4/(nπ) for odd n' },
  sawtooth: { name: 'Sawtooth', formula: 'f = t/π on −π < t < π; bₙ = 2(−1)ⁿ⁺¹/(nπ)' },
  triangle: { name: 'Triangle', formula: 'f = 1 − 2|t|/π; aₙ = 8/(π²n²) for odd n' },
  halfsine: { name: 'Half-wave rectified sine', formula: 'f = max(sin t, 0); a₀/2 = 1/π, b₁ = ½, aₙ = −2/(π(n² − 1)) for even n' },
  fullsine: { name: 'Full-wave rectified sine', formula: 'f = |sin t|; a₀/2 = 2/π, aₙ = −4/(π(n² − 1)) for even n' },
  pulse: { name: 'Pulse train', formula: 'f = 1 for |t| < πD, else 0; a₀/2 = D, aₙ = 2 sin(nπD)/(nπ)' },
};
/** The wave itself on its 2π period. `d` is the pulse duty cycle (0 to 1). */
export function waveValue(id: WaveId, t: number, d = 0.25): number {
  const u = t - 2 * Math.PI * Math.floor((t + Math.PI) / (2 * Math.PI)); // into [−π, π)
  switch (id) {
    case 'square': return u === 0 || u === -Math.PI ? 0 : Math.sign(u);
    case 'sawtooth': return u === -Math.PI ? 0 : u / Math.PI;
    case 'triangle': return 1 - (2 * Math.abs(u)) / Math.PI;
    case 'halfsine': return Math.max(Math.sin(u), 0);
    case 'fullsine': return Math.abs(Math.sin(u));
    case 'pulse': return Math.abs(u) < Math.PI * d ? 1 : Math.abs(u) === Math.PI * d ? 0.5 : 0;
  }
}

export type Coeffs = { a0: number; a: number[]; b: number[] }; // f ≈ a0/2 + Σ aₙ cos nt + bₙ sin nt; a[0], b[0] unused.
/** Exact coefficients of the standard waves, n = 1..N. */
export function exactCoeffs(id: WaveId, N: number, d = 0.25): Coeffs {
  const a = new Array<number>(N + 1).fill(0), b = new Array<number>(N + 1).fill(0);
  let a0 = 0;
  const P = Math.PI;
  if (id === 'halfsine') a0 = 2 / P;
  if (id === 'fullsine') a0 = 4 / P;
  if (id === 'pulse') a0 = 2 * d;
  for (let n = 1; n <= N; n++) {
    if (id === 'square') b[n] = n % 2 ? 4 / (n * P) : 0;
    if (id === 'sawtooth') b[n] = (2 * (n % 2 ? 1 : -1)) / (n * P);
    if (id === 'triangle') a[n] = n % 2 ? 8 / (P * P * n * n) : 0;
    if (id === 'halfsine') { if (n === 1) b[1] = 0.5; else if (n % 2 === 0) a[n] = -2 / (P * (n * n - 1)); }
    if (id === 'fullsine') { if (n % 2 === 0) a[n] = -4 / (P * (n * n - 1)); }
    if (id === 'pulse') a[n] = (2 * Math.sin(n * P * d)) / (n * P);
  }
  return { a0, a, b };
}

/** Coefficients of any function on −π < t < π from M equally spaced samples (FFT; jumps are averaged). */
export function numericCoeffs(f: (t: number) => number, N: number, M = 16384): Coeffs {
  const x = new Array<number>(M);
  for (let j = 0; j < M; j++) x[j] = f(-Math.PI + (2 * Math.PI * j) / M);
  // At t = −π the periodic extension jumps: use the average of both ends.
  const right = f(Math.PI - 1e-12), left = f(-Math.PI + 1e-12);
  if (Number.isFinite(right) && Number.isFinite(left)) x[0] = (left + right) / 2;
  const X = fft(x);
  const a = new Array<number>(N + 1).fill(0), b = new Array<number>(N + 1).fill(0);
  // Samples start at −π: X_k e^(−ik(−π))... shift by (−1)^k.
  for (let n = 1; n <= Math.min(N, M / 2 - 1); n++) {
    const s = n % 2 ? -1 : 1;
    a[n] = (2 * s * X.re[n]) / M; b[n] = (-2 * s * X.im[n]) / M;
  }
  return { a0: (2 * X.re[0]) / M, a, b };
}

/** Partial sum with N terms, optionally with Fejér (Cesàro) or Lanczos σ factors that tame the Gibbs ripples. */
export function partialSum(c: Coeffs, N: number, t: number, smooth: 'none' | 'fejer' | 'lanczos' = 'none'): number {
  let s = c.a0 / 2;
  for (let n = 1; n <= N; n++) {
    const g = smooth === 'fejer' ? 1 - n / (N + 1) : smooth === 'lanczos' ? (n === 0 ? 1 : Math.sin((Math.PI * n) / (N + 1)) / ((Math.PI * n) / (N + 1))) : 1;
    s += g * (c.a[n] * Math.cos(n * t) + c.b[n] * Math.sin(n * t));
  }
  return s;
}

/** Mean square of the function minus that of its N-term partial sum (Parseval): the mean square error. */
export function parsevalError(meanSquare: number, c: Coeffs, N: number): number {
  let s = (c.a0 * c.a0) / 4;
  for (let n = 1; n <= N; n++) s += (c.a[n] * c.a[n] + c.b[n] * c.b[n]) / 2;
  return Math.max(0, meanSquare - s);
}

/** Largest value of the partial sum on a fine grid over one period (the Gibbs overshoot shows here). */
export function maxPartial(c: Coeffs, N: number, smooth: 'none' | 'fejer' | 'lanczos' = 'none'): { t: number; v: number } {
  let best = { t: 0, v: -Infinity };
  const M = Math.max(4000, 16 * N);
  for (let j = 0; j <= M; j++) { const t = -Math.PI + (2 * Math.PI * j) / M, v = partialSum(c, N, t, smooth); if (v > best.v) best = { t, v }; }
  // Refine by golden section around the best grid point.
  let lo = best.t - (2 * Math.PI) / M, hi = best.t + (2 * Math.PI) / M;
  for (let i = 0; i < 60; i++) { const m1 = lo + (hi - lo) * 0.382, m2 = lo + (hi - lo) * 0.618; if (partialSum(c, N, m1, smooth) > partialSum(c, N, m2, smooth)) hi = m2; else lo = m1; }
  const t = (lo + hi) / 2;
  return { t, v: Math.max(best.v, partialSum(c, N, t, smooth)) };
}

/** Mean of f² over a period by the midpoint rule. */
export function meanSquare(f: (t: number) => number, M = 200000): number {
  let s = 0;
  for (let j = 0; j < M; j++) { const v = f(-Math.PI + (2 * Math.PI * (j + 0.5)) / M); s += v * v; }
  return s / M;
}

// ---------- Epicycles ----------

export type Circle = { k: number; amp: number; phase: number; re: number; im: number };
/** Resample a closed path to n points equally spaced along its length. */
export function resample(pts: [number, number][], n: number): [number, number][] {
  const P = [...pts, pts[0]], L = [0];
  for (let i = 1; i < P.length; i++) L.push(L[i - 1] + Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]));
  const total = L[L.length - 1], out: [number, number][] = [];
  if (!(total > 0)) return pts.slice(0, 1);
  let j = 0;
  for (let i = 0; i < n; i++) {
    const s = (total * i) / n;
    while (j < L.length - 2 && L[j + 1] < s) j++;
    const seg = L[j + 1] - L[j], u = seg > 0 ? (s - L[j]) / seg : 0;
    out.push([P[j][0] + u * (P[j + 1][0] - P[j][0]), P[j][1] + u * (P[j + 1][1] - P[j][1])]);
  }
  return out;
}
/** Circles of a closed path z(t) = Σ c_k e^(ikt), largest first. Frequencies k run from −N/2 to N/2 − 1. */
export function epicycles(pts: [number, number][]): Circle[] {
  const n = pts.length, X = fft(pts.map((p) => p[0]), pts.map((p) => p[1]));
  const out: Circle[] = [];
  for (let j = 0; j < n; j++) {
    const k = j < n / 2 ? j : j - n, re = X.re[j] / n, im = X.im[j] / n;
    out.push({ k, re, im, amp: Math.hypot(re, im), phase: Math.atan2(im, re) });
  }
  // DFT uses e^(−2πijn/N); the path is z_m = Σ c_k e^(+2πikm/N).
  return out.sort((a, b) => b.amp - a.amp || Math.abs(a.k) - Math.abs(b.k));
}
/** The path drawn by the first K circles at time t (0 to 2π covers the whole path). */
export function epicyclePoint(c: Circle[], K: number, t: number): [number, number] {
  let x = 0, y = 0;
  for (let i = 0; i < Math.min(K, c.length); i++) { const a = c[i].k * t; x += c[i].re * Math.cos(a) - c[i].im * Math.sin(a); y += c[i].re * Math.sin(a) + c[i].im * Math.cos(a); }
  return [x, y];
}

/** Built-in closed shapes, as point lists (made from formulas). */
export function shape(id: 'heart' | 'star' | 'square' | 'eight' | 'trefoil', n = 400): [number, number][] {
  const out: [number, number][] = [];
  if (id === 'star' || id === 'square') {
    const corners: [number, number][] = id === 'square' ? [[1, 1], [-1, 1], [-1, -1], [1, -1]] : Array.from({ length: 10 }, (_, i) => { const r = i % 2 ? 0.42 : 1, a = Math.PI / 2 + (i * Math.PI) / 5; return [r * Math.cos(a), r * Math.sin(a)] as [number, number]; });
    return resample(corners, n);
  }
  for (let i = 0; i < n; i++) {
    const t = (2 * Math.PI * i) / n;
    if (id === 'heart') out.push([(16 * Math.sin(t) ** 3) / 17, (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) / 17]);
    if (id === 'eight') out.push([Math.sin(t), Math.sin(t) * Math.cos(t)]);
    if (id === 'trefoil') out.push([(Math.sin(t) + 2 * Math.sin(2 * t)) / 3, (Math.cos(t) - 2 * Math.cos(2 * t)) / 3]);
  }
  return out;
}
