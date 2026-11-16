// "Solve my numbers" for the reaction order graphs: [A] at a time, time to reach a concentration, half-life and k for a
// zero, first or second order reaction (rate = k[A]ⁿ); the order from a table of [A] and t (which of [A], ln[A], 1/[A]
// is a straight line) or from initial rates; and the Arrhenius activation energy or new k from two temperatures.
// Plain maths, no DOM. Engine: src/lib/learn/solvecore-b.ts; formulas: ordergraphs.ts.
import { sf, type SSpec, type SIn, type SOut } from '../learn/solvecore-b.ts';
import { halfLife, r2, R } from './ordergraphs.ts';

type Ctx = { find: string; ch: Record<string, string> };
const N = (c: Ctx) => +(c.ch.order ?? '1') as 0 | 1 | 2;
const TU: Record<string, string> = { s: 's', min: 'min', h: 'h' };
const tu = (c: Ctx) => TU[c.ch.tu ?? 's'];
const kU = (n: number, t: string) => (n === 0 ? `mol L⁻¹ ${t}⁻¹` : n === 1 ? `${t}⁻¹` : `L mol⁻¹ ${t}⁻¹`);
const FORM = ['[A] = [A]₀ − kt', '[A] = [A]₀ e^(−kt), or ln[A] = ln[A]₀ − kt', '1/[A] = 1/[A]₀ + kt'];
const NAME = ['zero', 'first', 'second'];
const TIP = 'Common mistakes: using the wrong integrated law for the order, mixing minutes and seconds (k must use the same time unit as t), and forgetting that the units of k change with the order.';

function stdTail(n: number, A0: number, k: number, t: string): string[] {
  return [`Half-life for this order: ${n === 0 ? 't½ = [A]₀ ÷ 2k' : n === 1 ? 't½ = 0.693 ÷ k' : 't½ = 1 ÷ (k[A]₀)'} = ${sf(halfLife(n as 0 | 1 | 2, A0, k))} ${t}`];
}

