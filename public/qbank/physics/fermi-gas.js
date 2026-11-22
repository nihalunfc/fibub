// The ideal Fermi gas: Fermi sphere, E_F, T_F, v_F, density of states at E_F, ground-state energy and degeneracy
// pressure, bulk modulus, Sommerfeld expansion (mu(T), C = gamma T, entropy), Pauli paramagnetism, the 2D gas,
// liquid helium-3, white dwarfs and neutron stars (relativistic limit, Chandrasekhar), gamma T + beta T^3.
// Original questions for GATE and CSIR NET practice (fibub), MSc level.
import { pick, int, choose, mcqOptions, round, C } from '../_util.js';
import more from './fermi-gas.more.gen.js';
import more2 from './fermi-gas.more2.gen.js';

const sig = (x, n = 3) => Number(x.toPrecision(n));
const kF = (n, g = 2) => (6 * Math.PI ** 2 * n / g) ** (1 / 3);
const EF = (n, m = C.me, g = 2) => (C.hbar * kF(n, g)) ** 2 / (2 * m); // J
const eV = (J) => J / C.e;
const METALS = [['sodium', 2.65e28], ['potassium', 1.40e28], ['copper', 8.47e28], ['silver', 5.86e28], ['aluminium', 18.1e28], ['lithium', 4.70e28], ['gold', 5.90e28]];
const nTex = (n) => { const e = Math.floor(Math.log10(n)); return `${sig(n / 10 ** e, 3)}\\times10^{${e}}`; };

