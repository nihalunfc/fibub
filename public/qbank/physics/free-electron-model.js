// The free electron model at MSc level: Drude transport (relaxation time, mobility, AC conductivity, plasma
// frequency), the Sommerfeld gas (Fermi sphere, density of states in 1D, 2D and 3D, Fermi energy, velocity and
// temperature), the chemical potential at finite T, electronic heat capacity, degeneracy pressure and bulk modulus,
// Wiedemann-Franz, thermionic emission and thin-film subbands. (Basic Fermi-Dirac and semiconductor ideas: JAM
// topic semiconductors.) Original questions for GATE and CSIR NET practice (fibub). Levels: 1 warm-up ... 5 top rank.
import { int, pick, choose, round, mcqOptions, C } from '../_util.js';
import more from './free-electron-model.more.gen.js';
import more2 from './free-electron-model.more2.gen.js';
import r4 from './free-electron-model.r4.gen.js';
import r5 from './free-electron-model.r5.gen.js';

const HB2M = (C.hbar ** 2) / (2 * C.me) / C.e * 1e18; // hbar^2/2m_e in eV nm^2 (0.0381)
const kBe = C.kB / C.e; // eV/K
const EFofn = (n) => HB2M * 1e-18 * (3 * Math.PI ** 2 * n) ** (2 / 3); // n in m^-3, result eV
const LOR = (Math.PI ** 2 / 3) * kBe ** 2; // Sommerfeld Lorenz number, W ohm / K^2

