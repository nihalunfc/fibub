// Tensors: index notation and the summation convention, the Kronecker delta and Levi-Civita symbol (and their
// contraction identities), transformation laws and rotation of tensors, invariants, symmetric and antisymmetric parts,
// counting independent components, isotropic tensors, the quotient law, physical tensors (inertia, stress, elasticity,
// the field tensor), the metric, raising and lowering indices, curvilinear coordinates and Christoffel symbols.
// Original questions for GATE and CSIR NET practice (fibub). Levels: 1 warm-up ... 5 top rank.
import { int, choose, mcqOptions, round } from '../_util.js';
import more from './tensors.more.gen.js';
import more2 from './tensors.more2.gen.js';
import r4 from './tensors.r4.gen.js';

const binom = (n, k) => { if (k < 0 || k > n) return 0; let b = 1; for (let i = 1; i <= k; i++) b = (b * (n - k + i)) / i; return Math.round(b); };
const vec = (v) => `(${v.join(', ')})`;
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const rv = (r) => [int(r, -3, 3), int(r, -3, 3), int(r, -3, 3)];
// Levi-Civita by permutation parity
const eps = (i, j, k) => ((i - j) * (j - k) * (k - i)) / 2;

import { tidyPhys } from './_signs.js';

const topicBank = {
  topic: 'tensors',
  items: [
    // ---------- level 1 ----------
    { id: 'tns-001', type: 'mcq', level: 1, exams: ['gate', 'net', 'jam'], sub: 'Kronecker delta',
      q: 'In three dimensions, with the summation convention, $\\delta_{ii}$ equals',
      options: ['$1$', '$0$', '$3$', '$9$'], answer: 2,
      sol: 'A repeated index is summed: $\\delta_{ii} = \\delta_{11} + \\delta_{22} + \\delta_{33} = 3$. In $n$ dimensions it is $n$ (the trace of the identity).',
      trap: 'Reading $\\delta_{ii}$ as a single component equal to 1.' },
    { id: 'tns-002', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'counting components',
      q: 'A general tensor of rank 3 in four dimensions has how many components?',
      options: ['12', '64', '81', '24'], answer: 1,
      sol: 'Each of the 3 indices runs over 4 values: $4^3 = 64$. In general $n^r$ for rank $r$ in $n$ dimensions.',
      trap: '$3^4 = 81$ swaps the rank and the dimension.' },
    { id: 'tns-003', type: 'mcq', level: 1, exams: ['gate', 'net', 'jam'], sub: 'Levi-Civita symbol',
      q: 'Given $\\varepsilon_{123} = 1$, the value of $\\varepsilon_{213}$ is',
      options: ['$1$', '$-1$', '$0$', '$2$'], answer: 1,
      sol: '213 comes from 123 by one swap (of the first two indices), an odd permutation, so $\\varepsilon_{213} = -1$. It is 0 whenever two indices are equal.',
      trap: 'Thinking any rearrangement gives +1: only even (cyclic) ones do.' },
    { id: 'tns-004', type: 'msq', level: 1, exams: ['gate', 'net'], sub: 'contraction',
      q: 'With the summation convention, which of these are scalars (rank 0)?',
      options: ['$A_iB_i$', '$T_{ii}$', '$A_iB_j$', '$\\varepsilon_{ijk}A_iB_jC_k$'], answer: [0, 1, 3],
      sol: 'Count the free (unrepeated) indices. $A_iB_i$ (dot product), $T_{ii}$ (trace) and $\\varepsilon_{ijk}A_iB_jC_k$ (triple product) have none. $A_iB_j$ has two free indices: it is the rank-2 outer product.',
      trap: 'The rank is the number of free indices, not the number of letters.' },
    { id: 'tns-005', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'contraction',
      q: 'Contracting one pair of indices of a rank-4 tensor gives a tensor of rank',
      options: ['3', '1', '0', '2'], answer: 3,
      sol: 'Contraction sets two indices equal and sums, removing both: $4 - 2 = 2$. For example $R_{ijkl}\\delta_{ik} = R_{jl}$-type objects.',
      trap: 'One contraction removes two indices, not one.' },
    { id: 'tns-006', type: 'nat', level: 1, exams: ['gate', 'net'], sub: 'counting components',
      q: 'A symmetric rank-2 tensor in three dimensions has ______ independent components.',
      answer: 6, tol: 0, calc: () => (3 * 4) / 2,
      sol: '$T_{ij} = T_{ji}$: the 3 diagonal components and the 3 above the diagonal are free, $\\frac{n(n + 1)}{2} = 6$. The inertia and stress tensors are examples.',
      trap: 'Counting all 9.' },

    // ---------- level 2 ----------
    { id: 'tns-007', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Levi-Civita symbol',
      q: 'In three dimensions, $\\varepsilon_{ijk}\\varepsilon_{ijk}$ (summed over all three indices) equals ______.',
      answer: 6, tol: 0, calc: () => 3 * 2,
      sol: 'Each non-zero $\\varepsilon_{ijk}$ is $\\pm1$ and squares to 1; there are $3! = 6$ permutations. Or from $\\varepsilon_{ijk}\\varepsilon_{ijm} = 2\\delta_{km}$: $2\\delta_{kk} = 6$.',
      trap: 'Answering 27 (all index combinations) or 1.' },
    { id: 'tns-008', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'epsilon-delta identity',
      q: 'The contraction $\\varepsilon_{ijk}\\varepsilon_{imn}$ equals',
      options: ['$\\delta_{jm}\\delta_{kn} + \\delta_{jn}\\delta_{km}$', '$\\delta_{jn}\\delta_{km} - \\delta_{jm}\\delta_{kn}$', '$\\delta_{jm}\\delta_{kn} - \\delta_{jn}\\delta_{km}$', '$2\\delta_{jm}\\delta_{kn}$'], answer: 2,
      sol: 'Check a case: $j = m = 2$, $k = n = 3$: the left side is $\\varepsilon_{123}^2 = 1$, and $\\delta_{22}\\delta_{33} - \\delta_{23}\\delta_{32} = 1$ ✓. With $j = n = 2$, $k = m = 3$: $\\varepsilon_{123}\\varepsilon_{132} = -1$, and the formula gives $0 - 1 = -1$ ✓. This identity proves $\\mathbf A\\times(\\mathbf B\\times\\mathbf C) = \\mathbf B(\\mathbf A\\cdot\\mathbf C) - \\mathbf C(\\mathbf A\\cdot\\mathbf B)$.',
      trap: 'The sign: matching positions (j with m, k with n) come with $+$.' },
    { id: 'tns-009', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'counting components',
      q: 'An antisymmetric rank-2 tensor in four dimensions (such as the electromagnetic field tensor) has how many independent components?',
      options: ['4', '6', '10', '16'], answer: 1,
      sol: 'The diagonal vanishes and the lower triangle is minus the upper, leaving $\\frac{n(n - 1)}{2} = 6$: exactly the three components of $\\mathbf E$ and three of $\\mathbf B$.',
      trap: '10 is the count for a symmetric rank-2 tensor in 4D.' },
    { id: 'tns-010', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'transformation law',
      q: 'Under a rotation $x\'_i = R_{ij}x_j$, the components of a Cartesian rank-2 tensor transform as',
      options: ['$T\'_{ij} = R_{ik}T_{kj}$', '$T\'_{ij} = R_{ki}R_{lj}T_{kl}$ only for antisymmetric $T$', '$T\'_{ij} = R_{ik}R_{jl}T_{kl}$', '$T\'_{ij} = T_{ij}$, since tensors do not depend on axes'], answer: 2,
      sol: 'Each index transforms like a vector component: one factor of $R$ per index. In matrix form $T\' = RTR^{\\mathsf T}$. The tensor (the physical object) does not change; its components do.',
      trap: 'A rank-2 tensor needs two factors of $R$.' },
    { id: 'tns-011', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'Kronecker delta',
      q: 'In three dimensions, $\\delta_{ij}\\delta_{jk}\\delta_{ki}$ equals',
      options: ['$1$', '$3$', '$9$', '$27$'], answer: 1,
      sol: '$\\delta_{ij}\\delta_{jk} = \\delta_{ik}$ (the delta replaces $j$ by $i$). Then $\\delta_{ik}\\delta_{ki} = \\delta_{ii} = 3$.',
      trap: 'Multiplying three traces: $3^3$.' },
    { id: 'tns-012', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'isotropic tensors',
      q: 'A tensor is isotropic if its components are the same in every rotated Cartesian frame. Which are isotropic in three dimensions?',
      options: ['$\\delta_{ij}$', '$\\varepsilon_{ijk}$ (under proper rotations)', '$\\delta_{ij}\\delta_{kl}$', 'any constant vector $a_i \\ne 0$'], answer: [0, 1, 2],
      sol: '$R_{ik}R_{jl}\\delta_{kl} = (RR^{\\mathsf T})_{ij} = \\delta_{ij}$. $R_{il}R_{jm}R_{kn}\\varepsilon_{lmn} = (\\det R)\\varepsilon_{ijk} = \\varepsilon_{ijk}$ for proper rotations. Products of isotropic tensors are isotropic. A non-zero vector points somewhere, so rotating changes its components: there is no isotropic rank-1 tensor.',
      trap: 'A constant vector is constant in space, not invariant under rotation.' },
    { id: 'tns-013', type: 'mcq', level: 2, exams: ['gate', 'net', 'jam'], sub: 'index notation',
      q: 'In index notation, the $i$th component of $\\mathbf A\\times\\mathbf B$ is',
      options: ['$\\varepsilon_{ijk}A_jB_k$', '$\\delta_{ij}A_jB_i$', '$\\varepsilon_{ijk}A_iB_j$', '$A_jB_k - A_kB_j$ summed over $j$ and $k$'], answer: 0,
      sol: 'Check $i = 1$: $\\varepsilon_{123}A_2B_3 + \\varepsilon_{132}A_3B_2 = A_2B_3 - A_3B_2$ ✓. The third option has free index $k$, not $i$. The last, summed over both, gives 0.',
      trap: 'The free index must be the one in the result.' },
    { id: 'tns-014', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'metric',
      q: 'For the Minkowski metric $\\eta_{\\mu\\nu} = \\text{diag}(1, -1, -1, -1)$, the contraction $\\eta_{\\mu\\nu}\\eta^{\\mu\\nu}$ equals',
      options: ['$-2$', '$0$', '$2$', '$4$'], answer: 3,
      sol: '$\\eta_{\\mu\\nu}\\eta^{\\nu\\lambda} = \\delta_\\mu^\\lambda$, so $\\eta_{\\mu\\nu}\\eta^{\\mu\\nu} = \\delta_\\mu^\\mu = 4$, the dimension. Component by component: $1 + 1 + 1 + 1$, since each diagonal entry squares to 1.',
      trap: 'Adding the diagonal entries $1 - 1 - 1 - 1 = -2$: that sum is not a contraction, and it is not invariant.' },
    { id: 'tns-015', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'metric',
      q: 'In plane polar coordinates $(r, \\theta)$, the metric tensor $g_{ij}$ is',
      options: ['$\\text{diag}(1, r)$', '$\\text{diag}(1, r^2)$', '$\\text{diag}(r, r)$', '$\\text{diag}(1, 1)$'], answer: 1,
      sol: 'The line element is $ds^2 = dr^2 + r^2d\\theta^2$, read off as $g_{rr} = 1$, $g_{\\theta\\theta} = r^2$. The scale factor $h_\\theta = r$ is the square root of $g_{\\theta\\theta}$.',
      trap: 'Confusing the scale factor $r$ with the metric component $r^2$.' },
    { id: 'tns-016', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'invariants',
      q: 'For a rank-2 tensor in three dimensions, which quantity is unchanged by every rotation of the axes?',
      options: ['$T_{11}$', '$T_{12}$', '$T_{11} + T_{22}$', '$\\det T$'], answer: 3,
      sol: '$T\' = RTR^{\\mathsf T}$ is a similarity transformation, so the eigenvalues, the trace $T_{ii}$ and the determinant are invariant. Single components and partial sums like $T_{11} + T_{22}$ change.',
      trap: 'Only the full trace is invariant, not part of it.' },

    // ---------- level 3 ----------
    { id: 'tns-017', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'rotation of tensors',
      q: 'A 2D tensor is $T = \\text{diag}(3, 1)$ in some axes. In axes rotated by $30°$, the component $T\'_{11}$ is ______ (to two decimal places).',
      answer: 2.5, tol: 0.01, calc: () => 3 * Math.cos(Math.PI / 6) ** 2 + 1 * Math.sin(Math.PI / 6) ** 2,
      sol: '$T\'_{11} = R_{1k}R_{1l}T_{kl} = \\cos^2\\theta\\,T_{11} + \\sin^2\\theta\\,T_{22}$ (the off-diagonal terms are 0). $= 3\\times\\frac34 + 1\\times\\frac14 = 2.5$. The trace stays $4 = 2.5 + T\'_{22}$, so $T\'_{22} = 1.5$.',
      trap: 'Rotating with one factor of $\\cos\\theta$ instead of $\\cos^2\\theta$.' },
    { id: 'tns-018', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'principal axes',
      q: 'The 2D symmetric tensor $T = \\begin{pmatrix}3 & 1\\\\ 1 & 1\\end{pmatrix}$ becomes diagonal when the axes are rotated by an angle $\\theta$ between $-45°$ and $45°$. Find $\\theta$ in degrees: ______',
      answer: 22.5, tol: 0.1, calc: () => (Math.atan(2 * 1 / (3 - 1)) * 90) / Math.PI,
      sol: 'Setting $T\'_{12} = 0$ gives $\\tan2\\theta = \\frac{2T_{12}}{T_{11} - T_{22}} = \\frac{2}{2} = 1$, so $2\\theta = 45°$ and $\\theta = 22.5°$. The principal values are $2 \\pm \\sqrt2$.',
      trap: 'Forgetting the factor 2 in $\\tan2\\theta$.' },
    { id: 'tns-019', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Levi-Civita symbol',
      q: 'The contraction $\\varepsilon_{ijk}\\delta_{ij}$ equals',
      options: ['$\\delta_{kk}$', '$1$', '$\\varepsilon_{kkk}$, which is 1', '$0$'], answer: 3,
      sol: 'Contracting an antisymmetric pair with a symmetric one always gives zero: $\\varepsilon_{ijk}\\delta_{ij} = \\varepsilon_{iik} = 0$. In general $A_{ij}S_{ij} = 0$ for $A$ antisymmetric and $S$ symmetric.',
      trap: 'Any $\\varepsilon$ with two equal indices is 0.' },
    { id: 'tns-020', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'symmetric and antisymmetric parts',
      q: 'Write $T_{ij} = S_{ij} + A_{ij}$ with $S$ symmetric and $A$ antisymmetric (3D). Which statements are true?',
      options: ['$S_{ij} = \\tfrac12(T_{ij} + T_{ji})$', '$A_{ij}$ has 3 independent components and is equivalent to the axial vector $v_k = \\tfrac12\\varepsilon_{kij}A_{ij}$', '$S_{ij}A_{ij} = 0$', 'Part of the trace of $T$ sits in $A$'], answer: [0, 1, 2],
      sol: '$S = \\frac12(T + T^{\\mathsf T})$, $A = \\frac12(T - T^{\\mathsf T})$. In 3D an antisymmetric matrix has 3 entries above the diagonal and acts like a cross product with a vector ($A_{ij}w_j = \\varepsilon_{ijk}w_jv_k$ up to sign convention): the rotation part of a velocity gradient, or $\\mathbf B$ inside the field tensor. $S_{ij}A_{ij} = S_{ji}A_{ji} = -S_{ij}A_{ij}$, so it is 0. $A$ has zero diagonal, so the whole trace is in $S$.',
      trap: 'The antisymmetric part is traceless.' },
    { id: 'tns-021', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'index notation',
      q: 'With $r^2 = x_jx_j$, compute $\\partial_i(x_ir^2)$ at a point where $r = 2$: ______',
      answer: 20, tol: 0, calc: () => 5 * 4,
      sol: 'Product rule: $\\partial_i(x_ir^2) = (\\partial_ix_i)r^2 + x_i\\partial_i(x_jx_j) = 3r^2 + x_i(2x_i) = 5r^2$. At $r = 2$: 20. (This is $\\nabla\\cdot(r^2\\mathbf r)$.)',
      trap: '$\\partial_ix_i = \\delta_{ii} = 3$, not 1.' },
    { id: 'tns-022', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'quotient law',
      q: 'For every vector $B_j$, the quantity $C_i = T_{ij}B_j$ is a vector. Then $T_{ij}$ is',
      options: ['a rank-2 tensor', 'a scalar', 'a vector', 'not necessarily a tensor'], answer: 0,
      sol: 'The quotient law: $C\'_i = R_{ik}C_k = R_{ik}T_{kl}B_l = R_{ik}T_{kl}R_{jl}B\'_j$. Since also $C\'_i = T\'_{ij}B\'_j$ for arbitrary $B\'$, $T\'_{ij} = R_{ik}R_{jl}T_{kl}$: the rank-2 law. Example: $L_i = I_{ij}\\omega_j$ shows that inertia is a tensor.',
      trap: 'It must hold for arbitrary $B$; for one special $B$ it proves nothing.' },
    { id: 'tns-023', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'metric',
      q: 'On a unit sphere, $ds^2 = d\\theta^2 + \\sin^2\\theta\\,d\\phi^2$. The length of the circle $\\theta = 60°$ (going once round in $\\phi$) is ______ (to three decimal places).',
      answer: 5.441, tol: 0.003, calc: () => 2 * Math.PI * Math.sin(Math.PI / 3),
      sol: 'Along the circle $d\\theta = 0$, so $ds = \\sin\\theta\\,d\\phi$ and the length is $2\\pi\\sin60° = 2\\pi\\times0.866 = 5.441$. Not $2\\pi\\times60°$ in radians: the metric decides lengths.',
      trap: 'Using $\\cos\\theta$: $\\theta$ is measured from the pole, so the radius of the circle is $\\sin\\theta$.' },
    { id: 'tns-024', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Christoffel symbols',
      q: 'For plane polar coordinates ($g_{rr} = 1$, $g_{\\theta\\theta} = r^2$), the Christoffel symbol $\\Gamma^r_{\\theta\\theta}$ is',
      options: ['$-r$', '$r$', '$1/r$', '$0$'], answer: 0,
      sol: '$\\Gamma^r_{\\theta\\theta} = \\frac12g^{rr}(2\\partial_\\theta g_{r\\theta} - \\partial_rg_{\\theta\\theta}) = -\\frac12\\partial_r(r^2) = -r$. In the geodesic equation it gives $\\ddot r - r\\dot\\theta^2 = 0$: the centripetal term of polar kinematics. The other non-zero one is $\\Gamma^\\theta_{r\\theta} = 1/r$.',
      trap: '$1/r$ is $\\Gamma^\\theta_{r\\theta}$.' },
    { id: 'tns-025', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'inertia tensor',
      q: 'A point mass of 2 kg sits at $(1, 1, 0)$ m. Using $I_{ij} = \\sum m(r^2\\delta_{ij} - x_ix_j)$, the product of inertia $I_{xy}$ is ______ kg m².',
      answer: -2, tol: 0, calc: () => -2 * 1 * 1, unit: 'kg m²',
      sol: 'Off the diagonal $\\delta_{xy} = 0$, so $I_{xy} = -mxy = -2\\times1\\times1 = -2$ kg m². A non-zero product of inertia means the axes are not principal: spinning about $z$ alone needs a torque.',
      trap: 'Dropping the minus sign in the definition.' },
    { id: 'tns-026', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'pseudotensors',
      q: 'Under a general orthogonal transformation $R$ (rotations and reflections), $\\varepsilon_{ijk}$ behaves as',
      options: ['a true rank-3 tensor', 'a pseudotensor: it picks up an extra factor $\\det R$', 'a scalar', 'nothing definite, since it is not a tensor at all'], answer: 1,
      sol: 'If we insist that its components stay $\\pm1, 0$ in every frame, then the transformation law must include $\\det R$: $\\varepsilon\'_{ijk} = (\\det R)R_{il}R_{jm}R_{kn}\\varepsilon_{lmn}$. That is why $\\mathbf A\\times\\mathbf B$ of two polar vectors is an axial vector (angular momentum, magnetic field) that does not flip under parity.',
      trap: 'Under proper rotations alone it does behave as a true isotropic tensor.' },
    { id: 'tns-027', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'metric',
      q: 'Which statements about covariant and contravariant components are true?',
      options: ['$A_\\mu = g_{\\mu\\nu}A^\\nu$', '$A^\\mu B_\\mu$ is invariant', 'In Cartesian coordinates with the Euclidean metric, covariant and contravariant components coincide', 'The coordinate differentials $dx^\\mu$ transform covariantly'], answer: [0, 1, 2],
      sol: 'The metric lowers indices and its inverse raises them. A contraction of an upper with a lower index is invariant because the transformation matrices cancel. With $g_{ij} = \\delta_{ij}$ lowering changes nothing. $dx\'^\\mu = \\frac{\\partial x\'^\\mu}{\\partial x^\\nu}dx^\\nu$ is the contravariant law; gradients $\\partial_\\mu\\phi$ are covariant.',
      trap: 'Differentials are the model contravariant vector; gradients the model covariant one.' },
    { id: 'tns-028', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'field tensor',
      q: 'In units with $c = 1$, the invariant $F_{\\mu\\nu}F^{\\mu\\nu} = 2(B^2 - E^2)$. For $|\\mathbf E| = 3$ and $|\\mathbf B| = 5$ it equals ______.',
      answer: 32, tol: 0, calc: () => 2 * (25 - 9),
      sol: '$2(25 - 9) = 32$. Because it is a full contraction it is the same in every inertial frame: if $B > E$ in one frame, no frame can make the field purely electric.',
      trap: 'Using $B^2 + E^2$, which is the energy density (not invariant).' },

    // ---------- level 4 ----------
    { id: 'tns-029', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'epsilon-delta identity',
      q: 'If $A_kA_k = 5$, then $\\varepsilon_{ijk}\\varepsilon_{ijm}A_kA_m$ equals ______.',
      answer: 10, tol: 0, calc: () => 2 * 5,
      sol: 'In $\\varepsilon_{ijk}\\varepsilon_{imn} = \\delta_{jm}\\delta_{kn} - \\delta_{jn}\\delta_{km}$ put $m \\to j$ and $n \\to m$: $\\varepsilon_{ijk}\\varepsilon_{ijm} = \\delta_{jj}\\delta_{km} - \\delta_{jm}\\delta_{kj} = 3\\delta_{km} - \\delta_{km} = 2\\delta_{km}$. So the expression is $2A_kA_k = 10$.',
      trap: 'Using $3\\delta_{km}$ and forgetting the second term.' },
    { id: 'tns-030', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'epsilon-delta identity',
      q: 'Vectors satisfy $\\mathbf A\\cdot\\mathbf C = 2$, $\\mathbf B\\cdot\\mathbf D = 3$, $\\mathbf A\\cdot\\mathbf D = 1$ and $\\mathbf B\\cdot\\mathbf C = 4$. Then $(\\mathbf A\\times\\mathbf B)\\cdot(\\mathbf C\\times\\mathbf D)$ = ______.',
      answer: 2, tol: 0, calc: () => 2 * 3 - 1 * 4,
      sol: '$\\varepsilon_{ijk}A_jB_k\\varepsilon_{ilm}C_lD_m = (\\delta_{jl}\\delta_{km} - \\delta_{jm}\\delta_{kl})A_jB_kC_lD_m = (\\mathbf A\\cdot\\mathbf C)(\\mathbf B\\cdot\\mathbf D) - (\\mathbf A\\cdot\\mathbf D)(\\mathbf B\\cdot\\mathbf C) = 6 - 4 = 2$.',
      trap: 'Pairing A with D first flips the sign.' },
    { id: 'tns-031', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'index notation',
      q: 'Using $\\varepsilon_{ijk}\\varepsilon_{klm} = \\delta_{il}\\delta_{jm} - \\delta_{im}\\delta_{jl}$, $[\\nabla\\times(\\nabla\\times\\mathbf A)]_i$ equals',
      options: ['$\\nabla^2A_i - \\partial_i(\\partial_mA_m)$', '$\\partial_i(\\partial_mA_m) - \\nabla^2A_i$', '$\\partial_i(\\partial_mA_m) + \\nabla^2A_i$', '$0$'], answer: 1,
      sol: '$\\varepsilon_{ijk}\\partial_j\\varepsilon_{klm}\\partial_lA_m = (\\delta_{il}\\delta_{jm} - \\delta_{im}\\delta_{jl})\\partial_j\\partial_lA_m = \\partial_i\\partial_mA_m - \\partial_j\\partial_jA_i$: grad div minus the Laplacian. This is the step that turns Maxwell\'s equations into wave equations.',
      trap: 'The order of the two terms (sign) is the usual slip.' },
    { id: 'tns-032', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'invariants',
      q: 'Under a rotation $T\' = RTR^{\\mathsf T}$ of a 3D rank-2 tensor, which are unchanged?',
      options: ['The eigenvalues', 'The trace', 'The component $T_{11}$', 'The determinant'], answer: [0, 1, 3],
      sol: '$RTR^{\\mathsf T} = RTR^{-1}$ is a similarity transformation: same characteristic polynomial, hence same eigenvalues, trace (their sum) and determinant (their product). The third invariant is $\\frac12[(\\text{tr}\\,T)^2 - \\text{tr}(T^2)]$. Individual components change.',
      trap: 'Components are frame-dependent; invariants are built from eigenvalues.' },
    { id: 'tns-033', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'counting components',
      q: 'The elastic stiffness tensor $C_{ijkl}$ (3D) has the symmetries $C_{ijkl} = C_{jikl} = C_{ijlk} = C_{klij}$. How many independent components can it have in general?',
      options: ['36', '81', '21', '9'], answer: 2,
      sol: 'The first two symmetries make $(ij)$ and $(kl)$ each one of 6 symmetric pairs: a $6\\times6$ matrix, 36 components. The pair exchange makes that matrix symmetric: $\\frac{6\\times7}{2} = 21$ (the most anisotropic, triclinic crystal). Cubic crystals have 3 and isotropic solids 2.',
      trap: '36 forgets the major symmetry $C_{ijkl} = C_{klij}$, which comes from the existence of an elastic energy.' },
    { id: 'tns-034', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'isotropic tensors',
      q: 'The general isotropic rank-4 tensor in 3D is $a\\delta_{ij}\\delta_{kl} + b\\delta_{ik}\\delta_{jl} + c\\delta_{il}\\delta_{jk}$. With the symmetries of elastic stiffness, how many independent elastic constants does an isotropic solid have?',
      options: ['1', '3', '21', '2'], answer: 3,
      sol: 'Symmetry in $i \\leftrightarrow j$ forces $b = c$, leaving $C_{ijkl} = \\lambda\\delta_{ij}\\delta_{kl} + \\mu(\\delta_{ik}\\delta_{jl} + \\delta_{il}\\delta_{jk})$: the two Lamé constants. Young\'s modulus, the bulk and shear moduli and Poisson\'s ratio are all built from these two.',
      trap: 'Thinking $Y$, $K$, $G$ and $\\sigma$ are four independent constants.' },
    { id: 'tns-035', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'curvilinear coordinates',
      q: 'The Laplacian is $\\nabla^2f = \\frac{1}{\\sqrt g}\\partial_i(\\sqrt g\\,g^{ij}\\partial_jf)$. In plane polar coordinates ($\\sqrt g = r$), evaluate $\\nabla^2(r^3)$ at $r = 2$: ______',
      answer: 18, tol: 0, calc: () => 9 * 2,
      sol: 'Only $r$-derivatives act: $\\nabla^2f = \\frac1r\\frac{d}{dr}\\left(r\\frac{df}{dr}\\right) = \\frac1r\\frac{d}{dr}(3r^3) = 9r$. At $r = 2$: 18. Check in Cartesian: $\\nabla^2r^n = n^2r^{n-2}$ in 2D, $= 9r$ ✓.',
      trap: 'Using the plain second derivative $6r = 12$, which misses the $\\frac1r f\'$ term.' },
    { id: 'tns-036', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'metric',
      q: 'For spherical coordinates, $ds^2 = dr^2 + r^2d\\theta^2 + r^2\\sin^2\\theta\\,d\\phi^2$. The volume factor $\\sqrt{\\det g}$ is',
      options: ['$r\\sin\\theta$', '$r^2\\sin\\theta$', '$r^4\\sin^2\\theta$', '$r^2$'], answer: 1,
      sol: '$\\det g = 1\\cdot r^2\\cdot r^2\\sin^2\\theta$, so $\\sqrt g = r^2\\sin\\theta$: the familiar $dV = r^2\\sin\\theta\\,dr\\,d\\theta\\,d\\phi$.',
      trap: '$r^4\\sin^2\\theta$ is $\\det g$ before the square root.' },
    { id: 'tns-037', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'stress tensor',
      q: 'The stress tensor at a point is $\\sigma = \\begin{pmatrix}4 & 1 & 0\\\\ 1 & 2 & 0\\\\ 0 & 0 & 3\\end{pmatrix}$ MPa. The normal stress $n_i\\sigma_{ij}n_j$ on the plane with unit normal $\\mathbf n = (1, 1, 0)/\\sqrt2$ is ______ MPa.',
      answer: 4, tol: 0.01, calc: () => (4 + 1 + 1 + 2) / 2, unit: 'MPa',
      sol: 'Traction $t_i = \\sigma_{ij}n_j = \\frac{1}{\\sqrt2}(5, 3, 0)$. Normal part: $\\mathbf t\\cdot\\mathbf n = \\frac{5 + 3}{2} = 4$ MPa. (The shear part is $|\\mathbf t|^2 - 16 = 17 - 16 = 1$, so 1 MPa of shear.)',
      trap: 'Forgetting to normalise $\\mathbf n$ (which would give 8).' },

    // ---------- level 5 ----------
    { id: 'tns-038', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'counting components',
      q: 'A totally symmetric rank-3 tensor in four dimensions has ______ independent components.',
      answer: 20, tol: 0, calc: () => binom(6, 3),
      sol: 'A totally symmetric tensor is fixed by how many times each index value appears: choosing 3 values from 4 with repetition, $\\binom{n + r - 1}{r} = \\binom{6}{3} = 20$. (A totally antisymmetric one would have $\\binom43 = 4$.)',
      trap: 'Dividing $4^3$ by $3!$ does not give an integer here; repeated indices must be counted properly.' },
    { id: 'tns-039', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'Christoffel symbols',
      q: 'On a unit sphere ($g_{\\theta\\theta} = 1$, $g_{\\phi\\phi} = \\sin^2\\theta$), the Christoffel symbol $\\Gamma^\\phi_{\\theta\\phi}$ is',
      options: ['$-\\sin\\theta\\cos\\theta$', '$\\tan\\theta$', '$\\sin\\theta\\cos\\theta$', '$\\cot\\theta$'], answer: 3,
      sol: '$\\Gamma^\\phi_{\\theta\\phi} = \\frac12g^{\\phi\\phi}\\partial_\\theta g_{\\phi\\phi} = \\frac{1}{2\\sin^2\\theta}\\cdot2\\sin\\theta\\cos\\theta = \\cot\\theta$. The other non-zero one is $\\Gamma^\\theta_{\\phi\\phi} = -\\sin\\theta\\cos\\theta$.',
      trap: '$-\\sin\\theta\\cos\\theta$ is $\\Gamma^\\theta_{\\phi\\phi}$.' },
    { id: 'tns-040', type: 'msq', level: 5, exams: ['gate', 'net'], sub: 'curvature',
      q: 'Which statements are true?',
      options: ['The Christoffel symbols are not the components of a tensor', 'In Cartesian coordinates on flat space all Christoffel symbols vanish', 'The Riemann tensor of the flat plane is zero, even in polar coordinates', 'Non-zero Christoffel symbols prove that a space is curved'], answer: [0, 1, 2],
      sol: 'Christoffel symbols transform with an extra inhomogeneous term, so they can be zero in one frame and not in another. Flat space in polar coordinates has $\\Gamma^r_{\\theta\\theta} = -r \\ne 0$, yet it is flat: curvature lives in the Riemann tensor, a true tensor, which is zero in one frame and so in all. The sphere has a non-zero Riemann tensor.',
      trap: 'Curvilinear coordinates are not curvature.' },
    { id: 'tns-041', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'rotation of tensors',
      q: 'A 2D tensor is $\\text{diag}(5, 1)$ in its principal axes. In axes rotated by $30°$, the magnitude of the off-diagonal component $|T\'_{12}|$ is ______ (to three decimal places).',
      answer: 1.732, tol: 0.002, calc: () => 4 * Math.sin(Math.PI / 6) * Math.cos(Math.PI / 6),
      sol: 'With $R = \\begin{pmatrix}\\cos\\theta & \\sin\\theta\\\\ -\\sin\\theta & \\cos\\theta\\end{pmatrix}$: $T\'_{12} = (T_{22} - T_{11})\\sin\\theta\\cos\\theta = -4\\times\\frac12\\times\\frac{\\sqrt3}{2} = -\\sqrt3$. The sign depends on the rotation sense; the magnitude $\\sqrt3 \\approx 1.732$ does not. It is largest at $45°$, where it equals half the difference of the principal values (the maximum shear in Mohr\'s circle).',
      trap: 'Expecting zero: off-diagonal components vanish only in the principal axes.' },
    { id: 'tns-042', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'Levi-Civita symbol',
      q: 'In four-dimensional Euclidean space, with $A_lA_l = 3$, the contraction $\\varepsilon_{ijkl}\\varepsilon_{ijkn}A_lA_n$ equals ______.',
      answer: 18, tol: 0, calc: () => 6 * 3,
      sol: 'In $n$ dimensions, contracting $n - 1$ index pairs of two $\\varepsilon$s gives $(n - 1)!\\,\\delta_{ln}$. Here $3!\\,\\delta_{ln} = 6\\delta_{ln}$, so the result is $6A_lA_l = 18$. (Check with 3D: $\\varepsilon_{ijk}\\varepsilon_{ijm} = 2!\\,\\delta_{km}$ ✓.)',
      trap: 'Carrying over the 3D factor 2.' },
    ...more2,
    ...r4.items,
  ],
  gens: [
    { id: 'tns-g01', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'counting components',
      make(r) {
        const n = int(r, 2, 4), kind = choose(r, ['general', 'symmetric', 'antisymmetric']);
        const rk = kind === 'antisymmetric' ? int(r, 2, n) : int(r, 2, 4);
        const answer = kind === 'general' ? n ** rk : kind === 'symmetric' ? binom(n + rk - 1, rk) : binom(n, rk);
        return { q: `How many independent components does a ${kind === 'general' ? 'general' : `totally ${kind}`} tensor of rank ${rk} in ${n} dimensions have?`, answer, tol: 0, n, rk, kind,
          sol: `${kind === 'general' ? `Each index takes ${n} values: $${n}^{${rk}} = ${answer}$.` : kind === 'symmetric' ? `Only how often each value appears matters: $\\binom{n + r - 1}{r} = \\binom{${n + rk - 1}}{${rk}} = ${answer}$.` : `All indices must differ and their order only changes the sign: $\\binom{n}{r} = \\binom{${n}}{${rk}} = ${answer}$.`}`,
          trap: 'Symmetric counts choices with repetition; antisymmetric without.' };
      },
      verify: (p) => { // brute-force count of index tuples up to symmetry
        let c = 0; const t = Array(p.rk).fill(0);
        const rec = (d) => { if (d === p.rk) { if (p.kind === 'general') c++; else if (p.kind === 'symmetric') { if (t.every((v, i) => i === 0 || t[i - 1] <= v)) c++; } else if (t.every((v, i) => i === 0 || t[i - 1] < v)) c++; return; } for (let v = 0; v < p.n; v++) { t[d] = v; rec(d + 1); } };
        rec(0); return c; } },
    { id: 'tns-g02', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'rotation of tensors',
      make(r) {
        const a = int(r, 1, 6), d = int(r, -2, 4), b = int(r, -3, 3), th = choose(r, [15, 30, 45, 60, 90, 120]), comp = choose(r, ['11', '22', '12']);
        const c = Math.cos((th * Math.PI) / 180), s = Math.sin((th * Math.PI) / 180);
        const v = comp === '11' ? c * c * a + 2 * s * c * b + s * s * d : comp === '22' ? s * s * a - 2 * s * c * b + c * c * d : (d - a) * s * c + b * (c * c - s * s);
        const answer = round(v, 4);
        return { q: `In the $xy$ axes a 2D tensor is $T = \\begin{pmatrix}${a} & ${b}\\\\ ${b} & ${d}\\end{pmatrix}$. In axes rotated anticlockwise by $${th}°$, its components are $T' = RTR^{\\mathsf T}$ with $R = \\begin{pmatrix}\\cos\\theta & \\sin\\theta\\\\ -\\sin\\theta & \\cos\\theta\\end{pmatrix}$. Find $T'_{${comp}}$ (to four decimal places).`,
          answer, tol: 2e-3, a, b, d, th, comp,
          sol: `${comp === '11' ? '$T\'_{11} = \\cos^2\\theta\\,T_{11} + 2\\sin\\theta\\cos\\theta\\,T_{12} + \\sin^2\\theta\\,T_{22}$' : comp === '22' ? '$T\'_{22} = \\sin^2\\theta\\,T_{11} - 2\\sin\\theta\\cos\\theta\\,T_{12} + \\cos^2\\theta\\,T_{22}$' : '$T\'_{12} = (T_{22} - T_{11})\\sin\\theta\\cos\\theta + T_{12}(\\cos^2\\theta - \\sin^2\\theta)$'}. With $\\theta = ${th}°$: $\\approx ${answer}$. Check: $T'_{11} + T'_{22} = ${a + d}$, the trace, whatever the angle.`,
          trap: 'Each index brings its own factor of $R$, so the angle enters squared.' };
      },
      verify: (p) => { const t = (p.th * Math.PI) / 180, R = [[Math.cos(t), Math.sin(t)], [-Math.sin(t), Math.cos(t)]], T = [[p.a, p.b], [p.b, p.d]]; const i = +p.comp[0] - 1, j = +p.comp[1] - 1; let s = 0; for (let k = 0; k < 2; k++) for (let l = 0; l < 2; l++) s += R[i][k] * R[j][l] * T[k][l]; return s; } },
    { id: 'tns-g03', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'principal axes',
      make(r) {
        const d = int(r, -2, 3), a = d + int(r, 1, 5), b = choose(r, [-3, -2, -1, 1, 2, 3]);
        const answer = round((Math.atan((2 * b) / (a - d)) * 90) / Math.PI, 3);
        return { q: `Find the angle $\\theta$ (in degrees, between $-45°$ and $45°$) by which the axes must be rotated to make $T = \\begin{pmatrix}${a} & ${b}\\\\ ${b} & ${d}\\end{pmatrix}$ diagonal.`,
          answer, tol: 0.05, a, b, d,
          sol: `Requiring $T'_{12} = 0$: $\\tan2\\theta = \\frac{2T_{12}}{T_{11} - T_{22}} = \\frac{${2 * b}}{${a - d}}$, so $\\theta = \\tfrac12\\arctan(${round((2 * b) / (a - d), 4)}) \\approx ${answer}°$. The new $x'$ axis lies along the eigenvector of the larger eigenvalue.`,
          trap: 'The factor 2: the formula gives $2\\theta$.' };
      },
      verify: (p) => { const tr = p.a + p.d, l1 = tr / 2 + Math.sqrt(((p.a - p.d) / 2) ** 2 + p.b * p.b); return (Math.atan((l1 - p.a) / p.b) * 180) / Math.PI; } },
    { id: 'tns-g04', type: 'nat', level: 2, exams: ['gate', 'net', 'jam'], sub: 'Levi-Civita symbol',
      make(r) {
        const A = rv(r), B = rv(r), Cc = rv(r), answer = dot(A, cross(B, Cc));
        return { q: `For $\\mathbf A = ${vec(A)}$, $\\mathbf B = ${vec(B)}$ and $\\mathbf C = ${vec(Cc)}$, evaluate $\\varepsilon_{ijk}A_iB_jC_k$.`, answer, tol: 0, A, B, Cc,
          sol: `$\\varepsilon_{ijk}A_iB_jC_k = \\mathbf A\\cdot(\\mathbf B\\times\\mathbf C)$, the determinant with rows $\\mathbf A$, $\\mathbf B$, $\\mathbf C$. $\\mathbf B\\times\\mathbf C = ${vec(cross(B, Cc))}$, so the result is $${answer}$.`,
          trap: 'The order matters: swapping two vectors flips the sign.' };
      },
      verify: (p) => { let s = 0; for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) for (let k = 0; k < 3; k++) s += eps(i, j, k) * p.A[i] * p.B[j] * p.Cc[k]; return s; } },
    { id: 'tns-g05', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'epsilon-delta identity',
      make(r) {
        const A = rv(r), B = rv(r), Cc = rv(r), D = rv(r);
        const answer = dot(A, Cc) * dot(B, D) - dot(A, D) * dot(B, Cc);
        return { q: `For $\\mathbf A = ${vec(A)}$, $\\mathbf B = ${vec(B)}$, $\\mathbf C = ${vec(Cc)}$ and $\\mathbf D = ${vec(D)}$, evaluate $(\\mathbf A\\times\\mathbf B)\\cdot(\\mathbf C\\times\\mathbf D)$.`, answer, tol: 0, A, B, Cc, D,
          sol: `With $\\varepsilon_{ijk}\\varepsilon_{ilm} = \\delta_{jl}\\delta_{km} - \\delta_{jm}\\delta_{kl}$: $(\\mathbf A\\cdot\\mathbf C)(\\mathbf B\\cdot\\mathbf D) - (\\mathbf A\\cdot\\mathbf D)(\\mathbf B\\cdot\\mathbf C) = (${dot(A, Cc)})(${dot(B, D)}) - (${dot(A, D)})(${dot(B, Cc)}) = ${answer}$. No cross products needed.`,
          trap: 'The first product pairs A with C (first with first).' };
      },
      verify: (p) => dot(cross(p.A, p.B), cross(p.Cc, p.D)) },
    { id: 'tns-g06', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'inertia tensor',
      make(r) {
        const ms = [int(r, 1, 4), int(r, 1, 4)], ps = [rv(r), rv(r)], comp = choose(r, ['xy', 'yz', 'zz', 'xx']);
        const ix = { x: 0, y: 1, z: 2 }, i = ix[comp[0]], j = ix[comp[1]];
        let answer = 0; for (let k = 0; k < 2; k++) { const p = ps[k], r2 = dot(p, p); answer += ms[k] * ((i === j ? r2 : 0) - p[i] * p[j]); }
        return { q: `Point masses ${ms[0]} kg at ${vec(ps[0])} m and ${ms[1]} kg at ${vec(ps[1])} m. Using $I_{ij} = \\sum m(r^2\\delta_{ij} - x_ix_j)$, find $I_{${comp}}$ in kg m².`, answer, unit: 'kg m²', tol: 0, ms, ps, comp,
          sol: `${i === j ? `$I_{${comp}} = \\sum m(r^2 - ${comp[0]}^2)$, the sum of $m$ times the squares of the other two coordinates` : `$I_{${comp}} = -\\sum m\\,${comp[0]}${comp[1]}$`}. Adding the two masses: $${answer}$ kg m².`,
          trap: 'Products of inertia carry a minus sign; moments use the distance from the axis, not from the origin.' };
      },
      verify: (p) => { const ix = { x: 0, y: 1, z: 2 }, i = ix[p.comp[0]], j = ix[p.comp[1]]; let s = 0; for (let k = 0; k < 2; k++) { const v = p.ps[k]; if (i === j) { for (let a = 0; a < 3; a++) if (a !== i) s += p.ms[k] * v[a] * v[a]; } else s -= p.ms[k] * v[i] * v[j]; } return s; } },
    { id: 'tns-g07', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'stress tensor',
      make(r) {
        const s11 = int(r, -2, 6), s22 = int(r, -2, 6), s33 = int(r, 1, 5), s12 = int(r, -3, 3), s13 = int(r, -2, 2), s23 = int(r, -2, 2);
        const nv = choose(r, [[1, 1, 0], [1, 0, 1], [0, 1, 1], [1, 1, 1], [1, -1, 0], [2, 1, 0]]);
        const S = [[s11, s12, s13], [s12, s22, s23], [s13, s23, s33]], N = Math.sqrt(dot(nv, nv));
        let v = 0; for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) v += nv[i] * S[i][j] * nv[j];
        const answer = round(v / (N * N), 4);
        return { q: `The stress tensor is $\\sigma = \\begin{pmatrix}${S.map((row) => row.join(' & ')).join('\\\\ ')}\\end{pmatrix}$ MPa. Find the normal stress $n_i\\sigma_{ij}n_j$ on the plane whose normal is along ${vec(nv)} (to four decimal places), in MPa.`,
          answer, unit: 'MPa', tol: 2e-3, S, nv,
          sol: `Normalise: $\\mathbf n = ${vec(nv)}/\\sqrt{${N * N}}$. Then $n_i\\sigma_{ij}n_j = \\frac{1}{${N * N}}\\sum_{ij}v_i\\sigma_{ij}v_j = \\frac{${v}}{${N * N}} \\approx ${answer}$ MPa.`,
          trap: 'The normal must be a unit vector.' };
      },
      verify: (p) => { const t = p.S.map((row) => dot(row, p.nv)); return dot(t, p.nv) / dot(p.nv, p.nv); } },
    { id: 'tns-g08', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'metric',
      make(r) {
        const R = choose(r, [1, 2, 6371]), th = choose(r, [30, 45, 60, 90, 120]), dphi = choose(r, [30, 60, 90, 180, 360]);
        const answer = round(R * Math.sin((th * Math.PI) / 180) * ((dphi * Math.PI) / 180), 3);
        return { q: `On a sphere of radius ${R} km, $ds^2 = R^2(d\\theta^2 + \\sin^2\\theta\\,d\\phi^2)$. Find the length of the path along the circle $\\theta = ${th}°$ through an angle $\\Delta\\phi = ${dphi}°$ in km (to three decimal places).`,
          answer, tol: Math.max(2e-3, answer * 0.002), R, th, dphi,
          sol: `Along the circle $d\\theta = 0$, so $ds = R\\sin\\theta\\,d\\phi$ and the length is $R\\sin\\theta\\,\\Delta\\phi = ${R}\\times${round(Math.sin((th * Math.PI) / 180), 4)}\\times${round((dphi * Math.PI) / 180, 4)} \\approx ${answer}$. (This is not the shortest path between the end points unless $\\theta = 90°$: only great circles are geodesics.)`,
          trap: '$\\Delta\\phi$ must be in radians, and the radius of the circle is $R\\sin\\theta$.' };
      },
      verify: (p) => { // integrate ds along the curve numerically
        const N = 2000, t = (p.th * Math.PI) / 180, P = (k) => { const f = ((p.dphi * Math.PI) / 180) * (k / N); return [p.R * Math.sin(t) * Math.cos(f), p.R * Math.sin(t) * Math.sin(f), p.R * Math.cos(t)]; };
        let s = 0; for (let k = 0; k < N; k++) { const a = P(k), b = P(k + 1); s += Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]); } return s; } },
    { id: 'tns-g09', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'curvilinear coordinates',
      make(r) {
        const dim = choose(r, [2, 3]), n = choose(r, [-1, 2, 3, 4]), rr = choose(r, [1, 2, 3]);
        const answer = round(n * (n + dim - 2) * rr ** (n - 2), 4);
        return { q: `Using $\\nabla^2f = \\frac{1}{\\sqrt g}\\partial_i(\\sqrt g\\,g^{ij}\\partial_jf)$ in ${dim === 2 ? 'plane polar coordinates ($\\sqrt g = r$)' : 'spherical coordinates ($\\sqrt g = r^2\\sin\\theta$)'}, find $\\nabla^2(r^{${n}})$ at $r = ${rr}$ (to four decimal places).`,
          answer, tol: Math.max(1e-3, Math.abs(answer) * 0.002), dim, n, rr,
          sol: `For a function of $r$ only, $\\nabla^2f = \\frac{1}{r^{${dim - 1}}}\\frac{d}{dr}\\left(r^{${dim - 1}}f'\\right)$. With $f = r^{${n}}$: $\\frac{1}{r^{${dim - 1}}}\\frac{d}{dr}(${n}r^{${n + dim - 2}}) = ${n * (n + dim - 2)}r^{${n - 2}}$. At $r = ${rr}$: $${answer}$.${dim === 3 && n === -1 ? ' (Zero away from the origin: $1/r$ is harmonic there, the Coulomb potential.)' : ''}`,
          trap: 'The $\\frac{d-1}{r}f\'$ term depends on the dimension.' };
      },
      verify: (p) => { // finite-difference Laplacian in Cartesian coordinates at (rr, 0, 0)
        const h = 1e-3, f = (x, y, z) => Math.hypot(x, y, z) ** p.n, X = p.rr; let s = 0;
        const dirs = p.dim === 2 ? [[1, 0, 0], [0, 1, 0]] : [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
        for (const [a, b, c] of dirs) s += (f(X + a * h, b * h, c * h) - 2 * f(X, 0, 0) + f(X - a * h, -b * h, -c * h)) / (h * h);
        return s; } },
    { id: 'tns-g10', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'contraction',
      make(r) {
        const E = [
          ['A_iB_jC_j', 1], ['T_{ijk}\\delta_{jk}', 1], ['\\varepsilon_{ijk}A_jB_kC_i', 0], ['T_{ij}S_{kl}', 4], ['R_{ijkl}\\delta_{ik}', 2],
          ['\\varepsilon_{ijk}A_k', 2], ['\\partial_iT_{ij}', 1], ['A_iB_jT_{ij}', 0], ['\\varepsilon_{ijk}T_{lm}\\delta_{kl}', 3], ['\\partial_i\\partial_jF_{ij}', 0],
        ];
        const [ex, rk] = E[int(r, 0, E.length - 1)];
        const o = mcqOptions(r, rk, [0, 1, 2, 3, 4].filter((v) => v !== rk), (v) => `rank ${v}`);
        return { q: `With the summation convention, the expression $${ex}$ is a tensor of`, ...o,
          sol: `Repeated indices are summed (contracted); the rank is the number of free indices that remain. In $${ex}$ that number is ${rk}.`,
          trap: 'Count free indices, not symbols.' };
      } },
    { id: 'tns-g11', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'field tensor',
      make(r) {
        const Ev = rv(r), Bv = rv(r), answer = 2 * (dot(Bv, Bv) - dot(Ev, Ev));
        return { q: `In units with $c = 1$ and metric $\\text{diag}(1, -1, -1, -1)$, a field has $\\mathbf E = ${vec(Ev)}$ and $\\mathbf B = ${vec(Bv)}$. Find the invariant $F_{\\mu\\nu}F^{\\mu\\nu}$.`, answer, tol: 0, Ev, Bv,
          sol: `$F_{\\mu\\nu}F^{\\mu\\nu} = 2(B^2 - E^2)$: $B^2 = ${dot(Bv, Bv)}$, $E^2 = ${dot(Ev, Ev)}$, so the invariant is $${answer}$. ${answer > 0 ? 'Positive: no frame makes the field purely electric.' : answer < 0 ? 'Negative: no frame makes the field purely magnetic.' : 'Zero: like a light wave, if also $\\mathbf E\\cdot\\mathbf B = 0$.'}`,
          trap: 'Not $B^2 + E^2$ (energy density, not invariant).' };
      },
      verify: (p) => { // build F^{mu nu} with F^{0i} = -E_i, F^{ij} = -eps_ijk B_k, lower both indices and contract
        const [Ex, Ey, Ez] = p.Ev, [Bx, By, Bz] = p.Bv;
        const F = [[0, -Ex, -Ey, -Ez], [Ex, 0, -Bz, By], [Ey, Bz, 0, -Bx], [Ez, -By, Bx, 0]], g = [1, -1, -1, -1];
        let s = 0; for (let m = 0; m < 4; m++) for (let n = 0; n < 4; n++) s += g[m] * g[n] * F[m][n] * F[m][n]; return s; } },
    ...more,
    ...r4.gens,
  ],
};

// Tidy signs in generated text ("+ -3" -> "- 3", "1x" -> "x"); see _signs.js.
export default tidyPhys(topicBank, ["tns-g09"]);
