// "Solve my numbers" for magnetic fields of currents: long straight wire, finite wire, circular coil, solenoid, the force
// between two parallel wires, and the current from a measured field. µ₀ = 4π × 10⁻⁷ T m/A. No DOM.
import { eng, sf, type SSpec, type SIn, type SOut } from '../learn/solvecore-b.ts';

export const MU0 = 4 * Math.PI * 1e-7;
const LEN: [string, number][] = [['cm', 0.01], ['m', 1], ['mm', 0.001]];
const AMP: [string, number][] = [['A', 1], ['mA', 1e-3], ['kA', 1e3]];
const conv = (i: SIn | undefined, base: string, what: string) => (i && !i.blank && i.u !== base && i.typed !== i.v ? [`Convert ${what}: ${sf(i.typed)} ${i.u} = ${sf(i.v, 4)} ${base}`] : []);
const pos = (x: SIn | undefined, nm: string) => (x && !x.blank && !(x.v > 0) ? `${nm} must be above zero.` : '');
const T = (b: number) => eng(b, 'T');
const EARTH = 5e-5;
const compare = (b: number) => (b > 0 ? ` For comparison, the Earth's field is about 50 µT, so this is ${sf(b / EARTH, 2)} times that.` : '');

export function biot(i: Record<string, SIn>, c: { find: string; ch: Record<string, string> }): SOut {
  const lines: string[] = [], find = c.find;
  const e = ['I', 'I1', 'I2', 'd', 'L', 'R', 'N', 'B', 'len'].map((k) => pos(i[k], { I: 'The current', I1: 'The first current', I2: 'The second current', d: 'The distance', L: 'The length', R: 'The radius', N: 'The number of turns', B: 'The field', len: 'The solenoid length', }[k]!)).find(Boolean);
  if (e) return { error: e };
  if (find === 'long') {
    const I = i.I.v, d = i.d.v, B = (MU0 * I) / (2 * Math.PI * d);
    lines.push(...conv(i.I, 'A', 'the current'), ...conv(i.d, 'm', 'the distance'), 'Long straight wire: B = μ₀ I / (2π d), with μ₀ = 4π × 10⁻⁷ T m/A', `B = (4π × 10⁻⁷ × ${sf(I)}) ÷ (2π × ${sf(d)}) = ${sf(B)} T = ${T(B)}`, 'Direction: right-hand rule. Thumb along the current, fingers curl the way the field goes round the wire.');
    return { answer: `The field is ${T(B)} at ${sf(i.d.typed)} ${i.d.u} from the wire.${compare(B)}`, lines, tip: 'Common mistake: leaving the distance in cm. Use metres, so 5 cm is 0.05 m. The field falls as 1/d, so double the distance halves the field.' };
  }
  if (find === 'finite') {
    const I = i.I.v, d = i.d.v, L = i.L.v, s = L / 2 / Math.hypot(d, L / 2), B = ((MU0 * I) / (4 * Math.PI * d)) * 2 * s;
    lines.push(...conv(i.I, 'A', 'the current'), ...conv(i.d, 'm', 'the distance'), ...conv(i.L, 'm', 'the length'), 'Point on the perpendicular bisector (opposite the middle): B = (μ₀ I / 4π d) (sin α₁ + sin α₂), and sin α = (L/2) / √(d² + (L/2)²)',
      `sin α = ${sf(L / 2)} ÷ √(${sf(d)}² + ${sf(L / 2)}²) = ${sf(s, 4)}`, `B = (10⁻⁷ × ${sf(I)} ÷ ${sf(d)}) × 2 × ${sf(s, 4)} = ${sf(B)} T = ${T(B)}`, `For comparison, a very long wire would give μ₀ I / 2π d = ${T((MU0 * I) / (2 * Math.PI * d))}.`);
    return { answer: `The field opposite the middle of the wire is ${T(B)}.${compare(B)}`, lines, tip: 'A short wire gives less than the long-wire formula, because both ends contribute less. As L gets much bigger than d, sin α tends to 1 and you get μ₀ I / 2π d.' };
  }
  if (find === 'loop') {
    const I = i.I.v, R = i.R.v, N = i.N.v, axis = c.ch.where === 'axis', x = axis ? Math.abs(i.x.v) : 0;
    const B = (MU0 * N * I * R * R) / (2 * Math.pow(R * R + x * x, 1.5));
    lines.push(...conv(i.I, 'A', 'the current'), ...conv(i.R, 'm', 'the radius'), ...(axis ? conv(i.x, 'm', 'the distance') : []));
    if (!axis) lines.push('At the centre of a coil: B = μ₀ N I / (2 R)', `B = (4π × 10⁻⁷ × ${sf(N)} × ${sf(I)}) ÷ (2 × ${sf(R)}) = ${sf(B)} T = ${T(B)}`);
    else lines.push('On the axis, a distance x from the centre: B = μ₀ N I R² / (2 (R² + x²)^(3/2))', `R² + x² = ${sf(R)}² + ${sf(x)}² = ${sf(R * R + x * x, 4)} m²`, `B = (4π × 10⁻⁷ × ${sf(N)} × ${sf(I)} × ${sf(R * R, 4)}) ÷ (2 × ${sf(R * R + x * x, 4)}^1.5) = ${sf(B)} T = ${T(B)}`);
    lines.push('Direction along the axis: curl the fingers of your right hand the way the current goes round, and your thumb points along the field.');
    return { answer: `The field ${axis ? `on the axis ${sf(i.x.typed)} ${i.x.u} from the centre` : 'at the centre of the coil'} is ${T(B)}.${compare(B)}`, lines, tip: 'Common mistake: forgetting the number of turns N, or using the diameter instead of the radius. Each turn adds its own field, so N turns give N times as much.' };
  }
  if (find === 'sol') {
    const I = i.I.v, N = i.N.v, len = i.len.v, n = N / len, ends = c.ch.where === 'end', B = MU0 * n * I * (ends ? 0.5 : 1);
    lines.push(...conv(i.I, 'A', 'the current'), ...conv(i.len, 'm', 'the length'), `Turns per metre: n = N / length = ${sf(N)} ÷ ${sf(len)} = ${sf(n)} per m`, `Inside a long solenoid: B = μ₀ n I = 4π × 10⁻⁷ × ${sf(n)} × ${sf(I)} = ${sf(MU0 * n * I)} T`);
    if (ends) lines.push('At the end of a long solenoid the field is about half the middle value: B ≈ ½ μ₀ n I', `B = ${sf(B)} T`);
    return { answer: `The field ${ends ? 'at the end of' : 'inside'} the solenoid is ${T(B)}.${compare(B)}`, lines, tip: 'This formula is for a solenoid that is long compared with its radius. n is turns per metre (N ÷ length), not the total number of turns. Outside a long solenoid the field is almost zero.' };
  }
  if (find === 'force') {
    const I1 = i.I1.v, I2 = i.I2.v, d = i.d.v, f = (MU0 * I1 * I2) / (2 * Math.PI * d);
    lines.push(...conv(i.I1, 'A', 'the first current'), ...conv(i.I2, 'A', 'the second current'), ...conv(i.d, 'm', 'the distance'), 'Force per metre between two long parallel wires: F / L = μ₀ I₁ I₂ / (2π d)', `F / L = (4π × 10⁻⁷ × ${sf(I1)} × ${sf(I2)}) ÷ (2π × ${sf(d)}) = ${sf(f)} N/m`,
      'Currents in the same direction attract; opposite directions repel.');
    return { answer: `The force is ${eng(f, 'N')} on every metre of wire.`, lines, tip: 'The force on each wire is equal and opposite. This is how the ampere is defined: 1 A in each of two wires 1 m apart gives 2 × 10⁻⁷ N per metre.' };
  }
  // current from a field, long wire
  const B = i.B.v, d = i.d.v, I = (2 * Math.PI * d * B) / MU0;
  lines.push(...conv(i.B, 'T', 'the field'), ...conv(i.d, 'm', 'the distance'), 'Rearranged: I = 2π d B / μ₀', `I = (2π × ${sf(d)} × ${sf(B)}) ÷ (4π × 10⁻⁷) = ${sf(I)} A`);
  return { answer: `The current in the long wire is ${eng(I, 'A')}.`, lines, tip: 'Make sure the field is in tesla: 1 gauss = 10⁻⁴ T and 1 µT = 10⁻⁶ T.' };
}