function kinetics(i: Record<string, SIn>, c: Ctx): SOut {
  const n = N(c), t = tu(c), find = c.find;
  const A0 = i.A0?.v, A = i.A?.v, k = i.k?.v, tm = i.t?.v;
  for (const [x, nm] of [[A0, '[A]₀'], [A, '[A]'], [k, 'k']] as [number | undefined, string][]) if (x !== undefined && !(x > 0) && !(find === 'conc' && nm === '[A]')) return { error: `${nm} must be more than 0.` };
  if (tm !== undefined && tm < 0) return { error: 'Time cannot be negative.' };
  const f = `Integrated rate law (${NAME[n]} order): ${FORM[n]}`;
  if (find === 'conc') {
    let a: number; const lines = [f];
    if (n === 0) { a = A0 - k * tm; lines.push(`[A] = ${sf(A0)} − ${sf(k)} × ${sf(tm)} = ${sf(a)} mol/L`); if (a <= 0) return { answer: `The reactant is used up by t = ${sf(A0 / k)} ${t} (a zero order reaction ends when [A] reaches 0), so [A] = 0 at ${sf(tm)} ${t}.`, lines: [...lines, `Time to finish = [A]₀ ÷ k = ${sf(A0)} ÷ ${sf(k)} = ${sf(A0 / k)} ${t}`], tip: TIP }; }
    else if (n === 1) { a = A0 * Math.exp(-k * tm); lines.push(`[A] = ${sf(A0)} × e^(−${sf(k)} × ${sf(tm)}) = ${sf(a)} mol/L`); }
    else { a = A0 / (1 + k * A0 * tm); lines.push(`1/[A] = 1/${sf(A0)} + ${sf(k)} × ${sf(tm)}, so [A] = ${sf(a)} mol/L`); }
    lines.push(`Fraction left = ${sf(a / A0, 3)} (${sf((a / A0) * 100, 3)}%)`, ...stdTail(n, A0, k, t));
    return { answer: `After ${sf(tm)} ${t}, [A] = ${sf(a)} mol/L (${sf((a / A0) * 100, 3)}% of the start).`, lines, tip: TIP };
  }
  if (find === 't') {
    if (A > A0) return { error: 'For a reactant, [A] falls with time, so [A] must be less than [A]₀.' };
    const x = n === 0 ? (A0 - A) / k : n === 1 ? Math.log(A0 / A) / k : (1 / A - 1 / A0) / k;
    const lines = [f, n === 0 ? `t = ([A]₀ − [A]) ÷ k = (${sf(A0)} − ${sf(A)}) ÷ ${sf(k)} = ${sf(x)} ${t}` : n === 1 ? `t = ln([A]₀ ÷ [A]) ÷ k = ln(${sf(A0)} ÷ ${sf(A)}) ÷ ${sf(k)} = ${sf(x)} ${t}` : `t = (1/[A] − 1/[A]₀) ÷ k = (1/${sf(A)} − 1/${sf(A0)}) ÷ ${sf(k)} = ${sf(x)} ${t}`, ...stdTail(n, A0, k, t)];
    return { answer: `It takes ${sf(x)} ${t} for [A] to fall from ${sf(A0)} to ${sf(A)} mol/L.`, lines, tip: TIP };
  }
  if (find === 'half') {
    if (n !== 1 && !(A0 > 0)) return { idle: 'Type [A]₀ for this order.' };
    const h = n === 1 ? Math.LN2 / k : halfLife(n as 0 | 1 | 2, A0, k);
    const lines = [n === 0 ? 't½ = [A]₀ ÷ 2k' : n === 1 ? 't½ = ln 2 ÷ k = 0.693 ÷ k (it does not depend on [A]₀)' : 't½ = 1 ÷ (k[A]₀)', `t½ = ${n === 0 ? `${sf(A0)} ÷ (2 × ${sf(k)})` : n === 1 ? `0.693 ÷ ${sf(k)}` : `1 ÷ (${sf(k)} × ${sf(A0)})`} = ${sf(h)} ${t}`];
    return { answer: `The half-life is ${sf(h)} ${t}.`, lines, tip: TIP };
  }
  // find k from [A]0, [A] and t
  if (A > A0) return { error: 'For a reactant, [A] falls with time, so [A] must be less than [A]₀.' };
  if (!(tm > 0)) return { error: 'The time must be more than 0.' };
  const kk = n === 0 ? (A0 - A) / tm : n === 1 ? Math.log(A0 / A) / tm : (1 / A - 1 / A0) / tm;
  if (!(kk > 0)) return { error: '[A] has not changed, so k is 0. Check the two concentrations.' };
  const lines = [f, n === 0 ? `k = ([A]₀ − [A]) ÷ t = (${sf(A0)} − ${sf(A)}) ÷ ${sf(tm)} = ${sf(kk)} ${kU(0, t)}` : n === 1 ? `k = ln([A]₀ ÷ [A]) ÷ t = ln(${sf(A0)} ÷ ${sf(A)}) ÷ ${sf(tm)} = ${sf(kk)} ${kU(1, t)}` : `k = (1/[A] − 1/[A]₀) ÷ t = (1/${sf(A)} − 1/${sf(A0)}) ÷ ${sf(tm)} = ${sf(kk)} ${kU(2, t)}`, ...stdTail(n, A0, kk, t)];
  return { answer: `k = ${sf(kk)} ${kU(n, t)}.`, lines, tip: TIP };
}

