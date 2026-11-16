// "Solve my numbers" for the capacitor network page: equivalent capacitance of series, parallel and mixed groups of
// two or three capacitors, an unknown capacitor from the total, and (with a battery) the charge, voltage and energy
// on each. Plain maths on typed values with units, no DOM. Engine: src/lib/learn/solvecore-b.ts.
import { eng, sf, type SSpec, type SIn, type SOut } from '../learn/solvecore-b.ts';

const CAP: [string, number][] = [['µF', 1e-6], ['nF', 1e-9], ['pF', 1e-12], ['mF', 1e-3], ['F', 1]];
const ser = (xs: number[]) => 1 / xs.reduce((s, x) => s + 1 / x, 0);
const par = (xs: number[]) => xs.reduce((s, x) => s + x, 0);

const NAMES: Record<string, string> = {
  series: 'in series', parallel: 'in parallel', sp: 'C₁ in series with (C₂ in parallel with C₃)', ps: 'C₁ in parallel with (C₂ in series with C₃)',
};

/** The total of an arrangement. C3 is undefined for a two-capacitor series or parallel group. */
export function total(how: string, C1: number, C2: number, C3?: number): number {
  const three = C3 !== undefined;
  if (how === 'series') return ser(three ? [C1, C2, C3] : [C1, C2]);
  if (how === 'parallel') return par(three ? [C1, C2, C3] : [C1, C2]);
  if (how === 'sp') return ser([C1, C2 + (C3 ?? 0)]);
  return C1 + ser([C2, C3 ?? Infinity]);
}
/** The unknown C1 that gives a known total, or NaN if no positive capacitor can do it. */
export function unknownC1(how: string, Ct: number, C2: number, C3?: number): number {
  const three = C3 !== undefined;
  if (how === 'series') { const g = 1 / Ct - 1 / C2 - (three ? 1 / C3! : 0); return g > 1e-15 / Ct ? 1 / g : NaN; }
  if (how === 'parallel') { const x = Ct - C2 - (three ? C3! : 0); return x > 0 ? x : NaN; }
  if (how === 'sp') { const g = 1 / Ct - 1 / (C2 + C3!); return g > 1e-15 / Ct ? 1 / g : NaN; }
  const x = Ct - ser([C2, C3!]); return x > 0 ? x : NaN;
}

