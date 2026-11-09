// Vowel formants by linear prediction (LPC): pre-emphasis, Hamming window, autocorrelation, Levinson-Durbin,
// then the roots of the prediction polynomial give each resonance's frequency and bandwidth. Plus Lobanov
// normalisation and a small synthesiser for made-up example vowels. Plain TypeScript, no DOM.
import { resample } from './formant-audio.ts';
import { parseTable, num } from './num.ts';

export type C = [number, number];

/** First-order pre-emphasis y[n] = x[n] − α x[n−1], with α = exp(−2π·from/fs) (Praat's "from 50 Hz"). */
export function preEmphasis(x: ArrayLike<number>, fs: number, from = 50): Float64Array {
  const a = Math.exp(-2 * Math.PI * from / fs), y = new Float64Array(x.length);
  for (let i = x.length - 1; i > 0; i--) y[i] = x[i] - a * x[i - 1];
  if (x.length) y[0] = x[0];
  return y;
}

/** Hamming window 0.54 − 0.46 cos(2πn/(N−1)). */
export function hamming(n: number): Float64Array {
  const w = new Float64Array(n);
  for (let i = 0; i < n; i++) w[i] = n === 1 ? 1 : 0.54 - 0.46 * Math.cos(2 * Math.PI * i / (n - 1));
  return w;
}

/** Autocorrelation r[0..p] of x. */
export function autocorr(x: ArrayLike<number>, p: number): Float64Array {
  const r = new Float64Array(p + 1);
  for (let k = 0; k <= p; k++) { let s = 0; for (let i = 0; i + k < x.length; i++) s += x[i] * x[i + k]; r[k] = s; }
  return r;
}

/**
 * Levinson-Durbin recursion: the prediction polynomial A(z) = 1 + a₁z⁻¹ + … + a_p z⁻ᵖ that minimises the
 * prediction error for autocorrelation r. Returns a (a[0] = 1), the final error and the reflection coefficients.
 */
export function levinson(r: ArrayLike<number>, p: number): { a: Float64Array; err: number; k: Float64Array } {
  const a = new Float64Array(p + 1), k = new Float64Array(p);
  a[0] = 1; let err = r[0];
  if (!(err > 0)) return { a, err: 0, k };
  for (let i = 1; i <= p; i++) {
    let acc = r[i];
    for (let j = 1; j < i; j++) acc += a[j] * r[i - j];
    const ki = -acc / err;
    k[i - 1] = ki;
    const prev = a.slice();
    for (let j = 1; j < i; j++) a[j] = prev[j] + ki * prev[i - j];
    a[i] = ki;
    err *= 1 - ki * ki;
    if (!(err > 0)) { err = 0; break; }
  }
  return { a, err, k };
}

const cmul = (a: C, b: C): C => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
const cdiv = (a: C, b: C): C => { const d = b[0] * b[0] + b[1] * b[1]; return [(a[0] * b[0] + a[1] * b[1]) / d, (a[1] * b[0] - a[0] * b[1]) / d]; };

/**
 * All complex roots of the polynomial c[0] zⁿ + c[1] zⁿ⁻¹ + … + c[n] (real coefficients), by the
 * Aberth-Ehrlich method, which finds every root at once and converges cubically.
 */
