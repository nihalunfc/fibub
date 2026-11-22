// Live problems for Classification of elements and periodicity.
const pick = (r, min, max, step = 1) => +(min + Math.floor(r() * ((max - min) / step + 1 - 1e-9)) * step).toFixed(6);
const n = (v, d = 3) => (+(+v).toPrecision(d)).toLocaleString('en-IN', { maximumFractionDigits: 6 });
const steps = (...ls) => '<ol>' + ls.map((l) => `<li>${l}</li>`).join('') + '</ol>';
const NA = 6.022e23;
const IE = [['lithium', 'Li', 7, 520], ['sodium', 'Na', 23, 496], ['potassium', 'K', 39, 419], ['magnesium', 'Mg', 24, 738]];
const NAMES = ['', 'H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne', 'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar', 'K', 'Ca'];
/** Electrons per shell for Z = 1 to 20 (3d stays empty up to calcium). */
const shells = (Z) => { const cap = [2, 8, 8, 2], out = []; let left = Z; for (const c of cap) { if (left <= 0) break; out.push(Math.min(c, left)); left -= c; } return out; };

export default {
  'pt-ie-energy': {
    title: 'energy to ionise a sample of atoms',
    make(r) {
      const [name, sym, M, ie] = IE[Math.floor(r() * IE.length)], m = pick(r, 1, 20, 0.5);
      const mol = m / M, answer = mol * ie;
      return { M, ie, m,
        q: `<p>The first ionisation enthalpy of ${name} (${sym}, molar mass ${M} g/mol) is ${ie} kJ/mol. How much energy, in kJ, is needed to remove one electron from every atom in ${m} g of gaseous ${sym} atoms?</p>`,
        answer, unit: 'kJ', tol: 0.01,
        hint: 'Ionisation enthalpy is per mole of atoms. Change the mass to moles first.',
        solution: steps(`Moles of atoms = ${m} ÷ ${M} = ${n(mol, 4)} mol.`, `Energy = ${n(mol, 4)} mol × ${ie} kJ/mol = <b>${n(answer, 4)} kJ</b>.`, 'The atoms must be gaseous and isolated: ionisation enthalpy is defined for gas atoms.') };
    },
    verify: (x) => ((x.m / x.M) * NA) * (x.ie * 1000 / NA) / 1000,
  },
  'pt-mulliken': {
    title: 'Pauling electronegativity from Mulliken',
    make(r) {
      const ie = pick(r, 8, 17.5, 0.1), ea = pick(r, 0.5, 3.6, 0.1);
      const chiM = (ie + ea) / 2, answer = chiM / 2.8;
      return { ie, ea,
        q: `<p>An atom has ionisation energy ${ie} eV and electron affinity ${ea} eV. Using Mulliken's definition and the rule that the Pauling value is about the Mulliken value divided by 2.8, estimate its Pauling electronegativity.</p>`,
        answer, unit: '', tol: 0.01,
        hint: 'Mulliken electronegativity is the average of the ionisation energy and the electron affinity, both in eV.',
        solution: steps(`Mulliken value χ<sub>M</sub> = (${ie} + ${ea}) ÷ 2 = ${n(chiM, 4)} eV.`, `Pauling value ≈ ${n(chiM, 4)} ÷ 2.8 = <b>${n(answer, 3)}</b>.`, 'A high IE (holds its own electrons) and a high EA (wants more) both make an atom pull shared electrons harder.') };
    },
    verify: (x) => (x.ie + x.ea) / 5.6,
  },
  'pt-slater': {
    title: 'effective nuclear charge by Slater\'s rules',
    make(r) {
      const Z = pick(r, 3, 20), sh = shells(Z), last = sh.length - 1;
      const same = sh[last] - 1, inner = last >= 1 ? sh[last - 1] : 0, deep = sh.slice(0, Math.max(0, last - 1)).reduce((a, b) => a + b, 0);
      const S = 0.35 * same + 0.85 * inner + 1.0 * deep, answer = Z - S;
      return { Z,
        q: `<p>Use Slater's rules to find the effective nuclear charge Z<sub>eff</sub> felt by one outermost (valence) electron of ${NAMES[Z]} (Z = ${Z}).</p>`,
        answer, unit: '', tol: 0.001, abs: 0.01,
        hint: 'For an s or p electron: each other electron in the same shell shields 0.35, each electron in the shell just inside shields 0.85, and each electron deeper shields 1.00.',
        solution: steps(`Electrons per shell: ${sh.join(', ')}.`, `Same shell: ${same} × 0.35 = ${n(0.35 * same, 4)}. Next shell in: ${inner} × 0.85 = ${n(0.85 * inner, 4)}. Deeper: ${deep} × 1.00 = ${deep}.`, `Shielding S = ${n(S, 4)}.`, `Z<sub>eff</sub> = ${Z} − ${n(S, 4)} = <b>${n(answer, 4)}</b>.`) };
    },
    verify: (x) => {
      const sh = shells(x.Z), last = sh.length - 1; let S = 0;
      sh.forEach((e, i) => { const k = i === last ? e - 1 : e; S += k * (i === last ? 0.35 : i === last - 1 ? 0.85 : 1); });
      return x.Z - S;
    },
  },
};
