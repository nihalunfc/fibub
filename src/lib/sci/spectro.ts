// Sound recordings: reading WAV files, the FFT, windows, short-time spectra (spectrograms) and measuring a
// selected stretch (peak frequency, bandwidth, note durations). Plain maths, no DOM. Matches
// scipy.signal.spectrogram(..., detrend=False, scaling='density', mode='psd') for the same window and overlap.

export type Wav = { fs: number; channels: Float32Array[]; bits: number; format: 'int' | 'float' };

/** Read a RIFF/WAVE file: 8, 16, 24 or 32-bit integer PCM, or 32/64-bit float. Throws with a plain message. */
export function parseWav(buf: Uint8Array): Wav {
  const dv = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
  const tag = (o: number) => String.fromCharCode(buf[o], buf[o + 1], buf[o + 2], buf[o + 3]);
  if (buf.length < 12 || tag(0) !== 'RIFF' || tag(8) !== 'WAVE') throw new Error('This is not a WAV file. Save or export the recording as WAV first (for example in Audacity: File, Export, WAV).');
  let o = 12, fmt: { code: number; ch: number; fs: number; bits: number; align: number } | null = null, data: [number, number] | null = null;
  while (o + 8 <= buf.length) {
    const id = tag(o); let size = dv.getUint32(o + 4, true);
    const start = o + 8;
    if (id === 'fmt ') {
      let code = dv.getUint16(start, true);
      const ch = dv.getUint16(start + 2, true), fs = dv.getUint32(start + 4, true), align = dv.getUint16(start + 12, true), bits = dv.getUint16(start + 14, true);
      if (code === 0xfffe && size >= 40) code = dv.getUint16(start + 24, true);
      fmt = { code, ch, fs, bits, align };
    } else if (id === 'data') {
      if (size === 0 || size === 0xffffffff || start + size > buf.length) size = buf.length - start;
      data = [start, size];
      if (fmt) break;
    }
    o = start + size + (size & 1);
  }
  if (!fmt) throw new Error('The WAV file has no format block, so it cannot be read.');
  if (!data) throw new Error('The WAV file has no sound data.');
  const { code, ch, fs, bits, align } = fmt;
  if (code !== 1 && code !== 3) throw new Error('This WAV file is compressed. Save it as plain (PCM) WAV, 16-bit or 32-bit float.');
  if (!ch || !fs || !align) throw new Error('The WAV file header is damaged.');
  const bps = bits / 8, n = Math.floor(data[1] / align);
  const channels = Array.from({ length: ch }, () => new Float32Array(n));
  for (let i = 0; i < n; i++) for (let c = 0; c < ch; c++) {
    const p = data[0] + i * align + c * bps;
    let v: number;
    if (code === 3) v = bits === 64 ? dv.getFloat64(p, true) : dv.getFloat32(p, true);
    else if (bits === 8) v = (buf[p] - 128) / 128;
    else if (bits === 16) v = dv.getInt16(p, true) / 32768;
    else if (bits === 24) { let x = buf[p] | (buf[p + 1] << 8) | (buf[p + 2] << 16); if (x & 0x800000) x -= 0x1000000; v = x / 8388608; }
    else if (bits === 32) v = dv.getInt32(p, true) / 2147483648;
    else throw new Error(`${bits}-bit WAV files are not supported. Use 16, 24 or 32-bit.`);
    channels[c][i] = v;
  }
  return { fs, channels, bits, format: code === 3 ? 'float' : 'int' };
}

/** The average of all channels. */
export function toMono(ch: Float32Array[]): Float32Array {
  if (ch.length === 1) return ch[0];
  const out = new Float32Array(ch[0].length);
  for (const c of ch) for (let i = 0; i < out.length; i++) out[i] += c[i] / ch.length;
  return out;
}

