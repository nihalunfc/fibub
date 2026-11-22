// Round 4 extras for quark-model: original questions, written 2026-11-22.
import { choose, mcqOptions, round } from '../_util.js';
const R = String.raw;
const FL = { 3: [['u'], ['d', 's']], 4: [['u', 'c'], ['d', 's']], 5: [['u', 'c'], ['d', 's', 'b']] };
const count = (nf, Q) => { const [U, D] = FL[nf].map((a) => a.length); return Q === 0 ? U * U + D * D : U * D; };
const MULT = [[R`\Lambda^0`, 1], [R`\Sigma^+`, 3], [R`\Xi^0`, 2], [R`\Omega^-`, 1], [R`\Delta^{+}`, 4], [R`K^+`, 2], [R`\pi^0`, 3], [R`\eta`, 1], [R`\rho^-`, 3], [R`\omega`, 1], [R`\phi`, 1],
  [R`\Sigma_c^{++}`, 3], [R`\Xi_c^+`, 2], [R`\Lambda_c^+`, 1], [R`D^+`, 2], [R`D_s^+`, 1], [R`\Sigma^{*-}`, 3], [R`\Xi^{*0}`, 2], [R`K^{*0}`, 2]];

export default {
  items: [
    { id: 'qk-r4-01', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'quark content',
      q: R`The quark content of the $\Sigma^-$ baryon ($S = -1$, charge $-1$) is`,
      options: [R`$dds$`, R`$uus$`, R`$uds$`, R`$dss$`], answer: 0,
      sol: R`Strangeness $-1$ means one $s$ quark. The other two must give a total charge of $-1 - (-\tfrac13) = -\tfrac23$, which is $d + d$ ($-\tfrac13 - \tfrac13$). So $\Sigma^- = dds$. ($uus$ is $\Sigma^+$, $uds$ is $\Sigma^0$ or $\Lambda$, $dss$ is $\Xi^-$.)`,
      trap: R`Forgetting the strange quark's own charge of $-\tfrac13$.` },
    { id: 'qk-r4-02', type: 'nat', level: 2, exams: ['jam', 'gate', 'net'], sub: 'quantum numbers',
      q: R`The $K^0$ meson has quark content $d\bar s$. Its hypercharge $Y = B + S$ is ______.`,
      answer: 1, tol: 0, calc: () => 0 + 1,
      sol: R`A meson has $B = 0$. The anti-strange quark carries $S = +1$ (a strange quark has $S = -1$). So $Y = 0 + 1 = 1$. Check with Gell-Mann-Nishijima: $Q = I_3 + Y/2 = -\tfrac12 + \tfrac12 = 0$.`,
      trap: R`Giving $\bar s$ the strangeness $-1$ of the $s$ quark.` },
    { id: 'qk-r4-03', type: 'mcq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'quark content',
      q: R`Which light meson has strangeness $S = -1$ and zero electric charge?`,
      options: [R`$K^0$`, R`$K^-$`, R`$\eta$`, R`$\bar K^0$`], answer: 3,
      sol: R`$S = -1$ needs an $s$ quark (not an antiquark). Zero charge then needs a $\bar d$ ($-\tfrac13 + \tfrac13 = 0$): $s\bar d = \bar K^0$. $K^0 = d\bar s$ has $S = +1$; $K^- = s\bar u$ has $S = -1$ but charge $-1$; the $\eta$ has $S = 0$.`,
      trap: R`Assuming the $K^0$ has $S = -1$ because "strange particles have negative strangeness".` },
    { id: 'qk-r4-04', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'quark content',
      q: R`Which three-quark combinations give a baryon with electric charge $+2$?`,
      options: [R`$uuu$`, R`$uuc$`, R`$ucc$`, R`$uus$`], answer: [0, 1, 2],
      sol: R`Up-type quarks ($u$, $c$, $t$) have charge $+\tfrac23$, down-type ($d$, $s$, $b$) $-\tfrac13$. Three up-type quarks give $+2$: $uuu$ ($\Delta^{++}$), $uuc$ ($\Sigma_c^{++}$) and $ucc$ ($\Xi_{cc}^{++}$, observed in 2017). $uus$ gives $\tfrac23 + \tfrac23 - \tfrac13 = +1$ ($\Sigma^+$).`,
      trap: R`Thinking charm quarks carry a different charge from up quarks.` },
    { id: 'qk-r4-05', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'hyperfine splitting',
      q: R`In the constituent quark model the vector-pseudoscalar splitting of a $q_1\bar q_2$ meson is proportional to $1/(m_1m_2)$. Using $M_\rho = 775$, $M_\pi = 140$, $M_{K^*} = 892$ and $M_K = 494$ MeV, the ratio $m_s/m_u$ is ______ (two decimal places).`,
      answer: 1.6, tol: 0.02, calc: () => (775 - 140) / (892 - 494),
      sol: R`$M_\rho - M_\pi\propto\dfrac1{m_u^2}$ and $M_{K^*} - M_K\propto\dfrac1{m_um_s}$ (with $m_d = m_u$). Dividing, $\dfrac{M_\rho - M_\pi}{M_{K^*} - M_K} = \dfrac{m_s}{m_u} = \dfrac{635}{398} = 1.60$. This agrees with constituent masses of about $340$ and $520$ MeV.`,
      trap: R`Inverting the ratio: the heavier strange quark makes the kaon splitting SMALLER.` },
    { id: 'qk-r4-06', type: 'mcq', level: 3, exams: ['jam', 'gate', 'net'], sub: 'quark content',
      q: R`No meson with electric charge $+2$ has ever been seen. In the quark model the reason is that`,
      options: [R`colour confinement forbids charged mesons`, R`the Pauli principle forbids two up quarks in a meson`, R`such mesons would be too heavy to produce`, R`a quark-antiquark pair can only have charge $-1$, $0$ or $+1$`], answer: 3,
      sol: R`A meson is $q\bar q'$. The quark has charge $+\tfrac23$ or $-\tfrac13$, the antiquark $-\tfrac23$ or $+\tfrac13$. The largest sum is $\tfrac23 + \tfrac13 = +1$ (as in $\pi^+ = u\bar d$), the smallest $-1$. A charge-2 hadron needs three quarks (or more).`,
      trap: R`Invoking Pauli: a meson holds a quark and an antiquark, which are not identical particles.` },
    { id: 'qk-r4-07', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'meson multiplets',
      q: R`With four quark flavours ($u, d, s, c$), how many distinct quark-antiquark flavour combinations $q\bar q'$ have electric charge $+1$?`,
      answer: 4, tol: 0, calc: () => 2 * 2,
      sol: R`Charge $+1 = \tfrac23 + \tfrac13$ needs an up-type quark ($u$ or $c$) with a down-type antiquark ($\bar d$ or $\bar s$): $2\times2 = 4$ combinations, namely $u\bar d$ ($\pi^+$, $\rho^+$), $u\bar s$ ($K^+$), $c\bar d$ ($D^+$) and $c\bar s$ ($D_s^+$).`,
      trap: R`Counting $c\bar u$ or $u\bar c$, which have charge $0$.` },
    { id: 'qk-r4-08', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'baryon wavefunctions',
      q: R`The proton ($uud$) has spin $\tfrac12$, but there is no ground-state ($L = 0$) baryon made of $uuu$ with spin $\tfrac12$. The quark-model reason is that`,
      options: [R`the colour wavefunction is antisymmetric, so spin times flavour must be symmetric; $uuu$ is flavour-symmetric, which forces the spin state to be symmetric, i.e. $S = \tfrac32$`, R`three identical quarks cannot share the same position`, R`such a baryon would have charge $+2$, which is forbidden`, R`three up quarks always bind into the $\Delta^+$`], answer: 0,
      sol: R`For three quarks in $L = 0$ the space part is symmetric, and colour (a singlet) is totally antisymmetric. Overall antisymmetry then requires the spin-flavour part to be totally symmetric. For $uuu$ the flavour part is automatically symmetric, so the spin part must be symmetric too: only $S = \tfrac32$ (the $\Delta^{++}$). For $uud$ a mixed-symmetry flavour state can combine with mixed-symmetry spin $\tfrac12$ into a symmetric product: the proton.`,
      trap: R`Forgetting colour, which would wrongly forbid the $\Delta^{++}$ instead.` },
    { id: 'qk-r4-09', type: 'msq', level: 4, exams: ['jam', 'gate', 'net'], sub: 'isospin multiplets',
      q: R`Which of these particles belong to the same isospin multiplet as the $\Sigma^0$?`,
      options: [R`$\Sigma^+$`, R`$\Lambda^0$`, R`$\Sigma^-$`, R`$\Sigma^{*0}(1385)$`], answer: [0, 2],
      sol: R`The $\Sigma$ triplet ($I = 1$: $\Sigma^+ = uus$, $\Sigma^0 = uds$, $\Sigma^- = dds$) shares spin $\tfrac12$, strangeness $-1$ and nearly the same mass ($1189$ to $1197$ MeV). The $\Lambda$ has the same quarks as $\Sigma^0$ but $I = 0$ (its $ud$ pair is in an isospin singlet). The $\Sigma^{*0}$ has spin $\tfrac32$ and belongs to the decuplet.`,
      trap: R`Grouping particles by quark content alone: $\Lambda$, $\Sigma^0$ and $\Sigma^{*0}$ are all $uds$.` },
    { id: 'qk-r4-10', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'SU(3)',
      q: R`In flavour SU(3), the product of two octets decomposes as`,
      options: [R`$8\otimes8 = 1\oplus8\oplus8\oplus10\oplus\overline{10}\oplus27$`, R`$8\otimes8 = 1\oplus8\oplus27\oplus28$`, R`$8\otimes8 = 1\oplus8\oplus10\oplus\overline{10}\oplus35$`, R`$8\otimes8 = 1\oplus63$`], answer: 0,
      sol: R`All options add up to $64$, so counting alone cannot decide. Using Young diagrams (or weights), $8\otimes8$ contains the singlet, two octets (one symmetric, one antisymmetric), the decuplet and antidecuplet (antisymmetric part) and the $27$ (symmetric). Check: symmetric part $1 + 8 + 27 = 36 = \tfrac{8\times9}2$; antisymmetric part $8 + 10 + \overline{10} = 28 = \tfrac{8\times7}2$. SU(3) does have $28$- and $35$-dimensional representations, but they do not occur in $8\otimes8$. This product governs meson-baryon scattering.`,
      trap: R`Trusting dimension counting alone; every option sums to 64.` },
  ],
  gens: [
    { id: 'qk-r4g1', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'meson multiplets',
      make(r) {
        const nf = choose(r, [3, 4, 5]), Q = choose(r, [-1, 0, 1]), ans = count(nf, Q), [U, D] = FL[nf];
        const fl = [...U, ...D].slice().sort((a, b) => 'udscb'.indexOf(a) - 'udscb'.indexOf(b)).join(', ');
        return { q: R`With the ${nf} quark flavours ${fl}, how many distinct quark-antiquark flavour combinations $q\bar q'$ (counting $q\bar q$ pairs of the same flavour too) have electric charge $${Q}$?`,
          answer: ans, tol: 0, nf, Q,
          sol: R`Up-type quarks (${U.join(', ')}) have charge $+\tfrac23$, down-type (${D.join(', ')}) $-\tfrac13$. ${Q === 0 ? R`Charge $0$ needs a quark and an antiquark of the same type: up with anti-up ($${U.length}^2$) or down with anti-down ($${D.length}^2$), total $${ans}$.` : Q > 0 ? R`Charge $+1$ needs an up-type quark with a down-type antiquark: $${U.length}\times${D.length} = ${ans}$.` : R`Charge $-1$ needs a down-type quark with an up-type antiquark: $${D.length}\times${U.length} = ${ans}$.`}`,
          trap: R`Mixing up the antiquark charges: $\bar d$ has $+\tfrac13$, $\bar u$ has $-\tfrac23$.` };
      },
      verify: (p) => count(p.nf, p.Q) },
    { id: 'qk-r4g2', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'hyperfine splitting',
      make(r) {
        const dud = choose(r, [600, 615, 625, 635, 645]), rat = choose(r, [1.4, 1.5, 1.55, 1.6, 1.7]), MK = 494, ans = MK + dud / rat;
        return { q: R`In a quark model the vector-pseudoscalar splitting of $q_1\bar q_2$ scales as $1/(m_1m_2)$. If $M_\rho - M_\pi = ${dud}$ MeV, $m_s/m_u = ${rat}$ and $M_K = ${MK}$ MeV, the predicted $K^*$ mass is ______ MeV (nearest whole number).`,
          answer: Math.round(ans), tol: 1, dud, rat,
          sol: R`$M_{K^*} - M_K = (M_\rho - M_\pi)\dfrac{m_u}{m_s} = \dfrac{${dud}}{${rat}} = ${round(dud / rat, 1)}$ MeV, so $M_{K^*} = ${MK} + ${round(dud / rat, 1)} = ${Math.round(ans)}$ MeV.`,
          trap: R`Multiplying by $m_s/m_u$ instead of dividing.` };
      },
      verify: (p) => 494 + p.dud / p.rat },
    { id: 'qk-r4g3', type: 'mcq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'isospin multiplets',
      make(r) {
        const [p, n] = choose(r, MULT);
        const o = mcqOptions(r, n, [1, 2, 3, 4].filter((x) => x !== n), (v) => `$${v}$`);
        return { q: R`How many charge states are there in the isospin multiplet that contains the $${p}$?`, ...o, n,
          sol: R`A multiplet with isospin $I$ has $2I + 1$ members. The $${p}$ has $I = ${(n - 1) / 2 === 0.5 ? '\\tfrac12' : (n - 1) / 2 === 1.5 ? '\\tfrac32' : (n - 1) / 2}$, so the multiplet has ${n} member${n > 1 ? 's' : ''}. Isospin counts only the $u$ and $d$ quarks (and antiquarks): $s$, $c$ and the isospin-zero combinations do not add to it.`,
          trap: R`Counting all particles with the same quark content regardless of spin, or giving every strange particle $I = 0$.` };
      } },
  ],
};
