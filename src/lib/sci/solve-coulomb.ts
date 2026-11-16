// "Solve my numbers" for Coulomb's law between two point charges: find the force, either charge or the distance,
// with units, the medium (relative permittivity) and attraction or repulsion. Plain maths, no DOM.
import { eng, sf, type SSpec, type SIn, type SOut } from '../learn/solvecore-b.ts';

export const K0 = 8.9875517923e9; // N m² / C², 1 / (4 π ε₀)
export const E_CH = 1.602176634e-19; // C
const MEDIA: Record<string, [string, number]> = { air: ['air or vacuum', 1], water: ['water', 80] };
const kind = (F: number) => (F > 0 ? 'repulsive: like charges push each other apart' : F < 0 ? 'attractive: unlike charges pull each other together' : 'zero');
const mText = (er: number, nm: string) => (er === 1 ? '' : ` Medium: ${nm}, εr = ${sf(er)}, so the force is ${sf(er)} times smaller than in air.`);

export function coulomb(i: Record<string, SIn>, c: { find: string; ch: Record<string, string> }): SOut {
  const med = c.ch.med ?? 'air';
  let er = 1, nm = 'air or vacuum';
  if (med === 'custom') { er = i.er?.v; nm = 'the medium'; if (!(er >= 1)) return { error: 'The relative permittivity εr of a medium is 1 or more (1 for air or vacuum, about 80 for water).' }; }
  else [nm, er] = MEDIA[med] ?? MEDIA.air;
  const lines: string[] = [];
  const conv = (x: SIn | undefined, base: string, what: string) => { if (x && !x.blank && x.u !== base && x.typed !== x.v) lines.push(`Convert ${what}: ${sf(x.typed)} ${x.u} = ${sf(x.v, 4)} ${base}`); };
  conv(i.q1, 'C', 'charge 1'); conv(i.q2, 'C', 'charge 2'); conv(i.r, 'm', 'the distance'); conv(i.F, 'N', 'the force');
  if (i.r && !(i.r.v > 0) && c.find !== 'r') return { error: 'The distance must be above zero. At r = 0 the formula gives an infinite force: real charges are never exactly on top of each other.' };
  if (i.F && c.find !== 'F' && i.F.v < 0) return { error: 'Type the force as a size (a positive number). Choose attractive or repulsive in the box above.' };
  const kk = `k = 8.99 × 10⁹ N m²/C²`;
  let answer = '';
  if (c.find === 'F') {
    const { v: q1 } = i.q1, { v: q2 } = i.q2, r = i.r.v;
    const F = (K0 * q1 * q2) / (er * r * r);
    lines.push(`Formula: F = k q₁ q₂ / (εr r²), ${kk}`, `F = 8.99 × 10⁹ × (${sf(q1)}) × (${sf(q2)}) ÷ (${sf(er)} × ${sf(r)}²) = ${sf(Math.abs(F))} N`);
    if (F === 0) return { answer: 'The force is 0 N: one of the charges is zero, so there is nothing to push or pull.', lines, tip: 'A neutral object has no net charge, so Coulomb\'s law gives no force.' };
    lines.push(`Signs: q₁ and q₂ are ${F > 0 ? 'both the same sign' : 'opposite in sign'}, so the force is ${kind(F)}.`);
    answer = `The force is ${eng(Math.abs(F), 'N')}, ${F > 0 ? 'repulsive' : 'attractive'}.`;
  } else if (c.find === 'q1' || c.find === 'q2') {
    const other = c.find === 'q1' ? i.q2 : i.q1, F = i.F.v, r = i.r.v;
    if (other.v === 0) return { error: 'The other charge is 0, so no force can come from it. Type a charge that is not zero.' };
    const mag = (F * er * r * r) / (K0 * Math.abs(other.v));
    const same = c.ch.nature !== 'att', sign = (other.v > 0) === same ? 1 : -1, q = sign * mag;
    lines.push(`Formula turned round: ${c.find === 'q1' ? 'q₁' : 'q₂'} = F εr r² ÷ (k |${c.find === 'q1' ? 'q₂' : 'q₁'}|)`, `Size = ${sf(F)} × ${sf(er)} × ${sf(r)}² ÷ (8.99 × 10⁹ × ${sf(Math.abs(other.v))}) = ${sf(mag)} C`, `The force is ${same ? 'repulsive, so the charges have the same sign' : 'attractive, so the charges have opposite signs'}: ${c.find === 'q1' ? 'q₁' : 'q₂'} is ${q >= 0 ? 'positive' : 'negative'}.`);
    if (mag > 0) lines.push(`In electrons: ${sf(mag / E_CH)} elementary charges (e = 1.602 × 10⁻¹⁹ C)`);
    answer = `The charge is ${q === 0 ? '0 C' : (q < 0 ? '−' : '+') + eng(mag, 'C')}.`;
  } else {
    const q1 = i.q1.v, q2 = i.q2.v, F = i.F.v;
    if (q1 === 0 || q2 === 0) return { error: 'A charge of 0 gives no force at any distance, so the distance cannot be found. Type non-zero charges.' };
    if (!(F > 0)) return { error: 'The force must be above 0 N. A force of zero would need an infinite distance.' };
    const r = Math.sqrt((K0 * Math.abs(q1 * q2)) / (er * F));
    lines.push('Formula turned round: r = √(k |q₁ q₂| ÷ (εr F))', `r = √(8.99 × 10⁹ × ${sf(Math.abs(q1 * q2))} ÷ (${sf(er)} × ${sf(F)})) = ${sf(r)} m = ${sf(r * 100)} cm`);
    answer = `The charges are ${eng(r, 'm')} apart (${sf(r * 100)} cm).`;
  }
  return { answer: answer + mText(er, nm), lines, tip: 'Common mistakes: leaving charges in µC or the distance in cm (use coulombs and metres), forgetting to square the distance, and putting the minus signs into the force size (the signs only tell you attract or repel). Doubling the distance gives a quarter of the force.' };
}

