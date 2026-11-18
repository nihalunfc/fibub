// Mastering chain for the music tools: 3-band tone EQ, glue compressor, stereo width, a look-ahead brickwall limiter
// with a 4x oversampled true-peak ceiling, a "hit target LUFS" solver and TPDF dither. Plain TypeScript, no DOM.
// EQ filters: Robert Bristow-Johnson, "Cookbook formulae for audio EQ biquad filter coefficients" (W3C Audio EQ Cookbook).
// Loudness: ITU-R BS.1770-4 (K-weighting from loudness.ts, 400 ms blocks, -70 LUFS absolute and -10 LU relative gates).
import { kWeighting } from './loudness.ts';

export type Biquad = { b: [number, number, number]; a: [number, number, number] };

// ---------- RBJ cookbook biquads (normalised so a0 = 1) ----------
const norm = (b0: number, b1: number, b2: number, a0: number, a1: number, a2: number): Biquad => ({ b: [b0 / a0, b1 / a0, b2 / a0], a: [1, a1 / a0, a2 / a0] });

/** Low shelf: gain (dB) below f, shelf slope S = 1 (the steepest without a bump). */
export function lowShelf(f: number, db: number, rate: number, S = 1): Biquad {
  const A = Math.pow(10, db / 40), w = (2 * Math.PI * f) / rate, cw = Math.cos(w), sw = Math.sin(w);
  const al = (sw / 2) * Math.sqrt((A + 1 / A) * (1 / S - 1) + 2), r = 2 * Math.sqrt(A) * al;
  return norm(A * (A + 1 - (A - 1) * cw + r), 2 * A * (A - 1 - (A + 1) * cw), A * (A + 1 - (A - 1) * cw - r),
    A + 1 + (A - 1) * cw + r, -2 * (A - 1 + (A + 1) * cw), A + 1 + (A - 1) * cw - r);
}
/** High shelf: gain (dB) above f. */
export function highShelf(f: number, db: number, rate: number, S = 1): Biquad {
  const A = Math.pow(10, db / 40), w = (2 * Math.PI * f) / rate, cw = Math.cos(w), sw = Math.sin(w);
  const al = (sw / 2) * Math.sqrt((A + 1 / A) * (1 / S - 1) + 2), r = 2 * Math.sqrt(A) * al;
  return norm(A * (A + 1 + (A - 1) * cw + r), -2 * A * (A - 1 + (A + 1) * cw), A * (A + 1 + (A - 1) * cw - r),
    A + 1 - (A - 1) * cw + r, 2 * (A - 1 - (A + 1) * cw), A + 1 - (A - 1) * cw - r);
}
/** Peaking (bell) EQ: gain (dB) around f with quality Q. */
export function peaking(f: number, db: number, q: number, rate: number): Biquad {
  const A = Math.pow(10, db / 40), w = (2 * Math.PI * f) / rate, al = Math.sin(w) / (2 * q), cw = Math.cos(w);
  return norm(1 + al * A, -2 * cw, 1 - al * A, 1 + al / A, -2 * cw, 1 - al / A);
}
/** Second-order Butterworth low or high pass (cookbook LPF/HPF with Q = 1/sqrt 2). */
export function pass(kind: 'low' | 'high', f: number, rate: number, q = Math.SQRT1_2): Biquad {
  const w = (2 * Math.PI * f) / rate, cw = Math.cos(w), al = Math.sin(w) / (2 * q);
  return kind === 'low' ? norm((1 - cw) / 2, 1 - cw, (1 - cw) / 2, 1 + al, -2 * cw, 1 - al) : norm((1 + cw) / 2, -(1 + cw), (1 + cw) / 2, 1 + al, -2 * cw, 1 - al);
}
/** Gain (dB) of a biquad at frequency f. */
export function biquadDb(q: Biquad, f: number, rate: number): number {
  const w = (2 * Math.PI * f) / rate, c1 = Math.cos(w), s1 = Math.sin(w), c2 = Math.cos(2 * w), s2 = Math.sin(2 * w);
  const nr = q.b[0] + q.b[1] * c1 + q.b[2] * c2, ni = -(q.b[1] * s1 + q.b[2] * s2);
  const dr = 1 + q.a[1] * c1 + q.a[2] * c2, di = -(q.a[1] * s1 + q.a[2] * s2);
  return 10 * Math.log10((nr * nr + ni * ni) / (dr * dr + di * di));
}
/** Run a biquad over x (Direct Form I, double precision state). */
export function runBiquad(x: Float32Array, f: Biquad): Float32Array {
  const y = new Float32Array(x.length), [b0, b1, b2] = f.b, [, a1, a2] = f.a;
  let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
  for (let i = 0; i < x.length; i++) { const v = x[i], o = b0 * v + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2; x2 = x1; x1 = v; y2 = y1; y1 = o; y[i] = o; }
  return y;
}

