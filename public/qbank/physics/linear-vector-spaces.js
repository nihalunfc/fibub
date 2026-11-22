// Linear vector spaces and Dirac notation: axioms, bases and dimension, inner products, Gram-Schmidt, bras and kets,
// outer products, projectors, completeness, change of basis, function spaces and tensor products.
// Original questions for GATE and CSIR NET practice (fibub), with a few BSc-level ones also tagged for IIT JAM.
// Levels: 1 warm-up ... 5 top rank.
import { int, choose, mcqOptions, round } from '../_util.js';
import more from './linear-vector-spaces.more.gen.js';
import more2 from './linear-vector-spaces.more2.gen.js';
import r4 from './linear-vector-spaces.r4.gen.js';

export default {
  topic: 'linear-vector-spaces',
  items: [
    // ---------- level 1 ----------
    { id: 'lvs-001', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'vector space axioms',
      q: 'Which of these sets, with the usual addition and multiplication by real numbers, is a real vector space?',
      options: ['All real $2\\times2$ matrices with trace zero', 'All polynomials of degree exactly 3', 'All vectors $(x, y, z)$ in $\\mathbb R^3$ with $x + y + z = 1$', 'All real $2\\times2$ matrices with determinant zero'], answer: 0,
      sol: 'A subset is a vector space (a subspace) when it contains the zero vector and is closed under addition and scalar multiplication. Trace is linear: $\\text{tr}(aA + bB) = a\\,\\text{tr}A + b\\,\\text{tr}B$, so traceless matrices stay traceless, and the zero matrix is traceless. Degree exactly 3 fails: $x^3 + (-x^3 + x) = x$ has degree 1, and the zero polynomial is missing. The plane $x + y + z = 1$ does not contain the zero vector. Determinant is not linear: $\\text{diag}(1, 0) + \\text{diag}(0, 1) = I$ has determinant 1.',
      trap: 'Check the zero vector first: a set that misses it can never be a vector space.' },
    { id: 'lvs-002', type: 'nat', level: 1, exams: ['jam', 'gate', 'net'], sub: 'dimension',
      q: 'The dimension of the real vector space of all real symmetric $3\\times3$ matrices is ______.',
      answer: 6, tol: 0,
      sol: 'A symmetric matrix is fixed by its diagonal (3 entries) and the entries above the diagonal (3 entries); the ones below are copies. A basis is the 3 matrices with a single 1 on the diagonal and the 3 matrices with 1 in positions $(i, j)$ and $(j, i)$. So the dimension is $3 + 3 = 6$, or in general $n(n+1)/2$.',
      trap: 'Counting all 9 entries ignores the constraint $A_{ij} = A_{ji}$.' },
    { id: 'lvs-003', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'inner product',
      q: 'In $\\mathbb C^2$ with $\\langle u|v\\rangle = \\sum_k u_k^* v_k$, the inner product of $|u\\rangle = (1, i)^T$ with $|v\\rangle = (i, 1)^T$ is',
      options: ['$2i$', '$2$', '$0$', '$-2i$'], answer: 2,
      sol: 'The bra conjugates the components of $|u\\rangle$: $\\langle u| = (1, -i)$. So $\\langle u|v\\rangle = 1\\cdot i + (-i)\\cdot 1 = 0$. The two vectors are orthogonal.',
      trap: 'Forgetting to conjugate gives $1\\cdot i + i\\cdot1 = 2i$.' },
    { id: 'lvs-004', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'inner product',
      q: 'The norm of the vector $(1 + i,\\ 2,\\ -i)^T$ in $\\mathbb C^3$ (standard inner product) is',
      options: ['$\\sqrt5$', '$7$', '$\\sqrt3$', '$\\sqrt7$'], answer: 3,
      sol: '$\\lVert v\\rVert^2 = \\sum|v_k|^2 = |1+i|^2 + |2|^2 + |-i|^2 = 2 + 4 + 1 = 7$, so $\\lVert v\\rVert = \\sqrt7$.',
      trap: 'Squaring the components instead of taking $|v_k|^2$: $(1+i)^2 + 4 + (-i)^2 = 3 + 2i$, which is not even real.' },
    { id: 'lvs-005', type: 'nat', level: 1, exams: ['gate', 'net'], sub: 'dimension',
      q: 'The set of all $2\\times2$ complex Hermitian matrices is a vector space over the real numbers. Its dimension is ______.',
      answer: 4, tol: 0,
      sol: 'A Hermitian matrix $\\begin{pmatrix} a & b - ic \\\\ b + ic & d \\end{pmatrix}$ has real $a, b, c, d$: four real parameters. A basis is $\\{I, \\sigma_x, \\sigma_y, \\sigma_z\\}$, so the dimension is 4. (It is not a complex vector space: $i$ times a Hermitian matrix is anti-Hermitian.)',
      trap: 'Answering 8 (the real dimension of all complex $2\\times2$ matrices) or 3 (forgetting the identity).' },
    { id: 'lvs-006', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'linear independence',
      q: 'The vectors $(1, 1, 0)$, $(0, 1, 1)$ and $(1, 0, 1)$ in $\\mathbb R^3$',
      options: ['are linearly dependent', 'are linearly independent and form a basis of $\\mathbb R^3$', 'are independent but span only a plane', 'span a line'], answer: 1,
      sol: 'Put them as rows of a matrix: $\\det\\begin{pmatrix} 1 & 1 & 0 \\\\ 0 & 1 & 1 \\\\ 1 & 0 & 1 \\end{pmatrix} = 1(1 - 0) - 1(0 - 1) + 0 = 2 \\neq 0$. Non-zero determinant means independent, and three independent vectors in a 3-dimensional space always form a basis.',
      trap: 'Three independent vectors cannot "span only a plane": independence plus the right count already means a basis.' },

    // ---------- level 2 ----------
    { id: 'lvs-007', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'linear operators',
      q: 'Which of these maps, acting on differentiable functions $f(x)$, are linear operators?',
      options: ['$f \\mapsto \\dfrac{df}{dx}$', '$f \\mapsto f^2$', '$f \\mapsto x\\,f(x)$', '$f \\mapsto f(x) + 1$'], answer: [0, 2],
      sol: 'Linear means $\\hat O(af + bg) = a\\hat Of + b\\hat Og$. Differentiation and multiplication by $x$ pass this test. Squaring gives $(f + g)^2 \\neq f^2 + g^2$. Adding 1 fails because it does not send the zero function to zero ($\\hat O(0) = 1$).',
      trap: 'Adding a constant looks harmless, but a linear operator must map zero to zero.' },
    { id: 'lvs-008', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'normalisation',
      q: 'The ket $|\\psi\\rangle = N(3|1\\rangle + 4i|2\\rangle)$, with $\\{|1\\rangle, |2\\rangle\\}$ orthonormal, is normalised for a real positive $N$ equal to ______.',
      answer: 0.2, tol: 0.001, calc: () => 1 / Math.hypot(3, 4),
      sol: '$\\langle\\psi|\\psi\\rangle = N^2(|3|^2 + |4i|^2) = 25N^2 = 1$, so $N = 1/5 = 0.2$.',
      trap: 'Using $(4i)^2 = -16$ gives $9 - 16 < 0$; the norm uses $|4i|^2 = 16$.' },
    { id: 'lvs-009', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'outer product',
      q: 'With $|a\\rangle = (1, 0)^T$ and $|b\\rangle = (i, 1)^T$, the outer product $|a\\rangle\\langle b|$ is the matrix',
      options: ['$\\begin{pmatrix} -i & 1 \\\\ 0 & 0 \\end{pmatrix}$', '$\\begin{pmatrix} i & 1 \\\\ 0 & 0 \\end{pmatrix}$', '$\\begin{pmatrix} -i & 0 \\\\ 1 & 0 \\end{pmatrix}$', '$\\begin{pmatrix} i & 0 \\\\ 1 & 0 \\end{pmatrix}$'], answer: 0,
      sol: '$\\langle b|$ is the conjugate transpose of $|b\\rangle$: the row $(-i,\\ 1)$. A column times a row: $\\begin{pmatrix} 1 \\\\ 0 \\end{pmatrix}(-i,\\ 1) = \\begin{pmatrix} -i & 1 \\\\ 0 & 0 \\end{pmatrix}$.',
      trap: 'Forgetting the conjugate gives $i$ in the corner; writing the row as a column gives the transposed answers.' },
    { id: 'lvs-010', type: 'nat', level: 2, exams: ['jam', 'gate', 'net'], sub: 'Gram-Schmidt',
      q: 'Gram-Schmidt is applied to $\\vec v_1 = (1, 1, 0)$ and $\\vec v_2 = (1, 0, 1)$: $\\vec u_2 = \\vec v_2 - \\dfrac{\\vec v_2\\cdot\\vec v_1}{\\vec v_1\\cdot\\vec v_1}\\vec v_1$. The value of $|\\vec u_2|^2$ is ______.',
      answer: 1.5, tol: 0.01, calc: () => 2 - 1 / 2,
      sol: '$\\vec v_2\\cdot\\vec v_1 = 1$ and $\\vec v_1\\cdot\\vec v_1 = 2$, so $\\vec u_2 = (1, 0, 1) - \\tfrac12(1, 1, 0) = (\\tfrac12, -\\tfrac12, 1)$ and $|\\vec u_2|^2 = \\tfrac14 + \\tfrac14 + 1 = 1.5$. Check: $|\\vec v_2|^2 - (\\vec v_2\\cdot\\vec v_1)^2/|\\vec v_1|^2 = 2 - \\tfrac12 = 1.5$ (Pythagoras).',
      trap: 'Dividing by $|\\vec v_1|$ instead of $|\\vec v_1|^2$ in the projection.' },
    { id: 'lvs-011', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'Cauchy-Schwarz',
      q: 'The Cauchy-Schwarz inequality $|\\langle u|v\\rangle|^2 \\le \\langle u|u\\rangle\\langle v|v\\rangle$ becomes an equality exactly when',
      options: ['$|u\\rangle$ and $|v\\rangle$ are orthogonal', '$|u\\rangle$ and $|v\\rangle$ have the same norm', 'one of the vectors is a (complex) multiple of the other', 'both vectors have real components'], answer: 2,
      sol: 'Write $|v\\rangle = c|u\\rangle + |w\\rangle$ with $\\langle u|w\\rangle = 0$. Then $|\\langle u|v\\rangle|^2 = |c|^2\\langle u|u\\rangle^2$ while $\\langle u|u\\rangle\\langle v|v\\rangle = \\langle u|u\\rangle(|c|^2\\langle u|u\\rangle + \\langle w|w\\rangle)$. They are equal only when $\\langle w|w\\rangle = 0$, that is $|w\\rangle = 0$: the vectors are parallel.',
      trap: 'Orthogonal vectors give the opposite extreme: the left side is zero.' },
    { id: 'lvs-012', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'completeness',
      q: 'For an orthonormal basis $\\{|n\\rangle\\}$ of a finite-dimensional space, the operator $\\sum_n |n\\rangle\\langle n|$ equals',
      options: ['the zero operator', 'the number equal to the dimension', 'the projector onto $|1\\rangle$ only', 'the identity operator'], answer: 3,
      sol: 'Any vector expands as $|\\psi\\rangle = \\sum_n c_n|n\\rangle$ with $c_n = \\langle n|\\psi\\rangle$, so $|\\psi\\rangle = \\sum_n |n\\rangle\\langle n|\\psi\\rangle$ for every $|\\psi\\rangle$. That says $\\sum_n |n\\rangle\\langle n| = \\hat 1$: the completeness relation. (Its trace is the dimension, which is where the second option comes from.)',
      trap: '$\\sum_n \\langle n|n\\rangle$ (a number) is not the same as $\\sum_n |n\\rangle\\langle n|$ (an operator).' },
    { id: 'lvs-013', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'outer product',
      q: 'For the (unnormalised) ket $|\\psi\\rangle = (1,\\ 2i,\\ 2)^T$, the trace of the operator $|\\psi\\rangle\\langle\\psi|$ is ______.',
      answer: 9, tol: 0,
      sol: '$\\text{tr}(|\\psi\\rangle\\langle\\psi|) = \\sum_k \\psi_k\\psi_k^* = \\langle\\psi|\\psi\\rangle = 1 + 4 + 4 = 9$. In general $\\text{tr}(|a\\rangle\\langle b|) = \\langle b|a\\rangle$.',
      trap: 'Summing $\\psi_k^2$ without the conjugate gives $1 - 4 + 4 = 1$.' },
    { id: 'lvs-014', type: 'mcq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'change of basis',
      q: 'In the orthonormal basis $|e_1\\rangle = (1, 1)/\\sqrt2$, $|e_2\\rangle = (1, -1)/\\sqrt2$, the component of $|v\\rangle = (3, 1)$ along $|e_2\\rangle$ is',
      options: ['$2\\sqrt2$', '$\\sqrt2$', '$1$', '$2$'], answer: 1,
      sol: 'In an orthonormal basis the component is the inner product: $\\langle e_2|v\\rangle = (3 - 1)/\\sqrt2 = 2/\\sqrt2 = \\sqrt2$. (Along $|e_1\\rangle$: $4/\\sqrt2 = 2\\sqrt2$; check $(\\sqrt2)^2 + (2\\sqrt2)^2 = 10 = |v|^2$.)',
      trap: 'Forgetting the $1/\\sqrt2$ gives 2; taking the $e_1$ component gives $2\\sqrt2$.' },
    { id: 'lvs-015', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'inner product',
      q: 'For $\\vec u, \\vec v \\in \\mathbb R^2$, which of these define a valid inner product $\\langle\\vec u, \\vec v\\rangle$?',
      options: ['$u_1v_1 + 2u_2v_2$', '$u_1v_1 - u_2v_2$', '$u_1v_2 + u_2v_1$', '$2u_1v_1 + u_1v_2 + u_2v_1 + u_2v_2$'], answer: [0, 3],
      sol: 'Each is $\\vec u^T G\\vec v$ for a symmetric $G$; it is an inner product when $G$ is positive definite. A: $G = \\text{diag}(1, 2)$, positive. B: $\\text{diag}(1, -1)$ gives $\\langle\\vec v, \\vec v\\rangle = -1$ for $(0, 1)$. C: $G = \\begin{pmatrix} 0 & 1 \\\\ 1 & 0 \\end{pmatrix}$ gives $-2$ for $(1, -1)$. D: $G = \\begin{pmatrix} 2 & 1 \\\\ 1 & 1 \\end{pmatrix}$ has trace 3 and determinant 1, so both eigenvalues are positive: valid.',
      trap: 'Symmetry and linearity are easy; positivity ($\\langle v, v\\rangle > 0$ for $v \\ne 0$) is where B and C fail.' },
    { id: 'lvs-016', type: 'nat', level: 2, exams: ['jam', 'gate', 'net'], sub: 'dimension',
      q: 'The dimension of the subspace of $\\mathbb R^4$ spanned by $(1, 0, 1, 0)$, $(0, 1, 0, 1)$, $(1, 1, 1, 1)$ and $(1, -1, 1, -1)$ is ______.',
      answer: 2, tol: 0,
      sol: 'Call them $a, b, c, d$. Then $c = a + b$ and $d = a - b$, while $a$ and $b$ are independent. So the span is the plane spanned by $a$ and $b$: dimension 2.',
      trap: 'Four vectors do not mean four dimensions; look for combinations first.' },

    // ---------- level 3 ----------
    { id: 'lvs-017', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Dirac notation',
      q: 'With $\\{|1\\rangle, |2\\rangle\\}$ orthonormal and $\\hat A = |1\\rangle\\langle2|$, the operator $\\hat A^\\dagger\\hat A$ equals',
      options: ['$|1\\rangle\\langle1|$', '$|2\\rangle\\langle2|$', '$0$', '$\\hat 1$'], answer: 1,
      sol: '$\\hat A^\\dagger = (|1\\rangle\\langle2|)^\\dagger = |2\\rangle\\langle1|$. So $\\hat A^\\dagger\\hat A = |2\\rangle\\langle1|1\\rangle\\langle2| = |2\\rangle\\langle2|$, using $\\langle1|1\\rangle = 1$.',
      trap: '$|1\\rangle\\langle1|$ is $\\hat A\\hat A^\\dagger$; the order matters.' },
    { id: 'lvs-018', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'expectation values',
      q: 'An operator is $\\hat A = |1\\rangle\\langle1| + 2|2\\rangle\\langle2| + 3|3\\rangle\\langle3|$ in an orthonormal basis. For $|\\psi\\rangle = \\tfrac13\\left(|1\\rangle + 2i|2\\rangle + 2|3\\rangle\\right)$, the value of $\\langle\\psi|\\hat A|\\psi\\rangle$ is ______ (to two decimal places).',
      answer: 2.33, tol: 0.01, calc: () => (1 * 1 + 2 * 4 + 3 * 4) / 9,
      sol: 'First check the norm: $(1 + 4 + 4)/9 = 1$. Then $\\langle\\hat A\\rangle = \\sum_n a_n|c_n|^2 = 1\\cdot\\tfrac19 + 2\\cdot\\tfrac49 + 3\\cdot\\tfrac49 = \\tfrac{21}{9} \\approx 2.33$.',
      trap: 'The phase $i$ does not matter: only $|c_n|^2$ enters.' },
    { id: 'lvs-019', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'change of basis',
      q: 'Let $|\\pm\\rangle = (|0\\rangle \\pm |1\\rangle)/\\sqrt2$, where $\\sigma_z|0\\rangle = |0\\rangle$ and $\\sigma_z|1\\rangle = -|1\\rangle$. The matrix of $\\sigma_z$ in the basis $\\{|+\\rangle, |-\\rangle\\}$ is',
      options: ['$\\begin{pmatrix} 1 & 0 \\\\ 0 & -1 \\end{pmatrix}$', '$\\begin{pmatrix} 0 & -i \\\\ i & 0 \\end{pmatrix}$', '$\\begin{pmatrix} 0 & 1 \\\\ 1 & 0 \\end{pmatrix}$', '$\\dfrac{1}{\\sqrt2}\\begin{pmatrix} 1 & 1 \\\\ 1 & -1 \\end{pmatrix}$'], answer: 2,
      sol: '$\\sigma_z|+\\rangle = (|0\\rangle - |1\\rangle)/\\sqrt2 = |-\\rangle$ and $\\sigma_z|-\\rangle = |+\\rangle$. So $\\langle+|\\sigma_z|+\\rangle = 0$, $\\langle-|\\sigma_z|+\\rangle = 1$, $\\langle+|\\sigma_z|-\\rangle = 1$, $\\langle-|\\sigma_z|-\\rangle = 0$. The matrix is $\\begin{pmatrix} 0 & 1 \\\\ 1 & 0 \\end{pmatrix}$: in the $x$ basis, $\\sigma_z$ looks like $\\sigma_x$.',
      trap: 'An operator keeps its eigenvalues in every basis, but its matrix changes; it is diagonal only in its own eigenbasis.' },
    { id: 'lvs-020', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'Hermitian operators',
      q: 'For a Hermitian operator on a finite-dimensional complex inner-product space, which statements are always true?',
      options: ['Its eigenvalues are real', 'Eigenvectors belonging to different eigenvalues are orthogonal', 'Its eigenvectors can be chosen to form an orthonormal basis', 'It is invertible'], answer: [0, 1, 2],
      sol: 'Real eigenvalues and orthogonality for distinct eigenvalues follow from $\\langle a|\\hat H b\\rangle = \\langle\\hat H a|b\\rangle$. The spectral theorem adds completeness: an orthonormal eigenbasis exists (degenerate eigenspaces are orthonormalised by Gram-Schmidt). Invertibility fails when 0 is an eigenvalue, for example $|1\\rangle\\langle1|$.',
      trap: 'Hermitian does not mean invertible: a projector is Hermitian with eigenvalue 0.' },
    { id: 'lvs-021', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'inner product',
      q: 'For $|a\\rangle = (1,\\ i,\\ 0)^T$ and $|b\\rangle = (0,\\ 1,\\ i)^T$, define the angle $\\theta$ between them by $\\cos\\theta = |\\langle a|b\\rangle|/(\\lVert a\\rVert\\,\\lVert b\\rVert)$. Then $\\theta$ in degrees is ______.',
      answer: 60, tol: 0.5, calc: () => Math.acos(1 / 2) * 180 / Math.PI,
      sol: '$\\langle a| = (1, -i, 0)$, so $\\langle a|b\\rangle = 0 + (-i)(1) + 0 = -i$ and $|\\langle a|b\\rangle| = 1$. Both norms are $\\sqrt2$. So $\\cos\\theta = 1/2$ and $\\theta = 60^\\circ$.',
      trap: 'Without the conjugate you get $i$, the same modulus here, but the habit costs marks elsewhere.' },
    { id: 'lvs-022', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'function spaces',
      q: 'With the inner product $\\langle f, g\\rangle = \\int_{-1}^{1} f(x)g(x)\\,dx$, which pair of functions is orthogonal?',
      options: ['$1$ and $x^2$', '$x$ and $x^3$', '$1$ and $x^4$', '$x$ and $x^2$'], answer: 3,
      sol: '$x\\cdot x^2 = x^3$ is odd, so its integral over the symmetric interval vanishes. The other products are even and positive: $\\int x^2 = \\tfrac23$, $\\int x^4 = \\tfrac25$ (twice: for $1\\cdot x^4$ and $x\\cdot x^3$).',
      trap: 'Different powers are not automatically orthogonal; parity decides here.' },
    { id: 'lvs-023', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Gram-Schmidt',
      q: 'Gram-Schmidt on $\\{1, x, x^2\\}$ with $\\langle f, g\\rangle = \\int_{-1}^{1} fg\\,dx$ gives a third orthogonal polynomial of the form $x^2 - c$. The constant $c$ is ______ (to three decimal places).',
      answer: 0.333, tol: 0.002, calc: () => (2 / 3) / 2,
      sol: 'Subtract the projections of $x^2$ on the first two: $\\langle x^2, x\\rangle = 0$ (odd), and $\\langle x^2, 1\\rangle/\\langle1, 1\\rangle = (2/3)/2 = 1/3$. So the polynomial is $x^2 - \\tfrac13$, which is proportional to the Legendre polynomial $P_2 = \\tfrac12(3x^2 - 1)$.',
      trap: 'Forgetting to divide by $\\langle1, 1\\rangle = 2$ gives $c = 2/3$.' },
    { id: 'lvs-024', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Dirac notation',
      q: 'With $\\{|1\\rangle, |2\\rangle\\}$ orthonormal, $\\hat A = |1\\rangle\\langle2|$ and $\\hat B = |2\\rangle\\langle1|$, the commutator $[\\hat A, \\hat B]$ is',
      options: ['$|1\\rangle\\langle1| - |2\\rangle\\langle2|$', '$0$', '$\\hat 1$', '$|2\\rangle\\langle2| - |1\\rangle\\langle1|$'], answer: 0,
      sol: '$\\hat A\\hat B = |1\\rangle\\langle2|2\\rangle\\langle1| = |1\\rangle\\langle1|$ and $\\hat B\\hat A = |2\\rangle\\langle1|1\\rangle\\langle2| = |2\\rangle\\langle2|$. So $[\\hat A, \\hat B] = |1\\rangle\\langle1| - |2\\rangle\\langle2|$, which is $\\sigma_z$ (these are the raising and lowering operators $\\sigma_\\pm$).',
      trap: 'Getting the sign backwards by computing $\\hat B\\hat A - \\hat A\\hat B$.' },
    { id: 'lvs-025', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'matrix spaces',
      q: 'The complex $2\\times2$ matrices form an inner-product space with $\\langle A, B\\rangle = \\text{tr}(A^\\dagger B)$. Which statements are true?',
      options: ['$I, \\sigma_x, \\sigma_y, \\sigma_z$ are mutually orthogonal', 'Each Pauli matrix has norm $\\sqrt2$', 'The space has complex dimension 4', '$\\sigma_x$ and $i\\sigma_x$ are orthogonal'], answer: [0, 1, 2],
      sol: 'The Pauli matrices are traceless and Hermitian with $\\sigma_j\\sigma_k = \\delta_{jk}I + i\\epsilon_{jkl}\\sigma_l$, so $\\text{tr}(\\sigma_j\\sigma_k) = 2\\delta_{jk}$ and $\\text{tr}(I\\sigma_j) = 0$: orthogonal, each of norm $\\sqrt2$ (as is $I$). Four orthogonal non-zero matrices in the 4-dimensional space of $2\\times2$ matrices form a basis. But $\\langle\\sigma_x, i\\sigma_x\\rangle = i\\,\\text{tr}(\\sigma_x^2) = 2i \\neq 0$.',
      trap: 'Over the complex numbers, $i\\sigma_x$ is a multiple of $\\sigma_x$: parallel, not orthogonal.' },
    { id: 'lvs-026', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Pauli expansion',
      q: 'Write $M = \\begin{pmatrix} 3 & 1 - i \\\\ 1 + i & -1 \\end{pmatrix} = a_0 I + \\vec a\\cdot\\vec\\sigma$. The larger eigenvalue of $M$, $a_0 + |\\vec a|$, is ______ (to two decimal places).',
      answer: 3.45, tol: 0.01, calc: () => 1 + Math.sqrt(6),
      sol: 'Use $a_\\mu = \\tfrac12\\text{tr}(M\\sigma_\\mu)$: $a_0 = \\tfrac12(3 - 1) = 1$, $a_z = \\tfrac12(3 + 1) = 2$, $a_x = \\text{Re}\\,M_{21} = 1$, $a_y = \\text{Im}\\,M_{21} = 1$. Since $(\\vec a\\cdot\\vec\\sigma)^2 = |\\vec a|^2 I$, the eigenvalues are $a_0 \\pm |\\vec a| = 1 \\pm \\sqrt6$. Larger: $1 + 2.449 = 3.45$. Check: trace $2$ and determinant $-3 - 2 = -5$ give $\\lambda^2 - 2\\lambda - 5 = 0$, the same roots.',
      trap: 'Reading $a_y$ from $M_{12} = 1 - i$ with the wrong sign does not change $|\\vec a|$ here, but it does change the eigenvectors.' },
    { id: 'lvs-027', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Dirac notation',
      q: 'For a complex number $c$, the bra corresponding to the ket $c|\\psi\\rangle$ is',
      options: ['$c\\langle\\psi|$', '$c^*\\langle\\psi|$', '$|c|\\langle\\psi|$', '$\\langle\\psi|/c$'], answer: 1,
      sol: 'The map from kets to bras is antilinear: $\\langle\\phi|(c\\psi)\\rangle$ must equal $c\\langle\\phi|\\psi\\rangle$, which forces the bra of $c|\\psi\\rangle$ to be $c^*\\langle\\psi|$ (so that $\\langle c\\psi|\\phi\\rangle = c^*\\langle\\psi|\\phi\\rangle$).',
      trap: 'Treating the bra as a plain transpose and forgetting the complex conjugate.' },
    { id: 'lvs-028', type: 'mcq', level: 3, exams: ['jam', 'gate', 'net'], sub: 'linear independence',
      q: 'Which set of functions on the real line is linearly dependent?',
      options: ['$\\{1, x, x^2\\}$', '$\\{e^{x}, e^{2x}\\}$', '$\\{\\sin x, \\cos x\\}$', '$\\{e^{x}, e^{-x}, \\cosh x\\}$'], answer: 3,
      sol: '$\\cosh x = \\tfrac12 e^{x} + \\tfrac12 e^{-x}$, a combination of the other two, so the set is dependent (its Wronskian is identically zero). The other sets have non-zero Wronskians, for example $W(\\sin, \\cos) = -1$.',
      trap: 'Functions that look different can still be combinations of each other; write hyperbolic functions in exponentials.' },

    // ---------- level 4 ----------
    { id: 'lvs-029', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'rank and nullity',
      q: 'The operator $d/dx$ acts on the vector space of real polynomials of degree at most 3. Its rank is ______.',
      answer: 3, tol: 0,
      sol: 'In the basis $\\{1, x, x^2, x^3\\}$, $d/dx$ sends $1 \\to 0$, $x \\to 1$, $x^2 \\to 2x$, $x^3 \\to 3x^2$. The image is all polynomials of degree at most 2: dimension 3. The kernel is the constants: dimension 1. Rank + nullity $= 3 + 1 = 4$, the dimension of the space.',
      trap: 'Answering 4 forgets that constants are sent to zero.' },
    { id: 'lvs-030', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'projectors',
      q: 'Let $|u\\rangle, |v\\rangle$ be orthonormal, $\\hat P_1 = |u\\rangle\\langle u|$ and $\\hat P_2 = |v\\rangle\\langle v|$. Which are true?',
      options: ['$\\hat P_1\\hat P_2 = 0$', '$\\hat P_1 + \\hat P_2$ is a projector', '$\\hat P_1 - \\hat P_2$ is a projector', '$(\\hat P_1 - \\hat P_2)^2 = \\hat P_1 + \\hat P_2$'], answer: [0, 1, 3],
      sol: '$\\hat P_1\\hat P_2 = |u\\rangle\\langle u|v\\rangle\\langle v| = 0$. Then $(\\hat P_1 + \\hat P_2)^2 = \\hat P_1 + \\hat P_2$ (cross terms vanish): a projector onto the plane. But $(\\hat P_1 - \\hat P_2)^2 = \\hat P_1 + \\hat P_2 \\ne \\hat P_1 - \\hat P_2$, so the difference is not a projector (it has eigenvalue $-1$).',
      trap: 'A projector must have eigenvalues 0 and 1 only; $\\hat P_1 - \\hat P_2$ has $-1$.' },
    { id: 'lvs-031', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'projectors',
      q: 'For a normalised $|\\psi\\rangle$ in $\\mathbb C^3$, the operator $\\hat R = \\hat 1 - 2|\\psi\\rangle\\langle\\psi|$ is',
      options: ['a projector', 'Hermitian but not unitary', 'Hermitian and unitary, with determinant $-1$', 'unitary with determinant $+1$'], answer: 2,
      sol: '$\\hat R^\\dagger = \\hat R$, and $\\hat R^2 = \\hat 1 - 4|\\psi\\rangle\\langle\\psi| + 4|\\psi\\rangle\\langle\\psi|\\psi\\rangle\\langle\\psi| = \\hat 1$, so $\\hat R^\\dagger\\hat R = \\hat 1$: Hermitian and unitary. Its eigenvalues are $-1$ on $|\\psi\\rangle$ and $+1$ on the 2-dimensional orthogonal complement, so $\\det\\hat R = -1$. It is a reflection.',
      trap: '$\\hat R^2 = \\hat 1$, not $\\hat R$: it is not a projector.' },
    { id: 'lvs-032', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'projection onto a subspace',
      q: 'Let $W$ be the plane in $\\mathbb R^3$ spanned by $(1, 1, 0)$ and $(0, 1, 1)$. The squared length of the orthogonal projection of $(1, 0, 0)$ onto $W$ is ______ (to three decimal places).',
      answer: 0.667, tol: 0.003, calc: () => 1 - 1 / 3,
      sol: 'The two spanning vectors are not orthogonal, so do not add separate projections. Use the normal instead: $\\vec n = (1, 1, 0)\\times(0, 1, 1) = (1, -1, 1)$. The part of $\\vec v = (1, 0, 0)$ along $\\vec n$ has squared length $(\\vec v\\cdot\\vec n)^2/|\\vec n|^2 = 1/3$. The projection onto $W$ has squared length $|\\vec v|^2 - \\tfrac13 = \\tfrac23 \\approx 0.667$.',
      trap: 'Adding the projections onto $(1,1,0)$ and $(0,1,1)$ separately gives $\\tfrac12 + 0 = 0.5$, which is wrong because the two vectors are not orthogonal.' },
    { id: 'lvs-033', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'tensor products',
      q: 'In $\\mathbb C^2\\otimes\\mathbb C^2$, the state $\\tfrac12\\left(|00\\rangle + |01\\rangle + |10\\rangle - |11\\rangle\\right)$ is',
      options: ['a product state $|a\\rangle\\otimes|b\\rangle$', 'entangled', 'not normalised', 'orthogonal to $|00\\rangle$'], answer: 1,
      sol: 'Write the state as $\\sum c_{ij}|ij\\rangle$ with $c = \\tfrac12\\begin{pmatrix} 1 & 1 \\\\ 1 & -1 \\end{pmatrix}$. A product state $|a\\rangle\\otimes|b\\rangle$ has $c_{ij} = a_ib_j$, a rank-1 matrix with determinant 0. Here $\\det c = \\tfrac14(-1 - 1) = -\\tfrac12 \\ne 0$, so it is entangled. It is normalised ($4\\times\\tfrac14 = 1$) and has overlap $\\tfrac12$ with $|00\\rangle$.',
      trap: 'Equal-looking amplitudes tempt you to factor it like $(|0\\rangle + |1\\rangle)(|0\\rangle + |1\\rangle)$, but the minus sign spoils the factorisation.' },
    { id: 'lvs-034', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'function spaces',
      q: 'On $[-\\pi, \\pi]$ with $\\langle f, g\\rangle = \\int f^*g\\,dx$, the functions $e_n(x) = e^{inx}/\\sqrt{2\\pi}$ are orthonormal. For $f(x) = x$, the value of $|\\langle e_1, f\\rangle|^2$ is ______ (to two decimal places).',
      answer: 6.28, tol: 0.01, calc: () => 2 * Math.PI,
      sol: '$\\langle e_1, f\\rangle = \\tfrac{1}{\\sqrt{2\\pi}}\\int_{-\\pi}^{\\pi} x e^{-ix}dx$. The $\\cos x$ part is odd and vanishes; $\\int_{-\\pi}^{\\pi} x(-i\\sin x)\\,dx = -i\\cdot2\\pi$ (since $\\int_{-\\pi}^{\\pi} x\\sin x\\,dx = 2\\pi$). So $\\langle e_1, f\\rangle = -i\\sqrt{2\\pi}$ and $|\\langle e_1, f\\rangle|^2 = 2\\pi \\approx 6.28$.',
      trap: 'The bra conjugates $e^{ix}$ into $e^{-ix}$; with the wrong sign you get $+i\\sqrt{2\\pi}$, the same modulus, but the habit matters for complex $f$.' },
    { id: 'lvs-035', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'unitary operators',
      q: 'For a linear operator $\\hat U$ on a finite-dimensional inner-product space, which condition is NOT equivalent to $\\hat U$ being unitary?',
      options: ['$\\hat U^\\dagger\\hat U = \\hat 1$', '$\\lVert\\hat U v\\rVert = \\lVert v\\rVert$ for every $v$', '$\\hat U$ maps an orthonormal basis to an orthonormal basis', '$|\\det\\hat U| = 1$'], answer: 3,
      sol: 'The first three are standard equivalent definitions (preserving norms implies preserving inner products by polarisation). But $|\\det\\hat U| = 1$ is much weaker: $\\text{diag}(2, \\tfrac12)$ has determinant 1 and stretches vectors.',
      trap: 'Every unitary has $|\\det| = 1$, but the converse is false.' },
    { id: 'lvs-036', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'Hermitian operators',
      q: 'If $\\hat A$ and $\\hat B$ are Hermitian, which of these are always Hermitian?',
      options: ['$\\hat A\\hat B + \\hat B\\hat A$', '$i[\\hat A, \\hat B]$', '$[\\hat A, \\hat B]$', '$\\hat A\\hat B\\hat A$'], answer: [0, 1, 3],
      sol: 'Use $(\\hat X\\hat Y)^\\dagger = \\hat Y^\\dagger\\hat X^\\dagger$. $(\\hat A\\hat B + \\hat B\\hat A)^\\dagger = \\hat B\\hat A + \\hat A\\hat B$. $[\\hat A, \\hat B]^\\dagger = \\hat B\\hat A - \\hat A\\hat B = -[\\hat A, \\hat B]$: anti-Hermitian, so $i[\\hat A, \\hat B]$ is Hermitian. $(\\hat A\\hat B\\hat A)^\\dagger = \\hat A\\hat B\\hat A$.',
      trap: 'The commutator itself is anti-Hermitian; that is why $[\\hat x, \\hat p] = i\\hbar$ carries an $i$.' },

    // ---------- level 5 ----------
    { id: 'lvs-037', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'commuting operators',
      q: 'The real $3\\times3$ matrices that commute with $D = \\text{diag}(1, 1, 2)$ form a vector space. Its dimension is ______.',
      answer: 5, tol: 0,
      sol: '$(DX - XD)_{ij} = (d_i - d_j)X_{ij}$, which vanishes only when $X_{ij} = 0$ for every pair with $d_i \\ne d_j$. The entries linking the eigenvalue-1 block (indices 1, 2) with the eigenvalue-2 block (index 3) must vanish, leaving a free $2\\times2$ block and a free $1\\times1$ block: $4 + 1 = 5$. In general the dimension is $\\sum_k n_k^2$ over the multiplicities $n_k$.',
      trap: 'Answering 3 (only diagonal matrices) ignores the degeneracy: inside a degenerate eigenspace anything commutes.' },
    { id: 'lvs-038', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'Dirac notation',
      q: 'Normalised kets $|u\\rangle$ and $|v\\rangle$ have real overlap $\\langle u|v\\rangle = c$ with $0 < c < 1$. The non-zero eigenvalues of $\\hat A = |u\\rangle\\langle u| + |v\\rangle\\langle v|$ are',
      options: ['$1 \\pm c$', '$1 \\pm c^2$', '$2$ and $0$', '$(1 \\pm c)/2$'], answer: 0,
      sol: '$\\hat A$ acts inside the plane of $|u\\rangle$ and $|v\\rangle$ and kills everything orthogonal to it. $\\hat A(|u\\rangle \\pm |v\\rangle) = |u\\rangle + c|v\\rangle \\pm (c|u\\rangle + |v\\rangle) = (1 \\pm c)(|u\\rangle \\pm |v\\rangle)$. Check: the trace is $\\langle u|u\\rangle + \\langle v|v\\rangle = 2 = (1 + c) + (1 - c)$.',
      trap: 'Treating $|u\\rangle$ and $|v\\rangle$ as orthogonal gives eigenvalues 1 and 1; the overlap splits them.' },
    { id: 'lvs-039', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'dimension',
      q: 'The traceless Hermitian $3\\times3$ matrices form a real vector space (a basis is the Gell-Mann matrices). Its dimension is ______.',
      answer: 8, tol: 0,
      sol: 'A Hermitian $n\\times n$ matrix has $n$ real diagonal entries and $n(n-1)/2$ complex entries above the diagonal: $n + n(n-1) = n^2$ real parameters. For $n = 3$ that is 9; the trace condition removes one, leaving 8. (These generate SU(3).)',
      trap: 'Counting 9 complex entries (18 real parameters) ignores the Hermitian condition.' },
    { id: 'lvs-040', type: 'msq', level: 5, exams: ['gate', 'net'], sub: 'Hilbert space',
      q: 'Which statements about the Hilbert space $L^2(\\mathbb R)$ of square-integrable functions are true?',
      options: ['The position operator $\\hat x$ has no eigenvectors inside $L^2(\\mathbb R)$', 'Every Cauchy sequence in $L^2(\\mathbb R)$ converges to an element of $L^2(\\mathbb R)$', 'The plane wave $e^{ikx}$ belongs to $L^2(\\mathbb R)$', 'The Gaussian $e^{-x^2}$ belongs to $L^2(\\mathbb R)$'], answer: [0, 1, 3],
      sol: 'The eigenfunctions of $\\hat x$ are $\\delta(x - x_0)$, which are not square integrable, so $\\hat x$ has no normalisable eigenvectors (a continuous spectrum). Completeness (every Cauchy sequence converges) is what makes $L^2$ a Hilbert space. $|e^{ikx}|^2 = 1$ has infinite integral, so plane waves are not in $L^2$; they are used as generalised (delta-normalised) states. $\\int e^{-2x^2}dx = \\sqrt{\\pi/2}$ is finite.',
      trap: 'Plane waves and delta functions are useful but live outside the Hilbert space proper.' },
    ...more2,
    ...r4.items,
  ],
  gens: [
    { id: 'lvs-g01', type: 'nat', level: 1, exams: ['gate', 'net'], sub: 'inner product',
      make(r) {
        const a = int(r, -3, 3), b = int(r, 1, 3), c = int(r, -3, 3), d = int(r, -3, 3), e = int(r, 1, 3), f = int(r, -3, 3);
        // u = (a + b i, c), v = (d, e + f i); <u|v> = (a - b i) d + c (e + f i)
        const re = a * d + c * e, im = -b * d + c * f;
        const answer = re * re + im * im;
        const cx = (x, y) => `${x}${y < 0 ? ' - ' : ' + '}${Math.abs(y) === 1 ? '' : Math.abs(y)}i`;
        return { q: `In $\\mathbb C^2$ with $\\langle u|v\\rangle = \\sum_k u_k^*v_k$, let $|u\\rangle = (${cx(a, b)},\\ ${c})^T$ and $|v\\rangle = (${d},\\ ${cx(e, f)})^T$. The value of $|\\langle u|v\\rangle|^2$ is ______.`,
          answer, tol: 0, a, b, c, d, e, f,
          sol: `Conjugate the first vector: $\\langle u| = (${cx(a, -b)},\\ ${c})$. Then $\\langle u|v\\rangle = (${cx(a, -b)})(${d}) + ${c}(${cx(e, f)}) = ${re}${im < 0 ? ' - ' : ' + '}${Math.abs(im)}i$, so $|\\langle u|v\\rangle|^2 = ${re}^2 + ${im}^2 = ${answer}$.`,
          trap: 'Forgetting to conjugate the bra changes the imaginary part.' };
      },
      verify: (p) => (p.a * p.d + p.c * p.e) ** 2 + (-p.b * p.d + p.c * p.f) ** 2 },
    { id: 'lvs-g02', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'normalisation',
      make(r) {
        const a = int(r, 1, 4), b = int(r, 1, 4), c = int(r, 1, 4);
        const N2 = a * a + b * b + c * c, answer = round((b * b) / N2, 3);
        return { q: `A state is $|\\psi\\rangle \\propto ${a}|1\\rangle + ${b}i|2\\rangle - ${c}|3\\rangle$ in an orthonormal basis. After normalising, the probability $|\\langle2|\\psi\\rangle|^2$ is ______ (to three decimal places).`,
          answer, tol: 0.003, a, b, c,
          sol: `$\\langle\\psi|\\psi\\rangle = ${a}^2 + ${b}^2 + ${c}^2 = ${N2}$ before normalising. So $|\\langle2|\\psi\\rangle|^2 = ${b * b}/${N2} \\approx ${answer}$.`,
          trap: 'The factor $i$ and the minus sign do not change $|c_n|^2$; the normalisation does.' };
      },
      verify: (p) => (p.b * p.b) / (p.a * p.a + p.b * p.b + p.c * p.c) },
    { id: 'lvs-g03', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'expectation values',
      make(r) {
        const l = [int(r, -2, 1), int(r, 2, 3), int(r, 4, 6)], c = [int(r, 1, 3), int(r, 1, 3), int(r, 1, 3)];
        const N2 = c[0] ** 2 + c[1] ** 2 + c[2] ** 2, num = l[0] * c[0] ** 2 + l[1] * c[1] ** 2 + l[2] * c[2] ** 2;
        const answer = round(num / N2, 2);
        return { q: `$\\hat A = ${l[0]}|1\\rangle\\langle1| + ${l[1]}|2\\rangle\\langle2| + ${l[2]}|3\\rangle\\langle3|$ in an orthonormal basis, and $|\\psi\\rangle \\propto ${c[0]}|1\\rangle + ${c[1]}i|2\\rangle + ${c[2]}|3\\rangle$ (not yet normalised). Find $\\langle\\hat A\\rangle = \\langle\\psi|\\hat A|\\psi\\rangle/\\langle\\psi|\\psi\\rangle$ (to two decimal places).`,
          answer, tol: 0.01, l, c,
          sol: `$\\langle\\psi|\\psi\\rangle = ${c[0] ** 2} + ${c[1] ** 2} + ${c[2] ** 2} = ${N2}$ and $\\langle\\psi|\\hat A|\\psi\\rangle = ${l[0]}(${c[0] ** 2}) + ${l[1]}(${c[1] ** 2}) + ${l[2]}(${c[2] ** 2}) = ${num}$. So $\\langle\\hat A\\rangle = ${num}/${N2} \\approx ${answer}$.`,
          trap: 'Forgetting to divide by $\\langle\\psi|\\psi\\rangle$ when the state is not normalised.' };
      },
      verify: (p) => (p.l[0] * p.c[0] ** 2 + p.l[1] * p.c[1] ** 2 + p.l[2] * p.c[2] ** 2) / (p.c[0] ** 2 + p.c[1] ** 2 + p.c[2] ** 2) },
    { id: 'lvs-g04', type: 'mcq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'change of basis',
      make(r) {
        const x = int(r, 2, 7), y = int(r, -3, 1);
        // component along e2 = (1,-1)/sqrt2 is (x - y)/sqrt2 = (x - y) sqrt2 / 2
        const k = x - y, kk = x + y;
        const show = (v) => (v === 0 ? '$0$' : `$${v === 1 ? '' : v === -1 ? '-' : v}\\sqrt2/2$`);
        const o = mcqOptions(r, k, [kk, -k, 2 * k], show);
        return { q: `In the orthonormal basis $|e_1\\rangle = (1, 1)/\\sqrt2$, $|e_2\\rangle = (1, -1)/\\sqrt2$, the component of $|v\\rangle = (${x}, ${y})$ along $|e_2\\rangle$ is`, ...o,
          sol: `$\\langle e_2|v\\rangle = (${x} - (${y}))/\\sqrt2 = ${k}/\\sqrt2 = ${k}\\sqrt2/2$.`,
          trap: 'Using $|e_1\\rangle$ by mistake gives $(x + y)/\\sqrt2$.' };
      } },
    { id: 'lvs-g05', type: 'nat', level: 3, exams: ['jam', 'gate', 'net'], sub: 'Gram-Schmidt',
      make(r) {
        const a = int(r, 1, 3), b = int(r, 1, 3), c = int(r, 1, 3), d = int(r, 1, 3);
        // v1 = (a, b, 0), v2 = (c, 0, d): |u2|^2 = |v2|^2 - (v2.v1)^2/|v1|^2
        const answer = round(c * c + d * d - (a * c) ** 2 / (a * a + b * b), 3);
        return { q: `Gram-Schmidt is applied to $\\vec v_1 = (${a}, ${b}, 0)$ and then $\\vec v_2 = (${c}, 0, ${d})$. The second orthogonal vector $\\vec u_2 = \\vec v_2 - \\dfrac{\\vec v_2\\cdot\\vec v_1}{|\\vec v_1|^2}\\vec v_1$ has $|\\vec u_2|^2 =$ ______ (to three decimal places).`,
          answer, tol: 0.003, a, b, c, d,
          sol: `$\\vec v_2\\cdot\\vec v_1 = ${a * c}$, $|\\vec v_1|^2 = ${a * a + b * b}$, $|\\vec v_2|^2 = ${c * c + d * d}$. By Pythagoras, $|\\vec u_2|^2 = |\\vec v_2|^2 - (\\vec v_2\\cdot\\vec v_1)^2/|\\vec v_1|^2 = ${c * c + d * d} - ${(a * c) ** 2}/${a * a + b * b} \\approx ${answer}$.`,
          trap: 'Dividing by $|\\vec v_1|$ instead of $|\\vec v_1|^2$.' };
      },
      verify: (p) => p.c * p.c + p.d * p.d - (p.a * p.c) ** 2 / (p.a * p.a + p.b * p.b) },
    { id: 'lvs-g06', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Pauli expansion',
      make(r) {
        const p = int(r, -2, 4), s = int(r, -3, 2), qq = int(r, 1, 3), rr = int(r, 1, 3);
        const a0 = (p + s) / 2, az = (p - s) / 2, A = Math.sqrt(az * az + qq * qq + rr * rr);
        const answer = round(a0 + A, 2);
        return { q: `Write $M = \\begin{pmatrix} ${p} & ${qq} - ${rr === 1 ? '' : rr}i \\\\ ${qq} + ${rr === 1 ? '' : rr}i & ${s} \\end{pmatrix}$ as $a_0I + \\vec a\\cdot\\vec\\sigma$. Find the larger eigenvalue $a_0 + |\\vec a|$ (to two decimal places).`,
          answer, tol: 0.01, p, s, qq, rr,
          sol: `$a_0 = \\tfrac12(${p} + ${s}) = ${a0}$, $a_z = \\tfrac12(${p} - (${s})) = ${az}$, $a_x = ${qq}$, $a_y = ${rr}$. Since $(\\vec a\\cdot\\vec\\sigma)^2 = |\\vec a|^2I$, the eigenvalues are $a_0 \\pm |\\vec a|$ with $|\\vec a| = \\sqrt{${az * az} + ${qq * qq} + ${rr * rr}} \\approx ${round(A, 3)}$. Larger: $\\approx ${answer}$.`,
          trap: 'Taking $a_0$ as the top-left entry instead of half the trace.' };
      },
      verify: (p) => { const t = p.p + p.s, D = p.p * p.s - (p.qq * p.qq + p.rr * p.rr); return (t + Math.sqrt(t * t - 4 * D)) / 2; } },
    { id: 'lvs-g07', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'commuting operators',
      make(r) {
        const mult = choose(r, [[1, 1, 2], [2, 2], [1, 3], [2, 1, 1], [3, 1], [1, 1, 1, 1], [2, 2, 1], [4], [3, 2], [1, 2, 2]]);
        let k = 1; const diag = [];
        mult.forEach((m) => { for (let i = 0; i < m; i++) diag.push(k); k++; });
        const answer = mult.reduce((s, m) => s + m * m, 0);
        return { q: `The real ${diag.length}×${diag.length} matrices that commute with $D = \\text{diag}(${diag.join(', ')})$ form a vector space. Its dimension is ______.`,
          answer, tol: 0, mult, diag,
          sol: `$(DX - XD)_{ij} = (d_i - d_j)X_{ij}$, so $X_{ij}$ must vanish whenever $d_i \\ne d_j$. What survives is one free block per distinct eigenvalue, of size equal to its multiplicity (${mult.join(', ')}). Dimension $= ${mult.map((m) => m + '^2').join(' + ')} = ${answer}$.`,
          trap: 'Counting only diagonal matrices misses the free blocks inside degenerate eigenspaces.' };
      },
      verify: (p) => { let n = 0; for (let i = 0; i < p.diag.length; i++) for (let j = 0; j < p.diag.length; j++) if (p.diag[i] === p.diag[j]) n++; return n; } },
    { id: 'lvs-g08', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'Dirac notation',
      make(r) {
        const [num, den] = choose(r, [[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5]]);
        const c = `${num}/${den}`;
        const pl = `${den + num}/${den}`, mi = `${den - num}/${den}`;
        const show = (s) => s;
        const correct = `$${pl}$ and $${mi}$`;
        const o = mcqOptions(r, correct, [`$${(den * den + num * num)}/${den * den}$ and $${(den * den - num * num)}/${den * den}$`, '$2$ and $0$', `$${den + num}/${2 * den}$ and $${den - num}/${2 * den}$`], show);
        return { q: `Normalised kets $|u\\rangle$ and $|v\\rangle$ have real overlap $\\langle u|v\\rangle = ${c}$. The two non-zero eigenvalues of $|u\\rangle\\langle u| + |v\\rangle\\langle v|$ are`, ...o,
          sol: `On $|u\\rangle \\pm |v\\rangle$ the operator gives $(1 \\pm c)(|u\\rangle \\pm |v\\rangle)$ with $c = ${c}$, so the eigenvalues are $1 + ${c} = ${pl}$ and $1 - ${c} = ${mi}$. They add to 2, the trace.`,
          trap: 'Squaring the overlap (as for a probability) gives the wrong splitting.' };
      } },
    ...more,
    ...r4.gens,
  ],
};
