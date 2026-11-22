// Class 10 Science, Carbon and its Compounds: live problems (original fibub questions). Ids start with c10s-carb-.
import { pick, choose, n, steps } from './_util.js';

const NM = ['meth', 'eth', 'prop', 'but', 'pent', 'hex', 'hept', 'oct', 'non', 'dec'];
export default {
  'c10s-carb-formula': {
    title: 'hydrogen atoms in a hydrocarbon',
    make(r) {
      const c = pick(r, 3, 12), kind = choose(r, ['alkane', 'alkene', 'alkyne']), H = kind === 'alkane' ? 2 * c + 2 : kind === 'alkene' ? 2 * c : 2 * c - 2;
      return { c, kind, q: `<p>A straight-chain ${kind} has ${c} carbon atoms (${kind === 'alkane' ? 'only single bonds' : kind === 'alkene' ? 'one C=C double bond' : 'one C≡C triple bond'}). How many hydrogen atoms does one molecule have?</p>`, answer: H, unit: 'H atoms', tol: 0,
        abs: 0.01, hint: 'Carbon has valency 4. Count the bonds the carbon chain itself uses; every remaining valency is joined to an H.',
        solution: steps(`General formula: ${kind === 'alkane' ? 'C<sub>n</sub>H<sub>2n+2</sub>' : kind === 'alkene' ? 'C<sub>n</sub>H<sub>2n</sub>' : 'C<sub>n</sub>H<sub>2n−2</sub>'}.`, `With n = ${c}: H = <b>${H}</b>, so the formula is C<sub>${c}</sub>H<sub>${H}</sub>.`) };
    },
    verify: (x) => { const bonds = (x.c - 1) + (x.kind === 'alkane' ? 0 : x.kind === 'alkene' ? 1 : 2); return 4 * x.c - 2 * bonds; },
  },
  'c10s-carb-mass': {
    title: 'molecular mass of an alkane',
    make(r) {
      const c = pick(r, 2, 14);
      return { c, q: `<p>Find the molecular mass of the alkane with ${c} carbon atoms. (C = 12 u, H = 1 u.)</p>`, answer: 12 * c + 2 * c + 2, unit: 'u', tol: 0.001,
        hint: 'First write the formula C<sub>n</sub>H<sub>2n+2</sub>, then add the atomic masses.',
        solution: steps(`Formula: C<sub>${c}</sub>H<sub>${2 * c + 2}</sub>.`, `Mass = ${c} × 12 + ${2 * c + 2} × 1 = <b>${12 * c + 2 * c + 2} u</b>.`) };
    },
    verify: (x) => 16 + 14 * (x.c - 1),
  },
  'c10s-carb-bonds': {
    title: 'count the covalent bonds',
    make(r) {
      const c = pick(r, 2, 12);
      return { c, q: `<p>How many covalent bonds (shared pairs of electrons) are there in one molecule of the alkane with ${c} carbon atoms? Count every C–C and C–H bond.</p>`, answer: 3 * c + 1, unit: 'bonds', tol: 0, abs: 0.01,
        hint: 'C–C bonds in a chain: n − 1. Each of the 2n + 2 hydrogens makes one C–H bond.',
        solution: steps(`C–C bonds = ${c} − 1 = ${c - 1}.`, `C–H bonds = 2 × ${c} + 2 = ${2 * c + 2}.`, `Total = <b>${3 * c + 1}</b>.`) };
    },
    verify: (x) => (4 * x.c + (2 * x.c + 2)) / 2,
  },
  'c10s-carb-co2': {
    title: 'carbon dioxide from burning an alkane',
    make(r) {
      const c = pick(r, 1, 8), m = pick(r, 10, 200, 10), M = 14 * c + 2;
      return { c, m, q: `<p>${m} g of the alkane with ${c} carbon atom${c > 1 ? 's' : ''} (${NM[c - 1]}ane, C<sub>${c}</sub>H<sub>${2 * c + 2}</sub>) is burnt completely in air. What mass of carbon dioxide forms? (C = 12, H = 1, O = 16.)</p>`, answer: (m / M) * c * 44, unit: 'g', tol: 0.01,
        hint: 'Each molecule of alkane gives n molecules of CO₂. Work in moles: mass ÷ molar mass.',
        solution: steps(`Molar mass of the alkane = ${M} g/mol, so ${m} g = ${n(m / M)} mol.`, `Each mole gives ${c} mol of CO₂ (44 g/mol).`, `Mass of CO₂ = ${n(m / M)} × ${c} × 44 = <b>${n((m / M) * c * 44)} g</b>.`) };
    },
    verify: (x) => (x.m * (12 * x.c) / (14 * x.c + 2)) * 44 / 12,
  },
  'c10s-carb-acid': {
    title: 'baking soda and vinegar',
    make(r) {
      const m = pick(r, 6, 120, 6);
      return { m, q: `<p>Ethanoic acid reacts with sodium hydrogencarbonate: CH₃COOH + NaHCO₃ → CH₃COONa + H₂O + CO₂. How many grams of NaHCO₃ (84 g/mol) are needed to react completely with ${m} g of pure ethanoic acid (60 g/mol)?</p>`, answer: (m / 60) * 84, unit: 'g', tol: 0.01,
        hint: 'One mole of acid reacts with one mole of NaHCO₃.',
        solution: steps(`Moles of acid = ${m} ÷ 60 = ${n(m / 60)}.`, `Same moles of NaHCO₃: ${n(m / 60)} × 84 = <b>${n((m / 60) * 84)} g</b>.`) };
    },
    verify: (x) => x.m * 1.4,
  },
  'c10s-carb-ethanol': {
    title: 'energy from burning ethanol',
    make(r) {
      const m = pick(r, 5, 100, 5);
      return { m, q: `<p>Ethanol (46 g/mol) releases about 1367 kJ for every mole burnt completely (C₂H₅OH + 3O₂ → 2CO₂ + 3H₂O). How much heat, in kJ, comes from ${m} g of ethanol?</p>`, answer: (m / 46) * 1367, unit: 'kJ', tol: 0.01,
        hint: 'Find the number of moles, then multiply by the energy per mole.',
        solution: steps(`Moles = ${m} ÷ 46 = ${n(m / 46)} mol.`, `Heat = ${n(m / 46)} × 1367 = <b>${n((m / 46) * 1367)} kJ</b> (about 29.7 kJ per gram).`) };
    },
    verify: (x) => x.m * (1367 / 46),
  },
};