function slope(x: number[], y: number[]) {
  const m = x.length, mx = x.reduce((a, b) => a + b, 0) / m, my = y.reduce((a, b) => a + b, 0) / m;
  let sxy = 0, sxx = 0; for (let j = 0; j < m; j++) { sxy += (x[j] - mx) * (y[j] - my); sxx += (x[j] - mx) ** 2; }
  return sxy / sxx;
}
function fromData(i: Record<string, SIn>, c: Ctx): SOut {
  const t = i.tl.list, A = i.Al.list, u = tu(c);
  if (t.length !== A.length) return { error: `You typed ${t.length} times but ${A.length} concentrations. They must pair up one to one.` };
  if (t.length < 3) return { error: 'Type at least 3 readings (times with their concentrations).' };
  if (A.some((x) => !(x > 0))) return { error: 'Every concentration must be more than 0 (ln and 1/[A] need that).' };
  if (new Set(t).size < 2) return { error: 'The times must not all be the same.' };
  const ys = [A, A.map(Math.log), A.map((x) => 1 / x)], names = ['[A] against t', 'ln[A] against t', '1/[A] against t'];
  const r = ys.map((y) => r2(t, y)), best = r.indexOf(Math.max(...r));
  const lines = r.map((x, j) => `${names[j]}: R² = ${x.toFixed(4)}${j === best ? '  ← straightest' : ''}`);
  if (r[best] < 0.98) return { answer: `None of the three graphs is clearly straight (best R² = ${r[best].toFixed(3)}), so the data do not fit a simple zero, first or second order.`, lines, tip: 'Check for a typing slip, or the reaction may be more complex (two reactants, or a mix of orders). For a statistical fit with uncertainties use the reaction kinetics fitter.' };
  const sl = slope(t, ys[best]), k = Math.abs(sl);
  lines.push(`Slope of the straight line = ${sf(sl)} so k = ${best === 2 ? 'slope' : '−slope'} = ${sf(k)} ${kU(best, u)}`);
  lines.push(...stdTail(best, A[0], k, u).map((x) => x.replace('[A]₀', `[A]₀ (first reading, ${sf(A[0])})`)));
  return { answer: `It is ${NAME[best]} order: ${names[best]} is the straight line (R² = ${r[best].toFixed(4)}), with k = ${sf(k)} ${kU(best, u)}.`, lines, tip: 'Only one of [A], ln[A] and 1/[A] against time is straight. The slope is −k for zero and first order, and +k for second order.' };
}

function initial(i: Record<string, SIn>): SOut {
  const { c1, r1, c2, r2: rr2 } = i;
  if (![c1, r1, c2, rr2].every((x) => x.v > 0)) return { error: 'Concentrations and rates must all be more than 0.' };
  if (c1.v === c2.v) return { error: 'The two concentrations must be different (change only this reactant between the two experiments).' };
  const x = Math.log(rr2.v / r1.v) / Math.log(c2.v / c1.v);
  const lines = [`Rate = k[A]ⁿ, so rate₂ ÷ rate₁ = ([A]₂ ÷ [A]₁)ⁿ`, `${sf(rr2.v)} ÷ ${sf(r1.v)} = (${sf(c2.v)} ÷ ${sf(c1.v)})ⁿ`, `n = ln(${sf(rr2.v / r1.v)}) ÷ ln(${sf(c2.v / c1.v)}) = ${sf(x, 3)}`];
  const rounded = Math.round(x * 2) / 2, near = Math.abs(x - rounded) < 0.08;
  return { answer: near ? `The order with respect to this reactant is ${rounded} (calculated ${sf(x, 3)}).` : `The order comes out as ${sf(x, 3)}, which is not a neat number. Check the readings.`, lines, tip: 'Keep every other concentration the same between the two experiments. Doubling [A] and doubling the rate means order 1; doubling [A] and quadrupling the rate means order 2; no change in rate means order 0.' };
}

