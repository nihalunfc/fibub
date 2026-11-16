// Sound files without the DOM: WAV reading and writing (PCM, float, mu-law, A-law), raw phone formats, mixing to mono,
// peak normalising and a band-limited resampler. Plain TypeScript; checked in tests/audio.mjs.
import { encodeG711, decodeG711, toInt16 } from './g711.ts';

export type Sound = { rate: number; chans: Float32Array[] };
/** Output formats for phone systems. */
export type PhoneFormat = 'ulaw' | 'alaw' | 'sln' | 'wav-ulaw' | 'wav-alaw' | 'wav-pcm';

export const PHONE_FORMATS: Record<PhoneFormat, { ext: string; label: string; mime: string }> = {
  ulaw: { ext: 'ulaw', label: 'Raw u-law .ulaw (Asterisk, FreePBX)', mime: 'audio/basic' },
  alaw: { ext: 'alaw', label: 'Raw A-law .alaw (Asterisk outside North America)', mime: 'application/octet-stream' },
  sln: { ext: 'sln', label: 'Raw 16-bit .sln (Asterisk)', mime: 'application/octet-stream' },
  'wav-ulaw': { ext: 'wav', label: 'u-law WAV, 8-bit (3CX, Cisco, Avaya)', mime: 'audio/wav' },
  'wav-alaw': { ext: 'wav', label: 'A-law WAV, 8-bit', mime: 'audio/wav' },
  'wav-pcm': { ext: 'wav', label: '16-bit WAV, 8 kHz mono (most PBX uploads)', mime: 'audio/wav' },
};

const tag = (v: DataView, o: number) => String.fromCharCode(v.getUint8(o), v.getUint8(o + 1), v.getUint8(o + 2), v.getUint8(o + 3));

/** A WAV file. format: 1 PCM 16-bit, 6 A-law, 7 mu-law (both 8-bit). */
export function writeWav(chans: Float32Array[], rate: number, format: 1 | 6 | 7 = 1): Uint8Array {
  const nc = chans.length, len = chans[0]?.length ?? 0, bps = format === 1 ? 2 : 1, data = len * nc * bps;
  const extra = format === 1 ? 0 : 2 + 12; // cbSize, then a fact chunk (required for non-PCM)
  const head = 44 + extra, pad = data & 1, b = new ArrayBuffer(head + data + pad), v = new DataView(b), u8 = new Uint8Array(b);
  const str = (o: number, s: string) => { for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i)); };
  str(0, 'RIFF'); v.setUint32(4, head - 8 + data + pad, true); str(8, 'WAVE');
  str(12, 'fmt '); v.setUint32(16, format === 1 ? 16 : 18, true); v.setUint16(20, format, true); v.setUint16(22, nc, true);
  v.setUint32(24, rate, true); v.setUint32(28, rate * nc * bps, true); v.setUint16(32, nc * bps, true); v.setUint16(34, bps * 8, true);
  let o = 36;
  if (format !== 1) { v.setUint16(o, 0, true); o += 2; str(o, 'fact'); v.setUint32(o + 4, 4, true); v.setUint32(o + 8, len, true); o += 12; }
  str(o, 'data'); v.setUint32(o + 4, data, true); o += 8;
  if (format === 1) {
    for (let i = 0; i < len; i++) for (let c = 0; c < nc; c++) { v.setInt16(o, toInt16(chans[c][i]), true); o += 2; }
  } else {
    const law = format === 7 ? 'ulaw' : 'alaw';
    const enc = chans.map((c) => encodeG711(c, law));
    for (let i = 0; i < len; i++) for (let c = 0; c < nc; c++) u8[o++] = enc[c][i];
  }
  return u8;
}

export type WavInfo = { format: number; rate: number; channels: number; bits: number; dataOffset: number; dataBytes: number };

/** The fmt and data chunks of a WAV file, or null if this is not one. */
export function wavInfo(buf: ArrayBuffer): WavInfo | null {
  const v = new DataView(buf);
  if (buf.byteLength < 12 || tag(v, 0) !== 'RIFF' || tag(v, 8) !== 'WAVE') return null;
  let fmt: Omit<WavInfo, 'dataOffset' | 'dataBytes'> | null = null;
  for (let p = 12; p + 8 <= buf.byteLength;) {
    const id = tag(v, p), size = v.getUint32(p + 4, true);
    if (id === 'fmt ' && p + 24 <= buf.byteLength) {
      let format = v.getUint16(p + 8, true);
      if (format === 0xfffe && size >= 40 && p + 34 <= buf.byteLength) format = v.getUint16(p + 32, true); // WAVE_FORMAT_EXTENSIBLE: sub-format
      fmt = { format, channels: v.getUint16(p + 10, true), rate: v.getUint32(p + 12, true), bits: v.getUint16(p + 22, true) };
    } else if (id === 'data' && fmt) {
      return { ...fmt, dataOffset: p + 8, dataBytes: Math.min(size, buf.byteLength - p - 8) };
    }
    p += 8 + size + (size & 1);
  }
  return null;
}

