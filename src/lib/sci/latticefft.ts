// Lattice spacings from the Fourier transform of a square region of an image (HRTEM, STEM, AFM). No DOM. A radix-2
// FFT (forward unscaled and inverse divided by N², as NumPy), mean removal, a Hann window (numpy.hanning) and zero
// padding; the power spectrum centred (fftshift); spots refined to a fraction of a pixel by fitting a parabola to the
// log power; d-spacing = 1 / |spatial frequency| and the angle of the planes' normal; automatic spot finding with
// Friedel pairs merged; and a mask-and-inverse (Bragg) filter.
import { rng, gauss, drawBar } from './micro.ts';

/** In-place radix-2 FFT of length n (a power of 2). inverse: the e^{+i} transform, not scaled. */
export function fft1(re: Float64Array, im: Float64Array, inverse = false, off = 0, stride = 1, n = re.length) {
  for (let i = 1, j = 0; i < n; i++) {
    let bit = n >> 1; for (; j & bit; bit >>= 1) j ^= bit; j ^= bit;
    if (i < j) { const a = off + i * stride, b = off + j * stride; let t = re[a]; re[a] = re[b]; re[b] = t; t = im[a]; im[a] = im[b]; im[b] = t; }
  }
  for (let len = 2; len <= n; len <<= 1) {
    const ang = ((inverse ? 2 : -2) * Math.PI) / len, wr = Math.cos(ang), wi = Math.sin(ang);
    for (let i = 0; i < n; i += len) {
      let cr = 1, ci = 0;
      for (let k = 0; k < len / 2; k++) {
        const a = off + (i + k) * stride, b = off + (i + k + len / 2) * stride;
        const xr = re[b] * cr - im[b] * ci, xi = re[b] * ci + im[b] * cr;
        re[b] = re[a] - xr; im[b] = im[a] - xi; re[a] += xr; im[a] += xi;
        const t = cr * wr - ci * wi; ci = cr * wi + ci * wr; cr = t;
      }
    }
  }
}

/** 2-D FFT of an N × N array (row-major), in place. The inverse is divided by N², as numpy.fft.ifft2. */
export function fft2(re: Float64Array, im: Float64Array, N: number, inverse = false) {
  if (N & (N - 1)) throw new Error('The FFT size must be a power of 2.');
  for (let r = 0; r < N; r++) fft1(re, im, inverse, r * N, 1, N);
  for (let c = 0; c < N; c++) fft1(re, im, inverse, c, N, N);
  if (inverse) { const s = 1 / (N * N); for (let i = 0; i < N * N; i++) { re[i] *= s; im[i] *= s; } }
}

export const nextPow2 = (n: number) => 2 ** Math.ceil(Math.log2(Math.max(1, n)));
/** numpy.hanning(M): 0.5 − 0.5 cos(2πn / (M − 1)). */
export const hann = (M: number) => Float64Array.from({ length: M }, (_, n) => (M === 1 ? 1 : 0.5 - 0.5 * Math.cos((2 * Math.PI * n) / (M - 1))));

export type Region = { x0: number; y0: number; size: number };
/** A size × size square centred on (cx, cy), moved inside the image. */
export function region(w: number, h: number, cx: number, cy: number, size: number): Region {
  const s = Math.min(size, w, h);
  return { x0: Math.max(0, Math.min(w - s, Math.round(cx - s / 2))), y0: Math.max(0, Math.min(h - s, Math.round(cy - s / 2))), size: s };
}

export type Spectrum = { N: number; size: number; re: Float64Array; im: Float64Array; P: Float64Array; mean: number };
/** Transform of a region: grey values minus their mean, times a 2-D Hann window (if asked), put in the top-left of
 *  an N × N array of zeros (N the next power of 2 above the size, doubled when pad is on). P is the power |F|²,
 *  centred (fftshift: zero frequency at N/2, N/2). */
export function spectrum(g: ArrayLike<number>, w: number, R: Region, win: boolean, pad: boolean): Spectrum {
  const s = R.size, N = nextPow2(s) * (pad ? 2 : 1), re = new Float64Array(N * N), im = new Float64Array(N * N), wv = win ? hann(s) : null;
  let mean = 0; for (let y = 0; y < s; y++) for (let x = 0; x < s; x++) mean += g[(R.y0 + y) * w + R.x0 + x]; mean /= s * s;
  for (let y = 0; y < s; y++) for (let x = 0; x < s; x++) re[y * N + x] = (g[(R.y0 + y) * w + R.x0 + x] - mean) * (wv ? wv[x] * wv[y] : 1);
  fft2(re, im, N);
  const P = new Float64Array(N * N), H = N / 2;
  for (let v = 0; v < N; v++) for (let u = 0; u < N; u++) { const k = v * N + u; P[((v + H) % N) * N + ((u + H) % N)] = re[k] * re[k] + im[k] * im[k]; }
  return { N, size: s, re, im, P, mean };
}

export type Spot = { u: number; v: number; fx: number; fy: number; d: number; angle: number; power: number };
/** A spot at (u, v) of the centred spectrum (u to the right, v down; may be fractional). fx, fy in cycles per pixel;
 *  d = 1/|f| pixels; angle of the planes' normal in degrees, counter-clockwise from x with y up, in [0, 180). */
