// Many-electron atoms: helium and exchange, LS (Russell-Saunders) terms of equivalent and non-equivalent electrons,
// Hund's rules, the Landé interval rule, jj coupling and the selection rules for multi-electron spectra.
// Original questions for GATE and CSIR NET practice (fibub). Levels: 1 warm-up ... 5 top rank.
import { pick, int, choose, mcqOptions, round, shuffle } from '../_util.js';
import more from './ls-jj-coupling.more.gen.js';
import more2 from './ls-jj-coupling.more2.gen.js';
import r4 from './ls-jj-coupling.r4.gen.js';
import r5 from './ls-jj-coupling.r5.gen.js';

const LT = ['S', 'P', 'D', 'F', 'G', 'H', 'I', 'K', 'L', 'M'];
const fr = (x) => (Number.isInteger(x) ? String(x) : `${Math.round(2 * x)}/2`);
const sym = (S, L, J) => `^{${Math.round(2 * S + 1)}}${LT[L]}${J === undefined ? '' : `_{${fr(J)}}`}`;
const binom = (n, k) => { let c = 1; for (let i = 0; i < k; i++) c = (c * (n - i)) / (i + 1); return Math.round(c); };
/** Hund's-rule ground term of l^N: fill m_l from +l down with spin up, then spin down. */
function hund(l, N) {
  const ms = []; for (let m = l; m >= -l; m--) ms.push(m);
  const up = Math.min(N, 2 * l + 1), dn = N - up;
  const S = (up - dn) / 2;
  const L = Math.abs(ms.slice(0, up).reduce((a, b) => a + b, 0) + ms.slice(0, dn).reduce((a, b) => a + b, 0));
  const J = N < 2 * l + 1 ? Math.abs(L - S) : L + S;
  return { S, L, J };
}
const Js = (S, L) => { const o = []; for (let J = Math.abs(L - S); J <= L + S + 1e-9; J++) o.push(J); return o; };
const ION = {
  p: [['B', 1], ['C', 2], ['N', 3], ['O', 4], ['F', 5], ['Si', 2], ['P', 3], ['S', 4], ['Cl', 5]],
  d: [['Ti$^{3+}$', 1], ['V$^{3+}$', 2], ['Cr$^{3+}$', 3], ['Cr$^{2+}$', 4], ['Mn$^{2+}$', 5], ['Fe$^{2+}$', 6], ['Co$^{2+}$', 7], ['Ni$^{2+}$', 8], ['Cu$^{2+}$', 9]],
  f: [['Ce$^{3+}$', 1], ['Pr$^{3+}$', 2], ['Nd$^{3+}$', 3], ['Sm$^{3+}$', 5], ['Eu$^{3+}$', 6], ['Gd$^{3+}$', 7], ['Tb$^{3+}$', 8], ['Dy$^{3+}$', 9], ['Ho$^{3+}$', 10], ['Er$^{3+}$', 11], ['Tm$^{3+}$', 12], ['Yb$^{3+}$', 13]],
};