/** A 16-bit mono WAV file (used by the tests and for saving sounds). */
export function encodeWav16(x: ArrayLike<number>, fs: number): Uint8Array {
  const n = x.length, buf = new Uint8Array(44 + n * 2), dv = new DataView(buf.buffer);
  const w = (o: number, s: string) => { for (let i = 0; i < 4; i++) buf[o + i] = s.charCodeAt(i); };
  w(0, 'RIFF'); dv.setUint32(4, 36 + n * 2, true); w(8, 'WAVE'); w(12, 'fmt '); dv.setUint32(16, 16, true);
  dv.setUint16(20, 1, true); dv.setUint16(22, 1, true); dv.setUint32(24, fs, true); dv.setUint32(28, fs * 2, true); dv.setUint16(32, 2, true); dv.setUint16(34, 16, true);
  w(36, 'data'); dv.setUint32(40, n * 2, true);
  for (let i = 0; i < n; i++) dv.setInt16(44 + i * 2, Math.max(-32768, Math.min(32767, Math.round(x[i] * 32767))), true);
  return buf;
}

// ---------- FFT ----------
const twCache = new Map<number, { cos: Float64Array; sin: Float64Array; rev: Uint32Array }>();
function tables(n: number) {
  let t = twCache.get(n);
  if (!t) {
    const cos = new Float64Array(n / 2), sin = new Float64Array(n / 2), rev = new Uint32Array(n);
    for (let i = 0; i < n / 2; i++) { cos[i] = Math.cos((2 * Math.PI * i) / n); sin[i] = Math.sin((2 * Math.PI * i) / n); }
    const bitsN = Math.log2(n);
    for (let i = 0; i < n; i++) { let r = 0; for (let b = 0; b < bitsN; b++) r |= ((i >> b) & 1) << (bitsN - 1 - b); rev[i] = r; }
    t = { cos, sin, rev }; twCache.set(n, t);
  }
  return t;
}
export const isPow2 = (n: number) => n >= 2 && (n & (n - 1)) === 0;
/** In-place complex FFT (radix 2, forward, e^(−i…)); n must be a power of two. */
export function fft(re: Float64Array, im: Float64Array) {
  const n = re.length;
  if (!isPow2(n)) throw new Error('FFT size must be a power of two.');
  const { cos, sin, rev } = tables(n);
  for (let i = 0; i < n; i++) { const j = rev[i]; if (j > i) { let t = re[i]; re[i] = re[j]; re[j] = t; t = im[i]; im[i] = im[j]; im[j] = t; } }
  for (let size = 2; size <= n; size <<= 1) {
    const half = size >> 1, step = n / size;
    for (let s = 0; s < n; s += size) for (let k = 0; k < half; k++) {
      const c = cos[k * step], si = sin[k * step], a = s + k, b = a + half;
      const tr = re[b] * c + im[b] * si, ti = im[b] * c - re[b] * si;
      re[b] = re[a] - tr; im[b] = im[a] - ti; re[a] += tr; im[a] += ti;
    }
  }
}

export type WindowName = 'hann' | 'hamming' | 'blackman' | 'rect';
/** A periodic ("DFT-even") window of length n, as scipy.signal.get_window gives for spectra. */
export function makeWindow(name: WindowName, n: number): Float64Array {
  const w = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    const a = (2 * Math.PI * i) / n;
    w[i] = name === 'hann' ? 0.5 - 0.5 * Math.cos(a) : name === 'hamming' ? 0.54 - 0.46 * Math.cos(a) : name === 'blackman' ? 0.42 - 0.5 * Math.cos(a) + 0.08 * Math.cos(2 * a) : 1;
  }
  return w;
}

/**
 * One-sided power spectral density of one windowed segment (units²/Hz), added into `acc` (length n/2 + 1).
 * detrend: subtract the segment mean first (scipy's detrend='constant').
 */
export function segmentPsd(x: ArrayLike<number>, start: number, w: Float64Array, fs: number, acc: Float64Array, detrend = false, re = new Float64Array(w.length), im = new Float64Array(w.length)) {
  const n = w.length; let mean = 0, s2 = 0;
  if (detrend) { for (let i = 0; i < n; i++) mean += x[start + i]; mean /= n; }
  for (let i = 0; i < n; i++) { re[i] = (x[start + i] - mean) * w[i]; im[i] = 0; s2 += w[i] * w[i]; }
  fft(re, im);
  const scale = 1 / (fs * s2), half = n / 2;
  for (let k = 0; k <= half; k++) acc[k] += (re[k] * re[k] + im[k] * im[k]) * scale * (k === 0 || k === half ? 1 : 2);
}

