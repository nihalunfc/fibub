// G.711 mu-law and A-law (ITU-T G.711, 1988), as in the public-domain Sun Microsystems reference code. Plain TypeScript, no DOM.
// Telephone systems (Asterisk, FreePBX, 3CX, Cisco) play 8 kHz mono audio in these formats.

const SEG_A = [0x1f, 0x3f, 0x7f, 0xff, 0x1ff, 0x3ff, 0x7ff, 0xfff];
const SEG_U = [0x3f, 0x7f, 0xff, 0x1ff, 0x3ff, 0x7ff, 0xfff, 0x1fff];
const BIAS = 0x84;

/** One 16-bit sample (-32768..32767) to a mu-law byte (14-bit form, as in Sun's g711.c, sox and ffmpeg). */
export function linearToUlaw(pcm: number): number {
  let s = (pcm | 0) >> 2, mask = 0xff;
  if (s < 0) { s = -s; mask = 0x7f; }
  if (s > 8159) s = 8159;
  s += 0x21;
  let seg = 0; while (seg < 8 && s > SEG_U[seg]) seg++;
  if (seg >= 8) return 0x7f ^ mask;
  return ((seg << 4) | ((s >> (seg + 1)) & 0x0f)) ^ mask;
}

/** A mu-law byte to a 16-bit sample. */
export function ulawToLinear(u: number): number {
  u = ~u & 0xff;
  let t = ((u & 0x0f) << 3) + BIAS;
  t <<= (u & 0x70) >> 4;
  return u & 0x80 ? BIAS - t : t - BIAS;
}

/** One 16-bit sample to an A-law byte. */
export function linearToAlaw(pcm: number): number {
  let s = (pcm | 0) >> 3, mask: number;
  if (s >= 0) mask = 0xd5; else { mask = 0x55; s = -s - 1; }
  let seg = 0; while (seg < 8 && s > SEG_A[seg]) seg++;
  if (seg >= 8) return 0x7f ^ mask;
  const a = (seg << 4) | ((seg < 2 ? s >> 1 : s >> seg) & 0x0f);
  return a ^ mask;
}

/** An A-law byte to a 16-bit sample. */
export function alawToLinear(a: number): number {
  a = (a ^ 0x55) & 0xff;
  let t = (a & 0x0f) << 4;
  const seg = (a & 0x70) >> 4;
  if (seg === 0) t += 8; else { t += 0x108; if (seg > 1) t <<= seg - 1; }
  return a & 0x80 ? t : -t;
}

const toInt16 = (x: number) => { const c = x < -1 ? -1 : x > 1 ? 1 : x; return Math.round(c < 0 ? c * 32768 : c * 32767); };

/** Samples between -1 and 1 to G.711 bytes. */
export function encodeG711(samples: Float32Array, law: 'ulaw' | 'alaw'): Uint8Array {
  const out = new Uint8Array(samples.length), f = law === 'ulaw' ? linearToUlaw : linearToAlaw;
  for (let i = 0; i < samples.length; i++) out[i] = f(toInt16(samples[i]));
  return out;
}

/** G.711 bytes to samples between -1 and 1. */
export function decodeG711(bytes: Uint8Array, law: 'ulaw' | 'alaw'): Float32Array {
  const out = new Float32Array(bytes.length), f = law === 'ulaw' ? ulawToLinear : alawToLinear;
  for (let i = 0; i < bytes.length; i++) out[i] = f(bytes[i]) / 32768;
  return out;
}

export { toInt16 };