// ---------- Tone EQ ----------
export type EqSettings = { lowDb: number; lowHz: number; midDb: number; midHz: number; midQ: number; highDb: number; highHz: number };
export const EQ_FLAT: EqSettings = { lowDb: 0, lowHz: 100, midDb: 0, midHz: 1000, midQ: 0.7, highDb: 0, highHz: 8000 };
export function eqFilters(e: EqSettings, rate: number): Biquad[] {
  const out: Biquad[] = [];
  if (e.lowDb) out.push(lowShelf(e.lowHz, e.lowDb, rate));
  if (e.midDb) out.push(peaking(e.midHz, e.midDb, e.midQ, rate));
  if (e.highDb) out.push(highShelf(Math.min(e.highHz, rate * 0.45), e.highDb, rate));
  return out;
}
export function toneEq(chans: Float32Array[], rate: number, e: EqSettings): Float32Array[] {
  const fs = eqFilters(e, rate);
  return chans.map((c) => fs.reduce((x, f) => runBiquad(x, f), c));
}

// ---------- Glue compressor ----------
export type CompSettings = { thresholdDb: number; ratio: number; attackMs: number; releaseMs: number; makeupDb: number; kneeDb?: number };
/** Gain reduction (dB, >= 0) of the static curve for an input level (dB), with a soft knee. */
export function compCurve(levelDb: number, c: CompSettings): number {
  const k = c.kneeDb ?? 6, over = levelDb - c.thresholdDb, s = 1 - 1 / c.ratio;
  if (2 * over <= -k) return 0;
  if (2 * Math.abs(over) < k) return (s * (over + k / 2) ** 2) / (2 * k);
  return s * over;
}
/** Stereo-linked feed-forward compressor (peak detector, smoothed gain in dB). Returns the output and gain reduction. */
export function compress(chans: Float32Array[], rate: number, c: CompSettings): { chans: Float32Array[]; maxGrDb: number; avgGrDb: number } {
  const n = chans[0]?.length ?? 0, out = chans.map(() => new Float32Array(n));
  const at = Math.exp(-1 / (Math.max(0.1, c.attackMs) * 1e-3 * rate)), rt = Math.exp(-1 / (Math.max(1, c.releaseMs) * 1e-3 * rate));
  const mk = Math.pow(10, c.makeupDb / 20);
  // Below the bottom of the knee nothing happens, so skip the log there.
  const lin0 = Math.pow(10, (c.thresholdDb - (c.kneeDb ?? 6) / 2) / 20);
  let g = 0, maxGr = 0, sumGr = 0;
  for (let i = 0; i < n; i++) {
    let p = 0; for (const ch of chans) { const a = Math.abs(ch[i]); if (a > p) p = a; }
    const want = p > lin0 ? compCurve(20 * Math.log10(p), c) : 0;
    g = want > g ? at * g + (1 - at) * want : rt * g + (1 - rt) * want;
    if (g > maxGr) maxGr = g; sumGr += g;
    const m = mk * Math.exp(-g * 0.11512925464970229);
    for (let k = 0; k < chans.length; k++) out[k][i] = chans[k][i] * m;
  }
  return { chans: out, maxGrDb: maxGr, avgGrDb: n ? sumGr / n : 0 };
}

