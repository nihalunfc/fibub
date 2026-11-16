// "Solve my numbers" for the series and parallel tool: the total of any number of resistors in series or parallel
// with the working, the voltage and current in each one when a battery is given, and a missing resistor from a total.
// Plain maths, no DOM. Engine: src/lib/learn/solvecore-b.ts.
import { eng, sf, type SSpec, type SIn, type SOut } from '../learn/solvecore-b.ts';

const names = (n: number) => Array.from({ length: n }, (_, k) => `R${k + 1}`);
const join = (xs: (string | number)[], sep: string) => xs.join(sep);

export function sp(i: Record<string, SIn>, c: { find: string; ch: Record<string, string> }): SOut {
  const par = c.ch.how === 'par', Rs = i.Rs.list, typed = i.Rs.typedList, u = i.Rs.u;
  if (Rs.length < 1) return { idle: 'Type at least one resistance.' } as SOut;
  if (Rs.some((x) => !(x > 0))) return { error: 'Every resistance must be above 0 Ω. (A plain wire of 0 Ω in parallel would short out the rest, and a negative resistance is not possible.)' };
  const n = Rs.length, nm = names(n), lines: string[] = [];
  if (u !== 'Ω') lines.push(`Convert to ohms: ${typed.map((x) => sf(x)).join(', ')} ${u} = ${Rs.map((x) => sf(x, 4)).join(', ')} Ω`);
  if (c.find === 'miss') {
    const RT = i.RT.v;
    if (!(RT > 0)) return { error: 'The total resistance must be above 0 Ω.' };
    if (!par) {
      const known = Rs.reduce((s, x) => s + x, 0), x = RT - known;
      lines.push('Series: R_total = R1 + R2 + ... so the missing one is R_total − (the others)', `R = ${sf(RT)} − (${join(Rs.map((r) => sf(r)), ' + ')}) = ${sf(RT)} − ${sf(known)} = ${sf(x)} Ω`);
      if (!(x > 0)) return { error: `The known resistors already add up to ${sf(known)} Ω, which is not less than the total ${sf(RT)} Ω. In series the total must be bigger than every part, so check the numbers.` };
      return { answer: `The missing resistor is ${eng(x, 'Ω')}.`, lines, tip: 'Common mistake: using the parallel formula for a series circuit. In series resistances simply add.' };
    }
    const inv = 1 / RT - Rs.reduce((s, r) => s + 1 / r, 0);
    lines.push('Parallel: 1/R_total = 1/R1 + 1/R2 + ..., so 1/R = 1/R_total − (the others)', `1/R = 1/${sf(RT)} − (${join(Rs.map((r) => `1/${sf(r)}`), ' + ')}) = ${sf(inv, 4)} per Ω`);
    if (!(inv > 1e-12)) return { error: `In parallel the total (${sf(RT)} Ω) must be smaller than every resistor, but the known ones already give ${sf(1 / Rs.reduce((s, r) => s + 1 / r, 0))} Ω or less. Check the numbers.` };
    const x = 1 / inv; lines.push(`R = 1 ÷ ${sf(inv, 4)} = ${sf(x)} Ω`);
    return { answer: `The missing resistor is ${eng(x, 'Ω')}.`, lines, tip: 'Common mistake: forgetting the final flip. You find 1/R first, then turn it upside down to get R.' };
  }
  let Rt: number;
  if (!par) {
    Rt = Rs.reduce((s, x) => s + x, 0);
    lines.push('Series: the same current flows through all, so the resistances add: R = R1 + R2 + ...', n > 1 ? `R = ${join(Rs.map((r) => sf(r)), ' + ')} = ${sf(Rt)} Ω` : `Only one resistor: R = ${sf(Rt)} Ω`);
  } else {
    const inv = Rs.reduce((s, x) => s + 1 / x, 0); Rt = 1 / inv;
    lines.push('Parallel: every branch has the same voltage, so the conductances add: 1/R = 1/R1 + 1/R2 + ...', n > 1 ? `1/R = ${join(Rs.map((r) => `1/${sf(r)}`), ' + ')} = ${sf(inv, 4)} per Ω, so R = 1 ÷ ${sf(inv, 4)} = ${sf(Rt)} Ω` : `Only one resistor: R = ${sf(Rt)} Ω`);
    if (n === 2) lines.push(`Two-resistor shortcut: R = (R1 × R2) ÷ (R1 + R2) = ${sf(Rs[0] * Rs[1])} ÷ ${sf(Rs[0] + Rs[1])} = ${sf(Rt)} Ω`);
  }
  if (n > 1) lines.push(par ? `Check: ${sf(Rt)} Ω is smaller than the smallest resistor (${sf(Math.min(...Rs))} Ω), as it must be in parallel.` : `Check: ${sf(Rt)} Ω is bigger than the biggest resistor (${sf(Math.max(...Rs))} Ω), as it must be in series.`);
  const V = i.V;
  if (V && !V.blank) {
    if (!(V.v > 0)) return { error: 'The battery voltage must be above 0 V.' };
    const I = V.v / Rt;
    lines.push(`Current from the battery: I = V / R = ${sf(V.v)} ÷ ${sf(Rt)} = ${eng(I, 'A')}`);
    if (par) { const parts = Rs.map((r, k) => `${nm[k]}: ${eng(V.v / r, 'A')}`); lines.push(`Each branch has the full ${sf(V.v)} V, so I = V / R in each: ${parts.join(', ')} (they add up to ${eng(I, 'A')})`); }
    else { const parts = Rs.map((r, k) => `${nm[k]}: ${eng(I * r, 'V')}`); lines.push(`The same ${eng(I, 'A')} flows in each, so V = I R: ${parts.join(', ')} (they add up to ${sf(V.v)} V)`); }
    lines.push(`Power: P = V I = ${sf(V.v)} × ${sf(I)} = ${eng(V.v * I, 'W')}`);
  }
  return { answer: `The total resistance is ${eng(Rt, 'Ω')}${V && !V.blank ? `, and the battery current is ${eng(V.v / Rt, 'A')}` : ''}.`, lines, tip: par ? 'Common mistake: adding the resistances in parallel. They add only in series; in parallel the total is always less than the smallest one.' : 'Common mistake: using 1/R in series. In series just add the resistances.' };
}

