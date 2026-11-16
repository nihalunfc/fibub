// "Solve my numbers" for the potentiometer: compare two emfs, internal resistance of a cell, potential gradient, balance
// length and the potential drop along the wire of the driver circuit. Textbook formulas, no DOM.
import { sf, type SSpec, type SIn, type SOut } from '../learn/solvecore-b.ts';

const conv = (i: SIn | undefined, base: string, what: string) => (i && !i.blank && i.u !== base && i.typed !== i.v ? [`Convert ${what}: ${sf(i.typed)} ${i.u} = ${sf(i.v, 4)} ${base}`] : []);
const pos = (x: SIn | undefined, nm: string) => (x && !x.blank && !(x.v > 0) ? `${nm} must be above zero.` : '');
const LEN: [string, number][] = [['cm', 0.01], ['m', 1], ['mm', 0.001]];

export function potentiometer(i: Record<string, SIn>, find: string): SOut {
  const lines: string[] = [];
  const e = [pos(i.E1, 'The known emf'), pos(i.l1, 'The balance length l₁'), pos(i.l2, 'The balance length l₂'), pos(i.R, 'The resistance R'), pos(i.Vw, 'The potential drop'), pos(i.L, 'The wire length'),
    pos(i.Ed, 'The driver emf'), pos(i.Rw, 'The wire resistance'), pos(i.E, 'The emf')].find(Boolean);
  if (e) return { error: e };
  if (find === 'E2') {
    const E = (i.E1.v * i.l2.v) / i.l1.v;
    lines.push(...conv(i.E1, 'V', 'the emf'), 'Same current in the wire, so E₁ / E₂ = l₁ / l₂ and E₂ = E₁ × l₂ / l₁',
      `E₂ = ${sf(i.E1.v)} V × ${sf(i.l2.typed)} ${i.l2.u} ÷ ${sf(i.l1.typed)} ${i.l1.u} = ${sf(E)} V`);
    return { answer: `The second cell has an emf of ${sf(E)} V.`, lines, tip: 'Common mistake: putting the lengths upside down. The cell with the larger emf balances at the longer length. Both lengths just need the same unit; they cancel.' };
  }
  if (find === 'r') {
    const l1 = i.l1.v, l2 = i.l2.v;
    if (l2 > l1) return { error: 'l₂ (key closed) must be shorter than l₁ (key open). Closing the key makes the cell give current, so its terminal voltage drops and the balance point moves toward A.' };
    const r = (i.R.v * (l1 - l2)) / l2;
    lines.push(...conv(i.R, 'Ω', 'the resistance'), 'Open key: l₁ balances E. Closed key: l₂ balances V = E R / (R + r), so E / V = l₁ / l₂ and r = R (l₁ − l₂) / l₂',
      `r = ${sf(i.R.v)} Ω × (${sf(i.l1.typed)} − ${sf(i.l2.typed)}) ${i.l1.u} ÷ ${sf(i.l2.typed)} ${i.l2.u} = ${sf(r)} Ω`);
    return { answer: r === 0 ? 'The internal resistance is 0 Ω: the balance length did not change, so the cell is ideal.' : `The internal resistance of the cell is ${sf(r)} Ω.`, lines, tip: 'Common mistake: using l₂ − l₁ (negative) or dividing by l₁. The denominator is l₂, the shorter length with the resistance box connected.' };
  }
  if (find === 'drop') {
    const Ed = i.Ed.v, Rw = i.Rw.v, Rh = i.Rh && !i.Rh.blank ? i.Rh.v : 0;
    if (Rh < 0) return { error: 'The rheostat resistance cannot be negative.' };
    const I = Ed / (Rw + Rh), V = I * Rw;
    lines.push(...conv(i.Ed, 'V', 'the driver emf'), 'Current in the wire: I = emf / (R_wire + R_rheostat)', `I = ${sf(Ed)} ÷ (${sf(Rw)} + ${sf(Rh)}) = ${sf(I)} A`, `Potential drop along the wire: V = I × R_wire = ${sf(I)} × ${sf(Rw)} = ${sf(V)} V`);
    let tail = '';
    if (i.L && !i.L.blank) { const k = V / i.L.v; lines.push(...conv(i.L, 'm', 'the length'), `Potential gradient: k = V / L = ${sf(V)} ÷ ${sf(i.L.v)} = ${sf(k)} V/m = ${sf(k / 100 * 1000, 3)} mV per cm`); tail = ` The gradient is ${sf(k)} V/m.`; }
    return { answer: `The potential drop along the wire is ${sf(V)} V (current ${sf(I)} A).${tail}`, lines, tip: 'The test cell can only be balanced if its emf is smaller than this drop. If you cannot find a balance point, lower the rheostat resistance.' };
  }
  const V = i.Vw.v, L = i.L.v, k = V / L;
  lines.push(...conv(i.Vw, 'V', 'the drop'), ...conv(i.L, 'm', 'the length'), `Potential gradient: k = V / L = ${sf(V)} V ÷ ${sf(L)} m = ${sf(k)} V/m = ${sf(k * 10, 3)} mV per cm`);
  if (find === 'k') return { answer: `The potential gradient is ${sf(k)} V/m (${sf(k * 10, 3)} mV per cm).`, lines, tip: 'The gradient is the voltage dropped per metre of wire, so it needs the whole wire length, not the balance length.' };
  if (find === 'l') {
    const E = i.E.v, l = E / k;
    lines.push(...conv(i.E, 'V', 'the emf'), 'At balance E = k l, so l = E / k', `l = ${sf(E)} ÷ ${sf(k)} = ${sf(l)} m = ${sf(l * 100, 3)} cm`);
    if (l > L) return { error: `The cell's emf is bigger than the whole potential drop along the wire (${sf(V)} V), so there is no balance point on the wire. The balance length would be ${sf(l, 3)} m, longer than the ${sf(L)} m wire.`, lines };
    return { answer: `The cell balances at ${sf(l * 100, 3)} cm (${sf(l, 3)} m) from the end A.`, lines, tip: 'Common mistake: forgetting that the balance length is measured from the end where the driver cell connects (A).' };
  }
  const l = i.l.v, E = k * l;
  if (l > L) return { error: `The balance length cannot be longer than the wire (${sf(L)} m).` };
  lines.push(...conv(i.l, 'm', 'the balance length'), 'At balance E = k l', `E = ${sf(k)} V/m × ${sf(l)} m = ${sf(E)} V`);
  return { answer: `The emf of the cell is ${sf(E)} V.`, lines, tip: 'Convert cm to m before using k in V/m, or keep k in mV per cm and l in cm. Do not mix them.' };
}

