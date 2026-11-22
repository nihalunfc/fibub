// Round 5 extras for normal-modes: original questions, written 2026-11-22.
import { pick, int, choose, round } from '../_util.js';
const R = String.raw;

export default {
  items: [
    { id: 'nm-r5-01', type: 'mcq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'eigenvalue problem',
      q: R`A system with unit masses has $M = I$ and stiffness matrix $K = \begin{pmatrix}3 & 1\\ 1 & 3\end{pmatrix}$ (in units with $k/m = 1$). Its normal-mode angular frequencies are`,
      options: [R`$1$ and $3$`, R`$2$ and $3$`, R`$\sqrt3$ and $\sqrt3$`, R`$\sqrt2$ and $2$`], answer: 3,
      sol: R`Solve $\det(K - \omega^2I) = (3 - \omega^2)^2 - 1 = 0$, so $\omega^2 = 3 \mp 1 = 2, 4$, giving $\omega = \sqrt2$ and $2$. The modes are $(1, -1)$ for $\omega^2 = 2$ and $(1, 1)$ for $\omega^2 = 4$.`,
      trap: R`Taking the eigenvalues 2 and 4 as $\omega$ itself: they are $\omega^2$.` },
    { id: 'nm-r5-02', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'trace rule',
      q: R`A system has $M = \begin{pmatrix}1 & 0\\ 0 & 2\end{pmatrix}$ and $K = \begin{pmatrix}4 & -2\\ -2 & 6\end{pmatrix}$ (consistent units). Without solving for the modes, $\omega_1^2 + \omega_2^2 = $ ______ s⁻².`,
      answer: 7, tol: 0, calc: () => 4 / 1 + 6 / 2, unit: 's⁻²',
      sol: R`The $\omega^2$ are the eigenvalues of $M^{-1}K = \begin{pmatrix}4 & -2\\ -1 & 3\end{pmatrix}$, and the sum of eigenvalues is the trace: $4 + 3 = 7$.`,
      trap: R`Taking the trace of $K$ alone (10) ignores the masses.` },
    { id: 'nm-r5-03', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'determinant rule',
      q: R`For the same system ($M = \mathrm{diag}(1, 2)$, $K = \begin{pmatrix}4 & -2\\ -2 & 6\end{pmatrix}$), the product of the two normal-mode angular frequencies $\omega_1\omega_2$ is ______ s⁻².`,
      answer: 3.162, tol: 0.03, calc: () => Math.sqrt((24 - 4) / 2), unit: 's⁻²',
      sol: R`The product of the eigenvalues of $M^{-1}K$ is $\det(M^{-1}K) = \det K/\det M = (24 - 4)/2 = 10$. So $\omega_1^2\omega_2^2 = 10$ and $\omega_1\omega_2 = \sqrt{10} = 3.162$ s⁻². (With the trace 7, $\omega^2 = 2$ and $5$.)`,
      trap: R`Stopping at $\omega_1^2\omega_2^2 = 10$ and forgetting the square root.` },
    { id: 'nm-r5-04', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'orthogonality',
      q: R`A two-coordinate system has mass matrix $M = \mathrm{diag}(1, 2)$. One normal mode has amplitude vector $(1, 1)$. The other mode's amplitude vector is proportional to`,
      options: [R`$(1, -1)$`, R`$(2, -1)$`, R`$(1, -2)$`, R`$(1, 2)$`], answer: 1,
      sol: R`Distinct normal modes are orthogonal with the mass matrix as weight: $\mathbf a_1^{T}M\mathbf a_2 = 0$. With $\mathbf a_2 = (a, b)$: $1\cdot a + 2\cdot b = 0$, so $\mathbf a_2 \propto (2, -1)$. (This matches the system of the two previous questions, whose modes have $\omega^2 = 2$ and $5$.)`,
      trap: R`$(1, -1)$ is ordinary orthogonality, which holds only when all masses are equal.` },
    { id: 'nm-r5-05', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'Rayleigh quotient', format: 'statements',
      q: R`For small oscillations with mass matrix $M$ and stiffness $K$ (both symmetric, positive definite), the Rayleigh quotient is $\rho(\mathbf x) = \dfrac{\mathbf x^{T}K\mathbf x}{\mathbf x^{T}M\mathbf x}$. Which statements are true?`,
      options: [R`$\omega_{\min}^2 \le \rho(\mathbf x) \le \omega_{\max}^2$ for every non-zero $\mathbf x$`, R`$\rho$ equals $\omega_k^2$ when $\mathbf x$ is the $k$th mode`, R`A trial vector gives a lower bound on $\omega_{\min}^2$`, R`Stiffening any spring can never lower any normal frequency`], answer: [0, 1, 3],
      sol: R`Expand $\mathbf x$ in the $M$-orthonormal modes: $\rho = \sum c_k^2\omega_k^2/\sum c_k^2$, a weighted average of the $\omega_k^2$, so it lies between the smallest and largest, and equals $\omega_k^2$ on a mode. A trial vector therefore gives an upper bound on $\omega_{\min}^2$, not a lower one. Stiffening a spring adds a positive semi-definite matrix to $K$, which raises $\rho$ for every $\mathbf x$; by the min-max characterisation every $\omega_k^2$ rises or stays put.`,
      trap: R`Reversing the bound: Rayleigh's estimate always overestimates the lowest frequency.` },
    { id: 'nm-r5-06', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Rayleigh quotient',
      q: R`Three equal masses $m$ sit in a line between two walls, joined wall-$k$-$m$-$k$-$m$-$k$-$m$-$k$-wall. Using the trial shape $(1, 1, 1)$ in the Rayleigh quotient, the estimate of the lowest $\omega^2$ is ______ in units of $k/m$.`,
      answer: 0.667, tol: 0.007, calc: () => 2 / 3,
      sol: R`$K = k\begin{pmatrix}2 & -1 & 0\\ -1 & 2 & -1\\ 0 & -1 & 2\end{pmatrix}$, $M = mI$. For $\mathbf x = (1, 1, 1)$: $\mathbf x^{T}K\mathbf x = k(2 + 2 + 2 - 2 - 2) = 2k$ and $\mathbf x^{T}M\mathbf x = 3m$, so $\rho = 0.667\,k/m$. The exact value is $(2 - \sqrt2)k/m = 0.586\,k/m$: the estimate lies above it, as it must.`,
      trap: R`Forgetting the off-diagonal terms (each $-1$ appears twice in $\mathbf x^{T}K\mathbf x$) gives 2.` },
    { id: 'nm-r5-07', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'inertial coupling',
      q: R`A system has $T = \tfrac12(2\dot x^2 + 2\dot x\dot y + \dot y^2)$ and $V = \tfrac12(x^2 + y^2)$ (consistent units). Its normal-mode angular frequencies are`,
      options: [R`$1$ and $\sqrt2$`, R`$0.5$ and $2$`, R`$0.618$ and $1.618$`, R`$0.382$ and $2.618$`], answer: 2,
      sol: R`Here the coupling is in the kinetic energy: $M = \begin{pmatrix}2 & 1\\ 1 & 1\end{pmatrix}$, $K = I$. $\det(K - \omega^2M) = (1 - 2\omega^2)(1 - \omega^2) - \omega^4 = \omega^4 - 3\omega^2 + 1 = 0$, so $\omega^2 = (3 \mp \sqrt5)/2 = 0.382, 2.618$ and $\omega = 0.618, 1.618$ (the golden ratio and its inverse).`,
      trap: R`$0.382$ and $2.618$ are the values of $\omega^2$; take their square roots.` },
    { id: 'nm-r5-08', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'chains',
      q: R`Three equal masses $m$ hang in a line: wall-$k$-$m$-$k$-$m$-$k$-$m$, with the last mass free (no spring to a second wall); motion is along the line only. The highest normal-mode angular frequency is ______ in units of $\sqrt{k/m}$.`,
      answer: 1.802, tol: 0.018, calc: () => 2 * Math.sin(5 * Math.PI / 14),
      sol: R`$K = k\begin{pmatrix}2 & -1 & 0\\ -1 & 2 & -1\\ 0 & -1 & 1\end{pmatrix}$. Its characteristic polynomial in $\lambda = \omega^2m/k$ is $\lambda^3 - 5\lambda^2 + 6\lambda - 1 = 0$. A fixed-free chain of $N$ equal masses has $\lambda_j = 4\sin^2\dfrac{(2j - 1)\pi}{2(2N + 1)}$; for $N = 3$ the largest is $4\sin^2(5\pi/14) = 3.247$ (check: $3.247^3 - 5(3.247)^2 + 6(3.247) - 1 \approx 0$). So $\omega_{\max} = 2\sin(5\pi/14) = 1.802\sqrt{k/m}$.`,
      trap: R`Using the fixed-fixed formula $2\sin(3\pi/8) = 1.848$: the free end changes the last diagonal entry to 1.` },
    { id: 'nm-r5-09', type: 'mcq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'zero modes',
      q: R`Three point masses joined by three springs (a triangle) slide freely on a smooth horizontal table and stay in its plane. How many normal modes have non-zero frequency?`,
      options: [R`3`, R`6`, R`4`, R`2`], answer: 0,
      sol: R`Three masses in a plane have $2\times3 = 6$ coordinates, so 6 normal modes. Two translations and one rotation in the plane cost no spring energy, giving three zero-frequency modes. That leaves $6 - 3 = 3$ vibrations.`,
      trap: R`Subtracting 6 (the count for a body free in three dimensions) or forgetting the rotation.` },
    { id: 'nm-r5-10', type: 'msq', level: 3, exams: ['jam', 'gate', 'net'], sub: 'general motion',
      q: R`For small oscillations about a stable equilibrium with $M = mI$ and a symmetric stiffness matrix $K$, which statements are true?`,
      options: [R`Mode vectors belonging to different frequencies are perpendicular`, R`The normal frequencies are the square roots of the eigenvalues of $K/m$`, R`Every small motion is a sum of the normal modes with suitable amplitudes and phases`, R`Every small motion repeats itself after some finite time`], answer: [0, 1, 2],
      sol: R`With $M = mI$ the problem is the eigenproblem of the symmetric matrix $K/m$: real eigenvalues $\omega^2$ and orthogonal eigenvectors for distinct eigenvalues, which form a complete set, so any motion is a superposition. A superposition is periodic only if all the frequency ratios involved are rational; for example $\omega = 1$ and $\sqrt2$ together never repeat exactly.`,
      trap: R`Assuming a sum of periodic motions is always periodic.` },
  ],
  gens: [
    { id: 'nm-r5g1', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'trace rule',
      make(r) {
        const m1 = int(r, 1, 4), m2 = int(r, 1, 4), c = int(r, 1, 4), a = c + int(r, 1, 6), b = c + int(r, 1, 6);
        const answer = round(a / m1 + b / m2, 4);
        return { q: R`A system has $M = \mathrm{diag}(${m1}, ${m2})$ and $K = \begin{pmatrix}${a} & -${c}\\ -${c} & ${b}\end{pmatrix}$ (SI units). Find $\omega_1^2 + \omega_2^2$ in s⁻² without solving for the modes.`,
          answer, tol: Math.max(0.01, answer * 0.005), unit: 's⁻²', m1, m2, a, b,
          sol: R`The sum of the $\omega^2$ is the trace of $M^{-1}K$: $${a}/${m1} + ${b}/${m2} = ${answer}$ s⁻².`,
          trap: 'Divide each diagonal stiffness by its own mass.' };
      },
      verify: (p) => p.a / p.m1 + p.b / p.m2 },
    { id: 'nm-r5g2', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'determinant rule',
      make(r) {
        const m1 = int(r, 1, 4), m2 = int(r, 1, 4), c = int(r, 1, 4), a = c + int(r, 1, 6), b = c + int(r, 1, 6);
        const answer = round(Math.sqrt((a * b - c * c) / (m1 * m2)), 4);
        return { q: R`A system has $M = \mathrm{diag}(${m1}, ${m2})$ and $K = \begin{pmatrix}${a} & -${c}\\ -${c} & ${b}\end{pmatrix}$ (SI units). Find the product $\omega_1\omega_2$ of its normal-mode angular frequencies in s⁻².`,
          answer, tol: Math.max(0.01, answer * 0.01), unit: 's⁻²', m1, m2, a, b, c,
          sol: R`$\omega_1^2\omega_2^2 = \det K/\det M = (${a * b} - ${c * c})/${m1 * m2}$, so $\omega_1\omega_2 = ${answer}$ s⁻².`,
          trap: 'The determinant gives the product of the squares.' };
      },
      verify: (p) => Math.sqrt((p.a * p.b - p.c * p.c) / (p.m1 * p.m2)) },
    { id: 'nm-r5g3', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Rayleigh quotient',
      make(r) {
        const c = choose(r, [1, 1.2, 1.4, 1.5, 2]), km = int(r, 2, 20);
        const rho = (4 + 2 * c * c - 4 * c) / (2 + c * c), answer = round(rho * km, 3);
        return { q: R`Three equal masses sit in a line between two walls, joined by four identical springs, with $k/m = ${km}$ s⁻². Using the trial shape $(1, ${c}, 1)$ in the Rayleigh quotient, estimate the lowest $\omega^2$ in s⁻².`,
          answer, tol: Math.max(0.01, answer * 0.01), unit: 's⁻²', c, km,
          sol: R`With $K = k\,\mathrm{tridiag}(-1, 2, -1)$: $\mathbf x^TK\mathbf x = k(4 + 2c^2 - 4c)$ and $\mathbf x^TM\mathbf x = m(2 + c^2)$ for $\mathbf x = (1, c, 1)$, $c = ${c}$. So $\rho = ${round(rho, 4)}\times${km} = ${answer}$ s⁻² (exact lowest: $${round((2 - Math.SQRT2) * km, 3)}$ s⁻²).`,
          trap: 'The estimate is never below the true lowest value.' };
      },
      verify: (p) => (4 + 2 * p.c * p.c - 4 * p.c) / (2 + p.c * p.c) * p.km },
  ],
};
