// Class 9 Science, Chapter 9 Atomic Foundations of Matter: live problems (original fibub questions). Ids start with c9s-matter-.
import { pick, choose, n, steps } from './_util.js';

const NA = 6.022e23;
export default {
  'c9s-matter-conserve': {
    title: 'conservation of mass in a reaction',
    make(r) {
      const a = pick(r, 10, 80, 2), b = pick(r, 10, 80, 2), gas = pick(r, 2, 8, 1), answer = a + b - gas;
      return { a, b, gas, q: `<p>${a} g of one reactant and ${b} g of another react in an open flask and ${gas} g of gas escapes. What is the total mass of the substances left in the flask?</p>`, answer, unit: 'g', tol: 0.005,
        hint: 'Mass is conserved: total mass before = total mass after, counting the gas that escaped.',
        solution: steps(`Mass before = ${a} + ${b} = ${a + b} g.`, `Mass left = ${a + b} − ${gas} = <b>${answer} g</b>.`) };
    },
    verify: (x) => x.a - x.gas + x.b,
  },
  'c9s-matter-proportions': {
    title: 'constant proportions in water',
    make(r) {
      const m = pick(r, 9, 180, 9), answer = (8 * m) / 9;
      return { m, q: `<p>Water always contains hydrogen and oxygen in the mass ratio 1 : 8. How many grams of oxygen are in ${m} g of water?</p>`, answer, unit: 'g', tol: 0.005,
        hint: 'The mass is split into 1 + 8 = 9 equal parts. Oxygen takes 8 of them.',
        solution: steps(`Parts = 1 + 8 = 9; one part = ${m} ÷ 9 = ${n(m / 9)} g.`, `Oxygen = 8 × ${n(m / 9)} = <b>${n(answer)} g</b>.`) };
    },
    verify: (x) => x.m - x.m / 9,
  },
  'c9s-matter-molmass': {
    title: 'molecular or formula unit mass',
    make(r) {
      const sub = choose(r, [['H₂O', 18, '2 × 1 + 16'], ['CO₂', 44, '12 + 2 × 16'], ['NH₃', 17, '14 + 3 × 1'], ['H₂SO₄', 98, '2 × 1 + 32 + 4 × 16'], ['CaCO₃', 100, '40 + 12 + 3 × 16'], ['NaOH', 40, '23 + 16 + 1'], ['CH₄', 16, '12 + 4 × 1'], ['HNO₃', 63, '1 + 14 + 3 × 16']]);
      return { sub, q: `<p>Find the molecular (or formula unit) mass of ${sub[0]} in u. (H = 1, C = 12, N = 14, O = 16, Na = 23, S = 32, Ca = 40.)</p>`, answer: sub[1], unit: 'u', tol: 0.005,
        hint: 'Add the atomic masses of all the atoms in the formula, counting each by its subscript.',
        solution: steps(`${sub[0]}: ${sub[2]}.`, `Mass = <b>${sub[1]} u</b>.`) };
    },
    verify: (x) => ({ 'H₂O': 2 + 16, 'CO₂': 12 + 32, 'NH₃': 14 + 3, 'H₂SO₄': 2 + 32 + 64, 'CaCO₃': 40 + 12 + 48, 'NaOH': 40, 'CH₄': 16, 'HNO₃': 63 })[x.sub[0]],
  },
  'c9s-matter-moles': {
    title: 'moles from a given mass',
    make(r) {
      const sub = choose(r, [['water', 18], ['carbon dioxide', 44], ['oxygen gas (O₂)', 32], ['sodium chloride', 58.5], ['calcium carbonate', 100]]), m = pick(r, 9, 200, 1), answer = m / sub[1];
      return { sub, m, q: `<p>How many moles are there in ${m} g of ${sub[0]}? (Molar mass = ${sub[1]} g/mol.)</p>`, answer, unit: 'mol', tol: 0.01,
        hint: 'Moles = given mass ÷ molar mass.',
        solution: steps(`n = m ÷ M = ${m} ÷ ${sub[1]}.`, `n = <b>${n(answer)} mol</b>.`) };
    },
    verify: (x) => x.m * (1 / x.sub[1]),
  },
  'c9s-matter-particles': {
    title: 'number of particles in a sample',
    make(r) {
      const sub = choose(r, [['water molecules', 18], ['carbon atoms', 12], ['oxygen molecules', 32], ['iron atoms', 56]]), m = pick(r, 6, 120, 6), answer = (m / sub[1]) * NA;
      return { sub, m, q: `<p>How many ${sub[0]} are there in ${m} g of the substance? (Molar mass ${sub[1]} g/mol; Avogadro’s number = 6.022 × 10²³.)</p>`, answer, unit: sub[0].split(' ')[1] === 'atoms' ? 'atoms' : 'molecules', tol: 0.01,
        hint: 'First find the moles (mass ÷ molar mass), then multiply by Avogadro’s number.',
        solution: steps(`n = ${m} ÷ ${sub[1]} = ${n(m / sub[1])} mol.`, `N = ${n(m / sub[1])} × 6.022 × 10²³ = <b>${n(answer)}</b>.`) };
    },
    verify: (x) => (x.m * NA) / x.sub[1],
  },
  'c9s-matter-criss': {
    title: 'a formula from charges by criss-cross',
    make(r) {
      const cq = pick(r, 1, 3), aq = pick(r, 1, 3), g = (a, b) => (b ? g(b, a % b) : a), d = g(cq, aq), answer = cq / d;
      return { cq, aq, q: `<p>A metal ion has a charge of +${cq} and a non-metal ion has a charge of −${aq}. How many atoms of the <b>non-metal</b> are there in the formula of the compound? (Use the smallest whole numbers.)</p>`, answer, unit: '', tol: 0, abs: 0.01,
        hint: 'Criss-cross: the metal’s charge number becomes the non-metal’s subscript. Then divide both subscripts by any common factor.',
        solution: steps(`Criss-cross: metal gets ${aq}, non-metal gets ${cq}.`, `Common factor ${d}: metal ${aq / d}, non-metal <b>${cq / d}</b>.`) };
    },
    verify: (x) => { let L = x.cq; while (L % x.aq) L += x.cq; return L / x.aq; },
  },
};