/** Read a WAV file this code understands: PCM 8/16/24/32-bit, float 32/64-bit, mu-law and A-law. Null otherwise. */
export function readWav(buf: ArrayBuffer): Sound | null {
  const w = wavInfo(buf);
  if (!w || !w.channels || !w.rate) return null;
  const { format, bits, channels: nc } = w, bps = bits / 8;
  if (!((format === 1 && [8, 16, 24, 32].includes(bits)) || (format === 3 && (bits === 32 || bits === 64)) || ((format === 6 || format === 7) && bits === 8))) return null;
  const n = Math.floor(w.dataBytes / (bps * nc)), v = new DataView(buf, w.dataOffset), chans = Array.from({ length: nc }, () => new Float32Array(n));
  if (format === 6 || format === 7) {
    const bytes = new Uint8Array(buf, w.dataOffset, n * nc), d = decodeG711(bytes, format === 7 ? 'ulaw' : 'alaw');
    for (let i = 0; i < n; i++) for (let c = 0; c < nc; c++) chans[c][i] = d[i * nc + c];
    return { rate: w.rate, chans };
  }
  for (let i = 0, o = 0; i < n; i++) for (let c = 0; c < nc; c++, o += bps) {
    let x: number;
    if (format === 3) x = bits === 32 ? v.getFloat32(o, true) : v.getFloat64(o, true);
    else if (bits === 8) x = (v.getUint8(o) - 128) / 128;
    else if (bits === 16) x = v.getInt16(o, true) / 32768;
    else if (bits === 24) x = ((v.getUint8(o) | (v.getUint8(o + 1) << 8) | (v.getInt8(o + 2) << 16))) / 8388608;
    else x = v.getInt32(o, true) / 2147483648;
    chans[c][i] = x;
  }
  return { rate: w.rate, chans };
}

/** Raw headerless phone audio (.ulaw, .alaw, .sln) to samples. */
export function readRaw(bytes: Uint8Array, kind: 'ulaw' | 'alaw' | 'sln'): Float32Array {
  if (kind !== 'sln') return decodeG711(bytes, kind);
  const n = bytes.length >> 1, v = new DataView(bytes.buffer, bytes.byteOffset, n * 2), out = new Float32Array(n);
  for (let i = 0; i < n; i++) out[i] = v.getInt16(i * 2, true) / 32768;
  return out;
}

/** Mix channels to one (the average). */
export function toMono(chans: Float32Array[]): Float32Array {
  if (chans.length === 1) return chans[0];
  const n = chans[0].length, out = new Float32Array(n), k = 1 / chans.length;
  for (const c of chans) for (let i = 0; i < n; i++) out[i] += c[i] * k;
  return out;
}

export const peakOf = (x: Float32Array) => { let p = 0; for (let i = 0; i < x.length; i++) { const a = Math.abs(x[i]); if (a > p) p = a; } return p; };

/** Scale so the loudest sample is at `dbfs` (e.g. -3). Silence is left alone. Returns the gain used. */
export function normalise(x: Float32Array, dbfs: number): number {
  const p = peakOf(x); if (!p) return 1;
  const g = Math.pow(10, dbfs / 20) / p; for (let i = 0; i < x.length; i++) x[i] *= g; return g;
}

/** Multiply by a gain in dB, clipping at full scale. */
export function gainDb(x: Float32Array, db: number): void {
  const g = Math.pow(10, db / 20); for (let i = 0; i < x.length; i++) x[i] = Math.max(-1, Math.min(1, x[i] * g));
}

/**
 * Resample with a Kaiser-windowed sinc low-pass, so nothing above the new Nyquist frequency folds back
 * as a whistle (needed when 44.1 kHz music becomes 8 kHz phone audio). cutoff: fraction of the lower Nyquist kept.
 */