const Q: [string, number][] = [['µC', 1e-6], ['nC', 1e-9], ['mC', 1e-3], ['pC', 1e-12], ['C', 1], ['e (electron charges)', E_CH]];
export const COULOMB_SPEC: SSpec = {
  id: 'coulomb',
  finds: [['F', 'The force F'], ['q1', 'Charge q₁'], ['q2', 'Charge q₂'], ['r', 'The distance r']],
  fields: [
    { k: 'q1', label: 'Charge q₁ (− for negative)', units: Q, neg: true, ph: 'e.g. 2' },
    { k: 'q2', label: 'Charge q₂ (− for negative)', units: Q, neg: true, ph: 'e.g. -3' },
    { k: 'r', label: 'Distance r between them', units: [['cm', 0.01], ['m', 1], ['mm', 1e-3], ['Å', 1e-10]], ph: 'e.g. 30' },
    { k: 'F', label: 'Force F (size)', units: [['N', 1], ['mN', 1e-3], ['µN', 1e-6], ['kN', 1e3]], show: (c) => c.find !== 'F', ph: 'e.g. 0.6' },
    { k: 'nature', kind: 'choice', label: 'The force is', def: 'rep', show: (c) => c.find === 'q1' || c.find === 'q2', options: [['rep', 'Repulsive (same signs)'], ['att', 'Attractive (opposite signs)']] },
    { k: 'med', kind: 'choice', label: 'Medium between them', def: 'air', options: [['air', 'Air or vacuum'], ['water', 'Water (εr about 80)'], ['custom', 'Other (type εr)']] },
    { k: 'er', label: 'Relative permittivity εr', units: [['', 1]], show: (c) => c.ch.med === 'custom', ph: 'e.g. 4' },
  ],
  presets: [
    { name: '+2 µC and −3 µC, 30 cm apart: find F', find: 'F', vals: { q1: '2', q2: '-3', r: '30' } },
    { name: 'Two +5 nC charges 2 cm apart: find F', find: 'F', vals: { q1: ['5', 'nC'], q2: ['5', 'nC'], r: '2' } },
    { name: 'Electron and proton in hydrogen (0.53 Å)', find: 'F', vals: { q1: ['-1', 'e (electron charges)'], q2: ['1', 'e (electron charges)'], r: ['0.53', 'Å'] } },
    { name: 'Charges 4 µC and 6 µC repel with 2.4 N: find r', find: 'r', vals: { q1: '4', q2: '6', F: '2.4' } },
    { name: '+3 µC and an unknown charge, 0.1 m, attract with 8.1 N', find: 'q2', vals: { q1: '3', r: ['0.1', 'm'], F: '8.1' }, ch: { nature: 'att' } },
  ],
  solve: (i, c) => coulomb(i, c),
};