export function polyRoots(c: ArrayLike<number>): C[] {
  let co = Array.from(c);
  while (co.length > 1 && co[0] === 0) co.shift();
  const n = co.length - 1;
  if (n < 1) return [];
  co = co.map((v) => v / co[0]);
  // Starting points on a circle, rotated so none sits on the real axis.
  const r0 = Math.max(0.5, Math.abs(co[n]) ** (1 / n));
  const z: C[] = Array.from({ length: n }, (_, k) => { const t = 2 * Math.PI * k / n + 0.4; return [r0 * Math.cos(t), r0 * Math.sin(t)]; });
  const evalP = (x: C): [C, C] => {
    let p: C = [co[0], 0], d: C = [0, 0];
    for (let i = 1; i <= n; i++) { d = cmul(d, x); d[0] += p[0]; d[1] += p[1]; p = cmul(p, x); p[0] += co[i]; }
    return [p, d];
  };
  for (let it = 0; it < 500; it++) {
    let worst = 0;
    for (let k = 0; k < n; k++) {
      const [p, d] = evalP(z[k]);
      if (p[0] === 0 && p[1] === 0) continue;
      const ratio = cdiv(p, d);
      let s: C = [0, 0];
      for (let j = 0; j < n; j++) if (j !== k) { const q = cdiv([1, 0], [z[k][0] - z[j][0], z[k][1] - z[j][1]]); s[0] += q[0]; s[1] += q[1]; }
      const den: C = [1 - (ratio[0] * s[0] - ratio[1] * s[1]), -(ratio[0] * s[1] + ratio[1] * s[0])];
      const w = cdiv(ratio, den);
      if (!Number.isFinite(w[0]) || !Number.isFinite(w[1])) continue;
      z[k] = [z[k][0] - w[0], z[k][1] - w[1]];
      worst = Math.max(worst, Math.hypot(w[0], w[1]) / (1 + Math.hypot(z[k][0], z[k][1])));
    }
    if (worst < 1e-15) break;
  }
  return z.map((r) => [r[0], Math.abs(r[1]) < 1e-12 ? 0 : r[1]] as C);
}

export type Formant = { f: number; bw: number };

/** Resonances (frequency and bandwidth in Hz) from the roots of A(z), lowest first. */
export function rootsToFormants(a: ArrayLike<number>, fs: number, opts: { minF?: number; maxF?: number; maxBw?: number } = {}): Formant[] {
  const minF = opts.minF ?? 50, maxF = opts.maxF ?? fs / 2 - 50, maxBw = opts.maxBw ?? Infinity;
  const out: Formant[] = [];
  for (const [re, im] of polyRoots(a)) {
    if (im <= 0) continue;
    const f = Math.atan2(im, re) * fs / (2 * Math.PI), bw = -Math.log(Math.hypot(re, im)) * fs / Math.PI;
    if (f > minF && f < maxF && bw > 0 && bw < maxBw) out.push({ f, bw });
  }
  return out.sort((p, q) => p.f - q.f);
}

/** LPC formants of one frame (already pre-emphasised): Hamming window, autocorrelation, Levinson-Durbin, roots. */
export function frameFormants(frame: ArrayLike<number>, fs: number, order: number, opts: { maxBw?: number; maxF?: number } = {}): Formant[] | null {
  const w = hamming(frame.length), x = new Float64Array(frame.length);
  for (let i = 0; i < frame.length; i++) x[i] = frame[i] * w[i];
  const r = autocorr(x, order);
  if (!(r[0] > 1e-12)) return null;
  const { a, err } = levinson(r, order);
  if (!(err > 0)) return null;
  return rootsToFormants(a, fs, { maxBw: opts.maxBw, maxF: opts.maxF });
}

export type Track = { fs: number; t: number[]; F: (number | null)[][]; B: (number | null)[][]; rms: number[] };
export type TrackOpts = { maxFormant?: number; nFormants?: number; window?: number; step?: number; preFrom?: number; maxBw?: number; keep?: number };

/**
 * Formant tracks over a whole sound. The sound is resampled to twice the highest formant wanted (as Praat
 * does), pre-emphasised, cut into frames of `window` seconds every `step` seconds, and each frame gets an
 * LPC of order 2 × nFormants. The lowest `keep` resonances with bandwidth under maxBw become F1, F2, F3, …
 */
