// Round 4 extras for postulates-operators: original questions, written 2026-11-22.
import { int, choose, mcqOptions, round, shuffle } from '../_util.js';
const R = String.raw;
const binom = (n, k) => { let v = 1; for (let i = 1; i <= k; i++) v = v * (n - k + i) / i; return Math.round(v); };

export default {
  items: [
    { id: 'qpo-r4-01', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'eigenfunctions',
      q: R`Which function is an eigenfunction of $d^2/dx^2$ but NOT of $d/dx$?`,
      options: [R`$e^{ikx}$`, R`$\cos kx$`, R`$x^2$`, R`$e^{x^2}$`], answer: 1,
      sol: R`$\dfrac{d^2}{dx^2}\cos kx = -k^2\cos kx$, an eigenfunction, but $\dfrac{d}{dx}\cos kx = -k\sin kx$ is not a multiple of $\cos kx$. $e^{ikx}$ is an eigenfunction of both. $x^2$ gives the constant $2$ and $e^{x^2}$ gives $(2 + 4x^2)e^{x^2}$, so neither is an eigenfunction of $d^2/dx^2$. Physically: a standing wave $\cos kx$ has definite kinetic energy but no definite momentum.`,
      trap: R`$e^{ikx}$ is an eigenfunction of $d^2/dx^2$ too, but it is also one of $d/dx$.` },
    { id: 'qpo-r4-02', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'adjoint',
      q: R`On smooth functions that vanish at $\pm\infty$, the adjoint of the operator $x\dfrac{d}{dx}$ is`,
      options: [R`$x\dfrac{d}{dx}$`, R`$-x\dfrac{d}{dx}$`, R`$-1 - x\dfrac{d}{dx}$`, R`$1 + x\dfrac{d}{dx}$`], answer: 2,
      sol: R`Integration by parts gives $(d/dx)^\dagger = -d/dx$, and $x^\dagger = x$. With $(AB)^\dagger = B^\dagger A^\dagger$: $\left(x\dfrac{d}{dx}\right)^\dagger = -\dfrac{d}{dx}x$. Acting on $f$: $-\dfrac{d}{dx}(xf) = -f - xf'$, so the adjoint is $-1 - x\dfrac{d}{dx}$. Hence $x\dfrac{d}{dx} + \tfrac12$ is anti-Hermitian, and $\tfrac12(\hat x\hat p + \hat p\hat x) = -i\hbar\left(x\dfrac{d}{dx} + \tfrac12\right)$ is Hermitian.`,
      trap: R`Forgetting that the derivative also acts on $x$ when the order is reversed.` },
    { id: 'qpo-r4-03', type: 'nat', level: 2, exams: ['jam', 'gate', 'net'], sub: 'measurement',
      q: R`A qubit is in $|\psi\rangle = \tfrac12\left(\sqrt3\,|0\rangle + i|1\rangle\right)$. The probability that a measurement finds it in $|\phi\rangle = \tfrac{1}{\sqrt2}\left(|0\rangle + i|1\rangle\right)$ is ______ (three decimal places).`,
      answer: 0.933, tol: 0.002, calc: () => (Math.sqrt(3) + 1) ** 2 / 8,
      sol: R`The probability is $|\langle\phi|\psi\rangle|^2$, and the bra conjugates: $\langle\phi| = \tfrac{1}{\sqrt2}(\langle0| - i\langle1|)$. So $\langle\phi|\psi\rangle = \tfrac{1}{2\sqrt2}\left(\sqrt3 + (-i)(i)\right) = \dfrac{\sqrt3 + 1}{2\sqrt2}$, and $|\langle\phi|\psi\rangle|^2 = \dfrac{(\sqrt3 + 1)^2}{8} = \dfrac{2 + \sqrt3}{4} = 0.933$.`,
      trap: R`Not conjugating the bra gives $(\sqrt3 - 1)^2/8 = 0.067$.` },
    { id: 'qpo-r4-04', type: 'nat', level: 3, exams: ['jam', 'gate', 'net'], sub: 'Hermitian operators',
      q: R`An observable is represented by $A = \begin{pmatrix}2 & 1 - i\\ 1 + i & 3\end{pmatrix}$ in an orthonormal basis. The largest value a measurement of $A$ can give is ______.`,
      answer: 4, tol: 0.01,
      sol: R`The possible results are the eigenvalues. $\det(A - \lambda) = (2 - \lambda)(3 - \lambda) - |1 - i|^2 = \lambda^2 - 5\lambda + 6 - 2 = \lambda^2 - 5\lambda + 4 = 0$, so $\lambda = 1$ or $4$. Check: the trace is $5 = 1 + 4$ and the determinant $4 = 1\times4$.`,
      trap: R`Using $(1 - i)(1 + i)$ correctly gives 2; squaring as if real, $(1 - i)^2 = -2i$, gives a complex "eigenvalue", impossible for a Hermitian matrix.` },
    { id: 'qpo-r4-05', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'projection operators',
      q: R`$P$ and $Q$ are orthogonal projectors ($P^2 = P = P^\dagger$, likewise $Q$). Which of these are always projectors?`,
      options: [R`$PQ$`, R`$1 - P$`, R`$P + Q$`, R`$UPU^\dagger$ for any unitary $U$`], answer: [1, 3],
      sol: R`$1 - P$: Hermitian and $(1 - P)^2 = 1 - 2P + P^2 = 1 - P$. $UPU^\dagger$: Hermitian and $(UPU^\dagger)^2 = UP^2U^\dagger = UPU^\dagger$. $PQ$ is Hermitian only if $PQ = QP$ (two projectors onto non-perpendicular lines do not commute). $(P + Q)^2 = P + Q + PQ + QP$, so $P + Q$ is a projector only when $PQ + QP = 0$, which for projectors means $PQ = 0$ (orthogonal ranges).`,
      trap: R`The sum of projectors is a projector only for mutually orthogonal subspaces, as in $\sum_n|n\rangle\langle n|$.` },
    { id: 'qpo-r4-06', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'parity',
      q: R`A particle has $\psi = \tfrac{1}{\sqrt5}(2\psi_e + \psi_o)$, where $\psi_e$ is a normalised even function and $\psi_o$ a normalised odd function. The expectation value of the parity operator is ______.`,
      answer: 0.6, tol: 0.01,
      sol: R`An even and an odd function are orthogonal, so $\psi$ is normalised ($\tfrac{4 + 1}{5} = 1$). Parity has eigenvalue $+1$ on $\psi_e$ and $-1$ on $\psi_o$. A parity measurement gives $+1$ with probability $4/5$ and $-1$ with probability $1/5$, so $\langle\Pi\rangle = \tfrac45 - \tfrac15 = 0.6$.`,
      trap: R`Using the amplitudes (2 and 1) instead of their squares.` },
    { id: 'qpo-r4-07', type: 'mcq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'Heisenberg picture',
      q: R`In passing from the Schrödinger picture to the Heisenberg picture, which of these stay exactly the same?`,
      options: [R`the state vectors`, R`the operators for observables`, R`nothing: the two pictures make different predictions`, R`expectation values and measurement probabilities`], answer: 3,
      sol: R`In the Schrödinger picture states move, $|\psi(t)\rangle = U|\psi\rangle$, and operators are fixed; in the Heisenberg picture $A_H(t) = U^\dagger AU$ moves and the state is fixed. Every prediction is of the form $\langle\psi|U^\dagger AU|\psi\rangle$, so expectation values and probabilities agree. Only the bookkeeping differs.`,
      trap: R`The pictures are not different theories; they distribute the same time dependence differently.` },
    { id: 'qpo-r4-08', type: 'nat', level: 4, exams: ['jam', 'gate', 'net'], sub: 'expectation values',
      q: R`A particle is in the ground state of an infinite well $0 < x < L$. Its position spread is $\Delta x = kL$ with $k =$ ______ (three decimal places).`,
      answer: 0.181, tol: 0.002, calc: () => Math.sqrt(1 / 3 - 1 / (2 * Math.PI ** 2) - 0.25),
      sol: R`With $\psi = \sqrt{2/L}\sin(\pi x/L)$: $\langle x\rangle = L/2$ by symmetry, and $\langle x^2\rangle = \dfrac2L\int_0^Lx^2\sin^2\dfrac{\pi x}{L}dx = L^2\left(\dfrac13 - \dfrac{1}{2\pi^2}\right) = 0.2827L^2$. So $(\Delta x)^2 = 0.2827L^2 - 0.25L^2 = 0.0327L^2$ and $\Delta x = 0.181L$. (A classical particle bouncing uniformly would have $L/\sqrt{12} = 0.289L$.)`,
      trap: R`Stopping at $\sqrt{\langle x^2\rangle} = 0.532L$ forgets to subtract $\langle x\rangle^2$.` },
    { id: 'qpo-r4-09', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'time evolution',
      q: R`A decaying level is modelled with $H = H_0 - i\Gamma/2$, where $H_0$ is Hermitian and $\Gamma > 0$ is a real constant. Starting from a normalised state, the norm $\langle\psi(t)|\psi(t)\rangle$ evolves as`,
      options: [R`$e^{-\Gamma t/\hbar}$`, R`$e^{-\Gamma t/2\hbar}$`, R`it stays equal to 1`, R`$e^{+\Gamma t/\hbar}$`], answer: 0,
      sol: R`The constant term commutes with $H_0$, so $|\psi(t)\rangle = e^{-iH_0t/\hbar}e^{-\Gamma t/2\hbar}|\psi(0)\rangle$. The first factor is unitary; the second multiplies the amplitude by $e^{-\Gamma t/2\hbar}$, so the norm (amplitude squared) is $e^{-\Gamma t/\hbar}$. This is exponential decay with lifetime $\tau = \hbar/\Gamma$; probability is lost because $H$ is not Hermitian.`,
      trap: R`$e^{-\Gamma t/2\hbar}$ is the amplitude; probabilities are its square.` },
    { id: 'qpo-r4-10', type: 'msq', level: 3, exams: ['jam', 'gate', 'net'], sub: 'wavefunctions',
      q: R`Which of these functions, defined on the whole real line, can be normalised and so describe a physical state?`,
      options: [R`$e^{-|x|}$`, R`$\sin x$`, R`$\dfrac{1}{\sqrt{1 + |x|}}$`, R`$\dfrac{\sin x}{x}$`], answer: [0, 3],
      sol: R`We need $\int|\psi|^2dx < \infty$. $\int e^{-2|x|}dx = 1$: yes. $\int\sin^2x\,dx$ grows without limit: no. $\int\dfrac{dx}{1 + |x|}$ grows like $2\ln|x|$: no, even though $\psi \to 0$. $\int\dfrac{\sin^2x}{x^2}dx = \pi$: yes (and the function is finite at $x = 0$).`,
      trap: R`Going to zero at infinity is not enough; it must go to zero fast enough that $|\psi|^2$ is integrable.` },
    { id: 'qpo-r4-11', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'density matrix',
      q: R`One source gives qubits in the pure state $|+\rangle = (|0\rangle + |1\rangle)/\sqrt2$; another gives the mixture $\rho = \tfrac12(|0\rangle\langle0| + |1\rangle\langle1|)$. Which measurement, repeated on many qubits, tells the sources apart?`,
      options: [R`$\sigma_z$`, R`$\sigma_x$`, R`no measurement can tell them apart`, R`$\sigma_z^2$`], answer: 1,
      sol: R`For $\sigma_z$ both give $\pm1$ with probability $\tfrac12$ each. For $\sigma_x$, $|+\rangle$ is an eigenstate with eigenvalue $+1$, so it always gives $+1$, while $\mathrm{Tr}(\rho\sigma_x) = 0$ and the mixture gives $\pm1$ equally. The density matrices differ in their off-diagonal elements (coherences), which only a measurement in a rotated basis sees. $\sigma_z^2 = 1$ gives no information.`,
      trap: R`Equal populations do not mean equal states; the coherence is what $\sigma_z$ misses.` },
    { id: 'qpo-r4-12', type: 'mcq', level: 5, exams: ['net', 'gate'], sub: 'Hermitian operators',
      q: R`An operator $A$ on a complex Hilbert space has $\langle\psi|A|\psi\rangle$ real for every $|\psi\rangle$. Then`,
      options: [R`$A$ must be unitary`, R`$A$ can be non-Hermitian, for example $\begin{pmatrix}1 & 1\\ 0 & 1\end{pmatrix}$, whose eigenvalues are real`, R`$A$ must be Hermitian`, R`$A$ must be a positive operator`], answer: 2,
      sol: R`Write $A = H + iK$ with $H = (A + A^\dagger)/2$ and $K = (A - A^\dagger)/2i$, both Hermitian. Then $\langle\psi|A|\psi\rangle = \langle H\rangle + i\langle K\rangle$ with $\langle H\rangle$, $\langle K\rangle$ real, so $\langle\psi|K|\psi\rangle = 0$ for all $\psi$. On a complex space this forces $K = 0$ (polarisation identity), so $A = H$. The matrix in the second option fails: with $\psi = (1, i)/\sqrt2$, $\langle\psi|A|\psi\rangle = 1 + i/2$. $-1$ times the identity shows positivity is not needed.`,
      trap: R`Real eigenvalues alone do not make an operator Hermitian.` },
  ],
  gens: [
    { id: 'qpo-r4g1', type: 'nat', level: 3, exams: ['jam', 'gate', 'net'], sub: 'Hermitian operators',
      make(r) {
        const a = int(r, 0, 5), d = int(r, 0, 5), b = int(r, 1, 3), c = choose(r, [-2, -1, 1, 2]);
        const big = choose(r, [true, false]);
        const disc = Math.sqrt((a - d) ** 2 + 4 * (b * b + c * c)), ans = ((a + d) + (big ? 1 : -1) * disc) / 2;
        const off = (s) => `${b} ${s === '+' ? (c < 0 ? '-' : '+') : (c < 0 ? '+' : '-')} ${Math.abs(c) === 1 ? '' : Math.abs(c)}i`;
        return { q: R`An observable is $A = \begin{pmatrix}${a} & ${off('-')}\\ ${off('+')} & ${d}\end{pmatrix}$ in an orthonormal basis. The ${big ? 'largest' : 'smallest'} possible result of measuring $A$ is ______ (three decimal places).`,
          answer: round(ans, 3), tol: 0.005, a, d, b, c, big,
          sol: R`The results are the eigenvalues: $\lambda = \tfrac12\left[(a + d) \pm \sqrt{(a - d)^2 + 4|A_{12}|^2}\right]$ with $|A_{12}|^2 = ${b}^2 + ${c}^2 = ${b * b + c * c}$. So $\lambda = \tfrac12\left[${a + d} \pm \sqrt{${(a - d) ** 2} + ${4 * (b * b + c * c)}}\right] = \tfrac12[${a + d} \pm ${round(disc, 4)}]$, and the ${big ? 'largest' : 'smallest'} is $${round(ans, 3)}$.`,
          trap: R`Using $A_{12}^2$ (complex) instead of $|A_{12}|^2$.` };
      },
      verify: (p) => ((p.a + p.d) + (p.big ? 1 : -1) * Math.sqrt((p.a - p.d) ** 2 + 4 * (p.b ** 2 + p.c ** 2))) / 2 },
    { id: 'qpo-r4g2', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'measurement',
      make(r) {
        const n = int(r, 2, 5), m = n - 2 * int(r, 0, Math.floor(n / 2));
        const ans = binom(n, (n - m) / 2) ** 2 / binom(2 * n, n);
        return { q: R`A particle on a ring has (unnormalised) wavefunction $\psi(\phi) = \cos^{${n}}\phi$. A measurement of $L_z$ gives ${m === 0 ? '$0$' : `$+${m === 1 ? '' : m}\\hbar$`} with probability ______ (four decimal places).`,
          answer: round(ans, 4), tol: 0.0005, n, m,
          sol: R`$\cos^{${n}}\phi = 2^{-${n}}\sum_k\binom{${n}}{k}e^{i(${n} - 2k)\phi}$, so the weight of $L_z = m\hbar$ is $\binom{${n}}{k}^2$ with $${n} - 2k = m$. The total weight is $\sum_k\binom{${n}}{k}^2 = \binom{${2 * n}}{${n}} = ${binom(2 * n, n)}$. For $m = ${m}$: $k = ${(n - m) / 2}$ and $P = \dfrac{${binom(n, (n - m) / 2)}^2}{${binom(2 * n, n)}} = ${round(ans, 4)}$.`,
          trap: R`Using the coefficients themselves rather than their squares as probabilities.` };
      },
      verify: (p) => binom(p.n, (p.n - p.m) / 2) ** 2 / binom(2 * p.n, p.n) },
    { id: 'qpo-r4g3', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'time evolution',
      make(r) {
        const k = choose(r, ['x', 'y', 'z']), th = choose(r, ['pi4', 'pi2', 'pi', '3pi2', '2pi']);
        const s = `\\sigma_${k}`;
        const all = { pi4: `$\\tfrac{1}{\\sqrt2}(I - i${s})$`, pi2: `$-i${s}$`, pi: `$-I$`, '3pi2': `$i${s}$`, '2pi': `$I$` };
        const tex = { pi4: '\\pi/4', pi2: '\\pi/2', pi: '\\pi', '3pi2': '3\\pi/2', '2pi': '2\\pi' }[th];
        const pool = shuffle(r, [...Object.values(all), `$${s}$`, `$\\tfrac{1}{\\sqrt2}(I + i${s})$`]).filter((v) => v !== all[th]);
        const o = mcqOptions(r, all[th], pool, (v) => v);
        return { q: R`A two-level system has $H = E\,${s}$. With $I$ the identity, the evolution operator $U(t) = e^{-iHt/\hbar}$ at the time when $Et/\hbar = ${tex}$ equals`, ...o,
          sol: R`Since $${s}^2 = I$, the series splits into even and odd powers: $e^{-i\theta${s}} = I\cos\theta - i${s}\sin\theta$ with $\theta = Et/\hbar = ${tex}$. This gives ${all[th]}. Note $\theta = \pi$ gives $-I$: the state returns with an overall sign, and $\theta = 2\pi$ is needed for $U = I$.`,
          trap: R`Treating $e^{-i\theta${s}}$ as $e^{-i\theta}$ times $${s}$ (it is not a phase times the matrix).` };
      } },
  ],
};
