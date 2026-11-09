// IEEE 754 binary floating point, done exactly with BigInt: correctly rounded encoding of any decimal
// (round to nearest, ties to even) into half, single or double precision, decoding of any bit pattern,
// exact decimal values, neighbours, ULPs and the exact rounding error. Plain TypeScript, no DOM.

export type FmtId = 'half' | 'single' | 'double';
export type Fmt = { id: FmtId; name: string; bits: number; e: number; m: number; bias: number };
export const FORMATS: Record<FmtId, Fmt> = {
  half: { id: 'half', name: 'Half (16-bit)', bits: 16, e: 5, m: 10, bias: 15 },
  single: { id: 'single', name: 'Single (32-bit)', bits: 32, e: 8, m: 23, bias: 127 },
  double: { id: 'double', name: 'Double (64-bit)', bits: 64, e: 11, m: 52, bias: 1023 },
};

/** An exact rational: sign × num / den, den > 0, num ≥ 0. */
export type Rat = { neg: boolean; num: bigint; den: bigint };
const big = BigInt, ONE = 1n, TWO = 2n, ZERO = 0n;
const pow2 = (k: number) => ONE << big(k);
const bitLen = (x: bigint) => (x === ZERO ? 0 : x.toString(2).length);
function gcd(a: bigint, b: bigint) { while (b) { [a, b] = [b, a % b]; } return a; }

export type Parsed = { kind: 'num'; r: Rat } | { kind: 'inf'; neg: boolean } | { kind: 'nan' };
/** Read "0.1", "-2.5e-3", "1_000", "−0", "inf", "-Infinity", "NaN". */
export function parseDecimal(s: string): Parsed {
  const t = s.trim().replace(/[−–]/g, '-').replace(/[_\s,]/g, '');
  if (/^[+-]?(inf|infinity|∞)$/i.test(t)) return { kind: 'inf', neg: t.startsWith('-') };
  if (/^[+-]?nan$/i.test(t)) return { kind: 'nan' };
  const m = /^([+-]?)(\d*)(?:\.(\d*))?(?:[eE]([+-]?\d+))?$/.exec(t);
  if (!m || (!m[2] && !m[3])) throw new Error(`"${s.trim()}" is not a number. Type something like 0.1, -2.5e-3, inf or NaN.`);
  const digits = (m[2] || '') + (m[3] || ''), exp = Number(m[4] || 0) - (m[3] || '').length;
  if (Math.abs(exp) > 100000) throw new Error('That exponent is too large to work with.');
  let num = big(digits || '0'), den = ONE;
  if (exp >= 0) num *= 10n ** big(exp); else den = 10n ** big(-exp);
  const g = gcd(num, den) || ONE;
  return { kind: 'num', r: { neg: m[1] === '-', num: num / g, den: den / g } };
}

/** Round an exact value to the nearest float of the format (ties to even). */
export function encodeRat(r: Rat, f: Fmt): bigint {
  const sign = r.neg ? pow2(f.bits - 1) : ZERO, p = f.m + 1, emin = 1 - f.bias, emax = f.bias;
  if (r.num === ZERO) return sign;
  // e = floor(log2(num/den))
  let e = bitLen(r.num) - bitLen(r.den);
  const ge = (k: number) => (k >= 0 ? r.num >= r.den << big(k) : r.num << big(-k) >= r.den);
  if (!ge(e)) e--;
  if (e < emin) e = emin;
  // M = round(num / den × 2^(p − 1 − e)), half to even
  const sh = p - 1 - e;
  let n = r.num, d = r.den;
  if (sh >= 0) n <<= big(sh); else d <<= big(-sh);
  let M = n / d;
  const rem = n - M * d, twice = rem * TWO;
  if (twice > d || (twice === d && (M & ONE) === ONE)) M += ONE;
  if (M === pow2(p)) { M >>= ONE; e++; }
  if (e > emax) return sign | ((pow2(f.e) - ONE) << big(f.m));
  const biased = M >= pow2(p - 1) ? big(e + f.bias) : ZERO;
  return sign | (biased << big(f.m)) | (M & (pow2(f.m) - ONE));
}

