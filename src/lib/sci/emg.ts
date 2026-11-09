// Surface EMG: band-pass, full-wave rectification, envelope (moving RMS or low-pass of the rectified signal),
// burst onset and offset by a baseline threshold (mean + k·SD), and muscle fatigue from the mean and median
// frequency of Welch spectra in sliding windows, with a straight-line trend. Welch's method as in
// scipy.signal.welch with its defaults (periodic Hann window, 50 % overlap, constant detrend, one-sided density).
// The synthetic EMG is filtered noise with a falling spectrum to mimic fatigue. For study and research. No DOM.
import { filtfilt, butterLow, seeded, bandSections } from './biosig.ts';

/** In-place radix-2 FFT of (re, im); length must be a power of two. */
export function fft(re: Float64Array, im: Float64Array) {
  const n = re.length;
  for (let i = 1, j = 0; i < n; i++) {
    let bit = n >> 1; for (; j & bit; bit >>= 1) j ^= bit; j ^= bit;
    if (i < j) { [re[i], re[j]] = [re[j], re[i]]; [im[i], im[j]] = [im[j], im[i]]; }
  }
  for (let len = 2; len <= n; len <<= 1) {
    const a = -2 * Math.PI / len, wr = Math.cos(a), wi = Math.sin(a);
    for (let i = 0; i < n; i += len) {
      let cr = 1, ci = 0;
      for (let k = 0; k < len / 2; k++) {
        const p = i + k, q = p + len / 2, tr = re[q] * cr - im[q] * ci, ti = re[q] * ci + im[q] * cr;
        re[q] = re[p] - tr; im[q] = im[p] - ti; re[p] += tr; im[p] += ti;
        const c2 = cr * wr - ci * wi; ci = cr * wi + ci * wr; cr = c2;
      }
    }
  }
}

/** Welch power spectral density (as scipy.signal.welch(x, fs, nperseg=nseg) with default settings). */
export function welch(x: ArrayLike<number>, fs: number, nseg: number) {
  if (nseg & (nseg - 1)) throw new Error('Segment length must be a power of two');
  if (x.length < nseg) throw new Error('The window is shorter than one segment');
  const w = new Float64Array(nseg); let s2 = 0;
  for (let i = 0; i < nseg; i++) { w[i] = 0.5 - 0.5 * Math.cos(2 * Math.PI * i / nseg); s2 += w[i] * w[i]; }
  const step = nseg / 2, m = Math.floor((x.length - nseg) / step) + 1, nf = nseg / 2 + 1, P = new Float64Array(nf);
  const re = new Float64Array(nseg), im = new Float64Array(nseg);
  for (let s = 0; s < m; s++) {
    let mean = 0; for (let i = 0; i < nseg; i++) mean += x[s * step + i]; mean /= nseg;
    for (let i = 0; i < nseg; i++) { re[i] = (x[s * step + i] - mean) * w[i]; im[i] = 0; }
    fft(re, im);
    for (let k = 0; k < nf; k++) { let p = (re[k] * re[k] + im[k] * im[k]) / (fs * s2); if (k > 0 && k < nseg / 2) p *= 2; P[k] += p / m; }
  }
  const f = Float64Array.from({ length: nf }, (_, k) => k * fs / nseg);
  return { f, P, segments: m };
}

/** Mean frequency (power-weighted) and median frequency (half the power below it, interpolated between bins) within [lo, hi]. */
export function meanMedian(f: ArrayLike<number>, P: ArrayLike<number>, lo: number, hi: number) {
  let tot = 0, fp = 0; const idx: number[] = [];
  for (let k = 0; k < f.length; k++) if (f[k] >= lo && f[k] <= hi) { idx.push(k); tot += P[k]; fp += f[k] * P[k]; }
  if (!(tot > 0)) return { mnf: NaN, mdf: NaN, power: 0 };
  let c = 0, mdf = NaN;
  for (const k of idx) {
    const c2 = c + P[k];
    if (c2 >= tot / 2) { const df = idx.length > 1 ? f[idx[1]] - f[idx[0]] : 0; mdf = f[k] - df + df * (tot / 2 - c) / P[k]; break; }
    c = c2;
  }
  // mdf above: the cumulative sum reaches half within bin k, treating each bin as spread over (f[k] − df, f[k]].
  return { mnf: fp / tot, mdf, power: tot };
}

