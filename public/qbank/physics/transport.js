// Kinetic theory of transport, NET depth: free-path statistics and collision rates, viscosity, thermal conductivity
// and diffusion from momentum, energy and particle flux, pressure and temperature dependence, Chapman-Enskog
// coefficients, the Eucken ratio, Prandtl and Schmidt numbers, the Knudsen regime and thermal transpiration, the
// Boltzmann equation in the relaxation-time approximation, Drude transport, Wiedemann-Franz, Matthiessen's rule,
// phonon conduction, heat diffusion and Onsager reciprocity.
// (Basic mean free path and the elementary eta = n m v lambda / 3 are in kinetic-theory.)
// Original questions (fibub) for CSIR NET Part C and GATE. Levels: 1 warm-up ... 5 top rank.
import { pick, int, choose, mcqOptions, round, C } from '../_util.js';
import more from './transport.more.gen.js';
import more2 from './transport.more2.gen.js';

const PI = Math.PI, KB = C.kB, U = C.u, E = C.e, ME = C.me;
const L0 = PI * PI / 3 * (KB / E) ** 2;                            // Sommerfeld Lorenz number
const etaCE = (mU, d, T) => 5 / 16 / (d * d) * Math.sqrt(mU * U * KB * T / PI); // hard-sphere Chapman-Enskog viscosity

