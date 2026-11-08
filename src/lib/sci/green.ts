// Green chemistry metrics: atom economy (Trost), carbon efficiency, reaction mass efficiency, yield, E-factor (Sheldon)
// and process mass intensity (ACS GCI Pharmaceutical Roundtable), from a balanced reaction and the masses used.
import { molarMass, byElement, type Balanced } from './chem.ts';

const carbons = (b: Balanced, i: number) => byElement(b.species[i].formula).get('C') ?? 0;

/** Atom economy (%) of product p: ν·M(product) / Σ ν·M(reactants). */
export function atomEconomy(b: Balanced, p: number) {
  const top = b.coefficients[p] * molarMass(b.species[p].formula);
  const bottom = b.species.reduce((s, x, i) => s + (x.side === 'reactant' ? b.coefficients[i] * molarMass(x.formula) : 0), 0);
  return (100 * top) / bottom;
}
/** Stoichiometric carbon economy (%): carbon atoms in ν·product over carbon atoms in all ν·reactants (null if no carbon). */
export function carbonEconomy(b: Balanced, p: number) {
  const top = b.coefficients[p] * carbons(b, p), bottom = b.species.reduce((s, x, i) => s + (x.side === 'reactant' ? b.coefficients[i] * carbons(b, i) : 0), 0);
  return bottom ? (100 * top) / bottom : null;
}

export type Other = { name: string; mass: number; water: boolean };
/** Parse "name, mass in g" lines; water when the name says so. Returns the rows and the line numbers that failed. */
export function parseOthers(text: string): { rows: Other[]; bad: number[] } {
  const rows: Other[] = [], bad: number[] = [];
  text.split(/\r?\n/).forEach((line, i) => {
    const t = line.trim(); if (!t) return;
    const m = /^(.*?)[,;\t]\s*([0-9]*\.?[0-9]+(?:e[-+]?\d+)?)\s*(?:g)?\s*$/i.exec(t);
    if (!m || !m[1].trim()) { bad.push(i + 1); return; }
    rows.push({ name: m[1].trim(), mass: Number(m[2]), water: /\bwater\b|^h2o$/i.test(m[1].trim()) });
  });
  return { rows, bad };
}

/** Mass-based metrics. reactantMass[i] in g for reactant species (undefined = not weighed), product mass in g. */
export function metrics(b: Balanced, p: number, reactantMass: (number | undefined)[], productMass: number, others: Other[]) {
  const mol = b.species.map((s, i) => (s.side === 'reactant' && reactantMass[i] !== undefined ? reactantMass[i]! / molarMass(s.formula) : undefined));
  // Limiting reagent: the smallest moles / ν among weighed reactants.
  let lim = -1, ext = Infinity;
  mol.forEach((n, i) => { if (n !== undefined && n / b.coefficients[i] < ext) { ext = n / b.coefficients[i]; lim = i; } });
  const nProd = productMass / molarMass(b.species[p].formula);
  const theo = lim >= 0 ? ext * b.coefficients[p] : NaN;
  const reactMass = reactantMass.reduce<number>((s, m) => s + (m ?? 0), 0);
  const otherMass = others.reduce((s, o) => s + o.mass, 0), water = others.reduce((s, o) => s + (o.water ? o.mass : 0), 0);
  const total = reactMass + otherMass;
  const cIn = mol.reduce<number>((s, n, i) => s + (n ?? 0) * carbons(b, i), 0);
  return {
    limiting: lim, theoretical: theo * molarMass(b.species[p].formula), yieldPct: (100 * nProd) / theo,
    rme: (100 * productMass) / reactMass,
    carbonEff: cIn ? (100 * nProd * carbons(b, p)) / cIn : null,
    totalIn: total, water,
    eFactor: (total - productMass) / productMass,
    eFactorNoWater: (total - water - productMass) / productMass,
    pmi: total / productMass,
  };
}
