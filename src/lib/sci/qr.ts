// A small QR Code encoder (ISO/IEC 18004): byte mode (UTF-8), versions 1 to 10, error correction L, M, Q or H,
// automatic mask choice. Written for fibub's label maker; no DOM. Follows the structure of Project Nayuki's
// public-domain-style reference design, rewritten in plain TypeScript.

export type Ecl = 'L' | 'M' | 'Q' | 'H';
const ECL_I: Record<Ecl, number> = { L: 0, M: 1, Q: 2, H: 3 };
const ECL_BITS: Record<Ecl, number> = { L: 1, M: 0, Q: 3, H: 2 };
// Error-correction codewords per block and number of blocks, versions 1..10 (from the standard).
const ECC_PER_BLOCK = [
  [7, 10, 15, 20, 26, 18, 20, 24, 30, 18],
  [10, 16, 26, 18, 24, 16, 18, 22, 22, 26],
  [13, 22, 18, 26, 18, 24, 18, 22, 20, 24],
  [17, 28, 22, 16, 22, 28, 26, 26, 24, 28],
];
const BLOCKS = [
  [1, 1, 1, 1, 1, 2, 2, 2, 2, 4],
  [1, 1, 1, 2, 2, 4, 4, 4, 5, 5],
  [1, 1, 2, 2, 4, 4, 6, 6, 8, 8],
  [1, 1, 2, 4, 4, 4, 5, 6, 8, 8],
];
export const MAX_VERSION = 10;

function rawModules(v: number) {
  let r = (16 * v + 128) * v + 64;
  if (v >= 2) { const n = Math.floor(v / 7) + 2; r -= (25 * n - 10) * n - 55; if (v >= 7) r -= 36; }
  return r;
}
/** Data codewords a version and level hold. */
export const dataCodewords = (v: number, e: Ecl) => Math.floor(rawModules(v) / 8) - ECC_PER_BLOCK[ECL_I[e]][v - 1] * BLOCKS[ECL_I[e]][v - 1];
/** The most bytes a version and level hold in byte mode. */
export const byteCapacity = (v: number, e: Ecl) => Math.floor((dataCodewords(v, e) * 8 - 4 - (v < 10 ? 8 : 16)) / 8);

// ---------- Reed-Solomon over GF(256), polynomial 0x11D ----------
function gfMul(x: number, y: number) { let z = 0; for (let i = 7; i >= 0; i--) { z = (z << 1) ^ ((z >>> 7) * 0x11d); z ^= ((y >>> i) & 1) * x; } return z & 255; }
function rsDivisor(deg: number) {
  const r = new Array<number>(deg).fill(0); r[deg - 1] = 1; let root = 1;
  for (let i = 0; i < deg; i++) { for (let j = 0; j < deg; j++) { r[j] = gfMul(r[j], root); if (j + 1 < deg) r[j] ^= r[j + 1]; } root = gfMul(root, 2); }
  return r;
}
export function rsRemainder(data: number[], deg: number) {
  const div = rsDivisor(deg), r = new Array<number>(deg).fill(0);
  for (const b of data) { const f = b ^ r.shift()!; r.push(0); div.forEach((c, i) => (r[i] ^= gfMul(c, f))); }
  return r;
}

function alignPos(v: number): number[] {
  if (v === 1) return [];
  const n = Math.floor(v / 7) + 2, size = v * 4 + 17, step = Math.ceil((v * 4 + 4) / (n * 2 - 2)) * 2, out = [6];
  for (let p = size - 7; out.length < n; p -= step) out.splice(1, 0, p);
  return out;
}

export type Qr = { version: number; ecl: Ecl; mask: number; size: number; modules: boolean[][] };

