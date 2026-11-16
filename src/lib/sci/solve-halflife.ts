// "Solve my numbers" for the decay dice page: the half-life law N = N0 x (1/2)^(t/T). Find the amount left, the time,
// the half-life or the starting amount. Plain maths on typed values with units, no DOM. Engine: solvecore-b.ts.
import { sf, type SSpec, type SIn, type SOut } from '../learn/solvecore-b.ts';

const TIME: [string, number][] = [['s', 1], ['ms', 1e-3], ['min', 60], ['h', 3600], ['days', 86400], ['years', 365.25 * 86400]];
const unitOf = (i: SIn) => (i.typed !== 0 && Number.isFinite(i.typed) ? i.v / i.typed : 1);

export function halfLifeSolve(i: Record<string, SIn>, find: string): SOut {
  const lines: string[] = [];
  const N0 = i.N0?.v, N = i.N?.v, t = i.t?.v, T = i.T?.v;
  if (find !== 'N0' && !(N0 > 0)) return { error: 'The starting amount N₀ must be above zero.' };
  if (find !== 'N' && N < 0) return { error: 'The amount left cannot be negative.' };
  if (find !== 'N' && N0 !== undefined && N > N0) return { error: 'The amount left is bigger than the start. In decay the amount only goes down, so check which number is N₀.' };
  if (find === 'N0' && !(N > 0)) return { error: 'The amount left must be above zero to work back to the start.' };
  if (find !== 't' && t < 0) return { error: 'Time cannot be negative.' };
  if (find !== 'T' && !(T > 0)) return { error: 'The half-life must be above zero.' };
  const sameU = find === 't' || find === 'T' ? null : i.t.u === i.T.u;
  let answer = '', n = NaN, Tsec = T, tsec = t, N0v = N0, Nv = N;
  if (find === 'N') {
    n = t / T;
    if (!sameU) lines.push(`Put t and T in one unit: t = ${sf(t, 4)} s and T = ${sf(T, 4)} s (the ratio is what matters).`);
    const tx = sameU ? `${sf(i.t.typed)} ${i.t.u} ÷ ${sf(i.T.typed)} ${i.T.u}` : `${sf(t, 4)} s ÷ ${sf(T, 4)} s`;
    lines.push('Formula: N = N₀ × (1/2)^(t/T)', `Half-lives passed: n = t ÷ T = ${tx} = ${sf(n)}`);
    Nv = N0 * Math.pow(2, -n);
    lines.push(`N = ${sf(N0)} × (1/2)^${sf(n)} = ${sf(Nv)}`);
    answer = `The amount left is ${sf(Nv)} (in the same unit as the starting amount), which is ${sf((Nv / N0) * 100)}% of the start.`;
  } else if (find === 'N0') {
    n = t / T; N0v = N * Math.pow(2, n);
    if (!sameU) lines.push(`Put t and T in one unit: t = ${sf(t, 4)} s and T = ${sf(T, 4)} s.`);
    lines.push('Formula: N₀ = N × 2^(t/T)', `Half-lives passed: n = t ÷ T = ${sf(n)}`, `N₀ = ${sf(N)} × 2^${sf(n)} = ${sf(N0v)}`);
    answer = `The starting amount was ${sf(N0v)} (in the same unit as the amount left).`;
  } else if (find === 't') {
    if (N === 0) return { error: 'The amount left is 0. A decaying sample never reaches exactly zero (it only gets very small), so pick a small positive amount.' };
    n = Math.log2(N0 / N);
    const u = unitOf(i.T); tsec = n * T;
    lines.push('Formula: t = T × log₂(N₀ ÷ N)', `Half-lives needed: n = log₂(${sf(N0)} ÷ ${sf(N)}) = ln(${sf(N0 / N)}) ÷ ln 2 = ${sf(n)}`, `t = n × T = ${sf(n)} × ${sf(i.T.typed)} ${i.T.u} = ${sf(tsec / u)} ${i.T.u}`);
    answer = `The time needed is ${sf(tsec / u)} ${i.T.u}, which is ${sf(n)} half-lives.`;
  } else {
    if (N === 0) return { error: 'The amount left is 0, so the half-life cannot be worked out. Use a small positive amount.' };
    if (N === N0) return { error: 'Nothing has decayed (the amount left equals the start), so the half-life could be anything. Check N.' };
    if (!(t > 0)) return { error: 'Time must be above zero to find the half-life.' };
    n = Math.log2(N0 / N); Tsec = t / n;
    const u = unitOf(i.t);
    lines.push('Formula: T = t ÷ log₂(N₀ ÷ N)', `Half-lives passed: n = log₂(${sf(N0)} ÷ ${sf(N)}) = ${sf(n)}`, `T = ${sf(i.t.typed)} ${i.t.u} ÷ ${sf(n)} = ${sf(Tsec / u)} ${i.t.u}`);
    answer = `The half-life is ${sf(Tsec / u)} ${i.t.u}.`;
  }
  const lam = Math.LN2 / Tsec;
  lines.push(`Extra: decay constant λ = ln 2 ÷ T = ${sf(lam)} per second; mean life 1/λ = ${sf(1 / lam)} s`);
  return { answer, lines, tip: 'Common mistake: t and T in different units (days and hours, say). Convert first. Also, after 2 half-lives a quarter is left, not nothing: each half-life halves what remains.' };
}

const T_UNITS = TIME;
export const HALFLIFE_SPEC: SSpec = {
  id: 'halflife',
  finds: [['N', 'Amount left N'], ['t', 'Time t'], ['T', 'Half-life T'], ['N0', 'Starting amount N₀']],
  fields: [
    { k: 'N0', label: 'Starting amount N₀ (g, atoms, Bq ...)', ph: 'e.g. 80' },
    { k: 'N', label: 'Amount left N (same unit)', ph: 'e.g. 10' },
    { k: 't', label: 'Time passed t', units: T_UNITS, ph: 'e.g. 15' },
    { k: 'T', label: 'Half-life T', units: T_UNITS, ph: 'e.g. 5' },
  ],
  presets: [
    { name: '80 g, half-life 5 days, after 15 days: find N', find: 'N', vals: { N0: '80', t: ['15', 'days'], T: ['5', 'days'] } },
    { name: 'Half-life 12 h: how long from 800 to 100?', find: 't', vals: { N0: '800', N: '100', T: ['12', 'h'] } },
    { name: '64 mg falls to 4 mg in 20 min: find T', find: 'T', vals: { N0: '64', N: '4', t: ['20', 'min'] } },
    { name: '12.5 left after 3 days, T = 1 day: find N₀', find: 'N0', vals: { N: '12.5', t: ['3', 'days'], T: ['1', 'days'] } },
    { name: 'Carbon-14 (T = 5730 y), 11460 y old: find N', find: 'N', vals: { N0: '100', t: ['11460', 'years'], T: ['5730', 'years'] } },
  ],
  solve: (i, c) => halfLifeSolve(i, c.find),
};
