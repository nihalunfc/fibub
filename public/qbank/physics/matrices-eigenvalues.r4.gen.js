// Round 4 extras for matrices-eigenvalues: original questions, written 2026-11-22.
import { int, choose, mcqOptions, round } from '../_util.js';
const R = String.raw;

const mul = (A, B) => A.map((row, i) => B[0].map((_, j) => row.reduce((s, _x, k) => s + A[i][k] * B[k][j], 0)));
const det3 = (M) => M[0][0] * (M[1][1] * M[2][2] - M[1][2] * M[2][1]) - M[0][1] * (M[1][0] * M[2][2] - M[1][2] * M[2][0]) + M[0][2] * (M[1][0] * M[2][1] - M[1][1] * M[2][0]);

export default {
  items: [
    { id: 'mev-r4-01', type: 'mcq', level: 1, exams: ['jam', 'gate'], sub: 'eigenvalues',
      q: R`The eigenvalues of $\begin{pmatrix}2 & 5\\ 0 & -3\end{pmatrix}$ are`,
      options: [R`$2$ and $5$`, R`$2$ and $-3$`, R`$5$ and $-3$`, R`$-1$ and $5$`], answer: 1,
      sol: R`For a triangular matrix, $\det(A - \lambda I) = (2 - \lambda)(-3 - \lambda)$, so the eigenvalues are the diagonal entries, 2 and $-3$. Check: their sum $-1$ is the trace and their product $-6$ is the determinant.`,
      trap: R`The off-diagonal 5 does not appear among the eigenvalues of a triangular matrix.` },
    { id: 'mev-r4-02', type: 'nat', level: 2, exams: ['jam', 'gate'], sub: 'functions of matrices', format: 'integer',
      q: R`A $3\times3$ matrix $A$ has eigenvalues $1$, $2$ and $-1$. The value of $\det(A^2 + I)$ is ______.`,
      answer: 20, tol: 0, calc: () => [1, 2, -1].reduce((p, l) => p * (l * l + 1), 1),
      sol: R`If $A\vec x = \lambda\vec x$ then $(A^2 + I)\vec x = (\lambda^2 + 1)\vec x$, so $A^2 + I$ has eigenvalues $2, 5, 2$. The determinant is their product, $20$.`,
      trap: R`$\det(A^2) + \det(I) = 4 + 1 = 5$: the determinant is not additive.` },
    { id: 'mev-r4-03', type: 'mcq', level: 2, exams: ['jam', 'gate'], sub: 'Cayley-Hamilton',
      q: R`For $A = \begin{pmatrix}1 & 2\\ 3 & 4\end{pmatrix}$, the Cayley-Hamilton theorem gives`,
      options: [R`$A^2 = 5A - 2I$`, R`$A^2 = 4A + 2I$`, R`$A^2 = -5A + 2I$`, R`$A^2 = 5A + 2I$`], answer: 3,
      sol: R`A $2\times2$ matrix satisfies $A^2 - (\text{tr}A)A + (\det A)I = 0$. Here $\text{tr}A = 5$ and $\det A = 4 - 6 = -2$, so $A^2 - 5A - 2I = 0$, i.e. $A^2 = 5A + 2I$. Check: $A^2 = \begin{pmatrix}7 & 10\\ 15 & 22\end{pmatrix} = 5A + 2I$.`,
      trap: R`Sign slip with the negative determinant gives $5A - 2I$.` },
    { id: 'mev-r4-04', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'special matrices', format: 'integer',
      q: R`The $4\times4$ matrix with every diagonal entry 3 and every off-diagonal entry 1 has determinant ______.`,
      answer: 48, tol: 0, calc: () => 6 * 2 * 2 * 2,
      sol: R`The matrix is $2I + J$, where $J$ is the all-ones matrix. $J$ has rank 1 with eigenvalues $4, 0, 0, 0$ (eigenvector $(1,1,1,1)$ for 4). So the matrix has eigenvalues $6, 2, 2, 2$ and determinant $6\cdot8 = 48$.`,
      trap: R`Multiplying the diagonal ($3^4 = 81$) ignores the off-diagonal entries.` },
    { id: 'mev-r4-05', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'Hermitian matrices',
      q: R`An eigenvector of $H = \begin{pmatrix}1 & i\\ -i & 1\end{pmatrix}$ with eigenvalue 2 is`,
      options: [R`$(1, i)^{\mathsf T}$`, R`$(1, -i)^{\mathsf T}$`, R`$(1, 1)^{\mathsf T}$`, R`$(1, -1)^{\mathsf T}$`], answer: 1,
      sol: R`$\text{tr}H = 2$ and $\det H = 1 - (i)(-i) = 1 - 1 = 0$, so the eigenvalues are 0 and 2. For 2: $(H - 2I)\vec x = 0$ gives $-x_1 + ix_2 = 0$, so $x_2 = -ix_1$: $(1, -i)$. Check: $H(1, -i)^{\mathsf T} = (1 + 1,\ -i - i) = 2(1, -i)$. The vector $(1, i)$ is the eigenvector for 0, orthogonal to it as it must be for a Hermitian matrix.`,
      trap: R`$i\cdot(-i) = +1$, not $-1$; getting the determinant wrong spoils the eigenvalues.` },
    { id: 'mev-r4-06', type: 'msq', level: 2, exams: ['jam', 'gate'], sub: 'similarity',
      q: R`$B = P^{-1}AP$ for an invertible $P$. Which properties must $A$ and $B$ share?`,
      options: [R`The same eigenvalues`, R`The same eigenvectors`, R`The same rank`, R`If $A$ is symmetric, so is $B$`], answer: [0, 2],
      sol: R`$\det(B - \lambda I) = \det(P^{-1}(A - \lambda I)P) = \det(A - \lambda I)$: same characteristic polynomial, so same eigenvalues (and trace and determinant). Multiplying by invertible matrices does not change rank. But if $A\vec x = \lambda\vec x$ then $B(P^{-1}\vec x) = \lambda P^{-1}\vec x$: the eigenvectors are transformed by $P^{-1}$, not shared. Symmetry survives only for orthogonal $P$ ($P^{-1} = P^{\mathsf T}$): for example $A = \text{diag}(1, 2)$ and the shear $P = \begin{pmatrix}1 & 1\\ 0 & 1\end{pmatrix}$ give $P^{-1}AP = \begin{pmatrix}1 & -1\\ 0 & 2\end{pmatrix}$, which is not symmetric.`,
      trap: R`Similar matrices describe the same map in different bases: basis-free things (eigenvalues, rank) agree; components (eigenvector entries, symmetry) need not.` },
    { id: 'mev-r4-07', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'characteristic polynomial', format: 'integer',
      q: R`The companion matrix $M = \begin{pmatrix}0 & 1 & 0\\ 0 & 0 & 1\\ a & b & c\end{pmatrix}$ has eigenvalues $1$, $-1$ and $2$. The value of $a$ is ______.`,
      answer: -2, tol: 0, calc: () => 1 * -1 * 2,
      sol: R`Expanding, $\det(\lambda I - M) = \lambda^3 - c\lambda^2 - b\lambda - a$. With eigenvalues $1, -1, 2$ it must equal $(\lambda - 1)(\lambda + 1)(\lambda - 2) = \lambda^3 - 2\lambda^2 - \lambda + 2$. Matching: $c = 2$, $b = 1$, $-a = 2$, so $a = -2$. Check: $\det M = a$ (expand along the first column) and the product of the eigenvalues is $-2$.`,
      trap: R`Matching the constant term with the wrong sign gives $a = 2$; $\det M = a$ settles it.` },
    { id: 'mev-r4-08', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Gershgorin discs',
      q: R`For $A = \begin{pmatrix}10 & 1 & 1\\ 1 & -5 & 1\\ 0 & 1 & 2\end{pmatrix}$, Gershgorin's theorem (row discs) by itself rules out exactly one of these numbers as an eigenvalue. Which?`,
      options: [R`$11$`, R`$-4$`, R`$5$`, R`$2.5$`], answer: 2,
      sol: R`Every eigenvalue lies in a disc centred on a diagonal entry with radius equal to the sum of the other absolute entries in that row: centre 10, radius 2 ($[8, 12]$ on the real line); centre $-5$, radius 2 ($[-7, -3]$); centre 2, radius 1 ($[1, 3]$). The values 11, $-4$ and 2.5 sit inside discs; 5 lies in none, so it cannot be an eigenvalue. (The discs are disjoint, so each holds exactly one eigenvalue.)`,
      trap: R`Gershgorin says where eigenvalues may be, not that every point of a disc is one.` },
    { id: 'mev-r4-09', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'nilpotent matrices', format: 'statements',
      q: R`A $3\times3$ matrix $N$ satisfies $N^3 = 0$ but $N^2\ne0$. Which statements are true?`,
      options: [R`Every eigenvalue of $N$ is 0`, R`$N$ is diagonalisable`, R`$(I + N)^{-1} = I - N + N^2$`, R`The rank of $N$ is 1`], answer: [0, 2],
      sol: R`If $N\vec x = \lambda\vec x$ then $0 = N^3\vec x = \lambda^3\vec x$, so $\lambda = 0$. A diagonalisable matrix with all eigenvalues 0 is the zero matrix, so $N$ is not diagonalisable. $(I + N)(I - N + N^2) = I + N^3 = I$. $N^2\ne0$ with $N^3 = 0$ means a single Jordan block of size 3, whose rank is 2 (rank 1 would force $N^2 = 0$).`,
      trap: R`The geometric series $1 - x + x^2 - \dots$ stops for nilpotent matrices; no convergence question arises.` },
    { id: 'mev-r4-10', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'functions of matrices',
      q: R`A real symmetric $3\times3$ matrix $S$ has eigenvalues $1, 4, 9$. How many real SYMMETRIC matrices $X$ satisfy $X^2 = S$?`,
      options: [R`$8$`, R`$1$`, R`$2$`, R`$6$`], answer: 0,
      sol: R`$X$ commutes with $X^2 = S$. Since $S$ has three distinct eigenvalues, anything commuting with it is diagonal in $S$'s eigenbasis, so $X = \text{diag}(\pm1, \pm2, \pm3)$ there. Every sign choice works: $2^3 = 8$ matrices. Exactly one of them (all signs $+$) is positive definite, the principal square root.`,
      trap: R`Uniqueness holds only for the positive-definite square root; the question allows any symmetric one.` },
    { id: 'mev-r4-11', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'singular values',
      q: R`The largest singular value (the operator 2-norm) of $A = \begin{pmatrix}1 & 1\\ 0 & 1\end{pmatrix}$ is ______ (three decimal places).`,
      answer: 1.618, tol: 0.002, calc: () => (1 + Math.sqrt(5)) / 2,
      sol: R`Singular values are square roots of the eigenvalues of $A^{\mathsf T}A = \begin{pmatrix}1 & 1\\ 1 & 2\end{pmatrix}$: trace 3, determinant 1, so $\mu = \frac{3\pm\sqrt5}{2}$. The largest singular value is $\sqrt{\frac{3 + \sqrt5}{2}} = \frac{1 + \sqrt5}{2}\approx1.618$ (square it to check).`,
      trap: R`Both eigenvalues of $A$ are 1, but $A$ is not normal, so its eigenvalues do not give its norm: it stretches $(1, 1)$ by more than 1.` },
    { id: 'mev-r4-12', type: 'msq', level: 3, exams: ['jam', 'gate'], sub: 'matrix exponential', format: 'statements',
      q: R`For $A = \begin{pmatrix}0 & -2\\ 2 & 0\end{pmatrix}$, which statements are true?`,
      options: [R`Its eigenvalues are $\pm2i$`, R`$A$ is normal ($AA^{\mathsf T} = A^{\mathsf T}A$)`, R`$e^{A\pi/2} = -I$`, R`$A$ can be diagonalised by a real invertible matrix`], answer: [0, 1, 2],
      sol: R`$\lambda^2 + 4 = 0$ gives $\pm2i$. $AA^{\mathsf T} = 4I = A^{\mathsf T}A$, so it is normal (it is antisymmetric). $e^{A\theta}$ is the rotation by angle $2\theta$; at $\theta = \pi/2$ it rotates by $\pi$, which is $-I$. Complex eigenvalues cannot appear on the diagonal of a real matrix, so no real similarity diagonalises it (a complex one does).`,
      trap: R`Diagonalisable over $\mathbb C$ is not the same as over $\mathbb R$.` },
  ],
  gens: [
    { id: 'mev-r4g1', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Gershgorin discs',
      make(r) {
        const c1 = int(r, -9, -6), c2 = int(r, 0, 1), c3 = int(r, 7, 10);
        const a = choose(r, [-1, 1]), b = choose(r, [-1, 1]), c = choose(r, [-1, 1]);
        const out = choose(r, [-3, 4]);
        const m = mcqOptions(r, out, [c1 + 1, c2 - 1, c3 - 1], (v) => `$${v}$`);
        return { q: R`The real symmetric matrix $\begin{pmatrix}${c1} & ${a} & ${b}\\ ${a} & ${c2} & ${c}\\ ${b} & ${c} & ${c3}\end{pmatrix}$ is given. Gershgorin's theorem alone rules out exactly one of these numbers as an eigenvalue. Which?`, ...m,
          sol: R`Each row gives a disc centred on its diagonal entry with radius equal to the sum of the absolute values of the other entries: here every radius is 2. Being symmetric, the matrix has real eigenvalues, so the discs become intervals $[${c1 - 2}, ${c1 + 2}]$, $[${c2 - 2}, ${c2 + 2}]$ and $[${c3 - 2}, ${c3 + 2}]$. The intervals are disjoint, so each holds exactly one eigenvalue. The value ${out} lies in none of them, so it cannot be an eigenvalue; the other options lie inside an interval and are not excluded.`,
          trap: 'A value inside a disc is allowed, not guaranteed; only values outside every disc are ruled out.' };
      } },
    { id: 'mev-r4g2', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'functions of matrices',
      make(r) {
        const L = [int(r, -2, 3), int(r, -3, 2), int(r, 1, 4)], k = int(r, -3, 3), mm = int(r, 1, 4), kind = choose(r, ['det', 'tr']);
        const pv = L.map((l) => l * l + k * l + mm), v = kind === 'det' ? pv[0] * pv[1] * pv[2] : pv[0] + pv[1] + pv[2];
        const poly = `A^2${k === 0 ? '' : k > 0 ? ` + ${k === 1 ? '' : k}A` : ` - ${k === -1 ? '' : -k}A`} + ${mm === 1 ? '' : mm}I`;
        return { q: R`A $3\times3$ matrix $A$ has eigenvalues $${L.join('$, $')}$. The value of $\text{${kind}}\,(${poly})$ is ______.`,
          answer: v, tol: 0, L, k, mm, kind,
          sol: R`For each eigenvalue $\lambda$ of $A$, $p(A) = ${poly}$ has eigenvalue $p(\lambda) = ${poly.replace(/A/g, '\\lambda').replace(/ \+ (\d*)I$/, (_, n) => ` + ${n || 1}`)}$: here $${pv.join(', ')}$. The ${kind === 'det' ? 'determinant is their product' : 'trace is their sum'}: ${v}.`,
          trap: kind === 'det' ? 'The determinant of a sum is not the sum of determinants; work eigenvalue by eigenvalue.' : 'The trace of $A^2$ is the sum of $\\lambda^2$, not $(\\text{tr}A)^2$.' };
      },
      verify: (p) => {
        const T = [[p.L[0], 1, 2], [0, p.L[1], -1], [0, 0, p.L[2]]], T2 = mul(T, T);
        const P = T2.map((row, i) => row.map((x, j) => x + p.k * T[i][j] + (i === j ? p.mm : 0)));
        return p.kind === 'det' ? det3(P) : P[0][0] + P[1][1] + P[2][2];
      } },
    { id: 'mev-r4g3', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'Cayley-Hamilton',
      make(r) {
        const a = int(r, -2, 3), b = choose(r, [-2, -1, 1, 2, 3]), c = int(r, -2, 2), d = int(r, -1, 3), ask = choose(r, ['alpha', 'beta']);
        const t = a + d, D = a * d - b * c, al = t * t - D, be = -t * D;
        return { q: R`By the Cayley-Hamilton theorem, $A = \begin{pmatrix}${a} & ${b}\\ ${c} & ${d}\end{pmatrix}$ satisfies $A^3 = \alpha A + \beta I$. The value of $${ask === 'alpha' ? '\\alpha' : '\\beta'}$ is ______.`,
          answer: ask === 'alpha' ? al : be, tol: 0, a, b, c, d, ask,
          sol: R`$\text{tr}A = ${t}$ and $\det A = ${D}$, so $A^2 = ${t}A - (${D})I$. Multiply by $A$: $A^3 = ${t}A^2 - (${D})A = ${t}\big(${t}A - (${D})I\big) - (${D})A = (${t * t} - (${D}))A - ${t}\cdot(${D})I$. So $\alpha = ${al}$ and $\beta = ${be}$.`,
          trap: 'Stopping at $A^2 = (\\text{tr}A)A - (\\det A)I$ and forgetting to substitute it again for the $A^2$ term in $A^3$.' };
      },
      verify: (p) => {
        const A = [[p.a, p.b], [p.c, p.d]], A3 = mul(mul(A, A), A), al = A3[0][1] / p.b;
        return p.ask === 'alpha' ? al : A3[0][0] - al * p.a;
      } },
  ],
};
