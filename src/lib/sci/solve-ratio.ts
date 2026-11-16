// "Solve my numbers" for ratios (Class 7 to 9): share an amount in a ratio, simplify a ratio (decimals too), find a
// missing term of a proportion, find shares from one known share, and join a:b with b:c. No DOM.
import { sf as sf3, type SSpec, type SIn, type SOut } from '../learn/solvecore-b.ts';
import { gcd } from './smath.ts';

const sf = (x: number, n = 6) => sf3(x, n);
const money = (x: number) => sf(Math.round(x * 1e6) / 1e6, 7);

/** Scale a list of positive numbers (possibly decimals) up to whole numbers: [0.6, 1.5] -> { k: 10, ints: [6, 15] }. */
function toWhole(xs: number[]): { k: number; ints: number[] } | null {
  for (let d = 0; d <= 6; d++) {
    const k = Math.pow(10, d), ints = xs.map((x) => Math.round(x * k));
    if (xs.every((x, j) => Math.abs(x * k - ints[j]) < 1e-7 * Math.max(1, ints[j]))) return { k, ints };
  }
  return null;
}
function simplest(xs: number[]): { k: number; ints: number[]; g: number; out: number[] } | null {
  const w = toWhole(xs); if (!w) return null;
  const g = w.ints.reduce((a, b) => gcd(a, b));
  return { ...w, g, out: w.ints.map((x) => x / g) };
}
const colon = (xs: number[]) => xs.map((x) => sf(x)).join(' : ');
function checkParts(p: number[], min = 2): string | null {
  if (p.length < min) return `Give at least ${min} numbers for the ratio, separated by spaces, commas or colons.`;
  if (p.length > 8) return 'Give 8 numbers or fewer.';
  if (p.some((x) => !(x > 0))) return 'Every part of a ratio must be more than 0.';
  return null;
}
const and = (xs: string[]) => (xs.length < 2 ? xs.join('') : `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}`);

export function solveRatio(i: Record<string, SIn>, c: { find: string }): SOut {
  const f = c.find;
  if (f === 'share') {
    const p = i.parts.list, e = checkParts(p); if (e) return { error: e };
    const q = i.q.v; if (!(q >= 0)) return { error: 'The amount to share cannot be negative.' };
    const T = p.reduce((a, b) => a + b, 0), one = q / T, sh = p.map((x) => x * one);
    return { answer: `The shares are ${and(sh.map((x) => money(x)))}.`, lines: [`Ratio ${colon(p)} has ${p.map((x) => sf(x)).join(' + ')} = ${sf(T)} equal parts in all.`, `One part = ${sf(q)} ÷ ${sf(T)} = ${money(one)}`, ...sh.map((x, k) => `Share ${k + 1} = ${sf(p[k])} × ${money(one)} = ${money(x)}`), `Check: ${sh.map((x) => money(x)).join(' + ')} = ${money(sh.reduce((a, b) => a + b, 0))}`], tip: 'Common mistake: dividing by the number of shares instead of the total number of parts. In 2 : 3 : 5 there are 3 shares but 10 parts.' };
  }
  if (f === 'simplify') {
    const p = i.parts.list, e = checkParts(p, 2); if (e) return { error: e };
    const s = simplest(p); if (!s) return { error: 'Those numbers have too many decimal places to simplify. Round them to 6 decimal places or fewer.' };
    const lines = [`Ratio: ${colon(p)}`];
    if (s.k > 1) lines.push(`Multiply every term by ${s.k} to remove the decimals: ${colon(s.ints)}`);
    lines.push(s.g > 1 ? `Divide every term by their HCF ${s.g}: ${colon(s.ints)} ÷ ${s.g} = ${colon(s.out)}` : 'The terms have no common factor (HCF = 1), so the ratio is already in its simplest form.');
    if (p.length === 2) lines.push(`As 1 : n, divide by the first term: 1 : ${sf(p[1] / p[0], 5)}`, `As a fraction, the first part is ${s.out[0]}/${s.out[0] + s.out[1]} of the total.`);
    return { answer: `${colon(p)} simplifies to ${colon(s.out)}.`, lines, tip: 'Common mistake: dividing the terms by different numbers. Divide every term by the same number (their HCF). Both terms must also be in the same unit first (1 m : 40 cm is 100 : 40 = 5 : 2).' };
  }
  if (f === 'missing') {
    const a = i.a.v, b = i.b.v, cc = i.c.v;
    if (!(a > 0) || !(b > 0) || !(cc > 0)) return { error: 'All three known numbers must be more than 0.' };
    const d = (b * cc) / a;
    return { answer: `${sf(a)} : ${sf(b)} = ${sf(cc)} : ${sf(d, 5)}, so the missing term is ${sf(d, 5)}.`, lines: [`Equal ratios: ${sf(a)} : ${sf(b)} = ${sf(cc)} : x, which means ${sf(a)}/${sf(b)} = ${sf(cc)}/x`, `Cross-multiply: ${sf(a)} × x = ${sf(b)} × ${sf(cc)}`, `x = ${sf(b)} × ${sf(cc)} ÷ ${sf(a)} = ${sf(d, 5)}`, `Check: ${sf(cc)} ÷ ${sf(a)} = ${sf(cc / a, 5)} is the scale factor, and ${sf(b)} × ${sf(cc / a, 5)} = ${sf(d, 5)} ✓`], tip: 'Common mistake: multiplying the wrong pair. The two terms on the diagonal multiply to give the unknown, then divide by the third.' };
  }
  if (f === 'fromone') {
    const p = i.parts.list, e = checkParts(p); if (e) return { error: e };
    const idx = i.idx.v, kn = i.known.v;
    if (!Number.isInteger(idx) || idx < 1 || idx > p.length) return { error: `The share number must be a whole number from 1 to ${p.length}.` };
    if (!(kn > 0)) return { error: 'The known share must be more than 0.' };
    const one = kn / p[idx - 1], sh = p.map((x) => x * one), T = sh.reduce((a, b) => a + b, 0);
    return { answer: `The shares are ${and(sh.map((x) => money(x)))}, and the total is ${money(T)}.`, lines: [`Share ${idx} is ${sf(p[idx - 1])} parts and equals ${sf(kn)}.`, `One part = ${sf(kn)} ÷ ${sf(p[idx - 1])} = ${money(one)}`, ...sh.map((x, k) => `Share ${k + 1} = ${sf(p[k])} × ${money(one)} = ${money(x)}`), `Total = ${money(T)}`], tip: 'Common mistake: dividing the known amount by the total number of parts. First work out what one part is from the share you know.' };
  }
  const r1 = i.r1.list, r2 = i.r2.list;
  if (r1.length !== 2 || r2.length !== 2) return { error: 'Type two numbers for each ratio: A : B first, then B : C.' };
  if ([...r1, ...r2].some((x) => !(x > 0) || !Number.isInteger(x))) return { error: 'Use whole numbers more than 0 in both ratios (clear decimals first).' };
  const [a, b] = r1, [bb, d] = r2, L = (b / gcd(b, bb)) * bb, A = (a * L) / b, C = (d * L) / bb;
  const g = gcd(gcd(A, L), C), out = [A / g, L / g, C / g];
  return { answer: `A : B : C = ${colon(out)}.`, lines: [`B appears in both ratios (${b} in the first, ${bb} in the second). Make B the same: the LCM of ${b} and ${bb} is ${L}.`, `A : B = ${a} : ${b} = ${A} : ${L} (multiply by ${L / b})`, `B : C = ${bb} : ${d} = ${L} : ${C} (multiply by ${L / bb})`, `A : B : C = ${A} : ${L} : ${C}${g > 1 ? ` = ${colon(out)} (divide by ${g})` : ''}`], tip: 'The shared term must be made equal in both ratios before you join them.' };
}

