// Hermitian, unitary and normal matrices, unitary diagonalisation, commuting matrices, functions of matrices,
// Cayley-Hamilton, trace and determinant tricks, tensor products, quadratic forms and normal modes (GATE level).
// The BSc basics (2x2 eigenvalues, inverse, rank, first Cayley-Hamilton use) are in the JAM topic `matrices`.
// Original questions for GATE and CSIR NET practice (fibub). Levels: 1 warm-up ... 5 top rank.
import { int, choose, mcqOptions, round } from '../_util.js';
import more from './matrices-eigenvalues.more.gen.js';
import more2 from './matrices-eigenvalues.more2.gen.js';
import r4 from './matrices-eigenvalues.r4.gen.js';

const pm = (M) => `\\begin{pmatrix} ${M.map((r) => r.join(' & ')).join(' \\\\ ')} \\end{pmatrix}`;

export default {
  topic: 'matrices-eigenvalues',
  items: [
    // ---------- level 1 ----------
    { id: 'mev-001', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'unitary matrices',
      q: 'Which of these numbers can be an eigenvalue of a unitary matrix?',
      options: ['$2$', '$(1 + i)/\\sqrt2$', '$1 + i$', '$0$'], answer: 1,
      sol: 'If $U\\vec v = \\lambda\\vec v$ then $\\lVert U\\vec v\\rVert = |\\lambda|\\,\\lVert\\vec v\\rVert$, and a unitary matrix preserves lengths, so $|\\lambda| = 1$. Only $(1 + i)/\\sqrt2 = e^{i\\pi/4}$ has modulus 1; $|1 + i| = \\sqrt2$.',
      trap: '$1 + i$ has the right angle but the wrong length.' },
    { id: 'mev-002', type: 'nat', level: 1, exams: ['gate', 'net'], sub: 'trace tricks',
      q: 'A $4\\times4$ Hermitian matrix $H$ has eigenvalues $3, -1, 2$ and $0$. The value of $\\text{tr}(H^2)$ is ______.',
      answer: 14, tol: 0,
      sol: '$H^2$ has eigenvalues $\\lambda^2$: $9, 1, 4, 0$. The trace is their sum, $14$.',
      trap: 'Squaring the trace, $(3 - 1 + 2 + 0)^2 = 16$, is not the trace of the square.' },
    { id: 'mev-003', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'unitary matrices',
      q: 'For $A = \\begin{pmatrix} 1 & i \\\\ i & 1 \\end{pmatrix}$, which statement is true?',
      options: ['$A$ is Hermitian', '$A$ is anti-Hermitian', '$A/\\sqrt2$ is unitary', '$A$ is nilpotent'], answer: 2,
      sol: '$A^\\dagger = \\begin{pmatrix} 1 & -i \\\\ -i & 1 \\end{pmatrix}$, which is neither $A$ nor $-A$. But $AA^\\dagger = \\begin{pmatrix} 1 + 1 & -i + i \\\\ i - i & 1 + 1 \\end{pmatrix} = 2I$, so $(A/\\sqrt2)(A/\\sqrt2)^\\dagger = I$: unitary. $A$ is symmetric, not Hermitian; for complex matrices the two are different.',
      trap: 'Symmetric ($A^T = A$) is not Hermitian ($A^\\dagger = A$) once entries are complex.' },
    { id: 'mev-004', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'unitary transformations',
      q: 'If $U$ is unitary and $H$ is Hermitian, the matrix $U^\\dagger HU$ is',
      options: ['unitary', 'Hermitian with eigenvalues the complex conjugates of those of $H$', 'always diagonal', 'Hermitian with the same eigenvalues as $H$'], answer: 3,
      sol: '$(U^\\dagger HU)^\\dagger = U^\\dagger H^\\dagger U = U^\\dagger HU$: Hermitian. Since $U^\\dagger = U^{-1}$ it is similar to $H$, so it has the same eigenvalues (real, so conjugating changes nothing). It is diagonal only for the right choice of $U$.',
      trap: 'A unitary change of basis keeps the spectrum; only one special $U$ makes the matrix diagonal.' },
    { id: 'mev-005', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'commuting matrices',
      q: 'Two Hermitian matrices can be diagonalised by the same unitary matrix if and only if they',
      options: ['commute', 'have the same trace', 'are multiples of each other', 'are both invertible'], answer: 0,
      sol: 'If $A = UD_1U^\\dagger$ and $B = UD_2U^\\dagger$, then $AB = UD_1D_2U^\\dagger = UD_2D_1U^\\dagger = BA$ because diagonal matrices commute. Conversely, commuting Hermitian matrices share a complete orthonormal set of eigenvectors. In quantum mechanics: commuting observables have a common eigenbasis.',
      trap: 'Being multiples of each other is enough but far from necessary.' },
    { id: 'mev-006', type: 'nat', level: 1, exams: ['gate', 'net'], sub: 'anti-Hermitian matrices',
      q: 'A $2\\times2$ anti-Hermitian matrix ($A^\\dagger = -A$) has trace $i$ and one eigenvalue $3i$. The imaginary part of its other eigenvalue is ______.',
      answer: -2, tol: 0,
      sol: 'The eigenvalues add to the trace: $3i + \\lambda = i$, so $\\lambda = -2i$, imaginary part $-2$. (Anti-Hermitian eigenvalues are purely imaginary, since $iA$ is Hermitian.)',
      trap: 'Answering $+2$ by dropping the sign.' },

    // ---------- level 2 ----------
    { id: 'mev-007', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'eigenvalues',
      q: 'The eigenvalues of the permutation matrix $P = \\begin{pmatrix} 0 & 1 & 0 \\\\ 0 & 0 & 1 \\\\ 1 & 0 & 0 \\end{pmatrix}$ are ($\\omega = e^{2\\pi i/3}$)',
      options: ['$1, 1, 1$', '$1, \\omega, \\omega^2$', '$1, -1, 0$', '$0, 0, 0$'], answer: 1,
      sol: 'Moving each entry one place round three times brings it back, so $P^3 = I$ and every eigenvalue obeys $\\lambda^3 = 1$. $P$ is unitary with trace 0 and determinant 1; the cube roots of unity $1, \\omega, \\omega^2$ add to 0 and multiply to 1, as needed. (Directly: $\\det(P - \\lambda I) = 1 - \\lambda^3$.)',
      trap: '$1, 1, 1$ would need $P = I$ (a unitary matrix with only eigenvalue 1 is the identity).' },
    { id: 'mev-008', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Pauli matrices',
      q: 'With $\\hat n = \\tfrac13(1, 2, 2)$ and $\\vec\\sigma$ the Pauli matrices, the value of $\\det(2I + \\hat n\\cdot\\vec\\sigma)$ is ______.',
      answer: 3, tol: 0,
      sol: '$(\\hat n\\cdot\\vec\\sigma)^2 = |\\hat n|^2I = I$ and the trace is 0, so its eigenvalues are $+1$ and $-1$. Then $2I + \\hat n\\cdot\\vec\\sigma$ has eigenvalues 3 and 1, and determinant 3.',
      trap: 'Writing out the matrix works too, but the eigenvalue route takes ten seconds.' },
    { id: 'mev-009', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'normal matrices',
      q: 'A matrix is normal if $AA^\\dagger = A^\\dagger A$. Which statements are true?',
      options: ['Every normal matrix can be diagonalised by a unitary matrix', 'Eigenvectors of a normal matrix belonging to different eigenvalues are orthogonal', 'Every normal matrix has real eigenvalues', 'Hermitian, anti-Hermitian and unitary matrices are all normal'], answer: [0, 1, 3],
      sol: 'The spectral theorem holds exactly for normal matrices: $A = UDU^\\dagger$, so the eigenvectors (columns of $U$) are orthonormal. Each of $H^\\dagger = H$, $A^\\dagger = -A$, $U^\\dagger = U^{-1}$ makes $A$ commute with $A^\\dagger$. Eigenvalues are real only for the Hermitian ones; a unitary matrix like $iI$ is normal with eigenvalue $i$.',
      trap: 'Normality gives orthogonal eigenvectors, not real eigenvalues.' },
    { id: 'mev-010', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Hermitian matrices',
      q: 'The difference between the two eigenvalues of the Hermitian matrix $\\begin{pmatrix} 0 & 2i \\\\ -2i & 3 \\end{pmatrix}$ is ______.',
      answer: 5, tol: 0,
      sol: 'Trace $= 3$, determinant $= 0\\cdot3 - (2i)(-2i) = -4$. So $\\lambda^2 - 3\\lambda - 4 = 0$, $\\lambda = 4$ or $-1$, difference 5. Quick formula: the difference is $\\sqrt{(\\text{tr})^2 - 4\\det} = \\sqrt{9 + 16} = 5$.',
      trap: '$(2i)(-2i) = -4i^2 = +4$, so the determinant is $-4$, not $+4$.' },
    { id: 'mev-011', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'diagonalisation',
      q: 'Which unitary matrix $U$ makes $U^\\dagger\\sigma_xU$ diagonal?',
      options: ['$\\begin{pmatrix} 1 & 0 \\\\ 0 & -1 \\end{pmatrix}$', '$\\begin{pmatrix} 0 & 1 \\\\ 1 & 0 \\end{pmatrix}$', '$\\dfrac{1}{\\sqrt2}\\begin{pmatrix} 1 & 1 \\\\ 1 & -1 \\end{pmatrix}$', '$\\dfrac{1}{\\sqrt2}\\begin{pmatrix} 1 & i \\\\ i & 1 \\end{pmatrix}$'], answer: 2,
      sol: 'The columns of $U$ must be the normalised eigenvectors of $\\sigma_x$: $(1, 1)/\\sqrt2$ for $+1$ and $(1, -1)/\\sqrt2$ for $-1$. That is the Hadamard matrix, and $U^\\dagger\\sigma_xU = \\sigma_z$. The first two options commute with nothing useful: $\\sigma_z\\sigma_x\\sigma_z = -\\sigma_x$ and $\\sigma_x\\sigma_x\\sigma_x = \\sigma_x$, still off-diagonal.',
      trap: 'The last option is unitary, but its columns $(1, i)$ and $(i, 1)$ are not eigenvectors of $\\sigma_x$.' },
    { id: 'mev-012', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'functions of matrices',
      q: 'The matrix $\\exp\\left(\\tfrac{i\\pi}{2}\\sigma_x\\right)$ equals',
      options: ['$\\sigma_x$', '$i\\sigma_x$', '$-I$', '$I$'], answer: 1,
      sol: 'Because $\\sigma_x^2 = I$, the series splits into even and odd parts: $e^{i\\theta\\sigma_x} = I\\cos\\theta + i\\sigma_x\\sin\\theta$. At $\\theta = \\pi/2$: $i\\sigma_x$.',
      trap: 'Forgetting the factor $i$ from the odd terms gives $\\sigma_x$.' },
    { id: 'mev-013', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'functions of matrices',
      q: 'For $A = \\begin{pmatrix} 0 & \\ln2 \\\\ \\ln2 & 0 \\end{pmatrix}$, the value of $\\text{tr}\\left(e^{A}\\right)$ is ______ (to two decimal places).',
      answer: 2.5, tol: 0.01, calc: () => 2 + 0.5,
      sol: '$A$ has eigenvalues $\\pm\\ln2$, so $e^{A}$ has eigenvalues $e^{\\ln2} = 2$ and $e^{-\\ln2} = \\tfrac12$. Trace $= 2.5$.',
      trap: 'Exponentiating entry by entry gives $\\text{tr} = 2$ ($e^0 + e^0$), which is wrong.' },
    { id: 'mev-014', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'diagonalisation',
      q: 'Which of these matrices can be diagonalised (over the complex numbers)?',
      options: ['$\\begin{pmatrix} 1 & 1 \\\\ 0 & 2 \\end{pmatrix}$', '$\\begin{pmatrix} 2 & 1 \\\\ 0 & 2 \\end{pmatrix}$', '$\\begin{pmatrix} 0 & 1 \\\\ -1 & 0 \\end{pmatrix}$', '$\\begin{pmatrix} 0 & 0 \\\\ 1 & 0 \\end{pmatrix}$'], answer: [0, 2],
      sol: 'Distinct eigenvalues always give a full set of eigenvectors: the first has 1 and 2, the third has $\\pm i$. The second has eigenvalue 2 twice but $A - 2I$ has rank 1, so only one eigenvector. The fourth is nilpotent and non-zero: eigenvalue 0 twice with one eigenvector, so it is not diagonalisable.',
      trap: 'Complex eigenvalues are no obstacle over $\\mathbb C$; repeated eigenvalues with too few eigenvectors are.' },
    { id: 'mev-015', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'orthogonal matrices',
      q: 'A real $2\\times2$ orthogonal matrix has determinant $-1$. Its eigenvalues are',
      options: ['$e^{\\pm i\\theta}$ for some $\\theta$', '$1$ and $1$', '$i$ and $-i$', '$+1$ and $-1$'], answer: 3,
      sol: 'Eigenvalues have modulus 1 and multiply to $-1$. A complex pair $e^{\\pm i\\theta}$ multiplies to $+1$, so both must be real: $+1$ and $-1$. Geometrically it is a reflection: the mirror line is kept ($+1$), the perpendicular direction is flipped ($-1$).',
      trap: '$e^{\\pm i\\theta}$ belongs to rotations, which have determinant $+1$.' },
    { id: 'mev-016', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'spectral decomposition',
      q: '$H = 2P_1 + 5P_2$ with projectors $P_1 = \\tfrac12\\begin{pmatrix} 1 & 1 \\\\ 1 & 1 \\end{pmatrix}$ and $P_2 = \\tfrac12\\begin{pmatrix} 1 & -1 \\\\ -1 & 1 \\end{pmatrix}$. The top-right entry of the positive square root $\\sqrt H$ is ______ (to three decimal places).',
      answer: -0.411, tol: 0.003, calc: () => (Math.SQRT2 - Math.sqrt(5)) / 2,
      sol: 'This is a spectral decomposition ($P_1P_2 = 0$, $P_1 + P_2 = I$), so $f(H) = f(2)P_1 + f(5)P_2$. Then $\\sqrt H = \\sqrt2\\,P_1 + \\sqrt5\\,P_2$ and its top-right entry is $\\tfrac12(\\sqrt2 - \\sqrt5) = \\tfrac12(1.414 - 2.236) \\approx -0.411$.',
      trap: 'Taking square roots of the entries of $H$ is not $\\sqrt H$.' },

    // ---------- level 3 ----------
    { id: 'mev-017', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'circulant matrices',
      q: 'The circulant matrix $\\begin{pmatrix} 1 & 2 & 3 \\\\ 3 & 1 & 2 \\\\ 2 & 3 & 1 \\end{pmatrix}$ has one real eigenvalue and two complex ones. The product of the two complex eigenvalues is ______.',
      answer: 3, tol: 0,
      sol: 'Each row sums to 6, so $(1, 1, 1)$ is an eigenvector with eigenvalue 6. The determinant is $1(1 - 6) - 2(3 - 4) + 3(9 - 2) = 18$, the product of all three, so the complex pair multiplies to $18/6 = 3$. (Directly: $\\lambda = 1 + 2\\omega + 3\\omega^2 = -\\tfrac32 - \\tfrac{\\sqrt3}{2}i$ and its conjugate, with $|\\lambda|^2 = \\tfrac94 + \\tfrac34 = 3$.)',
      trap: 'Missing the row-sum eigenvector makes this a long cubic.' },
    { id: 'mev-018', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Cayley-Hamilton',
      q: 'A $3\\times3$ matrix $A$ has characteristic polynomial $\\lambda^3 - 6\\lambda^2 + 11\\lambda - 6$. By the Cayley-Hamilton theorem, $A^{-1}$ equals',
      options: ['$\\tfrac16(A^2 - 6A + 11I)$', '$-\\tfrac16(A^2 - 6A + 11I)$', '$\\tfrac16(A^2 + 6A + 11I)$', '$\\tfrac16(A^2 - 6A - 11I)$'], answer: 0,
      sol: '$A^3 - 6A^2 + 11A - 6I = 0$, so $A(A^2 - 6A + 11I) = 6I$ and $A^{-1} = \\tfrac16(A^2 - 6A + 11I)$. Check with the eigenvalues 1, 2, 3: for $\\lambda = 2$, $\\tfrac16(4 - 12 + 11) = \\tfrac12$ ✓.',
      trap: 'Moving $-6I$ across the equals sign flips its sign; slipping here gives the second option.' },
    { id: 'mev-019', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'functions of matrices',
      q: 'For $A = \\begin{pmatrix} 1 & 1 \\\\ 1 & 1 \\end{pmatrix}$, the top-left entry of $e^{A}$ is ______ (to two decimal places).',
      answer: 4.19, tol: 0.01, calc: () => (Math.E ** 2 + 1) / 2,
      sol: '$A^2 = 2A$, so $A^n = 2^{n-1}A$ for $n \\ge 1$. Then $e^{A} = I + \\sum_{n\\ge1}\\frac{2^{n-1}}{n!}A = I + \\frac{e^2 - 1}{2}A$. Top-left: $1 + \\frac{e^2 - 1}{2} = \\frac{e^2 + 1}{2} \\approx 4.19$. (Or: eigenvalues 2 and 0 with projectors $\\tfrac12A$ and $I - \\tfrac12A$.)',
      trap: 'Entry-wise exponentiation gives $e \\approx 2.72$.' },
    { id: 'mev-020', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'functions of matrices',
      q: 'Let $H$ be Hermitian and $U = e^{iH}$. Which statements are true?',
      options: ['$U$ is unitary', 'The eigenvalues of $U$ are $e^{i\\lambda}$, with $\\lambda$ the eigenvalues of $H$', '$\\det U = e^{i\\,\\text{tr}H}$', '$U$ is Hermitian'], answer: [0, 1, 2],
      sol: '$U^\\dagger = e^{-iH^\\dagger} = e^{-iH}$, and $e^{-iH}e^{iH} = I$ since $H$ commutes with itself: unitary. In the eigenbasis of $H$, $U$ is diagonal with entries $e^{i\\lambda}$. $\\det U = \\prod e^{i\\lambda} = e^{i\\sum\\lambda} = e^{i\\,\\text{tr}H}$. $U$ is Hermitian only if every $e^{i\\lambda}$ is real ($\\lambda$ a multiple of $\\pi$).',
      trap: 'This is why time evolution $e^{-iHt/\\hbar}$ is unitary: the Hamiltonian is Hermitian.' },
    { id: 'mev-021', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'commuting matrices',
      q: 'Which matrix commutes with $A = \\begin{pmatrix} 2 & 1 \\\\ 1 & 2 \\end{pmatrix}$?',
      options: ['$\\begin{pmatrix} 1 & 0 \\\\ 0 & 2 \\end{pmatrix}$', '$\\begin{pmatrix} 0 & 1 \\\\ 0 & 0 \\end{pmatrix}$', '$\\begin{pmatrix} 3 & -1 \\\\ -1 & 3 \\end{pmatrix}$', '$\\begin{pmatrix} 1 & 1 \\\\ 0 & 1 \\end{pmatrix}$'], answer: 2,
      sol: '$A$ has distinct eigenvalues (3 and 1), so a matrix commutes with it exactly when it shares the eigenvectors $(1, 1)$ and $(1, -1)$, that is when it has the form $\\begin{pmatrix} a & b \\\\ b & a \\end{pmatrix}$. Only the third option does ($= 4I - A$). For example $\\begin{pmatrix} 1 & 0 \\\\ 0 & 2 \\end{pmatrix}A = \\begin{pmatrix} 2 & 1 \\\\ 2 & 4 \\end{pmatrix}$ but $A\\begin{pmatrix} 1 & 0 \\\\ 0 & 2 \\end{pmatrix} = \\begin{pmatrix} 2 & 2 \\\\ 1 & 4 \\end{pmatrix}$.',
      trap: 'Multiplying out is safe but slow; check whether the candidate shares the eigenvectors.' },
    { id: 'mev-022', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'determinant tricks',
      q: 'Let $A = \\begin{pmatrix} 1 & 1 & 1 \\\\ 2 & 2 & 2 \\\\ 3 & 3 & 3 \\end{pmatrix}$. The value of $\\det(I + A)$ is ______.',
      answer: 7, tol: 0,
      sol: '$A = \\vec u\\vec v^T$ with $\\vec u = (1, 2, 3)^T$ and $\\vec v = (1, 1, 1)^T$: rank 1. Its eigenvalues are $\\vec v^T\\vec u = 6$ (eigenvector $\\vec u$) and $0, 0$. So $I + A$ has eigenvalues $7, 1, 1$ and determinant 7. This is the matrix determinant lemma $\\det(I + \\vec u\\vec v^T) = 1 + \\vec v^T\\vec u$.',
      trap: '$\\det(I + A) \\ne 1 + \\det A$; here $\\det A = 0$ would give 1.' },
    { id: 'mev-023', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'nilpotent matrices',
      q: 'A non-zero $4\\times4$ matrix $N$ satisfies $N^2 = 0$. The largest possible rank of $N$ is',
      options: ['$1$', '$2$', '$3$', '$4$'], answer: 1,
      sol: '$N^2 = 0$ means everything in the image of $N$ is sent to zero, so $\\text{image} \\subseteq \\text{kernel}$ and $\\text{rank} \\le \\text{nullity} = 4 - \\text{rank}$. Hence rank $\\le 2$, reached by $N = \\begin{pmatrix} 0 & I_2 \\\\ 0 & 0 \\end{pmatrix}$ in $2\\times2$ blocks.',
      trap: 'All eigenvalues are 0, but that alone does not fix the rank.' },
    { id: 'mev-024', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Pauli matrices',
      q: 'The value of $\\text{tr}\\exp\\left[\\dfrac{i\\pi}{3\\sqrt3}(\\sigma_x + \\sigma_y + \\sigma_z)\\right]$ is ______ (to two decimal places).',
      answer: 1, tol: 0.01, calc: () => 2 * Math.cos(Math.PI / 3),
      sol: 'Write the exponent as $i\\theta\\,\\hat n\\cdot\\vec\\sigma$ with $\\hat n = (1, 1, 1)/\\sqrt3$ and $\\theta = \\pi/3$. Since $(\\hat n\\cdot\\vec\\sigma)^2 = I$, $e^{i\\theta\\hat n\\cdot\\vec\\sigma} = I\\cos\\theta + i\\,\\hat n\\cdot\\vec\\sigma\\sin\\theta$. The Pauli part is traceless, so the trace is $2\\cos(\\pi/3) = 1$.',
      trap: 'Taking the angle as $\\pi/(3\\sqrt3)$ forgets that $\\sigma_x + \\sigma_y + \\sigma_z = \\sqrt3\\,\\hat n\\cdot\\vec\\sigma$; pull out the unit vector first.' },
    { id: 'mev-025', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'tensor products',
      q: '$2\\times2$ matrices $A$ and $B$ have eigenvalues $\\{1, 2\\}$ and $\\{3, -1\\}$. For the $4\\times4$ Kronecker product $A\\otimes B$,',
      options: ['$\\text{tr} = 5$, $\\det = -6$', '$\\text{tr} = 6$, $\\det = -6$', '$\\text{tr} = 5$, $\\det = 36$', '$\\text{tr} = 6$, $\\det = 36$'], answer: 3,
      sol: 'The eigenvalues of $A\\otimes B$ are all products $a_ib_j$: $3, -1, 6, -2$. Sum $= 6$ (also $\\text{tr}A\\,\\text{tr}B = 3\\times2$). Product $= 36$ (also $(\\det A)^2(\\det B)^2 = 4\\times9$).',
      trap: 'The eigenvalues of $A\\otimes B$ multiply, they do not add; adding gives the spectrum of $A\\otimes I + I\\otimes B$.' },
    { id: 'mev-026', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'positive definite matrices',
      q: 'For a Hermitian matrix $H$, which conditions are each equivalent to $H$ being positive definite?',
      options: ['All eigenvalues of $H$ are positive', '$\\vec v^\\dagger H\\vec v > 0$ for every non-zero $\\vec v$', 'All diagonal entries of $H$ are positive', '$H = B^\\dagger B$ for some invertible $B$'], answer: [0, 1, 3],
      sol: 'In the eigenbasis $\\vec v^\\dagger H\\vec v = \\sum\\lambda_k|c_k|^2$, which is positive for all $\\vec v \\ne 0$ exactly when every $\\lambda_k > 0$. If so, $B = \\sqrt H$ works; conversely $\\vec v^\\dagger B^\\dagger B\\vec v = \\lVert B\\vec v\\rVert^2 > 0$. Positive diagonal entries are necessary but not enough: $\\begin{pmatrix} 1 & 2 \\\\ 2 & 1 \\end{pmatrix}$ has eigenvalue $-1$.',
      trap: 'Positive diagonal entries follow from positive definiteness, not the other way round.' },
    { id: 'mev-027', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'normal modes',
      q: 'Small oscillations obey $M\\ddot{\\vec x} = -K\\vec x$ with $M = \\text{diag}(1, 2)$ and $K = \\begin{pmatrix} 3 & -1 \\\\ -1 & 2 \\end{pmatrix}$ (in units where $m = k = 1$). The smaller normal-mode $\\omega^2$ is ______ (to two decimal places).',
      answer: 0.78, tol: 0.01, calc: () => 2 - Math.sqrt(6) / 2,
      sol: 'Try $\\vec x = \\vec a\\cos\\omega t$: $(K - \\omega^2M)\\vec a = 0$, so $\\det(K - \\omega^2M) = 0$: $(3 - \\omega^2)(2 - 2\\omega^2) - 1 = 2\\omega^4 - 8\\omega^2 + 5 = 0$. Then $\\omega^2 = 2 \\pm \\tfrac{\\sqrt6}{2} = 2 \\pm 1.225$. Smaller: $0.775 \\approx 0.78$.',
      trap: 'Finding the eigenvalues of $K$ alone ignores the unequal masses; the problem is $\\det(K - \\omega^2M) = 0$.' },
    { id: 'mev-028', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'quadratic forms',
      q: 'The curve $x^2 + 4xy + y^2 = 1$ in the $xy$-plane is',
      options: ['a hyperbola', 'an ellipse', 'a parabola', 'a pair of parallel lines'], answer: 0,
      sol: 'Write it as $\\vec x^T A\\vec x = 1$ with $A = \\begin{pmatrix} 1 & 2 \\\\ 2 & 1 \\end{pmatrix}$, eigenvalues 3 and $-1$. Rotating to the eigenvector axes gives $3X^2 - Y^2 = 1$: a hyperbola with its axes along $(1, 1)$ and $(1, -1)$.',
      trap: 'Positive coefficients of $x^2$ and $y^2$ suggest an ellipse, but the cross term wins: $\\det A < 0$.' },

    // ---------- level 4 ----------
    { id: 'mev-029', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'functions of matrices',
      q: 'The square root of $A = \\begin{pmatrix} 1 & 1 \\\\ 0 & 1 \\end{pmatrix}$ with both eigenvalues $+1$ is an upper-triangular matrix $\\begin{pmatrix} 1 & b \\\\ 0 & 1 \\end{pmatrix}$. The value of $b$ is ______ (to two decimal places).',
      answer: 0.5, tol: 0.01,
      sol: '$\\begin{pmatrix} 1 & b \\\\ 0 & 1 \\end{pmatrix}^2 = \\begin{pmatrix} 1 & 2b \\\\ 0 & 1 \\end{pmatrix}$, so $2b = 1$ and $b = \\tfrac12$. In general, for a Jordan block $\\lambda I + N$ with $N^2 = 0$, $f(\\lambda I + N) = f(\\lambda)I + f\'(\\lambda)N$; with $f = \\sqrt{\\ }$, $f\'(1) = \\tfrac12$.',
      trap: 'Taking the square root of each entry gives $b = 1$; then the square has top-right entry 2.' },
    { id: 'mev-030', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'trace tricks',
      q: 'A $4\\times4$ Hermitian matrix $H$ satisfies $H^2 = I$ and $\\text{tr}H = 2$. Then $\\det H$ is',
      options: ['$1$', '$2$', '$-1$', '$0$'], answer: 2,
      sol: '$H^2 = I$ forces every eigenvalue to be $\\pm1$. With $n_+ + n_- = 4$ and $n_+ - n_- = 2$: $n_+ = 3$, $n_- = 1$. So $\\det H = (+1)^3(-1) = -1$.',
      trap: 'Assuming $H = I$ from $H^2 = I$; any reflection also squares to $I$.' },
    { id: 'mev-031', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'Cayley-Hamilton',
      q: 'A real $2\\times2$ matrix $A$ has trace 2 and determinant 5. Which statements are true?',
      options: ['Its eigenvalues are $1 \\pm 2i$', '$A$ is diagonalisable over the complex numbers', '$A^2 - 2A + 5I = 0$', '$A$ is orthogonal'], answer: [0, 1, 2],
      sol: '$\\lambda^2 - 2\\lambda + 5 = 0$ gives $\\lambda = 1 \\pm 2i$: distinct, so $A$ is diagonalisable over $\\mathbb C$. Cayley-Hamilton gives $A^2 - 2A + 5I = 0$. An orthogonal matrix has $|\\det| = 1$, not 5 (and eigenvalues of modulus 1, while $|1 \\pm 2i| = \\sqrt5$).',
      trap: 'Real matrices with complex eigenvalues are still diagonalisable over $\\mathbb C$ when the eigenvalues are distinct.' },
    { id: 'mev-032', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'determinant tricks',
      q: 'A $3\\times3$ matrix $A$ has eigenvalues $1$, $-1$ and $2$. The trace of its adjugate (classical adjoint) $\\text{adj}A$ is ______.',
      answer: -1, tol: 0,
      sol: '$\\text{adj}A = (\\det A)A^{-1}$ with $\\det A = -2$. The eigenvalues of $A^{-1}$ are $1, -1, \\tfrac12$, so those of $\\text{adj}A$ are $-2, 2, -1$, summing to $-1$. (Equivalently, $\\text{tr}\\,\\text{adj}A = \\lambda_1\\lambda_2 + \\lambda_2\\lambda_3 + \\lambda_3\\lambda_1 = -1 - 2 + 2 = -1$.)',
      trap: 'Forgetting the factor $\\det A$ and giving $\\text{tr}A^{-1} = \\tfrac12$.' },
    { id: 'mev-033', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'commuting matrices',
      q: '$A$ is Hermitian with all eigenvalues distinct, and $[A, B] = 0$. Then',
      options: ['$B$ must be a multiple of $A$', '$B$ must be Hermitian', '$B$ must be zero', '$B$ is diagonal in the eigenbasis of $A$'], answer: 3,
      sol: 'If $A\\vec v = a\\vec v$ then $A(B\\vec v) = BA\\vec v = a(B\\vec v)$, so $B\\vec v$ lies in the eigenspace of $a$. With no degeneracy that eigenspace is one-dimensional, so $B\\vec v = b\\vec v$: every eigenvector of $A$ is an eigenvector of $B$. $B$ can be any polynomial in $A$, including non-Hermitian ones like $iA$.',
      trap: 'With a degenerate $A$, $B$ need only be block-diagonal; non-degeneracy is what makes it diagonal.' },
    { id: 'mev-034', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'unitary matrices',
      q: 'The matrix $U = \\begin{pmatrix} (1 + i)/2 & 1/\\sqrt2 \\\\ -1/\\sqrt2 & (1 - i)/2 \\end{pmatrix}$ is unitary with $\\det U = 1$. Its eigenvalues are $e^{\\pm i\\phi}$ with $0 \\le \\phi \\le 180^\\circ$. The value of $\\phi$ in degrees is ______.',
      answer: 60, tol: 0.5, calc: () => Math.acos(0.5) * 180 / Math.PI,
      sol: 'Check: $\\det U = \\tfrac{(1 + i)(1 - i)}{4} + \\tfrac12 = \\tfrac12 + \\tfrac12 = 1$. The eigenvalues have modulus 1 and product 1, so they are $e^{\\pm i\\phi}$ with sum $2\\cos\\phi = \\text{tr}U = \\tfrac{1 + i}{2} + \\tfrac{1 - i}{2} = 1$. Hence $\\cos\\phi = \\tfrac12$ and $\\phi = 60^\\circ$.',
      trap: 'Solving the characteristic equation directly works, but the trace gives the angle at once.' },
    { id: 'mev-035', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'Hermitian matrices',
      q: 'A Hermitian matrix $H$ has rank 1 and trace 3. Which relation must hold?',
      options: ['$H^2 = H$', '$H^2 = 3H$', '$H^2 = 9I$', '$H^3 = 3H$'], answer: 1,
      sol: 'A rank-1 Hermitian matrix is $H = \\lambda|u\\rangle\\langle u|$ with $|u\\rangle$ normalised and $\\lambda$ real; the trace gives $\\lambda = 3$. Then $H^2 = 9|u\\rangle\\langle u| = 3H$. (Its eigenvalues are 3 and zeros, all satisfying $\\lambda^2 = 3\\lambda$.)',
      trap: '$H^2 = H$ would need trace equal to rank (a projector), which is not the case here.' },
    { id: 'mev-036', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'antisymmetric matrices',
      q: 'Let $A$ be a real antisymmetric $4\\times4$ matrix ($A^T = -A$). Which statements are always true?',
      options: ['$\\det A \\ge 0$', 'Its eigenvalues are zero or purely imaginary', '$e^{A}$ is orthogonal with determinant $+1$', '$\\text{tr}(A^2) \\ge 0$'], answer: [0, 1, 2],
      sol: '$iA$ is Hermitian, so the eigenvalues of $A$ are $i\\times$(real), and they come in pairs $\\pm i\\omega$ for a real matrix. The determinant is $\\prod(i\\omega)(-i\\omega) = \\prod\\omega^2 \\ge 0$. $(e^{A})^Te^{A} = e^{-A}e^{A} = I$ and $\\det e^{A} = e^{\\text{tr}A} = e^0 = 1$. But $\\text{tr}(A^2) = -\\sum_{ij}A_{ij}^2 \\le 0$.',
      trap: 'The squares of imaginary eigenvalues are negative, so $\\text{tr}A^2$ is never positive.' },

    // ---------- level 5 ----------
    { id: 'mev-037', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'functions of matrices',
      q: 'For $H = \\begin{pmatrix} 1 & 1 & 0 \\\\ 1 & 1 & 1 \\\\ 0 & 1 & 1 \\end{pmatrix}$, the value of $\\text{tr}\\exp\\left[\\dfrac{i\\pi}{\\sqrt2}(H - I)\\right]$ is ______.',
      answer: -1, tol: 0.01, calc: () => 1 + 2 * Math.cos(Math.PI),
      sol: '$H - I = T$ is the tridiagonal matrix with 1 next to the diagonal. Its characteristic polynomial is $-\\lambda^3 + 2\\lambda$, so its eigenvalues are $0, \\pm\\sqrt2$. The exponential has eigenvalues $e^{0} = 1$ and $e^{\\pm i\\pi} = -1$, so the trace is $1 - 1 - 1 = -1$.',
      trap: 'Subtracting $I$ first is the trick: it leaves a matrix whose eigenvalues you can find by hand.' },
    { id: 'mev-038', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'functions of matrices',
      q: 'Square matrices $A$ and $B$ satisfy $[A, B] = cI$ for a number $c$. Then $e^{A}e^{B}$ equals',
      options: ['$e^{A+B}e^{c/2}$', '$e^{A+B}$', '$e^{A+B}e^{-c/2}$', '$e^{A+B}e^{c}$'], answer: 0,
      sol: 'When $[A, B]$ commutes with both $A$ and $B$, the Baker-Campbell-Hausdorff series stops after one term: $e^{A}e^{B} = e^{A + B + \\frac12[A, B]} = e^{A+B}e^{c/2}$. (Finite matrices cannot have $[A, B] = cI$ with $c \\ne 0$, because the trace of a commutator is 0; the result is used for operators like $\\hat x$ and $\\hat p$.)',
      trap: 'Dropping the commutator gives $e^{A+B}$, true only when $A$ and $B$ commute.' },
    { id: 'mev-039', type: 'msq', level: 5, exams: ['gate', 'net'], sub: 'unitary matrices',
      q: 'A $3\\times3$ unitary matrix $U$ has $\\text{tr}U = 3$. Which statements must be true?',
      options: ['$U = I$', '$\\det U = 1$', '$U$ is Hermitian', '$U$ has an eigenvalue $-1$'], answer: [0, 1, 2],
      sol: 'The eigenvalues $\\lambda_k$ have $|\\lambda_k| = 1$, so $|\\lambda_1 + \\lambda_2 + \\lambda_3| \\le 3$ with equality only if all three point the same way; their sum is the real number 3, so all equal 1. A unitary matrix is normal, hence diagonalisable: $U = V\\,I\\,V^\\dagger = I$. So $\\det U = 1$, $U$ is Hermitian, and $-1$ is not an eigenvalue.',
      trap: 'For a non-diagonalisable matrix, all eigenvalues 1 would not force the identity, but unitary matrices are always diagonalisable.' },
    { id: 'mev-040', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'eigenvalues',
      q: 'A real $4\\times4$ matrix $A$ satisfies $A^2 = -I$. The value of $\\det A$ is ______.',
      answer: 1, tol: 0,
      sol: 'Every eigenvalue satisfies $\\lambda^2 = -1$, so $\\lambda = \\pm i$. The characteristic polynomial has real coefficients, so non-real roots come in conjugate pairs with equal multiplicity: $i, i, -i, -i$. Hence $\\det A = (i)(i)(-i)(-i) = 1$. (Also $(\\det A)^2 = \\det(-I) = 1$, and the pairing rules out $-1$.) In odd dimension no real $A$ with $A^2 = -I$ exists.',
      trap: '$(\\det A)^2 = 1$ alone allows $\\pm1$; the conjugate pairing fixes the sign.' },
    ...more2,
    ...r4.items,
  ],
  gens: [
    { id: 'mev-g01', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Hermitian matrices',
      make(r) {
        const p = int(r, -2, 5), s = int(r, -3, 4), q = int(r, 0, 3), w = int(r, 1, 3);
        const answer = round(Math.sqrt((p - s) ** 2 + 4 * (q * q + w * w)), 2);
        const wi = `${w === 1 ? '' : w}i`;
        const off = (sg) => (q === 0 ? (sg === '-' ? '-' : '') + wi : `${q} ${sg} ${wi}`);
        return { q: `The difference between the eigenvalues of the Hermitian matrix $\\begin{pmatrix} ${p} & ${off('-')} \\\\ ${off('+')} & ${s} \\end{pmatrix}$ is ______ (to two decimal places).`,
          answer, tol: 0.01, p, s, re: q, w,
          sol: `For a $2\\times2$ matrix the eigenvalue difference is $\\sqrt{(\\text{tr})^2 - 4\\det} = \\sqrt{(a - d)^2 + 4|b|^2}$ when $b$ and $c = b^*$ are the off-diagonal entries. Here $a - d = ${p - s}$ and $|b|^2 = ${q * q} + ${w * w} = ${q * q + w * w}$, so the difference is $\\sqrt{${(p - s) ** 2} + ${4 * (q * q + w * w)}} \\approx ${answer}$.`,
          trap: 'Using $b^2$ instead of $|b|^2$ for the complex off-diagonal entry.' };
      },
      verify: (p) => { const t = p.p + p.s, D = p.p * p.s - (p.re * p.re + p.w * p.w); return Math.sqrt(t * t - 4 * D); } },
    { id: 'mev-g02', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'functions of matrices',
      make(r) {
        const k = int(r, 2, 6), c = int(r, 1, 2);
        const answer = round(c * (k + 1 / k), 3);
        return { q: `For $A = \\begin{pmatrix} 0 & \\ln${k} \\\\ \\ln${k} & 0 \\end{pmatrix}$, find $\\text{tr}\\left(${c === 1 ? '' : c}e^{A}\\right)$ (to three decimal places).`,
          answer, tol: 0.002, k, c,
          sol: `$A$ has eigenvalues $\\pm\\ln${k}$ (eigenvectors $(1, \\pm1)$), so $e^{A}$ has eigenvalues $${k}$ and $1/${k}$. The trace is $${c === 1 ? '' : c + '\\times'}(${k} + 1/${k}) \\approx ${answer}$.`,
          trap: 'Exponentiating each entry separately is not the matrix exponential.' };
      },
      verify: (p) => { // series for e^A, A = [[0,L],[L,0]]
        const L = Math.log(p.k); let t = [[1, 0], [0, 1]], S = [[1, 0], [0, 1]];
        for (let n = 1; n < 60; n++) { t = [[(t[0][1] * L) / n, (t[0][0] * L) / n], [(t[1][1] * L) / n, (t[1][0] * L) / n]]; S = [[S[0][0] + t[0][0], S[0][1] + t[0][1]], [S[1][0] + t[1][0], S[1][1] + t[1][1]]]; }
        return p.c * (S[0][0] + S[1][1]); } },
    { id: 'mev-g03', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'determinant tricks',
      make(r) {
        const u = [int(r, 1, 3), int(r, -2, 2), int(r, 1, 3)], v = [int(r, 1, 2), int(r, -1, 2), int(r, -1, 1)];
        const M = u.map((ui) => v.map((vj) => ui * vj));
        const answer = 1 + u[0] * v[0] + u[1] * v[1] + u[2] * v[2];
        return { q: `For $A = ${pm(M)}$, find $\\det(I + A)$.`,
          answer, tol: 0, M,
          sol: `Every row of $A$ is a multiple of $(${v.join(', ')})$, so $A = \\vec u\\vec v^T$ with $\\vec u = (${u.join(', ')})^T$, $\\vec v = (${v.join(', ')})^T$: rank 1 (or 0). Its only possibly non-zero eigenvalue is $\\vec v^T\\vec u = ${answer - 1}$, so $I + A$ has eigenvalues $${answer}, 1, 1$ and $\\det(I + A) = 1 + \\vec v^T\\vec u = ${answer}$.`,
          trap: '$\\det(I + A)$ is not $1 + \\det A$ (which is 1 here).' };
      },
      verify: (p) => { const B = p.M.map((row, i) => row.map((x, j) => x + (i === j ? 1 : 0)));
        return B[0][0] * (B[1][1] * B[2][2] - B[1][2] * B[2][1]) - B[0][1] * (B[1][0] * B[2][2] - B[1][2] * B[2][0]) + B[0][2] * (B[1][0] * B[2][1] - B[1][1] * B[2][0]); } },
    { id: 'mev-g04', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'determinant tricks',
      make(r) {
        const a = int(r, 1, 3), b = int(r, -3, -1), c = int(r, 2, 5);
        const pair = a * b + b * c + c * a, det = a * b * c, sum = a + b + c;
        const o = mcqOptions(r, pair, [det, sum, -pair, pair + 1, pair - 1, pair + 2], (x) => `$${x}$`);
        return { q: `A $3\\times3$ matrix has eigenvalues $${a}$, $${b}$ and $${c}$. The trace of its adjugate $\\text{adj}A = (\\det A)A^{-1}$ is`, ...o,
          sol: `The eigenvalues of $\\text{adj}A$ are $\\det A/\\lambda_k$, i.e. the products of the other two eigenvalues: $${b * c}, ${a * c}, ${a * b}$. Their sum is $${pair}$.`,
          trap: 'Answering $\\det A$ or $\\text{tr}A$; the adjugate trace is the sum of pairwise products.' };
      } },
    { id: 'mev-g05', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Pauli matrices',
      make(r) {
        const [vec, txt] = choose(r, [[[1, 0, 0], '\\sigma_x'], [[0, 0, 1], '\\sigma_z'], [[1, 1, 0], '\\frac{\\sigma_x + \\sigma_y}{\\sqrt2}'], [[3, 4, 0], '\\frac{3\\sigma_x + 4\\sigma_y}{5}'], [[0, 3, 4], '\\frac{3\\sigma_y + 4\\sigma_z}{5}'], [[1, 1, 1], '\\frac{\\sigma_x + \\sigma_y + \\sigma_z}{\\sqrt3}']]);
        const [num, den, thTxt] = choose(r, [[1, 2, '\\pi/2'], [1, 3, '\\pi/3'], [1, 4, '\\pi/4'], [1, 6, '\\pi/6'], [2, 3, '2\\pi/3'], [3, 4, '3\\pi/4']]);
        const th = (num * Math.PI) / den, answer = round(2 * Math.cos(th), 3);
        return { q: `Find $\\text{tr}\\exp\\left[i\\,(${thTxt})\\,${txt}\\right]$ (to three decimal places).`,
          answer, tol: 0.003, vec, th,
          sol: `The matrix multiplying $i\\theta$ is $\\hat n\\cdot\\vec\\sigma$ with $\\hat n$ a unit vector, so its square is $I$ and $e^{i\\theta\\hat n\\cdot\\vec\\sigma} = I\\cos\\theta + i\\,\\hat n\\cdot\\vec\\sigma\\,\\sin\\theta$. The Pauli part is traceless, so the trace is $2\\cos(${thTxt}) \\approx ${answer}$.`,
          trap: 'The direction $\\hat n$ does not matter for the trace; only the angle does.' };
      },
      verify: (p) => { // series for exp(i th n.s) as 2x2 complex matrix
        const L = Math.hypot(...p.vec), [nx, ny, nz] = p.vec.map((x) => x / L), th = p.th;
        // M = i th (n.s) entries as [re, im]
        const M = [[[0, th * nz], [th * ny, th * nx]], [[-th * ny, th * nx], [0, -th * nz]]];
        const mul = (A, B) => A.map((row, i) => B[0].map((_, j) => row.reduce((s, a, k) => { const b = B[k][j]; return [s[0] + a[0] * b[0] - a[1] * b[1], s[1] + a[0] * b[1] + a[1] * b[0]]; }, [0, 0])));
        let T = [[[1, 0], [0, 0]], [[0, 0], [1, 0]]], S = T.map((r) => r.map((z) => z.slice()));
        for (let n = 1; n < 40; n++) { T = mul(T, M).map((r) => r.map(([a, b]) => [a / n, b / n])); S = S.map((r, i) => r.map((z, j) => [z[0] + T[i][j][0], z[1] + T[i][j][1]])); }
        return S[0][0][0] + S[1][1][0]; } },
    { id: 'mev-g06', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'normal modes',
      make(r) {
        const k1 = int(r, 1, 4), k2 = int(r, 1, 3), m = int(r, 1, 3);
        // M = diag(1, m), K = [[k1+k2, -k2], [-k2, k2]]: m w^2 - (k2 + m(k1+k2)) w + k1 k2 = 0
        const B = k2 + m * (k1 + k2), answer = round((B - Math.sqrt(B * B - 4 * m * k1 * k2)) / (2 * m), 3);
        return { q: `Mass 1 is tied to a wall by a spring of stiffness ${k1} and to mass 2 by a spring of stiffness ${k2}; mass 2 is otherwise free. The masses are 1 and ${m} (consistent units), so $M = \\text{diag}(1, ${m})$ and $K = ${pm([[k1 + k2, -k2], [-k2, k2]])}$ in $M\\ddot{\\vec x} = -K\\vec x$. Find the smaller normal-mode $\\omega^2$ (to three decimal places).`,
          answer, tol: 0.003, k1, k2, m,
          sol: `$\\det(K - \\omega^2M) = (${k1 + k2} - \\omega^2)(${k2} - ${m}\\omega^2) - ${k2 * k2} = 0$ gives $${m}\\omega^4 - ${B}\\omega^2 + ${k1 * k2} = 0$. The smaller root is $\\omega^2 = \\dfrac{${B} - \\sqrt{${B * B} - ${4 * m * k1 * k2}}}{${2 * m}} \\approx ${answer}$.`,
          trap: 'Diagonalising $K$ alone ignores the mass matrix.' };
      },
      verify: (p) => { // eigenvalues of M^{-1/2} K M^{-1/2}
        const s = 1 / Math.sqrt(p.m), A = p.k1 + p.k2, Bm = -p.k2 * s, D = p.k2 / p.m;
        const t = A + D, det = A * D - Bm * Bm; return (t - Math.sqrt(t * t - 4 * det)) / 2; } },
    { id: 'mev-g07', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'quadratic forms',
      make(r) {
        const kind = int(r, 0, 3);
        let a, b, c;
        if (kind === 0) { a = int(r, 2, 5); c = int(r, 2, 5); b = int(r, 0, 1); }         // ellipse: ac > b^2
        else if (kind === 1) { a = int(r, 1, 3); c = int(r, 1, 3); b = a * c + int(r, 1, 3); } // hyperbola: ac < b^2
        else if (kind === 2) { const s = int(r, 1, 3), t = int(r, 1, 2); a = s * s; c = t * t; b = s * t; } // ac = b^2: parallel lines
        else { a = -int(r, 2, 5); c = -int(r, 2, 5); b = int(r, 0, 1); }                    // both eigenvalues negative
        const det = a * c - b * b, tr = a + c;
        const options = ['an ellipse', 'a hyperbola', 'a pair of parallel straight lines', 'no real points at all'];
        const t2 = (n, v) => (n === 0 ? '' : `${n > 0 ? ' + ' : ' - '}${Math.abs(n) === 1 ? '' : Math.abs(n)}${v}`);
        const form = `${a === 1 ? '' : a === -1 ? '-' : a}x^2${t2(2 * b, 'xy')}${t2(c, 'y^2')}`;
        return { q: `The set of points with $${form} = 1$ is`, options, answer: kind, a, b, c,
          sol: `Write it as $\\vec x^TA\\vec x = 1$ with $A = ${pm([[a, b], [b, c]])}$: $\\det A = ${det}$, $\\text{tr}A = ${tr}$. ${[
            'Both eigenvalues are positive (det > 0, trace > 0): in the eigenvector axes $\\lambda_1X^2 + \\lambda_2Y^2 = 1$, an ellipse.',
            'The eigenvalues have opposite signs (det < 0): in the eigenvector axes $\\lambda_1X^2 - |\\lambda_2|Y^2 = 1$, a hyperbola.',
            'One eigenvalue is zero and the other positive (det = 0, trace > 0): $\\lambda_1X^2 = 1$, the two parallel lines $X = \\pm1/\\sqrt{\\lambda_1}$.',
            'Both eigenvalues are negative (det > 0, trace < 0), so the left side is never positive: no real points.'][kind]}`,
          trap: 'The cross term decides: look at $\\det A$, not at the signs of the $x^2$ and $y^2$ coefficients.' };
      },
      verify: (p) => { const det = p.a * p.c - p.b * p.b, tr = p.a + p.c; return det < 0 ? 1 : det === 0 ? 2 : tr > 0 ? 0 : 3; } },
    { id: 'mev-g08', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'powers of matrices',
      make(r) {
        const n = int(r, 8, 18);
        let a = 0, b = 1; for (let i = 0; i < n; i++) [a, b] = [b, a + b];
        return { q: `For $A = \\begin{pmatrix} 1 & 1 \\\\ 1 & 0 \\end{pmatrix}$, find the top-right entry of $A^{${n}}$.`,
          answer: a, tol: 0, n,
          sol: `$A\\begin{pmatrix} F_{k} \\\\ F_{k-1} \\end{pmatrix} = \\begin{pmatrix} F_{k+1} \\\\ F_{k} \\end{pmatrix}$, so $A^n = \\begin{pmatrix} F_{n+1} & F_n \\\\ F_n & F_{n-1} \\end{pmatrix}$ with Fibonacci numbers $F_1 = F_2 = 1$. From the eigenvalues $\\varphi, \\psi = (1 \\pm \\sqrt5)/2$: $F_n = (\\varphi^n - \\psi^n)/\\sqrt5$. For $n = ${n}$: $F_{${n}} = ${a}$.`,
          trap: 'Off by one: the top-right entry of $A^n$ is $F_n$, the top-left is $F_{n+1}$.' };
      },
      verify: (p) => Math.round((((1 + Math.sqrt(5)) / 2) ** p.n - ((1 - Math.sqrt(5)) / 2) ** p.n) / Math.sqrt(5)) },
    ...more,
    ...r4.gens,
  ],
};
