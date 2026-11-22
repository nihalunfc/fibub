// Round 5 extras for ls-jj-coupling: original questions, written 2026-11-22.
import { int, choose, round } from '../_util.js';
const R = String.raw;

const LL = 'SPDFGHIKLM';
const hf = (x) => (Number.isInteger(x) ? String(x) : `${Math.round(2 * x)}/2`);
/** Number of J levels of a term (S, L). */
const nJ = (S, L) => 2 * Math.min(S, L) + 1;
/** Number of LS levels of two non-equivalent electrons l1, l2. */
const levels2 = (l1, l2) => { let n = 0; for (const S of [0, 1]) for (let L = Math.abs(l1 - l2); L <= l1 + l2; L++) n += nJ(S, L); return n; };

export default {
  items: [
    { id: 'lsj-r5-01', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'closed shells',
      q: R`A completely filled subshell (for example $3d^{10}$) contributes to the atom's term`,
      options: [R`$L = 0$, $S = 0$: it adds nothing, and its own term is $^1S_0$`, R`$L = 2$, $S = 0$`, R`$L = 0$, $S = 5$`, R`$L = 2$, $S = \tfrac12$`], answer: 0,
      sol: R`In a full subshell every $m_l$ and every $m_s$ is used once, so $M_L = \sum m_l = 0$ and $M_S = \sum m_s = 0$, and there is only one way to fill it: a single state, $L = S = J = 0$. That is why term symbols are worked out from the open subshells only.`,
      trap: R`Ten electrons do not give $S = 5$: they are paired, five up and five down.` },
    { id: 'lsj-r5-02', type: 'mcq', level: 2, exams: ['jam', 'gate', 'net'], sub: "Hund's rules",
      q: R`By Hund's rules, the ground level of the V$^{3+}$ ion (configuration $3d^2$) is`,
      options: [R`$^3F_4$`, R`$^1G_4$`, R`$^3F_2$`, R`$^3P_0$`], answer: 2,
      sol: R`Two $d$ electrons: put both spins up ($S = 1$) in $m_l = 2$ and $1$, so the largest $L = 3$ (F). The shell is less than half full, so the smallest $J = |L - S| = 2$ lies lowest: $^3F_2$. $^1G_4$ and $^3P$ are excited terms of the same configuration.`,
      trap: R`Taking $J = L + S$ is right only for shells more than half full.` },
    { id: 'lsj-r5-03', type: 'nat', level: 2, exams: ['jam', 'gate', 'net'], sub: 'microstates',
      q: R`The number of microstates (distinct Slater determinants) of four equivalent $d$ electrons, $nd^4$, is ______.`,
      answer: 210, tol: 0, calc: () => (10 * 9 * 8 * 7) / 24,
      sol: R`A $d$ subshell has $2(2l + 1) = 10$ spin-orbitals. Choosing 4 of them for identical electrons (order does not matter, no orbital twice): $\binom{10}{4} = \dfrac{10\cdot9\cdot8\cdot7}{4!} = 210$. The same number belongs to $nd^6$ (four holes).`,
      trap: R`$10^4$ counts ordered, repeatable choices; the Pauli principle and indistinguishability cut it to a binomial coefficient.` },
    { id: 'lsj-r5-04', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'non-equivalent electrons', format: 'statements',
      q: R`For the excited configuration $2p\,3d$ of a two-electron atom in LS coupling, which statements are correct?`,
      options: [R`It gives 12 fine-structure levels in all`, R`It holds 60 states in all`,
        R`The level $^1F_3$ is one of them`, R`The level $^3S_1$ is one of them`], answer: [0, 1, 2],
      sol: R`Non-equivalent electrons: $S = 0, 1$ and $L = 1, 2, 3$ with no Pauli restriction, giving $^1P, ^1D, ^1F, ^3P, ^3D, ^3F$. Levels: three singlets ($^1P_1, ^1D_2, ^1F_3$) plus $^3P_{0,1,2}$, $^3D_{1,2,3}$, $^3F_{2,3,4}$: $3 + 9 = 12$. States: $6\times10 = 60$. $L = 0$ needs $l_1 = l_2$, so no $S$ term.`,
      trap: R`$L$ runs from $|l_1 - l_2| = 1$, not from 0.` },
    { id: 'lsj-r5-05', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Landé interval rule',
      q: R`A $^4F$ term obeys the Landé interval rule. The ratio of the interval $E(J = \tfrac92) - E(J = \tfrac72)$ to the interval $E(J = \tfrac52) - E(J = \tfrac32)$ is ______ (one decimal place).`,
      answer: 1.8, tol: 0.01, calc: () => 4.5 / 2.5,
      sol: R`$E_J = \tfrac A2[J(J + 1) - L(L + 1) - S(S + 1)]$, so $E_J - E_{J-1} = AJ$: each interval is proportional to the LARGER $J$ of the pair. Ratio $= \tfrac92 / \tfrac52 = 1.8$. The sign of $A$ (normal or inverted term) cancels.`,
      trap: R`Using the lower $J$ of each pair gives $\tfrac72/\tfrac32 = 2.3$.` },
    { id: 'lsj-r5-06', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'jj coupling',
      q: R`The configuration $np\,n'd$ is described first in LS coupling and then in jj coupling. The number of levels with total $J = 2$ (the same in both schemes) is ______.`,
      answer: 4, tol: 0,
      sol: R`LS: terms $^1P, ^1D, ^1F, ^3P, ^3D, ^3F$; $J = 2$ appears in $^1D_2$, $^3P_2$, $^3D_2$, $^3F_2$: four. jj: $j_1 = \tfrac12, \tfrac32$ and $j_2 = \tfrac32, \tfrac52$. Groups $(\tfrac12, \tfrac32)$: $J = 1, 2$; $(\tfrac12, \tfrac52)$: $2, 3$; $(\tfrac32, \tfrac32)$: $0, 1, 2, 3$; $(\tfrac32, \tfrac52)$: $1, 2, 3, 4$. Each group has one $J = 2$: four again. The number of levels of each $J$ is the same in every coupling scheme, because $J$ stays a good quantum number while the coupling changes.`,
      trap: R`Coupling schemes regroup the levels but never change how many levels of each $J$ exist.` },
    { id: 'lsj-r5-07', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'spin-orbit energy', unit: 'cm⁻¹',
      q: R`A $^5F$ term has spin-orbit constant $A = -8$ cm$^{-1}$ (an inverted term). The magnitude of the energy difference between its highest-$J$ and lowest-$J$ levels is ______ cm$^{-1}$.`,
      answer: 112, tol: 0.5, calc: () => 8 / 2 * (5 * 6 - 1 * 2),
      sol: R`$S = 2$, $L = 3$, so $J = 1, \dots, 5$. $E_J = \tfrac A2[J(J + 1) - \dots]$, so $E_5 - E_1 = \tfrac A2(30 - 2) = 14A = -112$ cm$^{-1}$: magnitude $112$ cm$^{-1}$, with $J = 5$ lowest because $A < 0$. Check with the interval rule: $|A|(2 + 3 + 4 + 5) = 8\times14 = 112$.`,
      trap: R`The intervals are $AJ$ for $J = 2, 3, 4, 5$, not $J = 1$ to $5$.` },
    { id: 'lsj-r5-08', type: 'mcq', level: 3, exams: ['jam', 'gate', 'net'], sub: "Hund's rules",
      q: R`The Cu$^{2+}$ ion ($3d^9$) and the Ti$^{3+}$ ion ($3d^1$) both have a $^2D$ ground term. Their ground LEVELS are`,
      options: [R`$^2D_{3/2}$ for both`, R`$^2D_{5/2}$ for Cu$^{2+}$ and $^2D_{3/2}$ for Ti$^{3+}$`, R`$^2D_{3/2}$ for Cu$^{2+}$ and $^2D_{5/2}$ for Ti$^{3+}$`, R`$^2D_{5/2}$ for both`], answer: 1,
      sol: R`One electron and one hole give the same terms. But the spin-orbit constant of a hole has the opposite sign: $3d^1$ (less than half full) has $A > 0$, lowest $J = L - S = \tfrac32$; $3d^9$ (more than half full) has $A < 0$, lowest $J = L + S = \tfrac52$.`,
      trap: R`Same term does not mean same ground level: Hund's third rule flips at half filling.` },
    { id: 'lsj-r5-09', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'equivalent electrons',
      q: R`The configuration $nd^3$ gives the LS terms $^2P$, $^2D$ (twice), $^2F$, $^2G$, $^2H$, $^4P$, $^4F$. The total number of fine-structure levels ($^{2S+1}L_J$, counting each copy of $^2D$ separately) is ______.`,
      answer: 19, tol: 0,
      sol: R`Every doublet with $L\ge1$ has 2 levels: $^2P, ^2D, ^2D, ^2F, ^2G, ^2H$ give $6\times2 = 12$. $^4P$: $J = \tfrac12, \tfrac32, \tfrac52$, 3 levels. $^4F$: $J = \tfrac32$ to $\tfrac92$, 4 levels. Total $12 + 3 + 4 = 19$. Check the states: $6 + 20 + 14 + 18 + 22 + 12 + 28 = 120 = \binom{10}{3}$.`,
      trap: R`A quartet has $2S + 1 = 4$ levels only when $L\ge S$; $^4P$ has 3.` },
    { id: 'lsj-r5-10', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'microstates',
      q: R`The excited configuration $np^2\,n'd$ (two equivalent $p$ electrons plus one $d$ electron in another shell) has ______ microstates.`,
      answer: 150, tol: 0, calc: () => 15 * 10,
      sol: R`The two equivalent $p$ electrons can sit in $\binom62 = 15$ ways. The $d$ electron is in a different shell, so it is independent: 10 spin-orbitals. Total $15\times10 = 150$.`,
      trap: R`Using $\binom{16}{3}$ treats all three electrons as equivalent, which they are not.` },
  ],
  gens: [
    { id: 'lsj-r5g1', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Landé interval rule',
      make(r) {
        const S2 = int(r, 2, 5), S = S2 / 2, L = int(r, Math.ceil(S), 5);
        const Js = []; for (let J = Math.abs(L - S) + 1; J <= L + S + 1e-9; J++) Js.push(J);
        const a = Js[int(r, 0, Js.length - 1)]; let b = Js[int(r, 0, Js.length - 1)]; if (b === a) b = Js[(Js.indexOf(a) + 1) % Js.length];
        const ans = a / b;
        return { q: R`A $^{${S2 + 1}}${LL[L]}$ term obeys the Landé interval rule. The ratio of the interval between $J = ${hf(a)}$ and $J = ${hf(a - 1)}$ to the interval between $J = ${hf(b)}$ and $J = ${hf(b - 1)}$ is ______ (three decimal places).`,
          answer: round(ans, 3), tol: 0.002, a, b,
          sol: R`$E_J - E_{J - 1} = AJ$, so the ratio is $\dfrac{${hf(a)}}{${hf(b)}} = ${round(ans, 3)}$, whatever the size or sign of $A$.`,
          trap: 'Each interval goes with the larger J of its pair.' };
      },
      verify: (p) => p.a / p.b },
    { id: 'lsj-r5g2', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'spin-orbit energy',
      make(r) {
        const S2 = int(r, 1, 5), S = S2 / 2, L = int(r, 1, 4), A = choose(r, [-15, -6, -4, 3, 5, 7.5, 12, 20]);
        const Jmax = L + S, Jmin = Math.abs(L - S);
        const ans = Math.abs(A) / 2 * (Jmax * (Jmax + 1) - Jmin * (Jmin + 1));
        return { q: R`A $^{${S2 + 1}}${LL[L]}$ term has spin-orbit energy $E_J = \tfrac A2[J(J + 1) - L(L + 1) - S(S + 1)]$ with $A = ${A}$ cm$^{-1}$. The magnitude of the gap between its highest-$J$ and lowest-$J$ levels is ______ cm$^{-1}$ (one decimal place).`,
          answer: round(ans, 1), tol: Math.max(0.1, round(ans * 0.005, 2)), unit: 'cm⁻¹', A, Jmax, Jmin,
          sol: R`$J$ runs from $${hf(Jmin)}$ to $${hf(Jmax)}$. $|E_{J_\text{max}} - E_{J_\text{min}}| = \tfrac{|A|}{2}[${hf(Jmax)}(${hf(Jmax)} + 1) - ${hf(Jmin)}(${hf(Jmin)} + 1)] = ${round(ans, 1)}$ cm$^{-1}$. ${A < 0 ? 'Since $A < 0$ the term is inverted: the highest $J$ lies lowest.' : 'Since $A > 0$ the lowest $J$ lies lowest.'}`,
          trap: 'The constant terms L(L+1) and S(S+1) cancel in a difference within one term.' };
      },
      verify: (p) => Math.abs(p.A) / 2 * (p.Jmax * (p.Jmax + 1) - p.Jmin * (p.Jmin + 1)) },
    { id: 'lsj-r5g3', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'non-equivalent electrons',
      make(r) {
        const l1 = int(r, 0, 3), l2 = int(r, Math.max(1, l1), 3), n1 = int(r, 2, 4), n2 = n1 + int(r, 1, 2);
        const ans = levels2(l1, l2);
        return { q: R`Two electrons in different shells, $${n1}${'spdf'[l1]}\,${n2}${'spdf'[l2]}$, couple in LS coupling. The total number of fine-structure levels ($^{2S+1}L_J$) of this configuration is ______.`,
          answer: ans, tol: 0, l1, l2,
          sol: R`$S = 0$ or $1$; $L$ runs from ${Math.abs(l1 - l2)} to ${l1 + l2}. Each singlet has one level; each triplet has $2\min(1, L) + 1$ levels (only 1 when $L = 0$). Adding up gives ${ans} levels. (The same number appears in jj coupling.)`,
          trap: 'A ³S term has only one level, J = 1.' };
      },
      verify: (p) => levels2(p.l1, p.l2) },
  ],
};