export type Spectrogram = { f: Float64Array; t: Float64Array; psd: Float32Array; bins: number; frames: number; hop: number; fs: number; nfft: number };
/**
 * Short-time power spectra: frames of nfft samples, hop = nfft − overlap, frame k centred at (k·hop + nfft/2)/fs + t0.
 * psd[k·bins + j] is the density at f[j] in frame k.
 */
export function spectrogram(x: ArrayLike<number>, fs: number, nfft: number, overlap: number, win: WindowName = 'hann', t0 = 0): Spectrogram {
  const hop = nfft - overlap;
  if (!(hop >= 1)) throw new Error('The overlap must be smaller than the FFT size.');
  const frames = x.length >= nfft ? Math.floor((x.length - nfft) / hop) + 1 : 0, bins = nfft / 2 + 1;
  const w = makeWindow(win, nfft), psd = new Float32Array(frames * bins), acc = new Float64Array(bins), re = new Float64Array(nfft), im = new Float64Array(nfft);
  for (let k = 0; k < frames; k++) { acc.fill(0); segmentPsd(x, k * hop, w, fs, acc, false, re, im); psd.set(acc, k * bins); }
  const f = new Float64Array(bins).map((_, j) => (j * fs) / nfft), t = new Float64Array(frames).map((_, k) => t0 + (k * hop + nfft / 2) / fs);
  return { f, t, psd, bins, frames, hop, fs, nfft };
}

export const db = (p: number) => 10 * Math.log10(Math.max(p, 1e-30));

export type Note = { start: number; end: number; dur: number; peakHz: number; startHz: number; endHz: number; levelDb: number };
export type Selection = {
  frames: number; peakHz: number; peakDb: number; bwLow: number; bwHigh: number; bandwidth: number;
  spectrum: { f: number[]; db: number[] }; notes: Note[]; thresholdDb: number; envelope: { t: number[]; db: number[] };
};
/**
 * Measures a time and frequency box of a spectrogram.
 * - Peak frequency: the highest bin of the mean spectrum, refined by a parabola through the dB values of it and its neighbours.
 * - Bandwidth: where the mean spectrum first falls bwDb below the peak on each side (linear in dB between bins).
 * - Notes: frames whose power in the box is within noteDb of the loudest frame, joined into runs; runs closer than
 *   minGap seconds are merged, then runs shorter than minNote seconds dropped. A run of m frames lasts m·hop/fs.
 */
