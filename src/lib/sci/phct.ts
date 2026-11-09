// CT reconstruction for teaching: parallel-beam projections (sinogram) of a phantom made of ellipses, worked
// out exactly from the ellipse formulas, and filtered back-projection with a choice of filters. Plain
// TypeScript, no DOM. Coordinates run from −1 to 1 across the image; the phantoms are made up.
import { fft } from './phmri.ts';

export type Ellipse = { x: number; y: number; a: number; b: number; phi: number; v: number };
export type Filter = 'none' | 'ramp' | 'shepp' | 'cosine' | 'hann';

/** Made-up test objects (attenuation in arbitrary units, values add where ellipses overlap). */
export const PHANTOMS: Record<string, { name: string; e: Ellipse[] }> = {
  head: { name: 'Head-like (made up)', e: [
    { x: 0, y: 0, a: 0.7, b: 0.9, phi: 0, v: 1 },
    { x: 0, y: -0.02, a: 0.64, b: 0.83, phi: 0, v: -0.75 },
    { x: -0.2, y: 0.05, a: 0.12, b: 0.3, phi: 15, v: -0.15 },
    { x: 0.2, y: 0.05, a: 0.12, b: 0.3, phi: -15, v: -0.15 },
    { x: 0, y: 0.45, a: 0.2, b: 0.15, phi: 0, v: 0.12 },
    { x: 0.1, y: -0.45, a: 0.05, b: 0.05, phi: 0, v: 0.2 },
    { x: -0.1, y: -0.45, a: 0.03, b: 0.03, phi: 0, v: 0.2 },
    { x: 0, y: -0.25, a: 0.08, b: 0.04, phi: 30, v: 0.1 },
  ] },
  disc: { name: 'Uniform disc', e: [{ x: 0, y: 0, a: 0.6, b: 0.6, phi: 0, v: 1 }] },
  dots: { name: 'Small dots (resolution)', e: [0.05, 0.035, 0.025, 0.015].flatMap((r, i) => [-1, 1].map((s) => ({ x: -0.45 + i * 0.3, y: s * 2.5 * r, a: r, b: r, phi: 0, v: 1 }))) },
};

/** Value of the phantom at (x, y). */
export function phantomAt(e: Ellipse[], x: number, y: number): number {
  let v = 0;
  for (const el of e) {
    const c = Math.cos((el.phi * Math.PI) / 180), s = Math.sin((el.phi * Math.PI) / 180), dx = x - el.x, dy = y - el.y;
    const u = dx * c + dy * s, w = -dx * s + dy * c;
    if ((u / el.a) ** 2 + (w / el.b) ** 2 <= 1) v += el.v;
  }
  return v;
}
/** The phantom sampled at pixel centres on an N × N grid (row 0 at the top, y = +1). */
export function rasterise(e: Ellipse[], N: number): Float64Array {
  const img = new Float64Array(N * N), d = 2 / N;
  for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) img[j * N + i] = phantomAt(e, -1 + (i + 0.5) * d, 1 - (j + 0.5) * d);
  return img;
}
/**
 * Exact line integral of the ellipses along the line x cos θ + y sin θ = t (θ in degrees), in units of image
 * pixels (2/N), as a pixel-summing scanner would record.
 */
export function project(e: Ellipse[], thetaDeg: number, t: number, N: number): number {
  const th = (thetaDeg * Math.PI) / 180, ct = Math.cos(th), st = Math.sin(th);
  let p = 0;
  for (const el of e) {
    const g = th - (el.phi * Math.PI) / 180, s2 = el.a ** 2 * Math.cos(g) ** 2 + el.b ** 2 * Math.sin(g) ** 2;
    const tt = t - (el.x * ct + el.y * st);
    if (tt * tt < s2) p += (2 * el.v * el.a * el.b * Math.sqrt(s2 - tt * tt)) / s2;
  }
  return p / (2 / N);
}
/** Projection angles: n equally spaced over [0, range) degrees. */
export const angles = (n: number, range = 180) => Array.from({ length: n }, (_, k) => (k * range) / n);
/** Detector positions: N bins across −1..1, at bin centres. */
export const detector = (N: number) => Array.from({ length: N }, (_, i) => -1 + (i + 0.5) * (2 / N));

