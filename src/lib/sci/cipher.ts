// Classical ciphers and SHA-256, step by step, for #581 cipher-teacher. Teaching only: there is no code here to
// break ciphers or recover secrets. Plain TypeScript, no DOM. SHA-256 follows FIPS 180-4 and is checked against
// Python's hashlib; the ciphers against textbook examples and a Python reference (tests/sci-tools/cipher-teacher.mjs).

const A = 65, a0 = 97;
const isUp = (c: number) => c >= A && c < A + 26, isLo = (c: number) => c >= a0 && c < a0 + 26;
const mod = (x: number, m: number) => ((x % m) + m) % m;

/** Apply a letter map (0..25 → 0..25) to the letters of a text, keeping case; other characters pass through. */
function mapLetters(text: string, f: (x: number, i: number) => number): string {
  let out = '', i = 0;
  for (const ch of text) {
    const c = ch.charCodeAt(0);
    if (ch.length === 1 && isUp(c)) out += String.fromCharCode(A + f(c - A, i++));
    else if (ch.length === 1 && isLo(c)) out += String.fromCharCode(a0 + f(c - a0, i++));
    else out += ch;
  }
  return out;
}

export const caesar = (text: string, shift: number, decrypt = false) => mapLetters(text, (x) => mod(x + (decrypt ? -shift : shift), 26));
export const atbash = (text: string) => mapLetters(text, (x) => 25 - x);

/** Letters of a keyword as shifts 0..25 (A = 0). Throws when there are none. */
export function keyShifts(key: string): number[] {
  const k = [...key.toUpperCase()].filter((c) => isUp(c.charCodeAt(0))).map((c) => c.charCodeAt(0) - A);
  if (!k.length) throw new Error('The keyword needs at least one letter A to Z.');
  return k;
}
/** Vigenère: letter i is shifted by key letter i (counting letters only). */
export function vigenere(text: string, key: string, decrypt = false): string {
  const k = keyShifts(key);
  return mapLetters(text, (x, i) => mod(x + (decrypt ? -1 : 1) * k[i % k.length], 26));
}

const gcd = (x: number, y: number): number => (y ? gcd(y, x % y) : Math.abs(x));
export const inverse26 = (a: number) => { for (let i = 1; i < 26; i++) if (mod(a * i, 26) === 1) return i; return NaN; };
/** Affine: E(x) = a·x + b mod 26, D(y) = a⁻¹(y − b) mod 26. a must share no factor with 26. */
export function affine(text: string, a: number, b: number, decrypt = false): string {
  if (!Number.isInteger(a) || !Number.isInteger(b)) throw new Error('a and b must be whole numbers.');
  if (gcd(mod(a, 26), 26) !== 1) throw new Error(`a = ${a} shares a factor with 26, so different letters would collide. Use 1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23 or 25.`);
  const ai = inverse26(mod(a, 26));
  return mapLetters(text, (x) => (decrypt ? mod(ai * (x - b), 26) : mod(a * x + b, 26)));
}

/** The rail (row) each position 0..n−1 sits on in the zigzag. */
export function railPattern(n: number, rails: number): number[] {
  if (rails < 2) return new Array(n).fill(0);
  const cyc = 2 * (rails - 1);
  return Array.from({ length: n }, (_, i) => { const r = i % cyc; return r < rails ? r : cyc - r; });
}
/** Rail fence on every character as typed (spaces included). */
export function railFence(text: string, rails: number, decrypt = false): string {
  if (!Number.isInteger(rails) || rails < 2) throw new Error('Use at least 2 rails.');
  const chars = [...text], n = chars.length, pat = railPattern(n, rails);
  const order = Array.from({ length: n }, (_, i) => i).sort((x, y) => pat[x] - pat[y] || x - y);
  if (!decrypt) return order.map((i) => chars[i]).join('');
  const out = new Array<string>(n);
  order.forEach((pos, k) => (out[pos] = chars[k]));
  return out.join('');
}

/** Counts of A..Z (case ignored). */
export function letterCounts(text: string): number[] {
  const c = new Array<number>(26).fill(0);
  for (const ch of text.toUpperCase()) { const x = ch.charCodeAt(0); if (ch.length === 1 && isUp(x)) c[x - A]++; }
  return c;
}
/** Index of coincidence: the chance two letters picked at random from the text are the same. */
export function indexOfCoincidence(c: number[]): number {
  const n = c.reduce((s, x) => s + x, 0);
  return n > 1 ? c.reduce((s, x) => s + x * (x - 1), 0) / (n * (n - 1)) : NaN;
}