export function analyseSelection(S: Spectrogram, t0: number, t1: number, f0: number, f1: number, o: { bwDb?: number; noteDb?: number; minNote?: number; minGap?: number } = {}): Selection | null {
  const bwDb = o.bwDb ?? 10, noteDb = o.noteDb ?? 20, minNote = o.minNote ?? 0, minGap = o.minGap ?? 0;
  const ks: number[] = [], js: number[] = [];
  for (let k = 0; k < S.frames; k++) if (S.t[k] >= t0 && S.t[k] <= t1) ks.push(k);
  for (let j = 0; j < S.bins; j++) if (S.f[j] >= f0 && S.f[j] <= f1) js.push(j);
  if (!ks.length || js.length < 3) return null;
  const mean = js.map((j) => { let s = 0; for (const k of ks) s += S.psd[k * S.bins + j]; return s / ks.length; });
  const mdb = mean.map(db);
  let pi = 0; for (let i = 1; i < mdb.length; i++) if (mdb[i] > mdb[pi]) pi = i;
  const df = S.fs / S.nfft;
  let peakHz = S.f[js[pi]], peakDb = mdb[pi];
  if (pi > 0 && pi < mdb.length - 1) {
    const a = mdb[pi - 1], b = mdb[pi], c = mdb[pi + 1], den = a - 2 * b + c;
    if (den < 0) { const d = (0.5 * (a - c)) / den; peakHz += d * df; peakDb = b - 0.25 * (a - c) * d; }
  }
  const lvl = mdb[pi] - bwDb;
  let lo = 0, hi = mdb.length - 1;
  for (let i = pi; i > 0; i--) if (mdb[i - 1] < lvl) { lo = i - 1 + (lvl - mdb[i - 1]) / (mdb[i] - mdb[i - 1]); break; }
  for (let i = pi; i < mdb.length - 1; i++) if (mdb[i + 1] < lvl) { hi = i + (mdb[i] - lvl) / (mdb[i] - mdb[i + 1]); break; }
  const fAt = (i: number) => S.f[js[0]] + i * df;
  // Band power envelope (power = Σ PSD · df) and notes.
  const env = ks.map((k) => { let s = 0; for (const j of js) s += S.psd[k * S.bins + j]; return db(s * df); });
  const thr = Math.max(...env) - noteDb, dt = S.hop / S.fs;
  let runs: [number, number][] = [];
  for (let i = 0; i < ks.length; i++) if (env[i] >= thr) { if (runs.length && runs[runs.length - 1][1] === i - 1) runs[runs.length - 1][1] = i; else runs.push([i, i]); }
  const merged: [number, number][] = [];
  for (const r of runs) { const last = merged[merged.length - 1]; if (last && (r[0] - last[1] - 1) * dt < minGap - 1e-12) last[1] = r[1]; else merged.push([...r]); }
  runs = merged.filter((r) => (r[1] - r[0] + 1) * dt >= minNote - 1e-12);
  const framePeak = (k: number) => { let bj = js[0]; for (const j of js) if (S.psd[k * S.bins + j] > S.psd[k * S.bins + bj]) bj = j; return S.f[bj]; };
  const notes: Note[] = runs.map(([a, b]) => {
    const kk = ks.slice(a, b + 1);
    let bj = 0, best = -1; js.forEach((j, n) => { let s = 0; for (const k of kk) s += S.psd[k * S.bins + j]; if (s > best) { best = s; bj = n; } });
    const start = S.t[ks[a]] - dt / 2, end = S.t[ks[b]] + dt / 2;
    return { start, end, dur: end - start, peakHz: S.f[js[bj]], startHz: framePeak(ks[a]), endHz: framePeak(ks[b]), levelDb: Math.max(...env.slice(a, b + 1)) };
  });
  return {
    frames: ks.length, peakHz, peakDb, bwLow: fAt(lo), bwHigh: fAt(hi), bandwidth: (hi - lo) * df,
    spectrum: { f: js.map((j) => S.f[j]), db: mdb }, notes, thresholdDb: thr, envelope: { t: ks.map((k) => S.t[k]), db: env },
  };
}

/** A small seeded random number generator (mulberry32), so examples come out the same every time. */
export function rng(seed: number) {
  let a = seed >>> 0;
  return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
export function gauss(r: () => number) { let u = 0; while (u === 0) u = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * r()); }

/**
 * The made-up example "song": 4 falling whistles (0.15 s, 5 → 3 kHz, with a faint second harmonic) 0.1 s apart,
 * then a trill of 6 notes at 4 kHz (0.04 s on, 0.03 s off), over quiet noise and a low 200 Hz hum. 2 s at fs.
 */
export function exampleSong(fs = 22050, seed = 7): { x: Float32Array; notes: { start: number; dur: number }[] } {
  const n = Math.round(2 * fs), x = new Float32Array(n), r = rng(seed), notes: { start: number; dur: number }[] = [];
  const tone = (start: number, dur: number, fA: number, fB: number, amp: number) => {
    notes.push({ start, dur });
    let ph = 0; const i0 = Math.round(start * fs), m = Math.round(dur * fs), edge = 0.005 * fs;
    for (let i = 0; i < m && i0 + i < n; i++) {
      const f = fA + ((fB - fA) * i) / m; ph += (2 * Math.PI * f) / fs;
      const env = Math.min(1, i / edge, (m - 1 - i) / edge);
      x[i0 + i] += amp * env * (Math.sin(ph) + 0.1 * Math.sin(2 * ph));
    }
  };
  for (let k = 0; k < 4; k++) tone(0.2 + k * 0.25, 0.15, 5000, 3000, 0.5);
  for (let k = 0; k < 6; k++) tone(1.3 + k * 0.07, 0.04, 4000, 4000, 0.4);
  for (let i = 0; i < n; i++) x[i] += 0.003 * gauss(r) + 0.02 * Math.sin((2 * Math.PI * 200 * i) / fs);
  return { x, notes };
}
