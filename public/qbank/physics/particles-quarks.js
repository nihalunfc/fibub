// Elementary particles and quarks (GATE / CSIR NET level): leptons, hadrons and gauge bosons, ranges of forces from
// the exchanged mass, quark flavours and quantum numbers, the Gell-Mann-Nishijima relation, isospin multiplets, the
// baryon octet and decuplet (equal spacing, Gell-Mann-Okubo), the meson nonet and J^PC, colour (the Delta++ puzzle,
// the R ratio), quark-model magnetic moments, widths and lifetimes, two-body decay momenta and invariant masses,
// Cabibbo mixing, OZI rule, neutrino oscillation, the Standard Model content.
// Original questions for fibub.
import { pick, choose, mcqOptions, round, shuffle } from '../_util.js';
import more from './particles-quarks.more.gen.js';
import more2 from './particles-quarks.more2.gen.js';
import r4 from './particles-quarks.r4.gen.js';

const HBARC = 197.327, HBAR_MEVS = 6.582120e-22, MP = 938.272;
// name, quark content (TeX), Q, B, S, I, I3, kind
const HAD = [
  ['p', 'uud', 1, 1, 0, 0.5, 0.5, 'baryon'], ['n', 'udd', 0, 1, 0, 0.5, -0.5, 'baryon'], ['\\Lambda^0', 'uds', 0, 1, -1, 0, 0, 'baryon'],
  ['\\Sigma^+', 'uus', 1, 1, -1, 1, 1, 'baryon'], ['\\Sigma^-', 'dds', -1, 1, -1, 1, -1, 'baryon'], ['\\Xi^0', 'uss', 0, 1, -2, 0.5, 0.5, 'baryon'],
  ['\\Xi^-', 'dss', -1, 1, -2, 0.5, -0.5, 'baryon'], ['\\Omega^-', 'sss', -1, 1, -3, 0, 0, 'baryon'], ['\\Delta^{++}', 'uuu', 2, 1, 0, 1.5, 1.5, 'baryon'],
  ['\\Delta^-', 'ddd', -1, 1, 0, 1.5, -1.5, 'baryon'], ['\\pi^+', 'u\\bar d', 1, 0, 0, 1, 1, 'meson'], ['\\pi^-', 'd\\bar u', -1, 0, 0, 1, -1, 'meson'],
  ['K^+', 'u\\bar s', 1, 0, 1, 0.5, 0.5, 'meson'], ['K^0', 'd\\bar s', 0, 0, 1, 0.5, -0.5, 'meson'], ['K^-', 's\\bar u', -1, 0, -1, 0.5, -0.5, 'meson'],
  ['\\bar K^0', 's\\bar d', 0, 0, -1, 0.5, 0.5, 'meson'], ['\\bar p', '\\bar u\\bar u\\bar d', -1, -1, 0, 0.5, -0.5, 'antibaryon'], ['\\bar\\Lambda^0', '\\bar u\\bar d\\bar s', 0, -1, 1, 0, 0, 'antibaryon'],
  ['\\Sigma^{*+}', 'uus', 1, 1, -1, 1, 1, 'baryon'], ['\\Xi^{*-}', 'dss', -1, 1, -2, 0.5, -0.5, 'baryon'],
];
const HEAVY = [['D^+', 'c\\bar d'], ['D^0', 'c\\bar u'], ['D_s^+', 'c\\bar s'], ['B^+', 'u\\bar b'], ['J/\\psi', 'c\\bar c'], ['\\Upsilon', 'b\\bar b'], ['\\Lambda_c^+', 'udc'], ['\\phi', 's\\bar s']];
const QCH = { u: 2 / 3, d: -1 / 3, s: -1 / 3, c: 2 / 3, b: -1 / 3, t: 2 / 3 };
const DEC = [['\\Lambda^0 \\to p\\,\\pi^-', 1115.683, 938.272, 139.570], ['\\Sigma^+ \\to p\\,\\pi^0', 1189.37, 938.272, 134.977], ['\\Xi^- \\to \\Lambda^0\\pi^-', 1321.71, 1115.683, 139.570], ['\\Omega^- \\to \\Lambda^0K^-', 1672.45, 1115.683, 493.677], ['K^+ \\to \\mu^+\\nu_\\mu', 493.677, 105.658, 0], ['\\pi^+ \\to \\mu^+\\nu_\\mu', 139.570, 105.658, 0], ['K^0_S \\to \\pi^+\\pi^-', 497.611, 139.570, 139.570], ['\\Delta^{++} \\to p\\,\\pi^+', 1232, 938.272, 139.570], ['\\rho^0 \\to \\pi^+\\pi^-', 775.3, 139.570, 139.570], ['\\phi \\to K^+K^-', 1019.46, 493.677, 493.677], ['Z^0 \\to \\mu^+\\mu^-', 91187.6, 105.658, 105.658], ['W^+ \\to e^+\\nu_e', 80379, 0.511, 0], ['\\tau^- \\to \\pi^-\\nu_\\tau', 1776.86, 139.570, 0], ['J/\\psi \\to e^+e^-', 3096.9, 0.511, 0.511]];
const p2 = (M, a, b) => Math.sqrt((M * M - (a + b) ** 2) * (M * M - (a - b) ** 2)) / (2 * M);
const RES = [['\\Delta(1232)', 117], ['\\rho(770)', 149], ['\\omega(782)', 8.68], ['\\phi(1020)', 4.25], ['K^*(892)', 51], ['J/\\psi', 0.0926], ['\\Sigma(1385)', 36], ['Z^0', 2495], ['W^\\pm', 2085], ['\\Upsilon(1S)', 0.054]];
const half = (x) => (Number.isInteger(x) ? String(x) : `${x < 0 ? '-' : ''}${Math.abs(2 * x)}/2`);
const frac = (x) => { const t = Math.round(x * 3); return t % 3 === 0 ? String(t / 3) : `${t < 0 ? '-' : ''}${Math.abs(t)}/3`; };

import { tidyPhys } from './_signs.js';