export function encode(s: string, f: Fmt): bigint {
  const p = parseDecimal(s);
  if (p.kind === 'nan') return ((pow2(f.e) - ONE) << big(f.m)) | pow2(f.m - 1); // quiet NaN
  if (p.kind === 'inf') return (p.neg ? pow2(f.bits - 1) : ZERO) | ((pow2(f.e) - ONE) << big(f.m));
  return encodeRat(p.r, f);
}

export type Kind = 'zero' | 'subnormal' | 'normal' | 'infinity' | 'nan';
export type Decoded = { sign: number; expField: number; mant: bigint; kind: Kind; e: number; M: bigint; r: Rat | null };
/** Split a bit pattern. For finite values, value = (−1)^sign × M × 2^(e − m), M the whole significand. */
export function decode(bits: bigint, f: Fmt): Decoded {
  const sign = Number((bits >> big(f.bits - 1)) & ONE), expField = Number((bits >> big(f.m)) & (pow2(f.e) - ONE)), mant = bits & (pow2(f.m) - ONE);
  const maxE = 2 ** f.e - 1;
  if (expField === maxE) return { sign, expField, mant, kind: mant === ZERO ? 'infinity' : 'nan', e: NaN, M: ZERO, r: null };
  const sub = expField === 0, e = sub ? 1 - f.bias : expField - f.bias, M = sub ? mant : mant | pow2(f.m);
  const kind: Kind = sub ? (mant === ZERO ? 'zero' : 'subnormal') : 'normal';
  const k = e - f.m;
  const r: Rat = k >= 0 ? { neg: sign === 1, num: M << big(k), den: ONE } : reduce({ neg: sign === 1, num: M, den: pow2(-k) });
  return { sign, expField, mant, kind, e, M, r };
}
function reduce(r: Rat): Rat { const g = gcd(r.num, r.den) || ONE; return { neg: r.neg, num: r.num / g, den: r.den / g }; }

/** Exact plain decimal text of a rational whose denominator is 2^a·5^b (every float and every typed decimal). */
export function ratToDecimal(r: Rat): string {
  let den = r.den, twos = 0, fives = 0;
  while (den % TWO === ZERO) { den /= TWO; twos++; }
  while (den % 5n === ZERO) { den /= 5n; fives++; }
  if (den !== ONE) throw new Error('not a terminating decimal');
  const k = Math.max(twos, fives);
  const scaled = r.num * (r.den === ONE ? ONE : (10n ** big(k)) / r.den);
  let s = scaled.toString();
  if (k > 0) { s = s.padStart(k + 1, '0'); s = `${s.slice(0, -k)}.${s.slice(-k)}`.replace(/\.?0+$/, ''); }
  return (r.neg && r.num !== ZERO ? '-' : '') + s;
}

export const sub = (a: Rat, b: Rat): Rat => {
  const n1 = (a.neg ? -ONE : ONE) * a.num * b.den, n2 = (b.neg ? -ONE : ONE) * b.num * a.den, n = n1 - n2;
  return reduce({ neg: n < ZERO, num: n < ZERO ? -n : n, den: a.den * b.den });
};
/** Approximate a rational as a JS number (fine for ratios and display). */
export function ratToNumber(r: Rat): number {
  if (r.num === ZERO) return r.neg ? -0 : 0;
  const sh = bitLen(r.num) - bitLen(r.den) - 60;
  const q = sh >= 0 ? r.num / (r.den << big(sh)) : (r.num << big(-sh)) / r.den;
  return (r.neg ? -1 : 1) * Number(q) * 2 ** sh;
}

/** The value of a finite pattern as a JS number (exact: every half, single and double is a double). */
export function toNumber(bits: bigint, f: Fmt): number {
  const d = decode(bits, f);
  if (d.kind === 'nan') return NaN;
  if (d.kind === 'infinity') return d.sign ? -Infinity : Infinity;
  return (d.sign ? -1 : 1) * Number(d.M) * 2 ** (d.e - f.m);
}

