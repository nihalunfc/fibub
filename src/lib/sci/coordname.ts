// Coordination compound namer (school level, Class 12 chemistry): build a complex from a metal, an oxidation state,
// ligands and counter ions, and get its formula, IUPAC name (2005 rules as used in schools: ligands in alphabetical
// order, -ido anions, "ate" for anionic complexes, oxidation state in Roman numerals), coordination number, charge,
// ions in water and Werner's silver chloride count. Pure functions, no DOM.

export type Ligand = { id: string; formula: string; name: string; charge: number; dent: number; enclose?: boolean };
/** Listed in the order they go inside the formula brackets (alphabetical by symbol or abbreviation). */
export const LIGANDS: Ligand[] = [
  { id: 'Br', formula: 'Br', name: 'bromido', charge: -1, dent: 1 },
  { id: 'CN', formula: 'CN', name: 'cyanido', charge: -1, dent: 1 },
  { id: 'CO', formula: 'CO', name: 'carbonyl', charge: 0, dent: 1 },
  { id: 'Cl', formula: 'Cl', name: 'chlorido', charge: -1, dent: 1 },
  { id: 'en', formula: 'en', name: 'ethane-1,2-diamine', charge: 0, dent: 2, enclose: true },
  { id: 'F', formula: 'F', name: 'fluorido', charge: -1, dent: 1 },
  { id: 'H2O', formula: 'H₂O', name: 'aqua', charge: 0, dent: 1 },
  { id: 'NH3', formula: 'NH₃', name: 'ammine', charge: 0, dent: 1 },
  { id: 'NO2', formula: 'NO₂', name: 'nitrito-N', charge: -1, dent: 1 },
  { id: 'OH', formula: 'OH', name: 'hydroxido', charge: -1, dent: 1 },
  { id: 'ox', formula: 'ox', name: 'oxalato', charge: -2, dent: 2 },
  { id: 'SCN', formula: 'SCN', name: 'thiocyanato-S', charge: -1, dent: 1 },
];
export const LIG = Object.fromEntries(LIGANDS.map((l) => [l.id, l])) as Record<string, Ligand>;

export type Metal = { sym: string; name: string; ate: string; ox: number[] };
export const METALS: Metal[] = [
  { sym: 'Co', name: 'cobalt', ate: 'cobaltate', ox: [2, 3] },
  { sym: 'Cr', name: 'chromium', ate: 'chromate', ox: [3] },
  { sym: 'Fe', name: 'iron', ate: 'ferrate', ox: [2, 3] },
  { sym: 'Ni', name: 'nickel', ate: 'nickelate', ox: [0, 2] },
  { sym: 'Cu', name: 'copper', ate: 'cuprate', ox: [1, 2] },
  { sym: 'Pt', name: 'platinum', ate: 'platinate', ox: [2, 4] },
  { sym: 'Ag', name: 'silver', ate: 'argentate', ox: [1] },
  { sym: 'Zn', name: 'zinc', ate: 'zincate', ox: [2] },
  { sym: 'Mn', name: 'manganese', ate: 'manganate', ox: [2] },
];
export const METAL = Object.fromEntries(METALS.map((m) => [m.sym, m])) as Record<string, Metal>;

export type Counter = { id: string; formula: string; name: string; charge: number; poly?: boolean };
export const COUNTERS: Counter[] = [
  { id: 'Cl', formula: 'Cl', name: 'chloride', charge: -1 },
  { id: 'Br', formula: 'Br', name: 'bromide', charge: -1 },
  { id: 'NO3', formula: 'NO₃', name: 'nitrate', charge: -1, poly: true },
  { id: 'SO4', formula: 'SO₄', name: 'sulfate', charge: -2, poly: true },
  { id: 'K', formula: 'K', name: 'potassium', charge: 1 },
  { id: 'Na', formula: 'Na', name: 'sodium', charge: 1 },
];
export const COUNTER = Object.fromEntries(COUNTERS.map((c) => [c.id, c])) as Record<string, Counter>;

const SIMPLE = ['', '', 'di', 'tri', 'tetra', 'penta', 'hexa'];
const COMPLEX = ['', '', 'bis', 'tris', 'tetrakis', 'pentakis', 'hexakis'];
const ROMAN = ['0', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];
const SUB = (n: number) => String(n).replace(/\d/g, (d) => '₀₁₂₃₄₅₆₇₈₉'[Number(d)]);

export type Spec = { metal: string; ox: number; ligands: Record<string, number>; counter?: string };

