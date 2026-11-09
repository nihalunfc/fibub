// Error-correcting and error-detecting codes for #580 error-correcting-codes: parity, Hamming (7,4) and (15,11)
// with the extra SECDED parity bit, CRC (any width up to 32, with the common presets and the long division shown),
// and Reed-Solomon over GF(2^8) (primitive polynomial 0x11d, generator α = 2, first root α^0, as in the reedsolo
// Python package), decoded with syndromes, Berlekamp-Massey, a Chien search and Forney's formula.
// Plain TypeScript, no DOM. Checked against reedsolo and crcmod in tests/sci-tools/error-correcting-codes.mjs.

export type Bits = number[];

// ---------- Parity ----------
/** The parity bit that makes the number of 1s even (or odd). */
export const parityBit = (bits: Bits, odd = false) => (bits.reduce((a, b) => a ^ b, 0) ^ (odd ? 1 : 0));

// ---------- Hamming ----------
/** Positions 1..n; parity bits sit at the powers of two. r = 3 gives (7,4), r = 4 gives (15,11). */
export const hammingSize = (r: number) => ({ n: 2 ** r - 1, k: 2 ** r - 1 - r });
export const isParityPos = (p: number) => (p & (p - 1)) === 0;

/**
 * Hamming encode: data bits go into the non-power-of-two positions in order; each parity bit p covers every
 * position whose number has bit p set. With `extended`, an overall parity bit goes in front (position 0), giving
 * SECDED: single errors corrected, double errors detected.
 */
export function hammingEncode(data: Bits, r: number, extended = false): Bits {
  const { n, k } = hammingSize(r);
  if (data.length !== k) throw new Error(`Hamming (${n},${k}) takes exactly ${k} data bits.`);
  const c = new Array<number>(n + 1).fill(0);
  let j = 0;
  for (let p = 1; p <= n; p++) if (!isParityPos(p)) c[p] = data[j++] & 1;
  for (let b = 1; b <= n; b <<= 1) { let s = 0; for (let p = 1; p <= n; p++) if (p & b && p !== b) s ^= c[p]; c[b] = s; }
  if (extended) c[0] = c.slice(1).reduce((a, x) => a ^ x, 0);
  return extended ? c : c.slice(1);
}

export type HammingResult = {
  syndrome: number; overall: number | null; status: 'ok' | 'corrected' | 'parity-bit' | 'double' ; position: number | null;
  corrected: Bits; data: Bits; checks: { bit: number; covers: number[]; value: number }[];
};
/** Decode a received Hamming word (positions 1..n, or 0..n when extended). */
export function hammingDecode(word: Bits, r: number, extended = false): HammingResult {
  const { n } = hammingSize(r);
  if (word.length !== n + (extended ? 1 : 0)) throw new Error(`Expected ${n + (extended ? 1 : 0)} bits.`);
  const c = extended ? word.slice() : [0, ...word];
  const checks: HammingResult['checks'] = [];
  let syndrome = 0;
  for (let b = 1; b <= n; b <<= 1) {
    const covers: number[] = []; let s = 0;
    for (let p = 1; p <= n; p++) if (p & b) { covers.push(p); s ^= c[p]; }
    checks.push({ bit: b, covers, value: s });
    if (s) syndrome |= b;
  }
  const overall = extended ? c.reduce((a, x) => a ^ x, 0) : null;
  let status: HammingResult['status'] = 'ok', position: number | null = null;
  const fixed = c.slice();
  if (!extended) { if (syndrome) { status = 'corrected'; position = syndrome; fixed[syndrome] ^= 1; } }
  else if (syndrome && overall) { status = 'corrected'; position = syndrome; fixed[syndrome] ^= 1; }
  else if (!syndrome && overall) { status = 'parity-bit'; position = 0; fixed[0] ^= 1; }
  else if (syndrome && !overall) status = 'double';
  const data: Bits = [];
  for (let p = 1; p <= n; p++) if (!isParityPos(p)) data.push(fixed[p]);
  return { syndrome, overall, status, position, corrected: extended ? fixed : fixed.slice(1), data, checks };
}