export function formantTrack(x: ArrayLike<number>, fs: number, o: TrackOpts = {}): Track {
  const maxFormant = o.maxFormant ?? 5500, nF = o.nFormants ?? 5, win = o.window ?? 0.025, step = o.step ?? 0.005;
  const keep = o.keep ?? 3, maxBw = o.maxBw ?? 700;
  const fsA = Math.round(2 * maxFormant);
  const y = preEmphasis(fsA < fs ? resample(x, fs, fsA) : Float64Array.from(x), Math.min(fs, fsA), o.preFrom ?? 50);
  const rate = Math.min(fs, fsA), N = Math.max(8, Math.round(win * rate)), hop = Math.max(1, Math.round(step * rate));
  const order = 2 * nF;
  const t: number[] = [], F: (number | null)[][] = Array.from({ length: keep }, () => []), B: (number | null)[][] = Array.from({ length: keep }, () => []), rms: number[] = [];
  for (let s = 0; s + N <= y.length; s += hop) {
    const fr = y.subarray(s, s + N);
    let e = 0; for (let i = 0; i < N; i++) e += fr[i] * fr[i];
    rms.push(Math.sqrt(e / N));
    t.push((s + N / 2) / rate);
    const fm = frameFormants(fr, rate, order, { maxBw, maxF: Math.min(maxFormant, rate / 2) - 50 }) ?? [];
    for (let k = 0; k < keep; k++) { F[k].push(fm[k]?.f ?? null); B[k].push(fm[k]?.bw ?? null); }
  }
  return { fs: rate, t, F, B, rms };
}

export const median = (v: number[]) => { const s = [...v].sort((a, b) => a - b), n = s.length; return n ? (n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2) : NaN; };

/**
 * Median of each formant over the frames between t0 and t1 seconds, leaving out quiet frames (below
 * `quiet` × the loudest frame's RMS in the span).
 */
export function spanFormants(tr: Track, t0: number, t1: number, quiet = 0.1): { F: number[]; sd: number[]; frames: number } {
  const idx = tr.t.map((t, i) => i).filter((i) => tr.t[i] >= t0 && tr.t[i] <= t1);
  const loud = Math.max(0, ...idx.map((i) => tr.rms[i]));
  const use = idx.filter((i) => tr.rms[i] >= quiet * loud && loud > 0);
  const F: number[] = [], sd: number[] = [];
  for (const row of tr.F) {
    const v = use.map((i) => row[i]).filter((f): f is number => f != null);
    F.push(median(v));
    const m = v.reduce((s, x) => s + x, 0) / v.length;
    sd.push(v.length > 1 ? Math.sqrt(v.reduce((s, x) => s + (x - m) ** 2, 0) / (v.length - 1)) : NaN);
  }
  return { F, sd, frames: use.length };
}

/**
 * Lobanov (1971) normalisation: each formant becomes a z-score, (F − mean) / SD, using the mean and
 * standard deviation (n − 1) of that speaker's values for that formant.
 */
export function lobanov(values: number[], groups: string[]): number[] {
  const out = new Array<number>(values.length).fill(NaN);
  for (const g of new Set(groups)) {
    const idx = groups.map((x, i) => (x === g && Number.isFinite(values[i]) ? i : -1)).filter((i) => i >= 0);
    const m = idx.reduce((s, i) => s + values[i], 0) / idx.length;
    const sd = Math.sqrt(idx.reduce((s, i) => s + (values[i] - m) ** 2, 0) / (idx.length - 1));
    for (const i of idx) out[i] = idx.length > 1 && sd > 0 ? (values[i] - m) / sd : NaN;
  }
  return out;
}

export type VowelRow = { vowel: string; F1: number; F2: number; F3: number; speaker: string };

/**
 * A pasted table of vowels: columns vowel (or label), F1, F2, optional F3 and speaker, found by their header
 * names; without a header the order is vowel, F1, F2, F3, speaker.
 */