const topicBank = {
  topic: 'particles-quarks',
  items: [
    // ---------- level 1 ----------
    { id: 'pqk-001', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'quark content',
      q: 'The quark content of the proton is',
      options: ['$udd$', '$uus$', '$uud$', '$u\\bar d$'], answer: 2,
      sol: 'Charges: $u = +\\tfrac23$, $d = -\\tfrac13$. $uud$ gives $\\tfrac23 + \\tfrac23 - \\tfrac13 = +1$, baryon number $3\\times\\tfrac13 = 1$, strangeness 0: the proton. $udd$ is the neutron, $uus$ the $\\Sigma^+$, and $u\\bar d$ the $\\pi^+$.',
      trap: 'A quark-antiquark pair is a meson, with baryon number zero.' },
    { id: 'pqk-002', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'classification',
      q: 'Which of these particles is a lepton?',
      options: ['the pion', 'the kaon', 'the lambda', 'the muon'], answer: 3,
      sol: 'Leptons ($e$, $\\mu$, $\\tau$ and their neutrinos) do not feel the strong force and have no quark content. Pions and kaons are mesons ($q\\bar q$); the lambda is a baryon ($uds$). The muon was once called the "mu meson" because of its mass, but it is a heavy electron.',
      trap: 'Mass does not decide the class: the muon (106 MeV) is lighter than the pion but is a lepton.' },
    { id: 'pqk-003', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'gauge bosons',
      q: 'The charged-current weak interaction (as in beta decay) is mediated by',
      options: ['the $W^\\pm$ bosons', 'the photon', 'gluons', 'the Higgs boson'], answer: 0,
      sol: 'In $n \\to pe^-\\bar\\nu_e$ a $d$ quark turns into a $u$ quark by emitting a virtual $W^-$, which becomes $e^-\\bar\\nu_e$. The $Z^0$ carries neutral weak currents, the photon electromagnetism, gluons the strong force. The Higgs gives masses but is not a force carrier in this sense.',
      trap: 'Charge changes in beta decay, so the carrier must be charged.' },
    { id: 'pqk-004', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'quark content',
      q: 'The electric charge of the strange quark, in units of $e$, is',
      options: ['$+\\tfrac23$', '$-1$', '$-\\tfrac13$', '$0$'], answer: 2,
      sol: 'The down-type quarks $d$, $s$, $b$ have charge $-\\tfrac13$; the up-type $u$, $c$, $t$ have $+\\tfrac23$. Strangeness $S = -1$ is a separate quantum number of the $s$ quark.',
      trap: 'Strangeness $-1$ is not the electric charge.' },
    { id: 'pqk-005', type: 'nat', level: 1, exams: ['jam', 'gate', 'net'], sub: 'quark content',
      q: 'The $\\Omega$ baryon consists of three strange quarks. Its electric charge, in units of $e$, is ______.',
      answer: -1, tol: 0, calc: () => 3 * (-1 / 3),
      sol: '$3\\times(-\\tfrac13) = -1$: the $\\Omega^-$. Its strangeness is $-3$, and its discovery in 1964 at the mass predicted by SU(3) clinched the quark model.',
      trap: 'Strangeness $-3$ is not the charge.' },
    { id: 'pqk-006', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'classification',
      q: 'In the quark model,',
      options: ['mesons are three quarks and baryons are quark-antiquark pairs', 'mesons are quark-antiquark pairs and baryons are three quarks', 'both are made of two quarks', 'leptons are made of three quarks'], answer: 1,
      sol: 'Baryons ($qqq$) have baryon number 1 and half-integer spin; mesons ($q\\bar q$) have baryon number 0 and integer spin. Leptons are elementary.',
      trap: 'Mixing up the names: baryons are heavy, three-quark fermions.' },

    // ---------- level 2 ----------
    { id: 'pqk-007', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'range of forces', unit: 'fm',
      q: 'Yukawa\'s estimate: a force carried by a particle of mass $m$ has range $R \\approx \\hbar/mc$. For the pion ($m_\\pi c^2 = 139.6$ MeV) the range is ______ fm (to two decimal places). Use $\\hbar c = 197.3$ MeV fm.',
      answer: 1.41, tol: 0.01, calc: () => 197.327 / 139.57,
      sol: 'A virtual particle of energy $mc^2$ can exist for $\\Delta t \\sim \\hbar/mc^2$ and travel at most $c\\Delta t = \\hbar/mc = \\hbar c/mc^2 = 197.3/139.6 = 1.41$ fm: the range of the nuclear force.',
      trap: 'Using $h$ instead of $\\hbar$ gives a range $2\\pi$ times larger.' },
    { id: 'pqk-008', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'Gell-Mann-Nishijima',
      q: 'The $\\Xi^-$ baryon has $I_3 = -\\tfrac12$ and charge $-1$. Using $Q = I_3 + (B + S)/2$, its strangeness is',
      options: ['$-1$', '$+1$', '$-3$', '$-2$'], answer: 3,
      sol: '$-1 = -\\tfrac12 + (1 + S)/2$ gives $1 + S = -1$, so $S = -2$, consistent with the quark content $dss$.',
      trap: 'Forgetting the baryon number in the hypercharge $Y = B + S$.' },
    { id: 'pqk-009', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'colour',
      q: 'The $\\Delta^{++}$ is $uuu$ with spin $\\tfrac32$ and no orbital angular momentum, so its space, spin and flavour parts are all symmetric. This led to',
      options: ['the idea that quarks are bosons', 'the abandonment of the Pauli principle for quarks', 'a new quantum number, colour, in which the state is antisymmetric', 'the prediction of the top quark'], answer: 2,
      sol: 'Three identical fermions need a totally antisymmetric wavefunction. With space, spin and flavour symmetric, an extra degree of freedom with three values (red, green, blue) in the antisymmetric singlet combination saves the Pauli principle. Colour later became the charge of QCD.',
      trap: 'Quarks are spin-$\\tfrac12$ fermions; the Pauli principle holds.' },
    { id: 'pqk-010', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'classification',
      q: 'Which of these particles are baryons?',
      options: ['$\\Lambda^0$', '$\\Omega^-$', '$\\pi^+$', '$K^0$'], answer: [0, 1],
      sol: '$\\Lambda^0 = uds$ and $\\Omega^- = sss$ are three-quark states (baryon number 1). $\\pi^+ = u\\bar d$ and $K^0 = d\\bar s$ are mesons.',
      trap: 'Strange particles can be mesons (kaons) or baryons (hyperons).' },
    { id: 'pqk-011', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'range of forces', unit: '10⁻³ fm',
      q: 'The $W$ boson has mass $80.4$ GeV$/c^2$. The range of the weak interaction, $\\hbar/M_Wc$, is ______ $\\times10^{-3}$ fm (to two decimal places). Use $\\hbar c = 197.3$ MeV fm.',
      answer: 2.45, tol: 0.01, calc: () => 197.327 / 80379 * 1000,
      sol: '$\\hbar c/M_Wc^2 = 197.3\\text{ MeV fm}/80\\,400\\text{ MeV} = 2.45\\times10^{-3}$ fm, about a thousandth of a proton radius. That tiny range, not a small coupling, is why the weak force looks weak at low energy.',
      trap: 'Forgetting to convert GeV to MeV.' },
    { id: 'pqk-012', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'quark flavours',
      q: 'Unlike the other quarks, the top quark is never found inside hadrons. The reason is that',
      options: ['it decays by the weak interaction (to $bW$) in about $5\\times10^{-25}$ s, before hadronisation can occur', 'it carries no colour', 'it is lighter than the up quark', 'it is stable'], answer: 0,
      sol: 'With a mass of about 173 GeV the top decays so fast (width about 1.4 GeV) that it never has time (about $10^{-23}$ s) to bind with other quarks. It is studied through its decay products.',
      trap: 'The top quark does carry colour; it simply decays first.' },
    { id: 'pqk-013', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'quark content',
      q: 'The quark content of the $K^+$ meson is',
      options: ['$u\\bar s$', '$\\bar us$', '$d\\bar s$', '$u\\bar d$'], answer: 0,
      sol: '$K^+$ has charge $+1$ and strangeness $+1$. An anti-strange quark has $S = +1$ and charge $+\\tfrac13$, so $u\\bar s$: $\\tfrac23 + \\tfrac13 = 1$. $\\bar us$ is the $K^-$, $d\\bar s$ the $K^0$.',
      trap: 'Strangeness $+1$ means an anti-$s$, because the $s$ quark has $S = -1$.' },
    { id: 'pqk-014', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'quark content',
      q: 'The neutral pion in the quark model is',
      options: ['$u\\bar u$ only', '$d\\bar s$', '$(u\\bar u - d\\bar d)/\\sqrt2$', '$s\\bar s$'], answer: 2,
      sol: 'The $\\pi^0$ is the $I = 1$, $I_3 = 0$ member of the triplet $\\{u\\bar d,\\ (u\\bar u - d\\bar d)/\\sqrt2,\\ d\\bar u\\}$ (sign conventions vary). It is its own antiparticle and decays electromagnetically to $\\gamma\\gamma$.',
      trap: '$d\\bar s$ has strangeness and is the $K^0$.' },
    { id: 'pqk-015', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'isospin',
      q: 'The $\\Delta(1232)$ resonances have isospin $I = \\tfrac32$. The number of charge states in the multiplet is ______.',
      answer: 4, tol: 0, calc: () => 2 * 1.5 + 1,
      sol: '$2I + 1 = 4$: $\\Delta^{++}$ ($uuu$), $\\Delta^+$ ($uud$), $\\Delta^0$ ($udd$), $\\Delta^-$ ($ddd$).',
      trap: 'Counting only the charges seen in $\\pi N$ scattering with one beam.' },
    { id: 'pqk-016', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'leptons',
      q: 'Precision measurements of the width of the $Z^0$ resonance at LEP showed that the number of light neutrino flavours is',
      options: ['2', '3', '4', 'unlimited'], answer: 1,
      sol: 'Each light neutrino species adds about 166 MeV to the invisible width of the $Z$. The measured width gives $N_\\nu = 2.98 \\pm 0.01$: three generations of light neutrinos.',
      trap: 'The measurement counts neutrinos lighter than $M_Z/2$; heavier ones would not show up.' },

    // ---------- level 3 ----------
    { id: 'pqk-017', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'widths and lifetimes', unit: '10⁻²⁴ s',
      q: 'The $\\Delta(1232)$ has a width of $117$ MeV. Its mean life $\\tau = \\hbar/\\Gamma$ is ______ $\\times10^{-24}$ s (to two decimal places). Use $\\hbar = 6.582\\times10^{-22}$ MeV s.',
      answer: 5.63, tol: 0.02, calc: () => 6.58212e-22 / 117 / 1e-24,
      sol: '$\\tau = 6.582\\times10^{-22}/117 = 5.63\\times10^{-24}$ s, the time light takes to cross about 1.7 fm: a typical strong decay ($\\Delta \\to N\\pi$).',
      trap: 'Using $h$ instead of $\\hbar$.' },
    { id: 'pqk-018', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'decuplet',
      q: 'In the spin-$\\tfrac32$ baryon decuplet, the masses are $\\Delta$ 1232, $\\Sigma^*$ 1385 and $\\Xi^*$ 1533 MeV. The equal-spacing rule predicted the tenth member, the $\\Omega^-$ ($sss$), at about',
      options: ['$1440$ MeV', '$1980$ MeV', '$1533$ MeV', '$1680$ MeV'], answer: 3,
      sol: 'Each added strange quark raises the mass by about 150 MeV ($m_s - m_{u,d}$). $1533 + 148 \\approx 1680$ MeV. The $\\Omega^-$ was found at 1672 MeV with strangeness $-3$, decaying weakly because no strong decay was open.',
      trap: 'The rule is linear in strangeness, not in $|S|^2$.' },
    { id: 'pqk-019', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'decuplet', unit: 'MeV',
      q: 'Using the equal-spacing rule in the form $m_\\Omega = 2m_{\\Xi^*} - m_{\\Sigma^*}$ with $m_{\\Sigma^*} = 1385$ MeV and $m_{\\Xi^*} = 1533$ MeV, the predicted $\\Omega^-$ mass is ______ MeV.',
      answer: 1681, tol: 0.5, calc: () => 2 * 1533 - 1385,
      sol: 'Equal spacing means $m_\\Omega - m_{\\Xi^*} = m_{\\Xi^*} - m_{\\Sigma^*}$, so $m_\\Omega = 2\\times1533 - 1385 = 1681$ MeV; measured $1672.5$ MeV.',
      trap: 'Averaging the two masses gives the midpoint, not the next step.' },
    { id: 'pqk-020', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'colour',
      q: 'Which statements about colour are correct?',
      options: ['Each quark flavour comes in three colours', 'All observed hadrons are colour singlets', 'Gluons are colour-neutral, like photons are electrically neutral', 'The ratio $R = \\sigma(e^+e^- \\to \\text{hadrons})/\\sigma(e^+e^- \\to \\mu^+\\mu^-) \\approx N_c\\sum Q_q^2$ supports $N_c = 3$'], answer: [0, 1, 3],
      sol: 'Hadrons are colour singlets ($q\\bar q$ with colour-anticolour, $qqq$ antisymmetric in colour). $R$ counts quark pairs produced, each colour separately: below charm, $3\\times(\\tfrac49 + \\tfrac19 + \\tfrac19) = 2$, as measured. Gluons carry colour and anticolour (8 combinations), which is why they interact with each other.',
      trap: 'Gluons, unlike photons, carry the charge of their own force.' },
    { id: 'pqk-021', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'colour',
      q: 'Above the $b\\bar b$ threshold but well below the top threshold, the quark-parton model with three colours predicts $R = \\sigma(e^+e^- \\to \\text{hadrons})/\\sigma(e^+e^- \\to \\mu^+\\mu^-)$ = ______ (to two decimal places, no QCD corrections).',
      answer: 3.67, tol: 0.01, calc: () => 3 * (4 / 9 + 1 / 9 + 1 / 9 + 4 / 9 + 1 / 9),
      sol: 'Flavours $u, d, s, c, b$: $\\sum Q^2 = \\tfrac49 + \\tfrac19 + \\tfrac19 + \\tfrac49 + \\tfrac19 = \\tfrac{11}9$. $R = 3\\times\\tfrac{11}9 = \\tfrac{11}3 = 3.67$. QCD raises it by about 4% ($1 + \\alpha_s/\\pi$).',
      trap: 'Leaving out the colour factor gives 1.22.' },
    { id: 'pqk-022', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'magnetic moments',
      q: 'With equal $u$ and $d$ constituent masses, the simple quark model predicts the ratio of neutron to proton magnetic moments $\\mu_n/\\mu_p$ to be',
      options: ['$-1$', '$-\\tfrac12$', '$0$', '$-\\tfrac23$'], answer: 3,
      sol: 'From the spin-flavour wavefunctions: $\\mu_p = \\tfrac13(4\\mu_u - \\mu_d)$, $\\mu_n = \\tfrac13(4\\mu_d - \\mu_u)$. Equal masses make $\\mu_u = -2\\mu_d$ (charges $+\\tfrac23$ and $-\\tfrac13$). Then $\\mu_p = \\tfrac13(-8\\mu_d - \\mu_d) = -3\\mu_d$ and $\\mu_n = \\tfrac13(4\\mu_d + 2\\mu_d) = 2\\mu_d$, so $\\mu_n/\\mu_p = -\\tfrac23$. Measured: $-1.913/2.793 = -0.685$. A striking early success of the quark model.',
      trap: 'Expecting zero for a neutral particle.' },
    { id: 'pqk-023', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'decay kinematics', unit: 'MeV/c',
      q: 'A $\\Lambda^0$ ($1115.68$ MeV) at rest decays to $p\\,\\pi^-$ ($938.27$ and $139.57$ MeV). The momentum of each product is ______ MeV$/c$ (to one decimal place).',
      answer: 100.6, tol: 0.2, calc: () => p2(1115.683, 938.272, 139.570),
      sol: 'For a two-body decay $p^* = \\dfrac{\\sqrt{[M^2 - (m_1 + m_2)^2][M^2 - (m_1 - m_2)^2]}}{2M}$. $M^2 - (1077.84)^2 = 83\\,005$; $M^2 - (798.70)^2 = 606\\,824$. $p^* = \\sqrt{5.037\\times10^{10}}/2231.37 = 100.6$ MeV$/c$. The decay releases only $37.8$ MeV of kinetic energy, mostly to the pion.',
      trap: 'Sharing the kinetic energy equally ignores momentum conservation.' },
    { id: 'pqk-024', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Cabibbo mixing',
      q: 'In Cabibbo\'s picture the $W$ couples $u$ to $d\' = d\\cos\\theta_C + s\\sin\\theta_C$ with $\\theta_C \\approx 13^\\circ$. A consequence is that',
      options: ['strangeness-changing semileptonic decays are suppressed relative to strangeness-conserving ones by roughly $\\tan^2\\theta_C \\approx 0.05$', 'strange particles never decay', 'the neutron does not decay', 'the muon decays faster than expected'], answer: 0,
      sol: 'Amplitudes with $u \\to d$ carry $\\cos\\theta_C$ and with $u \\to s$ carry $\\sin\\theta_C$. Rates go as their squares, so $\\Delta S = 1$ processes are about $\\tan^2\\theta_C \\approx 0.05$ as strong (after phase-space differences). Purely leptonic muon decay has no such factor.',
      trap: 'Mixing suppresses but does not forbid strangeness change.' },
    { id: 'pqk-025', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'isospin',
      q: 'The $\\Sigma^0$ ($uds$) has isospin $I$, third component $I_3$ and hypercharge $Y = B + S$ equal to',
      options: ['$I = 0$, $I_3 = 0$, $Y = 0$', '$I = 1$, $I_3 = 0$, $Y = 0$', '$I = 1$, $I_3 = 0$, $Y = 1$', '$I = \\tfrac12$, $I_3 = -\\tfrac12$, $Y = -1$'], answer: 1,
      sol: '$B = 1$, $S = -1$, so $Y = 0$; $Q = I_3 + Y/2 = 0$ gives $I_3 = 0$. The $\\Sigma^0$ belongs to the triplet $\\Sigma^{+,0,-}$, so $I = 1$. The $\\Lambda^0$ has the same quarks but $I = 0$.',
      trap: '$\\Sigma^0$ and $\\Lambda^0$ share quark content and differ in isospin (the $ud$ pair is symmetric in $\\Sigma$, antisymmetric in $\\Lambda$).' },
    { id: 'pqk-026', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'quark content',
      q: 'Which of these hadrons contain a strange (or anti-strange) quark?',
      options: ['$K^+$', '$\\Lambda^0$', '$\\pi^-$', '$\\Xi^0$'], answer: [0, 1, 3],
      sol: '$K^+ = u\\bar s$, $\\Lambda^0 = uds$, $\\Xi^0 = uss$. The $\\pi^- = d\\bar u$ contains only first-generation quarks.',
      trap: 'An anti-strange quark counts: kaons with $S = +1$ are strange particles too.' },
    { id: 'pqk-027', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'decay kinematics', unit: 'MeV/c',
      q: 'A $\\pi^+$ ($139.57$ MeV) at rest decays to $\\mu^+\\nu_\\mu$ ($m_\\mu c^2 = 105.66$ MeV, massless neutrino). The muon momentum is ______ MeV$/c$ (to two decimal places).',
      answer: 29.79, tol: 0.02, calc: () => (139.57 ** 2 - 105.658 ** 2) / (2 * 139.57),
      sol: 'With one massless product, $p^* = \\dfrac{M^2 - m^2}{2M} = \\dfrac{19\\,480 - 11\\,164}{279.14} = 29.79$ MeV$/c$. The muon gets only $4.1$ MeV of kinetic energy; the neutrino takes $29.8$ MeV.',
      trap: 'Giving the muon $M - m_\\mu = 33.9$ MeV of kinetic energy forgets the neutrino.' },
    { id: 'pqk-028', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'antiparticles',
      q: 'Which of these particles is its own antiparticle?',
      options: ['$n$', '$K^0$', '$\\pi^0$', '$\\Lambda^0$'], answer: 2,
      sol: 'A particle is its own antiparticle only if all its additive quantum numbers vanish. $\\pi^0$ ($u\\bar u$, $d\\bar d$ mixture) qualifies. The neutron ($B = 1$), $K^0$ ($S = +1$) and $\\Lambda^0$ ($B = 1$, $S = -1$) all have distinct antiparticles despite being neutral.',
      trap: 'Neutral is not enough: baryon number or strangeness distinguishes the antiparticle.' },

    // ---------- level 4 ----------
    { id: 'pqk-029', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'invariant mass', unit: 'degrees',
      q: 'A $\\pi^0$ ($134.98$ MeV) decays into two photons of energies $300$ MeV and $100$ MeV. The opening angle between the photons is ______ degrees (to one decimal place).',
      answer: 45.9, tol: 0.1, calc: () => Math.acos(1 - 134.977 ** 2 / 60000) * 180 / Math.PI,
      sol: 'For two massless particles $m^2c^4 = 2E_1E_2(1 - \\cos\\theta)$. $\\cos\\theta = 1 - \\dfrac{134.98^2}{2\\times300\\times100} = 1 - 0.3037 = 0.6963$, so $\\theta = 45.9^\\circ$.',
      trap: 'Using $m^2 = (E_1 + E_2)^2$ forgets the photons\u2019 momenta.' },
    { id: 'pqk-030', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'Standard Model',
      q: 'Which statements about the Standard Model are correct?',
      options: ['It has six quarks and six leptons in three generations', 'There are eight gluons, all massless', 'The Higgs boson has spin 1', 'The $W$ and $Z$ masses are about $80$ and $91$ GeV$/c^2$'], answer: [0, 1, 3],
      sol: 'Generations: $(u, d, e, \\nu_e)$, $(c, s, \\mu, \\nu_\\mu)$, $(t, b, \\tau, \\nu_\\tau)$. SU(3) colour has $3^2 - 1 = 8$ massless gluons. The Higgs boson (125 GeV) is a scalar, spin 0. $M_W = 80.4$ GeV, $M_Z = 91.19$ GeV.',
      trap: 'Spin 1 belongs to the gauge bosons; the Higgs is spin 0.' },
    { id: 'pqk-031', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'invariant mass', unit: 'degrees',
      q: 'A $\\pi^0$ of total energy $1.00$ GeV decays to two photons. The smallest possible opening angle between them is ______ degrees (to two decimal places). Use $m_{\\pi^0}c^2 = 134.98$ MeV.',
      answer: 15.51, tol: 0.03, calc: () => 2 * Math.asin(134.977 / 1000) * 180 / Math.PI,
      sol: 'With $m^2 = 2E_1E_2(1 - \\cos\\theta)$ and $E_1 + E_2 = E$ fixed, the angle is smallest when $E_1 = E_2 = E/2$: $1 - \\cos\\theta = 2m^2/E^2$, i.e. $\\sin(\\theta_{min}/2) = m/E = 0.13498$. $\\theta_{min} = 2\\times7.757^\\circ = 15.51^\\circ$. High-energy pions give nearly merged photon showers.',
      trap: 'The minimum angle is at symmetric decay, not when one photon takes all the energy.' },
    { id: 'pqk-032', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'OZI rule',
      q: 'The $J/\\psi$ ($c\\bar c$, 3097 MeV) has a width of only about 93 keV, though it decays to light hadrons. The explanation is that',
      options: ['it decays weakly', 'it is lighter than two $D$ mesons, so it cannot decay by creating a light quark pair and must annihilate its $c\\bar c$ through three gluons, an OZI-suppressed process', 'charm is absolutely conserved', 'it is a lepton'], answer: 1,
      sol: 'The easy (OZI-allowed) decay $c\\bar c \\to (c\\bar q)(q\\bar c) = D\\bar D$ needs $2m_D \\approx 3730$ MeV. Below that, $c$ and $\\bar c$ must annihilate into gluons (at least three for a $1^{--}$ state), each carrying a small $\\alpha_s$ at this scale. The $\\psi(3770)$, above $D\\bar D$ threshold, is about 300 times wider.',
      trap: 'The $J/\\psi$ decays by the strong (and electromagnetic) force, just slowly.' },
    { id: 'pqk-033', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'magnetic moments', unit: 'μN',
      q: 'In the quark model the $\\Lambda^0$ magnetic moment is that of its strange quark, $\\mu_\\Lambda = \\mu_s = -\\tfrac13\\dfrac{e\\hbar}{2m_s}$. With $m_sc^2 = 510$ MeV and $m_pc^2 = 938.27$ MeV, $\\mu_\\Lambda$ = ______ $\\mu_N$ (to three decimal places).',
      answer: -0.613, tol: 0.003, calc: () => -938.272 / 510 / 3,
      sol: 'In the $\\Lambda$ the $ud$ pair has spin 0 (isospin 0), so only the $s$ quark contributes. $\\mu_s = -\\tfrac13\\dfrac{m_p}{m_s}\\mu_N = -\\tfrac13\\times1.840 = -0.613\\,\\mu_N$, matching the measured $-0.613\\,\\mu_N$.',
      trap: 'Adding the $u$ and $d$ moments: their spins are paired to zero in the $\\Lambda$.' },
    { id: 'pqk-034', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'neutrinos',
      q: 'Observation of neutrino oscillations (for example $\\nu_\\mu$ disappearing over long distances) implies that',
      options: ['neutrinos have non-zero, unequal masses and the flavour states are mixtures of mass states', 'neutrinos travel faster than light', 'lepton number is exactly conserved for each flavour', 'neutrinos are massless'], answer: 0,
      sol: 'Oscillation probability goes as $\\sin^22\\theta\\,\\sin^2(1.27\\,\\Delta m^2[\\text{eV}^2]L[\\text{km}]/E[\\text{GeV}])$: it needs both mixing ($\\theta \\ne 0$) and a mass difference ($\\Delta m^2 \\ne 0$). Individual lepton flavour numbers are therefore not conserved.',
      trap: 'Oscillations measure differences of squared masses, not the masses themselves.' },
    { id: 'pqk-035', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'magnetic moments', unit: 'μN',
      q: 'Take constituent masses $m_u = m_d = 336$ MeV$/c^2$, so that $\\mu_u = \\tfrac23\\dfrac{m_p}{m_u}\\mu_N$ and $\\mu_d = -\\tfrac13\\dfrac{m_p}{m_d}\\mu_N$ ($m_pc^2 = 938.27$ MeV). The quark-model proton moment $\\mu_p = \\tfrac13(4\\mu_u - \\mu_d)$ is ______ $\\mu_N$ (to two decimal places).',
      answer: 2.79, tol: 0.01, calc: () => { const k = 938.272 / 336; return (4 * (2 / 3) * k + (1 / 3) * k) / 3; },
      sol: '$m_p/m_u = 2.7925$. $\\mu_u = 1.8617$, $\\mu_d = -0.9308\\,\\mu_N$. $\\mu_p = (7.4467 + 0.9308)/3 = 2.79\\,\\mu_N$, the measured value (the constituent mass was chosen to fit it). Then $\\mu_n = (4\\mu_d - \\mu_u)/3 = -1.86\\,\\mu_N$ is a prediction (measured $-1.91$).',
      trap: 'The $d$-quark moment is negative; subtracting it adds to $\\mu_p$.' },
    { id: 'pqk-036', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'deep inelastic scattering',
      q: 'In deep inelastic electron-proton scattering, the structure functions depend (approximately) only on the dimensionless variable $x = Q^2/2M\\nu$ and not on $Q^2$ separately. This Bjorken scaling showed that',
      options: ['the proton is a uniform sphere', 'the proton contains point-like, nearly free constituents (partons, identified with quarks)', 'electrons have structure', 'the strong force grows at short distances'], answer: 1,
      sol: 'Scattering from point-like constituents has no intrinsic length scale, so the cross-section depends only on a ratio. $x$ is the fraction of the proton\u2019s momentum carried by the struck parton. Small logarithmic violations of scaling come from gluon radiation, as QCD predicts; asymptotic freedom (weak coupling at short distance) is why the partons look free.',
      trap: 'A smooth extended charge would give a form factor falling with $Q^2$, not scaling.' },

    // ---------- level 5 ----------
    { id: 'pqk-037', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'octet', unit: 'MeV',
      q: 'The Gell-Mann-Okubo relation for the baryon octet is $\\tfrac12(m_N + m_\\Xi) = \\tfrac14(3m_\\Lambda + m_\\Sigma)$. With $m_N = 939$, $m_\\Sigma = 1193$ and $m_\\Xi = 1318$ MeV, it predicts $m_\\Lambda$ = ______ MeV (to the nearest MeV).',
      answer: 1107, tol: 0.5, calc: () => (2 * (939 + 1318) - 1193) / 3,
      sol: '$3m_\\Lambda = 2(m_N + m_\\Xi) - m_\\Sigma = 2\\times2257 - 1193 = 3321$, so $m_\\Lambda = 1107$ MeV, close to the measured $1115.7$ MeV (within 1%).',
      trap: 'Mixing up the weights 3 and 1 of $\\Lambda$ and $\\Sigma$.' },
    { id: 'pqk-038', type: 'msq', level: 5, exams: ['gate', 'net'], sub: 'meson quantum numbers',
      q: 'Which statements about quark-model hadrons are correct?',
      options: ['Decuplet baryons have symmetric flavour-spin wavefunctions, made antisymmetric overall by colour', 'The lightest meson nonet ($\\pi$, $K$, $\\eta$, $\\eta\'$) has $J^P = 0^-$', 'A $q\\bar q$ meson with $L = 0$ has positive parity', 'The $\\rho$ meson is the $J^{PC} = 1^{--}$ partner of the pion'], answer: [0, 1, 3],
      sol: 'A fermion and its antifermion have opposite intrinsic parity, so $P = (-1)^{L+1}$: $L = 0$ gives negative parity. With spins antiparallel, $J^P = 0^-$ (pseudoscalars); parallel, $1^-$ (vectors: $\\rho$, $\\omega$, $K^*$, $\\phi$), with $C = (-1)^{L+S} = -1$ for the neutral ones. Decuplet: symmetric in space ($L = 0$), spin ($\\tfrac32$) and flavour, antisymmetric colour.',
      trap: 'The extra minus sign in meson parity comes from the antiquark.' },
    { id: 'pqk-039', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'invariant mass', unit: '10⁶ GeV',
      q: 'To make a $Z^0$ ($91.19$ GeV$/c^2$) by firing positrons at electrons at rest, the positron energy would have to be at least ______ $\\times10^6$ GeV (to two decimal places). Use $m_ec^2 = 0.511$ MeV.',
      answer: 8.14, tol: 0.02, calc: () => 91.1876 ** 2 / (2 * 0.000511) / 1e6,
      sol: 'Fixed target: $s = 2m_e^2 + 2m_eE$. Setting $\\sqrt s = M_Z$: $E \\approx \\dfrac{M_Z^2}{2m_e} = \\dfrac{8315.6}{2\\times5.11\\times10^{-4}}$ GeV $= 8.14\\times10^6$ GeV. A collider with two $45.6$ GeV beams does the same job, which is why LEP was a collider.',
      trap: 'Using $E = M_Zc^2$ as if it were a collider.' },
    { id: 'pqk-040', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'decay kinematics', unit: 'MeV/c',
      q: 'A $\\Delta^{++}$ of mass $1232$ MeV at rest decays to $p\\,\\pi^+$ ($938.27$ and $139.57$ MeV). The proton momentum is ______ MeV$/c$ (to the nearest MeV$/c$).',
      answer: 227, tol: 1, calc: () => p2(1232, 938.272, 139.570),
      sol: '$M^2 - (m_p + m_\\pi)^2 = 1\\,517\\,824 - 1\\,161\\,743 = 356\\,081$; $M^2 - (m_p - m_\\pi)^2 = 1\\,517\\,824 - 637\\,925 = 879\\,899$. $p^* = \\sqrt{3.133\\times10^{11}}/2464 = 227$ MeV$/c$. This is the pion momentum (in the CM) at which $\\pi^+p$ scattering peaks.',
      trap: 'Using the non-relativistic reduced-mass formula for a relativistic pion.' },
    { id: 'pqk-041', type: 'msq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'classification',
      q: 'Which of these are elementary (structureless) particles in the Standard Model?',
      options: ['the electron', 'the gluon', 'the proton', 'the up quark'], answer: [0, 1, 3],
      sol: 'Leptons, quarks, gauge bosons and the Higgs are elementary. The proton is a bound state of quarks and gluons, with a charge radius of about 0.84 fm.',
      trap: 'The proton is stable, but stable does not mean elementary.' },
    { id: 'pqk-042', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'isospin',
      q: 'Which statements about isospin are correct?',
      options: ['The proton and neutron form an $I = \\tfrac12$ doublet', 'The three pions form an $I = 1$ triplet', 'The strong interaction conserves isospin to a good approximation', 'The electromagnetic interaction conserves total isospin'], answer: [0, 1, 2],
      sol: 'Isospin symmetry reflects $m_u \\approx m_d$ and the flavour blindness of QCD. Electromagnetism distinguishes $u$ ($+\\tfrac23$) from $d$ ($-\\tfrac13$), so it conserves $I_3$ (charge) but not $I$; that is why $\\Sigma^0 \\to \\Lambda\\gamma$ ($\\Delta I = 1$) is allowed.',
      trap: 'EM conserves $I_3$ but breaks total $I$.' },
    ...more2,
    ...r4.items,
  ],
  gens: [
    { id: 'pqk-g01', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'quark content',
      make(r) {
        const all = HAD.map((h) => [h[0], h[1]]).concat(HEAVY), [name, qc] = choose(r, all);
        const others = all.map((x) => x[1]).filter((x) => x !== qc), same = others.filter((x) => x.length === qc.length);
        const o = mcqOptions(r, qc, [...shuffle(r, same), ...shuffle(r, others)], (v) => `$${v}$`);
        return { q: `The quark content of the $${name}$ is`, ...o,
          sol: `$${name} = ${qc}$. Check with charges ($u, c = +\\tfrac23$; $d, s, b = -\\tfrac13$; antiquarks opposite) and quantum numbers (strangeness $-1$ per $s$, $+1$ per $\\bar s$).`,
          trap: 'Mixing up a quark with its antiquark flips charge and strangeness.', name };
      } },
    { id: 'pqk-g02', type: 'nat', level: 1, exams: ['jam', 'gate', 'net'], sub: 'quark content',
      make(r) {
        const fl = ['u', 'd', 's', 'c', 'b'], meson = r() < 0.5;
        const q1 = choose(r, fl), q2 = choose(r, fl), q3 = choose(r, fl), anti = r() < 0.5;
        const Q = meson ? QCH[q1] - QCH[q2] : (anti ? -1 : 1) * (QCH[q1] + QCH[q2] + QCH[q3]);
        const tex = meson ? `${q1}\\bar ${q2}` : anti ? `\\bar ${q1}\\bar ${q2}\\bar ${q3}` : `${q1}${q2}${q3}`;
        return { q: `A hadron has quark content $${tex}$. Its electric charge, in units of $e$, is ______.`,
          answer: Math.round(Q), tol: 0, tex, Qv: Q,
          sol: `$u, c$: $+\\tfrac23$; $d, s, b$: $-\\tfrac13$; antiquarks have the opposite sign. Adding: ${meson ? `$${frac(QCH[q1])} + (${frac(-QCH[q2])})$` : `$${anti ? '-' : ''}(${frac(QCH[q1])} + ${frac(QCH[q2])} + ${frac(QCH[q3])})$`} $= ${Math.round(Q)}$. Every colour-singlet hadron has integer charge.`,
          trap: 'Forgetting that the antiquark charge has the opposite sign.' };
      },
      verify: (p) => Math.round(p.Qv) },
    { id: 'pqk-g03', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Gell-Mann-Nishijima',
      make(r) {
        const h = choose(r, HAD), [name, , Q, B, S, , I3] = h, ask = choose(r, ['S', 'Y', 'I3']);
        const val = ask === 'S' ? S : ask === 'Y' ? B + S : I3;
        const given = ask === 'S' ? `charge $${Q}$, baryon number $${B}$ and $I_3 = ${half(I3)}$` : ask === 'Y' ? `charge $${Q}$ and $I_3 = ${half(I3)}$` : `charge $${Q}$, baryon number $${B}$ and strangeness $${S}$`;
        return { q: `The $${name}$ has ${given}. Using $Q = I_3 + Y/2$ with hypercharge $Y = B + S$, find ${ask === 'S' ? 'its strangeness $S$' : ask === 'Y' ? 'its hypercharge $Y$' : '$I_3$'} (enter a decimal if needed).`,
          answer: val, tol: 0, Q, B, S, I3, ask,
          sol: ask === 'S' ? `$Y = 2(Q - I_3) = ${2 * (Q - I3)}$, so $S = Y - B = ${S}$.` : ask === 'Y' ? `$Y = 2(Q - I_3) = 2(${Q} - (${half(I3)})) = ${B + S}$.` : `$Y = B + S = ${B + S}$, so $I_3 = Q - Y/2 = ${half(I3)}$.`,
          trap: 'Using $Y = S$ (forgetting baryon number) gives the wrong answer for baryons.' };
      },
      verify: (p) => (p.ask === 'S' ? 2 * (p.Q - p.I3) - p.B : p.ask === 'Y' ? 2 * (p.Q - p.I3) : p.Q - (p.B + p.S) / 2) },
    { id: 'pqk-g04', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'range of forces',
      make(r) {
        const hyp = pick(r, 10, 900, 10);
        const ex = choose(r, [['a pion', 139.57], ['a neutral pion', 134.98], ['a kaon', 493.68], ['an eta meson', 547.86], ['a rho meson', 775.3], ['an omega meson', 782.66], ['a $W$ boson', 80379], ['a $Z$ boson', 91188], [`a hypothetical boson of mass ${hyp} MeV$/c^2$`, 0]]);
        const m = ex[1] || hyp, R = HBARC / m;
        return { q: `A force is carried by the exchange of ${ex[0]}${ex[1] ? ` ($mc^2 = ${m}$ MeV)` : ''}. Its range $\\hbar/mc$ is ______ fm (to three significant figures). Use $\\hbar c = 197.33$ MeV fm.`,
          answer: +R.toPrecision(3), tol: +(R * 0.005).toPrecision(2), unit: 'fm', m,
          sol: `$R = \\hbar c/mc^2 = 197.33/${m} = ${R.toPrecision(3)}$ fm.`,
          trap: 'Using $h$ in place of $\\hbar$.' };
      },
      verify: (p) => HBARC / p.m },
    { id: 'pqk-g05', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'widths and lifetimes',
      make(r) {
        const [n, G] = choose(r, RES), tau = HBAR_MEVS / G, e = Math.floor(Math.log10(tau)), man = tau / 10 ** e;
        return { q: `The $${n}$ has total width $${G}$ MeV. Its mean life is ______ $\\times10^{${e}}$ s (to three significant figures). Use $\\hbar = 6.582\\times10^{-22}$ MeV s.`,
          answer: +man.toPrecision(3), tol: +(man * 0.005).toPrecision(2), G, e,
          sol: `$\\tau = \\hbar/\\Gamma = 6.582\\times10^{-22}/${G} = ${man.toPrecision(3)}\\times10^{${e}}$ s. ${tau < 1e-22 ? 'A strong decay.' : tau < 1e-19 ? 'Suppressed (OZI or electromagnetic) decays live this long.' : 'Long-lived for a resonance.'}`,
          trap: 'Using $h$ instead of $\\hbar$ multiplies the answer by $2\\pi$.' };
      },
      verify: (p) => HBAR_MEVS / p.G / 10 ** p.e },
    { id: 'pqk-g06', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'decay kinematics',
      make(r) {
        const [eq, M, m1, m2] = choose(r, DEC), p = p2(M, m1, m2);
        return { q: `A particle decays at rest: $${eq}$ (masses ${M}, ${m1}${m2 ? ` and ${m2} MeV$/c^2$` : ' MeV$/c^2$ and a massless neutrino'}). The momentum of each product is ______ MeV$/c$ (to one decimal place).`,
          answer: round(p, 1), tol: Math.max(0.1, round(p * 0.002, 2)), unit: 'MeV/c', M, m1, m2,
          sol: `$p^* = \\dfrac{\\sqrt{[M^2 - (m_1 + m_2)^2][M^2 - (m_1 - m_2)^2]}}{2M} = ${round(p, 1)}$ MeV$/c$.${m2 === 0 ? ' With a massless product this is $(M^2 - m_1^2)/2M$.' : ''}`,
          trap: 'Sharing the released energy equally ignores momentum conservation.' };
      },
      verify: (p) => p2(p.M, p.m1, p.m2) },
    { id: 'pqk-g07', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'colour',
      make(r) {
        const regs = [['below the charm threshold (u, d, s)', ['u', 'd', 's']], ['between the charm and bottom thresholds (u, d, s, c)', ['u', 'd', 's', 'c']], ['above the bottom threshold (u, d, s, c, b)', ['u', 'd', 's', 'c', 'b']], ['above the top threshold (all six)', ['u', 'd', 's', 'c', 'b', 't']]];
        const [txt, fl] = choose(r, regs), Nc = choose(r, [3, 3, 3, 1, 2, 4]), R = Nc * fl.reduce((s, f) => s + QCH[f] ** 2, 0);
        return { q: `In the quark-parton model with $N_c = ${Nc}$ colour${Nc > 1 ? 's' : ''}, the ratio $R = \\sigma(e^+e^- \\to \\text{hadrons})/\\sigma(e^+e^- \\to \\mu^+\\mu^-)$ ${txt} is ______ (to two decimal places).`,
          answer: round(R, 2), tol: 0.01, Nc, fl,
          sol: `$R = N_c\\sum Q_q^2 = ${Nc}\\times(${fl.map((f) => (QCH[f] > 0 ? '\\tfrac49' : '\\tfrac19')).join(' + ')}) = ${round(R, 2)}$.${Nc !== 3 ? ' (Nature has $N_c = 3$; the data rule out other values.)' : ''}`,
          trap: 'Forgetting to square the charges or to multiply by the number of colours.' };
      },
      verify: (p) => p.Nc * p.fl.reduce((s, f) => s + QCH[f] ** 2, 0) },
    { id: 'pqk-g08', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'invariant mass',
      make(r) {
        const [n, m] = choose(r, [['\\pi^0', 134.977], ['\\eta', 547.862]]), E = round(m * pick(r, 1.2, 30, 0.1), 0), th = 2 * Math.asin(m / E) * 180 / Math.PI;
        return { q: `A $${n}$ ($mc^2 = ${m}$ MeV) with total energy $${E}$ MeV decays into two photons. The minimum opening angle between them is ______ degrees (to two decimal places).`,
          answer: round(th, 2), tol: Math.max(0.02, round(th * 0.002, 3)), unit: 'degrees', m, E,
          sol: `The angle is smallest for equal photon energies, where $\\sin(\\theta_{min}/2) = m/E = ${round(m / E, 5)}$, so $\\theta_{min} = ${round(th, 2)}^\\circ$.`,
          trap: 'Using $\\sin\\theta = m/E$ without the half angle.' };
      },
      verify: (p) => 2 * Math.asin(p.m / p.E) * 180 / Math.PI },
    { id: 'pqk-g09', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'invariant mass',
      make(r) {
        const E1 = pick(r, 20, 2000, 10), E2 = pick(r, 20, 2000, 10), th = pick(r, 5, 175, 1), m = Math.sqrt(2 * E1 * E2 * (1 - Math.cos(th * Math.PI / 180)));
        return { q: `Two photons of energies $${E1}$ MeV and $${E2}$ MeV are detected with an opening angle of $${th}^\\circ$. If they came from one decaying particle, its mass is ______ MeV$/c^2$ (to one decimal place).`,
          answer: round(m, 1), tol: Math.max(0.1, round(m * 0.002, 2)), unit: 'MeV/c²', E1, E2, th,
          sol: `$m^2c^4 = (E_1 + E_2)^2 - |\\vec p_1c + \\vec p_2c|^2 = 2E_1E_2(1 - \\cos\\theta) = 2\\times${E1}\\times${E2}\\times${round(1 - Math.cos(th * Math.PI / 180), 5)}$, so $m = ${round(m, 1)}$ MeV$/c^2$.`,
          trap: 'Adding the energies gives the total energy, not the mass.' };
      },
      verify: (p) => Math.sqrt(2 * p.E1 * p.E2 * (1 - Math.cos(p.th * Math.PI / 180))) },
    { id: 'pqk-g10', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'classification',
      make(r) {
        const L = [['electron', 0], ['muon', 0], ['tau', 0], ['electron neutrino', 0], ['tau neutrino', 0], ['$\\pi^+$', 1], ['$K^0$', 1], ['$\\eta$', 1], ['$J/\\psi$', 1], ['$D^0$', 1], ['$\\rho^0$', 1], ['proton', 2], ['$\\Lambda^0$', 2], ['$\\Sigma^-$', 2], ['$\\Omega^-$', 2], ['$\\Delta^{++}$', 2], ['$\\Lambda_c^+$', 2], ['photon', 3], ['gluon', 3], ['$W^-$', 3], ['$Z^0$', 3]];
        const [n, k] = choose(r, L), opts = ['a lepton', 'a meson', 'a baryon', 'a gauge boson'];
        return { q: `The ${n} is`, options: opts, answer: k,
          sol: `Leptons: $e$, $\\mu$, $\\tau$ and neutrinos (no strong force). Mesons: $q\\bar q$, integer spin. Baryons: $qqq$, half-integer spin. Gauge bosons: $\\gamma$, $W^\\pm$, $Z^0$, gluons. The ${n} is ${opts[k]}.`,
          trap: 'Classifying by mass instead of by structure.', k };
      } },
    { id: 'pqk-g11', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'magnetic moments',
      make(r) {
        const B = [['p', (u, d) => (4 * u - d) / 3, '\\tfrac13(4\\mu_u - \\mu_d)'], ['n', (u, d) => (4 * d - u) / 3, '\\tfrac13(4\\mu_d - \\mu_u)'], ['\\Sigma^+', (u, d, s) => (4 * u - s) / 3, '\\tfrac13(4\\mu_u - \\mu_s)'], ['\\Sigma^-', (u, d, s) => (4 * d - s) / 3, '\\tfrac13(4\\mu_d - \\mu_s)'], ['\\Xi^0', (u, d, s) => (4 * s - u) / 3, '\\tfrac13(4\\mu_s - \\mu_u)'], ['\\Xi^-', (u, d, s) => (4 * s - d) / 3, '\\tfrac13(4\\mu_s - \\mu_d)'], ['\\Lambda^0', (u, d, s) => s, '\\mu_s'], ['\\Omega^-', (u, d, s) => 3 * s, '3\\mu_s']];
        const idx = Math.floor(r() * B.length), [n, f, txt] = B[idx], mu_ = pick(r, 310, 360, 2), ms = pick(r, 450, 550, 5);
        const u = 2 / 3 * MP / mu_, d = -1 / 3 * MP / mu_, s = -1 / 3 * MP / ms, val = f(u, d, s);
        return { q: `With constituent masses $m_u = m_d = ${mu_}$ MeV$/c^2$ and $m_s = ${ms}$ MeV$/c^2$, quark moments are $\\mu_q = Q_q\\dfrac{m_p}{m_q}\\mu_N$ ($m_pc^2 = 938.27$ MeV). The quark-model moment of the $${n}$, $\\mu = ${txt}$, is ______ $\\mu_N$ (to three decimal places).`,
          answer: round(val, 3), tol: 0.003, unit: 'μN', mu_, ms, idx,
          sol: `$\\mu_u = ${round(u, 4)}$, $\\mu_d = ${round(d, 4)}$, $\\mu_s = ${round(s, 4)}\\,\\mu_N$. Then $\\mu = ${txt} = ${round(val, 3)}\\,\\mu_N$.`,
          trap: 'Signs: $d$ and $s$ quarks have negative moments.' };
      },
      verify: (p) => { const u = 2 / 3 * MP / p.mu_, d = -1 / 3 * MP / p.mu_, s = -1 / 3 * MP / p.ms; return [(4 * u - d) / 3, (4 * d - u) / 3, (4 * u - s) / 3, (4 * d - s) / 3, (4 * s - u) / 3, (4 * s - d) / 3, s, 3 * s][p.idx]; } },
    ...more,
    ...r4.gens,
  ],
};

// Tidy signs in generated text ("+ -3" -> "- 3", "1x" -> "x"); see _signs.js.
export default tidyPhys(topicBank, ["pqk-g02"]);