export default {
  topic: 'free-electron-model',
  items: [
    // ---------- level 1 ----------
    { id: 'fem-001', type: 'mcq', level: 1, exams: ['gate', 'net', 'jam'], sub: 'density of states',
      q: 'For free electrons in three dimensions, the density of states per unit volume $g(E)$ varies with energy as',
      options: ['$E^{-1/2}$', '$E^{1/2}$', 'a constant', '$E^{3/2}$'], answer: 1,
      sol: 'The number of states with energy below $E$ is the volume of a sphere of radius $k = \\sqrt{2mE}/\\hbar$ in $k$-space: $N(E) \\propto k^3 \\propto E^{3/2}$. Then $g(E) = dN/dE \\propto E^{1/2}$. Explicitly $g(E) = \\dfrac{1}{2\\pi^2}\\left(\\dfrac{2m}{\\hbar^2}\\right)^{3/2}E^{1/2}$ including spin.',
      trap: '$E^{3/2}$ is the number of states below $E$, not the density of states.' },
    { id: 'fem-002', type: 'mcq', level: 1, exams: ['gate', 'net', 'jam'], sub: 'Drude conductivity',
      q: 'In the Drude model a metal has conductivity $\\sigma_0$. If the electron density is halved and the relaxation time doubled, the conductivity becomes',
      options: ['$\\sigma_0/2$', '$2\\sigma_0$', '$\\sigma_0$', '$4\\sigma_0$'], answer: 2,
      sol: '$\\sigma = ne^2\\tau/m$ is proportional to the product $n\\tau$. Halving $n$ and doubling $\\tau$ leaves $n\\tau$ and so $\\sigma$ unchanged.' },
    { id: 'fem-003', type: 'msq', level: 1, exams: ['gate', 'net', 'jam'], sub: 'Fermi-Dirac function',
      q: 'For the Fermi-Dirac function $f(E) = 1/\\left(e^{(E - \\mu)/k_BT} + 1\\right)$, which statements are correct?',
      options: ['$f$ can exceed 1 for states well below $\\mu$ at high temperature.', '$f(\\mu) = \\tfrac12$ at every temperature above zero.', 'At $T = 0$, $f$ is a step: 1 below $\\mu$ and 0 above.', '$f(\\mu + \\Delta) = 1 - f(\\mu - \\Delta)$ for any $\\Delta$.'], answer: [1, 2, 3],
      sol: 'At $E = \\mu$ the exponential is 1, so $f = \\tfrac12$. As $T \\to 0$ the exponent goes to $\\mp\\infty$ below and above $\\mu$, giving the step. Symmetry: $1 - f(\\mu - \\Delta) = \\dfrac{e^{-\\Delta/k_BT}}{e^{-\\Delta/k_BT} + 1} = \\dfrac{1}{1 + e^{\\Delta/k_BT}} = f(\\mu + \\Delta)$: the chance a state $\\Delta$ above is filled equals the chance a state $\\Delta$ below is empty. $f \\le 1$ always (Pauli principle).' },
    { id: 'fem-004', type: 'nat', level: 1, exams: ['gate', 'net', 'jam'], sub: 'Fermi energy',
      q: 'The free-electron density of a metal is made 8 times larger. Its Fermi energy increases by a factor of ______.',
      answer: 4, tol: 0, calc: () => 8 ** (2 / 3),
      sol: '$E_F = \\dfrac{\\hbar^2}{2m}(3\\pi^2 n)^{2/3} \\propto n^{2/3}$. So the factor is $8^{2/3} = 4$.',
      trap: 'Using $k_F \\propto n^{1/3}$ (factor 2) instead of $E_F \\propto k_F^2$.' },
    { id: 'fem-005', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'density of states',
      q: 'For a two-dimensional free electron gas (area $A$, parabolic band, spin included), the density of states per unit area',
      options: ['is independent of energy and equals $m/\\pi\\hbar^2$', 'grows as $E^{1/2}$', 'falls as $E^{-1/2}$', 'grows linearly with $E$'], answer: 0,
      sol: 'In 2D the states below $E$ fill a disc: $N(E) = 2\\cdot\\dfrac{\\pi k^2}{(2\\pi)^2}A = \\dfrac{k^2A}{2\\pi} = \\dfrac{mEA}{\\pi\\hbar^2}$. So $g = dN/dE$ per area $= m/\\pi\\hbar^2$, a constant. This is why a 2D electron gas has $E_F \\propto n$.' },
    { id: 'fem-006', type: 'mcq', level: 1, exams: ['gate', 'net', 'jam'], sub: 'Fermi temperature',
      q: 'The Fermi temperature $T_F = E_F/k_B$ of a typical metal such as copper is of the order of',
      options: ['$10^2$ K', '$10^3$ K', '$10^6$ K', '$10^4$ to $10^5$ K'], answer: 3,
      sol: 'Metallic Fermi energies are 2 to 12 eV. With $k_B = 8.62\\times10^{-5}$ eV/K, $E_F = 7$ eV gives $T_F \\approx 8\\times10^4$ K. Room temperature is therefore a very low temperature for the electron gas, $T/T_F \\sim 0.004$.' },

    // ---------- level 2 ----------
    { id: 'fem-007', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Fermi energy',
      q: 'A monovalent metal has $2.65\\times10^{28}$ conduction electrons per m$^3$. Its free-electron Fermi energy is ______ eV (to two decimal places). Take $\\hbar^2/2m_e = 0.0381$ eV nm$^2$.',
      answer: 3.24, tol: 0.03, calc: () => EFofn(2.65e28),
      sol: '$n = 26.5$ nm$^{-3}$. $k_F^2 = (3\\pi^2n)^{2/3} = (784.6)^{2/3} = 85.06$ nm$^{-2}$. $E_F = 0.0381\\times85.06 = 3.24$ eV (sodium-like).' },
    { id: 'fem-008', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'ground-state energy',
      q: 'At $T = 0$, the mean kinetic energy per electron of a three-dimensional free electron gas with Fermi energy $E_F$ is',
      options: ['$\\tfrac12E_F$', '$\\tfrac23E_F$', '$\\tfrac35E_F$', '$\\tfrac32k_BT_F$'], answer: 2,
      sol: '$\\langle E\\rangle = \\dfrac{\\int_0^{E_F}E\\,g(E)\\,dE}{\\int_0^{E_F}g(E)\\,dE}$ with $g \\propto E^{1/2}$: $\\dfrac{\\tfrac25E_F^{5/2}}{\\tfrac23E_F^{3/2}} = \\tfrac35E_F$. In 2D it is $\\tfrac12E_F$ and in 1D $\\tfrac13E_F$.',
      trap: '$\\tfrac12E_F$ is the 2D result, where $g$ is constant.' },
    { id: 'fem-009', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'Fermi velocity',
      q: 'The Fermi velocity of free electrons in a metal with $E_F = 5.0$ eV is closest to',
      options: ['$1.3\\times10^5$ m/s', '$1.3\\times10^6$ m/s', '$4.2\\times10^5$ m/s', '$1.9\\times10^6$ m/s'], answer: 1,
      sol: '$v_F = \\sqrt{2E_F/m} = \\sqrt{2\\times5.0\\times1.602\\times10^{-19}/9.11\\times10^{-31}} = \\sqrt{1.76\\times10^{12}} = 1.33\\times10^6$ m/s, about $c/230$, so non-relativistic. It does not depend on temperature: even at $T = 0$ the fastest electrons move this fast.' },
    { id: 'fem-010', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Drude conductivity',
      q: 'A metal has resistivity $1.7\\times10^{-8}$ $\\Omega$ m and $8.5\\times10^{28}$ free electrons per m$^3$. The Drude relaxation time is ______ fs (to one decimal place).',
      answer: 24.6, tol: 0.3, calc: () => C.me / (1.7e-8 * 8.5e28 * C.e ** 2) * 1e15,
      sol: '$\\tau = \\dfrac{m}{\\rho ne^2} = \\dfrac{9.11\\times10^{-31}}{1.7\\times10^{-8}\\times8.5\\times10^{28}\\times(1.602\\times10^{-19})^2} = \\dfrac{9.11\\times10^{-31}}{3.71\\times10^{-17}} = 2.46\\times10^{-14}$ s $= 24.6$ fs.' },
    { id: 'fem-011', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'Wiedemann-Franz',
      q: 'In the Sommerfeld free electron model the Lorenz number $L = \\kappa/\\sigma T$ is',
      options: ['$\\tfrac32\\left(\\dfrac{k_B}{e}\\right)^2$', '$\\left(\\dfrac{k_B}{e}\\right)^2$', '$\\dfrac{\\pi^2}{2}\\left(\\dfrac{k_B}{e}\\right)^2$', '$\\dfrac{\\pi^2}{3}\\left(\\dfrac{k_B}{e}\\right)^2$'], answer: 3,
      sol: 'Kinetic theory gives $\\kappa = \\tfrac13c_vv^2\\tau$. With the Sommerfeld $c_v = \\tfrac{\\pi^2}{2}nk_B(T/T_F)$ and $v = v_F$, $\\kappa = \\tfrac{\\pi^2nk_B^2T\\tau}{3m}$. Dividing by $\\sigma = ne^2\\tau/m$: $L = \\tfrac{\\pi^2}{3}(k_B/e)^2 = 2.44\\times10^{-8}$ W $\\Omega$ K$^{-2}$.',
      trap: '$\\tfrac32(k_B/e)^2$ is the classical Drude value, which uses $c_v = \\tfrac32nk_B$ and $\\tfrac12mv^2 = \\tfrac32k_BT$.' },
    { id: 'fem-012', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'Drude vs Sommerfeld',
      q: 'Which statements about the Sommerfeld (quantum) free electron model are correct?',
      options: ['The Drude formula $\\sigma = ne^2\\tau/m$ still holds, with $\\tau$ the relaxation time of electrons at the Fermi surface.', 'It explains why aluminium has a positive Hall coefficient in strong fields.', 'The electronic heat capacity is proportional to $T$ at low temperature.', 'Only electrons within a few $k_BT$ of $E_F$ can take up thermal energy.'], answer: [0, 2, 3],
      sol: 'Pauli blocking means only a fraction $\\sim T/T_F$ of electrons can be excited, each by $\\sim k_BT$, so $C \\propto T$. Conduction shifts the whole Fermi sphere by $m\\,\\delta v = -eE\\tau$, giving the same $\\sigma = ne^2\\tau/m$. A positive Hall coefficient needs hole-like orbits, which come from the lattice (band theory); free electrons always give $R_H = -1/ne$.' },
    { id: 'fem-013', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'mobility',
      q: 'Electrons of mass $m_e$ in a metal have relaxation time $2.0\\times10^{-14}$ s. Their mobility is about',
      options: ['$3.5$ cm$^2$/V s', '$350$ cm$^2$/V s', '$35$ cm$^2$/V s', '$0.35$ cm$^2$/V s'], answer: 2,
      sol: '$\\mu = e\\tau/m = 1.602\\times10^{-19}\\times2.0\\times10^{-14}/9.11\\times10^{-31} = 3.5\\times10^{-3}$ m$^2$/V s $= 35$ cm$^2$/V s. Metals have low mobilities but huge $n$; silicon electrons have $\\mu \\approx 1400$ cm$^2$/V s.',
      trap: 'Forgetting that 1 m$^2$ = $10^4$ cm$^2$.' },
    { id: 'fem-014', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'density of states',
      q: 'For a 3D free electron gas of density $n$ at $T = 0$, the density of states per unit volume at the Fermi energy is',
      options: ['$\\dfrac{n}{E_F}$', '$\\dfrac{3n}{2E_F}$', '$\\dfrac{2n}{3E_F}$', '$\\dfrac{3n}{5E_F}$'], answer: 1,
      sol: '$n = \\int_0^{E_F}g\\,dE$ with $g = AE^{1/2}$ gives $n = \\tfrac23AE_F^{3/2}$. So $g(E_F) = AE_F^{1/2} = \\tfrac32n/E_F$. Equivalently $d\\ln n/d\\ln E_F = \\tfrac32$.' },
    { id: 'fem-015', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'density of states',
      q: 'Electrons free to move along a thin wire (one dimension, parabolic band) have a density of states that',
      options: ['is constant', 'grows as $E^{1/2}$', 'falls as $E^{-1/2}$', 'grows as $E$'], answer: 2,
      sol: 'In 1D, $N(E) \\propto k \\propto E^{1/2}$, so $g = dN/dE \\propto E^{-1/2}$. It diverges at the band bottom (a van Hove singularity), seen in the optical spectra of nanotubes. General rule: $g \\propto E^{d/2 - 1}$ in $d$ dimensions.' },
    { id: 'fem-016', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'Fermi sphere',
      q: 'Copper has $8.47\\times10^{28}$ free electrons per m$^3$. The radius of its free-electron Fermi sphere is about',
      options: ['$1.36$ Å$^{-1}$', '$0.68$ Å$^{-1}$', '$2.72$ Å$^{-1}$', '$13.6$ Å$^{-1}$'], answer: 0,
      sol: '$k_F = (3\\pi^2n)^{1/3} = (3\\pi^2\\times8.47\\times10^{28})^{1/3} = (2.51\\times10^{30})^{1/3} = 1.36\\times10^{10}$ m$^{-1} = 1.36$ Å$^{-1}$. The Fermi wavelength $2\\pi/k_F = 4.6$ Å is about one lattice spacing.',
      trap: '13.6 is $k_F$ in nm$^{-1}$, not Å$^{-1}$.' },
    { id: 'fem-041', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'Fermi sphere',
      q: 'For a free electron gas in a box of volume $V$ with periodic boundary conditions, which statements are correct?',
      options: ['Doubling the electron density doubles the radius of the Fermi sphere.', 'At $T = 0$ every state inside the Fermi sphere holds two electrons and every state outside is empty.', 'The Fermi velocity does not depend on the electron density.', 'Each allowed $\\mathbf k$ occupies a volume $(2\\pi)^3/V$ of $k$-space.'], answer: [1, 3],
      sol: 'Periodic conditions give $k_i = 2\\pi n_i/L$, so one $\\mathbf k$ per $(2\\pi/L)^3$. Filling with 2 electrons per $\\mathbf k$: $n = k_F^3/3\\pi^2$, so $k_F \\propto n^{1/3}$ (doubling $n$ multiplies $k_F$ by $1.26$) and $v_F = \\hbar k_F/m$ grows with $n$.' },

    // ---------- level 3 ----------
    { id: 'fem-017', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'heat capacity',
      q: 'A free electron gas has $T_F = 8.0\\times10^4$ K. At $300$ K its heat capacity is a fraction ______ of the classical value $\\tfrac32nk_B$ (to four decimal places).',
      answer: 0.0123, tol: 0.0003, calc: () => (Math.PI ** 2 / 3) * 300 / 8e4,
      sol: 'Sommerfeld: $C = \\dfrac{\\pi^2}{2}nk_B\\dfrac{T}{T_F}$. Ratio to $\\tfrac32nk_B$: $\\dfrac{\\pi^2}{3}\\dfrac{T}{T_F} = 3.290\\times\\dfrac{300}{80000} = 0.0123$. This is why electrons add almost nothing to a metal\'s heat capacity at room temperature.' },
    { id: 'fem-018', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'chemical potential',
      q: 'As a 3D free electron gas is warmed from $T = 0$ (still $T \\ll T_F$), its chemical potential',
      options: ['rises as $E_F[1 + (T/T_F)^2]$', 'stays exactly at $E_F$', 'falls slightly, as $E_F\\left[1 - \\tfrac{\\pi^2}{12}(T/T_F)^2\\right]$', 'falls linearly in $T$'], answer: 2,
      sol: 'With $g \\propto E^{1/2}$ there are more states just above $E_F$ than just below. Keeping $n$ fixed while the occupation smears symmetrically about $\\mu$ would overfill, so $\\mu$ must drop. The Sommerfeld expansion gives $\\mu = E_F[1 - \\tfrac{\\pi^2}{12}(T/T_F)^2]$; the shift is even in $T$ because $f$ is symmetric about $\\mu$.',
      trap: 'In 2D, where $g$ is constant, the shift is not $\\propto T^2$ but exponentially small.' },
    { id: 'fem-019', type: 'nat', level: 3, exams: ['gate', 'net'], sub: '2D electron gas',
      q: 'A GaAs two-dimensional electron gas has sheet density $1.0\\times10^{16}$ m$^{-2}$ and effective mass $0.067\\,m_e$ (spin degeneracy 2). Its Fermi energy measured from the subband bottom is ______ meV (to one decimal place).',
      answer: 35.7, tol: 0.4, calc: () => Math.PI * C.hbar ** 2 * 1e16 / (0.067 * C.me) / C.e * 1000,
      sol: 'In 2D, $n = g E_F$ with $g = m^*/\\pi\\hbar^2$, so $E_F = \\pi\\hbar^2n/m^*$. $\\pi\\times(1.055\\times10^{-34})^2\\times10^{16}/(0.067\\times9.11\\times10^{-31}) = 5.72\\times10^{-21}$ J $= 35.7$ meV.',
      trap: 'Leaving out spin gives $2\\pi\\hbar^2n/m^*$, twice too large.' },
    { id: 'fem-020', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'degeneracy pressure',
      q: 'For a 3D free electron gas at $T = 0$ with density $n$ and Fermi energy $E_F$, which statements are correct?',
      options: ['The pressure is $P = \\tfrac25nE_F$.', 'The bulk modulus is $B = \\tfrac23nE_F$.', 'The pressure is proportional to $n^{2/3}$.', 'The pressure is not zero even though $T = 0$.'], answer: [0, 1, 3],
      sol: 'Total energy $U = \\tfrac35NE_F \\propto N^{5/3}V^{-2/3}$. $P = -\\partial U/\\partial V = \\tfrac23U/V = \\tfrac25nE_F \\propto n^{5/3}$. $B = -V\\,\\partial P/\\partial V = \\tfrac53P = \\tfrac23nE_F$. The pressure comes from the Pauli principle, not from thermal motion.',
      trap: '$n^{2/3}$ is how $E_F$ scales; $P = \\tfrac25nE_F$ carries an extra $n$.' },
    { id: 'fem-021', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'heat capacity',
      q: 'At low temperature a metal has $C = \\gamma T + AT^3$ with $\\gamma = 0.70$ mJ mol$^{-1}$ K$^{-2}$ and $A = 0.050$ mJ mol$^{-1}$ K$^{-4}$. The electronic and lattice contributions are equal at $T =$ ______ K (to two decimal places).',
      answer: 3.74, tol: 0.03, calc: () => Math.sqrt(0.7 / 0.05),
      sol: '$\\gamma T = AT^3$ gives $T = \\sqrt{\\gamma/A} = \\sqrt{14} = 3.74$ K. Below this the electrons dominate the heat capacity of a metal, even though they are negligible at room temperature.' },
    { id: 'fem-022', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'heat capacity',
      q: 'Low-temperature heat capacity data of a metal are plotted as $C/T$ against $T^2$. The plot is a straight line whose',
      options: ['slope gives the electronic coefficient $\\gamma$ and intercept the Debye term', 'intercept gives $\\gamma$ and slope the Debye coefficient $A \\propto \\theta_D^{-3}$', 'intercept is zero for every metal', 'slope gives the Fermi energy directly'], answer: 1,
      sol: '$C/T = \\gamma + AT^2$: a line in $T^2$ with intercept $\\gamma$ (electrons, $\\propto g(E_F)$) and slope $A = \\tfrac{12\\pi^4}{5}R/\\theta_D^3$ (phonons). From $\\gamma$ one gets the thermal effective mass $m^*/m = \\gamma_{\\rm exp}/\\gamma_{\\rm free}$.' },
    { id: 'fem-023', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'heat capacity',
      q: 'A monovalent metal has free-electron Fermi temperature $5.0\\times10^4$ K. Its electronic heat capacity coefficient $\\gamma$ is ______ mJ mol$^{-1}$ K$^{-2}$ (to three decimal places).',
      answer: 0.821, tol: 0.008, calc: () => Math.PI ** 2 * C.R / (2 * 5e4) * 1000,
      sol: 'Per mole of electrons $C = \\dfrac{\\pi^2}{2}R\\dfrac{T}{T_F}$, so $\\gamma = \\dfrac{\\pi^2R}{2T_F} = \\dfrac{9.870\\times8.314}{1.0\\times10^5} = 8.21\\times10^{-4}$ J mol$^{-1}$ K$^{-2} = 0.821$ mJ mol$^{-1}$ K$^{-2}$.' },
    { id: 'fem-024', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'plasma frequency',
      q: 'Alkali metals reflect visible light but become transparent in the ultraviolet. In the free electron picture this is because',
      options: ['ultraviolet photons ionise the ions', 'the relaxation time becomes zero at high frequency', 'the permittivity $\\varepsilon = 1 - \\omega_p^2/\\omega^2$ is negative below $\\omega_p$ and positive above it', 'the band gap of the metal lies in the ultraviolet'], answer: 2,
      sol: 'For $\\omega\\tau \\gg 1$ the free electrons give $\\varepsilon(\\omega) = 1 - \\omega_p^2/\\omega^2$ with $\\omega_p^2 = ne^2/\\varepsilon_0m$. Below $\\omega_p$, $\\varepsilon < 0$, the wave vector is imaginary, the wave is evanescent and is reflected. Above $\\omega_p$ the metal transmits. For alkali densities $\\omega_p$ is in the UV (about 200 to 300 nm).' },
    { id: 'fem-025', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'plasma frequency',
      q: 'For a metal with $2.65\\times10^{28}$ free electrons per m$^3$, the free-electron model predicts transparency for wavelengths shorter than ______ nm (to the nearest nm).',
      answer: 205, tol: 3, calc: () => 2 * Math.PI * C.c / Math.sqrt(2.65e28 * C.e ** 2 / (C.eps0 * C.me)) * 1e9,
      sol: '$\\omega_p = \\sqrt{ne^2/\\varepsilon_0m} = \\sqrt{\\dfrac{2.65\\times10^{28}\\times2.567\\times10^{-38}}{8.854\\times10^{-12}\\times9.11\\times10^{-31}}} = 9.18\\times10^{15}$ rad/s. $\\lambda_p = 2\\pi c/\\omega_p = 205$ nm. (Sodium is measured to turn transparent near 210 nm.)' },
    { id: 'fem-026', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'mean free path',
      q: 'In a metal $v_F = 1.57\\times10^6$ m/s and the relaxation time at room temperature is $2.5\\times10^{-14}$ s. The electron mean free path is about',
      options: ['$0.39$ nm', '$3.9$ nm', '$390$ nm', '$39$ nm'], answer: 3,
      sol: 'Only electrons at the Fermi surface carry current, so $\\ell = v_F\\tau = 1.57\\times10^6\\times2.5\\times10^{-14} = 3.9\\times10^{-8}$ m $= 39$ nm, about 150 lattice spacings. Electrons are not scattered by the ions of a perfect lattice, only by its imperfections and vibrations.',
      trap: 'Using the classical thermal speed $\\sim10^5$ m/s gives a mean free path ten times too short, the Drude-era picture.' },
    { id: 'fem-027', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'thermionic emission',
      q: 'For thermionic emission from a free-electron metal with work function $W$, the Richardson-Dushman law $J = A_0T^2e^{-W/k_BT}$ holds. Which statements are correct?',
      options: ['Doubling the absolute temperature doubles $J$.', '$A_0 = 4\\pi mek_B^2/h^3 \\approx 1.2\\times10^6$ A m$^{-2}$ K$^{-2}$.', 'A plot of $\\ln(J/T^2)$ against $1/T$ is a straight line of slope $-W/k_B$.', '$W$ is measured from the Fermi level to the vacuum level.'], answer: [1, 2, 3],
      sol: 'Counting electrons in the Fermi tail with enough $p_x$ to escape gives $J = \\dfrac{4\\pi mek_B^2}{h^3}T^2e^{-W/k_BT}$ with $W = E_{\\rm vac} - E_F$. Taking logs, $\\ln(J/T^2) = \\ln A_0 - W/k_BT$. The exponential makes $J$ rise far faster than linearly: for $W = 4.5$ eV, going from 1500 K to 3000 K raises $J$ by about $10^8$.' },
    { id: 'fem-028', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Fermi-Dirac function',
      q: 'At what temperature is an electron state $0.10$ eV above the chemical potential occupied with probability exactly $0.010$? Answer ______ K (to the nearest kelvin). Take $k_B = 8.617\\times10^{-5}$ eV/K.',
      answer: 253, tol: 2, calc: () => 0.1 / (kBe * Math.log(99)),
      sol: '$\\dfrac{1}{e^{x} + 1} = 0.01$ gives $e^x = 99$, $x = \\ln99 = 4.595$. Then $k_BT = 0.10/4.595 = 0.02176$ eV and $T = 0.02176/8.617\\times10^{-5} = 253$ K.',
      trap: 'Using the Boltzmann approximation $e^{-x} = 0.01$ gives $x = 4.605$ and 252 K, close here but wrong when the probability is not small.' },
    { id: 'fem-042', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'AC conductivity',
      q: 'For the Drude model with fields $\\propto e^{-i\\omega t}$, which statements are correct?',
      options: ['Below the plasma frequency (with $\\omega\\tau \\gg 1$) electromagnetic waves decay inside the metal.', 'For typical metals $\\omega_p$ lies in the microwave range.', '$\\sigma(\\omega) = \\dfrac{\\sigma_0}{1 - i\\omega\\tau}$.', 'For $\\omega\\tau \\gg 1$ the relative permittivity is $1 - \\omega_p^2/\\omega^2$.'], answer: [0, 2, 3],
      sol: '$m\\dot v = -eE - mv/\\tau$ with $v \\propto e^{-i\\omega t}$ gives $v = -eE\\tau/m(1 - i\\omega\\tau)$, so $\\sigma = \\sigma_0/(1 - i\\omega\\tau)$. Then $\\varepsilon = 1 + i\\sigma/\\varepsilon_0\\omega \\to 1 - \\omega_p^2/\\omega^2$ for $\\omega\\tau \\gg 1$. Negative $\\varepsilon$ means an evanescent wave. With $n \\sim 10^{29}$ m$^{-3}$, $\\hbar\\omega_p \\sim 10$ eV: ultraviolet, not microwave.' },

    // ---------- level 4 ----------
    { id: 'fem-029', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'Fermi sphere',
      q: 'A monovalent metal has the fcc structure (conventional cube side $a$, 4 atoms per cube). The ratio of its free-electron Fermi wave vector to the distance from $\\Gamma$ to the nearest Brillouin-zone face (the L point, $\\sqrt3\\pi/a$) is ______ (to three decimal places).',
      answer: 0.903, tol: 0.003, calc: () => (12 * Math.PI ** 2) ** (1 / 3) / (Math.sqrt(3) * Math.PI),
      sol: '$n = 4/a^3$, so $k_F = (3\\pi^2\\cdot4/a^3)^{1/3} = (12\\pi^2)^{1/3}/a = 4.910/a$. The nearest zone face is the hexagon centred at L, at $\\tfrac12|\\mathbf G_{111}| = \\sqrt3\\pi/a = 5.441/a$. Ratio $= 0.903$: the sphere fits inside the zone, which is why the noble metals are nearly free-electron like, although copper\'s sphere touches the L faces in reality ("necks").' },
    { id: 'fem-030', type: 'nat', level: 4, exams: ['gate', 'net'], sub: '1D electron gas',
      q: 'A one-dimensional wire holds $1.0$ conduction electron per nm (spin degeneracy 2, mass $m_e$). Its Fermi energy is ______ meV (to the nearest meV). Take $\\hbar^2/2m_e = 0.0381$ eV nm$^2$.',
      answer: 94, tol: 1, calc: () => HB2M * (Math.PI / 2) ** 2 * 1000,
      sol: 'In 1D the states between $-k_F$ and $k_F$ number $2\\times\\dfrac{2k_F}{2\\pi/L}$ including spin, so $n = 2k_F/\\pi$ and $k_F = \\pi n/2 = 1.571$ nm$^{-1}$. $E_F = 0.0381\\times1.571^2 = 0.0940$ eV $= 94$ meV.',
      trap: 'Forgetting spin gives $k_F = \\pi n$ and an energy four times too large.' },
    { id: 'fem-031', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'ground-state energy',
      q: 'At $T = 0$ the mean energy per electron of a one-dimensional free electron gas, in units of its Fermi energy, is',
      options: ['$\\tfrac13$', '$\\tfrac12$', '$\\tfrac35$', '$\\tfrac23$'], answer: 0,
      sol: 'In $d$ dimensions $g \\propto E^{d/2 - 1}$, so $\\langle E\\rangle = \\dfrac{\\int_0^{E_F}E^{d/2}dE}{\\int_0^{E_F}E^{d/2 - 1}dE} = \\dfrac{d/2}{d/2 + 1}E_F = \\dfrac{d}{d + 2}E_F$. For $d = 1$: $\\tfrac13E_F$. (2D gives $\\tfrac12$, 3D $\\tfrac35$.) Directly: $E \\propto k^2$ averaged uniformly over $-k_F < k < k_F$ gives $\\tfrac13$.' },
    { id: 'fem-032', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'Drude in a magnetic field',
      q: 'Free electrons of one kind (density $n$, relaxation time $\\tau$) carry current in crossed $\\mathbf E$ and $\\mathbf B$ fields. In the steady state of the Drude model, which statements are correct?',
      options: ['The longitudinal resistivity does not change with $B$ (no magnetoresistance).', 'The Hall angle satisfies $\\tan\\theta_H = \\omega_c\\tau$ with $\\omega_c = eB/m$.', 'The Hall coefficient grows linearly with $B$.', 'The Hall coefficient $R_H = -1/ne$ does not depend on $\\tau$.'], answer: [0, 1, 3],
      sol: 'Steady state: $0 = -e(\\mathbf E + \\mathbf v\\times\\mathbf B) - m\\mathbf v/\\tau$. Then $\\rho_{xx} = m/ne^2\\tau$ independent of $B$ and $\\rho_{xy} = B/ne$ (sign set by the carrier), so $R_H = \\rho_{xy}/B = -1/ne$ for electrons, independent of $B$ and $\\tau$. $E_y/E_x = \\omega_c\\tau$ gives the Hall angle. Magnetoresistance needs two kinds of carriers or a non-spherical Fermi surface.' },
    { id: 'fem-033', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'chemical potential',
      q: 'A 3D free electron gas has $E_F = 5.0$ eV. At $1000$ K its chemical potential differs from $E_F$ by ______ meV (give the sign, to two decimal places). Take $k_B = 8.617\\times10^{-5}$ eV/K.',
      answer: -1.22, tol: 0.02, calc: () => -(Math.PI ** 2 / 12) * (kBe * 1000) ** 2 / 5 * 1000,
      sol: '$\\mu - E_F = -\\dfrac{\\pi^2}{12}\\dfrac{(k_BT)^2}{E_F} = -0.8225\\times\\dfrac{(0.08617)^2}{5.0}$ eV $= -1.22\\times10^{-3}$ eV $= -1.22$ meV. Tiny compared with $k_BT = 86$ meV, so in metals one may set $\\mu = E_F$.' },
    { id: 'fem-034', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'Wiedemann-Franz',
      q: 'A metal has electrical conductivity $5.9\\times10^7$ S/m at $300$ K. Using the Sommerfeld Lorenz number, its electronic thermal conductivity is ______ W m$^{-1}$ K$^{-1}$ (to the nearest whole number).',
      answer: 432, tol: 4, calc: () => LOR * 5.9e7 * 300,
      sol: '$L = \\tfrac{\\pi^2}{3}(k_B/e)^2 = 3.290\\times(8.617\\times10^{-5})^2 = 2.443\\times10^{-8}$ W $\\Omega$ K$^{-2}$. $\\kappa = L\\sigma T = 2.443\\times10^{-8}\\times5.9\\times10^7\\times300 = 432$ W m$^{-1}$ K$^{-1}$ (copper is measured at about 400).' },
    { id: 'fem-035', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'Drude vs Sommerfeld',
      q: 'The classical Drude model gives a Lorenz number within a factor of about 2 of experiment. The reason is that it',
      options: ['uses the correct heat capacity and correct electron speed', 'overestimates the electronic heat capacity by about 100 times and underestimates the mean square speed by about 100 times, and the errors cancel', 'ignores the ions, which carry most of the heat', 'uses the correct relaxation time but the wrong electron density'], answer: 1,
      sol: '$\\kappa \\propto c_v\\langle v^2\\rangle\\tau$. Classically $c_v = \\tfrac32nk_B$ (about $T_F/T \\sim 100$ times too big) and $\\tfrac12m\\langle v^2\\rangle = \\tfrac32k_BT$ (about $T_F/T$ times too small compared with $v_F^2$). The product is nearly right; $\\tau$ cancels in $\\kappa/\\sigma$. The leftover factor is $\\pi^2/3$ against $3/2$.' },
    { id: 'fem-036', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'degeneracy pressure',
      q: 'A free electron gas has $n = 2.65\\times10^{28}$ m$^{-3}$ and $E_F = 3.24$ eV. Its bulk modulus is about',
      options: ['$5.5$ GPa', '$13.8$ GPa', '$9.2$ GPa', '$0.92$ GPa'], answer: 2,
      sol: '$B = \\tfrac23nE_F = \\tfrac23\\times2.65\\times10^{28}\\times3.24\\times1.602\\times10^{-19} = 9.2\\times10^9$ Pa. Sodium is measured at about 6.3 GPa: the electron gas alone accounts for most of the stiffness of an alkali metal.',
      trap: '$5.5$ GPa is the pressure $\\tfrac25nE_F$, not the bulk modulus $\\tfrac53P$.' },

    // ---------- level 5 ----------
    { id: 'fem-037', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'heat capacity',
      q: 'A metal has $\\gamma = 0.69$ mJ mol$^{-1}$ K$^{-2}$ and Debye temperature $343$ K. At $10$ K, the ratio of its electronic to lattice heat capacity is ______ (to three decimal places). Use the Debye $T^3$ law $C = \\tfrac{12\\pi^4}{5}R(T/\\theta_D)^3$.',
      answer: 0.143, tol: 0.003, calc: () => 6.9e-3 / (12 * Math.PI ** 4 / 5 * C.R * (10 / 343) ** 3),
      sol: 'Lattice: $\\tfrac{12\\pi^4}{5}R = 1944$ J mol$^{-1}$ K$^{-1}$; $(10/343)^3 = 2.478\\times10^{-5}$; product $48.2$ mJ mol$^{-1}$ K$^{-1}$. Electronic: $0.69\\times10 = 6.9$ mJ mol$^{-1}$ K$^{-1}$. Ratio $6.9/48.2 = 0.143$. Cooling further, the ratio grows as $1/T^2$.' },
    { id: 'fem-038', type: 'msq', level: 5, exams: ['gate', 'net'], sub: '2D electron gas',
      q: 'For a two-dimensional free electron gas of fixed density with Fermi energy $E_F$, which statements are correct?',
      options: ['The density of states per unit area is $m/\\pi\\hbar^2$ at all energies above the band bottom.', '$E_F$ is proportional to the density $n$.', 'The chemical potential is exactly $\\mu = k_BT\\ln\\left(e^{E_F/k_BT} - 1\\right)$.', 'At low temperature $\\mu - E_F$ is of order $-(k_BT)^2/E_F$, as in 3D.'], answer: [0, 1, 2],
      sol: 'With constant $g$, $n = g\\int_0^\\infty \\dfrac{dE}{e^{(E - \\mu)/k_BT} + 1} = gk_BT\\ln(1 + e^{\\mu/k_BT})$. Since $n = gE_F$: $e^{E_F/k_BT} = 1 + e^{\\mu/k_BT}$, which inverts to the stated formula. For $k_BT \\ll E_F$ this gives $\\mu - E_F \\approx -k_BTe^{-E_F/k_BT}$: exponentially small, not $\\propto T^2$, because all Sommerfeld corrections involve $g\'(E_F) = 0$.' },
    { id: 'fem-039', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'thin films',
      q: 'Free electrons ($m_e$) in a metal film $1.0$ nm thick are confined by infinitely high walls in the thickness direction and free in the plane. If the Fermi energy measured from the bottom of the potential is $5.0$ eV, the number of occupied 2D subbands is ______. Take $\\hbar^2/2m_e = 0.0381$ eV nm$^2$.',
      answer: 3, tol: 0, calc: () => Math.floor(Math.sqrt(5 / (HB2M * Math.PI ** 2))),
      sol: 'Confinement gives $E_j = \\dfrac{\\hbar^2}{2m}\\left(\\dfrac{j\\pi}{L}\\right)^2 = 0.0381\\times\\pi^2j^2 = 0.376j^2$ eV, each the bottom of a 2D subband. A subband is occupied when $E_j < E_F$: $j^2 < 13.3$, so $j = 1, 2, 3$. Three subbands; the 2D density of states is a staircase with three steps below $E_F$.' },
    { id: 'fem-040', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'AC conductivity',
      q: 'For a free-electron metal with $\\omega_p\\tau \\gg 1$, light of frequency $1/\\tau \\ll \\omega < \\omega_p$ falls normally on its surface. The reflectivity is',
      options: ['close to zero', 'about one half', 'exactly $(1 - \\omega/\\omega_p)^2$', 'close to 1'], answer: 3,
      sol: 'Here $\\varepsilon = 1 - \\omega_p^2/\\omega^2 < 0$, so the refractive index $N = i\\kappa$ is purely imaginary (no absorption when $\\omega\\tau \\gg 1$). Then $R = |(N - 1)/(N + 1)|^2 = |(i\\kappa - 1)/(i\\kappa + 1)|^2 = 1$. Small losses from finite $\\tau$ bring it just below 1, which is why polished metals are such good mirrors.' },
    ...more2,
    ...r4.items,
    ...r5.items,
  ],
  gens: [
    { id: 'fem-g01', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Fermi energy',
      make(r) {
        const met = choose(r, [['potassium', 1, 1.40], ['sodium', 1, 2.54], ['lithium', 1, 4.63], ['copper', 1, 8.47], ['silver', 1, 5.86], ['magnesium', 2, 4.30], ['aluminium', 3, 6.02], ['zinc', 2, 6.57], ['calcium', 2, 2.30]]);
        const [name, Z, na] = met; // na = atoms per m^3 in units of 1e28
        const n = Z * na * 1e28, E = EFofn(n);
        return { q: `${name[0].toUpperCase() + name.slice(1)} has $${na}\\times10^{28}$ atoms per m$^3$ and gives ${Z === 1 ? 'one conduction electron' : `${Z} conduction electrons`} per atom. Its free-electron Fermi energy is ______ eV (to two decimal places). Take $\\hbar^2/2m_e = 0.0381$ eV nm$^2$.`,
          answer: round(E, 2), tol: Math.max(0.02, round(E * 0.01, 2)), n,
          sol: `$n = ${Z}\\times${na}\\times10^{28} = ${round(n / 1e28, 2)}\\times10^{28}$ m$^{-3} = ${round(n / 1e27, 1)}$ nm$^{-3}$. $(3\\pi^2n)^{2/3} = ${round((3 * Math.PI ** 2 * n * 1e-27) ** (2 / 3), 2)}$ nm$^{-2}$. $E_F = 0.0381\\times$ that $= ${round(E, 2)}$ eV.`,
          trap: Z > 1 ? 'Using the atom density instead of the electron density (multiply by the valence).' : 'Using $(3\\pi^2n)^{1/3}$, which is $k_F$, not $k_F^2$.' };
      },
      verify: (p) => EFofn(p.n) },
    { id: 'fem-g02', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Drude conductivity',
      make(r) {
        const rho = pick(r, 1.5, 9.5, 0.5), n = pick(r, 1.0, 18.0, 0.5);
        const tau = C.me / (rho * 1e-8 * n * 1e28 * C.e ** 2) * 1e15;
        return { q: `A metal has resistivity $${rho}\\times10^{-8}$ $\\Omega$ m and $${n}\\times10^{28}$ free electrons per m$^3$. Its Drude relaxation time is ______ fs (to one decimal place).`,
          answer: round(tau, 1), tol: Math.max(0.1, round(tau * 0.01, 1)), rho, n,
          sol: `$\\tau = \\dfrac{m}{\\rho ne^2} = \\dfrac{9.11\\times10^{-31}}{${rho}\\times10^{-8}\\times${n}\\times10^{28}\\times(1.602\\times10^{-19})^2} = ${round(tau, 1)}\\times10^{-15}$ s.` };
      },
      verify: (p) => C.me / (p.rho * 1e-8 * p.n * 1e28 * C.e ** 2) * 1e15 },
    { id: 'fem-g03', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Fermi-Dirac function',
      make(r) {
        const d = choose(r, [-0.15, -0.1, -0.05, -0.02, 0.02, 0.05, 0.08, 0.1, 0.2]), T = choose(r, [77, 150, 300, 450, 600, 1000]);
        const x = d / (kBe * T), f = 1 / (Math.exp(x) + 1);
        const where = d > 0 ? `${d} eV above` : `${-d} eV below`;
        return { q: `At $${T}$ K, the probability that an electron state ${where} the chemical potential is occupied is ______ (to four decimal places). Take $k_B = 8.617\\times10^{-5}$ eV/K.`,
          answer: round(f, 4), tol: Math.max(0.0002, round(f * 0.01, 4)), d, T,
          sol: `$k_BT = ${round(kBe * T, 5)}$ eV, so $(E - \\mu)/k_BT = ${round(x, 3)}$. $f = 1/(e^{${round(x, 3)}} + 1) = ${round(f, 4)}$.${d < 0 ? ' Below $\\mu$ it is easier to find the chance of being empty, $1 - f$, first.' : ''}` };
      },
      verify: (p) => 1 / (Math.exp(p.d / (kBe * p.T)) + 1) },
    { id: 'fem-g04', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'heat capacity',
      make(r) {
        const EF = pick(r, 2, 12, 0.5), Z = choose(r, [1, 1, 2, 3]);
        const g = (Math.PI ** 2 / 2) * Z * C.R * kBe / EF * 1000;
        return { q: `A metal of valence $${Z}$ has free-electron Fermi energy $${EF}$ eV. Its electronic heat capacity coefficient $\\gamma$ (per mole of atoms) is ______ mJ mol$^{-1}$ K$^{-2}$ (to three decimal places).`,
          answer: round(g, 3), tol: Math.max(0.002, round(g * 0.01, 3)), EF, Z,
          sol: `$T_F = E_F/k_B = ${round(EF / kBe, 0)}$ K. Per mole of atoms there are $${Z}N_A$ electrons, so $\\gamma = \\dfrac{\\pi^2}{2}\\dfrac{${Z}R}{T_F} = ${round(g, 3)}$ mJ mol$^{-1}$ K$^{-2}$.`,
          trap: Z > 1 ? 'Forgetting the valence: per mole of atoms there are $Z$ moles of electrons.' : 'Using $\\pi^2/3$ instead of $\\pi^2/2$.' };
      },
      verify: (p) => (Math.PI ** 2 / 2) * p.Z * C.R * kBe / p.EF * 1000 },
    { id: 'fem-g05', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'density of states',
      make(r) {
        const d = choose(r, [1, 2, 3]), what = choose(r, ['g', 'N']);
        const pw = what === 'g' ? d / 2 - 1 : d / 2;
        const show = (p) => (p === 0 ? 'independent of $E$' : `$\\propto E^{${p === 1 ? '1' : p === -0.5 ? '-1/2' : p === 0.5 ? '1/2' : p === 1.5 ? '3/2' : p}}$`);
        const all = [-0.5, 0, 0.5, 1, 1.5].filter((p) => p !== pw);
        const { options, answer } = mcqOptions(r, pw, all, show);
        const qty = what === 'g' ? 'the density of states $g(E)$' : 'the number of states $N(E)$ with energy below $E$';
        return { q: `For free electrons with a parabolic band in ${d} dimension${d > 1 ? 's' : ''}, ${qty} is`, options, answer, d, what,
          sol: `In $d$ dimensions the states below $E$ fill a $d$-dimensional ball of radius $k \\propto E^{1/2}$, so $N(E) \\propto k^d \\propto E^{d/2}$ and $g = dN/dE \\propto E^{d/2 - 1}$. For $d = ${d}$: ${what === 'g' ? `$g$ ${show(pw)}` : `$N$ ${show(pw)}`}.` };
      } },
    { id: 'fem-g06', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'heat capacity',
      make(r) {
        const g = pick(r, 0.5, 3.0, 0.1), th = choose(r, [90, 105, 165, 225, 280, 343, 428]);
        const T = Math.sqrt(5 * g * 1e-3 * th ** 3 / (12 * Math.PI ** 4 * C.R));
        return { q: `A metal has electronic coefficient $\\gamma = ${g}$ mJ mol$^{-1}$ K$^{-2}$ and Debye temperature $${th}$ K. Using the Debye $T^3$ law for the lattice, the electronic and lattice heat capacities are equal at ______ K (to two decimal places).`,
          answer: round(T, 2), tol: Math.max(0.02, round(T * 0.01, 2)), g, th,
          sol: `$\\gamma T = \\dfrac{12\\pi^4}{5}R\\dfrac{T^3}{\\theta_D^3}$ gives $T = \\sqrt{\\dfrac{5\\gamma\\theta_D^3}{12\\pi^4R}} = \\sqrt{\\dfrac{${g}\\times10^{-3}\\times${th}^3}{1944}} = ${round(T, 2)}$ K.`,
          trap: 'Forgetting to convert mJ to J before dividing by $R$ in J mol$^{-1}$ K$^{-1}$.' };
      },
      verify: (p) => Math.sqrt(5 * p.g * 1e-3 * p.th ** 3 / (12 * Math.PI ** 4 * C.R)) },
    { id: 'fem-g07', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'Wiedemann-Franz',
      make(r) {
        const T = choose(r, [77, 200, 273, 300, 400]), toK = r() < 0.5;
        if (toK) {
          const s = pick(r, 1.0, 6.5, 0.1), k = LOR * s * 1e7 * T;
          return { q: `A metal has electrical conductivity $${s}\\times10^7$ S/m at $${T}$ K. Assuming the Wiedemann-Franz law with the Sommerfeld Lorenz number, its electronic thermal conductivity is ______ W m$^{-1}$ K$^{-1}$ (to one decimal place).`,
            answer: round(k, 1), tol: Math.max(0.2, round(k * 0.01, 1)), toK, s, T,
            sol: `$L = \\tfrac{\\pi^2}{3}(k_B/e)^2 = 2.443\\times10^{-8}$ W $\\Omega$ K$^{-2}$. $\\kappa = L\\sigma T = 2.443\\times10^{-8}\\times${s}\\times10^7\\times${T} = ${round(k, 1)}$ W m$^{-1}$ K$^{-1}$.` };
        }
        const k = pick(r, 50, 420, 10), s = k / (LOR * T) / 1e7;
        return { q: `A metal has electronic thermal conductivity $${k}$ W m$^{-1}$ K$^{-1}$ at $${T}$ K. Assuming the Wiedemann-Franz law with the Sommerfeld Lorenz number, its electrical resistivity is ______ $\\times10^{-8}$ $\\Omega$ m (to three decimal places).`,
          answer: round(10 / s, 3), tol: Math.max(0.002, round(0.1 / s, 3)), toK, k, T,
          sol: `$\\sigma = \\kappa/LT = ${k}/(2.443\\times10^{-8}\\times${T}) = ${round(s, 3)}\\times10^7$ S/m, so $\\rho = 1/\\sigma = ${round(10 / s, 3)}\\times10^{-8}$ $\\Omega$ m.` };
      },
      verify: (p) => (p.toK ? LOR * p.s * 1e7 * p.T : LOR * p.T / p.k * 1e8) },
    { id: 'fem-g08', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'plasma frequency',
      make(r) {
        const n = pick(r, 1.0, 18.0, 0.5), unit = choose(r, ['nm', 'eV']);
        const wp = Math.sqrt(n * 1e28 * C.e ** 2 / (C.eps0 * C.me));
        const ans = unit === 'nm' ? 2 * Math.PI * C.c / wp * 1e9 : C.hbar * wp / C.e;
        return { q: unit === 'nm' ? `A free-electron metal with $${n}\\times10^{28}$ electrons per m$^3$ becomes transparent below a wavelength of ______ nm (to the nearest nm).` : `The plasmon energy $\\hbar\\omega_p$ of a free electron gas with $${n}\\times10^{28}$ electrons per m$^3$ is ______ eV (to two decimal places).`,
          answer: unit === 'nm' ? Math.round(ans) : round(ans, 2), tol: unit === 'nm' ? Math.max(1, Math.round(ans * 0.01)) : Math.max(0.02, round(ans * 0.01, 2)), n, unit,
          sol: `$\\omega_p = \\sqrt{ne^2/\\varepsilon_0m} = ${round(wp / 1e15, 3)}\\times10^{15}$ rad/s. ${unit === 'nm' ? `$\\lambda_p = 2\\pi c/\\omega_p = ${Math.round(ans)}$ nm.` : `$\\hbar\\omega_p = ${round(ans, 2)}$ eV.`}` };
      },
      verify: (p) => { const wp = Math.sqrt(p.n * 1e28 * C.e ** 2 / (C.eps0 * C.me)); return p.unit === 'nm' ? 2 * Math.PI * C.c / wp * 1e9 : C.hbar * wp / C.e; } },
    { id: 'fem-g09', type: 'nat', level: 4, exams: ['gate', 'net'], sub: '2D electron gas',
      make(r) {
        const [mat, m] = choose(r, [['GaAs', 0.067], ['InAs', 0.023], ['silicon (one valley pair, $m^* = 0.19\\,m_e$, valley degeneracy 2)', 0.19], ['an AlGaN/GaN heterostructure', 0.22]]);
        const gv = m === 0.19 ? 2 : 1, ns = pick(r, 1, 12, 0.5);
        const E = Math.PI * C.hbar ** 2 * ns * 1e15 / (gv * m * C.me) / C.e * 1000;
        return { q: `A two-dimensional electron gas in ${mat} has sheet density $${ns}\\times10^{15}$ m$^{-2}$${m === 0.19 ? '' : ` and effective mass $${m}\\,m_e$`} (spin degeneracy 2${gv > 1 ? '' : ', one valley'}). Its Fermi energy above the subband bottom is ______ meV (to one decimal place).`,
          answer: round(E, 1), tol: Math.max(0.1, round(E * 0.01, 1)), ns, m, gv,
          sol: `$n_s = g_sg_v\\dfrac{m^*}{2\\pi\\hbar^2}E_F$ with $g_s = 2$, $g_v = ${gv}$. So $E_F = \\dfrac{\\pi\\hbar^2n_s}{${gv > 1 ? 'g_v' : ''}m^*} = ${round(E, 1)}$ meV.`,
          trap: gv > 1 ? 'Forgetting the valley degeneracy doubles the answer.' : 'Forgetting spin doubles the answer.' };
      },
      verify: (p) => Math.PI * C.hbar ** 2 * p.ns * 1e15 / (p.gv * p.m * C.me) / C.e * 1000 },
    { id: 'fem-g10', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'thin films',
      make(r) {
        const L = choose(r, [0.6, 0.8, 1.0, 1.2, 1.5, 2.0]), EF = choose(r, [3.2, 4.7, 5.5, 7.0, 9.4]);
        const E1 = HB2M * (Math.PI / L) ** 2, N = Math.floor(Math.sqrt(EF / E1));
        return { q: `A metal film $${L}$ nm thick confines free electrons ($m_e$) between infinitely high walls; the electrons move freely in the plane. If the Fermi energy measured from the bottom of the well is $${EF}$ eV, how many 2D subbands are occupied? Take $\\hbar^2/2m_e = 0.0381$ eV nm$^2$.`,
          answer: N, tol: 0, L, EF,
          sol: `$E_j = 0.0381(j\\pi/${L})^2 = ${round(E1, 3)}j^2$ eV. Occupied while $E_j < ${EF}$: $j^2 < ${round(EF / E1, 2)}$, so $j = 1$ to $${N}$: ${N} subband${N === 1 ? '' : 's'}.` };
      },
      verify: (p) => Math.floor(Math.sqrt(p.EF / (HB2M * (Math.PI / p.L) ** 2))) },
    { id: 'fem-g11', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'scaling',
      make(r) {
        const s = choose(r, [8, 27, 64]), b = Math.round(Math.cbrt(s));
        const [name, p] = choose(r, [['the Fermi energy', 2], ['the Fermi wave vector', 1], ['the Fermi velocity', 1], ['the degeneracy pressure at $T = 0$', 5], ['the density of states per unit volume at the Fermi energy', 1], ['the electronic heat capacity per unit volume at a fixed low $T$', 1], ['the Fermi temperature', 2]]);
        const val = b ** p;
        const { options, answer } = mcqOptions(r, val, [b, b * b, b ** 3, b ** 4, b ** 5].filter((v) => v !== val), (v) => String(v));
        return { q: `The free-electron density of a 3D metal is made $${s}$ times larger. By what factor does ${name} change?`, options, answer, s, p,
          sol: `$E_F \\propto n^{2/3}$, $k_F, v_F \\propto n^{1/3}$, $g(E_F) = \\tfrac32n/E_F \\propto n^{1/3}$, $C \\propto g(E_F)T \\propto n^{1/3}$, $P = \\tfrac25nE_F \\propto n^{5/3}$. Here the power is $${p}/3$: factor $${s}^{${p}/3} = ${val}$.` };
      } },
    { id: 'fem-g12', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'scaling',
      make(r) {
        const p = choose(r, [1, 2]);
        const qs = [['$k_F$', 1], ['$E_F$', 2], ['$v_F$', 1], ['$T_F$', 2], ['$g(E_F)$ per unit volume', 1], ['the plasma frequency $\\omega_p$', 1.5]];
        const pickd = qs.slice(0, 4).concat(choose(r, [qs.slice(4, 5), qs.slice(5)]));
        const answer = pickd.map((x, i) => (x[1] === p ? i : -1)).filter((i) => i >= 0);
        return { q: `For a 3D free electron gas of density $n$, which of these quantities are proportional to $n^{${p}/3}$?`, options: pickd.map((x) => x[0]), answer, p,
          sol: `$k_F = (3\\pi^2n)^{1/3}$, $v_F = \\hbar k_F/m \\propto n^{1/3}$, $E_F = k_BT_F = \\hbar^2k_F^2/2m \\propto n^{2/3}$, $g(E_F) = 3n/2E_F \\propto n^{1/3}$, and $\\omega_p = \\sqrt{ne^2/\\varepsilon_0m} \\propto n^{1/2}$.` };
      } },
    ...more,
    ...r4.gens,
    ...r5.gens,
  ],
};
