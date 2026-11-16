// "Solve my numbers" for the Ohm's law lab: V = IR with power and energy, and the resistance of a wire R = ρL/A.
// Plain maths on typed values with units, no DOM. Engine: src/lib/learn/solvecore-b.ts.
import { eng, sf, type SSpec, type SIn, type SOut } from '../learn/solvecore-b.ts';
import { MATERIALS } from './ohms-lab.ts';

const U = (base: string, ...more: [string, number][]): [string, number][] => [[base, 1], ...more];
const conv = (i: SIn, base: string, what: string) => (i.u !== base && i.typed !== i.v ? [`Convert ${what}: ${sf(i.typed)} ${i.u} = ${sf(i.v, 4)} ${base}`] : []);
const unitTip = (...ins: SIn[]) => (ins.some((i) => /^[mµkM]/.test(i.u) && i.u !== 'min') ? 'Common mistake: forgetting to convert. Ohm\'s law uses volts, amperes and ohms, so 250 mA is 0.25 A and 2 kΩ is 2000 Ω.' : 'Ohm\'s law holds for a conductor kept at the same temperature. A bulb filament gets hot, so V/I is not constant there.');

export function ohm(i: Record<string, SIn>, find: string): SOut {
  const t = i.t, hasT = t && !t.blank;
  let V = i.V?.v, I = i.I?.v, R = i.R?.v;
  const need = find === 'R' ? [i.V, i.I] : find === 'I' ? [i.V, i.R] : [i.I, i.R];
  if (need.some((x) => x.v < 0)) return { error: 'Use positive numbers here. The direction of the current is shown by an arrow, not by a minus sign.' };
  if (hasT && !(t.v >= 0)) return { error: 'Time cannot be negative.' };
  const lines: string[] = [];
  if (find === 'R') {
    lines.push(...conv(i.V, 'V', 'the voltage'), ...conv(i.I, 'A', 'the current'), 'Formula: R = V / I');
    if (I === 0) return { error: 'The current is 0 A, so no current flows: an open circuit, and V ÷ I cannot be worked out. Check the ammeter reading.' };
    R = V / I; lines.push(`R = ${sf(V)} V ÷ ${sf(I)} A = ${sf(R)} Ω`);
  } else if (find === 'I') {
    lines.push(...conv(i.V, 'V', 'the voltage'), ...conv(i.R, 'Ω', 'the resistance'), 'Formula: I = V / R');
    if (R === 0) return { error: 'A resistance of 0 Ω would let an unlimited current flow (a short circuit), so I cannot be found. Check the resistance.' };
    I = V / R; lines.push(`I = ${sf(V)} V ÷ ${sf(R)} Ω = ${sf(I)} A`);
  } else {
    lines.push(...conv(i.I, 'A', 'the current'), ...conv(i.R, 'Ω', 'the resistance'), 'Formula: V = I R');
    V = I * R; lines.push(`V = ${sf(I)} A × ${sf(R)} Ω = ${sf(V)} V`);
  }
  const P = V * I;
  lines.push(`Power: P = V I = ${sf(V)} × ${sf(I)} = ${eng(P, 'W')}${R > 0 ? ` (also I² R = ${sf(I)}² × ${sf(R)})` : ''}`);
  if (hasT) { const E = P * t.v; lines.push(`Energy in ${sf(t.typed)} ${t.u}: E = P t = ${sf(P)} W × ${sf(t.v)} s = ${eng(E, 'J')} = ${sf(E / 3.6e6)} kWh`); }
  const answer = find === 'R' ? `The resistance is ${eng(R, 'Ω')}.` : find === 'I' ? `The current is ${eng(I, 'A')}.` : `The voltage is ${eng(V, 'V')}.`;
  return { answer, lines, tip: unitTip(...need) };
}