export const RATIO_SPEC: SSpec = {
  id: 'ratio',
  finds: [['share', 'Share an amount in a ratio'], ['simplify', 'Simplify a ratio'], ['missing', 'Missing term of a proportion'], ['fromone', 'Shares from one known share'], ['combine', 'Join A : B and B : C']],
  fields: [
    { k: 'parts', label: 'Ratio (2 to 8 numbers)', kind: 'list', ph: 'e.g. 2 3 5 or 0.6 : 1.5', show: (c) => ['share', 'simplify', 'fromone'].includes(c.find) },
    { k: 'q', label: 'Amount to share', ph: 'e.g. 1200', show: (c) => c.find === 'share' },
    { k: 'idx', label: 'Which share you know (1 = first)', ph: 'e.g. 2', show: (c) => c.find === 'fromone' },
    { k: 'known', label: 'That share is', ph: 'e.g. 48', show: (c) => c.find === 'fromone' },
    { k: 'a', label: 'a, in a : b = c : x', ph: 'e.g. 3', show: (c) => c.find === 'missing' },
    { k: 'b', label: 'b', ph: 'e.g. 5', show: (c) => c.find === 'missing' },
    { k: 'c', label: 'c', ph: 'e.g. 12', show: (c) => c.find === 'missing' },
    { k: 'r1', label: 'A : B', kind: 'list', ph: 'e.g. 2 3', show: (c) => c.find === 'combine' },
    { k: 'r2', label: 'B : C', kind: 'list', ph: 'e.g. 4 5', show: (c) => c.find === 'combine' },
  ],
  presets: [
    { name: 'Share 1200 in the ratio 2 : 3 : 7', find: 'share', vals: { parts: '2 3 7', q: '1200' } },
    { name: 'Simplify 24 : 36 : 60', find: 'simplify', vals: { parts: '24 36 60' } },
    { name: 'Simplify 0.6 : 1.5 (decimals)', find: 'simplify', vals: { parts: '0.6 1.5' } },
    { name: '3 : 5 = 12 : x', find: 'missing', vals: { a: '3', b: '5', c: '12' } },
    { name: 'Ratio 3 : 4 : 5, the second share is 48', find: 'fromone', vals: { parts: '3 4 5', idx: '2', known: '48' } },
    { name: 'A : B = 2 : 3 and B : C = 4 : 5', find: 'combine', vals: { r1: '2 3', r2: '4 5' } },
  ],
  solve: (i, c) => solveRatio(i, c),
};