export default {
  topic: 'transport',
  items: [
    // ---------- level 1 ----------
    { id: 'nettr-001', type: 'nat', level: 1, exams: ['gate', 'net'], sub: 'free paths',
      q: 'Molecules in a gas have mean free path $\\lambda$. The fraction of molecules that travel at least $2\\lambda$ without a collision is ______ (to three decimal places).',
      answer: 0.135, tol: 0.001, calc: () => Math.exp(-2),
      sol: 'Collisions are random with probability $dx/\\lambda$ per length, so the survival probability obeys $dP/dx = -P/\\lambda$, $P(x) = e^{-x/\\lambda}$. $P(2\\lambda) = e^{-2} = 0.135$. The mean of this distribution is $\\lambda$.' },
    { id: 'nettr-002', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'transport coefficients',
      q: 'Viscosity, thermal conductivity and diffusion in a dilute gas describe the transport of, respectively,',
      options: ['energy, momentum and mass', 'momentum, energy and particles', 'particles, energy and momentum', 'charge, energy and momentum'], answer: 1,
      sol: 'Viscosity: flux of $x$-momentum down a gradient of flow velocity $u_x(z)$, $P_{xz} = -\\eta\\,du_x/dz$. Thermal conduction: energy flux $q = -\\kappa\\,dT/dz$. Diffusion: particle flux $J = -D\\,dn/dz$. In each case molecules carry the property about one mean free path.' },
    { id: 'nettr-003', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'pressure dependence',
      q: 'Maxwell predicted, to his own surprise, that the viscosity of a dilute gas at fixed temperature',
      options: ['is proportional to the pressure', 'is inversely proportional to the pressure', 'is independent of the pressure', 'vanishes at low pressure'], answer: 2,
      sol: '$\\eta\\sim\\tfrac13nm\\bar v\\lambda$ with $\\lambda = 1/\\sqrt2n\\sigma$: the density cancels. More molecules carry momentum, but each carries it a proportionally shorter distance. This holds until $\\lambda$ becomes comparable with the container size (the Knudsen regime).' },
    { id: 'nettr-004', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'temperature dependence',
      q: 'For a hard-sphere gas, the viscosity varies with temperature as',
      options: ['$T^{1/2}$', '$T^{-1/2}$', '$T$', '$T^{3/2}$'], answer: 0,
      sol: '$\\eta\\propto m\\bar v/\\sigma\\propto\\sqrt{mT}/d^2$, independent of density. So gases, unlike liquids, become more viscous when heated. Real gases rise faster (about $T^{0.7}$) because the effective cross-section shrinks at higher energy (Sutherland).',
      trap: 'Liquid viscosity falls with temperature; do not carry that intuition to gases.' },
    { id: 'nettr-005', type: 'nat', level: 1, exams: ['gate', 'net'], sub: 'temperature dependence',
      q: 'A hard-sphere gas has viscosity $\\eta_0$ at 300 K. At 1200 K and the same pressure its viscosity is ______ $\\eta_0$.',
      answer: 2, tol: 0.01, calc: () => Math.sqrt(1200 / 300),
      sol: '$\\eta\\propto\\sqrt T$ (independent of pressure): $\\sqrt{1200/300} = 2$.' },
    { id: 'nettr-006', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'Drude model',
      q: 'In the Drude model with collision time $\\tau$, the dc electrical conductivity of a metal with electron density $n$ is',
      options: ['$\\sigma = \\dfrac{ne\\tau}{m}$', '$\\sigma = \\dfrac{m}{ne^2\\tau}$', '$\\sigma = \\dfrac{ne^2}{m\\tau}$', '$\\sigma = \\dfrac{ne^2\\tau}{m}$'], answer: 3,
      sol: 'In a field $E$ each electron gains drift velocity $v_d = -eE\\tau/m$ between collisions. Current density $j = -nev_d = (ne^2\\tau/m)E$. The mobility is $\\mu = e\\tau/m$ and $\\sigma = ne\\mu$.' },

    // ---------- level 2 ----------
    { id: 'nettr-007', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'free paths',
      q: 'Within what distance, in units of the mean free path, have half of the molecules made their next collision? Answer to three decimal places.',
      answer: 0.693, tol: 0.001, calc: () => Math.log(2),
      sol: '$e^{-x/\\lambda} = \\tfrac12$ gives $x = \\lambda\\ln2 = 0.693\\lambda$: the median free path is shorter than the mean, because the distribution has a long tail.' },
    { id: 'nettr-008', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Knudsen regime',
      q: 'Nitrogen ($d = 3.7\\times10^{-10}$ m) is at 300 K and 1.0 Pa. Its mean free path $\\lambda = kT/\\sqrt2\\pi d^2P$ is ______ mm (to one decimal place).',
      answer: 6.8, tol: 0.05, calc: () => KB * 300 / (Math.SQRT2 * PI * (3.7e-10) ** 2 * 1) * 1e3,
      sol: '$\\lambda = \\dfrac{4.142\\times10^{-21}}{1.414\\times\\pi\\times1.369\\times10^{-19}\\times1.0} = \\dfrac{4.142\\times10^{-21}}{6.08\\times10^{-19}} = 6.8\\times10^{-3}$ m. In a vacuum gauge of centimetre size this is the transition region, where heat conduction starts to depend on pressure (the basis of Pirani gauges).' },
    { id: 'nettr-009', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'Knudsen regime',
      q: 'When the mean free path is much longer than the distance $L$ between two plates (Knudsen regime), the heat conducted between them by the gas is',
      options: ['proportional to the pressure', 'independent of the pressure, as at high pressure', 'inversely proportional to the pressure', 'zero'], answer: 0,
      sol: 'Molecules now fly straight from plate to plate, so each carries energy across the whole gap and the flux is $\\propto$ (number hitting the plates) $\\propto n\\propto P$. The pressure independence of $\\kappa$ needs $\\lambda\\ll L$. Dewar flasks exploit the Knudsen regime: pumping lowers $P$ until conduction becomes negligible.' },
    { id: 'nettr-010', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Wiedemann-Franz',
      q: 'The Sommerfeld value of the Lorenz number is $L = \\dfrac{\\pi^2}{3}\\left(\\dfrac{k}{e}\\right)^2$. Its value is ______ $\\times10^{-8}$ W $\\Omega$ K$^{-2}$ (to two decimal places).',
      answer: 2.44, tol: 0.01, calc: () => L0 * 1e8,
      sol: '$k/e = 8.617\\times10^{-5}$ V/K, $(k/e)^2 = 7.43\\times10^{-9}$ V$^2$/K$^2$, times $\\pi^2/3 = 3.290$: $2.44\\times10^{-8}$ W $\\Omega$ K$^{-2}$. Then $\\kappa/\\sigma T = L$ for any metal where the same collisions limit both currents (elastic scattering).' },
    { id: 'nettr-011', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Wiedemann-Franz',
      q: 'Copper has $\\sigma = 5.96\\times10^7$ S/m at 300 K. Using the Wiedemann-Franz law with $L = 2.443\\times10^{-8}$ W $\\Omega$ K$^{-2}$, its electronic thermal conductivity is ______ W m$^{-1}$K$^{-1}$ (to the nearest whole number).',
      answer: 437, tol: 1, calc: () => 2.443e-8 * 5.96e7 * 300,
      sol: '$\\kappa = L\\sigma T = 2.443\\times10^{-8}\\times5.96\\times10^7\\times300 = 437$ W m$^{-1}$K$^{-1}$, close to the measured 401. In metals electrons dominate heat conduction; phonons add only a few percent.' },
    { id: 'nettr-012', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'mass dependence',
      q: 'Helium and argon atoms are taken to have the same collision diameter. At the same temperature, the ratio of their thermal conductivities $\\kappa_{He}/\\kappa_{Ar}$ is about ($m_{Ar}/m_{He} = 10$)',
      options: ['1', '$\\sqrt{10}\\approx3.2$', '10', '$1/\\sqrt{10}$'], answer: 1,
      sol: '$\\kappa\\sim\\tfrac13nc_v\\bar v\\lambda$ with $c_v = \\tfrac32k$ per atom for both and $n\\lambda$ the same; only $\\bar v\\propto m^{-1/2}$ differs. Ratio $= \\sqrt{m_{Ar}/m_{He}} = \\sqrt{10} = 3.2$. Light gases conduct heat well, which is why helium is used as a heat-exchange gas.' },
    { id: 'nettr-013', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'transport coefficients',
      q: 'For a dilute hard-sphere gas, which statements are correct?',
      options: ['$\\eta$ and $\\kappa$ are independent of pressure (while $\\lambda\\ll$ container size)', 'The self-diffusion constant $D$ is inversely proportional to pressure at fixed $T$', '$\\kappa/\\eta$ is proportional to the specific heat per unit mass', 'All three coefficients fall as the temperature rises'], answer: [0, 1, 2],
      sol: '$\\eta\\propto m\\bar v\\lambda n$ and $\\kappa\\propto c_v\\bar v\\lambda n$ contain $n\\lambda$ = const, but $D\\sim\\tfrac13\\bar v\\lambda\\propto1/n\\propto1/P$. Their ratio $\\kappa/\\eta\\propto c_v/m$. All three grow with $T$: $\\eta, \\kappa\\propto T^{1/2}$ and $D\\propto T^{3/2}/P$.' },
    { id: 'nettr-014', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Drude model',
      q: 'Copper has $n = 8.49\\times10^{28}$ m$^{-3}$ free electrons and $\\sigma = 5.96\\times10^7$ S/m. The Drude collision time $\\tau = m\\sigma/ne^2$ is ______ $\\times10^{-14}$ s (to two decimal places).',
      answer: 2.49, tol: 0.01, calc: () => ME * 5.96e7 / (8.49e28 * E * E) * 1e14,
      sol: '$\\tau = \\dfrac{9.109\\times10^{-31}\\times5.96\\times10^7}{8.49\\times10^{28}\\times2.567\\times10^{-38}} = \\dfrac{5.43\\times10^{-23}}{2.18\\times10^{-9}} = 2.49\\times10^{-14}$ s.' },
    { id: 'nettr-015', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'Matthiessen\'s rule',
      q: 'Electrons in a metal scatter independently from impurities (time $\\tau_i$) and phonons (time $\\tau_p$). Matthiessen\'s rule states that',
      options: ['$\\tau = \\tau_i + \\tau_p$', '$\\rho = \\rho_i\\rho_p/(\\rho_i + \\rho_p)$', '$1/\\tau = 1/\\tau_i + 1/\\tau_p$, so resistivities add: $\\rho = \\rho_i + \\rho_p(T)$', 'only the larger scattering rate matters'], answer: 2,
      sol: 'Independent processes add their rates. Since $\\rho = m/ne^2\\tau$, the resistivities add: a temperature-independent residual part from impurities plus a phonon part ($\\propto T$ at high $T$, $T^5$ at low $T$). The residual resistivity ratio $\\rho(300\\text{ K})/\\rho(4\\text{ K})$ measures purity.' },
    { id: 'nettr-016', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Prandtl number',
      q: 'The Prandtl number $\\text{Pr} = c_p\\eta/\\kappa$ (specific heats per unit mass). For a monatomic gas with the Chapman-Enskog result $\\kappa = \\tfrac52c_v\\eta$, Pr is ______ (to three decimal places).',
      answer: 0.667, tol: 0.001, calc: () => (5 / 3) / 2.5,
      sol: 'For a monatomic gas $c_p/c_v = 5/3$, so $\\text{Pr} = \\dfrac{c_p\\eta}{\\tfrac52c_v\\eta} = \\dfrac{5/3}{5/2} = \\dfrac23$. Measured values for noble gases are 0.66 to 0.67. Pr compares momentum diffusion with heat diffusion.' },

    // ---------- level 3 ----------
    { id: 'nettr-017', type: 'nat', level: 3, exams: ['net'], sub: 'Chapman-Enskog',
      q: 'For hard spheres the Chapman-Enskog viscosity is $\\eta = \\dfrac{5}{16d^2}\\sqrt{\\dfrac{mkT}{\\pi}}$. For argon ($m = 39.95$ u, $d = 3.6\\times10^{-10}$ m) at 300 K, $\\eta$ is ______ $\\times10^{-5}$ Pa s (to two decimal places).',
      answer: 2.25, tol: 0.01, calc: () => etaCE(39.948, 3.6e-10, 300) * 1e5,
      sol: '$mkT/\\pi = 6.634\\times10^{-26}\\times4.142\\times10^{-21}/\\pi = 8.75\\times10^{-47}$, square root $9.35\\times10^{-24}$. Divide by $d^2 = 1.296\\times10^{-19}$: $7.22\\times10^{-5}$; times $5/16$: $2.25\\times10^{-5}$ Pa s (measured 2.27).' },
    { id: 'nettr-018', type: 'nat', level: 3, exams: ['net'], sub: 'Chapman-Enskog',
      q: 'The elementary mean-free-path estimate gives $\\eta = \\tfrac13nm\\bar v\\lambda = \\dfrac{2}{3\\pi d^2}\\sqrt{\\dfrac{mkT}{\\pi}}$. The rigorous hard-sphere value has $5/16$ in place of $2/3\\pi$. The ratio rigorous/elementary is ______ (to three decimal places).',
      answer: 1.473, tol: 0.002, calc: () => (5 / 16) / (2 / (3 * PI)),
      sol: 'With $\\bar v = \\sqrt{8kT/\\pi m}$ and $\\lambda = 1/\\sqrt2\\pi d^2n$: $\\tfrac13nm\\bar v\\lambda = \\dfrac{m}{3\\sqrt2\\pi d^2}\\sqrt{\\dfrac{8kT}{\\pi m}} = \\dfrac{2}{3\\pi d^2}\\sqrt{\\dfrac{mkT}{\\pi}}$ (coefficient 0.2122). $0.3125/0.2122 = 1.473$. The simple model misses persistence of velocity after collisions and the speed-weighting of the flux.' },
    { id: 'nettr-019', type: 'nat', level: 3, exams: ['net'], sub: 'Eucken ratio',
      q: 'For a monatomic gas, $\\kappa = \\dfrac{15}{4}\\dfrac{k}{m}\\eta$ (Chapman-Enskog). Argon has $\\eta = 2.27\\times10^{-5}$ Pa s at 300 K and $m = 6.634\\times10^{-26}$ kg. Its thermal conductivity is ______ W m$^{-1}$K$^{-1}$ (to four decimal places).',
      answer: 0.0177, tol: 0.0002, calc: () => 15 / 4 * KB / 6.634e-26 * 2.27e-5,
      sol: '$k/m = 1.381\\times10^{-23}/6.634\\times10^{-26} = 208.1$ J kg$^{-1}$K$^{-1}$. $\\kappa = 3.75\\times208.1\\times2.27\\times10^{-5} = 0.0177$ W m$^{-1}$K$^{-1}$ (measured 0.0177). Since $c_v = \\tfrac32k/m$, this is $\\kappa = \\tfrac52c_v\\eta$: the Eucken factor 5/2.' },
    { id: 'nettr-020', type: 'mcq', level: 3, exams: ['net'], sub: 'Eucken ratio',
      q: 'The Eucken factor $f = \\kappa/\\eta c_v$ is 1 in the elementary theory but 5/2 for a monatomic gas in the rigorous theory. The physical reason it exceeds 1 is that',
      options: ['heat is carried by photons as well', 'faster molecules carry more energy and also have longer free paths, so energy is transported more efficiently than momentum', 'the specific heat is larger in a temperature gradient', 'molecules exchange no energy in collisions'], answer: 1,
      sol: 'In a temperature gradient the molecules crossing a plane from the hot side are biased towards high speeds, which carry more kinetic energy per molecule and travel farther between collisions. Momentum transport lacks this extra speed weighting. For polyatomic gases internal energy diffuses less efficiently, and $f$ drops towards about 1.3 to 2 (Eucken correction).' },
    { id: 'nettr-021', type: 'nat', level: 3, exams: ['net'], sub: 'thermal transpiration',
      q: 'Two vessels at 300 K and 77 K are joined by a tube much narrower than the mean free path. In the steady state, the ratio of pressures $P_{300}/P_{77}$ is ______ (to two decimal places).',
      answer: 1.97, tol: 0.01, calc: () => Math.sqrt(300 / 77),
      sol: 'In the Knudsen regime the flows through the tube are effusive, $\\propto n\\bar v\\propto P/\\sqrt T$ in each direction. Zero net flow: $P_1/\\sqrt{T_1} = P_2/\\sqrt{T_2}$, so $P_1/P_2 = \\sqrt{300/77} = 1.97$. A pressure gauge at room temperature therefore misreads the pressure in a cryostat by this factor at low pressure.',
      trap: 'At high pressure (narrow tube no longer Knudsen) the pressures are simply equal.' },
    { id: 'nettr-022', type: 'nat', level: 3, exams: ['net'], sub: 'Drude model',
      q: 'With $\\tau = 2.49\\times10^{-14}$ s and Fermi velocity $1.57\\times10^6$ m/s, the electron mean free path in copper at room temperature is ______ nm (to the nearest whole number).',
      answer: 39, tol: 1, calc: () => 1.57e6 * 2.49e-14 * 1e9,
      sol: 'Only electrons near the Fermi surface carry current, at speed $v_F$: $\\lambda = v_F\\tau = 1.57\\times10^6\\times2.49\\times10^{-14} = 3.9\\times10^{-8}$ m = 39 nm, about 150 lattice spacings. Drude\'s classical thermal speed ($\\sim10^5$ m/s) gave a misleadingly short path of a few Å.' },
    { id: 'nettr-023', type: 'mcq', level: 3, exams: ['net'], sub: 'Boltzmann equation',
      q: 'In the relaxation-time approximation the Boltzmann equation is $\\dfrac{\\partial f}{\\partial t} + \\vec v\\cdot\\nabla_rf + \\dfrac{\\vec F}{m}\\cdot\\nabla_vf = -\\dfrac{f - f_0}{\\tau}$. For a uniform system in a weak steady field $\\vec E$ (charge $q$), the first-order solution is',
      options: ['$f = f_0 - \\dfrac{q\\tau}{m}\\vec E\\cdot\\nabla_vf_0$', '$f = f_0$ exactly', '$f = f_0e^{-t/\\tau}$', '$f = f_0 + \\tau\\,\\vec v\\cdot\\nabla_rf_0$'], answer: 0,
      sol: 'Steady and uniform: $\\dfrac{q\\vec E}{m}\\cdot\\nabla_vf = -(f - f_0)/\\tau$. To first order replace $f$ by $f_0$ on the left: $f = f_0 - \\dfrac{q\\tau}{m}\\vec E\\cdot\\nabla_vf_0\\approx f_0(\\vec v - q\\tau\\vec E/m)$, a distribution shifted by the drift velocity. Integrating $q\\vec vf$ gives $\\sigma = nq^2\\tau/m$.' },
    { id: 'nettr-024', type: 'msq', level: 3, exams: ['net'], sub: 'Wiedemann-Franz',
      q: 'Which statements about the Lorenz number $\\kappa/\\sigma T$ are correct?',
      options: ['Classical Drude theory with Maxwell-Boltzmann electrons gives $\\tfrac32(k/e)^2$, about half the observed value', 'The Sommerfeld (Fermi-Dirac) theory gives $\\tfrac{\\pi^2}3(k/e)^2$', 'The law fails at intermediate temperatures, where small-angle phonon scattering degrades heat current more than charge current', 'It holds for insulators as well, since phonons carry both charge and heat'], answer: [0, 1, 2],
      sol: 'Drude made two compensating errors (a classical specific heat 100 times too large and a mean square speed 100 times too small) and still got $1.5(k/e)^2 = 1.11\\times10^{-8}$. Sommerfeld\'s degenerate gas gives $2.44\\times10^{-8}$. The law needs elastic scattering; inelastic small-angle phonon scattering at $T\\sim\\Theta_D/5$ lowers $L$. Phonons carry no charge.' },
    { id: 'nettr-025', type: 'nat', level: 3, exams: ['net'], sub: 'Drude model',
      q: 'For the copper electrons with $\\tau = 2.49\\times10^{-14}$ s, the mobility $\\mu = e\\tau/m$ is ______ cm$^2$ V$^{-1}$s$^{-1}$ (to one decimal place).',
      answer: 43.8, tol: 0.1, calc: () => E * 2.49e-14 / ME * 1e4,
      sol: '$\\mu = \\dfrac{1.602\\times10^{-19}\\times2.49\\times10^{-14}}{9.109\\times10^{-31}} = 4.38\\times10^{-3}$ m$^2$/V s $= 43.8$ cm$^2$/V s. Metals have modest mobility but enormous carrier density; good semiconductors reach $10^3$ to $10^5$ cm$^2$/V s.' },
    { id: 'nettr-026', type: 'mcq', level: 3, exams: ['net'], sub: 'Onsager reciprocity',
      q: 'For coupled flows $J_i = \\sum_jL_{ij}X_j$ (e.g. heat and charge in a thermoelectric), Onsager\'s reciprocal relations state that',
      options: ['$L_{ij} = 0$ for $i \\ne j$', '$L_{ii} < 0$', '$L_{ij} = -L_{ji}$', '$L_{ij} = L_{ji}$ (with no magnetic field), a consequence of microscopic time-reversal symmetry'], answer: 3,
      sol: 'With properly chosen forces (conjugate to the fluxes in the entropy production), $L_{ij} = L_{ji}$; in a magnetic field $L_{ij}(\\vec B) = L_{ji}(-\\vec B)$. The Kelvin relation $\\Pi = ST$ between Peltier and Seebeck coefficients is an example. Positive entropy production requires the $L_{ii} > 0$.' },
    { id: 'nettr-027', type: 'nat', level: 3, exams: ['net'], sub: 'heat diffusion',
      q: 'A copper bar has thermal diffusivity $\\alpha = \\kappa/\\rho c = 1.1\\times10^{-4}$ m$^2$/s. A temperature disturbance diffuses a distance $L$ in a time of order $L^2/\\alpha$. For $L = 10$ cm this time is about ______ s (to the nearest whole number).',
      answer: 91, tol: 1, calc: () => 0.01 / 1.1e-4,
      sol: 'The heat equation $\\partial_tT = \\alpha\\nabla^2T$ has the same form as the diffusion equation, so the time scale is $L^2/\\alpha = 0.01/1.1\\times10^{-4} = 91$ s. Doubling the length quadruples the time.' },
    { id: 'nettr-028', type: 'nat', level: 3, exams: ['net'], sub: 'Schmidt number',
      q: 'The Chapman-Enskog hard-sphere theory gives $\\rho D/\\eta = 6/5$ for self-diffusion. The Schmidt number $\\text{Sc} = \\eta/\\rho D$ is therefore ______ (to three decimal places).',
      answer: 0.833, tol: 0.001, calc: () => 5 / 6,
      sol: '$\\text{Sc} = 1/1.2 = 0.833$ (measured about 0.75 to 0.85 for simple gases). The elementary theory, with $\\eta = \\tfrac13\\rho\\bar v\\lambda$ and $D = \\tfrac13\\bar v\\lambda$, would give exactly 1. Like Pr, Sc compares momentum diffusion ($\\nu = \\eta/\\rho$) with another diffusion (here, mass).' },

    // ---------- level 4 ----------
    { id: 'nettr-029', type: 'nat', level: 4, exams: ['net'], sub: 'collision rates',
      q: 'Argon ($m = 39.95$ u, $d = 3.6\\times10^{-10}$ m) is at 300 K and $1.0\\times10^5$ Pa. Its collision frequency per atom, $\\bar v/\\lambda$, is ______ $\\times10^9$ s$^{-1}$ (to two decimal places).',
      answer: 5.54, tol: 0.03, calc: () => { const m = 39.948 * U, v = Math.sqrt(8 * KB * 300 / (PI * m)), lam = KB * 300 / (Math.SQRT2 * PI * (3.6e-10) ** 2 * 1e5); return v / lam / 1e9; },
      sol: '$\\bar v = \\sqrt{8kT/\\pi m} = \\sqrt{8\\times4.142\\times10^{-21}/(\\pi\\times6.634\\times10^{-26})} = 398.8$ m/s. $\\lambda = kT/\\sqrt2\\pi d^2P = 4.142\\times10^{-21}/(1.414\\times\\pi\\times1.296\\times10^{-19}\\times10^5) = 7.19\\times10^{-8}$ m. Frequency $= 398.8/7.19\\times10^{-8} = 5.54\\times10^9$ s$^{-1}$: each atom collides about every 0.18 ns.',
      trap: 'The mean relative speed is $\\sqrt2\\bar v$; that factor is already inside $\\lambda = 1/\\sqrt2n\\pi d^2$, so do not include it twice.' },
    { id: 'nettr-030', type: 'mcq', level: 4, exams: ['net'], sub: 'phonon conduction',
      q: 'In an insulating crystal $\\kappa = \\tfrac13Cv\\lambda$ for phonons. At very low temperatures (well below $\\Theta_D$) in a pure, small crystal, $\\kappa$ varies as',
      options: ['$T^{-1}$, because of umklapp scattering', '$e^{\\Theta_D/2T}$ at all low temperatures', '$T^3$, because $C\\propto T^3$ and $\\lambda$ saturates at the sample size (boundary scattering)', '$T$, like a metal'], answer: 2,
      sol: 'Umklapp processes freeze out as $e^{-\\Theta_D/bT}$, so $\\lambda$ grows until phonons scatter mainly at the crystal surfaces (Casimir regime): $\\lambda\\approx$ sample size, constant. With $v$ fixed and $C\\propto T^3$ (Debye), $\\kappa\\propto T^3$. At high $T$ umklapp gives $\\kappa\\propto1/T$; the maximum lies between.' },
    { id: 'nettr-031', type: 'nat', level: 4, exams: ['net'], sub: 'phonon conduction',
      q: 'A crystal has $\\kappa = 2000$ W m$^{-1}$K$^{-1}$, heat capacity per volume $1.8\\times10^6$ J m$^{-3}$K$^{-1}$ and average sound speed $1.2\\times10^4$ m/s. From $\\kappa = \\tfrac13Cv\\lambda$, the phonon mean free path is ______ nm (to the nearest whole number).',
      answer: 278, tol: 1, calc: () => 3 * 2000 / (1.8e6 * 1.2e4) * 1e9,
      sol: '$\\lambda = 3\\kappa/Cv = 6000/(1.8\\times10^6\\times1.2\\times10^4) = 6000/2.16\\times10^{10} = 2.78\\times10^{-7}$ m $= 278$ nm, roughly the room-temperature picture of diamond: very stiff (fast phonons) and weakly anharmonic (long paths).' },
    { id: 'nettr-032', type: 'msq', level: 4, exams: ['net'], sub: 'viscosity',
      q: 'Which statements about viscosity are correct?',
      options: ['A dilute gas becomes more viscous when heated', 'A dilute gas becomes more viscous when compressed at constant temperature', 'A liquid typically becomes less viscous when heated, roughly as $e^{E_a/kT}$', 'The kinematic viscosity $\\eta/\\rho$ of a dilute gas falls when the pressure is raised at constant $T$'], answer: [0, 2, 3],
      sol: 'Gas: momentum is carried by flying molecules, $\\eta\\propto\\sqrt{mT}/d^2$, independent of density. Liquid: molecules must hop over barriers to slide past each other, an activated process that speeds up with $T$. Since $\\eta$ is pressure independent but $\\rho\\propto P$, the kinematic viscosity $\\nu = \\eta/\\rho\\propto1/P$.' },
    { id: 'nettr-033', type: 'nat', level: 4, exams: ['net'], sub: 'Matthiessen\'s rule',
      q: 'A metal wire has resistivity $1.70\\times10^{-8}\\ \\Omega$ m at 300 K and $1.70\\times10^{-11}\\ \\Omega$ m at 4.2 K (all residual), a residual resistivity ratio of 1000. If its impurity content is doubled, the new ratio $\\rho(300)/\\rho(4.2)$ is ______ (to the nearest whole number).',
      answer: 500, tol: 1, calc: () => (1.7e-8 - 1.7e-11 + 3.4e-11) / 3.4e-11,
      sol: 'Matthiessen: $\\rho = \\rho_0 + \\rho_{ph}(T)$. The phonon part at 300 K is $1.70\\times10^{-8} - 1.7\\times10^{-11} = 1.6983\\times10^{-8}$. Doubling impurities: $\\rho_0 = 3.4\\times10^{-11}$, $\\rho(300) = 1.7017\\times10^{-8}$, ratio $= 500.5\\approx500$.' },
    { id: 'nettr-034', type: 'mcq', level: 4, exams: ['net'], sub: 'Drude model',
      q: 'In the Drude model with a single carrier type, the Hall coefficient $R_H = E_y/j_xB_z$ is',
      options: ['$\\propto\\tau$', '$-\\dfrac{e\\tau}{m}$', 'zero unless there are two carrier types', '$-\\dfrac{1}{ne}$, independent of $\\tau$'], answer: 3,
      sol: 'In steady state the transverse force vanishes: $E_y = v_xB_z$ with $v_x = -j_x/ne$, so $R_H = -1/ne$. The collision time cancels, so Hall measurements count carriers directly (and reveal positive "holes" in some metals, which Drude theory cannot explain).' },
    { id: 'nettr-035', type: 'nat', level: 4, exams: ['net'], sub: 'Chapman-Enskog',
      q: 'The hard-sphere Chapman-Enskog self-diffusion constant is $D = \\dfrac{3}{8nd^2}\\sqrt{\\dfrac{kT}{\\pi m}}$. For argon ($m = 39.95$ u, $d = 3.6\\times10^{-10}$ m) at 300 K and $1.0\\times10^5$ Pa, $D$ is ______ $\\times10^{-5}$ m$^2$/s (to two decimal places).',
      answer: 1.69, tol: 0.01, calc: () => { const n = 1e5 / (KB * 300); return 3 / (8 * n * (3.6e-10) ** 2) * Math.sqrt(KB * 300 / (PI * 39.948 * U)) * 1e5; },
      sol: '$n = P/kT = 2.414\\times10^{25}$ m$^{-3}$. $\\sqrt{kT/\\pi m} = \\sqrt{4.142\\times10^{-21}/(\\pi\\times6.634\\times10^{-26})} = 141.0$ m/s. $D = \\dfrac{3\\times141.0}{8\\times2.414\\times10^{25}\\times1.296\\times10^{-19}} = 1.69\\times10^{-5}$ m$^2$/s. Check: $\\rho D/\\eta = 1.602\\times1.69\\times10^{-5}/2.25\\times10^{-5} = 1.20 = 6/5$.' },
    { id: 'nettr-036', type: 'mcq', level: 4, exams: ['net'], sub: 'Knudsen regime',
      q: 'When the mean free path is small but not negligible compared with the channel width (slip-flow regime), a gas flowing along a wall',
      options: ['sticks perfectly to the wall, as a liquid does', 'flows with no shear at all', 'has a nonzero velocity at the wall, of order $\\lambda\\,du/dz$ (velocity slip)', 'stops flowing'], answer: 2,
      sol: 'Molecules hitting the wall come from about one mean free path away, where the gas moves at $u(\\lambda)\\approx u(0) + \\lambda u\'$. With diffuse reflection the gas next to the wall then moves at about $\\lambda\\,du/dz$ (Maxwell slip). Flow through fine capillaries is enhanced, and in the free-molecular limit becomes Knudsen flow.' },
    { id: 'nettr-037', type: 'nat', level: 5, exams: ['net'], sub: 'Wiedemann-Franz',
      q: 'The classical (Drude, Maxwell-Boltzmann) Lorenz number is $\\tfrac32(k/e)^2$ and the Sommerfeld one $\\tfrac{\\pi^2}{3}(k/e)^2$. Their ratio, classical over quantum, is ______ (to three decimal places).',
      answer: 0.456, tol: 0.001, calc: () => 1.5 / (PI * PI / 3),
      sol: '$\\dfrac{3/2}{\\pi^2/3} = \\dfrac{9}{2\\pi^2} = 0.456$. In Sommerfeld theory only electrons within $kT$ of $E_F$ carry heat ($c_v\\propto T/T_F$) but they move at $v_F$; the two factors of $T_F$ cancel, leaving a universal $L$ with $\\pi^2/3$ from the Sommerfeld expansion.' },
    { id: 'nettr-038', type: 'mcq', level: 5, exams: ['net'], sub: 'Knudsen regime',
      q: 'The heat conducted by a gas between two plates a few mm apart is measured from $10^{-3}$ Pa up to $10^5$ Pa at fixed temperatures. On a log-log plot of heat flux against pressure, one sees',
      options: ['a straight line of slope 1 throughout', 'a flat line throughout', 'a decrease, since denser gas has a shorter mean free path', 'slope 1 at low pressure, bending over to a plateau once $\\lambda$ falls below the gap (around 1 to 10 Pa)'], answer: 3,
      sol: 'Free-molecular regime ($\\lambda\\gg$ gap): flux $\\propto$ number of molecules $\\propto P$. Continuum regime ($\\lambda\\ll$ gap): $\\kappa$ independent of $P$. For N$_2$ at 300 K, $\\lambda = 6.8$ mm at 1 Pa, so the bend for a few-mm gap sits around 1 to 10 Pa. Pirani gauges work on the rising part.' },
    { id: 'nettr-039', type: 'nat', level: 5, exams: ['net'], sub: 'thermal transpiration',
      q: 'A room-temperature (300 K) gauge is connected by a thin tube to a vessel at 4.2 K, with the gas in the Knudsen regime throughout the tube. The gauge reads $1.0\\times10^{-3}$ Pa. The actual pressure in the cold vessel is ______ $\\times10^{-4}$ Pa (to two decimal places).',
      answer: 1.18, tol: 0.01, calc: () => 1e-3 / Math.sqrt(300 / 4.2) * 1e4,
      sol: 'Zero net effusive flow: $P/\\sqrt T$ is equal at both ends, so $P_{cold} = P_{warm}\\sqrt{4.2/300} = 1.0\\times10^{-3}/8.45 = 1.18\\times10^{-4}$ Pa. The cold side has the lower pressure but the higher number density ($n\\propto P/T$).',
      trap: 'Using $T$ instead of $\\sqrt T$ gives the density ratio, not the pressure ratio.' },
    { id: 'nettr-040', type: 'msq', level: 5, exams: ['net'], sub: 'Boltzmann equation',
      q: 'Which statements about the Boltzmann equation and the H-theorem are correct?',
      options: ['For the collision integral of a dilute gas, $H = \\int f\\ln f\\,d^3v$ never increases', '$dH/dt = 0$ exactly when $f$ is a (local) Maxwellian', 'In the relaxation-time approximation, $f_0$ must carry the local density, velocity and temperature of $f$ if particles, momentum and energy are to be conserved', 'The Boltzmann equation is time-reversal invariant, so it cannot describe irreversibility'], answer: [0, 1, 2],
      sol: 'Boltzmann\'s "molecular chaos" assumption (uncorrelated velocities before collisions) breaks time-reversal symmetry, giving $dH/dt\\le0$ with equality only for Maxwellians. The relaxation-time model conserves the collision invariants only if $f_0$ is the local equilibrium built from $f$\'s own moments. So the equation does describe irreversibility, unlike the underlying mechanics (Loschmidt\'s objection).' },
    { id: 'nettr-041', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'pressure dependence',
      q: 'The air in a double-glazed window is compressed from 1 atm to 2 atm at the same temperature. Its thermal conductivity',
      options: ['doubles', 'halves', 'stays almost the same', 'falls to zero'], answer: 2,
      sol: 'Twice as many molecules carry energy, but each over half the distance: $\\kappa\\propto n\\lambda$ is unchanged as long as $\\lambda$ (about 70 nm here) is far smaller than the gap. Only evacuating to the Knudsen regime reduces conduction, as in a vacuum flask.' },
    { id: 'nettr-042', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'viscosity',
      q: 'Two parallel plates 1.0 mm apart contain air ($\\eta = 1.8\\times10^{-5}$ Pa s). The top plate slides at 1.0 m/s. The shear stress needed to keep it moving (laminar Couette flow) is ______ mPa.',
      answer: 18, tol: 0.1, calc: () => 1.8e-5 * 1 / 1e-3 * 1e3,
      sol: 'The velocity profile is linear, $du/dz = 1.0/10^{-3} = 1000$ s$^{-1}$, and the stress is $\\eta\\,du/dz = 1.8\\times10^{-5}\\times1000 = 1.8\\times10^{-2}$ Pa $= 18$ mPa. On the molecular level this is the net downward flux of $x$-momentum.' },
    ...more2,
  ],
  gens: [
    { id: 'nettr-g01', type: 'nat', level: 1, exams: ['gate', 'net'], sub: 'free paths',
      make(r) {
        const ask = choose(r, ['frac', 'dist']);
        if (ask === 'frac') {
          const x = choose(r, [0.1, 0.5, 1, 1.5, 2, 3]), val = Math.exp(-x);
          return { q: `What fraction of gas molecules travel at least ${x} mean free paths without colliding? (four decimal places)`, answer: round(val, 4), tol: 0.0005, ask, x,
            sol: `Survival law $P(x) = e^{-x/\\lambda}$: $e^{-${x}} = ${round(val, 5)}$.`, trap: 'This is an exponential, not a step at $x = \\lambda$.' };
        }
        const f = choose(r, [0.9, 0.75, 0.5, 0.25, 0.1]), val = -Math.log(f);
        return { q: `Within what distance, in mean free paths, does a fraction ${round(1 - f, 2)} of the molecules make their next collision? (three decimal places)`, answer: round(val, 3), tol: 0.002, ask, f,
          sol: `Survivors: $e^{-x/\\lambda} = ${f}$, so $x = -\\lambda\\ln${f} = ${round(val, 4)}\\lambda$.`, trap: 'Set the survivors, not the collided fraction, equal to $e^{-x/\\lambda}$.' };
      },
      verify: (p) => p.ask === 'frac' ? Math.exp(-p.x) : -Math.log(p.f) },
    { id: 'nettr-g02', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'free paths',
      make(r) {
        const G = choose(r, [['helium', 2.2e-10], ['neon', 2.6e-10], ['nitrogen', 3.7e-10], ['argon', 3.6e-10], ['carbon dioxide', 4.6e-10]]), P = choose(r, [1e5, 1e3, 10, 1, 0.01]), T = choose(r, [77, 300, 500]);
        const val = KB * T / (Math.SQRT2 * PI * G[1] ** 2 * P), e10 = Math.floor(Math.log10(val)), man = val / 10 ** e10;
        return { q: `Find the mean free path of ${G[0]} (hard-sphere diameter ${(G[1] * 1e10).toFixed(1)} Å) at ${T} K and ${P} Pa. Answer as ______ $\\times10^{${e10}}$ m (two decimal places).`,
          answer: round(man, 2), tol: Math.max(0.01, man * 0.006), d: G[1], P, T, e10,
          sol: `$\\lambda = \\dfrac{kT}{\\sqrt2\\pi d^2P} = \\dfrac{1.381\\times10^{-23}\\times${T}}{1.414\\pi(${G[1].toExponential(1)})^2\\times${P}} = ${man.toFixed(3)}\\times10^{${e10}}$ m.`,
          trap: 'At fixed $T$, $\\lambda\\propto1/P$.' };
      },
      verify: (p) => KB * p.T / (Math.SQRT2 * PI * p.d ** 2 * p.P) / 10 ** p.e10 },
    { id: 'nettr-g03', type: 'nat', level: 3, exams: ['net'], sub: 'Chapman-Enskog',
      make(r) {
        const G = choose(r, [['helium', 4.0026, 2.2e-10], ['neon', 20.18, 2.6e-10], ['argon', 39.95, 3.6e-10], ['krypton', 83.8, 4.1e-10], ['xenon', 131.3, 4.9e-10]]), T = choose(r, [100, 200, 300, 500, 1000]);
        const val = etaCE(G[1], G[2], T) * 1e5;
        return { q: `Using the hard-sphere Chapman-Enskog formula $\\eta = \\dfrac{5}{16d^2}\\sqrt{\\dfrac{mkT}{\\pi}}$, find the viscosity of ${G[0]} ($m = ${G[1]}$ u, $d = ${(G[2] * 1e10).toFixed(1)}$ Å) at ${T} K, in units of $10^{-5}$ Pa s (three significant figures).`,
          answer: +val.toPrecision(3), tol: val * 0.01, mU: G[1], d: G[2], T,
          sol: `$m = ${G[1]}\\times1.6605\\times10^{-27}$ kg. $\\sqrt{mkT/\\pi} = ${Math.sqrt(G[1] * U * KB * T / PI).toExponential(3)}$; divided by $d^2$ and times $5/16$: $\\eta = ${val.toPrecision(4)}\\times10^{-5}$ Pa s.`,
          trap: 'There is no density in the formula: viscosity of a dilute gas is pressure independent.' };
      },
      verify: (p) => etaCE(p.mU, p.d, p.T) * 1e5 },
    { id: 'nettr-g04', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'scaling',
      make(r) {
        const ask = choose(r, ['T', 'm', 'd', 'D']);
        if (ask === 'T') { const T1 = choose(r, [200, 300]), T2 = choose(r, [400, 600, 900, 1200]), val = Math.sqrt(T2 / T1);
          return { q: `A hard-sphere gas at fixed pressure is heated from ${T1} K to ${T2} K. By what factor does its viscosity change? (three decimal places)`, answer: round(val, 3), tol: 0.002, ask, T1, T2, sol: `$\\eta\\propto\\sqrt T$: $\\sqrt{${T2}/${T1}} = ${round(val, 4)}$.`, trap: 'Pressure does not enter.' }; }
        if (ask === 'm') { const m1 = choose(r, [2, 4]), m2 = choose(r, [20, 32, 40]), val = Math.sqrt(m2 / m1);
          return { q: `Two gases have equal molecular diameters and molar masses ${m1} and ${m2} g/mol. At the same temperature, what is the ratio of their thermal conductivities (light to heavy)? Both are monatomic. (three decimal places)`, answer: round(val, 3), tol: 0.002, ask, m1, m2, sol: `$\\kappa\\sim\\tfrac13nc_v\\bar v\\lambda$ with $n\\lambda$ and $c_v$ (per molecule) the same, $\\bar v\\propto m^{-1/2}$: ratio $\\sqrt{${m2}/${m1}} = ${round(val, 4)}$.`, trap: 'Viscosity goes the other way, $\\propto\\sqrt m$.' }; }
        if (ask === 'd') { const k = choose(r, [1.2, 1.5, 2]), val = 1 / (k * k);
          return { q: `Gas B has molecules ${k} times the diameter of those of gas A, with the same mass. At the same temperature, $\\eta_B/\\eta_A$ is ______ (three decimal places).`, answer: round(val, 3), tol: 0.002, ask, k, sol: `$\\eta\\propto1/d^2$ (through $\\lambda\\propto1/d^2$): $1/${k}^2 = ${round(val, 4)}$.`, trap: 'The cross-section goes as $d^2$.' }; }
        const P1 = 1, P2 = choose(r, [2, 5, 10]), T2 = choose(r, [1, 2]), val = T2 ** 1.5 / P2;
        return { q: `The self-diffusion constant of a hard-sphere gas is $D_0$ at $(T_0, P_0)$. Find $D/D_0$ at temperature $${T2}T_0$ and pressure $${P2}P_0$ (three decimal places).`, answer: round(val, 3), tol: 0.002, ask, P2, T2, sol: `$D\\sim\\tfrac13\\bar v\\lambda\\propto\\sqrt T\\cdot T/P = T^{3/2}/P$: $${T2}^{3/2}/${P2} = ${round(val, 4)}$.`, trap: 'Unlike $\\eta$ and $\\kappa$, $D$ depends on pressure.' };
      },
      verify: (p) => ({ T: () => Math.sqrt(p.T2 / p.T1), m: () => Math.sqrt(p.m2 / p.m1), d: () => 1 / p.k ** 2, D: () => p.T2 ** 1.5 / p.P2 })[p.ask]() },
    { id: 'nettr-g05', type: 'nat', level: 3, exams: ['net'], sub: 'Eucken ratio',
      make(r) {
        const G = choose(r, [['helium', 4.0026, 1.99e-5], ['neon', 20.18, 3.17e-5], ['argon', 39.95, 2.27e-5], ['krypton', 83.8, 2.51e-5]]);
        const val = 15 / 4 * KB / (G[1] * U) * G[2];
        return { q: `${G[0][0].toUpperCase() + G[0].slice(1)} ($m = ${G[1]}$ u) has viscosity $${(G[2] * 1e5).toFixed(2)}\\times10^{-5}$ Pa s at 300 K. Using $\\kappa = \\tfrac{15}{4}(k/m)\\eta$, its thermal conductivity is ______ W m$^{-1}$K$^{-1}$ (three significant figures).`,
          answer: +val.toPrecision(3), tol: val * 0.01, mU: G[1], eta: G[2],
          sol: `$k/m = ${(KB / (G[1] * U)).toPrecision(4)}$ J kg$^{-1}$K$^{-1}$, so $\\kappa = 3.75\\times${(KB / (G[1] * U)).toPrecision(4)}\\times${G[2]} = ${val.toPrecision(4)}$ W m$^{-1}$K$^{-1}$ (i.e. $\\tfrac52c_v\\eta$).`,
          trap: 'The Eucken factor for monatomic gases is 5/2, not 1.' };
      },
      verify: (p) => 15 / 4 * KB / (p.mU * U) * p.eta },
    { id: 'nettr-g06', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Wiedemann-Franz',
      make(r) {
        const M = choose(r, [['copper', 5.96e7], ['silver', 6.30e7], ['aluminium', 3.77e7], ['iron', 1.0e7], ['gold', 4.10e7]]), T = choose(r, [77, 200, 300, 400]), ask = choose(r, ['k', 'k', 'L']);
        if (ask === 'L') { const kap = choose(r, [100, 237, 318, 401, 429]), val = kap / (M[1] * T) * 1e8;
          return { q: `A metal has $\\sigma = ${(M[1] / 1e7).toFixed(2)}\\times10^7$ S/m and $\\kappa = ${kap}$ W m$^{-1}$K$^{-1}$ at ${T} K. Its Lorenz number $\\kappa/\\sigma T$ is ______ $\\times10^{-8}$ W $\\Omega$ K$^{-2}$ (three significant figures).`, answer: +val.toPrecision(3), tol: val * 0.01, ask, kap, s: M[1], T,
            sol: `$L = ${kap}/(${M[1].toExponential(2)}\\times${T}) = ${val.toPrecision(4)}\\times10^{-8}$; compare the Sommerfeld value 2.44.`, trap: 'Do not forget the factor $T$.' }; }
        const val = L0 * M[1] * T;
        return { q: `${M[0][0].toUpperCase() + M[0].slice(1)} has $\\sigma = ${(M[1] / 1e7).toFixed(2)}\\times10^7$ S/m at ${T} K (take this value as given). Using the Wiedemann-Franz law with $L = 2.443\\times10^{-8}$ W $\\Omega$ K$^{-2}$, its electronic thermal conductivity is ______ W m$^{-1}$K$^{-1}$ (three significant figures).`,
          answer: +val.toPrecision(3), tol: val * 0.01, ask, s: M[1], T,
          sol: `$\\kappa = L\\sigma T = 2.443\\times10^{-8}\\times${M[1].toExponential(2)}\\times${T} = ${val.toPrecision(4)}$ W m$^{-1}$K$^{-1}$.`, trap: 'Good electrical conductors are good heat conductors, in proportion.' };
      },
      verify: (p) => p.ask === 'L' ? p.kap / (p.s * p.T) * 1e8 : L0 * p.s * p.T },
    { id: 'nettr-g07', type: 'nat', level: 3, exams: ['net'], sub: 'Drude model',
      make(r) {
        const M = choose(r, [['copper', 8.49e28, 5.96e7, 1.57e6], ['silver', 5.86e28, 6.30e7, 1.39e6], ['aluminium', 18.1e28, 3.77e7, 2.03e6], ['sodium', 2.65e28, 2.1e7, 1.07e6]]), ask = choose(r, ['tau', 'lam', 'mu']);
        const tau = ME * M[2] / (M[1] * E * E), val = { tau: tau * 1e14, lam: M[3] * tau * 1e9, mu: E * tau / ME * 1e4 }[ask];
        const txt = { tau: 'the collision time, in units of $10^{-14}$ s', lam: 'the mean free path $v_F\\tau$ in nm', mu: 'the mobility in cm$^2$ V$^{-1}$s$^{-1}$' }[ask];
        return { q: `${M[0][0].toUpperCase() + M[0].slice(1)} has $n = ${(M[1] / 1e28).toFixed(2)}\\times10^{28}$ m$^{-3}$, $\\sigma = ${(M[2] / 1e7).toFixed(2)}\\times10^7$ S/m and $v_F = ${(M[3] / 1e6).toFixed(2)}\\times10^6$ m/s. In the Drude-Sommerfeld picture, find ${txt} (three significant figures).`,
          answer: +val.toPrecision(3), tol: val * 0.01, n: M[1], s: M[2], vF: M[3], ask,
          sol: `$\\tau = m\\sigma/ne^2 = ${(tau * 1e14).toPrecision(4)}\\times10^{-14}$ s; $\\lambda = v_F\\tau = ${(M[3] * tau * 1e9).toPrecision(4)}$ nm; $\\mu = e\\tau/m = ${(E * tau / ME * 1e4).toPrecision(4)}$ cm$^2$/V s.`,
          trap: 'Use the Fermi velocity, not a thermal speed, for the mean free path.' };
      },
      verify: (p) => { const tau = ME * p.s / (p.n * E * E); return { tau: tau * 1e14, lam: p.vF * tau * 1e9, mu: E * tau / ME * 1e4 }[p.ask]; } },
    { id: 'nettr-g08', type: 'nat', level: 3, exams: ['net'], sub: 'Matthiessen\'s rule',
      make(r) {
        const r300 = choose(r, [1.7, 1.6, 2.7]), RRR = choose(r, [50, 100, 300, 1000]), k = choose(r, [2, 3, 5, 0.5]);
        const r0 = r300 / RRR, ph = r300 - r0, val = (ph + k * r0) / (k * r0);
        return { q: `A metal has $\\rho(300\\text{ K}) = ${r300}\\times10^{-8}\\ \\Omega$ m and residual resistivity ratio ${RRR}. If the impurity concentration is multiplied by ${k}, what is the new residual resistivity ratio? (three significant figures)`,
          answer: +val.toPrecision(3), tol: val * 0.01, r300, RRR, k,
          sol: `$\\rho_0 = ${r300}/${RRR}\\times10^{-8} = ${r0.toPrecision(4)}\\times10^{-8}$, phonon part $${ph.toPrecision(5)}\\times10^{-8}$. New $\\rho_0 = ${(k * r0).toPrecision(4)}\\times10^{-8}$; ratio $= (${ph.toPrecision(5)} + ${(k * r0).toPrecision(4)})/${(k * r0).toPrecision(4)} = ${val.toPrecision(4)}$.`,
          trap: 'Only the residual part scales with impurities; the phonon part is intrinsic.' };
      },
      verify: (p) => { const r0 = p.r300 / p.RRR; return (p.r300 - r0 + p.k * r0) / (p.k * r0); } },
    { id: 'nettr-g09', type: 'nat', level: 3, exams: ['net'], sub: 'thermal transpiration',
      make(r) {
        const Tw = choose(r, [293, 300]), Tc = choose(r, [1.5, 4.2, 20, 77, 150]), ask = choose(r, ['ratio', 'n']);
        const val = Math.sqrt(Tw / Tc);
        return { q: ask === 'ratio' ? `Vessels at ${Tw} K and ${Tc} K are joined by a tube in the Knudsen regime. Find the steady-state pressure ratio $P_{warm}/P_{cold}$ (three significant figures).` : `Vessels at ${Tw} K and ${Tc} K are joined by a tube in the Knudsen regime. Find the steady-state number-density ratio $n_{cold}/n_{warm}$ (three significant figures).`,
          answer: +val.toPrecision(3), tol: val * 0.01, Tw, Tc, ask,
          sol: `No net effusion: $n\\bar v$ equal both ways, i.e. $P/\\sqrt T$ equal. $P_w/P_c = \\sqrt{${Tw}/${Tc}} = ${Math.sqrt(Tw / Tc).toPrecision(4)}$; $n\\propto P/T$, so $n_c/n_w = \\sqrt{T_w/T_c} = ${Math.sqrt(Tw / Tc).toPrecision(4)}$ as well.`,
          trap: 'In the continuum regime the pressures would be equal and the density ratio would be $T_w/T_c$.' };
      },
      verify: (p) => Math.sqrt(p.Tw / p.Tc) },
    { id: 'nettr-g10', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'heat diffusion',
      make(r) {
        const M = choose(r, [['copper', 1.1e-4], ['aluminium', 9.7e-5], ['steel', 1.2e-5], ['glass', 3.4e-7], ['water', 1.4e-7]]), L = choose(r, [0.001, 0.01, 0.05, 0.1]);
        const val = L * L / M[1];
        return { q: `${M[0][0].toUpperCase() + M[0].slice(1)} has thermal diffusivity $${M[1].toExponential(1).replace('e-', '\\times10^{-')}}$ m$^2$/s. Estimate the time $L^2/\\alpha$ for heat to diffuse ${L * 100} cm, in seconds (three significant figures).`,
          answer: +val.toPrecision(3), tol: val * 0.01, a: M[1], L,
          sol: `$t\\sim L^2/\\alpha = (${L})^2/${M[1]} = ${val.toPrecision(4)}$ s.`, trap: 'Time grows as the square of the distance.' };
      },
      verify: (p) => p.L ** 2 / p.a },
    { id: 'nettr-g11', type: 'nat', level: 3, exams: ['net'], sub: 'Prandtl number',
      make(r) {
        const G = choose(r, [['a monatomic gas', 5 / 3, '5/3'], ['a diatomic gas', 1.4, '1.4'], ['a polyatomic gas', 1.3, '1.3'], ['a gas', 1.5, '1.5']]);
        const val = 4 * G[1] / (9 * G[1] - 5);
        return { q: `Eucken's formula gives the Prandtl number as $\\text{Pr} = \\dfrac{4\\gamma}{9\\gamma - 5}$. For ${G[0]} with $\\gamma = ${G[2]}$, Pr is ______ (three decimal places).`,
          answer: round(val, 3), tol: 0.002, g: G[1],
          sol: `$\\text{Pr} = 4\\times${round(G[1], 4)}/(9\\times${round(G[1], 4)} - 5) = ${round(4 * G[1], 4)}/${round(9 * G[1] - 5, 4)} = ${round(val, 4)}$.${G[1] > 1.6 ? ' This is the Chapman-Enskog 2/3.' : ''}`,
          trap: 'Pr is a ratio of diffusivities (momentum to heat), dimensionless.' };
      },
      verify: (p) => 4 * p.g / (9 * p.g - 5) },
    { id: 'nettr-g12', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'concepts',
      make(r) {
        const P = choose(r, [
          ['Viscosity in a dilute gas arises from', 'molecules carrying flow momentum across layers', ['attractive forces between molecules', 'collisions with the container walls only', 'thermal radiation']],
          ['Doubling the pressure of a dilute gas at fixed temperature', 'halves the self-diffusion constant', ['doubles the viscosity', 'doubles the thermal conductivity', 'halves the viscosity']],
          ['The Eucken factor $\\kappa/\\eta c_v$ for a monatomic gas is', '5/2', ['1', '3/2', '2/3']],
          ['The Wiedemann-Franz law relates', 'electrical and thermal conductivity of metals', ['viscosity and diffusion', 'heat capacity and entropy', 'mobility and Hall coefficient']],
          ['Matthiessen\'s rule says that independent scattering mechanisms', 'add their scattering rates', ['add their mean free paths', 'multiply their resistivities', 'cancel at low temperature']],
        ]);
        const o = mcqOptions(r, P[1], P[2], (v) => v);
        return { q: P[0], ...o, sol: `The answer: ${P[1]}. Transport coefficients come from fluxes of momentum ($\\eta$), energy ($\\kappa$) and particles ($D$), each carried about a mean free path; $\\eta$ and $\\kappa$ are pressure independent, $D\\propto1/P$; rates of independent processes add.`,
          trap: 'Keep straight which coefficient depends on pressure: only $D$.' };
      } },
    ...more,
  ],
};
