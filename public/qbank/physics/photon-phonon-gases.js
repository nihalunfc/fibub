// Photon and phonon gases and Bose-Einstein condensation, from the statistical side: mode counting, Planck's law from
// Bose statistics with mu = 0, Stefan-Boltzmann and the photon-gas thermodynamics (n, u, P, S, adiabats), CMB numbers,
// the Debye T^3 law as a phonon gas, BEC in a box and in a harmonic trap. The JAM blackbody-radiation topic covers the
// radiation laws themselves; these questions are about the statistical derivation and its consequences.
// Original questions for GATE and CSIR NET practice (fibub), MSc level.
import { pick, int, choose, mcqOptions, round, C } from '../_util.js';
import more from './photon-phonon-gases.more.gen.js';

const Z3 = 1.2020569, Z32 = 2.6123753, Z52 = 1.3414873;
const aRad = (Math.PI ** 2 * C.kB ** 4) / (15 * C.hbar ** 3 * C.c ** 3); // J m^-3 K^-4
const nPh = (T) => (2 * Z3 / Math.PI ** 2) * (C.kB * T / (C.hbar * C.c)) ** 3; // photons per m^3
const planckX = (x) => x ** 3 / (Math.exp(x) - 1);
const sig = (x, n = 3) => Number(x.toPrecision(n));
const lamT = (m, T) => C.h / Math.sqrt(2 * Math.PI * m * C.kB * T);
const tcBox = (m, n) => (2 * Math.PI * C.hbar ** 2 / (m * C.kB)) * (n / Z32) ** (2 / 3);
const integ = (f, a, b, N = 2000) => { let s = 0; const h = (b - a) / N; for (let i = 0; i < N; i++) { const x = a + (i + 0.5) * h; s += f(x); } return s * h; };