// ---------- CRC ----------
export type CrcSpec = { name: string; width: number; poly: number; init: number; refin: boolean; refout: boolean; xorout: number; check: number };
/** Common CRCs with their standard check value (the CRC of the ASCII text "123456789"). */
export const CRCS: CrcSpec[] = [
  { name: 'CRC-8 (SMBus)', width: 8, poly: 0x07, init: 0, refin: false, refout: false, xorout: 0, check: 0xf4 },
  { name: 'CRC-8/MAXIM (1-Wire)', width: 8, poly: 0x31, init: 0, refin: true, refout: true, xorout: 0, check: 0xa1 },
  { name: 'CRC-16/ARC', width: 16, poly: 0x8005, init: 0, refin: true, refout: true, xorout: 0, check: 0xbb3d },
  { name: 'CRC-16/CCITT-FALSE', width: 16, poly: 0x1021, init: 0xffff, refin: false, refout: false, xorout: 0, check: 0x29b1 },
  { name: 'CRC-16/XMODEM', width: 16, poly: 0x1021, init: 0, refin: false, refout: false, xorout: 0, check: 0x31c3 },
  { name: 'CRC-16/MODBUS', width: 16, poly: 0x8005, init: 0xffff, refin: true, refout: true, xorout: 0, check: 0x4b37 },
  { name: 'CRC-32 (zip, PNG, Ethernet)', width: 32, poly: 0x04c11db7, init: 0xffffffff, refin: true, refout: true, xorout: 0xffffffff, check: 0xcbf43926 },
  { name: 'CRC-32C (Castagnoli)', width: 32, poly: 0x1edc6f41, init: 0xffffffff, refin: true, refout: true, xorout: 0xffffffff, check: 0xe3069283 },
];
const reflect = (v: number, w: number) => { let r = 0; for (let i = 0; i < w; i++) if (v & (2 ** i)) r += 2 ** (w - 1 - i); return r; };

/** Bit-by-bit CRC of bytes (Rocksoft model). Uses plain numbers up to 32 bits wide. */
export function crc(bytes: Uint8Array, s: CrcSpec): number {
  const top = 2 ** (s.width - 1), mask = 2 ** s.width - 1;
  let reg = s.init;
  for (const b0 of bytes) {
    const b = s.refin ? reflect(b0, 8) : b0;
    for (let i = 7; i >= 0; i--) {
      const inBit = (b >> i) & 1, hi = reg >= top ? 1 : 0;
      reg = (reg - (hi ? top : 0)) * 2;
      if (hi ^ inBit) reg = xor(reg, s.poly);
    }
    reg = reg % (mask + 1);
  }
  if (s.refout) reg = reflect(reg, s.width);
  return xor(reg, s.xorout) % (mask + 1);
}
/** XOR of two non-negative integers up to 2^53 (bitwise ^ stops at 32 bits signed). */
const xor = (a: number, b: number) => { const hi = (Math.floor(a / 2 ** 32) ^ Math.floor(b / 2 ** 32)) >>> 0, lo = ((a >>> 0) ^ (b >>> 0)) >>> 0; return hi * 2 ** 32 + lo; };

export type DivStep = { at: number; before: string; xorWith: string; after: string };
/**
 * CRC as school long division in GF(2): append (degree) zeros to the message bits and divide by the generator.
 * Returns each XOR step and the remainder (the check bits sent after the message).
 */
export function crcDivide(msg: string, gen: string): { padded: string; steps: DivStep[]; remainder: string; codeword: string } {
  if (!/^[01]+$/.test(msg)) throw new Error('The message must be 0s and 1s.');
  if (!/^1[01]*1$|^1$/.test(gen) || gen.length < 2) throw new Error('The generator must be 0s and 1s, start with 1 and end with 1, at least 2 bits.');
  const d = gen.length - 1, a = (msg + '0'.repeat(d)).split('').map(Number), g = gen.split('').map(Number);
  const steps: DivStep[] = [];
  for (let i = 0; i + d < a.length; i++) {
    if (!a[i]) continue;
    const before = a.join('');
    for (let j = 0; j <= d; j++) a[i + j] ^= g[j];
    steps.push({ at: i, before, xorWith: ' '.repeat(i) + gen, after: a.join('') });
  }
  const remainder = a.slice(a.length - d).join('');
  return { padded: msg + '0'.repeat(d), steps, remainder, codeword: msg + remainder };
}