export function analyse(s: Spec) {
  const m = METAL[s.metal];
  if (!m) throw new Error('Pick a metal.');
  const used = LIGANDS.filter((l) => (s.ligands[l.id] ?? 0) > 0);
  if (!used.length) throw new Error('Add at least one ligand.');
  for (const l of used) { const n = s.ligands[l.id]; if (!Number.isInteger(n) || n < 0 || n > 6) throw new Error('Use 0 to 6 of each ligand.'); }
  const cn = used.reduce((a, l) => a + l.dent * s.ligands[l.id], 0);
  const charge = s.ox + used.reduce((a, l) => a + l.charge * s.ligands[l.id], 0);
  // formula inside the brackets: metal, then ligands in the listed order
  // a one-element ligand (Cl, Br, F) is written bare; polyatomic ligands and abbreviations go in brackets
  const inner = m.sym + used.map((l) => {
    const n = s.ligands[l.id], f = /^[A-Z][a-z]?$/.test(l.formula) ? l.formula : `(${l.formula})`;
    return n > 1 ? f + SUB(n) : f;
  }).join('');
  const ion = `[${inner}]`;
  // name: ligands alphabetically by name (prefixes ignored), then the metal
  const byName = [...used].sort((a, b) => a.name.localeCompare(b.name));
  const ligName = byName.map((l) => {
    const n = s.ligands[l.id];
    if (l.enclose) return `${n > 1 ? COMPLEX[n] : ''}(${l.name})`;
    return `${SIMPLE[n]}${l.name}`;
  }).reduce((acc, part) => acc + (/-[NS]$/.test(acc) ? '-' : '') + part, '');
  const metalWord = charge < 0 ? m.ate : m.name;
  const complexName = `${ligName}${/-[NS]$/.test(ligName) ? '-' : ''}${metalWord}(${ROMAN[s.ox]})`;
  const geometry = cn === 2 ? 'linear' : cn === 4 ? 'tetrahedral or square planar' : cn === 6 ? 'octahedral' : 'unusual for school examples';
  let formula = ion, name = complexName, nComplex = 1, nCounter = 0, counter: Counter | undefined;
  const sgn = (z: number) => (z === 0 ? '' : `${Math.abs(z) > 1 ? Math.abs(z) : ''}${z > 0 ? '+' : '−'}`);
  if (charge !== 0) {
    counter = s.counter ? COUNTER[s.counter] : undefined;
    if (!counter || Math.sign(counter.charge) === Math.sign(charge)) throw new Error(charge > 0 ? 'A positive complex needs a negative counter ion (chloride, bromide, nitrate or sulfate).' : 'A negative complex needs a positive counter ion (potassium or sodium).');
    const g = gcd(Math.abs(charge), Math.abs(counter.charge));
    nComplex = Math.abs(counter.charge) / g; nCounter = Math.abs(charge) / g;
    const cPart = nCounter > 1 ? (counter.poly ? `(${counter.formula})${SUB(nCounter)}` : `${counter.formula}${SUB(nCounter)}`) : counter.formula;
    const xPart = nComplex > 1 ? `${ion}${SUB(nComplex)}` : ion;
    formula = charge > 0 ? xPart + cPart : cPart + xPart;
    name = charge > 0 ? `${complexName} ${counter.name}` : `${counter.name} ${complexName}`;
  }
  const agcl = charge > 0 && counter?.id === 'Cl' ? nCounter / nComplex : 0;
  return { cn, charge, ionCharge: sgn(charge), ion, formula, name, complexName, geometry, ionsInWater: charge === 0 ? 0 : nComplex + nCounter, nComplex, nCounter, agclPerMole: agcl };
}
const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);

/** Teaching examples, including Werner's cobalt(III) ammine chlorides. */
export const PRESETS: { label: string; spec: Spec }[] = [
  { label: 'CoCl₃·6NH₃', spec: { metal: 'Co', ox: 3, ligands: { NH3: 6 }, counter: 'Cl' } },
  { label: 'CoCl₃·5NH₃', spec: { metal: 'Co', ox: 3, ligands: { NH3: 5, Cl: 1 }, counter: 'Cl' } },
  { label: 'CoCl₃·4NH₃', spec: { metal: 'Co', ox: 3, ligands: { NH3: 4, Cl: 2 }, counter: 'Cl' } },
  { label: 'K₃[Fe(CN)₆]', spec: { metal: 'Fe', ox: 3, ligands: { CN: 6 }, counter: 'K' } },
  { label: 'K₄[Fe(CN)₆]', spec: { metal: 'Fe', ox: 2, ligands: { CN: 6 }, counter: 'K' } },
  { label: '[Ni(CO)₄]', spec: { metal: 'Ni', ox: 0, ligands: { CO: 4 } } },
  { label: '[Cu(NH₃)₄]SO₄', spec: { metal: 'Cu', ox: 2, ligands: { NH3: 4 }, counter: 'SO4' } },
  { label: '[Co(en)₃]Cl₃', spec: { metal: 'Co', ox: 3, ligands: { en: 3 }, counter: 'Cl' } },
  { label: '[PtCl₂(NH₃)₂]', spec: { metal: 'Pt', ox: 2, ligands: { NH3: 2, Cl: 2 } } },
  { label: 'K₃[Fe(ox)₃]', spec: { metal: 'Fe', ox: 3, ligands: { ox: 3 }, counter: 'K' } },
];