export function spotAt(N: number, u: number, v: number, power = NaN): Spot {
  const fx = (u - N / 2) / N, fy = (v - N / 2) / N, f = Math.hypot(fx, fy);
  let a = (Math.atan2(-fy, fx) * 180) / Math.PI; if (a < 0) a += 180; if (a >= 180) a -= 180;
  return { u, v, fx, fy, d: f > 0 ? 1 / f : Infinity, angle: a, power };
}

/** Moves to the strongest pixel within r of (u, v), then refines to a fraction of a pixel by a parabola through the
 *  log power of it and its neighbours in x and in y (exact for a Gaussian peak). */
export function refine(S: Spectrum, u: number, v: number, r = 3): Spot {
  const { N, P } = S; let bu = Math.round(u), bv = Math.round(v), best = -1;
  for (let j = Math.round(v) - r; j <= Math.round(v) + r; j++) for (let i = Math.round(u) - r; i <= Math.round(u) + r; i++) {
    if (i < 1 || j < 1 || i >= N - 1 || j >= N - 1) continue; const p = P[j * N + i]; if (p > best) { best = p; bu = i; bv = j; }
  }
  const L = (i: number, j: number) => Math.log(Math.max(P[j * N + i], 1e-300));
  const par = (a: number, b: number, c: number) => { const den = a - 2 * b + c; return den < 0 ? Math.max(-0.5, Math.min(0.5, (0.5 * (a - c)) / den)) : 0; };
  let du = 0, dv = 0;
  if (bu > 0 && bu < N - 1) du = par(L(bu - 1, bv), L(bu, bv), L(bu + 1, bv));
  if (bv > 0 && bv < N - 1) dv = par(L(bu, bv - 1), L(bu, bv), L(bu, bv + 1));
  return spotAt(N, bu + du, bv + dv, P[bv * N + bu]);
}

/** The strongest spots: local maxima of the power (highest in a 5 × 5 neighbourhood) further than minR pixels from
 *  the centre, one of each Friedel pair (the one with v ≤ N/2), strongest first, refined. */
export function findSpots(S: Spectrum, count: number, minR: number): Spot[] {
  const { N, P } = S, H = N / 2, c: [number, number, number][] = [];
  for (let v = 2; v <= H; v++) for (let u = 2; u < N - 2; u++) {
    if (Math.hypot(u - H, v - H) < minR) continue;
    if (v === H && u < H) continue; // on the centre row keep the right-hand member of the pair
    const p = P[v * N + u]; let top = true;
    for (let j = -2; j <= 2 && top; j++) for (let i = -2; i <= 2; i++) { if ((i || j) && P[(v + j) * N + u + i] > p) { top = false; break; } }
    if (top && p > 0) c.push([p, u, v]);
  }
  c.sort((a, b) => b[0] - a[0]);
  return c.slice(0, count).map(([, u, v]) => refine(S, u, v, 1));
}

/** Bragg filter: keeps the transform within radius r (spectrum pixels) of each spot and of its Friedel mate, drops
 *  the rest, and transforms back. Returns the filtered region (size × size), real part. */
export function braggFilter(S: Spectrum, spots: { u: number; v: number }[], r: number): Float64Array {
  const { N, size, re, im } = S, H = N / 2, fr = new Float64Array(N * N), fi = new Float64Array(N * N);
  const cen = spots.flatMap((s) => [[s.u, s.v], [N - s.u, N - s.v]]);
  for (let v = 0; v < N; v++) for (let u = 0; u < N; u++) {
    const cu = (u + H) % N, cv = (v + H) % N; // this unshifted (u, v) sits at (cu, cv) in the centred spectrum
    if (cen.some(([a, b]) => (cu - a) ** 2 + (cv - b) ** 2 <= r * r)) { fr[v * N + u] = re[v * N + u]; fi[v * N + u] = im[v * N + u]; }
  }
  fft2(fr, fi, N, true);
  const out = new Float64Array(size * size);
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) out[y * size + x] = fr[y * N + x];
  return out;
}

/** Log power scaled to 0..255 for display: log(1 + P) between its median and its maximum. */
export function logImage(P: Float64Array): Uint8ClampedArray {
  const L = Float64Array.from(P, (p) => Math.log1p(p)), s = Float64Array.from(L).sort(), lo = s[Math.floor(s.length / 2)], hi = s[s.length - 1] || 1;
  return Uint8ClampedArray.from(L, (x) => (255 * (x - lo)) / (hi - lo || 1));
}

/** Made-up lattice image: fringe sets (d in pixels, angle of the normal in degrees) added up, plus noise and a slow
 *  background change. Grey RGBA. */
export function exampleLattice(w: number, h: number, sets: { d: number; angle: number }[], noise: number, seed: number, bar?: { px: number; label: string }) {
  const r = rng(seed), px = new Uint8ClampedArray(w * h * 4);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    let v = 0; for (const s of sets) { const a = (s.angle * Math.PI) / 180; v += Math.cos((2 * Math.PI * (x * Math.cos(a) - y * Math.sin(a))) / s.d); }
    const g = 128 + (40 * v) / sets.length + 15 * Math.sin((2 * Math.PI * x) / (3 * w)) + noise * gauss(r);
    const i = 4 * (y * w + x); px[i] = px[i + 1] = px[i + 2] = g; px[i + 3] = 255;
  }
  if (bar) drawBar(px, w, h, bar.px, bar.label);
  return { px, w, h };
}
