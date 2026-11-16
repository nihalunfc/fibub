// "Solve my numbers" for the bond enthalpy estimator: ΔH ≈ Σ(bonds broken) − Σ(bonds made) from the bonds a student
// lists, or one unknown average bond enthalpy found from a given ΔH. Plain maths, no DOM. Engine: solvecore-b.ts.
import { sf, type SSpec, type SIn, type SOut } from '../learn/solvecore-b.ts';

const KJ: [string, number][] = [['kJ/mol', 1], ['kcal/mol', 4.184]];
const KCAL = 4.184;

type Side = { sum: number; text: string; used: boolean } | { error: string };
/** One side of the equation: counts like "4 2" and energies like "413 498" give 4 × 413 + 2 × 498. */
function side(n: SIn | undefined, e: SIn | undefined, what: string): Side {
  const nb = !n || n.blank, eb = !e || e.blank;
  if (nb && eb) return { sum: 0, text: '', used: false };
  if (nb || eb) return { error: `For the bonds ${what}, fill in both how many of each bond and the energy of each bond.` };
  if (n!.list.length !== e!.list.length) return { error: `The bonds ${what}: you typed ${n!.list.length} count${n!.list.length === 1 ? '' : 's'} but ${e!.list.length} energ${e!.list.length === 1 ? 'y' : 'ies'}. Give one count for each bond energy, in the same order.` };
  if (n!.list.some((x) => x < 0)) return { error: `Counts of bonds ${what} cannot be negative.` };
  if (e!.list.some((x) => x <= 0)) return { error: `Bond energies (bonds ${what}) must be above zero.` };
  const terms = n!.list.map((c, i) => `${sf(c, 6)} × ${sf(e!.typedList[i], 6)}`);
  const sum = n!.list.reduce((s, c, i) => s + c * e!.list[i], 0);
  const t = terms.join(' + ');
  return { sum, text: e!.u === 'kcal/mol' ? `(${t}) kcal × 4.184` : t, used: true };
}
const kc = (kj: number) => `${sf(kj / KCAL, 4)} kcal/mol`;

export function bond(i: Record<string, SIn>, c: { find: string; ch: Record<string, string> }): SOut {
  const b = side(i.nb, i.eb, 'broken'), m = side(i.nm, i.em, 'made');
  if ('error' in b) return { error: b.error };
  if ('error' in m) return { error: m.error };
  const kcalUsed = [i.eb, i.em, i.dH].some((x) => x && !x.blank && x.u === 'kcal/mol');
  const conv = kcalUsed ? ['Energies in kcal/mol are converted: 1 kcal = 4.184 kJ.'] : [];
  const tip = 'Common mistake: turning the formula round. It is ΔH = bonds broken − bonds made (energy in minus energy out). A negative ΔH means the reaction gives out heat (exothermic). Count every bond: 2H₂O has four O–H bonds, not two.';
  if (c.find === 'dH') {
    if (!b.used && !m.used) return { idle: 'Fill in the bonds broken and the bonds made to find ΔH.' };
    const dH = b.sum - m.sum;
    const lines = [...conv, 'Formula: ΔH ≈ Σ(bond energies broken) − Σ(bond energies made)'];
    lines.push(`Energy in (bonds broken) = ${b.used ? `${b.text} = ${sf(b.sum, 5)} kJ` : '0 kJ'}`);
    lines.push(`Energy out (bonds made) = ${m.used ? `${m.text} = ${sf(m.sum, 5)} kJ` : '0 kJ'}`);
    lines.push(`ΔH ≈ ${sf(b.sum, 5)} − ${sf(m.sum, 5)} = ${sf(dH, 5)} kJ/mol (${kc(dH)})`);
    const kind = dH < 0 ? 'exothermic (gives out heat)' : dH > 0 ? 'endothermic (takes in heat)' : 'about zero (little heat in or out)';
    return { answer: `ΔH ≈ ${sf(dH, 4)} kJ/mol: ${kind}.`, lines, tip: `${tip} Bond enthalpies are averages, so the answer is an estimate.` };
  }
  // find one unknown average bond enthalpy
  const dHv = i.dH.v, n = i.n && !i.n.blank ? i.n.v : 1, onMade = c.ch.side === 'made';
  if (!(n > 0)) return { error: 'The number of the unknown bond must be more than 0.' };
  if (!b.used && !m.used) return { idle: 'Fill in the bonds you know (broken or made) and ΔH to find the unknown bond energy.' };
  const lines = [...conv, 'Formula: ΔH = Σ broken − Σ made, so the unknown is the one thing left over.'];
  lines.push(`Known energy in (bonds broken) = ${b.used ? sf(b.sum, 5) : '0'} kJ; known energy out (bonds made) = ${m.used ? sf(m.sum, 5) : '0'} kJ`);
  let x: number;
  if (onMade) { x = (b.sum - m.sum - dHv) / n; lines.push(`Unknown bonds are made: ΔH = ${sf(b.sum, 5)} − (${sf(m.sum, 5)} + ${sf(n, 4)} × X) = ${sf(dHv, 6)}`, `${sf(n, 4)} × X = ${sf(b.sum, 5)} − ${sf(m.sum, 5)} − (${sf(dHv, 6)}) = ${sf(n * x, 6)}`); }
  else { x = (dHv - b.sum + m.sum) / n; lines.push(`Unknown bonds are broken: ΔH = (${sf(b.sum, 5)} + ${sf(n, 4)} × X) − ${sf(m.sum, 5)} = ${sf(dHv, 6)}`, `${sf(n, 4)} × X = ${sf(dHv, 6)} − ${sf(b.sum, 5)} + ${sf(m.sum, 5)} = ${sf(n * x, 6)}`); }
  if (!(x > 0)) return { error: `That gives a bond energy of ${sf(x, 4)} kJ/mol, which is not possible: a bond energy is always positive. Check the sign of ΔH and whether the unknown bond is broken or made.` };
  lines.push(`X = ${sf(n * x, 6)} ÷ ${sf(n, 4)} = ${sf(x, 6)} kJ/mol (${kc(x)})`);
  return { answer: `The average bond enthalpy is about ${sf(x, 4)} kJ/mol.`, lines, tip: 'Common mistake: putting the unknown bond on the wrong side. Bonds in the reactants are broken; bonds in the products are made. Count all of them, for example NH₃ has three N–H bonds, so 2NH₃ has six.' };
}

