// Nuclear reactions and Q values, GATE / CSIR NET level (the JAM topic nuclear-reactions covers fission, fusion,
// moderation and simple thresholds): Q from mass excesses, centre-of-mass energy, the non-relativistic Q equation and
// double-valued kinematics, relativistic thresholds and invariant mass, CM-lab angles, cross-sections and reaction
// rates, activation, partial waves and their limits, Breit-Wigner resonances and the spin factor, compound nucleus
// (Ghoshal) and direct reactions (stripping, pickup), Rutherford scaling, optical model.
// Original questions for fibub.
import { pick, int, choose, mcqOptions, round } from '../_util.js';
import more from './nuclear-reactions-gate.more.gen.js';
import more2 from './nuclear-reactions-gate.more2.gen.js';
import r4 from './nuclear-reactions-gate.r4.gen.js';

const HBARC = 197.327, MN = 939.565, MP = 938.272, NA = 6.02214076e23, QE = 1.602176634e-19;
// mass excesses in MeV (AME 2020); symbol -> [Delta, Z, A]
const D = { n: [8.07132, 0, 1], p: [7.28897, 1, 1], d: [13.13572, 1, 2], t: [14.94981, 1, 3], h: [14.93122, 2, 3], a: [2.42492, 2, 4], g: [0, 0, 0], Li6: [14.08688, 3, 6], Li7: [14.90711, 3, 7], Be7: [15.76900, 4, 7], Be9: [11.34845, 4, 9], B10: [12.05061, 5, 10], B11: [8.66770, 5, 11], C12: [0, 6, 12], C13: [3.12501, 6, 13], C14: [3.01989, 6, 14], N14: [2.86342, 7, 14], N15: [0.10144, 7, 15], O16: [-4.73700, 8, 16], O17: [-0.80876, 8, 17], F19: [-1.48744, 9, 19], H3: [14.94981, 1, 3], He3: [14.93122, 2, 3], He4: [2.42492, 2, 4], H2: [13.13572, 1, 2] };
const PN = { n: 'n', p: 'p', d: 'd', t: 't', h: '{}^3\\text{He}', a: '\\alpha', g: '\\gamma' };
const nl = (k) => { if (PN[k]) return PN[k]; const [, s, a] = k.match(/^([A-Z][a-z]?)(\d+)$/); return `{}^{${a}}\\text{${s}}`; };
const RX = [['Li7', 'p', 'n', 'Be7'], ['Li7', 'p', 'a', 'He4'], ['Li6', 'n', 'a', 'H3'], ['Be9', 'a', 'n', 'C12'], ['B10', 'n', 'a', 'Li7'], ['C12', 'd', 'p', 'C13'], ['N14', 'n', 'p', 'C14'], ['N14', 'a', 'p', 'O17'], ['O16', 'd', 'a', 'N14'], ['H3', 'p', 'n', 'He3'], ['H2', 'd', 'n', 'He3'], ['H2', 'd', 'p', 'H3'], ['F19', 'p', 'a', 'O16'], ['N15', 'p', 'a', 'C12'], ['Li6', 'd', 'a', 'He4'], ['C12', 'a', 'g', 'O16'], ['B11', 'p', 'n', 'C11x'], ['C13', 'a', 'n', 'O16'], ['C14', 'p', 'n', 'N14'], ['B11', 'd', 'n', 'C12'], ['Be9', 'd', 'p', 'Be10x'], ['C12', 'p', 'd', 'C11y']].filter((x) => !/x|y/.test(x[3]));
const Qof = ([X, a, b, Y]) => D[X][0] + D[a][0] - D[b][0] - D[Y][0];
const Am = (k) => D[k][2];
const sci = (x, d = 3) => { const e = Math.floor(Math.log10(Math.abs(x))); return `${(x / 10 ** e).toFixed(d)}\\times10^{${e}}`; };
const rxs = (x) => `${nl(x[0])}(${nl(x[1])}, ${nl(x[2])})${nl(x[3])}`;
// non-relativistic Q equation, larger root for T_b (MeV), masses in u (integers ok)
const Tb = (ma, mX, mb, mY, Q, Ta, th) => { const c = Math.cos(th * Math.PI / 180); const A = Math.sqrt(ma * mb * Ta) * c, Dd = A * A + (mY + mb) * (mY * Q + (mY - ma) * Ta); const s = (A + Math.sqrt(Dd)) / (mY + mb); return s * s; };
const SYM = ['n', 'H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne', 'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar', 'K', 'Ca', 'Sc', 'Ti', 'V', 'Cr', 'Mn', 'Fe', 'Co', 'Ni', 'Cu', 'Zn', 'Ga', 'Ge', 'As', 'Se'];
const PART = { n: [0, 1, 'n'], p: [1, 1, 'p'], d: [1, 2, 'd'], t: [1, 3, 't'], h: [2, 3, '{}^3\\text{He}'], a: [2, 4, '\\alpha'], g: [0, 0, '\\gamma'] };
const RELTH = [['p + p \\to p + p + \\pi^0', [MP, MP], [MP, MP, 134.977]], ['p + p \\to p + n + \\pi^+', [MP, MP], [MP, MN, 139.570]], ['\\gamma + p \\to \\pi^+ + n', [0, MP], [139.570, MN]], ['\\gamma + p \\to p + \\pi^0', [0, MP], [MP, 134.977]], ['\\pi^- + p \\to K^0 + \\Lambda', [139.570, MP], [497.611, 1115.683]], ['\\pi^- + p \\to n + \\eta', [139.570, MP], [MN, 547.862]], ['p + p \\to p + \\Lambda + K^+', [MP, MP], [MP, 1115.683, 493.677]], ['\\gamma + p \\to p + e^+ + e^-', [0, MP], [MP, 0.511, 0.511]], ['p + p \\to d + \\pi^+', [MP, MP], [1875.613, 139.570]], ['K^- + p \\to \\Omega^- + K^+ + K^0', [493.677, MP], [1672.45, 493.677, 497.611]]];

import { tidyPhys } from './_signs.js';

