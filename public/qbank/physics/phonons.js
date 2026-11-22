// Lattice vibrations and phonons (GATE / CSIR NET level): the monatomic chain (dispersion, group and phase velocity,
// sound speed, second neighbours, density of states), the diatomic chain (acoustic and optical branches, gap,
// alternating springs), branches in 3D, crystal momentum and Umklapp processes, phonon statistics, inelastic neutron
// and Raman scattering, LO-TO splitting and the Lyddane-Sachs-Teller relation, soft modes, thermal conductivity.
// Original questions for fibub.
import { pick, int, choose, mcqOptions, round, C } from '../_util.js';
import more from './phonons.more.gen.js';
import more2 from './phonons.more2.gen.js';
import r4 from './phonons.r4.gen.js';

const PI = Math.PI, U = C.u;
const HEV = C.h / C.e;                     // h in eV s
const KBMEV = C.kB / C.e * 1000;           // kB in meV/K
const ENEUT = (C.h ** 2 / (2 * C.mn * 1e-20)) / C.e * 1000; // neutron energy in meV for lambda = 1 Å (81.8)
const diat = (K, M1, M2, ka, sign) => { const s = 1 / M1 + 1 / M2; return Math.sqrt(K * (s + sign * Math.sqrt(Math.max(0, s * s - 4 * Math.sin(ka / 2) ** 2 / (M1 * M2))))); };
const STRUCTS = [['copper (fcc, one atom per primitive cell)', 1], ['silicon (diamond structure)', 2], ['NaCl (rock salt)', 2], ['CsCl', 2], ['an hcp metal such as Mg', 2], ['fluorite CaF$_2$', 3], ['wurtzite GaN', 4], ['cubic perovskite SrTiO$_3$', 5], ['graphite (AB stacking)', 4], ['$\\alpha$-quartz SiO$_2$ (three formula units per cell)', 9]];

