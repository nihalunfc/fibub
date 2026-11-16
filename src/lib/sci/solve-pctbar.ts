// "Solve my numbers" for the percentage bar: the school percentage problems, each with the working an exam marks:
// a percent of a number, what percent one number is of another, the whole from a part, a price after a rise or fall,
// the percent change between two values, and the original before a change. Plain maths, no DOM.
// Engine: src/lib/learn/solvecore-b.ts.
import { sf, type SSpec, type SIn, type SOut } from '../learn/solvecore-b.ts';

const TIP_BASE = 'Common mistake: taking the percent of the wrong number. "Percent of" always means of the starting amount, and after a rise you cannot get back by taking the same percent off the new price (up 20% then down 20% is a 4% loss).';
const g = (x: number) => (Math.abs(x) >= 1e15 ? sf(x, 6) : (+x.toFixed(6)).toLocaleString('en', { maximumFractionDigits: 6 }).replace('-', '−'));

export function pctSolve(i: Record<string, SIn>, c: { find: string; ch: Record<string, string> }): SOut {
  const f = c.find, dir = c.ch.dir === 'down' ? -1 : 1, word = dir > 0 ? 'rise' : 'fall';
  if (f === 'of') {
    const p = i.p.v, w = i.w.v;
    if (p < 0 || w < 0) return { error: 'Use positive numbers here. For a fall, pick "Price after a rise or fall".' };
    const r = (p / 100) * w;
    return { answer: `${g(p)}% of ${g(w)} is ${g(r)}.`, lines: ['Percent means "out of 100": p% = p ÷ 100.', `${g(p)}% of ${g(w)} = ${g(p)} ÷ 100 × ${g(w)} = ${g(p / 100)} × ${g(w)} = ${g(r)}`, `Check by 1%: 1% of ${g(w)} = ${g(w / 100)}, and ${g(p)} × ${g(w / 100)} = ${g(r)}.`], tip: TIP_BASE };
  }
  if (f === 'what') {
    const a = i.a.v, b = i.b.v;
    if (b === 0) return { error: 'The whole cannot be 0, because a part of nothing has no percent. Check the second number.' };
    if (a < 0 || b < 0) return { error: 'Use positive numbers here.' };
    const r = (a / b) * 100;
    return { answer: `${g(a)} is ${g(r)}% of ${g(b)}.`, lines: ['Percent = part ÷ whole × 100', `= ${g(a)} ÷ ${g(b)} × 100 = ${g(a / b)} × 100 = ${g(r)}%`, r > 100 ? 'The part is bigger than the whole, so the percent is over 100.' : 'Check: the part is smaller than the whole, so the percent is under 100.'], tip: 'Common mistake: dividing the whole by the part. The part goes on top and the whole (the thing you compare with) goes below.' };
  }
  if (f === 'whole') {
    const a = i.a.v, p = i.p.v;
    if (p === 0) return { error: '0% of anything is 0, so the whole cannot be found from it. Check the percent.' };
    if (p < 0 || a < 0) return { error: 'Use positive numbers here.' };
    const w = (a * 100) / p;
    return { answer: `The whole is ${g(w)}.`, lines: [`${g(a)} is ${g(p)}% of the whole, so 1% of the whole is ${g(a)} ÷ ${g(p)} = ${g(a / p)}.`, `The whole is 100% = ${g(a / p)} × 100 = ${g(w)}.`, `Check: ${g(p)}% of ${g(w)} = ${g((p / 100) * w)}.`], tip: 'Common mistake: working out the percent of the part instead of dividing. If 35% is 84, the whole is 84 ÷ 0.35 = 240, not 84 × 1.35.' };
  }
  if (f === 'change') {
    const o = i.o.v, p = i.p.v;
    if (o < 0 || p < 0) return { error: 'Use positive numbers here. Choose rise or fall with the box below.' };
    if (dir < 0 && p > 100) return { error: 'A fall of more than 100% would make the value negative. Check the percent.' };
    const d = (p / 100) * o, n = o + dir * d;
    return { answer: `After a ${g(p)}% ${word}, the new value is ${g(n)}.`, lines: [`The change is ${g(p)}% of ${g(o)} = ${g(d)}.`, `New value = ${g(o)} ${dir > 0 ? '+' : '−'} ${g(d)} = ${g(n)}`, `Quick way: multiply by ${g(1 + dir * p / 100)}: ${g(o)} × ${g(1 + dir * p / 100)} = ${g(n)}.`], tip: TIP_BASE };
  }
  if (f === 'pct') {
    const o = i.o.v, n = i.n.v;
    if (o === 0) return { error: 'The old value cannot be 0, because the percent change is measured against it. Check the old value.' };
    if (o < 0 || n < 0) return { error: 'Use positive numbers here.' };
    const r = ((n - o) / o) * 100;
    if (r === 0) return { answer: 'There is no change: the new value equals the old value (0%).', lines: [`Change = ${g(n)} − ${g(o)} = 0.`], tip: TIP_BASE };
    return { answer: `The value ${r > 0 ? 'rose' : 'fell'} by ${g(Math.abs(r))}%.`, lines: ['Percent change = (new − old) ÷ old × 100', `= (${g(n)} − ${g(o)}) ÷ ${g(o)} × 100 = ${g(n - o)} ÷ ${g(o)} × 100 = ${g(r)}%`, `A ${r > 0 ? 'positive' : 'negative'} sign means a ${r > 0 ? 'rise' : 'fall'}.`], tip: 'Common mistake: dividing by the new value. Always divide by the old (starting) value.' };
  }
  // orig: reverse percentage
  const n = i.n.v, p = i.p.v;
  if (n < 0 || p < 0) return { error: 'Use positive numbers here. Choose rise or fall with the box below.' };
  if (dir < 0 && p >= 100) return { error: 'A fall of 100% or more would leave nothing, so the original cannot be found. Check the percent.' };
  const k = 1 + dir * p / 100, o = n / k;
  return { answer: `Before the ${g(p)}% ${word}, the value was ${g(o)}.`, lines: [`After a ${g(p)}% ${word}, the new value is ${g(k)} times the original (${dir > 0 ? '100% + ' : '100% − '}${g(p)}% = ${g(k * 100)}%).`, `original × ${g(k)} = ${g(n)}, so original = ${g(n)} ÷ ${g(k)} = ${g(o)}`, `Check: ${g(o)} × ${g(k)} = ${g(o * k)}.`], tip: 'Common mistake: taking the percent off the new value. 20% off ₹120 is not the price before a 20% rise: that was ₹100, because 120 ÷ 1.2 = 100.' };
}

