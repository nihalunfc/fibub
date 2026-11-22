// Round 4 extras for spin-addition: original questions, written 2026-11-22.
import { pick, int, choose, round } from '../_util.js';
const R = String.raw;

const hf = (x) => (Number.isInteger(x) ? String(x) : `${Math.round(2 * x)}/2`);
const binom = (n, k) => { if (k < 0 || k > n) return 0; let c = 1; for (let i = 0; i < k; i++) c = c * (n - i) / (i + 1); return Math.round(c); };
/** Multiplicity of total spin S among N spin-1/2 particles, by repeated coupling. */
const multByCoupling = (N, S) => { let m = new Map([[0.5, 1]]); for (let k = 2; k <= N; k++) { const n = new Map(); for (const [s, c] of m) for (const t of [s - 0.5, s + 0.5]) if (t >= 0) n.set(t, (n.get(t) ?? 0) + c); m = n; } return m.get(S) ?? 0; };
/** Gap between the two M = 0 levels of H = A S1.S2 + B (S1z - S2z) (spins 1/2, S in units of hbar). */
const gapM0 = (A, B) => 2 * Math.sqrt(B * B + A * A / 4);

export default {
  items: [
    { id: 'qsa-r4-01', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'commutators',
      q: R`For spin operators, the commutator $[S_x, S_y]$ equals`,
      options: [R`$i\hbar S_x$`, R`$-i\hbar S_z$`, R`$\hbar S_z$`, R`$i\hbar S_z$`], answer: 3,
      sol: R`All angular momenta obey $[J_x, J_y] = i\hbar J_z$ and its cyclic versions. For spin $\tfrac12$ one can check it with $S_i = \tfrac\hbar2\sigma_i$: $[\sigma_x, \sigma_y] = 2i\sigma_z$, so $[S_x, S_y] = \tfrac{\hbar^2}{4}2i\sigma_z = i\hbar S_z$.`,
      trap: R`The order matters: $[S_y, S_x] = -i\hbar S_z$.` },
    { id: 'qsa-r4-02', type: 'nat', level: 1, exams: ['jam', 'gate', 'net'], sub: 'addition rules',
      q: R`Two angular momenta $j_1 = \tfrac52$ and $j_2 = \tfrac32$ are added. The number of different allowed values of the total $j$ is ______.`,
      answer: 4, tol: 0,
      sol: R`$j$ runs in whole steps from $|j_1 - j_2| = 1$ to $j_1 + j_2 = 4$: $j = 1, 2, 3, 4$, four values (in general $2\min(j_1, j_2) + 1$). Check: $3 + 5 + 7 + 9 = 24 = 6\times4$ states.`,
      trap: R`$j$ steps by 1, not by $\tfrac12$.` },
    { id: 'qsa-r4-03', type: 'mcq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'Pauli matrices',
      q: R`For the Pauli matrices, $\text{Tr}(\sigma_i\sigma_j)$ equals`,
      options: [R`$2\delta_{ij}$`, R`$\delta_{ij}$`, R`$2i\epsilon_{ijk}$`, R`$0$ for all $i, j$`], answer: 0,
      sol: R`$\sigma_i\sigma_j = \delta_{ij}\mathbb 1 + i\epsilon_{ijk}\sigma_k$. Each $\sigma_k$ is traceless and $\text{Tr}\,\mathbb 1 = 2$, so $\text{Tr}(\sigma_i\sigma_j) = 2\delta_{ij}$. This is why any $2\times2$ matrix can be written $a_0\mathbb 1 + \vec a\cdot\vec\sigma$ with $a_\mu = \tfrac12\text{Tr}(\sigma_\mu M)$.`,
      trap: R`The $\epsilon_{ijk}$ term multiplies a traceless matrix, so it drops out of the trace.` },
    { id: 'qsa-r4-04', type: 'nat', level: 3, exams: ['jam', 'gate', 'net'], sub: 'expectation values',
      q: R`A spin-$\tfrac12$ particle is in $\tfrac{1}{\sqrt5}\left(|{\uparrow}\rangle + 2i|{\downarrow}\rangle\right)$. Then $\langle S_y\rangle = k\hbar$ with $k = $ ______ (two decimal places).`,
      answer: 0.4, tol: 0.005, calc: () => 0.5 * 2 * (1 * 2) / 5,
      sol: R`For $\chi = (a, b)^T$, $\langle\sigma_y\rangle = \chi^\dagger\sigma_y\chi = -ia^*b + ib^*a = 2\,\text{Im}(a^*b)$. Here $a = 1/\sqrt5$, $b = 2i/\sqrt5$: $a^*b = 2i/5$, so $\langle\sigma_y\rangle = 4/5$ and $\langle S_y\rangle = \tfrac\hbar2\times\tfrac45 = 0.40\hbar$.`,
      trap: R`$\langle S_x\rangle$ here is zero (it needs $\text{Re}(a^*b)$); do not mix up the real and imaginary parts.` },
    { id: 'qsa-r4-05', type: 'mcq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'singlet state',
      q: R`Two spin-$\tfrac12$ particles are in the singlet state. Spin 1 is measured along $x$ and gives $+\hbar/2$. A measurement of spin 2 along $x$ will give`,
      options: [R`$+\hbar/2$ with certainty`, R`$-\hbar/2$ with certainty`, R`$\pm\hbar/2$ with probability $\tfrac12$ each`, R`$0$`], answer: 1,
      sol: R`The singlet has total $S = 0$ and is the same in every basis: $\tfrac1{\sqrt2}(|{+}{-}\rangle - |{-}{+}\rangle)$ for any axis. So the two components along any common axis always add to zero. Finding spin 1 at $+\hbar/2$ along $x$ leaves spin 2 in $-\hbar/2$ along $x$.`,
      trap: R`The singlet is usually written in the $z$ basis, but it has the same form along $x$; the anticorrelation holds for every common axis.` },
    { id: 'qsa-r4-06', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'Pauli matrices', format: 'statements',
      q: R`Which statements about the Pauli matrices are correct?`,
      options: [R`$\sigma_i\sigma_j + \sigma_j\sigma_i = 2\delta_{ij}\mathbb 1$`, R`$\det\sigma_x = -1$`,
        R`$\sigma_x$ has the eigenvectors $|{\uparrow}\rangle$ and $|{\downarrow}\rangle$`, R`$e^{i\theta\sigma_z} = \cos\theta\,\mathbb 1 + i\sin\theta\,\sigma_z$`], answer: [0, 1, 3],
      sol: R`Different Pauli matrices anticommute and each squares to $\mathbb 1$. $\det\sigma_x = 0\cdot0 - 1\cdot1 = -1$ (eigenvalues $\pm1$). Since $\sigma_z^2 = \mathbb 1$, the exponential series splits into even and odd parts: $\cos\theta\,\mathbb 1 + i\sin\theta\,\sigma_z$. $\sigma_x$ swaps $|{\uparrow}\rangle$ and $|{\downarrow}\rangle$; its eigenvectors are $(|{\uparrow}\rangle\pm|{\downarrow}\rangle)/\sqrt2$.`,
      trap: R`$|{\uparrow}\rangle$, $|{\downarrow}\rangle$ are eigenvectors of $\sigma_z$ only.` },
    { id: 'qsa-r4-07', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'three spins',
      q: R`Three spin-$\tfrac12$ particles are in the state with total $S = \tfrac32$, $M = \tfrac12$. The probability that a measurement of $S_{1z}$ gives $-\hbar/2$ is ______ (three decimal places).`,
      answer: 0.333, tol: 0.003, calc: () => 1 / 3,
      sol: R`Apply $S_- = S_{1-} + S_{2-} + S_{3-}$ to $|{\uparrow\uparrow\uparrow}\rangle$: $|\tfrac32, \tfrac12\rangle = \tfrac{1}{\sqrt3}(|{\downarrow\uparrow\uparrow}\rangle + |{\uparrow\downarrow\uparrow}\rangle + |{\uparrow\uparrow\downarrow}\rangle)$. Spin 1 is down only in the first term: probability $\tfrac13$. (By symmetry each spin carries the single "down" with equal chance.)`,
      trap: R`$M = \tfrac12$ does not mean each spin has $\langle S_z\rangle = \tfrac{\hbar}{2}$; each has $\langle S_{iz}\rangle = \hbar/6$.` },
    { id: 'qsa-r4-08', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'two spins',
      q: R`Two spin-1 particles are coupled to total spin $S = 1$. In this state $\langle\vec S_1\cdot\vec S_2\rangle = k\hbar^2$ with $k = $ ______.`,
      answer: -1, tol: 0, calc: () => (2 - 2 - 2) / 2,
      sol: R`$\vec S_1\cdot\vec S_2 = \tfrac12(S^2 - S_1^2 - S_2^2) = \tfrac{\hbar^2}{2}[S(S+1) - 2 - 2]$. For $S = 1$: $\tfrac12(2 - 4) = -1$. (For $S = 0$ it is $-2$, for $S = 2$ it is $+1$; the weighted average over all nine states is zero.)`,
      trap: R`Each spin-1 contributes $s(s+1) = 2$, not $\tfrac34$.` },
    { id: 'qsa-r4-09', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'projection theorem',
      q: R`An electron with $l = 1$ is in the state $|j = \tfrac12, m_j = \tfrac12\rangle$. The expectation value $\langle S_z\rangle$ is`,
      options: [R`$+\hbar/6$`, R`$+\hbar/2$`, R`$-\hbar/6$`, R`$-\hbar/2$`], answer: 2,
      sol: R`$|\tfrac12, \tfrac12\rangle = \sqrt{\tfrac23}\,|m_l = 1\rangle|{\downarrow}\rangle - \sqrt{\tfrac13}\,|m_l = 0\rangle|{\uparrow}\rangle$. So $\langle S_z\rangle = \tfrac23(-\tfrac\hbar2) + \tfrac13(+\tfrac\hbar2) = -\tfrac\hbar6$. Check with the projection theorem: $\langle S_z\rangle = m_j\hbar\dfrac{j(j+1) + s(s+1) - l(l+1)}{2j(j+1)} = \tfrac12\hbar\cdot\dfrac{0.75 + 0.75 - 2}{1.5} = -\tfrac\hbar6$. The spin points mostly against $m_j$, as expected for $j = l - \tfrac12$.`,
      trap: R`$m_j = +\tfrac12$ does not mean the spin is up; in $j = l - \tfrac12$ states it leans the other way.` },
    { id: 'qsa-r4-10', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'two spins', unit: 'meV',
      q: R`Two spin-$\tfrac12$ particles with slightly different $g$ factors in a field have $H = A\,\vec S_1\cdot\vec S_2 + B\,(S_{1z} - S_{2z})$, with spins in units of $\hbar$, $A = 4.0$ meV and $B = 1.5$ meV. The energy gap between the two $M = 0$ eigenstates is ______ meV (two decimal places).`,
      answer: 5, tol: 0.02, calc: () => gapM0(4, 1.5),
      sol: R`$M = S_{1z} + S_{2z}$ commutes with $H$. In the $M = 0$ basis $\{|{\uparrow\downarrow}\rangle, |{\downarrow\uparrow}\rangle\}$: $\vec S_1\cdot\vec S_2$ has diagonal $-\tfrac14$ and off-diagonal $\tfrac12$; $S_{1z} - S_{2z}$ is $\text{diag}(1, -1)$. So $H = \begin{pmatrix}-A/4 + B & A/2\\ A/2 & -A/4 - B\end{pmatrix}$, with eigenvalues $-A/4\pm\sqrt{B^2 + A^2/4}$. Gap $= 2\sqrt{1.5^2 + 2^2} = 2\times2.5 = 5.00$ meV. When $B = 0$ the gap is the singlet-triplet splitting $A$; $B$ mixes the singlet with the $M = 0$ triplet.`,
      trap: R`Adding $A$ and $2B$ (7 meV) ignores the mixing: the two effects combine in quadrature.` },
    { id: 'qsa-r4-11', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'many spins',
      q: R`Four spin-$\tfrac12$ particles are combined. The number of independent total-spin-zero (singlet) states is`,
      options: [R`$1$`, R`$2$`, R`$3$`, R`$6$`], answer: 1,
      sol: R`Couple step by step: two spins give $0\oplus1$; adding a third gives $\tfrac12\oplus\tfrac12\oplus\tfrac32$; adding a fourth gives $(0\oplus1)\oplus(0\oplus1)\oplus(1\oplus2)$. So $S = 0$ twice, $S = 1$ three times, $S = 2$ once. Check: $2\times1 + 3\times3 + 1\times5 = 16 = 2^4$.`,
      trap: R`$6$ counts all states with $M = 0$ ($2 + 3 + 1$, one from every multiplet), not only the singlets.` },
    { id: 'qsa-r4-12', type: 'msq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'addition rules',
      q: R`An electron in an $f$ orbital ($l = 3$) adds its spin to its orbital angular momentum. Which values of $j$ are possible?`,
      options: [R`$\tfrac52$`, R`$3$`, R`$\tfrac72$`, R`$\tfrac12$`], answer: [0, 2],
      sol: R`$j = l\pm\tfrac12 = \tfrac72$ or $\tfrac52$. $j$ must be a half-integer when a spin $\tfrac12$ is added to an integer $l$, and it cannot go below $l - \tfrac12$.`,
      trap: R`$j = l$ is impossible with one spin $\tfrac12$: $j$ differs from $l$ by exactly $\tfrac12$.` },
  ],
  gens: [
    { id: 'qsa-r4g1', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'two spins',
      make(r) {
        const A = pick(r, 0.5, 8, 0.5), B = pick(r, 0.2, 5, 0.1);
        const g = gapM0(A, B);
        return { q: R`Two spin-$\tfrac12$ particles have $H = A\,\vec S_1\cdot\vec S_2 + B\,(S_{1z} - S_{2z})$ (spins in units of $\hbar$), with $A = ${A}$ meV and $B = ${B}$ meV. The gap between the two eigenstates with $M = 0$ is ______ meV (three significant figures).`,
          answer: +g.toPrecision(3), tol: +(g * 0.005).toPrecision(2), unit: 'meV', A, B,
          sol: R`In the basis $|{\uparrow\downarrow}\rangle, |{\downarrow\uparrow}\rangle$: $H = \begin{pmatrix}-A/4 + B & A/2\\ A/2 & -A/4 - B\end{pmatrix}$. Eigenvalues $-A/4\pm\sqrt{B^2 + A^2/4}$, so the gap is $2\sqrt{${B}^2 + ${A / 2}^2} = ${+g.toPrecision(3)}$ meV.`,
          trap: 'The exchange (A) and field-difference (B) parts add in quadrature, not linearly.' };
      },
      verify: (p) => { const a = -p.A / 4 + p.B, d = -p.A / 4 - p.B, o = p.A / 2; const tr = a + d, det = a * d - o * o; return Math.sqrt(tr * tr - 4 * det); } },
    { id: 'qsa-r4g2', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'many spins',
      make(r) {
        const N = int(r, 2, 8);
        const Smax = N / 2;
        const S = Smax - int(r, 1, Math.floor(Smax));
        const k = Smax - S;
        const c = binom(N, k) - binom(N, k - 1);
        return { q: R`${N} spin-$\tfrac12$ particles are combined. The number of independent multiplets with total spin $S = ${hf(S)}$ is ______.`,
          answer: c, tol: 0, N, S,
          sol: R`The number of states with $M = S$ is $\binom{${N}}{${k}}$ (choose which ${k} spin${k === 1 ? ' is' : 's are'} down); each multiplet with total spin at least $S$ contributes one. Subtract those with $M = S + 1$: $\binom{${N}}{${k}} - \binom{${N}}{${k - 1}} = ${binom(N, k)} - ${binom(N, k - 1)} = ${c}$.`,
          trap: 'Count states with M = S, then remove those that belong to larger S.' };
      },
      verify: (p) => multByCoupling(p.N, p.S) },
    { id: 'qsa-r4g3', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'two spins',
      make(r) {
        const s1 = choose(r, [0.5, 1, 1.5, 2]), s2 = choose(r, [0.5, 1, 1.5, 2]);
        const S = Math.abs(s1 - s2) + int(r, 0, Math.round(s1 + s2 - Math.abs(s1 - s2)));
        const k = (S * (S + 1) - s1 * (s1 + 1) - s2 * (s2 + 1)) / 2;
        return { q: R`A spin $${hf(s1)}$ and a spin $${hf(s2)}$ are coupled to total spin $S = ${hf(S)}$. In this state $\langle\vec S_1\cdot\vec S_2\rangle = k\hbar^2$ with $k = $ ______ (two decimal places).`,
          answer: round(k, 2), tol: 0.005, s1, s2, S,
          sol: R`$\vec S_1\cdot\vec S_2 = \tfrac12(S^2 - S_1^2 - S_2^2)$: $k = \tfrac12[${S * (S + 1)} - ${s1 * (s1 + 1)} - ${s2 * (s2 + 1)}] = ${round(k, 2)}$.`,
          trap: 'Use s(s+1) for each spin, not s squared.' };
      },
      verify: (p) => (p.S * (p.S + 1) - p.s1 * (p.s1 + 1) - p.s2 * (p.s2 + 1)) / 2 },
  ],
};
