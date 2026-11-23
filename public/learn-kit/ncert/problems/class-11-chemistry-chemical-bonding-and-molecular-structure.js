// Class 11 Chemistry, Chapter 4 Chemical Bonding and Molecular Structure: live problems (original fibub questions). Ids start with c11c-bond-.
import { choose, n, steps } from './_util.js';

// species: [atom, in, valence electrons V, lone-pair count, bonds (shared pairs counting a double bond as 2)]
const FC = [['N', 'the N atom of NH₄⁺', 5, 0, 4, 1], ['O', 'the O atom of H₃O⁺', 6, 1, 3, 1], ['O', 'a single-bonded O of CO₃²⁻', 6, 3, 1, -1], ['N', 'the central N of NO₃⁻', 5, 0, 4, 1], ['S', 'the central S of SO₄²⁻ (six S–O bonds)', 6, 0, 6, 0], ['O', 'the O of OH⁻', 6, 3, 1, -1], ['C', 'the C of CO (triple bond, one lone pair)', 4, 1, 3, -1], ['B', 'the B atom of BF₄⁻', 3, 0, 4, -1]];
// bond order: electrons (valence) and species; the pi-before-sigma order holds up to N2
const MO = [['B₂', 6], ['C₂', 8], ['N₂⁺', 9], ['N₂', 10], ['O₂⁺', 11], ['O₂', 12], ['O₂⁻', 13], ['F₂', 14]];
const LEV_LOW = [['s', 2, 1], ['s*', 2, 0], ['pi', 4, 1], ['sig', 2, 1], ['pi*', 4, 0], ['sig*', 2, 0]];
const LEV_HIGH = [['s', 2, 1], ['s*', 2, 0], ['sig', 2, 1], ['pi', 4, 1], ['pi*', 4, 0], ['sig*', 2, 0]];
const SHAPE = [['NH₃', 5, 3, 0], ['H₂O', 6, 2, 0], ['BF₃', 3, 3, 0], ['SF₄', 6, 4, 0], ['XeF₂', 8, 2, 0], ['ICl₄⁻', 7, 4, -1], ['NH₄⁺', 5, 4, 1], ['PCl₅', 5, 5, 0], ['SF₆', 6, 6, 0], ['BeCl₂', 2, 2, 0], ['CH₄', 4, 4, 0], ['ClF₃', 7, 3, 0]];
const SHAPE_ANS = { 'NH₃': 4, 'H₂O': 4, 'BF₃': 3, 'SF₄': 5, 'XeF₂': 5, 'ICl₄⁻': 6, 'NH₄⁺': 4, 'PCl₅': 5, 'SF₆': 6, 'BeCl₂': 2, 'CH₄': 4, 'ClF₃': 5 };
const HX = [['HF', 1.82, 92], ['HCl', 1.08, 127], ['HBr', 0.82, 141], ['HI', 0.44, 161]];

