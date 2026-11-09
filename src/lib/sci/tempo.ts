// Rhythm and tempo: an onset strength envelope from spectral flux (log-compressed magnitude, rectified frame-to-frame
// rise), onsets by peak picking, tempo by autocorrelation of the envelope with a list of candidates, and beat times
// by dynamic programming (Ellis 2007). Plain maths, no DOM: the page decodes the audio and passes samples in.
import { fft, windowFn } from './harmonics.ts';

export type Envelope = { env: Float64Array; rate: number; hop: number; n: number; fs: number; t0: number };
/**
 * Onset strength: for frames of n samples every `hop` samples, the sum over bins of the rise in log(1 + 100·|X|),
 * minus a moving average over ±0.1 s, set to zero below. Frame k is timed at its start plus three quarters of a frame,
 * where a sudden sound entering the window makes the biggest rise.
 */
export function onsetEnvelope(x: Float32Array | Float64Array, fs: number, o: { n?: number; hop?: number } = {}): Envelope {
  const n = o.n ?? (fs > 32000 ? 2048 : 1024), hop = o.hop ?? n / 4, w = windowFn('hann', n), half = n / 2 + 1;
  const frames = Math.max(1, Math.floor((x.length - n) / hop) + 1), flux = new Float64Array(frames);
  const re = new Float64Array(n), im = new Float64Array(n);
  let prev = new Float64Array(half), cur = new Float64Array(half);
  for (let k = 0; k < frames; k++) {
    const s = k * hop;
    for (let i = 0; i < n; i++) { re[i] = (s + i < x.length ? x[s + i] : 0) * w[i]; im[i] = 0; }
    fft(re, im);
    let f = 0;
    for (let b = 0; b < half; b++) { cur[b] = Math.log1p(100 * Math.hypot(re[b], im[b])); if (k) f += Math.max(0, cur[b] - prev[b]); }
    flux[k] = f; [prev, cur] = [cur, prev];
  }
  const rate = fs / hop, W = Math.max(1, Math.round(0.1 * rate)), env = new Float64Array(frames);
  // Moving average by a running sum over [k − W, k + W].
  const cs = new Float64Array(frames + 1); for (let k = 0; k < frames; k++) cs[k + 1] = cs[k] + flux[k];
  for (let k = 0; k < frames; k++) { const a = Math.max(0, k - W), b = Math.min(frames, k + W + 1); env[k] = Math.max(0, flux[k] - (cs[b] - cs[a]) / (b - a)); }
  const mx = env.reduce((m, v) => Math.max(m, v), 0) || 1;
  for (let k = 0; k < frames; k++) env[k] /= mx;
  return { env, rate, hop, n, fs, t0: (3 * n) / 4 / fs };
}
export const frameTime = (e: Envelope, k: number) => k / e.rate + e.t0;

export type Onset = { t: number; strength: number; frame: number };
/** Peaks of the envelope that are the largest within ±30 ms, at least `threshold` (0–1, of the largest) and `minGap` s apart. */
export function onsets(e: Envelope, threshold = 0.1, minGap = 0.05): Onset[] {
  const a = Math.max(1, Math.round(0.03 * e.rate)), out: Onset[] = [], { env } = e;
  for (let k = 0; k < env.length; k++) {
    if (env[k] < threshold || env[k] <= 0) continue;
    let ok = true;
    for (let j = Math.max(0, k - a); j <= Math.min(env.length - 1, k + a) && ok; j++) if (env[j] > env[k] || (env[j] === env[k] && j < k)) ok = false;
    if (!ok) continue;
    const t = frameTime(e, k);
    if (out.length && t - out[out.length - 1].t < minGap) { if (env[k] > out[out.length - 1].strength) out[out.length - 1] = { t, strength: env[k], frame: k }; continue; }
    out.push({ t, strength: env[k], frame: k });
  }
  return out;
}

/** Autocorrelation r[L] = Σ env[k]·env[k+L] for L = 0..maxLag (not normalised, so longer lags weigh a little less). */
export function autocorr(env: Float64Array, maxLag: number): Float64Array {
  const r = new Float64Array(maxLag + 1), m = env.reduce((s, v) => s + v, 0) / env.length;
  for (let L = 0; L <= maxLag; L++) { let s = 0; for (let k = 0; k + L < env.length; k++) s += (env[k] - m) * (env[k + L] - m); r[L] = s; }
  return r;
}

