// Extra question shapes for multipoles (templates mpl-m31..m35). Imported by multipoles.js.
import { int, choose, mcqOptions, shuffle, round } from '../_util.js';
import { msqOf } from './_more.js';
import { oneOf, matchOne, orderOpts } from './_odd.js';

export default [
  { id: 'mpl-m31', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'multipole moments', format: 'statements',
    make(r) {
      const C = choose(r, [
        ['$+q$ at $z = a$ and $-q$ at $z = -a$', 0, 2, 2],
        ['$+q$ at $z = a$, $+q$ at $z = -a$ and $-2q$ at the origin', 0, 0, 3],
        ['$+2q$ at $z = a$ and $-q$ at $z = -a$', 1, 3, 1],
        ['$+q$ at $(\\pm a, 0, 0)$ and $-q$ at $(0, \\pm a, 0)$', 0, 0, 3],
        ['$+3q$ at $z = a$ and $-q$ at $z = 0$', 2, 3, 1],
      ]);
      const [txt, Q, p, lead] = C, not = r() < 0.5;
      const m = msqOf(r, [
        ['the total charge is zero', Q === 0, `The total charge is $${Q === 0 ? '0' : `${Q}q`}$.`],
        ['the dipole moment about the origin is zero', p === 0, `$\\vec p = \\sum q_i\\vec r_i = ${p === 0 ? '0' : `${p}qa\\,\\hat z`}$.`],
        ['far away the potential falls off as $1/r$', lead === 1, lead === 1 ? 'Non-zero total charge dominates.' : 'The monopole term vanishes.'],
        ['far away the potential falls off as $1/r^2$', lead === 2, lead === 2 ? 'Zero charge, non-zero dipole: the dipole term leads.' : lead === 1 ? 'The monopole term already leads.' : 'Both monopole and dipole vanish.'],
        ['far away the potential falls off as $1/r^3$', lead === 3, lead === 3 ? 'Monopole and dipole vanish, so the quadrupole term leads.' : 'A lower multipole is non-zero and leads.'],
        ['the dipole moment would be the same about any other origin', Q === 0, Q === 0 ? 'Shifting the origin by $\\vec d$ changes $\\vec p$ by $-Q\\vec d = 0$.' : 'With $Q \\ne 0$, shifting the origin changes $\\vec p$ by $-Q\\vec d$.'],
        ['the far field (not the potential) falls off one power of $r$ faster than the potential', true, '$\\vec E = -\\nabla V$ adds one power of $1/r$.'],
      ], { not });
      return { q: `A charge distribution consists of ${txt}. Which statements are ${not ? '<b>NOT</b> correct' : 'correct'}?`, ...m,
        trap: 'The leading far-field term is the first non-vanishing multipole; the dipole moment depends on the origin unless the total charge is zero.' };
    } },
  { id: 'mpl-m32', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'angular patterns', format: 'graph in words',
    make(r) {
      const L = {
        mono: 'the same in every direction',
        dz: 'zero everywhere on the plane $z = 0$, positive above it and negative below',
        dx: 'zero everywhere on the plane $x = 0$, with opposite signs on its two sides',
        quad: 'zero on the cone $\\cos^2\\theta = 1/3$ (about $54.7^\\circ$ from the $z$-axis), with the same sign along both directions of the axis',
        none: 'zero in every direction (no far field at any order)',
      };
      const cas = choose(r, [
        ['a single point charge $q$ at the origin', 'mono', '$V = q/(4\\pi\\varepsilon_0r)$ depends only on $r$.'],
        ['$+q$ at $z = a$ and $-q$ at $z = -a$', 'dz', `$V \\approx \\dfrac{2qa\\cos\\theta}{4\\pi\\varepsilon_0r^2}$: sign of $\\cos\\theta$.`],
        ['$+q$ at $x = a$ and $-q$ at $x = -a$', 'dx', 'A dipole along $x$: $V \\propto x/r^3$, which vanishes on the $yz$-plane.'],
        ['$+q$ at $z = \\pm a$ and $-2q$ at the origin', 'quad', '$V \\approx \\dfrac{qa^2(3\\cos^2\\theta - 1)}{4\\pi\\varepsilon_0r^3}$: a linear quadrupole, positive along both ends of the axis.'],
      ]);
      return { q: `Far from the origin, the leading term of the potential of ${cas[0]}, as a function of direction, is`, ...matchOne(r, L, cas),
        trap: 'The leading multipole fixes the angular pattern: $1$, $\\cos\\theta$, $P_2(\\cos\\theta)$ for monopole, dipole, quadrupole.' };
    } },
  { id: 'mpl-m33', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'dipole fields',
    make(r) {
      const P = choose(r, [[0, 1, 90, 1], [0, 1, 90, 2], [60, 1, 90, 1], [0, 2, 0, 1], [60, 1, 0, 1], [30, 1, 90, 1]]);
      const [t1, r1, t2, r2] = P, f = (t, rr) => Math.sqrt(3 * Math.cos((t * Math.PI) / 180) ** 2 + 1) / rr ** 3;
      const ans = round(f(t1, r1) / f(t2, r2), 3);
      const o = mcqOptions(r, ans, shuffle(r, [round(1 / ans, 3), round(ans * 2, 3), round(ans / 2, 3), round(((r2 / r1) ** 2) * (f(t1, 1) / f(t2, 1)), 3), round(f(t1, 1) / f(t2, 1) * (r2 / r1), 3)]));
      return { q: `For an ideal dipole at the origin pointing along $z$, compare the field strength at distance $${r1 === 1 ? '' : r1}d$, angle $${t1}^\\circ$ from the axis, with that at distance $${r2 === 1 ? '' : r2}d$, angle $${t2}^\\circ$. The ratio $|E_1|/|E_2|$ is`, ...o,
        sol: `$|\\vec E| = \\dfrac{p}{4\\pi\\varepsilon_0r^3}\\sqrt{3\\cos^2\\theta + 1}$. So $\\dfrac{|E_1|}{|E_2|} = \\dfrac{\\sqrt{3\\cos^2${t1}^\\circ + 1}/${r1}^3}{\\sqrt{3\\cos^2${t2}^\\circ + 1}/${r2}^3} = ${ans}$. On the axis the factor is 2, on the equator 1.`,
        trap: 'Dipole fields fall as $1/r^3$ and are twice as strong on the axis as on the equator at the same distance.' };
    } },
  { id: 'mpl-m34', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'molecular dipoles', format: 'order of magnitude',
    make(r) {
      const D = choose(r, [[0.5, '0.5 nm'], [1, '1 nm'], [3, '3 nm'], [10, '10 nm']]);
      const E = (2 * 8.99e9 * 6.2e-30) / (D[0] * 1e-9) ** 3, o = orderOpts(r, E, '\\text{V/m}');
      return { q: `A water molecule has a dipole moment of about $6.2\\times10^{-30}$ C m. Treated as an ideal dipole, the field it produces on its axis at a distance of ${D[1]} is of order`, ...o,
        sol: `On the axis $E = \\dfrac{2p}{4\\pi\\varepsilon_0r^3} = \\dfrac{2\\times8.99\\times10^9\\times6.2\\times10^{-30}}{(${D[0]}\\times10^{-9})^3} \\approx ${(E / 10 ** o.n).toFixed(1)}\\times10^{${o.n}}$ V/m, of order $10^{${o.n}}$ V/m. The $1/r^3$ fall-off makes molecular fields enormous close by and tiny a few nanometres away.`,
        trap: 'Cube the distance: going from 1 nm to 10 nm lowers the field by $10^3$.' };
    } },
  { id: 'mpl-m35', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'multipole facts', format: 'which is NOT',
    make(r) {
      const not = r() < 0.6;
      const m = oneOf(r, [
        ['the dipole moment does not depend on the choice of origin when the total charge is zero', true, '$\\vec p\' = \\vec p - Q\\vec d$.'],
        ['the quadrupole tensor $Q_{ij} = \\sum q(3x_ix_j - r^2\\delta_{ij})$ is traceless', true, 'Its trace is $\\sum q(3r^2 - 3r^2) = 0$.'],
        ['outside a spherically symmetric charge distribution only the monopole term survives', true, 'All higher moments vanish by symmetry (shell theorem).'],
        ['the field outside a uniformly polarised sphere is exactly a dipole field', true, 'Its surface charge $P\\cos\\theta$ has only an $\\ell = 1$ component.'],
        ['the traceless quadrupole tensor has 5 independent components', true, 'Symmetric (6) minus traceless (1).'],
        ['the dipole moment never depends on the choice of origin', false, 'It does when $Q \\ne 0$: $\\vec p\' = \\vec p - Q\\vec d$.'],
        ['a neutral distribution produces no field far away at any order', false, 'Its dipole or higher moments still give fields falling as $1/r^3$ or faster.'],
        ['the quadrupole potential falls off as $1/r^2$', false, 'Monopole $1/r$, dipole $1/r^2$, quadrupole $1/r^3$.'],
        ['the quadrupole tensor has 9 independent components', false, 'It is symmetric and traceless: 5.'],
      ], not);
      return { q: `Which statement about the multipole expansion of a static charge distribution is ${not ? '<b>NOT</b> correct' : 'correct'}?`, ...m,
        trap: 'Each order falls one power of $r$ faster; only the lowest non-zero moment is independent of origin.' };
    } },
];
