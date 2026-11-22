// Conservation laws and symmetries (GATE / CSIR NET level): Noether's theorem, additive quantum numbers (Q, B, the
// lepton numbers, strangeness), which interaction drives a decay, isospin and its Clebsch-Gordan branching ratios,
// parity, charge conjugation, G-parity, J^PC of fermion-antifermion states, positronium, helicity and the pion
// decay ratio, the neutral kaon system (strangeness oscillation, CP violation) and the CPT theorem.
// Original questions for fibub.
import { pick, int, choose, mcqOptions, round, shuffle } from '../_util.js';
import more from './conservation-laws.more.gen.js';
import more2 from './conservation-laws.more2.gen.js';

const HBAR_MEVS = 6.582120e-22, CC = 2.99792458e8;
// name: [Q, B, Le, Lmu, Ltau, S]
const QN = {
  'p': [1, 1, 0, 0, 0, 0], 'n': [0, 1, 0, 0, 0, 0], '\\bar p': [-1, -1, 0, 0, 0, 0], '\\Lambda^0': [0, 1, 0, 0, 0, -1],
  '\\Sigma^+': [1, 1, 0, 0, 0, -1], '\\Sigma^-': [-1, 1, 0, 0, 0, -1], '\\Xi^-': [-1, 1, 0, 0, 0, -2], '\\Omega^-': [-1, 1, 0, 0, 0, -3],
  '\\pi^+': [1, 0, 0, 0, 0, 0], '\\pi^-': [-1, 0, 0, 0, 0, 0], '\\pi^0': [0, 0, 0, 0, 0, 0], 'K^+': [1, 0, 0, 0, 0, 1],
  'K^-': [-1, 0, 0, 0, 0, -1], 'K^0': [0, 0, 0, 0, 0, 1], '\\bar K^0': [0, 0, 0, 0, 0, -1], 'e^-': [-1, 0, 1, 0, 0, 0],
  'e^+': [1, 0, -1, 0, 0, 0], '\\mu^-': [-1, 0, 0, 1, 0, 0], '\\mu^+': [1, 0, 0, -1, 0, 0], '\\nu_e': [0, 0, 1, 0, 0, 0],
  '\\bar\\nu_e': [0, 0, -1, 0, 0, 0], '\\nu_\\mu': [0, 0, 0, 1, 0, 0], '\\bar\\nu_\\mu': [0, 0, 0, -1, 0, 0], '\\tau^-': [-1, 0, 0, 0, 1, 0],
  '\\nu_\\tau': [0, 0, 0, 0, 1, 0],
};
const QNAME = ['electric charge $Q$', 'baryon number $B$', 'electron lepton number $L_e$', 'muon lepton number $L_\\mu$', 'tau lepton number $L_\\tau$', 'strangeness $S$'];
const LAWS = { Q: 'electric charge', B: 'baryon number', L: 'total lepton number', F: 'the separate electron and muon lepton numbers (lepton flavour)', E: 'energy', P: 'linear momentum', S: 'strangeness' };
// process, violated law, other laws it also breaks (kept out of the wrong options)
const FORB = [
  ['n \\to p + e^- + \\nu_e', 'L', ['F'], 'Total lepton number goes from $0$ to $+2$: the partner of the electron must be an antineutrino.'],
  ['\\mu^- \\to e^- + \\gamma', 'F', [], 'Total $L$ is $1 \\to 1$, but $L_\\mu$ drops from 1 to 0 and $L_e$ rises from 0 to 1. Searches (MEG) put the branching ratio below $10^{-12}$.'],
  ['\\pi^+ \\to \\mu^+ + \\nu_e', 'F', [], 'Total $L = -1 + 1 = 0$ is fine, but $L_\\mu = -1$ and $L_e = +1$ after the decay. The real decay is $\\pi^+ \\to \\mu^+\\nu_\\mu$.'],
  ['\\pi^+ \\to \\mu^+ + \\bar\\nu_\\mu', 'L', ['F'], 'Both leptons carry $L_\\mu = -1$, so the total goes from $0$ to $-2$.'],
  ['\\Lambda^0 \\to p + K^-', 'E', [], 'Charge, baryon number and even strangeness ($-1 \\to 0 - 1$) balance, but $938 + 494 = 1432$ MeV exceeds the $\\Lambda$ mass of $1116$ MeV.'],
  ['n \\to p + \\pi^-', 'E', [], 'The products weigh $938.3 + 139.6 = 1077.9$ MeV, more than the neutron ($939.6$ MeV).'],
  ['p + p \\to p + \\Lambda^0 + K^0', 'Q', [], 'Strangeness balances ($-1 + 1$) and so does baryon number, but the charge falls from $+2$ to $+1$.'],
  ['\\pi^- + p \\to \\Lambda^0 + \\bar K^0', 'S', [], 'A strong process must conserve strangeness: $0 \\to -1 + (-1) = -2$. With $K^0$ ($S = +1$) in place of $\\bar K^0$ it is the classic associated production.'],
  ['p + \\bar p \\to n + n', 'B', [], 'Baryon number goes from $1 - 1 = 0$ to $2$.'],
  ['e^+ + e^- \\to \\gamma', 'P', [], 'In the centre-of-mass frame the pair has zero momentum, but a single photon always carries momentum $E/c$. At least two photons are needed.'],
  ['\\pi^- + p \\to K^- + p', 'S', [], 'Charge balances, but strangeness goes from $0$ to $-1$ in what would be a strong reaction.'],
  ['p \\to n + e^+ + \\nu_e', 'E', [], 'Lepton numbers balance ($-1 + 1$), but a free proton is lighter than a neutron, so it cannot decay this way. Inside some nuclei it can, because the binding energies pay.'],
  ['\\Sigma^+ \\to n + \\pi^0', 'Q', ['S'], 'The charge falls from $+1$ to $0$. The real decays are $\\Sigma^+ \\to n\\pi^+$ and $p\\pi^0$.'],
  ['K^+ \\to \\pi^+ + \\pi^0 + \\pi^0 + \\pi^0', 'E', [], 'Four pions weigh $139.6 + 3\\times135.0 = 544.6$ MeV, more than the kaon ($493.7$ MeV).'],
  ['\\nu_e + p \\to n + e^+', 'L', ['F'], 'Lepton number goes from $+1$ to $-1$. With an antineutrino it is inverse beta decay, the reaction that first detected neutrinos.'],
  ['\\Lambda^0 \\to \\pi^+ + \\pi^-', 'B', ['S'], 'Baryon number goes from $1$ to $0$: the lightest baryon (the proton) must appear among the products of any baryon decay.'],
];
const ALLOWED = ['n \\to p + e^- + \\bar\\nu_e', '\\pi^+ \\to \\mu^+ + \\nu_\\mu', '\\mu^- \\to e^- + \\bar\\nu_e + \\nu_\\mu', '\\Lambda^0 \\to p + \\pi^-', '\\pi^- + p \\to K^0 + \\Lambda^0', '\\bar\\nu_e + p \\to n + e^+', 'K^- + p \\to \\Omega^- + K^+ + K^0', '\\pi^0 \\to \\gamma + \\gamma', '\\Sigma^0 \\to \\Lambda^0 + \\gamma', 'K^+ \\to \\pi^+ + \\pi^0'];
// decay, mean life (s, TeX), interaction
const LIFE = [
  ['\\Delta^{++} \\to p\\,\\pi^+', '5.6\\times10^{-24}', 'strong'], ['\\rho^0 \\to \\pi^+\\pi^-', '4.4\\times10^{-24}', 'strong'], ['K^{*}(892) \\to K\\pi', '1.3\\times10^{-23}', 'strong'],
  ['\\Sigma(1385) \\to \\Lambda\\pi', '1.8\\times10^{-23}', 'strong'], ['\\Sigma^0 \\to \\Lambda^0\\gamma', '7.4\\times10^{-20}', 'electromagnetic'], ['\\pi^0 \\to \\gamma\\gamma', '8.5\\times10^{-17}', 'electromagnetic'],
  ['\\eta \\to \\gamma\\gamma', '5.0\\times10^{-19}', 'electromagnetic'], ['\\Lambda^0 \\to p\\,\\pi^-', '2.6\\times10^{-10}', 'weak'], ['K^+ \\to \\mu^+\\nu_\\mu', '1.24\\times10^{-8}', 'weak'],
  ['\\pi^+ \\to \\mu^+\\nu_\\mu', '2.6\\times10^{-8}', 'weak'], ['n \\to p\\,e^-\\bar\\nu_e', '879 \\text{ (seconds)}', 'weak'], ['\\Omega^- \\to \\Lambda^0 K^-', '8.2\\times10^{-11}', 'weak'],
  ['\\mu^- \\to e^-\\bar\\nu_e\\nu_\\mu', '2.2\\times10^{-6}', 'weak'], ['\\Xi^0 \\to \\Lambda^0\\pi^0', '2.9\\times10^{-10}', 'weak'],
];
const WHY = { strong: 'Strong decays take about $10^{-23}$ s, the time light needs to cross a hadron.', electromagnetic: 'Electromagnetic decays (a photon in the final state, flavour unchanged) take $10^{-20}$ to $10^{-16}$ s.', weak: 'Weak decays (flavour changes, neutrinos) take $10^{-13}$ s or longer.' };
// isospin branching: parent, channel A, channel B, Gamma_A/Gamma_B, reason
const ISO = [
  ['\\Delta^+', 'p\\,\\pi^0', 'n\\,\\pi^+', 2, '$|\\tfrac32, \\tfrac12\\rangle = \\sqrt{\\tfrac23}\\,|1, 0\\rangle|\\tfrac12, \\tfrac12\\rangle + \\sqrt{\\tfrac13}\\,|1, 1\\rangle|\\tfrac12, -\\tfrac12\\rangle$'],
  ['\\Delta^0', 'n\\,\\pi^0', 'p\\,\\pi^-', 2, '$|\\tfrac32, -\\tfrac12\\rangle = \\sqrt{\\tfrac23}\\,|1, 0\\rangle|\\tfrac12, -\\tfrac12\\rangle + \\sqrt{\\tfrac13}\\,|1, -1\\rangle|\\tfrac12, \\tfrac12\\rangle$'],
  ['K^{*+}', 'K^0\\pi^+', 'K^+\\pi^0', 2, '$|\\tfrac12, \\tfrac12\\rangle = \\sqrt{\\tfrac23}\\,|1, 1\\rangle|\\tfrac12, -\\tfrac12\\rangle - \\sqrt{\\tfrac13}\\,|1, 0\\rangle|\\tfrac12, \\tfrac12\\rangle$'],
  ['K^{*0}', 'K^+\\pi^-', 'K^0\\pi^0', 2, '$|\\tfrac12, -\\tfrac12\\rangle = \\sqrt{\\tfrac13}\\,|1, 0\\rangle|\\tfrac12, -\\tfrac12\\rangle - \\sqrt{\\tfrac23}\\,|1, -1\\rangle|\\tfrac12, \\tfrac12\\rangle$'],
  ['\\Sigma^{*+}', '\\Sigma^+\\pi^0', '\\Sigma^0\\pi^+', 1, '$|1, 1\\rangle = \\tfrac{1}{\\sqrt2}(|1, 1\\rangle|1, 0\\rangle - |1, 0\\rangle|1, 1\\rangle)$ for the $\\Sigma\\pi$ part'],
];
// long-lived particles: name, mass (MeV), mean life (s)
const LONG = [['K^0_S', 497.611, 8.954e-11], ['K^0_L', 497.611, 5.116e-8], ['\\Lambda^0', 1115.683, 2.632e-10], ['\\Xi^-', 1321.71, 1.639e-10], ['\\Omega^-', 1672.45, 8.21e-11], ['\\pi^+', 139.570, 2.6033e-8], ['K^+', 493.677, 1.238e-8], ['\\Sigma^+', 1189.37, 8.018e-11]];
// missing particle: process with ?, answer, wrongs, reason
const MISS = [
  ['n \\to p + e^- + {?}', '\\bar\\nu_e', ['\\nu_e', '\\bar\\nu_\\mu', '\\gamma'], 'The electron brings $L_e = +1$, so an electron antineutrino ($L_e = -1$) must balance it.'],
  ['\\mu^- \\to e^- + \\bar\\nu_e + {?}', '\\nu_\\mu', ['\\bar\\nu_\\mu', '\\nu_e', '\\gamma'], '$L_\\mu = 1$ before, so a muon neutrino must carry it away; $e^-\\bar\\nu_e$ has $L_e = 0$.'],
  ['\\pi^- \\to \\mu^- + {?}', '\\bar\\nu_\\mu', ['\\nu_\\mu', '\\bar\\nu_e', '\\nu_e'], 'The $\\mu^-$ has $L_\\mu = +1$; a muon antineutrino brings the total back to 0.'],
  ['\\tau^- \\to \\pi^- + {?}', '\\nu_\\tau', ['\\bar\\nu_\\tau', '\\nu_\\mu', '\\bar\\nu_e'], 'The $\\tau^-$ has $L_\\tau = +1$, and the pion none, so a tau neutrino must appear.'],
  ['\\bar\\nu_e + p \\to n + {?}', 'e^+', ['e^-', '\\mu^+', '\\pi^+'], 'Charge $+1$ and $L_e = -1$ must come out: a positron. A $\\pi^+$ balances charge but not lepton number.'],
  ['\\nu_\\mu + n \\to p + {?}', '\\mu^-', ['e^-', '\\mu^+', '\\pi^-'], 'Charge $-1$ and $L_\\mu = +1$ are needed: a $\\mu^-$.'],
  ['\\pi^- + p \\to K^0 + {?}', '\\Lambda^0', ['n', '\\Sigma^+', '\\bar\\Lambda^0'], 'Charge 0, baryon number 1 and strangeness $-1$ (to cancel the $K^0$): a $\\Lambda^0$ (a $\\Sigma^0$ would also do).'],
  ['K^- + p \\to \\Omega^- + K^+ + {?}', 'K^0', ['\\bar K^0', 'K^-', '\\pi^0'], 'Strangeness $-1$ before; $\\Omega^-K^+$ gives $-3 + 1 = -2$, so a neutral particle with $S = +1$ is needed: $K^0$. This is how the $\\Omega^-$ was found in 1964.'],
  ['p + p \\to p + n + {?}', '\\pi^+', ['\\pi^-', '\\pi^0', 'K^+'], 'Charge $+2$ must be kept, with no strangeness: a $\\pi^+$.'],
  ['e^+ + e^- \\to \\mu^+ + {?}', '\\mu^-', ['e^-', '\\tau^-', '\\pi^-'], 'Charge $-1$ and $L_\\mu = +1$: a $\\mu^-$.'],
  ['\\Sigma^- \\to n + {?}', '\\pi^-', ['\\pi^+', '\\pi^0', 'K^-'], 'Charge $-1$ is needed. A $K^-$ balances charge and strangeness but is too heavy ($1197 < 940 + 494$ MeV).'],
  ['\\Xi^0 \\to \\Lambda^0 + {?}', '\\pi^0', ['\\pi^+', '\\pi^-', 'K^0'], 'A neutral product is needed, and a $K^0$ is too heavy ($1315 < 1116 + 498$ MeV).'],
];
const KS = { tS: 8.954e-11, tL: 5.116e-8, dm: 3.484e-12 };
const pmK = (t) => { const a = Math.exp(-t / KS.tS), b = Math.exp(-t / KS.tL), c = Math.exp(-t * (1 / KS.tS + 1 / KS.tL) / 2) * Math.cos(KS.dm * t / HBAR_MEVS); return { same: (a + b + 2 * c) / 4, flip: (a + b - 2 * c) / 4 }; };
const sgn = (x) => (x > 0 ? '+' : '-');

