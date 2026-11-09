// Pitch (F0) tracking for speech: YIN (de Cheveigné and Kawahara 2002) and normalised autocorrelation,
// with a voicing threshold, a silence gate, median smoothing and semitone conversion. Plain TypeScript, no DOM.
import { resample } from './formant-audio.ts';

/**
 * YIN's cumulative mean normalised difference d′(τ) for one frame: d(τ) = Σ (x[t+j] − x[t+j+τ])² over
 * j = 0…W−1, then d′(0) = 1 and d′(τ) = d(τ) τ / Σ_{k=1..τ} d(k). Needs x from t to t + W + tauMax.
 */
export function yinCmnd(x: ArrayLike<number>, t: number, W: number, tauMax: number): Float64Array {
  const dp = new Float64Array(tauMax + 1);
  dp[0] = 1;
  let run = 0;
  for (let tau = 1; tau <= tauMax; tau++) {
    let s = 0;
    for (let j = 0; j < W; j++) { const d = x[t + j] - x[t + j + tau]; s += d * d; }
    run += s;
    dp[tau] = run > 0 ? s * tau / run : 1;
  }
  return dp;
}

/** Vertex of the parabola through (−1, a), (0, b), (1, c): the offset from the middle point. */
const parab = (a: number, b: number, c: number) => { const den = a - 2 * b + c; return den !== 0 ? Math.max(-1, Math.min(1, 0.5 * (a - c) / den)) : 0; };

export type PitchFrame = { f0: number | null; strength: number };

/**
 * YIN steps 3 to 5: the first τ from tauMin with d′(τ) below the threshold, moved on to the bottom of that
 * dip, refined by parabolic interpolation. With no dip below the threshold the frame is unvoiced.
 * `strength` is 1 − d′ at the chosen (or lowest) dip.
 */
export function yinPick(dp: ArrayLike<number>, tauMin: number, tauMax: number, threshold: number, fs: number): PitchFrame {
  let tau = -1;
  for (let k = Math.max(2, tauMin); k <= tauMax; k++) if (dp[k] < threshold) { while (k + 1 <= tauMax && dp[k + 1] < dp[k]) k++; tau = k; break; }
  if (tau < 0) {
    let lo = Infinity; for (let k = Math.max(2, tauMin); k <= tauMax; k++) lo = Math.min(lo, dp[k]);
    return { f0: null, strength: 1 - lo };
  }
  const off = tau > 0 && tau < tauMax ? parab(dp[tau - 1], dp[tau], dp[tau + 1]) : 0;
  return { f0: fs / (tau + off), strength: 1 - dp[tau] };
}

/**
 * Normalised autocorrelation for one frame: r(τ) = Σ x[j]x[j+τ] / √(Σ x[j]² Σ x[j+τ]²), j = 0…W−1, after
 * removing the frame mean. The shortest-lag peak between tauMin and tauMax within 5 % of the highest is
 * the period if r exceeds the threshold; parabolic interpolation refines it.
 */
export function acfPick(x: ArrayLike<number>, t: number, W: number, tauMin: number, tauMax: number, threshold: number, fs: number): PitchFrame {
  let m = 0; for (let j = 0; j < W + tauMax; j++) m += x[t + j]; m /= W + tauMax;
  const r = new Float64Array(tauMax + 2);
  let e0 = 0; for (let j = 0; j < W; j++) e0 += (x[t + j] - m) ** 2;
  let e1 = e0;
  for (let tau = 0; tau <= tauMax; tau++) {
    if (tau > 0) e1 += (x[t + W - 1 + tau] - m) ** 2 - (x[t + tau - 1] - m) ** 2;
    let s = 0; for (let j = 0; j < W; j++) s += (x[t + j] - m) * (x[t + j + tau] - m);
    r[tau] = e0 > 0 && e1 > 0 ? s / Math.sqrt(e0 * e1) : 0;
  }
  // The highest peak, but the shortest lag whose peak comes within 5 % of it (avoids octave-down errors).
  let top = -Infinity;
  const peaks: number[] = [];
  for (let k = Math.max(2, tauMin); k < tauMax; k++) if (r[k] > r[k - 1] && r[k] >= r[k + 1]) { peaks.push(k); top = Math.max(top, r[k]); }
  const best = peaks.find((k) => r[k] >= 0.95 * top) ?? -1, bv = best >= 0 ? r[best] : top;
  if (best < 0 || bv < threshold) return { f0: null, strength: Math.max(0, bv) };
  return { f0: fs / (best + parab(r[best - 1], r[best], r[best + 1])), strength: bv };
}

export type PitchOpts = { method?: 'yin' | 'acf'; fmin?: number; fmax?: number; threshold?: number; step?: number; silence?: number; smooth?: number };
export type PitchTrack = { t: number[]; f0: (number | null)[]; raw: (number | null)[]; strength: number[]; rms: number[]; fs: number };

/**
 * F0 every `step` seconds. Sounds above 16 kHz are resampled to 16 kHz first. The analysis window is one
 * period of the lowest pitch (YIN's integration window); frames quieter than `silence` × the loudest frame
 * are unvoiced. `smooth` is the length of a running median (1 = none) applied inside voiced stretches.
 */
