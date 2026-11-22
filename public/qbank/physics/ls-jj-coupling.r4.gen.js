// Round 4 extras for ls-jj-coupling: original questions, written 2026-11-22.
import { int, choose, mcqOptions, shuffle } from '../_util.js';
const R = String.raw;

const LL = 'SPDFGHIK';
const ll = 'spdf';
const hf = (x) => (Number.isInteger(x) ? String(x) : `${2 * x}/2`);
const term = (S, L) => `$^{${2 * S + 1}}${LL[L]}$`;
/** LS terms (S, L) of two non-equivalent electrons. */
const lsTerms = (l1, l2) => { const t = []; for (const S of [0, 1]) for (let L = Math.abs(l1 - l2); L <= l1 + l2; L++) t.push([S, L]); return t; };
/** Number of levels with total J from two non-equivalent electrons, counted in jj coupling. */
const jjCount = (l1, l2, J) => {
  let c = 0;
  for (const j1 of [l1 - 0.5, l1 + 0.5]) for (const j2 of [l2 - 0.5, l2 + 0.5]) if (j1 > 0 && j2 > 0 && J >= Math.abs(j1 - j2) && J <= j1 + j2) c++;
  return c;
};

export default {
  items: [
    { id: 'lsj-r4-01', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'term symbols',
      q: R`An atomic level is labelled $^3D_2$. Its quantum numbers are`,
      options: [R`$S = 3$, $L = 2$, $J = 2$`, R`$S = \tfrac32$, $L = 2$, $J = 2$`, R`$S = 1$, $L = 3$, $J = 2$`, R`$S = 1$, $L = 2$, $J = 2$`], answer: 3,
      sol: R`In $^{2S+1}L_J$ the superscript is the multiplicity $2S + 1 = 3$, so $S = 1$. The letter D means $L = 2$ (S, P, D, F = 0, 1, 2, 3). The subscript is $J = 2$, which is allowed since $|L - S| = 1\le J\le L + S = 3$.`,
      trap: R`The superscript is $2S + 1$, not $S$; and D is $L = 2$, not 3.` },
    { id: 'lsj-r4-02', type: 'nat', level: 1, exams: ['jam', 'gate', 'net'], sub: 'degeneracy',
      q: R`How many states (different $M_J$) does the single level $^2F_{7/2}$ contain? ______`,
      answer: 8, tol: 0,
      sol: R`A level of given $J$ has $2J + 1$ states, $M_J = -J, \dots, +J$. With $J = \tfrac72$: $2\times\tfrac72 + 1 = 8$.`,
      trap: R`$2L + 1 = 7$ or $(2S+1)(2L+1) = 14$ count other things: the orbital states, or the whole $^2F$ term (both levels).` },
    { id: 'lsj-r4-03', type: 'mcq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'terms',
      q: R`Which of these terms can NOT arise from any configuration of two electrons (outside closed shells)?`,
      options: [R`$^1G$`, R`$^3F$`, R`$^4P$`, R`$^1S$`], answer: 2,
      sol: R`Two spin-$\tfrac12$ electrons give total $S = 0$ or $1$, so multiplicity 1 or 3 only. A quartet needs $S = \tfrac32$, i.e. at least three unpaired electrons. $^1G$ ($dd'$ or $d^2$), $^3F$ ($pd$ or $d^2$) and $^1S$ ($s^2$, $p^2$) are all possible.`,
      trap: R`A large $L$ like G is easy to reach with two $d$ electrons; it is the spin that limits the multiplicity.` },
    { id: 'lsj-r4-04', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Hund rules',
      q: R`Carbon ($2p^2$) has the ground level $^3P_0$, while oxygen ($2p^4$) has $^3P_2$. Both have the same ground term $^3P$. Why is the order of $J$ levels reversed?`,
      options: [R`For a shell less than half full the spin-orbit constant of the ground term is positive (normal order); beyond half full it is negative (inverted order), as if the holes carried the coupling with the opposite sign`,
        R`Oxygen's larger nuclear charge always puts the largest $J$ lowest`,
        R`Oxygen's ground term is really $^3D$`,
        R`Oxygen is in the jj-coupling limit, where Hund's rules do not apply`], answer: 0,
      sol: R`$2p^4$ is two holes in a full $2p$ shell. Holes give the same terms as electrons, but the spin-orbit energy of a hole has the opposite sign, so $A < 0$ and the multiplet is inverted: largest $J = L + S = 2$ lies lowest. That is Hund's third rule: $J = |L - S|$ for less than half full, $J = L + S$ for more than half full.`,
      trap: R`Nuclear charge changes the size of the splitting, not its sign.` },
    { id: 'lsj-r4-05', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'Landé interval rule', format: 'statements',
      q: R`For the levels of one LS term with spin-orbit energy $E_J = \tfrac{A}{2}[J(J+1) - L(L+1) - S(S+1)]$, which statements are correct?`,
      options: [R`Plotted against $J(J+1)$, the level energies lie on a straight line of slope $A/2$`,
        R`The average of the level energies, each weighted by $2J + 1$, equals the energy of the term without spin-orbit coupling`,
        R`In an inverted multiplet the level with the largest $J$ lies lowest`,
        R`The interval between levels $J$ and $J - 1$ is proportional to $J - 1$`], answer: [0, 1, 2],
      sol: R`$E_J$ is linear in $J(J+1)$ with slope $A/2$. The weighted sum $\sum(2J+1)E_J$ is zero because the trace of $\vec L\cdot\vec S$ over all states of the term vanishes. Inverted means $A < 0$, so large $J(J+1)$ gives the lowest energy. The interval is $E_J - E_{J-1} = \tfrac{A}{2}[J(J+1) - (J-1)J] = AJ$, proportional to the larger $J$.`,
      trap: R`The Landé rule uses the upper $J$ of the pair: $\Delta E = AJ$.` },
    { id: 'lsj-r4-06', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'jj coupling',
      q: R`In jj coupling, one electron is in $np_{3/2}$ and another in $n'd_{5/2}$ (non-equivalent). The total number of states, counting every allowed $J$ and every $M_J$, is ______.`,
      answer: 24, tol: 0,
      sol: R`$J$ runs from $|\tfrac32 - \tfrac52| = 1$ to $\tfrac32 + \tfrac52 = 4$: $J = 1, 2, 3, 4$ with $3 + 5 + 7 + 9 = 24$ states. Quicker: the two electrons are independent, so $(2j_1 + 1)(2j_2 + 1) = 4\times6 = 24$.`,
      trap: R`Counting only the four levels gives 4; the question asks for states.` },
    { id: 'lsj-r4-07', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'Landé interval rule',
      q: R`The $^3P_{0,1,2}$ levels of carbon lie at $0$, $16.4$ and $43.4$ cm$^{-1}$. The ratio of the upper to the lower interval is $1.65$ instead of the Landé value $2$. The most likely reason is`,
      options: [R`the $^3P$ term of carbon is inverted`,
        R`pure LS coupling is not exact: smaller effects (spin-spin coupling, spin-orbit mixing with $^1D_2$ and $^1S_0$, which share $J$ values) shift the levels`,
        R`carbon is in the jj-coupling limit`,
        R`hyperfine structure of $^{12}$C moves the levels`], answer: 1,
      sol: R`The levels rise with $J$, so the term is normal, not inverted. Carbon is light, so LS coupling is a good start, but the interval rule needs first-order spin-orbit coupling inside one term only. Spin-spin interaction and second-order spin-orbit mixing with other terms of the same configuration and same $J$ distort the ratio by tens of percent. $^{12}$C has nuclear spin 0, so it has no hyperfine structure at all, and in jj coupling the pattern would look nothing like a triplet.`,
      trap: R`A deviation from the interval rule does not mean jj coupling; it signals small departures from pure LS.` },
    { id: 'lsj-r4-08', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'jj coupling',
      q: R`In jj coupling, the configuration $np_{1/2}\,n'p_{3/2}$ (two non-equivalent electrons) gives levels with`,
      options: [R`$J = 1, 2$`, R`$J = 0, 1, 2$`, R`$J = 1$ only`, R`$J = 0, 1, 2, 3$`], answer: 0,
      sol: R`Add $j_1 = \tfrac12$ and $j_2 = \tfrac32$: $J = |j_1 - j_2|, \dots, j_1 + j_2 = 1, 2$. Check by states: $(2)(4) = 8 = 3 + 5$. (For two $p_{1/2}$ electrons you would get $J = 0, 1$; for $p_{3/2}p_{3/2}$ non-equivalent, $J = 0$ to $3$.)`,
      trap: R`$J = 0$ needs $j_1 = j_2$.` },
    { id: 'lsj-r4-09', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'Landé interval rule', unit: 'cm⁻¹',
      q: R`Iron's ground term is the inverted $^5D$ with $^5D_4$ lowest. The $^5D_3$ level lies $416$ cm$^{-1}$ above $^5D_4$. If the Landé interval rule held exactly, $^5D_0$ would lie above $^5D_4$ by ______ cm$^{-1}$.`,
      answer: 1040, tol: 5, calc: () => 416 / 4 * (4 + 3 + 2 + 1),
      sol: R`The interval between $J$ and $J - 1$ is $|A|J$. From $J = 4$ to $3$: $4|A| = 416$, so $|A| = 104$ cm$^{-1}$. Climbing to $J = 0$ adds $|A|(4 + 3 + 2 + 1) = 10|A| = 1040$ cm$^{-1}$. (The measured value is about 978 cm$^{-1}$; the rule is only approximate for iron.)`,
      trap: R`Using equal steps of 416 cm$^{-1}$ gives 1664; the steps shrink as $J$ falls.` },
    { id: 'lsj-r4-10', type: 'msq', level: 5, exams: ['gate', 'net'], sub: 'LS and jj correlation', format: 'statements',
      q: R`Compare the levels of the $np^2$ configuration in pure LS coupling and in pure jj coupling. Which statements are correct?`,
      options: [R`In jj coupling the $(p_{3/2})^2$ pair can have $J = 3$`,
        R`The number of levels with each value of $J$ is the same in both limits`,
        R`The parity of every level is the same in both limits`,
        R`Both limits have exactly two levels with $J = 0$`], answer: [1, 2, 3],
      sol: R`LS: $^3P_{0,1,2}$, $^1D_2$, $^1S_0$, so $J = 0, 0, 1, 2, 2$. jj (equivalent electrons, Pauli): $(\tfrac12,\tfrac12)_0$; $(\tfrac12,\tfrac32)_{1,2}$; $(\tfrac32,\tfrac32)_{0,2}$, again $J = 0, 0, 1, 2, 2$. $J$ is exact in both schemes, so the count per $J$ must agree as the coupling changes smoothly. Parity is $(-1)^{l_1 + l_2}$ of the configuration, the same in both. For two equivalent $p_{3/2}$ electrons only antisymmetric combinations survive: $J = 0, 2$, not $1$ or $3$.`,
      trap: R`For equivalent electrons in the same $j$ subshell, Pauli removes the odd $J$ values ($J = 1, 3$ for $(p_{3/2})^2$).` },
    { id: 'lsj-r4-11', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'non-equivalent electrons',
      q: R`For the configuration $np\,n'd$ in LS coupling, how many fine-structure levels have $J = 2$? ______`,
      answer: 4, tol: 0,
      sol: R`Terms: $S = 0, 1$ with $L = 1, 2, 3$: $^1P$, $^1D$, $^1F$, $^3P$, $^3D$, $^3F$. $J = 2$ occurs in $^1D_2$, $^3P_2$, $^3D_2$, $^3F_2$: four levels. Check in jj coupling: $(p_{1/2}, d_{3/2})$ gives $J = 1, 2$; $(p_{1/2}, d_{5/2})$: $2, 3$; $(p_{3/2}, d_{3/2})$: $0$ to $3$; $(p_{3/2}, d_{5/2})$: $1$ to $4$. Each contains $J = 2$ once: four again.`,
      trap: R`$^1P_1$ and $^1F_3$ have only one $J$ each; neither is 2.` },
    { id: 'lsj-r4-12', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'Hund rules',
      q: R`By Hund's rules, which of these ions has a ground level with $J = 0$?`,
      options: [R`$3d^2$ (e.g. V$^{3+}$)`, R`$2p^4$ (e.g. O)`, R`$4f^6$ (e.g. Eu$^{3+}$)`, R`$3d^8$ (e.g. Ni$^{2+}$)`], answer: 2,
      sol: R`$3d^2$: $S = 1$, $L = 3$, less than half full, $J = L - S = 2$ ($^3F_2$). $2p^4$: $^3P$, more than half full, $J = 2$. $4f^6$: six electrons with parallel spins in $m_l = 3, 2, 1, 0, -1, -2$: $S = 3$, $L = 3$; less than half full (7 is half), so $J = |L - S| = 0$: $^7F_0$. $3d^8$: $^3F$, more than half full, $J = 4$.`,
      trap: R`$J = 0$ needs $L = S$ and a less-than-half-full shell; $4f^6$ is one short of half.` },
  ],
  gens: [
    { id: 'lsj-r4g1', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'terms of non-equivalent electrons', format: 'not',
      make(r) {
        const l1 = int(r, 1, 3), l2 = int(r, 1, 3), n1 = int(r, l1 + 1, 5), n2 = Math.max(n1 + 1, l2 + 1) + int(r, 0, 1);
        const ok = lsTerms(l1, l2);
        const bad = [[1.5, int(r, 0, l1 + l2)], [2, int(r, 0, l1 + l2)], [int(r, 0, 1), l1 + l2 + 1]];
        if (l1 !== l2) bad.push([int(r, 0, 1), Math.abs(l1 - l2) - 1]);
        const wrong = choose(r, bad);
        const o = mcqOptions(r, term(...wrong), shuffle(r, ok).map((t) => term(...t)));
        return { q: R`Which term can NOT arise from the configuration $${n1}${ll[l1]}\,${n2}${ll[l2]}$?`, ...o,
          sol: R`Two electrons give $S = 0$ or $1$ (singlets and triplets only). $L$ runs from $|l_1 - l_2| = ${Math.abs(l1 - l2)}$ to $l_1 + l_2 = ${l1 + l2}$. The electrons are non-equivalent (different $n$), so Pauli removes nothing: the terms are ${ok.map((t) => term(...t)).join(', ')}. ${term(...wrong)} is not among them.`,
          trap: 'Check both the multiplicity (1 or 3 for two electrons) and the range of L.' };
      } },
    { id: 'lsj-r4g2', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'counting levels',
      make(r) {
        const l1 = int(r, 0, 3), l2 = int(r, Math.max(1, l1), 3), n1 = int(r, l1 + 1, 5), n2 = Math.max(n1 + 1, l2 + 1);
        const Jmax = l1 + l2 + 1, J = int(r, 0, Jmax);
        let c = 0; const hits = [];
        for (const [S, L] of lsTerms(l1, l2)) if (J >= Math.abs(L - S) && J <= L + S) { c++; hits.push(`$^{${2 * S + 1}}${LL[L]}_{${J}}$`); }
        return { q: R`In LS coupling, how many fine-structure levels of the configuration $${n1}${ll[l1]}\,${n2}${ll[l2]}$ have $J = ${J}$? ______`,
          answer: c, tol: 0, l1, l2, J,
          sol: R`Terms: $S = 0, 1$ with $L = ${Math.abs(l1 - l2)}$ to $${l1 + l2}$: ${lsTerms(l1, l2).map((t) => term(...t)).join(', ')}. A term gives $J = |L - S|$ to $L + S$. Levels with $J = ${J}$: ${hits.length ? hits.join(', ') : 'none'}, so ${c}. (Counting in jj coupling, pairs $(j_1, j_2)$ with $|j_1 - j_2|\le ${J}\le j_1 + j_2$, gives the same number, since $J$ is exact in both schemes.)`,
          trap: 'A singlet term has only J = L; a triplet with L = 0 has only J = 1.' };
      },
      verify: (p) => jjCount(p.l1, p.l2, p.J) },
    { id: 'lsj-r4g3', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'levels of a term',
      make(r) {
        const S2 = int(r, 0, 5), L = int(r, 0, 5), S = S2 / 2;
        const lo = Math.abs(L - S), hi = L + S;
        const cand = []; for (let J = Math.max(lo - 2, S2 % 2 ? 0.5 : 0); J <= hi + 2; J++) cand.push(J);
        const good = cand.filter((J) => J >= lo && J <= hi), badJ = cand.filter((J) => J < lo || J > hi);
        const k = Math.min(good.length, int(r, 1, 3));
        const pickJ = [...shuffle(r, good).slice(0, k), ...shuffle(r, badJ).slice(0, 4 - k)].sort((a, b) => a - b);
        return { q: R`Which values of $J$ occur among the levels of the term $^{${S2 + 1}}${LL[L]}$?`,
          options: pickJ.map((J) => `$J = ${hf(J)}$`), answer: pickJ.map((J, i) => (J >= lo && J <= hi ? i : -1)).filter((i) => i >= 0),
          sol: R`$^{${S2 + 1}}${LL[L]}$ has $S = ${hf(S)}$ and $L = ${L}$. $J$ runs in whole steps from $|L - S| = ${hf(lo)}$ to $L + S = ${hf(hi)}$: ${good.map((J) => `$${hf(J)}$`).join(', ')}${good.length === 1 ? ' (a single level)' : ''}.`,
          trap: L === 0 || S === 0 ? 'When L = 0 or S = 0 the term has only one level.' : 'The number of levels is the smaller of 2S + 1 and 2L + 1.' };
      } },
  ],
};
