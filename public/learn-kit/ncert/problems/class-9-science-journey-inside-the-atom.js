// Class 9 Science, Chapter 8 Journey Inside the Atom: live problems (original fibub questions). Ids start with c9s-atom-.
import { pick, choose, n, steps } from './_util.js';

const SYM = ['', 'H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne', 'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar', 'K', 'Ca'];
const conf = (z) => { const c = []; let k = z; for (const cap of [2, 8, 8, 2]) { const x = Math.min(cap, k); if (x > 0) c.push(x); k -= x; } return c; };

export default {
  'c9s-atom-neutrons': {
    title: 'neutrons from mass number and atomic number',
    make(r) {
      const Z = pick(r, 3, 20), extra = pick(r, 0, 4), A = 2 * Z + extra + (Z > 8 ? 0 : 0), answer = A - Z;
      return { Z, A, q: `<p>An atom of ${SYM[Z]} has atomic number ${Z} and mass number ${A}. How many neutrons does it have?</p>`, answer, unit: 'neutrons', tol: 0, abs: 0.01,
        hint: 'Mass number A = protons + neutrons, and the atomic number Z is the number of protons.',
        solution: steps(`Neutrons = A − Z = ${A} − ${Z}.`, `= <b>${answer}</b>.`) };
    },
    verify: (x) => x.A - x.Z,
  },
  'c9s-atom-ion': {
    title: 'electrons in an ion',
    make(r) {
      const Z = pick(r, 3, 20), q = choose(r, [-2, -1, 1, 2, 3]), answer = Z - q;
      if (answer < 0) return this.make(() => 0.9);
      return { Z, q, q_: 0, q: `<p>An ion of an element with atomic number ${Z} has a charge of ${q > 0 ? '+' + q : '−' + Math.abs(q)}. How many electrons does the ion have?</p>`, qq: q, answer, unit: 'electrons', tol: 0, abs: 0.01,
        hint: 'A neutral atom has Z electrons. A positive ion has lost electrons; a negative ion has gained them.',
        solution: steps(`Neutral atom: ${Z} electrons.`, `Charge ${q > 0 ? '+' : '−'}${Math.abs(q)} means it has ${q > 0 ? 'lost' : 'gained'} ${Math.abs(q)}: ${Z} ${q > 0 ? '−' : '+'} ${Math.abs(q)} = <b>${answer}</b> electrons.`) };
    },
    verify: (x) => x.Z - x.qq,
  },
  'c9s-atom-valency': {
    title: 'valency from the atomic number',
    make(r) {
      const Z = choose(r, [3, 7, 8, 9, 11, 12, 13, 15, 16, 17, 19, 20]), c = conf(Z), o = c.at(-1), answer = o <= 4 ? o : 8 - o;
      return { Z, q: `<p>The atomic number of an element is ${Z}. Using shells that hold 2, 8, 8 electrons, find its valency.</p>`, answer, unit: '', tol: 0, abs: 0.01,
        hint: 'Write the electron arrangement. Valency = outer electrons if there are 4 or fewer, otherwise 8 minus the outer electrons.',
        solution: steps(`Electron arrangement: ${c.join(', ')}.`, `Outer electrons = ${o}, so valency = ${o <= 4 ? o : `8 − ${o}`} = <b>${answer}</b>.`) };
    },
    verify: (x) => { let k = x.Z, o = 0; for (const cap of [2, 8, 8, 2]) { const t = Math.min(cap, k); if (t > 0) o = t; k -= t; } return o <= 4 ? o : 8 - o; },
  },
  'c9s-atom-avgmass': {
    title: 'average atomic mass from isotopes',
    make(r) {
      const a = choose(r, [10, 35, 63, 69]), d = choose(r, [1, 2]), pa = pick(r, 20, 90, 10), answer = (pa * a + (100 - pa) * (a + d)) / 100;
      return { a, d, pa, q: `<p>An element has two isotopes: mass number ${a} (${pa}% of atoms) and mass number ${a + d} (${100 - pa}% of atoms). Find the average atomic mass.</p>`, answer, unit: 'u', tol: 0.005,
        hint: 'Weighted average: multiply each mass number by its share and add.',
        solution: steps(`Average = (${pa} × ${a} + ${100 - pa} × ${a + d}) ÷ 100.`, `= ${n(pa * a + (100 - pa) * (a + d), 6)} ÷ 100 = <b>${n(answer, 5)} u</b>.`) };
    },
    verify: (x) => x.a + (x.d * (100 - x.pa)) / 100,
  },
  'c9s-atom-shells': {
    title: 'electrons in the outer shell',
    make(r) {
      const Z = pick(r, 3, 20), c = conf(Z), answer = c.at(-1);
      return { Z, q: `<p>How many electrons are in the outermost shell of the atom with atomic number ${Z}? (Shells fill as 2, 8, 8, then 2 more.)</p>`, answer, unit: 'electrons', tol: 0, abs: 0.01,
        hint: 'Fill shell 1 with 2, shell 2 with 8, shell 3 with 8, and put what is left in the next shell.',
        solution: steps(`Arrangement for Z = ${Z}: ${c.join(', ')}.`, `The last number is the outer shell: <b>${answer}</b>.`) };
    },
    verify: (x) => (x.Z <= 2 ? x.Z : x.Z <= 10 ? x.Z - 2 : x.Z <= 18 ? x.Z - 10 : x.Z - 18),
  },
};