const K = (c: Ctx, v: number) => (c.ch.tk === 'c' ? v + 273.15 : v);
function arr(i: Record<string, SIn>, c: Ctx): SOut {
  const T1 = K(c, i.T1.typed), T2 = K(c, i.T2.typed), k1 = i.k1.v;
  if (!(T1 > 0 && T2 > 0)) return { error: 'The temperature must be above absolute zero (0 K = −273.15 °C).' };
  if (T1 === T2) return { error: 'The two temperatures must be different.' };
  if (!(k1 > 0)) return { error: 'k must be more than 0.' };
  const tl = c.ch.tk === 'c' ? ` (${sf(i.T1.typed)} °C = ${sf(T1, 5)} K, ${sf(i.T2.typed)} °C = ${sf(T2, 5)} K)` : '';
  if (c.find === 'Ea') {
    const k2 = i.k2.v; if (!(k2 > 0)) return { error: 'k must be more than 0.' };
    if (k2 === k1) return { error: 'The two rate constants are equal, which would make Ea 0. Check the numbers.' };
    const Ea = (R * Math.log(k2 / k1)) / (1 / T1 - 1 / T2) / 1000;
    if (Ea < 0) return { error: 'This gives a negative activation energy: the rate constant should rise with temperature. Check which k goes with which T.' };
    return { answer: `The activation energy is ${sf(Ea)} kJ/mol.`, lines: [`Arrhenius: ln(k₂/k₁) = (Ea/R)(1/T₁ − 1/T₂)${tl}`, `Ea = R ln(k₂/k₁) ÷ (1/T₁ − 1/T₂) = 8.314 × ln(${sf(k2 / k1)}) ÷ (1/${sf(T1, 5)} − 1/${sf(T2, 5)})`, `Ea = ${sf(Ea * 1000)} J/mol = ${sf(Ea)} kJ/mol`], tip: 'Common mistakes: using °C instead of kelvin, and leaving Ea in J/mol when the question wants kJ/mol.' };
  }
  const Ea = i.Ea.v;
  const ratio = Math.exp(((Ea * 1000) / R) * (1 / T1 - 1 / T2)), k2 = k1 * ratio;
  return { answer: `At the new temperature k = ${sf(k2)} (${sf(ratio)} times the old value).`, lines: [`Arrhenius: ln(k₂/k₁) = (Ea/R)(1/T₁ − 1/T₂)${tl}`, `ln(k₂/k₁) = (${sf(Ea * 1000)} ÷ 8.314) × (1/${sf(T1, 5)} − 1/${sf(T2, 5)}) = ${sf(Math.log(ratio))}`, `k₂ = ${sf(k1)} × ${sf(ratio)} = ${sf(k2)} (same units as k₁)`], tip: 'A rise of 10 °C roughly doubles or triples k for many reactions, which is a quick way to check your answer.' };
}

