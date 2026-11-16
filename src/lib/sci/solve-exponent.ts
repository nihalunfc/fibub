// "Solve my numbers" for laws of exponents (Class 8 and 9): aᵐ × aⁿ, aᵐ ÷ aⁿ, (aᵐ)ⁿ, aᵐ × bᵐ, a value with a zero or
// negative exponent, an unknown exponent, and the power that gives a number. Exact for whole-number bases. No DOM.
import { sf as sf3, type SSpec, type SIn, type SOut } from '../learn/solvecore-b.ts';

const sf = (x: number, n = 6) => sf3(x, n);
const SUP: Record<string, string> = { '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };
const sup = (e: number) => String(e).split('').map((c) => SUP[c] ?? c).join('');
const bt = (a: number) => { const s = sf(a); return a < 0 || !Number.isInteger(a) ? `(${s})` : s; };
const pw = (a: number, e: number) => `${bt(a)}${sup(e)}`;
const LIM = 1000;
const mn = (x: number) => String(x).replace('-', '−');

/** Exact text for a^e when the base is a whole number; otherwise 6 significant figures. */
export function val(a: number, e: number): string {
  if (a === 0) return e > 0 ? '0' : e === 0 ? '1' : '–';
  if (Number.isInteger(a) && Math.abs(a) <= 1e6 && Math.abs(e) <= 300) {
    const p = BigInt(a) ** BigInt(Math.abs(e)), neg = p < 0n, s = (neg ? -p : p).toString();
    if (s.length <= 22) { const g = s.replace(/\B(?=(\d{3})+(?!\d))/g, ','); return (neg ? '−' : '') + (e >= 0 ? g : `1/${g}`); }
  }
  const v = Math.pow(a, e);
  return Number.isFinite(v) ? sf(v) : 'a number too large to show';
}
const dec = (a: number, e: number) => (e < 0 ? ` = ${sf(Math.pow(a, e))}` : '');

function ex(x: SIn | undefined, what: string): string | null {
  if (!x || !Number.isInteger(x.v)) return `${what} must be a whole number (it can be negative or zero).`;
  if (Math.abs(x.v) > LIM) return `Keep ${what.toLowerCase()} between −${LIM} and ${LIM}.`;
  return null;
}
const undef = (a: number, e: number) => (a === 0 && e <= 0 ? (e === 0 ? '0⁰ is not defined.' : '0 to a negative power is not defined (it would mean dividing by zero).') : null);

export function solveExponent(i: Record<string, SIn>, c: { find: string }): SOut {
  const f = c.find;
  if (f === 'solvex') {
    const a = i.a.v, N = i.N.v;
    if (!(a > 0) || a === 1) return { error: 'The base must be more than 0 and not 1 (1 to any power is 1).' };
    if (!(N > 0)) return { error: 'The number must be more than 0 (a positive base never gives 0 or a negative number).' };
    const x = Math.log(N) / Math.log(a), r = Math.round(x);
    if (Math.abs(Math.pow(a, r) - N) > 1e-9 * Math.max(1, Math.abs(N))) return { error: `${sf(a)} to a whole-number power never equals ${sf(N)}. The exponent would be about ${sf(x, 4)}, which needs a calculator (logarithms).` };
    const rep = r > 0 && r <= 8 ? `${Array(r).fill(sf(a)).join(' × ')} = ${sf(N)}, and that is ${r} copies of ${sf(a)}.` : r < 0 && r >= -6 ? `${sf(N)} = 1 ÷ (${Array(-r).fill(sf(a)).join(' × ')}), a negative exponent means a reciprocal.` : `${pw(a, r)} = ${sf(N)}.`;
    return { answer: `x = ${mn(r)}, because ${pw(a, r)} = ${sf(N)}.`, lines: [`We need ${sf(a)}^x = ${sf(N)}.`, rep, `So x = ${mn(r)}.`, `Check: ${pw(a, r)} = ${val(a, r)}`], tip: 'Tip: write the number as a power of the same base, then compare exponents. Zero gives 1 (x = 0); a fraction like 1/8 gives a negative exponent.' };
  }
  const a = i.a.v, A = i.a;
  if (f === 'unknown') {
    const e = ex(i.m, 'm') ?? ex(i.k, 'k'); if (e) return { error: e };
    if (a === 0 || a === 1 || a === -1) return { error: 'The base must not be 0, 1 or −1 (every power of these gives the same few values, so the exponent is not unique).' };
    const m = i.m.v, k = i.k.v, x = k - m;
    return { answer: `x = ${mn(x)}.`, lines: [`${sf(A.typed)}^x × ${pw(a, m)} = ${pw(a, k)}`, `Same base, so add the exponents on the left: ${sf(A.typed)}^(x + ${m < 0 ? `(${m})` : m}) = ${pw(a, k)}`, `Equal powers of the same base have equal exponents: x + ${m < 0 ? `(${m})` : m} = ${k}`, `x = ${k} − ${m < 0 ? `(${m})` : m} = ${mn(x)}`, `Check: ${pw(a, x)} × ${pw(a, m)} = ${pw(a, x + m)} = ${pw(a, k)} ✓`], tip: 'Common mistake: multiplying the exponents. For a product of the same base you add them; you multiply only for a power of a power.' };
  }
  const em = ex(i.m, 'm'); if (em) return { error: em };
  if (f === 'bases') {
    const b = i.b.v, m = i.m.v;
    const u = undef(a, m) ?? undef(b, m); if (u) return { error: u };
    return { answer: `${pw(a, m)} × ${pw(b, m)} = ${pw(a * b, m)} = ${val(a * b, m)}${dec(a * b, m)}.`, lines: [`Same exponent, different bases: aᵐ × bᵐ = (a × b)ᵐ`, `${pw(a, m)} × ${pw(b, m)} = (${bt(a)} × ${bt(b)})${sup(m)} = ${pw(a * b, m)}`, `Value: ${val(a * b, m)}${dec(a * b, m)}`], tip: 'This only works when the exponents are the same. 2³ × 5² cannot be joined this way.' };
  }
  if (f === 'value') {
    const m = i.m.v, u = undef(a, m); if (u) return { error: u };
    const lines = m === 0 ? [`Anything (except 0) to the power 0 is 1: ${pw(a, 0)} = 1`] : m < 0 ? [`A negative exponent means the reciprocal: a⁻ⁿ = 1 ÷ aⁿ`, `${pw(a, m)} = 1 ÷ ${pw(a, -m)} = 1 ÷ ${val(a, -m)}`, `= ${val(a, m)}${dec(a, m)}`] : [`${pw(a, m)} = ${m <= 6 ? Array(m).fill(bt(a)).join(' × ') : `${bt(a)} multiplied ${m} times`} = ${val(a, m)}`];
    return { answer: `${pw(a, m)} = ${m === 0 ? '1' : val(a, m)}${m < 0 ? dec(a, m) : ''}.`, lines, tip: m < 0 ? 'Common mistake: making the answer negative. A negative exponent flips the number to 1/aⁿ; it does not change the sign.' : 'Common mistake: (−2)² = 4 but −2² = −4. Brackets matter when the base is negative.' };
  }
  const en = ex(i.n, 'n'); if (en) return { error: en };
  const m = i.m.v, n = i.n.v;
  if (f === 'product') {
    const u = undef(a, m) ?? undef(a, n) ?? undef(a, m + n); if (u) return { error: u };
    return { answer: `${pw(a, m)} × ${pw(a, n)} = ${pw(a, m + n)} = ${m + n === 0 ? '1' : val(a, m + n)}${dec(a, m + n)}.`, lines: ['Same base, multiply: add the exponents. aᵐ × aⁿ = aᵐ⁺ⁿ', `${pw(a, m)} × ${pw(a, n)} = ${bt(a)}^(${m} + ${n < 0 ? `(${n})` : n}) = ${pw(a, m + n)}`, `Check by value: ${val(a, m)} × ${val(a, n)} = ${m + n === 0 ? '1' : val(a, m + n)}`], tip: 'Common mistake: multiplying the exponents (2³ × 2² is 2⁵, not 2⁶) or multiplying the bases.' };
  }
  if (f === 'quot') {
    const u = undef(a, m) ?? undef(a, n) ?? undef(a, m - n); if (u) return { error: u };
    return { answer: `${pw(a, m)} ÷ ${pw(a, n)} = ${pw(a, m - n)} = ${m - n === 0 ? '1' : val(a, m - n)}${dec(a, m - n)}.`, lines: ['Same base, divide: subtract the exponents. aᵐ ÷ aⁿ = aᵐ⁻ⁿ', `${pw(a, m)} ÷ ${pw(a, n)} = ${bt(a)}^(${m} − ${n < 0 ? `(${n})` : n}) = ${pw(a, m - n)}`, `Check by value: ${val(a, m)} ÷ ${val(a, n)} = ${m - n === 0 ? '1' : val(a, m - n)}`], tip: 'Common mistake: subtracting the wrong way round. Top exponent minus bottom exponent. A negative result means a reciprocal.' };
  }
  // power of a power
  const u = undef(a, m) ?? undef(a, m * n); if (u) return { error: u };
  return { answer: `(${pw(a, m)})${sup(n)} = ${pw(a, m * n)} = ${m * n === 0 ? '1' : val(a, m * n)}${dec(a, m * n)}.`, lines: ['Power of a power: multiply the exponents. (aᵐ)ⁿ = aᵐⁿ', `(${pw(a, m)})${sup(n)} = ${bt(a)}^(${m} × ${n < 0 ? `(${n})` : n}) = ${pw(a, m * n)}`, `Check by value: ${val(a, m * n)}`], tip: 'Common mistake: adding the exponents. (2³)² is 2⁶, not 2⁵. Adding is for a product of powers.' };
}

export const EXPONENT_SPEC: SSpec = {
  id: 'exponent',
  finds: [['product', 'aᵐ × aⁿ'], ['quot', 'aᵐ ÷ aⁿ'], ['power', '(aᵐ)ⁿ'], ['bases', 'aᵐ × bᵐ'], ['value', 'Value of aᵐ (zero or negative m)'], ['unknown', 'Unknown exponent x in aˣ × aᵐ = aᵏ'], ['solvex', 'Power x with aˣ = a number']],
  fields: [
    { k: 'a', label: 'Base a', neg: true, ph: 'e.g. 2', show: () => true },
    { k: 'b', label: 'Second base b', neg: true, ph: 'e.g. 5', show: (c) => c.find === 'bases' },
    { k: 'm', label: 'Exponent m', neg: true, ph: 'e.g. 5', show: (c) => c.find !== 'solvex' },
    { k: 'n', label: 'Exponent n', neg: true, ph: 'e.g. 3', show: (c) => ['product', 'quot', 'power'].includes(c.find) },
    { k: 'k', label: 'Exponent k on the right', neg: true, ph: 'e.g. 9', show: (c) => c.find === 'unknown' },
    { k: 'N', label: 'The number', ph: 'e.g. 81 or 0.125', show: (c) => c.find === 'solvex' },
  ],
  presets: [
    { name: '2⁵ × 2³', find: 'product', vals: { a: '2', m: '5', n: '3' } },
    { name: '5⁷ ÷ 5⁴', find: 'quot', vals: { a: '5', m: '7', n: '4' } },
    { name: '(3²)⁴', find: 'power', vals: { a: '3', m: '2', n: '4' } },
    { name: '2³ × 5³', find: 'bases', vals: { a: '2', b: '5', m: '3' } },
    { name: '4⁻²: negative exponent', find: 'value', vals: { a: '4', m: '-2' } },
    { name: '7ˣ × 7³ = 7⁹: find x', find: 'unknown', vals: { a: '7', m: '3', k: '9' } },
    { name: '3ˣ = 81: find x', find: 'solvex', vals: { a: '3', N: '81' } },
  ],
  solve: (i, c) => solveExponent(i, c),
};