/** Full-wave rectified signal. */
export const rectify = (x: ArrayLike<number>) => Float64Array.from(x, Math.abs);

/** Centred moving RMS over w samples (edges use the samples available). */
export function movingRms(x: ArrayLike<number>, w: number) {
  const n = x.length, c = new Float64Array(n + 1), out = new Float64Array(n), h = Math.floor(w / 2);
  for (let i = 0; i < n; i++) c[i + 1] = c[i] + x[i] * x[i];
  for (let i = 0; i < n; i++) { const a = Math.max(0, i - h), b = Math.min(n, i - h + w); out[i] = Math.sqrt((c[b] - c[a]) / (b - a)); }
  return out;
}

/** Envelope: 'rms' = moving RMS with a window of `p` ms; 'lp' = rectified then zero-phase 2nd-order Butterworth low-pass at `p` Hz. */
export function envelope(x: ArrayLike<number>, fs: number, kind: 'rms' | 'lp', p: number) {
  if (kind === 'rms') return movingRms(x, Math.max(1, Math.round(p / 1000 * fs)));
  return filtfilt(rectify(x), [butterLow(p, fs)]);
}

export type Burst = { on: number; off: number; dur: number; peak: number; mean: number; iemg: number };

/**
 * Bursts where the envelope stays above mean + k·SD of a baseline stretch [b0, b1) (seconds). Runs closer than
 * `gap` s are joined; runs shorter than `minDur` s are dropped. iEMG integrates the rectified signal over the burst.
 */
export function bursts(env: Float64Array, x: ArrayLike<number>, fs: number, b0: number, b1: number, k: number, minDur: number, gap: number) {
  const i0 = Math.max(0, Math.round(b0 * fs)), i1 = Math.min(env.length, Math.round(b1 * fs));
  if (i1 - i0 < 10) throw new Error('The baseline stretch is too short or outside the recording.');
  let m = 0; for (let i = i0; i < i1; i++) m += env[i]; m /= i1 - i0;
  let v = 0; for (let i = i0; i < i1; i++) v += (env[i] - m) ** 2; const sd = Math.sqrt(v / (i1 - i0 - 1));
  const thr = m + k * sd, runs: [number, number][] = [];
  let start = -1;
  for (let i = 0; i <= env.length; i++) {
    const up = i < env.length && env[i] > thr;
    if (up && start < 0) start = i;
    if (!up && start >= 0) { runs.push([start, i]); start = -1; }
  }
  const joined: [number, number][] = [];
  for (const r of runs) { const last = joined[joined.length - 1]; if (last && (r[0] - last[1]) / fs < gap) last[1] = r[1]; else joined.push([r[0], r[1]]); }
  const out: Burst[] = [];
  for (const [a, b] of joined) {
    if ((b - a) / fs < minDur) continue;
    let pk = 0, s = 0, ie = 0;
    for (let i = a; i < b; i++) { pk = Math.max(pk, env[i]); s += env[i]; ie += Math.abs(x[i]) / fs; }
    out.push({ on: a / fs, off: b / fs, dur: (b - a) / fs, peak: pk, mean: s / (b - a), iemg: ie });
  }
  return { bursts: out, thr, baseMean: m, baseSd: sd };
}

export type Win = { t: number; mnf: number; mdf: number; rms: number; active: boolean };

