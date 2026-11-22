// Round 5 extras for spin-addition: original questions, written 2026-11-22.
import { int, choose, round } from '../_util.js';
const R = String.raw;

const hf = (x) => (Number.isInteger(x) ? String(x) : `${x < 0 ? '-' : ''}${Math.round(2 * Math.abs(x))}/2`);
const ms = (s) => { const a = []; for (let m = -s; m <= s + 1e-9; m++) a.push(m); return a; };

export default {
  items: [
    { id: 'qsa-r5-01', type: 'nat', level: 1, exams: ['jam', 'gate', 'net'], sub: 'addition rules',
      q: R`An $f$ electron ($l = 3$) combines its orbital angular momentum with its spin. The number of states in the $j = \tfrac72$ level is ______.`,
      answer: 8, tol: 0, calc: () => 2 * 3.5 + 1,
      sol: R`A level of total angular momentum $j$ has $2j + 1$ states ($m_j = -j, \dots, j$): $2\times\tfrac72 + 1 = 8$. With the $j = \tfrac52$ level (6 states) this makes $14 = 7\times2$, all the $f$ spin-orbitals.`,
      trap: R`$2l + 1 = 7$ counts orbital states only.` },
    { id: 'qsa-r5-02', type: 'mcq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'ladder operators',
      q: R`For angular momentum $j = 2$, the raising operator acting on $|2, 0\rangle$ gives $J_+|2, 0\rangle = c\,\hbar|2, 1\rangle$ with $c$ equal to`,
      options: [R`$\sqrt2$`, R`$2$`, R`$\sqrt6$`, R`$\sqrt3$`], answer: 2,
      sol: R`$J_+|j, m\rangle = \hbar\sqrt{j(j + 1) - m(m + 1)}\,|j, m + 1\rangle = \hbar\sqrt{6 - 0}\,|2, 1\rangle$. So $c = \sqrt6$. Raising from the middle of a multiplet gives the largest coefficient.`,
      trap: R`Using $m(m - 1)$ (the lowering formula) still gives $\sqrt6$ here, but would fail for $m\ne0$; know which sign goes with which operator.` },
    { id: 'qsa-r5-03', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'spin matrices',
      q: R`For a spin $s = \tfrac32$, the trace of the matrix $S_x^2$ (in units of $\hbar^2$) is ______.`,
      answer: 5, tol: 0, calc: () => 1.5 * 2.5 * 4 / 3,
      sol: R`By symmetry $\text{Tr}\,S_x^2 = \text{Tr}\,S_y^2 = \text{Tr}\,S_z^2$, and their sum is $\text{Tr}\,S^2 = s(s + 1)\hbar^2(2s + 1) = \tfrac{15}{4}\times4\,\hbar^2 = 15\hbar^2$. So $\text{Tr}\,S_x^2 = 5\hbar^2$. Check with $S_z$: $\sum m^2 = \tfrac94 + \tfrac14 + \tfrac14 + \tfrac94 = 5$.`,
      trap: R`A trace is basis independent, so you never need the explicit $S_x$ matrix.` },
    { id: 'qsa-r5-04', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'spin-1 states',
      q: R`A spin-1 particle is in the eigenstate of $S_x$ with eigenvalue $+\hbar$. A measurement of $S_z$ gives $+\hbar$ with probability ______ (two decimal places).`,
      answer: 0.25, tol: 0.005, calc: () => 0.25,
      sol: R`In the $S_z$ basis $S_x = \dfrac{\hbar}{\sqrt2}\begin{pmatrix}0&1&0\\1&0&1\\0&1&0\end{pmatrix}$. Its $+\hbar$ eigenvector is $\tfrac12(1, \sqrt2, 1)^T$ (check: $S_x$ gives $\tfrac{\hbar}{\sqrt2}\cdot\tfrac12(\sqrt2, 2, \sqrt2) = \hbar\cdot\tfrac12(1, \sqrt2, 1)$). Probability of $m = +1$: $(1/2)^2 = 0.25$; $m = 0$: $0.5$; $m = -1$: $0.25$.`,
      trap: R`For spin $\tfrac12$ the answer would be $\tfrac12$; spin 1 has three outcomes with weights $\tfrac14, \tfrac12, \tfrac14$.` },
    { id: 'qsa-r5-05', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'expectation values',
      q: R`Two spin-1 particles are in the product state $|m_1 = +1\rangle|m_2 = -1\rangle$. The expectation value of the total $\vec S^2$, in units of $\hbar^2$, is ______.`,
      answer: 2, tol: 0.001, calc: () => 2 + 2 + 2 * 1 * -1,
      sol: R`$\vec S^2 = \vec S_1^2 + \vec S_2^2 + 2S_{1z}S_{2z} + S_{1+}S_{2-} + S_{1-}S_{2+}$. In a product of $S_z$ eigenstates the last two terms change $m_1, m_2$ and have zero expectation. So $\langle\vec S^2\rangle = 2 + 2 + 2(1)(-1) = 2$. Check by Clebsch-Gordan: the state is $\tfrac{1}{\sqrt6}|2,0\rangle + \tfrac{1}{\sqrt2}|1,0\rangle + \tfrac{1}{\sqrt3}|0,0\rangle$, giving $\tfrac16\cdot6 + \tfrac12\cdot2 + \tfrac13\cdot0 = 2$.`,
      trap: R`The product state is not an eigenstate of $\vec S^2$; 2 is an average of 6, 2 and 0.` },
    { id: 'qsa-r5-06', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Pauli matrices',
      q: R`With $\vec a = (1, 2, 0)$ and $\vec b = (3, -1, 2)$, the trace $\text{Tr}\left[(\vec\sigma\cdot\vec a)(\vec\sigma\cdot\vec b)\right]$ is ______.`,
      answer: 2, tol: 0.001, calc: () => 2 * (3 - 2 + 0),
      sol: R`$(\vec\sigma\cdot\vec a)(\vec\sigma\cdot\vec b) = (\vec a\cdot\vec b)\mathbb 1 + i\vec\sigma\cdot(\vec a\times\vec b)$. The Pauli matrices are traceless and $\text{Tr}\,\mathbb 1 = 2$, so the trace is $2\,\vec a\cdot\vec b = 2(3 - 2 + 0) = 2$.`,
      trap: R`The cross-product term is not zero, but it is traceless.` },
    { id: 'qsa-r5-07', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'spin Hamiltonians',
      q: R`A spin $\tfrac32$ and a spin $\tfrac12$ interact through $H = A\,\vec S_1\cdot\vec S_2$ ($A > 0$). The energy gap between the two levels is $k\,A\hbar^2$ with $k = $ ______.`,
      answer: 2, tol: 0.001, calc: () => 0.5 * (2 * 3 - 1 * 2),
      sol: R`$\vec S_1\cdot\vec S_2 = \tfrac12[S(S + 1) - S_1(S_1 + 1) - S_2(S_2 + 1)]\hbar^2$ with $S = 1$ or $2$. The constant terms cancel in the gap: $\tfrac12(6 - 2) = 2$. So $E(S = 2) - E(S = 1) = 2A\hbar^2$ ($S = 2$ at $+\tfrac34A\hbar^2$, $S = 1$ at $-\tfrac54A\hbar^2$).`,
      trap: R`The gap is $A$ times the larger total spin (the interval rule), not $A$ times $S_1$.` },
    { id: 'qsa-r5-08', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'spin matrices', format: 'statements',
      q: R`For spin-1 operators (in units with $\hbar = 1$), which statements are correct?`,
      options: [R`$S_z^3 = S_z$`, R`$S_x^2 + S_y^2 + S_z^2 = 2\,\mathbb 1$`, R`$S_x^2$ has eigenvalues $0$ and $1$ only`, R`$S_xS_y + S_yS_x = 0$`], answer: [0, 1, 2],
      sol: R`$S_z$ has eigenvalues $1, 0, -1$, each satisfying $m^3 = m$, so $S_z^3 = S_z$; the same holds for $S_x$, whose square therefore has eigenvalues $m^2\in\{0, 1\}$. $S^2 = s(s + 1) = 2$. The anticommutator $\{S_x, S_y\}$ vanishes only for spin $\tfrac12$ (Pauli matrices); for spin 1, e.g. $\langle1|\{S_x, S_y\}|-1\rangle = -i\ne0$.`,
      trap: R`Pauli-matrix identities like anticommutation do not carry over to higher spins.` },
    { id: 'qsa-r5-09', type: 'mcq', level: 3, exams: ['jam', 'gate', 'net'], sub: 'singlet and triplet', format: 'not',
      q: R`For two spin-$\tfrac12$ particles, which statement is NOT correct?`,
      options: [R`$|{\uparrow\downarrow}\rangle$ is an eigenstate of the total $\vec S^2$`, R`The three triplet states are symmetric under exchange of the two spins`,
        R`The singlet is antisymmetric under exchange`, R`$|{\uparrow\uparrow}\rangle$ is an eigenstate of $\vec S^2$ with $S = 1$`], answer: 0,
      sol: R`$|{\uparrow\downarrow}\rangle = \tfrac{1}{\sqrt2}(|1,0\rangle + |0,0\rangle)$ mixes $S = 1$ and $S = 0$, so it is not an eigenstate of $\vec S^2$ (it is an eigenstate of $S_z$ with $M = 0$). Triplets $|{\uparrow\uparrow}\rangle$, $\tfrac{1}{\sqrt2}(|{\uparrow\downarrow}\rangle + |{\downarrow\uparrow}\rangle)$, $|{\downarrow\downarrow}\rangle$ are symmetric; the singlet $\tfrac{1}{\sqrt2}(|{\uparrow\downarrow}\rangle - |{\downarrow\uparrow}\rangle)$ is antisymmetric.`,
      trap: R`Having a definite total $M$ does not mean having a definite total $S$.` },
    { id: 'qsa-r5-10', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'spin Hamiltonians',
      q: R`Two spin-$\tfrac12$ nuclei with the SAME gyromagnetic ratio and chemical environment have $H = \omega(S_{1z} + S_{2z}) + J\,\vec S_1\cdot\vec S_2$ (with $\hbar = 1$). Their magnetic resonance spectrum (transitions driven by a field coupling to $S_{1x} + S_{2x}$) shows`,
      options: [R`two lines at $\omega\pm J/2$`, R`a single line at $\omega$: the coupling $J$ cannot be seen`, R`four lines`, R`a line at $\omega$ and another at $\omega + J$`], answer: 1,
      sol: R`$H$ is a function of $\vec S^2$ and $S_z$ only: triplet $E = \omega M + J/4$, singlet $E = -3J/4$. The drive $S_{1x} + S_{2x} = S_x$ commutes with $\vec S^2$, so it connects only states within the triplet ($M\to M\pm1$), all at frequency $\omega$; $J$ shifts the whole triplet equally. This is why equivalent nuclei (like the protons in CH$_4$) show no splitting from their mutual coupling.`,
      trap: R`$J$ is real but invisible: total-spin symmetry forbids singlet-triplet transitions.` },
  ],
  gens: [
    { id: 'qsa-r5g1', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'spin matrices',
      make(r) {
        const s = int(r, 1, 8) / 2, which = choose(r, ['S_x^2', 'S_y^2', 'S_z^2', 'S_x^2 + S_y^2']);
        const one = s * (s + 1) * (2 * s + 1) / 3, ans = which === 'S_x^2 + S_y^2' ? 2 * one : one, v = round(ans, 3);
        return { q: R`For a spin $s = ${hf(s)}$, the trace of $${which}$ in units of $\hbar^2$ is ______ (up to three decimal places).`,
          answer: v, tol: 0.001, s, k: which === 'S_x^2 + S_y^2' ? 2 : 1,
          sol: R`$\text{Tr}\,\vec S^2 = s(s + 1)(2s + 1) = ${round(s * (s + 1) * (2 * s + 1), 3)}$, shared equally by the three components (traces do not depend on the axis), so each square has trace $${round(one, 3)}$.${which === 'S_x^2 + S_y^2' ? ` Two of them give $${v}$.` : ''}`,
          trap: 'Every axis is equivalent, so each component square carries one third of the total.' };
      },
      verify: (p) => p.k * p.s * (p.s + 1) * (2 * p.s + 1) / 3 },
    { id: 'qsa-r5g2', type: 'nat', level: 2, exams: ['jam', 'gate', 'net'], sub: 'ladder operators',
      make(r) {
        const j = int(r, 1, 8) / 2, up = r() < 0.5;
        const list = ms(j).filter((m) => (up ? m < j - 1e-9 : m > -j + 1e-9)), m = choose(r, list);
        const c = Math.sqrt(j * (j + 1) - m * (up ? m + 1 : m - 1)), v = round(c, 3);
        return { q: R`For $j = ${hf(j)}$, $J_${up ? '+' : '-'}|j, m = ${hf(m)}\rangle = c\,\hbar\,|j, m ${up ? '+' : '-'} 1\rangle$. The coefficient $c$ is ______ (three decimal places).`,
          answer: v, tol: 0.002, j, m, up,
          sol: R`$c = \sqrt{j(j + 1) - m(m ${up ? '+' : '-'} 1)} = \sqrt{${round(j * (j + 1), 3)} - (${round(m * (up ? m + 1 : m - 1), 3)})} = ${v}$.`,
          trap: 'Raising uses m(m + 1), lowering uses m(m - 1).' };
      },
      verify: (p) => Math.sqrt(p.j * (p.j + 1) - p.m * (p.up ? p.m + 1 : p.m - 1)) },
    { id: 'qsa-r5g3', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'expectation values',
      make(r) {
        const s1 = int(r, 1, 4) / 2, s2 = int(r, 1, 4) / 2, m1 = choose(r, ms(s1)), m2 = choose(r, ms(s2));
        const ans = s1 * (s1 + 1) + s2 * (s2 + 1) + 2 * m1 * m2, v = round(ans, 3);
        return { q: R`A spin $${hf(s1)}$ and a spin $${hf(s2)}$ are in the product state $|m_1 = ${hf(m1)}\rangle|m_2 = ${hf(m2)}\rangle$. The expectation value of the total $\vec S^2$ in units of $\hbar^2$ is ______ (up to three decimal places).`,
          answer: v, tol: 0.001, s1, s2, m1, m2,
          sol: R`$\vec S^2 = \vec S_1^2 + \vec S_2^2 + 2S_{1z}S_{2z} + S_{1+}S_{2-} + S_{1-}S_{2+}$; the flip-flop terms average to zero in a product of $S_z$ eigenstates. So $\langle\vec S^2\rangle = ${round(s1 * (s1 + 1), 3)} + ${round(s2 * (s2 + 1), 3)} + 2(${hf(m1)})(${hf(m2)}) = ${v}$.`,
          trap: 'Product states are generally not eigenstates of the total S squared; the flip-flop terms vanish only in the average.' };
      },
      verify: (p) => p.s1 * (p.s1 + 1) + p.s2 * (p.s2 + 1) + 2 * p.m1 * p.m2 },
  ],
};