export default {
  'c11c-bond-formalcharge': {
    title: 'formal charge of an atom',
    make(r) {
      const s = choose(r, FC), [a, where, V, lp, b] = s;
      return { s, a, V, lp, b, q: `<p>Find the formal charge on ${where}. It has ${V} valence electrons when free, ${lp} lone pair${lp === 1 ? '' : 's'} and forms ${b} bond${b === 1 ? '' : 's'} (shared pairs).</p>`, answer: V - 2 * lp - b, unit: '', abs: 0.01, tol: 0.01,
        hint: 'Formal charge = valence electrons − (lone-pair electrons) − (number of bonds). Each shared pair gives the atom one electron.',
        solution: steps(`Lone-pair electrons = 2 × ${lp} = ${2 * lp}.`, `Bonds (half the shared electrons) = ${b}.`, `Formal charge = ${V} − ${2 * lp} − ${b} = <b>${V - 2 * lp - b}</b>.`) };
    },
    verify: (x) => FC.find((f) => f === x.s)[5],
  },
  'c11c-bond-moorder': {
    title: 'bond order from molecular orbitals',
    make(r) {
      const s = choose(r, MO);
      return { s, q: `<p>The species ${s[0]} has ${s[1]} valence electrons. Fill its molecular orbitals (σ2s, σ*2s, then π2p and σ2pz in the right order for this species, then π*2p and σ*2pz) and find its bond order.</p>`, answer: bo(s[1]), unit: '', abs: 0.01, tol: 0.01,
        hint: 'Bond order = (electrons in bonding MOs − electrons in antibonding MOs) / 2. Fill from the lowest level; the π and σ2pz order swaps after N₂.',
        solution: steps(`Fill ${s[1]} electrons from the bottom: ${s[1] <= 9 ? 'order σ2s, σ*2s, π2p, σ2pz, π*2p, σ*2pz' : 'order σ2s, σ*2s, σ2pz, π2p, π*2p, σ*2pz'}.`, `Count bonding = ${nb(s[1])[0]} and antibonding = ${nb(s[1])[1]}.`, `Bond order = (${nb(s[1])[0]} − ${nb(s[1])[1]}) / 2 = <b>${bo(s[1])}</b>.`) };
    },
    verify: (x) => { const e = x.s[1]; const lev = e <= 10 ? LEV_LOW : LEV_HIGH; let left = e, bond = 0, anti = 0; for (const [nm, cap] of lev) { const f = Math.min(cap, left); left -= f; nm.includes('*') ? (anti += f) : (bond += f); } return (bond - anti) / 2; },
  },
  'c11c-bond-steric': {
    title: 'number of hybrid orbitals (steric number)',
    make(r) {
      const s = choose(r, SHAPE), [f, V, X, c] = s;
      return { s, f, V, X, c, q: `<p>The central atom of ${f} has ${V} valence electrons and is bonded to ${X} monovalent atoms${c ? (c > 0 ? ' (the species carries a +1 charge)' : ' (the species carries a −1 charge)') : ''}. How many electron pairs (bond pairs plus lone pairs) surround the central atom? This is the number of hybrid orbitals it uses.</p>`, answer: (V + X - c) / 2, unit: '', tol: 0.01,
        hint: 'Electron pairs = (valence electrons of the centre + electrons from the outer atoms − charge) / 2. A positive charge removes electrons; a negative charge adds.',
        solution: steps(`Total electrons around the centre = ${V} + ${X} ${c > 0 ? '− 1' : c < 0 ? '+ 1' : ''} = ${V + X - c}.`, `Pairs = ${V + X - c} / 2 = <b>${(V + X - c) / 2}</b>.`) };
    },
    verify: (x) => SHAPE_ANS[x.f],
  },
  'c11c-bond-ionic': {
    title: 'percent ionic character from a dipole moment',
    make(r) {
      const s = choose(r, HX);
      return { s, q: `<p>The dipole moment of ${s[0]} is measured as ${s[1]} D and its bond length is ${s[2]} pm. If the bond were fully ionic (charges +e and −e at that distance) the dipole moment would be e × d (1 Å × e = 4.80 D). Find the percent ionic character.</p>`, answer: 100 * s[1] / (4.803 * s[2] / 100), unit: '%', tol: 0.02,
        hint: 'Percent ionic = (observed μ / μ if fully ionic) × 100. μ(ionic) = 4.80 D × (bond length in Å).',
        solution: steps(`d = ${s[2]} pm = ${s[2] / 100} Å.`, `μ(ionic) = 4.803 × ${s[2] / 100} = ${n(4.803 * s[2] / 100)} D.`, `Ionic character = ${s[1]} / ${n(4.803 * s[2] / 100)} × 100 = <b>${n(100 * s[1] / (4.803 * s[2] / 100))} %</b>.`) };
    },
    verify: (x) => { const mu = x.s[1] * 3.33564e-30, d = x.s[2] * 1e-12, e = 1.602177e-19; return 100 * (mu / d) / e; },
  },
};
function nb(e) {
  const lev = e <= 10 ? LEV_LOW : LEV_HIGH; let left = e, b = 0, a = 0;
  for (const [nm, cap] of lev) { const f = Math.min(cap, left); left -= f; nm.includes('*') ? (a += f) : (b += f); }
  return [b, a];
}
function bo(e) { const [b, a] = nb(e); return (b - a) / 2; }
