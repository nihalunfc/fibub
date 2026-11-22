// Extra question shapes for conservation-laws (templates cnl-m31..m35). Imported by conservation-laws.js.
import { choose, shuffle, mcqOptions } from '../_util.js';
import { msqOf } from './_more.js';
import { oneOf, orderOpts, matchOne } from './_odd.js';
import { nt, sci } from './_vary.js';

// [TeX, Q, B, Le, Lmu, S]
const P = {
  p: ['p', 1, 1, 0, 0, 0], n: ['n', 0, 1, 0, 0, 0], em: ['e^-', -1, 0, 1, 0, 0], ep: ['e^+', 1, 0, -1, 0, 0],
  ne: ['\\nu_e', 0, 0, 1, 0, 0], nbe: ['\\bar\\nu_e', 0, 0, -1, 0, 0], mm: ['\\mu^-', -1, 0, 0, 1, 0], mp: ['\\mu^+', 1, 0, 0, -1, 0],
  nm: ['\\nu_\\mu', 0, 0, 0, 1, 0], nbm: ['\\bar\\nu_\\mu', 0, 0, 0, -1, 0], pip: ['\\pi^+', 1, 0, 0, 0, 0], pim: ['\\pi^-', -1, 0, 0, 0, 0],
  pi0: ['\\pi^0', 0, 0, 0, 0, 0], kp: ['K^+', 1, 0, 0, 0, 1], km: ['K^-', -1, 0, 0, 0, -1], k0: ['K^0', 0, 0, 0, 0, 1],
  lam: ['\\Lambda', 0, 1, 0, 0, -1], sp: ['\\Sigma^+', 1, 1, 0, 0, -1], g: ['\\gamma', 0, 0, 0, 0, 0],
};
const LAWS = ['charge', 'baryon number', 'electron lepton number', 'muon lepton number', 'strangeness'];
const REACT = [
  [['p'], ['ep', 'g']], [['n'], ['p', 'em', 'nbe']], [['mm'], ['em', 'g']], [['mm'], ['em', 'nbe', 'nm']],
  [['pim', 'p'], ['lam', 'k0']], [['pim', 'p'], ['km', 'p']], [['p', 'p'], ['p', 'p', 'n']], [['n'], ['p', 'em', 'ne']],
  [['pip'], ['mp', 'ne']], [['lam'], ['p', 'pim']], [['nm', 'n'], ['mp', 'p']], [['kp'], ['pip', 'pi0']],
  [['em', 'p'], ['ne', 'n']], [['sp'], ['n', 'pip']], [['pip', 'n'], ['kp', 'lam']],
];
const setText = (s) => (s.length === 0 ? 'none of them' : s.length === 1 ? `${s[0]} only` : `${s.slice(0, -1).join(', ')} and ${s[s.length - 1]}`);

