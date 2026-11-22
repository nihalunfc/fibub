// Extra question shapes for quark-model (templates qk-m31..m35). Imported by quark-model.js.
import { choose, mcqOptions, shuffle } from '../_util.js';
import { msqOf } from './_more.js';
import { oneOf, matchOne } from './_odd.js';
import { nt } from './_vary.js';

export default [
  { id: 'qk-m31', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'quark content', format: 'statements',
    make(r) {
      const not = r() < 0.5;
      const m = msqOf(r, [
        ['$3\\otimes\\bar3 = 8\\oplus1$', true, 'Nine quark-antiquark flavour states: an octet and a singlet.'],
        ['$3\\otimes3\\otimes3 = 10\\oplus8\\oplus8\\oplus1$', true, '27 states: symmetric decuplet, two mixed octets, antisymmetric singlet.'],
        ['the $\\Omega^-$ is $sss$ with strangeness $-3$', true, 'Each $s$ quark carries $S = -1$.'],
        ['the $\\Omega^-$ has strangeness $-2$', false, 'It has three $s$ quarks: $S = -3$.'],
        ['$\\Lambda$ and $\\Sigma^0$ have the same quark content, $uds$', true, 'They differ in the isospin of the $ud$ pair (0 for $\\Lambda$, 1 for $\\Sigma^0$).'],
        ['the $\\Xi^0$ is $uss$', true, 'Charge $\\tfrac23 - \\tfrac13 - \\tfrac13 = 0$, $S = -2$.'],
        ['$\\pi^0 = (u\\bar u + d\\bar d)/\\sqrt2$', false, 'The isospin-1 combination is $(u\\bar u - d\\bar d)/\\sqrt2$; the plus sign belongs to the isospin-0 state.'],
        ['$K^+ = u\\bar s$', true, 'Charge $\\tfrac23 + \\tfrac13 = 1$, $S = +1$.'],
        ['$K^+ = \\bar us$', false, 'That is the $K^-$ ($S = -1$, charge $-1$).'],
      ], { not });
      return { q: `Which of the following statements about the quark model are ${nt(not)}?`, ...m,
        trap: 'An $s$ quark has $S = -1$, so an $\\bar s$ antiquark (as in $K^+$) has $S = +1$.' };
    } },
  { id: 'qk-m32', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'SU(3) multiplets',
    make(r) {
      const not = r() < 0.5;
      const m = oneOf(r, [
        ['the ratio $\\mu_p/\\mu_n$ comes out as $-3/2$', true, 'SU(6) wavefunctions with $\\mu_u = -2\\mu_d$ give exactly $-3/2$ (measured $-1.46$).'],
        ['the decuplet masses are nearly equally spaced in strangeness', true, 'About 150 MeV per unit of $|S|$, which predicted the $\\Omega^-$.'],
        ['a $q\\bar q$ meson cannot have $J^{PC} = 0^{--}$', true, '$P = (-1)^{L+1}$ and $C = (-1)^{L+S}$ never give this combination.'],
        ['all observed hadrons are colour singlets', true, 'Confinement allows only colourless states.'],
        ['a baryon can have charge $+2$', true, 'The $\\Delta^{++}$ is $uuu$.'],
        ['a baryon can have charge $-2$', false, 'Three quarks give at least $3\\times(-\\tfrac13) = -1$.'],
        ['a $q\\bar q$ meson can have charge $+2$', false, 'The largest is $\\tfrac23 + \\tfrac13 = +1$.'],
        ['a three-quark baryon can have strangeness $+1$', false, 'Only $\\bar s$ carries $S = +1$, and an ordinary baryon has no antiquarks.'],
      ], not);
      return { q: `Which statement about the predictions of the quark model is ${nt(not)}?`, ...m,
        trap: 'Charges of $qqq$ run from $-1$ to $+2$; of $q\\bar q$ from $-1$ to $+1$.' };
    } },
  { id: 'qk-m33', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'SU(3) multiplets', format: 'match',
    make(r) {
      const L = { oct: 'the $J^P = \\tfrac12^+$ baryon octet', dec: 'the $J^P = \\tfrac32^+$ baryon decuplet', ps: 'the $J^P = 0^-$ meson nonet', vec: 'the $J^P = 1^-$ meson nonet', sc: 'the $J^P = 0^+$ meson nonet', neg: 'the $J^P = \\tfrac12^-$ baryons' };
      const cas = choose(r, [
        ['$\\Lambda(1116)$', 'oct', 'Spin 1/2, $uds$ with isospin 0, ground state.'],
        ['$\\Sigma^*(1385)$', 'dec', 'The strangeness $-1$ member of the decuplet, decaying strongly to $\\Lambda\\pi$.'],
        ['$\\eta(548)$', 'ps', 'A pseudoscalar like the pion and kaon ($L = 0$, quark spins antiparallel).'],
        ['$\\phi(1020)$', 'vec', 'Almost pure $s\\bar s$ with quark spins parallel ($L = 0$, $S = 1$).'],
        ['$\\Omega^-(1672)$', 'dec', 'The $sss$ apex of the decuplet; spin 3/2.'],
        ['$K^*(892)$', 'vec', 'The vector partner of the kaon.'],
        ['$\\Xi^-(1321)$', 'oct', 'The $dss$ member of the octet, spin 1/2.'],
      ]);
      return { q: `The hadron ${cas[0]} belongs to`, ...matchOne(r, L, cas),
        trap: 'A starred name or a mass a few hundred MeV above the ground state usually marks the excited (decuplet or vector) multiplet.' };
    } },
  { id: 'qk-m34', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'counting states', format: 'limiting case',
    make(r) {
      const n = choose(r, [2, 3, 4]);
      const K = [
        ['quark-antiquark flavour combinations $q\\bar q$', n * n],
        ['totally symmetric three-quark flavour states', (n * (n + 1) * (n + 2)) / 6],
        ['totally antisymmetric three-quark flavour states', (n * (n - 1) * (n - 2)) / 6],
        ['three-quark flavour states in all', n ** 3],
        ['three-quark flavour states in one mixed-symmetry multiplet', (n * (n * n - 1)) / 3],
      ];
      const [what, ans] = choose(r, K);
      const o = mcqOptions(r, ans, shuffle(r, [...K.map((k) => k[1]), n * n - 1, 2 * n, n * (n + 1) / 2]));
      return { q: `With ${n} quark flavours (and flavour symmetry exact), the number of ${what} is`,
        options: o.options, answer: o.answer,
        sol: `For $n = ${n}$: $q\\bar q$ gives $n^2 = ${n * n}$; three quarks give $n^3 = ${n ** 3}$ in all, split into symmetric $\\tfrac{n(n+1)(n+2)}{6} = ${(n * (n + 1) * (n + 2)) / 6}$, antisymmetric $\\tfrac{n(n-1)(n-2)}{6} = ${(n * (n - 1) * (n - 2)) / 6}$, and two mixed multiplets of $\\tfrac{n(n^2 - 1)}{3} = ${(n * (n * n - 1)) / 3}$ each. So the answer is ${ans}. (Check: $${(n * (n + 1) * (n + 2)) / 6} + ${(n * (n - 1) * (n - 2)) / 6} + 2\\times${(n * (n * n - 1)) / 3} = ${n ** 3}$.) For $n = 3$ these are the familiar 9, 10, 1, 27 and 8.`,
        trap: 'The two mixed-symmetry multiplets have the same size; for $n = 2$ there is no antisymmetric state at all.' };
    } },
  { id: 'qk-m35', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'magnetic moments',
    make(r) {
      const [h, val, num, why] = choose(r, [
        ['\\Delta^{++}', '2', 2, '$\\mu = 3\\mu_u$ (all spins aligned), and $\\mu_p = \\tfrac43\\mu_u - \\tfrac13\\mu_d = \\tfrac32\\mu_u$, so the ratio is 2.'],
        ['\\Delta^{+}', '1', 1, '$\\mu = 2\\mu_u + \\mu_d = \\tfrac32\\mu_u$, equal to $\\mu_p$.'],
        ['\\Delta^{0}', '0', 0, '$\\mu = \\mu_u + 2\\mu_d = 0$ with $\\mu_d = -\\mu_u/2$.'],
        ['\\Delta^{-}', '-1', -1, '$\\mu = 3\\mu_d = -\\tfrac32\\mu_u = -\\mu_p$.'],
        ['n', '-\\tfrac23', -2 / 3, '$\\mu_n = \\tfrac43\\mu_d - \\tfrac13\\mu_u = -\\mu_u$, and $\\mu_p = \\tfrac32\\mu_u$.'],
      ]);
      const pool = ['2', '1', '0', '-1', '-\\tfrac23', '\\tfrac32', '-\\tfrac32', '3'].filter((s) => s !== val);
      const o = mcqOptions(r, `$${val}$`, shuffle(r, pool).map((s) => `$${s}$`));
      return { q: `In the non-relativistic quark model with $m_u = m_d$ (so $\\mu_d = -\\mu_u/2$), the ratio $\\mu(${h})/\\mu_p$ for the state with maximum $J_z$ is`,
        options: o.options, answer: o.answer,
        sol: `${why} Decuplet states have all three quark spins aligned, so $\\mu$ is simply the sum of the quark moments. ${num === 2 ? 'The measured value, about 2 within errors, supports this.' : ''}`,
        trap: 'Octet wavefunctions mix spins ($\\tfrac43$ and $-\\tfrac13$ weights); decuplet states just add the three quark moments.' };
    } },
];
