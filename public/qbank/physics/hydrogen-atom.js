// The hydrogen atom by the Schrödinger equation: separation in spherical coordinates, the radial equation and
// effective potential, radial functions R_nl, energies and n² degeneracy, nodes, radial probability densities,
// expectation values <r>, <r²>, <1/r>, <1/r²>, the virial theorem, densities at the nucleus, hydrogen-like ions,
// selection rules, sudden changes and modified Coulomb problems. (The Bohr model and spectral series are in
// atoms-x-rays; this topic is the MSc treatment.)
// Original questions for GATE and CSIR NET practice (fibub). Levels: 1 warm-up ... 5 top rank.
import { int, choose, mcqOptions, round, shuffle } from '../_util.js';

const L = ['s', 'p', 'd', 'f', 'g', 'h'];
const rAvg = (n, l) => (3 * n * n - l * (l + 1)) / 2;            // <r> in units of a/Z
const r2Avg = (n, l) => (n * n / 2) * (5 * n * n + 1 - 3 * l * (l + 1)); // <r²> in units of (a/Z)²
const inside = (x) => 1 - Math.exp(-2 * x) * (1 + 2 * x + 2 * x * x);   // P(r < x a) in 1s

export default {
  topic: 'hydrogen-atom',
  items: [
    // ---------- level 1 ----------
    { id: 'qhy-001', type: 'mcq', level: 1, exams: ['gate', 'net', 'jam'], sub: 'energy levels',
      q: 'In the non-relativistic Schrödinger treatment of hydrogen (no spin, no fine structure), the bound-state energies depend on',
      options: ['$n$ only', '$n$ and $l$', '$n$, $l$ and $m$', '$l$ only'], answer: 0,
      sol: 'Solving the radial equation gives $E_n = -\\dfrac{\\mu e^4}{2(4\\pi\\epsilon_0)^2\\hbar^2 n^2} = -\\dfrac{13.6\\ \\text{eV}}{n^2}$ with $n = n_r + l + 1$. Different $(n_r, l)$ pairs with the same sum have the same energy: this extra ("accidental") degeneracy in $l$ is special to the $1/r$ potential. $m$ never enters because the potential is spherically symmetric.',
      trap: 'In any central potential $E$ is independent of $m$; independence of $l$ is the special feature of the Coulomb potential.' },
    { id: 'qhy-002', type: 'mcq', level: 1, exams: ['gate', 'net', 'jam'], sub: 'degeneracy',
      q: 'Ignoring spin, the number of linearly independent eigenstates of hydrogen with principal quantum number $n$ is',
      options: ['$n$', '$2n + 1$', '$n^2$', '$2n^2$'], answer: 2,
      sol: 'For each $n$, $l = 0, 1, \\dots, n - 1$ and each $l$ has $2l + 1$ values of $m$: $\\sum_{l=0}^{n-1}(2l + 1) = n^2$. With the two spin states the count doubles to $2n^2$.',
      trap: '$2n^2$ includes spin; $2l + 1$ is the count for one $l$ only.' },
    { id: 'qhy-003', type: 'nat', level: 1, exams: ['gate', 'net', 'jam'], sub: 'expectation values',
      q: 'For the hydrogen ground state $\\psi_{100} = (\\pi a_0^3)^{-1/2}e^{-r/a_0}$, the mean distance $\\langle r\\rangle$ of the electron from the nucleus is ______ $a_0$ (to one decimal place).',
      answer: 1.5, tol: 0.01, calc: () => 1.5,
      sol: '$\\langle r\\rangle = \\int_0^\\infty r\\,|\\psi|^2\\,4\\pi r^2\\,dr = \\dfrac{4}{a_0^3}\\int_0^\\infty r^3e^{-2r/a_0}dr = \\dfrac{4}{a_0^3}\\cdot\\dfrac{3!}{(2/a_0)^4} = \\dfrac{4\\cdot6\\,a_0}{16} = 1.5\\,a_0$.',
      trap: 'The most probable distance is $a_0$; the mean is larger because the density has a long tail.' },
    { id: 'qhy-004', type: 'mcq', level: 1, exams: ['gate', 'net', 'jam'], sub: 'nodes',
      q: 'The number of radial nodes (spheres where $R_{nl} = 0$, not counting $r = 0$ and $r \\to \\infty$) of the $3p$ radial function is',
      options: ['$0$', '$1$', '$2$', '$3$'], answer: 1,
      sol: 'The radial function is a polynomial of degree $n_r = n - l - 1$ (times $r^le^{-r/na_0}$), with $n_r$ positive roots. For $3p$: $3 - 1 - 1 = 1$ radial node. With $l = 1$ angular node, the total is $n - 1 = 2$.' },
    { id: 'qhy-005', type: 'mcq', level: 1, exams: ['gate', 'net', 'jam'], sub: 'virial theorem',
      q: 'The ground-state energy of hydrogen is $-13.6$ eV. The expectation value of the potential energy in this state is',
      options: ['$-13.6$ eV', '$+13.6$ eV', '$-6.8$ eV', '$-27.2$ eV'], answer: 3,
      sol: 'For $V \\propto r^{-1}$ the virial theorem gives $2\\langle T\\rangle = -\\langle V\\rangle$, so $E = \\langle T\\rangle + \\langle V\\rangle = \\tfrac12\\langle V\\rangle$. Hence $\\langle V\\rangle = 2E = -27.2$ eV and $\\langle T\\rangle = -E = +13.6$ eV.',
      trap: '$+13.6$ eV is the kinetic energy, not the potential energy.' },
    { id: 'qhy-006', type: 'msq', level: 1, exams: ['gate', 'net', 'jam'], sub: 'quantum numbers',
      q: 'Which sets $(n, l, m)$ label allowed hydrogen eigenstates?',
      options: ['$(2, 1, -1)$', '$(3, 3, 0)$', '$(4, 2, 2)$', '$(1, 0, 1)$'], answer: [0, 2],
      sol: 'The rules are $l = 0, \\dots, n - 1$ and $m = -l, \\dots, l$. $(3, 3, 0)$ breaks $l \\le n - 1$; $(1, 0, 1)$ breaks $|m| \\le l$.' },

    // ---------- level 2 ----------
    { id: 'qhy-007', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'expectation values',
      q: 'Using $\\langle r\\rangle_{nl} = \\dfrac{a_0}{2}\\left[3n^2 - l(l+1)\\right]$, the mean radius of the hydrogen $2p$ state is ______ $a_0$.',
      answer: 5, tol: 0, calc: () => rAvg(2, 1),
      sol: '$n = 2$, $l = 1$: $\\langle r\\rangle = \\tfrac{a_0}{2}(12 - 2) = 5a_0$. Compare $2s$: $\\tfrac{a_0}{2}(12) = 6a_0$. At fixed $n$ the larger $l$ is more compact on average.' },
    { id: 'qhy-008', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'radial functions',
      q: 'The radial function $R_{10}(r)$ of hydrogen is proportional to',
      options: ['$e^{-r/a_0}$', '$r\\,e^{-r/a_0}$', '$e^{-r/2a_0}$', '$e^{-r^2/a_0^2}$'], answer: 0,
      sol: 'Near the origin $R_{nl} \\propto r^l$, so an $s$ state does not vanish at $r = 0$. Far away $R \\propto e^{-r/na_0}$. With no radial nodes ($n_r = 0$): $R_{10} = 2a_0^{-3/2}e^{-r/a_0}$. $r\\,e^{-r/a_0}$ would be the shape of $u = rR$, and $e^{-r/2a_0}$ belongs to $n = 2$.',
      trap: 'Mixing up $R(r)$ with $u(r) = rR(r)$, which does vanish at the origin.' },
    { id: 'qhy-009', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'radial probability',
      q: 'For the $2p$ state, $R_{21} \\propto r\\,e^{-r/2a_0}$. The radius at which the radial probability density $P(r) = r^2|R_{21}|^2$ is largest is ______ $a_0$.',
      answer: 4, tol: 0, calc: () => 4,
      sol: '$P(r) \\propto r^4e^{-r/a_0}$. Setting $dP/dr = 0$: $4r^3 - r^4/a_0 = 0$, so $r = 4a_0$, which equals the Bohr radius $n^2a_0$ for $n = 2$. This holds for every state with $l = n - 1$.' },
    { id: 'qhy-010', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'radial equation',
      q: 'Writing $\\psi = \\dfrac{u(r)}{r}Y_{lm}(\\theta, \\phi)$, the radial equation for $u$ looks like a 1D Schrödinger equation on $r > 0$. The condition $u$ must satisfy at the origin is',
      options: ['$u\'(0) = 0$', '$u(0) = 1$', '$u(0) = 0$', '$u$ may take any finite value'], answer: 2,
      sol: 'If $u(0) \\ne 0$, then $\\psi \\approx u(0)/r$ near the origin, and $\\nabla^2(1/r) = -4\\pi\\delta^3(\\vec r)$ produces a delta function that the Coulomb potential cannot cancel, so $\\psi$ would not solve the equation. Hence $u(0) = 0$: the half-line problem behaves as if there were an infinite wall at $r = 0$.',
      trap: '$\\psi$ itself can be finite and non-zero at the origin for $s$ states; it is $u = rR$ that vanishes.' },
    { id: 'qhy-011', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'radial equation',
      q: 'The effective potential in the radial equation for hydrogen (reduced mass $\\mu$) is',
      options: ['$-\\dfrac{e^2}{4\\pi\\epsilon_0r} - \\dfrac{l(l+1)\\hbar^2}{2\\mu r^2}$', '$-\\dfrac{e^2}{4\\pi\\epsilon_0r} + \\dfrac{l^2\\hbar^2}{2\\mu r^2}$', '$-\\dfrac{e^2}{4\\pi\\epsilon_0r^2} + \\dfrac{l(l+1)\\hbar^2}{2\\mu r^2}$', '$-\\dfrac{e^2}{4\\pi\\epsilon_0r} + \\dfrac{l(l+1)\\hbar^2}{2\\mu r^2}$'], answer: 3,
      sol: 'The kinetic energy splits into a radial part and $L^2/2\\mu r^2$; with $L^2 = l(l+1)\\hbar^2$ this centrifugal term is repulsive and adds to the Coulomb attraction: $V_{\\text{eff}} = -\\dfrac{e^2}{4\\pi\\epsilon_0 r} + \\dfrac{l(l+1)\\hbar^2}{2\\mu r^2}$. It keeps electrons with $l \\ge 1$ away from the nucleus.' },
    { id: 'qhy-012', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'virial theorem',
      q: 'The expectation value of the kinetic energy of the electron in the hydrogen $2s$ state is',
      options: ['$-3.4$ eV', '$+6.8$ eV', '$+3.4$ eV', '$+13.6$ eV'], answer: 2,
      sol: '$E_2 = -13.6/4 = -3.4$ eV. Virial theorem for the Coulomb potential: $\\langle T\\rangle = -E_2 = +3.4$ eV (and $\\langle V\\rangle = 2E_2 = -6.8$ eV). The same holds for $2p$: it depends only on $n$.',
      trap: 'Kinetic energy is never negative.' },
    { id: 'qhy-013', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'degeneracy',
      q: 'Which statements about the $n = 4$ level of hydrogen (ignoring spin) are correct?',
      options: ['It contains 16 orbital states.', 'Exactly 3 of its states have $m = 1$.', 'The $4f$ radial function has no radial node.', 'Its largest orbital quantum number is $l = 4$.'], answer: [0, 1, 2],
      sol: '$n^2 = 16$ states. $m = 1$ needs $l \\ge 1$: $l = 1, 2, 3$, so three states. $4f$ has $n_r = 4 - 3 - 1 = 0$. The largest $l$ is $n - 1 = 3$.' },
    { id: 'qhy-014', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'expectation values',
      q: 'For a hydrogen eigenstate $\\psi_{nlm}$, $\\langle 1/r\\rangle$ equals',
      options: ['$\\dfrac{1}{n^2a_0}$', '$\\dfrac{1}{na_0}$', '$\\dfrac{n^2}{a_0}$', '$\\dfrac{1}{n^3a_0}$'], answer: 0,
      sol: 'Virial theorem: $\\langle V\\rangle = 2E_n$, so $-\\dfrac{e^2}{4\\pi\\epsilon_0}\\langle 1/r\\rangle = -\\dfrac{e^2}{4\\pi\\epsilon_0 a_0 n^2}$, giving $\\langle 1/r\\rangle = 1/(n^2a_0)$ for every $l$ and $m$.',
      trap: '$\\langle 1/r\\rangle \\ne 1/\\langle r\\rangle$: for $1s$, $\\langle1/r\\rangle = 1/a_0$ but $1/\\langle r\\rangle = 2/(3a_0)$.' },
    { id: 'qhy-015', type: 'msq', level: 2, exams: ['gate', 'net', 'jam'], sub: 'radial probability',
      q: 'For the hydrogen ground state, $P(r) = \\dfrac{4r^2}{a_0^3}e^{-2r/a_0}$ is the probability per unit radius. Which statements are correct?',
      options: ['$P(r)$ is largest at $r = a_0$.', '$\\langle r\\rangle = 1.5\\,a_0$.', '$P(0) = 0$.', '$|\\psi_{100}(0)|^2 = 0$.'], answer: [0, 1, 2],
      sol: '$dP/dr \\propto 2r - 2r^2/a_0 = 0$ at $r = a_0$. $\\langle r\\rangle = 1.5a_0$. The factor $r^2$ (the area of a shell) makes $P(0) = 0$, but the density $|\\psi(0)|^2 = 1/\\pi a_0^3$ is at its largest at the nucleus.',
      trap: 'The density $|\\psi|^2$ and the radial probability $4\\pi r^2|\\psi|^2$ peak in different places.' },
    { id: 'qhy-016', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'reduced mass',
      q: 'If the electron in hydrogen were replaced by a particle of the same charge but larger reduced mass $\\mu$, the length scale $a = 4\\pi\\epsilon_0\\hbar^2/\\mu e^2$ of the wavefunctions would scale as',
      options: ['$\\mu$', '$1/\\mu$', '$\\mu^2$', '$\\mu^0$ (no change)'], answer: 1,
      sol: 'Balancing the kinetic scale $\\hbar^2/\\mu a^2$ against the Coulomb scale $e^2/4\\pi\\epsilon_0a$ gives $a \\propto 1/\\mu$, while $E \\propto \\mu$. Heavier bound particles sit closer and deeper.' },

    // ---------- level 3 ----------
    { id: 'qhy-017', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'radial probability',
      q: 'The probability that the electron in the hydrogen ground state is found closer to the nucleus than $a_0$ is ______ (to three decimal places).',
      answer: 0.323, tol: 0.002, calc: () => inside(1),
      sol: 'With $x = 2r/a_0$: $P = \\int_0^{a_0}\\dfrac{4r^2}{a_0^3}e^{-2r/a_0}dr = \\tfrac12\\int_0^2x^2e^{-x}dx = \\tfrac12\\left[2 - e^{-2}(4 + 4 + 2)\\right] = 1 - 5e^{-2} = 0.323$.',
      trap: 'Answering 0.5 because $a_0$ is the most probable radius; the distribution is skewed outwards.' },
    { id: 'qhy-018', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'radial probability',
      q: 'Classically, an electron with $E = -13.6$ eV cannot go beyond the radius where $E = V(r)$. In the quantum ground state, the probability of finding the electron beyond this classical turning point is ______ (to three decimal places).',
      answer: 0.238, tol: 0.002, calc: () => 1 - inside(2),
      sol: '$-\\dfrac{e^2}{8\\pi\\epsilon_0a_0} = -\\dfrac{e^2}{4\\pi\\epsilon_0 r}$ gives $r = 2a_0$. Then $P(r > 2a_0) = e^{-4}(1 + 4 + 8) = 13e^{-4} = 0.238$ (from $P(r > R) = e^{-2R/a_0}\\left[1 + 2R/a_0 + 2(R/a_0)^2\\right]$).' },
    { id: 'qhy-019', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'expectation values',
      q: 'In the hydrogen ground state, $\\langle r^2\\rangle$ equals',
      options: ['$a_0^2$', '$1.5\\,a_0^2$', '$3a_0^2$', '$2.25\\,a_0^2$'], answer: 2,
      sol: '$\\langle r^2\\rangle = \\dfrac{4}{a_0^3}\\int_0^\\infty r^4e^{-2r/a_0}dr = \\dfrac{4}{a_0^3}\\cdot\\dfrac{4!\\,a_0^5}{32} = 3a_0^2$. By symmetry $\\langle x^2\\rangle = a_0^2$.',
      trap: '$2.25a_0^2 = \\langle r\\rangle^2$; the difference $0.75a_0^2$ is the variance of $r$.' },
    { id: 'qhy-020', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'expectation values',
      q: 'The uncertainty $\\Delta r$ in the hydrogen ground state is ______ $a_0$ (to three decimal places).',
      answer: 0.866, tol: 0.003, calc: () => Math.sqrt(3 - 2.25),
      sol: '$\\langle r\\rangle = 1.5a_0$ and $\\langle r^2\\rangle = 3a_0^2$, so $\\Delta r = \\sqrt{3 - 2.25}\\,a_0 = \\sqrt{0.75}\\,a_0 = 0.866a_0$.' },
    { id: 'qhy-021', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'density at nucleus',
      q: 'The ratio $|\\psi_{200}(0)|^2 / |\\psi_{100}(0)|^2$ of electron densities at the nucleus is',
      options: ['$1/2$', '$1/4$', '$1/16$', '$1/8$'], answer: 3,
      sol: 'For $s$ states $|\\psi_{n00}(0)|^2 = \\dfrac{1}{\\pi a_0^3n^3}$. So the ratio is $1/2^3 = 1/8$. This $n^{-3}$ law sets how hyperfine splittings and contact interactions fall off with $n$.',
      trap: 'Using $1/n^2$ (from the energy) gives $1/4$.' },
    { id: 'qhy-022', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'nodes',
      q: 'The $2s$ radial function is $R_{20} \\propto (2 - r/a_0)e^{-r/2a_0}$. Its radial node is at',
      options: ['$r = a_0$', '$r = 2a_0$', '$r = 4a_0$', '$r = 0.5a_0$'], answer: 1,
      sol: 'The polynomial $2 - r/a_0$ vanishes at $r = 2a_0$. Inside that sphere $R_{20} > 0$, outside it is negative. This is the one ($n - l - 1 = 1$) radial node.' },
    { id: 'qhy-023', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'symmetry',
      q: 'For the hydrogen Hamiltonian $H = p^2/2\\mu - e^2/4\\pi\\epsilon_0 r$ (no spin), which operators commute with $H$?',
      options: ['$\\hat L^2$', '$\\hat L_x$', 'The parity operator $\\hat\\Pi$', '$\\hat p_z$'], answer: [0, 1, 2],
      sol: '$H$ is rotation invariant, so every component of $\\vec L$ and $L^2$ commute with it; it is also unchanged by $\\vec r \\to -\\vec r$, so parity commutes with it. $p_z$ does not: the potential depends on position, $[p_z, V] = -i\\hbar\\,\\partial V/\\partial z \\ne 0$. (The Runge-Lenz vector also commutes with $H$; that is the source of the $l$ degeneracy.)' },
    { id: 'qhy-024', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'symmetry',
      q: 'In hydrogen, the $2s$ and $2p$ levels have the same energy in the Schrödinger theory. This degeneracy is due to',
      options: ['rotational symmetry alone', 'the electron spin', 'parity conservation', 'an extra conserved quantity of the $1/r$ potential, the Runge-Lenz vector'], answer: 3,
      sol: 'Rotational symmetry explains only the $2l + 1$ degeneracy in $m$. The $1/r$ potential has an extra conserved vector (the quantum Runge-Lenz vector, the same one that keeps classical Kepler ellipses from precessing). Together with $\\vec L$ it generates an $SO(4)$ symmetry that mixes different $l$ of one $n$. Any deviation from $1/r$ (screening, relativity) lifts it.',
      trap: 'Parity cannot be the reason: $2s$ is even and $2p$ is odd.' },
    { id: 'qhy-025', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'expectation values',
      q: 'The mean radius of the hydrogen $3d$ state is ______ $a_0$ (to one decimal place).',
      answer: 10.5, tol: 0.05, calc: () => rAvg(3, 2),
      sol: '$\\langle r\\rangle = \\tfrac{a_0}{2}[3\\cdot9 - 2\\cdot3] = \\tfrac{21}{2}a_0 = 10.5a_0$, a little more than the most probable radius $9a_0$, because the tail is long.' },
    { id: 'qhy-026', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'radial probability',
      q: 'For the $3d$ state, $R_{32} \\propto r^2e^{-r/3a_0}$. The radial probability density is largest at',
      options: ['$9a_0$', '$3a_0$', '$10.5a_0$', '$4.5a_0$'], answer: 0,
      sol: '$P(r) \\propto r^6e^{-2r/3a_0}$. $dP/dr = 0$ gives $6/r = 2/3a_0$, so $r = 9a_0 = n^2a_0$. In general, for $l = n - 1$, $P \\propto r^{2n}e^{-2r/na_0}$ peaks at $n^2a_0$.' },
    { id: 'qhy-027', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'virial theorem',
      q: 'For a hydrogen state with $n = 3$, $\\langle p^2\\rangle = k\\,\\hbar^2/a_0^2$. The value of $k$ is ______ (to three decimal places).',
      answer: 0.111, tol: 0.002, calc: () => 1 / 9,
      sol: '$\\langle T\\rangle = -E_n = \\dfrac{\\hbar^2}{2\\mu a_0^2n^2}$ (since $13.6\\ \\text{eV} = \\hbar^2/2\\mu a_0^2$). So $\\langle p^2\\rangle = 2\\mu\\langle T\\rangle = \\hbar^2/(n^2a_0^2)$, and $k = 1/9 = 0.111$.' },
    { id: 'qhy-028', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'superposition',
      q: 'A hydrogen atom is in the state $\\psi = \\dfrac{1}{\\sqrt6}\\left(2\\psi_{100} + \\psi_{211} - \\psi_{320}\\right)$. Taking $E_n = -13.6/n^2$ eV, $\\langle E\\rangle$ is ______ eV (to two decimal places).',
      answer: -9.89, tol: 0.02, calc: () => (4 * -13.6 - 13.6 / 4 - 13.6 / 9) / 6,
      sol: 'Probabilities $4/6$, $1/6$, $1/6$ for $n = 1, 2, 3$. $\\langle E\\rangle = \\tfrac16[4(-13.6) + (-3.4) + (-1.511)] = \\tfrac{-59.31}{6} = -9.89$ eV. The signs of the coefficients do not matter for energy probabilities.' },
    { id: 'qhy-041', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'angular distribution',
      q: 'For an electron in $\\psi_{21,1}$ or $\\psi_{21,-1}$, where is the probability density largest for a given $r$?',
      options: ['Along the $z$-axis', 'In the $xy$-plane', 'Equally in all directions', 'At $45^\\circ$ to the $z$-axis'], answer: 1,
      sol: '$|Y_{1,\\pm1}|^2 \\propto \\sin^2\\theta$, largest at $\\theta = 90^\\circ$ (the $xy$-plane) and zero along $z$. A doughnut around $z$; $|Y_{10}|^2 \\propto \\cos^2\\theta$ instead points along $z$.' },

    // ---------- level 4 ----------
    { id: 'qhy-029', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'density at nucleus',
      q: 'Model the proton as a sphere of radius $b = 1.0$ fm. With $a_0 = 5.29\\times10^4$ fm and $b \\ll a_0$, the probability that the ground-state electron is inside the proton is $k\\times10^{-15}$, with $k =$ ______ (to one decimal place).',
      answer: 9.0, tol: 0.1, calc: () => 4 / (3 * 52900 ** 3) * 1e15,
      sol: 'Inside the tiny sphere $|\\psi|^2 \\approx |\\psi(0)|^2 = 1/\\pi a_0^3$. So $P \\approx \\dfrac{4\\pi b^3}{3}\\cdot\\dfrac{1}{\\pi a_0^3} = \\dfrac43\\left(\\dfrac{b}{a_0}\\right)^3 = \\dfrac43\\cdot\\dfrac{1}{1.48\\times10^{14}} = 9.0\\times10^{-15}$.',
      trap: 'Using $P(r) = 4r^2e^{-2r/a_0}/a_0^3$ evaluated at $r = b$ (a density per unit length) instead of integrating it.' },
    { id: 'qhy-030', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'expectation values',
      q: 'For the hydrogen $2p$ state, $R_{21} = \\dfrac{1}{2\\sqrt6}a_0^{-3/2}\\dfrac{r}{a_0}e^{-r/2a_0}$. The value of $\\langle 1/r^2\\rangle$ is',
      options: ['$\\dfrac{1}{8a_0^2}$', '$\\dfrac{1}{24a_0^2}$', '$\\dfrac{1}{12a_0^2}$', '$\\dfrac{1}{4a_0^2}$'], answer: 2,
      sol: '$\\langle r^{-2}\\rangle = \\int_0^\\infty R_{21}^2\\,dr = \\dfrac{1}{24a_0^5}\\int_0^\\infty r^2e^{-r/a_0}dr = \\dfrac{2a_0^3}{24a_0^5} = \\dfrac{1}{12a_0^2}$. The general result $\\langle r^{-2}\\rangle = 1/[n^3(l + \\tfrac12)a_0^2]$ gives $1/(8\\cdot1.5) = 1/12$ too.' },
    { id: 'qhy-031', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'sudden change',
      q: 'An electron is in the $1s$ state of a hydrogen-like ion with $Z = 2$. The nuclear charge suddenly changes to $Z = 3$ (much faster than the electron can respond). The probability that the electron is found in the $1s$ state of the new ion is ______ (to three decimal places).',
      answer: 0.885, tol: 0.003, calc: () => (8 * Math.pow(6, 1.5) / 125) ** 2,
      sol: 'Sudden approximation: the wavefunction is unchanged, so the amplitude is the overlap of $\\psi_Z = (Z^3/\\pi a_0^3)^{1/2}e^{-Zr/a_0}$ with $\\psi_{Z\'}$: $\\langle\\psi_{Z\'}|\\psi_Z\\rangle = \\dfrac{(ZZ\')^{3/2}}{\\pi a_0^3}\\,4\\pi\\int_0^\\infty r^2e^{-(Z + Z\')r/a_0}dr = \\dfrac{8(ZZ\')^{3/2}}{(Z + Z\')^3}$. With $Z = 2$, $Z\' = 3$: $8\\cdot6^{1.5}/125 = 0.9406$; probability $0.885$.',
      trap: 'Squaring is needed: 0.941 is the amplitude.' },
    { id: 'qhy-032', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'eigenfunctions',
      q: 'Which statements about the hydrogen eigenfunctions $\\psi_{nlm}$ are correct?',
      options: ['The parity of $\\psi_{nlm}$ is $(-1)^l$.', 'The radial function has $n - l - 1$ nodes.', 'Only $s$ states have non-zero density at the nucleus.', 'At fixed $n$, $\\langle r\\rangle$ increases with $l$.'], answer: [0, 1, 2],
      sol: 'Parity comes from $Y_{lm}$ alone. The radial polynomial has degree $n - l - 1$. $R_{nl} \\propto r^l$ near the origin, so only $l = 0$ survives there. $\\langle r\\rangle = \\tfrac{a_0}{2}[3n^2 - l(l+1)]$ decreases with $l$: circular-like orbits are more compact on average than penetrating $s$ orbits.' },
    { id: 'qhy-033', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'expectation values',
      q: 'The difference $\\langle r\\rangle_{3s} - \\langle r\\rangle_{3d}$ for hydrogen is ______ $a_0$.',
      answer: 3, tol: 0, calc: () => rAvg(3, 0) - rAvg(3, 2),
      sol: '$\\langle r\\rangle_{3s} = \\tfrac{27}{2}a_0 = 13.5a_0$ and $\\langle r\\rangle_{3d} = \\tfrac{27 - 6}{2}a_0 = 10.5a_0$. Difference $3a_0$. (Yet the $3s$ electron also spends more time very near the nucleus: it is spread both ways.)' },
    { id: 'qhy-034', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'selection rules',
      q: 'A hydrogen atom in a $3d$ state decays by electric dipole emission. Which lower states can it reach directly?',
      options: ['$2s$ and $2p$', '$2p$ only', '$1s$ and $2p$', '$2s$ only'], answer: 1,
      sol: 'The dipole operator $\\vec r$ is odd and carries angular momentum 1, so $\\Delta l = \\pm1$ (and $\\Delta m = 0, \\pm1$). From $l = 2$ only $l = 1$ is reachable, and the only lower $p$ state is $2p$. Then $2p \\to 1s$ finishes the cascade.' },
    { id: 'qhy-035', type: 'nat', level: 4, exams: ['net', 'gate'], sub: 'expectation values',
      q: 'For the hydrogen $2p$ state, $\\langle 1/r^3\\rangle = k/a_0^3$. The value of $k$ is ______ (to four decimal places).',
      answer: 0.0417, tol: 0.0003, calc: () => 1 / 24,
      sol: '$\\langle r^{-3}\\rangle = \\int R_{21}^2\\,r^{-1}dr = \\dfrac{1}{24a_0^5}\\int_0^\\infty r\\,e^{-r/a_0}dr = \\dfrac{a_0^2}{24a_0^5} = \\dfrac{1}{24a_0^3}$. General: $1/[n^3l(l+\\tfrac12)(l+1)a_0^3] = 1/(8\\cdot1\\cdot1.5\\cdot2) = 1/24$. This is the integral behind spin-orbit splitting.' },
    { id: 'qhy-036', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'eigenfunctions',
      q: 'The function $\\psi \\propto z\\,e^{-r/2a_0}$ for hydrogen is',
      options: ['an eigenstate with energy $-3.4$ eV', 'not an energy eigenstate', 'an eigenstate with energy $-13.6$ eV', 'an eigenstate with energy $-1.51$ eV'], answer: 0,
      sol: '$z = r\\cos\\theta \\propto rY_{10}$, so $\\psi \\propto r\\,e^{-r/2a_0}Y_{10}$: the radial part is $R_{21}$. It is $\\psi_{210}$ with $E_2 = -3.4$ eV. The decay length $2a_0 = na_0$ already points to $n = 2$.' },
    { id: 'qhy-042', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'expectation values',
      q: 'For $\\psi_{210}$, using $\\langle r^2\\rangle_{21} = 30a_0^2$, the value of $\\langle z^2\\rangle$ is',
      options: ['$10a_0^2$', '$30a_0^2$', '$6a_0^2$', '$18a_0^2$'], answer: 3,
      sol: '$\\langle z^2\\rangle = \\langle r^2\\rangle\\langle\\cos^2\\theta\\rangle$ because the state is a product of radial and angular parts. For $Y_{10}$: $\\langle\\cos^2\\theta\\rangle = \\tfrac{3}{4\\pi}\\int\\cos^4\\theta\\,d\\Omega = \\tfrac35$. So $\\langle z^2\\rangle = 18a_0^2$ (and $\\langle x^2\\rangle = \\langle y^2\\rangle = 6a_0^2$).',
      trap: 'Dividing by 3 as for a spherically symmetric state gives $10a_0^2$; $\\psi_{210}$ is stretched along $z$.' },

    // ---------- level 5 ----------
    { id: 'qhy-037', type: 'nat', level: 5, exams: ['net', 'gate'], sub: 'momentum space',
      q: 'The momentum-space ground state of hydrogen gives the probability density in $x = pa_0/\\hbar$ as $\\dfrac{32}{\\pi}\\dfrac{x^2}{(1 + x^2)^4}$. The probability that the momentum magnitude is less than $\\hbar/a_0$ is ______ (to three decimal places).',
      answer: 0.712, tol: 0.003, calc: () => 0.5 + 2 / (3 * Math.PI),
      sol: 'Put $x = \\tan\\theta$: $\\dfrac{x^2\\,dx}{(1 + x^2)^4} = \\sin^2\\theta\\cos^4\\theta\\,d\\theta = \\tfrac18(\\sin^22\\theta + \\sin^22\\theta\\cos2\\theta)\\,d\\theta$. From $0$ to $\\pi/4$: $\\tfrac18\\left(\\tfrac\\pi8 + \\tfrac16\\right)$. Times $32/\\pi$: $P = \\tfrac12 + \\tfrac{2}{3\\pi} = 0.712$.' },
    { id: 'qhy-038', type: 'nat', level: 5, exams: ['net', 'gate'], sub: 'superposition',
      q: 'At $t = 0$ a hydrogen atom is in $\\psi = \\tfrac{1}{\\sqrt2}(\\psi_{100} + \\psi_{200})$ (real radial functions with positive value at the origin). $\\langle r\\rangle$ at $t = 0$ is ______ $a_0$ (to two decimal places).',
      answer: 3.19, tol: 0.01, calc: () => 3.75 - 96 * Math.SQRT2 / 243,
      sol: '$\\langle r\\rangle = \\tfrac12(1.5 + 6)a_0 + \\langle100|r|200\\rangle$. With $R_{10} = 2a_0^{-3/2}e^{-r/a_0}$ and $R_{20} = \\tfrac{1}{\\sqrt2}a_0^{-3/2}(1 - r/2a_0)e^{-r/2a_0}$: $\\int R_{10}R_{20}r^3dr = \\sqrt2 a_0^{-3}\\left[3!\\left(\\tfrac{2a_0}{3}\\right)^4 - \\tfrac{1}{2a_0}4!\\left(\\tfrac{2a_0}{3}\\right)^5\\right] = \\sqrt2\\left(\\tfrac{96}{81} - \\tfrac{384}{243}\\right)a_0 = -0.559a_0$. So $\\langle r\\rangle = 3.75 - 0.559 = 3.19a_0$. Later the cross term oscillates as $\\cos[(E_2 - E_1)t/\\hbar]$.',
      trap: 'Dropping the cross term (giving 3.75): it vanishes only in a time average.' },
    { id: 'qhy-039', type: 'msq', level: 5, exams: ['net', 'gate'], sub: 'circular states',
      q: 'Consider the states with $l = n - 1$ ("circular" states) of hydrogen for large $n$. Which statements are correct?',
      options: ['The radial probability density peaks at $n^2a_0$.', '$\\Delta r/\\langle r\\rangle \\to 0$ as $n \\to \\infty$.', 'They have no radial nodes.', '$\\langle r\\rangle = n^2a_0$ exactly.'], answer: [0, 1, 2],
      sol: '$P \\propto r^{2n}e^{-2r/na_0}$ peaks at $n^2a_0$ and has no nodes. From the formulas, $\\langle r\\rangle = n(n + \\tfrac12)a_0$ (not exactly $n^2a_0$) and $\\langle r^2\\rangle = \\tfrac12n^2(n + 1)(2n + 1)a_0^2$, so $\\Delta r = \\tfrac12na_0\\sqrt{2n + 1}$ and $\\Delta r/\\langle r\\rangle = 1/\\sqrt{2n + 1} \\to 0$: a thin shell, the quantum version of a Bohr orbit.' },
    { id: 'qhy-040', type: 'nat', level: 5, exams: ['net', 'gate'], sub: 'modified coulomb',
      q: 'An electron moves in $V(r) = -\\dfrac{e^2}{4\\pi\\epsilon_0r} + \\dfrac{\\beta}{r^2}$ with $\\beta = \\hbar^2/m_e$ (so that $2m_e\\beta/\\hbar^2 = 2$). Taking $13.6$ eV for the hydrogen Rydberg, the ground-state energy is ______ eV (to two decimal places).',
      answer: -3.4, tol: 0.02, calc: () => -13.6 / 4,
      sol: 'The $\\beta/r^2$ term adds to the centrifugal term: $l(l+1) \\to l(l+1) + 2m_e\\beta/\\hbar^2 \\equiv s(s+1)$. For $l = 0$: $s(s+1) = 2$, so $s = 1$. The radial equation is then hydrogen\'s with $l$ replaced by $s$, so $E = -13.6/(n_r + s + 1)^2$ eV. Ground state $n_r = 0$: $E = -13.6/4 = -3.40$ eV.',
      trap: 'Treating $\\beta/r^2$ as a small perturbation: it is not small, but it is exactly solvable.' },
  ],
  gens: [
    { id: 'qhy-g01', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'expectation values',
      make(r) {
        const n = int(r, 1, 5), l = int(r, 0, n - 1), Z = choose(r, [1, 1, 2, 3]);
        const v = rAvg(n, l) / Z;
        return { q: `For the ${n}${L[l]} state of a hydrogen-like ion with $Z = ${Z}$, $\\langle r\\rangle = k\\,a_0$. Using $\\langle r\\rangle = \\dfrac{a_0}{2Z}[3n^2 - l(l+1)]$, $k =$ ______ (to two decimal places).`,
          answer: round(v, 2), tol: 0.01, n, l, Z,
          sol: `$n = ${n}$, $l = ${l}$: $\\langle r\\rangle = \\dfrac{a_0}{2\\cdot${Z}}[${3 * n * n} - ${l * (l + 1)}] = ${round(v, 2)}\\,a_0$. Every length scales as $a_0/Z$.` };
      },
      verify: (p) => rAvg(p.n, p.l) / p.Z },
    { id: 'qhy-g02', type: 'mcq', level: 1, exams: ['gate', 'net', 'jam'], sub: 'degeneracy',
      make(r) {
        const n = int(r, 2, 7), spin = r() < 0.5;
        const c = spin ? 2 * n * n : n * n;
        const o = mcqOptions(r, c, spin ? [n * n, 2 * n + 1, 2 * (2 * n - 1), n * (n + 1)] : [2 * n * n, 2 * n - 1, n, n * (n + 1) / 2], (v) => `$${v}$`);
        return { q: `The number of hydrogen eigenstates with $n = ${n}$, ${spin ? 'counting the two spin states' : 'ignoring spin'}, is`, ...o,
          sol: `$\\sum_{l=0}^{${n - 1}}(2l + 1) = ${n}^2 = ${n * n}$ orbital states${spin ? `, times 2 for spin: $${2 * n * n}$` : ''}.`,
          trap: spin ? 'Forgetting the factor 2 for spin.' : '$2n^2$ counts spin, which the question leaves out.' };
      } },
    { id: 'qhy-g03', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'nodes',
      make(r) {
        const n = int(r, 2, 6), l = int(r, 0, Math.min(n - 1, 4));
        const show = ([a, b]) => `${a} radial, ${b} angular`;
        const o = mcqOptions(r, [n - l - 1, l], [[n - l, l], [n - 1, l], [l, n - l - 1], [n - l - 1, l + 1], [n - l - 2 < 0 ? n : n - l - 2, l]], show);
        return { q: `How many nodes does the hydrogen ${n}${L[l]} orbital (with $m = 0$) have?`, ...o,
          sol: `Radial nodes: $n - l - 1 = ${n - l - 1}$. Angular nodal cones or planes: $l = ${l}$. Total $n - 1 = ${n - 1}$.` };
      } },
    { id: 'qhy-g04', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'radial probability',
      make(r) {
        const x = choose(r, [0.25, 0.5, 1.5, 2, 2.5, 3, 4]), out = r() < 0.4;
        const P = out ? 1 - inside(x) : inside(x);
        return { q: `The probability that the electron in the hydrogen ground state is found ${out ? 'farther from' : 'closer to'} the nucleus than ${x}$a_0$ is ______ (to three decimal places).`,
          answer: round(P, 3), tol: 0.002, x, out,
          sol: `With $y = 2r/a_0$, $\\int_0^R \\dfrac{4r^2}{a_0^3}e^{-2r/a_0}dr = 1 - e^{-2R/a_0}\\left[1 + \\dfrac{2R}{a_0} + 2\\dfrac{R^2}{a_0^2}\\right]$. For $R = ${x}a_0$ the bracket is $${round(1 + 2 * x + 2 * x * x, 4)}$ and $e^{-${2 * x}} = ${round(Math.exp(-2 * x), 5)}$, so P(inside) = ${round(inside(x), 4)}${out ? `, and the answer is $1 - ${round(inside(x), 4)} = ${round(P, 3)}$` : ''}.` };
      },
      verify: (p) => (p.out ? 1 - inside(p.x) : inside(p.x)) },
    { id: 'qhy-g05', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'virial theorem',
      make(r) {
        const n = int(r, 1, 4), Z = int(r, 1, 3), which = choose(r, ['kinetic', 'potential']);
        const E = -13.6 * Z * Z / (n * n), v = which === 'kinetic' ? -E : 2 * E;
        return { q: `For a hydrogen-like ion with $Z = ${Z}$ in a state with $n = ${n}$, the expectation value of the ${which} energy is ______ eV (to two decimal places). Take $13.6$ eV for the hydrogen Rydberg.`,
          answer: round(v, 2), tol: Math.max(0.02, Math.abs(v) * 0.002), n, Z, which,
          sol: `$E = -13.6Z^2/n^2 = ${round(E, 3)}$ eV. For a $1/r$ potential the virial theorem gives $\\langle T\\rangle = -E$ and $\\langle V\\rangle = 2E$, so the ${which} energy is $${round(v, 2)}$ eV.`,
          trap: 'The kinetic energy is positive and equals $|E|$; the potential energy is twice $E$.' };
      },
      verify: (p) => { const E = -13.6 * p.Z ** 2 / p.n ** 2; return p.which === 'kinetic' ? -E : 2 * E; } },
    { id: 'qhy-g06', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'superposition',
      make(r) {
        const n1 = int(r, 1, 2), n2 = n1 + int(r, 1, 2), a = int(r, 1, 3), b = int(r, 1, 3);
        const l2 = int(r, 0, n2 - 1);
        const E = (a * a * (-13.6 / (n1 * n1)) + b * b * (-13.6 / (n2 * n2))) / (a * a + b * b);
        return { q: `A hydrogen atom is in the (unnormalised) state $${a === 1 ? '' : a}\\psi_{${n1}00} - ${b === 1 ? '' : b}i\\,\\psi_{${n2}${l2}0}$. With $E_n = -13.6/n^2$ eV, $\\langle E\\rangle$ is ______ eV (to two decimal places).`,
          answer: round(E, 2), tol: 0.02, a, b, n1, n2,
          sol: `Probabilities $${a * a}/${a * a + b * b}$ and $${b * b}/${a * a + b * b}$ (phases do not matter). $\\langle E\\rangle = \\dfrac{${a * a}(${round(-13.6 / (n1 * n1), 3)}) + ${b * b}(${round(-13.6 / (n2 * n2), 3)})}{${a * a + b * b}} = ${round(E, 2)}$ eV.` };
      },
      verify: (p) => (p.a ** 2 * (-13.6 / p.n1 ** 2) + p.b ** 2 * (-13.6 / p.n2 ** 2)) / (p.a ** 2 + p.b ** 2) },
    { id: 'qhy-g07', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'radial probability',
      make(r) {
        const n = int(r, 2, 6), Z = int(r, 1, 3);
        const v = n * n * 0.0529 / Z;
        return { q: `For the hydrogen-like ion with $Z = ${Z}$ in the state $n = ${n}$, $l = ${n - 1}$, the radial probability density peaks at ______ nm (to three decimal places). Take $a_0 = 0.0529$ nm.`,
          answer: round(v, 3), tol: Math.max(0.001, v * 0.005), n, Z,
          sol: `For $l = n - 1$ there are no radial nodes and $P(r) \\propto r^{2n}e^{-2Zr/na_0}$. $dP/dr = 0$ gives $r = n^2a_0/Z = ${n * n}\\times0.0529/${Z} = ${round(v, 3)}$ nm.` };
      },
      verify: (p) => p.n ** 2 * 0.0529 / p.Z },
    { id: 'qhy-g08', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'density at nucleus',
      make(r) {
        const n1 = int(r, 1, 3), n2 = n1 + int(r, 1, 3);
        const v = (n2 / n1) ** 3;
        return { q: `The ratio of the electron densities at the nucleus, $|\\psi_{${n1}00}(0)|^2/|\\psi_{${n2}00}(0)|^2$, in hydrogen is ______ (to two decimal places).`,
          answer: round(v, 2), tol: 0.01, n1, n2,
          sol: `$|\\psi_{n00}(0)|^2 = 1/(\\pi a_0^3n^3)$, so the ratio is $(${n2}/${n1})^3 = ${round(v, 2)}$.`,
          trap: 'Using $n^2$ (the energy scaling) instead of $n^3$.' };
      },
      verify: (p) => (p.n2 / p.n1) ** 3 },
    { id: 'qhy-g09', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'radial equation',
      make(r) {
        const l = int(r, 1, 5), what = choose(r, ['radius', 'energy']);
        const v = what === 'radius' ? l * (l + 1) : -13.6 / (l * (l + 1));
        return { q: `For hydrogen with $l = ${l}$, the effective potential $V_{\\text{eff}}(r) = -\\dfrac{e^2}{4\\pi\\epsilon_0 r} + \\dfrac{l(l+1)\\hbar^2}{2m_er^2}$ has a minimum. ${what === 'radius' ? 'Its position is ______ $a_0$.' : 'Its value is ______ eV (to two decimal places; take $e^2/8\\pi\\epsilon_0a_0 = 13.6$ eV).'}`,
          answer: what === 'radius' ? v : round(v, 2), tol: what === 'radius' ? 0 : 0.02, l, what,
          sol: `In units $\\rho = r/a_0$ and Rydbergs, $V_{\\text{eff}} = -2/\\rho + l(l+1)/\\rho^2$. $dV/d\\rho = 2/\\rho^2 - 2l(l+1)/\\rho^3 = 0$ gives $\\rho = l(l+1) = ${l * (l + 1)}$, and $V_{\\min} = -1/[l(l+1)]$ Ry $= -13.6/${l * (l + 1)} = ${round(-13.6 / (l * (l + 1)), 2)}$ eV. ${what === 'radius' ? `Answer: $${l * (l + 1)}a_0$.` : ''} The quantum level $E_{n = l+1} = -13.6/(l + 1)^2$ eV lies above this minimum, as it must (zero-point motion).` };
      },
      verify: (p) => (p.what === 'radius' ? p.l * (p.l + 1) : -13.6 / (p.l * (p.l + 1))) },
    { id: 'qhy-g10', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'selection rules',
      make(r) {
        const ok = [], bad = [];
        for (let n1 = 2; n1 <= 5; n1++) for (let l1 = 0; l1 < Math.min(n1, 4); l1++) for (let n2 = 1; n2 < n1; n2++) for (let l2 = 0; l2 < Math.min(n2, 4); l2++) {
          const s = `$${n1}${L[l1]} \\to ${n2}${L[l2]}$`;
          if (Math.abs(l1 - l2) === 1) ok.push(s); else bad.push(s);
        }
        const c = choose(r, ok), w = shuffle(r, bad).slice(0, 3);
        const o = mcqOptions(r, c, w);
        return { q: 'Which ONE of these hydrogen transitions is allowed for electric dipole emission?', ...o,
          sol: `Electric dipole transitions need $\\Delta l = \\pm1$ (the operator $\\vec r$ is odd and carries one unit of angular momentum); $\\Delta n$ can be anything. Only ${c} has $\\Delta l = \\pm1$; the others have $\\Delta l = 0$ or $\\pm2$.`,
          trap: '$\\Delta l = 0$ transitions such as $2s \\to 1s$ are forbidden ($2s$ is metastable).' };
      } },
    { id: 'qhy-g11', type: 'nat', level: 4, exams: ['net', 'gate'], sub: 'circular states',
      make(r) {
        const n = int(r, 2, 8), what = choose(r, ['dr', 'ratio']);
        const dr = n * Math.sqrt(2 * n + 1) / 2, ratio = 1 / Math.sqrt(2 * n + 1);
        const v = what === 'dr' ? dr : ratio;
        return { q: `For the hydrogen state $n = ${n}$, $l = ${n - 1}$, ${what === 'dr' ? 'the uncertainty $\\Delta r$ in units of $a_0$' : 'the ratio $\\Delta r/\\langle r\\rangle$'} is ______ (to three decimal places). Use $\\langle r\\rangle = \\tfrac{a_0}{2}[3n^2 - l(l+1)]$ and $\\langle r^2\\rangle = \\tfrac{a_0^2n^2}{2}[5n^2 + 1 - 3l(l+1)]$.`,
          answer: round(v, 3), tol: Math.max(0.002, v * 0.003), n, what,
          sol: `With $l = n - 1$: $\\langle r\\rangle = n(n + \\tfrac12)a_0 = ${round(rAvg(n, n - 1), 3)}a_0$ and $\\langle r^2\\rangle = \\tfrac12n^2(n+1)(2n+1)a_0^2 = ${round(r2Avg(n, n - 1), 3)}a_0^2$. So $\\Delta r = \\tfrac12n\\sqrt{2n+1}\\,a_0 = ${round(dr, 3)}a_0$ and $\\Delta r/\\langle r\\rangle = 1/\\sqrt{2n+1} = ${round(ratio, 3)}$.` };
      },
      verify: (p) => { const m = rAvg(p.n, p.n - 1), s = Math.sqrt(r2Avg(p.n, p.n - 1) - m * m); return p.what === 'dr' ? s : s / m; } },
    { id: 'qhy-g12', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'expectation values',
      make(r) {
        const n = int(r, 1, 4), l = int(r, 0, n - 1), Z = int(r, 1, 3);
        const num = Z * Z, den = n * n * n * (2 * l + 1); // <1/r²> = Z²/(n³(l+½)a²) = 2Z²/(n³(2l+1)a²)
        const g = (a, b) => (b ? g(b, a % b) : a);
        const show = ([a, b]) => { const k = g(a, b); return b / k === 1 ? `$${a / k}/a_0^2$` : `$\\dfrac{${a / k}}{${b / k}a_0^2}$`; };
        const o = mcqOptions(r, [2 * num, den], [[num, den], [Z, n * n], [2 * num, n * n * (2 * l + 1)], [num, n * n * n], [4 * num, den], [2 * Z, den], [num, 4 * den]], show);
        return { q: `For the ${n}${L[l]} state of a hydrogen-like ion with $Z = ${Z}$, $\\langle 1/r^2\\rangle$ equals (use $\\langle r^{-2}\\rangle = Z^2/[n^3(l + \\tfrac12)a_0^2]$)`, ...o,
          sol: `$\\langle r^{-2}\\rangle = \\dfrac{${Z}^2}{${n}^3(${l} + \\tfrac12)a_0^2} = \\dfrac{${2 * num}}{${den}a_0^2}$ (simplify the fraction). Unlike $\\langle 1/r\\rangle = Z/n^2a_0$, it depends on $l$, which is why fine structure lifts the $l$ degeneracy.` };
      } },
  ],
};