/** The next float towards +∞ (up) or −∞ (down). NaN stays NaN; ±∞ stay at the end of the line. */
export function step(bits: bigint, f: Fmt, up: boolean): bigint {
  const d = decode(bits, f), signBit = pow2(f.bits - 1), mag = bits & (signBit - ONE), inf = (pow2(f.e) - ONE) << big(f.m);
  if (d.kind === 'nan') return bits;
  if (mag === ZERO) return up ? ONE : signBit | ONE;
  const neg = d.sign === 1;
  if (up !== neg) { if (mag === inf) return bits; return bits + ONE; } // away from zero
  const m2 = mag - ONE; // towards zero
  return m2 === ZERO ? (neg ? signBit : ZERO) : (bits & signBit) | m2;
}

/** Unit in the last place: the gap from |x| to the next larger float, 2^(e − m). */
export function ulp(bits: bigint, f: Fmt): Rat | null {
  const d = decode(bits, f);
  if (d.kind === 'nan' || d.kind === 'infinity') return null;
  const k = d.e - f.m;
  return k >= 0 ? { neg: false, num: pow2(k), den: ONE } : { neg: false, num: ONE, den: pow2(-k) };
}

/** The shortest decimal that rounds back to exactly this float. */
export function shortest(bits: bigint, f: Fmt): string {
  const d = decode(bits, f);
  if (d.kind === 'nan') return 'NaN';
  if (d.kind === 'infinity') return d.sign ? '-Infinity' : 'Infinity';
  const x = toNumber(bits, f);
  if (x === 0) return d.sign ? '-0' : '0';
  if (f.id === 'double') return String(x);
  for (let p = 1; p <= 17; p++) { const s = String(Number(x.toPrecision(p))); if (encode(s, f) === bits) return s; }
  return String(x);
}

export const hex = (bits: bigint, f: Fmt) => '0x' + bits.toString(16).toUpperCase().padStart(f.bits / 4, '0');
export const binary = (bits: bigint, f: Fmt) => bits.toString(2).padStart(f.bits, '0');
/** Read "0x3FB9…" or a string of 0s and 1s as a bit pattern of the format. */
export function parseBits(s: string, f: Fmt): bigint {
  const t = s.trim().replace(/[\s_]/g, '');
  let v: bigint;
  if (/^0x[0-9a-f]+$/i.test(t)) v = big(t);
  else if (/^0b[01]+$/i.test(t)) v = big(t);
  else if (/^[01]+$/.test(t) && t.length === f.bits) v = big('0b' + t);
  else throw new Error(`Type the pattern as hex (like ${hex(encode('0.1', f), f)}) or as ${f.bits} zeros and ones.`);
  if (v >= pow2(f.bits)) throw new Error(`That pattern has more than ${f.bits} bits.`);
  return v;
}

/** Notable values of a format. */
export function specials(f: Fmt): { name: string; bits: bigint }[] {
  const expAll = (pow2(f.e) - ONE) << big(f.m), mAll = pow2(f.m) - ONE, signBit = pow2(f.bits - 1);
  return [
    { name: 'Zero', bits: ZERO }, { name: 'Negative zero', bits: signBit },
    { name: 'Smallest subnormal', bits: ONE }, { name: 'Largest subnormal', bits: mAll },
    { name: 'Smallest normal', bits: pow2(f.m) }, { name: 'One', bits: big(f.bias) << big(f.m) },
    { name: 'One plus machine epsilon', bits: (big(f.bias) << big(f.m)) | ONE },
    { name: 'Largest finite', bits: expAll - pow2(f.m) | mAll }, { name: 'Infinity', bits: expAll },
    { name: 'Minus infinity', bits: signBit | expAll }, { name: 'NaN (quiet)', bits: expAll | pow2(f.m - 1) },
  ];
}
