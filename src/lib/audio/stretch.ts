// Change the speed of a sound with or without changing its pitch, and change the pitch without changing the length.
// Time-stretching is WSOLA (Verhelst and Roelands 1993): overlap-add 40 ms windows taken from the input at a different
// hop than they are written, each nudged by up to ±10 ms to line up with the last one so the waves join smoothly.
// Plain TypeScript, no DOM; checks in tests/audio.mjs.
import { resample, type Sound } from './pcm.ts';

/**
 * Stretch every channel by `factor` (2 = twice as long, half speed; 0.5 = half as long) keeping the pitch.
 * One set of window positions is chosen from the mix of all channels, so stereo stays in step.
 */
export function stretchChans(chans: Float32Array[], rate: number, factor: number): Float32Array[] {
  const len = chans[0]?.length ?? 0;
  if (!len || Math.abs(factor - 1) < 1e-6) return chans.map((c) => c.slice());
  const N = 2 * Math.round(rate * 0.02), Hs = N / 2, Ha = Hs / factor, tol = Math.round(rate * 0.01);
  const outLen = Math.max(1, Math.round(len * factor));
  // Mono guide for matching, a periodic Hann window (sums to 1 at 50% overlap).
  const mono = new Float32Array(len);
  for (const c of chans) for (let i = 0; i < len; i++) mono[i] += c[i] / chans.length;
  const win = new Float32Array(N).map((_, i) => 0.5 - 0.5 * Math.cos((2 * Math.PI * i) / N));
  const outs = chans.map(() => new Float32Array(outLen + N));
  const at = (i: number) => (i >= 0 && i < len ? mono[i] : 0);
  // Similarity of the input at a and b over the first half window, every `step` samples.
  const corr = (a: number, b: number, step: number) => { let s = 0; for (let i = 0; i < Hs; i += step) s += at(a + i) * at(b + i); return s; };
  let prev = 0; // where the last window was taken from
  const frames = Math.ceil(outLen / Hs) + 1;
  for (let k = 0; k < frames; k++) {
    const nominal = Math.round(k * Ha);
    let pos = nominal;
    if (k > 0) {
      // The natural next piece after the last window, and the nearby start that matches it best.
      const want = prev + Hs, lo = Math.max(-nominal, -tol), hi = tol;
      let best = 0, bestV = -Infinity;
      for (let d = lo; d <= hi; d += 4) { const v = corr(nominal + d, want, 4); if (v > bestV) { bestV = v; best = d; } }
      const c0 = best; bestV = -Infinity;
      for (let d = Math.max(lo, c0 - 3); d <= Math.min(hi, c0 + 3); d++) { const v = corr(nominal + d, want, 2); if (v > bestV) { bestV = v; best = d; } }
      pos = nominal + best;
    }
    const o = k * Hs;
    for (let ch = 0; ch < chans.length; ch++) {
      const src = chans[ch], dst = outs[ch];
      for (let i = 0; i < N; i++) { const j = pos + i; if (j >= 0 && j < len && o + i < dst.length) dst[o + i] += src[j] * (k === 0 && i < Hs ? 1 : win[i]); }
    }
    prev = pos;
  }
  return outs.map((d) => d.subarray(0, outLen).slice());
}

export type SpeedMode = 'keep-pitch' | 'tape';

/** Play `speed` times as fast (2 = twice as fast). 'keep-pitch' keeps voices natural; 'tape' changes pitch too, like a record. */
export function changeSpeed(s: Sound, speed: number, mode: SpeedMode = 'keep-pitch'): Sound {
  if (Math.abs(speed - 1) < 1e-6) return { rate: s.rate, chans: s.chans.map((c) => c.slice()) };
  if (mode === 'tape') return { rate: s.rate, chans: s.chans.map((c) => resample(c, s.rate * speed, s.rate)) };
  return { rate: s.rate, chans: stretchChans(s.chans, s.rate, 1 / speed) };
}

/** Raise or lower the pitch by `semitones` (12 = one octave up) and keep the length. `cents` fine-tunes (100 = 1 semitone). */
export function shiftPitch(s: Sound, semitones: number, cents = 0): Sound {
  const p = Math.pow(2, (semitones + cents / 100) / 12);
  if (Math.abs(p - 1) < 1e-6) return { rate: s.rate, chans: s.chans.map((c) => c.slice()) };
  const len = s.chans[0].length;
  const long = stretchChans(s.chans, s.rate, p);
  return { rate: s.rate, chans: long.map((c) => { const r = resample(c, s.rate * p, s.rate); return r.length === len ? r : fit(r, len); }) };
}

const fit = (x: Float32Array, n: number) => { const o = new Float32Array(n); o.set(x.subarray(0, n)); return o; };

/** Ratio for a key change, and the semitones for a ratio. */
export const semitoneRatio = (st: number) => Math.pow(2, st / 12);
export const ratioSemitones = (r: number) => 12 * Math.log2(r);