export const OHM_SPEC: SSpec = {
  id: 'ohm',
  finds: [['R', 'Resistance R'], ['I', 'Current I'], ['V', 'Voltage V']],
  fields: [
    { k: 'V', label: 'Voltage V', units: U('V', ['mV', 1e-3], ['kV', 1e3]), ph: 'e.g. 6' },
    { k: 'I', label: 'Current I', units: U('A', ['mA', 1e-3], ['µA', 1e-6]), ph: 'e.g. 0.25' },
    { k: 'R', label: 'Resistance R', units: U('Ω', ['kΩ', 1e3], ['MΩ', 1e6]), ph: 'e.g. 24' },
    { k: 't', label: 'Time (optional, for energy)', units: U('s', ['min', 60], ['h', 3600]), optional: true, ph: 'optional' },
  ],
  presets: [
    { name: 'A 12 V battery drives 0.5 A: find R', find: 'R', vals: { V: '12', I: '0.5' } },
    { name: 'A 220 Ω resistor on 9 V: find I', find: 'I', vals: { V: '9', R: '220' } },
    { name: 'Ammeter reads 250 mA through 40 Ω: find V', find: 'V', vals: { I: ['250', 'mA'], R: '40' } },
    { name: 'A 4.7 kΩ resistor on 5 V for 2 hours', find: 'I', vals: { V: '5', R: ['4.7', 'kΩ'], t: ['2', 'h'] } },
  ],
  solve: (i, c) => ohm(i, c.find),
};

/** Wire: R = ρ L / A with A = π d² / 4. Find R, length, thickness (diameter and area) or resistivity. */
export function wire(i: Record<string, SIn>, c: { find: string; ch: Record<string, string> }): SOut {
  const find = c.find, byD = c.ch.how !== 'A';
  const lines: string[] = [];
  const mat = c.ch.mat !== 'custom' && find !== 'rho' ? MATERIALS[c.ch.mat] : null;
  const pos = (x: SIn | undefined, nm: string) => (x && !x.blank && !(x.v > 0) ? `${nm} must be above zero.` : '');
  for (const e of [pos(i.L, 'The length'), pos(i.d, 'The diameter'), pos(i.A, 'The area'), pos(i.rho, 'The resistivity'), pos(i.R, 'The resistance')]) if (e) return { error: e };
  const rho = mat ? mat.rho : i.rho?.v;
  if (mat) lines.push(`Resistivity of ${mat.name.toLowerCase()}: ρ = ${sf(mat.rho, 2)} Ω m (rounded textbook value near 20 °C)`);
  else if (i.rho) lines.push(...conv(i.rho, 'Ω m', 'the resistivity'));
  for (const [x, nm, b] of [[i.L, 'the length', 'm'], [i.d, 'the diameter', 'm'], [i.A, 'the area', 'm²'], [i.R, 'the resistance', 'Ω']] as [SIn | undefined, string, string][]) if (x && !x.blank) lines.push(...conv(x, b, nm));
  const area = (d: number) => (Math.PI * d * d) / 4;
  let answer = '';
  if (find === 'R') {
    const A = byD ? area(i.d.v) : i.A.v;
    if (byD) lines.push(`Area: A = π d² / 4 = π × (${sf(i.d.v, 4)} m)² ÷ 4 = ${sf(A)} m²`);
    const R = (rho! * i.L.v) / A;
    lines.push('Formula: R = ρ L / A', `R = ${sf(rho!, 3)} × ${sf(i.L.v)} ÷ ${sf(A)} = ${sf(R)} Ω`);
    answer = `The resistance of the wire is ${eng(R, 'Ω')}.`;
  } else if (find === 'L') {
    const A = byD ? area(i.d.v) : i.A.v;
    if (byD) lines.push(`Area: A = π d² / 4 = ${sf(A)} m²`);
    const L = (i.R.v * A) / rho!;
    lines.push('Formula: L = R A / ρ', `L = ${sf(i.R.v)} × ${sf(A)} ÷ ${sf(rho!, 3)} = ${sf(L)} m`);
    answer = `The wire must be ${sf(L)} m long.`;
  } else if (find === 'th') {
    const A = (rho! * i.L.v) / i.R.v, d = Math.sqrt((4 * A) / Math.PI);
    lines.push('Formula: A = ρ L / R, then d = √(4A / π)', `A = ${sf(rho!, 3)} × ${sf(i.L.v)} ÷ ${sf(i.R.v)} = ${sf(A)} m²`, `d = √(4 × ${sf(A)} ÷ π) = ${sf(d)} m = ${sf(d * 1000)} mm`);
    answer = `The wire needs a cross-section of ${sf(A * 1e6)} mm², which is a diameter of ${sf(d * 1000)} mm.`;
  } else {
    const A = byD ? area(i.d.v) : i.A.v;
    if (byD) lines.push(`Area: A = π d² / 4 = ${sf(A)} m²`);
    const r = (i.R.v * A) / i.L.v;
    lines.push('Formula: ρ = R A / L', `ρ = ${sf(i.R.v)} × ${sf(A)} ÷ ${sf(i.L.v)} = ${sf(r)} Ω m`);
    answer = `The resistivity is ${sf(r)} Ω m.`;
  }
  return { answer, lines, tip: 'Common mistake: using the diameter as if it were the radius, or leaving the diameter in mm. Area = π d² / 4 with d in metres, so 0.3 mm is 0.0003 m. Resistance depends on the metal, length and thickness, not on the voltage.' };
}

