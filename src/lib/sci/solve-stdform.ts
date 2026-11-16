// "Solve my numbers" for standard form (scientific notation, Class 8 to 10): a number to a × 10ⁿ (optionally rounded
// to significant figures), a × 10ⁿ back to an ordinary number, and × ÷ + − of two standard-form numbers. No DOM.
import { sf as sf3, type SSpec, type SIn, type SOut } from '../learn/solvecore-b.ts';

const SUP: Record<string, string> = { '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };
const sup = (e: number) => String(e).split('').map((c) => SUP[c] ?? c).join('');
const sf = (x: number, n = 8) => sf3(x, n);
/** Mantissa text (shortest exact digits) of a number between 1 and 10 */
const man = (a: number) => String(Number(a.toPrecision(12))).replace('-', '−');
const std = (a: number, n: number) => `${man(a)} × 10${sup(n)}`;

/** Digits and exponent of x (shortest round-trip digits), optionally rounded to `sig` significant figures. */
function split(x: number, sig?: number): { neg: boolean; digits: string; exp: number } {
  const ax = Math.abs(x), t = sig ? ax.toExponential(sig - 1) : ax.toExponential();
  const [m, e] = t.split('e');
  return { neg: x < 0, digits: m.replace('.', ''), exp: Number(e) };
}
/** Ordinary (long) decimal text for digits × 10^(exp − (len − 1)). */
function plain(neg: boolean, digits: string, exp: number): string {
  let s: string;
  const point = exp + 1;
  if (point <= 0) s = `0.${'0'.repeat(-point)}${digits}`;
  else if (point >= digits.length) s = digits + '0'.repeat(point - digits.length);
  else s = `${digits.slice(0, point)}.${digits.slice(point)}`;
  if (s.includes('.')) s = s.replace(/0+$/, '').replace(/\.$/, '');
  const [ip, fp] = s.split('.');
  const g = ip.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return (neg ? '−' : '') + g + (fp ? '.' + fp : '');
}
const norm = (a: number, n: number): [number, number] => {
  if (a === 0) return [0, 0];
  const r = Number(a.toPrecision(12)), k = Math.floor(Math.log10(Math.abs(r)) + 1e-12);
  return [Number((r / Math.pow(10, k)).toPrecision(12)), n + k];
};

export function solveStdForm(i: Record<string, SIn>, c: { find: string; ch: Record<string, string> }): SOut {
  const f = c.find;
  if (f === 'to') {
    const x = i.x.v; if (x === 0) return { answer: '0 cannot be written in standard form.', lines: ['Standard form needs a number between 1 and 10 times a power of 10, and 0 is neither.'] };
    const sig = i.sig && !i.sig.blank ? i.sig.v : undefined;
    if (sig !== undefined && (!Number.isInteger(sig) || sig < 1 || sig > 15)) return { error: 'Significant figures is a whole number from 1 to 15.' };
    const s = split(x, sig), a = Number(s.digits[0] + (s.digits.length > 1 ? '.' + s.digits.slice(1) : '')) * (s.neg ? -1 : 1);
    const move = s.exp, ab = Math.abs(x);
    const how = move === 0 ? 'The number is already between 1 and 10, so the power of 10 is 0.' : move > 0 ? `Move the decimal point ${move} place${move > 1 ? 's' : ''} to the left to get ${man(a)}. The number was ${move > 0 ? 'big' : 'small'}, so the power of 10 is positive: 10${sup(move)}.` : `Move the decimal point ${-move} place${-move > 1 ? 's' : ''} to the right to get ${man(a)}. The number is smaller than 1, so the power of 10 is negative: 10${sup(move)}.`;
    const full = split(ab), orig = plain(x < 0, full.digits, full.exp);
    const lines = [`Start with ${orig}. The first non-zero digit gives a = ${man(a)} (between 1 and 10).`, how];
    if (sig) lines.push(`Rounded to ${sig} significant figure${sig > 1 ? 's' : ''}: ${man(a)}.`);
    lines.push(`${orig} ${sig ? '≈' : '='} ${std(a, move)}`);
    return { answer: `${orig} ${sig ? '≈' : '='} ${std(a, move)}.`, lines, tip: 'Common mistake: counting the places the wrong way. Big numbers get a positive power, numbers below 1 get a negative power; check by asking which is bigger.' };
  }
  if (f === 'from') {
    const a = i.a.v, n = i.n.v;
    if (!Number.isInteger(n) || Math.abs(n) > 300) return { error: 'The power of 10 must be a whole number between −300 and 300.' };
    if (a === 0) return { answer: '0 × 10ⁿ = 0.', lines: ['Zero times anything is 0.'] };
    const sa = split(a), total = sa.exp + n;
    const note = Math.abs(a) >= 1 && Math.abs(a) < 10 ? [] : [`Note: in standard form a must be between 1 and 10, so ${man(a)} × 10${sup(n)} is better written ${std(...norm(a, n))}.`];
    const out = plain(sa.neg, sa.digits, total);
    const how = n === 0 ? 'The power is 0, so the number does not change.' : n > 0 ? `Move the decimal point ${n} place${n > 1 ? 's' : ''} to the right (the number gets bigger), filling gaps with zeros.` : `Move the decimal point ${-n} place${-n > 1 ? 's' : ''} to the left (the number gets smaller), filling gaps with zeros.`;
    if (out.length > 60) return { answer: `${man(a)} × 10${sup(n)} has ${Math.abs(total) + sa.digits.length} digits when written out, too long to print in full.`, lines: [how] };
    return { answer: `${man(a)} × 10${sup(n)} = ${out}.`, lines: [how, `${man(a)} × 10${sup(n)} = ${out}`, ...note], tip: 'The sign of the power tells the direction: positive moves the point right (bigger), negative moves it left (smaller).' };
  }
  const op = c.ch.op ?? 'mul', a1 = i.a1.v, n1 = i.n1.v, a2 = i.a2.v, n2 = i.n2.v;
  if (!Number.isInteger(n1) || !Number.isInteger(n2) || Math.abs(n1) > 300 || Math.abs(n2) > 300) return { error: 'Each power of 10 must be a whole number between −300 and 300.' };
  const t1 = `(${man(a1)} × 10${sup(n1)})`, t2 = `(${man(a2)} × 10${sup(n2)})`;
  if (op === 'mul' || op === 'div') {
    if (op === 'div' && a2 === 0) return { error: 'You cannot divide by 0.' };
    const prod = op === 'mul' ? a1 * a2 : a1 / a2, pn = op === 'mul' ? n1 + n2 : n1 - n2;
    const [a, n] = norm(prod, pn), adj = a !== Number(prod.toPrecision(12));
    const lines = [op === 'mul' ? 'Multiply the numbers a, and add the powers of 10 (aᵐ × aⁿ = aᵐ⁺ⁿ).' : 'Divide the numbers a, and subtract the powers of 10 (aᵐ ÷ aⁿ = aᵐ⁻ⁿ).',
      `${t1} ${op === 'mul' ? '×' : '÷'} ${t2} = (${man(a1)} ${op === 'mul' ? '×' : '÷'} ${man(a2)}) × 10^(${n1} ${op === 'mul' ? '+' : '−'} ${n2 < 0 ? `(${n2})` : n2})`,
      `= ${man(Number(prod.toPrecision(12)))} × 10${sup(pn)}`];
    if (adj) lines.push(`${man(Number(prod.toPrecision(12)))} is not between 1 and 10, so adjust: ${std(a, n)}`);
    return { answer: `${t1} ${op === 'mul' ? '×' : '÷'} ${t2} = ${std(a, n)}.`, lines, tip: 'Common mistake: forgetting to re-check that a is between 1 and 10 at the end (4 × 10³ × 5 × 10² = 20 × 10⁵ = 2 × 10⁶).' };
  }
  const hi = Math.max(n1, n2), s1 = a1 * Math.pow(10, n1 - hi), s2 = a2 * Math.pow(10, n2 - hi), sum = op === 'add' ? s1 + s2 : s1 - s2;
  const [a, n] = norm(sum, hi);
  if (sum === 0) return { answer: 'The result is 0.', lines: ['The two numbers are equal, so subtracting gives 0.'] };
  const w = (x: number) => man(Number(x.toPrecision(12)));
  return { answer: `${t1} ${op === 'add' ? '+' : '−'} ${t2} = ${std(a, n)}.`, lines: ['To add or subtract, both numbers must have the same power of 10 first.', `Use 10${sup(hi)}: ${t1} = ${w(s1)} × 10${sup(hi)} and ${t2} = ${w(s2)} × 10${sup(hi)}`, `${w(s1)} ${op === 'add' ? '+' : '−'} ${w(s2)} = ${w(sum)}, so the result is ${w(sum)} × 10${sup(hi)}`, ...(Math.abs(Number(w(sum))) >= 1 && Math.abs(Number(w(sum))) < 10 ? [] : [`Adjust to standard form: ${std(a, n)}`])], tip: 'Common mistake: adding the powers of 10. For + and − the powers must be made equal first; you add the powers only when multiplying.' };
}

export const STDFORM_SPEC: SSpec = {
  id: 'stdform',
  finds: [['to', 'Number to standard form'], ['from', 'Standard form to ordinary number'], ['calc', 'Calculate with two standard-form numbers']],
  fields: [
    { k: 'x', label: 'Number', neg: true, ph: 'e.g. 0.000045 or 384400', show: (c) => c.find === 'to' },
    { k: 'sig', label: 'Round to significant figures (optional)', optional: true, ph: 'e.g. 3', show: (c) => c.find === 'to' },
    { k: 'a', label: 'a (the number between 1 and 10)', neg: true, ph: 'e.g. 6.022', show: (c) => c.find === 'from' },
    { k: 'n', label: 'Power of 10', neg: true, ph: 'e.g. 23', show: (c) => c.find === 'from' },
    { k: 'a1', label: 'First a', ph: 'e.g. 3.2', show: (c) => c.find === 'calc' },
    { k: 'n1', label: 'First power of 10', neg: true, ph: 'e.g. 5', show: (c) => c.find === 'calc' },
    { k: 'op', label: 'Operation', kind: 'choice', options: [['mul', 'multiply ×'], ['div', 'divide ÷'], ['add', 'add +'], ['sub', 'subtract −']], def: 'mul', show: (c) => c.find === 'calc' },
    { k: 'a2', label: 'Second a', ph: 'e.g. 2.5', show: (c) => c.find === 'calc' },
    { k: 'n2', label: 'Second power of 10', neg: true, ph: 'e.g. 3', show: (c) => c.find === 'calc' },
  ],
  presets: [
    { name: '0.000045 in standard form', find: 'to', vals: { x: '0.000045' } },
    { name: '384 400 km (Moon distance) to 3 significant figures', find: 'to', vals: { x: '384400', sig: '3' } },
    { name: '6.022 × 10²³ as an ordinary number', find: 'from', vals: { a: '6.022', n: '23' } },
    { name: '3.2 × 10⁵ × 2.5 × 10³', find: 'calc', vals: { a1: '3.2', n1: '5', a2: '2.5', n2: '3' }, ch: { op: 'mul' } },
    { name: '9.6 × 10⁷ ÷ 3 × 10⁻²', find: 'calc', vals: { a1: '9.6', n1: '7', a2: '3', n2: '-2' }, ch: { op: 'div' } },
    { name: '4.2 × 10⁵ + 3.1 × 10⁴', find: 'calc', vals: { a1: '4.2', n1: '5', a2: '3.1', n2: '4' }, ch: { op: 'add' } },
  ],
  solve: (i, c) => solveStdForm(i, c),
};
