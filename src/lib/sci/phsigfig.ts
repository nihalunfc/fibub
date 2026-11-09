// Significant figures and rounding with exact decimal arithmetic (BigInt), so 2.675 rounds to 2.68 as written,
// not as a binary float. Counting rules, rounding half up or half to even, value ± uncertainty for lab reports,
// and the sum and product rules for calculations. Plain TypeScript, no DOM.

export type Mode = 'half-up' | 'half-even';
/** A decimal number m × 10^e with m a BigInt; place is the lowest written decimal place (10^place). */
export type Dec = { m: bigint; e: number };
export type Parsed = Dec & {
  text: string; sciNotation: boolean;
  /** Significant figures: min = max unless trailing zeros of a whole number make it ambiguous. */
  min: number; max: number; ambiguous: boolean;
  /** For each character of the mantissa as typed: true when that digit is significant (ambiguous zeros count as false). */
  mask: { ch: string; sig: boolean | null }[];
};

const P10 = (n: number) => 10n ** BigInt(n);
const absB = (a: bigint) => (a < 0n ? -a : a);
const digitsOf = (a: bigint) => (a === 0n ? 0 : absB(a).toString().length);

/** Read a typed number: 0.00520, −1,200., 1.20e3, 1.20 × 10^3, 4.5E-2. Thousands commas allowed (1,234.5). Returns null if not a number. */
export function parse(input: string): Parsed | null {
  let t = input.trim().replace(/[−–]/g, '-').replace(/\s+/g, '');
  if (!t) return null;
  let exp = 0, sciNotation = false;
  const em = t.match(/^(.*?)(?:[eE]|[×xX*]10\^?)([+-]?\d+)$/);
  if (em) { t = em[1]; exp = parseInt(em[2], 10); sciNotation = true; }
  if (/^[+-]?\d{1,3}(,\d{3})+(\.\d*)?$/.test(t)) t = t.replace(/,/g, '');
  const mm = t.match(/^([+-]?)(\d*)(\.?)(\d*)$/);
  if (!mm || (!mm[2] && !mm[4])) return null;
  const [, sign, ip, dot, fp] = mm;
  const all = ip + fp, neg = sign === '-';
  const m = BigInt(all || '0') * (neg ? -1n : 1n), e = exp - fp.length;
  // Significance: first non-zero digit onwards; trailing zeros of a whole number with no decimal point are ambiguous.
  const first = all.search(/[1-9]/);
  const mask: Parsed['mask'] = [];
  let min = 0, max = 0;
  const chars = (ip + dot + fp).split('');
  let di = 0;
  const lastNZ = all.search(/0*$/) - 1; // index of last non-zero digit
  for (const ch of chars) {
    if (ch === '.') { mask.push({ ch, sig: null }); continue; }
    let s: boolean | null;
    if (first < 0) s = false; // the number is zero
    else if (di < first) s = false;
    else if (di <= lastNZ) s = true;
    else s = dot || sciNotation ? true : null; // trailing zero: significant after a decimal point, else ambiguous
    mask.push({ ch, sig: s });
    if (s === true) { min++; max++; } else if (s === null) max++;
    di++;
  }
  if (first < 0) { // zero: "0.00" has as many places as written; count the zeros after the point as significant only by convention
    min = max = Math.max(1, fp.length);
  }
  return { m, e, text: input.trim(), sciNotation, min, max, ambiguous: max > min, mask };
}