export default {
  topic: 'phonons',
  items: [
    // ---------- level 1 ----------
    { id: 'ph-001', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'monatomic chain',
      q: 'For a chain of atoms of mass $m$ and spacing $a$ joined by springs of constant $K$ (nearest neighbours only), the dispersion relation is',
      options: ['$\\omega = \\sqrt{K/m}\\,ka$', '$\\omega = 2\\sqrt{K/m}\\,|\\sin(ka/2)|$', '$\\omega = 2\\sqrt{K/m}\\,|\\cos(ka/2)|$', '$\\omega = \\sqrt{2K/m}\\,|\\sin(ka)|$'], answer: 1,
      sol: 'Newton for atom $n$: $m\\ddot u_n = K(u_{n+1} - u_n) - K(u_n - u_{n-1})$. With $u_n = Ae^{i(kna - \\omega t)}$: $-m\\omega^2 = K(e^{ika} + e^{-ika} - 2) = -4K\\sin^2(ka/2)$. So $\\omega = 2\\sqrt{K/m}|\\sin(ka/2)|$, linear only for small $k$.',
      trap: 'The linear form is just the long-wavelength limit; the cosine form would give a maximum frequency at $k = 0$.' },
    { id: 'ph-002', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'group velocity',
      q: 'At the edge of the first Brillouin zone ($k = \\pi/a$), the group velocity of a wave on a monatomic chain is',
      options: ['equal to the speed of sound', 'infinite', 'zero', 'twice the speed of sound'], answer: 2,
      sol: '$v_g = d\\omega/dk = a\\sqrt{K/m}\\cos(ka/2)$, which vanishes at $ka = \\pi$. Neighbouring atoms move in exact opposition: a standing wave, the Bragg-reflected combination of waves travelling both ways, which carries no energy.',
      trap: 'The phase velocity $\\omega/k$ is not zero there; only the group velocity is.' },
    { id: 'ph-003', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'branches',
      q: 'A 3D crystal has two atoms in each primitive cell. How many phonon branches does it have?',
      options: ['2', '3', '6', '12'], answer: 2,
      sol: 'Each atom can move in 3 directions, so a cell has $3p = 6$ degrees of freedom and there are 6 branches: 3 acoustic (one longitudinal, two transverse) and $3p - 3 = 3$ optical.',
      trap: 'Counting only the atoms (2) or only the directions (3).' },
    { id: 'ph-004', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'phonons',
      q: 'A phonon is',
      options: ['a quantum of energy $\\hbar\\omega$ in one normal mode of lattice vibration', 'an electron bound to a vibrating ion', 'a photon trapped inside a crystal', 'the smallest piece of a crystal that can vibrate'], answer: 0,
      sol: 'Each normal mode of a harmonic lattice is an independent oscillator with energies $(n + \\tfrac12)\\hbar\\omega$. Raising $n$ by one adds one phonon of that mode. Phonons are bosons: any number can occupy a mode.',
      trap: 'A phonon belongs to the whole crystal (a collective mode), not to one atom.' },
    { id: 'ph-005', type: 'nat', level: 1, exams: ['gate', 'net'], sub: 'monatomic chain', unit: '10¹³ rad/s',
      q: 'A monatomic chain has atoms of mass $1.0\\times10^{-26}$ kg joined by springs of $10$ N/m. Its highest vibration angular frequency is ______ $\\times10^{13}$ rad/s (to two decimal places).',
      answer: 6.32, tol: 0.01, calc: () => 2 * Math.sqrt(10 / 1e-26) / 1e13,
      sol: '$\\omega_{max} = 2\\sqrt{K/m} = 2\\sqrt{10/10^{-26}} = 2\\times3.162\\times10^{13} = 6.32\\times10^{13}$ rad/s, reached at the zone boundary.',
      trap: 'Forgetting the factor 2 gives $\\sqrt{K/m}$, the frequency of one mass on one spring.' },
    { id: 'ph-006', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'statistics',
      q: 'In thermal equilibrium, the mean number of phonons in a mode of frequency $\\omega$ is given by',
      options: ['Fermi-Dirac statistics with $\\mu = E_F$', 'Maxwell-Boltzmann statistics', 'Bose-Einstein statistics with $\\mu = 0$', 'Bose-Einstein statistics with $\\mu$ fixed by the number of atoms'], answer: 2,
      sol: 'Phonons are bosons whose number is not conserved (the lattice creates and destroys them freely), so the chemical potential is zero: $\\langle n\\rangle = 1/(e^{\\hbar\\omega/k_BT} - 1)$. This is exactly the mean excitation of a quantum oscillator.',
      trap: 'Phonon number is not tied to the number of atoms; only the number of modes is.' },

    // ---------- level 2 ----------
    { id: 'ph-007', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'sound speed', unit: 'm/s',
      q: 'A chain of atoms of mass 40 u with spacing $3.0$ Å and spring constant $15$ N/m carries long-wavelength sound at a speed of ______ m/s (to the nearest 10 m/s). Use $1$ u $= 1.6605\\times10^{-27}$ kg.',
      answer: 4510, tol: 10, calc: () => 3e-10 * Math.sqrt(15 / (40 * U)),
      sol: 'For small $k$, $\\omega \\approx a\\sqrt{K/m}\\,k$, so $v_s = a\\sqrt{K/m}$. $m = 6.642\\times10^{-26}$ kg, $\\sqrt{15/6.642\\times10^{-26}} = 1.503\\times10^{13}$ s$^{-1}$, $v_s = 3.0\\times10^{-10}\\times1.503\\times10^{13} = 4.51\\times10^3$ m/s.',
      trap: 'Using the mass in u without converting to kg.' },
    { id: 'ph-008', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'sound speed',
      q: 'In the long-wavelength limit ($ka \\ll 1$), acoustic phonons of a monatomic chain',
      options: ['have a frequency independent of $k$', 'have $\\omega \\propto k$, with equal phase and group velocities (no dispersion)', 'have $\\omega \\propto k^2$, like free particles', 'have zero group velocity'], answer: 1,
      sol: '$\\sin(ka/2) \\approx ka/2$ gives $\\omega \\approx a\\sqrt{K/m}\\,k$. Phase and group velocity both equal $a\\sqrt{K/m}$: the chain behaves as a continuous elastic string, which is why ordinary sound does not disperse.',
      trap: '$\\omega \\propto k^2$ is the dispersion of magnons in a ferromagnet (and of free particles), not of phonons.' },
    { id: 'ph-009', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'diatomic chain',
      q: 'In a diatomic chain (masses $M_1$ and $M_2$), the optical mode at $k = 0$ has',
      options: ['both atoms moving together with equal amplitudes', 'only the heavier atoms moving', 'zero frequency', 'neighbouring atoms moving in opposite directions with amplitudes in the ratio $M_2 : M_1$, so the centre of mass stays still'], answer: 3,
      sol: 'At $k = 0$ every cell does the same thing, so the motion is just the two atoms of a cell oscillating against each other on their springs: $M_1u_1 + M_2u_2 = 0$, i.e. $u_1/u_2 = -M_2/M_1$, with $\\omega^2 = 2K(1/M_1 + 1/M_2)$. In an ionic crystal this sets up an oscillating dipole that couples to infrared light, hence "optical".',
      trap: 'Moving together with equal amplitudes is the acoustic mode at $k = 0$ (a rigid translation, $\\omega = 0$).' },
    { id: 'ph-010', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'diatomic chain', unit: '10¹³ rad/s',
      q: 'A diatomic chain has masses $M_1 = 2.0\\times10^{-26}$ kg and $M_2 = 1.0\\times10^{-26}$ kg joined alternately by identical springs of $20$ N/m. The optical-branch frequency at $k = 0$ is ______ $\\times10^{13}$ rad/s (to two decimal places).',
      answer: 7.75, tol: 0.01, calc: () => Math.sqrt(2 * 20 * (1 / 2e-26 + 1 / 1e-26)) / 1e13,
      sol: '$\\omega^2 = 2K\\left(\\dfrac1{M_1} + \\dfrac1{M_2}\\right) = 40\\times(5\\times10^{25} + 10^{26}) = 6.0\\times10^{27}$ s$^{-2}$, so $\\omega = 7.75\\times10^{13}$ rad/s.',
      trap: 'Using $K$ instead of $2K$: each atom has two springs.' },
    { id: 'ph-011', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'diatomic chain', format: 'multi',
      q: 'For a diatomic chain with masses $M_1 > M_2$ and equal springs $K$, which statements are correct?',
      options: ['At the zone boundary the acoustic frequency is $\\sqrt{2K/M_1}$.', 'At the zone boundary the optical frequency is $\\sqrt{2K/M_2}$.', 'The gap between the branches grows as the two masses get closer.', 'A monatomic chain also has an optical branch.'], answer: [0, 1],
      sol: 'At $ka = \\pi$, $\\sin^2(ka/2) = 1$ and the roots become $\\omega^2 = 2K/M_1$ (only the heavy atoms move) and $2K/M_2$ (only the light ones). The gap $\\sqrt{2K/M_2} - \\sqrt{2K/M_1}$ shrinks to zero as $M_1 \\to M_2$; then the chain is monatomic with half the period, and its single branch, folded back, is all that remains. A one-atom basis has no optical branch.',
      trap: 'In the boundary modes one kind of atom stays at rest: the heavy atoms set the acoustic, the light the optical frequency.' },
    { id: 'ph-012', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'branches',
      q: 'Cubic perovskite SrTiO$_3$ has five atoms in its primitive cell. The number of optical phonon branches is ______.',
      answer: 12, tol: 0, calc: () => 3 * 5 - 3,
      sol: '$3p = 15$ branches in all. Three are acoustic (frequency $\\to 0$ as $k \\to 0$: the whole crystal translating). The other $15 - 3 = 12$ are optical.',
      trap: 'Answering 15 (all branches) or 10 ($2p$).' },
    { id: 'ph-013', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'crystal momentum',
      q: 'A phonon of wave vector $\\vec q$ in a crystal',
      options: ['carries crystal momentum $\\hbar\\vec q$, defined only up to $\\hbar\\vec G$', 'carries real momentum $\\hbar\\vec q$ that moves the crystal\'s centre of mass', 'has no momentum of any kind', 'has momentum $\\hbar\\omega/c$'], answer: 0,
      sol: 'Atom displacements $u_n \\propto e^{i\\vec q\\cdot\\vec R_n}$ are unchanged by $\\vec q \\to \\vec q + \\vec G$, so $\\vec q$ is fixed only modulo $\\vec G$. $\\hbar\\vec q$ behaves like a momentum in collisions (with neutrons, electrons, photons, other phonons) but is conserved only up to $\\hbar\\vec G$. Except for $\\vec q = 0$, a phonon carries no physical momentum: the atoms just oscillate about fixed sites.',
      trap: '$\\hbar\\omega/c$ is the momentum of a photon of the same frequency, irrelevant here.' },
    { id: 'ph-014', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'Umklapp',
      q: 'In an Umklapp (U) process between phonons,',
      options: ['the total crystal momentum is exactly conserved and heat flow is unaffected', 'the wave vectors satisfy $\\vec q_1 + \\vec q_2 = \\vec q_3 + \\vec G$ with $\\vec G \\ne 0$, which degrades the heat current', 'a phonon is absorbed by an electron', 'the number of phonons stays fixed'], answer: 1,
      sol: 'When $\\vec q_1 + \\vec q_2$ falls outside the first zone, it is brought back by a reciprocal vector: $\\vec q_3 = \\vec q_1 + \\vec q_2 - \\vec G$. The new phonon may travel roughly backwards, so the net phonon flow is reversed: U processes give an insulator its finite thermal resistance. Normal processes ($\\vec G = 0$) conserve the total phonon momentum and alone cannot relax a heat current.',
      trap: 'Normal processes redistribute energy among phonons but cannot by themselves stop a heat current.' },
    { id: 'ph-015', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'group velocity',
      q: 'On a monatomic chain with sound speed $v_s$, the group velocity at $k = \\pi/(2a)$ (half way to the zone edge) is',
      options: ['$v_s$', '$v_s/2$', '$0$', '$v_s/\\sqrt2$'], answer: 3,
      sol: '$v_g = a\\sqrt{K/m}\\cos(ka/2) = v_s\\cos(\\pi/4) = v_s/\\sqrt2 = 0.707v_s$.',
      trap: 'Assuming the velocity falls linearly to zero at the zone edge ($v_s/2$).' },
    { id: 'ph-016', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'neutron scattering', format: 'multi',
      q: 'Which statements about measuring phonon dispersion are correct?',
      options: ['Inelastic neutron scattering uses conservation of energy and of crystal momentum.', 'Thermal neutrons have energies (tens of meV) comparable to phonon energies.', 'For 1 Å X-rays (about 12 keV) a phonon changes the photon energy by only about one part in $10^6$.', 'Raman scattering of visible light probes phonons across the whole Brillouin zone.'], answer: [0, 1, 2],
      sol: 'Neutron: $E_i - E_f = \\pm\\hbar\\omega$ and $\\vec k_i - \\vec k_f = \\vec q + \\vec G$; measuring both gives $\\omega(\\vec q)$ point by point. A 25 meV neutron changes its energy by a large fraction when it makes a 10 meV phonon; a 12 keV photon changes by $10^{-6}$, which needs special meV-resolution instruments. Visible photons have $k \\sim 10^{-3}$ of a zone, so Raman sees only $q \\approx 0$ optical phonons.',
      trap: 'Light can only give a small $q$; whole-zone dispersion needs neutrons (or inelastic X-rays).' },
    { id: 'ph-017', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'Brillouin zone',
      q: 'On a monatomic chain with spacing $a$, a wave with $k = 0.4\\pi/a$ and one with $k = 2.4\\pi/a$ describe',
      options: ['exactly the same atomic displacements', 'waves of different frequency', 'waves moving in opposite directions with the same speed', 'a mode and its optical partner'], answer: 0,
      sol: 'The displacements are $u_n \\propto e^{ikna}$. The two $k$ values differ by $2\\pi/a$, and $e^{i(2\\pi/a)na} = e^{2\\pi in} = 1$. The atoms (the only things that exist) move identically; the shorter wave just wiggles between atoms where there is nothing. So $k$ can always be taken in the first zone.',
      trap: 'A continuous string would distinguish them; a lattice cannot.' },
    { id: 'ph-039', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Raman scattering', unit: 'meV',
      q: 'The optical phonon of silicon at $k \\approx 0$ gives a Raman shift of $520$ cm$^{-1}$. Its energy is ______ meV (to one decimal place).',
      answer: 64.5, tol: 0.1, calc: () => 520 * 100 * C.h * C.c / C.e * 1000,
      sol: '$E = hc\\tilde\\nu$; $1$ cm$^{-1}$ corresponds to $0.12398$ meV. $520\\times0.12398 = 64.5$ meV (frequency $15.6$ THz). The shift of the scattered light equals the phonon energy created (Stokes) or absorbed (anti-Stokes).',
      trap: 'Forgetting to convert cm$^{-1}$ to m$^{-1}$ (a factor of 100).' },
    { id: 'ph-046', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'boundary conditions',
      q: 'A chain of $N$ atoms (spacing $a$) with periodic (Born-von Kármán) boundary conditions has allowed wave vectors spaced by',
      options: ['$\\pi/a$', '$2\\pi/(Na)$', '$\\pi/(Na)$', '$2\\pi/a$'], answer: 1,
      sol: 'Periodicity $u_{n+N} = u_n$ requires $e^{ikNa} = 1$, so $k = 2\\pi j/(Na)$ with $j$ an integer. Taking $N$ consecutive values (one zone of width $2\\pi/a$) gives exactly $N$ distinct modes, one per atom.',
      trap: '$\\pi/(Na)$ is the spacing for fixed ends (standing waves with $k > 0$ only); the count of modes is the same.' },
    { id: 'ph-047', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'monatomic chain', format: 'multi',
      q: 'For a monatomic chain (mass $m$, spring $K$, spacing $a$), which statements are correct?',
      options: ['The highest frequency is $2\\sqrt{K/m}$.', '$\\omega(k)$ is periodic in $k$ with period $2\\pi/a$.', 'At $k = \\pi/a$ neighbouring atoms move in opposite directions.', 'The speed of sound does not depend on $a$.'], answer: [0, 1, 2],
      sol: '$\\omega = 2\\sqrt{K/m}|\\sin(ka/2)|$ peaks at $2\\sqrt{K/m}$ and repeats every $\\Delta k = 2\\pi/a$. At $ka = \\pi$, $u_{n+1}/u_n = e^{i\\pi} = -1$. The sound speed $v_s = a\\sqrt{K/m}$ is proportional to $a$ (for fixed $K$ and $m$).',
      trap: 'Statement 4 forgets that the sound speed is the slope $\\omega/k$ at small $k$, which brings in $a$.' },

    // ---------- level 3 ----------
    { id: 'ph-018', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'diatomic chain', unit: '10¹³ rad/s',
      q: 'A diatomic chain has atoms of 40 u and 20 u joined alternately by identical springs of $30$ N/m. The width of the frequency gap at the zone boundary is ______ $\\times10^{13}$ rad/s (to two decimal places). Use $1$ u $= 1.6605\\times10^{-27}$ kg.',
      answer: 1.25, tol: 0.01, calc: () => (Math.sqrt(60 / (20 * U)) - Math.sqrt(60 / (40 * U))) / 1e13,
      sol: 'At $ka = \\pi$: $\\omega_- = \\sqrt{2K/M_1} = \\sqrt{60/6.642\\times10^{-26}} = 3.006\\times10^{13}$ rad/s and $\\omega_+ = \\sqrt{2K/M_2} = \\sqrt{60/3.321\\times10^{-26}} = 4.251\\times10^{13}$ rad/s. Gap $= 1.25\\times10^{13}$ rad/s. No travelling wave exists at these frequencies; a wave sent in is damped.',
      trap: 'Using $K$ instead of $2K$ in the boundary frequencies.' },
    { id: 'ph-019', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'sound speed', unit: 'm/s',
      q: 'Neutron measurements on a crystal show that its longitudinal acoustic branch along a direction of atomic spacing $2.5$ Å follows $\\omega = \\omega_m|\\sin(ka/2)|$ with $\\omega_m = 4.0\\times10^{13}$ rad/s. The longitudinal sound speed in that direction is ______ m/s.',
      answer: 5000, tol: 5, calc: () => 4e13 * 2.5e-10 / 2,
      sol: 'For small $k$: $\\omega \\approx \\omega_m ka/2$, so $v_s = \\omega_m a/2 = 4.0\\times10^{13}\\times2.5\\times10^{-10}/2 = 5.0\\times10^3$ m/s.',
      trap: 'Forgetting the $1/2$ from $\\sin(ka/2) \\approx ka/2$.' },
    { id: 'ph-020', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'phase velocity',
      q: 'For a monatomic chain with sound speed $v_s$, the phase velocity at the zone boundary $k = \\pi/a$ is',
      options: ['$v_s$', '$0$', '$(\\pi/2)v_s$', '$(2/\\pi)v_s$'], answer: 3,
      sol: '$v_p = \\omega/k = 2\\sqrt{K/m}\\big/(\\pi/a) = (2/\\pi)\\,a\\sqrt{K/m} = (2/\\pi)v_s \\approx 0.64v_s$. The group velocity there is zero, but the phase velocity is not.',
      trap: 'Confusing phase and group velocity at the zone edge.' },
    { id: 'ph-021', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'density of states',
      q: 'A monatomic chain of $900$ atoms (periodic boundary conditions) has maximum frequency $\\omega_m$. The number of normal modes with $\\omega < \\omega_m/2$ is ______.',
      answer: 300, tol: 0, calc: () => 2 * 900 / PI * Math.asin(0.5),
      sol: 'Modes are evenly spaced in $k$ ($N$ of them in $-\\pi/a < k \\le \\pi/a$). $\\omega < \\omega_m/2$ means $|\\sin(ka/2)| < \\tfrac12$, i.e. $|k| < \\pi/(3a)$: one third of the zone. So $N/3 = 300$ modes. In general $N(\\omega) = (2N/\\pi)\\arcsin(\\omega/\\omega_m)$.',
      trap: 'Assuming modes are evenly spread in $\\omega$ (giving 450).' },
    { id: 'ph-022', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'density of states',
      q: 'The phonon density of states $g(\\omega)$ of a monatomic chain, near its maximum frequency $\\omega_m$,',
      options: ['falls smoothly to zero', 'is constant', 'diverges as $(\\omega_m - \\omega)^{-2}$', 'diverges as $(\\omega_m - \\omega)^{-1/2}$'], answer: 3,
      sol: '$g(\\omega) = \\dfrac{dN}{d\\omega} = \\dfrac{2N}{\\pi}\\,\\dfrac1{\\sqrt{\\omega_m^2 - \\omega^2}}$. Near $\\omega_m$, $\\omega_m^2 - \\omega^2 \\approx 2\\omega_m(\\omega_m - \\omega)$, giving $(\\omega_m - \\omega)^{-1/2}$. This van Hove singularity comes from the flat dispersion ($v_g = 0$) at the zone edge; in 3D such points give kinks rather than divergences.',
      trap: 'Expecting the density to vanish at the top of the band; it is largest there in 1D.' },
    { id: 'ph-023', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'LO-TO splitting',
      q: 'NaCl has static dielectric constant $\\varepsilon(0) = 5.9$ and high-frequency value $\\varepsilon(\\infty) = 2.25$. By the Lyddane-Sachs-Teller relation, $\\omega_{LO}/\\omega_{TO}$ at $k \\approx 0$ is ______ (to two decimal places).',
      answer: 1.62, tol: 0.01, calc: () => Math.sqrt(5.9 / 2.25),
      sol: 'LST: $\\dfrac{\\omega_{LO}^2}{\\omega_{TO}^2} = \\dfrac{\\varepsilon(0)}{\\varepsilon(\\infty)}$. $\\sqrt{5.9/2.25} = \\sqrt{2.622} = 1.62$. The longitudinal mode is stiffer because its oscillating polarisation makes a restoring electric field that the transverse mode lacks.',
      trap: 'Forgetting the square root.' },
    { id: 'ph-024', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'optical phonons', format: 'multi',
      q: 'Which statements about optical phonons near $k = 0$ are correct?',
      options: ['In an ionic crystal the TO phonon absorbs infrared light strongly.', 'In silicon (two identical atoms per cell) the optical phonon is Raman active but not infrared active.', 'The optical phonon frequency goes to zero at $k = 0$.', 'In a polar crystal the LO frequency is above the TO frequency.'], answer: [0, 1, 3],
      sol: 'Oppositely charged ions moving against each other form an oscillating dipole: IR absorption at $\\omega_{TO}$. In Si the two atoms are identical, so the vibration has no dipole (not IR active), but it modulates the polarisability (Raman active, 520 cm$^{-1}$). Optical branches have finite frequency at $k = 0$; it is the acoustic ones that vanish. In polar crystals the LO mode is pushed up by its macroscopic field.',
      trap: 'Thinking "optical" means "seen with light" in every crystal; the name comes from ionic crystals.' },
    { id: 'ph-025', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'neutron scattering', unit: 'THz',
      q: 'Neutrons of energy $30.0$ meV scatter from a crystal and come out with $22.0$ meV after creating one phonon. The frequency $\\nu$ of that phonon is ______ THz (to two decimal places).',
      answer: 1.93, tol: 0.01, calc: () => 8e-3 / HEV / 1e12,
      sol: 'Energy conservation: $\\hbar\\omega = 30.0 - 22.0 = 8.0$ meV. $\\nu = E/h = 8.0\\times10^{-3}/4.136\\times10^{-15} = 1.93\\times10^{12}$ Hz $= 1.93$ THz. (A useful rule: 1 THz $\\leftrightarrow$ 4.14 meV.)',
      trap: 'Dividing by $\\hbar$ gives the angular frequency $\\omega$, not $\\nu$.' },
    { id: 'ph-026', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Umklapp',
      q: 'On a 1D chain of spacing $a$, two phonons with $k_1 = 0.7\\pi/a$ and $k_2 = 0.6\\pi/a$ merge into one phonon. Its wave vector, reduced to the first zone, is',
      options: ['$1.3\\pi/a$', '$0.7\\pi/a$', '$-0.7\\pi/a$', '$0.1\\pi/a$'], answer: 2,
      sol: '$k_1 + k_2 = 1.3\\pi/a$ lies outside $(-\\pi/a, \\pi/a]$. Subtract $G = 2\\pi/a$: $k_3 = -0.7\\pi/a$. The new phonon travels the opposite way: an Umklapp process.',
      trap: 'Subtracting $\\pi/a$ instead of a reciprocal lattice vector $2\\pi/a$.' },
    { id: 'ph-027', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'second neighbours', unit: 'm/s',
      q: 'A monatomic chain (spacing $3.0$ Å, mass $4.0\\times10^{-26}$ kg) has nearest-neighbour springs $K_1 = 10$ N/m and second-neighbour springs $K_2 = 2.0$ N/m. Its sound speed is ______ m/s (to the nearest 10 m/s).',
      answer: 6360, tol: 10, calc: () => 3e-10 * Math.sqrt((10 + 4 * 2) / 4e-26),
      sol: 'With springs to the $p$th neighbours, $\\omega^2 = \\dfrac4m\\sum_p K_p\\sin^2(pka/2)$. For small $k$: $\\omega^2 \\approx \\dfrac{k^2a^2}{m}(K_1 + 4K_2)$, so $v_s = a\\sqrt{(K_1 + 4K_2)/m} = 3.0\\times10^{-10}\\sqrt{18/4.0\\times10^{-26}} = 6.36\\times10^3$ m/s.',
      trap: 'Adding $K_1 + K_2$: a second-neighbour spring is stretched twice as much, and so counts $2^2 = 4$ times.' },
    { id: 'ph-028', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'branches',
      q: 'In a 3D crystal with one atom per primitive cell, along a high-symmetry direction there are',
      options: ['one longitudinal and two transverse acoustic branches, the transverse ones usually lower', 'three longitudinal branches', 'one acoustic and two optical branches', 'two longitudinal and one transverse branch, the transverse one usually higher'], answer: 0,
      sol: 'Three branches, all acoustic. Along a symmetry direction one has displacements along $\\vec k$ (LA) and two perpendicular (TA, degenerate along 3- and 4-fold axes). Shear stiffness is usually smaller than compressional stiffness, so the TA branches lie below LA.',
      trap: 'A one-atom basis has no optical branches at all.' },
    { id: 'ph-029', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'statistics',
      q: 'The mean number of phonons in a mode of energy $\\hbar\\omega = 25.0$ meV at $T = 300$ K is ______ (to three decimal places). Use $k_B = 8.617\\times10^{-5}$ eV/K.',
      answer: 0.613, tol: 0.003, calc: () => 1 / (Math.exp(25 / (8.617e-2 * 300)) - 1),
      sol: '$k_BT = 25.85$ meV, $x = \\hbar\\omega/k_BT = 0.967$. $\\langle n\\rangle = 1/(e^{0.967} - 1) = 1/(2.630 - 1) = 0.613$.',
      trap: 'Using the Boltzmann factor $e^{-x} = 0.380$, valid only when $x \\gg 1$.' },
    { id: 'ph-030', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'anharmonicity', format: 'multi',
      q: 'Which statements about anharmonic effects in crystals are correct?',
      options: ['A perfectly harmonic crystal would show no thermal expansion.', 'Phonon-phonon scattering exists only because of anharmonic terms in the potential.', 'Above the Debye temperature, the thermal conductivity of an insulator rises as $T$ increases.', 'Anharmonicity makes the heat capacity of a classical crystal exactly zero.'], answer: [0, 1],
      sol: 'In a harmonic potential the mean position of an oscillator does not depend on its amplitude, so heating changes nothing in the size; expansion needs the asymmetric (cubic) terms. Harmonic normal modes are exactly independent, so they never exchange energy: scattering needs anharmonicity. At high $T$ the phonon number grows as $T$, so U-scattering grows and $\\kappa \\propto 1/T$ falls. Anharmonicity only slightly modifies Dulong-Petit.',
      trap: 'Heat capacity is roughly constant at high $T$, but the conductivity still falls, through the mean free path.' },
    { id: 'ph-042', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'branches', format: 'multi',
      q: 'A 3D crystal has $N$ primitive cells with $p$ atoms in each. Which statements are correct?',
      options: ['There are $3pN$ normal modes in total.', 'Exactly 3 branches have $\\omega \\to 0$ as $k \\to 0$.', 'A crystal with a one-atom basis has 3 optical branches.', 'Every optical branch absorbs infrared light.'], answer: [0, 1],
      sol: '$3pN$ degrees of freedom give $3pN$ modes: $3p$ branches with $N$ wave vectors each. Uniform translation in 3 directions gives the 3 acoustic branches. With $p = 1$ there are $3p - 3 = 0$ optical branches. IR activity needs an oscillating dipole: not all optical modes have one (e.g. Si).',
      trap: 'Optical branches exist only when there is more than one atom per primitive cell.' },

    // ---------- level 4 ----------
    { id: 'ph-031', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'diatomic chain', unit: 'm/s',
      q: 'A 1D model of NaCl has alternating Na (22.99 u) and Cl (35.45 u) joined by identical springs of $25$ N/m; the repeat distance (one Na plus one Cl) is $5.6$ Å. The sound speed of the acoustic branch is ______ m/s (to the nearest 10 m/s). Use $1$ u $= 1.6605\\times10^{-27}$ kg.',
      answer: 6360, tol: 10, calc: () => 5.6e-10 * Math.sqrt(25 / (2 * (22.99 + 35.45) * U)),
      sol: 'For small $k$ the acoustic root is $\\omega^2 \\approx \\dfrac{K(ka)^2}{2(M_1 + M_2)}$, so $v_s = a\\sqrt{\\dfrac{K}{2(M_1 + M_2)}}$ with $a$ the repeat distance. $M_1 + M_2 = 58.44$ u $= 9.704\\times10^{-26}$ kg; $\\sqrt{25/1.941\\times10^{-25}} = 1.135\\times10^{13}$ s$^{-1}$; $v_s = 5.6\\times10^{-10}\\times1.135\\times10^{13} = 6.36\\times10^3$ m/s. (Check: equal masses $m$ give $\\tfrac a2\\sqrt{K/m}$, the monatomic result with spacing $a/2$.)',
      trap: 'Using the reduced mass, which belongs to the optical frequency at $k = 0$.' },
    { id: 'ph-032', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'diatomic chain',
      q: 'In a diatomic chain with $M_1 = 2M_2$ and equal springs, the ratio of the optical frequency at $k = 0$ to the optical frequency at the zone boundary is',
      options: ['$\\sqrt{1.5}$', '$\\sqrt2$', '$1.5$', '$2$'], answer: 0,
      sol: '$\\omega_+(0)^2 = 2K(1/M_1 + 1/M_2)$ and $\\omega_+(\\pi/a)^2 = 2K/M_2$. Ratio of squares $= 1 + M_2/M_1 = 1.5$, so the ratio is $\\sqrt{1.5} = 1.22$. The heavier $M_1$, the flatter the optical branch.',
      trap: 'Forgetting to take the square root of the ratio of $\\omega^2$.' },
    { id: 'ph-033', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'diatomic chain',
      q: 'In a diatomic chain, let the mass $M_1$ become very large while $M_2$ and $K$ stay fixed. Then',
      options: ['both branches become identical', 'the optical branch flattens to the constant $\\sqrt{2K/M_2}$ and the acoustic frequencies fall towards zero', 'the gap closes', 'the optical frequency at $k = 0$ goes to infinity'], answer: 1,
      sol: 'With $1/M_1 \\to 0$: $\\omega_+^2 \\to 2K/M_2$ for every $k$ (each light atom vibrates between two fixed heavy neighbours, an Einstein oscillator), and $\\omega_-^2 \\to 2K\\sin^2(ka/2)/M_1 \\to 0$. A flat optical band is why Einstein\'s single-frequency model fits optical phonons reasonably.',
      trap: 'The gap actually widens to its largest value in this limit.' },
    { id: 'ph-034', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'LO-TO splitting', unit: '10¹³ rad/s',
      q: 'For KBr, $\\omega_{TO} = 2.10\\times10^{13}$ rad/s, $\\varepsilon(0) = 4.90$ and $\\varepsilon(\\infty) = 2.33$. Between $\\omega_{TO}$ and $\\omega_{LO}$ the crystal reflects infrared almost totally (the reststrahlen band). The width $\\omega_{LO} - \\omega_{TO}$ is ______ $\\times10^{13}$ rad/s (to two decimal places).',
      answer: 0.95, tol: 0.01, calc: () => 2.1 * (Math.sqrt(4.9 / 2.33) - 1),
      sol: 'LST: $\\omega_{LO} = \\omega_{TO}\\sqrt{\\varepsilon(0)/\\varepsilon(\\infty)} = 2.10\\times\\sqrt{2.103} = 2.10\\times1.450 = 3.05$ (in $10^{13}$ rad/s). Width $= 3.05 - 2.10 = 0.95$. Inside the band $\\varepsilon(\\omega) < 0$, so no wave can enter and the light is reflected.',
      trap: 'Using $\\varepsilon(0)/\\varepsilon(\\infty)$ without the square root gives a width of 2.32.' },
    { id: 'ph-035', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'statistics', format: 'multi',
      q: 'Which statements about the phonon gas in a crystal are correct?',
      options: ['The number of phonons is not conserved.', 'The phonon chemical potential is zero in equilibrium.', 'Phonons transfer real momentum $\\hbar\\vec q$ to the crystal as a whole.', 'At low temperature in 3D the total number of phonons grows as $T^3$.'], answer: [0, 1, 3],
      sol: 'Phonons are created and destroyed freely, so $\\mu = 0$. At low $T$ only acoustic modes with $\\hbar\\omega \\lesssim k_BT$ are excited; their number in 3D scales as $\\int\\omega^2/(e^{\\hbar\\omega/k_BT} - 1)d\\omega \\propto T^3$. Their $\\hbar\\vec q$ is crystal momentum, not physical momentum of the crystal.',
      trap: 'The energy goes as $T^4$ and the number as $T^3$; do not mix them.' },
    { id: 'ph-036', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'neutron scattering', unit: 'Å',
      q: 'A neutron of wavelength $2.000$ Å creates a phonon of energy $5.00$ meV in a crystal. The wavelength of the scattered neutron is ______ Å (to three decimal places). Use $E(\\text{meV}) = 81.81/\\lambda^2(\\text{Å})$ for neutrons.',
      answer: 2.301, tol: 0.003, calc: () => Math.sqrt(81.81 / (81.81 / 4 - 5)),
      sol: '$E_i = 81.81/4.000 = 20.45$ meV. After creating the phonon, $E_f = 15.45$ meV. $\\lambda_f = \\sqrt{81.81/15.45} = \\sqrt{5.295} = 2.301$ Å. The neutron has slowed down, so its wavelength has grown.',
      trap: 'Subtracting 5 meV from the incident energy and then forgetting the square root.' },
    { id: 'ph-037', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'soft modes',
      q: 'In a displacive ferroelectric such as BaTiO$_3$ or PbTiO$_3$, as the temperature approaches the transition $T_c$ from above, the frequency of one transverse optical phonon at $k \\approx 0$',
      options: ['rises steeply', 'stays constant', 'falls towards zero (a soft mode), and by LST the static dielectric constant grows very large', 'becomes imaginary at all temperatures'], answer: 2,
      sol: 'The restoring force for the polar displacement weakens on cooling; $\\omega_{TO}^2 \\propto (T - T_c)$. When it reaches zero the ions shift permanently and a spontaneous polarisation appears. Since $\\varepsilon(0) = \\varepsilon(\\infty)\\omega_{LO}^2/\\omega_{TO}^2$, the dielectric constant diverges as $1/(T - T_c)$: the Curie-Weiss law.',
      trap: 'Thinking the mode must stiffen near an instability; it softens.' },
    { id: 'ph-038', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'group velocity',
      q: 'On a monatomic chain, at what frequency (as a fraction of the maximum frequency $\\omega_m$) does the group velocity equal half the sound speed? Answer ______ (to three decimal places).',
      answer: 0.866, tol: 0.002, calc: () => Math.sin(PI / 3),
      sol: '$v_g = v_s\\cos(ka/2) = v_s/2$ gives $ka/2 = \\pi/3$. Then $\\omega = \\omega_m\\sin(\\pi/3) = 0.866\\omega_m$.',
      trap: 'Stopping at $ka/2 = \\pi/3$ and reporting $k$ instead of $\\omega$.' },
    { id: 'ph-048', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'LO-TO splitting', format: 'multi',
      q: 'Which statements about long-wavelength optical phonons in crystals are correct?',
      options: ['In a polar crystal, $\\omega_{LO} > \\omega_{TO}$ at $k \\approx 0$.', '$\\omega_{LO}^2/\\omega_{TO}^2 = \\varepsilon(0)/\\varepsilon(\\infty)$.', 'Between $\\omega_{TO}$ and $\\omega_{LO}$ the dielectric function is negative and the reflectivity is high.', 'In silicon the LO and TO frequencies at $k = 0$ differ by a large amount.'], answer: [0, 1, 2],
      sol: 'The LO mode carries a macroscopic field that adds to the restoring force, raising its frequency; the LST relation quantifies it. $\\varepsilon(\\omega) = \\varepsilon(\\infty)(\\omega_{LO}^2 - \\omega^2)/(\\omega_{TO}^2 - \\omega^2)$ is negative between the two, so light is reflected. In non-polar Si there is no such field: LO and TO are degenerate at $k = 0$.',
      trap: 'LO-TO splitting requires ionic charges; covalent Si has none.' },

    // ---------- level 5 ----------
    { id: 'ph-040', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'alternating springs',
      q: 'A chain of identical atoms of mass $m$ is joined by springs that alternate between $K_1$ and $K_2$ ($K_1 > K_2$); the repeat distance is $a$. At the zone boundary $k = \\pi/a$ the two branch frequencies are',
      options: ['$\\sqrt{2K_1/m}$ and $\\sqrt{2K_2/m}$', '$\\sqrt{(K_1 + K_2)/m}$ (both equal)', '$0$ and $\\sqrt{2(K_1 + K_2)/m}$', '$\\sqrt{K_1/m}$ and $\\sqrt{K_2/m}$'], answer: 0,
      sol: 'The equations give $\\omega^2 = \\dfrac{K_1 + K_2}{m} \\pm \\dfrac1m\\sqrt{K_1^2 + K_2^2 + 2K_1K_2\\cos ka}$. At $ka = \\pi$ the root is $|K_1 - K_2|$, so $\\omega^2 = 2K_1/m$ or $2K_2/m$. A gap opens even with equal masses: any doubling of the period does it. The third option is the $k = 0$ pair.',
      trap: 'Thinking only unequal masses can open a gap.' },
    { id: 'ph-041', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'diatomic chain', unit: '10¹³ rad/s',
      q: 'A diatomic chain has $M_1 = 3.0\\times10^{-26}$ kg, $M_2 = 1.0\\times10^{-26}$ kg and equal springs $K = 20$ N/m, repeat distance $a$. The acoustic-branch frequency at $k = \\pi/(2a)$ is ______ $\\times10^{13}$ rad/s (to two decimal places).',
      answer: 2.36, tol: 0.01, calc: () => diat(20, 3e-26, 1e-26, PI / 2, -1) / 1e13,
      sol: '$\\omega^2 = K\\left[s \\mp \\sqrt{s^2 - \\dfrac{4\\sin^2(ka/2)}{M_1M_2}}\\right]$ with $s = 1/M_1 + 1/M_2 = 1.333\\times10^{26}$ kg$^{-1}$. At $ka = \\pi/2$, $\\sin^2(ka/2) = 0.5$: $4\\times0.5/(3\\times10^{-52}) = 6.667\\times10^{51}$. $s^2 = 1.778\\times10^{52}$, root $= \\sqrt{1.111\\times10^{52}} = 1.054\\times10^{26}$. Acoustic: $\\omega^2 = 20\\times(1.333 - 1.054)\\times10^{26} = 5.58\\times10^{26}$, $\\omega = 2.36\\times10^{13}$ rad/s.',
      trap: 'Taking the plus sign (optical branch, $5.73\\times10^{13}$ rad/s).' },
    { id: 'ph-043', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'thermal conductivity', unit: 'nm',
      q: 'An insulating crystal at room temperature has lattice heat capacity $1.70\\times10^6$ J m$^{-3}$ K$^{-1}$, average sound speed $5000$ m/s and thermal conductivity $150$ W m$^{-1}$ K$^{-1}$. Using kinetic theory, the phonon mean free path is ______ nm (to one decimal place).',
      answer: 52.9, tol: 0.3, calc: () => 3 * 150 / (1.7e6 * 5000) * 1e9,
      sol: '$\\kappa = \\tfrac13Cv\\ell$, so $\\ell = 3\\kappa/(Cv) = 450/(8.5\\times10^9) = 5.29\\times10^{-8}$ m $= 52.9$ nm, about 200 lattice spacings. At low $T$ this grows until it is limited by the sample size.',
      trap: 'Leaving out the factor 3 gives 17.6 nm.' },
    { id: 'ph-044', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'thermal conductivity',
      q: 'As a pure insulating crystal is cooled well below its Debye temperature $\\theta_D$, its thermal conductivity first rises steeply. The main reason is that',
      options: ['the heat capacity rises as $T$ falls', 'the sound speed rises sharply', 'Umklapp processes need phonons with $q$ of order half a reciprocal vector, whose number falls as $e^{-\\theta_D/bT}$', 'normal phonon processes become more frequent'], answer: 2,
      sol: 'For $\\vec q_1 + \\vec q_2$ to leave the zone, the phonons must have wave vectors of order $G/2$, i.e. energies of order $k_B\\theta_D/2$. Their population falls exponentially at low $T$, so the U-limited mean free path grows exponentially and so does $\\kappa$, until $\\ell$ reaches the crystal size; below that $\\kappa \\propto C \\propto T^3$ falls again.',
      trap: 'The heat capacity falls (as $T^3$) on cooling; the rise in $\\kappa$ comes from the mean free path.' },
    { id: 'ph-045', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'alternating springs',
      q: 'A chain of identical masses $m$ has springs alternating between $K_1 = 2K$ and $K_2 = K$. The width of the frequency gap at the zone boundary, in units of $\\sqrt{K/m}$, is ______ (to three decimal places).',
      answer: 0.586, tol: 0.002, calc: () => Math.sqrt(4) - Math.sqrt(2),
      sol: 'Boundary frequencies $\\sqrt{2K_1/m} = \\sqrt{4K/m} = 2\\sqrt{K/m}$ and $\\sqrt{2K_2/m} = \\sqrt2\\sqrt{K/m}$. Gap $= (2 - 1.414)\\sqrt{K/m} = 0.586\\sqrt{K/m}$.',
      trap: 'Taking the gap in $\\omega^2$ ($2K/m$) instead of in $\\omega$.' },
    ...more2,
    ...r4.items,
  ],

  gens: [
    { id: 'ph-g01', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'monatomic chain',
      make(r) {
        const M = pick(r, 10, 200, 1), K = pick(r, 5, 60, 1), f = choose(r, [0.1, 0.2, 0.25, 0.3, 0.4, 0.5, 0.6, 0.75, 0.8, 0.9, 1]);
        const w = 2 * Math.sqrt(K / (M * U)) * Math.sin(f * PI / 2), nu = w / (2 * PI) / 1e12;
        return { q: `A monatomic chain has atoms of mass ${M} u joined by springs of $${K}$ N/m. A wave with $k = ${f}\\,\\pi/a$ has frequency $\\nu$ = ______ THz (to three decimal places).`,
          answer: round(nu, 3), tol: Math.max(0.002, round(nu * 0.003, 3)), unit: 'THz', M, K, f,
          sol: `$\\omega = 2\\sqrt{K/m}\\,|\\sin(ka/2)| = 2\\sqrt{${K}/(${M}\\times1.6605\\times10^{-27})}\\times\\sin(${round(f * 90, 2)}^\\circ) = ${round(w / 1e12, 4)}\\times10^{12}$ rad/s, so $\\nu = \\omega/2\\pi = ${round(nu, 3)}$ THz.`,
          trap: 'Using $\\sin(ka)$ instead of $\\sin(ka/2)$, or reporting $\\omega$ instead of $\\nu$.' };
      },
      verify: (p) => 2 * Math.sqrt(p.K / (p.M * U)) * Math.sin(p.f * Math.PI / 2) / (2 * Math.PI) / 1e12 },
    { id: 'ph-g02', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'group velocity',
      make(r) {
        const M = pick(r, 10, 200, 1), K = pick(r, 5, 60, 1), a = pick(r, 2.0, 5.0, 0.1), f = choose(r, [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9]);
        const vs = a * 1e-10 * Math.sqrt(K / (M * U)), vg = vs * Math.cos(f * PI / 2);
        return { q: `A monatomic chain (atoms of ${M} u, spacing $${a}$ Å, springs $${K}$ N/m) carries a wave with $k = ${f}\\,\\pi/a$. Its group velocity is ______ m/s (to the nearest whole number).`,
          answer: Math.round(vg), tol: Math.max(2, Math.round(vg * 0.003)), unit: 'm/s', M, K, a, f,
          sol: `$v_g = d\\omega/dk = a\\sqrt{K/m}\\cos(ka/2)$. $a\\sqrt{K/m} = ${round(vs, 1)}$ m/s and $\\cos(${round(f * 90, 2)}^\\circ) = ${round(Math.cos(f * PI / 2), 4)}$, so $v_g = ${Math.round(vg)}$ m/s.`,
          trap: 'Using the phase velocity $\\omega/k$, which is larger.' };
      },
      verify: (p) => p.a * 1e-10 * Math.sqrt(p.K / (p.M * U)) * Math.cos(p.f * Math.PI / 2) },
    { id: 'ph-g03', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'diatomic chain',
      make(r) {
        const M1 = pick(r, 20, 140, 1), M2 = pick(r, 6, 60, 1), K = pick(r, 10, 80, 1);
        const w = Math.sqrt(2 * K * (1 / (M1 * U) + 1 / (M2 * U))), nu = w / (2 * PI) / 1e12;
        return { q: `A diatomic chain has atoms of ${M1} u and ${M2} u joined alternately by identical springs of $${K}$ N/m. The frequency $\\nu$ of the optical branch at $k = 0$ is ______ THz (to three decimal places).`,
          answer: round(nu, 3), tol: Math.max(0.002, round(nu * 0.003, 3)), unit: 'THz', M1, M2, K,
          sol: `$\\omega^2 = 2K\\left(\\dfrac1{M_1} + \\dfrac1{M_2}\\right) = 2K/\\mu$ with reduced mass $\\mu = ${round(M1 * M2 / (M1 + M2), 3)}$ u. $\\omega = ${round(w / 1e12, 4)}\\times10^{12}$ rad/s, $\\nu = ${round(nu, 3)}$ THz.`,
          trap: 'Using $K$ instead of $2K$ (each atom has two springs).' };
      },
      verify: (p) => Math.sqrt(2 * p.K * (1 / (p.M1 * U) + 1 / (p.M2 * U))) / (2 * Math.PI) / 1e12 },
    { id: 'ph-g04', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'diatomic chain',
      make(r) {
        const M2 = pick(r, 6, 60, 1), M1 = M2 + pick(r, 5, 100, 1), K = pick(r, 10, 80, 1);
        const lo = Math.sqrt(2 * K / (M1 * U)), hi = Math.sqrt(2 * K / (M2 * U)), gap = (hi - lo) / (2 * PI) / 1e12;
        return { q: `A diatomic chain has atoms of ${M1} u and ${M2} u joined alternately by identical springs of $${K}$ N/m. The width of the frequency gap at the zone boundary, $\\Delta\\nu$, is ______ THz (to three decimal places).`,
          answer: round(gap, 3), tol: Math.max(0.002, round(gap * 0.004, 3)), unit: 'THz', M1, M2, K,
          sol: `At $ka = \\pi$: acoustic $\\omega = \\sqrt{2K/M_1} = ${round(lo / 1e12, 4)}\\times10^{12}$ rad/s (heavy atoms move), optical $\\omega = \\sqrt{2K/M_2} = ${round(hi / 1e12, 4)}\\times10^{12}$ rad/s (light atoms move). $\\Delta\\nu = \\Delta\\omega/2\\pi = ${round(gap, 3)}$ THz.`,
          trap: 'Swapping which mass goes with which branch makes the gap negative.' };
      },
      verify: (p) => (Math.sqrt(2 * p.K / (p.M2 * U)) - Math.sqrt(2 * p.K / (p.M1 * U))) / (2 * Math.PI) / 1e12 },
    { id: 'ph-g05', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'branches',
      make(r) {
        const [name, p] = choose(r, STRUCTS), ask = choose(r, ['optical', 'total', 'optical', 'acoustic-total']);
        const val = ask === 'optical' ? 3 * p - 3 : ask === 'total' ? 3 * p : 3;
        const what = ask === 'optical' ? 'optical branches' : ask === 'total' ? 'phonon branches in all' : 'acoustic branches';
        const o = mcqOptions(r, val, [3 * p, 3 * p - 3, p, 2 * p, 3, 3 * p + 3, 0].filter((v) => v !== val));
        return { q: `How many ${what} does ${name} have? (It has ${p} atom${p > 1 ? 's' : ''} per primitive cell.)`, ...o,
          sol: `$3p = ${3 * p}$ branches in all: 3 acoustic (the crystal moving as a whole as $k \\to 0$) and $3p - 3 = ${3 * p - 3}$ optical. So the number of ${what} is ${val}.`,
          trap: 'Counting atoms per conventional cell instead of per primitive cell, or forgetting the 3 directions of motion.' };
      } },
    { id: 'ph-g06', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'sound speed',
      make(r) {
        const M = pick(r, 7, 200, 1), K = pick(r, 5, 80, 1), a = pick(r, 2.0, 5.0, 0.1), v = a * 1e-10 * Math.sqrt(K / (M * U));
        return { q: `A monatomic chain has atoms of ${M} u, spacing $${a}$ Å and springs of $${K}$ N/m. Its long-wavelength sound speed is ______ m/s (to the nearest whole number).`,
          answer: Math.round(v), tol: Math.max(2, Math.round(v * 0.003)), unit: 'm/s', M, K, a,
          sol: `$v_s = a\\sqrt{K/m} = ${a}\\times10^{-10}\\sqrt{${K}/(${M}\\times1.6605\\times10^{-27})} = ${Math.round(v)}$ m/s.`,
          trap: 'Forgetting to convert u to kg or Å to m.' };
      },
      verify: (p) => p.a * 1e-10 * Math.sqrt(p.K / (p.M * U)) },
    { id: 'ph-g07', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'neutron scattering',
      make(r) {
        const Ei = pick(r, 14, 80, 0.5), dE = pick(r, 2, Math.min(40, Ei - 4), 0.5), gain = r() < 0.3;
        const Ef = gain ? Ei + dE : Ei - dE, nu = dE * 1e-3 / HEV / 1e12;
        return { q: `Neutrons of energy $${Ei}$ meV scatter from a crystal and leave with $${round(Ef, 2)}$ meV, ${gain ? 'having absorbed' : 'having created'} one phonon. The phonon frequency $\\nu$ is ______ THz (to three decimal places).`,
          answer: round(nu, 3), tol: 0.003, unit: 'THz', dE,
          sol: `$\\hbar\\omega = |E_i - E_f| = ${dE}$ meV. $\\nu = E/h = ${dE}\\times10^{-3}\\text{ eV}/(4.1357\\times10^{-15}\\text{ eV s}) = ${round(nu, 3)}$ THz.${gain ? ' A neutron can only gain energy by absorbing a phonon that is already thermally excited.' : ''}`,
          trap: 'Dividing by $\\hbar$ instead of $h$ gives the angular frequency.' };
      },
      verify: (p) => p.dE * 1e-3 / HEV / 1e12 },
    { id: 'ph-g08', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Umklapp',
      make(r) {
        const k1 = pick(r, 0.3, 0.95, 0.05), k2 = pick(r, 0.3, 0.95, 0.05), s = choose(r, [1, 1, -1]);
        const sum = k1 + s * k2; let red = sum; if (red > 1) red -= 2; if (red <= -1) red += 2;
        return { q: `On a 1D chain of spacing $a$, a phonon with $k_1 = ${k1}\\,\\pi/a$ ${s > 0 ? `merges with a phonon of $k_2 = ${k2}\\,\\pi/a$` : `merges with a phonon of $k_2 = -${k2}\\,\\pi/a$`}. The wave vector of the resulting phonon, reduced to the first zone $(-\\pi/a, \\pi/a]$, is ______ (in units of $\\pi/a$, to two decimal places).`,
          answer: round(red, 2), tol: 0.005, sum,
          sol: `$k_1 + k_2 = ${round(sum, 2)}\\,\\pi/a$. ${Math.abs(sum) > 1 ? `This is outside the first zone, so subtract ${sum > 0 ? '' : '(minus) '}$G = 2\\pi/a$: $k_3 = ${round(red, 2)}\\,\\pi/a$ (an Umklapp process).` : `This is already inside the first zone: $k_3 = ${round(red, 2)}\\,\\pi/a$ (a normal process).`}`,
          trap: 'Folding back by $\\pi/a$ instead of by a reciprocal lattice vector $2\\pi/a$.' };
      },
      verify: (p) => { let x = p.sum; if (x > 1) x -= 2; if (x <= -1) x += 2; return x; } },
    { id: 'ph-g09', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'density of states',
      make(r) {
        const N = choose(r, [600, 800, 1000, 1200, 1500, 2000, 3000]), f = choose(r, [0.2, 0.3, 0.5, 0.6, 0.7, 0.8, 0.9, 0.95]), above = r() < 0.4;
        const below = 2 * N / PI * Math.asin(f), ans = above ? N - below : below;
        return { q: `A monatomic chain of $${N}$ atoms (periodic boundary conditions) has maximum frequency $\\omega_m$. The number of normal modes with $\\omega ${above ? '>' : '<'} ${f}\\,\\omega_m$ is ______ (to the nearest whole number).`,
          answer: Math.round(ans), tol: 1, N, f, above,
          sol: `Modes are evenly spaced in $k$. $\\omega < ${f}\\omega_m$ means $|ka/2| < \\arcsin(${f}) = ${round(Math.asin(f), 4)}$ rad, a fraction $\\tfrac2\\pi\\arcsin(${f}) = ${round(2 / PI * Math.asin(f), 4)}$ of the zone, i.e. ${round(below, 1)} modes.${above ? ` Above: $${N} - ${round(below, 1)} = ${round(ans, 1)}$.` : ''} The density piles up near $\\omega_m$, where the band is flat.`,
          trap: 'Assuming modes are spread evenly in frequency.' };
      },
      verify: (p) => { const b = 2 * p.N / Math.PI * Math.asin(p.f); return p.above ? p.N - b : b; } },
    { id: 'ph-g10', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'LO-TO splitting',
      make(r) {
        const c = choose(r, [['NaCl', 5.9, 2.25], ['KCl', 4.84, 2.19], ['LiF', 9.0, 1.92], ['MgO', 9.8, 2.95], ['GaAs', 12.9, 10.9], ['KBr', 4.9, 2.33], ['CsCl', 7.2, 2.6], ['ZnS', 8.3, 5.1]]);
        const wto = pick(r, 1.0, 8.0, 0.05), wlo = wto * Math.sqrt(c[1] / c[2]);
        return { q: `For ${c[0]}, take $\\varepsilon(0) = ${c[1]}$, $\\varepsilon(\\infty) = ${c[2]}$ and $\\omega_{TO} = ${wto}\\times10^{13}$ rad/s. By the Lyddane-Sachs-Teller relation, $\\omega_{LO}$ = ______ $\\times10^{13}$ rad/s (to two decimal places).`,
          answer: round(wlo, 2), tol: 0.01, unit: '10¹³ rad/s', wto, e0: c[1], ei: c[2],
          sol: `$\\omega_{LO} = \\omega_{TO}\\sqrt{\\varepsilon(0)/\\varepsilon(\\infty)} = ${wto}\\times\\sqrt{${round(c[1] / c[2], 4)}} = ${round(wlo, 2)}\\times10^{13}$ rad/s.`,
          trap: 'Inverting the ratio, or dropping the square root.' };
      },
      verify: (p) => p.wto * Math.sqrt(p.e0 / p.ei) },
    { id: 'ph-g11', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'phase velocity',
      make(r) {
        const f = choose(r, [0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9]), x = f * PI / 2, ratio = Math.tan(x) / x;
        return { q: `For a wave of $k = ${f}\\,\\pi/a$ on a monatomic chain, the ratio of phase velocity to group velocity, $v_p/v_g$, is ______ (to three decimal places).`,
          answer: round(ratio, 3), tol: 0.002, f,
          sol: `$v_p = \\omega/k = 2\\sqrt{K/m}\\sin(ka/2)/k$ and $v_g = a\\sqrt{K/m}\\cos(ka/2)$. Ratio $= \\dfrac{\\tan(ka/2)}{ka/2}$ with $ka/2 = ${round(x, 4)}$ rad: $${round(Math.tan(x), 4)}/${round(x, 4)} = ${round(ratio, 3)}$. It is 1 at small $k$ (no dispersion) and grows without limit at the zone edge.`,
          trap: 'Inverting the ratio (getting a number below 1).' };
      },
      verify: (p) => Math.tan(p.f * Math.PI / 2) / (p.f * Math.PI / 2) },
    { id: 'ph-g12', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'statistics',
      make(r) {
        const E = pick(r, 2, 80, 0.5), T = choose(r, [4, 10, 20, 50, 77, 100, 150, 200, 300, 400, 600, 1000]);
        const x = E / (KBMEV * T), n = 1 / Math.expm1(x);
        const ok = n > 1e-4;
        const EE = ok ? E : round(KBMEV * T * 3, 1), xx = EE / (KBMEV * T), nn = 1 / Math.expm1(xx);
        return { q: `The mean number of phonons in a mode of energy $${EE}$ meV at $T = ${T}$ K is ______ (to four decimal places).`,
          answer: round(nn, 4), tol: Math.max(0.0002, round(nn * 0.003, 4)), E: EE, T,
          sol: `$k_BT = ${round(KBMEV * T, 3)}$ meV, $x = \\hbar\\omega/k_BT = ${round(xx, 4)}$. $\\langle n\\rangle = 1/(e^{x} - 1) = ${round(nn, 4)}$.${xx < 0.3 ? ' At small $x$ this approaches $k_BT/\\hbar\\omega - \\tfrac12$ (classical equipartition).' : ''}`,
          trap: 'Using $1/(e^x + 1)$ (fermions) or the bare Boltzmann factor.' };
      },
      verify: (p) => 1 / Math.expm1(p.E / (KBMEV * p.T)) },
    ...more,
    ...r4.gens,
  ],
};
