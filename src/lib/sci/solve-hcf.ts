// "Solve my numbers" for HCF and LCM: HCF and LCM of 2 to 5 numbers by prime factors, the largest number that leaves
// given remainders, the smallest number that leaves a remainder, and a missing number from HCF and LCM. No DOM.
import { type SSpec, type SIn, type SOut } from '../learn/solvecore-b.ts';
import { primeFactors, gcd } from './smath.ts';

const SUP: Record<string, string> = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
const pw = (p: number, k: number) => (k === 1 ? String(p) : p + String(k).split('').map((c) => SUP[c]).join(''));
const expo = (n: number) => { const m = new Map<number, number>(); for (const p of primeFactors(n)) m.set(p, (m.get(p) ?? 0) + 1); return m; };
const ptext = (m: Map<number, number>) => ([...m].map(([p, k]) => pw(p, k)).join(' × ') || '1');
const MAXN = 1e9, SAFE = 9e15;
const show = (x: number) => (x >= 1e6 ? x.toLocaleString('en').replace(/,/g, ' ') : String(x));
const lcm2 = (a: number, b: number) => (a / gcd(a, b)) * b;

function whole(xs: number[], what: string): string | null {
  if (xs.some((x) => !Number.isInteger(x))) return `${what} must be whole numbers.`;
  if (xs.some((x) => x < 1)) return `${what} must be 1 or more.`;
  if (xs.some((x) => x > MAXN)) return `Keep ${what.toLowerCase()} below 1 000 000 000.`;
  return null;
}

export function hcfLcm(nums: number[]): SOut {
  const err = whole(nums, 'The numbers'); if (err) return { error: err };
  if (nums.length < 2) return { error: 'Give at least two numbers, separated by spaces or commas.' };
  if (nums.length > 5) return { error: 'Give between 2 and 5 numbers.' };
  const ex = nums.map(expo), lines: string[] = [];
  nums.forEach((n, k) => lines.push(`${show(n)} = ${n === 1 ? '1' : ptext(ex[k])}`));
  const primes = [...new Set(ex.flatMap((m) => [...m.keys()]))].sort((a, b) => a - b);
  const low = new Map<number, number>(), high = new Map<number, number>();
  for (const p of primes) { const ks = ex.map((m) => m.get(p) ?? 0); if (Math.min(...ks) > 0) low.set(p, Math.min(...ks)); high.set(p, Math.max(...ks)); }
  let h = nums[0], l = nums[0];
  for (const n of nums.slice(1)) { h = gcd(h, n); l = lcm2(l, n); if (l > SAFE) return { error: 'The LCM is too big to show exactly. Try smaller numbers.' }; }
  lines.push(low.size ? `HCF: take each prime common to all, with its lowest power: ${ptext(low)} = ${show(h)}` : 'HCF: no prime is common to all of them, so HCF = 1 (the numbers are co-prime).');
  lines.push(`LCM: take every prime that appears, with its highest power: ${ptext(high)} = ${show(l)}`);
  if (nums.length === 2) lines.push(`Check: HCF × LCM = ${show(h)} × ${show(l)} = ${show(h * l)} = ${show(nums[0])} × ${show(nums[1])}`);
  return { answer: `HCF = ${show(h)} and LCM = ${show(l)}.`, lines, tip: nums.length === 2 ? 'Common mistake: HCF takes the lowest power of the shared primes, LCM the highest power of all primes. HCF × LCM = product works for two numbers only, not three.' : 'For three or more numbers, HCF × LCM is not the product of the numbers (that rule is only for two). Work from the prime powers.' };
}

export function remainders(nums: number[], rems: number[]): SOut {
  const err = whole(nums, 'The numbers'); if (err) return { error: err };
  if (nums.length < 2) return { error: 'Give at least two numbers.' };
  const rs = rems.length === 1 ? nums.map(() => rems[0]) : rems;
  if (rs.length !== nums.length) return { error: `Give one remainder for each number (${nums.length}) or a single remainder for all.` };
  if (rs.some((r) => !Number.isInteger(r) || r < 0)) return { error: 'Remainders are whole numbers, 0 or more.' };
  const diffs = nums.map((n, k) => n - rs[k]);
  if (diffs.some((d) => d <= 0)) return { error: 'Each number must be bigger than its remainder.' };
  const h = diffs.reduce((a, b) => gcd(a, b));
  const lines = ['If a number d leaves remainder r on dividing N, then d divides N − r exactly. So d divides every (number − remainder), and the largest such d is their HCF.', ...nums.map((n, k) => `${show(n)} − ${rs[k]} = ${show(diffs[k])}`), `HCF of ${diffs.map(show).join(', ')} = ${show(h)}`];
  const big = Math.max(...rs);
  if (h <= big) return { error: `The HCF of the differences is ${show(h)}, but a divisor must be bigger than every remainder (largest here is ${big}). No such number exists, so check the numbers.` };
  lines.push(`Check: ${show(h)} is bigger than the largest remainder ${big}, as it must be.`);
  return { answer: `The largest number is ${show(h)}.`, lines, tip: 'Common mistake: finding the HCF of the original numbers. Subtract each remainder first.' };
}

