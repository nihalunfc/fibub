// Extra question shapes for retarded-potentials (templates netrp-m31..m35). Imported by retarded-potentials.js.
import { choose, mcqOptions } from '../_util.js';
import { msqOf } from './_more.js';
import { oneOf, orderOpts, matchOne } from './_odd.js';
import { vs, nt, sci } from './_vary.js';

export default [
  { id: 'netrp-m31', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'dipole radiation', format: 'statements',
    make(r) {
      const k = choose(r, [2, 3, 0.5]), k4 = k ** 4, k2 = k ** 2, not = r() < 0.5;
      const kt = k === 0.5 ? 'halved' : k === 2 ? 'doubled' : 'tripled';
      const m = msqOf(r, [
        vs(r, `if the frequency of an oscillating electric dipole of fixed amplitude is ${kt}, the radiated power is multiplied by ${k4}`, `if the frequency of an oscillating electric dipole of fixed amplitude is ${kt}, the radiated power is multiplied by ${k2}`, `$P = \\mu_0p_0^2\\omega^4/(12\\pi c)$, so the factor is $${k}^4 = ${k4}$.`),
        ['a charge moving with constant velocity does not radiate', true, 'Its field is just a Lorentz-transformed Coulomb field that moves with it.'],
        ['radiation fields fall off as $1/r$ while velocity (Coulomb-like) fields fall off as $1/r^2$', true, 'Only the $1/r$ part carries energy to infinity.'],
        ['an oscillating electric dipole radiates most strongly along its axis', false, 'The pattern is $\\sin^2\\theta$: zero along the axis, maximum perpendicular to it.'],
        ['the Larmor power is proportional to the square of the acceleration', true, '$P = q^2a^2/(6\\pi\\varepsilon_0c^3)$.'],
        ['magnetic dipole radiation from a system of size $d$ is weaker than electric dipole radiation by a factor of order $(\\omega d/c)^2$', true, 'Higher multipoles carry extra powers of (size/wavelength).'],
        ['an ultra-relativistic charge radiates mostly into a forward cone of angle about $1/\\gamma$', true, 'Relativistic beaming.'],
        ['a spherically symmetric pulsating charge distribution radiates as a monopole', false, 'Charge conservation fixes the monopole moment; by symmetry and Birkhoff-like arguments the outside field stays Coulomb, so nothing is radiated.'],
      ], { not });
      return { q: `Which of the following statements about radiation from charges are ${nt(not)}?`, ...m,
        trap: 'Dipole power goes as $\\omega^4$ at fixed dipole amplitude (as $\\omega^2$ only at fixed current amplitude).' };
    } },
  { id: 'netrp-m32', type: 'mcq', level: 4, exams: ['net'], sub: 'Liénard-Wiechert potentials',
    make(r) {
      const not = r() < 0.5;
      const m = oneOf(r, [
        ['the retarded time is defined by $t_r = t - |\\vec r - \\vec r\\,\'(t_r)|/c$', true, 'Information from the source travels at $c$.'],
        ['in the Lorenz gauge both $V$ and $\\vec A$ obey inhomogeneous wave equations', true, '$\\Box V = -\\rho/\\varepsilon_0$, $\\Box\\vec A = -\\mu_0\\vec J$.'],
        ['the Liénard-Wiechert potentials contain the factor $1/(1 - \\hat n\\cdot\\vec\\beta)$ evaluated at the retarded time', true, 'A moving point charge spends a longer or shorter retarded time inside the light-cone shell.'],
        ['in the Coulomb gauge the scalar potential is instantaneous, yet the fields remain causal', true, 'The instantaneous parts cancel between $-\\nabla V$ and $-\\partial\\vec A/\\partial t$.'],
        ['advanced solutions are also mathematically valid solutions of Maxwell\'s equations', true, 'They are discarded on physical (causal) grounds.'],
        ['the scalar potential of a moving point charge is $q/(4\\pi\\varepsilon_0\\mathscr{r})$ with just the retarded distance $\\mathscr{r}$', false, 'It is $q/[4\\pi\\varepsilon_0\\mathscr{r}(1 - \\hat{\\mathscr{r}}\\cdot\\vec\\beta)]$; the extra factor does not cancel for a point charge.'],
        ['retarded potentials are needed only for charges moving close to the speed of light', false, 'Any time-dependent source needs them; radiation from slow charges (Larmor) comes from retardation.'],
        ['in the Coulomb gauge the electric field propagates instantaneously', false, 'Only the potential $V$ is instantaneous; $\\vec E$ is retarded.'],
      ], not);
      return { q: `Which statement about retarded potentials is ${nt(not)}?`, ...m,
        trap: 'An instantaneous potential (Coulomb gauge) does not mean instantaneous fields.' };
    } },
  { id: 'netrp-m33', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'multipole radiation', format: 'match',
    make(r) {
      const L = { e1: 'electric dipole radiation', m1: 'magnetic dipole radiation', e2: 'electric quadrupole radiation', none: 'no radiation at all' };
      const cas = choose(r, [
        ['a charge oscillating sinusoidally on a spring about a fixed opposite charge', 'e1', 'The dipole moment $\\vec p(t)$ oscillates.'],
        ['a small loop carrying an alternating current, with no net charge anywhere', 'm1', 'The magnetic moment $IA$ oscillates while $\\vec p = 0$.'],
        ['two identical dipoles side by side on a line, oscillating in antiphase', 'e2', 'The dipole moments cancel; the quadrupole moment oscillates.'],
        ['a uniformly charged ring spinning at constant angular speed', 'none', 'The charge and current distributions are steady: static fields only.'],
        ['a uniformly charged rod spinning about its midpoint', 'e2', 'Its dipole moment is zero by symmetry, but its quadrupole moment rotates.'],
        ['a spherical shell of charge pulsating radially', 'none', 'Spherical symmetry: the outside field stays $q/4\\pi\\varepsilon_0r^2$.'],
        ['an electric dipole rotating at constant angular speed in a plane', 'e1', 'Two perpendicular oscillating dipoles in quadrature; circularly polarised along the axis.'],
      ]);
      return { q: `The leading radiation from ${cas[0]} is`, ...matchOne(r, L, cas),
        trap: 'Steady currents and spherically symmetric motions do not radiate.' };
    } },
  { id: 'netrp-m34', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'synchrotron radiation', format: 'scaling',
    make(r) {
      const k = choose(r, [2, 3, 1.5, 10]);
      const show = (x) => `${+x.toPrecision(4)}`;
      const o = mcqOptions(r, k ** 4, [k ** 2, k ** 3, k, k ** 6], show);
      return { q: `An electron storage ring keeps its radius fixed while the beam energy (ultra-relativistic) is raised by a factor ${k}. The energy radiated per turn by each electron grows by a factor of about`,
        options: o.options, answer: o.answer,
        sol: `For circular motion the radiated power is $P = \\dfrac{e^2c\\gamma^4}{6\\pi\\varepsilon_0R^2}$ (with $\\beta \\approx 1$), and the time per turn $2\\pi R/c$ is fixed. So the loss per turn $\\propto \\gamma^4$: factor $${k}^4 = ${show(k ** 4)}$. This is why electron rings above about 100 GeV are impractical.`,
        trap: 'At fixed radius, the power scales as $\\gamma^4$; at fixed magnetic field (radius growing with energy) it scales as $\\gamma^2$.' };
    } },
  { id: 'netrp-m35', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'Larmor formula', format: 'order of magnitude',
    make(r) {
      const E = choose(r, [1e3, 1e5, 1e6, 1e7]), a = (1.602e-19 * E) / 9.109e-31;
      const x = (1.602e-19 ** 2 * a * a) / (6 * Math.PI * 8.854e-12 * 2.998e8 ** 3);
      const o = orderOpts(r, x, '\\text{W}');
      return { q: `An electron is accelerated (non-relativistically) by a uniform electric field of $${sci(E)}$ V/m. The power it radiates is about`,
        options: o.options, answer: o.answer,
        sol: `$a = eE/m = ${sci(a)}$ m/s$^2$. Larmor: $P = e^2a^2/(6\\pi\\varepsilon_0c^3) = ${sci(x)}$ W, utterly negligible next to the power the field supplies.`,
        trap: 'Keep $c^3 \\approx 2.7\\times10^{25}$ in the denominator: Larmor powers for ordinary accelerations are tiny.' };
    } },
];
