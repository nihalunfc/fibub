// Sound files for the phonetics tools: read a WAV file into numbers, mix it to one channel, and change its
// sample rate with a windowed-sinc filter. Plain TypeScript, no DOM, so it runs in tests as well.

export type Sound = { fs: number; x: Float64Array; channels: number; bits: number; format: string; seconds: number };

const str = (v: DataView, at: number, n: number) => { let s = ''; for (let i = 0; i < n; i++) s += String.fromCharCode(v.getUint8(at + i)); return s; };

/**
 * Read a RIFF/WAVE file: PCM at 8, 16, 24 or 32 bits, or IEEE float at 32 or 64 bits, also in the
 * WAVE_FORMAT_EXTENSIBLE wrapper. Channels are averaged into one. Samples are scaled to −1…1.
 */
export function readWav(buf: ArrayBuffer | Uint8Array): Sound {
  const u8 = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  const v = new DataView(u8.buffer, u8.byteOffset, u8.byteLength);
  if (u8.length < 12 || str(v, 0, 4) !== 'RIFF' || str(v, 8, 4) !== 'WAVE') throw new Error('This is not a WAV file (no RIFF/WAVE header).');
  let at = 12, fmt: { tag: number; ch: number; fs: number; align: number; bits: number } | null = null, data: [number, number] | null = null;
  while (at + 8 <= u8.length) {
    const id = str(v, at, 4); let size = v.getUint32(at + 4, true);
    const body = at + 8;
    if (id === 'fmt ') {
      let tag = v.getUint16(body, true);
      const ch = v.getUint16(body + 2, true), fs = v.getUint32(body + 4, true), align = v.getUint16(body + 12, true), bits = v.getUint16(body + 14, true);
      if (tag === 0xfffe && size >= 40) tag = v.getUint16(body + 24, true);
      fmt = { tag, ch, fs, align, bits };
    } else if (id === 'data') {
      if (body + size > u8.length) size = u8.length - body; // a recorder that stopped early leaves a wrong size
      data = [body, size];
    }
    at = body + size + (size & 1);
  }
  if (!fmt) throw new Error('The WAV file has no format (fmt) chunk.');
  if (!data) throw new Error('The WAV file has no sound (data) chunk.');
  const { tag, ch, fs, bits } = fmt;
  if (!(ch >= 1) || !(fs >= 1000)) throw new Error('The WAV file gives an impossible channel count or sample rate.');
  const bytes = bits / 8;
  if (tag === 1 && ![8, 16, 24, 32].includes(bits)) throw new Error(`${bits}-bit PCM is not supported (8, 16, 24 or 32 bits are).`);
  if (tag === 3 && ![32, 64].includes(bits)) throw new Error(`${bits}-bit float is not supported.`);
  if (tag !== 1 && tag !== 3) throw new Error(`This WAV file is compressed (format ${tag}). Save it as plain PCM WAV and try again.`);
  const align = fmt.align || bytes * ch;
  const n = Math.floor(data[1] / align), x = new Float64Array(n), start = data[0];
  for (let i = 0; i < n; i++) {
    let s = 0;
    for (let c = 0; c < ch; c++) {
      const p = start + i * align + c * bytes;
      if (tag === 3) s += bits === 32 ? v.getFloat32(p, true) : v.getFloat64(p, true);
      else if (bits === 8) s += (v.getUint8(p) - 128) / 128;
      else if (bits === 16) s += v.getInt16(p, true) / 32768;
      else if (bits === 24) { let w = v.getUint8(p) | (v.getUint8(p + 1) << 8) | (v.getUint8(p + 2) << 16); if (w & 0x800000) w -= 0x1000000; s += w / 8388608; }
      else s += v.getInt32(p, true) / 2147483648;
    }
    x[i] = s / ch;
  }
  return { fs, x, channels: ch, bits, format: tag === 3 ? 'float' : 'PCM', seconds: n / fs };
}

/** A mono 16-bit PCM WAV file of the samples (clipped to −1…1). */
export function writeWav(x: ArrayLike<number>, fs: number): Uint8Array {
  const n = x.length, out = new Uint8Array(44 + n * 2), v = new DataView(out.buffer);
  const put = (at: number, s: string) => { for (let i = 0; i < s.length; i++) out[at + i] = s.charCodeAt(i); };
  put(0, 'RIFF'); v.setUint32(4, 36 + n * 2, true); put(8, 'WAVE'); put(12, 'fmt ');
  v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true); v.setUint32(24, fs, true);
  v.setUint32(28, fs * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true); put(36, 'data'); v.setUint32(40, n * 2, true);
  for (let i = 0; i < n; i++) v.setInt16(44 + i * 2, Math.round(Math.max(-1, Math.min(1, x[i])) * 32767), true);
  return out;
}

/**
 * Change the sample rate with a Hann-windowed sinc low-pass filter, cut off at 0.95 of the lower Nyquist
 * frequency, `zeros` zero crossings either side. Good enough for speech analysis (stop band about −50 dB).
 */
export function resample(x: ArrayLike<number>, fsIn: number, fsOut: number, zeros = 16): Float64Array {
  if (fsIn === fsOut) return Float64Array.from(x);
  const n = Math.floor(x.length * fsOut / fsIn), out = new Float64Array(n);
  const fc = 0.95 * Math.min(fsIn, fsOut) / 2;   // cutoff (Hz)
  const g = 2 * fc / fsIn;                         // cutoff as a fraction of the input rate × 2
  const half = zeros / g;                          // half-width of the kernel in input samples
  for (let m = 0; m < n; m++) {
    const t = m * fsIn / fsOut, lo = Math.max(0, Math.ceil(t - half)), hi = Math.min(x.length - 1, Math.floor(t + half));
    let s = 0;
    for (let k = lo; k <= hi; k++) {
      const d = k - t, u = d * g;
      const sinc = u === 0 ? 1 : Math.sin(Math.PI * u) / (Math.PI * u);
      s += x[k] * g * sinc * (0.5 + 0.5 * Math.cos(Math.PI * d / half));
    }
    out[m] = s;
  }
  return out;
}