const DIR: [string, string][] = [['up', 'a rise (increase)'], ['down', 'a fall (decrease)']];
export const PCT_SPEC: SSpec = {
  id: 'pct',
  finds: [['of', 'p% of a number'], ['what', 'What percent a is of b'], ['whole', 'The whole, from a part and its percent'], ['change', 'New value after a rise or fall'], ['pct', 'Percent change between two values'], ['orig', 'Original value before a rise or fall']],
  fields: [
    { k: 'w', label: 'The whole (number)', ph: 'e.g. 240', show: (c) => c.find === 'of' },
    { k: 'p', label: 'Percent (%)', ph: 'e.g. 35', show: (c) => ['of', 'whole', 'change', 'orig'].includes(c.find) },
    { k: 'a', label: 'The part', ph: 'e.g. 84', show: (c) => c.find === 'what' || c.find === 'whole' },
    { k: 'b', label: 'The whole it is compared with', ph: 'e.g. 240', show: (c) => c.find === 'what' },
    { k: 'o', label: 'Old (starting) value', ph: 'e.g. 500', show: (c) => c.find === 'change' || c.find === 'pct' },
    { k: 'n', label: 'New value', ph: 'e.g. 600', show: (c) => c.find === 'pct' || c.find === 'orig' },
    { k: 'dir', label: 'Direction of the change', kind: 'choice', options: DIR, def: 'up', show: (c) => c.find === 'change' || c.find === 'orig' },
  ],
  presets: [
    { name: '35% of 240', find: 'of', vals: { w: '240', p: '35' } },
    { name: '84 is what percent of 240?', find: 'what', vals: { a: '84', b: '240' } },
    { name: '84 is 35% of a number: find it', find: 'whole', vals: { a: '84', p: '35' } },
    { name: 'A ₹500 price rises by 20%', find: 'change', vals: { o: '500', p: '20' } },
    { name: 'A price falls from 800 to 680', find: 'pct', vals: { o: '800', n: '680' } },
    { name: 'After a 25% rise the bill is 150', find: 'orig', vals: { n: '150', p: '25' } },
  ],
  solve: (i, c) => pctSolve(i, c),
};
