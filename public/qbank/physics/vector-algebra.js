// Vector algebra for physics: components, magnitude, unit vectors and direction cosines, dot product (angle,
// projection, work), cross product (area, torque, angular momentum, Lorentz force), scalar triple product (volume,
// coplanarity), vector triple product (BAC-CAB), Lagrange identity, lines and planes, reciprocal vectors, polar and
// axial vectors, index notation (Kronecker delta, Levi-Civita symbol).
// Original questions for IIT JAM, GATE and CSIR NET practice (fibub). Levels: 1 warm-up ... 5 top rank.
import { int, choose, mcqOptions, round } from '../_util.js';

const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = (a) => Math.sqrt(dot(a, a));
const det3 = (a, b, c) => dot(a, cross(b, c));
const vec = (r, lo = -4, hi = 4) => [int(r, lo, hi), int(r, lo, hi), int(r, lo, hi)];
const tv = (a) => `(${a.join(', ')})`;
const DEG = 180 / Math.PI;

export default {
  topic: 'vector-algebra',
  items: [
    // ---------- level 1 ----------
    { id: 'va-001', type: 'nat', level: 1, exams: ['jam'], sub: 'magnitude',
      q: 'The magnitude of $\\vec A = \\hat i + 2\\hat j + 2\\hat k$ is ______.',
      answer: 3, tol: 0, calc: () => norm([1, 2, 2]),
      sol: '$|\\vec A| = \\sqrt{1^2 + 2^2 + 2^2} = \\sqrt9 = 3$.',
      trap: 'Adding the components ($1 + 2 + 2 = 5$) instead of using Pythagoras.' },
    { id: 'va-002', type: 'mcq', level: 1, exams: ['jam'], sub: 'dot product',
      q: 'For $\\vec A = (1, 2, 3)$ and $\\vec B = (4, -5, 6)$, the dot product $\\vec A\\cdot\\vec B$ is',
      options: ['$32$', '$12$', '$-12$', '$0$'], answer: 1,
      sol: 'Multiply matching components and add: $1\\cdot4 + 2\\cdot(-5) + 3\\cdot6 = 4 - 10 + 18 = 12$.',
      trap: 'Missing the minus sign on $-5$ gives $32$.' },
    { id: 'va-003', type: 'mcq', level: 1, exams: ['jam'], sub: 'cross product',
      q: 'For the right-handed unit vectors, $\\hat j\\times\\hat k$ equals',
      options: ['$-\\hat i$', '$\\hat k$', '$\\hat i$', '$0$'], answer: 2,
      sol: 'Going round the cycle $\\hat i\\to\\hat j\\to\\hat k\\to\\hat i$ in order gives a plus sign: $\\hat i\\times\\hat j = \\hat k$, $\\hat j\\times\\hat k = \\hat i$, $\\hat k\\times\\hat i = \\hat j$. Against the cycle gives a minus sign.',
      trap: '$-\\hat i$ is $\\hat k\\times\\hat j$, the reversed order.' },
    { id: 'va-004', type: 'msq', level: 1, exams: ['jam'], sub: 'products', format: 'multi',
      q: 'Which of these hold for all vectors $\\vec A$ and $\\vec B$?',
      options: ['$\\vec A\\cdot\\vec B = \\vec B\\cdot\\vec A$', '$\\vec A\\times\\vec B = \\vec B\\times\\vec A$', '$\\vec A\\times\\vec A = \\vec 0$', '$\\vec A\\cdot(\\vec A\\times\\vec B) = 0$'], answer: [0, 2, 3],
      sol: 'The dot product is symmetric. The cross product is antisymmetric: $\\vec A\\times\\vec B = -\\vec B\\times\\vec A$, so the second is false unless the product is zero. Then $\\vec A\\times\\vec A = -\\vec A\\times\\vec A$ forces it to be $\\vec 0$. $\\vec A\\times\\vec B$ is perpendicular to $\\vec A$, so its dot product with $\\vec A$ is zero.',
      trap: 'Carrying the commutativity of ordinary multiplication over to the cross product.' },
    { id: 'va-005', type: 'nat', level: 1, exams: ['jam'], sub: 'angle between vectors', unit: '°',
      q: 'The angle between $\\vec A = \\hat i + \\hat j$ and $\\vec B = \\hat j + \\hat k$ is ______ degrees.',
      answer: 60, tol: 0.05, calc: () => Math.acos(1 / 2) * DEG,
      sol: '$\\cos\\theta = \\dfrac{\\vec A\\cdot\\vec B}{|\\vec A||\\vec B|} = \\dfrac{0 + 1 + 0}{\\sqrt2\\sqrt2} = \\dfrac12$, so $\\theta = 60^\\circ$.',
      trap: 'Forgetting to divide by the magnitudes and taking $\\cos\\theta = 1$.' },
    { id: 'va-006', type: 'mcq', level: 1, exams: ['jam'], sub: 'work',
      q: 'A constant force $\\vec F = (3\\hat i + 4\\hat j)$ N moves a particle through $\\vec d = (2\\hat i - \\hat j + 5\\hat k)$ m. The work done is',
      options: ['$10$ J', '$5$ J', '$14$ J', '$2$ J'], answer: 3,
      sol: '$W = \\vec F\\cdot\\vec d = 3\\cdot2 + 4\\cdot(-1) + 0\\cdot5 = 6 - 4 + 0 = 2$ J. The motion along $z$ does no work because the force has no $z$-part.',
      trap: 'Multiplying magnitudes ($5\\times\\sqrt{30}$) ignores the angle between force and displacement.' },

    // ---------- level 2 ----------
    { id: 'va-007', type: 'nat', level: 2, exams: ['jam'], sub: 'area',
      q: 'The area of the triangle with vertices $(0, 0, 0)$, $(2, 0, 0)$ and $(0, 3, 4)$ is ______.',
      answer: 5, tol: 0, calc: () => norm(cross([2, 0, 0], [0, 3, 4])) / 2,
      sol: 'Edges from the origin: $\\vec a = (2, 0, 0)$ and $\\vec b = (0, 3, 4)$. $\\vec a\\times\\vec b = (0\\cdot4 - 0\\cdot3,\\ 0\\cdot0 - 2\\cdot4,\\ 2\\cdot3 - 0\\cdot0) = (0, -8, 6)$, of length $10$. The triangle is half the parallelogram: area $5$.',
      trap: 'Forgetting the factor $\\tfrac12$: $|\\vec a\\times\\vec b|$ is the area of the parallelogram.' },
    { id: 'va-008', type: 'mcq', level: 2, exams: ['jam'], sub: 'projection',
      q: 'The scalar projection (component) of $\\vec A = (2, 3, 6)$ along $\\vec B = (1, 2, 2)$ is',
      options: ['$20/7$', '$20$', '$20/3$', '$20/9$'], answer: 2,
      sol: 'Component of $\\vec A$ along $\\vec B$ $= \\vec A\\cdot\\hat B = \\dfrac{\\vec A\\cdot\\vec B}{|\\vec B|} = \\dfrac{2 + 6 + 12}{3} = \\dfrac{20}{3}$.',
      trap: 'Dividing by $|\\vec A| = 7$ gives the component of $\\vec B$ along $\\vec A$ instead.' },
    { id: 'va-009', type: 'nat', level: 2, exams: ['jam'], sub: 'perpendicular vectors',
      q: 'The vectors $(1, \\lambda, 3)$ and $(2, -1, 4)$ are perpendicular when $\\lambda$ equals ______.',
      answer: 14, tol: 0, calc: () => 2 + 12,
      sol: 'Perpendicular means zero dot product: $2 - \\lambda + 12 = 0$, so $\\lambda = 14$.',
      trap: 'Setting the cross product to zero instead tests for parallel vectors.' },
    { id: 'va-010', type: 'mcq', level: 2, exams: ['jam'], sub: 'torque',
      q: 'A force $\\vec F = 2\\hat k$ N acts at the point $\\vec r = \\hat i$ m. The torque about the origin is',
      options: ['$-2\\hat j$ N m', '$2\\hat j$ N m', '$2\\hat k$ N m', '$-2\\hat i$ N m'], answer: 0,
      sol: '$\\vec\\tau = \\vec r\\times\\vec F = \\hat i\\times2\\hat k = 2(\\hat i\\times\\hat k) = -2\\hat j$, since $\\hat k\\times\\hat i = \\hat j$.',
      trap: 'Computing $\\vec F\\times\\vec r$ (the wrong order) flips the sign.' },
    { id: 'va-011', type: 'nat', level: 2, exams: ['jam'], sub: 'triple product',
      q: 'The volume of the parallelepiped with edges $\\vec a = (1, 0, 0)$, $\\vec b = (1, 2, 0)$ and $\\vec c = (1, 1, 3)$ is ______.',
      answer: 6, tol: 0, calc: () => Math.abs(det3([1, 0, 0], [1, 2, 0], [1, 1, 3])),
      sol: 'Volume $= |\\vec a\\cdot(\\vec b\\times\\vec c)| = \\left|\\begin{vmatrix}1&0&0\\\\1&2&0\\\\1&1&3\\end{vmatrix}\\right| = 1\\cdot(2\\cdot3 - 0\\cdot1) = 6$.',
      trap: 'Adding the three edge lengths or multiplying them ($1\\times\\sqrt5\\times\\sqrt{11}$) ignores that the edges are not perpendicular.' },
    { id: 'va-012', type: 'mcq', level: 2, exams: ['jam'], sub: 'direction cosines',
      q: 'The direction cosines of the vector $2\\hat i - \\hat j + 2\\hat k$ are',
      options: ['$(2, -1, 2)$', '$(2/3, 1/3, 2/3)$', '$(2/9, -1/9, 2/9)$', '$(2/3, -1/3, 2/3)$'], answer: 3,
      sol: 'Divide each component by the length $\\sqrt{4 + 1 + 4} = 3$: $(2/3, -1/3, 2/3)$. Check: $\\tfrac49 + \\tfrac19 + \\tfrac49 = 1$.',
      trap: 'Dropping the sign of the $y$-component; a direction cosine is negative when the vector points along $-y$.' },
    { id: 'va-013', type: 'msq', level: 2, exams: ['jam'], sub: 'products', format: 'statements',
      q: 'Non-zero vectors $\\vec A$ and $\\vec B$ satisfy $\\vec A\\times\\vec B = \\vec 0$. Which statements must be true?',
      options: ['$\\vec A = \\vec B$', '$\\vec A$ and $\\vec B$ are parallel or antiparallel.', '$\\vec A\\cdot\\vec B = 0$', '$|\\vec A\\cdot\\vec B| = |\\vec A||\\vec B|$'], answer: [1, 3],
      sol: '$|\\vec A\\times\\vec B| = AB\\sin\\theta = 0$ with $A, B\\ne0$ means $\\sin\\theta = 0$: $\\theta = 0$ or $180^\\circ$. Then $\\vec A\\cdot\\vec B = \\pm AB$. The vectors need not be equal (they can differ in length or point opposite ways), and their dot product is not zero.',
      trap: 'Thinking a zero cross product means equal vectors, or mixing it up with the condition for perpendicular vectors.' },
    { id: 'va-014', type: 'nat', level: 2, exams: ['jam'], sub: 'Lagrange identity',
      q: 'Given $|\\vec A| = 3$, $|\\vec B| = 4$ and $\\vec A\\cdot\\vec B = 6$, the value of $|\\vec A\\times\\vec B|$ is ______ (to two decimal places).',
      answer: 10.39, tol: 0.01, calc: () => Math.sqrt(9 * 16 - 36),
      sol: '$|\\vec A\\times\\vec B|^2 + (\\vec A\\cdot\\vec B)^2 = A^2B^2$ (because $\\sin^2 + \\cos^2 = 1$). So $|\\vec A\\times\\vec B| = \\sqrt{144 - 36} = \\sqrt{108} = 10.39$.',
      trap: 'Finding $\\theta = 60^\\circ$ and then using $AB\\cos\\theta$ again instead of $AB\\sin\\theta$.' },
    { id: 'va-015', type: 'mcq', level: 2, exams: ['jam'], sub: 'cross product',
      q: 'A unit vector perpendicular to both $\\hat i + \\hat j$ and $\\hat j + \\hat k$ is',
      options: ['$(\\hat i + \\hat j + \\hat k)/\\sqrt3$', '$(\\hat i - \\hat j + \\hat k)/\\sqrt3$', '$(\\hat i - \\hat j - \\hat k)/\\sqrt3$', '$(\\hat i - \\hat j + \\hat k)/3$'], answer: 1,
      sol: '$(1, 1, 0)\\times(0, 1, 1) = (1\\cdot1 - 0\\cdot1,\\ 0\\cdot0 - 1\\cdot1,\\ 1\\cdot1 - 1\\cdot0) = (1, -1, 1)$. Its length is $\\sqrt3$, so the unit vector is $(\\hat i - \\hat j + \\hat k)/\\sqrt3$ (its negative also works). Check: dot with $(1,1,0)$ gives $0$.',
      trap: 'Dividing by $3$ (the sum of squares) instead of $\\sqrt3$.' },
    { id: 'va-016', type: 'nat', level: 2, exams: ['jam'], sub: 'planes',
      q: 'The distance of the point $(1, 2, 3)$ from the plane $2x - y + 2z = 10$ is ______ (to three decimal places).',
      answer: 1.333, tol: 0.002, calc: () => Math.abs(2 - 2 + 6 - 10) / 3,
      sol: 'The normal is $\\vec n = (2, -1, 2)$, of length 3. Distance $= \\dfrac{|2\\cdot1 - 2 + 2\\cdot3 - 10|}{3} = \\dfrac{|-4|}{3} = 1.333$.',
      trap: 'Forgetting to divide by $|\\vec n|$, which gives 4.' },

    // ---------- level 3 ----------
    { id: 'va-017', type: 'mcq', level: 3, exams: ['jam'], sub: 'coplanarity',
      q: 'The vectors $(1, 2, 3)$, $(2, k, 1)$ and $(1, 1, 1)$ lie in one plane when $k$ equals',
      options: ['$-3/2$', '$2/3$', '$3$', '$3/2$'], answer: 3,
      sol: 'Coplanar means the box they span has no volume: $\\begin{vmatrix}1&2&3\\\\2&k&1\\\\1&1&1\\end{vmatrix} = 1(k - 1) - 2(2 - 1) + 3(2 - k) = 3 - 2k = 0$, so $k = 3/2$.',
      trap: 'A sign slip in the middle cofactor (it carries a minus sign) gives $-3/2$.' },
    { id: 'va-018', type: 'mcq', level: 3, exams: ['jam'], sub: 'vector triple product',
      q: 'The vector triple product $\\vec A\\times(\\vec B\\times\\vec C)$ equals',
      options: ['$\\vec B(\\vec A\\cdot\\vec C) - \\vec C(\\vec A\\cdot\\vec B)$', '$\\vec C(\\vec A\\cdot\\vec B) - \\vec B(\\vec A\\cdot\\vec C)$', '$\\vec A(\\vec B\\cdot\\vec C) - \\vec C(\\vec A\\cdot\\vec B)$', '$(\\vec A\\times\\vec B)\\times\\vec C$'], answer: 0,
      sol: '"BAC minus CAB": $\\vec A\\times(\\vec B\\times\\vec C) = \\vec B(\\vec A\\cdot\\vec C) - \\vec C(\\vec A\\cdot\\vec B)$. The result lies in the plane of $\\vec B$ and $\\vec C$, because $\\vec B\\times\\vec C$ is perpendicular to that plane and crossing again brings it back into the plane.',
      trap: 'The cross product is not associative: $(\\vec A\\times\\vec B)\\times\\vec C$ lies in the plane of $\\vec A$ and $\\vec B$ instead.' },
    { id: 'va-019', type: 'nat', level: 3, exams: ['jam'], sub: 'vector triple product',
      q: 'For $\\vec A = (1, 0, 1)$, $\\vec B = (0, 1, 1)$ and $\\vec C = (1, 1, 0)$, the magnitude of $\\vec A\\times(\\vec B\\times\\vec C)$ is ______ (to three decimal places).',
      answer: 1.414, tol: 0.002, calc: () => norm(cross([1, 0, 1], cross([0, 1, 1], [1, 1, 0]))),
      sol: 'BAC minus CAB: $\\vec A\\cdot\\vec C = 1$ and $\\vec A\\cdot\\vec B = 1$, so the result is $\\vec B - \\vec C = (-1, 0, 1)$, of magnitude $\\sqrt2 = 1.414$. (Direct check: $\\vec B\\times\\vec C = (-1, 1, -1)$ and $(1, 0, 1)\\times(-1, 1, -1) = (-1, 0, 1)$.)',
      trap: 'Computing $(\\vec A\\times\\vec B)\\times\\vec C$ instead; here it gives $(-1, 1, 0)$, a different vector (by coincidence of the same length), because the cross product is not associative.' },
    { id: 'va-020', type: 'msq', level: 3, exams: ['jam', 'gate', 'net'], sub: 'index notation', format: 'statements',
      q: 'With the summation convention (repeated indices summed over 1, 2, 3), which statements are true?',
      options: ['$\\epsilon_{ijk}\\epsilon_{ijk} = 6$', '$\\epsilon_{ijk}\\delta_{ij} = 0$', '$\\epsilon_{123} = -\\epsilon_{213}$', '$\\epsilon_{ijk}\\epsilon_{imn} = \\delta_{jm}\\delta_{kn} + \\delta_{jn}\\delta_{km}$'], answer: [0, 1, 2],
      sol: 'Of the 27 index combinations, 6 are permutations of 123 with $\\epsilon = \\pm1$, so $\\sum\\epsilon_{ijk}^2 = 6$. $\\delta_{ij}$ sets $i = j$, and $\\epsilon$ vanishes when two indices are equal: $0$. Swapping two indices flips the sign: $\\epsilon_{213} = -1$. The contraction identity has a minus sign: $\\epsilon_{ijk}\\epsilon_{imn} = \\delta_{jm}\\delta_{kn} - \\delta_{jn}\\delta_{km}$; it is the index form of BAC-CAB.',
      trap: 'Remembering the $\\epsilon\\epsilon$ identity with a plus sign; test it with $j = k$, where the left side must vanish.' },
    { id: 'va-021', type: 'mcq', level: 3, exams: ['jam'], sub: 'Lagrange identity',
      q: 'Two vectors have $|\\vec A| = 5$, $|\\vec B| = 2$ and $|\\vec A\\times\\vec B| = 8$, and the angle between them is acute. The value of $\\vec A\\cdot\\vec B$ is',
      options: ['$6$', '$-6$', 'either $6$ or $-6$; it cannot be decided', '$2$'], answer: 0,
      sol: '$(\\vec A\\cdot\\vec B)^2 = A^2B^2 - |\\vec A\\times\\vec B|^2 = 100 - 64 = 36$. An acute angle means the dot product is positive: $6$.',
      trap: 'Without the word "acute" both $+6$ and $-6$ fit; the cross product only fixes $\\sin\\theta$.' },
    { id: 'va-022', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'reciprocal vectors',
      q: 'For non-coplanar $\\vec a$, $\\vec b$, $\\vec c$, the reciprocal vector is defined as $\\vec a^* = \\dfrac{\\vec b\\times\\vec c}{\\vec a\\cdot(\\vec b\\times\\vec c)}$. Which is true?',
      options: ['$\\vec a^*\\cdot\\vec a = 0$ and $\\vec a^*\\cdot\\vec b = 1$', '$\\vec a^*$ is parallel to $\\vec a$', '$\\vec a^*\\cdot\\vec a = 1$ and $\\vec a^*\\cdot\\vec b = \\vec a^*\\cdot\\vec c = 0$', '$|\\vec a^*| = 1/|\\vec a|$ always'], answer: 2,
      sol: '$\\vec a^*\\cdot\\vec a = \\dfrac{\\vec a\\cdot(\\vec b\\times\\vec c)}{\\vec a\\cdot(\\vec b\\times\\vec c)} = 1$. And $\\vec b\\times\\vec c$ is perpendicular to both $\\vec b$ and $\\vec c$, so $\\vec a^*\\cdot\\vec b = \\vec a^*\\cdot\\vec c = 0$. In general $\\vec a^*$ is not along $\\vec a$, and $|\\vec a^*| = 1/|\\vec a|$ only when $\\vec a$ is perpendicular to $\\vec b$ and $\\vec c$. These are the reciprocal lattice vectors of crystallography (up to $2\\pi$).',
      trap: 'Thinking the reciprocal vector points along the original one; that is only true for orthogonal axes.' },
    { id: 'va-023', type: 'nat', level: 3, exams: ['jam'], sub: 'angular momentum', unit: 'kg m²/s',
      q: 'A particle at $\\vec r = (1, 2, 0)$ m has momentum $\\vec p = (0, 1, 3)$ kg m/s. The magnitude of its angular momentum about the origin is ______ kg m$^2$/s (to two decimal places).',
      answer: 6.78, tol: 0.01, calc: () => norm(cross([1, 2, 0], [0, 1, 3])),
      sol: '$\\vec L = \\vec r\\times\\vec p = (2\\cdot3 - 0\\cdot1,\\ 0\\cdot0 - 1\\cdot3,\\ 1\\cdot1 - 2\\cdot0) = (6, -3, 1)$. $|\\vec L| = \\sqrt{36 + 9 + 1} = \\sqrt{46} = 6.78$.',
      trap: 'Getting the middle component wrong: it is $r_zp_x - r_xp_z$, in that order.' },
    { id: 'va-024', type: 'mcq', level: 3, exams: ['jam'], sub: 'triple product',
      q: 'If $[\\vec a\\ \\vec b\\ \\vec c] = \\vec a\\cdot(\\vec b\\times\\vec c) = 5$, then $[\\vec a + \\vec b\\ \\ \\vec b + \\vec c\\ \\ \\vec c + \\vec a]$ equals',
      options: ['$5$', '$0$', '$10$', '$15$'], answer: 2,
      sol: 'Expand by linearity. Every term with a repeated vector vanishes, leaving $[\\vec a\\,\\vec b\\,\\vec c] + [\\vec b\\,\\vec c\\,\\vec a]$. A cyclic shift does not change the triple product, so the total is $2\\times5 = 10$.',
      trap: 'Missing the second surviving term, or giving it a minus sign: $[\\vec b\\,\\vec c\\,\\vec a]$ is a cyclic (even) shift, so it equals $+[\\vec a\\,\\vec b\\,\\vec c]$.' },
    { id: 'va-025', type: 'nat', level: 3, exams: ['jam'], sub: 'lines',
      q: 'Line 1 passes through the origin along $(1, 1, 0)$; line 2 passes through $(1, 0, 3)$ along $(0, 1, 1)$. The shortest distance between them is ______ (to three decimal places).',
      answer: 2.309, tol: 0.002, calc: () => { const n = cross([1, 1, 0], [0, 1, 1]); return Math.abs(dot([1, 0, 3], n)) / norm(n); },
      sol: 'The common perpendicular is along $\\vec n = (1, 1, 0)\\times(0, 1, 1) = (1, -1, 1)$. Project the joining vector $(1, 0, 3)$ onto it: $d = \\dfrac{|(1, 0, 3)\\cdot(1, -1, 1)|}{\\sqrt3} = \\dfrac{4}{\\sqrt3} = 2.309$.',
      trap: 'Using the distance between the two given points (here $\\sqrt{10}$): those are not the closest points.' },
    { id: 'va-026', type: 'mcq', level: 3, exams: ['jam'], sub: 'angle between vectors',
      q: 'The angle between two body diagonals of a cube is',
      options: ['$\\cos^{-1}(1/3)$', '$\\cos^{-1}(1/\\sqrt3)$', '$\\cos^{-1}(2/3)$', '$90^\\circ$'], answer: 0,
      sol: 'Take diagonals $(1, 1, 1)$ and $(1, 1, -1)$. $\\cos\\theta = \\dfrac{1 + 1 - 1}{\\sqrt3\\sqrt3} = \\dfrac13$, so $\\theta = \\cos^{-1}(1/3)\\approx70.5^\\circ$ (the supplementary $109.5^\\circ$ is the tetrahedral bond angle).',
      trap: '$\\cos^{-1}(1/\\sqrt3)$ is the angle between a body diagonal and an edge.' },
    { id: 'va-027', type: 'msq', level: 3, exams: ['jam', 'gate'], sub: 'rotations', format: 'statements',
      q: 'The coordinate axes are rotated about the $z$-axis by an angle $\\alpha$. Which statements are true?',
      options: ['The components of a vector change.', 'The magnitude of every vector is unchanged.', 'The dot product of two vectors is unchanged.', 'The cross product of two vectors stops being perpendicular to them.'], answer: [0, 1, 2],
      sol: 'A rotation changes the components (by an orthogonal matrix), but lengths and angles, and so dot products, are invariant. The cross product of two vectors transforms as a vector under rotations and stays perpendicular to both.',
      trap: 'Confusing a change of description (new components) with a change of the vector itself.' },
    { id: 'va-028', type: 'nat', level: 3, exams: ['jam'], sub: 'projection',
      q: 'The magnitude of the part of $\\vec A = (3, 4, 0)$ perpendicular to the unit vector $\\hat n = (0, 0.6, 0.8)$ is ______ (to three decimal places).',
      answer: 4.386, tol: 0.002, calc: () => { const A = [3, 4, 0], n = [0, 0.6, 0.8], k = dot(A, n); return norm([A[0] - k * n[0], A[1] - k * n[1], A[2] - k * n[2]]); },
      sol: 'The parallel component is $\\vec A\\cdot\\hat n = 2.4$. By Pythagoras the perpendicular part has magnitude $\\sqrt{|\\vec A|^2 - 2.4^2} = \\sqrt{25 - 5.76} = \\sqrt{19.24} = 4.386$. (It also equals $|\\vec A\\times\\hat n|$.)',
      trap: 'Subtracting magnitudes ($5 - 2.4$) instead of squares.' },

    // ---------- level 4 ----------
    { id: 'va-029', type: 'mcq', level: 4, exams: ['jam', 'gate'], sub: 'vector identities',
      q: 'The expression $(\\vec A\\times\\vec B)\\cdot(\\vec C\\times\\vec D)$ equals',
      options: ['$(\\vec A\\cdot\\vec D)(\\vec B\\cdot\\vec C) - (\\vec A\\cdot\\vec C)(\\vec B\\cdot\\vec D)$', '$(\\vec A\\cdot\\vec C)(\\vec B\\cdot\\vec D) - (\\vec A\\cdot\\vec D)(\\vec B\\cdot\\vec C)$', '$(\\vec A\\cdot\\vec B)(\\vec C\\cdot\\vec D) - (\\vec A\\cdot\\vec C)(\\vec B\\cdot\\vec D)$', '$(\\vec A\\cdot\\vec C)(\\vec B\\cdot\\vec D) + (\\vec A\\cdot\\vec D)(\\vec B\\cdot\\vec C)$'], answer: 1,
      sol: 'Write it as $\\vec A\\cdot[\\vec B\\times(\\vec C\\times\\vec D)]$ (swap dot and cross in the triple product) and use BAC-CAB: $\\vec B\\times(\\vec C\\times\\vec D) = \\vec C(\\vec B\\cdot\\vec D) - \\vec D(\\vec B\\cdot\\vec C)$. Dotting with $\\vec A$ gives $(\\vec A\\cdot\\vec C)(\\vec B\\cdot\\vec D) - (\\vec A\\cdot\\vec D)(\\vec B\\cdot\\vec C)$. With $\\vec C = \\vec A$, $\\vec D = \\vec B$ it reduces to Lagrange\'s identity $|\\vec A\\times\\vec B|^2 = A^2B^2 - (\\vec A\\cdot\\vec B)^2$.',
      trap: 'Getting the overall sign backwards; the Lagrange identity check fixes it.' },
    { id: 'va-030', type: 'nat', level: 4, exams: ['jam'], sub: 'vector identities',
      q: 'For $\\vec A = \\hat i$, $\\vec B = \\hat j$, $\\vec C = \\hat i + \\hat j$ and $\\vec D = \\hat j + \\hat k$, the value of $(\\vec A\\times\\vec B)\\cdot(\\vec C\\times\\vec D)$ is ______.',
      answer: 1, tol: 0, calc: () => dot(cross([1, 0, 0], [0, 1, 0]), cross([1, 1, 0], [0, 1, 1])),
      sol: 'By the identity: $(\\vec A\\cdot\\vec C)(\\vec B\\cdot\\vec D) - (\\vec A\\cdot\\vec D)(\\vec B\\cdot\\vec C) = (1)(1) - (0)(1) = 1$. Directly: $\\vec A\\times\\vec B = \\hat k$ and $\\vec C\\times\\vec D = (1, -1, 1)$, whose $z$-component is $1$.',
      trap: 'Pairing $\\vec A$ with $\\vec B$ in the dot products (they are perpendicular, giving 0).' },
    { id: 'va-031', type: 'msq', level: 4, exams: ['jam', 'gate'], sub: 'polar and axial vectors', format: 'statements',
      q: 'Under a parity inversion ($\\vec r\\to-\\vec r$), which statements are true?',
      options: ['Angular momentum $\\vec L = \\vec r\\times\\vec p$ is an axial (pseudo) vector.', 'The magnetic field $\\vec B$ is an axial vector.', 'The electric field $\\vec E$ is an axial vector.', '$\\vec A\\cdot(\\vec B\\times\\vec C)$ of three polar vectors is a pseudoscalar.'], answer: [0, 1, 3],
      sol: 'Polar vectors ($\\vec r$, $\\vec p$, $\\vec E$, $\\vec F$) flip sign under inversion. The cross product of two polar vectors does not flip: $(-\\vec r)\\times(-\\vec p) = \\vec r\\times\\vec p$. That makes $\\vec L$ axial, and $\\vec B$ too (it appears in $\\vec F = q\\vec v\\times\\vec B$ with polar $\\vec F$ and $\\vec v$). $\\vec E$ is polar ($\\vec F = q\\vec E$). The triple product of three polar vectors changes sign: a pseudoscalar.',
      trap: 'Thinking a vector is axial because it is drawn going round in a circle; the test is how it behaves under inversion.' },
    { id: 'va-032', type: 'nat', level: 4, exams: ['jam'], sub: 'triple product',
      q: 'The volume of the tetrahedron with vertices $(0, 0, 0)$, $(1, 2, 0)$, $(0, 1, 3)$ and $(2, 0, 1)$ is ______ (to three decimal places).',
      answer: 2.167, tol: 0.002, calc: () => Math.abs(det3([1, 2, 0], [0, 1, 3], [2, 0, 1])) / 6,
      sol: 'The tetrahedron is one sixth of the parallelepiped on the same three edges: $V = \\tfrac16\\left|\\begin{vmatrix}1&2&0\\\\0&1&3\\\\2&0&1\\end{vmatrix}\\right| = \\tfrac16|1(1 - 0) - 2(0 - 6) + 0| = \\tfrac{13}{6} = 2.167$.',
      trap: 'Using $\\tfrac13$ or $\\tfrac12$ instead of $\\tfrac16$; a tetrahedron is a third of a prism, which is half a parallelepiped.' },
    { id: 'va-033', type: 'mcq', level: 4, exams: ['jam', 'gate'], sub: 'vector equations',
      q: 'Given non-zero $\\vec a$ and $\\vec b$ with $\\vec a\\cdot\\vec b = 0$, every solution of $\\vec x\\times\\vec a = \\vec b$ is (with $\\lambda$ any real number)',
      options: ['$\\vec x = \\dfrac{\\vec b\\times\\vec a}{a^2} + \\lambda\\vec a$', '$\\vec x = \\dfrac{\\vec a\\times\\vec b}{a^2} + \\lambda\\vec b$', '$\\vec x = \\dfrac{\\vec b}{a} + \\lambda\\vec a$', '$\\vec x = \\dfrac{\\vec a\\times\\vec b}{a^2} + \\lambda\\vec a$'], answer: 3,
      sol: 'Check: $\\dfrac{(\\vec a\\times\\vec b)\\times\\vec a}{a^2} = \\dfrac{-\\vec a\\times(\\vec a\\times\\vec b)}{a^2} = \\dfrac{-[\\vec a(\\vec a\\cdot\\vec b) - \\vec b\\,a^2]}{a^2} = \\vec b$, using $\\vec a\\cdot\\vec b = 0$. Adding any multiple of $\\vec a$ changes nothing, since $\\vec a\\times\\vec a = 0$. The condition $\\vec a\\cdot\\vec b = 0$ is needed because $\\vec x\\times\\vec a$ is always perpendicular to $\\vec a$.',
      trap: 'The order $\\vec b\\times\\vec a$ gives $-\\vec b$; and the free part must be along $\\vec a$, not $\\vec b$.' },
    { id: 'va-034', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'reciprocal vectors',
      q: 'For $\\vec a = (2, 0, 0)$, $\\vec b = (1, 1, 0)$ and $\\vec c = (0, 0, 3)$, the reciprocal vector $\\vec a^* = \\dfrac{\\vec b\\times\\vec c}{\\vec a\\cdot(\\vec b\\times\\vec c)}$ has magnitude ______ (to three decimal places).',
      answer: 0.707, tol: 0.002, calc: () => { const bc = cross([1, 1, 0], [0, 0, 3]); return norm(bc) / dot([2, 0, 0], bc); },
      sol: '$\\vec b\\times\\vec c = (1\\cdot3 - 0,\\ 0 - 1\\cdot3,\\ 0) = (3, -3, 0)$, and $\\vec a\\cdot(\\vec b\\times\\vec c) = 6$. So $\\vec a^* = (0.5, -0.5, 0)$, of magnitude $0.707$. Check: $\\vec a^*\\cdot\\vec a = 1$, $\\vec a^*\\cdot\\vec b = 0$. It is not $1/|\\vec a| = 0.5$, because $\\vec a$ is not perpendicular to $\\vec b$.',
      trap: 'Assuming $|\\vec a^*| = 1/|\\vec a|$ as for orthogonal axes.' },
    { id: 'va-035', type: 'mcq', level: 4, exams: ['jam'], sub: 'Lorentz force',
      q: 'An electron moves along $+x$ in a uniform magnetic field along $+y$. The magnetic force on it points along',
      options: ['$+z$', '$+y$', 'nowhere: the force is zero', '$-z$'], answer: 3,
      sol: '$\\vec F = q\\vec v\\times\\vec B$ with $\\vec v\\times\\vec B$ along $\\hat i\\times\\hat j = \\hat k$. The electron\'s charge is negative, so $\\vec F$ is along $-\\hat k$.',
      trap: 'Forgetting that the electron is negative gives $+z$.' },
    { id: 'va-040', type: 'mcq', level: 4, exams: ['jam', 'gate'], sub: 'triple product',
      q: 'If $[\\vec a\\ \\vec b\\ \\vec c] = 3$, then $[\\vec a\\times\\vec b\\ \\ \\vec b\\times\\vec c\\ \\ \\vec c\\times\\vec a]$ equals',
      options: ['$3$', '$9$', '$27$', '$6$'], answer: 1,
      sol: 'Use $(\\vec b\\times\\vec c)\\times(\\vec c\\times\\vec a) = \\vec c\\,[\\vec b\\,\\vec c\\,\\vec a] - \\vec a\\,[\\vec b\\,\\vec c\\,\\vec c] = \\vec c\\,[\\vec a\\,\\vec b\\,\\vec c]$. Then $(\\vec a\\times\\vec b)\\cdot\\vec c\\,[\\vec a\\,\\vec b\\,\\vec c] = [\\vec a\\,\\vec b\\,\\vec c]^2 = 9$. (In matrix language: the cofactor matrix has determinant $\\det^2$ in three dimensions.)',
      trap: 'Guessing $\\det^3 = 27$ by counting three cross products.' },

    // ---------- level 5 ----------
    { id: 'va-036', type: 'nat', level: 5, exams: ['jam', 'gate'], sub: 'triple product',
      q: 'Three unit vectors make an angle of $60^\\circ$ with each other in pairs. The volume of the parallelepiped they span is ______ (to three decimal places).',
      answer: 0.707, tol: 0.002, calc: () => Math.sqrt(1 - 3 * 0.25 + 2 * 0.125),
      sol: 'The square of the triple product is the Gram determinant of the dot products: $[\\vec a\\,\\vec b\\,\\vec c]^2 = \\begin{vmatrix}1 & 1/2 & 1/2\\\\1/2 & 1 & 1/2\\\\1/2 & 1/2 & 1\\end{vmatrix} = 1(1 - \\tfrac14) - \\tfrac12(\\tfrac12 - \\tfrac14) + \\tfrac12(\\tfrac14 - \\tfrac12) = \\tfrac34 - \\tfrac18 - \\tfrac18 = \\tfrac12$. Volume $= 1/\\sqrt2 = 0.707$. (These are three edges of a regular tetrahedron from one corner, whose volume is $\\tfrac16$ of this: $\\sqrt2/12$.)',
      trap: 'Taking the volume as $\\sin^2 60^\\circ$ or $\\sin^3 60^\\circ$: there is no simple product rule for non-perpendicular edges.' },
    { id: 'va-037', type: 'mcq', level: 5, exams: ['jam', 'gate'], sub: 'vector identities',
      q: 'For any vectors, $\\vec A\\times(\\vec B\\times\\vec C) + \\vec B\\times(\\vec C\\times\\vec A) + \\vec C\\times(\\vec A\\times\\vec B)$ equals',
      options: ['$\\vec A\\times\\vec B + \\vec B\\times\\vec C + \\vec C\\times\\vec A$', '$\\vec 0$', '$2\\,\\vec A\\times(\\vec B\\times\\vec C)$', '$(\\vec A\\cdot\\vec B)\\vec C + (\\vec B\\cdot\\vec C)\\vec A + (\\vec C\\cdot\\vec A)\\vec B$'], answer: 1,
      sol: 'Expand each with BAC-CAB: $\\vec B(\\vec A\\cdot\\vec C) - \\vec C(\\vec A\\cdot\\vec B) + \\vec C(\\vec B\\cdot\\vec A) - \\vec A(\\vec B\\cdot\\vec C) + \\vec A(\\vec C\\cdot\\vec B) - \\vec B(\\vec C\\cdot\\vec A)$. Every term cancels with another: the sum is $\\vec 0$. This is the Jacobi identity; the same structure appears in commutators of angular momentum operators.',
      trap: 'Expecting the three terms to add up because they look alike; they cancel in pairs.' },
    { id: 'va-038', type: 'msq', level: 5, exams: ['jam', 'gate'], sub: 'rotation', format: 'statements',
      q: 'A rigid body spins with angular velocity $\\vec\\omega$ about an axis through the origin, so a point at $\\vec r$ has velocity $\\vec v = \\vec\\omega\\times\\vec r$. Which statements are true?',
      options: ['$\\vec v$ is perpendicular to $\\vec\\omega$ at every point.', 'The field $\\vec v(\\vec r)$ has zero divergence.', 'The kinetic energy of a point mass $m$ is $\\tfrac12m\\left[\\omega^2r^2 - (\\vec\\omega\\cdot\\vec r)^2\\right]$.', '$|\\vec v| = \\omega r$ at every point.'], answer: [0, 1, 2],
      sol: 'A cross product is perpendicular to both factors. $\\nabla\\cdot(\\vec\\omega\\times\\vec r) = \\vec r\\cdot(\\nabla\\times\\vec\\omega) - \\vec\\omega\\cdot(\\nabla\\times\\vec r) = 0$, since $\\vec\\omega$ is constant and $\\nabla\\times\\vec r = 0$. By Lagrange\'s identity $|\\vec\\omega\\times\\vec r|^2 = \\omega^2r^2 - (\\vec\\omega\\cdot\\vec r)^2$. The speed is $\\omega r\\sin\\theta$, the distance from the axis times $\\omega$, not $\\omega r$ unless $\\vec r\\perp\\vec\\omega$.',
      trap: 'Using the distance from the origin instead of the distance from the axis.' },
    { id: 'va-039', type: 'nat', level: 5, exams: ['jam'], sub: 'angle between vectors', unit: '°',
      q: 'Two vectors satisfy $\\vec A\\cdot\\vec B = 5$ and $\\vec A\\times\\vec B = \\hat i + 2\\hat j + 2\\hat k$. The angle between them is ______ degrees (to one decimal place).',
      answer: 31.0, tol: 0.1, calc: () => Math.atan2(3, 5) * DEG,
      sol: '$|\\vec A\\times\\vec B| = AB\\sin\\theta = \\sqrt{1 + 4 + 4} = 3$ and $AB\\cos\\theta = 5$. Dividing: $\\tan\\theta = 3/5$, so $\\theta = 31.0^\\circ$. The magnitudes are not needed (only $AB = \\sqrt{34}$ is fixed).',
      trap: 'Trying to find $A$ and $B$ separately: the data fix only their product.' },
    { id: 'va-041', type: 'msq', level: 2, exams: ['jam'], sub: 'unit vectors', format: 'multi',
      q: 'Which of these are unit vectors (for every value of the angles)?',
      options: ['$(\\hat i + \\hat j)/\\sqrt2$', '$(\\hat i + \\hat j + \\hat k)/3$', '$0.6\\,\\hat i + 0.8\\,\\hat j$', '$\\sin\\theta\\cos\\phi\\,\\hat i + \\sin\\theta\\sin\\phi\\,\\hat j + \\cos\\theta\\,\\hat k$'], answer: [0, 2, 3],
      sol: 'Check the length. $(1 + 1)/2 = 1$: unit. $(1 + 1 + 1)/9 = 1/3$: length $1/\\sqrt3$, not unit (it should be divided by $\\sqrt3$). $0.36 + 0.64 = 1$: unit. $\\sin^2\\theta(\\cos^2\\phi + \\sin^2\\phi) + \\cos^2\\theta = 1$: unit; it is $\\hat r$ in spherical coordinates.',
      trap: 'Dividing by the sum of the components instead of the square root of the sum of their squares.' },
    { id: 'va-042', type: 'msq', level: 3, exams: ['jam'], sub: 'planes', format: 'statements',
      q: 'A plane passes through $(1, 0, 0)$, $(0, 1, 0)$ and $(0, 0, 1)$. Which statements are correct?',
      options: ['Its equation is $x + y + z = 1$.', 'It contains the point $(1, 1, 1)$.', 'Its distance from the origin is $1/\\sqrt3$.', 'The vector $(1, -1, 0)$ is parallel to the plane.'], answer: [0, 2, 3],
      sol: 'The edge vectors $(-1, 1, 0)$ and $(-1, 0, 1)$ have cross product $(1, 1, 1)$, the normal. Through $(1, 0, 0)$: $x + y + z = 1$. The point $(1, 1, 1)$ gives $3\\ne1$: not on it. Distance from the origin: $|0 - 1|/\\sqrt3 = 1/\\sqrt3$. $(1, -1, 0)\\cdot(1, 1, 1) = 0$, so it is perpendicular to the normal, that is, parallel to the plane.',
      trap: 'Confusing the normal $(1, 1, 1)$ with a point on the plane.' },
  ],
  gens: [
    { id: 'va-g01', type: 'nat', level: 1, exams: ['jam'], sub: 'dot product',
      make(r) {
        const a = vec(r, -5, 5), b = vec(r, -5, 5);
        return { q: `For $\\vec A = ${tv(a)}$ and $\\vec B = ${tv(b)}$, the dot product $\\vec A\\cdot\\vec B$ is ______.`,
          answer: dot(a, b), tol: 0, a, b,
          sol: `$${a[0]}\\cdot(${b[0]}) + ${a[1]}\\cdot(${b[1]}) + ${a[2]}\\cdot(${b[2]}) = ${a[0] * b[0]} + (${a[1] * b[1]}) + (${a[2] * b[2]}) = ${dot(a, b)}$.`,
          trap: 'Watch the signs of negative components.' };
      },
      verify: (p) => dot(p.a, p.b) },
    { id: 'va-g02', type: 'nat', level: 2, exams: ['jam'], sub: 'angle between vectors', unit: '°',
      make(r) {
        let a = vec(r), b = vec(r);
        if (norm(a) === 0) a = [1, 2, 2];
        if (norm(b) === 0) b = [2, -1, 2];
        const c = dot(a, b) / (norm(a) * norm(b));
        const th = Math.acos(Math.max(-1, Math.min(1, c))) * DEG;
        return { q: `The angle between $${tv(a)}$ and $${tv(b)}$ is ______ degrees (to one decimal place).`,
          answer: round(th, 1), tol: 0.1, unit: '°', a, b,
          sol: `$\\cos\\theta = \\dfrac{${dot(a, b)}}{\\sqrt{${dot(a, a)}}\\sqrt{${dot(b, b)}}} = ${round(c, 5)}$, so $\\theta = ${round(th, 1)}^\\circ$.`,
          trap: 'A negative dot product means an obtuse angle; do not drop its sign.' };
      },
      verify: (p) => Math.acos(Math.max(-1, Math.min(1, dot(p.a, p.b) / (norm(p.a) * norm(p.b))))) * DEG },
    { id: 'va-g03', type: 'nat', level: 2, exams: ['jam'], sub: 'area',
      make(r) {
        let a = vec(r), b = vec(r);
        if (norm(cross(a, b)) === 0) { a = [1, 2, 0]; b = [0, 1, 3]; }
        const c = cross(a, b), A = norm(c) / 2;
        return { q: `A triangle has two sides along $\\vec a = ${tv(a)}$ and $\\vec b = ${tv(b)}$ from a common corner. Its area is ______ (to two decimal places).`,
          answer: round(A, 2), tol: 0.01, a, b,
          sol: `$\\vec a\\times\\vec b = ${tv(c)}$, of length $\\sqrt{${dot(c, c)}} = ${round(norm(c), 4)}$. The triangle is half the parallelogram: $${round(A, 2)}$.`,
          trap: 'Forgetting the half.' };
      },
      verify: (p) => norm(cross(p.a, p.b)) / 2 },
    { id: 'va-g04', type: 'nat', level: 3, exams: ['jam'], sub: 'triple product',
      make(r) {
        let a = vec(r, -3, 3), b = vec(r, -3, 3), c = vec(r, -3, 3);
        if (det3(a, b, c) === 0) { a = [1, 0, 2]; b = [0, 2, 1]; c = [1, 1, 3]; }
        const V = Math.abs(det3(a, b, c));
        return { q: `The volume of the parallelepiped with edges $${tv(a)}$, $${tv(b)}$ and $${tv(c)}$ is ______.`,
          answer: V, tol: 0, a, b, c,
          sol: `$V = |\\vec a\\cdot(\\vec b\\times\\vec c)|$. Here $\\vec b\\times\\vec c = ${tv(cross(b, c))}$ and $\\vec a\\cdot(\\vec b\\times\\vec c) = ${det3(a, b, c)}$, so $V = ${V}$.`,
          trap: 'A volume is the absolute value of the triple product.' };
      },
      verify: (p) => Math.abs(det3(p.a, p.b, p.c)) },
    { id: 'va-g05', type: 'nat', level: 3, exams: ['jam'], sub: 'planes',
      make(r) {
        let n = vec(r, -3, 3);
        if (norm(n) === 0) n = [1, 2, 2];
        const P = vec(r, -3, 3), d = int(r, -10, 10);
        const D = Math.abs(dot(n, P) - d) / norm(n);
        const plane = `${n[0]}x ${n[1] < 0 ? '-' : '+'} ${Math.abs(n[1])}y ${n[2] < 0 ? '-' : '+'} ${Math.abs(n[2])}z = ${d}`;
        return { q: `The distance of the point $${tv(P)}$ from the plane $${plane}$ is ______ (to three decimal places).`,
          answer: round(D, 3), tol: 0.002, n, P, d,
          sol: `$D = \\dfrac{|${n[0]}(${P[0]}) + (${n[1]})(${P[1]}) + (${n[2]})(${P[2]}) - (${d})|}{\\sqrt{${dot(n, n)}}} = \\dfrac{${Math.abs(dot(n, P) - d)}}{${round(norm(n), 4)}} = ${round(D, 3)}$.`,
          trap: 'Divide by the length of the normal vector, not by the constant on the right.' };
      },
      verify: (p) => Math.abs(dot(p.n, p.P) - p.d) / norm(p.n) },
    { id: 'va-g06', type: 'mcq', level: 2, exams: ['jam'], sub: 'cross product',
      make(r) {
        let a = vec(r, -3, 3), b = vec(r, -3, 3);
        if (norm(cross(a, b)) === 0) { a = [1, 2, 0]; b = [0, 1, 3]; }
        const c = cross(a, b), show = (v) => `$${tv(v)}$`;
        const o = mcqOptions(r, c, [c.map((x) => -x), [a[1] * b[2] + a[2] * b[1], a[2] * b[0] + a[0] * b[2], a[0] * b[1] + a[1] * b[0]], [c[0], -c[1], c[2]], [a[0] * b[0], a[1] * b[1], a[2] * b[2]], [c[1], c[0], c[2]], [-c[0], c[1], -c[2]], [c[0] + 1, c[1], c[2] - 1], [c[0] - 2, c[1] + 1, c[2]]], show);
        return { q: `For $\\vec a = ${tv(a)}$ and $\\vec b = ${tv(b)}$, the cross product $\\vec a\\times\\vec b$ is`, ...o,
          sol: `$\\vec a\\times\\vec b = (a_yb_z - a_zb_y,\\ a_zb_x - a_xb_z,\\ a_xb_y - a_yb_x) = ${tv(c)}$. Check: it is perpendicular to both, $${dot(c, a)} = ${dot(c, b)} = 0$.`,
          trap: 'The middle component is $a_zb_x - a_xb_z$; the reversed order flips its sign.' };
      } },
    { id: 'va-g07', type: 'nat', level: 3, exams: ['jam'], sub: 'coplanarity',
      make(r) {
        let a = vec(r, -3, 3), b = vec(r, -3, 3);
        let coef = a[0] * b[1] - a[1] * b[0];
        if (coef === 0) { a = [1, 2, 3]; b = [2, -1, 1]; coef = a[0] * b[1] - a[1] * b[0]; }
        const c0 = int(r, -3, 3), c1 = int(r, -3, 3);
        // det(a, b, (c0, c1, k)) = c0 (a1 b2 - a2 b1) - c1 (a0 b2 - a2 b0) + k (a0 b1 - a1 b0)
        const rest = c0 * (a[1] * b[2] - a[2] * b[1]) - c1 * (a[0] * b[2] - a[2] * b[0]);
        const k = -rest / coef;
        return { q: `The vectors $${tv(a)}$, $${tv(b)}$ and $(${c0}, ${c1}, k)$ are coplanar when $k$ equals ______ (to three decimal places).`,
          answer: round(k, 3), tol: 0.002, a, b, c0, c1,
          sol: `Coplanar means $\\det = 0$. Expanding along the third row: $${c0}(${a[1] * b[2] - a[2] * b[1]}) - (${c1})(${a[0] * b[2] - a[2] * b[0]}) + k(${coef}) = 0$, so $${rest} + ${coef}k = 0$ and $k = ${round(k, 3)}$.`,
          trap: 'The middle term of a cofactor expansion carries a minus sign.' };
      },
      verify: (p) => { // solve det = 0 numerically by linearity in k
        const f = (k) => det3(p.a, p.b, [p.c0, p.c1, k]);
        const f0 = f(0), f1 = f(1); return -f0 / (f1 - f0); } },
    { id: 'va-g08', type: 'nat', level: 4, exams: ['jam'], sub: 'lines',
      make(r) {
        let d1 = vec(r, -2, 2), d2 = vec(r, -2, 2);
        if (norm(cross(d1, d2)) === 0) { d1 = [1, 1, 0]; d2 = [0, 1, 1]; }
        const P = vec(r, -3, 3), n = cross(d1, d2);
        const D = Math.abs(dot(P, n)) / norm(n);
        return { q: `Line 1 passes through the origin along $${tv(d1)}$; line 2 passes through $${tv(P)}$ along $${tv(d2)}$. The shortest distance between the lines is ______ (to three decimal places).`,
          answer: round(D, 3), tol: 0.002, d1, d2, P,
          sol: `The common perpendicular is along $\\vec n = ${tv(d1)}\\times${tv(d2)} = ${tv(n)}$. Then $D = \\dfrac{|${tv(P)}\\cdot${tv(n)}|}{|\\vec n|} = \\dfrac{${Math.abs(dot(P, n))}}{\\sqrt{${dot(n, n)}}} = ${round(D, 3)}$.${D === 0 ? ' The distance is zero: the lines meet.' : ''}`,
          trap: 'The distance between the two given points is not the shortest distance.' };
      },
      verify: (p) => { // minimise |P + s d2 - t d1| by solving the 2x2 normal equations
        const a = dot(p.d1, p.d1), b = dot(p.d1, p.d2), c = dot(p.d2, p.d2), e = dot(p.d1, p.P), f = dot(p.d2, p.P);
        const den = a * c - b * b, t = (e * c - b * f) / den, s = (b * e - a * f) / den;
        const w = [0, 1, 2].map((i) => p.P[i] + s * p.d2[i] - t * p.d1[i]); return norm(w); } },
  ],
};