export function resample(x: Float32Array, from: number, to: number, cutoff = 0.92): Float32Array {
  if (from === to) return x.slice();
  const ratio = to / from, n = Math.max(1, Math.round(x.length * ratio)), out = new Float32Array(n);
  const fc = cutoff * Math.min(1, ratio), zc = 16, half = Math.ceil(zc / fc), beta = 8.6;
  const i0 = (v: number) => { let s = 1, t = 1; for (let k = 1; k < 25; k++) { t *= (v / (2 * k)) ** 2; s += t; } return s; };
  const ib = i0(beta);
  // Table of the kernel at 512 steps per input sample, linearly interpolated.
  const STEPS = 512, tab = new Float32Array(half * STEPS + 2);
  for (let i = 0; i < tab.length; i++) {
    const t = i / STEPS, r = t / half, w = r >= 1 ? 0 : i0(beta * Math.sqrt(1 - r * r)) / ib, a = Math.PI * fc * t;
    tab[i] = fc * (t === 0 ? 1 : Math.sin(a) / a) * w;
  }
  const len = x.length;
  for (let j = 0; j < n; j++) {
    const c = j / ratio, k0 = Math.ceil(c - half), k1 = Math.floor(c + half);
    let s = 0;
    for (let k = k0 < 0 ? 0 : k0; k <= k1 && k < len; k++) {
      const d = Math.abs(c - k) * STEPS, di = d | 0, f = d - di;
      s += x[k] * (tab[di] + (tab[di + 1] - tab[di]) * f);
    }
    out[j] = s;
  }
  return out;
}

/** 8 kHz mono phone audio, ready to save in any PhoneFormat. */
export function toPhone(s: Sound, opts: { normaliseDb?: number | null; gain?: number } = {}): Float32Array {
  const mono = toMono(s.chans), out = resample(mono, s.rate, 8000, 3600 / 4000);
  if (opts.normaliseDb != null) normalise(out, opts.normaliseDb);
  if (opts.gain) gainDb(out, opts.gain);
  for (let i = 0; i < out.length; i++) out[i] = Math.max(-1, Math.min(1, out[i]));
  return out;
}

/** The bytes of one PhoneFormat file from 8 kHz mono samples. */
export function phoneFile(x: Float32Array, f: PhoneFormat): Uint8Array {
  if (f === 'ulaw' || f === 'alaw') return encodeG711(x, f);
  if (f === 'sln') { const b = new Uint8Array(x.length * 2), v = new DataView(b.buffer); for (let i = 0; i < x.length; i++) v.setInt16(i * 2, toInt16(x[i]), true); return b; }
  return writeWav([x], 8000, f === 'wav-ulaw' ? 7 : f === 'wav-alaw' ? 6 : 1);
}

/** A Sun/NeXT .au file (u-law, A-law or 8/16-bit linear), or null. */
export function readAu(buf: ArrayBuffer): (Sound & { encoding: string }) | null {
  const v = new DataView(buf);
  if (buf.byteLength < 24 || v.getUint32(0) !== 0x2e736e64) return null; // ".snd"
  const off = v.getUint32(4), size = v.getUint32(8), enc = v.getUint32(12), rate = v.getUint32(16), nc = v.getUint32(20);
  if (!rate || !nc || nc > 16 || off > buf.byteLength) return null;
  const end = size === 0xffffffff ? buf.byteLength : Math.min(buf.byteLength, off + size), bytes = new Uint8Array(buf, off, end - off);
  let mono: Float32Array, name: string;
  if (enc === 1 || enc === 27) { mono = decodeG711(bytes, enc === 1 ? 'ulaw' : 'alaw'); name = enc === 1 ? 'u-law' : 'A-law'; }
  else if (enc === 2) { mono = new Float32Array(bytes.length).map((_, i) => ((bytes[i] << 24) >> 24) / 128); name = '8-bit linear'; }
  else if (enc === 3) { const n = bytes.length >> 1, d = new DataView(buf, off); mono = new Float32Array(n).map((_, i) => d.getInt16(i * 2) / 32768); name = '16-bit linear'; }
  else return null;
  const n = Math.floor(mono.length / nc), chans = Array.from({ length: nc }, (_, c) => new Float32Array(n).map((_, i) => mono[i * nc + c]));
  return { rate, chans, encoding: name };
}

/** How a raw phone file is probably coded, from its extension (Asterisk names: .ulaw/.ul/.mu/.pcm, .alaw/.al, .sln, .sln16 ...). */
export function guessRaw(name: string): { kind: 'ulaw' | 'alaw' | 'sln'; rate: number } | null {
  const ext = (name.match(/\.([a-z0-9]+)$/i)?.[1] ?? '').toLowerCase();
  if (['ulaw', 'ul', 'mu', 'u', 'pcm', 'g711u'].includes(ext)) return { kind: 'ulaw', rate: 8000 };
  if (['alaw', 'al', 'a', 'g711a'].includes(ext)) return { kind: 'alaw', rate: 8000 };
  const m = ext.match(/^(?:sln|slin|raw)(\d*)$/);
  if (m) { const k = +m[1] || 8; return { kind: 'sln', rate: k === 44 ? 44100 : k === 8 ? 8000 : k * 1000 }; }
  return null;
}
