// The quantum Hall effect and low-dimensional systems (CSIR NET Part C / GATE level): density of states in 3D, 2D,
// 1D and 0D, quantum wells and subbands, the 2D electron gas, Landau levels, degeneracy and filling factor, magnetic
// length, Shubnikov-de Haas and de Haas-van Alphen oscillations, the classical and quantum Hall effects, the
// conductivity and resistivity tensors, edge states, Laughlin's argument and the Chern number, the fractional effect,
// graphene, Landauer conductance quanta and Coulomb blockade. Original questions for fibub.
import { pick, int, choose, mcqOptions, round, C } from '../_util.js';
import more from './quantum-hall.more.gen.js';
import more2 from './quantum-hall.more2.gen.js';
import r4 from './quantum-hall.r4.gen.js';

const R = String.raw;
const H = C.h, E = C.e, HBAR = C.hbar, ME = C.me;
const RK = H / (E * E);                     // von Klitzing constant, ohm
const NB = (B) => E * B / H;                // Landau degeneracy per area per spin, m^-2

export default {
  topic: 'quantum-hall',
  items: [
    // ---------- level 1 ----------
    { id: 'qhe-001', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'integer QHE',
      q: R`On the plateau of the integer quantum Hall effect with filling factor $\nu$, the Hall resistance is`,
      options: [R`$\nu h/e^2$`, R`$h/2\nu e^2$`, R`$h/\nu e^2$`, R`$\nu e^2/h$`], answer: 2,
      sol: R`With $\nu$ Landau levels completely filled, $\sigma_{xy} = \nu e^2/h$ and $\sigma_{xx} = 0$, so $\rho_{xy} = 1/\sigma_{xy} = h/\nu e^2 = 25812.807\ \Omega/\nu$.`,
      trap: R`$\nu e^2/h$ is the Hall conductance, not resistance.` },
    { id: 'qhe-002', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'integer QHE',
      q: 'While the Hall resistance of a 2D electron gas sits on a quantum Hall plateau, its longitudinal resistance $\\rho_{xx}$ is',
      options: ['essentially zero', 'equal to the Hall resistance', 'very large and rising with B', 'equal to h/e² exactly'], answer: 0,
      sol: R`On a plateau the Fermi level lies in localised states between Landau levels, so there are no extended states at the Fermi energy to scatter into: no dissipation, $\sigma_{xx} = 0$. With $\sigma_{xy} \ne 0$ the tensor inversion makes $\rho_{xx} = 0$ too. Measured values go below $10^{-10}\ \Omega$.`,
      trap: 'Zero resistance here is not superconductivity: σxx is also zero.' },
    { id: 'qhe-003', type: 'nat', level: 1, exams: ['gate', 'net'], sub: 'integer QHE', unit: 'Ω',
      q: R`The von Klitzing constant $R_K = h/e^2$ is ______ $\Omega$ (nearest whole number). Use $h = 6.62607\times10^{-34}$ J s and $e = 1.602177\times10^{-19}$ C.`,
      answer: 25813, tol: 1, calc: () => RK,
      sol: R`$R_K = 6.62607\times10^{-34}/(1.602177\times10^{-19})^2 = 6.62607\times10^{-34}/2.56697\times10^{-38} = 25812.8\ \Omega$. Since 2019 $h$ and $e$ are exact, so $R_K$ is exact too, and quantum Hall devices realise the ohm.`,
      trap: R`$h/2e^2 = 12906\ \Omega$ is the resistance of one spin-degenerate channel (or the $\nu = 2$ plateau).` },
    { id: 'qhe-004', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'Landau levels',
      q: R`A 2D electron of effective mass $m^*$ in a perpendicular field $B$ has energies (ignoring spin)`,
      options: [R`$\hbar\omega_c n^2$, with $\omega_c = eB/m^*$`, R`$\hbar\omega_c(n + \tfrac12)$, with $\omega_c = eB/2m^*$`, R`continuous, from 0 upwards`, R`$\hbar\omega_c(n + \tfrac12)$, with $\omega_c = eB/m^*$`], answer: 3,
      sol: R`In the Landau gauge $\vec A = (0, Bx, 0)$, $H = [p_x^2 + (p_y + eBx)^2]/2m^*$; with $p_y = \hbar k$ it is a harmonic oscillator in $x$ centred at $-\hbar k/eB$ with frequency $\omega_c = eB/m^*$. So $E_n = \hbar\omega_c(n + \tfrac12)$, each level hugely degenerate (one state per $k$).`,
      trap: R`$eB/2m$ is the Larmor frequency, half the cyclotron frequency.` },
    { id: 'qhe-005', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'density of states',
      q: 'The density of states per unit area of a 2D free-electron gas (effective mass $m^*$, spin included), for energies above the band bottom, is',
      options: [R`proportional to $\sqrt E$`, R`constant, $m^*/\pi\hbar^2$`, R`proportional to $1/\sqrt E$`, R`proportional to $E$`], answer: 1,
      sol: R`States fill a disc in $k$ space: $N/A = 2\times\pi k^2/(2\pi)^2 = k^2/2\pi$, with $E = \hbar^2k^2/2m^*$: $N/A = m^*E/\pi\hbar^2$. Its derivative $m^*/\pi\hbar^2$ is constant, so each 2D subband adds a step.`,
      trap: R`$\sqrt E$ is 3D; $1/\sqrt E$ is 1D.` },
    { id: 'qhe-006', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'Landauer conductance',
      q: 'A ballistic narrow constriction carries a single spin-degenerate transverse mode with perfect transmission. Its conductance is',
      options: [R`$e^2/h$`, R`zero, since there is no scattering`, R`$2e^2/h$`, R`infinite, since there is no scattering`], answer: 2,
      sol: R`Landauer: $G = (2e^2/h)\sum_nT_n$. One mode with $T = 1$ gives $2e^2/h = 77.5\ \mu$S, a resistance of 12.9 k$\Omega$ even with no scattering: it is a contact resistance from fitting many reservoir modes into one channel.`,
      trap: 'A perfect wire still has finite resistance h/2e² per mode.' },

    // ---------- level 2 ----------
    { id: 'qhe-007', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Landau levels', unit: '× 10¹⁵ m⁻²',
      q: R`Each Landau level of a 2D electron gas holds $eB/h$ states per unit area for each spin direction. At $B = 10$ T this is ______ $\times10^{15}$ m$^{-2}$ (two decimal places).`,
      answer: 2.42, tol: 0.01, calc: () => NB(10) / 1e15,
      sol: R`$eB/h = 1.602\times10^{-19}\times10/6.626\times10^{-34} = 2.42\times10^{15}$ m$^{-2}$: one state per flux quantum $h/e$ threading the sample. This is the same as the number of $B = 0$ states in an energy range $\hbar\omega_c$ per spin, $(m^*/2\pi\hbar^2)\hbar\omega_c$.`,
      trap: 'The degeneracy does not depend on the effective mass.' },
    { id: 'qhe-008', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'filling factor',
      q: R`A 2D electron gas has density $3.0\times10^{15}$ m$^{-2}$. In a perpendicular field of $5.0$ T its filling factor $\nu = n_sh/eB$ is ______ (two decimal places).`,
      answer: 2.48, tol: 0.01, calc: () => 3e15 / NB(5),
      sol: R`$eB/h = 1.209\times10^{15}$ m$^{-2}$ at 5 T. $\nu = 3.0\times10^{15}/1.209\times10^{15} = 2.48$: two spin-resolved Landau levels full and the third half full.`,
      trap: 'Using ħ instead of h changes ν by 2π.' },
    { id: 'qhe-009', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Landau levels', unit: 'nm',
      q: R`The magnetic length $\ell_B = \sqrt{\hbar/eB}$ at $B = 9.0$ T is ______ nm (two decimal places).`,
      answer: 8.55, tol: 0.01, calc: () => Math.sqrt(HBAR / (E * 9)) * 1e9,
      sol: R`$\ell_B = \sqrt{1.0546\times10^{-34}/(1.602\times10^{-19}\times9)} = \sqrt{7.31\times10^{-17}} = 8.55\times10^{-9}$ m, i.e. $25.7\text{ nm}/\sqrt{B[\text{T}]}$. A disc of area $2\pi\ell_B^2$ holds one flux quantum.`,
      trap: R`$\ell_B$ is independent of the effective mass; it depends only on $B$.` },
    { id: 'qhe-010', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Landau levels', unit: 'meV',
      q: R`Electrons in GaAs have effective mass $0.067\,m_e$. At $B = 10$ T their cyclotron energy $\hbar\omega_c$ is ______ meV (two decimal places).`,
      answer: 17.28, tol: 0.05, calc: () => HBAR * E * 10 / (0.067 * ME) / E * 1000,
      sol: R`$\hbar\omega_c = \hbar eB/m^* = 1.0546\times10^{-34}\times1.602\times10^{-19}\times10/(0.067\times9.109\times10^{-31}) = 2.77\times10^{-21}$ J $= 17.3$ meV, i.e. $1.73$ meV/T: about 200 K at 10 T, much larger than at liquid-helium temperatures, which is why GaAs is ideal for the QHE.`,
      trap: 'With the free-electron mass you get only 1.16 meV.' },
    { id: 'qhe-011', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'quantum oscillations',
      q: 'Shubnikov-de Haas oscillations of the longitudinal resistance of a 2D electron gas are periodic in',
      options: [R`$B$`, R`$1/B$`, R`$B^2$`, R`$\sqrt B$`], answer: 1,
      sol: R`A minimum occurs each time the Fermi level lies between Landau levels, i.e. at integer $\nu = n_sh/eB$. Consecutive integers $\nu$ and $\nu + 1$ are equally spaced in $1/B$: $\Delta(1/B) = e/n_sh$ per spin-resolved level ($2e/n_sh$ for spin-degenerate levels).`,
      trap: 'The minima crowd together at low field when plotted against B; they are uniform only in 1/B.' },
    { id: 'qhe-012', type: 'nat', level: 2, exams: ['gate', 'net'], sub: '2D electron gas', unit: 'meV',
      q: R`A GaAs 2D electron gas ($m^* = 0.067\,m_e$, spin-degenerate, one subband) has density $3.0\times10^{15}$ m$^{-2}$. Its Fermi energy measured from the subband bottom is ______ meV (two decimal places).`,
      answer: 10.72, tol: 0.05, calc: () => Math.PI * HBAR ** 2 * 3e15 / (0.067 * ME) / E * 1000,
      sol: R`$n_s = (m^*/\pi\hbar^2)E_F$, so $E_F = \pi\hbar^2n_s/m^* = \pi\times(1.0546\times10^{-34})^2\times3.0\times10^{15}/(6.10\times10^{-32}) = 1.72\times10^{-21}$ J $= 10.7$ meV.`,
      trap: R`Forgetting spin gives $2\pi\hbar^2n_s/m^*$, twice as large.` },
    { id: 'qhe-013', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'integer QHE',
      q: R`On the $\nu = 2$ plateau, the Hall resistance of a 2D electron gas is about`,
      options: [R`$6453\ \Omega$`, R`$25813\ \Omega$`, R`$51626\ \Omega$`, R`$12906\ \Omega$`], answer: 3,
      sol: R`$\rho_{xy} = h/\nu e^2 = 25812.8/2 = 12906.4\ \Omega$. It is the same in Si MOSFETs, GaAs heterostructures and graphene, to parts in $10^{10}$.`,
      trap: R`$6453\ \Omega$ is $\nu = 4$.` },
    { id: 'qhe-014', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'integer QHE', format: 'multi',
      q: 'Which statements about the integer quantum Hall effect are correct?',
      options: ['The plateau values do not depend on the sample shape or the host material.', 'It requires electron-electron interactions to appear.', 'The longitudinal resistance vanishes on a plateau.', 'Some disorder (localised states) is needed for the plateaus to have finite width.'], answer: [0, 2, 3],
      sol: R`The IQHE is a one-electron effect: Landau quantisation plus disorder. Localised states between the levels pin the Fermi energy while $B$ changes, so $\sigma_{xy}$ stays at $\nu e^2/h$ over a range of field and $\rho_{xx} = 0$ there. The quantisation is topological, independent of shape, material and impurities. Interactions are needed for the fractional effect, not the integer one.`,
      trap: 'In a perfectly clean sample the plateaus would shrink to points.' },
    { id: 'qhe-015', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'quantum wells',
      q: R`In an infinitely deep quantum well of width $L$, the confinement energies of the subbands scale as`,
      options: [R`$n/L$`, R`$n^2/L$`, R`$n^2/L^2$`, R`$n/L^2$`], answer: 2,
      sol: R`$E_n = \dfrac{\pi^2\hbar^2n^2}{2m^*L^2}$: standing waves with $k = n\pi/L$. Halving the width quadruples every level, which is how the colour of quantum-well lasers and dots is tuned.`,
      trap: 'Energy goes as k², and k as n/L.' },
    { id: 'qhe-016', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'quantum wells', unit: 'meV',
      q: R`An electron ($m^* = 0.067\,m_e$) is confined in an infinitely deep GaAs well of width $10$ nm. Its ground-state confinement energy is ______ meV (one decimal place).`,
      answer: 56.1, tol: 0.2, calc: () => Math.PI ** 2 * HBAR ** 2 / (2 * 0.067 * ME * 1e-16) / E * 1000,
      sol: R`$E_1 = \pi^2\hbar^2/2m^*L^2 = 9.870\times1.1122\times10^{-68}/(2\times6.103\times10^{-32}\times10^{-16}) = 8.99\times10^{-21}$ J $= 56.1$ meV. With the free-electron mass it would be only 3.76 meV.`,
      trap: 'Using the free-electron mass underestimates the confinement energy fifteen-fold.' },

    // ---------- level 3 ----------
    { id: 'qhe-017', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'conductivity tensor',
      q: R`In a 2D conductor in a magnetic field, $\sigma_{xx} = \sigma_{yy}$ and $\sigma_{xy} = -\sigma_{yx}$. On a quantum Hall plateau, $\sigma_{xx} = 0$ while $\sigma_{xy} \ne 0$. Then the longitudinal resistivity $\rho_{xx}$ is`,
      options: [R`zero, because $\rho_{xx} = \sigma_{xx}/(\sigma_{xx}^2 + \sigma_{xy}^2)$`, R`infinite, because $\rho_{xx} = 1/\sigma_{xx}$`, R`equal to $1/\sigma_{xy}$`, R`indeterminate (zero divided by zero)`], answer: 0,
      sol: R`Inverting the $2\times2$ tensor: $\rho_{xx} = \dfrac{\sigma_{xx}}{\sigma_{xx}^2 + \sigma_{xy}^2}$ and $\rho_{xy} = \dfrac{-\sigma_{yx}}{\sigma_{xx}^2 + \sigma_{xy}^2}$, which gives $1/\sigma_{xy}$ in magnitude when $\sigma_{xx} = 0$. So a perfect insulator along $x$ ($\sigma_{xx} = 0$) is at the same time a perfect conductor ($\rho_{xx} = 0$): the current flows at right angles to the field with no dissipation.`,
      trap: R`$\rho_{xx} = 1/\sigma_{xx}$ holds only when $B = 0$.` },
    { id: 'qhe-018', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'quantum oscillations', unit: '× 10¹⁵ m⁻²',
      q: R`Shubnikov-de Haas minima of a spin-degenerate 2D electron gas are spaced by $\Delta(1/B) = 0.050$ T$^{-1}$. The electron density is ______ $\times10^{15}$ m$^{-2}$ (two decimal places).`,
      answer: 9.67, tol: 0.03, calc: () => 2 * E / (H * 0.05) / 1e15,
      sol: R`Minima occur when an integer number $N$ of spin-degenerate levels is full: $n_s = N\cdot2eB_N/h$, so $1/B_N = 2eN/hn_s$ and $\Delta(1/B) = 2e/hn_s$. Then $n_s = 2e/(h\Delta) = 2\times1.602\times10^{-19}/(6.626\times10^{-34}\times0.050) = 9.67\times10^{15}$ m$^{-2}$.`,
      trap: 'If the spin splitting is resolved, the period halves; here the levels are spin-degenerate, hence the factor 2.' },
    { id: 'qhe-019', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'fractional QHE',
      q: R`The elementary excitations (quasiparticles) of the Laughlin state at $\nu = 1/3$ carry an electric charge of`,
      options: [R`$e$`, R`$e/3$`, R`$3e$`, R`$2e$`], answer: 1,
      sol: R`Laughlin's thought experiment: inserting one flux quantum $h/e$ adiabatically at a point pushes out a charge $\nu e = e/3$, leaving a quasihole of charge $e/3$. Shot-noise experiments confirmed fractional charge $e/3$.`,
      trap: 'Charge 2e belongs to Cooper pairs, not to quantum Hall quasiparticles.' },
    { id: 'qhe-020', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'filling factor', unit: 'T',
      q: R`A 2D electron gas has density $2.4\times10^{15}$ m$^{-2}$. The magnetic field at which the filling factor is exactly 1 is ______ T (two decimal places).`,
      answer: 9.93, tol: 0.02, calc: () => 2.4e15 * H / E,
      sol: R`$\nu = n_sh/eB = 1$ gives $B = n_sh/e = 2.4\times10^{15}\times4.136\times10^{-15}$ T m$^2 = 9.93$ T. ($h/e = 4.136\times10^{-15}$ Wb is the flux quantum for single electrons.)`,
      trap: R`$h/2e$ is the superconducting flux quantum; here each electron needs $h/e$.` },
    { id: 'qhe-021', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'fractional QHE',
      q: 'The fractional quantum Hall effect (plateaus at ν = 1/3, 2/5, 2/3, ...) arises from',
      options: ['disorder alone, as in the integer effect', 'spin-orbit coupling in the host crystal', 'Coulomb interactions among electrons in a partly filled Landau level', 'the periodic potential of the crystal lattice'], answer: 2,
      sol: R`In a partly filled lowest Landau level all single-particle states have the same kinetic energy, so the many-body ground state is decided by the Coulomb repulsion alone. At special fractions it forms an incompressible liquid (Laughlin's $\prod(z_i - z_j)^3e^{-\sum|z|^2/4\ell_B^2}$ for 1/3) with a gap, which gives plateaus.`,
      trap: 'Disorder is needed to give plateaus width, but the gap itself comes from interactions.' },
    { id: 'qhe-022', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'graphene',
      q: R`In monolayer graphene (Dirac electrons with 4-fold spin and valley degeneracy), the quantum Hall plateaus appear at $\sigma_{xy}$ equal to`,
      options: [R`$\pm2, \pm6, \pm10, \dots$ in units of $e^2/h$`, R`$\pm4, \pm8, \pm12, \dots$ in units of $e^2/h$`, R`$0, \pm1, \pm2, \dots$ in units of $e^2/h$`, R`$\pm1, \pm3, \pm5, \dots$ in units of $e^2/h$`], answer: 0,
      sol: R`Dirac Landau levels are $E_n = \pm v_F\sqrt{2e\hbar B|n|}$, including a level exactly at $E = 0$ shared equally by electrons and holes. Each level holds 4 states per flux quantum, and the zero level is half-filled at neutrality, so $\sigma_{xy} = \pm4(N + \tfrac12)e^2/h = \pm2, \pm6, \pm10, \dots$: the "half-integer" quantum Hall effect, a signature of the Berry phase $\pi$.`,
      trap: R`$\pm4, \pm8, \dots$ would be an ordinary 4-fold degenerate 2D gas without the zero-energy level.` },
    { id: 'qhe-023', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'graphene', unit: 'meV',
      q: R`Graphene's Landau levels are $E_n = \pm v_F\sqrt{2e\hbar B|n|}$ with $v_F = 1.0\times10^6$ m/s. At $B = 10$ T, the $n = 1$ level lies ______ meV above the Dirac point (nearest whole number).`,
      answer: 115, tol: 1, calc: () => 1e6 * Math.sqrt(2 * E * HBAR * 10) / E * 1000,
      sol: R`$\sqrt{2e\hbar B} = \sqrt{2\times1.602\times10^{-19}\times1.0546\times10^{-34}\times10} = 1.838\times10^{-26}$ kg m/s. Times $v_F$: $1.838\times10^{-20}$ J $= 115$ meV, far more than in GaAs at the same field, which is why graphene shows the QHE even at room temperature.`,
      trap: R`Dirac levels go as $\sqrt{B}$ and $\sqrt n$, not linearly like $\hbar\omega_c(n + \tfrac12)$.` },
    { id: 'qhe-024', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'edge states',
      q: 'In the quantum Hall regime, the current is carried by edge states. Which property explains the absence of backscattering?',
      options: ['Edge states have infinite effective mass.', 'On a given edge all edge states move in the same direction, so an electron has no backward state to scatter into nearby.', 'Edge states exist only at zero temperature.', 'Edge states carry no charge.'], answer: 1,
      sol: R`Near the edge the confining potential bends the Landau levels up, and where they cross the Fermi energy they form channels with group velocity $\vec E\times\vec B/B^2$ along the edge. The direction is fixed by $\vec B$: opposite edges carry opposite directions. To reverse, an electron would have to cross the whole sample, which is exponentially suppressed. Each channel gives $e^2/h$.`,
      trap: 'Chirality, not the absence of impurities, is what protects the edge channels.' },
    { id: 'qhe-025', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'density of states', format: 'multi',
      q: 'Which statements about the density of states $g(E)$ of free electrons in low-dimensional systems are correct?',
      options: [R`In 3D, $g(E)\propto\sqrt E$.`, R`In a quantum wire (1D), each subband gives $g\propto(E - E_n)^{-1/2}$.`, R`In a quantum dot (0D), the spectrum is a continuous band.`, R`In a quantum well, $g(E)$ is a staircase with a step at each subband edge.`], answer: [0, 1, 3],
      sol: R`In $d$ dimensions $N(E)\propto k^d\propto E^{d/2}$, so $g\propto E^{d/2 - 1}$: $\sqrt E$ (3D), constant (2D), $E^{-1/2}$ (1D). Confinement in the other directions makes each subband add its own $g$ from its edge $E_n$: steps in a well, inverse-square-root spikes in a wire. In a dot every direction is confined, so the spectrum is discrete: delta functions, like an atom.`,
      trap: 'A quantum dot is an artificial atom: discrete levels, not a band.' },
    { id: 'qhe-026', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'quantum wells',
      q: R`An infinitely deep GaAs well ($m^* = 0.067\,m_e$) is $20$ nm wide. Its electrons fill states up to $60$ meV above the bottom of the well. How many subbands are occupied?`,
      answer: 2, tol: 0, calc: () => { const E1 = Math.PI ** 2 * HBAR ** 2 / (2 * 0.067 * ME * 4e-16) / E * 1000; return Math.floor(Math.sqrt(60 / E1)); },
      sol: R`$E_n = n^2E_1$ with $E_1 = \pi^2\hbar^2/2m^*L^2 = 14.0$ meV for $L = 20$ nm (a quarter of the 10 nm value, 56.1 meV). $E_2 = 56.1$ meV $< 60$ meV and $E_3 = 126$ meV $> 60$ meV, so 2 subbands hold electrons.`,
      trap: 'The subband energies go as n², so the third subband is far above the second.' },
    { id: 'qhe-027', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Landauer conductance', unit: 'kΩ',
      q: R`A quantum point contact transmits 3 spin-degenerate modes perfectly. Its resistance is ______ k$\Omega$ (two decimal places).`,
      answer: 4.30, tol: 0.01, calc: () => RK / 6 / 1000,
      sol: R`$G = 3\times2e^2/h = 6e^2/h$, so $R = h/6e^2 = 25812.8/6 = 4302\ \Omega = 4.30$ k$\Omega$. Narrowing the gate removes modes one at a time, and $G$ falls in steps of $2e^2/h$.`,
      trap: 'Each spin-degenerate mode gives 2e²/h, not e²/h.' },
    { id: 'qhe-028', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'classical Hall effect',
      q: R`The classical Hall resistivity of a 2D gas is $\rho_{xy} = B/n_se$. At the exact field where the filling factor is the integer $N$, this classical value equals`,
      options: [R`$h/2Ne^2$`, R`$Nh/e^2$`, R`zero`, R`$h/Ne^2$, the plateau value`], answer: 3,
      sol: R`$\nu = n_sh/eB = N$ gives $B/n_se = h/Ne^2$. The plateaus cross the classical straight line at integer filling; disorder (localisation) extends each plateau on both sides of that point.`,
      trap: R`$h/2Ne^2$ would double-count spin; $\nu$ here counts spin-resolved levels.` },
    { id: 'qhe-029', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Coulomb blockade', unit: 'meV',
      q: R`A metallic island has a total capacitance of $1.0$ aF ($10^{-18}$ F). The charging energy $e^2/2C$ for adding one electron is ______ meV (one decimal place).`,
      answer: 80.1, tol: 0.2, calc: () => E * E / (2 * 1e-18) / E * 1000,
      sol: R`$e^2/2C = (1.602\times10^{-19})^2/(2\times10^{-18}) = 1.283\times10^{-20}$ J $= 80.1$ meV, about $930$ K in temperature units. Blockade (no current until the bias pays this energy) is clear when $k_BT \ll e^2/2C$ and the tunnel resistances exceed $h/e^2$.`,
      trap: R`$e^2/C$ (160 meV) is the spacing of the Coulomb diamonds in gate charge terms; the energy to add one electron to a neutral island is $e^2/2C$.` },

    // ---------- level 4 ----------
    { id: 'qhe-030', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'integer QHE', unit: 'mV',
      q: R`A current of $1.00\ \mu$A flows through a Hall bar on the $\nu = 4$ plateau. The Hall voltage is ______ mV (two decimal places).`,
      answer: 6.45, tol: 0.01, calc: () => 1e-6 * RK / 4 * 1000,
      sol: R`$V_H = I\rho_{xy} = I\,h/4e^2 = 10^{-6}\times6453.2 = 6.45\times10^{-3}$ V. In 2D the Hall resistance equals the Hall resistivity: no thickness or width enters.`,
      trap: 'Unlike in 3D, no sample dimension enters the 2D Hall voltage.' },
    { id: 'qhe-031', type: 'mcq', level: 4, exams: ['net'], sub: "Laughlin's argument",
      q: R`In Laughlin's gauge argument, a quantum Hall sample is rolled into a ring (Corbino geometry) and the flux through the hole is slowly increased by one flux quantum $h/e$. With $\nu$ Landau levels filled, the result is that`,
      options: [R`exactly $\nu$ electrons are carried from one edge to the other, which gives $\sigma_{xy} = \nu e^2/h$`, R`the Landau levels shift up by $\hbar\omega_c$`, R`one electron is carried across for each filled level divided by $2\pi$`, R`no charge moves, because the Hamiltonian returns to itself`], answer: 0,
      sol: R`Adding $h/e$ is a gauge transformation, so the spectrum returns to itself, but each Landau orbital moves outward by one position. In every filled level one electron goes from the inner edge to the outer: $\nu$ electrons in time $T$. The emf is $\mathcal E = (h/e)/T$ and the radial current $I = \nu e/T$, so $\sigma_{xy} = I/\mathcal E = \nu e^2/h$, exactly, whatever the disorder.`,
      trap: 'The spectrum returns, but the states are permuted: that permutation is the charge transfer.' },
    { id: 'qhe-032', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'filling factor',
      q: R`A 2D electron gas has density $5.0\times10^{15}$ m$^{-2}$ and its spin splitting is fully resolved. At $B = 3.1$ T, how many spin-resolved Landau levels are completely filled?`,
      answer: 6, tol: 0, calc: () => Math.floor(5e15 / NB(3.1)),
      sol: R`Each spin-resolved level holds $eB/h = 7.50\times10^{14}$ m$^{-2}$ at 3.1 T. $\nu = 5.0\times10^{15}/7.50\times10^{14} = 6.67$: six levels full and the seventh two-thirds full.`,
      trap: 'Rounding ν to the nearest integer (7) counts a partly filled level.' },
    { id: 'qhe-033', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'classical Hall effect', unit: 'm²/V s',
      q: R`A 2D electron gas has density $3.0\times10^{15}$ m$^{-2}$ (from the low-field Hall slope) and zero-field sheet resistance $20\ \Omega$ per square. Its mobility is ______ m$^2$/V s (nearest whole number).`,
      answer: 104, tol: 1, calc: () => 1 / (3e15 * E * 20),
      sol: R`$\sigma = n_se\mu$, so $\mu = 1/(n_se\rho) = 1/(3.0\times10^{15}\times1.602\times10^{-19}\times20) = 104$ m$^2$/V s $= 1.04\times10^6$ cm$^2$/V s, a high-mobility heterostructure. Landau quantisation needs $\mu B \gg 1$, i.e. above about 0.01 T here.`,
      trap: 'In 2D, sheet resistance (Ω per square) replaces resistivity; no thickness enters.' },
    { id: 'qhe-034', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'Landau levels',
      q: 'To resolve Landau quantisation in transport, which pair of conditions must hold (τ is the scattering time)?',
      options: [R`$\omega_c\tau \ll 1$ and $\hbar\omega_c \ll k_BT$`, R`$\omega_c\tau \gg 1$ and $\hbar\omega_c \gg k_BT$`, R`$\omega_c\tau \gg 1$ only; temperature is irrelevant`, R`$\hbar\omega_c \gg E_F$ only`], answer: 1,
      sol: R`An electron must complete a cyclotron orbit before scattering ($\omega_c\tau = \mu B \gg 1$, or the levels are broadened by $\hbar/\tau$ beyond their spacing), and thermal smearing $k_BT$ of the Fermi edge must be smaller than the level spacing $\hbar\omega_c$. Hence high mobility, high field and low temperature.`,
      trap: 'The QHE does not require ħωc > EF; many levels can be filled (large ν plateaus are seen).' },
    { id: 'qhe-035', type: 'msq', level: 4, exams: ['net'], sub: 'fractional QHE', format: 'multi',
      q: 'Which statements about the fractional quantum Hall effect are correct?',
      options: [R`Laughlin's wavefunction describes $\nu = 1/m$ with $m$ an odd integer.`, R`It would appear even for non-interacting electrons in a clean sample.`, R`Its quasiparticles carry a fraction of the electron charge.`, R`An even-denominator plateau at $\nu = 5/2$ has been observed.`], answer: [0, 2, 3],
      sol: R`$\Psi_m = \prod_{i<j}(z_i - z_j)^me^{-\sum|z_k|^2/4\ell_B^2}$ must be antisymmetric for fermions, so $m$ is odd. Its quasiholes carry $e/m$. The effect exists only because of interactions. The $\nu = 5/2$ plateau (in the second Landau level) is believed to be a paired state with non-Abelian excitations.`,
      trap: 'Even m would describe bosons, not electrons.' },
    { id: 'qhe-036', type: 'nat', level: 4, exams: ['net'], sub: 'Landau levels',
      q: R`In GaAs, $m^* = 0.067\,m_e$ and the effective $g$ factor is $|g^*| = 0.44$. The ratio of the Zeeman splitting $|g^*|\mu_BB$ to the cyclotron energy $\hbar\omega_c$ is ______ (four decimal places).`,
      answer: 0.0147, tol: 0.0002, calc: () => 0.44 * 0.067 / 2,
      sol: R`$\dfrac{g^*\mu_BB}{\hbar eB/m^*} = \dfrac{g^*(e\hbar/2m_e)}{\hbar e/m^*} = \dfrac{g^*m^*}{2m_e} = \dfrac{0.44\times0.067}2 = 0.0147$, independent of $B$. Spin splitting in GaAs is tiny, so odd-$\nu$ plateaus are weak (they are enhanced by exchange in real samples).`,
      trap: 'For free electrons (g = 2, m* = me) the ratio is exactly 1: spin-up level n coincides with spin-down level n + 1.' },
    { id: 'qhe-037', type: 'mcq', level: 4, exams: ['net'], sub: 'topology',
      q: R`Thouless, Kohmoto, Nightingale and den Nijs (TKNN) showed that the Hall conductance of filled bands is $\sigma_{xy} = (e^2/h)\sum_nC_n$, where $C_n$ is`,
      options: [R`the number of electrons per unit cell in band $n$`, R`the effective mass ratio of band $n$`, R`the Chern number: the Berry curvature of band $n$ integrated over the Brillouin zone, divided by $2\pi$, always an integer`, R`the number of edge atoms in the sample`], answer: 2,
      sol: R`From the Kubo formula, $\sigma_{xy}$ for a filled band is $(e^2/h)\frac1{2\pi}\int_{BZ}\Omega(\vec k)\,d^2k$, with $\Omega$ the Berry curvature of the Bloch states. This integral over a closed surface (the torus) is an integer, a topological invariant: it cannot change under smooth deformations, which is why the quantisation is so exact. The bulk Chern number equals the number of chiral edge channels.`,
      trap: 'The electron count sets ν in a simple Landau problem, but the invariant is the Chern number.' },

    // ---------- level 5 ----------
    { id: 'qhe-038', type: 'nat', level: 5, exams: ['net'], sub: 'conductivity tensor', unit: 'μS',
      q: R`Between plateaus a 2D sample has $\rho_{xx} = 100\ \Omega$ and $\rho_{xy} = 6450\ \Omega$. Its longitudinal conductivity $\sigma_{xx}$ is ______ $\mu$S (two decimal places).`,
      answer: 2.40, tol: 0.01, calc: () => 100 / (100 ** 2 + 6450 ** 2) * 1e6,
      sol: R`$\sigma_{xx} = \dfrac{\rho_{xx}}{\rho_{xx}^2 + \rho_{xy}^2} = \dfrac{100}{10^4 + 4.160\times10^7} = 2.40\times10^{-6}$ S. Not $1/\rho_{xx} = 10^4\ \mu$S: in strong fields the Hall resistivity dominates the denominator.`,
      trap: R`$\sigma_{xx} = 1/\rho_{xx}$ is wrong whenever $\rho_{xy} \ne 0$.` },
    { id: 'qhe-039', type: 'nat', level: 5, exams: ['net'], sub: 'quantum oscillations', unit: '× 10⁻⁵ T⁻¹',
      q: R`A metal has a spherical Fermi surface with $k_F = 1.00\times10^{10}$ m$^{-1}$. By Onsager's relation $\Delta(1/B) = 2\pi e/\hbar A_F$, where $A_F$ is the extremal cross-section, the de Haas-van Alphen period is ______ $\times10^{-5}$ T$^{-1}$ (two decimal places).`,
      answer: 3.04, tol: 0.01, calc: () => 2 * Math.PI * E / (HBAR * Math.PI * 1e20) / 1e-5,
      sol: R`$A_F = \pi k_F^2 = 3.142\times10^{20}$ m$^{-2}$. $\Delta(1/B) = 2\pi\times1.602\times10^{-19}/(1.0546\times10^{-34}\times3.142\times10^{20}) = 3.04\times10^{-5}$ T$^{-1}$: a frequency $1/\Delta = 3.3\times10^4$ T. Measuring periods for many field directions maps the whole Fermi surface.`,
      trap: 'Use the extremal cross-sectional area πkF², not the surface area 4πkF².' },
    { id: 'qhe-040', type: 'nat', level: 5, exams: ['net'], sub: 'filling factor', unit: 'T',
      q: R`A spin-degenerate 2D electron gas has $n_s = 4.0\times10^{15}$ m$^{-2}$. The $\nu = 2$ plateau is centred where exactly one spin-degenerate Landau level is full. That field is ______ T (two decimal places).`,
      answer: 8.27, tol: 0.02, calc: () => 4e15 * H / (2 * E),
      sol: R`One spin-degenerate level holds $2eB/h$. Setting $2eB/h = n_s$: $B = n_sh/2e = 4.0\times10^{15}\times6.626\times10^{-34}/(2\times1.602\times10^{-19}) = 8.27$ T.`,
      trap: 'At ν = 2 the field is half of the ν = 1 field, not double.' },
    { id: 'qhe-041', type: 'mcq', level: 5, exams: ['net'], sub: 'Landau levels',
      q: R`A clean 2D electron gas at fixed density and $T = 0$ has spin-degenerate Landau levels $\hbar\omega_c(n + \tfrac12)$. As $B$ is increased through the value where $\nu = 2$ (one level exactly full), the chemical potential`,
      options: [R`changes smoothly and linearly with $B$`, R`jumps up by $\hbar\omega_c$`, R`drops abruptly by $\hbar\omega_c$, from the $n = 1$ level to the $n = 0$ level`, R`stays fixed at $E_F(B = 0)$`], answer: 2,
      sol: R`Just below that field (more than one level's worth of electrons) a few electrons sit in $n = 1$, so $\mu = \tfrac32\hbar\omega_c$. As $B$ increases the levels hold more, the last electrons drop into $n = 0$, and once it is full and $n = 1$ empty $\mu$ falls to $\tfrac12\hbar\omega_c$. These jumps make the magnetisation saw-toothed: the de Haas-van Alphen effect in 2D.`,
      trap: 'Increasing B raises each level but increases its capacity, so electrons leave the upper level.' },
    { id: 'qhe-042', type: 'msq', level: 5, exams: ['gate', 'net'], sub: 'Landauer conductance', format: 'multi',
      q: 'Which statements about ballistic conductance in a narrow 2D constriction are correct?',
      options: [R`The conductance rises in steps of $2e^2/h$ as the constriction is widened.`, R`The steps exist only in a strong magnetic field.`, R`The resistance of a ballistic single-mode wire does not depend on its length.`, R`A perfect (reflectionless) single-mode wire still has resistance $h/2e^2$.`], answer: [0, 2, 3],
      sol: R`Each transverse mode below the Fermi energy carries current $(2e/h)\,e V$ (velocity times 1D density of states is $2/h$ per unit energy, spin included, independent of energy). Widening opens modes one at a time: steps of $2e^2/h$ at $B = 0$. With no scattering inside, the length does not matter; the resistance $h/2e^2$ per mode comes from the contacts.`,
      trap: 'The steps are seen at zero field (van Wees and Wharam, 1988); a field only modifies them.' },
    ...more2,
    ...r4.items,
  ],
  gens: [
    { id: 'qhe-g01', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'filling factor',
      make(r) {
        const n = pick(r, 1, 9, 0.1), B = pick(r, 1, 15, 0.5), nu = n * 1e15 / NB(B);
        return { q: R`A 2D electron gas has density $${n}\times10^{15}$ m$^{-2}$. Its filling factor $\nu = n_sh/eB$ at $B = ${B}$ T is ______ (two decimal places).`,
          answer: round(nu, 2), tol: Math.max(0.01, round(nu * 0.003, 3)), n, B,
          sol: R`$eB/h = ${round(NB(B) / 1e15, 4)}\times10^{15}$ m$^{-2}$, so $\nu = ${n}/${round(NB(B) / 1e15, 4)} = ${round(nu, 2)}$.`,
          trap: 'Use h, not ħ, in the filling factor.' };
      },
      verify: (p) => p.n * 1e15 / NB(p.B) },
    { id: 'qhe-g02', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'filling factor', unit: 'T',
      make(r) {
        const n = pick(r, 1, 9, 0.1), nu = choose(r, [1, 2, 3, 4, 6, 8, 1 / 3, 2 / 3, 2 / 5]), B = n * 1e15 * H / (E * nu);
        const lbl = { [1 / 3]: '1/3', [2 / 3]: '2/3', [2 / 5]: '2/5' }[nu] ?? String(nu);
        return { q: R`A 2D electron gas of density $${n}\times10^{15}$ m$^{-2}$ is at filling factor $\nu = ${lbl}$ (counting spin-resolved levels) when the field is ______ T (two decimal places).`,
          answer: round(B, 2), tol: Math.max(0.01, round(B * 0.003, 3)), n, nu,
          sol: R`$\nu = n_sh/eB$ gives $B = n_sh/(\nu e) = ${n}\times10^{15}\times4.1357\times10^{-15}/${round(nu, 4)} = ${round(B, 2)}$ T.`,
          trap: 'Smaller filling factor means larger field.' };
      },
      verify: (p) => p.n * 1e15 * H / (E * p.nu) },
    { id: 'qhe-g03', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'integer QHE',
      make(r) {
        const nu = choose(r, [1, 2, 3, 4, 5, 6, 8, 10]), mode = choose(r, ['R', 'V']);
        if (mode === 'R') return { q: R`The Hall resistance on the $\nu = ${nu}$ quantum Hall plateau is ______ $\Omega$ (nearest whole number).`, answer: Math.round(RK / nu), tol: 1, unit: 'Ω', nu, mode,
          sol: R`$R_{xy} = h/\nu e^2 = 25812.807/${nu} = ${round(RK / nu, 1)}\ \Omega$.`, trap: R`It is $h/e^2$ divided by $\nu$, not multiplied.` };
        const I = pick(r, 0.1, 10, 0.1), V = I * 1e-6 * RK / nu * 1000;
        return { q: R`A Hall bar on the $\nu = ${nu}$ plateau carries $${I}\ \mu$A. The Hall voltage is ______ mV (three decimal places).`, answer: round(V, 3), tol: Math.max(0.001, round(V * 0.002, 4)), unit: 'mV', nu, I, mode,
          sol: R`$V_H = I\,h/\nu e^2 = ${I}\times10^{-6}\times${round(RK / nu, 2)} = ${round(V, 3)}$ mV. No sample dimension enters.`, trap: 'No width or thickness: 2D Hall resistance is a pure number times h/e².' };
      },
      verify: (p) => (p.mode === 'R' ? RK / p.nu : p.I * 1e-6 * RK / p.nu * 1000) },
    { id: 'qhe-g04', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Landau levels',
      make(r) {
        const B = pick(r, 0.5, 30, 0.5), mode = choose(r, ['deg', 'l']);
        if (mode === 'deg') { const d = NB(B) / 1e14; return { q: R`How many states per unit area does one spin-resolved Landau level hold at $B = ${B}$ T? Answer in units of $10^{14}$ m$^{-2}$ (two decimal places).`, answer: round(d, 2), tol: Math.max(0.01, round(d * 0.003, 3)), unit: '× 10¹⁴ m⁻²', B, mode,
          sol: R`$eB/h = 1.602\times10^{-19}\times${B}/6.626\times10^{-34} = ${round(d, 2)}\times10^{14}$ m$^{-2}$: one state per flux quantum $h/e$.`, trap: 'The degeneracy is independent of the effective mass.' }; }
        const l = Math.sqrt(HBAR / (E * B)) * 1e9;
        return { q: R`The magnetic length $\ell_B = \sqrt{\hbar/eB}$ at $B = ${B}$ T is ______ nm (two decimal places).`, answer: round(l, 2), tol: Math.max(0.01, round(l * 0.003, 3)), unit: 'nm', B, mode,
          sol: R`$\ell_B = 25.656\text{ nm}/\sqrt{B[\text{T}]} = 25.656/\sqrt{${B}} = ${round(l, 2)}$ nm.`, trap: 'It scales as 1/√B.' };
      },
      verify: (p) => (p.mode === 'deg' ? NB(p.B) / 1e14 : Math.sqrt(HBAR / (E * p.B)) * 1e9) },
    { id: 'qhe-g05', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Landau levels', unit: 'meV',
      make(r) {
        const [mat, m] = choose(r, [['GaAs', 0.067], ['InAs', 0.023], ['InSb', 0.014], ['Si (in-plane mass of a (100) inversion layer)', 0.19], ['a ZnO heterostructure', 0.29], ['free electrons', 1]]);
        const B = pick(r, 1, 20, 0.5), Ec = HBAR * E * B / (m * ME) / E * 1000;
        return { q: R`Electrons in ${mat} have effective mass $${m}\,m_e$. Their cyclotron energy at $B = ${B}$ T is ______ meV (two decimal places).`,
          answer: round(Ec, 2), tol: Math.max(0.01, round(Ec * 0.003, 3)), m, B,
          sol: R`$\hbar\omega_c = \hbar eB/m^* = 0.11577\text{ meV/T}\times${B}/${m} = ${round(Ec, 2)}$ meV.`,
          trap: 'Light effective masses make the cyclotron gap large.' };
      },
      verify: (p) => HBAR * E * p.B / (p.m * ME) / E * 1000 },
    { id: 'qhe-g06', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'quantum oscillations',
      make(r) {
        const spin = choose(r, [1, 2]), mode = choose(r, ['n', 'P']);
        if (mode === 'n') { const P = pick(r, 0.01, 0.2, 0.005), n = spin * E / (H * P) / 1e15; return { q: R`Shubnikov-de Haas minima of a 2D electron gas are periodic in $1/B$ with period $${P}$ T$^{-1}$. ${spin === 2 ? 'The Landau levels are spin-degenerate.' : 'The spin splitting is fully resolved, so every integer ν gives a minimum.'} The density is ______ $\times10^{15}$ m$^{-2}$ (two decimal places).`, answer: round(n, 2), tol: Math.max(0.01, round(n * 0.003, 3)), unit: '× 10¹⁵ m⁻²', spin, P, mode,
          sol: R`Each minimum adds one level of $${spin === 2 ? '2' : ''}eB/h$ states: $\Delta(1/B) = ${spin === 2 ? '2' : ''}e/hn_s$, so $n_s = ${spin === 2 ? '2' : ''}e/(h\Delta) = ${round(n, 2)}\times10^{15}$ m$^{-2}$.`, trap: 'Spin-degenerate levels hold twice as many states, doubling the density for the same period.' }; }
        const n = pick(r, 0.5, 10, 0.1), P = spin * E / (H * n * 1e15);
        return { q: R`A 2D electron gas has density $${n}\times10^{15}$ m$^{-2}$ and ${spin === 2 ? 'spin-degenerate' : 'fully spin-resolved'} Landau levels. The period of its Shubnikov-de Haas oscillations in $1/B$ is ______ T$^{-1}$ (four decimal places).`, answer: round(P, 4), tol: Math.max(0.0001, round(P * 0.003, 5)), unit: 'T⁻¹', spin, n, mode,
          sol: R`$\Delta(1/B) = ${spin === 2 ? '2' : ''}e/hn_s = ${spin === 2 ? '2\\times' : ''}1.602\times10^{-19}/(6.626\times10^{-34}\times${n}\times10^{15}) = ${round(P, 4)}$ T$^{-1}$.`, trap: 'Higher density, shorter period in 1/B.' };
      },
      verify: (p) => (p.mode === 'n' ? p.spin * E / (H * p.P) / 1e15 : p.spin * E / (H * p.n * 1e15)) },
    { id: 'qhe-g07', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'quantum wells', unit: 'meV',
      make(r) {
        const [mat, m] = choose(r, [['GaAs', 0.067], ['InAs', 0.023], ['Si', 0.19], ['InP', 0.08]]), L = pick(r, m < 0.05 ? 15 : 6, 30, 1), mode = choose(r, ['E1', 'E21', 'E31']);
        const E1 = Math.PI ** 2 * HBAR ** 2 / (2 * m * ME * (L * 1e-9) ** 2) / E * 1000, f = mode === 'E1' ? 1 : mode === 'E21' ? 3 : 8;
        const what = mode === 'E1' ? 'the ground-state confinement energy' : mode === 'E21' ? R`the intersubband transition energy $E_2 - E_1$` : R`the energy $E_3 - E_1$`;
        return { q: R`Electrons in ${mat} ($m^* = ${m}\,m_e$) are confined in an infinitely deep well $${L}$ nm wide. Find ${what}, in meV (two decimal places).`,
          answer: round(E1 * f, 2), tol: Math.max(0.01, round(E1 * f * 0.003, 3)), m, L, f,
          sol: R`$E_n = n^2\pi^2\hbar^2/2m^*L^2$, so $E_1 = ${round(E1, 3)}$ meV${f === 1 ? '' : R` and the required energy is $${f}E_1 = ${round(E1 * f, 2)}$ meV`}.`,
          trap: R`$E_n\propto n^2$: $E_2 - E_1 = 3E_1$ and $E_3 - E_1 = 8E_1$.` };
      },
      verify: (p) => p.f * Math.PI ** 2 * HBAR ** 2 / (2 * p.m * ME * (p.L * 1e-9) ** 2) / E * 1000 },
    { id: 'qhe-g08', type: 'nat', level: 3, exams: ['gate', 'net'], sub: '2D electron gas',
      make(r) {
        const m = choose(r, [0.067, 0.023, 0.19, 0.1]), mode = choose(r, ['EF', 'n']);
        if (mode === 'EF') { const n = pick(r, 0.5, 10, 0.1), Ef = Math.PI * HBAR ** 2 * n * 1e15 / (m * ME) / E * 1000; return { q: R`A spin-degenerate 2D electron gas ($m^* = ${m}\,m_e$, one subband) has density $${n}\times10^{15}$ m$^{-2}$. Its Fermi energy above the subband bottom is ______ meV (two decimal places).`, answer: round(Ef, 2), tol: Math.max(0.01, round(Ef * 0.003, 3)), unit: 'meV', m, n, mode,
          sol: R`$E_F = \pi\hbar^2n_s/m^* = ${round(Ef, 2)}$ meV (2D density of states $m^*/\pi\hbar^2$, constant).`, trap: 'In 2D, EF is proportional to n (not n^{2/3}).' }; }
        const Ef = pick(r, 2, 40, 0.5), n = Ef / 1000 * E * m * ME / (Math.PI * HBAR ** 2) / 1e15;
        return { q: R`A spin-degenerate 2D electron gas ($m^* = ${m}\,m_e$) has its Fermi level $${Ef}$ meV above the bottom of its only occupied subband. Its density is ______ $\times10^{15}$ m$^{-2}$ (three decimal places).`, answer: round(n, 3), tol: Math.max(0.001, round(n * 0.003, 4)), unit: '× 10¹⁵ m⁻²', m, Ef, mode,
          sol: R`$n_s = (m^*/\pi\hbar^2)E_F = ${round(n, 3)}\times10^{15}$ m$^{-2}$.`, trap: R`The 2D density of states with spin is $m^*/\pi\hbar^2$, not $m^*/2\pi\hbar^2$.` };
      },
      verify: (p) => (p.mode === 'EF' ? Math.PI * HBAR ** 2 * p.n * 1e15 / (p.m * ME) / E * 1000 : p.Ef / 1000 * E * p.m * ME / (Math.PI * HBAR ** 2) / 1e15) },
    { id: 'qhe-g09', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Landauer conductance',
      make(r) {
        const N = int(r, 1, 8), Tn = choose(r, [1, 1, 0.9, 0.8, 0.5]), mode = choose(r, ['G', 'R']);
        const G = 2 * N * Tn / RK;
        if (mode === 'G') return { q: R`A quantum point contact has ${N} open spin-degenerate mode${N > 1 ? 's' : ''}, each with transmission $${Tn}$. Its conductance is ______ $\mu$S (two decimal places).`, answer: round(G * 1e6, 2), tol: Math.max(0.01, round(G * 1e6 * 0.002, 3)), unit: 'μS', N, Tn, mode,
          sol: R`$G = \dfrac{2e^2}h\sum T_n = 77.48\ \mu\text{S}\times${N}\times${Tn} = ${round(G * 1e6, 2)}\ \mu$S.`, trap: 'The conductance quantum is 2e²/h = 77.48 μS with spin.' };
        return { q: R`A quantum point contact has ${N} open spin-degenerate mode${N > 1 ? 's' : ''}, each with transmission $${Tn}$. Its two-terminal resistance is ______ k$\Omega$ (three decimal places).`, answer: round(1 / G / 1000, 3), tol: Math.max(0.001, round(1 / G / 1000 * 0.002, 4)), unit: 'kΩ', N, Tn, mode,
          sol: R`$R = \dfrac h{2e^2\sum T_n} = \dfrac{12.906\text{ k}\Omega}{${N}\times${Tn}} = ${round(1 / G / 1000, 3)}$ k$\Omega$.`, trap: 'h/2e² = 12.906 kΩ per perfect spin-degenerate mode.' };
      },
      verify: (p) => { const G = 2 * p.N * p.Tn / RK; return p.mode === 'G' ? G * 1e6 : 1 / G / 1000; } },
    { id: 'qhe-g10', type: 'nat', level: 4, exams: ['net'], sub: 'conductivity tensor', unit: 'μS',
      make(r) {
        const rxx = pick(r, 0, 2000, 10), rxy = pick(r, 2000, 26000, 50), part = choose(r, ['xx', 'xy']);
        const D = rxx * rxx + rxy * rxy, v = (part === 'xx' ? rxx : rxy) / D * 1e6;
        return { q: R`A 2D conductor in a perpendicular field has $\rho_{xx} = ${rxx}\ \Omega$ and $\rho_{xy} = ${rxy}\ \Omega$. Find ${part === 'xx' ? R`$\sigma_{xx}$` : R`$|\sigma_{xy}|$`} in $\mu$S (three decimal places).`,
          answer: round(v, 3), tol: Math.max(0.001, round(v * 0.002, 4)), rxx, rxy, part,
          sol: R`Invert the tensor: $\sigma_{xx} = \rho_{xx}/(\rho_{xx}^2 + \rho_{xy}^2)$ and $|\sigma_{xy}| = \rho_{xy}/(\rho_{xx}^2 + \rho_{xy}^2)$. Here $\rho_{xx}^2 + \rho_{xy}^2 = ${D}\ \Omega^2$, so the answer is $${part === 'xx' ? rxx : rxy}/${D} = ${round(v, 3)}\ \mu$S.${rxx === 0 ? ' With ρxx = 0, σxx = 0 too.' : ''}`,
          trap: R`$1/\rho$ for each component is wrong whenever the field mixes the directions.` };
      },
      verify: (p) => (p.part === 'xx' ? p.rxx : p.rxy) / (p.rxx ** 2 + p.rxy ** 2) * 1e6 },
    { id: 'qhe-g11', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'graphene',
      make(r) {
        const sys = choose(r, ['graphene', 'gaas', 'bilayer']);
        const right = { graphene: R`$\pm2, \pm6, \pm10, \pm14, \dots$`, gaas: R`$1, 2, 3, 4, \dots$ (odd ones weaker unless spin splitting is resolved)`, bilayer: R`$\pm4, \pm8, \pm12, \dots$ (with the step across zero doubled)` }[sys];
        const name = { graphene: 'monolayer graphene (massless Dirac electrons, 4-fold spin and valley degeneracy)', gaas: 'a GaAs 2D electron gas (one valley, small but non-zero spin splitting)', bilayer: 'Bernal-stacked bilayer graphene (massive chiral electrons, 4-fold degeneracy, Berry phase 2π)' }[sys];
        const o = mcqOptions(r, right, [R`$\pm2, \pm6, \pm10, \pm14, \dots$`, R`$1, 2, 3, 4, \dots$ (odd ones weaker unless spin splitting is resolved)`, R`$\pm4, \pm8, \pm12, \dots$ (with the step across zero doubled)`, R`$\pm1, \pm3, \pm5, \dots$ only`].filter((x) => x !== right));
        return { q: `In ${name}, the quantum Hall plateaus of σxy (in units of e²/h) occur at`, ...o,
          sol: { graphene: R`Dirac Landau levels $\pm v_F\sqrt{2e\hbar B|n|}$ include a zero-energy level shared by electrons and holes; with degeneracy 4, $\sigma_{xy} = \pm4(N + \tfrac12)$.`, gaas: R`Ordinary Landau levels $\hbar\omega_c(n + \tfrac12)$, each split weakly by spin: every integer appears, the even ones (cyclotron gaps) strongest.`, bilayer: R`Bilayer levels $\pm\hbar\omega_c\sqrt{n(n - 1)}$ make $n = 0$ and $n = 1$ both sit at zero energy, an 8-fold level: steps of 4 with a double step of 8 across neutrality, so plateaus at $\pm4, \pm8, \dots$ and none at 0.` }[sys],
          trap: 'The zero-energy Landau level, shared by electrons and holes, shifts graphene\'s sequence by half a step.' };
      } },
    { id: 'qhe-g12', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Coulomb blockade',
      make(r) {
        const Caf = pick(r, 0.2, 20, 0.1), mode = choose(r, ['E', 'T']), Ec = E / (2 * Caf * 1e-18) * 1000;
        if (mode === 'E') return { q: R`A quantum dot has total capacitance $${Caf}$ aF. Its charging energy $e^2/2C$ is ______ meV (two decimal places).`, answer: round(Ec, 2), tol: Math.max(0.01, round(Ec * 0.003, 3)), unit: 'meV', Caf, mode,
          sol: R`$e^2/2C = (1.602\times10^{-19})^2/(2\times${Caf}\times10^{-18})$ J $= ${round(Ec, 2)}$ meV.`, trap: 'Smaller islands have smaller C and larger charging energy.' };
        const T = Ec / 1000 / 8.617333e-5 / 10;
        return { q: R`A metallic island has total capacitance $${Caf}$ aF. Taking "clear Coulomb blockade" to need $k_BT < (e^2/2C)/10$, the highest usable temperature is ______ K (one decimal place).`, answer: round(T, 1), tol: Math.max(0.1, round(T * 0.003, 2)), unit: 'K', Caf, mode,
          sol: R`$e^2/2C = ${round(Ec, 3)}$ meV; a tenth of it is ${round(Ec / 10, 4)} meV, and dividing by $k_B = 0.08617$ meV/K gives $T = ${round(T, 1)}$ K.`, trap: 'Convert meV to kelvin with kB = 0.08617 meV/K.' };
      },
      verify: (p) => { const Ec = E / (2 * p.Caf * 1e-18) * 1000; return p.mode === 'E' ? Ec : Ec / 1000 / 8.617333e-5 / 10; } },
    ...more,
    ...r4.gens,
  ],
};
