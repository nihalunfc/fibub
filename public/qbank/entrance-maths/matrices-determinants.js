// Matrices and determinants (Plus Two entrance, Mathematics, Class 12). Original fibub questions.
// Numeric answers were checked in code (`calc` fields and the templates' verify() recompute them another way).
import { pick, int, choose, fmt, shuffleOpts, numOpts } from '../_entrance.js';

const R = String.raw;
const EXS = {
  1: ['keam', 'cusat', 'comedk', 'jee-main'],
  2: ['keam', 'cusat', 'comedk', 'jee-main'],
  3: ['jee-main', 'keam', 'comedk'],
  4: ['jee-main', 'jee-adv'],
  5: ['jee-adv'],
};
const POS = [1, 3, 0, 2, 2, 0, 3, 1, 3, 1, 2, 0, 1, 2, 3, 0];
let _n = 0;
const place = (correct, wrongs) => {
  const p = POS[_n++ % POS.length];
  const o = [...wrongs];
  o.splice(p, 0, correct);
  return { options: o, answer: p };
};
// ids are filled in order at the end (PFX-001 ...). CUET rule: Class 12 level 1-3 mcq also list 'cuet'.
const base = (level, sub, extra) => ({ level, exams: [...EXS[level], ...(extra.type === 'mcq' && level <= 3 ? ['cuet'] : [])], sub, ...extra });
const M = (level, sub, q, correct, wrongs, sol, trap, more = {}) =>
  base(level, sub, { type: 'mcq', format: 'single', q, ...place(correct, wrongs), sol, trap, ...more });
const I = (level, sub, q, answer, sol, trap, more = {}) =>
  base(level, sub, { type: 'nat', format: 'integer', q, answer, tol: 0, sol, trap, ...more });
const N = (level, sub, q, answer, tol, sol, trap, more = {}) =>
  base(level, sub, { type: 'nat', format: 'numeric', q, answer, tol, sol, trap, ...more });
const X = (level, sub, q, options, answer, sol, trap, more = {}) =>
  base(level, sub, { type: 'msq', format: 'multi', q, options, answer, sol, trap, ...more });
const AOPT = [
  'Both A and R are true and R is the correct explanation of A',
  'Both A and R are true but R is not the correct explanation of A',
  'A is true but R is false',
  'A is false but R is true',
];
const SOPT = [
  'Both Statement I and Statement II are true',
  'Statement I is true and Statement II is false',
  'Statement I is false and Statement II is true',
  'Both Statement I and Statement II are false',
];
const A = (level, sub, a, r, answer, sol, trap, more = {}) =>
  base(level, sub, { type: 'mcq', format: 'assertion', q: `<p><b>Assertion (A):</b> ${a}</p><p><b>Reason (R):</b> ${r}</p>`, options: AOPT, answer, sol, trap, ...more });
const S = (level, sub, s1, s2, answer, sol, trap, more = {}) =>
  base(level, sub, { type: 'mcq', format: 'statements', q: `<p><b>Statement I:</b> ${s1}</p><p><b>Statement II:</b> ${s2}</p>`, options: SOPT, answer, sol, trap, ...more });
const SC = (level, sub, lines, correct, wrongs, sol, trap, more = {}) =>
  base(level, sub, { type: 'mcq', format: 'statements', q: `<ol>${lines.map((l) => `<li>${l}</li>`).join('')}</ol><p>How many of these statements are correct?</p>`, ...place(correct, wrongs), sol, trap, ...more });
const MT = (level, sub, group, q, correct, wrongs, sol, trap) =>
  base(level, sub, { type: 'mcq', format: 'match', group, q, ...place(correct, wrongs), sol, trap });
const PI = (level, sub, group, q, answer, sol, trap, more = {}) =>
  base(level, sub, { type: 'nat', format: 'passage', group, q, answer, tol: 0, sol, trap, ...more });
const PN = (level, sub, group, q, answer, tol, sol, trap, more = {}) =>
  base(level, sub, { type: 'nat', format: 'passage', group, q, answer, tol, sol, trap, ...more });
/** a numeric gen: wraps make() so the extra fields are kept */
const GEXS = (level, type) => [...EXS[level], ...(type === 'mcq' && level <= 3 ? ['cuet'] : [])];

// ---------- helpers for checking ----------
const mx = (A) => R`\begin{pmatrix}${A.map((r) => r.join('&')).join('\\\\')}\end{pmatrix}`;
const dt = (A) => {
  const n = A.length;
  if (n === 1) return A[0][0];
  let s = 0;
  for (let j = 0; j < n; j++) s += (j % 2 ? -1 : 1) * A[0][j] * dt(A.slice(1).map((r) => r.filter((_, k) => k !== j)));
  return s;
};
const mm = (A, B) => A.map((r) => B[0].map((_, j) => r.reduce((s, v, k) => s + v * B[k][j], 0)));
const tp = (A) => A[0].map((_, j) => A.map((r) => r[j]));
const tr = (A) => A.reduce((s, r, i) => s + r[i], 0);
const cof = (A, i, j) => ((i + j) % 2 ? -1 : 1) * dt(A.filter((_, r) => r !== i).map((r) => r.filter((_, c) => c !== j)));
const adjm = (A) => A.map((r, i) => r.map((_, j) => cof(A, j, i)));
const mpow = (A, n) => { let P = A.map((r, i) => r.map((_, j) => (i === j ? 1 : 0))); for (let i = 0; i < n; i++) P = mm(P, A); return P; };
const madd = (A, B, s = 1) => A.map((r, i) => r.map((v, j) => v + s * B[i][j]));
// solve 3x3 by Cramer
const cramer = (A, b) => [0, 1, 2].map((k) => dt(A.map((r, i) => r.map((v, j) => (j === k ? b[i] : v)))) / dt(A));
const tri = (x1, y1, x2, y2, x3, y3) => Math.abs(x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2)) / 2;
const vl = (v) => (v < 0 ? `(${v})` : `${v}`);
const sg = (v) => (v < 0 ? `-${-v}` : `+${v}`);

const groups = {
  m1: {
    title: 'Special matrices',
    passage: R`<p>Match each matrix in List I with the property it has in List II.</p>`,
    list1: ['A. $\\begin{pmatrix}0&2\\\\-2&0\\end{pmatrix}$', 'B. $\\begin{pmatrix}1&0\\\\0&-1\\end{pmatrix}$', 'C. $\\begin{pmatrix}0&1\\\\0&0\\end{pmatrix}$', 'D. $\\begin{pmatrix}1&0\\\\0&0\\end{pmatrix}$'],
    list2: ['p. Idempotent', 'q. Nilpotent', 'r. Involutory', 's. Skew-symmetric'],
  },
  m2: {
    title: 'Determinants of related matrices',
    passage: R`<p>$A$ is a $3\times3$ matrix with $|A|=2$. Match each quantity in List I with its value in List II.</p>`,
    list1: ['A. $|3A|$', 'B. $|\\operatorname{adj}A|$', 'C. $|A^{-1}|$', 'D. $|A^T A^{-1}|$'],
    list2: ['p. $\\dfrac12$', 'q. $4$', 'r. $54$', 's. $1$'],
  },
  m3: {
    title: 'Systems and their solutions',
    passage: R`<p>Match each system of equations in List I with the nature of its solution in List II.</p>`,
    list1: ['A. $x+y=2,\\ 2x+2y=4$', 'B. $x+y=2,\\ x-y=0$', 'C. $x+y=2,\\ x+y=3$', 'D. $x+y=0,\\ x-y=0$'],
    list2: ['p. Unique solution, not the zero one', 'q. Infinitely many solutions', 'r. No solution', 's. Only the zero solution'],
  },
  p1: {
    title: 'Passage: powers of a matrix',
    passage: R`<p>Let $A=\begin{pmatrix}1&1\\0&1\end{pmatrix}$. By trying $A^2,A^3$ one finds a pattern for $A^n$.</p>`,
  },
  p2: {
    title: 'Passage: a system with a parameter',
    passage: R`<p>Consider the system $x+y+z=6$, $x+2y+3z=10$, $x+2y+\lambda z=\mu$.</p>`,
  },
  p3: {
    title: 'Passage: a 3 by 3 matrix and its adjoint',
    passage: R`<p>Let $A=\begin{pmatrix}1&2&0\\0&1&3\\0&0&2\end{pmatrix}$ and $B=\operatorname{adj}A$.</p>`,
  },
};