/** Mean and median frequency in sliding windows of `win` s every `step` s (Welch with segments of nseg samples). */
export function fatigue(x: ArrayLike<number>, fs: number, win: number, step: number, nseg: number, lo: number, hi: number, active?: (t0: number, t1: number) => boolean): Win[] {
  const W = Math.round(win * fs), S = Math.max(1, Math.round(step * fs)), out: Win[] = [];
  if (W < nseg) throw new Error(`Each window needs at least ${nseg} samples (${(nseg / fs).toFixed(3)} s); make the window longer or the segment shorter.`);
  for (let a = 0; a + W <= x.length; a += S) {
    const seg = Array.prototype.slice.call(x, a, a + W) as number[];
    const { f, P } = welch(seg, fs, nseg), mm = meanMedian(f, P, lo, hi);
    let r = 0; for (const v of seg) r += v * v;
    out.push({ t: (a + W / 2) / fs, mnf: mm.mnf, mdf: mm.mdf, rms: Math.sqrt(r / W), active: active ? active(a / fs, (a + W) / fs) : true });
  }
  return out;
}

/** Least-squares line y = a + b·t with R² and the standard error of the slope. */
export function trendLine(t: number[], y: number[]) {
  const n = t.length;
  if (n < 3) return { a: NaN, b: NaN, r2: NaN, seb: NaN, n };
  const mt = t.reduce((s, v) => s + v, 0) / n, my = y.reduce((s, v) => s + v, 0) / n;
  let sxx = 0, sxy = 0, syy = 0; for (let i = 0; i < n; i++) { sxx += (t[i] - mt) ** 2; sxy += (t[i] - mt) * (y[i] - my); syy += (y[i] - my) ** 2; }
  const b = sxy / sxx, a = my - b * mt, sse = syy - b * sxy;
  return { a, b, r2: syy > 0 ? 1 - sse / syy : 1, seb: Math.sqrt(Math.max(0, sse) / (n - 2) / sxx), n };
}

export type EmgSynth = { fs: number; dur: number; bursts: [number, number][]; f0: number; f1: number; amp: number; noise: number; mains: number; seed: number };
export const EMG_SYNTH: EmgSynth = { fs: 1000, dur: 32, bursts: [[2, 6], [8, 12], [14, 18], [20, 24], [26, 30]], f0: 150, f1: 75, amp: 0.4, noise: 0.01, mains: 0, seed: 11 };

/**
 * A made-up surface EMG (mV): white noise band-limited to 20 Hz and up, shaped by a one-pole low-pass whose corner
 * falls from f0 to f1 over the contractions (a fatigue-like shift), switched on in the bursts with 50 ms ramps, plus
 * a small baseline noise and, if asked, mains hum (none in the example). Returns the samples and the true burst times.
 */
export function synthEmg(o: Partial<EmgSynth> = {}) {
  const s = { ...EMG_SYNTH, ...o }, rnd = seeded(s.seed), n = Math.round(s.fs * s.dur);
  const raw = new Float64Array(n);
  for (let i = 0; i < n; i++) raw[i] = rnd.g();
  const hp = filtfilt(raw, bandSections(s.fs, 20, 0, 0));
  const tA = s.bursts[0][0], tB = s.bursts[s.bursts.length - 1][1], x = new Float64Array(n);
  let yl = 0;
  for (let i = 0; i < n; i++) {
    const t = i / s.fs, u = Math.min(1, Math.max(0, (t - tA) / (tB - tA))), fc = s.f0 + (s.f1 - s.f0) * u;
    const al = 1 - Math.exp(-2 * Math.PI * fc / s.fs);
    yl += al * (hp[i] - yl);
    let g = 0;
    for (const [a, b] of s.bursts) if (t >= a && t < b) g = Math.min(1, (t - a) / 0.05, (b - t) / 0.05);
    // Amplitude grows a little with fatigue, as more motor units are recruited; the gain keeps the RMS near `amp`.
    x[i] = g * s.amp * (1 + 0.3 * u) * yl * Math.sqrt(s.fs / (Math.PI * fc)) + s.noise * rnd.g() + s.mains * Math.sin(2 * Math.PI * 50 * t);
  }
  return { x, fs: s.fs, bursts: s.bursts };
}
