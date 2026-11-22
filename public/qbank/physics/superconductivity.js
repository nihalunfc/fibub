// Superconductivity at MSc level: zero resistance and the Meissner effect, critical field and current, London
// equations and penetration depth, two-fluid model, thermodynamics (condensation energy, entropy, heat-capacity
// jump, Rutgers formula), type I and II (coherence length, kappa, Hc1, Hc2, vortices), flux quantisation, BCS
// (Cooper pairs, gap, isotope effect, coherence length), Josephson effects, SQUIDs and high-Tc cuprates.
// Original questions for GATE and CSIR NET practice (fibub). Levels: 1 warm-up ... 5 top rank.
import { int, pick, choose, round, mcqOptions, C } from '../_util.js';
import more from './superconductivity.more.gen.js';
import more2 from './superconductivity.more2.gen.js';

const PHI0 = C.h / (2 * C.e); // flux quantum, Wb
const kBe = C.kB / C.e;
const KJ = 2 * C.e / C.h; // Josephson constant, Hz/V

export default {
  topic: 'superconductivity',
  items: [
    // ---------- level 1 ----------
    { id: 'scd-001', type: 'mcq', level: 1, exams: ['gate', 'net', 'jam'], sub: 'Meissner effect',
      q: 'A sample is cooled through its superconducting transition while sitting in a weak magnetic field. The Meissner effect means that',
      options: ['the field inside stays frozen at the value it had before cooling', 'the field is expelled from the interior, so $B = 0$ inside', 'the field inside doubles', 'the resistance becomes zero but nothing happens to the field'], answer: 1,
      sol: 'A merely perfect conductor ($\\rho = 0$) obeys $d\\mathbf B/dt = 0$ inside, so it would trap the field present when it became perfect. A superconductor actively expels the field (except within the penetration depth $\\lambda$): $B = 0$ inside whatever the history. So superconductivity is a thermodynamic phase, not just zero resistance.' },
    { id: 'scd-002', type: 'mcq', level: 1, exams: ['gate', 'net', 'jam'], sub: 'flux quantisation',
      q: 'The magnetic flux through a thick superconducting ring is quantised in units of',
      options: ['$h/e = 4.14\\times10^{-15}$ Wb', '$h/4e = 1.03\\times10^{-15}$ Wb', '$h/2e = 2.07\\times10^{-15}$ Wb', '$e/h = 2.42\\times10^{14}$ Wb$^{-1}$'], answer: 2,
      sol: 'The pair wavefunction must be single-valued around the ring, and the carriers have charge $2e$, so $\\Phi = n\\,h/2e$. $\\Phi_0 = 6.626\\times10^{-34}/(2\\times1.602\\times10^{-19}) = 2.07\\times10^{-15}$ Wb. Its measurement in 1961 showed the carriers are pairs.',
      trap: '$h/e$ would be the flux quantum for single-electron carriers.' },
    { id: 'scd-003', type: 'nat', level: 1, exams: ['gate', 'net', 'jam'], sub: 'critical field',
      q: 'A type-I superconductor has $T_c = 7.2$ K and critical field $B_c(0) = 0.080$ T, with $B_c(T) = B_c(0)[1 - (T/T_c)^2]$. At $3.6$ K the critical field is ______ T (to three decimal places).',
      answer: 0.060, tol: 0.001, calc: () => 0.08 * (1 - 0.25),
      sol: '$T/T_c = 0.5$, so $B_c = 0.080(1 - 0.25) = 0.060$ T.',
      trap: 'Using $1 - T/T_c$ (linear) gives 0.040 T.' },
    { id: 'scd-004', type: 'msq', level: 1, exams: ['gate', 'net', 'jam'], sub: 'type I and type II',
      q: 'Which statements about type-I and type-II superconductors are correct?',
      options: ['Type-II superconductors are useless for magnets because their critical fields are smaller.', 'A type-I superconductor shows a complete Meissner effect up to $H_c$, then becomes normal.', 'A type-II superconductor lets flux in as quantised vortices between $H_{c1}$ and $H_{c2}$.', 'Most elemental superconductors such as Pb, Sn and Al are type I.'], answer: [1, 2, 3],
      sol: 'Type I: full expulsion up to $H_c$ (tens of mT). Type II: full expulsion below $H_{c1}$, a mixed (vortex) state up to $H_{c2}$, which can reach tens of tesla. Nb$_3$Sn, NbTi and cuprates are type II and are exactly what superconducting magnets use. (Nb and V are type II among the elements.)' },
    { id: 'scd-005', type: 'mcq', level: 1, exams: ['gate', 'net', 'jam'], sub: 'isotope effect',
      q: 'For many conventional superconductors $T_c \\propto M^{-1/2}$, where $M$ is the isotopic mass. This isotope effect shows that',
      options: ['lattice vibrations (phonons) take part in forming the superconducting state', 'the nuclei carry the supercurrent', 'superconductivity is a magnetic effect', 'heavier atoms always make better superconductors'], answer: 0,
      sol: 'Phonon frequencies scale as $M^{-1/2}$; BCS gives $k_BT_c \\approx 1.13\\hbar\\omega_De^{-1/N(0)V}$, so $T_c \\propto \\omega_D \\propto M^{-1/2}$. The electron-phonon interaction provides the attraction that binds Cooper pairs. Heavier isotopes lower $T_c$.' },
    { id: 'scd-006', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'BCS theory',
      q: 'In weak-coupling BCS theory the energy gap at $T = 0$ is related to the transition temperature by',
      options: ['$\\Delta(0) = k_BT_c$', '$2\\Delta(0) = 1.76\\,k_BT_c$', '$2\\Delta(0) = 7.04\\,k_BT_c$', '$2\\Delta(0) = 3.52\\,k_BT_c$'], answer: 3,
      sol: 'The BCS gap equation gives $\\Delta(0) = 1.764\\,k_BT_c$, so the energy to break a pair is $2\\Delta(0) = 3.53\\,k_BT_c$. Strongly coupled metals (Pb, Hg) have somewhat larger ratios, about 4.3 to 4.6.' },

    // ---------- level 2 ----------
    { id: 'scd-007', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'BCS theory',
      q: 'Niobium has $T_c = 9.2$ K. The BCS estimate of its pair-breaking energy $2\\Delta(0)$ is ______ meV (to two decimal places). Take $k_B = 8.617\\times10^{-5}$ eV/K.',
      answer: 2.79, tol: 0.02, calc: () => 3.52 * kBe * 9.2 * 1000,
      sol: '$2\\Delta = 3.52k_BT_c = 3.52\\times8.617\\times10^{-5}\\times9.2$ eV $= 2.79\\times10^{-3}$ eV $= 2.79$ meV, in the far infrared.' },
    { id: 'scd-008', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'BCS theory',
      q: 'Aluminium has $T_c = 1.2$ K. Using the BCS relation, photons can break Cooper pairs only above a frequency of ______ GHz (to the nearest GHz).',
      answer: 88, tol: 1, calc: () => 3.52 * C.kB * 1.2 / C.h / 1e9,
      sol: 'Absorption needs $hf \\ge 2\\Delta = 3.52k_BT_c = 3.52\\times1.381\\times10^{-23}\\times1.2 = 5.83\\times10^{-23}$ J. $f = 5.83\\times10^{-23}/6.626\\times10^{-34} = 8.8\\times10^{10}$ Hz $= 88$ GHz. Below this frequency the superconductor absorbs nothing (at $T = 0$).' },
    { id: 'scd-009', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'London equations',
      q: 'In the London theory with superfluid density $n_s$ (carriers of charge $e$ and mass $m$), the penetration depth is',
      options: ['$\\lambda_L = \\sqrt{\\dfrac{\\mu_0n_se^2}{m}}$', '$\\lambda_L = \\dfrac{m}{\\mu_0n_se^2}$', '$\\lambda_L = \\sqrt{\\dfrac{m}{\\varepsilon_0n_se^2}}$', '$\\lambda_L = \\sqrt{\\dfrac{m}{\\mu_0n_se^2}}$'], answer: 3,
      sol: 'The second London equation $\\nabla\\times\\mathbf J = -\\dfrac{n_se^2}{m}\\mathbf B$ with $\\nabla\\times\\mathbf B = \\mu_0\\mathbf J$ gives $\\nabla^2\\mathbf B = \\mathbf B/\\lambda_L^2$ with $\\lambda_L^2 = m/\\mu_0n_se^2$. (Using pairs, $m \\to 2m$, $e \\to 2e$, $n_s \\to n_s/2$ gives the same result.) The expression with $\\varepsilon_0$ in place of $\\mu_0$ is $1/\\omega_p$, a time, not a length.' },
    { id: 'scd-010', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'London equations',
      q: 'For a superfluid electron density of $1.0\\times10^{28}$ m$^{-3}$ (free-electron mass), the London penetration depth is ______ nm (to one decimal place).',
      answer: 53.1, tol: 0.5, calc: () => Math.sqrt(C.me / (C.mu0 * 1e28 * C.e ** 2)) * 1e9,
      sol: '$\\lambda_L = \\sqrt{\\dfrac{9.109\\times10^{-31}}{1.257\\times10^{-6}\\times10^{28}\\times(1.602\\times10^{-19})^2}} = \\sqrt{2.82\\times10^{-15}} = 5.31\\times10^{-8}$ m $= 53.1$ nm. Equivalently $\\lambda_L = c/\\omega_p$.' },
    { id: 'scd-011', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'isotope effect',
      q: 'A superconductor made with isotope mass 200 has $T_c = 4.15$ K. If $T_c \\propto M^{-1/2}$, a sample made with mass 204 has $T_c$ of about',
      options: ['$4.07$ K', '$4.11$ K', '$4.19$ K', '$4.15$ K'], answer: 1,
      sol: '$T_c\' = 4.15\\sqrt{200/204} = 4.15\\times0.9901 = 4.11$ K. The heavier isotope vibrates more slowly and gives a slightly lower $T_c$.',
      trap: 'Using $M^{+1/2}$ gives 4.19 K; using $M^{-1}$ gives 4.07 K.' },
    { id: 'scd-012', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'London equations',
      q: 'Which are consequences of the London equations $\\dfrac{\\partial\\mathbf J}{\\partial t} = \\dfrac{n_se^2}{m}\\mathbf E$ and $\\nabla\\times\\mathbf J = -\\dfrac{n_se^2}{m}\\mathbf B$?',
      options: ['Supercurrents flow only within about $\\lambda_L$ of the surface.', 'The penetration depth does not depend on temperature.', 'A steady supercurrent flows with no electric field.', 'A magnetic field decays exponentially into the superconductor over $\\lambda_L$.'], answer: [0, 2, 3],
      sol: 'The first equation says $\\mathbf E$ accelerates the superfluid freely: in steady state $\\mathbf E = 0$ (zero resistance). The second gives $\\nabla^2\\mathbf B = \\mathbf B/\\lambda_L^2$: exponential decay, and since $\\mathbf J \\propto \\nabla\\times\\mathbf B$ the currents live in the same skin. $n_s$ falls to zero at $T_c$, so $\\lambda$ grows and diverges there.' },
    { id: 'scd-013', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'Josephson effect',
      q: 'A DC voltage $V$ across a Josephson junction makes the supercurrent oscillate at frequency',
      options: ['$2eV/h$, about $483.6$ GHz per mV', '$eV/h$', '$eV/2h$', '$hV/2e$'], answer: 0,
      sol: 'The pair phase difference evolves as $\\hbar\\dot\\delta = 2eV$, so $I = I_c\\sin\\delta$ oscillates at $f = 2eV/h$. $2e/h = 483.6$ THz/V $= 483.6$ GHz/mV. This relation defines the voltage standard.' },
    { id: 'scd-014', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Josephson effect',
      q: 'A Josephson junction is biased at $10$ μV. The AC Josephson frequency is ______ GHz (to two decimal places).',
      answer: 4.84, tol: 0.02, calc: () => KJ * 1e-5 / 1e9,
      sol: '$f = 2eV/h = 2\\times1.602\\times10^{-19}\\times10^{-5}/6.626\\times10^{-34} = 4.84\\times10^9$ Hz.' },
    { id: 'scd-015', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'thermodynamics',
      q: 'Which statement about the superconducting transition in zero applied field is correct?',
      options: ['It is first order with a large latent heat.', 'The entropy of the superconducting state is higher than that of the normal state.', 'It is second order: no latent heat, but a jump in the heat capacity at $T_c$.', 'The heat capacity is continuous at $T_c$.'], answer: 2,
      sol: 'The superconducting state is more ordered (lower entropy) below $T_c$; at $T_c$ the entropies meet, so there is no latent heat. The electronic heat capacity jumps up on cooling through $T_c$, by $\\Delta C = 1.43\\gamma T_c$ in BCS. In a non-zero field the transition becomes first order.' },
    { id: 'scd-016', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'type I and type II',
      q: 'A superconductor has penetration depth $\\lambda$ and coherence length $\\xi$. It is type II when the Ginzburg-Landau parameter $\\kappa = \\lambda/\\xi$ is',
      options: ['less than $1/\\sqrt2$', 'greater than $1/\\sqrt2$', 'exactly 1', 'greater than $\\sqrt2$'], answer: 1,
      sol: 'The energy of an interface between normal and superconducting regions is roughly $\\tfrac12\\mu_0H_c^2(\\xi - \\lambda)$ per area. For $\\kappa > 1/\\sqrt2$ (precise GL result) it is negative, so the material lets flux in as many thin vortices: type II.' },
    { id: 'scd-041', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'Meissner effect',
      q: 'A perfect conductor (zero resistance only) and a superconductor are each cooled in a field $B_0$ below their transition, and then the field is switched off. Which statements are correct?',
      options: ['The superconductor had already expelled $B_0$ while being cooled.', 'After the field is removed, the superconductor holds no flux in its interior.', 'Both end in exactly the same state, so the Meissner effect follows from zero resistance.', 'The perfect conductor keeps the field $B_0$ trapped inside after the external field is removed.'], answer: [0, 1, 3],
      sol: 'Inside a perfect conductor $\\partial\\mathbf B/\\partial t = 0$, so it keeps whatever field it had when it became perfect; removing the outside field induces currents that keep $B_0$ inside. The superconductor expels the field on cooling and ends field-free either way. The end states differ, so the Meissner effect is an extra property, not a consequence of $\\rho = 0$.' },

    // ---------- level 3 ----------
    { id: 'scd-017', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'thermodynamics',
      q: 'A superconductor has thermodynamic critical field $B_c = 0.20$ T at some temperature. The condensation energy density (normal minus superconducting free energy) there is ______ kJ/m$^3$ (to one decimal place).',
      answer: 15.9, tol: 0.1, calc: () => 0.04 / (2 * C.mu0) / 1000,
      sol: 'Expelling a field $B$ costs $B^2/2\\mu_0$ per volume; at $B_c$ this equals the condensation energy. $g_n - g_s = B_c^2/2\\mu_0 = 0.040/(2\\times1.257\\times10^{-6}) = 1.59\\times10^4$ J/m$^3$.' },
    { id: 'scd-018', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'type I and type II',
      q: 'A type-II superconductor has Ginzburg-Landau coherence length $\\xi = 5.0$ nm. Its upper critical field $B_{c2} = \\Phi_0/2\\pi\\xi^2$ is ______ T (to one decimal place).',
      answer: 13.2, tol: 0.1, calc: () => PHI0 / (2 * Math.PI * 25e-18),
      sol: 'Superconductivity survives until vortex cores, each of radius about $\\xi$, overlap. $B_{c2} = \\dfrac{2.068\\times10^{-15}}{2\\pi\\times(5.0\\times10^{-9})^2} = \\dfrac{2.068\\times10^{-15}}{1.571\\times10^{-16}} = 13.2$ T. Short coherence lengths give the huge fields of Nb$_3$Sn and cuprates.' },
    { id: 'scd-019', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'London equations',
      q: 'A field $B_0$ is applied parallel to the flat surface of a thick superconductor. At a depth of $3\\lambda_L$ the field is about',
      options: ['$0.37\\,B_0$', '$0.33\\,B_0$', '$0.05\\,B_0$', 'zero exactly'], answer: 2,
      sol: '$B(x) = B_0e^{-x/\\lambda_L}$, so $B(3\\lambda_L) = e^{-3}B_0 = 0.050\\,B_0$. $0.37B_0$ is the value at one penetration depth. The decay never reaches exactly zero, but beyond a few $\\lambda$ it is negligible.' },
    { id: 'scd-020', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'two-fluid model',
      q: 'In the two-fluid model $\\lambda(T) = \\lambda(0)/\\sqrt{1 - (T/T_c)^4}$. For $\\lambda(0) = 50$ nm, at $T = 0.8\\,T_c$ the penetration depth is ______ nm (to one decimal place).',
      answer: 65.1, tol: 0.3, calc: () => 50 / Math.sqrt(1 - 0.8 ** 4),
      sol: 'The superfluid fraction is $1 - t^4 = 1 - 0.4096 = 0.5904$ and $\\lambda \\propto n_s^{-1/2}$: $\\lambda = 50/\\sqrt{0.5904} = 50/0.7684 = 65.1$ nm.' },
    { id: 'scd-021', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'BCS theory',
      q: 'Which statements about the BCS ground state of a conventional superconductor are correct?',
      options: ['Electrons pair as $(\\mathbf k\\uparrow, -\\mathbf k\\downarrow)$, with zero total momentum and total spin 0.', 'Single-particle excitations need at least an energy $\\Delta$, and breaking a pair costs at least $2\\Delta$.', 'The gap falls continuously to zero as $T \\to T_c$.', 'Each Cooper pair has total spin 1.'], answer: [0, 1, 2],
      sol: 'The phonon-mediated attraction is strongest for time-reversed partners in a spin singlet ($S = 0$, s-wave). Quasiparticle energies are $E_k = \\sqrt{\\xi_k^2 + \\Delta^2} \\ge \\Delta$; a pair breaks into two quasiparticles, costing $2\\Delta$. $\\Delta(T)$ vanishes at $T_c$ as $(1 - T/T_c)^{1/2}$. (Spin-triplet pairing exists in a few exotic materials, not in BCS metals.)' },
    { id: 'scd-022', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'thermodynamics',
      q: 'Aluminium has $\\gamma = 1.35$ mJ mol$^{-1}$ K$^{-2}$ and $T_c = 1.18$ K. The BCS heat-capacity jump at $T_c$, $\\Delta C = 1.43\\gamma T_c$, is ______ mJ mol$^{-1}$ K$^{-1}$ (to two decimal places).',
      answer: 2.28, tol: 0.02, calc: () => 1.43 * 1.35 * 1.18,
      sol: 'Normal-state electronic heat capacity at $T_c$: $\\gamma T_c = 1.593$ mJ mol$^{-1}$ K$^{-1}$. $\\Delta C = 1.43\\times1.593 = 2.28$ mJ mol$^{-1}$ K$^{-1}$, so just below $T_c$ the superconductor\'s electronic heat capacity is $2.43\\gamma T_c$.' },
    { id: 'scd-023', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'thermodynamics',
      q: 'Well below $T_c$, the electronic heat capacity of a conventional (fully gapped) superconductor varies as',
      options: ['$\\gamma T$, as in the normal metal', '$T^3$', '$e^{-\\Delta/k_BT}$', '$T^{3/2}$'], answer: 2,
      sol: 'Excitations need at least $\\Delta$, so their number goes as $e^{-\\Delta/k_BT}$, and so does $C_{es}$ (times a power of $T$). Measuring $\\ln C$ against $1/T$ gives $\\Delta$. A power law (e.g. $T^2$) instead points to nodes in the gap, as in d-wave cuprates.' },
    { id: 'scd-024', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'flux quantisation',
      q: 'A SQUID loop has area $1.0$ mm$^2$. The change in a perpendicular magnetic field that changes the flux through it by one flux quantum is about',
      options: ['$2.1$ μT', '$2.1$ nT', '$2.1$ pT', '$4.1$ nT'], answer: 1,
      sol: '$\\Delta B = \\Phi_0/A = 2.07\\times10^{-15}/10^{-6} = 2.07\\times10^{-9}$ T. SQUIDs resolve a small fraction of $\\Phi_0$, giving sensitivities of femtotesla with larger pickup loops, enough to detect the brain\'s magnetic fields.',
      trap: '$4.1$ nT uses $h/e$ instead of $h/2e$.' },
    { id: 'scd-025', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'flux quantisation',
      q: 'Flux trapped in hollow superconducting cylinders was measured to come in steps of $h/q$. The value of $q$ found, and its meaning, is',
      options: ['$q = 2e$: the current is carried by pairs of electrons', '$q = e$: single electrons carry the current', '$q = e/2$: fractional charges', '$q = 4e$: quartets of electrons'], answer: 0,
      sol: 'The experiments (1961) gave $\\Phi_0 = h/2e$, direct evidence that the superconducting condensate is made of pairs, as BCS had proposed. The same $2e$ appears in the Josephson frequency $2eV/h$.' },
    { id: 'scd-026', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'vortices',
      q: 'A type-II superconductor in the mixed state carries an average field of $0.50$ T as a triangular lattice of vortices, each with one flux quantum. The distance between neighbouring vortices is ______ nm (to the nearest nm).',
      answer: 69, tol: 1, calc: () => Math.sqrt(2 * PHI0 / (Math.sqrt(3) * 0.5)) * 1e9,
      sol: 'Each vortex occupies area $\\Phi_0/B$. A triangular lattice of spacing $a$ has area $\\tfrac{\\sqrt3}{2}a^2$ per site, so $a = \\sqrt{\\dfrac{2\\Phi_0}{\\sqrt3B}} = \\sqrt{\\dfrac{2\\times2.068\\times10^{-15}}{1.732\\times0.50}} = 6.9\\times10^{-8}$ m $= 69$ nm.',
      trap: 'Using a square lattice, $a = \\sqrt{\\Phi_0/B} = 64$ nm.' },
    { id: 'scd-027', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'thermodynamics',
      q: 'For a type-I superconductor with critical field curve $H_c(T)$, which statements are correct?',
      options: ['The latent heat is largest at $T = T_c$.', 'In a non-zero field the transition is first order, with latent heat.', 'The entropy difference is $S_n - S_s = -\\mu_0H_c\\,dH_c/dT$.', 'At $T_c$ (zero field) the latent heat vanishes.'], answer: [1, 2, 3],
      sol: 'Along the coexistence curve $g_n = g_s - \\tfrac12\\mu_0H_c^2$ (per volume, with the field energy). Differentiating in $T$: $S_n - S_s = -\\mu_0H_c\\,dH_c/dT > 0$ (since $dH_c/dT < 0$). The latent heat $L = T(S_n - S_s)$ is non-zero for $0 < T < T_c$ but vanishes at $T_c$ (where $H_c = 0$) and at $T = 0$ (third law).' },
    { id: 'scd-028', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'thermodynamics',
      q: 'Tin has $T_c = 3.72$ K and $B_c(0) = 0.030$ T, with $B_c(T) = B_c(0)[1 - (T/T_c)^2]$. Rutgers\' formula $\\Delta C = \\dfrac{T_c}{\\mu_0}\\left(\\dfrac{dB_c}{dT}\\right)^2_{T_c}$ gives a heat-capacity jump of ______ J m$^{-3}$ K$^{-1}$ (to the nearest whole number).',
      answer: 770, tol: 5, calc: () => 4 * 0.03 ** 2 / (C.mu0 * 3.72),
      sol: '$dB_c/dT$ at $T_c$ is $-2B_c(0)/T_c$, so $\\Delta C = \\dfrac{T_c}{\\mu_0}\\cdot\\dfrac{4B_c(0)^2}{T_c^2} = \\dfrac{4B_c(0)^2}{\\mu_0T_c} = \\dfrac{4\\times9.0\\times10^{-4}}{1.257\\times10^{-6}\\times3.72} = 770$ J m$^{-3}$ K$^{-1}$.' },
    { id: 'scd-042', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'vortices',
      q: 'Which statements about the mixed (vortex) state of a type-II superconductor are correct?',
      options: ['Circulating supercurrents around each vortex extend over a distance of about $\\lambda$.', 'A transport current always flows without dissipation, whatever happens to the vortices.', 'Each vortex carries exactly one flux quantum $h/2e$.', 'The superconducting order parameter vanishes at the vortex core, over a radius of about $\\xi$.'], answer: [0, 2, 3],
      sol: 'A vortex is a normal core (size $\\xi$) surrounded by screening currents (size $\\lambda$) enclosing one $\\Phi_0$, the energetically cheapest unit. A transport current pushes vortices sideways (Lorentz force); if they move, they induce an electric field and dissipate energy, which is why practical wires need pinning centres.' },

    // ---------- level 4 ----------
    { id: 'scd-029', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'coherence length',
      q: 'A clean superconductor has Fermi velocity $1.5\\times10^6$ m/s and gap $\\Delta = 0.18$ meV. Its BCS coherence length $\\xi_0 = \\hbar v_F/\\pi\\Delta$ is ______ μm (to two decimal places).',
      answer: 1.75, tol: 0.02, calc: () => C.hbar * 1.5e6 / (Math.PI * 0.18e-3 * C.e) * 1e6,
      sol: '$\\xi_0 = \\dfrac{1.055\\times10^{-34}\\times1.5\\times10^6}{\\pi\\times0.18\\times10^{-3}\\times1.602\\times10^{-19}} = \\dfrac{1.58\\times10^{-28}}{9.06\\times10^{-23}} = 1.75\\times10^{-6}$ m. Such a long coherence length (aluminium) makes the material strongly type I.' },
    { id: 'scd-030', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'type I and type II',
      q: 'A superconductor has $\\lambda = 40$ nm and $\\xi = 100$ nm. It is',
      options: ['type II, because $\\kappa = 2.5$', 'type I, because $\\kappa = 0.4 < 1/\\sqrt2$', 'type II, because $\\xi > \\lambda$', 'on the borderline, because $\\kappa = 1$'], answer: 1,
      sol: '$\\kappa = \\lambda/\\xi = 0.40 < 0.707$: positive wall energy, so the material avoids normal-superconducting interfaces and shows a full Meissner effect up to $H_c$. $2.5$ is $\\xi/\\lambda$, the wrong way up.' },
    { id: 'scd-031', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'critical current',
      q: 'A type-I superconducting wire of radius $0.50$ mm has $B_c = 0.030$ T at the working temperature. By Silsbee\'s rule (the current\'s own surface field reaches $B_c$), its critical current is ______ A (to one decimal place).',
      answer: 75.0, tol: 0.5, calc: () => 2 * Math.PI * 5e-4 * 0.03 / C.mu0,
      sol: 'The field at the surface of a wire carrying $I$ is $\\mu_0I/2\\pi a$. Setting it equal to $B_c$: $I_c = \\dfrac{2\\pi aB_c}{\\mu_0} = \\dfrac{2\\pi\\times5.0\\times10^{-4}\\times0.030}{1.257\\times10^{-6}} = 75.0$ A.' },
    { id: 'scd-032', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'Josephson effect',
      q: 'Which statements about Josephson junctions are correct?',
      options: ['Under microwaves of frequency $f$, the current-voltage curve shows steps at $V = nhf/2e$.', 'The critical current of a two-junction SQUID is periodic in the enclosed flux with period $h/2e$.', 'The steps under microwaves appear at $V = nhf/e$.', 'With no voltage, a supercurrent $I = I_c\\sin\\delta$ flows, set by the phase difference $\\delta$.'], answer: [0, 1, 3],
      sol: 'DC effect: $I = I_c\\sin\\delta$. AC effect: $\\dot\\delta = 2eV/\\hbar$. Microwaves phase-lock the oscillation, producing Shapiro steps at multiples of $hf/2e$ (about 20.7 μV per 10 GHz). In a SQUID the two junction phases differ by $2\\pi\\Phi/\\Phi_0$, so $I_c(\\Phi)$ repeats every $\\Phi_0$.' },
    { id: 'scd-033', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'Josephson effect',
      q: 'A Josephson junction irradiated at $10$ GHz shows constant-voltage Shapiro steps. The first step is at ______ μV (to one decimal place).',
      answer: 20.7, tol: 0.1, calc: () => C.h * 1e10 / (2 * C.e) * 1e6,
      sol: 'Steps occur when $2eV/h = nf$: $V_1 = hf/2e = 6.626\\times10^{-34}\\times10^{10}/(3.204\\times10^{-19}) = 2.07\\times10^{-5}$ V $= 20.7$ μV. Arrays of thousands of junctions give the 1 V and 10 V standards.' },
    { id: 'scd-034', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'type I and type II',
      q: 'A type-II superconductor has $\\kappa = 50$ and thermodynamic critical field $B_c = 0.20$ T. In Ginzburg-Landau theory, $B_{c2} = \\sqrt2\\kappa B_c$ is about',
      options: ['$14$ T', '$10$ T', '$7.1$ T', '$0.28$ T'], answer: 0,
      sol: '$B_{c2} = \\sqrt2\\times50\\times0.20 = 14.1$ T. The lower critical field is much smaller, $B_{c1} \\approx B_c\\ln\\kappa/(\\sqrt2\\kappa) = 0.011$ T. So $B_{c1} \\ll B_c \\ll B_{c2}$ for large $\\kappa$.' },
    { id: 'scd-035', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'BCS theory',
      q: 'In BCS theory the condensation energy is $\\tfrac12N(0)\\Delta^2$, where $N(0)$ is the normal density of states at $E_F$ (both spins). For $N(0) = 1.0\\times10^{47}$ J$^{-1}$ m$^{-3}$ and $\\Delta = 1.5$ meV, the thermodynamic critical field $B_c$ is ______ mT (to one decimal place).',
      answer: 85.2, tol: 0.5, calc: () => Math.sqrt(2 * C.mu0 * 0.5 * 1e47 * (1.5e-3 * C.e) ** 2) * 1000,
      sol: 'Condensation energy $= \\tfrac12\\times10^{47}\\times(1.5\\times10^{-3}\\times1.602\\times10^{-19})^2 = 2.89\\times10^3$ J/m$^3$. Set equal to $B_c^2/2\\mu_0$: $B_c = \\sqrt{2\\mu_0\\times2890} = \\sqrt{7.26\\times10^{-3}} = 0.0852$ T $= 85.2$ mT.' },
    { id: 'scd-036', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'BCS theory',
      q: 'Just below $T_c$, the BCS energy gap varies as',
      options: ['$\\Delta \\propto (1 - T/T_c)$', '$\\Delta \\propto (1 - T/T_c)^{1/2}$', '$\\Delta \\propto (1 - T/T_c)^{2}$', '$\\Delta \\propto e^{-T_c/T}$'], answer: 1,
      sol: 'BCS (and Ginzburg-Landau, a mean-field theory) gives $\\Delta(T) \\approx 3.06\\,k_BT_c(1 - T/T_c)^{1/2}$, the same square-root onset as the magnetisation of a mean-field ferromagnet. The order parameter $\\psi \\propto \\Delta$ is small near $T_c$, which is what makes the GL expansion work.' },

    // ---------- level 5 ----------
    { id: 'scd-037', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'flux quantisation',
      q: 'A thick superconducting ring of mean radius $10$ μm is cooled through $T_c$ in a perpendicular field of $0.10$ mT, and the field is then removed. The number of flux quanta trapped in the ring is ______.',
      answer: 15, tol: 0, calc: () => Math.round(Math.PI * 1e-10 * 1e-4 / PHI0),
      sol: 'The applied flux is $\\pi r^2B = \\pi\\times10^{-10}\\times10^{-4} = 3.14\\times10^{-14}$ Wb $= 15.2\\,\\Phi_0$. The fluxoid must be an integer, so the ring traps the nearest whole number, $15\\Phi_0$ (a small screening current makes up the difference while cooling). Removing the field leaves exactly $15\\Phi_0$.' },
    { id: 'scd-038', type: 'msq', level: 5, exams: ['gate', 'net'], sub: 'high-Tc cuprates',
      q: 'Which statements about the copper-oxide (cuprate) superconductors are correct?',
      options: ['Several have $T_c$ above the boiling point of nitrogen, 77 K.', 'Their gap has d-wave symmetry, with nodes where it vanishes on the Fermi surface.', 'They are extreme type-II materials, with coherence lengths of only a few nanometres.', 'They show the full isotope effect $T_c \\propto M^{-1/2}$ of simple BCS metals.'], answer: [0, 1, 2],
      sol: 'YBa$_2$Cu$_3$O$_7$ has $T_c \\approx 92$ K. Phase-sensitive SQUID experiments show a $d_{x^2 - y^2}$ gap with four nodes, giving power-law low-$T$ properties. $\\xi \\sim 1$ to 2 nm in-plane and $\\lambda \\sim 150$ nm make $\\kappa \\sim 100$. The oxygen isotope effect at optimal doping is very small, a sign that simple phonon BCS does not explain them.' },
    { id: 'scd-039', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'type I and type II',
      q: 'A type-II superconductor has $B_{c2} = 10$ T and thermodynamic critical field $B_c = 0.10$ T. Using $B_{c2} = \\Phi_0/2\\pi\\xi^2$ and $B_{c2} = \\sqrt2\\kappa B_c$, its penetration depth is ______ nm (to the nearest nm).',
      answer: 406, tol: 4, calc: () => { const xi = Math.sqrt(PHI0 / (2 * Math.PI * 10)); return 10 / (0.1 * Math.SQRT2) * xi * 1e9; },
      sol: '$\\xi = \\sqrt{\\Phi_0/2\\pi B_{c2}} = \\sqrt{2.068\\times10^{-15}/62.83} = 5.74$ nm. $\\kappa = B_{c2}/(\\sqrt2B_c) = 10/0.1414 = 70.7$. $\\lambda = \\kappa\\xi = 70.7\\times5.74 = 406$ nm.' },
    { id: 'scd-040', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'SQUID',
      q: 'A symmetric DC SQUID has two identical junctions of critical current $I_c$ and negligible loop inductance. Its total critical current when the enclosed flux is $\\Phi_0/2$ is',
      options: ['$2I_c$', '$\\sqrt2\\,I_c$', '$I_c$', 'zero'], answer: 3,
      sol: 'The maximum supercurrent is $I_{\\max} = 2I_c|\\cos(\\pi\\Phi/\\Phi_0)|$: the two junction currents interfere like two slits. At $\\Phi = \\Phi_0/2$ the cosine is zero, so the critical current vanishes; at $\\Phi = 0$ it is $2I_c$. $\\sqrt2I_c$ occurs at $\\Phi_0/4$.' },
    ...more2,
  ],
  gens: [
    { id: 'scd-g01', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'critical field',
      make(r) {
        const [el, Tc, B0] = choose(r, [['lead', 7.19, 0.0803], ['tin', 3.72, 0.0305], ['indium', 3.41, 0.0281], ['aluminium', 1.18, 0.0105], ['mercury', 4.15, 0.0411], ['tantalum', 4.47, 0.083]]);
        const askB = r() < 0.6;
        if (askB) {
          const t = choose(r, [0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9]), T = round(t * Tc, 2);
          const B = B0 * (1 - (T / Tc) ** 2) * 1000;
          return { q: `${el[0].toUpperCase() + el.slice(1)} has $T_c = ${Tc}$ K and $B_c(0) = ${B0 * 1000}$ mT. Using $B_c(T) = B_c(0)[1 - (T/T_c)^2]$, the critical field at $${T}$ K is ______ mT (to one decimal place).`,
            answer: round(B, 1), tol: Math.max(0.1, round(B * 0.01, 1)), askB, Tc, B0, T,
            sol: `$(T/T_c)^2 = (${T}/${Tc})^2 = ${round((T / Tc) ** 2, 4)}$. $B_c = ${B0 * 1000}\\times${round(1 - (T / Tc) ** 2, 4)} = ${round(B, 1)}$ mT.` };
        }
        const f = choose(r, [0.2, 0.4, 0.5, 0.6, 0.8]), B = round(f * B0 * 1000, 2), T = Tc * Math.sqrt(1 - B / (B0 * 1000));
        return { q: `${el[0].toUpperCase() + el.slice(1)} ($T_c = ${Tc}$ K, $B_c(0) = ${B0 * 1000}$ mT, parabolic critical-field curve) sits in a field of $${B}$ mT. It stays superconducting up to ______ K (to two decimal places).`,
          answer: round(T, 2), tol: Math.max(0.01, round(T * 0.005, 2)), askB, Tc, B0, B,
          sol: `$B = B_c(0)[1 - (T/T_c)^2]$ gives $T = T_c\\sqrt{1 - B/B_c(0)} = ${Tc}\\sqrt{1 - ${round(B / (B0 * 1000), 4)}} = ${round(T, 2)}$ K.` };
      },
      verify: (p) => (p.askB ? p.B0 * (1 - (p.T / p.Tc) ** 2) * 1000 : p.Tc * Math.sqrt(1 - p.B / (p.B0 * 1000))) },
    { id: 'scd-g02', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'BCS theory',
      make(r) {
        const Tc = choose(r, [0.52, 1.18, 3.41, 3.72, 4.15, 4.47, 7.19, 9.25, 18.3, 39]), want = choose(r, ['meV', 'GHz', 'um']);
        const E = 3.52 * C.kB * Tc;
        const ans = want === 'meV' ? E / C.e * 1000 : want === 'GHz' ? E / C.h / 1e9 : C.h * C.c / E * 1e6;
        const lab = { meV: 'pair-breaking energy $2\\Delta(0)$ is ______ meV', GHz: 'threshold frequency for photon absorption is ______ GHz', um: 'longest wavelength that can break pairs is ______ μm' }[want];
        return { q: `A weak-coupling BCS superconductor has $T_c = ${Tc}$ K. Its ${lab} (to three significant figures).`,
          answer: +ans.toPrecision(3), tol: +(ans * 0.01).toPrecision(2), Tc, want,
          sol: `$2\\Delta = 3.52k_BT_c = ${+(E / C.e * 1000).toPrecision(4)}$ meV${want === 'GHz' ? `, so $f = 2\\Delta/h = ${+ans.toPrecision(3)}$ GHz` : want === 'um' ? `, so $\\lambda = hc/2\\Delta = ${+ans.toPrecision(3)}$ μm` : ''}.` };
      },
      verify: (p) => { const E = 3.52 * C.kB * p.Tc; return p.want === 'meV' ? E / C.e * 1000 : p.want === 'GHz' ? E / C.h / 1e9 : C.h * C.c / E * 1e6; } },
    { id: 'scd-g03', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'London equations',
      make(r) {
        const n = pick(r, 0.2, 9, 0.1), m = choose(r, [1, 1, 2, 3, 5]);
        const lam = Math.sqrt(m * C.me / (C.mu0 * n * 1e28 * C.e ** 2)) * 1e9;
        return { q: `A superconductor has superfluid carrier density $${n}\\times10^{28}$ m$^{-3}$${m > 1 ? ` with effective mass $${m}\\,m_e$` : ' (free-electron mass)'}. Its London penetration depth at $T = 0$ is ______ nm (to one decimal place).`,
          answer: round(lam, 1), tol: Math.max(0.1, round(lam * 0.01, 1)), n, m,
          sol: `$\\lambda_L = \\sqrt{\\dfrac{m^*}{\\mu_0n_se^2}} = 53.14\\text{ nm}\\times\\sqrt{${m}/${n}} = ${round(lam, 1)}$ nm (53.14 nm is the value for $n_s = 10^{28}$ m$^{-3}$ and $m^* = m_e$).` };
      },
      verify: (p) => Math.sqrt(p.m * C.me / (C.mu0 * p.n * 1e28 * C.e ** 2)) * 1e9 },
    { id: 'scd-g04', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'isotope effect',
      make(r) {
        const [el, M1, Tc] = choose(r, [['mercury', 199.5, 4.161], ['tin', 118.7, 3.722], ['lead', 207.2, 7.193], ['thallium', 204.4, 2.38], ['MgB$_2$ (boron)', 10.8, 39.0]]);
        const dM = choose(r, [-3, -2, -1, 1, 2, 3]) * (M1 < 20 ? 0.3 : 1), M2 = round(M1 + dM, 1), al = choose(r, [0.5, 0.5, 0.47, 0.3]);
        const T2 = Tc * (M1 / M2) ** al;
        return { q: `For ${el}, $T_c = ${Tc}$ K with isotope mass $${M1}$. If $T_c \\propto M^{-\\alpha}$ with $\\alpha = ${al}$, a sample with mass $${M2}$ has $T_c =$ ______ K (to three decimal places).`,
          answer: round(T2, 3), tol: Math.max(0.002, round(T2 * 0.0005, 3)), M1, M2, Tc, al,
          sol: `$T_c' = T_c(M/M')^{\\alpha} = ${Tc}\\times(${M1}/${M2})^{${al}} = ${round(T2, 3)}$ K: ${M2 > M1 ? 'heavier isotope, lower' : 'lighter isotope, higher'} $T_c$.` };
      },
      verify: (p) => p.Tc * (p.M1 / p.M2) ** p.al },
    { id: 'scd-g05', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Josephson effect',
      make(r) {
        const kind = choose(r, ['f', 'V', 'step']);
        if (kind === 'f') {
          const V = choose(r, [1, 2, 5, 10, 20, 50, 100, 250]);
          return { q: `A Josephson junction is held at a DC voltage of $${V}$ μV. The supercurrent oscillates at ______ GHz (to three significant figures).`,
            answer: +(KJ * V * 1e-6 / 1e9).toPrecision(3), tol: +(KJ * V * 1e-6 / 1e9 * 0.01).toPrecision(2), kind, V,
            sol: `$f = 2eV/h = 483.6\\text{ GHz/mV}\\times${V / 1000}$ mV $= ${+(KJ * V * 1e-6 / 1e9).toPrecision(3)}$ GHz.` };
        }
        const f = choose(r, [5, 9.4, 10, 18, 24, 35, 70, 94]), n = kind === 'step' ? int(r, 2, 6) : 1;
        const V = n * f * 1e9 / KJ * 1e6;
        return { q: `A Josephson junction is irradiated with $${f}$ GHz microwaves. The ${n === 1 ? 'first' : `$n = ${n}$`} Shapiro step appears at ______ μV (to three significant figures).`,
          answer: +V.toPrecision(3), tol: +(V * 0.01).toPrecision(2), kind, f, n,
          sol: `Steps at $V_n = nhf/2e = ${n}\\times${f}\\times10^9/(483.6\\times10^{12})$ V $= ${+V.toPrecision(3)}$ μV.`,
          trap: 'Using $h/e$ instead of $h/2e$ doubles the voltage.' };
      },
      verify: (p) => (p.kind === 'f' ? KJ * p.V * 1e-6 / 1e9 : p.n * p.f * 1e9 / KJ * 1e6) },
    { id: 'scd-g06', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'type I and type II',
      make(r) {
        const toB = r() < 0.5;
        if (toB) {
          const xi = choose(r, [1.5, 2, 3, 4, 5, 8, 10, 15, 20]);
          const B = PHI0 / (2 * Math.PI * (xi * 1e-9) ** 2);
          return { q: `A type-II superconductor has coherence length $\\xi = ${xi}$ nm. Its upper critical field $B_{c2} = \\Phi_0/2\\pi\\xi^2$ is ______ T (to three significant figures).`,
            answer: +B.toPrecision(3), tol: +(B * 0.01).toPrecision(2), toB, xi,
            sol: `$B_{c2} = 2.068\\times10^{-15}/(2\\pi\\times(${xi}\\times10^{-9})^2) = ${+B.toPrecision(3)}$ T.` };
        }
        const B = choose(r, [0.5, 2, 5, 10, 15, 25, 30, 60, 100]), xi = Math.sqrt(PHI0 / (2 * Math.PI * B)) * 1e9;
        return { q: `A type-II superconductor has upper critical field $B_{c2} = ${B}$ T. Its Ginzburg-Landau coherence length is ______ nm (to two decimal places).`,
          answer: round(xi, 2), tol: Math.max(0.01, round(xi * 0.005, 2)), toB, B,
          sol: `$\\xi = \\sqrt{\\Phi_0/2\\pi B_{c2}} = \\sqrt{2.068\\times10^{-15}/(2\\pi\\times${B})} = ${round(xi, 2)}$ nm.` };
      },
      verify: (p) => (p.toB ? PHI0 / (2 * Math.PI * (p.xi * 1e-9) ** 2) : Math.sqrt(PHI0 / (2 * Math.PI * p.B)) * 1e9) },
    { id: 'scd-g07', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'thermodynamics',
      make(r) {
        const B = pick(r, 0.01, 0.2, 0.005), Vm = choose(r, [null, 10.0, 16.3, 18.3]);
        const E = B * B / (2 * C.mu0);
        const ans = Vm ? E * Vm * 1e-6 * 1000 : E;
        return { q: Vm ? `A superconductor with molar volume $${Vm}$ cm$^3$/mol has thermodynamic critical field $${round(B * 1000, 1)}$ mT at $T = 0$. Its condensation energy is ______ mJ/mol (to three significant figures).` : `A superconductor has thermodynamic critical field $B_c = ${round(B * 1000, 1)}$ mT. Its condensation energy density is ______ J/m$^3$ (to three significant figures).`,
          answer: +ans.toPrecision(3), tol: +(ans * 0.01).toPrecision(2), B, Vm,
          sol: `$g_n - g_s = B_c^2/2\\mu_0 = (${round(B, 4)})^2/(2\\times1.257\\times10^{-6}) = ${+E.toPrecision(4)}$ J/m$^3$${Vm ? `; times $${Vm}\\times10^{-6}$ m$^3$/mol gives $${+ans.toPrecision(3)}$ mJ/mol` : ''}.` };
      },
      verify: (p) => { const E = p.B * p.B / (2 * C.mu0); return p.Vm ? E * p.Vm * 1e-6 * 1000 : E; } },
    { id: 'scd-g08', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'London equations',
      make(r) {
        const lam = choose(r, [20, 40, 50, 80, 100, 150]), kind = choose(r, ['bulk', 'slab']);
        if (kind === 'bulk') {
          const x = choose(r, [10, 25, 50, 100, 150, 200]), f = Math.exp(-x / lam);
          return { q: `A field $B_0$ is applied parallel to the surface of a thick superconductor with $\\lambda = ${lam}$ nm. At a depth of $${x}$ nm the field is ______ $B_0$ (to three decimal places).`,
            answer: round(f, 3), tol: Math.max(0.001, round(f * 0.01, 3)), kind, lam, x,
            sol: `$B = B_0e^{-x/\\lambda} = B_0e^{-${round(x / lam, 3)}} = ${round(f, 3)}B_0$.` };
        }
        const d = choose(r, [50, 100, 200, 300, 400]), f = 1 / Math.cosh(d / (2 * lam));
        return { q: `A superconducting slab of thickness $${d}$ nm ($\\lambda = ${lam}$ nm) is in a field $B_0$ parallel to both faces. At the mid-plane the field is ______ $B_0$ (to three decimal places).`,
          answer: round(f, 3), tol: Math.max(0.001, round(f * 0.01, 3)), kind, lam, d,
          sol: `Solving $B'' = B/\\lambda^2$ with $B = B_0$ on both faces: $B(x) = B_0\\cosh(x/\\lambda)/\\cosh(d/2\\lambda)$ from the centre. At $x = 0$: $1/\\cosh(${round(d / (2 * lam), 3)}) = ${round(f, 3)}$.`,
          trap: 'Using $e^{-d/2\\lambda}$, which ignores the field entering from the other face.' };
      },
      verify: (p) => (p.kind === 'bulk' ? Math.exp(-p.x / p.lam) : 1 / Math.cosh(p.d / (2 * p.lam))) },
    { id: 'scd-g09', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'critical current',
      make(r) {
        const a = choose(r, [0.1, 0.25, 0.5, 1, 1.5, 2]), B0 = choose(r, [0.0305, 0.0411, 0.0803, 0.0281]), Tc = { 0.0305: 3.72, 0.0411: 4.15, 0.0803: 7.19, 0.0281: 3.41 }[B0];
        const t = choose(r, [0, 0.3, 0.5, 0.7]), Bc = B0 * (1 - t * t), I = 2 * Math.PI * a * 1e-3 * Bc / C.mu0;
        return { q: `A type-I wire of radius $${a}$ mm has $T_c = ${Tc}$ K and $B_c(0) = ${B0 * 1000}$ mT (parabolic curve). At $T = ${round(t * Tc, 3)}$ K, Silsbee's rule gives a critical current of ______ A (to three significant figures).`,
          answer: +I.toPrecision(3), tol: +(I * 0.01).toPrecision(2), a, Bc,
          sol: `$B_c(T) = ${B0 * 1000}\\times(1 - ${round(t * t, 3)}) = ${round(Bc * 1000, 2)}$ mT. $I_c = 2\\pi aB_c/\\mu_0 = 2\\pi\\times${a}\\times10^{-3}\\times${round(Bc, 5)}/1.257\\times10^{-6} = ${+I.toPrecision(3)}$ A.` };
      },
      verify: (p) => 2 * Math.PI * p.a * 1e-3 * p.Bc / C.mu0 },
    { id: 'scd-g10', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'vortices',
      make(r) {
        const kind = choose(r, ['ring', 'tri', 'dens']);
        if (kind === 'ring') {
          const R = choose(r, [2, 5, 10, 20, 50]), B = choose(r, [0.01, 0.02, 0.05, 0.1, 0.2]);
          const N = Math.PI * (R * 1e-6) ** 2 * B * 1e-3 / PHI0;
          return { q: `A thick superconducting ring of radius $${R}$ μm is cooled in a perpendicular field of $${B}$ mT, which is then removed. The number of trapped flux quanta is ______.`,
            answer: Math.round(N), tol: 0, kind, R, B,
            sol: `$\\Phi = \\pi R^2B = ${+(Math.PI * (R * 1e-6) ** 2 * B * 1e-3).toPrecision(4)}$ Wb $= ${round(N, 2)}\\,\\Phi_0$; the fluxoid is quantised, so the nearest integer, $${Math.round(N)}$, is trapped.` };
        }
        const B = choose(r, [0.05, 0.1, 0.2, 0.5, 1, 2, 5]);
        if (kind === 'tri') {
          const a = Math.sqrt(2 * PHI0 / (Math.sqrt(3) * B)) * 1e9;
          return { q: `A type-II superconductor holds an average field of $${B}$ T in a triangular vortex lattice. The nearest-neighbour vortex spacing is ______ nm (to three significant figures).`,
            answer: +a.toPrecision(3), tol: +(a * 0.01).toPrecision(2), kind, B,
            sol: `Area per vortex $\\Phi_0/B = \\tfrac{\\sqrt3}{2}a^2$, so $a = \\sqrt{2\\Phi_0/\\sqrt3B} = ${+a.toPrecision(3)}$ nm.` };
        }
        const n = B / PHI0 / 1e14;
        return { q: `A type-II superconductor carries an average field of $${B}$ T in the mixed state. The number of vortices per square micrometre is ______ (to three significant figures).`,
          answer: +(n * 1e2).toPrecision(3), tol: +(n * 1e2 * 0.01).toPrecision(2), kind, B,
          sol: `Each vortex carries $\\Phi_0 = 2.068\\times10^{-15}$ Wb, so $n = B/\\Phi_0 = ${+(n).toPrecision(4)}\\times10^{14}$ m$^{-2} = ${+(n * 1e2).toPrecision(3)}$ μm$^{-2}$.` };
      },
      verify: (p) => (p.kind === 'ring' ? Math.round(Math.PI * (p.R * 1e-6) ** 2 * p.B * 1e-3 / PHI0) : p.kind === 'tri' ? Math.sqrt(2 * PHI0 / (Math.sqrt(3) * p.B)) * 1e9 : p.B / PHI0 / 1e12) },
    { id: 'scd-g11', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'type I and type II',
      make(r) {
        const lam = choose(r, [16, 30, 40, 50, 85, 150, 200]), xi = choose(r, [2, 6, 40, 80, 230, 1600]);
        const k = lam / xi, II = k > 1 / Math.SQRT2;
        const correct = II ? `type II, since $\\kappa = ${+k.toPrecision(3)} > 1/\\sqrt2$` : `type I, since $\\kappa = ${+k.toPrecision(3)} < 1/\\sqrt2$`;
        const wrongs = [II ? `type I, since $\\kappa = ${+k.toPrecision(3)}$ is large` : `type II, since $\\xi > \\lambda$`, II ? `type I, since $\\xi/\\lambda = ${+(1 / k).toPrecision(3)} < 1/\\sqrt2$` : `type II, since $\\xi/\\lambda = ${+(1 / k).toPrecision(3)} > 1/\\sqrt2$`, 'neither: the type depends only on $T_c$'];
        const { options, answer } = mcqOptions(r, correct, wrongs, (v) => v);
        return { q: `A superconductor has penetration depth $${lam}$ nm and coherence length $${xi}$ nm. It is`, options, answer, k,
          sol: `$\\kappa = \\lambda/\\xi = ${lam}/${xi} = ${+k.toPrecision(3)}$, compared with $1/\\sqrt2 = 0.707$: ${II ? 'larger, so the normal-superconducting wall energy is negative and the material is type II' : 'smaller, so the wall energy is positive and the material is type I'}.` };
      } },
    { id: 'scd-g12', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'two-fluid model',
      make(r) {
        const l0 = choose(r, [16, 39, 50, 80, 140]), t = choose(r, [0.3, 0.5, 0.6, 0.7, 0.8, 0.9, 0.95]), kind = choose(r, ['lam', 'ns']);
        const f = 1 - t ** 4, lam = l0 / Math.sqrt(f);
        return { q: kind === 'lam' ? `A superconductor has $\\lambda(0) = ${l0}$ nm. In the two-fluid (Gorter-Casimir) model, at $T = ${t}\\,T_c$ its penetration depth is ______ nm (to one decimal place).` : `In the Gorter-Casimir two-fluid model, the fraction of conduction electrons in the superfluid at $T = ${t}\\,T_c$ is ______ (to three decimal places).`,
          answer: kind === 'lam' ? round(lam, 1) : round(f, 3), tol: kind === 'lam' ? Math.max(0.1, round(lam * 0.01, 1)) : Math.max(0.001, round(f * 0.005, 3)), l0, t, kind,
          sol: `Two-fluid model: $n_s/n = 1 - (T/T_c)^4 = 1 - ${t}^4 = ${round(f, 4)}$.${kind === 'lam' ? ` Since $\\lambda \\propto n_s^{-1/2}$, $\\lambda = ${l0}/\\sqrt{${round(f, 4)}} = ${round(lam, 1)}$ nm.` : ''}`,
          trap: kind === 'lam' ? 'Using $(T/T_c)^2$ instead of the fourth power.' : 'Using $1 - T/T_c$.' };
      },
      verify: (p) => (p.kind === 'lam' ? p.l0 / Math.sqrt(1 - p.t ** 4) : 1 - p.t ** 4) },
    ...more,
  ],
};