/** Round m × 10^e so that its last kept digit is at 10^place. */
export function roundPlace(d: Dec, place: number, mode: Mode = 'half-up'): Dec {
  if (d.e >= place) return { m: d.m, e: d.e };
  const k = place - d.e, div = P10(k), neg = d.m < 0n, a = absB(d.m);
  let q = a / div;
  const r = a % div, twice = 2n * r;
  if (twice > div || (twice === div && (mode === 'half-up' || q % 2n === 1n))) q += 1n;
  return { m: neg ? -q : q, e: place };
}
/** Exponent of the leading digit: 10^lead ≤ |x| < 10^(lead+1). */
export const leadPlace = (d: Dec) => (d.m === 0n ? 0 : d.e + digitsOf(d.m) - 1);
/** Round to n significant figures. */
export function roundSig(d: Dec, n: number, mode: Mode = 'half-up'): Dec {
  if (d.m === 0n) return { m: 0n, e: d.e };
  let r = roundPlace(d, leadPlace(d) - n + 1, mode);
  // 9.96 → 10.0 to 3 s.f. is 10.0 (still three figures, now one place higher): drop the extra digit.
  if (digitsOf(r.m) > n) r = { m: r.m / 10n, e: r.e + 1 };
  return r;
}
/** Plain decimal text with exactly the places of d (e < 0 gives −e decimals; e > 0 pads with zeros). */
export function toPlain(d: Dec): string {
  const neg = d.m < 0n, a = absB(d.m).toString();
  let s: string;
  if (d.e >= 0) s = a + '0'.repeat(d.e);
  else { const k = -d.e, p = a.padStart(k + 1, '0'); s = `${p.slice(0, -k)}.${p.slice(-k)}`; }
  return (neg ? '−' : '') + s;
}
/** Scientific notation keeping every digit of m: 1.20 × 10³. */
export function toSci(d: Dec): string {
  if (d.m === 0n) return toPlain(d);
  const neg = d.m < 0n, a = absB(d.m).toString(), L = leadPlace(d);
  const mant = a.length > 1 ? `${a[0]}.${a.slice(1)}` : a;
  return `${neg ? '−' : ''}${mant} × 10${sup(L)}`;
}
const SUP: Record<string, string> = { '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };
const sup = (n: number) => String(n).split('').map((c) => SUP[c] ?? c).join('');
/** The best way to write d: scientific when plain text would hide which zeros count (rounded to tens or more) or be very long or small. */
export function nice(d: Dec): string {
  const L = leadPlace(d);
  if (d.m !== 0n && (d.e > 0 || L >= 6 || L <= -5)) return toSci(d);
  return toPlain(d);
}
/** Number of significant figures of a rounded Dec (all of m's digits). */
export const sigOf = (d: Dec) => Math.max(1, digitsOf(d.m));
export const toNumber = (d: Dec) => Number(`${d.m}e${d.e}`);

export type Rule = '1' | '2' | 'lead1' | 'lead12';
/** Figures to keep in an uncertainty: 1, 2, or 2 when its first digit is 1 (lead1) or 1 or 2 (lead12), else 1. */
export function uncFigures(u: Dec, rule: Rule): number {
  if (rule === '1') return 1;
  if (rule === '2') return 2;
  const first = absB(u.m).toString()[0];
  return first === '1' || (rule === 'lead12' && first === '2') ? 2 : 1;
}
/**
 * Round a value and its uncertainty for a report: the uncertainty to the rule's figures (rounded half up; some
 * guides round uncertainties up instead, see `up`), then the value to the same decimal place.
 */
export function reportPair(v: Dec, u: Dec, rule: Rule, mode: Mode = 'half-up', up = false) {
  if (u.m <= 0n) throw new Error('The uncertainty must be greater than 0');
  const n = uncFigures(u, rule);
  let ur = roundSig(u, n, mode);
  if (up) { const place = leadPlace(u) - n + 1; const t = roundPlace(u, place, 'half-up'); ur = toNumber(t) < toNumber(u) ? { m: t.m + 1n, e: t.e } : t; if (digitsOf(ur.m) > n) ur = { m: ur.m / 10n, e: ur.e + 1 }; }
  const vr = roundPlace(v, ur.e, mode);
  return { u: ur, v: vr, place: ur.e, figures: n };
}

/** Exact sum of decimals. */
export function add(ds: Dec[]): Dec {
  const e = Math.min(...ds.map((d) => d.e));
  return { m: ds.reduce((s, d) => s + d.m * P10(d.e - e), 0n), e };
}
/** Exact product. */
export const mul = (ds: Dec[]): Dec => ds.reduce((p, d) => ({ m: p.m * d.m, e: p.e + d.e }), { m: 1n, e: 0 });
/** a ÷ b to 40 extra digits (truncated, far beyond any rounding used here). */
export function div(a: Dec, b: Dec): Dec {
  if (b.m === 0n) throw new Error('Division by zero');
  const K = 40 + digitsOf(b.m);
  return { m: (a.m * P10(K)) / b.m, e: a.e - b.e - K };
}
export type Op = 'add' | 'sub' | 'mul' | 'div';
/**
 * Combine typed numbers with the textbook rules: for + and − the result keeps the decimal place of the least precise
 * number; for × and ÷ it keeps the fewest significant figures. Ambiguous whole numbers (1200) use their fewest figures.
 */
export function combine(ps: Parsed[], op: Op, mode: Mode = 'half-up') {
  if (ps.length < 2) throw new Error('Give at least two numbers');
  let exact: Dec;
  if (op === 'add' || op === 'sub') {
    exact = add(ps.map((p, i) => (op === 'sub' && i > 0 ? { m: -p.m, e: p.e } : p)));
    // Least precise place: the lowest significant place of each number as written.
    const place = Math.max(...ps.map((p) => lowestSigPlace(p)));
    return { exact, rounded: roundPlace(exact, place, mode), rule: 'place' as const, place, figures: 0 };
  }
  exact = op === 'mul' ? mul(ps) : ps.slice(1).reduce((a, b) => div(a, b), ps[0] as Dec);
  const figures = Math.min(...ps.map((p) => p.min));
  return { exact, rounded: roundSig(exact, figures, mode), rule: 'figures' as const, place: 0, figures };
}
/** Lowest significant decimal place as written (for 1200 that is 10², taking the ambiguous zeros as not significant). */
export function lowestSigPlace(p: Parsed): number {
  if (p.m === 0n) return p.e;
  return leadPlace(p) - p.min + 1;
}