const topicBank = {
  topic: 'nuclear-reactions-gate',
  items: [
    // ---------- level 1 ----------
    { id: 'nrg-001', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'centre of mass',
      q: 'A projectile of mass $m_a$ and kinetic energy $T_a$ (non-relativistic) hits a target of mass $m_X$ at rest. The kinetic energy available in the centre-of-mass frame is',
      options: ['$T_a$', '$T_a\\,m_a/(m_a + m_X)$', '$T_a\\,m_X/(m_a + m_X)$', '$T_a\\,m_X/m_a$'], answer: 2,
      sol: 'The CM moves with velocity $v_a m_a/(m_a + m_X)$, carrying kinetic energy $T_a m_a/(m_a + m_X)$ that must be kept by momentum conservation. The rest, $T_a m_X/(m_a + m_X) = \\tfrac12\\mu v_a^2$, is available for the reaction. A light projectile on a heavy target uses almost all of it.',
      trap: 'Swapping $m_a$ and $m_X$: the heavier the target, the more energy is available.' },
    { id: 'nrg-002', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'compound nucleus',
      q: 'Bohr\'s independence hypothesis for compound-nucleus reactions states that',
      options: ['the decay of the compound nucleus depends only on its energy, angular momentum and parity, not on how it was formed', 'the projectile passes through the nucleus without interacting', 'the compound nucleus always decays by gamma emission', 'every nucleon acts independently of the others'], answer: 0,
      sol: 'The projectile shares its energy among all nucleons; after many collisions (about $10^{-16}$ s or longer) the system forgets the entrance channel. The branching into exit channels depends only on conserved quantities. Ghoshal (1950) confirmed it by forming ${}^{64}$Zn$^*$ from $p + {}^{63}$Cu and from $\\alpha + {}^{60}$Ni.',
      trap: 'Independence of formation and decay is a statement about memory, not about nucleons being independent.' },
    { id: 'nrg-003', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'cross-sections',
      q: 'For slow neutrons far from any resonance, the capture cross-section of most nuclei varies with neutron speed $v$ as',
      options: ['$v$', '$v^2$', 'independent of $v$', '$1/v$'], answer: 3,
      sol: 'Capture probability is proportional to the time spent near the nucleus, $\\propto 1/v$ (equivalently $\\pi\\lambda\\!\\!\\!^{-2}\\propto 1/v^2$ times a neutron width $\\propto v$). So the reaction rate $n\\sigma v$ is constant at low energy. Boron-10 and helium-3 detectors use this $1/v$ behaviour.',
      trap: 'Elastic scattering is nearly constant at low energy; capture goes as $1/v$.' },
    { id: 'nrg-004', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'notation',
      q: 'In the reaction ${}^{27}\\text{Al}(n, \\alpha)X$, the product $X$ is',
      options: ['${}^{24}$Na', '${}^{24}$Mg', '${}^{23}$Na', '${}^{28}$Al'], answer: 0,
      sol: 'Charge: $13 + 0 = 2 + Z$, so $Z = 11$ (sodium). Nucleons: $27 + 1 = 4 + A$, so $A = 24$. $X = {}^{24}$Na, the 15-hour gamma emitter used to measure fast-neutron fluence.',
      trap: 'Forgetting to add the incoming neutron to the nucleon count.' },
    { id: 'nrg-005', type: 'nat', level: 1, exams: ['gate', 'net'], sub: 'centre of mass', unit: 'MeV',
      q: 'A $10.0$ MeV proton hits a ${}^{12}$C nucleus at rest. Using mass numbers for masses, the kinetic energy in the centre-of-mass frame is ______ MeV (to two decimal places).',
      answer: 9.23, tol: 0.01, calc: () => 10 * 12 / 13,
      sol: '$T_{cm} = T_a\\dfrac{m_X}{m_a + m_X} = 10.0\\times\\dfrac{12}{13} = 9.23$ MeV. The remaining $0.77$ MeV is the kinetic energy of the centre of mass itself.',
      trap: 'Using $m_a/(m_a + m_X)$ gives the energy that is not available.' },
    { id: 'nrg-006', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'direct reactions',
      q: 'Compared with compound-nucleus reactions, direct reactions (such as $(d, p)$ stripping at 10 to 20 MeV)',
      options: ['take much longer and give isotropic angular distributions', 'take about the time for the projectile to cross the nucleus (about $10^{-22}$ s) and give forward-peaked angular distributions', 'only occur with neutrons', 'always form an excited compound state first'], answer: 1,
      sol: 'In a direct reaction the projectile interacts with one or a few nucleons on its way past, in a transit time $\\sim R/v \\sim 10^{-22}$ s. The products remember the beam direction and come out mostly forward, with diffraction-like peaks that reveal the transferred angular momentum.',
      trap: 'Isotropic (symmetric about 90° in the CM) distributions are the signature of compound reactions.' },

    // ---------- level 2 ----------
    { id: 'nrg-007', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'reaction rates', unit: '10⁷ s⁻¹',
      q: 'A $1.0\\ \\mu$A proton beam hits a ${}^{12}$C target of areal density $1.0$ mg/cm$^2$. The reaction cross-section is $50$ mb. The reaction rate is ______ $\\times10^7$ s$^{-1}$ (to two decimal places). Use $e = 1.602\\times10^{-19}$ C, $N_A = 6.022\\times10^{23}$ mol$^{-1}$, molar mass 12 g/mol.',
      answer: 1.57, tol: 0.02, calc: () => (1e-6 / QE) * (1e-3 / 12 * NA) * 50e-27 / 1e7,
      sol: 'Protons per second $= 10^{-6}/1.602\\times10^{-19} = 6.24\\times10^{12}$ s$^{-1}$. Target nuclei per cm$^2$ $= (10^{-3}/12)\\times6.022\\times10^{23} = 5.02\\times10^{19}$. $\\sigma = 50\\times10^{-27}$ cm$^2$. Rate $= 6.24\\times10^{12}\\times5.02\\times10^{19}\\times5\\times10^{-26} = 1.57\\times10^7$ s$^{-1}$.',
      trap: '$1$ b $= 10^{-24}$ cm$^2$, so $1$ mb $= 10^{-27}$ cm$^2$; mixing m$^2$ and cm$^2$ loses four orders of magnitude.' },
    { id: 'nrg-008', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'reaction types',
      q: 'In ${}^{12}\\text{C}(p, p\')^{12}\\text{C}^*(4.44\\text{ MeV})$, the process is',
      options: ['elastic scattering', 'radiative capture', 'inelastic scattering, leaving the target in an excited state', 'a transfer reaction'], answer: 2,
      sol: 'The outgoing particle is the same as the incoming one, but the target is left excited (the prime marks the lower-energy proton). $Q = -4.44$ MeV. The ${}^{12}$C$^*$ then emits a $4.44$ MeV gamma ray.',
      trap: 'Elastic scattering leaves the target in its ground state, with $Q = 0$.' },
    { id: 'nrg-009', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'activation', unit: '10⁶ Bq',
      q: 'A target is irradiated so that radioactive nuclei are produced at a constant rate of $2.0\\times10^6$ s$^{-1}$. The product has a half-life of 15 h. The activity at the end of a 45-hour irradiation is ______ $\\times10^6$ Bq (to two decimal places).',
      answer: 1.75, tol: 0.01, calc: () => 2 * (1 - 0.5 ** 3),
      sol: '$dN/dt = R - \\lambda N$ gives $A(t) = \\lambda N = R(1 - e^{-\\lambda t})$. After 3 half-lives, $e^{-\\lambda t} = 1/8$: $A = 2.0\\times10^6\\times0.875 = 1.75\\times10^6$ Bq. The activity approaches the production rate (saturation); irradiating much longer than a few half-lives gains little.',
      trap: 'Writing $A = R\\,e^{-\\lambda t}$ (as if the nuclei were made all at once at the start).' },
    { id: 'nrg-010', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'conservation laws',
      q: 'In a nuclear reaction caused by the strong or electromagnetic interaction, which quantities are always conserved?',
      options: ['total electric charge', 'total number of nucleons', 'total rest mass', 'parity'], answer: [0, 1, 3],
      sol: 'Charge, baryon (nucleon) number, energy, momentum, angular momentum and parity are conserved by the strong and electromagnetic forces. Rest mass is not: $Q$ is exactly the change of rest-mass energy into kinetic energy.',
      trap: 'Rest mass changes in every reaction with $Q \\ne 0$.' },
    { id: 'nrg-011', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Coulomb barrier', unit: 'MeV',
      q: 'An alpha particle must reach the touching distance $R = 1.4(A_1^{1/3} + A_2^{1/3})$ fm to react with ${}^{14}$N ($Z = 7$). Using mass numbers for masses and $e^2/4\\pi\\varepsilon_0 = 1.44$ MeV fm, the minimum lab kinetic energy of the alpha is ______ MeV (to two decimal places).',
      answer: 4.63, tol: 0.02, calc: () => { const R = 1.4 * (Math.cbrt(4) + Math.cbrt(14)); return 2 * 7 * 1.44 / R * 18 / 14; },
      sol: '$R = 1.4(1.587 + 2.410) = 5.597$ fm. Barrier in the CM: $B = 2\\times7\\times1.44/5.597 = 3.60$ MeV. The lab energy must be larger by $(m_a + m_X)/m_X = 18/14$: $3.60\\times18/14 = 4.63$ MeV. (Tunnelling allows reactions somewhat below this.)',
      trap: 'Comparing the barrier with the lab energy directly; the barrier must be overcome in the CM frame.' },
    { id: 'nrg-012', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'partial waves',
      q: 'Neutrons with kinetic energy of a few eV interact with nuclei',
      options: ['only through s-waves ($\\ell = 0$), because their reduced wavelength is thousands of fm, far larger than the nucleus', 'only through p-waves', 'through all partial waves up to $\\ell \\approx 100$', 'not at all, because they are neutral'], answer: 0,
      sol: 'A partial wave $\\ell$ has classical impact parameter $b \\approx \\ell\\lambda\\!\\!\\!^-$. With $\\lambda\\!\\!\\!^- \\approx 2000$ to $5000$ fm and $R \\approx 5$ fm, only $\\ell = 0$ (impact parameter below $\\lambda\\!\\!\\!^-$) reaches the nucleus. Hence isotropic scattering and spin-statistics factors for slow neutrons.',
      trap: 'Neutral particles still feel the strong force once they overlap the nucleus.' },
    { id: 'nrg-013', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'cross-sections',
      q: 'The geometric cross-section $\\pi R^2$ of ${}^{238}$U, with $R = 1.2A^{1/3}$ fm, is about',
      options: ['$0.17$ b', '$17$ b', '$1.7$ b', '$1.7\\times10^{-3}$ b'], answer: 2,
      sol: '$R = 1.2\\times6.197 = 7.44$ fm; $\\pi R^2 = 174$ fm$^2 = 1.74$ b ($1$ b $= 100$ fm$^2$). Fast-neutron cross-sections are of this order; slow-neutron cross-sections can be thousands of barns because the relevant size is $\\lambda\\!\\!\\!^-$, not $R$.',
      trap: '$1$ barn $= 10^{-28}$ m$^2 = 100$ fm$^2$; forgetting the 100 gives 174 b.' },
    { id: 'nrg-014', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'Q value',
      q: 'For a reaction with $Q > 0$ (exoergic) caused by a neutron on a nucleus at rest,',
      options: ['there is a threshold energy $|Q|(1 + m_a/m_X)$', 'the reaction can occur even for neutrons of nearly zero energy, and the products carry more kinetic energy than the neutron brought in', 'the products always have less kinetic energy than the neutron', 'the reaction is impossible'], answer: 1,
      sol: 'Rest-mass energy is released, so the final kinetic energy is $T_a + Q > T_a$. With no Coulomb barrier for a neutron, nothing stops it at any energy: ${}^{10}\\text{B}(n, \\alpha){}^7$Li ($Q = 2.79$ MeV) works with thermal neutrons.',
      trap: 'Thresholds belong to endoergic reactions ($Q < 0$).' },
    { id: 'nrg-015', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'partial waves',
      q: 'The reduced de Broglie wavelength $\\lambda\\!\\!\\!^- = \\hbar/p$ of a $1.0$ eV neutron is about ($m_nc^2 = 939.6$ MeV, $\\hbar c = 197.3$ MeV fm)',
      options: ['$4.6$ fm', '$4.6\\times10^3$ fm', '$4.6\\times10^5$ fm', '$0.46$ fm'], answer: 1,
      sol: '$pc = \\sqrt{2m_nc^2T} = \\sqrt{2\\times939.6\\times10^6\\times1.0}$ eV $= 4.33\\times10^4$ eV. $\\lambda\\!\\!\\!^- = \\hbar c/pc = 197.3\\times10^6/4.33\\times10^4$ fm $= 4.6\\times10^3$ fm, about a thousand nuclear radii.',
      trap: 'Mixing eV and MeV in the square root.' },
    { id: 'nrg-016', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Q value', unit: 'MeV',
      q: 'Mass excesses: ${}^6$Li $14.087$ MeV, ${}^2$H $13.136$ MeV, ${}^4$He $2.425$ MeV. The $Q$ value of ${}^6\\text{Li}(d, \\alpha){}^4\\text{He}$ is ______ MeV (to two decimal places).',
      answer: 22.37, tol: 0.01, calc: () => 14.087 + 13.136 - 2 * 2.425,
      sol: 'When nucleon number balances, $Q = \\sum\\Delta_{initial} - \\sum\\Delta_{final}$ (the $A$ u parts cancel). $Q = 14.087 + 13.136 - 2\\times2.425 = 22.37$ MeV, shared by two alphas: one of the most energetic low-$Z$ reactions.',
      trap: 'Forgetting that two alpha particles come out.' },

    // ---------- level 3 ----------
    { id: 'nrg-017', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Q equation', unit: 'MeV',
      q: 'In ${}^{12}\\text{C}(d, p){}^{13}\\text{C}$, $5.00$ MeV deuterons produce protons of $6.46$ MeV at $90^\\circ$ in the lab. Using mass numbers for masses, $Q$ = ______ MeV (to two decimal places).',
      answer: 2.73, tol: 0.02, calc: () => 6.46 * 14 / 13 - 5 * 11 / 13,
      sol: 'The Q equation: $Q = T_b\\left(1 + \\dfrac{m_b}{m_Y}\\right) - T_a\\left(1 - \\dfrac{m_a}{m_Y}\\right) - \\dfrac{2}{m_Y}\\sqrt{m_am_bT_aT_b}\\cos\\theta$. At $90^\\circ$ the last term vanishes: $Q = 6.46\\times\\dfrac{14}{13} - 5.00\\times\\dfrac{11}{13} = 6.957 - 4.231 = 2.73$ MeV (the ground-state value is $2.72$ MeV).',
      trap: 'Taking $Q = T_p - T_d$ ignores the recoil of ${}^{13}$C.' },
    { id: 'nrg-018', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Q equation',
      q: 'For an endoergic reaction just above threshold, the outgoing particle $b$ is observed',
      options: ['only at $90^\\circ$', 'only within a forward cone, and at each lab angle inside it with two different energies', 'isotropically with one energy', 'only backwards'], answer: 1,
      sol: 'Just above threshold the CM velocity exceeds the speed of $b$ in the CM frame. Then every CM direction maps into a forward lab cone, and each lab angle corresponds to two CM angles: two energies (the two roots of the Q equation). As the beam energy rises, the cone opens until backward angles are reached and only one root survives.',
      trap: 'Thinking double-valued energies need two different reactions.' },
    { id: 'nrg-019', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'relativistic threshold', unit: 'MeV',
      q: 'Find the threshold kinetic energy of the beam proton for $p + p \\to p + p + \\pi^0$ on a stationary proton target ($m_pc^2 = 938.27$ MeV, $m_{\\pi^0}c^2 = 134.98$ MeV), to one decimal place, in MeV.',
      answer: 279.7, tol: 0.2, calc: () => ((2 * 938.272 + 134.977) ** 2 - (2 * 938.272) ** 2) / (2 * 938.272),
      sol: 'At threshold the products move together, so $\\sqrt s = 2m_p + m_\\pi$. For a fixed target $s = 2m_p^2 + 2m_pE_a$, so $T_{th} = \\dfrac{(2m_p + m_\\pi)^2 - 4m_p^2}{2m_p} = 2m_\\pi + \\dfrac{m_\\pi^2}{2m_p} = 269.95 + 9.71 = 279.7$ MeV.',
      trap: 'Answering $m_\\pi c^2 = 135$ MeV ignores momentum conservation.' },
    { id: 'nrg-020', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'Breit-Wigner',
      q: 'For an isolated resonance described by the Breit-Wigner formula, which statements are correct?',
      options: ['The cross-section peaks at the resonance energy $E_R$ and falls to half its peak at $E_R \\pm \\Gamma/2$', 'The total width is related to the mean life of the compound state by $\\Gamma = \\hbar/\\tau$', 'The peak cross-section for $a + X \\to b + Y$ is $\\pi\\lambda\\!\\!\\!^{-2}g\\,4\\Gamma_a\\Gamma_b/\\Gamma^2$', 'The longer the compound state lives, the wider the resonance'], answer: [0, 1, 2],
      sol: '$\\sigma_{ab}(E) = \\pi\\lambda\\!\\!\\!^{-2}g\\dfrac{\\Gamma_a\\Gamma_b}{(E - E_R)^2 + \\Gamma^2/4}$. At $E = E_R$ this gives $\\pi\\lambda\\!\\!\\!^{-2}g\\,4\\Gamma_a\\Gamma_b/\\Gamma^2$, and at $E_R \\pm \\Gamma/2$ half of that. A long life means a narrow line: $\\Gamma\\tau = \\hbar$.',
      trap: 'Width and lifetime are inversely related.' },
    { id: 'nrg-021', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Breit-Wigner', unit: 'b',
      q: 'A neutron capture resonance has total width $\\Gamma = 0.12$ eV and peak cross-section $5000$ b. Assuming the Breit-Wigner shape (ignore the slow variation of $\\lambda\\!\\!\\!^-$ and the widths with energy), the cross-section $0.10$ eV above the peak is ______ b (to the nearest b).',
      answer: 1324, tol: 3, calc: () => 5000 * 0.0036 / (0.01 + 0.0036),
      sol: '$\\sigma = \\sigma_0\\dfrac{\\Gamma^2/4}{(E - E_R)^2 + \\Gamma^2/4} = 5000\\times\\dfrac{0.0036}{0.0100 + 0.0036} = 5000\\times0.2647 = 1324$ b.',
      trap: 'Using $\\Gamma^2$ instead of $\\Gamma^2/4$: $\\Gamma$ is the full width.' },
    { id: 'nrg-022', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'compound nucleus',
      q: 'In Ghoshal\'s experiment the compound nucleus ${}^{64}$Zn$^*$ was made at the same excitation energy in two ways. The key result was that',
      options: ['the two entrance channels gave very different ratios of the exit channels', 'no compound nucleus was formed', 'the cross-section ratios $\\sigma(n):\\sigma(pn):\\sigma(2n)$ were the same for both entrance channels, $p + {}^{63}$Cu and $\\alpha + {}^{60}$Ni', 'only gamma rays were emitted'], answer: 2,
      sol: 'Bohr\'s hypothesis predicts $\\sigma(a, b) = \\sigma_{CN}(a)\\,P(b)$, with the branching $P(b)$ independent of $a$. Matching the CM energies so that the excitation was equal, Ghoshal found the same exit-channel ratios for both formation routes.',
      trap: 'The formation cross-sections differ; only the decay branching should be the same.' },
    { id: 'nrg-023', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Q equation', unit: 'MeV',
      q: 'The reaction ${}^7\\text{Li}(p, n){}^7\\text{Be}$ has $Q = -1.644$ MeV. For $3.00$ MeV protons, using mass numbers, the energy of the neutrons emitted at $0^\\circ$ (the higher root of the Q equation) is ______ MeV (to two decimal places).',
      answer: 1.31, tol: 0.01, calc: () => Tb(1, 7, 1, 7, -1.644, 3, 0),
      sol: 'Write the Q equation as a quadratic in $\\sqrt{T_b}$: $(m_Y + m_b)T_b - 2\\sqrt{m_am_bT_a}\\cos\\theta\\sqrt{T_b} - [m_YQ + (m_Y - m_a)T_a] = 0$. With $m_a = m_b = 1$, $m_Y = 7$, $\\theta = 0$: $8T_b - 2\\sqrt{3}\\sqrt{T_b} - (-11.508 + 18) = 0$, i.e. $8x^2 - 3.464x - 6.492 = 0$ with $x = \\sqrt{T_b}$. $x = (3.464 + \\sqrt{12.0 + 207.7})/16 = 1.143$, so $T_b = 1.31$ MeV.',
      trap: 'Using $T_b = T_a + Q = 1.36$ MeV ignores the recoil of ${}^7$Be.' },
    { id: 'nrg-024', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'direct reactions',
      q: 'In a $(d, p)$ stripping reaction the neutron is captured into an orbit of angular momentum $\\ell$. The angular distribution of the protons',
      options: ['is isotropic whatever $\\ell$ is', 'peaks at $180^\\circ$ for all $\\ell$', 'is independent of the beam energy', 'has its main forward peak at a larger angle for larger $\\ell$, roughly where the momentum transfer satisfies $qR \\approx \\ell$'], answer: 3,
      sol: 'The transferred neutron must carry orbital angular momentum $\\ell\\hbar \\approx \\hbar qR$, with $q$ the momentum transfer. Since $q$ grows with angle, larger $\\ell$ pushes the first maximum to larger angles: $\\ell = 0$ peaks at $0^\\circ$. Butler theory uses this to read $\\ell$, and hence the parity and possible $j$ of single-particle states.',
      trap: 'Isotropy is the signature of compound reactions, not stripping.' },
    { id: 'nrg-025', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Breit-Wigner',
      q: 'A slow neutron (spin $\\tfrac12$) is captured by ${}^{235}$U ($I = \\tfrac72$) into a compound state with $J = 4$. The statistical spin factor $g = (2J + 1)/[(2s_a + 1)(2I + 1)]$ is',
      options: ['$9/16$', '$7/16$', '$1/2$', '$1$'], answer: 0,
      sol: 'Of the $(2s_a + 1)(2I + 1) = 2\\times8 = 16$ spin states of neutron plus target, $2J + 1 = 9$ have $J = 4$ (and 7 have $J = 3$). So $g = 9/16$ for a $J = 4$ resonance: the fraction of collisions with the right total spin.',
      trap: '$7/16$ belongs to $J = 3$.' },
    { id: 'nrg-026', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'kinematics',
      q: 'For $a + X \\to b + Y$ with $X$ at rest (non-relativistic), which statements are correct?',
      options: ['Momentum conservation means not all of the lab kinetic energy can be turned into rest mass', 'An endoergic reaction has threshold $T_{th} \\approx |Q|(1 + m_a/m_X)$', 'An exoergic neutron-induced reaction has a threshold energy', 'In the CM frame of a two-body final state, $b$ has a single energy at a given total energy'], answer: [0, 1, 3],
      sol: 'At threshold all products move with the CM velocity; the CM kinetic energy $T_a m_a/(m_a + m_X)$ is locked up. Setting $T_{cm} = |Q|$ gives the threshold. In the CM frame two-body kinematics fixes $|p_b|$. Exoergic neutron reactions have no threshold (charged particles can still face a Coulomb barrier, a different matter).',
      trap: 'A Coulomb barrier is not a kinematic threshold.' },
    { id: 'nrg-027', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'partial waves',
      q: 'For $10$ MeV neutrons on a nucleus with $A = 100$ ($R = 1.2A^{1/3}$ fm), the number $kR = R/\\lambda\\!\\!\\!^-$ that estimates the highest partial wave is about (neglect recoil; $m_nc^2 = 939.6$ MeV, $\\hbar c = 197.3$ MeV fm)',
      options: ['$0.4$', '$39$', '$1$', '$3.9$'], answer: 3,
      sol: '$pc = \\sqrt{2\\times939.6\\times10} = 137.1$ MeV, $\\lambda\\!\\!\\!^- = 197.3/137.1 = 1.44$ fm. $R = 1.2\\times4.642 = 5.57$ fm. $kR = 3.9$: partial waves up to $\\ell \\approx 3$ or 4 contribute.',
      trap: 'Using the full wavelength $2\\pi\\lambda\\!\\!\\!^-$ gives a number $2\\pi$ times smaller.' },
    { id: 'nrg-028', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Rutherford scattering',
      q: 'The Rutherford differential cross-section for alpha particles on gold at a fixed angle changes how, if the beam energy is doubled?',
      options: ['it doubles', 'it is unchanged', 'it falls to one quarter', 'it falls to one half'], answer: 2,
      sol: '$\\dfrac{d\\sigma}{d\\Omega} = \\left(\\dfrac{zZe^2}{4\\pi\\varepsilon_0\\,4T}\\right)^2\\dfrac{1}{\\sin^4(\\theta/2)}$, proportional to $1/T^2$. Doubling $T$ divides it by 4. (At high enough energy the alpha touches the nucleus and the formula fails: that is how nuclear size was first estimated.)',
      trap: 'The $1/\\sin^4$ angle dependence is fixed; the energy enters squared.' },

    // ---------- level 4 ----------
    { id: 'nrg-029', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'relativistic kinematics', unit: 'MeV',
      q: 'A proton of kinetic energy $1000$ MeV hits a proton at rest ($m_pc^2 = 938.27$ MeV). The kinetic energy available in the centre-of-mass frame, $\\sqrt s - 2m_pc^2$, is ______ MeV (to the nearest MeV).',
      answer: 447, tol: 1, calc: () => Math.sqrt(2 * 938.272 ** 2 + 2 * 938.272 * 1938.272) - 2 * 938.272,
      sol: '$s = (E_a + m_p)^2 - p_a^2 = 2m_p^2 + 2m_pE_a$ with $E_a = 1938.27$ MeV: $s = 1.7607\\times10^6 + 3.6373\\times10^6 = 5.398\\times10^6$ MeV$^2$. $\\sqrt s = 2323.4$ MeV, available $= 447$ MeV, less than half the beam energy. Colliders avoid this loss.',
      trap: 'The non-relativistic half ($500$ MeV) is too large: relativistically even less is available.' },
    { id: 'nrg-030', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'compound nucleus',
      q: 'Which observations point to a compound-nucleus mechanism?',
      options: ['Angular distributions symmetric about $90^\\circ$ in the CM frame', 'Strongly forward-peaked angular distributions', 'At moderate excitation, neutron emission is much more likely than proton emission, and the neutron spectra look like evaporation from a hot body', 'Narrow resonances in the cross-section at low energy'], answer: [0, 2, 3],
      sol: 'A long-lived compound state forgets the beam direction (symmetric about $90^\\circ$), boils off particles with Maxwellian spectra, favours neutrons because charged particles face the Coulomb barrier, and shows resonances (long lives mean narrow widths). Forward peaking signals direct reactions.',
      trap: 'Forward peaking means the reaction remembers the beam: direct, not compound.' },
    { id: 'nrg-031', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'Q equation', unit: 'keV',
      q: 'The reaction ${}^7\\text{Li}(p, n){}^7\\text{Be}$ ($Q = -1.644$ MeV) is run exactly at threshold. Using mass numbers, the neutrons all move forward with kinetic energy ______ keV (to one decimal place).',
      answer: 29.4, tol: 0.2, calc: () => 1.644 * 8 / 7 / 64 * 1000,
      sol: 'Threshold: $T_{th} = |Q|(m_a + m_X)/m_X = 1.644\\times8/7 = 1.879$ MeV. At threshold the products move together at the CM velocity, so $T_n = \\tfrac12m_nv_{cm}^2 = T_{th}\\dfrac{m_am_b}{(m_a + m_X)^2} = 1.879\\times\\dfrac{1}{64} = 0.0294$ MeV $= 29.4$ keV. This is a standard source of nearly monoenergetic keV neutrons.',
      trap: 'Expecting zero energy at threshold: the products still share the CM motion.' },
    { id: 'nrg-032', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'compound nucleus',
      q: 'As the excitation energy of a compound nucleus rises, its resonances',
      options: ['become narrower and more widely spaced', 'stay exactly the same', 'disappear below the neutron separation energy', 'become wider and closer together until they overlap and the cross-section becomes smooth'], answer: 3,
      sol: 'The level density grows roughly as $e^{2\\sqrt{aE}}$, so levels crowd together, while more open decay channels make each level wider. Once $\\Gamma$ exceeds the spacing $D$, individual resonances merge (Ericson fluctuations, then a smooth continuum).',
      trap: 'Below the neutron separation energy levels are bound and decay by gamma emission; they do not disappear.' },
    { id: 'nrg-033', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'Breit-Wigner', unit: '10³ b',
      q: 'A $5.0$ eV neutron resonance on a spin-0 target with $A = 100$ (so $g = 1$) has $\\Gamma_n = 2.0$ meV and $\\Gamma_\\gamma = 100$ meV ($\\Gamma = \\Gamma_n + \\Gamma_\\gamma$). Use the reduced mass ($m_nc^2 = 939.565$ MeV times $100/101$) for $\\lambda\\!\\!\\!^-$ and $\\hbar c = 197.327$ MeV fm. The peak capture cross-section is ______ $\\times10^3$ b (to one decimal place).',
      answer: 10.1, tol: 0.1, calc: () => { const lb = 197.327e6 / Math.sqrt(2 * 939.565e6 * 100 / 101 * 5); return Math.PI * lb * lb / 100 * 800 / 102 ** 2 / 1000; },
      sol: '$pc = \\sqrt{2\\mu c^2E} = \\sqrt{2\\times9.303\\times10^8\\times5.0}$ eV $= 9.645\\times10^4$ eV, so $\\lambda\\!\\!\\!^- = 197.327\\times10^6/9.645\\times10^4 = 2046$ fm and $\\pi\\lambda\\!\\!\\!^{-2} = 1.315\\times10^7$ fm$^2 = 1.315\\times10^5$ b. $4\\Gamma_n\\Gamma_\\gamma/\\Gamma^2 = 800/10404 = 0.0769$. $\\sigma_0 = 1.01\\times10^4$ b, ten thousand times the geometric size.',
      trap: 'Forgetting $\\Gamma^2$ in the denominator, or using $\\Gamma_n$ for the total width.' },
    { id: 'nrg-034', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'optical model',
      q: 'In the optical model of nuclear scattering, the nucleus is represented by a complex potential $V + iW$. The imaginary part $W$',
      options: ['represents the Coulomb potential', 'removes flux from the elastic channel, describing absorption into all non-elastic reactions', 'makes the nucleus transparent', 'is always zero for neutrons'], answer: 1,
      sol: 'With a complex potential the continuity equation gains a sink term $\\propto W|\\psi|^2$ (with $W < 0$ in the usual sign convention). The lost flux is the reaction cross-section; the real part refracts the wave. Like light in a cloudy crystal ball.',
      trap: 'An imaginary potential does not conserve probability in the elastic channel; that is the point.' },
    { id: 'nrg-035', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'radiative capture', unit: 'MeV',
      q: 'Protons of $2.00$ MeV are captured by deuterons at rest: $p + d \\to {}^3\\text{He} + \\gamma$. Atomic masses: ${}^1$H $1.007825$ u, ${}^2$H $2.014102$ u, ${}^3$He $3.016029$ u ($1$ u $= 931.494$ MeV$/c^2$). Neglecting the small recoil and Doppler corrections, the gamma energy is about ______ MeV (to two decimal places). Use mass numbers for the CM energy.',
      answer: 6.83, tol: 0.02, calc: () => (1.007825 + 2.014102 - 3.016029) * 931.494 + 2 * 2 / 3,
      sol: '$Q = (3.021927 - 3.016029)\\times931.494 = 5.494$ MeV. The CM kinetic energy $2.00\\times2/3 = 1.333$ MeV also goes into the excitation. $E_\\gamma \\approx Q + T_{cm} = 6.83$ MeV (recoil takes about 8 keV).',
      trap: 'Adding the full lab energy $2.00$ MeV instead of the CM energy.' },
    { id: 'nrg-036', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'kinematics',
      q: 'Radioactive-beam facilities often use inverse kinematics: a heavy beam on a light target (for example a $^{132}$Sn beam on deuterium). A consequence is that',
      options: ['the reaction products are focused into a narrow forward cone in the lab', 'the products move isotropically', 'the CM energy equals the beam energy', 'no reactions can occur'], answer: 0,
      sol: 'The CM moves almost at the beam velocity, so even products emitted backwards in the CM frame travel forwards in the lab. The heavy residue is confined to a small forward cone, which helps collect it; the light ejectile can come out at large lab angles. The CM energy is only $T_{beam}m_d/(m_d + m_{Sn})$.',
      trap: 'With a heavy beam the available CM energy is a small fraction of the beam energy.' },

    // ---------- level 5 ----------
    { id: 'nrg-037', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'Q equation', unit: 'MeV',
      q: 'The reaction ${}^3\\text{H}(p, n){}^3\\text{He}$ has $Q = -0.764$ MeV. For $3.00$ MeV protons, using mass numbers, the energy of neutrons emitted at $30^\\circ$ in the lab (higher root) is ______ MeV (to two decimal places).',
      answer: 1.98, tol: 0.02, calc: () => Tb(1, 3, 1, 3, -0.7638, 3, 30),
      sol: 'Quadratic in $x = \\sqrt{T_n}$: $(m_Y + m_b)x^2 - 2\\sqrt{m_am_bT_a}\\cos\\theta\\,x - [m_YQ + (m_Y - m_a)T_a] = 0$, i.e. $4x^2 - 2\\sqrt3\\times0.8660\\,x - (-2.291 + 6.000) = 0$: $4x^2 - 3.000x - 3.709 = 0$. $x = (3.000 + \\sqrt{9.000 + 59.34})/8 = 1.408$, $T_n = 1.98$ MeV.',
      trap: 'With equal masses the recoil is large; $T_a + Q$ overestimates the forward energy.' },
    { id: 'nrg-038', type: 'msq', level: 5, exams: ['gate', 'net'], sub: 'partial waves',
      q: 'For scattering of a spinless projectile by a short-range potential, which statements are correct?',
      options: ['The reaction (absorption) cross-section in partial wave $\\ell$ cannot exceed $\\pi\\lambda\\!\\!\\!^{-2}(2\\ell + 1)$', 'The elastic cross-section in partial wave $\\ell$ cannot exceed $4\\pi\\lambda\\!\\!\\!^{-2}(2\\ell + 1)$', 'For a black disc of radius $R \\gg \\lambda\\!\\!\\!^-$ the total cross-section is $2\\pi R^2$, half of it elastic (shadow) scattering', 'Absorption can be maximal in a partial wave while elastic scattering in that wave is zero'], answer: [0, 1, 2],
      sol: 'With $S_\\ell = \\eta_\\ell e^{2i\\delta_\\ell}$, $\\sigma_{el,\\ell} = \\pi\\lambda\\!\\!\\!^{-2}(2\\ell + 1)|1 - S_\\ell|^2 \\le 4\\pi\\lambda\\!\\!\\!^{-2}(2\\ell + 1)$ and $\\sigma_{r,\\ell} = \\pi\\lambda\\!\\!\\!^{-2}(2\\ell + 1)(1 - \\eta_\\ell^2) \\le \\pi\\lambda\\!\\!\\!^{-2}(2\\ell + 1)$. Full absorption ($\\eta = 0$) forces $\\sigma_{el,\\ell} = \\sigma_{r,\\ell}$, not zero: absorption always brings diffraction. Summing to $\\ell \\approx kR$ gives $\\pi R^2$ each, total $2\\pi R^2$.',
      trap: 'There is no absorption without elastic (shadow) scattering.' },
    { id: 'nrg-039', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'relativistic threshold', unit: 'MeV',
      q: 'Find the threshold photon energy for $\\gamma + p \\to \\pi^+ + n$ with the proton at rest ($m_pc^2 = 938.27$, $m_nc^2 = 939.57$, $m_{\\pi^+}c^2 = 139.57$ MeV), to one decimal place, in MeV.',
      answer: 151.4, tol: 0.2, calc: () => ((139.570 + 939.565) ** 2 - 938.272 ** 2) / (2 * 938.272),
      sol: 'For a photon on a proton at rest, $s = m_p^2 + 2m_pE_\\gamma$. At threshold $\\sqrt s = m_\\pi + m_n = 1079.14$ MeV, so $E_\\gamma = \\dfrac{1079.14^2 - 938.27^2}{2\\times938.27} = \\dfrac{1\\,164\\,532 - 880\\,354}{1876.54} = 151.4$ MeV.',
      trap: 'The answer is not $m_\\pi + m_n - m_p = 140.9$ MeV: the products must carry momentum.' },
    { id: 'nrg-040', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'CM and lab angles', unit: 'degrees',
      q: 'Alpha particles scatter elastically from ${}^{12}$C. An alpha scattered at $120^\\circ$ in the centre-of-mass frame appears in the lab at ______ degrees (to one decimal place). Use mass numbers and $\\tan\\theta_L = \\dfrac{\\sin\\theta_C}{\\cos\\theta_C + m_a/m_X}$.',
      answer: 100.9, tol: 0.1, calc: () => 180 + Math.atan(Math.sin(2 * Math.PI / 3) / (Math.cos(2 * Math.PI / 3) + 1 / 3)) * 180 / Math.PI,
      sol: '$\\tan\\theta_L = \\dfrac{0.8660}{-0.5000 + 0.3333} = -5.196$. The denominator is negative, so $\\theta_L$ lies in the second quadrant: $\\theta_L = 180^\\circ - 79.1^\\circ = 100.9^\\circ$.',
      trap: 'A calculator gives $-79.1^\\circ$; the angle must be put in the right quadrant.' },
    { id: 'nrg-041', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'reaction types',
      q: 'Which statements about common reaction types are correct?',
      options: ['${}^9\\text{Be}(\\alpha, n){}^{12}\\text{C}$ is used in Am-Be and Pu-Be neutron sources', '$(n, \\gamma)$ is radiative capture', '$(d, p)$ is a pickup reaction', '$(p, d)$ is a pickup reaction'], answer: [0, 1, 3],
      sol: 'Alpha emitters mixed with beryllium give neutrons via $(\\alpha, n)$ ($Q = 5.70$ MeV). In $(d, p)$ the deuteron leaves its neutron behind: stripping. In $(p, d)$ the proton picks up a neutron from the target: pickup. $(n, \\gamma)$ captures the neutron and emits photons.',
      trap: 'Stripping removes a nucleon from the projectile; pickup takes one from the target.' },
    { id: 'nrg-042', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'Q equation',
      q: 'Consider the non-relativistic Q equation $Q = T_b(1 + m_b/m_Y) - T_a(1 - m_a/m_Y) - (2/m_Y)\\sqrt{m_am_bT_aT_b}\\cos\\theta$. Which statements are correct?',
      options: ['At $\\theta = 90^\\circ$, $Q$ follows from $T_a$ and $T_b$ without the square-root term', 'For an exoergic reaction on a very heavy target, $T_b$ hardly changes with angle', 'For a given $T_a$, the most energetic $b$ particles (higher root) come out at $0^\\circ$', '$T_b$ does not depend on $T_a$'], answer: [0, 1, 2],
      sol: 'At $90^\\circ$, $\\cos\\theta = 0$. As $m_Y \\to \\infty$ the angle term $\\propto 1/m_Y$ vanishes and $T_b \\to T_a + Q$ at all angles. The positive root grows with $\\cos\\theta$, so it is largest forward. $T_b$ clearly depends on $T_a$.',
      trap: 'Recoil corrections shrink as the residual nucleus gets heavier.' },
    ...more2,
    ...r4.items,
  ],
  gens: [
    { id: 'nrg-g01', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Q value',
      make(r) {
        const x = choose(r, RX), Q = Qof(x), keys = [...new Set([x[0], x[1], x[2], x[3]].filter((k) => k !== 'g'))];
        return { q: `Mass excesses (MeV): ${keys.map((k) => `$${nl(k)}$ ${D[k][0].toFixed(3)}`).join(', ')}. The $Q$ value of $${rxs(x)}$ is ______ MeV (to two decimal places).`,
          answer: round(Q, 2), tol: 0.01, unit: 'MeV', x,
          sol: `With nucleon number balanced, $Q = \\Delta(${nl(x[0])}) + \\Delta(${nl(x[1])}) - \\Delta(${nl(x[2])}) - \\Delta(${nl(x[3])}) = ${D[x[0]][0].toFixed(3)} + ${D[x[1]][0].toFixed(3)} - ${D[x[2]][0].toFixed(3)} - ${D[x[3]][0].toFixed(3)} = ${round(Q, 2)}$ MeV (${Q > 0 ? 'exoergic' : 'endoergic'}).`,
          trap: 'Subtracting the wrong way round flips the sign of Q.' };
      },
      verify: (p) => Qof(p.x) },
    { id: 'nrg-g02', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'relativistic threshold',
      make(r) {
        const [eq, ini, fin] = choose(r, RELTH), M = fin.reduce((s, m) => s + m, 0), [ma, mX] = ini;
        const T = (M * M - ma * ma - mX * mX) / (2 * mX) - ma;
        return { q: `Find the threshold kinetic energy of the beam particle for $${eq}$ on a target at rest. Masses (MeV$/c^2$): ${[...new Set([...ini, ...fin])].filter((m) => m > 0).map((m) => m.toFixed(3)).join(', ')} (photon massless). $T_{th}$ = ______ MeV (to one decimal place).`,
          answer: round(T, 1), tol: Math.max(0.1, round(T * 0.002, 2)), unit: 'MeV', ini, fin,
          sol: `At threshold the products are at rest in the CM, so $\\sqrt s = \\sum m_f = ${round(M, 3)}$ MeV. For a fixed target $s = m_a^2 + m_X^2 + 2m_XE_a$, so $E_a = \\dfrac{s - m_a^2 - m_X^2}{2m_X} = ${round(T + ma, 2)}$ MeV and $T_{th} = E_a - m_a = ${round(T, 1)}$ MeV.`,
          trap: 'The threshold is not the mass difference; momentum must be conserved.' };
      },
      verify: (p) => { const M = p.fin.reduce((s, m) => s + m, 0); return (M * M - p.ini[0] ** 2 - p.ini[1] ** 2) / (2 * p.ini[1]) - p.ini[0]; } },
    { id: 'nrg-g03', type: 'nat', level: 1, exams: ['gate', 'net'], sub: 'centre of mass',
      make(r) {
        const a = choose(r, ['n', 'p', 'd', 'a']), A = int(r, 6, 240), T = pick(r, 1, 50, 0.5), ma = PART[a][1], E = T * A / (A + ma);
        return { q: `A $${T}$ MeV $${PART[a][2]}$ hits a nucleus of mass number $${A}$ at rest. Using mass numbers, the CM kinetic energy is ______ MeV (to two decimal places).`,
          answer: round(E, 2), tol: 0.01, unit: 'MeV', T, A, ma,
          sol: `$T_{cm} = T\\dfrac{m_X}{m_a + m_X} = ${T}\\times\\dfrac{${A}}{${A + ma}} = ${round(E, 2)}$ MeV.`,
          trap: 'Using $m_a/(m_a + m_X)$.' };
      },
      verify: (p) => p.T * p.A / (p.A + p.ma) },
    { id: 'nrg-g04', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Q equation',
      make(r) {
        const x = choose(r, RX.filter((y) => y[2] !== 'g')), Q = Qof(x), ma = Am(x[1]), mX = Am(x[0]), mb = Am(x[2]), mY = Am(x[3]);
        const thr = Q < 0 ? -Q * (ma + mX) / mX : 0, Ta = round(Math.max(thr * 1.5, 1) + pick(r, 0.5, 6, 0.1), 1);
        const Tbv = round(Tb(ma, mX, mb, mY, Q, Ta, 90), 3), Qc = Tbv * (1 + mb / mY) - Ta * (1 - ma / mY);
        return { q: `In $${rxs(x)}$, particles $${nl(x[1])}$ of $${Ta}$ MeV produce $${nl(x[2])}$ particles of $${Tbv}$ MeV at $90^\\circ$ in the lab. Using mass numbers, $Q$ = ______ MeV (to two decimal places).`,
          answer: round(Qc, 2), tol: 0.02, unit: 'MeV', Ta, Tbv, ma, mb, mY,
          sol: `At $90^\\circ$: $Q = T_b(1 + m_b/m_Y) - T_a(1 - m_a/m_Y) = ${Tbv}\\times${round(1 + mb / mY, 4)} - ${Ta}\\times${round(1 - ma / mY, 4)} = ${round(Qc, 2)}$ MeV.`,
          trap: 'Taking $Q = T_b - T_a$ ignores the recoil.' };
      },
      verify: (p) => p.Tbv * (1 + p.mb / p.mY) - p.Ta * (1 - p.ma / p.mY) },
    { id: 'nrg-g05', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'Q equation',
      make(r) {
        const x = choose(r, RX.filter((y) => y[2] !== 'g')), Q = round(Qof(x), 3), ma = Am(x[1]), mX = Am(x[0]), mb = Am(x[2]), mY = Am(x[3]);
        const thr = Q < 0 ? -Q * (ma + mX) / mX : 0, Ta = round(Math.max(thr * 1.6, 0.5) + pick(r, 0.5, 8, 0.5), 1), th = choose(r, [0, 30, 45, 60, 90, 120, 150]);
        const T = Tb(ma, mX, mb, mY, Q, Ta, th), c = Math.cos(th * Math.PI / 180);
        return { q: `The reaction $${rxs(x)}$ has $Q = ${Q}$ MeV. For $${Ta}$ MeV $${nl(x[1])}$ particles on targets at rest, find the kinetic energy of $${nl(x[2])}$ emitted at $${th}^\\circ$ in the lab (higher root of the Q equation; mass numbers for masses), in MeV to two decimal places.`,
          answer: round(T, 2), tol: Math.max(0.01, round(T * 0.003, 3)), unit: 'MeV', ma, mX, mb, mY, Q, Ta, th,
          sol: `Quadratic in $x = \\sqrt{T_b}$: $${mY + mb}x^2 - 2\\sqrt{${ma * mb}\\times${Ta}}\\,(${round(c, 4)})\\,x - [${mY}\\times(${Q}) + ${mY - ma}\\times${Ta}] = 0$. Higher root $x = ${round(Math.sqrt(T), 4)}$, so $T_b = ${round(T, 2)}$ MeV.`,
          trap: 'Forgetting the angle term, or taking the lower root.' };
      },
      verify: (p) => { const c = Math.cos(p.th * Math.PI / 180), A = 2 * Math.sqrt(p.ma * p.mb * p.Ta) * c, a = p.mY + p.mb, C = -(p.mY * p.Q + (p.mY - p.ma) * p.Ta); const x = (A + Math.sqrt(A * A - 4 * a * C)) / (2 * a); return x * x; } },
    { id: 'nrg-g06', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Breit-Wigner',
      make(r) {
        const s0 = pick(r, 100, 50000, 100), G = pick(r, 0.02, 0.5, 0.01), d = round(G * pick(r, 0.2, 3, 0.1), 3), s = s0 / (1 + 4 * d * d / (G * G));
        return { q: `A Breit-Wigner resonance has peak cross-section $${s0}$ b and full width $\\Gamma = ${G}$ eV. Ignoring other energy dependence, the cross-section $${d}$ eV from the peak is ______ b (to three significant figures).`,
          answer: +s.toPrecision(3), tol: +(s * 0.006).toPrecision(2), unit: 'b', s0, G, d,
          sol: `$\\sigma = \\dfrac{\\sigma_0}{1 + 4(E - E_R)^2/\\Gamma^2} = \\dfrac{${s0}}{1 + 4\\times${d}^2/${G}^2} = \\dfrac{${s0}}{${round(1 + 4 * d * d / (G * G), 4)}} = ${s.toPrecision(3)}$ b.`,
          trap: 'The half-maximum points are at $\\pm\\Gamma/2$, not $\\pm\\Gamma$.' };
      },
      verify: (p) => p.s0 / (1 + 4 * p.d * p.d / (p.G * p.G)) },
    { id: 'nrg-g07', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'reaction rates',
      make(r) {
        const I = pick(r, 0.1, 10, 0.1), zq = choose(r, [1, 1, 2]), rho = pick(r, 0.1, 5, 0.1), M = int(r, 6, 200), sig = pick(r, 1, 900, 1);
        const rate = I * 1e-6 / (zq * QE) * (rho * 1e-3 / M * NA) * sig * 1e-27;
        return { q: `A beam of ${zq === 1 ? 'singly' : 'doubly'} charged ions with electrical current $${I}\\ \\mu$A hits a thin target of areal density $${rho}$ mg/cm$^2$ (molar mass ${M} g/mol). The cross-section is $${sig}$ mb. The reaction rate is ______ $\\times10^6$ s$^{-1}$ (to three significant figures).`,
          answer: +(rate / 1e6).toPrecision(3), tol: +(rate / 1e6 * 0.006).toPrecision(2), I, zq, rho, M, sig,
          sol: `Ions per second $= I/(qe) = ${sci(I * 1e-6 / (zq * QE), 3)}$. Nuclei per cm$^2$ $= ${sci(rho * 1e-3 / M * NA, 3)}$. $\\sigma = ${sig}\\times10^{-27}$ cm$^2$. Rate $= ${sci(rate, 3)}$ s$^{-1}$.`,
          trap: zq === 2 ? 'A doubly charged ion carries $2e$, so the particle current is half the charge current.' : 'mb to cm$^2$ is $10^{-27}$.' };
      },
      verify: (p) => p.I * 1e-6 / (p.zq * QE) * (p.rho * 1e-3 / p.M * NA) * p.sig * 1e-27 / 1e6 },
    { id: 'nrg-g08', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'activation',
      make(r) {
        const R = pick(r, 1, 50, 0.5), th = pick(r, 1, 30, 0.5), ti = pick(r, 0.5, 60, 0.5), tw = pick(r, 0, 40, 0.5);
        const A = R * (1 - 0.5 ** (ti / th)) * 0.5 ** (tw / th);
        return { q: `Radioactive nuclei (half-life $${th}$ h) are produced at a constant rate of $${R}\\times10^6$ s$^{-1}$ for $${ti}$ h, then the target cools for $${tw}$ h. The activity then is ______ $\\times10^6$ Bq (to three significant figures).`,
          answer: +A.toPrecision(3), tol: +(A * 0.006).toPrecision(2), R, th, ti, tw,
          sol: `During irradiation $A = R(1 - 2^{-t_i/t_{1/2}}) = ${R}\\times${round(1 - 0.5 ** (ti / th), 4)}$; then it decays by $2^{-t_w/t_{1/2}} = ${round(0.5 ** (tw / th), 4)}$. $A = ${A.toPrecision(3)}\\times10^6$ Bq.`,
          trap: 'Using $R t_i$ (no decay during the irradiation).' };
      },
      verify: (p) => p.R * (1 - Math.exp(-Math.LN2 * p.ti / p.th)) * Math.exp(-Math.LN2 * p.tw / p.th) },
    { id: 'nrg-g09', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'partial waves',
      make(r) {
        const A = int(r, 10, 240), T = pick(r, 0.1, 30, 0.1), R = 1.2 * Math.cbrt(A), mu = MN * A / (A + 1), k = Math.sqrt(2 * mu * T) / HBARC;
        return { q: `Neutrons of $${T}$ MeV hit a nucleus with $A = ${A}$ ($R = 1.2A^{1/3}$ fm). Using the reduced mass ($m_nc^2 = 939.565$ MeV times $A/(A + 1)$) and $\\hbar c = 197.33$ MeV fm, $kR$ = ______ (to two decimal places).`,
          answer: round(k * R, 2), tol: Math.max(0.01, round(k * R * 0.004, 3)), A, T,
          sol: `$\\hbar ck = \\sqrt{2\\mu c^2T} = \\sqrt{2\\times${round(mu, 2)}\\times${T}} = ${round(k * HBARC, 3)}$ MeV, $k = ${round(k, 4)}$ fm$^{-1}$; $R = ${round(R, 3)}$ fm; $kR = ${round(k * R, 2)}$. Partial waves up to $\\ell \\approx ${Math.floor(k * R)}$ matter.`,
          trap: 'Mixing up $k$ with $2\\pi/\\lambda$ in a way that adds a factor $2\\pi$.' };
      },
      verify: (p) => Math.sqrt(2 * MN * p.A / (p.A + 1) * p.T) / HBARC * 1.2 * Math.cbrt(p.A) },
    { id: 'nrg-g10', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'notation',
      make(r) {
        const Z = int(r, 3, 30), A = 2 * Z + int(r, 0, 3), a = choose(r, ['n', 'p', 'd', 'a', 'h']), b = choose(r, ['n', 'p', 'd', 'a', 'g', 't'].filter((x) => x !== a));
        const Zy = Z + PART[a][0] - PART[b][0], Ay = A + PART[a][1] - PART[b][1];
        const lab = (z, aa) => `${'$'}{}^{${aa}}\\text{${SYM[z]}}$`;
        const o = mcqOptions(r, lab(Zy, Ay), [lab(Zy + 1, Ay), lab(Zy - 1, Ay), lab(Zy, Ay + 1), lab(Zy, Ay - 1), lab(Zy + 1, Ay + 1)]);
        return { q: `In the reaction $${'{}'}^{${A}}\\text{${SYM[Z]}}(${PART[a][2]}, ${PART[b][2]})X$, the product $X$ is`, ...o,
          sol: `Charge: $${Z} + ${PART[a][0]} = ${PART[b][0]} + Z_X$, so $Z_X = ${Zy}$ (${SYM[Zy]}). Nucleons: $${A} + ${PART[a][1]} = ${PART[b][1]} + A_X$, so $A_X = ${Ay}$.`,
          trap: 'Forgetting the projectile in the balance.', Z, A };
      } },
    { id: 'nrg-g11', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'relativistic kinematics',
      make(r) {
        const T = pick(r, 100, 5000, 50), tgt = choose(r, [['a proton', MP], ['a deuteron', 1875.613], ['an alpha particle', 3727.379]]), m = MP;
        const s = m * m + tgt[1] * tgt[1] + 2 * tgt[1] * (T + m), av = Math.sqrt(s) - m - tgt[1];
        return { q: `A proton of kinetic energy $${T}$ MeV hits ${tgt[0]} at rest (masses $${m}$ and $${tgt[1]}$ MeV$/c^2$). The kinetic energy available in the CM frame, $\\sqrt s - \\sum m$, is ______ MeV (to the nearest MeV).`,
          answer: Math.round(av), tol: 1, unit: 'MeV', T, M: tgt[1],
          sol: `$s = m_p^2 + M^2 + 2ME_p$ with $E_p = ${round(T + m, 3)}$ MeV: $s = ${sci(s, 5)}$ MeV$^2$, $\\sqrt s = ${round(Math.sqrt(s), 1)}$ MeV. Available: $${Math.round(av)}$ MeV, compared with the non-relativistic $${round(T * tgt[1] / (tgt[1] + m), 0)}$ MeV.`,
          trap: 'The non-relativistic formula overestimates the available energy at high $T$.' };
      },
      verify: (p) => Math.sqrt(MP * MP + p.M * p.M + 2 * p.M * (p.T + MP)) - MP - p.M },
    { id: 'nrg-g12', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'CM and lab angles',
      make(r) {
        const pr = choose(r, [['a proton', 1], ['a deuteron', 2], ['an alpha particle', 4]]), X = choose(r, [['${}^{12}$C', 12], ['${}^{16}$O', 16], ['${}^{4}$He', 4], ['${}^{40}$Ca', 40], ['${}^{6}$Li', 6]]), tc = choose(r, [30, 45, 60, 90, 120, 135, 150]);
        const g = pr[1] / X[1], t = tc * Math.PI / 180, L = Math.atan2(Math.sin(t), Math.cos(t) + g) * 180 / Math.PI;
        return { q: `${pr[0][0].toUpperCase() + pr[0].slice(1)} scatters elastically from ${X[0]} at rest, at $${tc}^\\circ$ in the CM frame. Using mass numbers and $\\tan\\theta_L = \\sin\\theta_C/(\\cos\\theta_C + m_a/m_X)$, the lab angle is ______ degrees (to one decimal place).`,
          answer: round(L, 1), tol: 0.1, unit: 'degrees', g, tc,
          sol: `$m_a/m_X = ${round(g, 4)}$. $\\tan\\theta_L = ${round(Math.sin(t), 4)}/(${round(Math.cos(t), 4)} + ${round(g, 4)})$. ${Math.cos(t) + g < 0 ? 'The denominator is negative, so the angle is in the second quadrant: ' : ''}$\\theta_L = ${round(L, 1)}^\\circ$.`,
          trap: 'Not placing the angle in the right quadrant when the denominator is negative.' };
      },
      verify: (p) => { const t = p.tc * Math.PI / 180, vx = Math.cos(t) + p.g, vy = Math.sin(t); return Math.acos(vx / Math.hypot(vx, vy)) * 180 / Math.PI; } },
    ...more,
    ...r4.gens,
  ],
};

// Tidy signs in generated text ("+ -3" -> "- 3", "1x" -> "x"); see _signs.js.
export default tidyPhys(topicBank, ["nrg-g01"]);
