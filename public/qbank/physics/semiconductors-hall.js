// Semiconductors and the Hall effect at MSc level: effective densities of states and DOS masses, the intrinsic
// level, compensated freeze-out, the Mott transition, mobility and Matthiessen's rule, the Hall factor, two-carrier
// Hall coefficient and its sign change, magnetoresistance, cyclotron resonance, Landau levels, Shubnikov-de Haas
// oscillations and the integer quantum Hall effect. (Doping, mass action, single-carrier Hall basics: JAM topic
// semiconductors.) Original questions for GATE and CSIR NET practice (fibub). Levels: 1 warm-up ... 5 top rank.
import { int, pick, choose, round, mcqOptions, C } from '../_util.js';
import more from './semiconductors-hall.more.gen.js';
import more2 from './semiconductors-hall.more2.gen.js';
import r4 from './semiconductors-hall.r4.gen.js';

const RK = C.h / C.e ** 2; // von Klitzing constant, ohm
const kBe = C.kB / C.e;
const Nc = (m, T) => 2 * (m * C.me * C.kB * T / (2 * Math.PI * C.hbar ** 2)) ** 1.5; // m^-3
const RH2 = (n, p, me, mh) => (p * mh * mh - n * me * me) / (C.e * (p * mh + n * me) ** 2);

