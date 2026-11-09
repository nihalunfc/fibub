// Calcium imaging: neuropil subtraction, baseline F0 (sliding-window percentile, first N frames, or a percentile of
// the whole trace), ΔF/F and simple threshold event detection. Plain maths, no DOM.
// Percentiles use linear interpolation between order statistics, as numpy.percentile's default.
import { rng, gauss } from './spectro.ts';

/** p-th percentile (0–100) of an already sorted array, numpy "linear" method. */
export function pctSorted(s: ArrayLike<number>, p: number): number {
  const n = s.length; if (!n) return NaN;
  const h = (n - 1) * (p / 100), lo = Math.floor(h), hi = Math.min(n - 1, lo + 1);
  return s[lo] + (h - lo) * (s[hi] - s[lo]);
}
export const percentile = (a: ArrayLike<number>, p: number) => pctSorted(Float64Array.from(a).sort(), p);
export const median = (a: ArrayLike<number>) => percentile(a, 50);

/** Baseline from the p-th percentile of a centred window of w frames (clipped at the ends: [i − ⌊w/2⌋, i + ⌊w/2⌋]). */
export function slidingPercentile(x: ArrayLike<number>, w: number, p: number): Float64Array {
  const n = x.length, h = Math.floor(w / 2), out = new Float64Array(n), win: number[] = [];
  const ins = (v: number) => { let a = 0, b = win.length; while (a < b) { const m = (a + b) >> 1; if (win[m] < v) a = m + 1; else b = m; } win.splice(a, 0, v); };
  const del = (v: number) => { let a = 0, b = win.length; while (a < b) { const m = (a + b) >> 1; if (win[m] < v) a = m + 1; else b = m; } win.splice(a, 1); };
  for (let i = 0; i <= Math.min(n - 1, h); i++) ins(x[i]);
  for (let i = 0; i < n; i++) {
    out[i] = pctSorted(win, p);
    const add = i + h + 1, drop = i - h;
    if (add < n) ins(x[add]);
    if (drop >= 0) del(x[drop]);
  }
  return out;
}

export type BaselineOpt = { method: 'sliding'; window: number; p: number } | { method: 'first'; n: number } | { method: 'whole'; p: number };
export function baseline(x: ArrayLike<number>, o: BaselineOpt): Float64Array {
  if (o.method === 'sliding') return slidingPercentile(x, o.window, o.p);
  const v = o.method === 'first' ? Array.from(x).slice(0, o.n).reduce((s, y) => s + y, 0) / Math.min(o.n, x.length) : percentile(x, o.p);
  return new Float64Array(x.length).fill(v);
}

/** F − r·Fneu, the usual neuropil correction (r often 0.7). */
export const subtractNeuropil = (f: ArrayLike<number>, fneu: ArrayLike<number>, r: number) => Float64Array.from(f, (v, i) => v - r * fneu[i]);
/** (F − F0) / F0. */
export const deltaF = (f: ArrayLike<number>, f0: ArrayLike<number>) => Float64Array.from(f, (v, i) => (v - f0[i]) / f0[i]);

/** Noise of a trace: robust = 1.4826 × median absolute deviation (around the median), or the plain sample SD (around the mean). */
export function noise(x: ArrayLike<number>, robust = true): { centre: number; sigma: number } {
  if (robust) { const m = median(x); return { centre: m, sigma: 1.4826 * median(Float64Array.from(x, (v) => Math.abs(v - m))) }; }
  let m = 0; for (let i = 0; i < x.length; i++) m += x[i]; m /= x.length;
  let s = 0; for (let i = 0; i < x.length; i++) s += (x[i] - m) ** 2;
  return { centre: m, sigma: Math.sqrt(s / (x.length - 1)) };
}

export type Event = { onset: number; peak: number; end: number; amp: number };
/** Runs of at least minFrames frames above centre + k·sigma. Frame indices; amp is the peak ΔF/F. */
export function detectEvents(d: ArrayLike<number>, k: number, minFrames: number, robust = true): { events: Event[]; threshold: number; sigma: number; centre: number } {
  const { centre, sigma } = noise(d, robust), thr = centre + k * sigma, events: Event[] = [];
  let i = 0;
  while (i < d.length) {
    if (d[i] > thr) {
      let j = i, pk = i; while (j + 1 < d.length && d[j + 1] > thr) { j++; if (d[j] > d[pk]) pk = j; }
      if (j - i + 1 >= minFrames) events.push({ onset: i, peak: pk, end: j, amp: d[pk] });
      i = j + 1;
    } else i++;
  }
  return { events, threshold: thr, sigma, centre };
}

/**
 * The made-up example: 8 ROIs, 20 frames/s for 60 s. Each ROI has its own brightness, slow bleaching, random
 * transients (ΔF/F 0.4–1.4, decay time 0.6 s), 2 % noise, plus 0.7 × a shared neuropil signal.
 * Returns F, Fneu and the true event onsets (frames).
 */
export function exampleCalcium(seed = 21, rois = 8, fps = 20, secs = 60) {
  const r = rng(seed), n = fps * secs, F: Float64Array[] = [], N: Float64Array[] = [], truth: number[][] = [];
  const shared = new Float64Array(n); let s = 0;
  for (let i = 0; i < n; i++) { s = 0.995 * s + 0.6 * gauss(r); shared[i] = s; }
  for (let k = 0; k < rois; k++) {
    const base = 120 + 40 * k, f = new Float64Array(n), np = new Float64Array(n), on: number[] = [];
    let c = 0;
    for (let i = 0; i < n; i++) {
      if (i > 5 && r() < 0.12 / fps) { c += 0.4 + r(); on.push(i); }
      c *= Math.exp(-1 / (0.6 * fps));
      const bleach = Math.exp(-i / fps / 300);
      np[i] = 60 + 8 * shared[i] + 1.5 * gauss(r);
      f[i] = base * bleach * (1 + c) * (1 + 0.02 * gauss(r)) + 0.7 * np[i];
    }
    F.push(f); N.push(np); truth.push(on);
  }
  return { F, N, truth, fps };
}