export const SP_SPEC: SSpec = {
  id: 'sp',
  finds: [['total', 'The total resistance'], ['miss', 'A missing resistor']],
  fields: [
    { k: 'how', kind: 'choice', label: 'Joined in', def: 'ser', options: [['ser', 'Series (one after another)'], ['par', 'Parallel (side by side)']] },
    { k: 'Rs', kind: 'list', label: 'Resistances (separate with commas)', units: [['Ω', 1], ['kΩ', 1e3], ['MΩ', 1e6]], ph: 'e.g. 4.7, 10, 22' },
    { k: 'RT', label: 'Total resistance (given)', units: [['Ω', 1], ['kΩ', 1e3], ['MΩ', 1e6]], show: (c) => c.find === 'miss', ph: 'e.g. 2' },
    { k: 'V', label: 'Battery voltage (optional)', units: [['V', 1], ['mV', 1e-3], ['kV', 1e3]], optional: true, show: (c) => c.find === 'total', ph: 'optional' },
  ],
  presets: [
    { name: 'Three resistors in series: 4.7, 10, 22 Ω', find: 'total', vals: { Rs: '4.7, 10, 22' }, ch: { how: 'ser' } },
    { name: '6 Ω and 3 Ω in parallel', find: 'total', vals: { Rs: '6, 3' }, ch: { how: 'par' } },
    { name: 'Three in parallel on 12 V: 10, 15, 30 Ω', find: 'total', vals: { Rs: '10, 15, 30', V: '12' }, ch: { how: 'par' } },
    { name: '1 kΩ and 2.2 kΩ in series on 9 V', find: 'total', vals: { Rs: ['1, 2.2', 'kΩ'], V: '9' }, ch: { how: 'ser' } },
    { name: 'A 6 Ω in parallel with R gives 2 Ω: find R', find: 'miss', vals: { Rs: '6', RT: '2' }, ch: { how: 'par' } },
    { name: 'Total 100 Ω with 33 Ω in series: find the other', find: 'miss', vals: { Rs: '33', RT: '100' }, ch: { how: 'ser' } },
  ],
  solve: (i, c) => sp(i, c),
};
