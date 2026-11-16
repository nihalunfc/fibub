// "Solve my numbers" for the square root finder: the root to a chosen number of decimal places, the side of a square
// from its area, the smallest number that makes a perfect square, and the area from the side. Plain maths, no DOM.
// Engine: src/lib/learn/solvecore-b.ts.
import { sf, type SSpec, type SIn, type SOut } from '../learn/solvecore-b.ts';
import { primes } from './sqrt-j2.ts';

// Unit factors are all 1: the page keeps the unit you pick and only writes it back (a square of 36 cm has area in cm²).
const AREA_UNITS: [string, number][] = [['no unit', 1], ['m²', 1], ['cm²', 1], ['mm²', 1], ['km²', 1]];
const LEN_UNITS: [string, number][] = [['no unit', 1], ['m', 1], ['cm', 1], ['mm', 1], ['km', 1]];
const TIP_ROOT = 'Common mistakes: √(a + b) is not √a + √b (√9 + √16 = 7, but √25 = 5); and for a number between 0 and 1 the root is bigger than the number (√0.25 = 0.5).';
const TIP_AREA = 'Common mistake: the area is in square units and the side is in plain units. A square of area 1296 m² has a side of 36 m, not 36 m².';
const group = (n: number) => (Number.isInteger(n) && Math.abs(n) < 1e15 ? n.toLocaleString('en') : sf(n, 6));

/** The exact square root of a non-negative number with a short decimal part, or null if it is not a perfect square of such a number. */
export function exactRoot(n: number): number | null {
  for (let j = 0; j <= 4; j++) {
    const m = Math.round(n * 100 ** j);
    if (Math.abs(m - n * 100 ** j) > 1e-9 * Math.max(1, m)) continue;
    const r = Math.round(Math.sqrt(m));
    if (r * r === m) return r / 10 ** j;
  }
  return null;
}
/** Smallest number to multiply (or divide) a whole number by to make a perfect square, with the primes that decide it. */
export function fixSquare(n: number) {
  const ps = primes(n), odd: number[] = [], counts = new Map<number, number>();
  for (const p of ps) counts.set(p, (counts.get(p) ?? 0) + 1);
  for (const [p, c] of counts) if (c % 2) odd.push(p);
  const r = odd.reduce((a, b) => a * b, 1);
  return { ps, odd, r, up: n * r, down: n / r };
}
const dpText = (x: number, dp: number) => x.toFixed(dp);