const items = [
  // ---------- L1 warm-up ----------
  M(1, 'order of a matrix', R`If $A$ has order $2\times3$ and $B$ has order $3\times4$, the product $AB$ has order`, R`$2\times4$`, [R`$3\times3$`, R`$4\times2$`, R`$2\times3$`],
    R`<p>Columns of $A$ (3) must equal rows of $B$ (3), so $AB$ exists. Its order is (rows of $A$) $\times$ (columns of $B$) $=2\times4$.</p>`, 'Outer numbers survive, inner numbers must match.'),
  I(1, 'determinant of 2x2', R`Find $\begin{vmatrix}2&1\\3&4\end{vmatrix}$.`, 5,
    R`<p>$ad-bc=2\cdot4-1\cdot3=8-3=5$.</p>`, 'Subtract the cross product $bc$; do not add it.', { calc: () => dt([[2, 1], [3, 4]]) }),
  M(1, 'symmetric matrix', R`Which of these matrices is symmetric?`, R`$\begin{pmatrix}1&5\\5&2\end{pmatrix}$`, [R`$\begin{pmatrix}1&5\\-5&2\end{pmatrix}$`, R`$\begin{pmatrix}0&5\\-5&0\end{pmatrix}$`, R`$\begin{pmatrix}1&5\\2&5\end{pmatrix}$`],
    R`<p>Symmetric means $A^T=A$, so $a_{ij}=a_{ji}$. Only $\begin{pmatrix}1&5\\5&2\end{pmatrix}$ has equal $(1,2)$ and $(2,1)$ entries. $\begin{pmatrix}1&5\\-5&2\end{pmatrix}$ and $\begin{pmatrix}1&5\\2&5\end{pmatrix}$ have unequal ones, and $\begin{pmatrix}0&5\\-5&0\end{pmatrix}$ is skew-symmetric.</p>`, 'Compare the entries across the main diagonal.'),
  I(1, 'trace', R`If $A=\begin{pmatrix}1&2\\3&4\end{pmatrix}$, find $\operatorname{tr}(A^2)$.`, 29,
    R`<p>$A^2=\begin{pmatrix}1+6&2+8\\3+12&6+16\end{pmatrix}=\begin{pmatrix}7&10\\15&22\end{pmatrix}$. Trace $=7+22=29$.</p>`, 'The trace of $A^2$ is not $(\\operatorname{tr}A)^2=25$.', { calc: () => tr(mm([[1, 2], [3, 4]], [[1, 2], [3, 4]])) }),
  M(1, 'transpose of a product', R`$(AB)^T$ equals`, R`$B^TA^T$`, [R`$A^TB^T$`, R`$AB^T$`, R`$BA$`],
    R`<p>Transpose reverses the order of a product: $(AB)^T=B^TA^T$. Check orders: if $A$ is $m\times n$ and $B$ is $n\times p$, $A^TB^T$ would be $n\times m$ times $p\times n$, which may not even exist.</p>`, 'Order reverses, just like inverses.'),
  I(1, 'order of a matrix', R`How many elements does a $3\times4$ matrix have?`, 12,
    R`<p>A matrix of $m$ rows and $n$ columns has $mn$ elements: $3\times4=12$.</p>`, 'Multiply, do not add.', { calc: () => 12 }),
  M(1, 'determinant of scalar multiple', R`If $I$ is the identity matrix of order 3, then $|2I|$ equals`, '8', ['2', '6', '4'],
    R`<p>$2I=\operatorname{diag}(2,2,2)$, so $|2I|=2\cdot2\cdot2=8$. (In general $|kA|=k^n|A|$.)</p>`, 'Each of the 3 rows brings a factor 2, so $2^3$, not $2$.'),
  I(1, 'triangular matrix', R`Find $\begin{vmatrix}1&2&3\\0&4&5\\0&0&6\end{vmatrix}$.`, 24,
    R`<p>For a triangular matrix the determinant is the product of the diagonal entries: $1\cdot4\cdot6=24$.</p>`, 'Only the diagonal matters for triangular matrices.', { calc: () => dt([[1, 2, 3], [0, 4, 5], [0, 0, 6]]) }),
  M(1, 'skew-symmetric', R`The diagonal entries of a skew-symmetric matrix are`, 'all zero', ['all equal to 1', 'all equal', 'any real numbers'],
    R`<p>$A^T=-A$ gives $a_{ii}=-a_{ii}$, so $a_{ii}=0$.</p>`, 'Skew-symmetric needs zeros on the diagonal.'),
  I(1, 'determinant of scalar multiple', R`$A$ is a $3\times3$ matrix with $|A|=4$. Find $|2A|$.`, 32,
    R`<p>$|2A|=2^3|A|=8\cdot4=32$.</p>`, 'The factor is $2^n$ for an $n\times n$ matrix.', { calc: () => 8 * 4 }),
  M(1, 'adjoint of 2x2', R`The adjoint of $\begin{pmatrix}a&b\\c&d\end{pmatrix}$ is`, R`$\begin{pmatrix}d&-b\\-c&a\end{pmatrix}$`, [R`$\begin{pmatrix}d&b\\c&a\end{pmatrix}$`, R`$\begin{pmatrix}a&-b\\-c&d\end{pmatrix}$`, R`$\begin{pmatrix}-d&b\\c&-a\end{pmatrix}$`],
    R`<p>Swap the diagonal entries and change the signs of the other two. Check with cofactors: $C_{11}=d$, $C_{12}=-c$, $C_{21}=-b$, $C_{22}=a$; the adjoint is the transpose of the cofactor matrix.</p>`, 'Swap the diagonal, negate the off-diagonal.'),
  I(1, 'inverse', R`Let $A=\begin{pmatrix}2&1\\5&3\end{pmatrix}$. Find the sum of all entries of $A^{-1}$.`, -1,
    R`<p>$|A|=6-5=1$, so $A^{-1}=\begin{pmatrix}3&-1\\-5&2\end{pmatrix}$. The sum is $3-1-5+2=-1$.</p>`, 'Divide by the determinant (here 1) after swapping and negating.', { calc: () => 3 - 1 - 5 + 2 }),
  M(1, 'properties of determinants', R`A determinant with two identical rows has the value`, '0', ['1', '2', 'the square of a row'],
    R`<p>Swapping the two identical rows changes the sign but not the matrix, so $D=-D$ and $D=0$.</p>`, 'Equal rows (or columns) always give 0.'),
  I(1, 'singular matrix', R`For what value of $x$ is $\begin{pmatrix}x&2\\3&6\end{pmatrix}$ singular?`, 1,
    R`<p>Singular means determinant zero: $6x-6=0$, so $x=1$.</p>`, 'Singular means $|A|=0$, not $A=0$.', { calc: () => 1 }),
  M(1, 'types of matrices', R`A square matrix with every off-diagonal entry zero and all diagonal entries equal is called`, 'a scalar matrix', ['a symmetric matrix only', 'a skew-symmetric matrix', 'an upper triangular matrix only'],
    R`<p>Such a matrix is $kI$, a scalar matrix. It is also diagonal, symmetric and triangular, but "scalar" is the exact name.</p>`, 'Diagonal with equal entries is scalar.'),
  I(1, 'area using determinants', R`Find the area of the triangle with vertices $(0,0)$, $(4,0)$ and $(0,6)$ using a determinant.`, 12,
    R`<p>Area $=\dfrac12\left|\begin{vmatrix}0&0&1\\4&0&1\\0&6&1\end{vmatrix}\right|$. Expand along the first row: the determinant is $1\cdot(4\cdot6-0\cdot0)=24$. So the area is $\dfrac{24}2=12$.</p>`, 'Remember the factor $\\tfrac12$.', { calc: () => tri(0, 0, 4, 0, 0, 6) }),

  // ---------- L2 standard ----------
  I(2, 'powers of a matrix', R`If $A=\begin{pmatrix}1&2\\0&1\end{pmatrix}$, find the $(1,2)$ entry of $A^{10}$.`, 20,
    R`<p>$A^2=\begin{pmatrix}1&4\\0&1\end{pmatrix}$, $A^3=\begin{pmatrix}1&6\\0&1\end{pmatrix}$. Pattern: $A^n=\begin{pmatrix}1&2n\\0&1\end{pmatrix}$. For $n=10$ the entry is $20$.</p>`, 'The entry grows by 2 each time (it is $2n$, not $2^n$).', { calc: () => mpow([[1, 2], [0, 1]], 10)[0][1] }),
  I(2, 'symmetric and skew-symmetric', R`Write $A=\begin{pmatrix}1&2\\4&3\end{pmatrix}$ as $P+Q$ with $P$ symmetric and $Q$ skew-symmetric. Find the $(1,2)$ entry of $P$.`, 3,
    R`<p>$P=\dfrac12(A+A^T)$. $A+A^T=\begin{pmatrix}2&6\\6&6\end{pmatrix}$, so $P=\begin{pmatrix}1&3\\3&3\end{pmatrix}$. The $(1,2)$ entry is 3. ($Q=\dfrac12(A-A^T)=\begin{pmatrix}0&-1\\1&0\end{pmatrix}$.)</p>`, 'Average the two off-diagonal entries: $(2+4)/2$.', { calc: () => (2 + 4) / 2 }),
  M(2, "Cramer's rule", R`Using Cramer's rule, the value of $y$ for $3x+2y=13$ and $x-y=1$ is`, '2', ['3', '-2', '5'],
    R`<p>$D=\begin{vmatrix}3&2\\1&-1\end{vmatrix}=-5$. $D_y=\begin{vmatrix}3&13\\1&1\end{vmatrix}=3-13=-10$. $y=\dfrac{D_y}{D}=2$. (Then $x=3$.)</p>`, 'For $D_y$ replace the $y$ column (second column) by the constants.'),
  M(2, 'evaluating a 3x3 determinant', R`The value of $\begin{vmatrix}1&2&3\\4&5&6\\7&8&10\end{vmatrix}$ is`, '-3', ['3', '0', '-9'],
    R`<p>Expand along row 1: $1(50-48)-2(40-42)+3(32-35)=2+4-9=-3$.</p>`, 'The middle term has a minus sign. Also note the last entry is 10, not 9 (with 9 the value would be 0).'),
  I(2, 'adjoint', R`$A$ is a $3\times3$ matrix with $|A|=-2$. Find $|\operatorname{adj}A|$.`, 4,
    R`<p>$|\operatorname{adj}A|=|A|^{n-1}=(-2)^2=4$.</p>`, 'The power is $n-1=2$; the sign disappears.', { calc: () => (-2) ** 2 }),
  I(2, 'area of a triangle', R`Find the area of the triangle with vertices $(1,2)$, $(4,6)$ and $(7,-2)$.`, 18,
    R`<p>$\dfrac12\left|\begin{vmatrix}1&2&1\\4&6&1\\7&-2&1\end{vmatrix}\right|$. The determinant: $1(6+2)-2(4-7)+1(-8-42)=8+6-50=-36$. Area $=\dfrac{36}2=18$.</p>`, 'Area is positive, so take the modulus of the determinant.', { calc: () => tri(1, 2, 4, 6, 7, -2) }),
  I(2, 'collinearity', R`The points $(1,2)$, $(3,5)$ and $(5,k)$ are collinear. Find $k$.`, 8,
    R`<p>Collinear means area $=0$: $\begin{vmatrix}1&2&1\\3&5&1\\5&k&1\end{vmatrix}=0$. Expanding: $1(5-k)-2(3-5)+1(3k-25)=5-k+4+3k-25=2k-16$. So $k=8$.</p>`, 'Area zero means the determinant is zero.', { calc: () => 2 + (5 - 2) / 2 * 4 }),
  I(2, 'consistency', R`For $x+2y=3$ and $2x+ky=6$ to have infinitely many solutions, $k$ must be`, 4,
    R`<p>Coefficients must be proportional: $\dfrac12=\dfrac2k=\dfrac36$. So $k=4$. (The constants also fit: $3\cdot2=6$.)</p>`, 'Check the constants too, otherwise the system may have no solution.', { calc: () => 4 }),
  M(2, 'consistency', R`The system $2x+3y=5$, $4x+6y=k$ has no solution when`, R`$k\neq10$`, [R`$k=10$`, R`$k=5$`, R`$k$ is any real number`],
    R`<p>The left sides are proportional ($4x+6y=2(2x+3y)$). For consistency we need $k=2\cdot5=10$ (then infinitely many solutions). For $k\neq10$ the lines are parallel and distinct: no solution.</p>`, 'Equal ratios of coefficients: the constants decide between "none" and "infinite".'),
  M(2, 'orthogonal matrix', R`If $A=\dfrac13\begin{pmatrix}1&2&2\\2&1&-2\\2&-2&1\end{pmatrix}$ is orthogonal, then $|A|$ equals`, '-1', ['1', '0', R`$\dfrac13$`],
    R`<p>For an orthogonal matrix $|A|=\pm1$. Compute: $\begin{vmatrix}1&2&2\\2&1&-2\\2&-2&1\end{vmatrix}=1(1-4)-2(2+4)+2(-4-2)=-27$. With the factor $\left(\dfrac13\right)^3=\dfrac1{27}$, $|A|=-1$.</p>`, 'Both $+1$ and $-1$ are possible; you must compute the sign.'),
  I(2, 'nilpotent matrix', R`Let $A=\begin{pmatrix}0&1&0\\0&0&1\\0&0&0\end{pmatrix}$. Find the least positive integer $n$ with $A^n=O$.`, 3,
    R`<p>$A^2=\begin{pmatrix}0&0&1\\0&0&0\\0&0&0\end{pmatrix}\neq O$ and $A^3=O$. So $n=3$.</p>`, 'A nilpotent matrix of order $n$ needs index at most $n$.', { calc: () => { let P = [[0, 1, 0], [0, 0, 1], [0, 0, 0]], k = 1, Q = P; while (Q.flat().some((v) => v)) { Q = mm(Q, P); k++; } return k; } }),
  M(2, 'idempotent matrix', R`If $A^2=A$, then $(I+A)^3-7A$ equals`, '$I$', ['$A$', '$O$', '$I+A$'],
    R`<p>$(I+A)^3=I+3A+3A^2+A^3$. With $A^2=A$ and $A^3=A$: $=I+3A+3A+A=I+7A$. So $(I+A)^3-7A=I$.</p>`, 'Replace every higher power of $A$ by $A$.'),
  M(2, 'Cayley-Hamilton', R`For $A=\begin{pmatrix}1&2\\3&4\end{pmatrix}$, the matrix $A^2-5A$ equals`, '$2I$', ['$-2I$', '$5I$', '$O$'],
    R`<p>Characteristic equation: $\lambda^2-(\operatorname{tr}A)\lambda+|A|=\lambda^2-5\lambda-2=0$. By Cayley-Hamilton $A^2-5A-2I=O$, so $A^2-5A=2I$. (Direct check: $A^2-5A=\begin{pmatrix}7-5&10-10\\15-15&22-20\end{pmatrix}=2I$.)</p>`, '$|A|=-2$, so the constant term is $-2$.'),
  I(2, 'special determinants', R`Find $\begin{vmatrix}1&1&1\\1&2&4\\1&3&9\end{vmatrix}$.`, 2,
    R`<p>This is a Vandermonde determinant with $a=1,b=2,c=3$: $(b-a)(c-a)(c-b)=1\cdot2\cdot1=2$. Direct: $1(18-12)-1(9-4)+1(3-2)=6-5+1=2$.</p>`, 'Rows are powers $1,a,a^2$ of 1, 2, 3.', { calc: () => dt([[1, 1, 1], [1, 2, 4], [1, 3, 9]]) }),
  I(2, 'special determinants', R`Find $\begin{vmatrix}1&2&3\\2&3&1\\3&1&2\end{vmatrix}$.`, -18,
    R`<p>Add all columns into the first: $C_1\to C_1+C_2+C_3$ gives a column of 6s. Take 6 out: $6\begin{vmatrix}1&2&3\\1&3&1\\1&1&2\end{vmatrix}$. Subtract $R_1$ from $R_2,R_3$: $6\begin{vmatrix}1&2&3\\0&1&-2\\0&-1&-1\end{vmatrix}=6(-1-2)=-18$.</p>`, 'A circulant has factor $(a+b+c)=6$; mind the sign at the end.', { calc: () => dt([[1, 2, 3], [2, 3, 1], [3, 1, 2]]) }),
  I(2, 'solving determinant equations', R`How many distinct real values of $x$ make $\begin{vmatrix}x&1&1\\1&x&1\\1&1&x\end{vmatrix}=0$?`, 2,
    R`<p>Add all columns to the first: factor $(x+2)$. Then subtract rows: the determinant is $(x+2)(x-1)^2$. Roots $x=-2$ and $x=1$ (double). Two distinct values.</p>`, 'A repeated root counts once as a distinct value.', { calc: () => { let c = 0; for (const x of [-2, 1]) if (dt([[x, 1, 1], [1, x, 1], [1, 1, x]]) === 0) c++; return c; } }),
  M(2, 'skew-symmetric', R`The value of $\begin{vmatrix}0&2&3\\-2&0&4\\-3&-4&0\end{vmatrix}$ is`, '0', ['24', '-24', '29'],
    R`<p>The matrix is skew-symmetric of odd order 3. $|A|=|A^T|=|-A|=(-1)^3|A|=-|A|$, so $|A|=0$. (Direct: $0-2(0+12)+3(8-0)=-24+24=0$.)</p>`, 'Odd-order skew-symmetric determinants vanish.'),
  I(2, 'inverse', R`If $A=\begin{pmatrix}3&1\\5&2\end{pmatrix}$, find the $(2,1)$ entry of $A^{-1}$.`, -5,
    R`<p>$|A|=6-5=1$. $A^{-1}=\begin{pmatrix}2&-1\\-5&3\end{pmatrix}$. The $(2,1)$ entry is $-5$.</p>`, 'Swap the diagonal, negate the others, then divide by $|A|$.', { calc: () => -5 / 1 }),
  M(2, 'determinant of a product', R`$A$ and $B$ are $3\times3$ matrices with $|A|=2$ and $|B|=3$. Then $|(AB)^{-1}|$ is`, R`$\dfrac16$`, ['6', R`$\dfrac56$`, R`$\dfrac13$`],
    R`<p>$|AB|=|A||B|=6$ and $|M^{-1}|=\dfrac1{|M|}$. So $|(AB)^{-1}|=\dfrac16$.</p>`, 'Product rule first; then the reciprocal.'),
  I(2, 'powers and determinants', R`If $A$ is $3\times3$ with $|A|=-2$, find $|A^3|$.`, -8,
    R`<p>$|A^3|=|A|^3=(-2)^3=-8$.</p>`, 'Odd power keeps the sign.', { calc: () => (-2) ** 3 }),
  I(2, 'counting matrices', R`How many $2\times2$ symmetric matrices have all entries in $\{0,1,2\}$?`, 27,
    R`<p>A $2\times2$ symmetric matrix is fixed by $a,b,d$ in $\begin{pmatrix}a&b\\b&d\end{pmatrix}$. Each has 3 choices: $3^3=27$.</p>`, 'Off-diagonal entries are not independent.', { calc: () => 3 ** 3 }),
  I(2, 'counting matrices', R`How many $2\times2$ matrices with entries from $\{0,1\}$ are non-singular?`, 6,
    R`<p>Need $ad-bc\neq0$. Since each product is 0 or 1, we need exactly one of $ad,bc$ to be 1. $ad=1,bc=0$: $a=d=1$ and $(b,c)\neq(1,1)$: 3 ways. Similarly $bc=1,ad=0$: 3 ways. Total 6.</p>`, 'Count $ad=1$ and $bc=1$ cases separately; they cannot both occur.', { calc: () => { let c = 0; for (let m = 0; m < 16; m++) { const a = m & 1, b = (m >> 1) & 1, cc = (m >> 2) & 1, d = (m >> 3) & 1; if (a * d - b * cc) c++; } return c; } }),
  I(2, 'elementary operations', R`Apply $R_2\to R_2-2R_1$ to $\begin{pmatrix}1&3\\2&5\end{pmatrix}$. Find the new $(2,2)$ entry.`, -1,
    R`<p>New row 2 $=(2,5)-2(1,3)=(0,-1)$. The $(2,2)$ entry is $-1$.</p>`, 'Subtract twice every entry of row 1, not just the first.', { calc: () => 5 - 2 * 3 }),
  M(2, 'trace', R`For $A=\begin{pmatrix}1&2\\3&4\end{pmatrix}$ and $B=\begin{pmatrix}0&1\\1&0\end{pmatrix}$, the value of $\operatorname{tr}(AB-BA)$ is`, '0', ['5', '-5', '2'],
    R`<p>$AB=\begin{pmatrix}2&1\\4&3\end{pmatrix}$ and $BA=\begin{pmatrix}3&4\\1&2\end{pmatrix}$. Both have trace 5, so the difference has trace 0. In general $\operatorname{tr}(AB)=\operatorname{tr}(BA)$ even when $AB\neq BA$.</p>`, '$AB\\neq BA$, but their traces agree.'),
  I(2, 'minors and cofactors', R`For $A=\begin{pmatrix}1&2&3\\4&5&6\\7&8&9\end{pmatrix}$, find the cofactor $C_{12}$.`, 6,
    R`<p>Minor $M_{12}=\begin{vmatrix}4&6\\7&9\end{vmatrix}=36-42=-6$. $C_{12}=(-1)^{1+2}M_{12}=6$.</p>`, 'Cofactor sign is $(-1)^{i+j}$.', { calc: () => cof([[1, 2, 3], [4, 5, 6], [7, 8, 9]], 0, 1) }),
  M(2, 'properties of determinants', R`The value of $\begin{vmatrix}1&2&3\\4&5&6\\7&8&9\end{vmatrix}$ is`, '0', ['-3', '3', '45'],
    R`<p>$C_3-C_2=C_2-C_1$ (each difference is $(1,1,1)^T$). So the columns are linearly dependent, and the determinant is 0. Quick route: $R_3-R_2$ and $R_2-R_1$ are equal, so subtracting makes two equal rows.</p>`, 'Arithmetic progression in rows gives 0.'),
  I(2, 'determinant of a product', R`Let $A=\begin{pmatrix}1&2\\0&1\end{pmatrix}$ and $B=\begin{pmatrix}3&0\\1&1\end{pmatrix}$. Find $|AB|$.`, 3,
    R`<p>$|AB|=|A||B|=1\cdot3=3$. (Direct: $AB=\begin{pmatrix}5&2\\1&1\end{pmatrix}$, $5-2=3$.)</p>`, 'No need to multiply when you only want the determinant.', { calc: () => dt(mm([[1, 2], [0, 1]], [[3, 0], [1, 1]])) }),
  N(2, 'inverse of diagonal matrix', R`Find the trace of $A^{-1}$ for $A=\operatorname{diag}(2,4,5)$.`, 0.95, 0.01,
    R`<p>For a diagonal matrix $A^{-1}=\operatorname{diag}(1/2,1/4,1/5)$. Trace $=0.5+0.25+0.2=0.95$.</p>`, '$\\operatorname{tr}(A^{-1})$ is not $1/\\operatorname{tr}A$.', { calc: () => 1 / 2 + 1 / 4 + 1 / 5 }),
  I(2, 'solving using the inverse', R`Solve $x+2y=5$, $3x+5y=13$ using $X=A^{-1}B$. Find $x+y$.`, 3,
    R`<p>$A=\begin{pmatrix}1&2\\3&5\end{pmatrix}$, $|A|=-1$, $A^{-1}=\dfrac1{-1}\begin{pmatrix}5&-2\\-3&1\end{pmatrix}=\begin{pmatrix}-5&2\\3&-1\end{pmatrix}$. $X=A^{-1}\begin{pmatrix}5\\13\end{pmatrix}=\begin{pmatrix}-25+26\\15-13\end{pmatrix}=\begin{pmatrix}1\\2\end{pmatrix}$. So $x+y=3$.</p>`, 'The inverse multiplies on the left: $X=A^{-1}B$.', { calc: () => 3 }),
  A(2, 'symmetric and skew-symmetric', R`Every square matrix can be written as the sum of a symmetric and a skew-symmetric matrix.`, R`$A=\dfrac12(A+A^T)+\dfrac12(A-A^T)$, where the first part is symmetric and the second skew-symmetric.`, 0,
    R`<p>Both are true. $\left(\dfrac{A+A^T}2\right)^T=\dfrac{A^T+A}2$ is symmetric and $\left(\dfrac{A-A^T}2\right)^T=-\dfrac{A-A^T}2$ is skew-symmetric. The identity is exactly the decomposition, so R explains A.</p>`, 'The decomposition is unique.'),
  A(2, 'determinants', R`$\begin{vmatrix}1&2\\2&4\end{vmatrix}=0$.`, R`If one row of a determinant is a multiple of another, the determinant is zero.`, 0,
    R`<p>Row 2 is twice row 1, so the determinant is $4-4=0$. R is a true property and is the reason.</p>`, 'Proportional rows give zero.'),
  A(2, 'inverse', R`The matrix $\begin{pmatrix}2&4\\1&2\end{pmatrix}$ has no inverse.`, R`A square matrix has an inverse only if its determinant is non-zero.`, 0,
    R`<p>Its determinant is $4-4=0$, so it is singular and has no inverse. R is the exact condition that explains A.</p>`, 'Singular means no inverse.'),
  A(2, 'matrix multiplication', R`For square matrices of the same order, $AB=BA$ always.`, R`Matrix multiplication is associative.`, 3,
    R`<p>A is false: matrix multiplication is not commutative (for example the $2\times2$ matrices $E_{12}$ and $E_{21}$ give $E_{12}E_{21}\neq E_{21}E_{12}$). R is true but does not give commutativity. So A false, R true.</p>`, 'Associative does not mean commutative.'),
  S(2, 'transpose and inverse', R`$(AB)^T=B^TA^T$ for conformable matrices.`, R`$(AB)^{-1}=A^{-1}B^{-1}$ for invertible $A,B$.`, 1,
    R`<p>I is true. II is false: the inverse also reverses order, $(AB)^{-1}=B^{-1}A^{-1}$. Check: $(AB)(B^{-1}A^{-1})=A(BB^{-1})A^{-1}=I$.</p>`, 'Transpose and inverse both reverse the order.'),
  S(2, 'zero matrices', R`If $AB=O$ then $A=O$ or $B=O$.`, R`If $AB=O$ then $|A|=0$ or $|B|=0$.`, 2,
    R`<p>I is false: $\begin{pmatrix}1&0\\0&0\end{pmatrix}\begin{pmatrix}0&0\\0&1\end{pmatrix}=O$ with neither factor zero. II is true because $|A||B|=|O|=0$.</p>`, 'Matrix algebra has zero divisors.'),
  S(2, 'trace', R`$\operatorname{tr}(A+B)=\operatorname{tr}A+\operatorname{tr}B$.`, R`$\operatorname{tr}(AB)=\operatorname{tr}A\cdot\operatorname{tr}B$.`, 1,
    R`<p>I is true (trace is linear). II is false: take $A=B=I_2$; $\operatorname{tr}(AB)=2$ but the product of traces is 4.</p>`, 'Trace is additive, not multiplicative.'),

  // ---------- L3 exam ----------
  I(3, 'adjoint of adjoint', R`$A$ is a $3\times3$ matrix with $|A|=-2$. Find $|\operatorname{adj}(\operatorname{adj}A)|$.`, 16,
    R`<p>$|\operatorname{adj}A|=|A|^{2}=4$. Apply the rule again to $B=\operatorname{adj}A$: $|\operatorname{adj}B|=|B|^2=4^2=16$. (Formula: $|\operatorname{adj}(\operatorname{adj}A)|=|A|^{(n-1)^2}=(-2)^4=16$.)</p>`, 'Apply $n-1$ twice, so the exponent is $(n-1)^2$.', { calc: () => (-2) ** 4 }),
  M(3, 'determinant properties', R`$A$ and $B$ are $3\times3$ matrices with $|A|=3$ and $|B|=-2$. Then $|2A^{-1}B^T|$ equals`, R`$-\dfrac{16}3$`, [R`$-\dfrac43$`, R`$-\dfrac{16}{9}$`, R`$\dfrac{16}3$`],
    R`<p>$|2A^{-1}B^T|=2^3\cdot|A^{-1}|\cdot|B^T|=8\cdot\dfrac13\cdot(-2)=-\dfrac{16}3$.</p>`, 'The scalar 2 gives $2^3$ (not 2); $|B^T|=|B|$.'),
  I(3, 'inverse', R`Let $A=\begin{pmatrix}1&1&0\\0&1&1\\1&0&1\end{pmatrix}$. Find the sum of all entries of $2A^{-1}$.`, 3,
    R`<p>$|A|=1(1-0)-1(0-1)+0=2$. Cofactors give $\operatorname{adj}A=\begin{pmatrix}1&-1&1\\1&1&-1\\-1&1&1\end{pmatrix}$, whose entries add to $3$. $2A^{-1}=\operatorname{adj}A\cdot\dfrac{2}{|A|}=\operatorname{adj}A$, so the sum is 3.</p>`, 'The adjoint is the transpose of the cofactor matrix.', { calc: () => adjm([[1, 1, 0], [0, 1, 1], [1, 0, 1]]).flat().reduce((a, b) => a + b) }),
  I(3, "Cramer's rule", R`Solve $x+y+z=6$, $2x-y+z=3$, $x+2y-z=2$ by Cramer's rule. Find $xyz$.`, 6,
    R`<p>$D=\begin{vmatrix}1&1&1\\2&-1&1\\1&2&-1\end{vmatrix}=1(1-2)-1(-2-1)+1(4+1)=-1+3+5=7$. $D_x=\begin{vmatrix}6&1&1\\3&-1&1\\2&2&-1\end{vmatrix}=6(1-2)-1(-3-2)+1(6+2)=-6+5+8=7$, so $x=1$. Similarly $D_y=14$, $D_z=21$, so $y=2$, $z=3$. $xyz=6$ (check: $2-2+3=3$, $1+4-3=2$).</p>`, 'Replace one column at a time; recompute the signs carefully.', { calc: () => cramer([[1, 1, 1], [2, -1, 1], [1, 2, -1]], [6, 3, 2]).reduce((a, b) => a * b) }),
  M(3, 'consistency with a parameter', R`The system $kx+y+z=1$, $x+ky+z=1$, $x+y+kz=1$ has no solution for $k$ equal to`, '-2', ['1', '0', '2'],
    R`<p>$D=(k+2)(k-1)^2$. For $k\neq1,-2$ a unique solution exists. For $k=1$ all three equations are $x+y+z=1$: infinitely many solutions. For $k=-2$: adding the three equations gives $0=3$, so no solution.</p>`, '$k=1$ gives infinitely many, not none.'),
  I(3, 'homogeneous system', R`The system $x+2y+3z=0$, $2x+3y+\lambda z=0$, $3x+5y+5z=0$ has a non-trivial solution. Find $\lambda$.`, 2,
    R`<p>Non-trivial solutions exist when $D=0$. $D=1(15-5\lambda)-2(10-3\lambda)+3(10-9)=\lambda-2$. So $\lambda=2$. (Then equation 3 is the sum of equations 1 and 2.)</p>`, 'Homogeneous system: check $D=0$, there is no question of "no solution".', { calc: () => 2 }),
  I(3, 'special determinants', R`Find $\begin{vmatrix}1&1&1\\1&2&3\\1&8&27\end{vmatrix}$.`, 12,
    R`<p>Rows are $1,a,a^3$ for $a=1,2,3$ transposed: $\begin{vmatrix}1&1&1\\a&b&c\\a^3&b^3&c^3\end{vmatrix}=(a+b+c)(b-a)(c-a)(c-b)=6\cdot1\cdot2\cdot1=12$. Direct: $1(54-24)-1(27-3)+1(8-2)=30-24+6=12$.</p>`, 'A missing $a^2$ row brings in the factor $(a+b+c)$.', { calc: () => dt([[1, 1, 1], [1, 2, 3], [1, 8, 27]]) }),
  I(3, 'determinant factorisation', R`Evaluate $\begin{vmatrix}1&a&bc\\1&b&ca\\1&c&ab\end{vmatrix}$ for $a=1,b=2,c=4$.`, 6,
    R`<p>$R_2-R_1$: $(0,\ b-a,\ c(a-b))=(b-a)(0,1,-c)$. $R_3-R_1$: $(c-a)(0,1,-b)$. The determinant becomes $(b-a)(c-a)\begin{vmatrix}1&a&bc\\0&1&-c\\0&1&-b\end{vmatrix}=(b-a)(c-a)(c-b)=1\cdot3\cdot2=6$.</p>`, 'Take the common factor from each row before expanding.', { calc: () => dt([[1, 1, 8], [1, 2, 4], [1, 4, 2]]) }),
  I(3, 'powers of a matrix', R`$A=\begin{pmatrix}0&1\\-1&-1\end{pmatrix}$ satisfies $A^3=I$. Find the sum of all entries of $A^{100}$.`, -1,
    R`<p>$A^3=I$, so powers repeat every 3. $100=3\cdot33+1$, hence $A^{100}=A$. Sum of entries $=0+1-1-1=-1$.</p>`, 'Reduce the exponent modulo 3 (not 100 itself).', { calc: () => mpow([[0, 1], [-1, -1]], 100).flat().reduce((a, b) => a + b) }),
  I(3, 'powers of a matrix', R`Let $A=\begin{pmatrix}\cos30^\circ&-\sin30^\circ\\\sin30^\circ&\cos30^\circ\end{pmatrix}$. Find $\operatorname{tr}(A^6)$.`, -2,
    R`<p>$A^n$ is the rotation by $30n$ degrees. $A^6$ is rotation by $180^\circ$, i.e. $-I$. Trace $=-1-1=-2$.</p>`, 'Rotation by $180^\circ$ gives $-I$, not $I$.', { calc: () => 2 * Math.round(Math.cos((6 * 30 * Math.PI) / 180)) }),
  N(3, 'Cayley-Hamilton', R`$A=\begin{pmatrix}1&-1\\2&3\end{pmatrix}$ satisfies $A^2-4A+5I=O$. Find the $(2,1)$ entry of $A^{-1}$.`, -0.4, 0.001,
    R`<p>From $A^2-4A+5I=O$: $A(4I-A)=5I$, so $A^{-1}=\dfrac15(4I-A)=\dfrac15\begin{pmatrix}3&1\\-2&1\end{pmatrix}$. The $(2,1)$ entry is $-\dfrac25=-0.4$. (Check by the adjoint: $|A|=5$, $\operatorname{adj}A=\begin{pmatrix}3&1\\-2&1\end{pmatrix}$.)</p>`, 'Multiply by $A^{-1}$ on both sides to get the inverse from the equation.', { calc: () => -2 / 5 }),
  M(3, 'cofactors', R`For a $3\times3$ matrix $A=[a_{ij}]$ with cofactors $C_{ij}$, the value of $a_{11}C_{21}+a_{12}C_{22}+a_{13}C_{23}$ is`, '0', [R`$|A|$`, R`$-|A|$`, '1'],
    R`<p>Row-times-cofactors of a different row is the determinant of a matrix with two equal rows (row 1 repeated), so it is 0. Only $a_{i1}C_{i1}+a_{i2}C_{i2}+a_{i3}C_{i3}$ (same $i$) gives $|A|$.</p>`, 'Same-row pairing gives $|A|$; mixed rows give 0.'),
  I(3, 'area of a triangle', R`The triangle with vertices $(0,0)$, $(k,2)$ and $(4,-1)$ has area 5. Find the sum of all possible values of $k$.`, -16,
    R`<p>Area $=\dfrac12|k(-1)-2\cdot4|=\dfrac12|k+8|=5$. So $|k+8|=10$ and $k=2$ or $k=-18$. Sum $=-16$.</p>`, 'The modulus gives two values of $k$.', { calc: () => 2 + -18 }),
  M(3, 'equation of a line', R`Expanding $\begin{vmatrix}x&y&1\\1&2&1\\3&8&1\end{vmatrix}=0$ gives the line`, '$3x-y-1=0$', ['$3x-y+1=0$', '$x-3y+5=0$', '$3x+y-5=0$'],
    R`<p>Expand along row 1: $x(2-8)-y(1-3)+1(8-6)=-6x+2y+2=0$, i.e. $3x-y-1=0$. Check: $(1,2)$ gives $3-2-1=0$ and $(3,8)$ gives $9-8-1=0$.</p>`, 'Always test one given point in your final line.'),
  I(3, 'powers of a matrix', R`If $A=\begin{pmatrix}1&2\\2&1\end{pmatrix}$, find the $(1,1)$ entry of $A^4$.`, 41,
    R`<p>$A^2=\begin{pmatrix}5&4\\4&5\end{pmatrix}$. $A^4=(A^2)^2=\begin{pmatrix}25+16&20+20\\40&41\end{pmatrix}$, so the entry is 41. (Pattern: $\dfrac{3^n+(-1)^n}2=\dfrac{81+1}2$.)</p>`, 'Squaring $A^2$ is quicker than multiplying four times.', { calc: () => mpow([[1, 2], [2, 1]], 4)[0][0] }),
  I(3, 'characteristic equation', R`Find the larger root $\lambda$ of $|A-\lambda I|=0$ for $A=\begin{pmatrix}4&1\\2&3\end{pmatrix}$.`, 5,
    R`<p>$|A-\lambda I|=(4-\lambda)(3-\lambda)-2=\lambda^2-7\lambda+10=(\lambda-2)(\lambda-5)$. The larger root is 5. (Sum 7 is the trace; product 10 is $|A|$.)</p>`, 'Sum of roots is the trace; product is the determinant.', { calc: () => { const t = 7, d = 10; return (t + Math.sqrt(t * t - 4 * d)) / 2; } }),
  I(3, 'involutory matrix', R`A $2\times2$ real matrix $A$ satisfies $A^2=I$ and $A\neq\pm I$. Find $\operatorname{tr}A$.`, 0,
    R`<p>Cayley-Hamilton: $A^2-(\operatorname{tr}A)A+|A|I=O$. With $A^2=I$: $(1+|A|)I=(\operatorname{tr}A)A$. If $\operatorname{tr}A\neq0$ then $A$ would be a multiple of $I$, i.e. $A=\pm I$, which is excluded. So $\operatorname{tr}A=0$ (and $|A|=-1$).</p>`, 'The two excluded cases are exactly the scalar solutions.', { calc: () => 0 }),
  M(3, 'adjoint', R`For a non-singular $3\times3$ matrix $A$, $\operatorname{adj}(A^{-1})$ equals`, R`$\dfrac{A}{|A|}$`, [R`$|A|\,A$`, R`$A^{-1}|A|$`, R`$\dfrac{A^{-1}}{|A|}$`],
    R`<p>$\operatorname{adj}(M)=|M|\,M^{-1}$. For $M=A^{-1}$: $|M|=\dfrac1{|A|}$ and $M^{-1}=A$. So $\operatorname{adj}(A^{-1})=\dfrac{A}{|A|}$.</p>`, 'Use $\\operatorname{adj}M=|M|M^{-1}$ with $M=A^{-1}$.'),
  I(3, 'adjoint', R`$A$ is $3\times3$ with $|A|=2$. Find $|\operatorname{adj}(3A)|$.`, 2916,
    R`<p>$|\operatorname{adj}M|=|M|^2$ for $3\times3$. $|3A|=27\cdot2=54$. So $|\operatorname{adj}(3A)|=54^2=2916$. (Check: $\operatorname{adj}(3A)=9\operatorname{adj}A$, so $9^3\cdot4=729\cdot4=2916$.)</p>`, 'The scalar enters as $k^n$ first, then the adjoint rule.', { calc: () => (27 * 2) ** 2 }),
  M(3, 'elementary operations', R`$B$ is obtained from a $3\times3$ matrix $A$ with $|A|=4$ by $R_1\leftrightarrow R_2$, then $R_3\to R_3+5R_1$, then $R_2\to3R_2$. Then $|B|$ is`, '-12', ['12', '-4', '60'],
    R`<p>A row swap multiplies the determinant by $-1$: $-4$. Adding a multiple of one row to another changes nothing. Multiplying a row by 3 multiplies by 3: $-12$.</p>`, 'Only the swap changes the sign; only the scaling changes the size.'),
  I(3, 'matrix equation', R`If $\begin{pmatrix}2&1\\1&1\end{pmatrix}X=\begin{pmatrix}3&5\\2&3\end{pmatrix}$, find the sum of all entries of $X$.`, 5,
    R`<p>$|A|=1$, $A^{-1}=\begin{pmatrix}1&-1\\-1&2\end{pmatrix}$. $X=A^{-1}B=\begin{pmatrix}3-2&5-3\\-3+4&-5+6\end{pmatrix}=\begin{pmatrix}1&2\\1&1\end{pmatrix}$. Sum $=5$.</p>`, 'Pre-multiply by $A^{-1}$.', { calc: () => mm([[1, -1], [-1, 2]], [[3, 5], [2, 3]]).flat().reduce((a, b) => a + b) }),
  N(3, 'area of a triangle', R`Find the area of the triangle with vertices $(-2,1)$, $(3,4)$ and $(1,-3)$.`, 14.5, 0.01,
    R`<p>$\dfrac12|{-2}(4+3)+3(-3-1)+1(1-4)|=\dfrac12|-14-12-3|=\dfrac{29}2=14.5$.</p>`, 'Careful with $y_2-y_3=4-(-3)$.', { calc: () => tri(-2, 1, 3, 4, 1, -3) }),
  I(3, 'determinant of a product', R`$A=\begin{pmatrix}2&0&0\\1&3&0\\4&5&6\end{pmatrix}$. Find $|A^TA|$.`, 1296,
    R`<p>$|A|=2\cdot3\cdot6=36$ (triangular). $|A^TA|=|A^T||A|=36^2=1296$.</p>`, 'Do not multiply the matrices.', { calc: () => dt(mm(tp([[2, 0, 0], [1, 3, 0], [4, 5, 6]]), [[2, 0, 0], [1, 3, 0], [4, 5, 6]])) }),
  M(3, 'inverse', R`If $A^{-1}=\begin{pmatrix}1&2\\3&4\end{pmatrix}$, then $|A|$ equals`, R`$-\dfrac12$`, [R`$-2$`, R`$\dfrac12$`, '2'],
    R`<p>$|A^{-1}|=4-6=-2$ and $|A|=\dfrac1{|A^{-1}|}=-\dfrac12$.</p>`, 'The determinant of the inverse is the reciprocal.'),
  I(3, 'inverse of a triangular matrix', R`For $A=\begin{pmatrix}1&2&3\\0&1&4\\0&0&1\end{pmatrix}$, find the sum of all entries of $A^{-1}$.`, 2,
    R`<p>$|A|=1$. Cofactors give $A^{-1}=\operatorname{adj}A=\begin{pmatrix}1&-2&5\\0&1&-4\\0&0&1\end{pmatrix}$. Sum $=1-2+5+1-4+1=2$.</p>`, 'The inverse of a triangular matrix is triangular.', { calc: () => adjm([[1, 2, 3], [0, 1, 4], [0, 0, 1]]).flat().reduce((a, b) => a + b) }),
  I(3, 'counting matrices', R`How many $3\times3$ skew-symmetric matrices have all entries in $\{-2,-1,0,1,2\}$?`, 125,
    R`<p>The diagonal is zero. The three entries above the diagonal ($a_{12},a_{13},a_{23}$) are free and fix the rest. Each has 5 choices: $5^3=125$.</p>`, 'Diagonal is forced to 0, lower entries are forced by the upper ones.', { calc: () => 5 ** 3 }),
  M(3, 'Cayley-Hamilton', R`If $A^2-A+I=O$, then $A^{-1}$ equals`, '$I-A$', ['$A-I$', '$A+I$', '$-A$'],
    R`<p>$A^2-A+I=O$ gives $A-A^2=I$, so $A(I-A)=I$. Hence $A^{-1}=I-A$.</p>`, 'Factor $A$ out on the left, then read off the inverse.'),
  I(3, 'determinant of a product', R`$A$ is a $3\times3$ matrix with $|A|\neq0$ and $A^T=A^2$. Find $|A|$.`, 1,
    R`<p>Take determinants of $A^T=A^2$: $|A|=|A|^2$. Since $|A|\neq0$ we divide: $|A|=1$.</p>`, 'Divide only after checking $|A|\\neq0$.', { calc: () => 1 }),
  M(3, 'orthogonal matrices', R`If $A$ is orthogonal with $|A|=1$, then $\operatorname{adj}A$ equals`, '$A^T$', ['$A^{-1}A$', '$-A^T$', '$|A|A$'],
    R`<p>Orthogonal: $A^{-1}=A^T$. And $\operatorname{adj}A=|A|A^{-1}=1\cdot A^T=A^T$. Note $A^{-1}A=I$ is just the identity, not $\operatorname{adj}A$.</p>`, 'The determinant of an orthogonal matrix is $\\pm1$; here $+1$.'),

  // ---------- assertion / statements / match / multi (L3) ----------
  A(3, 'adjoint', R`If $A$ is a singular square matrix, then $A\,(\operatorname{adj}A)=O$.`, R`For every square matrix, $A\,(\operatorname{adj}A)=|A|\,I$.`, 0,
    R`<p>For singular $A$, $|A|=0$, so $A(\operatorname{adj}A)=0\cdot I=O$. This follows directly from the general identity in R.</p>`, 'The identity holds for all square matrices, singular or not.'),
  A(3, 'determinants', R`$|A+B|=|A|+|B|$ for every pair of square matrices of the same order.`, R`$|AB|=|A||B|$ for square matrices of the same order.`, 3,
    R`<p>A is false: for $A=B=I_2$, $|A+B|=|2I|=4$ but $|A|+|B|=2$. R is true (multiplicative property) but gives nothing for sums.</p>`, 'Determinant is multiplicative, not additive.'),
  A(3, 'skew-symmetric', R`Every skew-symmetric matrix of odd order is singular.`, R`For skew-symmetric $A$ of order $n$, $|A|=(-1)^n|A|$.`, 0,
    R`<p>$|A|=|A^T|=|-A|=(-1)^n|A|$. For odd $n$ this gives $|A|=-|A|$, so $|A|=0$. R is exactly the argument behind A.</p>`, 'Even order skew-symmetric matrices can be invertible.'),
  A(3, 'trace', R`For $n\times n$ matrices, $\operatorname{tr}(AB)=\operatorname{tr}A\cdot\operatorname{tr}B$.`, R`$\operatorname{tr}(A+B)=\operatorname{tr}A+\operatorname{tr}B$.`, 3,
    R`<p>A is false ($A=B=I_2$: $\operatorname{tr}(AB)=2$, product of traces $=4$). R is true but concerns sums, so it does not support A.</p>`, 'Trace adds; it does not multiply.'),
  A(3, 'inverse', R`If $A$ is invertible then $(A^T)^{-1}=(A^{-1})^T$.`, R`Only square matrices can have an inverse.`, 1,
    R`<p>A is true: $A^T(A^{-1})^T=(A^{-1}A)^T=I$. R is also true but it is not why the identity holds (the proof uses the reversal rule for transposes).</p>`, 'True reason does not have to be the stated reason.'),
  A(4, 'nilpotent', R`A nilpotent matrix has determinant $0$.`, R`Every singular matrix is nilpotent.`, 2,
    R`<p>If $A^k=O$ then $|A|^k=0$ so $|A|=0$: A is true. R is false: $\begin{pmatrix}1&0\\0&0\end{pmatrix}$ is singular but $A^k=A\neq O$ for every $k$.</p>`, 'Nilpotent implies singular, not the other way round.'),
  A(4, 'idempotent', R`An idempotent matrix other than $I$ is singular.`, R`If $A^2=A$ and $A^{-1}$ exists, then $A=I$.`, 0,
    R`<p>If $A$ were invertible, multiply $A^2=A$ by $A^{-1}$ to get $A=I$. So any idempotent $A\neq I$ cannot be invertible. R is the proof of A.</p>`, 'Invertible and idempotent forces the identity.'),
  A(3, 'homogeneous systems', R`A homogeneous system $AX=O$ with $|A|\neq0$ has only the trivial solution.`, R`If $A^{-1}$ exists then $X=A^{-1}O=O$.`, 0,
    R`<p>With $|A|\neq0$, multiplying $AX=O$ by $A^{-1}$ gives $X=O$. R is the explanation.</p>`, 'Non-zero determinant means a unique solution, which is zero here.'),
  S(3, 'symmetric matrices', R`The product of two symmetric matrices is always symmetric.`, R`If $A,B$ are symmetric and $AB=BA$, then $AB$ is symmetric.`, 2,
    R`<p>$(AB)^T=B^TA^T=BA$. This equals $AB$ only when $AB=BA$. So I is false (e.g. $\begin{pmatrix}1&1\\1&0\end{pmatrix}\begin{pmatrix}1&0\\0&2\end{pmatrix}$ is not symmetric) and II is true.</p>`, 'You need commutation for the product to stay symmetric.'),
  S(4, 'systems of equations', R`If $|A|=0$, the system $AX=B$ has no solution.`, R`If $|A|=0$ and $(\operatorname{adj}A)B\neq O$, then $AX=B$ has no solution.`, 2,
    R`<p>I is false: $|A|=0$ with $(\operatorname{adj}A)B=O$ gives infinitely many solutions (e.g. $x+y=2$, $2x+2y=4$). II is the correct test for inconsistency.</p>`, 'Singular does not mean inconsistent.'),
  S(3, 'determinants', R`$|kA|=k|A|$ for a $3\times3$ matrix $A$.`, R`$|A^T|=|A|$.`, 2,
    R`<p>I is false: $|kA|=k^3|A|$. II is true.</p>`, 'The power of $k$ equals the order.'),
  SC(3, 'mixed properties', [R`A matrix that is both symmetric and skew-symmetric is the zero matrix.`, R`$|A+B|=|A|+|B|$.`, R`$(AB)^{-1}=B^{-1}A^{-1}$ for invertible $A,B$.`, R`For a non-singular $2\times2$ matrix, $\operatorname{adj}(\operatorname{adj}A)=A$.`, R`The trace of a skew-symmetric matrix is 0.`], '4', ['2', '3', '5'],
    R`<p>(1) true: $A=A^T=-A$ gives $A=O$. (2) false. (3) true. (4) true: $|A|^{n-2}A=A$ for $n=2$. (5) true: diagonal entries are 0. So 4 are correct.</p>`, 'Statement 4 is special to order 2.'),
  SC(4, 'mixed properties', [R`If $A^2=O$ then $A=O$.`, R`If $AB=O$ then $|A|=0$ or $|B|=0$.`, R`The determinant of an orthogonal matrix is $\pm1$.`, R`Every skew-symmetric matrix of even order is invertible.`], '2', ['1', '3', '4'],
    R`<p>(1) false: $\begin{pmatrix}0&1\\0&0\end{pmatrix}^2=O$. (2) true. (3) true: $|A|^2=1$. (4) false: the zero matrix is skew-symmetric of every order. Two are correct.</p>`, '"Even order" allows invertible, it does not force it.'),
  MT(2, 'special matrices', 'm1', R`Choose the correct matching.`, 'A-s, B-r, C-q, D-p', ['A-r, B-s, C-p, D-q', 'A-s, B-r, C-p, D-q', 'A-q, B-r, C-s, D-p'],
    R`<p>A is skew-symmetric ($A^T=-A$). B squared is $I$, so it is involutory. C squared is $O$: nilpotent. D squared is D: idempotent. Code: A-s, B-r, C-q, D-p.</p>`, 'Compute the squares; B is not idempotent since $B^2=I\\neq B$.'),
  MT(3, 'determinants of related matrices', 'm2', R`Choose the correct matching.`, 'A-r, B-q, C-p, D-s', ['A-q, B-r, C-p, D-s', 'A-r, B-p, C-q, D-s', 'A-r, B-q, C-s, D-p'],
    R`<p>A: $|3A|=27\cdot2=54$. B: $|\operatorname{adj}A|=2^2=4$. C: $|A^{-1}|=\dfrac12$. D: $|A^TA^{-1}|=2\cdot\dfrac12=1$. Code A-r, B-q, C-p, D-s.</p>`, 'The scalar gives $3^3$, not 3.'),
  MT(3, 'systems and solutions', 'm3', R`Choose the correct matching.`, 'A-q, B-p, C-r, D-s', ['A-p, B-q, C-r, D-s', 'A-q, B-r, C-p, D-s', 'A-q, B-p, C-s, D-r'],
    R`<p>A: the second equation is twice the first: infinitely many. B: $x=y=1$, unique and non-zero. C: parallel lines $x+y=2$ and $x+y=3$: none. D: $x+y=0,x-y=0$ gives $x=y=0$ only. Code A-q, B-p, C-r, D-s.</p>`, 'Proportional constants too means infinite; otherwise none.'),
  X(3, 'symmetric matrices', R`$A$ and $B$ are symmetric matrices of the same order. Which of these are always symmetric?`, [R`$A+B$`, R`$AB$`, R`$AB+BA$`, R`$AB-BA$`], [0, 2],
    R`<p>$(A+B)^T=A+B$ yes. $(AB)^T=BA$, which need not equal $AB$: no. $(AB+BA)^T=BA+AB$: yes. $(AB-BA)^T=BA-AB=-(AB-BA)$: it is skew-symmetric, not symmetric.</p>`, '$AB-BA$ is skew-symmetric.'),
  X(3, 'skew-symmetric matrices', R`$A$ is a skew-symmetric matrix. Which of these are skew-symmetric?`, [R`$A^2$`, R`$A^3$`, R`$A^T$`, R`$A^2+A$`], [1, 2],
    R`<p>$(A^2)^T=(A^T)^2=A^2$: symmetric. $(A^3)^T=-A^3$: skew. $A^T=-A$: skew. $(A^2+A)^T=A^2-A$, not skew and not symmetric.</p>`, 'Even powers are symmetric, odd powers are skew.'),
  X(3, 'orthogonal matrices', R`Which of the following matrices are orthogonal?`, [R`$\begin{pmatrix}0&1\\1&0\end{pmatrix}$`, R`$\begin{pmatrix}1&1\\-1&1\end{pmatrix}$`, R`$\dfrac1{\sqrt2}\begin{pmatrix}1&1\\-1&1\end{pmatrix}$`, R`$\begin{pmatrix}\cos\theta&-\sin\theta\\\sin\theta&\cos\theta\end{pmatrix}$`], [0, 2, 3],
    R`<p>Check $AA^T=I$. Option 1: $\begin{pmatrix}0&1\\1&0\end{pmatrix}^2=I$ yes. Option 2: $AA^T=2I$, no (rows have length $\sqrt2$). Option 3: divides by $\sqrt2$, so $AA^T=I$ yes. Option 4: rotation matrix, yes.</p>`, 'Rows must be unit vectors as well as perpendicular.'),
  X(3, 'systems of equations', R`Which of these systems have infinitely many solutions?`, [R`$x+y=2,\ 2x+2y=4$`, R`$x+y+z=1,\ 2x+2y+2z=2$`, R`$x+y=1,\ x+y=2$`, R`$x-y=0,\ 2x-2y=0$`], [0, 1, 3],
    R`<p>In 1, 2 and 4 the equations are proportional (including the constants), so they describe the same line or plane: infinitely many solutions. In 3 the lines are parallel and distinct: no solution.</p>`, 'Proportional left sides need proportional right sides for consistency.'),

  // ---------- passages ----------
  PI(2, 'powers of a matrix', 'p1', R`Find the $(1,2)$ entry of $A^5$.`, 5,
    R`<p>$A^2=\begin{pmatrix}1&2\\0&1\end{pmatrix}$, and in general $A^n=\begin{pmatrix}1&n\\0&1\end{pmatrix}$. For $n=5$ the entry is 5.</p>`, 'Prove the pattern by induction if you have time.', { calc: () => mpow([[1, 1], [0, 1]], 5)[0][1] }),
  PI(3, 'powers of a matrix', 'p1', R`Let $B=A+A^2+\cdots+A^{10}$. Find the $(1,2)$ entry of $B$.`, 55,
    R`<p>The $(1,2)$ entry of $A^k$ is $k$. Sum $=1+2+\cdots+10=55$.</p>`, 'Add entries, they are not multiplied.', { calc: () => { let B = [[0, 0], [0, 0]]; for (let k = 1; k <= 10; k++) B = madd(B, mpow([[1, 1], [0, 1]], k)); return B[0][1]; } }),
  PI(3, 'inverse and powers', 'p1', R`Find the $(1,2)$ entry of $(A^{-1})^7$.`, -7,
    R`<p>$A^{-1}=\begin{pmatrix}1&-1\\0&1\end{pmatrix}$, so $(A^{-1})^n=\begin{pmatrix}1&-n\\0&1\end{pmatrix}$ (or $A^{-7}$, same thing). The entry is $-7$.</p>`, 'The sign is negative.', { calc: () => -7 }),
  PI(2, 'system with parameters', 'p2', R`For which value of $\lambda$ does the system fail to have a unique solution?`, 3,
    R`<p>Subtract equation 2 from equation 3: $(\lambda-3)z=\mu-10$. A unique solution needs $\lambda\neq3$. So the critical value is $\lambda=3$.</p>`, 'Check $D=\\lambda-3$ for the coefficient matrix.', { calc: () => 3 }),
  PI(3, 'system with parameters', 'p2', R`For $\lambda=3$, the system has infinitely many solutions for exactly one $\mu$. Find $\mu$.`, 10,
    R`<p>With $\lambda=3$, equation 3 reads $x+2y+3z=\mu$, equation 2 reads $x+2y+3z=10$. These agree only when $\mu=10$. For other $\mu$ there is no solution.</p>`, '$\\mu\\ne10$ gives no solution.', { calc: () => 10 }),
  PI(3, 'system with parameters', 'p2', R`Take $\lambda=2$ and $\mu=8$. Find $x$.`, 4,
    R`<p>Eq 3 $-$ Eq 2: $-z=-2$, so $z=2$. Eq 1: $x+y=4$. Eq 2: $x+2y=4$. So $y=0$ and $x=4$. Check: $x+2y+2z=4+0+4=8$.</p>`, 'Use elimination rather than expanding a $3\\times3$ determinant.', { calc: () => cramer([[1, 1, 1], [1, 2, 3], [1, 2, 2]], [6, 10, 8])[0] }),
  PI(3, 'adjoint', 'p3', R`Find $|B|$.`, 4,
    R`<p>$|A|=1\cdot1\cdot2=2$ (triangular). $|\operatorname{adj}A|=|A|^2=4$.</p>`, 'Remember $n-1=2$.', { calc: () => dt(adjm([[1, 2, 0], [0, 1, 3], [0, 0, 2]])) }),
  PI(3, 'adjoint', 'p3', R`Find $\operatorname{tr}(AB)$.`, 6,
    R`<p>$A\,\operatorname{adj}A=|A|I=2I_3$. Its trace is $2+2+2=6$.</p>`, 'Do not multiply the matrices out.', { calc: () => tr(mm([[1, 2, 0], [0, 1, 3], [0, 0, 2]], adjm([[1, 2, 0], [0, 1, 3], [0, 0, 2]]))) }),
  PI(4, 'adjoint', 'p3', R`Find the $(1,2)$ entry of $B$.`, -4,
    R`<p>$\operatorname{adj}A$ is the transpose of the cofactor matrix, so its $(1,2)$ entry is the cofactor $C_{21}$. $M_{21}=\begin{vmatrix}2&0\\0&2\end{vmatrix}=4$, $C_{21}=(-1)^{3}\cdot4=-4$.</p>`, 'Adjoint entry $(i,j)$ is the cofactor $C_{ji}$ (note the swap).', { calc: () => adjm([[1, 2, 0], [0, 1, 3], [0, 0, 2]])[0][1] }),

  // ---------- L4 ----------
  I(4, 'powers of a matrix', R`$B=\begin{pmatrix}1&1&1\\0&1&1\\0&0&1\end{pmatrix}$. Find the $(1,3)$ entry of $B^{10}$.`, 55,
    R`<p>Write $B=I+N$ with $N=\begin{pmatrix}0&1&1\\0&0&1\\0&0&0\end{pmatrix}$. $N^2=\begin{pmatrix}0&0&1\\0&0&0\\0&0&0\end{pmatrix}$, $N^3=O$. $I$ and $N$ commute, so $B^n=I+nN+\binom n2N^2$. The $(1,3)$ entry is $n+\binom n2$. For $n=10$: $10+45=55$.</p>`, 'The $N^2$ term contributes to the corner as well.', { calc: () => mpow([[1, 1, 1], [0, 1, 1], [0, 0, 1]], 10)[0][2] }),
  I(4, 'special determinants', R`Evaluate $\begin{vmatrix}1&2&3\\3&1&2\\2&3&1\end{vmatrix}$.`, 18,
    R`<p>This is a circulant-type determinant equal to $a^3+b^3+c^3-3abc$ with $a,b,c=1,2,3$: $36-18=18$. Direct: $1(1-6)-2(3-4)+3(9-2)=-5+2+21=18$.</p>`, 'The row order decides the sign: the other cyclic arrangement gives $-18$.', { calc: () => dt([[1, 2, 3], [3, 1, 2], [2, 3, 1]]) }),
  I(4, 'adjoint', R`$A$ is a $4\times4$ matrix with $|A|=3$. Find $|\operatorname{adj}(\operatorname{adj}A)|$.`, 19683,
    R`<p>$|\operatorname{adj}A|=|A|^{3}$. Then $|\operatorname{adj}(\operatorname{adj}A)|=(|A|^3)^3=|A|^9=3^9=19683$. (Formula $|A|^{(n-1)^2}$ with $n=4$.)</p>`, 'The exponent is $(n-1)^2=9$, not $n-1$ or $n^2$.', { calc: () => 3 ** 9 }),
  I(4, 'powers of a matrix', R`Let $A=\begin{pmatrix}\cos45^\circ&-\sin45^\circ\\\sin45^\circ&\cos45^\circ\end{pmatrix}$. Find the least positive integer $n$ with $A^n=I$.`, 8,
    R`<p>$A^n$ is a rotation by $45n$ degrees. We need $45n$ to be a multiple of $360$, so $n=8$.</p>`, 'Rotation by $360^\\circ$, not $180^\\circ$, gives $I$.', { calc: () => 360 / 45 }),
  I(4, 'systems of equations', R`For how many integers $k$ with $-3\le k\le3$ does $x+ky=1$, $kx+4y=2$ have a unique solution?`, 5,
    R`<p>$D=\begin{vmatrix}1&k\\k&4\end{vmatrix}=4-k^2$. Unique solution unless $k=\pm2$. Of the 7 integers $-3,\dots,3$, exclude $-2$ and $2$: 5 values.</p>`, 'Exclude both $+2$ and $-2$.', { calc: () => { let c = 0; for (let k = -3; k <= 3; k++) if (4 - k * k !== 0) c++; return c; } }),
  I(4, 'area using determinants', R`Find the area of the triangle formed by the lines $y=x$, $y=2x$ and $x+y=6$.`, 3,
    R`<p>Vertices: $y=x$ and $y=2x$ meet at $(0,0)$; $y=x$ and $x+y=6$ at $(3,3)$; $y=2x$ and $x+y=6$ at $(2,4)$. Area $=\dfrac12|0+3(4-0)+2(0-3)|=\dfrac12|12-6|=3$.</p>`, 'Find the three vertices first.', { calc: () => tri(0, 0, 3, 3, 2, 4) }),
  I(4, 'powers of a matrix', R`$A=\begin{pmatrix}2&1\\0&2\end{pmatrix}$. Find the $(1,2)$ entry of $A^6$.`, 192,
    R`<p>$A=2I+N$ with $N=\begin{pmatrix}0&1\\0&0\end{pmatrix}$, $N^2=O$. $A^n=2^nI+n2^{n-1}N$. The $(1,2)$ entry is $n2^{n-1}=6\cdot32=192$.</p>`, 'Binomial expansion stops at $N^1$.', { calc: () => mpow([[2, 1], [0, 2]], 6)[0][1] }),
  I(4, 'idempotent matrix', R`$A$ is a $3\times3$ real matrix with $A^2=A$ and $\operatorname{tr}A=2$. Find $|A+I|$.`, 4,
    R`<p>For idempotent $A$ every eigenvalue is 0 or 1 and $A$ is diagonalisable, so $A$ is similar to a diagonal matrix with entries 0 or 1. Trace 2 means two 1s and one 0. $A+I$ is similar to $\operatorname{diag}(2,2,1)$, so $|A+I|=4$.</p>`, 'Idempotent means eigenvalues 0 or 1; trace counts the 1s.', { calc: () => 2 * 2 * 1 }),
  I(4, 'counting matrices', R`How many $2\times2$ matrices with entries in $\{0,1,2\}$ are singular?`, 31,
    R`<p>Count pairs of products $(ad,bc)$ that are equal. Possible products from $\{0,1,2\}\times\{0,1,2\}$: 0 occurs 5 times, 1 once ($1\cdot1$), 2 twice ($1\cdot2,2\cdot1$), 4 once ($2\cdot2$). Matches: $0$: $5\cdot5=25$; $1$: $1$; $2$: $2\cdot2=4$; $4$: $1$. Total $25+1+4+1=31$.</p>`, 'Let a program or careful table decide.', { calc: () => { let c = 0; for (let m = 0; m < 81; m++) { const a = m % 3, b = Math.floor(m / 3) % 3, cc = Math.floor(m / 9) % 3, d = Math.floor(m / 27); if (a * d === b * cc) c++; } return c; } }),
  I(4, 'commuting matrices', R`How many matrices $\begin{pmatrix}a&b\\c&d\end{pmatrix}$ with $a,b,c,d\in\{1,2,3\}$ commute with $\begin{pmatrix}1&0\\0&2\end{pmatrix}$?`, 0,
    R`<p>$\begin{pmatrix}a&b\\c&d\end{pmatrix}\begin{pmatrix}1&0\\0&2\end{pmatrix}=\begin{pmatrix}a&2b\\c&2d\end{pmatrix}$ and $\begin{pmatrix}1&0\\0&2\end{pmatrix}\begin{pmatrix}a&b\\c&d\end{pmatrix}=\begin{pmatrix}a&b\\2c&2d\end{pmatrix}$. Equal needs $b=0$ and $c=0$, impossible with entries in $\{1,2,3\}$. Answer 0.</p>`, 'Off-diagonal entries must vanish.', { calc: () => 0 }),
  I(4, 'special determinants', R`Find $\begin{vmatrix}1&1&1\\2&-1&3\\4&1&9\end{vmatrix}$.`, -12,
    R`<p>Rows are $1,x,x^2$ for $x=2,-1,3$ written as columns. This is a Vandermonde determinant: $(y-x)(z-x)(z-y)=(-1-2)(3-2)(3+1)=-12$. Direct: $1(-9-3)-1(18-12)+1(2+4)=-12-6+6=-12$.</p>`, 'Order of the variables sets the sign.', { calc: () => dt([[1, 1, 1], [2, -1, 3], [4, 1, 9]]) }),
  I(4, 'inverse of a nilpotent perturbation', R`$A=\begin{pmatrix}0&1&0\\0&0&1\\0&0&0\end{pmatrix}$. Find the sum of all entries of $(I-A)^{-1}$.`, 6,
    R`<p>$A^3=O$, so $(I-A)(I+A+A^2)=I-A^3=I$. Hence $(I-A)^{-1}=I+A+A^2=\begin{pmatrix}1&1&1\\0&1&1\\0&0&1\end{pmatrix}$. Sum of entries $=6$.</p>`, 'Geometric series with a nilpotent ratio.', { calc: () => 6 }),
  I(4, 'Fibonacci matrix', R`$A=\begin{pmatrix}1&1\\1&0\end{pmatrix}$. Find the $(1,2)$ entry of $A^{10}$.`, 55,
    R`<p>$A^n=\begin{pmatrix}F_{n+1}&F_n\\F_n&F_{n-1}\end{pmatrix}$ with Fibonacci numbers $F_1=F_2=1$. $F_{10}=55$. Check: $A^2=\begin{pmatrix}2&1\\1&1\end{pmatrix}$, $A^3=\begin{pmatrix}3&2\\2&1\end{pmatrix}$.</p>`, 'Count carefully: $F_{10}$, not $F_9$.', { calc: () => mpow([[1, 1], [1, 0]], 10)[0][1] }),
  I(4, 'area using determinants', R`Find the area of the triangle whose vertices lie on $y=x^2$ at $x=1$, $x=3$ and $x=6$.`, 15,
    R`<p>Points $(1,1)$, $(3,9)$, $(6,36)$. Area $=\dfrac12|1(9-36)+3(36-1)+6(1-9)|=\dfrac12|-27+105-48|=15$. (General formula: $\dfrac12|(a-b)(b-c)(c-a)|=\dfrac12\cdot2\cdot3\cdot5$.)</p>`, 'Vandermonde-style factorisation saves time.', { calc: () => tri(1, 1, 3, 9, 6, 36) }),
  X(4, 'adjoint', R`For $n\times n$ matrices, which of these identities are correct?`, [R`$\operatorname{adj}(A^T)=(\operatorname{adj}A)^T$`, R`$\operatorname{adj}(kA)=k\,\operatorname{adj}A$`, R`$\operatorname{adj}(AB)=\operatorname{adj}B\,\operatorname{adj}A$`, R`$|\operatorname{adj}A|=|A|^n$`], [0, 2],
    R`<p>1 is true (transposing cofactors). 2 is false: $\operatorname{adj}(kA)=k^{n-1}\operatorname{adj}A$. 3 is true (reversal rule). 4 is false: it is $|A|^{n-1}$.</p>`, 'The scalar and the exponent each lose one power.'),
  X(4, 'idempotent matrices', R`$A$ is a square matrix with $A^2=A$. Which statements must be true?`, [R`$|A|=0$ or $|A|=1$`, R`$I-A$ is idempotent`, R`$A=I$ or $A=O$`, R`$(I+A)^{-1}=I-\dfrac12A$`], [0, 1, 3],
    R`<p>$|A|^2=|A|$ gives 0 or 1. $(I-A)^2=I-2A+A^2=I-A$. Option 3 is false: $\begin{pmatrix}1&0\\0&0\end{pmatrix}$. For 4: $(I+A)(I-\frac12A)=I+\frac12A-\frac12A^2=I$.</p>`, 'Many idempotent matrices are neither $I$ nor $O$.'),
  X(4, 'skew-symmetric matrices', R`$A$ is a real $3\times3$ skew-symmetric matrix. Which statements are true?`, [R`$|A|=0$`, R`$A^2$ is symmetric`, R`$A$ is invertible`, R`$\operatorname{tr}A=0$`], [0, 1, 3],
    R`<p>Odd-order skew-symmetric matrices are singular, so 1 is true and 3 is false. $(A^2)^T=(A^T)^2=A^2$: 2 true. Diagonal entries are 0: 4 true.</p>`, 'Odd order is the key.'),
  X(4, 'special determinants', R`The determinant $\begin{vmatrix}a&b&c\\b&c&a\\c&a&b\end{vmatrix}$ has which factors?`, [R`$a+b+c$`, R`$a^2+b^2+c^2-ab-bc-ca$`, R`$a-b$`, R`$abc$`], [0, 1],
    R`<p>Adding all columns to the first brings out $(a+b+c)$. The remaining $2\times2$-type expansion gives $-(a^2+b^2+c^2-ab-bc-ca)$. So the determinant is $-(a+b+c)(a^2+b^2+c^2-ab-bc-ca)=-(a^3+b^3+c^3-3abc)$. $(a-b)$ alone is not a factor (e.g. $a=b=1,c=2$ gives $-(4)(1+1+4-1-2-2)=-4\neq0$).</p>`, 'The determinant is symmetric under swapping, so no single $(a-b)$ factor.'),
  X(4, 'Cayley-Hamilton', R`For $A=\begin{pmatrix}1&2\\2&4\end{pmatrix}$ which statements are true?`, ['$A$ is singular', '$A^2=5A$', '$\\operatorname{tr}A=5$', '$A$ is idempotent'], [0, 1, 2],
    R`<p>$|A|=4-4=0$: true. $A^2=\begin{pmatrix}5&10\\10&20\end{pmatrix}=5A$: true. Trace is $1+4=5$: true. $A^2\neq A$, so it is not idempotent.</p>`, 'Char. equation $\\lambda^2-5\\lambda=0$ gives $A^2=5A$.'),

  // ---------- L5 ----------
  I(5, 'orthogonal matrices', R`Let $A=\begin{pmatrix}0&0&1\\1&0&0\\0&1&0\end{pmatrix}$ (a permutation matrix, $|A|=1$). Find $|A-I|$.`, 0,
    R`<p>$A-I=\begin{pmatrix}-1&0&1\\1&-1&0\\0&1&-1\end{pmatrix}$. Expand along row 1: $-1(1-0)-0+1(1-0)=0$. (In general, a $3\times3$ rotation always fixes its axis, so $1$ is an eigenvalue and $|A-I|=0$.)</p>`, 'Rows sum to zero, so $(1,1,1)^T$ is in the null space.', { calc: () => dt([[-1, 0, 1], [1, -1, 0], [0, 1, -1]]) }),
  I(5, 'skew-symmetric matrices', R`$A=\begin{pmatrix}0&1&2\\-1&0&2\\-2&-2&0\end{pmatrix}$. Find $|A+I|$.`, 10,
    R`<p>For skew-symmetric $\begin{pmatrix}0&a&b\\-a&0&c\\-b&-c&0\end{pmatrix}$, $|A+I|=1+a^2+b^2+c^2$. Here $a=1,b=2,c=2$ so $1+1+4+4=10$. Direct: $\begin{vmatrix}1&1&2\\-1&1&2\\-2&-2&1\end{vmatrix}=1(1+4)-1(-1+4)+2(2+2)=5-3+8=10$.</p>`, 'The cross terms cancel because of skew-symmetry.', { calc: () => dt([[1, 1, 2], [-1, 1, 2], [-2, -2, 1]]) }),
  I(5, 'cyclic determinants', R`$a,b,c$ are the roots of $x^3-5x^2+6x-1=0$. Find $\begin{vmatrix}a&b&c\\b&c&a\\c&a&b\end{vmatrix}$.`, -35,
    R`<p>The determinant equals $-(a^3+b^3+c^3-3abc)=-(a+b+c)\big((a+b+c)^2-3(ab+bc+ca)\big)$. Vieta: $a+b+c=5$, $ab+bc+ca=6$. So $=-5(25-18)=-35$.</p>`, 'Use symmetric functions; do not find the roots.', { calc: () => -5 * (25 - 3 * 6) }),
  I(5, 'products of matrices', R`$A$ and $B$ are $3\times3$ real matrices with $AB=-BA$. Find $|A|\cdot|B|$.`, 0,
    R`<p>$|AB|=|-BA|=(-1)^3|BA|=-|B||A|$. But $|AB|=|A||B|$. So $|A||B|=-|A||B|$, giving $|A||B|=0$.</p>`, 'The minus sign becomes $(-1)^3$ for order 3.', { calc: () => 0 }),
  I(5, 'Fibonacci matrix', R`With $A=\begin{pmatrix}1&1\\1&0\end{pmatrix}$, find the least positive integer $n$ for which the $(1,1)$ entry of $A^n$ exceeds 1000.`, 16,
    R`<p>The $(1,1)$ entry of $A^n$ is $F_{n+1}$. Fibonacci: $F_{15}=610$, $F_{16}=987$, $F_{17}=1597$. We need $F_{n+1}>1000$, so $n+1=17$ and $n=16$.</p>`, '$F_{16}=987$ is just short of 1000.', { calc: () => { let n = 1; while (mpow([[1, 1], [1, 0]], n)[0][0] <= 1000) n++; return n; } }),
  I(5, 'Cayley-Hamilton', R`$A=\begin{pmatrix}1&2\\3&4\end{pmatrix}$ and $A^4=pA+qI$. Find $p+q$.`, 199,
    R`<p>From $A^2=5A+2I$: $A^3=5A^2+2A=27A+10I$. $A^4=27A^2+10A=27(5A+2I)+10A=145A+54I$. So $p=145$, $q=54$, $p+q=199$. (Check: $A^4=\begin{pmatrix}199&290\\435&634\end{pmatrix}$ and $145A+54I$ gives the same.)</p>`, 'Reduce every power using $A^2=5A+2I$.', { calc: () => { const A4 = mpow([[1, 2], [3, 4]], 4); return A4[0][1] / 2 + (A4[0][0] - A4[0][1] / 2); } }),
  I(5, 'systems with parameters', R`Count the pairs $(a,b)$ with $a,b\in\{1,2,3\}$ for which $x+ay=1$, $bx+9y=3$ has a unique solution.`, 8,
    R`<p>$D=9-ab$. Not unique exactly when $ab=9$, i.e. $a=b=3$ (and then the system is $x+3y=1$, $3x+9y=3$: infinitely many). Of the 9 pairs, 8 give a unique solution.</p>`, 'Singular case: just one pair.', { calc: () => { let c = 0; for (let a = 1; a <= 3; a++) for (let b = 1; b <= 3; b++) if (9 - a * b !== 0) c++; return c; } }),
  X(5, 'consistency', R`The system $x+y+z=1$, $x+2y+4z=\lambda$, $x+4y+10z=\lambda^2$ is consistent for which values of $\lambda$?`, ['$\\lambda=1$', '$\\lambda=2$', '$\\lambda=3$', '$\\lambda=0$'], [0, 1],
    R`<p>The coefficient determinant is 0, and row 3 $=-2\cdot$ row 1 $+3\cdot$ row 2 (check: $-2+3=1$, $-2+6=4$, $-2+12=10$). For consistency the constants must obey the same relation: $\lambda^2=-2\cdot1+3\lambda$, i.e. $\lambda^2-3\lambda+2=0$, $\lambda=1$ or $2$.</p>`, 'Singular coefficient matrix: consistency is a condition on the constants.'),
  X(5, 'idempotent pairs', R`$A$ and $B$ are square matrices with $AB=A$ and $BA=B$. Which must be true?`, [R`$A^2=A$`, R`$B^2=B$`, R`$A=B$`, R`$(A+B)^2=A+B$`], [0, 1],
    R`<p>$A^2=(AB)A=A(BA)=AB=A$. Similarly $B^2=(BA)B=B(AB)=BA=B$. For 3: $A=\begin{pmatrix}1&0\\0&0\end{pmatrix}$, $B=\begin{pmatrix}1&0\\1&0\end{pmatrix}$ satisfy both but $A\neq B$. For 4: $(A+B)^2=A+AB+BA+B=2A+2B\neq A+B$ unless $A+B=O$.</p>`, 'Keep the order of products when substituting.'),
  X(5, 'nilpotent matrices', R`$A$ is a non-zero real $3\times3$ matrix with $A^3=O$. Which statements must be true?`, [R`$|A|=0$`, R`$I-A$ is invertible`, R`$A^2=O$`, R`$\operatorname{tr}A=0$`], [0, 1, 3],
    R`<p>$|A|^3=0$ so $|A|=0$. $(I-A)(I+A+A^2)=I$, so $I-A$ is invertible. $A^2=O$ need not hold: $\begin{pmatrix}0&1&0\\0&0&1\\0&0&0\end{pmatrix}$. All eigenvalues of a nilpotent matrix are 0, so the trace is 0.</p>`, 'Index 3 does not mean $A^2=O$.'),
  X(5, 'systems with a parameter', R`For the system $x+y+z=3$, $x+2y+3z=6$, $x+4y+\lambda z=\mu$, which statements are true?`, [R`Unique solution if $\lambda\neq7$`, R`No solution if $\lambda=7$ and $\mu\neq12$`, R`Infinitely many solutions if $\lambda=7$ and $\mu=12$`, R`Infinitely many solutions for every $\mu$ when $\lambda=7$`], [0, 1, 2],
    R`<p>Write row 3 as $\alpha\,r_1+\beta\,r_2$: $x$: $\alpha+\beta=1$, $y$: $\alpha+2\beta=4$, so $\beta=3$, $\alpha=-2$. Then the $z$-coefficient would be $-2+9=7$. So $D=\lambda-7$, and $\lambda=7$ makes the coefficient matrix singular. For consistency the constants must satisfy $\mu=-2\cdot3+3\cdot6=12$. So: unique if $\lambda\neq7$; none if $\lambda=7,\mu\neq12$; infinite if $\lambda=7,\mu=12$. Statement 4 is false.</p>`, 'Consistency is a condition on $\\mu$ only when $D=0$.'),
];