export default {
  topic: 'photon-phonon-gases',
  items: [
    // ---- level 1 ----
    { id: 'phgas-001', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'photon gas',
      q: 'In the statistical treatment of blackbody radiation, the chemical potential of the photon gas is set to zero because',
      options: ['photons have zero rest mass', 'photons are fermions', 'the number of photons is not conserved: walls absorb and emit them freely', 'photons do not interact with matter'], answer: 2,
      sol: 'With $N$ free to adjust, equilibrium minimises $F$ with respect to $N$: $\\mu = (\\partial F/\\partial N)_{T,V} = 0$. Zero mass alone would not do it; conserved massless particles could have $\\mu \\neq 0$.',
      trap: 'Masslessness is not the reason; non-conservation of number is.' },
    { id: 'phgas-002', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'photon gas',
      q: 'The energy density of blackbody radiation in a cavity depends on the absolute temperature as',
      options: ['$T$', '$T^2$', '$T^3$', '$T^4$'], answer: 3,
      sol: '$u = \\int_0^\\infty \\frac{\\hbar\\omega\\,g(\\omega)}{e^{\\beta\\hbar\\omega} - 1}d\\omega$ with $g \\propto \\omega^2$; substituting $x = \\beta\\hbar\\omega$ pulls out $(kT)^4$: $u = aT^4$. The photon number density goes as $T^3$.' },
    { id: 'phgas-003', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'photon gas',
      q: 'The pressure of isotropic blackbody radiation of energy density $u$ is',
      options: ['$u/3$', '$2u/3$', '$u$', '$u/2$'], answer: 0,
      sol: 'For any gas with $\\varepsilon \\propto V^{-1/3}$ per mode (here $\\varepsilon = \\hbar ck$, $k \\propto L^{-1}$), $P = -\\partial U/\\partial V = U/3V$. Non-relativistic particles give $2u/3$.' },
    { id: 'phgas-004', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'mode counting',
      q: 'The number of electromagnetic modes per unit volume of a large cavity with frequency between $\\nu$ and $\\nu + d\\nu$ (both polarisations) is',
      options: ['$4\\pi\\nu^2d\\nu/c^3$', '$8\\pi\\nu^2d\\nu/c^3$', '$8\\pi\\nu\\,d\\nu/c^2$', '$8\\pi\\nu^3d\\nu/c^3$'], answer: 1,
      sol: 'Modes fill $k$-space with density $V/(2\\pi)^3$. A shell holds $4\\pi k^2dk\\,V/(2\\pi)^3$; with $k = 2\\pi\\nu/c$ and 2 polarisations: $8\\pi\\nu^2d\\nu/c^3$ per unit volume.',
      trap: 'Forgetting the two transverse polarisations gives half the answer.' },
    { id: 'phgas-005', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'BEC',
      q: 'An ideal Bose gas in a box condenses when its phase-space density $n\\lambda^3$ reaches',
      options: ['1', '$\\zeta(3/2) \\approx 2.612$', '$\\zeta(3) \\approx 1.202$', '$\\pi^2/6$'], answer: 1,
      sol: 'Excited states hold at most $N_{ex} = V\\zeta(3/2)/\\lambda^3$ (at $\\mu = 0$). When $n\\lambda^3$ exceeds 2.612, the extra particles must go into the ground state.' },
    { id: 'phgas-006', type: 'msq', level: 1, exams: ['gate', 'net'], sub: 'phonon gas', format: 'multi',
      q: 'Phonons in a crystal, treated as a gas, have which properties?',
      options: ['They obey Bose-Einstein statistics', 'Their chemical potential is zero in equilibrium', 'Their number is conserved', 'Their frequencies are cut off at a maximum (Debye) frequency'], answer: [0, 1, 3],
      sol: 'Phonons are quanta of lattice vibration: bosons whose number changes with temperature, so $\\mu = 0$. A crystal of $N$ atoms has only $3N$ modes, so (unlike photons) there is a highest frequency, $\\omega_D$.' },

    // ---- level 2 ----
    { id: 'phgas-007', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'photon number',
      q: 'Using $n = \\frac{2\\zeta(3)}{\\pi^2}\\left(\\frac{kT}{\\hbar c}\\right)^3$, the number of thermal photons per cubic metre at $300$ K is ______ $\\times10^{14}$.',
      answer: 5.48, tol: 0.05, calc: () => nPh(300) / 1e14,
      sol: '$kT/\\hbar c = 436.7\\,T$ m$^{-1}$ $= 1.310\\times10^5$ m$^{-1}$ at 300 K. Cubed: $2.248\\times10^{15}$. Times $2\\times1.202/\\pi^2 = 0.2436$: $5.48\\times10^{14}$ m$^{-3}$ (a handy form: $n \\approx 2.03\\times10^7\\,T^3$ m$^{-3}$).' },
    { id: 'phgas-008', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'photon number', unit: 'cm⁻³',
      q: 'The cosmic microwave background is blackbody radiation at $2.725$ K. Its photon number density is ______ per cm$^3$.',
      answer: 411, tol: 3, calc: () => nPh(2.725) / 1e6,
      sol: '$n = 2.029\\times10^7\\times2.725^3 = 2.029\\times10^7\\times20.23 = 4.11\\times10^8$ m$^{-3} = 411$ cm$^{-3}$, about a billion photons for every baryon in the universe.' },
    { id: 'phgas-009', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'photon gas',
      q: 'The mean energy per photon in blackbody radiation at temperature $T$ is about',
      options: ['$kT$', '$\\tfrac32kT$', '$3kT$', '$2.70\\,kT$'], answer: 3,
      sol: '$u/n = \\frac{\\pi^2k^4T^4/15\\hbar^3c^3}{2\\zeta(3)k^3T^3/\\pi^2\\hbar^3c^3} = \\frac{\\pi^4}{30\\zeta(3)}kT = 2.701\\,kT$. ($3kT$ would be classical $E = pc$ particles.)' },
    { id: 'phgas-010', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'energy density', unit: 'mJ/m³',
      q: 'The energy density of blackbody radiation at $1000$ K is ______ mJ/m$^3$. ($a = 7.566\\times10^{-16}$ J m$^{-3}$ K$^{-4}$)',
      answer: 0.757, tol: 0.008, calc: () => aRad * 1e12 * 1e3,
      sol: '$u = aT^4 = 7.566\\times10^{-16}\\times10^{12} = 7.57\\times10^{-4}$ J/m$^3 = 0.757$ mJ/m$^3$.' },
    { id: 'phgas-011', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'adiabatic',
      q: 'Blackbody radiation in a cavity with perfectly reflecting walls expands slowly and adiabatically. Its temperature varies with volume as',
      options: ['$T \\propto V^{-1/3}$', '$T \\propto V^{-2/3}$', '$T \\propto V^{-1}$', '$T$ stays constant'], answer: 0,
      sol: '$S = \\tfrac43aVT^3$ is constant, so $VT^3$ is constant and $T \\propto V^{-1/3}$, i.e. $T \\propto 1/L$. This is why the CMB temperature falls inversely with the cosmic scale factor.',
      trap: '$V^{-2/3}$ is the monatomic gas ($\\gamma = 5/3$); radiation behaves as $\\gamma = 4/3$.' },
    { id: 'phgas-012', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'adiabatic', unit: 'K',
      q: 'Radiation at $1000$ K fills a cavity of $1.0$ L. The cavity is expanded slowly and adiabatically to $8.0$ L. The final temperature is ______ K.',
      answer: 500, tol: 1, calc: () => 1000 * (1 / 8) ** (1 / 3),
      sol: '$VT^3$ constant: $T_2 = 1000\\times(1/8)^{1/3} = 500$ K.' },
    { id: 'phgas-013', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'Planck law',
      q: 'Combining the mode density with the Bose-Einstein occupation ($\\mu = 0$) gives the spectral energy density per unit frequency',
      options: ['$u_\\nu = \\dfrac{8\\pi h\\nu^3}{c^3}\\,\\dfrac{1}{e^{h\\nu/kT} - 1}$', '$u_\\nu = \\dfrac{8\\pi\\nu^2}{c^3}kT$', '$u_\\nu = \\dfrac{8\\pi h\\nu^3}{c^3}\\,\\dfrac{1}{e^{h\\nu/kT} + 1}$', '$u_\\nu = \\dfrac{8\\pi h\\nu^3}{c^3}\\,e^{-h\\nu/kT}$'], answer: 0,
      sol: '(modes per volume per $d\\nu$) $\\times$ (energy per photon) $\\times$ (mean photon number) $= \\frac{8\\pi\\nu^2}{c^3}\\cdot h\\nu\\cdot\\frac{1}{e^{h\\nu/kT} - 1}$. The second option is Rayleigh-Jeans, the fourth is Wien’s approximation, and the third would be fermions.' },
    { id: 'phgas-014', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Planck law', unit: 'THz',
      q: 'For a blackbody at $5800$ K, the spectral energy density per unit frequency $u_\\nu$ peaks at $h\\nu = 2.821\\,kT$. This frequency is ______ THz.',
      answer: 341, tol: 3, calc: () => 2.8214 * C.kB * 5800 / C.h / 1e12,
      sol: '$\\nu = 2.821\\times1.381\\times10^{-23}\\times5800/6.626\\times10^{-34} = 3.41\\times10^{14}$ Hz $= 341$ THz, i.e. $c/\\nu = 880$ nm, in the infrared, although $u_\\lambda$ peaks at 500 nm. The two peaks differ because $d\\nu$ and $d\\lambda$ are not proportional.' },
    { id: 'phgas-015', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'photon gas',
      q: 'The heat capacity at constant volume of blackbody radiation filling volume $V$ is',
      options: ['$aVT^3$', '$3aVT^3$', '$4aVT^3$', '$\\tfrac43aVT^3$'], answer: 2,
      sol: '$U = aVT^4$, so $C_V = 4aVT^3$. It vanishes as $T \\to 0$, consistent with the third law.' },
    { id: 'phgas-016', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'BEC',
      q: 'The condensation temperature of an ideal Bose gas of particle mass $m$ and number density $n$ scales as',
      options: ['$n^{2/3}/m$', '$n^{1/3}/m$', '$n^{2/3}m$', '$n/m^{2/3}$'], answer: 0,
      sol: '$n\\lambda^3 = 2.612$ with $\\lambda \\propto (mT)^{-1/2}$ gives $T_c = \\frac{2\\pi\\hbar^2}{mk}\\left(\\frac{n}{2.612}\\right)^{2/3}$. Light, dense gases condense at higher temperature.' },
    { id: 'phgas-017', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'BEC',
      q: 'For an ideal Bose gas in a box, the fraction of atoms in the condensate at $T = 0.5\\,T_c$ is ______.',
      answer: 0.646, tol: 0.003, calc: () => 1 - 0.5 ** 1.5,
      sol: 'Excited atoms: $N_{ex} = N(T/T_c)^{3/2}$, so $N_0/N = 1 - (0.5)^{3/2} = 1 - 0.354 = 0.646$.' },
    { id: 'phgas-018', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'phonon gas',
      q: 'Why does the lattice heat capacity of an insulator go as $T^3$ at low temperature?',
      options: ['Because each atom has three degrees of freedom', 'Because only long-wavelength acoustic phonons with $\\omega = v_sk$ are excited, and this gas behaves like photons', 'Because the Einstein model predicts it', 'Because electrons freeze out'], answer: 1,
      sol: 'At $kT \\ll \\hbar\\omega_D$ only phonons with $\\hbar\\omega \\lesssim kT$ are excited, all on the linear part of the dispersion. With $g(\\omega) \\propto \\omega^2$ and $\\mu = 0$, exactly like photons, $U \\propto T^4$ and $C \\propto T^3$. The Einstein model gives an exponential instead.' },

    // ---- level 3 ----
    { id: 'phgas-019', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'BEC', unit: 'K',
      q: 'Treat liquid helium-4 (density $145$ kg/m$^3$, atomic mass $6.646\\times10^{-27}$ kg) as an ideal Bose gas. Its condensation temperature is ______ K.',
      answer: 3.13, tol: 0.04, calc: () => tcBox(6.6465e-27, 145 / 6.6465e-27),
      sol: '$n = 145/6.646\\times10^{-27} = 2.18\\times10^{28}$ m$^{-3}$. $\\frac{2\\pi\\hbar^2}{mk} = 7.61\\times10^{-19}$ m$^2$K and $(n/2.612)^{2/3} = (8.35\\times10^{27})^{2/3} = 4.12\\times10^{18}$ m$^{-2}$. $T_c \\approx 3.13$ K, close to the observed lambda point at 2.17 K; interactions explain the difference.' },
    { id: 'phgas-020', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'BEC',
      q: 'Below $T_c$, the pressure of an ideal Bose gas in a box',
      options: ['is proportional to $n$, like a classical gas', 'is zero', 'depends only on $T$, as $T^{5/2}$, and not on the density', 'is proportional to $n^{5/3}$'], answer: 2,
      sol: 'Condensed atoms have zero momentum and exert no pressure. The excited ones, at $\\mu = 0$, give $P = \\zeta(5/2)kT/\\lambda^3 \\propto T^{5/2}$. Compressing the gas only moves more atoms into the condensate, so the isotherms are flat, like a liquid-vapour coexistence region.' },
    { id: 'phgas-021', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Planck law',
      q: 'At a fixed temperature, the ratio of the Planck spectral energy density $u_\\nu$ at $h\\nu = kT$ to that at $h\\nu = 3kT$ is ______.',
      answer: 0.411, tol: 0.003, calc: () => planckX(1) / planckX(3),
      sol: '$u_\\nu \\propto x^3/(e^x - 1)$: at $x = 1$, $1/1.718 = 0.582$; at $x = 3$, $27/19.09 = 1.415$. Ratio $0.411$.' },
    { id: 'phgas-022', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'Planck law', format: 'statements',
      q: 'Which statements about the Planck distribution are correct?',
      options: ['For $h\\nu \\ll kT$ it reduces to the Rayleigh-Jeans form $8\\pi\\nu^2kT/c^3$', 'For $h\\nu \\gg kT$ it falls as $\\nu^3e^{-h\\nu/kT}$', 'Its integral over all frequencies is finite because high-frequency modes are exponentially unoccupied', 'It follows from Maxwell-Boltzmann statistics for photons'], answer: [0, 1, 2],
      sol: 'Small $x$: $1/(e^x - 1) \\approx 1/x$, giving $kT$ per mode (equipartition). Large $x$: Wien tail. The cut-off of mean occupation at $h\\nu \\gg kT$ removes the ultraviolet catastrophe. The $-1$ in the denominator is Bose-Einstein; MB would give only Wien’s law.' },
    { id: 'phgas-023', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'radiation pressure',
      q: 'Inside a star at $1.0\\times10^7$ K, the radiation pressure is ______ $\\times10^{12}$ Pa.',
      answer: 2.52, tol: 0.03, calc: () => aRad * 1e28 / 3 / 1e12,
      sol: '$P = aT^4/3 = 7.566\\times10^{-16}\\times10^{28}/3 = 2.52\\times10^{12}$ Pa, about 25 million atmospheres. In massive stars it rivals the gas pressure.' },
    { id: 'phgas-024', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'photon gas',
      q: 'The heat capacity of the blackbody radiation in a $1.0$ m$^3$ cavity at $300$ K is ______ $\\times10^{-8}$ J/K.',
      answer: 8.17, tol: 0.08, calc: () => 4 * aRad * 300 ** 3 / 1e-8,
      sol: '$C_V = 4aVT^3 = 4\\times7.566\\times10^{-16}\\times2.7\\times10^7 = 8.17\\times10^{-8}$ J/K: utterly negligible beside the walls.' },
    { id: 'phgas-025', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'phonon gas', unit: 'J mol⁻¹ K⁻¹',
      q: 'Copper has $\\theta_D = 343$ K. Using the Debye law $C = \\frac{12\\pi^4}{5}R\\left(\\frac{T}{\\theta_D}\\right)^3$, its molar lattice heat capacity at $10$ K is ______ J mol$^{-1}$ K$^{-1}$.',
      answer: 0.0482, tol: 0.0006, calc: () => (12 * Math.PI ** 4 / 5) * C.R * (10 / 343) ** 3,
      sol: '$\\frac{12\\pi^4}{5}R = 1944$ J mol$^{-1}$K$^{-1}$; $(10/343)^3 = 2.478\\times10^{-5}$. $C = 0.0482$ J mol$^{-1}$K$^{-1}$, compared with $3R = 24.9$ at room temperature. (In a metal the electrons add a linear term that matters at a few kelvin.)' },
    { id: 'phgas-026', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'BEC',
      q: 'How does the heat capacity of an ideal 3D Bose gas in a box behave at $T_c$?',
      options: ['It diverges', 'It is continuous with a cusp, reaching about $1.93Nk$, above the classical $\\tfrac32Nk$', 'It jumps from zero to $\\tfrac32Nk$', 'It is $\\tfrac32Nk$ on both sides'], answer: 1,
      sol: 'Below $T_c$, $U \\propto T^{5/2}$ and $C_V = 1.93Nk(T/T_c)^{3/2}$. Above, $C_V$ falls towards $\\tfrac32Nk$. $C_V$ is continuous but its slope jumps: a cusp. Liquid $^4$He instead shows a lambda-shaped peak, because of interactions.' },
    { id: 'phgas-027', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'BEC',
      q: 'Below $T_c$, $C_V = \\frac{15}{4}\\frac{\\zeta(5/2)}{\\zeta(3/2)}Nk\\left(\\frac{T}{T_c}\\right)^{3/2}$. With $\\zeta(5/2) = 1.341$ and $\\zeta(3/2) = 2.612$, $C_V/Nk$ at $T_c$ is ______.',
      answer: 1.926, tol: 0.006, calc: () => 3.75 * Z52 / Z32,
      sol: '$\\frac{15}{4}\\times\\frac{1.341}{2.612} = 3.75\\times0.5135 = 1.926$.' },
    { id: 'phgas-028', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'photon gas',
      q: 'The entropy of blackbody radiation divided by the number of photons is',
      options: ['about $3.6\\,k$, independent of temperature', 'about $k\\ln2$', 'proportional to $T$', '$\\tfrac52k$, as for a monatomic gas'], answer: 0,
      sol: '$S/N = \\frac{\\tfrac43aT^3}{n} = \\frac{2\\pi^4}{45\\zeta(3)}k = 3.60\\,k$. Both $S$ and $N$ go as $VT^3$, so an adiabatic expansion conserves photon number too.' },
    { id: 'phgas-029', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'trapped BEC', unit: 'μK',
      q: 'For $N$ bosons in an isotropic harmonic trap, $kT_c = \\hbar\\omega\\,(N/\\zeta(3))^{1/3}$. For $N = 10^6$ and $\\omega = 2\\pi\\times100$ s$^{-1}$, $T_c$ is ______ $\\mu$K.',
      answer: 0.451, tol: 0.005, calc: () => C.hbar * 2 * Math.PI * 100 * (1e6 / Z3) ** (1 / 3) / C.kB * 1e6,
      sol: '$\\hbar\\omega/k = 1.0546\\times10^{-34}\\times628.3/1.381\\times10^{-23} = 4.80\\times10^{-9}$ K. $(10^6/1.202)^{1/3} = 94.0$. $T_c = 4.51\\times10^{-7}$ K $= 0.451\\ \\mu$K.' },
    { id: 'phgas-030', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'BEC', format: 'statements',
      q: 'For an ideal Bose gas in a 3D box below $T_c$, which statements are correct?',
      options: ['$\\mu = 0$ (to within a term of order $kT/N$)', 'The excited atoms number $N(T/T_c)^{3/2}$', 'The condensate carries entropy proportional to its number', 'The internal energy is proportional to $T^{5/2}$'], answer: [0, 1, 3],
      sol: 'Once excited states are saturated, $\\mu$ is pinned just below $\\varepsilon_0$, and $N_{ex} = V\\zeta(3/2)/\\lambda^3 \\propto T^{3/2}$. Their energy $\\propto VT^{5/2}$. The condensate is a single quantum state and has no entropy; all entropy is in the excited atoms.' },

    // ---- level 4 ----
    { id: 'phgas-031', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'trapped BEC',
      q: 'For an ideal Bose gas in a 3D harmonic trap, the condensate fraction at $T = 0.5\\,T_c$ is ______.',
      answer: 0.875, tol: 0.002, calc: () => 1 - 0.5 ** 3,
      sol: 'In a trap $g(\\varepsilon) \\propto \\varepsilon^2$, so $N_{ex} \\propto T^3$ and $N_0/N = 1 - (T/T_c)^3 = 1 - 0.125 = 0.875$, higher than the 0.646 of a box at the same $T/T_c$.' },
    { id: 'phgas-032', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'Stefan-Boltzmann',
      q: 'The integral that fixes the Stefan-Boltzmann constant is',
      options: ['$\\int_0^\\infty\\frac{x^2dx}{e^x - 1} = 2\\zeta(3)$, which gives $a$', '$\\int_0^\\infty\\frac{x^3dx}{e^x + 1} = \\frac{7\\pi^4}{120}$', '$\\int_0^\\infty\\frac{x^3dx}{e^x - 1} = \\frac{\\pi^4}{15}$', '$\\int_0^\\infty x^3e^{-x}dx = 6$'], answer: 2,
      sol: '$u = \\frac{(kT)^4}{\\pi^2\\hbar^3c^3}\\int_0^\\infty\\frac{x^3dx}{e^x - 1} = \\frac{\\pi^2k^4}{15\\hbar^3c^3}T^4$ and $\\sigma = ca/4 = \\pi^2k^4/60\\hbar^3c^2$. The $x^2$ integral gives the photon number; the $e^x + 1$ one would be for fermions (neutrinos); $\\int x^3e^{-x} = 6$ is Wien’s approximation.' },
    { id: 'phgas-033', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'photon number',
      q: 'The number of photons leaving unit area of a blackbody per second is $\\tfrac14cn$. At $300$ K this is ______ $\\times10^{22}$ m$^{-2}$s$^{-1}$.',
      answer: 4.10, tol: 0.05, calc: () => C.c * nPh(300) / 4 / 1e22,
      sol: 'Effusion-type flux $\\tfrac14n\\bar c$ with every photon moving at $c$: $\\tfrac14\\times3.0\\times10^8\\times5.48\\times10^{14} = 4.10\\times10^{22}$ m$^{-2}$s$^{-1}$.' },
    { id: 'phgas-034', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'photon gas', format: 'statements',
      q: 'For blackbody radiation in a cavity of volume $V$ at temperature $T$, which statements are correct?',
      options: ['$F = -\\tfrac13aVT^4$', '$S = \\tfrac43U/T$', 'The Gibbs energy $G = U - TS + PV$ is zero', '$C_P = \\tfrac43C_V$'], answer: [0, 1, 2],
      sol: '$F = -PV$ (since $\\mu = 0$, $G = F + PV = 0$), with $P = aT^4/3$. $S = -\\partial F/\\partial T = \\tfrac43aVT^3 = \\tfrac43U/T$. $P$ depends only on $T$, so heating at constant pressure is impossible without changing $P$: $C_P$ is not finite.' },
    { id: 'phgas-035', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'adiabatic',
      q: 'Blackbody radiation is compressed slowly and adiabatically to $1/27$ of its volume. Its pressure rises by a factor of ______.',
      answer: 81, tol: 0, calc: () => (27 ** (1 / 3)) ** 4,
      sol: '$VT^3$ constant: $T$ rises 3 times. $P = aT^4/3$ rises $3^4 = 81$ times. Equivalently $PV^{4/3}$ is constant: $27^{4/3} = 81$.' },
    { id: 'phgas-036', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'phonon gas',
      q: 'Which difference between a phonon gas and a photon gas makes the lattice heat capacity tend to $3Nk$ at high temperature?',
      options: ['Phonons have three polarisations', 'Phonons are fermions', 'Phonons have a non-zero chemical potential', 'The number of phonon modes is finite ($3N$), cut off at $\\omega_D$'], answer: 3,
      sol: 'With only $3N$ modes, at $kT \\gg \\hbar\\omega_D$ each mode holds $kT$ (classical), giving $3Nk$. Photon modes have no upper limit, so $C_V = 4aVT^3$ grows without bound.' },
    { id: 'phgas-037', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'CMB', unit: 'cm⁻³',
      q: 'The entropy density of the CMB ($T = 2.725$ K), divided by $k$, is ______ per cm$^3$.',
      answer: 1478, tol: 15, calc: () => (4 / 3) * aRad * 2.725 ** 3 / C.kB / 1e6,
      sol: '$s = \\tfrac43aT^3 = \\tfrac43\\times7.566\\times10^{-16}\\times20.23 = 2.04\\times10^{-14}$ J K$^{-1}$m$^{-3}$; divided by $k$: $1.48\\times10^9$ m$^{-3}$ $= 1478$ cm$^{-3}$, i.e. $3.60$ per photon times 411 photons.' },
    { id: 'phgas-038', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'BEC',
      q: 'An ideal Bose gas is held at fixed temperature and slowly compressed. On a $P$-$v$ diagram ($v = V/N$), its isotherm',
      options: ['is a hyperbola $Pv =$ const at all $v$', 'follows $P \\propto 1/v$ until $v = \\lambda^3/2.612$, then stays flat as more atoms condense', 'rises without limit as $v \\to 0$', 'shows a van der Waals loop'], answer: 1,
      sol: 'Above the density threshold the gas is nearly classical with Bose corrections. When $v = \\lambda^3/\\zeta(3/2)$ condensation begins and $P = \\zeta(5/2)kT/\\lambda^3$ stays constant: BEC looks like a first-order transition in the $P$-$v$ plane, with the condensate as a zero-volume "liquid".' },

    // ---- level 5 ----
    { id: 'phgas-039', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'BEC', unit: '10⁻¹² Pa',
      q: 'A partly condensed ideal Bose gas of $^{87}$Rb ($m = 1.443\\times10^{-25}$ kg) is at $100$ nK. Its pressure, $P = \\zeta(5/2)kT/\\lambda^3$, is ______ $\\times10^{-12}$ Pa.',
      answer: 8.92, tol: 0.1, calc: () => Z52 * C.kB * 1e-7 / lamT(1.4432e-25, 1e-7) ** 3 / 1e-12,
      sol: '$\\lambda = h/\\sqrt{2\\pi mkT} = 6.626\\times10^{-34}/\\sqrt{2\\pi\\times1.443\\times10^{-25}\\times1.381\\times10^{-30}} = 5.92\\times10^{-7}$ m, $\\lambda^3 = 2.08\\times10^{-19}$ m$^3$. $P = 1.341\\times1.381\\times10^{-30}/2.08\\times10^{-19} = 8.92\\times10^{-12}$ Pa, whatever the density.' },
    { id: 'phgas-040', type: 'msq', level: 5, exams: ['gate', 'net'], sub: 'trapped BEC', format: 'statements',
      q: 'Which statements about ideal Bose-Einstein condensation are correct?',
      options: ['In a 3D harmonic trap $g(\\varepsilon) \\propto \\varepsilon^2$ and $T_c \\propto N^{1/3}\\hbar\\omega$', 'In a 2D harmonic trap condensation at finite $T$ is possible', 'In a 2D box condensation at finite $T$ is possible', 'In a 3D box the condensate fraction is $1 - (T/T_c)^{3/2}$'], answer: [0, 1, 3],
      sol: 'Condensation needs $\\int g(\\varepsilon)d\\varepsilon/(e^{\\beta\\varepsilon} - 1)$ to converge at $\\varepsilon \\to 0$. 3D trap: $\\varepsilon^2/\\varepsilon$ converges; 2D trap: $g \\propto \\varepsilon$, $\\varepsilon/\\varepsilon$ converges; 2D box: $g$ constant, $1/\\varepsilon$ diverges, no BEC. 3D box: $\\varepsilon^{1/2}$, converges, fraction $1 - (T/T_c)^{3/2}$.' },
    { id: 'phgas-041', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'photon number',
      q: 'What fraction of the photons in blackbody radiation have $h\\nu < kT$? (The photon number spectrum is $\\propto x^2/(e^x - 1)$ with total $\\int_0^\\infty = 2\\zeta(3) = 2.404$.)',
      answer: 0.147, tol: 0.002, calc: () => integ((x) => x * x / (Math.exp(x) - 1), 1e-9, 1) / (2 * Z3),
      sol: 'Expand $x^2/(e^x - 1) = x - x^2/2 + x^3/12 - x^5/720 + \\ldots$ and integrate from 0 to 1: $0.5 - 0.1667 + 0.0208 - 0.0002 = 0.3539$. Divide by $2.404$: $0.147$. Most photons are near $h\\nu \\approx 1.6kT$ (number peak), not in the Rayleigh-Jeans region.' },
    { id: 'phgas-042', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'BEC',
      q: 'Viewing BEC as a first-order transition with the transition line $P_c(T) = \\zeta(5/2)kT/\\lambda^3 \\propto T^{5/2}$ and the condensate having zero volume, the Clapeyron equation gives a latent heat per particle of',
      options: ['$\\tfrac32kT$', '$\\tfrac52\\frac{\\zeta(5/2)}{\\zeta(3/2)}kT$', '$\\frac{\\zeta(3/2)}{\\zeta(5/2)}kT$', 'zero'], answer: 1,
      sol: '$dP/dT = L/(T\\Delta v)$ with $\\Delta v = v_c = \\lambda^3/\\zeta(3/2)$ and $dP/dT = \\tfrac52P/T$. So $L = \\tfrac52P\\,v_c = \\tfrac52\\frac{\\zeta(5/2)kT}{\\lambda^3}\\frac{\\lambda^3}{\\zeta(3/2)} = \\tfrac52\\frac{\\zeta(5/2)}{\\zeta(3/2)}kT \\approx 1.28kT$: the entropy $T\\Delta s$ carried by an excited atom.' },
    { id: 'phgas-043', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'photon gas', format: 'multi',
      q: 'The temperature of a cavity is doubled. Which statements about the blackbody radiation inside are correct?',
      options: ['The photon number density rises 8 times', 'The energy density rises 16 times', 'The mean photon energy doubles', 'The radiation pressure rises 8 times'], answer: [0, 1, 2],
      sol: '$n \\propto T^3$: $\\times8$. $u \\propto T^4$: $\\times16$. Mean energy $u/n = 2.70kT$: $\\times2$. $P = u/3$ rises 16 times, like $u$.' },
    { id: 'phgas-044', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'BEC', format: 'statements',
      q: 'Which statements about Bose-Einstein condensation of an ideal gas are correct?',
      options: ['It is a condensation in momentum space: the atoms pile into the lowest single-particle state', 'It happens without any attraction between the atoms', 'It requires the atoms to have integer total spin', 'It happens when the thermal wavelength becomes much smaller than the spacing between atoms'], answer: [0, 1, 2],
      sol: 'BEC is purely statistical: bosons (integer spin) at high phase-space density occupy the ground state macroscopically, with no attraction needed. The condition is $\\lambda \\approx 1.38\\,n^{-1/3}$, i.e. the thermal wavelength comparable to (not much smaller than) the spacing.' },
    { id: 'phgas-045', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'phonon gas', format: 'statements',
      q: 'In the Debye model of a crystal of $N$ atoms with sound speed $v_s$, which statements are correct?',
      options: ['The cut-off is chosen so that the total number of modes is $3N$', 'At $T \\ll \\theta_D$ the phonon energy is proportional to $T^4$', 'At $T \\gg \\theta_D$ the heat capacity approaches $3Nk$', 'The number of thermal phonons is independent of temperature'], answer: [0, 1, 2],
      sol: '$\\int_0^{\\omega_D}g(\\omega)d\\omega = 3N$ defines $\\omega_D$. Low $T$: photon-like gas with three polarisations, $U \\propto T^4$, $C \\propto T^3$. High $T$: every mode classical, $3Nk$. Phonon number is not conserved; at low $T$ it grows as $T^3$.' },
  ],
  gens: [
    { id: 'phgas-g01', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'photon number',
      make(r) {
        const T = choose(r, [3, 10, 77, 300, 1000, 3000, 5800, 1e4]);
        const n = nPh(T);
        return { q: `The number density of photons in blackbody radiation at $${T}$ K is ______ m$^{-3}$. (Scientific notation is fine.)`,
          answer: sig(n, 3), tol: sig(n * 0.015, 2), T,
          sol: `$n = \\frac{2\\zeta(3)}{\\pi^2}\\left(\\frac{kT}{\\hbar c}\\right)^3 = 2.029\\times10^7\\,T^3 = 2.029\\times10^7\\times${sig(T ** 3, 4)} \\approx ${sig(n, 3)}$ m$^{-3}$.` };
      },
      verify: (p) => nPh(p.T) },
    { id: 'phgas-g02', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'energy density',
      make(r) {
        const T = choose(r, [300, 1000, 3000, 6000, 1e5, 1e6, 1e7]), what = choose(r, ['energy density', 'pressure', 'entropy density']);
        const v = what === 'energy density' ? aRad * T ** 4 : what === 'pressure' ? aRad * T ** 4 / 3 : (4 / 3) * aRad * T ** 3;
        const unit = what === 'entropy density' ? 'J K$^{-1}$ m$^{-3}$' : what === 'pressure' ? 'Pa' : 'J m$^{-3}$';
        return { q: `The ${what} of blackbody radiation at $${T}$ K is ______ ${unit}. ($a = 7.566\\times10^{-16}$ J m$^{-3}$ K$^{-4}$)`,
          answer: sig(v, 3), tol: sig(v * 0.015, 2), T, what,
          sol: `${what === 'energy density' ? '$u = aT^4$' : what === 'pressure' ? '$P = u/3 = aT^4/3$' : '$s = \\tfrac43aT^3$'} $= ${sig(v, 3)}$ ${unit}.` };
      },
      verify: (p) => (p.what === 'energy density' ? aRad * p.T ** 4 : p.what === 'pressure' ? aRad * p.T ** 4 / 3 : (4 / 3) * aRad * p.T ** 3) },
    { id: 'phgas-g03', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Planck law',
      make(r) {
        const T = choose(r, [2.725, 300, 1000, 3000, 5800, 10000]), which = choose(r, ['frequency', 'wavelength']);
        const v = which === 'frequency' ? 2.8214 * C.kB * T / C.h / 1e12 : C.h * C.c / (4.9651 * C.kB * T) * 1e6;
        return { q: `For a blackbody at $${T}$ K, the ${which === 'frequency' ? 'spectral energy density per unit frequency $u_\\nu$ peaks at a frequency of ______ THz' : 'spectral energy density per unit wavelength $u_\\lambda$ peaks at a wavelength of ______ $\\mu$m'}.`,
          answer: sig(v, 4), tol: sig(v * 0.01, 2), T, which,
          sol: which === 'frequency' ? `Maximise $x^3/(e^x - 1)$: $x = 3(1 - e^{-x})$ gives $x = 2.821$. $\\nu = 2.821kT/h \\approx ${sig(v, 4)}$ THz.` : `Maximise $x^5/(e^x - 1)$ in $x = hc/\\lambda kT$: $x = 5(1 - e^{-x})$ gives $x = 4.965$. $\\lambda = hc/4.965kT \\approx ${sig(v, 4)}\\ \\mu$m.`,
          trap: 'The two peaks are not related by $\\lambda\\nu = c$: $u_\\nu$ and $u_\\lambda$ are densities per different variables.' };
      },
      verify: (p) => (p.which === 'frequency' ? 2.8214 * C.kB * p.T / C.h / 1e12 : C.h * C.c / (4.9651 * C.kB * p.T) * 1e6) },
    { id: 'phgas-g04', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'adiabatic',
      make(r) {
        const k = choose(r, [2, 8, 10, 27, 64, 1000]), T1 = choose(r, [300, 1000, 3000]), q = choose(r, ['temperature', 'pressure ratio']), grow = r() < 0.5;
        const T2 = T1 * (grow ? k : 1 / k) ** (-1 / 3), v = q === 'temperature' ? T2 : (T2 / T1) ** 4;
        return { q: `Blackbody radiation at $${T1}$ K is ${grow ? 'expanded' : 'compressed'} slowly and adiabatically so its volume ${grow ? 'grows' : 'shrinks'} by a factor of ${k}. ${q === 'temperature' ? 'The final temperature is ______ K.' : 'The ratio $P_{\\rm final}/P_{\\rm initial}$ is ______.'}`,
          answer: sig(v, 4), tol: sig(v * 0.01, 2), k, T1, q, grow,
          sol: `$S = \\tfrac43aVT^3$ fixed, so $T \\propto V^{-1/3}$: $T_2 = ${T1}\\times${grow ? `${k}^{-1/3}` : `${k}^{1/3}`} = ${sig(T2, 4)}$ K.${q === 'temperature' ? '' : ` $P \\propto T^4$, so the ratio is $${sig(v, 4)}$ (i.e. $PV^{4/3}$ is constant).`}` };
      },
      verify: (p) => { const T2 = p.T1 * (p.grow ? p.k : 1 / p.k) ** (-1 / 3); return p.q === 'temperature' ? T2 : (T2 / p.T1) ** 4; } },
    { id: 'phgas-g05', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Planck law',
      make(r) {
        const x1 = choose(r, [0.5, 1, 2, 2.821]), x2 = choose(r, [3, 4, 5, 8]);
        const v = planckX(x1) / planckX(x2);
        return { q: `At a fixed temperature, find the ratio $u_\\nu(h\\nu = ${x1}kT)/u_\\nu(h\\nu = ${x2}kT)$ for blackbody radiation.`,
          answer: round(v, 4), tol: Math.max(0.002, round(v * 0.005, 4)), x1, x2,
          sol: `$u_\\nu \\propto x^3/(e^x - 1)$: ${round(planckX(x1), 4)} at $x = ${x1}$ and ${round(planckX(x2), 4)} at $x = ${x2}$. Ratio $\\approx ${round(v, 4)}$.` };
      },
      verify: (p) => planckX(p.x1) / planckX(p.x2) },
    { id: 'phgas-g06', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'BEC',
      make(r) {
        const [name, mu] = choose(r, [['$^{87}$Rb', 86.909], ['$^{23}$Na', 22.990], ['$^7$Li', 7.016], ['$^1$H', 1.008], ['$^{133}$Cs', 132.905]]), ne = choose(r, [1e18, 3e18, 1e19, 1e20]);
        const T = tcBox(mu * C.u, ne) * 1e9;
        return { q: `A uniform ideal gas of ${name} atoms ($m = ${mu}$ u) has density $${sig(ne / 10 ** Math.floor(Math.log10(ne)), 2)}\\times10^{${Math.floor(Math.log10(ne))}}$ m$^{-3}$. Its Bose-Einstein condensation temperature is ______ nK.`,
          answer: sig(T, 4), tol: sig(T * 0.01, 2), unit: 'nK', mu, ne,
          sol: `$T_c = \\frac{2\\pi\\hbar^2}{mk}\\left(\\frac{n}{2.612}\\right)^{2/3}$ with $\\frac{2\\pi\\hbar^2}{mk} = ${sig(2 * Math.PI * C.hbar ** 2 / (mu * C.u * C.kB), 4)}$ m$^2$K and $(n/2.612)^{2/3} = ${sig((ne / Z32) ** (2 / 3), 4)}$ m$^{-2}$: $T_c \\approx ${sig(T, 4)}$ nK.` };
      },
      verify: (p) => tcBox(p.mu * C.u, p.ne) * 1e9 },
    { id: 'phgas-g07', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'BEC',
      make(r) {
        const t = choose(r, [0.2, 0.3, 0.5, 0.6, 0.75, 0.9]), where = choose(r, ['a box', 'a 3D harmonic trap']);
        const f = 1 - t ** (where === 'a box' ? 1.5 : 3);
        return { q: `An ideal Bose gas in ${where} is at $T = ${t}\\,T_c$. The fraction of atoms in the condensate is ______.`,
          answer: round(f, 4), tol: 0.003, t, where,
          sol: `${where === 'a box' ? 'Box: $g \\propto \\varepsilon^{1/2}$, $N_{ex} \\propto T^{3/2}$' : 'Trap: $g \\propto \\varepsilon^2$, $N_{ex} \\propto T^3$'}. $N_0/N = 1 - ${t}^{${where === 'a box' ? '3/2' : '3'}} = ${round(f, 4)}$.`,
          trap: 'The exponent depends on the confinement: 3/2 in a box, 3 in a harmonic trap.' };
      },
      verify: (p) => 1 - p.t ** (p.where === 'a box' ? 1.5 : 3) },
    { id: 'phgas-g08', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'trapped BEC',
      make(r) {
        const N = choose(r, [1e4, 1e5, 1e6, 1e7]), f = choose(r, [20, 50, 100, 200, 500]);
        const T = C.hbar * 2 * Math.PI * f * (N / Z3) ** (1 / 3) / C.kB * 1e9;
        return { q: `$${sig(N / 10 ** Math.floor(Math.log10(N)), 2) === 1 ? '' : sig(N / 10 ** Math.floor(Math.log10(N)), 2) + '\\times'}10^{${Math.floor(Math.log10(N))}}$ bosons sit in an isotropic harmonic trap of frequency $${f}$ Hz ($\\omega = 2\\pi\\times${f}$ s$^{-1}$). Their ideal-gas condensation temperature is ______ nK.`,
          answer: sig(T, 4), tol: sig(T * 0.01, 2), unit: 'nK', N, f,
          sol: `$kT_c = \\hbar\\omega(N/\\zeta(3))^{1/3}$: $\\hbar\\omega/k = ${sig(C.hbar * 2 * Math.PI * f / C.kB * 1e9, 4)}$ nK and $(N/1.202)^{1/3} = ${sig((N / Z3) ** (1 / 3), 4)}$. $T_c \\approx ${sig(T, 4)}$ nK.` };
      },
      verify: (p) => C.hbar * 2 * Math.PI * p.f * (p.N / Z3) ** (1 / 3) / C.kB * 1e9 },
    { id: 'phgas-g09', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'phonon gas',
      make(r) {
        const [name, th] = choose(r, [['copper', 343], ['aluminium', 428], ['silver', 225], ['lead', 105], ['diamond', 2230], ['silicon', 645]]), T = choose(r, [2, 5, 10, 15]);
        const c = (12 * Math.PI ** 4 / 5) * C.R * (T / th) ** 3 * 1000;
        return { q: `${name[0].toUpperCase() + name.slice(1)} has Debye temperature $${th}$ K. Its molar lattice heat capacity at $${T}$ K is ______ mJ mol$^{-1}$ K$^{-1}$.`,
          answer: sig(c, 4), tol: sig(c * 0.01, 2), unit: 'mJ mol⁻¹ K⁻¹', th, T,
          sol: `Debye $T^3$ law: $C = \\frac{12\\pi^4}{5}R(T/\\theta_D)^3 = 1944\\times(${T}/${th})^3$ J mol$^{-1}$K$^{-1}$ $\\approx ${sig(c, 4)}$ mJ mol$^{-1}$K$^{-1}$.` };
      },
      verify: (p) => (12 * Math.PI ** 4 / 5) * C.R * (p.T / p.th) ** 3 * 1000 },
    { id: 'phgas-g10', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'photon number',
      make(r) {
        const T = choose(r, [300, 1000, 1500, 3000, 5800]);
        const F = C.c * nPh(T) / 4;
        return { q: `A blackbody at $${T}$ K emits ______ photons per square metre per second. (Scientific notation is fine.)`,
          answer: sig(F, 3), tol: sig(F * 0.015, 2), T,
          sol: `Photon flux $= \\tfrac14cn$ with $n = 2.029\\times10^7T^3 = ${sig(nPh(T), 4)}$ m$^{-3}$: $\\tfrac14\\times3.00\\times10^8\\times${sig(nPh(T), 4)} \\approx ${sig(F, 3)}$ m$^{-2}$s$^{-1}$. (Energy flux $\\sigma T^4$ divided by this gives the mean energy $2.70kT$.)` };
      },
      verify: (p) => C.c * nPh(p.T) / 4 },
    { id: 'phgas-g11', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'scaling',
      make(r) {
        const L = [
          ['the energy density of blackbody radiation', 'temperature $T$', '4'],
          ['the photon number density in a cavity', 'temperature $T$', '3'],
          ['the entropy of blackbody radiation at fixed volume', 'temperature $T$', '3'],
          ['the pressure of an ideal Bose gas in a box below $T_c$', 'temperature $T$', '5/2'],
          ['the internal energy of an ideal Bose gas in a box below $T_c$', 'temperature $T$', '5/2'],
          ['the low-temperature lattice heat capacity of an insulator', 'temperature $T$', '3'],
          ['the BEC temperature of a uniform ideal gas', 'number density $n$', '2/3'],
          ['the BEC temperature in a 3D harmonic trap', 'atom number $N$', '1/3'],
          ['the number of non-condensed atoms in a 3D harmonic trap below $T_c$', 'temperature $T$', '3'],
          ['the number of non-condensed atoms in a box below $T_c$', 'temperature $T$', '3/2'],
        ];
        const [what, of, p] = choose(r, L);
        const show = (s) => `$${s}$`;
        const o = mcqOptions(r, p, ['4', '3', '5/2', '3/2', '2/3', '1/3', '2'].filter((x) => x !== p), show);
        return { q: `${what[0].toUpperCase() + what.slice(1)} is proportional to a power of the ${of}. What is the exponent?`, options: o.options, answer: o.answer,
          sol: `The exponent is $${p}$. ${p === '4' ? 'Photons: $u = aT^4$ from $\\int x^3/(e^x - 1)$.' : p === '3' ? 'A massless boson gas has $n$, $S/V$ and $C_V/V \\propto T^3$; in a trap $N_{ex} \\propto (kT/\\hbar\\omega)^3$.' : p === '5/2' ? 'Below $T_c$, $\\mu = 0$ and $P$, $U/V \\propto T/\\lambda^3 \\propto T^{5/2}$.' : p === '3/2' ? '$N_{ex} = V\\zeta(3/2)/\\lambda^3 \\propto T^{3/2}$.' : p === '2/3' ? '$n\\lambda_c^3 = 2.612$ with $\\lambda \\propto T^{-1/2}$ gives $T_c \\propto n^{2/3}$.' : '$N = \\zeta(3)(kT_c/\\hbar\\omega)^3$ gives $T_c \\propto N^{1/3}$.'}` };
      } },
    { id: 'phgas-g12', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Planck law',
      make(r) {
        const x = choose(r, [0.01, 0.1, 0.5, 1, 2, 5]);
        const v = (Math.exp(x) - 1) / x;
        return { q: `At a frequency where $h\\nu = ${x}\\,kT$, the Rayleigh-Jeans formula overestimates the true (Planck) spectral energy density by what factor?`,
          answer: round(v, 4), tol: Math.max(0.001, round(v * 0.005, 4)), x,
          sol: `RJ gives $kT$ per mode; Planck gives $h\\nu/(e^{h\\nu/kT} - 1)$. Ratio $= (e^x - 1)/x = ${round(v, 4)}$.${x <= 0.1 ? ' Nearly 1: classical physics works at low frequency.' : ''}` };
      },
      verify: (p) => (Math.exp(p.x) - 1) / p.x },
    ...more,
  ],
};