export const BIOT_SPEC: SSpec = {
  id: 'biot',
  finds: [['long', 'Field of a long straight wire'], ['finite', 'Field of a wire of length L'], ['loop', 'Field of a circular coil'], ['sol', 'Field of a solenoid'], ['force', 'Force between parallel wires'], ['Iw', 'Current from a field (long wire)']],
  fields: [
    { k: 'I', label: 'Current I', units: AMP, show: (c) => ['long', 'finite', 'loop', 'sol'].includes(c.find), ph: 'e.g. 5' },
    { k: 'I1', label: 'Current in wire 1', units: AMP, show: (c) => c.find === 'force', ph: 'e.g. 10' },
    { k: 'I2', label: 'Current in wire 2', units: AMP, show: (c) => c.find === 'force', ph: 'e.g. 20' },
    { k: 'd', label: 'Distance d', units: LEN, show: (c) => ['long', 'finite', 'force', 'Iw'].includes(c.find), ph: 'e.g. 5' },
    { k: 'L', label: 'Length of the wire L', units: LEN, show: (c) => c.find === 'finite', ph: 'e.g. 20' },
    { k: 'B', label: 'Magnetic field B', units: [['T', 1], ['mT', 1e-3], ['µT', 1e-6], ['G', 1e-4]], show: (c) => c.find === 'Iw', ph: 'e.g. 20' },
    { k: 'R', label: 'Radius of the coil R', units: LEN, show: (c) => c.find === 'loop', ph: 'e.g. 10' },
    { k: 'N', label: 'Number of turns N', show: (c) => c.find === 'loop' || c.find === 'sol', ph: 'e.g. 100' },
    { k: 'where', kind: 'choice', label: 'Where is the point?', def: 'centre', show: (c) => c.find === 'loop', options: [['centre', 'At the centre'], ['axis', 'On the axis, away from the centre']] },
    { k: 'x', label: 'Distance along the axis x', units: LEN, show: (c) => c.find === 'loop' && c.ch.where === 'axis', ph: 'e.g. 10' },
    { k: 'len', label: 'Length of the solenoid', units: [['cm', 0.01], ['m', 1], ['mm', 0.001]], show: (c) => c.find === 'sol', ph: 'e.g. 50' },
    { k: 'where2', kind: 'choice', label: 'Where is the point?', def: 'mid', show: (c) => c.find === 'sol', options: [['mid', 'Inside, near the middle'], ['end', 'At one end']] },
  ],
  presets: [
    { name: '5 A in a long wire, point 5 cm away', find: 'long', vals: { I: '5', d: '5' } },
    { name: '10 A in a 20 cm wire, point 5 cm opposite its middle', find: 'finite', vals: { I: '10', d: '5', L: '20' } },
    { name: 'Coil of 100 turns, radius 10 cm, 2 A, at the centre', find: 'loop', vals: { I: '2', R: '10', N: '100' }, ch: { where: 'centre' } },
    { name: 'Solenoid of 500 turns on 25 cm carrying 3 A', find: 'sol', vals: { I: '3', N: '500', len: '25' }, ch: { where2: 'mid' } },
    { name: 'Two wires 10 A and 20 A, 4 cm apart', find: 'force', vals: { I1: '10', I2: '20', d: '4' } },
    { name: 'Field of 20 µT at 10 cm from a long wire: find I', find: 'Iw', vals: { B: ['20', 'µT'], d: '10' } },
  ],
  solve: (i, c) => biot(i, { find: c.find === 'Iw' ? 'Iw' : c.find, ch: { ...c.ch, where: c.find === 'sol' ? c.ch.where2 : c.ch.where } }),
};
