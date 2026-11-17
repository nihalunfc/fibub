// "Solve my numbers" for statistics (Class 9 and 10): mean, median, mode and range of raw numbers; mean, median
// and mode of grouped data by the textbook formulae, with the table worked out; and the combined mean of two
// groups. Numbers are typed with spaces or commas between them. No DOM.
import { type SSpec, type SIn, type SOut, sf } from '../learn/solvecore-b.ts';
import { modes, median } from './histo-l2.ts';

const z0 = (x: number) => (Math.abs(x) < 1e-10 ? 0 : x);
const n5 = (x: number) => sf(z0(x), 5);
const par = (x: number) => (x < 0 ? `(${n5(x)})` : n5(x));
const ord = (n: number) => `${n}${n % 100 >= 11 && n % 100 <= 13 ? 'th' : ['th', 'st', 'nd', 'rd'][n % 10 > 3 ? 0 : n % 10]}`;
const cut = (xs: string[], keep = 10) => (xs.length > keep ? `${xs.slice(0, keep - 2).join(', ')}, …, ${xs.slice(-2).join(', ')}` : xs.join(', '));

export function rawStats(d: number[]): SOut {
  if (!d.length) return { error: 'Type at least one number.' };
  if (d.length > 2000) return { error: 'Please keep it to 2000 numbers or fewer.' };
  const n = d.length, sum = d.reduce((s, x) => s + x, 0), mean = sum / n, s = [...d].sort((a, b) => a - b), med = median(d), mo = modes(d), range = s[n - 1] - s[0];
  const mid = n % 2 ? `the middle (${ord((n + 1) / 2)}) value` : `the average of the ${ord(n / 2)} and ${ord(n / 2 + 1)} values`;
  const modeText = mo.length ? mo.map(n5).join(' and ') : 'none';
  const lines = [`Count n = ${n}`, `Sum = ${cut(d.map(n5).map((x) => (x.startsWith('−') ? `(${x})` : x))).replace(/, /g, ' + ')} = ${n5(sum)}`, `Mean = sum ÷ n = ${n5(sum)} ÷ ${n} = ${n5(mean)}`, `Sorted: ${cut(s.map(n5), 14)}`, `Median = ${mid} = ${n5(med)}`, mo.length ? `Mode = the value that occurs most often${mo.length > 1 ? ' (they tie)' : ''} = ${modeText}` : 'Mode: every value occurs once, so there is no mode.', `Range = largest − smallest = ${n5(s[n - 1])} − ${par(s[0])} = ${n5(range)}`];
  return { answer: `Mean = ${sf(mean, 4)}, median = ${sf(med, 4)}, mode = ${modeText}, range = ${sf(range, 4)}.`, lines, tip: 'Common mistake: finding the median without sorting the numbers first. Always put them in order, and with an even count average the two middle values.' };
}

type Cls = { lo: number; hi: number; f: number; x: number };
function classes(edges: number[], freqs: number[]): Cls[] | string {
  if (edges.length < 3) return 'Give at least three class boundaries (for two classes), such as 0 10 20.';
  if (freqs.length !== edges.length - 1) return `You gave ${edges.length} boundaries, which make ${edges.length - 1} classes, but ${freqs.length} frequencies. There must be one frequency per class.`;
  for (let k = 1; k < edges.length; k++) if (!(edges[k] > edges[k - 1])) return 'The class boundaries must go up each time, for example 0 10 20 30.';
  if (freqs.some((f) => f < 0)) return 'A frequency cannot be negative.';
  if (freqs.reduce((s, f) => s + f, 0) <= 0) return 'The frequencies add up to 0, so there is no data. Check the frequencies.';
  return freqs.map((f, k) => ({ lo: edges[k], hi: edges[k + 1], f, x: (edges[k] + edges[k + 1]) / 2 }));
}

