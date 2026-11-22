// Round 5 extras for linear-vector-spaces: original questions, written 2026-11-22.
import { int, choose, mcqOptions, round } from '../_util.js';
import { simpson } from './_more.js';
const R = String.raw;

export default {
  items: [
    { id: 'lvs-r5-01', type: 'mcq', level: 1, exams: ['jam'], sub: 'subspaces',
      q: R`Which of these subsets of $\mathbb R^3$ is a subspace?`,
      options: [R`$\{(x, y, z): x + y + z = 1\}$`, R`$\{(x, y, z): x\ge0\}$`, R`$\{(x, y, z): x + 2y - z = 0\}$`, R`$\{(x, y, z): xy = 0\}$`], answer: 2,
      sol: R`A subspace must contain the zero vector and be closed under addition and scaling. The plane $x + 2y - z = 0$ passes through the origin and the condition is linear, so sums and multiples stay in it. The plane $x + y + z = 1$ misses the origin. The half-space $x\ge0$ is not closed under multiplying by $-1$. The set $xy = 0$ (two planes) is not closed under addition: $(1, 0, 0) + (0, 1, 0) = (1, 1, 0)$ has $xy = 1$.`,
      trap: R`A flat plane is a subspace only if it passes through the origin.` },
    { id: 'lvs-r5-02', type: 'nat', level: 2, exams: ['jam'], sub: 'dimension',
      q: R`The real polynomials $p(x)$ of degree at most 4 with $p(1) = 0$ and $p(-1) = 0$ form a vector space. Its dimension is ______.`,
      answer: 3, tol: 0, calc: () => 5 - 2,
      sol: R`Such a polynomial has $(x - 1)(x + 1) = x^2 - 1$ as a factor: $p(x) = (x^2 - 1)q(x)$ with $q$ of degree at most 2. The $q$'s form a space of dimension 3 (basis $1, x, x^2$), so the dimension is 3. Equivalently: the full space has dimension 5 and the two independent conditions remove 2.`,
      trap: R`Counting the degree (4) instead of the number of free coefficients (5) gives 2.` },
    { id: 'lvs-r5-03', type: 'mcq', level: 2, exams: ['jam', 'gate'], sub: 'inner products',
      q: R`In $\mathbb C^2$ with $\langle u|v\rangle = \sum_k u_k^*v_k$, for $u = (1, i)^{\mathsf T}$ and $v = (i, 2)^{\mathsf T}$ the inner product $\langle u|v\rangle$ is`,
      options: [R`$3i$`, R`$-1$`, R`$i$`, R`$-i$`], answer: 3,
      sol: R`Conjugate the first vector: $u^* = (1, -i)$. Then $\langle u|v\rangle = 1\cdot i + (-i)\cdot2 = i - 2i = -i$.`,
      trap: R`Not conjugating $u$ gives $i + 2i = 3i$.` },
    { id: 'lvs-r5-04', type: 'msq', level: 3, exams: ['jam', 'gate'], sub: 'linear operators',
      q: R`Which of these maps on the space of real $2\times2$ matrices are linear?`,
      options: [R`$A\mapsto A - (\text{tr}A)\,I$`, R`$A\mapsto\det A\;I$`, R`$A\mapsto PAP^{-1}$ for a fixed invertible $P$`, R`$A\mapsto A^{\mathsf T}A$`], answer: [0, 2],
      sol: R`Test $T(\alpha A + \beta B) = \alpha T(A) + \beta T(B)$. The trace is linear, so $A - (\text{tr}A)I$ is linear. Conjugation $PAP^{-1}$ is linear in $A$. The determinant is not linear: $\det(2A) = 4\det A$ for $2\times2$. $A^{\mathsf T}A$ is quadratic in $A$: doubling $A$ multiplies it by 4.`,
      trap: R`A map built from matrix products can still be linear, as long as $A$ appears only once in each term.` },
    { id: 'lvs-r5-05', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'inner products',
      q: R`In $\mathbb C^3$ (standard inner product), $|\psi\rangle = \tfrac13(1, 2, 2)^{\mathsf T}$ and $|\phi\rangle = \tfrac{1}{\sqrt2}(1, i, 0)^{\mathsf T}$. The value of $|\langle\phi|\psi\rangle|^2$ is ______ (three decimal places).`,
      answer: 0.278, tol: 0.002, calc: () => 5 / 18,
      sol: R`Both kets are normalised. $\langle\phi|\psi\rangle = \frac{1}{3\sqrt2}\left(1\cdot1 + (-i)\cdot2 + 0\right) = \frac{1 - 2i}{3\sqrt2}$. Its squared modulus is $\frac{1 + 4}{18} = \frac5{18}\approx0.278$.`,
      trap: R`Forgetting to conjugate the bra gives $(1 + 2i)$; the modulus is the same here, but the phase would be wrong in any further step. Forgetting the normalisations gives 5.` },
    { id: 'lvs-r5-06', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'linear operators',
      q: R`The operator $\hat D = x\dfrac{d}{dx}$ acts on the space of real polynomials of degree at most 3. Its trace is`,
      options: [R`$0$`, R`$6$`, R`$3$`, R`$4$`], answer: 1,
      sol: R`On the basis $1, x, x^2, x^3$: $x\frac{d}{dx}x^n = nx^n$, so each basis vector is an eigenvector with eigenvalue $n$. The matrix is $\text{diag}(0, 1, 2, 3)$, with trace $6$.`,
      trap: R`$d/dx$ alone is nilpotent with trace 0; the extra factor $x$ turns it into a diagonal operator.` },
    { id: 'lvs-r5-07', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'projectors', format: 'statements',
      q: R`$\hat P$ is the orthogonal projector onto a 2-dimensional subspace of $\mathbb C^5$. Which statements are true?`,
      options: [R`$\text{tr}\,\hat P = 2$`, R`The only eigenvalues of $\hat P$ are 0 and 1`, R`$\hat P$ is invertible`, R`$\hat 1 - \hat P$ is the orthogonal projector onto a 3-dimensional subspace`], answer: [0, 1, 3],
      sol: R`In an orthonormal basis adapted to the subspace, $\hat P = \text{diag}(1, 1, 0, 0, 0)$. So its eigenvalues are 1 (twice) and 0 (three times), its trace is 2, and its determinant is 0, so it is not invertible. $\hat 1 - \hat P = \text{diag}(0, 0, 1, 1, 1)$ is Hermitian and idempotent: the projector onto the 3-dimensional orthogonal complement.`,
      trap: R`$\hat P^2 = \hat P$ looks like "$\hat P$ is its own square root, so it is like the identity", but a projector onto a proper subspace always kills something.` },
    { id: 'lvs-r5-08', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'best approximation',
      q: R`On $[-1, 1]$ with $\langle f, g\rangle = \displaystyle\int_{-1}^{1}f(x)g(x)\,dx$, the multiple $c\,x$ that is closest to $x^3$ has $c =$ ______ (one decimal place).`,
      answer: 0.6, tol: 0.01, calc: () => (2 / 5) / (2 / 3),
      sol: R`The closest point in a one-dimensional subspace is the orthogonal projection: $c = \dfrac{\langle x^3, x\rangle}{\langle x, x\rangle} = \dfrac{\int_{-1}^1x^4dx}{\int_{-1}^1x^2dx} = \dfrac{2/5}{2/3} = \dfrac35 = 0.6$. (This is why $P_3 = \tfrac12(5x^3 - 3x)$ contains $x^3 - \tfrac35x$.)`,
      trap: R`Matching values at $x = 1$ gives $c = 1$; that is the best fit at one point, not in the integral (least-squares) sense.` },
    { id: 'lvs-r5-09', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'tensor products',
      q: R`The antisymmetric subspace of $\mathbb C^4\otimes\mathbb C^4$ (vectors with $S|\Psi\rangle = -|\Psi\rangle$, $S$ the swap) has dimension`,
      options: [R`$10$`, R`$8$`, R`$6$`, R`$4$`], answer: 2,
      sol: R`A basis is $|ij\rangle - |ji\rangle$ for $i < j$, one for each unordered pair of different labels: $\binom42 = 6$. The symmetric subspace gets the rest: $\binom42 + 4 = 10$, and $6 + 10 = 16 = 4^2$.`,
      trap: R`10 is the symmetric part, which also contains the 4 states $|ii\rangle$; antisymmetric states cannot have both labels equal.` },
    { id: 'lvs-r5-10', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'infinite dimensions',
      q: R`Which statement is NOT true?`,
      options: [R`For square matrices of finite size, $AB = I$ implies $BA = I$`, R`On $\ell^2$ (square-summable sequences), the right shift $S$ obeys $S^\dagger S = \hat 1$ but $SS^\dagger\ne\hat 1$`, R`No pair of finite matrices satisfies $XP - PX = i\hbar I$ with $\hbar\ne0$`, R`Every bounded Hermitian operator on an infinite-dimensional Hilbert space has at least one eigenvector`], answer: 3,
      sol: R`In finite dimensions, $AB = I$ gives $\det A\det B = 1$, so $A$ is invertible and $B = A^{-1}$. The right shift $(a_1, a_2, \dots)\mapsto(0, a_1, a_2, \dots)$ has adjoint the left shift; left after right is the identity, but right after left kills the first entry. Taking the trace of $XP - PX$ gives 0 on the left and $i\hbar n$ on the right, so finite matrices cannot do it. But a bounded Hermitian operator need not have any eigenvector: multiplication by $x$ on $L^2[0, 1]$ is bounded and Hermitian, yet $xf(x) = \lambda f(x)$ forces $f = 0$ almost everywhere. So the last statement is the false one.`,
      trap: R`Habits from matrices (every Hermitian matrix has an eigenbasis) fail in infinite dimensions, where the spectrum can be purely continuous.` },
  ],
  gens: [
    { id: 'lvs-r5g1', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'inner products',
      make(r) {
        const a = int(r, 1, 4), b = int(r, 1, 4), c = int(r, 0, 4);
        const N2 = a * a + b * b + c * c, v = (a * a + b * b) / (2 * N2);
        return { q: R`A normalised state is $|\psi\rangle\propto${a === 1 ? '' : a}|1\rangle + ${b === 1 ? '' : b}i|2\rangle${c ? ` + ${c}|3\rangle` : ''}$ (orthonormal $|1\rangle, |2\rangle, |3\rangle$). For $|\phi\rangle = (|1\rangle + |2\rangle)/\sqrt2$, find $|\langle\phi|\psi\rangle|^2$ (three decimal places).`,
          answer: round(v, 3), tol: 0.002, a, b, c,
          sol: R`Normalise: $|\psi\rangle = (${a}|1\rangle + ${b}i|2\rangle${c ? ` + ${c}|3\rangle` : ''})/\sqrt{${N2}}$. Then $\langle\phi|\psi\rangle = \dfrac{${a} + ${b}i}{\sqrt2\sqrt{${N2}}}$, whose squared modulus is $\dfrac{${a * a} + ${b * b}}{2\times${N2}} = ${round(v, 4)}$.`,
          trap: 'Forgetting the normalisation of $|\\psi\\rangle$ or the $1/\\sqrt2$ of $|\\phi\\rangle$; and $|a + bi|^2 = a^2 + b^2$, not $(a + b)^2$.' };
      },
      verify: (p) => (p.a * p.a + p.b * p.b) / 2 / (p.a * p.a + p.b * p.b + p.c * p.c) },
    { id: 'lvs-r5g2', type: 'mcq', level: 2, exams: ['jam'], sub: 'dimension',
      make(r) {
        const n = int(r, 3, 7), k = int(r, 1, 3);
        const pts = [0, 1, -1, 2, -2, 3].slice(0, k);
        const cond = pts.map((x) => `p(${x}) = 0`).join(', ');
        const o = mcqOptions(r, n + 1 - k, [n - k, n + 1, n + 1 + k, k], (v) => `$${v}$`);
        return { q: R`The real polynomials of degree at most ${n} that satisfy ${k === 1 ? `$${cond}$` : `all of $${cond}$`} form a vector space. Its dimension is`, ...o,
          sol: R`The full space has basis $1, x, \dots, x^{${n}}$: dimension ${n + 1}. Each condition $p(a) = 0$ means $(x - a)$ is a factor, and the ${k} conditions at different points are independent, so $p(x) = ${pts.map((x) => (x === 0 ? 'x' : `(x ${x > 0 ? '-' : '+'} ${Math.abs(x)})`)).join('')}\,q(x)$ with $q$ of degree at most ${n - k}. The $q$'s have dimension ${n - k + 1}, so the answer is ${n + 1} - ${k} = ${n + 1 - k}.`,
          trap: 'Using the degree $n$ in place of the number of coefficients $n + 1$ gives one too few.' };
      } },
    { id: 'lvs-r5g3', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'best approximation',
      make(r) {
        const m = int(r, 2, 8), L = choose(r, [1, 2]);
        const c = 3 * L ** (m - 1) / (m + 2);
        return { q: R`With $\langle f, g\rangle = \displaystyle\int_0^{${L}}f(x)g(x)\,dx$, the multiple $c\,x$ closest to $x^{${m}}$ has $c =$ ______ (three decimal places).`,
          answer: round(c, 3), tol: Math.max(0.002, round(c * 0.002, 3)), m, L,
          sol: R`Project onto the line spanned by $x$: $c = \dfrac{\langle x^{${m}}, x\rangle}{\langle x, x\rangle} = \dfrac{\int_0^{${L}}x^{${m + 1}}dx}{\int_0^{${L}}x^2dx} = \dfrac{${L}^{${m + 2}}/${m + 2}}{${L}^3/3} = \dfrac{3\cdot${L}^{${m - 1}}}{${m + 2}}\approx${round(c, 4)}$.`,
          trap: 'Matching the two functions at the right end point is a different (and worse) fit than the least-squares projection.' };
      },
      verify: (p) => simpson((x) => x ** (p.m + 1), 0, p.L) / simpson((x) => x * x, 0, p.L) },
  ],
};