export default {
  topic: 'semiconductors-hall',
  items: [
    // ---------- level 1 ----------
    { id: 'shl-001', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'quantum Hall effect',
      q: 'On the plateau with integer filling factor $\\nu$ of the integer quantum Hall effect, the Hall resistance $R_{xy}$ equals',
      options: ['$\\dfrac{\\nu h}{e^2}$', '$\\dfrac{h}{\\nu e^2}$', '$\\dfrac{h}{2\\nu e}$', '$\\dfrac{\\nu e^2}{h}$'], answer: 1,
      sol: 'With $\\nu$ Landau levels exactly full, $n_s = \\nu eB/h$, and the classical $R_{xy} = B/n_se$ becomes $h/\\nu e^2$. It stays fixed over a range of $B$ (the plateau) because states between the levels are localised. $\\nu e^2/h$ is the Hall conductance.',
      trap: '$\\nu e^2/h$ is the conductance, the inverse.' },
    { id: 'shl-002', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'quantum Hall effect',
      q: 'The von Klitzing constant $R_K = h/e^2$ is about',
      options: ['$25.8$ k$\\Omega$', '$12.9$ k$\\Omega$', '$377$ $\\Omega$', '$4.11$ k$\\Omega$'], answer: 0,
      sol: '$h/e^2 = 6.626\\times10^{-34}/(1.602\\times10^{-19})^2 = 25\\,813$ $\\Omega$. Its half, $12.9$ k$\\Omega$, is the $\\nu = 2$ plateau; $377$ $\\Omega$ is the impedance of free space ($= 2\\alpha R_K$).' },
    { id: 'shl-003', type: 'nat', level: 1, exams: ['gate', 'net'], sub: 'Landau levels',
      q: 'A two-dimensional electron gas has sheet density $2.42\\times10^{15}$ m$^{-2}$ in a field of $5.0$ T. Its Landau-level filling factor $\\nu = n_sh/eB$ is ______ (to two decimal places).',
      answer: 2.00, tol: 0.02, calc: () => 2.42e15 * C.h / (C.e * 5),
      sol: 'Each Landau level holds $eB/h$ states per unit area (per spin). $eB/h = 1.602\\times10^{-19}\\times5.0/6.626\\times10^{-34} = 1.209\\times10^{15}$ m$^{-2}$. $\\nu = 2.42\\times10^{15}/1.209\\times10^{15} = 2.00$: the lowest Landau level is full for both spins.' },
    { id: 'shl-004', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'cyclotron resonance',
      q: 'In a cyclotron resonance experiment on a semiconductor, the microwave frequency $\\omega$ at resonance in a field $B$ directly gives',
      options: ['the carrier density, $n = \\omega/eB$', 'the effective mass, $m^* = eB/\\omega$', 'the relaxation time, $\\tau = 1/\\omega$', 'the band gap, $E_g = \\hbar\\omega$'], answer: 1,
      sol: 'Carriers circle at $\\omega_c = eB/m^*$, and power is absorbed when $\\omega = \\omega_c$. So $m^* = eB/\\omega$, independent of density and scattering, provided $\\omega_c\\tau > 1$ so that the orbit completes.' },
    { id: 'shl-005', type: 'msq', level: 1, exams: ['gate', 'net'], sub: 'effective density of states',
      q: 'The effective density of states of the conduction band is $N_c = 2\\left(\\dfrac{m_d^*k_BT}{2\\pi\\hbar^2}\\right)^{3/2}$. Which statements are correct?',
      options: ['$N_c$ is the actual number of states per unit volume in the conduction band.', '$N_c \\propto T^{3/2}$.', 'A heavier density-of-states mass gives a larger $N_c$.', 'In a non-degenerate semiconductor $n = N_ce^{-(E_c - E_F)/k_BT}$.'], answer: [1, 2, 3],
      sol: 'Integrating $g(E)e^{-(E - E_F)/k_BT}$ over the band gives $n = N_ce^{-(E_c - E_F)/k_BT}$: $N_c$ is the number of states one would need at the band edge to give the same $n$, an effective number. It grows as $(m_d^*T)^{3/2}$. The real band has far more states.' },
    { id: 'shl-006', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'two-carrier Hall effect',
      q: 'An intrinsic semiconductor ($n = p$) has electron mobility larger than hole mobility. Its Hall coefficient is',
      options: ['positive', 'zero, because $n = p$', 'negative', 'positive or negative depending on the field direction'], answer: 2,
      sol: 'For two carriers $R_H = \\dfrac{p\\mu_h^2 - n\\mu_e^2}{e(p\\mu_h + n\\mu_e)^2}$. With $n = p$ the numerator is $n(\\mu_h^2 - \\mu_e^2) < 0$. The faster carriers are deflected more strongly, so they win.',
      trap: 'Equal numbers do not cancel: each carrier enters weighted by the square of its mobility.' },

    // ---------- level 2 ----------
    { id: 'shl-007', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'cyclotron resonance',
      q: 'Cyclotron resonance at $24$ GHz is observed for electrons in a field of $0.30$ T. Their effective mass is ______ $m_e$ (to three decimal places).',
      answer: 0.350, tol: 0.003, calc: () => C.e * 0.3 / (2 * Math.PI * 24e9 * C.me),
      sol: '$\\dfrac{m^*}{m_e} = \\dfrac{eB}{2\\pi fm_e} = \\dfrac{1.602\\times10^{-19}\\times0.30}{2\\pi\\times24\\times10^9\\times9.109\\times10^{-31}} = \\dfrac{4.81\\times10^{-20}}{1.374\\times10^{-19}} = 0.350$.',
      trap: 'Forgetting the $2\\pi$ between $f$ and $\\omega$.' },
    { id: 'shl-008', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Hall effect in 2D',
      q: 'A current of $1.0$ μA flows along a two-dimensional electron gas of sheet density $5.0\\times10^{15}$ m$^{-2}$ in a perpendicular field of $1.0$ T. The Hall voltage is ______ mV (to two decimal places).',
      answer: 1.25, tol: 0.01, calc: () => 1e-6 * 1 / (5e15 * C.e) * 1e3,
      sol: 'In 2D the thickness drops out: $V_H = \\dfrac{IB}{n_se} = \\dfrac{10^{-6}\\times1.0}{5.0\\times10^{15}\\times1.602\\times10^{-19}} = 1.25\\times10^{-3}$ V. The Hall resistance $V_H/I = 1.25$ k$\\Omega$ is independent of the sample\'s width and length.' },
    { id: 'shl-009', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'effective density of states',
      q: 'If the temperature of a semiconductor is raised from $150$ K to $600$ K, its effective conduction-band density of states $N_c$ increases by a factor of',
      options: ['4', '16', '2', '8'], answer: 3,
      sol: '$N_c \\propto T^{3/2}$, and $(600/150)^{3/2} = 4^{3/2} = 8$.' },
    { id: 'shl-010', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'effective density of states',
      q: 'Silicon\'s conduction band has density-of-states mass $1.08\\,m_e$. At $77$ K its effective density of states $N_c$ is ______ $\\times10^{18}$ cm$^{-3}$ (to two decimal places).',
      answer: 3.66, tol: 0.04, calc: () => Nc(1.08, 77) / 1e6 / 1e18,
      sol: '$N_c = 2\\left(\\dfrac{m^*k_BT}{2\\pi\\hbar^2}\\right)^{3/2}$. For $m^* = m_e$ at $300$ K this is $2.51\\times10^{19}$ cm$^{-3}$. Scale: $\\times1.08^{3/2} = 1.122$ and $\\times(77/300)^{3/2} = 0.130$: $N_c = 2.51\\times10^{19}\\times1.122\\times0.130 = 3.66\\times10^{18}$ cm$^{-3}$.' },
    { id: 'shl-011', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'intrinsic level',
      q: 'The intrinsic Fermi level of a semiconductor with density-of-states masses $m_e^*$ and $m_h^*$ lies at',
      options: ['$E_i = \\dfrac{E_c + E_v}{2} + \\dfrac34k_BT\\ln\\dfrac{m_h^*}{m_e^*}$', '$E_i = \\dfrac{E_c + E_v}{2} + \\dfrac32k_BT\\ln\\dfrac{m_h^*}{m_e^*}$', '$E_i = \\dfrac{E_c + E_v}{2} + \\dfrac34k_BT\\ln\\dfrac{m_e^*}{m_h^*}$', '$E_i = \\dfrac{E_c + E_v}{2}$ exactly at every temperature'], answer: 0,
      sol: 'Set $N_ce^{-(E_c - E_i)/k_BT} = N_ve^{-(E_i - E_v)/k_BT}$: $E_i = \\dfrac{E_c + E_v}{2} + \\dfrac{k_BT}{2}\\ln\\dfrac{N_v}{N_c}$, and $N_v/N_c = (m_h^*/m_e^*)^{3/2}$, giving the factor $\\tfrac34$. Heavier holes push $E_i$ up towards the conduction band.' },
    { id: 'shl-012', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'quantum Hall effect',
      q: 'Which statements about the integer quantum Hall effect in a 2D electron gas are correct?',
      options: ['The plateaus have finite width only because disorder localises the states between Landau levels.', 'Plateaus are best seen in perfectly clean samples, where they become wider.', 'On a plateau the longitudinal resistance $R_{xx}$ drops to zero.', 'The plateau value $h/\\nu e^2$ does not depend on the sample\'s size, shape or impurity content.'], answer: [0, 2, 3],
      sol: 'When $E_F$ lies among localised states between Landau levels, nothing can scatter and $R_{xx} \\to 0$, while $R_{xy}$ is pinned at $h/\\nu e^2$ to parts in $10^{10}$, whatever the sample details. In a perfectly clean sample there are no localised states, $E_F$ jumps from one level to the next and the plateaus shrink to points.' },
    { id: 'shl-013', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'mobility',
      q: 'In a semiconductor, lattice scattering alone would give a mobility of $1500$ cm$^2$/V s and impurity scattering alone $3000$ cm$^2$/V s. By Matthiessen\'s rule the actual mobility is',
      options: ['$4500$ cm$^2$/V s', '$2250$ cm$^2$/V s', '$1500$ cm$^2$/V s', '$1000$ cm$^2$/V s'], answer: 3,
      sol: 'Scattering rates add: $1/\\tau = 1/\\tau_L + 1/\\tau_I$, so $1/\\mu = 1/1500 + 1/3000 = 3/3000$, giving $\\mu = 1000$ cm$^2$/V s. The total is always below the smaller of the two.' },
    { id: 'shl-014', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'mobility',
      q: 'In a non-degenerate semiconductor, the mobility limited by acoustic-phonon (lattice) scattering varies with temperature as',
      options: ['$T^{3/2}$', '$T^{-1/2}$', '$T^{-3/2}$', '$T^{1/2}$'], answer: 2,
      sol: 'The phonon population grows as $T$ and the carriers\' thermal speed as $T^{1/2}$, so $1/\\tau \\propto T\\cdot T^{1/2}$ and $\\mu \\propto T^{-3/2}$. Ionised-impurity scattering is the opposite, $\\mu \\propto T^{3/2}$: fast carriers are deflected less. Together they give a mobility peak at intermediate temperature.',
      trap: '$T^{3/2}$ is the ionised-impurity law.' },
    { id: 'shl-015', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'Hall factor',
      q: 'For a non-degenerate n-type semiconductor with acoustic-phonon scattering ($\\tau \\propto E^{-1/2}$), the Hall coefficient is $R_H = -r_H/ne$ with Hall factor',
      options: ['$r_H = 1$', '$r_H = 3\\pi/8 \\approx 1.18$', '$r_H = 8/3\\pi \\approx 0.85$', '$r_H = 315\\pi/512 \\approx 1.93$'], answer: 1,
      sol: '$r_H = \\langle\\tau^2\\rangle/\\langle\\tau\\rangle^2$ averaged over the Maxwell-Boltzmann distribution. For $\\tau \\propto E^{-1/2}$ this is $3\\pi/8$. It is 1 for energy-independent $\\tau$ and for degenerate metals, and $315\\pi/512$ for ionised-impurity scattering ($\\tau \\propto E^{3/2}$).' },
    { id: 'shl-016', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Landau levels',
      q: 'For electrons in GaAs ($m^* = 0.067\\,m_e$) in a field of $10$ T, the Landau-level spacing $\\hbar\\omega_c$ is ______ meV (to one decimal place).',
      answer: 17.3, tol: 0.2, calc: () => C.hbar * C.e * 10 / (0.067 * C.me) / C.e * 1000,
      sol: 'For free electrons $\\hbar eB/m_e = 0.1158$ meV per tesla, i.e. $1.158$ meV at $10$ T. Dividing by $0.067$: $\\hbar\\omega_c = 17.3$ meV, about $200$ K in temperature units, so the levels are well resolved at liquid-helium temperature.' },
    { id: 'shl-041', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'cyclotron resonance',
      q: 'Which statements about cyclotron resonance in semiconductors are correct?',
      options: ['Experiments are done at low temperature partly to increase $\\tau$.', 'The sense of rotation (circular polarisation absorbed) tells electrons from holes.', 'The resonant frequency is independent of the effective mass.', 'A sharp resonance requires $\\omega_c\\tau \\gg 1$, i.e. $\\mu B \\gg 1$.'], answer: [0, 1, 3],
      sol: '$\\omega_c\\tau = (eB/m^*)(m^*\\mu/e) = \\mu B$; the carrier must complete about a radian before scattering. Cooling suppresses phonon scattering and freezes out carriers that would screen. Electrons and holes circle in opposite senses, so they absorb opposite circular polarisations. $\\omega_c = eB/m^*$ depends directly on $m^*$: that is the point of the experiment.' },

    // ---------- level 3 ----------
    { id: 'shl-017', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'two-carrier Hall effect',
      q: 'An intrinsic semiconductor has $n = p = 1.0\\times10^{19}$ m$^{-3}$ and mobility ratio $\\mu_e/\\mu_h = 3$. Its Hall coefficient is ______ m$^3$/C (to three decimal places, with sign).',
      answer: -0.312, tol: 0.003, calc: () => -0.5 / (C.e * 1e19),
      sol: 'With $b = \\mu_e/\\mu_h$ and $n = p = n_i$: $R_H = \\dfrac{n_i\\mu_h^2(1 - b^2)}{en_i^2\\mu_h^2(1 + b)^2} = \\dfrac{1 - b}{(1 + b)en_i} = \\dfrac{-2}{4en_i} = -\\dfrac{0.5}{1.602\\times10^{-19}\\times10^{19}} = -0.312$ m$^3$/C.' },
    { id: 'shl-018', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'two-carrier Hall effect',
      q: 'A p-type sample of a semiconductor with $\\mu_e > \\mu_h$ is heated from low temperature into the intrinsic range. Its Hall coefficient',
      options: ['stays positive and grows', 'starts positive, passes through zero and becomes negative', 'starts negative and becomes positive', 'stays negative throughout'], answer: 1,
      sol: 'At low $T$ holes from acceptors dominate: $R_H \\approx +1/pe$. As $T$ rises, intrinsic pairs add equal numbers of electrons and holes, but electrons count with $\\mu_e^2$. When $p = b^2n$ the numerator $p\\mu_h^2 - n\\mu_e^2$ vanishes, and above that $R_H < 0$. This sign reversal is the fingerprint of p-type material with $b > 1$ (seen in InSb and Ge).' },
    { id: 'shl-019', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'two-carrier Hall effect',
      q: 'A p-type semiconductor with acceptor density $N_a$ (all ionised, no donors) has $\\mu_e/\\mu_h = 3$. At the temperature where its Hall coefficient is zero, the ratio $n_i/N_a$ is ______ (to three decimal places).',
      answer: 0.375, tol: 0.002, calc: () => { const b = 3, n = 1 / (b * b - 1), p = b * b * n; return Math.sqrt(n * p); },
      sol: '$R_H = 0$ needs $p = b^2n = 9n$. Neutrality: $p - n = N_a$, so $8n = N_a$, $n = N_a/8$, $p = 9N_a/8$. Mass action: $n_i^2 = np = 9N_a^2/64$, giving $n_i/N_a = 3/8 = 0.375$.' },
    { id: 'shl-020', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'magnetoresistance',
      q: 'Which statements about transverse magnetoresistance in the relaxation-time model are correct?',
      options: ['With electrons and holes both present, the resistance rises with $B$.', 'A compensated material ($n = p$) shows magnetoresistance that keeps growing as $B^2$ without saturating.', 'With two carrier types, the Hall coefficient generally depends on $B$.', 'A single carrier type with an energy-independent $\\tau$ shows a large magnetoresistance.'], answer: [0, 1, 2],
      sol: 'One carrier type: the Hall field exactly cancels the Lorentz force, the carriers move straight and $\\rho_{xx}$ is unchanged. Two types: one Hall field cannot balance both, they drift sideways, and $\\rho_{xx}$ grows. For $n = p$ the Hall field vanishes and $\\Delta\\rho/\\rho_0 = \\mu_e\\mu_hB^2$ forever. In general $R_H$ moves from its weak-field to its strong-field value $1/e(p - n)$.' },
    { id: 'shl-021', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Hall factor',
      q: 'The Hall mobility $\\mu_H = |R_H|\\sigma$ of electrons in a non-degenerate sample dominated by acoustic-phonon scattering is $1400$ cm$^2$/V s. Their drift mobility is ______ cm$^2$/V s (to the nearest whole number).',
      answer: 1188, tol: 6, calc: () => 1400 / (3 * Math.PI / 8),
      sol: '$R_H = -r_H/ne$ and $\\sigma = ne\\mu$, so $\\mu_H = r_H\\mu$. With $r_H = 3\\pi/8 = 1.178$: $\\mu = 1400/1.178 = 1188$ cm$^2$/V s. Treating Hall mobility as drift mobility overestimates it by 18%.' },
    { id: 'shl-022', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Shubnikov-de Haas',
      q: 'Shubnikov-de Haas oscillations of the resistance of a 2D electron gas are periodic in',
      options: ['$1/B$, with period $\\Delta(1/B) = 2e/hn_s$ for spin-degenerate levels', '$B$, with period $hn_s/2e$', '$B^2$', '$1/B^2$'], answer: 0,
      sol: 'A resistance minimum occurs each time an integer number $j$ of spin-degenerate Landau levels is full: $n_s = j\\cdot2eB_j/h$, so $1/B_j = 2ej/hn_s$. Successive minima are equally spaced in $1/B$ by $2e/hn_s$; measuring the spacing gives $n_s$ (or in 3D the extremal Fermi-surface area).' },
    { id: 'shl-023', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Shubnikov-de Haas',
      q: 'Shubnikov-de Haas minima of a spin-degenerate 2D electron gas are spaced by $0.050$ T$^{-1}$ in $1/B$. Its sheet density is ______ $\\times10^{15}$ m$^{-2}$ (to two decimal places).',
      answer: 9.67, tol: 0.08, calc: () => 2 * C.e / (C.h * 0.05) / 1e15,
      sol: '$n_s = \\dfrac{2e}{h\\,\\Delta(1/B)} = \\dfrac{2\\times1.602\\times10^{-19}}{6.626\\times10^{-34}\\times0.050} = 9.67\\times10^{15}$ m$^{-2}$.',
      trap: 'Leaving out the spin factor 2 halves the density.' },
    { id: 'shl-024', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'freeze-out',
      q: 'An n-type semiconductor has donors $N_d$ (ionisation energy $E_d$) and a smaller density of compensating acceptors $N_a$. At temperatures so low that $n \\ll N_a$, the electron density varies as',
      options: ['$e^{-E_g/2k_BT}$', '$e^{-E_d/2k_BT}$', '$e^{-E_d/k_BT}$', '$e^{-E_g/k_BT}$'], answer: 2,
      sol: 'The acceptors permanently take $N_a$ electrons, leaving $N_a$ empty donors. Then $n(N_a + n)/(N_d - N_a - n) = \\tfrac12N_ce^{-E_d/k_BT}$ (with spin factor) gives $n \\approx \\dfrac{N_d - N_a}{2N_a}N_ce^{-E_d/k_BT}$: the full $E_d$ in the exponent, because $E_F$ is pinned at the donor level. Without compensation $n \\propto e^{-E_d/2k_BT}$.',
      trap: '$E_d/2$ is the uncompensated result; a little compensation doubles the slope of $\\ln n$ against $1/T$.' },
    { id: 'shl-025', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'intrinsic level',
      q: 'Silicon has density-of-states masses $m_e^* = 1.08\\,m_e$ and $m_h^* = 0.56\\,m_e$. At $300$ K its intrinsic Fermi level lies ______ meV from mid-gap (positive if above, to one decimal place). Take $k_BT = 25.85$ meV.',
      answer: -12.7, tol: 0.2, calc: () => 0.75 * kBe * 300 * Math.log(0.56 / 1.08) * 1000,
      sol: '$E_i - E_{\\rm mid} = \\tfrac34k_BT\\ln(m_h^*/m_e^*) = 0.75\\times25.85\\times\\ln(0.5185) = 19.39\\times(-0.657) = -12.7$ meV. The electrons have more effective states, so $E_i$ sits slightly below mid-gap.' },
    { id: 'shl-026', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'quantum Hall effect',
      q: 'On an integer quantum Hall plateau, which statements are correct?',
      options: ['Since $\\rho_{xx} = 0$, $\\sigma_{xx}$ must be infinite.', 'Both $\\rho_{xx}$ and $\\sigma_{xx}$ are zero.', '$\\sigma_{xy} = \\nu e^2/h$.', 'On the $\\nu = 2$ plateau $R_{xy} \\approx 12.9$ k$\\Omega$.'], answer: [1, 2, 3],
      sol: 'Inverting the resistivity tensor, $\\sigma_{xx} = \\dfrac{\\rho_{xx}}{\\rho_{xx}^2 + \\rho_{xy}^2}$. With $\\rho_{xy} \\ne 0$, $\\rho_{xx} = 0$ gives $\\sigma_{xx} = 0$ too: a perfect insulator and a perfect conductor at once, along different directions. $\\sigma_{xy} = 1/\\rho_{xy} = \\nu e^2/h$, and $R_K/2 = 12.9$ k$\\Omega$.',
      trap: 'Inverting component by component works only for a diagonal tensor.' },
    { id: 'shl-027', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Hall angle',
      q: 'Electrons of mobility $0.80$ m$^2$/V s (single carrier type, constant $\\tau$) carry current in a perpendicular field of $0.50$ T. The angle between the electric field and the current is about',
      options: ['$11.3°$', '$21.8°$', '$38.7°$', '$43.6°$'], answer: 1,
      sol: '$\\tan\\theta_H = E_y/E_x = \\omega_c\\tau = \\mu B = 0.80\\times0.50 = 0.40$, so $\\theta_H = 21.8°$. High-mobility materials such as InSb give large Hall angles at modest fields, which is why they make good Hall sensors.' },
    { id: 'shl-028', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'cyclotron resonance',
      q: 'To see a cyclotron resonance in a sample with carrier mobility $2000$ cm$^2$/V s, the magnetic field should be at least about',
      options: ['$0.05$ T', '$0.5$ T', '$50$ T', '$5$ T'], answer: 3,
      sol: 'The condition $\\omega_c\\tau > 1$ is $\\mu B > 1$. With $\\mu = 0.20$ m$^2$/V s, $B > 5$ T. Pure samples at low temperature have mobilities 10 to 100 times higher, allowing fields below 1 T.',
      trap: 'Forgetting that $2000$ cm$^2$/V s is $0.20$ m$^2$/V s.' },
    { id: 'shl-042', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'Hall measurements',
      q: 'In a Hall-bar measurement on a thin single-carrier semiconductor film, which statements are correct?',
      options: ['The Hall voltage is much larger in a semiconductor than in a metal for the same current, field and thickness.', 'The Hall coefficient depends on the length of the bar.', 'For fixed current and field, the Hall voltage is inversely proportional to the film thickness.', 'An offset from misaligned Hall contacts can be removed by averaging readings taken with $+B$ and $-B$.'], answer: [0, 2, 3],
      sol: '$V_H = IB/(net)$. The misalignment offset is an ohmic drop that does not change sign with $B$, while $V_H$ does. Semiconductor densities are $10^{6}$ to $10^{10}$ times smaller than metallic ones, so $V_H$ is that much larger. $R_H = 1/ne$ is a material property, independent of the bar\'s length.' },

    // ---------- level 4 ----------
    { id: 'shl-029', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'Mott transition',
      q: 'Donors in germanium ($\\varepsilon_r = 16$, $m^* = 0.12\\,m_e$) are hydrogen-like. Using the Mott criterion $n_c^{1/3}a^* = 0.26$, the critical donor density for the metal-insulator transition is ______ $\\times10^{16}$ cm$^{-3}$ (to two decimal places). Take $a_0 = 0.0529$ nm.',
      answer: 5.00, tol: 0.06, calc: () => (0.26 / (C.a0 * 1e9 * 16 / 0.12)) ** 3 * 1e21 / 1e16,
      sol: 'Effective Bohr radius $a^* = a_0\\varepsilon_r(m_e/m^*) = 0.0529\\times16/0.12 = 7.06$ nm. $n_c = (0.26/7.06)^3 = (0.0368)^3 = 5.00\\times10^{-5}$ nm$^{-3} = 5.00\\times10^{16}$ cm$^{-3}$. Above this, donor orbits overlap and the electrons no longer freeze out: the doped semiconductor conducts at $T = 0$.' },
    { id: 'shl-030', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'two-carrier Hall effect',
      q: 'A sample has $n = 1.0\\times10^{21}$ m$^{-3}$ electrons with $\\mu_e = 0.40$ m$^2$/V s and $p = 4.0\\times10^{21}$ m$^{-3}$ holes with $\\mu_h = 0.10$ m$^2$/V s. Its weak-field Hall coefficient is ______ $\\times10^{-3}$ m$^3$/C (to two decimal places, with sign).',
      answer: -1.17, tol: 0.02, calc: () => RH2(1e21, 4e21, 0.4, 0.1) * 1e3,
      sol: 'Numerator: $p\\mu_h^2 - n\\mu_e^2 = 4\\times10^{21}\\times0.01 - 10^{21}\\times0.16 = -1.2\\times10^{20}$. Denominator: $e(p\\mu_h + n\\mu_e)^2 = 1.602\\times10^{-19}\\times(8\\times10^{20})^2 = 1.025\\times10^{23}$. $R_H = -1.17\\times10^{-3}$ m$^3$/C: negative although holes outnumber electrons four to one.',
      trap: 'Reading the sign from the majority carrier.' },
    { id: 'shl-031', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'effective density of states',
      q: 'Silicon has six conduction valleys with $m_l = 0.98\\,m_e$ and $m_t = 0.19\\,m_e$. The density-of-states effective mass that goes into $N_c$ is about',
      options: ['$0.26\\,m_e$', '$0.33\\,m_e$', '$1.97\\,m_e$', '$1.08\\,m_e$'], answer: 3,
      sol: 'One valley: $(m_lm_t^2)^{1/3} = (0.98\\times0.0361)^{1/3} = 0.328\\,m_e$. Six valleys multiply the density of states by 6, which is the same as multiplying the mass by $6^{2/3} = 3.30$ (since $g \\propto m^{3/2}$): $m_d = 1.08\\,m_e$. The conductivity mass $0.26\\,m_e$ is a different average.',
      trap: 'Multiplying the mass by 6 instead of $6^{2/3}$.' },
    { id: 'shl-032', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'Landau levels',
      q: 'Electrons of effective mass $m^*$ are in a uniform field $B$ along $z$. Which statements are correct?',
      options: ['In 3D the energies are $(j + \\tfrac12)\\hbar\\omega_c + \\hbar^2k_z^2/2m^*$.', 'The degeneracy of a Landau level does not depend on $B$.', 'For free electrons ($m^* = m_e$, $g = 2$) the Zeeman splitting equals $\\hbar\\omega_c$.', 'In 2D, each Landau level holds $eB/h$ states per unit area for each spin.'], answer: [0, 2, 3],
      sol: 'The states of a parabolic band in an energy slab $\\hbar\\omega_c$ wide collapse into one level: $\\dfrac{m^*}{2\\pi\\hbar^2}\\hbar\\omega_c = \\dfrac{eB}{h}$ per spin per area, growing with $B$. Motion along $B$ is free. Zeeman: $g\\mu_BB = 2\\cdot\\dfrac{e\\hbar}{2m_e}B = \\hbar eB/m_e = \\hbar\\omega_c$, so spin-split levels coincide pairwise for free electrons.' },
    { id: 'shl-033', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'Hall effect in 2D',
      q: 'A 2D electron gas shows $R_{xy} = 1.25$ k$\\Omega$ at $B = 2.0$ T (classical regime) and sheet resistance $25$ $\\Omega$ per square at $B = 0$. Its mobility is ______ m$^2$/V s (to one decimal place).',
      answer: 25.0, tol: 0.2, calc: () => { const ns = 2 / (1250 * C.e); return 1 / (ns * C.e * 25); },
      sol: '$R_{xy} = B/n_se$ gives $n_s = 2.0/(1250\\times1.602\\times10^{-19}) = 9.99\\times10^{15}$ m$^{-2}$. Sheet resistance $R_\\square = 1/(n_se\\mu)$, so $\\mu = 1/(n_seR_\\square) = 1/(9.99\\times10^{15}\\times1.602\\times10^{-19}\\times25) = 25.0$ m$^2$/V s $= 2.5\\times10^5$ cm$^2$/V s. Shortcut: $\\mu = R_{xy}/(BR_\\square)$.' },
    { id: 'shl-034', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'cyclotron resonance',
      q: 'Which measurement gives a carrier effective mass directly, without needing to know the carrier density or the scattering time?',
      options: ['The Hall coefficient', 'The electrical conductivity', 'Cyclotron resonance', 'The magnetoresistance at weak field'], answer: 2,
      sol: 'Cyclotron resonance measures $\\omega_c = eB/m^*$, which involves only $m^*$. $R_H$ gives $n$ (with a Hall factor), $\\sigma = ne^2\\tau/m^*$ mixes all three, and weak-field magnetoresistance depends on mobilities. (The temperature dependence of SdH amplitudes also gives $m^*$.)' },
    { id: 'shl-035', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'magnetoresistance',
      q: 'In a Corbino disc (radial current, no Hall voltage can build up) made of a single-carrier semiconductor with constant $\\tau$, the resistance at $B = 0.50$ T is $1.25$ times its zero-field value. The carrier mobility is ______ m$^2$/V s (to two decimal places).',
      answer: 1.00, tol: 0.01, calc: () => Math.sqrt(0.25) / 0.5,
      sol: 'With no Hall field, the carriers are deflected freely and the radial conductivity falls to $\\sigma_0/(1 + \\mu^2B^2)$: $R(B)/R(0) = 1 + (\\mu B)^2$. So $(\\mu B)^2 = 0.25$, $\\mu B = 0.50$ and $\\mu = 1.00$ m$^2$/V s. This geometric magnetoresistance is used to measure mobility.' },
    { id: 'shl-036', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'cyclotron resonance',
      q: 'Electrons in one ellipsoidal valley have masses $m_l$ along its axis and $m_t$ across it. With $\\mathbf B$ perpendicular to the valley axis, the cyclotron mass is',
      options: ['$m_t$', '$\\sqrt{m_lm_t}$', '$\\tfrac12(m_l + m_t)$', '$m_l$'], answer: 1,
      sol: 'The orbit lies in the plane perpendicular to $\\mathbf B$, which contains the axis direction (mass $m_l$) and one transverse direction ($m_t$). Solving the equations of motion gives $\\omega_c = eB/\\sqrt{m_lm_t}$. With $\\mathbf B$ along the axis both orbit directions are transverse and $m_c = m_t$. Rotating $\\mathbf B$ in silicon shows separate resonances for the differently oriented valleys.' },

    // ---------- level 5 ----------
    { id: 'shl-037', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'magnetoresistance',
      q: 'A compensated semimetal has $n = p$, $\\mu_e = 0.50$ m$^2$/V s and $\\mu_h = 0.20$ m$^2$/V s. At $B = 2.0$ T the fractional magnetoresistance $\\Delta\\rho/\\rho_0$ is ______ (to two decimal places).',
      answer: 0.40, tol: 0.01, calc: () => 0.5 * 0.2 * 2 ** 2,
      sol: 'Add the conductivity tensors of the two carriers. For $n = p$ the off-diagonal parts cancel (no Hall field) and inverting gives $\\rho_{xx} = \\rho_0(1 + \\mu_e\\mu_hB^2)$. So $\\Delta\\rho/\\rho_0 = 0.50\\times0.20\\times4.0 = 0.40$, growing as $B^2$ without limit, as seen in bismuth and graphite.' },
    { id: 'shl-038', type: 'msq', level: 5, exams: ['gate', 'net'], sub: 'freeze-out',
      q: 'An uncompensated n-type semiconductor (donor density $N_d$, donor level $E_d$ below $E_c$) is studied from $T \\to 0$ to high temperature. Which statements are correct?',
      options: ['As $T \\to 0$ the Fermi level tends to midway between $E_c - E_d$ and $E_c$.', 'In the saturation range $n \\approx N_d$, almost independent of $T$.', 'In the intrinsic range $\\ln n$ against $1/T$ has slope $-E_g/2k_B$.', 'In the saturation range the Fermi level is pinned at mid-gap.'], answer: [0, 1, 2],
      sol: 'Freeze-out: $n^2 \\approx \\tfrac12N_cN_de^{-E_d/k_BT}$ and $E_F \\to E_c - E_d/2$ as $T \\to 0$ (the spin factor adds a $\\tfrac12k_BT\\ln$ term that vanishes at $T = 0$). Saturation: all donors ionised, $n = N_d$, and $E_F = E_c - k_BT\\ln(N_c/N_d)$, which moves down as $T$ rises but is not at mid-gap. Intrinsic: $n \\approx n_i \\propto T^{3/2}e^{-E_g/2k_BT}$, and $E_F$ only approaches mid-gap here.' },
    { id: 'shl-039', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'Landau levels',
      q: 'A 2D electron gas with $n_s = 5.0\\times10^{15}$ m$^{-2}$ is in a field of $3.0$ T. Ignoring spin splitting, the number of completely filled (spin-degenerate) Landau levels is ______.',
      answer: 3, tol: 0, calc: () => Math.floor(5e15 * C.h / (C.e * 3) / 2),
      sol: 'Each spin-degenerate level holds $2eB/h = 2\\times1.602\\times10^{-19}\\times3.0/6.626\\times10^{-34} = 1.451\\times10^{15}$ m$^{-2}$. $n_s/1.451\\times10^{15} = 3.45$: three levels are full and the fourth is 45% full ($\\nu = 6.9$).' },
    { id: 'shl-040', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'quantum Hall effect',
      q: 'A quantum Hall sample shows plateaus at $25.8$ k$\\Omega$ and $12.9$ k$\\Omega$. The next plateau on the low-resistance side, at higher density or lower field, is at',
      options: ['$6.45$ k$\\Omega$', '$8.60$ k$\\Omega$', '$4.30$ k$\\Omega$', '$10.3$ k$\\Omega$'], answer: 1,
      sol: 'The plateaus are $h/\\nu e^2 = 25.81/\\nu$ k$\\Omega$ with $\\nu = 1, 2$ so far; the next is $\\nu = 3$: $25.81/3 = 8.60$ k$\\Omega$. (With spin unresolved only even $\\nu$ appear and the next would be $6.45$ k$\\Omega$; here $\\nu = 1$ is seen, so spin is resolved.)',
      trap: 'Halving again to $6.45$ k$\\Omega$: the sequence is $1/\\nu$, not $1/2^\\nu$.' },
    ...more2,
    ...r4.items,
  ],
  gens: [
    { id: 'shl-g01', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Landau levels',
      make(r) {
        const ns = pick(r, 1.0, 9.0, 0.2), B = choose(r, [0.5, 1, 2, 2.5, 4, 5, 8, 10, 12]);
        const nu = ns * 1e15 * C.h / (C.e * B);
        return { q: `A two-dimensional electron gas with $n_s = ${ns}\\times10^{15}$ m$^{-2}$ is placed in a perpendicular field of $${B}$ T. Its filling factor $\\nu$ is ______ (to two decimal places).`,
          answer: round(nu, 2), tol: Math.max(0.01, round(nu * 0.01, 2)), ns, B,
          sol: `A Landau level holds $eB/h = ${round(C.e * B / C.h / 1e15, 3)}\\times10^{15}$ m$^{-2}$ per spin. $\\nu = n_sh/eB = ${round(nu, 2)}$.` };
      },
      verify: (p) => p.ns * 1e15 * C.h / (C.e * p.B) },
    { id: 'shl-g02', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'cyclotron resonance',
      make(r) {
        const f = choose(r, [9.5, 24, 35, 70, 94]), m = choose(r, [0.014, 0.023, 0.067, 0.19, 0.25, 0.35, 0.5, 0.98]);
        const B = 2 * Math.PI * f * 1e9 * m * C.me / C.e;
        const askM = r() < 0.5;
        return askM
          ? { q: `Cyclotron resonance at $${f}$ GHz is observed for carriers at $B = ${round(B, 3)}$ T. Their effective mass is ______ $m_e$ (to three decimal places).`,
            answer: round(C.e * round(B, 3) / (2 * Math.PI * f * 1e9 * C.me), 3), tol: Math.max(0.001, round(m * 0.01, 3)), f, Bq: round(B, 3), askM,
            sol: `$m^*/m_e = eB/(2\\pi fm_e) = 1.602\\times10^{-19}\\times${round(B, 3)}/(2\\pi\\times${f}\\times10^9\\times9.109\\times10^{-31}) = ${round(C.e * round(B, 3) / (2 * Math.PI * f * 1e9 * C.me), 3)}$.` }
          : { q: `Carriers with effective mass $${m}\\,m_e$ are probed with $${f}$ GHz microwaves. Resonance occurs at $B =$ ______ T (to three decimal places).`,
            answer: round(B, 3), tol: Math.max(0.001, round(B * 0.01, 3)), f, m, askM,
            sol: `$\\omega = eB/m^*$ gives $B = 2\\pi fm^*/e = 2\\pi\\times${f}\\times10^9\\times${m}\\times9.109\\times10^{-31}/1.602\\times10^{-19} = ${round(B, 3)}$ T.` };
      },
      verify: (p) => (p.askM ? C.e * p.Bq / (2 * Math.PI * p.f * 1e9 * C.me) : 2 * Math.PI * p.f * 1e9 * p.m * C.me / C.e) },
    { id: 'shl-g03', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'quantum Hall effect',
      make(r) {
        const nu = int(r, 1, 8), toR = r() < 0.5;
        const R = RK / nu / 1000;
        return toR
          ? { q: `The Hall resistance on the $\\nu = ${nu}$ integer quantum Hall plateau is ______ k$\\Omega$ (to three decimal places).`,
            answer: round(R, 3), tol: 0.003, nu, toR,
            sol: `$R_{xy} = h/\\nu e^2 = 25.813/${nu} = ${round(R, 3)}$ k$\\Omega$.` }
          : { q: `A quantum Hall plateau is measured at $R_{xy} = ${round(R, 3)}$ k$\\Omega$. Its filling factor is ______.`,
            answer: nu, tol: 0, nu, toR,
            sol: `$\\nu = (h/e^2)/R_{xy} = 25.813/${round(R, 3)} = ${nu}$.` };
      },
      verify: (p) => (p.toR ? RK / p.nu / 1000 : p.nu) },
    { id: 'shl-g04', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'two-carrier Hall effect',
      make(r) {
        const n = pick(r, 0.5, 5, 0.5), p = pick(r, 0.5, 8, 0.5), me = pick(r, 0.1, 0.8, 0.05), mh = pick(r, 0.02, 0.3, 0.02);
        const R = RH2(n * 1e21, p * 1e21, me, mh) * 1e3;
        return { q: `A sample contains $${n}\\times10^{21}$ m$^{-3}$ electrons ($\\mu_e = ${me}$ m$^2$/V s) and $${p}\\times10^{21}$ m$^{-3}$ holes ($\\mu_h = ${mh}$ m$^2$/V s). Its weak-field Hall coefficient is ______ $\\times10^{-3}$ m$^3$/C (with sign, to three significant figures).`,
          answer: +R.toPrecision(3), tol: Math.max(0.001, +Math.abs(R * 0.01).toPrecision(2)), n, p, me, mh,
          sol: `$R_H = \\dfrac{p\\mu_h^2 - n\\mu_e^2}{e(p\\mu_h + n\\mu_e)^2}$. Numerator $= (${p}\\times${mh}^2 - ${n}\\times${me}^2)\\times10^{21} = ${round(p * mh * mh - n * me * me, 4)}\\times10^{21}$; bracket $= ${round(p * mh + n * me, 4)}\\times10^{21}$. $R_H = ${+R.toPrecision(3)}\\times10^{-3}$ m$^3$/C.`,
          trap: 'Weighting by mobility instead of mobility squared in the numerator.' };
      },
      verify: (p) => RH2(p.n * 1e21, p.p * 1e21, p.me, p.mh) * 1e3 },
    { id: 'shl-g05', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'two-carrier Hall effect',
      make(r) {
        const b = choose(r, [1.5, 2, 2.5, 3, 4, 5, 10]);
        const n = 1 / (b * b - 1), p = b * b * n, x = Math.sqrt(n * p);
        return { q: `A p-type semiconductor (acceptors $N_a$, all ionised, no donors) has mobility ratio $\\mu_e/\\mu_h = ${b}$. Its Hall coefficient vanishes when $n_i/N_a$ equals ______ (to three decimal places).`,
          answer: round(x, 3), tol: Math.max(0.002, round(x * 0.005, 3)), b,
          sol: `$R_H = 0$ needs $p = b^2n = ${b * b}n$. With $p - n = N_a$: $n = N_a/${round(b * b - 1, 2)}$. Then $n_i = \\sqrt{np} = b\\,n = ${b}N_a/${round(b * b - 1, 2)}$, so $n_i/N_a = ${round(x, 3)}$.` };
      },
      verify: (p) => p.b / (p.b * p.b - 1) },
    { id: 'shl-g06', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Landau levels',
      make(r) {
        const [mat, m] = choose(r, [['InSb', 0.014], ['InAs', 0.023], ['GaAs', 0.067], ['Si (transverse)', 0.19], ['GaN', 0.2], ['free space', 1]]);
        const B = choose(r, [1, 2, 5, 8, 10, 15, 20]);
        const E = C.hbar * C.e * B / (m * C.me) / C.e * 1000;
        return { q: `Electrons in ${mat} ($m^* = ${m}\\,m_e$) are in a field of $${B}$ T. The Landau-level spacing $\\hbar\\omega_c$ is ______ meV (to three significant figures).`,
          answer: +E.toPrecision(3), tol: +(E * 0.01).toPrecision(2), m, B,
          sol: `$\\hbar\\omega_c = \\hbar eB/m^* = 0.1158\\text{ meV/T}\\times${B}/${m} = ${+E.toPrecision(3)}$ meV.` };
      },
      verify: (p) => C.hbar * C.e * p.B / (p.m * C.me) / C.e * 1000 },
    { id: 'shl-g07', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Shubnikov-de Haas',
      make(r) {
        const toN = r() < 0.5, gs = choose(r, [1, 2]);
        if (toN) {
          const d = choose(r, [0.02, 0.025, 0.04, 0.05, 0.08, 0.1, 0.125, 0.2]);
          const n = gs * C.e / (C.h * d) / 1e15;
          return { q: `Shubnikov-de Haas minima of a 2D electron gas are spaced by $${d}$ T$^{-1}$ in $1/B$, with ${gs === 2 ? 'spin-degenerate Landau levels' : 'every spin-split level resolved'}. The sheet density is ______ $\\times10^{15}$ m$^{-2}$ (to two decimal places).`,
            answer: round(n, 2), tol: Math.max(0.01, round(n * 0.01, 2)), toN, d, gs,
            sol: `A minimum each time one more ${gs === 2 ? 'spin-degenerate level (holding $2eB/h$)' : 'spin-split level (holding $eB/h$)'} empties: $\\Delta(1/B) = ${gs === 2 ? '2' : ''}e/hn_s$, so $n_s = ${gs === 2 ? '2' : ''}e/(h\\times${d}) = ${round(n, 2)}\\times10^{15}$ m$^{-2}$.` };
        }
        const n = pick(r, 1, 12, 0.5), d = gs * C.e / (C.h * n * 1e15);
        return { q: `A 2D electron gas has $n_s = ${n}\\times10^{15}$ m$^{-2}$. With ${gs === 2 ? 'spin-degenerate Landau levels' : 'spin splitting fully resolved'}, its Shubnikov-de Haas oscillations have period ______ T$^{-1}$ in $1/B$ (to four decimal places).`,
          answer: round(d, 4), tol: Math.max(0.0001, round(d * 0.01, 4)), toN, n, gs,
          sol: `$\\Delta(1/B) = ${gs === 2 ? '2' : ''}e/(hn_s) = ${round(d, 4)}$ T$^{-1}$.` };
      },
      verify: (p) => (p.toN ? p.gs * C.e / (C.h * p.d) / 1e15 : p.gs * C.e / (C.h * p.n * 1e15)) },
    { id: 'shl-g08', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'Mott transition',
      make(r) {
        const [mat, eps, m] = choose(r, [['silicon (P donors, crude model)', 11.7, 0.26], ['germanium', 16, 0.12], ['GaAs', 12.9, 0.067], ['InP', 12.5, 0.08], ['CdS', 8.9, 0.2]]);
        const a = C.a0 * 1e9 * eps / m, nc = (0.26 / a) ** 3 * 1e21; // cm^-3
        const e10 = Math.floor(Math.log10(nc)), mant = nc / 10 ** e10;
        return { q: `Treat donors in ${mat} ($\\varepsilon_r = ${eps}$, $m^* = ${m}\\,m_e$) as hydrogen-like. With the Mott criterion $n_c^{1/3}a^* = 0.26$, the critical density is ______ $\\times10^{${e10}}$ cm$^{-3}$ (to two decimal places). Take $a_0 = 0.0529$ nm.`,
          answer: round(mant, 2), tol: Math.max(0.01, round(mant * 0.015, 2)), eps, m, e10,
          sol: `$a^* = a_0\\varepsilon_r m_e/m^* = 0.0529\\times${eps}/${m} = ${round(a, 3)}$ nm. $n_c = (0.26/a^*)^3 = ${+(nc / 1e21).toPrecision(3)}$ nm$^{-3} = ${round(mant, 2)}\\times10^{${e10}}$ cm$^{-3}$.`,
          trap: 'Converting nm$^{-3}$ to cm$^{-3}$: multiply by $10^{21}$.' };
      },
      verify: (p) => (0.26 / (C.a0 * 1e9 * p.eps / p.m)) ** 3 * 1e21 / 10 ** p.e10 },
    { id: 'shl-g09', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'mobility',
      make(r) {
        const muL = choose(r, [800, 1200, 1500, 2000, 4000, 8000]), muI = choose(r, [1000, 2400, 3000, 5000, 12000]), hall = r() < 0.5;
        const mu = 1 / (1 / muL + 1 / muI), ans = hall ? mu * 3 * Math.PI / 8 : mu;
        return { q: `In a non-degenerate n-type sample, lattice scattering alone would give mobility $${muL}$ cm$^2$/V s and impurity scattering alone $${muI}$ cm$^2$/V s. Using Matthiessen's rule${hall ? ' and a Hall factor of $3\\pi/8$' : ''}, the ${hall ? 'Hall mobility $|R_H|\\sigma$' : 'drift mobility'} is ______ cm$^2$/V s (to the nearest whole number).`,
          answer: Math.round(ans), tol: Math.max(2, Math.round(ans * 0.005)), muL, muI, hall,
          sol: `$1/\\mu = 1/${muL} + 1/${muI}$, so $\\mu = ${round(mu, 1)}$ cm$^2$/V s.${hall ? ` The Hall mobility is $r_H\\mu = 1.178\\times${round(mu, 1)} = ${Math.round(ans)}$ cm$^2$/V s.` : ''}`,
          trap: 'Adding mobilities instead of their inverses.' };
      },
      verify: (p) => { const mu = 1 / (1 / p.muL + 1 / p.muI); return p.hall ? mu * 3 * Math.PI / 8 : mu; } },
    { id: 'shl-g10', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'Hall effect in 2D',
      make(r) {
        const B = choose(r, [0.2, 0.5, 1, 2]), Rxy = choose(r, [250, 400, 625, 800, 1000, 1250, 2000]), Rs = choose(r, [2, 5, 10, 25, 50, 100, 200]);
        const ns = B / (Rxy * C.e), mu = Rxy / (B * Rs), want = choose(r, ['n', 'mu']);
        return { q: `In the classical regime a 2D electron gas gives $R_{xy} = ${Rxy}$ $\\Omega$ at $B = ${B}$ T, and its zero-field sheet resistance is $${Rs}$ $\\Omega$ per square. Its ${want === 'n' ? 'sheet density is ______ $\\times10^{15}$ m$^{-2}$' : 'mobility is ______ m$^2$/V s'} (to three significant figures).`,
          answer: +(want === 'n' ? ns / 1e15 : mu).toPrecision(3), tol: +((want === 'n' ? ns / 1e15 : mu) * 0.01).toPrecision(2), B, Rxy, Rs, want,
          sol: `$n_s = B/eR_{xy} = ${+(ns / 1e15).toPrecision(4)}\\times10^{15}$ m$^{-2}$ and $\\mu = 1/(n_seR_\\square) = R_{xy}/(BR_\\square) = ${+mu.toPrecision(4)}$ m$^2$/V s.` };
      },
      verify: (p) => (p.want === 'n' ? p.B / (p.Rxy * C.e) / 1e15 : p.Rxy / (p.B * p.Rs)) },
    { id: 'shl-g11', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'two-carrier Hall effect',
      make(r) {
        const b = choose(r, [0.5, 1.5, 2, 3, 4]), ratio = choose(r, [0.5, 1, 2, 4, 6, 9, 12, 20]);
        const num = ratio - b * b; // p/n - b^2 sets the sign
        const ans = Math.abs(num) < 1e-12 ? 'zero' : num > 0 ? 'positive' : 'negative';
        const opts = ['positive', 'negative', 'zero', 'impossible to tell without the field strength'];
        const sh = int(r, 0, 3), order = [0, 1, 2, 3].map((i) => opts[(i + sh) % 4]);
        return { q: `A semiconductor holds both electrons and holes with $p/n = ${ratio}$ and mobility ratio $\\mu_e/\\mu_h = ${b}$. In a weak magnetic field its Hall coefficient is`, options: order, answer: order.indexOf(ans), b, ratio,
          sol: `The sign of $R_H$ is the sign of $p\\mu_h^2 - n\\mu_e^2 = n\\mu_h^2(p/n - b^2) = n\\mu_h^2(${ratio} - ${b * b})$, which is ${ans}.${ans === 'negative' && ratio > 1 ? ' Holes are the majority, yet the more mobile electrons win.' : ''}` };
      } },
    { id: 'shl-g12', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'magnetoresistance',
      make(r) {
        const kind = choose(r, ['corbino', 'comp']);
        if (kind === 'corbino') {
          const mu = pick(r, 0.2, 3, 0.1), B = choose(r, [0.1, 0.2, 0.5, 1]);
          const ratio = 1 + (mu * B) ** 2;
          return { q: `A Corbino disc of a single-carrier semiconductor (constant $\\tau$) has resistance $${round(ratio, 4)}$ times its zero-field value at $B = ${B}$ T. The carrier mobility is ______ m$^2$/V s (to two decimal places).`,
            answer: round(Math.sqrt(round(ratio, 4) - 1) / B, 2), tol: Math.max(0.01, round(mu * 0.01, 2)), kind, ratioq: round(ratio, 4), B,
            sol: `No Hall field can form, so $R(B)/R(0) = 1 + (\\mu B)^2$. $\\mu B = \\sqrt{${round(ratio - 1, 4)}}$, so $\\mu = ${round(Math.sqrt(round(ratio, 4) - 1) / B, 2)}$ m$^2$/V s.` };
        }
        const me = pick(r, 0.1, 2, 0.1), mh = pick(r, 0.05, 1, 0.05), B = choose(r, [0.5, 1, 2, 5]);
        const dr = me * mh * B * B;
        return { q: `A compensated semimetal ($n = p$) has $\\mu_e = ${me}$ m$^2$/V s and $\\mu_h = ${mh}$ m$^2$/V s. At $B = ${B}$ T its fractional magnetoresistance $\\Delta\\rho/\\rho_0$ is ______ (to three significant figures).`,
          answer: +dr.toPrecision(3), tol: +(dr * 0.01).toPrecision(2), kind, me, mh, B,
          sol: `For $n = p$ the Hall field vanishes and $\\Delta\\rho/\\rho_0 = \\mu_e\\mu_hB^2 = ${me}\\times${mh}\\times${B}^2 = ${+dr.toPrecision(3)}$.` };
      },
      verify: (p) => (p.kind === 'corbino' ? Math.sqrt(p.ratioq - 1) / p.B : p.me * p.mh * p.B * p.B) },
    ...more,
    ...r4.gens,
  ],
};