export function smallestWithRemainder(nums: number[], r: number): SOut {
  const err = whole(nums, 'The divisors'); if (err) return { error: err };
  if (nums.length < 2) return { error: 'Give at least two divisors.' };
  if (!Number.isInteger(r) || r < 0) return { error: 'The remainder is a whole number, 0 or more.' };
  if (r >= Math.min(...nums)) return { error: `A remainder must be smaller than every divisor (smallest here is ${Math.min(...nums)}).` };
  let l = nums[0]; for (const n of nums.slice(1)) { l = lcm2(l, n); if (l > SAFE) return { error: 'The LCM is too big. Try smaller numbers.' }; }
  const lines = [`LCM of ${nums.map(show).join(', ')} = ${show(l)} (the smallest number all of them divide exactly)`, `Add the remainder: ${show(l)} + ${r} = ${show(l + r)}`];
  return { answer: r === 0 ? `The smallest number is ${show(l)}.` : `The smallest number is ${show(l + r)}.`, lines, tip: 'Common mistake: stopping at the LCM. The LCM leaves remainder 0; add the remainder you need. The same idea solves "bells ringing together" and "meet again at the start" problems.' };
}

export function missingNumber(a: number, h: number, l: number): SOut {
  const err = whole([a, h, l], 'The numbers'); if (err) return { error: err };
  if (l % h !== 0) return { error: 'The HCF must divide the LCM exactly, so no pair of numbers has these values. Check them.' };
  if (a % h !== 0 || l % a !== 0) return { error: `The given number must be a multiple of the HCF (${h}) and a factor of the LCM (${l}). Check the numbers.` };
  const b = (h * l) / a;
  if (gcd(a, b) !== h) return { error: 'No second number fits: with these values the HCF would not come out right. Check the numbers.' };
  return { answer: `The other number is ${show(b)}.`, lines: ['For two numbers: HCF × LCM = first × second', `${show(h)} × ${show(l)} = ${show(a)} × b`, `b = ${show(h * l)} ÷ ${show(a)} = ${show(b)}`, `Check: HCF(${show(a)}, ${show(b)}) = ${show(gcd(a, b))} and LCM = ${show(lcm2(a, b))}`], tip: 'This shortcut only works for exactly two numbers.' };
}

const list = (i: SIn | undefined) => (i ? i.list : []);
export const HCF_SPEC: SSpec = {
  id: 'hcf',
  finds: [['both', 'HCF and LCM'], ['rem', 'Largest number leaving remainders'], ['small', 'Smallest number with a remainder'], ['miss', 'Missing number from HCF and LCM']],
  fields: [
    { k: 'nums', label: 'Numbers (2 to 5)', kind: 'list', ph: 'e.g. 36 60 84', show: (c) => c.find !== 'miss' },
    { k: 'rems', label: 'Remainders (one each, or one for all)', kind: 'list', ph: 'e.g. 1 2 3', show: (c) => c.find === 'rem' },
    { k: 'r', label: 'Remainder', ph: 'e.g. 5', show: (c) => c.find === 'small' },
    { k: 'a', label: 'The number you know', ph: 'e.g. 36', show: (c) => c.find === 'miss' },
    { k: 'h', label: 'HCF', ph: 'e.g. 6', show: (c) => c.find === 'miss' },
    { k: 'l', label: 'LCM', ph: 'e.g. 180', show: (c) => c.find === 'miss' },
  ],
  presets: [
    { name: 'HCF and LCM of 36, 60 and 84', find: 'both', vals: { nums: '36 60 84' } },
    { name: 'HCF and LCM of 96 and 404', find: 'both', vals: { nums: '96 404' } },
    { name: 'Biggest divisor of 137, 199, 309 leaving 5, 7, 9', find: 'rem', vals: { nums: '137 199 309', rems: '5 7 9' } },
    { name: 'Smallest number leaving remainder 5 for 8, 12, 15', find: 'small', vals: { nums: '8 12 15', r: '5' } },
    { name: 'HCF 6, LCM 180, one number 36: other number', find: 'miss', vals: { a: '36', h: '6', l: '180' } },
  ],
  solve: (i, c) => {
    if (c.find === 'both') return hcfLcm(list(i.nums));
    if (c.find === 'rem') return remainders(list(i.nums), list(i.rems));
    if (c.find === 'small') return smallestWithRemainder(list(i.nums), i.r.v);
    return missingNumber(i.a.v, i.h.v, i.l.v);
  },
};
