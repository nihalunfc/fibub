// Pitch shifting that keeps the length, with a shift that can change over time: time-domain PSOLA (pitch-synchronous
// overlap-add; Moulines and Charpentier 1990, "Pitch-synchronous waveform processing techniques for text-to-speech
// synthesis using diphones", Speech Communication 9). Works on one voice or instrument at a time.
//   1. A pitch track (YIN every 10 ms, src/lib/audio/pitch.ts) gives the period of each voiced part.
//   2. Analysis marks are laid one period apart through voiced parts (by adding up the period, starting on the
//      loudest peak of the first period) and every 5 ms through unvoiced parts.
//   3. Output marks are laid one period / ratio apart; at each, the two-period Hann-windowed grain around the nearest
//      analysis mark is added. Dividing by the summed windows keeps the level. Unvoiced parts are not shifted.
// Plain TypeScript, no DOM. Checks in tests/audio-psola.mjs.
import { yin } from './pitch.ts';

export type PitchTrack = { hop: number; f0: Float32Array; clarity: Float32Array }; // hop in s; f0 in Hz, 0 = unvoiced

/**
 * YIN pitch every `hop` seconds (frame centred on i * hop). Frames quieter than -50 dBFS RMS, or with an unclear
 * pitch, are unvoiced (0). Single-frame octave jumps and single unvoiced gaps between voiced frames are smoothed.
 */
export function pitchTrack(x: Float32Array, rate: number, hop = 0.01, minHz = 60, maxHz = 1100, onProgress?: (f: number) => void): PitchTrack {
  const W = 2 * Math.ceil(rate / minHz) + Math.round(0.01 * rate), n = Math.max(1, Math.ceil(x.length / (hop * rate))), f0 = new Float32Array(n), cl = new Float32Array(n);
  const buf = new Float32Array(W);
  for (let i = 0; i < n; i++) {
    const c = Math.round(i * hop * rate), a = c - (W >> 1);
    let e = 0;
    for (let k = 0; k < W; k++) { const j = a + k, v = j >= 0 && j < x.length ? x[j] : 0; buf[k] = v; e += v * v; }
    if (e / W < 1e-5) continue;
    const r = yin(buf, rate, minHz, maxHz, 0.15);
    if (r.hz > 0) { f0[i] = r.hz; cl[i] = r.clarity; }
    if (onProgress && (i & 255) === 0) onProgress(i / n);
  }
  // Octave slips: a frame about an octave off both neighbours, which agree, takes their pitch.
  for (let i = 1; i + 1 < n; i++) {
    const p = f0[i - 1], q = f0[i + 1], v = f0[i];
    if (p && q && Math.abs(Math.log2(p / q)) < 0.1) {
      if (!v || Math.abs(Math.abs(Math.log2(v / p)) - 1) < 0.1) f0[i] = (p + q) / 2;
    }
  }
  return { hop, f0, clarity: cl };
}

/** f0 (Hz, 0 = unvoiced) at time t (s), linear between voiced frames, 0 where either neighbour is unvoiced. */
export function f0At(tr: PitchTrack, t: number): number {
  const p = t / tr.hop, i = Math.floor(p), f = p - i;
  if (i < 0 || i >= tr.f0.length) return 0;
  const a = tr.f0[i], b = i + 1 < tr.f0.length ? tr.f0[i + 1] : a;
  if (!a || !b) return f < 0.5 ? a : b;
  return a + (b - a) * f;
}

export type Marks = { pos: Int32Array; per: Float32Array; voiced: Uint8Array };

/** Analysis marks for a sound of `len` samples: one period apart where voiced, every 5 ms where not. */
export function pitchMarks(x: Float32Array, rate: number, tr: PitchTrack): Marks {
  const pos: number[] = [], per: number[] = [], voiced: number[] = [], U = Math.round(0.005 * rate);
  let t = 0, wasVoiced = false;
  while (t < x.length) {
    const hz = f0At(tr, t / rate);
    if (hz > 0) {
      const P = rate / hz;
      if (!wasVoiced) {
        // Start the run on the largest peak of its first period, so grains centre on the pulses.
        let best = Math.round(t), bv = -1;
        for (let k = Math.round(t); k < Math.min(x.length, t + P); k++) { const v = Math.abs(x[k]); if (v > bv) { bv = v; best = k; } }
        t = best;
      }
      pos.push(Math.round(t)); per.push(P); voiced.push(1); wasVoiced = true; t += P;
    } else {
      pos.push(Math.round(t)); per.push(U); voiced.push(0); wasVoiced = false; t += U;
    }
  }
  return { pos: Int32Array.from(pos), per: Float32Array.from(per), voiced: Uint8Array.from(voiced) };
}

/**
 * Shift the pitch of x by ratio(t) (t in s; 2 = an octave up) wherever it is voiced, keeping its length.
 * Give the same marks to every channel of a stereo sound so they stay in step.
 */
export function psola(x: Float32Array, rate: number, m: Marks, ratio: (t: number) => number): Float32Array {
  const n = x.length, out = new Float32Array(n), wsum = new Float32Array(n), K = m.pos.length;
  if (!K) return x.slice();
  const grain = (c: number, at: number, P: number) => {
    const L = Math.max(2, Math.round(P)), o = Math.round(at);
    for (let j = -L + 1; j < L; j++) {
      const d = o + j; if (d < 0 || d >= n) continue;
      const w = 0.5 + 0.5 * Math.cos((Math.PI * j) / L), s = c + j;
      out[d] += (s >= 0 && s < n ? x[s] : 0) * w; wsum[d] += w;
    }
  };
  // Unvoiced marks are copied in place; each voiced run starts on its first mark and is laid out at period / ratio.
  let k = 0;
  while (k < K) {
    if (!m.voiced[k]) { grain(m.pos[k], m.pos[k], m.per[k]); k++; continue; }
    let e = k; while (e < K && m.voiced[e]) e++;
    const end = e < K ? m.pos[e] : n;
    let ts = m.pos[k], q = k;
    while (ts < end) {
      while (q + 1 < e && Math.abs(m.pos[q + 1] - ts) <= Math.abs(m.pos[q] - ts)) q++;
      const beta = Math.max(0.25, Math.min(4, ratio(ts / rate)));
      grain(m.pos[q], ts, m.per[q]);
      ts += m.per[q] / beta;
    }
    k = e;
  }
  for (let i = 0; i < n; i++) out[i] = wsum[i] > 0.05 ? out[i] / Math.max(wsum[i], 0.5) : x[i];
  return out;
}

/** Shift the whole of x by `cents` (keeps the length). For checks and simple uses. */
export function shiftCents(x: Float32Array, rate: number, cents: number, tr = pitchTrack(x, rate)): Float32Array {
  const r = Math.pow(2, cents / 1200);
  return psola(x, rate, pitchMarks(x, rate, tr), () => r);
}
