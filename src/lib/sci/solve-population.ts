// "Solve my numbers" for the population growth tool: size after a time, growth rate r from two sizes, doubling time, time to
// reach a size and dN/dt for exponential and logistic growth, and the school birth/death/immigration/emigration count
// N(t+1) = N + (B + I) − (D + E). Plain maths, no DOM. Engine: src/lib/learn/solvecore-b.ts; formulas: pop-growth-r.ts.
import { sf, type SSpec, type SIn, type SOut } from '../learn/solvecore-b.ts';
import { expN, logN, logTimeTo, logRate } from './pop-growth-r.ts';

type Ctx = { find: string; ch: Record<string, string> };
const TIP = 'Common mistakes: using r as a percentage (5% is r = 0.05), mixing time units (r per year needs t in years), and using the exponential formula once the population is close to the carrying capacity K.';

export function pop(i: Record<string, SIn>, c: Ctx): SOut {
  const f = c.find, logi = (c.ch.model ?? 'exp') === 'log';
  const N0 = i.N0?.v, N = i.N?.v, r = i.r?.v, K = i.K?.v, t = i.t?.v;
  if (f === 'bd') {
    const B = i.B.v, D = i.D.v, I = i.I && !i.I.blank ? i.I.v : 0, E = i.E && !i.E.blank ? i.E.v : 0;
    if (!(N0 >= 0) || [B, D, I, E].some((x) => !(x >= 0))) return { error: 'Counts cannot be negative.' };
    const Nn = N0 + (B + I) - (D + E), net = Nn - N0;
    if (Nn < 0) return { error: `That would leave ${sf(Nn)} individuals: more are leaving or dying than exist. Check D and E.` };
    const lines = ['Formula: N(t+1) = N(t) + [(B + I) − (D + E)]', `N(t+1) = ${sf(N0)} + [(${sf(B)} + ${sf(I)}) − (${sf(D)} + ${sf(E)})] = ${sf(N0)} + ${sf(net)} = ${sf(Nn)}`];
    if (N0 > 0) lines.push(`Growth from births and deaths alone: r = (B − D) ÷ N = (${sf(B)} − ${sf(D)}) ÷ ${sf(N0)} = ${sf((B - D) / N0)} per unit time`, `Overall change = ${sf((net / N0) * 100)}% of the starting population`);
    return { answer: `The population becomes ${sf(Nn)} (a change of ${net >= 0 ? '+' : ''}${sf(net)}).`, lines, tip: 'Natality (B) and immigration (I) add to the population; mortality (D) and emigration (E) take away from it. Count all four.' };
  }
  if (f === 'td') {
    if (r === 0) return { error: 'With r = 0 the population does not change, so there is no doubling time.' };
    if (r > 0) return { answer: `The doubling time is ${sf(Math.LN2 / r)} (in the time unit of r).`, lines: ['Exponential growth: N = N₀ e^(rt). Doubling when e^(rt) = 2.', `t = ln 2 ÷ r = 0.693 ÷ ${sf(r)} = ${sf(Math.LN2 / r)}`], tip: TIP };
    return { answer: `r is negative, so the population shrinks. It halves every ${sf(Math.LN2 / -r)} time units.`, lines: [`Halving time = ln 2 ÷ |r| = 0.693 ÷ ${sf(-r)} = ${sf(Math.LN2 / -r)}`], tip: TIP };
  }
  if (logi && !(K > 0)) return { error: 'The carrying capacity K must be more than 0.' };
  if (f === 'N') {
    if (!(N0 >= 0)) return { error: 'The starting size cannot be negative.' };
    if (!(t >= 0)) return { error: 'Time cannot be negative.' };
    const x = logi ? logN(N0, r, K, t) : expN(N0, r, t);
    const lines = logi ? ['Logistic growth: N = K ÷ (1 + ((K − N₀) ÷ N₀) e^(−rt))', `N = ${sf(K)} ÷ (1 + ((${sf(K)} − ${sf(N0)}) ÷ ${sf(N0)}) × e^(−${sf(r)} × ${sf(t)})) = ${sf(x)}`, `The curve levels off at K = ${sf(K)}; this is ${sf((x / K) * 100)}% of K.`] : ['Exponential growth: N = N₀ e^(rt)', `N = ${sf(N0)} × e^(${sf(r)} × ${sf(t)}) = ${sf(x)}`];
    return { answer: `After ${sf(t)} time units the population is about ${sf(x)}.`, lines, tip: TIP };
  }
  if (f === 'r') {
    if (!(N0 > 0 && N > 0)) return { error: 'Both sizes must be more than 0.' };
    if (!(t > 0)) return { error: 'The time must be more than 0.' };
    if (logi) {
      if (!(K > Math.max(N0, N))) return { error: 'For logistic growth both sizes must be below K.' };
      const x = Math.log((N * (K - N0)) / (N0 * (K - N))) / t;
      return { answer: `r = ${sf(x)} per unit time.`, lines: ['From N = K ÷ (1 + ((K − N₀) ÷ N₀) e^(−rt)): r = ln[N(K − N₀) ÷ (N₀(K − N))] ÷ t', `r = ln[${sf(N)} × ${sf(K - N0)} ÷ (${sf(N0)} × ${sf(K - N)})] ÷ ${sf(t)} = ${sf(x)}`], tip: TIP };
    }
    const x = Math.log(N / N0) / t;
    return { answer: `r = ${sf(x)} per unit time${x < 0 ? ' (negative: the population is shrinking)' : ''}.`, lines: ['From N = N₀ e^(rt): r = ln(N ÷ N₀) ÷ t', `r = ln(${sf(N)} ÷ ${sf(N0)}) ÷ ${sf(t)} = ${sf(x)}`], tip: TIP };
  }
  if (f === 'time') {
    if (!(N0 > 0 && N > 0)) return { error: 'Both sizes must be more than 0.' };
    if (r === 0) return { error: 'With r = 0 the population never changes.' };
    if (logi) {
      if (!(K > Math.max(N0, N)) || N0 >= K) return { error: 'For logistic growth both sizes must be below K (the curve never reaches K itself).' };
      if (r < 0) return { error: 'For logistic growth r must be positive.' };
      if (N <= N0) return { error: 'The target must be bigger than the starting size.' };
      const x = logTimeTo(N0, r, K, N);
      return { answer: `It takes about ${sf(x)} time units to reach ${sf(N)}.`, lines: ['Logistic: t = ln[N(K − N₀) ÷ (N₀(K − N))] ÷ r', `t = ln[${sf(N)} × ${sf(K - N0)} ÷ (${sf(N0)} × ${sf(K - N)})] ÷ ${sf(r)} = ${sf(x)}`], tip: TIP };
    }
    const x = Math.log(N / N0) / r;
    if (x < 0) return { error: `With r = ${sf(r)} the population ${r > 0 ? 'only grows' : 'only shrinks'}, so it never reaches ${sf(N)} from ${sf(N0)}.` };
    return { answer: `It takes ${sf(x)} time units to reach ${sf(N)}.`, lines: ['Exponential: t = ln(N ÷ N₀) ÷ r', `t = ln(${sf(N)} ÷ ${sf(N0)}) ÷ ${sf(r)} = ${sf(x)}`], tip: TIP };
  }
  // rate: dN/dt at size N
  if (!(N >= 0)) return { error: 'The size cannot be negative.' };
  if (!logi) return { answer: `The population is growing by ${sf(r * N)} individuals per unit time.`, lines: ['Exponential: dN/dt = rN', `dN/dt = ${sf(r)} × ${sf(N)} = ${sf(r * N)}`], tip: TIP };
  const x = logRate(r, K, N);
  return { answer: `The population is changing by ${sf(x)} individuals per unit time at N = ${sf(N)}.`, lines: ['Logistic: dN/dt = rN(1 − N/K)', `dN/dt = ${sf(r)} × ${sf(N)} × (1 − ${sf(N)} ÷ ${sf(K)}) = ${sf(x)}`, `The fastest growth is at N = K/2 = ${sf(K / 2)}, where dN/dt = rK/4 = ${sf((r * K) / 4)}.`, ...(N > K ? ['N is above K, so dN/dt is negative: the population falls back towards K.'] : [])], tip: TIP };
}