export function sqrtSolve(i: Record<string, SIn>, c: { find: string; ch: Record<string, string> }): SOut {
  const f = c.find;
  if (f === 'root' || f === 'side') {
    const x = (f === 'side' ? i.a : i.n).v, dp = Number(c.ch.dp ?? '2');
    if (x < 0) return { error: 'A negative number has no real square root, because a number times itself is never negative. Check the sign.' };
    if (x > 1e15) return { error: 'That number is too big for this page. Try one up to 10¹⁵.' };
    const ex = exactRoot(x), lines: string[] = [];
    const unit = f === 'side' ? i.a.u : '';
    const sideUnit = unit === 'no unit' || !unit ? '' : unit.replace('²', '');
    const post = f === 'side' ? (sideUnit ? ` ${sideUnit}` : '') : '';
    if (f === 'side') lines.push(`Area of a square = side × side, so side = √area = √${group(x)}${unit && unit !== 'no unit' ? ` ${unit}` : ''}.`);
    if (x === 0) return { answer: f === 'side' ? 'A square with area 0 has side 0: it is just a point.' : '√0 = 0.', lines: ['0 × 0 = 0, so √0 = 0.'], tip: TIP_ROOT };
    if (ex !== null) {
      lines.push(`${group(ex)} × ${group(ex)} = ${group(x)}, so √${group(x)} = ${group(ex)}${post}.`, `${group(x)} is a perfect square.`);
      return { answer: f === 'side' ? `The side of the square is ${group(ex)}${post}.` : `√${group(x)} = ${group(ex)} exactly.`, lines, tip: f === 'side' ? TIP_AREA : TIP_ROOT };
    }
    const lo = Math.floor(Math.sqrt(x)), r = Math.sqrt(x);
    lines.push(`${lo}² = ${lo * lo} and ${lo + 1}² = ${(lo + 1) * (lo + 1)}, so √${group(x)} is between ${lo} and ${lo + 1}.`);
    const rr = dpText(r, dp);
    lines.push(`Not a perfect square, so the root never ends: √${group(x)} = ${sf(r, 8)}...`, `To ${dp} decimal place${dp === 1 ? '' : 's'}: ${rr}${post}. Check: ${rr} × ${rr} = ${sf(Number(rr) * Number(rr), 6)}, close to ${group(x)}.`);
    return { answer: f === 'side' ? `The side is about ${rr}${post} (to ${dp} decimal place${dp === 1 ? '' : 's'}).` : `√${group(x)} ≈ ${rr} (to ${dp} decimal place${dp === 1 ? '' : 's'}).`, lines, tip: f === 'side' ? TIP_AREA : TIP_ROOT };
  }
  if (f === 'fix') {
    const n = i.n.v;
    if (!Number.isInteger(n) || n < 1) return { error: 'Type a whole number of 1 or more (this method works on prime factors).' };
    if (n > 1e12) return { error: 'That number is too big for this page. Try one up to 1,000,000,000,000.' };
    const F = fixSquare(n), pf = F.ps.join(' × ');
    const lines = [`Prime factors: ${group(n)} = ${n === 1 ? '1' : pf}.`];
    if (F.r === 1) return { answer: `${group(n)} is already a perfect square (√${group(n)} = ${group(Math.sqrt(n))}), so there is nothing to multiply or divide by.`, lines: [...lines, 'Every prime is in a pair.'], tip: 'Pair up equal primes. If no prime is left over, the number is already a perfect square.' };
    lines.push(`Primes without a partner: ${F.odd.length > 1 ? `${F.odd.join(' × ')} = ` : ''}${group(F.r)}.`, `Multiply: ${group(n)} × ${group(F.r)} = ${group(F.up)} = ${group(Math.sqrt(F.up))}², a perfect square.`, `Divide: ${group(n)} ÷ ${group(F.r)} = ${group(F.down)} = ${group(Math.sqrt(F.down))}², a perfect square.`);
    return { answer: `Multiply ${group(n)} by ${group(F.r)} to get the perfect square ${group(F.up)} (root ${group(Math.sqrt(F.up))}), or divide by ${group(F.r)} to get ${group(F.down)} (root ${group(Math.sqrt(F.down))}).`, lines, tip: 'Common mistake: multiplying by a whole prime factor list. Only the primes that have no partner count; each one is used once.' };
  }
  // square: area from the side
  const s = i.l.v;
  if (s < 0) return { error: 'A length cannot be negative. Check the sign.' };
  if (s > 1e7) return { error: 'That side is too big for this page. Try one up to 10,000,000.' };
  const u = i.l.u === 'no unit' ? '' : i.l.u, au = u ? `${u}²` : '';
  return { answer: `The area of the square is ${group(s * s)}${au ? ` ${au}` : ''}.`, lines: ['Area of a square = side × side.', `Area = ${group(s)} × ${group(s)} = ${group(s * s)}${au ? ` ${au}` : ''}.`], tip: TIP_AREA };
}

export const SQRT_SPEC: SSpec = {
  id: 'sqrt',
  finds: [['root', 'Square root of a number'], ['side', 'Side of a square (from its area)'], ['fix', 'Smallest number to make a perfect square'], ['sq', 'Area of a square (from its side)']],
  fields: [
    { k: 'n', label: 'The number', ph: 'e.g. 1296', show: (c) => c.find === 'root' || c.find === 'fix' },
    { k: 'a', label: 'Area of the square', units: AREA_UNITS, ph: 'e.g. 1296', show: (c) => c.find === 'side' },
    { k: 'l', label: 'Side of the square', units: LEN_UNITS, ph: 'e.g. 36', show: (c) => c.find === 'sq' },
    { k: 'dp', label: 'Decimal places for the answer', kind: 'choice', options: [['0', '0'], ['1', '1'], ['2', '2'], ['3', '3'], ['4', '4']], def: '2', show: (c) => c.find === 'root' || c.find === 'side' },
  ],
  presets: [
    { name: '√7056, a perfect square', find: 'root', vals: { n: '7056' } },
    { name: '√40 to 3 decimal places', find: 'root', vals: { n: '40' }, ch: { dp: '3' } },
    { name: 'Square plot of area 1296 m²: find its side', find: 'side', vals: { a: ['1296', 'm²'] } },
    { name: 'Make 1800 a perfect square', find: 'fix', vals: { n: '1800' } },
    { name: 'Make 252 a perfect square', find: 'fix', vals: { n: '252' } },
    { name: 'Square tile with side 12.5 cm: find its area', find: 'sq', vals: { l: ['12.5', 'cm'] } },
  ],
  solve: (i, c) => sqrtSolve(i, c),
};
