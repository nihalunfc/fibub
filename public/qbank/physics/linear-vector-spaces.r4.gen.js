// Round 4 extras for linear-vector-spaces: original questions, written 2026-11-22.
import { int, choose, mcqOptions, round } from '../_util.js';
const R = String.raw;

export default {
  items: [
    { id: 'lvs-r4-01', type: 'mcq', level: 1, exams: ['jam', 'gate'], sub: 'dimension',
      q: R`The real vector space of all polynomials in $x$ of degree at most 4 (with real coefficients) has dimension`,
      options: [R`$4$`, R`$5$`, R`$6$`, R`infinite`], answer: 1,
      sol: R`A basis is $\{1, x, x^2, x^3, x^4\}$: every such polynomial is a unique combination of these five, and none of them is a combination of the others. So the dimension is 5.`,
      trap: R`Forgetting the constant term $1$ gives 4.` },
    { id: 'lvs-r4-02', type: 'mcq', level: 2, exams: ['jam', 'gate'], sub: 'subspaces',
      q: R`Consider smooth real functions $f$ on $[0, L]$ with the usual addition and scaling. Which set is NOT a vector space?`,
      options: [R`All $f$ with $f(0) = f(L) = 0$`, R`All $f$ with $f'(0) = 2f(0)$`, R`All $f$ with $f(0) = 1$`, R`All $f$ with $f(0) = f(L)$`], answer: 2,
      sol: R`A subset is a vector space exactly when it contains the zero function and is closed under addition and scaling. Linear, homogeneous conditions (the first, second and fourth) pass: if $f$ and $g$ satisfy them, so does $af + bg$. The condition $f(0) = 1$ fails: the zero function is not in the set, and the sum of two such functions has $f(0) + g(0) = 2$. This is why boundary conditions in eigenvalue problems are kept homogeneous.`,
      trap: R`A Robin condition like $f'(0) = 2f(0)$ looks complicated but is still linear and homogeneous.` },
    { id: 'lvs-r4-03', type: 'nat', level: 2, exams: ['jam', 'gate'], sub: 'inner product',
      q: R`With the inner product $\langle f, g\rangle = \displaystyle\int_0^1f(x)g(x)\,dx$, the angle between the functions $f = 1$ and $g = x$ is ______ degrees.`,
      answer: 30, tol: 0.5, calc: () => (Math.acos((1 / 2) / (1 * Math.sqrt(1 / 3))) * 180) / Math.PI,
      sol: R`$\langle1, x\rangle = \int_0^1x\,dx = \tfrac12$, $\|1\|^2 = 1$, $\|x\|^2 = \int_0^1x^2dx = \tfrac13$. So $\cos\theta = \dfrac{1/2}{1\cdot1/\sqrt3} = \dfrac{\sqrt3}{2}$ and $\theta = 30^\circ$.`,
      trap: R`Forgetting to take the square root of $\|x\|^2$ gives $\cos\theta = 3/2$, which is impossible.` },
    { id: 'lvs-r4-04', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'linear operators',
      q: R`The map $T(A) = A^{\mathsf T}$ (transpose) is a linear operator on the space of real $2\times2$ matrices. Its trace is`,
      options: [R`$2$`, R`$0$`, R`$4$`, R`$-2$`], answer: 0,
      sol: R`Use the basis $E_{11}, E_{12}, E_{21}, E_{22}$. $T$ fixes $E_{11}$ and $E_{22}$ and swaps $E_{12}\leftrightarrow E_{21}$. Its $4\times4$ matrix has diagonal entries $1, 0, 0, 1$, so the trace is 2. Equivalently, symmetric matrices (a 3-dimensional space) have eigenvalue $+1$ and antisymmetric ones (1-dimensional) have $-1$: $3 - 1 = 2$.`,
      trap: R`Confusing the trace of the operator $T$ with the trace of a matrix $A$ it acts on.` },
    { id: 'lvs-r4-05', type: 'msq', level: 3, exams: ['jam', 'gate'], sub: 'linear independence', format: 'statements',
      q: R`For the vectors $(1, 2, 3)$, $(4, 5, 6)$ and $(7, 8, 9)$ in $\mathbb R^3$, which statements are true?`,
      options: [R`They are linearly dependent`, R`Their span has dimension 2`, R`$(1, 1, 1)$ lies in their span`, R`$(1, 0, 0)$ lies in their span`], answer: [0, 1, 2],
      sol: R`$(7, 8, 9) - (4, 5, 6) = (4, 5, 6) - (1, 2, 3) = (3, 3, 3)$, so $(7,8,9) = 2(4,5,6) - (1,2,3)$: dependent. The first two are not parallel, so the span is a plane (dimension 2). $(1, 1, 1) = \tfrac13[(4,5,6) - (1,2,3)]$ is in it. The plane's normal is $(1,2,3)\times(4,5,6) = (-3, 6, -3)\propto(1, -2, 1)$; $(1,0,0)\cdot(1,-2,1) = 1\ne0$, so $(1,0,0)$ is not in the span.`,
      trap: R`Three vectors in $\mathbb R^3$ need not span it; check the determinant (here 0).` },
    { id: 'lvs-r4-06', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'subspaces', format: 'integer',
      q: R`Fix a non-zero vector $\vec v\in\mathbb R^3$. The real $3\times3$ matrices $M$ with $M\vec v = \vec 0$ form a vector space of dimension ______.`,
      answer: 6, tol: 0, calc: () => 3 * 2,
      sol: R`$M\vec v = \vec 0$ says each row of $M$ is orthogonal to $\vec v$. The vectors orthogonal to $\vec v$ form a plane (dimension 2), and the three rows can be chosen independently in it: $3\times2 = 6$. Equivalently, it is 3 independent linear conditions on 9 entries: $9 - 3 = 6$.`,
      trap: R`Counting only one condition (as if $M\vec v = 0$ were a single equation) gives 8.` },
    { id: 'lvs-r4-07', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'adjoint',
      q: R`On $\mathbb R^2$ use the inner product $\langle u, v\rangle = u^{\mathsf T}Wv$ with $W = \text{diag}(1, 2)$. The adjoint (defined by $\langle u, Av\rangle = \langle A^\dagger u, v\rangle$) of $A = \begin{pmatrix}0 & 1\\ 0 & 0\end{pmatrix}$ is`,
      options: [R`$\begin{pmatrix}0 & 0\\ 1 & 0\end{pmatrix}$`, R`$\begin{pmatrix}0 & 1\\ 0 & 0\end{pmatrix}$`, R`$\begin{pmatrix}0 & 0\\ 2 & 0\end{pmatrix}$`, R`$\begin{pmatrix}0 & 0\\ \tfrac12 & 0\end{pmatrix}$`], answer: 3,
      sol: R`$u^{\mathsf T}WAv = (A^\dagger u)^{\mathsf T}Wv$ for all $u, v$ needs $WA = (A^\dagger)^{\mathsf T}W$, so $A^\dagger = W^{-1}A^{\mathsf T}W$. With $A^{\mathsf T} = \begin{pmatrix}0&0\\1&0\end{pmatrix}$: the only non-zero entry is $(W^{-1}A^{\mathsf T}W)_{21} = \frac{1}{W_{22}}(A^{\mathsf T})_{21}W_{11} = \tfrac12$, so $A^\dagger = \begin{pmatrix}0&0\\ \tfrac12 & 0\end{pmatrix}$. Check: $\langle u, Av\rangle = u_1v_2$ and $\langle A^\dagger u, v\rangle = 2\cdot\tfrac12u_1\,v_2 = u_1v_2$.`,
      trap: R`The adjoint is the (conjugate) transpose only in an orthonormal basis of the given inner product.` },
    { id: 'lvs-r4-08', type: 'msq', level: 3, exams: ['jam', 'gate'], sub: 'rank and nullity', format: 'statements',
      q: R`The map $T(x, y, z) = (x + y,\ y + z,\ x - z)$ acts on $\mathbb R^3$. Which statements are true?`,
      options: [R`The rank of $T$ is 2`, R`The kernel of $T$ is spanned by $(1, -1, 1)$`, R`$T$ is invertible`, R`$(1, 0, 0)$ is in the range of $T$`], answer: [0, 1],
      sol: R`Kernel: $x + y = 0$, $y + z = 0$, $x - z = 0$ gives $y = -x$, $z = x$: spanned by $(1, -1, 1)$. So nullity 1, rank $3 - 1 = 2$, and $T$ is not invertible. The range is a plane; note that (first) $-$ (second) $=$ (third) for every output: $(x + y) - (y + z) = x - z$. So every $(a, b, c)$ in the range has $a - b = c$; for $(1, 0, 0)$, $1 - 0 \ne 0$, so it is not in the range.`,
      trap: R`Rank + nullity = 3: once a non-zero kernel vector is found, invertibility is ruled out.` },
    { id: 'lvs-r4-09', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'tensor products', format: 'integer',
      q: R`The totally symmetric subspace of $\mathbb C^3\otimes\mathbb C^3\otimes\mathbb C^3$ (states unchanged by any swap of the three factors, e.g. three bosons each in one of 3 levels) has dimension ______.`,
      answer: 10, tol: 0, calc: () => (5 * 4 * 3) / 6,
      sol: R`A symmetric basis state is fixed by how many factors are in each of the 3 basis states: the number of ways to put 3 identical objects into 3 boxes, $\binom{3 + 3 - 1}{3} = \binom53 = 10$. (List: $aaa$ type 3, $aab$ type 6, $abc$ type 1.)`,
      trap: R`$3^3 = 27$ is the whole space; $\binom33 = 1$ is the totally antisymmetric part.` },
    { id: 'lvs-r4-10', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'operators',
      q: R`On a finite-dimensional COMPLEX inner-product space, an operator $\hat A$ satisfies $\langle\psi|\hat A|\psi\rangle = 0$ for every $|\psi\rangle$. Then`,
      options: [R`$\hat A$ is anti-Hermitian, but need not be zero`, R`$\hat A = 0$`, R`$\hat A$ is nilpotent, but need not be zero`, R`nothing follows; a rotation by $90^\circ$ is a non-zero example`], answer: 1,
      sol: R`Polarisation: for any $|\phi\rangle, |\chi\rangle$, apply the condition to $|\phi\rangle + |\chi\rangle$ and to $|\phi\rangle + i|\chi\rangle$. The first gives $\langle\phi|A|\chi\rangle + \langle\chi|A|\phi\rangle = 0$; the second gives $i\langle\phi|A|\chi\rangle - i\langle\chi|A|\phi\rangle = 0$. Together $\langle\phi|A|\chi\rangle = 0$ for all pairs, so $A = 0$. The $90^\circ$ rotation works only on a REAL space, where the step with $i$ is not allowed. (Similarly, on a complex space $\langle\psi|A|\psi\rangle$ real for all $\psi$ forces $A$ Hermitian.)`,
      trap: R`Carrying over the real-space counterexample: $x^{\mathsf T}Jx = 0$ for the rotation $J$, but $J$ has complex vectors on which it is not zero.` },
    { id: 'lvs-r4-11', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'Gram matrix', format: 'statements',
      q: R`For vectors $v_1, \dots, v_k$ in an inner-product space, the Gram matrix is $G_{ij} = \langle v_i|v_j\rangle$. Which statements are true?`,
      options: [R`$G$ is Hermitian and positive semi-definite`, R`$\det G = 0$ exactly when the $v_i$ are linearly dependent`, R`For two vectors, $\det G\ge0$ is the Cauchy-Schwarz inequality`, R`The eigenvalues of $G$ are the squared lengths $\langle v_i|v_i\rangle$`], answer: [0, 1, 2],
      sol: R`$G_{ji} = \langle v_j|v_i\rangle = G_{ij}^*$, and $c^\dagger Gc = \|\sum_ic_iv_i\|^2\ge0$. That norm vanishes for some non-zero $c$ exactly when the vectors are dependent, which is when $G$ is singular. For $k = 2$: $\det G = \|u\|^2\|v\|^2 - |\langle u|v\rangle|^2\ge0$. The squared lengths are the DIAGONAL entries, not the eigenvalues (unless the vectors are orthogonal).`,
      trap: R`Diagonal entries equal eigenvalues only for a diagonal matrix.` },
    { id: 'lvs-r4-12', type: 'nat', level: 2, exams: ['jam'], sub: 'bases', format: 'integer',
      q: R`In $\mathbb R^2$, write $(5, 1) = c_1(1, 1) + c_2(1, -1)$. The value of $c_2$ is ______.`,
      answer: 2, tol: 0, calc: () => (5 - 1) / 2,
      sol: R`Components: $c_1 + c_2 = 5$ and $c_1 - c_2 = 1$. Subtracting, $2c_2 = 4$, so $c_2 = 2$ (and $c_1 = 3$). Because these basis vectors are orthogonal (not normalised), also $c_2 = \frac{(5,1)\cdot(1,-1)}{(1,-1)\cdot(1,-1)} = \frac42 = 2$.`,
      trap: R`Taking the plain dot product $(5,1)\cdot(1,-1) = 4$ forgets to divide by the squared length of the basis vector.` },
  ],
  gens: [
    { id: 'lvs-r4g1', type: 'nat', level: 2, exams: ['jam', 'gate'], sub: 'bases',
      make(r) {
        const a = int(r, 1, 3), b = int(r, -2, 2), c = int(r, -2, 2), d0 = int(r, -2, 3);
        const d = a * d0 - b * c === 0 ? d0 + 1 : d0, det = a * d - b * c;
        const x = int(r, -4, 6), y = int(r, -4, 6), which = choose(r, [1, 2]);
        const c1 = (x * d - c * y) / det, c2 = (a * y - b * x) / det, v = which === 1 ? c1 : c2;
        return { q: R`In $\mathbb R^2$, write $(${x}, ${y}) = c_1\,(${a}, ${b}) + c_2\,(${c}, ${d})$. The value of $c_${which}$ is ______ (three decimal places).`,
          answer: round(v, 3), tol: 0.005, a, b, c, d, x, y, which,
          sol: R`Componentwise: $${a}c_1 + (${c})c_2 = ${x}$ and $(${b})c_1 + (${d})c_2 = ${y}$. The determinant is $${a}\cdot${d} - (${b})(${c}) = ${det}$. Cramer's rule: $c_1 = \dfrac{${x}\cdot${d} - (${c})(${y})}{${det}} = ${round(c1, 4)}$, $c_2 = \dfrac{${a}\cdot${y} - (${b})(${x})}{${det}} = ${round(c2, 4)}$. So $c_${which}\approx${round(v, 3)}$.`,
          trap: 'The basis is not orthonormal, so the coefficients are NOT dot products with the basis vectors; solve the linear system.' };
      },
      verify: (p) => {
        // least squares with the Gram matrix: G c = B^T v
        const g11 = p.a * p.a + p.b * p.b, g12 = p.a * p.c + p.b * p.d, g22 = p.c * p.c + p.d * p.d;
        const r1 = p.a * p.x + p.b * p.y, r2 = p.c * p.x + p.d * p.y, D = g11 * g22 - g12 * g12;
        return p.which === 1 ? (r1 * g22 - g12 * r2) / D : (g11 * r2 - g12 * r1) / D;
      } },
    { id: 'lvs-r4g2', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'linear independence',
      make(r) {
        const aa = choose(r, [1, -2, int(r, 2, 4), -int(r, 1, 1) * 3, 0]);
        const rank = aa === 1 ? 1 : aa === -2 ? 2 : 3;
        const m = mcqOptions(r, rank, [1, 2, 3, 0].filter((k) => k !== rank), (k) => `$${k}$`);
        return { q: R`The dimension of the span of $(1, 1, ${aa})$, $(1, ${aa}, 1)$ and $(${aa}, 1, 1)$ in $\mathbb R^3$ is`, ...m,
          sol: R`The determinant of the matrix with these rows is $-(a - 1)^2(a + 2)$ with $a = ${aa}$ (expand, or note that the matrix is $(a - 1)I + J$ with $J$ all ones, eigenvalues $a + 2, a - 1, a - 1$). ${aa === 1 ? 'For $a = 1$ all three vectors equal $(1, 1, 1)$: the span is a line, dimension 1.' : aa === -2 ? 'For $a = -2$ the determinant vanishes but the vectors are not all parallel (the eigenvalue $a - 1 = -3$ is non-zero twice), so the rank is 2. Indeed the three vectors add to zero.' : `For $a = ${aa}$ the determinant is $${-(aa - 1) * (aa - 1) * (aa + 2)}\\ne0$, so the vectors are independent and span $\\mathbb R^3$: dimension 3.`}`,
          trap: 'A zero determinant says only that the rank is less than 3; look at the eigenvalues (or the vectors) to tell 2 from 1.' };
      } },
    { id: 'lvs-r4g3', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'projections',
      make(r) {
        const u = [int(r, 1, 3), int(r, -2, 2), int(r, -1, 2)], v = [int(r, -2, 3), int(r, -2, 3), int(r, 1, 4)];
        const cr = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
        const nu = Math.hypot(...u), dist = Math.hypot(...cr) / nu;
        const dot = u[0] * v[0] + u[1] * v[1] + u[2] * v[2];
        return { q: R`The distance from the point $(${v.join(', ')})$ to the line through the origin along $(${u.join(', ')})$ (the length of the part of $\vec v = (${v.join(', ')})$ orthogonal to $\vec u = (${u.join(', ')})$) is ______ (three decimal places).`,
          answer: round(dist, 3), tol: 0.005, u, v,
          sol: R`Subtract the projection: $\vec v_\perp = \vec v - \frac{\vec u\cdot\vec v}{\vec u\cdot\vec u}\vec u$, with $\vec u\cdot\vec v = ${dot}$ and $\vec u\cdot\vec u = ${u[0] ** 2 + u[1] ** 2 + u[2] ** 2}$. Its length is $\sqrt{|\vec v|^2 - (\vec u\cdot\vec v)^2/|\vec u|^2} = \sqrt{${v[0] ** 2 + v[1] ** 2 + v[2] ** 2} - ${dot * dot}/${u[0] ** 2 + u[1] ** 2 + u[2] ** 2}}\approx${round(dist, 3)}$. (Check: $|\vec u\times\vec v|/|\vec u|$ gives the same.)`,
          trap: 'Dividing by $|\\vec u|$ instead of $|\\vec u|^2$ in the projection coefficient.' };
      },
      verify: (p) => { const d = p.u[0] * p.v[0] + p.u[1] * p.v[1] + p.u[2] * p.v[2], uu = p.u[0] ** 2 + p.u[1] ** 2 + p.u[2] ** 2, vv = p.v[0] ** 2 + p.v[1] ** 2 + p.v[2] ** 2; return Math.sqrt(Math.max(0, vv - d * d / uu)); } },
  ],
};