export const WIRE_SPEC: SSpec = {
  id: 'wire',
  finds: [['R', 'Resistance R'], ['L', 'Length L'], ['th', 'Thickness'], ['rho', 'Resistivity ρ']],
  fields: [
    { k: 'mat', kind: 'choice', label: 'Metal', def: 'copper', show: (c) => c.find !== 'rho', options: [['copper', 'Copper'], ['aluminium', 'Aluminium'], ['tungsten', 'Tungsten'], ['iron', 'Iron'], ['constantan', 'Constantan'], ['nichrome', 'Nichrome'], ['custom', 'Other (type ρ)']] },
    { k: 'rho', label: 'Resistivity ρ', units: U('Ω m', ['Ω cm', 0.01], ['Ω mm²/m', 1e-6]), show: (c) => c.find === 'rho' ? false : c.ch.mat === 'custom', ph: 'e.g. 1.7e-8' },
    { k: 'how', kind: 'choice', label: 'Thickness given as', def: 'd', show: (c) => c.find !== 'th', options: [['d', 'Diameter d'], ['A', 'Cross-section area A']] },
    { k: 'd', label: 'Diameter d', units: U('mm', ['cm', 10], ['m', 1000], ['µm', 1e-3]).map(([l, f]) => [l, f * 1e-3] as [string, number]), show: (c) => c.find !== 'th' && c.ch.how !== 'A', ph: 'e.g. 0.3' },
    { k: 'A', label: 'Area A', units: [['mm²', 1e-6], ['cm²', 1e-4], ['m²', 1]], show: (c) => c.find !== 'th' && c.ch.how === 'A', ph: 'e.g. 0.07' },
    { k: 'L', label: 'Length L', units: U('m', ['cm', 0.01], ['mm', 1e-3], ['km', 1e3]), show: (c) => c.find !== 'L', ph: 'e.g. 1' },
    { k: 'R', label: 'Resistance R', units: U('Ω', ['mΩ', 1e-3], ['kΩ', 1e3]), show: (c) => c.find !== 'R', ph: 'e.g. 15' },
  ],
  presets: [
    { name: 'Nichrome wire 1 m long, 0.3 mm thick: find R', find: 'R', vals: { d: '0.3', L: '1' }, ch: { mat: 'nichrome', how: 'd' } },
    { name: 'Copper wire 50 m long, 1 mm thick: find R', find: 'R', vals: { d: '1', L: '50' }, ch: { mat: 'copper', how: 'd' } },
    { name: 'Wire 2 m long, 0.5 mm² area, 3.4 Ω: find ρ', find: 'rho', vals: { A: '0.5', L: '2', R: '3.4' }, ch: { how: 'A' } },
    { name: 'Aluminium wire of 2 Ω, 0.8 mm thick: find L', find: 'L', vals: { d: '0.8', R: '2' }, ch: { mat: 'aluminium', how: 'd' } },
  ],
  solve: (i, c) => wire(i, c),
};
