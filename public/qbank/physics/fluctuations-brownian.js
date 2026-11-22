// Fluctuations, diffusion and Brownian motion, NET depth: energy, number and temperature fluctuations in the
// ensembles, fluctuations and response (heat capacity, compressibility), random walks and the central limit theorem,
// the diffusion equation, Einstein and Stokes-Einstein relations, the Langevin equation (velocity autocorrelation,
// ballistic and diffusive regimes, Green-Kubo), sedimentation, Johnson-Nyquist and shot noise, polymers as random
// walks and thermally activated escape.
// Original questions (fibub) for CSIR NET Part C and GATE. Levels: 1 warm-up ... 5 top rank.
import { pick, int, choose, mcqOptions, round, C } from '../_util.js';
import more from './fluctuations-brownian.more.gen.js';
import more2 from './fluctuations-brownian.more2.gen.js';

const PI = Math.PI, KB = C.kB, E = C.e;
const binom = (n, k) => { let r = 1; for (let i = 1; i <= k; i++) r = r * (n - k + i) / i; return r; };

export default {
  topic: 'fluctuations-brownian',
  items: [
    // ---------- level 1 ----------
    { id: 'netfb-001', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'energy fluctuations',
      q: 'In the canonical ensemble the variance of the energy is',
      options: ['$\\langle(\\Delta E)^2\\rangle = kT^2C_V$', '$\\langle(\\Delta E)^2\\rangle = kTC_V$', '$\\langle(\\Delta E)^2\\rangle = C_V/kT^2$', '$\\langle(\\Delta E)^2\\rangle = k^2TC_V$'], answer: 0,
      sol: '$\\langle E\\rangle = -\\partial\\ln Z/\\partial\\beta$ and $\\langle E^2\\rangle - \\langle E\\rangle^2 = \\partial^2\\ln Z/\\partial\\beta^2 = -\\partial\\langle E\\rangle/\\partial\\beta = kT^2\\,\\partial\\langle E\\rangle/\\partial T = kT^2C_V$. A response function (heat capacity) measures the size of equilibrium fluctuations.' },
    { id: 'netfb-002', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'random walk',
      q: 'A particle takes $N$ independent steps of fixed length $l$ in random directions. Its root-mean-square displacement from the start is',
      options: ['$Nl$', '$l\\sqrt N$', '$l/\\sqrt N$', '$lN^2$'], answer: 1,
      sol: '$\\vec R = \\sum\\vec l_i$, so $\\langle R^2\\rangle = \\sum_i\\langle l_i^2\\rangle + \\sum_{i\\ne j}\\langle\\vec l_i\\cdot\\vec l_j\\rangle = Nl^2 + 0$, since different steps are uncorrelated. Hence $R_{rms} = l\\sqrt N$: distance grows as the square root of time, the hallmark of diffusion.' },
    { id: 'netfb-003', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'diffusion',
      q: 'Particles released at the origin diffuse in one dimension with diffusion constant $D$. Their mean square displacement after time $t$ is',
      options: ['$Dt$', '$2Dt$', '$6Dt$', '$(Dt)^2$'], answer: 1,
      sol: 'The diffusion equation $\\partial_tn = D\\partial_x^2n$ with a point start gives the Gaussian $n\\propto e^{-x^2/4Dt}/\\sqrt{4\\pi Dt}$, with variance $2Dt$. In $d$ dimensions $\\langle r^2\\rangle = 2dDt$: $4Dt$ in 2D and $6Dt$ in 3D.',
      trap: '$6Dt$ is the three-dimensional result.' },
    { id: 'netfb-004', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'Einstein relation',
      q: 'A small sphere of radius $a$ in a fluid of viscosity $\\eta$ at temperature $T$ has diffusion constant (Stokes-Einstein)',
      options: ['$D = 6\\pi\\eta akT$', '$D = \\dfrac{kT}{4\\pi\\eta a}$', '$D = \\dfrac{kT}{6\\pi\\eta a}$', '$D = \\dfrac{6\\pi\\eta a}{kT}$'], answer: 2,
      sol: 'Einstein: $D = \\mu kT$ with mobility $\\mu = 1/\\gamma$ (velocity per unit force). Stokes drag gives $\\gamma = 6\\pi\\eta a$, so $D = kT/6\\pi\\eta a$. Perrin used this, with measured $D$, to find Avogadro\'s number.' },
    { id: 'netfb-005', type: 'nat', level: 1, exams: ['gate', 'net'], sub: 'random walk',
      q: 'A polymer is modelled as a freely jointed chain of 100 segments, each 1.0 nm long. Its rms end-to-end distance is ______ nm.',
      answer: 10, tol: 0.05, calc: () => Math.sqrt(100) * 1,
      sol: 'A freely jointed chain is a random walk: $R_{rms} = b\\sqrt N = 1.0\\times\\sqrt{100} = 10$ nm, compared with a contour length of 100 nm.' },
    { id: 'netfb-006', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'number fluctuations',
      q: 'For a classical ideal gas in the grand canonical ensemble, the variance of the particle number in a volume is',
      options: ['zero', '$\\langle N\\rangle^2$', '$\\sqrt{\\langle N\\rangle}$', '$\\langle N\\rangle$ (a Poisson distribution)'], answer: 3,
      sol: 'In general $\\langle(\\Delta N)^2\\rangle = kT(\\partial\\langle N\\rangle/\\partial\\mu)_{T,V}$. For a classical ideal gas $\\langle N\\rangle\\propto e^{\\mu/kT}$, so the derivative is $\\langle N\\rangle/kT$ and the variance is $\\langle N\\rangle$: the counts are Poisson, with relative spread $1/\\sqrt{\\langle N\\rangle}$.' },

    // ---------- level 2 ----------
    { id: 'netfb-007', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'energy fluctuations',
      q: 'A classical monatomic ideal gas of $N = 1.0\\times10^4$ atoms is in contact with a heat bath. The relative energy fluctuation $\\Delta E_{rms}/\\langle E\\rangle$ is ______ $\\times10^{-3}$ (to two decimal places).',
      answer: 8.16, tol: 0.02, calc: () => Math.sqrt(2 / 3e4) * 1e3,
      sol: '$\\langle E\\rangle = \\tfrac32NkT$ and $C_V = \\tfrac32Nk$, so $\\langle(\\Delta E)^2\\rangle = kT^2\\cdot\\tfrac32Nk$ and $\\dfrac{\\Delta E_{rms}}{\\langle E\\rangle} = \\dfrac{\\sqrt{3N/2}\\,kT}{\\tfrac32NkT} = \\sqrt{\\dfrac{2}{3N}} = \\sqrt{6.67\\times10^{-5}} = 8.16\\times10^{-3}$. For a mole it is $\\sim10^{-12}$: ensembles agree.' },
    { id: 'netfb-008', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Einstein relation',
      q: 'A sphere of radius 0.50 $\\mu$m diffuses in water ($\\eta = 1.0\\times10^{-3}$ Pa s) at 300 K. Its diffusion constant is ______ $\\times10^{-13}$ m$^2$/s (to two decimal places).',
      answer: 4.39, tol: 0.02, calc: () => KB * 300 / (6 * PI * 1e-3 * 5e-7) * 1e13,
      sol: '$D = \\dfrac{kT}{6\\pi\\eta a} = \\dfrac{4.142\\times10^{-21}}{6\\pi\\times10^{-3}\\times5.0\\times10^{-7}} = \\dfrac{4.142\\times10^{-21}}{9.425\\times10^{-9}} = 4.39\\times10^{-13}$ m$^2$/s.' },
    { id: 'netfb-009', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'diffusion',
      q: 'The sphere of the previous question ($D = 4.39\\times10^{-13}$ m$^2$/s) is watched for 60 s. Its rms displacement along one axis is ______ $\\mu$m (to one decimal place).',
      answer: 7.3, tol: 0.05, calc: () => Math.sqrt(2 * KB * 300 / (6 * PI * 1e-3 * 5e-7) * 60) * 1e6,
      sol: '$x_{rms} = \\sqrt{2Dt} = \\sqrt{2\\times4.39\\times10^{-13}\\times60} = \\sqrt{5.27\\times10^{-11}} = 7.26\\times10^{-6}$ m $\\approx7.3\\ \\mu$m, easily visible in a microscope: this is what Perrin measured.' },
    { id: 'netfb-010', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Johnson noise',
      q: 'A 1.0 M$\\Omega$ resistor at 300 K is measured with a bandwidth of 10 kHz. The rms Johnson-Nyquist noise voltage is ______ $\\mu$V (to one decimal place).',
      answer: 12.9, tol: 0.1, calc: () => Math.sqrt(4 * KB * 300 * 1e6 * 1e4) * 1e6,
      sol: '$V_{rms} = \\sqrt{4kTR\\Delta f} = \\sqrt{4\\times1.381\\times10^{-23}\\times300\\times10^6\\times10^4} = \\sqrt{1.657\\times10^{-10}} = 1.29\\times10^{-5}$ V. It is a fluctuation-dissipation result: the same resistance that dissipates also sets the noise.',
      trap: 'Forgetting the 4 halves the answer.' },
    { id: 'netfb-011', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'equipartition fluctuations',
      q: 'An AFM cantilever of spring constant 0.10 N/m is at 300 K. Its rms thermal deflection is ______ nm (to two decimal places).',
      answer: 0.20, tol: 0.005, calc: () => Math.sqrt(KB * 300 / 0.1) * 1e9,
      sol: 'Equipartition: $\\tfrac12k_s\\langle x^2\\rangle = \\tfrac12kT$, so $x_{rms} = \\sqrt{kT/k_s} = \\sqrt{4.142\\times10^{-21}/0.10} = 2.04\\times10^{-10}$ m $= 0.20$ nm. AFMs use this to calibrate $k_s$.' },
    { id: 'netfb-012', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'random walk',
      q: 'A one-dimensional random walker takes 10 steps, each $+1$ or $-1$ with equal probability. The probability that it ends exactly where it started is ______ (to three decimal places).',
      answer: 0.246, tol: 0.001, calc: () => binom(10, 5) / 1024,
      sol: 'It must take 5 steps right and 5 left: $P = \\binom{10}{5}/2^{10} = 252/1024 = 0.246$. The Gaussian approximation $P(m) = \\dfrac{2}{\\sqrt{2\\pi N}}e^{-m^2/2N}$ (the factor 2 because $m$ has the parity of $N$) gives $2/\\sqrt{20\\pi} = 0.252$.' },
    { id: 'netfb-013', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'Langevin equation',
      q: 'In the Langevin equation $m\\dot v = -\\gamma v + F(t)$, the random force must satisfy $\\langle F(t)F(t\')\\rangle = \\Gamma\\delta(t - t\')$ with',
      options: ['$\\Gamma = 2\\gamma kT$', '$\\Gamma = \\gamma kT/m$', '$\\Gamma = kT/\\gamma$', '$\\Gamma = 0$'], answer: 0,
      sol: 'Solving for $v$ and demanding $\\tfrac12m\\langle v^2\\rangle = \\tfrac12kT$ at long times gives $\\langle v^2\\rangle = \\Gamma/2\\gamma m = kT/m$, so $\\Gamma = 2\\gamma kT$. This is the fluctuation-dissipation theorem: friction and noise come from the same molecular collisions.' },
    { id: 'netfb-014', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'fluctuations and response',
      q: 'Which of these equilibrium relations between fluctuations and response functions are correct?',
      options: ['$\\langle(\\Delta E)^2\\rangle = kT^2C_V$ (canonical)', '$\\langle(\\Delta N)^2\\rangle/\\langle N\\rangle = nkT\\kappa_T$ (grand canonical)', '$\\langle(\\Delta M)^2\\rangle = kT\\chi$ (magnet in a field, with $\\chi = \\partial M/\\partial H$ for total moment $M$)', '$\\langle(\\Delta T)^2\\rangle = kT^2C_V$'], answer: [0, 1, 2],
      sol: 'Each conjugate pair gives variance $= kT\\times$(susceptibility): energy with $\\beta$, $N$ with $\\mu$ (which can be rewritten with the compressibility $\\kappa_T$), $M$ with $H$. Temperature fluctuations (for a small system in contact with a bath, in Einstein\'s sense) have $\\langle(\\Delta T)^2\\rangle = kT^2/C_V$: inverse heat capacity.' },
    { id: 'netfb-015', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'number fluctuations',
      q: 'An ideal gas at 273 K and 1 atm contains $2.69\\times10^7$ molecules in a cube of side 1.0 $\\mu$m. The relative rms fluctuation of the number in that cube is ______ $\\times10^{-4}$ (to two decimal places).',
      answer: 1.93, tol: 0.01, calc: () => 1 / Math.sqrt(26867801) * 1e4,
      sol: 'Poisson statistics: $\\Delta N/N = 1/\\sqrt N = 1/\\sqrt{2.69\\times10^7} = 1.93\\times10^{-4}$. Density fluctuations on the scale of a wavelength scatter light (Rayleigh); near a critical point they grow huge (critical opalescence).' },
    { id: 'netfb-016', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'central limit theorem',
      q: 'Why does the end-point distribution of a long random walk become Gaussian, whatever the distribution of single steps (with finite variance)?',
      options: ['Because each step is Gaussian', 'By the central limit theorem: the sum of many independent variables with finite variance tends to a Gaussian', 'Because of energy conservation', 'It does not: it stays binomial'], answer: 1,
      sol: 'The characteristic function of the sum is the product of identical factors, $[\\phi(k)]^N\\approx[1 - k^2\\sigma^2/2]^N\\to e^{-Nk^2\\sigma^2/2}$, a Gaussian of variance $N\\sigma^2$. Steps with infinite variance (Lévy flights) escape the theorem.' },

    // ---------- level 3 ----------
    { id: 'netfb-017', type: 'mcq', level: 3, exams: ['net'], sub: 'Langevin equation',
      q: 'For a free Brownian particle obeying $m\\dot v = -\\gamma v + F(t)$, the mean square displacement in one dimension behaves as',
      options: ['$2Dt$ at all times', '$\\dfrac{kT}{m}t^2$ for $t\\ll m/\\gamma$ and $2Dt$ with $D = kT/\\gamma$ for $t\\gg m/\\gamma$', '$\\dfrac{kT}{m}t^2$ at all times', '$2Dt$ for $t\\ll m/\\gamma$ and $\\dfrac{kT}{m}t^2$ for $t\\gg m/\\gamma$'], answer: 1,
      sol: 'Exactly, $\\langle x^2\\rangle = \\dfrac{2kT}{\\gamma}\\left[t - \\tau(1 - e^{-t/\\tau})\\right]$ with $\\tau = m/\\gamma$. Expanding for $t\\ll\\tau$: $\\dfrac{kT}{m}t^2$ (free flight with thermal speed). For $t\\gg\\tau$: $2(kT/\\gamma)t$. The ballistic regime was first observed directly in 2010 with optical traps.' },
    { id: 'netfb-018', type: 'nat', level: 3, exams: ['net'], sub: 'Langevin equation',
      q: 'A silica-like sphere of radius 0.50 $\\mu$m and density 1000 kg/m$^3$ moves in water ($\\eta = 1.0\\times10^{-3}$ Pa s). Its velocity relaxation time $\\tau = m/6\\pi\\eta a$ is ______ ns (to one decimal place).',
      answer: 55.6, tol: 0.1, calc: () => 4 / 3 * PI * (5e-7) ** 3 * 1000 / (6 * PI * 1e-3 * 5e-7) * 1e9,
      sol: '$m = \\tfrac43\\pi a^3\\rho = \\tfrac43\\pi(5.0\\times10^{-7})^3\\times1000 = 5.24\\times10^{-16}$ kg; $\\gamma = 6\\pi\\eta a = 9.42\\times10^{-9}$ kg/s. $\\tau = 5.56\\times10^{-8}$ s $= 55.6$ ns (equivalently $2\\rho a^2/9\\eta$). On any microscope time scale the motion is diffusive.' },
    { id: 'netfb-019', type: 'mcq', level: 3, exams: ['net'], sub: 'velocity autocorrelation',
      q: 'For the Langevin particle in equilibrium, the velocity autocorrelation function $\\langle v(0)v(t)\\rangle$ is',
      options: ['$\\dfrac{kT}{m}$ for all $t$', '$\\dfrac{kT}{m}\\delta(t)$', '$\\dfrac{kT}{\\gamma}e^{-t/\\tau}$', '$\\dfrac{kT}{m}e^{-|t|/\\tau}$ with $\\tau = m/\\gamma$'], answer: 3,
      sol: 'Multiplying the Langevin equation by $v(0)$ and averaging (the future noise is uncorrelated with $v(0)$) gives $\\dfrac{d}{dt}\\langle v(0)v(t)\\rangle = -\\dfrac1\\tau\\langle v(0)v(t)\\rangle$, with initial value $kT/m$. Green-Kubo: $D = \\int_0^\\infty\\langle v(0)v(t)\\rangle dt = \\dfrac{kT}{m}\\tau = \\dfrac{kT}{\\gamma}$, recovering Einstein.' },
    { id: 'netfb-020', type: 'nat', level: 3, exams: ['net'], sub: 'sedimentation',
      q: 'Colloidal spheres of radius 0.20 $\\mu$m, denser than water by 200 kg/m$^3$, settle in equilibrium at 300 K. Their concentration falls by $1/e$ over a height of ______ $\\mu$m (to the nearest whole number). ($g = 9.8$ m/s$^2$.)',
      answer: 63, tol: 1, calc: () => KB * 300 / (4 / 3 * PI * (2e-7) ** 3 * 200 * 9.8) * 1e6,
      sol: 'Barometric law with buoyancy: $n(h) = n_0e^{-m_{eff}gh/kT}$, $m_{eff} = \\tfrac43\\pi a^3\\Delta\\rho = 3.35\\times10^{-20}\\times200 = 6.70\\times10^{-18}$ kg. Scale height $kT/m_{eff}g = 4.142\\times10^{-21}/6.57\\times10^{-17} = 6.3\\times10^{-5}$ m $= 63\\ \\mu$m. Perrin found $k$ (and $N_A$) from such profiles.',
      trap: 'Use the buoyant (excess) mass, not the full mass of the sphere.' },
    { id: 'netfb-021', type: 'nat', level: 3, exams: ['net'], sub: 'shot noise',
      q: 'A current of 1.0 mA of independent electrons is measured with 1.0 MHz bandwidth. The rms shot-noise current $\\sqrt{2eI\\Delta f}$ is ______ nA (to one decimal place).',
      answer: 17.9, tol: 0.1, calc: () => Math.sqrt(2 * E * 1e-3 * 1e6) * 1e9,
      sol: '$i_{rms} = \\sqrt{2\\times1.602\\times10^{-19}\\times10^{-3}\\times10^6} = \\sqrt{3.20\\times10^{-16}} = 1.79\\times10^{-8}$ A. It comes from the Poisson arrival of discrete charges; it measures $e$ (or $e^*$, e.g. $e/3$ in the fractional quantum Hall effect).' },
    { id: 'netfb-022', type: 'mcq', level: 3, exams: ['net'], sub: 'number fluctuations',
      q: 'A gas sample has isothermal compressibility $\\kappa_T$. Near its liquid-gas critical point, the relative number fluctuation $\\langle(\\Delta N)^2\\rangle/\\langle N\\rangle$ in a fixed subvolume',
      options: ['tends to zero', 'stays equal to 1, as in an ideal gas', 'diverges, because $\\kappa_T\\to\\infty$', 'becomes negative'], answer: 2,
      sol: '$\\dfrac{\\langle(\\Delta N)^2\\rangle}{\\langle N\\rangle} = nkT\\kappa_T$, which is 1 for an ideal gas ($\\kappa_T = 1/P$). At the critical point $(\\partial P/\\partial V)_T = 0$, so $\\kappa_T\\to\\infty$ and the density fluctuations become macroscopic, scattering light strongly: critical opalescence.' },
    { id: 'netfb-023', type: 'nat', level: 3, exams: ['net'], sub: 'Einstein relation',
      q: 'A K$^+$ ion in water has electrical mobility $7.62\\times10^{-8}$ m$^2$ V$^{-1}$ s$^{-1}$ at 298 K. From the Einstein relation $D = \\mu kT/e$, its diffusion constant is ______ $\\times10^{-9}$ m$^2$/s (to two decimal places).',
      answer: 1.96, tol: 0.01, calc: () => 7.62e-8 * KB * 298.15 / E * 1e9,
      sol: '$kT/e = 1.381\\times10^{-23}\\times298.15/1.602\\times10^{-19} = 25.7$ mV. $D = 7.62\\times10^{-8}\\times0.0257 = 1.96\\times10^{-9}$ m$^2$/s (measured: 1.96). The same relation (Nernst-Einstein) links diffusion and drift of carriers in semiconductors.' },
    { id: 'netfb-024', type: 'msq', level: 3, exams: ['net'], sub: 'diffusion equation',
      q: 'The concentration $n(x, t)$ obeys $\\partial_tn = D\\partial_x^2n$. Which statements are correct?',
      options: ['A point release spreads as a Gaussian whose width grows as $\\sqrt t$', 'The total amount $\\int n\\,dx$ is conserved', 'A sinusoidal profile $\\cos kx$ decays with rate $Dk^2$, so short wavelengths die fastest', 'The peak concentration of a point release stays constant'], answer: [0, 1, 2],
      sol: 'Fick\'s law $J = -D\\partial_xn$ with continuity gives the equation, so $\\int n\\,dx$ is conserved. The Gaussian $e^{-x^2/4Dt}/\\sqrt{4\\pi Dt}$ has width $\\sqrt{2Dt}$ and peak $\\propto t^{-1/2}$, which falls. A mode $\\cos kx$ decays as $e^{-Dk^2t}$.' },
    { id: 'netfb-025', type: 'nat', level: 3, exams: ['net'], sub: 'polymers',
      q: 'A freely jointed polymer has 1000 segments of 0.50 nm. Its radius of gyration, $R_g = R_{rms}/\\sqrt6$, is ______ nm (to two decimal places).',
      answer: 6.45, tol: 0.02, calc: () => Math.sqrt(1000) * 0.5 / Math.sqrt(6),
      sol: '$R_{rms} = b\\sqrt N = 0.50\\times31.62 = 15.81$ nm. For a Gaussian chain $R_g^2 = \\dfrac{Nb^2}{6}$, so $R_g = 15.81/2.449 = 6.45$ nm. In a good solvent excluded volume swells the chain to $R\\propto N^{0.588}$ (Flory: $N^{3/5}$).' },
    { id: 'netfb-026', type: 'mcq', level: 3, exams: ['net'], sub: 'Johnson noise',
      q: 'A resistor $R$ at temperature $T$ is connected to a capacitor $C$. The mean square voltage across the capacitor is',
      options: ['$4kTR\\Delta f$, growing with bandwidth', '$kT/C$, independent of $R$', '$kTRC$', 'zero, since the circuit is in equilibrium'], answer: 1,
      sol: 'Equipartition for the single quadratic degree of freedom: $\\tfrac12C\\langle V^2\\rangle = \\tfrac12kT$, so $\\langle V^2\\rangle = kT/C$. Check: integrate $4kTR$ over the $RC$ filter, $\\int_0^\\infty\\dfrac{4kTR\\,df}{1 + (2\\pi fRC)^2} = \\dfrac{kT}{C}$. This "kTC noise" limits charge-sensing circuits.' },
    { id: 'netfb-027', type: 'nat', level: 3, exams: ['net'], sub: 'activated escape',
      q: 'A thermally activated process has rate $\\propto e^{-\\Delta U/kT}$ with $\\Delta U = 0.50$ eV. Raising the temperature from 300 K to 310 K multiplies the rate by ______ (to two decimal places).',
      answer: 1.87, tol: 0.01, calc: () => Math.exp(0.5 / 8.617333262e-5 * (1 / 300 - 1 / 310)),
      sol: 'Ratio $= \\exp\\left[\\dfrac{\\Delta U}{k}\\left(\\dfrac1{300} - \\dfrac1{310}\\right)\\right]$. $\\Delta U/k = 0.50/8.617\\times10^{-5} = 5802$ K and $1/300 - 1/310 = 1.075\\times10^{-4}$ K$^{-1}$, so the exponent is 0.624 and the ratio $e^{0.624} = 1.87$. (Kramers: the prefactor also depends on the friction.)' },
    { id: 'netfb-028', type: 'mcq', level: 3, exams: ['net'], sub: 'Fokker-Planck',
      q: 'An overdamped particle in a potential $U(x)$ with mobility $1/\\gamma$ and diffusion constant $D = kT/\\gamma$ has probability density obeying the Smoluchowski equation $\\partial_tP = \\partial_x\\left[\\dfrac{U\'(x)}{\\gamma}P + D\\partial_xP\\right]$. Its stationary solution is',
      options: ['uniform in $x$', '$P\\propto e^{+U/kT}$', '$P\\propto e^{-U/kT}$, the Boltzmann distribution', '$P\\propto U(x)$'], answer: 2,
      sol: 'Zero current: $\\dfrac{U\'}{\\gamma}P + \\dfrac{kT}{\\gamma}P\' = 0$, so $P\'/P = -U\'/kT$ and $P\\propto e^{-U/kT}$. That this comes out right is exactly why $D$ must equal $kT/\\gamma$ (Einstein relation).' },

    // ---------- level 4 ----------
    { id: 'netfb-029', type: 'nat', level: 4, exams: ['net'], sub: 'Langevin equation',
      q: 'For the Langevin particle, $\\langle x^2\\rangle = 2D\\left[t - \\tau(1 - e^{-t/\\tau})\\right]$. At $t = \\tau$, what fraction of the long-time diffusive value $2Dt$ has been reached? Answer to three decimal places.',
      answer: 0.368, tol: 0.001, calc: () => 1 - (1 - Math.exp(-1)),
      sol: 'At $t = \\tau$: $\\langle x^2\\rangle = 2D\\tau[1 - (1 - e^{-1})] = 2D\\tau e^{-1}$. Divided by $2D\\tau$: $e^{-1} = 0.368$. (Ballistic $\\tfrac{kT}{m}t^2 = 2D\\tau\\cdot\\tfrac12$ would give 0.5: the crossover is gradual.)' },
    { id: 'netfb-030', type: 'mcq', level: 4, exams: ['net'], sub: 'spectral density',
      q: 'The velocity of a Langevin particle has autocorrelation $\\dfrac{kT}{m}e^{-|t|/\\tau}$. By the Wiener-Khinchin theorem its power spectrum $S_v(\\omega)$ is',
      options: ['flat (white) at all frequencies', 'a Gaussian in $\\omega$', 'a delta function at $\\omega = 1/\\tau$', 'a Lorentzian $\\propto\\dfrac{1}{1 + \\omega^2\\tau^2}$, flat below $1/\\tau$ and falling as $\\omega^{-2}$ above'], answer: 3,
      sol: '$\\displaystyle\\int_{-\\infty}^{\\infty}e^{-|t|/\\tau}e^{i\\omega t}dt = \\dfrac{2\\tau}{1 + \\omega^2\\tau^2}$. Below the corner frequency the velocity looks white (diffusion); above it inertia filters the white force noise. The position spectrum is $S_v/\\omega^2$.' },
    { id: 'netfb-031', type: 'nat', level: 4, exams: ['net'], sub: 'Perrin and Avogadro',
      q: 'A Brownian sphere of radius 0.50 $\\mu$m in water ($\\eta = 1.0\\times10^{-3}$ Pa s, 300 K) shows $\\langle x^2\\rangle = 5.0\\times10^{-11}$ m$^2$ after 60 s. Using $N_A = \\dfrac{RT}{6\\pi\\eta aD}$ with $R = 8.314$ J mol$^{-1}$K$^{-1}$, the inferred Avogadro number is ______ $\\times10^{23}$ mol$^{-1}$ (to two decimal places).',
      answer: 6.35, tol: 0.03, calc: () => 8.314 * 300 / (6 * PI * 1e-3 * 5e-7 * (5e-11 / 120)) / 1e23,
      sol: '$D = \\langle x^2\\rangle/2t = 5.0\\times10^{-11}/120 = 4.17\\times10^{-13}$ m$^2$/s. $N_A = \\dfrac{8.314\\times300}{9.425\\times10^{-9}\\times4.17\\times10^{-13}} = \\dfrac{2494}{3.93\\times10^{-21}} = 6.35\\times10^{23}$ mol$^{-1}$, within 5% of the true value: Perrin\'s 1908 argument for atoms.' },
    { id: 'netfb-032', type: 'msq', level: 4, exams: ['net'], sub: 'fluctuation-dissipation',
      q: 'Which statements about the fluctuation-dissipation theorem are correct?',
      options: ['It relates the spontaneous equilibrium fluctuations of a quantity to the dissipative part of its linear response', 'Johnson noise $4kTR$ and the Einstein relation $D = kT/\\gamma$ are both instances of it', 'It holds only far from equilibrium', 'At high frequency or low temperature, the quantum version replaces $kT$ by $\\tfrac{\\hbar\\omega}{2}\\coth\\tfrac{\\hbar\\omega}{2kT}$'], answer: [0, 1, 3],
      sol: 'The FDT is an equilibrium (linear-response) theorem: $S_x(\\omega) = \\dfrac{2kT}{\\omega}\\text{Im}\\,\\chi(\\omega)$ classically. Johnson noise (voltage fluctuations vs resistance) and Einstein\'s relation (diffusion vs friction) follow from it. Quantum mechanically $kT\\to\\tfrac{\\hbar\\omega}2\\coth(\\hbar\\omega/2kT)$, which includes zero-point fluctuations.' },
    { id: 'netfb-033', type: 'nat', level: 4, exams: ['net'], sub: 'diffusion',
      q: 'A small molecule ($D = 1.0\\times10^{-9}$ m$^2$/s) diffuses in three dimensions. The time for its rms distance from the start to reach 1.0 mm is ______ s (to the nearest whole number).',
      answer: 167, tol: 1, calc: () => 1e-6 / (6 * 1e-9),
      sol: '$\\langle r^2\\rangle = 6Dt$, so $t = r^2/6D = 10^{-6}/(6\\times10^{-9}) = 167$ s. Diffusion over 1 $\\mu$m takes only $1.7\\times10^{-4}$ s: that is why cells are small and larger organisms need circulation.',
      trap: 'With the 1D formula $2Dt$ you would get 500 s.' },
    { id: 'netfb-034', type: 'mcq', level: 4, exams: ['net'], sub: 'ensembles',
      q: 'In the microcanonical ensemble the energy is fixed, but in the canonical ensemble it fluctuates. Thermodynamic predictions from the two agree for large $N$ because',
      options: ['the canonical energy distribution is sharply peaked, with relative width $\\sim N^{-1/2}$, as long as $C_V$ is finite', 'the canonical ensemble has no fluctuations at all', 'they agree only for ideal gases', 'the microcanonical entropy is not extensive'], answer: 0,
      sol: '$\\Delta E/\\langle E\\rangle = \\sqrt{kT^2C_V}/\\langle E\\rangle\\sim N^{1/2}/N$. The ensembles differ where $C_V$ diverges or is negative: at critical points and for self-gravitating systems (which have negative microcanonical heat capacity and no stable canonical description).' },
    { id: 'netfb-035', type: 'nat', level: 4, exams: ['net'], sub: 'random walk',
      q: 'A biased one-dimensional walker steps $+l$ with probability 0.6 and $-l$ with probability 0.4, every $\\Delta t$. After $N = 400$ steps, the ratio of the standard deviation of its position to its mean displacement is ______ (to three decimal places).',
      answer: 0.245, tol: 0.001, calc: () => Math.sqrt(400 * (1 - 0.04)) / (400 * 0.2),
      sol: 'Each step has mean $(0.6 - 0.4)l = 0.2l$ and variance $l^2 - (0.2l)^2 = 0.96l^2$. After $N$ steps: mean $0.2Nl = 80l$, variance $0.96Nl^2 = 384l^2$, standard deviation $19.6l$. Ratio $19.6/80 = 0.245$. Drift grows as $N$, spread as $\\sqrt N$, so drift wins eventually.' },
    { id: 'netfb-036', type: 'mcq', level: 4, exams: ['net'], sub: 'first passage',
      q: 'An unbiased random walker on an infinite line starts at the origin. Which statement is correct?',
      options: ['It returns to the origin with probability 1, but the mean return time is infinite', 'It returns with probability about 0.34, as in three dimensions', 'It never returns', 'It returns with probability 1 and mean time 2 steps'], answer: 0,
      sol: 'Pólya\'s theorem: in one and two dimensions a simple random walk is recurrent (returns with certainty), in three dimensions transient (return probability 0.34). In 1D the first-return probability decays as $t^{-3/2}$, so the mean return time $\\sum t\\cdot t^{-3/2}$ diverges.' },
    // ---------- level 5 ----------
    { id: 'netfb-037', type: 'nat', level: 5, exams: ['net'], sub: 'energy fluctuations',
      q: 'A quantum two-level system with gap $\\varepsilon$ is in contact with a bath at $kT = \\varepsilon$. Using $\\langle(\\Delta E)^2\\rangle = kT^2C$, the rms energy fluctuation is ______ $\\varepsilon$ (to three decimal places).',
      answer: 0.443, tol: 0.002, calc: () => { const x = 1; return Math.sqrt(Math.exp(x)) / (1 + Math.exp(x)); },
      sol: 'With levels 0 and $\\varepsilon$, the excited probability is $p = 1/(e^x + 1)$ with $x = \\varepsilon/kT$, and $E$ is a two-valued (Bernoulli) variable: $\\langle(\\Delta E)^2\\rangle = \\varepsilon^2p(1 - p) = \\varepsilon^2\\dfrac{e^x}{(1 + e^x)^2}$, which is exactly $kT^2C$ with the Schottky heat capacity $C = kx^2e^x/(1 + e^x)^2$. At $x = 1$: $\\Delta E_{rms} = \\varepsilon\\sqrt e/(1 + e) = 1.6487/3.7183\\,\\varepsilon = 0.443\\,\\varepsilon$.',
      trap: 'A single small system has fluctuations comparable to its mean energy; only large $N$ makes them negligible.' },
    { id: 'netfb-038', type: 'mcq', level: 5, exams: ['net'], sub: 'optical trap',
      q: 'An overdamped bead (friction $\\gamma$) sits in an optical trap of stiffness $\\kappa$, so $\\gamma\\dot x = -\\kappa x + F(t)$. Its position autocorrelation $\\langle x(0)x(t)\\rangle$ decays with time constant',
      options: ['$m/\\gamma$', '$\\sqrt{m/\\kappa}$', '$\\gamma/\\kappa$', '$\\kappa/\\gamma$'], answer: 2,
      sol: 'This is the Ornstein-Uhlenbeck process: $\\langle x(0)x(t)\\rangle = \\dfrac{kT}{\\kappa}e^{-\\kappa t/\\gamma}$, with equipartition fixing the amplitude. The power spectrum is a Lorentzian with corner frequency $f_c = \\kappa/2\\pi\\gamma$; fitting it calibrates the trap. Inertia ($m/\\gamma\\sim10^{-7}$ s) is negligible here.' },
    { id: 'netfb-039', type: 'nat', level: 5, exams: ['net'], sub: 'optical trap',
      q: 'A bead of radius 0.50 $\\mu$m in water ($\\eta = 1.0\\times10^{-3}$ Pa s) is held in a trap of stiffness $1.0\\times10^{-5}$ N/m. The corner frequency $f_c = \\kappa/2\\pi\\gamma$ of its position spectrum is ______ Hz (to the nearest whole number).',
      answer: 169, tol: 1, calc: () => 1e-5 / (2 * PI * 6 * PI * 1e-3 * 5e-7),
      sol: '$\\gamma = 6\\pi\\eta a = 9.42\\times10^{-9}$ kg/s. $f_c = \\dfrac{1.0\\times10^{-5}}{2\\pi\\times9.42\\times10^{-9}} = 169$ Hz. The rms position is $\\sqrt{kT/\\kappa} = 20$ nm at 300 K.' },
    { id: 'netfb-040', type: 'msq', level: 5, exams: ['net'], sub: 'random walk',
      q: 'Which statements about random walks are correct?',
      options: ['$\\langle R^2\\rangle = Nl^2$ for uncorrelated steps in any number of dimensions', 'For large $N$ the end-point distribution is Gaussian in every dimension (finite step variance)', 'The path of a random walk has fractal dimension 2', 'A self-avoiding walk in 3D also has $R\\propto N^{1/2}$'], answer: [0, 1, 2],
      sol: 'Cross terms vanish whatever the dimension, so $\\langle R^2\\rangle = Nl^2$; the central limit theorem gives a Gaussian. Since $N\\propto R^2$ (mass $\\propto$ size squared), the trail has fractal dimension 2. Excluding self-intersection swells the walk: $R\\propto N^\\nu$ with $\\nu\\approx0.588$ in 3D (Flory 3/5) and exactly 3/4 in 2D.' },
    { id: 'netfb-041', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'Brownian motion',
      q: 'The erratic motion of pollen grains (Brownian motion) is caused by',
      options: ['convection currents in the water', 'the grains being alive', 'light pressure from the microscope lamp', 'unbalanced impacts of the surrounding molecules, which do not average out for a small particle over short times'], answer: 3,
      sol: 'Each grain is hit about $10^{20}$ times per second; the net force averages to zero but fluctuates. Einstein (1905) showed the resulting $\\langle x^2\\rangle = 2Dt$ with $D = kT/6\\pi\\eta a$, and Perrin\'s measurements of it convinced physicists that atoms exist. Dead or inorganic particles move the same way.' },
    { id: 'netfb-042', type: 'nat', level: 3, exams: ['net'], sub: 'Johnson noise',
      q: 'A 1.0 pF capacitor is in equilibrium with resistors at 300 K. The rms thermal voltage across it, $\\sqrt{kT/C}$, is ______ $\\mu$V (to one decimal place).',
      answer: 64.4, tol: 0.1, calc: () => Math.sqrt(KB * 300 / 1e-12) * 1e6,
      sol: '$\\sqrt{kT/C} = \\sqrt{4.142\\times10^{-21}/10^{-12}} = 6.44\\times10^{-5}$ V $= 64.4\\ \\mu$V, independent of the resistance. The equivalent rms charge is $\\sqrt{kTC} = 6.4\\times10^{-17}$ C, about 400 electrons.' },
    ...more2,
  ],
  gens: [
    { id: 'netfb-g01', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Einstein relation',
      make(r) {
        const a = choose(r, [0.05, 0.1, 0.25, 0.5, 1, 2]), F = choose(r, [['water', 1.0e-3], ['glycerol-water mixture', 1.0e-2], ['ethanol', 1.1e-3], ['air', 1.8e-5]]), T = choose(r, [280, 293, 300, 310]);
        const D = KB * T / (6 * PI * F[1] * a * 1e-6), e10 = Math.floor(Math.log10(D)), man = D / 10 ** e10;
        return { q: `A sphere of radius ${a} $\\mu$m moves in ${F[0]} (viscosity ${F[1]} Pa s) at ${T} K. Its Stokes-Einstein diffusion constant is ______ $\\times10^{${e10}}$ m$^2$/s (two decimal places).`,
          answer: round(man, 2), tol: Math.max(0.01, man * 0.006), a, eta: F[1], T, e10,
          sol: `$D = \\dfrac{kT}{6\\pi\\eta a} = \\dfrac{1.381\\times10^{-23}\\times${T}}{6\\pi\\times${F[1]}\\times${a}\\times10^{-6}} = ${man.toFixed(3)}\\times10^{${e10}}$ m$^2$/s.${F[0] === 'air' ? ' (In air a sub-micron sphere is also affected by slip; ignore that here.)' : ''}`,
          trap: 'Use the radius, not the diameter, in $6\\pi\\eta a$.' };
      },
      verify: (p) => KB * p.T / (6 * PI * p.eta * p.a * 1e-6) / 10 ** p.e10 },
    { id: 'netfb-g02', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'diffusion',
      make(r) {
        const D = choose(r, [1e-9, 2e-9, 5e-10, 4.4e-13, 1e-12]), t = choose(r, [1, 10, 60, 600, 3600]), d = choose(r, [1, 2, 3]);
        const val = Math.sqrt(2 * d * D * t) * 1e6;
        return { q: `A particle with diffusion constant $${D.toExponential(1).replace('e-', '\\times10^{-')}}$ m$^2$/s diffuses ${d === 1 ? 'along a line (one axis)' : d === 2 ? 'on a surface (two dimensions)' : 'in three dimensions'}. Its rms distance from the start after ${t} s is ______ $\\mu$m (three significant figures).`,
          answer: +val.toPrecision(3), tol: val * 0.01, D, t, d,
          sol: `$\\langle r^2\\rangle = 2dDt = ${2 * d}\\times${D}\\times${t} = ${(2 * d * D * t).toExponential(3)}$ m$^2$, so $r_{rms} = ${val.toPrecision(4)}\\ \\mu$m.`,
          trap: `In $d$ dimensions the factor is $2d$: here ${2 * d}.` };
      },
      verify: (p) => Math.sqrt(2 * p.d * p.D * p.t) * 1e6 },
    { id: 'netfb-g03', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Johnson noise',
      make(r) {
        const R = choose(r, [50, 1e3, 1e4, 1e5, 1e6]), T = choose(r, [4.2, 77, 300, 400]), df = choose(r, [1e3, 1e4, 1e5, 1e6]), ask = choose(r, ['V', 'V', 'T']);
        const V = Math.sqrt(4 * KB * T * R * df);
        if (ask === 'T') {
          const Vn = +(V * 1e9).toPrecision(3);
          return { q: `A ${R} $\\Omega$ resistor shows an rms noise voltage of ${Vn} nV in a ${df} Hz bandwidth. Assuming pure Johnson noise, its temperature is ______ K (three significant figures).`,
            answer: +((Vn * 1e-9) ** 2 / (4 * KB * R * df)).toPrecision(3), tol: T * 0.01, ask, Vn, R, df,
            sol: `$T = \\dfrac{V^2}{4kR\\Delta f} = \\dfrac{(${Vn}\\times10^{-9})^2}{4\\times1.381\\times10^{-23}\\times${R}\\times${df}} = ${((Vn * 1e-9) ** 2 / (4 * KB * R * df)).toPrecision(4)}$ K. Johnson-noise thermometry needs no calibration.`,
            trap: 'Noise power, not voltage, is proportional to $T$.' };
        }
        return { q: `Find the rms Johnson-Nyquist noise voltage of a ${R} $\\Omega$ resistor at ${T} K in a bandwidth of ${df} Hz, in nV (three significant figures).`,
          answer: +(V * 1e9).toPrecision(3), tol: V * 1e9 * 0.01, ask, R, T, df,
          sol: `$V_{rms} = \\sqrt{4kTR\\Delta f} = \\sqrt{4\\times1.381\\times10^{-23}\\times${T}\\times${R}\\times${df}} = ${(V * 1e9).toPrecision(4)}$ nV.`,
          trap: 'Noise voltage grows as the square root of $T$, $R$ and bandwidth.' };
      },
      verify: (p) => p.ask === 'T' ? (p.Vn * 1e-9) ** 2 / (4 * KB * p.R * p.df) : Math.sqrt(4 * KB * p.T * p.R * p.df) * 1e9 },
    { id: 'netfb-g04', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'shot noise',
      make(r) {
        const I = choose(r, [1e-9, 1e-6, 1e-4, 1e-3, 1e-2]), df = choose(r, [1e3, 1e5, 1e6, 1e7]);
        const val = Math.sqrt(2 * E * I * df), e10 = Math.floor(Math.log10(val)), man = val / 10 ** e10;
        return { q: `A current of $${I.toExponential(0).replace('e-', '\\times10^{-')}}$ A of independently arriving electrons is measured with bandwidth $${df.toExponential(0).replace('e+', '\\times10^{')}}$ Hz. The rms shot-noise current is ______ $\\times10^{${e10}}$ A (two decimal places).`,
          answer: round(man, 2), tol: Math.max(0.01, man * 0.006), I, df, e10,
          sol: `$i_{rms} = \\sqrt{2eI\\Delta f} = ${man.toFixed(3)}\\times10^{${e10}}$ A; the relative noise $i_{rms}/I = ${(val / I).toExponential(2)}$ grows as the current falls.`,
          trap: 'Shot noise needs discrete, uncorrelated charges; it does not depend on temperature.' };
      },
      verify: (p) => Math.sqrt(2 * E * p.I * p.df) / 10 ** p.e10 },
    { id: 'netfb-g05', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'equipartition fluctuations',
      make(r) {
        const kind = choose(r, ['spring', 'cap', 'torsion']), T = choose(r, [4, 77, 300]);
        if (kind === 'spring') {
          const k = choose(r, [0.01, 0.1, 1, 40]), val = Math.sqrt(KB * T / k) * 1e12;
          return { q: `A cantilever of spring constant ${k} N/m is at ${T} K. Its rms thermal deflection is ______ pm (three significant figures).`, answer: +val.toPrecision(3), tol: val * 0.01, kind, k, T,
            sol: `$\\tfrac12k_s\\langle x^2\\rangle = \\tfrac12kT$, so $x_{rms} = \\sqrt{kT/k_s} = ${val.toPrecision(4)}$ pm.`, trap: 'Equipartition gives $\\tfrac12kT$ per quadratic term.' };
        }
        if (kind === 'cap') {
          const Cc = choose(r, [0.1, 1, 10, 100]), val = Math.sqrt(KB * T / (Cc * 1e-12)) * 1e6;
          return { q: `A ${Cc} pF capacitor is in equilibrium at ${T} K. The rms thermal voltage across it is ______ $\\mu$V (three significant figures).`, answer: +val.toPrecision(3), tol: val * 0.01, kind, Cc, T,
            sol: `$\\tfrac12C\\langle V^2\\rangle = \\tfrac12kT$: $V_{rms} = \\sqrt{kT/C} = ${val.toPrecision(4)}\\ \\mu$V, whatever the resistance.`, trap: 'The resistance sets the bandwidth but not the total noise.' };
        }
        const K = choose(r, [1e-13, 1e-12, 1e-11]), val = Math.sqrt(KB * T / K) * 1e6;
        return { q: `A torsion pendulum with torsion constant $${K.toExponential(0).replace('e-', '\\times10^{-')}}$ N m/rad hangs in gas at ${T} K. Its rms angular deflection is ______ $\\mu$rad (three significant figures).`, answer: +val.toPrecision(3), tol: val * 0.01, kind, K, T,
          sol: `$\\tfrac12\\kappa\\langle\\theta^2\\rangle = \\tfrac12kT$, so $\\theta_{rms} = \\sqrt{kT/\\kappa} = ${val.toPrecision(4)}\\ \\mu$rad (Kappler, 1931, measured $k$ this way).`, trap: 'The gas pressure changes how fast it jitters, not how much.' };
      },
      verify: (p) => p.kind === 'spring' ? Math.sqrt(KB * p.T / p.k) * 1e12 : p.kind === 'cap' ? Math.sqrt(KB * p.T / (p.Cc * 1e-12)) * 1e6 : Math.sqrt(KB * p.T / p.K) * 1e6 },
    { id: 'netfb-g06', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'random walk',
      make(r) {
        const N = choose(r, [6, 8, 10, 12, 16, 20]), m = 2 * int(r, 0, 3);
        const val = binom(N, (N + m) / 2) / 2 ** N;
        return { q: `A one-dimensional walker takes ${N} unit steps, each $+1$ or $-1$ with probability 1/2. The probability that it ends at position $+${m}$ is ______ (four decimal places).`,
          answer: round(val, 4), tol: 0.0002, N, m,
          sol: `It needs $(N + m)/2 = ${(N + m) / 2}$ steps right: $P = \\binom{${N}}{${(N + m) / 2}}/2^{${N}} = ${binom(N, (N + m) / 2)}/${2 ** N} = ${round(val, 5)}$.`,
          trap: 'Positions of the opposite parity to $N$ are impossible.' };
      },
      verify: (p) => binom(p.N, (p.N + p.m) / 2) / 2 ** p.N },
    { id: 'netfb-g07', type: 'nat', level: 3, exams: ['net'], sub: 'energy fluctuations',
      make(r) {
        const S = choose(r, [['monatomic ideal gas', 1.5], ['diatomic ideal gas (rotations active)', 2.5], ['classical harmonic solid (Dulong-Petit)', 3]]), N = choose(r, [100, 1e3, 1e4, 1e6]);
        const val = 1 / Math.sqrt(S[1] * N);
        return { q: `A ${S[0]} of $N = ${N >= 1e4 ? N.toExponential(0).replace('e+', '\\times10^{') + '}' : N}$ particles is in a heat bath. Find $\\Delta E_{rms}/\\langle E\\rangle$ in the canonical ensemble (three significant figures).`,
          answer: +val.toPrecision(3), tol: val * 0.01, f: S[1], N,
          sol: `$\\langle E\\rangle = fNkT$ and $C_V = fNk$ with $f = ${S[1]}$, so $\\Delta E_{rms}/\\langle E\\rangle = \\sqrt{kT^2C_V}/\\langle E\\rangle = 1/\\sqrt{fN} = ${val.toPrecision(4)}$.`,
          trap: 'The relative fluctuation falls as $N^{-1/2}$.' };
      },
      verify: (p) => 1 / Math.sqrt(p.f * p.N) },
    { id: 'netfb-g08', type: 'nat', level: 3, exams: ['net'], sub: 'sedimentation',
      make(r) {
        const a = choose(r, [0.1, 0.2, 0.3, 0.5]), dr = choose(r, [50, 100, 200, 1000]), T = choose(r, [290, 300]);
        const val = KB * T / (4 / 3 * PI * (a * 1e-6) ** 3 * dr * 9.8) * 1e6;
        return { q: `Spheres of radius ${a} $\\mu$m, denser than the liquid by ${dr} kg/m$^3$, reach sedimentation equilibrium at ${T} K. The height over which their concentration falls by $1/e$ is ______ $\\mu$m (three significant figures). ($g = 9.8$ m/s$^2$.)`,
          answer: +val.toPrecision(3), tol: val * 0.01, a, dr, T,
          sol: `$h = \\dfrac{kT}{m_{eff}g}$ with $m_{eff} = \\tfrac43\\pi a^3\\Delta\\rho = ${(4 / 3 * PI * (a * 1e-6) ** 3 * dr).toExponential(3)}$ kg: $h = ${val.toPrecision(4)}\\ \\mu$m.`,
          trap: 'Doubling the radius cuts the scale height by 8.' };
      },
      verify: (p) => KB * p.T / (4 / 3 * PI * (p.a * 1e-6) ** 3 * p.dr * 9.8) * 1e6 },
    { id: 'netfb-g09', type: 'nat', level: 3, exams: ['net'], sub: 'activated escape',
      make(r) {
        const U = choose(r, [0.3, 0.5, 0.7, 1.0]), T1 = choose(r, [280, 300, 350]), dT = choose(r, [5, 10, 20]);
        const val = Math.exp(U / 8.617333262e-5 * (1 / T1 - 1 / (T1 + dT)));
        return { q: `A process with activation energy ${U} eV has rate $\\propto e^{-\\Delta U/kT}$. By what factor does the rate grow when $T$ rises from ${T1} K to ${T1 + dT} K? (three significant figures)`,
          answer: +val.toPrecision(3), tol: val * 0.01, U, T1, dT,
          sol: `Factor $= \\exp\\left[\\dfrac{\\Delta U}{k}\\left(\\dfrac1{${T1}} - \\dfrac1{${T1 + dT}}\\right)\\right]$ with $\\Delta U/k = ${round(U / 8.617333262e-5, 1)}$ K: exponent $${round(Math.log(val), 4)}$, factor $${val.toPrecision(4)}$.`,
          trap: 'Use $k = 8.617\\times10^{-5}$ eV/K with energies in eV.' };
      },
      verify: (p) => Math.exp(p.U / 8.617333262e-5 * (1 / p.T1 - 1 / (p.T1 + p.dT))) },
    { id: 'netfb-g10', type: 'nat', level: 3, exams: ['net'], sub: 'random walk',
      make(r) {
        const p = choose(r, [0.55, 0.6, 0.7, 0.75]), N = choose(r, [100, 400, 900, 2500]), ask = choose(r, ['mean', 'sd', 'ratio']);
        const mu = (2 * p - 1) * N, sd = Math.sqrt(N * (1 - (2 * p - 1) ** 2)), val = { mean: mu, sd, ratio: sd / mu }[ask];
        const txt = { mean: 'its mean position (in step lengths)', sd: 'the standard deviation of its position (in step lengths)', ratio: 'the ratio of the standard deviation to the mean position' }[ask];
        return { q: `A walker steps $+1$ with probability ${p} and $-1$ otherwise. After ${N} steps, find ${txt} (three significant figures).`,
          answer: +val.toPrecision(3), tol: Math.abs(val) * 0.01, pr: p, N, ask,
          sol: `Per step: mean $2p - 1 = ${round(2 * p - 1, 3)}$, variance $1 - (2p - 1)^2 = ${round(1 - (2 * p - 1) ** 2, 4)}$. After $N$: mean $${round(mu, 2)}$, s.d. $\\sqrt{${round(N * (1 - (2 * p - 1) ** 2), 2)}} = ${sd.toPrecision(4)}$. Answer: $${val.toPrecision(4)}$.`,
          trap: 'Variance per step is $4p(1 - p)$, not $p(1 - p)$, for steps of $\\pm1$.' };
      },
      verify: (q) => { const mu = (2 * q.pr - 1) * q.N, sd = Math.sqrt(q.N * (1 - (2 * q.pr - 1) ** 2)); return { mean: mu, sd, ratio: sd / mu }[q.ask]; } },
    { id: 'netfb-g11', type: 'nat', level: 4, exams: ['net'], sub: 'Langevin equation',
      make(r) {
        const x = choose(r, [0.1, 0.5, 1, 2, 5, 10]);
        const val = (x - (1 - Math.exp(-x))) / x;
        return { q: `For a Langevin particle, $\\langle x^2\\rangle = 2D[t - \\tau(1 - e^{-t/\\tau})]$. At $t = ${x}\\tau$, what fraction of the diffusive value $2Dt$ has $\\langle x^2\\rangle$ reached? (four decimal places)`,
          answer: round(val, 4), tol: 0.0005, x,
          sol: `Fraction $= 1 - \\dfrac{1 - e^{-t/\\tau}}{t/\\tau} = 1 - \\dfrac{1 - e^{-${x}}}{${x}} = ${round(val, 5)}$.${x < 1 ? ' For $t\\ll\\tau$ it is about $t/2\\tau$: ballistic motion.' : ''}`,
          trap: 'The approach to normal diffusion is slow: the correction falls only as $\\tau/t$.' };
      },
      verify: (p) => (p.x - (1 - Math.exp(-p.x))) / p.x },
    { id: 'netfb-g12', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'fluctuations and response',
      make(r) {
        const P = choose(r, [
          ['In the canonical ensemble, $\\langle(\\Delta E)^2\\rangle$ equals', '$kT^2C_V$', ['$kTC_V$', '$k^2TC_V$', '$C_V/kT$']],
          ['In the grand canonical ensemble, $\\langle(\\Delta N)^2\\rangle$ equals', '$kT\\,(\\partial\\langle N\\rangle/\\partial\\mu)_{T,V}$', ['$kT\\,(\\partial\\mu/\\partial N)$', '$\\langle N\\rangle^2$', '$(\\partial\\langle N\\rangle/\\partial T)$']],
          ['For a magnet of total moment $M$ in field $H$ (energy $-MH$), $\\langle(\\Delta M)^2\\rangle$ equals', '$kT\\,\\partial\\langle M\\rangle/\\partial H$', ['$\\partial\\langle M\\rangle/\\partial T$', '$kT^2\\,\\partial\\langle M\\rangle/\\partial H$', '$\\langle M\\rangle^2/N$']],
          ['For a small body in contact with a large bath, $\\langle(\\Delta T)^2\\rangle$ is', '$kT^2/C_V$', ['$kT^2C_V$', '$kT/C_V$', 'zero']],
          ['For a classical ideal gas, $\\langle(\\Delta N)^2\\rangle/\\langle N\\rangle$ is', '1', ['0', '$\\langle N\\rangle$', '$1/\\langle N\\rangle$']],
        ]);
        const o = mcqOptions(r, P[1], P[2], (v) => v);
        return { q: P[0], ...o, sol: `The answer is ${P[1]}. Each extensive quantity fluctuates with variance $kT$ times its response to the conjugate field: $\\partial^2\\ln Z/\\partial(\\text{field}/kT)^2$.`,
          trap: 'Fluctuations are proportional to response functions; that is why they diverge at critical points.' };
      } },
    { id: 'netfb-g13', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'polymers',
      make(r) {
        const N = choose(r, [100, 400, 1000, 2500, 10000]), b = choose(r, [0.15, 0.3, 0.5, 1]), ask = choose(r, ['R', 'Rg']);
        const R = b * Math.sqrt(N), val = ask === 'R' ? R : R / Math.sqrt(6);
        return { q: `A freely jointed chain has ${N} segments of length ${b} nm. Find its ${ask === 'R' ? 'rms end-to-end distance' : 'radius of gyration ($R_g^2 = Nb^2/6$)'} in nm (three significant figures).`,
          answer: +val.toPrecision(3), tol: val * 0.01, N, b, ask,
          sol: `$R_{rms} = b\\sqrt N = ${b}\\times${round(Math.sqrt(N), 3)} = ${R.toPrecision(4)}$ nm${ask === 'Rg' ? `; $R_g = R_{rms}/\\sqrt6 = ${val.toPrecision(4)}$ nm` : ''}.`,
          trap: 'The size grows as $\\sqrt N$, not $N$.' };
      },
      verify: (p) => p.b * Math.sqrt(p.N) / (p.ask === 'R' ? 1 : Math.sqrt(6)) },
    ...more,
  ],
};