// ---------- GF(2^8) and Reed-Solomon ----------
export const PRIM = 0x11d;
export const EXP = new Uint8Array(512), LOG = new Uint8Array(256);
{ let x = 1; for (let i = 0; i < 255; i++) { EXP[i] = x; LOG[x] = i; x <<= 1; if (x & 0x100) x ^= PRIM; } for (let i = 255; i < 512; i++) EXP[i] = EXP[i - 255]; }
export const gmul = (a: number, b: number) => (a && b ? EXP[LOG[a] + LOG[b]] : 0);
export const gdiv = (a: number, b: number) => { if (!b) throw new Error('Division by zero in GF(256).'); return a ? EXP[(LOG[a] + 255 - LOG[b]) % 255] : 0; };
export const gpow = (a: number, e: number) => (a ? EXP[(((LOG[a] * e) % 255) + 255) % 255] : e === 0 ? 1 : 0);
export const ginv = (a: number) => gdiv(1, a);

/** Polynomials are arrays of coefficients, highest degree first. */
export function polyMul(p: number[], q: number[]): number[] {
  const r = new Array<number>(p.length + q.length - 1).fill(0);
  for (let i = 0; i < p.length; i++) for (let j = 0; j < q.length; j++) r[i + j] ^= gmul(p[i], q[j]);
  return r;
}
export function polyEval(p: number[], x: number): number { let y = p[0]; for (let i = 1; i < p.length; i++) y = gmul(y, x) ^ p[i]; return y; }

/** The generator polynomial Π (x − α^i), i = 0..nsym−1. */
export function rsGenerator(nsym: number): number[] {
  let g = [1];
  for (let i = 0; i < nsym; i++) g = polyMul(g, [1, EXP[i]]);
  return g;
}

/** Systematic RS encode: the message bytes, then nsym check bytes. */
export function rsEncode(msg: number[], nsym: number): number[] {
  if (nsym < 1 || nsym > 254) throw new Error('Use between 1 and 254 check bytes.');
  if (msg.length + nsym > 255) throw new Error(`Message plus check bytes must be at most 255 bytes; this is ${msg.length + nsym}.`);
  const g = rsGenerator(nsym), out = [...msg, ...new Array<number>(nsym).fill(0)];
  for (let i = 0; i < msg.length; i++) {
    const c = out[i];
    if (c) for (let j = 1; j < g.length; j++) out[i + j] ^= gmul(g[j], c);
  }
  return [...msg, ...out.slice(msg.length)];
}

/** Syndromes S_i = r(α^i), i = 0..nsym−1. All zero means no error is visible. */
export const rsSyndromes = (r: number[], nsym: number) => Array.from({ length: nsym }, (_, i) => polyEval(r, EXP[i]));

export type RSDecode = {
  ok: boolean; reason?: string; syndromes: number[]; locator: number[]; positions: number[]; magnitudes: number[];
  corrected: number[]; message: number[]; bmSteps: { n: number; d: number; L: number }[];
};

/**
 * Decode: syndromes, then Berlekamp-Massey for the error locator Λ(x) (lowest degree first here), a Chien search
 * for its roots (the error positions), and Forney's formula e = X·Ω(X⁻¹)/Λ'(X⁻¹) for the error values.
 * Up to ⌊nsym/2⌋ errors are corrected; more are usually detected, and the result says so.
 */