export type Candidate = { bpm: number; strength: number; lag: number };
/** Tempo candidates: peaks of the autocorrelation between minBpm and maxBpm, refined by a parabola and by the peaks at 2 to 4 periods, the chosen tempo first, then by strength (relative to the strongest). */
export function tempoCandidates(e: Envelope, minBpm = 60, maxBpm = 200): { cands: Candidate[]; acf: Float64Array } {
  const lagOf = (bpm: number) => (60 / bpm) * e.rate, lo = Math.max(2, Math.floor(lagOf(maxBpm))), hi = Math.ceil(lagOf(minBpm));
  // Smooth the envelope a little (Gaussian, σ = 10 ms) so a period between two frames still gives one clear peak.
  const sg = Math.max(0.5, 0.01 * e.rate), R = Math.ceil(3 * sg), g = Array.from({ length: 2 * R + 1 }, (_, i) => Math.exp(-0.5 * ((i - R) / sg) ** 2));
  const sm = new Float64Array(e.env.length);
  for (let k = 0; k < sm.length; k++) { let s = 0; for (let j = -R; j <= R; j++) if (k + j >= 0 && k + j < sm.length) s += g[j + R] * e.env[k + j]; sm[k] = s; }
  const acf = autocorr(sm, Math.min(e.env.length - 2, 4 * hi + 2)), c: Candidate[] = [];
  for (let L = lo; L <= Math.min(hi, acf.length - 2); L++) {
    if (!(acf[L] > acf[L - 1] && acf[L] >= acf[L + 1] && acf[L] > 0)) continue;
    const a = acf[L - 1], b = acf[L], d = acf[L + 1], den = a - 2 * b + d, p = den ? (0.5 * (a - d)) / den : 0;
    let lag = L + p;
    // Refine with the peaks at 2, 3 and 4 periods, which pin the period down more finely.
    let sum = lag, cnt = 1;
    for (let m = 2; m <= 4; m++) {
      const g = Math.round(m * lag); if (g + 2 >= acf.length) break;
      let best = g; for (let j = g - 2; j <= g + 2; j++) if (acf[j] > acf[best]) best = j;
      if (best <= 0 || best >= acf.length - 1 || !(acf[best] > 0)) continue;
      const A = acf[best - 1], Bv = acf[best], C = acf[best + 1], dn = A - 2 * Bv + C, q = dn ? (0.5 * (A - C)) / dn : 0;
      sum += (best + q) / m; cnt++;
    }
    lag = sum / cnt;
    const bpm = (60 * e.rate) / lag;
    if (bpm >= minBpm && bpm <= maxBpm) c.push({ bpm, strength: b - 0.25 * (a - d) * p, lag });
  }
  c.sort((x, y) => y.strength - x.strength);
  const top = c[0]?.strength || 1;
  for (const x of c) x.strength /= top;
  // A pulse twice as fast that is nearly as strong (95 %) is taken as the beat: slower peaks repeat every beat's.
  for (let main = c[0], guard = 0; main && guard < 4; guard++) {
    const fast = c.find((x) => Math.abs(x.bpm / main.bpm / 2 - 1) < 0.02 && x.strength >= 0.95);
    if (!fast) break;
    c.splice(c.indexOf(fast), 1); c.unshift(fast); main = fast;
  }
  return { cands: c, acf };
}

/** How a candidate relates to the main tempo, in words ("double", "half", "3/2" ...) or ''. */
export function relation(bpm: number, main: number): string {
  const r = bpm / main;
  for (const [v, s] of [[1, 'same'], [2, 'double'], [0.5, 'half'], [3, 'triple'], [1 / 3, 'third'], [1.5, '3/2'], [2 / 3, '2/3'], [4, '×4'], [0.25, '÷4']] as [number, string][]) if (Math.abs(r / v - 1) < 0.03) return s;
  return '';
}

/**
 * Beat times by dynamic programming (Ellis 2007): each frame's score is its onset strength plus the best earlier
 * score, less a penalty `tightness`·log²(gap / period) for gaps away from the beat period. Traced back from the best frame near the end.
 */
export function beats(e: Envelope, bpm: number, tightness = 100): number[] {
  const P = (60 / bpm) * e.rate, N = e.env.length, score = new Float64Array(N), back = new Int32Array(N).fill(-1);
  const lo = Math.max(1, Math.round(P / 2)), hi = Math.round(2 * P);
  for (let t = 0; t < N; t++) {
    let best = -Infinity, arg = -1;
    for (let g = lo; g <= hi && t - g >= 0; g++) { const v = score[t - g] - tightness * Math.log(g / P) ** 2; if (v > best) { best = v; arg = t - g; } }
    score[t] = e.env[t] + (arg >= 0 && best > 0 ? best : 0); back[t] = arg >= 0 && best > 0 ? arg : -1;
  }
  // Start from the best score in the last beat period.
  let t = N - 1; for (let k = Math.max(0, N - Math.round(P)); k < N; k++) if (score[k] > score[t]) t = k;
  const out: number[] = [];
  while (t >= 0) { out.push(frameTime(e, t)); t = back[t]; }
  return out.reverse();
}

/** A click track: short decaying 1.5 kHz bursts at `bpm` from `offset` s, every `accentEvery`th one louder, plus quieter off-beat clicks if asked. */
export function clickTrack(fs: number, seconds: number, bpm: number, o: { offset?: number; accentEvery?: number; offbeats?: boolean; noise?: number; seed?: number } = {}): { x: Float64Array; times: number[] } {
  const x = new Float64Array(Math.round(fs * seconds)), times: number[] = [], P = 60 / bpm, off = o.offset ?? 0.25;
  const burst = (t: number, a: number, f: number) => { const s = Math.round(t * fs); for (let i = 0; i < Math.round(0.03 * fs) && s + i < x.length; i++) x[s + i] += a * Math.exp(-i / (0.004 * fs)) * Math.sin((2 * Math.PI * f * i) / fs); };
  for (let k = 0; off + k * P < seconds - 0.05; k++) { const t = off + k * P; times.push(t); burst(t, o.accentEvery && k % o.accentEvery === 0 ? 0.9 : 0.6, 1500); if (o.offbeats) burst(t + P / 2, 0.25, 4000); }
  if (o.noise) { let s = o.seed ?? 1; for (let i = 0; i < x.length; i++) { s = (s * 16807) % 2147483647; x[i] += o.noise * (s / 2147483647 - 0.5); } }
  return { x, times };
}