export const BOND_SPEC: SSpec = {
  id: 'bond',
  finds: [['dH', 'Reaction enthalpy ΔH'], ['bond', 'An unknown bond energy']],
  fields: [
    { k: 'nb', label: 'Bonds broken: how many of each', kind: 'list', optional: true, ph: 'e.g. 4 2' },
    { k: 'eb', label: 'Bonds broken: energy of each', kind: 'list', units: KJ, optional: true, ph: 'e.g. 413 498' },
    { k: 'nm', label: 'Bonds made: how many of each', kind: 'list', optional: true, ph: 'e.g. 2 4' },
    { k: 'em', label: 'Bonds made: energy of each', kind: 'list', units: KJ, optional: true, ph: 'e.g. 799 463' },
    { k: 'dH', label: 'Given ΔH (negative if heat is given out)', units: KJ, neg: true, ph: 'e.g. -92' },
    { k: 'side', label: 'The unknown bond is', kind: 'choice', options: [['broken', 'broken (in the reactants)'], ['made', 'made (in the products)']], def: 'made', show: (c) => c.find === 'bond' },
    { k: 'n', label: 'How many of the unknown bond', optional: true, ph: '1', show: (c) => c.find === 'bond' },
  ],
  presets: [
    { name: 'Burning methane: CH₄ + 2O₂ → CO₂ + 2H₂O', find: 'dH', vals: { nb: '4 2', eb: '413 498', nm: '2 4', em: '799 463' } },
    { name: 'H₂ + Cl₂ → 2HCl', find: 'dH', vals: { nb: '1 1', eb: '436 243', nm: '2', em: '431' } },
    { name: 'Same, with energies in kcal/mol', find: 'dH', vals: { nb: '1 1', eb: ['104.2 58.1', 'kcal/mol'], nm: '2', em: ['103.0', 'kcal/mol'] } },
    { name: 'N₂ + 3H₂ → 2NH₃ has ΔH = −92: find N–H', find: 'bond', vals: { nb: '1 3', eb: '945 436', dH: '-92', n: '6' }, ch: { side: 'made' } },
  ],
  solve: (i, c) => bond(i, c),
};