export default {
  topic: 'fermi-gas',
  items: [
    // ---- level 1 ----
    { id: 'fgas-001', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'Fermi energy',
      q: 'For an ideal gas of spin-1/2 fermions of mass $m$ and number density $n$, the Fermi energy is',
      options: ['$\\dfrac{\\hbar^2}{2m}(3\\pi^2n)^{2/3}$', '$\\dfrac{\\hbar^2}{2m}(6\\pi^2n)^{2/3}$', '$\\dfrac{\\hbar^2}{2m}(3\\pi^2n)^{1/3}$', '$\\dfrac{\\hbar^2}{m}(3\\pi^2n)^{2/3}$'], answer: 0,
      sol: 'Fill a sphere in $k$-space: $N = 2\\cdot\\frac{V}{(2\\pi)^3}\\cdot\\frac43\\pi k_F^3$, so $k_F = (3\\pi^2n)^{1/3}$ and $E_F = \\hbar^2k_F^2/2m$. $6\\pi^2$ is for spinless fermions.' },
    { id: 'fgas-002', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'ground state',
      q: 'At $T = 0$, the average kinetic energy per particle of an ideal 3D Fermi gas is',
      options: ['$\\tfrac12E_F$', '$E_F$', '$\\tfrac35E_F$', '$\\tfrac32kT$'], answer: 2,
      sol: '$\\langle E\\rangle = \\int_0^{E_F}E\\sqrt E\\,dE/\\int_0^{E_F}\\sqrt E\\,dE = \\frac{E_F^{5/2}/(5/2)}{E_F^{3/2}/(3/2)} = \\tfrac35E_F$. Most states are near the top of the sphere.' },
    { id: 'fgas-003', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'Fermi energy',
      q: 'If the number density of an ideal Fermi gas is increased 8 times, its Fermi energy',
      options: ['doubles', 'rises 8 times', 'rises 4 times', 'stays the same'], answer: 2,
      sol: '$E_F \\propto n^{2/3}$, so $8^{2/3} = 4$.' },
    { id: 'fgas-004', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'pressure',
      q: 'An ideal Fermi gas exerts a pressure even at absolute zero. The reason is',
      options: ['zero-point vibrations of the walls', 'the Pauli principle forces particles into states of high momentum', 'thermal motion that never stops', 'electrostatic repulsion between the particles'], answer: 1,
      sol: 'Only one fermion per state, so even the ground state has particles up to momentum $\\hbar k_F$. Squeezing raises all those energies, $E_F \\propto V^{-2/3}$, so $P = -\\partial E_0/\\partial V = \\tfrac25nE_F > 0$. This degeneracy pressure holds up white dwarfs.' },
    { id: 'fgas-005', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'heat capacity',
      q: 'At temperatures far below $T_F$, the electronic heat capacity of a metal varies with temperature as',
      options: ['$T^3$', 'constant ($\\tfrac32Nk$)', '$e^{-T_F/T}$', '$T$'], answer: 3,
      sol: 'Only electrons within about $kT$ of $E_F$ can be excited; there are $\\sim N(T/T_F)$ of them, each gaining $\\sim kT$. So $U - U_0 \\propto NkT^2/T_F$ and $C = \\frac{\\pi^2}{2}Nk\\frac{T}{T_F}$: linear in $T$.' },
    { id: 'fgas-006', type: 'msq', level: 1, exams: ['gate', 'net'], sub: 'ground state', format: 'multi',
      q: 'For an ideal Fermi gas at $T = 0$, which statements are correct?',
      options: ['Every state with energy below $E_F$ is filled and every state above is empty', 'The chemical potential equals $E_F$', 'The entropy is zero', 'The pressure is zero'], answer: [0, 1, 2],
      sol: 'The occupation is a step at $\\mu = E_F$; there is exactly one way to arrange the particles, so $S = 0$. The pressure is $\\tfrac25nE_F$, not zero.' },

    // ---- level 2 ----
    { id: 'fgas-007', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Fermi energy', unit: 'eV',
      q: 'Copper has $8.47\\times10^{28}$ conduction electrons per m$^3$. Treating them as a free electron gas, $E_F$ is ______ eV.',
      answer: 7.03, tol: 0.07, calc: () => eV(EF(8.47e28)),
      sol: '$k_F = (3\\pi^2\\times8.47\\times10^{28})^{1/3} = 1.359\\times10^{10}$ m$^{-1}$. $E_F = \\hbar^2k_F^2/2m = (1.4327\\times10^{-24})^2/(1.822\\times10^{-30}) = 1.127\\times10^{-18}$ J $= 7.03$ eV.' },
    { id: 'fgas-008', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Fermi temperature',
      q: 'The Fermi temperature $T_F = E_F/k$ of copper ($E_F = 7.03$ eV) is ______ $\\times10^4$ K.',
      answer: 8.16, tol: 0.08, calc: () => 7.03 / 8.617333e-5 / 1e4,
      sol: '$T_F = 7.03/8.617\\times10^{-5} = 8.16\\times10^4$ K. Room temperature is 0.4% of it: the electron gas is deeply degenerate.' },
    { id: 'fgas-009', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Fermi velocity',
      q: 'The Fermi velocity $v_F = \\hbar k_F/m$ of electrons in copper ($k_F = 1.36\\times10^{10}$ m$^{-1}$) is ______ $\\times10^6$ m/s.',
      answer: 1.57, tol: 0.02, calc: () => C.hbar * 1.36e10 / C.me / 1e6,
      sol: '$v_F = 1.0546\\times10^{-34}\\times1.36\\times10^{10}/9.109\\times10^{-31} = 1.57\\times10^6$ m/s, about 0.5% of $c$, and far above the thermal speed $\\sqrt{3kT/m} \\approx 1.2\\times10^5$ m/s.' },
    { id: 'fgas-010', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'Fermi sphere',
      q: 'The radius of the Fermi sphere for spin-1/2 fermions at number density $n$ is',
      options: ['$(\\pi^2n)^{1/3}$', '$(6\\pi^2n)^{1/3}$', '$(3\\pi^2n)^{2/3}$', '$(3\\pi^2n)^{1/3}$'], answer: 3,
      sol: '$\\frac{V}{(2\\pi)^3}\\cdot\\frac43\\pi k_F^3\\cdot2 = N$ gives $k_F^3 = 3\\pi^2n$. The interparticle spacing is $\\sim 1/k_F$.' },
    { id: 'fgas-011', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'density of states',
      q: 'For an ideal 3D Fermi gas of $N$ particles, the density of states at the Fermi energy is',
      options: ['$N/E_F$', '$3N/2E_F$', '$2N/3E_F$', '$3N/5E_F$'], answer: 1,
      sol: '$N(E) = N(E/E_F)^{3/2}$ counts states below $E$; differentiate: $g(E_F) = \\tfrac32N/E_F$. This one number fixes $C_{el}$, the Pauli susceptibility and the screening length.' },
    { id: 'fgas-012', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Fermi energy',
      q: 'A metal is compressed so that its electron density doubles. Its Fermi energy rises by a factor of ______.',
      answer: 1.587, tol: 0.003, calc: () => 2 ** (2 / 3),
      sol: '$E_F \\propto n^{2/3}$: $2^{2/3} = 1.587$.' },
    { id: 'fgas-013', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'pressure',
      q: 'The pressure of an ideal non-relativistic Fermi gas at $T = 0$ is',
      options: ['$\\tfrac35nE_F$', '$\\tfrac23nE_F$', '$\\tfrac25nE_F$', '$nE_F$'], answer: 2,
      sol: '$E_0 = \\tfrac35NE_F \\propto V^{-2/3}$, so $P = -\\partial E_0/\\partial V = \\tfrac23E_0/V = \\tfrac23\\cdot\\tfrac35nE_F = \\tfrac25nE_F$.' },
    { id: 'fgas-014', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'pressure',
      q: 'Using $P = \\tfrac25nE_F$, the degeneracy pressure of the conduction electrons of copper ($n = 8.47\\times10^{28}$ m$^{-3}$, $E_F = 7.03$ eV) is ______ $\\times10^{10}$ Pa.',
      answer: 3.82, tol: 0.04, calc: () => 0.4 * 8.47e28 * 7.03 * C.e / 1e10,
      sol: '$P = 0.4\\times8.47\\times10^{28}\\times7.03\\times1.602\\times10^{-19} = 3.82\\times10^{10}$ Pa, about 380 000 atm. The positive ions hold it in.' },
    { id: 'fgas-015', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'Fermi energy',
      q: 'At the same density and mass, how does the Fermi energy of spinless fermions compare with that of spin-1/2 fermions?',
      options: ['It is $2^{2/3}$ times larger', 'It is the same', 'It is half as large', 'It is twice as large'], answer: 0,
      sol: 'With one state per $k$ instead of two, the sphere must hold $N$ in half the "seats": $k_F^3$ doubles, so $E_F \\propto k_F^2$ grows by $2^{2/3} = 1.59$.' },
    { id: 'fgas-016', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: '2D gas',
      q: 'For an ideal two-dimensional gas of spin-1/2 fermions with areal density $n_s$, the Fermi energy is',
      options: ['$\\dfrac{\\hbar^2}{2m}(3\\pi^2n_s)^{2/3}$', '$\\dfrac{\\pi\\hbar^2n_s}{m}$', '$\\dfrac{2\\pi\\hbar^2n_s}{m}$', '$\\dfrac{\\hbar^2n_s}{2m}$'], answer: 1,
      sol: '$N = 2\\cdot\\frac{A}{(2\\pi)^2}\\pi k_F^2$ gives $k_F^2 = 2\\pi n_s$ and $E_F = \\hbar^2k_F^2/2m = \\pi\\hbar^2n_s/m$, linear in density (constant density of states).' },
    { id: 'fgas-017', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'heat capacity',
      q: 'Roughly what fraction of the conduction electrons in copper ($T_F = 8.16\\times10^4$ K) can be thermally excited at $300$ K? Give $T/T_F$ in units of $10^{-3}$.',
      answer: 3.68, tol: 0.04, calc: () => 300 / 8.16e4 * 1e3,
      sol: 'Only electrons within $\\sim kT$ of $E_F$ have empty states nearby: a fraction $\\sim kT/E_F = T/T_F = 300/81600 = 3.68\\times10^{-3}$. This is why electrons add so little to $C_V$ (Drude’s puzzle).' },
    { id: 'fgas-018', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'helium-3',
      q: 'Liquid $^3$He ($n \\approx 1.6\\times10^{28}$ m$^{-3}$, atomic mass 3 u) has a Fermi temperature of about',
      options: ['0.005 K', '5 K', '500 K', '$5\\times10^4$ K'], answer: 1,
      sol: '$T_F = \\hbar^2(3\\pi^2n)^{2/3}/2mk$. Compared with electrons in a metal, the density is about 5 times lower and the mass 5500 times higher, giving $T_F \\approx 5$ K. Below about 1 K liquid $^3$He is a degenerate Fermi liquid with $C \\propto T$.' },

    // ---- level 3 ----
    { id: 'fgas-019', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'heat capacity',
      q: 'Using $C_{el} = \\frac{\\pi^2}{2}Nk\\frac{T}{T_F}$, the electronic heat capacity of copper ($T_F = 8.16\\times10^4$ K) at $300$ K, in units of $Nk$, is ______.',
      answer: 0.0181, tol: 0.0003, calc: () => (Math.PI ** 2 / 2) * 300 / 8.16e4,
      sol: '$C/Nk = 4.935\\times3.68\\times10^{-3} = 0.0181$, about 1% of the classical $\\tfrac32$.' },
    { id: 'fgas-020', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Sommerfeld',
      q: 'From the Sommerfeld expansion, $\\mu = E_F[1 - \\frac{\\pi^2}{12}(T/T_F)^2]$. At $T = 0.1\\,T_F$, $\\mu/E_F$ is ______.',
      answer: 0.9918, tol: 0.0002, calc: () => 1 - (Math.PI ** 2 / 12) * 0.01,
      sol: '$1 - 0.8225\\times0.01 = 0.9918$. The shift is tiny and quadratic; for a metal at room temperature it is about $10^{-5}$.' },
    { id: 'fgas-021', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Sommerfeld',
      q: 'Why does the chemical potential of a 3D electron gas fall slightly as $T$ rises from zero?',
      options: ['Because electrons are lost to the lattice', 'Because the density of states rises with energy, so keeping $N$ fixed needs a lower $\\mu$', 'Because $E_F$ itself falls with $T$', 'Because the Fermi function is not symmetric about $\\mu$'], answer: 1,
      sol: 'Smearing moves electrons from just below $\\mu$ to just above. Since $g(E) \\propto \\sqrt E$ is larger above, more states would be filled above than emptied below; $\\mu$ must drop to conserve $N$. The Fermi function itself is symmetric about $\\mu$.' },
    { id: 'fgas-022', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Pauli paramagnetism',
      q: 'The spin (Pauli) paramagnetic susceptibility of a degenerate electron gas is',
      options: ['proportional to $1/T$, like Curie’s law', 'proportional to $g(E_F)$ and nearly independent of $T$', 'negative', 'proportional to $T$'], answer: 1,
      sol: 'A field shifts up and down spin bands by $\\mp\\mu_BB$; only electrons within $\\mu_BB$ of $E_F$ flip, about $g(E_F)\\mu_BB$ of them. So $M = \\mu_B^2g(E_F)B/V$ and $\\chi = \\mu_0\\mu_B^2g(E_F)/V = \\tfrac32\\mu_0n\\mu_B^2/E_F$, temperature independent. The diamagnetic Landau term is $-\\tfrac13$ of it.' },
    { id: 'fgas-023', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Pauli paramagnetism',
      q: 'Using $\\chi = \\tfrac32\\mu_0n\\mu_B^2/E_F$, the Pauli susceptibility of sodium ($n = 2.65\\times10^{28}$ m$^{-3}$, $E_F = 3.24$ eV) is ______ $\\times10^{-6}$ (SI, dimensionless).',
      answer: 8.27, tol: 0.09, calc: () => 1.5 * C.mu0 * 2.65e28 * 9.2740100783e-24 ** 2 / (3.24 * C.e) / 1e-6,
      sol: '$\\mu_0\\mu_B^2 = 1.2566\\times10^{-6}\\times(9.274\\times10^{-24})^2 = 1.081\\times10^{-52}$ (SI units). $\\chi = 1.5\\times1.081\\times10^{-52}\\times2.65\\times10^{28}/(5.19\\times10^{-19}) = 8.27\\times10^{-6}$, small and temperature independent.' },
    { id: 'fgas-024', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'ground state', format: 'statements',
      q: 'An ideal Fermi gas and a classical ideal gas have the same density. At $T \\to 0$, which statements are correct for the Fermi gas?',
      options: ['Its energy stays finite, $\\tfrac35NE_F$', 'Its pressure stays finite', 'Its heat capacity vanishes linearly in $T$', 'Its entropy approaches $Nk\\ln2$'], answer: [0, 1, 2],
      sol: 'The Fermi sea keeps energy $\\tfrac35NE_F$ and pressure $\\tfrac25nE_F$; $C$ and $S$ both go as $\\frac{\\pi^2}{2}Nk\\,T/T_F \\to 0$. The classical gas would have $U, P \\to 0$.' },
    { id: 'fgas-025', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'bulk modulus', unit: 'GPa',
      q: 'The bulk modulus of an ideal Fermi gas at $T = 0$ is $B = -V\\,\\partial P/\\partial V = \\tfrac23nE_F$. For the electrons of sodium ($n = 2.65\\times10^{28}$ m$^{-3}$, $E_F = 3.24$ eV) it is ______ GPa.',
      answer: 9.17, tol: 0.1, calc: () => (2 / 3) * 2.65e28 * 3.24 * C.e / 1e9,
      sol: '$P \\propto n^{5/3}$, so $B = \\tfrac53P = \\tfrac23nE_F = \\tfrac23\\times2.65\\times10^{28}\\times5.19\\times10^{-19} = 9.17\\times10^9$ Pa. The measured value, 6.3 GPa, is of the same size: alkali metals are soft because their electron gas is.' },
    { id: 'fgas-026', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'helium-3', unit: 'K',
      q: 'Treat liquid $^3$He ($n = 1.635\\times10^{28}$ m$^{-3}$, $m = 5.008\\times10^{-27}$ kg, spin 1/2) as an ideal Fermi gas. Its Fermi temperature is ______ K.',
      answer: 4.96, tol: 0.06, calc: () => EF(1.635e28, 5.008e-27) / C.kB,
      sol: '$k_F = (3\\pi^2\\times1.635\\times10^{28})^{1/3} = 7.85\\times10^9$ m$^{-1}$. $E_F = \\hbar^2k_F^2/2m = (8.28\\times10^{-25})^2/(1.0016\\times10^{-26}) = 6.85\\times10^{-23}$ J, so $T_F = 4.96$ K. (Interactions raise the effective mass about 3 times, lowering $T_F$.)' },
    { id: 'fgas-027', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'heat capacity',
      q: 'The low-temperature heat capacity of a metal is $C = \\gamma T + \\beta T^3$. The best way to separate $\\gamma$ and $\\beta$ from data is to plot',
      options: ['$C$ against $T$', '$\\ln C$ against $\\ln T$', '$C/T$ against $T^2$: a straight line with intercept $\\gamma$ and slope $\\beta$', '$C$ against $1/T$'], answer: 2,
      sol: '$C/T = \\gamma + \\beta T^2$ is linear in $T^2$. The intercept gives the electronic $\\gamma = \\frac{\\pi^2}{3}k^2g(E_F)/V$, hence the density of states (or effective mass); the slope gives the Debye temperature.' },
    { id: 'fgas-028', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'heat capacity', unit: 'K',
      q: 'For copper, $\\gamma = 0.69$ mJ mol$^{-1}$K$^{-2}$ and $\\theta_D = 343$ K, so $\\beta = \\frac{12\\pi^4R}{5\\theta_D^3}$. Below what temperature does the electronic term exceed the lattice term?',
      answer: 3.78, tol: 0.05, calc: () => Math.sqrt(0.69e-3 / ((12 * Math.PI ** 4 * C.R / 5) / 343 ** 3)),
      sol: '$\\beta = 1944/343^3 = 4.82\\times10^{-5}$ J mol$^{-1}$K$^{-4}$. $\\gamma T = \\beta T^3$ at $T = \\sqrt{\\gamma/\\beta} = \\sqrt{0.69\\times10^{-3}/4.82\\times10^{-5}} = 3.78$ K.' },
    { id: 'fgas-029', type: 'msq', level: 3, exams: ['gate', 'net'], sub: '2D gas', format: 'statements',
      q: 'For an ideal two-dimensional electron gas, which statements are correct?',
      options: ['The density of states per unit area is $m/\\pi\\hbar^2$ (both spins), independent of energy', 'The Fermi energy is proportional to the areal density', 'The heat capacity is linear in $T$ at low temperature', 'The chemical potential shows a $T^2$ correction like the 3D gas'], answer: [0, 1, 2],
      sol: 'Constant $g$ gives $E_F = \\pi\\hbar^2n_s/m$ and $C = \\frac{\\pi^2}{3}k^2g\\,T$. The exact $\\mu = kT\\ln(e^{E_F/kT} - 1) \\approx E_F - kTe^{-E_F/kT}$ has no power-law correction, because $g$ has no slope at $E_F$.' },
    { id: 'fgas-030', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'entropy',
      q: 'The entropy of a degenerate ideal Fermi gas ($T \\ll T_F$) is',
      options: ['$Nk\\ln2$', '$\\frac{\\pi^2}{2}Nk\\frac{T}{T_F}$', '$\\frac{\\pi^2}{4}Nk\\left(\\frac{T}{T_F}\\right)^2$', '$\\tfrac52Nk$'], answer: 1,
      sol: '$S = \\int_0^T(C/T\')dT\'$ with $C \\propto T$ gives $S = C$: $\\frac{\\pi^2}{2}Nk\\,T/T_F$. It depends only on $T/T_F$, which fixes how a degenerate gas behaves in an adiabatic change.' },

    // ---- level 4 ----
    { id: 'fgas-031', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'neutron star', unit: 'MeV',
      q: 'Model a neutron star interior as an ideal non-relativistic gas of neutrons ($m = 1.675\\times10^{-27}$ kg, spin 1/2) at $n = 0.16$ fm$^{-3}$. The neutron Fermi energy is ______ MeV.',
      answer: 58.5, tol: 0.6, calc: () => eV(EF(1.6e44, C.mn)) / 1e6,
      sol: '$n = 1.6\\times10^{44}$ m$^{-3}$, $k_F = (3\\pi^2n)^{1/3} = 1.68\\times10^{15}$ m$^{-1}$ ($\\approx 1.7$ fm$^{-1}$). $E_F = (\\hbar k_F)^2/2m = (1.771\\times10^{-19})^2/(3.35\\times10^{-27}) = 9.37\\times10^{-12}$ J $= 58.5$ MeV. Since $T \\sim 10^9$ K means $kT \\sim 0.1$ MeV, the star is a cold, degenerate Fermi system.' },
    { id: 'fgas-032', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'relativistic',
      q: 'For an ultra-relativistic ideal Fermi gas ($\\varepsilon = pc$) at $T = 0$, which pair is correct?',
      options: ['$\\langle\\varepsilon\\rangle = \\tfrac35E_F$ and $P \\propto n^{5/3}$', '$\\langle\\varepsilon\\rangle = \\tfrac34E_F$ and $P = \\tfrac14nE_F \\propto n^{4/3}$', '$\\langle\\varepsilon\\rangle = \\tfrac12E_F$ and $P \\propto n^2$', '$\\langle\\varepsilon\\rangle = \\tfrac34E_F$ and $P = \\tfrac25nE_F$'], answer: 1,
      sol: 'With $g \\propto \\varepsilon^2$: $\\langle\\varepsilon\\rangle = \\tfrac34E_F$. Since $P = u/3$ for $\\varepsilon = pc$: $P = \\tfrac14nE_F$, and $E_F = \\hbar ck_F \\propto n^{1/3}$, so $P \\propto n^{4/3}$, softer than the non-relativistic $n^{5/3}$.' },
    { id: 'fgas-033', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'white dwarf', unit: 'MeV',
      q: 'In a white dwarf core the electron density is $10^{36}$ m$^{-3}$. The Fermi momentum times $c$, $p_Fc = \\hbar ck_F$, is ______ MeV.',
      answer: 0.611, tol: 0.006, calc: () => C.hbar * C.c * kF(1e36) / C.e / 1e6,
      sol: '$k_F = (3\\pi^2\\times10^{36})^{1/3} = 3.094\\times10^{12}$ m$^{-1}$. $\\hbar ck_F = 1.0546\\times10^{-34}\\times3.00\\times10^8\\times3.094\\times10^{12} = 9.78\\times10^{-14}$ J $= 0.611$ MeV, larger than $m_ec^2 = 0.511$ MeV: the electrons are relativistic.' },
    { id: 'fgas-034', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'white dwarf',
      q: 'Why is there a maximum mass (the Chandrasekhar limit, about $1.4M_\\odot$) for a white dwarf?',
      options: ['Because electrons become bosons at high density', 'Because nuclear fusion restarts above it', 'Because the star then cools to zero temperature', 'Because ultra-relativistic degeneracy pressure grows only as $n^{4/3}$, the same scaling with radius as gravity, so above a certain mass no radius gives balance'], answer: 3,
      sol: 'Non-relativistic: $P \\propto n^{5/3} \\propto R^{-5}$ beats gravitational pressure $\\propto M^2/R^4$ at small $R$, giving $R \\propto M^{-1/3}$. When electrons become relativistic, $P \\propto R^{-4}$, just like gravity; the balance then fixes $M$ itself ($\\approx 1.44M_\\odot$ for 2 nucleons per electron), and heavier stars collapse.' },
    { id: 'fgas-035', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'pressure',
      q: 'An electron gas and a neutron gas have the same number density and are both non-relativistic and degenerate. The electron gas pressure is how many times the neutron gas pressure?',
      answer: 1838.7, tol: 2, calc: () => C.mn / C.me,
      sol: '$P = \\tfrac25nE_F \\propto n^{5/3}/m$, so $P_e/P_n = m_n/m_e = 1838.7$. This is why electrons, not nuclei, support a white dwarf.' },
    { id: 'fgas-036', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'adiabatic',
      q: 'A degenerate ideal Fermi gas is compressed slowly and adiabatically. Since its entropy depends only on $T/T_F$, its temperature varies with volume as',
      options: ['$T \\propto V^{-2/3}$', '$T \\propto V^{-1/3}$', '$T$ stays constant', '$T \\propto V^{2/3}$'], answer: 0,
      sol: '$S = \\frac{\\pi^2}{2}Nk\\,T/T_F$ constant means $T \\propto T_F \\propto n^{2/3} \\propto V^{-2/3}$, the same law as a classical monatomic gas ($TV^{\\gamma - 1}$, $\\gamma = 5/3$). In fact $PV^{5/3}$ is constant for any ideal non-relativistic gas.' },
    { id: 'fgas-037', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'ground state',
      q: 'At $T = 0$ the mean speed of electrons in a 3D Fermi gas is $\\tfrac34v_F$. For copper ($v_F = 1.57\\times10^6$ m/s) this is ______ $\\times10^6$ m/s.',
      answer: 1.18, tol: 0.01, calc: () => 0.75 * 1.57,
      sol: 'Uniform filling of the sphere: $\\langle v\\rangle = \\int_0^{v_F}v\\cdot v^2dv/\\int_0^{v_F}v^2dv = \\tfrac34v_F = 1.18\\times10^6$ m/s. (Mean $v^2$ is $\\tfrac35v_F^2$, matching $\\tfrac35E_F$.)' },
    { id: 'fgas-038', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'Fermi sphere', format: 'statements',
      q: 'For an ideal 3D Fermi gas of spin-1/2 particles, which statements are correct?',
      options: ['$k_F$ is of order the inverse of the mean interparticle spacing', 'Doubling the particle mass halves $E_F$ but leaves $k_F$ unchanged', 'The number of states per unit volume in a $k$-space shell is $k^2dk/\\pi^2$ (both spins)', 'At fixed density, $E_F$ grows with temperature'], answer: [0, 1, 2],
      sol: '$k_F = (3\\pi^2n)^{1/3} \\approx 3.09\\,n^{1/3}$. $k_F$ depends only on $n$; $E_F = \\hbar^2k_F^2/2m$. Shell: $2\\cdot4\\pi k^2dk/(2\\pi)^3 = k^2dk/\\pi^2$. $E_F$ is a ground-state quantity: it does not depend on $T$ (it is $\\mu$ that shifts).' },

    // ---- level 5 ----
    { id: 'fgas-039', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'white dwarf',
      q: 'For non-relativistic white dwarfs, $R \\propto M^{-1/3}$. If a white dwarf had twice the mass (still non-relativistic), its radius would be ______ times the original.',
      answer: 0.794, tol: 0.002, calc: () => 2 ** (-1 / 3),
      sol: 'Balance $P_{deg} \\propto (M/R^3)^{5/3}$ against $GM^2/R^4$: $M^{5/3}R^{-5} \\propto M^2R^{-4}$, so $R \\propto M^{-1/3}$. $2^{-1/3} = 0.794$. Heavier white dwarfs are smaller.' },
    { id: 'fgas-040', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'Sommerfeld', unit: 'eV',
      q: 'Copper electrons ($E_F = 7.03$ eV, $T_F = 8.16\\times10^4$ K) are heated to $10^4$ K by an ultrafast laser pulse. Using the Sommerfeld result, the chemical potential is ______ eV.',
      answer: 6.94, tol: 0.01, calc: () => 7.03 * (1 - (Math.PI ** 2 / 12) * (1e4 / 8.16e4) ** 2),
      sol: '$T/T_F = 0.1225$; $(\\pi^2/12)\\times0.0150 = 0.0123$. $\\mu = 7.03\\times(1 - 0.0123) = 6.94$ eV.' },
    { id: 'fgas-041', type: 'msq', level: 5, exams: ['gate', 'net'], sub: 'dimensions', format: 'statements',
      q: 'For ideal non-relativistic Fermi gases at fixed density, which statements about the low-temperature behaviour are correct?',
      options: ['In 3D, $\\mu$ falls below $E_F$ in proportion to $T^2$', 'In 1D, $\\mu$ rises above $E_F$ at low $T$', 'In 2D, $\\mu$ has no $T^2$ correction', 'The heat capacity goes as $T^{d/2}$ in $d$ dimensions'], answer: [0, 1, 2],
      sol: 'Sommerfeld: $\\mu \\approx E_F - \\frac{\\pi^2}{6}(kT)^2g\'(E_F)/g(E_F)$. $g\'$ is positive in 3D ($\\sqrt E$), negative in 1D ($E^{-1/2}$) and zero in 2D. The heat capacity is $\\frac{\\pi^2}{3}k^2g(E_F)T$, linear in $T$ in every dimension.' },
    { id: 'fgas-042', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'Pauli paramagnetism',
      q: 'A degenerate electron gas sits in a strong field $B$, with $\\mu_BB \\ll E_F$. The fractional spin polarisation $(N_\\uparrow - N_\\downarrow)/N$ at $T = 0$ is',
      options: ['$\\mu_BB/kT$', '$\\tanh(\\mu_BB/kT)$', '$\\tfrac32\\mu_BB/E_F$', '$\\mu_BB/E_F$'], answer: 2,
      sol: 'Each spin band has density of states $g(E_F)/2$ and shifts by $\\mp\\mu_BB$, so $\\tfrac12g(E_F)\\mu_BB$ electrons move from one band to the other: $N_\\uparrow - N_\\downarrow = g(E_F)\\mu_BB = \\tfrac32N\\mu_BB/E_F$. A classical (Curie) estimate $\\mu_BB/kT$ would be far larger, because it ignores Pauli blocking.' },
    { id: 'fgas-043', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'Fermi energy', format: 'multi',
      q: 'Which of the following raise the Fermi energy of an ideal 3D Fermi gas?',
      options: ['Increasing the number density', 'Using lighter particles', 'Raising the temperature at fixed density', 'Removing the spin degeneracy (spinless fermions at the same density)'], answer: [0, 1, 3],
      sol: '$E_F = \\frac{\\hbar^2}{2m}(6\\pi^2n/g)^{2/3}$ grows with $n$, falls with $m$, and grows when $g$ drops from 2 to 1. It is defined at $T = 0$, so temperature does not enter (the chemical potential shifts instead).' },
    { id: 'fgas-044', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'compact stars', format: 'statements',
      q: 'Which statements about degenerate matter in compact stars are correct?',
      options: ['White dwarfs are supported by electron degeneracy pressure', 'Neutron stars are supported mainly by neutron degeneracy pressure and nuclear forces', 'A white dwarf is hotter inside than its Fermi temperature', 'Above about $1.4M_\\odot$ electron degeneracy cannot support a white dwarf'], answer: [0, 1, 3],
      sol: 'In a white dwarf $T \\sim 10^7$ K while $T_F \\sim 10^9$–$10^{10}$ K, so the electrons are degenerate, not thermal. Electrons (light) give the pressure; the Chandrasekhar limit is about $1.4M_\\odot$. Neutron stars rely on neutron degeneracy plus the repulsive core of the nuclear force.' },
    { id: 'fgas-045', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'heat capacity',
      q: 'The Sommerfeld coefficient is $\\gamma = \\frac{\\pi^2}{3}k^2g(E_F)$ per unit volume. In a metal where electron interactions double the effective mass $m^*$, $\\gamma$',
      options: ['doubles', 'halves', 'stays the same', 'rises by $2^{3/2}$'], answer: 0,
      sol: 'At fixed density $k_F$ is fixed and $g(E_F) = m^*k_F/\\pi^2\\hbar^2$ per volume (both spins), proportional to $m^*$. So $\\gamma \\propto m^*$ doubles. Measuring $\\gamma$ is how heavy-fermion metals reveal effective masses of hundreds of $m_e$.' },
    { id: 'fgas-046', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'relativistic',
      q: 'As an ideal electron gas is compressed from the non-relativistic to the ultra-relativistic regime at $T = 0$, its adiabatic index $\\Gamma = d\\ln P/d\\ln n$ changes from',
      options: ['4/3 to 5/3', '1 to 2', '5/3 to 1', '5/3 to 4/3'], answer: 3,
      sol: 'Non-relativistic: $P \\propto n^{5/3}$. Ultra-relativistic: $P \\propto n^{4/3}$. A self-gravitating star needs $\\Gamma > 4/3$ for stability; reaching $4/3$ is the origin of the Chandrasekhar limit.' },
    ...more2,
  ],
  gens: [
    { id: 'fgas-g01', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Fermi energy',
      make(r) {
        const [name, n] = choose(r, METALS);
        const E = eV(EF(n));
        return { q: `${name[0].toUpperCase() + name.slice(1)} has $${nTex(n)}$ conduction electrons per m$^3$. In the free electron model its Fermi energy is ______ eV.`,
          answer: round(E, 3), tol: round(E * 0.01, 3), unit: 'eV', n,
          sol: `$k_F = (3\\pi^2n)^{1/3} = ${sig(kF(n), 4)}$ m$^{-1}$; $E_F = \\hbar^2k_F^2/2m = ${sig(EF(n), 4)}$ J $= ${round(E, 3)}$ eV.` };
      },
      verify: (p) => eV(EF(p.n)) },
    { id: 'fgas-g02', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Fermi parameters',
      make(r) {
        const [name, n] = choose(r, METALS), what = choose(r, ['Fermi temperature (in units of 10^4 K)', 'Fermi velocity (in units of 10^6 m/s)', 'Fermi wavevector (in units of 10^10 m^-1)']);
        const v = what.startsWith('Fermi temperature') ? EF(n) / C.kB / 1e4 : what.startsWith('Fermi velocity') ? C.hbar * kF(n) / C.me / 1e6 : kF(n) / 1e10;
        const label = what.replace('10^4 K', '$10^4$ K').replace('10^6 m/s', '$10^6$ m/s').replace('10^10 m^-1', '$10^{10}$ m$^{-1}$');
        return { q: `For the free electrons of ${name} ($n = ${nTex(n)}$ m$^{-3}$), find the ${label}.`,
          answer: round(v, 3), tol: round(v * 0.01, 3), n, what,
          sol: `$k_F = (3\\pi^2n)^{1/3} = ${sig(kF(n), 4)}$ m$^{-1}$, $v_F = \\hbar k_F/m = ${sig(C.hbar * kF(n) / C.me, 4)}$ m/s, $T_F = \\hbar^2k_F^2/2mk = ${sig(EF(n) / C.kB, 4)}$ K. Answer: $${round(v, 3)}$.` };
      },
      verify: (p) => (p.what.startsWith('Fermi temperature') ? EF(p.n) / C.kB / 1e4 : p.what.startsWith('Fermi velocity') ? C.hbar * kF(p.n) / C.me / 1e6 : kF(p.n) / 1e10) },
    { id: 'fgas-g03', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'heat capacity',
      make(r) {
        const [name, n] = choose(r, METALS), T = choose(r, [4, 20, 77, 300, 1000]);
        const TF = EF(n) / C.kB, c = (Math.PI ** 2 / 2) * T / TF;
        return { q: `In the free electron model, the electronic heat capacity of ${name} ($n = ${nTex(n)}$ m$^{-3}$) at $${T}$ K, in units of $Nk$ (N = number of electrons), is ______.`,
          answer: sig(c, 3), tol: sig(c * 0.015, 2), n, T,
          sol: `$T_F = ${sig(TF, 4)}$ K. $C/Nk = \\frac{\\pi^2}{2}\\frac{T}{T_F} = 4.935\\times\\frac{${T}}{${sig(TF, 4)}} \\approx ${sig(c, 3)}$.` };
      },
      verify: (p) => (Math.PI ** 2 / 2) * p.T / (EF(p.n) / C.kB) },
    { id: 'fgas-g04', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Sommerfeld',
      make(r) {
        const t = choose(r, [0.01, 0.02, 0.05, 0.1, 0.15, 0.2]), q = choose(r, ['mu', 'U']);
        const v = q === 'mu' ? 1 - (Math.PI ** 2 / 12) * t * t : 0.6 * (1 + (5 * Math.PI ** 2 / 12) * t * t);
        return { q: q === 'mu' ? `Using the Sommerfeld expansion, find $\\mu/E_F$ for an ideal 3D Fermi gas at $T = ${t}\\,T_F$.` : `Using the Sommerfeld expansion $U = \\tfrac35NE_F[1 + \\tfrac{5\\pi^2}{12}(T/T_F)^2]$, find $U/NE_F$ at $T = ${t}\\,T_F$.`,
          answer: round(v, 5), tol: 0.0002, t, qq: q,
          sol: q === 'mu' ? `$\\mu/E_F = 1 - \\frac{\\pi^2}{12}(${t})^2 = 1 - ${round((Math.PI ** 2 / 12) * t * t, 6)} = ${round(v, 5)}$.` : `$U/NE_F = 0.6\\times(1 + 4.112\\times${round(t * t, 6)}) = ${round(v, 5)}$. Differentiating gives $C = \\frac{\\pi^2}{2}Nk\\,T/T_F$.` };
      },
      verify: (p) => (p.qq === 'mu' ? 1 - (Math.PI ** 2 / 12) * p.t ** 2 : 0.6 * (1 + (5 * Math.PI ** 2 / 12) * p.t ** 2)) },
    { id: 'fgas-g05', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'pressure',
      make(r) {
        const [name, n] = choose(r, METALS), q = choose(r, ['degeneracy pressure', 'bulk modulus']);
        const v = (q === 'degeneracy pressure' ? 0.4 : 2 / 3) * n * EF(n) / 1e9;
        return { q: `For the free electron gas of ${name} ($n = ${nTex(n)}$ m$^{-3}$) at $T = 0$, the ${q} is ______ GPa.`,
          answer: round(v, 2), tol: Math.max(0.05, round(v * 0.01, 2)), unit: 'GPa', n, qq: q,
          sol: `$E_F = ${round(eV(EF(n)), 3)}$ eV. ${q === 'degeneracy pressure' ? '$P = \\tfrac25nE_F$' : '$B = \\tfrac53P = \\tfrac23nE_F$'} $= ${round(v, 2)}$ GPa.` };
      },
      verify: (p) => (p.qq === 'degeneracy pressure' ? 0.4 : 2 / 3) * p.n * EF(p.n) / 1e9 },
    { id: 'fgas-g06', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'scaling',
      make(r) {
        const a = choose(r, [2, 3, 4, 8, 0.5]), b = choose(r, [1, 2, 4, 0.5]);
        const v = a ** (2 / 3) / b;
        return { q: `An ideal 3D Fermi gas has its density multiplied by ${a} and its particle mass multiplied by ${b}. Its Fermi energy changes by a factor of ______.`,
          answer: round(v, 4), tol: Math.max(0.002, round(v * 0.005, 4)), a, b,
          sol: `$E_F = \\frac{\\hbar^2}{2m}(3\\pi^2n)^{2/3} \\propto n^{2/3}/m$: factor $${a}^{2/3}/${b} = ${round(v, 4)}$.` };
      },
      verify: (p) => p.a ** (2 / 3) / p.b },
    { id: 'fgas-g07', type: 'nat', level: 3, exams: ['gate', 'net'], sub: '2D gas',
      make(r) {
        const ns = choose(r, [1, 2, 3, 5, 10]), [mat, ms] = choose(r, [['GaAs', 0.067], ['Si (100) inversion layer', 0.19], ['free electrons', 1]]);
        const E = Math.PI * C.hbar ** 2 * ns * 1e15 / (ms * C.me) / C.e * 1000;
        return { q: `A two-dimensional electron gas in ${mat} (effective mass $${ms}\\,m_e$, spin degeneracy 2) has sheet density $${ns}\\times10^{11}$ cm$^{-2}$. Its Fermi energy is ______ meV.`,
          answer: round(E, 3), tol: round(E * 0.01, 3), unit: 'meV', ns, ms,
          sol: `$E_F = \\pi\\hbar^2n_s/m^*$ with $n_s = ${ns}\\times10^{15}$ m$^{-2}$: $\\frac{\\pi\\times(1.0546\\times10^{-34})^2\\times${ns}\\times10^{15}}{${ms}\\times9.109\\times10^{-31}} = ${sig(E * C.e / 1000, 4)}$ J $= ${round(E, 3)}$ meV.`,
          trap: 'Convert cm$^{-2}$ to m$^{-2}$: multiply by $10^4$.' };
      },
      verify: (p) => Math.PI * C.hbar ** 2 * p.ns * 1e15 / (p.ms * C.me) / C.e * 1000 },
    { id: 'fgas-g08', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Pauli paramagnetism',
      make(r) {
        const [name, n] = choose(r, METALS);
        const chi = 1.5 * C.mu0 * n * 9.2740100783e-24 ** 2 / EF(n) * 1e6;
        return { q: `In the free electron model, the Pauli spin susceptibility $\\chi = \\tfrac32\\mu_0n\\mu_B^2/E_F$ of ${name} ($n = ${nTex(n)}$ m$^{-3}$) is ______ $\\times10^{-6}$.`,
          answer: round(chi, 3), tol: round(chi * 0.01, 3), n,
          sol: `$E_F = ${round(eV(EF(n)), 3)}$ eV $= ${sig(EF(n), 4)}$ J. $\\chi = 1.5\\times1.2566\\times10^{-6}\\times${nTex(n)}\\times(9.274\\times10^{-24})^2/${sig(EF(n), 4)} \\approx ${round(chi, 3)}\\times10^{-6}$. Since $\\chi \\propto n^{1/3}$, it varies little between metals.` };
      },
      verify: (p) => 1.5 * C.mu0 * p.n * 9.2740100783e-24 ** 2 / EF(p.n) * 1e6 },
    { id: 'fgas-g09', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'heat capacity',
      make(r) {
        const [name, g, th] = choose(r, [['copper', 0.69, 343], ['silver', 0.65, 225], ['gold', 0.73, 165], ['aluminium', 1.35, 428], ['sodium', 1.38, 158], ['potassium', 2.08, 91]]);
        const beta = (12 * Math.PI ** 4 * C.R / 5) / th ** 3, T = Math.sqrt(g * 1e-3 / beta);
        return { q: `For ${name}, $\\gamma = ${g}$ mJ mol$^{-1}$K$^{-2}$ and $\\theta_D = ${th}$ K. At what temperature are the electronic ($\\gamma T$) and Debye ($\\beta T^3$) heat capacities equal?`,
          answer: round(T, 3), tol: round(T * 0.01, 3), unit: 'K', g, th,
          sol: `$\\beta = \\frac{12\\pi^4R}{5\\theta_D^3} = 1944/${th}^3 = ${sig(beta, 4)}$ J mol$^{-1}$K$^{-4}$. $T = \\sqrt{\\gamma/\\beta} = \\sqrt{${g}\\times10^{-3}/${sig(beta, 4)}} \\approx ${round(T, 3)}$ K.` };
      },
      verify: (p) => Math.sqrt(p.g * 1e-3 / ((12 * Math.PI ** 4 * C.R / 5) / p.th ** 3)) },
    { id: 'fgas-g10', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'compact stars',
      make(r) {
        const [what, m, n] = choose(r, [['neutrons in nuclear matter', C.mn, 0.16e45], ['neutrons in nuclear matter', C.mn, 0.08e45], ['protons in a nucleus (half the nucleons)', C.mp, 0.08e45], ['electrons in a white dwarf', C.me, 1e33], ['electrons in a white dwarf', C.me, 1e34]]);
        const E = eV(EF(n, m)) / 1e6;
        return { q: `Treat the ${what} as an ideal non-relativistic spin-1/2 Fermi gas with number density $${nTex(n)}$ m$^{-3}$. The Fermi energy is ______ MeV.`,
          answer: sig(E, 4), tol: sig(E * 0.01, 2), unit: 'MeV', m, n,
          sol: `$k_F = (3\\pi^2n)^{1/3} = ${sig(kF(n), 4)}$ m$^{-1}$, $E_F = \\hbar^2k_F^2/2m = ${sig(EF(n, m), 4)}$ J $= ${sig(E, 4)}$ MeV.${m === C.me && E > 0.2 ? ' This is not small compared with $m_ec^2 = 0.511$ MeV, so relativistic corrections matter.' : ''}` };
      },
      verify: (p) => eV(EF(p.n, p.m)) / 1e6 },
    { id: 'fgas-g11', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'degeneracy',
      make(r) {
        const S = [
          ['conduction electrons in copper at 300 K', 8.47e28, C.me, 300],
          ['electrons in lightly doped silicon ($n = 10^{22}$ m$^{-3}$) at 300 K', 1e22, 0.26 * C.me, 300],
          ['liquid $^3$He at 0.05 K', 1.635e28, 5.008e-27, 0.05],
          ['$^3$He gas at 300 K and 1 atm', 2.45e25, 5.008e-27, 300],
          ['electrons in a white dwarf ($n = 10^{36}$ m$^{-3}$) at $10^7$ K', 1e36, C.me, 1e7],
          ['electrons at the centre of the Sun ($n = 6\\times10^{31}$ m$^{-3}$, $1.5\\times10^7$ K)', 6e31, C.me, 1.5e7],
          ['neutrons in a neutron star ($n = 1.6\\times10^{44}$ m$^{-3}$) at $10^9$ K', 1.6e44, C.mn, 1e9],
          ['a trapped gas of $^{40}$K atoms ($n = 10^{19}$ m$^{-3}$) at 50 nK', 1e19, 39.964 * C.u, 5e-8],
        ];
        const [what, n, m, T] = choose(r, S);
        const TF = EF(n, m) / C.kB, x = T / TF;
        const cat = x < 0.1 ? 'strongly degenerate ($T \\ll T_F$): Fermi-Dirac statistics essential' : x > 10 ? 'non-degenerate: Maxwell-Boltzmann statistics are fine' : 'partly degenerate ($T \\sim T_F$): full Fermi-Dirac integrals needed';
        const all = ['strongly degenerate ($T \\ll T_F$): Fermi-Dirac statistics essential', 'non-degenerate: Maxwell-Boltzmann statistics are fine', 'partly degenerate ($T \\sim T_F$): full Fermi-Dirac integrals needed', 'Bose condensed: most particles in the ground state'];
        const o = mcqOptions(r, cat, all.filter((a) => a !== cat));
        return { q: `Classify ${what}.`, options: o.options, answer: o.answer,
          sol: `$T_F = \\hbar^2(3\\pi^2n)^{2/3}/2mk \\approx ${sig(TF, 3)}$ K, so $T/T_F \\approx ${sig(x, 2)}$: ${cat}. (Fermions never Bose-condense on their own.)` };
      } },
    ...more,
  ],
};
