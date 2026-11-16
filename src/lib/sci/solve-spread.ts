// "Solve my numbers" for spread (Class 11 statistics): mean, median, range, mean deviation, variance, standard
// deviation and coefficient of variation from typed raw data or from values with frequencies, and a quick CV
// comparison of two sets from their means and SDs. Divides by n as school books do (or n − 1 if chosen). No DOM.
import { sf as sf3, type SSpec, type SIn, type SOut } from '../learn/solvecore-b.ts';
import { median } from './school-spread.ts';

const sf = (x: number, n = 4) => sf3(x, n);
const MAXN = 200;

function describe(xs: number[], ws: number[] | null, sample: boolean): SOut {
  const N = ws ? ws.reduce((a, b) => a + b, 0) : xs.length;
  if (N < (sample ? 2 : 1)) return { error: sample ? 'Sample variance needs at least 2 values (it divides by n − 1).' : 'Give at least one value.' };
  const w = ws ?? xs.map(() => 1);
  const sum = xs.reduce((s, x, k) => s + w[k] * x, 0), mean = sum / N;
  const ss = xs.reduce((s, x, k) => s + w[k] * (x - mean) ** 2, 0), md = xs.reduce((s, x, k) => s + w[k] * Math.abs(x - mean), 0) / N;
  const dv = sample ? N - 1 : N, vr = ss / dv, sd = Math.sqrt(vr), cv = mean !== 0 ? (100 * sd) / mean : NaN;
  const lines: string[] = [];
  if (ws) {
    lines.push(`Total frequency n = Σf = ${sf(N, 6)}`);
    lines.push(`Σfx = ${xs.map((x, k) => `${sf(w[k], 6)}×${sf(x, 6)}`).join(' + ')} = ${sf(sum, 6)}`);
    lines.push(`Mean x̄ = Σfx ÷ n = ${sf(sum, 6)} ÷ ${sf(N, 6)} = ${sf(mean)}`);
    lines.push(`Σf(x − x̄)² = ${xs.length <= 8 ? xs.map((x, k) => `${sf(w[k], 6)}×(${sf(x - mean, 4)})²`).join(' + ') + ' = ' : ''}${sf(ss)}`);
  } else {
    lines.push(`n = ${N}, Σx = ${sf(sum, 6)}`);
    lines.push(`Mean x̄ = Σx ÷ n = ${sf(sum, 6)} ÷ ${N} = ${sf(mean)}`);
    lines.push(xs.length <= 10 ? `Deviations x − x̄: ${xs.map((x) => sf(x - mean, 4)).join(', ')}` : 'Deviations x − x̄ are found for every value (not all listed here).');
    lines.push(`Σ(x − x̄)² = ${xs.length <= 10 ? xs.map((x) => `(${sf(x - mean, 4)})²`).join(' + ') + ' = ' : ''}${sf(ss)}`);
  }
  lines.push(`Variance σ² = Σ(x − x̄)² ÷ ${sample ? '(n − 1)' : 'n'} = ${sf(ss)} ÷ ${sf(dv, 6)} = ${sf(vr)}`);
  lines.push(`Standard deviation σ = √${sf(vr)} = ${sf(sd)}`);
  lines.push(`Mean deviation about the mean = Σ${ws ? 'f' : ''}|x − x̄| ÷ n = ${sf(md)}`);
  if (!ws) { const s = [...xs].sort((a, b) => a - b); lines.push(`Median = ${sf(median(xs))}; range = ${sf(s[s.length - 1])} − ${sf(s[0])} = ${sf(s[s.length - 1] - s[0])}`); }
  else lines.push(`Range of the values = ${sf(Math.max(...xs) - Math.min(...xs))}`);
  lines.push(Number.isFinite(cv) ? `Coefficient of variation = σ ÷ x̄ × 100 = ${sf(sd)} ÷ ${sf(mean)} × 100 = ${sf(cv)} %` : 'Coefficient of variation: not defined when the mean is 0.');
  if (sd === 0) lines.push('Every value is the same, so there is no spread at all (σ = 0).');
  return { answer: `Mean = ${sf(mean)}, variance = ${sf(vr)}, standard deviation = ${sf(sd)}.`, lines, tip: 'Common mistakes: using the deviations without squaring them, dividing by the wrong number (school books divide by n; some courses use n − 1 for a sample, see More options), and forgetting the square root for σ.' };
}

