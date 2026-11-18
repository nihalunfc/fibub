// Stereo checks for mixes: phase correlation over time and per band, mid/side energy, mono-compatibility loss
// (BS.1770 loudness of the stereo mix against its mono fold-down), left/right balance and an averaged spectrum.
// Plain TypeScript, no DOM.
import { pass, runBiquad, integratedLufs } from './master.ts';
import { fft } from '../sci/dsp.ts';

const db = (v: number) => (v > 0 ? 10 * Math.log10(v) : -Infinity);

/** Pearson correlation of L and R over [a, b): +1 identical, 0 unrelated, -1 inverted. NaN when either side is silent. */
export function correlation(L: Float32Array, R: Float32Array, a = 0, b = L.length): number {
  let lr = 0, ll = 0, rr = 0;
  for (let i = a; i < b; i++) { const l = L[i], r = R[i]; lr += l * r; ll += l * l; rr += r * r; }
  return ll > 1e-12 && rr > 1e-12 ? lr / Math.sqrt(ll * rr) : NaN;
}

/** Correlation in windows (default 100 ms): one value per window, NaN where silent. */
export function correlationTrack(L: Float32Array, R: Float32Array, rate: number, winMs = 100): Float32Array {
  const w = Math.max(1, Math.round((winMs / 1000) * rate)), n = Math.floor(L.length / w), out = new Float32Array(n);
  for (let k = 0; k < n; k++) out[k] = correlation(L, R, k * w, (k + 1) * w);
  return out;
}

/** Stretches where the windowed correlation is below a limit (default 0), merged when closer than one window. */
export function flagged(track: Float32Array, winMs: number, below = 0, minMs = 200): { start: number; end: number; min: number }[] {
  const out: { start: number; end: number; min: number }[] = [];
  let cur: { start: number; end: number; min: number } | null = null;
  for (let k = 0; k < track.length; k++) {
    const v = track[k];
    if (v < below) {
      if (cur && k * winMs / 1000 - cur.end <= winMs / 1000) { cur.end = (k + 1) * winMs / 1000; cur.min = Math.min(cur.min, v); }
      else { if (cur) out.push(cur); cur = { start: (k * winMs) / 1000, end: ((k + 1) * winMs) / 1000, min: v }; }
    }
  }
  if (cur) out.push(cur);
  return out.filter((r) => (r.end - r.start) * 1000 >= minMs);
}

/** Mid (L+R)/2 and side (L-R)/2 energy in dB, and side relative to mid. */
export function midSide(L: Float32Array, R: Float32Array): { midDb: number; sideDb: number; sideToMidDb: number } {
  let m = 0, s = 0;
  for (let i = 0; i < L.length; i++) { const a = (L[i] + R[i]) / 2, b = (L[i] - R[i]) / 2; m += a * a; s += b * b; }
  const n = Math.max(1, L.length);
  return { midDb: db(m / n), sideDb: db(s / n), sideToMidDb: m > 0 ? db(s / m) : Infinity };
}

/** Left minus right level (RMS, dB): positive = left louder. */
export function balanceDb(L: Float32Array, R: Float32Array): number {
  let l = 0, r = 0; for (let i = 0; i < L.length; i++) { l += L[i] * L[i]; r += R[i] * R[i]; }
  return r > 0 && l > 0 ? db(l / r) : l > 0 ? Infinity : r > 0 ? -Infinity : 0;
}

/** Mono fold-down: (L+R)/2 in both channels. */
export function monoFold(L: Float32Array, R: Float32Array): Float32Array {
  const m = new Float32Array(L.length); for (let i = 0; i < L.length; i++) m[i] = (L[i] + R[i]) / 2; return m;
}

/**
 * How much quieter the mix gets when played in mono (both speakers get (L+R)/2), in LU by BS.1770 integrated loudness.
 * 0 for a mono-identical mix, about 3 for unrelated channels, Infinity when the mono sum is silent (one side inverted).
 */
export function monoLoss(L: Float32Array, R: Float32Array, rate: number): { stereo: number; mono: number; lossDb: number } {
  const st = integratedLufs([L, R], rate), m = monoFold(L, R), mo = integratedLufs([m, m], rate);
  return { stereo: st, mono: mo, lossDb: !isFinite(st) ? 0 : !isFinite(mo) ? Infinity : st - mo };
}