items.forEach((it, i) => { it.id = `md-${String(i + 1).padStart(3, '0')}`; });

// ---------- number templates ----------
const nz = (rng, lo, hi) => { let v; do v = int(rng, lo, hi); while (v === 0); return v; };
const rnd3 = (rng, lo, hi) => Array.from({ length: 3 }, () => Array.from({ length: 3 }, () => int(rng, lo, hi)));
const sarrus = (m) => m[0][0] * m[1][1] * m[2][2] + m[0][1] * m[1][2] * m[2][0] + m[0][2] * m[1][0] * m[2][1] - m[0][2] * m[1][1] * m[2][0] - m[0][0] * m[1][2] * m[2][1] - m[0][1] * m[1][0] * m[2][2];
const co1 = (v) => (v === 1 ? '' : v === -1 ? '-' : String(v));
const gen = (id, level, type, format, sub, make, verify) => ({ id, type, format, level, exams: GEXS(level, type), sub, make, ...(verify ? { verify } : {}) });

const gens = [
  gen('md-g01', 1, 'nat', 'integer', 'determinant of 2x2', (rng) => {
    const a = int(rng, -6, 9), b = int(rng, -6, 9), c = int(rng, -6, 9), d = int(rng, -6, 9);
    const answer = a * d - b * c;
    return { a, b, c, d, answer, tol: 0,
      q: R`Find the value of $\begin{vmatrix}${a}&${b}\\${c}&${d}\end{vmatrix}$.`,
      sol: R`<p>$ad-bc=(${vl(a)})(${vl(d)})-(${vl(b)})(${vl(c)})=${a * d}-(${b * c})=${answer}$.</p>` };
  }, (p) => dt([[p.a, p.b], [p.c, p.d]])),

  gen('md-g02', 2, 'nat', 'integer', 'determinant of 3x3', (rng) => {
    const m = rnd3(rng, -4, 6);
    const [r1, r2, r3] = m; const answer = dt(m);
    const c1 = r2[1] * r3[2] - r2[2] * r3[1], c2 = r2[0] * r3[2] - r2[2] * r3[0], c3 = r2[0] * r3[1] - r2[1] * r3[0];
    return { m, answer, tol: 0,
      q: R`Evaluate $\begin{vmatrix}${r1.join('&')}\\${r2.join('&')}\\${r3.join('&')}\end{vmatrix}$.`,
      sol: R`<p>Expand along row 1: $${vl(r1[0])}\,(${c1})-(${vl(r1[1])})(${c2})+(${vl(r1[2])})(${c3})$, where the brackets are the $2\times2$ minors.</p><p>$=${r1[0] * c1}${sg(-r1[1] * c2)}${sg(r1[2] * c3)}=${answer}$.</p>` };
  }, (p) => Math.round(sarrus(p.m))),

  gen('md-g03', 2, 'nat', 'integer', 'determinant of scalar multiple', (rng) => {
    const n = choose(rng, [2, 3, 4]), k = choose(rng, [2, 3, -1, -2]), D = nz(rng, -5, 5);
    const answer = k ** n * D;
    return { n, k, D, answer, tol: 0,
      q: R`$A$ is a $${n}\times${n}$ matrix with $|A|=${D}$. Find $|${k}A|$.`,
      sol: R`<p>Each of the ${n} rows gets multiplied by $${k}$, so $|${k}A|=(${k})^{${n}}\,|A|=${k ** n}\times(${D})=${answer}$.</p>` };
  }, (p) => Array.from({ length: p.n }).reduce((s) => s * p.k, p.D)),

  gen('md-g04', 2, 'nat', 'integer', 'adjoint', (rng) => {
    const n = choose(rng, [3, 4]), D = choose(rng, [2, 3, -2, -3, 4]);
    const answer = D ** (n - 1);
    return { n, D, answer, tol: 0,
      q: R`$A$ is a non-singular matrix of order $${n}$ with $|A|=${D}$. Find $|\operatorname{adj}A|$.`,
      sol: R`<p>$A\,\operatorname{adj}A=|A|I$. Taking determinants: $|A|\,|\operatorname{adj}A|=|A|^{${n}}$, so $|\operatorname{adj}A|=|A|^{${n - 1}}=(${D})^{${n - 1}}=${answer}$.</p>` };
  }, (p) => { let x = 1; for (let i = 0; i < p.n - 1; i++) x *= p.D; return x; }),

  gen('md-g05', 3, 'nat', 'integer', 'adjoint of adjoint', (rng) => {
    const n = choose(rng, [3, 4]), D = n === 3 ? choose(rng, [2, 3, -2, -3, 4]) : choose(rng, [2, -2]);
    const answer = D ** ((n - 1) ** 2);
    return { n, D, answer, tol: 0,
      q: R`$A$ is a $${n}\times${n}$ matrix with $|A|=${D}$. Find $|\operatorname{adj}(\operatorname{adj}A)|$.`,
      sol: R`<p>$|\operatorname{adj}A|=|A|^{${n - 1}}=${D ** (n - 1)}$. Apply the rule again: $|\operatorname{adj}(\operatorname{adj}A)|=\left(|\operatorname{adj}A|\right)^{${n - 1}}=|A|^{${(n - 1) ** 2}}=${answer}$.</p>` };
  }, (p) => { const t = p.D ** (p.n - 1); return t ** (p.n - 1); }),

  gen('md-g06', 2, 'nat', 'numeric', 'area of a triangle', (rng) => {
    let x1, y1, x2, y2, x3, y3, d;
    do { x1 = int(rng, -5, 5); y1 = int(rng, -5, 5); x2 = int(rng, -5, 8); y2 = int(rng, -5, 8); x3 = int(rng, -5, 8); y3 = int(rng, -5, 8); d = x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2); } while (d === 0);
    const answer = Math.abs(d) / 2;
    return { x1, y1, x2, y2, x3, y3, answer, tol: 0.01,
      q: R`Using a determinant, find the area of the triangle with vertices $(${x1},${y1})$, $(${x2},${y2})$ and $(${x3},${y3})$.`,
      sol: R`<p>Area $=\dfrac12\left|\begin{vmatrix}${x1}&${y1}&1\\${x2}&${y2}&1\\${x3}&${y3}&1\end{vmatrix}\right|$. The determinant equals $x_1(y_2-y_3)+x_2(y_3-y_1)+x_3(y_1-y_2)=${d}$.</p><p>Area $=\dfrac{|${d}|}2=${answer}$.</p>` };
  }, (p) => { const P = [[p.x1, p.y1], [p.x2, p.y2], [p.x3, p.y3], [p.x1, p.y1]]; let s = 0; for (let i = 0; i < 3; i++) s += P[i][0] * P[i + 1][1] - P[i + 1][0] * P[i][1]; return Math.abs(s) / 2; }),

  gen('md-g07', 2, 'nat', 'integer', 'collinearity', (rng) => {
    const m = nz(rng, -3, 4), c = int(rng, -4, 4);
    let xs; do xs = [int(rng, -4, 4), int(rng, -4, 4), int(rng, -4, 6)]; while (new Set(xs).size < 3);
    const [x1, x2, x3] = xs; const y1 = m * x1 + c, y2 = m * x2 + c, answer = m * x3 + c;
    return { x1, y1, x2, y2, x3, answer, tol: 0,
      q: R`The points $(${x1},${y1})$, $(${x2},${y2})$ and $(${x3},k)$ are collinear. Find $k$.`,
      sol: R`<p>Collinear means $\begin{vmatrix}${x1}&${y1}&1\\${x2}&${y2}&1\\${x3}&k&1\end{vmatrix}=0$, which is the same as equal slopes. The first two points give slope $\dfrac{${y2}-(${y1})}{${x2}-(${x1})}=${m}$, so $\dfrac{k-(${y2})}{${x3}-(${x2})}=${m}$.</p><p>$k=${y2}+${m}\times(${x3 - x2})=${answer}$.</p>` };
  }, (p) => (dt([[p.x1, p.y1, 1], [p.x2, p.y2, 1], [p.x3, p.answer, 1]]) === 0 ? p.answer : NaN)),

  gen('md-g08', 2, 'nat', 'integer', "Cramer's rule", (rng) => {
    let x, y, a1, b1, a2, b2;
    do { x = int(rng, -4, 6); y = int(rng, -4, 6); a1 = nz(rng, -4, 5); b1 = nz(rng, -4, 5); a2 = nz(rng, -4, 5); b2 = nz(rng, -4, 5); } while (a1 * b2 - a2 * b1 === 0);
    const c1 = a1 * x + b1 * y, c2 = a2 * x + b2 * y, D = a1 * b2 - a2 * b1, Dx = c1 * b2 - c2 * b1, Dy = a1 * c2 - a2 * c1;
    const ask = choose(rng, ['x', 'y']); const answer = ask === 'x' ? x : y;
    const t = (a, b) => `${co1(a)}x${b < 0 ? '-' : '+'}${co1(Math.abs(b))}y`;
    return { a1, b1, c1, a2, b2, c2, ask, answer, tol: 0,
      q: R`Using Cramer's rule, solve $${t(a1, b1)}=${c1}$ and $${t(a2, b2)}=${c2}$. Find $${ask}$.`,
      sol: R`<p>$D=\begin{vmatrix}${a1}&${b1}\\${a2}&${b2}\end{vmatrix}=${D}$, $D_x=\begin{vmatrix}${c1}&${b1}\\${c2}&${b2}\end{vmatrix}=${Dx}$, $D_y=\begin{vmatrix}${a1}&${c1}\\${a2}&${c2}\end{vmatrix}=${Dy}$.</p><p>$x=\dfrac{${Dx}}{${D}}=${x}$ and $y=\dfrac{${Dy}}{${D}}=${y}$. So $${ask}=${answer}$.</p>` };
  }, (p) => { const x = (p.c1 * p.b2 - p.c2 * p.b1) / (p.a1 * p.b2 - p.a2 * p.b1); const y = (p.c1 - p.a1 * x) / p.b1; return p.ask === 'x' ? x : y; }),

  gen('md-g09', 3, 'nat', 'integer', 'systems of three equations', (rng) => {
    let A, s3;
    do { A = rnd3(rng, -3, 4); s3 = [int(rng, -3, 4), int(rng, -3, 4), int(rng, -3, 4)]; } while (dt(A) === 0 || Math.abs(dt(A)) > 30);
    const b = A.map((r) => r[0] * s3[0] + r[1] * s3[1] + r[2] * s3[2]);
    const w = int(rng, 0, 2); const names = ['x', 'y', 'z']; const answer = s3[w];
    const co = (v) => (v === 1 ? '' : v === -1 ? '-' : String(v));
    const eq = (r, c) => `${r.map((v, i) => (v === 0 ? '' : `${v > 0 && i > 0 && r.slice(0, i).some((u) => u !== 0) ? '+' : ''}${co(v)}${names[i]}`)).join('')}=${c}`;
    const D = dt(A), Dk = dt(A.map((r, i) => r.map((v, j) => (j === w ? b[i] : v))));
    return { A, b, s3, w, answer, tol: 0,
      q: R`Solve $${eq(A[0], b[0])}$, $${eq(A[1], b[1])}$, $${eq(A[2], b[2])}$ by Cramer's rule and give the value of $${names[w]}$.`,
      sol: R`<p>$D=\begin{vmatrix}${A[0].join('&')}\\${A[1].join('&')}\\${A[2].join('&')}\end{vmatrix}=${D}$. Replace column ${w + 1} by the constants $(${b.join(',')})$: $D_${names[w]}=${Dk}$.</p><p>$${names[w]}=\dfrac{D_${names[w]}}{D}=\dfrac{${Dk}}{${D}}=${answer}$.</p>` };
  }, (p) => (p.A.every((r, i) => r[0] * p.s3[0] + r[1] * p.s3[1] + r[2] * p.s3[2] === p.b[i]) ? p.s3[p.w] : NaN)),

  gen('md-g10', 3, 'nat', 'integer', 'powers of a matrix', (rng) => {
    const kind = int(rng, 0, 1), n = int(rng, 4, 12);
    if (kind === 0) {
      const a = nz(rng, -4, 5); const answer = a * n;
      return { kind, a, n, answer, tol: 0,
        q: R`If $A=\begin{pmatrix}1&${a}\\0&1\end{pmatrix}$, find the $(1,2)$ entry of $A^{${n}}$.`,
        sol: R`<p>$A^2=\begin{pmatrix}1&${2 * a}\\0&1\end{pmatrix}$, $A^3=\begin{pmatrix}1&${3 * a}\\0&1\end{pmatrix}$. Pattern: $A^n=\begin{pmatrix}1&${a}n\\0&1\end{pmatrix}$. For $n=${n}$ the entry is $${a}\times${n}=${answer}$.</p>` };
    }
    const p = int(rng, 2, 3), nn = int(rng, 3, 6); const answer = nn * p ** (nn - 1);
    return { kind, a: p, n: nn, answer, tol: 0,
      q: R`If $A=\begin{pmatrix}${p}&1\\0&${p}\end{pmatrix}$, find the $(1,2)$ entry of $A^{${nn}}$.`,
      sol: R`<p>Write $A=${p}I+N$ with $N=\begin{pmatrix}0&1\\0&0\end{pmatrix}$, $N^2=O$. Since $I$ and $N$ commute, $A^n=${p}^nI+n\cdot${p}^{n-1}N$. The $(1,2)$ entry is $${nn}\times${p}^{${nn - 1}}=${answer}$.</p>` };
  }, (p) => mpow(p.kind === 0 ? [[1, p.a], [0, 1]] : [[p.a, 1], [0, p.a]], p.n)[0][1]),

  gen('md-g11', 3, 'nat', 'integer', 'consistency of a system', (rng) => {
    const pp = nz(rng, -3, 4), qq = nz(rng, -4, 5), r = int(rng, -5, 6), t = choose(rng, [2, 3, -2, -3, 4]);
    const answer = t * qq;
    const s = (a, b) => `${co1(a)}x${b < 0 ? '-' : '+'}${co1(Math.abs(b))}y`;
    return { pp, qq, r, t, answer, tol: 0,
      q: R`For what value of $k$ does the system $${s(pp, qq)}=${r}$, $${t * pp}x+ky=${t * r}$ have infinitely many solutions?`,
      sol: R`<p>The second equation must be a multiple of the first. Since $${t * pp}=${t}\times${vl(pp)}$ and $${t * r}=${t}\times${vl(r)}$, the multiplier is $${t}$.</p><p>So $k=${t}\times${vl(qq)}=${answer}$. (Then $D=${pp}k-${t * pp}\cdot${vl(qq)}=0$.)</p>` };
  }, (p) => (p.pp * p.answer - p.t * p.pp * p.qq === 0 ? p.answer : NaN)),

  gen('md-g12', 3, 'nat', 'numeric', 'inverse of a 2x2 matrix', (rng) => {
    let a, b, c, d;
    do { a = int(rng, -4, 6); b = int(rng, -4, 6); c = int(rng, -4, 6); d = int(rng, -4, 6); } while (a * d - b * c === 0 || Math.abs(a * d - b * c) > 7);
    const D = a * d - b * c; const pos = choose(rng, [[1, 1], [1, 2], [2, 1], [2, 2]]);
    const adj = [[d, -b], [-c, a]]; const num = adj[pos[0] - 1][pos[1] - 1];
    const answer = Math.round((num / D) * 1000) / 1000;
    return { a, b, c, d, pos, answer, tol: 0.005,
      q: R`Let $A=\begin{pmatrix}${a}&${b}\\${c}&${d}\end{pmatrix}$. Find the $(${pos[0]},${pos[1]})$ entry of $A^{-1}$ (give 3 decimals).`,
      sol: R`<p>$|A|=${a}\cdot${vl(d)}-${vl(b)}\cdot${vl(c)}=${D}$. $\operatorname{adj}A=\begin{pmatrix}${d}&${-b}\\${-c}&${a}\end{pmatrix}$ (swap the diagonal, negate the others).</p><p>$A^{-1}=\dfrac1{${D}}\operatorname{adj}A$. The $(${pos[0]},${pos[1]})$ entry is $\dfrac{${num}}{${D}}=${answer}$.</p>` };
  }, (p) => { const M = [[p.a, p.b], [p.c, p.d]]; const D = dt(M); const x = [[M[1][1], -M[0][1]], [-M[1][0], M[0][0]]]; return x[p.pos[0] - 1][p.pos[1] - 1] / D; }),

  gen('md-g13', 3, 'nat', 'integer', 'counting matrices', (rng) => {
    const kind = int(rng, 0, 2), s = int(rng, 2, 3);
    if (kind === 0) {
      const answer = s ** 3;
      return { kind, s, answer, tol: 0,
        q: R`How many $2\times2$ symmetric matrices can be formed with entries from $\{0,1${s === 3 ? ',2' : ''}\}$?`,
        sol: R`<p>A symmetric $2\times2$ matrix $\begin{pmatrix}a&b\\b&d\end{pmatrix}$ is fixed by $a,b,d$. Each has ${s} choices: $${s}^3=${answer}$.</p>` };
    }
    if (kind === 1) {
      const answer = s ** 6;
      return { kind, s, answer, tol: 0,
        q: R`How many $3\times3$ symmetric matrices can be formed with entries from $\{0,1${s === 3 ? ',2' : ''}\}$?`,
        sol: R`<p>A $3\times3$ symmetric matrix is fixed by the 3 diagonal entries and the 3 entries above the diagonal: 6 free entries, each with ${s} choices. $${s}^6=${answer}$.</p>` };
    }
    return { kind, s, answer: 27, tol: 0,
      q: R`How many $3\times3$ skew-symmetric matrices have all entries from the set $\{-1,0,1\}$?`,
      sol: R`<p>The diagonal must be 0. The three entries above it ($a_{12},a_{13},a_{23}$) are free and fix the lower ones (their negatives). Each has 3 choices: $3^3=27$.</p>` };
  }, (p) => {
    if (p.kind === 2) return 27;
    const nn = p.kind === 0 ? 2 : 3; let cnt = 0; const tot = p.s ** (nn * nn);
    for (let m = 0; m < tot; m++) {
      const e = []; let t = m; for (let i = 0; i < nn * nn; i++) { e.push(t % p.s); t = Math.floor(t / p.s); }
      let ok = true; for (let i = 0; i < nn; i++) for (let j = 0; j < nn; j++) if (e[i * nn + j] !== e[j * nn + i]) ok = false;
      if (ok) cnt++;
    }
    return cnt;
  }),

  gen('md-g14', 4, 'nat', 'integer', 'Cayley-Hamilton', (rng) => {
    let a, b, c, d;
    do { a = int(rng, -3, 5); b = nz(rng, -3, 4); c = int(rng, -3, 4); d = int(rng, -3, 5); } while (a + d === 0);
    const t = a + d, D = a * d - b * c, answer = t - D;
    return { a, b, c, d, answer, tol: 0,
      q: R`For $A=\begin{pmatrix}${a}&${b}\\${c}&${d}\end{pmatrix}$ the square can be written $A^2=pA+qI$. Find $p+q$.`,
      sol: R`<p>Cayley-Hamilton: $A^2-(\operatorname{tr}A)A+|A|I=O$. Here $\operatorname{tr}A=${a}+${vl(d)}=${t}$ and $|A|=${a * d}-(${b * c})=${D}$.</p><p>So $A^2=${t}A-(${D})I$: $p=${t}$, $q=${-D}$, and $p+q=${answer}$.</p>` };
  }, (p) => { const A = [[p.a, p.b], [p.c, p.d]]; const S = mm(A, A); const pp = S[0][1] / p.b; const qq = S[0][0] - pp * p.a; return pp + qq; }),

  gen('md-g15', 3, 'nat', 'integer', 'triangular matrices', (rng) => {
    const d = [nz(rng, -3, 4), nz(rng, -3, 4), nz(rng, -3, 4)], u = [int(rng, -5, 5), int(rng, -5, 5), int(rng, -5, 5)];
    const answer = (d[0] * d[1] * d[2]) ** 2;
    return { d, u, answer, tol: 0,
      q: R`Find $|A^TA|$ for $A=\begin{pmatrix}${d[0]}&${u[0]}&${u[1]}\\0&${d[1]}&${u[2]}\\0&0&${d[2]}\end{pmatrix}$.`,
      sol: R`<p>$|A^TA|=|A^T|\,|A|=|A|^2$. $A$ is triangular, so $|A|=${d[0]}\cdot${vl(d[1])}\cdot${vl(d[2])}=${d[0] * d[1] * d[2]}$. Hence $|A^TA|=${answer}$.</p>` };
  }, (p) => { const A = [[p.d[0], p.u[0], p.u[1]], [0, p.d[1], p.u[2]], [0, 0, p.d[2]]]; return dt(mm(tp(A), A)); }),

  gen('md-g16', 4, 'nat', 'numeric', 'area of a triangle', (rng) => {
    let a, b, c;
    do { a = int(rng, -4, 4); b = int(rng, -4, 4); c = int(rng, -4, 4); } while (new Set([a, b, c]).size < 3);
    const answer = Math.abs((a - b) * (b - c) * (c - a)) / 2;
    return { a, b, c, answer, tol: 0.01,
      q: R`Find the area of the triangle whose vertices are the points of the parabola $y=x^2$ with $x=${a}$, $x=${b}$ and $x=${c}$.`,
      sol: R`<p>Vertices $(${a},${a * a})$, $(${b},${b * b})$, $(${c},${c * c})$. The area determinant has rows $(x,\ x^2,\ 1)$. It reduces to a Vandermonde determinant, so the area is $\dfrac12|(a-b)(b-c)(c-a)|$.</p><p>$=\dfrac12|(${a - b})(${b - c})(${c - a})|=${answer}$.</p>` };
  }, (p) => tri(p.a, p.a ** 2, p.b, p.b ** 2, p.c, p.c ** 2)),

  gen('md-g17', 1, 'mcq', 'single', 'order of a matrix', (rng) => {
    let m, n, pp; do { m = int(rng, 2, 5); n = int(rng, 2, 5); pp = int(rng, 2, 5); } while (new Set([m, n, pp]).size < 3);
    const o = (a, b) => `$${a}\\times${b}$`;
    const { options, answer } = shuffleOpts(rng, o(pp, m), [o(m, pp), o(n, n), o(pp, n)]);
    return { m, n, pp, options, answer,
      q: R`$A$ has order $${m}\times${n}$ and $B$ has order $${n}\times${pp}$. What is the order of $(AB)^T$?`,
      sol: R`<p>$AB$ has order $${m}\times${pp}$ (rows of $A$, columns of $B$). Transposing swaps rows and columns, so $(AB)^T$ has order $${pp}\times${m}$.</p>` };
  }, (p) => p.options.indexOf(`$${p.pp}\\times${p.m}$`)),

  gen('md-g18', 3, 'nat', 'integer', 'elementary operations', (rng) => {
    const D = nz(rng, -5, 5), k = nz(rng, -4, 4), m = choose(rng, [2, 3, -2, 4, -3]);
    const answer = -m * D;
    return { D, k, m, answer, tol: 0,
      q: R`$A$ is a $3\times3$ matrix with $|A|=${D}$. $B$ is formed by applying, in order, $R_1\leftrightarrow R_2$, then $R_3\to R_3+${k < 0 ? `(${k})` : k}R_1$, then $R_2\to${m < 0 ? `(${m})` : m}R_2$. Find $|B|$.`,
      sol: R`<p>The swap multiplies the determinant by $-1$: $${-D}$. Adding a multiple of one row to another changes nothing. Multiplying a row by $${m}$ multiplies the determinant by $${m}$: $${m}\times(${-D})=${answer}$.</p>` };
  }, (p) => p.D * -1 * p.m),

  gen('md-g19', 3, 'nat', 'integer', 'special determinants', (rng) => {
    const x = int(rng, -3, 6), pp = nz(rng, -3, 4);
    const answer = (x - pp) ** 2 * (x + 2 * pp);
    return { x, pp, answer, tol: 0,
      q: R`Find the value of $\begin{vmatrix}${x}&${pp}&${pp}\\${pp}&${x}&${pp}\\${pp}&${pp}&${x}\end{vmatrix}$.`,
      sol: R`<p>For a matrix with diagonal $x$ and all other entries $p$, add all columns to the first (giving $x+2p$ in each row), take out $(x+2p)$, then subtract rows to get $(x-p)^2$. The value is $(x+2p)(x-p)^2$.</p><p>$=(${x + 2 * pp})(${x - pp})^2=${answer}$.</p>` };
  }, (p) => dt([[p.x, p.pp, p.pp], [p.pp, p.x, p.pp], [p.pp, p.pp, p.x]])),

  gen('md-g20', 3, 'nat', 'integer', 'minors and cofactors', (rng) => {
    const m = rnd3(rng, -4, 6), i = int(rng, 0, 2), j = int(rng, 0, 2);
    const rows = [0, 1, 2].filter((r) => r !== i), cols = [0, 1, 2].filter((c) => c !== j);
    const mn = m[rows[0]][cols[0]] * m[rows[1]][cols[1]] - m[rows[0]][cols[1]] * m[rows[1]][cols[0]];
    const answer = (i + j) % 2 ? -mn : mn;
    return { m, i, j, answer, tol: 0,
      q: R`For $A=\begin{pmatrix}${m[0].join('&')}\\${m[1].join('&')}\\${m[2].join('&')}\end{pmatrix}$, find the cofactor $C_{${i + 1}${j + 1}}$.`,
      sol: R`<p>Delete row ${i + 1} and column ${j + 1}. The minor is $M_{${i + 1}${j + 1}}=\begin{vmatrix}${m[rows[0]][cols[0]]}&${m[rows[0]][cols[1]]}\\${m[rows[1]][cols[0]]}&${m[rows[1]][cols[1]]}\end{vmatrix}=${mn}$.</p><p>$C_{${i + 1}${j + 1}}=(-1)^{${i + 1}+${j + 1}}M_{${i + 1}${j + 1}}=${answer}$.</p>` };
  }, (p) => cof(p.m, p.i, p.j)),

  gen('md-g21', 4, 'nat', 'numeric', 'determinant properties', (rng) => {
    const a = choose(rng, [2, 3, 4, 5]), b = nz(rng, -4, 5), k = choose(rng, [2, 3]);
    const answer = Math.round(((k ** 3 * b) / a) * 1e4) / 1e4;
    return { a, b, k, answer, tol: 0.01,
      q: R`$A$ and $B$ are $3\times3$ matrices with $|A|=${a}$ and $|B|=${b}$. Find $|${k}A^{-1}B^{T}|$ (give 2 decimals).`,
      sol: R`<p>$|${k}A^{-1}B^T|=${k}^3\,|A^{-1}|\,|B^T|=${k ** 3}\times\dfrac1{${a}}\times(${b})=${answer}$.</p>` };
  }, (p) => (p.k * p.k * p.k * p.b) / p.a),

  gen('md-g22', 4, 'nat', 'integer', 'Fibonacci matrix', (rng) => {
    const n = int(rng, 8, 16);
    const F = [0, 1]; for (let i = 2; i <= 30; i++) F.push(F[i - 1] + F[i - 2]);
    return { n, answer: F[n], tol: 0,
      q: R`For $A=\begin{pmatrix}1&1\\1&0\end{pmatrix}$, find the $(1,2)$ entry of $A^{${n}}$.`,
      sol: R`<p>$A^n=\begin{pmatrix}F_{n+1}&F_n\\F_n&F_{n-1}\end{pmatrix}$ (Fibonacci numbers $1,1,2,3,5,8,13,21,34,55,89,144,233,377,610,987,\dots$). The entry is $F_{${n}}=${F[n]}$.</p>` };
  }, (p) => mpow([[1, 1], [1, 0]], p.n)[0][1]),

  gen('md-g23', 2, 'mcq', 'single', 'symmetric and skew-symmetric', (rng) => {
    const kind = int(rng, 0, 2);
    const a = nz(rng, -5, 6), b = nz(rng, -5, 6), c = nz(rng, -5, 6), d = int(rng, -4, 5), e = int(rng, -4, 5), f = int(rng, -4, 5);
    let M, name;
    if (kind === 0) { M = [[d, a, b], [a, e, c], [b, c, f]]; name = 'symmetric'; }
    else if (kind === 1) { M = [[0, a, b], [-a, 0, c], [-b, -c, 0]]; name = 'skew-symmetric'; }
    else { M = [[d, a, b], [a + 1, e, c], [b, c + 2, f]]; name = 'neither symmetric nor skew-symmetric'; }
    const { options, answer } = shuffleOpts(rng, name, ['symmetric', 'skew-symmetric', 'neither symmetric nor skew-symmetric', 'both symmetric and skew-symmetric'].filter((x) => x !== name));
    return { M, name, options, answer,
      q: R`The matrix $${mx(M)}$ is`,
      sol: R`<p>Compare $A$ with $A^T$. ${kind === 0 ? 'All entries match across the diagonal ($a_{ij}=a_{ji}$), so $A^T=A$.' : kind === 1 ? 'The diagonal is zero and $a_{ij}=-a_{ji}$, so $A^T=-A$.' : 'Some pair $a_{ij},a_{ji}$ differs, and the diagonal is not forced to zero with opposite entries, so neither $A^T=A$ nor $A^T=-A$.'} It is ${name}.</p>` };
  }, (p) => { const T = tp(p.M); const sym = p.M.every((r, i) => r.every((v, j) => v === T[i][j])); const skw = p.M.every((r, i) => r.every((v, j) => v === -T[i][j])); const nm = sym && skw ? 'both symmetric and skew-symmetric' : sym ? 'symmetric' : skw ? 'skew-symmetric' : 'neither symmetric nor skew-symmetric'; return p.options.indexOf(nm); }),

  gen('md-g24', 4, 'nat', 'integer', 'system with a parameter', (rng) => {
    // rows (1,1,1),(1,2,3),(1,s,k): D = (k-?) ; choose s so the critical k is an integer
    const s = int(rng, 4, 6); // third row (1,s,lambda)
    // D = det [[1,1,1],[1,2,3],[1,s,l]] = 1(2l-3s) - 1(l-3) + 1(s-2) = l - 2s... compute symbolically
    const lam0 = 2 * s - 1; // D(l)= (2l-3s) - (l-3) + (s-2) = l -2s +1 -> zero at l = 2s-1
    const alpha = 1 - (s - 1), beta = s - 1;
    const c1 = 6, c2 = 9; // constants of the first two equations
    const answer = alpha * c1 + beta * c2;
    return { s, lam0, alpha, beta, c1, c2, answer, tol: 0,
      q: R`The system $x+y+z=${c1}$, $x+2y+3z=${c2}$, $x+${s}y+\lambda z=\mu$ has infinitely many solutions for exactly one pair $(\lambda,\mu)$. Find $\lambda+\mu$.`,
      sol: R`<p>$D=\begin{vmatrix}1&1&1\\1&2&3\\1&${s}&\lambda\end{vmatrix}=\lambda-${2 * s - 1}$. So $\lambda=${lam0}$ makes the rows dependent.</p><p>Row 3 $=\alpha\,r_1+\beta\,r_2$: from the $y$-column $\alpha+2\beta=${s}$ and the $x$-column $\alpha+\beta=1$, so $\beta=${beta}$, $\alpha=${alpha}$. (Check the $z$-column: $${alpha}+3\cdot${beta}=${alpha + 3 * beta}=${lam0}$.)</p><p>Consistency needs $\mu=${alpha}\cdot${c1}+${beta}\cdot${c2}=${answer}$. So $\lambda+\mu=${lam0}+${answer}=${lam0 + answer}$.</p>`, answer: lam0 + answer };
  }, (p) => { const A = [[1, 1, 1], [1, 2, 3], [1, p.s, p.lam0]]; if (dt(A) !== 0) return NaN; const mu = p.alpha * 6 + p.beta * 9; return p.lam0 + mu; }),
];

export default { topic: 'matrices-determinants', groups, items, gens };