export function capSolve(i: Record<string, SIn>, c: { find: string; ch: Record<string, string> }): SOut {
  const how = c.ch.how ?? 'series', lines: string[] = [];
  const have3 = !!i.C3 && !i.C3.blank;
  const mixed = how === 'sp' || how === 'ps';
  if (mixed && !have3) return { idle: 'This arrangement needs C₃ as well. Fill in C₃, or choose series or parallel.' };
  for (const k of ['C1', 'C2', 'C3', 'Ct']) { const x = i[k]; if (x && !x.blank && !(x.v > 0)) return { error: 'A capacitance must be above zero.' }; }
  // Work in the unit of the first capacitor typed, so the working reads like the textbook (µF stays µF).
  const ref = (c.find === 'C1' ? i.C2 : i.C1), fd = ref.typed !== 0 ? ref.v / ref.typed : 1, du = ref.u;
  const D = (x: number) => sf(x / fd), mixedUnits = [i.C1, i.C2, i.C3, i.Ct].some((x) => x && !x.blank && x.u !== du);
  if (mixedUnits) lines.push(`Work in ${du}: ${[['C₁', i.C1], ['C₂', i.C2], ['C₃', i.C3], ['total', i.Ct]].filter(([, x]) => x && !(x as SIn).blank).map(([n, x]) => `${n} = ${D((x as SIn).v)} ${du}`).join(', ')}`);
  const C3 = have3 ? i.C3.v : undefined;
  let C1 = i.C1?.v, C2 = i.C2.v, Ct = i.Ct?.v, answer = '';
  const groupWord = NAMES[how];
  const parts = have3 ? 'three capacitors' : 'two capacitors';
  if (c.find === 'C1') {
    C1 = unknownC1(how, Ct, C2, C3);
    if (!Number.isFinite(C1)) return { error: how === 'parallel' || how === 'ps' ? 'The total is smaller than the other capacitors already give, so no capacitor C₁ can make it. In parallel the total is at least the sum of the others. Check the numbers.' : 'The total is too large for this series arrangement: a series total is always smaller than each part. Check which number is the total.' };
    lines.push(`Arrangement: ${groupWord}`, how === 'series' ? `1/C₁ = 1/C_total − 1/C₂${have3 ? ' − 1/C₃' : ''}` : how === 'parallel' ? `C₁ = C_total − C₂${have3 ? ' − C₃' : ''}` : how === 'sp' ? '1/C₁ = 1/C_total − 1/(C₂ + C₃)' : 'C₁ = C_total − C₂C₃/(C₂ + C₃)', `C₁ = ${eng(C1, 'F')}`);
    answer = `The unknown capacitor is C₁ = ${eng(C1, 'F')}.`;
  } else {
    Ct = total(how, C1, C2, C3);
    if (how === 'series') lines.push(`Arrangement: ${parts} ${groupWord}`, `1/C = ${[C1!, C2, ...(have3 ? [C3!] : [])].map((x) => `1/${D(x)}`).join(' + ')} = ${sf(fd / Ct)} per ${du}`, `C = ${eng(Ct, 'F')} (smaller than the smallest, as it must be in series)`);
    else if (how === 'parallel') lines.push(`Arrangement: ${parts} ${groupWord}`, `C = ${[C1!, C2, ...(have3 ? [C3!] : [])].map((x) => D(x)).join(' + ')} = ${eng(Ct, 'F')} (the sum)`);
    else if (how === 'sp') lines.push(`Arrangement: ${groupWord}`, `C₂₃ = C₂ + C₃ = ${eng(C2 + C3!, 'F')}`, `C = C₁ C₂₃ ÷ (C₁ + C₂₃) = ${eng(Ct, 'F')}`);
    else lines.push(`Arrangement: ${groupWord}`, `C₂₃ = C₂ C₃ ÷ (C₂ + C₃) = ${eng(ser([C2, C3!]), 'F')}`, `C = C₁ + C₂₃ = ${eng(Ct, 'F')}`);
    answer = `The equivalent capacitance is ${eng(Ct, 'F')}.`;
  }
  // With a battery: charge, voltage and energy on each capacitor.
  const hasV = !!i.V && !i.V.blank;
  if (hasV) {
    const V = i.V.v;
    if (!(V > 0)) return { error: 'The battery voltage must be above zero.' };
    const Q = Ct! * V;
    lines.push(`Battery ${eng(V, 'V')} on the whole group: Q = C V = ${eng(Q, 'C')}, energy U = ½ C V² = ${eng(0.5 * Ct! * V * V, 'J')}`);
    const row = (nm: string, C: number, q: number, v: number) => `${nm} = ${eng(C, 'F')}: Q = ${eng(q, 'C')}, V = ${eng(v, 'V')}, U = ${eng(0.5 * q * v, 'J')}`;
    const cs = [C1!, C2, ...(have3 ? [C3!] : [])];
    if (how === 'series') cs.forEach((C, k) => lines.push(row(`C${'₁₂₃'[k]}`, C, Q, Q / C)));
    else if (how === 'parallel') cs.forEach((C, k) => lines.push(row(`C${'₁₂₃'[k]}`, C, C * V, V)));
    else if (how === 'sp') { const C23 = C2 + C3!, V23 = Q / C23; lines.push(row('C₁', C1!, Q, Q / C1!), row('C₂', C2, C2 * V23, V23), row('C₃', C3!, C3! * V23, V23)); }
    else { const Cs = ser([C2, C3!]), Qs = Cs * V; lines.push(row('C₁', C1!, C1! * V, V), row('C₂', C2, Qs, Qs / C2), row('C₃', C3!, Qs, Qs / C3!)); }
    lines.push('Check: in series every capacitor holds the same charge; in parallel every one has the same voltage.');
  }
  return { answer, lines, tip: 'Common mistake: using the resistor rule. For capacitors it is the other way round: parallel capacitances add, and series ones add as reciprocals. Also convert µF, nF and pF properly (1 µF = 10⁻⁶ F).' };
}

const showC3 = () => true;
export const CAP_SPEC: SSpec = {
  id: 'capnet',
  finds: [['ceq', 'Equivalent capacitance'], ['C1', 'Unknown capacitor C₁']],
  fields: [
    { k: 'how', kind: 'choice', label: 'How they are joined', def: 'series', options: [['series', 'All in series'], ['parallel', 'All in parallel'], ['sp', 'C₁ in series with (C₂ ∥ C₃)'], ['ps', 'C₁ ∥ (C₂ in series with C₃)']] },
    { k: 'C1', label: 'C₁', units: CAP, ph: 'e.g. 4' },
    { k: 'C2', label: 'C₂', units: CAP, ph: 'e.g. 2' },
    { k: 'C3', label: 'C₃ (blank for just two)', units: CAP, optional: true, show: showC3, ph: 'optional' },
    { k: 'Ct', label: 'Total capacitance (given)', units: CAP, show: (c) => c.find === 'C1', ph: 'e.g. 2' },
    { k: 'V', label: 'Battery voltage (optional)', units: [['V', 1], ['kV', 1e3]], optional: true, ph: 'for charge and energy' },
  ],
  presets: [
    { name: '6 µF and 3 µF in series on 12 V', find: 'ceq', vals: { C1: '6', C2: '3', V: '12' }, ch: { how: 'series' } },
    { name: '2 µF and 3 µF in parallel', find: 'ceq', vals: { C1: '2', C2: '3' }, ch: { how: 'parallel' } },
    { name: 'C₁ = 4 µF in series with a 2 µF ∥ 6 µF pair, 12 V', find: 'ceq', vals: { C1: '4', C2: '2', C3: '6', V: '12' }, ch: { how: 'sp' } },
    { name: 'C₁ ∥ (6 µF in series with 3 µF), C₁ = 2 µF', find: 'ceq', vals: { C1: '2', C2: '6', C3: '3' }, ch: { how: 'ps' } },
    { name: 'Series with a 3 µF capacitor gives 2 µF: find C₁', find: 'C1', vals: { C2: '3', Ct: '2' }, ch: { how: 'series' } },
  ],
  solve: (i, c) => capSolve(i, c),
};
