// Band theory at MSc level: Bloch's theorem and crystal momentum, counting states in a band, the Kronig-Penney
// model, nearly free electrons (gaps 2|U_G|, standing waves, effective mass near a gap), tight binding in 1D, 2D
// and 3D (bandwidths, effective mass, group velocity), Brillouin zones, metals and insulators by electron count,
// semiclassical dynamics and Bloch oscillations, effective-mass tensors.
// Original questions for GATE and CSIR NET practice (fibub). Levels: 1 warm-up ... 5 top rank.
import { int, pick, choose, round, mcqOptions, C } from '../_util.js';
import more from './band-theory.more.gen.js';

const HB2M = (C.hbar ** 2) / (2 * C.me) / C.e * 1e18; // hbar^2/2m_e in eV nm^2 (0.0381)
const H_eVs = C.h / C.e; // Planck constant in eV s
// root of f on [a, b] by bisection (fixed 200 steps, no random draws)
const bisect = (f, a, b) => { let fa = f(a); for (let i = 0; i < 200; i++) { const m = (a + b) / 2, fm = f(m); if (fa * fm <= 0) b = m; else { a = m; fa = fm; } } return (a + b) / 2; };
const kpRHS = (P) => (x) => Math.cos(x) + P * Math.sin(x) / x;

