// Extra question shapes for boundary-value-problems (templates bvp-m31..m35). Imported by boundary-value-problems.js.
import { int, choose, mcqOptions, shuffle, round } from '../_util.js';
import { msqOf } from './_more.js';
import { oneOf, matchOne } from './_odd.js';

export default [
  { id: 'bvp-m31', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'Laplace equation', format: 'statements',
    make(r) {
      const k = int(r, 2, 4), not = r() < 0.5;
      const m = msqOf(r, [
        ['$V$ can have no local maximum or minimum inside the region', true, 'Harmonic functions obey the maximum principle; extremes lie on the boundary.'],
        ['$V$ at any point equals its average over any sphere centred there (inside the region)', true, 'The mean-value property of solutions of Laplace\'s equation.'],
        ['$V$ is fixed uniquely once its values on the whole boundary are given', true, 'First uniqueness theorem (Dirichlet problem).'],
        ['$V$ is fixed up to a constant once $\\partial V/\\partial n$ is given on the whole boundary', true, 'Neumann problem: the normal derivative fixes $V$ apart from an additive constant.'],
        [`$V = ${k}x^2$ is an allowed potential there`, false, `$\\nabla^2V = ${2 * k} \\ne 0$: it needs a uniform charge density.`],
        [`$V = ${k}(x^2 - y^2)$ is an allowed potential there`, true, `$\\nabla^2V = ${2 * k} - ${2 * k} = 0$.`],
        [`$V = ${k}(x^2 + y^2 - 2z^2)$ is an allowed potential there`, true, `$${2 * k} + ${2 * k} - ${4 * k} = 0$.`],
        [`$V = e^{${k}x}\\sin ${k}y$ is an allowed potential there`, true, `$\\nabla^2V = (${k * k} - ${k * k})V = 0$.`],
        [`$V = e^{${k}x}\\sin ${2 * k}y$ is an allowed potential there`, false, `$\\nabla^2V = (${k * k} - ${4 * k * k})V \\ne 0$.`],
        ['$V = xyz$ is an allowed potential there', true, 'Each second derivative is zero.'],
      ], { not });
      return { q: `In a region of space with no charge, the potential $V$ satisfies Laplace's equation. Which statements are ${not ? '<b>NOT</b> correct' : 'correct'}?`, ...m,
        trap: 'Check $\\nabla^2V = 0$ term by term; a single squared coordinate never works on its own.' };
    } },
  { id: 'bvp-m32', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'separation of variables', format: 'match',
    make(r) {
      const L = {
        slot: '$\\sum_n c_n\\sin(n\\pi x/a)\\,e^{-n\\pi y/a}$',
        polar: '$A_0 + B_0\\ln s + \\sum_n(A_ns^n + B_ns^{-n})(C_n\\cos n\\phi + D_n\\sin n\\phi)$',
        sph: '$\\sum_\\ell\\left(A_\\ell r^\\ell + B_\\ell r^{-\\ell-1}\\right)P_\\ell(\\cos\\theta)$',
        box: '$\\sum_{n,m}c_{nm}\\sin(n\\pi x/a)\\sin(m\\pi y/b)\\sinh(\\pi z\\sqrt{n^2/a^2 + m^2/b^2})$',
        bes: '$\\sum_n c_nJ_0(\\alpha_ns/R)\\,\\sinh(\\alpha_nz/R)$',
      };
      const cas = choose(r, [
        ['a long slot $0 \\lt x \\lt a$, $y \\gt 0$, with $V = 0$ on both sides $x = 0, a$, a given $V(x)$ on $y = 0$, and $V \\to 0$ as $y \\to \\infty$', 'slot', 'Sines vanish at $x = 0, a$; the matching $y$-dependence must decay, so only $e^{-n\\pi y/a}$ survives.'],
        ['the region between two coaxial cylinders, with $V$ depending on $s$ and $\\phi$ but not $z$', 'polar', 'Plane polar separation gives $s^{\\pm n}$ times $\\cos n\\phi$, $\\sin n\\phi$, plus the $n = 0$ pair $1$ and $\\ln s$.'],
        ['problems with azimuthal symmetry about the $z$-axis in spherical coordinates (for example a sphere with $V(\\theta)$ on its surface)', 'sph', 'Spherical separation with no $\\phi$-dependence: Legendre polynomials in $\\cos\\theta$ and powers $r^\\ell$, $r^{-\\ell - 1}$.'],
        ['a rectangular box $a\\times b\\times c$ with $V = 0$ on five faces and a given $V(x, y)$ on the top face $z = c$', 'box', 'Sines in $x$ and $y$ vanish on the side walls; $\\sinh$ vanishes on the bottom $z = 0$.'],
        ['a cylinder of radius $R$, axially symmetric, with $V = 0$ on its curved side and bottom and a given $V(s)$ on its top', 'bes', 'Radial functions that vanish at $s = R$ are $J_0(\\alpha_ns/R)$ with $\\alpha_n$ the zeros of $J_0$; $\\sinh$ vanishes at the bottom.'],
      ]);
      return { q: `The general form of the potential for ${cas[0]} is`, ...matchOne(r, L, cas),
        trap: 'Choose the functions that vanish on the boundaries where $V = 0$ and stay finite where the region extends.' };
    } },
  { id: 'bvp-m33', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'spheres in uniform fields', format: 'limiting case',
    make(r) {
      const er = choose(r, [2, 3, 4, 5, 7, 10]), E0 = choose(r, [100, 200, 300, 600]);
      const ans = round((3 * E0) / (er + 2), 1);
      const o = mcqOptions(r, ans, shuffle(r, [round(E0 / er, 1), round((3 * E0) / (2 * er + 1), 1), round((E0 * (er - 1)) / (er + 2), 1), E0, round((3 * er * E0) / (er + 2), 1)]), (v) => `$${v}$ V/m`);
      return { q: `A solid sphere of linear dielectric with $\\varepsilon_r = ${er}$ is placed in a uniform field $E_0 = ${E0}$ V/m. The field inside the sphere is uniform with magnitude`, ...o,
        sol: `Solving Laplace's equation inside ($V = Ar\\cos\\theta$) and outside ($V = -E_0r\\cos\\theta + B\\cos\\theta/r^2$) with $V$ and $\\varepsilon\\,\\partial V/\\partial r$ continuous at the surface gives $E_{\\text{in}} = \\dfrac{3E_0}{\\varepsilon_r + 2} = \\dfrac{3\\times${E0}}{${er + 2}} = ${ans}$ V/m. Limits check it: $\\varepsilon_r = 1$ gives $E_0$ (no sphere), and $\\varepsilon_r \\to \\infty$ gives 0 (a conductor).`,
        trap: 'It is not $E_0/\\varepsilon_r$ (that is a slab perpendicular to the field); a sphere gives $3E_0/(\\varepsilon_r + 2)$.' };
    } },
  { id: 'bvp-m34', type: 'mcq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'superposition', format: 'symmetry trick',
    make(r) {
      const V0 = choose(r, [12, 24, 60, 120]);
      const C = choose(r, [
        ['a long square tube (seen in cross-section: a square) with one side held at $V_0$ and the other three at 0', 4, 1, 'the centre of the square'],
        ['a long square tube with two sides held at $V_0$ and the other two at 0', 4, 2, 'the centre of the square'],
        ['a cube with one face held at $V_0$ and the other five at 0', 6, 1, 'the centre of the cube'],
        ['a cube with three faces held at $V_0$ and the other three at 0', 6, 3, 'the centre of the cube'],
        ['a long tube whose cross-section is an equilateral triangle, with one side at $V_0$ and the other two at 0', 3, 1, 'the centre of the triangle'],
      ]);
      const [txt, N, k] = C, ans = (V0 * k) / N;
      const o = mcqOptions(r, ans, shuffle(r, [V0 / 2, V0 / N, (V0 * (k + 1)) / N, V0, 0, V0 / (N + 1)].filter((v) => v !== ans)), (v) => `$${round(v, 2)}$ V`);
      return { q: `Consider ${txt}, with no charge inside and $V_0 = ${V0}$ V. The potential at ${C[3]} is`, ...o,
        sol: `Superpose ${N} copies of the problem, rotated so that each of the ${N} sides (faces) in turn is the live one. The sum has every side at $V_0$, so by uniqueness the sum is $V_0$ everywhere inside, including the centre. By symmetry each copy contributes equally at the centre: $V_0/${N}$ per live side. With ${k} live side${k === 1 ? '' : 's'} the answer is $${k}V_0/${N} = ${round(ans, 2)}$ V.`,
        trap: 'No series is needed at the centre: superposition plus symmetry gives $V_0/N$ per live face.' };
    } },
  { id: 'bvp-m35', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'boundary conditions', format: 'which is NOT',
    make(r) {
      const n = int(r, 2, 4), not = r() < 0.6;
      const m = oneOf(r, [
        ['$\\sin(\\pi x/a)\\,e^{-\\pi y/a}$', true, 'Harmonic, zero at $x = 0$ and $x = a$, decays as $y \\to \\infty$.'],
        [`$\\sin(${n}\\pi x/a)\\,e^{-${n}\\pi y/a}$`, true, 'Same structure with $n = ' + n + '$.'],
        [`$\\sin(\\pi x/a)e^{-\\pi y/a} + \\sin(${n}\\pi x/a)e^{-${n}\\pi y/a}$`, true, 'A sum of solutions is a solution (linearity).'],
        ['$\\sin(\\pi x/a)\\,e^{+\\pi y/a}$', false, 'Harmonic and zero on the sides, but it grows without bound as $y \\to \\infty$.'],
        ['$\\cos(\\pi x/a)\\,e^{-\\pi y/a}$', false, 'Harmonic, but not zero on the side $x = 0$.'],
        [`$\\sin(\\pi x/a)\\,e^{-${n}\\pi y/a}$`, false, `Not harmonic: $\\nabla^2 = (-\\pi^2 + ${n * n}\\pi^2)/a^2 \\ne 0$ times the function.`],
        ['$\\sin(\\pi x/a)\\,\\sin(\\pi y/a)$', false, 'Not harmonic: both second derivatives are negative, giving $-2\\pi^2/a^2$ times the function.'],
      ], not);
      return { q: `In the slot $0 \\lt x \\lt a$, $y \\gt 0$, a potential must satisfy Laplace's equation, vanish on the sides $x = 0$ and $x = a$, and tend to 0 as $y \\to \\infty$. Which function ${not ? '<b>fails</b> these conditions' : 'satisfies all of them'}?`, ...m,
        trap: 'Check three things separately: Laplace\'s equation, the side conditions and the behaviour far away.' };
    } },
];
