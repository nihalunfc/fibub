// "Solve my numbers" for the Henry's law page: p = KH x solved for the mole fraction x, the partial pressure p or
// the Henry constant KH, and how much gas dissolves in a litre of water (mol and g). Pressures and KH can be typed in
// bar, atm, kPa, mmHg or kbar. Plain maths, no DOM. Engine: src/lib/learn/solvecore-b.ts.
import { sf, type SSpec, type SIn, type SOut } from '../learn/solvecore-b.ts';
import { GASES, WATER_MOL_PER_L } from './henry.ts';

const PUNITS: [string, number][] = [['bar', 1], ['atm', 1.01325], ['kPa', 0.01], ['mmHg', 0.00133322], ['Pa', 1e-5]];
const KUNITS: [string, number][] = [['kbar', 1000], ['bar', 1], ['atm', 1.01325], ['kPa', 0.01], ['mmHg', 0.00133322]];
const TIP = 'Common mistakes: using a KH and a pressure in different units (convert both to bar first, as this page does), and thinking a big KH means a very soluble gas. It is the other way round: x = p ÷ KH, so a bigger KH means less gas dissolves. Henry\'s law also needs a gas that does not react with the water, and a fairly low pressure.';
const GAS_NAMES: Record<string, string> = { CO2: 'CO₂', O2: 'O₂', N2: 'N₂' };
const par = (x: number, n = 3) => (sf(x, n).includes('×') ? `(${sf(x, n)})` : sf(x, n));
const CODE = (s: string) => s as keyof typeof GASES;

export function henrySolve(i: Record<string, SIn>, c: { find: string; ch: Record<string, string> }): SOut {
  const f = c.find, gasId = c.ch.gas ?? 'custom', known = gasId !== 'custom' ? GASES[CODE(gasId)] : null;
  const lines: string[] = [];
  let KH: number | null = null;
  if (f !== 'KH') {
    KH = known ? known.kh298 : i.KH.v;
    if (!(KH > 0)) return { error: 'KH must be more than 0.' };
    if (known) lines.push(`${GAS_NAMES[gasId]} at 25 °C: KH = ${sf(known.kh298 / 1000)} kbar = ${sf(known.kh298)} bar (a rounded value used on this page; check the official source, or your book, for the value you need).`);
    else if (i.KH.u !== 'bar') lines.push(`Convert KH: ${sf(i.KH.typed)} ${i.KH.u} = ${sf(KH, 4)} bar`);
  }
  const needP = f !== 'p';
  const p = needP ? i.p.v : NaN;
  if (needP && !(p >= 0)) return { error: 'The partial pressure cannot be negative.' };
  if (needP && i.p.u !== 'bar') lines.push(`Convert the pressure: ${sf(i.p.typed)} ${i.p.u} = ${sf(p, 4)} bar`);
  if (f === 'p') {
    const x = i.x.v;
    if (!(x >= 0 && x < 1)) return { error: 'The mole fraction x must be from 0 up to (but not including) 1.' };
    const P = KH! * x;
    lines.push('Formula: p = KH x', `p = ${sf(KH!)} bar × ${par(x)} = ${sf(P)} bar = ${sf(P / 1.01325)} atm = ${sf(P * 100)} kPa`);
    return { answer: `The partial pressure is ${sf(P)} bar (${sf(P / 1.01325)} atm).`, lines, tip: TIP };
  }
  if (f === 'KH') {
    const x = i.x.v;
    if (!(p > 0)) return { error: 'The pressure must be more than 0 to find KH.' };
    if (!(x > 0 && x < 1)) return { error: 'The mole fraction x must be above 0 and below 1.' };
    const K = p / x;
    lines.push('Formula: p = KH x, so KH = p ÷ x', `KH = ${sf(p)} bar ÷ ${par(x)} = ${sf(K)} bar = ${sf(K / 1000)} kbar`);
    return { answer: `KH is ${sf(K / 1000)} kbar (${sf(K)} bar).`, lines, tip: TIP };
  }
  const x = p / KH!;
  if (f === 'x') {
    if (x >= 1) return { error: 'That would put more gas than water in the solution (x of 1 or more). Henry\'s law only works for a dilute solution at a modest pressure. Check the numbers.' };
    lines.push('Formula: p = KH x, so x = p ÷ KH', `x = ${sf(p, 4)} bar ÷ ${sf(KH!, 4)} bar = ${sf(x)}`, `Per litre of water (55.5 mol): about ${sf(x * WATER_MOL_PER_L)} mol of gas.`);
    return { answer: `The mole fraction of the gas in the water is x = ${sf(x)}.`, lines, tip: TIP };
  }
  // sol
  const M = known ? known.M : i.M.v;
  if (!known && !(M > 0)) return { error: 'The molar mass must be more than 0 (in g/mol).' };
  if (x >= 0.1) return { error: 'That much dissolved gas is not a dilute solution, so Henry\'s law (and this shortcut) does not hold. Check the numbers.' };
  const mol = (x / (1 - x)) * WATER_MOL_PER_L, g = mol * M;
  lines.push('Formula: x = p ÷ KH', `x = ${sf(p, 4)} ÷ ${sf(KH!, 4)} = ${sf(x)}`, `Moles in 1 L of water (55.5 mol): n ≈ x ÷ (1 − x) × 55.5 = ${sf(x)} × 55.5 = ${sf(mol)} mol`, `Mass = n × M = ${sf(mol)} mol × ${sf(M)} g/mol = ${sf(g)} g`);
  return { answer: `About ${sf(mol * 1000)} mmol (${sf(g)} g) of gas dissolves in each litre of water.`, lines, tip: TIP };
}