/** Encode text (UTF-8 bytes) as a QR code. Picks the smallest version from `minVersion`; throws if it does not fit. */
export function encodeQr(text: string, ecl: Ecl = 'M', minVersion = 1, forceMask = -1): Qr {
  const bytes = [...new TextEncoder().encode(text)];
  let v = Math.max(1, minVersion);
  while (v <= MAX_VERSION && bytes.length > byteCapacity(v, ecl)) v++;
  if (v > MAX_VERSION) throw new Error(`Too long for a label QR code: ${bytes.length} bytes, and the limit at level ${ecl} is ${byteCapacity(MAX_VERSION, ecl)}. Shorten the text or use a lower error-correction level.`);
  // Bit stream: mode 0100, length, data, terminator, pad to bytes, pad codewords.
  const bits: number[] = [], put = (val: number, n: number) => { for (let i = n - 1; i >= 0; i--) bits.push((val >>> i) & 1); };
  put(4, 4); put(bytes.length, v < 10 ? 8 : 16); bytes.forEach((b) => put(b, 8));
  const cap = dataCodewords(v, ecl) * 8;
  put(0, Math.min(4, cap - bits.length)); put(0, (8 - (bits.length % 8)) % 8);
  for (let p = 0xec; bits.length < cap; p ^= 0xec ^ 0x11) put(p, 8);
  const data: number[] = [];
  for (let i = 0; i < bits.length; i += 8) data.push(bits.slice(i, i + 8).reduce((a, b) => (a << 1) | b, 0));
  // Split into blocks, add error correction, interleave.
  const nb = BLOCKS[ECL_I[ecl]][v - 1], ecc = ECC_PER_BLOCK[ECL_I[ecl]][v - 1], raw = Math.floor(rawModules(v) / 8);
  const shortLen = Math.floor(raw / nb), numShort = nb - (raw % nb);
  const blocks: number[][] = [];
  for (let i = 0, k = 0; i < nb; i++) {
    const len = shortLen - ecc + (i < numShort ? 0 : 1), d = data.slice(k, k + len); k += len;
    const e = rsRemainder(d, ecc);
    if (i < numShort) d.push(0); // placeholder so all blocks line up
    blocks.push([...d, ...e]);
  }
  const codewords: number[] = [];
  for (let i = 0; i < blocks[0].length; i++) blocks.forEach((b, j) => { if (i !== shortLen - ecc || j >= numShort) codewords.push(b[i]); });
  // Matrix with function patterns.
  const size = v * 4 + 17, M: boolean[][] = Array.from({ length: size }, () => new Array(size).fill(false)), F: boolean[][] = Array.from({ length: size }, () => new Array(size).fill(false));
  const set = (x: number, y: number, d: boolean) => { M[y][x] = d; F[y][x] = true; };
  for (let i = 0; i < size; i++) { set(6, i, i % 2 === 0); set(i, 6, i % 2 === 0); }
  const finder = (cx: number, cy: number) => { for (let dy = -4; dy <= 4; dy++) for (let dx = -4; dx <= 4; dx++) { const x = cx + dx, y = cy + dy; if (x >= 0 && x < size && y >= 0 && y < size) { const d = Math.max(Math.abs(dx), Math.abs(dy)); set(x, y, d !== 2 && d !== 4); } } };
  finder(3, 3); finder(size - 4, 3); finder(3, size - 4);
  const al = alignPos(v);
  al.forEach((ax, i) => al.forEach((ay, j) => { if ((i === 0 && j === 0) || (i === 0 && j === al.length - 1) || (i === al.length - 1 && j === 0)) return; for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) set(ax + dx, ay + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1); }));
  const drawFormat = (mask: number) => {
    const d = (ECL_BITS[ecl] << 3) | mask; let r = d;
    for (let i = 0; i < 10; i++) r = (r << 1) ^ ((r >>> 9) * 0x537);
    const b = ((d << 10) | r) ^ 0x5412, bit = (i: number) => ((b >>> i) & 1) !== 0;
    for (let i = 0; i <= 5; i++) set(8, i, bit(i));
    set(8, 7, bit(6)); set(8, 8, bit(7)); set(7, 8, bit(8));
    for (let i = 9; i < 15; i++) set(14 - i, 8, bit(i));
    for (let i = 0; i < 8; i++) set(size - 1 - i, 8, bit(i));
    for (let i = 8; i < 15; i++) set(8, size - 15 + i, bit(i));
    set(8, size - 8, true);
  };
  drawFormat(0);
  if (v >= 7) {
    let r = v; for (let i = 0; i < 12; i++) r = (r << 1) ^ ((r >>> 11) * 0x1f25);
    const b = (v << 12) | r;
    for (let i = 0; i < 18; i++) { const bit = ((b >>> i) & 1) !== 0, a = size - 11 + (i % 3), c = Math.floor(i / 3); set(a, c, bit); set(c, a, bit); }
  }
  // Data in the zigzag.
  let i = 0;
  for (let right = size - 1; right >= 1; right -= 2) {
    if (right === 6) right = 5;
    for (let vert = 0; vert < size; vert++) for (let j = 0; j < 2; j++) {
      const x = right - j, up = ((right + 1) & 2) === 0, y = up ? size - 1 - vert : vert;
      if (!F[y][x] && i < codewords.length * 8) { M[y][x] = ((codewords[i >>> 3] >>> (7 - (i & 7))) & 1) !== 0; i++; }
    }
  }
  const applyMask = (m: number) => {
    for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
      if (F[y][x]) continue;
      const inv = [(x + y) % 2 === 0, y % 2 === 0, x % 3 === 0, (x + y) % 3 === 0, (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0, ((x * y) % 2) + ((x * y) % 3) === 0, (((x * y) % 2) + ((x * y) % 3)) % 2 === 0, (((x + y) % 2) + ((x * y) % 3)) % 2 === 0][m];
      if (inv) M[y][x] = !M[y][x];
    }
  };
  let mask = forceMask;
  if (mask < 0) {
    let best = Infinity;
    for (let m = 0; m < 8; m++) { applyMask(m); drawFormat(m); const p = penalty(M); if (p < best) { best = p; mask = m; } applyMask(m); }
  }
  applyMask(mask); drawFormat(mask);
  return { version: v, ecl, mask, size, modules: M };
}

/** The standard mask penalty (rules N1 to N4). */
export function penalty(M: boolean[][]): number {
  const size = M.length; let r = 0;
  // N3: 1:1:3:1:1 finder-like runs with 4 light modules on one side, inside the symbol.
  const finderLike = (run: boolean[]) => { const t = run.map((x) => (x ? '1' : '0')).join(''); let c = 0; for (const pat of ['00001011101', '10111010000']) for (let k = t.indexOf(pat); k >= 0; k = t.indexOf(pat, k + 1)) c++; return c; };
  for (let pass = 0; pass < 2; pass++) for (let a = 0; a < size; a++) {
    const line = Array.from({ length: size }, (_, b) => (pass ? M[b][a] : M[a][b]));
    let run = 1;
    for (let b = 1; b <= size; b++) { if (b < size && line[b] === line[b - 1]) run++; else { if (run >= 5) r += 3 + run - 5; run = 1; } }
    r += 40 * finderLike(line);
  }
  for (let y = 0; y < size - 1; y++) for (let x = 0; x < size - 1; x++) { const c = M[y][x]; if (c === M[y][x + 1] && c === M[y + 1][x] && c === M[y + 1][x + 1]) r += 3; }
  let dark = 0; for (const row of M) for (const b of row) if (b) dark++;
  const total = size * size, k = Math.ceil(Math.abs(dark * 20 - total * 10) / total) - 1;
  return r + Math.max(0, k) * 10;
}