// ---------- SHA-256 (FIPS 180-4) ----------
export const K256 = Uint32Array.from([
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da, 0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
]);
export const H0 = Uint32Array.from([0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19]);
const rotr = (x: number, n: number) => ((x >>> n) | (x << (32 - n))) >>> 0;
export const bigSigma0 = (x: number) => (rotr(x, 2) ^ rotr(x, 13) ^ rotr(x, 22)) >>> 0;
export const bigSigma1 = (x: number) => (rotr(x, 6) ^ rotr(x, 11) ^ rotr(x, 25)) >>> 0;
export const smallSigma0 = (x: number) => (rotr(x, 7) ^ rotr(x, 18) ^ (x >>> 3)) >>> 0;
export const smallSigma1 = (x: number) => (rotr(x, 17) ^ rotr(x, 19) ^ (x >>> 10)) >>> 0;
export const ch = (x: number, y: number, z: number) => ((x & y) ^ (~x & z)) >>> 0;
export const maj = (x: number, y: number, z: number) => ((x & y) ^ (x & z) ^ (y & z)) >>> 0;

/** The message padded: a 1 bit, zeros, then the length in bits as 64 bits, to a multiple of 512 bits. */
export function sha256Pad(msg: Uint8Array): Uint8Array {
  const len = msg.length, total = Math.ceil((len + 9) / 64) * 64, p = new Uint8Array(total);
  p.set(msg); p[len] = 0x80;
  const bits = len * 8;
  const hi = Math.floor(bits / 2 ** 32), lo = bits >>> 0;
  for (let i = 0; i < 4; i++) { p[total - 1 - i] = (lo >>> (8 * i)) & 255; p[total - 5 - i] = (hi >>> (8 * i)) & 255; }
  return p;
}

export type RoundTrace = { t: number; T1: number; T2: number; regs: number[] };
export type BlockTrace = { index: number; W: number[]; start: number[]; rounds: RoundTrace[]; end: number[] };
/** SHA-256 digest, with the full working of one block (message schedule, all 64 rounds) when `traceBlock` is given. */
export function sha256(msg: Uint8Array, traceBlock = -1): { digest: Uint8Array; hex: string; blocks: number; padded: Uint8Array; trace: BlockTrace | null } {
  const p = sha256Pad(msg), H = Uint32Array.from(H0), W = new Uint32Array(64), dv = new DataView(p.buffer);
  let trace: BlockTrace | null = null;
  const nb = p.length / 64;
  for (let b = 0; b < nb; b++) {
    for (let t = 0; t < 16; t++) W[t] = dv.getUint32(b * 64 + t * 4);
    for (let t = 16; t < 64; t++) W[t] = (smallSigma1(W[t - 2]) + W[t - 7] + smallSigma0(W[t - 15]) + W[t - 16]) >>> 0;
    let [a, bb, c, d, e, f, g, h] = H;
    const tr = b === traceBlock;
    const rounds: RoundTrace[] = [];
    for (let t = 0; t < 64; t++) {
      const T1 = (h + bigSigma1(e) + ch(e, f, g) + K256[t] + W[t]) >>> 0, T2 = (bigSigma0(a) + maj(a, bb, c)) >>> 0;
      h = g; g = f; f = e; e = (d + T1) >>> 0; d = c; c = bb; bb = a; a = (T1 + T2) >>> 0;
      if (tr) rounds.push({ t, T1, T2, regs: [a, bb, c, d, e, f, g, h] });
    }
    const start = [...H];
    H[0] = (H[0] + a) >>> 0; H[1] = (H[1] + bb) >>> 0; H[2] = (H[2] + c) >>> 0; H[3] = (H[3] + d) >>> 0;
    H[4] = (H[4] + e) >>> 0; H[5] = (H[5] + f) >>> 0; H[6] = (H[6] + g) >>> 0; H[7] = (H[7] + h) >>> 0;
    if (tr) trace = { index: b, W: [...W], start, rounds, end: [...H] };
  }
  const digest = new Uint8Array(32), out = new DataView(digest.buffer);
  H.forEach((v, i) => out.setUint32(i * 4, v));
  return { digest, hex: [...digest].map((x) => x.toString(16).padStart(2, '0')).join(''), blocks: nb, padded: p, trace };
}

/** The message with one bit flipped (bit 0 = the highest bit of the first byte). */
export function flipBit(msg: Uint8Array, bit: number): Uint8Array {
  if (!(bit >= 0 && bit < msg.length * 8)) throw new Error(`Choose a bit from 0 to ${msg.length * 8 - 1}.`);
  const m = msg.slice(); m[bit >> 3] ^= 0x80 >> (bit & 7); return m;
}
/** Bits that differ between two digests, as a list of 0/1 and their count. */
export function bitDiff(x: Uint8Array, y: Uint8Array): { bits: number[]; count: number } {
  const bits: number[] = [];
  for (let i = 0; i < x.length; i++) for (let k = 7; k >= 0; k--) bits.push(((x[i] ^ y[i]) >> k) & 1);
  return { bits, count: bits.reduce((s, v) => s + v, 0) };
}
export const hex32 = (x: number) => (x >>> 0).toString(16).padStart(8, '0');