export default {
  topic: 'band-theory',
  items: [
    // ---------- level 1 ----------
    { id: 'bth-001', type: 'mcq', level: 1, exams: ['gate', 'net', 'jam'], sub: 'Bloch theorem',
      q: 'Bloch\'s theorem says that an electron eigenstate in a periodic potential $V(\\mathbf r + \\mathbf R) = V(\\mathbf r)$ can be written as',
      options: ['$\\psi(\\mathbf r) = e^{i\\mathbf k\\cdot\\mathbf r}$, a pure plane wave', '$\\psi(\\mathbf r) = u(\\mathbf r)$ with $u$ periodic', '$\\psi(\\mathbf r) = e^{i\\mathbf k\\cdot\\mathbf r}u_{\\mathbf k}(\\mathbf r)$ with $u_{\\mathbf k}(\\mathbf r + \\mathbf R) = u_{\\mathbf k}(\\mathbf r)$', '$\\psi(\\mathbf r) = e^{-\\kappa r}u(\\mathbf r)$, a decaying wave'], answer: 2,
      sol: 'The Hamiltonian commutes with every lattice translation $T_{\\mathbf R}$, so eigenstates can be chosen with $T_{\\mathbf R}\\psi = e^{i\\mathbf k\\cdot\\mathbf R}\\psi$. That is the same as a plane wave times a lattice-periodic function. Equivalently $\\psi(\\mathbf r + \\mathbf R) = e^{i\\mathbf k\\cdot\\mathbf R}\\psi(\\mathbf r)$: $|\\psi|^2$ is periodic.' },
    { id: 'bth-002', type: 'mcq', level: 1, exams: ['gate', 'net', 'jam'], sub: 'counting states',
      q: 'A crystal has $N$ primitive cells and periodic boundary conditions. The number of distinct $\\mathbf k$ values in one energy band (in the first Brillouin zone) is',
      options: ['$N$', '$2N$', '$N/2$', 'the number of electrons per cell times $N$'], answer: 0,
      sol: 'Allowed $\\mathbf k$ form a grid with one point per $(2\\pi)^3/V$ of $k$-space; the zone has volume $(2\\pi)^3/V_{\\rm cell}$, so it holds $V/V_{\\rm cell} = N$ points. With two spin states each band holds $2N$ electrons, i.e. 2 per primitive cell.',
      trap: '$2N$ counts electrons (with spin), not $\\mathbf k$ values.' },
    { id: 'bth-003', type: 'msq', level: 1, exams: ['gate', 'net'], sub: 'crystal momentum',
      q: 'Which statements about the crystal momentum $\\hbar\\mathbf k$ of a Bloch electron are correct?',
      options: ['In a uniform force $\\mathbf F$ it changes as $\\hbar\\dot{\\mathbf k} = \\mathbf F$.', 'It is defined only up to $\\hbar\\mathbf G$, where $\\mathbf G$ is a reciprocal lattice vector.', 'It labels the eigenvalue of the lattice translation operators.', 'A Bloch state is an eigenstate of the momentum operator $-i\\hbar\\nabla$ with eigenvalue $\\hbar\\mathbf k$.'], answer: [0, 1, 2],
      sol: '$e^{i\\mathbf k\\cdot\\mathbf R}$ is unchanged by $\\mathbf k \\to \\mathbf k + \\mathbf G$, so $\\mathbf k$ is defined modulo $\\mathbf G$ and labels the translation eigenvalue. Since $u_{\\mathbf k}$ is not constant, $-i\\hbar\\nabla\\psi \\ne \\hbar\\mathbf k\\psi$: the state mixes momenta $\\hbar(\\mathbf k + \\mathbf G)$. The semiclassical equation $\\hbar\\dot{\\mathbf k} = \\mathbf F$ holds for external forces (the lattice force is already inside the band structure).' },
    { id: 'bth-004', type: 'mcq', level: 1, exams: ['gate', 'net', 'jam'], sub: 'metals and insulators',
      q: 'A crystal of a monovalent element has one atom per primitive cell. In the independent-electron band picture it must be',
      options: ['an insulator, because the band is full', 'a semiconductor with a small gap', 'an insulator or a metal depending on the gap', 'a metal, because its highest band is half full'], answer: 3,
      sol: 'Each band holds 2 electrons per primitive cell. One electron per cell fills the lowest band exactly halfway, leaving empty states just above the Fermi level, so the crystal conducts: alkali and noble metals. (Strong electron-electron repulsion can still make a Mott insulator, which is outside the independent-electron picture.)' },
    { id: 'bth-005', type: 'nat', level: 1, exams: ['gate', 'net', 'jam'], sub: 'counting states',
      q: 'Including spin, the number of electrons per primitive cell needed to fill one band completely is ______.',
      answer: 2, tol: 0,
      sol: 'One $\\mathbf k$ per primitive cell in each band (there are $N$ cells and $N$ values of $\\mathbf k$), and two spin states per $\\mathbf k$: 2 electrons per cell.' },
    { id: 'bth-006', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'group velocity',
      q: 'In a one-dimensional crystal with a gap at the zone boundary $k = \\pi/a$, the group velocity of an electron at the zone boundary is',
      options: ['$\\hbar\\pi/ma$', 'zero', 'the speed of light', 'infinite'], answer: 1,
      sol: '$v = \\dfrac1\\hbar\\dfrac{dE}{dk}$. At the boundary the states are standing waves ($e^{i\\pi x/a} \\pm e^{-i\\pi x/a}$, Bragg reflected), and $E(k)$ is flat: $dE/dk = 0$. Since $E(k)$ is even and periodic with period $2\\pi/a$, $dE/dk$ must vanish at $k = \\pm\\pi/a$.' },

    // ---------- level 2 ----------
    { id: 'bth-007', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'empty lattice',
      q: 'In a one-dimensional crystal with lattice constant $0.30$ nm, the free-electron energy at the first zone boundary is ______ eV (to two decimal places). Take $\\hbar^2/2m_e = 0.0381$ eV nm$^2$.',
      answer: 4.18, tol: 0.03, calc: () => HB2M * (Math.PI / 0.3) ** 2,
      sol: 'The boundary is at $k = \\pi/a = 10.47$ nm$^{-1}$. $E = \\dfrac{\\hbar^2}{2m}k^2 = 0.0381\\times109.7 = 4.18$ eV. A weak potential opens the gap around this energy.' },
    { id: 'bth-008', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'nearly free electrons',
      q: 'For nearly free electrons in a weak potential $V(\\mathbf r) = \\sum_{\\mathbf G}U_{\\mathbf G}e^{i\\mathbf G\\cdot\\mathbf r}$, the energy gap at the Bragg plane bisecting $\\mathbf G$ is, to first order,',
      options: ['$|U_{\\mathbf G}|$', '$2|U_{\\mathbf G}|$', '$|U_{\\mathbf G}|^2$', '$4|U_{\\mathbf G}|$'], answer: 1,
      sol: 'At the plane, $|\\mathbf k| = |\\mathbf k - \\mathbf G|$ so the two plane waves are degenerate. The $2\\times2$ matrix $\\begin{pmatrix}E^0 & U_{\\mathbf G}^*\\\\ U_{\\mathbf G} & E^0\\end{pmatrix}$ has eigenvalues $E^0 \\pm |U_{\\mathbf G}|$, a gap of $2|U_{\\mathbf G}|$.',
      trap: 'Using non-degenerate perturbation theory, which gives a shift of order $|U|^2$ and fails at the boundary.' },
    { id: 'bth-009', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'nearly free electrons',
      q: 'At the first zone boundary of a 1D crystal with attractive ions at $x = na$, the two standing waves are $\\psi_+ \\propto \\cos(\\pi x/a)$ and $\\psi_- \\propto \\sin(\\pi x/a)$. Which statement is correct?',
      options: ['$\\psi_-$ is lower in energy because it piles charge on the ions', 'both have the same energy, since $|\\psi_+|^2$ and $|\\psi_-|^2$ have the same average', '$\\psi_+$ is lower in energy because it piles charge on the ions, where the potential is most negative', 'neither is a solution; only travelling waves exist at the boundary'], answer: 2,
      sol: '$|\\psi_+|^2 \\propto \\cos^2(\\pi x/a)$ peaks at $x = na$, on the ions; $|\\psi_-|^2 \\propto \\sin^2$ peaks halfway between. With attractive ions the potential energy is lower for $\\psi_+$. The difference of the two potential energies is the gap $2|U_G|$.' },
    { id: 'bth-010', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'tight binding',
      q: 'A tight-binding s band in a linear chain has $E(k) = E_0 - 2t\\cos ka$ with hopping $t = 0.50$ eV. Its bandwidth is ______ eV.',
      answer: 2, tol: 0, calc: () => 4 * 0.5,
      sol: 'The cosine runs from $+1$ (at $k = 0$, $E = E_0 - 2t$) to $-1$ (at $k = \\pi/a$, $E = E_0 + 2t$). Bandwidth $= 4t = 2.0$ eV. In general it is $2zt$ for $z$ nearest neighbours in simple lattices.',
      trap: 'Answering $2t$: the cosine swings through 2, so the band spans $4t$.' },
    { id: 'bth-011', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'effective mass',
      q: 'For the band $E(k) = E_0 - 2t\\cos ka$ with $t > 0$, the effective mass at the band bottom is',
      options: ['$\\dfrac{\\hbar^2}{ta^2}$', '$\\dfrac{2\\hbar^2}{ta^2}$', '$\\dfrac{\\hbar^2}{4ta^2}$', '$\\dfrac{\\hbar^2}{2ta^2}$'], answer: 3,
      sol: 'Near $k = 0$: $E \\approx E_0 - 2t + ta^2k^2$. Comparing with $\\hbar^2k^2/2m^*$: $m^* = \\hbar^2/2ta^2$. Equivalently $1/m^* = \\hbar^{-2}d^2E/dk^2 = 2ta^2\\cos(ka)/\\hbar^2$ at $k = 0$. Weak hopping (narrow band) means heavy electrons.' },
    { id: 'bth-012', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'effective mass',
      q: 'For an electron in a band $E(k)$ in one dimension, with $1/m^* = \\hbar^{-2}\\,d^2E/dk^2$, which statements are correct?',
      options: ['$|m^*|$ becomes infinite where $E(k)$ has an inflection point.', '$m^*$ equals the free mass in every band of a crystal.', '$m^*$ is negative near the top of a band.', 'A flatter band near its minimum gives a larger $m^*$.'], answer: [0, 2, 3],
      sol: 'Near a maximum $d^2E/dk^2 < 0$, so $m^* < 0$: a force pushes the electron backwards (Bragg reflection). Small curvature means large $m^*$. At an inflection point the curvature passes through zero and $1/m^* = 0$. Only in the empty lattice is $m^* = m$ everywhere.' },
    { id: 'bth-013', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'Brillouin zones',
      q: 'The first Brillouin zone of a face-centred cubic crystal is',
      options: ['a cube', 'a rhombic dodecahedron', 'a truncated octahedron', 'a hexagonal prism'], answer: 2,
      sol: 'The reciprocal of fcc is bcc. The first zone is the Wigner-Seitz cell of that bcc lattice: a truncated octahedron with 8 hexagonal faces (towards the 8 nearest $\\{111\\}$ points, L) and 6 square faces (towards the $\\{200\\}$ points, X). The rhombic dodecahedron is the zone of a bcc crystal.',
      trap: 'Swapping the two: the zone shape is the Wigner-Seitz cell of the reciprocal lattice, not of the real lattice.' },
    { id: 'bth-014', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'tight binding',
      q: 'An s band in a simple cubic crystal with nearest-neighbour hopping $t = 0.25$ eV has $E = E_0 - 2t(\\cos k_xa + \\cos k_ya + \\cos k_za)$. Its bandwidth is',
      options: ['$1.5$ eV', '$1.0$ eV', '$3.0$ eV', '$6.0$ eV'], answer: 2,
      sol: 'The bracket runs from $3$ (at $\\Gamma$) to $-3$ (at R, $(\\pi/a, \\pi/a, \\pi/a)$), a range of 6. Bandwidth $= 2t\\times6 = 12t = 3.0$ eV, which is $2zt$ with $z = 6$ neighbours.' },
    { id: 'bth-015', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'metals and insulators',
      q: 'Magnesium has two valence electrons and one atom per primitive cell, yet it is a metal. The band-theory reason is that',
      options: ['the lowest band and the next band overlap in energy, so both are partly filled', 'magnesium has a half-filled band', 'electrons in magnesium are free and there are no gaps at all', 'magnesium has two atoms per primitive cell'], answer: 0,
      sol: 'Two electrons per cell could exactly fill one band, but in 3D the top of the first band (at the zone corners) lies above the bottom of the second band (at the face centres). Electrons spill over, leaving holes in band 1 and electrons in band 2: a metal (in fact a semimetal-like compensated metal for some divalent elements).' },
    { id: 'bth-016', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'zone schemes',
      q: 'In the reduced zone scheme, a free-electron state with wave vector $k = 3\\pi/2a$ in a 1D lattice of spacing $a$ is drawn at',
      options: ['$k = 3\\pi/2a$ in the first band', '$k = -\\pi/2a$ in the second band', '$k = \\pi/2a$ in the first band', '$k = -3\\pi/2a$ in the third band'], answer: 1,
      sol: 'Shift by the reciprocal lattice vector $G = 2\\pi/a$ into $-\\pi/a < k \\le \\pi/a$: $3\\pi/2a - 2\\pi/a = -\\pi/2a$. Its energy $\\hbar^2(3\\pi/2a)^2/2m$ lies between the first and second boundary energies, so it belongs to the second band.' },
    { id: 'bth-041', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'tight binding',
      q: 'For the 1D tight-binding band $E(k) = E_0 - 2t\\cos ka$ ($t > 0$), which statements are correct?',
      options: ['The effective mass is negative near $k = \\pm\\pi/a$.', 'The group velocity is largest in magnitude at $ka = \\pm\\pi/2$.', 'The bandwidth is $2t$.', '$E(k)$ is periodic in $k$ with period $2\\pi/a$.'], answer: [0, 1, 3],
      sol: '$\\cos ka$ has period $2\\pi/a$. $d^2E/dk^2 = 2ta^2\\cos ka < 0$ for $|ka| > \\pi/2$, so $m^* < 0$ near the boundary. $v = 2ta\\sin(ka)/\\hbar$ peaks at $ka = \\pm\\pi/2$, where $m^*$ is infinite. The bandwidth is $4t$.' },

    // ---------- level 3 ----------
    { id: 'bth-017', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Bloch oscillations',
      q: 'An electron in a perfect 1D crystal with lattice constant $0.50$ nm feels a uniform field of $1.0\\times10^6$ V/m and is never scattered. The period of its Bloch oscillation is ______ ps (to two decimal places).',
      answer: 8.27, tol: 0.08, calc: () => H_eVs / (1e6 * 0.5e-9) * 1e12,
      sol: '$\\hbar\\dot k = -eE$ carries $k$ across the zone ($2\\pi/a$) in $T = \\dfrac{2\\pi\\hbar}{eEa} = \\dfrac{h}{eEa}$. With $h = 4.136\\times10^{-15}$ eV s and $eEa = 5.0\\times10^{-4}$ eV: $T = 8.27\\times10^{-12}$ s. In real metals $\\tau \\sim 10^{-14}$ s, so scattering always wins; Bloch oscillations are seen in superlattices with large $a$.' },
    { id: 'bth-018', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'Kronig-Penney model',
      q: 'In the Kronig-Penney model with delta-function barriers, the allowed energies satisfy $\\cos ka = \\cos\\alpha a + P\\,\\dfrac{\\sin\\alpha a}{\\alpha a}$ with $E = \\hbar^2\\alpha^2/2m$ and $P > 0$. Which statements are correct?',
      options: ['As $P \\to 0$ the free-electron parabola is recovered.', 'As $P \\to \\infty$ each band shrinks to a level $E = n^2\\pi^2\\hbar^2/2ma^2$, the levels of a box of width $a$.', 'Allowed bands become wider at higher energy.', 'The upper edge of the first band moves to higher $\\alpha a$ as $P$ increases.'], answer: [0, 1, 2],
      sol: 'With $P = 0$, $\\cos ka = \\cos\\alpha a$ gives $\\alpha = k$. For large $P$ the right side lies within $[-1, 1]$ only very near the zeros of $\\sin\\alpha a$, $\\alpha a = n\\pi$: isolated wells. The term $P\\sin(\\alpha a)/\\alpha a$ shrinks as $\\alpha a$ grows, so a larger fraction of the energy axis is allowed. Each band\'s upper edge is fixed at $\\alpha a = n\\pi$ (where $\\sin = 0$ and $\\cos = \\pm1$) whatever $P$ is; increasing $P$ raises the lower edges.' },
    { id: 'bth-019', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Kronig-Penney model',
      q: 'For the delta-function Kronig-Penney model with $P = 3\\pi/2$, the bottom of the lowest allowed band (where $k = 0$) occurs at $\\alpha a =$ ______ (to two decimal places).',
      answer: 2.25, tol: 0.01, calc: () => bisect((x) => kpRHS(3 * Math.PI / 2)(x) - 1, 1e-6, Math.PI),
      sol: 'At $k = 0$ we need $\\cos x + \\tfrac{3\\pi}{2}\\dfrac{\\sin x}{x} = 1$ with $x = \\alpha a$. At $x \\to 0$ the left side is $1 + 4.71 = 5.71$; at $x = \\pi$ it is $-1$. Trying values: $x = 2.2$ gives $-0.589 + 4.712\\times0.367 = 1.141$; $x = 2.3$ gives $-0.666 + 4.712\\times0.324 = 0.862$. Interpolating, $x = 2.25$. Below this energy no real $k$ exists: the lowest band starts well above zero.' },
    { id: 'bth-020', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'tight binding',
      q: 'For the simple-cubic tight-binding band $E = E_0 - 2t(\\cos k_xa + \\cos k_ya + \\cos k_za)$ with $t > 0$, which statements are correct?',
      options: ['Half filling gives a spherical Fermi surface.', 'The bandwidth is $12t$.', 'Near $\\Gamma$ the constant-energy surfaces are spheres and $m^* = \\hbar^2/2ta^2$.', 'The band maximum is at the zone corner $(\\pi/a, \\pi/a, \\pi/a)$.'], answer: [1, 2, 3],
      sol: 'Expanding near $\\Gamma$: $E \\approx E_0 - 6t + ta^2k^2$, isotropic, $m^* = \\hbar^2/2ta^2$. The maximum $E_0 + 6t$ is at R, the corner. At half filling the Fermi energy is $E_0$, where $\\cos k_xa + \\cos k_ya + \\cos k_za = 0$, a strongly non-spherical surface that touches the zone faces.' },
    { id: 'bth-021', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'effective mass',
      q: 'A simple-cubic tight-binding s band has hopping $t = 1.0$ eV and lattice constant $0.25$ nm. The effective mass at the band bottom is ______ $m_e$ (to three decimal places). Take $\\hbar^2/2m_e = 0.0381$ eV nm$^2$.',
      answer: 0.610, tol: 0.005, calc: () => HB2M / (1.0 * 0.25 ** 2),
      sol: '$m^* = \\dfrac{\\hbar^2}{2ta^2}$, so $\\dfrac{m^*}{m_e} = \\dfrac{\\hbar^2/2m_e}{ta^2} = \\dfrac{0.0381}{1.0\\times0.0625} = 0.610$.' },
    { id: 'bth-022', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'holes',
      q: 'One electron is removed from state $\\mathbf k_e$ near the top of an otherwise full band. The resulting hole has',
      options: ['wave vector $-\\mathbf k_e$, positive charge and positive effective mass', 'wave vector $\\mathbf k_e$, positive charge and negative effective mass', 'wave vector $-\\mathbf k_e$, negative charge and negative effective mass', 'no wave vector, because a full band carries no current'], answer: 0,
      sol: 'A full band has total $\\mathbf k = 0$, so removing $\\mathbf k_e$ leaves $\\mathbf k_h = -\\mathbf k_e$. Its velocity equals that of the missing electron, $\\mathbf v_h = \\mathbf v(\\mathbf k_e)$, and it responds to fields as charge $+e$. Near the band top the electron mass is negative, so $m_h = -m_e^* > 0$.' },
    { id: 'bth-023', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'nearly free electrons',
      q: 'Electrons in a 1D crystal feel $V(x) = 0.60\\cos(2\\pi x/a) + 0.20\\cos(4\\pi x/a)$ eV. To first order in $V$, the gap at the second zone boundary ($k = 2\\pi/a$) is ______ eV.',
      answer: 0.2, tol: 0.001, calc: () => 2 * 0.1,
      sol: 'Write $\\cos(Gx) = \\tfrac12(e^{iGx} + e^{-iGx})$: $U_{2\\pi/a} = 0.30$ eV and $U_{4\\pi/a} = 0.10$ eV. The boundary $k = 2\\pi/a$ is the Bragg plane of $G = 4\\pi/a$, so the gap there is $2|U_{4\\pi/a}| = 0.20$ eV. (The first boundary gap is $2\\times0.30 = 0.60$ eV.)',
      trap: 'Using the amplitude of the cosine as $U_G$ (it is twice $U_G$), or the first Fourier component for the second gap.' },
    { id: 'bth-024', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'metals and insulators',
      q: 'In the independent-electron band picture, which of the following must be a metal?',
      options: ['A crystal with 2 electrons per primitive cell', 'A crystal with 4 electrons per primitive cell', 'A crystal with 3 electrons per primitive cell', 'A crystal of diamond structure with 8 valence electrons per cell'], answer: 2,
      sol: 'Each band takes 2 electrons per cell. An odd number per cell always leaves a band partly filled: a metal. An even number may fill bands exactly (insulator or semiconductor, as in diamond, Si) or may not if bands overlap (Mg, Zn). Even is necessary, not sufficient, for an insulator.' },
    { id: 'bth-025', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'Brillouin zones',
      q: 'Which statements about Brillouin zones are correct?',
      options: ['The first Brillouin zone of a bcc crystal is a truncated octahedron.', 'The volume of the first zone is $(2\\pi)^3/V_{\\rm cell}$, where $V_{\\rm cell}$ is the primitive cell volume.', 'Every Brillouin zone (first, second, ...) has the same volume.', 'The first Brillouin zone is the Wigner-Seitz cell of the reciprocal lattice.'], answer: [1, 2, 3],
      sol: 'Every zone, shifted back by reciprocal lattice vectors, exactly fills the first zone once, so all have volume $(2\\pi)^3/V_{\\rm cell}$. The first zone is the Wigner-Seitz cell of the reciprocal lattice. bcc has an fcc reciprocal lattice, whose Wigner-Seitz cell is the rhombic dodecahedron; the truncated octahedron belongs to an fcc crystal.' },
    { id: 'bth-026', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'group velocity',
      q: 'For the band $E = E_0 - 2t\\cos ka$ with $t = 1.0$ eV and $a = 0.30$ nm, the largest possible electron speed is ______ $\\times10^5$ m/s (to two decimal places).',
      answer: 9.12, tol: 0.08, calc: () => 2 * C.e * 0.3e-9 / C.hbar / 1e5,
      sol: '$v = \\dfrac1\\hbar\\dfrac{dE}{dk} = \\dfrac{2ta}{\\hbar}\\sin ka$, largest at $ka = \\pi/2$: $v_{\\max} = \\dfrac{2\\times1.602\\times10^{-19}\\times0.30\\times10^{-9}}{1.055\\times10^{-34}} = 9.12\\times10^5$ m/s.' },
    { id: 'bth-027', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Bloch oscillations',
      q: 'In the semiclassical model, an electron in a single band of a perfect crystal (no scattering) in a constant electric field',
      options: ['accelerates without limit, so the current grows forever', 'moves at a constant drift velocity', 'stops at the zone boundary and stays there', 'oscillates in real space, because $k$ sweeps through the zone and $v(k)$ changes sign'], answer: 3,
      sol: '$\\hbar\\dot k = -eE$ makes $k$ increase steadily; on reaching the zone boundary it reappears at the opposite side (equivalent $k$). The velocity $v(k)$ is periodic and averages to zero, so the electron oscillates in position with period $h/eEa$. Scattering (in real metals) interrupts this long before one period, giving a steady drift.' },
    { id: 'bth-028', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'empty lattice',
      q: 'For free electrons in a 1D lattice with $a = 0.50$ nm, drawn in the reduced zone scheme, the second and third bands meet at $k = 0$. Their common energy there is ______ eV (to two decimal places). Take $\\hbar^2/2m_e = 0.0381$ eV nm$^2$.',
      answer: 6.02, tol: 0.05, calc: () => HB2M * (2 * Math.PI / 0.5) ** 2,
      sol: 'At reduced $k = 0$ the free states folded back are $k = \\pm2\\pi/a$ (bands 2 and 3). $E = 0.0381\\times(2\\pi/0.5)^2 = 0.0381\\times157.9 = 6.02$ eV. A periodic potential with a $4\\pi/a$ component splits them.' },

    // ---------- level 4 ----------
    { id: 'bth-029', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'tight binding',
      q: 'A 2D square lattice ($a = 0.40$ nm) has a nearest-neighbour tight-binding band whose effective mass at the bottom is $0.50\\,m_e$. Its bandwidth is ______ eV (to two decimal places). Take $\\hbar^2/2m_e = 0.0381$ eV nm$^2$.',
      answer: 3.81, tol: 0.03, calc: () => 8 * HB2M / (0.5 * 0.16),
      sol: '$E = E_0 - 2t(\\cos k_xa + \\cos k_ya) \\approx E_0 - 4t + ta^2k^2$, so $t = \\dfrac{\\hbar^2}{2m^*a^2} = \\dfrac{0.0381}{0.50\\times0.16} = 0.476$ eV. Bandwidth $= 8t = 3.81$ eV.' },
    { id: 'bth-030', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'tight binding',
      q: 'An s band in an fcc crystal with hopping $t$ to its 12 nearest neighbours is $E = E_0 - 4t\\left[\\cos\\tfrac{k_xa}{2}\\cos\\tfrac{k_ya}{2} + \\cos\\tfrac{k_ya}{2}\\cos\\tfrac{k_za}{2} + \\cos\\tfrac{k_za}{2}\\cos\\tfrac{k_xa}{2}\\right]$. Its bandwidth is',
      options: ['$12t$', '$24t$', '$8t$', '$16t$'], answer: 3,
      sol: 'At $\\Gamma$ the bracket is $3$: $E = E_0 - 12t$. Its minimum is $-1$, reached at X $= (2\\pi/a, 0, 0)$: $\\cos\\pi\\cdot1 + 1\\cdot1 + 1\\cdot\\cos\\pi = -1$, giving $E = E_0 + 4t$. (The bracket cannot reach $-3$, because three cosines cannot pairwise multiply to $-1$.) Bandwidth $= 16t$, not $2zt = 24t$: the fcc lattice is frustrated.',
      trap: 'Using $2zt = 24t$, which holds only for lattices where all neighbour phases can be $-1$ at once (bipartite lattices).' },
    { id: 'bth-031', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'nearly free electrons',
      q: 'In a 1D nearly-free-electron crystal with $a = 0.30$ nm and Fourier component $|U| = 1.0$ eV, the effective mass at the bottom of the second band (just above the first gap) is ______ $m_e$ (to three decimal places). Take $\\hbar^2/2m_e = 0.0381$ eV nm$^2$.',
      answer: 0.107, tol: 0.002, calc: () => 1 / (1 + 2 * HB2M * (Math.PI / 0.3) ** 2 / 1.0),
      sol: 'Let $k = \\pi/a + q$ and $\\lambda = \\dfrac{\\hbar^2}{2m}\\left(\\dfrac\\pi a\\right)^2 = 4.178$ eV. The two-wave result expanded in $q$ is $E_\\pm = \\lambda \\pm |U| + \\dfrac{\\hbar^2q^2}{2m}\\left(1 \\pm \\dfrac{2\\lambda}{|U|}\\right)$. So the upper band has $m^*/m = 1/(1 + 2\\lambda/|U|) = 1/(1 + 8.356) = 0.107$. (The lower band top has $m^*/m = 1/(1 - 8.356) = -0.136$.) Small gaps give light carriers, as in narrow-gap semiconductors.' },
    { id: 'bth-032', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'Fermi surface',
      q: 'For nearly free electrons in a weak periodic potential, which statements about the Fermi surface are correct?',
      options: ['An energy gap appears across every Bragg plane the free-electron sphere crosses.', 'Pieces of the free-electron sphere that lie in higher zones can be mapped back into the first zone by reciprocal lattice vectors.', 'The weak potential makes the total volume enclosed by the Fermi surface larger than the free-electron sphere.', 'Where the Fermi surface meets a Bragg plane, it meets it at right angles.'], answer: [0, 1, 3],
      sol: 'On a Bragg plane $E(\\mathbf k)$ has zero gradient normal to the plane (the two-wave mixing makes $E$ symmetric about it), so $\\mathbf v$ is parallel to the plane and constant-energy surfaces cross it at right angles. Gaps open on every Bragg plane; Harrison\'s construction maps zone pieces back by $\\mathbf G$. The volume enclosed (Luttinger) is fixed by the electron count, so it does not change.' },
    { id: 'bth-033', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'Fermi surface',
      q: 'A divalent metal forms a 2D square lattice of side $a$ with one atom per cell. The ratio of its free-electron Fermi radius to the distance from $\\Gamma$ to the first zone boundary ($\\pi/a$) is ______ (to three decimal places).',
      answer: 1.128, tol: 0.003, calc: () => Math.sqrt(4 * Math.PI) / Math.PI,
      sol: 'In 2D, $n = k_F^2/2\\pi$ (spin included). With $n = 2/a^2$: $k_F = \\sqrt{4\\pi}/a = 3.545/a$. Ratio to $\\pi/a$: $1.128$. The circle crosses the zone edges (but stays inside the corner at $\\sqrt2\\pi/a = 4.443/a$), so part of the electrons spill into the second zone and holes are left in the first: a metal, even with two electrons per cell.' },
    { id: 'bth-034', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'Kronig-Penney model',
      q: 'In the delta-function Kronig-Penney model, as the barrier strength $P$ becomes very large, the width of the lowest band',
      options: ['stays fixed at $\\hbar^2\\pi^2/2ma^2$', 'grows as $P$', 'shrinks roughly as $1/P$, the tight-binding limit', 'shrinks exponentially in $P$'], answer: 2,
      sol: 'Near $x = \\alpha a = \\pi$, write $x = \\pi - \\delta$: the condition $\\cos ka = \\cos x + P\\sin x/x \\approx -1 + P\\delta/\\pi$ ranges over $[-1, 1]$ when $\\delta$ runs from $0$ to $2\\pi/P$. So the band occupies $\\Delta x \\approx 2\\pi/P$ and its energy width $\\approx (\\hbar^2/2ma^2)\\cdot2\\pi\\cdot2\\pi/P \\propto 1/P$. Delta barriers have no thickness, so tunnelling falls only as a power, not exponentially.' },
    { id: 'bth-035', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'Bloch oscillations',
      q: 'For Bloch oscillations to complete one period within a scattering time of $10$ fs in a crystal of lattice constant $0.50$ nm, the electric field must be at least ______ $\\times10^8$ V/m (to two decimal places).',
      answer: 8.27, tol: 0.08, calc: () => H_eVs / (0.5e-9 * 10e-15) / 1e8,
      sol: '$T = h/eEa \\le \\tau$ gives $E \\ge \\dfrac{h}{ea\\tau} = \\dfrac{4.136\\times10^{-15}\\text{ eV s}}{e\\times0.50\\times10^{-9}\\text{ m}\\times10^{-14}\\text{ s}} = 8.27\\times10^8$ V/m, far above breakdown fields of real solids. Superlattices with $a \\sim 10$ nm bring this down twenty-fold.' },
    { id: 'bth-036', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'Bloch theorem',
      q: 'Which of the following is NOT a consequence of Bloch\'s theorem and band theory with independent electrons?',
      options: ['$E_n(\\mathbf k + \\mathbf G) = E_n(\\mathbf k)$ for every reciprocal lattice vector $\\mathbf G$.', 'A perfect, static lattice has zero electrical resistivity.', 'Each band holds exactly 2 electrons per primitive cell.', 'Every crystal with an even number of electrons per primitive cell is an insulator.'], answer: 3,
      sol: 'Periodicity in $k$ follows from $\\mathbf k$ being defined modulo $\\mathbf G$. Bloch states are stationary, so a perfect lattice does not scatter them: resistivity comes only from defects and phonons. Each band has $N$ values of $\\mathbf k$, i.e. 2 electrons per cell. But even filling is not enough for an insulator: overlapping bands make Mg, Zn and Ca metals.' },

    // ---------- level 5 ----------
    { id: 'bth-037', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'Kronig-Penney model',
      q: 'For the delta-function Kronig-Penney model with $P = 3\\pi/2$ and $a = 0.50$ nm, the first energy gap (at $ka = \\pi$) is ______ eV wide (to two decimal places). Take $\\hbar^2/2m_e = 0.0381$ eV nm$^2$.',
      answer: 1.88, tol: 0.02, calc: () => { const x1 = bisect((x) => kpRHS(3 * Math.PI / 2)(x) + 1, Math.PI + 1e-9, 2 * Math.PI); return HB2M / 0.25 * (x1 ** 2 - Math.PI ** 2); },
      sol: 'At $ka = \\pi$ we need $\\cos x + P\\sin x/x = -1$. One solution is $x = \\pi$ (top of band 1, the free-electron energy). The other, for $\\pi < x < 2\\pi$: try $x = 3\\pi/2$: $\\cos = 0$ and $P\\sin x/x = \\tfrac{3\\pi}{2}\\cdot\\dfrac{-1}{3\\pi/2} = -1$. Exactly. So band 2 starts at $x = 3\\pi/2$. Gap $= \\dfrac{\\hbar^2}{2ma^2}\\left(\\dfrac{9\\pi^2}{4} - \\pi^2\\right) = \\dfrac{0.0381}{0.25}\\times\\dfrac{5\\pi^2}{4} = 1.88$ eV.',
      trap: 'Taking the gap edges as $\\pi$ and $2\\pi$ (the free-electron energies at the next boundary).' },
    { id: 'bth-038', type: 'msq', level: 5, exams: ['gate', 'net'], sub: 'effective mass tensor',
      q: 'A cubic semiconductor has six equivalent conduction-band valleys along $\\langle100\\rangle$, each an ellipsoid with longitudinal mass $m_l$ and transverse mass $m_t$. Which statements are correct?',
      options: ['The conductivity effective mass is $m_c = 3\\left(\\dfrac1{m_l} + \\dfrac2{m_t}\\right)^{-1}$.', 'The density-of-states mass of one valley is $(m_lm_t^2)^{1/3}$.', 'Summed over all six valleys, the current is parallel to an applied field in any direction.', 'Within a single valley, the current is always parallel to the applied field.'], answer: [0, 1, 2],
      sol: 'Each valley has $\\sigma_{ij} = ne^2\\tau(m^{-1})_{ij}$. Averaging over the three orientations gives $\\tfrac13(1/m_l + 2/m_t)$ in every direction: cubic symmetry makes $\\sigma$ a scalar. Squeezing an ellipsoid into a sphere of equal volume gives the DOS mass $(m_lm_t^2)^{1/3}$. A single valley has an anisotropic mass tensor, so its current tilts towards the light-mass direction unless the field lies along a principal axis.' },
    { id: 'bth-039', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'effective mass tensor',
      q: 'Silicon\'s conduction valleys have $m_l = 0.98\\,m_e$ and $m_t = 0.19\\,m_e$. Its conductivity effective mass is ______ $m_e$ (to three decimal places).',
      answer: 0.260, tol: 0.003, calc: () => 3 / (1 / 0.98 + 2 / 0.19),
      sol: '$\\dfrac1{m_c} = \\dfrac13\\left(\\dfrac1{0.98} + \\dfrac2{0.19}\\right) = \\dfrac13(1.020 + 10.526) = 3.849$, so $m_c = 0.260\\,m_e$. The light transverse mass dominates because it appears twice and conductivity goes as $1/m$.',
      trap: 'Averaging the masses themselves, $(0.98 + 2\\times0.19)/3 = 0.453$, instead of their inverses.' },
    { id: 'bth-040', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'empty lattice',
      q: 'For free electrons on a 2D square lattice, how many plane-wave states are degenerate at the zone corner M $= (\\pi/a, \\pi/a)$ in the lowest set (energy $\\hbar^2\\pi^2/ma^2$)?',
      options: ['2', '3', '4', '8'], answer: 2,
      sol: 'The plane waves $\\mathbf k - \\mathbf G$ with the same $|\\mathbf k - \\mathbf G|$ at M are $(\\pi,\\pi)/a$, $(-\\pi,\\pi)/a$, $(\\pi,-\\pi)/a$ and $(-\\pi,-\\pi)/a$, all of length $\\sqrt2\\pi/a$. Four states (times spin), so a weak potential needs a $4\\times4$ matrix there; it splits them into levels set by $U_{10}$ and $U_{11}$.' },
  ],
  gens: [
    { id: 'bth-g01', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'nearly free electrons',
      make(r) {
        const a = choose(r, [0.25, 0.3, 0.35, 0.4, 0.5]), U = pick(r, 0.2, 1.5, 0.1), up = r() < 0.5;
        const lam = HB2M * (Math.PI / a) ** 2, E = up ? lam + U : lam - U;
        return { q: `Nearly free electrons in a 1D crystal ($a = ${a}$ nm) feel a weak potential with Fourier component $|U_{2\\pi/a}| = ${U}$ eV. The ${up ? 'bottom of the second band' : 'top of the first band'} lies at ______ eV (to two decimal places). Take $\\hbar^2/2m_e = 0.0381$ eV nm$^2$.`,
          answer: round(E, 2), tol: Math.max(0.02, round(E * 0.005, 2)), a, U, up,
          sol: `Free energy at $k = \\pi/a$: $\\lambda = 0.0381(\\pi/${a})^2 = ${round(lam, 3)}$ eV. The two degenerate plane waves split to $\\lambda \\pm |U|$, so the ${up ? 'upper' : 'lower'} edge is $${round(lam, 3)} ${up ? '+' : '-'} ${U} = ${round(E, 2)}$ eV.` };
      },
      verify: (p) => HB2M * (Math.PI / p.a) ** 2 + (p.up ? p.U : -p.U) },
    { id: 'bth-g02', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'tight binding',
      make(r) {
        const [lat, z, f] = choose(r, [['a linear chain', 2, 4], ['a 2D square lattice', 4, 8], ['a 2D triangular lattice', 6, 9], ['a simple cubic lattice', 6, 12], ['a bcc lattice', 8, 16], ['an fcc lattice', 12, 16]]);
        const t = pick(r, 0.1, 1.5, 0.05);
        return { q: `An s band with nearest-neighbour hopping $t = ${t}$ eV is formed on ${lat} (${z} nearest neighbours). Its tight-binding bandwidth is ______ eV (to two decimal places).`,
          answer: round(f * t, 2), tol: 0.01, f, t,
          sol: `$E(\\mathbf k) = E_0 - t\\sum_{\\boldsymbol\\delta}e^{i\\mathbf k\\cdot\\boldsymbol\\delta}$. At $\\Gamma$ the sum is $${z}$. ${f === 2 * z ? `On this lattice every neighbour phase can be $-1$ at once (bipartite), so the sum reaches $-${z}$ and the width is $2zt = ${f}t$.` : `This lattice is not bipartite: the sum cannot reach $-${z}$; its minimum is $${z - f}$, so the width is $${f}t$, less than $2zt$.`} Bandwidth $= ${f}\\times${t} = ${round(f * t, 2)}$ eV.`,
          trap: f === 2 * z ? 'Using $zt$ instead of $2zt$.' : 'Using $2zt$, which overestimates the width on non-bipartite lattices.' };
      },
      verify: (p) => p.f * p.t },
    { id: 'bth-g03', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'effective mass',
      make(r) {
        const t = pick(r, 0.1, 2.0, 0.1), a = choose(r, [0.2, 0.25, 0.3, 0.35, 0.4, 0.5]), top = r() < 0.4;
        const m = HB2M / (t * a * a) * (top ? -1 : 1);
        return { q: `A simple-cubic tight-binding band $E = E_0 - 2t\\sum_i\\cos k_ia$ has $t = ${t}$ eV and $a = ${a}$ nm. The effective mass at the ${top ? 'band top (zone corner R)' : 'band bottom ($\\Gamma$)'} is ______ $m_e$ (to three decimal places, with sign). Take $\\hbar^2/2m_e = 0.0381$ eV nm$^2$.`,
          answer: round(m, 3), tol: Math.max(0.002, round(Math.abs(m) * 0.01, 3)), t, a, top,
          sol: `$\\partial^2E/\\partial k_x^2 = 2ta^2\\cos k_xa$, which is $${top ? '-' : '+'}2ta^2$ at ${top ? 'R' : '$\\Gamma$'}. So $m^*/m_e = ${top ? '-' : ''}\\dfrac{0.0381}{ta^2} = ${top ? '-' : ''}\\dfrac{0.0381}{${t}\\times${a}^2} = ${round(m, 3)}$.`,
          trap: top ? 'Dropping the sign: near a band maximum the electron mass is negative.' : 'Using $\\hbar^2/ta^2$ (twice too large).' };
      },
      verify: (p) => HB2M / (p.t * p.a * p.a) * (p.top ? -1 : 1) },
    { id: 'bth-g04', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'group velocity',
      make(r) {
        const t = pick(r, 0.2, 2.0, 0.1), a = choose(r, [0.2, 0.3, 0.4, 0.5]), ka = choose(r, [[1, 6], [1, 4], [1, 3], [1, 2], [2, 3], [3, 4]]);
        const th = Math.PI * ka[0] / ka[1], v = 2 * t * C.e * a * 1e-9 * Math.sin(th) / C.hbar / 1e5;
        return { q: `For the 1D band $E = E_0 - 2t\\cos ka$ with $t = ${t}$ eV and $a = ${a}$ nm, the group velocity at $ka = ${ka[0] === 1 ? '' : ka[0]}\\pi/${ka[1]}$ is ______ $\\times10^5$ m/s (to two decimal places).`,
          answer: round(v, 2), tol: Math.max(0.02, round(v * 0.01, 2)), t, a, th,
          sol: `$v = \\dfrac1\\hbar\\dfrac{dE}{dk} = \\dfrac{2ta}{\\hbar}\\sin ka = \\dfrac{2\\times${t}\\times1.602\\times10^{-19}\\times${a}\\times10^{-9}}{1.055\\times10^{-34}}\\times${round(Math.sin(th), 4)} = ${round(v, 2)}\\times10^5$ m/s.` };
      },
      verify: (p) => 2 * p.t * C.e * p.a * 1e-9 * Math.sin(p.th) / C.hbar / 1e5 },
    { id: 'bth-g05', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Bloch oscillations',
      make(r) {
        const a = choose(r, [0.3, 0.5, 5, 8, 10, 15]), E = choose(r, [1e5, 5e5, 1e6, 2e6, 5e6]), want = choose(r, ['T', 'f']);
        const T = H_eVs / (E * a * 1e-9), ans = want === 'T' ? T * 1e12 : 1 / T / 1e9;
        const Es = `${E / 10 ** Math.floor(Math.log10(E)) === 1 ? '' : E / 10 ** Math.floor(Math.log10(E)) + '\\times'}10^{${Math.floor(Math.log10(E))}}`;
        return { q: `An electron in a ${a > 1 ? 'semiconductor superlattice of period' : 'crystal of lattice constant'} $${a}$ nm is driven by a field of $${Es}$ V/m along the lattice direction. Ignoring scattering, its Bloch oscillation ${want === 'T' ? 'period is ______ ps' : 'frequency is ______ GHz'} (to three significant figures).`,
          answer: +ans.toPrecision(3), tol: +(ans * 0.01).toPrecision(2), a, E, want,
          sol: `$\\hbar\\dot k = eE$ sweeps the zone width $2\\pi/a$ in $T = h/eEa$. $eEa = ${+(E * a * 1e-9).toPrecision(4)}$ eV, so $T = 4.136\\times10^{-15}/${+(E * a * 1e-9).toPrecision(4)} = ${+(T * 1e12).toPrecision(4)}$ ps${want === 'f' ? ` and $f = 1/T = ${+ans.toPrecision(3)}$ GHz` : ''}.` };
      },
      verify: (p) => { const T = H_eVs / (p.E * p.a * 1e-9); return p.want === 'T' ? T * 1e12 : 1 / T / 1e9; } },
    { id: 'bth-g06', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'nearly free electrons',
      make(r) {
        const A = [pick(r, 0.2, 1.2, 0.1), pick(r, 0.1, 0.8, 0.1), pick(r, 0.1, 0.6, 0.1)], n = int(r, 1, 3);
        const terms = A.map((v, i) => `${v}\\cos(${2 * (i + 1)}\\pi x/a)`).join(' + ');
        return { q: `Electrons in a 1D crystal feel $V(x) = ${terms}$ eV. To first order, the energy gap at $k = ${n === 1 ? '' : n}\\pi/a$ is ______ eV (to two decimal places).`,
          answer: round(A[n - 1], 2), tol: 0.005, A, n,
          sol: `$k = ${n === 1 ? '' : n}\\pi/a$ is the Bragg plane of $G = ${2 * n}\\pi/a$. A term $V_G\\cos(Gx)$ gives $U_{\\pm G} = V_G/2$, and the gap is $2|U_G| = V_G = ${A[n - 1]}$ eV.`,
          trap: 'Taking the gap as $V_G/2$ (that is $U_G$), or using the wrong harmonic for a higher boundary.' };
      },
      verify: (p) => p.A[p.n - 1] },
    { id: 'bth-g07', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'metals and insulators',
      make(r) {
        const v = int(r, 1, 5), atoms = int(r, 1, 4), N = v * atoms;
        const odd = N % 2 === 1;
        const opts = ['must be a metal', 'must be an insulator or semiconductor', 'can be a metal or an insulator, depending on whether bands overlap', 'must be a superconductor'];
        const ans = odd ? 0 : 2;
        const sh = int(r, 0, 3), uniq = [0, 1, 2, 3].map((i) => (i + sh) % 4);
        return { q: `An element with $${v}$ valence electron${v > 1 ? 's' : ''} per atom crystallises with $${atoms}$ atom${atoms > 1 ? 's' : ''} per primitive cell. In independent-electron band theory the crystal`, options: uniq.map((i) => opts[i]), answer: uniq.indexOf(ans), N,
          sol: `There are $${v}\\times${atoms} = ${N}$ electrons per primitive cell, and each band holds 2. ${odd ? 'An odd number always leaves the top band partly filled: a metal.' : 'An even number can fill bands exactly (insulator, if a gap separates them everywhere) or not (metal, if bands overlap), so band counting alone cannot decide.'}` };
      } },
    { id: 'bth-g08', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'Fermi surface',
      make(r) {
        const Z = int(r, 1, 4), lat = choose(r, ['square', 'sc']);
        const ratio = lat === 'square' ? Math.sqrt(2 * Math.PI * Z) / Math.PI : (3 * Math.PI ** 2 * Z) ** (1 / 3) / Math.PI;
        return { q: `A metal of valence $${Z}$ forms a ${lat === 'square' ? '2D square' : 'simple cubic'} lattice with one atom per primitive cell (side $a$). The ratio of its free-electron Fermi wave vector to the distance $\\pi/a$ from $\\Gamma$ to the nearest zone face is ______ (to three decimal places).`,
          answer: round(ratio, 3), tol: 0.003, Z, lat,
          sol: lat === 'square' ? `In 2D $n = k_F^2/2\\pi$, so $k_F = \\sqrt{2\\pi\\cdot${Z}}/a$ and the ratio is $\\sqrt{${2 * Z}\\pi}/\\pi = ${round(ratio, 3)}$. ${ratio > 1 ? 'Above 1: the Fermi circle crosses the first zone boundary.' : 'Below 1: the circle lies inside the first zone.'}` : `In 3D $n = k_F^3/3\\pi^2$, so $k_F = (3\\pi^2\\cdot${Z})^{1/3}/a$ and the ratio is $${round(ratio, 3)}$. ${ratio > 1 ? 'Above 1: the Fermi sphere crosses the nearest zone faces.' : 'Below 1: the sphere lies inside the first zone.'}` };
      },
      verify: (p) => (p.lat === 'square' ? Math.sqrt(2 * Math.PI * p.Z) / Math.PI : (3 * Math.PI ** 2 * p.Z) ** (1 / 3) / Math.PI) },
    { id: 'bth-g09', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'nearly free electrons',
      make(r) {
        const a = choose(r, [0.3, 0.4, 0.5, 0.6]), U = pick(r, 0.2, 1.0, 0.1), up = r() < 0.5;
        const lam = HB2M * (Math.PI / a) ** 2, m = 1 / (1 + (up ? 1 : -1) * 2 * lam / U);
        return { q: `In a 1D nearly-free-electron crystal ($a = ${a}$ nm) the first gap is $${round(2 * U, 1)}$ eV. The effective mass at the ${up ? 'bottom of the second band' : 'top of the first band'} is ______ $m_e$ (to three decimal places, with sign). Take $\\hbar^2/2m_e = 0.0381$ eV nm$^2$.`,
          answer: round(m, 3), tol: Math.max(0.002, round(Math.abs(m) * 0.01, 3)), a, U, up,
          sol: `$|U| = ${U}$ eV (half the gap) and $\\lambda = 0.0381(\\pi/${a})^2 = ${round(lam, 3)}$ eV. Near the boundary $E_\\pm = \\lambda \\pm |U| + \\dfrac{\\hbar^2q^2}{2m}\\left(1 \\pm \\dfrac{2\\lambda}{|U|}\\right)$, so $m^*/m = 1/(1 ${up ? '+' : '-'} ${round(2 * lam / U, 3)}) = ${round(m, 3)}$.`,
          trap: 'Using the gap instead of $|U|$ (half the gap) in $2\\lambda/|U|$.' };
      },
      verify: (p) => 1 / (1 + (p.up ? 1 : -1) * 2 * HB2M * (Math.PI / p.a) ** 2 / p.U) },
    { id: 'bth-g10', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'Brillouin zones',
      make(r) {
        const pairs = [['a simple cubic', 'a cube'], ['a body-centred cubic', 'a rhombic dodecahedron'], ['a face-centred cubic', 'a truncated octahedron'], ['a 2D square', 'a square'], ['a 2D triangular (hexagonal)', 'a regular hexagon'], ['a simple hexagonal', 'a hexagonal prism']];
        const [lat, bz] = choose(r, pairs);
        const flat = (x) => x === 'a square' || x === 'a regular hexagon';
        const others = pairs.map((x) => x[1]).filter((x) => x !== bz);
        const wrongs = others.filter((x) => flat(x) === flat(bz)).concat(others.filter((x) => flat(x) !== flat(bz)));
        const { options, answer } = mcqOptions(r, bz, wrongs, (v) => v);
        return { q: `The first Brillouin zone of ${lat} lattice is`, options, answer, lat,
          sol: `The first zone is the Wigner-Seitz cell of the reciprocal lattice. sc $\\to$ sc (cube); bcc $\\to$ fcc reciprocal (rhombic dodecahedron); fcc $\\to$ bcc reciprocal (truncated octahedron); 2D square $\\to$ square; triangular $\\to$ triangular rotated by 30° (hexagon); simple hexagonal $\\to$ hexagonal prism. So the answer is ${bz}.` };
      } },
    { id: 'bth-g11', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'effective mass tensor',
      make(r) {
        const ml = pick(r, 0.8, 1.9, 0.05), mt = pick(r, 0.08, 0.3, 0.01), want = choose(r, ['c', 'd']);
        const mc = 3 / (1 / ml + 2 / mt), md = Math.cbrt(ml * mt * mt);
        const ans = want === 'c' ? mc : md;
        return { q: `A cubic semiconductor has ellipsoidal conduction valleys with $m_l = ${ml}\\,m_e$ and $m_t = ${mt}\\,m_e$. The ${want === 'c' ? 'conductivity effective mass' : 'density-of-states mass of a single valley'} is ______ $m_e$ (to three decimal places).`,
          answer: round(ans, 3), tol: Math.max(0.002, round(ans * 0.01, 3)), ml, mt, want,
          sol: want === 'c' ? `$1/m_c = \\tfrac13(1/m_l + 2/m_t) = \\tfrac13(${round(1 / ml, 3)} + ${round(2 / mt, 3)})$, so $m_c = ${round(mc, 3)}\\,m_e$.` : `Equal-volume sphere: $m_d = (m_lm_t^2)^{1/3} = (${ml}\\times${mt}^2)^{1/3} = ${round(md, 3)}\\,m_e$. (For $N_v$ valleys the total DOS mass is $N_v^{2/3}m_d$.)`,
          trap: want === 'c' ? 'Averaging the masses instead of the inverse masses.' : 'Using $(m_l^2m_t)^{1/3}$: there are two transverse directions.' };
      },
      verify: (p) => (p.want === 'c' ? 3 / (1 / p.ml + 2 / p.mt) : Math.cbrt(p.ml * p.mt * p.mt)) },
    { id: 'bth-g12', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'Kronig-Penney model',
      make(r) {
        const P = choose(r, [1, 2, 3, 4, 5, 6, 8, 10]), which = choose(r, ['bottom', 'gap']);
        const f = kpRHS(P);
        const x0 = bisect((x) => f(x) - 1, 1e-6, Math.PI);
        const x1 = bisect((x) => f(x) + 1, Math.PI + 1e-9, 2 * Math.PI);
        const ans = which === 'bottom' ? x0 : (x1 ** 2 - Math.PI ** 2) / Math.PI ** 2;
        return { q: which === 'bottom' ? `In the delta-function Kronig-Penney model $\\cos ka = \\cos\\alpha a + P\\dfrac{\\sin\\alpha a}{\\alpha a}$ with $P = ${P}$, the lowest allowed band starts at $\\alpha a =$ ______ (to two decimal places).` : `In the delta-function Kronig-Penney model with $P = ${P}$, the width of the first gap divided by the free-electron energy at the first zone boundary, $\\hbar^2\\pi^2/2ma^2$, is ______ (to two decimal places).`,
          answer: round(ans, 2), tol: Math.max(0.01, round(Math.abs(ans) * 0.01, 2)), P, which,
          sol: which === 'bottom' ? `At $k = 0$ solve $\\cos x + ${P}\\sin x/x = 1$ for $0 < x < \\pi$ (the left side falls from $${1 + P}$ at $x \\to 0$ to $-1$ at $x = \\pi$). Numerically $x = ${round(x0, 3)}$.` : `The first band ends at $x = \\alpha a = \\pi$. The second starts where $\\cos x + ${P}\\sin x/x = -1$ with $\\pi < x < 2\\pi$: $x = ${round(x1, 3)}$. Gap ratio $= (x^2 - \\pi^2)/\\pi^2 = ${round(ans, 2)}$.` };
      },
      verify: (p) => { const f = kpRHS(p.P); if (p.which === 'bottom') return bisect((x) => f(x) - 1, 1e-6, Math.PI); const x1 = bisect((x) => f(x) + 1, Math.PI + 1e-9, 2 * Math.PI); return (x1 ** 2 - Math.PI ** 2) / Math.PI ** 2; } },
    ...more,
  ],
};