export function solveSpread(i: Record<string, SIn>, c: { find: string; ch: Record<string, string> }): SOut {
  const sample = c.ch.div === 'sample';
  if (c.find === 'raw') {
    const xs = i.data.list;
    if (xs.length < 1) return { error: 'Type your numbers, separated by spaces or commas.' };
    if (xs.length > MAXN) return { error: `Keep it to ${MAXN} numbers or fewer.` };
    return describe(xs, null, sample);
  }
  if (c.find === 'table') {
    const xs = i.vals.list, fs = i.freq.list;
    if (xs.length !== fs.length) return { error: `You gave ${xs.length} value${xs.length === 1 ? '' : 's'} but ${fs.length} frequenc${fs.length === 1 ? 'y' : 'ies'}. Type one frequency for each value.` };
    if (!xs.length) return { error: 'Type the values and their frequencies.' };
    if (xs.length > 60) return { error: 'Keep it to 60 rows or fewer.' };
    if (fs.some((f) => f < 0 || !Number.isInteger(f))) return { error: 'Frequencies are whole numbers, 0 or more.' };
    if (!fs.some((f) => f > 0)) return { error: 'At least one frequency must be more than 0.' };
    return describe(xs, fs, sample);
  }
  const m1 = i.m1, s1 = i.s1, m2 = i.m2, s2 = i.s2;
  if (!(m1.v > 0) || !(m2.v > 0)) return { error: 'Both means must be more than 0 for the CV to make sense.' };
  if (s1.v < 0 || s2.v < 0) return { error: 'A standard deviation cannot be negative.' };
  const c1 = (100 * s1.v) / m1.v, c2 = (100 * s2.v) / m2.v;
  const verdict = Math.abs(c1 - c2) < 1e-9 ? 'The two sets are equally consistent.' : c1 < c2 ? 'Set A is more consistent (smaller CV).' : 'Set B is more consistent (smaller CV).';
  return { answer: `CV of A = ${sf(c1)} %, CV of B = ${sf(c2)} %. ${verdict}`, lines: ['Coefficient of variation CV = σ ÷ x̄ × 100. It has no units, so different measurements can be compared.', `A: ${sf(s1.v)} ÷ ${sf(m1.v)} × 100 = ${sf(c1)} %`, `B: ${sf(s2.v)} ÷ ${sf(m2.v)} × 100 = ${sf(c2)} %`, 'The set with the smaller CV is more consistent (less variable compared with its mean).'], tip: 'Common mistake: comparing the standard deviations directly. A bigger σ does not mean more variable if the mean is also bigger; compare the CVs.' };
}

export const SPREAD_SPEC: SSpec = {
  id: 'spread',
  finds: [['raw', 'Spread of a list of numbers'], ['table', 'Spread from values and frequencies'], ['cv', 'Compare two sets (CV)']],
  fields: [
    { k: 'data', label: 'Numbers', kind: 'list', neg: true, ph: 'e.g. 4 7 8 9 12', show: (c) => c.find === 'raw' },
    { k: 'vals', label: 'Values x', kind: 'list', neg: true, ph: 'e.g. 2 4 6 8', show: (c) => c.find === 'table' },
    { k: 'freq', label: 'Frequencies f (one per value)', kind: 'list', ph: 'e.g. 3 5 4 2', show: (c) => c.find === 'table' },
    { k: 'm1', label: 'Mean of set A', ph: 'e.g. 60', show: (c) => c.find === 'cv' },
    { k: 's1', label: 'SD of set A', ph: 'e.g. 12', show: (c) => c.find === 'cv' },
    { k: 'm2', label: 'Mean of set B', ph: 'e.g. 80', show: (c) => c.find === 'cv' },
    { k: 's2', label: 'SD of set B', ph: 'e.g. 14', show: (c) => c.find === 'cv' },
    { k: 'div', label: 'Divide by', kind: 'choice', options: [['n', 'n (school books)'], ['sample', 'n − 1 (sample)']], def: 'n', show: (c) => c.find !== 'cv' },
  ],
  presets: [
    { name: 'Five numbers: 4, 7, 8, 9, 12', find: 'raw', vals: { data: '4 7 8 9 12' } },
    { name: 'Marks: 6, 8, 10, 12, 14', find: 'raw', vals: { data: '6 8 10 12 14' } },
    { name: 'Values with frequencies', find: 'table', vals: { vals: '2 4 6 8', freq: '3 5 4 2' } },
    { name: 'Which class is more consistent?', find: 'cv', vals: { m1: '60', s1: '12', m2: '80', s2: '14' } },
  ],
  solve: (i, c) => solveSpread(i, c),
};