export default {
  topic: 'conservation-laws',
  items: [
    // ---------- level 1 ----------
    { id: 'cnl-001', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'Noether',
      q: 'By Noether\'s theorem, the laws of physics being the same at all times (invariance under time translation) leads to conservation of',
      options: ['linear momentum', 'energy', 'angular momentum', 'electric charge'], answer: 1,
      sol: 'Each continuous symmetry of the action gives a conserved quantity. Time translation gives energy, space translation linear momentum, rotation angular momentum, and the global phase symmetry of a charged field gives electric charge.',
      trap: 'Momentum comes from translation in space, not in time.' },
    { id: 'cnl-002', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'allowed or forbidden',
      q: 'The decay $p \\to e^+ + \\gamma$ has never been seen. Of these laws, the one it breaks is conservation of',
      options: ['electric charge', 'energy', 'angular momentum', 'baryon number'], answer: 3,
      sol: 'Charge: $+1 \\to +1$. Energy: the proton is far heavier than a positron. Angular momentum: spin $\\tfrac12$ can come from $\\tfrac12 \\oplus 1$. Baryon number: $1 \\to 0$. (It also breaks lepton number.) Proton lifetime limits exceed $10^{34}$ years.',
      trap: 'Checking only charge and energy makes the decay look allowed.' },
    { id: 'cnl-003', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'lepton number',
      q: 'In free neutron decay $n \\to p + e^- + X$, the particle $X$ is',
      options: ['an electron neutrino', 'a photon', 'an electron antineutrino', 'a muon antineutrino'], answer: 2,
      sol: 'The electron carries $L_e = +1$. To keep $L_e = 0$, $X$ must have $L_e = -1$: an electron antineutrino. It also carries away the spin needed for angular momentum and gives the continuous electron spectrum.',
      trap: 'An electron neutrino would make $L_e = 2$.' },
    { id: 'cnl-004', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'which interaction',
      q: 'Strangeness is conserved by',
      options: ['the strong and electromagnetic interactions, but not the weak', 'all interactions', 'only the weak interaction', 'only the strong interaction'], answer: 0,
      sol: 'Only the weak charged current changes quark flavour, so strangeness is conserved in strong and electromagnetic processes and changes by $0$ or $\\pm1$ in weak decays. That is why the lightest strange particles live about $10^{-10}$ s.',
      trap: 'Electromagnetic processes cannot change flavour either.' },
    { id: 'cnl-005', type: 'nat', level: 1, exams: ['jam', 'gate', 'net'], sub: 'baryon number',
      q: 'Antiprotons are made in $p + p \\to p + p + p + \\bar p$. The total baryon number of the final state is ______.',
      answer: 2, tol: 0, calc: () => 1 + 1 + 1 - 1,
      sol: 'Three protons ($+1$ each) and one antiproton ($-1$): $3 - 1 = 2$, the same as the two incoming protons. That is why the antiproton has to be made together with an extra proton.',
      trap: 'Counting the antiproton as $+1$ gives 4.' },
    { id: 'cnl-006', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'parity',
      q: 'The intrinsic parity of the pion is',
      options: ['$+1$', '$-1$', '$0$', 'not defined, because the pion has no spin'], answer: 1,
      sol: 'The pion is a pseudoscalar ($J^P = 0^-$). For a $q\\bar q$ pair $P = (-1)^{L+1}$, and with $L = 0$ this gives $-1$. Experimentally it follows from $\\pi^- d \\to nn$.',
      trap: 'Spin 0 does not mean parity $+1$: scalars and pseudoscalars both have spin 0.' },
    // ---------- level 2 ----------
    { id: 'cnl-007', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'lepton number',
      q: 'The decay $\\mu^- \\to e^- + \\gamma$ conserves charge, energy and total lepton number, yet it is not seen. It breaks',
      options: ['baryon number', 'angular momentum', 'parity only', 'separate conservation of $L_e$ and $L_\\mu$'], answer: 3,
      sol: 'Before: $L_\\mu = 1$, $L_e = 0$. After: $L_\\mu = 0$, $L_e = 1$. Each lepton flavour is conserved separately in the Standard Model with massless neutrinos; neutrino mixing allows the decay only at a rate around $10^{-54}$, far below the limit of about $10^{-13}$.',
      trap: 'Total lepton number is conserved here; only the flavours change.' },
    { id: 'cnl-008', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'Noether',
      q: 'For a particle moving in a central potential $V(r)$, the conserved quantity that follows from the symmetry of the problem is',
      options: ['angular momentum', 'linear momentum', 'the Runge-Lenz vector, in every central potential', 'the kinetic energy'], answer: 0,
      sol: 'A central potential is unchanged by any rotation about the centre, so angular momentum is conserved. Linear momentum is not, since the potential picks out a point. The Runge-Lenz vector is conserved only for $V \\propto 1/r$ (and the oscillator has its own extra symmetry).',
      trap: 'The Runge-Lenz vector comes from a hidden symmetry of the $1/r$ potential only.' },
    { id: 'cnl-009', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'which interaction',
      q: 'Which quantities are conserved by all three interactions (strong, electromagnetic and weak), as far as experiments show?',
      options: ['Electric charge', 'Baryon number', 'Strangeness', 'Parity'], answer: [0, 1],
      sol: 'Charge is exactly conserved; baryon number has never been seen to change (proton lifetime above $10^{34}$ years). Strangeness changes in weak decays ($\\Lambda \\to p\\pi^-$), and parity is violated by the weak force (Wu experiment, 1957).',
      trap: 'Parity is conserved by strong and electromagnetic forces only.' },
    { id: 'cnl-010', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'isospin',
      q: 'The $\\Delta(1232)$ resonances form an isospin multiplet with $I = \\tfrac32$. The number of charge states in the multiplet is ______.',
      answer: 4, tol: 0, calc: () => 2 * 1.5 + 1,
      sol: '$2I + 1 = 4$: $\\Delta^{++}$, $\\Delta^+$, $\\Delta^0$, $\\Delta^-$ ($I_3 = +\\tfrac32$ to $-\\tfrac32$).',
      trap: 'Counting only $\\Delta^{++}$, $\\Delta^+$ and $\\Delta^0$ misses the $ddd$ state.' },
    { id: 'cnl-011', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'which interaction',
      q: 'The decay $\\Sigma^0 \\to \\Lambda^0 + \\gamma$, with mean life about $7\\times10^{-20}$ s, proceeds by the',
      options: ['strong interaction', 'weak interaction', 'electromagnetic interaction', 'gravitational interaction'], answer: 2,
      sol: 'A photon is emitted and flavour is unchanged ($uds \\to uds$). The strong decay $\\Sigma^0 \\to \\Lambda\\pi^0$ is closed (77 MeV mass difference, less than $m_\\pi$), so the electromagnetic one wins, with a lifetime in the electromagnetic range.',
      trap: 'Strangeness is unchanged here, so this is no weak decay.' },
    { id: 'cnl-012', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'which interaction',
      q: 'The decay $K^+ \\to \\mu^+ + \\nu_\\mu$ proceeds by the',
      options: ['weak interaction', 'electromagnetic interaction', 'strong interaction', 'strong interaction, with a neutrino from the vacuum'], answer: 0,
      sol: 'A neutrino appears and strangeness changes from $+1$ to $0$: only the weak force does both. The mean life, $1.24\\times10^{-8}$ s, is typical of weak decays.',
      trap: 'Any process with a neutrino is weak.' },
    { id: 'cnl-013', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'charge conjugation',
      q: 'The $\\pi^0$ decays to $\\gamma\\gamma$ but never to $\\gamma\\gamma\\gamma$. The law that forbids three photons is conservation of',
      options: ['charge conjugation parity $C$', 'parity $P$', 'angular momentum', 'energy'], answer: 0,
      sol: 'The photon has $C = -1$, so $n$ photons have $C = (-1)^n$. The $\\pi^0$ has $C = +1$ (it decays to two photons), and electromagnetism conserves $C$, so an odd number of photons is forbidden.',
      trap: 'Energy and angular momentum allow three photons; only $C$ stops it.' },
    { id: 'cnl-014', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'allowed or forbidden',
      q: 'Which of these reactions are allowed?',
      options: ['$\\bar\\nu_e + p \\to n + e^+$', '$\\nu_e + p \\to n + e^+$', '$\\pi^- + p \\to K^0 + \\Lambda^0$', '$\\pi^- + p \\to K^- + p$'], answer: [0, 2],
      sol: '(a) Inverse beta decay: $Q$, $B$ and $L_e$ ($-1 \\to -1$) balance. (b) $L_e$: $+1 \\to -1$, forbidden. (c) Associated production: $S$: $0 \\to +1 - 1 = 0$, a strong process. (d) Charge balances but $S$: $0 \\to -1$, forbidden for a strong reaction.',
      trap: 'A strange particle can be made in a strong reaction only together with an antistrange one.' },
    { id: 'cnl-015', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'strangeness',
      q: 'In the weak decay $\\Omega^- \\to \\Xi^0 + \\pi^-$, the change in strangeness $\\Delta S = S_{\\text{final}} - S_{\\text{initial}}$ is ______.',
      answer: 1, tol: 0, calc: () => -2 - (-3),
      sol: '$\\Omega^- = sss$ has $S = -3$, $\\Xi^0 = uss$ has $S = -2$, the pion 0. $\\Delta S = -2 - (-3) = +1$: one $s$ quark turned into a $u$ quark by the weak force.',
      trap: 'Strangeness is minus the number of $s$ quarks, so losing an $s$ raises $S$.' },
    { id: 'cnl-016', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'helicity',
      q: 'Neutrinos produced in weak interactions are found to have helicity',
      options: ['$+\\tfrac12$ (right-handed)', '$-\\tfrac12$ (left-handed)', 'either sign with equal probability', '$0$'], answer: 1,
      sol: 'The weak charged current couples only to left-handed fermions ($V - A$). Massless neutrinos are therefore left-handed and antineutrinos right-handed (Goldhaber experiment, 1958). This is maximal parity violation.',
      trap: 'Equal helicities would mean parity is conserved.' },
    // ---------- level 3 ----------
    { id: 'cnl-017', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'G-parity',
      q: 'The $\\omega(782)$ ($G = -1$) decays mostly to $\\pi^+\\pi^-\\pi^0$ and hardly to $\\pi^+\\pi^-$, although two pions have more phase space. The reason is',
      options: ['charge conservation', 'energy conservation', 'G-parity: a state of $n$ pions has $G = (-1)^n$, conserved by strong decays', 'strangeness conservation'], answer: 2,
      sol: '$G = C\\,e^{i\\pi I_2}$ is conserved by the strong force, and each pion has $G = -1$. With $G = -1$, the $\\omega$ needs an odd number of pions. Its small $\\pi^+\\pi^-$ branch (1.5%) is electromagnetic, through $\\rho$-$\\omega$ mixing.',
      trap: 'Charge and energy allow both modes; G-parity tells them apart.' },
    { id: 'cnl-018', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'G-parity',
      q: 'The G-parity of a state of five pions is ______ (enter $+1$ or $-1$).',
      answer: -1, tol: 0, calc: () => (-1) ** 5,
      sol: 'G-parity is multiplicative and every pion has $G = -1$, so $G = (-1)^5 = -1$.',
      trap: 'Adding G-parities instead of multiplying them.' },
    { id: 'cnl-019', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'positronium',
      q: 'Orthopositronium (the $^3S_1$ state of $e^+e^-$) annihilates mainly into',
      options: ['one photon', 'two photons', 'three photons', 'a neutrino pair'], answer: 2,
      sol: 'For a fermion-antifermion pair $C = (-1)^{L+S}$. With $L = 0$, $S = 1$: $C = -1$, so it needs an odd number of photons. One photon cannot conserve momentum, so three. Its lifetime (142 ns) is much longer than parapositronium (125 ps, two photons).',
      trap: 'Using $C = (-1)^L$ alone, which ignores the spin.' },
    { id: 'cnl-020', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'positronium',
      q: 'Parapositronium is the $^1S_0$ state of $e^+e^-$. Its charge conjugation parity $C$ is ______ (enter $+1$ or $-1$).',
      answer: 1, tol: 0, calc: () => (-1) ** (0 + 0),
      sol: '$C = (-1)^{L+S} = (-1)^{0+0} = +1$. That is why it decays to an even number of photons (two), like the $\\pi^0$.',
      trap: 'The sign comes from exchanging the two particles: $(-1)^L$ for space, $(-1)^{S+1}$ for spin, and $-1$ for fermion exchange.' },
    { id: 'cnl-021', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'parity',
      q: 'The $\\rho^0$ (spin 1) decays to $\\pi^+\\pi^-$. The parity of the $\\rho^0$ must be',
      options: ['$-1$', '$+1$', '$0$', 'not determined by this decay'], answer: 0,
      sol: 'Angular momentum: the two spinless pions must be in $L = 1$. Parity: $P = P_\\pi^2(-1)^L = (+1)(-1) = -1$. The strong decay conserves parity, so the $\\rho$ has $J^P = 1^-$.',
      trap: 'The two pion parities multiply to $+1$, so the sign comes only from $L$.' },
    { id: 'cnl-022', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'weak interaction',
      q: 'Which statements about the weak interaction are correct?',
      options: ['It violates parity maximally', 'It violates charge conjugation $C$', 'It conserves strangeness', 'It conserves $CPT$'], answer: [0, 1, 3],
      sol: 'Only left-handed neutrinos and right-handed antineutrinos take part: $P$ and $C$ are each violated maximally, while $CP$ holds almost exactly (broken at the $10^{-3}$ level in kaons). Strangeness changes in weak decays. $CPT$ holds for any local Lorentz-invariant quantum field theory.',
      trap: 'Strangeness-changing decays like $\\Lambda \\to p\\pi^-$ are weak.' },
    { id: 'cnl-023', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'parity',
      q: 'In the 1950s two particles, $\\tau^+ \\to \\pi^+\\pi^+\\pi^-$ and $\\theta^+ \\to \\pi^+\\pi^0$, were found to have the same mass and lifetime. This puzzle was resolved by realising that',
      options: ['they are different particles with equal masses by chance', 'the weak interaction does not conserve parity, so one particle (the $K^+$) can decay into final states of both parities', 'the three-pion state has positive parity', 'pions have positive intrinsic parity'], answer: 1,
      sol: 'For a spin-0 parent, two pions have $P = +1$ and three pions $P = -1$. One particle decaying to both means parity is not conserved in its decay. Lee and Yang proposed this in 1956, and Wu confirmed it in $^{60}$Co beta decay.',
      trap: 'The resolution was a new symmetry breaking, not a new particle.' },
    { id: 'cnl-024', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'isospin',
      q: 'Use isospin to predict the branching ratio $\\Gamma(\\Delta^+ \\to p\\,\\pi^0)/\\Gamma(\\Delta^+ \\to n\\,\\pi^+)$. The ratio is ______.',
      answer: 2, tol: 0.01, calc: () => (2 / 3) / (1 / 3),
      sol: 'The $\\Delta^+$ is $|\\tfrac32, \\tfrac12\\rangle$. In terms of pion and nucleon states, $|\\tfrac32, \\tfrac12\\rangle = \\sqrt{\\tfrac23}\\,|\\pi^0 p\\rangle + \\sqrt{\\tfrac13}\\,|\\pi^+ n\\rangle$. Rates go as the squares: $\\tfrac23 : \\tfrac13 = 2$.',
      trap: 'Using the amplitudes instead of their squares gives $\\sqrt2$.' },
    { id: 'cnl-025', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'isospin',
      q: 'At the $\\Delta(1232)$ peak only the $I = \\tfrac32$ amplitude matters. The ratio of cross-sections $\\sigma(\\pi^+ p \\to \\pi^+ p)/\\sigma(\\pi^- p \\to \\pi^0 n)$ is ______ (to one decimal place).',
      answer: 4.5, tol: 0.05, calc: () => 1 / (2 / 9),
      sol: '$\\pi^+ p = |\\tfrac32, \\tfrac32\\rangle$, amplitude 1. $\\pi^- p = \\sqrt{\\tfrac13}|\\tfrac32\\rangle - \\sqrt{\\tfrac23}|\\tfrac12\\rangle$ and $\\pi^0 n = \\sqrt{\\tfrac23}|\\tfrac32\\rangle + \\sqrt{\\tfrac13}|\\tfrac12\\rangle$, so the $I = \\tfrac32$ part of $\\pi^-p \\to \\pi^0 n$ is $\\sqrt{\\tfrac13}\\sqrt{\\tfrac23} = \\tfrac{\\sqrt2}{3}$, squared $\\tfrac29$. Ratio $1 : \\tfrac29 = 4.5$ (the full pattern is $9 : 1 : 2$ for $\\pi^+p$ elastic, $\\pi^-p$ elastic and charge exchange).',
      trap: 'Forgetting that $\\pi^- p$ is only partly $I = \\tfrac32$.' },
    { id: 'cnl-026', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'isospin',
      q: 'Which quantity is conserved by the strong interaction but broken by the electromagnetic interaction?',
      options: ['electric charge', 'strangeness', 'parity', 'total isospin $I$'], answer: 3,
      sol: 'Electromagnetism couples to charge $Q = I_3 + Y/2$, which treats $u$ and $d$ differently, so it breaks isospin (it still conserves $I_3$). Strangeness, parity and charge are conserved by both forces. Example: $\\Sigma^0 \\to \\Lambda\\gamma$ has $\\Delta I = 1$.',
      trap: '$I_3$ is still conserved by electromagnetism; it is the total $I$ that changes.' },
    { id: 'cnl-027', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'CPT',
      q: 'Which of these follow from the $CPT$ theorem?',
      options: ['A particle and its antiparticle have equal masses', 'A particle and its antiparticle have equal total lifetimes', 'Their magnetic moments are equal in size and opposite in sign', 'Every partial decay rate of a particle equals that of its antiparticle into the conjugate channel'], answer: [0, 1, 2],
      sol: '$CPT$ fixes masses, total widths and the sizes of moments to be equal. Partial rates into a channel and its conjugate can differ when $CP$ is violated (as in $K^0_L \\to \\pi^- e^+\\nu$ against $\\pi^+ e^-\\bar\\nu$, which differ by 0.3%), as long as the totals match.',
      trap: 'Equal partial rates need $CP$, not just $CPT$.' },
    { id: 'cnl-028', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'allowed or forbidden',
      q: 'Which of these decays are forbidden in the Standard Model?',
      options: ['$K^+ \\to \\pi^+ + \\pi^0$', '$\\mu^+ \\to e^+ + \\nu_e + \\bar\\nu_\\mu$', '$\\mu^+ \\to e^+ + \\gamma$', '$p \\to \\pi^0 + e^+$'], answer: [2, 3],
      sol: '(a) A weak decay with $\\Delta S = -1$, 21% of $K^+$ decays. (b) The normal muon decay: $L_\\mu = -1$ goes to $\\bar\\nu_\\mu$, and $e^+\\nu_e$ has $L_e = 0$. (c) Breaks the separate lepton numbers. (d) Breaks baryon number (and lepton number); grand unified theories predict it, but it has never been seen.',
      trap: 'In (b) the positron and electron neutrino cancel in $L_e$.' },
    // ---------- level 4 ----------
    { id: 'cnl-029', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'neutral kaons', unit: '10⁻⁹ s',
      q: 'The $K^0_L$-$K^0_S$ mass difference is $\\Delta m\\,c^2 = 3.484\\times10^{-12}$ MeV. The period of $K^0 \\leftrightarrow \\bar K^0$ strangeness oscillation, $2\\pi\\hbar/\\Delta m c^2$, is ______ $\\times10^{-9}$ s (to two decimal places). Use $\\hbar = 6.582\\times10^{-22}$ MeV s.',
      answer: 1.19, tol: 0.01, calc: () => 2 * Math.PI * HBAR_MEVS / 3.484e-12 / 1e-9,
      sol: '$\\hbar/\\Delta mc^2 = 6.582\\times10^{-22}/3.484\\times10^{-12} = 1.889\\times10^{-10}$ s, and $2\\pi$ times this is $1.19\\times10^{-9}$ s, about 13 $K_S$ lifetimes. A $K^0$ beam turns partly into $\\bar K^0$ as it flies.',
      trap: 'Leaving out the $2\\pi$ gives the angular-frequency time scale, not the period.' },
    { id: 'cnl-030', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'neutral kaons',
      q: 'In 1964 Cronin and Fitch saw the long-lived neutral kaon decay to $\\pi^+\\pi^-$ about twice in a thousand decays. This showed that',
      options: ['strangeness is conserved in weak decays', 'the $K^0_L$ is a pure $CP = -1$ state', '$CP$ symmetry is violated', '$CPT$ symmetry is violated'], answer: 2,
      sol: 'Two pions from a spin-0 kaon have $CP = +1$. If $CP$ held, the $K_L$ ($CP = -1$, usually going to three pions) could never do this. The small $\\pi\\pi$ rate, $|\\eta_{+-}| \\approx 2.2\\times10^{-3}$, means the mass states are not exact $CP$ eigenstates. $CPT$ is not needed to break.',
      trap: '$CP$ violation does not mean $CPT$ violation; $T$ is broken too.' },
    { id: 'cnl-031', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'Noether',
      q: 'Which symmetry-conservation pairs given by Noether\'s theorem are correct?',
      options: ['Translation in space: linear momentum', 'Global phase change $\\psi \\to e^{i\\alpha}\\psi$ of a charged field: electric charge', 'Time reversal: energy', 'Rotations: angular momentum'], answer: [0, 1, 3],
      sol: 'Noether\'s theorem links continuous symmetries to conserved currents. Time reversal is a discrete symmetry: it gives a selection rule, not an additive conserved quantity. Energy comes from translation in time.',
      trap: 'Time translation and time reversal are different symmetries.' },
    { id: 'cnl-032', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'J^PC',
      q: 'For a quark-antiquark pair $P = (-1)^{L+1}$ and $C = (-1)^{L+S}$. Which $J^{PC}$ can no $q\\bar q$ meson have?',
      options: ['$0^{-+}$', '$1^{--}$', '$1^{+-}$', '$0^{+-}$'], answer: 3,
      sol: '$L = 0, S = 0$: $0^{-+}$ (pion). $L = 0, S = 1$: $1^{--}$ ($\\rho$). $L = 1, S = 0$: $1^{+-}$ ($h_1$). $J = 0$ with $P = +$ needs $L = 1, S = 1$, which gives $C = +$: $0^{++}$. So $0^{+-}$ is impossible for $q\\bar q$, an "exotic" (as are $0^{--}$, $1^{-+}$, $2^{+-}$).',
      trap: 'The extra $-1$ in $P$ comes from opposite intrinsic parities of fermion and antifermion.' },
    { id: 'cnl-033', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'neutral kaons', unit: 'cm',
      q: 'A $K^0_S$ ($m = 497.6$ MeV$/c^2$, $\\tau = 8.954\\times10^{-11}$ s) has momentum $10$ GeV$/c$. Its mean decay length in the laboratory is ______ cm (to the nearest whole number).',
      answer: 54, tol: 0.6, calc: () => 10000 / 497.611 * 2.99792458e10 * 8.954e-11,
      sol: '$L = \\beta\\gamma c\\tau = (p/mc)\\,c\\tau = (10000/497.6)\\times 2.684$ cm $= 20.1\\times2.684 = 53.9$ cm. A $K_L$ of the same momentum flies 570 times farther, which is how a pure $K_L$ beam is made.',
      trap: 'Using $\\gamma$ instead of $\\beta\\gamma$; the difference is small here but not at low momentum.' },
    { id: 'cnl-034', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'parity',
      q: 'A $\\pi^-$ is captured from an $s$ orbit by a deuteron ($J^P = 1^+$) and the reaction $\\pi^- d \\to n + n$ is seen. The final $nn$ state must be',
      options: ['$^1S_0$', '$^3S_1$', '$^1P_1$', '$^3P_1$'], answer: 3,
      sol: 'Initial $J = 1$ (pion spin 0, deuteron 1, $L = 0$). Two identical neutrons need an antisymmetric state, $(-1)^{L+S+1} = -1$, so $L + S$ even: $^1S_0$ ($J = 0$), $^3P_{0,1,2}$, $^1D_2$... Only $^3P_1$ has $J = 1$. Its parity is $-1$, so $P_\\pi P_d = -1$ and the pion parity is $-1$.',
      trap: '$^3S_1$ has the right $J$, but it is symmetric under exchange and so forbidden for two neutrons.' },
    { id: 'cnl-035', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'isospin',
      q: 'Use isospin to predict $\\sigma(p + p \\to d + \\pi^+)/\\sigma(n + p \\to d + \\pi^0)$ at the same energy. The ratio is ______.',
      answer: 2, tol: 0.01, calc: () => 1 / 0.5,
      sol: 'The deuteron has $I = 0$, so $d\\pi$ is pure $I = 1$. $pp = |1, 1\\rangle$ is all $I = 1$, while $np = \\tfrac{1}{\\sqrt2}(|1, 0\\rangle + |0, 0\\rangle)$ is half $I = 1$. Rates: $1 : \\tfrac12 = 2$, as measured.',
      trap: 'Treating $np$ as pure $I = 1$ gives 1.' },
    { id: 'cnl-036', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'weak selection rules',
      q: 'Semileptonic hyperon decays obey the rule $\\Delta S = \\Delta Q$ (changes of the hadrons\' strangeness and charge). Which decay breaks it, and is not seen?',
      options: ['$\\Sigma^- \\to n + e^- + \\bar\\nu_e$', '$\\Lambda^0 \\to p + e^- + \\bar\\nu_e$', '$\\Xi^0 \\to \\Sigma^+ + e^- + \\bar\\nu_e$', '$\\Sigma^+ \\to n + e^+ + \\nu_e$'], answer: 3,
      sol: 'One $s \\to u$ transition raises $S$ by 1 and the hadron charge by 1. Check each: $\\Sigma^- \\to n$: $\\Delta S = +1$, $\\Delta Q = +1$. $\\Lambda \\to p$: $+1, +1$. $\\Xi^0 \\to \\Sigma^+$: $+1, +1$. $\\Sigma^+ \\to n$: $\\Delta S = +1$ but $\\Delta Q = -1$; it would need two quarks to change at once ($uus \\to udd$).',
      trap: 'Every option conserves charge overall; the rule is about the hadrons alone.' },
    // ---------- level 5 ----------
    { id: 'cnl-037', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'neutral kaons', unit: '10⁻⁶',
      q: 'The $CP$-violation parameter is $|\\eta_{+-}| = |A(K_L \\to \\pi^+\\pi^-)/A(K_S \\to \\pi^+\\pi^-)| = 2.232\\times10^{-3}$. The ratio of decay rates $\\Gamma(K_L \\to \\pi^+\\pi^-)/\\Gamma(K_S \\to \\pi^+\\pi^-)$ is ______ $\\times10^{-6}$ (to two decimal places).',
      answer: 4.98, tol: 0.02, calc: () => (2.232e-3) ** 2 / 1e-6,
      sol: 'Rates go as squared amplitudes: $(2.232\\times10^{-3})^2 = 4.98\\times10^{-6}$. With $\\tau_L/\\tau_S = 571$, the branching ratio of $K_L \\to \\pi^+\\pi^-$ is about $4.98\\times10^{-6}\\times571\\times0.69 \\approx 2\\times10^{-3}$, the Cronin-Fitch number.',
      trap: 'Forgetting to square the amplitude ratio.' },
    { id: 'cnl-038', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'helicity', unit: '10⁻⁴',
      q: 'Helicity suppression: $\\dfrac{\\Gamma(\\pi^+ \\to e^+\\nu_e)}{\\Gamma(\\pi^+ \\to \\mu^+\\nu_\\mu)} = \\left(\\dfrac{m_e}{m_\\mu}\\right)^2\\left(\\dfrac{m_\\pi^2 - m_e^2}{m_\\pi^2 - m_\\mu^2}\\right)^2$. With $m_e = 0.511$, $m_\\mu = 105.66$ and $m_\\pi = 139.57$ MeV$/c^2$, the ratio is ______ $\\times10^{-4}$ (to two decimal places, without radiative corrections).',
      answer: 1.28, tol: 0.01, calc: () => (0.511 / 105.658) ** 2 * ((139.57 ** 2 - 0.511 ** 2) / (139.57 ** 2 - 105.658 ** 2)) ** 2 / 1e-4,
      sol: '$(m_e/m_\\mu)^2 = 2.339\\times10^{-5}$; $(m_\\pi^2 - m_e^2)/(m_\\pi^2 - m_\\mu^2) = 19480/8316 = 2.342$, squared $5.486$. Product: $1.28\\times10^{-4}$. The pion has spin 0, so the charged lepton and the right-handed antineutrino must have the same helicity; $V - A$ forbids that for a massless lepton, and the amplitude scales as $m_\\ell$. Phase space alone would favour the electron.',
      trap: 'Expecting the electron mode to dominate because it has more phase space.' },
    { id: 'cnl-039', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'P and T',
      q: 'A permanent electric dipole moment $\\vec d$ of the neutron, which would have to point along its spin $\\vec S$, would violate',
      options: ['parity only', 'time reversal only', 'both parity and time reversal', 'neither, since the neutron is neutral'], answer: 2,
      sol: 'Under $P$, $\\vec d$ (a polar vector) flips but $\\vec S$ (axial) does not; under $T$, $\\vec S$ flips but $\\vec d$ does not. So $\\vec d = d\\,\\vec S/|S|$ breaks both. By $CPT$, $T$ violation means $CP$ violation; current limits ($|d| < 2\\times10^{-26}\\,e$ cm) constrain new $CP$-violating physics.',
      trap: 'A neutral particle can still have a charge distribution with a dipole moment.' },
    { id: 'cnl-040', type: 'msq', level: 5, exams: ['gate', 'net'], sub: 'neutral kaons',
      q: 'Which statements about the neutral kaon system are correct?',
      options: ['A beam that starts as pure $K^0$ develops a $\\bar K^0$ part as it travels', 'The $K^0_S$ lives about 570 times shorter than the $K^0_L$', '$CP$ violation in the mixing is small, at the $10^{-3}$ level', '$K^0$ and $\\bar K^0$ are $CP$ eigenstates'], answer: [0, 1, 2],
      sol: 'Weak second-order transitions ($K^0 \\leftrightarrow \\bar K^0$ through box diagrams) mix the two; the mass states are $K_S$ and $K_L$ (nearly $K_1$, $CP = +1$, and $K_2$, $CP = -1$). $\\tau_S = 0.090$ ns, $\\tau_L = 51$ ns. $K^0$ and $\\bar K^0$ are strangeness eigenstates; $CP$ turns one into the other.',
      trap: '$CP|K^0\\rangle = \\pm|\\bar K^0\\rangle$, so the $CP$ eigenstates are their sum and difference.' },
    { id: 'cnl-041', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'lepton number',
      q: 'In $\\mu^+ \\to e^+ + \\nu_e + X$, the particle $X$ is',
      options: ['$\\nu_\\mu$', '$\\bar\\nu_e$', '$\\gamma$', '$\\bar\\nu_\\mu$'], answer: 3,
      sol: 'The $\\mu^+$ has $L_\\mu = -1$, which must be carried by a muon antineutrino. The $e^+$ ($L_e = -1$) and $\\nu_e$ ($+1$) cancel.',
      trap: 'The antimuon carries negative muon lepton number.' },
    { id: 'cnl-042', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'isospin',
      q: 'Use isospin to predict $\\Gamma(\\Delta^0 \\to p\\,\\pi^-)/\\Gamma(\\Delta^0 \\to n\\,\\pi^0)$. The ratio is ______ (to two decimal places).',
      answer: 0.5, tol: 0.01, calc: () => (1 / 3) / (2 / 3),
      sol: '$|\\tfrac32, -\\tfrac12\\rangle = \\sqrt{\\tfrac13}\\,|\\pi^- p\\rangle + \\sqrt{\\tfrac23}\\,|\\pi^0 n\\rangle$. Ratio of squares: $\\tfrac13/\\tfrac23 = 0.5$. The neutral pion channel is twice as likely, the mirror of the $\\Delta^+$.',
      trap: 'Copying the $\\Delta^+$ result (2) without asking which channel is on top.' },
    ...more2,
  ],
  gens: [
    { id: 'cnl-g01', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'allowed or forbidden',
      make(r) {
        const [proc, law, also, why] = choose(r, FORB);
        const wr = shuffle(r, Object.keys(LAWS).filter((k) => k !== law && !also.includes(k)));
        const o = mcqOptions(r, LAWS[law], wr.map((k) => LAWS[k]));
        return { q: `The process $${proc}$ does not happen. Which of these conservation laws does it break?`, ...o,
          sol: `${why} The other listed laws hold, so it breaks conservation of ${LAWS[law]}.`,
          trap: 'Check every law in turn: charge, baryon number, each lepton number, strangeness (for strong processes), energy and momentum.', proc };
      } },
    { id: 'cnl-g02', type: 'nat', level: 1, exams: ['jam', 'gate', 'net'], sub: 'quantum numbers',
      make(r) {
        const names = Object.keys(QN), n = int(r, 2, 3), set = [], k = int(r, 0, 5);
        for (let i = 0; i < n; i++) set.push(choose(r, names));
        const tot = set.reduce((s, x) => s + QN[x][k], 0);
        return { q: `A final state contains $${set.join(' + ')}$. Its total ${QNAME[k]} is ______.`,
          answer: tot, tol: 0, set, k,
          sol: `Additive quantum numbers just add: ${set.map((x) => `$${x}$: $${QN[x][k]}$`).join(', ')}. Total $= ${tot}$.`,
          trap: 'Antiparticles carry the opposite sign of every additive quantum number.' };
      },
      verify: (p) => p.set.reduce((s, x) => s + QN[x][p.k], 0) },
    { id: 'cnl-g03', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'which interaction',
      make(r) {
        const [d, t, f] = choose(r, LIFE);
        const o = mcqOptions(r, f, shuffle(r, ['strong', 'electromagnetic', 'weak', 'gravitational'].filter((x) => x !== f)), (v) => `the ${v} interaction`);
        return { q: `The decay $${d}$ has mean life $${t}$${t.includes('seconds') ? '' : ' s'}. It proceeds by`, ...o,
          sol: `${WHY[f]} ${f === 'weak' ? 'Here flavour changes or a neutrino appears.' : f === 'electromagnetic' ? 'Here a photon appears and no flavour changes.' : 'Here only hadrons appear and every quantum number is conserved.'}`,
          trap: 'Lifetimes differ by many powers of ten between the forces; use the order of magnitude, together with what is in the final state.', d };
      } },
    { id: 'cnl-g04', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'isospin',
      make(r) {
        const [par, a, b, R, cg] = choose(r, ISO), inv = r() < 0.5, ans = inv ? 1 / R : R;
        return { q: `Use isospin to predict $\\Gamma(${par} \\to ${inv ? b : a})/\\Gamma(${par} \\to ${inv ? a : b})$. The ratio is ______ (to two decimal places).`,
          answer: round(ans, 2), tol: 0.01, R, inv,
          sol: `${cg}. The strong decay conserves isospin, so each rate is the square of its Clebsch-Gordan coefficient (phase space is nearly the same). Ratio $= ${round(ans, 2)}$.`,
          trap: 'Squaring is essential: rates go as squared amplitudes.' };
      },
      verify: (p) => (p.inv ? 1 / p.R : p.R) },
    { id: 'cnl-g05', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'discrete symmetries',
      make(r) {
        const shape = int(r, 0, 2);
        if (shape === 0) {
          const n = int(r, 2, 7), v = (-1) ** n;
          return { q: `The G-parity of a state of ${n} pions is ______ (enter $+1$ or $-1$).`, answer: v, tol: 0, shape, n,
            sol: `Each pion has $G = -1$ and G-parity multiplies: $(-1)^{${n}} = ${v}$.`, trap: 'G-parity multiplies; it does not add.' };
        }
        const L = int(r, 0, 3), S = int(r, 0, 1), v = shape === 1 ? (-1) ** (L + S) : (-1) ** (L + 1), lt = 'SPDF'[L];
        return { q: `A positronium state has orbital angular momentum $L = ${L}$ ($${lt}$ state) and total spin $S = ${S}$. Its ${shape === 1 ? 'charge conjugation parity $C$' : 'parity $P$'} is ______ (enter $+1$ or $-1$).`,
          answer: v, tol: 0, shape, L, S,
          sol: shape === 1 ? `$C = (-1)^{L+S} = (-1)^{${L + S}} = ${v}$, so it can annihilate into ${v > 0 ? 'an even' : 'an odd'} number of photons.` : `Electron and positron have opposite intrinsic parities, so $P = (-1)^{L+1} = (-1)^{${L + 1}} = ${v}$.`,
          trap: shape === 1 ? 'The spin part matters: $C = (-1)^L$ alone is wrong for a fermion pair.' : 'The fermion-antifermion pair carries an extra $-1$ in parity.' };
      },
      verify: (p) => (p.shape === 0 ? (-1) ** p.n : p.shape === 1 ? (-1) ** (p.L + p.S) : (-1) ** (p.L + 1)) },
    { id: 'cnl-g06', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'J^PC',
      make(r) {
        const L = int(r, 0, 2), S = int(r, 0, 1), js = []; for (let j = Math.abs(L - S); j <= L + S; j++) js.push(j);
        const J = choose(r, js), P = (-1) ** (L + 1), C = (-1) ** (L + S), tag = (p, c) => `$${J}^{${sgn(p)}${sgn(c)}}$`;
        const o = mcqOptions(r, tag(P, C), shuffle(r, [tag(-P, C), tag(P, -C), tag(-P, -C)]));
        return { q: `A quark-antiquark meson is in the state $^{${2 * S + 1}}${'SPD'[L]}_{${J}}$. Its $J^{PC}$ is`, ...o,
          sol: `$L = ${L}$, $S = ${S}$. $P = (-1)^{L+1} = ${P > 0 ? '+1' : '-1'}$ and $C = (-1)^{L+S} = ${C > 0 ? '+1' : '-1'}$, so $J^{PC} = ${J}^{${sgn(P)}${sgn(C)}}$.`,
          trap: 'Fermion and antifermion have opposite intrinsic parity, hence the extra $-1$ in $P$.', L, S, J };
      } },
    { id: 'cnl-g07', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'decay length', unit: 'm',
      make(r) {
        const [n, m, tau] = choose(r, LONG), p = pick(r, 1, 40, 1), L = (p * 1000 / m) * CC * tau;
        return { q: `A $${n}$ ($mc^2 = ${m}$ MeV, mean life $${(tau / 10 ** Math.floor(Math.log10(tau))).toPrecision(4)}\\times10^{${Math.floor(Math.log10(tau))}}$ s) has momentum $${p}$ GeV$/c$. Its mean decay length in the laboratory is ______ m (to three significant figures).`,
          answer: +L.toPrecision(3), tol: +(L * 0.005).toPrecision(2), unit: 'm', m, tau, p,
          sol: `$L = \\beta\\gamma c\\tau = \\dfrac{p}{mc}\\,c\\tau = \\dfrac{${p * 1000}}{${m}}\\times ${(CC * tau).toPrecision(4)}$ m $= ${L.toPrecision(3)}$ m.`,
          trap: 'Time dilation uses $\\gamma$, but the distance needs $\\beta\\gamma = p/mc$.' };
      },
      verify: (p) => (p.p * 1000 / p.m) * CC * p.tau },
    { id: 'cnl-g08', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'neutral kaons',
      make(r) {
        const x = pick(r, 1, 12, 1), t = x * KS.tS, flip = r() < 0.5, v = flip ? pmK(t).flip : pmK(t).same;
        return { q: `A pure $K^0$ is made at $t = 0$. With $\\tau_S = 8.954\\times10^{-11}$ s, $\\tau_L = 5.116\\times10^{-8}$ s and $\\Delta m c^2 = 3.484\\times10^{-12}$ MeV, the probability of finding it as a ${flip ? '$\\bar K^0$' : '$K^0$'} at proper time $t = ${x}\\tau_S$ is ______ (to three decimal places). Use $P = \\tfrac14\\left[e^{-t/\\tau_S} + e^{-t/\\tau_L} ${flip ? '-' : '+'} 2e^{-(\\Gamma_S + \\Gamma_L)t/2}\\cos(\\Delta m\\,t/\\hbar)\\right]$.`,
          answer: round(v, 3), tol: 0.002, x, flip,
          sol: `$\\Delta m\\,t/\\hbar = ${(KS.dm * t / HBAR_MEVS).toFixed(3)}$ rad. Then $e^{-t/\\tau_S} = ${Math.exp(-x).toFixed(4)}$, $e^{-t/\\tau_L} = ${Math.exp(-t / KS.tL).toFixed(4)}$, and the interference term gives $P = ${round(v, 3)}$. A $K^0$ beam builds up a $\\bar K^0$ part as it flies: strangeness oscillation.`,
          trap: 'The cosine has argument $\\Delta m\\,t/\\hbar$, with $\\Delta m$ in energy units.' };
      },
      verify: (p) => { const s = pmK(p.x * KS.tS); return p.flip ? s.flip : s.same; } },
    { id: 'cnl-g09', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'missing particle',
      make(r) {
        const [proc, ans, wr, why] = choose(r, MISS);
        const o = mcqOptions(r, ans, shuffle(r, wr), (v) => `$${v}$`);
        return { q: `Which particle completes $${proc.replace('{?}', 'X')}$ so that every conservation law holds?`, ...o,
          sol: why, trap: 'Check charge, baryon number, each lepton number and (for strong processes) strangeness, then energy.', proc };
      } },
    { id: 'cnl-g10', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'allowed or forbidden',
      make(r) {
        const na = int(r, 1, 3), al = shuffle(r, ALLOWED).slice(0, na), fb = shuffle(r, FORB).slice(0, 4 - na);
        const all = shuffle(r, [...al.map((x) => [x, null]), ...fb.map((x) => [x[0], x])]);
        return { q: 'Which of these processes are allowed?', options: all.map((x) => `$${x[0]}$`), answer: all.map((x, i) => (x[1] ? -1 : i)).filter((i) => i >= 0),
          sol: all.map((x) => (x[1] ? `$${x[0]}$: forbidden, it breaks ${LAWS[x[1][1]]}. ${x[1][3]}` : `$${x[0]}$: allowed; every conserved quantity balances.`)).join(' '),
          trap: 'An allowed process must pass every test; one failure forbids it.' };
      } },
    { id: 'cnl-g11', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'helicity',
      make(r) {
        const [nm, M] = choose(r, [['\\pi^+', 139.570], ['K^+', 493.677]]), me = 0.511, mm = 105.658;
        const R = (me / mm) ** 2 * ((M * M - me * me) / (M * M - mm * mm)) ** 2, e = Math.floor(Math.log10(R)), man = R / 10 ** e;
        return { q: `Ignoring radiative corrections, helicity suppression gives $\\Gamma(${nm} \\to e^+\\nu_e)/\\Gamma(${nm} \\to \\mu^+\\nu_\\mu) = \\left(\\dfrac{m_e}{m_\\mu}\\right)^2\\left(\\dfrac{M^2 - m_e^2}{M^2 - m_\\mu^2}\\right)^2$. With $M = ${M}$, $m_\\mu = 105.66$ and $m_e = 0.511$ MeV$/c^2$, the ratio is ______ $\\times10^{${e}}$ (to two decimal places).`,
          answer: round(man, 2), tol: 0.01, M, e,
          sol: `$(m_e/m_\\mu)^2 = 2.339\\times10^{-5}$ and the phase-space factor is $${(((M * M - me * me) / (M * M - mm * mm)) ** 2).toFixed(3)}$, giving $${round(man, 2)}\\times10^{${e}}$. The spin-0 meson forces the charged lepton into the "wrong" helicity, which costs a factor $m_\\ell^2$.`,
          trap: 'Phase space alone would favour the electron mode; the helicity factor reverses that.' };
      },
      verify: (p) => (0.511 / 105.658) ** 2 * ((p.M ** 2 - 0.511 ** 2) / (p.M ** 2 - 105.658 ** 2)) ** 2 / 10 ** p.e },
    ...more,
  ],
};