export const HENRY_SPEC: SSpec = {
  id: 'henry',
  finds: [['x', 'Mole fraction x dissolved'], ['sol', 'Gas dissolved in 1 L of water'], ['p', 'Partial pressure p'], ['KH', 'Henry constant KH']],
  fields: [
    { k: 'gas', label: 'Gas (at 25 °C)', kind: 'choice', options: [['custom', 'I will type KH'], ['CO2', 'CO₂ (KH about 1.7 kbar)'], ['O2', 'O₂ (KH about 35 kbar)'], ['N2', 'N₂ (KH about 76 kbar)']], def: 'custom', show: (c) => c.find !== 'KH' },
    { k: 'p', label: 'Partial pressure of the gas p', units: PUNITS, ph: 'e.g. 2.5', show: (c) => c.find !== 'p' },
    { k: 'KH', label: 'Henry constant KH', units: KUNITS, ph: 'e.g. 1.7', show: (c) => c.find !== 'KH' && c.ch.gas === 'custom' },
    { k: 'x', label: 'Mole fraction x', ph: 'e.g. 1.5e-3', show: (c) => c.find === 'p' || c.find === 'KH' },
    { k: 'M', label: 'Molar mass of the gas (g/mol)', ph: 'e.g. 44', show: (c) => c.find === 'sol' && c.ch.gas === 'custom' },
  ],
  presets: [
    { name: 'CO₂ at 2.5 bar in a soda bottle: how much dissolves?', find: 'sol', vals: { p: '2.5' }, ch: { gas: 'CO2' } },
    { name: 'KH = 40 kbar, gas at 0.2 bar: find x', find: 'x', vals: { p: '0.2', KH: ['40', 'kbar'] }, ch: { gas: 'custom' } },
    { name: 'Oxygen at 0.21 atm over water: find x', find: 'x', vals: { p: ['0.21', 'atm'] }, ch: { gas: 'O2' } },
    { name: 'Pressure needed for x = 2 × 10⁻⁴ with KH = 1.7 kbar', find: 'p', vals: { x: '2e-4', KH: ['1.7', 'kbar'] }, ch: { gas: 'custom' } },
    { name: 'Find KH: p = 0.5 bar gives x = 8 × 10⁻⁶', find: 'KH', vals: { p: '0.5', x: '8e-6' } },
  ],
  solve: (i, c) => henrySolve(i, c),
};