// ---------- Stereo width ----------
/** Mid/side width: 0 = mono, 1 = unchanged, 2 = side doubled. Mono files are returned as they are. */
export function width(chans: Float32Array[], w: number): Float32Array[] {
  if (chans.length !== 2 || w === 1) return chans;
  const [L, R] = chans, n = L.length, l = new Float32Array(n), r = new Float32Array(n);
  for (let i = 0; i < n; i++) { const m = (L[i] + R[i]) / 2, s = ((L[i] - R[i]) / 2) * w; l[i] = m + s; r[i] = m - s; }
  return [l, r];
}

// ---------- True peak (same 4x interpolator as loudness.ts: 12-tap Kaiser-windowed sinc per phase, BS.1770 Annex 2) ----------
const TP = [1, 2, 3].map((p) => {
  const f = p / 4, h: number[] = [];
  const i0 = (v: number) => { let s = 1, t = 1; for (let k = 1; k < 25; k++) { t *= (v / (2 * k)) ** 2; s += t; } return s; };
  for (let k = -5; k <= 6; k++) { const t = k - f, r = t / 6.5, w = Math.abs(r) >= 1 ? 0 : i0(6 * Math.sqrt(1 - r * r)) / i0(6); h.push(t === 0 ? 1 : (Math.sin(Math.PI * t) / (Math.PI * t)) * w); }
  return h;
});
/** Per-sample peak envelope: the largest of |x| and the 4x oversampled points next to each sample, over all channels. */
export function peakEnvelope(chans: Float32Array[]): Float32Array {
  const n = chans[0]?.length ?? 0, env = new Float32Array(n), H = Float64Array.from(TP.flat());
  for (const src of chans) {
    // Zero-padded copy so the inner loop needs no bounds checks.
    const x = new Float32Array(n + 12); x.set(src, 5);
    for (let i = 0; i < n; i++) { const a = Math.abs(src[i]); if (a > env[i]) env[i] = a; }
    for (let i = 0; i + 1 < n; i++) {
      let p = 0;
      for (let ph = 0; ph < 36; ph += 12) {
        let s = 0; for (let k = 0; k < 12; k++) s += x[i + k] * H[ph + k];
        const a = s < 0 ? -s : s; if (a > p) p = a;
      }
      if (p > env[i]) env[i] = p;
      if (p > env[i + 1]) env[i + 1] = p;
    }
  }
  return env;
}
/** True peak in dBTP (4x oversampled, edges zero-padded). */
export function truePeakDb(chans: Float32Array[]): number {
  const e = peakEnvelope(chans); let p = 0; for (let i = 0; i < e.length; i++) if (e[i] > p) p = e[i];
  return p > 0 ? 20 * Math.log10(p) : -Infinity;
}

// ---------- Look-ahead brickwall limiter ----------
export type LimitSettings = { ceilingDb: number; lookaheadMs?: number; releaseMs?: number };
/**
 * Limit chans * gain so the true peak stays at or under the ceiling. The gain the peaks need is taken as a running
 * minimum over the look-ahead, eased back up over the release, then averaged over the look-ahead, so the gain falls
 * smoothly before each peak and every sample still gets at most the gain it needs. A second pass catches the
 * small overshoots that a changing gain can make between samples.
 */
