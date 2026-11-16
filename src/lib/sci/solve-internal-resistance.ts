// "Solve my numbers" for the internal-resistance page: E = V + I r, I = E / (R + r), r from readings, E and r from
// two readings, and maximum power transfer. Plain maths on typed values with units, no DOM.
import { eng as engP, sf, type SSpec, type SIn, type SOut } from '../learn/solvecore-b.ts';

// Ohms and amperes read better plain here (0.5 Ω, 0.5 A) than with prefixes (500 mΩ); volts and watts keep prefixes.
const eng = (x: number, u: string) => (u === 'Ω' || u === 'A' ? `${sf(x)} ${u}` : engP(x, u));
const U = (base: string, ...more: [string, number][]): [string, number][] => [[base, 1], ...more];
const conv = (i: SIn | undefined, base: string, what: string) => (i && !i.blank && i.u !== base && i.typed !== i.v ? [`Convert ${what}: ${sf(i.typed)} ${i.u} = ${sf(i.v, 4)} ${base}`] : []);
const TIP = 'Common mistake: using E as the voltage across the load. E is the voltage with no current flowing; once current flows, the terminal voltage is V = E − I r, which is smaller. The load R and the internal r are in series, so the total resistance is R + r.';

export function internalSolve(i: Record<string, SIn>, c: { find: string; ch: Record<string, string> }): SOut {
  const lines: string[] = [];
  const f = c.find;
  for (const k of ['E', 'V', 'I', 'V1', 'I1', 'V2', 'I2']) { const x = i[k]; if (x && !x.blank && x.v < 0) return { error: 'Use positive numbers here: the direction of the current is shown by an arrow, not a minus sign.' }; }
  for (const k of ['r', 'R']) { const x = i[k]; if (x && !x.blank && x.v < 0) return { error: 'A resistance cannot be negative.' }; }
  for (const [k, nm, b] of [['E', 'the emf', 'V'], ['r', 'the internal resistance', 'Ω'], ['R', 'the load resistance', 'Ω'], ['V', 'the terminal voltage', 'V'], ['I', 'the current', 'A'], ['V1', 'V₁', 'V'], ['I1', 'I₁', 'A'], ['V2', 'V₂', 'V'], ['I2', 'I₂', 'A']] as [string, string, string][]) lines.push(...conv(i[k], b, nm));
  if (f === 'I') {
    const E = i.E.v, r = i.r.v, R = i.R.v;
    if (!(E > 0)) return { error: 'The emf must be above zero.' };
    if (R + r === 0) return { error: 'With R = 0 and r = 0 the current would be unlimited. A real cell always has some internal resistance, so check r.' };
    const I = E / (R + r), V = E - I * r, lost = I * r, P = V * I, eff = V / E;
    lines.push('Formula: I = E ÷ (R + r), then V = E − I r', `I = ${sf(E)} ÷ (${sf(R)} + ${sf(r)}) = ${eng(I, 'A')}`, `V = ${sf(E)} − ${sf(I)} × ${sf(r)} = ${eng(V, 'V')} (also I R = ${eng(I * R, 'V')})`, `Volts lost inside the cell: I r = ${eng(lost, 'V')}`, `Power to the load: P = V I = ${eng(P, 'W')}; efficiency V ÷ E = ${sf(eff * 100)}%`);
    if (R === 0) lines.push('R = 0 is a short circuit: the terminal voltage is 0 and the current is at its largest, E ÷ r.');
    return { answer: `The current is ${eng(I, 'A')} and the terminal voltage is ${eng(V, 'V')}.`, lines, tip: TIP };
  }
  if (f === 'E') {
    const I = i.I.v, R = i.R.v, r = i.r.v;
    const E = I * (R + r);
    lines.push('Formula: E = I (R + r)', `E = ${sf(I)} × (${sf(R)} + ${sf(r)}) = ${eng(E, 'V')}`, `Check: V across the load = I R = ${eng(I * R, 'V')}, volts lost inside = I r = ${eng(I * r, 'V')}`);
    return { answer: `The emf is ${eng(E, 'V')}.`, lines, tip: TIP };
  }
  if (f === 'r') {
    const E = i.E.v, V = i.V.v, byI = c.ch.how !== 'R';
    if (!(E > 0)) return { error: 'The emf must be above zero.' };
    if (V > E) return { error: 'The terminal voltage cannot be bigger than the emf when the cell is supplying current. Check which reading is E (the open-circuit voltage).' };
    let r: number;
    if (byI) {
      const I = i.I.v;
      if (!(I > 0)) return { error: 'The current must be above zero to find r this way (with no current the cell loses no volts).' };
      r = (E - V) / I; lines.push('Formula: E = V + I r, so r = (E − V) ÷ I', `r = (${sf(E)} − ${sf(V)}) ÷ ${sf(I)} = ${eng(r, 'Ω')}`);
    } else {
      const R = i.R.v;
      if (!(V > 0)) return { error: 'The terminal voltage must be above zero (V = 0 means a short circuit, where R = 0).' };
      r = (R * (E - V)) / V; lines.push('Formula: I = V ÷ R and E = V + I r, so r = R (E − V) ÷ V', `r = ${sf(R)} × (${sf(E)} − ${sf(V)}) ÷ ${sf(V)} = ${eng(r, 'Ω')}`);
    }
    return { answer: `The internal resistance is ${eng(r, 'Ω')}.`, lines, tip: TIP };
  }
  if (f === 'two') {
    const V1 = i.V1.v, I1 = i.I1.v, V2 = i.V2.v, I2 = i.I2.v;
    if (I1 === I2) return { error: 'The two currents are the same, so the two readings give no slope. Take the second reading with a different load.' };
    const r = (V1 - V2) / (I2 - I1);
    if (!(r >= 0)) return { error: 'The terminal voltage should fall when the current rises. Check which reading goes with which, or re-read the meters.' };
    const E = V1 + I1 * r;
    lines.push('Two equations: E = V₁ + I₁ r and E = V₂ + I₂ r. Subtract them:', `r = (V₁ − V₂) ÷ (I₂ − I₁) = (${sf(V1)} − ${sf(V2)}) ÷ (${sf(I2)} − ${sf(I1)}) = ${eng(r, 'Ω')}`, `E = V₁ + I₁ r = ${sf(V1)} + ${sf(I1)} × ${sf(r)} = ${eng(E, 'V')}`, 'On a V-I graph this is the straight line: E is where it meets the V axis and r is minus its slope.');
    return { answer: `The emf is ${eng(E, 'V')} and the internal resistance is ${eng(r, 'Ω')}.`, lines, tip: 'With only two readings a small meter error moves the answer a lot. In the lab, take 5 or more readings and use the best straight line (the tool below can fit them).' };
  }
  // Maximum power transfer
  const E = i.E.v, r = i.r.v;
  if (!(E > 0)) return { error: 'The emf must be above zero.' };
  if (!(r > 0)) return { error: 'With r = 0 the cell has no internal loss and the power just keeps rising as R gets smaller. Type the internal resistance.' };
  const P = (E * E) / (4 * r), I = E / (2 * r);
  lines.push('The load gets most power when R = r. Then the current is I = E ÷ (2r) and P = I² R.', `R = r = ${eng(r, 'Ω')}`, `I = ${sf(E)} ÷ (2 × ${sf(r)}) = ${eng(I, 'A')}`, `P max = E² ÷ (4r) = ${sf(E)}² ÷ (4 × ${sf(r)}) = ${eng(P, 'W')}`, 'At this load the cell wastes as much inside as it delivers: efficiency is 50%.');
  return { answer: `The most power, ${eng(P, 'W')}, goes to a load of ${eng(r, 'Ω')} (equal to r).`, lines, tip: 'Maximum power is not maximum efficiency. A bigger load wastes less inside the cell, but delivers less power.' };
}

