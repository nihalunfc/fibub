// "Solve my numbers" for Build an atom: protons, neutrons and electrons from the atomic number, mass number and charge;
// average atomic mass from isotope masses and abundances; and an isotope's abundance from the average. No DOM.
import { sf, type SSpec, type SIn, type SOut } from '../learn/solvecore-b.ts';
import { ELEMENTS } from './chem.ts';
import { shells, valency } from './atom.ts';

const int = (x: number) => Number.isInteger(x);

export function atomFromNumbers(i: Record<string, SIn>): SOut {
  const Z = i.Z.v, A = i.A.v, q = i.q && !i.q.blank ? i.q.v : 0;
  if (!int(Z) || Z < 1 || Z > 118) return { error: 'The atomic number Z is a whole number from 1 to 118 (the number of protons).' };
  if (!int(A) || A < 1) return { error: 'The mass number A is a whole number: protons plus neutrons.' };
  if (A < Z) return { error: `The mass number cannot be smaller than the atomic number: A = protons + neutrons, so A is at least Z (${Z}).` };
  if (!int(q)) return { error: 'The charge is a whole number such as 0, +1 or −2.' };
  const n = A - Z, e = Z - q, el = ELEMENTS[Z - 1];
  if (e < 0) return { error: `A charge of +${q} would mean removing more electrons than the atom has: an atom with ${Z} protons has ${Z} electrons, so the charge cannot be above +${Z}.` };
  const lines = [`Atomic number Z = protons = ${Z}, so the element is ${el.name.toLowerCase()} (${el.symbol}).`, `Neutrons = A − Z = ${A} − ${Z} = ${n}`];
  lines.push(q === 0 ? `Neutral atom: electrons = protons = ${Z}` : `Electrons = protons − charge = ${Z} − (${q > 0 ? '+' : ''}${String(q).replace('-', '−')}) = ${e}`);
  const parts = [`${Z} protons`, `${n} neutrons`, `${e} electrons`];
  if (e <= 20 && Z <= 20) {
    const sh = shells(e);
    lines.push(sh.length ? `Electrons in shells (K, L, M, N): ${sh.join(', ')}` : 'No electrons, so no shells.');
    if (q === 0) lines.push(`Valency = ${valency(Z)}${valency(Z) === 0 ? ' (full outer shell, so it hardly reacts)' : ''}`);
  } else if (e > 20) lines.push('Shell filling is shown here for up to 20 electrons (hydrogen to calcium), as the school method teaches.');
  const kind = q === 0 ? 'atom' : q > 0 ? 'positive ion (cation)' : 'negative ion (anion)';
  return { answer: `${el.name} ${kind}: ${parts.join(', ')}.`, lines, tip: 'Common mistake: using the mass number as the number of neutrons. Neutrons = mass number − atomic number. And for an ion the number of protons never changes: only the electrons do.' };
}

/** Relative atomic mass = Σ(mass × abundance) ÷ 100. */
export function averageMass(i: Record<string, SIn>): SOut {
  const m = i.ms.list, a = i.ab.list;
  if (m.length < 2) return { error: 'Give at least two isotope masses, for example 35 37.' };
  if (m.length !== a.length) return { error: `You typed ${m.length} masses but ${a.length} abundances. Give one abundance for each isotope.` };
  if (m.some((x) => !(x > 0)) || a.some((x) => x < 0)) return { error: 'Masses must be above zero and abundances cannot be negative.' };
  const sum = a.reduce((s, x) => s + x, 0);
  const asFrac = Math.abs(sum - 1) < 0.005, asPct = Math.abs(sum - 100) < 0.51;
  if (!asFrac && !asPct) return { error: `The abundances add up to ${sf(sum, 4)}. They should add up to 100 (percent) or 1 (fractions).` };
  const w = a.map((x) => (asFrac ? x * 100 : x));
  const total = m.reduce((s, x, k) => s + x * w[k], 0) / 100;
  const terms = m.map((x, k) => `${sf(x, 6)} × ${sf(w[k], 5)}`).join(' + ');
  const lines = ['Formula: average atomic mass = Σ (isotope mass × abundance %) ÷ 100', `= (${terms}) ÷ 100`, `= ${sf(total * 100, 6)} ÷ 100 = ${sf(total, 5)}`];
  if (asFrac) lines.unshift('Abundances typed as fractions are changed to percent: 0.75 = 75 %.');
  return { answer: `The average atomic mass is ${sf(total, 4)} u.`, lines, tip: 'Common mistake: just averaging the masses (35 + 37) ÷ 2. The more abundant isotope counts for more, so the average sits closer to it.' };
}