export function grouped(edges: number[], freqs: number[]): SOut {
  const C = classes(edges, freqs);
  if (typeof C === 'string') return { error: C };
  const N = C.reduce((s, c) => s + c.f, 0), sfx = C.reduce((s, c) => s + c.f * c.x, 0), mean = sfx / N;
  const lines = [`Class marks x = (lower + upper) ÷ 2 and f × x for each class: ${C.length > 12 ? 'first 12 shown. ' : ''}${C.slice(0, 12).map((c) => `${n5(c.lo)}–${n5(c.hi)}: x = ${n5(c.x)}, f = ${n5(c.f)}, fx = ${n5(c.f * c.x)}`).join('; ')}`, `Σf = N = ${n5(N)} and Σfx = ${n5(sfx)}`, `Mean = Σfx ÷ Σf = ${n5(sfx)} ÷ ${n5(N)} = ${n5(mean)}`];
  let cum = 0, mi = -1, cfPrev = 0;
  C.forEach((c, k) => { if (mi < 0 && cum + c.f >= N / 2) { mi = k; cfPrev = cum; } cum += c.f; });
  const m = C[mi], h = m.hi - m.lo, med = m.lo + ((N / 2 - cfPrev) / m.f) * h;
  let run = 0;
  lines.push(`Cumulative frequency: ${C.slice(0, 12).map((c) => { run += c.f; return n5(run); }).join(', ')}`, `N/2 = ${n5(N / 2)}, so the median class is ${n5(m.lo)}–${n5(m.hi)} (the first class with cumulative frequency of at least N/2)`, `Median = l + ((N/2 − cf) / f) × h = ${n5(m.lo)} + ((${n5(N / 2)} − ${n5(cfPrev)}) / ${n5(m.f)}) × ${n5(h)} = ${n5(med)}`);
  const top = Math.max(...C.map((c) => c.f)), ki = C.findIndex((c) => c.f === top), mc = C[ki], f0 = ki > 0 ? C[ki - 1].f : 0, f2 = ki < C.length - 1 ? C[ki + 1].f : 0, den = 2 * top - f0 - f2, hm = mc.hi - mc.lo;
  const ties = C.filter((c) => c.f === top).length > 1;
  let modeTxt = 'not found (the formula has a zero bottom)', mode = NaN;
  if (den > 0) { mode = mc.lo + ((top - f0) / den) * hm; modeTxt = n5(mode); }
  lines.push(`Modal class = the class with the highest frequency = ${n5(mc.lo)}–${n5(mc.hi)} (f₁ = ${n5(top)}, f₀ = ${n5(f0)}, f₂ = ${n5(f2)})${ties ? '. Two classes tie for the highest frequency; the first is used here' : ''}`, `Mode = l + ((f₁ − f₀) / (2f₁ − f₀ − f₂)) × h = ${n5(mc.lo)} + ((${n5(top)} − ${n5(f0)}) / (${n5(2 * top)} − ${n5(f0)} − ${n5(f2)})) × ${n5(hm)} = ${modeTxt}`);
  const widths = new Set(C.map((c) => Math.round((c.hi - c.lo) * 1e9)));
  if (widths.size > 1) lines.push('The classes have different widths. The mean and median formulae still work, but the mode formula is meant for equal widths.');
  return { answer: `Mean ≈ ${sf(mean, 4)}, median ≈ ${sf(med, 4)}${Number.isFinite(mode) ? `, mode ≈ ${sf(mode, 4)}` : ', mode not found'}.`, lines, tip: 'Common mistakes: using the class limits instead of the class marks for the mean, and using the frequency of the median class where you need the cumulative frequency of the class before it (cf). These are estimates, because the exact values inside each class are not known.' };
}

export function combined(n1: number, m1: number, n2: number, m2: number): SOut {
  if (!(n1 > 0) || !(n2 > 0)) return { error: 'Each group needs more than 0 members.' };
  const N = n1 + n2, m = (n1 * m1 + n2 * m2) / N;
  return { answer: `The combined mean is ${sf(m, 4)}.`, lines: ['Combined mean = (n₁m₁ + n₂m₂) ÷ (n₁ + n₂)', `= (${n5(n1)} × ${par(m1)} + ${n5(n2)} × ${par(m2)}) ÷ (${n5(n1)} + ${n5(n2)})`, `= (${n5(n1 * m1)} + ${n5(n2 * m2)}) ÷ ${n5(N)} = ${n5(n1 * m1 + n2 * m2)} ÷ ${n5(N)} = ${n5(m)}`, `It sits between ${n5(Math.min(m1, m2))} and ${n5(Math.max(m1, m2))}, closer to the mean of the bigger group.`], tip: 'Common mistake: averaging the two means, (m₁ + m₂)/2. That is right only when the groups are the same size. Weight each mean by its group size.' };
}

export const HIST_SPEC: SSpec = {
  id: 'hist',
  finds: [['raw', 'Mean, median, mode, range of raw numbers'], ['grp', 'Grouped data: mean, median, mode'], ['comb', 'Combined mean of two groups']],
  fields: [
    { k: 'data', label: 'Your numbers', kind: 'list', neg: true, ph: 'e.g. 4 7 7 9 12 15', show: (c) => c.find === 'raw' },
    { k: 'edges', label: 'Class boundaries, lowest first', kind: 'list', neg: true, ph: 'e.g. 10 20 30 40 50 60', show: (c) => c.find === 'grp' },
    { k: 'freq', label: 'Frequencies, one per class', kind: 'list', ph: 'e.g. 5 8 15 16 6', show: (c) => c.find === 'grp' },
    { k: 'n1', label: 'Group A: how many', ph: 'e.g. 30', show: (c) => c.find === 'comb' },
    { k: 'm1', label: 'Group A: mean', neg: true, ph: 'e.g. 62', show: (c) => c.find === 'comb' },
    { k: 'n2', label: 'Group B: how many', ph: 'e.g. 20', show: (c) => c.find === 'comb' },
    { k: 'm2', label: 'Group B: mean', neg: true, ph: 'e.g. 70', show: (c) => c.find === 'comb' },
  ],
  presets: [
    { name: 'Raw numbers 4, 7, 7, 9, 12, 15', find: 'raw', vals: { data: '4 7 7 9 12 15' } },
    { name: 'Classes 10–20 to 50–60, frequencies 5, 8, 15, 16, 6', find: 'grp', vals: { edges: '10 20 30 40 50 60', freq: '5 8 15 16 6' } },
    { name: '30 pupils averaging 62 and 20 averaging 70', find: 'comb', vals: { n1: '30', m1: '62', n2: '20', m2: '70' } },
  ],
  solve: (i: Record<string, SIn>, c) => {
    if (c.find === 'raw') return rawStats(i.data.list);
    if (c.find === 'grp') return grouped(i.edges.list, i.freq.list);
    return combined(i.n1.v, i.m1.v, i.n2.v, i.m2.v);
  },
};