export function rsDecode(r: number[], nsym: number): RSDecode {
  const n = r.length;
  const S = rsSyndromes(r, nsym);
  const base = { syndromes: S, locator: [1], positions: [] as number[], magnitudes: [] as number[], corrected: r.slice(), message: r.slice(0, n - nsym), bmSteps: [] as RSDecode['bmSteps'] };
  if (S.every((s) => s === 0)) return { ok: true, ...base };
  // Berlekamp-Massey, polynomials lowest degree first.
  let L = 0, m = 1, b = 1;
  let C = [1], B = [1];
  const steps: RSDecode['bmSteps'] = [];
  for (let k = 0; k < nsym; k++) {
    let d = S[k];
    for (let i = 1; i <= L; i++) d ^= gmul(C[i] ?? 0, S[k - i]);
    if (d === 0) m++;
    else {
      const coef = gdiv(d, b), T = C.slice();
      const len = Math.max(C.length, B.length + m);
      const Cn = new Array<number>(len).fill(0);
      for (let i = 0; i < C.length; i++) Cn[i] = C[i];
      for (let i = 0; i < B.length; i++) Cn[i + m] ^= gmul(coef, B[i]);
      C = Cn;
      if (2 * L <= k) { L = k + 1 - L; B = T; b = d; m = 1; } else m++;
    }
    steps.push({ n: k, d, L });
  }
  while (C.length > 1 && C[C.length - 1] === 0) C.pop();
  const fail = (reason: string): RSDecode => ({ ...base, ok: false, reason, locator: C, bmSteps: steps });
  if (2 * L > nsym) return fail(`Berlekamp-Massey needs ${L} errors, more than the ${Math.floor(nsym / 2)} that ${nsym} check bytes can correct.`);
  // Chien search: byte j (0 = first) has locator X = α^(n−1−j); it is in error when Λ(X⁻¹) = 0.
  const evalLow = (p: number[], x: number) => { let y = 0; for (let i = p.length - 1; i >= 0; i--) y = gmul(y, x) ^ p[i]; return y; };
  const positions: number[] = [];
  for (let j = 0; j < n; j++) if (evalLow(C, gpow(2, -(n - 1 - j))) === 0) positions.push(j);
  if (positions.length !== L) return fail(`The error locator has degree ${L} but only ${positions.length} of its roots fall inside the ${n}-byte block: too many errors to correct.`);
  // Forney. Ω(x) = S(x)Λ(x) mod x^nsym, S(x) = Σ S_i x^i (lowest first).
  const Om = new Array<number>(nsym).fill(0);
  for (let i = 0; i < nsym; i++) for (let j = 0; j < C.length && i + j < nsym; j++) Om[i + j] ^= gmul(S[i], C[j]);
  const dC: number[] = C.map((c, i) => (i % 2 === 1 ? c : 0)).slice(1); // formal derivative, lowest first
  const corrected = r.slice(), magnitudes: number[] = [];
  for (const j of positions) {
    const X = gpow(2, n - 1 - j), Xi = ginv(X);
    const den = evalLow(dC, Xi);
    if (!den) return fail('Forney\'s formula hit a zero derivative: too many errors to correct.');
    const e = gmul(X, gdiv(evalLow(Om, Xi), den));
    magnitudes.push(e); corrected[j] ^= e;
  }
  if (rsSyndromes(corrected, nsym).some((s) => s)) return fail('The corrected block still has non-zero syndromes: too many errors to correct.');
  return { ok: true, syndromes: S, locator: C, positions, magnitudes, corrected, message: corrected.slice(0, n - nsym), bmSteps: steps };
}

/** Bytes typed as hex ("4f 6b", "0x4f,0x6b" or "4f6b"). */
export function readHex(text: string): number[] {
  const t = text.replace(/0x/gi, '').replace(/[\s,;:]+/g, ' ').trim();
  if (!t) return [];
  const parts = t.includes(' ') ? t.split(' ') : t.match(/.{1,2}/g)!;
  return parts.map((p) => { if (!/^[0-9a-f]{1,2}$/i.test(p)) throw new Error(`"${p}" is not a hex byte (00 to ff).`); return parseInt(p, 16); });
}
export const hex = (b: number[]) => b.map((x) => x.toString(16).padStart(2, '0')).join(' ');
export const readBits = (t: string): Bits => { const s = t.replace(/\s+/g, ''); if (/[^01]/.test(s)) throw new Error('Use only 0s and 1s.'); return s.split('').map(Number); };