/** Two isotopes: percentage of the first from the average mass. */
export function abundanceFromAverage(i: Record<string, SIn>): SOut {
  const av = i.am.v, m1 = i.m1.v, m2 = i.m2.v;
  if (!(av > 0 && m1 > 0 && m2 > 0)) return { error: 'Masses must be above zero.' };
  if (m1 === m2) return { error: 'The two isotopes need different masses.' };
  const x = (av - m2) / (m1 - m2);
  if (x < 0 || x > 1) return { error: `The average mass must lie between the two isotope masses (${sf(Math.min(m1, m2), 6)} and ${sf(Math.max(m1, m2), 6)}). Check your numbers.` };
  const lines = ['Let x be the fraction of the first isotope; the second is 1 − x.', `Average = m₁ x + m₂ (1 − x), so x = (average − m₂) ÷ (m₁ − m₂)`, `x = (${sf(av, 6)} − ${sf(m2, 6)}) ÷ (${sf(m1, 6)} − ${sf(m2, 6)}) = ${sf(x, 5)}`, `Second isotope = 1 − ${sf(x, 5)} = ${sf(1 - x, 5)}`];
  return { answer: `The isotope of mass ${sf(m1, 6)} is ${sf(x * 100, 4)} % and the one of mass ${sf(m2, 6)} is ${sf((1 - x) * 100, 4)} %.`, lines, tip: 'Check: the average must lie between the two masses, and nearer the more abundant isotope.' };
}

export const ATOM_SPEC: SSpec = {
  id: 'atom',
  finds: [['atom', 'Protons, neutrons, electrons'], ['avg', 'Average atomic mass'], ['abund', 'Isotope abundance']],
  fields: [
    { k: 'Z', label: 'Atomic number Z (protons)', ph: 'e.g. 11', show: (c) => c.find === 'atom' },
    { k: 'A', label: 'Mass number A', ph: 'e.g. 23', show: (c) => c.find === 'atom' },
    { k: 'q', label: 'Charge (blank for a neutral atom)', neg: true, optional: true, ph: 'e.g. -1 or 2', show: (c) => c.find === 'atom' },
    { k: 'ms', label: 'Isotope masses', kind: 'list', ph: 'e.g. 35 37', show: (c) => c.find === 'avg' },
    { k: 'ab', label: 'Abundances (% or fractions)', kind: 'list', ph: 'e.g. 75 25', show: (c) => c.find === 'avg' },
    { k: 'am', label: 'Average atomic mass', ph: 'e.g. 10.8', show: (c) => c.find === 'abund' },
    { k: 'm1', label: 'Mass of isotope 1', ph: 'e.g. 10', show: (c) => c.find === 'abund' },
    { k: 'm2', label: 'Mass of isotope 2', ph: 'e.g. 11', show: (c) => c.find === 'abund' },
  ],
  presets: [
    { name: 'Sodium-23 atom: Z = 11, A = 23', find: 'atom', vals: { Z: '11', A: '23' } },
    { name: 'Chloride ion: Z = 17, A = 35, charge −1', find: 'atom', vals: { Z: '17', A: '35', q: '-1' } },
    { name: 'Magnesium ion: Z = 12, A = 24, charge +2', find: 'atom', vals: { Z: '12', A: '24', q: '2' } },
    { name: 'Chlorine: 35 (75 %) and 37 (25 %)', find: 'avg', vals: { ms: '35 37', ab: '75 25' } },
    { name: 'Boron: average 10.8 from masses 10 and 11', find: 'abund', vals: { am: '10.8', m1: '10', m2: '11' } },
  ],
  solve: (i, c) => (c.find === 'atom' ? atomFromNumbers(i) : c.find === 'avg' ? averageMass(i) : abundanceFromAverage(i)),
};
