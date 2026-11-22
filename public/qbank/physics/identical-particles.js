// Identical particles: the exchange operator and symmetrisation postulate, bosons and fermions and the
// spin-statistics link, Slater determinants and the Pauli principle, filling wells, oscillators and boxes,
// counting states, spin and spatial symmetry together (singlet and triplet), exchange "forces" and
// <(x1 - x2)²>, helium excited states and the exchange integral, contact interactions, bunching, and
// ortho and para molecules.
// Original questions for GATE and CSIR NET practice (fibub). Levels: 1 warm-up ... 5 top rank.
import { int, choose, mcqOptions, round } from '../_util.js';
import more from './identical-particles.more.gen.js';
import more2 from './identical-particles.more2.gen.js';
import r4 from './identical-particles.r4.gen.js';

const C = (n, k) => { if (k < 0 || k > n) return 0; let c = 1; for (let i = 1; i <= k; i++) c = c * (n - k + i) / i; return Math.round(c); };
// Fill single-particle levels with energies e(i) and degeneracies d(i); cap = particles per orbital.
function fill(N, level, deg, cap) {
  let E = 0, left = N;
  for (let i = 0; left > 0 && i < 200; i++) { const take = Math.min(left, deg(i) * cap); E += take * level(i); left -= take; }
  return E;
}
const x2 = (n) => 1 / 3 - 1 / (2 * n * n * Math.PI * Math.PI);                     // <x²>_n / a² in a well (0, a)
const x1n = (n) => (n % 2 ? 0 : -8 * n / (Math.PI ** 2 * (n * n - 1) ** 2));       // <1|x|n> / a
function halfOverlap(n) { let s = 0; const M = 4000; for (let i = 0; i < M; i++) { const u = (i + 0.5) / M * 0.5; s += 2 * Math.sin(Math.PI * u) * Math.sin(n * Math.PI * u); } return s * 0.5 / M; }

