// Calibration frames for astronomical images: master bias, dark and flat by mean, median or sigma-clipped mean,
// and light-frame calibration  light' = (L − D) / normalised(F − B), optionally scaling a bias-subtracted dark by
// exposure time. The same steps as ccdproc's combine, subtract_bias, subtract_dark and flat_correct. Plus exact
// frame statistics, histograms, a flatness measure and a seeded synthetic frame set for the demo.
import type { Frame } from './stack.ts';
export type { Frame };

/** 1 / Φ⁻¹(3/4): turns a median absolute deviation into a Gaussian σ (astropy mad_std uses the same). */
export const MADK = 1.482602218505602;
export type Method = 'mean' | 'median' | 'sigma';
export type CombineOpts = { method: Method; kappa?: number; iters?: number; dev?: 'mad' | 'std' };

const median = (a: Float64Array, n: number) => {
  const s = a.subarray(0, n).sort();
  return n % 2 ? s[(n - 1) >> 1] : (s[n / 2 - 1] + s[n / 2]) / 2;
};

/** Combine frames pixel by pixel. 'sigma': clip values more than κ deviations from the median of the pixel's
 *  stack, where the deviation is the robust MAD σ = 1.4826 × median|x − median| ('mad', the default) or the
 *  standard deviation (ddof 0, 'std'; it cannot reject a single outlier among fewer than 11 frames at κ = 3).
 *  The bounds are recomputed from the values kept, up to `iters` times or until nothing more is clipped; the
 *  values inside the last bounds are averaged. This is astropy's sigma_clip(cenfunc='median',
 *  stdfunc='mad_std' or 'std', maxiters=iters) along the stack, as ccdproc's Combiner uses it. */
export function combine(frames: Frame[], o: CombineOpts): { frame: Frame; rejected: number } {
  if (!frames.length) throw new Error('No frames to combine.');
  const { w, h } = frames[0], np = frames[0].planes.length, n = frames.length;
  if (frames.some((f) => f.w !== w || f.h !== h || f.planes.length !== np)) throw new Error('Frames of one kind must all be the same size and type.');
  const kappa = o.kappa ?? 3, iters = Math.max(1, o.iters ?? 1);
  const buf = new Float64Array(n), keep = new Uint8Array(n), tmp = new Float64Array(n);
  let rejected = 0;
  const planes = Array.from({ length: np }, (_, k) => {
    const out = new Float32Array(w * h);
    for (let i = 0; i < w * h; i++) {
      for (let j = 0; j < n; j++) buf[j] = frames[j].planes[k][i];
      if (o.method === 'mean' || n === 1) { let s = 0; for (let j = 0; j < n; j++) s += buf[j]; out[i] = s / n; continue; }
      if (o.method === 'median') { tmp.set(buf); out[i] = median(tmp, n); continue; }
      keep.fill(1);
      let lo = -Infinity, hi = Infinity;
      for (let it = 0; it < iters; it++) {
        let m = 0; for (let j = 0; j < n; j++) if (keep[j]) tmp[m++] = buf[j];
        if (!m) break;
        let sd = 0;
        if (o.dev === 'std') { let mean = 0; for (let j = 0; j < m; j++) mean += tmp[j]; mean /= m; let ss = 0; for (let j = 0; j < m; j++) ss += (tmp[j] - mean) ** 2; sd = Math.sqrt(ss / m); }
        const c = median(tmp, m);
        if (o.dev !== 'std') { for (let j = 0; j < m; j++) tmp[j] = Math.abs(tmp[j] - c); sd = MADK * median(tmp, m); }
        lo = c - kappa * sd; hi = c + kappa * sd;
        let changed = false;
        for (let j = 0; j < n; j++) if (keep[j] && (buf[j] < lo || buf[j] > hi)) { keep[j] = 0; changed = true; }
        if (!changed) break;
      }
      // As astropy's sigma_clip: the final mask is every value outside the last bounds.
      let s = 0, m = 0; for (let j = 0; j < n; j++) if (buf[j] >= lo && buf[j] <= hi) { s += buf[j]; m++; }
      rejected += n - m;
      out[i] = m ? s / m : NaN;
    }
    return out;
  });
  return { frame: { w, h, planes }, rejected };
}

export type CalOpts = {
  /** Scale the dark by exposure: needs a bias; D' = (D − B)·tL/tD, and the light has B and D' removed. */
  scaleDark: boolean; tLight: number; tDark: number;
  /** Normalise the flat by its mean (ccdproc's default) or median. */
  flatNorm: 'mean' | 'median';
  /** Flat values below this fraction of the normalisation are left uncorrected (set to the light minus dark). */
  minFlat: number;
};

const planeOf = (f: Frame | undefined, k: number) => (f ? f.planes[Math.min(k, f.planes.length - 1)] : null);