export function parseVowelTable(text: string): { rows: VowelRow[]; skipped: number } {
  const t = parseTable(text).filter((r) => r.some((c) => c.trim() !== ''));
  if (!t.length) throw new Error('Paste a table of vowels with F1 and F2 first.');
  const h = t[0].map((c) => c.trim().toLowerCase().replace(/[^a-z0-9]/g, ''));
  const has = h.some((c) => /^f[123]/.test(c));
  let col = { vowel: 0, F1: 1, F2: 2, F3: 3, speaker: 4 } as Record<string, number>;
  if (has) {
    const find = (re: RegExp) => h.findIndex((c) => re.test(c));
    col = { vowel: find(/^(vowel|label|v|ipa|segment|phone|word|token)/), F1: find(/^f1/), F2: find(/^f2/), F3: find(/^f3/), speaker: find(/^(speaker|talker|subject|participant|id|group|spk)/) };
    if (col.F1 < 0 || col.F2 < 0) throw new Error('The header needs columns named F1 and F2.');
    if (col.vowel < 0) col.vowel = [0, 1, 2, 3, 4].find((i) => i < h.length && !Object.values(col).includes(i)) ?? -1;
  }
  const rows: VowelRow[] = []; let skipped = 0;
  for (const r of has ? t.slice(1) : t) {
    const g = (k: string) => (col[k] >= 0 ? (r[col[k]] ?? '').trim() : '');
    const F1 = num(g('F1')), F2 = num(g('F2')), F3 = g('F3') === '' ? NaN : num(g('F3'));
    if (!Number.isFinite(F1) || !Number.isFinite(F2) || F1 <= 0 || F2 <= 0) { skipped++; continue; }
    rows.push({ vowel: g('vowel') || '?', F1, F2, F3, speaker: g('speaker') || 'all' });
  }
  if (!rows.length) throw new Error('No row has numbers for both F1 and F2 (in Hz).');
  return { rows, skipped };
}

/**
 * A made-up vowel: a glottal pulse train at f0 (net −6 dB/octave, as radiated speech) through a cascade
 * of two-pole resonators at the given formant frequencies and bandwidths, with a short fade in and out.
 */
export function synthVowel(formants: number[], bws: number[], f0: number, dur: number, fs: number, amp = 0.5): Float64Array {
  const n = Math.round(dur * fs), x = new Float64Array(n);
  const period = fs / f0;
  for (let p = 0; p < n; p += period) x[Math.floor(p)] = 1;
  // One leaky integrator: the −12 dB/octave glottal source plus +6 dB/octave lip radiation.
  { const c = Math.exp(-2 * Math.PI * 100 / fs); let y = 0; for (let i = 0; i < n; i++) { y = x[i] + c * y; x[i] = y; } }
  let s = x;
  formants.forEach((f, k) => {
    const r = Math.exp(-Math.PI * bws[k] / fs), th = 2 * Math.PI * f / fs, a1 = 2 * r * Math.cos(th), a2 = -r * r, g = 1 - a1 - a2;
    const y = new Float64Array(n);
    for (let i = 0; i < n; i++) y[i] = g * s[i] + a1 * (i > 0 ? y[i - 1] : 0) + a2 * (i > 1 ? y[i - 2] : 0);
    s = y;
  });
  let peak = 0; for (let i = 0; i < n; i++) peak = Math.max(peak, Math.abs(s[i]));
  const fade = Math.round(0.02 * fs);
  for (let i = 0; i < n; i++) { const e = Math.min(1, i / fade, (n - 1 - i) / fade); s[i] = (s[i] / peak) * amp * e; }
  return s;
}

/**
 * Stretches of sound louder than `rel` × the loudest frame for at least `minDur` seconds (vowels and other
 * voiced stretches), as [start, end] times in seconds. Gaps shorter than `gap` seconds are bridged.
 */
export function loudSpans(tr: Track, rel = 0.2, minDur = 0.06, gap = 0.03): [number, number][] {
  const peak = Math.max(0, ...tr.rms), out: [number, number][] = [];
  if (!(peak > 0)) return out;
  let s = -1;
  for (let i = 0; i <= tr.t.length; i++) {
    const on = i < tr.t.length && tr.rms[i] >= rel * peak;
    if (on && s < 0) s = i;
    if (!on && s >= 0) { const a = tr.t[s], b = tr.t[i - 1]; const last = out[out.length - 1]; if (last && a - last[1] < gap) last[1] = b; else out.push([a, b]); s = -1; }
  }
  return out.filter(([a, b]) => b - a >= minDur);
}