const MOD = (c: Ctx) => ['N', 'r', 'time', 'rate'].includes(c.find);
export const POP_SPEC: SSpec = {
  id: 'pop',
  finds: [['N', 'Size after a time'], ['r', 'Growth rate r'], ['td', 'Doubling time'], ['time', 'Time to reach a size'], ['rate', 'Growth per unit time (dN/dt)'], ['bd', 'Births, deaths, immigration, emigration']],
  fields: [
    { k: 'model', kind: 'choice', label: 'Growth model', def: 'exp', show: MOD, options: [['exp', 'Exponential (J-shaped)'], ['log', 'Logistic (S-shaped, with K)']] },
    { k: 'N0', label: 'Starting size N₀', show: (c) => ['N', 'r', 'time', 'bd'].includes(c.find), ph: 'e.g. 100' },
    { k: 'N', label: 'Size N', show: (c) => ['r', 'time', 'rate'].includes(c.find), ph: 'e.g. 1000' },
    { k: 'r', label: 'Growth rate r per unit time (negative if shrinking)', neg: true, show: (c) => ['N', 'time', 'rate', 'td'].includes(c.find), ph: 'e.g. 0.25' },
    { k: 'K', label: 'Carrying capacity K', show: (c) => MOD(c) && c.ch.model === 'log', ph: 'e.g. 1000' },
    { k: 't', label: 'Time t (same unit as r)', show: (c) => c.find === 'N' || c.find === 'r', ph: 'e.g. 10' },
    { k: 'B', label: 'Births B', show: (c) => c.find === 'bd', ph: 'e.g. 120' },
    { k: 'D', label: 'Deaths D', show: (c) => c.find === 'bd', ph: 'e.g. 80' },
    { k: 'I', label: 'Immigrants I (blank for 0)', optional: true, show: (c) => c.find === 'bd', ph: 'e.g. 20' },
    { k: 'E', label: 'Emigrants E (blank for 0)', optional: true, show: (c) => c.find === 'bd', ph: 'e.g. 35' },
  ],
  presets: [
    { name: 'Exponential: 100 bacteria, r 0.25 per hour, 10 hours', find: 'N', vals: { N0: '100', r: '0.25', t: '10' }, ch: { model: 'exp' } },
    { name: 'Logistic: 50 deer, r 0.5, K 1000, after 10 years', find: 'N', vals: { N0: '50', r: '0.5', K: '1000', t: '10' }, ch: { model: 'log' } },
    { name: 'r when 200 becomes 800 in 5 years', find: 'r', vals: { N0: '200', N: '800', t: '5' }, ch: { model: 'exp' } },
    { name: 'Doubling time when r = 0.035', find: 'td', vals: { r: '0.035' } },
    { name: 'Time for 500 to reach 5000 at r = 0.1', find: 'time', vals: { N0: '500', N: '5000', r: '0.1' }, ch: { model: 'exp' } },
    { name: 'Logistic dN/dt at N = 500, K = 1000, r = 0.4', find: 'rate', vals: { N: '500', r: '0.4', K: '1000' }, ch: { model: 'log' } },
    { name: 'Population 1000: B 120, D 80, I 20, E 35', find: 'bd', vals: { N0: '1000', B: '120', D: '80', I: '20', E: '35' } },
  ],
  solve: (i, c) => pop(i, c),
};