const isK = (c: Ctx) => ['conc', 't', 'half', 'k'].includes(c.find);
export const ORDER_SPEC: SSpec = {
  id: 'order',
  finds: [['conc', '[A] after a time'], ['t', 'Time to reach [A]'], ['half', 'Half-life'], ['k', 'Rate constant k'], ['order', 'Order from a table of data'], ['init', 'Order from initial rates'], ['Ea', 'Activation energy'], ['k2', 'k at a new temperature']],
  fields: [
    { k: 'order', kind: 'choice', label: 'Order of reaction', def: '1', show: isK, options: [['0', 'Zero order'], ['1', 'First order'], ['2', 'Second order']] },
    { k: 'tu', kind: 'choice', label: 'Time unit', def: 's', show: (c) => isK(c) || c.find === 'order', options: [['s', 'seconds'], ['min', 'minutes'], ['h', 'hours']] },
    { k: 'A0', label: 'Starting [A]₀', units: [['mol/L', 1], ['mmol/L', 1e-3]], show: (c) => isK(c) && !(c.find === 'half' && c.ch.order === '1'), ph: 'e.g. 0.50' },
    { k: 'A', label: 'Concentration [A] now', units: [['mol/L', 1], ['mmol/L', 1e-3]], show: (c) => c.find === 't' || c.find === 'k', ph: 'e.g. 0.125' },
    { k: 'k', label: 'k (in the time unit chosen above)', show: (c) => c.find === 'conc' || c.find === 't' || c.find === 'half', ph: 'e.g. 0.0231' },
    { k: 't', label: 'Time t (in the unit chosen above)', show: (c) => c.find === 'conc' || c.find === 'k', ph: 'e.g. 60' },
    { k: 'tl', label: 'Times, separated by spaces or commas', kind: 'list', show: (c) => c.find === 'order', ph: '0 10 20 30 40' },
    { k: 'Al', label: 'Concentrations [A] in mol/L, same order', kind: 'list', show: (c) => c.find === 'order', ph: '1.00 0.61 0.37 0.22 0.14' },
    { k: 'c1', label: 'Experiment 1: concentration', show: (c) => c.find === 'init', ph: 'e.g. 0.10' },
    { k: 'r1', label: 'Experiment 1: rate', show: (c) => c.find === 'init', ph: 'e.g. 2.0e-3' },
    { k: 'c2', label: 'Experiment 2: concentration', show: (c) => c.find === 'init', ph: 'e.g. 0.20' },
    { k: 'r2', label: 'Experiment 2: rate', show: (c) => c.find === 'init', ph: 'e.g. 8.0e-3' },
    { k: 'tk', kind: 'choice', label: 'Temperatures given in', def: 'k', show: (c) => c.find === 'Ea' || c.find === 'k2', options: [['k', 'kelvin (K)'], ['c', 'degrees Celsius (°C)']] },
    { k: 'k1', label: 'k₁ at the first temperature', show: (c) => c.find === 'Ea' || c.find === 'k2', ph: 'e.g. 1.5e-3' },
    { k: 'T1', label: 'First temperature T₁', neg: true, show: (c) => c.find === 'Ea' || c.find === 'k2', ph: 'e.g. 300' },
    { k: 'k2', label: 'k₂ at the second temperature', show: (c) => c.find === 'Ea', ph: 'e.g. 3.0e-3' },
    { k: 'T2', label: 'Second temperature T₂', neg: true, show: (c) => c.find === 'Ea' || c.find === 'k2', ph: 'e.g. 310' },
    { k: 'Ea', label: 'Activation energy Ea', units: [['kJ/mol', 1], ['J/mol', 1e-3]], show: (c) => c.find === 'k2', ph: 'e.g. 50' },
  ],
  presets: [
    { name: 'First order, [A]₀ 0.80, k 0.0231 per min: [A] after 60 min', find: 'conc', vals: { A0: '0.80', k: '0.0231', t: '60' }, ch: { order: '1', tu: 'min' } },
    { name: 'Second order: time for [A] to fall from 0.50 to 0.10 (k 0.020)', find: 't', vals: { A0: '0.50', A: '0.10', k: '0.020' }, ch: { order: '2', tu: 's' } },
    { name: 'Zero order: half-life with [A]₀ 0.40 and k 0.0050', find: 'half', vals: { A0: '0.40', k: '0.0050' }, ch: { order: '0', tu: 's' } },
    { name: 'First order: [A] falls from 0.40 to 0.10 in 40 min, find k', find: 'k', vals: { A0: '0.40', A: '0.10', t: '40' }, ch: { order: '1', tu: 'min' } },
    { name: 'Which order? [A] at 0, 10, 20, 30, 40 s', find: 'order', vals: { tl: '0 10 20 30 40', Al: '1.000 0.607 0.368 0.223 0.135' }, ch: { tu: 's' } },
    { name: 'Doubling [A] quadruples the rate', find: 'init', vals: { c1: '0.10', r1: '2.0e-3', c2: '0.20', r2: '8.0e-3' } },
    { name: 'Ea from k = 1.5e-3 at 300 K and 3.0e-3 at 310 K', find: 'Ea', vals: { k1: '1.5e-3', T1: '300', k2: '3.0e-3', T2: '310' }, ch: { tk: 'k' } },
    { name: 'k at 35 °C if Ea = 50 kJ/mol and k = 2.0e-3 at 25 °C', find: 'k2', vals: { k1: '2.0e-3', T1: '25', T2: '35', Ea: '50' }, ch: { tk: 'c' } },
  ],
  solve: (i, c) => (isK(c) ? kinetics(i, c) : c.find === 'order' ? fromData(i, c) : c.find === 'init' ? initial(i) : arr(i, c)),
};
