// The classical ideal gas from the partition function: thermal wavelength, Sackur-Tetrode entropy, Gibbs paradox and
// mixing, chemical potential, validity (n lambda^3), generalised equipartition and the virial theorem, non-quadratic
// energies, gases in gravity and centrifuges, Langevin paramagnet, hard-sphere virial coefficient, trapped gases.
// Original questions for GATE and CSIR NET practice (fibub), MSc level. Kept apart from the JAM kinetic-theory topic.
import { pick, int, choose, mcqOptions, round, shuffle, C } from '../_util.js';

const kBe = 8.617333e-5; // eV/K
const lam = (mu, T) => C.h / Math.sqrt(2 * Math.PI * mu * C.u * C.kB * T); // thermal wavelength, m (mu in u)
const sig = (x, n = 3) => Number(x.toPrecision(n));
const langevin = (x) => 1 / Math.tanh(x) - 1 / x;
const GASES = [['helium', 4.0026], ['neon', 20.180], ['argon', 39.948], ['krypton', 83.798], ['xenon', 131.29]];

export default {
  topic: 'classical-gas-equipartition',
  items: [
    // ---- level 1 ----
    { id: 'cgeq-001', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'thermal wavelength',
      q: 'The thermal de Broglie wavelength of a particle of mass $m$ at temperature $T$ is',
      options: ['$h/\\sqrt{3mkT}$', '$h/mkT$', '$h/\\sqrt{2\\pi mkT}$', '$\\hbar/\\sqrt{mkT}$'], answer: 2,
      sol: '$\\lambda = h/\\sqrt{2\\pi mkT}$ is defined so that $Z_1 = V/\\lambda^3$ exactly for a free particle. It is of the order of the de Broglie wavelength of a typical thermal particle.' },
    { id: 'cgeq-002', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'partition function',
      q: 'The single-particle translational partition function of a free particle in a box of volume $V$ is',
      options: ['$V/\\lambda^3$', '$\\lambda^3/V$', '$V\\lambda^3$', '$(V/\\lambda)^3$'], answer: 0,
      sol: '$Z_1 = \\frac{1}{h^3}\\int d^3x\\,d^3p\\,e^{-p^2/2mkT} = \\frac{V}{h^3}(2\\pi mkT)^{3/2} = V/\\lambda^3$: the number of "thermal cells" of size $\\lambda^3$ in the box.' },
    { id: 'cgeq-003', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'validity',
      q: 'The classical (Maxwell-Boltzmann) treatment of an ideal gas of number density $n$ is valid when',
      options: ['$n\\lambda^3 \\gg 1$', '$n\\lambda^3 = 1$', '$n\\lambda \\ll 1$', '$n\\lambda^3 \\ll 1$'], answer: 3,
      sol: 'When the thermal wavelength is much smaller than the spacing $n^{-1/3}$, wave packets do not overlap and the chance of two particles wanting the same state is tiny. Then $Z_1^N/N!$ is accurate.' },
    { id: 'cgeq-004', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'Gibbs paradox',
      q: 'The factor $1/N!$ in $Z_N = Z_1^N/N!$ for an ideal gas is needed mainly to',
      options: ['make the energy extensive', 'make the entropy extensive and remove the Gibbs paradox', 'include the zero-point energy', 'account for collisions between molecules'], answer: 1,
      sol: 'Without it $S$ contains $Nk\\ln V$ instead of $Nk\\ln(V/N)$, so doubling the system does not double $S$, and mixing two samples of the same gas would seem to create entropy. The $N!$ reflects that identical particles cannot be labelled.' },
    { id: 'cgeq-005', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'equipartition',
      q: 'The generalised equipartition theorem states that, for canonical coordinates $x_i$ (any $q$ or $p$),',
      options: ['$\\langle x_i\\,\\partial H/\\partial x_j\\rangle = \\delta_{ij}kT$', '$\\langle x_i^2\\rangle = kT$', '$\\langle H\\rangle = kT$ per coordinate', '$\\langle \\partial H/\\partial x_i\\rangle = kT$'], answer: 0,
      sol: 'Integrating by parts in $\\int x_i(\\partial H/\\partial x_j)e^{-\\beta H}d\\Gamma$ gives $\\delta_{ij}kT$ (if the boundary term vanishes). For a quadratic term $ax^2$, $x\\,\\partial H/\\partial x = 2ax^2$, so $\\langle ax^2\\rangle = kT/2$.' },
    { id: 'cgeq-006', type: 'msq', level: 1, exams: ['gate', 'net'], sub: 'Sackur-Tetrode', format: 'multi',
      q: 'The Sackur-Tetrode entropy of a monatomic ideal gas, $S = Nk[\\ln(V/N\\lambda^3) + 5/2]$, has which features?',
      options: ['It contains Planck’s constant', 'It is extensive', 'It depends on the mass of the atoms', 'It stays positive down to $T = 0$'], answer: [0, 1, 2],
      sol: '$\\lambda = h/\\sqrt{2\\pi mkT}$ brings in $h$ and $m$. $V/N$ makes it extensive. As $T \\to 0$, $\\lambda^3$ grows and the log becomes very negative: the formula fails once $n\\lambda^3 \\sim 1$, where quantum statistics take over.' },

    // ---- level 2 ----
    { id: 'cgeq-007', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'thermal wavelength', unit: 'nm',
      q: 'The thermal wavelength of helium-4 atoms ($m = 4.0026$ u) at $300$ K is ______ nm.',
      answer: 0.0504, tol: 0.0005, calc: () => lam(4.0026, 300) * 1e9,
      sol: '$2\\pi mkT = 2\\pi\\times6.646\\times10^{-27}\\times4.142\\times10^{-21} = 1.730\\times10^{-46}$; square root $1.315\\times10^{-23}$. $\\lambda = 6.626\\times10^{-34}/1.315\\times10^{-23} = 5.04\\times10^{-11}$ m $= 0.0504$ nm, much smaller than an atomic spacing in the gas (about 3 nm).' },
    { id: 'cgeq-008', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'validity',
      q: 'For helium gas at $300$ K and $1$ atm, the degeneracy parameter $n\\lambda^3$ is ______ $\\times10^{-6}$.',
      answer: 3.13, tol: 0.04, calc: () => (101325 / (C.kB * 300)) * lam(4.0026, 300) ** 3 * 1e6,
      sol: '$n = P/kT = 101325/(1.381\\times10^{-23}\\times300) = 2.45\\times10^{25}$ m$^{-3}$; $\\lambda^3 = (5.04\\times10^{-11})^3 = 1.28\\times10^{-31}$ m$^3$. $n\\lambda^3 \\approx 3.13\\times10^{-6}$: deeply classical.' },
    { id: 'cgeq-009', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'equipartition',
      q: 'A classical ultra-relativistic particle has $H = c|\\mathbf p|$ in three dimensions. Its mean energy at temperature $T$ is',
      options: ['$\\tfrac32kT$', '$kT$', '$3kT$', '$\\tfrac12kT$'], answer: 2,
      sol: '$\\mathbf p\\cdot\\nabla_pH = c|\\mathbf p| = H$, and generalised equipartition gives $\\langle\\mathbf p\\cdot\\nabla_pH\\rangle = 3kT$. Directly: $\\langle E\\rangle = \\int p^3e^{-\\beta cp}dp/\\int p^2e^{-\\beta cp}dp = 3kT$.',
      trap: 'The $\\tfrac12kT$ rule is for quadratic terms only. A linear term gives $kT$ per component.' },
    { id: 'cgeq-010', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'equipartition',
      q: 'A classical particle in one dimension moves in the potential $V(x) = bx^4$. At temperature $T$ the mean potential energy is',
      options: ['$\\tfrac12kT$', '$\\tfrac14kT$', '$2kT$', '$kT$'], answer: 1,
      sol: '$\\langle x\\,V\'(x)\\rangle = kT$ with $xV\' = 4bx^4 = 4V$, so $\\langle V\\rangle = kT/4$. In general a term $\\propto|x|^s$ carries $kT/s$.' },
    { id: 'cgeq-011', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'chemical potential',
      q: 'The chemical potential of a classical monatomic ideal gas is',
      options: ['$\\mu = kT\\ln(n\\lambda^3)$', '$\\mu = -kT\\ln(n\\lambda^3)$', '$\\mu = \\tfrac32kT$', '$\\mu = kT\\,n\\lambda^3$'], answer: 0,
      sol: '$F = -NkT[\\ln(V/N\\lambda^3) + 1]$, so $\\mu = \\partial F/\\partial N = -kT\\ln(V/N\\lambda^3) = kT\\ln(n\\lambda^3)$. Classical gases have $n\\lambda^3 \\ll 1$, so $\\mu$ is large and negative.' },
    { id: 'cgeq-012', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'gravity',
      q: 'In an isothermal atmosphere of nitrogen ($m = 28.0$ u) at $300$ K, the number density at a height of $1000$ m, as a fraction of that at ground level, is ______. ($g = 9.8$ m/s$^2$)',
      answer: 0.896, tol: 0.003, calc: () => Math.exp(-28.0134 * C.u * 9.8 * 1000 / (C.kB * 300)),
      sol: 'The Boltzmann factor for potential energy $mgh$: $n(h)/n(0) = e^{-mgh/kT}$. $mgh = 4.652\\times10^{-26}\\times9.8\\times1000 = 4.559\\times10^{-22}$ J; $kT = 4.142\\times10^{-21}$ J. Ratio $= e^{-0.110} = 0.896$.' },
    { id: 'cgeq-013', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'mixing',
      q: 'Two different ideal gases, $N$ molecules each, at the same $T$ and $P$, are in equal volumes separated by a partition. The partition is removed. The entropy change is',
      options: ['$0$', '$Nk\\ln2$', '$\\tfrac12Nk\\ln2$', '$2Nk\\ln2$'], answer: 3,
      sol: 'Each gas doubles its volume: $\\Delta S = Nk\\ln2 + Nk\\ln2 = 2Nk\\ln2$. If the two gases were identical, $\\Delta S = 0$ (with the $1/N!$ in place), which resolves the Gibbs paradox.' },
    { id: 'cgeq-014', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'mixing', unit: 'J/K',
      q: 'One mole of helium and three moles of neon, at the same temperature and pressure, are allowed to mix. The entropy of mixing is ______ J/K.',
      answer: 18.70, tol: 0.15, calc: () => -C.R * (Math.log(0.25) + 3 * Math.log(0.75)),
      sol: '$\\Delta S = -R\\sum n_i\\ln x_i = -R[1\\ln\\tfrac14 + 3\\ln\\tfrac34] = R(1.386 + 0.863) = 8.314\\times2.249 = 18.70$ J/K.' },
    { id: 'cgeq-015', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'partition function',
      q: 'The classical partition function of a one-dimensional harmonic oscillator, $Z = \\frac1h\\int dx\\,dp\\,e^{-\\beta H}$, is',
      options: ['$\\hbar\\omega/kT$', '$kT/\\hbar\\omega$', '$2\\pi kT/\\omega$', '$\\sqrt{kT/\\hbar\\omega}$'], answer: 1,
      sol: 'Two Gaussian integrals: $\\sqrt{2\\pi mkT}\\sqrt{2\\pi kT/m\\omega^2} = 2\\pi kT/\\omega$; dividing by $h = 2\\pi\\hbar$ gives $kT/\\hbar\\omega$, the high-temperature limit of the quantum result.',
      trap: '$2\\pi kT/\\omega$ forgets the $1/h$ that makes $Z$ dimensionless.' },
    { id: 'cgeq-016', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'virial theorem',
      q: 'For a particle bound in a potential $V(r) \\propto r^n$, the classical virial theorem relates the time-averaged kinetic and potential energies by',
      options: ['$\\langle K\\rangle = \\langle V\\rangle$', '$2\\langle K\\rangle = -\\langle V\\rangle$ always', '$2\\langle K\\rangle = n\\langle V\\rangle$', '$\\langle K\\rangle = n\\langle V\\rangle$'], answer: 2,
      sol: '$2\\langle K\\rangle = \\langle\\mathbf r\\cdot\\nabla V\\rangle = n\\langle V\\rangle$ for a power law. Harmonic ($n = 2$): $K = V$ on average. Gravity or Coulomb ($n = -1$): $2K = -V$.' },
    { id: 'cgeq-017', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'equipartition',
      q: 'In the classical picture each atom of a crystal vibrates about its site in three dimensions. The molar heat capacity this predicts is',
      options: ['$\\tfrac32R$', '$3R$', '$6R$', '$\\tfrac52R$'], answer: 1,
      sol: 'Each atom has 3 kinetic and 3 potential quadratic terms: $6\\times\\tfrac12kT = 3kT$. Per mole $U = 3RT$, $C = 3R \\approx 25$ J mol$^{-1}$ K$^{-1}$ (Dulong-Petit). It fails at low $T$, where quantum effects freeze the vibrations.' },
    { id: 'cgeq-018', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'equipartition',
      q: 'A classical particle moves on a line with $H = p^2/2m + a x^4$. Its heat capacity in units of $k$ is ______.',
      answer: 0.75, tol: 0.001, calc: () => 0.5 + 0.25,
      sol: 'Kinetic term (quadratic): $\\tfrac12kT$. Quartic potential: $\\tfrac14kT$. $U = \\tfrac34kT$, so $C = \\tfrac34k$.' },

    // ---- level 3 ----
    { id: 'cgeq-019', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'centrifuge',
      q: 'A gas centrifuge of radius $5.0$ cm spins at $500$ revolutions per second. For UF$_6$ ($m = 352$ u) at $300$ K, the ratio of the number density at the wall to that on the axis is ______.',
      answer: 5.70, tol: 0.06, calc: () => Math.exp(352 * C.u * (2 * Math.PI * 500) ** 2 * 0.05 ** 2 / (2 * C.kB * 300)),
      sol: 'In the rotating frame the centrifugal potential is $-\\tfrac12m\\omega^2r^2$, so $n(r) \\propto e^{m\\omega^2r^2/2kT}$. $\\omega = 3142$ rad/s; $\\tfrac12m\\omega^2R^2 = \\tfrac12(5.845\\times10^{-25})(9.87\\times10^6)(0.0025) = 7.21\\times10^{-21}$ J $= 1.74\\,kT$. Ratio $e^{1.74} \\approx 5.70$. The heavier isotope piles up slightly more at the wall: the basis of enrichment.' },
    { id: 'cgeq-020', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Langevin',
      q: 'Classical magnetic moments of fixed size $\\mu$, free to point in any direction, are in a field $B$. With $x = \\mu B/kT$, the mean moment along the field is',
      options: ['$\\mu\\tanh x$', '$\\mu x/3$ exactly', '$\\mu(1 - e^{-x})$', '$\\mu(\\coth x - 1/x)$'], answer: 3,
      sol: '$Z_1 \\propto \\int_0^\\pi e^{x\\cos\\theta}\\sin\\theta\\,d\\theta = 2\\sinh x/x$. $\\langle\\mu\\cos\\theta\\rangle = \\mu\\,d\\ln Z_1/dx = \\mu(\\coth x - 1/x)$, the Langevin function. Small $x$: $\\mu x/3$.' },
    { id: 'cgeq-021', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Sackur-Tetrode', unit: 'J mol⁻¹ K⁻¹',
      q: 'Using the Sackur-Tetrode equation, the molar entropy of argon ($m = 39.95$ u) at $300$ K and $1.00$ bar is ______ J mol$^{-1}$ K$^{-1}$.',
      answer: 155.0, tol: 1.5, calc: () => C.R * (Math.log(C.kB * 300 / 1e5 / lam(39.948, 300) ** 3) + 2.5),
      sol: '$V/N = kT/P = 4.142\\times10^{-26}$ m$^3$. $\\lambda = h/\\sqrt{2\\pi mkT} = 1.595\\times10^{-11}$ m, $\\lambda^3 = 4.06\\times10^{-33}$ m$^3$. $\\ln(1.02\\times10^7) = 16.14$; $S/R = 16.14 + 2.5 = 18.64$, $S = 155$ J mol$^{-1}$ K$^{-1}$, matching calorimetric measurements: a striking check that $h$ belongs in classical entropy.' },
    { id: 'cgeq-022', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Gibbs paradox',
      q: 'Suppose the $1/N!$ is left out, so $S = Nk[\\ln(V/\\lambda^3) + 3/2]$. Two identical boxes, each with $N$ atoms of the same gas at the same $T$, are joined. This formula predicts an entropy change of',
      options: ['$0$', '$2Nk\\ln2$', '$Nk\\ln2$', '$-2Nk\\ln2$'], answer: 1,
      sol: 'After: $2Nk[\\ln(2V/\\lambda^3) + 3/2]$. Before: $2Nk[\\ln(V/\\lambda^3) + 3/2]$. Difference $2Nk\\ln2$, though nothing physical changed. With $V/N$ in the log the difference is zero.' },
    { id: 'cgeq-023', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'equipartition',
      q: 'A classical gas of particles moving in a plane has energy $H = c|\\mathbf p|$ (two-dimensional ultra-relativistic). The heat capacity per particle, in units of $k$, is ______.',
      answer: 2, tol: 0, calc: () => 2,
      sol: '$\\langle\\mathbf p\\cdot\\nabla_pH\\rangle = \\langle H\\rangle = 2kT$ (one $kT$ per momentum component, since $H$ is linear in $|p|$). $C = 2k$.' },
    { id: 'cgeq-024', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'equipartition',
      q: 'A classical particle moves on a line in the potential $V(x) = a|x|$. Its mean total energy is',
      options: ['$kT$', '$\\tfrac12kT$', '$\\tfrac32kT$', '$2kT$'], answer: 2,
      sol: 'Kinetic: $\\tfrac12kT$. Linear potential: $\\langle xV\'\\rangle = \\langle a|x|\\rangle = kT$. Total $\\tfrac32kT$.' },
    { id: 'cgeq-025', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'validity', format: 'statements',
      q: 'Which observations show classical equipartition failing?',
      options: ['The vibrational heat capacity of N$_2$ is almost zero at room temperature', 'The rotational heat capacity of H$_2$ falls towards zero below about 50 K', 'Conduction electrons in a metal add far less than $\\tfrac32k$ each to the heat capacity', 'The translational heat capacity of argon is $\\tfrac32R$ at room temperature'], answer: [0, 1, 2],
      sol: 'Equipartition fails when the level spacing exceeds $kT$: N$_2$ vibrations ($\\theta_v \\approx 3400$ K) and H$_2$ rotations ($\\theta_r = 85$ K) freeze out, and electrons obey Fermi statistics ($T_F \\sim 10^4$–$10^5$ K). Argon translation agrees with equipartition.' },
    { id: 'cgeq-026', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'equipartition',
      q: 'CO$_2$ is a linear triatomic molecule. If every mode were fully excited and classical, its $C_V/R$ would be ______.',
      answer: 6.5, tol: 0, calc: () => (3 + 2 + 2 * (3 * 3 - 5)) / 2,
      sol: '$3N = 9$ coordinates: 3 translations, 2 rotations (linear), $9 - 5 = 4$ vibrational modes. Quadratic terms: $3 + 2 + 2\\times4 = 13$, so $C_V = \\tfrac{13}{2}R = 6.5R$. Real CO$_2$ at room temperature is near $3.5R$ because most vibrations are frozen.' },
    { id: 'cgeq-027', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'gravity', unit: 'km',
      q: 'The scale height $kT/mg$ of an isothermal nitrogen atmosphere ($m = 28.0$ u) at $250$ K is ______ km. ($g = 9.8$ m/s$^2$)',
      answer: 7.57, tol: 0.08, calc: () => C.kB * 250 / (28.0134 * C.u * 9.8) / 1000,
      sol: '$H = kT/mg = 1.381\\times10^{-23}\\times250/(4.652\\times10^{-26}\\times9.8) = 7.57\\times10^3$ m. The density falls by $e$ every 7.6 km.' },
    { id: 'cgeq-028', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'gravity',
      q: 'A very tall, isothermal column of monatomic ideal gas in uniform gravity is heated slowly. The heat capacity per molecule of the whole column is',
      options: ['$\\tfrac32k$', '$\\tfrac52k$', '$k$', '$3k$'], answer: 1,
      sol: 'The heights follow $e^{-mgz/kT}$, so $\\langle mgz\\rangle = kT$. Total mean energy $\\tfrac32kT + kT = \\tfrac52kT$, so $C = \\tfrac52k$ per molecule: heating lifts the centre of mass.' },
    { id: 'cgeq-029', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'chemical potential', format: 'multi',
      q: 'For a classical ideal gas with $\\mu = kT\\ln(n\\lambda^3)$, which statements are correct?',
      options: ['$\\mu$ is negative in the classical regime', 'At fixed $T$, $\\mu$ rises as the density rises', 'At fixed $n$, $\\mu$ becomes more negative as $T$ rises', '$\\mu$ is independent of the particle mass'], answer: [0, 1, 2],
      sol: '$n\\lambda^3 \\ll 1$ makes the log negative. Raising $n$ raises $\\mu$ (particles flow from high to low $\\mu$, i.e. high to low density). Raising $T$ shrinks $\\lambda$, so $\\ln(n\\lambda^3)$ falls faster than $kT$ grows. The mass enters through $\\lambda$.' },
    { id: 'cgeq-030', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'virial coefficient', unit: 'cm³/mol',
      q: 'For hard spheres of diameter $0.30$ nm, the second virial coefficient $B_2 = \\tfrac23\\pi d^3N_A$ is ______ cm$^3$/mol.',
      answer: 34.1, tol: 0.4, calc: () => (2 / 3) * Math.PI * (0.3e-9) ** 3 * C.NA * 1e6,
      sol: '$B_2 = -\\tfrac12\\int(e^{-\\beta u} - 1)d^3r = \\tfrac12\\cdot\\tfrac43\\pi d^3$ per molecule (the excluded sphere has radius $d$). $\\tfrac23\\pi(0.30\\times10^{-9})^3 = 5.65\\times10^{-29}$ m$^3$; times $N_A$: $3.41\\times10^{-5}$ m$^3$/mol $= 34.1$ cm$^3$/mol. This is four times the volume of the spheres themselves.',
      trap: 'Using the radius $d/2$ as the radius of the excluded sphere gives a value 8 times too small.' },

    // ---- level 4 ----
    { id: 'cgeq-031', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'chemical potential', unit: 'eV',
      q: 'The chemical potential of helium gas at $300$ K and $1$ atm (take $n\\lambda^3 = 3.13\\times10^{-6}$) is ______ eV.',
      answer: -0.328, tol: 0.004, calc: () => kBe * 300 * Math.log(3.13e-6),
      sol: '$\\mu = kT\\ln(n\\lambda^3) = 0.02585\\times\\ln(3.13\\times10^{-6}) = 0.02585\\times(-12.67) = -0.328$ eV.' },
    { id: 'cgeq-032', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'virial theorem',
      q: 'For an ideal gas in a box, the only forces are from the walls. The virial theorem $2\\langle K\\rangle = -\\langle\\sum\\mathbf r_i\\cdot\\mathbf F_i\\rangle$ then gives',
      options: ['$PV = \\tfrac23\\langle K\\rangle$', '$PV = 2\\langle K\\rangle$', '$PV = \\tfrac13\\langle K\\rangle$', '$PV = \\langle K\\rangle$'], answer: 0,
      sol: 'The wall force on the gas is $-P\\,d\\mathbf A$, so $-\\langle\\sum\\mathbf r\\cdot\\mathbf F\\rangle = P\\oint\\mathbf r\\cdot d\\mathbf A = 3PV$. Then $2\\langle K\\rangle = 3PV$, $PV = \\tfrac23\\langle K\\rangle = NkT$. Interactions add an extra virial term that gives the virial expansion.' },
    { id: 'cgeq-033', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'relativistic gas',
      q: 'For a classical ideal gas of ultra-relativistic particles ($E = pc$), which pair of results is correct?',
      options: ['$PV = NkT$ and $U = \\tfrac32NkT$', '$PV = \\tfrac13NkT$ and $U = 3NkT$', '$PV = NkT$ and $U = 3NkT$', '$PV = 3NkT$ and $U = 3NkT$'], answer: 2,
      sol: '$Z_1 = V\\cdot4\\pi(kT/hc)^3\\cdot2$ is still proportional to $V$, so $P = NkT/V$ for any dispersion. The energy $U = 3NkT$, hence $P = U/3V$ (instead of $2U/3V$ for slow particles).',
      trap: 'The ideal gas law does not care about the dispersion relation; only $U$ does.' },
    { id: 'cgeq-034', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'Sackur-Tetrode', format: 'statements',
      q: 'For $N$ atoms of a monatomic ideal gas (Sackur-Tetrode), which entropy changes are correct?',
      options: ['Doubling $V$ at fixed $T$: $\\Delta S = Nk\\ln2$', 'Doubling $T$ at fixed $V$: $\\Delta S = \\tfrac32Nk\\ln2$', 'Doubling $T$ at fixed $P$: $\\Delta S = \\tfrac52Nk\\ln2$', 'Doubling $N$ and $V$ together at fixed $T$: $\\Delta S = 0$'], answer: [0, 1, 2],
      sol: '$S = Nk[\\ln V - \\ln N + \\tfrac32\\ln T + \\text{const}]$. $V$ doubles: $Nk\\ln2$. $T$ doubles at fixed $V$: $\\tfrac32Nk\\ln2$. At fixed $P$, $V \\propto T$ too: $\\tfrac52Nk\\ln2$. Doubling $N$ and $V$ doubles $S$ (extensive), so $\\Delta S = S \\ne 0$.' },
    { id: 'cgeq-035', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'Langevin',
      q: 'The Langevin function $L(x) = \\coth x - 1/x$ at $x = 2$ is ______.',
      answer: 0.537, tol: 0.003, calc: () => langevin(2),
      sol: '$\\coth2 = 1.0373$; $L(2) = 1.0373 - 0.5 = 0.537$. A classical moment at $\\mu B = 2kT$ is only 54% aligned on average, compared with $\\tanh2 = 96\\%$ for a two-state moment.' },
    { id: 'cgeq-036', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'Langevin',
      q: 'For a dilute gas of polar molecules with permanent dipole moment $p$, the orientational contribution to the polarisability per molecule at high temperature is',
      options: ['$p^2/kT$', '$p^2/3kT$', '$3p^2/kT$', '$p/3kT$'], answer: 1,
      sol: 'Langevin at small $x = pE/kT$: $\\langle p\\cos\\theta\\rangle = p\\,x/3 = p^2E/3kT$, so $\\alpha_{\\rm or} = p^2/3kT$ (the Debye term).' },
    { id: 'cgeq-037', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'equipartition',
      q: 'A particle moves in three dimensions with $H = c|\\mathbf p| + \\alpha r^2$. Its classical mean energy, in units of $kT$, is ______.',
      answer: 4.5, tol: 0.001, calc: () => 3 + 1.5,
      sol: 'Linear in $|p|$ over 3 components: $\\langle c|\\mathbf p|\\rangle = 3kT$. Quadratic in 3 coordinates: $\\langle\\alpha r^2\\rangle = \\tfrac32kT$. Total $4.5\\,kT$.' },
    { id: 'cgeq-038', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'rotor',
      q: 'A rigid planar rotor has $H = p_\\phi^2/2I$ with $0 \\le \\phi < 2\\pi$. Its classical partition function $\\frac1h\\int d\\phi\\,dp_\\phi\\,e^{-\\beta H}$ is',
      options: ['$2IkT/\\hbar^2$', '$\\sqrt{IkT}/\\hbar$', '$\\sqrt{2\\pi IkT}/\\hbar$', '$2\\pi IkT/h$'], answer: 2,
      sol: '$\\int_0^{2\\pi}d\\phi = 2\\pi$, $\\int e^{-p^2/2IkT}dp = \\sqrt{2\\pi IkT}$; divide by $h = 2\\pi\\hbar$: $Z = \\sqrt{2\\pi IkT}/\\hbar$. Then $U = \\tfrac12kT$, one quadratic term. ($2IkT/\\hbar^2$ is the 3D rotor of a diatomic.)' },

    // ---- level 5 ----
    { id: 'cgeq-039', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'trapped gas',
      q: 'A classical cloud of $10^6$ rubidium-87 atoms ($m = 86.91$ u) is held in an isotropic harmonic trap with $\\omega = 2\\pi\\times100$ s$^{-1}$ at $T = 1.0\\ \\mu$K. The peak phase-space density $n(0)\\lambda^3$ is ______.',
      answer: 0.110, tol: 0.003, calc: () => { const m = 86.909 * C.u, T = 1e-6, w = 2 * Math.PI * 100; return 1e6 * (m * w * w / (2 * Math.PI * C.kB * T)) ** 1.5 * lam(86.909, T) ** 3; },
      sol: 'The density follows the Boltzmann factor: $n(\\mathbf r) = n(0)e^{-m\\omega^2r^2/2kT}$, so $n(0) = N(m\\omega^2/2\\pi kT)^{3/2} = 10^6\\times(6.57\\times10^8)^{3/2} = 1.68\\times10^{19}$ m$^{-3}$. $\\lambda = h/\\sqrt{2\\pi mkT} = 1.87\\times10^{-7}$ m, $\\lambda^3 = 6.57\\times10^{-21}$ m$^3$. Product $\\approx 0.110$; a neat shortcut is $n(0)\\lambda^3 = N(\\hbar\\omega/kT)^3$. Cooling a few times further reaches 2.612 and Bose-Einstein condensation.' },
    { id: 'cgeq-040', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'virial theorem',
      q: 'A self-gravitating cloud of ideal gas (a star in equilibrium, $K$ = thermal kinetic energy, $V$ = gravitational energy) loses energy by radiation. Which is true?',
      options: ['It cools, since it loses energy', 'Its temperature stays fixed', 'Its total energy rises', 'It contracts and heats up: its heat capacity is negative'], answer: 3,
      sol: 'Virial with $n = -1$: $2K = -V$, so $E = K + V = -K$. Losing energy ($E$ more negative) means $K$ grows: the star heats as it contracts. $dE/dT < 0$, a negative heat capacity, possible because gravity is long-ranged.' },
    { id: 'cgeq-041', type: 'msq', level: 5, exams: ['gate', 'net'], sub: 'equipartition', format: 'statements',
      q: 'Which statements about the generalised equipartition theorem are correct?',
      options: ['A term $a|x|^s$ in $H$ contributes $kT/s$ to the mean energy', 'It requires $x\\,e^{-\\beta H} \\to 0$ at the edges of the range of $x$', 'It gives $\\langle\\mathbf r\\cdot\\nabla V\\rangle = 3kT$ for a particle in 3D, which is the virial theorem', 'It holds for quantum systems at any temperature'], answer: [0, 1, 2],
      sol: 'Integration by parts gives $\\langle x\\,\\partial H/\\partial x\\rangle = kT$ provided the boundary term vanishes; for $a|x|^s$ this is $s\\langle a|x|^s\\rangle = kT$. Summing over the three coordinates gives $\\langle\\mathbf r\\cdot\\nabla V\\rangle = 3kT = 2\\langle K\\rangle$. Quantum systems obey it only when $kT \\gg$ level spacing.' },
    { id: 'cgeq-042', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'centrifuge',
      q: 'In the centrifuge above (radius $5.0$ cm, $500$ rev/s, $300$ K), UF$_6$ made with $^{235}$U has $m = 349$ u and with $^{238}$U $m = 352$ u. The separation factor (abundance ratio $^{235}$U/$^{238}$U on the axis divided by that at the wall) is ______.',
      answer: 1.015, tol: 0.001, calc: () => Math.exp(3 * C.u * (2 * Math.PI * 500) ** 2 * 0.05 ** 2 / (2 * C.kB * 300)),
      sol: 'Each species has $n(R)/n(0) = e^{m\\omega^2R^2/2kT}$. The ratio of the two gives $e^{\\Delta m\\,\\omega^2R^2/2kT}$ with $\\Delta m = 3$ u: exponent $= 1.741\\times3/352 = 0.0148$, factor $1.015$. Many centrifuges in cascade are needed.' },
    { id: 'cgeq-043', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'thermal wavelength', format: 'multi',
      q: 'The thermal wavelength $\\lambda = h/\\sqrt{2\\pi mkT}$ of a gas particle',
      options: ['halves when the temperature is raised four times', 'is smaller for heavier particles at the same temperature', 'becomes comparable to the interparticle spacing as a dense gas is cooled', 'depends on the pressure of the gas'], answer: [0, 1, 2],
      sol: '$\\lambda \\propto (mT)^{-1/2}$: four times $T$ halves it, and heavier particles have shorter $\\lambda$. Cooling grows $\\lambda$ until $n\\lambda^3 \\sim 1$, where quantum statistics take over. $\\lambda$ itself does not involve $P$ or $n$.' },
    { id: 'cgeq-044', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'virial coefficient', format: 'statements',
      q: 'The second virial coefficient $B_2(T) = -2\\pi\\int_0^\\infty(e^{-u(r)/kT} - 1)r^2dr$ of a gas with a hard core and a weak attraction',
      options: ['is positive for pure hard spheres at every temperature', 'is negative at low temperature, where attraction dominates', 'vanishes at the Boyle temperature', 'is independent of temperature for any potential'], answer: [0, 1, 2],
      sol: 'Hard core alone: $B_2 = \\tfrac23\\pi d^3 > 0$, independent of $T$. The attractive well makes $e^{-u/kT} - 1 > 0$ there, a negative contribution that wins at low $T$. In between $B_2 = 0$ at the Boyle temperature, where the gas looks ideal to first order. For a van der Waals gas $B_2 = b - a/RT$.' },
    { id: 'cgeq-045', type: 'msq', level: 5, exams: ['gate', 'net'], sub: 'trapped gas', format: 'statements',
      q: 'For a classical ideal gas of $N$ atoms in an isotropic harmonic trap $\\tfrac12m\\omega^2r^2$, which statements are correct?',
      options: ['$U = 3NkT$', '$C = 3Nk$', 'The cloud radius grows as $\\sqrt T$', 'The peak density is independent of temperature'], answer: [0, 1, 2],
      sol: 'Six quadratic terms per atom: $U = 3NkT$, $C = 3Nk$ (twice the box value). The density is Gaussian with $\\sigma = \\sqrt{kT/m\\omega^2}$, so its size grows as $\\sqrt T$ and the peak density $N/(2\\pi\\sigma^2)^{3/2}$ falls as $T^{-3/2}$.' },
  ],
  gens: [
    { id: 'cgeq-g01', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'thermal wavelength',
      make(r) {
        const [name, m] = choose(r, [...GASES, ['hydrogen molecules (H$_2$)', 2.016], ['nitrogen molecules (N$_2$)', 28.013], ['electrons', 5.48580e-4]]), T = choose(r, [4, 20, 77, 300, 1000]);
        const L = lam(m, T) * 1e9;
        return { q: `The thermal de Broglie wavelength $h/\\sqrt{2\\pi mkT}$ of ${name} ($m = ${m}$ u) at $${T}$ K is ______ nm.`,
          answer: sig(L, 4), tol: sig(L * 0.01, 2), unit: 'nm', m, T,
          sol: `$\\lambda = \\frac{6.626\\times10^{-34}}{\\sqrt{2\\pi\\times${sig(m * C.u, 4)}\\times1.381\\times10^{-23}\\times${T}}} \\approx ${sig(L, 4)}$ nm. Note $\\lambda \\propto 1/\\sqrt{mT}$.` };
      },
      verify: (p) => lam(p.m, p.T) * 1e9 },
    { id: 'cgeq-g02', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'validity',
      make(r) {
        const [name, m] = choose(r, GASES), T = choose(r, [10, 30, 100, 300]), P = choose(r, [0.1, 1, 10]);
        const n = P * 101325 / (C.kB * T), x = n * lam(m, T) ** 3;
        return { q: `For ${name} gas ($m = ${m}$ u) treated as ideal at $${T}$ K and $${P}$ atm, the degeneracy parameter $n\\lambda^3$ is ______.`,
          answer: sig(x, 3), tol: sig(x * 0.015, 2), m, T, P,
          sol: `$n = P/kT = ${sig(n, 3)}$ m$^{-3}$, $\\lambda = ${sig(lam(m, T), 3)}$ m. $n\\lambda^3 \\approx ${sig(x, 3)}$${x < 0.01 ? ': classical statistics are excellent.' : ': quantum corrections are no longer small.'}` };
      },
      verify: (p) => p.P * 101325 / (C.kB * p.T) * lam(p.m, p.T) ** 3 },
    { id: 'cgeq-g03', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'gravity',
      make(r) {
        const [name, m] = choose(r, [['nitrogen', 28.013], ['oxygen', 31.999], ['argon', 39.948], ['helium', 4.0026], ['carbon dioxide', 44.01]]), T = choose(r, [220, 250, 280, 300]), h = choose(r, [500, 1000, 2000, 5000, 8000]);
        const f = Math.exp(-m * C.u * 9.8 * h / (C.kB * T));
        return { q: `In an isothermal atmosphere at $${T}$ K, the number density of ${name} ($m = ${m}$ u) at height $${h}$ m is what fraction of its value at the ground? ($g = 9.8$ m/s$^2$)`,
          answer: round(f, 4), tol: Math.max(0.001, round(f * 0.01, 4)), m, T, h,
          sol: `$n(h)/n(0) = e^{-mgh/kT}$ with $mgh/kT = \\frac{${sig(m * C.u, 4)}\\times9.8\\times${h}}{1.381\\times10^{-23}\\times${T}} = ${round(m * C.u * 9.8 * h / (C.kB * T), 4)}$. Fraction $\\approx ${round(f, 4)}$.` };
      },
      verify: (p) => Math.exp(-p.m * C.u * 9.8 * p.h / (C.kB * p.T)) },
    { id: 'cgeq-g04', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'centrifuge',
      make(r) {
        const [name, m] = choose(r, [['UF$_6$', 352], ['xenon', 131.3], ['SF$_6$', 146], ['krypton', 83.8]]), R = choose(r, [0.04, 0.05, 0.06, 0.08]), f = choose(r, [300, 400, 500, 600]), T = choose(r, [300, 320]);
        const x = m * C.u * (2 * Math.PI * f) ** 2 * R * R / (2 * C.kB * T), ratio = Math.exp(x);
        return { q: `A gas centrifuge of radius $${R * 100}$ cm spins at $${f}$ rev/s with ${name} ($m = ${m}$ u) at $${T}$ K. The ratio of number density at the wall to that on the axis is ______.`,
          answer: sig(ratio, 4), tol: sig(ratio * 0.01, 2), m, R, f, T,
          sol: `$n(r) \\propto e^{m\\omega^2r^2/2kT}$, $\\omega = 2\\pi\\times${f} = ${round(2 * Math.PI * f, 1)}$ rad/s. Exponent $= ${round(x, 4)}$, ratio $= e^{${round(x, 4)}} \\approx ${sig(ratio, 4)}$.` };
      },
      verify: (p) => Math.exp(p.m * C.u * (2 * Math.PI * p.f) ** 2 * p.R * p.R / (2 * C.kB * p.T)) },
    { id: 'cgeq-g05', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'equipartition',
      make(r) {
        const fr = (num, den) => { const g = (a, b) => (b ? g(b, a % b) : a); const d = g(num, den); return den / d === 1 ? `${num / d}kT` : `\\tfrac{${num / d}}{${den / d}}kT`; };
        const kin = choose(r, [['p^2/2m', 1, 2], ['c|p|', 1, 1]]), pot = choose(r, [['a x^2', 1, 2], ['a x^4', 1, 4], ['a|x|', 1, 1], ['a x^6', 1, 6], ['a|x|^3', 1, 3]]);
        // mean energy = kT/s_kin + kT/s_pot
        const sk = kin[2] === 2 ? 2 : 1, sp = { 'a x^2': 2, 'a x^4': 4, 'a|x|': 1, 'a x^6': 6, 'a|x|^3': 3 }[pot[0]];
        const num = sk * sp === 0 ? 1 : sp + sk, den = sk * sp;
        const right = `$${fr(num, den)}$`;
        const wrongs = [`$${fr(1, 1)}$`, `$${fr(1, 2)}$`, `$${fr(3, 2)}$`, `$${fr(2, 1)}$`, `$${fr(3, 4)}$`, `$${fr(5, 6)}$`];
        const o = mcqOptions(r, right, wrongs);
        return { q: `A classical particle on a line has $H = ${kin[0]} + ${pot[0]}$ ($a > 0$). Its mean energy at temperature $T$ is`, options: o.options, answer: o.answer,
          sol: `Generalised equipartition: a term $\\propto|q|^s$ carries $kT/s$. Kinetic term: $kT/${sk}$; potential term: $kT/${sp}$. Total $= $ ${right}.`,
          trap: 'Only quadratic terms give $\\tfrac12kT$.' };
      } },
    { id: 'cgeq-g06', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Sackur-Tetrode',
      make(r) {
        const [name, m] = choose(r, GASES), T = choose(r, [100, 200, 298.15, 500, 1000]), P = choose(r, [0.1, 1, 10]);
        const S = C.R * (Math.log(C.kB * T / (P * 1e5) / lam(m, T) ** 3) + 2.5);
        return { q: `Using the Sackur-Tetrode equation, the molar entropy of ${name} ($m = ${m}$ u) at $${T}$ K and $${P}$ bar is ______ J mol$^{-1}$ K$^{-1}$.`,
          answer: round(S, 1), tol: Math.max(0.5, round(S * 0.005, 1)), unit: 'J mol⁻¹ K⁻¹', m, T, P,
          sol: `$V/N = kT/P = ${sig(C.kB * T / (P * 1e5), 4)}$ m$^3$, $\\lambda = ${sig(lam(m, T), 4)}$ m. $S/R = \\ln\\frac{V}{N\\lambda^3} + \\frac52 = ${round(Math.log(C.kB * T / (P * 1e5) / lam(m, T) ** 3), 3)} + 2.5$, so $S \\approx ${round(S, 1)}$ J mol$^{-1}$ K$^{-1}$.` };
      },
      verify: (p) => C.R * (Math.log(C.kB * p.T / (p.P * 1e5) / lam(p.m, p.T) ** 3) + 2.5) },
    { id: 'cgeq-g07', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'mixing',
      make(r) {
        const n1 = int(r, 1, 4), n2 = int(r, 1, 5), [a, b] = choose(r, [['helium', 'argon'], ['nitrogen', 'oxygen'], ['neon', 'xenon'], ['hydrogen', 'methane']]);
        const N = n1 + n2, S = -C.R * (n1 * Math.log(n1 / N) + n2 * Math.log(n2 / N));
        return { q: `$${n1}$ mol of ${a} and $${n2}$ mol of ${b}, both ideal and at the same temperature and pressure, are allowed to mix. The entropy of mixing is ______ J/K.`,
          answer: round(S, 2), tol: Math.max(0.05, round(S * 0.01, 2)), unit: 'J/K', n1, n2,
          sol: `$\\Delta S = -R(n_1\\ln x_1 + n_2\\ln x_2)$ with $x_1 = ${n1}/${N}$, $x_2 = ${n2}/${N}$: $\\Delta S = 8.314\\times(${round(-n1 * Math.log(n1 / N), 4)} + ${round(-n2 * Math.log(n2 / N), 4)}) \\approx ${round(S, 2)}$ J/K.`,
          trap: 'If both samples were the same gas, the answer would be zero.' };
      },
      verify: (p) => { const N = p.n1 + p.n2; return -C.R * (p.n1 * Math.log(p.n1 / N) + p.n2 * Math.log(p.n2 / N)); } },
    { id: 'cgeq-g08', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'gravity',
      make(r) {
        const [planet, g, gas, m] = choose(r, [['Earth', 9.8, 'N$_2$', 28.013], ['Mars', 3.71, 'CO$_2$', 44.01], ['Venus', 8.87, 'CO$_2$', 44.01], ['Titan', 1.35, 'N$_2$', 28.013], ['Jupiter', 24.8, 'H$_2$', 2.016]]), T = choose(r, [100, 150, 200, 250, 300, 700]);
        const H = C.kB * T / (m * C.u * g) / 1000;
        return { q: `Treat the atmosphere of ${planet} ($g = ${g}$ m/s$^2$) as isothermal ${gas} ($m = ${m}$ u) at $${T}$ K. Its scale height is ______ km.`,
          answer: round(H, 2), tol: Math.max(0.05, round(H * 0.01, 2)), unit: 'km', g, m, T,
          sol: `$H = kT/mg = \\frac{1.381\\times10^{-23}\\times${T}}{${sig(m * C.u, 4)}\\times${g}} \\approx ${round(H, 2)}$ km.` };
      },
      verify: (p) => C.kB * p.T / (p.m * C.u * p.g) / 1000 },
    { id: 'cgeq-g09', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'equipartition',
      make(r) {
        const [name, N, lin] = choose(r, [['HCl', 2, true], ['CO$_2$', 3, true], ['H$_2$O', 3, false], ['NH$_3$', 4, false], ['CH$_4$', 5, false], ['C$_2$H$_2$ (acetylene)', 4, true], ['N$_2$O', 3, true], ['SO$_2$', 3, false]]);
        const rot = lin ? 2 : 3, vib = 3 * N - 3 - rot, cv = (3 + rot + 2 * vib) / 2;
        return { q: `If all modes of ${name} (${lin ? 'linear' : 'non-linear'}, ${N} atoms) were fully excited and classical, $C_V/R$ for the gas would be ______.`,
          answer: cv, tol: 0, N, lin,
          sol: `$3N = ${3 * N}$ coordinates: 3 translations, ${rot} rotations, ${vib} vibrational modes. Quadratic terms: $3 + ${rot} + 2\\times${vib} = ${3 + rot + 2 * vib}$, so $C_V = ${cv}R$.`,
          trap: 'Each vibrational mode counts twice (kinetic and potential).' };
      },
      verify: (p) => { const rot = p.lin ? 2 : 3; return (3 + rot + 2 * (3 * p.N - 3 - rot)) / 2; } },
    { id: 'cgeq-g10', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Langevin',
      make(r) {
        const x = choose(r, [0.3, 0.5, 1, 1.5, 2, 3, 5]);
        const L = langevin(x);
        return { q: `Classical dipoles of moment $\\mu$ are in a field with $\\mu B/kT = ${x}$. The mean alignment $\\langle\\cos\\theta\\rangle$ is ______.`,
          answer: round(L, 4), tol: 0.003, x,
          sol: `$\\langle\\cos\\theta\\rangle = L(x) = \\coth x - 1/x = ${round(1 / Math.tanh(x), 4)} - ${round(1 / x, 4)} \\approx ${round(L, 4)}$. (Small-$x$ estimate $x/3 = ${round(x / 3, 4)}$.)` };
      },
      verify: (p) => langevin(p.x) },
    { id: 'cgeq-g11', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'chemical potential',
      make(r) {
        const [name, m] = choose(r, GASES), T = choose(r, [100, 300, 500, 1000]), P = choose(r, [0.01, 0.1, 1, 10]);
        const n = P * 101325 / (C.kB * T), mu = kBe * T * Math.log(n * lam(m, T) ** 3);
        return { q: `The chemical potential of ${name} ($m = ${m}$ u) as a classical ideal gas at $${T}$ K and $${P}$ atm is ______ eV.`,
          answer: round(mu, 4), tol: Math.max(0.002, Math.abs(round(mu * 0.01, 4))), unit: 'eV', m, T, P,
          sol: `$n\\lambda^3 = ${sig(n * lam(m, T) ** 3, 3)}$, $kT = ${round(kBe * T, 5)}$ eV. $\\mu = kT\\ln(n\\lambda^3) \\approx ${round(mu, 4)}$ eV.` };
      },
      verify: (p) => kBe * p.T * Math.log(p.P * 101325 / (C.kB * p.T) * lam(p.m, p.T) ** 3) },
    { id: 'cgeq-g12', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'concepts',
      make(r) {
        const TRUE = ['The pressure of an ideal gas is $NkT/V$ whatever its dispersion relation $E(p)$', 'The entropy of mixing two samples of the same gas at the same $T$ and $P$ is zero', 'Classical statistics need $n\\lambda^3 \\ll 1$', 'A quartic potential $ax^4$ carries $kT/4$ on average', 'In a tall isothermal column, each molecule has mean potential energy $kT$', 'The classical chemical potential of an ideal gas is negative', 'The Sackur-Tetrode entropy contains Planck’s constant'];
        const FALSE = ['Every term in the Hamiltonian carries $\\tfrac12kT$, whatever its form', 'The $1/N!$ in $Z_N$ is needed to make the energy extensive', 'Equipartition holds at any temperature for a quantum oscillator', 'An ultra-relativistic gas obeys $PV = \\tfrac13NkT$', 'The thermal wavelength grows as the temperature rises', 'The Sackur-Tetrode formula is valid down to $T = 0$', 'Lighter gases have a smaller scale height at the same temperature', 'Gibbs’ paradox is removed by including the zero-point energy'];
        const right = choose(r, TRUE), ws = shuffle(r, FALSE).slice(0, 3);
        const o = mcqOptions(r, right, ws);
        return { q: 'Which one of the following statements about classical ideal gases is correct?', options: o.options, answer: o.answer,
          sol: `Correct: ${right}. The others fail: ${ws.map((w) => w.replace(/\.$/, '')).join('; ')}. (Equipartition needs quadratic terms and high $T$; the $1/N!$ fixes the entropy; $PV = NkT$ for any dispersion; $\\lambda \\propto T^{-1/2}$; $H = kT/mg$ is larger for light gases.)` };
      } },
  ],
};
