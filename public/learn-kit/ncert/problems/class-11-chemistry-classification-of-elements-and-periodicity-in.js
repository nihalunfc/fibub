// Class 11 Chemistry, Chapter 3 Classification of Elements and Periodicity in Properties: live problems (original fibub questions). Ids start with c11c-period-.
import { pick, choose, n, steps } from './_util.js';

const ROOT = ['nil', 'un', 'bi', 'tri', 'quad', 'pent', 'hex', 'sept', 'oct', 'enn'];
const SYM = { 3: 'Li', 4: 'Be', 5: 'B', 6: 'C', 7: 'N', 8: 'O', 9: 'F', 11: 'Na', 12: 'Mg', 13: 'Al', 14: 'Si', 15: 'P', 16: 'S', 17: 'Cl', 19: 'K', 20: 'Ca', 31: 'Ga', 33: 'As', 34: 'Se', 35: 'Br', 37: 'Rb', 38: 'Sr', 50: 'Sn', 53: 'I' };
const VALENCE = (Z) => { const ORD = [['1s', 2], ['2s', 2], ['2p', 6], ['3s', 2], ['3p', 6], ['4s', 2], ['3d', 10], ['4p', 6], ['5s', 2], ['4d', 10], ['5p', 6]]; let left = Z, rows = []; for (const [s, c] of ORD) { const k = Math.min(c, left); rows.push([s, k]); left -= k; } const top = Math.max(...rows.filter((r) => r[1] > 0).map((r) => +r[0][0])); return rows.filter((r) => +r[0][0] === top && /[sp]/.test(r[0])).reduce((a, r) => a + r[1], 0); };
export default {
  'c11c-period-group': {
    title: 'group and period from the atomic number',
    make(r) {
      const Z = choose(r, [3, 4, 5, 7, 9, 12, 13, 15, 16, 17, 19, 20, 31, 33, 35, 37, 38, 50, 53]);
      return { Z, q: `<p>The element ${SYM[Z]} has atomic number ${Z}. Which <b>group</b> of the periodic table (numbered 1 to 18) does it belong to?</p>`, answer: Z <= 2 ? 1 : (() => { const v = VALENCE(Z); return v <= 2 ? v : 10 + v; })(), unit: 'group', tol: 0.001,
        hint: 'Write the configuration. For s-block the group is the number of outer electrons; for p-block it is 10 + (the electrons in the outer s and p).',
        solution: steps(`Fill the subshells in order up to ${Z} electrons; the outer shell (highest n) has ${VALENCE(Z)} electrons.`, VALENCE(Z) <= 2 ? `s-block: group = ${VALENCE(Z)}.` : `p-block: group = 10 + ${VALENCE(Z)} = <b>${10 + VALENCE(Z)}</b>.`) };
    },
    verify: (x) => { const Z = x.Z; const col = Z <= 2 ? 1 : Z <= 4 ? Z - 2 : Z <= 10 ? Z + 8 : Z <= 12 ? Z - 10 : Z <= 18 ? Z : Z <= 36 ? Z - 18 : Z - 36; return col; },
  },
  'c11c-period-iupac': {
    title: 'atomic number from an IUPAC systematic name',
    make(r) {
      const Z = pick(r, 104, 118), name = String(Z).split('').map((d) => ROOT[+d]).join('');
      return { Z, name, q: `<p>The temporary IUPAC name of an element is <b>${name}ium</b> (roots: nil 0, un 1, bi 2, tri 3, quad 4, pent 5, hex 6, sept 7, oct 8, enn 9). What is its atomic number?</p>`, answer: Z, unit: '', tol: 0.001,
        hint: 'Split the name into roots from the left, write each root as a digit and join the digits.',
        solution: steps(`Split ${name} into roots: ${String(Z).split('').map((d) => ROOT[+d]).join(' + ')}.`, `Digits: ${String(Z).split('').join(', ')}, so the atomic number is <b>${Z}</b>.`) };
    },
    verify: (x) => { let s = x.name, z = ''; while (s) { const i = ROOT.findIndex((rt) => s.startsWith(rt) && !(rt === 'bi' && false)); const cand = ROOT.map((rt, k) => [rt, k]).filter(([rt]) => s.startsWith(rt)).sort((a, b) => b[0].length - a[0].length)[0]; z += cand[1]; s = s.slice(cand[0].length); if (i < -5) break; } return +z; },
  },
  'c11c-period-valence': {
    title: 'valence electrons from successive ionisation enthalpies',
    make(r) {
      const E = choose(r, [['A', [496, 4562, 6910, 9543], 1], ['B', [738, 1451, 7733, 10543], 2], ['C', [578, 1817, 2745, 11577], 3], ['D', [590, 1145, 4912, 6491], 2], ['E', [419, 3051, 4411, 5877], 1], ['F', [801, 2427, 3660, 25025], 3]]);
      return { E, q: `<p>The first four ionisation enthalpies (kJ/mol) of an element are ${E[1].join(', ')}. How many <b>valence electrons</b> does it have?</p>`, answer: E[2], unit: 'electrons', tol: 0.001,
        hint: 'Look for the biggest jump from one ionisation enthalpy to the next: after the valence electrons the next one comes from an inner shell.',
        solution: steps(`Ratios of successive values: ${E[1].slice(1).map((v, i) => n(v / E[1][i], 3)).join(', ')}.`, `The biggest jump comes after the ${E[2]}${['', 'st', 'nd', 'rd'][E[2]]} electron.`, `So there are <b>${E[2]}</b> valence electron${E[2] > 1 ? 's' : ''}.`) };
    },
    verify: (x) => { const v = x.E[1]; let best = 0, bi = 0; for (let i = 1; i < v.length; i++) if (v[i] / v[i - 1] > best) { best = v[i] / v[i - 1]; bi = i; } return bi; },
  },
  'c11c-period-ie': {
    title: 'energy to ionise a sample of atoms',
    make(r) {
      const A = choose(r, [['Na', 23, 496], ['K', 39, 419], ['Li', 7, 520], ['Mg', 24, 738], ['Ca', 40, 590]]), g = choose(r, [2.3, 4.6, 7.8, 12, 20]), kJ = g / A[1] * A[2];
      return { A, g, q: `<p>The first ionisation enthalpy of ${A[0]} (molar mass ${A[1]} g/mol) is ${A[2]} kJ/mol. How much energy in kJ is needed to remove one electron from each atom in ${g} g of gaseous ${A[0]} atoms?</p>`, answer: kJ, unit: 'kJ', tol: 0.01,
        hint: 'Moles of atoms = g ÷ molar mass; energy = moles × ionisation enthalpy.',
        solution: steps(`Moles = ${g} / ${A[1]} = ${n(g / A[1])} mol.`, `Energy = ${n(g / A[1])} × ${A[2]} = <b>${n(kJ)} kJ</b>.`) };
    },
    verify: (x) => x.A[2] * x.g / x.A[1],
  },
};
