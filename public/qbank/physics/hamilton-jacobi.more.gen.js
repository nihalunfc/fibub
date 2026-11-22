// Extra question shapes for hamilton-jacobi (templates hjt-m31..m35). Imported by hamilton-jacobi.js.
import { int, choose, mcqOptions, shuffle } from '../_util.js';
import { msqOf, frac } from './_more.js';
import { oneOf, matchOne } from './_odd.js';

export default [
  { id: 'hjt-m31', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'separation of variables', format: 'statements',
    make(r) {
      const k = int(r, 1, 5);
      const V = choose(r, [
        [`\\tfrac{${k}}{2}(x^2 + y^2 + z^2)`, true, true, true, 'An isotropic oscillator is a sum of $x$, $y$, $z$ terms and also a function of $r$ alone (and of $\\rho$ plus $z$).'],
        [`-\\dfrac{${k}}{r}`, false, true, false, 'A function of $r$ alone separates in spherical coordinates; in Cartesian or cylindrical coordinates $1/\\sqrt{x^2 + y^2 + z^2}$ mixes the variables.'],
        [`${k}x + y^2`, true, false, false, 'A sum of a function of $x$ and a function of $y$: Cartesian. In polar forms the terms mix $r$ and the angles.'],
        ['f(r) + \\dfrac{g(\\theta)}{r^2}', false, true, false, 'Multiplying the spherical HJ equation by $r^2$ separates $g(\\theta)$ from the radial part; no other system works.'],
        ['f(\\rho) + h(z)', false, false, true, 'A function of the distance from the axis plus a function of $z$: cylindrical (for general $f$).'],
      ]);
      const not = r() < 0.5;
      const m = msqOf(r, [
        ['its Hamilton-Jacobi equation separates in Cartesian coordinates', V[1], V[4]],
        ['its Hamilton-Jacobi equation separates in spherical polar coordinates', V[2], V[4]],
        ['its Hamilton-Jacobi equation separates in cylindrical coordinates', V[3], V[4]],
        ['since $H$ has no explicit time dependence, $S = W(\\vec q) - Et$', true, 'Time separates off whenever $\\partial H/\\partial t = 0$.'],
        ['the separation constants can serve as the new, constant momenta', true, 'That is what makes the transformed Hamiltonian trivial.'],
        ['Hamilton\'s principal function $S$ is the same thing as the Lagrangian', false, '$S$ is the time integral of the Lagrangian along the path, $dS/dt = L$.'],
      ], { not });
      return { q: `A particle moves in the potential $V = ${V[0]}$ (with $r$, $\\rho$ the distances from the origin and from the $z$-axis). Which statements are ${not ? '<b>NOT</b> correct' : 'correct'}?`, ...m,
        trap: 'Separability depends on the coordinates: a potential can separate in one system and not in another.' };
    } },
  { id: 'hjt-m32', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'action-angle variables',
    make(r) {
      const C = choose(r, [
        ['$V = c|q|$ (a V-shaped well)', '-\\tfrac14', 'n = 1'],
        ['$V = cq^2$', '0', 'n = 2'],
        ['$V = cq^4$', '\\tfrac14', 'n = 4'],
        ['$V = cq^6$', '\\tfrac13', 'n = 6'],
        ['a box with hard walls (free motion between them)', '\\tfrac12', 'n \\to \\infty'],
      ]);
      const pool = ['-\\tfrac14', '0', '\\tfrac14', '\\tfrac13', '\\tfrac12', '-\\tfrac12', '1'];
      const show = (p) => `$\\omega \\propto E^{${p}}$`;
      const o = mcqOptions(r, show(C[1]), shuffle(r, pool.filter((p) => p !== C[1]).map(show)));
      return { q: `A particle oscillates in ${C[0]}. How does the angular frequency $\\omega$ of the motion depend on its energy $E$?`, ...o,
        sol: `For $V = c|q|^n$ the action is $J = \\oint p\\,dq \\propto \\sqrt E\\,q_0$ with turning point $q_0 = (E/c)^{1/n}$, so $J \\propto E^{1/2 + 1/n}$ and $H \\propto J^{2n/(n + 2)}$. Then $\\omega = \\partial H/\\partial J \\propto J^{(n - 2)/(n + 2)} \\propto E^{(n - 2)/(2n)}$. Here $${C[2]}$, giving exponent $${C[1]}$.${C[1] === '0' ? ' The harmonic oscillator is the only power law with an amplitude-independent period.' : ''}`,
        trap: 'Only the quadratic potential has a frequency independent of energy; stiffer walls make larger oscillations faster.' };
    } },
  { id: 'hjt-m33', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'principal function',
    make(r) {
      const m = choose(r, [1, 2, 4]), x0 = int(r, -2, 2), d = choose(r, [2, 3, 4, 6]), t = choose(r, [1, 2]), x = x0 + d;
      const p = frac(m * d, t), E = frac(m * d * d, 2 * t * t);
      const pair = (a, b) => `$p = ${a},\\ E = ${b}$`;
      const o = mcqOptions(r, pair(p, E), shuffle(r, [pair(E, p), pair(frac(m * d, 2 * t), E), pair(p, frac(m * d * d, t * t)), pair(`-${p}`, E), pair(p, `-${E}`)]));
      const xs = x0 === 0 ? 'x' : `x ${x0 < 0 ? '+' : '-'} ${Math.abs(x0)}`;
      return { q: `For a free particle of mass $m = ${m}$, Hamilton's principal function for paths that leave $x_0 = ${x0}$ at $t = 0$ is $S(x, t) = \\dfrac{m(${xs})^2}{2t}$. At $x = ${x}$, $t = ${t}$ (consistent units), the momentum $p = \\partial S/\\partial x$ and the energy $E = -\\partial S/\\partial t$ are`, ...o,
        sol: `$p = \\dfrac{\\partial S}{\\partial x} = \\dfrac{m(x - x_0)}{t} = \\dfrac{${m}\\times${d}}{${t}} = ${p}$ and $E = -\\dfrac{\\partial S}{\\partial t} = \\dfrac{m(x - x_0)^2}{2t^2} = ${E}$. Check: $p^2/2m = ${E}$, as it must for a free particle (and the velocity $(x - x_0)/t$ is uniform).`,
        trap: 'The energy is minus the time derivative of $S$; check it against $p^2/2m$.' };
    } },
  { id: 'hjt-m34', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'optical analogy', format: 'match',
    make(r) {
      const L = { eik: 'the optical path length (eikonal)', front: 'wavefronts', ray: 'rays (normal to the wavefronts)', index: 'the refractive index', fermat: 'Fermat\'s principle of least time' };
      const cas = choose(r, [
        ['Hamilton\'s characteristic function $W(\\vec q)$', 'eik', 'The eikonal equation $|\\nabla S_{\\text{opt}}| = n$ has the same form as $|\\nabla W| = \\sqrt{2m(E - V)}$.'],
        ['the surfaces $W = $ const', 'front', 'Surfaces of constant phase in optics; the HJ "wavefronts" of mechanics.'],
        ['the particle trajectories, along $\\vec p = \\nabla W$', 'ray', 'Momentum is the gradient of $W$, so trajectories cross the surfaces $W = $ const at right angles, like rays.'],
        ['the quantity $\\sqrt{2m(E - V(\\vec r))}$', 'index', 'It plays the part of $n(\\vec r)$: the particle bends towards regions where it is larger (where it moves faster), unlike light.'],
        ['Maupertuis\' principle $\\delta\\int p\\,ds = 0$', 'fermat', 'Fermat: $\\delta\\int n\\,ds = 0$, with $p$ in place of $n$.'],
      ]);
      return { q: `In the analogy between Hamilton-Jacobi theory and geometrical optics, ${cas[0]} corresponds to`, ...matchOne(r, L, cas),
        trap: 'The HJ equation $|\\nabla W|^2 = 2m(E - V)$ is the eikonal equation of optics with $n \\leftrightarrow \\sqrt{2m(E - V)}$.' };
    } },
  { id: 'hjt-m35', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'adiabatic invariants', format: 'which is NOT',
    make(r) {
      const not = r() < 0.6;
      const m = oneOf(r, [
        ['$E/\\omega$ of an oscillator whose spring is slowly stiffened', true, 'It equals the action $J/2\\pi$.'],
        ['the magnetic moment $mv_\\perp^2/2B$ of a charge gyrating in a slowly changing field', true, 'It is proportional to the action of the gyration.'],
        ['the magnetic flux through the orbit of a gyrating charge in a slowly changing field', true, 'Equivalent to the conservation of the magnetic moment.'],
        ['the product $pL$ for a particle bouncing in a box whose width $L$ changes slowly', true, 'The action $\\oint p\\,dq = 2pL$.'],
        ['the number of photons in a cavity mode whose frequency is changed slowly', true, 'Each photon\'s energy scales with $\\omega$ while $E/\\omega$ stays fixed.'],
        ['the energy of an oscillator whose spring is slowly stiffened', false, 'The energy rises in proportion to $\\omega$; only $E/\\omega$ stays fixed.'],
        ['the amplitude of a pendulum whose string is slowly shortened', false, 'The amplitude grows (as $l^{-3/4}$); the action stays fixed.'],
        ['the period of an oscillator whose spring is slowly stiffened', false, 'The period falls as $1/\\omega$.'],
        ['the speed $v_\\perp$ of a charge gyrating in a slowly strengthening field', false, '$v_\\perp^2 \\propto B$, so it grows.'],
      ], not);
      return { q: `For a parameter changed very slowly compared with the period of the motion, which quantity is ${not ? '<b>NOT</b> an adiabatic invariant' : 'an adiabatic invariant'}?`, ...m,
        trap: 'Actions $\\oint p\\,dq$ are invariant; energies, amplitudes and periods are not.' };
    } },
];