export function limit(chans: Float32Array[], rate: number, s: LimitSettings, gainDb = 0, env?: Float32Array): { chans: Float32Array[]; maxGrDb: number; gr: Float32Array } {
  // gr: gain reduction in dB, the largest in each 10 ms block.
  const n = chans[0]?.length ?? 0, g0 = Math.pow(10, gainDb / 20);
  let cur = chans, total = new Float32Array(n).fill(1), gain = g0;
  const top = Math.pow(10, s.ceilingDb / 20);
  for (let pass = 0; pass < 4; pass++) {
    const e = pass === 0 && env ? env : peakEnvelope(cur);
    // Aim a hair under the ceiling (more on each extra pass); only a real overshoot of the ceiling needs another pass.
    const aim = Math.pow(10, (s.ceilingDb - 0.01 - 0.03 * pass) / 20);
    let over = false;
    for (let i = 0; i < n; i++) if (e[i] * gain > (pass ? top : aim)) { over = true; break; }
    if (!over) {
      if (gain !== 1) { cur = cur.map((c) => c.map((v) => v * gain)); for (let i = 0; i < n; i++) total[i] *= gain; }
      break;
    }
    const G = gainCurve(e, gain, aim, rate, s.lookaheadMs ?? 2, s.releaseMs ?? 60);
    cur = cur.map((c) => { const o = new Float32Array(n); for (let i = 0; i < n; i++) o[i] = c[i] * G[i]; return o; });
    for (let i = 0; i < n; i++) total[i] *= G[i];
    gain = 1;
  }
  // Gain reduction, as the largest per 10 ms block.
  const blk = Math.max(1, Math.round(rate / 100)), gr = new Float32Array(Math.ceil(n / blk));
  let maxGr = 0;
  for (let k = 0; k < gr.length; k++) {
    let lo = Infinity; for (let i = k * blk, e = Math.min(n, i + blk); i < e; i++) if (total[i] < lo) lo = total[i];
    const d = Math.max(0, -20 * Math.log10(Math.max(1e-9, lo / g0))); gr[k] = d; if (d > maxGr) maxGr = d;
  }
  return { chans: cur, maxGrDb: maxGr, gr };
}

function gainCurve(env: Float32Array, gain: number, ceil: number, rate: number, laMs: number, relMs: number): Float32Array {
  const n = env.length, La = Math.max(1, Math.round((laMs / 1000) * rate)), rc = 1 - Math.exp(-1 / ((relMs / 1000) * rate));
  const g = new Float64Array(n);
  for (let i = 0; i < n; i++) { const p = env[i] * gain; g[i] = p > ceil ? (ceil / p) * gain : gain; }
  // Forward running minimum over [i, i + La] (monotonic deque).
  const m = new Float64Array(n), dq = new Int32Array(n + La + 1); let h = 0, t = 0, next = 0;
  for (let i = 0; i < n; i++) {
    const end = Math.min(n - 1, i + La);
    while (next <= end) { while (t > h && g[dq[t - 1]] >= g[next]) t--; dq[t++] = next++; }
    while (dq[h] < i) h++;
    m[i] = g[dq[h]];
  }
  // Release: falls at once, rises gently.
  const r = new Float64Array(n); let prev = gain;
  for (let i = 0; i < n; i++) { prev = m[i] < prev ? m[i] : prev + (m[i] - prev) * rc; r[i] = prev; }
  // Average over [i - La, i] (missing samples before the start count as the plain gain, which is never smaller).
  const G = new Float32Array(n); let sum = gain * (La + 1);
  for (let i = 0; i < n; i++) { sum += r[i] - (i - La - 1 >= 0 ? r[i - La - 1] : gain); G[i] = Math.min(r[i], sum / (La + 1)); }
  return G;
}

// ---------- Integrated loudness (fast: no range or peak) ----------
/** BS.1770 integrated loudness in LUFS (-Infinity for silence). Matches measure().integrated in loudness.ts. */
export function integratedLufs(chans: Float32Array[], rate: number): number {
  const n = chans[0]?.length ?? 0, len = Math.round(0.4 * rate), hop = Math.round(0.1 * rate);
  if (n < len) return -Infinity;
  const [sh, hp] = kWeighting(rate), wt = (c: number) => (chans.length === 6 ? [1, 1, 1, 0, 1.41, 1.41][c] : chans.length === 5 ? [1, 1, 1, 1.41, 1.41][c] : 1);
  const z: number[] = [];
  const cums = chans.map((c, ci) => {
    const y = runBiquad(runBiquad(c, sh), hp), cum = new Float64Array(n + 1), w = wt(ci);
    for (let i = 0; i < n; i++) cum[i + 1] = cum[i] + w * y[i] * y[i];
    return cum;
  });
  for (let s = 0; s + len <= n; s += hop) { let v = 0; for (const c of cums) v += (c[s + len] - c[s]) / len; z.push(v); }
  const L = (v: number) => -0.691 + 10 * Math.log10(v);
  const abs = z.filter((v) => L(v) > -70);
  if (!abs.length) return -Infinity;
  const rel = L(abs.reduce((a, b) => a + b, 0) / abs.length) - 10, g = abs.filter((v) => L(v) > rel);
  return g.length ? L(g.reduce((a, b) => a + b, 0) / g.length) : -Infinity;
}

