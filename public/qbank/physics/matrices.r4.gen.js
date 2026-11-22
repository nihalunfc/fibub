// Round 4 extras for matrices: original questions, written 2026-11-22.
import { pick, int, choose, round } from '../_util.js';
const R = String.raw;

export default {
  items: [
    { id: 'mx-r4-01', type: 'mcq', level: 1, exams: ['jam'], sub: 'inverse',
      q: R`Which of these matrices has no inverse?`,
      options: [R`$\begin{pmatrix} 2 & 6 \\ 1 & 4 \end{pmatrix}$`, R`$\begin{pmatrix} 0 & 1 \\ 1 & 0 \end{pmatrix}$`, R`$\begin{pmatrix} 2 & 6 \\ 1 & 3 \end{pmatrix}$`, R`$\begin{pmatrix} 1 & -3 \\ 3 & 1 \end{pmatrix}$`], answer: 2,
      sol: R`A square matrix is invertible exactly when its determinant is non-zero. The determinants are $8 - 6 = 2$, $0 - 1 = -1$, $6 - 6 = 0$ and $1 + 9 = 10$. Only the third is singular: its first row is twice its second.`,
      trap: R`A zero on the diagonal does not make a matrix singular; only a zero determinant does.` },
    { id: 'mx-r4-02', type: 'nat', level: 2, exams: ['jam'], sub: 'determinants',
      q: R`Square matrices $A$ and $B$ of the same size have $\det A = 2$ and $\det B = -3$. The value of $\det(A^2B^T)$ is ______.`,
      answer: -12, tol: 0, calc: () => 2 * 2 * -3,
      sol: R`The determinant of a product is the product of determinants, and transposing does not change a determinant: $\det(A^2B^T) = (\det A)^2\det B = 4\times(-3) = -12$.`,
      trap: R`$\det B^T = \det B$, not $1/\det B$ (that is $B^{-1}$).` },
    { id: 'mx-r4-03', type: 'mcq', level: 2, exams: ['jam'], sub: 'orthogonal matrices',
      q: R`The $2\times2$ matrix that reflects every vector of the plane in the line $y = x$ is`,
      options: [R`$\begin{pmatrix} 0 & 1 \\ 1 & 0 \end{pmatrix}$`, R`$\begin{pmatrix} 0 & -1 \\ 1 & 0 \end{pmatrix}$`, R`$\begin{pmatrix} 1 & 0 \\ 0 & -1 \end{pmatrix}$`, R`$\begin{pmatrix} 0 & -1 \\ -1 & 0 \end{pmatrix}$`], answer: 0,
      sol: R`Reflection in $y = x$ swaps the coordinates: $(x, y)\to(y, x)$, so the columns are the images of $\hat i\to\hat j$ and $\hat j\to\hat i$. It has eigenvalue $+1$ along $(1, 1)$ (on the mirror) and $-1$ along $(1, -1)$, and determinant $-1$, as every reflection does. The second option is a $90^\circ$ rotation, the third a reflection in the $x$-axis, the fourth a reflection in $y = -x$.`,
      trap: R`A rotation has determinant $+1$; a reflection has $-1$.` },
    { id: 'mx-r4-04', type: 'msq', level: 3, exams: ['jam'], sub: 'rank', format: 'statements',
      q: R`For $\vec v = (1, 2, 2)^T$, let $P = \dfrac{\vec v\,\vec v^{\,T}}{\vec v^{\,T}\vec v}$ (a $3\times3$ matrix). Which statements are true?`,
      options: [R`$P^2 = P$`, R`$\operatorname{tr}P = 1$`, R`$P$ has rank 1`, R`$\det P = 1$`], answer: [0, 1, 2],
      sol: R`$P\vec w = \hat v(\hat v\cdot\vec w)$ projects any vector onto the line of $\vec v$. Projecting twice is the same as once: $P^2 = \vec v(\vec v^T\vec v)\vec v^T/(\vec v^T\vec v)^2 = P$. Its eigenvalues are 1 (along $\vec v$) and 0, 0 (perpendicular), so the trace is 1 (check: $(1 + 4 + 4)/9$), the rank is 1, and the determinant is 0.`,
      trap: R`A projection is idempotent but not invertible unless it is the identity.` },
    { id: 'mx-r4-05', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'eigenvectors',
      q: R`Each day a molecule switches between two states: from A to B with probability 0.1 and from B to A with probability 0.2, so the column vector of probabilities is multiplied by $\begin{pmatrix} 0.9 & 0.2 \\ 0.1 & 0.8 \end{pmatrix}$. In the long run the fraction of time in state A is`,
      options: [R`$\tfrac12$`, R`$\tfrac13$`, R`$0.9$`, R`$\tfrac23$`], answer: 3,
      sol: R`The steady state is the eigenvector with eigenvalue 1: $0.9a + 0.2b = a$ gives $0.1a = 0.2b$, so $a = 2b$, and with $a + b = 1$, $a = \tfrac23$. The other eigenvalue is $\operatorname{tr} - 1 = 0.7$, so any start relaxes to this state as $0.7^n$. Balance check: flow A→B is $0.1\times\tfrac23$, flow B→A is $0.2\times\tfrac13$; equal.`,
      trap: R`The state that is harder to leave (A: only 10% leave per day) holds more of the time.` },
    { id: 'mx-r4-06', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'eigenvalues',
      q: R`The circulant matrix $\begin{pmatrix} 1 & 2 & 3 \\ 3 & 1 & 2 \\ 2 & 3 & 1 \end{pmatrix}$ has one real eigenvalue and two complex ones. The modulus of each complex eigenvalue is ______ (to three decimal places).`,
      answer: 1.732, tol: 0.002, calc: () => Math.sqrt(3),
      sol: R`For a circulant with first row $(c_0, c_1, c_2)$ the eigenvectors are $(1, \omega, \omega^2)$ with $\omega^3 = 1$, and the eigenvalues are $c_0 + c_1\omega + c_2\omega^2$. With $\omega = 1$: $6$ (every row sums to 6). With $\omega = e^{2\pi i/3} = -\tfrac12 + \tfrac{\sqrt3}{2}i$: $1 + 2\omega + 3\omega^2 = -\tfrac32 - \tfrac{\sqrt3}{2}i$, of modulus $\sqrt{\tfrac94 + \tfrac34} = \sqrt3 = 1.732$; the third is its conjugate. Check: $6\times3 = 18 = \det$.`,
      trap: R`Since the matrix is not symmetric, complex eigenvalues are allowed; they come in conjugate pairs with equal modulus.` },
    { id: 'mx-r4-07', type: 'nat', level: 3, exams: ['jam'], sub: 'inverse',
      q: R`For $A = \begin{pmatrix} 1 & 2 & 0 \\ 0 & 1 & 3 \\ 0 & 0 & 1 \end{pmatrix}$, the top-right entry $(A^{-1})_{13}$ is ______.`,
      answer: 6, tol: 0, calc: () => 2 * 3 - 0,
      sol: R`Write $A = I + N$ with $N$ strictly upper triangular, so $N^3 = 0$ and $A^{-1} = I - N + N^2$. Here $N^2$ has a single non-zero entry, $(N^2)_{13} = 2\times3 = 6$, and $N_{13} = 0$. So $(A^{-1})_{13} = 0 - 0 + 6 = 6$. (Check: row 1 of $A$ times column 3 of $A^{-1} = (6, -3, 1)^T$ gives $6 - 6 + 0 = 0$.)`,
      trap: R`The inverse of a unit upper-triangular matrix is not just the off-diagonal entries with signs flipped; the $N^2$ term fills the corner.` },
    { id: 'mx-r4-08', type: 'mcq', level: 4, exams: ['jam', 'gate'], sub: 'eigenvalues',
      q: R`For $A = \begin{pmatrix} 1 & 1 \\ 0 & 1 \end{pmatrix}$, the eigenvalues of $A^TA$ are`,
      options: [R`$1$ and $1$`, R`$\dfrac{3 \pm \sqrt5}{2}$`, R`$0$ and $2$`, R`$2 \pm \sqrt2$`], answer: 1,
      sol: R`$A^TA = \begin{pmatrix} 1 & 1 \\ 1 & 2 \end{pmatrix}$, with trace 3 and determinant 1, so $\lambda^2 - 3\lambda + 1 = 0$ and $\lambda = \dfrac{3\pm\sqrt5}{2}$ (about 2.62 and 0.38). Their square roots, $\dfrac{\sqrt5\pm1}{2}$, are the singular values of $A$: the shear stretches some vectors and shrinks others even though both eigenvalues of $A$ are 1.`,
      trap: R`The eigenvalues of $A^TA$ are not the squares of the eigenvalues of $A$ unless $A$ is normal.` },
    { id: 'mx-r4-09', type: 'msq', level: 4, exams: ['jam', 'gate'], sub: 'functions of matrices', format: 'statements',
      q: R`For square matrices of the same finite size, which statements are true?`,
      options: [R`If $A$ and $B$ are Hermitian and $AB = BA$, they have a common orthonormal basis of eigenvectors`, R`If $AB = BA$, then $e^Ae^B = e^{A + B}$`, R`$\operatorname{tr}(AB - BA) = 0$ for every $A$ and $B$`, R`$AB - BA = I$ is possible for suitable $A$ and $B$`], answer: [0, 1, 2],
      sol: R`Commuting Hermitian matrices can be diagonalised together (the basis of compatible observables in quantum mechanics). When $A$ and $B$ commute, the exponential series multiply like numbers, so $e^Ae^B = e^{A+B}$. $\operatorname{tr}(AB) = \operatorname{tr}(BA)$ always, so every commutator has trace 0. Then $AB - BA = I$ would need $\operatorname{tr}I = n = 0$: impossible for finite matrices (the canonical relation $[x, p] = i\hbar$ needs infinite dimensions).`,
      trap: R`The trace argument rules out $[A, B] = I$ in any finite dimension.` },
    { id: 'mx-r4-10', type: 'nat', level: 5, exams: ['jam', 'gate'], sub: 'cayley-hamilton',
      q: R`A $3\times3$ matrix $A$ satisfies $A^2 - 5A + 6I = 0$ and has trace 7. Its determinant is ______.`,
      answer: 12, tol: 0, calc: () => 2 * 2 * 3,
      sol: R`If $A\vec v = \lambda\vec v$ then $(\lambda^2 - 5\lambda + 6)\vec v = 0$, so every eigenvalue is 2 or 3. Three of them add to 7 only as $2 + 2 + 3$ ($3 + 3 + 2 = 8$, $2 + 2 + 2 = 6$). So $\det A = 2\times2\times3 = 12$. (The polynomial has distinct roots, so $A$ is diagonalisable, e.g. $\operatorname{diag}(2, 2, 3)$.)`,
      trap: R`$6$ is the constant term of the quadratic, not the determinant of a $3\times3$ matrix.` },
  ],
  gens: [
    { id: 'mx-r4g1', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'cayley-hamilton',
      make(r) {
        const [a, b] = choose(r, [[1, 2], [2, 3], [1, 3], [-1, 2], [1, 4], [2, 5], [-2, 1], [3, 4], [-1, 3]]), n = int(r, 3, 4), k = int(r, 1, n - 1);
        const tr = k * a + (n - k) * b, answer = a ** k * b ** (n - k);
        const s = a + b, p = a * b;
        return { q: R`A $${n}\times${n}$ matrix $A$ satisfies $A^2 ${s < 0 ? '+' : '-'} ${Math.abs(s) === 1 ? '' : Math.abs(s)}A ${p < 0 ? '-' : '+'} ${Math.abs(p)}I = 0$ and has trace ${tr}. Find $\det A$.`,
          answer, tol: 0, a, b, n, k,
          sol: R`Every eigenvalue is a root of $\lambda^2 ${s < 0 ? '+' : '-'} ${Math.abs(s)}\lambda ${p < 0 ? '-' : '+'} ${Math.abs(p)} = 0$, i.e. $${a}$ or $${b}$. With $m$ eigenvalues equal to $${a}$: $${a}m + ${b < 0 ? `(${b})` : b}(${n} - m) = ${tr}$ gives $m = ${k}$. So $\det A = (${a})^{${k}}(${b})^{${n - k}} = ${answer}$.`,
          trap: 'Find how many times each root appears from the trace, then multiply.' };
      },
      verify: (p) => p.a ** p.k * p.b ** (p.n - p.k) },
    { id: 'mx-r4g2', type: 'nat', level: 3, exams: ['jam'], sub: 'inverse',
      make(r) {
        const p = int(r, -4, 4) || 2, q = int(r, -4, 4) || 3, s = int(r, -4, 4);
        const answer = p * q - s;
        return { q: R`For $A = \begin{pmatrix} 1 & ${p} & ${s} \\ 0 & 1 & ${q} \\ 0 & 0 & 1 \end{pmatrix}$, find the top-right entry $(A^{-1})_{13}$.`,
          answer, tol: 0, p, qq: q, s,
          sol: R`$A = I + N$ with $N^3 = 0$, so $A^{-1} = I - N + N^2$. $(N^2)_{13} = ${p}\times${q < 0 ? `(${q})` : q} = ${p * q}$ and $N_{13} = ${s}$, so $(A^{-1})_{13} = ${p * q} - ${s < 0 ? `(${s})` : s} = ${answer}$.`,
          trap: 'The corner of the inverse picks up the product of the two other off-diagonal entries.' };
      },
      verify: (p) => p.p * p.qq - p.s },
    { id: 'mx-r4g3', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'eigenvectors',
      make(r) {
        const p = pick(r, 0.05, 0.5, 0.05), q = pick(r, 0.05, 0.5, 0.05);
        const answer = round(100 * q / (p + q), 2);
        return { q: R`A two-state system is updated each step by the matrix $\begin{pmatrix} ${round(1 - p, 2)} & ${q} \\ ${p} & ${round(1 - q, 2)} \end{pmatrix}$ acting on the column of probabilities (state 1, state 2). Find the long-run percentage of time in state 1 (to two decimal places).`,
          answer, tol: 0.02, unit: '%', p, qv: q,
          sol: R`The steady state is the eigenvector with eigenvalue 1: $${p}\,x_1 = ${q}\,x_2$ (flow out of state 1 balances flow in). With $x_1 + x_2 = 1$: $x_1 = \dfrac{${q}}{${p} + ${q}} = ${answer}\%$.`,
          trap: 'Balance the flows: the leaving probability times the occupancy must match in both directions.' };
      },
      verify: (p) => 100 * p.qv / (p.p + p.qv) },
  ],
};