export default {
  topic: 'ls-jj-coupling',
  items: [
    // ---------- level 1 ----------
    { id: 'lsj-001', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'hund rules',
      q: 'The ground level of the carbon atom (configuration $1s^2 2s^2 2p^2$) is',
      options: ['$^3P_0$', '$^3P_2$', '$^1D_2$', '$^1S_0$'], answer: 0,
      sol: 'Two equivalent $p$ electrons give $^1S$, $^1D$, $^3P$. Hund 1: largest $S$, so $^3P$. Hund 3: the $p$ shell is less than half full ($2 < 3$), so the smallest $J = |L - S| = 0$ lies lowest: $^3P_0$.',
      trap: '$^3P_2$ is the ground level of oxygen ($p^4$, more than half full), where the multiplet is inverted.' },
    { id: 'lsj-002', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'equivalent electrons',
      q: 'The LS terms that arise from two equivalent $p$ electrons ($np^2$) are',
      options: ['$^1S, {}^1P, {}^1D, {}^3S, {}^3P, {}^3D$', '$^1S, {}^1D, {}^3P$', '$^3S, {}^3D, {}^1P$', '$^1P, {}^3P$ only'], answer: 1,
      sol: 'For non-equivalent $p$ electrons all six terms occur. For equivalent ones the Pauli principle requires the total state to be antisymmetric: symmetric spin ($S = 1$) goes with antisymmetric orbital ($L$ odd: $P$), and $S = 0$ with $L$ even ($S$, $D$). So $^1S$, $^1D$, $^3P$, with $1 + 5 + 9 = 15 = \\binom{6}{2}$ states.',
      trap: 'The six-term list is for $np\\,n\'p$, two different shells.' },
    { id: 'lsj-003', type: 'nat', level: 1, exams: ['gate', 'net'], sub: 'levels of a term',
      q: 'The number of fine-structure levels (distinct $J$ values) in a $^4D$ term is ______.',
      answer: 4, tol: 0,
      sol: '$S = 3/2$, $L = 2$, so $J$ runs from $|L - S| = 1/2$ to $L + S = 7/2$: $J = \\tfrac12, \\tfrac32, \\tfrac52, \\tfrac72$, four levels. In general the number is the smaller of $2S + 1$ and $2L + 1$.',
      trap: 'The superscript (4) is the number of levels only when $L \\ge S$.' },
    { id: 'lsj-004', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'helium',
      q: 'The ground state of neutral helium is',
      options: ['$1s^2\\;^3S_1$', '$1s^2\\;^2S_{1/2}$', '$1s^2\\;^1S_0$', '$1s^2\\;^1P_1$'], answer: 2,
      sol: 'Both electrons are in $1s$, so the spatial part is symmetric and the spin part must be the antisymmetric singlet: $S = 0$, $L = 0$, $J = 0$: $^1S_0$. A $1s^2$ triplet is forbidden by the Pauli principle.',
      trap: 'The lowest triplet of helium is $1s2s\\;^3S_1$, not $1s^2$.' },
    { id: 'lsj-005', type: 'msq', level: 1, exams: ['gate', 'net'], sub: 'selection rules',
      q: 'Which are selection rules for electric dipole transitions in LS coupling?',
      options: ['$\\Delta S = 0$', '$\\Delta L = 0, \\pm1$ but not $L = 0 \\to L = 0$', '$\\Delta J = 0, \\pm1$ but not $J = 0 \\to J = 0$', 'Parity must stay the same'], answer: [0, 1, 2],
      sol: 'The dipole operator does not act on spin ($\\Delta S = 0$), is a vector in orbital space ($\\Delta L = 0, \\pm1$, no $0\\to0$) and in total angular momentum ($\\Delta J = 0, \\pm1$, no $0\\to0$), and is odd under parity, so parity must change.',
      trap: '$\\Delta L = 0$ is allowed for many-electron terms (e.g. $^3P\\to{}^3P$ between configurations of opposite parity); it is the jumping electron\'s $\\Delta l$ that must be $\\pm1$.' },
    { id: 'lsj-006', type: 'nat', level: 1, exams: ['gate', 'net'], sub: 'degeneracy',
      q: 'The total number of states in a $^3D$ term (all its $J$ levels together) is ______.',
      answer: 15, tol: 0,
      sol: '$(2S+1)(2L+1) = 3\\times5 = 15$. Check by levels: $J = 1, 2, 3$ have $3 + 5 + 7 = 15$ states.',
      trap: 'Counting only $2J+1$ of the highest level gives 7.' },

    // ---------- level 2 ----------
    { id: 'lsj-007', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'microstates',
      q: 'The number of distinct microstates (Slater determinants) for the configuration $np^3$ is ______.',
      answer: 20, tol: 0,
      sol: 'A $p$ subshell has $2(2l+1) = 6$ spin-orbitals. Placing 3 electrons in them with no two alike: $\\binom{6}{3} = 20$. They group as $^4S$ (4), $^2D$ (10) and $^2P$ (6).',
      trap: '$6^3 = 216$ ignores the Pauli principle and the indistinguishability of electrons.' },
    { id: 'lsj-008', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'hund rules',
      q: 'The ground level of nitrogen ($2p^3$) is',
      options: ['$^2D_{5/2}$', '$^2P_{1/2}$', '$^4S_{1/2}$', '$^4S_{3/2}$'], answer: 3,
      sol: 'Three electrons, one in each $m_l = 1, 0, -1$ with parallel spins: $S = 3/2$, $L = 0$. A half-filled shell has $L = 0$ and $J = S = 3/2$: $^4S_{3/2}$.',
      trap: 'For an $S$ term, $J = S$; there is no choice between $|L - S|$ and $L + S$.' },
    { id: 'lsj-009', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'hund rules',
      q: 'The ground level of oxygen ($2p^4$) is',
      options: ['$^3P_2$', '$^3P_0$', '$^1D_2$', '$^3P_1$'], answer: 0,
      sol: '$p^4$ has the same terms as $p^2$ (two holes): $^1S$, $^1D$, $^3P$. Hund 1 picks $^3P$. The shell is more than half full, so the multiplet is inverted and the largest $J = L + S = 2$ is lowest: $^3P_2$.',
      trap: 'The terms are those of $p^2$, but the ordering of $J$ is reversed.' },
    { id: 'lsj-010', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'lande interval rule',
      q: 'In a $^3P$ term the $^3P_1$ level lies 16.4 cm$^{-1}$ above $^3P_0$. If the Landé interval rule holds exactly, the $^3P_2$ level lies ______ cm$^{-1}$ above $^3P_1$.',
      answer: 32.8, tol: 0.1, unit: 'cm⁻¹', calc: () => 16.4 * 2,
      sol: 'Interval rule: $E(J) - E(J-1) = AJ$. $E(1) - E(0) = A = 16.4$ cm$^{-1}$, so $E(2) - E(1) = 2A = 32.8$ cm$^{-1}$. (In real carbon it is 27.0 cm$^{-1}$; the rule is only approximate when other terms mix in.)',
      trap: 'The interval is proportional to the upper $J$ of the pair, not to the lower.' },
    { id: 'lsj-011', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'exchange',
      q: 'In helium, the $1s2s\\;^3S_1$ level lies below $1s2s\\;^1S_0$. The reason is that',
      options: ['the triplet has a larger magnetic moment, which lowers its energy', 'in the triplet the spatial wavefunction is antisymmetric, so the electrons avoid each other and their repulsion is smaller', 'spin-orbit coupling lowers the state with larger $S$', 'the triplet has more states, so it lies lower on average'], answer: 1,
      sol: 'The total wavefunction is antisymmetric. $S = 1$ (symmetric spin) forces an antisymmetric spatial part, which vanishes when $\\vec r_1 = \\vec r_2$. The electrons are kept apart, $\\langle e^2/4\\pi\\varepsilon_0r_{12}\\rangle$ is smaller by the exchange integral, and $E_{singlet} - E_{triplet} = 2K > 0$.',
      trap: 'Hund\'s first rule is electrostatic, not magnetic: spin matters only through the symmetry it forces on the spatial part.' },
    { id: 'lsj-012', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'jj coupling',
      q: 'Which statements about jj coupling are correct?',
      options: ['It describes heavy atoms better than light atoms', 'Each electron\'s $j_i$ is (approximately) a good quantum number', 'The total $J$ and the parity are good quantum numbers in both LS and jj coupling', 'jj coupling gives a different total number of states for a configuration than LS coupling'], answer: [0, 1, 2],
      sol: 'jj applies when each electron\'s spin-orbit energy ($\\propto Z^4$) exceeds the residual electrostatic interaction, as in heavy atoms. Then $\\vec l_i$ and $\\vec s_i$ couple first to $\\vec j_i$, which then couple to $\\vec J$. $J$, $M_J$ and parity are exact; the number of states, and even the list of $J$ values, are the same in both schemes. Only the grouping and the energies differ.',
      trap: 'Changing the coupling scheme never changes the count of states.' },
    { id: 'lsj-013', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'microstates',
      q: 'The total number of states in the excited configuration $2p\\,3p$ of carbon (two non-equivalent $p$ electrons) is ______.',
      answer: 36, tol: 0,
      sol: 'The electrons are in different shells, so the Pauli principle does not restrict them: $6\\times6 = 36$ states. They form $^1S, {}^1P, {}^1D$ ($1 + 3 + 5$) and $^3S, {}^3P, {}^3D$ ($3 + 9 + 15$), total 36.',
      trap: 'Using $\\binom{12}{2}$ treats both electrons as if they shared one subshell of 12 spin-orbitals.' },
    { id: 'lsj-014', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'non-equivalent electrons',
      q: 'How many LS terms arise from the configuration $np\\,n\'d$ ($n \\ne n\'$)? ______',
      answer: 6, tol: 0,
      sol: '$L = |1 - 2|, \\dots, 1 + 2 = 1, 2, 3$ and $S = 0, 1$. Every combination is allowed for non-equivalent electrons: $^1P, {}^1D, {}^1F, {}^3P, {}^3D, {}^3F$, six terms.',
      trap: 'Counting $J$ levels instead of terms gives 12.' },
    { id: 'lsj-015', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'intercombination lines',
      q: 'The strong mercury line at 253.7 nm is the transition $6s6p\\;^3P_1 \\to 6s^2\\;^1S_0$. Which statement explains why it is seen at all?',
      options: ['It is a magnetic dipole transition', 'It obeys every LS selection rule', 'Spin-orbit coupling is large in mercury, so $^3P_1$ contains some $^1P_1$ character and $\\Delta S = 0$ is broken', 'Mercury has no singlet states'], answer: 2,
      sol: 'In pure LS coupling $\\Delta S = 0$ forbids this "intercombination" line. Mercury is heavy ($Z = 80$), so spin-orbit mixes $^3P_1$ with $^1P_1$ (both have $J = 1$ and the same parity). The admixed singlet part decays to $^1S_0$; the lifetime is about 120 ns, much longer than a fully allowed line.',
      trap: '$^3P_0$ and $^3P_2$ cannot mix with $^1P_1$ (different $J$), so they stay metastable.' },
    { id: 'lsj-016', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'hund rules',
      q: 'Titanium has the configuration $[Ar]\\,3d^2 4s^2$. Its ground level is',
      options: ['$^3F_4$', '$^1G_4$', '$^3P_0$', '$^3F_2$'], answer: 3,
      sol: 'The filled $4s^2$ contributes nothing. $d^2$: put spins parallel ($S = 1$) in $m_l = 2$ and $1$, so $L = 3$ ($F$). Less than half full ($2 < 5$): $J = L - S = 2$. Ground level $^3F_2$.',
      trap: '$^3F_4$ would be the ground level of $d^8$ (Ni$^{2+}$), where the multiplet is inverted.' },

    // ---------- level 3 ----------
    { id: 'lsj-017', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'lande interval rule',
      q: 'For a $^3D$ term obeying the Landé interval rule, the ratio $\\dfrac{E(^3D_3) - E(^3D_2)}{E(^3D_2) - E(^3D_1)}$ is ______.',
      answer: 1.5, tol: 0.01, calc: () => 3 / 2,
      sol: 'With $E_J = \\tfrac{A}{2}J(J+1) + $ const, $E(J) - E(J-1) = AJ$. So the ratio is $3A/2A = 1.5$.',
      trap: 'The ratio is independent of the sign and size of $A$.' },
    { id: 'lsj-018', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'hund rules',
      q: 'The ground level of the Fe$^{2+}$ ion ($3d^6$) is',
      options: ['$^5D_4$', '$^5D_0$', '$^3H_6$', '$^5D_2$'], answer: 0,
      sol: 'Five electrons fill $m_l = 2..-2$ spin up (contributing $L = 0$); the sixth goes spin down into $m_l = 2$. $S = (5 - 1)/2 = 2$, $L = 2$: $^5D$. More than half full, so $J = L + S = 4$: $^5D_4$.',
      trap: 'Using $J = |L - S| = 0$ ignores that the shell is more than half full.' },
    { id: 'lsj-019', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'spin-orbit in LS',
      q: 'The spin-orbit energy in a term is $E_J = \\tfrac{A}{2}[J(J+1) - L(L+1) - S(S+1)]$. For a $^4F$ term with $A = +50$ cm$^{-1}$, the overall width of the multiplet (highest minus lowest level) is ______ cm$^{-1}$.',
      answer: 525, tol: 0, unit: 'cm⁻¹',
      sol: '$L = 3$, $S = 3/2$, so $J = 3/2, \\dots, 9/2$. Width $= \\tfrac{A}{2}[\\tfrac92\\cdot\\tfrac{11}{2} - \\tfrac32\\cdot\\tfrac52] = 25\\times(24.75 - 3.75) = 25\\times21 = 525$ cm$^{-1}$. (Check by intervals: $A(\\tfrac52 + \\tfrac72 + \\tfrac92) = 50\\times10.5 = 525$.)',
      trap: 'The $L(L+1)$ and $S(S+1)$ terms are the same for every level and cancel in a difference.' },
    { id: 'lsj-020', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'equivalent electrons',
      q: 'Which of these terms arise from the configuration $nd^2$ (two equivalent $d$ electrons)?',
      options: ['$^1G$', '$^3F$', '$^3D$', '$^1S$'], answer: [0, 1, 3],
      sol: 'For $l^2$ with equivalent electrons, $L + S$ must be even: singlets with $L$ even and triplets with $L$ odd. $d^2$ gives $^1S, {}^1D, {}^1G, {}^3P, {}^3F$ ($1 + 5 + 9 + 9 + 21 = 45 = \\binom{10}{2}$). $^3D$ has $L + S = 3$, odd, so it is excluded.',
      trap: 'The rule "$L + S$ even" works for two equivalent electrons only, not for $l^3$.' },
    { id: 'lsj-021', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'helium',
      q: 'In first-order perturbation theory the helium ground state energy is $E = -2Z^2(13.6\\text{ eV}) + \\tfrac54 Z(13.6\\text{ eV})$ with $Z = 2$. Its value is ______ eV (to one decimal place).',
      answer: -74.8, tol: 0.1, unit: 'eV', calc: () => -2 * 4 * 13.6 + 1.25 * 2 * 13.6,
      sol: 'Without repulsion: $2\\times(-13.6\\times4) = -108.8$ eV. The first-order repulsion $\\langle e^2/4\\pi\\varepsilon_0r_{12}\\rangle = \\tfrac58 Z\\times27.2$ eV $= 34.0$ eV. Total $-74.8$ eV, against the measured $-79.0$ eV.',
      trap: 'The repulsion term is positive; adding it with the wrong sign gives $-142.8$ eV.' },
    { id: 'lsj-022', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'helium',
      q: 'A variational calculation for helium with trial function $\\propto e^{-Z_{\\rm eff}(r_1 + r_2)/a_0}$ gives $Z_{\\rm eff} = 27/16$ and $E = -2Z_{\\rm eff}^2\\times13.6$ eV. The resulting ground state energy is ______ eV (to one decimal place).',
      answer: -77.5, tol: 0.1, unit: 'eV', calc: () => -2 * (27 / 16) ** 2 * 13.6,
      sol: '$Z_{\\rm eff}^2 = (1.6875)^2 = 2.8477$. $E = -2\\times2.8477\\times13.6 = -77.46 \\approx -77.5$ eV. Each electron screens the nucleus from the other by $5/16$ of a charge. It is above the true $-79.0$ eV, as the variational principle guarantees.',
      trap: 'A variational energy can never lie below the true ground state energy.' },
    { id: 'lsj-023', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'jj coupling',
      q: 'In jj coupling, two equivalent $p$ electrons both in $p_{3/2}$ (the configuration $(p_{3/2})^2$) can have total $J$ equal to',
      options: ['$0, 1, 2, 3$', '$0$ and $2$ only', '$1$ and $3$ only', '$2$ only'], answer: 1,
      sol: 'Two identical particles of $j = 3/2$: the antisymmetric combinations have $J = 2$ and $0$ (for two equivalent fermions with half-integer $j$, $J$ must be even). States: $5 + 1 = 6 = \\binom{4}{2}$. With $(p_{1/2})^2$: $J = 0$; $(p_{1/2}p_{3/2})$: $J = 1, 2$. All $J$ values: 0, 0, 1, 2, 2, matching LS ($^1S_0, {}^3P_{0,1,2}, {}^1D_2$).',
      trap: '$J = 1, 3$ need a symmetric pair of $j = 3/2$ states, forbidden for equivalent electrons.' },
    { id: 'lsj-024', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'hund rules',
      q: 'Which statements about fine-structure ordering in LS coupling are correct?',
      options: ['For a subshell less than half full the level with smallest $J$ lies lowest (normal multiplet)', 'For a subshell more than half full the multiplet is inverted ($A < 0$)', 'A half-filled subshell has $L = 0$ in its ground term, so its ground term has a single level', 'The spin-orbit constant $A$ is always positive'], answer: [0, 1, 2],
      sol: 'For $N$ electrons in $l^N$, $A \\propto \\pm\\zeta/2S$, positive when less than half full and negative for holes. The half-filled ground term has $L = 0$ ($^{2S+1}S$), so $J = S$ only.',
      trap: '$A < 0$ for more than half-filled shells: holes behave like positive charges.' },
    { id: 'lsj-025', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'microstates',
      q: 'The number of microstates of the configuration $3d^3$ is ______.',
      answer: 120, tol: 0,
      sol: 'Ten spin-orbitals ($2\\times5$), three electrons: $\\binom{10}{3} = 120$.',
      trap: '$\\binom{10}{3}$, not $10^3$ or $10\\times9\\times8$ (which counts order).' },
    { id: 'lsj-026', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'hole equivalence',
      q: 'Which two configurations give exactly the same set of LS terms?',
      options: ['$p^1$ and $p^2$', '$d^2$ and $d^3$', '$p^2$ and $p^4$', '$s^1$ and $p^1$'], answer: 2,
      sol: 'A subshell with $N$ holes has the same terms as one with $N$ electrons. $p^4$ has 2 holes in the 6-place $p$ shell, so its terms equal those of $p^2$: $^1S, {}^1D, {}^3P$. Only the $J$ ordering (normal vs inverted) differs.',
      trap: 'Same terms does not mean same ground level: C is $^3P_0$, O is $^3P_2$.' },
    { id: 'lsj-027', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'levels of a configuration',
      q: 'The total number of fine-structure levels ($^{2S+1}L_J$) arising from $np^2$ is ______.',
      answer: 5, tol: 0,
      sol: 'Terms $^1S$, $^1D$, $^3P$. Levels: $^1S_0$, $^1D_2$, $^3P_0$, $^3P_1$, $^3P_2$: five. Check states: $1 + 5 + 1 + 3 + 5 = 15$.',
      trap: 'Three terms but five levels: the triplet splits into three.' },
    { id: 'lsj-028', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'selection rules',
      q: 'Between levels of configurations of opposite parity, which transition is allowed as an electric dipole transition in pure LS coupling?',
      options: ['$^1D_2 \\to {}^3P_1$', '$^3D_3 \\to {}^3S_1$', '$^1S_0 \\to {}^1S_0$', '$^3P_2 \\to {}^3S_1$'], answer: 3,
      sol: '$^3P_2\\to{}^3S_1$: $\\Delta S = 0$, $\\Delta L = -1$, $\\Delta J = -1$: allowed. $^1D_2\\to{}^3P_1$ changes $S$. $^3D_3\\to{}^3S_1$ has $\\Delta L = 2$ and $\\Delta J = 2$. $^1S_0\\to{}^1S_0$ is $J = 0\\to0$ (and $L = 0\\to0$), forbidden.',
      trap: 'Check $S$, $L$ and $J$ separately; one failure is enough to forbid it.' },

    // ---------- level 4 ----------
    { id: 'lsj-029', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'lande interval rule',
      q: 'A triplet term has three levels separated by 30 cm$^{-1}$ (lower pair) and 45 cm$^{-1}$ (upper pair), with the levels in normal order. Assuming the Landé interval rule, the spin-orbit constant $A$ is ______ cm$^{-1}$.',
      answer: 15, tol: 0, unit: 'cm⁻¹',
      sol: 'Intervals $AJ$: the ratio $45/30 = 3/2$ means the upper $J$ values of the pairs are 2 and 3, so the levels are $J = 1, 2, 3$ (a $^3D$ term). $2A = 30$ gives $A = 15$ cm$^{-1}$; check $3A = 45$.',
      trap: 'Dividing an interval by the lower $J$ gives the wrong $A$.' },
    { id: 'lsj-030', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'lande interval rule',
      q: 'A triplet term shows three levels. The interval between the two upper levels and that between the two lower levels are in the ratio 5 : 4. The term is',
      options: ['$^3G$', '$^3F$', '$^3H$', '$^3D$'], answer: 0,
      sol: 'For $S = 1$, $J = L - 1, L, L + 1$. Intervals are $AL$ (lower pair) and $A(L+1)$ (upper pair), ratio $(L+1)/L = 5/4$, so $L = 4$: a $^3G$ term with $J = 3, 4, 5$.',
      trap: 'The ratio of intervals is the ratio of the upper $J$ values of each pair, here 5 and 4.' },
    { id: 'lsj-031', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'helium-like ions',
      q: 'Use the variational result $E = -2(Z - 5/16)^2\\times13.6$ eV for the ground state of the helium-like ion Li$^+$ ($Z = 3$). The energy needed to remove one electron from Li$^+$ (leaving Li$^{2+}$ in its ground state) is ______ eV (to one decimal place).',
      answer: 74.1, tol: 0.2, unit: 'eV', calc: () => 2 * (3 - 5 / 16) ** 2 * 13.6 - 13.6 * 9,
      sol: '$E(\\text{Li}^+) = -2\\times(2.6875)^2\\times13.6 = -196.5$ eV. $E(\\text{Li}^{2+}) = -13.6\\times9 = -122.4$ eV. Ionisation energy $= -122.4 - (-196.5) = 74.1$ eV (measured 75.6 eV).',
      trap: 'The ionisation energy is the difference between the ion and the remaining one-electron ion, not half the total energy.' },
    { id: 'lsj-032', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'helium',
      q: 'Which statements about the spectrum of helium are correct?',
      options: ['There are (almost) no E1 lines between singlet (para) and triplet (ortho) levels', 'The $1s2s\\;^3S_1$ level is metastable', 'The lowest triplet level is $1s^2\\;^3S_1$', 'For a given excited configuration $1s\\,nl$ ($l$ fixed), the triplet term lies below the singlet'], answer: [0, 1, 3],
      sol: 'Helium is light, LS is excellent, so $\\Delta S = 0$ holds well and the singlet and triplet systems look like two separate spectra. $2\\,^3S_1$ cannot decay to $1\\,^1S_0$ by E1 ($\\Delta S \\ne 0$, $\\Delta L = 0$, no parity change); its lifetime is about 7900 s. $1s^2$ has only a singlet. Exchange puts each triplet below its singlet partner.',
      trap: 'The Pauli principle forbids $1s^2\\;^3S$; the triplet ladder starts at $1s2s$.' },
    { id: 'lsj-033', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'levels of a configuration',
      q: 'The excited configuration $3d\\,4p$ gives how many fine-structure levels $^{2S+1}L_J$ in LS coupling? ______',
      answer: 12, tol: 0,
      sol: '$L = 1, 2, 3$; $S = 0, 1$. Singlets $^1P_1, {}^1D_2, {}^1F_3$: 3 levels. Triplets $^3P_{0,1,2}$, $^3D_{1,2,3}$, $^3F_{2,3,4}$: 9 levels. Total 12. (States: $10\\times6 = 60$.)',
      trap: 'Six terms but twelve levels.' },
    { id: 'lsj-034', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'hund rules',
      q: 'The ground level of the Nd$^{3+}$ ion ($4f^3$) is',
      options: ['$^4I_{15/2}$', '$^4I_{9/2}$', '$^4F_{3/2}$', '$^2H_{9/2}$'], answer: 1,
      sol: 'Three parallel spins: $S = 3/2$. Put them in $m_l = 3, 2, 1$: $L = 6$ (letter I, after H; J is skipped). Less than half full ($3 < 7$): $J = L - S = 9/2$. Ground level $^4I_{9/2}$, the lower level of the Nd laser transitions.',
      trap: '$^4I_{15/2}$ ($J = L + S$) is the ground level of Er$^{3+}$ ($4f^{11}$).' },
    { id: 'lsj-035', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'jj coupling',
      q: 'In the extreme jj-coupling limit, the lowest level of an $np^2$ configuration is',
      options: ['$(p_{3/2})^2$ with $J = 2$', '$(p_{1/2}p_{3/2})$ with $J = 1$', '$(p_{1/2})^2$ with $J = 0$', '$(p_{3/2})^2$ with $J = 0$'], answer: 2,
      sol: 'With strong single-electron spin-orbit, $p_{1/2}$ lies below $p_{3/2}$. Putting both electrons in $p_{1/2}$ allows only $J = 0$. Lead ($6p^2$) is close to this limit; its ground level, like carbon\'s $^3P_0$, has $J = 0$, since $J$ and parity are conserved as the coupling changes.',
      trap: 'The $J$ of the ground level is the same in both limits even though the labels change.' },
    { id: 'lsj-036', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'spin-orbit in LS',
      q: 'For a $^3P$ term with spin-orbit constant $A = 20$ cm$^{-1}$, the $^3P_0$ level lies ______ cm$^{-1}$ relative to the unsplit term energy (with sign).',
      answer: -40, tol: 0, unit: 'cm⁻¹',
      sol: '$E_J = \\tfrac{A}{2}[J(J+1) - L(L+1) - S(S+1)] = 10\\times[0 - 2 - 2] = -40$ cm$^{-1}$. ($^3P_1$: $-20$, $^3P_2$: $+20$; weighted by $2J+1$: $-40 - 60 + 100 = 0$.)',
      trap: 'The weighted centre of gravity stays at the unsplit energy, which is a useful check.' },

    // ---------- level 5 ----------
    { id: 'lsj-037', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'levels of a configuration',
      q: 'The total number of fine-structure levels arising from $3d^2$ in LS coupling is ______.',
      answer: 9, tol: 0,
      sol: 'Terms $^1S, {}^1D, {}^1G, {}^3P, {}^3F$. Levels: $^1S_0$, $^1D_2$, $^1G_4$, $^3P_{0,1,2}$, $^3F_{2,3,4}$: $1 + 1 + 1 + 3 + 3 = 9$. States: $1 + 5 + 9 + 9 + 21 = 45 = \\binom{10}{2}$.',
      trap: 'Forgetting that $^3D$, $^3G$, $^1P$, $^1F$ are excluded for equivalent electrons gives too many.' },
    { id: 'lsj-038', type: 'msq', level: 5, exams: ['gate', 'net'], sub: 'equivalent electrons',
      q: 'For the $2p^3$ configuration of nitrogen, which statements are correct?',
      options: ['The terms are $^4S$, $^2D$ and $^2P$', 'The ground level is $^4S_{3/2}$', 'The $^4S_{3/2}$ level is not split by spin-orbit coupling in first order', 'A $^4D$ term also arises'], answer: [0, 1, 2],
      sol: '$\\binom{6}{3} = 20 = 4 + 10 + 6$ for $^4S + {}^2D + {}^2P$. Hund gives $^4S_{3/2}$. An $S$ term has $L = 0$ and a single $J$, so there is nothing to split. A quartet needs all three spins parallel, which puts one electron in each $m_l$ and forces $L = 0$: no $^4D$.',
      trap: 'Maximum $S$ with equivalent electrons forces the orbital part, and so $L$, to be fixed.' },
    { id: 'lsj-039', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'exchange',
      q: 'In helium the $1s2s$ levels lie 19.82 eV ($^3S_1$) and 20.62 eV ($^1S_0$) above the ground state. In the simple model $E = E_0 + J_{\\rm dir} \\pm K$, the exchange integral $K$ is ______ eV (to two decimal places).',
      answer: 0.40, tol: 0.01, unit: 'eV', calc: () => (20.62 - 19.82) / 2,
      sol: 'Singlet $= E_0 + J_{\\rm dir} + K$, triplet $= E_0 + J_{\\rm dir} - K$. Difference $2K = 0.80$ eV, so $K = 0.40$ eV.',
      trap: 'The singlet-triplet gap is $2K$, not $K$.' },
    { id: 'lsj-040', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'hund rules',
      q: 'The ground level of the Er$^{3+}$ ion ($4f^{11}$) is',
      options: ['$^4I_{9/2}$', '$^2H_{11/2}$', '$^4F_{9/2}$', '$^4I_{15/2}$'], answer: 3,
      sol: '$4f^{11}$ has 3 holes: same terms as $f^3$, Hund term $^4I$ ($S = 3/2$, $L = 6$). More than half full, so $J = L + S = 15/2$. The $^4I_{13/2}\\to{}^4I_{15/2}$ transition at 1.54 $\\mu$m is the erbium fibre amplifier line.',
      trap: 'Hole counting gives the term; the "more than half" rule then flips $J$ to $L + S$.' },
    ...more2,
    ...r4.items,
    ...r5.items,
  ],

  gens: [
    { id: 'lsj-g01', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'lande interval rule',
      make(r) {
        const S = choose(r, [0.5, 1, 1.5, 2]), L = int(r, Math.max(1, Math.ceil(S)), 4);
        const js = Js(S, L), k = int(r, 1, js.length - 1), J = js[k];
        const A = choose(r, [-1, 1]) * pick(r, 5, 80, 0.5);
        return { q: `A $${sym(S, L)}$ term has spin-orbit constant $A = ${A}$ cm$^{-1}$ and obeys the Landé interval rule. The energy of the $J = ${fr(J)}$ level minus that of the $J = ${fr(J - 1)}$ level is ______ cm$^{-1}$ (with sign).`,
          answer: round(A * J, 2), tol: 0.01, unit: 'cm⁻¹', A, J,
          sol: `$E_J = \\tfrac{A}{2}J(J+1) + $ const, so $E_J - E_{J-1} = AJ = ${A}\\times${fr(J)} = ${round(A * J, 2)}$ cm$^{-1}$.${A < 0 ? ' $A < 0$: the multiplet is inverted, so the higher $J$ lies lower.' : ''}`,
          trap: 'The interval goes with the upper $J$ of the pair.' };
      },
      verify: (p) => p.A * p.J },
    { id: 'lsj-g02', type: 'nat', level: 1, exams: ['gate', 'net'], sub: 'levels of a term',
      make(r) {
        const S = choose(r, [0, 0.5, 1, 1.5, 2, 2.5]), L = int(r, 0, 6);
        const n = Math.round(Math.min(2 * S + 1, 2 * L + 1));
        return { q: `The number of fine-structure levels (distinct $J$ values) in a $${sym(S, L)}$ term is ______.`,
          answer: n, tol: 0, S, L,
          sol: `$S = ${fr(S)}$, $L = ${L}$, so $J$ runs from $|L - S| = ${fr(Math.abs(L - S))}$ to $L + S = ${fr(L + S)}$ in steps of 1: ${n} value${n > 1 ? 's' : ''}. In general it is the smaller of $2S+1$ and $2L+1$.`,
          trap: 'The multiplicity $2S+1$ counts levels only when $L \\ge S$.' };
      },
      verify: (p) => Js(p.S, p.L).length },
    { id: 'lsj-g03', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'degeneracy',
      make(r) {
        const S = choose(r, [0.5, 1, 1.5, 2]), L = int(r, 1, 5);
        const mode = choose(r, ['term', 'level']);
        const js = Js(S, L), J = choose(r, js);
        const ans = mode === 'term' ? Math.round((2 * S + 1) * (2 * L + 1)) : Math.round(2 * J + 1);
        return { q: mode === 'term' ? `The total number of states in a $${sym(S, L)}$ term (all its levels) is ______.` : `The number of states in the level $${sym(S, L, J)}$ (its degeneracy in zero field) is ______.`,
          answer: ans, tol: 0, S, L, J, mode,
          sol: mode === 'term' ? `$(2S+1)(2L+1) = ${Math.round(2 * S + 1)}\\times${2 * L + 1} = ${ans}$. Check: $\\sum_J(2J+1)$ over $J = ${js.map(fr).join(', ')}$ is ${js.reduce((a, j) => a + 2 * j + 1, 0)}.` : `A level of given $J$ has $2J + 1 = ${ans}$ states ($M_J = -J, \\dots, J$).`,
          trap: mode === 'term' ? 'Do not count only the top level.' : 'The degeneracy of a level depends on $J$ only, not on $S$ or $L$.' };
      },
      verify: (p) => (p.mode === 'term' ? Js(p.S, p.L).reduce((a, j) => a + 2 * j + 1, 0) : 2 * p.J + 1) },
    { id: 'lsj-g04', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'hund rules',
      make(r) {
        const sh = choose(r, ['p', 'd', 'f']), l = { p: 1, d: 2, f: 3 }[sh];
        const [name, N] = choose(r, ION[sh]);
        const g = hund(l, N);
        const show = (t) => `$${sym(t[0], t[1], t[2])}$`;
        const other = N < 2 * l + 1 ? g.L + g.S : Math.abs(g.L - g.S);
        const wr = [[g.S, g.L, other], [Math.max(0, g.S - 1), g.L + 1, Math.abs(g.L + 1 - Math.max(0, g.S - 1))], [g.S, g.L + 1, N < 2 * l + 1 ? g.L + 1 - g.S : g.L + 1 + g.S], [g.S + (g.S >= 1 ? -1 : 1), g.L, g.L + g.S], [g.S + 1, Math.max(0, g.L - 1), Math.abs(Math.max(0, g.L - 1) - g.S - 1)], [g.S, g.L + 2, g.L + 2 + g.S]];
        const o = mcqOptions(r, [g.S, g.L, g.J], wr, show);
        return { q: `The ground level of ${name} (outer configuration ${sh === 'p' ? `$np^{${N}}$` : sh === 'd' ? `$3d^{${N}}$` : `$4f^{${N}}$`}) predicted by Hund's rules is`,
          options: o.options, answer: o.answer,
          sol: `Fill $m_l = ${l}, ${l - 1}, \\dots$ with spin up first, then spin down. $S = ${fr(g.S)}$, $L = ${g.L}$ (letter ${LT[g.L]}). The subshell is ${N < 2 * l + 1 ? `less than half full ($${N} < ${2 * l + 1}$), so $J = |L - S|$` : N === 2 * l + 1 ? 'exactly half full, so $L = 0$ and $J = S$' : `more than half full ($${N} > ${2 * l + 1}$), so $J = L + S$`} $= ${fr(g.J)}$: $${sym(g.S, g.L, g.J)}$.`,
          trap: 'The third rule flips for more than half-filled shells.' };
      } },
    { id: 'lsj-g05', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'microstates',
      make(r) {
        const l = int(r, 1, 3), cap = 2 * (2 * l + 1), N = int(r, 2, Math.min(cap - 1, 5));
        const ans = binom(cap, N);
        return { q: `The number of microstates (distinct Slater determinants) of the configuration $n${'spdf'[l]}^{${N}}$ is ______.`,
          answer: ans, tol: 0, cap, N,
          sol: `A $${'spdf'[l]}$ subshell has $2(2l+1) = ${cap}$ spin-orbitals. Choosing ${N} of them for ${N} identical electrons: $\\binom{${cap}}{${N}} = ${ans}$.`,
          trap: 'Electrons are identical and obey Pauli: use a binomial coefficient, not a power.' };
      },
      verify: (p) => binom(p.cap, p.N) },
    { id: 'lsj-g06', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'non-equivalent electrons',
      make(r) {
        const l1 = int(r, 0, 3), l2 = int(r, 1, 3);
        const mode = choose(r, ['terms', 'levels', 'states']);
        const Ls = []; for (let L = Math.abs(l1 - l2); L <= l1 + l2; L++) Ls.push(L);
        const terms = 2 * Ls.length, levels = Ls.reduce((a, L) => a + Js(0, L).length + Js(1, L).length, 0), stt = 4 * (2 * l1 + 1) * (2 * l2 + 1);
        const ans = mode === 'terms' ? terms : mode === 'levels' ? levels : stt;
        const c = `$n${'spdf'[l1]}\\,n'${'spdf'[l2]}$`;
        return { q: `For two non-equivalent electrons in the configuration ${c} ($n \\ne n'$), the number of ${mode === 'terms' ? 'LS terms $^{2S+1}L$' : mode === 'levels' ? 'fine-structure levels $^{2S+1}L_J$' : 'states (counting every $M_J$)'} is ______.`,
          answer: ans, tol: 0, l1, l2, mode,
          sol: `$L = ${Ls.join(', ')}$ and $S = 0, 1$, all allowed (different shells). Terms: ${terms}. Levels: each singlet has one level; each triplet has $\\min(3, 2L+1)$ levels, giving ${levels} in all. States: $${2 * (2 * l1 + 1)}\\times${2 * (2 * l2 + 1)} = ${stt}$. The answer is ${ans}.`,
          trap: 'Terms, levels and states are three different counts.' };
      },
      verify: (p) => { let t = 0, lv = 0; for (let L = Math.abs(p.l1 - p.l2); L <= p.l1 + p.l2; L++) { t += 2; lv += 1 + (L === 0 ? 1 : 3); } return p.mode === 'terms' ? t : p.mode === 'levels' ? lv : 4 * (2 * p.l1 + 1) * (2 * p.l2 + 1); } },
    { id: 'lsj-g07', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'jj coupling',
      make(r) {
        const l1 = int(r, 1, 3), l2 = int(r, 1, 3);
        const j1 = l1 + choose(r, [-0.5, 0.5]), j2 = l2 + choose(r, [-0.5, 0.5]);
        const list = (a, b) => { const o = []; for (let J = a; J <= b + 1e-9; J++) o.push(fr(J)); return o.join(', '); };
        const right = list(Math.abs(j1 - j2), j1 + j2);
        const wr = [list(Math.abs(l1 - l2), l1 + l2 + 1), String(fr(j1 + j2)), list(Math.abs(j1 - j2) + 1, j1 + j2 + 1), list(Math.abs(l1 - l2), l1 + l2), list(Math.max(0, Math.abs(j1 - j2) - 1), j1 + j2)];
        const o = mcqOptions(r, right, wr, (v) => `$J = ${v}$`);
        return { q: `In jj coupling, an electron in $n${'spdf'[l1]}_{${fr(j1)}}$ and a second electron in $n'${'spdf'[l2]}_{${fr(j2)}}$ (different shells) couple to total angular momentum`,
          options: o.options, answer: o.answer,
          sol: `$\\vec J = \\vec j_1 + \\vec j_2$ with $j_1 = ${fr(j1)}$, $j_2 = ${fr(j2)}$: $J = |j_1 - j_2|, \\dots, j_1 + j_2$, that is $J = ${right}$. Number of states $(2j_1+1)(2j_2+1) = ${(2 * j1 + 1) * (2 * j2 + 1)}$.`,
          trap: 'Couple the $j$ values, not the $l$ values, in jj coupling.' };
      } },
    { id: 'lsj-g08', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'spin-orbit in LS',
      make(r) {
        const S = choose(r, [0.5, 1, 1.5, 2]), L = int(r, 1, 4), A = choose(r, [-1, 1]) * int(r, 5, 60);
        const js = Js(S, L), mode = choose(r, ['level', 'width']);
        const J = choose(r, js);
        const E = (A / 2) * (J * (J + 1) - L * (L + 1) - S * (S + 1));
        const w = Math.abs((A / 2) * (js[js.length - 1] * (js[js.length - 1] + 1) - js[0] * (js[0] + 1)));
        const ans = mode === 'level' ? E : w;
        return { q: mode === 'level'
          ? `The spin-orbit energy in LS coupling is $E_J = \\tfrac{A}{2}[J(J+1) - L(L+1) - S(S+1)]$. For the $${sym(S, L, J)}$ level of a term with $A = ${A}$ cm$^{-1}$, $E_J$ relative to the unsplit term is ______ cm$^{-1}$ (with sign).`
          : `A $${sym(S, L)}$ term has spin-orbit constant $A = ${A}$ cm$^{-1}$. The total spread of its fine-structure levels (highest minus lowest, a positive number) is ______ cm$^{-1}$.`,
          answer: round(ans, 2), tol: 0.01, unit: 'cm⁻¹', A, S, L, J, mode,
          sol: mode === 'level'
            ? `$J(J+1) = ${J * (J + 1)}$, $L(L+1) = ${L * (L + 1)}$, $S(S+1) = ${S * (S + 1)}$. $E_J = ${A / 2}\\times(${round(J * (J + 1) - L * (L + 1) - S * (S + 1), 4)}) = ${round(E, 2)}$ cm$^{-1}$.`
            : `$J$ runs from ${fr(js[0])} to ${fr(js[js.length - 1])}. Spread $= \\tfrac{|A|}{2}[J_{max}(J_{max}+1) - J_{min}(J_{min}+1)] = ${Math.abs(A) / 2}\\times${round(js[js.length - 1] * (js[js.length - 1] + 1) - js[0] * (js[0] + 1), 4)} = ${round(w, 2)}$ cm$^{-1}$.`,
          trap: 'The $L$ and $S$ terms are common to every level and drop out of differences.' };
      },
      verify: (p) => { const js = Js(p.S, p.L); return p.mode === 'level' ? (p.A / 2) * (p.J * (p.J + 1) - p.L * (p.L + 1) - p.S * (p.S + 1)) : Math.abs(p.A) / 2 * (js.at(-1) * (js.at(-1) + 1) - js[0] * (js[0] + 1)); } },
    { id: 'lsj-g09', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'selection rules',
      make(r) {
        const lv = []; for (const S of [0, 1]) for (let L = 0; L <= 3; L++) for (const J of Js(S, L)) lv.push([S, L, J]);
        const okT = (a, b) => a[0] === b[0] && Math.abs(a[1] - b[1]) <= 1 && !(a[1] === 0 && b[1] === 0) && Math.abs(a[2] - b[2]) <= 1 && !(a[2] === 0 && b[2] === 0);
        const pairs = []; for (const a of lv) for (const b of lv) if (a !== b) pairs.push([a, b, okT(a, b)]);
        const k = int(r, 1, 3);
        const ch = shuffle(r, [...shuffle(r, pairs.filter((p) => p[2])).slice(0, k), ...shuffle(r, pairs.filter((p) => !p[2])).slice(0, 4 - k)]);
        const s = (t) => sym(t[0], t[1], t[2]);
        return { q: 'In each option the two levels belong to configurations of opposite parity. Which transitions are allowed as electric dipole transitions in pure LS coupling?',
          options: ch.map(([a, b]) => `$${s(a)}\\to{}${s(b)}$`), answer: ch.map((c, i) => (c[2] ? i : -1)).filter((i) => i >= 0),
          sol: 'Rules: $\\Delta S = 0$; $\\Delta L = 0, \\pm1$ (not $0\\to0$); $\\Delta J = 0, \\pm1$ (not $0\\to0$). ' + ch.map(([a, b, ok]) => `$${s(a)}\\to{}${s(b)}$: ${ok ? 'allowed' : 'forbidden (' + [a[0] !== b[0] ? '$\\Delta S \\ne 0$' : '', Math.abs(a[1] - b[1]) > 1 ? '$|\\Delta L| > 1$' : '', a[1] === 0 && b[1] === 0 ? '$L = 0\\to0$' : '', Math.abs(a[2] - b[2]) > 1 ? '$|\\Delta J| > 1$' : '', a[2] === 0 && b[2] === 0 ? '$J = 0\\to0$' : ''].filter(Boolean).join(', ') + ')'}.`).join(' '),
          trap: '$\\Delta L = 0$ and $\\Delta J = 0$ are allowed, except $0\\to0$.' };
      } },
    { id: 'lsj-g10', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'helium-like ions',
      make(r) {
        const [Z, ion] = choose(r, [[2, 'He'], [3, 'Li$^+$'], [4, 'Be$^{2+}$'], [5, 'B$^{3+}$'], [6, 'C$^{4+}$'], [8, 'O$^{6+}$']]);
        const m = choose(r, ['pert', 'var']);
        const E = m === 'pert' ? -(2 * Z * Z - 1.25 * Z) * 13.6 : -2 * (Z - 5 / 16) ** 2 * 13.6;
        return { q: m === 'pert'
          ? `First-order perturbation theory gives the ground state energy of a helium-like ion as $E = -2Z^2(13.6\\text{ eV}) + \\tfrac54Z(13.6\\text{ eV})$. For ${ion} ($Z = ${Z}$) this is ______ eV (to one decimal place).`
          : `The simple variational treatment of a helium-like ion gives $Z_{\\rm eff} = Z - 5/16$ and $E = -2Z_{\\rm eff}^2(13.6\\text{ eV})$. For ${ion} ($Z = ${Z}$) this is ______ eV (to one decimal place).`,
          answer: round(E, 1), tol: 0.1, unit: 'eV', Z, m,
          sol: m === 'pert'
            ? `Unperturbed: $-2\\times${Z * Z}\\times13.6 = ${round(-2 * Z * Z * 13.6, 1)}$ eV. Repulsion: $\\tfrac54\\times${Z}\\times13.6 = ${round(1.25 * Z * 13.6, 1)}$ eV. Sum: ${round(E, 1)} eV.`
            : `$Z_{\\rm eff} = ${Z} - 0.3125 = ${Z - 0.3125}$; $E = -2\\times${round((Z - 0.3125) ** 2, 4)}\\times13.6 = ${round(E, 1)}$ eV.`,
          trap: m === 'pert' ? 'The repulsion raises the energy.' : 'Screening reduces the charge each electron sees by $5/16$, not by 1.' };
      },
      verify: (p) => (p.m === 'pert' ? -(2 * p.Z ** 2 - 1.25 * p.Z) * 13.6 : -2 * (p.Z - 5 / 16) ** 2 * 13.6) },
    { id: 'lsj-g11', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'equivalent electrons',
      make(r) {
        const [cfg, yes, no] = choose(r, [
          ['np^2', ['^1S', '^1D', '^3P'], ['^1P', '^3S', '^3D']],
          ['nd^2', ['^1S', '^1D', '^1G', '^3P', '^3F'], ['^1P', '^1F', '^3S', '^3D', '^3G']],
          ['np^3', ['^4S', '^2P', '^2D'], ['^4P', '^4D', '^2S']],
          ['np^4', ['^1S', '^1D', '^3P'], ['^1P', '^3S', '^3D']]]);
        const not = choose(r, [true, false]);
        const right = not ? choose(r, no) : choose(r, yes);
        const wr = shuffle(r, not ? yes : no);
        const o = mcqOptions(r, right, wr, (v) => `$${v}$`);
        return { q: `Which of these terms ${not ? 'does <b>not</b> arise' : 'arises'} from the configuration $${cfg}$ (equivalent electrons)?`,
          options: o.options, answer: o.answer,
          sol: `The Pauli principle allows only these terms for $${cfg}$: $${yes.join(', ')}$. ${not ? `So $${right}$ is the one that does not arise.` : `Of the options, only $${right}$ is in the list.`}`,
          trap: 'Terms of non-equivalent electrons include extra ones that the Pauli principle removes for equivalent electrons.' };
      } },
    { id: 'lsj-g12', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'helium-like ions',
      make(r) {
        const [Z, ion, rest] = choose(r, [[2, 'He', 'He$^+$'], [3, 'Li$^+$', 'Li$^{2+}$'], [4, 'Be$^{2+}$', 'Be$^{3+}$'], [5, 'B$^{3+}$', 'B$^{4+}$'], [6, 'C$^{4+}$', 'C$^{5+}$']]);
        const E = -2 * (Z - 5 / 16) ** 2 * 13.6, IE = -13.6 * Z * Z - E;
        return { q: `Using the variational ground state energy $E = -2(Z - 5/16)^2\\times13.6$ eV for the two-electron ion ${ion} ($Z = ${Z}$), the energy needed to remove one electron (leaving ${rest} in its ground state) is ______ eV (to one decimal place).`,
          answer: round(IE, 1), tol: 0.2, unit: 'eV', Z,
          sol: `$E(${ion.replace(/\$/g, '')}) = -2\\times(${Z - 0.3125})^2\\times13.6 = ${round(E, 2)}$ eV. The one-electron ion left behind has $-13.6Z^2 = ${round(-13.6 * Z * Z, 1)}$ eV. Ionisation energy $= ${round(-13.6 * Z * Z, 1)} - (${round(E, 2)}) = ${round(IE, 1)}$ eV.`,
          trap: 'Ionisation energy is a difference of two total energies, not half the two-electron energy.' };
      },
      verify: (p) => -13.6 * p.Z ** 2 + 2 * (p.Z - 5 / 16) ** 2 * 13.6 },
    ...more,
    ...r4.gens,
    ...r5.gens,
  ],
};