// ---------- Hit a target ----------
export type TargetResult = { chans: Float32Array[]; gainDb: number; lufs: number; truePeakDb: number; maxGrDb: number; gr: Float32Array; reached: boolean; iterations: number };
/**
 * Find the gain into the limiter that brings the integrated loudness within 0.1 LU of the target with the true peak
 * at or under the ceiling (secant steps; loudness after the limiter rises with the gain). maxGainDb caps the push:
 * if the target needs more, the result says reached: false.
 */
export function hitTarget(chans: Float32Array[], rate: number, target: number, lim: LimitSettings, opts: { maxGainDb?: number; onStep?: (i: number) => void } = {}): TargetResult {
  const start = integratedLufs(chans, rate), env = peakEnvelope(chans), maxG = opts.maxGainDb ?? 24;
  if (!isFinite(start)) { const r = limit(chans, rate, lim, 0, env); return { ...r, gainDb: 0, lufs: -Infinity, truePeakDb: truePeakDb(r.chans), reached: false, iterations: 0 }; }
  const run = (g: number) => { const r = limit(chans, rate, lim, g, env); return { r, l: integratedLufs(r.chans, rate) }; };
  let g1 = Math.min(maxG, target - start), a = run(g1), f1 = a.l - target, it = 1;
  let g0 = g1, f0 = f1;
  while (Math.abs(f1) > 0.05 && it < 12) {
    opts.onStep?.(it);
    let g = it === 1 || f1 === f0 ? g1 - f1 : g1 - (f1 * (g1 - g0)) / (f1 - f0);
    if (!isFinite(g)) break;
    g = Math.min(maxG, Math.max(g1 - 30, g));
    if (g === g1) break;
    g0 = g1; f0 = f1; g1 = g; a = run(g1); f1 = a.l - target; it++;
  }
  return { chans: a.r.chans, gainDb: g1, lufs: a.l, truePeakDb: truePeakDb(a.r.chans), maxGrDb: a.r.maxGrDb, gr: a.r.gr, reached: Math.abs(f1) <= 0.1, iterations: it };
}

// ---------- Whole chain ----------
export type MasterSettings = { eq: EqSettings; comp: CompSettings | null; width: number; target: number; ceilingDb: number; releaseMs: number };
export type MasterResult = TargetResult & { compGrDb: number };
export function master(chans: Float32Array[], rate: number, s: MasterSettings, onStep?: (stage: string) => void): MasterResult {
  onStep?.('eq'); let x = toneEq(chans, rate, s.eq);
  let compGr = 0;
  if (s.comp) { onStep?.('comp'); const c = compress(x, rate, s.comp); x = c.chans; compGr = c.maxGrDb; }
  x = width(x, s.width);
  onStep?.('limit');
  const r = hitTarget(x, rate, s.target, { ceilingDb: s.ceilingDb, releaseMs: s.releaseMs });
  return { ...r, compGrDb: compGr };
}

// ---------- Dither ----------
/** TPDF dither for a bit depth: adds triangular noise of +-1 LSB (two uniform values) before rounding. Seeded, so repeatable. */
export function tpdf(chans: Float32Array[], bits = 16, seed = 22222): Float32Array[] {
  const lsb = 1 / Math.pow(2, bits - 1); let s = seed >>> 0;
  const rnd = () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
  return chans.map((c) => { const o = new Float32Array(c.length); for (let i = 0; i < c.length; i++) o[i] = c[i] + (rnd() - rnd()) * lsb; return o; });
}

/** Scale every channel by a gain in dB (new arrays). */
export const scaleDb = (chans: Float32Array[], db: number) => { const g = Math.pow(10, db / 20); return chans.map((c) => c.map((v) => v * g)); };