const show = (...fs: string[]) => (c: { find: string }) => fs.includes(c.find);
export const INTERNAL_SPEC: SSpec = {
  id: 'internal',
  finds: [['I', 'Current and terminal voltage'], ['E', 'Emf E'], ['r', 'Internal resistance r'], ['two', 'E and r from two readings'], ['pmax', 'Maximum power transfer']],
  fields: [
    { k: 'how', kind: 'choice', label: 'You know the', def: 'I', show: show('r'), options: [['I', 'Current I'], ['R', 'Load resistance R']] },
    { k: 'E', label: 'Emf E', units: U('V', ['mV', 1e-3]), show: show('I', 'r', 'pmax'), ph: 'e.g. 1.5' },
    { k: 'r', label: 'Internal resistance r', units: U('Ω', ['mΩ', 1e-3], ['kΩ', 1e3]), show: show('I', 'E', 'pmax'), ph: 'e.g. 0.5' },
    { k: 'R', label: 'Load resistance R', units: U('Ω', ['kΩ', 1e3], ['mΩ', 1e-3]), show: (c) => c.find === 'I' || c.find === 'E' || (c.find === 'r' && c.ch.how === 'R'), ph: 'e.g. 2.5' },
    { k: 'I', label: 'Current I', units: U('A', ['mA', 1e-3]), show: (c) => c.find === 'E' || (c.find === 'r' && c.ch.how !== 'R'), ph: 'e.g. 0.5' },
    { k: 'V', label: 'Terminal voltage V', units: U('V', ['mV', 1e-3]), show: show('r'), ph: 'e.g. 1.25' },
    { k: 'V1', label: 'Reading 1: voltage V₁', units: U('V', ['mV', 1e-3]), show: show('two'), ph: 'e.g. 1.40' },
    { k: 'I1', label: 'Reading 1: current I₁', units: U('A', ['mA', 1e-3]), show: show('two'), ph: 'e.g. 0.20' },
    { k: 'V2', label: 'Reading 2: voltage V₂', units: U('V', ['mV', 1e-3]), show: show('two'), ph: 'e.g. 1.20' },
    { k: 'I2', label: 'Reading 2: current I₂', units: U('A', ['mA', 1e-3]), show: show('two'), ph: 'e.g. 0.60' },
  ],
  presets: [
    { name: 'Cell 1.5 V, r = 0.5 Ω, load 2.5 Ω: find I and V', find: 'I', vals: { E: '1.5', r: '0.5', R: '2.5' } },
    { name: 'Battery of 12 V reads 11.4 V at 2 A: find r', find: 'r', vals: { E: '12', V: '11.4', I: '2' }, ch: { how: 'I' } },
    { name: 'Two readings: 1.40 V at 0.20 A, 1.20 V at 0.60 A', find: 'two', vals: { V1: '1.40', I1: '0.20', V2: '1.20', I2: '0.60' } },
    { name: '12 V supply, r = 2 Ω: load for most power', find: 'pmax', vals: { E: '12', r: '2' } },
    { name: '0.5 A flows through 2.5 Ω with r = 0.5 Ω: find E', find: 'E', vals: { I: '0.5', R: '2.5', r: '0.5' } },
  ],
  solve: (i, c) => internalSolve(i, c),
};