/** Calibrate a light frame. Returns the frame and the flat normalisation value per plane. */
export function calibrate(light: Frame, m: { bias?: Frame; dark?: Frame; flat?: Frame }, o: CalOpts): { frame: Frame; flatNorm: number[]; lowFlat: number; darkScale: number } {
  const { w, h } = light;
  for (const [name, f] of [['bias', m.bias], ['dark', m.dark], ['flat', m.flat]] as const) if (f && (f.w !== w || f.h !== h)) throw new Error(`The master ${name} is ${f.w} × ${f.h} but the light is ${w} × ${h}. They must match.`);
  if (o.scaleDark && m.dark && !m.bias) throw new Error('Scaling the dark by exposure needs a master bias.');
  if (o.scaleDark && !(o.tLight > 0 && o.tDark > 0)) throw new Error('Give both exposure times (in seconds) to scale the dark.');
  const darkScale = o.scaleDark && m.dark ? o.tLight / o.tDark : 1;
  const flatNorm: number[] = []; let lowFlat = 0;
  const planes = light.planes.map((L, k) => {
    const out = new Float32Array(L.length), B = planeOf(m.bias, k), D = planeOf(m.dark, k), F = planeOf(m.flat, k);
    for (let i = 0; i < out.length; i++) {
      let v = L[i];
      if (D) v -= o.scaleDark && B ? B[i] + (D[i] - B[i]) * darkScale : D[i];
      else if (B) v -= B[i];
      out[i] = v;
    }
    if (F) {
      const f = new Float64Array(F.length);
      for (let i = 0; i < f.length; i++) f[i] = F[i] - (B ? B[i] : 0);
      const s = exactStats(f), norm = o.flatNorm === 'median' ? s.median : s.mean;
      if (!(norm > 0)) throw new Error('The flat (minus bias) has no positive level, so it cannot be normalised.');
      flatNorm.push(norm);
      for (let i = 0; i < out.length; i++) { const g = f[i] / norm; if (g > o.minFlat) out[i] /= g; else lowFlat++; }
    }
    return out;
  });
  return { frame: { w, h, planes }, flatNorm, lowFlat, darkScale };
}

export type Stats = { n: number; mean: number; median: number; std: number; min: number; max: number; madSigma: number };
/** Exact statistics of the finite values (std with ddof 0, as NumPy's default; median of an even count is the
 *  mean of the middle two; MAD σ = 1.4826 × median absolute deviation). */
export function exactStats(d: ArrayLike<number>): Stats {
  const v = new Float64Array(d.length); let n = 0, sum = 0;
  for (let i = 0; i < d.length; i++) { const x = d[i]; if (Number.isFinite(x)) { v[n++] = x; sum += x; } }
  if (!n) return { n: 0, mean: NaN, median: NaN, std: NaN, min: NaN, max: NaN, madSigma: NaN };
  const mean = sum / n; let ss = 0; for (let i = 0; i < n; i++) ss += (v[i] - mean) ** 2;
  const s = v.subarray(0, n).sort(), med = n % 2 ? s[(n - 1) >> 1] : (s[n / 2 - 1] + s[n / 2]) / 2;
  for (let i = 0; i < n; i++) s[i] = Math.abs(s[i] - med);
  s.sort();
  const mad = n % 2 ? s[(n - 1) >> 1] : (s[n / 2 - 1] + s[n / 2]) / 2;
  return { n, mean, median: med, std: Math.sqrt(ss / n), madSigma: MADK * mad, ...minMax(d) };
}
function minMax(d: ArrayLike<number>) { let min = Infinity, max = -Infinity; for (let i = 0; i < d.length; i++) { const x = d[i]; if (Number.isFinite(x)) { if (x < min) min = x; if (x > max) max = x; } } return { min, max }; }

/** Histogram with `bins` equal bins from lo to hi (values outside are counted in the end bins, or left out
 *  with clamp = false). */
export function histogram(d: ArrayLike<number>, lo: number, hi: number, bins = 128, clamp = true) {
  const c = new Array(bins).fill(0), wd = (hi - lo) / bins || 1;
  for (let i = 0; i < d.length; i++) { const x = d[i]; if (!Number.isFinite(x) || (!clamp && (x < lo || x > hi))) continue; c[Math.max(0, Math.min(bins - 1, Math.floor((x - lo) / wd)))]++; }
  return { counts: c, centres: c.map((_, k) => lo + (k + 0.5) * wd), width: wd };
}

/** Flatness: median of the central box (middle 20 % each way) divided by the median of the four corner boxes
 *  (10 % each way). 1 is flat; vignetting makes it above 1. */
