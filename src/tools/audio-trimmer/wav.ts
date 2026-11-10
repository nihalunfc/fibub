// Trim, fade and normalise decoded audio, and write it as a 16-bit PCM WAV file. Plain TypeScript, no DOM.

export type Edit = { start: number; end: number; fadeIn: number; fadeOut: number; normalise: boolean };
export const NORMAL_PEAK = Math.pow(10, -1 / 20); // -1 dBFS

/** The sample rate written in a WAV file's fmt chunk, or 0 if this is not a WAV file. */
export function wavRate(b: ArrayBuffer): number {
  const v = new DataView(b), tag = (o: number) => String.fromCharCode(v.getUint8(o), v.getUint8(o + 1), v.getUint8(o + 2), v.getUint8(o + 3));
  if (b.byteLength < 28 || tag(0) !== 'RIFF' || tag(8) !== 'WAVE') return 0;
  for (let p = 12; p + 8 <= b.byteLength; p += 8 + v.getUint32(p + 4, true) + (v.getUint32(p + 4, true) & 1)) {
    if (tag(p) === 'fmt ' && p + 16 <= b.byteLength) return v.getUint32(p + 12, true);
  }
  return 0;
}

/** The edited samples, one Float32Array per channel. */
export function applyEdit(chans: Float32Array[], rate: number, e: Edit): Float32Array[] {
  const total = chans[0]?.length ?? 0;
  const s0 = Math.max(0, Math.min(total, Math.round(e.start * rate))), s1 = Math.max(s0, Math.min(total, Math.round(e.end * rate))), len = s1 - s0;
  const out = chans.map((c) => c.slice(s0, s1));
  if (e.normalise) {
    let peak = 0; for (const c of out) for (let i = 0; i < len; i++) { const a = Math.abs(c[i]); if (a > peak) peak = a; }
    if (peak > 0) { const g = NORMAL_PEAK / peak; for (const c of out) for (let i = 0; i < len; i++) c[i] *= g; }
  }
  const fi = Math.min(len, Math.round(Math.max(0, e.fadeIn) * rate)), fo = Math.min(len, Math.round(Math.max(0, e.fadeOut) * rate));
  for (const c of out) {
    for (let i = 0; i < fi; i++) c[i] *= i / fi; // first sample silent
    for (let j = 0; j < fo; j++) c[len - fo + j] *= fo > 1 ? (fo - 1 - j) / (fo - 1) : 0; // last sample silent
  }
  return out;
}

/** A 16-bit PCM WAV file from channels of samples between -1 and 1. */
export function writeWav(chans: Float32Array[], rate: number): Uint8Array {
  const nc = chans.length, len = chans[0]?.length ?? 0, data = len * nc * 2, b = new ArrayBuffer(44 + data), v = new DataView(b);
  const str = (o: number, s: string) => { for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i)); };
  str(0, 'RIFF'); v.setUint32(4, 36 + data, true); str(8, 'WAVE');
  str(12, 'fmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, nc, true); v.setUint32(24, rate, true);
  v.setUint32(28, rate * nc * 2, true); v.setUint16(32, nc * 2, true); v.setUint16(34, 16, true);
  str(36, 'data'); v.setUint32(40, data, true);
  let o = 44;
  for (let i = 0; i < len; i++) for (let c = 0; c < nc; c++) { const x = Math.max(-1, Math.min(1, chans[c][i])); v.setInt16(o, Math.round(x < 0 ? x * 32768 : x * 32767), true); o += 2; }
  return new Uint8Array(b);
}