export const BANDS = [
  { id: 'low', name: 'Low (under 250 Hz)' },
  { id: 'mid', name: 'Mid (250 Hz to 4 kHz)' },
  { id: 'high', name: 'High (over 4 kHz)' },
] as const;
/** Correlation in three bands, split by second-order Butterworth filters at 250 Hz and 4 kHz. */
export function bandCorrelation(L: Float32Array, R: Float32Array, rate: number): { low: number; mid: number; high: number } {
  const lp = pass('low', 250, rate), hp = pass('high', 250, rate), lp4 = pass('low', 4000, rate), hp4 = pass('high', 4000, rate);
  const split = (x: Float32Array) => ({ low: runBiquad(x, lp), mid: runBiquad(runBiquad(x, hp), lp4), high: runBiquad(x, hp4) });
  const a = split(L), b = split(R);
  return { low: correlation(a.low, b.low), mid: correlation(a.mid, b.mid), high: correlation(a.high, b.high) };
}

/** Everything at once for a stereo file. */
export function analyse(L: Float32Array, R: Float32Array, rate: number, winMs = 100) {
  const track = correlationTrack(L, R, rate, winMs);
  return {
    overall: correlation(L, R), track, winMs, flagged: flagged(track, winMs),
    bands: bandCorrelation(L, R, rate), ms: midSide(L, R), balanceDb: balanceDb(L, R), mono: monoLoss(L, R, rate),
  };
}

/**
 * Averaged power spectrum (Hann window, 50% overlap) of the mono sum, in dB, read out at log-spaced frequencies
 * from 20 Hz to 20 kHz (or Nyquist). At most maxFrames frames, spread over the file.
 */
export function averageSpectrum(chans: Float32Array[], rate: number, opts: { n?: number; points?: number; maxFrames?: number } = {}): { f: number[]; db: number[] } {
  const N = opts.n ?? 4096, P = opts.points ?? 96, maxF = opts.maxFrames ?? 400, len = chans[0]?.length ?? 0;
  const win = new Float64Array(N); for (let i = 0; i < N; i++) win[i] = 0.5 - 0.5 * Math.cos((2 * Math.PI * i) / N);
  const frames = Math.max(0, Math.floor((len - N) / (N / 2)) + 1), step = frames > maxF ? frames / maxF : 1;
  const pw = new Float64Array(N / 2 + 1); let used = 0;
  const re = new Float64Array(N), im = new Float64Array(N);
  for (let f = 0; f < frames; f += step) {
    const s = Math.floor(f) * (N / 2);
    for (let i = 0; i < N; i++) { let v = 0; for (const c of chans) v += c[s + i]; re[i] = (v / chans.length) * win[i]; im[i] = 0; }
    fft(re, im);
    for (let k = 0; k <= N / 2; k++) pw[k] += re[k] * re[k] + im[k] * im[k];
    used++;
  }
  const top = Math.min(20000, rate / 2 * 0.98), fs: number[] = [], out: number[] = [];
  // Hann window coherent gain is 0.5, so a full-scale sine reads about 0 dB.
  const scale = used ? 1 / (used * (N * 0.25) ** 2) : 0;
  for (let p = 0; p < P; p++) {
    const fc = 20 * Math.pow(top / 20, p / (P - 1)), lo = fc / Math.pow(2, 1 / 12), hi = fc * Math.pow(2, 1 / 12);
    let a = Math.max(1, Math.floor((lo * N) / rate)), b = Math.min(N / 2, Math.ceil((hi * N) / rate)), sum = 0;
    if (b < a) b = a;
    for (let k = a; k <= b; k++) sum += pw[k];
    sum /= b - a + 1;
    fs.push(fc); out.push(sum > 0 ? 10 * Math.log10(sum * scale) : -120);
  }
  return { f: fs, db: out };
}

/** Crest factor: sample peak over RMS, in dB (all channels together). */
export function crestDb(chans: Float32Array[]): number {
  let p = 0, s = 0, n = 0;
  for (const c of chans) for (let i = 0; i < c.length; i++) { const a = Math.abs(c[i]); if (a > p) p = a; s += c[i] * c[i]; n++; }
  return s > 0 ? 20 * Math.log10(p / Math.sqrt(s / n)) : 0;
}