export function flatness(p: ArrayLike<number>, w: number, h: number) {
  const box = (x0: number, y0: number, bw: number, bh: number) => { const a: number[] = []; for (let y = Math.floor(y0); y < Math.floor(y0 + bh); y++) for (let x = Math.floor(x0); x < Math.floor(x0 + bw); x++) a.push(p[y * w + x]); return a; };
  const med = (a: number[]) => { const s = a.filter(Number.isFinite).sort((x, y) => x - y), n = s.length; return n % 2 ? s[(n - 1) >> 1] : (s[n / 2 - 1] + s[n / 2]) / 2; };
  const cw = w * 0.1, ch = h * 0.1;
  const centre = med(box(w * 0.4, h * 0.4, w * 0.2, h * 0.2));
  const corners = med([...box(0, 0, cw, ch), ...box(w - cw, 0, cw, ch), ...box(0, h - ch, cw, ch), ...box(w - cw, h - ch, cw, ch)]);
  return { centre, corners, ratio: centre / corners };
}

// ---- A synthetic frame set ----
export type Demo = { bias: Frame[]; darks: Frame[]; flats: Frame[]; lights: Frame[]; tLight: number; tDark: number; truth: { sky: Float32Array; hot: number[]; gain: Float32Array } };
/** A made-up camera: bias 1000 ADU with a faint column pattern and read noise 8 ADU; dark current 0.05 ADU/s
 *  with 30 hot pixels; vignetting (falls to about 60 % in the corners) and a dust donut on the flats and lights;
 *  a cosmic-ray hit in one dark and a satellite trail in one flat, for the clipping to remove. Lights and
 *  darks are 120 s (or darks of `tDark` s). */
export function demoSet(w = 240, h = 160, seed = 7, n = { bias: 9, darks: 7, flats: 7, lights: 2 }, tDark = 120): Demo {
  let s = seed; const u = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  const g = () => Math.sqrt(-2 * Math.log(u() + 1e-12)) * Math.cos(2 * Math.PI * u());
  const N = w * h, tLight = 120;
  const biasLvl = new Float32Array(N), dc = new Float32Array(N), gain = new Float32Array(N), sky = new Float32Array(N);
  const col = Array.from({ length: w }, () => 3 * g());
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const i = y * w + x, r = Math.hypot((x - w / 2) / (w / 2), (y - h / 2) / (h / 2)) / Math.SQRT2;
    biasLvl[i] = 1000 + col[x];
    dc[i] = 0.05 * (1 + 0.1 * g());
    // Vignetting and a dust donut (a ring shadow: dust out of focus).
    let v = 1 - 0.4 * r * r; const dd = Math.hypot(x - w * 0.68, y - h * 0.38); if (dd > 7 && dd < 13) v *= 0.85; else if (dd <= 7) v *= 0.95;
    gain[i] = v * (1 + 0.01 * g()); // plus 1 % pixel-to-pixel sensitivity
  }
  const hot: number[] = []; while (hot.length < 30) { const i = Math.floor(u() * N); if (!hot.includes(i)) { hot.push(i); dc[i] = 2 + 20 * u(); } }
  // Sky: background 300 ADU plus a few stars.
  const starsXY = Array.from({ length: 40 }, () => [u() * w, u() * h, 200 + 4000 * u() ** 3]);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { let v = 300; for (const [sx, sy, a] of starsXY) { const r2 = (x - sx) ** 2 + (y - sy) ** 2; if (r2 < 40) v += a * Math.exp(-r2 / 3); } sky[y * w + x] = v; }
  const frame = (f: (i: number) => number): Frame => { const p = new Float32Array(N); for (let i = 0; i < N; i++) p[i] = f(i); return { w, h, planes: [p] }; };
  const RN = 8;
  const bias = Array.from({ length: n.bias }, () => frame((i) => biasLvl[i] + RN * g()));
  const darks = Array.from({ length: n.darks }, (_, k) => { const f = frame((i) => biasLvl[i] + dc[i] * tDark + RN * g()); if (k === 1) for (let j = 0; j < 12; j++) f.planes[0][Math.floor(h * 0.3 + j * 0.5) * w + Math.floor(w * 0.2 + j)] += 3000; return f; });
  const flats = Array.from({ length: n.flats }, (_, k) => { const f = frame((i) => biasLvl[i] + 20000 * gain[i] + Math.sqrt(20000) * g() + RN * g()); if (k === 2) for (let x = 0; x < w; x++) { const y = Math.round(0.25 * x + 20); if (y < h) f.planes[0][y * w + x] += 8000; } return f; });
  const lights = Array.from({ length: n.lights }, () => frame((i) => biasLvl[i] + dc[i] * tLight + sky[i] * gain[i] + Math.sqrt(sky[i]) * g() + RN * g()));
  return { bias, darks, flats, lights, tLight, tDark, truth: { sky, hot, gain } };
}
