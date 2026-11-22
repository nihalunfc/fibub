// Extra question shapes for ls-jj-coupling (templates lsj-m31..m35). Imported by ls-jj-coupling.js.
import { int, choose } from '../_util.js';
import { msqOf, pickMcq, factMcq } from './_more.js';

const LL = 'SPDFGHIK';
const hf = (x) => (Number.isInteger(x) ? `${x}` : `\\tfrac{${2 * x}}{2}`);
const term = (S, L, J) => `{}^{${2 * S + 1}}\\mathrm{${LL[L]}}${J === undefined ? '' : `_{${hf(J)}}`}`;

/** Hund's-rule ground level of l^k. */
function hund(l, k) {
  const ms = []; for (let m = l; m >= -l; m--) ms.push(m);
  const up = Math.min(k, 2 * l + 1), dn = k - up;
  const L = Math.abs(ms.slice(0, up).reduce((s, m) => s + m, 0) + ms.slice(0, dn).reduce((s, m) => s + m, 0));
  const S = (up - dn) / 2;
  const J = k < 2 * l + 1 ? Math.abs(L - S) : L + S;
  return { L, S, J };
}

export default [
  { id: 'lsj-m31', type: 'mcq', level: 3, exams: ['gate', 'net', 'jam'], sub: "Hund's rules",
    make(r) {
      const l = r() < 0.4 ? 1 : 2, k = l === 1 ? int(r, 1, 5) : int(r, 1, 9);
      const { L, S, J } = hund(l, k);
      const other = k < 2 * l + 1 ? L + S : Math.abs(L - S);
      const ok = `$${term(S, L, J)}$`;
      const ws = [`$${term(S, L, other)}$`, `$${term(S === 0 ? 1 : S - 1 >= 0 ? S - 1 : S + 1, L, J)}$`, `$${term(S, L + 1, J + 1)}$`, `$${term(S, Math.max(0, L - 1), Math.abs(Math.max(0, L - 1) - S))}$`, `$${term(S + 1, L, L + S + 1)}$`];
      const o = pickMcq(r, ok, ws);
      return { q: `According to Hund's rules, the ground level of an atom whose only open shell is ${l === 1 ? 'n' : '3'}${'spd'[l]}$^{${k}}$ is`, ...o,
        sol: `Fill the $m_l$ values $${l}, \\ldots, -${l}$ with spin up first, then spin down. Rule 1 (maximum $S$): $S = ${hf(S)}$. Rule 2 (maximum $L$ for that $S$): $L = |\\sum m_l| = ${L}$ (${LL[L]}). Rule 3: the shell is ${k < 2 * l + 1 ? 'less than half full, so $J = |L - S|$' : k === 2 * l + 1 ? 'exactly half full ($L = 0$), so $J = S$' : 'more than half full, so $J = L + S$'} $= ${hf(J)}$. Ground level $${term(S, L, J)}$.`,
        trap: 'Rule 3 flips at half filling: less than half full takes the smallest $J$, more than half full the largest.' };
    } },
  { id: 'lsj-m32', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'terms of non-equivalent electrons', format: 'statements',
    make(r) {
      const p = choose(r, [[0, 1], [1, 1], [0, 2], [1, 2], [2, 2]]), [l1, l2] = p;
      const cfg = `n${'spd'[l1]}\\,n'${'spd'[l2]}`;
      const Ls = []; for (let L = Math.abs(l1 - l2); L <= l1 + l2; L++) Ls.push(L);
      const cands = [];
      for (const L of Ls) for (const S of [0, 1]) cands.push([`$${term(S, L)}$`, true, `$L = ${L}$ lies in $|l_1 - l_2| \\ldots l_1 + l_2$ and $S = ${S}$ is allowed for two non-equivalent electrons.`]);
      cands.push([`$${term(1, l1 + l2 + 1)}$`, false, `$L$ cannot exceed $l_1 + l_2 = ${l1 + l2}$.`]);
      cands.push([`$${term(2, Ls[0])}$`, false, 'Two electrons give $S = 0$ or $1$ only, never a quintet.']);
      if (Math.abs(l1 - l2) > 0) cands.push([`$${term(0, Math.abs(l1 - l2) - 1)}$`, false, `$L$ cannot be below $|l_1 - l_2| = ${Math.abs(l1 - l2)}$.`]);
      cands.push([`$${term(0.5, Ls[0])}$`, false, 'A doublet needs an odd number of electrons.']);
      const not = r() < 0.4;
      const m = msqOf(r, cands, { not });
      return { q: `Which of these LS terms ${not ? 'do <b>NOT</b> arise' : 'arise'} from the excited configuration $${cfg}$ (two electrons in different shells)?`, ...m,
        sol: m.sol.replace('statements that are true', 'terms that occur (marked true)').replace('statements that are false', 'terms that do not occur (marked false)') + ` In all: $L = ${Ls.join(', ')}$ each with $S = 0$ and $1$, i.e. ${Ls.length * 2} terms. (For equivalent electrons the Pauli principle would remove some of them.)`,
        trap: 'The Pauli restriction applies only to equivalent electrons (same $n$ and $l$); here every combination is allowed.' };
    } },
  { id: 'lsj-m33', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Landé interval rule',
    make(r) {
      const T = choose(r, [[1, 1], [1, 2], [1, 3], [1.5, 2], [1.5, 3], [2, 2], [1, 4], [2, 3]]), [S, L] = T;
      const Jmax = L + S, J = Jmax - int(r, 0, Math.min(2, Math.round(2 * Math.min(L, S)) - 2));
      const fr = (a, b) => `$${hf(a)} : ${hf(b)}$`;
      const o = pickMcq(r, fr(J, J - 1), [fr(J - 1, J), fr(J + 1, J), '$1 : 1$', `$${J * (J + 1)} : ${(J - 1) * J}$`, fr(J, J - 2 >= 0 ? J - 2 : J + 2)]);
      return { q: `In the LS term $${term(S, L)}$ obeying the Landé interval rule, the ratio of the interval $E(J = ${hf(J)}) - E(J = ${hf(J - 1)})$ to the interval $E(J = ${hf(J - 1)}) - E(J = ${hf(J - 2)})$ is`, ...o,
        sol: `$E_J = \\tfrac A2[J(J+1) - L(L+1) - S(S+1)]$, so $E_J - E_{J-1} = AJ$. The two intervals are $A\\cdot${hf(J)}$ and $A\\cdot${hf(J - 1)}$, giving $${hf(J)} : ${hf(J - 1)}$ (whatever the sign of $A$).`,
        trap: 'Each interval is proportional to the larger $J$ of its pair, not to $J(J+1)$.' };
    } },
  { id: 'lsj-m34', type: 'mcq', level: 2, exams: ['gate', 'net', 'jam'], sub: 'E1 selection rules', format: 'which is NOT',
    make(r) {
      const T = [
        ['$\\Delta S = 0$', 'The dipole operator does not act on spin.'],
        ['$\\Delta L = 0, \\pm1$, but not $L = 0 \\to 0$', 'The dipole operator is a vector in orbital space.'],
        ['$\\Delta J = 0, \\pm1$, but not $J = 0 \\to 0$', 'Angular momentum conservation with one photon (spin 1).'],
        ['The parity must change', 'The dipole operator is odd.'],
        ['The jumping electron has $\\Delta l = \\pm1$', 'One-electron parity change with the dipole rule.'],
      ];
      const F = [
        ['$\\Delta J = \\pm2$ is allowed', 'One photon carries one unit of angular momentum.'],
        ['$\\Delta S = \\pm1$ is allowed', 'Intercombination lines are forbidden in pure LS coupling (they appear weakly only through spin-orbit mixing).'],
        ['The parity must stay the same', 'E1 needs a parity change.'],
        ['$J = 0 \\to J = 0$ is allowed', 'A vector operator cannot connect two $J = 0$ states.'],
        ['$L = 0 \\to L = 0$ is allowed', 'Same reason, in orbital space.'],
      ];
      const not = r() < 0.6;
      const o = factMcq(r, T, F, not);
      return { q: `For electric dipole (E1) transitions in an atom described by pure LS coupling, which ONE statement is ${not ? '<b>NOT</b> a valid selection rule' : 'a valid selection rule'}?`, ...o,
        trap: 'Spin-forbidden lines (like the 253.7 nm mercury line) exist only because LS coupling is not exact in heavy atoms.' };
    } },
  { id: 'lsj-m35', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'coupling schemes', format: 'match the system',
    make(r) {
      const O = {
        ls: 'LS coupling: good quantum numbers $L$, $S$, $J$, $M_J$',
        jj: 'jj coupling: good quantum numbers $j_1$, $j_2$, $J$, $M_J$',
        pb: 'neither: $m_l$ and $m_s$ of each electron are good (Paschen-Back)',
        none: 'no angular momentum quantum number is good',
      };
      const C = choose(r, [
        ['the low-lying levels of carbon (2p$^2$), where the residual electrostatic repulsion far exceeds spin-orbit coupling', 'ls'],
        ['the ground configuration of oxygen (2p$^4$), a light atom', 'ls'],
        ['the 6p7s excited configuration of lead, where spin-orbit coupling of each electron far exceeds their residual electrostatic interaction', 'jj'],
        ['a heavy atom in which each electron\'s spin-orbit energy dominates over the electron-electron exchange energy', 'jj'],
        ['a light atom in an applied magnetic field so strong that the Zeeman energy far exceeds both the spin-orbit and the residual electrostatic splittings of the term', 'pb'],
      ]);
      const q = C[0];
      const o = pickMcq(r, O[C[1]], Object.keys(O).filter((k) => k !== C[1]).map((k) => O[k]));
      return { q: `Which description fits ${q}?`, ...o,
        sol: { ls: 'When the residual electrostatic interaction dominates, the orbital momenta couple to $L$ and the spins to $S$ first; spin-orbit coupling then splits each term into levels $J$. Light atoms are close to this limit.', jj: 'When spin-orbit coupling of each electron dominates, each electron first forms its own $j_i$; these then couple to $J$. Heavy atoms (and inner shells) approach this limit.', pb: 'A very strong field decouples the angular momenta from each other: each projects separately on the field, so $m_l$, $m_s$ (or $M_L$, $M_S$) become good, while $J$ is not.' }[C[1]],
        trap: 'In every scheme without an external field, $J$ and $M_J$ stay good; what changes is which intermediate momenta are good.' };
    } },
];