export function pitchTrack(x0: ArrayLike<number>, fs0: number, o: PitchOpts = {}): PitchTrack {
  const fmin = o.fmin ?? 75, fmax = o.fmax ?? 500, method = o.method ?? 'yin', step = o.step ?? 0.01;
  const threshold = o.threshold ?? (method === 'yin' ? 0.15 : 0.5), silence = o.silence ?? 0.05;
  if (!(fmin > 0 && fmax > fmin)) throw new Error('The lowest pitch must be above 0 and below the highest.');
  const fs = fs0 > 16000 ? 16000 : fs0, x = fs0 > 16000 ? resample(x0, fs0, fs) : Float64Array.from(x0);
  const tauMax = Math.min(Math.ceil(fs / fmin) + 1, Math.floor(x.length / 3)), tauMin = Math.max(2, Math.floor(fs / fmax));
  const W = Math.ceil(fs / fmin), hop = Math.max(1, Math.round(step * fs)), span = W + tauMax + 1;
  const t: number[] = [], raw: (number | null)[] = [], strength: number[] = [], rms: number[] = [];
  if (tauMax <= tauMin || x.length < span) return { t, f0: [], raw, strength, rms, fs };
  for (let s = 0; s + span <= x.length; s += hop) {
    let e = 0; for (let j = 0; j < W; j++) e += x[s + j] * x[s + j];
    rms.push(Math.sqrt(e / W));
    t.push((s + W / 2 + tauMax / 2) / fs);
    const p = method === 'yin' ? yinPick(yinCmnd(x, s, W, tauMax), tauMin, tauMax, threshold, fs) : acfPick(x, s, W, tauMin, tauMax, threshold, fs);
    raw.push(p.f0 != null && p.f0 >= fmin * 0.97 && p.f0 <= fmax * 1.03 ? p.f0 : null); strength.push(p.strength);
  }
  const peak = Math.max(0, ...rms);
  const gated = raw.map((f, i) => (rms[i] >= silence * peak ? f : null));
  return { t, f0: medianSmooth(gated, o.smooth ?? 1), raw: gated, strength, rms, fs };
}

/** Running median of odd length k over each voiced stretch (unvoiced frames are left as they are). */
export function medianSmooth(f: (number | null)[], k: number): (number | null)[] {
  if (k <= 1) return f.slice();
  const h = Math.floor(k / 2), out = f.slice();
  for (let i = 0; i < f.length; i++) {
    if (f[i] == null) continue;
    // Only neighbours inside the same voiced stretch count.
    let a = i, b = i; while (a - 1 >= i - h && a - 1 >= 0 && f[a - 1] != null) a--; while (b + 1 <= i + h && b + 1 < f.length && f[b + 1] != null) b++;
    const v = f.slice(a, b + 1) as number[];
    v.sort((p, q) => p - q);
    out[i] = v.length % 2 ? v[(v.length - 1) / 2] : (v[v.length / 2 - 1] + v[v.length / 2]) / 2;
  }
  return out;
}

/** Semitones above a reference frequency: 12 log₂(f / ref). */
export const semitones = (f: number, ref: number) => 12 * Math.log2(f / ref);

export function pitchStats(f: (number | null)[], ref: number) {
  const v = f.filter((x): x is number => x != null), n = v.length;
  if (!n) return null;
  const s = [...v].sort((a, b) => a - b), mean = v.reduce((a, b) => a + b, 0) / n;
  const med = n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2;
  const sd = n > 1 ? Math.sqrt(v.reduce((a, b) => a + (b - mean) ** 2, 0) / (n - 1)) : 0;
  const st = v.map((x) => semitones(x, ref)), stMean = st.reduce((a, b) => a + b, 0) / n;
  const stSd = n > 1 ? Math.sqrt(st.reduce((a, b) => a + (b - stMean) ** 2, 0) / (n - 1)) : 0;
  return { n, voiced: n / f.length, mean, median: med, sd, min: s[0], max: s[n - 1], rangeSt: semitones(s[n - 1], s[0]), stMean, stSd };
}

/**
 * A made-up voice whose pitch follows f0(t) (Hz): a pulse train by phase accumulation, a −6 dB/octave tilt
 * and three vowel-like resonances, silent wherever f0(t) is 0 or less.
 */
export function synthVoice(f0: (t: number) => number, dur: number, fs: number, amp = 0.5): Float64Array {
  const n = Math.round(dur * fs), x = new Float64Array(n);
  let ph = 0;
  for (let i = 0; i < n; i++) { const f = f0(i / fs); if (f > 0) { ph += f / fs; if (ph >= 1) { ph -= 1; x[i] = 1; } } else ph = 0.999; }
  { const c = Math.exp(-2 * Math.PI * 100 / fs); let y = 0; for (let i = 0; i < n; i++) { y = x[i] + c * y; x[i] = y; } }
  let s = x;
  for (const [F, B] of [[600, 80], [1200, 100], [2500, 150]]) {
    const r = Math.exp(-Math.PI * B / fs), th = 2 * Math.PI * F / fs, a1 = 2 * r * Math.cos(th), a2 = -r * r, g = 1 - a1 - a2, y = new Float64Array(n);
    for (let i = 0; i < n; i++) y[i] = g * s[i] + a1 * (i > 0 ? y[i - 1] : 0) + a2 * (i > 1 ? y[i - 2] : 0);
    s = y;
  }
  let pk = 0; for (let i = 0; i < n; i++) pk = Math.max(pk, Math.abs(s[i]));
  for (let i = 0; i < n; i++) s[i] = (s[i] / (pk || 1)) * amp;
  return s;
}
