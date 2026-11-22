// Round 5 extras for matrices-eigenvalues: original questions, written 2026-11-22.
import { int, choose, mcqOptions, round } from '../_util.js';
const R = String.raw;

export default {
  items: [
    { id: 'mev-r5-01', type: 'mcq', level: 1, exams: ['jam'], sub: 'eigenvalues',
      q: R`The eigenvalues of $\begin{pmatrix}4 & 1\\ 2 & 3\end{pmatrix}$ are`,
      options: [R`$4$ and $3$`, R`$6$ and $1$`, R`$5$ and $2$`, R`$-5$ and $-2$`], answer: 2,
      sol: R`For a $2\times2$ matrix the eigenvalues add to the trace ($4 + 3 = 7$) and multiply to the determinant ($12 - 2 = 10$). The pair with sum 7 and product 10 is $5$ and $2$. Check: $\lambda^2 - 7\lambda + 10 = (\lambda - 5)(\lambda - 2)$.`,
      trap: R`The diagonal entries are the eigenvalues only for a triangular matrix.` },
    { id: 'mev-r5-02', type: 'nat', level: 2, exams: ['jam'], sub: 'functions of matrices',
      q: R`A $3\times3$ matrix $A$ has eigenvalues $1$, $-2$ and $3$. The trace of $A^2 + A$ is ______.`,
      answer: 16, tol: 0, calc: () => [1, -2, 3].reduce((s, l) => s + l * l + l, 0),
      sol: R`If $A\vec v = \lambda\vec v$ then $(A^2 + A)\vec v = (\lambda^2 + \lambda)\vec v$, so the eigenvalues of $A^2 + A$ are $2$, $2$ and $12$. The trace is their sum: $16$.`,
      trap: R`Squaring the trace ($2^2 = 4$) and adding the trace gives 6: the trace of $A^2$ is the sum of $\lambda^2$, not the square of the sum.` },
    { id: 'mev-r5-03', type: 'mcq', level: 2, exams: ['jam', 'gate'], sub: 'hermitian matrices',
      q: R`The eigenvalues of the Hermitian matrix $\begin{pmatrix}2 & 1 - i\\ 1 + i & 3\end{pmatrix}$ are`,
      options: [R`$1$ and $4$`, R`$2$ and $3$`, R`$\tfrac{5\pm\sqrt{17}}{2}$`, R`$1 \pm i$`], answer: 0,
      sol: R`Trace $= 5$; determinant $= 6 - (1 - i)(1 + i) = 6 - 2 = 4$. So $\lambda^2 - 5\lambda + 4 = 0$, giving $\lambda = 1, 4$. Both real, as they must be for a Hermitian matrix.`,
      trap: R`Treating the off-diagonal product as $(1 - i)^2$ or $1 + 1$ with signs mixed gives $\tfrac{5\pm\sqrt{17}}{2}$; complex eigenvalues are impossible for a Hermitian matrix.` },
    { id: 'mev-r5-04', type: 'msq', level: 3, exams: ['jam', 'gate'], sub: 'orthogonal matrices', format: 'statements',
      q: R`$R = \begin{pmatrix}0 & -1 & 0\\ 1 & 0 & 0\\ 0 & 0 & 1\end{pmatrix}$ rotates vectors by $90^\circ$ about the $z$-axis. Which statements are true?`,
      options: [R`Its eigenvalues are $1$, $i$ and $-i$`, R`$R^4 = I$`, R`$R$ is Hermitian`, R`$\text{tr}\,R = 1$`], answer: [0, 1, 3],
      sol: R`The $z$-axis is unchanged, giving eigenvalue 1. The $2\times2$ block $\begin{pmatrix}0 & -1\\ 1 & 0\end{pmatrix}$ has $\lambda^2 + 1 = 0$, so $\pm i$. Four quarter-turns make a full turn: $R^4 = I$. $R^{\mathsf T}\ne R$ (it is orthogonal, $R^{\mathsf T} = R^{-1}$), so it is not Hermitian. Trace $= 0 + 0 + 1 = 1 = 1 + i - i$. (General rule: $\text{tr}R = 1 + 2\cos\theta$.)`,
      trap: R`Real matrices can have complex eigenvalues; only real symmetric (Hermitian) ones are guaranteed real.` },
    { id: 'mev-r5-05', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'functions of matrices',
      q: R`For $A = \begin{pmatrix}1 & 2\\ 2 & 1\end{pmatrix}$, the value of $\text{tr}\,e^{A}$ is ______ (two decimal places).`,
      answer: 20.45, tol: 0.02, calc: () => Math.exp(3) + Math.exp(-1),
      sol: R`The eigenvalues of $A$ are $1\pm2$: $3$ and $-1$. The eigenvalues of $e^A$ are $e^3$ and $e^{-1}$, so $\text{tr}\,e^A = e^3 + e^{-1}\approx20.086 + 0.368 = 20.45$.`,
      trap: R`Exponentiating entry by entry gives $2e\approx5.44$ for the trace, which is not the matrix exponential.` },
    { id: 'mev-r5-06', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'diagonalisation',
      q: R`Which of these matrices is NOT diagonalisable?`,
      options: [R`$\begin{pmatrix}1 & 1\\ 0 & 2\end{pmatrix}$`, R`$\begin{pmatrix}1 & 1\\ 1 & 1\end{pmatrix}$`, R`$\begin{pmatrix}1 & 1\\ 0 & 1\end{pmatrix}$`, R`$\begin{pmatrix}0 & 1\\ 1 & 0\end{pmatrix}$`], answer: 2,
      sol: R`Distinct eigenvalues guarantee diagonalisability: the first has 1 and 2. The second and fourth are real symmetric, so they are diagonalisable. The third has the repeated eigenvalue 1, and $A - I = \begin{pmatrix}0 & 1\\ 0 & 0\end{pmatrix}$ has rank 1, so there is only one independent eigenvector: it is a Jordan block and cannot be diagonalised.`,
      trap: R`A repeated eigenvalue alone is not the test (the identity has one too); count the independent eigenvectors.` },
    { id: 'mev-r5-07', type: 'mcq', level: 4, exams: ['jam', 'gate'], sub: 'cayley hamilton',
      q: R`A real $2\times2$ matrix $A$, not a multiple of $I$, satisfies $A^2 = A + 2I$. Then $(\text{tr}A, \det A)$ is`,
      options: [R`$(1, 2)$`, R`$(1, -2)$`, R`$(-1, -2)$`, R`$(3, 2)$`], answer: 1,
      sol: R`Every eigenvalue obeys $\lambda^2 = \lambda + 2$, so $\lambda\in\{2, -1\}$. If both eigenvalues were equal, the polynomial $x^2 - x - 2$ (which has distinct roots, so $A$ is diagonalisable) would force $A = 2I$ or $A = -I$, a multiple of $I$. So the eigenvalues are $2$ and $-1$: trace 1, determinant $-2$. This matches Cayley-Hamilton, $A^2 - (\text{tr}A)A + (\det A)I = 0$.`,
      trap: R`Reading $\det A = +2$ from $A^2 = A + 2I$ misses the sign: Cayley-Hamilton has $+\det A$ on the left, so $\det A = -2$.` },
    { id: 'mev-r5-08', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'eigenvectors',
      q: R`The number of linearly independent eigenvectors of $\begin{pmatrix}2 & 1 & 0\\ 0 & 2 & 0\\ 0 & 0 & 2\end{pmatrix}$ is ______.`,
      answer: 2, tol: 0, calc: () => 3 - 1,
      sol: R`The only eigenvalue is 2 (triple). Eigenvectors solve $(A - 2I)\vec v = 0$ with $A - 2I = \begin{pmatrix}0 & 1 & 0\\ 0 & 0 & 0\\ 0 & 0 & 0\end{pmatrix}$, which has rank 1. The null space has dimension $3 - 1 = 2$ (spanned by $(1, 0, 0)$ and $(0, 0, 1)$). So 2 independent eigenvectors: a $2\times2$ Jordan block plus a $1\times1$ block.`,
      trap: R`Counting the algebraic multiplicity (3) instead of the geometric one.` },
    { id: 'mev-r5-09', type: 'msq', level: 5, exams: ['gate', 'net'], sub: 'products', format: 'statements',
      q: R`For square matrices $A$ and $B$ of the same size, which statements are ALWAYS true?`,
      options: [R`$\text{tr}(AB) = \text{tr}(BA)$`, R`$\det(AB) = \det(BA)$`, R`$AB$ and $BA$ have the same eigenvalues, with the same algebraic multiplicities`, R`$AB$ and $BA$ are similar matrices`], answer: [0, 1, 2],
      sol: R`Trace: $\sum_{ij}A_{ij}B_{ji}$ is symmetric in the roles of $A$ and $B$. Determinant: both equal $\det A\det B$. Eigenvalues: $AB$ and $BA$ have the same characteristic polynomial (true even when both are singular). Similarity can fail: $A = \begin{pmatrix}0 & 1\\ 0 & 0\end{pmatrix}$, $B = \begin{pmatrix}1 & 0\\ 0 & 0\end{pmatrix}$ give $AB = 0$ but $BA = \begin{pmatrix}0 & 1\\ 0 & 0\end{pmatrix}\ne0$, and only 0 is similar to 0.`,
      trap: R`Same characteristic polynomial does not mean same Jordan form; if $A$ or $B$ is invertible, then $AB = A(BA)A^{-1}$ and they are similar.` },
    { id: 'mev-r5-10', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'matrix powers',
      q: R`For $A = \begin{pmatrix}3 & 1\\ 1 & 3\end{pmatrix}$, the top-right entry of $A^5$ is ______.`,
      answer: 496, tol: 0, calc: () => (4 ** 5 - 2 ** 5) / 2,
      sol: R`Eigenvectors $(1, 1)/\sqrt2$ (eigenvalue 4) and $(1, -1)/\sqrt2$ (eigenvalue 2). So $A^n = \frac{4^n}{2}\begin{pmatrix}1 & 1\\ 1 & 1\end{pmatrix} + \frac{2^n}{2}\begin{pmatrix}1 & -1\\ -1 & 1\end{pmatrix}$, whose top-right entry is $\frac{4^n - 2^n}{2}$. For $n = 5$: $\frac{1024 - 32}{2} = 496$.`,
      trap: R`Raising the entries to the fifth power gives 1, nothing like the matrix power.` },
  ],
  gens: [
    { id: 'mev-r5g1', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'matrix powers',
      make(r) {
        const a = int(r, 1, 4), b = int(r, 1, 3), n = int(r, 2, 5);
        const v = ((a + b) ** n - (a - b) ** n) / 2;
        return { q: R`For $A = \begin{pmatrix}${a} & ${b}\\ ${b} & ${a}\end{pmatrix}$, find the top-right entry of $A^{${n}}$.`,
          answer: v, tol: 0, a, b, n,
          sol: R`The eigenvalues are $${a}\pm${b}$, i.e. $${a + b}$ (eigenvector $(1, 1)$) and $${a - b}$ (eigenvector $(1, -1)$). Then $A^n = \tfrac{${a + b}^n}{2}\begin{pmatrix}1 & 1\\ 1 & 1\end{pmatrix} + \tfrac{(${a - b})^n}{2}\begin{pmatrix}1 & -1\\ -1 & 1\end{pmatrix}$, so the top-right entry is $\dfrac{${a + b}^{${n}} - (${a - b})^{${n}}}{2} = ${v}$.`,
          trap: 'Powering each entry separately is not matrix multiplication.' };
      },
      verify: (p) => { let M = [[1, 0], [0, 1]]; const A = [[p.a, p.b], [p.b, p.a]]; for (let k = 0; k < p.n; k++) M = [[M[0][0] * A[0][0] + M[0][1] * A[1][0], M[0][0] * A[0][1] + M[0][1] * A[1][1]], [M[1][0] * A[0][0] + M[1][1] * A[1][0], M[1][0] * A[0][1] + M[1][1] * A[1][1]]]; return M[0][1]; } },
    { id: 'mev-r5g2', type: 'mcq', level: 4, exams: ['jam', 'gate'], sub: 'cayley hamilton',
      make(r) {
        const l1 = choose(r, [-3, -2, -1, 1, 2, 3, 4]), d0 = int(r, 1, 4), l2 = l1 - d0 === 0 ? l1 - 5 : l1 - d0;
        const p = l1 + l2, q = -l1 * l2;
        const term = (c, s) => (c === 0 ? '' : `${c > 0 ? ' + ' : ' - '}${Math.abs(c) === 1 && s ? '' : Math.abs(c)}${s}`);
        const rhs = (term(p, 'A') + term(q, 'I')).replace(/^ \+ /, '').replace(/^ - /, '-') || '0';
        const o = mcqOptions(r, l1 * l2, [-l1 * l2, p, l1 * l1 + l2 * l2, -p], (v) => `$${v}$`);
        return { q: R`A real $2\times2$ matrix $A$, not a multiple of $I$, satisfies $A^2 = ${rhs}$. Then $\det A$ equals`, ...o,
          sol: R`Each eigenvalue obeys $\lambda^2 = ${rhs.replace(/A/g, '\\lambda').replace(/(\d*)I/g, (m, c) => c || '1')}$, i.e. $\lambda^2 - (${p})\lambda - (${q}) = 0$, with roots $${l1}$ and $${l2}$. These roots are distinct, so if both eigenvalues were the same root $A$ would be that multiple of $I$. Hence the eigenvalues are $${l1}$ and $${l2}$, and $\det A = ${l1}\times(${l2}) = ${l1 * l2}$ (trace $${p}$).`,
          trap: 'Reading the determinant straight off the constant term forgets the sign in Cayley-Hamilton, $A^2 - (\\text{tr}A)A + (\\det A)I = 0$.' };
      } },
    { id: 'mev-r5g3', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'principal axes',
      make(r) {
        const d = int(r, -2, 2), a = d + int(r, 1, 4), b = choose(r, [-3, -2, -1, 1, 2, 3]);
        const th = 0.5 * Math.atan(2 * b / (a - d)) * 180 / Math.PI;
        return { q: R`The real symmetric matrix $\begin{pmatrix}${a} & ${b}\\ ${b} & ${d}\end{pmatrix}$ has an eigenvector for its LARGER eigenvalue at angle $\theta$ to the $x$-axis, with $-90^\circ < \theta \le 90^\circ$. Find $\theta$ in degrees (one decimal place).`,
          answer: round(th, 1), tol: 0.1, a, b, d,
          sol: R`Rotating the axes by $\theta$ removes the off-diagonal entry when $\tan2\theta = \dfrac{2b}{a - d} = \dfrac{${2 * b}}{${a - d}}$. Since $a > d$, the root with $|\theta| < 45^\circ$ points along the larger eigenvalue's eigenvector: $\theta = \tfrac12\arctan(${round(2 * b / (a - d), 4)})\approx${round(th, 1)}^\circ$. Check: the larger eigenvalue is $\lambda = \tfrac{${a + d}}{2} + \sqrt{\left(\tfrac{${a - d}}{2}\right)^2 + ${b * b}}$ and its eigenvector $(\lambda - ${d}, ${b})$ makes the same angle.`,
          trap: 'The other root of $\\tan2\\theta$ (shifted by $90^\\circ$) is the eigenvector of the smaller eigenvalue.' };
      },
      verify: (p) => { const lam = (p.a + p.d) / 2 + Math.sqrt(((p.a - p.d) / 2) ** 2 + p.b * p.b); return Math.atan(p.b / (lam - p.d)) * 180 / Math.PI; } },
  ],
};
