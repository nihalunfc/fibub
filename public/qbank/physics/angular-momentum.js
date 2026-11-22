// Orbital angular momentum: commutation relations, L² and Lz eigenvalues, ladder operators L±, matrices for l = 1,
// spherical harmonics, the vector model, expectation values and uncertainties of Lx and Ly, rigid rotors,
// rotations and the d-matrix, and central potentials.
// Original questions for GATE and CSIR NET practice (fibub). Levels: 1 warm-up ... 5 top rank.
import { int, choose, mcqOptions, round } from '../_util.js';

const lp = (l, m) => Math.sqrt(l * (l + 1) - m * (m + 1));

export default {
  topic: 'angular-momentum',
  items: [
    // ---------- level 1 ----------
    { id: 'qam-001', type: 'mcq', level: 1, exams: ['gate', 'net', 'jam'], sub: 'eigenvalues',
      q: 'The eigenvalues of $\\hat L^2$ are',
      options: ['$l(l+1)\\hbar^2$, $l = 0, 1, 2, \\dots$', '$l^2\\hbar^2$, $l = 0, 1, 2, \\dots$', '$(l + \\tfrac12)^2\\hbar^2$, $l = 0, 1, 2, \\dots$', '$l(l+1)\\hbar$, $l = 0, 1, 2, \\dots$'], answer: 0,
      sol: 'From the ladder algebra, $L^2 = L_-L_+ + L_z^2 + \\hbar L_z$; acting on the top state $|l, l\\rangle$ (where $L_+$ gives zero) this is $(l^2 + l)\\hbar^2$. For orbital angular momentum $l$ is a non-negative integer.',
      trap: '$l^2\\hbar^2$ is the Bohr-model guess; the extra $l\\hbar^2$ is the reason $|\\vec L|$ always exceeds the largest $L_z$.' },
    { id: 'qam-002', type: 'mcq', level: 1, exams: ['gate', 'net', 'jam'], sub: 'commutators',
      q: 'The commutator $[\\hat L_x, \\hat L_y]$ equals',
      options: ['$0$', '$-i\\hbar\\hat L_z$', '$i\\hbar\\hat L_z$', '$\\hbar\\hat L_z$'], answer: 2,
      sol: 'With $\\vec L = \\vec r\\times\\vec p$ and $[x_i, p_j] = i\\hbar\\delta_{ij}$: $[L_x, L_y] = [yp_z - zp_y, zp_x - xp_z] = y[p_z, z]p_x + x[z, p_z]p_y = i\\hbar(xp_y - yp_x) = i\\hbar L_z$. Cyclic: $[L_i, L_j] = i\\hbar\\epsilon_{ijk}L_k$.' },
    { id: 'qam-003', type: 'mcq', level: 1, exams: ['gate', 'net', 'jam'], sub: 'eigenvalues',
      q: 'For $l = 2$, the number of possible values of $m$ is',
      options: ['$2$', '$3$', '$4$', '$5$'], answer: 3,
      sol: '$m = -l, -l+1, \\dots, l$, so $2l + 1 = 5$ values: $-2, -1, 0, 1, 2$.' },
    { id: 'qam-004', type: 'mcq', level: 1, exams: ['gate', 'net', 'jam'], sub: 'operators',
      q: 'In spherical polar coordinates, $\\hat L_z$ is',
      options: ['$-i\\hbar\\,\\partial/\\partial\\theta$', '$i\\hbar\\,\\partial/\\partial\\phi$', '$-\\hbar^2\\,\\partial^2/\\partial\\phi^2$', '$-i\\hbar\\,\\partial/\\partial\\phi$'], answer: 3,
      sol: '$\\phi$ is the angle of rotation about $z$, and $L_z$ generates those rotations: $\\hat L_z = -i\\hbar\\,\\partial/\\partial\\phi$, with eigenfunctions $e^{im\\phi}$. The third option is $L_z^2$.' },
    { id: 'qam-005', type: 'nat', level: 1, exams: ['gate', 'net', 'jam'], sub: 'eigenvalues',
      q: 'The magnitude of the orbital angular momentum for $l = 1$ is $k\\hbar$, with $k =$ ______ (to three decimal places).',
      answer: 1.414, tol: 0.002, calc: () => Math.SQRT2,
      sol: '$|\\vec L| = \\sqrt{l(l+1)}\\,\\hbar = \\sqrt2\\,\\hbar = 1.414\\hbar$.' },
    { id: 'qam-006', type: 'msq', level: 1, exams: ['gate', 'net'], sub: 'commutators',
      q: 'Which commutators are correct?',
      options: ['$[\\hat L_x, \\hat L_y] = 0$', '$[\\hat L^2, \\hat L_z] = 0$', '$[\\hat L_z, \\hat x] = i\\hbar\\hat y$', '$[\\hat L^2, \\hat L_x] = 0$'], answer: [1, 2, 3],
      sol: '$L^2$ commutes with every component. $[L_z, x] = [xp_y - yp_x, x] = -y[p_x, x] = i\\hbar y$. The components do not commute with each other: $[L_x, L_y] = i\\hbar L_z$.' },

    // ---------- level 2 ----------
    { id: 'qam-007', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'ladder operators',
      q: '$\\hat L_+|2, 0\\rangle = k\\hbar\\,|2, 1\\rangle$. The value of $k$ is ______ (to three decimal places).',
      answer: 2.449, tol: 0.002, calc: () => lp(2, 0),
      sol: '$L_+|l, m\\rangle = \\hbar\\sqrt{l(l+1) - m(m+1)}\\,|l, m+1\\rangle = \\hbar\\sqrt{6 - 0}\\,|2,1\\rangle$, so $k = \\sqrt6 = 2.449$.' },
    { id: 'qam-008', type: 'nat', level: 2, exams: ['gate', 'net', 'jam'], sub: 'vector model',
      q: 'In the vector model, the smallest possible angle between $\\vec L$ and the $z$-axis for $l = 2$ is ______ degrees (to one decimal place).',
      answer: 35.3, tol: 0.1, calc: () => Math.acos(2 / Math.sqrt(6)) * 180 / Math.PI,
      sol: '$\\cos\\theta = m/\\sqrt{l(l+1)}$ is largest for $m = l = 2$: $\\cos\\theta = 2/\\sqrt6 = 0.816$, $\\theta = 35.3^\\circ$. $\\vec L$ can never point exactly along $z$, because then $L_x$ and $L_y$ would both be zero too.' },
    { id: 'qam-009', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'spherical harmonics',
      q: 'The spherical harmonic $Y_{10}(\\theta, \\phi)$ is proportional to',
      options: ['$\\sin\\theta\\,e^{i\\phi}$', '$\\cos\\theta$', '$1$', '$3\\cos^2\\theta - 1$'], answer: 1,
      sol: '$Y_{10} = \\sqrt{3/4\\pi}\\cos\\theta \\propto z/r$. It has $m = 0$ (no $\\phi$ dependence) and $l = 1$ (odd parity). $\\sin\\theta e^{i\\phi}$ is $Y_{11}$ (up to sign), $1$ is $Y_{00}$, and $3\\cos^2\\theta - 1$ is $Y_{20}$.' },
    { id: 'qam-010', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'spherical harmonics',
      q: 'Under parity $\\vec r \\to -\\vec r$ (i.e. $\\theta \\to \\pi - \\theta$, $\\phi \\to \\phi + \\pi$), $Y_{lm}$ is multiplied by',
      options: ['$(-1)^l$', '$(-1)^m$', '$(-1)^{l+m}$', '$1$ always'], answer: 0,
      sol: '$r^lY_{lm}$ is a homogeneous polynomial of degree $l$ in $x, y, z$, so it changes by $(-1)^l$ when $\\vec r \\to -\\vec r$. This gives the electric dipole rule $\\Delta l = \\pm1$.',
      trap: '$(-1)^m$ comes from $\\phi \\to \\phi + \\pi$ alone; $\\theta \\to \\pi - \\theta$ adds $(-1)^{l-m}$, giving $(-1)^l$ in total.' },
    { id: 'qam-011', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'expectation values',
      q: 'In the state $|l = 2, m = 1\\rangle$, $\\langle L_x^2\\rangle = k\\hbar^2$. The value of $k$ is ______ (to one decimal place).',
      answer: 2.5, tol: 0.01, calc: () => (6 - 1) / 2,
      sol: 'By symmetry about $z$, $\\langle L_x^2\\rangle = \\langle L_y^2\\rangle = \\tfrac12\\left(\\langle L^2\\rangle - \\langle L_z^2\\rangle\\right) = \\tfrac{\\hbar^2}{2}(6 - 1) = 2.5\\hbar^2$.' },
    { id: 'qam-012', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'matrices',
      q: 'For $l = 1$, in the basis $|1,1\\rangle, |1,0\\rangle, |1,-1\\rangle$, the matrix of $\\hat L_x$ is',
      options: ['$\\dfrac{\\hbar}{2}\\begin{pmatrix}0&1&0\\\\1&0&1\\\\0&1&0\\end{pmatrix}$', '$\\dfrac{\\hbar}{\\sqrt2}\\begin{pmatrix}0&-i&0\\\\i&0&-i\\\\0&i&0\\end{pmatrix}$', '$\\hbar\\begin{pmatrix}1&0&0\\\\0&0&0\\\\0&0&-1\\end{pmatrix}$', '$\\dfrac{\\hbar}{\\sqrt2}\\begin{pmatrix}0&1&0\\\\1&0&1\\\\0&1&0\\end{pmatrix}$'], answer: 3,
      sol: '$L_x = \\tfrac12(L_+ + L_-)$. For $l = 1$, $L_+|1,0\\rangle = \\sqrt2\\hbar|1,1\\rangle$ and $L_+|1,-1\\rangle = \\sqrt2\\hbar|1,0\\rangle$, so the off-diagonal entries of $L_x$ are $\\tfrac12\\sqrt2\\hbar = \\hbar/\\sqrt2$. The second matrix is $L_y$ and the third is $L_z$. Check: the eigenvalues of the correct matrix are $\\hbar, 0, -\\hbar$.' },
    { id: 'qam-013', type: 'mcq', level: 2, exams: ['gate', 'net', 'jam'], sub: 'rigid rotor',
      q: 'For a rigid rotor $H = \\hat L^2/2I$, the ratio of the energy of the level $l = 3$ to that of $l = 1$ is',
      options: ['$3$', '$9$', '$4$', '$6$'], answer: 3,
      sol: '$E_l = \\hbar^2l(l+1)/2I$, so $E_3/E_1 = 12/2 = 6$.',
      trap: 'Using $l^2$ (Bohr-like) gives 9.' },
    { id: 'qam-014', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'spherical harmonics',
      q: '$Y_{11}(\\theta, \\phi)$ is an eigenfunction of',
      options: ['$L^2$ only', '$L_x$ and $L_y$', '$L^2$ and $L_z$, but not $L_x$', '$L^2$, $L_x$, $L_y$ and $L_z$'], answer: 2,
      sol: '$Y_{lm}$ are the common eigenfunctions of $L^2$ (eigenvalue $l(l+1)\\hbar^2$) and $L_z$ ($m\\hbar$). They cannot also be eigenfunctions of $L_x$ unless $l = 0$, because $L_x$ does not commute with $L_z$.' },
    { id: 'qam-015', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'operators',
      q: 'Which functions are eigenfunctions of $\\hat L_z = -i\\hbar\\,\\partial/\\partial\\phi$?',
      options: ['$\\cos\\phi$', '$e^{2i\\phi}$', '$\\sin\\theta\\,e^{i\\phi}$', '$\\sin^2\\theta\\,e^{-2i\\phi}$'], answer: [1, 2, 3],
      sol: 'Any $f(\\theta)e^{im\\phi}$ is an eigenfunction with eigenvalue $m\\hbar$. $\\cos\\phi = \\tfrac12(e^{i\\phi} + e^{-i\\phi})$ mixes $m = \\pm1$: a measurement of $L_z$ gives $\\pm\\hbar$ with equal probability.' },
    { id: 'qam-016', type: 'mcq', level: 2, exams: ['gate', 'net', 'jam'], sub: 'eigenvalues',
      q: 'A particle is in a state with $\\langle L^2\\rangle = 12\\hbar^2$ and zero spread in $L^2$. Its orbital quantum number is',
      options: ['$l = 2$', '$l = 3$', '$l = 12$', '$l = \\sqrt{12}$'], answer: 1,
      sol: '$l(l+1) = 12$ gives $l = 3$. The value $\\sqrt{12}\\hbar = 3.46\\hbar$ is the magnitude $|\\vec L|$, not $l$.' },
    { id: 'qam-028', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'operators',
      q: 'The function $\\sin^3\\theta\\,e^{3i\\phi}$ is an eigenfunction of $\\hat L_z$ with eigenvalue',
      options: ['$\\hbar$', '$3\\hbar$', '$-3\\hbar$', '$9\\hbar$'], answer: 1,
      sol: '$-i\\hbar\\,\\partial_\\phi e^{3i\\phi} = 3\\hbar\\,e^{3i\\phi}$. (It is $Y_{33}$ up to a constant, so also $L^2 = 12\\hbar^2$.) $9\\hbar^2$ is the eigenvalue of $L_z^2$.' },

    // ---------- level 3 ----------
    { id: 'qam-017', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'expectation values',
      q: 'For $\\psi = \\dfrac{1}{\\sqrt6}\\left(Y_{11} + 2Y_{10} + Y_{1,-1}\\right)$, $\\langle L_z^2\\rangle = k\\hbar^2$ with $k =$ ______ (to three decimal places).',
      answer: 0.333, tol: 0.002, calc: () => (1 + 1) / 6,
      sol: 'Probabilities of $m = 1, 0, -1$: $\\tfrac16, \\tfrac46, \\tfrac16$. $\\langle L_z^2\\rangle = \\hbar^2\\left(\\tfrac16\\cdot1 + \\tfrac46\\cdot0 + \\tfrac16\\cdot1\\right) = \\tfrac13\\hbar^2$. (And $\\langle L_z\\rangle = 0$.)' },
    { id: 'qam-018', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'measurement',
      q: 'A particle has angular wavefunction $\\propto \\sin\\theta\\cos\\phi$. A measurement of $L_z$ gives',
      options: ['$+\\hbar$ or $-\\hbar$, each with probability $\\tfrac12$', '$0$ with certainty', '$+\\hbar$ with certainty', '$0$, $\\pm\\hbar$, each with probability $\\tfrac13$'], answer: 0,
      sol: '$\\sin\\theta\\cos\\phi = \\tfrac12\\sin\\theta(e^{i\\phi} + e^{-i\\phi})$, an equal mix of $Y_{11}$ and $Y_{1,-1}$ (up to phases). So $L_z = \\pm\\hbar$ with probability $\\tfrac12$ each, and $L^2 = 2\\hbar^2$ with certainty. This function is $x/r$: it is the $L_x = 0$ state of $l = 1$.' },
    { id: 'qam-019', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'measurement',
      q: 'A particle is in $|l = 1, m = 1\\rangle$. A measurement of $L_x$ gives $+\\hbar$ with probability ______ (to two decimal places).',
      answer: 0.25, tol: 0.005, calc: () => 0.25,
      sol: 'With $L_x = \\tfrac{\\hbar}{\\sqrt2}\\begin{pmatrix}0&1&0\\\\1&0&1\\\\0&1&0\\end{pmatrix}$, the eigenvector for $+\\hbar$ is $\\left(\\tfrac12, \\tfrac{1}{\\sqrt2}, \\tfrac12\\right)$. Its overlap with $(1, 0, 0)$ is $\\tfrac12$, so $P = \\tfrac14$. (Then $P(0) = \\tfrac12$ and $P(-\\hbar) = \\tfrac14$, giving $\\langle L_x\\rangle = 0$.)' },
    { id: 'qam-020', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'ladder operators',
      q: 'With $L_\\pm = L_x \\pm iL_y$, the commutator $[L_z, L_+]$ is',
      options: ['$0$', '$-\\hbar L_+$', '$2\\hbar L_z$', '$\\hbar L_+$'], answer: 3,
      sol: '$[L_z, L_x] = i\\hbar L_y$ and $[L_z, L_y] = -i\\hbar L_x$, so $[L_z, L_+] = i\\hbar L_y + i(-i\\hbar L_x) = \\hbar(L_x + iL_y) = \\hbar L_+$. Hence $L_z(L_+|m\\rangle) = (m + 1)\\hbar L_+|m\\rangle$: $L_+$ raises $m$ by one. ($2\\hbar L_z$ is $[L_+, L_-]$.)' },
    { id: 'qam-021', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'spherical harmonics',
      q: 'Which statements about the spherical harmonics $Y_{lm}$ (Condon-Shortley phases) are correct?',
      options: ['They are orthonormal over the unit sphere.', '$Y_{l0} \\propto P_l(\\cos\\theta)$.', '$|Y_{lm}|^2$ depends on $\\phi$.', '$Y_{l,-m} = (-1)^mY_{lm}^*$.'], answer: [0, 1, 3],
      sol: '$\\int Y_{l\'m\'}^*Y_{lm}\\,d\\Omega = \\delta_{ll\'}\\delta_{mm\'}$. For $m = 0$ the $\\theta$ part is a Legendre polynomial. $Y_{lm} \\propto e^{im\\phi}$, so $|Y_{lm}|^2$ has no $\\phi$ dependence: every $|l,m\\rangle$ density is symmetric about the $z$-axis.' },
    { id: 'qam-022', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'rigid rotor',
      q: 'A diatomic molecule has rotational constant $\\hbar^2/2I = 1.3$ meV. The photon absorbed in the transition $l = 2 \\to l = 3$ has energy ______ meV.',
      answer: 7.8, tol: 0.05, calc: () => 1.3 * (12 - 6),
      sol: '$E_l = \\tfrac{\\hbar^2}{2I}l(l+1)$, so $E_3 - E_2 = 1.3\\times(12 - 6) = 7.8$ meV. In general the line $l \\to l + 1$ has energy $2(l+1)\\hbar^2/2I$: equally spaced lines.' },
    { id: 'qam-023', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'uncertainty',
      q: 'In the state $|l = 3, m = 2\\rangle$, the product $\\Delta L_x\\,\\Delta L_y = k\\hbar^2$. The value of $k$ is ______.',
      answer: 4, tol: 0.01, calc: () => (12 - 4) / 2,
      sol: '$\\langle L_x\\rangle = \\langle L_y\\rangle = 0$ and $\\langle L_x^2\\rangle = \\langle L_y^2\\rangle = \\tfrac{\\hbar^2}{2}(l(l+1) - m^2) = \\tfrac{\\hbar^2}{2}(12 - 4) = 4\\hbar^2$. So $\\Delta L_x = \\Delta L_y = 2\\hbar$ and the product is $4\\hbar^2$, above the Robertson bound $\\tfrac{\\hbar}{2}|\\langle L_z\\rangle| = \\hbar^2$.' },
    { id: 'qam-024', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'uncertainty',
      q: 'All three components $L_x$, $L_y$, $L_z$ can have definite values at the same time only when',
      options: ['$m = l$', '$m = 0$', '$l = 0$', 'never, for any state'], answer: 2,
      sol: 'If a state is an eigenstate of $L_x$ and $L_y$, then $[L_x, L_y] = i\\hbar L_z$ gives $L_z\\psi = 0$, and similarly $L_x\\psi = L_y\\psi = 0$. So $L^2\\psi = 0$: only $l = 0$, where all components are zero.' },
    { id: 'qam-025', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'ladder operators',
      q: '$L_+$ acting on the top state $|l, l\\rangle$ gives',
      options: ['$\\hbar\\sqrt{2l}\\,|l, l+1\\rangle$', '$0$', '$\\hbar\\,|l+1, l+1\\rangle$', '$l\\hbar\\,|l, l\\rangle$'], answer: 1,
      sol: 'The coefficient $\\hbar\\sqrt{l(l+1) - m(m+1)}$ is zero for $m = l$. The ladder must stop there because $\\langle L_x^2 + L_y^2\\rangle = \\hbar^2(l(l+1) - m^2) \\ge 0$ limits $|m|$. $L_\\pm$ never change $l$.' },
    { id: 'qam-026', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'measurement',
      q: 'A particle has $\\psi \\propto xy\\,f(r)$. The value of $\\langle L_z^2\\rangle$ is',
      options: ['$4\\hbar^2$', '$2\\hbar^2$', '$6\\hbar^2$', '$0$'], answer: 0,
      sol: '$xy = r^2\\sin^2\\theta\\cos\\phi\\sin\\phi = \\dfrac{r^2\\sin^2\\theta}{4i}\\left(e^{2i\\phi} - e^{-2i\\phi}\\right)$: an equal mix of $m = 2$ and $m = -2$ (with $l = 2$). So $L_z = \\pm2\\hbar$, each with probability $\\tfrac12$, and $\\langle L_z^2\\rangle = 4\\hbar^2$ (while $\\langle L_z\\rangle = 0$ and $L^2 = 6\\hbar^2$).',
      trap: '$\\langle L_z\\rangle = 0$ does not mean $\\langle L_z^2\\rangle = 0$.' },
    { id: 'qam-027', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'central potentials',
      q: 'For $H = \\hat p^2/2m + V(r)$ with $V$ depending only on $r = |\\vec r|$, which operators commute with $H$?',
      options: ['$\\hat L^2$', '$\\hat L_z$', '$\\hat L_x$', '$\\hat x$'], answer: [0, 1, 2],
      sol: '$\\vec L$ generates rotations, and both $p^2$ and $V(r)$ are unchanged by rotations, so every component of $\\vec L$ (and $L^2$) commutes with $H$. One chooses $H$, $L^2$, $L_z$ as the commuting set because $L_x$ and $L_z$ do not commute with each other. $\\hat x$ does not commute with $p^2$.' },
    { id: 'qam-029', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'eigenvalues',
      q: 'Why must $m$ (and so $l$) be an integer for orbital angular momentum?',
      options: ['Because $L^2$ must be positive', 'Because spin is half-integer', 'Because $\\psi$ must return to itself when $\\phi \\to \\phi + 2\\pi$, which needs $e^{2\\pi im} = 1$', 'Because $L_z$ is Hermitian'], answer: 2,
      sol: 'The ladder algebra alone allows $l = 0, \\tfrac12, 1, \\tfrac32, \\dots$. For orbital motion, $\\psi \\propto e^{im\\phi}$ must be single-valued in space, so $m$ is an integer; $l$ differs from $m$ by integers, so it is an integer too. Half-integers survive only for spin, which has no wavefunction in $\\theta, \\phi$.' },

    // ---------- level 4 ----------
    { id: 'qam-030', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'expectation values',
      q: 'For $\\psi = \\dfrac{1}{\\sqrt6}\\left(Y_{11} + 2Y_{10} + Y_{1,-1}\\right)$, $\\langle L_x\\rangle = k\\hbar$ with $k =$ ______ (to three decimal places).',
      answer: 0.943, tol: 0.003, calc: () => 4 * Math.SQRT2 / 6,
      sol: '$\\langle L_x\\rangle = \\mathrm{Re}\\langle L_+\\rangle$. $L_+$ connects $m = 0 \\to 1$ and $-1 \\to 0$, each with factor $\\sqrt2\\hbar$ for $l = 1$. $\\langle L_+\\rangle = \\tfrac16\\left(c_1^*c_0 + c_0^*c_{-1}\\right)\\sqrt2\\hbar = \\tfrac16(1\\cdot2 + 2\\cdot1)\\sqrt2\\hbar = \\tfrac{4\\sqrt2}{6}\\hbar = 0.943\\hbar$.',
      trap: 'Thinking $\\langle L_x\\rangle = 0$ in any combination of $Y_{lm}$; it vanishes in each single $Y_{lm}$, but superpositions of neighbouring $m$ can point sideways.' },
    { id: 'qam-031', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'spherical harmonics',
      q: 'A particle has angular wavefunction $\\propto x^2/r^2 = \\sin^2\\theta\\cos^2\\phi$. The probability that a measurement of $L^2$ gives $0$ is ______ (to three decimal places).',
      answer: 0.556, tol: 0.003, calc: () => 5 / 9,
      sol: 'Split $x^2/r^2 = \\tfrac13 + \\left(\\tfrac{x^2}{r^2} - \\tfrac13\\right)$; the second part is a pure $l = 2$ function (traceless quadratic), orthogonal to the constant. Sphere averages: $\\langle x^4/r^4\\rangle = \\tfrac15$, $\\langle1\\rangle = 1$. So $P(l = 0) = \\dfrac{(1/3)^2}{1/5} = \\dfrac59 = 0.556$, and $P(l = 2) = \\tfrac49$.',
      trap: 'Assuming $x^2/r^2$ is pure $l = 2$ because it is quadratic; it contains the $l = 0$ piece $\\tfrac13$.' },
    { id: 'qam-032', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'matrices',
      q: 'In the $l = 1$ subspace, the eigenvalues of $\\hat L_x^2$ are',
      options: ['$\\hbar^2, \\hbar^2, \\hbar^2$', '$0, \\hbar^2, 2\\hbar^2$', '$0, \\hbar^2, \\hbar^2$', '$-\\hbar^2, 0, \\hbar^2$'], answer: 2,
      sol: '$L_x$ has the same eigenvalues as $L_z$: $\\hbar, 0, -\\hbar$ (a rotation turns one into the other). Squaring: $\\hbar^2, 0, \\hbar^2$. Check: $\\mathrm{Tr}(L_x^2 + L_y^2 + L_z^2) = 3\\times2\\hbar^2 = 6\\hbar^2$, and each of the three traces is $2\\hbar^2$.' },
    { id: 'qam-033', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'eigenvalues',
      q: 'Which statements are correct?',
      options: ['Single-valued wavefunctions force orbital $l$ to be an integer.', 'Spin angular momentum can be half-integer.', 'The commutation relations $[J_i, J_j] = i\\hbar\\epsilon_{ijk}J_k$ alone allow $j = 0, \\tfrac12, 1, \\tfrac32, \\dots$', '$L^2$ and $L_z$ cannot be diagonalised together.'], answer: [0, 1, 2],
      sol: 'The algebra gives $j(j+1)\\hbar^2$ with $2j$ a non-negative integer; orbital motion adds single-valuedness, keeping only integers; spin uses the half-integers too. $[L^2, L_z] = 0$, so they are diagonalised together (the $|l, m\\rangle$ basis).' },
    { id: 'qam-034', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'rigid rotor',
      q: 'A particle on a ring (planar rotor, $H = L_z^2/2I$) has $\\psi(\\phi) \\propto \\cos^2\\phi$. Its mean energy, in units of $\\hbar^2/2I$, is ______ (to three decimal places).',
      answer: 1.333, tol: 0.003, calc: () => 4 / 3,
      sol: '$\\cos^2\\phi = \\tfrac12 + \\tfrac14e^{2i\\phi} + \\tfrac14e^{-2i\\phi}$. The functions $e^{im\\phi}$ have equal norms, so the probabilities are proportional to $\\tfrac14, \\tfrac1{16}, \\tfrac1{16}$: $P(0) = \\tfrac23$, $P(\\pm2) = \\tfrac16$ each. $\\langle E\\rangle = (\\tfrac16 + \\tfrac16)\\cdot4 = \\tfrac43$ in units of $\\hbar^2/2I$.' },
    { id: 'qam-035', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'measurement',
      q: 'A particle is in $|l = 1, m = 1\\rangle$. $L_x$ is measured, then $L_z$. The probability that $L_x$ gives $0$ AND the following $L_z$ gives $+\\hbar$ is',
      options: ['$1/4$', '$1/2$', '$0$', '$1$'], answer: 0,
      sol: 'The $L_x = 0$ eigenvector of $l = 1$ is $(1, 0, -1)/\\sqrt2$ in the $L_z$ basis. From $(1,0,0)$, $P(L_x = 0) = \\tfrac12$. After collapse, $P(L_z = +\\hbar) = |1/\\sqrt2|^2 = \\tfrac12$. Together $\\tfrac14$.',
      trap: 'Answering 1 because $L_z$ "was already $+\\hbar$": the $L_x$ measurement destroyed that information.' },
    { id: 'qam-036', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'expectation values',
      q: 'A particle has $\\psi \\propto (x + iy + z)\\,f(r)$. Its $\\langle L_z\\rangle = k\\hbar$ with $k =$ ______ (to three decimal places).',
      answer: 0.667, tol: 0.003, calc: () => 2 / 3,
      sol: '$x + iy = r\\sin\\theta e^{i\\phi} = -\\sqrt{8\\pi/3}\\,rY_{11}$ and $z = \\sqrt{4\\pi/3}\\,rY_{10}$. Weights $|c_{11}|^2 : |c_{10}|^2 = 8\\pi/3 : 4\\pi/3 = 2 : 1$, so $P(m = 1) = \\tfrac23$, $P(m = 0) = \\tfrac13$ and $\\langle L_z\\rangle = \\tfrac23\\hbar$.',
      trap: 'Giving $x + iy$ and $z$ equal weight: their norms over the sphere differ by a factor 2.' },
    { id: 'qam-037', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'ladder operators',
      q: 'The matrix element $\\langle 1, 1|\\hat L_+|1, 0\\rangle$ is',
      options: ['$\\hbar$', '$\\sqrt2\\,\\hbar$', '$2\\hbar$', '$0$'], answer: 1,
      sol: '$\\hbar\\sqrt{l(l+1) - m(m+1)} = \\hbar\\sqrt{2 - 0} = \\sqrt2\\,\\hbar$.' },

    // ---------- level 5 ----------
    { id: 'qam-038', type: 'nat', level: 5, exams: ['net', 'gate'], sub: 'rotations',
      q: 'The state $|1, 1\\rangle$ is rotated by $60^\\circ$ about the $y$-axis. The probability that it is still found in $|1, 1\\rangle$ is ______ (to four decimal places).',
      answer: 0.5625, tol: 0.002, calc: () => ((1 + Math.cos(Math.PI / 3)) / 2) ** 2,
      sol: 'The amplitude is the Wigner element $d^1_{11}(\\beta) = \\tfrac12(1 + \\cos\\beta)$. Picture it: $|1,1\\rangle \\propto (x + iy)$; rotating the frame tilts the "axis" of the state by $\\beta$. At $\\beta = 60^\\circ$: $d = 0.75$, probability $0.5625$.',
      trap: 'Using the spin-half result $\\cos^2(\\beta/2) = 0.75$; that is the amplitude here, not the probability.' },
    { id: 'qam-039', type: 'msq', level: 5, exams: ['net', 'gate'], sub: 'central potentials',
      q: 'The level $N = n_x + n_y + n_z = 2$ of the isotropic 3D oscillator has 6 states. Sorted by orbital angular momentum, which statements are correct?',
      options: ['$l = 2$ occurs.', '$l = 1$ occurs.', '$l = 0$ occurs.', 'The $2l + 1$ multiplicities add up to 6.'], answer: [0, 2, 3],
      sol: 'The states are quadratic polynomials times the Gaussian; the parity is $(-1)^N = +1$, so $l$ is even: $l = N, N - 2, \\dots$, here $2$ and $0$ (the $l = 0$ state is $\\propto (r^2 - \\text{const})e^{-r^2/2}$). Multiplicities: $5 + 1 = 6$.' },
    { id: 'qam-040', type: 'msq', level: 5, exams: ['net', 'gate'], sub: 'measurement',
      q: 'A particle has $\\psi = x\\,f(r)$. Which statements are correct?',
      options: ['$\\hat L_x\\psi = 0$.', '$\\langle L_z^2\\rangle = \\hbar^2$.', 'A measurement of $L_z$ can give $0$.', '$\\langle L_y^2\\rangle = \\hbar^2$.'], answer: [0, 1, 3],
      sol: '$L_x = -i\\hbar(y\\partial_z - z\\partial_y)$, and $\\partial_z(xf) = xf\'z/r$, $\\partial_y(xf) = xf\'y/r$, so $L_x\\psi = 0$: $x/r$ is the $m_x = 0$ state of $l = 1$. In the $z$ basis $x/r$ is an equal mix of $m = \\pm1$, so $L_z = \\pm\\hbar$ (never $0$) and $\\langle L_z^2\\rangle = \\hbar^2$. Then $\\langle L_y^2\\rangle = 2\\hbar^2 - 0 - \\hbar^2 = \\hbar^2$.' },
    { id: 'qam-041', type: 'nat', level: 5, exams: ['net', 'gate'], sub: 'rotations',
      q: 'The state $|2, 2\\rangle$ is rotated by $90^\\circ$ about the $y$-axis. The probability of then finding $m = 0$ (still $l = 2$) is ______ (to three decimal places).',
      answer: 0.375, tol: 0.003, calc: () => 3 / 8,
      sol: 'The amplitude is $d^2_{02}(\\beta) = \\sqrt{\\tfrac38}\\sin^2\\beta$. At $\\beta = 90^\\circ$: $\\sqrt{3/8}$, probability $\\tfrac38 = 0.375$. Check with Cartesian forms: $|2,2\\rangle \\propto (x + iy)^2$ becomes $\\propto (z + iy)^2 = z^2 - y^2 + 2iyz$ (up to signs), and projecting $z^2 - y^2$ on $3z^2 - r^2$ gives the same $3/8$.' },
  ],
  gens: [
    { id: 'qam-g01', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'ladder operators',
      make(r) {
        const l = int(r, 1, 5), m = int(r, -l, l - 1), up = r() < 0.5;
        const k = lp(l, m); // L_- |l, m+1> has the same coefficient as L_+ |l, m>
        const q = up ? `\\hat L_+|${l}, ${m}\\rangle = k\\hbar\\,|${l}, ${m + 1}\\rangle` : `\\hat L_-|${l}, ${m + 1}\\rangle = k\\hbar\\,|${l}, ${m}\\rangle`;
        return { q: `$${q}$. The value of $k$ is ______ (to three decimal places).`,
          answer: round(k, 3), tol: 0.002, l, m,
          sol: `$L_\\pm|l, m\\rangle = \\hbar\\sqrt{l(l+1) - m(m\\pm1)}\\,|l, m\\pm1\\rangle$. Here $k = \\sqrt{${l * (l + 1)} - (${m})(${m + 1})} = \\sqrt{${l * (l + 1) - m * (m + 1)}} = ${round(k, 3)}$.` };
      },
      verify: (p) => lp(p.l, p.m) },
    { id: 'qam-g02', type: 'nat', level: 2, exams: ['gate', 'net', 'jam'], sub: 'vector model',
      make(r) {
        const l = int(r, 1, 6), m = int(r, 1, l);
        const th = Math.acos(m / Math.sqrt(l * (l + 1))) * 180 / Math.PI;
        return { q: `In the vector model, the angle between $\\vec L$ and the $z$-axis for $l = ${l}$, $m = ${m}$ is ______ degrees (to one decimal place).`,
          answer: round(th, 1), tol: 0.1, l, m,
          sol: `$\\cos\\theta = m/\\sqrt{l(l+1)} = ${m}/\\sqrt{${l * (l + 1)}} = ${round(m / Math.sqrt(l * (l + 1)), 4)}$, so $\\theta = ${round(th, 1)}^\\circ$.`,
          trap: 'Using $\\cos\\theta = m/l$, which would let $\\vec L$ lie exactly along $z$.' };
      },
      verify: (p) => Math.acos(p.m / Math.sqrt(p.l * (p.l + 1))) * 180 / Math.PI },
    { id: 'qam-g03', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'expectation values',
      make(r) {
        const l = int(r, 1, 6), m = int(r, -l, l), c = choose(r, ['x', 'y']);
        const k = (l * (l + 1) - m * m) / 2;
        return { q: `In the state $|l = ${l}, m = ${m}\\rangle$, $\\langle L_${c}^2\\rangle = k\\hbar^2$. The value of $k$ is ______ (to one decimal place).`,
          answer: k, tol: 0.01, l, m,
          sol: `$\\langle L_x^2\\rangle = \\langle L_y^2\\rangle = \\tfrac12(\\langle L^2\\rangle - \\langle L_z^2\\rangle) = \\tfrac12(${l * (l + 1)} - ${m * m})\\hbar^2 = ${k}\\hbar^2$.` };
      },
      verify: (p) => (p.l * (p.l + 1) - p.m ** 2) / 2 },
    { id: 'qam-g04', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'rigid rotor',
      make(r) {
        const B = choose(r, [0.25, 0.5, 1.3, 1.8, 2.6, 7.4]), l = int(r, 0, 5);
        const E = B * 2 * (l + 1);
        return { q: `A molecule has rotational constant $\\hbar^2/2I = ${B}$ meV. The photon absorbed in the transition $l = ${l} \\to ${l + 1}$ has energy ______ meV (to two decimal places).`,
          answer: round(E, 2), tol: Math.max(0.01, round(E * 0.005, 2)), B, l,
          sol: `$E_{l+1} - E_l = \\tfrac{\\hbar^2}{2I}[(l+1)(l+2) - l(l+1)] = 2(l+1)\\tfrac{\\hbar^2}{2I} = ${2 * (l + 1)}\\times${B} = ${round(E, 2)}$ meV.` };
      },
      verify: (p) => 2 * p.B * (p.l + 1) },
    { id: 'qam-g05', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'expectation values',
      make(r) {
        const l = int(r, 1, 3), a = int(r, 1, 4), b = int(r, 1, 4);
        const m1 = int(r, -l, l); let m2 = int(r, -l, l - 1); if (m2 >= m1) m2++;
        const ans = (a * a * m1 + b * b * m2) / (a * a + b * b);
        return { q: `For $\\psi \\propto ${a === 1 ? '' : a}Y_{${l},${m1}} + ${b === 1 ? '' : b}i\\,Y_{${l},${m2}}$, $\\langle L_z\\rangle = k\\hbar$ with $k =$ ______ (to two decimal places).`,
          answer: round(ans, 2), tol: 0.01, l, a, b, m1, m2,
          sol: `Probabilities $${a * a}/${a * a + b * b}$ for $m = ${m1}$ and $${b * b}/${a * a + b * b}$ for $m = ${m2}$ (the factor $i$ does not matter). $\\langle L_z\\rangle = \\dfrac{${a * a}(${m1}) + ${b * b}(${m2})}{${a * a + b * b}}\\hbar = ${round(ans, 2)}\\hbar$.` };
      },
      verify: (p) => (p.a ** 2 * p.m1 + p.b ** 2 * p.m2) / (p.a ** 2 + p.b ** 2) },
    { id: 'qam-g06', type: 'nat', level: 4, exams: ['net', 'gate'], sub: 'rotations',
      make(r) {
        const deg = choose(r, [30, 45, 60, 90, 120, 135, 150]);
        const d = (1 + Math.cos(deg * Math.PI / 180)) / 2, P = d * d;
        return { q: `The state $|1, 1\\rangle$ is rotated by $${deg}^\\circ$ about the $y$-axis. The probability of still finding it in $|1, 1\\rangle$ is ______ (to three decimal places).`,
          answer: round(P, 3), tol: 0.003, deg,
          sol: `$d^1_{11}(\\beta) = \\tfrac12(1 + \\cos\\beta) = ${round(d, 4)}$, so the probability is $${round(P, 3)}$.` };
      },
      verify: (p) => ((1 + Math.cos(p.deg * Math.PI / 180)) / 2) ** 2 },
    { id: 'qam-g07', type: 'nat', level: 1, exams: ['gate', 'net', 'jam'], sub: 'eigenvalues',
      make(r) {
        const l = int(r, 1, 8);
        const k = Math.sqrt(l * (l + 1));
        return { q: `The magnitude of the orbital angular momentum for $l = ${l}$ is $k\\hbar$, with $k =$ ______ (to three decimal places).`,
          answer: round(k, 3), tol: 0.002, l,
          sol: `$|\\vec L| = \\sqrt{l(l+1)}\\,\\hbar = \\sqrt{${l * (l + 1)}}\\,\\hbar = ${round(k, 3)}\\hbar$.`,
          trap: `Answering ${l}, which is the largest value of $L_z/\\hbar$, not $|\\vec L|/\\hbar$.` };
      },
      verify: (p) => Math.sqrt(p.l * (p.l + 1)) },
    { id: 'qam-g08', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'eigenvalues',
      make(r) {
        const l = int(r, 2, 7);
        const show = (v) => `$${v}\\hbar^2$`;
        const o = mcqOptions(r, l * (l + 1), [l * l, (l + 1) * (l + 1), l * (l - 1), 2 * l + 1], show);
        return { q: `A particle is in an orbital state with $l = ${l}$. The eigenvalue of $\\hat L^2$ is`, ...o,
          sol: `$L^2 = l(l+1)\\hbar^2 = ${l}\\times${l + 1}\\,\\hbar^2 = ${l * (l + 1)}\\hbar^2$.`,
          trap: '$l^2\\hbar^2$ is the old Bohr-Sommerfeld guess; $2l + 1$ is the number of $m$ values.' };
      } },
  ],
};