/** A small seeded random number generator (mulberry32) and normal deviates for repeatable noise. */
export function rng(seed: number) {
  let a = seed >>> 0;
  const u = () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  return { u, n: () => { const r = Math.sqrt(-2 * Math.log(1 - u())), q = 2 * Math.PI * u(); return r * Math.cos(q); } };
}
/** Sinogram rows (one per angle) of N detector bins, with optional Gaussian noise (sd = noise × the largest value). */
export function sinogram(e: Ellipse[], th: number[], N: number, noise = 0, seed = 7): Float64Array[] {
  const ts = detector(N), rows = th.map((a) => Float64Array.from(ts, (t) => project(e, a, t, N)));
  if (noise > 0) {
    const mx = Math.max(...rows.map((r) => Math.max(...r))), g = rng(seed);
    for (const r of rows) for (let i = 0; i < N; i++) r[i] += noise * mx * g.n();
  }
  return rows;
}

/**
 * The frequency response (length P, FFT order) of the discrete ramp filter of Kak and Slaney (spatial kernel
 * h[0] = 1/4, h[n] = −1/(π n)² for odd n, 0 for even n), optionally times a window: Shepp-Logan (sinc),
 * cosine or Hann. f is the frequency in cycles per sample, from −0.5 to 0.5.
 */
export function filterResponse(P: number, kind: Filter): Float64Array {
  const re = new Float64Array(P), im = new Float64Array(P);
  if (kind === 'none') return re.fill(1);
  re[0] = 0.25;
  for (let n = 1; n < P / 2; n += 2) { const h = -1 / (Math.PI * n) ** 2; re[n] = h; re[P - n] = h; }
  fft(re, im);
  for (let k = 0; k < P; k++) {
    const f = (k < P / 2 ? k : k - P) / P, w = Math.PI * f;
    let win = 1;
    if (kind === 'shepp' && k) win = Math.sin(w) / w;
    else if (kind === 'cosine') win = Math.cos(w);
    else if (kind === 'hann') win = 0.5 * (1 + Math.cos(2 * w));
    re[k] *= win;
  }
  return re;
}
/** Each sinogram row filtered (zero-padded FFT convolution). */
export function filterRows(rows: Float64Array[], kind: Filter): Float64Array[] {
  if (kind === 'none') return rows.map((r) => Float64Array.from(r));
  const N = rows[0].length;
  let P = 64; while (P < 2 * N) P <<= 1;
  const H = filterResponse(P, kind);
  return rows.map((r) => {
    const re = new Float64Array(P), im = new Float64Array(P);
    re.set(r); fft(re, im);
    for (let k = 0; k < P; k++) { re[k] *= H[k]; im[k] *= H[k]; }
    fft(re, im, true);
    return re.slice(0, N);
  });
}
/** Back-project rows taken at angles th (degrees) onto an N × N grid with linear interpolation, times π / (number of angles). */
export function backProject(rows: Float64Array[], th: number[], N: number): Float64Array {
  const img = new Float64Array(N * N), d = 2 / N, scale = Math.PI / th.length;
  th.forEach((a, k) => {
    const c = Math.cos((a * Math.PI) / 180), s = Math.sin((a * Math.PI) / 180), r = rows[k];
    for (let j = 0; j < N; j++) {
      const y = 1 - (j + 0.5) * d;
      for (let i = 0; i < N; i++) {
        const x = -1 + (i + 0.5) * d, pos = (x * c + y * s + 1) / d - 0.5, i0 = Math.floor(pos), fr = pos - i0;
        const v0 = i0 >= 0 && i0 < N ? r[i0] : 0, v1 = i0 + 1 >= 0 && i0 + 1 < N ? r[i0 + 1] : 0;
        img[j * N + i] += (v0 * (1 - fr) + v1 * fr) * scale;
      }
    }
  });
  return img;
}
/** Full filtered back-projection. With filter 'none' the result is the blurred plain back-projection. */
export const fbp = (rows: Float64Array[], th: number[], N: number, kind: Filter) => backProject(filterRows(rows, kind), th, N);

/** Root-mean-square difference inside the reconstruction circle (radius 1). */
export function rmse(a: Float64Array, b: Float64Array, N: number): number {
  let s = 0, n = 0; const d = 2 / N;
  for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
    const x = -1 + (i + 0.5) * d, y = 1 - (j + 0.5) * d;
    if (x * x + y * y < 1) { s += (a[j * N + i] - b[j * N + i]) ** 2; n++; }
  }
  return Math.sqrt(s / n);
}