export default {
  topic: 'identical-particles',
  items: [
    // ---------- level 1 ----------
    { id: 'qip-001', type: 'mcq', level: 1, exams: ['gate', 'net', 'jam'], sub: 'symmetrisation',
      q: 'The total wavefunction (space and spin) of a system of two identical fermions must be',
      options: ['antisymmetric under exchange of the two particles', 'symmetric under exchange', 'symmetric in space and antisymmetric in spin, always', 'unchanged in magnitude only, with any phase'], answer: 0,
      sol: 'Exchange $P_{12}$ commutes with $H$ for identical particles and $P_{12}^2 = 1$, so states have $P_{12} = \\pm1$. Nature chooses: $-1$ for fermions (half-integer spin), $+1$ for bosons (integer spin). For fermions the space part can be symmetric if the spin part is antisymmetric, or the other way round; only the product must be antisymmetric.',
      trap: 'The third option is only one of the two possibilities (the singlet case).' },
    { id: 'qip-002', type: 'mcq', level: 1, exams: ['gate', 'net', 'jam'], sub: 'spin-statistics',
      q: 'Which of these behaves as a boson?',
      options: ['An electron', 'A neutral $^4$He atom', 'A neutral $^3$He atom', 'A proton'], answer: 1,
      sol: 'Count the fermions inside: $^4$He has 2 protons, 2 neutrons and 2 electrons, 6 fermions, so its total spin is an integer and it is a boson (hence superfluid $^4$He). $^3$He has 5 fermions: a fermion. Electrons and protons are spin-$\\tfrac12$ fermions.' },
    { id: 'qip-003', type: 'mcq', level: 1, exams: ['gate', 'net', 'jam'], sub: 'filling levels',
      q: 'Two non-interacting electrons (spin $\\tfrac12$) are in a 1D infinite well whose single-particle levels are $n^2E_1$. The ground-state energy of the pair is',
      options: ['$E_1$', '$5E_1$', '$2E_1$', '$8E_1$'], answer: 2,
      sol: 'Both can occupy $n = 1$ if their spins form the antisymmetric singlet, so $E = E_1 + E_1 = 2E_1$. For spinless fermions (or electrons forced into a triplet) one must go to $n = 2$: $E_1 + 4E_1 = 5E_1$.' },
    { id: 'qip-004', type: 'mcq', level: 1, exams: ['gate', 'net', 'jam'], sub: 'pauli principle',
      q: 'The Pauli exclusion principle follows from antisymmetry because',
      options: ['fermions repel each other electrically', 'fermions have spin', 'bosons occupy only even states', 'an antisymmetric product of two identical one-particle states, $\\phi(1)\\phi(2) - \\phi(2)\\phi(1)$, is zero'], answer: 3,
      sol: 'If both particles had the same one-particle state (space and spin), the antisymmetrised wavefunction would vanish identically. So no two identical fermions share a complete set of quantum numbers. It has nothing to do with charge: neutrons obey it too.' },
    { id: 'qip-005', type: 'nat', level: 1, exams: ['gate', 'net'], sub: 'counting states',
      q: 'Two identical bosons can each be in any of 3 single-particle states. The number of distinct two-particle states is ______.',
      answer: 6, tol: 0, calc: () => C(4, 2),
      sol: 'Symmetric states: both in the same state (3 ways) or in two different states, symmetrised (3 pairs). Total $6 = \\binom{3 + 2 - 1}{2}$. Distinguishable particles would have $3^2 = 9$; identical fermions $\\binom32 = 3$.' },
    { id: 'qip-006', type: 'msq', level: 1, exams: ['gate', 'net'], sub: 'symmetrisation',
      q: 'Which statements about the exchange operator $P_{12}$ for identical particles are correct?',
      options: ['Its eigenvalues are $+1$ and $-1$.', 'It commutes with the Hamiltonian.', 'A state that starts symmetric stays symmetric as it evolves.', 'Spin-$\\tfrac12$ particles can form a symmetric total wavefunction and so act as bosons.'], answer: [0, 1, 2],
      sol: '$P_{12}^2 = 1$ gives eigenvalues $\\pm1$. For identical particles $H$ is unchanged by relabelling, so $[H, P_{12}] = 0$ and the symmetry is conserved. Spin-statistics fixes antisymmetric total wavefunctions for spin $\\tfrac12$. (A bound pair of fermions can be a composite boson, but each electron itself cannot.)' },

    // ---------- level 2 ----------
    { id: 'qip-007', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'filling levels',
      q: 'Two identical spinless fermions are in a 1D infinite well (levels $n^2E_1$). The ground-state energy of the pair is ______ $E_1$.',
      answer: 5, tol: 0, calc: () => 1 + 4,
      sol: 'They cannot share a level, so the lowest is $n = 1$ and $n = 2$: $E = (1 + 4)E_1 = 5E_1$, with $\\psi = \\tfrac{1}{\\sqrt2}[\\psi_1(x_1)\\psi_2(x_2) - \\psi_2(x_1)\\psi_1(x_2)]$. Two identical bosons would both sit in $n = 1$: $2E_1$.' },
    { id: 'qip-008', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'filling levels',
      q: 'Three non-interacting electrons are in a 1D harmonic oscillator. The ground-state energy is ______ $\\hbar\\omega$ (to one decimal place).',
      answer: 2.5, tol: 0.01, calc: () => fill(3, (i) => i + 0.5, () => 1, 2),
      sol: 'Each level holds two electrons (spin up and down). Two in $n = 0$ ($\\tfrac12\\hbar\\omega$ each) and one in $n = 1$ ($\\tfrac32\\hbar\\omega$): $1 + 1.5 = 2.5\\hbar\\omega$.' },
    { id: 'qip-009', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'spin and space',
      q: 'Two electrons are in the spin singlet state. Their spatial wavefunction must be',
      options: ['symmetric under exchange', 'antisymmetric under exchange', 'zero', 'either; the spin state places no restriction'], answer: 0,
      sol: 'The singlet $(\\uparrow\\downarrow - \\downarrow\\uparrow)/\\sqrt2$ is antisymmetric, so the spatial part must be symmetric to make the total antisymmetric. The three triplet states are symmetric, and go with antisymmetric spatial functions.' },
    { id: 'qip-010', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'counting states',
      q: 'Three identical fermions are distributed over 5 single-particle states (at most one per state). The number of distinct three-particle states is ______.',
      answer: 10, tol: 0, calc: () => C(5, 3),
      sol: 'An antisymmetric state is fixed by which 3 of the 5 states are occupied (a Slater determinant), so the count is $\\binom53 = 10$. Order does not matter, and no state is used twice.' },
    { id: 'qip-011', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'helium',
      q: 'In excited helium with configuration $1s2s$, the triplet ($S = 1$) level lies below the singlet level because',
      options: ['the spins interact magnetically, favouring parallel spins', 'the antisymmetric spatial function keeps the electrons apart and lowers their Coulomb repulsion', 'the triplet has three states', 'the triplet electrons are closer to the nucleus by the Pauli principle'], answer: 1,
      sol: 'The triplet spin state is symmetric, so its spatial part $\\tfrac{1}{\\sqrt2}[\\phi_{1s}(1)\\phi_{2s}(2) - \\phi_{2s}(1)\\phi_{1s}(2)]$ vanishes when the electrons meet. Less overlap means less repulsion: $E = J - K$ for the triplet and $J + K$ for the singlet, with exchange integral $K > 0$. Magnetic spin-spin energies are far smaller.' },
    { id: 'qip-012', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'slater determinants',
      q: 'For two non-interacting identical fermions in one-particle states $\\phi_a$ and $\\phi_b$ (including spin), the normalised two-particle state is',
      options: ['$\\phi_a(1)\\phi_b(2)$', '$\\tfrac{1}{\\sqrt2}[\\phi_a(1)\\phi_b(2) + \\phi_b(1)\\phi_a(2)]$', '$\\tfrac{1}{\\sqrt2}[\\phi_a(1)\\phi_b(2) - \\phi_b(1)\\phi_a(2)]$', '$\\tfrac12[\\phi_a(1) - \\phi_b(2)]$'], answer: 2,
      sol: 'It is the $2\\times2$ Slater determinant $\\tfrac{1}{\\sqrt2}\\begin{vmatrix}\\phi_a(1) & \\phi_b(1)\\\\\\phi_a(2) & \\phi_b(2)\\end{vmatrix}$. It changes sign under $1 \\leftrightarrow 2$ and vanishes if $a = b$. The plus combination is the bosonic one.' },
    { id: 'qip-013', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'counting states',
      q: 'Two identical bosons share 5 available single-particle states. The number of distinct two-particle states is ______.',
      answer: 15, tol: 0, calc: () => C(6, 2),
      sol: 'Both in one state: 5 ways. In two different states: $\\binom52 = 10$ symmetrised pairs. Total $15 = \\binom{5 + 1}{2}$.' },
    { id: 'qip-014', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'helium',
      q: 'Which statements about the $1s2s$ configuration of helium are correct?',
      options: ['It contains 4 states in all.', 'The three triplet states have an antisymmetric spatial wavefunction.', 'The singlet state has a symmetric spatial wavefunction.', 'The ground configuration $1s^2$ also has a triplet.'], answer: [0, 1, 2],
      sol: 'Two different orbitals, each electron with 2 spin states: one symmetric spatial function times the singlet, one antisymmetric spatial function times the three triplet states, $1 + 3 = 4$. In $1s^2$ the spatial function $\\phi_{1s}(1)\\phi_{1s}(2)$ is necessarily symmetric, so only the singlet is allowed.' },
    { id: 'qip-015', type: 'mcq', level: 2, exams: ['gate', 'net', 'jam'], sub: 'spin-statistics',
      q: 'The spin-statistics connection states that',
      options: ['all particles with spin are fermions', 'bosons have half-integer spin', 'statistics depends on the temperature', 'particles with integer spin are bosons and particles with half-integer spin are fermions'], answer: 3,
      sol: 'Photons (spin 1), pions (0) and $^4$He atoms are bosons; electrons, protons, neutrons and $^3$He atoms are fermions. Within non-relativistic quantum mechanics it is a postulate; relativistic quantum field theory proves it.' },
    { id: 'qip-016', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'filling levels',
      q: 'Two non-interacting electrons are in a 1D infinite well (levels $n^2E_1$). The first excited level of the pair, at $5E_1$ (one electron in $n = 1$, one in $n = 2$), is how many-fold degenerate?',
      options: ['4', '1', '2', '3'], answer: 0,
      sol: 'With different orbitals, the spatial function can be symmetric (with the spin singlet, 1 state) or antisymmetric (with the triplet, 3 states). Without interactions all four have the same energy $5E_1$; a repulsion would split them into $1 + 3$.' },

    // ---------- level 3 ----------
    { id: 'qip-017', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'exchange force',
      q: 'Two identical spinless fermions in an infinite well $0 < x < a$ occupy $n = 1$ and $n = 2$ (antisymmetric spatial state). Using $\\langle x^2\\rangle_n = a^2\\left(\\tfrac13 - \\tfrac{1}{2n^2\\pi^2}\\right)$, $\\langle x\\rangle_n = a/2$ and $\\langle1|x|2\\rangle = -\\dfrac{16a}{9\\pi^2}$, $\\langle(x_1 - x_2)^2\\rangle = k\\,a^2$ with $k =$ ______ (to three decimal places).',
      answer: 0.168, tol: 0.002, calc: () => x2(1) + x2(2) - 0.5 + 2 * x1n(2) ** 2,
      sol: '$\\langle(x_1 - x_2)^2\\rangle = \\langle x^2\\rangle_1 + \\langle x^2\\rangle_2 - 2\\langle x\\rangle_1\\langle x\\rangle_2 \\pm 2|\\langle1|x|2\\rangle|^2$, with $+$ for the antisymmetric (fermion) state. Numbers: $0.2827 + 0.3207 - 0.5 = 0.1033$ (the distinguishable value) plus $2(0.1801)^2 = 0.0649$: $0.168a^2$. The particles are pushed apart by symmetry alone (the "exchange force").' },
    { id: 'qip-018', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'exchange force',
      q: 'Compared with distinguishable particles in the same two orbitals, two identical particles in a spatially symmetric state are',
      options: ['on average farther apart', 'on average closer together', 'at the same average separation', 'never found at the same point'], answer: 1,
      sol: 'The exchange term $-2|\\langle a|x|b\\rangle|^2$ lowers $\\langle(x_1 - x_2)^2\\rangle$ for symmetric spatial states (bosons, or fermions in a spin singlet) and raises it for antisymmetric ones. It is not a real force but a correlation from the symmetry of the wavefunction; it vanishes when the orbitals do not overlap.' },
    { id: 'qip-019', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'filling levels',
      q: 'Five non-interacting electrons are placed in a 2D square infinite well, whose single-particle levels are $(n_x^2 + n_y^2)\\epsilon$. The ground-state energy is ______ $\\epsilon$.',
      answer: 19, tol: 0, calc: () => fill(5, (i) => [2, 5, 8][i], (i) => [1, 2, 1][i], 2),
      sol: 'Levels: $(1,1)$ at $2\\epsilon$ (one orbital, 2 electrons); $(1,2)$ and $(2,1)$ at $5\\epsilon$ (two orbitals, up to 4 electrons). Fill: $2\\times2 + 3\\times5 = 19\\epsilon$.' },
    { id: 'qip-020', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'helium',
      q: 'For helium $1s2s$, the direct and exchange integrals of the electron repulsion are $J$ and $K = 0.40$ eV. The singlet-triplet splitting $E(^1S) - E(^3S)$ is ______ eV (to two decimal places).',
      answer: 0.8, tol: 0.01, calc: () => 2 * 0.4,
      sol: 'Singlet (symmetric space): $E_0 + J + K$. Triplet (antisymmetric space): $E_0 + J - K$. Splitting $2K = 0.80$ eV, close to the measured gap between the $2^1S$ and $2^3S$ levels of helium.' },
    { id: 'qip-021', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'ortho and para',
      q: 'In the H$_2$ molecule (protons are spin-$\\tfrac12$ fermions; ground electronic state symmetric under proton exchange), para-hydrogen has total nuclear spin $I = 0$. Its allowed rotational levels are',
      options: ['odd $J$ only', 'all $J$', 'even $J$ only', '$J = 0$ only'], answer: 2,
      sol: 'Swapping the protons multiplies the rotational function by $(-1)^J$. The total must be antisymmetric. The $I = 0$ nuclear spin singlet is antisymmetric, so the rotation must be symmetric: even $J$. Ortho-hydrogen ($I = 1$, symmetric) has odd $J$.' },
    { id: 'qip-022', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'ortho and para',
      q: 'At high temperature, the equilibrium ratio of ortho-H$_2$ to para-H$_2$ approaches',
      options: ['$1:1$', '$1:3$', '$2:1$', '$3:1$'], answer: 3,
      sol: 'When many $J$ levels are populated, odd and even $J$ have about equal rotational weight, so the ratio is set by the nuclear spin multiplicities: triplet (3) for ortho, singlet (1) for para. This 3:1 ratio shows up as alternating line intensities in the rotational Raman spectrum.' },
    { id: 'qip-023', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'symmetrisation',
      q: 'For two identical spinless fermions with $\\psi(x_1, x_2) = -\\psi(x_2, x_1)$, which statements about $P(x_1, x_2) = |\\psi|^2$ are correct?',
      options: ['$P(x, x) = 0$ for every $x$.', '$P(x_1, x_2) = P(x_2, x_1)$.', '$\\iint P\\,dx_1dx_2 = 1$.', '$P$ is the same as for two distinguishable particles in the same orbitals.'], answer: [0, 1, 2],
      sol: 'Setting $x_1 = x_2$ in the antisymmetry relation gives $\\psi(x, x) = 0$: a hole along the diagonal. $|\\psi|^2$ is symmetric because the overall sign squares away. The cross term $-2\\,\\mathrm{Re}[\\phi_a(1)\\phi_b(2)\\phi_b^*(1)\\phi_a^*(2)]$ makes it differ from the distinguishable case.' },
    { id: 'qip-024', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'exchange force',
      q: 'Two identical spinless bosons in an infinite well $0 < x < a$ occupy $n = 1$ and $n = 2$ (symmetric state). With the same integrals as for the fermion case ($\\langle1|x|2\\rangle = -16a/9\\pi^2$), $\\langle(x_1 - x_2)^2\\rangle = k\\,a^2$ with $k =$ ______ (to four decimal places).',
      answer: 0.0385, tol: 0.0005, calc: () => x2(1) + x2(2) - 0.5 - 2 * x1n(2) ** 2,
      sol: 'Distinguishable value $0.1033a^2$ minus $2|\\langle1|x|2\\rangle|^2 = 0.0649a^2$: $0.0385a^2$. The bosons huddle together; the fermions ($0.168a^2$) keep apart.' },
    { id: 'qip-025', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'spin and space',
      q: 'For two electrons in a spin-independent potential with a non-degenerate ground state of the two-electron problem, the ground state is',
      options: ['a spin singlet with a symmetric spatial wavefunction', 'a spin triplet with an antisymmetric spatial wavefunction', 'an equal mixture of singlet and triplet', 'a state with total spin $\\tfrac12$'], answer: 0,
      sol: 'The lowest spatial state of a two-particle Hamiltonian is nodeless and so symmetric; antisymmetric functions need a node along $x_1 = x_2$, costing kinetic energy. A symmetric space requires the antisymmetric singlet. (Hund\'s rule favouring triplets applies to electrons in different degenerate orbitals.)' },
    { id: 'qip-026', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'ortho and para',
      q: 'Deuterons have spin 1 (bosons). At high temperature, the ratio of ortho-D$_2$ (symmetric nuclear spin states, even $J$) to para-D$_2$ (antisymmetric nuclear spin states, odd $J$) approaches',
      options: ['$3:1$', '$2:1$', '$1:2$', '$1:1$'], answer: 1,
      sol: 'Two spin-1 nuclei give $I = 0, 1, 2$: $I = 2$ and $0$ are symmetric ($5 + 1 = 6$ states), $I = 1$ antisymmetric (3 states). For bosons the total must be symmetric, so symmetric spins go with even $J$. Ratio $6:3 = 2:1$.' },
    { id: 'qip-027', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'spin and space',
      q: 'Two identical spin-1 bosons occupy the same spatial orbital. The number of allowed spin states is',
      options: ['3', '9', '6', '1'], answer: 2,
      sol: 'The spatial part is symmetric, so the spin part must be symmetric too. For $1\\otimes1$, the symmetric multiplets are $S = 2$ and $S = 0$: $5 + 1 = 6$ states. The $S = 1$ triplet is antisymmetric and excluded.' },
    { id: 'qip-028', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'filling levels',
      q: 'Four non-interacting electrons are in a 3D isotropic harmonic oscillator, whose levels are $(N + \\tfrac32)\\hbar\\omega$ with $(N + 1)(N + 2)/2$ orbitals. The ground-state energy is ______ $\\hbar\\omega$.',
      answer: 8, tol: 0, calc: () => fill(4, (i) => i + 1.5, (i) => (i + 1) * (i + 2) / 2, 2),
      sol: '$N = 0$: one orbital, 2 electrons at $1.5\\hbar\\omega$. $N = 1$: three orbitals (room for 6), the other 2 electrons at $2.5\\hbar\\omega$. Total $3 + 5 = 8\\hbar\\omega$. Filling $N = 0$ and $1$ completely takes 8 electrons, the first oscillator magic numbers 2, 8, 20 of the nuclear shell model.' },
    { id: 'qip-042', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'symmetrisation',
      q: 'When can the symmetrisation of a two-particle wavefunction safely be ignored?',
      options: ['Never; it always changes every prediction', 'Only for bosons', 'When the one-particle wavefunctions do not overlap (for example, electrons in atoms far apart)', 'Only at high temperature'], answer: 2,
      sol: 'Exchange terms involve products like $\\phi_a(x)\\phi_b^*(x)$; if the orbitals have no common region, these vanish and the symmetrised and unsymmetrised states predict the same local measurements. That is why we can treat an electron here without antisymmetrising with every electron in the universe.' },

    // ---------- level 4 ----------
    { id: 'qip-029', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'contact interaction',
      q: 'Two electrons in the singlet ground state of a 1D oscillator (both in $\\psi_0$, length $b = \\sqrt{\\hbar/m\\omega}$) interact weakly by $g\\,\\delta(x_1 - x_2)$. The first-order energy shift is $k\\,g/b$ with $k =$ ______ (to three decimal places).',
      answer: 0.399, tol: 0.002, calc: () => 1 / Math.sqrt(2 * Math.PI),
      sol: '$\\Delta E = g\\int|\\psi_0(x)|^4dx$ with $|\\psi_0|^2 = \\dfrac{e^{-x^2/b^2}}{\\sqrt\\pi\\,b}$: $\\dfrac{g}{\\pi b^2}\\int e^{-2x^2/b^2}dx = \\dfrac{g}{\\pi b^2}\\sqrt{\\dfrac{\\pi b^2}{2}} = \\dfrac{g}{\\sqrt{2\\pi}\\,b}$. A triplet state would not feel a contact interaction at all: its spatial wavefunction vanishes at $x_1 = x_2$.' },
    { id: 'qip-030', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'helium',
      q: 'Which statements about exchange energy in helium\'s excited states are correct?',
      options: ['The singlet-triplet splitting of a $1snl$ configuration is $2K_{nl}$.', 'A positive exchange integral places the triplet below the singlet.', 'The splitting comes from the Coulomb repulsion combined with symmetry, not from a magnetic spin-spin force.', 'The configuration $1s^2$ shows a singlet-triplet splitting too.'], answer: [0, 1, 2],
      sol: '$E = J \\pm K$ (singlet $+$, triplet $-$). It is electrostatic: the spin enters only through the required spatial symmetry, which is why it can be written as an effective $-\\tfrac{K}{2}(1 + 4\\vec S_1\\cdot\\vec S_2/\\hbar^2)$. $1s^2$ has only a singlet.' },
    { id: 'qip-031', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'counting states',
      q: 'Three electrons are placed in three spatial orbitals (each orbital with two spin states). The number of distinct antisymmetric three-electron states is ______.',
      answer: 20, tol: 0, calc: () => C(6, 3),
      sol: 'There are $3\\times2 = 6$ spin-orbitals, and an antisymmetric state is fixed by choosing which 3 are occupied: $\\binom63 = 20$. (This is the dimension of the $p^3$ configuration in atoms, which splits into $^4S$, $^2D$, $^2P$: $4 + 10 + 6 = 20$.)' },
    { id: 'qip-032', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'ortho and para',
      q: 'In CO$_2$ the two $^{16}$O nuclei are spin-0 bosons and the ground electronic and vibrational state is symmetric under their exchange. Its rotational spectrum therefore shows',
      options: ['all $J$ levels with intensity ratio 3:1', 'odd $J$ only', 'all $J$ levels with equal weights', 'even $J$ only, with every other line missing'], answer: 3,
      sol: 'Exchanging the oxygens multiplies the rotational function by $(-1)^J$. For identical spin-0 bosons the only nuclear spin state is symmetric, and the total must be symmetric, so only even $J$ survive. Half the expected levels are simply absent.' },
    { id: 'qip-033', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'exchange force',
      q: 'Two identical spinless fermions in an infinite well $0 < x < a$ occupy $n = 1$ and $n = 2$. The probability that both are found in the left half ($0 < x < a/2$) is ______ (to three decimal places).',
      answer: 0.07, tol: 0.002, calc: () => 0.25 - (4 / (3 * Math.PI)) ** 2,
      sol: 'For $\\psi_\\pm = \\tfrac{1}{\\sqrt2}[\\psi_1(1)\\psi_2(2) \\pm \\psi_2(1)\\psi_1(2)]$, $P_{LL} = P_1P_2 \\pm I^2$ with $P_1 = P_2 = \\tfrac12$ (each orbital is half in each half) and $I = \\int_0^{a/2}\\psi_1\\psi_2\\,dx = \\tfrac{4}{3\\pi} = 0.424$. Fermions: $0.25 - 0.180 = 0.070$; bosons $0.430$; distinguishable $0.25$.' },
    { id: 'qip-034', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'spin and space',
      q: 'For two electrons in the $1s2s$ triplet state of helium, the spatial wavefunction is',
      options: ['$\\tfrac{1}{\\sqrt2}[\\phi_{1s}(1)\\phi_{2s}(2) - \\phi_{2s}(1)\\phi_{1s}(2)]$', '$\\tfrac{1}{\\sqrt2}[\\phi_{1s}(1)\\phi_{2s}(2) + \\phi_{2s}(1)\\phi_{1s}(2)]$', '$\\phi_{1s}(1)\\phi_{1s}(2)$', '$\\phi_{1s}(1)\\phi_{2s}(2)$'], answer: 0,
      sol: 'Triplet spin states are symmetric, so the space part is antisymmetric. It vanishes when $\\vec r_1 = \\vec r_2$, which reduces the repulsion. The symmetric combination belongs to the singlet ($2^1S$).' },
    { id: 'qip-035', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'filling levels',
      q: 'Ten non-interacting electrons fill the lowest levels of a 1D infinite well of width $1.0$ nm, where $E_n = n^2\\times0.376$ eV. The energy of the highest occupied level is ______ eV (to two decimal places).',
      answer: 9.4, tol: 0.03, calc: () => 25 * 0.376,
      sol: 'Two electrons per level, so ten electrons fill $n = 1$ to $5$. The highest occupied level is $E_5 = 25\\times0.376 = 9.40$ eV: the 1D Fermi energy. (This box model gives the colours of conjugated dye molecules.)' },
    { id: 'qip-036', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'filling levels',
      q: 'Two identical spinless bosons are in a 1D harmonic oscillator (no interaction). Their second excited level (two quanta in total) has energy and degeneracy',
      options: ['$3\\hbar\\omega$, 3 states', '$3\\hbar\\omega$, 2 states', '$2\\hbar\\omega$, 1 state', '$3\\hbar\\omega$, 1 state'], answer: 1,
      sol: 'Total energy $(n_1 + n_2 + 1)\\hbar\\omega$ with $n_1 + n_2 = 2$: $3\\hbar\\omega$. Configurations $\\{0, 2\\}$ (one symmetrised state) and $\\{1, 1\\}$ (one state): 2 states. Distinguishable particles would have 3 ($(0,2), (2,0), (1,1)$); spinless fermions only 1 ($\\{0, 2\\}$).' },
    { id: 'qip-041', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'counting states',
      q: 'Two non-interacting electrons are in a 1D infinite well (levels $n^2E_1$). The number of two-electron states with total energy at most $8E_1$ (counting spin) is ______.',
      answer: 6, tol: 0, calc: () => 1 + 4 + 1,
      sol: '$\\{1,1\\}$ at $2E_1$: singlet only, 1 state. $\\{1,2\\}$ at $5E_1$: singlet + triplet, 4 states. $\\{2,2\\}$ at $8E_1$: singlet only, 1 state. Next is $\\{1,3\\}$ at $10E_1$. Total 6.' },

    // ---------- level 5 ----------
    { id: 'qip-037', type: 'nat', level: 5, exams: ['net', 'gate'], sub: 'filling levels',
      q: 'Six non-interacting electrons are in a 2D isotropic oscillator, whose levels are $(N + 1)\\hbar\\omega$ with $N + 1$ orbitals each. The ground-state energy is ______ $\\hbar\\omega$.',
      answer: 10, tol: 0, calc: () => fill(6, (i) => i + 1, (i) => i + 1, 2),
      sol: '$N = 0$: 1 orbital, 2 electrons at $1\\hbar\\omega$. $N = 1$: 2 orbitals, 4 electrons at $2\\hbar\\omega$. Total $2 + 8 = 10\\hbar\\omega$. Six electrons close the second shell: magic numbers 2, 6, 12 in 2D (quantum dots show them).' },
    { id: 'qip-038', type: 'msq', level: 5, exams: ['net', 'gate'], sub: 'ortho and para',
      q: 'Which statements about molecular hydrogen are correct?',
      options: ['The total wavefunction is antisymmetric under exchange of the two protons.', 'Ortho-H$_2$ has $I = 1$ and odd $J$.', 'Hydrogen cooled slowly with a catalyst becomes almost pure para-H$_2$.', 'Ortho-para conversion is fast without a catalyst, since it needs only a photon.'], answer: [0, 1, 2],
      sol: 'Protons are fermions. Ortho ($I = 1$, symmetric spin) needs odd $J$; para ($I = 0$) even $J$, including $J = 0$, the true ground state, so at low temperature equilibrium favours para. Conversion requires flipping a nuclear spin, which is extremely slow without a magnetic catalyst; uncatalysed cooled hydrogen keeps its 3:1 mix for days.' },
    { id: 'qip-039', type: 'nat', level: 5, exams: ['net', 'gate'], sub: 'bunching',
      q: 'Two identical bosons are placed at random in 4 single-particle states, every distinct symmetric two-particle state being equally likely. The probability that both are in the same single-particle state is ______ (to two decimal places).',
      answer: 0.4, tol: 0.002, calc: () => 4 / C(5, 2),
      sol: 'There are $\\binom{5}{2} = 10$ symmetric states, of which 4 have both particles in one state: probability $0.4$. Distinguishable particles: $4/16 = 0.25$. Fermions: $0$. Bosons bunch: the root of stimulated emission and Bose-Einstein condensation.' },
    { id: 'qip-040', type: 'nat', level: 5, exams: ['net', 'gate'], sub: 'filling levels',
      q: 'Eight non-interacting electrons are in a cubic infinite well, with levels $(n_x^2 + n_y^2 + n_z^2)\\epsilon$. The ground-state energy is ______ $\\epsilon$.',
      answer: 42, tol: 0, calc: () => fill(8, (i) => [3, 6, 9][i], (i) => [1, 3, 3][i], 2),
      sol: '$(1,1,1)$ at $3\\epsilon$ holds 2 electrons; $(1,1,2)$ and its permutations at $6\\epsilon$ (3 orbitals) hold 6. Total $2\\times3 + 6\\times6 = 42\\epsilon$. (The next level, $(1,2,2)$ at $9\\epsilon$, would start the third shell.)' },
    ...more2,
    ...r4.items,
  ],
  gens: [
    { id: 'qip-g01', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'filling levels',
      make(r) {
        const N = int(r, 2, 8), kind = choose(r, ['electrons (spin $\\tfrac12$)', 'spinless fermions', 'spinless bosons']);
        const cap = kind.startsWith('electrons') ? 2 : kind.startsWith('spinless f') ? 1 : N;
        const E = fill(N, (i) => (i + 1) ** 2, () => 1, cap);
        return { q: `${N} non-interacting identical ${kind} are in a 1D infinite well with levels $n^2E_1$. The ground-state energy is ______ $E_1$.`,
          answer: E, tol: 0, N, cap,
          sol: cap === N ? `Bosons can all share $n = 1$: $E = ${N}E_1$.` : `Each level holds ${cap} particle${cap > 1 ? 's' : ''}. Filling from $n = 1$ upwards: $E = ${E}E_1$.` };
      },
      verify: (p) => fill(p.N, (i) => (i + 1) ** 2, () => 1, p.cap) },
    { id: 'qip-g02', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'filling levels',
      make(r) {
        const N = int(r, 2, 9), spin = r() < 0.6;
        const E = fill(N, (i) => i + 0.5, () => 1, spin ? 2 : 1);
        return { q: `${N} non-interacting identical ${spin ? 'spin-$\\tfrac12$ fermions' : 'spinless fermions'} are in a 1D harmonic oscillator. The ground-state energy is ______ $\\hbar\\omega$ (to one decimal place).`,
          answer: E, tol: 0.01, N, spin,
          sol: `Levels $(n + \\tfrac12)\\hbar\\omega$ each hold ${spin ? 2 : 1} particle${spin ? 's' : ''}. Filling the lowest ones gives $${E}\\hbar\\omega$.` };
      },
      verify: (p) => fill(p.N, (i) => i + 0.5, () => 1, p.spin ? 2 : 1) },
    { id: 'qip-g03', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'counting states',
      make(r) {
        const g = int(r, 2, 7), N = int(r, 2, 3), kind = choose(r, ['bosons', 'fermions', 'distinguishable particles']);
        const v = kind === 'bosons' ? C(g + N - 1, N) : kind === 'fermions' ? C(g, N) : g ** N;
        return { q: `${N} identical ${kind === 'distinguishable particles' ? 'but distinguishable particles' : kind} are distributed over ${g} single-particle states. The number of distinct ${N}-particle states is ______.`,
          answer: v, tol: 0, g, N, kind,
          sol: kind === 'bosons' ? `Bosons: count occupation patterns, $\\binom{g + N - 1}{N} = \\binom{${g + N - 1}}{${N}} = ${v}$.` : kind === 'fermions' ? `Fermions: choose which ${N} states are occupied, $\\binom{${g}}{${N}} = ${v}$.` : `Distinguishable: each particle independently, $g^N = ${g}^${N} = ${v}$.` };
      },
      verify: (p) => (p.kind === 'bosons' ? C(p.g + p.N - 1, p.N) : p.kind === 'fermions' ? C(p.g, p.N) : p.g ** p.N) },
    { id: 'qip-g04', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'filling levels',
      make(r) {
        const L = choose(r, [0.5, 0.8, 1, 1.5, 2]), N = 2 * int(r, 2, 8) - int(r, 0, 1);
        const E1 = 0.376 / (L * L), nmax = Math.ceil(N / 2), v = nmax * nmax * E1;
        return { q: `${N} non-interacting electrons fill the lowest levels of a 1D infinite well of width $${L}$ nm ($E_n = n^2h^2/8m_eL^2$, with $h^2/8m_e = 0.376$ eV nm$^2$). The highest occupied level has energy ______ eV (to three decimal places).`,
          answer: round(v, 3), tol: Math.max(0.002, v * 0.002), N, L,
          sol: `$E_1 = 0.376/${L}^2 = ${round(E1, 4)}$ eV. Two electrons per level, so ${N} electrons reach $n = ${nmax}$: $E_{${nmax}} = ${nmax * nmax}\\times${round(E1, 4)} = ${round(v, 3)}$ eV.` };
      },
      verify: (p) => Math.ceil(p.N / 2) ** 2 * 0.376 / p.L ** 2 },
    { id: 'qip-g05', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'exchange force',
      make(r) {
        const n = choose(r, [2, 3, 4]), kind = choose(r, ['bosons', 'fermions', 'distinguishable']);
        const s = kind === 'bosons' ? -1 : kind === 'fermions' ? 1 : 0;
        const v = x2(1) + x2(n) - 0.5 + 2 * s * x1n(n) ** 2;
        return { q: `Two ${kind === 'distinguishable' ? 'distinguishable particles' : `identical spinless ${kind}`} in an infinite well $0 < x < a$ occupy $n = 1$ and $n = ${n}$. $\\langle(x_1 - x_2)^2\\rangle = k\\,a^2$ with $k =$ ______ (to four decimal places). Use $\\langle x^2\\rangle_n = a^2(\\tfrac13 - \\tfrac{1}{2n^2\\pi^2})$, $\\langle x\\rangle_n = \\tfrac a2$ and $\\langle1|x|n\\rangle = -\\dfrac{8na}{\\pi^2(n^2 - 1)^2}$ for even $n$ ($0$ for odd $n$).`,
          answer: round(v, 4), tol: 0.0003, n, s,
          sol: `$\\langle x^2\\rangle_1 + \\langle x^2\\rangle_${n} - 2(\\tfrac a2)^2 = (${round(x2(1), 4)} + ${round(x2(n), 4)} - 0.5)a^2 = ${round(x2(1) + x2(n) - 0.5, 4)}a^2$. Exchange term $${s === 0 ? '0' : (s > 0 ? '+' : '-') + '2|\\langle1|x|' + n + '\\rangle|^2'} = ${round(2 * s * x1n(n) ** 2, 4)}a^2$${n % 2 ? ' (zero: both orbitals have the same parity about the centre, so $\\langle1|x - a/2|' + n + '\\rangle = 0$)' : ''}. Total $${round(v, 4)}a^2$.` };
      },
      verify: (p) => x2(1) + x2(p.n) - 0.5 + 2 * p.s * x1n(p.n) ** 2 },
    { id: 'qip-g06', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'exchange force',
      make(r) {
        const n = choose(r, [2, 4]), kind = choose(r, ['bosons', 'fermions']);
        const I = halfOverlap(n), v = 0.25 + (kind === 'bosons' ? 1 : -1) * I * I;
        return { q: `Two identical spinless ${kind} in an infinite well $0 < x < a$ occupy $n = 1$ and $n = ${n}$. The probability that both are in the left half ($0 < x < a/2$) is ______ (to three decimal places).`,
          answer: round(v, 3), tol: 0.002, n, kind,
          sol: `$P_{LL} = P_1P_${n} ${kind === 'bosons' ? '+' : '-'} I^2$ with $P_1 = P_${n} = \\tfrac12$ and $I = \\int_0^{a/2}\\psi_1\\psi_${n}\\,dx = ${round(I, 4)}$. So $P_{LL} = 0.25 ${kind === 'bosons' ? '+' : '-'} ${round(I * I, 4)} = ${round(v, 3)}$.` };
      },
      verify: (p) => { const k = p.n; const I = (1 / Math.PI) * (Math.sin((k - 1) * Math.PI / 2) / (k - 1) - Math.sin((k + 1) * Math.PI / 2) / (k + 1)); return 0.25 + (p.kind === 'bosons' ? 1 : -1) * I * I; } },
    { id: 'qip-g07', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'helium',
      make(r) {
        const J = choose(r, [9.1, 10.2, 11.4]), K = choose(r, [0.2, 0.4, 0.6, 1.2]), E0 = choose(r, [-68, -58.1]), ask = choose(r, ['singlet', 'triplet', 'gap']);
        const v = ask === 'singlet' ? E0 + J + K : ask === 'triplet' ? E0 + J - K : 2 * K;
        return { q: `In a $1snl$ configuration of helium, the unperturbed energy is $${E0}$ eV, the direct integral $J = ${J}$ eV and the exchange integral $K = ${K}$ eV. ${ask === 'gap' ? 'The singlet-triplet splitting is' : `The first-order energy of the ${ask} level is`} ______ eV (to two decimal places).`,
          answer: round(v, 2), tol: 0.01, J, K, E0, ask,
          sol: `Singlet (symmetric space): $E_0 + J + K = ${round(E0 + J + K, 2)}$ eV. Triplet (antisymmetric space): $E_0 + J - K = ${round(E0 + J - K, 2)}$ eV. Splitting $2K = ${round(2 * K, 2)}$ eV.` };
      },
      verify: (p) => (p.ask === 'singlet' ? p.E0 + p.J + p.K : p.ask === 'triplet' ? p.E0 + p.J - p.K : 2 * p.K) },
    { id: 'qip-g08', type: 'nat', level: 4, exams: ['net', 'gate'], sub: 'ortho and para',
      make(r) {
        const I = choose(r, [0.5, 1, 1.5, 2.5, 3]);
        const sym = (2 * I + 1) * (I + 1), anti = (2 * I + 1) * I, v = sym / anti;
        const hs = Number.isInteger(I) ? String(I) : `${2 * I}/2`;
        return { q: `A homonuclear diatomic molecule has identical nuclei of spin $I = ${hs}$. At high temperature, the ratio of the number of molecules in symmetric nuclear spin states to those in antisymmetric ones (the intensity ratio of alternate rotational lines) is ______ (to three decimal places).`,
          answer: round(v, 3), tol: 0.002, I,
          sol: `Of the $(2I + 1)^2 = ${(2 * I + 1) ** 2}$ nuclear spin states, $(2I + 1)(I + 1) = ${sym}$ are symmetric and $(2I + 1)I = ${anti}$ antisymmetric. At high temperature even and odd $J$ are equally weighted, so the ratio is $(I + 1)/I = ${round(v, 3)}$. Which set goes with even $J$ depends on whether the nuclei are bosons or fermions.` };
      },
      verify: (p) => (p.I + 1) / p.I },
    { id: 'qip-g09', type: 'mcq', level: 2, exams: ['gate', 'net', 'jam'], sub: 'spin-statistics',
      make(r) {
        const list = [['$^{4}$He atom', 2, 2, 2], ['$^{3}$He atom', 2, 1, 2], ['$^{6}$Li atom', 3, 3, 3], ['$^{7}$Li atom', 3, 4, 3], ['deuteron ($^2$H nucleus)', 1, 1, 0], ['$^{23}$Na atom', 11, 12, 11], ['$^{40}$K atom', 19, 21, 19], ['$^{87}$Rb atom', 37, 50, 37], ['$\\alpha$ particle', 2, 2, 0], ['$^{3}$H nucleus (triton)', 1, 2, 0], ['$^{14}$N nucleus', 7, 7, 0], ['$^{13}$C nucleus', 6, 7, 0]];
        const [name, p, n, e] = choose(r, list), f = p + n + e, boson = f % 2 === 0;
        const right = boson ? 'a boson (integer total spin)' : 'a fermion (half-integer total spin)';
        const o = mcqOptions(r, right, [boson ? 'a fermion (half-integer total spin)' : 'a boson (integer total spin)', 'a boson or a fermion, depending on its energy', 'neither, since it is composite']);
        return { q: `The ${name} (${p} protons, ${n} neutrons, ${e} electrons) behaves as`, ...o,
          sol: `It contains $${p} + ${n} + ${e} = ${f}$ spin-$\\tfrac12$ fermions. An ${boson ? 'even' : 'odd'} number of half-integer spins adds to ${boson ? 'an integer' : 'a half-integer'}, so it is ${boson ? 'a boson' : 'a fermion'} (as long as it is not broken apart).` };
      } },
    { id: 'qip-g10', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'filling levels',
      make(r) {
        const dim = choose(r, [2, 3]), N = int(r, 2, 12);
        const deg = dim === 2 ? (i) => i + 1 : (i) => (i + 1) * (i + 2) / 2, lev = dim === 2 ? (i) => i + 1 : (i) => i + 1.5;
        const E = fill(N, lev, deg, 2);
        return { q: `${N} non-interacting electrons are in a ${dim}D isotropic harmonic oscillator (levels $(N + ${dim === 2 ? '1' : '\\tfrac32'})\\hbar\\omega$, with ${dim === 2 ? '$N + 1$' : '$(N + 1)(N + 2)/2$'} orbitals in level $N$). The ground-state energy is ______ $\\hbar\\omega$ (to one decimal place).`,
          answer: E, tol: 0.01, dim, N,
          sol: `Fill shells with 2 electrons per orbital: shell capacities ${dim === 2 ? '2, 4, 6, 8' : '2, 6, 12, 20'}, ... Summing occupation $\\times$ energy gives $${E}\\hbar\\omega$.` };
      },
      verify: (p) => fill(p.N, p.dim === 2 ? (i) => i + 1 : (i) => i + 1.5, p.dim === 2 ? (i) => i + 1 : (i) => (i + 1) * (i + 2) / 2, 2) },
    { id: 'qip-g11', type: 'nat', level: 3, exams: ['net', 'gate'], sub: 'bunching',
      make(r) {
        const g = int(r, 2, 8), kind = choose(r, ['bosons', 'distinguishable particles']);
        const v = kind === 'bosons' ? 2 / (g + 1) : 1 / g;
        return { q: `Two ${kind === 'bosons' ? 'identical bosons' : 'distinguishable particles'} are put at random into ${g} single-particle states, with every distinct two-particle state equally likely. The probability that both are in the same state is ______ (to three decimal places).`,
          answer: round(v, 3), tol: 0.002, g, kind,
          sol: kind === 'bosons' ? `There are $g(g + 1)/2 = ${g * (g + 1) / 2}$ symmetric states, $g = ${g}$ of them doubly occupied: $2/(g + 1) = ${round(v, 3)}$, more than the classical $1/g$.` : `There are $g^2 = ${g * g}$ states, $g$ of them doubly occupied: $1/g = ${round(v, 3)}$. Bosons would give $2/(g + 1)$.` };
      },
      verify: (p) => (p.kind === 'bosons' ? 2 / (p.g + 1) : 1 / p.g) },
    ...more,
    ...r4.gens,
  ],
};