export default [
  { id: 'cnl-m31', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'which interaction', format: 'statements',
    make(r) {
      const it = choose(r, ['strong', 'electromagnetic', 'weak']), not = r() < 0.5;
      const T = {
        S: { strong: true, electromagnetic: true, weak: false }, I: { strong: true, electromagnetic: false, weak: false },
        P: { strong: true, electromagnetic: true, weak: false }, C: { strong: true, electromagnetic: true, weak: false },
      };
      const why = (k, v) => `${v ? 'Conserved' : 'Not conserved'} by the ${it} interaction. ${{ S: 'Only the weak interaction changes quark flavour, so only it changes strangeness.', I: 'Isospin is a symmetry of the strong force alone; electromagnetism (charges of u and d differ) and the weak force break it.', P: 'Parity is violated only by the weak interaction (maximally, it couples to left-handed fermions).', C: 'Charge conjugation is violated only by the weak interaction.' }[k]}`;
      const m = msqOf(r, [
        ['strangeness is conserved', T.S[it], why('S', T.S[it])],
        ['total isospin is conserved', T.I[it], why('I', T.I[it])],
        ['parity is conserved', T.P[it], why('P', T.P[it])],
        ['charge conjugation is conserved', T.C[it], why('C', T.C[it])],
        ['baryon number is conserved', true, 'No interaction of the Standard Model changes baryon number in any observed process.'],
        ['electric charge is conserved', true, 'Exact for every interaction.'],
        ['CPT is conserved', true, 'The CPT theorem holds for any local Lorentz-invariant quantum field theory.'],
        ['total lepton number can change by one unit', false, 'Lepton number is conserved in every observed process.'],
        ['baryon number can change by one unit', false, 'No observed process changes baryon number (the proton is stable to beyond $10^{33}$ years).'],
      ], { not });
      return { q: `In processes governed by the <b>${it}</b> interaction, which of the following are ${nt(not)}?`, ...m,
        trap: 'Strong conserves everything listed; electromagnetic breaks only isospin; weak breaks S, I, P and C.' };
    } },
  { id: 'cnl-m32', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'charge conjugation',
    make(r) {
      const not = r() < 0.5;
      const m = oneOf(r, [
        ['the photon has $C = -1$', true, 'The electromagnetic field changes sign when all charges change sign.'],
        ['$\\pi^0 \\to 3\\gamma$ is forbidden by C', true, '$C(\\pi^0) = +1$ but three photons have $C = (-1)^3 = -1$.'],
        ['para-positronium ($^1S_0$) decays into two photons', true, '$C = (-1)^{L+S} = +1$ matches two photons.'],
        ['ortho-positronium ($^3S_1$) decays into three photons', true, '$C = (-1)^{0+1} = -1$, so it needs an odd number of photons.'],
        ['a fermion and its antifermion have opposite intrinsic parity', true, 'A property of the Dirac equation.'],
        ['$\\pi^0 \\to 3\\gamma$ is allowed because it conserves energy and charge', false, 'It violates C conservation of the electromagnetic interaction.'],
        ['ortho-positronium decays mainly into two photons', false, 'Two photons have $C = +1$, but ortho-positronium has $C = -1$.'],
        ['the parity of a quark-antiquark meson with orbital angular momentum $L$ is $(-1)^L$', false, 'It is $(-1)^{L+1}$: the opposite intrinsic parities add a minus sign.'],
      ], not);
      return { q: `Which statement about C and P quantum numbers is ${nt(not)}?`, ...m,
        trap: 'An $n$-photon state has $C = (-1)^n$; a fermion-antifermion pair has $P = (-1)^{L+1}$ and $C = (-1)^{L+S}$.' };
    } },
  { id: 'cnl-m33', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'Noether', format: 'match',
    make(r) {
      const L = {
        time: 'translations in time', space: 'translations in space', rot: 'rotations', phase: 'a change of the overall phase of charged fields (a U(1) gauge symmetry)',
        iso: 'rotations in isospin space (up and down quarks interchanged)', lor: 'Lorentz transformations, in any local quantum field theory',
      };
      const cas = choose(r, [
        ['energy', 'time', 'If the laws do not change with time, energy is conserved.'],
        ['linear momentum', 'space', 'If the laws are the same everywhere, momentum is conserved.'],
        ['angular momentum', 'rot', 'If no direction is special, angular momentum is conserved.'],
        ['electric charge', 'phase', 'The global phase symmetry gives a conserved current; making it local gives electromagnetism.'],
        ['isospin (in strong interactions)', 'iso', 'An approximate symmetry because $m_u \\approx m_d$ and the strong force ignores flavour.'],
        ['CPT symmetry', 'lor', 'The CPT theorem follows from Lorentz invariance, locality and the spin-statistics connection.'],
      ]);
      return { q: `Conservation of ${cas[0]} is the consequence of invariance under`, ...matchOne(r, L, cas),
        trap: 'Noether: each continuous symmetry gives a conserved quantity.' };
    } },
  { id: 'cnl-m34', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'allowed or forbidden',
    make(r) {
      const [a, b] = choose(r, REACT);
      const sum = (xs, k) => xs.reduce((s, x) => s + P[x][k], 0);
      const bad = LAWS.filter((_, i) => sum(a, i + 1) !== sum(b, i + 1));
      const show = (xs) => xs.map((x) => P[x][0]).join(' + ');
      const alt = shuffle(r, LAWS).slice(0, 4).map((l) => (bad.includes(l) ? bad.filter((x) => x !== l) : LAWS.filter((x) => bad.includes(x) || x === l)));
      const o = mcqOptions(r, setText(bad), [...alt.map(setText), setText(LAWS.slice(0, 2)), setText(['strangeness'])]);
      const rows = LAWS.map((l, i) => `${l}: ${sum(a, i + 1)} before, ${sum(b, i + 1)} after`).join('; ');
      return { q: `Which of charge, baryon number, electron lepton number, muon lepton number and strangeness are violated in $${show(a)} \\to ${show(b)}$?`,
        options: o.options, answer: o.answer,
        sol: `Add up each quantum number on both sides. ${rows}. So the violated quantities are: ${setText(bad)}.${bad.length === 1 && bad[0] === 'strangeness' ? ' A change of strangeness by one unit is allowed for the weak interaction, so this can still happen (weakly) if energy allows.' : bad.length === 0 ? ' Nothing listed forbids it.' : ''}`,
        trap: 'Track the electron and muon lepton numbers separately; antineutrinos carry $-1$.' };
    } },
  { id: 'cnl-m35', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'helicity', format: 'order of magnitude',
    make(r) {
      const [M, nm] = choose(r, [[139.57, '\\pi^+'], [493.68, 'K^+']]), me = 0.511, mm = 105.66;
      const x = (me / mm) ** 2 * ((M * M - me * me) / (M * M - mm * mm)) ** 2;
      const o = orderOpts(r, x);
      return { q: `Ignoring radiative corrections, the ratio $\\Gamma(${nm} \\to e^+\\nu_e)/\\Gamma(${nm} \\to \\mu^+\\nu_\\mu)$ predicted by the V-A theory is of order`,
        options: o.options, answer: o.answer,
        sol: `The spin-0 meson must give a right-handed antilepton, but V-A produces it left-handed except for a term proportional to its mass. So $\\Gamma \\propto m_\\ell^2(M^2 - m_\\ell^2)^2$, and the ratio is $\\left(\\tfrac{m_e}{m_\\mu}\\right)^2\\left(\\tfrac{M^2 - m_e^2}{M^2 - m_\\mu^2}\\right)^2 = ${sci(x)}$, even though the electron channel has more phase space.`,
        trap: 'Phase space alone favours the electron; helicity suppression ($\\propto m_\\ell^2$) wins by about four orders of magnitude.' };
    } },
];