export const POT_SPEC: SSpec = {
  id: 'pot',
  finds: [['E2', 'Compare emfs: unknown emf'], ['r', 'Internal resistance of a cell'], ['k', 'Potential gradient'], ['l', 'Balance length'], ['E', 'Emf from balance length'], ['drop', 'Potential drop along the wire']],
  fields: [
    { k: 'E1', label: 'Known emf E₁', units: [['V', 1], ['mV', 1e-3]], show: (c) => c.find === 'E2', ph: 'e.g. 1.5' },
    { k: 'l1', label: 'Balance length l₁ (E₁, or key open)', units: LEN, show: (c) => c.find === 'E2' || c.find === 'r', ph: 'e.g. 300' },
    { k: 'l2', label: 'Balance length l₂ (E₂, or key closed)', units: LEN, show: (c) => c.find === 'E2' || c.find === 'r', ph: 'e.g. 250' },
    { k: 'R', label: 'Resistance box R', units: [['Ω', 1], ['kΩ', 1e3]], show: (c) => c.find === 'r', ph: 'e.g. 5' },
    { k: 'Vw', label: 'Potential drop along the whole wire', units: [['V', 1], ['mV', 1e-3]], show: (c) => ['k', 'l', 'E'].includes(c.find), ph: 'e.g. 2' },
    { k: 'L', label: 'Length of the wire', units: [['m', 1], ['cm', 0.01]], show: (c) => ['k', 'l', 'E'].includes(c.find), ph: 'e.g. 4' },
    { k: 'Ld', label: 'Length of the wire (optional, for the gradient)', units: [['m', 1], ['cm', 0.01]], optional: true, show: (c) => c.find === 'drop', ph: 'optional' },
    { k: 'Ed', label: 'Driver cell emf', units: [['V', 1], ['mV', 1e-3]], show: (c) => c.find === 'drop', ph: 'e.g. 2' },
    { k: 'Rw', label: 'Resistance of the wire', units: [['Ω', 1], ['kΩ', 1e3]], show: (c) => c.find === 'drop', ph: 'e.g. 4' },
    { k: 'Rh', label: 'Rheostat in series (0 if none)', units: [['Ω', 1], ['kΩ', 1e3]], optional: true, show: (c) => c.find === 'drop', ph: 'e.g. 0.5' },
    { k: 'E', label: 'Emf of the cell', units: [['V', 1], ['mV', 1e-3]], show: (c) => c.find === 'l', ph: 'e.g. 1.5' },
    { k: 'l', label: 'Balance length', units: LEN, show: (c) => c.find === 'E', ph: 'e.g. 150' },
  ],
  presets: [
    { name: '1.5 V cell balances at 300 cm, other cell at 250 cm', find: 'E2', vals: { E1: '1.5', l1: '300', l2: '250' } },
    { name: 'Internal resistance: 5 Ω box, 300 cm open and 250 cm closed', find: 'r', vals: { l1: '300', l2: '250', R: '5' } },
    { name: '2 V drop over a 4 m wire: gradient', find: 'k', vals: { Vw: '2', L: '4' } },
    { name: '1.2 V cell on a 2 V, 4 m wire: balance length', find: 'l', vals: { Vw: '2', L: '4', E: '1.2' } },
    { name: '2 V driver, 4 Ω wire, 0.5 Ω rheostat, 4 m wire', find: 'drop', vals: { Ed: '2', Rw: '4', Rh: '0.5', Ld: '4' } },
  ],
  solve: (i, c) => potentiometer(c.find === 'drop' ? { ...i, L: i.Ld } : i, c.find),
};
