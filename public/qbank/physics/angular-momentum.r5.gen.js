// Round 5 extras for angular-momentum: original questions, written 2026-11-22.
import { int, choose, round } from '../_util.js';
const R = String.raw;

// Weight of l = 2 in cos^2(theta) + beta.
const pL2 = (beta) => (4 / 45) / ((1 / 3 + beta) ** 2 + 4 / 45);

export default {
  items: [
    { id: 'qam-r5-01', type: 'nat', level: 1, exams: ['jam', 'gate', 'net'], sub: 'quantum numbers',
      q: R`Counting every allowed pair $(l, m)$ with $l = 0, 1, 2, 3$, the total number of independent orbital angular-momentum states is ______.`,
      answer: 16, tol: 0, calc: () => [0, 1, 2, 3].reduce((s, l) => s + 2 * l + 1, 0),
      sol: R`Each $l$ has $2l + 1$ values of $m$: $1 + 3 + 5 + 7 = 16$. In general $\sum_{l=0}^{n-1}(2l + 1) = n^2$, the familiar $n^2$ degeneracy of a hydrogen level (before spin).`,
      trap: R`Counting only the values of $l$ (four), or using $2l$ states per $l$.` },
    { id: 'qam-r5-02', type: 'mcq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'commutators',
      q: R`The commutator $[\hat L_z, \hat p_x]$ equals`,
      options: [R`$0$`, R`$i\hbar\,\hat p_y$`, R`$-i\hbar\,\hat p_y$`, R`$i\hbar\,\hat p_z$`], answer: 1,
      sol: R`$\hat L_z = \hat x\hat p_y - \hat y\hat p_x$. Only $\hat x$ fails to commute with $\hat p_x$: $[\hat L_z, \hat p_x] = [\hat x, \hat p_x]\hat p_y = i\hbar\hat p_y$. This is one case of $[L_i, p_j] = i\hbar\epsilon_{ijk}p_k$: momentum is a vector operator, rotated by $\vec L$ like $\vec r$ is.`,
      trap: R`Taking $[\hat p_x, \hat x] = -i\hbar$ instead of $[\hat x, \hat p_x] = +i\hbar$ gives the wrong sign.` },
    { id: 'qam-r5-03', type: 'nat', level: 3, exams: ['jam', 'gate', 'net'], sub: 'expectation values',
      q: R`A particle is in $\dfrac{1}{\sqrt2}\left(|2, 2\rangle + |2, 1\rangle\right)$ (states $|l, m\rangle$). The expectation value $\langle L_x\rangle = k\hbar$ with $k =$ ______.`,
      answer: 1, tol: 0.01,
      sol: R`$L_x = \tfrac12(L_+ + L_-)$, so $\langle L_x\rangle = \mathrm{Re}\langle L_+\rangle$. $L_+|2, 1\rangle = \hbar\sqrt{l(l + 1) - m(m + 1)}|2, 2\rangle = \hbar\sqrt{6 - 2}|2, 2\rangle = 2\hbar|2, 2\rangle$, and $L_+|2, 2\rangle = 0$. So $\langle L_+\rangle = \tfrac{1}{\sqrt2}\cdot\tfrac{1}{\sqrt2}\cdot2\hbar = \hbar$, real, and $\langle L_x\rangle = \hbar$: $k = 1$.`,
      trap: R`Using $\sqrt{l(l + 1) - m(m - 1)}$ (the lowering coefficient) for a raising step gives $\sqrt6/2$.` },
    { id: 'qam-r5-04', type: 'mcq', level: 3, exams: ['jam', 'gate', 'net'], sub: 'spherical harmonics',
      q: R`About the probability density $|Y_{lm}(\theta, \phi)|^2$ of a spherical harmonic, which statement is NOT correct?`,
      options: [R`It is unchanged by rotations about the $z$-axis`, R`It is the same for $m$ and $-m$`, R`Summed over $m = -l, \dots, l$ it gives $(2l + 1)/4\pi$`, R`For $m \ne 0$ it varies with $\phi$ like $\cos^2(m\phi)$`], answer: 3,
      sol: R`$Y_{lm} \propto P_l^m(\cos\theta)e^{im\phi}$, and $|e^{im\phi}|^2 = 1$, so the density depends on $\theta$ only: it is symmetric about the $z$-axis, and the last statement is false (that would be a real combination like $Y_{lm} + Y_{l,-m}$). $|P_l^{-m}| \propto |P_l^m|$ gives the same density for $\pm m$. Unsöld's theorem: $\sum_m|Y_{lm}|^2 = (2l + 1)/4\pi$, a constant, which is why a filled subshell is spherical.`,
      trap: R`Picturing the familiar lobes of $p_x$ or $d_{xy}$ orbitals; those are real combinations, not single $Y_{lm}$.` },
    { id: 'qam-r5-05', type: 'msq', level: 3, exams: ['jam', 'gate', 'net'], sub: 'expectation values',
      q: R`A particle is in a simultaneous eigenstate $|l, m\rangle$ of $L^2$ and $L_z$. Which statements are correct?`,
      options: [R`$\langle L_x\rangle = \langle L_y\rangle = 0$`, R`$\langle L_x^2\rangle = \langle L_y^2\rangle$`, R`$\langle L_xL_y + L_yL_x\rangle = 0$`, R`$\langle L_x^2\rangle = 0$ when $m = l \ge 1$`], answer: [0, 1, 2],
      sol: R`$L_x$ and $L_y$ are combinations of $L_\pm$, which change $m$, so their diagonal elements vanish. $L_x^2 + L_y^2 = L^2 - L_z^2$, and a rotation by $90^\circ$ about $z$ (which leaves $|l, m\rangle$ unchanged up to phase) turns $L_x$ into $L_y$; so each has $\langle L_x^2\rangle = \langle L_y^2\rangle = \tfrac12\hbar^2[l(l + 1) - m^2]$. $L_xL_y + L_yL_x = \tfrac{1}{2i}(L_+^2 - L_-^2)$ changes $m$ by 2, so its mean is zero. For $m = l$: $\langle L_x^2\rangle = \tfrac12\hbar^2l > 0$.`,
      trap: R`Thinking that $m = l$ means $\vec L$ points exactly along $z$; there is always a leftover $\hbar^2l$ in $L_x^2 + L_y^2$.` },
    { id: 'qam-r5-06', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'expansion in Y_lm',
      q: R`A particle has wavefunction $\psi \propto z^2f(r)$, where $f$ depends only on $r$. The expectation value $\langle L^2\rangle = k\hbar^2$ with $k =$ ______ (three decimal places).`,
      answer: 2.667, tol: 0.005, calc: () => 6 * pL2(0),
      sol: R`The angular part is $\cos^2\theta = \tfrac13 + \tfrac23P_2(\cos\theta)$. With $Y_{00} = 1/\sqrt{4\pi}$ and $Y_{20} = \sqrt{5/4\pi}\,P_2$: $\cos^2\theta = \tfrac13\sqrt{4\pi}\,Y_{00} + \tfrac23\sqrt{4\pi/5}\,Y_{20}$. The weights are proportional to the squares, $\tfrac19 : \tfrac{4}{45} = 5 : 4$, so $P(l = 0) = 5/9$ and $P(l = 2) = 4/9$. Then $\langle L^2\rangle = \tfrac49\cdot6\hbar^2 = \tfrac83\hbar^2 = 2.667\hbar^2$.`,
      trap: R`Reading $z^2$ as pure $l = 2$ (giving $6\hbar^2$); $z^2$ contains a spherical part $r^2/3$.` },
    { id: 'qam-r5-07', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'matrix representation',
      q: R`In the three-dimensional $l = 1$ subspace, which operator identities hold?`,
      options: [R`$L_z^3 = \hbar^2L_z$`, R`$L_+^3 = 0$`, R`$L_+^2 = 0$`, R`$L_x^2 + L_y^2 + L_z^2 = 2\hbar^2$ times the identity`], answer: [0, 1, 3],
      sol: R`$L_z$ has eigenvalues $\hbar, 0, -\hbar$, each a root of $\lambda(\lambda^2 - \hbar^2) = 0$, so $L_z^3 - \hbar^2L_z = 0$ on the subspace. $L_+$ raises $m$ by one; $L_+^2|1, -1\rangle = L_+(\sqrt2\hbar|1, 0\rangle) = 2\hbar^2|1, 1\rangle \ne 0$, so $L_+^2 \ne 0$, but three raisings always leave the ladder: $L_+^3 = 0$. $L^2 = l(l + 1)\hbar^2 = 2\hbar^2$ on every state.`,
      trap: R`Thinking $L_+^2 = 0$ because "spin-1/2 has $S_+^2 = 0$"; the ladder for $l = 1$ has three rungs.` },
    { id: 'qam-r5-08', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'addition of angular momentum',
      q: R`Two particles, each with $l = 1$, are in the product state $|1, 1\rangle_1|1, -1\rangle_2$. For the total $\vec L = \vec L_1 + \vec L_2$, $\langle L^2\rangle = k\hbar^2$ with $k =$ ______.`,
      answer: 2, tol: 0, calc: () => 2 + 2 + 2 * (1 * -1),
      sol: R`$L^2 = L_1^2 + L_2^2 + 2L_{1z}L_{2z} + L_{1+}L_{2-} + L_{1-}L_{2+}$. The first two give $2\hbar^2$ each. $2L_{1z}L_{2z}$ gives $2(1)(-1)\hbar^2 = -2\hbar^2$. $L_{1+}$ kills $|1, 1\rangle_1$, and $L_{1-}L_{2+}$ makes $|1, 0\rangle|1, 0\rangle$, orthogonal to the original state, so the cross terms average to zero. Total: $2 + 2 - 2 = 2$. Check with Clebsch-Gordan weights $1/6, 1/2, 1/3$ for $L = 2, 1, 0$: $\tfrac16\cdot6 + \tfrac12\cdot2 + 0 = 2$.`,
      trap: R`Adding $m_1 + m_2 = 0$ and concluding $L = 0$, so $\langle L^2\rangle = 0$; $M = 0$ is shared by $L = 0, 1, 2$.` },
    { id: 'qam-r5-09', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'ladder operators',
      q: R`In position space $L_+ = \hbar e^{i\phi}\left(\dfrac{\partial}{\partial\theta} + i\cot\theta\dfrac{\partial}{\partial\phi}\right)$. Acting on $\sin\theta\,e^{-i\phi}$, it gives`,
      options: [R`$2\hbar\cos\theta$`, R`$\hbar\cos\theta$`, R`$2\hbar\sin\theta\,e^{i\phi}$`, R`$0$`], answer: 0,
      sol: R`$\partial_\theta(\sin\theta e^{-i\phi}) = \cos\theta e^{-i\phi}$ and $i\cot\theta\,\partial_\phi(\sin\theta e^{-i\phi}) = i\cot\theta(-i)\sin\theta e^{-i\phi} = \cos\theta e^{-i\phi}$. Sum times $\hbar e^{i\phi}$: $2\hbar\cos\theta$. Check: $\sin\theta e^{-i\phi} \propto Y_{1,-1}$ and $\cos\theta \propto Y_{10}$; with the normalisations $\sqrt{3/8\pi}$ and $\sqrt{3/4\pi}$ this is $L_+Y_{1,-1} = \sqrt2\hbar Y_{10}$, as the ladder formula requires.`,
      trap: R`Dropping the $\cot\theta\,\partial_\phi$ term, which halves the answer.` },
    { id: 'qam-r5-10', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'spherical harmonics',
      q: R`An atom has one electron in each of the five $l = 2$ states $m = -2, \dots, 2$ (same radial function, spins ignored). The total probability density of these electrons`,
      options: [R`is largest along the $z$-axis`, R`is largest in the $xy$-plane`, R`is spherically symmetric`, R`has four lobes in the $xy$-plane`], answer: 2,
      sol: R`The angular density is $\sum_{m=-2}^{2}|Y_{2m}|^2$. By Unsöld's theorem $\sum_m|Y_{lm}(\theta, \phi)|^2 = \dfrac{2l + 1}{4\pi} = \dfrac{5}{4\pi}$, independent of direction. A filled (or half-filled with one electron per $m$) subshell is spherical, which is why closed-shell atoms and ions like Ne or Mn$^{2+}$ behave as spherical.`,
      trap: R`Adding the familiar lobe pictures of the five $d$ orbitals by eye; their sum is round.` },
  ],
  gens: [
    { id: 'qam-r5g1', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'expectation values',
      make(r) {
        const l = int(r, 1, 5), m = int(r, -l, l - 1);
        const [w, wt] = choose(r, [[0.5, R`\tfrac12`], [0.25, R`\tfrac14`], [0.75, R`\tfrac34`], [0.2, R`\tfrac15`], [0.8, R`\tfrac45`]]);
        const c = Math.sqrt(l * (l + 1) - m * (m + 1)), k = Math.sqrt(w * (1 - w)) * c;
        return { q: R`A particle is in $\sqrt{a}\,|${l}, ${m}\rangle + \sqrt{1 - a}\,|${l}, ${m + 1}\rangle$ (states $|l, m\rangle$) with $a = ${wt}$. Then $\langle L_x\rangle = k\hbar$ with $k =$ ______ (three decimal places).`,
          answer: round(k, 3), tol: Math.max(0.002, round(k * 0.005, 3)), l, m, w,
          sol: R`$\langle L_x\rangle = \mathrm{Re}\langle L_+\rangle$. $L_+|${l}, ${m}\rangle = \hbar\sqrt{l(l + 1) - m(m + 1)}\,|${l}, ${m + 1}\rangle = \hbar\sqrt{${l * (l + 1) - m * (m + 1)}}\,|${l}, ${m + 1}\rangle$. So $\langle L_+\rangle = \sqrt{a(1 - a)}\,\sqrt{${l * (l + 1) - m * (m + 1)}}\,\hbar = ${round(k, 3)}\hbar$, which is real, so $k = ${round(k, 3)}$.`,
          trap: R`Using the lowering coefficient $\sqrt{l(l + 1) - m(m - 1)}$ for the raising step.` };
      },
      verify: (p) => Math.sqrt(p.w * (1 - p.w)) * Math.sqrt(p.l * (p.l + 1) - p.m * (p.m + 1)) },
    { id: 'qam-r5g2', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'addition of angular momentum',
      make(r) {
        const l1 = int(r, 1, 3), l2 = int(r, 1, 3), m1 = int(r, -l1, l1), m2 = int(r, -l2, l2);
        const k = l1 * (l1 + 1) + l2 * (l2 + 1) + 2 * m1 * m2;
        return { q: R`Two particles are in the product state $|l_1 = ${l1}, m_1 = ${m1}\rangle|l_2 = ${l2}, m_2 = ${m2}\rangle$. For the total angular momentum $\vec L = \vec L_1 + \vec L_2$, $\langle L^2\rangle = k\hbar^2$ with $k =$ ______.`,
          answer: k, tol: 0, l1, l2, m1, m2,
          sol: R`$L^2 = L_1^2 + L_2^2 + 2L_{1z}L_{2z} + L_{1+}L_{2-} + L_{1-}L_{2+}$. The ladder terms change $m_1$ and $m_2$, so they average to zero in a product state. The rest gives $${l1 * (l1 + 1)} + ${l2 * (l2 + 1)} + 2(${m1})(${m2}) = ${k}$.`,
          trap: R`Taking $L = |m_1 + m_2|$ as if the product state had a definite total $L$.` };
      },
      verify: (p) => p.l1 * (p.l1 + 1) + p.l2 * (p.l2 + 1) + 2 * p.m1 * p.m2 },
    { id: 'qam-r5g3', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'expansion in Y_lm',
      make(r) {
        const [b, bt] = choose(r, [[1, '+ r^2'], [-1, '- r^2'], [0.5, R`+ \tfrac12r^2`], [-0.5, R`- \tfrac12r^2`], [2, '+ 2r^2'], [-2 / 3, R`- \tfrac23r^2`]]);
        const P = pL2(b), k = 6 * P, sb = (b < 0 ? '- ' : '+ ') + round(Math.abs(b), 4);
        return { q: R`A particle has $\psi \propto (z^2 ${bt})f(r)$, with $f$ depending only on $r$. The expectation value $\langle L^2\rangle = k\hbar^2$ with $k =$ ______ (three decimal places).`,
          answer: round(k, 3), tol: Math.max(0.003, round(k * 0.005, 3)), b,
          sol: R`Divide by $r^2$: the angular part is $\cos^2\theta ${sb} = \left(\tfrac13 ${sb}\right) + \tfrac23P_2(\cos\theta)$. In normalised harmonics the $l = 0$ and $l = 2$ weights are proportional to $\left(\tfrac13 ${sb}\right)^2\cdot4\pi$ and $\tfrac{4}{45}\cdot4\pi$, so $P(l = 2) = ${round(P, 4)}$. Then $\langle L^2\rangle = 6\hbar^2P(l = 2) = ${round(k, 3)}\hbar^2$.`,
          trap: R`Forgetting that $z^2$ itself contains an $l = 0$ part $r^2/3$.` };
      },
      verify: (p) => 6 * pL2(p.b) },
  ],
};
